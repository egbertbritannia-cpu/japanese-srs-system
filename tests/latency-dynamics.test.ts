import { describe, it, expect } from 'vitest';
import { calibrateRetrievalLatency } from '../src/core/scheduler/latency-dynamics';

describe('Bjork Latency Dynamics & Storage Strength Calibration', () => {
  it('should normalize reading allowance based on sentence length', () => {
    const longSentence = '私は毎朝七時に起きて、冷たい水を一杯飲んでから日本語を勉強します。';
    const charCount = longSentence.length;
    const result = calibrateRetrievalLatency({
      durationMs: 5000,
      frontText: '勉強',
      sentenceText: longSentence,
      userGrade: 'Good',
    });

    // charCount ký tự * 120ms allowance
    expect(result.readingAllowanceMs).toBe(charCount * 120);
    // Độ trễ thuần túy: 5000 - charCount * 120
    expect(result.pureRetrievalMs).toBe(5000 - charCount * 120);
    // Vì pureRetrievalMs < 5500ms nên không bị phạt hesitation
    expect(result.penaltyApplied).toBe(0);
    expect(result.adjustedGrade).toBe('Good');
  });

  it('should detect hesitation and downgrade rating when pure retrieval latency is excessive', () => {
    const shortWord = '水'; // 1 ký tự = 120ms
    const result = calibrateRetrievalLatency({
      durationMs: 7000, // 7 giây để nhớ 1 từ
      frontText: shortWord,
      userGrade: 'Good',
    });

    // pureRetrievalMs = 7000 - 120 = 6880ms > 5500ms
    expect(result.hesitationDetected).toBe(true);
    expect(result.penaltyApplied).toBe(1);
    expect(result.adjustedGrade).toBe('Hard'); // Bị giáng từ Good xuống Hard
  });

  it('should award Desirable Difficulty bonus when retrieval is effortful and successful', () => {
    const word = '曖昧'; // 2 ký tự = 240ms allowance
    const result = calibrateRetrievalLatency({
      durationMs: 3000, // pureRetrieval = 3000 - 240 = 2760ms (nằm trong dải vàng 1500ms - 4500ms)
      frontText: word,
      userGrade: 'Good',
    });

    expect(result.hesitationDetected).toBe(false);
    expect(result.storageStrengthMultiplier).toBe(1.15); // +15% Storage Strength boost
    expect(result.rationale).toContain('Bjork Desirable Difficulty');
  });

  it('should flag impulsive clicking on premature failure', () => {
    const result = calibrateRetrievalLatency({
      durationMs: 250, // Click Again chỉ sau 250ms
      frontText: '一期一会',
      userGrade: 'Again',
    });

    expect(result.impulsiveActionDetected).toBe(true);
    expect(result.storageStrengthMultiplier).toBe(0.85);
  });
});
