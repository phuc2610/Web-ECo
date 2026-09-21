import React from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='bg-[#f8f9fa] text-neutral-700 w-full mt-14 border-t border-slate-200 text-xs'>
      
      {/* 1. Policy Trust Badges (CellphoneS Style: Clean, Light, Professional) */}
      <div className='bg-white border-b border-slate-200 py-6'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            
            <div className='flex items-center gap-3.5 p-3 rounded-2xl bg-red-50/60 border border-red-100/80'>
              <div className='w-11 h-11 rounded-xl bg-[#d70018] text-white flex items-center justify-center shrink-0 shadow-sm'>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
                </svg>
              </div>
              <div>
                <h4 className='font-black text-slate-800 text-xs sm:text-sm uppercase tracking-tight'>100% CHÍNH HÃNG</h4>
                <p className='text-[11px] text-slate-500 mt-0.5'>Bồi thường 200% nếu phát hiện giả</p>
              </div>
            </div>

            <div className='flex items-center gap-3.5 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100/80'>
              <div className='w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm'>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                </svg>
              </div>
              <div>
                <h4 className='font-black text-slate-800 text-xs sm:text-sm uppercase tracking-tight'>1 ĐỔI 1 TRONG 30 NGÀY</h4>
                <p className='text-[11px] text-slate-500 mt-0.5'>Lỗi phần cứng từ nhà sản xuất</p>
              </div>
            </div>

            <div className='flex items-center gap-3.5 p-3 rounded-2xl bg-blue-50/60 border border-blue-100/80'>
              <div className='w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm'>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 10V3L4 14h7v7l9-11h-7z' />
                </svg>
              </div>
              <div>
                <h4 className='font-black text-slate-800 text-xs sm:text-sm uppercase tracking-tight'>GIAO NHANH 2 GIỜ</h4>
                <p className='text-[11px] text-slate-500 mt-0.5'>Miễn phí nội thành từ đơn 300k</p>
              </div>
            </div>

            <div className='flex items-center gap-3.5 p-3 rounded-2xl bg-amber-50/60 border border-amber-100/80'>
              <div className='w-11 h-11 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm'>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' />
                </svg>
              </div>
              <div>
                <h4 className='font-black text-slate-800 text-xs sm:text-sm uppercase tracking-tight'>TRẢ GÓP 0% LÃI SUẤT</h4>
                <p className='text-[11px] text-slate-500 mt-0.5'>Duyệt nhanh qua CCCD & thẻ Visa</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Main Footer Columns (Standard CellphoneS 4-Column Layout) */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        {/* Brand Banner with User Logo */}
        <div className='pb-8 mb-8 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
          <Link to="/" className='inline-block bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition-shadow'>
            <img src={assets.logo} alt="Minh Tuấn - PC & Điện Thoại" className='h-12 w-auto object-contain' />
          </Link>
          <div className='text-xs text-slate-500 max-w-xl text-left md:text-right'>
            <p className='font-bold text-slate-800 text-sm'>CÔNG NGHỆ KIẾN TẠO CUỘC SỐNG TỐT ĐẸP HƠN</p>
            <p className='mt-1 text-slate-500'>Hệ thống bán lẻ Điện thoại, Máy tính, Laptop, Phụ kiện công nghệ chính hãng hàng đầu Việt Nam.</p>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
          
          {/* Column 1: Tổng đài hỗ trợ & Thanh toán */}
          <div className='space-y-4'>
            <h3 className='font-bold text-slate-900 text-sm uppercase tracking-tight'>
              Tổng đài hỗ trợ <span className='text-[10px] text-emerald-600 font-bold lowercase'>(miễn phí)</span>
            </h3>
            
            <div className='space-y-2 text-xs'>
              <p className='text-slate-600'>
                Gọi mua hàng: <a href="tel:18002097" className='font-black text-slate-900 hover:text-[#d70018]'>1800.2097</a> <span className='text-[11px] text-slate-400'>(7h30 - 22h00)</span>
              </p>
              <p className='text-slate-600'>
                Khiếu nại, góp ý: <a href="tel:18002063" className='font-black text-slate-900 hover:text-[#d70018]'>1800.2063</a> <span className='text-[11px] text-slate-400'>(8h00 - 21h30)</span>
              </p>
              <p className='text-slate-600'>
                Bảo hành, kỹ thuật: <a href="tel:18002064" className='font-black text-slate-900 hover:text-[#d70018]'>1800.2064</a> <span className='text-[11px] text-slate-400'>(8h00 - 21h00)</span>
              </p>
            </div>

            {/* Payment methods */}
            <div className='pt-3 border-t border-slate-200'>
              <h4 className='font-bold text-slate-900 text-xs mb-2.5 uppercase tracking-tight'>Phương thức thanh toán</h4>
              <div className='flex flex-wrap items-center gap-2'>
                <span className='px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-black text-xs text-red-600 shadow-2xs flex items-center gap-1.5'>
                  <span className='w-2 h-2 rounded-full bg-red-600'></span>
                  VNPAY
                </span>
                <span className='px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-black text-xs text-blue-800 shadow-2xs flex items-center gap-1.5'>
                  <span className='w-2 h-2 rounded-full bg-blue-800'></span>
                  VISA / MasterCard
                </span>
              </div>
            </div>

            {/* Smember highlight */}
            <div className='pt-2'>
              <div className='p-3 bg-red-50/80 rounded-xl border border-red-100 flex items-center gap-2.5'>
                <span className='text-lg'>👑</span>
                <div>
                  <p className='font-bold text-slate-900 text-[11px]'>Smember - Khách hàng thân thiết</p>
                  <p className='text-[10px] text-slate-500'>Tích điểm 1 - 5% cho mỗi đơn hàng</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Thông tin và chính sách */}
          <div className='space-y-3'>
            <h3 className='font-bold text-slate-900 text-sm uppercase tracking-tight'>Thông tin và chính sách</h3>
            <ul className='space-y-2 text-xs text-slate-600'>
              <li><Link to="/collection" className='hover:text-[#d70018] transition-colors'>Mua hàng và thanh toán Online</Link></li>
              <li><Link to="/collection" className='hover:text-[#d70018] transition-colors'>Mua hàng trả góp Online</Link></li>
              <li><Link to="/collection" className='hover:text-[#d70018] transition-colors'>Mua hàng trả góp bằng thẻ tín dụng</Link></li>
              <li><span className='hover:text-[#d70018] transition-colors cursor-pointer'>Chính sách giao hàng toàn quốc</span></li>
              <li><Link to="/orders" className='hover:text-[#d70018] transition-colors'>Tra cứu thông tin bảo hành</Link></li>
              <li><Link to="/orders" className='hover:text-[#d70018] transition-colors'>Tra cứu hóa đơn điện tử VAT</Link></li>
              <li><span className='hover:text-[#d70018] transition-colors cursor-pointer'>Chính sách đổi trả & hoàn tiền</span></li>
              <li><span className='hover:text-[#d70018] transition-colors cursor-pointer'>Chính sách bảo mật thông tin</span></li>
            </ul>
          </div>

          {/* Column 3: Dịch vụ và thông tin khác */}
          <div className='space-y-3'>
            <h3 className='font-bold text-slate-900 text-sm uppercase tracking-tight'>Dịch vụ và thông tin khác</h3>
            <ul className='space-y-2 text-xs text-slate-600'>
              <li><Link to="/about" className='hover:text-[#d70018] transition-colors'>Khách hàng doanh nghiệp (B2B)</Link></li>
              <li><Link to="/collection" className='hover:text-[#d70018] transition-colors'>Ưu đãi thanh toán & Voucher</Link></li>
              <li><Link to="/about" className='hover:text-[#d70018] transition-colors'>Quy chế hoạt động Minh Tuấn Shop</Link></li>
              <li><Link to="/contact" className='hover:text-[#d70018] transition-colors'>Chính sách bảo vệ dữ liệu cá nhân</Link></li>
              <li><Link to="/contact" className='hover:text-[#d70018] transition-colors'>Hợp tác kinh doanh & Đại lý</Link></li>
              <li><Link to="/about" className='hover:text-[#d70018] transition-colors'>Tuyển dụng nhân tài mới nhất</Link></li>
              <li><span className='hover:text-[#d70018] transition-colors cursor-pointer'>Dịch vụ bảo hành mở rộng VIP</span></li>
              <li><Link to="/contact" className='hover:text-[#d70018] transition-colors'>Trung tâm bảo hành chính hãng</Link></li>
            </ul>
          </div>

          {/* Column 4: Kết nối, Website thành viên & Chứng nhận */}
          <div className='space-y-4'>
            <div>
              <h3 className='font-bold text-slate-900 text-sm uppercase tracking-tight mb-2.5'>Kết nối với Minh Tuấn Shop</h3>
              <div className='flex items-center gap-3 text-slate-600'>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className='w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:scale-110 transition-transform'>
                  <span className='font-black text-xs'>YT</span>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className='w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:scale-110 transition-transform'>
                  <span className='font-black text-xs'>FB</span>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className='w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center hover:scale-110 transition-transform'>
                  <span className='font-black text-xs'>IG</span>
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noreferrer" className='w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:scale-110 transition-transform'>
                  <span className='font-black text-xs'>TT</span>
                </a>
                <a href="https://zalo.me" target="_blank" rel="noreferrer" className='w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:scale-110 transition-transform'>
                  <span className='font-black text-xs'>ZL</span>
                </a>
              </div>
            </div>

            {/* Member Websites (CellphoneS Style: Điện Thoại Vui, CareS, SForum) */}
            <div className='pt-3 border-t border-slate-200'>
              <h4 className='font-bold text-slate-900 text-xs mb-2 uppercase tracking-tight'>Website thành viên</h4>
              <div className='space-y-1.5 text-xs text-slate-600'>
                <p>
                  <strong className='text-slate-800'>Điện Thoại Vui:</strong> Hệ thống sửa chữa điện thoại & laptop
                </p>
                <p>
                  <strong className='text-slate-800'>CareS:</strong> Trung tâm bảo hành ủy quyền Apple chính hãng
                </p>
                <p>
                  <strong className='text-slate-800'>SForum:</strong> Trang thông tin công nghệ mới nhất 24/7
                </p>
              </div>
            </div>

            {/* Certifications & Trust Badges */}
            <div className='pt-2 flex items-center gap-2.5'>
              <div className='px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200 text-slate-700 font-bold text-[11px] shadow-2xs flex items-center gap-1.5'>
                <span>🔒</span>
                <span>DMCA.com</span>
              </div>
              <div className='px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-700 font-bold text-[11px] shadow-2xs flex items-center gap-1.5'>
                <span>✓</span>
                <span>SSL Secured</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 3. Bottom Legal & Corporate Info (Exact CellphoneS Standard) */}
      <div className='bg-[#eaedf0] py-6 border-t border-slate-200 text-[11px] text-slate-500'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2 text-center md:text-left'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-2'>
            <p className='font-semibold text-slate-700'>
              © 2026 MINH TUẤN SHOP - Hệ thống bán lẻ Điện thoại, Laptop, Tablet, Phụ kiện chính hãng toàn quốc.
            </p>
            <p className='text-slate-500'>
              GPĐKKD số: 0108889999 do Sở Kế Hoạch & Đầu Tư TP.HCM cấp • Bảo mật SSL 256-bit
            </p>
          </div>
          <p className='text-[10px] text-slate-400'>
            Trụ sở chính: 128 Trần Quang Khải, P. Tân Định, Quận 1, TP. Hồ Chí Minh • Chi nhánh Hà Nội: 123 Thái Hà, Q. Đống Đa • Chi nhánh Đà Nẵng: 68 Nguyễn Văn Linh, Q. Hải Châu.
          </p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;