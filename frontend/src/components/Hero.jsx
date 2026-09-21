import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CategoryMegaMenu, { MEGA_MENU_DATA } from './CategoryMegaMenu';

const CATEGORY_SIDEBAR = [
  { name: 'Điện thoại, Tablet', path: '/collection?category=Điện thoại', icon: 'https://dashboard.cellphones.com.vn/storage/icon-homepage-mobile.svg' },
  { name: 'Laptop', path: '/collection?category=Laptop', icon: 'https://dashboard.cellphones.com.vn/storage/icon-homepage-laptop.svg' },
  { name: 'Âm thanh, Tai nghe', path: '/collection?category=Phụ kiện di động', icon: 'https://dashboard.cellphones.com.vn/storage/icon-homepage-audio-2.svg' },
  { name: 'Đồng hồ thông minh', path: '/collection?category=Phụ kiện di động', icon: 'https://dashboard.cellphones.com.vn/storage/icon-homepage-watch.svg' },
  { name: 'Phụ kiện máy tính', path: '/collection?category=Phụ kiện máy tính', icon: 'https://dashboard.cellphones.com.vn/storage/icon-homepage-accessories.svg' },
  { name: 'PC, Màn hình', path: '/collection?category=PC', icon: 'https://dashboard.cellphones.com.vn/storage/icon-homepage-pc.svg' },
  { name: 'Linh kiện máy tính', path: '/collection?category=Linh kiện máy tính', icon: 'https://dashboard.cellphones.com.vn/storage/icon-homepage-pc.svg' },
  { name: 'Thu cũ đổi mới', path: '/collection', icon: 'https://dashboard.cellphones.com.vn/storage/icon-homepage-trade-in.svg', badge: 'Trợ giá 4tr' },
  { name: 'Hàng cũ giá rẻ', path: '/collection?category=sale', icon: 'https://dashboard.cellphones.com.vn/storage/icon-homepage-used-goods.svg' },
  { name: 'Khuyến mãi HOT', path: '/collection?category=sale', icon: 'https://dashboard.cellphones.com.vn/storage/icon-homepage-promotions.svg', badge: 'Giảm 50%' },
  { name: 'Tin công nghệ', path: '/', icon: 'https://dashboard.cellphones.com.vn/storage/icon-homepage-tech-news.svg' }
];

const SLIDES = [
  {
    title: 'GALAXY S24 ULTRA',
    subtitle: 'Mở bán quà khủng',
    headline: 'Galaxy S24 Ultra 5G AI',
    tagline: 'Quyền năng Galaxy AI đỉnh cao - Trợ giá thu cũ 4.000.000đ',
    price: '27.990.000đ',
    oldPrice: '33.990.000đ',
    link: '/collection?category=Điện thoại',
    bg: 'from-slate-900 via-indigo-950 to-slate-900',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800'
  },
  {
    title: 'IPHONE 16 PRO MAX',
    subtitle: 'Đỉnh cao công nghệ',
    headline: 'iPhone 16 Pro Max 256GB',
    tagline: 'Titan Sa Mạc sang trọng - Chip Apple A18 Pro siêu mạnh',
    price: '34.490.000đ',
    oldPrice: '36.990.000đ',
    link: '/collection?category=Điện thoại',
    bg: 'from-amber-950 via-slate-900 to-stone-900',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800'
  },
  {
    title: 'MACBOOK AIR M3',
    subtitle: 'Ưu đãi sinh viên',
    headline: 'MacBook Air 15" M3',
    tagline: 'Pin 18 giờ - Màn hình Liquid Retina siêu mỏng nhẹ',
    price: '29.990.000đ',
    oldPrice: '32.990.000đ',
    link: '/collection?category=Laptop',
    bg: 'from-blue-950 via-slate-900 to-cyan-950',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'
  },
  {
    title: 'PC GAMING SUPREME',
    subtitle: 'Tặng màn 165Hz',
    headline: 'PC Gaming Minh Tuấn Dragon',
    tagline: 'Core i7 14700K + RTX 4070 Super 12GB - Cân mọi tựa game AAA',
    price: '38.990.000đ',
    oldPrice: '42.990.000đ',
    link: '/collection?category=PC',
    bg: 'from-red-950 via-slate-900 to-rose-950',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800'
  }
];

