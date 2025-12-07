import React from 'react'
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <div className='relative flex flex-col sm:flex-row bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-lg overflow-hidden'>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-transparent to-purple-100/20"></div>
        </div>
        
        {/* Hero Left Side */}
        <div className='relative w-full sm:w-1/2 flex items-center justify-center p-10 sm:p-16 lg:p-20'>
            <div className='text-gray-800 max-w-lg'>
                <div className='flex items-center gap-3 mb-6'>
                    <div className='w-12 md:w-16 h-[3px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full'></div>
                    <p className='font-medium text-sm md:text-base text-gray-600 uppercase tracking-wide'>Sản phẩm bán chạy nhất</p>
                </div>
                
                <h1 className='font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-8 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent'>
                    Hàng mới nhất
                </h1>
                
                <p className='text-gray-600 text-lg mb-8 leading-relaxed'>
                    Khám phá bộ sưu tập công nghệ mới nhất với những sản phẩm chất lượng cao và hiệu năng vượt trội.
                </p>
                
                <div className='flex items-center gap-3 group cursor-pointer'>
                    <span className='font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition-colors'>Mua sắm ngay</span>
                    <div className='w-12 md:w-16 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full group-hover:w-20 transition-all duration-300'></div>
                    <div className='w-3 h-3 border-2 border-blue-500 border-r-0 border-b-0 rotate-45 group-hover:translate-x-1 transition-transform'></div>
                </div>
            </div>
        </div>
        
        {/* Hero Right Side */}
        <div className='relative w-full sm:w-1/2 overflow-hidden'>
            <div className='relative h-full'>
                <img 
                    className='w-full h-full object-cover transform hover:scale-105 transition-transform duration-700' 
                    src={assets.hero_img} 
                    alt="Tech Collection" 
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent'></div>
                
                {/* Floating Elements */}
                <div className='absolute top-8 right-8 bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg'>
                    <div className='w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse'></div>
                </div>
                
                <div className='absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg max-w-xs'>
                    <div className='flex items-center gap-3'>
                        <div className='flex -space-x-2'>
                            <div className='w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border-2 border-white'></div>
                            <div className='w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-white'></div>
                            <div className='w-8 h-8 bg-gradient-to-r from-pink-400 to-red-400 rounded-full border-2 border-white'></div>
                        </div>
                        <div>
                            <p className='text-sm font-semibold text-gray-800'>+1000</p>
                            <p className='text-xs text-gray-600'>Khách hàng hài lòng</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Hero

