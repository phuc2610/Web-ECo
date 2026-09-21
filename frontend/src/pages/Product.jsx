import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';
import RelatedProducts from '../components/RelatedProducts';
import ReviewList from '../components/ReviewList';
import RecentlyViewed from '../components/RecentlyViewed';
import { trackProductView } from '../utils/analyticsTracker';
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
  const [productData, setProductData] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeTab, setActiveTab] = useState('specs');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    if (products && products.length > 0) {
      const product = products.find((item) => item._id === productId);
      if (product) {
        setProductData(product);
        trackProductView(product, user);
        // Default select first available variant
        if (product.sizes && product.sizes.length > 0) {
          const firstInStock = product.sizes.find(s => (product.stockQuantities?.[s] || 0) > 0) || product.sizes[0];
          setSelectedVariant(firstInStock);
        }
      }
    }
  }, [productId, products, user]);

  const hasDiscount = productData?.originalPrice && productData.originalPrice > productData.price;
  const discountPercent = hasDiscount ? Math.round((1 - (productData.price / productData.originalPrice)) * 100) : 0;

  const handleBuyNow = () => {
    if (!selectedVariant) {
      toast.error('Vui lòng chọn phiên bản trước khi mua');
      return;
    }
    const stockQuantity = productData.stockQuantities?.[selectedVariant] || productData.stockQuantity || 10;
    if (stockQuantity <= 0) {
      toast.error('Phiên bản này đã hết hàng');
      return;
    }

    const buyNowItem = {
      _id: productData._id,
      size: selectedVariant,
      quantity: quantity,
      product: productData
    };
    setBuyNowItem(buyNowItem);
    navigate('/place-order');
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error('Vui lòng chọn phiên bản / dung lượng');
      return;
    }
    const stockQuantity = productData.stockQuantities?.[selectedVariant] || productData.stockQuantity || 10;
    if (stockQuantity <= 0) {
      toast.error('Phiên bản này đã hết hàng');
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(productData._id, selectedVariant);
    }
  };

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

  useEffect(() => {
    if (productData && productId) {
      fetchReviews();
    }
  }, [productData, productId, reviewSubmitted]);

  // Labels based on category
  const isMobileOrTablet = productData?.category === 'Điện thoại' || productData?.category === 'Máy tính bảng';
  const isLaptopOrPC = productData?.category === 'Laptop' || productData?.category === 'PC';
  const variantTitle = isMobileOrTablet ? 'Chọn dung lượng / Phiên bản' : isLaptopOrPC ? 'Chọn cấu hình phần cứng' : 'Chọn phiên bản';

  if (!productData) {
    return (
      <div className='min-h-[60vh] flex flex-col items-center justify-center space-y-4'>
        <div className='w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
        <p className='text-sm text-slate-500 font-medium'>Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  const images = Array.isArray(productData.image) && productData.image.length > 0 
    ? productData.image 
    : [productData.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'];

  const currentVariantStock = productData.stockQuantities?.[selectedVariant] ?? productData.stockQuantity ?? 10;

  return (
    <div className='min-h-screen bg-slate-50 py-6 sm:py-10'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8'>
        
        {/* Breadcrumb Navigation */}
        <nav className='flex items-center gap-2 text-xs text-slate-500'>
          <Link to='/' className='hover:text-blue-600'>Trang chủ</Link>
          <span>/</span>
          <Link to={`/collection?category=${encodeURIComponent(productData.category || '')}`} className='hover:text-blue-600'>
            {productData.category}
          </Link>
          <span>/</span>
          <span className='text-slate-800 font-medium truncate max-w-xs'>{productData.name}</span>
        </nav>

        {/* Product Main Container */}
        <div className='bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12'>

            {/* Left: Gallery (5 cols) */}
            <div className='lg:col-span-5 space-y-4'>
              <div className='relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner'>
                <Swiper
                  spaceBetween={10}
                  navigation={true}
                  pagination={{ clickable: true }}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  modules={[Navigation, Pagination, Thumbs]}
                  className='main-swiper aspect-square'
                >
                  {images.map((img, index) => (
                    <SwiperSlide key={index}>
                      <div className='w-full h-full flex items-center justify-center p-4'>
                        <img
                          src={img}
                          alt={`${productData.name} - ${index + 1}`}
                          className='max-w-full max-h-full object-contain'
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Discount Badge */}
                {hasDiscount && (
                  <div className='absolute top-3 left-3 z-10'>
                    <span className='px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-md'>
                      GIẢM {discountPercent}%
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={8}
                  slidesPerView={Math.min(images.length, 5)}
                  watchSlidesProgress={true}
                  modules={[Thumbs]}
                  className='thumbs-swiper'
                >
                  {images.map((img, index) => (
                    <SwiperSlide key={index}>
                      <div className='aspect-square rounded-xl overflow-hidden border-2 border-slate-200 cursor-pointer hover:border-blue-500 transition-all p-1 bg-white'>
                        <img src={img} alt='thumb' className='w-full h-full object-contain' />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}

              {/* Assurance Box Under Image */}
              <div className='bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs text-slate-600'>
                <div className='flex items-center gap-2 font-bold text-slate-800'>
                  <span className='text-emerald-500 text-base'>✓</span>
                  <span>Bảo hành chính hãng {productData.warrantyMonths || 12} tháng</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-blue-500 text-base'>🔄</span>
                  <span>1 đổi 1 trong 30 ngày nếu phát sinh lỗi phần cứng</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-orange-500 text-base'>⚡</span>
                  <span>Giao hỏa tốc 2 giờ hoặc nhận tại cửa hàng</span>
                </div>
              </div>
            </div>

            {/* Right: Product Info & Actions (7 cols) */}
            <div className='lg:col-span-7 space-y-6'>
              
              {/* Header: Brand & Title & Rating */}
              <div>
                <div className='flex items-center gap-2 mb-2'>
                  <span className='px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-md border border-blue-200'>
                    {productData.brand || productData.subCategory || 'Chính hãng'}
                  </span>
                  {productData.bestseller && (
                    <span className='px-2.5 py-0.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-md border border-amber-200'>
                      🔥 Bán chạy
                    </span>
                  )}
                  <span className='text-xs text-slate-400'>Mã SP: {productData._id?.slice(-6).toUpperCase()}</span>
                </div>

                <h1 className='text-2xl sm:text-3xl font-black text-slate-900 leading-snug'>
                  {productData.name}
                </h1>

                {/* Rating summary */}
                <div className='flex items-center gap-3 mt-3 text-xs'>
                  <div className='flex items-center gap-1 text-amber-400 font-bold'>
                    <span>★</span>
                    <span className='text-slate-800 font-black text-sm'>{productData.averageRating || 4.9}</span>
                  </div>
                  <span className='text-slate-300'>|</span>
                  <button onClick={() => setActiveTab('reviews')} className='text-blue-600 hover:underline'>
                    {productData.totalReviews || reviews.length || 1} đánh giá thực tế
                  </button>
                  <span className='text-slate-300'>|</span>
                  <span className='text-emerald-600 font-medium flex items-center gap-1'>
                    <span className='w-2 h-2 rounded-full bg-emerald-500'></span>
                    Tình trạng: {currentVariantStock > 0 ? `Còn hàng (${currentVariantStock})` : 'Tạm hết hàng'}
                  </span>
                </div>
              </div>

              {/* Price Box */}
              <div className='bg-gradient-to-r from-slate-50 to-blue-50/50 p-5 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3'>
                <div>
                  <div className='flex items-baseline gap-3'>
                    <span className='text-3xl sm:text-4xl font-black text-rose-600'>
                      {Number(productData.price || 0).toLocaleString('vi-VN')}{currency}
                    </span>
                    {hasDiscount && (
                      <span className='text-base text-slate-400 line-through'>
                        {Number(productData.originalPrice).toLocaleString('vi-VN')}{currency}
                      </span>
                    )}
                  </div>
                  {hasDiscount && (
                    <p className='text-xs font-semibold text-emerald-600 mt-1'>
                      Tiết kiệm {Number(productData.originalPrice - productData.price).toLocaleString('vi-VN')}{currency} so với giá gốc
                    </p>
                  )}
                </div>
                <div className='text-right'>
                  <span className='inline-block px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg'>
                    Trả góp 0% từ {(Math.round((productData.price || 0) / 6)).toLocaleString('vi-VN')}đ/tháng
                  </span>
                </div>
              </div>

              {/* Variant Selector (Capacity, RAM, Colors) */}
              {productData.sizes && productData.sizes.length > 0 && (
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-xs font-bold text-slate-800 uppercase tracking-wider'>
                      {variantTitle}:
                    </h3>
                    <span className='text-xs font-bold text-blue-600'>{selectedVariant}</span>
                  </div>

                  <div className='grid grid-cols-2 sm:grid-cols-3 gap-2.5'>
                    {productData.sizes.map((variant, idx) => {
                      const vStock = productData.stockQuantities?.[variant] ?? 10;
                      const isOutOfStock = vStock <= 0;
                      const isSelected = selectedVariant === variant;

                      return (
                        <button
                          key={idx}
                          type='button'
                          onClick={() => !isOutOfStock && setSelectedVariant(variant)}
                          disabled={isOutOfStock}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            isOutOfStock
                              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                              : isSelected
                              ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-sm'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <p className={`text-xs font-bold truncate ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>
                            {variant}
                          </p>
                          <p className='text-[10px] text-slate-500 mt-0.5'>
                            {isOutOfStock ? 'Hết hàng' : `Còn ${vStock} máy`}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className='flex items-center gap-4 pt-2'>
                <span className='text-xs font-bold text-slate-700 uppercase tracking-wider'>Số lượng:</span>
                <div className='flex items-center border border-slate-200 rounded-xl bg-white shadow-2xs overflow-hidden'>
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className='px-3 py-1.5 hover:bg-slate-100 text-slate-600 font-bold transition-colors'
                  >
                    -
                  </button>
                  <span className='px-4 py-1.5 text-xs font-bold text-slate-800 min-w-[2.5rem] text-center'>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(prev => Math.min(currentVariantStock, prev + 1))}
                    disabled={quantity >= currentVariantStock}
                    className='px-3 py-1.5 hover:bg-slate-100 text-slate-600 font-bold disabled:opacity-40 transition-colors'
                  >
                    +
                  </button>
                </div>
                <span className='text-xs text-slate-400'>({currentVariantStock} sản phẩm có sẵn)</span>
              </div>

              {/* Action Buttons: CellphoneS Style */}
              <div className='space-y-2.5 pt-2'>
                {/* Primary Buy Now Button */}
                <button
                  type='button'
                  onClick={handleBuyNow}
                  disabled={currentVariantStock <= 0}
                  className='w-full py-3.5 px-6 rounded-2xl bg-[#d70018] hover:bg-[#ba0014] text-white font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-red-600/30 active:scale-[0.99] transition-all disabled:bg-slate-300 disabled:cursor-not-allowed text-center'
                >
                  <p className='text-sm sm:text-base'>MUA NGAY</p>
                  <p className='text-[11px] font-medium opacity-90 normal-case'>Giao hàng tận nơi 2 giờ hoặc nhận tại cửa hàng</p>
                </button>

                {/* Secondary Action Buttons: Tra Gop 0% & Tra Gop The */}
                <div className='grid grid-cols-2 gap-2.5'>
                  <button
                    type='button'
                    onClick={handleBuyNow}
                    disabled={currentVariantStock <= 0}
                    className='py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wide transition-all shadow-sm active:scale-[0.98] text-center'
                  >
                    <p>TRẢ GÓP 0%</p>
                    <p className='text-[10px] opacity-90 font-normal normal-case'>Trả trước 0đ - Duyệt nhanh</p>
                  </button>

                  <button
                    type='button'
                    onClick={handleAddToCart}
                    disabled={currentVariantStock <= 0}
                    className='py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wide transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-1.5'
                  >
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
                    </svg>
                    <span>THÊM VÀO GIỎ</span>
                  </button>
                </div>
              </div>

              {/* Special Promotion Gifts Box (CellphoneS Style) */}
              <div className='rounded-2xl border border-red-200 overflow-hidden bg-white shadow-2xs'>
                <div className='bg-red-50 px-4 py-2.5 border-b border-red-100 flex items-center gap-2'>
                  <span className='text-base'>🎁</span>
                  <h4 className='text-xs font-black text-[#d70018] uppercase tracking-tight'>
                    KHUYẾN MÃI CỰC HẤP DẪN
                  </h4>
                </div>
                <div className='p-3.5 space-y-2 text-xs text-slate-700'>
                  <div className='flex items-start gap-2'>
                    <span className='w-4 h-4 rounded-full bg-[#d70018] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5'>1</span>
                    <p>Tặng củ sạc nhanh chính hãng 30W / Chuột không dây trị giá <strong>450.000đ</strong></p>
                  </div>
                  <div className='flex items-start gap-2'>
                    <span className='w-4 h-4 rounded-full bg-[#d70018] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5'>2</span>
                    <p>Giảm thêm <strong>500.000đ</strong> khi thanh toán qua mã khuyến mãi <code>MINHTUAN10</code> hoặc <code>IPHONE500K</code></p>
                  </div>
                  <div className='flex items-start gap-2'>
                    <span className='w-4 h-4 rounded-full bg-[#d70018] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5'>3</span>
                    <p>Thu cũ đổi mới: Trợ giá thêm đến <strong>4.000.000đ</strong> cho máy cũ của bạn</p>
                  </div>
                </div>
              </div>

              {/* Store Availability Widget */}
              <div className='p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5'>
                <p className='font-bold text-slate-800 flex items-center gap-1.5'>
                  <span>📍</span>
                  <span>Có sẵn sản phẩm để trải nghiệm tại:</span>
                </p>
                <ul className='text-slate-600 space-y-1 pl-4 list-disc text-[11px]'>
                  <li>128 Trần Quang Khải, P. Tân Định, Quận 1, TP. Hồ Chí Minh</li>
                  <li>123 Thái Hà, P. Trung Liệt, Q. Đống Đa, Hà Nội</li>
                  <li>68 Nguyễn Văn Linh, P. Nam Dương, Q. Hải Châu, Đà Nẵng</li>
                </ul>
              </div>

            </div>
          </div>
        </div>

        {/* Detailed Tabs: Specifications, Description, Reviews */}
        <div className='bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100'>
          <div className='flex border-b border-slate-200 gap-6 text-sm font-bold'>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 transition-colors ${
                activeTab === 'specs'
                  ? 'text-[#d70018] border-b-2 border-[#d70018]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Thông số kỹ thuật
            </button>
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-3 transition-colors ${
                activeTab === 'description'
                  ? 'text-[#d70018] border-b-2 border-[#d70018]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Bài viết đánh giá chi tiết
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 transition-colors ${
                activeTab === 'reviews'
                  ? 'text-[#d70018] border-b-2 border-[#d70018]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Đánh giá từ khách hàng ({reviews.length})
            </button>
          </div>

          <div className='pt-6'>
            {/* SPECS TAB */}
            {activeTab === 'specs' && (
              <div className='max-w-2xl'>
                {productData.specs && Object.keys(productData.specs).length > 0 ? (
                  <div className='divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden'>
                    {Object.entries(productData.specs).map(([key, val], idx) => (
                      <div key={key} className={`flex text-xs p-3.5 ${idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}`}>
                        <span className='w-1/3 font-semibold text-slate-500 capitalize'>
                          {key.replace(/([A-Z])/g, ' $1')}
                        </span>
                        <span className='w-2/3 font-bold text-slate-800'>{String(val)}</span>
                      </div>
                    ))}
                    <div className='flex text-xs p-3.5 bg-slate-50/50'>
                      <span className='w-1/3 font-semibold text-slate-500'>Thương hiệu</span>
                      <span className='w-2/3 font-bold text-slate-800'>{productData.brand || productData.subCategory}</span>
                    </div>
                    <div className='flex text-xs p-3.5 bg-white'>
                      <span className='w-1/3 font-semibold text-slate-500'>Thời gian bảo hành</span>
                      <span className='w-2/3 font-bold text-slate-800'>{productData.warrantyMonths || 12} Tháng</span>
                    </div>
                  </div>
                ) : (
                  <div className='p-6 bg-slate-50 rounded-2xl text-xs text-slate-600 space-y-2'>
                    <p className='font-semibold text-slate-800'>Thông tin chung:</p>
                    <p>• Dòng sản phẩm: {productData.category} chính hãng</p>
                    <p>• Thương hiệu: {productData.brand || productData.subCategory}</p>
                    <p>• Phiên bản hỗ trợ: {productData.sizes?.join(', ')}</p>
                    <p>• Bảo hành: {productData.warrantyMonths || 12} Tháng tại Minh Tuấn Shop</p>
                  </div>
                )}
              </div>
            )}

            {/* DESCRIPTION TAB */}
            {activeTab === 'description' && (
              <div className='prose max-w-none text-slate-700 text-sm leading-relaxed space-y-4'>
                <p>{productData.description}</p>
                <div className='p-4 bg-blue-50 rounded-2xl border border-blue-100 text-blue-900 text-xs'>
                  <h4 className='font-bold mb-1'>Lý do nên mua tại Minh Tuấn Shop:</h4>
                  <ul className='list-disc pl-4 space-y-1'>
                    <li>Cam kết sản phẩm mới 100% nguyên seal hộp chính hãng</li>
                    <li>Giá cạnh tranh tốt nhất thị trường kèm quà tặng thiết thực</li>
                    <li>Đội ngũ kỹ thuật viên am hiểu công nghệ hỗ trợ cài đặt miễn phí</li>
                  </ul>
                </div>
              </div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <div className='space-y-6'>
                <div className='flex items-center justify-between pb-4 border-b border-slate-100'>
                  <div>
                    <h3 className='text-base font-bold text-slate-800'>Nhận xét từ người mua</h3>
                    <p className='text-xs text-slate-500'>Tất cả nhận xét đều được xác thực từ đơn hàng đã giao</p>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/orders');
                      toast.info('Vui lòng vào chi tiết đơn hàng đã giao để đánh giá sản phẩm.');
                    }}
                    className='px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors'
                  >
                    Viết đánh giá
                  </button>
                </div>

                <ReviewList
                  productId={productId}
                  reviews={reviews}
                  loading={reviewsLoading}
                  showEmptyState={reviews.length === 0}
                />
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className='pt-6'>
          <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
        </div>

        {/* Recently Viewed */}
        <div className='pt-2'>
          <RecentlyViewed />
        </div>

      </div>
    </div>
  );
};

export default Product;