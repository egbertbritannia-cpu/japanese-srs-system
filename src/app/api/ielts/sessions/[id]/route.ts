import { NextRequest, NextResponse } from 'next/server';
import { ieltsRepository } from '@/db/repositories/ieltsRepository';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await ieltsRepository.getSessionById(id);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session không tồn tại' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: session,
    });
  } catch (error: any) {
    console.error('[API IELTS Session Detail GET Error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await ieltsRepository.updateSession(id, body);

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    console.error('[API IELTS Session PATCH Error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await ieltsRepository.deleteSession(id);
    return NextResponse.json({
      success: true,
      message: 'Đã xóa session thành công',
    });
  } catch (error: any) {
    console.error('[API IELTS Session DELETE Error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
