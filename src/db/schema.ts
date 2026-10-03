import { sqliteTable, text, integer, real, blob, index } from 'drizzle-orm/sqlite-core';

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
export const cards = sqliteTable(
  'cards',
  {
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
  },
  (table) => ({
    deckIdIdx: index('idx_cards_deck_id').on(table.deckId),
    dueStateIdx: index('idx_cards_due_state').on(table.due, table.state),
    createdAtIdx: index('idx_cards_created_at').on(table.createdAt),
  })
);

// Bảng ReviewLogs (Lịch sử ôn tập để phục vụ huấn luyện lại tham số FSRS)
export const reviewLogs = sqliteTable(
  'review_logs',
  {
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
  },
  (table) => ({
    cardIdIdx: index('idx_review_logs_card_id').on(table.cardId),
  })
);

// ============================================================================
// CÁC BẢNG NÂNG CẤP KHOA HỌC NHẬN THỨC (COGNITIVE ENHANCEMENT TABLES)
// ============================================================================

// 1. Bảng lưu trữ 21 tham số FSRS cá nhân hóa
export const userFsrsParameters = sqliteTable('user_fsrs_parameters', {
  id: text('id').primaryKey(),
  userId: text('user_id').default('default_user').notNull(),
  wParameters: text('w_parameters').notNull(), // JSON string mảng 21 số thực
  sampleSize: integer('sample_size').notNull(),
  rmse: real('rmse').notNull(),
  logLoss: real('log_loss').notNull(),
  optimizedAt: integer('optimized_at', { mode: 'timestamp' }).notNull(),
  isActive: integer('is_active').default(1).notNull(),
});

// 2. Bảng nhúng vector ngữ nghĩa (Semantic Embeddings) cho LECTOR Interleaving
export const cardEmbeddings = sqliteTable('card_embeddings', {
  cardId: text('card_id')
    .primaryKey()
    .references(() => cards.id, { onDelete: 'cascade' }),
  embeddingVector: text('embedding_vector').notNull(), // JSON String hoặc base64 encoded Float32Array
  vectorDimension: integer('vector_dimension').default(384).notNull(),
  modelVersion: text('model_version').default('text-embedding-3-small').notNull(),
  generatedAt: integer('generated_at', { mode: 'timestamp' }).notNull(),
});

// 3. Bảng ghi nhận độ trễ phản xạ truy xuất (Bjork Latency Dynamics)
export const retrievalLatencyLogs = sqliteTable('retrieval_latency_logs', {
  id: text('id').primaryKey(),
  cardId: text('card_id')
    .notNull()
    .references(() => cards.id, { onDelete: 'cascade' }),
  reviewLogId: text('review_log_id').notNull(),
  durationMs: integer('duration_ms').notNull(),
  userGrade: text('user_grade').notNull(), // 'Again' | 'Hard' | 'Good' | 'Easy'
  adjustedGrade: text('adjusted_grade').notNull(),
  penaltyApplied: integer('penalty_applied').default(0).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// 4. Bảng đỉnh đồ thị chữ Hán ngữ nguyên học (KanjiCompass Graph Nodes)
export const kanjiGraphNodes = sqliteTable('kanji_graph_nodes', {
  id: text('id').primaryKey(),
  nodeType: text('node_type').notNull(), // 'target_kanji' | 'phonetic_grapheme' | 'semantic_radical' | 'ideographic_compound'
  character: text('character').notNull(),
  strokeCount: integer('stroke_count').notNull(),
  onyomi: text('onyomi'), // JSON array: '["sai"]'
  kunyomi: text('kunyomi'), // JSON array: '["kiwa"]'
  primaryMeaning: text('primary_meaning').notNull(),
  jlptLevel: text('jlpt_level'), // 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | 'Non-JLPT'
  newspaperFrequencyRank: integer('newspaper_frequency_rank'),
  etymologyExplanation: text('etymology_explanation'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// 5. Bảng cạnh đồ thị liên kết chữ Hán (KanjiCompass Graph Edges)
export const kanjiGraphEdges = sqliteTable('kanji_graph_edges', {
  id: text('id').primaryKey(),
  sourceNodeId: text('source_node_id')
    .notNull()
    .references(() => kanjiGraphNodes.id, { onDelete: 'cascade' }),
  targetNodeId: text('target_node_id')
    .notNull()
    .references(() => kanjiGraphNodes.id, { onDelete: 'cascade' }),
  relationshipType: text('relationship_type').notNull(), // 'HAS_PHONETIC' | 'HAS_RADICAL' | 'SAME_PHONETIC_FAMILY' | 'COMPOSED_OF_SEMANTIC_PARTS'
  weight: real('weight').default(1.0).notNull(),
});

// 6. Bảng tương tác nhận thức bậc cao (Desirable Difficulty Logs)
export const cognitiveInteractionLogs = sqliteTable('cognitive_interaction_logs', {
  id: text('id').primaryKey(),
  cardId: text('card_id')
    .notNull()
    .references(() => cards.id, { onDelete: 'cascade' }),
  interactionType: text('interaction_type').notNull(), // 'generative_cloze' | 'elaborative_interrogation' | 'pitch_discrimination' | 'free_production'
  promptPresented: text('prompt_presented').notNull(),
  learnerResponse: text('learner_response').notNull(),
  isCorrect: integer('is_correct').notNull(),
  evaluatorFeedback: text('evaluator_feedback'),
  latencyMs: integer('latency_ms').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// 7. Bảng cơ chế thưởng nỗ lực nhận thức (Effort-Based Gamification Ledger)
export const gamificationEffortLedger = sqliteTable('gamification_effort_ledger', {
  id: text('id').primaryKey(),
  userId: text('user_id').default('default_user').notNull(),
  sessionId: text('session_id').notNull(),
  focusDurationSeconds: integer('focus_duration_seconds').notNull(),
  isMedAchieved: integer('is_med_achieved').default(0).notNull(),
  highOrderTasksCount: integer('high_order_tasks_count').default(0).notNull(),
  creditsEarned: integer('credits_earned').default(0).notNull(),
  sessionTimestamp: integer('session_timestamp', { mode: 'timestamp' }).notNull(),
});
