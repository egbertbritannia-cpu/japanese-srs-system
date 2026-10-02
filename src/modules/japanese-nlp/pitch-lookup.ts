/**
 * Tra cứu mẫu cao độ (Pitch Accent Lookup)
 * Các mẫu cơ bản:
 * - 0: Heiban (Bình)
 * - 1: Atamadaka (Đầu cao)
 * - 2..n: Nakadaka (Giữa cao)
 * - n: Odaka (Đuôi cao)
 */

export type PitchPattern = 'Heiban' | 'Atamadaka' | 'Nakadaka' | 'Odaka' | 'Kifuku';

export interface PitchInfo {
  word: string;
  reading: string;
  pattern: PitchPattern;
  dropPosition: number; // Vị trí hạ giọng (0 nếu không có hạ giọng)
}

export class PitchAccentLookup {
  private static cache: Map<string, PitchInfo> = new Map();

  // Từ điển mẫu cao độ chuẩn Tokyo cho các từ vựng thông dụng
  private static dictionary: Record<string, { pattern: PitchPattern; drop: number }> = {
    '警察': { pattern: 'Heiban', drop: 0 },
    'けいさつ': { pattern: 'Heiban', drop: 0 },
    '桜': { pattern: 'Heiban', drop: 0 },
    'さくら': { pattern: 'Heiban', drop: 0 },
    '勉強': { pattern: 'Heiban', drop: 0 },
    'べんきょう': { pattern: 'Heiban', drop: 0 },
    '雨': { pattern: 'Atamadaka', drop: 1 },
    'あめ': { pattern: 'Atamadaka', drop: 1 },
    '本': { pattern: 'Atamadaka', drop: 1 },
    'ほん': { pattern: 'Atamadaka', drop: 1 },
    '猫': { pattern: 'Atamadaka', drop: 1 },
    'ねこ': { pattern: 'Atamadaka', drop: 1 },
    '飛行機': { pattern: 'Nakadaka', drop: 2 },
    'ひこうき': { pattern: 'Nakadaka', drop: 2 },
    '花': { pattern: 'Odaka', drop: 2 },
    'はな': { pattern: 'Odaka', drop: 2 },
  };

  /**
   * Tra cứu thông tin mẫu Pitch Accent cho một từ
   */
  static lookup(word: string, reading: string): PitchInfo | null {
    const key = `${word}_${reading}`;
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    const matched = this.dictionary[word] || this.dictionary[reading];
    const pitchInfo: PitchInfo = {
      word,
      reading,
      pattern: matched ? matched.pattern : 'Heiban',
      dropPosition: matched ? matched.drop : 0,
    };

    this.cache.set(key, pitchInfo);
    return pitchInfo;
  }
}

export function getPitchAccent(
  word: string,
  reading?: string
): { pattern: string; pitchClass: string } | null {
  const info = PitchAccentLookup.lookup(word, reading || word);
  if (!info) return null;
  return {
    pattern: info.pattern,
    pitchClass: info.pattern.toLowerCase(),
  };
}
