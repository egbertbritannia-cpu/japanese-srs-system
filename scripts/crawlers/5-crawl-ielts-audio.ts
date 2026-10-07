import fs from 'fs';
import path from 'path';
import https from 'https';
import { db } from '../../src/db/client';
import { engVocab } from '../../src/db/schema';
import { DriveFolderManager } from './drive-folder-manager';

function fetchBritishAudio(text: string): Promise<Buffer> {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en-GB&client=tw-ob`;
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const chunks: Buffer[] = [];
      res.on('data', chunk => chunks.push(Buffer.from(chunk)));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function crawlIeltsAudioBank(limit?: number) {
  console.log('\n======================================================');
  console.log('🎧 [CRAWLER 5/5] CÀO ÂM THANH PHÁT ÂM IELTS OXFORD NATIVE (MP3)');
  console.log('======================================================');

  const folders = await DriveFolderManager.initFolders();
  const folderId = folders.ieltsAudioFolderId;
  const manifest = DriveFolderManager.getManifest();

  // 1. Lấy từ vựng IELTS học thuật từ eng_vocab
  const vocabList = await db.select().from(engVocab);
  console.log(`📋 Tổng số từ vựng IELTS trong cơ sở dữ liệu: ${vocabList.length}`);

  // Thêm một số từ học thuật Cambridge cốt lõi nếu DB chưa có nhiều
  const defaultIeltsWords = [
    'ubiquitous', 'paradigm', 'empirical', 'pragmatic', 'juxtaposition',
    'corroborate', 'mitigate', 'disseminate', 'meticulous', 'anomaly',
    'ephemeral', 'lucid', 'esoteric', 'pervasive', 'tenacious',
    'proliferation', 'exacerbate', 'retention', 'cognitive', 'pedagogy'
  ];

  const wordsToProcess = new Set<string>();
  vocabList.forEach((v: any) => wordsToProcess.add(v.word.toLowerCase().trim()));
  defaultIeltsWords.forEach(w => wordsToProcess.add(w));

  const list = Array.from(wordsToProcess);
  console.log(`🔍 Tìm thấy ${list.length} từ vựng IELTS học thuật cần xử lý.`);

  const listToProcess = limit ? list.slice(0, limit) : list;
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (let i = 0; i < listToProcess.length; i++) {
    const word = listToProcess[i];
    const key = `ielts_audio:${word}`;

    if (manifest.assets[key]) {
      skipCount++;
      process.stdout.write(`⏭️ [${i + 1}/${listToProcess.length}] ${word} (Đã có sẵn trên Drive)\r`);
      continue;
    }

    try {
      const buffer = await fetchBritishAudio(word);
      const safeFileName = `ielts_${encodeURIComponent(word).replace(/%/g, '_')}.mp3`;

      const entry = await DriveFolderManager.uploadAndRegister({
        key,
        category: 'ielts_audio',
        fileName: safeFileName,
        mimeType: 'audio/mpeg',
        content: buffer,
        folderId,
      });

      successCount++;
      console.log(`✅ [${i + 1}/${listToProcess.length}] ${word} [${buffer.length} bytes] -> Uploaded: ${entry.fileId}`);
      await delay(150);
    } catch (err: any) {
      failCount++;
      console.error(`❌ [${i + 1}/${listToProcess.length}] ${word} Thất bại: ${err.message}`);
    }
  }

  console.log(`\n🎉 Hoàn thành Crawler 5: Thành công: ${successCount}, Bỏ qua: ${skipCount}, Lỗi: ${failCount}`);
}

if (process.argv[1].endsWith('5-crawl-ielts-audio.ts')) {
  crawlIeltsAudioBank().catch(console.error);
}
