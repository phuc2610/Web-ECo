import docx
import sys
sys.stdout.reconfigure(encoding='utf-8')

doc = docx.Document('Website-ban-quan-ao.docx')

print('=== KIỂM TRA TÀI LIỆU WORD HOÀN THIỆN ===')
print('1. Tổng số đoạn văn (paragraphs):', len(doc.paragraphs))
print('2. Tổng số bảng (tables):', len(doc.tables))

# Kiểm tra bìa
print('\n3. Kiểm tra trang bìa:')
for i in [6, 8, 9, 15, 16, 26, 36, 39, 40, 47, 48, 50, 58]:
    if i < len(doc.paragraphs):
        print(f'   P[{i}]: {doc.paragraphs[i].text.strip()}')

# Kiểm tra Table 1 (Danh mục hình ảnh)
print('\n4. Kiểm tra Bảng Danh mục hình ảnh:')
t1 = doc.tables[1]
for r in t1.rows:
    row_text = [c.text.strip().replace('\n', ' ') for c in r.cells]
    print('   ', ' | '.join(row_text))

# Kiểm tra font của một số đoạn ngẫu nhiên
print('\n5. Kiểm tra font chữ (mẫu 10 đoạn):')
fonts_found = set()
for p in doc.paragraphs[60:75]:
    for r in p.runs:
        fonts_found.add(r.font.name)
print('   Các font tìm thấy:', fonts_found)

# Kiểm tra từ khóa còn sót lại
print('\n6. Kiểm tra từ khóa cũ (quần áo, thời trang):')
old_keywords = ['quần áo', 'áo thun', 'áo sơ mi', 'váy', 'size S']
found_old = {}
for i, p in enumerate(doc.paragraphs):
    for kw in old_keywords:
        if kw in p.text.lower():
            found_old[kw] = found_old.get(kw, 0) + 1

print('   Từ khóa cũ còn lại:', found_old)
