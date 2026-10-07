import { db } from '../../src/db/client';
import { cards } from '../../src/db/schema';
import { inArray } from 'drizzle-orm';
import { DriveFolderManager } from './drive-folder-manager';
import { StreamUploader } from './stream-uploader';

interface TatoebaSentence {
  id: number;
  text: string;
  lang: string;
  audios?: Array<{
    id: number;
    author: string;
    download_url?: string;
  }>;
  translations?: Array<Array<{
    id: number;
    text: string;
    lang: string;
  }>>;
}

/**
 * Tìm kiếm câu thoại tiếng Nhật có âm thanh người bản xứ Tokyo thu âm trực tiếp
 * Sử dụng Tatoeba API v0 chính thức (chỉ chọn câu có audio thật từ native speaker).
 */
async function searchTatoebaAudio(query: string): Promise<TatoebaSentence | null> {
  const url = `https://tatoeba.org/en/api_v0/search?from=jpn&query=${encodeURIComponent(query)}&has_audio=yes`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'KiokudoSRS/1.0 (Japanese Spaced Repetition Platform; Educational Native Audio Engine)',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) return null;
    const data: any = await res.json();
    const results: TatoebaSentence[] = data.results || [];
    
    // Tìm câu có audio hợp lệ từ người bản xứ
    const found = results.find(r => r.audios && r.audios.length > 0);
    return found || null;
  } catch {
    return null;
  }
}

/**
 * Tìm kiếm âm thanh phát âm bản xứ từ Wikimedia Commons (Wiktionary Japanese Audio Project)
 * Toàn bộ là phát âm người thật bản xứ Tokyo (KHÔNG DÙNG SYNTHETIC TTS).
 */
