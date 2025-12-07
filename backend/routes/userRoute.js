import express from "express";
import {
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
} from "../controllers/userController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { auth as authUser } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);

// route cho user
userRouter.get("/profile", authUser, getUserProfile);
userRouter.put("/profile", authUser, updateUserProfile);
userRouter.get("/current", authUser, getCurrentUser);

// route admin
userRouter.post("/admin/users", adminAuth, createUser);
userRouter.get("/admin/users", adminAuth, getAllUsers);
userRouter.get("/admin/users/:userId", adminAuth, getUserById);
userRouter.put("/admin/users/:userId", adminAuth, updateUser);
userRouter.delete("/admin/users/:userId", adminAuth, deleteUser);

export default userRouter;
