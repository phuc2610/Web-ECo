import jwt from 'jsonwebtoken'
import { userModel } from '../models/userModel.js';
const authUser = async (req , res , next) => {

    const {token} = req.headers;
    console.log('Auth middleware - Headers:', req.headers);
    console.log('Auth middleware - Token:', token ? `${token.substring(0, 20)}...` : 'No token');
    
    // Kiểm tra token có tồn tại không
    if(!token) {
        return res.json({success : false , message : "Bạn không có quyền truy cập. Vui lòng đăng nhập lại để tiếp tục."})
    }

    // Kiểm tra format token (phải có 3 phần: header.payload.signature)
    if(typeof token !== 'string' || token.split('.').length !== 3) {
        return res.json({success : false , message : "Token không hợp lệ. Vui lòng đăng nhập lại."})
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // Kiểm tra token có id không
        if(!token_decode || !token_decode.id) {
            return res.json({success : false , message : "Token không hợp lệ. Vui lòng đăng nhập lại."})
        }
        
        const user = await userModel.findById(token_decode.id);
        if(!user) {
            return res.json({success : false , message : "Bạn không có quyền truy cập. Vui lòng đăng nhập lại để tiếp tục."})
        }

        req.userId = user._id;
        next();

    } catch (error) {
        console.log('JWT Error:', error.message);
        
        // Xử lý các loại lỗi JWT cụ thể
        if(error.name === 'TokenExpiredError') {
            return res.json({success : false , message : "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."})
        } else if(error.name === 'JsonWebTokenError') {
            return res.json({success : false , message : "Token không hợp lệ. Vui lòng đăng nhập lại."})
        } else {
            return res.json({success : false , message : "Lỗi xác thực. Vui lòng đăng nhập lại."})
        }
    }

}

export { authUser as auth }