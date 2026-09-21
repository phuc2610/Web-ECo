import React, { useContext, useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import CategoryMegaMenu, { MEGA_MENU_DATA } from "./CategoryMegaMenu";
import { trackSearchKeyword } from "../utils/analyticsTracker";

const CATEGORY_MENU = [
  { name: "Điện thoại, Tablet", path: "/collection?category=Điện thoại", icon: "https://dashboard.cellphones.com.vn/storage/icon-homepage-mobile.svg" },
  { name: "Laptop", path: "/collection?category=Laptop", icon: "https://dashboard.cellphones.com.vn/storage/icon-homepage-laptop.svg" },
  { name: "Âm thanh, Tai nghe", path: "/collection?category=Phụ kiện di động", icon: "https://dashboard.cellphones.com.vn/storage/icon-homepage-audio-2.svg" },
  { name: "PC, Màn hình", path: "/collection?category=PC", icon: "https://dashboard.cellphones.com.vn/storage/icon-homepage-pc.svg" },
  { name: "Linh kiện máy tính", path: "/collection?category=Linh kiện máy tính", icon: "https://dashboard.cellphones.com.vn/storage/icon-homepage-pc.svg" },
  { name: "Phụ kiện", path: "/collection?category=Phụ kiện di động", icon: "https://dashboard.cellphones.com.vn/storage/icon-homepage-accessories.svg" },
  { name: "Thu cũ đổi mới", path: "/collection", icon: "https://dashboard.cellphones.com.vn/storage/icon-homepage-trade-in.svg", badge: "Trợ giá 4tr" },
  { name: "Hàng cũ giá rẻ", path: "/collection?category=sale", icon: "https://dashboard.cellphones.com.vn/storage/icon-homepage-used-goods.svg" },
  { name: "Khuyến mãi HOT", path: "/collection?category=sale", icon: "https://dashboard.cellphones.com.vn/storage/icon-homepage-promotions.svg", badge: "Giảm 50%" },
  { name: "Tin công nghệ", path: "/news", icon: "https://dashboard.cellphones.com.vn/storage/icon-homepage-tech-news.svg" },
];

const TRENDING_DEVICES = [
  { name: "iPhone 16 Series", keyword: "iPhone 16", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=150" },
  { name: "Galaxy S24 Ultra", keyword: "Galaxy S24", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=150" },
  { name: "MacBook Air M3", keyword: "MacBook", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150" },
  { name: "Redmi Note 13", keyword: "Redmi", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=150" },
  { name: "Loa Sony ULT Field", keyword: "Sony", image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=150" },
  { name: "Galaxy Watch 7", keyword: "Watch", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150" },
  { name: "PlayStation 5 / Console", keyword: "Gaming", image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=150" },
  { name: "Màn hình Gaming 4K", keyword: "Màn hình", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=150" },
  { name: "Camera IP 360 độ", keyword: "Camera", image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=150" },
  { name: "Quạt & Gia dụng", keyword: "Phụ kiện", image: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=150" }
];

const QUICK_SEARCH_TAGS = ["iPhone 16 Pro Max", "Galaxy S24 Ultra", "MacBook Air M3", "RTX 4080", "AirPods Pro 2", "iPad Pro M4"];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [navbarHoveredCategory, setNavbarHoveredCategory] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState("Hà Nội");
  const [showProvinceSelect, setShowProvinceSelect] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("mt_search_history");
      return saved ? JSON.parse(saved) : ["iPhone 16 Pro", "Galaxy S24", "MacBook M3"];
    } catch {
      return ["iPhone 16 Pro", "Galaxy S24", "MacBook M3"];
    }
  });

  const searchBoxRef = useRef(null);
  const { products, setSearch, setShowSearch, getCartCount, getWishlistCount, token, setToken, setCartItems, user, setUser } = useContext(ShopContext);
  const navigate = useNavigate();

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveToHistory = (query) => {
    if (!query) return;
    const clean = query.trim();
    trackSearchKeyword(clean, user);
    setSearchHistory(prev => {
      const updated = [clean, ...prev.filter(item => item.toLowerCase() !== clean.toLowerCase())].slice(0, 8);
      try {
        localStorage.setItem("mt_search_history", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem("mt_search_history");
    } catch {}
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      saveToHistory(searchInput);
      setSearch(searchInput.trim());
      setShowSearch(true);
      setIsSearchOpen(false);
      navigate(`/collection?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleTagClick = (tag) => {
    setSearchInput(tag);
    saveToHistory(tag);
    setSearch(tag);
    setShowSearch(true);
    setIsSearchOpen(false);
    navigate(`/collection?q=${encodeURIComponent(tag)}`);
  };

  const handleProductJump = (id) => {
    setIsSearchOpen(false);
    navigate(`/product/${id}`);
  };

  // Live filtered products from search
  const liveSearchResults = (products || []).filter(item => {
    if (!searchInput.trim()) return false;
    const term = searchInput.toLowerCase();
    return (
      item.name?.toLowerCase().includes(term) ||
      item.category?.toLowerCase().includes(term) ||
      item.brand?.toLowerCase().includes(term) ||
      item.subCategory?.toLowerCase().includes(term)
    );
  }).slice(0, 6);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setCartItems({});
    setUser && setUser(null);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#d70018] text-white shadow-md select-none">
      
      {/* Top Notification Bar (CellphoneS signature) */}
      <div className="bg-[#ba0014] text-white text-[11px] py-1 px-4 hidden md:block border-b border-red-700/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          <div className="flex items-center gap-5 text-red-100">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Sản phẩm <strong>Chính hãng - Xuất VAT đầy đủ</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <strong>Giao nhanh 2h - Miễn phí</strong> cho đơn từ 300k
            </span>
            <span>•</span>
            <span className="hidden lg:inline font-medium">
              <strong>Thu cũ</strong> trợ giá đến <strong>4.000.000đ</strong>
            </span>
          </div>

          <div className="flex items-center gap-5 text-red-100">
            <Link to="/contact" className="hover:text-white transition-colors flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span>Cửa hàng gần bạn</span>
            </Link>
            <Link to="/orders" className="hover:text-white transition-colors flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Tra cứu đơn hàng</span>
            </Link>
            <a href="tel:18006868" className="hover:text-white font-bold flex items-center gap-1">
              <span>Hotline:</span>
              <span className="text-yellow-300">1800 6868</span>
            </a>
          </div>

        </div>
      </div>

      {/* Main Red Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-white px-2 py-0.5 rounded-xl shadow-xs flex items-center hover:opacity-95 transition-opacity">
              <img src={assets.logo} alt="Minh Tuấn - PC & Điện Thoại" className="h-7 sm:h-9 w-auto object-contain" />
            </div>
          </Link>

          {/* Category Dropdown Button */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setCategoryDropdown(!categoryDropdown)}
              className="flex items-center gap-2 px-3 py-2 bg-red-700/60 hover:bg-red-800/80 rounded-xl text-xs font-bold transition-all border border-red-500/30"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              <span>Danh mục</span>
              <svg className={`w-3.5 h-3.5 transition-transform ${categoryDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu with Mega Menu */}
            {categoryDropdown && (
              <div
                onMouseLeave={() => {
                  setCategoryDropdown(false);
                  setNavbarHoveredCategory(null);
                }}
                className="absolute top-full left-0 mt-2 w-64 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-fadeIn"
              >
                {CATEGORY_MENU.map((cat, idx) => (
                  <Link
                    key={idx}
                    to={cat.path}
                    onMouseEnter={() => setNavbarHoveredCategory(cat.name)}
                    onClick={() => {
                      setCategoryDropdown(false);
                      setNavbarHoveredCategory(null);
                    }}
                    className={`flex items-center justify-between px-4 py-2.5 text-xs font-semibold transition-colors ${
                      navbarHoveredCategory === cat.name
                        ? 'bg-red-50 text-[#d70018]'
                        : 'text-slate-700 hover:bg-red-50 hover:text-[#d70018]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={cat.icon} alt="" className="w-5 h-5 object-contain opacity-80" />
                      <span>{cat.name}</span>
                    </div>
                    {cat.badge && (
                      <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold">
                        {cat.badge}
                      </span>
                    )}
                  </Link>
                ))}

                {/* Navbar Flyout Mega Menu */}
                {navbarHoveredCategory && MEGA_MENU_DATA[navbarHoveredCategory] && (
                  <CategoryMegaMenu
                    categoryKey={navbarHoveredCategory}
                    onClose={() => setNavbarHoveredCategory(null)}
                  />
                )}
              </div>
            )}
          </div>

          {/* Location Selector (CellphoneS style) */}
          <div className="relative hidden xl:block">
            <button
              onClick={() => setShowProvinceSelect(!showProvinceSelect)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700/40 hover:bg-red-800/60 rounded-xl text-[11px] font-medium transition-colors border border-red-500/20"
            >
              <svg className="w-4 h-4 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <div className="text-left leading-tight">
                <p className="text-[9px] text-red-200">Xem giá tại</p>
                <p className="font-bold text-white">{selectedProvince}</p>
              </div>
              <svg className="w-3 h-3 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showProvinceSelect && (
              <div className="absolute top-full left-0 mt-2 w-36 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 text-xs font-semibold">
                {["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ"].map(p => (
                  <button
                    key={p}
                    onClick={() => { setSelectedProvince(p); setShowProvinceSelect(false); }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-red-50 hover:text-[#d70018] ${selectedProvince === p ? 'text-[#d70018] font-bold' : ''}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Central Search Bar with CellphoneS Interactive Dropdown Popup */}
          <div ref={searchBoxRef} className="flex-1 max-w-xl mx-1 sm:mx-2 relative">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchInput}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setIsSearchOpen(true);
                }}
                placeholder="Bạn muốn tìm gì hôm nay? (iPhone 16, MacBook, S24...)"
                className="w-full pl-10 pr-8 py-2 bg-white text-slate-800 text-xs sm:text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-inner placeholder-slate-400 font-medium"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </form>

            {/* CellphoneS Search Dropdown Modal */}
            {isSearchOpen && (
              <div 
                className="absolute top-full left-0 right-0 mt-2 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 max-h-[80vh] overflow-y-auto animate-fadeIn"
              >
                {/* Promotional Deal Banner */}
                <div className="bg-gradient-to-r from-[#d70018] via-[#e61a35] to-[#ba0014] text-white px-3 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🔥</span>
                    <span className="font-black text-xs tracking-tight uppercase">TƯNG BỪNG DEAL KHỦNG - GIẢM ĐẾN 50%</span>
                  </div>
                  <span className="text-[10px] bg-yellow-300 text-slate-900 font-bold px-2 py-0.5 rounded-full">
                    Quà Hot
                  </span>
                </div>

                {/* 1. If typing: Show Live Search Results */}
                {searchInput.trim().length > 0 ? (
                  <div className="p-3">
                    <p className="text-[11px] font-bold text-slate-400 uppercase mb-2">Sản phẩm gợi ý</p>
                    {liveSearchResults.length > 0 ? (
                      <div className="divide-y divide-slate-100">
                        {liveSearchResults.map((item) => (
                          <div
                            key={item._id}
                            onClick={() => handleProductJump(item._id)}
                            className="py-2.5 px-2 flex items-center gap-3 hover:bg-red-50/80 rounded-xl cursor-pointer transition-colors"
                          >
                            <img 
                              src={Array.isArray(item.image) ? item.image[0] : item.image} 
                              alt={item.name} 
                              className="w-12 h-12 object-contain rounded-lg bg-slate-50 border border-slate-100 p-1 shrink-0" 
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs font-black text-[#d70018]">
                                  {Number(item.price || 0).toLocaleString('vi-VN')}đ
                                </span>
                                {item.originalPrice && item.originalPrice > item.price && (
                                  <span className="text-[10px] text-slate-400 line-through">
                                    {Number(item.originalPrice).toLocaleString('vi-VN')}đ
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-semibold shrink-0">
                              {item.category}
                            </span>
                          </div>
                        ))}
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={handleSearch}
                            className="w-full text-center py-2 px-3 bg-red-50 hover:bg-[#d70018] text-[#d70018] hover:text-white rounded-xl text-xs font-bold transition-all border border-red-200 flex items-center justify-center gap-1.5 shadow-2xs group"
                          >
                            <span>Xem tất cả kết quả cho "{searchInput}"</span>
                            <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-xs text-slate-500">
                        <p>Không tìm thấy sản phẩm nào khớp với "{searchInput}"</p>
                        <button
                          type="button"
                          onClick={handleSearch}
                          className="mt-2 inline-block text-[#d70018] font-bold hover:underline"
                        >
                          Tìm kiếm trong toàn bộ danh mục &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* 2. Default: Search History & Trending Devices with Real Images */
                  <div className="p-4 space-y-4">
                    {/* Search History */}
                    {searchHistory.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <span>🕒</span>
                            <span>Lịch sử tìm kiếm</span>
                          </span>
                          <button
                            type="button"
                            onClick={clearSearchHistory}
                            className="text-[11px] text-slate-400 hover:text-red-600 flex items-center gap-1"
                          >
                            <span>Xóa tất cả</span>
                            <span>🗑️</span>
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {searchHistory.map((h, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleTagClick(h)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-red-50 hover:text-[#d70018] text-slate-700 text-xs rounded-lg font-medium transition-colors"
                            >
                              {h}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Trending Devices Grid */}
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2.5">
                        <span>🔥</span>
                        <span>Xu hướng tìm kiếm</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {TRENDING_DEVICES.map((dev, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleTagClick(dev.keyword)}
                            className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-100 hover:border-red-300 hover:bg-red-50/50 cursor-pointer transition-all group"
                          >
                            <img 
                              src={dev.image} 
                              alt={dev.name} 
                              className="w-10 h-10 object-cover rounded-lg bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform shrink-0" 
                            />
                            <span className="text-xs font-semibold text-slate-700 group-hover:text-[#d70018] line-clamp-2">
                              {dev.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons: Orders, Cart, Smember/Account */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Orders Shortcut */}
            <Link
              to="/orders"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-red-700/60 transition-colors text-xs"
            >
              <div className="p-1 rounded-lg bg-red-700/40">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="font-semibold text-xs leading-tight text-left">
                Đơn hàng<br /><span className="text-[10px] text-red-200 font-normal">Của bạn</span>
              </span>
            </Link>

            {/* Wishlist Shortcut Button */}
            <Link
              to="/wishlist"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700/50 hover:bg-red-800/80 rounded-xl transition-all border border-red-500/30 relative"
              title="Danh sách sản phẩm yêu thích"
            >
              <div className="relative">
                <svg className="w-5 h-5 text-white" fill={getWishlistCount && getWishlistCount() > 0 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {getWishlistCount && getWishlistCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-300 text-slate-900 text-[10px] font-black rounded-full h-4 w-4 flex items-center justify-center shadow">
                    {getWishlistCount()}
                  </span>
                )}
              </div>
              <span className="hidden xl:inline text-xs font-bold leading-tight text-left">
                Yêu thích
              </span>
            </Link>

            {/* Cart Button with Count Badge */}
            <Link
              to="/cart"
              className="flex items-center gap-2 px-3 py-1.5 bg-red-700/50 hover:bg-red-800/80 rounded-xl transition-all border border-red-500/30 relative"
            >
              <div className="relative">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-300 text-slate-900 text-[10px] font-black rounded-full h-4 w-4 flex items-center justify-center shadow">
                    {getCartCount()}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold leading-tight text-left">
                Giỏ hàng
              </span>
            </Link>

            {/* Smember / User Account with Seamless Hover Bridge */}
            {token ? (
              <div className="relative group py-1">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-red-700/50 hover:bg-red-800/80 rounded-xl text-xs font-bold transition-all border border-red-500/30">
                  <div className="w-6 h-6 rounded-full bg-yellow-300 text-red-700 font-black flex items-center justify-center text-xs">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <span className="hidden md:inline truncate max-w-[80px]">{user?.name || "Member"}</span>
                </button>

                {/* Dropdown Container: top-full with pt-1.5 continuous bridge so mouse cannot lose hover */}
                <div className="absolute right-0 top-full pt-1.5 w-52 hidden group-hover:block z-50">
                  <div className="bg-white text-slate-800 rounded-2xl shadow-2xl py-2 border border-slate-100 overflow-hidden">
                    <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/70">
                      <p className="font-bold text-xs text-slate-900 truncate">{user?.name || "Khách hàng"}</p>
                      <p className="text-[10px] text-red-600 font-bold flex items-center gap-1">★ Thành viên VIP</p>
                    </div>
                    <Link to="/orders" className="flex items-center gap-2 px-4 py-2 text-xs hover:bg-red-50 hover:text-red-600 font-semibold transition-colors">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span>Đơn hàng của tôi</span>
                    </Link>
                    <Link to="/wishlist" className="flex items-center justify-between px-4 py-2 text-xs hover:bg-red-50 hover:text-red-600 font-semibold transition-colors">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span>Sản phẩm yêu thích</span>
                      </div>
                      {getWishlistCount && getWishlistCount() > 0 && (
                        <span className="bg-red-100 text-red-600 font-black text-[10px] px-1.5 py-0.5 rounded-full">
                          {getWishlistCount()}
                        </span>
                      )}
                    </Link>
                    <Link to="/compare" className="flex items-center gap-2 px-4 py-2 text-xs hover:bg-red-50 hover:text-red-600 font-semibold transition-colors">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span>So sánh sản phẩm AI</span>
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-bold border-t border-slate-100 flex items-center gap-2 transition-colors"
                    >
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700/50 hover:bg-red-800/80 rounded-xl text-xs font-bold transition-all border border-red-500/30"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline">Đăng nhập</span>
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-red-700/50 hover:bg-red-800/80"
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

          </div>

        </div>

        {/* Quick Search Keywords Bar under input */}
        <div className="hidden md:flex items-center gap-2 pt-1.5 text-[11px] text-red-200 overflow-x-auto scrollbar-none">
          <span className="text-red-300 font-medium">Gợi ý tìm kiếm:</span>
          {QUICK_SEARCH_TAGS.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => handleTagClick(tag)}
              className="hover:text-white hover:underline transition-colors whitespace-nowrap bg-red-800/30 px-2 py-0.5 rounded-md"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-xs">
          <div className="w-4/5 max-w-sm bg-white text-slate-800 h-full p-5 overflow-y-auto shadow-2xl animate-slide-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <img src={assets.logo} alt="Minh Tuấn Shop" className="h-7 w-auto object-contain" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-500 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="py-4 space-y-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Danh mục sản phẩm</p>
              {CATEGORY_MENU.map((cat, idx) => (
                <Link
                  key={idx}
                  to={cat.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-red-50 text-xs font-semibold text-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <img src={cat.icon} alt="" className="w-5 h-5 object-contain" />
                    <span>{cat.name}</span>
                  </div>
                  {cat.badge && (
                    <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold">
                      {cat.badge}
                    </span>
                  )}
                </Link>
              ))}

              <div className="pt-2 border-t border-slate-100">
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-red-50 text-xs font-semibold text-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span>Sản phẩm yêu thích</span>
                  </div>
                  {getWishlistCount && getWishlistCount() > 0 && (
                    <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                      {getWishlistCount()}
                    </span>
                  )}
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-xs font-semibold text-slate-700"
                >
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Đơn hàng của tôi</span>
                </Link>
              </div>
            </div>

            {/* Mobile Contact info */}
            <div className="pt-4 border-t border-slate-100 text-xs space-y-2 text-slate-600">
              <p>📞 Hotline: <strong className="text-red-600">1800 6868</strong> (Miễn phí)</p>
              <p>📍 123 Thái Hà, Đống Đa, Hà Nội</p>
              <p>📍 288 Võ Văn Ngân, Thủ Đức, TP.HCM</p>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};

export default Navbar;
