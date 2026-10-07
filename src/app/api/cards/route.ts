import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { cards, decks } from '@/db/schema';
import { eq, desc, sql, count, and, or, like } from 'drizzle-orm';
import { validateAndSaveCard } from '@/agents/skills/card-creator.skill';

/**
 * API Lấy danh sách thẻ học (Cards Library API)
 * - Tối ưu hóa truy vấn song song qua Promise.all()
 * - Tối ưu hóa gom nhóm thống kê trực tiếp trong nhân SQLite (SQL GROUP BY)
 * - Thêm Cache-Control header cho CDN
 */
export async function GET(request: Request) {
  try {
    const url = request ? request.url : 'http://localhost:3000/api/cards';
    const { searchParams } = new URL(url);
    const deckId = searchParams.get('deck');
    const search = searchParams.get('search')?.trim().toLowerCase();
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10), 1), 2000) : 1000;
    const nowMs = Date.now();

    const baseQuery = db
      .select({
        id: cards.id,
        kanji: cards.front,
        reading: cards.reading,
        meaning: cards.meaning,
        pitch: cards.pitch,
        sentence: cards.sentence,
        type: cards.type,
        deckId: cards.deckId,
        deckName: decks.name,
        state: cards.state,
        stability: cards.stability,
        difficulty: cards.difficulty,
        due: cards.due,
      })
      .from(cards)
      .leftJoin(decks, eq(cards.deckId, decks.id));

    // Xây dựng điều kiện lọc theo Deck và từ khóa tìm kiếm (BUG-DB-02)
    const conditions = [];
    if (deckId && deckId !== 'all') {
      conditions.push(eq(cards.deckId, deckId));
    }
    if (search) {
      conditions.push(
        or(
          like(cards.front, `%${search}%`),
          like(cards.reading, `%${search}%`),
          like(cards.meaning, `%${search}%`)
        )
      );
    }

    const filteredQuery = conditions.length > 0
      ? baseQuery.where(and(...conditions))
      : baseQuery;

    // Thực hiện song song 3 truy vấn độc lập qua Promise.all
    const [cardList, allDecks, deckStatsRaw] = await Promise.all([
      filteredQuery.orderBy(desc(cards.createdAt)).limit(limit),
      db.select().from(decks),
      db
        .select({
          id: decks.id,
          name: decks.name,
          description: decks.description,
          totalCards: count(cards.id),
          dueCards: sql<number>`SUM(CASE WHEN ${cards.state} != 'New' AND (CASE WHEN ${cards.due} > 10000000000 THEN ${cards.due} ELSE ${cards.due} * 1000 END) <= ${nowMs} THEN 1 ELSE 0 END)`,
          newCards: sql<number>`SUM(CASE WHEN ${cards.state} = 'New' THEN 1 ELSE 0 END)`,
          learnedCards: sql<number>`SUM(CASE WHEN ${cards.state} != 'New' THEN 1 ELSE 0 END)`,
        })
        .from(decks)
        .leftJoin(cards, eq(cards.deckId, decks.id))
        .groupBy(decks.id),
    ]);

    const deckSummaries = (deckStatsRaw as any[]).map((d) => ({
      id: d.id,
      name: d.name,
      description: d.description || '',
      totalCards: Number(d.totalCards || 0),
      dueCards: Number(d.dueCards || 0),
      newCards: Number(d.newCards || 0),
      learnedCards: Number(d.learnedCards || 0),
    }));

    return NextResponse.json(
      {
        success: true,
        data: cardList.map((c: any) => ({
          ...c,
          deck: c.deckName || 'Mặc định',
        })),
        decks: allDecks,
        deckSummaries,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error: any) {
    console.error('[API Cards Error]', error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cardData = await request.json();
    const result = await validateAndSaveCard({
      card_draft: cardData,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Card created successfully',
        data: result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
