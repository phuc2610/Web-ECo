import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import CartTotal from "../components/CartTotal";
import PageTransition from "../components/PageTransition";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, selectedItems, setSelectedItems, coupon, setCoupon, discount } =
    useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  const [promoCodeInput, setPromoCodeInput] = useState('');

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);

      // Auto-select all items initially if cart has items and none selected yet
      if (tempData.length > 0 && selectedItems.length === 0) {
        setSelectedItems(tempData.map(item => `${item._id}-${item.size}`));
      }
    }
  }, [cartItems, products]);

  const handleItemSelect = (itemId, size) => {
    const itemKey = `${itemId}-${size}`;
    setSelectedItems(prev => {
      if (prev.includes(itemKey)) {
        return prev.filter(key => key !== itemKey);
      } else {
        return [...prev, itemKey];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartData.map(item => `${item._id}-${item.size}`));
    }
  };

  const getSelectedItemsData = () => {
    return cartData
      .filter(item => selectedItems.includes(`${item._id}-${item.size}`))
      .map(item => {
        const prod = products.find(p => p._id === item._id);
        return {
          ...item,
          name: prod?.name || '',
          price: prod?.price || 0,
          image: prod?.image || []
        };
      });
  };

  // If cart is empty
  if (cartData.length === 0) {
    return (
      <PageTransition>
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 bg-[#f4f6f8]">
          <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-100 max-w-md w-full text-center space-y-5">
            <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
              🛒
            </div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Giỏ hàng của bạn đang trống</h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá ngay hàng ngàn sản phẩm công nghệ chính hãng giá tốt tại Minh Tuấn Shop!
            </p>
            <Link
              to="/collection"
              className="inline-block w-full py-3.5 px-6 rounded-2xl bg-[#d70018] hover:bg-[#ba0014] text-white font-black text-sm shadow-md transition-all uppercase tracking-wide"
            >
              Khám phá sản phẩm ngay &rarr;
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const selectedItemsData = getSelectedItemsData();

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#f4f6f8] py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

          {/* 3-Step Progress Bar (CellphoneS Retail Standard) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
            <div className="max-w-xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black text-[#d70018]">
                <span className="w-6 h-6 rounded-full bg-[#d70018] text-white flex items-center justify-center text-xs">1</span>
                <span>GIỎ HÀNG</span>
              </div>
              <div className="flex-1 h-0.5 mx-3 bg-slate-200"></div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">2</span>
                <span>ĐẶT HÀNG</span>
              </div>
              <div className="flex-1 h-0.5 mx-3 bg-slate-200"></div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">3</span>
                <span>HOÀN TẤT</span>
              </div>
            </div>
          </div>

          {/* Smember Member Perk Alert */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">👑</span>
              <div>
                <p className="text-xs font-bold text-slate-900">Đặc quyền Hội viên Smember</p>
                <p className="text-[11px] text-slate-500">Tích lũy 1 - 5% cho mỗi đơn hàng & Miễn phí vận chuyển hỏa tốc 2 giờ.</p>
              </div>
            </div>
            <Link to="/login" className="text-xs text-[#d70018] font-black hover:underline shrink-0">
              Đăng nhập &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Items Column (8 cols) */}
            <div className="lg:col-span-8 space-y-4">

              {/* Select All Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer text-xs sm:text-sm font-bold text-slate-700 select-none">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === cartData.length && cartData.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-[#d70018] rounded focus:ring-red-500 border-slate-300"
                  />
                  <span>Chọn tất cả ({selectedItems.length}/{cartData.length} sản phẩm)</span>
                </label>

                {selectedItems.length > 0 && (
                  <button
                    onClick={() => setSelectedItems([])}
                    className="text-xs text-red-600 hover:text-red-700 font-bold"
                  >
                    Bỏ chọn
                  </button>
                )}
              </div>

              {/* Cart Items List */}
              <div className="space-y-3">
                {cartData.map((item, index) => {
                  const productData = products.find(p => p._id === item._id);
                  const isSelected = selectedItems.includes(`${item._id}-${item.size}`);
                  const itemImg = Array.isArray(productData?.image) ? productData.image[0] : (productData?.image || '');

                  return (
                    <div
                      key={index}
                      className={`bg-white p-4 sm:p-5 rounded-2xl border transition-all duration-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        isSelected ? 'border-red-300 bg-red-50/15' : 'border-slate-100'
                      }`}
                    >
                      {/* Left: Checkbox + Thumbnail + Details */}
                      <div className="flex items-center gap-4 flex-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleItemSelect(item._id, item.size)}
                          className="w-4 h-4 text-[#d70018] rounded focus:ring-red-500 border-slate-300 shrink-0 cursor-pointer"
                        />

                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-50 border border-slate-100 p-2 shrink-0 flex items-center justify-center">
                          <img
                            src={itemImg}
                            alt={productData?.name || 'Sản phẩm'}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>

                        <div className="space-y-1 min-w-0">
                          <Link
                            to={`/product/${item._id}`}
                            className="text-xs sm:text-sm font-bold text-slate-800 hover:text-[#d70018] transition-colors line-clamp-2"
                          >
                            {productData?.name}
                          </Link>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-md border border-slate-200">
                              Phiên bản: {item.size}
                            </span>
                            <span className="text-xs font-black text-[#d70018] sm:hidden">
                              {Number(productData?.price || 0).toLocaleString('vi-VN')} {currency}
                            </span>
                          </div>
                          <p className="text-[10px] text-emerald-600 font-medium">
                            ✓ Bảo hành 12-24 tháng chính hãng • 1 đổi 1 30 ngày
                          </p>
                        </div>
                      </div>

                      {/* Right: Price + Quantity Stepper + Delete */}
                      <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        {/* Desktop Price */}
                        <div className="hidden sm:block text-right">
                          <span className="text-sm font-black text-[#d70018]">
                            {Number(productData?.price || 0).toLocaleString('vi-VN')} {currency}
                          </span>
                        </div>

                        {/* Stepper */}
                        <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-2xs overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                            className="px-3 py-1.5 text-slate-500 hover:bg-slate-100 font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-xs font-black text-slate-800 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                            className="px-3 py-1.5 text-slate-500 hover:bg-slate-100 font-bold text-xs"
                          >
                            +
                          </button>
                        </div>

                        {/* Total per Item on Desktop */}
                        <div className="hidden md:block text-right min-w-[5.5rem]">
                          <span className="text-xs font-black text-slate-800">
                            {Number((productData?.price || 0) * item.quantity).toLocaleString('vi-VN')} {currency}
                          </span>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => updateQuantity(item._id, item.size, 0)}
                          className="p-1.5 text-slate-400 hover:text-[#d70018] rounded-lg hover:bg-red-50 transition-colors"
                          title="Xóa sản phẩm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Continue Shopping Link */}
              <div className="pt-2">
                <Link
                  to="/collection"
                  className="inline-flex items-center gap-1.5 text-xs text-[#d70018] font-bold hover:underline"
                >
                  <span>&larr;</span>
                  <span>Chọn thêm sản phẩm công nghệ khác</span>
                </Link>
              </div>

            </div>

            {/* Right Summary Column (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5 sticky top-24">
                <h3 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100 uppercase tracking-tight">
                  Tóm tắt đơn hàng
                </h3>

                <CartTotal selectedItems={selectedItemsData} />

                {/* Checkout button */}
                <button
                  onClick={() => {
                    if (selectedItems.length > 0) {
                      navigate('/place-order');
                    }
                  }}
                  disabled={selectedItems.length === 0}
                  className={`w-full py-4 px-6 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all ${
                    selectedItems.length > 0
                      ? 'bg-[#d70018] hover:bg-[#ba0014] text-white shadow-red-600/30 active:scale-[0.98]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {selectedItems.length > 0
                    ? `TIẾN HÀNH ĐẶT HÀNG (${selectedItems.length})`
                    : 'VUI LÒNG CHỌN SẢN PHẨM'}
                </button>

                <div className="text-[11px] text-slate-400 text-center space-y-1 pt-2 border-t border-slate-100">
                  <p className="flex items-center justify-center gap-1">
                    <span>🔒</span>
                    <span>Thanh toán bảo mật chuẩn 256-bit SSL</span>
                  </p>
                  <p>Hỗ trợ đổi trả 1 đổi 1 trong 30 ngày nếu có lỗi NSX</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default Cart;
