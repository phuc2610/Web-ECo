import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import WishlistProductItem from '../components/WishlistProductItem';

const Wishlist = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingItem, setRemovingItem] = useState(null);

  // Fetch wishlist data
  const fetchWishlist = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/wishlist/list`, {
        headers: { token }
      });

      if (response.data.success) {
        setWishlist(response.data.wishlist);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      console.error('Error details:', error.response?.data);
      toast.error(`Không thể tải danh sách yêu thích: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [token]);

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    if (!token) {
      toast.error('Vui lòng đăng nhập để sử dụng tính năng này');
      return;
    }

    try {
      setRemovingItem(productId);
      const response = await axios.delete(`${backendUrl}/api/wishlist/remove/${productId}`, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success('Đã xóa khỏi danh sách yêu thích');
        setWishlist(prev => prev.filter(item => item.productId._id !== productId));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Có lỗi xảy ra khi xóa khỏi danh sách yêu thích');
    } finally {
      setRemovingItem(null);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải danh sách yêu thích...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">💔</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Chưa đăng nhập</h2>
          <p className="text-gray-600 mb-6">
            Vui lòng đăng nhập để xem danh sách sản phẩm yêu thích của bạn
          </p>
          <Link
            to="/login"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">💔</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Danh sách yêu thích trống</h2>
          <p className="text-gray-600 mb-6">
            Bạn chưa có sản phẩm nào trong danh sách yêu thích. Hãy khám phá và thêm sản phẩm yêu thích!
          </p>
          <Link
            to="/collection"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sản phẩm yêu thích</h1>
          <p className="text-gray-600">
            {wishlist.length} sản phẩm trong danh sách yêu thích của bạn
          </p>
        </div>

                 {/* Wishlist Grid */}
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
           {wishlist.map((item, index) => (
             <motion.div
               key={item._id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, delay: index * 0.1 }}
               className="relative"
             >
               {/* Remove Button */}
               <button
                 onClick={() => removeFromWishlist(item.productId._id)}
                 disabled={removingItem === item.productId._id}
                 className="absolute top-1 right-1 z-10 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
               >
                 {removingItem === item.productId._id ? (
                   <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                 ) : (
                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                 )}
               </button>

                               {/* Product Item */}
                <WishlistProductItem
                  id={item.productId._id}
                  image={item.productId.image}
                  name={item.productId.name}
                  price={item.productId.price}
                  originalPrice={item.productId.originalPrice}
                  averageRating={item.productId.averageRating}
                  totalReviews={item.productId.totalReviews}
                />
             </motion.div>
           ))}
         </div>

        {/* Empty State (if all items removed) */}
        {wishlist.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Danh sách yêu thích trống</h2>
            <p className="text-gray-600 mb-6">
              Bạn chưa có sản phẩm nào trong danh sách yêu thích
            </p>
            <Link
              to="/collection"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Wishlist;
