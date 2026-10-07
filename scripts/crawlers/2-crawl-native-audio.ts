import fs from 'fs';
import path from 'path';
import https from 'https';
import { db } from '../../src/db/client';
import { cards } from '../../src/db/schema';
import { inArray } from 'drizzle-orm';
import { DriveFolderManager } from './drive-folder-manager';

function fetchAudioBuffer(text: string): Promise<Buffer> {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=ja&client=tw-ob`;
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

export async function crawlJapaneseNativeAudio(limit?: number) {
  console.log('\n======================================================');
  console.log('🎙️ [CRAWLER 2/5] CÀO ÂM THANH PHÁT ÂM TIẾNG NHẬT BẢN XỨ (MP3)');
  console.log('======================================================');

  const folders = await DriveFolderManager.initFolders();
  const folderId = folders.japaneseAudioFolderId;
  const manifest = DriveFolderManager.getManifest();

  // 1. Lấy toàn bộ từ vựng từ deck_jpd133 và deck_n5
  const vocabCards = await db.select().from(cards).where(
    inArray(cards.deckId, ['deck_jpd133', 'deck_n5'])
  );
  console.log(`📋 Tổng số thẻ từ vựng cần xử lý âm thanh: ${vocabCards.length}`);

  // Gom các từ vựng độc nhất (dùng text tiếng Nhật hoặc reading)
  const uniqueWords = new Map<string, { front: string; reading: string; id: string }>();
  for (const card of vocabCards) {
    const cleanWord = card.front.replace(/\{\{c\d+::(.*?)\}\}/g, '$1').trim();
    if (cleanWord && !uniqueWords.has(cleanWord)) {
      uniqueWords.set(cleanWord, {
        front: cleanWord,
        reading: card.reading || cleanWord,
        id: card.id,
      });
    }
  }

  const wordList = Array.from(uniqueWords.values());
  console.log(`🔍 Tìm thấy ${wordList.length} từ vựng độc nhất.`);

  const listToProcess = limit ? wordList.slice(0, limit) : wordList;
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (let i = 0; i < listToProcess.length; i++) {
    const item = listToProcess[i];
    const key = `vocab_audio:${item.front}`;

    if (manifest.assets[key]) {
      skipCount++;
      process.stdout.write(`⏭️ [${i + 1}/${listToProcess.length}] ${item.front} (Đã có sẵn trên Drive)\r`);
      continue;
    }

    try {
      const buffer = await fetchAudioBuffer(item.front);
      const safeFileName = `audio_${encodeURIComponent(item.front).replace(/%/g, '_')}.mp3`;

      const entry = await DriveFolderManager.uploadAndRegister({
        key,
        category: 'vocab_audio',
        fileName: safeFileName,
        mimeType: 'audio/mpeg',
        content: buffer,
        folderId,
      });

      successCount++;
      console.log(`✅ [${i + 1}/${listToProcess.length}] ${item.front} (${item.reading}) [${buffer.length} bytes] -> Uploaded: ${entry.fileId}`);
      await delay(150);
    } catch (err: any) {
      failCount++;
      console.error(`❌ [${i + 1}/${listToProcess.length}] ${item.front} Thất bại: ${err.message}`);
    }
  }

  console.log(`\n🎉 Hoàn thành Crawler 2: Thành công: ${successCount}, Bỏ qua: ${skipCount}, Lỗi: ${failCount}`);
}

if (process.argv[1].endsWith('2-crawl-native-audio.ts')) {
  crawlJapaneseNativeAudio().catch(console.error);
}
