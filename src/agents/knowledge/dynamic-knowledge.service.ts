import { CardRepository } from '@/db/repositories/card-repository';

export interface UserVocabularyProfile {
  knownWords: string[];
  totalMasteredCount: number;
  minStabilityThreshold: number; // Mặc định S > 21 ngày
}

/**
 * DynamicKnowledgeService
 * Tri thức Cá nhân hóa Động (Dynamic Knowledge)
 * Khi chạy, Agent đọc trực tiếp từ SQLite danh sách các từ vựng người học đã đạt độ ổn định S > 21 ngày
 * để xác định chính xác "không gian từ vựng đã biết" (i), phục vụ tạo câu ví dụ chuẩn Krashen i+1.
 */
export class DynamicKnowledgeService {
  private static defaultThreshold = 21; // S > 21 ngày (theo FSRS được xem là trí nhớ dài hạn ổn định)

  /**
   * Truy vấn không gian từ vựng người học đã thuần thục
   */
  static async getLearnerVocabularySpace(minStability = this.defaultThreshold): Promise<UserVocabularyProfile> {
    try {
      const knownWords = await CardRepository.getKnownWords(minStability);
      return {
        knownWords,
        totalMasteredCount: knownWords.length,
        minStabilityThreshold: minStability,
      };
    } catch (error) {
      console.warn('Lỗi khi truy xuất Dynamic Knowledge từ SQLite, dùng fallback rỗng:', error);
      return {
        knownWords: [],
        totalMasteredCount: 0,
        minStabilityThreshold: minStability,
      };
    }
  }

  /**
   * Kiểm tra xem một từ đã thuộc không gian từ vựng đã biết (S > 21) hay chưa
   */
  static async isWordMastered(word: string, minStability = this.defaultThreshold): Promise<boolean> {
    const profile = await this.getLearnerVocabularySpace(minStability);
    return profile.knownWords.includes(word);
  }
}
