import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/mongodb.js";
import { connectCloudinary } from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import statisticsRouter from "./routes/statisticsRoute.js";
import chatRouter from "./routes/chatRoute.js";
import reviewRouter from "./routes/reviewRoute.js";
import wishlistRouter from "./routes/wishlistRoute.js";
import compareRouter from "./routes/compareRoute.js";
import couponRouter from "./routes/couponRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import analyticsRouter from "./routes/analyticsRoute.js";

// App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// middlewares
app.use(cors());
app.use(express.json());

// api andpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/statistics", statisticsRouter);
app.use("/api/chat", chatRouter);
app.use("/api/review", reviewRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/compare", compareRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/analytics", analyticsRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log("Server started on PORT : " + port);
});
