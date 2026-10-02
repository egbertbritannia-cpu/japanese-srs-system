import { describe, it, expect } from 'vitest';
import { FSRSEngine } from '../src/core/scheduler/fsrs-engine';
import { CardValidator } from '../src/core/cards/card.validator';
import { CardState } from '../src/core/scheduler/scheduler.interface';

/**
 * Kiểm thử đơn vị cho thuật toán lập lịch và thẻ (Unit Tests)
 */
describe('FSRSEngine & Card Validation', () => {
  const engine = new FSRSEngine({ desiredRetention: 0.9, enableFuzz: false });

  it('phải tính toán các khoảng cách ôn tập tăng dần theo mức đánh giá', () => {
    const mockCard: CardState = {
      cardId: 'card-1',
      due: new Date(),
      stability: 2,
      difficulty: 5,
      elapsedDays: 1,
      scheduledDays: 1,
      reps: 1,
      lapses: 0,
      state: 'Review',
    };

    const schedule = engine.schedule(mockCard, 'Good');

    expect(schedule.Again.interval).toBeLessThanOrEqual(schedule.Hard.interval);
    expect(schedule.Hard.interval).toBeLessThanOrEqual(schedule.Good.interval);
    expect(schedule.Good.interval).toBeLessThanOrEqual(schedule.Easy.interval);
  });

  it('phải cảnh báo khi thẻ chứa quá nhiều nghĩa vi phạm nguyên tắc Atomicity', () => {
    const invalidVocab = {
      type: 'Vocab' as const,
      word: 'かける',
      meaning: 'treo; đeo (kính); gọi (điện thoại); tốn (thời gian); khởi động (máy)',
    };

    const result = CardValidator.validate(invalidVocab);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings[0]).toContain('Atomicity');
  });

  it('phải xác thực thẻ Cloze có định dạng hợp lệ', () => {
    const validCloze = {
      type: 'Cloze' as const,
      sentence: '毎日日本語を{{c1::勉強}}します。',
    };

    const result = CardValidator.validate(validCloze);
    expect(result.isValid).toBe(true);
    expect(result.errors.length).toBe(0);
  });
});
