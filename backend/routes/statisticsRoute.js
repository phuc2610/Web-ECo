import express from "express";
import {
  getOverallStats,
  getRevenueStats,
  getTopProducts,
  getOrderStats,
  getProductStats,
} from "../controllers/statisticsController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const statisticsRouter = express.Router();

// Route thống kê tổng quan
statisticsRouter.get("/overview", adminAuth, getOverallStats);

// Route thống kê doanh thu
statisticsRouter.get("/revenue", adminAuth, getRevenueStats);

// Route thống kê sản phẩm bán chạy
statisticsRouter.get("/top-products", adminAuth, getTopProducts);

// Route thống kê đơn hàng
statisticsRouter.get("/orders", adminAuth, getOrderStats);

// Route thống kê sản phẩm
statisticsRouter.get("/products", adminAuth, getProductStats);

export default statisticsRouter;
