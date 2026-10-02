/**
 * (Giai đoạn 3) Phát hiện và lọc từ vựng dễ gây nhiễu (Interference Detection)
 * Ngăn chặn hiện tượng giao thoa trí nhớ (Memory Interference) khi học các từ
 * có phát âm tương tự, mặt chữ Kanji tương đồng (như 待つ / 持つ), hoặc cùng trường nghĩa.
 */

export interface InterferencePair {
  wordA: string;
  wordB: string;
  similarityScore: number; // 0.0 -> 1.0
  reason: 'VisualKanji' | 'Phonetic' | 'Semantic';
}

export class InterferenceDetector {
  /**
   * Tính toán độ tương đồng về mặt chữ (Levenshtein hoặc số nét / bộ thủ chung)
   */
  static calculateVisualSimilarity(word1: string, word2: string): number {
    if (word1 === word2) return 1.0;
    // Đơn giản hóa: so sánh tỷ lệ ký tự Kanji trùng nhau
    const setA = new Set(word1.split(''));
    const setB = new Set(word2.split(''));
    const intersection = new Set([...setA].filter((x) => setB.has(x)));
    return (2.0 * intersection.size) / (setA.size + setB.size);
  }

  /**
   * Tính toán độ tương đồng phát âm (Furigana / Romaji)
   */
  static calculatePhoneticSimilarity(reading1: string, reading2: string): number {
    if (reading1 === reading2) return 1.0;
    // Kiểm tra âm tiết bắt đầu hoặc kết thúc giống nhau
    let matches = 0;
    const minLen = Math.min(reading1.length, reading2.length);
    for (let i = 0; i < minLen; i++) {
      if (reading1[i] === reading2[i]) matches++;
    }
    return matches / Math.max(reading1.length, reading2.length);
  }

  /**
   * Kiểm tra xem 2 thẻ có nguy cơ gây nhiễu khi học cùng lúc không
   */
  static detectInterference(
    card1: { word: string; reading: string },
    card2: { word: string; reading: string },
    threshold = 0.7
  ): InterferencePair | null {
    const visualScore = this.calculateVisualSimilarity(card1.word, card2.word);
    if (visualScore >= threshold) {
      return {
        wordA: card1.word,
        wordB: card2.word,
        similarityScore: visualScore,
        reason: 'VisualKanji',
      };
    }

    const phoneticScore = this.calculatePhoneticSimilarity(card1.reading, card2.reading);
    if (phoneticScore >= threshold) {
      return {
        wordA: card1.word,
        wordB: card2.word,
        similarityScore: phoneticScore,
        reason: 'Phonetic',
      };
    }

    return null;
  }
}
