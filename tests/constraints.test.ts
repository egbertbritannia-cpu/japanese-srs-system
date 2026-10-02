import { describe, it, expect } from 'vitest';
import { GeneratedCardSchema } from '../src/agents/constraints/schema-guard';
import { PedagogicalRulesGuard } from '../src/agents/constraints/pedagogical-rules';
import { AtomicityValidator } from '../src/agents/constraints/atomicity-validator';
import { CognitiveOwnershipGuard } from '../src/agents/constraints/cognitive-ownership';

describe('2.3. Constraints (Ràng Buộc & Ranh Giới) Tests', () => {
  it('GeneratedCardSchema: ép buộc đúng Hiragana, độ dài và mẫu pitch 0-4', () => {
    const validCard = {
      kanji_surface: '勉強',
      reading_furigana: 'べんきょう',
      primary_meaning: 'Học tập, nghiên cứu',
      context_sentence: '毎日日本語を{{c1::勉強}}します。',
      cloze_word: '勉強',
      etymology_notes: 'Bộ Lực kết hợp',
      pitch_pattern: 0,
    };

    const result = GeneratedCardSchema.safeParse(validCard);
    expect(result.success).toBe(true);

    // Thử với reading không phải Hiragana chuẩn (chứa Romaji hoặc Katakana)
    const invalidReading = { ...validCard, reading_furigana: 'benkyou' };
    const invalidResult = GeneratedCardSchema.safeParse(invalidReading);
    expect(invalidResult.success).toBe(false);
  });

  it('PedagogicalConstraints: ngăn chặn từ vựng N2/N1 khi học viên ở trình độ N4', () => {
    const n2Sentence = '状況を看過することはできないため勉強する。';
    const violations = PedagogicalRulesGuard.verifyIPlusOne(n2Sentence, '勉強', 'N4');
    expect(violations.some((v) => v.severity === 'CRITICAL')).toBe(true);
  });

  it('DesirableDifficulties: từ chối câu đục lỗ có sẵn Furigana lộ liễu', () => {
    const obviousSentence = '毎日日本語を{{c1::勉強[べんきょう]}}します。';
    const violations = PedagogicalRulesGuard.verifyDesirableDifficulties(obviousSentence, '勉強');
    expect(violations.length).toBeGreaterThan(0);
    expect(violations[0].rule).toBe('VIOLATION_DESIRABLE_DIFFICULTIES');
  });

  it('AtomicityConstraint: từ chối gom 5 nghĩa phái sinh vào 1 thẻ', () => {
    const result = AtomicityValidator.validate({
      front: 'かける',
      backExplanation: 'Giải thích ngắn gọn',
      primaryMeaning: 'treo; đeo kính; gọi điện; tốn thời gian; đậy nắp; bắt đầu làm',
    });

    expect(result.passed).toBe(false);
    expect(result.shouldSplit).toBe(true);
    expect(result.suggestedCardsCount).toBeGreaterThanOrEqual(5);
  });

  it('CognitiveOwnership: luôn tạo bản nháp (Draft), không tự ý chèn thẻ vào DB ngay', () => {
    const draft = CognitiveOwnershipGuard.createDraft('deck-1', {
      kanji_surface: '桜',
      reading_furigana: 'さくら',
      primary_meaning: 'Hoa anh đào',
      context_sentence: '春になると{{c1::桜}}が咲きます。',
      cloze_word: '桜',
      pitch_pattern: 0,
    });

    expect(draft.status).toBe('draft');
    expect(draft.reviewedByLearner).toBe(false);

    // Người học duyệt
    const approved = CognitiveOwnershipGuard.approveDraft(draft.id);
    expect(approved.status).toBe('approved');
    expect(approved.reviewedByLearner).toBe(true);
  });
});
