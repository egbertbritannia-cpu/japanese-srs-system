import { NextResponse } from 'next/server';
import { ieltsRepository } from '@/db/repositories/ieltsRepository';

export async function GET() {
  try {
    const stats = await ieltsRepository.getDashboardStats();
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error('[API IELTS Dashboard Error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
