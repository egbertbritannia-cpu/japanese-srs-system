import { NextResponse } from 'next/server';
import { CopilotOrchestrator } from '@/agents/copilot.service';

const orchestrator = new CopilotOrchestrator();

/**
 * API Copilot Draft Generation (Lộ trình Bước 2 & 3)
 * Nhập 1 từ tiếng Nhật -> Nhận về bản nháp thẻ chuẩn đục lỗ ngữ cảnh i + 1 và âm đọc Furigana.
 * Đảm bảo tuân thủ Quyền sở hữu Nhận thức (chỉ tạo Draft, chờ người học duyệt).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { word, reading, meaning, deckId = 'default_deck', learnerLevel = 'N4' } = body;

    if (!word || typeof word !== 'string' || word.trim().length === 0) {
      return NextResponse.json(
        { error: 'Vui lòng nhập từ vựng tiếng Nhật mục tiêu (word là bắt buộc)' },
        { status: 400 }
      );
    }

    const response = await orchestrator.mineAndDraftCard({
      word,
      reading: reading || word,
      meaning,
      deckId,
      learnerLevel,
    });

    return NextResponse.json({
      success: response.success,
      draft: response.draft,
      drafts: response.drafts,
      card: response.card,
      feedback: response.feedback,
      atomicityPassed: response.atomicityPassed,
      masteredWordsCount: response.masteredWordsCount,
      auditTrail: response.auditTrail,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * Bước 5: Người học ấn nút Lưu (Approve), hàm card-creator.skill.ts khởi tạo thẻ mới
 * với các chỉ số ban đầu của FSRS (D = 0, S = 0, State = 0) và lưu trực tiếp vào cơ sở dữ liệu SQLite.
 */
export async function PUT(request: Request) {
  try {
    const { draftId, editedData } = await request.json();
    if (!draftId) {
      return NextResponse.json({ error: 'draftId là bắt buộc' }, { status: 400 });
    }

    const result = await orchestrator.approveAndSaveDraft(draftId, editedData);
    return NextResponse.json({
      success: true,
      message: 'Thẻ đã được người học phê duyệt và lưu vào SQLite với FSRS (D=0, S=0, State=0)!',
      cardId: result.card_id,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
