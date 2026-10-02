import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getOAuth2Client } from '@/services/google/auth';

/**
 * Kiểm tra trạng thái cấu hình & đăng nhập Google
 */
export async function GET() {
  try {
    const isConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
    
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('google_tokens')?.value;
    
    let isAuthenticated = false;
    let userEmail = null;

    if (tokenCookie && isConfigured) {
      try {
        const tokens = JSON.parse(tokenCookie);
        const client = getOAuth2Client();
        if (client && tokens.access_token) {
          client.setCredentials(tokens);
          isAuthenticated = true;
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
