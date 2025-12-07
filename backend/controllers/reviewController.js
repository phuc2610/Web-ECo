import { v2 as cloudinary } from "cloudinary";
import reviewModel from "../models/reviewModel.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import { userModel } from "../models/userModel.js";

// Add a new review
const addReview = async (req, res) => {
    try {
        const { productId, orderId, rating, comment } = req.body;
        const userId = req.userId;

        // Validate input
        if (!productId || !orderId || !rating || !comment) {
            return res.json({ success: false, message: "Thiếu thông tin cần thiết" });
        }

        if (rating < 1 || rating > 5) {
            return res.json({ success: false, message: "Đánh giá phải từ 1-5 sao" });
        }

        // Check if order exists and belongs to user
        const order = await orderModel.findOne({ _id: orderId, userId });
        if (!order) {
            return res.json({ success: false, message: "Không tìm thấy đơn hàng" });
        }

                    // Check if order status is "Đã giao hàng"
    if (order.status !== "Đã giao hàng") {
          return res.json({ 
            success: false, 
            message: "Chỉ có thể đánh giá sau khi đơn hàng đã được giao" 
          });
        }

        // Check if product exists in order
        const productInOrder = order.items.find(item => item._id === productId);
        if (!productInOrder) {
            return res.json({ success: false, message: "Sản phẩm không có trong đơn hàng" });
        }

        // Check if review already exists
        const existingReview = await reviewModel.findOne({ orderId, productId });
        if (existingReview) {
            return res.json({ success: false, message: "Bạn đã đánh giá sản phẩm này" });
        }

        // Get user info
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "Không tìm thấy thông tin người dùng" });
        }

        // Handle image uploads
        let imagesUrl = [];
        if (req.files && req.files.length > 0) {
            imagesUrl = await Promise.all(
                req.files.map(async (file) => {
                    try {
                        const result = await cloudinary.uploader.upload(file.path, {
                            resource_type: 'image',
                            folder: 'reviews',
                            transformation: [
                                { width: 800, height: 800, crop: 'limit' },
                                { quality: 'auto:good' }
                            ]
                        });
                        return result.secure_url;
                    } catch (uploadError) {
                        console.error('Cloudinary upload error:', uploadError);
                        throw new Error('Không thể upload ảnh lên Cloudinary');
                    }
                })
            );
        }

        // Create review
        const reviewData = {
            userId,
            productId,
            orderId,
            rating: Number(rating),
            comment,
            images: imagesUrl,
            userName: user.name,
            userAvatar: user.avatar || '',
            isVerified: true // Verified purchase
        };

        const newReview = new reviewModel(reviewData);
        await newReview.save();

        // Update product average rating
        await updateProductRating(productId);

        res.json({ 
            success: true, 
            message: "Đánh giá đã được gửi thành công",
            review: newReview
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get reviews for a product
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const { page = 1, limit = 10, sort = 'newest' } = req.query;

        if (!productId) {
            return res.json({ success: false, message: "Thiếu ID sản phẩm" });
        }

        // Build sort object
        let sortObject = {};
        switch (sort) {
            case 'newest':
                sortObject = { createdAt: -1 };
                break;
            case 'oldest':
                sortObject = { createdAt: 1 };
                break;
            case 'rating_high':
                sortObject = { rating: -1 };
                break;
            case 'rating_low':
                sortObject = { rating: 1 };
                break;
            default:
                sortObject = { createdAt: -1 };
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Get reviews with pagination
        const reviews = await reviewModel
            .find({ productId })
            .sort(sortObject)
            .skip(skip)
            .limit(parseInt(limit))
            .populate('userId', 'name avatar')
            .lean();

        // Get total count
        const totalReviews = await reviewModel.countDocuments({ productId });

        // Calculate average rating
        const ratingStats = await reviewModel.aggregate([
            { $match: { productId } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 },
                    ratingDistribution: {
                        $push: "$rating"
                    }
                }
            }
        ]);

        // Calculate rating distribution
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        if (ratingStats.length > 0) {
            ratingStats[0].ratingDistribution.forEach(rating => {
                distribution[rating]++;
            });
        }

        const result = {
            reviews,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalReviews / limit),
                totalReviews,
                hasNextPage: skip + reviews.length < totalReviews,
                hasPrevPage: page > 1
            },
            stats: ratingStats.length > 0 ? {
                averageRating: Math.round(ratingStats[0].averageRating * 10) / 10,
                totalReviews: ratingStats[0].totalReviews,
                distribution
            } : {
                averageRating: 0,
                totalReviews: 0,
                distribution
            }
        };

        res.json({ success: true, ...result });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get user's reviews
