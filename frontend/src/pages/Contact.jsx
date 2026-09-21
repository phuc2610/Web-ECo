import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox';
import PageTransition from '../components/PageTransition';
import { useForm } from '@formspree/react';

const Contact = () => {
  const [state, handleSubmit] = useForm("mkgvgrpp");
  
  return (
    <PageTransition>
      <div className='min-h-screen bg-[#f4f6f8] py-8 sm:py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10'>
          
          {/* Header */}
          <div className='bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs'>
            <span className='text-xs text-slate-400'>Trang chủ / Liên hệ</span>
            <h1 className='text-2xl sm:text-3xl font-black text-slate-900 mt-1 uppercase tracking-tight'>
              HỆ THỐNG CỬA HÀNG & LIÊN HỆ MINH TUẤN SHOP
            </h1>
            <p className='text-xs sm:text-sm text-slate-500 mt-1.5'>
              Hỗ trợ tư vấn mua hàng, khiếu nại dịch vụ, bảo hành kỹ thuật 24/7 trên toàn quốc.
            </p>
          </div>

          {/* 3 Major Branch Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3'>
              <div className='flex items-center gap-2'>
                <span className='px-2.5 py-1 bg-red-100 text-[#d70018] rounded-lg text-xs font-black'>
                  TRỤ SỞ TP.HCM
                </span>
                <span className='text-[10px] text-emerald-600 font-bold'>● Mở cửa 8h00 - 21h30</span>
              </div>
              <h3 className='font-black text-slate-900 text-sm'>Chi nhánh 128 Trần Quang Khải</h3>
              <p className='text-xs text-slate-600'>128 Trần Quang Khải, Phường Tân Định, Quận 1, TP. Hồ Chí Minh</p>
              <div className='pt-2 border-t border-slate-100 text-xs text-slate-500'>
                <p>Hotline: <strong className='text-[#d70018]'>1800 2097</strong> (Nhánh 1)</p>
              </div>
            </div>

            <div className='bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3'>
              <div className='flex items-center gap-2'>
                <span className='px-2.5 py-1 bg-red-100 text-[#d70018] rounded-lg text-xs font-black'>
                  CHI NHÁNH HÀ NỘI
                </span>
                <span className='text-[10px] text-emerald-600 font-bold'>● Mở cửa 8h00 - 21h30</span>
              </div>
              <h3 className='font-black text-slate-900 text-sm'>Chi nhánh 123 Thái Hà</h3>
              <p className='text-xs text-slate-600'>123 Thái Hà, Phường Trung Liệt, Quận Đống Đa, Hà Nội</p>
              <div className='pt-2 border-t border-slate-100 text-xs text-slate-500'>
                <p>Hotline: <strong className='text-[#d70018]'>1800 2097</strong> (Nhánh 2)</p>
              </div>
            </div>

            <div className='bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3'>
              <div className='flex items-center gap-2'>
                <span className='px-2.5 py-1 bg-red-100 text-[#d70018] rounded-lg text-xs font-black'>
                  CHI NHÁNH ĐÀ NẴNG
                </span>
                <span className='text-[10px] text-emerald-600 font-bold'>● Mở cửa 8h00 - 21h30</span>
              </div>
              <h3 className='font-black text-slate-900 text-sm'>Chi nhánh 68 Nguyễn Văn Linh</h3>
              <p className='text-xs text-slate-600'>68 Nguyễn Văn Linh, Phường Nam Dương, Quận Hải Châu, TP. Đà Nẵng</p>
              <div className='pt-2 border-t border-slate-100 text-xs text-slate-500'>
                <p>Hotline: <strong className='text-[#d70018]'>1800 2097</strong> (Nhánh 3)</p>
              </div>
            </div>
          </div>

          {/* Contact Details & Form */}
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
            
            {/* Left Info (5 cols) */}
            <div className='lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6'>
              <div>
                <h2 className='text-xl font-black text-slate-900 mb-2'>Tổng Đài Liên Hệ</h2>
                <p className='text-xs text-slate-500'>
                  Đội ngũ CSKH Minh Tuấn Shop luôn sẵn sàng phục vụ và giải đáp thắc mắc của quý khách hàng.
                </p>
              </div>

              <div className='space-y-4 text-xs'>
                <div className='flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100'>
                  <div className='w-10 h-10 rounded-xl bg-red-100 text-[#d70018] flex items-center justify-center font-black text-base shrink-0'>
                    📞
                  </div>
                  <div>
                    <h4 className='font-bold text-slate-800'>Tư Vấn Mua Hàng & Khuyến Mãi</h4>
                    <p className='text-slate-500 mt-0.5'>1800 2097 (7h30 - 22h00)</p>
                  </div>
                </div>

                <div className='flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100'>
                  <div className='w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-base shrink-0'>
                    🛠️
                  </div>
                  <div>
                    <h4 className='font-bold text-slate-800'>Hỗ Trợ Kỹ Thuật & Bảo Hành</h4>
                    <p className='text-slate-500 mt-0.5'>1800 2064 (8h00 - 21h00)</p>
                  </div>
                </div>

                <div className='flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100'>
                  <div className='w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-base shrink-0'>
                    ✉️
                  </div>
                  <div>
                    <h4 className='font-bold text-slate-800'>Hộp Thư Điện Tử</h4>
                    <p className='text-slate-500 mt-0.5'>hotro@minhtuanshop.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Contact Form (7 cols) */}
            <div className='lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm'>
              <h2 className='text-xl font-black text-slate-900 mb-2'>Gửi Tin Nhắn Cho Chúng Tôi</h2>
              <p className='text-xs text-slate-500 mb-6'>
                Quý khách có thể để lại yêu cầu tư vấn sản phẩm, báo giá B2B hoặc góp ý dịch vụ.
              </p>

              {state.succeeded ? (
                <div className='p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2'>
                  <span className='text-3xl'>🎉</span>
                  <h3 className='font-black text-emerald-800 text-sm'>Cảm ơn quý khách!</h3>
                  <p className='text-xs text-emerald-700'>
                    Yêu cầu đã được gửi thành công. Chuyên viên Minh Tuấn Shop sẽ liên hệ lại trong vòng 15 phút.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className='space-y-4'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-xs font-bold text-slate-700 mb-1.5'>Họ và tên</label>
                      <input 
                        type="text" 
                        name="name" 
                        required 
                        className='w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-red-500 focus:outline-none' 
                        placeholder='Nguyễn Văn An' 
                      />
                    </div>
                    <div>
                      <label className='block text-xs font-bold text-slate-700 mb-1.5'>Số điện thoại</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        required 
                        className='w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-red-500 focus:outline-none' 
                        placeholder='0901 234 567' 
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-xs font-bold text-slate-700 mb-1.5'>Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      className='w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-red-500 focus:outline-none' 
                      placeholder='email@example.com' 
                    />
                  </div>

                  <div>
                    <label className='block text-xs font-bold text-slate-700 mb-1.5'>Nội dung tin nhắn</label>
                    <textarea 
                      name="message" 
                      rows="4" 
                      required 
                      className='w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-red-500 focus:outline-none' 
                      placeholder='Quý khách cần tư vấn về sản phẩm hoặc dịch vụ nào?'
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={state.submitting}
                    className='w-full py-3.5 px-6 rounded-xl bg-[#d70018] hover:bg-[#ba0014] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-md transition-all active:scale-[0.99] disabled:bg-slate-300'
                  >
                    {state.submitting ? 'ĐANG GỬI TIN NHẮN...' : 'GỬI TIN NHẮN NGAY'}
                  </button>
                </form>
              )}
            </div>

          </div>

          <NewsletterBox />
        </div>
      </div>
    </PageTransition>
  );
};

export default Contact;