import express from 'express';
import { placeOrder , placeOrderStripe , allOrders , userOrders , updateStatus, verifyStripe, deleteOrder, cancelOrder} from '../controllers/orderController.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { auth as authUser } from '../middleware/auth.js';

const orderRouter = express.Router();

// Admin Features
orderRouter.post('/list', adminAuth ,allOrders);
orderRouter.post('/status', adminAuth ,updateStatus);
orderRouter.post('/delete', adminAuth ,deleteOrder);

// payment features
orderRouter.post('/place',authUser,placeOrder);
orderRouter.post('/stripe',authUser,placeOrderStripe);

// User Feature
orderRouter.post('/userorders',authUser,userOrders);
orderRouter.post('/cancel',authUser,cancelOrder);

// verify payment
orderRouter.post('/verifyStripe',authUser , verifyStripe)

export default orderRouter;

