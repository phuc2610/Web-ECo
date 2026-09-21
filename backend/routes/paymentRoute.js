import express from "express";
import { auth } from "../middleware/auth.js";
import {
  createVietQROrder,
  getOrderPaymentStatus,
  sepayWebhook,
  simulatePayment,
  getBankInfo
} from "../controllers/paymentController.js";

const paymentRouter = express.Router();

// Tạo đơn hàng thanh toán VietQR (Cần đăng nhập)
paymentRouter.post("/create-qr-order", auth, createVietQROrder);

// Lấy trạng thái thanh toán đơn hàng (Polling từ frontend)
paymentRouter.get("/order-status/:orderId", getOrderPaymentStatus);

// Lấy thông tin tài khoản ngân hàng cấu hình
paymentRouter.get("/bank-info", getBankInfo);

// Webhook SePay nhận thông báo biến động số dư (Không cần JWT auth của user)
paymentRouter.post("/sepay-webhook", sepayWebhook);

// API mô phỏng thanh toán nhanh cho môi trường test/demo
paymentRouter.post("/simulate", simulatePayment);

export default paymentRouter;
