import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import Hero from '../components/Hero';
import ProductItem from '../components/ProductItem';
import PageTransition from '../components/PageTransition';
import { TECH_NEWS_ARTICLES } from '../data/newsData';
import DeviceCategoryIcon from '../components/DeviceCategoryIcon';
import PersonalizedRecommendations from '../components/PersonalizedRecommendations';
import RecentlyViewed from '../components/RecentlyViewed';

const Home = () => {
  const { products, backendUrl } = useContext(ShopContext);
  const [reviews, setReviews] = useState([]);
  const [flashSaleTab, setFlashSaleTab] = useState('all');
  
  // Flash sale countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 8, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch verified customer reviews from backend
  useEffect(() => {
    const fetchRecentReviews = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/review/recent`);
        if (res.data && res.data.success && res.data.reviews) {
          setReviews(res.data.reviews);
        }
      } catch (err) {
        console.log('Error fetching reviews:', err);
      }
    };
    if (backendUrl) fetchRecentReviews();
  }, [backendUrl]);

  // Filtered product feeds from real DB
  const rawFlashSale = products.filter(p => (p.originalPrice && p.originalPrice > p.price) || p.bestseller);
  const filteredFlashSale = flashSaleTab === 'all' 
    ? rawFlashSale 
    : rawFlashSale.filter(p => p.category === flashSaleTab);

  const phoneProducts = products.filter(p => p.category === 'Điện thoại').slice(0, 5);
  const laptopProducts = products.filter(p => p.category === 'Laptop').slice(0, 5);
  const pcProducts = products.filter(p => p.category === 'PC').slice(0, 5);
  const tabletProducts = products.filter(p => p.category === 'Máy tính bảng').slice(0, 5);
  const accessoryProducts = products.filter(p => ['Linh kiện máy tính', 'Phụ kiện máy tính', 'Phụ kiện di động'].includes(p.category)).slice(0, 5);

  return (
    <PageTransition>
      <div className='bg-[#f4f6f8] min-h-screen space-y-6 sm:space-y-8 pb-16'>
        
        {/* 1. HERO 3-COLUMN LAYOUT (CellphoneS signature) */}
        <Hero />

        <div className='max-w-7xl mx-auto px-2 sm:px-4 space-y-8'>

          {/* 2. HOT SALE CUỐI TUẦN / FLASH SALE (CellphoneS Signature block) */}
          <section className='bg-gradient-to-r from-[#d70018] via-[#e61b23] to-[#ff3838] rounded-3xl p-4 sm:p-6 shadow-xl text-white'>
            
            {/* Header: Title + Fire + Countdown */}
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/20'>
              <div className='flex items-center gap-2.5'>
                <span className='text-3xl animate-bounce'>🔥</span>
                <div>
                  <h2 className='text-xl sm:text-2xl font-black tracking-wide uppercase flex items-center gap-2 text-white'>
                    HOT SALE GIÁ SỐC
                  </h2>
                  <p className='text-xs text-red-100'>Săn ngay deal công nghệ giảm sâu đến 50%</p>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className='flex items-center gap-1.5 text-xs font-bold'>
                <span className='text-red-100 uppercase text-[11px] tracking-wider hidden sm:inline mr-1'>Kết thúc sau:</span>
                <div className='bg-black/40 backdrop-blur px-2.5 py-1 rounded-lg border border-white/20 font-mono text-sm font-black'>
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <span>:</span>
                <div className='bg-black/40 backdrop-blur px-2.5 py-1 rounded-lg border border-white/20 font-mono text-sm font-black'>
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <span>:</span>
                <div className='bg-black/40 backdrop-blur px-2.5 py-1 rounded-lg border border-white/20 font-mono text-sm font-black'>
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
              </div>
            </div>

            {/* Category Filter Pills on Flash Sale */}
            <div className='flex items-center gap-2 py-3 overflow-x-auto scrollbar-none'>
              {[
                { id: 'all', label: 'Tất cả deal hot', type: 'hot' },
                { id: 'Điện thoại', label: 'Điện thoại', type: 'phone' },
                { id: 'Laptop', label: 'Laptop', type: 'laptop' },
                { id: 'Máy tính bảng', label: 'Tablet', type: 'tablet' },
                { id: 'PC', label: 'PC Gaming', type: 'pc' },
                { id: 'Phụ kiện di động', label: 'Phụ kiện', type: 'accessories' },
              ].map(tab => {
                const isActive = flashSaleTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setFlashSaleTab(tab.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-white text-[#d70018] shadow-md scale-105'
                        : 'bg-red-900/40 hover:bg-red-800/70 text-white'
                    }`}
                  >
                    <DeviceCategoryIcon
                      type={tab.type}
                      className="w-4 h-4 object-contain shrink-0"
                      color={isActive ? "#d70018" : "currentColor"}
                    />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Products Grid */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
              {(filteredFlashSale.length > 0 ? filteredFlashSale : rawFlashSale).slice(0, 5).map((item, idx) => (
                <ProductItem
                  key={item._id}
                  id={item._id}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                  originalPrice={item.originalPrice}
                  averageRating={item.averageRating}
                  totalReviews={item.totalReviews}
                  brand={item.brand}
                  sizes={item.sizes}
                  category={item.category}
                  isFlashSale={true}
                  soldCount={12 + (idx * 2)}
                />
              ))}
            </div>
          </section>

          {/* GỢI Ý CÁ NHÂN HÓA DỰA TRÊN LỊCH SỬ TÌM KIẾM & XEM SẢN PHẨM */}
          <PersonalizedRecommendations />

          {/* 3. SHOWCASE BLOCK: ĐIỆN THOẠI NỔI BẬT (CellphoneS signature block) */}
          {phoneProducts.length > 0 && (
            <section className='bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100'>
              
              {/* Header with Sub-tabs */}
              <div className='flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100'>
                <div className='flex items-center gap-2'>
                  <span className='p-1.5 bg-red-50 border border-red-100/80 rounded-xl flex items-center justify-center shadow-2xs'>
                    <DeviceCategoryIcon type="phone" className="w-5 h-5 text-[#d70018]" />
                  </span>
                  <h2 className='text-lg sm:text-xl font-black text-slate-800 uppercase'>
                    Điện Thoại Nổi Bật
                  </h2>
                </div>

                {/* Sub category links + Action Button */}
                <div className='flex items-center gap-2 overflow-x-auto scrollbar-none text-xs font-medium'>
                  <Link to='/collection?category=Điện thoại&brand=Apple' className='px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-[#d70018] rounded-xl whitespace-nowrap transition-colors font-semibold'>
                    Apple iPhone
                  </Link>
                  <Link to='/collection?category=Điện thoại&brand=Samsung' className='px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-[#d70018] rounded-xl whitespace-nowrap transition-colors font-semibold'>
                    Samsung Galaxy
                  </Link>
                  <Link to='/collection?category=Điện thoại&brand=Xiaomi' className='px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-[#d70018] rounded-xl whitespace-nowrap transition-colors font-semibold'>
                    Xiaomi
                  </Link>
                  <Link to='/collection?category=Điện thoại&brand=OPPO' className='px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-[#d70018] rounded-xl whitespace-nowrap transition-colors font-semibold'>
                    OPPO
                  </Link>
                  <Link
                    to='/collection?category=Điện thoại'
                    className='inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-[#d70018] text-[#d70018] hover:text-white border border-red-200 text-xs font-bold transition-all shadow-2xs whitespace-nowrap group shrink-0'
                  >
                    <span>Xem tất cả ({products.filter(p => p.category === 'Điện thoại').length})</span>
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Grid */}
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
                {phoneProducts.map((item) => (
                  <ProductItem
                    key={item._id}
                    id={item._id}
                    image={item.image}
                    name={item.name}
                    price={item.price}
                    originalPrice={item.originalPrice}
                    averageRating={item.averageRating}
                    totalReviews={item.totalReviews}
                    brand={item.brand}
                    sizes={item.sizes}
                    category={item.category}
                  />
                ))}
              </div>
            </section>
          )}

          {/* 4. SHOWCASE BLOCK: LAPTOP & MACBOOK */}
          {laptopProducts.length > 0 && (
            <section className='bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100'>
              
              <div className='flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100'>
                <div className='flex items-center gap-2'>
                  <span className='p-1.5 bg-red-50 border border-red-100/80 rounded-xl flex items-center justify-center shadow-2xs'>
                    <DeviceCategoryIcon type="laptop" className="w-5 h-5 text-[#d70018]" />
                  </span>
                  <h2 className='text-lg sm:text-xl font-black text-slate-800 uppercase'>
                    Laptop & MacBook Chính Hãng
                  </h2>
                </div>

                <div className='flex items-center gap-2 overflow-x-auto scrollbar-none text-xs font-medium'>
                  <Link to='/collection?category=Laptop&brand=Apple' className='px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-[#d70018] rounded-xl whitespace-nowrap transition-colors font-semibold'>
                    MacBook M3
                  </Link>
                  <Link to='/collection?category=Laptop&brand=Asus' className='px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-[#d70018] rounded-xl whitespace-nowrap transition-colors font-semibold'>
                    Asus ROG Gaming
                  </Link>
                  <Link to='/collection?category=Laptop&brand=Dell' className='px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-[#d70018] rounded-xl whitespace-nowrap transition-colors font-semibold'>
                    Dell XPS
                  </Link>
                  <Link to='/collection?category=Laptop&brand=Lenovo' className='px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-[#d70018] rounded-xl whitespace-nowrap transition-colors font-semibold'>
                    Lenovo Legion
                  </Link>
                  <Link
                    to='/collection?category=Laptop'
                    className='inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-[#d70018] text-[#d70018] hover:text-white border border-red-200 text-xs font-bold transition-all shadow-2xs whitespace-nowrap group shrink-0'
                  >
                    <span>Xem tất cả ({products.filter(p => p.category === 'Laptop').length})</span>
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
                {laptopProducts.map((item) => (
                  <ProductItem
                    key={item._id}
                    id={item._id}
                    image={item.image}
                    name={item.name}
                    price={item.price}
                    originalPrice={item.originalPrice}
                    averageRating={item.averageRating}
                    totalReviews={item.totalReviews}
                    brand={item.brand}
                    sizes={item.sizes}
                    category={item.category}
                  />
                ))}
              </div>
            </section>
          )}

          {/* 5. SPECIAL DUAL PROMOTIONAL BANNER WITH REAL PRODUCT PHOTOS */}
          <section className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Banner 1: Thu Cũ Đổi Mới */}
            <div className='relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-700 via-red-800 to-rose-950 text-white p-6 flex flex-col justify-between shadow-lg group min-h-[190px]'>
              <div className='relative z-10 space-y-2 max-w-[62%]'>
                <span className='inline-block px-2.5 py-0.5 bg-yellow-400 text-slate-950 rounded-md text-[11px] font-black uppercase tracking-wider'>
                  ĐẶC QUYỀN MINH TUẤN
                </span>
                <h3 className='text-lg sm:text-2xl font-black leading-snug'>Thu Cũ Đổi Mới Trợ Giá 4 Triệu</h3>
                <p className='text-xs text-red-100 line-clamp-2'>
                  Lên đời iPhone 16 Pro Max, Galaxy S24 Ultra trợ giá cao nhất. Định giá nhanh 5 phút.
                </p>
              </div>
              <div className='relative z-10 pt-4'>
                <Link
                  to='/collection?category=Điện thoại'
                  className='inline-block px-4 py-2 bg-white text-[#d70018] font-black rounded-xl text-xs hover:bg-red-50 transition-colors shadow'
                >
                  Định giá máy ngay &rarr;
                </Link>
              </div>
              {/* Real device image on the right */}
              <div className='absolute right-2 sm:right-4 bottom-0 top-0 w-36 sm:w-48 flex items-center justify-center pointer-events-none group-hover:scale-105 transition-transform duration-300'>
                <img 
                  src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=400" 
                  alt="Thu cũ đổi mới iPhone 16 Pro" 
                  className="max-h-[140px] sm:max-h-[160px] w-auto object-contain drop-shadow-2xl rounded-xl border border-white/20"
                />
              </div>
              <div className='absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-xl'></div>
            </div>

            {/* Banner 2: Trả Góp 0% */}
            <div className='relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 text-white p-6 flex flex-col justify-between shadow-lg group min-h-[190px]'>
              <div className='relative z-10 space-y-2 max-w-[62%]'>
                <span className='inline-block px-2.5 py-0.5 bg-emerald-400 text-slate-950 rounded-md text-[11px] font-black uppercase tracking-wider'>
                  TÀI CHÍNH DỄ DÀNG
                </span>
                <h3 className='text-lg sm:text-2xl font-black leading-snug'>Trả Góp 0% Lãi Suất - Không Phí</h3>
                <p className='text-xs text-slate-300 line-clamp-2'>
                  Qua CCCD gắn chip hoặc thẻ tín dụng 25+ ngân hàng. Trả trước 0 đồng nhận máy liền.
                </p>
              </div>
              <div className='relative z-10 pt-4'>
                <Link
                  to='/contact'
                  className='inline-block px-4 py-2 bg-yellow-300 text-slate-950 font-black rounded-xl text-xs hover:bg-yellow-400 transition-colors shadow'
                >
                  Tư vấn gói góp &rarr;
                </Link>
              </div>
              {/* Real device image on the right */}
              <div className='absolute right-2 sm:right-4 bottom-0 top-0 w-36 sm:w-48 flex items-center justify-center pointer-events-none group-hover:scale-105 transition-transform duration-300'>
                <img 
                  src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400" 
                  alt="Trả góp 0% MacBook" 
                  className="max-h-[140px] sm:max-h-[160px] w-auto object-contain drop-shadow-2xl rounded-xl border border-white/20"
                />
              </div>
              <div className='absolute -bottom-8 -right-8 w-40 h-40 bg-yellow-400/10 rounded-full blur-xl'></div>
            </div>
          </section>

          {/* 6. PC GAMING & TABLETS DUAL SECTION */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {pcProducts.length > 0 && (
              <section className='bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-100 flex flex-col justify-between'>
                <div>
                  <div className='flex items-center justify-between mb-4 pb-2 border-b border-slate-100'>
                    <div className='flex items-center gap-2'>
                      <span className='p-1 bg-red-50 border border-red-100/80 rounded-lg flex items-center justify-center shadow-2xs'>
                        <DeviceCategoryIcon type="pc" className="w-4 h-4 text-[#d70018]" />
                      </span>
                      <h2 className='text-base font-black text-slate-800 uppercase'>PC Gaming & Đồ Họa</h2>
                    </div>
                    <Link
                      to='/collection?category=PC'
                      className='inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 hover:bg-[#d70018] text-[#d70018] hover:text-white border border-red-200 rounded-xl text-xs font-bold transition-all shadow-2xs group shrink-0'
                    >
                      <span>Xem tất cả</span>
                      <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                    {pcProducts.slice(0, 3).map((item) => (
                      <ProductItem
                        key={item._id}
                        id={item._id}
                        image={item.image}
                        name={item.name}
                        price={item.price}
                        originalPrice={item.originalPrice}
                        averageRating={item.averageRating}
                        totalReviews={item.totalReviews}
                        brand={item.brand}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {tabletProducts.length > 0 && (
              <section className='bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-100 flex flex-col justify-between'>
                <div>
                  <div className='flex items-center justify-between mb-4 pb-2 border-b border-slate-100'>
                    <div className='flex items-center gap-2'>
                      <span className='p-1 bg-red-50 border border-red-100/80 rounded-lg flex items-center justify-center shadow-2xs'>
                        <DeviceCategoryIcon type="tablet" className="w-4 h-4 text-[#d70018]" />
                      </span>
                      <h2 className='text-base font-black text-slate-800 uppercase'>Máy Tính Bảng iPad / Tab</h2>
                    </div>
                    <Link
                      to='/collection?category=Máy tính bảng'
                      className='inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 hover:bg-[#d70018] text-[#d70018] hover:text-white border border-red-200 rounded-xl text-xs font-bold transition-all shadow-2xs group shrink-0'
                    >
                      <span>Xem tất cả</span>
                      <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                    {tabletProducts.slice(0, 3).map((item) => (
                      <ProductItem
                        key={item._id}
                        id={item._id}
                        image={item.image}
                        name={item.name}
                        price={item.price}
                        originalPrice={item.originalPrice}
                        averageRating={item.averageRating}
                        totalReviews={item.totalReviews}
                        brand={item.brand}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* 7. PHỤ KIỆN & LINH KIỆN */}
          {accessoryProducts.length > 0 && (
            <section className='bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100'>
              <div className='flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100'>
                <div className='flex items-center gap-2'>
                  <span className='p-1.5 bg-red-50 border border-red-100/80 rounded-xl flex items-center justify-center shadow-2xs'>
                    <DeviceCategoryIcon type="accessories" className="w-5 h-5 text-[#d70018]" />
                  </span>
                  <h2 className='text-lg sm:text-xl font-black text-slate-800 uppercase'>
                    Phụ Kiện & Âm Thanh Chính Hãng
                  </h2>
                </div>
                <Link
                  to='/collection?category=Phụ kiện di động'
                  className='inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-50 hover:bg-[#d70018] text-[#d70018] hover:text-white border border-red-200 rounded-xl text-xs font-bold transition-all shadow-2xs group shrink-0'
                >
                  <span>Xem tất cả phụ kiện</span>
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
                {accessoryProducts.map((item) => (
                  <ProductItem
                    key={item._id}
                    id={item._id}
                    image={item.image}
                    name={item.name}
                    price={item.price}
                    originalPrice={item.originalPrice}
                    averageRating={item.averageRating}
                    totalReviews={item.totalReviews}
                    brand={item.brand}
                  />
                ))}
              </div>
            </section>
          )}

          {/* 8. TIN TỨC CÔNG NGHỆ & BÀI VIẾT (CellphoneS SForum Style) */}
          <section className='bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100'>
            <div className='flex items-center justify-between mb-5 pb-3 border-b border-slate-100'>
              <div className='flex items-center gap-2'>
                <span className='p-1.5 bg-red-50 border border-red-100/80 rounded-xl flex items-center justify-center shadow-2xs'>
                  <DeviceCategoryIcon type="news" className="w-5 h-5 text-[#d70018]" />
                </span>
                <h2 className='text-lg sm:text-xl font-black text-slate-800 uppercase'>
                  Tin Tức Công Nghệ
                </h2>
              </div>
              <Link
                to="/news"
                className='inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-50 hover:bg-[#d70018] text-[#d70018] hover:text-white border border-red-200 rounded-xl text-xs font-bold transition-all shadow-2xs group shrink-0'
              >
                <span>Xem tất cả bài viết</span>
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
              {TECH_NEWS_ARTICLES.slice(0, 4).map((news) => (
                <Link
                  key={news.id}
                  to={`/news/${news.slug}`}
                  className='group flex flex-col justify-between rounded-2xl overflow-hidden border border-slate-100 hover:border-red-300 hover:shadow-md transition-all bg-slate-50/40'
                >
                  <div className='aspect-video overflow-hidden bg-slate-200'>
                    <img
                      src={news.image}
                      alt={news.title}
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                  </div>
                  <div className='p-3 space-y-1.5'>
                    <div className='flex items-center justify-between text-[10px] text-slate-400'>
                      <span className='font-bold text-[#d70018] bg-red-50 px-1.5 py-0.5 rounded'>
                        {news.category}
                      </span>
                      <span>{news.timeAgo}</span>
                    </div>
                    <h3 className='text-xs font-bold text-slate-800 group-hover:text-[#d70018] transition-colors line-clamp-2 leading-snug'>
                      {news.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 10. AUTHENTIC CUSTOMER REVIEWS */}
          {reviews.length > 0 && (
            <section className='bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100'>
              <div className='flex items-center justify-between mb-5 pb-3 border-b border-slate-100'>
                <div>
                  <h2 className='text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2 uppercase'>
                    <span>💬</span> Đánh Giá Từ Khách Hàng
                  </h2>
                  <p className='text-xs text-slate-500 mt-0.5'>Trải nghiệm mua sắm thực tế từ khách hàng Minh Tuấn Shop</p>
                </div>
                <div className='flex items-center gap-1 text-[#d70018] font-black text-sm bg-red-50 px-3 py-1.5 rounded-full border border-red-200'>
                  <span>★ 4.9/5</span>
                  <span className='text-xs text-slate-500 font-normal'>({reviews.length}+ đánh giá)</span>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
                {reviews.slice(0, 4).map((rev) => (
                  <div
                    key={rev._id}
                    className='bg-slate-50 p-4 rounded-2xl border border-slate-200/60 hover:shadow-md transition-shadow flex flex-col justify-between'
                  >
                    <div>
                      <div className='flex items-center justify-between mb-2'>
                        <div className='flex items-center gap-2'>
                          <div className='w-7 h-7 rounded-full bg-[#d70018] text-white font-bold flex items-center justify-center text-xs'>
                            {rev.userName?.charAt(0) || 'K'}
                          </div>
                          <div>
                            <p className='text-xs font-bold text-slate-800 line-clamp-1'>{rev.userName}</p>
                            {rev.isVerified && (
                              <span className='text-[9px] text-emerald-600 flex items-center gap-0.5 font-bold'>
                                ✓ Đã mua hàng
                              </span>
                            )}
                          </div>
                        </div>
                        <div className='flex text-amber-400 text-xs'>
                          {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                        </div>
                      </div>
                      <p className='text-xs text-slate-600 italic line-clamp-3 leading-relaxed mt-2'>
                        "{rev.comment}"
                      </p>
                    </div>
                    <div className='mt-3 pt-2 border-t border-slate-200 text-[10px] text-slate-400 flex justify-between'>
                      <span>{new Date(rev.createdAt).toLocaleDateString('vi-VN')}</span>
                      <span className='text-[#d70018] font-bold'>Hài lòng 100%</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SẢN PHẨM BẠN VỪA XEM GẦN ĐÂY */}
          <RecentlyViewed />

        </div>
      </div>
    </PageTransition>
  );
};

export default Home;