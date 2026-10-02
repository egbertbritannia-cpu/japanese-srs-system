/**
 * Ràng buộc Sư phạm (Pedagogical Constraints)
 * Đảm bảo Agent luôn tuân thủ khoa học nhận thức và không tự ý thay đổi logic hệ thống:
 * 1. Nguyên tắc i + 1: Nghiêm cấm đặt câu ví dụ có từ vựng N2/N1 khi người học đang ở trình độ N4.
 * 2. Khó khăn mong muốn (Desirable Difficulties): Thẻ đục lỗ ngữ cảnh không được đưa gợi ý quá lộ liễu
 *    (như Furigana ngay trong câu hỏi) để kích hoạt quá trình gợi nhớ chủ động (Active Recall).
 */

export interface PedagogicalViolation {
  rule: 'VIOLATION_I_PLUS_ONE' | 'VIOLATION_DESIRABLE_DIFFICULTIES' | 'VIOLATION_OVERLOAD';
  severity: 'CRITICAL' | 'WARNING';
  detail: string;
}

export class PedagogicalRulesGuard {
  // Danh sách từ khóa/ngữ pháp đặc trưng của N2/N1 cần ngăn chặn đối với người học N5/N4
  private static advancedN2N1Patterns = [
    /において/, /に際して/, /をめぐって/, /にかかわらず/, /わけではない/,
    /ものがある/, /にほかならない/, /ざるを得ない/, /を余儀なくされる/,
    /憂慮/, /顕著/, /示唆/, /看過/, /乖離/, /脆弱/, /妥協/
  ];

  /**
   * Nguyên tắc i + 1:
   * Nghiêm cấm đặt câu ví dụ có từ vựng N2/N1 khi người học đang ở trình độ N5/N4.
   */
  static verifyIPlusOne(
    sentence: string,
    targetWord: string,
    learnerLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1' = 'N4'
  ): PedagogicalViolation[] {
    const violations: PedagogicalViolation[] = [];

    // Nếu người học ở N5 hoặc N4, quét các yếu tố N2/N1
    if (learnerLevel === 'N5' || learnerLevel === 'N4') {
      for (const pattern of this.advancedN2N1Patterns) {
        if (pattern.test(sentence)) {
          violations.push({
            rule: 'VIOLATION_I_PLUS_ONE',
            severity: 'CRITICAL',
            detail: `Phát hiện yếu tố ngữ pháp/từ vựng cao cấp (N2/N1) [${pattern.source}] trong câu ví dụ cho học viên ${learnerLevel}. Vi phạm nghiêm trọng nguyên tắc Krashen i+1.`,
          });
          break;
        }
      }
    }

    if (!sentence.includes(targetWord)) {
      violations.push({
        rule: 'VIOLATION_I_PLUS_ONE',
        severity: 'CRITICAL',
        detail: `Câu ví dụ bắt buộc phải chứa từ mục tiêu: [${targetWord}].`,
      });
    }

    return violations;
  }

  /**
   * Khó khăn mong muốn (Desirable Difficulties):
   * Thẻ đục lỗ ngữ cảnh không được đưa gợi ý quá lộ liễu (như Furigana ngay trong câu hỏi)
   * để kích hoạt quá trình gợi nhớ chủ động (Active Recall).
   */
  static verifyDesirableDifficulties(
    contextSentence: string,
    clozeWord: string
  ): PedagogicalViolation[] {
    const violations: PedagogicalViolation[] = [];

    // Kiểm tra xem trong câu hỏi cloze có chèn furigana trực tiếp cạnh cloze hay không (vd: {{c1::漢字[かんじ]}} hoặc <ruby>)
    const rubyRegex = /<ruby>.*?<\/ruby>/i;
    const bracketFuriganaRegex = /\{\{c\d+::.*?\[.*?\]\}\}/;

    if (rubyRegex.test(contextSentence) || bracketFuriganaRegex.test(contextSentence)) {
      violations.push({
        rule: 'VIOLATION_DESIRABLE_DIFFICULTIES',
        severity: 'CRITICAL',
        detail: 'Phát hiện Furigana lộ liễu bên trong câu đục lỗ. Bắt buộc xóa cách đọc trong câu hỏi để người học thực hiện Active Recall.',
      });
    }

    return violations;
  }
}
