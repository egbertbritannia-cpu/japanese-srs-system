import fs from 'fs';
import path from 'path';

// Load .env
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

import { GoogleDriveService } from '../../src/services/google/drive.service';
import { DriveFolderManager } from './drive-folder-manager';

async function main() {
  console.log('🔍 KIỂM TRA TOÀN DIỆN CÁC TỆP TIN TRÊN GOOGLE DRIVE...');
  const drive = GoogleDriveService.getDrive();
  const rootId = process.env.GOOGLE_DRIVE_FOLDER_ID || '1GbG5uuvH_nBLqjr5yjmdrPMnvrDPenb_';

  // 1. Kiểm tra các tệp ở thư mục gốc
  const rootFiles = await GoogleDriveService.listFiles(rootId, 100);
  console.log(`📁 Thư mục gốc có ${rootFiles.length} mục:`);
  for (const f of rootFiles) {
    console.log(`  - [${f.mimeType === 'application/vnd.google-apps.folder' ? 'DIR' : 'FILE'}] ${f.name} (ID: ${f.id})`);
    // Xóa file test thử nghiệm kiokudo_oauth_verified.txt
    if (f.name === 'kiokudo_oauth_verified.txt') {
      console.log(`    🗑️ Đang xóa tệp rác thử nghiệm OAuth: ${f.name}...`);
      await drive.files.delete({ fileId: f.id! });
      console.log(`    ✓ Đã xóa thành công.`);
    }
  }

  // 2. Kiểm tra thư mục tranh vẽ minh họa cũ (xóa các file emoji SVG placeholder thử nghiệm đợt đầu)
  const folders = await DriveFolderManager.initFolders();
  const illustFolderId = folders.minnaIllustrationsFolderId;
  const illustFiles = await GoogleDriveService.listFiles(illustFolderId, 100);
  console.log(`\n🎨 Thư mục Illustrations có ${illustFiles.length} mục:`);
  let deletedSvgPlaceholders = 0;
  for (const f of illustFiles) {
    // Các file có đuôi .svg và tên bắt đầu bằng illust_ là file placeholder emoji đời đầu (trước khi nâng cấp lên Irasutoya PNG)
    if (f.name?.startsWith('illust_') && f.name?.endsWith('.svg')) {
      console.log(`  🗑️ Đang xóa tệp SVG emoji tạm: ${f.name} (ID: ${f.id})...`);
      try {
        await drive.files.delete({ fileId: f.id! });
        deletedSvgPlaceholders++;
      } catch (err: any) {
        console.warn(`    Lỗi xóa ${f.name}:`, err.message);
      }
    }
  }
  console.log(`  ✓ Đã dọn dẹp ${deletedSvgPlaceholders} tệp SVG emoji tạm.`);

  // 3. Đồng bộ lại manifest
  console.log('\n🧹 Dọn dẹp các key tạm trong Manifests...');
  const manifest = DriveFolderManager.getManifest(true);
  let cleanedManifestKeys = 0;
  for (const [key, entry] of Object.entries(manifest.assets)) {
    if (entry.fileName.startsWith('illust_') && entry.fileName.endsWith('.svg')) {
      DriveFolderManager.removeAsset(key);
      cleanedManifestKeys++;
    }
  }
  console.log(`  ✓ Đã loại bỏ ${cleanedManifestKeys} bản ghi tạm trong manifest.`);
  console.log('\n🎉 HOÀN TẤT DỌN DẸP DỮ LIỆU RÁC THÀNH CÔNG RỰC RỠ!');
}

main().catch(err => {
  console.error('Lỗi dọn dẹp:', err);
  process.exit(1);
});
