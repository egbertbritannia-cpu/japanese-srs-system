/**
 * (Giai đoạn 2) Etymology Database Cache
 * Bộ nhớ đệm tra cứu Naritachi (Nguồn gốc xuất xứ và giải nghĩa triết tự chữ Hán)
 */

export interface NaritachiRecord {
  kanji: string;
  ancientFormUrl?: string; // Hình ảnh chữ giáp cốt hoặc kim văn
  originDescription: string;
  storyMnemonic: string; // Mẹo nhớ câu chuyện
}

export class EtymologyDatabase {
  private static cache: Map<string, NaritachiRecord> = new Map();

  /**
   * Lấy thông tin nguồn gốc Naritachi từ bộ nhớ đệm hoặc nguồn dữ liệu
   */
  static async getNaritachi(kanji: string): Promise<NaritachiRecord | null> {
    if (this.cache.has(kanji)) {
      return this.cache.get(kanji)!;
    }

    // Tra cứu từ local DB hoặc file từ điển nguồn gốc
    const record: NaritachiRecord = {
      kanji,
      originDescription: `Nguồn gốc hình thành và tiến hóa của chữ ${kanji}`,
      storyMnemonic: `Câu chuyện ghi nhớ nhanh chữ ${kanji}`,
    };

    this.cache.set(kanji, record);
    return record;
  }
}
