import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className='bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white w-full'>
        {/* Main Footer Content */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
            <div className='flex flex-col md:flex-row justify-between gap-8'>
                {/* Brand Section - Sát góc trái */}
                <div className='md:w-1/3'>
                    <a href="/" className='inline-block mb-3'>
                        <img src={assets.logo} className='w-32' alt="TLook Logo" />
                    </a>
                    <p className='text-gray-300 text-sm leading-relaxed mb-4 max-w-md'>
                    NP Computer cam kết mang đến cho khách hàng những sản phẩm công nghệ chính hãng, đa dạng, phù hợp với nhu cầu sử dụng tại Việt Nam, đồng thời tư vấn chính xác – tối ưu – tận tâm.
                    </p>
                    
                    {/* Social Media */}
                    <div className='flex items-center gap-3'>
                        <p className='text-gray-400 font-medium text-sm'>Theo dõi chúng tôi:</p>
                        <div className='flex gap-2'>
                            <a href="#" className='w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors'>
                                <svg className='w-5 h-5 fill-current' viewBox='0 0 24 24'>
                                    <path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z'/>
                                </svg>
                            </a>
                            <a href="https://www.facebook.com/ngoc.phieu.982562" className='w-8 h-8 bg-blue-800 hover:bg-blue-900 rounded-full flex items-center justify-center transition-colors'>
                                <svg className='w-4 h-4 fill-current' viewBox='0 0 24 24'>
                                    <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/>
                                </svg>
                            </a>
                            <a href="#" className='w-8 h-8 bg-pink-600 hover:bg-pink-700 rounded-full flex items-center justify-center transition-colors'>
                                <svg className='w-5 h-5 fill-current' viewBox='0 0 24 24'>
                                    <path d='M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z'/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Company Links - Ở giữa */}
                <div className='md:w-1/3 flex justify-center'>
                    <div>
                        <h3 className='text-lg font-bold mb-3 text-white relative'>
                            CÔNG TY
                            <div className='absolute bottom-0 left-0 w-10 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 -mb-1'></div>
                        </h3>
                        <ul className='space-y-2'>
                            <li>
                                <a href="/about" className='text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center gap-1 text-sm'>
                                    <span className='text-blue-400'>→</span>
                                    Giới thiệu về chúng tôi
                                </a>
                            </li>
                            <li>
                                <a href="/contact" className='text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center gap-1 text-sm'>
                                    <span className='text-blue-400'>→</span>
                                    Liên hệ với chúng tôi
                                </a>
                            </li>
                            <li>
                                <a href="#" className='text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center gap-1 text-sm'>
                                    <span className='text-blue-400'>→</span>
                                    Chính sách vận chuyển
                                </a>
                            </li>
                            <li>
                                <a href="#" className='text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center gap-1 text-sm'>
                                    <span className='text-blue-400'>→</span>
                                    Chính sách bảo mật
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Contact Info - Sát góc phải */}
                <div className='md:w-1/3 flex justify-end'>
                    <div>
                        <h3 className='text-lg font-bold mb-3 text-white relative'>
                            LIÊN HỆ
                            <div className='absolute bottom-0 left-0 w-10 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 -mb-1'></div>
                        </h3>
                        <div className='space-y-3'>
                            <div className='flex items-center gap-2 text-gray-300'>
                                <div className='w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0'>
                                    <svg className='w-3 h-3 fill-current text-white' viewBox='0 0 24 24'>
                                        <path d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'/>
                                    </svg>
                                </div>
                                <a href="tel:0358409406" className='hover:text-white transition-colors text-sm'>
                                    0358409406
                                </a>
                            </div>
                            
                            <div className='flex items-center gap-2 text-gray-300'>
                                <div className='w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0'>
                                    <svg className='w-3 h-3 fill-current text-white' viewBox='0 0 24 24'>
                                        <path d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'/>
                                    </svg>
                                </div>
                                <a href="mailto:ngocphieu@gmail.com" className='hover:text-white transition-colors break-all text-sm'>
                                    ngocphieu@gmail.com
                                </a>
                            </div>
                            
                            <div className='flex items-start gap-2 text-gray-300'>
                                <div className='w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                                    <svg className='w-3 h-3 fill-current text-white' viewBox='0 0 24 24'>
                                        <path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/>
                                    </svg>
                                </div>
                                <span className='leading-relaxed text-sm'>
                                    719 Đường Phạm Văn Thuận - Phường Tam Hiệp
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-gray-700'>
            <div className='max-w-6xl mx-auto px-4 py-3'>
                <div className='flex flex-col md:flex-row justify-between items-center gap-3'>
                    <p className='text-gray-400 text-xs'>
                        © 2024 NP Computer. Tất cả quyền được bảo lưu.
                    </p>
                    <div className='flex items-center gap-4 text-xs'>
                        <a href="#" className='text-gray-400 hover:text-white transition-colors'>
                            Điều khoản sử dụng
                        </a>
                        <a href="#" className='text-gray-400 hover:text-white transition-colors'>
                            Chính sách bảo mật
                        </a>
                        <a href="#" className='text-gray-400 hover:text-white transition-colors'>
                            Cookie Policy
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer