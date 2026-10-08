import { NextRequest, NextResponse } from 'next/server';
import { ieltsRepository } from '@/db/repositories/ieltsRepository';

export async function GET() {
  try {
    const materials = await ieltsRepository.getAllMaterials();
    return NextResponse.json({
      success: true,
      data: materials,
    });
  } catch (error: any) {
    console.error('[API IELTS Materials GET Error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title || !body.type) {
      return NextResponse.json(
        { success: false, error: 'Tiêu đề và loại tài liệu là bắt buộc' },
        { status: 400 }
      );
    }
    const created = await ieltsRepository.createMaterial(body);
    return NextResponse.json({
      success: true,
      data: created,
    });
  } catch (error: any) {
    console.error('[API IELTS Materials POST Error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
