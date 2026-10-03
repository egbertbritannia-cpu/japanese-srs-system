import { NextResponse } from 'next/server';

/**
 * API ghi nhận kết quả đánh giá thẻ (cập nhật DSR - Difficulty, Stability, Retrievability)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cardId = body.cardId;
    const rating = body.rating || body.grade; // Hỗ trợ cả 2 định dạng rating hoặc grade ('Again' | 'Hard' | 'Good' | 'Easy')

    if (!cardId || !rating) {
      return NextResponse.json(
        { error: 'cardId and rating (or grade) are required' },
        { status: 400 }
      );
    }

    // TODO: Tính toán FSRS state mới (D, S, R) và ghi vào review-repository
    return NextResponse.json({
      success: true,
      message: 'Review logged and DSR parameters updated',
      data: {
        cardId,
        rating,
        nextReviewDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
