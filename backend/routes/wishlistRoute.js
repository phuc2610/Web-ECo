import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  checkWishlistStatus
} from '../controllers/wishlistController.js';

const router = express.Router();

// Test endpoint - không cần auth
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Wishlist API is working'
  });
});

// Tất cả routes đều cần authentication
router.use(auth);

// Thêm sản phẩm vào wishlist
router.post('/add', addToWishlist);

// Lấy danh sách wishlist của user
router.get('/list', getWishlist);

// Xóa sản phẩm khỏi wishlist
router.delete('/remove/:productId', removeFromWishlist);

// Kiểm tra sản phẩm có trong wishlist không
router.get('/check/:productId', checkWishlistStatus);

export default router;
