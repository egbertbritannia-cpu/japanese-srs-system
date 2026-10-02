import { google } from 'googleapis';

/**
 * Quản lý Google OAuth 2.0 Client & Scopes
 */

export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/tasks',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
];

/**
 * Xác định URI chuyển hướng chuẩn xác (Canonical Redirect URI)
 * Trên môi trường Vercel hoặc Cloud, dùng domain ổn định japanese-srs-system-git-main-cassius1.vercel.app
 * để tránh lỗi redirect_uri_mismatch khi Vercel tạo domain mã băm ngẫu nhiên.
 */
export function getRedirectUri(origin?: string): string {
  // Nếu có biến môi trường chỉ định rõ (không phải localhost trên môi trường HTTPS)
  if (
    process.env.GOOGLE_REDIRECT_URI &&
    !(origin?.startsWith('https://') && process.env.GOOGLE_REDIRECT_URI.includes('localhost'))
  ) {
    return process.env.GOOGLE_REDIRECT_URI;
  }

  // Nếu đang chạy trên web/cloud (Vercel)
  if (origin && origin.startsWith('https://')) {
    if (origin.includes('.vercel.app')) {
      return 'https://japanese-srs-system-git-main-cassius1.vercel.app/api/google/callback';
    }
    return `${origin}/api/google/callback`;
  }

  // Mặc định chạy local development
  return 'http://localhost:3000/api/google/callback';
}

export function getOAuth2Client(redirectUri?: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  const redirect = redirectUri || getRedirectUri();

  if (!clientId || !clientSecret) {
    return null;
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirect);
}

export function generateAuthUrl(redirectUri?: string): string | null {
  const oauth2Client = getOAuth2Client(redirectUri);
  if (!oauth2Client) return null;

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: GOOGLE_SCOPES,
  });
}

