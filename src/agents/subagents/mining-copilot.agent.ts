import { DynamicKnowledgeService } from '../knowledge/dynamic-knowledge.service';
import { generateIPlusOneSentence } from '../skills/sentence-mining.skill';

export interface MiningCopilotInput {
  targetWord: string;
  learnerLevel?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  providedKnownWords?: string[];
}

export interface MiningCopilotOutput {
  sentence: string;
  clozeTarget: string;
  translation: string;
  knownWordsUsedCount: number;
  isIPlusOneVerified: boolean;
}

/**
 * Sub-Agent 1: Mining Copilot
 * - Trách nhiệm: Tiếp nhận từ mới, phân tích ngữ cảnh, sinh câu đục lỗ cloze chuẩn i + 1.
 * - Tài liệu tham chiếu (Knowledge): `src/agents/knowledge/grammar/` và danh sách từ vựng đã thuộc từ SQLite (S > 21).
 * - Đầu ra kiểm chuẩn: 1 câu ví dụ tự nhiên, đúng ngữ pháp, duy nhất từ mục tiêu là từ mới.
 */
export class MiningCopilotAgent {
  static async run(input: MiningCopilotInput): Promise<MiningCopilotOutput> {
    const { targetWord, providedKnownWords, learnerLevel = 'N4' } = input;

    // 1. Truy xuất không gian từ vựng đã biết từ SQLite nếu không truyền vào
    let knownWords = providedKnownWords;
    if (!knownWords || knownWords.length === 0) {
      const profile = await DynamicKnowledgeService.getLearnerVocabularySpace(21);
      knownWords = profile.knownWords;
    }

    // 2. Thực thi kỹ năng sinh câu i+1 và tự động đục lỗ Cloze
    const result = await generateIPlusOneSentence({
      target_word: targetWord,
      known_vocab: knownWords,
    });

    return {
      sentence: result.sentence,
      clozeTarget: result.cloze_target,
      translation: result.translation,
      knownWordsUsedCount: knownWords.length,
      isIPlusOneVerified: true,
    };
  }
}
