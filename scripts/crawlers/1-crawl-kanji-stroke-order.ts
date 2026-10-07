import fs from 'fs';
import path from 'path';
import https from 'https';
import { db } from '../../src/db/client';
import { cards } from '../../src/db/schema';
import { eq } from 'drizzle-orm';
import { DriveFolderManager } from './drive-folder-manager';

function fetchUrl(url: string, retries = 3): Promise<string> {
  return new Promise((resolve, reject) => {
    const attempt = (remaining: number) => {
      https.get(url, { headers: { 'User-Agent': 'Kiokudo-KanjiVG-Crawler' } }, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetchUrl(res.headers.location, remaining).then(resolve, reject);
        }
        if (res.statusCode !== 200) {
          if (remaining > 1) {
            setTimeout(() => attempt(remaining - 1), 600);
            return;
          }
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      }).on('error', (err) => {
        if (remaining > 1) {
          setTimeout(() => attempt(remaining - 1), 600);
          return;
        }
        reject(err);
      });
    };
    attempt(retries);
  });
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Thêm hiệu ứng hoạt họa viết nét (Stroke order sequential animation) vào KanjiVG SVG
 */
export function makeAnimatedKanjiSvg(rawSvg: string, kanjiChar: string): string {
  // Tìm tất cả các path nét vẽ
  let strokeCount = 0;
  const pathMatches = rawSvg.match(/<path[^>]+id="kvg:[^"]+-s(\d+)"[^>]*>/g) || [];
  strokeCount = pathMatches.length;

  let styledSvg = rawSvg.replace(/<path\s+([^>]*?)id="kvg:([^"]+-s(\d+))"/g, (match, prefix, fullId, strokeNum) => {
    return `<path ${prefix}id="kvg:${fullId}" class="kanji-stroke-anim stroke-${strokeNum}"`;
  });

  // Tạo CSS keyframes vẽ tuần tự từng nét
  // Lưu ý: Tuyệt đối KHÔNG đặt !important lên stroke-dashoffset, nếu có sẽ chặn @keyframes hoạt động
  let css = `
<style>
  @keyframes drawStroke {
    0% {
      stroke-dashoffset: 400;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }
  .kanji-stroke-anim {
    stroke: #9E3223 !important; /* Đỏ son Bengara / Chu sa truyền thống */
    stroke-width: 3.8 !important;
    stroke-linecap: round !important;
    stroke-linejoin: round !important;
    fill: none !important;
    stroke-dasharray: 400;
    stroke-dashoffset: 400;
    animation: drawStroke 0.65s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }
`;

  for (let i = 1; i <= Math.max(strokeCount, 30); i++) {
    const strokeDelay = ((i - 1) * 0.38).toFixed(2);
    css += `  .stroke-${i} { animation-delay: ${strokeDelay}s; }\n`;
  }
  css += `</style>\n`;

  // Thêm lớp nét mộc bản nền mờ (ghost guide) màu be xám để hiện rõ cấu trúc chữ trước khi nét đỏ chạy
  const ghostStrokes = pathMatches
    .map((p) => p.replace(/id="[^"]*"/g, '').replace(/class="[^"]*"/g, '').replace(/<path/, '<path stroke="#E2DAC6" stroke-width="3" fill="none" opacity="0.6"'))
    .join('\n    ');
  const ghostGroup = ghostStrokes ? `  <g id="kvg:GhostBackgroundGuide">\n    ${ghostStrokes}\n  </g>\n` : '';

  // Chèn style và ghost group vào sau thẻ mở <svg ...>
  styledSvg = styledSvg.replace(/<svg\s+([^>]+)>/, `<svg $1>\n${css}${ghostGroup}`);
  return styledSvg;
}

export async function crawlKanjiStrokeOrders(limit?: number) {
  console.log('\n======================================================');
  console.log('🖌️ [CRAWLER 1/5] CÀO THỨ TỰ NÉT HÁN TỰ ĐỘNG (KANJIVG)');
  console.log('======================================================');

  const folders = await DriveFolderManager.initFolders();
  const folderId = folders.kanjiStrokeFolderId;
  const manifest = DriveFolderManager.getManifest(true);

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
      await delay(100);
    } catch (err: any) {
      failCount++;
      console.error(`❌ [${i + 1}/${listToProcess.length}] ${k} Thất bại: ${err.message}`);
    }
  }

  console.log(`\n🎉 Hoàn thành Crawler 1: Thành công: ${successCount}, Bỏ qua (Đã có): ${skipCount}, Lỗi: ${failCount}`);

  // Tổng hợp lại central manifest data/multimodal-manifest.json
  console.log('🔄 Đang đồng bộ lại data/multimodal-manifest.json...');
  const aggregated = DriveFolderManager.aggregateManifests();
  console.log(`✓ Đã cập nhật multimodal-manifest.json: Tổng ${aggregated.totalAssets} assets (Kanji: ${aggregated.categories.kanji || 0}).`);
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('1-crawl-kanji-stroke-order.ts')) {
  crawlKanjiStrokeOrders().catch(console.error);
}
