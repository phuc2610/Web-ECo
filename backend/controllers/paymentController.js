import orderModel from "../models/orderModel.js";
import { userModel } from "../models/userModel.js";
import sepayTransactionModel from "../models/sepayTransactionModel.js";
import couponModel from "../models/couponModel.js";

// Lấy thông tin ngân hàng từ biến môi trường hoặc cấu hình mặc định
const getBankConfig = () => ({
  bankName: process.env.BANK_NAME || "MBBank",
  bankBin: process.env.BANK_BIN || "970422",
  accountNumber: process.env.BANK_ACCOUNT_NUMBER || "0907253168",
  accountName: process.env.BANK_ACCOUNT_NAME || "MINH TUAN SHOP",
  apiKey: process.env.SEPAY_API_KEY || "sepay_demo_key_minhtuan"
});

// Sinh mã đơn hàng duy nhất format MTxxxxxx (6 chữ số)
const generateOrderCode = () => {
  const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
  return `MT${randomSixDigits}`;
};

/**
 * Tạo đơn hàng thanh toán Chuyển khoản Ngân hàng (VietQR tự động)
 */
export const createVietQROrder = async (req, res) => {
  try {
    const { items, amount, address, voucherCode, discountAmount } = req.body;
    const userId = req.userId;
    const bankConfig = getBankConfig();

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Không có sản phẩm trong đơn hàng" });
    }

    // Sinh mã đơn hàng dạng MTxxxxxx đảm bảo không trùng
    let orderCode = generateOrderCode();
    let existingOrder = await orderModel.findOne({ orderCode });
    let attempts = 0;
    while (existingOrder && attempts < 5) {
      orderCode = generateOrderCode();
      existingOrder = await orderModel.findOne({ orderCode });
      attempts++;
    }

    const phone = (address && address.phone) ? address.phone.replace(/\s+/g, "") : "";
    const finalAmount = Math.round(amount);

    const orderData = {
      userId,
      items,
      address,
      amount: finalAmount,
      originalAmount: amount + (discountAmount || 0),
      voucherCode: voucherCode || "",
      discountAmount: discountAmount || 0,
      paymentMethod: "Chuyển khoản VietQR",
      payment: false,
      status: "Đã đặt hàng",
      orderCode,
      date: new Date()
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Làm trống giỏ hàng sau khi tạo đơn
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Cập nhật lượt dùng coupon nếu có
    if (voucherCode) {
      await couponModel.findOneAndUpdate(
        { code: voucherCode.toUpperCase() },
        { $inc: { usedCount: 1 } }
      );
    }

    // Tạo URL VietQR chuẩn: https://img.vietqr.io/image/<BANK_BIN>-<ACCOUNT_NUMBER>-compact2.png?amount=<AMOUNT>&addInfo=<ORDER_CODE>%20<PHONE>&accountName=<ACCOUNT_NAME>
    const transferContent = `${orderCode} ${phone}`.trim();
    const qrUrl = `https://img.vietqr.io/image/${bankConfig.bankBin}-${bankConfig.accountNumber}-compact2.png?amount=${finalAmount}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(bankConfig.accountName)}`;

    return res.json({
      success: true,
      message: "Tạo đơn hàng VietQR thành công",
      orderId: newOrder._id,
      orderCode,
      amount: finalAmount,
      transferContent,
      qrUrl,
      bankInfo: {
        bankName: bankConfig.bankName,
        bankBin: bankConfig.bankBin,
        accountNumber: bankConfig.accountNumber,
        accountName: bankConfig.accountName
      }
    });
  } catch (error) {
    console.error("Lỗi tạo đơn VietQR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Lấy trạng thái thanh toán của đơn hàng (dùng cho Frontend Polling mỗi 3s)
 */
export const getOrderPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    const bankConfig = getBankConfig();
    const phone = (order.address && order.address.phone) ? order.address.phone.replace(/\s+/g, "") : "";
    const transferContent = `${order.orderCode} ${phone}`.trim();
    const qrUrl = `https://img.vietqr.io/image/${bankConfig.bankBin}-${bankConfig.accountNumber}-compact2.png?amount=${order.amount}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(bankConfig.accountName)}`;

    return res.json({
      success: true,
      orderId: order._id,
      orderCode: order.orderCode,
      amount: order.amount,
      payment: order.payment,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentDetails: order.paymentDetails || {},
      transferContent,
      qrUrl,
      bankInfo: {
        bankName: bankConfig.bankName,
        bankBin: bankConfig.bankBin,
        accountNumber: bankConfig.accountNumber,
        accountName: bankConfig.accountName
      }
    });
  } catch (error) {
    console.error("Lỗi kiểm tra trạng thái đơn:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Webhook nhận biến động số dư ngân hàng từ SePay
 * Chuẩn SePay:
 * - Header: Authorization: Apikey YOUR_API_KEY
 * - HTTP Status 200/201 + JSON {"success": true} trong <= 30 giây
 */
export const sepayWebhook = async (req, res) => {
  try {
    const bankConfig = getBankConfig();
    const authHeader = req.headers["authorization"] || req.headers["Authorization"] || "";

    // Kiểm tra API Key nếu cấu hình SEPAY_API_KEY
    if (bankConfig.apiKey && bankConfig.apiKey !== "sepay_demo_key_minhtuan") {
      const expectedAuth = `Apikey ${bankConfig.apiKey}`;
      if (authHeader !== expectedAuth) {
        console.warn("⚠️ SePay Webhook: Xác thực thất bại với header:", authHeader);
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
    }

    const payload = req.body;
    console.log("📥 SePay Webhook nhận payload:", JSON.stringify(payload));

    const {
      id,
      gateway,
      transactionDate,
      accountNumber,
      subAccount,
      code,
      content,
      transferType,
      description,
      transferAmount,
      referenceCode,
      accumulated
    } = payload;

    // Bắt buộc phải có id giao dịch SePay
    if (!id) {
      return res.status(400).json({ success: false, message: "Thiếu transaction id" });
    }

    // 1. Kiểm tra chống trùng lặp (Idempotency)
    const existingTx = await sepayTransactionModel.findOne({ sepayId: id });
    if (existingTx) {
      console.log(`ℹ️ Giao dịch SePay #${id} đã được xử lý trước đó.`);
      return res.status(200).json({ success: true, message: "Already processed" });
    }

    // 2. Chỉ xử lý khi là giao dịch tiền vào ("in")
    if (transferType !== "in") {
      await sepayTransactionModel.create({
        sepayId: id,
        gateway,
        transactionDate,
        accountNumber,
        subAccount,
        code,
        content,
        transferType,
        description,
        transferAmount: transferAmount || 0,
        referenceCode,
        accumulated: accumulated || 0,
        rawBody: payload
      });
      return res.status(200).json({ success: true });
    }

    // 3. Trích xuất mã đơn hàng từ nội dung chuyển khoản (Regex MT\d{6})
    let matchedOrderCode = null;
    if (code) {
      const codeMatch = String(code).toUpperCase().match(/MT\d{6}/);
      if (codeMatch) matchedOrderCode = codeMatch[0];
    }

    if (!matchedOrderCode && content) {
      const contentMatch = String(content).toUpperCase().match(/MT\d{6}/);
      if (contentMatch) matchedOrderCode = contentMatch[0];
    }

    let matchedOrder = null;
    if (matchedOrderCode) {
      matchedOrder = await orderModel.findOne({ orderCode: matchedOrderCode });
    }

    // 4. Khớp đơn và kiểm tra số tiền
    let orderMatchedAndPaid = false;
    if (matchedOrder) {
      const isAmountSufficient = Number(transferAmount) >= Number(matchedOrder.amount);
      if (isAmountSufficient) {
        matchedOrder.payment = true;
        matchedOrder.status = "Đã thanh toán";
        matchedOrder.paymentDetails = {
          gateway: gateway || "VietQR/SePay",
          transactionDate,
          transferAmount,
          referenceCode,
          sepayId: id,
          paidAt: new Date()
        };
        await matchedOrder.save();

        // Xóa giỏ hàng của khách hàng nếu còn tồn tại
        if (matchedOrder.userId) {
          await userModel.findByIdAndUpdate(matchedOrder.userId, { cartData: {} });
        }

        orderMatchedAndPaid = true;
        console.log(`✅ Khớp thành công & Đã cập nhật thanh toán đơn hàng ${matchedOrderCode} (${matchedOrder._id})`);
      } else {
        console.warn(`⚠️ Đơn hàng ${matchedOrderCode} cần ${matchedOrder.amount}đ nhưng chỉ chuyển ${transferAmount}đ`);
      }
    } else {
      console.log(`ℹ️ Không tìm thấy đơn hàng tương ứng với mã trong nội dung: "${content}"`);
    }

    // 5. Lưu giao dịch vào cơ sở dữ liệu
    await sepayTransactionModel.create({
      sepayId: id,
      gateway,
      transactionDate,
      accountNumber,
      subAccount,
      code,
      content,
      transferType,
      description,
      transferAmount: transferAmount || 0,
      referenceCode,
      accumulated: accumulated || 0,
      orderCode: matchedOrderCode || "",
      orderId: matchedOrder ? matchedOrder._id : null,
      rawBody: payload
    });

    // 6. Phản hồi HTTP 200 với {"success": true} chuẩn SePay
    return res.status(200).json({
      success: true,
      message: orderMatchedAndPaid ? "Payment confirmed" : "Transaction recorded"
    });
  } catch (error) {
    console.error("❌ Lỗi xử lý SePay Webhook:", error);
    // Vẫn trả về 200 nếu là lỗi nội bộ không nghiêm trọng để tránh retry bão mạng, hoặc trả 500
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Chế độ mô phỏng thanh toán (Test Mode / Demo)
 * Giúp người dùng kiểm tra luồng auto-confirmation ngay trên UI mà không cần tài khoản ngân hàng thật
 */
export const simulatePayment = async (req, res) => {
  try {
    const { orderCode, orderId } = req.body;

    let order;
    if (orderId) {
      order = await orderModel.findById(orderId);
    } else if (orderCode) {
      order = await orderModel.findOne({ orderCode: orderCode.toUpperCase() });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    if (order.payment) {
      return res.json({ success: true, message: "Đơn hàng đã được thanh toán trước đó" });
    }

    // Tạo payload giả lập giống hệt SePay gửi về
    const simulatedSepayId = Date.now();
    const fakeReferenceCode = `FT${Math.floor(10000000000000 + Math.random() * 90000000000000)}`;
    const nowStr = new Date().toISOString().replace("T", " ").slice(0, 19);

    const bankConfig = getBankConfig();

    order.payment = true;
    order.status = "Đã thanh toán";
    order.paymentDetails = {
      gateway: bankConfig.bankName,
      transactionDate: nowStr,
      transferAmount: order.amount,
      referenceCode: fakeReferenceCode,
      sepayId: simulatedSepayId,
      paidAt: new Date(),
      isSimulated: true
    };
    await order.save();

    // Làm trống giỏ hàng user
    if (order.userId) {
      await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
    }

    // Ghi nhận vào sepayTransactionModel
    await sepayTransactionModel.create({
      sepayId: simulatedSepayId,
      gateway: bankConfig.bankName,
      transactionDate: nowStr,
      accountNumber: bankConfig.accountNumber,
      content: `SIMULATED ${order.orderCode} ${order.address?.phone || ""}`,
      transferType: "in",
      description: `Test payment for order ${order.orderCode}`,
      transferAmount: order.amount,
      referenceCode: fakeReferenceCode,
      orderCode: order.orderCode,
      orderId: order._id,
      rawBody: { simulated: true, timestamp: Date.now() }
    });

    console.log(`🧪 [TEST MODE] Đã giả lập thanh toán thành công cho đơn hàng: ${order.orderCode}`);

    return res.json({
      success: true,
      message: `Mô phỏng thanh toán thành công đơn hàng ${order.orderCode}!`,
      orderId: order._id,
      orderCode: order.orderCode,
      paidAmount: order.amount
    });
  } catch (error) {
    console.error("Lỗi mô phỏng thanh toán:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Khách hàng ấn xác nhận đã chuyển khoản
 * Chuyển đơn hàng vào trạng thái chờ duyệt bằng tay (như COD)
 */
export const confirmCustomerTransfer = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    // Đặt vào trạng thái chờ duyệt (như COD)
    order.status = "Đã đặt hàng";
    order.paymentDetails = {
      ...(order.paymentDetails || {}),
      customerConfirmed: true,
      confirmedAt: new Date(),
      note: "Khách hàng đã quét mã và bấm xác nhận chuyển khoản. Chờ Admin kiểm tra và duyệt bằng tay."
    };

    await order.save();

    // Làm trống giỏ hàng nếu còn
    if (order.userId) {
      await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
    }

    return res.json({
      success: true,
      message: "Đã ghi nhận xác nhận chuyển khoản! Đơn hàng đang ở trạng thái chờ duyệt như COD.",
      order
    });
  } catch (error) {
    console.error("Lỗi xác nhận chuyển khoản:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Lấy cấu hình thông tin ngân hàng công khai
 */
export const getBankInfo = async (req, res) => {
  const bankConfig = getBankConfig();
  return res.json({
    success: true,
    bankInfo: {
      bankName: bankConfig.bankName,
      bankBin: bankConfig.bankBin,
      accountNumber: bankConfig.accountNumber,
      accountName: bankConfig.accountName
    }
  });
};
