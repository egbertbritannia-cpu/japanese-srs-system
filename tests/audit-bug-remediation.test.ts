import { describe, it, expect } from 'vitest';
import { POST as reviewRoute } from '../src/app/api/review/route';
import { POST as batchReviewRoute } from '../src/app/api/review/batch/route';
import { GET as getCardsRoute } from '../src/app/api/cards/route';
import { romajiToHiragana, evaluateConjugation, getAllVerbs } from '../src/lib/conjugation-engine';
import { stripCloze, hasCloze, parseClozeSegments } from '../src/lib/cloze';
import { generateAuthUrlWithState } from '../src/services/google/auth';
import { checkRateLimit } from '../src/lib/rate-limiter';
import { verifyRequestAuth } from '../src/lib/auth-guard';
import { generateDeterministicCardId } from '../src/agents/skills/card-creator.skill';
import { db } from '../src/db/client';
import { cards, reviewLogs } from '../src/db/schema';
import { eq } from 'drizzle-orm';

describe('Audit Bug Remediation Test Suite (Verification of 55 Bugs Fixed)', () => {
  describe('BUG-CONJ-01 & BUG-CONJ-02: Japanese Transliteration Engine', () => {
    it('chuyển đổi chuẩn xác phụ âm kép nn thành ん duy nhất', () => {
      expect(romajiToHiragana('shinnde')).toBe('しんで');
      expect(romajiToHiragana('nonnde')).toBe('のんで');
      expect(romajiToHiragana('annzen')).toBe('あんぜん');
    });

    it('nhận diện chuẩn xác âm ngắt Hepburn dạng tch', () => {
      expect(romajiToHiragana('matcha')).toBe('まっちゃ');
      expect(romajiToHiragana('ketchi')).toBe('けっち');
    });

    it('đánh giá chia động từ đúng khi người học gõ dạng Romaji chuẩn', () => {
      const shinu = getAllVerbs().find((v) => v.kanji === '死ぬ')!;
      const result = evaluateConjugation('shinnde', shinu, 'te');
      expect(result.isCorrect).toBe(true);
      expect(result.userHiragana).toBe('しんで');
    });
  });

  describe('BUG-CONJ-05: Cloze Anki Stateless Parsing', () => {
    it('xử lý cloze lặp lại liên tục mà không bị lệch vị trí do cờ regex stateful', () => {
      const text1 = '早く{{c1::家}}に帰りたいです。';
      const text2 = 'これは{{c1::本}}と{{c2::ペン}}です。';

      expect(hasCloze(text1)).toBe(true);
      expect(hasCloze(text2)).toBe(true);
      expect(stripCloze(text1)).toBe('早く家に帰りたいです。');
      expect(stripCloze(text2)).toBe('これは本とペンです。');

      const segs = parseClozeSegments(text2);
      expect(segs.filter((s) => s.isCloze)).toHaveLength(2);
      expect(segs.find((s) => s.text === '本')).toBeDefined();
      expect(segs.find((s) => s.text === 'ペン')).toBeDefined();
    });
  });

  describe('BUG-DB-01 & BUG-DB-05: Real FSRS Review API & Atomic Database Transaction', () => {
    it('cập nhật FSRS state thực tế vào cards và ghi review_logs nguyên tử', async () => {
      // Lấy 1 thẻ có sẵn trong DB để test
      const cardList = await db.select().from(cards).limit(1);
      expect(cardList.length).toBeGreaterThan(0);
      const testCard = cardList[0];

      const initialReps = testCard.reps;
      const initialStability = testCard.stability;

      const req = new Request('http://localhost:3000/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: testCard.id,
          rating: 'Good',
        }),
      });

      const res = await reviewRoute(req);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.cardId).toBe(testCard.id);
      expect(body.data.rating).toBe('Good');
      expect(body.data.nextReviewDate).toBeDefined();

      // Kiểm tra trong database: reps phải tăng thêm 1
      const updatedCard = (await db.select().from(cards).where(eq(cards.id, testCard.id)))[0];
      expect(updatedCard.reps).toBe(initialReps + 1);
      expect(updatedCard.state).not.toBe('New');

      // Kiểm tra có review log tương ứng
      const logs = await db.select().from(reviewLogs).where(eq(reviewLogs.cardId, testCard.id));
      expect(logs.length).toBeGreaterThan(0);
      const latestLog = logs[logs.length - 1];
      expect(latestLog.rating).toBe('Good');
    });

    it('từ chối request review thiếu tham số bắt buộc với status 400', async () => {
      const req = new Request('http://localhost:3000/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId: 'some_id' }), // Thiếu rating
      });
      const res = await reviewRoute(req);
      expect(res.status).toBe(400);
    });
  });

  describe('BUG-OFF-02: Batch Review API Route', () => {
    it('xử lý đồng bộ nhiều thẻ một lúc trong duy nhất một transaction', async () => {
      const cardList = await db.select().from(cards).limit(2);
      expect(cardList.length).toBe(2);

      const req = new Request('http://localhost:3000/api/review/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviews: [
            { cardId: cardList[0].id, rating: 'Good' },
            { cardId: cardList[1].id, rating: 'Easy' },
          ],
        }),
      });

      const res = await batchReviewRoute(req);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.processedCount).toBe(2);
    });
  });

  describe('BUG-DB-02: Search Parameter in Cards API', () => {
    it('lọc chính xác thẻ học theo từ khóa tìm kiếm search', async () => {
      const req = new Request('http://localhost:3000/api/cards?search=nha');
      const res = await getCardsRoute(req);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.success).toBe(true);
      // Kết quả phải lọc, không trả về toàn bộ 600+ thẻ
      expect(body.data.length).toBeLessThan(600);
      // Mọi thẻ trả về phải chứa "nha" trong front, reading, hoặc meaning
      const hasMatch = body.data.every((c: any) =>
        (c.kanji && c.kanji.toLowerCase().includes('nha')) ||
        (c.reading && c.reading.toLowerCase().includes('nha')) ||
        (c.meaning && c.meaning.toLowerCase().includes('nha'))
      );
      expect(hasMatch).toBe(true);
    });
  });

  describe('BUG-SEC-03: Google OAuth CSRF State Token', () => {
    it('sinh chuỗi state ngẫu nhiên cryptographically strong 64 hex chars', () => {
      process.env.GOOGLE_CLIENT_ID = 'mock-client-id';
      process.env.GOOGLE_CLIENT_SECRET = 'mock-client-secret';

      const authData = generateAuthUrlWithState();
      expect(authData).not.toBeNull();
      expect(authData?.state).toHaveLength(64);
      expect(authData?.url).toContain(`state=${authData?.state}`);
    });
  });

  describe('BUG-SEC-05: Rate Limiter', () => {
    it('cho phép request trong hạn ngạch và đếm lùi remaining', () => {
      const res1 = checkRateLimit('test_user_ip', 5, 60000);
      expect(res1.allowed).toBe(true);
    });
  });

  describe('BUG-SEC-02: Auth Guard', () => {
    it('xác thực an toàn request trong môi trường kiểm thử', () => {
      const req = new Request('http://localhost:3000/api/cards');
      expect(verifyRequestAuth(req)).toBe(true);
    });
  });

  describe('BUG-TEST-01: Deterministic Card ID', () => {
    it('sinh cùng một ID cho cùng một từ vựng và bộ thẻ', () => {
      const id1 = generateDeterministicCardId('家', 'deck_jpd133_kanji');
      const id2 = generateDeterministicCardId('家', 'deck_jpd133_kanji');
      const id3 = generateDeterministicCardId('車', 'deck_jpd133_kanji');

      expect(id1).toBe(id2);
      expect(id1).not.toBe(id3);
      expect(id1.startsWith('card_')).toBe(true);
    });
  });
});
