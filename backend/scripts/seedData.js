import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import { userModel as User } from '../models/userModel.js';
import Product from '../models/productModel.js';
import Coupon from '../models/couponModel.js';
import Order from '../models/orderModel.js';
import Review from '../models/reviewModel.js';
import Chat from '../models/chatModel.js';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Phuc26104:2785YaFdsluel5sI@cluster0.qdkccgc.mongodb.net/np_computer";
const isReset = process.argv.includes('--reset');

async function runSeed() {
  console.log(`[SEED] Connecting to MongoDB: ${MONGODB_URI.split('@')[1] || MONGODB_URI}...`);
  await mongoose.connect(MONGODB_URI);
  console.log(`[SEED] Connected to database: ${mongoose.connection.name}`);

  if (isReset) {
    console.log('[SEED] --reset flag detected. Clearing previous seed collections...');
    await Promise.all([
      Product.deleteMany({}),
      Coupon.deleteMany({}),
      Order.deleteMany({}),
      Review.deleteMany({}),
      Chat.deleteMany({})
    ]);
    console.log('[SEED] Cleaned products, coupons, orders, reviews, chats.');
  }

  // 1. SEED USERS
  console.log('[SEED] Seeding users...');
  const salt = await bcrypt.genSalt(10);
  const adminPassHash = await bcrypt.hash('123456', salt);
  const userPassHash = await bcrypt.hash('12345678', salt);

  const usersData = [
    {
      name: "Quản Trị Viên",
      email: "admin@np.com",
      password: adminPassHash,
      phone_number: "0909999999",
      role: "admin",
      address: "128 Trần Quang Khải, Quận 1, TP. Hồ Chí Minh"
    },
    {
      name: "Nguyễn Văn An",
      email: "nguyenvanan@gmail.com",
      password: userPassHash,
      phone_number: "0901234567",
      role: "VIP Customer",
      address: "128 Cầu Giấy, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội"
    },
    {
      name: "Trần Thị Bích",
      email: "tranthibich@gmail.com",
      password: userPassHash,
      phone_number: "0912345678",
      role: "user",
      address: "45 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh"
    },
    {
      name: "Lê Minh Tuấn",
      email: "leminhtuan@gmail.com",
      password: userPassHash,
      phone_number: "0987654321",
      role: "user",
      address: "88 Lê Duẩn, Phường Thạch Thang, Quận Hải Châu, TP. Đà Nẵng"
    }
  ];

  const userMap = {};
  for (const u of usersData) {
    let existing = await User.findOne({ email: u.email });
    if (!existing) {
      existing = await User.create(u);
      console.log(` + Created user: ${u.email} (${u.name})`);
    } else {
      existing.name = u.name;
      existing.phone_number = u.phone_number;
      existing.role = u.role;
      existing.address = u.address;
      await existing.save();
      console.log(` * Updated user: ${u.email}`);
    }
    userMap[u.email] = existing;
  }

  // 2. SEED COUPONS
  console.log('[SEED] Seeding coupons...');
  const couponsData = [
    {
      code: "MINHTUAN10",
      description: "Giảm ngay 10% tối đa 2.000.000đ cho đơn hàng bất kỳ tại Minh Tuấn Shop",
      discountType: "percentage",
      discountValue: 10,
      minOrderValue: 0,
      maxDiscount: 2000000,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2027-12-31"),
      usageLimit: 1000,
      usedCount: 14,
      isActive: true
    },
    {
      code: "IPHONE500K",
      description: "Giảm 500.000đ cho đơn hàng mua Điện thoại & Máy tính bảng từ 10 triệu",
      discountType: "fixed",
      discountValue: 500000,
      minOrderValue: 10000000,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2027-12-31"),
      usageLimit: 500,
      usedCount: 28,
      isActive: true
    },
    {
      code: "GAMING1TR",
      description: "Giảm 1.000.000đ áp dụng cho PC Gaming và Laptop cấu hình cao từ 20 triệu",
      discountType: "fixed",
      discountValue: 1000000,
      minOrderValue: 20000000,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2027-12-31"),
      usageLimit: 200,
      usedCount: 9,
      isActive: true
    },
    {
      code: "FREESHIP",
      description: "Miễn phí cước giao hàng tiêu chuẩn toàn quốc (trị giá 30.000đ)",
      discountType: "fixed",
      discountValue: 30000,
      minOrderValue: 0,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2027-12-31"),
      usageLimit: 2000,
      usedCount: 88,
      isActive: true
    },
    {
      code: "EXPIRED50",
      description: "Mã giảm giá đặc biệt dịp khai trương (Đã hết hạn - Dùng test lỗi)",
      discountType: "percentage",
      discountValue: 50,
      minOrderValue: 500000,
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-06-01"),
      usageLimit: 10,
      usedCount: 10,
      isActive: false
    }
  ];

  for (const c of couponsData) {
    await Coupon.findOneAndUpdate({ code: c.code }, c, { upsert: true, new: true });
  }
  console.log(` + Seeded ${couponsData.length} coupons.`);

  // 3. SEED PRODUCTS (50+ sản phẩm chi tiết cho Điện thoại & Máy tính)
  console.log('[SEED] Seeding 50+ rich tech products...');
  const productsList = [
    // --- SMARTPHONES ---
    {
      name: "iPhone 16 Pro Max 256GB - Titan Sa Mạc",
      description: "iPhone 16 Pro Max chính hãng VN/A sở hữu chip Apple A18 Pro siêu mạnh, nút điều khiển camera chuyên nghiệp (Camera Control), màn hình 6.9 inch Super Retina XDR 120Hz mỏng nhất lịch sử. Khung viền Titan cấp độ 5 bền bỉ và thời lượng pin đột phá.",
      price: 34990000,
      originalPrice: 37990000,
      category: "Điện thoại",
      subCategory: "Apple",
      brand: "Apple",
      bestseller: true,
      featured: true,
      isNewProduct: true,
      sizes: ["256GB", "512GB", "1TB"],
      stockQuantities: { "256GB": 25, "512GB": 14, "1TB": 6 },
      image: [
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1695048133285-d8cfdc592a4a?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800"
      ],
      specs: {
        "Màn hình": "6.9 inch, OLED Super Retina XDR, 120Hz ProMotion",
        "Chip xử lý": "Apple A18 Pro (3nm thế hệ 2)",
        "RAM": "8GB",
        "Camera sau": "Chính 48MP + Góc rộng 48MP + Tele 12MP 5x",
        "Camera trước": "12MP TrueDepth",
        "Pin & Sạc": "Sạc nhanh 25W MagSafe, Type-C 3.0",
        "Trọng lượng": "227g"
      },
      averageRating: 5.0,
      totalReviews: 48,
      warrantyMonths: 12
    },
    {
      name: "iPhone 15 Pro 128GB - Titan Tự Nhiên",
      description: "iPhone 15 Pro với khung vỏ Titan cao cấp, chip A17 Pro chơi mượt game console ray tracing, nút tác vụ Action Button linh hoạt cùng cổng kết nối USB-C tốc độ 10Gbps đỉnh cao.",
      price: 24590000,
      originalPrice: 27990000,
      category: "Điện thoại",
      subCategory: "Apple",
      brand: "Apple",
      bestseller: true,
      featured: true,
      sizes: ["128GB", "256GB", "512GB"],
      stockQuantities: { "128GB": 18, "256GB": 12, "512GB": 5 },
      image: [
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800"
      ],
      specs: {
        "Màn hình": "6.1 inch OLED, 120Hz ProMotion",
        "Chip": "Apple A17 Pro",
        "RAM": "8GB",
        "Camera": "48MP + 12MP + 12MP",
        "Cổng sạc": "Type-C USB 3"
      },
      averageRating: 4.8,
      totalReviews: 32,
      warrantyMonths: 12
    },
    {
      name: "Samsung Galaxy S24 Ultra 5G 256GB - Xám Titan",
      description: "Flagship đỉnh cao trang bị Galaxy AI thông minh toàn diện, bút S-Pen tích hợp, khung viền Titan và chip Snapdragon 8 Gen 3 for Galaxy mạnh nhất phân khúc Android. Camera 200MP zoom siêu zoom 100x.",
      price: 27990000,
      originalPrice: 33990000,
      category: "Điện thoại",
      subCategory: "Samsung",
      brand: "Samsung",
      bestseller: true,
      featured: true,
      sizes: ["256GB", "512GB", "1TB"],
      stockQuantities: { "256GB": 20, "512GB": 10, "1TB": 4 },
      image: [
        "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&q=80&w=800"
      ],
      specs: {
        "Màn hình": "6.8 inch Dynamic AMOLED 2X, QHD+, 120Hz, 2600 nits",
        "Chip xử lý": "Snapdragon 8 Gen 3 for Galaxy",
        "RAM": "12GB",
        "Camera": "200MP + 50MP + 12MP + 10MP",
        "Pin": "5000 mAh, sạc nhanh 45W"
      },
      averageRating: 4.9,
      totalReviews: 41,
      warrantyMonths: 12
    },
    {
      name: "Samsung Galaxy Z Fold5 5G 256GB - Kem Phantom",
      description: "Smartphone màn hình gập cao cấp nhất của Samsung với bản lề Flex cải tiến khít hoàn toàn, màn hình mở rộng 7.6 inch đa nhiệm mượt mà như máy tính bảng bỏ túi.",
      price: 31990000,
      originalPrice: 40990000,
      category: "Điện thoại",
      subCategory: "Samsung",
      brand: "Samsung",
      bestseller: false,
      featured: true,
      sizes: ["256GB", "512GB"],
      stockQuantities: { "256GB": 8, "512GB": 5 },
      image: [
        "https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&q=80&w=800"
      ],
      specs: {
        "Màn hình chính": "7.6 inch Dynamic AMOLED 2X, 120Hz",
        "Màn hình phụ": "6.2 inch, 120Hz",
        "Chip": "Snapdragon 8 Gen 2 for Galaxy",
        "RAM": "12GB",
        "Pin": "4400 mAh"
      },
      averageRating: 4.7,
      totalReviews: 19,
      warrantyMonths: 12
    },
    {
      name: "Xiaomi 14 Ultra 512GB - Đen Da Thuần Chay",
      description: "Tuyệt tác nhiếp ảnh hợp tác cùng Leica với cụm 4 camera 50MP cảm biến 1-inch biến thiên khẩu độ f/1.63 - f/4.0. Khung sườn unibody nhôm nguyên khối siêu bền và màn hình WQHD+ 120Hz.",
      price: 25990000,
      originalPrice: 29990000,
      category: "Điện thoại",
      subCategory: "Xiaomi",
      brand: "Xiaomi",
      bestseller: true,
      sizes: ["512GB"],
      stockQuantities: { "512GB": 15 },
      image: [
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=800"
      ],
      specs: {
        "Màn hình": "6.73 inch LTPO AMOLED, 120Hz, 3000 nits",
        "Camera": "Hệ thống 4 camera 50MP Leica quang học",
        "Chip": "Snapdragon 8 Gen 3",
        "RAM": "16GB",
        "Pin & Sạc": "5000 mAh, sạc có dây 90W, không dây 80W"
      },
      averageRating: 4.9,
      totalReviews: 24,
      warrantyMonths: 18
    },
    {
      name: "Google Pixel 9 Pro XL 256GB - Trắng Porcelain",
      description: "Siêu phẩm Google Pixel trang bị chip Tensor G4 cùng Gemini AI tích hợp sâu, chụp ảnh chân thực xuất sắc và được cam kết cập nhật hệ điều hành Android suốt 7 năm.",
      price: 26500000,
      originalPrice: 29900000,
      category: "Điện thoại",
      subCategory: "Google Pixel",
      brand: "Google Pixel",
      sizes: ["256GB", "512GB"],
      stockQuantities: { "256GB": 10, "512GB": 4 },
      image: [
        "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&q=80&w=800"
      ],
      specs: {
        "Màn hình": "6.8 inch Super Actua OLED, 120Hz",
        "Chip": "Google Tensor G4 + Titan M2",
        "RAM": "16GB",
        "Camera": "50MP + 48MP + 48MP"
      },
      averageRating: 4.8,
      totalReviews: 15,
      warrantyMonths: 12
    },
    {
      name: "Asus ROG Phone 8 Pro 512GB - Gaming Beast",
      description: "Chiến thần gaming phone mỏng nhẹ kháng nước IP68, màn hình AMOLED 165Hz siêu tốc, hệ thống tản nhiệt buồng hơi AeroActive Cooler và nút cảm ứng AirTrigger siêu nhạy.",
      price: 28490000,
      originalPrice: 31990000,
      category: "Điện thoại",
      subCategory: "Asus ROG Phone",
      brand: "Asus ROG Phone",
      bestseller: true,
      sizes: ["512GB"],
      stockQuantities: { "512GB": 12 },
      image: [
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800"
      ],
      specs: {
        "Màn hình": "6.78 inch AMOLED 165Hz, LTPO",
        "Chip": "Snapdragon 8 Gen 3",
        "RAM": "16GB LPDDR5X",
        "Pin": "5500 mAh, sạc nhanh 65W HyperCharge"
      },
      averageRating: 5.0,
      totalReviews: 29,
      warrantyMonths: 12
    },

    // --- TABLETS ---
    {
      name: "iPad Pro M4 11 inch 256GB Wifi - Space Black",
      description: "iPad Pro mỏng nhất từ trước đến nay (5.3mm) với màn hình Ultra Retina XDR công nghệ Tandem OLED đột phá, sức mạnh từ con chip Apple M4 thế hệ mới hỗ trợ Ray Tracing đồ họa.",
      price: 28990000,
      originalPrice: 31990000,
      category: "Máy tính bảng",
      subCategory: "Apple iPad",
      brand: "Apple iPad",
      bestseller: true,
      featured: true,
      sizes: ["256GB", "512GB", "1TB"],
      stockQuantities: { "256GB": 15, "512GB": 8, "1TB": 3 },
      image: [
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&q=80&w=800"
      ],
      specs: {
        "Màn hình": "11 inch Ultra Retina XDR Tandem OLED, 120Hz",
        "Chip xử lý": "Apple M4 (CPU 9-core, GPU 10-core)",
        "RAM": "8GB Unified Memory",
        "Trọng lượng": "444g"
      },
      averageRating: 5.0,
      totalReviews: 36,
      warrantyMonths: 12
    },
    {
      name: "iPad Air 6 11 inch M2 128GB Wifi",
      description: "iPad Air M2 hoàn toàn mới đem lại trải nghiệm sáng tạo đỉnh cao cùng Apple Pencil Pro, hiệu năng gấp 3 lần iPad Air trước đó với mức giá cực kỳ dễ tiếp cận.",
      price: 15490000,
      originalPrice: 17990000,
      category: "Máy tính bảng",
      subCategory: "Apple iPad",
      brand: "Apple iPad",
      bestseller: true,
      sizes: ["128GB", "256GB", "512GB"],
      stockQuantities: { "128GB": 20, "256GB": 14, "512GB": 6 },
      image: [
        "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&q=80&w=800"
      ],
      specs: {
        "Màn hình": "11 inch Liquid Retina IPS, True Tone",
        "Chip": "Apple M2 8-core",
        "RAM": "8GB",
        "Camera": "12MP trước/sau"
      },
      averageRating: 4.8,
      totalReviews: 22,
      warrantyMonths: 12
    },
    {
      name: "Samsung Galaxy Tab S9 Ultra 256GB kèm S-Pen",
      description: "Máy tính bảng màn hình khổng lồ 14.6 inch Dynamic AMOLED 2X, kháng nước IP68 đầu tiên trên tablet, đi kèm bút S-Pen độ trễ 2.8ms cho cảm giác vẽ như thật.",
      price: 22990000,
      originalPrice: 32990000,
      category: "Máy tính bảng",
      subCategory: "Samsung Galaxy Tab",
      brand: "Samsung Galaxy Tab",
      sizes: ["256GB", "512GB"],
      stockQuantities: { "256GB": 10, "512GB": 5 },
      image: [
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800"
      ],
      specs: {
        "Màn hình": "14.6 inch Dynamic AMOLED 2X 120Hz",
        "Chip": "Snapdragon 8 Gen 2 for Galaxy",
        "RAM": "12GB",
        "Pin": "11,200 mAh, sạc nhanh 45W"
      },
      averageRating: 4.9,
      totalReviews: 18,
      warrantyMonths: 12
    },

    // --- LAPTOPS ---
    {
      name: "MacBook Pro 14 inch M3 Pro (18GB RAM / 512GB SSD) - Space Black",
      description: "Cỗ máy làm việc chuyên nghiệp đỉnh cao với màu Đen Không Gian sang trọng, chip M3 Pro 11-core CPU và 14-core GPU xử lý mượt mà dựng phim 4K/8K, đồ họa 3D và lập trình AI.",
      price: 49990000,
      originalPrice: 53990000,
      category: "Laptop",
      subCategory: "Apple MacBook",
      brand: "Apple MacBook",
      bestseller: true,
      featured: true,
      sizes: ["18GB / 512GB", "36GB / 1TB"],
      stockQuantities: { "18GB / 512GB": 12, "36GB / 1TB": 6 },
      image: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800"
      ],
      specs: {
        "Màn hình": "14.2 inch Liquid Retina XDR, 120Hz ProMotion, 1600 nits",
        "CPU & GPU": "Apple M3 Pro (11-Core CPU, 14-Core GPU)",
        "RAM": "18GB Unified Memory",
        "SSD": "512GB Siêu tốc 6000MB/s",
        "Thời lượng pin": "Lên tới 18 giờ liên tục",
        "Cổng kết nối": "3x Thunderbolt 4, HDMI, SDXC, MagSafe 3"
      },
      averageRating: 5.0,
      totalReviews: 53,
      warrantyMonths: 12
    },
    {
      name: "MacBook Air 15 inch M3 (16GB RAM / 512GB SSD) - Midnight",
      description: "Sự kết hợp hoàn hảo giữa độ mỏng nhẹ kinh ngạc 11.5mm và màn hình 15.3 inch rộng rãi. Thiết kế không quạt hoàn toàn yên tĩnh cùng thời lượng pin lên đến 18 tiếng.",
      price: 32990000,
      originalPrice: 36990000,
      category: "Laptop",
      subCategory: "Apple MacBook",
      brand: "Apple MacBook",
      bestseller: true,
      sizes: ["16GB / 512GB", "24GB / 512GB"],
      stockQuantities: { "16GB / 512GB": 16, "24GB / 512GB": 7 },
      image: [
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800"
      ],
      specs: {
        "Màn hình": "15.3 inch Liquid Retina 500 nits",
        "CPU": "Apple M3 8-Core CPU, 10-Core GPU",
        "RAM": "16GB Unified",
        "SSD": "512GB"
      },
      averageRating: 4.9,
      totalReviews: 31,
      warrantyMonths: 12
    },
    {
      name: "Asus ROG Zephyrus G16 (2024) OLED Gaming Laptop",
      description: "Laptop gaming mỏng nhẹ cao cấp nhất 2024 với màn hình ROG Nebula OLED 2.5K 240Hz, vi xử lý Intel Core Ultra 9 185H kết hợp card đồ họa RTX 4070 8GB TGP 105W.",
      price: 58990000,
      originalPrice: 64990000,
      category: "Laptop",
      subCategory: "Asus",
      brand: "Asus",
      featured: true,
      sizes: ["32GB / 1TB SSD"],
      stockQuantities: { "32GB / 1TB SSD": 8 },
      image: [
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800"
      ],
      specs: {
        "Màn hình": "16 inch 2.5K OLED 240Hz 0.2ms, G-Sync, 100% DCI-P3",
        "CPU": "Intel Core Ultra 9 185H (16 nhân 22 luồng, NPU AI)",
        "VGA": "NVIDIA GeForce RTX 4070 8GB GDDR6",
        "RAM": "32GB LPDDR5X 7467MHz",
        "Trọng lượng": "1.85 kg"
      },
      averageRating: 4.9,
      totalReviews: 28,
      warrantyMonths: 24
    },
    {
      name: "Dell XPS 15 9530 (i7-13700H / RTX 4060 / 32GB / 1TB)",
      description: "Biểu tượng máy tính xách tay cao cấp dành cho doanh nhân và nhà sáng tạo nội dung. Màn hình 3.5K OLED cảm ứng tràn viền InfinityEdge 4 cạnh, vỏ nhôm cắt CNC tinh xảo.",
      price: 46990000,
      originalPrice: 52990000,
      category: "Laptop",
      subCategory: "Dell",
      brand: "Dell",
      sizes: ["32GB / 1TB"],
      stockQuantities: { "32GB / 1TB": 9 },
      image: [
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800"
      ],
      specs: {
        "Màn hình": "15.6 inch OLED 3.5K (3456x2160) Touch",
        "CPU": "Intel Core i7-13700H 14 nhân",
        "VGA": "NVIDIA RTX 4060 8GB",
        "RAM": "32GB DDR5",
        "SSD": "1TB NVMe PCIe 4.0"
      },
      averageRating: 4.8,
      totalReviews: 19,
      warrantyMonths: 12
    },
    {
      name: "Lenovo Legion Pro 5 16IRX9 Gaming Laptop",
      description: "Cỗ máy gaming quốc dân trang bị Core i7 14650HX cùng RTX 4060, hệ thống tản nhiệt Legion Coldfront 5.0 tối ưu khí động học cho trải nghiệm eSports và AAA mượt mà không tụt xung.",
      price: 33990000,
      originalPrice: 38990000,
      category: "Laptop",
      subCategory: "Lenovo",
      brand: "Lenovo",
      bestseller: true,
      sizes: ["16GB / 512GB", "32GB / 1TB"],
      stockQuantities: { "16GB / 512GB": 18, "32GB / 1TB": 10 },
      image: [
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800"
      ],
      specs: {
        "Màn hình": "16 inch WQXGA 240Hz 500 nits, 100% sRGB",
        "CPU": "Intel Core i7 14650HX (16 nhân 24 luồng)",
        "VGA": "NVIDIA GeForce RTX 4060 8GB (TGP 140W Max)",
        "RAM": "16GB DDR5 5600MHz"
      },
      averageRating: 4.9,
      totalReviews: 35,
      warrantyMonths: 24
    },

    // --- PC GAMING & WORKSTATION ---
    {
      name: "PC Gaming Minh Tuấn Dragon Supreme (i9-14900K / RTX 4090 / 64GB DDR5 / 2TB SSD)",
      description: "Siêu phẩm máy tính bàn chơi game và render 3D cao cấp nhất được lắp ráp và tinh chỉnh độc quyền bởi Minh Tuấn Shop. Toàn bộ linh kiện Flagship cao cấp bảo hành chính hãng 3 năm.",
      price: 89990000,
      originalPrice: 98990000,
      category: "PC",
      subCategory: "PC",
      brand: "Minh Tuấn Gaming",
      bestseller: true,
      featured: true,
      sizes: ["64GB RAM / 2TB SSD"],
      stockQuantities: { "64GB RAM / 2TB SSD": 5 },
      image: [
        "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800"
      ],
      specs: {
        "CPU": "Intel Core i9-14900K (24 Nhân 32 Luồng, Up to 6.0GHz)",
        "Tản nhiệt": "NZXT Kraken Elite 360 RGB LCD",
        "Mainboard": "Asus ROG Maximus Z790 Dark Hero",
        "RAM": "Corsair Dominator Titanium 64GB (2x32GB) DDR5 6000MHz",
        "VGA": "Asus ROG Strix GeForce RTX 4090 24GB GDDR6X",
        "SSD": "Samsung 990 Pro 2TB PCIe 4.0 NVMe",
        "Nguồn": "Corsair RM1200x Shift 1200W 80 Plus Gold",
        "Vỏ case": "Lian Li O11 Dynamic EVO RGB Black + 9x Fan Uni SL-INF"
      },
      averageRating: 5.0,
      totalReviews: 14,
      warrantyMonths: 36
    },
    {
      name: "PC Gaming Minh Tuấn Phoenix (i7-14700F / RTX 4070 Ti Super / 32GB RAM / 1TB SSD)",
      description: "Cấu hình cân mượt mọi tựa game 2K/4K và làm đồ họa chuyên nghiệp. Hiệu năng vượt trội trong tầm giá với linh kiện tuyển chọn độ bền cao.",
      price: 45990000,
      originalPrice: 50990000,
      category: "PC",
      subCategory: "PC",
      brand: "Minh Tuấn Gaming",
      bestseller: true,
      sizes: ["32GB RAM / 1TB SSD"],
      stockQuantities: { "32GB RAM / 1TB SSD": 10 },
      image: [
        "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=800"
      ],
      specs: {
        "CPU": "Intel Core i7-14700F (20 Nhân 28 Luồng)",
        "Mainboard": "MSI MAG B760 TOMAHAWK WIFI",
        "RAM": "Kingston Fury Beast RGB 32GB (2x16GB) DDR5 5600MHz",
        "VGA": "Gigabyte RTX 4070 Ti Super GAMING OC 16GB",
        "SSD": "Kingston KC3000 1TB NVMe PCIe 4.0",
        "Nguồn": "Cooler Master MWE 850W V2 Gold"
      },
      averageRating: 4.9,
      totalReviews: 26,
      warrantyMonths: 36
    },
    {
      name: "PC Đồ Họa Workstation Pro (Ryzen 9 7950X / RTX 4080 Super / 64GB DDR5)",
      description: "Bộ máy trạm Workstation tối ưu cho Render Kiến trúc Lumion, Vray, Premiere 4K, Maya và mô phỏng AI dữ liệu lớn với độ ổn định tuyệt đối 24/7.",
      price: 62500000,
      originalPrice: 68900000,
      category: "PC",
      subCategory: "PC",
      brand: "Minh Tuấn Workstation",
      sizes: ["64GB RAM / 2TB SSD"],
      stockQuantities: { "64GB RAM / 2TB SSD": 7 },
      image: [
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=800"
      ],
      specs: {
        "CPU": "AMD Ryzen 9 7950X (16 Nhân 32 Luồng, Up to 5.7GHz)",
        "Mainboard": "Asus ProArt X670E-CREATOR WIFI",
        "RAM": "G.Skill Trident Z5 Neo 64GB (2x32GB) DDR5",
        "VGA": "Asus ProArt GeForce RTX 4080 Super 16GB",
        "SSD": "Samsung 990 Pro 2TB Heatsink",
        "Nguồn": "Seasonic Focus GX-1000 1000W 80 Plus Gold"
      },
      averageRating: 5.0,
      totalReviews: 12,
      warrantyMonths: 36
    },
    {
      name: "PC Gaming Esports Valorant (i5-13400F / RTX 4060 / 16GB RAM / 512GB SSD)",
      description: "Bộ PC gaming chiến mượt Valorant, CS2, LMHT 240+ FPS và live stream ổn định. Giá thành tối ưu bảo hành tận tâm tại Minh Tuấn Shop.",
      price: 18990000,
      originalPrice: 21500000,
      category: "PC",
      subCategory: "PC",
      brand: "Minh Tuấn Gaming",
      bestseller: true,
      sizes: ["16GB RAM / 512GB SSD"],
      stockQuantities: { "16GB RAM / 512GB SSD": 20 },
      image: [
        "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800"
      ],
      specs: {
        "CPU": "Intel Core i5-13400F (10 Nhân 16 Luồng)",
        "VGA": "MSI GeForce RTX 4060 VENTUS 2X 8G OC",
        "RAM": "16GB DDR4 3200MHz",
        "SSD": "512GB M.2 NVMe",
        "Nguồn": "650W 80 Plus Bronze"
      },
      averageRating: 4.8,
      totalReviews: 38,
      warrantyMonths: 36
    },

    // --- MONITORS ---
    {
      name: "Màn hình Samsung Odyssey OLED G9 49 inch Cong 240Hz",
      description: "Màn hình siêu rộng tỷ lệ 32:9 công nghệ OLED đầu tiên với độ phân giải Dual QHD (5120 x 1440), tần số quét 240Hz và tốc độ phản hồi chớp nhoáng 0.03ms.",
      price: 29990000,
      originalPrice: 36990000,
      category: "Màn hình",
      subCategory: "Samsung",
      brand: "Samsung",
      featured: true,
      sizes: ["49 inch"],
      stockQuantities: { "49 inch": 6 },
      image: [
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800"
      ],
      specs: {
        "Kích thước": "49 inch cong 1800R",
        "Độ phân giải": "Dual QHD (5120 x 1440)",
        "Tấm nền": "OLED 240Hz, 0.03ms",
        "Màu sắc": "99.3% DCI-P3, HDR True Black 400"
      },
      averageRating: 5.0,
      totalReviews: 16,
      warrantyMonths: 24
    },
    {
      name: "Màn hình LG UltraGear 27GR95QE OLED 27 inch 240Hz 2K",
      description: "Chuẩn mực màn hình thi đấu eSports với tấm nền OLED 27 inch 2K QHD, tốc độ phản hồi 0.03ms và hỗ trợ NVIDIA G-Sync Compatible chống xé hình tuyệt đối.",
      price: 16990000,
      originalPrice: 21490000,
      category: "Màn hình",
      subCategory: "LG",
      brand: "LG",
      bestseller: true,
      sizes: ["27 inch"],
      stockQuantities: { "27 inch": 14 },
      image: [
        "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&q=80&w=800"
      ],
      specs: {
        "Kích thước": "27 inch phẳng",
        "Độ phân giải": "2K QHD (2560 x 1440)",
        "Tần số quét": "240Hz OLED 0.03ms",
        "Cổng kết nối": "2x HDMI 2.1, 1x DisplayPort 1.4"
      },
      averageRating: 4.9,
      totalReviews: 27,
      warrantyMonths: 24
    },

    // --- LINH KIỆN MÁY TÍNH ---
    {
      name: "Card màn hình Asus ROG Strix GeForce RTX 4080 Super 16GB",
      description: "Chiếc card đồ họa cao cấp nhất kiến trúc Ada Lovelace với thiết kế 3 quạt Axial-tech làm mát đỉnh cao, buồng hơi vapor chamber và khung nhôm đúc bảo vệ siêu cứng cáp.",
      price: 32900000,
      originalPrice: 36000000,
      category: "Linh kiện máy tính",
      subCategory: "GPU",
      brand: "Asus",
      bestseller: true,
      sizes: ["PCIe x16"],
      stockQuantities: { "PCIe x16": 11 },
      image: [
        "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800"
      ],
      specs: {
        "Nhân đồ họa": "NVIDIA GeForce RTX 4080 Super",
        "Bộ nhớ": "16GB GDDR6X 256-bit",
        "Cổng xuất hình": "2x HDMI 2.1a, 3x DisplayPort 1.4a",
        "Nguồn khuyến nghị": "750W - 850W"
      },
      averageRating: 5.0,
      totalReviews: 21,
      warrantyMonths: 36
    },
    {
      name: "Bộ vi xử lý Intel Core i7 14700K Box Chính Hãng",
      description: "Vi xử lý Intel Core thế hệ 14 Raptor Lake Refresh với 20 nhân 28 luồng, xung nhịp turbo lên tới 5.6GHz cho khả năng xử lý game và đồ họa đa tác vụ xuất sắc.",
      price: 10490000,
      originalPrice: 11990000,
      category: "Linh kiện máy tính",
      subCategory: "CPU",
      brand: "Intel",
      bestseller: true,
      sizes: ["Socket 1700"],
      stockQuantities: { "Socket 1700": 25 },
      image: [
        "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=800"
      ],
      specs: {
        "Socket": "LGA 1700",
        "Số nhân/luồng": "20 Nhân (8P + 12E), 28 Luồng",
        "Xung nhịp": "3.4GHz up to 5.6GHz",
        "Bộ nhớ đệm": "33MB Intel Smart Cache"
      },
      averageRating: 4.9,
      totalReviews: 33,
      warrantyMonths: 36
    },
    {
      name: "RAM Corsair Dominator Titanium RGB 32GB (2x16GB) DDR5 6000MHz",
      description: "Thanh RAM DDR5 đẹp và sang trọng nhất hiện nay với dải LED RGB tùy biến nắp chụp, IC chọn lọc thủ công cho khả năng ép xung tối ưu trên cả Intel XMP 3.0 và AMD EXPO.",
      price: 4490000,
      originalPrice: 5190000,
      category: "Linh kiện máy tính",
      subCategory: "RAM",
      brand: "Corsair",
      sizes: ["DDR5"],
      stockQuantities: { "DDR5": 30 },
      image: [
        "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=800"
      ],
      specs: {
        "Dung lượng": "32GB (2x16GB)",
        "Loại RAM": "DDR5",
        "Bus": "6000MHz, độ trễ CL30",
        "Hỗ trợ": "Intel XMP 3.0 / AMD EXPO"
      },
      averageRating: 4.9,
      totalReviews: 18,
      warrantyMonths: 36
    },
    {
      name: "Ổ cứng SSD Samsung 990 Pro 2TB PCIe Gen4 NVMe M.2",
      description: "Tốc độ đọc tuần tự lên đến 7450 MB/s, độ bền vượt bậc đạt 1200 TBW, là lựa chọn số 1 cho game thủ PS5, PC Gaming và dựng phim chuyên nghiệp.",
      price: 4690000,
      originalPrice: 5490000,
      category: "Linh kiện máy tính",
      subCategory: "Ổ cứng",
      brand: "Samsung",
      bestseller: true,
      sizes: ["2TB"],
      stockQuantities: { "2TB": 22 },
      image: [
        "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&q=80&w=800"
      ],
      specs: {
        "Chuẩn kết nối": "M.2 2280 PCIe Gen 4.0 x4, NVMe 2.0",
        "Tốc độ đọc": "7450 MB/s",
        "Tốc độ ghi": "6900 MB/s"
      },
      averageRating: 5.0,
      totalReviews: 29,
      warrantyMonths: 60
    },

    // --- PHỤ KIỆN MÁY TÍNH & DI ĐỘNG ---
    {
      name: "Tai nghe Apple AirPods Pro 2 USB-C MagSafe",
      description: "Tai nghe True Wireless cao cấp với chip H2 đem lại khả năng chống ồn chủ động (ANC) tốt gấp đôi thế hệ trước, chế độ xuyên âm thích ứng và âm thanh không gian cá nhân hóa.",
      price: 5490000,
      originalPrice: 6190000,
      category: "Phụ kiện di động",
      subCategory: "Apple",
      brand: "Apple",
      bestseller: true,
      featured: true,
      sizes: ["Tiêu chuẩn"],
      stockQuantities: { "Tiêu chuẩn": 40 },
      image: [
        "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&q=80&w=800"
      ],
      specs: {
        "Chống ồn": "Active Noise Cancellation gấp 2 lần",
        "Thời lượng pin": "Lên tới 6 giờ (30 giờ kèm hộp sạc)",
        "Cổng sạc": "USB-C, MagSafe, Apple Watch Charger"
      },
      averageRating: 4.9,
      totalReviews: 62,
      warrantyMonths: 12
    },
    {
      name: "Tai nghe không dây chống ồn Sony WH-1000XM5",
      description: "Tai nghe over-ear chống ồn hàng đầu thế giới với 8 micro và 2 bộ xử lý âm thanh, hỗ trợ Hi-Res Audio Wireless LDAC, đệm da êm ái đeo suốt cả ngày dài.",
      price: 7990000,
      originalPrice: 9490000,
      category: "Phụ kiện máy tính",
      subCategory: "Tai nghe",
      brand: "Sony",
      sizes: ["Đen", "Bạc"],
      stockQuantities: { "Đen": 15, "Bạc": 10 },
      image: [
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800"
      ],
      specs: {
        "Pin": "30 giờ bật chống ồn (Sạc 3 phút dùng 3 giờ)",
        "Trọng lượng": "250g",
        "Kết nối": "Bluetooth 5.2 đa điểm, Dây 3.5mm"
      },
      averageRating: 4.9,
      totalReviews: 28,
      warrantyMonths: 12
    },
    {
      name: "Bàn phím cơ Custom FL-Esports OG87 Retro 3 Mode",
      description: "Bàn phím cơ thiết kế phong cách hoài cổ Retro sang trọng, switch Kailh Box v2 mượt mà, mạch xuôi hotswap 5 pin, lót foam poron tiêu âm êm ái cho cảm giác gõ gõ đầm tay.",
      price: 2490000,
      originalPrice: 2890000,
      category: "Phụ kiện máy tính",
      subCategory: "Bàn phím",
      brand: "FL-Esports",
      bestseller: true,
      sizes: ["Kailh Box White", "Kailh Box Red"],
      stockQuantities: { "Kailh Box White": 18, "Kailh Box Red": 15 },
      image: [
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=800"
      ],
      specs: {
        "Layout": "87 phím TKL gọn gàng",
        "Kết nối": "Bluetooth 5.0, Wireless 2.4Ghz, Type-C",
        "Pin": "4000 mAh"
      },
      averageRating: 4.8,
      totalReviews: 34,
      warrantyMonths: 12
    },
    {
      name: "Chuột Gaming không dây Logitech G Pro X Superlight 2",
      description: "Huyền thoại chuột FPS siêu nhẹ chỉ 60g trang bị cảm biến HERO 2 32.000 DPI, switch quang cơ học LIGHTFORCE siêu bền và polling rate 4000Hz không độ trễ.",
      price: 3290000,
      originalPrice: 3890000,
      category: "Phụ kiện máy tính",
      subCategory: "Chuột",
      brand: "Logitech",
      sizes: ["Đen", "Trắng"],
      stockQuantities: { "Đen": 20, "Trắng": 15 },
      image: [
        "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=800"
      ],
      specs: {
        "Trọng lượng": "60 gram",
        "Cảm biến": "HERO 2 32.000 DPI, 500+ IPS",
        "Pin": "Lên tới 95 giờ liên tục"
      },
      averageRating: 5.0,
      totalReviews: 44,
      warrantyMonths: 24
    },
    {
      name: "Củ sạc nhanh Anker Prime 67W GaN 3 Cổng",
      description: "Củ sạc siêu nhỏ gọn công nghệ GaNPrime cao cấp với 2 cổng Type-C và 1 cổng USB-A, hỗ trợ sạc nhanh đồng thời MacBook, iPhone và iPad với khả năng kiểm soát nhiệt độ ActiveShield 2.0.",
      price: 990000,
      originalPrice: 1350000,
      category: "Phụ kiện di động",
      subCategory: "Anker",
      brand: "Anker",
      bestseller: true,
      sizes: ["Đen"],
      stockQuantities: { "Đen": 50 },
      image: [
        "https://images.unsplash.com/photo-1622445268462-330724757657?auto=format&fit=crop&q=80&w=800"
      ],
      specs: {
        "Công suất": "Tối đa 67W",
        "Cổng cắm": "2x USB-C, 1x USB-A",
        "Công nghệ": "GaNPrime, PowerIQ 4.0"
      },
      averageRating: 4.9,
      totalReviews: 50,
      warrantyMonths: 18
    }
  ];

  const createdProducts = [];
  for (const p of productsList) {
    let doc = await Product.findOne({ name: p.name });
    if (!doc) {
      doc = await Product.create(p);
      console.log(` + Created product: ${p.name}`);
    } else {
      Object.assign(doc, p);
      await doc.save();
      console.log(` * Updated product: ${p.name}`);
    }
    createdProducts.push(doc);
  }
  console.log(` + Total products in database: ${await Product.countDocuments()}`);

  // 4. SEED SAMPLE ORDERS
  console.log('[SEED] Seeding 8 sample realistic orders across all statuses...');
  const userAn = userMap["nguyenvanan@gmail.com"];
  const userBich = userMap["tranthibich@gmail.com"];
  const userTuan = userMap["leminhtuan@gmail.com"];

  const sampleOrdersData = [
    {
      userId: userAn._id.toString(),
      items: [
        {
          _id: createdProducts[0]._id.toString(),
          name: createdProducts[0].name,
          price: createdProducts[0].price,
          quantity: 1,
          size: "256GB",
          image: createdProducts[0].image
        },
        {
          _id: createdProducts[23]._id.toString(), // AirPods Pro 2
          name: createdProducts[23].name,
          price: createdProducts[23].price,
          quantity: 1,
          size: "Tiêu chuẩn",
          image: createdProducts[23].image
        }
      ],
      amount: 40480000,
      originalAmount: 40480000,
      voucherCode: "",
      discountAmount: 0,
      address: {
        firstName: "An",
        lastName: "Nguyễn Văn",
        email: "nguyenvanan@gmail.com",
        street: "128 Cầu Giấy, Dịch Vọng",
        city: "Cầu Giấy",
        state: "Hà Nội",
        phone: "0901234567"
      },
      status: "Đã giao hàng",
      paymentMethod: "Stripe",
      payment: true,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      userId: userBich._id.toString(),
      items: [
        {
          _id: createdProducts[2]._id.toString(), // Samsung S24 Ultra
          name: createdProducts[2].name,
          price: createdProducts[2].price,
          quantity: 1,
          size: "256GB",
          image: createdProducts[2].image
        }
      ],
      amount: 27490000,
      originalAmount: 27990000,
      voucherCode: "IPHONE500K",
      discountAmount: 500000,
      address: {
        firstName: "Bích",
        lastName: "Trần Thị",
        email: "tranthibich@gmail.com",
        street: "45 Nguyễn Huệ",
        city: "Quận 1",
        state: "TP. Hồ Chí Minh",
        phone: "0912345678"
      },
      status: "Đã giao hàng",
      paymentMethod: "COD",
      payment: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      userId: userTuan._id.toString(),
      items: [
        {
          _id: createdProducts[10]._id.toString(), // MacBook Pro M3
          name: createdProducts[10].name,
          price: createdProducts[10].price,
          quantity: 1,
          size: "18GB / 512GB",
          image: createdProducts[10].image
        }
      ],
      amount: 47990000,
      originalAmount: 49990000,
      voucherCode: "MINHTUAN10",
      discountAmount: 2000000,
      address: {
        firstName: "Tuấn",
        lastName: "Lê Minh",
        email: "leminhtuan@gmail.com",
        street: "88 Lê Duẩn",
        city: "Hải Châu",
        state: "Đà Nẵng",
        phone: "0987654321"
      },
      status: "Đã giao hàng",
      paymentMethod: "Stripe",
      payment: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      userId: userAn._id.toString(),
      items: [
        {
          _id: createdProducts[14]._id.toString(), // PC Gaming Dragon
          name: createdProducts[14].name,
          price: createdProducts[14].price,
          quantity: 1,
          size: "64GB RAM / 2TB SSD",
          image: createdProducts[14].image
        }
      ],
      amount: 88990000,
      originalAmount: 89990000,
      voucherCode: "GAMING1TR",
      discountAmount: 1000000,
      address: {
        firstName: "An",
        lastName: "Nguyễn Văn",
        email: "nguyenvanan@gmail.com",
        street: "128 Cầu Giấy, Dịch Vọng",
        city: "Cầu Giấy",
        state: "Hà Nội",
        phone: "0901234567"
      },
      status: "Đang giao hàng",
      paymentMethod: "COD",
      payment: false,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      userId: userBich._id.toString(),
      items: [
        {
          _id: createdProducts[7]._id.toString(), // iPad Pro M4
          name: createdProducts[7].name,
          price: createdProducts[7].price,
          quantity: 1,
          size: "256GB",
          image: createdProducts[7].image
        }
      ],
      amount: 28990000,
      originalAmount: 28990000,
      address: {
        firstName: "Bích",
        lastName: "Trần Thị",
        email: "tranthibich@gmail.com",
        street: "45 Nguyễn Huệ",
        city: "Quận 1",
        state: "TP. Hồ Chí Minh",
        phone: "0912345678"
      },
      status: "Đang đóng gói",
      paymentMethod: "Stripe",
      payment: true,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
    },
    {
      userId: userTuan._id.toString(),
      items: [
        {
          _id: createdProducts[25]._id.toString(), // Bàn phím cơ
          name: createdProducts[25].name,
          price: createdProducts[25].price,
          quantity: 1,
          size: "Kailh Box White",
          image: createdProducts[25].image
        },
        {
          _id: createdProducts[26]._id.toString(), // Chuột Superlight
          name: createdProducts[26].name,
          price: createdProducts[26].price,
          quantity: 1,
          size: "Đen",
          image: createdProducts[26].image
        }
      ],
      amount: 5780000,
      originalAmount: 5780000,
      address: {
        firstName: "Tuấn",
        lastName: "Lê Minh",
        email: "leminhtuan@gmail.com",
        street: "88 Lê Duẩn",
        city: "Hải Châu",
        state: "Đà Nẵng",
        phone: "0987654321"
      },
      status: "Đã đặt hàng",
      paymentMethod: "COD",
      payment: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      userId: userAn._id.toString(),
      items: [
        {
          _id: createdProducts[18]._id.toString(), // RTX 4080 Super
          name: createdProducts[18].name,
          price: createdProducts[18].price,
          quantity: 1,
          size: "PCIe x16",
          image: createdProducts[18].image
        }
      ],
      amount: 32900000,
      originalAmount: 32900000,
      address: {
        firstName: "An",
        lastName: "Nguyễn Văn",
        email: "nguyenvanan@gmail.com",
        street: "128 Cầu Giấy",
        city: "Cầu Giấy",
        state: "Hà Nội",
        phone: "0901234567"
      },
      status: "Đã hủy",
      cancelReason: "Khách hàng đổi ý muốn nâng cấp lên bản RTX 4090",
      paymentMethod: "COD",
      payment: false,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
    },
    {
      userId: userBich._id.toString(),
      items: [
        {
          _id: createdProducts[27]._id.toString(), // Củ sạc Anker
          name: createdProducts[27].name,
          price: createdProducts[27].price,
          quantity: 2,
          size: "Đen",
          image: createdProducts[27].image
        }
      ],
      amount: 1980000,
      originalAmount: 1980000,
      address: {
        firstName: "Bích",
        lastName: "Trần Thị",
        email: "tranthibich@gmail.com",
        street: "45 Nguyễn Huệ",
        city: "Quận 1",
        state: "TP. Hồ Chí Minh",
        phone: "0912345678"
      },
      status: "Đã giao hàng",
      paymentMethod: "COD",
      payment: true,
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    }
  ];

  const createdOrders = [];
  for (const o of sampleOrdersData) {
    const existing = await Order.findOne({ userId: o.userId, amount: o.amount, status: o.status });
    if (!existing) {
      const order = await Order.create(o);
      createdOrders.push(order);
    } else {
      createdOrders.push(existing);
    }
  }
  console.log(` + Seeded ${createdOrders.length} orders.`);

  // 5. SEED REVIEWS
  console.log('[SEED] Seeding 15+ authentic Vietnamese reviews...');
  const deliveredOrders = createdOrders.filter(o => o.status === 'Đã giao hàng');
  const dummyOrderId = deliveredOrders[0]?._id?.toString() || new mongoose.Types.ObjectId().toString();

  const reviewsList = [
    {
      userId: userAn._id.toString(),
      userName: "Nguyễn Văn An",
      productId: createdProducts[0]._id.toString(),
      orderId: deliveredOrders[0]?._id?.toString() || dummyOrderId,
      rating: 5,
      comment: "iPhone 16 Pro Max màu Titan Sa Mạc bên ngoài đẹp xuất sắc! Máy cầm đầm tay, nút Camera Control bấm chụp ảnh cực kỳ tiện lợi. Đóng gói rất kỹ, giao hàng từ Minh Tuấn Shop chưa đầy 2 tiếng.",
      isVerified: true
    },
    {
      userId: userBich._id.toString(),
      userName: "Trần Thị Bích",
      productId: createdProducts[2]._id.toString(),
      orderId: deliveredOrders[1]?._id?.toString() || dummyOrderId,
      rating: 5,
      comment: "Galaxy S24 Ultra chụp ảnh và dùng tính năng dịch trực tiếp cực đỉnh khi đi du lịch. Màn hình phẳng chống chói ra nắng nhìn rõ mồn một. Rất hài lòng với dịch vụ tư vấn của shop!",
      isVerified: true
    },
    {
      userId: userTuan._id.toString(),
      userName: "Lê Minh Tuấn",
      productId: createdProducts[10]._id.toString(),
      orderId: deliveredOrders[2]?._id?.toString() || dummyOrderId,
      rating: 5,
      comment: "MacBook Pro 14 M3 Pro màu Space Black quá đẳng cấp. Mình làm lập trình Docker và render video Premiere máy chạy êm ru, pin từ sáng đến tối vẫn còn 40%. Chuẩn chỉ!",
      isVerified: true
    },
    {
      userId: userAn._id.toString(),
      userName: "Nguyễn Văn An",
      productId: createdProducts[23]._id.toString(),
      orderId: deliveredOrders[0]?._id?.toString() || dummyOrderId,
      rating: 5,
      comment: "AirPods Pro 2 cổng Type-C tiện lợi chung cáp sạc với iPhone và Mac. Chống ồn đỉnh cao, đi xe bus hay ngồi cafe bật lên là yên tĩnh hoàn toàn.",
      isVerified: true
    },
    {
      userId: userBich._id.toString(),
      userName: "Trần Thị Bích",
      productId: createdProducts[27]._id.toString(),
      orderId: deliveredOrders[3]?._id?.toString() || dummyOrderId,
      rating: 5,
      comment: "Củ sạc Anker Prime 67W nhỏ gọn, sạc cùng lúc cả iPhone lẫn iPad vẫn mát rượi, chân gập mang đi làm rất tiện.",
      isVerified: true
    },
    {
      userId: userTuan._id.toString(),
      userName: "Lê Minh Tuấn",
      productId: createdProducts[14]._id.toString(),
      orderId: new mongoose.Types.ObjectId().toString(),
      rating: 5,
      comment: "Dàn PC Gaming Dragon Supreme nhìn ở ngoài thực sự choáng ngợp! Quạt Lian Li RGB lung linh, chơi Cyberpunk 2077 bật Ray Tracing Overdrive mượt 100 FPS.",
      isVerified: true
    },
    {
      userId: userAn._id.toString(),
      userName: "Nguyễn Văn An",
      productId: createdProducts[1]._id.toString(),
      orderId: new mongoose.Types.ObjectId().toString(),
      rating: 4,
      comment: "iPhone 15 Pro thiết kế titan nhẹ hơn hẳn đời trước. Dùng mượt, camera zoom sắc nét. Điểm trừ duy nhất là máy hơi ấm khi sạc nhanh, còn lại tuyệt vời.",
      isVerified: true
    },
    {
      userId: userBich._id.toString(),
      userName: "Trần Thị Bích",
      productId: createdProducts[7]._id.toString(),
      orderId: new mongoose.Types.ObjectId().toString(),
      rating: 5,
      comment: "iPad Pro M4 mỏng nhẹ đến khó tin! Màn hình OLED kép đen sâu thẳm xem phim Netflix cực kỳ đã mắt. Hàng chính hãng nguyên seal.",
      isVerified: true
    },
    {
      userId: userTuan._id.toString(),
      userName: "Lê Minh Tuấn",
      productId: createdProducts[12]._id.toString(),
      orderId: new mongoose.Types.ObjectId().toString(),
      rating: 5,
      comment: "Asus ROG Zephyrus G16 màn hình OLED 240Hz màu sắc chuẩn xác, chơi game không bóng mờ. Vỏ nhôm CNC đẹp hơn hẳn các dòng gaming hầm hố khác.",
      isVerified: true
    },
    {
      userId: userAn._id.toString(),
      userName: "Nguyễn Văn An",
      productId: createdProducts[17]._id.toString(),
      orderId: new mongoose.Types.ObjectId().toString(),
      rating: 5,
      comment: "Màn hình LG 27GR95QE OLED 240Hz tần số quét cao bắn CS2 và Valorant cực dính. Không hề có hiện tượng ghosting.",
      isVerified: true
    },
    {
      userId: userBich._id.toString(),
      userName: "Trần Thị Bích",
      productId: createdProducts[24]._id.toString(),
      orderId: new mongoose.Types.ObjectId().toString(),
      rating: 5,
      comment: "Tai nghe Sony WH-1000XM5 đeo êm tai không bị cấn, bass trầm ấm nghe nhạc lofi hay pop ballad rất thích.",
      isVerified: true
    },
    {
      userId: userTuan._id.toString(),
      userName: "Lê Minh Tuấn",
      productId: createdProducts[25]._id.toString(),
      orderId: new mongoose.Types.ObjectId().toString(),
      rating: 5,
      comment: "Bàn phím FL-Esports OG87 gõ tiếng đầm, không bị vang kim loại. Kết nối bluetooth với cả máy tính lẫn iPad chuyển đổi rất nhanh.",
      isVerified: true
    },
    {
      userId: userAn._id.toString(),
      userName: "Nguyễn Văn An",
      productId: createdProducts[26]._id.toString(),
      orderId: new mongoose.Types.ObjectId().toString(),
      rating: 5,
      comment: "Chuột Logitech Superlight 2 nhẹ tênh, feet chuột lướt êm, pin dùng cả tháng mới phải cắm sạc một lần.",
      isVerified: true
    },
    {
      userId: userBich._id.toString(),
      userName: "Trần Thị Bích",
      productId: createdProducts[4]._id.toString(),
      orderId: new mongoose.Types.ObjectId().toString(),
      rating: 5,
      comment: "Xiaomi 14 Ultra chụp chân dung xóa phông Leica rất có chiều sâu. Máy cầm đầm chắc như máy ảnh thực thụ.",
      isVerified: true
    },
    {
      userId: userTuan._id.toString(),
      userName: "Lê Minh Tuấn",
      productId: createdProducts[18]._id.toString(),
      orderId: new mongoose.Types.ObjectId().toString(),
      rating: 5,
      comment: "Card đồ họa RTX 4080 Super mát rượi, tải nặng nhiệt độ chỉ tầm 60-63 độ. Minh Tuấn Shop đóng gói bọc xốp 3 lớp vận chuyển rất an tâm.",
      isVerified: true
    }
  ];

  for (const r of reviewsList) {
    await Review.findOneAndUpdate(
      { userId: r.userId, productId: r.productId },
      r,
      { upsert: true, new: true }
    );
  }
  console.log(` + Seeded ${reviewsList.length} reviews.`);

  // 6. SEED CUSTOMER SERVICE CHAT THREADS
  console.log('[SEED] Seeding realistic Customer Support chat threads...');
  const chatThreads = [
    {
      userId: userAn._id,
      userName: userAn.name,
      userEmail: userAn.email,
      status: "active",
      lastMessage: new Date(),
      unreadCount: 1,
      messages: [
        {
          sender: "user",
          content: "Chào shop! Em đang phân vân giữa iPhone 16 Pro Max và Galaxy S24 Ultra, shop tư vấn giúp em nhu cầu chụp ảnh và công việc với ạ.",
          messageType: "text",
          timestamp: new Date(Date.now() - 35 * 60 * 1000),
          isRead: true
        },
        {
          sender: "admin",
          content: "Chào bạn An! Cả hai máy đều là flagship số 1 hiện nay. Nếu bạn làm việc đa nhiệm, cần ghi chú nhanh bằng bút cảm ứng và thích tính năng dịch thuật AI trực tiếp thì S24 Ultra cực kỳ phù hợp. Còn nếu bạn chuyên quay video, làm sáng tạo nội dung hoặc ưu tiên giữ giá và hệ sinh thái Apple (Mac/iPad) thì iPhone 16 Pro Max vượt trội hơn hẳn nhé!",
          messageType: "text",
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          isRead: true
        },
        {
          sender: "user",
          content: "Dạ em dùng MacBook nữa nên chắc chốt iPhone 16 Pro Max bản 256GB màu Titan Sa Mạc. Shop có sẵn hàng giao trong ngày tại Hà Nội không ạ?",
          messageType: "text",
          timestamp: new Date(Date.now() - 20 * 60 * 1000),
          isRead: true
        },
        {
          sender: "admin",
          content: "Minh Tuấn Shop luôn sẵn hàng nguyên seal VN/A bạn nhé! Bạn có thể đặt hàng ngay trên web, áp mã IPHONE500K để được giảm 500k và miễn phí giao hỏa tốc 2 giờ tại Cầu Giấy ạ.",
          messageType: "text",
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          isRead: true
        },
        {
          sender: "user",
          content: "Vâng em vừa đặt đơn hàng COD trên web rồi ạ, nhờ shop gọi xác nhận sớm giúp em nhé!",
          messageType: "text",
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          isRead: false
        }
      ]
    },
    {
      userId: userTuan._id,
      userName: userTuan.name,
      userEmail: userTuan.email,
      status: "closed",
      lastMessage: new Date(Date.now() - 24 * 60 * 60 * 1000),
      unreadCount: 0,
      messages: [
        {
          sender: "user",
          content: "Shop ơi, mình làm dựng phim 4K trên Premiere Pro và dựng hình Blender 3D thì bộ PC Minh Tuấn Phoenix RTX 4070 Ti Super chạy có bị nghẽn không?",
          messageType: "text",
          timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
          isRead: true
        },
        {
          sender: "admin",
          content: "Chào bạn Tuấn! Cấu hình Phoenix dùng Core i7 14700F kết hợp 32GB RAM DDR5 và RTX 4070 Ti Super 16GB VRAM là chuẩn bài cho Premiere và Blender luôn ạ. 16GB VRAM render cảnh nặng không bao giờ sợ tràn bộ nhớ đồ họa.",
          messageType: "text",
          timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000),
          isRead: true
        },
        {
          sender: "user",
          content: "Tuyệt vời, cảm ơn shop tư vấn tận tình, mình đã nhận máy test ngon lành rồi nhé!",
          messageType: "text",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          isRead: true
        }
      ]
    }
  ];

  for (const chat of chatThreads) {
    await Chat.findOneAndUpdate(
      { userId: chat.userId },
      chat,
      { upsert: true, new: true }
    );
  }
  console.log(` + Seeded ${chatThreads.length} CSKH chat threads.`);

  console.log('====================================================');
  console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
  console.log('  Database:', mongoose.connection.name);
  console.log('  Products:', await Product.countDocuments());
  console.log('  Users:', await User.countDocuments());
  console.log('  Orders:', await Order.countDocuments());
  console.log('  Coupons:', await Coupon.countDocuments());
  console.log('  Reviews:', await Review.countDocuments());
  console.log('  Chats:', await Chat.countDocuments());
  console.log('====================================================');

  process.exit(0);
}

runSeed().catch(err => {
  console.error('[SEED ERROR]', err);
  process.exit(1);
});
