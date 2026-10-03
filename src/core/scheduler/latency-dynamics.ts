/**
 * Bjork Retrieval Latency Dynamics & Storage Strength Calibration
 * Trụ Cột 1: Hiệu chỉnh Độ trễ Phản xạ Não bộ & Thang đo Lưu trữ Bjork
 * Căn cứ: planning/04_PHASE_4_COGNITIVE_SCIENCE_AND_FOUR_PILLARS.md
 */

export type SrsGrade = 'Again' | 'Hard' | 'Good' | 'Easy';

export interface LatencyCalibrationInput {
  durationMs: number;
  frontText: string;
  sentenceText?: string | null;
  userGrade: SrsGrade;
}

export interface LatencyCalibrationResult {
  adjustedGrade: SrsGrade;
  penaltyApplied: number;
  readingAllowanceMs: number;
  pureRetrievalMs: number;
  storageStrengthMultiplier: number;
  hesitationDetected: boolean;
  impulsiveActionDetected: boolean;
  rationale: string;
}

/**
 * Hiệu chỉnh thang đo độ trễ truy xuất nhận thức
 * - Chuẩn hóa thời gian đọc theo số lượng ký tự tiếng Nhật (120ms / ký tự)
 * - Ngăn chặn lạm phát điểm (Grade Inflation) do chần chừ ngập ngừng
 * - Tặng thưởng hệ số sức mạnh lưu trữ (Storage Strength) cho các nỗ lực truy xuất thành công (Desirable Difficulty)
 */
export function calibrateRetrievalLatency(input: LatencyCalibrationInput): LatencyCalibrationResult {
  const { durationMs, frontText, sentenceText, userGrade } = input;

  // 1. Tính tổng ký tự cần đọc để chuẩn hóa độ trễ
  const rawContext = (sentenceText && sentenceText.trim().length > 0)
    ? sentenceText.trim()
    : frontText.trim();

  const charCount = Math.max(1, rawContext.length);
  // Ước lượng thời gian đọc tự nhiên của người học: 120ms/ký tự (khoảng 500 ký tự/phút)
  const readingAllowanceMs = Math.round(charCount * 120);

  // Độ trễ truy xuất thuần túy (Pure Retrieval Latency) sau khi trừ thời gian đọc
  const pureRetrievalMs = Math.max(0, durationMs - readingAllowanceMs);

  let adjustedGrade: SrsGrade = userGrade;
  let penaltyApplied = 0;
  let hesitationDetected = false;
  let impulsiveActionDetected = false;
  let storageStrengthMultiplier = 1.0;
  let rationale = 'Độ trễ truy xuất bình thường.';

  // 2. Kiểm tra thao tác hấp tấp (Impulsive Failure / Rash Lapse)
  if (userGrade === 'Again' && durationMs < 400) {
    impulsiveActionDetected = true;
    rationale = 'Cảnh báo: Bấm quên quá nhanh (<400ms) khi chưa kịp kích hoạt nỗ lực hồi tưởng chủ động.';
    return {
      adjustedGrade: 'Again',
      penaltyApplied: 0,
      readingAllowanceMs,
      pureRetrievalMs,
      storageStrengthMultiplier: 0.85,
      hesitationDetected: false,
      impulsiveActionDetected: true,
      rationale,
    };
  }

  // 3. Kiểm tra chần chừ ngập ngừng (Hesitation Penalty)
  // Nếu người dùng chọn Easy/Good nhưng thời gian phản xạ thuần túy quá lâu (> 5000ms)
  if (userGrade === 'Easy' && pureRetrievalMs > 5500) {
    adjustedGrade = 'Hard';
    penaltyApplied = 2;
    hesitationDetected = true;
    rationale = `Phát hiện độ trễ lớn (${pureRetrievalMs}ms > 5500ms). Hạ bậc đánh giá từ Easy xuống Hard để tránh lạm phát độ ổn định FSRS.`;
  } else if (userGrade === 'Easy' && pureRetrievalMs > 3200) {
    adjustedGrade = 'Good';
    penaltyApplied = 1;
    hesitationDetected = true;
    rationale = `Độ trễ hồi tưởng đáng kể (${pureRetrievalMs}ms > 3200ms). Tự động điều chỉnh từ Easy xuống Good.`;
  } else if (userGrade === 'Good' && pureRetrievalMs > 5500) {
    adjustedGrade = 'Hard';
    penaltyApplied = 1;
    hesitationDetected = true;
    rationale = `Thời gian nhớ kéo dài (${pureRetrievalMs}ms > 5500ms). Chuyển từ Good sang Hard để củng cố thêm chu kỳ tiếp theo.`;
  }

  // 4. Thuyết Bjork về Độ khó Khát khao (Desirable Difficulty Multiplier)
  // Nếu nhớ thành công (Good/Easy) và có nỗ lực hồi tưởng tích cực (trong khoảng vàng 1500ms - 4500ms),
  // trí nhớ dài hạn (Storage Strength) sẽ được củng cố mạnh mẽ hơn việc nhớ quá dễ dàng tức thì.
  if (!hesitationDetected && (userGrade === 'Good' || userGrade === 'Easy')) {
    if (pureRetrievalMs >= 1500 && pureRetrievalMs <= 4500) {
      storageStrengthMultiplier = 1.15; // +15% Storage Strength Boost
      rationale = `Hồi tưởng thành công sau nỗ lực nhận thức tích cực (${pureRetrievalMs}ms). Tăng +15% Storage Strength (Bjork Desirable Difficulty).`;
    } else if (pureRetrievalMs < 800) {
      storageStrengthMultiplier = 1.0;
      rationale = `Hồi tưởng tức thì (${pureRetrievalMs}ms).`;
    }
  }

  return {
    adjustedGrade,
    penaltyApplied,
    readingAllowanceMs,
    pureRetrievalMs,
    storageStrengthMultiplier,
    hesitationDetected,
    impulsiveActionDetected,
    rationale,
  };
}
