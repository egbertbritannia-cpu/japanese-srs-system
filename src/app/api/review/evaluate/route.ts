import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { cognitiveInteractionLogs } from '@/db/schema';

/**
 * AI Semantic Evaluator Endpoint
 * Trụ Cột 3: Đa dạng hóa Tương tác Nhận thức & Đánh giá Ngữ nghĩa Súc tích (<= 2 câu)
 * Căn cứ: planning/04_PHASE_4_COGNITIVE_SCIENCE_AND_FOUR_PILLARS.md
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      cardId,
      interactionType = 'generative_cloze',
      promptPresented,
      learnerResponse,
      expectedAnswer,
      latencyMs = 2500,
    } = body;

    if (!learnerResponse || !expectedAnswer) {
      return NextResponse.json(
        { error: 'learnerResponse and expectedAnswer are required' },
        { status: 400 }
      );
    }

    const trimmedInput = learnerResponse.trim().toLowerCase();
    const trimmedExpected = expectedAnswer.trim().toLowerCase();

    // 1. So khớp ngữ nghĩa cơ bản & kiểm tra gần đúng (Fuzzy/Exact Match)
    const isExactMatch = trimmedInput === trimmedExpected;
    const isSubMatch = trimmedExpected.includes(trimmedInput) || trimmedInput.includes(trimmedExpected);

    let isCorrect = isExactMatch;
    let score = isExactMatch ? 1.0 : (isSubMatch ? 0.75 : 0.0);
    let feedback = '';

    if (isExactMatch) {
      feedback = 'Chính xác! Bạn đã ghi nhớ chuẩn xác từ vựng và ngữ cảnh.';
    } else if (isSubMatch && trimmedInput.length >= 2) {
      isCorrect = true;
      feedback = `Khá tốt! Câu trả lời sát nghĩa nhưng cần lưu ý dạng đầy đủ:「${expectedAnswer}」.`;
    } else {
      isCorrect = false;
      feedback = `Chưa chính xác. Đáp án chuẩn là「${expectedAnswer}」. Hãy lưu ý cấu trúc câu này trong chu kỳ tới.`;
    }

    // 2. Ghi nhận log nhận thức vào database (nếu có cardId)
    if (cardId) {
      try {
        await db.insert(cognitiveInteractionLogs).values({
          id: `cog_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          cardId,
          interactionType,
          promptPresented: promptPresented || 'Prompt',
          learnerResponse,
          isCorrect: isCorrect ? 1 : 0,
          evaluatorFeedback: feedback,
          latencyMs,
          createdAt: new Date(),
        });
      } catch (dbErr) {
        console.warn('[Evaluate API] Lưu cognitive_interaction_logs thất bại (bỏ qua an toàn):', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      isCorrect,
      score,
      conciseFeedback: feedback,
      latencyMs,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Lỗi xử lý đánh giá ngữ nghĩa' },
      { status: 500 }
    );
  }
}
