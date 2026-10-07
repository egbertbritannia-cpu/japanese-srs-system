import { describe, it, expect } from 'vitest';
import { db } from '../src/db/client';
import { cards, decks } from '../src/db/schema';
import { count } from 'drizzle-orm';
import { GET as getCardsRoute } from '../src/app/api/cards/route';

describe('Database & API Data Retrieval Test', () => {
  it('queries a clean local database without requiring production fixtures', async () => {
    const cardCountRes = await db.select({ total: count(cards.id) }).from(cards);
    const deckList = await db.select().from(decks);

    expect(cardCountRes).toHaveLength(1);
    expect(cardCountRes[0].total).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(deckList)).toBe(true);
  });

  it('calls /api/cards and preserves the response contract on an empty or seeded DB', async () => {
    const req = new Request('http://localhost:3000/api/cards');
    const res = await getCardsRoute(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(Array.isArray(body.decks)).toBe(true);
    expect(Array.isArray(body.deckSummaries)).toBe(true);
  });
});
