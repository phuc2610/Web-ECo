import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, selectedItems, setSelectedItems } =
    useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

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
      
      // Auto-select all items initially if cart has items
      if (tempData.length > 0) {
        setSelectedItems(tempData.map(item => `${item._id}-${item.size}`));
      } else {
        setSelectedItems([]);
      }
    }
  }, [cartItems, setSelectedItems, products.length]);

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
    return cartData.filter(item => 
      selectedItems.includes(`${item._id}-${item.size}`)
    );
  };

  // If cart is empty, show message
  if (cartData.length === 0) {
    return (
      <div className="border-t pt-14 pb-1 bg-white">
        <div className="text-2xl mb-3">
          <Title text1={"Giỏ hàng"} text2={"của bạn"} />
        </div>
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-4">Giỏ hàng của bạn đang trống</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t pt-14 pb-1 bg-white">
      <div className="text-2xl mb-3">
        <Title text1={"Giỏ hàng"} text2={"của bạn"} />
      </div>

      {/* Select All Checkbox */}
      {cartData.length > 0 && (
        <div className="flex items-center gap-3 py-4 border-b">
          <input
            type="checkbox"
            checked={selectedItems.length === cartData.length}
            onChange={handleSelectAll}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label className="text-sm font-medium text-gray-700">
            Chọn tất cả ({selectedItems.length}/{cartData.length})
          </label>
        </div>
      )}

      <div>
        {cartData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id
          );
          const isSelected = selectedItems.includes(`${item._id}-${item.size}`);

          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[auto_4fr_0.5fr_0.5fr] sm:grid-cols-[auto_4fr_2fr_0.5fr] items-center gap-4"
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleItemSelect(item._id, item.size)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              
              <div className="flex items-start gap-6">
                <img
                  className="w-16 sm:w-20"
                  src={productData?.image[0]}
                  alt=""
                />
                <div>
                  <p className="text-xs sm:text-lg font-medium">
                    {productData?.name}
                  </p>
                  <div className="flex items-center gap-5 mt-2">
                    <p className="text-[#e8002d]">
                      {productData?.price.toLocaleString("vi-VN")}
                      {currency}
                    </p>
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50 ">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>
              <input
                onChange={(e) =>
                  e.target.value === "" || e.target.value === "0"
                    ? null
                    : updateQuantity(
                        item._id,
                        item.size,
                        Number(e.target.value)
                      )
                }
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                type="number"
                min={1}
                defaultValue={item.quantity}
              />
              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                src={assets.bin_icon}
                alt=""
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-end my-20 mr-8">
        <div className="w-full sm:w-[450px]">
          <CartTotal selectedItems={getSelectedItemsData()} />
          <div className="w-full text-end">
            <button
              onClick={() => {
                if (selectedItems.length > 0) {
                  // Store selected items in context for checkout
                  navigate("/place-order");
                }
              }}
              disabled={selectedItems.length === 0}
              className={`text-sm my-8 px-8 py-3 ${
                selectedItems.length > 0
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Thanh toán ({selectedItems.length} sản phẩm)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
