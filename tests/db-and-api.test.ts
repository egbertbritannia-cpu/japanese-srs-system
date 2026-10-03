import { describe, it, expect } from 'vitest';
import { db } from '../src/db/client';
import { cards, decks } from '../src/db/schema';
import { count, eq, desc, sql } from 'drizzle-orm';
import { GET as getCardsRoute } from '../src/app/api/cards/route';

describe('Database & API Data Retrieval Test', () => {
  it('should inspect env and db client type', () => {
    console.log('process.env.TURSO_DATABASE_URL:', process.env.TURSO_DATABASE_URL);
    console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
  });

  it('should query cards and decks directly from db', async () => {
    const cardCountRes = await db.select({ total: count(cards.id) }).from(cards);
    console.log('[Test Direct DB] Cards total count:', cardCountRes);
    expect(cardCountRes[0].total).toBeGreaterThan(0);

    const deckList = await db.select().from(decks);
    console.log('[Test Direct DB] Decks count:', deckList.length, deckList);
    expect(deckList.length).toBeGreaterThan(0);
  });

  it('should call /api/cards route handler and return data', async () => {
    const req = new Request('http://localhost:3000/api/cards');
    const res = await getCardsRoute(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    console.log('[Test API Cards] Result success:', body.success);
    console.log('[Test API Cards] Cards returned count:', body.data?.length);
    console.log('[Test API Cards] Decks count:', body.decks?.length);
    console.log('[Test API Cards] Deck summaries count:', body.deckSummaries?.length);
    console.log('[Test API Cards] Deck summaries:', body.deckSummaries);

    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });
});
