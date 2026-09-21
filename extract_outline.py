import re

with open('docx_analysis.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('outline.txt', 'w', encoding='utf-8') as out:
    for line in lines:
        if '(Heading' in line or any(k in line.upper() for k in ['CHƯƠNG', 'LỜI CẢM ƠN', 'DANH MỤC', 'MỤC LỤC', 'KẾT LUẬN', 'TÀI LIỆU THAM KHẢO', 'HÌNH ']):
            out.write(line)

print('Wrote outline.txt')
