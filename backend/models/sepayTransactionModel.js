import mongoose from "mongoose";

const sepayTransactionSchema = new mongoose.Schema(
  {
    sepayId: { type: Number, unique: true, required: true }, // ID giao dịch SePay duy nhất chống trùng
    gateway: { type: String, default: "" }, // Tên ngân hàng: MBBank, Vietcombank...
    transactionDate: { type: String, default: "" }, // Format YYYY-MM-DD HH:mm:ss
    accountNumber: { type: String, default: "" }, // Số tài khoản ngân hàng nhận tiền
    subAccount: { type: String, default: null },
    code: { type: String, default: null }, // Mã thanh toán SePay bóc tách
    content: { type: String, default: "" }, // Nội dung chuyển khoản gốc
    transferType: { type: String, default: "in" }, // in / out
    description: { type: String, default: "" },
    transferAmount: { type: Number, required: true }, // Số tiền VND
    referenceCode: { type: String, default: "" }, // Mã tham chiếu FT từ ngân hàng
    accumulated: { type: Number, default: 0 },
    orderCode: { type: String, default: "" }, // Mã đơn hàng khớp (VD: MT123456)
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "order" },
    rawBody: { type: Object, default: {} } // Lưu payload gốc
  },
  { timestamps: true }
);

const sepayTransactionModel =
  mongoose.models.sepayTransaction ||
  mongoose.model("sepayTransaction", sepayTransactionSchema);

export default sepayTransactionModel;
