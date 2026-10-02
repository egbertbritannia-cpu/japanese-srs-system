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

    const cardList =
      deckId && deckId !== 'all'
        ? await baseQuery.where(eq(cards.deckId, deckId)).orderBy(desc(cards.createdAt))
        : await baseQuery.orderBy(desc(cards.createdAt));

    const allDecks = await db.select().from(decks);

    // Tính toán số liệu thống kê cho từng bộ thẻ (Due, New, Total)
    const now = new Date();
    const allCardsForStats = await db
      .select({
        id: cards.id,
        deckId: cards.deckId,
        state: cards.state,
        due: cards.due,
      })
      .from(cards);

    const deckSummaries = allDecks.map((d: any) => {
      const cardsInDeck = allCardsForStats.filter((c: any) => c.deckId === d.id);
      const dueCards = cardsInDeck.filter(
        (c: any) => c.state !== 'New' && new Date(c.due || 0) <= now
      ).length;
      const newCards = cardsInDeck.filter((c: any) => c.state === 'New').length;
      const learnedCards = cardsInDeck.filter((c: any) => c.state === 'Review').length;

      return {
        id: d.id,
        name: d.name,
        description: d.description,
        totalCards: cardsInDeck.length,
        dueCards,
        newCards,
        learnedCards,
      };
    });

    return NextResponse.json({
      success: true,
      data: cardList.map((c: any) => ({
        ...c,
        deck: c.deckName || 'Mặc định',
      })),
      decks: allDecks,
      deckSummaries,
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
