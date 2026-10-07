import fs from 'fs';
import path from 'path';
import https from 'https';
import { db } from '../../src/db/client';
import { cards } from '../../src/db/schema';
import { eq } from 'drizzle-orm';
import { DriveFolderManager } from './drive-folder-manager';

function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Kiokudo-KanjiVG-Crawler' } }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Thêm hiệu ứng hoạt họa viết nét (Stroke order sequential animation) vào KanjiVG SVG
 */
function makeAnimatedKanjiSvg(rawSvg: string, kanjiChar: string): string {
  // Tìm tất cả các path nét vẽ
  let strokeCount = 0;
  let styledSvg = rawSvg.replace(/<path\s+id="kvg:[^"]+-s(\d+)"/g, (match, strokeNum) => {
    const sIdx = parseInt(strokeNum, 10);
    strokeCount = Math.max(strokeCount, sIdx);
    return `${match} class="kanji-stroke-anim stroke-${strokeNum}"`;
  });

  // Tạo CSS keyframes vẽ tuần tự từng nét
  let css = `
<style>
  @keyframes drawStroke {
    0% { stroke-dashoffset: 250; }
    100% { stroke-dashoffset: 0; }
  }
  .kanji-stroke-anim {
    stroke: #16253B !important;
    stroke-width: 4 !important;
    stroke-linecap: round !important;
    stroke-linejoin: round !important;
    stroke-dasharray: 250 !important;
    stroke-dashoffset: 250 !important;
    animation: drawStroke 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }
`;

  for (let i = 1; i <= Math.max(strokeCount, 30); i++) {
    const strokeDelay = ((i - 1) * 0.35).toFixed(2);
    css += `  .stroke-${i} { animation-delay: ${strokeDelay}s; }\n`;
  }
  css += `</style>\n`;

  // Chèn style vào sau thẻ mở <svg ...>
  styledSvg = styledSvg.replace(/<svg\s+([^>]+)>/, `<svg $1>\n${css}`);
  return styledSvg;
}

export async function crawlKanjiStrokeOrders(limit?: number) {
  console.log('\n======================================================');
  console.log('🖌️ [CRAWLER 1/5] CÀO THỨ TỰ NÉT HÁN TỰ ĐỘNG (KANJIVG)');
  console.log('======================================================');

  const folders = await DriveFolderManager.initFolders();
  const folderId = folders.kanjiStrokeFolderId;
  const manifest = DriveFolderManager.getManifest();

  // 1. Thu thập toàn bộ Hán tự độc nhất từ deck_jpd133_kanji
  const kanjiCards = await db.select().from(cards).where(eq(cards.deckId, 'deck_jpd133_kanji'));
  console.log(`📋 Tổng số thẻ Hán tự trong cơ sở dữ liệu: ${kanjiCards.length}`);

  const kanjiSet = new Set<string>();
  for (const card of kanjiCards) {
    // Trích xuất các ký tự Kanji (Unicode range 4E00 - 9FAF)
    const matches = card.front.match(/[\u4e00-\u9faf]/g);
    if (matches) {
      matches.forEach((k: string) => kanjiSet.add(k));
    }
  }

  const allKanji = Array.from(kanjiSet);
  console.log(`🔍 Tìm thấy ${allKanji.length} Hán tự độc nhất cần xử lý.`);

  const listToProcess = limit ? allKanji.slice(0, limit) : allKanji;
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (let i = 0; i < listToProcess.length; i++) {
    const k = listToProcess[i];
    const key = `kanji:${k}`;

    if (manifest.assets[key]) {
      skipCount++;
      process.stdout.write(`⏭️ [${i + 1}/${listToProcess.length}] ${k} (Đã có sẵn trên Drive)\r`);
      continue;
    }

    try {
      const hex = k.charCodeAt(0).toString(16).padStart(5, '0');
      const url = `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${hex}.svg`;
      const rawSvg = await fetchUrl(url);
      const animatedSvg = makeAnimatedKanjiSvg(rawSvg, k);

      const entry = await DriveFolderManager.uploadAndRegister({
        key,
        category: 'kanji',
        fileName: `kanji_${k}_${hex}_animated.svg`,
        mimeType: 'image/svg+xml',
        content: animatedSvg,
        folderId,
      });

      successCount++;
      console.log(`✅ [${i + 1}/${listToProcess.length}] ${k} (${hex}) -> Uploaded: ${entry.fileId}`);
      await delay(120);
    } catch (err: any) {
      failCount++;
      console.error(`❌ [${i + 1}/${listToProcess.length}] ${k} Thất bại: ${err.message}`);
    }
  }

  console.log(`\n🎉 Hoàn thành Crawler 1: Thành công: ${successCount}, Bỏ qua (Đã có): ${skipCount}, Lỗi: ${failCount}`);
}

if (process.argv[1].endsWith('1-crawl-kanji-stroke-order.ts')) {
  crawlKanjiStrokeOrders().catch(console.error);
}
