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
 * Sinh đồ họa tóm tắt sơ đồ tư duy ngữ pháp (Grammar Infographic Mindmap)
 */
function generateGrammarInfographicSvg(item: {
  patternId: string;
  formula: string;
  meaning: string;
  exampleSentence: string;
}): string {
  // Tách dòng giải thích
  const meaningLines = item.meaning.split(/\r?\n/).filter(l => l.trim()).slice(0, 3);
  const cleanExample = item.exampleSentence.replace(/\{\{c\d+::(.*?)\}\}/g, '$1').trim();

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1000" height="700" viewBox="0 0 1000 700" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Washi Paper Base with Seigaiha Waves Accent -->
  <rect width="1000" height="700" rx="28" fill="#FAF8F5"/>
  <rect x="16" y="16" width="968" height="668" rx="20" fill="none" stroke="#E3DAC9" stroke-width="2"/>
  <rect x="28" y="28" width="944" height="644" rx="16" fill="none" stroke="#16253B" stroke-width="1.5" stroke-opacity="0.2"/>

  <!-- Header Banner -->
  <path d="M28 28 H972 V120 H28 Z" fill="#16253B" rx="16"/>
  <text x="60" y="70" font-family="'Zen Maru Gothic', sans-serif" font-size="14" font-weight="bold" fill="#AF7E36" letter-spacing="3">
    JPD133 MINNA NO NIHONGO · CÔNG THỨC NGỮ PHÁP TRỌNG TÂM
  </text>
  <text x="60" y="102" font-family="'Shippori Mincho', serif" font-size="28" font-weight="bold" fill="#FAF8F5">
    ${item.patternId}
  </text>

  <!-- Formula Box (Khối Công Thức Cốt Lõi) -->
  <rect x="60" y="150" width="880" height="120" rx="16" fill="#F4EBE1" stroke="#AF7E36" stroke-width="2"/>
  <text x="90" y="185" font-family="'Zen Maru Gothic', sans-serif" font-size="14" font-weight="bold" fill="#9E3223">
    📌 CẤU TRÚC NGỮ PHÁP:
  </text>
  <text x="90" y="235" font-family="'Shippori Mincho', monospace" font-size="34" font-weight="bold" fill="#16253B">
    ${item.formula.replace(/[【】]/g, '').substring(0, 45)}
  </text>

  <!-- Meaning & Nuance Section (Ý nghĩa & Sắc thái) -->
  <rect x="60" y="300" width="880" height="180" rx="16" fill="#FFFFFF" stroke="#E3DAC9" stroke-width="1.5"/>
  <rect x="80" y="320" width="160" height="32" rx="8" fill="#386641"/>
  <text x="160" y="342" text-anchor="middle" font-family="'Zen Maru Gothic', sans-serif" font-size="13" font-weight="bold" fill="#FAF8F5">
    💡 Ý NGHĨA & CÁCH DÙNG
  </text>

  ${meaningLines.map((line, idx) => `
    <text x="80" y="${385 + idx * 30}" font-family="'Zen Maru Gothic', sans-serif" font-size="16" fill="#2B3A4A">
      • ${line.substring(0, 90)}
    </text>
  `).join('')}

  <!-- Example Context Banner (Ví Dụ Minh Họa) -->
  <rect x="60" y="510" width="880" height="130" rx="16" fill="#FDFBF7" stroke="#16253B" stroke-width="1.5"/>
  <rect x="80" y="530" width="160" height="32" rx="8" fill="#B5301E"/>
  <text x="160" y="552" text-anchor="middle" font-family="'Zen Maru Gothic', sans-serif" font-size="13" font-weight="bold" fill="#FAF8F5">
    🗣️ CÂU VÍ DỤ NGỮ CẢNH
  </text>
  <text x="80" y="605" font-family="'Shippori Mincho', serif" font-size="24" font-weight="bold" fill="#16253B">
    「 ${cleanExample} 」
  </text>

  <!-- Hanko Stamp -->
  <g transform="translate(860, 560)">
    <rect width="60" height="60" rx="8" fill="#B5301E"/>
    <text x="30" y="37" text-anchor="middle" font-family="'Shippori Mincho', serif" font-size="20" font-weight="bold" fill="#FFFFFF">記</text>
  </g>
</svg>`;
}

export async function crawlGrammarInfographics(limit?: number) {
  console.log('\n======================================================');
  console.log('📊 [CRAWLER 4/5] SINH SƠ ĐỒ MINDMAP & INFOGRAPHIC NGỮ PHÁP');
  console.log('======================================================');

  const folders = await DriveFolderManager.initFolders();
  const folderId = folders.grammarInfographicsFolderId;
  const manifest = DriveFolderManager.getManifest();

  // 1. Lấy các mẫu ngữ pháp từ grammar_jpd133
  const grammarCards = await db.select().from(cards).where(eq(cards.deckId, 'grammar_jpd133'));
  console.log(`📋 Tổng số thẻ ngữ pháp: ${grammarCards.length}`);

  // Gom theo mẫu ngữ pháp (G-72, G-73...)
  const patterns = new Map<string, { formula: string; meaning: string; example: string }>();
  for (const card of grammarCards) {
    let pKey = card.id;
    try {
      const tags = JSON.parse(card.tags || '[]');
      const gTag = tags.find((t: string) => t.startsWith('G-'));
      if (gTag) pKey = gTag;
    } catch {}

    if (!patterns.has(pKey)) {
      patterns.set(pKey, {
        formula: card.front.includes('【') ? card.front : card.reading || card.front,
        meaning: card.meaning || '',
        example: card.sentence || card.front,
      });
    }
  }

  const patternList = Array.from(patterns.entries());
  console.log(`🔍 Tìm thấy ${patternList.length} điểm ngữ pháp độc nhất.`);

  const listToProcess = limit ? patternList.slice(0, limit) : patternList;
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (let i = 0; i < listToProcess.length; i++) {
    const [pKey, data] = listToProcess[i];
    const key = `grammar_infographic:${pKey}`;

    if (manifest.assets[key]) {
      skipCount++;
      process.stdout.write(`⏭️ [${i + 1}/${listToProcess.length}] ${pKey} (Đã có sẵn trên Drive)\r`);
      continue;
    }

    try {
      const svg = generateGrammarInfographicSvg({
        patternId: `Ngữ pháp ${pKey}`,
        formula: data.formula,
        meaning: data.meaning,
        exampleSentence: data.example,
      });

      const entry = await DriveFolderManager.uploadAndRegister({
        key,
        category: 'grammar_infographic',
        fileName: `grammar_infographic_${pKey}.svg`,
        mimeType: 'image/svg+xml',
        content: svg,
        folderId,
      });

      successCount++;
      console.log(`✅ [${i + 1}/${listToProcess.length}] ${pKey} -> Uploaded: ${entry.fileId}`);
      await delay(120);
    } catch (err: any) {
      failCount++;
      console.error(`❌ [${i + 1}/${listToProcess.length}] ${pKey} Thất bại: ${err.message}`);
    }
  }

  console.log(`\n🎉 Hoàn thành Crawler 4: Thành công: ${successCount}, Bỏ qua: ${skipCount}, Lỗi: ${failCount}`);
}

if (process.argv[1].endsWith('4-generate-grammar-infographics.ts')) {
  crawlGrammarInfographics().catch(console.error);
}
