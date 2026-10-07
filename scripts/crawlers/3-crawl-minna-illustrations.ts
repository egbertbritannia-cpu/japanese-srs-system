import fs from 'fs';
import path from 'path';
import { db } from '../../src/db/client';
import { cards } from '../../src/db/schema';
import { eq } from 'drizzle-orm';
import { DriveFolderManager } from './drive-folder-manager';

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Sinh thẻ đồ họa minh họa trực quan phong cách Washi & Nippon Colors (Dual Coding Visuals)
 */
function generateWaStyleIllustrationCard(item: {
  word: string;
  reading: string;
  meaning: string;
  category: string;
}): string {
  const cleanMeaning = item.meaning.replace(/(\(.*?\))/g, '').trim().substring(0, 30);
  
  // Icon hình ảnh minh họa tượng trưng theo danh mục
  const icons: Record<string, string> = {
    'gia đình': '👨‍👩‍👧‍👦',
    'bố': '👨',
    'mẹ': '👩',
    'anh': '👦',
    'chị': '👧',
    'ăn': '🍱',
    'uống': '🍵',
    'đi': '🚶‍♂️',
    'đến': '🗾',
    'xe': '🚗',
    'nhà': '🏡',
    'trường': '🏫',
    'sách': '📖',
    'tiền': '💴',
    'nước': '💧',
    'thịt': '🥩',
    'cá': '🐟',
    'hoa': '🌸',
    'núi': '🗻',
    'mặt trời': '☀️',
    'trăng': '🌙',
    'mắt': '👁️',
    'tay': '✋',
  };

  let pickedIcon = '🎌';
  for (const [k, v] of Object.entries(icons)) {
    if (cleanMeaning.toLowerCase().includes(k) || item.word.includes(k)) {
      pickedIcon = v;
      break;
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="600" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Washi Textured Background -->
  <rect width="800" height="600" rx="24" fill="#FAF8F5"/>
  <rect x="12" y="12" width="776" height="576" rx="16" fill="none" stroke="#E3DAC9" stroke-width="2" stroke-dasharray="8 8"/>
  <rect x="24" y="24" width="752" height="552" rx="12" fill="none" stroke="#9E3223" stroke-width="1.5" stroke-opacity="0.3"/>

  <!-- Decorative Corner Seals -->
  <circle cx="50" cy="50" r="14" fill="#9E3223" fill-opacity="0.08"/>
  <circle cx="750" cy="50" r="14" fill="#9E3223" fill-opacity="0.08"/>
  <circle cx="50" cy="550" r="14" fill="#9E3223" fill-opacity="0.08"/>
  <circle cx="750" cy="550" r="14" fill="#9E3223" fill-opacity="0.08"/>

  <!-- Top Category Tag -->
  <rect x="300" y="45" width="200" height="34" rx="17" fill="#F4EBE1"/>
  <text x="400" y="67" text-anchor="middle" font-family="'Zen Maru Gothic', sans-serif" font-size="13" font-weight="600" fill="#AF7E36" letter-spacing="2">
    ${item.category.toUpperCase()}
  </text>

  <!-- Central Visual Mnemonic Emblem -->
  <circle cx="400" cy="220" r="110" fill="#F4EDE4"/>
  <circle cx="400" cy="220" r="95" fill="#FFFFFF" stroke="#E3DAC9" stroke-width="2"/>
  
  <!-- Emoji / Icon Silhouette -->
  <text x="400" y="245" text-anchor="middle" font-size="82">
    ${pickedIcon}
  </text>

  <!-- Main Japanese Word (Shippori Mincho) -->
  <text x="400" y="380" text-anchor="middle" font-family="'Shippori Mincho', 'Yu Mincho', serif" font-size="54" font-weight="bold" fill="#16253B" letter-spacing="4">
    ${item.word}
  </text>

  <!-- Furigana / Reading (Zen Maru Gothic) -->
  <text x="400" y="425" text-anchor="middle" font-family="'Zen Maru Gothic', sans-serif" font-size="24" font-weight="500" fill="#7A8B99" letter-spacing="3">
    【 ${item.reading} 】
  </text>

  <!-- Vietnamese Meaning Banner -->
  <rect x="180" y="465" width="440" height="52" rx="12" fill="#16253B"/>
  <text x="400" y="498" text-anchor="middle" font-family="'Zen Maru Gothic', sans-serif" font-size="20" font-weight="600" fill="#FAF8F5">
    ${cleanMeaning}
  </text>

  <!-- Authentic Hanko Seal Stamp -->
  <g transform="translate(680, 480)">
    <rect width="64" height="64" rx="10" fill="#B5301E"/>
    <rect x="3" y="3" width="58" height="58" rx="7" fill="none" stroke="#FFFFFF" stroke-width="1.5"/>
    <text x="32" y="38" text-anchor="middle" font-family="'Shippori Mincho', serif" font-size="20" font-weight="bold" fill="#FFFFFF">道</text>
  </g>
</svg>`;
}

export async function crawlMinnaIllustrations(limit?: number) {
  console.log('\n======================================================');
  console.log('🖼️ [CRAWLER 3/5] SINH & CÀO BỘ ẢNH MINH HỌA TRỰC QUAN (MINNA)');
  console.log('======================================================');

  const folders = await DriveFolderManager.initFolders();
  const folderId = folders.minnaIllustrationsFolderId;
  const manifest = DriveFolderManager.getManifest();

  // 1. Lấy từ vựng từ deck_jpd133
  const vocabCards = await db.select().from(cards).where(eq(cards.deckId, 'deck_jpd133'));
  console.log(`📋 Tổng số từ vựng cần sinh thẻ tranh minh họa: ${vocabCards.length}`);

  const listToProcess = limit ? vocabCards.slice(0, limit) : vocabCards;
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (let i = 0; i < listToProcess.length; i++) {
    const card = listToProcess[i];
    const cleanWord = card.front.replace(/\{\{c\d+::(.*?)\}\}/g, '$1').trim();
    const key = `illustration:${cleanWord}`;

    if (manifest.assets[key]) {
      skipCount++;
      process.stdout.write(`⏭️ [${i + 1}/${listToProcess.length}] ${cleanWord} (Đã có sẵn trên Drive)\r`);
      continue;
    }

    try {
      let category = 'Từ vựng JPD133';
      try {
        const parsedTags = JSON.parse(card.tags || '[]');
        if (parsedTags.length > 1) category = parsedTags[1];
      } catch {}

      const cardSvg = generateWaStyleIllustrationCard({
        word: cleanWord,
        reading: card.reading || cleanWord,
        meaning: card.meaning || '',
        category,
      });

      const safeFileName = `illust_${encodeURIComponent(cleanWord).replace(/%/g, '_')}.svg`;

      const entry = await DriveFolderManager.uploadAndRegister({
        key,
        category: 'illustration',
        fileName: safeFileName,
        mimeType: 'image/svg+xml',
        content: cardSvg,
        folderId,
      });

      successCount++;
      console.log(`✅ [${i + 1}/${listToProcess.length}] ${cleanWord} -> Uploaded: ${entry.fileId}`);
      await delay(120);
    } catch (err: any) {
      failCount++;
      console.error(`❌ [${i + 1}/${listToProcess.length}] ${cleanWord} Thất bại: ${err.message}`);
    }
  }

  console.log(`\n🎉 Hoàn thành Crawler 3: Thành công: ${successCount}, Bỏ qua: ${skipCount}, Lỗi: ${failCount}`);
}

if (process.argv[1].endsWith('3-crawl-minna-illustrations.ts')) {
  crawlMinnaIllustrations().catch(console.error);
}
