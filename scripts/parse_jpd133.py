import sys
import re
import json
import pypdf

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r'D:\semester-5\JPD133\Từ vựng-kotoba.pdf'
reader = pypdf.PdfReader(pdf_path)

vocab_items = []
current_topic = 'Từ vựng JPD133'

# Known furigana snippets in example sentences that get extracted as separate lines
FURIGANA_SNIPPETS = {
    'わたし', 'おとうと', 'しょどうきょうしつ', 'はい', 'つく', 'おく',
    'と', 'しょ', 'かん', 'くすり', 'の', 'きょうしつ', 'がっこう', 'やす'
}

TOPIC_HEADERS = {
    '家族・友達', 'こんな人', 'プレゼント', 'いろいろな趣味', '楽しい週末',
    '私の集合', 'いろいろな注意', '動物園で', '今の生活', '今の 私・前の私', '友達と'
}

for page_idx, page in enumerate(reader.pages):
    text = page.extract_text()
    if not text:
        continue
    
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    for line in lines:
        # Ignore page numbers (e.g., 25, 26, 27)
        if line.isdigit() and len(line) <= 2:
            continue
            
        if 'ことば' in line or (line.startswith('第') and '課' in line):
            current_topic = line
            continue
            
        if line in TOPIC_HEADERS:
            current_topic = line
            continue
            
        # Ignore example sentences
        if '。' in line:
            continue
            
        if line in FURIGANA_SNIPPETS:
            continue
            
        # Split by multiple spaces or tabs
        parts = re.split(r'\s{2,}|\t+', line)
        parts = [p.strip() for p in parts if p.strip()]
        
        if len(parts) >= 3:
            raw_word = parts[0]
            reading = parts[1]
            meaning = ' '.join(parts[2:])
            
            # Clean verb group indicators like ［住む］1
            clean_word = re.sub(r'［.*?］\d*', '', raw_word).replace('「', '').replace('」', '').strip()
            
            vocab_items.append({
                'raw_word': raw_word,
                'word': clean_word,
                'reading': reading,
                'meaning': meaning,
                'topic': current_topic,
                'page': page_idx + 1
            })
        elif len(parts) == 2:
            p1, p2 = parts[0], parts[1]
            # Check if p2 contains Latin characters (Vietnamese meaning)
            if re.search(r'[a-zA-Zà-ỹÀ-Ỹ]', p2):
                clean_word = re.sub(r'［.*?］\d*', '', p1).replace('「', '').replace('」', '').strip()
                # If clean_word contains Kanji, reading might be same as clean_word or needs lookup
                vocab_items.append({
                    'raw_word': p1,
                    'word': clean_word,
                    'reading': clean_word if not re.search(r'[\u4e00-\u9faf]', clean_word) else '',
                    'meaning': p2,
                    'topic': current_topic,
                    'page': page_idx + 1
                })

# Save to data/jpd133_vocab.json
output_file = 'data/jpd133_vocab.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(vocab_items, f, ensure_ascii=False, indent=2)

print(f'Successfully parsed {len(vocab_items)} vocabulary items from JPD133 into {output_file}')
