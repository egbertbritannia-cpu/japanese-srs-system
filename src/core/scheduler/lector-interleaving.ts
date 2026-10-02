/**
 * LECTOR Semantic Interleaving Engine
 * Trụ Cột 1: Kiểm soát Can thiệp Ngữ nghĩa (Proactive & Retroactive Interference Control)
 * Căn cứ: doc/14_PILLAR_1_ADAPTIVE_FSRS_AND_SEMANTIC_INTERFERENCE.md & doc/18_TECHNICAL_SPEC_AND_ATOMIC_IMPLEMENTATION_BLUEPRINT.md
 */

export interface SrsCandidateCard {
  id: string;
  front: string;
  reading?: string | null;
  meaning: string;
  due: Date | number;
  stability: number;
  difficulty: number;
  retrievability?: number;
  embeddingVector?: number[] | null;
}

export interface InterleaveResult {
  orderedCards: SrsCandidateCard[];
  interferenceScoreBefore: number;
  interferenceScoreAfter: number;
  interleavedPairsCount: number;
  repulsionsApplied: number;
}

/**
 * Tính Cosine Distance giữa 2 vector nhúng (1 - Cosine Similarity)
 */
export function calculateCosineDistance(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0 || vecA.length !== vecB.length) {
    return 1.0; // Khoảng cách tối đa nếu không có vector
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 1.0;
  const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  const clampedSim = Math.max(-1.0, Math.min(1.0, similarity));
  return 1.0 - clampedSim;
}

/**
 * Tính khoảng cách tương đồng kết hợp (Hybrid Orthographic & Semantic Distance)
 * Sử dụng khi không có vector nhúng AI:
 * - Trùng Kanji: Tăng mức độ can thiệp (giảm khoảng cách)
 * - Trùng Âm đọc (Onyomi/Kunyomi): Tăng mức độ can thiệp
 * - Trùng từ khóa nghĩa: Tăng mức độ can thiệp
 */
export function calculateHeuristicDistance(cardA: SrsCandidateCard, cardB: SrsCandidateCard): number {
  if (cardA.id === cardB.id) return 0.0;

  let similarityScore = 0.0;

  // 1. Kiểm tra Kanji trùng lặp trong mặt trước (Front)
  const setA = new Set(cardA.front.split(''));
  const setB = new Set(cardB.front.split(''));
  let sharedChars = 0;
  for (const char of setA) {
    // Chỉ xét ký tự Kanji (Unicode range 4E00 - 9FFF)
    if (char >= '\u4e00' && char <= '\u9fff' && setB.has(char)) {
      sharedChars++;
    }
  }
  if (sharedChars > 0) {
    similarityScore += Math.min(0.55, sharedChars * 0.35);
  }

  // 2. Kiểm tra phát âm đọc (Reading)
  if (cardA.reading && cardB.reading) {
    const rA = cardA.reading.trim().toLowerCase();
    const rB = cardB.reading.trim().toLowerCase();
    if (rA === rB) {
      similarityScore += 0.35;
    } else if (rA.includes(rB) || rB.includes(rA)) {
      similarityScore += 0.2;
    }
  }

  // 3. Kiểm tra ngữ nghĩa (Meaning words overlap)
  const wordsA = cardA.meaning.toLowerCase().split(/[\s,;/()]+/).filter((w) => w.length > 2);
  const wordsB = new Set(cardB.meaning.toLowerCase().split(/[\s,;/()]+/).filter((w) => w.length > 2));
  let meaningOverlap = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) meaningOverlap++;
  }
  if (meaningOverlap > 0) {
    similarityScore += Math.min(0.4, meaningOverlap * 0.2);
  }

  const clampedSimilarity = Math.min(1.0, similarityScore);
  return 1.0 - clampedSimilarity;
}

/**
 * Khoảng cách ngữ nghĩa tổng thể giữa 2 thẻ
 */
export function getPairwiseSemanticDistance(cardA: SrsCandidateCard, cardB: SrsCandidateCard): number {
  if (cardA.embeddingVector && cardB.embeddingVector) {
    return calculateCosineDistance(cardA.embeddingVector, cardB.embeddingVector);
  }
  return calculateHeuristicDistance(cardA, cardB);
}

