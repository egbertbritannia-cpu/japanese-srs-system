/**
 * FSRS Optimizer - Huấn luyện 21 tham số cá nhân hóa (FSRS v5)
 * Căn cứ: planning/04_PHASE_4_COGNITIVE_SCIENCE_AND_FOUR_PILLARS.md
 */

export interface ReviewRecord {
  cardId: string;
  elapsedDays: number;
  scheduledDays: number;
  grade: 1 | 2 | 3 | 4; // 1: Again, 2: Hard, 3: Good, 4: Easy
  retrievabilityOutcome: 0 | 1; // 1 nếu nhớ thành công (grade >= 2), 0 nếu quên (grade == 1)
  stabilityBefore?: number;
  difficultyBefore?: number;
}

export interface OptimizationResult {
  weights: number[];
  sampleSize: number;
  rmse: number;
  logLoss: number;
  optimizedAt: Date;
  rollbackTriggered: boolean;
  message: string;
}

/**
 * 21 Trọng số FSRS v5 chuẩn cộng đồng (Default Baseline)
 */
export const DEFAULT_FSRS_V5_WEIGHTS: number[] = [
  0.40255, 1.18385, 3.173, 15.69105, // w0..w3: Initial stability for grade 1..4
  7.1949,  0.5345,  1.4604, 0.0046,   // w4..w7: Difficulty init & update
  1.54575, 0.1192,  1.01925,          // w8..w10: Stability recall
  1.9395,  0.11,    0.29605, 0.22695, // w11..w14: Stability fail (lapses)
  0.5698,  2.8552,                    // w15..w16: Hard & Easy bonus
  0.5234,  0.3167,  0.6342,           // w17..w19: Short-term & intervals
  0.57                                // w20: Decay factor
];

/**
 * Tính toán Retrievability R(t, S) theo FSRS v5
 */
export function calculateRetrievability(elapsedDays: number, stability: number, w20 = 0.57): number {
  if (stability <= 0) return 0;
  if (elapsedDays <= 0) return 1.0;
  const factor = 1 + (19.0 / 81.0) * (elapsedDays / stability);
  return Math.pow(factor, -w20);
}

/**
 * Khởi tạo Difficulty D0(G)
 */
export function initDifficulty(grade: number, w: number[] = DEFAULT_FSRS_V5_WEIGHTS): number {
  const d0 = w[4] - Math.exp(w[5] * (grade - 1)) + 1;
  return Math.min(Math.max(d0, 1.0), 10.0);
}

/**
 * Cập nhật Difficulty tiếp theo D'
 */
export function nextDifficulty(
  d: number,
  grade: number,
  w: number[] = DEFAULT_FSRS_V5_WEIGHTS
): number {
  const deltaD = -w[6] * (grade - 3);
  const d0_good = initDifficulty(3, w);
  const nextD = w[7] * d0_good + (1 - w[7]) * (d + deltaD);
  return Math.min(Math.max(nextD, 1.0), 10.0);
}

/**
 * Khởi tạo Stability S0(G)
 */
export function initStability(grade: number, w: number[] = DEFAULT_FSRS_V5_WEIGHTS): number {
  const idx = Math.min(Math.max(grade - 1, 0), 3);
  return Math.max(w[idx], 0.1);
}

/**
 * Cập nhật Stability tiếp theo khi nhớ (Recall G >= 2) hoặc quên (Forget G == 1)
 */
export function nextStability(
  s: number,
  d: number,
  r: number,
  grade: number,
  w: number[] = DEFAULT_FSRS_V5_WEIGHTS
): number {
  if (grade === 1) {
    // Forget / Lapse
    const sFail =
      w[11] *
      Math.pow(d, -w[12]) *
      (Math.pow(s + 1, w[13]) - 1) *
      Math.exp(w[14] * (1 - r));
    return Math.max(sFail, 0.1);
  }

  // Recall thành công
  let bonus = 1.0;
  if (grade === 2) bonus = w[15]; // Hard penalty / bonus
  if (grade === 4) bonus = w[16]; // Easy bonus

  const exp8 = Math.exp(w[8]);
  const sInc =
    exp8 *
    (11 - d) *
    Math.pow(s, -w[9]) *
    (Math.exp(w[10] * (1 - r)) - 1) *
    bonus;

  const sNew = s * (sInc + 1);
  return Math.max(sNew, s);
}

/**
 * Tính toán Log-Loss và RMSE trên tập dữ liệu lịch sử ôn tập
 */
export function evaluateFSRSLoss(
  w: number[],
  history: ReviewRecord[]
): { logLoss: number; rmse: number } {
  if (history.length === 0) {
    return { logLoss: 0, rmse: 0 };
  }

  let totalLogLoss = 0;
  let totalSqError = 0;
  const eps = 1e-6;

  for (const record of history) {
    const s = record.stabilityBefore && record.stabilityBefore > 0
      ? record.stabilityBefore
      : initStability(record.grade, w);

    const rHat = Math.min(Math.max(calculateRetrievability(record.elapsedDays, s, w[20]), eps), 1 - eps);
    const y = record.retrievabilityOutcome;

    const loss = -(y * Math.log(rHat) + (1 - y) * Math.log(1 - rHat));
    totalLogLoss += loss;

    const err = y - rHat;
    totalSqError += err * err;
  }

  const n = history.length;
  return {
    logLoss: totalLogLoss / n,
    rmse: Math.sqrt(totalSqError / n),
  };
}

