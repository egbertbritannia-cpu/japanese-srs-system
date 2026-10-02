import { getAgentConfig, AgentConfig } from './configs/agent-config';
import { MiningCopilotAgent } from './subagents/mining-copilot.agent';
import { KanjiPitchExpertAgent } from './subagents/kanji-pitch-expert.agent';
import { CognitiveGuardrailAgent } from './subagents/cognitive-guardrail.agent';
import { CognitiveOwnershipGuard, CardDraft } from './constraints/cognitive-ownership';
import { GeneratedCard, GeneratedCardSchema } from './constraints/schema-guard';
import { validateAndSaveCard } from './skills/card-creator.skill';
import { DynamicKnowledgeService } from './knowledge/dynamic-knowledge.service';
import { AtomicityValidator } from './constraints/atomicity-validator';
import fs from 'fs';
import path from 'path';

export interface CopilotMiningRequest {
  deckId?: string;
  word: string;
  reading?: string;
  meaning?: string;
  knownWords?: string[];
  learnerLevel?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
}

export interface FivePhaseExecutionAudit {
  phase1_requestIngestion: {
    receivedAt: string;
    targetWord: string;
    reading: string;
    meaning: string;
  };
  phase2_contextRetrieval: {
    sqliteMasteredVocabCount: number;
    grammarGroundingPath: string;
    kanjiGroundingPath: string;
    phoneticsGroundingPath: string;
  };
  phase3_skillExecution: {
    miningResult: {
      sentence: string;
      clozeTarget: string;
      translation: string;
    };
    kanjiPitchResult: {
      semanticRadical?: string;
      phoneticGrapheme?: string;
      pitchPatternCode: number;
      pitchPatternName: string;
      pitchGraphSvg: string;
    };
  };
  phase4_guardrailReview: {
    passed: boolean;
    reasons: string[];
    schemaValidated: boolean;
    autoSplitTriggered: boolean;
  };
  phase5_learnerConfirmation: {
    draftIds: string[];
    status: 'draft';
    message: string;
  };
}

export interface CopilotMiningResponse {
  success: boolean;
  draft?: CardDraft;
  drafts?: CardDraft[]; // Danh sách các thẻ sau khi tự động phân rã nếu chứa nhiều nghĩa
  card?: GeneratedCard;
  feedback: string;
  atomicityPassed: boolean;
  masteredWordsCount?: number;
  auditTrail?: FivePhaseExecutionAudit;
}

// Từ điển từ vựng thông dụng để hỗ trợ chế độ "1 ô nhập duy nhất" khi offline hoặc chưa gắn key
const COMMON_VOCAB_DICTIONARY: Record<string, { reading: string; meaning: string }> = {
  '警察': { reading: 'けいさつ', meaning: 'Cảnh sát, lực lượng an ninh' },
  '際': { reading: 'さい', meaning: 'Dịp, thời điểm' },
  '勉強': { reading: 'べんきょう', meaning: 'Học tập, nghiên cứu' },
  '桜': { reading: 'さくら', meaning: 'Hoa anh đào' },
  '猫': { reading: 'ねこ', meaning: 'Con mèo' },
  '本': { reading: 'ほん', meaning: 'Quyển sách' },
  '雨': { reading: 'あめ', meaning: 'Cơn mưa' },
  '飛行機': { reading: 'ひこうき', meaning: 'Máy bay' },
  '花': { reading: 'はな', meaning: 'Bông hoa' },
  'かける': { reading: 'かける', meaning: 'Treo lên; Đeo kính; Gọi điện thoại' },
  '食べる': { reading: 'たべる', meaning: 'Ăn uống' },
  '飲む': { reading: 'のむ', meaning: 'Uống' },
  '行く': { reading: 'いく', meaning: 'Đi tới' },
  '来る': { reading: 'くる', meaning: 'Đến' },
};

/**
 * Japanese SRS Copilot Orchestrator
 * Điều phối quy trình khép kín gồm 5 pha tác vụ:
 * 1. Tiếp nhận yêu cầu (hỗ trợ 1 ô nhập duy nhất: Nhờ AI tạo thẻ)
 * 2. Truy xuất bối cảnh (Dynamic Knowledge Retrieval: S > 21 days)
 * 3. Thực thi kỹ năng (LLM SDK + zodResponseFormat hoặc Sub-Agents pipeline)
 * 4. Rà soát ràng buộc & Tự động phân rã nghĩa phái sinh (Cognitive Guardrail)
 * 5. Xác nhận của người học (Cognitive Ownership Guard) & Lưu FSRS (D=0, S=0, State=0)
 */
