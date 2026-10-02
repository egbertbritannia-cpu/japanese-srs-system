/**
 * Script Ngày 1: Khởi tạo bảng cards và review_logs lên cơ sở dữ liệu Turso
 * 
 * Cách sử dụng:
 * 1. Đặt biến môi trường trong file .env:
 *    TURSO_DATABASE_URL=libsql://japanese-srs-db-<org>.turso.io
 *    TURSO_AUTH_TOKEN=<your-turso-token>
 * 
 * 2. Chạy:
 *    npx tsx scripts/init-turso.ts
 */

import { createClient } from '@libsql/client';

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    console.error('❌ Lỗi: Chưa thiết lập biến môi trường TURSO_DATABASE_URL!');
    console.log('Ví dụ: TURSO_DATABASE_URL=libsql://japanese-srs-db-user.turso.io');
    process.exit(1);
  }

  console.log(`🚀 Đang kết nối tới cơ sở dữ liệu Turso: ${url}...`);

  const client = createClient({
    url,
    authToken,
  });

  const schemaStatements = [
    `CREATE TABLE IF NOT EXISTS decks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      created_at INTEGER NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY,
      deck_id TEXT NOT NULL,
      type TEXT NOT NULL,
      front TEXT NOT NULL,
      reading TEXT,
      meaning TEXT NOT NULL,
      pitch TEXT,
      sentence TEXT,
      audio_url TEXT,
      tags TEXT,
      stability REAL DEFAULT 0 NOT NULL,
      difficulty REAL DEFAULT 0 NOT NULL,
      elapsed_days INTEGER DEFAULT 0 NOT NULL,
      scheduled_days INTEGER DEFAULT 0 NOT NULL,
      reps INTEGER DEFAULT 0 NOT NULL,
      lapses INTEGER DEFAULT 0 NOT NULL,
      state TEXT DEFAULT 'New' NOT NULL,
      due INTEGER NOT NULL,
      last_review INTEGER,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS review_logs (
      id TEXT PRIMARY KEY,
      card_id TEXT NOT NULL,
      rating TEXT NOT NULL,
      state TEXT NOT NULL,
      due INTEGER NOT NULL,
      stability REAL NOT NULL,
      difficulty REAL NOT NULL,
      elapsed_days INTEGER NOT NULL,
      last_elapsed_days INTEGER NOT NULL,
      scheduled_days INTEGER NOT NULL,
      review_time INTEGER NOT NULL
    );`,
    `INSERT OR IGNORE INTO decks (id, name, description, created_at)
     VALUES ('default_deck', 'JLPT N5-N4 Core', 'Bộ thẻ từ vựng cốt lõi tiếng Nhật', ${Date.now()});`
  ];

  for (const statement of schemaStatements) {
    await client.execute(statement);
  }

  console.log('✅ Đã tạo thành công các bảng: decks, cards, review_logs trên Turso Cloud!');
}

main().catch((err) => {
  console.error('❌ Thất bại khi tạo bảng trên Turso:', err);
  process.exit(1);
});
