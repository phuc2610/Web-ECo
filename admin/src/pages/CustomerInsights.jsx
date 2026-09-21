import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const UserCheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const CustomerInsights = ({ token }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/analytics/customer-insights`, {
        headers: { token },
      });
      if (res.data.success) {
        setData(res.data);
      } else {
        toast.error(res.data.message || "Không thể tải dữ liệu phân tích");
      }
    } catch (error) {
      console.error("Lỗi fetchInsights:", error);
      toast.error("Lỗi khi kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchInsights();
    }
  }, [token]);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="font-medium text-sm">Đang tổng hợp dữ liệu hành vi khách hàng...</p>
      </div>
    );
  }

  const { summary = {}, topViewedProducts = [], topKeywords = [], customerActivities = [] } = data || {};

  // Lọc danh sách khách hàng
  const filteredActivities = customerActivities.filter((act) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      (act.customerName && act.customerName.toLowerCase().includes(term)) ||
      (act.customerEmail && act.customerEmail.toLowerCase().includes(term)) ||
      (act.customerPhone && act.customerPhone.includes(searchTerm)) ||
      (act.ipAddress && act.ipAddress.toLowerCase().includes(term)) ||
      (act.sessionId && act.sessionId.toLowerCase().includes(term));

    if (filterType === "registered") return matchSearch && act.isRegistered;
    if (filterType === "guest") return matchSearch && !act.isRegistered;
    return matchSearch;
  });

  // Tìm sản phẩm có lượt xem cao nhất để tính % thanh bar
  const maxProductViews = topViewedProducts.length > 0 ? Math.max(...topViewedProducts.map((p) => p.views || 1)) : 1;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-red-100 text-red-700 font-bold text-xs rounded-md uppercase">
              Smart Analytics
            </span>
            <span className="text-xs text-gray-400">• Dữ liệu trực tiếp thời gian thực</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mt-1">
            Phân Tích Hành Vi Khách Hàng & Nhu Cầu
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Xem sản phẩm nào được khách quan tâm nhiều nhất, từ khóa tìm kiếm và thông tin chi tiết từng khách.
          </p>
        </div>

        <button
          onClick={fetchInsights}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <RefreshIcon />
          <span>Cập nhật số liệu</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng lượt xem */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <EyeIcon />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500">Tổng lượt xem sản phẩm</p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">
              {Number(summary.totalProductViews || 0).toLocaleString("vi-VN")}
            </h3>
            <p className="text-[11px] text-blue-600 font-medium mt-0.5">Được xem qua toàn bộ web</p>
          </div>
        </div>

        {/* Card 2: Lượt tìm kiếm */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <SearchIcon />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500">Tổng lượt tìm kiếm</p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">
              {Number(summary.totalSearches || 0).toLocaleString("vi-VN")}
            </h3>
            <p className="text-[11px] text-amber-600 font-medium mt-0.5">Khách gõ tìm trên thanh search</p>
          </div>
        </div>

        {/* Card 3: Khách hàng được theo dõi */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <UserCheckIcon />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500">Khách hàng được ghi nhận</p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">
              {Number(summary.totalVisitors || 0).toLocaleString("vi-VN")}
            </h3>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Đã lưu hồ sơ sở thích</p>
          </div>
        </div>

        {/* Card 4: Thành viên đăng ký */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500">Khách có tài khoản</p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">
              {Number(summary.registeredCustomers || 0).toLocaleString("vi-VN")}
            </h3>
            <p className="text-[11px] text-purple-600 font-medium mt-0.5">Đã có hồ sơ & thông tin mua sắm</p>
          </div>
        </div>
      </div>

      {/* 2-Column Analytics: Top Products & Top Keywords */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Top 10 Sản phẩm được xem nhiều nhất (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <span>🔥</span> Top Sản Phẩm Được Xem Nhiều Nhất
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Các món hàng khách hàng click vào xem nhiều lần nhất
              </p>
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md">
              Top 10 quan tâm
            </span>
          </div>

          <div className="space-y-3.5">
            {topViewedProducts.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">Chưa có lượt xem nào được ghi nhận</p>
            ) : (
              topViewedProducts.map((prod, index) => {
                const img =
                  prod.image && prod.image.length > 0
                    ? prod.image[0]
                    : prod.images && prod.images.length > 0
                    ? prod.images[0]
                    : "";
                const views = prod.views || 0;
                const percent = Math.max(8, Math.round((views / maxProductViews) * 100));

                return (
                  <div
                    key={prod._id}
                    className="p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        index === 0 ? "bg-amber-400 text-white shadow-xs" :
                        index === 1 ? "bg-slate-400 text-white" :
                        index === 2 ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-600"
                      }`}>
                        {index + 1}
                      </span>
                      <div className="w-11 h-11 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0 p-1 flex items-center justify-center">
                        <img src={img} alt={prod.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 truncate max-w-[280px]">
                          {prod.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-gray-500 font-medium">
                            {prod.category} • {prod.subCategory}
                          </span>
                          <span className="text-xs font-extrabold text-[#d70018]">
                            {Number(prod.sellingPrice || prod.price).toLocaleString("vi-VN")}
                            {currency}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center sm:flex-col sm:items-end justify-between gap-1 shrink-0 pl-9 sm:pl-0">
                      <span className="px-2.5 py-1 bg-red-50 text-[#d70018] font-black text-xs rounded-lg border border-red-200">
                        {views} lượt xem
                      </span>
                      {/* Mini visual bar */}
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1 hidden sm:block">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Từ khóa tìm kiếm phổ biến (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <span>🔍</span> Từ Khóa Khách Tìm Nhiều Nhất
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Nhu cầu thực tế mà khách gõ trên website
              </p>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
              Xu hướng HOT
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {topKeywords.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center w-full">Chưa có từ khóa tìm kiếm nào</p>
            ) : (
              topKeywords.map((kw, idx) => (
                <div
                  key={idx}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                    idx === 0
                      ? "bg-red-500 text-white border-red-600 shadow-sm"
                      : idx < 3
                      ? "bg-red-50 text-[#d70018] border-red-200"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <SearchIcon />
                  <span className="font-bold">{kw.keyword}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                      idx === 0 ? "bg-white/20 text-white" : "bg-white text-gray-700 border border-gray-200"
                    }`}
                  >
                    {kw.count} lần
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Tips for Admin */}
          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              💡 Gợi ý chiến lược kinh doanh:
            </p>
            <p>
              Các từ khóa có lượt tìm kiếm cao nhất là những món đồ khách đang khao khát mua. Bạn nên ưu tiên nhập thêm hàng, chạy flash sale hoặc đẩy sản phẩm đó ra Banner trang chủ để tăng tỷ lệ chốt đơn!
            </p>
          </div>
        </div>
      </div>

      {/* Bảng Chi Tiết Hành Vi Từng Khách Hàng */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <span>👤</span> Hồ Sơ Chi Tiết Hành Vi Từng Khách Hàng
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Xem khách hàng nào đã ghé thăm, đang quan tâm thiết bị gì và đã xem những món nào bao nhiêu lần
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter buttons */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setFilterType("all")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filterType === "all" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Tất cả ({customerActivities.length})
              </button>
              <button
                onClick={() => setFilterType("registered")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filterType === "registered" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Có tài khoản
              </button>
              <button
                onClick={() => setFilterType("guest")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filterType === "guest" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Khách vãng lai
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên, email, SĐT, IP..."
                className="px-3.5 py-1.5 pl-8 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-red-500 w-56"
              />
              <span className="absolute left-2.5 top-2 text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 font-bold bg-gray-50/50">
                <th className="py-3 px-4">Khách hàng / Định danh</th>
                <th className="py-3 px-4">Xu hướng quan tâm</th>
                <th className="py-3 px-4">Sản phẩm đã xem & Số lần xem</th>
                <th className="py-3 px-4">Từ khóa đã tìm</th>
                <th className="py-3 px-4 text-right">Lần cuối ghé thăm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    Không tìm thấy hoạt động khách hàng nào phù hợp
                  </td>
                </tr>
              ) : (
                filteredActivities.map((act) => (
                  <tr key={act._id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Cột 1: Thông tin khách hàng */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          act.isRegistered ? "bg-red-600 text-white" : "bg-gray-200 text-gray-600"
                        }`}>
                          {act.customerName ? act.customerName.charAt(0).toUpperCase() : "K"}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{act.customerName || "Khách vãng lai"}</p>
                          {act.customerEmail && (
                            <p className="text-[11px] text-gray-500">{act.customerEmail}</p>
                          )}
                          {act.customerPhone && (
                            <p className="text-[11px] text-gray-600 font-semibold">{act.customerPhone}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              act.isRegistered
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-gray-100 text-gray-600"
                            }`}>
                              {act.isRegistered ? "Thành viên" : "Khách vãng lai"}
                            </span>
                            {act.ipAddress ? (
                              <span 
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs hover:bg-blue-100 cursor-pointer transition-colors"
                                title="Click để sao chép IP Public của khách hàng"
                                onClick={() => {
                                  navigator.clipboard?.writeText(act.ipAddress);
                                  toast.success(`Đã sao chép IP: ${act.ipAddress}`);
                                }}
                              >
                                <span>🌐</span>
                                <span>{act.ipAddress}</span>
                              </span>
                            ) : (
                              <span className="text-[9px] text-gray-400 font-mono">
                                ID: {act.sessionId ? act.sessionId.substring(0, 8) : "---"}...
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Cột 2: Xu hướng quan tâm */}
                    <td className="py-3.5 px-4">
                      {act.preferredCategory || act.preferredBrand ? (
                        <div className="space-y-1">
                          {act.preferredCategory && (
                            <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded-md text-[11px]">
                              {act.preferredCategory}
                            </span>
                          )}
                          {act.preferredBrand && (
                            <span className="block text-[11px] text-gray-600 font-semibold">
                              Hãng: <strong className="text-gray-900">{act.preferredBrand}</strong>
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Đang phân tích...</span>
                      )}
                    </td>

                    {/* Cột 3: Chi tiết món đồ đã xem & số lần xem */}
                    <td className="py-3.5 px-4 max-w-xs">
                      {act.viewedProducts && act.viewedProducts.length > 0 ? (
                        <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                          {act.viewedProducts.map((p, pIdx) => (
                            <div
                              key={pIdx}
                              className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-gray-50 border border-gray-100 text-[11px]"
                            >
                              <span className="font-medium text-gray-800 truncate" title={p.productName}>
                                {p.productName}
                              </span>
                              <span className="px-1.5 py-0.5 bg-red-100 text-red-700 font-black rounded text-[10px] shrink-0">
                                {p.viewCount} lần
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Chưa click xem món nào</span>
                      )}
                    </td>

                    {/* Cột 4: Từ khóa đã tìm kiếm */}
                    <td className="py-3.5 px-4 max-w-[200px]">
                      {act.searchKeywords && act.searchKeywords.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {act.searchKeywords.map((k, kIdx) => (
                            <span
                              key={kIdx}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-medium border border-amber-200"
                            >
                              <span>{k.keyword}</span>
                              <strong className="text-amber-900">({k.count})</strong>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Không tìm kiếm</span>
                      )}
                    </td>

                    {/* Cột 5: Lần cuối ghé thăm */}
                    <td className="py-3.5 px-4 text-right text-gray-500 text-[11px]">
                      {act.lastActive
                        ? new Date(act.lastActive).toLocaleString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                          })
                        : "Vừa xong"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerInsights;
