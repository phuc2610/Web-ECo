import docx

doc = docx.Document('Website-ban-quan-ao.docx')
with open('captions.txt', 'w', encoding='utf-8') as f:
    for i, p in enumerate(doc.paragraphs):
        txt = p.text.strip()
        if any(k in txt for k in ['Hình ', 'Ảnh ', 'HÌNH ', 'ẢNH ']):
            f.write(f'P{i}: {txt}\n')

print('Wrote captions.txt')