const Hero = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const current = SLIDES[activeSlide];

  return (
    <div className='max-w-7xl mx-auto px-2 sm:px-4 pt-3 pb-2 relative'>
      
      {/* 3-Column Hero Grid (CellphoneS Signature Layout) */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch relative'>

        {/* 1. LEFT COLUMN: CATEGORY MENU (Visible on lg/xl, 3 cols) */}
        <div 
          className='hidden lg:block lg:col-span-3 xl:col-span-3 relative'
          onMouseLeave={() => setHoveredCategory(null)}
        >
          <div className='bg-white rounded-2xl shadow-sm border border-slate-100 overflow-visible h-full flex flex-col justify-between py-1.5'>
            {CATEGORY_SIDEBAR.map((cat, idx) => {
              const isHovered = hoveredCategory === cat.name;
              return (
                <Link
                  key={idx}
                  to={cat.path}
                  onMouseEnter={() => setHoveredCategory(cat.name)}
                  className={`flex items-center justify-between px-3 py-1.5 transition-colors group ${
                    isHovered 
                      ? 'bg-red-50 text-[#d70018] font-bold' 
                      : 'hover:bg-red-50 text-slate-700 hover:text-[#d70018]'
                  }`}
                >
                  <div className='flex items-center gap-2.5'>
                    <img src={cat.icon} alt="" className='w-5 h-5 object-contain opacity-80 group-hover:opacity-100' />
                    <span className='text-xs font-semibold'>{cat.name}</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    {cat.badge && (
                      <span className='text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold'>
                        {cat.badge}
                      </span>
                    )}
                    <svg className={`w-3.5 h-3.5 transition-all ${isHovered ? 'text-[#d70018] translate-x-1' : 'text-slate-300 group-hover:text-[#d70018] group-hover:translate-x-0.5'}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5l7 7-7 7' />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Mega Flyout Menu */}
          {hoveredCategory && MEGA_MENU_DATA[hoveredCategory] && (
            <CategoryMegaMenu 
              categoryKey={hoveredCategory} 
              onClose={() => setHoveredCategory(null)} 
            />
          )}
        </div>

        {/* 2. CENTER COLUMN: MAIN CAROUSEL BANNER (lg: 9 cols, xl: 6 cols) */}
        <div className='lg:col-span-9 xl:col-span-6 flex flex-col justify-between rounded-2xl overflow-hidden shadow-sm bg-white border border-slate-100'>
          
          {/* Main Slide Screen */}
          <div className={`relative h-[320px] sm:h-[350px] bg-gradient-to-r ${current.bg} text-white p-6 sm:p-8 flex items-center justify-between overflow-hidden transition-all duration-500`}>
            <div className='relative z-10 max-w-sm space-y-3'>
              <span className='inline-block px-2.5 py-1 bg-red-600 text-white text-[11px] font-black rounded-lg uppercase tracking-wider shadow-sm'>
                {current.title}
              </span>
              <h2 className='text-xl sm:text-2xl font-black leading-tight text-white'>
                {current.headline}
              </h2>
              <p className='text-xs text-slate-300 leading-relaxed line-clamp-2'>
                {current.tagline}
              </p>
              <div className='flex items-baseline gap-3 pt-1'>
                <span className='text-xl sm:text-2xl font-black text-yellow-300'>
                  {current.price}
                </span>
                <span className='text-xs text-slate-400 line-through'>
                  {current.oldPrice}
                </span>
              </div>
              <div className='pt-2'>
                <Link
                  to={current.link}
                  className='inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95'
                >
                  <span>MUA NGAY</span>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M14 5l7 7m0 0l-7 7m7-7H3' />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Slide Image */}
            <div className='relative z-10 w-40 sm:w-56 h-40 sm:h-56 shrink-0 flex items-center justify-center'>
              <img
                src={current.image}
                alt={current.headline}
                className='max-w-full max-h-full object-contain drop-shadow-2xl rounded-2xl animate-float'
              />
            </div>

            {/* Ambient glow */}
            <div className='absolute -right-10 -bottom-10 w-64 h-64 bg-red-500/20 rounded-full blur-3xl'></div>
          </div>

          {/* Bottom Tabs matching CellphoneS style */}
          <div className='grid grid-cols-4 bg-slate-50 border-t border-slate-100 text-center divide-x divide-slate-200/60'>
            {SLIDES.map((slide, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`py-2.5 px-1 sm:px-2 transition-all text-xs font-semibold ${
                  activeSlide === idx
                    ? 'bg-white text-[#d70018] border-b-2 border-[#d70018] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <p className='text-[11px] font-black uppercase line-clamp-1'>{slide.title}</p>
                <p className='text-[10px] text-slate-400 line-clamp-1 font-normal'>{slide.subtitle}</p>
              </button>
            ))}
          </div>

        </div>

        {/* 3. RIGHT COLUMN: WIDGETS & BANNERS (Visible on xl, 3 cols) */}
        <div className='hidden xl:flex xl:col-span-3 flex-col justify-between gap-3'>

          {/* Smember Welcome Box (CellphoneS style) */}
          <div className='bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm'>
            <div className='flex items-center gap-2.5 mb-2'>
              <div className='w-9 h-9 rounded-full bg-gradient-to-tr from-red-100 to-rose-200 flex items-center justify-center shrink-0'>
                <img
                  src='https://cdn2.cellphones.com.vn/insecure/rs:fill:0:0/q:50/plain/https://cellphones.com.vn/media/wysiwyg/ant-smile.png'
                  alt=""
                  className='w-6 h-6 object-contain'
                />
              </div>
              <div>
                <p className='text-xs font-black text-slate-800 leading-tight'>Chào mừng đến Minh Tuấn Shop</p>
                <p className='text-[10px] text-slate-500'>Đăng ký Smember nhận ưu đãi tới 1%</p>
              </div>
            </div>
            <div className='flex gap-2 text-xs font-bold'>
              <Link to='/login' className='flex-1 py-1.5 bg-[#d70018] text-white rounded-lg text-center shadow-2xs hover:bg-red-700 transition-colors'>
                Đăng nhập
              </Link>
              <Link to='/login' className='flex-1 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-center hover:bg-slate-200 transition-colors'>
                Đăng ký
              </Link>
            </div>
          </div>

          {/* Quick Service Links Box */}
          <div className='bg-white rounded-2xl p-3 border border-slate-100 shadow-sm space-y-2 flex-1 flex flex-col justify-around text-xs'>
            <Link
              to='/collection'
              className='flex items-center gap-2 p-2 rounded-xl hover:bg-red-50 text-slate-700 hover:text-[#d70018] transition-colors border border-slate-100'
            >
              <img
                src='https://cdn2.cellphones.com.vn/insecure/rs:fill:18:18/q:100/plain/https://cellphones.com.vn/media/wysiwyg/icon_student_home_190825.png'
                alt=""
                className='w-5 h-5'
              />
              <div className='min-w-0'>
                <p className='font-bold leading-tight'>Ưu đãi cho giáo dục</p>
                <p className='text-[10px] text-slate-400'>Giảm thêm đến 10% cho HSSV</p>
              </div>
            </Link>

            <Link
              to='/collection'
              className='flex items-center gap-2 p-2 rounded-xl hover:bg-red-50 text-slate-700 hover:text-[#d70018] transition-colors border border-slate-100'
            >
              <img
                src='https://media-asset.cellphones.com.vn/dashboard-v2/uploads/common/icon/valuation-icon-0a4b0938-7b97-45ab-8fcd-7e913c7f8f2e.png'
                alt=""
                className='w-5 h-5'
              />
              <div className='min-w-0'>
                <p className='font-bold leading-tight'>Thu cũ lên đời giá hời</p>
                <p className='text-[10px] text-slate-400'>Trợ giá iPhone, Samsung 4 triệu</p>
              </div>
            </Link>

            <Link
              to='/contact'
              className='flex items-center gap-2 p-2 rounded-xl hover:bg-red-50 text-slate-700 hover:text-[#d70018] transition-colors border border-slate-100'
            >
              <img
                src='https://cdn2.cellphones.com.vn/insecure/rs:fill:18:18/q:100/plain/https://cellphones.com.vn/media/wysiwyg/Icon_wrapper.png'
                alt=""
                className='w-5 h-5'
              />
              <div className='min-w-0'>
                <p className='font-bold leading-tight'>Khách hàng doanh nghiệp</p>
                <p className='text-[10px] text-slate-400'>Chiết khấu đơn hàng dự án & B2B</p>
              </div>
            </Link>
          </div>

          {/* Promo Mini Banner */}
          <div className='rounded-xl overflow-hidden shadow-sm'>
            <img
              src='https://cdn2.cellphones.com.vn/x/media/wysiwyg/Web/landing-page/hang-moi-ve/promotion_banner04.png'
              alt='Khuyến mãi'
              className='w-full object-cover'
            />
          </div>

        </div>

      </div>

      {/* Special Banner GIF under Hero (CellphoneS signature) */}
      <div className='mt-3 rounded-2xl overflow-hidden shadow-sm'>
        <Link to='/collection?category=sale'>
          <img
            src='https://media-asset.cellphones.com.vn/dashboard-v1/manage-banner/Special-banner-1-D3.gif'
            alt='Chào năm học mới'
            className='w-full h-auto object-cover'
          />
        </Link>
      </div>

    </div>
  );
};

export default Hero;
