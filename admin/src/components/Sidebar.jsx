import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen border-r-2 border-r-gray-300">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l" to="/">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold">
             <img src={assets.dashboard_icon} alt="" />
          </div>
          <p className="hidden md:block">Dashboard</p>
        </NavLink>

        <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l" to="/add">
          <img className="w-6 h-6 icon" src={assets.add_icon} alt="" />
          <p className="hidden md:block">Thêm sản phẩm</p>
        </NavLink>

        <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l" to="/list">
          <img className="w-6 h-6 icon" src={assets.order_icon} alt="" />
          <p className="hidden md:block">Danh sách sản phẩm</p>
        </NavLink>

        <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l" to="/orders">
          <img className="w-6 h-6 " src={assets.list_order_icon} alt="" />
          <p className="hidden md:block">Danh sách đơn hàng</p>
        </NavLink>

        <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l" to="/users">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold">
            <img src={assets.user_icon} alt="" />
          </div>
          <p className="hidden md:block">Quản lý tài khoản khách hàng</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/statistics"
        >
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold">
            <img src={assets.thongke_icon} alt="" />
          </div>
          <p className="hidden md:block">Thống kê & Báo cáo</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/customer-support"
        >
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="hidden md:block">Tư vấn khách hàng</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
