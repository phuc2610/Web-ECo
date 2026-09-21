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

// Helper function to normalize product data for backwards/alternate schema compatibility
const formatProduct = (p) => {
    if (!p) return null;
    const doc = p.toObject ? p.toObject() : { ...p };
    const price = typeof doc.price === 'number' ? doc.price : (typeof doc.sellingPrice === 'number' ? doc.sellingPrice : 0);
    
    let image = [];
    if (Array.isArray(doc.image) && doc.image.length > 0) {
        image = doc.image.map(img => typeof img === 'string' ? img : (img?.url || ''));
    } else if (Array.isArray(doc.images) && doc.images.length > 0) {
        image = doc.images.map(img => typeof img === 'string' ? img : (img?.url || ''));
    }
    if (image.length === 0) {
        image = ["https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400"];
    }

    return {
        ...doc,
        price,
        originalPrice: typeof doc.originalPrice === 'number' ? doc.originalPrice : price,
        image,
        category: doc.category || 'Điện thoại',
        subCategory: doc.subCategory || doc.brand || doc.category || 'Khác',
        brand: doc.brand || doc.subCategory || 'Khác',
        sizes: Array.isArray(doc.sizes) && doc.sizes.length > 0 ? doc.sizes : ['Tiêu chuẩn'],
        stockQuantities: doc.stockQuantities || {},
        specs: doc.specs || {},
        bestseller: Boolean(doc.bestseller),
        featured: Boolean(doc.featured),
        isNewProduct: Boolean(doc.isNewProduct)
    };
};

// function for list product
const listProducts = async (req,res) => {
    try {
        const productsRaw = await productModel.find({});
        const products = productsRaw.map(formatProduct);
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
        
        const productRaw = await productModel.findById(productId)
        if (!productRaw) {
            return res.json({success:false, message: "Không tìm thấy sản phẩm"});
        }
        const product = formatProduct(productRaw);
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

