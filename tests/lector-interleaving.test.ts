import { describe, it, expect } from 'vitest';
import {
  calculateCosineDistance,
  calculateHeuristicDistance,
  getPairwiseSemanticDistance,
  calculateQueueInterferenceScore,
  interleaveCardQueue,
  SrsCandidateCard,
} from '../src/core/scheduler/lector-interleaving';

describe('LECTOR Semantic Interleaving Engine', () => {
  it('should calculate cosine distance between vectors accurately', () => {
    const vecA = [1, 0, 0];
    const vecB = [1, 0, 0];
    const vecC = [0, 1, 0];

    // Trùng hoàn toàn -> distance = 0
    expect(calculateCosineDistance(vecA, vecB)).toBeCloseTo(0, 5);

    // Trực giao hoàn toàn -> similarity = 0 -> distance = 1
    expect(calculateCosineDistance(vecA, vecC)).toBeCloseTo(1, 5);
  });

  it('should detect orthographic and semantic similarity with heuristic distance', () => {
    const card1: SrsCandidateCard = {
      id: '1',
      front: '待つ',
      reading: 'まつ',
      meaning: 'Đợi chờ, ngóng trông',
      due: new Date(),
      stability: 1,
      difficulty: 5,
    };

    const card2: SrsCandidateCard = {
      id: '2',
      front: '期待',
      reading: 'きたい',
      meaning: 'Kỳ vọng, hy vọng trông đợi',
      due: new Date(),
      stability: 1,
      difficulty: 5,
    };

    const card3: SrsCandidateCard = {
      id: '3',
      front: 'リンゴ',
      reading: 'りんご',
      meaning: 'Quả táo tàu đỏ',
      due: new Date(),
      stability: 1,
      difficulty: 5,
    };

    // Card1 và Card2 trùng chữ '待' và có từ khóa nghĩa trông đợi -> khoảng cách phải thấp
    const dist12 = calculateHeuristicDistance(card1, card2);
    // Card1 và Card3 hoàn toàn khác biệt -> khoảng cách phải cao
    const dist13 = calculateHeuristicDistance(card1, card3);

    expect(dist12).toBeLessThan(dist13);
  });

  it('should reorder a queue with high interference into an interleaved queue', () => {
    // 4 thẻ: 2 thẻ về chùa/đợi (待つ, 寺) và 2 thẻ về quả/cơm (リンゴ, ご飯)
    const cards: SrsCandidateCard[] = [
      { id: '1', front: 'お寺', reading: 'おてら', meaning: 'Chùa chiền', due: new Date(), stability: 1, difficulty: 5 },
      { id: '2', front: '寺院', reading: 'じいん', meaning: 'Tu viện chùa', due: new Date(), stability: 1, difficulty: 5 },
      { id: '3', front: '果物', reading: 'くだもの', meaning: 'Trái cây ngọt', due: new Date(), stability: 1, difficulty: 5 },
      { id: '4', front: 'リンゴ', reading: 'りんご', meaning: 'Quả táo ngọt', due: new Date(), stability: 1, difficulty: 5 },
    ];

    const result = interleaveCardQueue(cards, 0.6);
    expect(result.orderedCards).toHaveLength(4);

    // Điểm can thiệp sau khi sắp xếp xen kẽ phải nhỏ hơn hoặc bằng điểm ban đầu
    expect(result.interferenceScoreAfter).toBeLessThanOrEqual(result.interferenceScoreBefore);
  });
});
