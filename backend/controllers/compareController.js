import OpenAI from 'openai';
import productModel from '../models/productModel.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Compare products from database
const compareProducts = async (req, res) => {
  try {
    const { productIds, category } = req.body;

    if (!productIds || productIds.length < 2) {
      return res.json({ 
        success: false, 
        message: "Cần ít nhất 2 sản phẩm để so sánh" 
      });
    }

    // Get products from database
    const products = await productModel.find({ 
      _id: { $in: productIds } 
    });

    if (products.length < 2) {
      return res.json({ 
        success: false, 
        message: "Không tìm thấy đủ sản phẩm để so sánh" 
      });
    }

    // Prepare product data for AI
    const productData = products.map(product => ({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      description: product.description,
      category: product.category,
      subCategory: product.subCategory,
      averageRating: product.averageRating,
      totalReviews: product.totalReviews,
      bestseller: product.bestseller
    }));

    // Create AI prompt
    const prompt = `
    Hãy so sánh chi tiết các sản phẩm sau đây. Phân tích theo các tiêu chí:
    1. Giá cả và giá trị/tiền
    2. Tính năng và hiệu năng
    3. Chất lượng và độ bền
    4. Phù hợp với nhu cầu khác nhau
    5. Ưu điểm và nhược điểm của từng sản phẩm
    6. Khuyến nghị cho từng đối tượng khách hàng

    Sản phẩm cần so sánh:
    ${productData.map((product, index) => `
    Sản phẩm ${index + 1}: ${product.name}
    - Giá: ${product.price.toLocaleString('vi-VN')} VNĐ
    - Giá gốc: ${product.originalPrice ? product.originalPrice.toLocaleString('vi-VN') : 'N/A'} VNĐ
    - Danh mục: ${product.category} > ${product.subCategory}
    - Đánh giá: ${product.averageRating}/5 (${product.totalReviews} đánh giá)
    - Mô tả: ${product.description}
    - Bán chạy: ${product.bestseller ? 'Có' : 'Không'}
    `).join('\n')}

    Hãy trả lời bằng tiếng Việt, chi tiết và dễ hiểu. Đưa ra khuyến nghị cụ thể cho từng loại khách hàng.
    `;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Bạn là chuyên gia tư vấn mua sắm thông minh, có khả năng phân tích và so sánh sản phẩm một cách khách quan và chi tiết."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const aiAnalysis = completion.choices[0].message.content;

    res.json({
      success: true,
      products: products,
      comparison: aiAnalysis,
      summary: {
        totalProducts: products.length,
        priceRange: {
          min: Math.min(...products.map(p => p.price)),
          max: Math.max(...products.map(p => p.price))
        },
        averageRating: products.reduce((sum, p) => sum + (p.averageRating || 0), 0) / products.length
      }
    });

  } catch (error) {
    console.error('Compare products error:', error);
    res.json({ 
      success: false, 
      message: "Có lỗi xảy ra khi so sánh sản phẩm" 
    });
  }
};