export class CopilotOrchestrator {
  private config: AgentConfig;

  constructor(configOverride?: Partial<AgentConfig>) {
    this.config = getAgentConfig(configOverride);
  }

  /**
   * Nạp System Prompt định hình ranh giới hành vi Agent từ file prompt-guardrails.md
   */
  private loadSystemPromptGuardrails(): string {
    try {
      const promptPath = path.resolve(process.cwd(), 'src/agents/constraints/prompt-guardrails.md');
      if (fs.existsSync(promptPath)) {
        return fs.readFileSync(promptPath, 'utf-8');
      }
    } catch {
      // Fallback
    }
    return `Bạn là Trợ lý Học tập Ngôn ngữ Tiếng Nhật vận hành theo Nguyên lý Khoa học Nhận thức.
CÁC RÀNG BUỘC TUYỆT ĐỐI:
1. NGUYÊN TẮC THÔNG TIN TỐI THIỂU: Mỗi thẻ chỉ được dạy duy nhất MỘT khái niệm hoặc MỘT từ vựng.
2. NGUYÊN TẮC i+1: Câu ví dụ phải hoàn toàn dễ hiểu đối với người học, ngoại trừ từ vựng mục tiêu.
3. NGỮ NGUYÊN HỌC: Với Kanji, ưu tiên chỉ ra Thành tố biểu âm và Bộ thủ biểu ý.
4. ĐỊNH DẠNG ĐẦU RA: Chỉ trả về định dạng JSON hợp lệ theo Schema.`;
  }

  /**
   * Gọi LLM SDK kết hợp với zodResponseFormat nếu có biến môi trường OPENAI_API_KEY
   */
  private async callLLMWithZodFormat(
    word: string,
    learnerLevel: string,
    knownWords: string[]
  ): Promise<GeneratedCard | null> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return null;

