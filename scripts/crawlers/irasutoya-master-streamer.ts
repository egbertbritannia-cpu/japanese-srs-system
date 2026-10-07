import { db } from '../../src/db/client';
import { cards } from '../../src/db/schema';
import { inArray } from 'drizzle-orm';
import { DriveFolderManager } from './drive-folder-manager';
import { StreamUploader } from './stream-uploader';
import { SEED_JAPANESE_WORDS } from './seed-lexicon';

interface IrasutoyaImage {
  title: string;
  url: string;
  category?: string;
}

/**
 * Tìm kiếm tranh minh họa thực thụ chuẩn giáo dục Nhật Bản từ Irasutoya (Mifune Takashi)
 * Trả về link ảnh PNG trong suốt độ phân giải cao (/s1200/).
 */
async function searchIrasutoyaPng(query: string): Promise<IrasutoyaImage | null> {
  const url = `https://www.irasutoya.com/search?q=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) return null;
    const html = await res.text();

    const regex = /bp_thumbnail_resize\("([^"]+)","([^"]+)"\)/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      const rawUrl = match[1];
      const title = match[2] || query;
      // Nâng cấp lên phân giải cao 1200px
      const fullResUrl = rawUrl.replace(/\/s[0-9]+(-c)?\//, '/s1200/');
      if (fullResUrl.includes('.png') || fullResUrl.includes('.jpg')) {
        return {
          title,
          url: fullResUrl,
        };
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Lấy các tranh minh họa giáo dục theo chuyên mục từ Blogger Feed chính thức của Irasutoya (có phân trang start-index)
 */
async function fetchIrasutoyaCategoryFeed(category: string, maxResults = 25, startIndex = 1): Promise<IrasutoyaImage[]> {
  const url = `https://www.irasutoya.com/feeds/posts/default/-/${encodeURIComponent(category)}?alt=json&start-index=${startIndex}&max-results=${maxResults}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'KiokudoSRS/1.0 (Educational Japanese SRS Platform; Illustration Pipeline)',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return [];
    const data: any = await res.json();
    const images: IrasutoyaImage[] = [];

    for (const entry of data.feed?.entry || []) {
      const title = entry.title?.$t || 'イラスト';
      const content = entry.content?.$t || '';
      // Tìm URL ảnh chất lượng cao
      const imgMatch = content.match(/src="([^"]+)"/);
      if (imgMatch) {
        let imgUrl = imgMatch[1];
        imgUrl = imgUrl.replace(/\/s[0-9]+(-c)?\//, '/s1200/');
        if (!imgUrl.includes('/s1200/')) {
          imgUrl = imgUrl.replace(/\/s1600\//, '/s1200/');
        }
        images.push({
          title,
          url: imgUrl,
          category,
        });
      }
    }
    return images;
  } catch {
    return [];
  }
}

