import { NextRequest, NextResponse } from 'next/server';
import { grammarRepository } from '@/db/repositories/grammarRepository';

export const dynamic = 'force-dynamic';

/**
 * GET /api/grammar/[lessonId]
 * Lấy chi tiết 1 bài học ngữ pháp kèm toàn bộ các patterns thuộc bài đó
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    const lesson = await grammarRepository.getLessonById(lessonId);

    if (!lesson) {
      return NextResponse.json(
        { error: `Lesson not found: ${lessonId}` },
        { status: 404 }
      );
    }

    return NextResponse.json(lesson);
  } catch (error: any) {
    console.error('Error fetching grammar lesson detail:', error);
    return NextResponse.json(
      { error: 'Failed to fetch grammar lesson', details: error?.message },
      { status: 500 }
    );
  }
}
