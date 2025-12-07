import React, { useState, useEffect, useCallback } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import axios from "axios";
import SimpleChart from "../components/SimpleChart";

const Statistics = ({ token }) => {
  const [overallStats, setOverallStats] = useState({});
  const [revenueStats, setRevenueStats] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [orderStats, setOrderStats] = useState({});
  const [productStats, setProductStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // Fetch overall statistics
  const fetchOverallStats = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/statistics/overview`, {
        headers: { token },
      });
      if (response.data.success) {
        setOverallStats(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi tải thống kê tổng quan");
    }
  }, [token]);

  // Fetch revenue statistics
  const fetchRevenueStats = useCallback(async () => {
    try {
      let url = `${backendUrl}/api/statistics/revenue?period=${selectedPeriod}&year=${selectedYear}`;
      if (selectedPeriod === "day") {
        url += `&month=${selectedMonth}`;
      }

      const response = await axios.get(url, {
        headers: { token },
      });
      if (response.data.success) {
        setRevenueStats(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi tải thống kê doanh thu");
    }
  }, [selectedPeriod, selectedYear, selectedMonth, token]);

  // Fetch top products
  const fetchTopProducts = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/statistics/top-products?limit=5`, {
        headers: { token },
      });
      if (response.data.success) {
        setTopProducts(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi tải sản phẩm bán chạy");
    }
  }, [token]);

  // Fetch order statistics
  const fetchOrderStats = useCallback(async () => {
    try {
      let url = `${backendUrl}/api/statistics/orders?period=${selectedPeriod}&year=${selectedYear}`;
      if (selectedPeriod === "day") {
        url += `&month=${selectedMonth}`;
      }

      const response = await axios.get(url, {
        headers: { token },
      });
      if (response.data.success) {
        setOrderStats(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi tải thống kê đơn hàng");
    }
  }, [selectedPeriod, selectedYear, selectedMonth, token]);
  
  // Fetch product statistics
  const fetchProductStats = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/statistics/products`, {
        headers: { token },
      });
      if (response.data.success) {
        setProductStats(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi tải thống kê sản phẩm");
    }
  }, [token]);

  // Load all statistics
  const loadAllStats = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchOverallStats(),
      fetchRevenueStats(),
      fetchTopProducts(),
      fetchOrderStats(),
      fetchProductStats(),
    ]);
    setLoading(false);
  }, [fetchOverallStats, fetchRevenueStats, fetchTopProducts, fetchOrderStats, fetchProductStats]);

  useEffect(() => {
    loadAllStats();
  }, [loadAllStats]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  };

  // Get period label
  const getPeriodLabel = (id) => {
    if (selectedPeriod === "day") {
      return `Ngày ${id}`;
    } else if (selectedPeriod === "month") {
      return `Tháng ${id}`;
    } else {
      return `Năm ${id}`;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Thống kê & Báo cáo</h1>

      {/* Time Period Selector */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="year">Theo năm</option>
              <option value="month">Theo tháng</option>
              <option value="day">Theo ngày</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Năm</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {selectedPeriod === "day" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tháng</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    Tháng {month}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Overall Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-500 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Tổng doanh thu</p>
              <p className="text-2xl font-bold">{formatCurrency(overallStats.totalRevenue || 0)}</p>
            </div>
            <div className="text-blue-200">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path
                  fillRule="evenodd"
                  d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-green-500 bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Tổng đơn hàng</p>
              <p className="text-2xl font-bold">{overallStats.totalOrders || 0}</p>
            </div>
            <div className="text-green-200">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM8 8a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-purple-500 bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Tổng khách hàng</p>
              <p className="text-2xl font-bold">{overallStats.totalUsers || 0}</p>
            </div>
            <div className="text-purple-200">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-orange-500 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Tổng sản phẩm</p>
              <p className="text-2xl font-bold">{overallStats.totalProducts || 0}</p>
            </div>
            <div className="text-orange-200">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <SimpleChart
          data={revenueStats.map((item) => ({
            label: getPeriodLabel(item._id),
            value: item.revenue,
          }))}
          title="Doanh thu theo thời gian"
          type="bar"
        />

        {/* Top Products */}
        <SimpleChart
          data={topProducts.map((product, index) => ({
            label: `${index + 1}. ${product.productName}`,
            value: product.totalQuantity,
          }))}
          title="Top sản phẩm bán chạy"
          type="line"
        />
      
        {/* Payment Methods */}
        <SimpleChart
          data={
            orderStats.ordersByPaymentMethod?.map((method) => ({
              label: method._id,
              value: method.count,
            })) || []
          }
          title="Phương thức thanh toán"
          type="pie"
        />

        {/* Product Categories */}
        <SimpleChart
          data={
            productStats.productsByCategory?.map((category) => ({
              label: category._id,
              value: category.count,
            })) || []
          }
          title="Sản phẩm theo danh mục"
          type="bar"
        />
       
      </div>
    </div>
  );
};

export default Statistics;
