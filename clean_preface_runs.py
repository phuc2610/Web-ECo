import sys, docx
from docx.shared import Pt
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

sys.stdout.reconfigure(encoding='utf-8')
doc = docx.Document('Website-ban-quan-ao.docx')

for i in [59, 61, 63, 65, 67, 69, 71, 72, 73]:
    p = doc.paragraphs[i]
    # Keep only the last non-empty run if multiple runs exist
    runs_to_remove = [r for r in p.runs if not r.text.strip()]
    for r in runs_to_remove:
        p._element.remove(r._r)
    
    # Ensure all remaining runs have Times New Roman
    for r in p.runs:
        r.font.name = 'Times New Roman'
        rPr = r._r.get_or_add_rPr()
        rFonts = rPr.find(qn('w:rFonts'))
        if rFonts is None:
            rFonts = OxmlElement('w:rFonts')
            rPr.append(rFonts)
        rFonts.set(qn('w:ascii'), 'Times New Roman')
        rFonts.set(qn('w:hAnsi'), 'Times New Roman')
        rFonts.set(qn('w:cs'), 'Times New Roman')
        rFonts.set(qn('w:eastAsia'), 'Times New Roman')

doc.save('Website-ban-quan-ao.docx')
print("Cleaned runs and verified Times New Roman for all preface paragraphs!")
