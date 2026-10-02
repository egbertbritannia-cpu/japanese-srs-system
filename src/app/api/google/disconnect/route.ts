import { NextResponse } from 'next/server';

/**
 * Ngắt kết nối tài khoản Google
 */
export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Đã ngắt kết nối Google thành công' });
  response.cookies.delete('google_tokens');
  return response;
}
