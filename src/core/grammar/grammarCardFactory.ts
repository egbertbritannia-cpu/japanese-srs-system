/**
 * Grammar Card Factory (Free Spaced Repetition Scheduler - FSRS Integration)
 * Biến đổi các mẫu câu ngữ pháp thành thẻ học SRS tuân thủ nguyên tắc Atomicity.
 */

import { GrammarPattern, GrammarExercise } from './grammar.types';

export interface GeneratedGrammarCard {
  id: string;
  deckId: string;
  type: 'GrammarPattern';
  front: string;
  reading: string;
  meaning: string;
  sentence?: string;
  tags: string; // JSON string array
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  state: 'New';
  due: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Biến đổi một GrammarPattern thành danh sách thẻ SRS
 */
export function patternToCards(
  pattern: GrammarPattern,
  deckId: string = 'grammar_jpd133'
): GeneratedGrammarCard[] {
  const cards: GeneratedGrammarCard[] = [];
  const now = new Date();
  const baseTags = JSON.stringify(['grammar', `lesson-${pattern.lessonId}`, pattern.jlptLevel, `G-${pattern.patternNumber}`]);

  // Card 1: Thẻ nhận diện mẫu câu (Recognition Card)
  const primaryExample = pattern.examples[0] || {
    ja: pattern.patternTemplate,
    furigana: pattern.patternTemplate,
    vi: pattern.meaningVi,
    highlight: pattern.patternTemplate,
  };

  cards.push({
    id: `grammar_rec_${pattern.id}`,
    deckId,
    type: 'GrammarPattern',
    front: `【文法 Pattern ${pattern.patternNumber}】\n${pattern.patternTemplate}`,
    reading: pattern.patternTemplate,
    meaning: `${pattern.meaningVi}\n\n💡 Cách dùng: ${pattern.usageNote || 'Mẫu câu sơ cấp JLPT ' + pattern.jlptLevel}`,
    sentence: primaryExample.ja,
    tags: baseTags,
    stability: 0,
    difficulty: pattern.difficultyScore * 1.5,
    elapsedDays: 0,
    scheduledDays: 0,
    reps: 0,
    lapses: 0,
    state: 'New',
    due: now,
    createdAt: now,
    updatedAt: now,
  });

  // Card 2: Thẻ đục lỗ ngữ pháp (Cloze Production Card)
  // Tạo cloze cho từ khoá ngữ pháp trong ví dụ chính
  const targetHighlight = primaryExample.highlight || pattern.patternTemplate.split(' ')[0];
  const clozeSentence = primaryExample.ja.includes(targetHighlight)
    ? primaryExample.ja.replace(targetHighlight, `{{c1::${targetHighlight}}}`)
    : `{{c1::${primaryExample.ja}}}`;

  cards.push({
    id: `grammar_cloze_${pattern.id}`,
    deckId,
    type: 'GrammarPattern',
    front: clozeSentence,
    reading: primaryExample.furigana,
    meaning: `[Dịch]: ${primaryExample.vi}\n[Ý nghĩa mẫu]: ${pattern.meaningVi}`,
    sentence: clozeSentence,
    tags: baseTags,
    stability: 0,
    difficulty: pattern.difficultyScore * 1.8,
    elapsedDays: 0,
    scheduledDays: 0,
    reps: 0,
    lapses: 0,
    state: 'New',
    due: now,
    createdAt: now,
    updatedAt: now,
  });

  // Card 3 & 4 (Nếu có ví dụ thứ 2 trở lên): Mở rộng thêm ngữ cảnh thực chiến
  if (pattern.examples.length > 1) {
    const secondEx = pattern.examples[1];
    const secondHighlight = secondEx.highlight || pattern.patternTemplate.split(' ')[0];
    const secondCloze = secondEx.ja.includes(secondHighlight)
      ? secondEx.ja.replace(secondHighlight, `{{c1::${secondHighlight}}}`)
      : `{{c1::${secondEx.ja}}}`;

    cards.push({
      id: `grammar_app_${pattern.id}_2`,
      deckId,
      type: 'GrammarPattern',
      front: secondCloze,
      reading: secondEx.furigana,
      meaning: `[Dịch]: ${secondEx.vi}\n[Gợi ý]: Pattern ${pattern.patternNumber} (${pattern.meaningVi})`,
      sentence: secondCloze,
      tags: baseTags,
      stability: 0,
      difficulty: pattern.difficultyScore * 1.6,
      elapsedDays: 0,
      scheduledDays: 0,
      reps: 0,
      lapses: 0,
      state: 'New',
      due: now,
      createdAt: now,
      updatedAt: now,
    });
  }

  return cards;
}

/**
 * Biến đổi GrammarExercise thành thẻ bài tập ôn luyện FSRS
 */
export function exerciseToCard(
  exercise: GrammarExercise,
  deckId: string = 'grammar_jpd133'
): GeneratedGrammarCard {
  const now = new Date();
  const frontText = exercise.sentenceWithCloze || exercise.question || exercise.promptText || 'Bài tập ngữ pháp';
  
  return {
    id: `grammar_ex_${exercise.id}`,
    deckId,
    type: 'GrammarPattern',
    front: frontText,
    reading: exercise.answerText,
    meaning: `[Đáp án đúng]: ${exercise.answerText}\n\n[Giải thích]: ${exercise.explanationVi || 'Đúng theo quy tắc ngữ pháp.'}`,
    sentence: frontText,
    tags: JSON.stringify(['grammar_exercise', exercise.exerciseType, `P-${exercise.patternId}`]),
    stability: 0,
    difficulty: exercise.difficulty * 1.5,
    elapsedDays: 0,
    scheduledDays: 0,
    reps: 0,
    lapses: 0,
    state: 'New',
    due: now,
    createdAt: now,
    updatedAt: now,
  };
}
