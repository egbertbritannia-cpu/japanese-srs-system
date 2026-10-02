import { describe, it, expect } from 'vitest';
import {
  calculateRetrievability,
  initDifficulty,
  nextDifficulty,
  initStability,
  nextStability,
  evaluateFSRSLoss,
  optimizeFsrsParameters,
  DEFAULT_FSRS_V5_WEIGHTS,
  ReviewRecord,
} from '../src/core/scheduler/fsrs-optimizer';

describe('Cognitive FSRS v5 Optimizer & Formulae', () => {
  it('should calculate Retrievability R(t, S) with decay correctly', () => {
    // Khi t = 0 (vừa học xong), R phải bằng 1.0
    expect(calculateRetrievability(0, 5)).toBe(1.0);

    // Khi t = S, factor = 1 + 19/81 * 1 = 100/81. Với w20 = 0.5, R ≈ 0.90
    const rAtStability = calculateRetrievability(5, 5, 0.5);
    expect(rAtStability).toBeGreaterThan(0.85);
    expect(rAtStability).toBeLessThan(0.95);

    // Khi t càng lớn, R càng suy giảm dần về 0
    const rLong = calculateRetrievability(300, 5);
    expect(rLong).toBeLessThan(0.3);
  });

  it('should compute initial and updated difficulty within [1, 10]', () => {
    const dAgain = initDifficulty(1);
    const dEasy = initDifficulty(4);

    expect(dAgain).toBeGreaterThanOrEqual(1.0);
    expect(dAgain).toBeLessThanOrEqual(10.0);
    expect(dEasy).toBeLessThan(dAgain); // Đánh giá Easy thì độ khó ban đầu phải thấp hơn Again

    // Cập nhật D'
    const nextD = nextDifficulty(5.0, 4); // Nhớ dễ thì độ khó tiếp theo phải giảm
    expect(nextD).toBeLessThan(5.0);
  });

  it('should update stability properly for recall and forget', () => {
    const s0 = initStability(3);
    expect(s0).toBeGreaterThan(0);

    // Recall thành công (Good) -> S phải tăng lên
    const sNextRecall = nextStability(s0, 5.0, 0.9, 3);
    expect(sNextRecall).toBeGreaterThan(s0);

    // Quên (Again) -> S suy giảm
    const sNextForget = nextStability(s0, 5.0, 0.5, 1);
    expect(sNextForget).toBeLessThan(sNextRecall);
  });

  it('should evaluate log-loss and RMSE on review records', () => {
    const mockHistory: ReviewRecord[] = [
      { cardId: 'c1', elapsedDays: 1, scheduledDays: 1, grade: 3, retrievabilityOutcome: 1, stabilityBefore: 2.0 },
      { cardId: 'c2', elapsedDays: 10, scheduledDays: 5, grade: 1, retrievabilityOutcome: 0, stabilityBefore: 2.0 },
      { cardId: 'c3', elapsedDays: 3, scheduledDays: 3, grade: 4, retrievabilityOutcome: 1, stabilityBefore: 4.0 },
    ];

    const loss = evaluateFSRSLoss(DEFAULT_FSRS_V5_WEIGHTS, mockHistory);
    expect(loss.logLoss).toBeGreaterThan(0);
    expect(loss.rmse).toBeGreaterThan(0);
    expect(loss.rmse).toBeLessThan(1.0);
  });

  it('should optimize parameters successfully with consistent learning history', async () => {
    const mockHistory: ReviewRecord[] = [];
    for (let i = 0; i < 20; i++) {
      const isSuccess = i % 4 !== 0; // 75% nhớ thành công
      const elapsed = isSuccess ? 1 : 40; // Thành công ôn sau 1 ngày, quên khi để quá hạn 40 ngày
      mockHistory.push({
        cardId: `c_${i}`,
        elapsedDays: elapsed,
        scheduledDays: isSuccess ? 1 : 5,
        grade: isSuccess ? 3 : 1,
        retrievabilityOutcome: isSuccess ? 1 : 0,
        stabilityBefore: 5.0,
      });
    }

    const result = await optimizeFsrsParameters(mockHistory, DEFAULT_FSRS_V5_WEIGHTS, 10);
    expect(result.weights).toHaveLength(21);
    expect(result.sampleSize).toBe(20);
    expect(result.rmse).toBeLessThan(0.45);
    expect(result.rollbackTriggered).toBe(false);
  });

  it('should trigger emergency rollback when loss diverges or anomaly is detected', async () => {
    const aberrantHistory: ReviewRecord[] = [];
    for (let i = 0; i < 25; i++) {
      aberrantHistory.push({
        cardId: `err_${i}`,
        elapsedDays: 1,
        scheduledDays: 1,
        grade: 1,
        retrievabilityOutcome: 0,
        stabilityBefore: 150, // Dữ liệu nghịch đảo cực đoan
      });
    }

    const result = await optimizeFsrsParameters(aberrantHistory, DEFAULT_FSRS_V5_WEIGHTS, 10);
    expect(result.rollbackTriggered).toBe(true);
    expect(result.weights).toEqual(DEFAULT_FSRS_V5_WEIGHTS);
  });
});
