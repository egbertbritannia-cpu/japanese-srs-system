/**
 * Interface trừu tượng hóa bộ lập lịch (Scheduler Interface)
 * Cho phép dễ dàng thay thế hoặc mở rộng giữa FSRS, Anki SM-2, Half-life regression, v.v.
 */

export type Rating = 'Again' | 'Hard' | 'Good' | 'Easy';

export interface CardState {
  cardId: string;
  due: Date;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  state: 'New' | 'Learning' | 'Review' | 'Relearning';
  lastReview?: Date;
}

export interface SchedulingResult {
  card: CardState;
  nextReview: Date;
  interval: number;
}

export interface ISchedulerEngine {
  /**
   * Tính toán lịch ôn tiếp theo dựa trên đánh giá của người học
   */
  schedule(card: CardState, rating: Rating, reviewDate?: Date): Record<Rating, SchedulingResult>;

  /**
   * Cập nhật hệ số lưu giữ mục tiêu (Desired Retention)
   */
  setRetentionRate(rate: number): void;

  /**
   * Áp dụng Fuzz factor để tránh việc quá nhiều thẻ dồn vào cùng một ngày
   */
  applyFuzz(interval: number): number;
}
