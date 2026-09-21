import express from 'express';
import {
  validateCoupon,
  listCoupons,
  createCoupon,
  deleteCoupon,
  toggleCouponStatus
} from '../controllers/couponController.js';
import { adminAuth } from '../middleware/adminAuth.js';

const couponRouter = express.Router();

// Public / Customer routes
couponRouter.post('/validate', validateCoupon);
couponRouter.get('/list', listCoupons);

// Admin routes
couponRouter.post('/create', adminAuth, createCoupon);
couponRouter.post('/delete', adminAuth, deleteCoupon);
couponRouter.post('/toggle', adminAuth, toggleCouponStatus);

export default couponRouter;
