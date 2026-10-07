/**
 * Script Ngày 1: Khởi tạo bảng cards và review_logs lên cơ sở dữ liệu Turso
 * 
 * Cách sử dụng:
 * 1. Đặt biến môi trường trong file .env:
 *    TURSO_DATABASE_URL=libsql://japanese-srs-db-<org>.turso.io
 *    TURSO_AUTH_TOKEN=<your-turso-token>
 * 
 * 2. Chạy:
 *    npx tsx scripts/init-turso.ts
 */

import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

// Tự động nạp file .env nếu có
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    console.error('❌ Lỗi: Chưa thiết lập biến môi trường TURSO_DATABASE_URL!');
    console.log('Ví dụ: TURSO_DATABASE_URL=libsql://japanese-srs-db-user.turso.io');
    process.exit(1);
  }

  console.log(`🚀 Đang kết nối tới cơ sở dữ liệu Turso: ${url}...`);

  const client = createClient({
    url,
    authToken,
  });

  const schemaStatements = [
    `CREATE TABLE IF NOT EXISTS decks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      created_at INTEGER NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS cards (
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
    );`,
    `CREATE TABLE IF NOT EXISTS review_logs (
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
    );`,
    `INSERT OR IGNORE INTO decks (id, name, description, created_at)
     VALUES ('default_deck', 'JLPT N5-N4 Core', 'Bộ thẻ từ vựng cốt lõi tiếng Nhật', ${Date.now()});`,
    `CREATE TABLE IF NOT EXISTS eng_materials (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      publisher TEXT,
      year_published INTEGER,
      total_tests INTEGER,
      test_type TEXT NOT NULL DEFAULT 'academic',
      created_at INTEGER NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS ielts_sessions (
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
    );`,
    `CREATE TABLE IF NOT EXISTS ielts_practice_logs (
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
    );`,
    `CREATE TABLE IF NOT EXISTS ielts_mistakes (
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
    );`,
    `CREATE TABLE IF NOT EXISTS eng_vocab (
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
    );`,
    `CREATE INDEX IF NOT EXISTS idx_ielts_sessions_material_id ON ielts_sessions(material_id);`,
    `CREATE INDEX IF NOT EXISTS idx_ielts_practice_logs_session_id ON ielts_practice_logs(session_id);`,
    `CREATE INDEX IF NOT EXISTS idx_ielts_mistakes_log_id ON ielts_mistakes(log_id);`,
    `CREATE INDEX IF NOT EXISTS idx_ielts_mistakes_session_id ON ielts_mistakes(session_id);`,
    `CREATE INDEX IF NOT EXISTS idx_eng_vocab_session_id ON eng_vocab(session_id);`
  ];

  for (const statement of schemaStatements) {
    await client.execute(statement);
  }

  console.log('✅ Đã tạo thành công các bảng: decks, cards, review_logs, eng_materials, ielts_sessions, ielts_practice_logs, ielts_mistakes, eng_vocab trên Turso Cloud!');
}

main().catch((err) => {
  console.error('❌ Thất bại khi tạo bảng trên Turso:', err);
  process.exit(1);
});
