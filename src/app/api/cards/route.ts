import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { cards, decks } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { validateAndSaveCard } from '@/agents/skills/card-creator.skill';

/**
 * API Lấy danh sách thẻ học (Cards Library API)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const deckId = searchParams.get('deck');

    const baseQuery = db
      .select({
        id: cards.id,
        kanji: cards.front,
        reading: cards.reading,
        meaning: cards.meaning,
        pitch: cards.pitch,
        type: cards.type,
        deckId: cards.deckId,
        deckName: decks.name,
        state: cards.state,
        stability: cards.stability,
        difficulty: cards.difficulty,
      })
      .from(cards)
      .leftJoin(decks, eq(cards.deckId, decks.id));

    const cardList =
      deckId && deckId !== 'all'
        ? await baseQuery.where(eq(cards.deckId, deckId)).orderBy(desc(cards.createdAt))
        : await baseQuery.orderBy(desc(cards.createdAt));

    const allDecks = await db.select().from(decks);

    return NextResponse.json({
      success: true,
      data: cardList.map((c: any) => ({
        ...c,
        deck: c.deckName || 'Mặc định',
      })),
      decks: allDecks,
    });
  } catch (error: any) {
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
