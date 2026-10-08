import fs from 'fs';
import path from 'path';
import https from 'https';
import zlib from 'zlib';

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

import { DriveFolderManager } from './drive-folder-manager';
import { StreamUploader } from './stream-uploader';

const SNOW_T15_URL = 'https://filedn.com/lit4DCIlHwxfS1gj9zcYuDJ/SNOW/T15-2020.1.7.xlsx';
const SNOW_T23_URL = 'https://filedn.com/lit4DCIlHwxfS1gj9zcYuDJ/SNOW/T23-2020.1.7.xlsx';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Pure Node.js in-memory ZIP reader to extract XML files from an XLSX buffer
 */
function readZipEntries(buffer: Buffer): Record<string, string> {
  const entries: Record<string, string> = {};
  let offset = 0;
  while (offset < buffer.length - 30) {
    if (buffer.readUInt32LE(offset) !== 0x04034b50) {
      offset++;
      continue;
    }
    const compMethod = buffer.readUInt16LE(offset + 8);
    const compSize = buffer.readUInt32LE(offset + 18);
    const nameLen = buffer.readUInt16LE(offset + 26);
    const extraLen = buffer.readUInt16LE(offset + 28);
    const name = buffer.toString('utf8', offset + 30, offset + 30 + nameLen);
    const dataStart = offset + 30 + nameLen + extraLen;
    const compData = buffer.subarray(dataStart, dataStart + compSize);

    if (name.endsWith('.xml')) {
      try {
        const raw = compMethod === 8 ? zlib.inflateRawSync(compData) : compData;
        entries[name] = raw.toString('utf8');
      } catch {}
    }
    offset = dataStart + compSize;
  }
  return entries;
}

/**
 * Parse sharedStrings XML into string array
 */
function parseSharedStrings(ssXml: string): string[] {
  const strings: string[] = [];
  const siBlocks = ssXml.match(/<si>[\s\S]*?<\/si>/g) || [];
  for (const si of siBlocks) {
    const tMatches = si.match(/<t[^>]*>([\s\S]*?)<\/t>/g) || [];
    const text = tMatches
      .map((t) => t.replace(/<t[^>]*>/, '').replace(/<\/t>/, ''))
      .join('');
    strings.push(text);
  }
  return strings;
}

/**
 * Parse sheet1.xml rows into objects
 */
function parseSheetRows(sheetXml: string, sharedStrings: string[]): Array<{ id: string; original_ja: string; simplified_ja: string; original_en: string }> {
  const rows: Array<{ id: string; original_ja: string; simplified_ja: string; original_en: string }> = [];
  const rowBlocks = sheetXml.match(/<row r="[0-9]+"[\s\S]*?<\/row>/g) || [];

  for (let i = 1; i < rowBlocks.length; i++) { // Skip header row 0
    const rowXml = rowBlocks[i];
    const cellMatches = rowXml.match(/<c r="[A-Z]+[0-9]+"[^>]*>(?:<v>([0-9]+)<\/v>)?<\/c>/g) || [];
    
    // Extract cell values
    const colValues: Record<string, string> = {};
    for (const c of cellMatches) {
      const colLetter = c.match(/r="([A-Z]+)[0-9]+"/)?.[1] || '';
      const isString = c.includes('t="s"');
      const valMatch = c.match(/<v>([0-9]+)<\/v>/)?.[1];
      if (valMatch !== undefined) {
        if (isString) {
          const sIdx = parseInt(valMatch, 10);
          colValues[colLetter] = sharedStrings[sIdx] || '';
        } else {
          colValues[colLetter] = valMatch;
        }
      }
    }

    // Standard SNOW columns:
    // A: ID, B: #日本語(原文), C: #やさしい日本語, D: #英語(原文)
    const id = colValues['A'] || String(i);
    const original_ja = colValues['B'] || '';
    const simplified_ja = colValues['C'] || '';
    const original_en = colValues['D'] || '';

    if (original_ja || simplified_ja) {
      rows.push({ id, original_ja, simplified_ja, original_en });
    }
  }

  return rows;
}

