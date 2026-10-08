import { NextResponse } from 'next/server';
import { ieltsRepository } from '@/db/repositories/ieltsRepository';

export async function GET() {
  try {
    const stats = await ieltsRepository.getDashboardStats();
    const materials = await ieltsRepository.getAllMaterials();
    return NextResponse.json({
      success: true,
      message: 'IELTS Engine Connected & Online',
      data: {
        stats,
        materials,
      },
    });
  } catch (error: any) {
    console.error('[API IELTS Root Error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
