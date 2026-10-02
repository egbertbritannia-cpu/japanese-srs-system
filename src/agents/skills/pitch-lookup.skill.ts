import { PitchAccentLookup, PitchInfo } from '@/modules/japanese-nlp/pitch-lookup';

export interface LookupPitchAccentInput {
  word: string;
  reading: string;
}

export interface LookupPitchAccentOutput {
  pattern_code: string;
  pitch_graph_svg: string;
}

/**
 * Sinh biểu đồ SVG trực quan hóa đường cao độ (Pitch Accent Contour Graph)
 */
function generatePitchSvg(reading: string, dropPosition: number): string {
  const moras = reading.split('');
  const totalMoras = Math.max(1, moras.length);
  const width = Math.max(120, totalMoras * 40);
  const height = 50;

  // Xác định độ cao cho từng mora theo quy tắc Tokyo:
  // 0: Heiban (L H H H...)
  // 1: Atamadaka (H L L L...)
  // k: Nakadaka / Odaka (L H... (hạ tại k) L)
  const isHigh: boolean[] = [];

  if (dropPosition === 0) {
    // Heiban: 0
    isHigh.push(false);
    for (let i = 1; i < totalMoras; i++) isHigh.push(true);
  } else if (dropPosition === 1) {
    // Atamadaka: 1
    isHigh.push(true);
    for (let i = 1; i < totalMoras; i++) isHigh.push(false);
  } else {
    // Nakadaka / Odaka: lên cao từ âm 2, tụt sau dropPosition
    isHigh.push(false);
    for (let i = 1; i < totalMoras; i++) {
      isHigh.push(i < dropPosition);
    }
  }

  const points = moras.map((mora, i) => {
    const cx = 20 + i * 35;
    const cy = isHigh[i] ? 15 : 35;
    return { cx, cy, mora };
  });

  const pathD = points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.cx} ${p.cy}`)
    .join(' ');

  const circles = points
    .map(
      (p) =>
        `<circle cx="${p.cx}" cy="${p.cy}" r="4" fill="#38bdf8" /><text x="${p.cx}" y="48" font-size="11" text-anchor="middle" fill="#94a3b8">${p.mora}</text>`
    )
    .join('');

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <path d="${pathD}" fill="none" stroke="#38bdf8" stroke-width="2.5" />
  ${circles}
</svg>`;
}

/**
 * Skill: lookup_pitch_accent
 * Xác định vị trí hạ cao độ (0: Heiban, 1: Atamadaka,...) và trả về biểu đồ pitch_graph_svg
 */
export async function lookupPitchAccent(
  input: LookupPitchAccentInput
): Promise<LookupPitchAccentOutput> {
  const { word, reading } = input;
  const info: PitchInfo = PitchAccentLookup.lookup(word, reading) || {
    word,
    reading,
    pattern: 'Heiban',
    dropPosition: 0,
  };

  const pattern_code = `[${info.dropPosition}] ${info.pattern}`;
  const pitch_graph_svg = generatePitchSvg(reading || word, info.dropPosition);

  return {
    pattern_code,
    pitch_graph_svg,
  };
}

// Giữ lại alias tương thích ngược nếu cần
export const executePitchLookupSkill = async (params: { word: string; reading?: string }) => {
  const res = await lookupPitchAccent({ word: params.word, reading: params.reading || params.word });
  return {
    success: true,
    pitchInfo: {
      word: params.word,
      reading: params.reading || '',
      pattern: res.pattern_code.split(' ')[1] as any || 'Heiban',
      dropPosition: parseInt(res.pattern_code.match(/\d+/)?.[0] || '0', 10),
    },
    description: `Cao độ: ${res.pattern_code}`,
  };
};
