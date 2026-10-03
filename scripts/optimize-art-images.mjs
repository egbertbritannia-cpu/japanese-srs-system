import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ART_DIR = path.resolve('public/assets/art');
const MANIFEST_PATH = path.resolve('public/assets/art/art-manifest.json');

async function processArtImages() {
  console.log('🌸 [Asset Pipeline] Đang quét và tối ưu hóa ảnh nghệ thuật Wabi-Sabi...');

  if (!fs.existsSync(ART_DIR)) {
    console.error('❌ Không tìm thấy thư mục:', ART_DIR);
    return;
  }

  const files = fs.readdirSync(ART_DIR).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return (ext === '.jpg' || ext === '.jpeg' || ext === '.png') && !file.includes('-optimized');
  });

  const manifest = {};
  let totalOriginalBytes = 0;
  let totalAvifBytes = 0;

  for (const file of files) {
    const inputPath = path.join(ART_DIR, file);
    const baseName = path.parse(file).name;
    const stats = fs.statSync(inputPath);
    totalOriginalBytes += stats.size;

    console.log(`\n🖼️ Đang xử lý: ${file} (${(stats.size / 1024).toFixed(1)} KB)`);

    // 1. Xuất file AVIF (Siêu nhẹ cho trình duyệt hiện đại)
    const avifName = `${baseName}.avif`;
    const avifPath = path.join(ART_DIR, avifName);
    await sharp(inputPath)
      .avif({ quality: 65, effort: 6 })
      .toFile(avifPath);

    const avifStats = fs.statSync(avifPath);
    totalAvifBytes += avifStats.size;
    const savings = (((stats.size - avifStats.size) / stats.size) * 100).toFixed(1);
    console.log(`  └─► [AVIF] ${avifName}: ${(avifStats.size / 1024).toFixed(1)} KB (Giảm ${savings}%)`);

    // 2. Xuất file WebP (Độ tương thích cao)
    const webpName = `${baseName}.webp`;
    const webpPath = path.join(ART_DIR, webpName);
    await sharp(inputPath)
      .webp({ quality: 75, effort: 5 })
      .toFile(webpPath);

    // 3. Tạo chuỗi làm mờ siêu nhỏ BlurDataURL (LQIP - Low Quality Image Placeholder)
    const blurBuffer = await sharp(inputPath)
      .resize(16, 16, { fit: 'inside' })
      .toFormat('webp', { quality: 20 })
      .toBuffer();

    const blurDataUrl = `data:image/webp;base64,${blurBuffer.toString('base64')}`;

    manifest[file] = {
      originalSize: stats.size,
      avif: { name: avifName, size: avifStats.size },
      webp: { name: webpName },
      blurDataUrl,
    };
  }

  // Xử lý thêm các file webp độc lập nếu chưa có avif
  const webpFiles = fs.readdirSync(ART_DIR).filter(file => {
    return path.extname(file).toLowerCase() === '.webp' && !manifest[file];
  });

  for (const file of webpFiles) {
    const inputPath = path.join(ART_DIR, file);
    const baseName = path.parse(file).name;
    const avifName = `${baseName}.avif`;
    const avifPath = path.join(ART_DIR, avifName);

    if (!fs.existsSync(avifPath)) {
      const stats = fs.statSync(inputPath);
      totalOriginalBytes += stats.size;
      await sharp(inputPath)
        .avif({ quality: 65, effort: 6 })
        .toFile(avifPath);
      const avifStats = fs.statSync(avifPath);
      totalAvifBytes += avifStats.size;

      const blurBuffer = await sharp(inputPath)
        .resize(16, 16, { fit: 'inside' })
        .toFormat('webp', { quality: 20 })
        .toBuffer();
      const blurDataUrl = `data:image/webp;base64,${blurBuffer.toString('base64')}`;

      manifest[file] = {
        originalSize: stats.size,
        avif: { name: avifName, size: avifStats.size },
        webp: { name: file },
        blurDataUrl,
      };
      console.log(`  └─► [AVIF from WebP] ${avifName}: ${(avifStats.size / 1024).toFixed(1)} KB`);
    }
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');

  const totalSavings = totalOriginalBytes > 0
    ? (((totalOriginalBytes - totalAvifBytes) / totalOriginalBytes) * 100).toFixed(1)
    : '0';

  console.log(`\n======================================================`);
  console.log(`✅ [TỔNG KẾT ASSET PIPELINE]`);
  console.log(`Tổng dung lượng ảnh ban đầu : ${(totalOriginalBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Tổng dung lượng sau AVIF    : ${(totalAvifBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Tiết kiệm băng thông        : ${totalSavings}%!`);
  console.log(`Manifest được tạo tại       : ${MANIFEST_PATH}`);
  console.log(`======================================================\n`);
}

processArtImages().catch(console.error);
