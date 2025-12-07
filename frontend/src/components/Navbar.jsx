import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems, user, setUser } = useContext(ShopContext);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setCartItems({});
    setUser && setUser(null);
  };

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 w-full">
             <div className="w-full flex items-center justify-between py-4 pl-2 pr-1 sm:pl-4 sm:pr-2 lg:pl-6 lg:pr-3 font-medium">
        <Link to="/" className="flex items-center">
          <img src={assets.logo} className="w-36 hover:scale-105 transition-transform" alt="TLook Logo" />
        </Link>
        
                 <ul className="hidden md:flex items-center gap-6 text-sm font-medium">
                     <NavLink to="/" className="relative py-2 px-2 text-gray-700 hover:text-blue-600 transition-colors group">
            <span>TRANG CHỦ</span>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
          </NavLink>
                     <NavLink to="/collection" className="relative py-2 px-2 text-gray-700 hover:text-blue-600 transition-colors group">
            <span>SẢN PHẨM</span>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
          </NavLink>
          <NavLink to="/about" className="relative py-2 px-2 text-gray-700 hover:text-blue-600 transition-colors group">
            <span>GIỚI THIỆU</span>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
          </NavLink>
          <NavLink to="/contact" className="relative py-2 px-2 text-gray-700 hover:text-blue-600 transition-colors group">
            <span>LIÊN HỆ</span>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
          </NavLink>
        </ul>

                 <div className="flex items-center gap-2">
          {/* Search Button */}
                     <button 
             onClick={() => setShowSearch(true)} 
             className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
             aria-label="Search"
           >
            <img src={assets.search_icon} className="w-5 h-5" alt="Search" />
          </button>

          {/* Profile Dropdown */}
          <div className="group relative">
                         <div className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-gray-100 rounded-full transition-colors">
              <img
                onClick={() => (token ? null : navigate("/login"))}
                src={assets.profile_icon}
                className="w-5 h-5"
                alt="Profile"
              />
              {user && token && (
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {user.name}
                </span>
              )}
            </div>
            
            {/* Dropdown Menu */}
            {token && (
              <div className="group-hover:block hidden absolute right-0 pt-2 z-10">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-48">
                  <button 
                    onClick={() => navigate("/profile")} 
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                  >
                    <span>👤</span>
                    Hồ sơ của tôi
                  </button>
                  <button 
                    onClick={() => navigate("/orders")} 
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                  >
                    <span>📦</span>
                    Đơn hàng của tôi
                  </button>
                  <button 
                    onClick={() => navigate("/wishlist")} 
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                  >
                    <span>❤️</span>
                    Sản phẩm yêu thích
                  </button>
                  <button 
                    onClick={() => navigate("/compare")} 
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                  >
                    <span>⚖️</span>
                    Phân tích sản phẩm
                  </button>
                  <hr className="my-1 border-gray-100" />
                  <button 
                    onClick={logout} 
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <span>🚪</span>
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
                     <Link to="/cart" className="relative p-1.5 hover:bg-gray-100 rounded-full transition-colors group">
            <img src={assets.cart_icon} className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Cart" />
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 text-center leading-5 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-xs font-bold shadow-md">
                {getCartCount()}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
                     <button 
             onClick={() => setVisible(true)} 
             className="md:hidden p-1.5 hover:bg-gray-100 rounded-full transition-colors"
             aria-label="Menu"
           >
            <img src={assets.menu_icon} className="w-5 h-5" alt="Menu" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {visible && (
        <div className="fixed top-0 right-0 h-full bg-gradient-to-br from-white via-blue-50 to-white border-l-4 border-blue-500 shadow-2xl z-[9999] w-80 md:hidden animate-slideInRight">
          <div className="flex flex-col h-full bg-white/95 backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b-2 border-blue-100 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <img src={assets.logo} className="w-24" alt="TLook Logo" />
              <button 
                onClick={() => setVisible(false)} 
                className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

          {/* Navigation Links */}
          <nav className="flex-1 py-6 bg-white">
            <NavLink 
              onClick={() => setVisible(false)} 
              className="flex items-center gap-3 px-6 py-4 text-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white border-l-4 border-transparent hover:border-white transition-all duration-300 font-medium" 
              to="/"
            >
              TRANG CHỦ
            </NavLink>
            <NavLink 
              onClick={() => setVisible(false)} 
              className="flex items-center gap-3 px-6 py-4 text-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white border-l-4 border-transparent hover:border-white transition-all duration-300 font-medium" 
              to="/collection"
            >
              SẢN PHẨM
            </NavLink>
            <NavLink 
              onClick={() => setVisible(false)} 
              className="flex items-center gap-3 px-6 py-4 text-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white border-l-4 border-transparent hover:border-white transition-all duration-300 font-medium" 
              to="/about"
            >
              GIỚI THIỆU
            </NavLink>
            <NavLink 
              onClick={() => setVisible(false)} 
              className="flex items-center gap-3 px-6 py-4 text-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white border-l-4 border-transparent hover:border-white transition-all duration-300 font-medium" 
              to="/contact"
            >
              LIÊN HỆ
            </NavLink>
          </nav>

          {/* User Info */}
          {user && token && (
            <div className="border-t-2 border-blue-100 bg-gradient-to-r from-gray-50 to-blue-50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-base">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              <button 
                onClick={logout} 
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Đăng xuất
              </button>
            </div>
          )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {visible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-[9998] md:hidden backdrop-blur-sm" 
          onClick={() => setVisible(false)}
        ></div>
      )}
    </div>
  );
};

export default Navbar;
