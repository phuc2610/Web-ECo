import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

// Tạo hoặc lấy sessionId duy nhất cho thiết bị khách hàng
export const getSessionId = () => {
  let sessionId = localStorage.getItem("mt_session_id");
  if (!sessionId) {
    sessionId = "sess_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
    localStorage.setItem("mt_session_id", sessionId);
  }
  return sessionId;
};

// Lấy địa chỉ IP Public của khách hàng (cache trong sessionStorage)
export const getClientPublicIp = async () => {
  try {
    const cachedIp = sessionStorage.getItem("mt_client_ip");
    if (cachedIp) return cachedIp;

    const res = await axios.get("https://api.ipify.org?format=json", { timeout: 3000 });
    if (res.data?.ip) {
      sessionStorage.setItem("mt_client_ip", res.data.ip);
      return res.data.ip;
    }
  } catch (e) {
    // Tránh chặn luồng nếu offline hoặc lỗi mạng ngoài
  }
  return "";
};

// Ghi nhận lượt xem sản phẩm
export const trackProductView = async (product, user = null) => {
  if (!product || !product._id) return;

  try {
    const sessionId = getSessionId();
    const ipAddress = await getClientPublicIp();

    // 1. Lưu vào localStorage để hiển thị tức thời (Recently Viewed)
    const recentlyViewed = getRecentlyViewed();
    const existingIndex = recentlyViewed.findIndex((p) => p._id === product._id);

    const productItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      sellingPrice: product.sellingPrice,
      image: Array.isArray(product.image) ? product.image : [product.image],
      category: product.category,
      subCategory: product.subCategory,
      viewedAt: Date.now(),
    };

    if (existingIndex > -1) {
      recentlyViewed.splice(existingIndex, 1);
    }
    recentlyViewed.unshift(productItem);
    localStorage.setItem("mt_recently_viewed", JSON.stringify(recentlyViewed.slice(0, 15)));

    // 2. Gửi API lên backend để đồng bộ CSDL MongoDB
    await axios.post(`${BACKEND_URL}/api/analytics/track-view`, {
      productId: product._id,
      sessionId,
      ipAddress: ipAddress || undefined,
      userId: user?._id || null,
      customerName: user?.name || undefined,
      customerEmail: user?.email || undefined,
      customerPhone: user?.phone_number || undefined,
    });
  } catch (error) {
    console.warn("Analytics trackProductView error:", error.message);
  }
};

// Ghi nhận từ khóa tìm kiếm
export const trackSearchKeyword = async (keyword, user = null) => {
  if (!keyword || !keyword.trim()) return;
  const cleanKeyword = keyword.trim();

  try {
    const sessionId = getSessionId();
    const ipAddress = await getClientPublicIp();

    // 1. Lưu lịch sử search vào localStorage để gợi ý nhanh
    const searches = getRecentSearches();
    const filtered = searches.filter((k) => k.toLowerCase() !== cleanKeyword.toLowerCase());
    filtered.unshift(cleanKeyword);
    localStorage.setItem("mt_search_history", JSON.stringify(filtered.slice(0, 10)));

    // 2. Gửi API lên backend
    await axios.post(`${BACKEND_URL}/api/analytics/track-search`, {
      keyword: cleanKeyword,
      sessionId,
      ipAddress: ipAddress || undefined,
      userId: user?._id || null,
    });
  } catch (error) {
    console.warn("Analytics trackSearchKeyword error:", error.message);
  }
};

// Lấy danh sách sản phẩm vừa xem
export const getRecentlyViewed = () => {
  try {
    const data = localStorage.getItem("mt_recently_viewed");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Lấy lịch sử tìm kiếm gần đây
export const getRecentSearches = () => {
  try {
    const data = localStorage.getItem("mt_search_history");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Xóa lịch sử tìm kiếm
export const clearRecentSearches = () => {
  localStorage.removeItem("mt_search_history");
};

// Xóa 1 từ khóa tìm kiếm
export const removeSearchKeyword = (keywordToRemove) => {
  const searches = getRecentSearches();
  const updated = searches.filter((k) => k !== keywordToRemove);
  localStorage.setItem("mt_search_history", JSON.stringify(updated));
  return updated;
};

// Lưu thông tin khách hàng từ đơn hàng gần nhất để tự động điền lần sau
export const saveLastCheckoutInfo = (info) => {
  try {
    localStorage.setItem("mt_last_checkout_info", JSON.stringify(info));
  } catch (e) {
    console.warn("saveLastCheckoutInfo error", e);
  }
};

// Lấy thông tin khách hàng tự động cho trang thanh toán
export const getLastCheckoutInfo = () => {
  try {
    const data = localStorage.getItem("mt_last_checkout_info");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};
