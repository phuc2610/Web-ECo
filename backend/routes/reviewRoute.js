import express from "express";
import multer from "multer";
import { auth as authUser } from "../middleware/auth.js";
import {
    addReview,
    getProductReviews,
    getUserReviews,
    updateReview,
    deleteReview,
    markHelpful,
    reportReview
} from "../controllers/reviewController.js";
import fs from 'fs';
import path from 'path';

const reviewRouter = express.Router();

// Multer configuration for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 5 // Max 5 images per review
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ cho phép upload file ảnh'), false);
        }
    }
});

// Middleware to clean up uploaded files after processing
const cleanupFiles = (req, res, next) => {
    // Clean up uploaded files after response is sent
    res.on('finish', () => {
        if (req.files) {
            req.files.forEach(file => {
                try {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                        console.log(`Cleaned up file: ${file.path}`);
                    }
                } catch (error) {
                    console.error('Error cleaning up file:', error);
                }
            });
        }
    });
    next();
};

// Public routes
reviewRouter.get('/product/:productId', getProductReviews);



// Protected routes (require authentication)
reviewRouter.post('/add', authUser, upload.array('images', 5), cleanupFiles, addReview);
reviewRouter.get('/user', authUser, getUserReviews);
reviewRouter.put('/update', authUser, upload.array('images', 5), cleanupFiles, updateReview);
reviewRouter.delete('/delete', authUser, deleteReview);
reviewRouter.post('/helpful', authUser, markHelpful);
reviewRouter.post('/report', authUser, reportReview);

export default reviewRouter;