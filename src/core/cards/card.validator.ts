import { Flashcard } from './card.types';

export interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
}

/**
 * CardValidator
 * Kiểm tra Nguyên tắc Thông tin Tối thiểu (Atomicity - Minimum Information Principle)
 * Đảm bảo mỗi thẻ chỉ kiểm tra đúng một đơn vị kiến thức độc lập để tối ưu hóa hiệu quả ghi nhớ.
 */
export class CardValidator {
  /**
   * Xác thực thẻ học có vi phạm nguyên tắc Atomicity hay không
   */
  static validate(card: Partial<Flashcard>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!card.type) {
      errors.push('Loại thẻ (type) không được để trống.');
      return { isValid: false, errors, warnings };
    }

    switch (card.type) {
      case 'Vocab': {
        if (!card.word || card.word.trim().length === 0) {
          errors.push('Từ vựng không được để trống.');
        }
        if (!card.meaning || card.meaning.trim().length === 0) {
          errors.push('Nghĩa không được để trống.');
        }
        // Cảnh báo nếu một thẻ chứa quá nhiều nghĩa phân cách bằng dấu phẩy/chấm phẩy (vi phạm Atomicity)
        if (card.meaning && (card.meaning.split(/[,;\n]/).length > 3)) {
          warnings.push(
            'Thẻ chứa quá nhiều nghĩa (>3). Khuyến nghị chia nhỏ thành nhiều thẻ riêng biệt theo nguyên tắc Atomicity.'
          );
        }
        break;
      }

      case 'Cloze': {
        if (!card.sentence) {
          errors.push('Câu điền từ không được để trống.');
        } else {
          const matches = card.sentence.match(/\{\{c\d+::.*?\}\}/g);
          if (!matches || matches.length === 0) {
            errors.push('Thẻ Cloze phải chứa ít nhất một định dạng {{c1::từ cần điền}}.');
          } else if (matches.length > 2) {
            warnings.push(
              'Thẻ Cloze chứa quá nhiều chỗ trống (>2). Hãy giảm bớt để giảm tải nhận thức (Cognitive Load).'
            );
          }
        }
        break;
      }

      case 'Kanji': {
        if (!card.kanji || card.kanji.length !== 1) {
          warnings.push('Thẻ Kanji nên chỉ tập trung vào đúng 1 ký tự duy nhất.');
        }
        break;
      }

      case 'Pitch': {
        if (card.pitchNumber === undefined || card.pitchNumber < 0) {
          errors.push('Thẻ Pitch Accent cần chỉ số cao độ hợp lệ (>= 0).');
        }
        break;
      }

      case 'GrammarPattern': {
        if (!card.patternTemplate || card.patternTemplate.trim().length === 0) {
          errors.push('Mẫu câu ngữ pháp không được để trống.');
        }
        if (!card.meaningVi || card.meaningVi.trim().length === 0) {
          errors.push('Ý nghĩa ngữ pháp không được để trống.');
        }
        break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
