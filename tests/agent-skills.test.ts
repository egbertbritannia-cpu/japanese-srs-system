import { describe, it, expect } from 'vitest';
import { generateIPlusOneSentence } from '../src/agents/skills/sentence-mining.skill';
import { decomposeKanjiEtymology } from '../src/agents/skills/kanji-decomposer.skill';
import { lookupPitchAccent } from '../src/agents/skills/pitch-lookup.skill';

describe('Agent Skills (Function Calling) Tests', () => {
  it('generate_i_plus_one_sentence sinh câu đục lỗ chứa target_word', async () => {
    const output = await generateIPlusOneSentence({
      target_word: '桜',
      known_vocab: ['春', 'きれい', '見る'],
    });

    expect(output.sentence).toContain('{{c1::桜}}');
    expect(output.cloze_target).toBe('{{c1::桜}}');
    expect(output.translation.length).toBeGreaterThan(0);
  });

  it('decompose_kanji_etymology phân tích đúng chữ Hình thanh 際 từ thành tố 祭 (sai)', async () => {
    const output = await decomposeKanjiEtymology({
      kanji: '際',
    });

    expect(output.semantic_radical).toContain('阝');
    expect(output.phonetic_grapheme).toContain('祭');
    expect(output.reading_rule).toContain('Hình thanh');
  });

  it('lookup_pitch_accent xác định đúng mã mẫu cao độ và trả về pitch_graph_svg', async () => {
    const output = await lookupPitchAccent({
      word: '桜',
      reading: 'さくら',
    });

    expect(output.pattern_code).toContain('Heiban');
    expect(output.pitch_graph_svg).toContain('<svg');
    expect(output.pitch_graph_svg).toContain('</svg>');
  });
});
