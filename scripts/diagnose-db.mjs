import fs from 'fs';
import { createClient } from '@libsql/client';

async function main() {
  const envContent = fs.readFileSync('.env', 'utf8');
  const urlMatch = envContent.match(/TURSO_DATABASE_URL=(.*)/);
  const tokenMatch = envContent.match(/TURSO_AUTH_TOKEN=(.*)/);

  const url = urlMatch ? urlMatch[1].trim() : '';
  const authToken = tokenMatch ? tokenMatch[1].trim() : '';

  console.log('--- 1. KIỂM TRA KẾT NỐI TURSO CLOUD ---');
  console.log('URL:', url);

  try {
    const client = createClient({ url, authToken });
    const tablesRes = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
    const tables = tablesRes.rows.map((r) => r.name);
    console.log('Turso Cloud Tables:', tables);

    for (const t of tables) {
      if (t.startsWith('_libsql')) continue;
      const countRes = await client.execute(`SELECT COUNT(*) as cnt FROM ${t}`);
      console.log(`  - Bảng ${t}: ${countRes.rows[0].cnt} dòng`);
      if (t === 'cards' || t === 'decks') {
        const sample = await client.execute(`SELECT * FROM ${t} LIMIT 3`);
        console.log(`    Sample ${t}:`, sample.rows);
      }
    }
  } catch (err) {
    console.error('Lỗi kết nối Turso Cloud:', err);
  }

  console.log('\n--- 2. KIỂM TRA SQLITE CỤC BỘ (LOCAL SQLITE) ---');
  const localDbFiles = fs.readdirSync('.').filter(f => f.endsWith('.db') || f.endsWith('.sqlite'));
  console.log('Local DB files:', localDbFiles);
  for (const f of localDbFiles) {
    try {
      const stats = fs.statSync(f);
      console.log(`File: ${f} (${stats.size} bytes)`);
    } catch {}
  }
}

main();
