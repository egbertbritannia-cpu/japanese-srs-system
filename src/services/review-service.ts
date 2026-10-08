import { eq } from 'drizzle-orm';
import { FSRS, Rating, State, createEmptyCard, generatorParameters } from 'ts-fsrs';
import { db, TURSO_DATABASE_URL } from '@/db/client';
import { cards, reviewLogs } from '@/db/schema';

export type ReviewRating = 'Again' | 'Hard' | 'Good' | 'Easy';
export type ReviewStatus = 'applied' | 'duplicate';

export interface SubmitReviewInput {
  eventId?: string;
  cardId: string;
  rating: unknown;
  reviewedAt?: Date | number | string;
  responseTimeMs?: number;
}

export interface ReviewResult {
  eventId: string;
  status: ReviewStatus;
  cardId: string;
  rating: ReviewRating;
  state: string;
  stability: number;
  difficulty: number;
  scheduledDays: number;
  nextReviewDate: string;
}

export interface RejectedReviewResult {
  eventId: string;
  status: 'rejected';
  cardId: string;
  error: string;
}

export type BatchReviewResult = ReviewResult | RejectedReviewResult;

type CardRow = typeof cards.$inferSelect;
type NewReviewLog = typeof reviewLogs.$inferInsert;

interface NormalizedReviewInput {
  eventId: string;
  cardId: string;
  rating: ReviewRating;
  ratingEnum: Rating;
  reviewedAt: Date;
  responseTimeMs?: number;
}

interface ReviewTransition {
  rating: ReviewRating;
  state: string;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  lastElapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  due: Date;
}

export class ReviewServiceError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number = 400
  ) {
    super(message);
    this.name = 'ReviewServiceError';
  }
}

const fsrs = new FSRS(generatorParameters());

const stateEnumMap: Record<string, State> = {
  New: State.New,
  Learning: State.Learning,
  Review: State.Review,
  Relearning: State.Relearning,
};

const stateStringMap: Record<number, string> = {
  [State.New]: 'New',
  [State.Learning]: 'Learning',
  [State.Review]: 'Review',
  [State.Relearning]: 'Relearning',
};

