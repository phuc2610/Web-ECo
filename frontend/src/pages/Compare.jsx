import React, { useState, useEffect, useContext, useCallback } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion as Motion } from 'framer-motion';

const Compare = () => {
  const { backendUrl } = useContext(ShopContext);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [externalProductName, setExternalProductName] = useState('');
  // removed unused comparisonResult state
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  // define fetch function before effects to avoid TDZ errors
  const fetchAvailableProducts = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/compare/products?limit=50`);
      if (response.data.success) {
        setAvailableProducts(response.data.products);
        setFilteredProducts(response.data.products);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(response.data.products.map(p => p.category))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Không thể tải danh sách sản phẩm');
    }
  }, [backendUrl]);

  // Fetch available products on mount
  useEffect(() => {
    fetchAvailableProducts();
    // Add welcome message
    setChatMessages([
      {
        type: 'ai',
        content: 'Xin chào! Tôi là hệ thống trả lời câu hỏi về sản phẩm của NP Computer. Tôi có thể giúp bạn:\n\n• Phân tích chi tiết sản phẩm từ NP Computer\n• Phân tích/đối chiếu nhiều sản phẩm bất kỳ\n• Phân tích sản phẩm bên ngoài và gợi ý sản phẩm tương tự từ NP Computer',
        timestamp: new Date()
      }
    ]);
  }, [fetchAvailableProducts]);

  // Filter products based on selected category
  useEffect(() => {
    if (selectedCategory === '') {
      setFilteredProducts(availableProducts);
    } else {
      const filtered = availableProducts.filter(product => product.category === selectedCategory);
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, availableProducts]);

  

  const handleProductSelect = async (product) => {
    if (selectedProducts.find(p => p._id === product._id)) {
      toast.warning('Sản phẩm đã được chọn');
      return;
    }

    // Allow selecting products across different categories

    const newSelectedProducts = [...selectedProducts, product];
    setSelectedProducts(newSelectedProducts);
    
    // Add user message
    const userMessage = {
      type: 'user',
      content: `Đã chọn: ${product.name} (${product.category})`,
      timestamp: new Date()
    };
    
    // Add AI response
    const aiMessage = {
      type: 'ai',
      content: `Đã thêm ${product.name} vào danh sách. Bạn có thể chọn thêm bất kỳ sản phẩm nào khác để phân tích/đối chiếu, hoặc nhập tên sản phẩm bên ngoài để tôi phân tích và gợi ý sản phẩm tương tự từ NP Computer.`,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage, aiMessage]);

    // If only 1 product selected, analyze it in detail
    if (newSelectedProducts.length === 1) {
      await analyzeSingleProduct(product);
    }
  };

  const analyzeSingleProduct = async (product) => {
    try {
      const response = await axios.post(`${backendUrl}/api/compare/analyze`, {
        productId: product._id
      });

      if (response.data.success) {
        const aiMessage = {
          type: 'ai',
          content: `**Phân tích chi tiết ${product.name}:**\n\n${response.data.analysis}`,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error analyzing product:', error);
    }
  };

  const handleProductRemove = (productId) => {
    const product = selectedProducts.find(p => p._id === productId);
    const newSelectedProducts = selectedProducts.filter(p => p._id !== productId);
    setSelectedProducts(newSelectedProducts);
    
    if (product) {
      const userMessage = {
        type: 'user',
        content: `Đã bỏ: ${product.name}`,
        timestamp: new Date()
      };
      
      const aiMessage = {
        type: 'ai',
        content: `Đã bỏ ${product.name} khỏi danh sách.`,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, userMessage, aiMessage]);
    }
  };

  const handleCompareAll = async () => {
    if (selectedProducts.length === 0 && !externalProductName.trim()) {
      toast.error('Vui lòng chọn sản phẩm hoặc nhập tên sản phẩm để phân tích');
      return;
    }

    setLoading(true);
    
    // Add user message
    const userMessage = {
      type: 'user',
      content: externalProductName.trim() 
        ? `Phân tích ${externalProductName} và gợi ý sản phẩm tương tự từ NP Computer`
        : selectedProducts.length === 1 
          ? `Phân tích chi tiết ${selectedProducts[0].name}`
          : `Phân tích ${selectedProducts.map(p => p.name).join(', ')}`,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMessage]);

    try {
      let response;
      
      if (externalProductName.trim()) {
        // Always suggest similar products from NP Computer when external product is provided
        response = await axios.post(`${backendUrl}/api/compare/suggest`, {
          externalProductName: externalProductName.trim()
        });
      } else if (selectedProducts.length === 1) {
        // Analyze single product in detail
        response = await axios.post(`${backendUrl}/api/compare/analyze`, {
          productId: selectedProducts[0]._id
        });
      } else if (selectedProducts.length >= 2) {
        // Compare internal products across categories as well
        response = await axios.post(`${backendUrl}/api/compare/products`, {
          productIds: selectedProducts.map(p => p._id)
        });
      } else {
        toast.error('Cần chọn ít nhất 1 sản phẩm để phân tích hoặc 2 sản phẩm để so sánh');
        setLoading(false);
        return;
      }

      if (response.data.success) {
        
        // Add AI analysis message
        const aiMessage = {
          type: 'ai',
          content: response.data.comparison || response.data.suggestion || response.data.analysis,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, aiMessage]);
        
        toast.success('Phân tích hoàn tất!');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error analyzing products:', error);
      toast.error('Có lỗi xảy ra khi phân tích sản phẩm');
      
      // Add error message
      const errorMessage = {
        type: 'ai',
        content: 'Xin lỗi, có lỗi xảy ra khi phân tích sản phẩm. Vui lòng thử lại.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setExternalProductName('');
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedProducts([]); // Clear selected products when changing category
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            NP Computer - Tư vấn sản phẩm thông minh
          </h1>
          <p className="text-lg text-gray-600">
            Chat với AI chuyên gia để được tư vấn và phân tích sản phẩm
          </p>
        </Motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Product Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Chọn sản phẩm
              </h2>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lọc theo loại sản phẩm
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tất cả loại sản phẩm</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Bạn có thể chọn nhiều sản phẩm bất kỳ để phân tích/đối chiếu.
                </p>
              </div>

              {/* Selected Products */}
              {selectedProducts.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Sản phẩm đã chọn ({selectedProducts.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedProducts.map((product) => (
                      <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={product.image[0]} 
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium text-sm text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-600">{formatPrice(product.price)} VNĐ</p>
                            <p className="text-xs text-gray-500">{product.category}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleProductRemove(product._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* External Product Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sản phẩm bên ngoài (tùy chọn)
                </label>
                <input
                  type="text"
                  value={externalProductName}
                  onChange={(e) => setExternalProductName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ví dụ: MacBook Pro M2, iPhone 15 Pro..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  AI sẽ phân tích sản phẩm này và gợi ý sản phẩm tương tự từ NP Computer
                </p>
              </div>

              {/* Available Products */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Sản phẩm có sẵn ({filteredProducts.length})
                  {selectedCategory && ` - Loại: ${selectedCategory}`}
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleProductSelect(product)}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <img 
                        src={product.image[0]} 
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">{formatPrice(product.price)} VNĐ</p>
                        <p className="text-xs text-gray-500">{product.category} {'>'} {product.subCategory}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleCompareAll}
                disabled={loading || (selectedProducts.length === 0 && !externalProductName.trim())}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Đang phân tích...
                  </div>
                ) : selectedProducts.length === 1 ? (
                  'Phân tích sản phẩm'
                ) : selectedProducts.length >= 2 ? (
                  'Phân tích sản phẩm'
                ) : (
                  'Phân tích sản phẩm'
                )}
              </button>
            </div>
          </div>

          {/* Right Panel - Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b bg-gray-50 rounded-t-lg">
                <h2 className="text-lg font-semibold text-gray-900">
                  Chat với AI chuyên gia NP Computer
                </h2>
                <p className="text-sm text-gray-600">
                  Tư vấn và phân tích sản phẩm thông minh
                </p>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((message, index) => (
                  <Motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString('vi-VN', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </Motion.div>
                ))}
                
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        <span className="text-sm">AI đang phân tích...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compare;
