import { describe, it, expect } from 'vitest';
import {
  romajiToHiragana,
  evaluateConjugation,
  getAllVerbs,
  filterVerbsByGroup,
} from '../src/lib/conjugation-engine';

describe('Japanese Verb Conjugation Engine & Transliteration Suite', () => {
  describe('Romaji to Hiragana Transliteration', () => {
    it('should correctly convert basic syllables', () => {
      expect(romajiToHiragana('taberu')).toBe('たべる');
      expect(romajiToHiragana('nomu')).toBe('のむ');
      expect(romajiToHiragana('kaku')).toBe('かく');
    });

    it('should handle sokuon (double consonants) correctly', () => {
      expect(romajiToHiragana('itte')).toBe('いって');
      expect(romajiToHiragana('matte')).toBe('まって');
      expect(romajiToHiragana('kaette')).toBe('かえって');
      expect(romajiToHiragana('katte')).toBe('かって');
    });

    it('should handle hatsuon (n sound) and double n (nn)', () => {
      expect(romajiToHiragana('nonde')).toBe('のんで');
      expect(romajiToHiragana('yonde')).toBe('よんで');
      expect(romajiToHiragana('shinde')).toBe('しんで');
      expect(romajiToHiragana('shinnde')).toBe('しんで');
    });

    it('should handle Hepburn tch sokuon correctly', () => {
      expect(romajiToHiragana('matcha')).toBe('まっちゃ');
      expect(romajiToHiragana('kocchi')).toBe('こっち');
      expect(romajiToHiragana('kotchi')).toBe('こっち');
    });

    it('should handle dakuon and handakuon', () => {
      expect(romajiToHiragana('oyoide')).toBe('およいで');
      expect(romajiToHiragana('isoide')).toBe('いそいで');
      expect(romajiToHiragana('benkyou')).toBe('べんきょう');
    });
  });

  describe('50 Verbs Dataset Verification', () => {
    it('should load exactly 50 verbs from the dataset', () => {
      const verbs = getAllVerbs();
      expect(verbs.length).toBe(50);
    });

    it('should filter correctly by group', () => {
      const g1 = filterVerbsByGroup(1);
      const g2 = filterVerbsByGroup(2);
      const g3 = filterVerbsByGroup(3);
      const exceptions = filterVerbsByGroup('exceptions');

      expect(g1.length).toBe(34);
      expect(g2.length).toBe(13);
      expect(g3.length).toBe(3);
      expect(g1.length + g2.length + g3.length).toBe(50);
      expect(exceptions.length).toBeGreaterThanOrEqual(6);
    });
  });

  describe('Conjugation Evaluation', () => {
    const all = getAllVerbs();
    const taberu = all.find((v) => v.kanji === '食べる')!;
    const iku = all.find((v) => v.kanji === '行く')!;
    const nomu = all.find((v) => v.kanji === '飲む')!;
    const kaeru = all.find((v) => v.kanji === '帰る')!;

    it('should accept Hiragana input for Te-form', () => {
      const res = evaluateConjugation('たべて', taberu, 'te');
      expect(res.isCorrect).toBe(true);
    });

    it('should accept Romaji input for Te-form', () => {
      const res = evaluateConjugation('tabete', taberu, 'te');
      expect(res.isCorrect).toBe(true);
    });

    it('should accept Kanji input for Te-form', () => {
      const res = evaluateConjugation('食べて', taberu, 'te');
      expect(res.isCorrect).toBe(true);
    });

    it('should evaluate special exception 行く correctly', () => {
      const correctTe = evaluateConjugation('itte', iku, 'te');
      expect(correctTe.isCorrect).toBe(true);

      const wrongTe = evaluateConjugation('iite', iku, 'te');
      expect(wrongTe.isCorrect).toBe(false);
      expect(wrongTe.ruleExplanation).toContain('行く');
    });

    it('should evaluate Godan exception 帰る correctly', () => {
      const correct = evaluateConjugation('kaette', kaeru, 'te');
      expect(correct.isCorrect).toBe(true);

      const wrong = evaluateConjugation('kaete', kaeru, 'te');
      expect(wrong.isCorrect).toBe(false);
      expect(wrong.ruleExplanation).toContain('帰る');
    });

    it('should evaluate Ru-form correctly', () => {
      const resHira = evaluateConjugation('のむ', nomu, 'ru');
      expect(resHira.isCorrect).toBe(true);

      const resRoma = evaluateConjugation('nomu', nomu, 'ru');
      expect(resRoma.isCorrect).toBe(true);
    });
  });
});
