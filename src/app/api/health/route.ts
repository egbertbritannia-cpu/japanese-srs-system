import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { decks, cards } from '@/db/schema';

/**
 * Health & Diagnostic API
 * Endpoint kiểm tra kết nối Database & Trạng thái Biến môi trường trên Deploy
 * URL: /api/health
 */
export async function GET() {
  const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
  const tursoToken = process.env.TURSO_AUTH_TOKEN?.trim();
  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const llmModel = process.env.LLM_MODEL || 'gpt-4o-mini';
  const isVercel = !!process.env.VERCEL;

  let dbStatus = 'disconnected';
  let dbError = null;
  let totalDecks = 0;
  let totalCards = 0;
  const start = Date.now();

  try {
    const decksResult = await db.select().from(decks);
    const cardsResult = await db.select().from(cards);
    totalDecks = decksResult.length;
    totalCards = cardsResult.length;
    dbStatus = 'connected';
  } catch (err: any) {
    dbError = err?.message || 'Không thể truy vấn cơ sở dữ liệu';
  }

  const latencyMs = Date.now() - start;

  const diagnostics = {
    timestamp: new Date().toISOString(),
    status: dbStatus === 'connected' ? 'healthy' : 'degraded',
    environment: {
      platform: isVercel ? 'Vercel Serverless' : 'Local / Custom Server',
      nodeEnv: process.env.NODE_ENV || 'development',
      TURSO_DATABASE_URL: tursoUrl
        ? `Configured (${tursoUrl.replace(/(libsql|https):\/\/([^.]+)\..*/, '$1://$2...')})`
        : 'MISSING ❌ (Cần thêm vào Vercel Environment Variables)',
      TURSO_AUTH_TOKEN: tursoToken
        ? `Configured (${tursoToken.slice(0, 8)}... length: ${tursoToken.length})`
        : 'MISSING ❌ (Cần thêm vào Vercel Environment Variables)',
      OPENAI_API_KEY: openaiKey
        ? `Configured (${openaiKey.slice(0, 7)}...)`
        : 'NOT SET ⚠️ (AI Copilot sẽ dùng từ điển mẫu offline nếu thiếu key)',
      GEMINI_API_KEY: geminiKey ? 'Configured ✅' : 'NOT SET',
      LLM_MODEL: llmModel,
    },
    database: {
      status: dbStatus,
      latencyMs: `${latencyMs}ms`,
      totalDecks,
      totalCards,
      error: dbError,
    },
    instructions:
      dbStatus !== 'connected'
        ? [
            '1. Đăng nhập vào dashboard: https://vercel.com',
            '2. Chọn Project japanese-srs-system -> Settings -> Environment Variables',
            '3. Thêm biến: TURSO_DATABASE_URL = libsql://japanese-srs-db-<your-db>.turso.io (hệ thống sẽ tự động chuyển sang https)',
            '4. Thêm biến: TURSO_AUTH_TOKEN = <token của bạn>',
            '5. (Tùy chọn) Thêm biến: OPENAI_API_KEY = sk-... để kích hoạt AI Copilot',
            '6. Redeploy lại bản build mới nhất trên Vercel.',
          ]
        : [
            `✅ Cơ sở dữ liệu hoạt động hoàn hảo! Đã kết nối với ${totalDecks} Decks và ${totalCards} Thẻ học.`,
          ],
  };

  return NextResponse.json(diagnostics, {
    status: dbStatus === 'connected' ? 200 : 500,
  });
}
