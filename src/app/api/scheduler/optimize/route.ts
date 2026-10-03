import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { userFsrsParameters, reviewLogs } from '@/db/schema';
import { optimizeFsrsParameters, ReviewRecord, DEFAULT_FSRS_V5_WEIGHTS } from '@/core/scheduler/fsrs-optimizer';

/**
 * FSRS Optimizer API Endpoint
 * Trụ Cột 1: Huấn Luyện Tự Động 21 Tham Số Cá Nhân Hóa (Client/Server FSRS Optimizer)
 * Căn cứ: planning/04_PHASE_4_COGNITIVE_SCIENCE_AND_FOUR_PILLARS.md
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { userId = 'default_user', customLogs } = body;

    let history: ReviewRecord[] = [];

    // 1. Nếu có gửi logs tùy biến trong payload
    if (Array.isArray(customLogs) && customLogs.length > 0) {
      history = customLogs;
    } else {
      // 2. Tra cứu từ database review_logs
      try {
        const rows = await db.select().from(reviewLogs).limit(500);
        history = rows.map((r: any) => {
          const ratingMap: Record<string, 1 | 2 | 3 | 4> = {
            Again: 1,
            Hard: 2,
            Good: 3,
            Easy: 4,
          };
          const grade = ratingMap[r.rating] || 3;
          return {
            cardId: r.cardId,
            elapsedDays: r.elapsedDays,
            scheduledDays: r.scheduledDays,
            grade,
            retrievabilityOutcome: grade >= 2 ? 1 : 0,
            stabilityBefore: r.stability,
            difficultyBefore: r.difficulty,
          };
        });
      } catch (err) {
        console.warn('[Scheduler Optimize] Không lấy được logs từ DB, sử dụng danh sách trống:', err);
      }
    }

    // 3. Thực thi thuật toán tối ưu hóa 21 tham số
    const result = await optimizeFsrsParameters(history, DEFAULT_FSRS_V5_WEIGHTS);

    // 4. Lưu kết quả vào bảng user_fsrs_parameters
    try {
      await db.insert(userFsrsParameters).values({
        id: `opt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        userId,
        wParameters: JSON.stringify(result.weights),
        sampleSize: result.sampleSize,
        rmse: result.rmse,
        logLoss: result.logLoss,
        optimizedAt: result.optimizedAt,
        isActive: result.rollbackTriggered ? 0 : 1,
      });
    } catch (dbErr) {
      console.warn('[Scheduler Optimize] Lưu user_fsrs_parameters thất bại:', dbErr);
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Lỗi khi tối ưu hóa tham số FSRS' },
      { status: 500 }
    );
  }
}
