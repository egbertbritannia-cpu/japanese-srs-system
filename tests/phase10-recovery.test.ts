import { describe, expect, it } from 'vitest';
import { getAllJPD133Slots, getJPD133Slot } from '../src/core/curriculum/jpd133-manifest';
import {
  buildDbCardIndex,
  softLinkManifestWithDbCards,
} from '../src/core/curriculum/soft-link-engine';

describe('Phase 10 recovery candidates', () => {
  it('exposes the eight Phase 10 slot numbers from committed JPD133 data', () => {
    const slots = getAllJPD133Slots();
    expect(slots.map((slot) => slot.slotNumber)).toEqual([1, 2, 3, 4, 5, 6, 8, 10]);
    expect(slots.every((slot) => slot.vocabularyList.length > 0)).toBe(true);
    expect(getJPD133Slot('1')?.sourcePage).toBe(1);
  });

  it('soft-links an exact front+reading match to the persisted DB card id', () => {
    const manifestItem = {
      id: 'manifest-1',
      kanji: '両親',
      reading: 'りょうしん',
      vietnameseMeaning: 'Bố mẹ',
      sourcePage: 1,
    };
    const index = buildDbCardIndex([
      {
        id: 'db-card-1',
        front: '両親',
        reading: 'りょうしん',
      },
    ]);

    const [linked] = softLinkManifestWithDbCards([manifestItem], index);
    expect(linked.dbCardId).toBe('db-card-1');
    expect(linked.matchStrategy).toBe('front+reading');
  });

  it('does not guess when a front-only match is ambiguous', () => {
    const manifestItem = {
      id: 'manifest-2',
      kanji: '生',
      reading: 'せい',
      vietnameseMeaning: 'Sinh',
      sourcePage: 1,
    };
    const index = buildDbCardIndex([
      { id: 'db-a', front: '生', reading: 'せい' },
      { id: 'db-b', front: '生', reading: 'なま' },
    ]);

    const [linked] = softLinkManifestWithDbCards(
      [{ ...manifestItem, reading: 'しょう' }],
      index
    );
    expect(linked.dbCardId).toBeUndefined();
    expect(linked.matchStrategy).toBe('unmatched');
  });
});
