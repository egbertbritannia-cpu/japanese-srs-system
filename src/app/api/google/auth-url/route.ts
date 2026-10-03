import { NextResponse } from 'next/server';
import { generateAuthUrlWithState, getRedirectUri } from '@/services/google/auth';

/**
 * Lấy URL đăng nhập Google OAuth kèm CSRF State Token (BUG-SEC-03)
 */
export async function GET(request: Request) {
  try {
    const { origin } = new URL(request.url);
    const redirectUri = getRedirectUri(origin);

    const authData = generateAuthUrlWithState(redirectUri);

    if (!authData) {
      return NextResponse.json(
        {
          error: 'Chưa cấu hình GOOGLE_CLIENT_ID hoặc GOOGLE_CLIENT_SECRET trong biến môi trường (.env)',
          configured: false,
        },
        { status: 400 }
      );
    }

    const response = NextResponse.json({
      success: true,
      url: authData.url,
    });

    response.cookies.set('oauth_state', authData.state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 600, // 10 phút
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
