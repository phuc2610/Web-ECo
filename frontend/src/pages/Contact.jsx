import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import { useForm, ValidationError } from '@formspree/react';

const Contact = () => {
  const [state, handleSubmit] = useForm("mkgvgrpp");
  
  if (state.succeeded) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='bg-white rounded-2xl shadow-xl p-12 text-center max-w-md mx-4'>
          <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6'>
            <svg className='w-10 h-10 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
            </svg>
          </div>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>Cảm ơn bạn!</h2>
          <p className='text-gray-600 mb-6'>
            Lời nhắn của bạn đã được gửi thành công. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
          </p>
          <a 
            href='/'
            className='inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors'
          >
            Về trang chủ
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16'>
          
          {/* Contact Information */}
          <div className='space-y-8'>
            <div>
              <h2 className='text-3xl font-bold text-gray-900 mb-6'>Hãy để lại lời nhắn</h2>
              <p className='text-lg text-gray-600 leading-relaxed'>
                Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn cho bạn. Hãy liên hệ với chúng tôi để được tư vấn 
                về sản phẩm hoặc giải đáp mọi thắc mắc.
              </p>
            </div>

            {/* Contact Details */}
            <div className='space-y-6'>
              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0'>
                  <svg className='w-6 h-6 text-blue-600' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd' />
                  </svg>
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 mb-1'>Địa chỉ</h3>
                  <p className='text-gray-600'>
                    719 Đường Phạm Văn Thuận<br />
                    Phường Tam Hiệp - TP Biên Hòa<br />
                    Tỉnh Đồng Nai, Việt Nam
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0'>
                  <svg className='w-6 h-6 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
                    <path d='M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z' />
                  </svg>
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 mb-1'>Điện thoại</h3>
                  <p className='text-gray-600'>
                    <a href='tel:0358409406' className='hover:text-blue-600 transition-colors'>
                      0358 409 406
                    </a>
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0'>
                  <svg className='w-6 h-6 text-purple-600' fill='currentColor' viewBox='0 0 20 20'>
                    <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                    <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                  </svg>
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 mb-1'>Email</h3>
                  <p className='text-gray-600'>
                    <a href='mailto:ngocphieu@gmail.com' className='hover:text-blue-600 transition-colors'>
                      ngocphieu@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0'>
                  <svg className='w-6 h-6 text-orange-600' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z' clipRule='evenodd' />
                  </svg>
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 mb-1'>Giờ làm việc</h3>
                  <p className='text-gray-600'>
                    Thứ 2 - Thứ 7: 8:00 - 21:00<br />
                    Chủ nhật: 9:00 - 18:00
                  </p>
                </div>
              </div>
            </div>

            {/* Store Image */}
            <div className='relative'>
              <img 
                className='w-full rounded-2xl shadow-lg' 
                src={assets.contact_img} 
                alt="NP Computer Store" 
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl'></div>
            </div>
          </div>

          {/* Contact Form */}
          <div className='bg-white rounded-2xl shadow-xl p-8'>
            <h3 className='text-2xl font-bold text-gray-900 mb-6'>Gửi tin nhắn cho chúng tôi</h3>
            
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-2'>
                  Email liên hệ <span className='text-red-500'>*</span>
                </label>
                <input
                  id="email"
                  type="email" 
                  name="email"
                  required
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                  placeholder='Nhập email của bạn...'
                />
                <ValidationError 
                  prefix="Email" 
                  field="email"
                  errors={state.errors}
                  className='text-red-500 text-sm mt-1'
                />
              </div>

              <div>
                <label htmlFor="message" className='block text-sm font-medium text-gray-700 mb-2'>
                  Nội dung tin nhắn <span className='text-red-500'>*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none'
                  placeholder='Hãy để lại lời nhắn của bạn...'
                />
                <ValidationError 
                  prefix="Message" 
                  field="message"
                  errors={state.errors}
                  className='text-red-500 text-sm mt-1'
                />
              </div>

              <button 
                type="submit" 
                disabled={state.submitting}
                className={`
                  w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200
                  ${state.submitting
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 active:scale-95 shadow-lg'
                  }
                `}
              >
                {state.submitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
              </button>
            </form>

            {/* Additional Info */}
            <div className='mt-8 p-6 bg-blue-50 rounded-xl'>
              <h4 className='font-semibold text-blue-900 mb-3'>Thông tin bổ sung</h4>
              <div className='space-y-2 text-sm text-blue-800'>
                <div className='flex items-center gap-2'>
                  <svg className='w-4 h-4 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                  </svg>
                  Phản hồi trong vòng 24 giờ
                </div>
                <div className='flex items-center gap-2'>
                  <svg className='w-4 h-4 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                  </svg>
                  Tư vấn miễn phí 100%
                </div>
                <div className='flex items-center gap-2'>
                  <svg className='w-4 h-4 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                  </svg>
                  Hỗ trợ kỹ thuật chuyên nghiệp
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className='mt-20'>
          <div className='bg-white rounded-2xl shadow-lg p-8'>
            <h3 className='text-2xl font-bold text-gray-900 mb-6 text-center'>Vị trí của chúng tôi</h3>
            <div className='bg-gray-200 rounded-xl h-64 flex items-center justify-center'>
              <div className='text-center text-gray-500'>
                <svg className='w-16 h-16 mx-auto mb-4' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd' />
                </svg>
                <p className='text-lg font-medium'>Bản đồ sẽ được tích hợp sau</p>
                <p className='text-sm'>719 Đường Phạm Văn Thuận, Phường Tam Hiệp, TP Biên Hòa</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NewsletterBox />
    </div>
  )
}

export default Contact