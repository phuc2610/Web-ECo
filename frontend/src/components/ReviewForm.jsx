import React, { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const ReviewForm = ({ productId, orderId, productName, productImage, onSubmitted, onClose }) => {
  const { backendUrl, token } = useContext(ShopContext);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(orderId);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file count
    if (images.length + files.length > 5) {
      toast.error('Tối đa 5 ảnh cho mỗi đánh giá');
      return;
    }

    // Validate file size (5MB each)
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} quá lớn (tối đa 5MB)`);
        return false;
      }
      return true;
    });

    setImages(prev => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImages(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  // Fetch user orders that contain this product and are delivered
  const fetchUserOrders = async () => {
    if (!token) return;
    
    try {
      setLoadingOrders(true);
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        // Filter orders that contain this product and are delivered
        const eligibleOrders = response.data.orders.filter(order => {
          const hasProduct = order.items.some(item => item._id === productId);
          const isDelivered = order.status === "Đã giao hàng";
          return hasProduct && isDelivered;
        });
        
        setUserOrders(eligibleOrders);
        
        // Auto-select first eligible order if no orderId provided
        if (!selectedOrderId && eligibleOrders.length > 0) {
          setSelectedOrderId(eligibleOrders[0]._id);
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (!orderId) {
      fetchUserOrders();
    }
  }, [token, productId, orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedOrderId) {
      toast.error('Vui lòng chọn đơn hàng');
      return;
    }
    
    if (!comment.trim()) {
      toast.error('Vui lòng nhập nội dung đánh giá');
      return;
    }

    if (comment.length > 500) {
      toast.error('Nội dung đánh giá không được quá 500 ký tự');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('productId', productId);
      formData.append('orderId', selectedOrderId);
      formData.append('rating', rating);
      formData.append('comment', comment.trim());

      images.forEach((image, index) => {
        formData.append('images', image);
      });

      const response = await axios.post(
        `${backendUrl}/api/review/add`,
        formData,
        {
          headers: {
            'token': token,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

             if (response.data.success) {
         toast.success('Đánh giá đã được gửi thành công!');
         onSubmitted();
         onClose();
       } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Có lỗi xảy ra khi gửi đánh giá');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {productName ? `Đánh giá: ${productName}` : 'Viết đánh giá'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Info */}
            {productName && productImage && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <img 
                  src={productImage} 
                  alt={productName}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-medium text-gray-800">{productName}</h4>
                  <p className="text-sm text-gray-600">Sản phẩm đã giao</p>
                </div>
              </div>
            )}

            {/* Order Selection */}
            {!orderId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn đơn hàng *
                </label>
                {loadingOrders ? (
                  <div className="text-sm text-gray-500">Đang tải danh sách đơn hàng...</div>
                ) : userOrders.length === 0 ? (
                  <div className="text-sm text-red-500">
                    Bạn chưa có đơn hàng nào đã giao cho sản phẩm này
                  </div>
                ) : (
                  <select
                    value={selectedOrderId || ''}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Chọn đơn hàng</option>
                    {userOrders.map((order) => (
                      <option key={order._id} value={order._id}>
                        Đơn hàng #{order._id.slice(-8)} - {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Đánh giá của bạn *
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl transition-colors ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    } hover:text-yellow-400`}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {rating}/5 sao
                </span>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung đánh giá *
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="4"
                maxLength="500"
              />
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">
                  Tối đa 500 ký tự
                </span>
                <span className={`text-xs ${comment.length > 450 ? 'text-red-500' : 'text-gray-500'}`}>
                  {comment.length}/500
                </span>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thêm ảnh (tùy chọn)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="review-images"
                  disabled={images.length >= 5}
                />
                <label
                  htmlFor="review-images"
                  className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                    images.length >= 5
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } transition-colors`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Chọn ảnh
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Tối đa 5 ảnh, mỗi ảnh tối đa 5MB
                </p>
              </div>

              {/* Image Previews */}
              {previewImages.length > 0 && (
                <div className="mt-4 grid grid-cols-5 gap-2">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Hủy
              </button>
                             <button
                 type="submit"
                 disabled={isSubmitting || !comment.trim() || (!orderId && !selectedOrderId)}
                 className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                   isSubmitting || !comment.trim() || (!orderId && !selectedOrderId)
                     ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                     : 'bg-blue-600 text-white hover:bg-blue-700'
                 }`}
               >
                 {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
               </button>
            </div>
          </form>
        </div>
    );
};

export default ReviewForm;