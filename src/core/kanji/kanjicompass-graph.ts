/**
 * KanjiCompass Etymological Knowledge Graph
 * Trụ Cột 2: Đồ thị Tri thức Chữ Hán theo Ngữ nguyên học (Phonetic & Semantic Hubs)
 * Căn cứ: doc/15_PILLAR_2_KANJICOMPASS_ETYMOLOGICAL_KNOWLEDGE_GRAPH.md & doc/18_TECHNICAL_SPEC_AND_ATOMIC_IMPLEMENTATION_BLUEPRINT.md
 */

export interface KanjiGraphNodeData {
  id: string;
  character: string;
  nodeType: 'target_kanji' | 'phonetic_grapheme' | 'semantic_radical' | 'ideographic_compound';
  strokeCount: number;
  onyomi: string[];
  kunyomi: string[];
  primaryMeaning: string;
  jlptLevel?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | 'Non-JLPT';
  etymologyExplanation?: string;
}

export interface KanjiGraphEdgeData {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationshipType: 'HAS_PHONETIC' | 'HAS_RADICAL' | 'SAME_PHONETIC_FAMILY' | 'COMPOSED_OF_SEMANTIC_PARTS';
  weight: number;
}

export interface EtymologicalFamily {
  phoneticGrapheme: string;
  dominantOnyomi: string[];
  historicalSoundPattern: string;
  members: Array<{
    character: string;
    radical: string;
    meaning: string;
    onyomi: string[];
    jlptLevel: string;
    strokeCount: number;
  }>;
}

/**
 * Cơ sở dữ liệu hạt nhân về các họ chữ Hán Hình Thanh (Keisei-moji Phonetic Families)
 * Chuẩn ngữ nguyên học: Hơn 65% chữ Hán thông dụng là chữ hình thanh có chung thành tố âm thanh.
 */
export const KEISEI_PHONETIC_FAMILIES: Record<string, EtymologicalFamily> = {
  '寺': {
    phoneticGrapheme: '寺',
    dominantOnyomi: ['ジ', 'シ'],
    historicalSoundPattern: 'Âm Hán cổ kết thúc bằng âm xuýt /s/ -> Onyomi chuyển hóa thành JI hoặc SHI',
    members: [
      { character: '寺', radical: '寸', meaning: 'Chùa, tự viện', onyomi: ['ジ'], jlptLevel: 'N3', strokeCount: 6 },
      { character: '持', radical: '扌', meaning: 'Cầm, nắm, duy trì', onyomi: ['ジ'], jlptLevel: 'N4', strokeCount: 9 },
      { character: '待', radical: '彳', meaning: 'Đợi chờ, đãi ngộ', onyomi: ['タイ'], jlptLevel: 'N4', strokeCount: 9 },
      { character: '侍', radical: '亻', meaning: 'Võ sĩ Samurai, hầu cận', onyomi: ['ジ', 'シ'], jlptLevel: 'N1', strokeCount: 8 },
      { character: '詩', radical: '言', meaning: 'Thi ca, bài thơ', onyomi: ['シ'], jlptLevel: 'N3', strokeCount: 13 },
      { character: '時', radical: '日', meaning: 'Thời gian, giờ giấc', onyomi: ['ジ'], jlptLevel: 'N5', strokeCount: 10 },
      { character: '特', radical: '牛', meaning: 'Đặc biệt (bò tế lễ)', onyomi: ['トク'], jlptLevel: 'N4', strokeCount: 10 },
    ],
  },
  '青': {
    phoneticGrapheme: '青',
    dominantOnyomi: ['セイ', 'ショウ'],
    historicalSoundPattern: 'Thanh mẫu cổ /ts/ kết thúc /eng/ -> Onyomi chuyển hóa thành SEI / SHOU',
    members: [
      { character: '青', radical: '青', meaning: 'Màu xanh lam, thanh xuân', onyomi: ['セイ', 'ショウ'], jlptLevel: 'N5', strokeCount: 8 },
      { character: '清', radical: '氵', meaning: 'Trong sạch, thanh khiết', onyomi: ['セイ', 'ショウ'], jlptLevel: 'N3', strokeCount: 11 },
      { character: '晴', radical: '日', meaning: 'Trời quang đãng, tạnh ráo', onyomi: ['セイ'], jlptLevel: 'N4', strokeCount: 12 },
      { character: '情', radical: '忄', meaning: 'Tình cảm, thông tin', onyomi: ['ジョウ', 'セイ'], jlptLevel: 'N3', strokeCount: 11 },
      { character: '静', radical: '青', meaning: 'Yên tĩnh, thanh tịnh', onyomi: ['セイ', 'ジョウ'], jlptLevel: 'N4', strokeCount: 14 },
      { character: '精', radical: '米', meaning: 'Tinh thần, tinh túy', onyomi: ['セイ', 'ショウ'], jlptLevel: 'N3', strokeCount: 14 },
    ],
  },
  '包': {
    phoneticGrapheme: '包',
    dominantOnyomi: ['ホウ'],
    historicalSoundPattern: 'Môi âm cổ /p/ -> Onyomi chuyển hóa thành HOU',
    members: [
      { character: '包', radical: '勹', meaning: 'Bao bọc, gói lại', onyomi: ['ホウ'], jlptLevel: 'N3', strokeCount: 5 },
      { character: '抱', radical: '扌', meaning: 'Ôm ấp, hoài bão', onyomi: ['ホウ'], jlptLevel: 'N3', strokeCount: 8 },
      { character: '泡', radical: '氵', meaning: 'Bọt nước, bong bóng', onyomi: ['ホウ'], jlptLevel: 'N1', strokeCount: 8 },
      { character: '砲', radical: '石', meaning: 'Khẩu pháo, hỏa lực', onyomi: ['ホウ'], jlptLevel: 'N2', strokeCount: 10 },
      { character: '飽', radical: '飠', meaning: 'No nê, chán ngấy', onyomi: ['ホウ'], jlptLevel: 'N1', strokeCount: 13 },
      { character: '胞', radical: '月', meaning: 'Tế bào, đồng bào', onyomi: ['ホウ'], jlptLevel: 'N1', strokeCount: 9 },
    ],
  },
  '同': {
    phoneticGrapheme: '同',
    dominantOnyomi: ['ドウ'],
    historicalSoundPattern: 'Thiệt âm cổ /d/ -> Onyomi chuyển hóa thành DOU',
    members: [
      { character: '同', radical: '口', meaning: 'Cùng nhau, tương đồng', onyomi: ['ドウ'], jlptLevel: 'N4', strokeCount: 6 },
      { character: '洞', radical: '氵', meaning: 'Hang động, sâu sắc (thấu suốt)', onyomi: ['ドウ'], jlptLevel: 'N1', strokeCount: 9 },
      { character: '銅', radical: '金', meaning: 'Kim loại Đồng', onyomi: ['ドウ'], jlptLevel: 'N2', strokeCount: 14 },
      { character: '筒', radical: '竹', meaning: 'Ống tre, ống dẫn', onyomi: ['トウ'], jlptLevel: 'N2', strokeCount: 12 },
      { character: '胴', radical: '月', meaning: 'Thân mình, thân áo giáp', onyomi: ['ドウ'], jlptLevel: 'N1', strokeCount: 10 },
    ],
  },
};

