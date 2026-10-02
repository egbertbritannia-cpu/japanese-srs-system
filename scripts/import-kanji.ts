/**
 * Script nhập 112 chữ Hán & từ ghép Hán tự JPD133 (Unit 4-7) vào mục "Hán Tự Đã Học"
 * 
 * Đặc điểm nhận thức (Cognitive Science & FSRS):
 * - Đưa vào bộ thẻ riêng: "JPD133 - Hán Tự Đã Học (Unit 4-7)" (ID: deck_jpd133_kanji)
 * - Khởi tạo trạng thái ĐÃ HỌC (Mastered):
 *   + State: 'Review' (Đã học, đang trong chu kỳ ôn tập giãn cách)
 *   + Stability: 30.0 ngày (S > 21 ngày: Được tự động nhận diện vào không gian từ vựng đã biết chuẩn i+1)
 *   + Scheduled Days: 30 ngày (Lịch ôn tập FSRS tiếp theo sau 30 ngày)
 *   + Reps: 1, Lapses: 0
 * - Tự động tra cứu cao độ Pitch Accent Tokyo & lưu chú thích Âm Hán Việt
 */

import fs from 'fs';
import path from 'path';

// Nạp biến môi trường .env
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

interface KanjiRawItem {
  unit: string;
  han_viet: string;
  kanji: string;
  hiragana: string;
  meaning: string;
}

async function main() {
  const jsonPath = path.resolve(process.cwd(), 'data', 'jpd133_kanji.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ Không tìm thấy file data/jpd133_kanji.json! Hãy chạy scripts/parse_kanji_docx.py trước.');
    process.exit(1);
  }

  const rawData: KanjiRawItem[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`📖 Đã đọc ${rawData.length} chữ Hán & từ ghép Hán tự từ file JSON...`);

  const DECK_ID = 'deck_jpd133_kanji';
  const DECK_NAME = 'JPD133 - Hán Tự Đã Học (Unit 4-7)';

  const now = new Date();
  const nextDueDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 ngày sau

  // 1. Tạo hoặc kiểm tra Deck
  try {
    await db
      .insert(decks)
      .values({
        id: DECK_ID,
        name: DECK_NAME,
        description: 'Tổng hợp 112 chữ Hán & từ vựng Hán tự đã học (Unit 4-7) - Độ ổn định S > 21 ngày',
        createdAt: now,
      })
      .onConflictDoNothing();
  } catch {
    // Deck đã tồn tại
  }

  console.log(`📂 Đã thiết lập bộ thẻ: "${DECK_NAME}" (${DECK_ID})`);

  // 2. Lấy danh sách thẻ hiện có trong deck để tránh trùng
  const existingCards = await db.select({ front: cards.front }).from(cards).where(eq(cards.deckId, DECK_ID));
  const existingSet = new Set(existingCards.map((c: any) => c.front));

  let insertedCount = 0;
  let skippedCount = 0;

  for (const item of rawData) {
    if (!item.kanji || existingSet.has(item.kanji)) {
      skippedCount++;
      continue;
    }

    // Tra cứu Pitch Accent
    const pitchInfo = PitchAccentLookup.lookup(item.kanji, item.hiragana || item.kanji);
    const pitchStr = pitchInfo ? `[${pitchInfo.dropPosition}] ${pitchInfo.pattern}` : '[0] Heiban';

    const isSingleKanji = item.kanji.length === 1 && /[\u4e00-\u9faf]/.test(item.kanji);
    const cardType = isSingleKanji ? 'Kanji' : 'Vocab';

    const cardId = `kanji_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Tạo thẻ với trạng thái ĐÃ HỌC (Stability = 30.0 > 21 ngày, State = 'Review')
    await db.insert(cards).values({
      id: cardId,
      deckId: DECK_ID,
      type: cardType,
      front: item.kanji,
      reading: item.hiragana || item.kanji,
      meaning: `${item.meaning} (Âm Hán: ${item.han_viet})`,
      pitch: pitchStr,
      sentence: `{{c1::${item.kanji}}}`,
      tags: JSON.stringify(['JPD133', 'Kanji', 'Hán_Tự_Đã_Học', item.unit, `HánViệt_${item.han_viet}`]),
      stability: 30.0, // S > 21: Đạt chuẩn không gian từ vựng đã nắm vững cho nguyên tắc i+1
      difficulty: 4.5,
      elapsedDays: 1,
      scheduledDays: 30,
      reps: 1,
      lapses: 0,
      state: 'Review', // Đã học
      due: nextDueDate, // Đến hạn sau 30 ngày
      lastReview: now,
      createdAt: now,
      updatedAt: now,
    });

    existingSet.add(item.kanji);
    insertedCount++;
  }

  console.log(`\n🎉 HOÀN TẤT NHẬP 112 HÁN TỰ ĐÃ HỌC!`);
  console.log(`- Thẻ mới được thêm vào: ${insertedCount}`);
  console.log(`- Thẻ đã có sẵn (bỏ qua): ${skippedCount}`);
  console.log(`- Tổng số Hán tự trong bộ "${DECK_NAME}": ${existingSet.size}`);
  console.log(`- Trạng thái nhận thức: S = 30.0 ngày (> 21), State = 'Review' (Đã nắm vững cho sinh câu i+1)`);
}

main().catch((err) => {
  console.error('❌ Lỗi khi nhập Hán tự:', err);
  process.exit(1);
});
