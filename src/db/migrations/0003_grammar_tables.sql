-- Migration: Add Grammar Engine tables
-- Version: 0003
-- Date: 2026-10-03
-- Safe: ADDITIVE ONLY — Zero Backend Regression

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
  lesson_id TEXT NOT NULL REFERENCES grammar_lessons(id),
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
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_grammar_patterns_lesson_id ON grammar_patterns(lesson_id);
CREATE INDEX IF NOT EXISTS idx_grammar_patterns_jlpt ON grammar_patterns(jlpt_level);
CREATE INDEX IF NOT EXISTS idx_grammar_patterns_num ON grammar_patterns(pattern_number);

CREATE TABLE IF NOT EXISTS grammar_exercises (
  id TEXT PRIMARY KEY,
  pattern_id TEXT NOT NULL REFERENCES grammar_patterns(id) ON DELETE CASCADE,
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
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_grammar_exercises_pattern_id ON grammar_exercises(pattern_id);
CREATE INDEX IF NOT EXISTS idx_grammar_exercises_type ON grammar_exercises(exercise_type);
