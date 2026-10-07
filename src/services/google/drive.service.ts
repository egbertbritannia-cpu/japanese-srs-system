import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import { Readable } from 'stream';

/**
 * GoogleDriveService (Quản lý tương tác Google Drive qua Service Account vĩnh viễn)
 * - 0 lần đăng nhập lại (No OAuth popup)
 * - Tự động ủy quyền qua credentials.json
 * - Hỗ trợ upload ảnh, GIF, SVG, audio, và sinh link CDN trực tiếp
 */
export class GoogleDriveService {
  private static authClient: any = null;

  /**
   * Khởi tạo Auth Client từ GOOGLE_REFRESH_TOKEN (Tài khoản người dùng 5TB/15TB)
   * hoặc credentials.json (Service Account)
   */
  static getAuthClient() {
    if (this.authClient) return this.authClient;

    // 1. Ưu tiên Refresh Token người dùng (Sử dụng trực tiếp quota cá nhân 5TB/15TB)
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (refreshToken && clientId && clientSecret) {
      const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/google/callback'
      );
      oauth2Client.setCredentials({ refresh_token: refreshToken });
      this.authClient = oauth2Client;
      return this.authClient;
    }

    // 2. Dự phòng: Service Account credentials.json
    const credentialsPath = path.resolve(process.cwd(), 'credentials.json');
    if (fs.existsSync(credentialsPath)) {
      this.authClient = new google.auth.GoogleAuth({
        keyFile: credentialsPath,
        scopes: ['https://www.googleapis.com/auth/drive'],
      });
      return this.authClient;
    }

    if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
      try {
        const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
        this.authClient = new google.auth.GoogleAuth({
          credentials,
          scopes: ['https://www.googleapis.com/auth/drive'],
        });
        return this.authClient;
      } catch (err) {
        console.warn('[GoogleDriveService] Lỗi đọc GOOGLE_SERVICE_ACCOUNT_JSON:', err);
      }
    }

    return null;
  }

  /**
   * Lấy instance Google Drive API v3
   */
  static getDrive() {
    const auth = this.getAuthClient();
    if (!auth) {
      throw new Error(
        'Chưa tìm thấy file credentials.json hoặc biến GOOGLE_SERVICE_ACCOUNT_JSON. Vui lòng đảm bảo file credentials.json nằm tại thư mục gốc của dự án.'
      );
    }
    return google.drive({ version: 'v3', auth });
  }

  /**
   * Kiểm tra kết nối tới Google Drive
   */
  static async verifyConnection(): Promise<{ success: boolean; email?: string; error?: string }> {
    try {
      const drive = this.getDrive();
      const about = await drive.about.get({ fields: 'user' });
      return {
        success: true,
        email: about.data.user?.emailAddress || 'kiokudo-drive-bot',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Không thể kết nối Google Drive API',
      };
    }
  }

  /**
   * Tạo thư mục mới trên Google Drive
   */
  static async createFolder(folderName: string, parentFolderId?: string): Promise<{ id: string; name: string }> {
    const drive = this.getDrive();
    const fileMetadata: any = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    };

    if (parentFolderId) {
      fileMetadata.parents = [parentFolderId];
    }

    const res = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id, name',
    });

    return {
      id: res.data.id!,
      name: res.data.name!,
    };
  }

  /**
   * Tải tệp tin (ảnh, audio, doc) lên Google Drive
   */
  static async uploadFile(options: {
    fileName: string;
    mimeType: string;
    content: Buffer | Readable | string;
    folderId?: string;
    makePublic?: boolean;
  }): Promise<{ id: string; name: string; viewUrl: string; cdnUrl: string }> {
    const drive = this.getDrive();

    const fileMetadata: any = {
      name: options.fileName,
    };

    if (options.folderId) {
      fileMetadata.parents = [options.folderId];
    }

    let mediaBody: any;
    if (Buffer.isBuffer(options.content)) {
      mediaBody = Readable.from(options.content);
    } else if (typeof options.content === 'string') {
      mediaBody = Readable.from(Buffer.from(options.content, 'utf-8'));
    } else {
      mediaBody = options.content;
    }

    const res = await drive.files.create({
      requestBody: fileMetadata,
      media: {
        mimeType: options.mimeType,
        body: mediaBody,
      },
      fields: 'id, name, webViewLink',
    });

    const fileId = res.data.id!;

    // Tự động phân quyền Public đọc (nếu là tài nguyên hình ảnh/audio học tập)
    if (options.makePublic !== false) {
      try {
        await drive.permissions.create({
          fileId,
          requestBody: {
            role: 'reader',
            type: 'anyone',
          },
        });
      } catch {
        // Bỏ qua nếu tổ chức chặn share public
      }
    }

    return {
      id: fileId,
      name: res.data.name!,
      viewUrl: res.data.webViewLink || `https://drive.google.com/file/d/${fileId}/view`,
      // Link CDN trực tiếp tốc độ cao của Google (nhúng trực tiếp vào thẻ <img src=... />)
      cdnUrl: `https://lh3.googleusercontent.com/d/${fileId}`,
    };
  }

  /**
   * Liệt kê các tệp tin trong thư mục
   */
  static async listFiles(folderId?: string, pageSize = 50) {
    const drive = this.getDrive();
    let q = "trashed = false";
    if (folderId) {
      q += ` and '${folderId}' in parents`;
    }

    const res = await drive.files.list({
      q,
      pageSize,
      fields: 'files(id, name, mimeType, webViewLink, thumbnailLink, createdTime, size)',
      orderBy: 'createdTime desc',
    });

    return res.data.files || [];
  }

  /**
   * Lấy đường dẫn CDN trực tiếp của tệp tin theo fileId
   */
  static getDirectCdnUrl(fileId: string): string {
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
}

export const driveService = GoogleDriveService;
