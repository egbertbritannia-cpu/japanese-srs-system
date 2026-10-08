import { NextRequest, NextResponse } from 'next/server';
import { ieltsRepository } from '@/db/repositories/ieltsRepository';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'sessionId là bắt buộc' },
        { status: 400 }
      );
    }
    const logs = await ieltsRepository.getPracticeLogs(sessionId);
    return NextResponse.json({
      success: true,
      data: logs,
    });
  } catch (error: any) {
    console.error('[API IELTS Logs GET Error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, logs } = body;

    if (!sessionId || !logs || !Array.isArray(logs)) {
      return NextResponse.json(
        { success: false, error: 'sessionId và logs (mảng) là bắt buộc' },
        { status: 400 }
      );
    }

    const saved = await ieltsRepository.savePracticeLogsBatch(sessionId, logs);
    return NextResponse.json({
      success: true,
      data: saved,
    });
  } catch (error: any) {
    console.error('[API IELTS Logs POST Error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
