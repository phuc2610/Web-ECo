import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReviewForm from '../components/ReviewForm';

const Orders = () => {

  const {backendUrl , token , currency} = useContext(ShopContext);

  const [orderData,setorderData] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrderData = async () => {
    try {
      if(!token){
          return null;
      }

      const response = await axios.post(backendUrl + '/api/order/userorders',{},{headers:{token}});
      if (response.data.success){
        setorderData(response.data.orders.reverse());
      }
      

    } catch (error) {
      console.error('Error loading orders:', error);
    }
  }

  const handleCancelOrder = async (orderId) => {
    try {
      setCancellingOrder(orderId);
      const response = await axios.post(
        backendUrl + '/api/order/cancel',
        { orderId },
        { headers: { token } }
      );
      
      if (response.data.success) {
        // Reload order data
        await loadOrderData();
        toast.success('Đã hủy đơn hàng thành công!');
      } else {
        toast.error('Không thể hủy đơn hàng: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Có lỗi xảy ra khi hủy đơn hàng');
    } finally {
      setCancellingOrder(null);
    }
  };

  const handleReviewProduct = (product, order) => {
    setSelectedProduct(product);
    setSelectedOrder(order);
    setShowReviewForm(true);
  };

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    setSelectedProduct(null);
    setSelectedOrder(null);
    // Reload order data to refresh any review status
    loadOrderData();
  };

  useEffect(() =>{
    loadOrderData();
  },[token])

  // If no orders, show empty state
  if (orderData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="mb-8">
              <Title text1={'Đơn hàng'} text2={'của tôi'} />
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Chưa có đơn hàng nào</h3>
              <p className="text-gray-600 mb-8">Bạn chưa đặt đơn hàng nào. Hãy bắt đầu mua sắm ngay!</p>
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Mua sắm ngay
              </button>
            </div>
                  </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && selectedProduct && selectedOrder && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <ReviewForm
              productId={selectedProduct._id}
              orderId={selectedOrder._id}
              productName={selectedProduct.name}
              productImage={selectedProduct.image[0]}
              onClose={() => setShowReviewForm(false)}
              onSubmitted={handleReviewSubmitted}
            />
          </div>
        </div>
      )}
      

    </div>
  );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Title text1={'Đơn hàng'} text2={'của tôi'} />
          <p className="text-gray-600 mt-2">Theo dõi và quản lý tất cả đơn hàng của bạn</p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orderData.map((order,index) => {
            return (
            <div key={index} className='bg-white rounded-2xl shadow-lg overflow-hidden'>
              {/* Order Header */}
              <div className='p-6 border-b border-gray-100'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
                  {/* Order Info */}
                  <div className='flex items-start gap-6'>
                    {/* Product Image */}
                    <div className="relative">
                      <img 
                        className='w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shadow-md' 
                        src={order.items[0]?.image[0]} 
                        alt="" 
                      />
                      {order.items.length > 1 && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">+{order.items.length - 1}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Order Details */}
                    <div className='flex-1'>
                      <h3 className='text-lg sm:text-xl font-semibold text-gray-800 mb-2'>
                        {order.items.length > 1 
                          ? `${order.items[0]?.name} + ${order.items.length - 1} sản phẩm khác`
                          : order.items[0]?.name
                        }
                      </h3>
                      
                      <div className='flex flex-wrap items-center gap-4 mb-3'>
                        <p className='text-2xl font-bold text-red-600'>
                          {order.amount.toLocaleString('vi-VN')}{currency}
                        </p>
                        <span className='px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full'>
                          {order.items.length} sản phẩm
                        </span>
                      </div>
                      
                      {/* Voucher Info */}
                      {order.voucherCode && (
                        <div className='inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-3'>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          Voucher: {order.voucherCode} (-{order.discountAmount?.toLocaleString('vi-VN')}{currency})
                        </div>
                      )}
                      
                      {/* Order Meta */}
                      <div className='flex flex-wrap items-center gap-4 text-sm text-gray-600'>
                        <div className='flex items-center gap-2'>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                        <div className='flex items-center gap-2'>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          {order.paymentMethod}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Status & Actions */}
                  <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
                    {/* Status */}
                    <div className='flex items-center gap-3'>
                      <div className={`w-3 h-3 rounded-full ${
                        order.status === 'Đã hủy' ? 'bg-red-500' :
                        order.status === 'Đã giao hàng' ? 'bg-green-500' :
                        order.status === 'Đang giao hàng' ? 'bg-blue-500' :
                        order.status === 'Đang đóng gói' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`}></div>
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                        order.status === 'Đã hủy' ? 'bg-red-100 text-red-700' :
                        order.status === 'Đã giao hàng' ? 'bg-green-100 text-green-700' :
                        order.status === 'Đang giao hàng' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'Đang đóng gói' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status === 'Đã hủy' && order.cancelReason 
                          ? `${order.status} - ${order.cancelReason}`
                          : order.status
                        }
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex gap-3'>
                      {/* Cancel Order Button */}
                      {order.status === 'Đã đặt hàng' ? (
                        <button 
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={cancellingOrder === order._id}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            cancellingOrder === order._id
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                          }`}
                        >
                          {cancellingOrder === order._id ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Đang hủy...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Hủy đơn
                            </div>
                          )}
                        </button>
                      ) : (
                        <span className='text-xs text-gray-500 px-3 py-2 bg-gray-100 rounded-lg'>
                          {order.status === 'Đã hủy' ? 'Đã hủy' : 'Không thể hủy'}
                        </span>
                      )}
                      
                      {/* View Details Button */}
                      <button 
                        onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)} 
                        className='px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center gap-2'
                      >
                        {expandedOrder === order._id ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                            Ẩn chi tiết
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            Xem chi tiết
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Order Details (Expandable) */}
              {expandedOrder === order._id && (
                <div className='p-6 bg-gray-50'>
                  <h4 className='font-semibold text-gray-800 mb-4 text-lg'>Chi tiết sản phẩm</h4>
                  
                  {/* Products List */}
                  <div className='space-y-4 mb-6'>
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className='flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200'>
                        <img className='w-16 h-16 object-cover rounded-lg shadow-sm' src={item.image[0]} alt={item.name} />
                        <div className='flex-1'>
                          <h5 className='font-semibold text-gray-800 mb-1'>{item.name}</h5>
                          <div className='flex items-center gap-4 text-sm text-gray-600 mb-3'>
                            <span>Size: {item.size}</span>
                            <span>Số lượng: {item.quantity}</span>
                          </div>
                          
                          {/* Review Button for delivered orders */}
                          {order.status === 'Đã giao hàng' && (
                            <button
                              onClick={() => handleReviewProduct(item, order)}
                              className='px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center gap-2'
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                              Đánh giá
                            </button>
                          )}
                        </div>
                        <div className='text-right'>
                          <p className='font-semibold text-gray-800 text-lg'>
                            {(item.price * item.quantity).toLocaleString('vi-VN')}{currency}
                          </p>
                          <p className='text-sm text-gray-500'>
                            {item.price.toLocaleString('vi-VN')}{currency}/sản phẩm
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Order Summary */}
                  <div className='bg-white rounded-xl p-6 border border-gray-200'>
                    <h5 className='font-semibold text-gray-800 mb-4'>Tổng kết đơn hàng</h5>
                    <div className='space-y-3'>
                      <div className='flex justify-between items-center text-sm'>
                        <span className='text-gray-600'>Tổng giá sản phẩm:</span>
                        <span className='font-medium'>{(order.originalAmount || order.amount).toLocaleString('vi-VN')}{currency}</span>
                      </div>
                      {order.discountAmount > 0 && (
                        <div className='flex justify-between items-center text-sm text-green-600'>
                          <span>Giảm giá (Voucher):</span>
                          <span className='font-medium'>-{order.discountAmount.toLocaleString('vi-VN')}{currency}</span>
                        </div>
                      )}
                      <div className='flex justify-between items-center font-semibold text-xl pt-3 border-t border-gray-200'>
                        <span>Tổng thanh toán:</span>
                        <span className='text-red-600'>{order.amount.toLocaleString('vi-VN')}{currency}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )})}
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && selectedProduct && selectedOrder && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.6)', 
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <ReviewForm
              productId={selectedProduct._id}
              orderId={selectedOrder._id}
              productName={selectedProduct.name}
              productImage={selectedProduct.image[0]}
              onClose={() => setShowReviewForm(false)}
              onSubmitted={handleReviewSubmitted}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders