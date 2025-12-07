import Wishlist from '../models/wishlistModel.js';
import Product from '../models/productModel.js';

// Thêm sản phẩm vào wishlist
  const addToWishlist = async (req, res) => {
    try {
      const { productId } = req.body;
      const userId = req.userId;

    // Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Sản phẩm không tồn tại'
      });
    }

    // Kiểm tra đã có trong wishlist chưa
    const existingWishlist = await Wishlist.findOne({ userId, productId });
    if (existingWishlist) {
      return res.status(400).json({
        success: false,
        message: 'Sản phẩm đã có trong danh sách yêu thích'
      });
    }

    // Thêm vào wishlist
    const wishlistItem = new Wishlist({
      userId,
      productId
    });

    await wishlistItem.save();

    res.status(201).json({
      success: true,
      message: 'Đã thêm vào danh sách yêu thích'
    });

  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi thêm vào danh sách yêu thích'
    });
  }
};

// Lấy danh sách wishlist của user
  const getWishlist = async (req, res) => {
    try {
      const userId = req.userId;
      console.log('getWishlist called with userId:', userId);

      // Test simple query first
      const testItems = await Wishlist.find({ userId });
      console.log('Test items without populate:', testItems);

      if (testItems.length === 0) {
        console.log('No wishlist items found, returning empty array');
        return res.json({
          success: true,
          wishlist: []
        });
      }

      // Test populate with error handling
      try {
        console.log('Attempting to populate productId...');
        const wishlistItems = await Wishlist.find({ userId })
          .populate('productId')
          .sort({ addedAt: -1 });
        console.log('Populated wishlist items:', wishlistItems);
        console.log('Found wishlist items count:', wishlistItems.length);

        // Lọc ra các sản phẩm còn tồn tại
        const validWishlistItems = wishlistItems.filter(item => item.productId);
        console.log('Valid wishlist items count:', validWishlistItems.length);

        res.json({
          success: true,
          wishlist: validWishlistItems
        });
      } catch (populateError) {
        console.error('Error during populate:', populateError);
        // Fallback: return items without populate
        res.json({
          success: true,
          wishlist: testItems
        });
      }

    } catch (error) {
      console.error('Error getting wishlist:', error);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi lấy danh sách yêu thích'
      });
    }
  };

// Xóa sản phẩm khỏi wishlist
  const removeFromWishlist = async (req, res) => {
    try {
      const { productId } = req.params;
      const userId = req.userId;

    const deletedItem = await Wishlist.findOneAndDelete({ userId, productId });

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: 'Sản phẩm không có trong danh sách yêu thích'
      });
    }

    res.json({
      success: true,
      message: 'Đã xóa khỏi danh sách yêu thích'
    });

  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi xóa khỏi danh sách yêu thích'
    });
  }
};

// Kiểm tra sản phẩm có trong wishlist không
  const checkWishlistStatus = async (req, res) => {
    try {
      const { productId } = req.params;
      const userId = req.userId;

    const wishlistItem = await Wishlist.findOne({ userId, productId });

    res.json({
      success: true,
      isInWishlist: !!wishlistItem
    });

  } catch (error) {
    console.error('Error checking wishlist status:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi kiểm tra trạng thái yêu thích'
    });
  }
};

export {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  checkWishlistStatus
};
