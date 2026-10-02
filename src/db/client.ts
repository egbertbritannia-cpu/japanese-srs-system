import path from 'path';
import fs from 'fs';
import * as schema from './schema';

/**
 * Khởi tạo kết nối Database / Drizzle ORM
 * 
 * - Ngày 1: Chuyển đổi Database & Deploy lên Cloud (Turso):
 *   Nếu có biến môi trường TURSO_DATABASE_URL và TURSO_AUTH_TOKEN, hệ thống tự động kết nối
 *   đến Turso Cloud Database thông qua thư viện @libsql/client.
 * - Môi trường Local: Tự động kết nối file local SQLite (data/app.db) qua better-sqlite3 / node:sqlite.
 */

export const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
export const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

function initSchemaDDL(execFn: (sql: string) => void) {
  execFn(`
    CREATE TABLE IF NOT EXISTS decks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cards (
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
    );

    CREATE TABLE IF NOT EXISTS review_logs (
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
    );
  `);
}

function initDb() {
  // 1. Ngày 1: Kết nối Turso Cloud nếu có cấu hình TURSO_DATABASE_URL
  if (process.env.TURSO_DATABASE_URL) {
    try {
      const { createClient } = require('@libsql/client');
      const { drizzle } = require('drizzle-orm/libsql');

      const client = createClient({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      });

      return drizzle(client, { schema });
    } catch (err: any) {
      console.warn('[Turso Connection Warning] Không thể kết nối Turso, chuyển về Local SQLite:', err?.message);
    }
  }

  // 2. Môi trường Local: Chuẩn bị thư mục dữ liệu cục bộ data/app.db
  const dbDir = path.resolve(process.cwd(), 'data');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  const dbPath = path.resolve(dbDir, 'app.db');

  // Thử better-sqlite3 nếu có native addon
  try {
    const Database = require('better-sqlite3');
    const { drizzle } = require('drizzle-orm/better-sqlite3');
    const sqlite = new Database(dbPath);
    sqlite.pragma('journal_mode = WAL');
    initSchemaDDL((sql) => sqlite.exec(sql));
    return drizzle(sqlite, { schema });
  } catch (err) {
    // Tự động chuyển đổi sang node:sqlite (native Node.js DatabaseSync)
    const { DatabaseSync } = require('node:sqlite');
    const { drizzle } = require('drizzle-orm/sqlite-proxy');
    const sqlite = new DatabaseSync(dbPath);
    sqlite.exec('PRAGMA journal_mode = WAL;');
    initSchemaDDL((sql) => sqlite.exec(sql));

    return drizzle(
      (sql: string, params: any[], method: 'all' | 'get' | 'run') => {
        try {
          if (method === 'all') {
            const rows = sqlite.prepare(sql).all(...params) as Record<string, any>[];
            return { rows: rows.map((r) => Object.values(r)) };
          }
          if (method === 'get') {
            const row = sqlite.prepare(sql).get(...params) as Record<string, any> | undefined;
            return { rows: row ? Object.values(row) : [] };
          }
          sqlite.prepare(sql).run(...params);
          return { rows: [] };
        } catch (queryErr: any) {
          console.error('[SQLite Query Error]', queryErr?.message, 'SQL:', sql);
          throw queryErr;
        }
      },
      { schema }
    );
  }
}

export const db: any = initDb();
export type DB = typeof db;
