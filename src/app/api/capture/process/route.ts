import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { cards, decks } from '@/db/schema';
import { generateFurigana } from '@/modules/japanese-nlp/furigana';
import { getPitchAccent } from '@/modules/japanese-nlp/pitch-lookup';

/**
 * Sentence Mining Capture Processing API
 * Trụ Cột 4: Pipeline Thu thập Dữ liệu Tự động (Chrome Extension & Web Mining)
 * Căn cứ: planning/04_PHASE_4_COGNITIVE_SCIENCE_AND_FOUR_PILLARS.md
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      sentence,
      targetWord,
      meaning,
      deckId,
      sourceUrl,
      autoApprove = false,
    } = body;

    if (!sentence || !targetWord) {
      return NextResponse.json(
        { error: 'sentence và targetWord là trường thông tin bắt buộc' },
        { status: 400 }
      );
    }

    // 1. Phân tích Furigana và Pitch Accent tự động
    const furiganaReading = generateFurigana(targetWord);
    const pitchInfo = getPitchAccent(targetWord);

    // 2. Tìm kiếm hoặc tạo deck mặc định nếu chưa chỉ định
    let targetDeckId = deckId;
    if (!targetDeckId) {
      try {
        const existingDecks = await db.select().from(decks).limit(1);
        if (existingDecks.length > 0) {
          targetDeckId = existingDecks[0].id;
        } else {
          // Tạo deck mặc định 'Khám phá Từ vựng (Mined Cards)'
          const newDeckId = `deck_mined_${Date.now()}`;
          await db.insert(decks).values({
            id: newDeckId,
            name: 'Đào mỏ Từ vựng (Sentence Mining)',
            description: 'Các thẻ được thu thập tự động từ Chrome Extension và duyệt nội dung',
            createdAt: new Date(),
          });
          targetDeckId = newDeckId;
        }
      } catch (deckErr) {
        console.warn('[Capture API] Lỗi tra cứu deck:', deckErr);
        targetDeckId = 'default_deck';
      }
    }

    // 3. Chuẩn bị dữ liệu thẻ
    const newCardData = {
      id: `card_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      deckId: targetDeckId,
      type: 'Vocab',
      front: targetWord,
      reading: furiganaReading,
      meaning: meaning || 'Đang cập nhật nghĩa ngữ cảnh...',
      pitch: pitchInfo ? `[${pitchInfo.pattern}] ${pitchInfo.pitchClass}` : null,
      sentence: sentence,
      audioUrl: null,
      tags: JSON.stringify(['mined', sourceUrl ? 'web_capture' : 'manual']),
      stability: 0,
      difficulty: 0,
      elapsedDays: 0,
      scheduledDays: 0,
      reps: 0,
      lapses: 0,
      state: 'New',
      due: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (autoApprove) {
      try {
        await db.insert(cards).values(newCardData);
      } catch (insertErr) {
        console.warn('[Capture API] Ghi thẻ vào DB thất bại:', insertErr);
      }
    }

    return NextResponse.json({
      success: true,
      autoApproved: autoApprove,
      card: newCardData,
      metadata: {
        sourceUrl: sourceUrl || null,
        extractedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Lỗi khi xử lý bóc tách câu đào mỏ' },
      { status: 500 }
    );
  }
}
