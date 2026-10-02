/**
 * JSON Schema mô tả chi tiết các Skills / Tools để cung cấp cho LLM (Function Calling / Tool Calling)
 * Tuân thủ chính xác bảng đặc tả kỹ thuật 2.2:
 * - generate_i_plus_one_sentence
 * - decompose_kanji_etymology
 * - lookup_pitch_accent
 * - validate_and_save_card
 */

export const AgentToolSchemas = [
  {
    name: 'generate_i_plus_one_sentence',
    description: 'Sinh 1 câu tự nhiên chỉ chứa duy nhất target_word là từ mới, phần còn lại dùng known_vocab theo chuẩn Krashen i+1.',
    parameters: {
      type: 'object',
      properties: {
        target_word: {
          type: 'string',
          description: 'Từ vựng mới cần học trong câu ví dụ.',
        },
        known_vocab: {
          type: 'array',
          items: { type: 'string' },
          description: 'Danh sách các từ mà người học đã nắm vững (lấy từ Dynamic Knowledge S > 21 ngày).',
        },
      },
      required: ['target_word'],
    },
    outputSchema: {
      type: 'object',
      properties: {
        sentence: { type: 'string', description: 'Câu ví dụ hoàn chỉnh' },
        cloze_target: { type: 'string', description: 'Từ mục tiêu được đục lỗ {{c1::từ}}' },
        translation: { type: 'string', description: 'Bản dịch tiếng Việt tương ứng ngữ cảnh' },
      },
      required: ['sentence', 'cloze_target', 'translation'],
    },
  },
  {
    name: 'decompose_kanji_etymology',
    description: 'Tra cứu thành tố biểu ý và biểu âm trong knowledge/kanji/ để giải thích cấu tạo chữ Hán theo phương pháp Hình thanh.',
    parameters: {
      type: 'object',
      properties: {
        kanji: {
          type: 'string',
          description: 'Ký tự chữ Hán cần phân tích (1 ký tự duy nhất).',
        },
      },
      required: ['kanji'],
    },
    outputSchema: {
      type: 'object',
      properties: {
        semantic_radical: { type: 'string', description: 'Bộ thủ biểu ý (Ý nghĩa gốc)' },
        phonetic_grapheme: { type: 'string', description: 'Thành tố biểu âm (Âm đọc Onyomi kế thừa)' },
        reading_rule: { type: 'string', description: 'Quy tắc đọc và giải thích ngữ nguyên' },
      },
      required: ['semantic_radical', 'phonetic_grapheme', 'reading_rule'],
    },
  },
  {
    name: 'lookup_pitch_accent',
    description: 'Xác định vị trí hạ cao độ chuẩn Tokyo (0: Heiban, 1: Atamadaka,...) và trả về biểu đồ cao độ SVG.',
    parameters: {
      type: 'object',
      properties: {
        word: {
          type: 'string',
          description: 'Từ vựng cần tra cứu (Kanji hoặc Kana).',
        },
        reading: {
          type: 'string',
          description: 'Cách đọc Hiragana chuẩn của từ.',
        },
      },
      required: ['word', 'reading'],
    },
    outputSchema: {
      type: 'object',
      properties: {
        pattern_code: { type: 'string', description: 'Mã mẫu cao độ: [0] Heiban, [1] Atamadaka, [2..] Nakadaka, [n] Odaka' },
        pitch_graph_svg: { type: 'string', description: 'Đoạn mã SVG trực quan hóa đường cao độ của từng mora' },
      },
      required: ['pattern_code', 'pitch_graph_svg'],
    },
  },
  {
    name: 'validate_and_save_card',
    description: 'Kiểm tra ràng buộc sư phạm (Atomicity, i+1) và lưu trực tiếp vào bảng cards trong SQLite.',
    parameters: {
      type: 'object',
      properties: {
        card_draft: {
          type: 'object',
          properties: {
            deck_id: { type: 'string', description: 'ID bộ thẻ' },
            type: { type: 'string', enum: ['Kanji', 'Vocab', 'Cloze', 'Pitch'], description: 'Loại thẻ' },
            front: { type: 'string', description: 'Mặt trước thẻ' },
            reading: { type: 'string', description: 'Furigana / Hiragana' },
            meaning: { type: 'string', description: 'Nghĩa tiếng Việt súc tích' },
            sentence: { type: 'string', description: 'Câu ví dụ i+1 / Cloze' },
            pitch: { type: 'string', description: 'Mẫu cao độ pitch accent' },
            tags: { type: 'array', items: { type: 'string' } },
          },
          required: ['deck_id', 'type', 'front', 'meaning'],
        },
      },
      required: ['card_draft'],
    },
    outputSchema: {
      type: 'object',
      properties: {
        card_id: { type: 'string', description: 'Mã định danh thẻ vừa được tạo' },
        status: { type: 'string', enum: ['created', 'rejected'], description: 'Trạng thái xử lý' },
      },
      required: ['card_id', 'status'],
    },
  },
];