/**
 * Tính tổng điểm can thiệp của danh sách thẻ hiện tại (Interference Energy)
 * Càng nhiều cặp thẻ kề cận có khoảng cách < threshold thì điểm phạt càng cao.
 */
export function calculateQueueInterferenceScore(queue: SrsCandidateCard[], threshold = 0.85): number {
  if (queue.length < 2) return 0;
  let totalScore = 0;

  for (let i = 0; i < queue.length - 1; i++) {
    const dist = getPairwiseSemanticDistance(queue[i], queue[i + 1]);
    if (dist < threshold) {
      // Phạt theo độ chênh lệch: càng gần nhau càng phạt nặng
      totalScore += (threshold - dist);
    }
  }
  return Number(totalScore.toFixed(4));
}

/**
 * Thuật toán sắp xếp xen kẽ LECTOR (Greedy Repulsion Queue Re-ordering)
 * Mục tiêu: Tối ưu hóa thứ tự hàng đợi ôn tập sao cho 2 thẻ liên tiếp có khoảng cách >= minSemanticDistance (0.85)
 * mà không vi phạm quá nhiều độ khẩn cấp ôn tập FSRS.
 */
export function interleaveCardQueue(
  cards: SrsCandidateCard[],
  minSemanticDistance = 0.85
): InterleaveResult {
  if (cards.length <= 2) {
    const initialScore = calculateQueueInterferenceScore(cards, minSemanticDistance);
    return {
      orderedCards: [...cards],
      interferenceScoreBefore: initialScore,
      interferenceScoreAfter: initialScore,
      interleavedPairsCount: 0,
      repulsionsApplied: 0,
    };
  }

  const initialScore = calculateQueueInterferenceScore(cards, minSemanticDistance);
  const remaining = [...cards];
  const ordered: SrsCandidateCard[] = [];
  let repulsionsApplied = 0;

  // Lấy thẻ đầu tiên có mức độ khẩn cấp cao nhất (hoặc do người dùng chỉ định)
  ordered.push(remaining.shift()!);

  while (remaining.length > 0) {
    const lastPlaced = ordered[ordered.length - 1];
    let bestIndex = 0;
    let bestScore = -Infinity;

    // Duyệt qua các ứng viên còn lại trong cửa sổ ưu tiên (Window search size = 8 để đảm bảo hiệu năng < 85ms)
    const windowSize = Math.min(remaining.length, 12);

    for (let i = 0; i < windowSize; i++) {
      const candidate = remaining[i];
      const dist = getPairwiseSemanticDistance(lastPlaced, candidate);

      // Điểm số ứng viên: Kết hợp khoảng cách phân tách ngữ nghĩa và độ khẩn cấp
      // Càng xa lastPlaced (dist cao), điểm càng cao.
      const distanceBonus = dist >= minSemanticDistance ? 2.0 : dist;
      // Phạt nhẹ vị trí sâu trong hàng đợi để không trì hoãn thẻ quá lâu
      const queuePositionPenalty = i * 0.05;

      const candidateScore = distanceBonus - queuePositionPenalty;

      if (candidateScore > bestScore) {
        bestScore = candidateScore;
        bestIndex = i;
      }
    }

    const selected = remaining.splice(bestIndex, 1)[0];
    const finalDist = getPairwiseSemanticDistance(lastPlaced, selected);
    if (bestIndex > 0 || finalDist < minSemanticDistance) {
      repulsionsApplied++;
    }
    ordered.push(selected);
  }

  const finalScore = calculateQueueInterferenceScore(ordered, minSemanticDistance);
  let interleavedPairsCount = 0;
  for (let i = 0; i < ordered.length - 1; i++) {
    if (getPairwiseSemanticDistance(ordered[i], ordered[i + 1]) >= minSemanticDistance) {
      interleavedPairsCount++;
    }
  }

  return {
    orderedCards: ordered,
    interferenceScoreBefore: initialScore,
    interferenceScoreAfter: finalScore,
    interleavedPairsCount,
    repulsionsApplied,
  };
}
