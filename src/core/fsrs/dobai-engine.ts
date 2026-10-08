// Location: src/core/fsrs/dobai-engine.ts
/**
 * DÒ BÀI RAPID REFLEX COGNITIVE ENGINE & BJORK LATENCY CONVERTER
 * DỰ ÁN: 記憶道 (Kiokudo · Japanese SRS System)
 * GIAI ĐOẠN 10: Minna Retrieval Practice Studio với FSRS v4.5
 * Tuân thủ tuyệt đối: 6 Điều răn tối cao trong AGENTS.md (Zero Backend Regression)
 */

export type DoBaiGrade = 'Again' | 'Hard' | 'Good' | 'Easy';

export interface DoBaiGradeMetadata {
  kanji: string;
  title: string;
  color: string;
  badgeBg: string;
  fsrsRating: number;
}

export const DO_BAI_GRADE_CONFIG: Record<DoBaiGrade, DoBaiGradeMetadata> = {
  Again: {
    kanji: '再',
    title: 'Again · Chưa Nhớ (Lapse)',
    color: '#9E3223',
    badgeBg: 'rgba(158, 50, 35, 0.12)',
    fsrsRating: 1,
  },
  Hard: {
    kanji: '難',
    title: 'Hard · Khó Khăn (> 6.0s)',
    color: '#AF7E36',
    badgeBg: 'rgba(175, 126, 54, 0.12)',
    fsrsRating: 2,
  },
  Good: {
    kanji: '良',
    title: 'Good · Nhớ Tốt (1.5s - 6.0s)',
    color: '#1E4B75',
    badgeBg: 'rgba(30, 75, 117, 0.12)',
    fsrsRating: 3,
  },
  Easy: {
    kanji: '易',
    title: 'Easy · Phản Xạ Cực Nhanh (< 1.5s)',
    color: '#386641',
    badgeBg: 'rgba(56, 102, 65, 0.12)',
    fsrsRating: 4,
  },
};

/**
 * 1. Quy đổi thời gian phản xạ (Bjork Retrieval Latency) sang điểm FSRS chuẩn:
 * - isLearned = false => FSRS Again (Grade 1 / Lapse)
 * - isLearned = true & latency < 1500ms => FSRS Easy (Grade 4 / High retrieval fluency)
 * - isLearned = true & 1500ms <= latency <= 6000ms => FSRS Good (Grade 3 / Desirable difficulty)
 * - isLearned = true & latency > 6000ms => FSRS Hard (Grade 2 / Effortful recall)
 */
export function convertDoBaiReflexToFsrs(isLearned: boolean, latencyMs: number): DoBaiGrade {
  if (!isLearned) {
    return 'Again';
  }

  const safeLatency = Math.max(0, latencyMs);

  if (safeLatency < 1500) {
    return 'Easy';
  }
  if (safeLatency <= 6000) {
    return 'Good';
  }
  return 'Hard';
}

/**
 * 2. Thuật toán Xen kẽ Hàng đợi (Interleaving Retry Queue - Columns D-E-F):
 * Chèn từ vừa làm sai vào hàng đợi sau N lượt (mặc định 2 lượt).
 * @param queue Hàng đợi hiện tại
 * @param current1BasedIdx Vị trí thẻ hiện tại (1-indexed)
 * @param card Thẻ cần học lại
 * @param turnsAhead Số lượt giãn cách (mặc định 2)
 */
export function interleaveRetryQueue<T>(
  queue: readonly T[],
  current1BasedIdx: number,
  card: T,
  turnsAhead = 2
): { nextQueue: T[]; insertedAt: number } {
  const nextQueue = [...queue];
  // current1BasedIdx - 1 là index thẻ hiện tại
  // Chèn sau thẻ hiện tại + turnsAhead lượt
  const targetIndex = Math.min(nextQueue.length, Math.max(0, current1BasedIdx + turnsAhead));
  nextQueue.splice(targetIndex, 0, card);

  return {
    nextQueue,
    insertedAt: targetIndex + 1, // 1-indexed
  };
}

/**
 * 3. Kiểm định hoàn thành phiên Dò bài:
 * Phiên học CHỈ HOÀN TẤT khi:
 * - Con trỏ thẻ đã đi hết hàng đợi (currentIdx > totalCards)
 * - VÀ danh sách nợ Cột D-E-F hoàn toàn rỗng (unlearnedCount === 0)
 */
export function isDoBaiSessionFinished(
  totalCards: number,
  current1BasedIdx: number,
  unlearnedCount: number
): boolean {
  if (unlearnedCount > 0) {
    return false;
  }
  return current1BasedIdx > totalCards;
}
