import express from "express";
import {
  trackProductView,
  trackSearchKeyword,
  getPersonalizedRecommendations,
  getAdminCustomerInsights,
} from "../controllers/analyticsController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const analyticsRouter = express.Router();

// Tracking công khai từ phía khách hàng
analyticsRouter.post("/track-view", trackProductView);
analyticsRouter.post("/track-search", trackSearchKeyword);
analyticsRouter.get("/recommendations", getPersonalizedRecommendations);

// Phân tích bảo mật cho quản trị viên Admin
analyticsRouter.get("/customer-insights", adminAuth, getAdminCustomerInsights);

export default analyticsRouter;
