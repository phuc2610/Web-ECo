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




import logo from './logo_tlook.png'
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

export const products =[
    {
        _id: "aaaaa",
        name: "Vợt Cầu Lông Yonex Astrox 100ZZ BP",
        description: "Yonex Astrox 100ZZ BP là cây vợt cao cấp nổi bật với công nghệ Namd giúp tăng độ đàn hồi và sức mạnh cho từng cú đập. Thiết kế đầu nặng, thân vợt siêu cứng mang lại cảm giác kiểm soát tối đa, phù hợp cho vận động viên chuyên nghiệp yêu thích lối đánh tấn công mạnh mẽ.",
        price: 6500000,
        image: [p_img1 ,p_img1_1 ,p_img1_2],
        category: "Yonex",
        subCategory: "Attack",
        sizes: ["3U", "4U"],
        date: 1716634345448,
        bestseller: true
    },
    {
        _id: "aaaab",
        name: "Vợt cầu lông Yonex Arcsaber 7 Pro",
        description: "Yonex Arcsaber 7 Pro là dòng vợt cân bằng giữa sức mạnh và kiểm soát, nổi bật với khung vợt linh hoạt và công nghệ mới giúp tăng độ chính xác cho các pha cầu. Phù hợp cho người chơi trình độ trung bình đến nâng cao muốn kiểm soát thế trận.",
        price: 4309000,
        image: [p_img2_1,p_img2_2,p_img2_3,p_img2_5],
        category: "Yonex",
        subCategory: "Attack",
        sizes: ["3U", "4U"],
        date: 1716621345448,
        bestseller: true
    },
    {
        _id: "aaaac",
        name: "Vợt cầu lông Yonex Nanoflare Junior",
        description: "Yonex Nanoflare Junior là cây vợt nhẹ, dễ điều khiển, thiết kế dành riêng cho trẻ em và người mới chơi. Công nghệ Nanocell Neo giúp tăng tốc độ vung vợt và giảm rung, hỗ trợ tối đa cho các pha cầu nhanh và linh hoạt.",
        price: 1639000,
        image: [p_img3, p_img3_1, p_img3_2],
        category: "Yonex",
        subCategory: "Attack",
        sizes: ["3U", "4U"],
        date: 1716234545448,
        bestseller: true
    },
    {
        _id: "aaaad",
        name: "Vợt cầu lông Yonex Nanoflare 001A 2024",
        description: "Nanoflare 001A 2024 là mẫu vợt mới của Yonex với thiết kế khí động học, giúp tăng tốc độ vung vợt và khả năng phản tạt. Thân vợt dẻo, đầu nhẹ phù hợp cho người chơi yêu thích lối đánh phòng thủ và phản công nhanh.",
        price: 959000,
        image: [p_img4,p_img4_1,p_img4_2],
        category: "Yonex",
        subCategory: "Attack",
        sizes: ["3U", "4U"],
        date: 1716621345448,
        bestseller: true
    },
    {
        _id: "aaaae",
        name: "Vợt cầu lông Yonex Astrox 02 Clear",
        description: "Yonex Astrox 02 Clear là cây vợt tầm trung với công nghệ Rotational Generator System giúp phân bổ trọng lượng tối ưu, tăng sức mạnh cho các cú đập và khả năng kiểm soát cầu. Phù hợp cho người chơi bán chuyên và phong trào.",
        price: 1239000,
        image: [p_img5_1, p_img5_2, p_img5_3],
        category: "Yonex",
        subCategory: "Attack",
        sizes: ["3U", "4U"],
        date: 1716622345448,
        bestseller: true
    },
    {
        _id: "aaaaf",
        name: "Vợt Cầu Lông Victor Ryuga TD/C chính hãng",
        description: "Vợt cầu lông Victor Ryuga TD/C chính hãng là lựa chọn tuyệt vời cho những người chơi cầu lông chuyên nghiệp và bán chuyên. Sản phẩm nổi bật với thiết kế mạnh mẽ, khung vợt chắc chắn, trợ lực tốt giúp tăng sức mạnh cho từng cú đánh. Công nghệ hiện đại của Victor mang lại cảm giác kiểm soát cầu tối ưu, độ bền cao và khả năng chống rung hiệu quả. Đây là cây vợt lý tưởng cho những ai muốn nâng cao trình độ và trải nghiệm thi đấu đỉnh cao.",
        price: 2450000,
        image: [p_img6_1, p_img6_2, p_img6_3, p_img6_4],
        category: "Victor",
        subCategory: "Attack",
        sizes: ["3U", "4U"],
        date: 1716623423448,
        bestseller: true
    },
    {
        _id: "aaaag",
        name: "Vợt cầu lông Yonex Duora 10 LT",
        description: "Vợt cầu lông Yonex Duora 10 LT chính hãng là lựa chọn tuyệt vời cho những người chơi cầu lông chuyên nghiệp và bán chuyên. Sản phẩm nổi bật với thiết kế mạnh mẽ, khung vợt chắc chắn, trợ lực tốt giúp tăng sức mạnh cho từng cú đánh. Công nghệ hiện đại của Yonex mang lại cảm giác kiểm soát cầu tối ưu, độ bền cao và khả năng chống rung hiệu quả.",
        price: 3240000,
        image: [p_img7],
        category: "Yonex",
        subCategory: "Defense",
        sizes: ["4U", "5U"],
        date: 1716621542448,
        bestseller: false
    },
    {
        _id: "aaaah",
        name: "Vợt Cầu Lông Victor Thruster Ryuga Metallic CPS",
        description: "Vợt cầu lông Victor Thruster Ryuga Metallic CPS chính hãng là lựa chọn tuyệt vời cho những người chơi cầu lông chuyên nghiệp và bán chuyên. Sản phẩm nổi bật với thiết kế mạnh mẽ, khung vợt chắc chắn, trợ lực tốt giúp tăng sức mạnh cho từng cú đánh. Công nghệ hiện đại của Victor mang lại cảm giác kiểm soát cầu tối ưu, độ bền cao và khả năng chống rung hiệu quả.",
        price: 3950000,
        image: [p_img8],
        category: "Victor",
        subCategory: "Attack",
        sizes: ["3U", "4U"],
        date: 1716622345448,
        bestseller: false
    },
    {
        _id: "aaaai",
        name: "Vợt Cầu Lông Victor ARS LJH",
        description: "Vợt cầu lông Victor ARS LJH chính hãng là lựa chọn tuyệt vời cho những người chơi cầu lông chuyên nghiệp và bán chuyên. Sản phẩm nổi bật với thiết kế mạnh mẽ, khung vợt chắc chắn, trợ lực tốt giúp tăng sức mạnh cho từng cú đánh. Công nghệ hiện đại của Victor mang lại cảm giác kiểm soát cầu tối ưu, độ bền cao và khả năng chống rung hiệu quả.",
        price: 2500000,
        image: [p_img9],
        category: "Victor",
        subCategory: "Attack",
        sizes: ["3U", "4U"],
        date: 1716621235448,
        bestseller: false
    },
    {
        _id: "aaaaj",
        name: "Vợt cầu lông Victor Mjolnir Metallic Limited 2024",
        description: "Vợt cầu lông Victor Mjolnir Metallic Limited 2024 chính hãng là lựa chọn tuyệt vời cho những người chơi cầu lông chuyên nghiệp và bán chuyên. Sản phẩm nổi bật với thiết kế mạnh mẽ, khung vợt chắc chắn, trợ lực tốt giúp tăng sức mạnh cho từng cú đánh. Công nghệ hiện đại của Victor mang lại cảm giác kiểm soát cầu tối ưu, độ bền cao và khả năng chống rung hiệu quả.",
        price: 4650000,
        image: [p_img10],
        category: "Victor",
        subCategory: "Defense",
        sizes: ["3U", "4U"],
        date: 1716622235448,
        bestseller: false
    },
     {
        _id: "aaaan",
        name: "Vợt cầu lông Lining Aeronaut 9000C",
        description: "Vợt cầu lông Lining Aeronaut 9000C chính hãng là lựa chọn tuyệt vời cho những người chơi cầu lông chuyên nghiệp và bán chuyên. Sản phẩm nổi bật với thiết kế mạnh mẽ, khung vợt chắc chắn, trợ lực tốt giúp tăng sức mạnh cho từng cú đánh. Công nghệ hiện đại của Lining mang lại cảm giác kiểm soát cầu tối ưu, độ bền cao và khả năng chống rung hiệu quả.",
        price: 3700000,
        image: [p_img11],
        category: "Lining",
        subCategory: "Attack",
        sizes: ["3U", "4U"],
        date: 1716626645448,
        bestseller: false
    },
    {
        _id: "aaaal",
        name: "Vợt cầu lông Yonex Arcsaber 11",
        description: "Vợt cầu lông Yonex Arcsaber 11 chính hãng là lựa chọn tuyệt vời cho những người chơi cầu lông chuyên nghiệp và bán chuyên. Sản phẩm nổi bật với thiết kế mạnh mẽ, khung vợt chắc chắn, trợ lực tốt giúp tăng sức mạnh cho từng cú đánh. Công nghệ hiện đại của Yonex mang lại cảm giác kiểm soát cầu tối ưu, độ bền cao và khả năng chống rung hiệu quả.",
        price: 150,
        image: [p_img12],
        category: "Yonex",
        subCategory: "Attack",
        sizes: ["3U", "4U"],
        date: 1716624445448,
        bestseller: false
    },
    {
        _id: "aaaam",
        name: "Vợt cầu lông Victor Jetspeed S 12",
        description: "Vợt cầu lông Victor Jetspeed S 12 chính hãng là lựa chọn tuyệt vời cho những người chơi cầu lông chuyên nghiệp và bán chuyên. Sản phẩm nổi bật với thiết kế mạnh mẽ, khung vợt chắc chắn, trợ lực tốt giúp tăng sức mạnh cho từng cú đánh. Công nghệ hiện đại của Victor mang lại cảm giác kiểm soát cầu tối ưu, độ bền cao và khả năng chống rung hiệu quả.",
        price: 2150000 ,
        image: [p_img13],
        category: "Victor",
        subCategory: "Attack",
        sizes: ["3U", "4U"],
        date: 1716625545448,
        bestseller: false
    },
    {
        _id: "aaaav",
        name: "Vợt cầu lông Victor HX 900",
        description: "Vợt cầu lông Victor Hypernano X 900 chính hãng là lựa chọn tuyệt vời cho những người chơi cầu lông chuyên nghiệp và bán chuyên. Sản phẩm nổi bật với thiết kế mạnh mẽ, khung vợt chắc chắn, trợ lực tốt giúp tăng sức mạnh cho từng cú đánh. Công nghệ hiện đại của Victor mang lại cảm giác kiểm soát cầu tối ưu, độ bền cao và khả năng chống rung hiệu quả.",
        price: 2240000,
        image: [p_img14],
        category: "Victor",
        subCategory: "Defense",
        sizes: ["4U", "5U"],
        date: 1716635445448,
        bestseller: false
    },
    {
        _id: "aaaao",
        name: "Vợt cầu lông Yonex Nanoray 900",
        description: "Vợt cầu lông Yonex Nanoray 900 chính hãng là lựa chọn tuyệt vời cho những người chơi cầu lông chuyên nghiệp và bán chuyên. Sản phẩm nổi bật với thiết kế mạnh mẽ, khung vợt chắc chắn, trợ lực tốt giúp tăng sức mạnh cho từng cú đánh. Công nghệ hiện đại của Yonex mang lại cảm giác kiểm soát cầu tối ưu, độ bền cao và khả năng chống rung hiệu quả.",
        price: 140,
        image: [p_img15],
        category: "Yonex",
        subCategory: "Defense",
        sizes: ["3U", "4U"],
        date: 1716627745448,
        bestseller: false
    },
     {
        _id: "aaabj",
        name: "Vợt cầu lông Lining Windstorm 72",
        description: "Lining Windstorm 72 là cây vợt siêu nhẹ, phù hợp cho người chơi nữ hoặc trẻ em. Thiết kế hiện đại, dễ điều khiển, giúp người chơi kiểm soát cầu tốt và giảm mỏi tay khi thi đấu lâu.",
        price: 3700000,
        image: [p_img16],
        category: "Lining",
        subCategory: "Defense",
        sizes: ["4U", "5U"],
        date: 1716650845448,
        bestseller: false
    },
    {
        _id: "aaaaq",
        name: "Vợt cầu lông Yonex Duora Z-Strike",
        description: "Vợt cầu lông Yonex Duora Z-Strike chính hãng là lựa chọn tuyệt vời cho những người chơi cầu lông chuyên nghiệp và bán chuyên. Sản phẩm nổi bật với thiết kế mạnh mẽ, khung vợt chắc chắn, trợ lực tốt giúp tăng sức mạnh cho từng cú đánh. Công nghệ hiện đại của Yonex mang lại cảm giác kiểm soát cầu tối ưu, độ bền cao và khả năng chống rung hiệu quả.",
        price: 4549000,
        image: [p_img17],
        category: "Yonex",
        subCategory: "Defense",
        sizes: ["3U", "4U"],
        date: 1716629945448,
        bestseller: false
    },
  {
        _id: "aaaav",
        name: "Vợt cầu lông Victor HX 900",
        description: "Vợt cầu lông Victor Hypernano X 900 chính hãng là lựa chọn tuyệt vời cho những người chơi cầu lông chuyên nghiệp và bán chuyên. Sản phẩm nổi bật với thiết kế mạnh mẽ, khung vợt chắc chắn, trợ lực tốt giúp tăng sức mạnh cho từng cú đánh. Công nghệ hiện đại của Victor mang lại cảm giác kiểm soát cầu tối ưu, độ bền cao và khả năng chống rung hiệu quả.",
        price: 2240000,
        image: [p_img18],
        category: "Victor",
        subCategory: "Defense",
        sizes: ["4U", "5U"],
        date: 1716635445448,
        bestseller: false
    },
    {
        _id: "aaaas",
        name: "Vợt cầu lông Lining Windstorm 78",
        description: "Vợt cầu lông Lining Windstorm 78 chính hãng là lựa chọn tuyệt vời cho những người chơi cầu lông chuyên nghiệp và bán chuyên. Sản phẩm nổi bật với thiết kế mạnh mẽ, khung vợt chắc chắn, trợ lực tốt giúp tăng sức mạnh cho từng cú đánh. Công nghệ hiện đại của Lining mang lại cảm giác kiểm soát cầu tối ưu, độ bền cao và khả năng chống rung hiệu quả.",
        price: 1550000,
        image: [p_img19],
        category: "Lining",
        subCategory: "Attack",
        sizes: ["3U", "4U"],
        date: 1716632145448,
        bestseller: false
    },
    {
        _id: "aaaat",
        name: "Vợt cầu lông Victor Brave Sword 12",
        description: "Vợt cầu lông Victor Brave Sword 12 chính hãng là lựa chọn tuyệt vời cho những người chơi cầu lông chuyên nghiệp và bán chuyên. Sản phẩm nổi bật với thiết kế mạnh mẽ, khung vợt chắc chắn, trợ lực tốt giúp tăng sức mạnh cho từng cú đánh. Công nghệ hiện đại của Victor mang lại cảm giác kiểm soát cầu tối ưu, độ bền cao và khả năng chống rung hiệu quả.",
        price: 190,
        image: [p_img20],
        category: "Victor",
        subCategory: "Defense",
        sizes: ["3U", "4U"],
        date: 1716633245448,
        bestseller: false
    },
    {
        _id: "aaaau",
        name: "Vợt cầu lông Victor Auraspeed 90K",
        description: "Vợt cầu lông Victor Auraspeed 90K chính hãng là lựa chọn tuyệt vời cho những người chơi cầu lông chuyên nghiệp và bán chuyên. Sản phẩm nổi bật với thiết kế mạnh mẽ, khung vợt chắc chắn, trợ lực tốt giúp tăng sức mạnh cho từng cú đánh. Công nghệ hiện đại của Victor mang lại cảm giác kiểm soát cầu tối ưu, độ bền cao và khả năng chống rung hiệu quả.",
        price: 2440000,
        image: [p_img21],
        category: "Victor",
        subCategory: "Balance",
        sizes: ["4U", "5U"],
        date: 1716634345448,
        bestseller: false
    },
    {
        _id: "aaaav",
        name: "Vợt cầu lông Victor HX 900",
        description: "Vợt cầu lông Victor Hypernano X 900 chính hãng là lựa chọn tuyệt vời cho những người chơi cầu lông chuyên nghiệp và bán chuyên. Sản phẩm nổi bật với thiết kế mạnh mẽ, khung vợt chắc chắn, trợ lực tốt giúp tăng sức mạnh cho từng cú đánh. Công nghệ hiện đại của Victor mang lại cảm giác kiểm soát cầu tối ưu, độ bền cao và khả năng chống rung hiệu quả.",
        price: 2240000,
        image: [p_img22],
        category: "Victor",
        subCategory: "Defense",
        sizes: ["4U", "5U"],
        date: 1716635445448,
        bestseller: false
    },
    {
        _id: "aaaaw",
        name: "Vợt cầu lông Lining Calibar 300",
        description: "Vợt cầu lông Lining Calibar 300 chính hãng là lựa chọn tuyệt vời cho những người chơi cầu lông chuyên nghiệp và bán chuyên. Sản phẩm nổi bật với thiết kế mạnh mẽ, khung vợt chắc chắn, trợ lực tốt giúp tăng sức mạnh cho từng cú đánh. Công nghệ hiện đại của Lining mang lại cảm giác kiểm soát cầu tối ưu, độ bền cao và khả năng chống rung hiệu quả.",
        price: 1500000,
        image: [p_img23],
        category: "Lining",
        subCategory: "Attack",
        sizes: ["3U", "4U"],
        date: 1716636545448,
        bestseller: false
    },
    
    {
        _id: "aaaay",
        name: "Vợt cầu lông Lining 3D Calibar 600",
        description: "Vợt cầu lông Lining 3D Calibar 600 chính hãng là lựa chọn tuyệt vời cho những người chơi cầu lông chuyên nghiệp và bán chuyên. Sản phẩm nổi bật với thiết kế mạnh mẽ, khung vợt chắc chắn, trợ lực tốt giúp tăng sức mạnh cho từng cú đánh. Công nghệ hiện đại của Lining mang lại cảm giác kiểm soát cầu tối ưu, độ bền cao và khả năng chống rung hiệu quả.",
        price: 2750000,
        image: [p_img25],
        category: "Lining",
        subCategory: "Attack",
        sizes: ["3U", "4U"],
        date: 1716638745448,
        bestseller: false
    },
    {
        _id: "aaaaz",
        name: "Vợt cầu lông Victor DriveX 9X",
        description: "Vợt cầu lông Victor DriveX 9X chính hãng là lựa chọn tuyệt vời cho những người chơi cầu lông chuyên nghiệp và bán chuyên. Sản phẩm nổi bật với thiết kế mạnh mẽ, khung vợt chắc chắn, trợ lực tốt giúp tăng sức mạnh cho từng cú đánh. Công nghệ hiện đại của Victor mang lại cảm giác kiểm soát cầu tối ưu, độ bền cao và khả năng chống rung hiệu quả.",
        price: 1700000,
        image: [p_img26],
        category: "Victor",
        subCategory: "Balance",
        sizes: ["3U", "4U","5U"],
        date: 1716639845448,
        bestseller: false
    },
    
   
]