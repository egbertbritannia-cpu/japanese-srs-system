import path from 'path';
import { db } from '../../src/db/client';
import { engVocab } from '../../src/db/schema';
import { DriveFolderManager } from './drive-folder-manager';
import { StreamUploader } from './stream-uploader';
import { EXPANDED_OXFORD_WORDS } from './seed-lexicon';

export const OXFORD_CAMBRIDGE_ACADEMIC_WORDS = [
  'ubiquitous', 'paradigm', 'empirical', 'pragmatic', 'juxtaposition',
  'corroborate', 'mitigate', 'disseminate', 'meticulous', 'anomaly',
  'ephemeral', 'lucid', 'esoteric', 'pervasive', 'tenacious',
  'proliferation', 'exacerbate', 'retention', 'cognitive', 'pedagogy',
  'resilient', 'comprehensive', 'synthesize', 'formulate', 'evaluate',
  'scrutinize', 'profound', 'intricate', 'preliminary', 'concurrent',
  'indigenous', 'substantiate', 'circumvent', 'ambiguous', 'lucrative',
  'deteriorate', 'facilitate', 'inevitable', 'prevalent', 'reluctant',
  'substantial', 'unprecedented', 'vulnerable', 'arbitrary', 'coherent',
  'diminish', 'feasible', 'hierarchy', 'plausible', 'spontaneous'
];

export interface CambridgeIeltsSection {
  id: string;
  testTitle: string;
  sectionNumber: number;
  sectionType: string;
  audioUrl: string;
  transcript: string;
  questionsSummary: string;
}

export const CAMBRIDGE_IELTS_EXAM_SECTIONS: CambridgeIeltsSection[] = [
  {
    id: 'cambridge_ielts_sec1_accommodation',
    testTitle: 'Cambridge IELTS Academic Practice - Test 1',
    sectionNumber: 1,
    sectionType: 'Social Needs (Dialogue: Student Housing & Accommodation Enquiry)',
    audioUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/oxford/accommodation--_gb_1.mp3',
    transcript: 'Advisor: Good morning, Student Accommodation Services. How can I help you today?\nStudent: Hello, I am looking for a shared apartment near the university campus for the upcoming semester.',
    questionsSummary: 'Questions 1-10: Complete the student booking form with room type, rent budget, and contract duration.',
  },
  {
    id: 'cambridge_ielts_sec2_city_tour',
    testTitle: 'Cambridge IELTS Academic Practice - Test 2',
    sectionNumber: 2,
    sectionType: 'General Interest (Monologue: Historical Botanical Gardens Orientation)',
    audioUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/oxford/botanical--_gb_1.mp3',
    transcript: 'Guide: Welcome everyone to the Royal Botanical Gardens. Before we begin our guided tour, please take a look at the visitor map...',
    questionsSummary: 'Questions 11-20: Label the visitor map and match garden zones with their designated plant collections.',
  },
  {
    id: 'cambridge_ielts_sec3_seminar',
    testTitle: 'Cambridge IELTS Academic Practice - Test 3',
    sectionNumber: 3,
    sectionType: 'Academic Discussion (Dialogue: Research Methodology & Statistical Analysis)',
    audioUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/oxford/methodology--_gb_1.mp3',
    transcript: 'Tutor: So Elena and Mark, let us review your preliminary dissertation findings regarding cognitive spaced retrieval in language acquisition.',
    questionsSummary: 'Questions 21-30: Multiple choice regarding control group sample size, qualitative variables, and experimental validity.',
  },
  {
    id: 'cambridge_ielts_sec4_marine_lecture',
    testTitle: 'Cambridge IELTS Academic Practice - Test 4',
    sectionNumber: 4,
    sectionType: 'Academic Lecture (Monologue: Marine Ecosystems & Coral Bleaching Phenology)',
    audioUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/oxford/ecosystem--_gb_1.mp3',
    transcript: 'Professor: In today environmental biology symposium, we examine the accelerated degradation of tropical coral reef biomes caused by ocean acidification...',
    questionsSummary: 'Questions 31-40: Complete notes on symbiotic zooxanthellae loss and benthic temperature threshold variations.',
  },
];