const getUserReviews = async (req, res) => {
    try {
        const userId = req.userId;
        const { page = 1, limit = 10 } = req.query;

        const skip = (page - 1) * limit;

        const reviews = await reviewModel
            .find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('productId', 'name image price')
            .lean();

        const totalReviews = await reviewModel.countDocuments({ userId });

        res.json({
            success: true,
            reviews,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalReviews / limit),
                totalReviews,
                hasNextPage: skip + reviews.length < totalReviews,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update review
const updateReview = async (req, res) => {
    try {
        const { reviewId, rating, comment } = req.body;
        const userId = req.userId;

        if (!reviewId || !rating || !comment) {
            return res.json({ success: false, message: "Thiếu thông tin cần thiết" });
        }

        // Find review and check ownership
        const review = await reviewModel.findOne({ _id: reviewId, userId });
        if (!review) {
            return res.json({ success: false, message: "Không tìm thấy đánh giá hoặc không có quyền chỉnh sửa" });
        }

        // Handle new image uploads
        let newImagesUrl = [];
        if (req.files && req.files.length > 0) {
            newImagesUrl = await Promise.all(
                req.files.map(async (file) => {
                    try {
                        const result = await cloudinary.uploader.upload(file.path, {
                            resource_type: 'image',
                            folder: 'reviews',
                            transformation: [
                                { width: 800, height: 800, crop: 'limit' },
                                { quality: 'auto:good' }
                            ]
                        });
                        return result.secure_url;
                    } catch (uploadError) {
                        console.error('Cloudinary upload error:', uploadError);
                        throw new Error('Không thể upload ảnh lên Cloudinary');
                    }
                })
            );
        }

        // Update review
        const updateData = {
            rating: Number(rating),
            comment,
            ...(newImagesUrl.length > 0 && { images: [...review.images, ...newImagesUrl] })
        };

        const updatedReview = await reviewModel.findByIdAndUpdate(
            reviewId,
            updateData,
            { new: true }
        );

        // Update product average rating
        await updateProductRating(review.productId);

        res.json({
            success: true,
            message: "Đánh giá đã được cập nhật",
            review: updatedReview
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Delete review
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.body;
        const userId = req.userId;

        if (!reviewId) {
            return res.json({ success: false, message: "Thiếu ID đánh giá" });
        }

        // Find review and check ownership
        const review = await reviewModel.findOne({ _id: reviewId, userId });
        if (!review) {
            return res.json({ success: false, message: "Không tìm thấy đánh giá hoặc không có quyền xóa" });
        }

        // Delete images from cloudinary
        if (review.images.length > 0) {
            await Promise.all(
                review.images.map(async (imageUrl) => {
                    try {
                        // Extract public_id from Cloudinary URL
                        const urlParts = imageUrl.split('/');
                        const filename = urlParts[urlParts.length - 1];
                        const publicId = filename.split('.')[0];
                        
                        // Get folder path from URL
                        const folderIndex = urlParts.findIndex(part => part === 'reviews');
                        if (folderIndex !== -1) {
                            const folderPath = urlParts.slice(folderIndex + 1, -1).join('/');
                            const fullPublicId = folderPath ? `reviews/${folderPath}/${publicId}` : `reviews/${publicId}`;
                            
                            await cloudinary.uploader.destroy(fullPublicId);
                            console.log(`Deleted image: ${fullPublicId}`);
                        }
                    } catch (error) {
                        console.log('Error deleting image from Cloudinary:', error);
                    }
                })
            );
        }

        // Delete review
        await reviewModel.findByIdAndDelete(reviewId);

        // Update product average rating
        await updateProductRating(review.productId);

        res.json({ success: true, message: "Đánh giá đã được xóa" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Mark review as helpful
const markHelpful = async (req, res) => {
    try {
        const { reviewId } = req.body;
        const userId = req.userId;

        if (!reviewId) {
            return res.json({ success: false, message: "Thiếu ID đánh giá" });
        }

        const review = await reviewModel.findById(reviewId);
        if (!review) {
            return res.json({ success: false, message: "Không tìm thấy đánh giá" });
        }

        // Toggle helpful status
        const isHelpful = review.helpful.includes(userId);
        if (isHelpful) {
            review.helpful = review.helpful.filter(id => id !== userId);
        } else {
            review.helpful.push(userId);
        }

        await review.save();

        res.json({
            success: true,
            message: isHelpful ? "Đã bỏ đánh dấu hữu ích" : "Đã đánh dấu hữu ích",
            helpfulCount: review.helpful.length,
            isHelpful: !isHelpful
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Report review
const reportReview = async (req, res) => {
    try {
        const { reviewId, reason } = req.body;
        const userId = req.userId;

        if (!reviewId || !reason) {
            return res.json({ success: false, message: "Thiếu thông tin cần thiết" });
        }

        const review = await reviewModel.findById(reviewId);
        if (!review) {
            return res.json({ success: false, message: "Không tìm thấy đánh giá" });
        }

        // Check if user already reported
        if (review.reported.includes(userId)) {
            return res.json({ success: false, message: "Bạn đã báo cáo đánh giá này" });
        }

        review.reported.push(userId);
        await review.save();

        res.json({ success: true, message: "Đã báo cáo đánh giá" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Helper function to update product average rating
const updateProductRating = async (productId) => {
    try {
        const ratingStats = await reviewModel.aggregate([
            { $match: { productId } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);

        if (ratingStats.length > 0) {
            await productModel.findByIdAndUpdate(productId, {
                averageRating: Math.round(ratingStats[0].averageRating * 10) / 10,
                totalReviews: ratingStats[0].totalReviews
            });
        }
    } catch (error) {
        console.log('Error updating product rating:', error);
    }
};

export {
    addReview,
    getProductReviews,
    getUserReviews,
    updateReview,
    deleteReview,
    markHelpful,
    reportReview
};


