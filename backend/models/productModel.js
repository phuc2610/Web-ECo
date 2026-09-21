import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type:String, required:true },
    description: { type:String, default: '' },
    price: { type:Number },
    sellingPrice: { type:Number },
    originalPrice: { type:Number },
    image: { type:Array, default: [] },
    images: { type:Array, default: [] },
    bestseller: { type:Boolean, default: false },
    category: { type:String, default: 'Chung' },
    subCategory: { type:String, default: 'Chung' },
    sizes: { type:Array, default: ['Tiêu chuẩn'] },
    stockQuantities: { type:Object, default:{} },
    averageRating: { type:Number, default:0 },
    totalReviews: { type:Number, default:0 },
    views: { type:Number, default:0 },
    // date: { type:Number , required:true },
},{timestamps:true, strict: false})


const productModel = mongoose.models.product || mongoose.model("product",productSchema);

export default productModel