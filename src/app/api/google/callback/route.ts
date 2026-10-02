import { NextResponse } from 'next/server';
import { getOAuth2Client } from '@/services/google/auth';

/**
 * Xử lý callback sau khi người dùng đăng nhập & cấp quyền trên Google
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  const origin = url.origin;
  const redirectUri = `${origin}/api/google/callback`;

  if (error || !code) {
    return NextResponse.redirect(`${origin}/integrations?error=${encodeURIComponent(error || 'Không có mã ủy quyền')}`);
  }

  try {
    const oauth2Client = getOAuth2Client(redirectUri);
    if (!oauth2Client) {
      return NextResponse.redirect(`${origin}/integrations?error=missing_credentials`);
    }

    const { tokens } = await oauth2Client.getToken(code);

    const response = NextResponse.redirect(`${origin}/integrations?status=connected`);

    // Lưu token vào HTTP-only cookie an toàn
    response.cookies.set('google_tokens', JSON.stringify(tokens), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 ngày
    });

    return response;
  } catch (err: any) {
    console.error('Lỗi khi đổi token Google OAuth:', err);
    return NextResponse.redirect(`${origin}/integrations?error=${encodeURIComponent(err.message || 'Lỗi trao đổi mã ủy quyền')}`);
  }
}
