import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import re
import os
import zipfile
import shutil

import sys
sys.stdout.reconfigure(encoding='utf-8')

print("=== BẮT ĐẦU CẬP NHẬT TÀI LIỆU WORD MINH TUẤN SHOP ===")

# 1. Bước 1: Thay thế các file ảnh cũ trong zip
src_file = "Website-ban-quan-ao.docx"
temp_zip = "temp_replaced.docx"

replacements = {
    'word/media/image7.jpg': 'generated_diagrams/hinh_2_1_kien_truc.jpg',
    'word/media/image8.jpg': 'generated_diagrams/hinh_3_1_usecase_tong_the.jpg',
    'word/media/image9.jpg': 'generated_diagrams/hinh_3_2_usecase_admin.jpg',
    'word/media/image10.jpg': 'generated_diagrams/hinh_3_3_usecase_user.jpg',
    'word/media/image11.jpg': 'generated_diagrams/hinh_3_4_erd_mongodb.jpg',
    'word/media/image12.jpg': 'generated_diagrams/hinh_4_1_cau_truc_thu_muc.jpg',
    'word/media/image13.jpg': 'generated_diagrams/hinh_5_1_giao_dien_trang_chu.jpg',
    'word/media/image14.jpg': 'generated_diagrams/hinh_5_2_giao_dien_san_pham.jpg',
}

