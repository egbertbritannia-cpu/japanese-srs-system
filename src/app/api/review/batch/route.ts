import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { cards, reviewLogs } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { FSRS, generatorParameters, Rating, createEmptyCard, State } from 'ts-fsrs';

const fsrs = new FSRS(generatorParameters());

const ratingMap: Record<string | number, Rating> = {
  Again: Rating.Again,
  Hard: Rating.Hard,
  Good: Rating.Good,
  Easy: Rating.Easy,
  [Rating.Again]: Rating.Again,
  [Rating.Hard]: Rating.Hard,
  [Rating.Good]: Rating.Good,
  [Rating.Easy]: Rating.Easy,
};

const ratingStrMap: Record<number, string> = {
  [Rating.Manual]: 'Manual',
  [Rating.Again]: 'Again',
  [Rating.Hard]: 'Hard',
  [Rating.Good]: 'Good',
  [Rating.Easy]: 'Easy',
};

const stateStringMap: Record<number, string> = {
  [State.New]: 'New',
  [State.Learning]: 'Learning',
  [State.Review]: 'Review',
  [State.Relearning]: 'Relearning',
};

const stateEnumMap: Record<string, number> = {
  New: State.New,
  Learning: State.Learning,
  Review: State.Review,
  Relearning: State.Relearning,
};

export interface BatchReviewItem {
  id?: string;
  cardId: string;
  rating?: string | number;
  grade?: string | number;
  reviewTime?: number | string | Date;
}

/**
 * Batch Review API Endpoint (BUG-OFF-02)
 * Đồng bộ toàn bộ hàng đợi ngoại tuyến trong một HTTP request duy nhất
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const reviews: BatchReviewItem[] = body.reviews;

    if (!Array.isArray(reviews) || reviews.length === 0) {
      return NextResponse.json(
        { error: 'Body must contain non-empty reviews array' },
        { status: 400 }
      );
    }

    const cardIds = Array.from(new Set(reviews.map((r) => r.cardId).filter(Boolean)));
    if (cardIds.length === 0) {
      return NextResponse.json({ error: 'No valid cardIds in reviews' }, { status: 400 });
    }

    // Nạp toàn bộ các thẻ liên quan
    const existingCards = await db.select().from(cards).where(inArray(cards.id, cardIds));
    const cardMap = new Map<string, typeof cards.$inferSelect>();
    for (const c of existingCards) {
      cardMap.set(c.id, c);
    }

    const processedResults: Array<{ cardId: string; state: string; nextReviewDate: string }> = [];

    await db.transaction(async (tx: any) => {
      for (const item of reviews) {
        const currentCard = cardMap.get(item.cardId);
        if (!currentCard) continue;

        const rawRating = item.rating ?? item.grade;
        const ratingEnum = ratingMap[rawRating as any] ?? Rating.Good;
        const empty = createEmptyCard();
        const parsedState = stateEnumMap[currentCard.state] ?? State.New;

        const fsrsCard = {
          ...empty,
          due: currentCard.due ? new Date(currentCard.due) : empty.due,
          stability: typeof currentCard.stability === 'number' ? currentCard.stability : empty.stability,
          difficulty: typeof currentCard.difficulty === 'number' ? currentCard.difficulty : empty.difficulty,
          elapsed_days: currentCard.elapsedDays ?? 0,
          scheduled_days: currentCard.scheduledDays ?? 0,
          reps: currentCard.reps ?? 0,
          lapses: currentCard.lapses ?? 0,
          state: parsedState,
          last_review: currentCard.lastReview ? new Date(currentCard.lastReview) : undefined,
        };

        const reviewDate = item.reviewTime ? new Date(item.reviewTime) : new Date();
        const recordLog = fsrs.repeat(fsrsCard, reviewDate);
        const nextLog = (recordLog as any)[ratingEnum];
        const nextCard = nextLog.card;
        const logItem = nextLog.log;

        const stateStr = stateStringMap[nextCard.state] || 'Learning';
        const ratingStr = ratingStrMap[ratingEnum];

        let scheduledDays = nextCard.scheduled_days;
        let due = nextCard.due;
        if (nextCard.state === State.Review && scheduledDays < 1.0) {
          scheduledDays = 1;
          due = new Date(reviewDate.getTime() + 86400000);
        }

        const logId = item.id || `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

        await tx.update(cards).set({
          stability: nextCard.stability,
          difficulty: nextCard.difficulty,
          elapsedDays: logItem.elapsed_days ?? 0,
          scheduledDays: Math.round(scheduledDays),
          reps: nextCard.reps,
          lapses: nextCard.lapses,
          state: stateStr,
          due,
          lastReview: reviewDate,
          updatedAt: new Date(),
        }).where(eq(cards.id, item.cardId));

        await tx.insert(reviewLogs).values({
          id: logId,
          cardId: item.cardId,
          rating: ratingStr,
          state: stateStr,
          due,
          stability: nextCard.stability,
          difficulty: nextCard.difficulty,
          elapsedDays: logItem.elapsed_days ?? 0,
          lastElapsedDays: logItem.last_elapsed_days ?? 0,
          scheduledDays: Math.round(scheduledDays),
          reviewTime: reviewDate,
        });

        // Cập nhật cardMap trong bộ nhớ tạm để nếu có nhiều review cùng thẻ thì tính toán tuần tự chuẩn xác
        currentCard.stability = nextCard.stability;
        currentCard.difficulty = nextCard.difficulty;
        currentCard.reps = nextCard.reps;
        currentCard.lapses = nextCard.lapses;
        currentCard.state = stateStr;
        currentCard.due = due;
        currentCard.lastReview = reviewDate;
        currentCard.scheduledDays = Math.round(scheduledDays);
        currentCard.elapsedDays = logItem.elapsed_days ?? 0;

        processedResults.push({
          cardId: item.cardId,
          state: stateStr,
          nextReviewDate: due.toISOString(),
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: `Batch synced ${processedResults.length} reviews successfully`,
      processedCount: processedResults.length,
      data: processedResults,
    });
  } catch (error: any) {
    console.error('[Batch Review API Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
