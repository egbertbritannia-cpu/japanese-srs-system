/**
 * Script nhập 32 cấu trúc Ngữ pháp và 204 bài tập JPD133 vào Database
 * - Tạo bộ thẻ: "JPD133 - Ngữ pháp Bunbou" trong bảng decks
 * - Nạp 4 bài học vào grammar_lessons
 * - Nạp 32 mẫu câu vào grammar_patterns
 * - Nạp 204 bài tập vào grammar_exercises
 * - Tự động tạo 96 - 128 thẻ FSRS GrammarPattern vào bảng cards
 */

import fs from 'fs';
import path from 'path';

// 1. Nạp file .env trước khi import db
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

import { db } from '../src/db/client';
import { decks, cards, grammarLessons, grammarPatterns, grammarExercises } from '../src/db/schema';
import { patternToCards } from '../src/core/grammar/grammarCardFactory';
import { eq } from 'drizzle-orm';

async function main() {
  const jsonPath = path.resolve(process.cwd(), 'data', 'jpd133_grammar.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ Không tìm thấy data/jpd133_grammar.json! Hãy chạy scripts/build_grammar_seed.py trước.');
    process.exit(1);
  }

  const seedData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log('📖 Đã đọc dữ liệu grammar seed:');
  console.log(`- Lessons: ${seedData.lessons.length}`);
  console.log(`- Patterns: ${seedData.patterns.length}`);
  console.log(`- Exercises: ${seedData.exercises.length}`);

  const now = new Date();

  // 1. Tạo hoặc kiểm tra Deck
  const deckInfo = seedData.deck;
  try {
    const existingDeck = await db.select().from(decks).where(eq(decks.id, deckInfo.id));
    if (!existingDeck || existingDeck.length === 0) {
      await db.insert(decks).values({
        id: deckInfo.id,
        name: deckInfo.name,
        description: deckInfo.description,
        createdAt: now,
      });
      console.log(`✅ Đã tạo deck: ${deckInfo.name}`);
    } else {
      console.log(`ℹ️ Deck ${deckInfo.name} đã tồn tại.`);
    }
  } catch (err: any) {
    console.warn('Cảnh báo khi tạo deck:', err?.message);
  }

  // 2. Nạp Lessons
  console.log('📥 Đang nạp grammar_lessons...');
  for (const lesson of seedData.lessons) {
    try {
      const existing = await db.select().from(grammarLessons).where(eq(grammarLessons.id, lesson.id));
      if (!existing || existing.length === 0) {
        await db.insert(grammarLessons).values({
          id: lesson.id,
          lessonNumber: lesson.lessonNumber,
          titleJa: lesson.titleJa,
          titleVi: lesson.titleVi,
          themeJa: lesson.themeJa || null,
          themeVi: lesson.themeVi || null,
          patternRange: lesson.patternRange,
          patternCount: lesson.patternCount,
          accentColor: lesson.accentColor,
          wagara: lesson.wagara || null,
          inkanChar: lesson.inkanChar || null,
          description: lesson.description,
          sortOrder: lesson.sortOrder,
          createdAt: now,
        });
      }
    } catch (err: any) {
      console.warn(`Lỗi nạp lesson ${lesson.id}:`, err?.message);
    }
  }
  console.log('✅ Đã nạp xong grammar_lessons.');

  // 3. Nạp Patterns
  console.log('📥 Đang nạp grammar_patterns...');
  for (const pattern of seedData.patterns) {
    try {
      const existing = await db.select().from(grammarPatterns).where(eq(grammarPatterns.id, pattern.id));
      if (!existing || existing.length === 0) {
        await db.insert(grammarPatterns).values({
          id: pattern.id,
          lessonId: pattern.lessonId,
          patternNumber: pattern.patternNumber,
          jlptLevel: pattern.jlptLevel,
          difficultyScore: pattern.difficultyScore,
          patternTemplate: pattern.patternTemplate,
          structureSlots: JSON.stringify(pattern.structureSlots),
          meaningVi: pattern.meaningVi,
          meaningJa: pattern.meaningJa || null,
          usageNote: pattern.usageNote || null,
          examples: JSON.stringify(pattern.examples),
          verbTypes: JSON.stringify(pattern.verbTypes || []),
          relatedPatternIds: JSON.stringify(pattern.relatedPatternIds || []),
          createdAt: now,
          updatedAt: now,
        });
      }
    } catch (err: any) {
      console.warn(`Lỗi nạp pattern ${pattern.id}:`, err?.message);
    }
  }
  console.log('✅ Đã nạp xong grammar_patterns.');

  // 4. Nạp Exercises
  console.log('📥 Đang nạp grammar_exercises (204 bài tập)...');
  let exCount = 0;
  for (const ex of seedData.exercises) {
    try {
      const existing = await db.select().from(grammarExercises).where(eq(grammarExercises.id, ex.id));
      if (!existing || existing.length === 0) {
        await db.insert(grammarExercises).values({
          id: ex.id,
          patternId: ex.patternId,
          exerciseType: ex.exerciseType,
          difficulty: ex.difficulty,
          sentenceWithCloze: ex.sentenceWithCloze || null,
          question: ex.question || null,
          optionA: ex.optionA || null,
          optionB: ex.optionB || null,
          optionC: ex.optionC || null,
          optionD: ex.optionD || null,
          correctOption: ex.correctOption || null,
          promptText: ex.promptText || null,
          answerText: ex.answerText,
          alternateAnswers: JSON.stringify(ex.alternateAnswers || []),
          explanationVi: ex.explanationVi || null,
          explanationJa: ex.explanationJa || null,
          sourceRef: ex.sourceRef || null,
          sortOrder: ex.sortOrder,
          createdAt: now,
        });
        exCount++;
      }
    } catch (err: any) {
      console.warn(`Lỗi nạp exercise ${ex.id}:`, err?.message);
    }
  }
  console.log(`✅ Đã nạp xong ${exCount} bài tập mới vào grammar_exercises.`);

  // 5. Tự động sinh Flashcards vào bảng cards cho FSRS
  console.log('🃏 Đang sinh thẻ FSRS cho toàn bộ grammar patterns...');
  let cardCount = 0;
  for (const pattern of seedData.patterns) {
    const patternCards = patternToCards(pattern as any, deckInfo.id);
    for (const card of patternCards) {
      try {
        const existingCard = await db.select().from(cards).where(eq(cards.id, card.id));
        if (!existingCard || existingCard.length === 0) {
          await db.insert(cards).values({
            id: card.id,
            deckId: card.deckId,
            type: card.type,
            front: card.front,
            reading: card.reading,
            meaning: card.meaning,
            sentence: card.sentence,
            tags: card.tags,
            stability: card.stability,
            difficulty: card.difficulty,
            elapsedDays: card.elapsedDays,
            scheduledDays: card.scheduledDays,
            reps: card.reps,
            lapses: card.lapses,
            state: card.state,
            due: card.due,
            createdAt: card.createdAt,
            updatedAt: card.updatedAt,
          });
          cardCount++;
        }
      } catch (err: any) {
        console.warn(`Lỗi tạo card ${card.id}:`, err?.message);
      }
    }
  }
  console.log(`🎉 Đã sinh và nạp thành công ${cardCount} thẻ ngữ pháp vào bảng cards!`);
  console.log('✨ HOÀN TẤT QUÁ TRÌNH IMPORT GRAMMAR JPD133!');
}

main().catch(err => {
  console.error('Fatal error during grammar import:', err);
  process.exit(1);
});
