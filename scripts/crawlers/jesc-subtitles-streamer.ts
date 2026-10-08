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

const JESC_TAR_URL = 'https://nlp.stanford.edu/projects/jesc/data/split.tar.gz';
const SENTENCES_PER_UNIT = 10000;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function crawlJescSubtitleCorpus(limitUnits?: number) {
  console.log('\n======================================================');
  console.log('🎬 [HF CRAWLER 2/3] JESC 3.2M SENTENCE MINING SUBTITLE CORPUS');
  console.log('     Thu thập toàn văn kho phụ đề song ngữ Nhật - Anh từ Stanford & Kyoto');
  console.log('======================================================');

  const folders = await DriveFolderManager.initFolders();
  const folderId = folders.jescSubtitlesFolderId;
  if (!folderId) {
    throw new Error('Chưa tìm thấy thư mục 10_JESC_Bilingual_Subtitle_Corpus trên Google Drive');
  }

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  console.log(`📁 Thư mục Google Drive đích: ${folderId}\n`);

  // 1. Tải và lưu trữ tệp nén gốc Master TAR.GZ nguyên bản (102 MB)
  const masterKey = 'jesc:split_master_tar_gz';
  if (DriveFolderManager.hasAsset(masterKey)) {
    console.log('  ✓ [Master Archive] jesc_split_master.tar.gz đã tồn tại trên Drive, bỏ qua.');
    skipCount++;
  } else {
    console.log('  ⬇️ [1/2] Đang stream tệp nén Master gốc (102 MB) trực tiếp lên Google Drive...');
    try {
      const entry = await StreamUploader.streamUploadFromUrl({
        url: JESC_TAR_URL,
        key: masterKey,
        category: 'jesc_subtitles',
        fileName: 'jesc_split_master.tar.gz',
        mimeType: 'application/gzip',
        folderId,
        metadata: {
          name: 'JESC Master Split Compressed Archive',
          source: 'Stanford NLP & Kyoto University',
          sourceUrl: JESC_TAR_URL,
          totalSentences: 3200000,
          description: '3.2M aligned Japanese-English subtitles from anime, films, dramas',
        },
      });
      successCount++;
      console.log(`  ✅ [Master] Streamed thành công: ${entry.fileName} (${((entry.sizeBytes || 0) / 1024 / 1024).toFixed(2)} MB)\n`);
    } catch (err: any) {
      console.warn('  ⚠️ Lỗi stream Master Archive:', err.message);
      failCount++;
    }
  }

  // Kiểm tra nếu toàn bộ 282 gói JESC đã tồn tại trên Drive
  if (
    DriveFolderManager.hasAsset('jesc_subtitles:jesc_train_batch_0280') &&
    DriveFolderManager.hasAsset('jesc_subtitles:jesc_test_batch_0001') &&
    DriveFolderManager.hasAsset('jesc_subtitles:jesc_dev_batch_0001')
  ) {
    console.log('  ✓ [Hoàn tất] Toàn bộ 282 gói câu phụ đề JESC (Train: 280, Dev: 1, Test: 1) đã được lưu trữ trọn vẹn trên Google Drive.');
    console.log(`\n🎉 Hoàn thành Crawler JESC: Thành công: +0, Bỏ qua: 282, Lỗi: 0`);
    return;
  }

  // 2. Stream-decompress và phân tách thành các gói 10,000 câu thoại song ngữ (In-Memory Streaming)
  console.log('  🔄 [2/2] Đang stream giải nén trực tiếp và phân rã các gói câu thoại ngữ cảnh...');

  await new Promise<void>((resolve, reject) => {
    https.get(JESC_TAR_URL, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} fetching JESC`));
        return;
      }

      const gunzip = zlib.createGunzip();
      res.pipe(gunzip);

      let tarBuffer = Buffer.alloc(0);
      let currentFile = '';
      let currentFileSize = 0;
      let currentFileRead = 0;
      let lineRemainder = '';
      let currentBatch: Array<{ id: string; en: string; ja: string }> = [];
      let currentBatchIndex = 1;
      let totalLinesProcessed = 0;

      const flushBatch = async (splitName: string) => {
        if (currentBatch.length === 0) return;
        const unitId = `jesc_${splitName}_batch_${String(currentBatchIndex).padStart(4, '0')}`;
        const unitKey = `jesc_subtitles:${unitId}`;
        currentBatchIndex++;

        if (DriveFolderManager.hasAsset(unitKey)) {
          skipCount++;
          currentBatch = [];
          if (limitUnits && successCount >= limitUnits) {
            try { res.destroy(); } catch {}
            try { gunzip.destroy(); } catch {}
            resolve();
            return;
          }
          return;
        }

        const batchCount = currentBatch.length;
        const payload = JSON.stringify({
          unitId,
          split: splitName,
          sentenceCount: batchCount,
          source: 'JESC (Stanford & Kyoto University)',
          pairs: currentBatch,
        });

        currentBatch = [];
        const fileName = `${unitId}.json`;

        try {
          gunzip.pause();
          const entry = await DriveFolderManager.uploadAndRegister({
            key: unitKey,
            category: 'jesc_subtitles',
            fileName,
            mimeType: 'application/json',
            content: Buffer.from(payload, 'utf-8'),
            folderId,
            sizeBytes: Buffer.byteLength(payload),
            metadata: {
              unitId,
              split: splitName,
              sentenceCount: batchCount,
              source: 'JESC Bilingual Corpus',
            },
          });
          successCount++;
          console.log(`    📦 [${splitName.toUpperCase()}] ${fileName} -> ${entry.fileId} (+${SENTENCES_PER_UNIT} câu song ngữ)`);
          await delay(250);
          gunzip.resume();
        } catch (upErr: any) {
          console.warn(`    ⚠️ Lỗi tải batch ${unitId}:`, upErr.message);
          failCount++;
          gunzip.resume();
        }
      };

      gunzip.on('data', async (chunk: Buffer) => {
        gunzip.pause();
        res.pause();
        try {
          tarBuffer = Buffer.concat([tarBuffer, chunk]);

          while (true) {
            if (!currentFile) {
              if (tarBuffer.length < 512) break;
              const header = tarBuffer.subarray(0, 512);
              tarBuffer = Buffer.from(tarBuffer.subarray(512));

              const rawName = header.subarray(0, 100).toString('ascii').replace(/\0.*$/, '').trim();
              const sizeStr = header.subarray(124, 136).toString('ascii').trim();
              const size = parseInt(sizeStr, 8);

              if (!rawName || isNaN(size)) continue;

              currentFile = rawName;
              currentFileSize = size;
              currentFileRead = 0;
              lineRemainder = '';
              currentBatchIndex = 1;
              console.log(`  📂 Phát hiện tệp trong TAR: 【${currentFile}】 (${((size) / 1024 / 1024).toFixed(2)} MB)`);
            }

            if (currentFile) {
              const neededForFile = currentFileSize - currentFileRead;
              const available = Math.min(tarBuffer.length, neededForFile);

              if (available > 0) {
                const textChunk = lineRemainder + tarBuffer.subarray(0, available).toString('utf-8');
                tarBuffer = Buffer.from(tarBuffer.subarray(available));
                currentFileRead += available;

                const lines = textChunk.split('\n');
                lineRemainder = lines.pop() || '';

                const splitName = path.basename(currentFile); // dev, test, train

                for (const line of lines) {
                  const parts = line.split('\t');
                  if (parts.length >= 2) {
                    const en = parts[0].trim();
                    const ja = parts[1].trim();
                    if (en && ja) {
                      totalLinesProcessed++;
                      currentBatch.push({
                        id: `jesc_${splitName}_${String(totalLinesProcessed).padStart(7, '0')}`,
                        en,
                        ja,
                      });

                      if (currentBatch.length >= SENTENCES_PER_UNIT) {
                        await flushBatch(splitName);
                        if (limitUnits && successCount >= limitUnits) {
                          try { res.destroy(); } catch {}
                          try { gunzip.destroy(); } catch {}
                          resolve();
                          return;
                        }
                      }
                    }
                  }
                }
              }

              if (currentFileRead >= currentFileSize) {
                // Xử lý nốt dòng còn lại
                if (lineRemainder) {
                  const parts = lineRemainder.split('\t');
                  if (parts.length >= 2) {
                    currentBatch.push({
                      id: `jesc_${path.basename(currentFile)}_${String(++totalLinesProcessed).padStart(7, '0')}`,
                      en: parts[0].trim(),
                      ja: parts[1].trim(),
                    });
                  }
                  lineRemainder = '';
                }

                const splitName = path.basename(currentFile);
                await flushBatch(splitName);

                // Bỏ qua padding tar 512 bytes
                const padding = (512 - (currentFileSize % 512)) % 512;
                if (tarBuffer.length >= padding) {
                  tarBuffer = Buffer.from(tarBuffer.subarray(padding));
                }
                currentFile = '';
              } else {
                break;
              }
            }
          }
        } finally {
          gunzip.resume();
          res.resume();
        }
      });

      gunzip.on('end', () => resolve());
      gunzip.on('error', (err) => {
        console.warn('  ⚠️ Cảnh báo luồng giải nén JESC gunzip:', err.message);
        resolve(); // Chuyển giao graceful thay vì crash cả orchestrator
      });
      res.on('error', (err) => {
        console.warn('  ⚠️ Cảnh báo kết nối mạng JESC:', err.message);
        resolve();
      });
    }).on('error', (err) => {
      console.warn('  ⚠️ Lỗi yêu cầu HTTPS JESC:', err.message);
      resolve();
    });
  });

  console.log(`\n🎉 Hoàn thành Crawler JESC Subtitle Corpus: Thành công: +${successCount}, Bỏ qua: ${skipCount}, Lỗi: ${failCount}`);
  return { successCount, skipCount, failCount };
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('jesc-subtitles-streamer.ts')) {
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : undefined;
  crawlJescSubtitleCorpus(limit).catch((err) => {
    console.error('Lỗi thực thi JESC Subtitle Crawler:', err);
    process.exit(1);
  });
}
