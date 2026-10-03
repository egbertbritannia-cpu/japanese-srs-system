import { NextRequest, NextResponse } from 'next/server';
import { grammarRepository } from '@/db/repositories/grammarRepository';

export const dynamic = 'force-dynamic';

/**
 * GET /api/grammar/practice?lessonId=lesson-8&limit=15
 * Lấy hàng đợi bài tập phục vụ phiên Drill Practice
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId') || undefined;
    const limit = parseInt(searchParams.get('limit') || '15', 10);

    const exercises = await grammarRepository.getPracticeQueue({
      lessonId,
      limit,
    });

    return NextResponse.json({
      total: exercises.length,
      lessonId: lessonId || 'all',
      exercises,
    });
  } catch (error: any) {
    console.error('Error fetching grammar practice queue:', error);
    return NextResponse.json(
      { error: 'Failed to fetch grammar practice queue', details: error?.message },
      { status: 500 }
    );
  }
}
