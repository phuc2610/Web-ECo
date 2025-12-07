import React, { useContext, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets'
import RelatedProducts from '../components/RelatedProducts';
import ReviewList from '../components/ReviewList';
import axios from 'axios';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, currency, addToCart, setBuyNowItem, token, user, backendUrl } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const fetchProductData = async () => {
    if (products && products.length > 0) {
      const product = products.find((item) => item._id === productId);
      if (product) {
        setProductData(product);
      }
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  const hasDiscount = productData?.originalPrice && productData.originalPrice > productData.price;
  const discountPercent = hasDiscount ? Math.round((1 - (productData.price / productData.originalPrice)) * 100) : 0;

  const handleBuyNow = () => {
    if (selectedSize && productData.stockQuantities?.[selectedSize] > 0) {
      // Set buy now item in context
      const buyNowItem = {
        _id: productData._id,
        size: selectedSize,
        quantity: 1,
        product: productData
      };
      setBuyNowItem(buyNowItem);
      
      // Navigate directly to place-order
      navigate('/place-order');
    }
  };

  const handleReviewSubmitted = () => {
    setReviewSubmitted(prev => !prev);
  };

  // Fetch reviews for the product
  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await axios.get(`${backendUrl}/api/review/product/${productId}`);
      
      if (response.data.success) {
        setReviews(response.data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Fetch reviews when product data is loaded
  useEffect(() => {
    if (productData && productId) {
      fetchReviews();
    }
  }, [productData, productId]);

  // Refresh reviews when a new one is submitted
  useEffect(() => {
    if (reviewSubmitted) {
      fetchReviews();
    }
  }, [reviewSubmitted]);

  const handleWriteReview = () => {
    // Navigate to orders page with a message to write review
    navigate('/orders');
    toast.info('Vui lòng vào trang "Đơn hàng của tôi" để đánh giá sản phẩm sau khi đơn hàng đã được giao.');
  };

  return productData ? (
    <div className='min-h-screen bg-gray-50'>
      {/* Product Hero Section */}
      <div className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            
            {/* Image Gallery */}
            <div className='space-y-4'>
              {/* Main Image Swiper */}
              <div className='relative'>
                <Swiper
                  spaceBetween={0}
                  navigation={true}
                  pagination={{ clickable: true }}
                  thumbs={{ swiper: thumbsSwiper }}
                  modules={[Navigation, Pagination, Thumbs]}
                  className='main-swiper rounded-2xl overflow-hidden shadow-lg'
                >
                  {productData.image.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className='aspect-square bg-gray-100'>
                        <img 
                          src={image} 
                          alt={`${productData.name} - ${index + 1}`}
                          className='w-full h-full object-cover'
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                
                {/* Discount Badge */}
                {hasDiscount && (
                  <div className='absolute top-4 left-4 z-10'>
                    <span className='inline-block px-3 py-1 rounded-full text-sm font-bold shadow-lg bg-red-500 text-white'>
                      -{discountPercent}%
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail Swiper */}
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={12}
                slidesPerView={4}
                watchSlidesProgress={true}
                modules={[Thumbs]}
                className='thumbs-swiper'
              >
                {productData.image.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className='aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-blue-500 transition-colors'>
                      <img 
                        src={image} 
                        alt={`Thumbnail ${index + 1}`}
                        className='w-full h-full object-cover'
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Product Info */}
            <div className='space-y-6'>
              {/* Product Title & Rating */}
              <div>
                <h1 className='text-3xl lg:text-4xl font-bold text-gray-900 leading-tight'>
                  {productData.name}
                </h1>
                {(productData.averageRating > 0 || productData.totalReviews > 0) && (
                  <div className='flex items-center gap-2 mt-3'>
                    <div className='flex items-center gap-1'>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star} 
                          className={`w-5 h-5 ${
                            star <= Math.round(productData.averageRating || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                          viewBox='0 0 20 20'
                        >
                          <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                        </svg>
                      ))}
                    </div>
                    <span className='text-gray-600 font-medium'>
                      {productData.averageRating ? productData.averageRating.toFixed(1) : '0.0'}
                    </span>
                    <span className='text-gray-400'>
                      ({productData.totalReviews || 0} đánh giá)
                    </span>
                  </div>
                )}
              </div>

              {/* Price Section */}
              <div className='bg-gray-50 rounded-xl p-6'>
                <div className='flex items-baseline gap-3'>
                  {hasDiscount && (
                    <span className='text-2xl text-gray-400 line-through'>
                      {productData.originalPrice.toLocaleString('vi-VN')}{currency}
                    </span>
                  )}
                  <span className='text-4xl font-bold text-red-600'>
                    {productData.price.toLocaleString('vi-VN')}{currency}
                  </span>
                </div>
                {hasDiscount && (
                  <p className='text-green-600 font-medium mt-2'>
                    Tiết kiệm {(productData.originalPrice - productData.price).toLocaleString('vi-VN')}{currency} ({discountPercent}%)
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-3'>Mô tả sản phẩm</h3>
                <p className='text-gray-600 leading-relaxed'>{productData.description}</p>
              </div>

              {/* Size Selection */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-gray-900'>Chọn thông số kỹ thuật</h3>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                  {productData.sizes.map((size, index) => {
                    const stockQuantity = productData.stockQuantities?.[size] || 0;
                    const isOutOfStock = stockQuantity <= 0;
                    const isSelected = selectedSize === size;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => !isOutOfStock && setSelectedSize(size)}
                        disabled={isOutOfStock}
                        className={`
                          relative p-4 rounded-xl border-2 transition-all duration-200 font-medium
                          ${isOutOfStock 
                            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                            : isSelected 
                              ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' 
                              : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                          }
                        `}
                      >
                        <span className='block'>{size}</span>
                        <span className={`block text-xs mt-1 ${
                          isOutOfStock ? 'text-red-500' : 'text-green-600'
                        }`}>
                          {isOutOfStock ? 'Hết hàng' : `Còn ${stockQuantity} cái`}
                        </span>
                      </button>
                    );
                  })}
                </div>
                
                {!selectedSize && (
                  <p className='text-orange-600 text-sm flex items-center gap-2'>
                    <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                    </svg>
                    Vui lòng chọn thông số kỹ thuật để thêm vào giỏ hàng
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className='space-y-3'>
                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  disabled={!selectedSize || (productData.stockQuantities?.[selectedSize] <= 0)}
                  className={`
                    w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200
                    ${!selectedSize || (productData.stockQuantities?.[selectedSize] <= 0)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 active:scale-95 shadow-lg'
                    }
                  `}
                >
                  {!selectedSize 
                    ? 'CHỌN THÔNG SỐ KỸ THUẬT' 
                    : (productData.stockQuantities?.[selectedSize] <= 0)
                      ? 'HẾT HÀNG'
                      : 'MUA NGAY'
                  }
                </button>

                {/* Add to Cart Button */}
                <button
                  onClick={() => {
                    if (selectedSize && productData.stockQuantities?.[selectedSize] > 0) {
                      addToCart(productData._id, selectedSize);
                    }
                  }}
                  disabled={!selectedSize || (productData.stockQuantities?.[selectedSize] <= 0)}
                  className={`
                    w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200
                    ${!selectedSize || (productData.stockQuantities?.[selectedSize] <= 0)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 active:scale-95 shadow-lg'
                    }
                  `}
                >
                  {!selectedSize 
                    ? 'CHỌN THÔNG SỐ KỸ THUẬT' 
                    : (productData.stockQuantities?.[selectedSize] <= 0)
                      ? 'HẾT HÀNG'
                      : 'THÊM VÀO GIỎ HÀNG'
                  }
                </button>
              </div>

              {/* Product Features */}
              <div className='bg-blue-50 rounded-xl p-6 space-y-3'>
                <h3 className='font-semibold text-blue-900'>Cam kết của chúng tôi</h3>
                <div className='space-y-2 text-sm text-blue-800'>
                  <div className='flex items-center gap-2'>
                    <svg className='w-4 h-4 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                    </svg>
                    Sản phẩm công nghệ chính hãng 100%
                  </div>
                  <div className='flex items-center gap-2'>
                    <svg className='w-4 h-4 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                    </svg>
                    Hỗ trợ giao hàng toàn quốc, thanh toán khi nhận hàng
                  </div>
                  <div className='flex items-center gap-2'>
                    <svg className='w-4 h-4 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                    </svg>
                    Bảo hành chính hãng, đổi trả dễ dàng trong 7 ngày
                  </div>
                  <div className='flex items-center gap-2'>
                    <svg className='w-4 h-4 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                    </svg>
                    Tư vấn chọn sản phẩm phù hợp miễn phí
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Reviews Section */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='bg-white rounded-2xl shadow-sm border overflow-hidden'>
          <div className='border-b border-gray-200'>
            <div className='flex'>
              <button 
                onClick={() => setActiveTab('description')}
                className={`px-8 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'description'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                Mô tả chi tiết
              </button>
              <button 
                onClick={() => setActiveTab('reviews')}
                className={`px-8 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'reviews'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                Đánh giá & Bình luận
              </button>
            </div>
          </div>
          <div className='p-8'>
            {activeTab === 'description' ? (
              <div className='prose max-w-none text-gray-600'>
                <p className='leading-relaxed'>{productData.description}</p>
              </div>
            ) : (
              <div className='space-y-6'>
                {/* Review Header */}
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-4'>
                    {(productData.averageRating > 0 || productData.totalReviews > 0) ? (
                      <div className='text-center'>
                        <div className='text-2xl font-bold text-gray-800'>
                          {productData.averageRating?.toFixed(1) || '0.0'}
                        </div>
                        <div className='flex items-center justify-center space-x-1 mt-1'>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-lg ${
                                star <= Math.round(productData.averageRating || 0)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <div className='text-sm text-gray-600 mt-1'>
                          {productData.totalReviews || 0} đánh giá
                        </div>
                      </div>
                    ) : (
                      <div className='text-center'>
                        <div className='text-lg text-gray-500'>
                          Chưa có đánh giá nào
                        </div>
                        <div className='text-sm text-gray-400 mt-1'>
                          Hãy là người đầu tiên đánh giá sản phẩm này
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Write Review Button */}
                  {token && user && (
                    <button
                      onClick={handleWriteReview}
                      className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2'
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      Viết đánh giá
                    </button>
                  )}
                </div>

                {/* Review List */}
                <ReviewList 
                  productId={productId} 
                  reviews={reviews}
                  loading={reviewsLoading}
                  showEmptyState={productData.totalReviews === 0}
                />
              </div>
            )}
          </div>
        </div>
      </div>



      {/* Related Products */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16'>
        <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
      </div>
    </div>
  ) : (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
    </div>
  );
};

export default Product;