const IRASUTOYA_CATEGORIES = [
  '学校', '食べ物', 'ポーズ', '家族', '仕事', '医療', '乗り物', '季節', '自然', '生活'
];

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function crawlIrasutoyaMasterIllustrations(limit?: number) {
  console.log('\n======================================================');
  console.log('🎨 [CRAWLER 2/6] IRASUTOYA MASTER EDUCATIONAL PNG ARCHIVE');
  console.log('     Thu thập tranh vẽ minh họa chuẩn giáo dục Nhật Bản (s1200)');
  console.log('======================================================');

  const folders = await DriveFolderManager.initFolders();
  const folderId = folders.minnaIllustrationsFolderId;
  const manifest = DriveFolderManager.getManifest(true);

  // 1. Thu thập từ vựng: Ưu tiên Database, tự động dùng Seed Lexicon nếu môi trường độc lập
  const uniqueWords = new Map<string, { front: string; reading: string; meaning: string }>();

  try {
    const vocabCards = await db.select().from(cards).where(
      inArray(cards.deckId, ['deck_jpd133', 'deck_n5'])
    );
    console.log(`📋 Tổng số thẻ từ vựng từ Database: ${vocabCards.length}`);
    for (const card of vocabCards) {
      const cleanWord = card.front.replace(/\{\{c\d+::(.*?)\}\}/g, '$1').trim();
      if (cleanWord && !uniqueWords.has(cleanWord)) {
        uniqueWords.set(cleanWord, {
          front: cleanWord,
          reading: card.reading || cleanWord,
          meaning: card.meaning || '',
        });
      }
    }
  } catch (err: any) {
    console.warn('⚠️ Không thể kết nối Database, chuyển sang Seed Lexicon tự chủ:', err.message);
  }

  // Bổ sung các từ vựng từ Seed Lexicon
  for (const seed of SEED_JAPANESE_WORDS) {
    if (!uniqueWords.has(seed.front)) {
      uniqueWords.set(seed.front, {
        front: seed.front,
        reading: seed.reading,
        meaning: seed.meaning,
      });
    }
  }

  const wordList = Array.from(uniqueWords.values());
  const listToProcess = limit ? wordList.slice(0, limit) : wordList;
  console.log(`🎯 Tổng hợp ${listToProcess.length} từ vựng mục tiêu cần có tranh minh họa Irasutoya.`);

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (let i = 0; i < listToProcess.length; i++) {
    const item = listToProcess[i];
    const key = `illustration:${item.front}`;

    const partition = DriveFolderManager.getPartition('illustration');
    if (partition.assets[key]) {
      const existing = partition.assets[key];
      if (existing.fileName.endsWith('.png') || existing.metadata?.source === 'Irasutoya Master Archive') {
        skipCount++;
        process.stdout.write(`⏭️ [${i + 1}/${listToProcess.length}] ${item.front} (Đã có Irasutoya PNG trên Drive)\r`);
        continue;
      }
    }

    try {
      let img = await searchIrasutoyaPng(item.front);
      if (!img && item.reading && item.reading !== item.front) {
        img = await searchIrasutoyaPng(item.reading);
      }
      if (!img && item.meaning) {
        const cleanMeaningKeyword = item.meaning.split(/[,;(]/)[0].trim();
        img = await searchIrasutoyaPng(cleanMeaningKeyword);
      }

      if (img) {
        const safeWord = encodeURIComponent(item.front).replace(/%/g, '_');
        const ext = img.url.endsWith('.jpg') ? 'jpg' : 'png';
        const mimeType = ext === 'jpg' ? 'image/jpeg' : 'image/png';
        const fileName = `irasutoya_${safeWord}_1200px.${ext}`;

        const entry = await StreamUploader.streamUploadFromUrl({
          url: img.url,
          key,
          category: 'illustration',
          fileName,
          mimeType,
          folderId,
          metadata: {
            word: item.front,
            reading: item.reading,
            title: img.title,
            resolution: '1200px',
            source: 'Irasutoya Master Archive',
            artist: 'Takashi Mifune (いらすとや)',
            sourceUrl: img.url,
          },
        });

        successCount++;
        console.log(`✅ [${i + 1}/${listToProcess.length}] ${item.front} -> Irasutoya "${img.title}" (${entry.fileId})`);
      } else {
        skipCount++;
      }

      await delay(300);
    } catch (err: any) {
      failCount++;
      console.error(`❌ [${i + 1}/${listToProcess.length}] ${item.front} Thất bại: ${err.message}`);
    }
  }

  // 2. PHÂN TRANG LIÊN TỤC (DEEP BLOGGER PAGINATION): Cào tranh giáo dục theo 10 chuyên mục
  const shouldExpandCategories = !limit || process.argv.includes('--categories') || process.argv.includes('--all');
  if (shouldExpandCategories) {
    const pagesPerCat = limit ? 2 : 10; // Mỗi chuyên mục quét 10 đợt (tổng 250 tranh/chủ đề x 10 = 2500 tranh)
    console.log(`\n📚 Mở rộng kho tàng: Đang phân trang sâu Blogger Feed cho 10 chuyên mục (${pagesPerCat} trang/chủ đề)...`);

    for (const cat of IRASUTOYA_CATEGORIES) {
      console.log(`  📂 Chuyên mục: 【${cat}】...`);
      for (let p = 0; p < pagesPerCat; p++) {
        const startIndex = 1 + p * 25;
        const catImages = await fetchIrasutoyaCategoryFeed(cat, 25, startIndex);
        if (catImages.length === 0) break;

        let newInBatch = 0;
        for (const img of catImages) {
          if (limit && successCount >= limit) break;
          const cleanTitle = img.title.replace(/[\\/:*?"<>|]/g, '_').trim();
          const key = `illustration:irasutoya_${cat}_${encodeURIComponent(cleanTitle).slice(0, 30)}`;
          if (DriveFolderManager.hasAsset(key)) {
            skipCount++;
            continue;
          }

          try {
            const ext = img.url.endsWith('.jpg') ? 'jpg' : 'png';
            const mimeType = ext === 'jpg' ? 'image/jpeg' : 'image/png';
            const safeName = `irasutoya_${encodeURIComponent(cleanTitle).replace(/%/g, '_')}_1200px.${ext}`;

            const entry = await StreamUploader.streamUploadFromUrl({
              url: img.url,
              key,
              category: 'illustration',
              fileName: safeName,
              mimeType,
              folderId,
              metadata: {
                title: img.title,
                category: cat,
                resolution: '1200px',
                source: 'Irasutoya Master Archive',
                artist: 'Takashi Mifune (いらすとや)',
                sourceUrl: img.url,
              },
            });
            successCount++;
            newInBatch++;
            console.log(`    🎨 [${cat} · ${startIndex}] "${img.title}" -> ${entry.fileId}`);
            await delay(300);
          } catch (err: any) {
            failCount++;
          }
        }
        console.log(`    ✓ ${cat} (start-index: ${startIndex}): +${newInBatch} ảnh mới.`);
        await delay(400);
      }
    }
  }

  console.log(`\n🎉 Hoàn thành Crawler Irasutoya Master: Thành công: +${successCount}, Bỏ qua: ${skipCount}, Lỗi: ${failCount}`);
}

if (process.argv[1]?.endsWith('irasutoya-master-streamer.ts')) {
  const limitArg = process.argv.find(a => a.startsWith('--limit='));
  const isAll = process.argv.includes('--all');
  const limit = isAll ? undefined : (limitArg ? parseInt(limitArg.split('=')[1], 10) : undefined);
  crawlIrasutoyaMasterIllustrations(limit).catch(console.error);
}
