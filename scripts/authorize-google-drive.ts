import http from 'http';
import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import { GOOGLE_SCOPES } from '../src/services/google/auth';

// 1. Nạp .env
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const k = trimmed.slice(0, idx).trim();
      const v = trimmed.slice(idx + 1).trim();
      process.env[k] = v;
    }
  }
}

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/google/callback';

if (!clientId || !clientSecret) {
  console.error('❌ Chưa cấu hình GOOGLE_CLIENT_ID hoặc GOOGLE_CLIENT_SECRET trong file .env');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: GOOGLE_SCOPES,
});

console.log('\n================================================================');
console.log('🔗 BƯỚC XÁC THỰC 1 LẦN DUY NHẤT ĐỂ LẤY REFRESH TOKEN VĨNH VIỄN:');
console.log('================================================================');
console.log('👉 Vui lòng mở đường link sau trên trình duyệt:');
console.log(`\n${authUrl}\n`);
console.log('Đang chờ trình duyệt chuyển hướng về http://localhost:3000 ...');

const server = http.createServer(async (req, res) => {
  try {
    const reqUrl = new URL(req.url || '', `http://${req.headers.host}`);
    if (reqUrl.pathname === '/api/google/callback') {
      const code = reqUrl.searchParams.get('code');
      const error = reqUrl.searchParams.get('error');

      if (error) {
        res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h1>❌ Xác thực bị từ chối: ${error}</h1>`);
        return;
      }

      if (code) {
        const { tokens } = await oauth2Client.getToken(code);
        const refreshToken = tokens.refresh_token;

        if (refreshToken) {
          // Ghi refresh token vào file .env
          let envContent = fs.readFileSync(envPath, 'utf-8');
          if (envContent.includes('GOOGLE_REFRESH_TOKEN=')) {
            envContent = envContent.replace(/GOOGLE_REFRESH_TOKEN=.*/, `GOOGLE_REFRESH_TOKEN=${refreshToken}`);
          } else {
            envContent += `\nGOOGLE_REFRESH_TOKEN=${refreshToken}\n`;
          }
          fs.writeFileSync(envPath, envContent, 'utf-8');

          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(`
            <div style="font-family: sans-serif; text-align: center; padding: 50px;">
              <h1 style="color: #059669;">🎉 XÁC THỰC GOOGLE DRIVE THÀNH CÔNG!</h1>
              <p>Mã Refresh Token vĩnh viễn đã được lưu tự động vào file <code>.env</code>.</p>
              <p>Bạn có thể đóng tab trình duyệt này và quay lại terminal.</p>
            </div>
          `);

          console.log('\n✅ THÀNH CÔNG RỰC RỠ!');
          console.log(`🔑 Đã lưu GOOGLE_REFRESH_TOKEN vào .env: ${refreshToken.substring(0, 15)}...`);

          // Kiểm tra thử upload vào thư mục
          oauth2Client.setCredentials({ refresh_token: refreshToken });
          const drive = google.drive({ version: 'v3', auth: oauth2Client });
          const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || '1GbG5uuvH_nBLqjr5yjmdrPMnvrDPenb_';

          console.log(`📤 Đang kiểm tra tải file bằng quota tài khoản 15TB của bạn vào folder: ${folderId}...`);
          try {
            const testUpload = await drive.files.create({
              requestBody: {
                name: 'kiokudo_oauth_verified.txt',
                parents: [folderId],
              },
              media: {
                mimeType: 'text/plain',
                body: 'Kiokudō Spaced Repetition System - Direct OAuth 15TB Vault Verified!\n' + new Date().toISOString(),
              },
              fields: 'id, name, webViewLink',
            });
            console.log('🎉 TẢI THÀNH CÔNG VÀO 15TB CỦA BẠN!');
            console.log(`📄 Tên file: ${testUpload.data.name}`);
            console.log(`🆔 File ID: ${testUpload.data.id}`);
            console.log(`🔗 Link xem: ${testUpload.data.webViewLink}`);
          } catch (uploadErr: any) {
            console.error('Lỗi khi tải file thử nghiệm:', uploadErr?.message);
          }

          setTimeout(() => {
            server.close();
            process.exit(0);
          }, 1500);
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(`
            <div style="font-family: sans-serif; text-align: center; padding: 50px;">
              <h2 style="color: #D97706;">⚠️ Không nhận được refresh_token mới</h2>
              <p>Do tài khoản đã từng cấp quyền trước đó. Hãy xóa quyền ứng dụng trong Google Security hoặc thử lại với prompt=consent.</p>
            </div>
          `);
        }
      }
    }
  } catch (err: any) {
    console.error('Lỗi server callback:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error: ' + err.message);
  }
});

server.listen(3000, () => {
  console.log('⚡ Server lắng nghe phản hồi tại http://localhost:3000/api/google/callback');
});
