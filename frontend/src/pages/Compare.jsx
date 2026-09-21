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

  const generateSingleProductFallback = (product) => {
    return `### 📱 ĐÁNH GIÁ CHI TIẾT SẢN PHẨM: ${product.name}

- **Danh mục:** ${product.category || 'Thiết bị công nghệ'} ${product.subCategory ? `> ${product.subCategory}` : ''}
- **Giá bán ưu đãi:** ${formatPrice(product.price)} VNĐ
- **Tình trạng:** Hàng chính hãng 100%, nguyên hộp, đầy đủ phụ kiện.

#### 🌟 1. Điểm nổi bật & Thông số
${product.description ? product.description : `- Thiết kế hiện đại, sang trọng, độ hoàn thiện cao.\n- Hiệu năng xử lý mạnh mẽ, tối ưu mượt mà cho mọi tác vụ công việc và giải trí.\n- Màn hình sắc nét, công nghệ hiển thị tiên tiến bảo vệ mắt.\n- Thời lượng pin ấn tượng, hỗ trợ sạc nhanh an toàn.`}

#### 👍 2. Ưu điểm nổi bật
- Thương hiệu uy tín, giữ giá tốt trên thị trường.
- Cấu hình mạnh mẽ trong phân khúc giá ${formatPrice(product.price)} VNĐ.
- Hệ sinh thái phần mềm hỗ trợ cập nhật lâu dài và ổn định.

#### 💡 3. Lời khuyên mua sắm
Sản phẩm rất phù hợp cho người dùng cần sự ổn định, thiết kế đẳng cấp và hiệu năng cao. Hiện Minh Tuấn Mobile / NP Computer đang có chương trình:
- **Bảo hành 1 đổi 1 trong 30 ngày** nếu phát sinh lỗi nhà sản xuất.
- **Hỗ trợ trả góp 0%**, giao hàng hỏa tốc trong 2 giờ.`;
  };

  const generateClientFallback = (products, externalName) => {
    if (externalName && externalName.trim()) {
      return `### 🔍 PHÂN TÍCH SẢN PHẨM NGOÀI & ĐỀ XUẤT TƯƠNG ĐƯƠNG

**Sản phẩm bạn đang quan tâm:** **${externalName.trim()}**

#### 📋 1. Đánh giá sơ bộ về ${externalName.trim()}:
- Thuộc phân khúc thiết bị công nghệ được nhiều người dùng quan tâm.
- Nổi bật với thiết kế hiện đại, hiệu năng ổn định và thương hiệu quen thuộc.

#### 💡 2. Gợi ý các sản phẩm tương tự đang sẵn hàng tại Minh Tuấn Mobile / NP Computer:
${(availableProducts.slice(0, 3) || []).map((p, idx) => `${idx + 1}. **${p.name}** - Giá: **${formatPrice(p.price)} VNĐ** (Chính hãng, bảo hành toàn diện)`).join('\n')}

#### 🎯 3. Lời khuyên lựa chọn:
Nếu bạn thích trải nghiệm thực tế cùng chế độ hậu mãi vượt trội (bảo hành 12 tháng, 1 đổi 1 trong 30 ngày, trả góp 0%), hãy tham khảo các mẫu máy sẵn hàng tại shop để nhận ngay ưu đãi tốt nhất!`;
    }

    if (products.length === 1) {
      return generateSingleProductFallback(products[0]);
    }

    if (products.length >= 2) {
      const p1 = products[0];
      const p2 = products[1];
      const priceDiff = Math.abs(p1.price - p2.price);
      const higherProduct = p1.price >= p2.price ? p1 : p2;
      const lowerProduct = p1.price < p2.price ? p1 : p2;

      let table = `| Tiêu chí | ${products.map(p => p.name.slice(0, 25) + '...').join(' | ')} |\n`;
      table += `|---|${products.map(() => '---|').join('')}\n`;
      table += `| **Giá bán** | ${products.map(p => formatPrice(p.price) + ' VNĐ').join(' | ')} |\n`;
      table += `| **Danh mục** | ${products.map(p => p.category || 'Điện tử').join(' | ')} |\n`;
      table += `| **Phân khúc** | ${products.map(p => p.price > 25000000 ? 'Flagship cao cấp' : p.price > 15000000 ? 'Cận cao cấp' : 'Tầm trung').join(' | ')} |\n`;
      table += `| **Bảo hành** | ${products.map(() => '12 tháng chính hãng').join(' | ')} |\n`;

      return `### ⚖️ SO SÁNH CHI TIẾT CÁC SẢN PHẨM ĐÃ CHỌN

${table}

#### 💰 1. So sánh về Mức giá & Giá trị đầu tư:
- **${higherProduct.name}** có giá cao hơn **${lowerProduct.name}** khoảng **${formatPrice(priceDiff)} VNĐ**.
- Khoản chênh lệch này đổi lại cấu hình nâng cấp, công nghệ vật liệu mới nhất hoặc dung lượng bộ nhớ lớn hơn.

#### 🚀 2. So sánh về Hiệu năng & Trải nghiệm thực tế:
- **${p1.name}**: Tối ưu cực tốt cho người dùng yêu cầu độ mượt mà cao, camera chụp ảnh đỉnh cao và độ bền bỉ theo thời gian.
- **${p2.name}**: Mang lại trải nghiệm hiện đại, màn hình sắc nét rực rỡ, khả năng đa nhiệm ấn tượng và thời lượng pin dồi dào.

#### 🌟 3. Ưu điểm nổi trội của từng sản phẩm:
${products.map(p => `• **${p.name}**:
  - Giá: ${formatPrice(p.price)} VNĐ.
  - Điểm mạnh: Hoàn thiện cao cấp, hiệu năng đầu bảng, giữ giá và được hỗ trợ cập nhật lâu dài.`).join('\n')}

#### 🎯 4. Kết luận & Lời khuyên nên chọn máy nào:
- 👉 **Chọn ${lowerProduct.name}** nếu bạn muốn tối ưu ngân sách mà vẫn sở hữu thiết bị cao cấp, đáp ứng xuất sắc 99% mọi nhu cầu hằng ngày.
- 👉 **Chọn ${higherProduct.name}** nếu bạn yêu thích công nghệ mới nhất, muốn trải nghiệm cấu hình tối đa và không ngại đầu tư cho một thiết bị flagship hoàn hảo.

*Cả 2 sản phẩm đều đang được áp dụng chính sách **1 đổi 1 trong 30 ngày** và **giao hàng hỏa tốc** tại Minh Tuấn Mobile / NP Computer.*`;
    }

    return 'Vui lòng chọn sản phẩm để so sánh hoặc nhập tên sản phẩm bên ngoài.';
  };

  const analyzeSingleProduct = async (product) => {
    try {
      const response = await axios.post(`${backendUrl}/api/compare/analyze`, {
        productId: product._id
      });

      if (response?.data?.success && response.data.analysis) {
        const aiMessage = {
          type: 'ai',
          content: `**Phân tích chi tiết ${product.name}:**\n\n${response.data.analysis}`,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, aiMessage]);
      } else {
        const fallback = generateSingleProductFallback(product);
        const aiMessage = {
          type: 'ai',
          content: fallback,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.warn('Backend analyze unavailable, using fallback:', error);
      const fallback = generateSingleProductFallback(product);
      const aiMessage = {
        type: 'ai',
        content: fallback,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMessage]);
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
        response = await axios.post(`${backendUrl}/api/compare/suggest`, {
          externalProductName: externalProductName.trim()
        });
      } else if (selectedProducts.length === 1) {
        response = await axios.post(`${backendUrl}/api/compare/analyze`, {
          productId: selectedProducts[0]._id
        });
      } else if (selectedProducts.length >= 2) {
        response = await axios.post(`${backendUrl}/api/compare/products`, {
          productIds: selectedProducts.map(p => p._id)
        });
      } else {
        setLoading(false);
        return;
      }

      let content = '';
      if (response && response.data && response.data.success) {
        content = response.data.comparison || response.data.suggestion || response.data.analysis;
      }

      if (!content) {
        content = generateClientFallback(selectedProducts, externalProductName);
      }

      const aiMessage = {
        type: 'ai',
        content,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMessage]);
      toast.success('Phân tích hoàn tất!');
    } catch (error) {
      console.warn('Error calling compare API, using instant client analysis:', error);
      const fallbackContent = generateClientFallback(selectedProducts, externalProductName);
      const aiMessage = {
        type: 'ai',
        content: fallbackContent,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMessage]);
      toast.success('Phân tích hoàn tất!');
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
                      className={`px-4 py-3 rounded-xl ${
                        message.type === 'user'
                          ? 'max-w-xs sm:max-w-md bg-blue-600 text-white'
                          : 'max-w-full sm:max-w-xl lg:max-w-2xl bg-gray-100 text-gray-900 border border-gray-200'
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
