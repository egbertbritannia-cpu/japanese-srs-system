import { NextResponse } from 'next/server';
import { generateAuthUrl } from '@/services/google/auth';

/**
 * Endpoint điều hướng trực tiếp sang Google OAuth (Native 302 Redirect)
 * Giúp người dùng click là nhảy thẳng sang trang đăng nhập Google ngay lập tức,
 * không phụ thuộc vào JavaScript fetch hay bị chặn popup.
 */
export async function GET(request: Request) {
  try {
    const { origin } = new URL(request.url);
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${origin}/api/google/callback`;

    const url = generateAuthUrl(redirectUri);

    if (!url) {
      return NextResponse.redirect(
        `${origin}/integrations?error=${encodeURIComponent(
          'Chưa cấu hình GOOGLE_CLIENT_ID hoặc GOOGLE_CLIENT_SECRET trên Vercel'
        )}`
      );
    }

    return NextResponse.redirect(url);
  } catch (error: any) {
    const { origin } = new URL(request.url);
    return NextResponse.redirect(
      `${origin}/integrations?error=${encodeURIComponent(error?.message || 'Lỗi điều hướng Google OAuth')}`
    );
  }
}
