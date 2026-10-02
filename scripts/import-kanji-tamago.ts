/**
 * Script nhập 122 chữ Hán & từ ghép Hán tự JPD133 (Bài 8-11 Kanji Tamago) vào mục "Hán Tự Đã Học"
 * 
 * Đặc điểm nhận thức (Cognitive Science & FSRS):
 * - Bộ thẻ: "JPD133 - Hán Tự Đã Học (Unit 4-11)" (ID: deck_jpd133_kanji)
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

interface KanjiTamagoCard {
  type: 'Kanji' | 'Vocab';
  kanji: string;
  reading: string;
  meaning: string;
  han_viet: string;
  unit: string;
  primary_kanji: string;
}

async function main() {
  const jsonPath = path.resolve(process.cwd(), 'data', 'jpd133_kanji_tamago.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ Không tìm thấy file data/jpd133_kanji_tamago.json! Hãy chạy scripts/parse_kanji_pdf.py trước.');
    process.exit(1);
  }

  const rawData: KanjiTamagoCard[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`📖 Đã đọc ${rawData.length} thẻ Hán tự & từ ghép từ file JSON...`);

  const DECK_ID = 'deck_jpd133_kanji';
  const DECK_NAME = 'JPD133 - Hán Tự Đã Học (Unit 4-11)';
  const DECK_DESC = 'Tổng hợp 41 chữ Hán & từ vựng Hán tự đã học (Unit 4-7 & Bài 8-11 Kanji Tamago) - Độ ổn định S > 21 ngày';

  const now = new Date();
  const nextDueDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 ngày sau

  // 1. Cập nhật tên và mô tả Deck thành Unit 4-11
  try {
    await db
      .insert(decks)
      .values({
        id: DECK_ID,
        name: DECK_NAME,
        description: DECK_DESC,
        createdAt: now,
      })
      .onConflictDoUpdate({
        target: decks.id,
        set: {
          name: DECK_NAME,
          description: DECK_DESC,
        }
      });
  } catch (e) {
    console.log('Deck update notice:', e);
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
    const pitchInfo = PitchAccentLookup.lookup(item.kanji, item.reading || item.kanji);
    const pitchStr = pitchInfo ? `[${pitchInfo.dropPosition}] ${pitchInfo.pattern}` : '[0] Heiban';

    const cardId = `kanji_tmg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Tạo thẻ với trạng thái ĐÃ HỌC (Stability = 30.0 > 21 ngày, State = 'Review')
    await db.insert(cards).values({
      id: cardId,
      deckId: DECK_ID,
      type: item.type,
      front: item.kanji,
      reading: item.reading,
      meaning: item.meaning,
      pitch: pitchStr,
      sentence: `{{c1::${item.kanji}}}`,
      tags: JSON.stringify(['JPD133', item.type, 'Hán_Tự_Đã_Học', item.unit, `HánViệt_${item.han_viet}`, `Gốc_${item.primary_kanji}`]),
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

  console.log(`\n🎉 HOÀN TẤT NHẬP HÁN TỰ KANJI TAMAGO (BÀI 8-11)!`);
  console.log(`- Thẻ mới được thêm vào: ${insertedCount}`);
  console.log(`- Thẻ đã có sẵn (bỏ qua): ${skippedCount}`);
  console.log(`- Tổng số Hán tự & từ ghép trong bộ "${DECK_NAME}": ${existingSet.size}`);
  console.log(`- Trạng thái nhận thức: S = 30.0 ngày (> 21), State = 'Review' (Đã nắm vững cho sinh câu i+1)`);
}

main().catch((err) => {
  console.error('❌ Lỗi khi nhập Hán tự:', err);
  process.exit(1);
});
