import orderModel from "../models/orderModel.js";
import { userModel } from "../models/userModel.js";
import productModel from "../models/productModel.js";

// API thống kê tổng quan
const getOverallStats = async (req, res) => {
  try {
    // Thống kê tổng số đơn hàng
    const totalOrders = await orderModel.countDocuments();

    // Thống kê tổng số người dùng
    const totalUsers = await userModel.countDocuments();

    // Thống kê tổng số sản phẩm
    const totalProducts = await productModel.countDocuments();

    // Thống kê tổng doanh thu
    const revenueData = await orderModel.aggregate([
      {
        $match: { payment: true },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Thống kê số đơn hàng theo trạng thái
    const ordersByStatus = await orderModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        totalUsers,
        totalProducts,
        totalRevenue,
        ordersByStatus,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API thống kê doanh thu theo thời gian
const getRevenueStats = async (req, res) => {
  try {
    const { period = "month", year, month } = req.query;

    let matchCondition = { payment: true };
    let groupBy = {};

    if (period === "day" && year && month) {
      // Thống kê theo ngày trong tháng
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      matchCondition.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };

      groupBy = {
        _id: { $dayOfMonth: "$createdAt" },
        revenue: { $sum: "$amount" },
        orderCount: { $sum: 1 },
      };
    } else if (period === "month" && year) {
      // Thống kê theo tháng trong năm
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);

      matchCondition.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };

      groupBy = {
        _id: { $month: "$createdAt" },
        revenue: { $sum: "$amount" },
        orderCount: { $sum: 1 },
      };
    } else {
      // Thống kê theo năm
      groupBy = {
        _id: { $year: "$createdAt" },
        revenue: { $sum: "$amount" },
        orderCount: { $sum: 1 },
      };
    }

    const revenueData = await orderModel.aggregate([
      { $match: matchCondition },
      { $group: groupBy },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: revenueData,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API thống kê sản phẩm bán chạy
const getTopProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const topProducts = await orderModel.aggregate([
      { $match: { payment: true } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items._id",
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
          productName: { $first: "$items.name" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: parseInt(limit) },
    ]);

    res.json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API thống kê đơn hàng theo trạng thái
const getOrderStats = async (req, res) => {
  try {
    const { period = "month", year, month } = req.query;

    let matchCondition = {};

    if (period === "day" && year && month) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      matchCondition.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };
    } else if (period === "month" && year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);

      matchCondition.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    // Thống kê theo trạng thái
    const ordersByStatus = await orderModel.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Thống kê theo phương thức thanh toán
    const ordersByPaymentMethod = await orderModel.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
        },
      },
    ]);

    // Thống kê đơn hàng theo thời gian
    let groupBy = {};
    if (period === "day" && year && month) {
      groupBy = {
        _id: { $dayOfMonth: "$createdAt" },
        orderCount: { $sum: 1 },
      };
    } else if (period === "month" && year) {
      groupBy = {
        _id: { $month: "$createdAt" },
        orderCount: { $sum: 1 },
      };
    } else {
      groupBy = {
        _id: { $year: "$createdAt" },
        orderCount: { $sum: 1 },
      };
    }

    const ordersByTime = await orderModel.aggregate([
      { $match: matchCondition },
      { $group: groupBy },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        ordersByStatus,
        ordersByPaymentMethod,
        ordersByTime,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// API thống kê sản phẩm
const getProductStats = async (req, res) => {
  try {
    // Thống kê sản phẩm theo danh mục
    const productsByCategory = await productModel.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    // Thống kê sản phẩm theo danh mục con
    const productsBySubCategory = await productModel.aggregate([
      {
        $group: {
          _id: "$subCategory",
          count: { $sum: 1 },
        },
      },
    ]);

    // Thống kê sản phẩm bestseller
    const bestsellerCount = await productModel.countDocuments({ bestseller: true });
    const regularCount = await productModel.countDocuments({ bestseller: { $ne: true } });

    // Thống kê giá sản phẩm
    const priceStats = await productModel.aggregate([
      {
        $group: {
          _id: null,
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        productsByCategory,
        productsBySubCategory,
        bestsellerStats: {
          bestseller: bestsellerCount,
          regular: regularCount,
        },
        priceStats: priceStats.length > 0 ? priceStats[0] : null,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { getOverallStats, getRevenueStats, getTopProducts, getOrderStats, getProductStats };
