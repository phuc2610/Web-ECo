import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        {/* Company Story */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20'>
          <div className='relative'>
            <div className='relative z-10'>
              <img 
                className='w-full rounded-2xl shadow-2xl' 
                src={assets.about_img} 
                alt="About NP Computer" 
              />
            </div>
            {/* Decorative elements */}
            <div className='absolute -top-4 -left-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20'></div>
            <div className='absolute -bottom-4 -right-4 w-32 h-32 bg-blue-400 rounded-full opacity-20'></div>
          </div>
          
          <div className='space-y-8'>
            <div className='space-y-6'>
              <h2 className='text-3xl font-bold text-gray-900'>Câu chuyện của chúng tôi</h2>
              <p className='text-lg text-gray-600 leading-relaxed'>
                NP Computer là thương hiệu ra đời vào năm 2024, chuyên cung cấp máy tính, laptop và linh kiện PC chất lượng cao. 
                Chúng tôi phục vụ đa dạng nhu cầu từ học tập, làm việc văn phòng cho đến gaming, thiết kế đồ họa và hệ thống doanh nghiệp.
              </p>
              <p className='text-lg text-gray-600 leading-relaxed'>
                Với phương châm <span className='font-bold text-blue-600'>"Hiệu năng – Bền bỉ – Giá trị"</span>, NP Computer không chỉ đơn thuần là nơi bán sản phẩm 
                mà còn là người bạn đồng hành đáng tin cậy của khách hàng trong hành trình chinh phục công nghệ.
              </p>
            </div>

            {/* Mission & Vision Cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500'>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                    <svg className='w-5 h-5 text-blue-600' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z' clipRule='evenodd' />
                    </svg>
                  </div>
                  <h3 className='text-xl font-bold text-gray-900'>Sứ mệnh</h3>
                </div>
                <p className='text-gray-600 leading-relaxed'>
                  NP Computer cam kết mang đến cho khách hàng những sản phẩm chính hãng, đa dạng và giá cả hợp lý.
                  Đội ngũ của chúng tôi luôn tư vấn tận tâm để giúp bạn chọn được sản phẩm phù hợp nhất.
                </p>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500'>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center'>
                    <svg className='w-5 h-5 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
                      <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                  </div>
                  <h3 className='text-xl font-bold text-gray-900'>Tầm nhìn</h3>
                </div>
                <p className='text-gray-600 leading-relaxed'>
                  Chúng tôi hướng đến việc trở thành một trong những nhà cung cấp máy tính & linh kiện tin cậy nhất tại Việt Nam,
                  xây dựng hệ thống phân phối hiện đại cùng dịch vụ khách hàng chuyên nghiệp.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl font-bold text-gray-900 mb-4'>
            TẠI SAO CHỌN <span className='text-blue-600'>NP COMPUTER</span>
          </h2>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất với chất lượng dịch vụ hàng đầu
          </p>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-20'>
          <div className='bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 group'>
            <div className='w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300'>
              <svg className='w-10 h-10 text-blue-600' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
              </svg>
            </div>
            <h3 className='text-xl font-bold text-gray-900 mb-4'>Sản phẩm chính hãng</h3>
            <p className='text-gray-600 leading-relaxed'>
              Toàn bộ sản phẩm tại NP Computer đều được nhập khẩu hoặc phân phối chính thức, 
              cam kết nói không với hàng giả, hàng nhái. Bảo hành rõ ràng, minh bạch.
            </p>
          </div>

          <div className='bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 group'>
            <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300'>
              <svg className='w-10 h-10 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd' />
              </svg>
            </div>
            <h3 className='text-xl font-bold text-gray-900 mb-4'>Tư vấn chuyên nghiệp</h3>
            <p className='text-gray-600 leading-relaxed'>
              Đội ngũ kỹ thuật am hiểu công nghệ, sẵn sàng tư vấn máy tính, laptop, linh kiện 
              phù hợp với nhu cầu từ học tập, làm việc đến gaming & thiết kế.
            </p>
          </div>

          <div className='bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 group'>
            <div className='w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300'>
              <svg className='w-10 h-10 text-purple-600' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 01.12-.38z' clipRule='evenodd' />
              </svg>
            </div>
            <h3 className='text-xl font-bold text-gray-900 mb-4'>Dịch vụ hậu mãi</h3>
            <p className='text-gray-600 leading-relaxed'>
              Hỗ trợ bảo hành chính hãng, nâng cấp linh kiện, vệ sinh – bảo trì máy tính tận tâm, 
              cùng chính sách đổi trả rõ ràng và minh bạch.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className='bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-white text-center'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            <div>
              <div className='text-3xl md:text-4xl font-bold mb-2'>1000+</div>
              <div className='text-blue-100'>Khách hàng hài lòng</div>
            </div>
            <div>
              <div className='text-3xl md:text-4xl font-bold mb-2'>500+</div>
              <div className='text-blue-100'>Sản phẩm chất lượng</div>
            </div>
            <div>
              <div className='text-3xl md:text-4xl font-bold mb-2'>24/7</div>
              <div className='text-blue-100'>Hỗ trợ khách hàng</div>
            </div>
            <div>
              <div className='text-3xl md:text-4xl font-bold mb-2'>100%</div>
              <div className='text-blue-100'>Sản phẩm chính hãng</div>
            </div>
          </div>
        </div>
      </div>

      <NewsletterBox />
    </div>
  )
}

export default About
