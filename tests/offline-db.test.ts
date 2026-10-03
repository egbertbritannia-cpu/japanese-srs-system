import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import {
  offlineDb,
  cacheCardsLocally,
  getOfflineCards,
  recordPendingReview,
  getUnsyncedReviewCount,
  type LocalCard,
} from '@/lib/offline-db';

describe('TẦNG 6: Offline-First IndexedDB Architecture (Dexie.js)', () => {
  beforeEach(async () => {
    await offlineDb.cards.clear();
    await offlineDb.pendingReviews.clear();
  });

  it('lưu trữ thẻ bài vào IndexedDB và đọc lại chính xác', async () => {
    const mockCards: LocalCard[] = [
      {
        id: 'card_test_1',
        front: '記憶道',
        reading: 'きおくどう',
        meaning: 'Con đường ghi nhớ',
        deckId: 'deck_n1',
        state: 'Review',
        due: Date.now() - 1000,
        stability: 4.5,
        difficulty: 3.2,
      },
      {
        id: 'card_test_2',
        front: '波',
        reading: 'なみ',
        meaning: 'Làn sóng',
        deckId: 'deck_n2',
        state: 'New',
        due: Date.now() + 50000,
        stability: 1.0,
        difficulty: 4.0,
      },
    ];

    await cacheCardsLocally(mockCards);

    const allCards = await getOfflineCards();
    expect(allCards).toHaveLength(2);
    expect(allCards[0].front).toBe('記憶道');

    const deckN1Cards = await getOfflineCards('deck_n1');
    expect(deckN1Cards).toHaveLength(1);
    expect(deckN1Cards[0].id).toBe('card_test_1');
  });

  it('ghi nhận lượt ôn tập ngoại tuyến với synced = 0', async () => {
    const reviewId = await recordPendingReview('card_test_1', 'Good', 3.5, 2400);
    expect(reviewId).toBeDefined();

    const unsyncedCount = await getUnsyncedReviewCount();
    expect(unsyncedCount).toBe(1);

    const pending = await offlineDb.pendingReviews.toArray();
    expect(pending).toHaveLength(1);
    expect(pending[0].cardId).toBe('card_test_1');
    expect(pending[0].rating).toBe('Good');
    expect(pending[0].synced).toBe(0);
  });

  it('cập nhật nhiều lượt ôn tập ngoại tuyến liên tiếp', async () => {
    await recordPendingReview('card_1', 'Again', 0.1, 1500);
    await recordPendingReview('card_2', 'Hard', 1.2, 3200);
    await recordPendingReview('card_3', 'Easy', 7.0, 1100);

    const unsyncedCount = await getUnsyncedReviewCount();
    expect(unsyncedCount).toBe(3);
  });
});
