import { NextRequest, NextResponse } from 'next/server';
import { ieltsRepository } from '@/db/repositories/ieltsRepository';

export async function GET() {
  try {
    const vocab = await ieltsRepository.getAllVocab();
    return NextResponse.json({
      success: true,
      data: vocab,
    });
  } catch (error: any) {
    console.error('[API IELTS Vocab GET Error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.word || !body.primaryMeaning) {
      return NextResponse.json(
        { success: false, error: 'word và primaryMeaning là bắt buộc' },
        { status: 400 }
      );
    }

    const created = await ieltsRepository.createVocab(body);
    return NextResponse.json({
      success: true,
      data: created,
    });
  } catch (error: any) {
    console.error('[API IELTS Vocab POST Error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'id là bắt buộc' },
        { status: 400 }
      );
    }

    await ieltsRepository.deleteVocab(id);
    return NextResponse.json({
      success: true,
      message: 'Đã xóa từ vựng khỏi Vocab Vault',
    });
  } catch (error: any) {
    console.error('[API IELTS Vocab DELETE Error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
