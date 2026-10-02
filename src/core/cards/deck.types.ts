/**
 * Định nghĩa Type & Interface cho Quản lý Bộ thẻ & Phiên Ôn tập SRS (Deck & Session Types)
 */

export interface DeckSummaryDTO {
  id: string;
  name: string;
  description?: string;
  totalCards: number;
  dueCards: number;
  newCards: number;
  learnedCards: number;
}

export interface ReviewSessionConfigDTO {
  deckId: string; // 'all' | deck_id cụ thể
  deckName: string;
  mode: 'fsrs_due' | 'cram_all';
  totalQueueLength: number;
}

export interface DeckSessionResultDTO {
  deckId: string;
  deckName: string;
  totalReviewed: number;
  againCount: number;
  hardCount: number;
  goodCount: number;
  easyCount: number;
  retentionRateScore: number; // Tỉ lệ phần trăm Good + Easy
}

export interface ReviewCardItem {
  id: string;
  kanji: string;
  reading?: string;
  meaning: string;
  pitch?: string;
  type: string;
  deckId: string;
  deckName?: string;
  sentence?: string;
  sentenceMeaning?: string;
  due?: string | Date;
  state?: string;
  stability?: number;
  difficulty?: number;
}
