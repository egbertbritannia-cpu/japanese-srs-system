/**
 * Hằng số dùng chung trong toàn hệ thống (Shared Constants)
 */

export const FSRS_DEFAULT_RETENTION = 0.9; // 90%
export const FSRS_DEFAULT_WEIGHTS = [
  0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01, 1.49, 0.14, 0.94, 2.18, 0.05, 0.34, 1.26, 0.29, 2.61
];

export const JLPT_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'] as const;

export const PITCH_PATTERNS = {
  HEIBAN: 'Heiban', // [0]
  ATAMADAKA: 'Atamadaka', // [1]
  NAKADAKA: 'Nakadaka', // [2..]
  ODAKA: 'Odaka', // [n]
} as const;

export const APP_CONFIG = {
  MAX_DAILY_NEW_CARDS: 20,
  MAX_DAILY_REVIEWS: 200,
};
