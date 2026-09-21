import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { getRecentlyViewed } from "../utils/analyticsTracker";

const HistoryIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const RecentlyViewed = () => {
  const { currency } = useContext(ShopContext);
  const [viewedList, setViewedList] = useState([]);

  useEffect(() => {
    const list = getRecentlyViewed();
    setViewedList(list);
  }, []);

  const handleClear = () => {
    localStorage.removeItem("mt_recently_viewed");
    setViewedList([]);
  };

  if (!viewedList || viewedList.length === 0) return null;

  return (
    <div className="my-12 p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
            <HistoryIcon />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Sản phẩm bạn vừa xem gần đây
            </h3>
            <p className="text-xs text-slate-500">
              Dễ dàng quay lại so sánh và tiếp tục đặt mua
            </p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-600 transition-colors px-2.5 py-1 rounded-md hover:bg-red-50 cursor-pointer"
          title="Xóa lịch sử xem"
        >
          <TrashIcon />
          <span className="hidden sm:inline">Xóa lịch sử</span>
        </button>
      </div>

      {/* Danh sách cuộn ngang */}
      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-slate-200">
        {viewedList.slice(0, 10).map((item) => {
          const imgUrl =
            Array.isArray(item.image) && item.image.length > 0
              ? item.image[0]
              : item.image || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600";
          const finalPrice = item.sellingPrice || item.price || 0;

          return (
            <Link
              key={item._id}
              to={`/product/${item._id}`}
              className="group min-w-[170px] max-w-[190px] p-3 rounded-xl border border-slate-100 hover:border-red-300 hover:shadow-md transition-all duration-200 bg-white flex flex-col justify-between"
            >
              <div className="w-full aspect-square bg-slate-50 rounded-lg overflow-hidden mb-2.5 flex items-center justify-center p-2">
                <img
                  src={imgUrl}
                  alt={item.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div>
                <p className="text-[11px] font-semibold text-red-600 uppercase mb-0.5">
                  {item.category || "Công nghệ"}
                </p>
                <h4 className="text-xs font-bold text-slate-800 line-clamp-2 mb-2 group-hover:text-red-600 transition-colors">
                  {item.name}
                </h4>
                <p className="text-sm font-extrabold text-[#d70018]">
                  {Number(finalPrice).toLocaleString("vi-VN")}
                  {currency}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RecentlyViewed;
