/**
 * Tiện ích dùng chung (Shared Utilities)
 */

/**
 * Định dạng ngày giờ thân thiện cho người học
 */
export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Tính khoảng cách số ngày giữa hai mốc thời gian
 */
export function diffDays(dateA: Date, dateB: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round(Math.abs((dateA.getTime() - dateB.getTime()) / msPerDay));
}

/**
 * Kiểm tra xem chuỗi có chứa ký tự Kanji hay không
 */
export function hasKanji(text: string): boolean {
  // Phạm vi Unicode chuẩn của CJK Unified Ideographs: 4E00 - 9FAF
  return /[\u4e00-\u9faf]/.test(text);
}
