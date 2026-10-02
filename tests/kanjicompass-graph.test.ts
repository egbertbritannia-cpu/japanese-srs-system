import { describe, it, expect } from 'vitest';
import {
  analyzeKanjiEtymology,
  getSiblingKanji,
  KEISEI_PHONETIC_FAMILIES,
} from '../src/core/kanji/kanjicompass-graph';
import { recommendKanjiPathway } from '../src/core/kanji/srl-recommender';

describe('KanjiCompass Etymological Knowledge Graph & SRL Recommender', () => {
  it('should identify phonetic hubs and explain sound correspondence', () => {
    // Chữ '寺' là hub
    const hubAnalysis = analyzeKanjiEtymology('寺');
    expect(hubAnalysis.found).toBe(true);
    expect(hubAnalysis.phoneticGrapheme).toBe('寺');
    expect(hubAnalysis.explanation).toContain('Thành tố Biểu Âm Gốc');

    // Chữ '持' thuộc họ của '寺'
    const memberAnalysis = analyzeKanjiEtymology('持');
    expect(memberAnalysis.found).toBe(true);
    expect(memberAnalysis.phoneticGrapheme).toBe('寺');
    expect(memberAnalysis.explanation).toContain('thuộc họ hình thanh');
  });

  it('should return all sibling kanji for a given family member', () => {
    const siblings = getSiblingKanji('待');
    expect(siblings.length).toBeGreaterThan(0);

    const chars = siblings.map((s) => s.character);
    // Phải chứa các chữ cùng họ khác như 寺, 持, 侍, 詩, v.v.
    expect(chars).toContain('持');
    expect(chars).toContain('寺');
    // Không chứa chính nó
    expect(chars).not.toContain('待');
  });

  it('should recommend optimal SRL learning pathways based on known kanji', () => {
    // Giả sử học viên đã biết chữ '青'
    const knownKanji = ['青', '日'];
    const pathResult = recommendKanjiPathway(knownKanji);

    expect(pathResult.unlockedHubsCount).toBeGreaterThanOrEqual(1);
    expect(pathResult.recommendations.length).toBeGreaterThan(0);

    // Gợi ý đầu tiên phải thuộc về họ '青' (như 清, 晴, 精) vì có đòn bẩy nhận thức cao nhất
    const topRec = pathResult.recommendations[0];
    expect(topRec.phoneticGrapheme).toBe('青');
    expect(topRec.leverageScore).toBeGreaterThan(0.7);
    expect(topRec.pedagogicalRationale).toContain('Đã thành thạo');
  });
});
