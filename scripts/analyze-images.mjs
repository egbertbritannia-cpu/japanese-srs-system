import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function analyzeImage(filePath, label) {
  if (!fs.existsSync(filePath)) {
    console.log(`[${label}] File not found: ${filePath}`);
    return;
  }
  const stats = await sharp(filePath).stats();
  const meta = await sharp(filePath).metadata();
  const avgChannels = stats.channels.map(c => Math.round(c.mean));
  console.log(`[${label}] ${path.basename(filePath)}: ${meta.width}x${meta.height}, format: ${meta.format}, avg RGB: [${avgChannels.slice(0, 3).join(', ')}]`);
}

async function main() {
  const gDir = 'C:\\Users\\ThinkPad X1\\Pictures\\japanese-graphic-design';
  await analyzeImage(path.join(gDir, '16993f123e6add9422185049d288cd94.webp'), 'NEW GRAPHIC');
  await analyzeImage(path.join(gDir, '18337712357dc3b93a96a076cef25eae.jpg'), 'KIRIE BLUE WAVE');
  await analyzeImage(path.join(gDir, 'ac59704353e2214f4764c662ccac6dca.jpg'), 'JAPANESE GRAPHIC');
  await analyzeImage(path.join(gDir, 'Презентация - Японская реклама.jpg'), 'VINTAGE POSTER');

  const sDir = 'C:\\Users\\ThinkPad X1\\Pictures\\Screenshots';
  const recentScreenshots = [
    'Screenshot 2026-10-03 145950.png',
    'Screenshot 2026-10-03 145926.png',
    'Screenshot 2026-10-03 145637.png',
    'Screenshot 2026-10-03 144806.png',
  ];
  for (const f of recentScreenshots) {
    await analyzeImage(path.join(sDir, f), 'SCREENSHOT');
  }
}

main();
