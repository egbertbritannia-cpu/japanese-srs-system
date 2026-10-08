import fs from 'fs';
import path from 'path';
import https from 'https';
import readline from 'readline';

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

const ROLEPLAY_JSONL_URL =
  'https://huggingface.co/datasets/OmniAICreator/Japanese-Roleplay-Dialogues/resolve/main/Japanese-Roleplay-Dialogues-Filtered.jsonl';
const DIALOGUES_PER_UNIT = 500;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function crawlRoleplayDialoguesCorpus(limitUnits?: number) {
  console.log('\n======================================================');
  console.log('💬 [HF CRAWLER] JAPANESE ROLEPLAY DIALOGUES CORPUS');
  console.log('     Thu thập kho đàm thoại ngữ cảnh đời thực Nhật Bản (Narikiri Chat)');
  console.log('======================================================');

  const folders = await DriveFolderManager.initFolders();
  const folderId = folders.jescSubtitlesFolderId;
  if (!folderId) {
    throw new Error('Chưa tìm thấy thư mục 10_JESC_Bilingual_Subtitle_Corpus trên Google Drive');
  }

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  // 1. Tải và lưu trữ tệp Master JSONL gốc (317 MB) trực tiếp lên Google Drive
  const masterKey = 'jesc_subtitles:roleplay_dialogues_master_jsonl';
  if (DriveFolderManager.hasAsset(masterKey)) {
    console.log('  ✓ [Master Archive] japanese_roleplay_dialogues_filtered_master.jsonl đã có trên Drive, bỏ qua.');
    skipCount++;
  } else {
    console.log('  ⬇️ [1/2] Đang stream tệp gốc Master JSONL (317 MB) trực tiếp lên Google Drive...');
    try {
      const entry = await StreamUploader.streamUploadFromUrl({
        url: ROLEPLAY_JSONL_URL,
        key: masterKey,
        category: 'jesc_subtitles',
        fileName: 'japanese_roleplay_dialogues_filtered_master.jsonl',
        mimeType: 'application/jsonl',
        folderId,
        metadata: {
          name: 'Japanese Roleplay Dialogues Filtered Master Corpus',
          source: 'OmniAICreator & Narikiri Japanese Forums',
          sourceUrl: ROLEPLAY_JSONL_URL,
          description: 'Filtered conversational corpus of authentic multi-turn Japanese roleplay dialogues',
        },
      });
      successCount++;
      console.log(`  ✅ [Master] Streamed thành công: ${entry.fileName} (${((entry.sizeBytes || 0) / 1024 / 1024).toFixed(2)} MB)\n`);
    } catch (err: any) {
      console.warn('  ⚠️ Lỗi stream Master JSONL:', err.message);
      failCount++;
    }
  }

  // 2. Stream và phân tách thành các gói JSON hội thoại tiện ích (In-Memory Streaming)
  console.log('  🔄 [2/2] Đang stream đọc theo dòng và phân rã các gói hội thoại đời thường...');

  function getStreamWithRedirects(targetUrl: string, hops = 0): Promise<import('http').IncomingMessage> {
    if (hops > 5) return Promise.reject(new Error('Too many redirects'));
    return new Promise((resolve, reject) => {
      https.get(targetUrl, (res) => {
        if (res.statusCode && [301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
          res.resume();
          resolve(getStreamWithRedirects(res.headers.location, hops + 1));
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} fetching Roleplay Dialogues`));
          return;
        }
        resolve(res);
      }).on('error', reject);
    });
  }

  try {
    const stream = await getStreamWithRedirects(ROLEPLAY_JSONL_URL);
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

    let currentBatch: any[] = [];
    let batchIndex = 1;

    for await (const line of rl) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      try {
        const dialogue = JSON.parse(trimmed);
        currentBatch.push(dialogue);
      } catch {
        continue;
      }

      if (currentBatch.length >= DIALOGUES_PER_UNIT) {
        const unitId = `roleplay_dialogues_unit_${String(batchIndex).padStart(4, '0')}`;
        const unitKey = `jesc_subtitles:${unitId}`;
        batchIndex++;

        if (DriveFolderManager.hasAsset(unitKey)) {
          skipCount++;
          currentBatch = [];
          continue;
        }

        const itemsToSave = [...currentBatch];
        currentBatch = [];

        const payload = JSON.stringify({
          unitId,
          corpus: 'Japanese Roleplay Dialogues Filtered Corpus (Narikiri Chat)',
          dialogueCount: itemsToSave.length,
          dialogues: itemsToSave,
        });

        const fileName = `${unitId}.json`;
        try {
          const entry = await DriveFolderManager.uploadAndRegister({
            key: unitKey,
            category: 'jesc_subtitles',
            fileName,
            mimeType: 'application/json',
            content: Buffer.from(payload, 'utf-8'),
            folderId: folderId!,
            sizeBytes: Buffer.byteLength(payload),
            metadata: {
              unitId,
              dialogueCount: itemsToSave.length,
              source: 'Japanese Roleplay Dialogues Corpus',
            },
          });
          successCount++;
          console.log(`    📦 [ROLEPLAY] ${fileName} -> ${entry.fileId} (+${itemsToSave.length} đoạn đàm thoại)`);
          await delay(300);
        } catch (upErr: any) {
          console.warn(`    ⚠️ Lỗi tải batch ${unitId}:`, upErr.message);
          failCount++;
        }

        if (limitUnits && successCount >= limitUnits) {
          break;
        }
      }
    }

    if (currentBatch.length > 0 && (!limitUnits || successCount < limitUnits)) {
      const unitId = `roleplay_dialogues_unit_${String(batchIndex).padStart(4, '0')}`;
      const unitKey = `jesc_subtitles:${unitId}`;
      if (!DriveFolderManager.hasAsset(unitKey)) {
        const itemsToSave = [...currentBatch];
        currentBatch = [];
        const payload = JSON.stringify({
          unitId,
          corpus: 'Japanese Roleplay Dialogues Filtered Corpus (Narikiri Chat)',
          dialogueCount: itemsToSave.length,
          dialogues: itemsToSave,
        });
        const fileName = `${unitId}.json`;
        try {
          const entry = await DriveFolderManager.uploadAndRegister({
            key: unitKey,
            category: 'jesc_subtitles',
            fileName,
            mimeType: 'application/json',
            content: Buffer.from(payload, 'utf-8'),
            folderId: folderId!,
            sizeBytes: Buffer.byteLength(payload),
            metadata: {
              unitId,
              dialogueCount: itemsToSave.length,
              source: 'Japanese Roleplay Dialogues Corpus',
            },
          });
          successCount++;
          console.log(`    📦 [ROLEPLAY] ${fileName} -> ${entry.fileId} (+${itemsToSave.length} đoạn đàm thoại)`);
        } catch (upErr: any) {
          console.warn(`    ⚠️ Lỗi tải batch ${unitId}:`, upErr.message);
          failCount++;
        }
      }
    }

    rl.close();
    stream.destroy();
  } catch (err: any) {
    console.warn('  ⚠️ Lỗi xử lý Roleplay Dialogues:', err.message);
    failCount++;
  }

  console.log(`\n🎉 Hoàn thành Crawler Roleplay Dialogues: Thành công: +${successCount}, Bỏ qua: ${skipCount}, Lỗi: ${failCount}`);
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('roleplay-dialogues-streamer.ts')) {
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : undefined;
  crawlRoleplayDialoguesCorpus(limit).catch(console.error);
}
