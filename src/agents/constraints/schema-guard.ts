import { z } from 'zod';

// Ràng buộc cấu trúc thẻ sinh ra bởi Agent
export const GeneratedCardSchema = z.object({
  kanji_surface: z.string().describe("Từ vựng hoặc chữ Hán mục tiêu"),
  reading_furigana: z.string().regex(/^[\u3040-\u309F]+$/, "Phải là Hiragana chuẩn"),
  primary_meaning: z.string().max(100, "Nghĩa chính ngắn gọn, tránh dài dòng"),
  context_sentence: z.string().describe("Câu ngữ cảnh chuẩn i+1"),
  cloze_word: z.string().describe("Từ bị ẩn đi trong câu ngữ cảnh"),
  etymology_notes: z.string().optional().describe("Phân tích bộ thủ biểu âm/biểu ý"),
  pitch_pattern: z.number().int().min(0).max(4).describe("0: Heiban, 1: Atamadaka, 2: Nakadaka, 3: Odaka")
});

export type GeneratedCard = z.infer<typeof GeneratedCardSchema>;

// Trạng thái phê duyệt bản nháp (Cognitive Ownership)
export const CardDraftStatusSchema = z.enum(['draft', 'approved', 'rejected']);
export type CardDraftStatus = z.infer<typeof CardDraftStatusSchema>;

export const CardDraftDTOSchema = GeneratedCardSchema.extend({
  deck_id: z.string(),
  status: CardDraftStatusSchema.default('draft'),
  tags: z.array(z.string()).default([]),
});

export type CardDraftDTO = z.infer<typeof CardDraftDTOSchema>;