async function checkWikimediaNativeAudio(word: string): Promise<string | null> {
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/Ja-${encodeURIComponent(word)}.ogg`;
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'KiokudoSRS/1.0 (Educational Japanese Audio Fetcher)',
      },
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok && res.status === 200) {
      return url;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Lấy danh sách câu tiếng Nhật bản xứ có audio từ trang tổng hợp Tatoeba
 */
async function fetchTatoebaFeed(page = 1): Promise<TatoebaSentence[]> {
  const url = `https://tatoeba.org/en/api_v0/search?from=jpn&has_audio=yes&sort=relevance&page=${page}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'KiokudoSRS/1.0 (Japanese Spaced Repetition Platform)',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return [];
    const data: any = await res.json();
    return (data.results || []).filter((r: any) => r.audios && r.audios.length > 0);
  } catch {
    return [];
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function crawlTatoebaNativeAudio(limit?: number) {
  console.log('\n======================================================');
  console.log('🎙️ [CRAWLER 1/6] TATOEBA & NHK NATIVE JAPANESE AUDIO BANK');
  console.log('     Thu thập âm thanh người thật bản xứ Tokyo (NÓI KHÔNG VỚI TTS)');
  console.log('======================================================');

  const folders = await DriveFolderManager.initFolders();
  const folderId = folders.japaneseAudioFolderId;
  const manifest = DriveFolderManager.getManifest(true);

  // Dọn dẹp các asset dùng Google Translate TTS cũ nếu có trong manifest
  const vocabPartition = DriveFolderManager.getPartition('vocab_audio');
  for (const [key, asset] of Object.entries(vocabPartition.assets)) {
    if (asset.category === 'vocab_audio' && asset.metadata?.sourceUrl?.includes('translate.google.com')) {
      console.log(`🧹 Loại bỏ asset synthetic TTS cũ: ${key}`);
      DriveFolderManager.removeAsset(key);
    }
  }

  // 1. Thu thập từ vựng từ cơ sở dữ liệu
  const vocabCards = await db.select().from(cards).where(
    inArray(cards.deckId, ['deck_jpd133', 'deck_n5'])
  );
  console.log(`📋 Tổng số thẻ từ vựng: ${vocabCards.length}`);

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
  const listToProcess = limit ? wordList.slice(0, limit) : wordList;
  console.log(`🎯 Xử lý ${listToProcess.length} từ vựng mục tiêu.`);

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (let i = 0; i < listToProcess.length; i++) {
    const item = listToProcess[i];
    const key = `vocab_audio:${item.front}`;

    const partition = DriveFolderManager.getPartition('vocab_audio');
    if (partition.assets[key]) {
      const existing = partition.assets[key];
      // Nếu đã có và không phải là synthetic TTS
      if (!existing.metadata?.sourceUrl?.includes('translate.google.com')) {
        skipCount++;
        process.stdout.write(`⏭️ [${i + 1}/${listToProcess.length}] ${item.front} (Đã có audio bản xứ trên Drive)\r`);
        continue;
      }
    }

    try {
      // 1. Tìm câu thoại người bản xứ trên Tatoeba
      let sentence = await searchTatoebaAudio(item.front);
      if (!sentence && item.reading && item.reading !== item.front) {
        sentence = await searchTatoebaAudio(item.reading);
      }

      if (sentence && sentence.audios && sentence.audios.length > 0) {
        const audioInfo = sentence.audios[0];
        const audioUrl = `https://tatoeba.org/en/audio/download/${audioInfo.id}`;
        const fileName = `tatoeba_${audioInfo.id}_${encodeURIComponent(item.front).replace(/%/g, '_')}.mp3`;

        // Tìm bản dịch tiếng Anh/Việt
        let translationText = '';
        if (sentence.translations) {
          for (const group of sentence.translations) {
            for (const t of group) {
              if (t.lang === 'vie' || t.lang === 'eng') {
                translationText = t.text;
                break;
              }
            }
            if (translationText) break;
          }
        }

        const entry = await StreamUploader.streamUploadFromUrl({
          url: audioUrl,
          key,
          category: 'vocab_audio',
          fileName,
          mimeType: 'audio/mpeg',
          folderId,
          metadata: {
            word: item.front,
            reading: item.reading,
            sentenceText: sentence.text,
            translation: translationText,
            tatoebaSentenceId: sentence.id,
            tatoebaAudioId: audioInfo.id,
            speaker: audioInfo.author || 'Native Japanese Tokyo Speaker',
            source: 'Tatoeba Native Audio Project',
            sourceUrl: audioUrl,
          },
        });

        successCount++;
        console.log(`✅ [${i + 1}/${listToProcess.length}] ${item.front} -> Tatoeba Native: "${sentence.text}" [${audioInfo.author}] (${entry.fileId})`);
      } else {
        // 2. Thử nguồn âm thanh bản xứ Wiktionary / Wikimedia Commons
        const wikiAudio = await checkWikimediaNativeAudio(item.front);
        if (wikiAudio) {
          const fileName = `wiki_${encodeURIComponent(item.front).replace(/%/g, '_')}.ogg`;
          const entry = await StreamUploader.streamUploadFromUrl({
            url: wikiAudio,
            key,
            category: 'vocab_audio',
            fileName,
            mimeType: 'audio/ogg',
            folderId,
            metadata: {
              word: item.front,
              reading: item.reading,
              speaker: 'Native Japanese Speaker (Wikimedia/Wiktionary)',
              source: 'Wikimedia Commons Japanese Audio',
              sourceUrl: wikiAudio,
            },
          });

          successCount++;
          console.log(`✅ [${i + 1}/${listToProcess.length}] ${item.front} -> Wikimedia Native Voice (${entry.fileId})`);
        } else {
          // Bỏ qua nếu chưa có bản ghi âm thanh người thật - TUYỆT ĐỐI KHÔNG DÙNG SYNTHETIC TTS
          skipCount++;
        }
      }

      await delay(300);
    } catch (err: any) {
      failCount++;
      console.error(`❌ [${i + 1}/${listToProcess.length}] ${item.front} Thất bại: ${err.message}`);
    }
  }

  // 3. Mở rộng kho ngữ liệu: Đang nạp thêm câu thoại bản xứ từ Tatoeba feed
  const shouldFetchFeed = !limit || limit > listToProcess.length || process.argv.includes('--feed');
  if (shouldFetchFeed) {
    const feedLimit = limit ? Math.max(0, limit - listToProcess.length) : 25;
    if (feedLimit > 0) {
      console.log(`\n📚 Mở rộng kho ngữ liệu: Đang tải thêm câu thoại bản xứ từ Tatoeba feed (${feedLimit} câu)...`);
      const feed = await fetchTatoebaFeed(1);
      for (const sent of feed.slice(0, feedLimit)) {
        const audioInfo = sent.audios?.[0];
        if (!audioInfo) continue;
        const key = `tatoeba_sentence:${sent.id}`;
        const partition = DriveFolderManager.getPartition('vocab_audio');
        if (partition.assets[key]) continue;

        const audioUrl = `https://tatoeba.org/en/audio/download/${audioInfo.id}`;
        const fileName = `tatoeba_corpus_${sent.id}.mp3`;
        try {
          await StreamUploader.streamUploadFromUrl({
            url: audioUrl,
            key,
            category: 'vocab_audio',
            fileName,
            mimeType: 'audio/mpeg',
            folderId,
            metadata: {
              sentenceText: sent.text,
              tatoebaSentenceId: sent.id,
              speaker: audioInfo.author || 'Native Japanese Tokyo Speaker',
              source: 'Tatoeba Native Audio Project',
              sourceUrl: audioUrl,
            },
          });
          successCount++;
          await delay(300);
        } catch {}
      }
    }
  }

  console.log(`\n🎉 Hoàn thành Crawler Tatoeba Native Audio: Thành công: ${successCount}, Bỏ qua: ${skipCount}, Lỗi: ${failCount}`);
}

if (process.argv[1]?.endsWith('tatoeba-audio-streamer.ts')) {
  const limitArg = process.argv.find(a => a.startsWith('--limit='));
  const isAll = process.argv.includes('--all');
  const limit = isAll ? undefined : (limitArg ? parseInt(limitArg.split('=')[1], 10) : undefined);
  crawlTatoebaNativeAudio(limit).catch(console.error);
}

