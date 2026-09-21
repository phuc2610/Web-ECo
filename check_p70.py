import sys, docx
sys.stdout.reconfigure(encoding='utf-8')
doc = docx.Document('Website-ban-quan-ao.docx')
for i in range(70, 78):
    p = doc.paragraphs[i]
    print(f'P[{i}]: text="{p.text}"')
