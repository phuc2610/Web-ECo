import docx

doc = docx.Document('Website-ban-quan-ao.docx')
with open('all_tables_info.txt', 'w', encoding='utf-8') as f:
    for i, t in enumerate(doc.tables):
        f.write(f'=== Table {i}: {len(t.rows)} rows x {len(t.columns)} cols ===\n')
        for ri in range(min(5, len(t.rows))):
            cells = [c.text.strip().replace('\n', ' ') for c in t.rows[ri].cells]
            f.write(f'  Row {ri}: {" | ".join(cells)}\n')
        f.write('\n')

print('Wrote all_tables_info.txt')
