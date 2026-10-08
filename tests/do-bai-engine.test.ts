import { describe, it, expect } from 'vitest';
import {
  convertDoBaiReflexToFsrs,
  interleaveRetryQueue,
  isDoBaiSessionFinished,
  DO_BAI_GRADE_CONFIG,
} from '../src/core/fsrs/dobai-engine';

describe('Phase 10: Rapid Reflex Minna Drill Studio with FSRS (Do Bai Engine)', () => {
  describe('1. Cognitive Reflex to FSRS Mathematical Grade Conversion', () => {
    it('maps rapid reflex (< 1.5s) to FSRS Easy (Grade 4)', () => {
      expect(convertDoBaiReflexToFsrs(true, 850)).toBe('Easy');
      expect(convertDoBaiReflexToFsrs(true, 0)).toBe('Easy');
      expect(convertDoBaiReflexToFsrs(true, 1499)).toBe('Easy');
      expect(DO_BAI_GRADE_CONFIG.Easy.fsrsRating).toBe(4);
    });

    it('maps standard recall (1.5s - 6.0s) to FSRS Good (Grade 3)', () => {
      expect(convertDoBaiReflexToFsrs(true, 1500)).toBe('Good');
      expect(convertDoBaiReflexToFsrs(true, 3200)).toBe('Good');
      expect(convertDoBaiReflexToFsrs(true, 6000)).toBe('Good');
      expect(DO_BAI_GRADE_CONFIG.Good.fsrsRating).toBe(3);
    });

    it('maps effortful recall (> 6.0s) to FSRS Hard (Grade 2)', () => {
      expect(convertDoBaiReflexToFsrs(true, 6001)).toBe('Hard');
      expect(convertDoBaiReflexToFsrs(true, 7500)).toBe('Hard');
      expect(convertDoBaiReflexToFsrs(true, 15000)).toBe('Hard');
      expect(DO_BAI_GRADE_CONFIG.Hard.fsrsRating).toBe(2);
    });

    it('maps unlearned reflex to FSRS Again (Grade 1) regardless of latency', () => {
      expect(convertDoBaiReflexToFsrs(false, 300)).toBe('Again');
      expect(convertDoBaiReflexToFsrs(false, 1500)).toBe('Again');
      expect(convertDoBaiReflexToFsrs(false, 8000)).toBe('Again');
      expect(DO_BAI_GRADE_CONFIG.Again.fsrsRating).toBe(1);
    });

    it('handles negative or unusual latency gracefully', () => {
      expect(convertDoBaiReflexToFsrs(true, -500)).toBe('Easy');
    });
  });

  describe('2. In-Session Columns D-E-F Retry Queue & Interleaving Logic', () => {
    it('interleaves failed card into queue after 2 turns', () => {
      const queue = ['cardA', 'cardB', 'cardC', 'cardD'];
      // User is at card 1 ('cardA')
      const { nextQueue, insertedAt } = interleaveRetryQueue(queue, 1, 'cardA', 2);

      // cardA was at index 0 (card 1). Next 2 cards are cardB (2), cardC (3).
      // Re-appears after cardC, before cardD => index 3 (card 4).
      expect(nextQueue).toEqual(['cardA', 'cardB', 'cardC', 'cardA', 'cardD']);
      expect(insertedAt).toBe(4);
    });

    it('handles interleaving when card is near the end of the queue', () => {
      const queue = ['cardA', 'cardB'];
      // User is at card 2 ('cardB') which is the last card
      const { nextQueue, insertedAt } = interleaveRetryQueue(queue, 2, 'cardB', 2);

      // Spliced to the very end
      expect(nextQueue).toEqual(['cardA', 'cardB', 'cardB']);
      expect(insertedAt).toBe(3);
    });
  });

  describe('3. Session Completion Invariant Validation', () => {
    it('does not allow session to finish if unlearned debt list is not zero', () => {
      // 5 total cards, user reached card 6, but 2 cards still unlearned in Columns D-E-F
      expect(isDoBaiSessionFinished(5, 6, 2)).toBe(false);
      expect(isDoBaiSessionFinished(5, 6, 1)).toBe(false);
    });

    it('allows session to finish only when all cards answered and debt is 0', () => {
      // 5 total cards, user past card 5 (at 6), 0 unlearned debt
      expect(isDoBaiSessionFinished(5, 6, 0)).toBe(true);
      // Still in progress
      expect(isDoBaiSessionFinished(5, 5, 0)).toBe(false);
      expect(isDoBaiSessionFinished(5, 1, 0)).toBe(false);
    });
  });
});
