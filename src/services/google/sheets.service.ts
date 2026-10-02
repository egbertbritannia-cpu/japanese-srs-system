import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export interface CardRowData {
  kanji: string;
  reading: string;
  meaning: string;
  type: string;
  deckName?: string;
  pitch?: string;
  stability?: number;
  state?: string;
}

/**
 * Service xử lý tương tác với Google Sheets API
 */
export class GoogleSheetsService {
  /**
   * Xuất danh sách thẻ học sang một bảng tính Google Sheets mới
   */
  static async exportCardsToNewSheet(
    authClient: OAuth2Client,
    title: string,
    cardsList: CardRowData[]
  ): Promise<{ spreadsheetId: string; spreadsheetUrl: string; rowCount: number }> {
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    // 1. Tạo bảng tính mới trên Google Drive của người dùng
    const createRes = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: title || `🇯🇵 Kho Thẻ Tiếng Nhật FSRS - ${new Date().toISOString().slice(0, 10)}`,
        },
      },
    });

    const spreadsheetId = createRes.data.spreadsheetId;
    if (!spreadsheetId) {
      throw new Error('Không thể tạo bảng tính Google Sheets mới');
    }

    // 2. Định dạng hàng tiêu đề & dữ liệu
    const headers = [
      'Chữ Hán / Từ vựng',
      'Cách đọc (Furigana)',
      'Ý nghĩa tiếng Việt',
      'Loại thẻ',
      'Bộ thẻ (Deck)',
      'Cao độ (Pitch Accent)',
      'Độ ổn định FSRS (S - Ngày)',
      'Trạng thái',
    ];

    const rows = cardsList.map((c) => [
      c.kanji || '',
      c.reading || '',
      c.meaning || '',
      c.type || 'Vocab',
      c.deckName || 'JPD133',
      c.pitch || '[0] Heiban',
      c.stability ? `${c.stability} ngày` : '0 ngày',
      c.state === 'Review' ? 'Đã học (Review)' : 'Mới (New)',
    ]);

    // 3. Ghi dữ liệu vào Sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [headers, ...rows],
      },
    });

    return {
      spreadsheetId,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
      rowCount: rows.length,
    };
  }

  /**
   * Đọc danh sách từ vựng từ một bảng tính Google Sheets công khai hoặc qua Auth
   */
  static async importCardsFromSheet(
    authClient: OAuth2Client | null,
    spreadsheetId: string,
    range: string = 'A2:D1000'
  ): Promise<CardRowData[]> {
    if (!authClient) {
      throw new Error('Cần đăng nhập Google để đọc bảng tính Google Sheets');
    }

    const sheets = google.sheets({ version: 'v4', auth: authClient });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values || [];
    const parsedCards: CardRowData[] = [];

    for (const row of rows) {
      if (!row || row.length === 0) continue;
      const kanji = (row[0] || '').trim();
      const reading = (row[1] || '').trim();
      const meaning = (row[2] || '').trim();
      const type = (row[3] || (kanji.length === 1 ? 'Kanji' : 'Vocab')).trim();

      if (kanji) {
        parsedCards.push({
          kanji,
          reading: reading || kanji,
          meaning: meaning || 'Chưa có giải nghĩa',
          type,
        });
      }
    }

    return parsedCards;
  }

  /**
   * Tạo nội dung CSV chuẩn UTF-8 BOM để mở tiếng Nhật & tiếng Việt không lỗi font
   */
  static generateCsvContent(cardsList: CardRowData[]): string {
    const BOM = '\uFEFF';
    const header = ['Chữ Hán', 'Cách đọc', 'Ý nghĩa', 'Loại thẻ', 'Bộ thẻ', 'Độ ổn định FSRS (S)', 'Trạng thái'];
    
    const escapeCsv = (str: string) => {
      const escaped = (str || '').replace(/"/g, '""');
      return `"${escaped}"`;
    };

    const lines = [
      header.map(escapeCsv).join(','),
      ...cardsList.map((c) =>
        [
          c.kanji,
          c.reading,
          c.meaning,
          c.type,
          c.deckName || 'JPD133',
          c.stability ? `${c.stability} ngày` : '0 ngày',
          c.state === 'Review' ? 'Đã học' : 'Mới',
        ]
          .map(escapeCsv)
          .join(',')
      ),
    ];

    return BOM + lines.join('\r\n');
  }
}
