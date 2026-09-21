import zipfile
import xml.etree.ElementTree as ET

with zipfile.ZipFile('Website-ban-quan-ao.docx', 'r') as z:
    rels_xml = z.read('word/_rels/document.xml.rels')
    rels_tree = ET.fromstring(rels_xml)
    
    rId_to_target = {}
    for elem in rels_tree:
        rid = elem.attrib.get('Id')
        target = elem.attrib.get('Target')
        rId_to_target[rid] = target

    doc_xml = z.read('word/document.xml')
    doc_tree = ET.fromstring(doc_xml)
    
    ns = {
        'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
        'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
        'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
    }
    
    print('Mapping drawing blips to media targets:')
    for p_idx, p in enumerate(doc_tree.findall('.//w:p', ns)):
        blips = p.findall('.//a:blip', ns)
        if blips:
            text = ''.join(p.itertext()).strip()
            for b in blips:
                embed_id = b.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
                target = rId_to_target.get(embed_id, 'UNKNOWN')
                print(f'P{p_idx}: embed={embed_id} -> {target}, text="{text[:50]}"')
