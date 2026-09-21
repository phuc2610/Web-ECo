import couponModel from '../models/couponModel.js';

// Validate and calculate discount for coupon
const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code) {
      return res.json({ success: false, message: "Vui lòng nhập mã giảm giá" });
    }

    const coupon = await couponModel.findOne({ 
      code: { $regex: new RegExp(`^${code.trim()}$`, 'i') } 
    });

    if (!coupon) {
      return res.json({ success: false, message: "Mã giảm giá không tồn tại" });
    }

    if (!coupon.isActive) {
      return res.json({ success: false, message: "Mã giảm giá đã bị vô hiệu hóa" });
    }

    const now = new Date();
    if (coupon.startDate && now < new Date(coupon.startDate)) {
      return res.json({ success: false, message: "Mã giảm giá chưa đến ngày áp dụng" });
    }

    if (coupon.endDate && now > new Date(coupon.endDate)) {
      return res.json({ success: false, message: "Mã giảm giá đã hết hạn sử dụng" });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.json({ success: false, message: "Mã giảm giá đã hết lượt sử dụng" });
    }

    const currentAmount = Number(orderAmount) || 0;
    if (coupon.minOrderValue && currentAmount < coupon.minOrderValue) {
      return res.json({
        success: false,
        message: `Đơn hàng tối thiểu ${coupon.minOrderValue.toLocaleString('vi-VN')}đ để áp dụng mã này`
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.code.toUpperCase() === 'FREESHIP') {
      discountAmount = 30000; // Free delivery fee
    } else if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((currentAmount * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.discountType === 'fixed') {
      discountAmount = Math.min(coupon.discountValue, currentAmount);
    }

    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxDiscount: coupon.maxDiscount,
        minOrderValue: coupon.minOrderValue
      },
      discountAmount,
      message: `Áp dụng mã thành công! Giảm ${discountAmount.toLocaleString('vi-VN')}đ`
    });

  } catch (error) {
    console.log('Error validating coupon:', error);
    res.json({ success: false, message: error.message });
  }
};

// List available coupons for customer or admin
const listCoupons = async (req, res) => {
  try {
    const coupons = await couponModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (error) {
    console.log('Error listing coupons:', error);
    res.json({ success: false, message: error.message });
  }
};

// Admin create new coupon
const createCoupon = async (req, res) => {
  try {
    const { code, description, discountType, discountValue, minOrderValue, maxDiscount, startDate, endDate, usageLimit } = req.body;

    if (!code || !discountType || !discountValue) {
      return res.json({ success: false, message: "Vui lòng điền đầy đủ thông tin mã giảm giá" });
    }

    const existing = await couponModel.findOne({ code: code.trim().toUpperCase() });
    if (existing) {
      return res.json({ success: false, message: "Mã giảm giá này đã tồn tại" });
    }

    const coupon = new couponModel({
      code: code.trim().toUpperCase(),
      description,
      discountType,
      discountValue: Number(discountValue),
      minOrderValue: Number(minOrderValue) || 0,
      maxDiscount: Number(maxDiscount) || undefined,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      usageLimit: Number(usageLimit) || 100,
      usedCount: 0,
      isActive: true
    });

    await coupon.save();
    res.json({ success: true, message: "Tạo mã giảm giá thành công", coupon });
  } catch (error) {
    console.log('Error creating coupon:', error);
    res.json({ success: false, message: error.message });
  }
};

// Admin delete coupon
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.body;
    await couponModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Xóa mã giảm giá thành công" });
  } catch (error) {
    console.log('Error deleting coupon:', error);
    res.json({ success: false, message: error.message });
  }
};

// Admin toggle status
const toggleCouponStatus = async (req, res) => {
  try {
    const { id } = req.body;
    const coupon = await couponModel.findById(id);
    if (!coupon) return res.json({ success: false, message: "Không tìm thấy mã" });
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.json({ success: true, message: "Cập nhật trạng thái thành công", isActive: coupon.isActive });
  } catch (error) {
    console.log('Error toggling coupon:', error);
    res.json({ success: false, message: error.message });
  }
};

export {
  validateCoupon,
  listCoupons,
  createCoupon,
  deleteCoupon,
  toggleCouponStatus
};