function createEventId(): string {
  if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return `rev_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function parseReviewRating(raw: unknown): { rating: ReviewRating; ratingEnum: Rating } {
  const value = typeof raw === 'string' ? raw.trim() : raw;

  if (value === 'Again' || value === 1 || value === '1') {
    return { rating: 'Again', ratingEnum: Rating.Again };
  }
  if (value === 'Hard' || value === 2 || value === '2') {
    return { rating: 'Hard', ratingEnum: Rating.Hard };
  }
  if (value === 'Good' || value === 3 || value === '3') {
    return { rating: 'Good', ratingEnum: Rating.Good };
  }
  if (value === 'Easy' || value === 4 || value === '4') {
    return { rating: 'Easy', ratingEnum: Rating.Easy };
  }

  throw new ReviewServiceError(
    'INVALID_RATING',
    `Invalid rating: ${String(raw)}. Must be Again, Hard, Good, Easy or 1-4.`,
    400
  );
}

function toDate(value: Date | number | string): Date {
  return value instanceof Date ? new Date(value.getTime()) : new Date(value);
}

function parseReviewedAt(raw: SubmitReviewInput['reviewedAt']): Date {
  const reviewedAt = raw === undefined ? new Date() : toDate(raw);
  if (Number.isNaN(reviewedAt.getTime())) {
    throw new ReviewServiceError('INVALID_REVIEW_TIME', 'reviewedAt/reviewTime must be a valid date.', 400);
  }
  return reviewedAt;
}

function normalizeInput(input: SubmitReviewInput): NormalizedReviewInput {
  if (!input.cardId || typeof input.cardId !== 'string') {
    throw new ReviewServiceError('INVALID_CARD_ID', 'cardId is required.', 400);
  }

  const { rating, ratingEnum } = parseReviewRating(input.rating);
  return {
    eventId: input.eventId?.trim() || createEventId(),
    cardId: input.cardId,
    rating,
    ratingEnum,
    reviewedAt: parseReviewedAt(input.reviewedAt),
    responseTimeMs: input.responseTimeMs,
  };
}

function duplicateToResult(log: typeof reviewLogs.$inferSelect): ReviewResult {
  return {
    eventId: log.id,
    status: 'duplicate',
    cardId: log.cardId,
    rating: log.rating as ReviewRating,
    state: log.state,
    stability: log.stability,
    difficulty: log.difficulty,
    scheduledDays: log.scheduledDays,
    nextReviewDate: toDate(log.due).toISOString(),
  };
}

async function requireCard(tx: any, cardId: string, reviewedAt: Date): Promise<CardRow> {
  const found = await tx.select().from(cards).where(eq(cards.id, cardId)).limit(1);
  if (found.length > 0) {
    return found[0] as CardRow;
  }

  // Preserve the existing grammar-practice behavior while keeping creation + review atomic.
  if (cardId.startsWith('grammar_cloze_') || cardId.startsWith('grammar_rec_')) {
    const patternId = cardId.replace(/^grammar_(?:cloze|rec)_/, '');
    const newCard: typeof cards.$inferInsert = {
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
      due: reviewedAt,
      createdAt: reviewedAt,
      updatedAt: reviewedAt,
    };
    await tx.insert(cards).values(newCard);
    return newCard as CardRow;
  }

  throw new ReviewServiceError('CARD_NOT_FOUND', `Card with id ${cardId} not found.`, 404);
}

export function calculateReviewTransition(
  currentCard: CardRow,
  rating: ReviewRating,
  ratingEnum: Rating,
  reviewedAt: Date
): ReviewTransition {
  const empty = createEmptyCard();
  const parsedState = stateEnumMap[currentCard.state] ?? State.New;
  const fsrsCard = {
    ...empty,
    due: currentCard.due ? toDate(currentCard.due) : empty.due,
    stability: typeof currentCard.stability === 'number' ? currentCard.stability : empty.stability,
    difficulty: typeof currentCard.difficulty === 'number' ? currentCard.difficulty : empty.difficulty,
    elapsed_days: currentCard.elapsedDays ?? 0,
    scheduled_days: currentCard.scheduledDays ?? 0,
    reps: currentCard.reps ?? 0,
    lapses: currentCard.lapses ?? 0,
    state: parsedState,
    last_review: currentCard.lastReview ? toDate(currentCard.lastReview) : undefined,
  };

  const recordLog = fsrs.repeat(fsrsCard, reviewedAt);
  const item = (recordLog as any)[ratingEnum];
  if (!item?.card || !item?.log) {
    throw new ReviewServiceError('FSRS_TRANSITION_FAILED', 'FSRS did not return a transition.', 500);
  }

  const nextCard = item.card;
  const logItem = item.log;
  const state = stateStringMap[nextCard.state] || 'Learning';

  // Keep the existing production behavior: Review cards are never scheduled below one day.
  let scheduledDays = nextCard.scheduled_days;
  let due = nextCard.due;
  if (nextCard.state === State.Review && scheduledDays < 1.0) {
    scheduledDays = 1;
    due = new Date(reviewedAt.getTime() + 86_400_000);
  }

  return {
    rating,
    state,
    stability: nextCard.stability,
    difficulty: nextCard.difficulty,
    elapsedDays: logItem.elapsed_days ?? 0,
    lastElapsedDays: logItem.last_elapsed_days ?? 0,
    scheduledDays: Math.round(scheduledDays),
    reps: nextCard.reps,
    lapses: nextCard.lapses,
    due,
  };
}

async function applyReviewInTransaction(tx: any, input: NormalizedReviewInput): Promise<ReviewResult> {
  const duplicate = await tx
    .select()
    .from(reviewLogs)
    .where(eq(reviewLogs.id, input.eventId))
    .limit(1);

  if (duplicate.length > 0) {
    return duplicateToResult(duplicate[0]);
  }

  const currentCard = await requireCard(tx, input.cardId, input.reviewedAt);
  const transition = calculateReviewTransition(
    currentCard,
    input.rating,
    input.ratingEnum,
    input.reviewedAt
  );

  const logRow = buildReviewLog(input, transition);

  // The card snapshot and immutable review event are one atomic mutation.
  await tx
    .update(cards)
    .set({
      stability: transition.stability,
      difficulty: transition.difficulty,
      elapsedDays: transition.elapsedDays,
      scheduledDays: transition.scheduledDays,
      reps: transition.reps,
      lapses: transition.lapses,
      state: transition.state,
      due: transition.due,
      lastReview: input.reviewedAt,
      updatedAt: new Date(),
    })
    .where(eq(cards.id, input.cardId));

  await tx.insert(reviewLogs).values(logRow);

  return transitionToResult(input, transition);
}


function requireCardSync(tx: any, cardId: string, reviewedAt: Date): CardRow {
  const found = tx.select().from(cards).where(eq(cards.id, cardId)).limit(1).all();
  if (found.length > 0) {
    return found[0] as CardRow;
  }

  if (cardId.startsWith('grammar_cloze_') || cardId.startsWith('grammar_rec_')) {
    const patternId = cardId.replace(/^grammar_(?:cloze|rec)_/, '');
    const newCard: typeof cards.$inferInsert = {
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
      due: reviewedAt,
      createdAt: reviewedAt,
      updatedAt: reviewedAt,
    };
    tx.insert(cards).values(newCard).run();
    return newCard as CardRow;
  }

  throw new ReviewServiceError('CARD_NOT_FOUND', `Card with id ${cardId} not found.`, 404);
}

function buildReviewLog(input: NormalizedReviewInput, transition: ReviewTransition): NewReviewLog {
  return {
    id: input.eventId,
    cardId: input.cardId,
    rating: transition.rating,
    state: transition.state,
    due: transition.due,
    stability: transition.stability,
    difficulty: transition.difficulty,
    elapsedDays: transition.elapsedDays,
    lastElapsedDays: transition.lastElapsedDays,
    scheduledDays: transition.scheduledDays,
    reviewTime: input.reviewedAt,
  };
}

function transitionToResult(
  input: NormalizedReviewInput,
  transition: ReviewTransition
): ReviewResult {
  return {
    eventId: input.eventId,
    status: 'applied',
    cardId: input.cardId,
    rating: transition.rating,
    state: transition.state,
    stability: transition.stability,
    difficulty: transition.difficulty,
    scheduledDays: transition.scheduledDays,
    nextReviewDate: transition.due.toISOString(),
  };
}

function applyReviewInSyncTransaction(tx: any, input: NormalizedReviewInput): ReviewResult {
  const duplicate = tx
    .select()
    .from(reviewLogs)
    .where(eq(reviewLogs.id, input.eventId))
    .limit(1)
    .all();

  if (duplicate.length > 0) {
    return duplicateToResult(duplicate[0]);
  }

  const currentCard = requireCardSync(tx, input.cardId, input.reviewedAt);
  const transition = calculateReviewTransition(
    currentCard,
    input.rating,
    input.ratingEnum,
    input.reviewedAt
  );

  tx.update(cards)
    .set({
      stability: transition.stability,
      difficulty: transition.difficulty,
      elapsedDays: transition.elapsedDays,
      scheduledDays: transition.scheduledDays,
      reps: transition.reps,
      lapses: transition.lapses,
      state: transition.state,
      due: transition.due,
      lastReview: input.reviewedAt,
      updatedAt: new Date(),
    })
    .where(eq(cards.id, input.cardId))
    .run();

  tx.insert(reviewLogs).values(buildReviewLog(input, transition)).run();
  return transitionToResult(input, transition);
}

export async function submitReview(input: SubmitReviewInput): Promise<ReviewResult> {
  const normalized = normalizeInput(input);

  if (!TURSO_DATABASE_URL?.trim()) {
    return db.transaction((tx: any) => applyReviewInSyncTransaction(tx, normalized));
  }

  return db.transaction((tx: any) => applyReviewInTransaction(tx, normalized));
}

export async function submitReviewBatch(inputs: SubmitReviewInput[]): Promise<BatchReviewResult[]> {
  if (!Array.isArray(inputs) || inputs.length === 0) {
    throw new ReviewServiceError('EMPTY_BATCH', 'Body must contain a non-empty reviews array.', 400);
  }

  const prepared = inputs.map((input, index) => {
    try {
      return { index, normalized: normalizeInput(input), rejected: null as RejectedReviewResult | null };
    } catch (error) {
      if (!(error instanceof ReviewServiceError)) throw error;
      return {
        index,
        normalized: null,
        rejected: {
          eventId: input.eventId || `invalid_${index}`,
          status: 'rejected' as const,
          cardId: input.cardId || '',
          error: error.code,
        },
      };
    }
  });

  const valid = prepared
    .filter((item) => item.normalized !== null)
    .sort((a, b) => {
      const timeDiff = a.normalized!.reviewedAt.getTime() - b.normalized!.reviewedAt.getTime();
      return timeDiff !== 0 ? timeDiff : a.index - b.index;
    });

  const byIndex = new Map<number, BatchReviewResult>();
  for (const item of prepared) {
    if (item.rejected) byIndex.set(item.index, item.rejected);
  }

  if (valid.length > 0) {
    if (!TURSO_DATABASE_URL?.trim()) {
      db.transaction((tx: any) => {
        for (const item of valid) {
          try {
            byIndex.set(item.index, applyReviewInSyncTransaction(tx, item.normalized!));
          } catch (error) {
            if (error instanceof ReviewServiceError && error.status < 500) {
              byIndex.set(item.index, {
                eventId: item.normalized!.eventId,
                status: 'rejected',
                cardId: item.normalized!.cardId,
                error: error.code,
              });
              continue;
            }
            throw error;
          }
        }
      });
    } else {
      await db.transaction(async (tx: any) => {
        for (const item of valid) {
          try {
            byIndex.set(item.index, await applyReviewInTransaction(tx, item.normalized!));
          } catch (error) {
            if (error instanceof ReviewServiceError && error.status < 500) {
              byIndex.set(item.index, {
                eventId: item.normalized!.eventId,
                status: 'rejected',
                cardId: item.normalized!.cardId,
                error: error.code,
              });
              continue;
            }
            throw error;
          }
        }
      });
    }
  }

  return inputs.map((_, index) => byIndex.get(index)!).filter(Boolean);
}
