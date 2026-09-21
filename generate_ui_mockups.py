import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs('generated_diagrams', exist_ok=True)

def get_font(size, bold=False):
    # Try standard Windows fonts
    font_paths = [
        "C:\\Windows\\Fonts\\arialbd.ttf" if bold else "C:\\Windows\\Fonts\\arial.ttf",
        "C:\\Windows\\Fonts\\tahoma.ttf",
        "C:\\Windows\\Fonts\\times.ttf"
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except:
                pass
    return ImageFont.load_default()

def draw_browser_header(draw, width, title="Minh Tuấn Shop - Điện Thoại & Máy Tính Chính Hãng"):
    # Browser chrome bar
    draw.rectangle([0, 0, width, 42], fill="#F1F5F9")
    draw.ellipse([14, 15, 24, 25], fill="#EF4444")
    draw.ellipse([30, 15, 40, 25], fill="#F59E0B")
    draw.ellipse([46, 15, 56, 25], fill="#10B981")
    # Address bar
    draw.rounded_rectangle([120, 8, width - 140, 34], radius=6, fill="#FFFFFF", outline="#CBD5E1")
    font_url = get_font(12)
    draw.text((135, 12), f"🔒 https://minhtuanshop.vn/{title.split(' - ')[0].lower()}", fill="#475569", font=font_url)

def create_home_ui():
    width, height = 1280, 780
    img = Image.new('RGB', (width, height), color='#FFFFFF')
    draw = ImageDraw.Draw(img)
    draw_browser_header(draw, width, "Trang Chủ - Minh Tuấn Shop")
    
    # Navbar
    draw.rectangle([0, 42, width, 106], fill="#FFFFFF", outline="#E2E8F0")
    # Logo
    draw.rectangle([40, 52, 220, 96], fill="#DC2626")
    f_logo = get_font(18, bold=True)
    draw.text((50, 62), "MINH TUAN SHOP", fill="#FFFFFF", font=f_logo)
    
    # Search box
    draw.rounded_rectangle([250, 56, 750, 92], radius=18, fill="#F8FAFC", outline="#CBD5E1")
    f_sm = get_font(13)
    draw.text((270, 66), "🔍 Bạn cần tìm điện thoại iPhone, laptop Asus, phụ kiện Anker...", fill="#94A3B8", font=f_sm)
    
    # Nav links
    navs = ["Trang chủ", "Điện thoại", "Laptop & PC", "Máy tính bảng", "Phụ kiện", "Tin tức"]
    f_nav = get_font(13, bold=True)
    for i, nv in enumerate(navs):
        draw.text((780 + i * 80, 67), nv, fill="#1E293B" if i==0 else "#475569", font=f_nav)
        
    # Cart & Wishlist icons
    draw.rounded_rectangle([width - 80, 58, width - 40, 90], radius=8, fill="#FEE2E2")
    draw.text((width - 70, 66), "🛒 (3)", fill="#DC2626", font=f_nav)

    # Hero Banner
    draw.rounded_rectangle([40, 120, width - 40, 310], radius=16, fill="#0F172A")
    f_hero1 = get_font(26, bold=True)
    f_hero2 = get_font(15)
    draw.text((70, 160), "KHAI PHÁ KỶ NGUYÊN CÔNG NGHỆ 2026", fill="#F8FAFC", font=f_hero1)
    draw.text((70, 205), "Minh Tuấn Shop - Đại lý ủy quyền Apple, Asus, Samsung, Dell hàng đầu Việt Nam", fill="#94A3B8", font=f_hero2)
    draw.text((70, 235), "⚡ Flash Sale giảm đến 35% • Trả góp 0% • Giao nhanh 2h toàn quốc", fill="#38BDF8", font=f_hero2)
    draw.rounded_rectangle([70, 265, 210, 298], radius=8, fill="#DC2626")
    draw.text((85, 274), "MUA NGAY HÔM NAY", fill="#FFFFFF", font=f_nav)

    # Flash Sale Bar
    draw.rectangle([40, 330, width - 40, 380], fill="#FEF2F2", outline="#FECACA")
    f_fs = get_font(16, bold=True)
    draw.text((60, 344), "⚡ FLASH SALE GIÁ SỐC", fill="#DC2626", font=f_fs)
    draw.text((260, 346), "Kết thúc sau: 04 : 15 : 28", fill="#991B1B", font=f_nav)

    # Product Cards Grid (4 products)
    cards = [
        ("iPhone 16 Pro Max 256GB", "34.990.000đ", "36.990.000đ", "Apple Titanium"),
        ("Laptop Asus ROG Zephyrus G16", "48.990.000đ", "52.000.000đ", "Intel Core Ultra 9 / RTX 4070"),
        ("Samsung Galaxy S25 Ultra 512GB", "31.490.000đ", "33.990.000đ", "Snapdragon 8 Elite / S-Pen"),
        ("MacBook Pro 14 M3 Pro", "44.990.000đ", "49.990.000đ", "18GB RAM / 512GB SSD")
    ]
    card_w = (width - 80 - 45) // 4
    for i, (pname, price, oldp, spec) in enumerate(cards):
        cx = 40 + i * (card_w + 15)
        cy = 400
        ch = 350
        draw.rounded_rectangle([cx, cy, cx + card_w, cy + ch], radius=14, fill="#FFFFFF", outline="#E2E8F0")
        # Product image placeholder
        draw.rounded_rectangle([cx + 12, cy + 12, cx + card_w - 12, cy + 180], radius=10, fill="#F1F5F9")
        draw.text((cx + card_w//2 - 40, cy + 85), "[Hình Thiết Bị]", fill="#94A3B8", font=f_sm)
        # Name
        f_pname = get_font(13, bold=True)
        draw.text((cx + 14, cy + 200), pname[:24], fill="#1E293B", font=f_pname)
        draw.text((cx + 14, cy + 225), spec[:26], fill="#64748B", font=get_font(11))
        # Price
        draw.text((cx + 14, cy + 255), price, fill="#DC2626", font=get_font(16, bold=True))
        draw.text((cx + 14, cy + 280), oldp, fill="#94A3B8", font=get_font(12))
        # Add to cart button
        draw.rounded_rectangle([cx + 14, cy + 305, cx + card_w - 14, cy + 338], radius=8, fill="#DC2626")
        draw.text((cx + card_w//2 - 35, cy + 314), "Thêm vào giỏ", fill="#FFFFFF", font=get_font(12, bold=True))

    img.save('generated_diagrams/hinh_5_1_giao_dien_trang_chu.jpg', quality=95)
    print("Created hinh_5_1_giao_dien_trang_chu.jpg")

def create_product_detail_ui():
    width, height = 1280, 780
    img = Image.new('RGB', (width, height), color='#FFFFFF')
    draw = ImageDraw.Draw(img)
    draw_browser_header(draw, width, "iPhone 16 Pro Max 256GB - Minh Tuấn Shop")

    # Header
    draw.rectangle([0, 42, width, 95], fill="#FFFFFF", outline="#E2E8F0")
    draw.rectangle([40, 50, 200, 88], fill="#DC2626")
    draw.text((50, 58), "MINH TUAN SHOP", fill="#FFFFFF", font=get_font(16, bold=True))
    draw.text((220, 60), "Trang chủ / Điện thoại / iPhone / iPhone 16 Pro Max", fill="#64748B", font=get_font(12))

    # Left: Big Product Gallery
    draw.rounded_rectangle([50, 115, 520, 580], radius=16, fill="#F8FAFC", outline="#E2E8F0")
    draw.text((200, 320), "[ẢNH IPHONE 16 PRO MAX\nTITANIUM SA MẠC 256GB]", fill="#64748B", font=get_font(16, bold=True), align="center")
    
    # 4 small thumbnails
    for t in range(4):
        tx = 50 + t * 122
        draw.rounded_rectangle([tx, 605, tx + 110, 715], radius=10, fill="#FFFFFF", outline="#CBD5E1")
        draw.text((tx + 25, 650), f"Góc {t+1}", fill="#94A3B8", font=get_font(12))

    # Right: Product Details & Config Selector
    rx = 560
    draw.text((rx, 115), "iPhone 16 Pro Max 256GB Desert Titanium Chính Hãng VN/A", fill="#0F172A", font=get_font(20, bold=True))
    draw.text((rx, 150), "⭐⭐⭐⭐⭐ 4.9 (128 Đánh giá)  •  Mã SP: IP16PM-256-DT", fill="#475569", font=get_font(13))
    
    # Price box
    draw.rounded_rectangle([rx, 180, width - 50, 245], radius=12, fill="#FEF2F2", outline="#FECACA")
    draw.text((rx + 20, 195), "34.990.000 đ", fill="#DC2626", font=get_font(24, bold=True))
    draw.text((rx + 220, 202), "36.990.000 đ (-6%)", fill="#94A3B8", font=get_font(14))
    draw.text((rx + 20, 225), "Tiết kiệm 2.000.000đ khi thanh toán qua VietQR Napas247", fill="#059669", font=get_font(12, bold=True))

    # Storage Selector (Sizes)
    draw.text((rx, 265), "Chọn Dung Lượng Bộ Nhớ:", fill="#1E293B", font=get_font(13, bold=True))
    capacities = [("256GB", "34.99M", True), ("512GB", "39.99M", False), ("1TB", "45.99M", False)]
    for ci, (cap, pr, sel) in enumerate(capacities):
        bx = rx + ci * 130
        draw.rounded_rectangle([bx, 290, bx + 120, 345], radius=10, 
                               fill="#EFF6FF" if sel else "#FFFFFF", 
                               outline="#2563EB" if sel else "#CBD5E1", width=2 if sel else 1)
        draw.text((bx + 15, 300), cap, fill="#1E40AF" if sel else "#1E293B", font=get_font(13, bold=True))
        draw.text((bx + 15, 322), pr, fill="#DC2626", font=get_font(11))

    # Tech Specs Summary
    draw.text((rx, 365), "Thông Số Kỹ Thuật Nổi Bật:", fill="#1E293B", font=get_font(13, bold=True))
    specs = [
        "• Màn hình: 6.9 inch Super Retina XDR OLED 120Hz ProMotion",
        "• Chipset: Apple A18 Pro tiến trình 3nm thế hệ mới",
        "• Camera: Chính 48MP + Siêu rộng 48MP + Tele 5x 12MP",
        "• Pin & Sạc: 4.685 mAh, sạc nhanh 50% trong 30 phút",
        "• Khung viền: Titan cấp 5 siêu nhẹ, chuẩn chống nước IP68"
    ]
    for si, sp in enumerate(specs):
        draw.text((rx + 10, 395 + si * 24), sp, fill="#334155", font=get_font(12))

    # Action Buttons
    draw.rounded_rectangle([rx, 530, rx + 240, 580], radius=12, fill="#DC2626")
    draw.text((rx + 65, 545), "MUA NGAY (GIAO 2H)", fill="#FFFFFF", font=get_font(14, bold=True))

    draw.rounded_rectangle([rx + 260, 530, rx + 480, 580], radius=12, fill="#FFFFFF", outline="#DC2626", width=2)
    draw.text((rx + 300, 545), "THÊM VÀO GIỎ HÀNG", fill="#DC2626", font=get_font(14, bold=True))

    # Reviews box preview
    draw.rounded_rectangle([rx, 605, width - 50, 725], radius=12, fill="#F8FAFC", outline="#E2E8F0")
    draw.text((rx + 20, 618), "💬 Đánh giá gần đây từ khách hàng:", fill="#1E293B", font=get_font(13, bold=True))
    draw.text((rx + 20, 642), "⭐⭐⭐⭐⭐ Nguyễn Văn An: 'Máy đóng gói cực kỳ cẩn thận, quét mã VietQR nhận luôn sau 3 giây, máy nguyên seal chính hãng!'", fill="#475569", font=get_font(11))
    draw.text((rx + 20, 665), "⭐⭐⭐⭐⭐ Trần Thị Bích: 'Màu Desert Titanium ở ngoài đẹp sang trọng hơn trong ảnh, nhân viên tư vấn chat rất nhiệt tình.'", fill="#475569", font=get_font(11))

    img.save('generated_diagrams/hinh_5_2_giao_dien_san_pham.jpg', quality=95)
    print("Created hinh_5_2_giao_dien_san_pham.jpg")

def create_payment_ui():
    width, height = 1280, 780
    img = Image.new('RGB', (width, height), color='#F8FAFC')
    draw = ImageDraw.Draw(img)
    draw_browser_header(draw, width, "Cổng Thanh Toán Tự Động VietQR - Minh Tuấn Shop")

    # Header Card
    draw.rounded_rectangle([50, 55, width - 50, 130], radius=16, fill="#FFFFFF", outline="#E2E8F0")
    draw.rectangle([70, 70, 240, 112], fill="#DC2626")
    draw.text((80, 80), "MINH TUAN SHOP", fill="#FFFFFF", font=get_font(16, bold=True))
    draw.text((260, 75), "CỔNG THANH TOÁN TỰ ĐỘNG VIETQR 24/7 (SEPAY INTEGRATION)", fill="#0F172A", font=get_font(15, bold=True))
    draw.text((260, 100), "Đơn hàng: #MT544358  •  Thời gian đếm ngược còn lại: 14:48", fill="#059669", font=get_font(13, bold=True))

    # Left: QR Code Card
    draw.rounded_rectangle([50, 150, 520, 730], radius=16, fill="#FFFFFF", outline="#10B981", width=2)
    draw.text((120, 175), "MÃ VIETQR CHUYỂN KHOẢN (NAPAS 247)", fill="#065F46", font=get_font(14, bold=True))
    
    # Big QR frame
    draw.rounded_rectangle([110, 210, 460, 560], radius=16, fill="#F0FDF4", outline="#059669", width=2)
    # Simulate QR grid
    draw.rectangle([130, 230, 440, 540], fill="#FFFFFF")
    draw.rectangle([150, 250, 210, 310], fill="#0F172A")
    draw.rectangle([165, 265, 195, 295], fill="#FFFFFF")
    draw.rectangle([360, 250, 420, 310], fill="#0F172A")
    draw.rectangle([375, 265, 405, 295], fill="#FFFFFF")
    draw.rectangle([150, 460, 210, 520], fill="#0F172A")
    draw.rectangle([165, 475, 195, 505], fill="#FFFFFF")
    # Draw sample QR dots
    import random
    random.seed(42)
    for qx in range(230, 350, 15):
        for qy in range(240, 530, 15):
            if random.random() > 0.4:
                draw.rectangle([qx, qy, qx+10, qy+10], fill="#0F172A")
                
    draw.text((155, 575), "Mở App Ngân hàng hoặc ví quét mã trên", fill="#334155", font=get_font(12, bold=True))
    draw.text((135, 600), "🟢 Hệ thống tự động phát hiện trong 3 - 5 giây", fill="#059669", font=get_font(12, bold=True))

    # Right: Bank details & 1-click copy
    rx = 550
    draw.rounded_rectangle([rx, 150, width - 50, 600], radius=16, fill="#FFFFFF", outline="#E2E8F0")
    draw.text((rx + 25, 175), "THÔNG TIN CHUYỂN KHOẢN THỦ CÔNG", fill="#0F172A", font=get_font(15, bold=True))
    
    fields = [
        ("Ngân hàng thụ hưởng:", "MBBank (Ngân Hàng Quân Đội - BIN: 970422)", False),
        ("Số tài khoản nhận:", "0907253168", True),
        ("Chủ tài khoản:", "MINH TUAN SHOP", False),
        ("Số tiền thanh toán:", "34.990.000 đ", True),
        ("Nội dung chuyển khoản (BẮT BUỘC):", "MT544358 0907253168", True)
    ]
    for fi, (lbl, val, copyable) in enumerate(fields):
        fy = 220 + fi * 70
        draw.rounded_rectangle([rx + 25, fy, width - 75, fy + 58], radius=10, fill="#F8FAFC", outline="#E2E8F0")
        draw.text((rx + 40, fy + 8), lbl, fill="#64748B", font=get_font(11))
        draw.text((rx + 40, fy + 26), val, fill="#B91C1C" if "Nội dung" in lbl or "Số tiền" in lbl else "#0F172A", font=get_font(14, bold=True))
        if copyable:
            draw.rounded_rectangle([width - 170, fy + 14, width - 90, fy + 44], radius=6, fill="#E0F2FE", outline="#0284C7")
            draw.text((width - 158, fy + 20), "Sao chép", fill="#0369A1", font=get_font(11, bold=True))

    # Simulation Test Mode Box
    draw.rounded_rectangle([rx, 620, width - 50, 730], radius=16, fill="#EEF2FF", outline="#6366F1", width=2)
    draw.text((rx + 25, 635), "🧪 CHẾ ĐỘ MÔ PHỎNG THANH TOÁN (SEPAY TEST MODE)", fill="#4338CA", font=get_font(13, bold=True))
    draw.text((rx + 25, 658), "Nhấn nút dưới để giả lập SePay gửi webhook thanh toán đơn hàng tức thì không cần tiền thật.", fill="#475569", font=get_font(11))
    draw.rounded_rectangle([rx + 25, 680, rx + 380, 718], radius=10, fill="#4F46E5")
    draw.text((rx + 50, 690), "⚡ KÍCH HOẠT MÔ PHỎNG THANH TOÁN NGAY", fill="#FFFFFF", font=get_font(12, bold=True))

    img.save('generated_diagrams/hinh_5_3_thanh_toan_vietqr.jpg', quality=95)
    print("Created hinh_5_3_thanh_toan_vietqr.jpg")

def create_admin_dashboard_ui():
    width, height = 1280, 780
    img = Image.new('RGB', (width, height), color='#F8FAFC')
    draw = ImageDraw.Draw(img)
    draw_browser_header(draw, width, "Admin Portal - Dashboard Thống Kê")

    # Sidebar
    draw.rectangle([0, 42, 240, height], fill="#0F172A")
    draw.text((30, 65), "MINH TUẤN ADMIN", fill="#F8FAFC", font=get_font(16, bold=True))
    
    menus = ["📊 Tổng quan Dashboard", "➕ Thêm sản phẩm", "📦 Quản lý sản phẩm", "📑 Quản lý đơn hàng", "👥 Quản lý người dùng", "🎟️ Mã giảm giá Voucher", "💬 Chat khách hàng", "⚙️ Cài đặt hệ thống"]
    for mi, m in enumerate(menus):
        my = 120 + mi * 48
        if mi == 0:
            draw.rounded_rectangle([15, my - 6, 225, my + 32], radius=8, fill="#DC2626")
            draw.text((28, my + 4), m, fill="#FFFFFF", font=get_font(12, bold=True))
        else:
            draw.text((28, my + 4), m, fill="#94A3B8", font=get_font(12))

    # Main area
    mx = 260
    draw.text((mx, 60), "BẢNG ĐIỀU KHIỂN & BÁO CÁO DOANH THU MINH TUẤN SHOP", fill="#0F172A", font=get_font(18, bold=True))
    draw.text((mx, 90), "Dữ liệu thời gian thực được đồng bộ từ MongoDB Atlas & SePay", fill="#64748B", font=get_font(12))

    # 4 Stat KPI cards
    kpis = [
        ("TỔNG DOANH THU", "2.845.600.000 đ", "+18.4% tháng này", "#059669"),
        ("TỔNG ĐƠN HÀNG", "1.248 đơn", "+12.1% tuần này", "#2563EB"),
        ("SẢN PHẨM HOẠT ĐỘNG", "186 thiết bị", "Điện thoại & PC", "#D97706"),
        ("KHÁCH HÀNG ĐĂNG KÝ", "4.520 tài khoản", "+350 người mới", "#7C3AED")
    ]
    card_w = (width - mx - 60) // 4
    for ki, (kt, kv, ksub, kcol) in enumerate(kpis):
        kx = mx + ki * (card_w + 15)
        draw.rounded_rectangle([kx, 125, kx + card_w, 225], radius=14, fill="#FFFFFF", outline="#E2E8F0")
        draw.text((kx + 18, 140), kt, fill="#64748B", font=get_font(11, bold=True))
        draw.text((kx + 18, 162), kv, fill="#0F172A", font=get_font(16, bold=True))
        draw.text((kx + 18, 195), ksub, fill=kcol, font=get_font(11, bold=True))

    # Chart Placeholder Box
    draw.rounded_rectangle([mx, 245, width - 40, 520], radius=14, fill="#FFFFFF", outline="#E2E8F0")
    draw.text((mx + 20, 260), "📈 Biểu Đồ Doanh Thu & Đơn Hàng Theo Tháng (Triệu VNĐ)", fill="#0F172A", font=get_font(14, bold=True))
    # Simulated chart bars
    months = ["Thg 1", "Thg 2", "Thg 3", "Thg 4", "Thg 5", "Thg 6", "Thg 7", "Thg 8", "Thg 9", "Thg 10", "Thg 11", "Thg 12"]
    bar_w = 40
    for bi, mth in enumerate(months):
        bx = mx + 60 + bi * 75
        bh = 60 + (bi * 17) % 180
        draw.rounded_rectangle([bx, 480 - bh, bx + bar_w, 480], radius=4, fill="#DC2626")
        draw.text((bx + 2, 490), mth, fill="#64748B", font=get_font(10))

    # Recent Orders Table
    draw.rounded_rectangle([mx, 540, width - 40, 750], radius=14, fill="#FFFFFF", outline="#E2E8F0")
    draw.text((mx + 20, 555), "📦 Đơn Hàng Mới Nhất", fill="#0F172A", font=get_font(13, bold=True))
    draw.text((mx + 20, 590), "Mã Đơn   |  Khách Hàng    |  Sản Phẩm                     |  Số Tiền        |  Phương Thức   |  Trạng Thái", fill="#64748B", font=get_font(11, bold=True))
    draw.line([mx + 20, 610, width - 60, 610], fill="#E2E8F0", width=1)
    
    order_rows = [
        ("MT544358", "Lê Hồng Phúc", "iPhone 16 Pro Max 256GB Desert", "34.990.000đ", "VietQR 24/7", "Đã thanh toán (3s)"),
        ("MT481201", "Nguyễn Văn An", "Asus ROG Zephyrus G16 Ultra 9", "48.990.000đ", "VietQR 24/7", "Đã thanh toán (SePay)"),
        ("MT392184", "Trần Thị Bích", "Samsung Galaxy S25 Ultra 512GB", "31.490.000đ", "Thanh toán COD", "Đang giao hàng")
    ]
    for oi, (oc, on, op, oa, om, os_txt) in enumerate(order_rows):
        oy = 625 + oi * 35
        draw.text((mx + 20, oy), f"{oc}   |  {on[:12]:12}  |  {op[:25]:25}  |  {oa:12}  |  {om:12}  |  {os_txt}", fill="#1E293B", font=get_font(11))

    img.save('generated_diagrams/hinh_5_4_admin_dashboard.jpg', quality=95)
    print("Created hinh_5_4_admin_dashboard.jpg")

create_home_ui()
create_product_detail_ui()
create_payment_ui()
create_admin_dashboard_ui()
print("ALL UI MOCKUPS GENERATED SUCCESSFULLY!")
