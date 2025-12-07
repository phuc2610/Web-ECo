import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// function for add product
const addProduct = async (req,res) => {
    try {
        
        const {name , description , price , originalPrice , category , subCategory , sizes , stockQuantities, bestseller} = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1 , image2 , image3 , image4].filter((item) => item !== undefined);

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'});
                return result.secure_url
            })
        )
        
        const productData = {
            name,
            description,
            price: Number(price),
            originalPrice: originalPrice ? Number(originalPrice) : undefined,
            category,
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            stockQuantities: stockQuantities ? JSON.parse(stockQuantities) : {},
            image: imagesUrl,
            // date: Date.now()
        }

        
        const product = new productModel(productData);
        await product.save();

        res.json({success:true,message:"Sản phẩm đã thêm"})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }


}

// function for list product
const listProducts = async (req,res) => {
    try {
        
        const products = await productModel.find({});
        res.json({success:true,products})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// function for remove product
const removeProduct = async (req,res) => {
        try {

            await productModel.findByIdAndDelete(req.body.id)
            res.json({success:true,message:"Sản phẩm đã xóa thành công"})

        } catch (error) {
            console.log(error);
            res.json({success:false,message:error.message})
        }
}

// function for single product info
const singleProduct = async (req,res) => {
    
    try {
        
        const { productId } = req.body
        
        const product = await productModel.findById(productId)
        res.json({success:true,product})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }

}

// function for update product
const updateProduct = async (req, res) => {
    try {
        const { id, name, description, price, originalPrice, category, subCategory, sizes, stockQuantities, bestseller } = req.body;

        // Check if product exists
        const existingProduct = await productModel.findById(id);
        if (!existingProduct) {
            return res.json({ success: false, message: "Sản phẩm không tồn tại" });
        }

        // Handle image uploads if new images are provided
        let imagesUrl = existingProduct.image; // Keep existing images by default
        
        if (req.files) {
            const image1 = req.files.image1 && req.files.image1[0];
            const image2 = req.files.image2 && req.files.image2[0];
            const image3 = req.files.image3 && req.files.image3[0];
            const image4 = req.files.image4 && req.files.image4[0];

            const newImages = [image1, image2, image3, image4].filter((item) => item !== undefined);

            if (newImages.length > 0) {
                // Upload new images to cloudinary
                const newImagesUrl = await Promise.all(
                    newImages.map(async (item) => {
                        let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                        return result.secure_url;
                    })
                );

                // Combine new images with existing ones (you can modify this logic as needed)
                imagesUrl = [...newImagesUrl, ...existingProduct.image].slice(0, 4); // Keep max 4 images
            }
        }

        // Update product data
        const updateData = {
            name,
            description,
            price: Number(price),
            originalPrice: originalPrice ? Number(originalPrice) : undefined,
            category,
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            stockQuantities: stockQuantities ? JSON.parse(stockQuantities) : {},
            image: imagesUrl
        };

        const updatedProduct = await productModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({ success: true, message: "Sản phẩm đã được cập nhật thành công", product: updatedProduct });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    addProduct,
    listProducts,
    removeProduct,
    singleProduct,
    updateProduct
};

