import React from 'react'

const Title = ({text1, text2}) => {
  return (
    <div className='flex flex-col items-center text-center mb-8'>
        <div className='flex items-center gap-3 mb-4'>
            <div className='w-8 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-blue-500'></div>
            <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800'>
                {text1} 
                <span className='text-blue-600 ml-2'>
                    {text2}
                </span>
            </h2>
            <div className='w-8 h-[2px] bg-gradient-to-l from-transparent via-purple-500 to-purple-500'></div>
        </div>
        <p className='text-gray-600 max-w-2xl text-sm sm:text-base leading-relaxed'>
            Khám phá bộ sưu tập tuyệt vời với những sản phẩm chất lượng cao được tuyển chọn kỹ lưỡng
        </p>
    </div>
  )
}

export default Title