export async function crawlSnowSimplifiedCorpus(limitUnits?: number) {
  console.log('\n======================================================');
  console.log('🌸 [HF CRAWLER] SNOW-NLP SIMPLIFIED JAPANESE CORPUS');
  console.log('     Thu thập kho Tiếng Nhật Tinh Giản (やさしい日本語) 50,000 câu');
  console.log('======================================================');

  const folders = await DriveFolderManager.initFolders();
  const folderId = folders.jlptDokkaiFolderId;
  if (!folderId) {
    throw new Error('Chưa tìm thấy thư mục 09_JLPT_Dokkai_Reading_Comprehension trên Google Drive');
  }

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  // 1. Tải và lưu trữ tệp Master Excel T15 nguyên bản (3.63 MB)
  const masterKeyT15 = 'jlpt_dokkai:snow_t15_master_xlsx';
  if (DriveFolderManager.hasAsset(masterKeyT15)) {
    console.log('  ✓ [Master] snow_t15_master.xlsx đã có trên Drive, bỏ qua.');
    skipCount++;
  } else {
    console.log('  ⬇️ [1/4] Đang stream tệp gốc Master T15 (3.63 MB) lên Google Drive...');
    try {
      const entry = await StreamUploader.streamUploadFromUrl({
        url: SNOW_T15_URL,
        key: masterKeyT15,
        category: 'jlpt_dokkai',
        fileName: 'snow_t15_simplified_master.xlsx',
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        folderId,
        metadata: {
          name: 'SNOW T15 Simplified Japanese Master Corpus (Yamamoto Lab)',
          source: 'Nagaoka University of Technology & LREC 2018',
          sourceUrl: SNOW_T15_URL,
          totalSentences: 50000,
          description: '50,000 aligned sentences: original Japanese, simplified Japanese (やさしい日本語), English translation',
        },
      });
      successCount++;
      console.log(`  ✅ [Master] Streamed thành công: ${entry.fileName} (${((entry.sizeBytes || 0) / 1024 / 1024).toFixed(2)} MB)\n`);
    } catch (err: any) {
      console.warn('  ⚠️ Lỗi stream T15 Master:', err.message);
      failCount++;
    }
  }

  // 2. Tải và lưu trữ tệp Master Excel T23 nguyên bản (3.64 MB)
  const masterKeyT23 = 'jlpt_dokkai:snow_t23_master_xlsx';
  if (DriveFolderManager.hasAsset(masterKeyT23)) {
    console.log('  ✓ [Master] snow_t23_master.xlsx đã có trên Drive, bỏ qua.');
    skipCount++;
  } else {
    console.log('  ⬇️ [2/4] Đang stream tệp gốc Master T23 (3.64 MB) lên Google Drive...');
    try {
      const entry = await StreamUploader.streamUploadFromUrl({
        url: SNOW_T23_URL,
        key: masterKeyT23,
        category: 'jlpt_dokkai',
        fileName: 'snow_t23_simplified_master.xlsx',
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        folderId,
        metadata: {
          name: 'SNOW T23 Crowdsourced Simplified Japanese Corpus',
          source: 'Nagaoka University of Technology & LREC 2018',
          sourceUrl: SNOW_T23_URL,
          description: 'Crowdsourced corpus of sentence simplification with core vocabulary',
        },
      });
      successCount++;
      console.log(`  ✅ [Master] Streamed thành công: ${entry.fileName} (${((entry.sizeBytes || 0) / 1024 / 1024).toFixed(2)} MB)\n`);
    } catch (err: any) {
      console.warn('  ⚠️ Lỗi stream T23 Master:', err.message);
      failCount++;
    }
  }

  // 3. Phân tách thành các gói JSON cấu trúc (mỗi gói 5,000 cặp câu để Web App đọc tức thì)
  console.log('  🔄 [3/4] Đang tải buffer trong RAM và giải nén tệp T15 để tạo các gói bài học JSON...');
  try {
    const t15Buffer: Buffer = await new Promise((resolve, reject) => {
      https.get(SNOW_T15_URL, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} fetching T15`));
          return;
        }
        const chunks: Buffer[] = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', reject);
      });
    });

    console.log(`  ✓ Đã nạp ${(t15Buffer.length / 1024 / 1024).toFixed(2)} MB buffer T15 vào RAM. Đang trích xuất XML...`);
    const entries = readZipEntries(t15Buffer);
    const ssXml = entries['xl/sharedStrings.xml'] || '';
    const sheetXml = entries['xl/worksheets/sheet1.xml'] || '';

    const sharedStrings = parseSharedStrings(ssXml);
    const rows = parseSheetRows(sheetXml, sharedStrings);
    console.log(`  ✓ Đã phân tích thành công ${rows.length.toLocaleString()} cặp câu đối sánh tiếng Nhật tinh giản!`);

    const batchSize = 5000;
    const totalBatches = Math.ceil(rows.length / batchSize);

    for (let b = 0; b < totalBatches; b++) {
      if (limitUnits && successCount >= limitUnits) break;
      const batchRows = rows.slice(b * batchSize, (b + 1) * batchSize);
      const unitId = `snow_t15_unit_${String(b + 1).padStart(4, '0')}`;
      const unitKey = `jlpt_dokkai:${unitId}`;

      if (DriveFolderManager.hasAsset(unitKey)) {
        skipCount++;
        continue;
      }

      const payload = JSON.stringify({
        unitId,
        corpus: 'SNOW T15 (Japanese Simplified Corpus with Core Vocabulary)',
        source: 'Nagaoka University of Technology (Yamamoto Lab)',
        totalPairs: batchRows.length,
        pairs: batchRows,
      });

      const fileName = `${unitId}.json`;
      const entry = await DriveFolderManager.uploadAndRegister({
        key: unitKey,
        category: 'jlpt_dokkai',
        fileName,
        mimeType: 'application/json',
        content: Buffer.from(payload, 'utf-8'),
        folderId,
        sizeBytes: Buffer.byteLength(payload),
        metadata: {
          unitId,
          totalPairs: batchRows.length,
          batchIndex: b + 1,
          totalBatches,
          description: `5,000 aligned simplified Japanese sentences (Unit ${b + 1}/${totalBatches})`,
        },
      });

      successCount++;
      console.log(`    📦 [SNOW T15] ${fileName} -> ${entry.fileId} (+${batchRows.length} câu đối sánh)`);
      await delay(300);
    }
  } catch (err: any) {
    console.warn('  ⚠️ Lỗi xử lý phân rã JSON SNOW T15:', err.message);
  }

  // 4. Phân tách tệp T23 thành các gói JSON cấu trúc (mỗi gói 5,000 cặp câu)
  if (!limitUnits || successCount < limitUnits) {
    console.log('  🔄 [4/4] Đang tải buffer trong RAM và giải nén tệp T23 để tạo các gói bài học JSON...');
    try {
      const t23Buffer: Buffer = await new Promise((resolve, reject) => {
        https.get(SNOW_T23_URL, (res) => {
          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode} fetching T23`));
            return;
          }
          const chunks: Buffer[] = [];
          res.on('data', (c) => chunks.push(c));
          res.on('end', () => resolve(Buffer.concat(chunks)));
          res.on('error', reject);
        });
      });

      const entries = readZipEntries(t23Buffer);
      const ssXml = entries['xl/sharedStrings.xml'] || '';
      const sheetXml = entries['xl/worksheets/sheet1.xml'] || '';

      const sharedStrings = parseSharedStrings(ssXml);
      const rows = parseSheetRows(sheetXml, sharedStrings);
      console.log(`  ✓ Đã phân tích thành công ${rows.length.toLocaleString()} cặp câu đối sánh SNOW T23!`);

      const batchSize = 5000;
      const totalBatches = Math.ceil(rows.length / batchSize);

      for (let b = 0; b < totalBatches; b++) {
        if (limitUnits && successCount >= limitUnits) break;
        const batchRows = rows.slice(b * batchSize, (b + 1) * batchSize);
        const unitId = `snow_t23_unit_${String(b + 1).padStart(4, '0')}`;
        const unitKey = `jlpt_dokkai:${unitId}`;

        if (DriveFolderManager.hasAsset(unitKey)) {
          skipCount++;
          continue;
        }

        const payload = JSON.stringify({
          unitId,
          corpus: 'SNOW T23 (Crowdsourced Simplified Japanese Corpus)',
          source: 'Nagaoka University of Technology (Yamamoto Lab)',
          totalPairs: batchRows.length,
          pairs: batchRows,
        });

        const fileName = `${unitId}.json`;
        const entry = await DriveFolderManager.uploadAndRegister({
          key: unitKey,
          category: 'jlpt_dokkai',
          fileName,
          mimeType: 'application/json',
          content: Buffer.from(payload, 'utf-8'),
          folderId,
          sizeBytes: Buffer.byteLength(payload),
          metadata: {
            unitId,
            totalPairs: batchRows.length,
            batchIndex: b + 1,
            totalBatches,
            description: `5,000 aligned simplified Japanese sentences (SNOW T23 Unit ${b + 1}/${totalBatches})`,
          },
        });

        successCount++;
        console.log(`    📦 [SNOW T23] ${fileName} -> ${entry.fileId} (+${batchRows.length} câu đối sánh)`);
        await delay(300);
      }
    } catch (err: any) {
      console.warn('  ⚠️ Lỗi xử lý phân rã JSON SNOW T23:', err.message);
    }
  }

  console.log(`\n🎉 Hoàn thành Crawler SNOW Simplified Corpus: Thành công: +${successCount}, Bỏ qua: ${skipCount}, Lỗi: ${failCount}`);
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('snow-simplified-streamer.ts')) {
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : undefined;
  crawlSnowSimplifiedCorpus(limit).catch(console.error);
}
