import { NextResponse } from 'next/server';
import { generateAuthUrlWithState, getRedirectUri } from '@/services/google/auth';

/**
 * Endpoint điều hướng trực tiếp sang Google OAuth (Native 302 Redirect)
 * Đính kèm CSRF State Token vào Cookie bảo vệ (BUG-SEC-03)
 */
export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  try {
    const redirectUri = getRedirectUri(origin);
    const authData = generateAuthUrlWithState(redirectUri);

    if (!authData) {
      return NextResponse.redirect(
        `${origin}/integrations?error=${encodeURIComponent(
          'Chưa cấu hình GOOGLE_CLIENT_ID hoặc GOOGLE_CLIENT_SECRET trên Vercel'
        )}`
      );
    }

    const response = NextResponse.redirect(authData.url);
    response.cookies.set('oauth_state', authData.state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 600, // 10 phút
    });

    return response;
  } catch (error: any) {
    const { origin } = new URL(request.url);
    return NextResponse.redirect(
      `${origin}/integrations?error=${encodeURIComponent(error?.message || 'Lỗi điều hướng Google OAuth')}`
    );
  }
}
