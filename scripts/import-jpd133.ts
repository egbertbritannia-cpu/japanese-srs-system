/**
 * Script nhập 256 từ vựng giáo trình JPD133 từ file PDF vào Database (Turso / SQLite)
 * - Tự động tạo bộ thẻ: "JPD133 - Từ vựng Kotoba"
 * - Chuẩn hóa trường dữ liệu: Mặt chữ (Kanji/Kana), Furigana, Nghĩa tiếng Việt
 * - Gán mẫu cao độ Pitch Accent Tokyo
 * - Khởi tạo tham số FSRS: Difficulty = 0, Stability = 0, State = 'New' (State 0)
 * - Gán tags theo từng bài/chủ đề trong giáo trình (Gia đình, Sở thích, Động vật, v.v.)
 */

import fs from 'fs';
import path from 'path';

// 1. Tự động nạp file .env trước khi import db client
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

import { db } from '../src/db/client';
import { decks, cards } from '../src/db/schema';
import { PitchAccentLookup } from '../src/modules/japanese-nlp/pitch-lookup';
import { eq } from 'drizzle-orm';

interface JPD133RawItem {
  raw_word: string;
  word: string;
  reading: string;
  meaning: string;
  topic: string;
  page: number;
}

async function main() {
  const jsonPath = path.resolve(process.cwd(), 'data', 'jpd133_vocab.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ Không tìm thấy file data/jpd133_vocab.json! Hãy chạy scripts/parse_jpd133.py trước.');
    process.exit(1);
  }

  const rawData: JPD133RawItem[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`📖 Đã đọc ${rawData.length} từ vựng JPD133 từ file JSON...`);

  const DECK_ID = 'deck_jpd133';
  const DECK_NAME = 'JPD133 - Từ vựng Kotoba';

  // 2. Tạo hoặc kiểm tra Deck JPD133
  const now = new Date();
  try {
    await db
      .insert(decks)
      .values({
        id: DECK_ID,
        name: DECK_NAME,
        description: 'Toàn bộ từ vựng giáo trình tiếng Nhật JPD133 theo chủ đề',
        createdAt: now,
      })
      .onConflictDoNothing();
  } catch {
    // Deck đã tồn tại hoặc bỏ qua conflict
  }

  console.log(`📂 Đã thiết lập bộ thẻ: "${DECK_NAME}" (${DECK_ID})`);

  // 3. Lấy danh sách thẻ hiện có trong deck để tránh trùng lặp
  const existingCards = await db.select({ front: cards.front }).from(cards).where(eq(cards.deckId, DECK_ID));
  const existingSet = new Set(existingCards.map((c: any) => c.front));

  let insertedCount = 0;
  let skippedCount = 0;

  for (const item of rawData) {
    if (!item.word || existingSet.has(item.word)) {
      skippedCount++;
      continue;
    }

    // Tra cứu Pitch Accent Tokyo
    const pitchInfo = PitchAccentLookup.lookup(item.word, item.reading || item.word);
    const pitchStr = pitchInfo ? `[${pitchInfo.dropPosition}] ${pitchInfo.pattern}` : '[0] Heiban';

    // Xác định loại thẻ
    const isSingleKanji = item.word.length === 1 && /[\u4e00-\u9faf]/.test(item.word);
    const cardType = isSingleKanji ? 'Kanji' : 'Vocab';

    // Tạo ID thẻ duy nhất
    const cardId = `jpd133_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Tạo các thẻ FSRS với D=0, S=0, State=0 (New)
    await db.insert(cards).values({
      id: cardId,
      deckId: DECK_ID,
      type: cardType,
      front: item.word,
      reading: item.reading || item.word,
      meaning: item.meaning,
      pitch: pitchStr,
      sentence: `{{c1::${item.word}}}`,
      tags: JSON.stringify(['JPD133', item.topic, `Page_${item.page}`]),
      stability: 0,
      difficulty: 0,
      elapsedDays: 0,
      scheduledDays: 0,
      reps: 0,
      lapses: 0,
      state: 'New',
      due: now,
      createdAt: now,
      updatedAt: now,
    });

    existingSet.add(item.word);
    insertedCount++;
  }

  console.log(`\n🎉 HOÀN TẤT NHẬP TỪ VỰNG JPD133!`);
  console.log(`- Thẻ mới được thêm vào: ${insertedCount}`);
  console.log(`- Thẻ đã có sẵn (bỏ qua): ${skippedCount}`);
  console.log(`- Tổng số thẻ trong bộ "${DECK_NAME}": ${existingSet.size}`);
  console.log(`- Thuật toán FSRS: Khởi tạo sẵn sàng ôn tập (Difficulty=0, Stability=0, State=New)`);
}

main().catch((err) => {
  console.error('❌ Lỗi khi nhập từ vựng JPD133:', err);
  process.exit(1);
});
