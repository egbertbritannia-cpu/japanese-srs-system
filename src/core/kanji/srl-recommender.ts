/**
 * Self-Regulated Learning (SRL) Kanji Pathway Recommender
 * Trụ Cột 2: Lộ trình Tự điều chỉnh Học tập theo Vùng phát triển Gần (ZPD)
 * Căn cứ: planning/04_PHASE_4_COGNITIVE_SCIENCE_AND_FOUR_PILLARS.md
 */

import { KEISEI_PHONETIC_FAMILIES, analyzeKanjiEtymology } from './kanjicompass-graph';

export interface SrlRecommendation {
  character: string;
  phoneticGrapheme: string;
  dominantOnyomi: string[];
  meaning: string;
  radical: string;
  jlptLevel: string;
  strokeCount: number;
  leverageScore: number; // Điểm đòn bẩy nhận thức (Càng cao càng nên học ngay)
  pedagogicalRationale: string;
}

export interface SrlPathResult {
  knownCount: number;
  unlockedHubsCount: number;
  recommendations: SrlRecommendation[];
}

/**
 * Gợi ý các chữ Hán nên nạp tiếp theo dựa trên vốn chữ Hán đã biết của người học
 */
export function recommendKanjiPathway(
  knownKanjiList: string[],
  targetJlptFilter?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
): SrlPathResult {
  const knownSet = new Set(knownKanjiList);
  const recommendations: SrlRecommendation[] = [];
  let unlockedHubsCount = 0;

  for (const [hub, family] of Object.entries(KEISEI_PHONETIC_FAMILIES)) {
    const knownInFamily = family.members.filter((m) => knownSet.has(m.character));
    const unlearnedInFamily = family.members.filter((m) => !knownSet.has(m.character));

    if (knownInFamily.length > 0) {
      unlockedHubsCount++;
    }

    // Nếu người học đã biết ít nhất 1 chữ trong họ hoặc biết chính Gốc biểu âm (Hub)
    // -> Đây là Vùng phát triển gần (ZPD) có đòn bẩy nhận thức cao nhất!
    for (const cand of unlearnedInFamily) {
      if (targetJlptFilter && cand.jlptLevel !== targetJlptFilter) {
        continue;
      }

      let leverageScore = 0.5; // Điểm cơ sở

      // Đòn bẩy 1: Đã biết gốc biểu âm chính xác
      if (knownSet.has(hub)) {
        leverageScore += 0.35;
      }

      // Đòn bẩy 2: Tỷ lệ các chữ cùng họ đã nắm vững
      const familyCoverageRatio = knownInFamily.length / family.members.length;
      leverageScore += familyCoverageRatio * 0.25;

      // Ưu tiên cấp độ JLPT dễ hơn trước
      const jlptBonus: Record<string, number> = { N5: 0.2, N4: 0.15, N3: 0.1, N2: 0.05, N1: 0.02 };
      leverageScore += jlptBonus[cand.jlptLevel] || 0;

      const roundedScore = Number(leverageScore.toFixed(3));
      const knownNames = knownInFamily.map((k) => k.character).join(', ');

      const pedagogicalRationale = knownInFamily.length > 0
        ? `Đã thành thạo [${knownNames}] cùng họ gốc '${hub}'. Học '${cand.character}' giúp tái sử dụng ngay âm Onyomi [${family.dominantOnyomi.join(', ')}] mà không tốn công ghi nhớ mới.`
        : `Chữ '${cand.character}' thuộc họ biểu âm '${hub}'.`;

      recommendations.push({
        character: cand.character,
        phoneticGrapheme: hub,
        dominantOnyomi: family.dominantOnyomi,
        meaning: cand.meaning,
        radical: cand.radical,
        jlptLevel: cand.jlptLevel,
        strokeCount: cand.strokeCount,
        leverageScore: roundedScore,
        pedagogicalRationale,
      });
    }
  }

  // Sắp xếp các gợi ý theo điểm đòn bẩy giảm dần
  recommendations.sort((a, b) => b.leverageScore - a.leverageScore);

  return {
    knownCount: knownKanjiList.length,
    unlockedHubsCount,
    recommendations: recommendations.slice(0, 10), // Trả về top 10 chữ có đòn bẩy cao nhất
  };
}
