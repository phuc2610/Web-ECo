import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CustomerSupport = ({ token }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [followUpEmail, setFollowUpEmail] = useState('');
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  // Lấy danh sách chat
  const fetchChats = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/chat/admin/chats`, {
        headers: { token }
      });

      if (response.data.success) {
        setChats(response.data.chats);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast.error('Không thể tải danh sách chat');
    }
  };

  // Lấy tin nhắn mới của chat đang chọn
  const fetchSelectedChatMessages = async () => {
    if (!selectedChat) return;
    
    try {
      const response = await axios.get(`${backendUrl}/api/chat/messages/${selectedChat._id}`, {
        headers: { token }
      });
      
      if (response.data.success) {
        // Cập nhật tin nhắn trong selectedChat
        setSelectedChat(prev => ({
          ...prev,
          messages: response.data.messages
        }));
        
        // Cập nhật tin nhắn trong danh sách chat
        setChats(prev => prev.map(chat => 
          chat._id === selectedChat._id 
            ? { ...chat, messages: response.data.messages }
            : chat
        ));
      }
    } catch (error) {
      console.error('Error fetching selected chat messages:', error);
    }
  };

  // Real-time updates - Polling mỗi 5 giây
  useEffect(() => {
    const interval = setInterval(() => {
      fetchChats();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Real-time updates cho tin nhắn của chat đang chọn - Polling mỗi 3 giây
  useEffect(() => {
    if (selectedChat) {
      const interval = setInterval(() => {
        fetchSelectedChatMessages();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [selectedChat]);

  // Load chats khi component mount
  useEffect(() => {
    fetchChats();
  }, []);

  // Gửi tin nhắn từ admin
  const sendAdminMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const messageData = {
        chatId: selectedChat._id,
        content: newMessage.trim(),
        messageType: 'text'
      };

      const response = await axios.post(`${backendUrl}/api/chat/send-admin-message`, messageData, {
        headers: { token }
      });

      if (response.data.success) {
        // Cập nhật chat hiện tại
        setSelectedChat(prev => ({
          ...prev,
          messages: [...prev.messages, response.data.message],
          unreadCount: 0
        }));

        // Cập nhật danh sách chat
        setChats(prev => prev.map(chat => 
          chat._id === selectedChat._id 
            ? { ...chat, messages: [...chat.messages, response.data.message], unreadCount: 0 }
            : chat
        ));

        setNewMessage('');
        toast.success('Tin nhắn đã được gửi');
        
        // Cập nhật ngay lập tức để đảm bảo real-time
        setTimeout(() => {
          fetchSelectedChatMessages();
        }, 100);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Không thể gửi tin nhắn');
    }
  };

  // Gửi follow-up email
  const sendFollowUpEmail = async () => {
    if (!followUpEmail.trim() || !selectedChat) return;

    try {
      const emailData = {
        chatId: selectedChat._id,
        emailContent: followUpEmail.trim()
      };

      const response = await axios.post(`${backendUrl}/api/chat/follow-up-email`, emailData, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success('Email đã được gửi thành công');
        setShowFollowUpModal(false);
        setFollowUpEmail('');
      }
    } catch (error) {
      console.error('Error sending follow-up email:', error);
      toast.error('Không thể gửi email');
    }
  };

  // Đóng chat
  const closeChat = async (chatId) => {
    try {
      const response = await axios.put(`${backendUrl}/api/chat/close/${chatId}`, {}, {
        headers: { token }
      });

      if (response.data.success) {
        setChats(prev => prev.map(chat => 
          chat._id === chatId ? { ...chat, status: 'closed' } : chat
        ));
        
        if (selectedChat?._id === chatId) {
          setSelectedChat(null);
        }
        
        toast.success('Chat đã được đóng');
      }
    } catch (error) {
      console.error('Error closing chat:', error);
      toast.error('Không thể đóng chat');
    }
  };

  // Format thời gian
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto scroll khi có tin nhắn mới
  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  // Format ngày
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hôm nay';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hôm qua';
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  // Lọc chat theo search term
  const filteredChats = chats.filter(chat => 
    chat.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sắp xếp chat theo thời gian và trạng thái
  const sortedChats = filteredChats.sort((a, b) => {
    // Ưu tiên chat active trước
    if (a.status === 'active' && b.status !== 'active') return -1;
    if (a.status !== 'active' && b.status === 'active') return 1;
    
    // Sau đó sắp xếp theo thời gian tin nhắn cuối
    return new Date(b.lastMessage || b.createdAt) - new Date(a.lastMessage || a.createdAt);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Tư vấn khách hàng</h1>
          <p className="text-gray-600">Quản lý và hỗ trợ khách hàng qua chat</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Danh sách chat */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm khách hàng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Chat list */}
              <div className="max-h-[600px] overflow-y-auto">
                {sortedChats.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s9-3.582 9-8-4.03-8-9-8-9 3.582-9 8z" />
                      </svg>
                    </div>
                    <p>Chưa có cuộc trò chuyện nào</p>
                  </div>
                ) : (
                  sortedChats.map((chat) => (
                    <div
                      key={chat._id}
                      onClick={() => setSelectedChat(chat)}
                      className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                        selectedChat?._id === chat._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            chat.status === 'active' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            <span className="font-semibold text-sm">
                              {chat.userName?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{chat.userName}</h3>
                            <p className="text-sm text-gray-500">{chat.userEmail}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            chat.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {chat.status === 'active' ? 'Đang hoạt động' : 'Đã đóng'}
                          </span>
                          {chat.unreadCount > 0 && (
                            <div className="mt-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                              {chat.unreadCount}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {chat.messages && chat.messages.length > 0 && (
                        <div className="text-sm text-gray-600 truncate">
                          {chat.messages[chat.messages.length - 1]?.content}
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-400 mt-2">
                        {formatDate(chat.lastMessage || chat.createdAt)} • {formatTime(chat.lastMessage || chat.createdAt)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Chat window */}
          <div className="lg:col-span-2">
            {selectedChat ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Chat header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="font-bold text-lg">
                          {selectedChat.userName?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{selectedChat.userName}</h3>
                        <p className="text-blue-100">{selectedChat.userEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowFollowUpModal(true)}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email
                      </button>
                      <button
                        onClick={() => closeChat(selectedChat._id)}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                      >
                        Đóng chat
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="h-96 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
                  {selectedChat.messages && selectedChat.messages.length > 0 ? (
                    selectedChat.messages.map((message, index) => {
                      const showDate = index === 0 || 
                        formatDate(message.timestamp) !== formatDate(selectedChat.messages[index - 1]?.timestamp);
                      
                      return (
                        <div key={index}>
                          {showDate && (
                            <div className="text-center text-xs text-gray-500 my-3">
                              {formatDate(message.timestamp)}
                            </div>
                          )}
                          <div className={`mb-3 flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                            {message.sender === 'user' && (
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                                <span className="text-white text-xs font-bold">U</span>
                              </div>
                            )}
                            <div
                              className={`max-w-xs px-4 py-3 rounded-2xl shadow-sm ${
                                message.sender === 'admin'
                                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
                                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                              }`}
                            >
                              <p className="text-sm leading-relaxed">{message.content}</p>
                              <p className={`text-xs mt-2 ${
                                message.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {formatTime(message.timestamp)}
                              </p>
                            </div>
                            {message.sender === 'admin' && (
                              <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
                                <span className="text-white text-xs font-bold">A</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-gray-500 mt-8">
                      <p>Chưa có tin nhắn nào</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendAdminMessage()}
                      placeholder="Nhập tin nhắn..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                    />
                    <button
                      onClick={sendAdminMessage}
                      disabled={!newMessage.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Gửi
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s9-3.582 9-8-4.03-8-9-8-9 3.582-9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Chọn cuộc trò chuyện</h3>
                <p className="text-gray-600">Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu hỗ trợ</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Follow-up Email Modal */}
      {showFollowUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4">
            <h3 className="text-xl font-semibold mb-4">Gửi follow-up email</h3>
            <textarea
              value={followUpEmail}
              onChange={(e) => setFollowUpEmail(e.target.value)}
              placeholder="Nhập nội dung email..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            />
            <div className="flex gap-3 mt-4 justify-end">
              <button
                onClick={() => setShowFollowUpModal(false)}
                className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={sendFollowUpEmail}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                Gửi email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSupport;
