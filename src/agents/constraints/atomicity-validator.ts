/**
 * Bước 4: Kiểm duyệt ràng buộc tự động (Constraint & Guardrail Audit)
 * 
 * - Đầu ra của Agent được chuyển qua bộ thẩm định atomicity-validator.ts và thư viện kiểm tra cấu trúc Zod.
 * - Nếu phát hiện thẻ chứa cả nghĩa phái sinh phức tạp hoặc vượt quá 1 khái niệm mục tiêu,
 *   Guardrail sẽ lập tức yêu cầu Agent phân rã thành các thẻ riêng biệt để tuân thủ Nguyên tắc Thông tin Tối thiểu.
 */

export interface AtomicityValidationResult {
  passed: boolean;
  shouldSplit: boolean; // Báo hiệu cần phân rã thành nhiều thẻ riêng biệt
  reasons: string[];
  suggestedCardsCount: number;
  derivativeMeanings: string[];
}

export class AtomicityValidator {
  /**
   * Kiểm tra câu hỏi (front), mặt sau (back/explanation), và nghĩa chính (primaryMeaning)
   * Tuân thủ triệt để Nguyên tắc Thông tin Tối thiểu (Minimum Information Principle).
   */
  static validate(params: {
    front: string;
    backExplanation?: string;
    primaryMeaning: string;
    onyomiList?: string[];
    kunyomiList?: string[];
  }): AtomicityValidationResult {
    const reasons: string[] = [];
    let shouldSplit = false;
    let suggestedCardsCount = 1;

    // Phân tích nghĩa phái sinh / các khái niệm mục tiêu
    const derivativeMeanings = this.splitDerivativeMeanings(params.primaryMeaning);

    // 1. Kiểm tra số dòng giải thích ở mặt sau (> 3 dòng gây quá tải nhận thức)
    if (params.backExplanation) {
      const lines = params.backExplanation
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      if (lines.length > 3) {
        shouldSplit = true;
        reasons.push(
          `Mặt sau của thẻ chứa ${lines.length} dòng giải thích (> 3 dòng). Gây quá tải nhận thức, cần rút gọn hoặc phân rã thẻ.`
        );
      }
    }

    // 2. Kiểm tra gom cả On'yomi và Kun'yomi cùng lúc vào một thẻ
    const hasOnyomi =
      (params.onyomiList && params.onyomiList.length > 0) ||
      (params.backExplanation && /âm On|On'yomi|Onyomi/i.test(params.backExplanation));
    const hasKunyomi =
      (params.kunyomiList && params.kunyomiList.length > 0) ||
      (params.backExplanation && /âm Kun|Kun'yomi|Kunyomi/i.test(params.backExplanation));

    if (hasOnyomi && hasKunyomi) {
      shouldSplit = true;
      suggestedCardsCount = Math.max(suggestedCardsCount, 2);
      reasons.push(
        "Gom cả On'yomi và Kun'yomi vào cùng một thẻ học. Phải phân rã thành các thẻ theo từng từ ghép/ngữ cảnh thực tế (Vocabulary in context)."
      );
    }

    // 3. Kiểm tra nghĩa phái sinh phức tạp hoặc vượt quá 1 khái niệm mục tiêu
    if (derivativeMeanings.length > 1) {
      shouldSplit = true;
      suggestedCardsCount = Math.max(suggestedCardsCount, derivativeMeanings.length);
      reasons.push(
        `Phát hiện thẻ chứa ${derivativeMeanings.length} nghĩa phái sinh phức tạp (vượt quá 1 khái niệm mục tiêu). Guardrail yêu cầu phân rã thành ${derivativeMeanings.length} thẻ riêng biệt để tuân thủ Nguyên tắc Thông tin Tối thiểu.`
      );
    }

    const passed = reasons.length === 0;

    return {
      passed,
      shouldSplit,
      reasons,
      suggestedCardsCount,
      derivativeMeanings,
    };
  }

  /**
   * Tự động phân rã các nghĩa phái sinh phức tạp thành danh sách các nghĩa đơn lẻ độc lập
   * Hỗ trợ dấu chấm phẩy (;), dấu gạch chéo (/), xuống dòng (\n), dấu phẩy liệt kê khái niệm (,), hoặc danh sách đánh số.
   */
  static splitDerivativeMeanings(meaning: string): string[] {
    if (!meaning) return [];

    // Tách theo cấu trúc đánh số như: 1. ... 2. ... hoặc 1) ... 2) ...
    if (/(?:^|\s)(?:[1-9][.)]|①|②|③|④|⑤)/.test(meaning)) {
      return meaning
        .split(/(?:^|\s)(?:[1-9][.)]|①|②|③|④|⑤)\s*/)
        .map((m) => m.trim())
        .filter((m) => m.length > 0);
    }

    // Tách theo dấu chấm phẩy, gạch chéo, hoặc xuống dòng (phân cách nghĩa phái sinh rõ rệt)
    if (/[;/\n|]/.test(meaning)) {
      return meaning
        .split(/[;/\n|]/)
        .map((m) => m.trim())
        .filter((m) => m.length > 0);
    }

    // Nếu chứa dấu phẩy hoặc 、 gom >= 3 khái niệm phái sinh riêng biệt
    const commaParts = meaning
      .split(/[,、]/)
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    if (commaParts.length >= 3) {
      return commaParts;
    }

    // Mặc định là 1 khái niệm duy nhất
    return [meaning.trim()];
  }

  /**
   * Kiểm tra nhanh xem một từ có chứa nhiều nghĩa phái sinh phức tạp cần phân rã hay không
   */
  static hasComplexDerivativeMeanings(meaning: string): boolean {
    const parts = this.splitDerivativeMeanings(meaning);
    return parts.length > 1;
  }
}