    try {
      const { OpenAI } = await import('openai');
      const { zodResponseFormat } = await import('openai/helpers/zod');

      const openai = new OpenAI({ apiKey });
      const systemPrompt = this.loadSystemPromptGuardrails();

      const completion = await openai.chat.completions.create({
        model: process.env.LLM_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: `Hãy phân tích từ tiếng Nhật: "${word}" cho học viên trình độ ${learnerLevel}.
Không gian từ vựng học viên đã nắm vững (S > 21 ngày): [${knownWords.slice(0, 30).join(', ')}].
Tạo một thẻ học chuẩn với 1 nghĩa đơn nguyên tử (< 100 ký tự), câu ví dụ i+1 chứa {{c1::${word}}}, furigana Hiragana chuẩn, pitch pattern (0-3), và giải thích ngữ nguyên Keisei-moji (nếu có Kanji).`,
          },
        ],
        response_format: zodResponseFormat(GeneratedCardSchema, 'card_draft') as any,
      });

      const text = completion.choices[0]?.message?.content;
      if (text) {
        return JSON.parse(text) as GeneratedCard;
      }
      return null;
    } catch (err: any) {
      console.warn('[LLM Call Warning] Không thể gọi OpenAI API:', err?.message);
      return null;
    }
  }

  /**
   * Vận hành quy trình 5 pha tác vụ khép kín
   */
  async mineAndDraftCard(request: CopilotMiningRequest): Promise<CopilotMiningResponse> {
    const { word, reading, meaning, deckId = 'default_deck', learnerLevel = 'N4' } = request;

    // Suy luận reading và meaning nếu người học dùng chế độ "1 ô nhập duy nhất: Nhờ AI tạo thẻ"
    const resolvedReading = reading || COMMON_VOCAB_DICTIONARY[word]?.reading || word;
    const resolvedMeaning = (meaning && meaning.trim().length > 0)
      ? meaning.trim()
      : COMMON_VOCAB_DICTIONARY[word]?.meaning || `Nghĩa của từ ${word}`;

    // ==========================================
    // PHA 1: TIẾP NHẬN YÊU CẦU (Request Ingestion)
    // ==========================================
    const phase1Data = {
      receivedAt: new Date().toISOString(),
      targetWord: word,
      reading: resolvedReading,
      meaning: resolvedMeaning,
    };

    // ==========================================
    // PHA 2: TRUY XUẤT BỐI CẢNH (Context Retrieval)
    // ==========================================
    let effectiveKnownWords = request.knownWords;
    let totalMastered = 0;
    if (!effectiveKnownWords || effectiveKnownWords.length === 0) {
      const dynamicProfile = await DynamicKnowledgeService.getLearnerVocabularySpace(21);
      effectiveKnownWords = dynamicProfile.knownWords;
      totalMastered = dynamicProfile.totalMasteredCount;
    }

    const phase2Data = {
      sqliteMasteredVocabCount: totalMastered,
      grammarGroundingPath: 'src/agents/knowledge/grammar/n5-n3-grammar-points.md',
      kanjiGroundingPath: 'src/agents/knowledge/kanji/phonetic-components.json',
      phoneticsGroundingPath: 'src/agents/knowledge/phonetics/pitch-accent-rules.md',
    };

    // ==========================================
    // PHA 3: THỰC THI KỸ NĂNG (Sub-Agents Execution / LLM with zodResponseFormat)
    // ==========================================
    // Thử gọi LLM SDK với zodResponseFormat trước nếu có OPENAI_API_KEY
    const llmCard = await this.callLLMWithZodFormat(word, learnerLevel, effectiveKnownWords);

    let miningOutput: { sentence: string; clozeTarget: string; translation: string };
    let kanjiPitchOutput: any;

    if (llmCard) {
      miningOutput = {
        sentence: llmCard.context_sentence,
        clozeTarget: `{{c1::${llmCard.cloze_word}}}`,
        translation: llmCard.primary_meaning,
      };
      kanjiPitchOutput = {
        semanticRadical: 'Từ điển biểu ý',
        phoneticGrapheme: 'Thành tố biểu âm',
        pitchPatternCode: llmCard.pitch_pattern,
        pitchPatternName: ['Heiban', 'Atamadaka', 'Nakadaka', 'Odaka'][llmCard.pitch_pattern] || 'Heiban',
        pitchGraphSvg: `<svg height="30" width="100"><text x="10" y="20" fill="#38bdf8">Pitch [${llmCard.pitch_pattern}]</text></svg>`,
        etymologySummary: llmCard.etymology_notes || '',
      };
    } else {
      // 3.1. Sub-Agent 1: Mining Copilot sinh câu i+1
      miningOutput = await MiningCopilotAgent.run({
        targetWord: word,
        learnerLevel,
        providedKnownWords: effectiveKnownWords,
      });

      // 3.2. Sub-Agent 2: Kanji & Pitch Expert phân tích chiết tự và cao độ
      kanjiPitchOutput = await KanjiPitchExpertAgent.run({
        word,
        reading: phase1Data.reading,
      });
    }

    const phase3Data = {
      miningResult: {
        sentence: miningOutput.sentence,
        clozeTarget: miningOutput.clozeTarget,
        translation: miningOutput.translation,
      },
      kanjiPitchResult: {
        semanticRadical: kanjiPitchOutput.semanticRadical,
        phoneticGrapheme: kanjiPitchOutput.phoneticGrapheme,
        pitchPatternCode: kanjiPitchOutput.pitchPatternCode,
        pitchPatternName: kanjiPitchOutput.pitchPatternName,
        pitchGraphSvg: kanjiPitchOutput.pitchGraphSvg,
      },
    };

    // ==========================================
    // PHA 4: RÀ SOÁT RÀNG BUỘC (Constraint & Guardrail Audit)
    // ==========================================
    // "Nếu phát hiện thẻ chứa cả nghĩa phái sinh phức tạp hoặc vượt quá 1 khái niệm mục tiêu,
    // Guardrail sẽ lập tức yêu cầu Agent phân rã thành các thẻ riêng biệt để tuân thủ Nguyên tắc Thông tin Tối thiểu."
    const derivativeMeanings = AtomicityValidator.splitDerivativeMeanings(resolvedMeaning);
    const autoSplitTriggered = derivativeMeanings.length > 1;

    const targetMeanings = autoSplitTriggered ? derivativeMeanings : [resolvedMeaning.slice(0, 100)];
    const generatedDrafts: CardDraft[] = [];

    for (const singleMeaning of targetMeanings) {
      const draftPayload = {
        kanji_surface: word,
        reading_furigana: phase1Data.reading,
        primary_meaning: singleMeaning,
        context_sentence: miningOutput.sentence,
        cloze_word: word,
        etymology_notes: kanjiPitchOutput.etymologySummary || undefined,
        pitch_pattern: kanjiPitchOutput.pitchPatternCode,
      };

      const guardrailOutput = CognitiveGuardrailAgent.run({
        cardDraft: draftPayload,
        learnerLevel,
      });

      if (guardrailOutput.passed && guardrailOutput.validatedCard) {
        // PHA 5: XÁC NHẬN CỦA NGƯỜI HỌC (Human-in-the-Loop)
        // Tạo bản nháp (Draft) cho từng khái niệm phân tách
        const draft = CognitiveOwnershipGuard.createDraft(deckId, guardrailOutput.validatedCard);
        generatedDrafts.push(draft);
      }
    }

    const phase4Data = {
      passed: generatedDrafts.length > 0,
      reasons: autoSplitTriggered
        ? [`Đã kích hoạt Guardrail phân rã từ nhiều nghĩa thành ${generatedDrafts.length} thẻ riêng biệt theo Nguyên tắc Thông tin Tối thiểu.`]
        : [],
      schemaValidated: generatedDrafts.length > 0,
      autoSplitTriggered,
    };

    if (generatedDrafts.length === 0) {
      return {
        success: false,
        atomicityPassed: false,
        feedback: 'Bị từ chối bởi Cognitive Guardrail: Thẻ vi phạm nguyên tắc nhận thức và không thể tạo bản nháp.',
        masteredWordsCount: totalMastered,
      };
    }

    const phase5Data = {
      draftIds: generatedDrafts.map((d) => d.id),
      status: 'draft' as const,
      message: autoSplitTriggered
        ? `Đã phân rã thành ${generatedDrafts.length} bản nháp riêng biệt. Bản nháp đã sẵn sàng để bạn duyệt qua và chỉnh sửa.`
        : 'Bản nháp đã sẵn sàng để người học đọc qua, chỉnh sửa và phê duyệt.',
    };

    const auditTrail: FivePhaseExecutionAudit = {
      phase1_requestIngestion: phase1Data,
      phase2_contextRetrieval: phase2Data,
      phase3_skillExecution: phase3Data,
      phase4_guardrailReview: phase4Data,
      phase5_learnerConfirmation: phase5Data,
    };

    return {
      success: true,
      draft: generatedDrafts[0],
      drafts: generatedDrafts,
      card: generatedDrafts[0].cardData,
      atomicityPassed: true,
      feedback: phase5Data.message,
      masteredWordsCount: totalMastered,
      auditTrail,
    };
  }

  /**
   * Bước 5: Xác nhận của người học & Lưu vào hệ thống (Human-in-the-Loop)
   * 
   * Bản nháp hiển thị lên màn hình để người học đọc qua, chỉnh sửa câu chữ theo ý muốn
   * nhằm bảo toàn quyền sở hữu nhận thức (Cognitive Ownership).
   * Khi người học ấn nút Lưu (Approve), hàm card-creator.skill.ts khởi tạo thẻ mới
   * với các chỉ số ban đầu của FSRS (D = 0, S = 0, State = 0) và lưu trực tiếp vào cơ sở dữ liệu SQLite.
   */
  async approveAndSaveDraft(draftId: string, editedData?: Partial<GeneratedCard>) {
    const draft = CognitiveOwnershipGuard.approveDraft(draftId);
    const finalCardData = {
      ...draft.cardData,
      ...(editedData || {}),
    };

    return validateAndSaveCard({
      card_draft: {
        deck_id: draft.deckId,
        type: 'Vocab',
        front: finalCardData.kanji_surface,
        reading: finalCardData.reading_furigana,
        meaning: finalCardData.primary_meaning,
        sentence: finalCardData.context_sentence,
        pitch: `[${finalCardData.pitch_pattern}]`,
        tags: ['ApprovedByLearner', 'FSRS_D0_S0_State0'],
      },
    });
  }
}
