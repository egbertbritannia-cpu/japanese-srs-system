import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/db/client';
import { cards } from '@/db/schema';
import { getOAuth2Client } from '@/services/google/auth';
import { GoogleSheetsService } from '@/services/google/sheets.service';
import { PitchAccentLookup } from '@/modules/japanese-nlp/pitch-lookup';

/**
 * Trích xuất spreadsheetId từ URL hoặc chuỗi ID
 */
function extractSpreadsheetId(input: string): string {
  const match = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match) return match[1];
  return input.trim();
}

/**
 * Nhập dữ liệu thẻ học từ Google Sheets
 */
export async function POST(request: Request) {
  try {
    const { urlOrId, deckId = 'deck_jpd133', range = 'A2:D500', action = 'preview' } = await request.json();

    if (!urlOrId) {
      return NextResponse.json({ error: 'Vui lòng cung cấp link hoặc ID của bảng tính Google Sheets' }, { status: 400 });
    }

    const spreadsheetId = extractSpreadsheetId(urlOrId);

    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('google_tokens')?.value;

    let client = null;
    if (tokenCookie) {
      try {
        const tokens = JSON.parse(tokenCookie);
        const oauthClient = getOAuth2Client();
        if (oauthClient) {
          oauthClient.setCredentials(tokens);
          client = oauthClient;
        }
      } catch {
        client = null;
      }
    }

    const parsedCards = await GoogleSheetsService.importCardsFromSheet(client, spreadsheetId, range);

    // Nếu chỉ xem trước (preview)
    if (action === 'preview') {
      return NextResponse.json({
        success: true,
        cardsCount: parsedCards.length,
        preview: parsedCards.slice(0, 10),
      });
    }

    // Nếu thực hiện lưu vào cơ sở dữ liệu (import)
    const now = new Date();
    let inserted = 0;

    for (const item of parsedCards) {
      const pitchInfo = PitchAccentLookup.lookup(item.kanji, item.reading || item.kanji);
      const pitchStr = pitchInfo ? `[${pitchInfo.dropPosition}] ${pitchInfo.pattern}` : '[0] Heiban';

      const cardId = `g_import_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      await db.insert(cards).values({
        id: cardId,
        deckId,
        type: item.type || (item.kanji.length === 1 ? 'Kanji' : 'Vocab'),
        front: item.kanji,
        reading: item.reading || item.kanji,
        meaning: item.meaning,
        pitch: pitchStr,
        sentence: `{{c1::${item.kanji}}}`,
        tags: JSON.stringify(['Google_Sheets_Import', item.type]),
        stability: 0,
        difficulty: 0,
        elapsedDays: 0,
        scheduledDays: 0,
        reps: 0,
        lapses: 0,
        state: 'New',
        due: now,
        createdAt: now,
        updatedAt: now,
      });
      inserted++;
    }

    return NextResponse.json({
      success: true,
      message: `Đã nhập thành công ${inserted} thẻ từ Google Sheets vào bộ thẻ!`,
      insertedCount: inserted,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
