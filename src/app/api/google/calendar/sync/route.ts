import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getOAuth2Client } from '@/services/google/auth';
import { GoogleCalendarService } from '@/services/google/calendar.service';

/**
 * Đồng bộ lịch học hoặc tạo sự kiện Google Calendar
 */
export async function POST(request: Request) {
  try {
    const {
      time = '20:00',
      durationMinutes = 20,
      recurDaily = true,
      dueCardCount = 15,
      mode = 'quick_add', // 'quick_add' hoặc 'api_sync'
    } = await request.json().catch(() => ({}));

    // Tính toán thời gian bắt đầu
    const [hours, minutes] = time.split(':').map(Number);
    const startTime = new Date();
    startTime.setHours(hours, minutes, 0, 0);

    // Nếu giờ đã qua trong ngày, dời sang ngày mai
    if (startTime.getTime() <= Date.now()) {
      startTime.setDate(startTime.getDate() + 1);
    }

    const { origin } = new URL(request.url);
    const options = {
      startTime,
      durationMinutes,
      recurDaily,
      dueCardCount,
      title: `🇯🇵 Ôn tập tiếng Nhật FSRS (${dueCardCount} thẻ)`,
      appBaseUrl: origin,
    };

    // Tạo link Quick Add Web tức thì
    const quickAddUrl = GoogleCalendarService.generateWebQuickAddUrl(options);

    // Nếu người dùng chọn đồng bộ trực tiếp qua Google Calendar API
    if (mode === 'api_sync') {
      const cookieStore = await cookies();
      const tokenCookie = cookieStore.get('google_tokens')?.value;

      if (!tokenCookie) {
        return NextResponse.json({
          success: true,
          quickAddUrl,
          message: 'Chưa đăng nhập Google OAuth. Bạn có thể bấm vào link Quick Add để thêm sự kiện ngay.',
          needsAuth: true,
        });
      }

      const tokens = JSON.parse(tokenCookie);
      const client = getOAuth2Client();
      if (!client) {
        return NextResponse.json({ error: 'Chưa cấu hình Google Client' }, { status: 400 });
      }
      client.setCredentials(tokens);

      const result = await GoogleCalendarService.createStudyReminderEvent(client, options);

      return NextResponse.json({
        success: true,
        message: 'Đã tự động thêm sự kiện vào Google Calendar của bạn!',
        eventId: result.eventId,
        htmlLink: result.htmlLink,
        quickAddUrl,
      });
    }

    return NextResponse.json({
      success: true,
      quickAddUrl,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
