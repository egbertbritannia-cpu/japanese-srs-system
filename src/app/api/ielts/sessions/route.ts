import { NextRequest, NextResponse } from 'next/server';
import { ieltsRepository } from '@/db/repositories/ieltsRepository';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const sessions = await ieltsRepository.getAllSessions(limit);
    return NextResponse.json({
      success: true,
      data: sessions,
    });
  } catch (error: any) {
    console.error('[API IELTS Sessions GET Error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.section) {
      return NextResponse.json(
        { success: false, error: 'Section là bắt buộc' },
        { status: 400 }
      );
    }
    const session = await ieltsRepository.createSession(body);
    return NextResponse.json({
      success: true,
      data: session,
    });
  } catch (error: any) {
    console.error('[API IELTS Sessions POST Error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
