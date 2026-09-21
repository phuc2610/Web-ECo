import zipfile
import shutil
import os

def replace_media_in_zip(src_docx, out_docx, replacements):
    with zipfile.ZipFile(src_docx, 'r') as zin:
        with zipfile.ZipFile(out_docx, 'w', zipfile.ZIP_DEFLATED) as zout:
            for item in zin.infolist():
                if item.filename in replacements:
                    with open(replacements[item.filename], 'rb') as f:
                        zout.writestr(item, f.read())
                    print(f'Replaced {item.filename} with {replacements[item.filename]}')
                else:
                    zout.writestr(item, zin.read(item.filename))

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

replace_media_in_zip('Website-ban-quan-ao.docx', 'Website-ban-quan-ao-replaced.docx', replacements)
print('Done media replacement test!')
