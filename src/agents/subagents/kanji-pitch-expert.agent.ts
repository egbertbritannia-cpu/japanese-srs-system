import { decomposeKanjiEtymology } from '../skills/kanji-decomposer.skill';
import { lookupPitchAccent } from '../skills/pitch-lookup.skill';

export interface KanjiPitchExpertInput {
  word: string;
  reading: string;
}

export interface KanjiPitchExpertOutput {
  hasKanji: boolean;
  semanticRadical?: string;
  phoneticGrapheme?: string;
  readingRule?: string;
  pitchPatternCode: number; // 0, 1, 2, 3
  pitchPatternName: string; // Heiban, Atamadaka, Nakadaka, Odaka
  pitchGraphSvg: string;
  etymologySummary: string;
}

/**
 * Sub-Agent 2: Kanji & Pitch Expert
 * - Trách nhiệm: Phân tích bộ thủ, trích xuất thành tố biểu âm (chữ Hình thanh) và gán mẫu cao độ.
 * - Tài liệu tham chiếu (Knowledge): `knowledge/kanji/phonetic-components.json`, `knowledge/phonetics/pitch-accent-rules.md`.
 * - Đầu ra kiểm chuẩn: Tên bộ thủ, âm On'yomi đồng dạng, mã cao độ (0, 1, 2, 3).
 */
export class KanjiPitchExpertAgent {
  static async run(input: KanjiPitchExpertInput): Promise<KanjiPitchExpertOutput> {
    const { word, reading } = input;
    const hasKanji = /[\u4e00-\u9faf]/.test(word);

    // 1. Phân tích ngữ nguyên học (Etymology) nếu từ chứa Kanji
    let semanticRadical: string | undefined;
    let phoneticGrapheme: string | undefined;
    let readingRule: string | undefined;
    let etymologySummary = '';

    if (hasKanji) {
      const etymology = await decomposeKanjiEtymology({ kanji: word });
      semanticRadical = etymology.semantic_radical;
      phoneticGrapheme = etymology.phonetic_grapheme;
      readingRule = etymology.reading_rule;
      etymologySummary = `Bộ thủ: ${semanticRadical} | Thành tố âm: ${phoneticGrapheme}. ${readingRule}`;
    }

    // 2. Tra cứu Pitch Accent và mã cao độ (0: Heiban, 1: Atamadaka, 2: Nakadaka, 3: Odaka)
    const pitch = await lookupPitchAccent({ word, reading });
    const dropNum = parseInt(pitch.pattern_code.match(/\[(\d+)\]/)?.[1] || '0', 10);
    const patternName = pitch.pattern_code.replace(/\[\d+\]\s*/, '') || 'Heiban';
    const pitchPatternCode = Math.min(3, Math.max(0, dropNum));

    return {
      hasKanji,
      semanticRadical,
      phoneticGrapheme,
      readingRule,
      pitchPatternCode,
      pitchPatternName: patternName,
      pitchGraphSvg: pitch.pitch_graph_svg,
      etymologySummary,
    };
  }
}
