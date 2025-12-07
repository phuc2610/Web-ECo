import React, { useContext, useState, useEffect } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products, selectedItems, buyNowItem, setBuyNowItem } = useContext(ShopContext);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  // Clear buyNowItem when component unmounts
  useEffect(() => {
    return () => {
      setBuyNowItem(null);
    };
  }, [setBuyNowItem]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(data => ({ ...data, [name]: value }));
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let orderItems = [];
      let totalAmount = 0;
      
      if (buyNowItem) {
        // Handle Buy Now - single product
        const itemInfo = structuredClone(buyNowItem.product);
        itemInfo.size = buyNowItem.size;
        itemInfo.quantity = buyNowItem.quantity;
        orderItems.push(itemInfo);
        totalAmount = itemInfo.price * itemInfo.quantity;
      } else {
        // Handle Cart - selected items
        for (const items in cartItems) {
          for (const item in cartItems[items]) {
            if (cartItems[items][item] > 0) {
              // Check if this item is selected
              const itemKey = `${items}-${item}`;
              if (selectedItems.includes(itemKey)) {
                const itemInfo = structuredClone(products.find(product => product._id === items));
                if (itemInfo) {
                  itemInfo.size = item;
                  itemInfo.quantity = cartItems[items][item];
                  orderItems.push(itemInfo);
                  totalAmount += itemInfo.price * itemInfo.quantity;
                }
              }
            }
          }
        }
      }
      
      if (orderItems.length === 0) {
        toast.error('Không có sản phẩm nào để thanh toán');
        return;
      }
     
      let orderData = {
        address: formData,
        items: orderItems,
        amount: totalAmount + delivery_fee
      }
 
      switch (method) {
        // API calls for COD
        case 'cod':
          const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } });
       
          if (response.data.success) {
            // Hiển thị thông báo voucher nếu là đơn hàng đầu tiên
            if (response.data.isFirstOrder) {
              toast.success(response.data.message);
            } else {
              toast.success('Đặt hàng thành công!');
            }
            
            if (buyNowItem) {
              setBuyNowItem(null);
            } else {
              // Clear cart for selected items
              const newCartItems = { ...cartItems };
              for (const itemKey of selectedItems) {
                const [productId, size] = itemKey.split('-');
                if (newCartItems[productId] && newCartItems[productId][size]) {
                  newCartItems[productId][size] = 0;
                }
              }
              setCartItems(newCartItems);
            }
            
            navigate('/orders');
          } else {
            toast.error(response.data.message);
          }
          break;

        // API calls for Stripe
        case 'stripe':
          const stripeResponse = await axios.post(backendUrl + '/api/order/stripe', orderData, { headers: { token } });
          if (stripeResponse.data.success) {
            window.location.href = stripeResponse.data.url;
          } else {
            toast.error(stripeResponse.data.message);
          }
          break;

        default:
          toast.error('Phương thức thanh toán không hợp lệ');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Có lỗi xảy ra khi đặt hàng');
    }
  }

  // Get display items for summary
  const getDisplayItems = () => {
    if (buyNowItem) {
      return [{
        ...buyNowItem.product,
        size: buyNowItem.size,
        quantity: buyNowItem.quantity
      }];
    } else {
      const displayItems = [];
      for (const itemKey of selectedItems) {
        const [productId, size] = itemKey.split('-');
        const product = products.find(p => p._id === productId);
        if (product && cartItems[productId] && cartItems[productId][size] > 0) {
          displayItems.push({
            ...product,
            size: size,
            quantity: cartItems[productId][size]
          });
        }
      }
      return displayItems;
    }
  }

  const displayItems = getDisplayItems();

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <Title text1={'Đặt hàng'} text2={'Thanh toán'} />
        
        <form onSubmit={onSubmitHandler} className='mt-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            {/* Left Side - Address Form */}
            <div className='space-y-8'>
              <div className='bg-white rounded-2xl shadow-lg p-8'>
                <h2 className='text-2xl font-bold text-gray-800 mb-6'>Thông tin giao hàng</h2>
                
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Họ</label>
                    <input 
                      required  
                      onChange={onChangeHandler} 
                      name='firstName' 
                      value={formData.firstName} 
                      className='w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200' 
                      type="text" 
                      placeholder='Họ' 
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Tên</label>
                    <input 
                      required  
                      onChange={onChangeHandler} 
                      name='lastName' 
                      value={formData.lastName} 
                      className='w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200' 
                      type="text" 
                      placeholder='Tên' 
                    />
                  </div>
                </div>
                
                <div className='mt-6'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                  <input 
                    required  
                    onChange={onChangeHandler} 
                    name='email' 
                    value={formData.email} 
                    className='w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200' 
                    type="email" 
                    placeholder='email@example.com' 
                  />
                </div>
                
                <div className='mt-6'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Địa chỉ</label>
                  <input 
                    required  
                    onChange={onChangeHandler} 
                    name='street' 
                    value={formData.street} 
                    className='w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200' 
                    type="text" 
                    placeholder='Số nhà, tên đường' 
                  />
                </div>
                
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Quận/Huyện</label>
                    <input 
                      required  
                      onChange={onChangeHandler} 
                      name='city' 
                      value={formData.city} 
                      className='w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200' 
                      type="text" 
                      placeholder='Quận/Huyện' 
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Thành phố</label>
                    <input 
                      required  
                      onChange={onChangeHandler} 
                      name='state' 
                      value={formData.state} 
                      className='w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200' 
                      type="text" 
                      placeholder='Thành phố' 
                    />
                  </div>
                </div>
                
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Mã bưu chính</label>
                    <input 
                      required  
                      onChange={onChangeHandler} 
                      name='zipcode' 
                      value={formData.zipcode} 
                      className='w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200' 
                      type="number" 
                      placeholder='12345' 
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Quốc gia</label>
                    <input 
                      required  
                      onChange={onChangeHandler} 
                      name='country' 
                      value={formData.country} 
                      className='w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200' 
                      type="text" 
                      placeholder='Việt Nam' 
                    />
                  </div>
                </div>
                
                <div className='mt-6'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Số điện thoại</label>
                  <input 
                    required  
                    onChange={onChangeHandler} 
                    name='phone' 
                    value={formData.phone} 
                    className='w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200' 
                    type="tel" 
                    placeholder='0123456789' 
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Order Summary & Payment */}
            <div className='space-y-8'>
              {/* Order Summary */}
              <div className='bg-white rounded-2xl shadow-lg p-8'>
                <h2 className='text-2xl font-bold text-gray-800 mb-6'>Tóm tắt đơn hàng</h2>
                <CartTotal selectedItems={displayItems} />
              </div>

              {/* Payment Methods */}
              <div className='bg-white rounded-2xl shadow-lg p-8'>
                <h2 className='text-2xl font-bold text-gray-800 mb-6'>Phương thức thanh toán</h2>
                
                <div className='space-y-4'>
                  <div 
                    onClick={() => setMethod('stripe')} 
                    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      method === 'stripe' 
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      method === 'stripe' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                      {method === 'stripe' && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <img className='h-8' src={assets.stripe_logo} alt="Stripe" />
                    <span className='text-gray-700 font-medium'>Thẻ tín dụng/ghi nợ</span>
                  </div>
                  
                  <div 
                    onClick={() => setMethod('cod')} 
                    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      method === 'cod' 
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      method === 'cod' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                      {method === 'cod' && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div className='w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center'>
                      <svg className='w-5 h-5 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' />
                      </svg>
                    </div>
                    <span className='text-gray-700 font-medium'>Thanh toán khi nhận hàng</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <div className='mt-8'>
                  <button 
                    type='submit'  
                    className='w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  >
                    <div className='flex items-center justify-center gap-3'>
                      <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                      </svg>
                      ĐẶT HÀNG NGAY
                    </div>
                  </button>
                  
                  <p className='text-center text-sm text-gray-500 mt-3'>
                    Bằng việc đặt hàng, bạn đồng ý với <a href="#" className='text-blue-600 hover:underline'>điều khoản sử dụng</a> của chúng tôi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PlaceOrder

