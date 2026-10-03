import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getOAuth2Client } from '@/services/google/auth';
import { GoogleTasksService } from '@/services/google/tasks.service';

/**
 * Đồng bộ mục tiêu ngày Daruma vào Google Tasks (Todo List)
 */
export async function POST(request: Request) {
  try {
    const { dueCount = 15, newCount = 5 } = await request.json().catch(() => ({}));

    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('google_tokens')?.value;

    if (!tokenCookie) {
      return NextResponse.json(
        {
          error: 'Cần kết nối tài khoản Google để đồng bộ Google Tasks',
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
      return NextResponse.json({ error: 'Chưa cấu hình Google Client' }, { status: 400 });
    }
    client.setCredentials(tokens);

    const result = await GoogleTasksService.syncDailyGoals(client, {
      dueCount,
      newCount,
    });

    return NextResponse.json({
      success: true,
      message: `Đã đồng bộ ${result.createdTasks.length} nhiệm vụ học tập vào Google Tasks!`,
      tasks: result.createdTasks,
      taskListId: result.taskListId,
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
