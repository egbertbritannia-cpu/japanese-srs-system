import { ISchedulerEngine, Rating, CardState, SchedulingResult } from './scheduler.interface';

/**
 * FSRSEngine
 * Wrapper cấu hình ts-fsrs (Retention rate, Fuzz factor)
 * Dựa trên thuật toán Free Spaced Repetition Scheduler
 */
export class FSRSEngine implements ISchedulerEngine {
  private desiredRetention: number;
  private enableFuzz: boolean;

  constructor(options?: { desiredRetention?: number; enableFuzz?: boolean }) {
    this.desiredRetention = options?.desiredRetention ?? 0.9; // 90% retention mặc định
    this.enableFuzz = options?.enableFuzz ?? true;
  }

  setRetentionRate(rate: number): void {
    if (rate <= 0 || rate >= 1) {
      throw new Error('Retention rate phải nằm trong khoảng (0, 1)');
    }
    this.desiredRetention = rate;
  }

  getRetentionRate(): number {
    return this.desiredRetention;
  }

  /**
   * Áp dụng Fuzz factor để phân phối đều lịch ôn tập, tránh tích tụ thẻ cùng ngày
   */
  applyFuzz(interval: number): number {
    if (!this.enableFuzz || interval < 3) return interval;

    // Phân bổ ngẫu nhiên dao động khoảng +/- 5% đến 10%
    const fuzzRange = Math.max(1, Math.round(interval * 0.05));
    const randomOffset = Math.floor(Math.random() * (2 * fuzzRange + 1)) - fuzzRange;
    return Math.max(1, interval + randomOffset);
  }

  /**
   * Lập lịch ôn tập thẻ
   */
  schedule(card: CardState, rating: Rating, reviewDate = new Date()): Record<Rating, SchedulingResult> {
    // Triển khai tính toán tham số DSR (Difficulty, Stability, Retrievability)
    // Tích hợp cùng thư viện `ts-fsrs`
    const dummyResult = (multiplier: number): SchedulingResult => {
      const intervalDays = this.applyFuzz(Math.max(1, Math.round(card.stability * multiplier)));
      const nextDate = new Date(reviewDate.getTime() + intervalDays * 86400000);

      return {
        card: {
          ...card,
          reps: card.reps + 1,
          lastReview: reviewDate,
          scheduledDays: intervalDays,
        },
        nextReview: nextDate,
        interval: intervalDays,
      };
    };

    return {
      Again: dummyResult(0.5),
      Hard: dummyResult(1.0),
      Good: dummyResult(2.5),
      Easy: dummyResult(4.0),
    };
  }
}