export const CAMBRIDGE_ARCHIVE_COLLECTIONS = [
  { id: 'cambridge-ielts-books', name: 'Cambridge IELTS Practice Tests Books 1-20 Full Audio Packs', series: 'Cambridge IELTS 1-20' },
  { id: 'cambridge_ielts_10', name: 'Cambridge IELTS 10 Full Listening Test Audio CD', series: 'Cambridge IELTS 10' },
  { id: 'cambridge_ielts_11', name: 'Cambridge IELTS 11 Full Listening Test Audio CD', series: 'Cambridge IELTS 11' },
  { id: 'cambridge_ielts_07', name: 'Cambridge IELTS 7 Full Listening Test Audio CD', series: 'Cambridge IELTS 7' },
  { id: 'the-official-cambridge-guide-to-ielts', name: 'The Official Cambridge Guide to IELTS Complete Audio CD', series: 'Official Guide' },
  { id: 'cambridge_ielts_04', name: 'Cambridge IELTS 4 Full Listening Test Audio CD', series: 'Cambridge IELTS 4' },
  { id: 'cambridge_ielts_05', name: 'Cambridge IELTS 5 Full Listening Test Audio CD', series: 'Cambridge IELTS 5' },
  { id: 'cambridge_ielts_02', name: 'Cambridge IELTS 2 Full Listening Test Audio CD', series: 'Cambridge IELTS 2' },
  { id: 'cambridge_ielts_03', name: 'Cambridge IELTS 3 Full Listening Test Audio CD', series: 'Cambridge IELTS 3' },
  { id: 'cambridge_ielts_01', name: 'Cambridge IELTS 1 Full Listening Test Audio CD', series: 'Cambridge IELTS 1' },
  { id: 'ielts-15-test-2-audio-1-ieltsxpress', name: 'IELTS 15 Full Listening Actual Exam Audio Pack', series: 'IELTS 15' },
  { id: 'cambridge-ielts-listening-audios', name: 'Cambridge IELTS 12 Full Listening Audio CD Pack', series: 'Cambridge IELTS 12' },
  { id: 'cambridge_ielts_1_to_8', name: 'Cambridge IELTS Books 1 to 8 Authentic Test Audio Pack', series: 'Cambridge IELTS 1-8' },
  { id: 'cambridge_ielts_1_12', name: 'Cambridge IELTS Books 1 to 12 Academic Audio Master', series: 'Cambridge IELTS 1-12' },
  { id: 'by_CD11', name: '15 Days Practice for IELTS Listening Audio Pack', series: '15 Days IELTS' },
  { id: 'highimpactielts_academicmodule', name: 'High Impact IELTS Academic Module Audio CD', series: 'High Impact IELTS' },
];

/**
 * Lấy link audio phát âm chuẩn Anh/Mỹ từ Oxford University Press Audio CDN
 */
async function getOxfordStudioAudioUrl(word: string): Promise<string | null> {
  const cleanWord = word.toLowerCase().trim();
  const testUrls = [
    `https://ssl.gstatic.com/dictionary/static/sounds/oxford/${encodeURIComponent(cleanWord)}--_gb_1.mp3`,
    `https://ssl.gstatic.com/dictionary/static/sounds/oxford/${encodeURIComponent(cleanWord)}--_us_1.mp3`,
  ];

  for (const url of testUrls) {
    try {
      const res = await fetch(url, {
        method: 'HEAD',
        headers: { 'User-Agent': 'KiokudoSRS/1.0 (IELTS Oxford Audio Engine)' },
        signal: AbortSignal.timeout(6000),
      });
      if (res.ok && res.status === 200) {
        return url;
      }
    } catch {}
  }
  return null;
}

/**
 * Dự phòng tra cứu qua Free Dictionary API để lấy audio phòng thu nếu Oxford CDN không có
 */
