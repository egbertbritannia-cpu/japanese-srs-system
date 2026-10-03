import { describe, it, expect } from 'vitest';
import { parseCardDetails } from '../src/lib/reading-parser';

describe('Japanese Reading & Meaning Parser', () => {
  it('phân tách chính xác Kun-yomi và On-yomi cho thẻ Kanji 家', () => {
    const res = parseCardDetails({
      type: 'Kanji',
      kanji: '家',
      reading: 'うち, いえ (On: カ, ケ)',
      meaning: 'Nhà, gia đình (Âm Hán: GIA)',
      sentence: '{{c1::家}}',
    });

    expect(res.isKanji).toBe(true);
    expect(res.kunYomi).toEqual(['うち', 'いえ']);
    expect(res.onYomi).toEqual(['カ', 'ケ']);
    expect(res.hanViet).toBe('GIA');
    expect(res.cleanMeaning).toBe('Nhà, gia đình');
    expect(res.hasDetailedReadings).toBe(true);
    expect(res.hasRealSentence).toBe(false); // {{c1::家}} chỉ là kanji đơn độc
  });

  it('xử lý đúng định dạng (On: ... / Kun: ...) cho chữ 父', () => {
    const res = parseCardDetails({
      type: 'Kanji',
      kanji: '父',
      reading: 'ちち (On: フ / Kun: ちち)',
      meaning: 'Bố, cha (xưng hô với người ngoài) (Âm Hán: PHỤ)',
      sentence: '私の父は会社員です。',
    });

    expect(res.isKanji).toBe(true);
    expect(res.kunYomi).toEqual(['ちち']);
    expect(res.onYomi).toEqual(['フ']);
    expect(res.hanViet).toBe('PHỤ');
    expect(res.cleanMeaning).toBe('Bố, cha (xưng hô với người ngoài)');
    expect(res.hasRealSentence).toBe(true);
  });

  it('xử lý thẻ từ vựng Kotoba thông thường không bị nhầm sang Kanji', () => {
    const res = parseCardDetails({
      type: 'Vocab',
      kanji: '大家',
      reading: 'おおや',
      meaning: 'Chủ trọ / Chủ nhà (Chữ Hán: 家 - Âm Hán: GIA)',
    });

    expect(res.isKanji).toBe(false);
    expect(res.kunYomi).toEqual([]);
    expect(res.onYomi).toEqual([]);
    expect(res.pureReading).toBe('おおy'.slice(0, 2) + 'や'); // おおや
    expect(res.cleanMeaning).toBe('Chủ trọ / Chủ nhà');
    expect(res.hanViet).toBe('GIA');
  });

  it('xử lý thẻ từ vựng JLPT N5 đơn giản', () => {
    const res = parseCardDetails({
      type: 'Vocab',
      kanji: '私',
      reading: 'わたし',
      meaning: 'Tôi, bản thân mình',
      sentence: '{{c1::私}}は学生です。',
    });

    expect(res.isKanji).toBe(false);
    expect(res.pureReading).toBe('わたし');
    expect(res.cleanMeaning).toBe('Tôi, bản thân mình');
    expect(res.hasRealSentence).toBe(true);
  });
});
