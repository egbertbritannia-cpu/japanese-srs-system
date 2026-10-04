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

  const client = createClient({
    url: url || 'file:./data/local.db',
  });

  const schemaStatements = [
    `CREATE TABLE IF NOT EXISTS grammar_lessons (
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
      sort_order INTEGER DEFAULT 0 NOT NULL,
      created_at INTEGER NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS grammar_patterns (
      id TEXT PRIMARY KEY,
      lesson_id TEXT NOT NULL,
      pattern_number INTEGER NOT NULL,
      jlpt_level TEXT NOT NULL,
      difficulty_score INTEGER DEFAULT 3 NOT NULL,
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
    );`,
    `CREATE TABLE IF NOT EXISTS grammar_exercises (
      id TEXT PRIMARY KEY,
      pattern_id TEXT NOT NULL,
      exercise_type TEXT NOT NULL,
      difficulty INTEGER DEFAULT 2 NOT NULL,
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
      sort_order INTEGER DEFAULT 0 NOT NULL,
      created_at INTEGER NOT NULL
    );`
  ];

  for (const statement of schemaStatements) {
    await client.execute(statement);
  }

  console.log('✅ Đã tạo thành công các bảng grammar_lessons, grammar_patterns, grammar_exercises!');
}

main().catch(console.error);
