import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

const Wishlist = () => {
  const { backendUrl, token, currency, products, addToCart } = useContext(ShopContext);
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  // Fetch or load from localStorage
  const loadWishlist = async () => {
    setLoading(true);
    if (token) {
      try {
        const response = await axios.get(`${backendUrl}/api/wishlist/list`, {
          headers: { token }
        });
        if (response.data.success && response.data.wishlist) {
          // Normalize items
          const items = response.data.wishlist
            .filter(w => w.productId)
            .map(w => w.productId);
          setWishlist(items);
        }
      } catch (err) {
        console.error('API Wishlist error, falling back to local:', err);
        loadLocalWishlist();
      } finally {
        setLoading(false);
      }
    } else {
      loadLocalWishlist();
      setLoading(false);
    }
  };

  const loadLocalWishlist = () => {
    try {
      const saved = localStorage.getItem('mt_guest_wishlist');
      if (saved) {
        const ids = JSON.parse(saved);
        const matched = (products || []).filter(p => ids.includes(p._id));
        setWishlist(matched);
      } else {
        // Sample default favorites if empty for demonstration
        setWishlist([]);
      }
    } catch {
      setWishlist([]);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, [token, products]);

  // Remove from wishlist
  const handleRemove = async (productId, e) => {
    if (e) e.stopPropagation();
    setRemovingId(productId);

    if (token) {
      try {
        await axios.delete(`${backendUrl}/api/wishlist/remove/${productId}`, {
          headers: { token }
        });
      } catch (err) {
        console.log('Wishlist remove error:', err);
      }
    }

    // Always update local list
    try {
      const saved = localStorage.getItem('mt_guest_wishlist');
      if (saved) {
        const ids = JSON.parse(saved).filter(id => id !== productId);
        localStorage.setItem('mt_guest_wishlist', JSON.stringify(ids));
      }
    } catch {}

    setWishlist(prev => prev.filter(item => item._id !== productId));
    toast.success('Đã xóa khỏi danh sách yêu thích');
    setRemovingId(null);
  };

  // Add single item to cart
  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation();
    const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Tiêu chuẩn';
    addToCart(product._id, size);
    toast.success(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  // Add all to cart
  const handleAddAllToCart = () => {
    if (wishlist.length === 0) return;
    wishlist.forEach(item => {
      const size = item.sizes && item.sizes.length > 0 ? item.sizes[0] : 'Tiêu chuẩn';
      addToCart(item._id, size);
    });
    toast.success(`Đã thêm tất cả ${wishlist.length} sản phẩm vào giỏ hàng!`);
    navigate('/cart');
  };

  // Clear all
  const handleClearAll = () => {
    setWishlist([]);
    try {
      localStorage.removeItem('mt_guest_wishlist');
    } catch {}
    toast.info('Đã làm trống danh sách yêu thích');
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#f4f6f8]">
        <div className="w-10 h-10 border-4 border-red-200 border-t-[#d70018] rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold text-slate-500">Đang tải danh sách yêu thích...</p>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#f4f6f8] py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-2xs">
            <Link to="/" className="hover:text-[#d70018]">Trang chủ</Link>
            <span>/</span>
            <span className="text-[#d70018] font-bold">Sản phẩm yêu thích ({wishlist.length})</span>
          </nav>

          {/* Header Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                <span className="p-1.5 bg-red-50 text-[#d70018] rounded-xl text-lg">❤️</span>
                <span>Danh Sách Sản Phẩm Yêu Thích</span>
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Lưu lại các thiết bị công nghệ bạn quan tâm để dễ dàng theo dõi biến động giá và đặt mua nhanh chóng.
              </p>
            </div>

            {wishlist.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClearAll}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-red-50 hover:text-red-600 text-slate-600 text-xs font-bold transition-all"
                >
                  Xóa tất cả
                </button>
                <button
                  onClick={handleAddAllToCart}
                  className="px-4 py-2 bg-[#d70018] hover:bg-[#ba0014] text-white rounded-xl text-xs font-black transition-all shadow-md active:scale-95 uppercase tracking-wide"
                >
                  Thêm tất cả vào giỏ 🛒
                </button>
              </div>
            )}
          </div>

          {/* Empty State */}
          {wishlist.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-lg mx-auto space-y-5 my-8">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-4xl mx-auto text-red-500 shadow-inner">
                🤍
              </div>
              <div className="space-y-1.5">
                <h2 className="text-lg font-black text-slate-800 uppercase">Danh sách yêu thích đang trống</h2>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  Hãy nhấn vào biểu tượng trái tim ở bất kỳ sản phẩm nào để lưu lại và theo dõi giá sốc tại Minh Tuấn Shop.
                </p>
              </div>
              <Link
                to="/collection"
                className="inline-block py-3 px-8 bg-[#d70018] hover:bg-[#ba0014] text-white font-black text-xs rounded-xl shadow-md transition-all uppercase tracking-wider"
              >
                Khám phá sản phẩm ngay &rarr;
              </Link>
            </div>
          ) : (
            /* Products Grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {wishlist.map(product => {
                const discount = product.originalPrice && product.originalPrice > product.price
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : null;

                return (
                  <div
                    key={product._id}
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="group bg-white rounded-2xl p-3 border border-slate-200/80 hover:border-red-300 hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer relative"
                  >
                    {/* Discount & Remove badges */}
                    <div className="flex items-center justify-between w-full mb-1">
                      {discount ? (
                        <span className="bg-[#d70018] text-white font-black text-[10px] px-1.5 py-0.5 rounded">
                          Giảm {discount}%
                        </span>
                      ) : (
                        <span className="bg-blue-600 text-white font-bold text-[10px] px-1.5 py-0.5 rounded">
                          Trả góp 0%
                        </span>
                      )}

                      <button
                        onClick={(e) => handleRemove(product._id, e)}
                        disabled={removingId === product._id}
                        className="w-6 h-6 rounded-full bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-600 flex items-center justify-center transition-colors text-xs"
                        title="Xóa khỏi yêu thích"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Image Thumbnail */}
                    <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden p-2 my-2 flex items-center justify-center">
                      <img
                        src={product.image && product.image[0]}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Title */}
                    <h3 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-[#d70018] transition-colors mb-2">
                      {product.name}
                    </h3>

                    {/* Pricing */}
                    <div className="space-y-0.5 mb-3">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-black text-[#d70018]">
                          {product.price?.toLocaleString()} {currency}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[10px] text-slate-400 line-through">
                            {product.originalPrice?.toLocaleString()} {currency}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-emerald-600 font-medium">
                        ✓ Sẵn hàng tại cửa hàng
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="w-full py-2 bg-[#d70018] hover:bg-[#ba0014] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                      >
                        <span>🛒</span>
                        <span>THÊM VÀO GIỎ</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </PageTransition>
  );
};

export default Wishlist;
