import { GeneratedCardSchema, GeneratedCard } from '../constraints/schema-guard';
import { AtomicityValidator } from '../constraints/atomicity-validator';
import { PedagogicalRulesGuard } from '../constraints/pedagogical-rules';

export interface CognitiveGuardrailInput {
  cardDraft: {
    kanji_surface: string;
    reading_furigana: string;
    primary_meaning: string;
    context_sentence: string;
    cloze_word: string;
    etymology_notes?: string;
    pitch_pattern: number;
  };
  backExplanation?: string;
  learnerLevel?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
}

export interface CognitiveGuardrailOutput {
  passed: boolean;
  shouldSplit: boolean; // Yêu cầu phân rã thành các thẻ riêng biệt khi chứa nghĩa phái sinh hoặc > 1 khái niệm
  suggestedCardsCount: number;
  derivativeMeanings: string[];
  validatedCard?: GeneratedCard;
  reasons: string[];
}

/**
 * Sub-Agent 3 / Bước 4: Kiểm duyệt ràng buộc tự động (Constraint & Guardrail Audit)
 * 
 * - Đầu ra của Agent được chuyển qua bộ thẩm định atomicity-validator.ts và thư viện kiểm tra cấu trúc Zod.
 * - Nếu phát hiện thẻ chứa cả nghĩa phái sinh phức tạp hoặc vượt quá 1 khái niệm mục tiêu,
 *   Guardrail sẽ lập tức yêu cầu Agent phân rã thành các thẻ riêng biệt để tuân thủ Nguyên tắc Thông tin Tối thiểu.
 */
export class CognitiveGuardrailAgent {
  static run(input: CognitiveGuardrailInput): CognitiveGuardrailOutput {
    const reasons: string[] = [];
    let shouldSplit = false;
    let suggestedCardsCount = 1;
    let derivativeMeanings: string[] = [input.cardDraft.primary_meaning];

    // 1. Kiểm tra Atomicity qua atomicity-validator.ts (Không quá 3 dòng giải thích, không gộp nhiều nghĩa phái sinh)
    const backText = input.backExplanation || `${input.cardDraft.primary_meaning}\n${input.cardDraft.etymology_notes || ''}`;
    const atomicity = AtomicityValidator.validate({
      front: input.cardDraft.kanji_surface,
      backExplanation: backText,
      primaryMeaning: input.cardDraft.primary_meaning,
    });

    if (!atomicity.passed) {
      reasons.push(...atomicity.reasons);
      if (atomicity.shouldSplit) {
        shouldSplit = true;
        suggestedCardsCount = atomicity.suggestedCardsCount;
        derivativeMeanings = atomicity.derivativeMeanings;
      }
    }

    // 2. Ràng buộc sư phạm (Desirable difficulties & i+1)
    const pedViolations = [
      ...PedagogicalRulesGuard.verifyIPlusOne(
        input.cardDraft.context_sentence,
        input.cardDraft.cloze_word,
        input.learnerLevel || 'N4'
      ),
      ...PedagogicalRulesGuard.verifyDesirableDifficulties(
        input.cardDraft.context_sentence,
        input.cardDraft.cloze_word
      ),
    ];

    for (const v of pedViolations) {
      if (v.severity === 'CRITICAL') {
        reasons.push(`[Sư phạm] ${v.detail}`);
      }
    }

    // 3. Ép cấu trúc Zod Schema (GeneratedCardSchema)
    const schemaResult = GeneratedCardSchema.safeParse(input.cardDraft);
    if (!schemaResult.success) {
      const issues = schemaResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
      reasons.push(`[Zod Schema Guard] ${issues.join(', ')}`);
    }

    const passed = reasons.length === 0;

    return {
      passed,
      shouldSplit,
      suggestedCardsCount,
      derivativeMeanings,
      validatedCard: passed ? schemaResult.data : undefined,
      reasons,
    };
  }
}

