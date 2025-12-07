import React from 'react'

const NewsletterBox = () => {

    const onSubmitHandler = (event) => {
    event.preventDefault();
    }

  return (
    <div className='text-center py-1'>
        <p className='text-2xl font-medium text-gray-800'>Đăng ký ngay & giảm giá 10%</p>
        <p className='text-gray-600 mt-3 text-[16px]'>
            Chỉ cần đăng ký tài khoản, bạn sẽ nhận ngay mã giảm giá 10% cho đơn hàng đầu tiên.
            Nhanh tay – số lượng ưu đãi có hạn!
        </p>
       
    </div>
  )
}

export default NewsletterBox