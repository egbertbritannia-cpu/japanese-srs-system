'use server';

/**
 * Server Actions cho Japanese SRS System (React 19 & Next.js 15).
 * Review mutations delegate to the same ReviewService as REST/offline sync.
 */

import { revalidatePath } from 'next/cache';
import { db } from '@/db/client';
import { cards } from '@/db/schema';
import { ReviewServiceError, submitReview } from '@/services/review-service';

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
 * Legacy administrative card action. The user-facing Add Card page is decommissioned.
 * Kept temporarily for compatibility with any internal caller; do not expose it in UI.
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

    revalidatePath('/');
    revalidatePath('/cards');

    return { success: true, cardId: newId };
  } catch (error: unknown) {
    console.error('[createCardAction] Lỗi tạo thẻ:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi cơ sở dữ liệu',
    };
  }
}

/**
 * Canonical FSRS server action adapter.
 * scheduledDays remains for backward compatibility but is never trusted or persisted.
 */
export async function submitReviewAction(input: {
  eventId?: string;
  cardId: string;
  rating: string | number;
  scheduledDays?: number;
  responseTimeMs?: number;
  reviewedAt?: Date | number | string;
}) {
  try {
    if (!input.cardId || input.rating === undefined || input.rating === null) {
      return { success: false, error: 'cardId và rating là bắt buộc' };
    }

    const result = await submitReview({
      eventId: input.eventId,
      cardId: input.cardId,
      rating: input.rating,
      reviewedAt: input.reviewedAt,
      responseTimeMs: input.responseTimeMs,
    });

    revalidatePath('/');
    revalidatePath('/review');

    return {
      success: true,
      status: result.status,
      eventId: result.eventId,
      nextDue: result.nextReviewDate,
      data: result,
    };
  } catch (error: unknown) {
    if (!(error instanceof ReviewServiceError)) {
      console.error('[submitReviewAction] Lỗi cập nhật ôn tập:', error);
    }
    return {
      success: false,
      code: error instanceof ReviewServiceError ? error.code : 'REVIEW_FAILED',
      error: error instanceof Error ? error.message : 'Lỗi server action',
    };
  }
}
