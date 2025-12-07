import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true 
    },
    productId: { 
        type: String, 
        required: true 
    },
    orderId: { 
        type: String, 
        required: true 
    },
    rating: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 5 
    },
    comment: { 
        type: String, 
        required: true,
        maxlength: 500 
    },
    images: [{ 
        type: String 
    }],
    userName: { 
        type: String, 
        required: true 
    },
    userAvatar: { 
        type: String, 
        default: '' 
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },
    helpful: [{ 
        type: String // userIds who found this helpful
    }],
    reported: [{ 
        type: String // userIds who reported this review
    }]
}, { timestamps: true });

// Compound index to prevent duplicate reviews for same order-product combination
reviewSchema.index({ orderId: 1, productId: 1 }, { unique: true });

// Index for efficient querying
reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1 });

const reviewModel = mongoose.models.review || mongoose.model('review', reviewSchema);

export default reviewModel;