// Auto search external product information
const searchExternalProduct = async (productName) => {
  try {
    const prompt = `
    Hãy tìm kiếm thông tin chi tiết về sản phẩm: "${productName}"
    
    Trả về thông tin theo format JSON sau:
    {
      "name": "Tên sản phẩm chính xác",
      "price": "Giá ước tính (số)",
      "category": "Danh mục sản phẩm",
      "brand": "Thương hiệu",
      "specifications": {
        "processor": "Thông số CPU",
        "ram": "RAM",
        "storage": "Bộ nhớ",
        "display": "Màn hình",
        "graphics": "Đồ họa",
        "battery": "Pin",
        "weight": "Trọng lượng",
        "dimensions": "Kích thước"
      },
      "features": ["Tính năng 1", "Tính năng 2", "Tính năng 3"],
      "pros": ["Ưu điểm 1", "Ưu điểm 2", "Ưu điểm 3"],
      "cons": ["Nhược điểm 1", "Nhược điểm 2"],
      "rating": "Đánh giá trung bình (số từ 0-5)",
      "description": "Mô tả chi tiết sản phẩm",
      "targetAudience": "Đối tượng phù hợp"
    }
    
    Chỉ trả về JSON, không có text khác. Nếu không tìm thấy thông tin, hãy ước tính dựa trên kiến thức của bạn.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Bạn là chuyên gia công nghệ, có kiến thức sâu rộng về các sản phẩm điện tử, máy tính, điện thoại và các thiết bị công nghệ khác. Hãy cung cấp thông tin chính xác và cập nhật nhất."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.3,
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
  } catch (error) {
    console.error('Search external product error:', error);
    return null;
  }
};

// Compare with external product (auto search)
const compareWithExternal = async (req, res) => {
  try {
    const { productIds, externalProductName } = req.body;

    if (!externalProductName || !productIds || productIds.length === 0) {
      return res.json({ 
        success: false, 
        message: "Thiếu thông tin sản phẩm để so sánh" 
      });
    }

    // Get products from database
    const products = await productModel.find({ 
      _id: { $in: productIds } 
    });

    if (products.length === 0) {
      return res.json({ 
        success: false, 
        message: "Không tìm thấy sản phẩm trong hệ thống" 
      });
    }

    // Auto search external product information
    const externalProductInfo = await searchExternalProduct(externalProductName);
    
    if (!externalProductInfo) {
      return res.json({ 
        success: false, 
        message: "Không thể tìm thông tin sản phẩm bên ngoài" 
      });
    }

    // Prepare data for AI
    const productData = products.map(product => ({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      description: product.description,
      category: product.category,
      subCategory: product.subCategory,
      averageRating: product.averageRating,
      totalReviews: product.totalReviews,
      bestseller: product.bestseller
    }));

    // Create AI prompt for ultra short comparison
    const prompt = `
    Hãy so sánh cực kỳ ngắn gọn giữa sản phẩm bên ngoài với các sản phẩm trong hệ thống.

    SẢN PHẨM BÊN NGOÀI: ${externalProductInfo.name}
    - Thương hiệu: ${externalProductInfo.brand || 'Không xác định'}
    - Giá ước tính: ${externalProductInfo.price ? externalProductInfo.price.toLocaleString('vi-VN') : 'Không xác định'} VNĐ
    - Danh mục: ${externalProductInfo.category || 'Không xác định'}
    - Đánh giá: ${externalProductInfo.rating || 'Không có'}/5

    SẢN PHẨM TRONG HỆ THỐNG:
    ${productData.map((product, index) => `
    Sản phẩm ${index + 1}: ${product.name}
    - Giá: ${product.price.toLocaleString('vi-VN')} VNĐ
    - Đánh giá: ${product.averageRating}/5 (${product.totalReviews} đánh giá)
    `).join('\n')}

    Hãy đưa ra phân tích cực kỳ ngắn gọn (chỉ 2-3 câu, tối đa 100 từ) bao gồm:
    1. So sánh giá cả và hiệu năng
    2. Khuyến nghị sản phẩm nào phù hợp hơn

    Trả lời bằng tiếng Việt, đơn giản và dễ hiểu như đang nói chuyện với bạn bè.
    `;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Bạn là chuyên gia tư vấn mua sắm, có khả năng so sánh sản phẩm một cách khách quan và đưa ra khuyến nghị hữu ích."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiAnalysis = completion.choices[0].message.content;

    res.json({
      success: true,
      externalProduct: externalProductInfo,
      systemProducts: products,
      comparison: aiAnalysis,
      recommendations: products.filter(p => p.bestseller || p.averageRating >= 4)
    });

  } catch (error) {
    console.error('Compare with external error:', error);
    res.json({ 
      success: false, 
      message: "Có lỗi xảy ra khi so sánh với sản phẩm bên ngoài" 
    });
  }
};

// Get products for comparison
const getProductsForComparison = async (req, res) => {
  try {
    const { category, limit = 10 } = req.query;

    let query = {};
    if (category) {
      query.category = category;
    }

    const products = await productModel.find(query)
      .select('name price originalPrice category subCategory averageRating totalReviews bestseller image')
      .limit(parseInt(limit))
      .sort({ bestseller: -1, averageRating: -1 });

    res.json({
      success: true,
      products: products
    });

  } catch (error) {
    console.error('Get products for comparison error:', error);
    res.json({ 
      success: false, 
      message: "Có lỗi xảy ra khi lấy danh sách sản phẩm" 
    });
  }
};

// Analyze single product in detail
const analyzeSingleProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.json({ 
        success: false, 
        message: "Thiếu thông tin sản phẩm" 
      });
    }

    // Get product from database
    const product = await productModel.findById(productId);

    if (!product) {
      return res.json({ 
        success: false, 
        message: "Không tìm thấy sản phẩm" 
      });
    }

    // Create AI prompt for single product analysis
    const prompt = `
    Bạn là chuyên gia tư vấn của NP Computer. Hãy phân tích chi tiết sản phẩm sau đây:

    SẢN PHẨM: ${product.name}
    - Giá: ${product.price.toLocaleString('vi-VN')} VNĐ
    - Giá gốc: ${product.originalPrice ? product.originalPrice.toLocaleString('vi-VN') : 'N/A'} VNĐ
    - Danh mục: ${product.category} > ${product.subCategory}
    - Đánh giá: ${product.averageRating}/5 (${product.totalReviews} đánh giá)
    - Mô tả: ${product.description}
    - Bán chạy: ${product.bestseller ? 'Có' : 'Không'}

    Hãy phân tích chi tiết sản phẩm này bao gồm:
    1. Đánh giá tổng quan về sản phẩm
    2. Ưu điểm và nhược điểm chính
    3. Phù hợp với đối tượng khách hàng nào
    4. So sánh với các sản phẩm cùng loại trên thị trường
    5. Lời khuyên mua hàng

    Trả lời bằng tiếng Việt, chi tiết và chuyên nghiệp như chuyên gia tư vấn.
    `;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Bạn là chuyên gia tư vấn công nghệ của NP Computer, có kiến thức sâu rộng về các sản phẩm điện tử, máy tính, điện thoại. Hãy đưa ra phân tích chuyên nghiệp và khách quan."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const aiAnalysis = completion.choices[0].message.content;

    res.json({
      success: true,
      product: product,
      analysis: aiAnalysis
    });

  } catch (error) {
    console.error('Analyze single product error:', error);
    res.json({ 
      success: false, 
      message: "Có lỗi xảy ra khi phân tích sản phẩm" 
    });
  }
};

// Suggest similar products from NP Computer
const suggestSimilarProducts = async (req, res) => {
  try {
    const { externalProductName, price, category } = req.body;

    if (!externalProductName) {
      return res.json({ 
        success: false, 
        message: "Thiếu thông tin sản phẩm" 
      });
    }

    // Build query for similar products
    let query = {};
    if (category) {
      query.category = category;
    }
    
    // Find products with similar price range (±20%)
    if (price) {
      const minPrice = price * 0.8;
      const maxPrice = price * 1.2;
      query.price = { $gte: minPrice, $lte: maxPrice };
    }

    // Get similar products from database
    const similarProducts = await productModel.find(query)
      .select('name price originalPrice category subCategory averageRating totalReviews bestseller image')
      .limit(5)
      .sort({ bestseller: -1, averageRating: -1 });

    if (similarProducts.length === 0) {
      return res.json({ 
        success: false, 
        message: "Không tìm thấy sản phẩm tương tự trong hệ thống" 
      });
    }

    // Create AI prompt for product suggestions
    const prompt = `
    Bạn là chuyên gia tư vấn của NP Computer. Khách hàng đang tìm hiểu về sản phẩm: "${externalProductName}"

    Hãy giới thiệu các sản phẩm tương tự từ NP Computer:

    ${similarProducts.map((product, index) => `
    Sản phẩm ${index + 1}: ${product.name}
    - Giá: ${product.price.toLocaleString('vi-VN')} VNĐ
    - Danh mục: ${product.category} > ${product.subCategory}
    - Đánh giá: ${product.averageRating}/5 (${product.totalReviews} đánh giá)
    - Bán chạy: ${product.bestseller ? 'Có' : 'Không'}
    `).join('\n')}

    Hãy:
    1. Giới thiệu về NP Computer và chất lượng sản phẩm
    2. So sánh với sản phẩm khách hàng đang tìm hiểu
    3. Gợi ý sản phẩm nào phù hợp nhất và tại sao
    4. Đưa ra lời khuyên mua hàng

    Trả lời bằng tiếng Việt, thân thiện và chuyên nghiệp.
    `;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Bạn là chuyên gia tư vấn bán hàng của NP Computer, có kiến thức sâu rộng về sản phẩm và khả năng thuyết phục khách hàng một cách chuyên nghiệp."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const aiSuggestion = completion.choices[0].message.content;

    res.json({
      success: true,
      externalProduct: externalProductName,
      similarProducts: similarProducts,
      suggestion: aiSuggestion
    });

  } catch (error) {
    console.error('Suggest similar products error:', error);
    res.json({ 
      success: false, 
      message: "Có lỗi xảy ra khi gợi ý sản phẩm" 
    });
  }
};

export {
  compareProducts,
  compareWithExternal,
  getProductsForComparison,
  analyzeSingleProduct,
  suggestSimilarProducts
};
