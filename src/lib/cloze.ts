/**
 * cloze.ts — Anki Cloze Deletion Parser
 *
 * Xử lý cú pháp cloze Anki: {{c1::từ}} hoặc {{c1::từ::gợi ý}}
 * Dùng chung cho tất cả component cần hiển thị câu ví dụ.
 *
 * Spec:
 *   - {{c1::私}}             → highlight "私"  (phần được kiểm tra)
 *   - {{c1::先生::せんせい}}  → highlight "先生" (bỏ phần gợi ý)
 *   - Nhiều cloze trong 1 câu đều được xử lý đúng
 */

// Regex khớp {{cN::content}} hoặc {{cN::content::hint}}
const CLOZE_REGEX = /\{\{c\d+::([^:}]+)(?:::[^}]*)?\}\}/g;

/**
 * Trả về bản plain-text của câu (strip toàn bộ markup cloze).
 * Dùng cho: TTS (JapaneseSpeakerButton), audio, aria-label.
 *
 * Ví dụ: "{{c1::私}}は学生です" → "私は学生です"
 */
export function stripCloze(text: string): string {
  return text.replace(CLOZE_REGEX, '$1');
}

/**
 * Phân tách câu thành mảng segments để render React với highlight.
 * Mỗi segment có:
 *   - `text`      — nội dung đoạn văn bản
 *   - `isCloze`   — true nếu là từ cần highlight
 *
 * Ví dụ: "{{c1::私}}は学生です"
 * → [{ text: "私", isCloze: true }, { text: "は学生です", isCloze: false }]
 */
export interface ClozeSegment {
  text: string;
  isCloze: boolean;
}

export function parseClozeSegments(text: string): ClozeSegment[] {
  const segments: ClozeSegment[] = [];
  let lastIndex = 0;

  // Reset regex state (global flag stateful)
  CLOZE_REGEX.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = CLOZE_REGEX.exec(text)) !== null) {
    // Text thường trước cloze
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index), isCloze: false });
    }
    // Bản thân từ cloze (group 1)
    segments.push({ text: match[1], isCloze: true });
    lastIndex = match.index + match[0].length;
  }

  // Text thường sau cloze cuối (hoặc toàn bộ text nếu không có cloze)
  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), isCloze: false });
  }

  return segments;
}

/**
 * Kiểm tra một chuỗi có chứa cloze syntax hay không.
 * Dùng để quyết định render path đơn giản vs highlight.
 */
export function hasCloze(text: string): boolean {
  CLOZE_REGEX.lastIndex = 0;
  return CLOZE_REGEX.test(text);
}
