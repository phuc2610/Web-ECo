import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox';
import PageTransition from '../components/PageTransition';

const About = () => {
  return (
    <PageTransition>
      <div className='min-h-screen bg-[#f4f6f8] py-8 sm:py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12'>
          
          {/* Breadcrumb & Header */}
          <div className='bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs'>
            <span className='text-xs text-slate-400'>Trang chủ / Giới thiệu</span>
            <h1 className='text-2xl sm:text-3xl font-black text-slate-900 mt-1 uppercase tracking-tight'>
              HỆ THỐNG BÁN LẺ MINH TUẤN SHOP
            </h1>
            <p className='text-xs sm:text-sm text-slate-500 mt-1.5 max-w-2xl'>
              Hệ thống bán lẻ điện thoại di động, máy tính bảng, laptop, PC gaming và phụ kiện công nghệ chính hãng hàng đầu tại Việt Nam.
            </p>
          </div>

          {/* Company Story */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm'>
            <div className='relative'>
              <img 
                className='w-full rounded-2xl shadow-xl border border-slate-100 object-cover aspect-4/3' 
                src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800" 
                alt="Minh Tuấn Shop Store" 
              />
              <div className='absolute -bottom-4 -right-4 bg-[#d70018] text-white p-4 rounded-2xl shadow-lg'>
                <p className='text-2xl font-black'>180+</p>
                <p className='text-xs font-bold uppercase'>Cửa hàng toàn quốc</p>
              </div>
            </div>
            
            <div className='space-y-6'>
              <div className='space-y-4'>
                <span className='text-xs font-black text-[#d70018] uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full'>
                  VỀ CHÚNG TÔI
                </span>
                <h2 className='text-2xl sm:text-3xl font-black text-slate-900 leading-snug'>
                  Hành trình mang công nghệ đỉnh cao đến người dùng Việt
                </h2>
                <p className='text-xs sm:text-sm text-slate-600 leading-relaxed'>
                  <strong>Minh Tuấn Shop</strong> là thương hiệu bán lẻ thiết bị di động và máy tính công nghệ thành lập với sứ mệnh mang đến sản phẩm chính hãng, bảo hành chuẩn quốc tế và trải nghiệm mua sắm hiện đại nhất.
                </p>
                <p className='text-xs sm:text-sm text-slate-600 leading-relaxed'>
                  Chúng tôi vinh dự là <strong>Đại lý ủy quyền chính thức của Apple (Apple Authorised Reseller)</strong>, đối tác chiến lược toàn diện của Samsung, ASUS ROG, Dell, MSI, Lenovo, Intel và Sony tại thị trường Việt Nam.
                </p>
              </div>

              {/* Mission & Vision Cards */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2'>
                <div className='bg-slate-50 p-4 rounded-2xl border border-slate-200/80'>
                  <div className='w-8 h-8 rounded-xl bg-red-100 text-[#d70018] flex items-center justify-center font-black text-sm mb-2'>
                    🎯
                  </div>
                  <h3 className='font-black text-slate-900 text-xs sm:text-sm'>Sứ mệnh</h3>
                  <p className='text-slate-500 text-xs mt-1 leading-relaxed'>
                    Phổ cập thiết bị công nghệ chính hãng với giá cả cạnh tranh, chính sách trả góp 0% linh hoạt và bảo hành tận tâm.
                  </p>
                </div>

                <div className='bg-slate-50 p-4 rounded-2xl border border-slate-200/80'>
                  <div className='w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm mb-2'>
                    🚀
                  </div>
                  <h3 className='font-black text-slate-900 text-xs sm:text-sm'>Tầm nhìn</h3>
                  <p className='text-slate-500 text-xs mt-1 leading-relaxed'>
                    Trở thành chuỗi bán lẻ công nghệ tin cậy số 1, kết nối dịch vụ sửa chữa Điện Thoại Vui và bảo hành ủy quyền CareS.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className='bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm'>
            <div className='text-center mb-8'>
              <h2 className='text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight'>
                VÌ SAO HƠN 2 TRIỆU KHÁCH HÀNG TIN CHỌN <span className='text-[#d70018]'>MINH TUẤN SHOP</span>
              </h2>
              <p className='text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mt-1'>
                Cam kết chất lượng dịch vụ chuẩn 5 sao trên toàn hệ thống 180 chi nhánh
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='p-6 rounded-2xl bg-red-50/50 border border-red-100 text-center space-y-3'>
                <div className='w-14 h-14 bg-[#d70018] text-white rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-sm'>
                  🛡️
                </div>
                <h3 className='font-black text-slate-900 text-sm'>100% Hàng Chính Hãng VAT</h3>
                <p className='text-xs text-slate-600 leading-relaxed'>
                  Xuất đầy đủ hóa đơn điện tử VAT cho khách hàng cá nhân và doanh nghiệp, bảo hành chính hãng 12-24 tháng.
                </p>
              </div>

              <div className='p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-center space-y-3'>
                <div className='w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-sm'>
                  ⚡
                </div>
                <h3 className='font-black text-slate-900 text-sm'>Giao Nhanh 2 Giờ & Trả Góp 0%</h3>
                <p className='text-xs text-slate-600 leading-relaxed'>
                  Giao hàng miễn phí nội thành đơn từ 300k. Thủ tục trả góp xét duyệt nhanh 5 phút qua thẻ hoặc CCCD gắn chip.
                </p>
              </div>

              <div className='p-6 rounded-2xl bg-blue-50/50 border border-blue-100 text-center space-y-3'>
                <div className='w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-sm'>
                  🔄
                </div>
                <h3 className='font-black text-slate-900 text-sm'>Thu Cũ Đổi Mới Lên Đời</h3>
                <p className='text-xs text-slate-600 leading-relaxed'>
                  Chương trình trợ giá thu cũ lên đời tốt nhất thị trường, hỗ trợ đến 4.000.000đ khi nâng cấp máy mới.
                </p>
              </div>
            </div>

            {/* Stats Banner */}
            <div className='bg-[#d70018] rounded-2xl p-6 sm:p-8 text-white mt-8 shadow-md'>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-6 text-center'>
                <div>
                  <div className='text-2xl sm:text-3xl font-black mb-1'>180+</div>
                  <div className='text-xs text-red-100 font-medium'>Cửa hàng toàn quốc</div>
                </div>
                <div>
                  <div className='text-2xl sm:text-3xl font-black mb-1'>2.000.000+</div>
                  <div className='text-xs text-red-100 font-medium'>Thành viên Smember</div>
                </div>
                <div>
                  <div className='text-2xl sm:text-3xl font-black mb-1'>100%</div>
                  <div className='text-xs text-red-100 font-medium'>Sản phẩm chính hãng</div>
                </div>
                <div>
                  <div className='text-2xl sm:text-3xl font-black mb-1'>1800 6868</div>
                  <div className='text-xs text-red-100 font-medium'>Tổng đài hỗ trợ miễn phí</div>
                </div>
              </div>
            </div>

          </div>

          <NewsletterBox />
        </div>
      </div>
    </PageTransition>
  );
};

export default About;
