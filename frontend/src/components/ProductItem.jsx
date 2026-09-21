import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price, originalPrice, averageRating, totalReviews, brand, sizes, category, isFlashSale, soldCount }) => {
  const { currency, addToCart, isWishlisted, toggleWishlist } = useContext(ShopContext);
  const isFav = isWishlisted ? isWishlisted(id) : false;

  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount ? Math.round((1 - (price / originalPrice)) * 100) : 0;

  const displayImage = Array.isArray(image) && image.length > 0 
    ? image[0] 
    : (image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600');

  const rating = Number(averageRating) || 4.9;
  const reviews = Number(totalReviews) || 24;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultVariant = sizes && sizes.length > 0 ? sizes[0] : 'Tiêu chuẩn';
    addToCart(id, defaultVariant);
  };

  return (
    <div className='group bg-white rounded-2xl border border-slate-200/80 hover:border-red-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative'>
      
      <Link to={`/product/${id}`} className='block p-3 sm:p-4 flex-1 flex flex-col'>
        
        {/* Top Badges (CellphoneS style) */}
        <div className='flex items-center justify-between gap-1 mb-2'>
          {hasDiscount ? (
            <span className='px-2 py-0.5 bg-[#d70018] text-white text-[10px] font-black rounded-md uppercase tracking-wider shadow-2xs'>
              Giảm {discountPercent}%
            </span>
          ) : (
            <span className='px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-md'>
              Chính hãng
            </span>
          )}

          <span className='px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold rounded-md'>
            Trả góp 0%
          </span>
        </div>

        {/* Product Image with Zoom on Hover */}
        <div className='aspect-square w-full rounded-xl p-2 flex items-center justify-center overflow-hidden bg-white relative'>
          <img
            src={displayImage}
            alt={name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600';
            }}
            className='max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300'
            loading='lazy'
          />
        </div>

        {/* Product Brand & Name */}
        <div className='mt-2.5 flex-1 flex flex-col justify-between'>
          <div>
            <h3 className='text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-[#d70018] transition-colors line-clamp-2 leading-snug'>
              {name}
            </h3>
          </div>

          {/* Pricing Box (CellphoneS Signature) */}
          <div className='mt-2 space-y-1.5'>
            <div className='flex items-baseline gap-2 flex-wrap'>
              <span className='text-sm sm:text-base font-black text-[#d70018]'>
                {Number(price || 0).toLocaleString('vi-VN')}{currency}
              </span>
              {hasDiscount && (
                <span className='text-[11px] text-slate-400 line-through font-medium'>
                  {Number(originalPrice).toLocaleString('vi-VN')}{currency}
                </span>
              )}
            </div>

            {/* Smember benefit pill (CellphoneS signature) */}
            <div className='bg-red-50 border border-red-100/80 rounded-md px-2 py-0.5 text-[10px] text-red-700 font-medium truncate'>
              Smember giảm đến <strong>{(Math.round(price * 0.01 / 1000) * 1000).toLocaleString('vi-VN')}đ</strong>
            </div>

            {/* Installment terms note */}
            <div className='bg-slate-50 rounded-md px-2 py-0.5 text-[9px] text-slate-500 line-clamp-1 border border-slate-100'>
              Trả góp 0% - 0đ trả trước - kỳ hạn 12 tháng
            </div>

            {/* Flash Sale Progress bar if flash sale */}
            {isFlashSale && (
              <div className='pt-1'>
                <div className='flex items-center justify-between text-[10px] font-bold text-slate-500 mb-0.5'>
                  <span className='text-[#d70018] flex items-center gap-1'>
                    <span>🔥</span> Đã bán {soldCount || 16}/20
                  </span>
                </div>
                <div className='w-full h-1.5 bg-red-100 rounded-full overflow-hidden'>
                  <div className='h-full bg-[#d70018] rounded-full' style={{ width: `${Math.min(100, ((soldCount || 16) / 20) * 100)}%` }}></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row: Giao 2 Gio, Star rating & Quick Action / Wishlist */}
        <div className='mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500'>
          <div className='flex items-center gap-1.5'>
            <span className='px-1.5 py-0.5 bg-blue-50 text-blue-700 font-bold rounded flex items-center gap-0.5 text-[9px]'>
              <span>⚡</span>
              <span>2 Giờ</span>
            </span>
            <span className='text-amber-500 font-black flex items-center gap-0.5'>
              ★ {rating.toFixed(0)}
            </span>
          </div>

          <div className='flex items-center gap-1'>
            <button
              type='button'
              onClick={handleQuickAdd}
              className='p-1.5 rounded-lg bg-red-50 hover:bg-[#d70018] text-[#d70018] hover:text-white transition-colors shadow-2xs'
              title='Thêm vào giỏ'
            >
              <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M12 4v16m8-8H4' />
              </svg>
            </button>
            <button
              type='button'
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist && toggleWishlist(id);
              }}
              className={`p-1.5 rounded-lg transition-all ${
                isFav 
                  ? 'text-red-600 bg-red-50 hover:bg-red-100 scale-110' 
                  : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
              }`}
              title={isFav ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
            >
              <svg className='w-3.5 h-3.5' fill={isFav ? 'currentColor' : 'none'} stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
              </svg>
            </button>
          </div>
        </div>

      </Link>
    </div>
  );
};

export default ProductItem;