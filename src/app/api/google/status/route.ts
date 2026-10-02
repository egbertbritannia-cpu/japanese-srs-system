import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getOAuth2Client } from '@/services/google/auth';

/**
 * Kiểm tra trạng thái cấu hình & đăng nhập Google
 */
export async function GET() {
  try {
    const client = getOAuth2Client();
    const isConfigured = Boolean(client);
    
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('google_tokens')?.value;
    
    let isAuthenticated = false;
    let userEmail: string | null = null;

    if (tokenCookie && isConfigured) {
      try {
        const tokens = JSON.parse(tokenCookie);
        if (client && (tokens.access_token || tokens.refresh_token)) {
          client.setCredentials(tokens);
          isAuthenticated = true;

          // Giải mã email từ id_token nếu có
          if (tokens.id_token) {
            try {
              const payload = JSON.parse(Buffer.from(tokens.id_token.split('.')[1], 'base64').toString('utf-8'));
              userEmail = payload.email || null;
            } catch {
              // ignore jwt decode error
            }
          }
        }
      } catch {
        isAuthenticated = false;
      }
    }

    return NextResponse.json({
      success: true,
      configured: isConfigured,
      authenticated: isAuthenticated,
      userEmail,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
