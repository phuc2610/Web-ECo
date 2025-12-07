import express from 'express';
import { auth } from '../middleware/auth.js';
import { adminAuth } from '../middleware/adminAuth.js';
import {
  createOrOpenChat,
  sendUserMessage,
  sendAdminMessage,
  getAdminChats,
  getChatMessages,
  markAsRead,
  sendFollowUpEmail,
  closeChat
} from '../controllers/chatController.js';

const chatRouter = express.Router();

// Routes cho user (cần đăng nhập)
chatRouter.post('/create', auth, createOrOpenChat);
chatRouter.post('/send-user-message', auth, sendUserMessage);
chatRouter.get('/messages/:chatId', auth, getChatMessages);

// Routes cho admin (cần quyền admin)
chatRouter.post('/send-admin-message', adminAuth, sendAdminMessage);
chatRouter.get('/admin/chats', adminAuth, getAdminChats);
chatRouter.put('/mark-read/:chatId', adminAuth, markAsRead);
chatRouter.post('/follow-up-email', adminAuth, sendFollowUpEmail);
chatRouter.put('/close/:chatId', adminAuth, closeChat);

export default chatRouter;
