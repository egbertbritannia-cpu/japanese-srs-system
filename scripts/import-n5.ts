import { db } from '../src/db/client';
import { decks, cards } from '../src/db/schema';

async function main() {
  const now = new Date();
  await db.insert(decks).values({
    id: 'deck_n5',
    name: 'JLPT N5',
    description: 'N5 Deck',
    createdAt: now,
  }).onConflictDoNothing();

  for (let i = 0; i < 60; i++) {
    await db.insert(cards).values({
      id: `n5_${i}`,
      deckId: 'deck_n5',
      type: 'Vocab',
      front: `word${i}`,
      meaning: `meaning${i}`,
      due: now,
      createdAt: now,
      updatedAt: now,
    }).onConflictDoNothing();
  }
}

main();
