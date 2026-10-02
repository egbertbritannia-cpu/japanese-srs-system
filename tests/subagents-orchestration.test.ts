import { describe, it, expect } from 'vitest';
import { MiningCopilotAgent } from '../src/agents/subagents/mining-copilot.agent';
import { KanjiPitchExpertAgent } from '../src/agents/subagents/kanji-pitch-expert.agent';
import { CognitiveGuardrailAgent } from '../src/agents/subagents/cognitive-guardrail.agent';
import { CopilotOrchestrator } from '../src/agents/copilot.service';

describe('Phần 2: Kế Hoạch Vận Hành 5 Pha Tác Vụ & Phân Vai Sub-Agents', () => {
  it('Sub-Agent 1: MiningCopilot sinh câu đục lỗ i+1 đúng kiểm chuẩn', async () => {
    const result = await MiningCopilotAgent.run({
      targetWord: '際',
      providedKnownWords: ['日本', '行く', '時'],
    });

    expect(result.sentence).toContain('{{c1::際}}');
    expect(result.clozeTarget).toBe('{{c1::際}}');
    expect(result.isIPlusOneVerified).toBe(true);
  });

  it('Sub-Agent 2: KanjiPitchExpert trích xuất thành tố biểu âm 祭 (sai) và mã cao độ', async () => {
    const result = await KanjiPitchExpertAgent.run({
      word: '際',
      reading: 'さい',
    });

    expect(result.hasKanji).toBe(true);
    expect(result.semanticRadical).toContain('阝');
    expect(result.phoneticGrapheme).toContain('祭');
    expect(result.pitchPatternCode).toBeGreaterThanOrEqual(0);
    expect(result.pitchPatternCode).toBeLessThanOrEqual(3);
    expect(result.pitchGraphSvg).toContain('<svg');
  });

  it('Sub-Agent 3: CognitiveGuardrail từ chối câu giải thích quá 3 dòng hoặc vi phạm schema', () => {
    const longBackExplanation = 'Dòng 1\nDòng 2\nDòng 3\nDòng 4 gây quá tải nhận thức';
    const result = CognitiveGuardrailAgent.run({
      cardDraft: {
        kanji_surface: '猫',
        reading_furigana: 'ねこ',
        primary_meaning: 'Con mèo',
        context_sentence: 'ここに{{c1::猫}}がいます。',
        cloze_word: '猫',
        pitch_pattern: 1,
      },
      backExplanation: longBackExplanation,
    });

    expect(result.passed).toBe(false);
    expect(result.reasons.some((r) => r.includes('> 3 dòng'))).toBe(true);
  });

  it('CopilotOrchestrator: hoàn thành đầy đủ quy trình 5 pha tác vụ khép kín', async () => {
    const orchestrator = new CopilotOrchestrator();
    const response = await orchestrator.mineAndDraftCard({
      deckId: 'deck_n4',
      word: '際',
      reading: 'さい',
      meaning: 'Dịp, thời điểm',
      knownWords: ['日本', '来る', '友達', '会う'],
      learnerLevel: 'N4',
    });

    expect(response.success).toBe(true);
    expect(response.draft).toBeDefined();
    expect(response.draft?.status).toBe('draft');
    expect(response.card?.kanji_surface).toBe('際');
    expect(response.auditTrail).toBeDefined();

    // Kiểm tra 5 pha tác vụ
    const audit = response.auditTrail!;
    expect(audit.phase1_requestIngestion.targetWord).toBe('際');
    expect(audit.phase2_contextRetrieval.kanjiGroundingPath).toBeDefined();
    expect(audit.phase3_skillExecution.miningResult.sentence).toContain('{{c1::際}}');
    expect(audit.phase4_guardrailReview.passed).toBe(true);
    expect(audit.phase5_learnerConfirmation.status).toBe('draft');
  });

  it('Chu trình mẫu với từ 警察: phát hiện 敬 (kei) trong 警, 祭 (satsu) trong 察, và Pitch Heiban (0)', async () => {
    const orchestrator = new CopilotOrchestrator();
    const response = await orchestrator.mineAndDraftCard({
      deckId: 'deck_n4',
      word: '警察',
      reading: 'けいさつ',
      meaning: 'Cảnh sát, lực lượng an ninh',
      learnerLevel: 'N4',
    });

    expect(response.success).toBe(true);
    expect(response.card?.pitch_pattern).toBe(0); // Heiban [0]
    expect(response.card?.etymology_notes).toContain('敬');
    expect(response.card?.etymology_notes).toContain('祭');
    expect(response.card?.context_sentence).toContain('{{c1::警察}}');
  });

  it('Bước 4: Tự động phân rã từ nhiều nghĩa phái sinh thành các bản nháp riêng biệt', async () => {
    const orchestrator = new CopilotOrchestrator();
    const response = await orchestrator.mineAndDraftCard({
      deckId: 'deck_n4',
      word: 'かける',
      reading: 'かける',
      meaning: 'Treo lên; Đeo kính; Gọi điện thoại',
      learnerLevel: 'N4',
    });

    expect(response.success).toBe(true);
    expect(response.drafts).toBeDefined();
    expect(response.drafts!.length).toBe(3);
    expect(response.auditTrail?.phase4_guardrailReview.autoSplitTriggered).toBe(true);
  });

  it('Bước 5: Người học ấn nút Lưu (Approve), khởi tạo thẻ với FSRS D=0, S=0, State=0', async () => {
    const orchestrator = new CopilotOrchestrator();
    const response = await orchestrator.mineAndDraftCard({
      deckId: 'deck_n5',
      word: '桜',
      reading: 'さくら',
      meaning: 'Hoa anh đào',
      learnerLevel: 'N5',
    });

    const draftId = response.draft!.id;
    const saveResult = await orchestrator.approveAndSaveDraft(draftId);

    expect(saveResult.card_id).toBeDefined();
    expect(saveResult.status).toBe('created');
  });

  it('Ngày 2: Luồng 1 ô nhập từ vựng duy nhất "Nhờ AI tạo thẻ" -> Tự sinh i+1, chữ Hán, Pitch -> Lưu FSRS', async () => {
    const orchestrator = new CopilotOrchestrator();
    // Chỉ truyền vào 1 từ vựng duy nhất (không cần reading hay meaning)
    const response = await orchestrator.mineAndDraftCard({
      word: '警察',
    });

    expect(response.success).toBe(true);
    expect(response.draft).toBeDefined();
    expect(response.card?.kanji_surface).toBe('警察');
    expect(response.card?.reading_furigana).toBe('けいさつ');
    expect(response.card?.primary_meaning).toContain('Cảnh sát');
    expect(response.card?.context_sentence).toContain('{{c1::警察}}');
    expect(response.card?.pitch_pattern).toBe(0); // Heiban
    expect(response.card?.etymology_notes).toContain('敬');
    expect(response.card?.etymology_notes).toContain('祭');

    // Người học duyệt và lưu vào FSRS
    const saveResult = await orchestrator.approveAndSaveDraft(response.draft!.id);
    expect(saveResult.card_id).toBeDefined();
    expect(saveResult.status).toBe('created');
  });
});
