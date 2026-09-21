import customerActivityModel from "../models/customerActivityModel.js";
import productModel from "../models/productModel.js";
import { userModel } from "../models/userModel.js";

// Helper trích xuất địa chỉ IP Public của khách hàng
export const extractClientIp = (req) => {
  const rawIp =
    req.body?.ipAddress ||
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    (req.headers["x-forwarded-for"]
      ? req.headers["x-forwarded-for"].split(",")[0].trim()
      : "") ||
    req.socket?.remoteAddress ||
    req.ip ||
    "";
  return rawIp ? rawIp.replace(/^::ffff:/, "").trim() : "";
};

// Ghi nhận lượt xem sản phẩm của khách hàng
export const trackProductView = async (req, res) => {
  try {
    const { productId, sessionId, userId, customerName, customerEmail, customerPhone } = req.body;
    const clientIp = extractClientIp(req);

    if (!productId || !sessionId) {
      return res.status(400).json({ success: false, message: "Thiếu productId hoặc sessionId" });
    }

    // 1. Tăng lượt xem sản phẩm
    const product = await productModel.findByIdAndUpdate(
      productId,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    }

    // 2. Tìm hoặc tạo bản ghi hoạt động khách hàng
    let query = { sessionId };
    if (userId) {
      query = { $or: [{ userId }, { sessionId }] };
    }

    let activity = await customerActivityModel.findOne(query);

    // Lấy thông tin user nếu có userId
    let uName = customerName || "Khách vãng lai";
    let uEmail = customerEmail || "";
    let uPhone = customerPhone || "";
    let isReg = false;

    if (userId) {
      const user = await userModel.findById(userId);
      if (user) {
        uName = user.name || uName;
        uEmail = user.email || uEmail;
        uPhone = user.phone_number || uPhone;
        isReg = true;
      }
    }

    if (!activity) {
      activity = new customerActivityModel({
        userId: userId || null,
        sessionId,
        ipAddress: clientIp,
        customerName: uName,
        customerEmail: uEmail,
        customerPhone: uPhone,
        isRegistered: isReg,
        viewedProducts: [],
        searchKeywords: [],
      });
    } else {
      if (userId && !activity.userId) {
        activity.userId = userId;
        activity.isRegistered = true;
      }
      if (clientIp) activity.ipAddress = clientIp;
      if (uName && uName !== "Khách vãng lai") activity.customerName = uName;
      if (uEmail) activity.customerEmail = uEmail;
      if (uPhone) activity.customerPhone = uPhone;
    }

    // 3. Cập nhật mảng viewedProducts
    const pIndex = activity.viewedProducts.findIndex(
      (p) => p.productId && p.productId.toString() === productId.toString()
    );

    const productImage = product.image && product.image.length > 0 ? product.image[0] : (product.images && product.images.length > 0 ? product.images[0] : "");

    if (pIndex > -1) {
      activity.viewedProducts[pIndex].viewCount += 1;
      activity.viewedProducts[pIndex].lastViewedAt = new Date();
      // Đẩy sản phẩm vừa xem lên đầu mảng
      const item = activity.viewedProducts.splice(pIndex, 1)[0];
      activity.viewedProducts.unshift(item);
    } else {
      activity.viewedProducts.unshift({
        productId: product._id,
        productName: product.name,
        category: product.category || "Chung",
        brand: product.subCategory || "",
        price: product.sellingPrice || product.price || 0,
        image: productImage,
        viewCount: 1,
        lastViewedAt: new Date(),
      });
    }

    // Giới hạn lưu tối đa 30 sản phẩm gần nhất
    if (activity.viewedProducts.length > 30) {
      activity.viewedProducts = activity.viewedProducts.slice(0, 30);
    }

    // 4. Xác định danh mục và thương hiệu được quan tâm nhiều nhất
    const categoryCounts = {};
    const brandCounts = {};
    activity.viewedProducts.forEach((vp) => {
      if (vp.category) {
        categoryCounts[vp.category] = (categoryCounts[vp.category] || 0) + vp.viewCount;
      }
      if (vp.brand) {
        brandCounts[vp.brand] = (brandCounts[vp.brand] || 0) + vp.viewCount;
      }
    });

    let topCat = "";
    let maxCatCount = 0;
    for (const [cat, count] of Object.entries(categoryCounts)) {
      if (count > maxCatCount) {
        maxCatCount = count;
        topCat = cat;
      }
    }
    activity.preferredCategory = topCat;

    let topBrand = "";
    let maxBrandCount = 0;
    for (const [brand, count] of Object.entries(brandCounts)) {
      if (count > maxBrandCount) {
        maxBrandCount = count;
        topBrand = brand;
      }
    }
    activity.preferredBrand = topBrand;

    activity.lastActive = new Date();
    await activity.save();

    res.json({
      success: true,
      message: "Ghi nhận lượt xem thành công",
      totalProductViews: product.views,
      preferredCategory: activity.preferredCategory,
    });
  } catch (error) {
    console.error("Lỗi trackProductView:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Ghi nhận từ khóa tìm kiếm của khách hàng
export const trackSearchKeyword = async (req, res) => {
  try {
    const { keyword, sessionId, userId } = req.body;
    const clientIp = extractClientIp(req);

    if (!keyword || !keyword.trim() || !sessionId) {
      return res.status(400).json({ success: false, message: "Thiếu keyword hoặc sessionId" });
    }

    const cleanKeyword = keyword.trim();

    let query = { sessionId };
    if (userId) {
      query = { $or: [{ userId }, { sessionId }] };
    }

    let activity = await customerActivityModel.findOne(query);

    if (!activity) {
      activity = new customerActivityModel({
        userId: userId || null,
        sessionId,
        ipAddress: clientIp,
        viewedProducts: [],
        searchKeywords: [],
      });
    } else if (clientIp && !activity.ipAddress) {
      activity.ipAddress = clientIp;
    }

    // Cập nhật từ khóa
    const kIndex = activity.searchKeywords.findIndex(
      (k) => k.keyword.toLowerCase() === cleanKeyword.toLowerCase()
    );

    if (kIndex > -1) {
      activity.searchKeywords[kIndex].count += 1;
      activity.searchKeywords[kIndex].lastSearchedAt = new Date();
      // Đẩy lên đầu
      const item = activity.searchKeywords.splice(kIndex, 1)[0];
      activity.searchKeywords.unshift(item);
    } else {
      activity.searchKeywords.unshift({
        keyword: cleanKeyword,
        count: 1,
        lastSearchedAt: new Date(),
      });
    }

    if (activity.searchKeywords.length > 20) {
      activity.searchKeywords = activity.searchKeywords.slice(0, 20);
    }

    activity.lastActive = new Date();
    await activity.save();

    res.json({ success: true, message: "Ghi nhận tìm kiếm thành công" });
  } catch (error) {
    console.error("Lỗi trackSearchKeyword:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy sản phẩm gợi ý cá nhân hóa cho người dùng
export const getPersonalizedRecommendations = async (req, res) => {
  try {
    const { sessionId, userId } = req.query;

    let activity = null;
    if (userId || sessionId) {
      const queryConditions = [];
      if (userId) queryConditions.push({ userId });
      if (sessionId) queryConditions.push({ sessionId });
      activity = await customerActivityModel.findOne({ $or: queryConditions });
    }

    let recommendations = [];
    let reason = "Sản phẩm công nghệ nổi bật được quan tâm nhiều";

    if (activity && (activity.preferredCategory || activity.preferredBrand || activity.viewedProducts.length > 0)) {
      const conditions = [];

      if (activity.preferredCategory) {
        conditions.push({ category: activity.preferredCategory });
      }
      if (activity.preferredBrand) {
        conditions.push({ subCategory: activity.preferredBrand });
      }

      // Lấy danh sách ID đã xem để tránh lặp nếu muốn hoặc đưa sản phẩm liên quan
      const viewedIds = activity.viewedProducts.map((p) => p.productId).filter(Boolean);

      recommendations = await productModel
        .find({ $or: conditions })
        .sort({ views: -1, bestseller: -1, _id: -1 })
        .limit(8);

      if (activity.preferredCategory && activity.preferredBrand) {
        reason = `Dành riêng cho bạn: Thiết bị ${activity.preferredCategory} ${activity.preferredBrand} theo xu hướng quan tâm của bạn`;
      } else if (activity.preferredCategory) {
        reason = `Dành riêng cho bạn: Các dòng ${activity.preferredCategory} phù hợp với nhu cầu tìm kiếm của bạn`;
      } else if (activity.preferredBrand) {
        reason = `Dành riêng cho bạn: Sản phẩm hãng ${activity.preferredBrand} bạn vừa xem`;
      }
    }

    // Nếu chưa đủ sản phẩm thì bổ sung các sản phẩm nhiều lượt xem nhất hoặc bestseller
    if (recommendations.length < 4) {
      const topProducts = await productModel
        .find({})
        .sort({ views: -1, bestseller: -1, _id: -1 })
        .limit(8);
      recommendations = topProducts;
    }

    res.json({
      success: true,
      recommendations,
      reason,
      preferredCategory: activity?.preferredCategory || null,
      preferredBrand: activity?.preferredBrand || null,
    });
  } catch (error) {
    console.error("Lỗi getPersonalizedRecommendations:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API Dành cho Quản trị viên (Admin Portal Insights)
export const getAdminCustomerInsights = async (req, res) => {
  try {
    // 1. Top 10 sản phẩm có lượt xem nhiều nhất
    const topViewedProducts = await productModel
      .find({})
      .sort({ views: -1, sellingPrice: -1 })
      .limit(10)
      .select("name category subCategory price sellingPrice image images views bestseller");

    // 2. Tổng hợp Top 15 từ khóa khách tìm kiếm nhiều nhất
    const allActivities = await customerActivityModel.find({});

    const keywordMap = {};
    let totalViewsCount = 0;
    let totalSearchesCount = 0;

    allActivities.forEach((act) => {
      if (act.searchKeywords && act.searchKeywords.length > 0) {
        act.searchKeywords.forEach((kw) => {
          const k = kw.keyword.trim().toLowerCase();
          keywordMap[k] = (keywordMap[k] || 0) + (kw.count || 1);
          totalSearchesCount += kw.count || 1;
        });
      }

      if (act.viewedProducts && act.viewedProducts.length > 0) {
        act.viewedProducts.forEach((vp) => {
          totalViewsCount += vp.viewCount || 1;
        });
      }
    });

    const topKeywords = Object.entries(keywordMap)
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    // 3. Danh sách chi tiết hành vi từng khách hàng (50 hoạt động gần nhất)
    const recentActivities = await customerActivityModel
      .find({})
      .sort({ lastActive: -1 })
      .limit(50);

    // Tính tổng lượt xem thực tế từ các sản phẩm
    const productViewsSum = await productModel.aggregate([
      { $group: { _id: null, total: { $sum: "$views" } } },
    ]);
    const overallProductViews = productViewsSum.length > 0 ? productViewsSum[0].total : totalViewsCount;

    res.json({
      success: true,
      summary: {
        totalVisitors: allActivities.length,
        totalProductViews: overallProductViews,
        totalSearches: totalSearchesCount,
        registeredCustomers: allActivities.filter((a) => a.isRegistered).length,
      },
      topViewedProducts,
      topKeywords,
      customerActivities: recentActivities,
    });
  } catch (error) {
    console.error("Lỗi getAdminCustomerInsights:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