/**
 * Phân tích chữ Hán và tra cứu họ ngữ nguyên học
 */
export function analyzeKanjiEtymology(char: string): {
  found: boolean;
  phoneticGrapheme?: string;
  family?: EtymologicalFamily;
  explanation: string;
} {
  // Tìm xem ký tự có trực tiếp là gốc họ hoặc nằm trong họ nào không
  for (const [grapheme, family] of Object.entries(KEISEI_PHONETIC_FAMILIES)) {
    if (grapheme === char) {
      return {
        found: true,
        phoneticGrapheme: grapheme,
        family,
        explanation: `Chữ '${char}' là Thành tố Biểu Âm Gốc (Phonetic Hub) chi phối họ âm đọc [${family.dominantOnyomi.join(', ')}].`,
      };
    }

    const member = family.members.find((m) => m.character === char);
    if (member) {
      return {
        found: true,
        phoneticGrapheme: grapheme,
        family,
        explanation: `Chữ '${char}' thuộc họ hình thanh của gốc '${grapheme}'. Gốc biểu ý là bộ thủ '${member.radical}', chia sẻ âm Onyomi chính [${family.dominantOnyomi.join(', ')}].`,
      };
    }
  }

  return {
    found: false,
    explanation: `Chữ '${char}' chưa nằm trong cơ sở dữ liệu các họ hình thanh phổ biến hiện tại.`,
  };
}

/**
 * Lấy danh sách toàn bộ các thành viên thuộc họ chữ Hán
 */
export function getSiblingKanji(char: string): Array<{
  character: string;
  meaning: string;
  onyomi: string[];
  radical: string;
  jlptLevel: string;
}> {
  const analysis = analyzeKanjiEtymology(char);
  if (!analysis.found || !analysis.family) {
    return [];
  }

  return analysis.family.members.filter((m) => m.character !== char);
}
