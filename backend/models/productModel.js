import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type:String, required:true },
    description: { type:String, required:true },
    price: { type:Number, required:true },
    originalPrice: { type:Number },
    image: { type:Array, required:true },
    bestseller: { type:Boolean },
    category: { type:String, required:true },
    subCategory: { type:String, required:true },
    sizes: { type:Array, required:true },
    stockQuantities: { type:Object, default:{} },
    averageRating: { type:Number, default:0 },
    totalReviews: { type:Number, default:0 },
    // date: { type:Number , required:true },
},{timestamps:true})


const productModel = mongoose.models.product || mongoose.model("product",productSchema);

export default productModel