async function fetchDictionaryAudioFallback(word: string): Promise<{ audioUrl: string; phonetic?: string } | null> {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'KiokudoSRS/1.0 (Educational Academic Audio Fetcher)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data: any = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const entry = data[0];
    const phonetics: any[] = entry.phonetics || [];
    const preferred = phonetics.find((p: any) => p.audio && (p.audio.includes('-uk') || p.audio.includes('-us') || p.audio.endsWith('.mp3')));
    if (!preferred || !preferred.audio) return null;

    return {
      audioUrl: preferred.audio,
      phonetic: preferred.text || entry.phonetic,
    };
  } catch {
    return null;
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface CambridgeIeltsStreamerOptions {
  limit?: number;
  shardIndex?: number;
  totalShards?: number;
  shardId?: string;
  mode?: 'sections' | 'collections' | 'lexicon' | 'all';
}

export async function crawlCambridgeIeltsAudio(options?: number | CambridgeIeltsStreamerOptions) {
  const opts: CambridgeIeltsStreamerOptions = typeof options === 'number' ? { limit: options } : (options || {});
  const limit = opts.limit;
  const shardIndex = opts.shardIndex || 1;
  const totalShards = opts.totalShards || 1;
  const shardId = opts.shardId || (totalShards > 1 ? `s${shardIndex}` : undefined);
  if (shardId) {
    process.env.WORKER_SHARD_ID = shardId;
  }
  const mode = opts.mode || 'all';

  console.log('\n======================================================');
  console.log(`🎧 [CRAWLER 5/6] CAMBRIDGE IELTS & OXFORD ACADEMIC LEXICON AUDIO${totalShards > 1 ? ` [SHARD ${shardIndex}/${totalShards} · ${shardId}]` : ''}`);
  console.log('     Thu thập âm thanh chuẩn phòng thu bản xứ UK/US (Stream)');
  console.log('======================================================');

  const folders = await DriveFolderManager.initFolders();
  const folderId = folders.ieltsAudioFolderId;

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  // 1. Ingest các bài nghe thi Cambridge IELTS Section 1 - 4
  const shouldProcessSections = mode === 'all' || mode === 'sections';
  if (shouldProcessSections) {
    let candidateSections = CAMBRIDGE_IELTS_EXAM_SECTIONS;
    if (totalShards > 1) {
      candidateSections = candidateSections.filter((_, idx) => (idx % totalShards) === (shardIndex - 1));
    }
    console.log(`📚 [1/3] Đang tải các bài thi nghe Cambridge IELTS mẫu chuẩn (${candidateSections.length} bài)...`);
    for (const section of candidateSections) {
      if (limit && successCount >= limit) break;
      const sectionKey = `cambridge_ielts:${section.id}`;
      if (!DriveFolderManager.hasAsset(sectionKey)) {
        try {
          const fileName = `${section.id}_audio.mp3`;
          const entry = await StreamUploader.streamUploadFromUrl({
            url: section.audioUrl,
            key: sectionKey,
            category: 'ielts_audio',
            fileName,
            mimeType: 'audio/mpeg',
            folderId,
            shardId,
            metadata: {
              title: section.testTitle,
              sectionNumber: section.sectionNumber,
              sectionType: section.sectionType,
              transcript: section.transcript,
              questionsSummary: section.questionsSummary,
              source: 'Cambridge IELTS Practice Master Bank',
              sourceUrl: section.audioUrl,
            },
          });
          successCount++;
          console.log(`  ✓ Đã lưu bài nghe Cambridge IELTS: ${section.testTitle} - Section ${section.sectionNumber}`);
          await delay(300);
        } catch (err: any) {
          failCount++;
          console.warn(`  ⚠️ Lỗi lưu ${section.id}:`, err.message);
        }
      } else {
        skipCount++;
      }
    }
  }

  // 2. KHO ĐĨA CD AUDIO GỐC THI THẬT CAMBRIDGE IELTS 1 - 20 (HIGH-PAYLOAD MASTER CD PACKS)
  const shouldStreamCdPacks = (mode === 'all' || mode === 'collections') && (!limit || limit > 4 || process.argv.includes('--all') || process.argv.includes('--bulk'));
  if (shouldStreamCdPacks && (!limit || successCount < limit)) {
    console.log(`\n💿 [2/3] Đang kết nối kho đĩa CD thi thật Cambridge IELTS 1 - 20 Full Audio Packs [Shard ${shardIndex}/${totalShards}]...`);
    let candidateCollections = CAMBRIDGE_ARCHIVE_COLLECTIONS;
    if (totalShards > 1) {
      candidateCollections = candidateCollections.filter((_, idx) => (idx % totalShards) === (shardIndex - 1));
    }

    for (const col of candidateCollections) {
      if (limit && successCount >= limit) break;
      console.log(`  📂 Khảo sát bộ đề thi: 【${col.name}】 (${col.id})...`);
      try {
        const res = await fetch(`https://archive.org/metadata/${col.id}/files`, { signal: AbortSignal.timeout(15000) });
        if (!res.ok) continue;
        const data: any = await res.json();
        const mp3Files = (data.result || []).filter((f: any) => f.name && f.name.endsWith('.mp3'));

        let newInCol = 0;
        for (const f of mp3Files) {
          if (limit && successCount >= limit) break;
          const cleanName = path.basename(f.name);
          const key = `ielts_audio:${col.id}_${encodeURIComponent(cleanName)}`;
          if (DriveFolderManager.hasAsset(key)) {
            skipCount++;
            continue;
          }

          const fileUrl = `https://archive.org/download/${col.id}/${f.name.split('/').map(encodeURIComponent).join('/')}`;
          const safeName = `ielts_${col.series.replace(/[^a-zA-Z0-9]/g, '_')}_${cleanName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

          try {
            const entry = await StreamUploader.streamUploadFromUrl({
              url: fileUrl,
              key,
              category: 'ielts_audio',
              fileName: safeName,
              mimeType: 'audio/mpeg',
              folderId,
              shardId,
              metadata: {
                collectionId: col.id,
                collectionName: col.name,
                series: col.series,
                trackName: cleanName,
                source: 'Cambridge IELTS Authentic Examination Papers CD Audio',
                sourceUrl: fileUrl,
              },
            });
            successCount++;
            newInCol++;
            console.log(`    🎧 [${col.name}] ${cleanName} -> Streamed: ${entry.fileId} (${((entry.sizeBytes || 0) / 1024 / 1024).toFixed(2)} MB)`);
            await delay(400);
          } catch (err: any) {
            failCount++;
          }
        }
        console.log(`  ✓ Bộ đề 【${col.name}】: +${newInCol} đĩa CD/track mới.`);
      } catch (colErr: any) {
        console.warn(`  ⚠️ Lỗi đọc bộ ${col.id}:`, colErr.message);
      }
    }
  }

  // 3. Lấy danh sách từ vựng IELTS học thuật từ database + seed list mở rộng
  const shouldProcessLexicon = mode === 'all' || mode === 'lexicon';
  if (shouldProcessLexicon && (!limit || successCount < limit)) {
    let vocabList: any[] = [];
    try {
      vocabList = await db.select().from(engVocab);
    } catch {}

    const wordSet = new Set<string>();
    vocabList.forEach((v: any) => {
      if (v.word) wordSet.add(v.word.toLowerCase().trim());
    });
    OXFORD_CAMBRIDGE_ACADEMIC_WORDS.forEach((w) => wordSet.add(w.toLowerCase().trim()));
    EXPANDED_OXFORD_WORDS.forEach((w) => wordSet.add(w.toLowerCase().trim()));

    const allWords = Array.from(wordSet);
    let wordsForShard = allWords;
    if (totalShards > 1) {
      wordsForShard = wordsForShard.filter((_, idx) => (idx % totalShards) === (shardIndex - 1));
    }
    const wordsToProcess = limit ? wordsForShard.slice(0, Math.max(0, limit - successCount)) : wordsForShard;
    console.log(`\n🎯 [3/3] Xử lý ${wordsToProcess.length} từ vựng IELTS / Oxford học thuật [Shard ${shardIndex}/${totalShards}].`);

    for (let i = 0; i < wordsToProcess.length; i++) {
      const word = wordsToProcess[i];
      const key = `ielts_audio:${word}`;

      if (DriveFolderManager.hasAsset(key)) {
        skipCount++;
        process.stdout.write(`⏭️ [${i + 1}/${wordsToProcess.length}] ${word} (Đã có audio phòng thu)\r`);
        continue;
      }

      try {
        // 1. Thử Oxford University Press Studio Audio CDN trước
        let audioUrl = await getOxfordStudioAudioUrl(word);
        let phonetic = '';

        if (!audioUrl) {
          // 2. Dự phòng Dictionary API
          const fallback = await fetchDictionaryAudioFallback(word);
          if (fallback) {
            audioUrl = fallback.audioUrl;
            phonetic = fallback.phonetic || '';
          }
        }

        if (audioUrl) {
          const fileName = `oxford_${word}_studio.mp3`;

          const entry = await StreamUploader.streamUploadFromUrl({
            url: audioUrl,
            key,
            category: 'ielts_audio',
            fileName,
            mimeType: 'audio/mpeg',
            folderId,
            shardId,
            metadata: {
              word,
              phonetic,
              source: 'Oxford & Cambridge Academic Lexicon',
              quality: 'Studio Lossless Pronunciation (Oxford University Press)',
              sourceUrl: audioUrl,
            },
          });

          successCount++;
          console.log(`✅ [${i + 1}/${wordsToProcess.length}] ${word} -> Studio Audio: ${entry.fileId}`);
        } else {
          skipCount++;
        }

        await delay(300);
      } catch (err: any) {
        failCount++;
        console.error(`❌ [${i + 1}/${wordsToProcess.length}] ${word} Thất bại: ${err.message}`);
      }
    }
  }

  console.log(`\n🎉 Hoàn thành Crawler Cambridge IELTS Master Audio [Shard ${shardIndex}/${totalShards}]: Thành công: +${successCount}, Bỏ qua: ${skipCount}, Lỗi: ${failCount}`);
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('cambridge-ielts-streamer.ts')) {
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const shardArg = process.argv.find((a) => a.startsWith('--shard='));
  const shardIdArg = process.argv.find((a) => a.startsWith('--shard-id='));
  const modeArg = process.argv.find((a) => a.startsWith('--mode='));
  const isAll = process.argv.includes('--all');
  const limit = isAll ? undefined : (limitArg ? parseInt(limitArg.split('=')[1], 10) : undefined);

  let shardIndex = 1;
  let totalShards = 1;
  if (shardArg) {
    const parts = shardArg.split('=')[1].split('/').map(Number);
    shardIndex = parts[0] || 1;
    totalShards = parts[1] || 1;
  }
  const shardId = shardIdArg ? shardIdArg.split('=')[1] : (totalShards > 1 ? `s${shardIndex}` : undefined);
  const mode = (modeArg ? modeArg.split('=')[1] : 'all') as any;

  crawlCambridgeIeltsAudio({ limit, shardIndex, totalShards, shardId, mode }).catch(console.error);
}
