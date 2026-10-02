import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export interface CalendarEventOptions {
  title?: string;
  description?: string;
  startTime: Date;
  durationMinutes?: number;
  recurDaily?: boolean;
  dueCardCount?: number;
  appBaseUrl?: string;
}

/**
 * Service xử lý tích hợp Lịch học Google Calendar
 */
export class GoogleCalendarService {
  /**
   * Tạo sự kiện nhắc học FSRS trên Google Calendar thông qua API
   */
  static async createStudyReminderEvent(
    authClient: OAuth2Client,
    options: CalendarEventOptions
  ): Promise<{ eventId: string; htmlLink: string }> {
    const calendar = google.calendar({ version: 'v3', auth: authClient });

    const start = options.startTime;
    const end = new Date(start.getTime() + (options.durationMinutes || 20) * 60 * 1000);

    const appUrl = options.appBaseUrl || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://japanese-srs-system.vercel.app');
    const title = options.title || `🇯🇵 Ôn tập tiếng Nhật FSRS (${options.dueCardCount || 15} thẻ)`;
    const description =
      options.description ||
      `Đến giờ ôn tập ngắt quãng FSRS hàng ngày!\n\n` +
      `📌 Số thẻ cần xử lý: ${options.dueCardCount || 15} thẻ\n` +
      `🔗 Bấm vào đây để vào bàn trà học tập: ${appUrl}/review\n\n` +
      `"Học sâu nhớ lâu, kiến tha lâu cũng đầy tổ."`;

    const requestBody: any = {
      summary: title,
      description,
      start: {
        dateTime: start.toISOString(),
        timeZone: 'Asia/Ho_Chi_Minh',
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: 'Asia/Ho_Chi_Minh',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 10 },
          { method: 'notification', minutes: 0 },
        ],
      },
    };

    if (options.recurDaily) {
      requestBody.recurrence = ['RRULE:FREQ=DAILY'];
    }

    const res = await calendar.events.insert({
      calendarId: 'primary',
      requestBody,
    });

    return {
      eventId: res.data.id || '',
      htmlLink: res.data.htmlLink || 'https://calendar.google.com',
    };
  }

  /**
   * Tạo đường dẫn Quick Add Web 1-click (Không cần đăng nhập API, hoạt động ngay lập tức trên mọi thiết bị!)
   */
  static generateWebQuickAddUrl(options: CalendarEventOptions): string {
    const start = options.startTime;
    const end = new Date(start.getTime() + (options.durationMinutes || 20) * 60 * 1000);

    // Format ISO string format without separators: YYYYMMDDTHHmmssZ
    const formatTime = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const appUrl = options.appBaseUrl || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://japanese-srs-system.vercel.app');
    const dates = `${formatTime(start)}/${formatTime(end)}`;
    const text = encodeURIComponent(options.title || `🇯🇵 Ôn tập tiếng Nhật FSRS (${options.dueCardCount || 15} thẻ)`);
    const details = encodeURIComponent(
      `Đến giờ ôn tập ngắt quãng FSRS!\n` +
      `Số thẻ cần ôn: ${options.dueCardCount || 15} thẻ\n` +
      `Bấm vào học ngay: ${appUrl}/review`
    );
    const location = encodeURIComponent('Bàn trà học tập (Japanese SRS)');

    let url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;

    if (options.recurDaily) {
      url += `&recur=${encodeURIComponent('RRULE:FREQ=DAILY')}`;
    }

    return url;
  }
}
