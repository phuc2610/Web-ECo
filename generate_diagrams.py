import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from PIL import Image

os.makedirs('generated_diagrams', exist_ok=True)
plt.rcParams['font.sans-serif'] = 'DejaVu Sans'

def create_architecture_diagram():
    fig, ax = plt.subplots(figsize=(12, 7.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')
    
    # Title
    ax.text(50, 96, "SƠ ĐỒ KIẾN TRÚC HỆ THỐNG WEBSITE MINH TUẤN SHOP (3 LỚP)", 
            fontsize=14, fontweight='bold', ha='center', color='#1E293B')
    
    # Layer 1: Client / Presentation
    rect1 = patches.FancyBboxPatch((4, 65), 92, 26, boxstyle="round,pad=1", 
                                  edgecolor='#2563EB', facecolor='#EFF6FF', linewidth=2)
    ax.add_patch(rect1)
    ax.text(8, 87, "TẦNG GIAO DIỆN NGƯỜI DÙNG (PRESENTATION LAYER - REACTJS & VITE)", 
            fontsize=11, fontweight='bold', color='#1E40AF')
    
    client_boxes = [
        ("Giao diện Khách hàng (Customer Web)", "Trang chủ, Danh mục máy tính & điện thoại,\nChi tiết cấu hình, Giỏ hàng, Wishlist,\nSo sánh, Đánh giá sản phẩm, Tin tức", 6, 67, 43, 17),
        ("Giao diện Quản trị viên (Admin Portal)", "Dashboard thống kê doanh thu, đơn hàng,\nQuản lý sản phẩm (Máy tính/Điện thoại),\nQuản lý đơn hàng, Tài khoản, Live Chat", 51, 67, 43, 17)
    ]
    for title, desc, x, y, w, h in client_boxes:
        r = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.5", 
                                  edgecolor='#3B82F6', facecolor='#FFFFFF', linewidth=1.5)
        ax.add_patch(r)
        ax.text(x + w/2, y + h - 4, title, fontsize=9.5, fontweight='bold', ha='center', color='#1E3A8A')
        ax.text(x + w/2, y + 4, desc, fontsize=8, ha='center', color='#475569', linespacing=1.3)
        
    # Arrow 1 -> 2
    ax.annotate('', xy=(50, 58), xytext=(50, 65),
                arrowprops=dict(facecolor='#0284C7', edgecolor='#0284C7', width=2, headwidth=8))
    ax.text(52, 61, "RESTful API / HTTPS Requests (JSON)", fontsize=9, fontweight='bold', color='#0369A1')

    # Layer 2: Application / Business Logic
    rect2 = patches.FancyBboxPatch((4, 31), 92, 26, boxstyle="round,pad=1", 
                                  edgecolor='#0D9488', facecolor='#F0FDFA', linewidth=2)
    ax.add_patch(rect2)
    ax.text(8, 53, "TẦNG XỬ LÝ NGHIỆP VỤ (APPLICATION LAYER - NODE.JS & EXPRESS.JS)", 
            fontsize=11, fontweight='bold', color='#0F766E')
            
    api_modules = [
        ("Auth & Security Middleware", "JWT Verification, bcrypt,\nPhân quyền Admin/User", 6, 33, 21, 17),
        ("Product & Catalog Service", "Quản lý sản phẩm, thông số,\nbộ lọc giá, hãng, biến thể", 28.5, 33, 21, 17),
        ("Order & Payment Engine", "Tạo đơn hàng, mã MTxxxxxx,\nVietQR Napas247, Stripe, COD", 51, 33, 21, 17),
        ("Support & Extra Services", "Review ảnh, Chat real-time,\nCoupon Voucher, SePay Webhook", 73.5, 33, 21, 17)
    ]
    for title, desc, x, y, w, h in api_modules:
        r = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.5", 
                                  edgecolor='#14B8A6', facecolor='#FFFFFF', linewidth=1.5)
        ax.add_patch(r)
        ax.text(x + w/2, y + h - 4, title, fontsize=8.5, fontweight='bold', ha='center', color='#115E59')
        ax.text(x + w/2, y + 4, desc, fontsize=7.5, ha='center', color='#475569', linespacing=1.3)

    # Arrow 2 -> 3
    ax.annotate('', xy=(50, 24), xytext=(50, 31),
                arrowprops=dict(facecolor='#0D9488', edgecolor='#0D9488', width=2, headwidth=8))
    ax.text(52, 27, "TCP / Mongoose ODM & External Cloud APIs", fontsize=9, fontweight='bold', color='#0F766E')

    # Layer 3: Database & Cloud Services
    rect3 = patches.FancyBboxPatch((4, 2), 92, 21, boxstyle="round,pad=1", 
                                  edgecolor='#D97706', facecolor='#FFFBEB', linewidth=2)
    ax.add_patch(rect3)
    ax.text(8, 19.5, "TẦNG DỮ LIỆU & DỊCH VỤ NGOÀI (DATA & EXTERNAL CLOUD SERVICES)", 
            fontsize=11, fontweight='bold', color='#B45309')
            
    db_services = [
        ("MongoDB Atlas (Cloud)", "Lưu trữ Users, Products, Orders,\nReviews, Coupons, SePay Txs", 6, 4, 27, 13),
        ("Cloudinary Media CDN", "Lưu trữ và tối ưu hình ảnh\nmáy tính, điện thoại, review", 36, 4, 27, 13),
        ("Cổng Thanh Toán SePay & Stripe", "SePay Webhook ngân hàng VN,\nVietQR Napas 24/7 & Stripe quốc tế", 66, 4, 28, 13)
    ]
    for title, desc, x, y, w, h in db_services:
        r = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.5", 
                                  edgecolor='#F59E0B', facecolor='#FFFFFF', linewidth=1.5)
        ax.add_patch(r)
        ax.text(x + w/2, y + h - 4, title, fontsize=8.5, fontweight='bold', ha='center', color='#92400E')
        ax.text(x + w/2, y + 3, desc, fontsize=7.5, ha='center', color='#475569', linespacing=1.2)

    plt.tight_layout()
    plt.savefig('generated_diagrams/hinh_2_1_kien_truc.jpg', format='jpg', dpi=300)
    plt.close()
    print("Created hinh_2_1_kien_truc.jpg")

