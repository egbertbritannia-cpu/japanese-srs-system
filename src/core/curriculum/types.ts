// Location: src/core/curriculum/types.ts
// COMPILE-TIME CURRICULUM TYPE CONTRACTS (PHASE 11 - ZERO DB REGRESSION)

export type JPD133SlotId = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 'bonus';

export interface JPD133VocabItem {
  id: string;                         // e.g. "jpd133-s1-v01"
  kanji: string;                      // Headword (e.g. "両親")
  reading: string;                    // Hiragana furigana (e.g. "りょうしん")
  romaji: string;                     // Phonetic romanization (e.g. "ryoushin")
  hanViet: string;                    // Sino-Vietnamese reading (e.g. "Lưỡng Thân")
  vietnameseMeaning: string;          // Primary pedagogical definition
  wordClass: 'noun' | 'verb-g1' | 'verb-g2' | 'verb-g3' | 'adj-i' | 'adj-na' | 'adverb' | 'counter' | 'expression';
  contextSentenceJa: string;          // Full Japanese example sentence
  contextSentenceVn: string;          // Authentic Vietnamese translation
  vietnameseLearnerPitfall: string;   // Forensic error warning
  collocations: string[];             // Common collocations & fixed expressions
  fsrsMemoryHook: string;             // Cognitive mnemonic hook
  dbCardId?: string | number;         // Optional soft-link to Turso DB cards table
}

export interface JPD133GrammarItem {
  id: string;                         // e.g. "jpd133-s1-g01"
  patternTitle: string;               // e.g. "N が います / あります"
  syntacticFormula: string;           // Syntactic formula
  pedagogicalRationale: string;       // Deep explanation of grammar nuance
  contextExamples: Array<{
    sentenceJa: string;
    sentenceVn: string;
    nuanceNote?: string;
  }>;
  vietnameseLearnerPitfalls: string[];// Common grammatical mistakes
  examTrapWarnings: string[];         // Multiple-choice test traps
}

export interface JPD133KanjiItem {
  id: string;                         // e.g. "jpd133-s1-k01"
  kanji: string;                      // Single character (e.g. "家")
  hanViet: string;                    // Sino-Vietnamese reading (e.g. "Gia")
  radical: string;                    // Radical name & character (e.g. "宀 (Miên - Mái nhà)")
  strokeCount: number;                // Number of strokes (e.g. 10)
  onyomi: string[];                   // Chinese-derived readings (e.g. ["カ", "ケ"])
  kunyomi: string[];                  // Native Japanese readings (e.g. ["いえ", "うち"])
  strokeOrderMnemonic: string;        // Visual memory story
  compounds: Array<{
    word: string;
    reading: string;
    hanViet: string;
    meaning: string;
  }>;
  examReadingTraps: string[];         // Misreadings in tests
}

export interface JPD133DialogueItem {
  id: string;
  scenarioTitle: string;
  characters: string[];
  lines: Array<{
    speaker: string;
    japanese: string;
    furigana?: string;
    vietnamese: string;
  }>;
  culturalNote?: string;
}

export interface JPD133PracticeQuestion {
  id: string;
  questionJa: string;
  options: string[];
  correctIndex: number;
  explanationVn: string;
}

export interface JPD133SlotDefinition {
  slotId: JPD133SlotId;
  slotNumber: number;                 // e.g. 1, 2, 3, 4, 5, 6, 8, 10
  titleEn: string;                    // e.g. "Family Relationships & Residence Status"
  titleVn: string;                    // e.g. "Gia Đình, Tình Trạng Hôn Nhân & Cư Trú"
  syllabusFocus: string;              // e.g. "Minna no Nihongo Lessons 1, 9, 14 · Dekiru 4"
  curriculumWeek: string;             // e.g. "Tuần 1 - 2"
  pedagogicalObjectives: string[];
  vocabularyList: JPD133VocabItem[];
  grammarList: JPD133GrammarItem[];
  kanjiList: JPD133KanjiItem[];
  dialogueList?: JPD133DialogueItem[];
  practiceQuestions?: JPD133PracticeQuestion[];
}

export interface JPD133CurriculumManifest {
  curriculumCode: 'JPD133';
  curriculumTitle: 'Elementary Japanese 1-A1.2 (Semester 5)';
  institution: 'FPT University';
  totalSlots: number;
  slots: Record<string, JPD133SlotDefinition>;
}
