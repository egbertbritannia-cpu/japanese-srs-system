import path from 'path';
import fs from 'fs';
import * as schema from './schema';

/**
 * Khởi tạo kết nối Database / Drizzle ORM
 * 
 * - Ngày 1: Chuyển đổi Database & Deploy lên Cloud (Turso):
 *   Nếu có biến môi trường TURSO_DATABASE_URL và TURSO_AUTH_TOKEN, hệ thống tự động kết nối
 *   đến Turso Cloud Database thông qua thư viện @libsql/client.
 * - Môi trường Local: Tự động kết nối file local SQLite (data/app.db) qua better-sqlite3 / node:sqlite.
 */

export const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
export const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

function initSchemaDDL(execFn: (sql: string) => void) {
  execFn(`
    CREATE TABLE IF NOT EXISTS decks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY,
      deck_id TEXT NOT NULL,
      type TEXT NOT NULL,
      front TEXT NOT NULL,
      reading TEXT,
      meaning TEXT NOT NULL,
      pitch TEXT,
      sentence TEXT,
      audio_url TEXT,
      tags TEXT,
      stability REAL DEFAULT 0 NOT NULL,
      difficulty REAL DEFAULT 0 NOT NULL,
      elapsed_days INTEGER DEFAULT 0 NOT NULL,
      scheduled_days INTEGER DEFAULT 0 NOT NULL,
      reps INTEGER DEFAULT 0 NOT NULL,
      lapses INTEGER DEFAULT 0 NOT NULL,
      state TEXT DEFAULT 'New' NOT NULL,
      due INTEGER NOT NULL,
      last_review INTEGER,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS review_logs (
      id TEXT PRIMARY KEY,
      card_id TEXT NOT NULL,
      rating TEXT NOT NULL,
      state TEXT NOT NULL,
      due INTEGER NOT NULL,
      stability REAL NOT NULL,
      difficulty REAL NOT NULL,
      elapsed_days INTEGER NOT NULL,
      last_elapsed_days INTEGER NOT NULL,
      scheduled_days INTEGER NOT NULL,
      review_time INTEGER NOT NULL
    );

    -- 1. Bảng lưu trữ 21 tham số FSRS cá nhân hóa
    CREATE TABLE IF NOT EXISTS user_fsrs_parameters (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL DEFAULT 'default_user',
      w_parameters TEXT NOT NULL,
      sample_size INTEGER NOT NULL,
      rmse REAL NOT NULL,
      log_loss REAL NOT NULL,
      optimized_at INTEGER NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1
    );

    -- 2. Bảng nhúng vector ngữ nghĩa (Semantic Embeddings) cho LECTOR Interleaving
    CREATE TABLE IF NOT EXISTS card_embeddings (
      card_id TEXT PRIMARY KEY,
      embedding_vector TEXT NOT NULL,
      vector_dimension INTEGER NOT NULL DEFAULT 384,
      model_version TEXT NOT NULL DEFAULT 'text-embedding-3-small',
      generated_at INTEGER NOT NULL,
      FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
    );

    -- 3. Bảng ghi nhận độ trễ phản xạ truy xuất (Bjork Latency Dynamics)
    CREATE TABLE IF NOT EXISTS retrieval_latency_logs (
      id TEXT PRIMARY KEY,
      card_id TEXT NOT NULL,
      review_log_id TEXT NOT NULL,
      duration_ms INTEGER NOT NULL,
      user_grade TEXT NOT NULL,
      adjusted_grade TEXT NOT NULL,
      penalty_applied INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
    );

    -- 4. Bảng đỉnh đồ thị chữ Hán ngữ nguyên học (KanjiCompass Graph Nodes)
    CREATE TABLE IF NOT EXISTS kanji_graph_nodes (
      id TEXT PRIMARY KEY,
      node_type TEXT NOT NULL,
      character TEXT NOT NULL,
      stroke_count INTEGER NOT NULL,
      onyomi TEXT,
      kunyomi TEXT,
      primary_meaning TEXT NOT NULL,
      jlpt_level TEXT,
      newspaper_frequency_rank INTEGER,
      etymology_explanation TEXT,
      created_at INTEGER NOT NULL
    );

    -- 5. Bảng cạnh đồ thị liên kết chữ Hán (KanjiCompass Graph Edges)
    CREATE TABLE IF NOT EXISTS kanji_graph_edges (
      id TEXT PRIMARY KEY,
      source_node_id TEXT NOT NULL,
      target_node_id TEXT NOT NULL,
      relationship_type TEXT NOT NULL,
      weight REAL NOT NULL DEFAULT 1.0,
      FOREIGN KEY (source_node_id) REFERENCES kanji_graph_nodes(id) ON DELETE CASCADE,
      FOREIGN KEY (target_node_id) REFERENCES kanji_graph_nodes(id) ON DELETE CASCADE
    );

    -- 6. Bảng tương tác nhận thức bậc cao (Desirable Difficulty Logs)
    CREATE TABLE IF NOT EXISTS cognitive_interaction_logs (
      id TEXT PRIMARY KEY,
      card_id TEXT NOT NULL,
      interaction_type TEXT NOT NULL,
      prompt_presented TEXT NOT NULL,
      learner_response TEXT NOT NULL,
      is_correct INTEGER NOT NULL,
      evaluator_feedback TEXT,
      latency_ms INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
    );

    -- 7. Bảng cơ chế thưởng nỗ lực nhận thức (Effort-Based Gamification Ledger)
    CREATE TABLE IF NOT EXISTS gamification_effort_ledger (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL DEFAULT 'default_user',
      session_id TEXT NOT NULL,
      focus_duration_seconds INTEGER NOT NULL,
      is_med_achieved INTEGER NOT NULL DEFAULT 0,
      high_order_tasks_count INTEGER NOT NULL DEFAULT 0,
      credits_earned INTEGER NOT NULL DEFAULT 0,
      session_timestamp INTEGER NOT NULL
    );

    -- Chỉ mục tăng tốc độ truy vấn (B-Tree Indexes)
    CREATE INDEX IF NOT EXISTS idx_cards_deck_id ON cards(deck_id);
    CREATE INDEX IF NOT EXISTS idx_cards_due_state ON cards(due, state);
    CREATE INDEX IF NOT EXISTS idx_cards_created_at ON cards(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_review_logs_card_id ON review_logs(card_id);

    -- ========================================================================
    -- 8, 9, 10. HỆ THỐNG HỌC NGỮ PHÁP (GRAMMAR ENGINE TABLES)
    -- ========================================================================
    CREATE TABLE IF NOT EXISTS grammar_lessons (
      id TEXT PRIMARY KEY,
      lesson_number INTEGER NOT NULL,
      title_ja TEXT NOT NULL,
      title_vi TEXT NOT NULL,
      theme_ja TEXT,
      theme_vi TEXT,
      pattern_range TEXT NOT NULL,
      pattern_count INTEGER NOT NULL,
      accent_color TEXT NOT NULL,
      wagara TEXT,
      inkan_char TEXT,
      description TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS grammar_patterns (
      id TEXT PRIMARY KEY,
      lesson_id TEXT NOT NULL,
      pattern_number INTEGER NOT NULL,
      jlpt_level TEXT NOT NULL,
      difficulty_score INTEGER NOT NULL DEFAULT 3,
      pattern_template TEXT NOT NULL,
      structure_slots TEXT NOT NULL,
      meaning_vi TEXT NOT NULL,
      meaning_ja TEXT,
      usage_note TEXT,
      examples TEXT NOT NULL,
      verb_types TEXT,
      related_pattern_ids TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (lesson_id) REFERENCES grammar_lessons(id)
    );

    CREATE INDEX IF NOT EXISTS idx_grammar_patterns_lesson_id ON grammar_patterns(lesson_id);
    CREATE INDEX IF NOT EXISTS idx_grammar_patterns_jlpt ON grammar_patterns(jlpt_level);
    CREATE INDEX IF NOT EXISTS idx_grammar_patterns_num ON grammar_patterns(pattern_number);

    CREATE TABLE IF NOT EXISTS grammar_exercises (
      id TEXT PRIMARY KEY,
      pattern_id TEXT NOT NULL,
      exercise_type TEXT NOT NULL,
      difficulty INTEGER NOT NULL DEFAULT 2,
      sentence_with_cloze TEXT,
      question TEXT,
      option_a TEXT,
      option_b TEXT,
      option_c TEXT,
      option_d TEXT,
      correct_option TEXT,
      prompt_text TEXT,
      answer_text TEXT NOT NULL,
      alternate_answers TEXT,
      explanation_vi TEXT,
      explanation_ja TEXT,
      source_ref TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (pattern_id) REFERENCES grammar_patterns(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_grammar_exercises_pattern_id ON grammar_exercises(pattern_id);
    CREATE INDEX IF NOT EXISTS idx_grammar_exercises_type ON grammar_exercises(exercise_type);

    -- ========================================================================
    -- PHASE 8: ENGLISH IELTS TRACKING ENGINE TABLES
    -- ========================================================================
    CREATE TABLE IF NOT EXISTS eng_materials (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      publisher TEXT,
      year_published INTEGER,
      total_tests INTEGER,
      test_type TEXT NOT NULL DEFAULT 'academic',
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ielts_sessions (
      id TEXT PRIMARY KEY,
      material_id TEXT,
      test_number TEXT,
      test_type TEXT NOT NULL DEFAULT 'academic',
      section TEXT NOT NULL,
      start_time INTEGER NOT NULL,
      end_time INTEGER,
      total_duration_seconds INTEGER,
      raw_score INTEGER,
      max_score INTEGER DEFAULT 40,
      current_score_band REAL,
      target_score_band REAL,
      session_status TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (material_id) REFERENCES eng_materials(id)
    );

    CREATE TABLE IF NOT EXISTS ielts_practice_logs (
      id TEXT PRIMARY KEY,
      session_id TEXT,
      question_number INTEGER NOT NULL,
      question_type TEXT,
      user_answer TEXT,
      correct_answer TEXT,
      is_correct INTEGER,
      time_spent_seconds INTEGER,
      submission_text TEXT,
      audio_url TEXT,
      criteria_scores TEXT,
      notes TEXT,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (session_id) REFERENCES ielts_sessions(id)
    );

    CREATE TABLE IF NOT EXISTS ielts_mistakes (
      id TEXT PRIMARY KEY,
      log_id TEXT,
      session_id TEXT,
      mistake_category TEXT,
      root_cause_analysis TEXT,
      action_plan_for_improvement TEXT,
      is_resolved INTEGER,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (log_id) REFERENCES ielts_practice_logs(id),
      FOREIGN KEY (session_id) REFERENCES ielts_sessions(id)
    );

    CREATE TABLE IF NOT EXISTS eng_vocab (
      id TEXT PRIMARY KEY,
      material_id TEXT,
      session_id TEXT,
      log_id TEXT,
      word TEXT NOT NULL,
      part_of_speech TEXT,
      phonetic TEXT,
      primary_meaning TEXT,
      context_sentence TEXT,
      synonyms TEXT,
      tags TEXT,
      fsrs_stability REAL NOT NULL DEFAULT 0,
      fsrs_difficulty REAL NOT NULL DEFAULT 0,
      fsrs_due INTEGER,
      fsrs_state TEXT NOT NULL DEFAULT 'New',
      reps INTEGER NOT NULL DEFAULT 0,
      lapses INTEGER NOT NULL DEFAULT 0,
      elapsed_days INTEGER NOT NULL DEFAULT 0,
      scheduled_days INTEGER NOT NULL DEFAULT 0,
      last_review INTEGER,
      created_at INTEGER NOT NULL,
      updated_at INTEGER,
      FOREIGN KEY (material_id) REFERENCES eng_materials(id),
      FOREIGN KEY (session_id) REFERENCES ielts_sessions(id),
      FOREIGN KEY (log_id) REFERENCES ielts_practice_logs(id)
    );

    CREATE INDEX IF NOT EXISTS idx_ielts_sessions_material_id ON ielts_sessions(material_id);
    CREATE INDEX IF NOT EXISTS idx_ielts_practice_logs_session_id ON ielts_practice_logs(session_id);
    CREATE INDEX IF NOT EXISTS idx_ielts_mistakes_log_id ON ielts_mistakes(log_id);
    CREATE INDEX IF NOT EXISTS idx_ielts_mistakes_session_id ON ielts_mistakes(session_id);
    CREATE INDEX IF NOT EXISTS idx_eng_vocab_session_id ON eng_vocab(session_id);
  `);
}

