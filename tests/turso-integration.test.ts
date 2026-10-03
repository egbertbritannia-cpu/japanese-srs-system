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
    expect(cardCount[0].total).toBeGreaterThanOrEqual(381);

    const deckList = await db.select().from(decks);
    console.log('[Turso Test] Decks in Turso:', deckList);
    expect(deckList.length).toBeGreaterThanOrEqual(3);
  });

  it('should run GET /api/cards against Turso', async () => {
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
  });

  it('should test cards retrieval when filtering by deck or query', async () => {
    const { GET: getCardsRoute } = await import('../src/app/api/cards/route');
    
    // Test filter by deck_jpd133
    const req1 = new Request('http://localhost:3000/api/cards?deck=deck_jpd133');
    const res1 = await getCardsRoute(req1);
    const body1 = await res1.json();
    console.log('[Filter deck_jpd133] cards count:', body1.data?.length);
    expect(body1.data.length).toBeGreaterThan(0);

    // Test filter by deck_n5 (which is not in decks table!)
    const req2 = new Request('http://localhost:3000/api/cards?deck=deck_n5');
    const res2 = await getCardsRoute(req2);
    const body2 = await res2.json();
    console.log('[Filter deck_n5] cards count:', body2.data?.length);

    // Test filter by invalid deck
    const req3 = new Request('http://localhost:3000/api/cards?deck=non_existent');
    const res3 = await getCardsRoute(req3);
    const body3 = await res3.json();
    console.log('[Filter non_existent] cards count:', body3.data?.length);
  });
});
