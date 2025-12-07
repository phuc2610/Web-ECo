import orderModel from "../models/orderModel.js";
import { userModel } from "../models/userModel.js";
import productModel from "../models/productModel.js";
import couponModel from "../models/couponModel.js";
import Stripe from "stripe";

// global variables
const currency = "usd";
const deliveryCharge = 30000;

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing orders using COD Method
const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;
    
    // Kiểm tra xem đây có phải là đơn hàng đầu tiên của user không
    const existingOrders = await orderModel.find({ userId });
    const isFirstOrder = existingOrders.length === 0;
    
    let finalAmount = amount;
    let voucherCode = null;
    
    // Nếu là đơn hàng đầu tiên, tạo voucher 10%
    if (isFirstOrder) {
      // Tạo mã voucher ngẫu nhiên
      voucherCode = `WELCOME${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
      
      // Tính toán giảm giá (10% tối đa 10% giá trị đơn hàng)
      const discountAmount = Math.min(amount * 0.1, amount * 0.1); // 10% tối đa
      finalAmount = amount - discountAmount;
      
      // Tạo voucher trong database
      const voucherData = {
        code: voucherCode,
        description: "Voucher chào mừng - Giảm 10% cho đơn hàng đầu tiên",
        discountType: "percentage",
        discountValue: 10,
        minOrderValue: 0,
        maxDiscount: amount * 0.1, // Tối đa 10% giá trị đơn hàng
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 ngày
        usageLimit: 1,
        usedCount: 1, // Đã sử dụng
        isActive: false // Voucher đã được sử dụng
      };
      
      await couponModel.create(voucherData);
    }
    
    const orderData = {
      userId,
      items,
      address,
      amount: finalAmount,
      originalAmount: amount, // Lưu giá gốc
      voucherCode: voucherCode,
      discountAmount: isFirstOrder ? amount * 0.1 : 0,
      paymentMethod: "COD",
      payment: false,
      status: "Đã đặt hàng",
      date: new Date()
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Cập nhật giỏ hàng của user
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const responseMessage = isFirstOrder 
      ? `Đã đặt hàng thành công! Bạn đã được giảm 10% cho đơn hàng đầu tiên. Mã voucher: ${voucherCode}`
      : "Đã đặt hàng thành công!";

    res.json({ 
      success: true, 
      message: responseMessage,
      isFirstOrder: isFirstOrder,
      discountAmount: isFirstOrder ? amount * 0.1 : 0,
      finalAmount: finalAmount
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Placing orders using Stripe Payment
const placeOrderStripe = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;
    const { origin } = req.headers;

    // Kiểm tra xem đây có phải là đơn hàng đầu tiên của user không
    const existingOrders = await orderModel.find({ userId });
    const isFirstOrder = existingOrders.length === 0;
    
    let finalAmount = amount;
    let voucherCode = null;
    
    // Nếu là đơn hàng đầu tiên, tạo voucher 10%
    if (isFirstOrder) {
      // Tạo mã voucher ngẫu nhiên
      voucherCode = `WELCOME${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
      
      // Tính toán giảm giá (10% tối đa 10% giá trị đơn hàng)
      const discountAmount = Math.min(amount * 0.1, amount * 0.1); // 10% tối đa
      finalAmount = amount - discountAmount;
      
      // Tạo voucher trong database
      const voucherData = {
        code: voucherCode,
        description: "Voucher chào mừng - Giảm 10% cho đơn hàng đầu tiên",
        discountType: "percentage",
        discountValue: 10,
        minOrderValue: 0,
        maxDiscount: amount * 0.1, // Tối đa 10% giá trị đơn hàng
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 ngày
        usageLimit: 1,
        usedCount: 1, // Đã sử dụng
        isActive: false // Voucher đã được sử dụng
      };
      
      await couponModel.create(voucherData);
    }

    const orderData = {
      userId,
      items,
      address,
      amount: finalAmount,
      originalAmount: amount, // Lưu giá gốc
      voucherCode: voucherCode,
      discountAmount: isFirstOrder ? amount * 0.1 : 0,
      paymentMethod: "Stripe",
      payment: false,
      status: "Đã đặt hàng",
      date: new Date()
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const VND_TO_USD = 27110; // tỷ giá mẫu, thay bằng tỷ giá thực tế
    
    // Tính toán giá trị từng item sau khi giảm giá
    const totalItemsValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountRatio = isFirstOrder ? (finalAmount / totalItemsValue) : 1;
    
    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(((item.price * discountRatio) / VND_TO_USD) * 100),
      },
      quantity: item.quantity,
    }));

    // Thêm phí giao hàng nếu cần
    if (deliveryCharge > 0) {
      line_items.push({
        price_data: {
          currency: currency,
          product_data: {
            name: "Phí giao hàng",
          },
          unit_amount: Math.round((deliveryCharge / VND_TO_USD) * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Verify Stripe payment
const verifyStripe = async (req, res) => {
  const { orderId, success } = req.body;
  const userId = req.userId;
  
  try {
    if (success === "true") {
      // Cập nhật trạng thái đơn hàng thành "Đã thanh toán"
      await orderModel.findByIdAndUpdate(orderId, { 
        payment: true,
        status: "Đã thanh toán"
      });
      
      // Cập nhật giỏ hàng của user
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      
      res.json({ success: true, message: "Thanh toán thành công!" });
    } else {
      // Nếu thanh toán thất bại, xóa đơn hàng
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Thanh toán thất bại" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get all orders (Admin)
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find().populate('userId', 'name email');
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get user orders
const userOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update order status (Admin)
const updateStatus = async (req, res) => {
  try {
    const { orderId, status, cancelReason } = req.body;
    
    // Kiểm tra trạng thái hợp lệ
    const validStatuses = ["Đã đặt hàng", "Đang đóng gói", "Đang giao hàng", "Đã giao hàng", "Đã hủy", "Đang xử lý"];
    if (!validStatuses.includes(status)) {
      return res.json({ success: false, message: "Trạng thái không hợp lệ" });
    }
    
    const updateData = { status };
    
    // Nếu trạng thái là "Đã giao hàng", đánh dấu đã thanh toán
    if (status === "Đã giao hàng") {
      updateData.payment = true;
    }
    
    // Nếu trạng thái là "Đã hủy" và có lý do hủy, lưu lý do
    if (status === "Đã hủy" && cancelReason) {
      updateData.cancelReason = cancelReason;
    }
    
    await orderModel.findByIdAndUpdate(orderId, updateData);
    res.json({ success: true, message: "Trạng thái đã cập nhật" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete order from Admin page
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    // Lấy thông tin đơn hàng hiện tại
    const currentOrder = await orderModel.findById(orderId);
    if (!currentOrder) {
      return res.json({ success: false, message: "Không tìm thấy đơn hàng" });
    }
    
    // Hoàn trả số lượng tồn kho nếu đơn hàng đã được xử lý (không phải "Đã đặt hàng")
    if (currentOrder.status !== "Đã đặt hàng") {
      for (const item of currentOrder.items) {
        const product = await productModel.findById(item._id);
        if (product && product.stockQuantities && product.stockQuantities[item.size]) {
          const currentStock = product.stockQuantities[item.size];
          const newStock = currentStock + item.quantity;
          
          // Cập nhật số lượng tồn kho
          await productModel.findByIdAndUpdate(item._id, {
            [`stockQuantities.${item.size}`]: newStock
          });
        }
      }
    }
    
    // Xóa đơn hàng
    await orderModel.findByIdAndDelete(orderId);
    res.json({ success: true, message: "Đã xóa đơn hàng thành công" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Cancel order by user
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.userId;
    
    // Tìm đơn hàng
    const order = await orderModel.findOne({ _id: orderId, userId });
    if (!order) {
      return res.json({ success: false, message: "Không tìm thấy đơn hàng" });
    }
    
    // Kiểm tra trạng thái - chỉ cho phép hủy khi "Đã đặt hàng"
    if (order.status !== "Đã đặt hàng") {
      return res.json({ 
        success: false, 
        message: "Chỉ có thể hủy đơn hàng khi trạng thái là 'Đã đặt hàng'" 
      });
    }
    
    // Cập nhật trạng thái thành "Đã hủy"
    await orderModel.findByIdAndUpdate(orderId, { 
      status: "Đã hủy",
      cancelReason: "Người dùng hủy đơn hàng"
    });
    
    res.json({ success: true, message: "Đã hủy đơn hàng thành công" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  verifyStripe,
  placeOrder,
  placeOrderStripe,
  allOrders,
  userOrders,
  updateStatus,
  deleteOrder,
  cancelOrder,
};