function initDb() {
  const rawTursoUrl = process.env.TURSO_DATABASE_URL?.trim();
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN?.trim();

  // 1. Kết nối Turso Cloud nếu có biến môi trường
  if (rawTursoUrl) {
    try {
      const { createClient } = require('@libsql/client');
      const { drizzle } = require('drizzle-orm/libsql');

      // Tự động chuyển đổi giao thức 'libsql://' sang 'https://' để đảm bảo tương thích 100% với môi trường Serverless (Vercel/Lambda)
      const url = rawTursoUrl.startsWith('libsql://')
        ? rawTursoUrl.replace(/^libsql:\/\//, 'https://')
        : rawTursoUrl;

      const client = (globalThis as any).__tursoClient ?? ((globalThis as any).__tursoClient = createClient({
        url,
        authToken: tursoAuthToken,
      }));

      return drizzle(client, { schema });
    } catch (err: any) {
      console.warn('[Turso Connection Warning] Không thể kết nối Turso, chuyển về Local SQLite:', err?.message);
    }
  }

  // Nếu đang chạy trên Serverless (Vercel, AWS Lambda) mà thiếu biến môi trường Turso:
  const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NEXT_RUNTIME === 'edge');
  if (isServerless) {
    console.error('❌ [Database Configuration Error] Đang chạy trên Vercel/Serverless nhưng chưa cấu hình TURSO_DATABASE_URL!');
    const throwMissingEnv = () => {
      throw new Error(
        'Chưa cấu hình TURSO_DATABASE_URL trên Vercel. Vui lòng vào Vercel Dashboard -> Project Settings -> Environment Variables để thêm TURSO_DATABASE_URL và TURSO_AUTH_TOKEN.'
      );
    };
    return {
      select: throwMissingEnv,
      insert: throwMissingEnv,
      update: throwMissingEnv,
      delete: throwMissingEnv,
    } as any;
  }

  // 2. Môi trường Local: Chuẩn bị thư mục dữ liệu cục bộ data/app.db
  const dbDir = path.resolve(process.cwd(), 'data');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  const dbPath = path.resolve(dbDir, 'app.db');

  // Thử better-sqlite3 nếu có native addon
  try {
    const Database = require('better-sqlite3');
    const { drizzle } = require('drizzle-orm/better-sqlite3');
    const sqlite = new Database(dbPath);
    sqlite.pragma('journal_mode = WAL');
    sqlite.pragma('busy_timeout = 5000');
    try {
      initSchemaDDL((sql) => sqlite.exec(sql));
    } catch {
      // Bỏ qua nếu tiến trình khác đang giữ khóa DDL
    }
    return drizzle(sqlite, { schema });
  } catch (err) {
    // Tự động chuyển đổi sang node:sqlite (native Node.js DatabaseSync)
    const { DatabaseSync } = require('node:sqlite');
    const { drizzle } = require('drizzle-orm/sqlite-proxy');
    const sqlite = new DatabaseSync(dbPath);
    try {
      sqlite.exec('PRAGMA busy_timeout = 5000;');
      sqlite.exec('PRAGMA journal_mode = WAL;');
      initSchemaDDL((sql) => sqlite.exec(sql));
    } catch {
      // Bỏ qua an toàn nếu bảng đã được khởi tạo bởi worker khác
    }

    return drizzle(
      (sql: string, params: any[], method: 'all' | 'get' | 'run') => {
        try {
          if (method === 'all') {
            const rows = sqlite.prepare(sql).all(...params) as Record<string, any>[];
            return { rows: rows.map((r) => Object.values(r)) };
          }
          if (method === 'get') {
            const row = sqlite.prepare(sql).get(...params) as Record<string, any> | undefined;
            return { rows: row ? Object.values(row) : [] };
          }
          sqlite.prepare(sql).run(...params);
          return { rows: [] };
        } catch (queryErr: any) {
          console.error('[SQLite Query Error]', queryErr?.message, 'SQL:', sql);
          throw queryErr;
        }
      },
      { schema }
    );
  }
}

export const db: any = (globalThis as any).__drizzleDb ?? ((globalThis as any).__drizzleDb = initDb());
export type DB = typeof db;
