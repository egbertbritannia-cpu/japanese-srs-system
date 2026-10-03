import { NextResponse } from 'next/server';
import { grammarRepository } from '@/db/repositories/grammarRepository';

export const dynamic = 'force-dynamic';

/**
 * GET /api/grammar
 * Lấy toàn bộ danh sách bài học ngữ pháp (Bài 8 - Bài 11) kèm thống kê tiến độ
 */
export async function GET() {
  try {
    const data = await grammarRepository.getAllLessonsWithStats();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching grammar lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch grammar lessons', details: error?.message },
      { status: 500 }
    );
  }
}
