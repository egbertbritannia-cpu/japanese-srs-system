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

export async function purgeFaultyKanjiData() {
  console.log('\n======================================================');
  console.log('🗑️ [PURGE] XÓA DỮ LIỆU CÀO HÁN TỰ BỊ LỖI TRÊN DRIVE & MANIFESTS');
  console.log('======================================================');

  const drive = GoogleDriveService.getDrive();
  const folders = await DriveFolderManager.initFolders();
  const kanjiFolderId = folders.kanjiStrokeFolderId;
  console.log(`📁 Thư mục Kanji Stroke trên Google Drive: ${kanjiFolderId}`);

  // 1. Lấy danh sách tệp SVG trong thư mục Kanji Stroke
  console.log('🔍 Đang quét toàn bộ tệp SVG lỗi trong thư mục Google Drive...');
  const files = await GoogleDriveService.listFiles(kanjiFolderId, 200);
  console.log(`📋 Tìm thấy ${files.length} tệp trên Google Drive cần dọn dẹp/xóa bỏ.`);

  let deletedCount = 0;
  let errorCount = 0;

  for (const file of files) {
    if (!file.id) continue;
    try {
      try {
        await drive.files.delete({ fileId: file.id });
      } catch (delErr: any) {
        // Fallback trashing nếu không có quyền hard delete
        await drive.files.update({
          fileId: file.id,
          requestBody: { trashed: true },
        });
      }
      deletedCount++;
      process.stdout.write(`🗑️ [${deletedCount}/${files.length}] Đã xóa: ${file.name} (${file.id})\r`);
    } catch (err: any) {
      errorCount++;
      console.warn(`\n⚠️ Lỗi khi xóa ${file.name} (${file.id}):`, err.message);
    }
  }

  console.log(`\n✓ Hoàn tất xóa Google Drive: ${deletedCount} thành công, ${errorCount} lỗi.`);

  // 2. Dọn dẹp partition data/manifests/kanji.json
  const manifestsDir = path.resolve(process.cwd(), 'data', 'manifests');
  const kanjiManifestPath = path.join(manifestsDir, 'kanji.json');
  console.log('🧹 Đang làm sạch partition data/manifests/kanji.json...');
  const emptyKanjiPartition = {
    category: 'kanji',
    totalAssets: 0,
    lastUpdated: new Date().toISOString(),
    assets: {},
  };
  fs.writeFileSync(kanjiManifestPath, JSON.stringify(emptyKanjiPartition, null, 2), 'utf-8');
  console.log('✓ Đã reset data/manifests/kanji.json về 0 assets.');

  // 3. Dọn dẹp file kanji_strokes.json nếu tồn tại để bảo đảm đúng 8 partition files cho Tier 3 test
  const kanjiStrokesPath = path.join(manifestsDir, 'kanji_strokes.json');
  if (fs.existsSync(kanjiStrokesPath)) {
    try {
      fs.unlinkSync(kanjiStrokesPath);
      console.log('✓ Đã xóa file thừa data/manifests/kanji_strokes.json để bảo đảm 8 partition files.');
    } catch {}
  }

  // 4. Đồng bộ tổng thể vào data/multimodal-manifest.json
  console.log('🔄 Đang tổng hợp (aggregate) lại data/multimodal-manifest.json...');
  const aggregated = DriveFolderManager.aggregateManifests();
  console.log(`✓ Đã cập nhật multimodal-manifest.json: Tổng ${aggregated.totalAssets} assets (Kanji: ${aggregated.categories.kanji || 0}).`);

  return {
    deletedCount,
    errorCount,
    totalAssets: aggregated.totalAssets,
  };
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('purge-faulty-kanji-drive.ts')) {
  purgeFaultyKanjiData()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Lỗi khi purge:', err);
      process.exit(1);
    });
}
