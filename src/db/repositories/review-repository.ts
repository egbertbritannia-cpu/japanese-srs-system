import { db } from '../client';
import { reviewLogs } from '../schema';
import { eq } from 'drizzle-orm';

/**
 * ReviewRepository
 * Lưu trữ log ôn tập để phục vụ huấn luyện tham số FSRS (Optimizer / Machine Learning)
 */
export class ReviewRepository {
  /**
   * Ghi nhận lịch sử một lần ôn tập
   */
  static async logReview(data: typeof reviewLogs.$inferInsert) {
    return db.insert(reviewLogs).values(data).returning();
  }

  /**
   * Lấy toàn bộ lịch sử ôn tập của một thẻ
   */
  static async getLogsByCardId(cardId: string) {
    return db.select().from(reviewLogs).where(eq(reviewLogs.cardId, cardId));
  }

  /**
   * Trích xuất toàn bộ log ôn tập để phục vụ chạy FSRS optimizer
   */
  static async getAllLogsForTraining() {
    return db.select().from(reviewLogs);
  }
}
