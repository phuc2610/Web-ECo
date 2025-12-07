import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Người dùng không tồn tại" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token , user: {
        _id: user._id,
        name: user.name, 
        email: user.email
      }});
    } else {
      res.json({ success: false, message: "Thông tin đăng nhập không hợp lệ" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for user registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "Email đã được đăng ký" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Vui lòng nhập email hợp lệ" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Vui lòng nhập mật khẩu có ít nhất 8 ký tự" });
    }

    // băm mật khẩu người dùng
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Thông tin đăng nhập không hợp lệ" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API để tạo người dùng mới (dành cho admin)
const createUser = async (req, res) => {
  try {
    const { name, email, password, phone_number, gender, address, role } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Vui lòng nhập đầy đủ tên, email và mật khẩu" });
    }
 
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Vui lòng nhập email hợp lệ" });
    }
   
    if (password.length < 8) {
      return res.json({ success: false, message: "Mật khẩu phải có ít nhất 8 ký tự" });
    }
    
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "Email đã được đăng ký" });
    }
  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      phone_number: phone_number || "",
      gender: gender || "",
      address: address || "",
      role: role || "user",
    });

    const user = await newUser.save();
  
    const userResponse = await userModel.findById(user._id).select("-password -cartData");

    res.json({ 
      success: true, 
      message: "Tạo người dùng thành công", 
      user: userResponse 
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// API để lấy danh sách tất cả người dùng (dành cho admin)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Tạo query tìm kiếm
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone_number: { $regex: search, $options: "i" } },
        ],
      };
    }

    const users = await userModel
      .find(query)
      .select("-password -cartData") // Loại bỏ password và cartData khỏi kết quả
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    const totalUsers = await userModel.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limitNumber);

    res.json({
      success: true,
      users,
      pagination: {
        total: totalUsers,
        page: pageNumber,
        limit: limitNumber,
        totalPages: totalPages,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API để lấy thông tin chi tiết một người dùng
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.json({ success: false, message: "Không tìm thấy người dùng" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API để cập nhật thông tin người dùng (dành cho admin)
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, phone_number, gender, address, role } = req.body;

    // Kiểm tra email hợp lệ nếu có cập nhật email
    if (email && !validator.isEmail(email)) {
      return res.json({ success: false, message: "Email không hợp lệ" });
    }

    // Kiểm tra email đã tồn tại nếu có cập nhật email
    if (email) {
      const existingUser = await userModel.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.json({ success: false, message: "Email đã được sử dụng bởi người dùng khác" });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone_number) updateData.phone_number = phone_number;
    if (gender) updateData.gender = gender;
    if (address) updateData.address = address;
    if (role) updateData.role = role;

    const updatedUser = await userModel
      .findByIdAndUpdate(userId, updateData, { new: true, runValidators: true })
      .select("-password -cartData");

    if (!updatedUser) {
      return res.json({ success: false, message: "Không tìm thấy người dùng" });
    }

    res.json({ success: true, message: "Cập nhật thông tin người dùng thành công", user: updatedUser });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API để xóa người dùng (dành cho admin)
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "Không tìm thấy người dùng" });
    }

    // Không cho phép xóa admin
    if (user.role === "admin") {
      return res.json({ success: false, message: "Không thể xóa tài khoản admin" });
    }

    await userModel.findByIdAndDelete(userId);

    res.json({ success: true, message: "Xóa người dùng thành công" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API để người dùng tự cập nhật thông tin cá nhân
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId; 
    
    const { name, email, phone_number, gender, address, currentPassword, newPassword } = req.body;

    // Tìm người dùng hiện tại
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "Không tìm thấy người dùng" });
    }

    // Kiểm tra email hợp lệ nếu có cập nhật email
    if (email && !validator.isEmail(email)) {
      return res.json({ success: false, message: "Email không hợp lệ" });
    }

    // Kiểm tra email đã tồn tại nếu có cập nhật email
    if (email && email !== user.email) {
      const existingUser = await userModel.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.json({ success: false, message: "Email đã được sử dụng bởi người dùng khác" });
      }
    }

    // Xử lý thay đổi mật khẩu
    let hashedNewPassword = null;
    if (newPassword) {
      // Kiểm tra mật khẩu hiện tại
      if (!currentPassword) {
        return res.json({ success: false, message: "Vui lòng nhập mật khẩu hiện tại" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.json({ success: false, message: "Mật khẩu hiện tại không đúng" });
      }

      // Kiểm tra độ dài mật khẩu mới
      if (newPassword.length < 8) {
        return res.json({ success: false, message: "Mật khẩu mới phải có ít nhất 8 ký tự" });
      }

      // Băm mật khẩu mới
      const salt = await bcrypt.genSalt(10);
      hashedNewPassword = await bcrypt.hash(newPassword, salt);
    }

    // Chuẩn bị dữ liệu cập nhật
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone_number !== undefined) updateData.phone_number = phone_number;
    if (gender) updateData.gender = gender;
    if (address !== undefined) updateData.address = address;
    if (hashedNewPassword) updateData.password = hashedNewPassword;

    // Cập nhật thông tin người dùng
    const updatedUser = await userModel
      .findByIdAndUpdate(userId, updateData, { new: true, runValidators: true })
      .select("-password -cartData");

    if (!updatedUser) {
      return res.json({ success: false, message: "Không thể cập nhật thông tin" });
    }

    res.json({
      success: true,
      message: "Cập nhật thông tin thành công",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API để người dùng lấy thông tin profile của mình
const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId; 

    const user = await userModel.findById(userId).select("-password -cartData");

    if (!user) {
      return res.json({ success: false, message: "Không tìm thấy người dùng" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getCurrentUser = async (req, res) => {
    const userId = req.userId;
    console.log("userIdfsdfd");
  try {

    const user = await userModel.findById(userId).select(
    "-password -createdAt -updatedAt"
  );
//   if (!user) {
//     throw new Error("Không tìm thấy người dùng");
//   }
    
    
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};


export {
  loginUser,
  registerUser,
  adminLogin,
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserProfile,
  getUserProfile,
  getCurrentUser,
};
