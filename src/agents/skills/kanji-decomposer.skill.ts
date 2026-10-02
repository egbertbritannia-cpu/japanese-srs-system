import semanticRadicalsData from '../knowledge/kanji/semantic-radicals.json';
import phoneticComponentsData from '../knowledge/kanji/phonetic-components.json';

export interface DecomposeKanjiEtymologyInput {
  kanji: string;
}

export interface DecomposeKanjiEtymologyOutput {
  semantic_radical: string;
  phonetic_grapheme: string;
  reading_rule: string;
}

function decomposeSingleChar(char: string): DecomposeKanjiEtymologyOutput {
  let foundPhonetic = '';
  let foundReading = '';
  let foundRadical = '';

  for (const comp of phoneticComponentsData.components) {
    const match = comp.examples.find((ex) => ex.kanji === char);
    if (match) {
      foundPhonetic = comp.component;
      foundReading = match.reading || comp.onyomi;
      foundRadical = match.radical;
      break;
    }
  }

  if (!foundPhonetic) {
    const directComp = phoneticComponentsData.components.find((c) => c.component === char);
    if (directComp) {
      foundPhonetic = directComp.component;
      foundReading = directComp.onyomi;
      foundRadical = 'Bộ thủ gốc';
    }
  }

  let radicalMeaning = '';
  if (foundRadical) {
    const radicalClean = foundRadical.replace(/[^一-龥⺀-⿕]/g, '')[0];
    const radMatch = semanticRadicalsData.radicals.find(
      (r) => r.radical === radicalClean || (r.variants && r.variants.includes(radicalClean))
    );
    if (radMatch) {
      radicalMeaning = ` (${radMatch.meaning})`;
    }
  }

  const semantic_radical = foundRadical
    ? `${foundRadical}${radicalMeaning}`
    : 'Bộ thủ biểu ý';

  const phonetic_grapheme = foundPhonetic
    ? `${foundPhonetic} (đều đọc là ${foundReading.toLowerCase().replace(/[^a-z]/g, '') || foundReading})`
    : 'Chữ nguyên thể';

  const reading_rule = foundPhonetic
    ? `chữ Hình thanh (Keisei-moji) ${char} có bộ Thủ ${semantic_radical} và thành tố biểu âm ${foundPhonetic} (đều đọc là ${foundReading})`
    : `chữ ${char} cấu thành theo lối tượng hình/hội ý truyền thống`;

  return {
    semantic_radical,
    phonetic_grapheme,
    reading_rule,
  };
}

/**
 * Skill: decompose_kanji_etymology
 * Tra cứu thành tố biểu ý và biểu âm trong knowledge/kanji/
 * Hỗ trợ cả 1 ký tự hoặc từ ghép nhiều chữ Kanji (như 警察 -> 警 và 察)
 */
export async function decomposeKanjiEtymology(
  input: DecomposeKanjiEtymologyInput
): Promise<DecomposeKanjiEtymologyOutput> {
  const { kanji } = input;
  const chars = (kanji || '').match(/[\u4e00-\u9faf]/g) || [];

  if (chars.length === 0) {
    return {
      semantic_radical: 'Chưa xác định',
      phonetic_grapheme: 'Chưa xác định',
      reading_rule: 'Vui lòng cung cấp chuỗi chứa ký tự Kanji hợp lệ.',
    };
  }

  if (chars.length === 1) {
    const single = decomposeSingleChar(chars[0]);
    return {
      semantic_radical: single.semantic_radical,
      phonetic_grapheme: single.phonetic_grapheme,
      reading_rule: `Phát hiện ${single.reading_rule}, hỗ trợ ghi nhớ âm đọc có quy luật.`,
    };
  }

  // Nếu là từ ghép đa ký tự (như 警察)
  const results = chars.map((c) => ({ char: c, ...decomposeSingleChar(c) }));
  const radicals = results.map((r) => `${r.char}: ${r.semantic_radical}`).join('; ');
  const phonetics = results.map((r) => `${r.char}: ${r.phonetic_grapheme}`).join('; ');
  const rules = results.map((r) => r.reading_rule).join('; ');

  return {
    semantic_radical: radicals,
    phonetic_grapheme: phonetics,
    reading_rule: `Phát hiện ${rules}, hỗ trợ ghi nhớ âm đọc có quy luật.`,
  };
}

// Giữ lại alias tương thích ngược nếu cần
export const executeKanjiDecomposerSkill = async (params: { kanji: string }) => {
  const result = await decomposeKanjiEtymology({ kanji: params.kanji });
  return {
    success: true,
    decomposition: {
      character: params.kanji,
      classification: 'Keisei' as const,
      semanticComponent: { radical: result.semantic_radical, meaning: '' },
      phoneticComponent: { component: result.phonetic_grapheme, reading: '' },
    },
    explanation: result.reading_rule,
  };
};
