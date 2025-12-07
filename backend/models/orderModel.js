import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    userId: { type:String , required:true },
    items: {type:Array , required:true },
    amount: { type:Number , required:true },
    originalAmount: { type:Number, default: 0 }, // Giá gốc trước khi giảm
    voucherCode: { type:String, default: '' }, // Mã voucher được sử dụng
    discountAmount: { type:Number, default: 0 }, // Số tiền được giảm
    couponId: { type:mongoose.Schema.Types.ObjectId, ref:'Coupon'},
    address: { type:Object , required:true },
    status: { type:String , required:true  , default: 'Đã đặt hàng'},
    cancelReason: { type:String, default: '' },
    paymentMethod: { type:String , required:true },
    payment: { type:Boolean, required:true , default: false },
    // date: { type:Number , required:true }
},{timestamps:true})

const orderModel = mongoose.models.order || mongoose.model('order' , orderSchema);
export default orderModel;