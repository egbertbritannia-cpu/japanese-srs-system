/**
 * (Giai đoạn 3) Answer Evaluator
 * Đánh giá câu trả lời tự diễn giải (Self-Explanation Effect)
 * Cho phép người học tự giải thích nghĩa hoặc ngữ pháp theo cách hiểu của mình,
 * sau đó AI chấm điểm độ chính xác, chỉ ra thiếu sót và đề xuất cấp độ ôn tập phù hợp.
 */

export interface EvaluationResult {
  score: number; // 0 -> 100
  suggestedRating: 'Again' | 'Hard' | 'Good' | 'Easy';
  feedback: string;
  missingNuances: string[];
}

export class AnswerEvaluator {
  /**
   * Đánh giá lời diễn giải của người học so với nghĩa gốc của từ/câu
   */
  static async evaluate(
    targetItem: { word: string; standardMeaning: string },
    userExplanation: string
  ): Promise<EvaluationResult> {
    if (!userExplanation || userExplanation.trim().length === 0) {
      return {
        score: 0,
        suggestedRating: 'Again',
        feedback: 'Chưa có câu trả lời tự diễn giải.',
        missingNuances: ['Cần nhập lời diễn giải'],
      };
    }

    // TODO: Tích hợp LLM để phân tích ngữ nghĩa diễn giải
    return {
      score: 85,
      suggestedRating: 'Good',
      feedback: 'Bạn đã nắm được ý chính của từ, ngữ cảnh sử dụng tương đối chính xác.',
      missingNuances: [],
    };
  }
}
