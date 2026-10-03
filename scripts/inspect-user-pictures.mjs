import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function checkDir(dir) {
  console.log('=== Checking:', dir);
  if (!fs.existsSync(dir)) {
    console.log('Directory not found:', dir);
    return;
  }
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const ext = path.extname(f).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext)) {
      const fullPath = path.join(dir, f);
      try {
        const meta = await sharp(fullPath).metadata();
        console.log(`${f} | ${meta.width}x${meta.height} | ${meta.format} | ${Math.round(fs.statSync(fullPath).size / 1024)} KB`);
      } catch (e) {
        console.log(`${f}: error reading: ${e.message}`);
      }
    }
  }
}

async function run() {
  await checkDir('C:\\Users\\ThinkPad X1\\Pictures\\japanese-graphic-design');
  console.log('\n--- Recent Screenshots ---');
  const screenshotDir = 'C:\\Users\\ThinkPad X1\\Pictures\\Screenshots';
  if (fs.existsSync(screenshotDir)) {
    const sFiles = fs.readdirSync(screenshotDir)
      .filter(f => f.startsWith('Screenshot 2026-10-03') || f.startsWith('Screenshot 2026-10-02 20') || f.startsWith('Screenshot 2026-10-02 21') || f.startsWith('Screenshot 2026-10-02 22'))
      .sort()
      .reverse()
      .slice(0, 15);
    for (const f of sFiles) {
      const fullPath = path.join(screenshotDir, f);
      try {
        const meta = await sharp(fullPath).metadata();
        console.log(`${f} | ${meta.width}x${meta.height} | ${meta.format} | ${Math.round(fs.statSync(fullPath).size / 1024)} KB`);
      } catch (e) {
        console.log(`${f}: error: ${e.message}`);
      }
    }
  }
}

run();
