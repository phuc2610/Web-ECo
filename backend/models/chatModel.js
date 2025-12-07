import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'admin'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'product_link'],
    default: 'text'
  },
  productLink: {
    type: String,
    default: null
  },
  imageUrl: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  }
});

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'pending'],
    default: 'active'
  },
  lastMessage: {
    type: Date,
    default: Date.now
  },
  unreadCount: {
    type: Number,
    default: 0
  },
  messages: [messageSchema],
  adminNotes: {
    type: String,
    default: ''
  },
  followUpEmail: {
    type: Boolean,
    default: false
  },
  followUpContent: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index để tìm kiếm nhanh
chatSchema.index({ userId: 1, status: 1 });
chatSchema.index({ lastMessage: -1 });

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
