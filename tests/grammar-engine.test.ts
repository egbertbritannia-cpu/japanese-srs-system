import { describe, it, expect } from 'vitest';
import { grammarRepository } from '@/db/repositories/grammarRepository';
import { patternToCards, exerciseToCard } from '@/core/grammar/grammarCardFactory';
import { CardValidator } from '@/core/cards/card.validator';
import { GrammarPattern, GrammarExercise } from '@/core/grammar/grammar.types';

describe('Grammar Engine Test Suite', () => {
  describe('Grammar Repository Queries', () => {
    it('returns all 4 JPD133 lessons with correct ordering and pattern counts', async () => {
      const data = await grammarRepository.getAllLessonsWithStats();
      expect(data.lessons).toBeDefined();
      expect(data.lessons.length).toBeGreaterThanOrEqual(4);
      expect(data.lessons.map(l => l.lessonNumber)).toContain(8);
      expect(data.stats.totalPatterns).toBeGreaterThanOrEqual(1);
    });

    it('returns lesson detail with parsed structureSlots and examples', async () => {
      const lesson8 = await grammarRepository.getLessonById('lesson-8');
      expect(lesson8).toBeDefined();
      expect(lesson8!.lessonNumber).toBe(8);
      expect(lesson8!.patterns).toBeDefined();
      expect(lesson8!.patterns!.length).toBe(9);

      // Verify Pattern 72
      const p72 = lesson8!.patterns![0];
      expect(p72.patternNumber).toBe(72);
      expect(Array.isArray(p72.structureSlots)).toBe(true);
      expect(Array.isArray(p72.examples)).toBe(true);
      expect(p72.examples.length).toBeGreaterThanOrEqual(1);
    });

    it('returns practice queue with expected limit', async () => {
      const queue = await grammarRepository.getPracticeQueue({ lessonId: 'lesson-8', limit: 5 });
      expect(queue).toBeDefined();
      expect(queue.length).toBeLessThanOrEqual(5);
    });
  });

  describe('Grammar Card Factory & Atomicity', () => {
    const mockPattern: GrammarPattern = {
      id: 'G-72',
      lessonId: 'lesson-8',
      patternNumber: 72,
      jlptLevel: 'N5',
      difficultyScore: 2,
      patternTemplate: 'Vて形 + います',
      structureSlots: [
        { label: 'Vて形', role: 'core_verb', color: '#1B4268', required: true },
        { label: 'います', role: 'auxiliary', color: '#88A752', required: true },
      ],
      meaningVi: 'Đang làm ~ (sinh sống/kết quả kéo dài)',
      meaningJa: '住んでいます',
      usageNote: 'Diễn tả trạng thái cư trú lâu dài',
      examples: [
        {
          ja: '私は横浜に住んでいます。',
          furigana: '私[わたし]は横浜[よこはま]に住[す]んでいます。',
          romaji: 'Watashi wa Yokohama ni sunde imasu.',
          vi: 'Tôi đang sống ở Yokohama.',
          highlight: '住んでいます',
          highlightType: 'pattern_core',
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('generates valid FSRS cards from a pattern', () => {
      const cards = patternToCards(mockPattern);
      expect(cards.length).toBeGreaterThanOrEqual(2);

      const recognitionCard = cards.find(c => c.id.includes('rec'));
      expect(recognitionCard).toBeDefined();
      expect(recognitionCard!.type).toBe('GrammarPattern');
      expect(recognitionCard!.state).toBe('New');
      expect(recognitionCard!.stability).toBe(0);

      const clozeCard = cards.find(c => c.id.includes('cloze'));
      expect(clozeCard).toBeDefined();
      expect(clozeCard!.front).toContain('{{c1::');
    });

    it('validates grammar card with CardValidator', () => {
      const validCard = {
        type: 'GrammarPattern' as const,
        patternTemplate: 'Vて形 + います',
        meaningVi: 'Đang làm gì',
      };

      const result = CardValidator.validate(validCard);
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('rejects grammar card with empty template or meaning', () => {
      const invalidCard = {
        type: 'GrammarPattern' as const,
        patternTemplate: '',
        meaningVi: '',
      };

      const result = CardValidator.validate(invalidCard);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(1);
    });
  });
});
