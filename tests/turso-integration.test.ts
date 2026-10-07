import { describe, it, expect } from 'vitest';
import fs from 'fs';

// 1. Manually load .env
const envContent = fs.readFileSync('.env', 'utf8');
envContent.split(/\r?\n/).forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
    const idx = trimmed.indexOf('=');
    const k = trimmed.slice(0, idx).trim();
    const v = trimmed.slice(idx + 1).trim();
    process.env[k] = v;
  }
});

// Clear cached db
delete (globalThis as any).__drizzleDb;
delete (globalThis as any).__tursoClient;

describe('Turso Integration Test with Drizzle', () => {
  it('should connect to Turso with TURSO_DATABASE_URL set', async () => {
    expect(process.env.TURSO_DATABASE_URL).toBeDefined();

    // Dynamically import db and schema
    const { db } = await import('../src/db/client');
    const { cards, decks } = await import('../src/db/schema');
    const { count } = await import('drizzle-orm');

    console.log('[Turso Test] Querying cards count from Turso...');
    const cardCount = await db.select({ total: count(cards.id) }).from(cards);
    console.log('[Turso Test] Cards total in Turso:', cardCount);
    expect(cardCount[0].total).toBeGreaterThanOrEqual(640);

    const deckList = await db.select().from(decks);
    console.log('[Turso Test] Decks in Turso:', deckList);
    expect(deckList.length).toBeGreaterThanOrEqual(4);
    const deckIds = deckList.map((d: any) => d.id).sort();
    expect(deckIds).toContain('grammar_jpd133');
  }, 20000);

  it('should run GET /api/cards against Turso and verify 3 distinct decks', async () => {
    const { GET: getCardsRoute } = await import('../src/app/api/cards/route');
    const req = new Request('http://localhost:3000/api/cards');
    const res = await getCardsRoute(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    console.log('[Turso Test API] Result success:', body.success);
    console.log('[Turso Test API] Returned cards count:', body.data?.length);
    console.log('[Turso Test API] Returned decks count:', body.decks?.length);
    console.log('[Turso Test API] Deck summaries:', body.deckSummaries);

    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThanOrEqual(640);
    expect(body.decks.length).toBeGreaterThanOrEqual(4);
  }, 20000);

  it('should test cards retrieval when filtering by each separated deck', async () => {
    const { GET: getCardsRoute } = await import('../src/app/api/cards/route');
    
    // 1. Kotoba Deck (252 cards)
    const req1 = new Request('http://localhost:3000/api/cards?deck=deck_jpd133');
    const res1 = await getCardsRoute(req1);
    const body1 = await res1.json();
    console.log('[Filter deck_jpd133] cards count:', body1.data?.length);
    expect(body1.data.length).toBe(252);
    expect(body1.data.every((c: any) => c.type === 'Vocab' || c.type === 'Kanji')).toBe(true);

    // 2. Kanji Deck (232 cards)
    const reqKanji = new Request('http://localhost:3000/api/cards?deck=deck_jpd133_kanji');
    const resKanji = await getCardsRoute(reqKanji);
    const bodyKanji = await resKanji.json();
    console.log('[Filter deck_jpd133_kanji] cards count:', bodyKanji.data?.length);
    expect(bodyKanji.data.length).toBe(232);
    expect(bodyKanji.data.every((c: any) => c.type === 'Kanji' || c.type === 'Vocab')).toBe(true);

    // 3. JLPT N5 Deck (60 cards)
    const req2 = new Request('http://localhost:3000/api/cards?deck=deck_n5');
    const res2 = await getCardsRoute(req2);
    const body2 = await res2.json();
    console.log('[Filter deck_n5] cards count:', body2.data?.length);
    expect(body2.data.length).toBeGreaterThanOrEqual(60);
    expect(body2.data.every((c: any) => c.type === 'Vocab')).toBe(true);

    // 4. Invalid deck filter
    const req3 = new Request('http://localhost:3000/api/cards?deck=non_existent');
    const res3 = await getCardsRoute(req3);
    const body3 = await res3.json();
    console.log('[Filter non_existent] cards count:', body3.data?.length);
    expect(body3.data.length).toBe(0);
  }, 20000);
});
