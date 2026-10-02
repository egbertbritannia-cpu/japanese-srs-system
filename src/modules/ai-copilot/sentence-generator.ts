/**
 * (Giai đoạn 3) Sentence Generator
 * Sinh câu ngữ cảnh i+1 cá nhân hóa (Comprehensible Input Hypothesis)
 * Đảm bảo câu ví dụ chỉ chứa đúng 1 từ mới cần học (i+1), các từ còn lại người học đều đã nắm vững.
 */

export interface GeneratedSentence {
  targetWord: string;
  japaneseSentence: string;
  furiganaSentence: string;
  vietnameseMeaning: string;
  jlptLevel: string;
}

export class SentenceGenerator {
  /**
   * Sinh câu ngữ cảnh i+1 dựa trên từ mục tiêu và vốn từ vựng hiện tại của người học
   */
  static async generate(targetWord: string, knownVocabulary: string[] = []): Promise<GeneratedSentence> {
    // TODO: Kết nối API LLM (OpenAI / Gemini / Claude) với prompt được thiết kế theo nguyên tắc i+1
    return {
      targetWord,
      japaneseSentence: `これは${targetWord}を使った例文です。`,
      furiganaSentence: `これは${targetWord}をつかったれいぶんです。`,
      vietnameseMeaning: `Đây là câu ví dụ sử dụng từ ${targetWord}.`,
      jlptLevel: 'N5',
    };
  }
}
