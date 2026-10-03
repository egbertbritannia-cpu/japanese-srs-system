import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

// 1. Nạp file .env
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

async function main() {
  const rawUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!rawUrl) {
    console.error('❌ Chưa cấu hình TURSO_DATABASE_URL trong .env!');
    process.exit(1);
  }

  const url = rawUrl.replace(/^libsql:\/\//, 'https://');
  console.log(`🚀 Đang kết nối tới Turso Cloud via HTTPS: ${url}`);

  const turso = createClient({ url, authToken });

  // 1. Chạy DDL migration tạo bảng trên Turso
  console.log('📋 Đang khởi tạo bảng Grammar trên Turso Cloud...');
  const migrationSql = fs.readFileSync(
    path.resolve(process.cwd(), 'src', 'db', 'migrations', '0003_grammar_tables.sql'),
    'utf-8'
  );

  // Remove SQL comments and split statements
  const cleanSql = migrationSql.replace(/--.*$/gm, '');
  const statements = cleanSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const stmt of statements) {
    try {
      console.log(`Executing DDL: ${stmt.slice(0, 40)}...`);
      await turso.execute(stmt);
    } catch (e: any) {
      console.error('LỖI DDL:', stmt, e?.message);
      throw e;
    }
  }
  console.log('✅ Bảng và chỉ mục Grammar đã sẵn sàng trên Turso Cloud!');

  // 2. Đọc dữ liệu từ data/jpd133_grammar.json
  const jsonPath = path.resolve(process.cwd(), 'data', 'jpd133_grammar.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ Không tìm thấy data/jpd133_grammar.json!');
    process.exit(1);
  }

  const seedData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const now = Date.now();

  // 3. Đồng bộ Deck
  console.log('🔄 Đang đồng bộ Deck sang Turso...');
  await turso.execute({
    sql: `INSERT OR REPLACE INTO decks (id, name, description, created_at) VALUES (?, ?, ?, ?)`,
    args: [seedData.deck.id, seedData.deck.name, seedData.deck.description, now],
  });
  console.log('✅ Đã đồng bộ Deck sang Turso.');

  // 4. Đồng bộ Lessons
  console.log('🔄 Đang đồng bộ Lessons sang Turso...');
  for (const l of seedData.lessons) {
    await turso.execute({
      sql: `INSERT OR REPLACE INTO grammar_lessons (id, lesson_number, title_ja, title_vi, theme_ja, theme_vi, pattern_range, pattern_count, accent_color, wagara, inkan_char, description, sort_order, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [l.id, l.lessonNumber, l.titleJa, l.titleVi, l.themeJa || null, l.themeVi || null, l.patternRange, l.patternCount, l.accentColor, l.wagara || null, l.inkanChar || null, l.description, l.sortOrder, now],
    });
  }
  console.log(`✅ Đã đồng bộ ${seedData.lessons.length} lessons sang Turso.`);

  // 5. Đồng bộ Patterns
  console.log('🔄 Đang đồng bộ 32 Patterns sang Turso...');
  for (const p of seedData.patterns) {
    await turso.execute({
      sql: `INSERT OR REPLACE INTO grammar_patterns (id, lesson_id, pattern_number, jlpt_level, difficulty_score, pattern_template, structure_slots, meaning_vi, meaning_ja, usage_note, examples, verb_types, related_pattern_ids, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        p.id, p.lessonId, p.patternNumber, p.jlptLevel, p.difficultyScore,
        p.patternTemplate, JSON.stringify(p.structureSlots), p.meaningVi,
        p.meaningJa || null, p.usageNote || null, JSON.stringify(p.examples),
        JSON.stringify(p.verbTypes || []), JSON.stringify(p.relatedPatternIds || []),
        now, now
      ],
    });
  }
  console.log(`✅ Đã đồng bộ ${seedData.patterns.length} patterns sang Turso.`);

  // 6. Đồng bộ Exercises theo batch
  console.log('🔄 Đang đồng bộ 204 Exercises sang Turso...');
  const BATCH_SIZE = 20;
  for (let i = 0; i < seedData.exercises.length; i += BATCH_SIZE) {
    const batch = seedData.exercises.slice(i, i + BATCH_SIZE);
    const batchQueries = batch.map((ex: any) => ({
      sql: `INSERT OR REPLACE INTO grammar_exercises (id, pattern_id, exercise_type, difficulty, sentence_with_cloze, question, option_a, option_b, option_c, option_d, correct_option, prompt_text, answer_text, alternate_answers, explanation_vi, explanation_ja, source_ref, sort_order, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        ex.id, ex.patternId, ex.exerciseType, ex.difficulty,
        ex.sentenceWithCloze || null, ex.question || null,
        ex.optionA || null, ex.optionB || null, ex.optionC || null, ex.optionD || null,
        ex.correctOption || null, ex.promptText || null, ex.answerText,
        JSON.stringify(ex.alternateAnswers || []), ex.explanationVi || null,
        ex.explanationJa || null, ex.sourceRef || null, ex.sortOrder, now
      ],
    }));
    await turso.batch(batchQueries, 'write');
  }
  console.log(`✅ Đã đồng bộ ${seedData.exercises.length} exercises sang Turso.`);

  // 7. Đồng bộ Cards từ SQLite sang Turso
  const { DatabaseSync } = await import('node:sqlite');
  const dbPath = path.resolve(process.cwd(), 'data', 'app.db');
  const localSqlite = new DatabaseSync(dbPath);
  const grammarCards = localSqlite.prepare("SELECT * FROM cards WHERE deck_id = 'grammar_jpd133'").all() as any[];

  console.log(`🔄 Đang đồng bộ ${grammarCards.length} grammar cards sang Turso...`);
  for (let i = 0; i < grammarCards.length; i += BATCH_SIZE) {
    const batch = grammarCards.slice(i, i + BATCH_SIZE);
    const batchQueries = batch.map((card: any) => ({
      sql: `INSERT OR REPLACE INTO cards (id, deck_id, type, front, reading, meaning, pitch, sentence, audio_url, tags, stability, difficulty, elapsed_days, scheduled_days, reps, lapses, state, due, last_review, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        card.id, card.deck_id, card.type, card.front, card.reading || null,
        card.meaning, card.pitch || null, card.sentence || null, card.audio_url || null,
        card.tags || null, card.stability, card.difficulty, card.elapsed_days,
        card.scheduled_days, card.reps, card.lapses, card.state, card.due,
        card.last_review || null, card.created_at, card.updated_at
      ],
    }));
    await turso.batch(batchQueries, 'write');
  }
  console.log(`🎉 ĐỒNG BỘ THÀNH CÔNG ${grammarCards.length} THẺ NGỮ PHÁP LÊN TURSO CLOUD!`);
}

main().catch(err => {
  console.error('Lỗi đồng bộ Turso:', err);
  process.exit(1);
});