/**
 * Tối ưu hóa 21 tham số FSRS sử dụng Gradient Descent & Adam Optimizer
 * Tự động kích hoạt Emergency Rollback nếu RMSE > 0.45 hoặc dữ liệu mẫu không đủ tin cậy.
 */
export async function optimizeFsrsParameters(
  history: ReviewRecord[],
  initialWeights: number[] = DEFAULT_FSRS_V5_WEIGHTS,
  iterations = 60,
  lr = 0.015
): Promise<OptimizationResult> {
  const sampleSize = history.length;

  // Nếu dữ liệu quá ít (< 10 bản ghi), giữ nguyên weights chuẩn để tránh overfit
  if (sampleSize < 10) {
    const baseline = evaluateFSRSLoss(initialWeights, history);
    return {
      weights: [...initialWeights],
      sampleSize,
      rmse: baseline.rmse,
      logLoss: baseline.logLoss,
      optimizedAt: new Date(),
      rollbackTriggered: false,
      message: `Tập dữ liệu (${sampleSize} logs) chưa đủ ngưỡng tối thiểu 10 logs. Duy trì bộ trọng số cộng đồng chuẩn.`,
    };
  }

  // Khởi tạo weights
  let currentW = [...initialWeights];
  const m = new Array(21).fill(0);
  const v = new Array(21).fill(0);
  const beta1 = 0.9;
  const beta2 = 0.999;
  const epsilon = 1e-8;

  // Vòng lặp Adam gradient descent
  for (let t = 1; t <= iterations; t++) {
    const baseLoss = evaluateFSRSLoss(currentW, history).logLoss;
    const delta = 1e-4;
    const grads = new Array(21).fill(0);

    // Tính xấp xỉ đạo hàm theo sai phân hữu hạn (Finite Difference Gradient)
    for (let j = 0; j < 21; j++) {
      const orig = currentW[j];
      currentW[j] = orig + delta;
      const lossPlus = evaluateFSRSLoss(currentW, history).logLoss;
      grads[j] = (lossPlus - baseLoss) / delta;
      currentW[j] = orig; // Khôi phục

      // Thêm L2 Regularization (kéo về default weights để chống overfit)
      const reg = 0.005 * (orig - DEFAULT_FSRS_V5_WEIGHTS[j]);
      grads[j] += reg;
    }

    // Adam Update
    for (let j = 0; j < 21; j++) {
      m[j] = beta1 * m[j] + (1 - beta1) * grads[j];
      v[j] = beta2 * v[j] + (1 - beta2) * grads[j] * grads[j];

      const mHat = m[j] / (1 - Math.pow(beta1, t));
      const vHat = v[j] / (1 - Math.pow(beta2, t));

      let step = (lr / (Math.sqrt(vHat) + epsilon)) * mHat;
      // Giới hạn bước nhảy tối đa
      step = Math.min(Math.max(step, -0.3), 0.3);

      currentW[j] = Math.max(currentW[j] - step, 0.001);
    }
  }

  const finalEval = evaluateFSRSLoss(currentW, history);

  // Giao thức Hồi phục Khẩn cấp (Emergency Rollback Protocol)
  // Nếu RMSE > 0.45 hoặc NaN hoặc Log-loss > 2.0 -> Ngay lập tức khôi phục bộ trọng số chuẩn
  if (isNaN(finalEval.rmse) || isNaN(finalEval.logLoss) || currentW.some((w) => isNaN(w)) || finalEval.rmse > 0.45 || finalEval.logLoss > 2.0) {
    const fallbackEval = evaluateFSRSLoss(DEFAULT_FSRS_V5_WEIGHTS, history);
    return {
      weights: [...DEFAULT_FSRS_V5_WEIGHTS],
      sampleSize,
      rmse: fallbackEval.rmse,
      logLoss: fallbackEval.logLoss,
      optimizedAt: new Date(),
      rollbackTriggered: true,
      message: 'Cảnh báo: Mô hình tối ưu hóa phân kỳ (RMSE > 0.45). Đã kích hoạt Emergency Rollback về trọng số chuẩn.',
    };
  }

  return {
    weights: currentW,
    sampleSize,
    rmse: Number(finalEval.rmse.toFixed(4)),
    logLoss: Number(finalEval.logLoss.toFixed(4)),
    optimizedAt: new Date(),
    rollbackTriggered: false,
    message: `Tối ưu hóa 21 tham số FSRS thành công với ${sampleSize} bản ghi (RMSE: ${finalEval.rmse.toFixed(4)}).`,
  };
}
