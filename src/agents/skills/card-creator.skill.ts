import { CardRepository } from '@/db/repositories/card-repository';
import { CardValidator } from '@/core/cards/card.validator';
import { Flashcard } from '@/core/cards/card.types';

export interface CardDraftDTO {
  deck_id: string;
  type: 'Kanji' | 'Vocab' | 'Cloze' | 'Pitch';
  front: string;
  reading?: string;
  meaning: string;
  sentence?: string;
  pitch?: string;
  tags?: string[];
}

export interface ValidateAndSaveCardInput {
  card_draft: CardDraftDTO;
}

export interface ValidateAndSaveCardOutput {
  card_id: string;
  status: 'created';
}

/**
 * Bước 5: Xác nhận của người học & Lưu vào hệ thống (Human-in-the-Loop)
 * 
 * - Bản nháp hiển thị lên màn hình để người học đọc qua, chỉnh sửa câu chữ theo ý muốn nhằm bảo toàn quyền sở hữu nhận thức (Cognitive Ownership).
 * - Khi người học ấn nút Lưu (Approve), hàm card-creator.skill.ts khởi tạo thẻ mới với các chỉ số ban đầu
 *   của FSRS (D = 0, S = 0, State = 0) và lưu trực tiếp vào cơ sở dữ liệu SQLite.
 */
export async function validateAndSaveCard(
  input: ValidateAndSaveCardInput
): Promise<ValidateAndSaveCardOutput> {
  const { card_draft } = input;

  // 1. Kiểm tra ràng buộc thông tin tối thiểu (Atomicity)
  const validation = CardValidator.validate({
    type: card_draft.type,
    word: card_draft.front,
    meaning: card_draft.meaning,
    sentence: card_draft.sentence,
    kanji: card_draft.front,
    pitchNumber: card_draft.pitch ? parseInt(card_draft.pitch, 10) : 0,
  } as unknown as Partial<Flashcard>);

  if (!validation.isValid) {
    throw new Error(
      `Thẻ bị từ chối do vi phạm quy tắc: ${validation.errors.join('; ')}`
    );
  }

  // 2. Tạo ID và lưu trực tiếp vào bảng `cards` trong SQLite
  const card_id = `card_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date();

  await CardRepository.createCard({
    id: card_id,
    deckId: card_draft.deck_id,
    type: card_draft.type,
    front: card_draft.front,
    reading: card_draft.reading,
    meaning: card_draft.meaning,
    sentence: card_draft.sentence,
    pitch: card_draft.pitch,
    tags: card_draft.tags ? JSON.stringify(card_draft.tags) : '[]',
    stability: 0,
    difficulty: 0,
    elapsedDays: 0,
    scheduledDays: 0,
    reps: 0,
    lapses: 0,
    state: 'New',
    due: now,
    createdAt: now,
    updatedAt: now,
  });

  return {
    card_id,
    status: 'created',
  };
}

// Giữ lại alias tương thích ngược nếu cần
export const executeCardCreatorSkill = async (params: {
  deckId: string;
  type: 'Kanji' | 'Vocab' | 'Cloze' | 'Pitch';
  front: string;
  reading?: string;
  meaning: string;
  sentence?: string;
  pitch?: string;
  tags?: string[];
}) => {
  const res = await validateAndSaveCard({
    card_draft: {
      deck_id: params.deckId,
      type: params.type,
      front: params.front,
      reading: params.reading,
      meaning: params.meaning,
      sentence: params.sentence,
      pitch: params.pitch,
      tags: params.tags,
    },
  });

  return {
    success: true,
    cardId: res.card_id,
    message: 'Thẻ học đã được tạo thành công trong cơ sở dữ liệu!',
  };
};
