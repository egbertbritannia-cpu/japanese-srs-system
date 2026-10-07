import { NextResponse } from 'next/server';
import { ReviewServiceError, submitReview } from '@/services/review-service';

/**
 * Thin HTTP adapter for the canonical ReviewService.
 * Browser-provided scheduledDays is intentionally ignored: server-side FSRS is authoritative.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cardId = body.cardId;
    const rawRating = body.rating ?? body.grade;

    if (!cardId || rawRating === undefined || rawRating === null) {
      return NextResponse.json(
        { error: 'cardId and rating (or grade) are required' },
        { status: 400 }
      );
    }

    const result = await submitReview({
      eventId: body.eventId ?? body.id,
      cardId,
      rating: rawRating,
      reviewedAt: body.reviewedAt ?? body.reviewTime,
      responseTimeMs: body.responseTimeMs,
    });

    return NextResponse.json({
      success: true,
      status: result.status,
      eventId: result.eventId,
      message:
        result.status === 'duplicate'
          ? 'Review already applied; no state mutation performed'
          : 'Review logged and DSR parameters updated',
      data: {
        cardId: result.cardId,
        rating: result.rating,
        state: result.state,
        stability: result.stability,
        difficulty: result.difficulty,
        scheduledDays: result.scheduledDays,
        nextReviewDate: result.nextReviewDate,
      },
    });
  } catch (error: unknown) {
    if (error instanceof ReviewServiceError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status }
      );
    }

    console.error('[API Review Error]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
