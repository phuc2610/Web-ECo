import p_img1 from './p_img1.webp'
import p_img1_1 from './p_img1_1.webp'
import p_img1_2 from './p_img1_2.webp'
import p_img2_1 from './p_img2.webp'
import p_img2_2 from './p_img2_1.webp'
import p_img2_3 from './p_img2_3.webp'
import p_img2_5 from './p_img2_5.webp'
import p_img3 from './p_img3.webp'
import p_img3_1 from './p_img3_1.webp'
import p_img3_2 from './p_img3_2.webp'
import p_img4 from './p_img4.webp'
import p_img4_1 from './p_img4_1.webp'
import p_img4_2 from './p_img4_2.webp'
import p_img5_1 from './p_img5_1.webp'
import p_img5_2 from './p_img5_2.webp'
import p_img5_3 from './p_img5_3.webp'
import p_img6_1 from './p_img6_1.webp'
import p_img6_2 from './p_img6_2.webp'
import p_img6_3 from './p_img6_3.webp'
import p_img6_4 from './p_img6_4.webp'
import p_img7 from './p_img7.webp'
import p_img8 from './p_img8.jpg'
import p_img9 from './p_img9.webp'
import p_img10 from './p_img10.webp'
import p_img11 from './p_img11.webp'
import p_img12 from './p_img12.webp'
import p_img13 from './p_img13.webp'
import p_img14 from './p_img14.webp'
import p_img15 from './p_img15.webp'
import p_img16 from './p_img16.webp'
import p_img17 from './p_img17.webp'
import p_img18 from './p_img18.webp'
import p_img19 from './p_img19.webp'
import p_img20 from './p_img20.webp'
import p_img21 from './p_img21.webp'
import p_img22 from './p_img22.webp'
import p_img23 from './p_img23.webp'

import p_img25 from './p_img25.webp'
import p_img26 from './p_img26.webp'




import logo from './logo_minhtuan.png'
import hero_img from './hero_img.jpg'
import cart_icon from './cart_icon.png'
import bin_icon from './bin_icon.png'
import dropdown_icon from './dropdown_icon.png'
import exchange_icon from './exchange_icon.png'
import profile_icon from './profile_icon.png'
import quality_icon from './quality_icon.png'
import search_icon from './search_icon.png'
import star_dull_icon from './star_dull_icon.png'
import star_icon from './star_icon.png'
import support_img from './support_img.png'
import menu_icon from './menu_icon.png'
import about_img from './about_img.png'
import contact_img from './contact_img.png'
import razorpay_logo from './razorpay_logo.png'
import stripe_logo from './stripe_logo.png'
import cross_icon from './cross_icon.png'
import MoMo_Logo from './MoMo_Logo.png'

export const assets = {
    logo,
    hero_img,
    cart_icon,
    dropdown_icon,
    exchange_icon,
    profile_icon,
    quality_icon,
    search_icon,
    star_dull_icon,
    star_icon,
    bin_icon,
    support_img,
    menu_icon,
    about_img,
    contact_img,
    razorpay_logo,
    stripe_logo,
    cross_icon,
    MoMo_Logo
}

export const products = [
    {
        _id: "p_iphone16promax",
        name: "iPhone 16 Pro Max 256GB | Chính hãng VN/A",
        description: "iPhone 16 Pro Max thiết kế Titan sa mạc sang trọng, viền mỏng nhất lịch sử Apple, chip A18 Pro mạnh mẽ và nút Camera Control chuyên nghiệp.",
        price: 34990000,
        originalPrice: 37990000,
        image: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800"],
        category: "Điện thoại",
        subCategory: "Apple",
        brand: "Apple",
        sizes: ["256GB", "512GB", "1TB"],
        date: Date.now(),
        bestseller: true
    },
    {
        _id: "p_s24ultra",
        name: "Samsung Galaxy S24 Ultra 12GB 256GB | Galaxy AI",
        description: "Khung viền Titan bền bỉ, bút S-Pen quyền năng, camera 200MP zoom quang học và bộ công cụ Galaxy AI đỉnh cao.",
        price: 27990000,
        originalPrice: 33990000,
        image: ["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800"],
        category: "Điện thoại",
        subCategory: "Samsung",
        brand: "Samsung",
        sizes: ["256GB", "512GB", "1TB"],
        date: Date.now(),
        bestseller: true
    },
    {
        _id: "p_macbookairm3",
        name: "MacBook Air 13 inch M3 (8GB RAM - 256GB SSD)",
        description: "Thiết kế mỏng nhẹ siêu di động, thời lượng pin lên đến 18 giờ, màn hình Liquid Retina sắc nét hỗ trợ 2 màn hình ngoài.",
        price: 26990000,
        originalPrice: 28990000,
        image: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800"],
        category: "Laptop",
        subCategory: "Apple",
        brand: "Apple",
        sizes: ["8GB/256GB", "16GB/512GB", "24GB/1TB"],
        date: Date.now(),
        bestseller: true
    },
    {
        _id: "p_pcgaming4080",
        name: "PC Gaming Minh Tuấn Ultra - Core i9 14900K / RTX 4080 Super",
        description: "Cấu hình siêu khủng cân mọi tựa game AAA và phần mềm render 3D nặng nhất hiện nay với tản nhiệt nước AIO 360 cao cấp.",
        price: 68990000,
        originalPrice: 75000000,
        image: ["https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800"],
        category: "PC",
        subCategory: "Minh Tuấn Gaming",
        brand: "Minh Tuấn Gaming",
        sizes: ["32GB/1TB", "64GB/2TB"],
        date: Date.now(),
        bestseller: true
    },
    {
        _id: "p_ipadprom4",
        name: "iPad Pro 11 inch M4 Ultra Retina XDR OLED Wi-Fi 256GB",
        description: "iPad mỏng nhất từng được Apple tạo ra, màn hình Ultra Retina XDR công nghệ OLED kép và chip M4 thế hệ mới.",
        price: 28490000,
        originalPrice: 30990000,
        image: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800"],
        category: "Máy tính bảng",
        subCategory: "Apple",
        brand: "Apple",
        sizes: ["256GB", "512GB", "1TB"],
        date: Date.now(),
        bestseller: true
    },
    {
        _id: "p_airpodspro2",
        name: "Tai nghe Apple AirPods Pro 2 MagSafe (USB-C)",
        description: "Chống ồn chủ động (ANC) tốt hơn gấp 2 lần, âm thanh thích ứng và hộp sạc USB-C chống bụi chuẩn IP54.",
        price: 5490000,
        originalPrice: 6190000,
        image: ["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800"],
        category: "Phụ kiện di động",
        subCategory: "Apple",
        brand: "Apple",
        sizes: ["Trắng Tiêu Chuẩn"],
        date: Date.now(),
        bestseller: true
    },
    {
        _id: "p_ankergan100w",
        name: "Củ sạc nhanh Anker Prime 100W GaN 3 cổng",
        description: "Sạc nhanh đồng thời 3 thiết bị với công suất tối đa 100W, công nghệ GaN nhỏ gọn và an toàn vượt trội.",
        price: 1290000,
        originalPrice: 1690000,
        image: ["https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800"],
        category: "Phụ kiện di động",
        subCategory: "Anker",
        brand: "Anker",
        sizes: ["Đen", "Bạc"],
        date: Date.now(),
        bestseller: true
    }
];