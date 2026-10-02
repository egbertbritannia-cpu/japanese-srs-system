import sys
import zipfile
import json
import xml.etree.ElementTree as ET

sys.stdout.reconfigure(encoding='utf-8')

docx_path = r'D:\semester-5\JPD133\TỔNG HỢP HÁN TỰ 4-7.docx'
with zipfile.ZipFile(docx_path) as z:
    xml_content = z.read('word/document.xml')
    tree = ET.fromstring(xml_content)

namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
tables = tree.findall('.//w:tbl', namespaces)

kanji_items = []
for t_idx, table in enumerate(tables):
    rows = table.findall('.//w:tr', namespaces)
    unit_name = f'UNIT {t_idx + 4}'
    for r_idx, row in enumerate(rows):
        cells = row.findall('.//w:tc', namespaces)
        row_text = [''.join(t.text for t in cell.findall('.//w:t', namespaces) if t.text).strip() for cell in cells]
        if len(row_text) == 1 and 'UNIT' in row_text[0].upper():
            unit_name = row_text[0].strip()
            continue
        if len(row_text) >= 4 and row_text[0] != 'Hán Việt':
            han_viet, kanji, hiragana, meaning = row_text[0], row_text[1], row_text[2], row_text[3]
            if kanji and (hiragana or meaning):
                kanji_items.append({
                    'unit': unit_name,
                    'han_viet': han_viet,
                    'kanji': kanji,
                    'hiragana': hiragana,
                    'meaning': meaning
                })

output_file = 'data/jpd133_kanji.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(kanji_items, f, ensure_ascii=False, indent=2)

print(f'Successfully parsed {len(kanji_items)} Kanji items from {docx_path} into {output_file}')
