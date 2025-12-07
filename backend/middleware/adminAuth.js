import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;
    console.log('AdminAuth - Token received:', token ? `${token.substring(0, 20)}...` : 'No token');
    
    if (!token) {
      return res.json({ success: false, message: "Bạn không có quyền truy cập. Vui lòng đăng nhập lại để tiếp tục." });
    }
    
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log('AdminAuth - Token decoded:', token_decode);
    console.log('AdminAuth - Expected:', process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD);
    
    // Kiểm tra token có chứa admin credentials không
    if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.json({ success: false, message: "Bạn không có quyền truy cập. Vui lòng đăng nhập lại để tiếp tục." });
    }
    
    // Thêm admin info vào request
    req.isAdmin = true;
    console.log('AdminAuth - Success, proceeding...');
    next();
  } catch (error) {
    console.log('AdminAuth Error:', error);
    res.json({ success: false, message: "Token không hợp lệ. Vui lòng đăng nhập lại." });
  }
};

export { adminAuth };