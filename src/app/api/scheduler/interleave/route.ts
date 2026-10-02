import { NextResponse } from 'next/server';
import { interleaveCardQueue, SrsCandidateCard } from '@/core/scheduler/lector-interleaving';

/**
 * LECTOR Interleaving API Endpoint
 * Trụ Cột 1: Sắp xếp Xen kẽ Chống Can thiệp Ngữ nghĩa (P95 SLA < 85ms)
 * Căn cứ: doc/14_PILLAR_1_ADAPTIVE_FSRS_AND_SEMANTIC_INTERFERENCE.md & doc/18_TECHNICAL_SPEC_AND_ATOMIC_IMPLEMENTATION_BLUEPRINT.md
 */
export async function POST(request: Request) {
  try {
    const startTime = performance.now();
    const body = await request.json();
    const { cards, minSemanticDistance = 0.85 } = body;

    if (!Array.isArray(cards) || cards.length === 0) {
      return NextResponse.json(
        { error: 'Danh sách cards không hợp lệ hoặc rỗng' },
        { status: 400 }
      );
    }

    const candidateCards: SrsCandidateCard[] = cards.map((c: any) => ({
      id: c.id || String(Math.random()),
      front: c.front || '',
      reading: c.reading || null,
      meaning: c.meaning || '',
      due: c.due ? new Date(c.due) : new Date(),
      stability: typeof c.stability === 'number' ? c.stability : 1.0,
      difficulty: typeof c.difficulty === 'number' ? c.difficulty : 5.0,
      embeddingVector: Array.isArray(c.embeddingVector) ? c.embeddingVector : null,
    }));

    // Chạy giải thuật LECTOR
    const result = interleaveCardQueue(candidateCards, minSemanticDistance);
    const executionDurationMs = Number((performance.now() - startTime).toFixed(2));

    return NextResponse.json({
      success: true,
      slaStatus: executionDurationMs < 85 ? 'PASSED_SLA' : 'EXCEEDED_SLA',
      executionDurationMs,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Lỗi khi sắp xếp xen kẽ hàng đợi LECTOR' },
      { status: 500 }
    );
  }
}
