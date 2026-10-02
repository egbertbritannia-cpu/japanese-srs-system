import { GeneratedCard } from './schema-guard';

export interface CardDraft {
  id: string;
  deckId: string;
  cardData: GeneratedCard;
  status: 'draft' | 'approved' | 'rejected';
  createdAt: Date;
  reviewedByLearner: boolean;
}

/**
 * Ràng buộc Quyền sở hữu Nhận thức (Cognitive Ownership Guard)
 * Nguyên tắc cốt lõi:
 * Agent KHÔNG BAO GIỜ tự ý chèn thẻ vào lịch học chính thức ngay lập tức.
 * Agent chỉ tạo bản nháp (Draft). Giao diện bắt buộc người học phải đọc,
 * duyệt hoặc chỉnh sửa trước khi chính thức lưu vào SQLite để bảo đảm sự chủ động trong nhận thức.
 */
export class CognitiveOwnershipGuard {
  private static draftQueue: Map<string, CardDraft> = new Map();

  /**
   * Tạo bản nháp (Draft), ngăn chặn việc tự ý kích hoạt lịch học
   */
  static createDraft(deckId: string, cardData: GeneratedCard): CardDraft {
    const draftId = `draft_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const draft: CardDraft = {
      id: draftId,
      deckId,
      cardData,
      status: 'draft',
      createdAt: new Date(),
      reviewedByLearner: false,
    };

    this.draftQueue.set(draftId, draft);
    return draft;
  }

  /**
   * Người học đọc và phê duyệt bản nháp
   */
  static approveDraft(draftId: string, modifiedCardData?: Partial<GeneratedCard>): CardDraft {
    const draft = this.draftQueue.get(draftId);
    if (!draft) {
      throw new Error(`Bản nháp [${draftId}] không tồn tại.`);
    }

    draft.status = 'approved';
    draft.reviewedByLearner = true;
    if (modifiedCardData) {
      draft.cardData = { ...draft.cardData, ...modifiedCardData };
    }

    return draft;
  }

  /**
   * Người học từ chối bản nháp
   */
  static rejectDraft(draftId: string): void {
    const draft = this.draftQueue.get(draftId);
    if (draft) {
      draft.status = 'rejected';
      draft.reviewedByLearner = true;
    }
  }

  /**
   * Lấy danh sách thẻ đang ở trạng thái nháp chờ người học duyệt
   */
  static getPendingDrafts(): CardDraft[] {
    return Array.from(this.draftQueue.values()).filter((d) => d.status === 'draft');
  }
}
