import { describe, it, expect } from 'vitest';

const hasTursoCredentials =
  Boolean(process.env.TURSO_DATABASE_URL) && Boolean(process.env.TURSO_AUTH_TOKEN);
const runTursoIntegration =
  process.env.RUN_TURSO_INTEGRATION === '1' && hasTursoCredentials;
const describeTurso = runTursoIntegration ? describe : describe.skip;

describeTurso('Turso Integration Test with Drizzle', () => {
  it('connects to Turso and returns structurally valid card/deck data', async () => {
    delete (globalThis as any).__drizzleDb;
    delete (globalThis as any).__tursoClient;

    const { db } = await import('../src/db/client');
    const { cards, decks } = await import('../src/db/schema');
    const { count } = await import('drizzle-orm');

    const cardCount = await db.select({ total: count(cards.id) }).from(cards);
    const deckList = await db.select().from(decks);

    expect(cardCount).toHaveLength(1);
    expect(cardCount[0].total).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(deckList)).toBe(true);
  }, 20000);

  it('runs GET /api/cards against Turso without asserting production inventory counts', async () => {
    const { GET: getCardsRoute } = await import('../src/app/api/cards/route');
    const req = new Request('http://localhost:3000/api/cards');
    const res = await getCardsRoute(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(Array.isArray(body.decks)).toBe(true);
  }, 20000);

  it('supports deck filtering and an empty result for an unknown deck', async () => {
    const { GET: getCardsRoute } = await import('../src/app/api/cards/route');

    const req = new Request('http://localhost:3000/api/cards?deck=non_existent');
    const res = await getCardsRoute(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual([]);
  }, 20000);
});
