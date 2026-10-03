'use server';

/**
 * Server Actions cho Japanese SRS System (React 19 & Next.js 15)
 * Cung cấp cơ chế mutation dữ liệu trực tiếp từ Server Component / Form Action,
 * loại bỏ chi phí trung gian của HTTP REST mutation và tự động làm mới bộ nhớ đệm (ISR).
 * Căn cứ: doc/performance/02-nextjs-optimization.md (Mục 1 & Sprint 3)
 */

import { revalidatePath } from 'next/cache';
import { db } from '@/db/client';
import { cards, reviewLogs } from '@/db/schema';
import { eq } from 'drizzle-orm';

export interface CreateCardActionInput {
  deckId: string;
  front: string;
  reading?: string;
  meaning: string;
  type?: string;
  pitch?: string;
  sentence?: string;
}

/**
 * Server Action tạo thẻ học từ vựng mới
 */
export async function createCardAction(input: CreateCardActionInput) {
  try {
    if (!input.front || !input.meaning || !input.deckId) {
      return { success: false, error: 'Thiếu thông tin bắt buộc (front, meaning, deckId)' };
    }

    const newId = `c_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = Date.now();

    await db.insert(cards).values({
      id: newId,
      deckId: input.deckId,
      front: input.front.trim(),
      reading: input.reading?.trim() || null,
      meaning: input.meaning.trim(),
      type: input.type || 'Vocabulary',
      pitch: input.pitch || null,
      sentence: input.sentence || null,
      state: 'New',
      due: now,
      stability: 0,
      difficulty: 0,
      elapsedDays: 0,
      scheduledDays: 0,
      reps: 0,
      lapses: 0,
      createdAt: now,
      updatedAt: now,
    });

    // Làm mới cache ISR của Dashboard và Trang danh sách thẻ
    revalidatePath('/');
    revalidatePath('/cards');

    return { success: true, cardId: newId };
  } catch (error: any) {
    console.error('[createCardAction] Lỗi tạo thẻ:', error);
    return { success: false, error: error?.message || 'Lỗi cơ sở dữ liệu' };
  }
}

/**
 * Server Action ghi nhận kết quả đánh giá thẻ bài FSRS
 */
export async function submitReviewAction(input: {
  cardId: string;
  rating: string;
  scheduledDays?: number;
  responseTimeMs?: number;
}) {
  try {
    if (!input.cardId || !input.rating) {
      return { success: false, error: 'cardId và rating là bắt buộc' };
    }

    const now = Date.now();
    const scheduledDays = input.scheduledDays || 1;
    const nextDue = now + scheduledDays * 86400000;

    // Cập nhật trạng thái thẻ trong bảng cards
    await db
      .update(cards)
      .set({
        state: input.rating === 'Again' ? 'Learning' : 'Review',
        due: nextDue,
        updatedAt: now,
      })
      .where(eq(cards.id, input.cardId));

    // Thêm bản ghi vào review_logs nếu bảng tồn tại
    try {
      await db.insert(reviewLogs).values({
        id: `rl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        cardId: input.cardId,
        rating: input.rating,
        reviewTime: now,
        responseTimeMs: input.responseTimeMs || 2500,
        createdAt: now,
      });
    } catch {
      // Bỏ qua nếu reviewLogs schema khác cấu hình
    }

    revalidatePath('/');
    revalidatePath('/review');

    return { success: true, nextDue };
  } catch (error: any) {
    console.error('[submitReviewAction] Lỗi cập nhật ôn tập:', error);
    return { success: false, error: error?.message || 'Lỗi server action' };
  }
}
