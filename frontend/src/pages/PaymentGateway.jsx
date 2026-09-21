import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import PageTransition from '../components/PageTransition';

const PaymentGateway = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { backendUrl, currency } = useContext(ShopContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 phút đếm ngược
  const pollingRef = useRef(null);
  const timerRef = useRef(null);

  // Fetch initial order details
  const fetchOrderData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/payment/order-status/${orderId}`);
      if (res.data?.success) {
        setOrder(res.data);
        if (res.data.payment) {
          setIsPaid(true);
        }
      } else {
        toast.error(res.data?.message || 'Không tìm thấy thông tin đơn hàng');
      }
    } catch (err) {
      console.error('Lỗi khi tải thông tin đơn hàng:', err);
      toast.error('Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId && backendUrl) {
      fetchOrderData();
    }
  }, [orderId, backendUrl]);

  // Polling check order payment status every 3s
  useEffect(() => {
    if (isPaid) return;

    pollingRef.current = setInterval(async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/payment/order-status/${orderId}`);
        if (res.data?.success && res.data.payment) {
          setIsPaid(true);
          clearInterval(pollingRef.current);
          clearInterval(timerRef.current);
          toast.success('🎉 Thanh toán tự động thành công! Đơn hàng đã được xác nhận.');
          setTimeout(() => {
            navigate('/orders');
          }, 3500);
        }
      } catch (err) {
        console.warn('Lỗi polling:', err);
      }
    }, 3000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [orderId, backendUrl, isPaid, navigate]);

  // Countdown timer (15 minutes)
  useEffect(() => {
    if (isPaid) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          clearInterval(pollingRef.current);
          toast.warn('Phiên thanh toán đã hết hạn. Vui lòng thử lại.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaid]);

  // Copy to clipboard with feedback
  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.info(`Đã sao chép ${fieldName}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle Customer Manual Transfer Confirmation (Chờ duyệt bằng tay như COD)
  const [confirming, setConfirming] = useState(false);
  const handleConfirmCustomerTransfer = async () => {
    try {
      setConfirming(true);
      const res = await axios.post(`${backendUrl}/api/payment/confirm-transfer`, {
        orderId: orderId
      });
      if (res.data?.success) {
        toast.success('🎉 ' + res.data.message);
        if (pollingRef.current) clearInterval(pollingRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
        setTimeout(() => {
          navigate('/orders');
        }, 1500);
      } else {
        toast.error(res.data?.message || 'Không thể xác nhận chuyển khoản');
      }
    } catch (err) {
      console.error('Lỗi xác nhận chuyển khoản:', err);
      toast.error('Lỗi khi gửi xác nhận chuyển khoản');
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-[70vh] flex flex-col items-center justify-center'>
        <div className='w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin'></div>
        <p className='mt-4 text-sm font-bold text-slate-600'>Đang khởi tạo cổng thanh toán VietQR...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className='min-h-[60vh] flex flex-col items-center justify-center p-6 text-center'>
        <div className='w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-2xl font-bold mb-4'>
          ✕
        </div>
        <h2 className='text-xl font-bold text-slate-800'>Không tìm thấy đơn hàng</h2>
        <p className='text-sm text-slate-500 mt-2'>Mã đơn hàng có thể không hợp lệ hoặc đã bị hủy.</p>
        <button
          onClick={() => navigate('/orders')}
          className='mt-6 px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors'
        >
          Xem danh sách đơn hàng
        </button>
      </div>
    );
  }

  const bank = order.bankInfo || {
    bankName: 'MBBank',
    bankBin: '970422',
    accountNumber: '0907253168',
    accountName: 'MINH TUAN SHOP'
  };

  return (
    <PageTransition>
      <div className='min-h-screen bg-slate-50 py-8 sm:py-12'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6'>

          {/* Top Status Header */}
          <div className='bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 mb-6'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100'>
              <div>
                <div className='flex items-center gap-2 mb-1'>
                  <span className='px-2.5 py-1 rounded-lg bg-red-50 text-[#d70018] text-xs font-black tracking-wider uppercase'>
                    MINH TUẤN SHOP PAY
                  </span>
                  <span className='text-xs font-bold text-slate-400'>• VietQR 24/7</span>
                </div>
                <h1 className='text-xl sm:text-2xl font-black text-slate-900'>
                  Thanh Toán Đơn Hàng #{order.orderCode || orderId.slice(-6).toUpperCase()}
                </h1>
              </div>

              {/* Status Badge & Countdown */}
              <div className='flex items-center gap-3'>
                {isPaid ? (
                  <div className='px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-2'>
                    <div className='w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse'></div>
                    <span className='text-xs font-bold'>Đã thanh toán thành công</span>
                  </div>
                ) : (
                  <div className='flex items-center gap-3 bg-amber-50/80 border border-amber-200/80 px-4 py-2 rounded-2xl'>
                    <div className='w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping'></div>
                    <div>
                      <p className='text-[10px] text-amber-700 font-bold uppercase tracking-wider'>Thời gian còn lại</p>
                      <p className='text-base font-black font-mono text-amber-900'>{formatTime(timeLeft)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Success Banner if Paid */}
            {isPaid && (
              <div className='mt-6 p-6 rounded-2xl bg-emerald-500 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-emerald-500/20'>
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl'>
                    ✓
                  </div>
                  <div>
                    <h3 className='text-base font-black'>Thanh toán đã được tự động xác nhận!</h3>
                    <p className='text-xs text-emerald-100 mt-0.5'>
                      Hệ thống đã nhận được số tiền {Number(order.amount).toLocaleString('vi-VN')}đ. Đang chuyển về trang đơn hàng...
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/orders')}
                  className='px-5 py-2.5 bg-white text-emerald-700 font-bold text-xs rounded-xl shadow hover:bg-emerald-50 transition-colors shrink-0'
                >
                  Xem đơn hàng ngay
                </button>
              </div>
            )}
          </div>

          {/* Main Payment Section */}
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'>

            {/* Left: VietQR Code Card (5 cols) */}
            <div className='lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center'>
              <div className='w-full flex items-center justify-between mb-4 pb-3 border-b border-slate-100'>
                <span className='text-xs font-black text-slate-800 tracking-wider'>MÃ VIETQR CHUYỂN KHOẢN</span>
                <span className='px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold'>
                  NAPAS 247
                </span>
              </div>

              {/* Dynamic QR Code */}
              <div className='relative p-3 bg-white rounded-2xl border-2 border-emerald-500/30 shadow-md group hover:border-emerald-500 transition-colors'>
                {order.qrUrl ? (
                  <img
                    src={order.qrUrl}
                    alt='VietQR Code'
                    className='w-64 h-64 sm:w-72 sm:h-72 object-contain rounded-xl'
                  />
                ) : (
                  <div className='w-64 h-64 flex items-center justify-center bg-slate-50 text-slate-400 text-xs'>
                    Đang tạo mã QR...
                  </div>
                )}

                {/* Scan Overlay Icon */}
                <div className='absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold rounded-full pointer-events-none'>
                  Quét bằng App Ngân Hàng
                </div>
              </div>

              {/* Dynamic instruction */}
              <div className='mt-5 w-full bg-slate-50 p-4 rounded-2xl text-left border border-slate-100 space-y-2'>
                <div className='flex items-start gap-2.5'>
                  <span className='w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5'>1</span>
                  <p className='text-xs text-slate-600'>Mở ứng dụng <strong>Ngân hàng</strong> bất kỳ hoặc ví (MB, Vietcombank, Momo...)</p>
                </div>
                <div className='flex items-start gap-2.5'>
                  <span className='w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5'>2</span>
                  <p className='text-xs text-slate-600'>Chọn tính năng <strong>Quét mã QR</strong> và quét ảnh trên</p>
                </div>
                <div className='flex items-start gap-2.5'>
                  <span className='w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5'>3</span>
                  <p className='text-xs text-slate-600'>Kiểm tra số tiền và xác nhận chuyển khoản</p>
                </div>
              </div>

              {/* Polling pulse indicator */}
              <div className='mt-4 flex items-center gap-2 text-xs text-slate-500'>
                <span className='relative flex h-2.5 w-2.5'>
                  <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75'></span>
                  <span className='relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500'></span>
                </span>
                <span>Hệ thống tự động phát hiện thanh toán trong 3s</span>
              </div>
            </div>

            {/* Right: Manual Transfer Information & Simulation (7 cols) */}
            <div className='lg:col-span-7 space-y-6'>

              {/* Bank Details Card */}
              <div className='bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-4'>
                <div className='flex items-center justify-between pb-3 border-b border-slate-100'>
                  <h3 className='text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2'>
                    <span>🏦</span> Thông Tin Chuyển Khoản Thủ Công
                  </h3>
                  <span className='text-[11px] text-slate-500'>Nếu bạn không quét được mã</span>
                </div>

                <div className='space-y-3'>
                  {/* Ngân hàng */}
                  <div className='flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100'>
                    <div>
                      <span className='text-[11px] text-slate-400 font-bold uppercase tracking-wider'>Ngân hàng thụ hưởng</span>
                      <p className='text-sm font-bold text-slate-800'>{bank.bankName} (Quân Đội)</p>
                    </div>
                    <button
                      type='button'
                      onClick={() => handleCopy(bank.bankName, 'Ngân hàng')}
                      className='px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-sm'
                    >
                      {copiedField === 'Ngân hàng' ? '✓ Đã chép' : 'Sao chép'}
                    </button>
                  </div>

                  {/* Số tài khoản */}
                  <div className='flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100'>
                    <div>
                      <span className='text-[11px] text-slate-400 font-bold uppercase tracking-wider'>Số tài khoản nhận</span>
                      <p className='text-base font-black font-mono text-blue-600'>{bank.accountNumber}</p>
                    </div>
                    <button
                      type='button'
                      onClick={() => handleCopy(bank.accountNumber, 'Số tài khoản')}
                      className='px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-sm'
                    >
                      {copiedField === 'Số tài khoản' ? '✓ Đã chép' : 'Sao chép'}
                    </button>
                  </div>

                  {/* Chủ tài khoản */}
                  <div className='flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100'>
                    <div>
                      <span className='text-[11px] text-slate-400 font-bold uppercase tracking-wider'>Chủ tài khoản</span>
                      <p className='text-sm font-bold text-slate-800 uppercase'>{bank.accountName}</p>
                    </div>
                    <button
                      type='button'
                      onClick={() => handleCopy(bank.accountName, 'Chủ tài khoản')}
                      className='px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-sm'
                    >
                      {copiedField === 'Chủ tài khoản' ? '✓ Đã chép' : 'Sao chép'}
                    </button>
                  </div>

                  {/* Số tiền */}
                  <div className='flex items-center justify-between p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100'>
                    <div>
                      <span className='text-[11px] text-rose-500 font-bold uppercase tracking-wider'>Số tiền chính xác</span>
                      <p className='text-lg font-black font-mono text-rose-600'>
                        {Number(order.amount).toLocaleString('vi-VN')} đ
                      </p>
                    </div>
                    <button
                      type='button'
                      onClick={() => handleCopy(order.amount.toString(), 'Số tiền')}
                      className='px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors shadow-sm'
                    >
                      {copiedField === 'Số tiền' ? '✓ Đã chép' : 'Sao chép'}
                    </button>
                  </div>

                  {/* Nội dung chuyển khoản */}
                  <div className='flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200'>
                    <div className='min-w-0 pr-2'>
                      <span className='text-[11px] text-amber-700 font-bold uppercase tracking-wider'>Nội dung chuyển khoản (BẮT BUỘC)</span>
                      <p className='text-base font-black font-mono text-slate-900 truncate'>{order.transferContent}</p>
                    </div>
                    <button
                      type='button'
                      onClick={() => handleCopy(order.transferContent, 'Nội dung chuyển khoản')}
                      className='px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors shadow-sm shrink-0'
                    >
                      {copiedField === 'Nội dung chuyển khoản' ? '✓ Đã chép' : 'Sao chép'}
                    </button>
                  </div>
                </div>

                {/* Notice banner */}
                <div className='p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-slate-700 flex items-start gap-2.5'>
                  <span className='text-base shrink-0'>ℹ️</span>
                  <p>
                    Mỗi đơn hàng có <strong>nội dung thanh toán riêng biệt</strong> ({order.transferContent}). Sau khi bạn chuyển khoản thành công qua ứng dụng ngân hàng, vui lòng ấn nút <strong>"Xác nhận đã chuyển khoản"</strong> bên dưới. Đơn hàng sẽ vào trạng thái <strong>chờ duyệt</strong> (như hình thức COD) để nhân viên đối soát và duyệt đơn cho bạn!
                  </p>
                </div>
              </div>

              {/* Customer Transfer Confirmation Card (Chờ duyệt bằng tay như COD) */}
              <div className='bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 space-y-4'>
                <div className='flex items-center gap-2'>
                  <span className='text-xl'>✅</span>
                  <div>
                    <h4 className='text-sm sm:text-base font-black text-slate-900 uppercase tracking-tight'>
                      Xác Nhận Sau Khi Chuyển Khoản
                    </h4>
                    <p className='text-xs text-slate-500'>Nhấn vào nút dưới đây sau khi bạn đã hoàn tất chuyển tiền trong App Ngân Hàng</p>
                  </div>
                </div>

                <button
                  type='button'
                  onClick={handleConfirmCustomerTransfer}
                  disabled={confirming || isPaid}
                  className='w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer'
                >
                  {confirming ? (
                    <>
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                      Đang ghi nhận xác nhận...
                    </>
                  ) : (
                    <>
                      <span>✓</span>
                      <span>TÔI ĐÃ CHUYỂN TIỀN - XÁC NHẬN ĐƠN HÀNG (CHỜ DUYỆT)</span>
                    </>
                  )}
                </button>
                <p className='text-[11px] text-center text-slate-400'>
                  * Đơn hàng sẽ chuyển sang trạng thái "Đã đặt hàng - Chờ duyệt" và gửi đến bộ phận kho để chuẩn bị đóng gói.
                </p>
              </div>

              {/* Bottom Actions */}
              <div className='flex items-center justify-between text-xs text-slate-500 pt-2'>
                <button
                  type='button'
                  onClick={() => navigate('/orders')}
                  className='text-slate-600 hover:text-slate-900 font-bold underline'
                >
                  ← Quay lại danh sách đơn hàng
                </button>
                <button
                  type='button'
                  onClick={fetchOrderData}
                  className='text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1'
                >
                  <span>🔄</span> Kiểm tra lại trạng thái
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default PaymentGateway;
