import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { cards, reviewLogs } from '@/db/schema';
import { eq } from 'drizzle-orm';
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

/**
 * API ghi nhận kết quả đánh giá thẻ (cập nhật DSR - Difficulty, Stability, Retrievability)
 * Triển khai chuẩn thuật toán FSRS v4.5 với giao dịch nguyên tử (db.transaction)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cardId = body.cardId;
    const rawRating = body.rating ?? body.grade;

    if (!cardId || rawRating === undefined || rawRating === null) {
      return NextResponse.json(
        { error: 'cardId and rating (or grade) are required' },
        { status: 400 }
      );
    }

    const ratingEnum = ratingMap[rawRating];
    if (ratingEnum === undefined) {
      return NextResponse.json(
        { error: `Invalid rating/grade: ${rawRating}. Must be one of Again, Hard, Good, Easy or 1-4.` },
        { status: 400 }
      );
    }

    // 1. Tìm thẻ hiện tại trong database
    const existingCards = await db.select().from(cards).where(eq(cards.id, cardId));
    if (existingCards.length === 0) {
      // DEF-UI-PRAC-001: Nếu là thẻ ngữ pháp phát sinh từ practice drill, tự động đăng ký vào kho thẻ
      if (cardId.startsWith('grammar_cloze_') || cardId.startsWith('grammar_rec_')) {
        const patternId = cardId.replace(/^grammar_(?:cloze|rec)_/, '');
        const newCard = {
          id: cardId,
          deckId: 'grammar_jpd133',
          type: 'GrammarPattern',
          front: `【文法】${patternId}`,
          reading: '',
          meaning: `Bài tập củng cố mẫu ngữ pháp ${patternId}`,
          stability: 0,
          difficulty: 5,
          elapsedDays: 0,
          scheduledDays: 0,
          reps: 0,
          lapses: 0,
          state: 'New',
          due: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await db.insert(cards).values(newCard as any);
        existingCards.push(newCard as any);
      } else {
        return NextResponse.json({ error: `Card with id ${cardId} not found` }, { status: 404 });
      }
    }
    const currentCard = existingCards[0];

    // 2. Chuyển đổi dữ liệu sang FSRS Card
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

    // 3. Tính toán trạng thái tiếp theo thông qua FSRS
    const now = new Date();
    const recordLog = fsrs.repeat(fsrsCard, now);
    const item = (recordLog as any)[ratingEnum];
    const nextCard = item.card;
    const logItem = item.log;

    const stateStr = stateStringMap[nextCard.state] || 'Learning';
    const ratingStr = ratingStrMap[ratingEnum];

    // Ngăn chặn vòng lặp vô hạn trong cùng 1 ngày khi ở Review state (BUG-FSRS-01)
    let scheduledDays = nextCard.scheduled_days;
    let due = nextCard.due;
    if (nextCard.state === State.Review && scheduledDays < 1.0) {
      scheduledDays = 1;
      due = new Date(now.getTime() + 86400000);
    }

    const reviewLogId = `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // 4. Cập nhật cơ sở dữ liệu bằng giao dịch nguyên tử (Atomic Database Transaction - BUG-DB-05)
    await db.transaction(async (tx: any) => {
      await tx.update(cards).set({
        stability: nextCard.stability,
        difficulty: nextCard.difficulty,
        elapsedDays: logItem.elapsed_days ?? 0,
        scheduledDays: Math.round(scheduledDays),
        reps: nextCard.reps,
        lapses: nextCard.lapses,
        state: stateStr,
        due,
        lastReview: now,
        updatedAt: now,
      }).where(eq(cards.id, cardId));

      await tx.insert(reviewLogs).values({
        id: reviewLogId,
        cardId,
        rating: ratingStr,
        state: stateStr,
        due,
        stability: nextCard.stability,
        difficulty: nextCard.difficulty,
        elapsedDays: logItem.elapsed_days ?? 0,
        lastElapsedDays: logItem.last_elapsed_days ?? 0,
        scheduledDays: Math.round(scheduledDays),
        reviewTime: now,
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Review logged and DSR parameters updated',
      data: {
        cardId,
        rating: ratingStr,
        state: stateStr,
        stability: nextCard.stability,
        difficulty: nextCard.difficulty,
        scheduledDays: Math.round(scheduledDays),
        nextReviewDate: due.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('[API Review Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
