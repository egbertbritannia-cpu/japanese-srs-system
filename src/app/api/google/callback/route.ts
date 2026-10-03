import { NextResponse } from 'next/server';
import { getOAuth2Client, getRedirectUri } from '@/services/google/auth';

/**
 * Xử lý callback sau khi người dùng đăng nhập & cấp quyền trên Google
 * - Xác thực CSRF state token (BUG-SEC-03)
 * - Tối ưu hóa dung lượng token lưu trong cookie < 1KB (BUG-GOOG-05)
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  const stateParam = url.searchParams.get('state');

  const origin = url.origin;
  const redirectUri = getRedirectUri(origin);

  if (error || !code) {
    return NextResponse.redirect(`${origin}/integrations?error=${encodeURIComponent(error || 'Không có mã ủy quyền')}`);
  }

  // 1. Kiểm tra CSRF State Token (BUG-SEC-03)
  const cookieHeader = request.headers.get('cookie') || '';
  const stateMatch = cookieHeader.match(/oauth_state=([^;]+)/);
  const storedState = stateMatch ? decodeURIComponent(stateMatch[1].trim()) : null;

  if (storedState && (!stateParam || stateParam !== storedState)) {
    console.error('[OAuth CSRF Exception] State param không khớp:', { stateParam, storedState });
    return NextResponse.redirect(`${origin}/integrations?error=invalid_oauth_state_csrf`);
  }

  try {
    const oauth2Client = getOAuth2Client(redirectUri);
    if (!oauth2Client) {
      return NextResponse.redirect(`${origin}/integrations?error=missing_credentials`);
    }

    const { tokens } = await oauth2Client.getToken(code);

    const response = NextResponse.redirect(`${origin}/integrations?status=connected`);

    // 2. Chỉ lưu các trường cần thiết, loại bỏ id_token và scope dài để cookie luôn < 1KB (BUG-GOOG-05)
    const minimalTokens = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date,
    };

    response.cookies.set('google_tokens', JSON.stringify(minimalTokens), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 ngày
    });

    // Dọn dẹp cookie oauth_state sau khi đã xác thực
    response.cookies.delete('oauth_state');

    return response;
  } catch (err: any) {
    console.error('Lỗi khi đổi token Google OAuth:', err);
    return NextResponse.redirect(`${origin}/integrations?error=${encodeURIComponent(err.message || 'Lỗi trao đổi mã ủy quyền')}`);
  }
}
