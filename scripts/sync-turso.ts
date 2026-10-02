import { createClient } from '@libsql/client';
import { DatabaseSync } from 'node:sqlite';
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

  // Tự động chuyển đổi sang https:// để tránh lỗi timeout/hang do WebSocket
  const url = rawUrl.replace(/^libsql:\/\//, 'https://');
  console.log(`🚀 Đang kết nối tới Turso Cloud via HTTPS: ${url}`);

  const turso = createClient({ url, authToken });

  // 2. Đọc dữ liệu từ SQLite cục bộ data/app.db
  const dbPath = path.resolve(process.cwd(), 'data', 'app.db');
  if (!fs.existsSync(dbPath)) {
    console.error('❌ Không tìm thấy data/app.db!');
    process.exit(1);
  }

  const localSqlite = new DatabaseSync(dbPath);
  const localDecks = localSqlite.prepare('SELECT * FROM decks').all() as any[];
  const localCards = localSqlite.prepare('SELECT * FROM cards').all() as any[];

  console.log(`📦 Tìm thấy ${localDecks.length} decks và ${localCards.length} cards trong data/app.db cục bộ.`);

  // 3. Đồng bộ Decks sang Turso
  console.log('🔄 Đang đồng bộ Decks sang Turso Cloud...');
  for (const deck of localDecks) {
    await turso.execute({
      sql: `INSERT OR REPLACE INTO decks (id, name, description, created_at)
            VALUES (?, ?, ?, ?)`,
      args: [deck.id, deck.name, deck.description, deck.created_at],
    });
  }
  console.log(`✅ Đã đồng bộ thành công ${localDecks.length} decks sang Turso!`);

  // 4. Đồng bộ Cards sang Turso theo batch
  console.log(`🔄 Đang đồng bộ ${localCards.length} thẻ học sang Turso Cloud...`);
  const batchSize = 50;
  for (let i = 0; i < localCards.length; i += batchSize) {
    const chunk = localCards.slice(i, i + batchSize);
    const statements = chunk.map((c) => ({
      sql: `INSERT OR REPLACE INTO cards (
        id, deck_id, type, front, reading, meaning, pitch, sentence, audio_url, tags,
        stability, difficulty, elapsed_days, scheduled_days, reps, lapses, state, due, last_review, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        c.id, c.deck_id, c.type, c.front, c.reading, c.meaning, c.pitch, c.sentence, c.audio_url, c.tags,
        c.stability, c.difficulty, c.elapsed_days, c.scheduled_days, c.reps, c.lapses, c.state, c.due, c.last_review, c.created_at, c.updated_at
      ],
    }));

    await turso.batch(statements, 'write');
    console.log(`  -> Đã tải lên ${Math.min(i + batchSize, localCards.length)} / ${localCards.length} thẻ...`);
  }

  // 5. Kiểm tra lại số lượng trên Turso
  const verifyDecks = await turso.execute('SELECT count(*) as cnt FROM decks;');
  const verifyCards = await turso.execute('SELECT count(*) as cnt FROM cards;');

  console.log('\n🎉 ĐỒNG BỘ THÀNH CÔNG LÊN TURSO CLOUD:');
  console.log(`- Tổng số Decks trên Turso: ${verifyDecks.rows[0].cnt}`);
  console.log(`- Tổng số Cards trên Turso: ${verifyCards.rows[0].cnt}`);
}

main().catch((err) => {
  console.error('❌ Lỗi đồng bộ sang Turso:', err);
  process.exit(1);
});
