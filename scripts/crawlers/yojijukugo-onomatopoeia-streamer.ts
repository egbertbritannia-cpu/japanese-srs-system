import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
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

const BASE_RELEASE_URL = 'https://github.com/scriptin/jmdict-simplified/releases/download/3.6.2%2B20261005200550';
const KANJIDIC_URL = `${BASE_RELEASE_URL}/kanjidic2-en-3.6.2+20261005200550.json.tgz`;
const JMDICT_URL = `${BASE_RELEASE_URL}/jmdict-eng-3.6.2+20261005200550.json.tgz`;
const EXAMPLES_URL = `${BASE_RELEASE_URL}/jmdict-examples-eng-3.6.2+20261005200550.json.tgz`;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchWithRedirects(targetUrl: string): Promise<http.IncomingMessage> {
  return new Promise((resolve, reject) => {
    https.get(targetUrl, (res) => {
      if (res.statusCode && [301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        return fetchWithRedirects(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} fetching ${targetUrl}`));
        return;
      }
      resolve(res);
    }).on('error', reject);
  });
}

async function streamGunzipToBuffer(url: string, maxBytes?: number): Promise<Buffer> {
  const res = await fetchWithRedirects(url);
  const gunzip = zlib.createGunzip();
  res.pipe(gunzip);

  const chunks: Buffer[] = [];
  let total = 0;

  return new Promise<Buffer>((resolve, reject) => {
    gunzip.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
      total += chunk.length;
      if (maxBytes && total >= maxBytes) {
        res.destroy();
        gunzip.destroy();
        resolve(Buffer.concat(chunks));
      }
    });
    gunzip.on('end', () => resolve(Buffer.concat(chunks)));
    gunzip.on('error', reject);
    res.on('error', reject);
  });
}

export async function crawlYojijukugoAndOnomatopoeia(limit?: number) {
  console.log('\n======================================================');
  console.log('🏮 [HF CRAWLER 3/3] YOJIJUKUGO & ONOMATOPOEIA MASTER LEXICON');
  console.log('     Thu thập toàn văn Thành ngữ 4 chữ, Từ tượng thanh & Phân tích Kanji');
  console.log('======================================================');

  const folders = await DriveFolderManager.initFolders();
  const folderId = folders.yojijukugoLexiconFolderId;
  if (!folderId) {
    throw new Error('Chưa tìm thấy thư mục 11_Yojijukugo_Onomatopoeia_Lexicon trên Google Drive');
  }

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  console.log(`📁 Thư mục Google Drive đích: ${folderId}\n`);

  // 1. Tải và lưu trữ 3 tệp Master Archives nén trực tiếp lên Google Drive
  const MASTER_FILES = [
    { key: 'kanjidic2_master_tgz', name: 'kanjidic2_master.json.tgz', url: KANJIDIC_URL, desc: '13,108 Kanji với nét vẽ, bộ thủ, âm Hán' },
    { key: 'jmdict_master_tgz', name: 'jmdict_master.json.tgz', url: JMDICT_URL, desc: 'Đại từ điển tiếng Nhật JMdict 2026' },
    { key: 'jmdict_examples_master_tgz', name: 'jmdict_examples_master.json.tgz', url: EXAMPLES_URL, desc: '150,000+ câu ví dụ ngữ cảnh song ngữ' },
  ];

  for (const mf of MASTER_FILES) {
    const fullKey = `yojijukugo_onomatopoeia:${mf.key}`;
    if (DriveFolderManager.hasAsset(fullKey)) {
      console.log(`  ✓ [Master] ${mf.name} đã tồn tại trên Drive, bỏ qua.`);
      skipCount++;
    } else {
      console.log(`  ⬇️ Đang stream tệp nén gốc: ${mf.name}...`);
      try {
        const entry = await StreamUploader.streamUploadFromUrl({
          url: mf.url,
          key: fullKey,
          category: 'yojijukugo_onomatopoeia',
          fileName: mf.name,
          mimeType: 'application/gzip',
          folderId,
          metadata: {
            name: mf.name,
            description: mf.desc,
            source: 'EDRDG / scriptin jmdict-simplified',
          },
        });
        successCount++;
        console.log(`  ✅ [Master] Streamed: ${entry.fileName} (${((entry.sizeBytes || 0) / 1024 / 1024).toFixed(2)} MB)`);
        await delay(300);
      } catch (err: any) {
        console.warn(`  ⚠️ Lỗi stream ${mf.name}:`, err.message);
        failCount++;
      }
    }
  }

  // 2. Tải Kanjidic2 vào bộ nhớ để xây dựng bản đồ phân tích Hán Tự (Kanji Decomposition Map)
  console.log('\n  🔍 [1/3] Đang phân tích KANJIDIC2 (13,108 chữ Hán)...');
  const kanjiMap = new Map<string, any>();
  try {
    const kanjiBuffer = await streamGunzipToBuffer(KANJIDIC_URL);
    // Parse TAR archive containing JSON
    let offset = 0;
    while (offset + 512 <= kanjiBuffer.length) {
      const header = kanjiBuffer.subarray(offset, offset + 512);
      const name = header.subarray(0, 100).toString('ascii').replace(/\0.*$/, '').trim();
      const sizeStr = header.subarray(124, 136).toString('ascii').trim();
      const size = parseInt(sizeStr, 8);
      offset += 512;

      if (name.endsWith('.json') && !isNaN(size)) {
        const jsonContent = kanjiBuffer.subarray(offset, offset + size).toString('utf-8');
        const parsed = JSON.parse(jsonContent);
        for (const char of parsed.characters || []) {
          kanjiMap.set(char.literal, {
            literal: char.literal,
            strokeCounts: char.strokeCounts || [],
            grade: char.grade,
            jlpt: char.jlpt,
            meanings: (char.readingMeaning?.groups?.[0]?.meanings || []).map((m: any) => typeof m === 'string' ? m : m.value).slice(0, 5),
            onYomi: (char.readingMeaning?.groups?.[0]?.readings || []).filter((r: any) => r.type === 'ja_on').map((r: any) => r.value),
            kunYomi: (char.readingMeaning?.groups?.[0]?.readings || []).filter((r: any) => r.type === 'ja_kun').map((r: any) => r.value),
          });
        }
        break;
      }
      offset += Math.ceil(size / 512) * 512;
    }
    console.log(`  ✓ Đã lập chỉ mục chi tiết: ${kanjiMap.size} chữ Hán Kanji.`);
  } catch (kErr: any) {
    console.warn('  ⚠️ Lỗi tải KANJIDIC2:', kErr.message);
  }

  // 3. Phân tách Yojijukugo & Onomatopoeia từ JMdict
  console.log('  🔍 [2/3] Đang trích xuất Yojijukugo (四字熟語) & Onomatopoeia (オノマトペ) từ JMdict...');
  const yojijukugoList: any[] = [];
  const onomatopoeiaList: any[] = [];

  try {
    const jmdictBuffer = await streamGunzipToBuffer(JMDICT_URL);
    let offset = 0;
    while (offset + 512 <= jmdictBuffer.length) {
      const header = jmdictBuffer.subarray(offset, offset + 512);
      const name = header.subarray(0, 100).toString('ascii').replace(/\0.*$/, '').trim();
      const sizeStr = header.subarray(124, 136).toString('ascii').trim();
      const size = parseInt(sizeStr, 8);
      offset += 512;

      if (name.endsWith('.json') && !isNaN(size)) {
        const jsonContent = jmdictBuffer.subarray(offset, offset + size).toString('utf-8');
        const parsed = JSON.parse(jsonContent);

        for (const word of parsed.words || []) {
          const kanjiTexts = (word.kanji || []).map((k: any) => k.text);
          const kanaTexts = (word.kana || []).map((k: any) => k.text);
          const senses = word.sense || [];

          let isYoji = false;
          let isOnomatopoeia = false;
          const meanings: string[] = [];
          const posList: string[] = [];

          for (const s of senses) {
            for (const g of s.gloss || []) {
              if (g.text && !meanings.includes(g.text)) meanings.push(g.text);
            }
            for (const p of s.partOfSpeech || []) {
              if (!posList.includes(p)) posList.push(p);
            }
            const misc = s.misc || [];
            if (misc.includes('yojijukugo') || misc.includes('&yoji;')) isYoji = true;
            if (misc.includes('on-mim') || misc.includes('onomatopoeic or mimetic word')) isOnomatopoeia = true;
          }

          // Kiểm tra hình thái 4 chữ Hán cho Yojijukugo
          const primaryKanji = kanjiTexts[0] || '';
          if (!isYoji && primaryKanji.length === 4 && /^[\u4e00-\u9faf]{4}$/.test(primaryKanji)) {
            isYoji = true;
          }

          // Kiểm tra hình thái lặp âm cho Onomatopoeia (AABB, ABAB: ドキドキ, キラキラ, ペラペラ)
          const primaryKana = kanaTexts[0] || '';
          if (!isOnomatopoeia && primaryKana.length >= 4) {
            const half = primaryKana.length / 2;
            if (primaryKana.slice(0, half) === primaryKana.slice(half)) {
              isOnomatopoeia = true;
            }
          }

          // 1. Thu thập Yojijukugo
          if (isYoji && primaryKanji.length === 4) {
            const kanjiBreakdown = primaryKanji.split('').map((char: string) => kanjiMap.get(char) || { literal: char });
            yojijukugoList.push({
              id: `yoji_${primaryKanji}`,
              idiom: primaryKanji,
              reading: kanaTexts[0] || '',
              allKanji: kanjiTexts,
              allReadings: kanaTexts,
              meanings: meanings.slice(0, 8),
              partOfSpeech: posList,
              kanjiBreakdown,
            });
          }

          // 2. Thu thập Onomatopoeia
          if (isOnomatopoeia && (primaryKana || primaryKanji)) {
            const wordDisplay = primaryKanji || primaryKana;
            let onomType = 'Gitaigo (擬態語 - Diễn tả trạng thái/cảm giác)';
            if (posList.includes('adv-to')) onomType = 'Giongo (擬音語 - Âm thanh sự vật)';

            onomatopoeiaList.push({
              id: `onoma_${wordDisplay}`,
              word: wordDisplay,
              reading: primaryKana,
              meanings: meanings.slice(0, 8),
              partOfSpeech: posList,
              type: onomType,
            });
          }
        }
        break;
      }
      offset += Math.ceil(size / 512) * 512;
    }

    console.log(`  ✓ Đã trích xuất thành công: ${yojijukugoList.length} Thành ngữ 4 chữ Yojijukugo.`);
    console.log(`  ✓ Đã trích xuất thành công: ${onomatopoeiaList.length} Từ tượng thanh/tượng hình Onomatopoeia.`);
  } catch (jErr: any) {
    console.warn('  ⚠️ Lỗi phân tích JMdict:', jErr.message);
  }

  // 4. Phân tách thành các gói học tập chuyên biệt và tải lên Google Drive
  console.log('\n  📦 [3/3] Đang tải các gói từ điển và bài học chuyên sâu lên Google Drive...');

  // A. Master Dictionaries
  const MASTER_DICTS = [
    { key: 'yojijukugo_master_dict', name: 'yojijukugo_master_dictionary.json', data: yojijukugoList, count: yojijukugoList.length, type: 'yojijukugo' },
    { key: 'onomatopoeia_master_dict', name: 'onomatopoeia_master_dictionary.json', data: onomatopoeiaList, count: onomatopoeiaList.length, type: 'onomatopoeia' },
  ];

  for (const md of MASTER_DICTS) {
    const fullKey = `yojijukugo_onomatopoeia:${md.key}`;
    if (DriveFolderManager.hasAsset(fullKey)) {
      console.log(`  ✓ [Master Dict] ${md.name} đã có trên Drive, bỏ qua.`);
      skipCount++;
    } else {
      const payload = JSON.stringify({
        name: md.name,
        type: md.type,
        totalEntries: md.count,
        generatedAt: new Date().toISOString(),
        entries: md.data,
      }, null, 2);

      const entry = await DriveFolderManager.uploadAndRegister({
        key: fullKey,
        category: 'yojijukugo_onomatopoeia',
        fileName: md.name,
        mimeType: 'application/json',
        content: Buffer.from(payload, 'utf-8'),
        folderId,
        sizeBytes: Buffer.byteLength(payload),
        metadata: {
          name: md.name,
          type: md.type,
          totalEntries: md.count,
        },
      });
      successCount++;
      console.log(`  ✅ [Master Dict] Đã tải lên: ${md.name} (${md.count} mục, ${((entry.sizeBytes || 0) / 1024 / 1024).toFixed(2)} MB)`);
      await delay(300);
    }
  }

  // B. Các gói phân đoạn 100 mục / tệp (Yojijukugo Units)
  const YOJI_CHUNK = 100;
  const yojiChunks = Math.ceil(yojijukugoList.length / YOJI_CHUNK);
  for (let c = 0; c < yojiChunks; c++) {
    if (limit && successCount >= limit) break;
    const unitId = `yoji_unit_${String(c + 1).padStart(3, '0')}`;
    const unitKey = `yojijukugo_onomatopoeia:${unitId}`;

    if (DriveFolderManager.hasAsset(unitKey)) {
      skipCount++;
      continue;
    }

    const slice = yojijukugoList.slice(c * YOJI_CHUNK, (c + 1) * YOJI_CHUNK);
    const payload = JSON.stringify({
      unitId,
      unitIndex: c + 1,
      totalUnits: yojiChunks,
      entryCount: slice.length,
      entries: slice,
    }, null, 2);

    const fileName = `${unitId}.json`;
    const entry = await DriveFolderManager.uploadAndRegister({
      key: unitKey,
      category: 'yojijukugo_onomatopoeia',
      fileName,
      mimeType: 'application/json',
      content: Buffer.from(payload, 'utf-8'),
      folderId,
      sizeBytes: Buffer.byteLength(payload),
      metadata: {
        unitId,
        entryCount: slice.length,
        type: 'yojijukugo_study_unit',
      },
    });
    successCount++;
    console.log(`    🏮 [Yoji Unit ${c + 1}/${yojiChunks}] ${fileName} -> ${entry.fileId} (+${slice.length} thành ngữ)`);
    await delay(250);
  }

  // C. Các gói phân đoạn 100 mục / tệp (Onomatopoeia Units)
  const ONOMA_CHUNK = 100;
  const onomaChunks = Math.ceil(onomatopoeiaList.length / ONOMA_CHUNK);
  for (let c = 0; c < onomaChunks; c++) {
    if (limit && successCount >= limit) break;
    const unitId = `onoma_unit_${String(c + 1).padStart(3, '0')}`;
    const unitKey = `yojijukugo_onomatopoeia:${unitId}`;

    if (DriveFolderManager.hasAsset(unitKey)) {
      skipCount++;
      continue;
    }

    const slice = onomatopoeiaList.slice(c * ONOMA_CHUNK, (c + 1) * ONOMA_CHUNK);
    const payload = JSON.stringify({
      unitId,
      unitIndex: c + 1,
      totalUnits: onomaChunks,
      entryCount: slice.length,
      entries: slice,
    }, null, 2);

    const fileName = `${unitId}.json`;
    const entry = await DriveFolderManager.uploadAndRegister({
      key: unitKey,
      category: 'yojijukugo_onomatopoeia',
      fileName,
      mimeType: 'application/json',
      content: Buffer.from(payload, 'utf-8'),
      folderId,
      sizeBytes: Buffer.byteLength(payload),
      metadata: {
        unitId,
        entryCount: slice.length,
        type: 'onomatopoeia_study_unit',
      },
    });
    successCount++;
    console.log(`    ✨ [Onoma Unit ${c + 1}/${onomaChunks}] ${fileName} -> ${entry.fileId} (+${slice.length} từ tượng thanh)`);
    await delay(250);
  }

  console.log(`\n🎉 Hoàn thành Crawler Yojijukugo & Onomatopoeia: Thành công: +${successCount}, Bỏ qua: ${skipCount}, Lỗi: ${failCount}`);
  return { successCount, skipCount, failCount };
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('yojijukugo-onomatopoeia-streamer.ts')) {
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : undefined;
  crawlYojijukugoAndOnomatopoeia(limit).catch((err) => {
    console.error('Lỗi thực thi Yojijukugo & Onomatopoeia Crawler:', err);
    process.exit(1);
  });
}
