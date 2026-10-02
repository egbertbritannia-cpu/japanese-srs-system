/**
 * Định nghĩa các loại thẻ học tiếng Nhật
 * Phục vụ các hình thức học: Cloze (điền từ), Kanji (bộ thủ/nghĩa), Pitch (cao độ âm thanh)
 */

export type CardType = 'Kanji' | 'Vocab' | 'Cloze' | 'Pitch';

export interface BaseCard {
  id: string;
  type: CardType;
  deckId: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface KanjiCard extends BaseCard {
  type: 'Kanji';
  kanji: string;
  onyomi: string[];
  kunyomi: string[];
  meanings: string[];
  radicals: string[]; // Các bộ thủ cấu thành
  strokeCount: number;
}

export interface VocabCard extends BaseCard {
  type: 'Vocab';
  word: string;
  reading: string; // Furigana/Hiragana
  meaning: string;
  pitchAccent?: string;
  audioUrl?: string; // Phục vụ Dual Coding
  contextSentence?: string;
  contextTranslation?: string;
}

export interface ClozeCard extends BaseCard {
  type: 'Cloze';
  sentence: string; // Ví dụ: "毎日日本語を{{c1::勉強}}します。"
  clozeAnswer: string;
  hint?: string;
  explanation?: string;
}

export interface PitchCard extends BaseCard {
  type: 'Pitch';
  word: string;
  reading: string;
  pitchPattern: 'Heiban' | 'Atamadaka' | 'Nakadaka' | 'Odaka';
  pitchNumber: number; // 0, 1, 2, ...
  audioSample?: string;
}

export type Flashcard = KanjiCard | VocabCard | ClozeCard | PitchCard;
