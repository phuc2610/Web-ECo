import Chat from '../models/chatModel.js';
import { userModel as User } from '../models/userModel.js';
import nodemailer from 'nodemailer';

// Tạo hoặc mở chat session
export const createOrOpenChat = async (req, res) => {
  try {
    // Lấy userId từ auth middleware thay vì req.body
    const userId = req.userId;
    
    // Kiểm tra user có tồn tại không
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User không tồn tại' });
    }

    // Tìm chat session đang active
    let chat = await Chat.findOne({ 
      userId: userId, 
      status: 'active' 
    });

    // Nếu không có chat active, tạo mới
    if (!chat) {
      chat = new Chat({
        userId: userId,
        userName: user.name,
        userEmail: user.email,
        messages: [{
          sender: 'admin',
          content: 'Xin chào! Tôi có thể giúp gì cho bạn?',
          messageType: 'text'
        }]
      });
      await chat.save();
    }

    res.status(200).json({
      success: true,
      chat: chat
    });
  } catch (error) {
    console.error('Error creating/opening chat:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Gửi tin nhắn từ user
export const sendUserMessage = async (req, res) => {
  try {
    const { chatId, content, messageType = 'text', productLink = null, imageUrl = null } = req.body;
    
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat không tồn tại' });
    }

    // Thêm tin nhắn mới
    const newMessage = {
      sender: 'user',
      content,
      messageType,
      productLink,
      imageUrl,
      timestamp: new Date()
    };

    chat.messages.push(newMessage);
    chat.lastMessage = new Date();
    chat.unreadCount += 1;
    await chat.save();

    res.status(200).json({
      success: true,
      message: newMessage
    });
  } catch (error) {
    console.error('Error sending user message:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Gửi tin nhắn từ admin
export const sendAdminMessage = async (req, res) => {
  try {
    const { chatId, content, messageType = 'text', productLink = null, imageUrl = null } = req.body;
    
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat không tồn tại' });
    }

    // Thêm tin nhắn mới
    const newMessage = {
      sender: 'admin',
      content,
      messageType,
      productLink,
      imageUrl,
      timestamp: new Date()
    };

    chat.messages.push(newMessage);
    chat.lastMessage = new Date();
    chat.unreadCount = 0; // Reset unread count khi admin trả lời
    await chat.save();

    res.status(200).json({
      success: true,
      message: newMessage
    });
  } catch (error) {
    console.error('Error sending admin message:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Lấy danh sách chat cho admin
export const getAdminChats = async (req, res) => {
  try {
    console.log('getAdminChats called');
    
    // Lấy tất cả chat, không populate để tránh lỗi
    const chats = await Chat.find()
      .sort({ lastMessage: -1 });
    
    console.log('Found chats:', chats.length);

    // Format response để hiển thị thông tin user
    const formattedChats = chats.map(chat => ({
      _id: chat._id,
      userId: chat.userId,
      userName: chat.userName,
      userEmail: chat.userEmail,
      status: chat.status,
      lastMessage: chat.lastMessage,
      unreadCount: chat.unreadCount,
      messages: chat.messages,
      adminNotes: chat.adminNotes,
      followUpEmail: chat.followUpEmail,
      followUpContent: chat.followUpContent,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt
    }));

    res.status(200).json({
      success: true,
      chats: formattedChats
    });
  } catch (error) {
    console.error('Error getting admin chats:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Lấy tin nhắn của một chat
export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat không tồn tại' });
    }

    res.status(200).json({
      success: true,
      messages: chat.messages
    });
  } catch (error) {
    console.error('Error getting chat messages:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Đánh dấu tin nhắn đã đọc
export const markAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat không tồn tại' });
    }

    chat.unreadCount = 0;
    await chat.save();

    res.status(200).json({
      success: true,
      message: 'Đã đánh dấu đã đọc'
    });
  } catch (error) {
    console.error('Error marking as read:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Gửi follow-up email
export const sendFollowUpEmail = async (req, res) => {
  try {
    const { chatId, emailContent } = req.body;
    
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat không tồn tại' });
    }

    // Kiểm tra email config
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      // Nếu không có email config, chỉ lưu vào database
      chat.followUpEmail = true;
      chat.followUpContent = emailContent;
      await chat.save();

      return res.status(200).json({
        success: true,
        message: 'Nội dung email đã được lưu. Vui lòng cấu hình email để gửi thực tế.',
        saved: true
      });
    }

    // Cấu hình email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: chat.userEmail,
      subject: 'Tư vấn từ NP Computer',
      html: emailContent
    };

    await transporter.sendMail(mailOptions);

    // Cập nhật trạng thái follow-up
    chat.followUpEmail = true;
    chat.followUpContent = emailContent;
    await chat.save();

    res.status(200).json({
      success: true,
      message: 'Email đã được gửi thành công'
    });
  } catch (error) {
    console.error('Error sending follow-up email:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Đóng chat session
export const closeChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat không tồn tại' });
    }

    chat.status = 'closed';
    await chat.save();

    res.status(200).json({
      success: true,
      message: 'Chat đã được đóng'
    });
  } catch (error) {
    console.error('Error closing chat:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
