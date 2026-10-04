import { db } from '../src/db/client';
import { grammarLessons, grammarPatterns, grammarExercises } from '../src/db/schema';
import fs from 'fs';
import path from 'path';

// 1. Tự động nạp file .env trước khi import db client
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
  const client = db;
  const now = new Date();

  await db.insert(grammarLessons).values({
    id: 'lesson_8',
    lessonNumber: 8,
    titleJa: '第8課',
    titleVi: 'Bài 8',
    themeJa: 'テーマ',
    themeVi: 'Chủ đề',
    patternRange: '72-103',
    patternCount: 32,
    accentColor: '#123456',
    description: 'Bài 8',
    createdAt: now,
  }).onConflictDoNothing();

  await db.insert(grammarPatterns).values({
    id: 'pattern_1',
    lessonId: 'lesson_8',
    patternNumber: 72,
    jlptLevel: 'N4',
    patternTemplate: 'Template',
    structureSlots: '[]',
    meaningVi: 'Ý nghĩa',
    examples: '[]',
    createdAt: now,
    updatedAt: now,
  }).onConflictDoNothing();

  console.log('✅ Created grammar lessons');
}

main().catch(console.error);
