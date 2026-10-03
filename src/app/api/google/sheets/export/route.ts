import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/db/client';
import { cards, decks } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getOAuth2Client } from '@/services/google/auth';
import { GoogleSheetsService, CardRowData } from '@/services/google/sheets.service';

/**
 * GET: Hỗ trợ tải trực tiếp file CSV qua window.open('/api/google/sheets/export?format=csv')
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';

    // 1. Lấy toàn bộ thẻ từ database
    const allCards = await db
      .select({
        kanji: cards.front,
        reading: cards.reading,
        meaning: cards.meaning,
        type: cards.type,
        deckName: decks.name,
        pitch: cards.pitch,
        stability: cards.stability,
        state: cards.state,
      })
      .from(cards)
      .leftJoin(decks, eq(cards.deckId, decks.id));

    const cardRows: CardRowData[] = allCards.map((c: any) => ({
      kanji: c.kanji,
      reading: c.reading || '',
      meaning: c.meaning || '',
      type: c.type || 'Vocab',
      deckName: c.deckName || 'JPD133',
      pitch: c.pitch || '[0] Heiban',
      stability: c.stability || 0,
      state: c.state || 'New',
    }));

    if (format === 'csv') {
      const csvData = GoogleSheetsService.generateCsvContent(cardRows);
      return new NextResponse(csvData, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="japanese_srs_cards_${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({ success: true, count: cardRows.length, cards: cardRows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Xuất dữ liệu thẻ học sang Google Sheets hoặc tải về file CSV
 */
export async function POST(request: Request) {
  try {
    const { format = 'sheet', title } = await request.json().catch(() => ({}));

    // 1. Lấy toàn bộ thẻ từ database
    const allCards = await db
      .select({
        kanji: cards.front,
        reading: cards.reading,
        meaning: cards.meaning,
        type: cards.type,
        deckName: decks.name,
        pitch: cards.pitch,
        stability: cards.stability,
        state: cards.state,
      })
      .from(cards)
      .leftJoin(decks, eq(cards.deckId, decks.id));

    const cardRows: CardRowData[] = allCards.map((c: any) => ({
      kanji: c.kanji,
      reading: c.reading || '',
      meaning: c.meaning || '',
      type: c.type || 'Vocab',
      deckName: c.deckName || 'JPD133',
      pitch: c.pitch || '[0] Heiban',
      stability: c.stability || 0,
      state: c.state || 'New',
    }));

    // Nếu người dùng chọn tải file CSV (Không cần OAuth)
    if (format === 'csv') {
      const csvData = GoogleSheetsService.generateCsvContent(cardRows);
      return new NextResponse(csvData, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="japanese_srs_cards_${Date.now()}.csv"`,
        },
      });
    }

    // Nếu xuất trực tiếp vào Google Sheets cá nhân
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('google_tokens')?.value;

    if (!tokenCookie) {
      return NextResponse.json(
        {
          error: 'Chưa đăng nhập Google. Bạn có thể chọn tải về file CSV hoặc bấm "Kết nối tài khoản Google" trước.',
          needsAuth: true,
        },
        { status: 401 }
      );
    }

    let tokens;
    try {
      tokens = JSON.parse(tokenCookie);
    } catch {
      cookieStore.delete('google_tokens');
      return NextResponse.json(
        { error: 'Token đăng nhập Google không hợp lệ. Vui lòng kết nối lại tài khoản.', needsAuth: true },
        { status: 401 }
      );
    }

    const client = getOAuth2Client();
    if (!client) {
      return NextResponse.json({ error: 'Chưa cấu hình GOOGLE_CLIENT_ID' }, { status: 400 });
    }

    client.setCredentials(tokens);

    const sheetResult = await GoogleSheetsService.exportCardsToNewSheet(
      client,
      title || `🇯🇵 Kho Thẻ Tiếng Nhật FSRS (${cardRows.length} thẻ)`,
      cardRows
    );

    return NextResponse.json({
      success: true,
      spreadsheetId: sheetResult.spreadsheetId,
      spreadsheetUrl: sheetResult.spreadsheetUrl,
      rowCount: sheetResult.rowCount,
    });
  } catch (error: any) {
    if (error?.message?.includes('invalid_grant') || error?.code === 401) {
      const cookieStore = await cookies();
      cookieStore.delete('google_tokens');
      return NextResponse.json(
        { error: 'Phiên đăng nhập Google đã hết hạn. Vui lòng kết nối lại tài khoản.', needsAuth: true },
        { status: 401 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
