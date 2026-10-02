import { db } from '../client';
import { cards } from '../schema';
import { eq, lte } from 'drizzle-orm';

/**
 * CardRepository
 * Thao tác đọc/ghi thẻ học (Data Access Layer)
 */
export class CardRepository {
  /**
   * Lấy danh sách thẻ học đến hạn ôn tập (Due cards)
   */
  static async getDueCards(now = new Date()) {
    return db.select().from(cards).where(lte(cards.due, now));
  }

  /**
   * Lấy tất cả thẻ thuộc một Deck cụ thể
   */
  static async getCardsByDeck(deckId: string) {
    return db.select().from(cards).where(eq(cards.deckId, deckId));
  }

  /**
   * Lấy thông tin chi tiết một thẻ học theo ID
   */
  static async getCardById(id: string) {
    const result = await db.select().from(cards).where(eq(cards.id, id));
    return result[0] || null;
  }

  /**
   * Tạo mới một thẻ học
   */
  static async createCard(data: typeof cards.$inferInsert) {
    return db.insert(cards).values(data).returning();
  }

  /**
   * Cập nhật thông tin và trạng thái FSRS của thẻ sau phiên ôn tập
   */
  static async updateCardState(id: string, updates: Partial<typeof cards.$inferInsert>) {
    return db.update(cards).set(updates).where(eq(cards.id, id)).returning();
  }

  /**
   * Xóa thẻ học
   */
  static async deleteCard(id: string) {
    return db.delete(cards).where(eq(cards.id, id));
  }

  /**
   * Lấy danh sách từ vựng đã nắm vững với độ ổn định Stability (S) > 21 ngày
   * Phục vụ Tri thức Cá nhân hóa Động (Dynamic Knowledge) để định vị không gian từ vựng đã biết chuẩn i+1
   */
  static async getKnownWords(minStability = 21): Promise<string[]> {
    const { gt } = await import('drizzle-orm');
    const results = await db
      .select({ front: cards.front })
      .from(cards)
      .where(gt(cards.stability, minStability));
    return results.map((r: any) => r.front);
  }
}
