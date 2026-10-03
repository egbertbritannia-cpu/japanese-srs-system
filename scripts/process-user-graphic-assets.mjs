import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const sourceDir = 'C:\\Users\\ThinkPad X1\\Pictures\\japanese-graphic-design';
const targetDir = 'D:\\project\\japanese-srs-system\\public\\assets\\art';

async function optimizeAndCopy() {
  console.log('--- Đang xử lý tài nguyên hình ảnh theo skill image-asset-generator ---');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 1. 16993f123e6add9422185049d288cd94.webp -> japanese-graphic-contemporary.webp
  const file1 = path.join(sourceDir, '16993f123e6add9422185049d288cd94.webp');
  if (fs.existsSync(file1)) {
    const dest1 = path.join(targetDir, 'japanese-graphic-contemporary.webp');
    await sharp(file1)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(dest1);
    console.log('✓ Đã xuất:', dest1);
  }

  // 2. 18337712357dc3b93a96a076cef25eae.jpg -> kirie-layered-waves.webp
  const file2 = path.join(sourceDir, '18337712357dc3b93a96a076cef25eae.jpg');
  if (fs.existsSync(file2)) {
    const dest2 = path.join(targetDir, 'kirie-layered-waves.webp');
    await sharp(file2)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(dest2);
    console.log('✓ Đã xuất:', dest2);
  }

  // 3. ac59704353e2214f4764c662ccac6dca.jpg -> vintage-woodblock-border.webp
  const file3 = path.join(sourceDir, 'ac59704353e2214f4764c662ccac6dca.jpg');
  if (fs.existsSync(file3)) {
    const dest3 = path.join(targetDir, 'vintage-woodblock-border.webp');
    await sharp(file3)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(dest3);
    console.log('✓ Đã xuất:', dest3);
  }

  // 4. Презентация - Японская реклама.jpg -> taisho-roman-posters.webp
  const file4 = path.join(sourceDir, 'Презентация - Японская реклама.jpg');
  if (fs.existsSync(file4)) {
    const dest4 = path.join(targetDir, 'taisho-roman-posters.webp');
    await sharp(file4)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(dest4);
    console.log('✓ Đã xuất:', dest4);
  }

  console.log('--- Hoàn tất tối ưu tài nguyên mỹ thuật ---');
}

optimizeAndCopy().catch(console.error);
