-- Migration: Add English IELTS Tracking Engine tables
-- Version: 0004
-- Date: 2026-10-06
-- Safe: ADDITIVE ONLY — Zero Backend Regression (Điều răn 1)

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