def create_usecase_general():
    fig, ax = plt.subplots(figsize=(11, 8.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')
    
    ax.text(50, 97, "SƠ ĐỒ USE CASE TỔNG THỂ HỆ THỐNG MINH TUẤN SHOP", 
            fontsize=13, fontweight='bold', ha='center', color='#0F172A')

    # System boundary
    sys_rect = patches.FancyBboxPatch((24, 4), 52, 90, boxstyle="round,pad=1", 
                                      edgecolor='#334155', facecolor='#F8FAFC', linewidth=2)
    ax.add_patch(sys_rect)
    ax.text(50, 91, "Hệ Thống Thương Mại Điện Tử Minh Tuấn Shop", fontsize=11, fontweight='bold', ha='center', color='#334155')

    # Actors
    # User Actor (Left)
    ax.plot([10, 10], [52, 45], color='#1E40AF', lw=2.5) # Body
    c1 = plt.Circle((10, 55), 2.5, color='#1E40AF', fill=False, lw=2.5) # Head
    ax.add_patch(c1)
    ax.plot([5, 15], [49, 49], color='#1E40AF', lw=2.5) # Arms
    ax.plot([10, 6], [45, 38], color='#1E40AF', lw=2.5) # Leg L
    ax.plot([10, 14], [45, 38], color='#1E40AF', lw=2.5) # Leg R
    ax.text(10, 33, "Khách Hàng\n(Customer)", fontsize=10, fontweight='bold', ha='center', color='#1E40AF')

    # Admin Actor (Right)
    ax.plot([90, 90], [52, 45], color='#DC2626', lw=2.5) # Body
    c2 = plt.Circle((90, 55), 2.5, color='#DC2626', fill=False, lw=2.5) # Head
    ax.add_patch(c2)
    ax.plot([85, 95], [49, 49], color='#DC2626', lw=2.5) # Arms
    ax.plot([90, 86], [45, 38], color='#DC2626', lw=2.5) # Leg L
    ax.plot([90, 94], [45, 38], color='#DC2626', lw=2.5) # Leg R
    ax.text(90, 33, "Quản Trị Viên\n(Admin)", fontsize=10, fontweight='bold', ha='center', color='#DC2626')

    # Use Cases (Ellipses)
    use_cases = [
        ("Đăng ký & Đăng nhập", 50, 84, '#DBEAFE', '#1D4ED8', 'both'),
        ("Tìm kiếm & Lọc sản phẩm (Hãng, Giá)", 50, 75, '#DBEAFE', '#1D4ED8', 'user'),
        ("Xem chi tiết & Chọn phiên bản máy", 50, 66, '#DBEAFE', '#1D4ED8', 'user'),
        ("Quản lý Giỏ hàng & Danh sách yêu thích", 50, 57, '#DBEAFE', '#1D4ED8', 'user'),
        ("Đặt hàng & Thanh toán (VietQR/COD/Stripe)", 50, 48, '#DBEAFE', '#1D4ED8', 'user'),
        ("Đánh giá sản phẩm & Viết review ảnh", 50, 39, '#DBEAFE', '#1D4ED8', 'user'),
        ("Tra cứu & Theo dõi trạng thái đơn hàng", 50, 30, '#DBEAFE', '#1D4ED8', 'user'),
        ("Quản lý Sản phẩm (Thêm/Sửa/Tồn kho)", 50, 21, '#FEE2E2', '#B91C1C', 'admin'),
        ("Quản lý Đơn hàng & Xác nhận thanh toán", 50, 12, '#FEE2E2', '#B91C1C', 'admin'),
        ("Dashboard Báo cáo & Thống kê doanh thu", 50, 5, '#FEE2E2', '#B91C1C', 'admin'),
    ]

    for title, x, y, bg, border, actor_type in use_cases:
        ellipse = patches.Ellipse((x, y), 38, 5.8, edgecolor=border, facecolor=bg, linewidth=1.5)
        ax.add_patch(ellipse)
        ax.text(x, y, title, fontsize=8.5, fontweight='bold', ha='center', va='center', color=border)
        
        # Connect to User
        if actor_type in ['user', 'both']:
            ax.plot([13, x - 19], [49, y], color='#94A3B8', linestyle='-', linewidth=1.2)
        # Connect to Admin
        if actor_type in ['admin', 'both']:
            ax.plot([87, x + 19], [49, y], color='#94A3B8', linestyle='-', linewidth=1.2)

    plt.tight_layout()
    plt.savefig('generated_diagrams/hinh_3_1_usecase_tong_the.jpg', format='jpg', dpi=300)
    plt.close()
    print("Created hinh_3_1_usecase_tong_the.jpg")

def create_usecase_admin():
    fig, ax = plt.subplots(figsize=(10, 8), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    ax.text(50, 96, "SƠ ĐỒ USE CASE CHI TIẾT DÀNH CHO QUẢN TRỊ VIÊN (ADMIN)", 
            fontsize=13, fontweight='bold', ha='center', color='#991B1B')

    # Admin Actor (Left)
    ax.plot([12, 12], [54, 46], color='#DC2626', lw=2.8)
    c = plt.Circle((12, 57), 2.8, color='#DC2626', fill=False, lw=2.8)
    ax.add_patch(c)
    ax.plot([6, 18], [51, 51], color='#DC2626', lw=2.8)
    ax.plot([12, 7], [46, 38], color='#DC2626', lw=2.8)
    ax.plot([12, 17], [46, 38], color='#DC2626', lw=2.8)
    ax.text(12, 33, "Quản Trị Viên\n(Admin)", fontsize=11, fontweight='bold', ha='center', color='#DC2626')

    # System Box
    box = patches.FancyBboxPatch((28, 5), 68, 88, boxstyle="round,pad=1", 
                                edgecolor='#DC2626', facecolor='#FFF1F2', linewidth=2)
    ax.add_patch(box)
    ax.text(62, 89, "Phân Hệ Quản Trị Hệ Thống Minh Tuấn Shop", fontsize=11, fontweight='bold', ha='center', color='#991B1B')

    admin_uc = [
        ("Đăng nhập quyền Quản trị (Admin Auth)", 62, 81),
        ("Xem Thống kê Dashboard & Biểu đồ doanh thu", 62, 71),
        ("Thêm mới sản phẩm (Máy tính/Điện thoại)", 62, 61),
        ("Upload & Tối ưu hình ảnh qua Cloudinary", 62, 51),
        ("Cập nhật số lượng tồn kho theo phiên bản (RAM/ROM)", 62, 41),
        ("Quản lý danh sách & Chi tiết đơn hàng", 62, 31),
        ("Cập nhật trạng thái giao hàng & Đã thanh toán", 62, 21),
        ("Quản lý tài khoản khách hàng & Phân quyền", 62, 11),
    ]

    for title, x, y in admin_uc:
        el = patches.Ellipse((x, y), 50, 6.2, edgecolor='#E11D48', facecolor='#FFFFFF', linewidth=1.5)
        ax.add_patch(el)
        ax.text(x, y, title, fontsize=8.5, fontweight='bold', ha='center', va='center', color='#9F1239')
        ax.plot([16, x - 25], [50, y], color='#FDA4AF', linestyle='-', linewidth=1.3)

    plt.tight_layout()
    plt.savefig('generated_diagrams/hinh_3_2_usecase_admin.jpg', format='jpg', dpi=300)
    plt.close()
    print("Created hinh_3_2_usecase_admin.jpg")

def create_usecase_user():
    fig, ax = plt.subplots(figsize=(10, 8.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    ax.text(50, 96.5, "SƠ ĐỒ USE CASE CHI TIẾT DÀNH CHO KHÁCH HÀNG (USER)", 
            fontsize=13, fontweight='bold', ha='center', color='#1E3A8A')

    # User Actor
    ax.plot([12, 12], [54, 46], color='#2563EB', lw=2.8)
    c = plt.Circle((12, 57), 2.8, color='#2563EB', fill=False, lw=2.8)
    ax.add_patch(c)
    ax.plot([6, 18], [51, 51], color='#2563EB', lw=2.8)
    ax.plot([12, 7], [46, 38], color='#2563EB', lw=2.8)
    ax.plot([12, 17], [46, 38], color='#2563EB', lw=2.8)
    ax.text(12, 33, "Khách Hàng\n(User)", fontsize=11, fontweight='bold', ha='center', color='#1E40AF')

    # System Box
    box = patches.FancyBboxPatch((28, 4), 68, 89, boxstyle="round,pad=1", 
                                edgecolor='#2563EB', facecolor='#EFF6FF', linewidth=2)
    ax.add_patch(box)
    ax.text(62, 89.5, "Phân Hệ Khách Hàng - Minh Tuấn Shop", fontsize=11, fontweight='bold', ha='center', color='#1E40AF')

    user_uc = [
        ("Đăng ký / Đăng nhập tài khoản cá nhân", 62, 82),
        ("Tìm kiếm sản phẩm & Lọc theo hãng, giá, danh mục", 62, 72.5),
        ("Xem chi tiết thông số kỹ thuật & Chọn dung lượng/màu", 62, 63),
        ("Thêm sản phẩm vào Giỏ hàng / Mua ngay", 62, 53.5),
        ("Áp dụng Mã giảm giá (Voucher MINHTUAN10...)", 62, 44),
        ("Thanh toán tự động qua VietQR 24/7 (SePay) hoặc COD", 62, 34.5),
        ("Quản lý danh sách Yêu thích (Wishlist) & So sánh", 62, 25),
        ("Viết Đánh giá & Gửi ảnh review thực tế", 62, 15.5),
        ("Tra cứu lịch sử đơn hàng & Hủy đơn khi cần", 62, 6.5),
    ]

    for title, x, y in user_uc:
        el = patches.Ellipse((x, y), 50, 5.8, edgecolor='#2563EB', facecolor='#FFFFFF', linewidth=1.5)
        ax.add_patch(el)
        ax.text(x, y, title, fontsize=8.5, fontweight='bold', ha='center', va='center', color='#1E3A8A')
        ax.plot([16, x - 25], [50, y], color='#93C5FD', linestyle='-', linewidth=1.3)

    plt.tight_layout()
    plt.savefig('generated_diagrams/hinh_3_3_usecase_user.jpg', format='jpg', dpi=300)
    plt.close()
    print("Created hinh_3_3_usecase_user.jpg")

def create_erd_diagram():
    fig, ax = plt.subplots(figsize=(12, 8.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    ax.text(50, 97, "SƠ ĐỒ ERD CƠ SỞ DỮ LIỆU MONGODB (MINH TUẤN SHOP)", 
            fontsize=13, fontweight='bold', ha='center', color='#0F172A')

    tables = [
        # (title, fields, x, y, w, h, header_color)
        ("USER (users)", 
         ["_id: ObjectId (PK)", "name: String", "email: String (Unique)", "password: String (Hashed)", "cartData: Object", "role: String (user/admin)", "createdAt: Date"],
         4, 63, 27, 30, '#1E40AF'),
         
        ("PRODUCT (products)",
         ["_id: ObjectId (PK)", "name: String", "description: String", "price: Number", "originalPrice: Number", "category: String", "subCategory: String", "sizes: Array (128GB...)", "stockQuantities: Object", "image: Array", "bestseller: Boolean"],
         36.5, 59, 28, 34, '#047857'),
         
        ("ORDER (orders)",
         ["_id: ObjectId (PK)", "userId: String (FK)", "items: Array (Cart items)", "amount: Number", "voucherCode: String", "discountAmount: Number", "address: Object", "paymentMethod: String", "payment: Boolean", "status: String", "orderCode: String (MTxxxxxx)", "paymentDetails: Object"],
         68.5, 53, 28, 40, '#B91C1C'),
         
        ("REVIEW (reviews)",
         ["_id: ObjectId (PK)", "userId: ObjectId (FK)", "productId: ObjectId (FK)", "rating: Number (1-5)", "comment: String", "images: Array", "createdAt: Date"],
         4, 18, 27, 28, '#4338CA'),
         
        ("SEPAY TRANSACTION",
         ["_id: ObjectId (PK)", "sepayId: Number (Unique)", "gateway: String (MBBank)", "transactionDate: String", "transferAmount: Number", "content: String", "orderCode: String (FK)", "referenceCode: String"],
         36.5, 18, 28, 28, '#D97706'),
         
        ("COUPON / VOUCHER",
         ["_id: ObjectId (PK)", "code: String (Unique)", "discountType: String", "discountValue: Number", "minOrderValue: Number", "maxDiscount: Number", "usageLimit: Number", "usedCount: Number", "isActive: Boolean"],
         68.5, 18, 28, 28, '#0F766E')
    ]

    for title, fields, x, y, w, h, col in tables:
        # Box container
        box = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.3", 
                                    edgecolor=col, facecolor='#FFFFFF', linewidth=1.8)
        ax.add_patch(box)
        # Header box
        hdr = patches.Rectangle((x, y + h - 5.5), w, 5.5, facecolor=col)
        ax.add_patch(hdr)
        ax.text(x + w/2, y + h - 3.2, title, fontsize=9, fontweight='bold', ha='center', va='center', color='#FFFFFF')
        
        # Fields
        for fi, f in enumerate(fields):
            weight = 'bold' if '(PK)' in f or '(FK)' in f else 'normal'
            f_col = '#1E293B' if '(PK)' not in f else '#B91C1C'
            ax.text(x + 1.5, y + h - 8.5 - fi * 2.7, f, fontsize=7.2, fontweight=weight, color=f_col)

    # Relationships lines
    # User -> Order
    ax.annotate("", xy=(68.5, 78), xytext=(31, 78),
                arrowprops=dict(arrowstyle="->", color="#2563EB", lw=1.8))
    ax.text(49.5, 79, "1 : N (Tạo đơn)", fontsize=8, fontweight='bold', color="#1E40AF", ha='center')

    # Product -> Order
    ax.annotate("", xy=(68.5, 68), xytext=(64.5, 68),
                arrowprops=dict(arrowstyle="->", color="#059669", lw=1.8))
    ax.text(66.5, 70, "N : M", fontsize=8, fontweight='bold', color="#047857", ha='center')

    # User -> Review
    ax.annotate("", xy=(17.5, 46), xytext=(17.5, 63),
                arrowprops=dict(arrowstyle="->", color="#4338CA", lw=1.8))
    ax.text(19, 54, "1 : N", fontsize=8, fontweight='bold', color="#4338CA")

    # Order -> SePay
    ax.annotate("", xy=(64.5, 32), xytext=(68.5, 55),
                arrowprops=dict(arrowstyle="->", color="#D97706", lw=1.8))
    ax.text(62, 44, "Khớp mã MTxxxxxx", fontsize=7.5, fontweight='bold', color="#B45309", ha='center')

    # Coupon -> Order
    ax.annotate("", xy=(82.5, 53), xytext=(82.5, 46),
                arrowprops=dict(arrowstyle="->", color="#0F766E", lw=1.8))
    ax.text(84, 49, "Áp dụng", fontsize=7.5, fontweight='bold', color="#0F766E")

    plt.tight_layout()
    plt.savefig('generated_diagrams/hinh_3_4_erd_mongodb.jpg', format='jpg', dpi=300)
    plt.close()
    print("Created hinh_3_4_erd_mongodb.jpg")

def create_vietqr_flow_diagram():
    fig, ax = plt.subplots(figsize=(11, 8.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    ax.text(50, 97, "SƠ ĐỒ LUỒNG THANH TOÁN TỰ ĐỘNG VIETQR 24/7 & SEPAY WEBHOOK", 
            fontsize=13, fontweight='bold', ha='center', color='#065F46')

    steps = [
        ("1. Khách Hàng Đặt Hàng", "Chọn phương thức 'Chuyển khoản VietQR'\ntại trang /place-order và bấm Đặt Hàng", 50, 88, '#10B981', '#ECFDF5'),
        ("2. Backend Khởi Tạo Đơn & Mã Định Danh", "Sinh mã đơn hàng duy nhất MTxxxxxx (VD: MT544358),\ntạo VietQR Napas247 URL: https://img.vietqr.io/...", 50, 74, '#059669', '#F0FDF4'),
        ("3. Cổng Thanh Toán Hiển Thị (/payment/:id)", "Mã QR động chứa sẵn STK (MBBank), số tiền, nội dung CK.\nĐếm ngược 15 phút và Frontend Polling kiểm tra mỗi 3s", 50, 60, '#0284C7', '#F0F9FF'),
        ("4. Khách Quét Mã QR Qua App Ngân Hàng", "Mở app ngân hàng (VCB, MB, Techcom, BIDV, Momo...),\nquét mã QR và xác nhận chuyển khoản tức thì 24/7", 50, 46, '#2563EB', '#EFF6FF'),
        ("5. SePay Giám Sát & Bắn Webhook HTTP POST", "SePay phát hiện giao dịch ngân hàng thành công,\ngửi webhook kèm nội dung CK, số tiền, mã tham chiếu FT", 50, 32, '#D97706', '#FFFBEB'),
        ("6. Backend Đối Soát & Kích Hoạt Đơn Tức Thì", "Xác thực API Key, đối soát regex MTxxxxxx và số tiền,\ncập nhật đơn hàng -> 'Đã thanh toán', trả 200 {'success': true}", 50, 18, '#DC2626', '#FEF2F2'),
        ("7. Frontend Polling Nhận Kết Quả Thành Công", "Cổng thanh toán tự động chuyển sang trạng thái đã thanh toán,\nhiển thị thông báo thành công và điều hướng sang /orders", 50, 4, '#059669', '#ECFDF5')
    ]

    for idx, (title, desc, x, y, border, bg) in enumerate(steps):
        r = patches.FancyBboxPatch((x - 38, y - 4), 76, 8, boxstyle="round,pad=0.5", 
                                  edgecolor=border, facecolor=bg, linewidth=2)
        ax.add_patch(r)
        ax.text(x, y + 1.2, title, fontsize=9.5, fontweight='bold', ha='center', color=border)
        ax.text(x, y - 2.2, desc, fontsize=8, ha='center', color='#334155', linespacing=1.2)
        
        # Arrow down
        if idx < len(steps) - 1:
            ax.annotate("", xy=(50, y - 4.5), xytext=(50, y - 1.5 - 6),
                        arrowprops=dict(facecolor=border, edgecolor=border, width=2, headwidth=7))

    plt.tight_layout()
    plt.savefig('generated_diagrams/hinh_3_5_luong_thanh_toan_vietqr.jpg', format='jpg', dpi=300)
    plt.close()
    print("Created hinh_3_5_luong_thanh_toan_vietqr.jpg")

def create_frontend_structure_diagram():
    fig, ax = plt.subplots(figsize=(10, 7.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    ax.text(50, 96, "CẤU TRÚC THƯ MỤC MÃ NGUỒN FRONTEND & BACKEND (MINH TUẤN SHOP)", 
            fontsize=12, fontweight='bold', ha='center', color='#1E293B')

    fe_text = """📁 frontend/src/ (Client Application)
├── 📁 assets/          # Logo Minh Tuấn, icons, hình ảnh
├── 📁 components/      # Navbar, Footer, ProductItem, DeviceCategoryIcon,
│                       SearchBar, Title, ChatWidget, ReviewForm...
├── 📁 context/         # ShopContext (Quản lý State, Giỏ hàng, Wishlist)
├── 📁 pages/
│   ├── Home.jsx        # Trang chủ: Hero, Flash Sale, Danh mục, Bán chạy
│   ├── Collection.jsx  # Danh mục máy tính, điện thoại & Bộ lọc đa năng
│   ├── Product.jsx     # Chi tiết sản phẩm, chọn cấu hình (RAM/ROM)
│   ├── Cart.jsx        # Giỏ hàng & Cập nhật số lượng
│   ├── PlaceOrder.jsx  # Đặt hàng (VietQR 24/7, COD, Stripe, Voucher)
│   ├── PaymentGateway.jsx # Cổng thanh toán VietQR động & Auto polling
│   ├── Orders.jsx      # Lịch sử đơn hàng, Thanh toán lại QR, Hủy đơn
│   ├── Wishlist.jsx    # Danh sách thiết bị yêu thích
│   ├── Compare.jsx     # So sánh thông số kỹ thuật 2-4 thiết bị
│   ├── News.jsx        # Tin tức công nghệ, thủ thuật điện thoại/PC
│   ├── Login.jsx       # Đăng nhập & Đăng ký bảo mật
│   └── Profile.jsx     # Hồ sơ cá nhân & Đổi mật khẩu
└── App.jsx             # React Router DOM cấu hình định tuyến"""

    be_text = """📁 backend/ (Server Application)
├── 📁 config/
│   ├── mongodb.js      # Kết nối MongoDB Atlas
│   └── cloudinary.js   # Cấu hình SDK lưu trữ ảnh Cloudinary
├── 📁 controllers/
│   ├── productController.js  # CRUD sản phẩm, biến thể, upload ảnh
│   ├── orderController.js    # Xử lý đơn hàng, coupon, Stripe
│   ├── paymentController.js  # VietQR order, SePay webhook, Test mode
│   ├── userController.js     # Đăng ký, đăng nhập, JWT token, profile
│   ├── reviewController.js   # Đánh giá sao & upload ảnh review
│   └── chatController.js     # Tin nhắn hỗ trợ khách hàng
├── 📁 middleware/
│   ├── auth.js         # Xác thực JWT người dùng
│   ├── adminAuth.js    # Kiểm tra quyền quản trị viên
│   └── multer.js       # Xử lý multipart upload hình ảnh
├── 📁 models/          # Mongoose Schema (User, Product, Order...)
├── 📁 routes/          # Express API Endpoints (/api/product, /api/payment...)
└── server.js           # Khởi chạy Express Server cổng 4000"""

    r1 = patches.FancyBboxPatch((4, 4), 44, 88, boxstyle="round,pad=0.8", 
                                edgecolor='#2563EB', facecolor='#F8FAFC', linewidth=1.5)
    ax.add_patch(r1)
    ax.text(6, 88, fe_text, fontsize=7.2, fontfamily='monospace', color='#0F172A', linespacing=1.25)

    r2 = patches.FancyBboxPatch((52, 4), 44, 88, boxstyle="round,pad=0.8", 
                                edgecolor='#059669', facecolor='#F8FAFC', linewidth=1.5)
    ax.add_patch(r2)
    ax.text(54, 88, be_text, fontsize=7.2, fontfamily='monospace', color='#0F172A', linespacing=1.25)

    plt.tight_layout()
    plt.savefig('generated_diagrams/hinh_4_1_cau_truc_thu_muc.jpg', format='jpg', dpi=300)
    plt.close()
    print("Created hinh_4_1_cau_truc_thu_muc.jpg")

create_architecture_diagram()
create_usecase_general()
create_usecase_admin()
create_usecase_user()
create_erd_diagram()
create_vietqr_flow_diagram()
create_frontend_structure_diagram()
print("ALL DIAGRAMS GENERATED SUCCESSFULLY!")