with zipfile.ZipFile(src_file, 'r') as zin:
    with zipfile.ZipFile(temp_zip, 'w', zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            if item.filename in replacements:
                with open(replacements[item.filename], 'rb') as f:
                    zout.writestr(item, f.read())
                print(f"-> Đã thay thế ảnh {item.filename} bằng ảnh thực tế/diagram")
            else:
                zout.writestr(item, zin.read(item.filename))

# 2. Bước 2: Dùng python-docx để chỉnh sửa text, chèn ảnh mới, cập nhật font
doc = docx.Document(temp_zip)

# Từ điển thay thế từ ngữ thời trang / quần áo sang thiết bị công nghệ Minh Tuấn Shop
TEXT_REPLACEMENTS = [
    # Tên đề tài
    ("WEBSITE BÁN QUẦN ÁO", "WEBSITE BÁN MÁY TÍNH VÀ ĐIỆN THOẠI – MINH TUẤN SHOP"),
    ("Website bán quần áo – DL", "Website bán máy tính và điện thoại – Minh Tuấn Shop"),
    ("website bán quần áo – DL", "website bán máy tính và điện thoại – Minh Tuấn Shop"),
    ("Website thương mại điện tử kinh doanh quần áo – DL", "Website thương mại điện tử kinh doanh máy tính và điện thoại – Minh Tuấn Shop"),
    ("website thương mại điện tử kinh doanh quần áo – DL", "website thương mại điện tử kinh doanh máy tính và điện thoại – Minh Tuấn Shop"),
    ("website thương mại điện tử kinh doanh quần áo – web DL", "website thương mại điện tử kinh doanh máy tính và điện thoại – Minh Tuấn Shop"),
    ("Website DL", "Minh Tuấn Shop"),
    ("website DL", "Minh Tuấn Shop"),
    ("web DL", "Minh Tuấn Shop"),
    ("hệ thống Website DL", "hệ thống Minh Tuấn Shop"),
    ("hệ thống DL", "hệ thống Minh Tuấn Shop"),
    ("dự án Website DL", "dự án Minh Tuấn Shop"),
    ("Dự án Website DL", "Dự án Minh Tuấn Shop"),
    ("thương hiệu thời trang", "thương hiệu công nghệ"),
    ("ngành thời trang", "ngành bán lẻ thiết bị công nghệ (máy tính, điện thoại)"),
    ("ngành công nghiệp thời trang", "ngành công nghệ điện tử tiêu dùng"),
    ("sản phẩm quần áo", "sản phẩm máy tính, điện thoại và phụ kiện"),
    ("quần áo, các phụ kiện thời trang", "máy tính, điện thoại, máy tính bảng và phụ kiện công nghệ"),
    ("quần áo và phụ kiện", "máy tính, điện thoại và linh kiện"),
    ("quần áo", "máy tính và điện thoại"),
    ("cửa hàng thời trang", "cửa hàng thiết bị công nghệ"),
    ("cửa hàng quần áo", "cửa hàng máy tính và điện thoại"),
    ("đại lý quần áo", "đại lý thiết bị công nghệ"),
    ("mẫu áo", "mẫu thiết bị"),
    ("chiếc áo", "chiếc điện thoại hoặc máy tính"),
    ("bài toán hiển thị và lựa chọn size/màu", "bài toán cấu hình (RAM, ROM, bộ nhớ, chip) và màu sắc"),
    ("biến thể size, màu sắc", "biến thể cấu hình (RAM, ROM, dung lượng) và màu sắc"),
    ("kích cỡ/màu sắc", "cấu hình bộ nhớ và màu sắc"),
    ("kích cỡ", "cấu hình"),
    ("size, màu", "dung lượng, màu sắc"),
    ("5 size (S, M, L, XL, XXL) và 3 màu (Đỏ, Xanh, Đen)", "các tùy chọn bộ nhớ (128GB, 256GB, 512GB, 1TB) và các màu sắc (Titanium, Đen, Trắng, Bạc)"),
    ("Zara, Uniqlo, Shein", "CellphoneS, Thế Giới Di Động, FPT Shop"),
    
    # Thanh toán
    ("Chưa tích hợp các cổng thanh toán nội địa như Momo, ZaloPay hoặc VNPay (chỉ sử dụng Stripe)", 
     "Tích hợp hệ thống thanh toán tự động qua ngân hàng Việt Nam VietQR 24/7 (Napas247) kết hợp SePay Webhook, cổng thanh toán quốc tế Stripe và thanh toán khi nhận hàng COD"),
    ("chỉ sử dụng Stripe", "sử dụng VietQR 24/7 tự động (SePay), Stripe và COD"),
    ("cổng thanh toán Stripe", "cổng thanh toán tự động VietQR 24/7 (SePay) và Stripe"),
    ("thanh toán Stripe", "thanh toán tự động VietQR (SePay) và Stripe"),
    
    # Captions cũ sang Ảnh chuẩn
    ("Hình 1.1 Thực trạng mua sắm", "Ảnh 1.1 - Thực trạng mua sắm thiết bị công nghệ trực tuyến"),
    ("Hình 1.2 Nắm bắt nhu cầu của khách hàn", "Ảnh 1.2 - Nắm bắt nhu cầu của khách hàng đối với sản phẩm máy tính và điện thoại"),
    ("Hình 1.3 Sự quan tâm của khách hàng", "Ảnh 1.3 - Mức độ quan tâm của khách hàng đối với cấu hình và bảo hành"),
    ("Hình 1.4 Tham khảo chức năng khách hàng quan tâm", "Ảnh 1.4 - Các chức năng người dùng quan tâm trên website công nghệ"),
    ("Hình 1.5 Mong muốn của khách hàng", "Ảnh 1.5 - Mong muốn của khách hàng về thanh toán tự động và dịch vụ giao hàng"),
    ("Hình 2.1 Sơ đồ kiến trúc", "Ảnh 2.1 - Sơ đồ kiến trúc hệ thống Client - Server 3 lớp Minh Tuấn Shop"),
    ("Hình 3.1 Sơ đồ usecase tổng thể", "Ảnh 3.1 - Sơ đồ Use Case tổng thể hệ thống Minh Tuấn Shop"),
    ("Hình 3.1Sơ đồ Use Case chi tiết admin", "Ảnh 3.2 - Sơ đồ Use Case chi tiết Quản trị viên (Admin)"),
    ("Hình 3.3 Sơ đồ Use Case cho User", "Ảnh 3.3 - Sơ đồ Use Case chi tiết Khách hàng (User)"),
    ("Hình 3.4 Sơ đồ EDR Tổng Thể", "Ảnh 3.4 - Sơ đồ ERD cơ sở dữ liệu MongoDB Minh Tuấn Shop"),
    ("Hình 4.1. Cấu trúc Frontend", "Ảnh 4.1 - Cấu trúc thư mục mã nguồn Frontend và Backend"),
    ("Hình 5.1 Giao diện trang chủ user", "Ảnh 5.1 - Giao diện trang chủ khách hàng Minh Tuấn Shop"),
    ("Hình 5.2Giao diện trang sản phẩm", "Ảnh 5.2 - Giao diện chi tiết sản phẩm và chọn cấu hình bộ nhớ")
]

# Hàm thay thế chuỗi an toàn
def replace_in_text(text):
    res = text
    for old, new in TEXT_REPLACEMENTS:
        if old in res:
            res = res.replace(old, new)
    return res

# Cập nhật style Normal font
normal_style = doc.styles['Normal']
normal_style.font.name = 'Times New Roman'
normal_style.font.size = Pt(13)

# Cập nhật tất cả các Paragraphs
print("-> Đang cập nhật nội dung văn bản và chuẩn hóa font Times New Roman...")
for p in doc.paragraphs:
    # Set paragraph style font
    p.style.font.name = 'Times New Roman'
    
    # Kiểm tra và thay thế text
    old_full_text = p.text
    new_full_text = replace_in_text(old_full_text)
    
    if old_full_text != new_full_text:
        # Nếu có thay đổi, gán lại text
        p.text = new_full_text
        
    # Căn font Times New Roman cho từng Run
    for r in p.runs:
        r.font.name = 'Times New Roman'
        rPr = r._r.get_or_add_rPr()
        rFonts = rPr.get_or_add_rFonts()
        rFonts.set(qn('w:eastAsia'), 'Times New Roman')
        rFonts.set(qn('w:cs'), 'Times New Roman')
        rFonts.set(qn('w:ascii'), 'Times New Roman')
        rFonts.set(qn('w:hAnsi'), 'Times New Roman')

# Cập nhật tất cả các Tables
for table in doc.tables:
    for row in table.rows:
        for cell in row.cells:
            for p in cell.paragraphs:
                p.style.font.name = 'Times New Roman'
                old_t = p.text
                new_t = replace_in_text(old_t)
                if old_t != new_t:
                    p.text = new_t
                for r in p.runs:
                    r.font.name = 'Times New Roman'
                    rPr = r._r.get_or_add_rPr()
                    rFonts = rPr.get_or_add_rFonts()
                    rFonts.set(qn('w:eastAsia'), 'Times New Roman')
                    rFonts.set(qn('w:cs'), 'Times New Roman')
                    rFonts.set(qn('w:ascii'), 'Times New Roman')
                    rFonts.set(qn('w:hAnsi'), 'Times New Roman')

# 3. Bước 3: Cập nhật Bảng 1 (DANH MỤC HÌNH ẢNH)
print("-> Cập nhật bảng Danh mục hình ảnh...")
table_img = doc.tables[1]

# Các mục ảnh mới đầy đủ
new_image_list = [
    ("1", "Ảnh 1.1", "Thực trạng mua sắm thiết bị công nghệ trực tuyến"),
    ("2", "Ảnh 1.2", "Nắm bắt nhu cầu của khách hàng đối với máy tính và điện thoại"),
    ("3", "Ảnh 1.3", "Mức độ quan tâm của khách hàng đối với cấu hình và bảo hành"),
    ("4", "Ảnh 1.4", "Các chức năng người dùng quan tâm trên website công nghệ"),
    ("5", "Ảnh 1.5", "Mong muốn của khách hàng về thanh toán tự động và dịch vụ giao hàng"),
    ("6", "Ảnh 2.1", "Sơ đồ kiến trúc hệ thống Client - Server 3 lớp Minh Tuấn Shop"),
    ("7", "Ảnh 3.1", "Sơ đồ Use Case tổng thể hệ thống Minh Tuấn Shop"),
    ("8", "Ảnh 3.2", "Sơ đồ Use Case chi tiết Quản trị viên (Admin)"),
    ("9", "Ảnh 3.3", "Sơ đồ Use Case chi tiết Khách hàng (User)"),
    ("10", "Ảnh 3.4", "Sơ đồ ERD cơ sở dữ liệu MongoDB Minh Tuấn Shop"),
    ("11", "Ảnh 3.5", "Sơ đồ luồng thanh toán tự động VietQR 24/7 & SePay Webhook"),
    ("12", "Ảnh 4.1", "Cấu trúc thư mục mã nguồn Frontend và Backend"),
    ("13", "Ảnh 5.1", "Giao diện trang chủ khách hàng Minh Tuấn Shop"),
    ("14", "Ảnh 5.2", "Giao diện chi tiết sản phẩm và chọn phiên bản cấu hình"),
    ("15", "Ảnh 5.3", "Giao diện cổng thanh toán tự động VietQR 24/7 (SePay)"),
    ("16", "Ảnh 5.4", "Giao diện bảng điều khiển quản trị Admin Dashboard"),
    ("17", "Ảnh 5.5", "Giao diện danh mục sản phẩm và bộ lọc đa năng"),
    ("18", "Ảnh 5.6", "Giao diện thêm sản phẩm máy tính và điện thoại trong Admin")
]

# Xóa các dòng dữ liệu cũ trong Table 1 (từ dòng 1 trở đi)
while len(table_img.rows) > 1:
    tr = table_img.rows[-1]._tr
    tr.getparent().remove(tr)

# Thêm các dòng mới
for stt, hinh, mota in new_image_list:
    row = table_img.add_row()
    row.cells[0].text = stt
    row.cells[1].text = hinh
    row.cells[2].text = mota
    for ci in range(3):
        for p in row.cells[ci].paragraphs:
            p.style.font.name = 'Times New Roman'
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if ci < 2 else WD_ALIGN_PARAGRAPH.LEFT
            for r in p.runs:
                r.font.name = 'Times New Roman'
                r.font.size = Pt(12)
                rPr = r._r.get_or_add_rPr()
                rFonts = rPr.get_or_add_rFonts()
                rFonts.set(qn('w:eastAsia'), 'Times New Roman')
                rFonts.set(qn('w:cs'), 'Times New Roman')
                rFonts.set(qn('w:ascii'), 'Times New Roman')
                rFonts.set(qn('w:hAnsi'), 'Times New Roman')

# 4. Bước 4: Chèn các ảnh và sơ đồ mới vào đúng các chương
print("-> Đang chèn các sơ đồ và ảnh chụp màn hình thật vào tài liệu...")

# 4.1. Chèn Sơ đồ luồng thanh toán VietQR vào cuối phần 2.4 Chương 3 (sau P855)
found_p855 = None
for i, p in enumerate(doc.paragraphs):
    if "Luồng xử lý dữ liệu được chia thành ba phần chính" in p.text or "Sơ đồ EDR Tổng Thể" in p.text or "Ảnh 3.4" in p.text:
        found_p855 = p
        break

if found_p855:
    p_img35 = found_p855.insert_paragraph_before()
    p_img35.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_img35 = p_img35.add_run()
    r_img35.add_picture('generated_diagrams/hinh_3_5_luong_thanh_toan_vietqr.jpg', width=Inches(6.0))
    
    p_cap35 = found_p855.insert_paragraph_before()
    p_cap35.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_cap35 = p_cap35.add_run('Ảnh 3.5 - Sơ đồ luồng thanh toán tự động VietQR 24/7 & SePay Webhook')
    r_cap35.font.name = 'Times New Roman'
    r_cap35.font.size = Pt(11)
    r_cap35.font.italic = True
    r_cap35.font.bold = True
    print("-> Đã chèn Ảnh 3.5 (Sơ đồ luồng thanh toán VietQR)")

# 4.2. Chèn ảnh màn hình thật: Cổng thanh toán VietQR, Admin Dashboard, Danh mục, Thêm sản phẩm vào Chương 5
found_p_ui = None
for i, p in enumerate(doc.paragraphs):
    if "Ảnh 5.2" in p.text or "Giao diện trang sản phẩm" in p.text:
        found_p_ui = p
        break

if found_p_ui:
    # Chèn ảnh 5.3: Cổng thanh toán VietQR thật
    p_vietqr = found_p_ui.insert_paragraph_before()
    p_vietqr.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_vietqr = p_vietqr.add_run()
    r_vietqr.add_picture('generated_diagrams/hinh_5_3_thanh_toan_vietqr.jpg', width=Inches(6.2))
    
    p_cap53 = found_p_ui.insert_paragraph_before()
    p_cap53.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_cap53 = p_cap53.add_run('Ảnh 5.3 - Giao diện cổng thanh toán tự động VietQR 24/7 (SePay)')
    r_cap53.font.name = 'Times New Roman'
    r_cap53.font.size = Pt(11)
    r_cap53.font.italic = True
    r_cap53.font.bold = True

    # Chèn ảnh 5.5: Danh mục sản phẩm thật
    p_cat = found_p_ui.insert_paragraph_before()
    p_cat.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_cat = p_cat.add_run()
    r_cat.add_picture('generated_diagrams/hinh_5_5_giao_dien_danh_muc.jpg', width=Inches(6.2))
    
    p_cap55 = found_p_ui.insert_paragraph_before()
    p_cap55.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_cap55 = p_cap55.add_run('Ảnh 5.5 - Giao diện danh mục sản phẩm và bộ lọc đa năng')
    r_cap55.font.name = 'Times New Roman'
    r_cap55.font.size = Pt(11)
    r_cap55.font.italic = True
    r_cap55.font.bold = True
    print("-> Đã chèn Ảnh 5.3 và 5.5 (Ảnh chụp thật VietQR và Danh mục)")

# Chèn ảnh Admin Dashboard & Thêm sản phẩm
found_p_admin = None
for i, p in enumerate(doc.paragraphs):
    if "Quản trị hệ thống" in p.text or "Quản lý sản phẩm" in p.text and i > 1300:
        found_p_admin = p
        break

if not found_p_admin:
    found_p_admin = doc.paragraphs[-1]

p_admin_dash = found_p_admin.insert_paragraph_before()
p_admin_dash.alignment = WD_ALIGN_PARAGRAPH.CENTER
r_ad1 = p_admin_dash.add_run()
r_ad1.add_picture('generated_diagrams/hinh_5_4_admin_dashboard.jpg', width=Inches(6.2))

p_cap54 = found_p_admin.insert_paragraph_before()
p_cap54.alignment = WD_ALIGN_PARAGRAPH.CENTER
r_cap54 = p_cap54.add_run('Ảnh 5.4 - Giao diện bảng điều khiển quản trị Admin Dashboard')
r_cap54.font.name = 'Times New Roman'
r_cap54.font.size = Pt(11)
r_cap54.font.italic = True
r_cap54.font.bold = True

p_admin_add = found_p_admin.insert_paragraph_before()
p_admin_add.alignment = WD_ALIGN_PARAGRAPH.CENTER
r_ad2 = p_admin_add.add_run()
r_ad2.add_picture('generated_diagrams/hinh_5_6_admin_them_san_pham.jpg', width=Inches(6.2))

p_cap56 = found_p_admin.insert_paragraph_before()
p_cap56.alignment = WD_ALIGN_PARAGRAPH.CENTER
r_cap56 = p_cap56.add_run('Ảnh 5.6 - Giao diện thêm sản phẩm máy tính và điện thoại trong Admin')
r_cap56.font.name = 'Times New Roman'
r_cap56.font.size = Pt(11)
r_cap56.font.italic = True
r_cap56.font.bold = True
print("-> Đã chèn Ảnh 5.4 và 5.6 (Ảnh chụp thật Admin Dashboard và Thêm sản phẩm)")

# 5. Lưu lại tài liệu chính thức
output_final = "Website-ban-quan-ao.docx"
doc.save(output_final)
print(f"=== ĐÃ LƯU THÀNH CÔNG TÀI LIỆU CHÍNH THỨC: {output_final} ===")

# Dọn dẹp file tạm
if os.path.exists(temp_zip):
    os.remove(temp_zip)
