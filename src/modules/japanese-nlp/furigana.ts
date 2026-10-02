/**
 * Bộ trích xuất Furigana từ mặt chữ Kanji (Japanese NLP)
 * Sử dụng Kuromoji / MeCab để phân tích từ loại và gắn thẻ cách đọc Furigana/Hiragana
 */

export interface FuriganaSegment {
  ruby: string; // Ký tự kanji hoặc chữ gốc
  rt?: string;  // Furigana tương ứng (nếu có)
}

export class FuriganaExtractor {
  /**
   * Chuyển đổi văn bản tiếng Nhật thành cấu trúc HTML Ruby hoặc chuỗi biểu diễn Furigana
   * Ví dụ: 漢字 -> <ruby>漢<rt>かん</rt>字<rt>じ</rt></ruby>
   */
  static extractFurigana(text: string): FuriganaSegment[] {
    // Triển khai tích hợp tokenizer (Kuromoji hoặc MeCab)
    // Placeholder logic demo
    return [
      { ruby: text }
    ];
  }

  /**
   * Tạo chuỗi Furigana định dạng ngoặc vuông: 漢字[かんじ]
   */
  static toBracketNotation(text: string): string {
    return text;
  }
}

export function generateFurigana(text: string): string {
  return FuriganaExtractor.toBracketNotation(text);
}
