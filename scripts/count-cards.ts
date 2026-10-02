import { db } from '../src/db/client';
import { cards, decks } from '../src/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const allDecks = await db.select().from(decks);
  console.log('DANH SÁCH BỘ THẺ:');
  for (const d of allDecks) {
    const count = await db.select().from(cards).where(eq(cards.deckId, d.id));
    console.log(`- ${d.name} (ID: ${d.id}): ${count.length} thẻ`);
  }
}

main().catch(console.error);
