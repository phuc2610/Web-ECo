import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'

const QuickAddModal = ({ isOpen, onClose, product }) => {
    const { addToCart } = useContext(ShopContext);
    const [selectedSize, setSelectedSize] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        if (!selectedSize) {
            return;
        }
        
        setIsAdding(true);
        try {
            await addToCart(product._id, selectedSize);
            onClose();
            setSelectedSize('');
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
        setIsAdding(false);
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto'>
                {/* Header */}
                <div className='flex justify-between items-start mb-4'>
                    <h3 className='text-lg font-bold text-gray-800'>Chọn size sản phẩm</h3>
                    <button 
                        onClick={onClose}
                        className='p-1 hover:bg-gray-100 rounded-full transition-colors'
                    >
                        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                        </svg>
                    </button>
                </div>

                {/* Product Info */}
                <div className='flex gap-4 mb-6'>
                    <img 
                        src={product?.image?.[0]} 
                        alt={product?.name}
                        className='w-20 h-20 object-cover rounded-lg'
                    />
                    <div>
                        <h4 className='font-medium text-gray-800 mb-1'>{product?.name}</h4>
                        <p className='text-lg font-bold text-red-600'>
                            {product?.price?.toLocaleString('vi-VN')} đ
                        </p>
                    </div>
                </div>

                {/* Size Selection */}
                <div className='mb-6'>
                    <p className='font-medium text-gray-800 mb-3'>Chọn size:</p>
                    <div className='grid grid-cols-3 gap-2'>
                        {product?.sizes?.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                                    selectedSize === size
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                    {!product?.sizes || product.sizes.length === 0 ? (
                        <p className='text-gray-500 text-sm'>Không có size khả dụng</p>
                    ) : null}
                </div>

                {/* Action Buttons */}
                <div className='flex gap-3'>
                    <button
                        onClick={onClose}
                        className='flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors'
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleAddToCart}
                        disabled={!selectedSize || isAdding}
                        className='flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                    >
                        {isAdding ? (
                            <>
                                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                Đang thêm...
                            </>
                        ) : (
                            'Thêm vào giỏ hàng'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default QuickAddModal
