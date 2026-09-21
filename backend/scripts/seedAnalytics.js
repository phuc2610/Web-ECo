import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });
import { connectDB } from "../config/mongodb.js";
import productModel from "../models/productModel.js";
import { userModel } from "../models/userModel.js";
import customerActivityModel from "../models/customerActivityModel.js";

const seed = async () => {
  await connectDB();
  console.log("Connected to MongoDB");

  const products = await productModel.find({});
  console.log(`Found ${products.length} products`);

  if (products.length === 0) {
    console.log("No products found to seed analytics.");
    process.exit(0);
  }

  // 1. Cập nhật lượt xem mẫu phong phú cho các sản phẩm
  const viewCounts = [148, 126, 98, 85, 74, 62, 55, 49, 42, 38, 31, 28, 24, 19, 15];
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const views = i < viewCounts.length ? viewCounts[i] : Math.floor(Math.random() * 20) + 5;
    await productModel.findByIdAndUpdate(p._id, { views });
  }
  console.log("Updated product view counts!");

  // 2. Tạo hoặc làm giàu dữ liệu Customer Activities mẫu
  const existingActivities = await customerActivityModel.countDocuments();
  if (existingActivities < 5) {
    const users = await userModel.find({}).limit(5);

    const mockActivities = [
      {
        sessionId: "sess_user_hoangnam_01",
        customerName: users[0]?.name || "Nguyễn Hoàng Nam",
        customerEmail: users[0]?.email || "hoangnam.tech@gmail.com",
        customerPhone: users[0]?.phone_number || "0912 345 678",
        userId: users[0]?._id || null,
        isRegistered: true,
        preferredCategory: "Điện thoại",
        preferredBrand: "Apple",
        viewedProducts: [
          {
            productId: products[0]?._id,
            productName: products[0]?.name || "iPhone 16 Pro Max 256GB",
            category: "Điện thoại",
            brand: "Apple",
            price: products[0]?.sellingPrice || 32990000,
            image: products[0]?.image?.[0] || "",
            viewCount: 6,
            lastViewedAt: new Date(Date.now() - 1000 * 60 * 15),
          },
          {
            productId: products[1]?._id,
            productName: products[1]?.name || "iPhone 16 Plus 128GB",
            category: "Điện thoại",
            brand: "Apple",
            price: products[1]?.sellingPrice || 24990000,
            image: products[1]?.image?.[0] || "",
            viewCount: 3,
            lastViewedAt: new Date(Date.now() - 1000 * 60 * 45),
          },
        ],
        searchKeywords: [
          { keyword: "iphone 16 pro max", count: 4, lastSearchedAt: new Date() },
          { keyword: "apple care", count: 1, lastSearchedAt: new Date() },
        ],
        lastActive: new Date(Date.now() - 1000 * 60 * 10),
      },
      {
        sessionId: "sess_user_thanhhang_02",
        customerName: users[1]?.name || "Trần Thanh Hằng",
        customerEmail: users[1]?.email || "thanhhang.designer@gmail.com",
        customerPhone: users[1]?.phone_number || "0988 765 432",
        userId: users[1]?._id || null,
        isRegistered: true,
        preferredCategory: "Laptop",
        preferredBrand: "Apple",
        viewedProducts: [
          {
            productId: products[2]?._id || products[0]?._id,
            productName: products[2]?.name || "MacBook Pro M3 Max 16 inch",
            category: "Laptop",
            brand: "Apple",
            price: products[2]?.sellingPrice || 59990000,
            image: products[2]?.image?.[0] || "",
            viewCount: 8,
            lastViewedAt: new Date(Date.now() - 1000 * 60 * 30),
          },
        ],
        searchKeywords: [
          { keyword: "macbook pro m3", count: 5, lastSearchedAt: new Date() },
          { keyword: "ram 36gb", count: 2, lastSearchedAt: new Date() },
        ],
        lastActive: new Date(Date.now() - 1000 * 60 * 25),
      },
      {
        sessionId: "sess_guest_8923a1bc",
        customerName: "Khách vãng lai (Hà Nội)",
        customerEmail: "",
        customerPhone: "",
        userId: null,
        isRegistered: false,
        preferredCategory: "Laptop",
        preferredBrand: "Asus",
        viewedProducts: [
          {
            productId: products[3]?._id || products[0]?._id,
            productName: products[3]?.name || "Asus ROG Strix G16 Gaming",
            category: "Laptop",
            brand: "Asus",
            price: products[3]?.sellingPrice || 38490000,
            image: products[3]?.image?.[0] || "",
            viewCount: 4,
            lastViewedAt: new Date(Date.now() - 1000 * 60 * 60),
          },
        ],
        searchKeywords: [
          { keyword: "laptop gaming rtx 4060", count: 3, lastSearchedAt: new Date() },
          { keyword: "asus rog", count: 2, lastSearchedAt: new Date() },
        ],
        lastActive: new Date(Date.now() - 1000 * 60 * 50),
      },
      {
        sessionId: "sess_guest_90b4df22",
        customerName: "Khách vãng lai (TP.HCM)",
        customerEmail: "",
        customerPhone: "",
        userId: null,
        isRegistered: false,
        preferredCategory: "Điện thoại",
        preferredBrand: "Samsung",
        viewedProducts: [
          {
            productId: products[4]?._id || products[0]?._id,
            productName: products[4]?.name || "Samsung Galaxy S24 Ultra",
            category: "Điện thoại",
            brand: "Samsung",
            price: products[4]?.sellingPrice || 28990000,
            image: products[4]?.image?.[0] || "",
            viewCount: 5,
            lastViewedAt: new Date(Date.now() - 1000 * 60 * 90),
          },
        ],
        searchKeywords: [
          { keyword: "galaxy s24 ultra", count: 4, lastSearchedAt: new Date() },
          { keyword: "samsung ai", count: 1, lastSearchedAt: new Date() },
        ],
        lastActive: new Date(Date.now() - 1000 * 60 * 80),
      },
    ];

    await customerActivityModel.insertMany(mockActivities);
    console.log("Seeded mock customer activities successfully!");
  } else {
    console.log("Customer activities already exist, skipping activity seed.");
  }

  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
