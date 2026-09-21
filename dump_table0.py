import docx

doc = docx.Document('Website-ban-quan-ao.docx')
t = doc.tables[0]
with open('table0_info.txt', 'w', encoding='utf-8') as f:
    for i, row in enumerate(t.rows):
        cells = [c.text.strip().replace('\n', ' ') for c in row.cells]
        f.write(f'Row {i}: {" | ".join(cells)}\n')

print('Wrote table0_info.txt')
