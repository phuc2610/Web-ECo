import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const WishlistProductItem = ({id, image, name, price, originalPrice, averageRating, totalReviews}) => {
    const {currency, backendUrl, token} = useContext(ShopContext);
    const [isLoading, setIsLoading] = useState(true);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const hasDiscount = typeof originalPrice === 'number' && originalPrice > price;
    const discountPercent = hasDiscount ? Math.round((1 - (price / originalPrice)) * 100) : 0;

    // Check wishlist status
    useEffect(() => {
        const checkWishlistStatus = async () => {
            if (!token) return;
            
            try {
                const response = await axios.get(`${backendUrl}/api/wishlist/check/${id}`, {
                    headers: { token }
                });
                setIsInWishlist(response.data.isInWishlist);
            } catch (error) {
                console.error('Error checking wishlist status:', error);
            }
        };

        checkWishlistStatus();
    }, [token, id]);

    // Toggle wishlist
    const toggleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!token) {
            toast.error('Vui lòng đăng nhập để sử dụng tính năng này');
            return;
        }

        if (isWishlistLoading) return;

        try {
            setIsWishlistLoading(true);
            
            if (isInWishlist) {
                // Remove from wishlist
                await axios.delete(`${backendUrl}/api/wishlist/remove/${id}`, {
                    headers: { token }
                });
                setIsInWishlist(false);
                toast.success('Đã xóa khỏi danh sách yêu thích');
            } else {
                // Add to wishlist
                await axios.post(`${backendUrl}/api/wishlist/add`, {
                    productId: id
                }, {
                    headers: { token }
                });
                setIsInWishlist(true);
                toast.success('Đã thêm vào danh sách yêu thích');
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            toast.error('Có lỗi xảy ra');
        } finally {
            setIsWishlistLoading(false);
        }
    };

    // Add to cart
    const addToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!token) {
            toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
            return;
        }

        if (isAddingToCart) return;

        try {
            setIsAddingToCart(true);
            const response = await axios.post(
                `${backendUrl}/api/cart/add`,
                {
                    productId: id,
                    size: 'Default',
                    quantity: 1
                },
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success('Đã thêm vào giỏ hàng');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng');
        } finally {
            setIsAddingToCart(false);
        }
    };

    return (
        <div className='group bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 w-[200px] h-[320px] mx-auto flex flex-col'>
            {/* Image Container */}
            <div className='relative overflow-hidden bg-gray-50 aspect-square w-full'>
                {/* Loading Skeleton */}
                {isLoading && (
                    <div className='absolute inset-0 bg-gray-200 animate-pulse'></div>
                )}
                
                <img 
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-md' 
                    src={image[0]} 
                    alt={name}
                    onLoad={() => setIsLoading(false)}
                    style={{display: isLoading ? 'none' : 'block'}}
                />
                
                {/* Overlay với text "Chi tiết" */}
                <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center'>
                    <span className='text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300'>
                        Chi tiết
                    </span>
                </div>
                
                {/* Wishlist Button */}
                <button
                    onClick={toggleWishlist}
                    disabled={isWishlistLoading}
                    className='absolute top-1.5 right-1.5 bg-white bg-opacity-90 hover:bg-opacity-100 p-1.5 rounded-full shadow-sm transition-all duration-200 disabled:opacity-50'
                >
                    {isWishlistLoading ? (
                        <div className='animate-spin rounded-full h-3 w-3 border-b-2 border-red-500'></div>
                    ) : (
                        <svg 
                            className={`w-3 h-3 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                            fill={isInWishlist ? 'currentColor' : 'none'}
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    )}
                </button>

                {/* Discount Badge (button-like) */}
                {hasDiscount && (
                    <div className='absolute top-1.5 left-1.5'>
                        <span className='inline-block px-1 py-0.5 rounded-full text-xs font-bold shadow-sm bg-green-600 text-white'>
                            -{discountPercent}%
                        </span>
                    </div>
                )}
            </div>
            
            {/* Product Info */}
            <div className='p-2 flex-1 flex flex-col'>
                <Link to={`/product/${id}`} className='block'>
                    <h3 className='text-gray-800 font-medium text-xs leading-4 mb-1.5 line-clamp-2 hover:text-blue-600 transition-colors'>
                        {name}
                    </h3>
                </Link>
                
                {/* Rating */}
                {averageRating > 0 && (
                    <div className='flex items-center space-x-1 mb-1'>
                        <div className='flex items-center space-x-0.5'>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`text-xs ${
                                        star <= Math.round(averageRating)
                                            ? 'text-yellow-400'
                                            : 'text-gray-300'
                                    }`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <span className='text-xs text-gray-500'>
                            ({totalReviews || 0})
                        </span>
                    </div>
                )}
                
                <div className='flex flex-col gap-0.5 mb-2 flex-1'>
                    {hasDiscount && (
                        <span className='text-xs text-gray-400 line-through'>
                            {originalPrice.toLocaleString('vi-VN')}{currency}
                        </span>
                    )}
                    <p className='text-xs font-bold text-red-600'>
                        {price.toLocaleString('vi-VN')}{currency}
                    </p>
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={addToCart}
                    disabled={isAddingToCart}
                    className='w-full bg-blue-600 text-white py-1.5 px-2 rounded text-xs font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-auto'
                >
                    {isAddingToCart ? (
                        <div className='flex items-center justify-center'>
                            <div className='animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1'></div>
                            Đang thêm...
                        </div>
                    ) : (
                        'Thêm vào giỏ'
                    )}
                </button>
            </div>
        </div>
    )
}

export default WishlistProductItem
