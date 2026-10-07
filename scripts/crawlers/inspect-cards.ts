import fs from 'fs';
import path from 'path';

// Load .env
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const k = trimmed.slice(0, idx).trim();
      const v = trimmed.slice(idx + 1).trim();
      process.env[k] = v;
    }
  }
}

import { db } from '../../src/db/client';
import { cards } from '../../src/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const kanjiCards = await db.select().from(cards).where(eq(cards.deckId, 'deck_jpd133_kanji')).limit(3);
  console.log('--- KANJI SAMPLES ---');
  console.log(JSON.stringify(kanjiCards, null, 2));

  const kotobaCards = await db.select().from(cards).where(eq(cards.deckId, 'deck_jpd133')).limit(3);
  console.log('--- KOTOBA SAMPLES ---');
  console.log(JSON.stringify(kotobaCards, null, 2));

  const grammarCards = await db.select().from(cards).where(eq(cards.deckId, 'grammar_jpd133')).limit(3);
  console.log('--- GRAMMAR SAMPLES ---');
  console.log(JSON.stringify(grammarCards, null, 2));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
