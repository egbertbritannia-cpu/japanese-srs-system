import type { JPD133VocabularyItem } from './jpd133-manifest';

export interface DbCardForSoftLink {
  id: string;
  front: string;
  reading?: string | null;
  meaning?: string | null;
  due?: string | number | Date | null;
  stability?: number | null;
  difficulty?: number | null;
  reps?: number | null;
  lapses?: number | null;
  state?: string | null;
}

export interface SoftLinkedVocabularyItem extends JPD133VocabularyItem {
  dbCardId?: string;
  matchStrategy: 'front+reading' | 'front' | 'unmatched';
}

export interface DbCardIndex {
  byFrontAndReading: Map<string, DbCardForSoftLink>;
  byFront: Map<string, DbCardForSoftLink[]>;
}

function normalize(value?: string | null): string {
  return (value || '')
    .normalize('NFKC')
    .replace(/[\s・･。、，,.!?！？「」『』（）()[\]{}]/g, '')
    .toLowerCase();
}

function compoundKey(front: string, reading?: string | null): string {
  return `${normalize(front)}::${normalize(reading)}`;
}

export function buildDbCardIndex(cards: DbCardForSoftLink[]): DbCardIndex {
  const byFrontAndReading = new Map<string, DbCardForSoftLink>();
  const byFront = new Map<string, DbCardForSoftLink[]>();

  for (const card of cards) {
    byFrontAndReading.set(compoundKey(card.front, card.reading), card);

    const frontKey = normalize(card.front);
    const bucket = byFront.get(frontKey) || [];
    bucket.push(card);
    byFront.set(frontKey, bucket);
  }

  return { byFrontAndReading, byFront };
}

export function softLinkManifestWithDbCards(
  items: JPD133VocabularyItem[],
  index: DbCardIndex
): SoftLinkedVocabularyItem[] {
  return items.map((item) => {
    const exact = index.byFrontAndReading.get(compoundKey(item.kanji, item.reading));
    if (exact) {
      return { ...item, dbCardId: exact.id, matchStrategy: 'front+reading' };
    }

    const sameFront = index.byFront.get(normalize(item.kanji)) || [];
    if (sameFront.length === 1) {
      return { ...item, dbCardId: sameFront[0].id, matchStrategy: 'front' };
    }

    return { ...item, matchStrategy: 'unmatched' };
  });
}
