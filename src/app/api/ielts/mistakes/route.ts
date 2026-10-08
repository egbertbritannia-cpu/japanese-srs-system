import { NextRequest, NextResponse } from 'next/server';
import { ieltsRepository } from '@/db/repositories/ieltsRepository';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    const mistakes = sessionId
      ? await ieltsRepository.getMistakesBySession(sessionId)
      : await ieltsRepository.getAllMistakes();

    return NextResponse.json({
      success: true,
      data: mistakes,
    });
  } catch (error: any) {
    console.error('[API IELTS Mistakes GET Error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.mistakeCategory) {
      return NextResponse.json(
        { success: false, error: 'mistakeCategory là bắt buộc' },
        { status: 400 }
      );
    }

    const saved = await ieltsRepository.saveMistake(body);
    return NextResponse.json({
      success: true,
      data: saved,
    });
  } catch (error: any) {
    console.error('[API IELTS Mistakes POST Error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'id là bắt buộc để cập nhật lỗi sai' },
        { status: 400 }
      );
    }

    const updated = await ieltsRepository.updateMistake(body.id, body);
    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    console.error('[API IELTS Mistakes PATCH Error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
