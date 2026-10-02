import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

/**
 * Định nghĩa schema cơ sở dữ liệu SQLite (Drizzle ORM)
 */

// Bảng Decks (Bộ thẻ)
export const decks = sqliteTable('decks', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Bảng Cards (Thẻ học)
export const cards = sqliteTable('cards', {
  id: text('id').primaryKey(),
  deckId: text('deck_id')
    .notNull()
    .references(() => decks.id),
  type: text('type').notNull(), // 'Kanji' | 'Vocab' | 'Cloze' | 'Pitch'
  front: text('front').notNull(),
  reading: text('reading'),
  meaning: text('meaning').notNull(),
  pitch: text('pitch'),
  sentence: text('sentence'),
  audioUrl: text('audio_url'),
  tags: text('tags'), // JSON string array

  // Trạng thái FSRS (DSR)
  stability: real('stability').default(0).notNull(),
  difficulty: real('difficulty').default(0).notNull(),
  elapsedDays: integer('elapsed_days').default(0).notNull(),
  scheduledDays: integer('scheduled_days').default(0).notNull(),
  reps: integer('reps').default(0).notNull(),
  lapses: integer('lapses').default(0).notNull(),
  state: text('state').default('New').notNull(), // 'New' | 'Learning' | 'Review' | 'Relearning'
  due: integer('due', { mode: 'timestamp' }).notNull(),
  lastReview: integer('last_review', { mode: 'timestamp' }),

  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// Bảng ReviewLogs (Lịch sử ôn tập để phục vụ huấn luyện lại tham số FSRS)
export const reviewLogs = sqliteTable('review_logs', {
  id: text('id').primaryKey(),
  cardId: text('card_id')
    .notNull()
    .references(() => cards.id),
  rating: text('rating').notNull(), // 'Again' | 'Hard' | 'Good' | 'Easy'
  state: text('state').notNull(),
  due: integer('due', { mode: 'timestamp' }).notNull(),
  stability: real('stability').notNull(),
  difficulty: real('difficulty').notNull(),
  elapsedDays: integer('elapsed_days').notNull(),
  lastElapsedDays: integer('last_elapsed_days').notNull(),
  scheduledDays: integer('scheduled_days').notNull(),
  reviewTime: integer('review_time', { mode: 'timestamp' }).notNull(),
});
