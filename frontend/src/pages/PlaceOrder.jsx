import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import PageTransition from '../components/PageTransition';
import { getLastCheckoutInfo, saveLastCheckoutInfo } from '../utils/analyticsTracker';

const SparklesIcon = () => (
  <svg className="w-4 h-4 text-emerald-600 shrink-0 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const { navigate, backendUrl, token, user, cartItems, setCartItems, delivery_fee, products, selectedItems, buyNowItem, setBuyNowItem, currency } = useContext(ShopContext);

  // Address form matching Vietnamese logistics
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: '',
    email: user?.email || '',
    city: 'Hà Nội',
    district: '',
    street: '',
    note: ''
  });
  const [autoFilled, setAutoFilled] = useState(false);

  // Tự động điền thông tin từ lịch sử mua hàng hoặc tài khoản người dùng
  useEffect(() => {
    const saved = getLastCheckoutInfo();
    if (saved && (saved.fullName || saved.phone || saved.street)) {
      setFormData(prev => ({
        ...prev,
        fullName: saved.fullName || user?.name || prev.fullName,
        phone: saved.phone || user?.phone_number || prev.phone,
        email: saved.email || user?.email || prev.email,
        city: saved.city || prev.city,
        district: saved.district || prev.district,
        street: saved.street || prev.street,
      }));
      setAutoFilled(true);
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone_number || prev.phone,
        street: user.address || prev.street,
      }));
      if (user.phone_number || user.address) {
        setAutoFilled(true);
      }
    }
  }, [user]);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  // Fetch available coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/coupon/list`);
        if (res.data?.success) {
          setAvailableCoupons(res.data.coupons.filter(c => c.isActive));
        }
      } catch (err) {
        console.log('Error fetching coupons:', err);
      }
    };
    if (backendUrl) fetchCoupons();
  }, [backendUrl]);

  // Clean buyNowItem when unmounting
  useEffect(() => {
    return () => {
      setBuyNowItem(null);
    };
  }, [setBuyNowItem]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Calculate items for order
  const getOrderItems = () => {
    if (buyNowItem) {
      return [{
        ...buyNowItem.product,
        size: buyNowItem.size,
        quantity: buyNowItem.quantity,
        price: buyNowItem.product.price
      }];
    }

    const items = [];
    for (const itemsId in cartItems) {
      for (const size in cartItems[itemsId]) {
        if (cartItems[itemsId][size] > 0) {
          const itemKey = `${itemsId}-${size}`;
          if (selectedItems.includes(itemKey)) {
            const product = products.find(p => p._id === itemsId);
            if (product) {
              items.push({
                ...product,
                size: size,
                quantity: cartItems[itemsId][size],
                price: product.price
              });
            }
          }
        }
      }
    }
    return items;
  };

  const orderItems = getOrderItems();
  const subtotal = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // Calculate discount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.code.toUpperCase() === 'FREESHIP') {
      discountAmount = delivery_fee;
    } else if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscount && discountAmount > appliedCoupon.maxDiscount) {
        discountAmount = appliedCoupon.maxDiscount;
      }
    } else if (appliedCoupon.discountType === 'fixed') {
      discountAmount = Math.min(appliedCoupon.discountValue, subtotal);
    }
  }

  const effectiveDeliveryFee = appliedCoupon?.code.toUpperCase() === 'FREESHIP' ? 0 : delivery_fee;
  const finalTotal = Math.max(0, subtotal - discountAmount + effectiveDeliveryFee);

  // Validate coupon handler
  const handleApplyCoupon = async (codeToApply = couponCode) => {
    if (!codeToApply.trim()) {
      toast.error('Vui lòng nhập mã giảm giá');
      return;
    }

    try {
      setCouponLoading(true);
      const res = await axios.post(`${backendUrl}/api/coupon/validate`, {
        code: codeToApply.trim(),
        orderAmount: subtotal
      });

      if (res.data?.success) {
        setAppliedCoupon(res.data.coupon);
        setCouponCode(res.data.coupon.code);
        toast.success(res.data.message || 'Áp dụng mã giảm giá thành công!');
      } else {
        toast.error(res.data?.message || 'Mã giảm giá không hợp lệ');
      }
    } catch (err) {
      console.log('Coupon error:', err);
      toast.error('Lỗi khi kiểm tra mã giảm giá');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.info('Đã hủy áp dụng mã giảm giá');
  };

  // Submit Order
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (orderItems.length === 0) {
      toast.error('Không có sản phẩm nào để đặt hàng');
      return;
    }

    // Ghi nhớ thông tin khách hàng cho các lần mua sau
    saveLastCheckoutInfo(formData);

    try {
      const orderPayload = {
        userId: user?._id,
        items: orderItems,
        address: formData,
        amount: finalTotal,
        voucherCode: appliedCoupon?.code || '',
        discountAmount: discountAmount,
        paymentMethod: method === 'cod' ? 'COD' : 'Stripe'
      };

      if (method === 'vietqr') {
        const qrRes = await axios.post(`${backendUrl}/api/payment/create-qr-order`, {
          ...orderPayload,
          paymentMethod: 'Chuyển khoản VietQR'
        }, {
          headers: { token }
        });

        if (qrRes.data.success && qrRes.data.orderId) {
          toast.success('Đã tạo đơn hàng! Đang mở cổng thanh toán VietQR...');
          
          if (buyNowItem) {
            setBuyNowItem(null);
          } else {
            const newCartItems = { ...cartItems };
            for (const key of selectedItems) {
              const [id, size] = key.split('-');
              if (newCartItems[id] && newCartItems[id][size]) {
                delete newCartItems[id][size];
              }
            }
            setCartItems(newCartItems);
          }
          navigate(`/payment/${qrRes.data.orderId}`);
          return;
        } else {
          toast.error(qrRes.data.message || 'Có lỗi khi khởi tạo thanh toán VietQR');
          return;
        }
      } else if (method === 'cod') {
        const res = await axios.post(`${backendUrl}/api/order/place`, orderPayload, {
          headers: { token }
        });

        if (res.data.success) {
          toast.success(res.data.message || 'Đặt hàng thành công!');
          
          if (buyNowItem) {
            setBuyNowItem(null);
          } else {
            // clear cart items that were selected
            const newCartItems = { ...cartItems };
            for (const key of selectedItems) {
              const [id, size] = key.split('-');
              if (newCartItems[id] && newCartItems[id][size]) {
                delete newCartItems[id][size];
              }
            }
            setCartItems(newCartItems);
          }
          navigate('/orders');
        } else {
          toast.error(res.data.message || 'Có lỗi xảy ra khi đặt hàng');
        }
      } else if (method === 'stripe') {
        const stripeRes = await axios.post(`${backendUrl}/api/order/stripe`, orderPayload, {
          headers: { token }
        });
        if (stripeRes.data.success && stripeRes.data.url) {
          window.location.href = stripeRes.data.url;
        } else {
          toast.error(stripeRes.data.message || 'Lỗi kết nối cổng thanh toán');
        }
      }
    } catch (err) {
      console.error('Order submission error:', err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng');
    }
  };

  return (
    <PageTransition>
      <div className='min-h-screen bg-slate-50 py-8'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>

          {/* Breadcrumbs & Header */}
          <div className='mb-8'>
            <span className='text-xs text-slate-500'>Trang chủ / Giỏ hàng / Thanh toán</span>
            <h1 className='text-2xl sm:text-3xl font-black text-slate-900 mt-1'>
              Xác Nhận Đơn Hàng & Thanh Toán
            </h1>
          </div>

          <form onSubmit={onSubmitHandler}>
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>

              {/* Left Column: Customer Information & Delivery (7 cols) */}
              <div className='lg:col-span-7 space-y-6'>
                
                {/* Delivery Information Box */}
                <div className='bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4'>
                  <h2 className='text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100'>
                    <span>📍</span> Thông Tin Giao Hàng
                  </h2>

                  {autoFilled && (
                    <div className='p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-800 text-xs font-semibold shadow-2xs'>
                      <SparklesIcon />
                      <span>Hệ thống đã tự động điền thông tin từ lịch sử mua sắm của bạn. Bạn có thể kiểm tra và thay đổi nếu cần.</span>
                    </div>
                  )}

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-xs font-bold text-slate-700 mb-1.5'>Họ và tên người nhận *</label>
                      <input
                        required
                        name='fullName'
                        value={formData.fullName}
                        onChange={onChangeHandler}
                        placeholder='Nguyễn Văn An'
                        className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none'
                      />
                    </div>
                    <div>
                      <label className='block text-xs font-bold text-slate-700 mb-1.5'>Số điện thoại *</label>
                      <input
                        required
                        name='phone'
                        type='tel'
                        value={formData.phone}
                        onChange={onChangeHandler}
                        placeholder='0988 888 888'
                        className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-xs font-bold text-slate-700 mb-1.5'>Email nhận thông báo đơn hàng *</label>
                    <input
                      required
                      name='email'
                      type='email'
                      value={formData.email}
                      onChange={onChangeHandler}
                      placeholder='email@example.com'
                      className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none'
                    />
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-xs font-bold text-slate-700 mb-1.5'>Tỉnh / Thành phố *</label>
                      <select
                        name='city'
                        value={formData.city}
                        onChange={onChangeHandler}
                        className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:border-blue-500 focus:outline-none cursor-pointer'
                      >
                        <option value='Hà Nội'>Hà Nội</option>
                        <option value='Hồ Chí Minh'>TP. Hồ Chí Minh</option>
                        <option value='Đà Nẵng'>Đà Nẵng</option>
                        <option value='Hải Phòng'>Hải Phòng</option>
                        <option value='Cần Thơ'>Cần Thơ</option>
                        <option value='Khác'>Tỉnh / Thành khác</option>
                      </select>
                    </div>
                    <div>
                      <label className='block text-xs font-bold text-slate-700 mb-1.5'>Quận / Huyện *</label>
                      <input
                        required
                        name='district'
                        value={formData.district}
                        onChange={onChangeHandler}
                        placeholder='Q. Đống Đa / Q. 1...'
                        className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-xs font-bold text-slate-700 mb-1.5'>Địa chỉ chi tiết (Số nhà, tên đường, phường/xã) *</label>
                    <input
                      required
                      name='street'
                      value={formData.street}
                      onChange={onChangeHandler}
                      placeholder='123 Thái Hà, P. Trung Liệt'
                      className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none'
                    />
                  </div>

                  <div>
                    <label className='block text-xs font-bold text-slate-700 mb-1.5'>Ghi chú cho shipper (tùy chọn)</label>
                    <textarea
                      name='note'
                      rows='2'
                      value={formData.note}
                      onChange={onChangeHandler}
                      placeholder='Giao giờ hành chính, gọi trước khi đến...'
                      className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none'
                    ></textarea>
                  </div>
                </div>

                {/* Payment Methods Box */}
                <div className='bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4'>
                  <h2 className='text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100'>
                    <span>💳</span> Phương Thức Thanh Toán
                  </h2>

                  <div className='space-y-3'>
                    <label
                      onClick={() => setMethod('vietqr')}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        method === 'vietqr'
                          ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className='flex items-center gap-3'>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'vietqr' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'}`}>
                          {method === 'vietqr' && <div className='w-2 h-2 rounded-full bg-white'></div>}
                        </div>
                        <div>
                          <div className='flex items-center gap-2'>
                            <p className='text-xs sm:text-sm font-bold text-slate-800'>Chuyển khoản Ngân hàng tự động (VietQR 24/7)</p>
                            <span className='px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold'>
                              Tự động 3s
                            </span>
                          </div>
                          <p className='text-[11px] text-slate-500'>Quét mã QR qua ứng dụng ngân hàng hoặc ví (MB, VCB, Momo, ZaloPay...)</p>
                        </div>
                      </div>
                      <div className='flex items-center gap-1.5'>
                        <span className='px-2 py-1 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-black text-[10px] rounded-lg tracking-wider'>
                          VietQR
                        </span>
                      </div>
                    </label>

                    <label
                      onClick={() => setMethod('cod')}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        method === 'cod'
                          ? 'border-blue-600 bg-blue-50/50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className='flex items-center gap-3'>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'cod' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                          {method === 'cod' && <div className='w-2 h-2 rounded-full bg-white'></div>}
                        </div>
                        <div>
                          <p className='text-xs sm:text-sm font-bold text-slate-800'>Thanh toán khi nhận hàng (COD)</p>
                          <p className='text-[11px] text-slate-500'>Được kiểm tra sản phẩm trước khi thanh toán cho shipper</p>
                        </div>
                      </div>
                      <span className='text-2xl'>💵</span>
                    </label>

                    <label
                      onClick={() => setMethod('stripe')}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        method === 'stripe'
                          ? 'border-[#d70018] bg-red-50/50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className='flex items-center gap-3'>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'stripe' ? 'border-[#d70018] bg-[#d70018]' : 'border-slate-300'}`}>
                          {method === 'stripe' && <div className='w-2 h-2 rounded-full bg-white'></div>}
                        </div>
                        <div>
                          <p className='text-xs sm:text-sm font-bold text-slate-800'>Thẻ Tín Dụng / Ghi Nợ Quốc Tế (Stripe)</p>
                          <p className='text-[11px] text-slate-500'>Visa, MasterCard, JCB bảo mật chuẩn quốc tế</p>
                        </div>
                      </div>
                      <span className='text-2xl'>💳</span>
                    </label>
                  </div>
                </div>

              </div>

              {/* Right Column: Order Summary & Coupon (5 cols) */}
              <div className='lg:col-span-5 space-y-6'>
                
                {/* Order Items Review */}
                <div className='bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4'>
                  <h3 className='text-sm font-bold text-slate-800 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center justify-between'>
                    <span>Sản phẩm ({orderItems.length})</span>
                    <button type='button' onClick={() => navigate('/cart')} className='text-blue-600 text-xs font-semibold lowercase hover:underline'>
                      Sửa giỏ hàng
                    </button>
                  </h3>

                  <div className='space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-slate-100'>
                    {orderItems.map((item, idx) => (
                      <div key={idx} className='flex items-center gap-3 pt-2.5 first:pt-0'>
                        <div className='w-12 h-12 rounded-xl bg-slate-50 p-1 shrink-0 border border-slate-100 flex items-center justify-center'>
                          <img
                            src={Array.isArray(item.image) ? item.image[0] : item.image}
                            alt={item.name}
                            className='max-w-full max-h-full object-contain'
                          />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='text-xs font-bold text-slate-800 truncate'>{item.name}</p>
                          <p className='text-[10px] text-slate-500'>
                            Bản: {item.size} • SL: {item.quantity}
                          </p>
                        </div>
                        <span className='text-xs font-bold text-slate-800 shrink-0'>
                          {Number(item.price * item.quantity).toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coupon Input Box */}
                <div className='bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3'>
                  <h3 className='text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5'>
                    <span>🎟️</span> Mã Giảm Giá / Voucher
                  </h3>

                  {appliedCoupon ? (
                    <div className='p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between'>
                      <div>
                        <span className='text-xs font-black text-emerald-800'>{appliedCoupon.code}</span>
                        <p className='text-[11px] text-emerald-700'>{appliedCoupon.description}</p>
                        <p className='text-xs font-bold text-emerald-600 mt-1'>
                          Đã giảm: -{discountAmount.toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                      <button
                        type='button'
                        onClick={handleRemoveCoupon}
                        className='text-xs text-rose-600 font-bold hover:underline'
                      >
                        Hủy mã
                      </button>
                    </div>
                  ) : (
                    <div className='flex gap-2'>
                      <input
                        type='text'
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder='Nhập mã: MINHTUAN10, FREESHIP...'
                        className='flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs uppercase font-mono tracking-wider focus:border-blue-500 focus:outline-none'
                      />
                      <button
                        type='button'
                        onClick={() => handleApplyCoupon()}
                        disabled={couponLoading}
                        className='px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition-colors disabled:opacity-50'
                      >
                        {couponLoading ? '...' : 'Áp dụng'}
                      </button>
                    </div>
                  )}

                  {/* Coupon Suggestions */}
                  {availableCoupons.length > 0 && !appliedCoupon && (
                    <div className='pt-2 space-y-1.5'>
                      <span className='text-[11px] font-semibold text-slate-400'>Mã ưu đãi có sẵn:</span>
                      <div className='flex flex-wrap gap-1.5'>
                        {availableCoupons.slice(0, 3).map((c) => (
                          <button
                            key={c.code}
                            type='button'
                            onClick={() => handleApplyCoupon(c.code)}
                            className='px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-[#d70018] border border-slate-200 text-[10px] font-bold text-slate-700 transition-colors'
                          >
                            + {c.code} ({c.discountValue}{c.discountType === 'percentage' ? '%' : 'đ'})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Final Price Breakdown & Submit */}
                <div className='bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4'>
                  <div className='space-y-2 text-xs text-slate-600'>
                    <div className='flex justify-between'>
                      <span>Tạm tính tiền hàng:</span>
                      <span className='font-bold text-slate-800'>{subtotal.toLocaleString('vi-VN')}{currency}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className='flex justify-between text-emerald-600 font-bold'>
                        <span>Giảm giá ({appliedCoupon?.code}):</span>
                        <span>-{discountAmount.toLocaleString('vi-VN')}{currency}</span>
                      </div>
                    )}

                    <div className='flex justify-between'>
                      <span>Phí giao hàng toàn quốc:</span>
                      <span className={effectiveDeliveryFee === 0 ? 'text-emerald-600 font-bold' : 'font-bold text-slate-800'}>
                        {effectiveDeliveryFee === 0 ? 'Miễn phí' : `${delivery_fee.toLocaleString('vi-VN')}${currency}`}
                      </span>
                    </div>

                    <div className='pt-3 border-t border-slate-100 flex items-baseline justify-between text-sm sm:text-base font-black text-slate-900'>
                      <span>Tổng thanh toán:</span>
                      <span className='text-xl sm:text-2xl text-[#d70018] font-black'>
                        {finalTotal.toLocaleString('vi-VN')}{currency}
                      </span>
                    </div>
                  </div>

                  <button
                    type='submit'
                    disabled={orderItems.length === 0}
                    className='w-full py-4 px-6 rounded-2xl bg-[#d70018] hover:bg-[#ba0014] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-red-600/30 active:scale-[0.98] transition-all disabled:opacity-50'
                  >
                    XÁC NHẬN ĐẶT HÀNG NGAY
                  </button>

                  <p className='text-[10px] text-slate-400 text-center'>
                    Bằng việc bấm Đặt hàng, bạn đồng ý với Chính sách mua hàng của Minh Tuấn Shop
                  </p>
                </div>

              </div>

            </div>
          </form>

        </div>
      </div>
    </PageTransition>
  );
};

export default PlaceOrder;
