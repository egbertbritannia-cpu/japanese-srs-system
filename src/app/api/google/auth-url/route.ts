import { NextResponse } from 'next/server';
import { generateAuthUrl, getRedirectUri } from '@/services/google/auth';

/**
 * Lấy URL đăng nhập Google OAuth
 */
export async function GET(request: Request) {
  try {
    const { origin } = new URL(request.url);
    const redirectUri = getRedirectUri(origin);

    const url = generateAuthUrl(redirectUri);

    if (!url) {
      return NextResponse.json(
        {
          error: 'Chưa cấu hình GOOGLE_CLIENT_ID hoặc GOOGLE_CLIENT_SECRET trong biến môi trường (.env)',
          configured: false,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      url,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
