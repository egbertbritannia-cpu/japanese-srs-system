import { NextResponse } from 'next/server';
import {
  ReviewServiceError,
  submitReviewBatch,
  type SubmitReviewInput,
} from '@/services/review-service';

export interface BatchReviewItem {
  id?: string;
  eventId?: string;
  cardId: string;
  rating?: string | number;
  grade?: string | number;
  reviewTime?: number | string | Date;
  reviewedAt?: number | string | Date;
  responseTimeMs?: number;
}

/**
 * Offline batch adapter. Every event delegates to the same ReviewService used by
 * the single-review route and server action. Event IDs are idempotency keys.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const reviews: BatchReviewItem[] = body.reviews;

    if (!Array.isArray(reviews) || reviews.length === 0) {
      return NextResponse.json(
        { error: 'Body must contain non-empty reviews array' },
        { status: 400 }
      );
    }

    const inputs: SubmitReviewInput[] = reviews.map((item) => ({
      eventId: item.eventId ?? item.id,
      cardId: item.cardId,
      rating: item.rating ?? item.grade,
      reviewedAt: item.reviewedAt ?? item.reviewTime,
      responseTimeMs: item.responseTimeMs,
    }));

    const results = await submitReviewBatch(inputs);
    const processedCount = results.filter(
      (item) => item.status === 'applied' || item.status === 'duplicate'
    ).length;
    const rejectedCount = results.filter((item) => item.status === 'rejected').length;

    return NextResponse.json({
      success: rejectedCount === 0,
      message: `Batch acknowledged ${processedCount} reviews; ${rejectedCount} rejected`,
      processedCount,
      rejectedCount,
      results,
      data: results,
    });
  } catch (error: unknown) {
    if (error instanceof ReviewServiceError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status }
      );
    }

    console.error('[Batch Review API Error]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
