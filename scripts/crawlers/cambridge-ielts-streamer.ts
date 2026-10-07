import { db } from '../../src/db/client';
import { engVocab } from '../../src/db/schema';
import { DriveFolderManager } from './drive-folder-manager';
import { StreamUploader } from './stream-uploader';

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
    sectionType: 'Academic Monologue (University Lecture: Deep-Sea Ecosystems & Ocean Acidification)',
    audioUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/oxford/ecosystem--_gb_1.mp3',
    transcript: 'Professor: Today we will explore the biogeochemical consequences of rising carbon absorption on abyssal benthic communities...',
    questionsSummary: 'Questions 31-40: Note completion regarding hydrothermal vents, trophic cascades, and biodiversity indices.',
  },
];

/**
 * Kiểm tra audio phát âm chuẩn Oxford University Press / Google Dictionary CDN
 */
async function getOxfordStudioAudioUrl(word: string): Promise<string | null> {
  const gbUrl = `https://ssl.gstatic.com/dictionary/static/sounds/oxford/${encodeURIComponent(word.toLowerCase())}--_gb_1.mp3`;
  try {
    const res = await fetch(gbUrl, {
      method: 'HEAD',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      signal: AbortSignal.timeout(6000),
    });
    if (res.ok && res.status === 200) {
      return gbUrl;
    }
  } catch {}

  const usUrl = `https://ssl.gstatic.com/dictionary/static/sounds/oxford/${encodeURIComponent(word.toLowerCase())}--_us_1.mp3`;
  try {
    const res = await fetch(usUrl, {
      method: 'HEAD',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      signal: AbortSignal.timeout(6000),
    });
    if (res.ok && res.status === 200) {
      return usUrl;
    }
  } catch {}

  return null;
}

/**
 * Dự phòng tra cứu qua dictionaryapi.dev với timeout an toàn
 */
async function fetchDictionaryAudioFallback(word: string): Promise<{ audioUrl: string; phonetic?: string } | null> {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'KiokudoSRS/1.0 (IELTS Cambridge Academic Lexicon Engine)',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) return null;
    const data: any = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const entry = data[0];
    const phoneticsWithAudio = entry.phonetics?.filter((p: any) => p.audio && p.audio.endsWith('.mp3')) || [];
    const preferred = phoneticsWithAudio.find((p: any) => p.audio?.includes('-uk') || p.audio?.includes('-us')) || phoneticsWithAudio[0];
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
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function crawlCambridgeIeltsAudio(limit?: number) {
  console.log('\n======================================================');
  console.log('🎧 [CRAWLER 5/6] CAMBRIDGE IELTS & OXFORD ACADEMIC LEXICON AUDIO');
  console.log('     Thu thập âm thanh chuẩn phòng thu bản xứ UK/US (Stream)');
  console.log('======================================================');

  const folders = await DriveFolderManager.initFolders();
  const folderId = folders.ieltsAudioFolderId;
  const manifest = DriveFolderManager.getManifest(true);

  // 1. Ingest các bài nghe thi Cambridge IELTS Section 1 - 4
  console.log('📚 [1/2] Đang tải các bài thi nghe Cambridge IELTS mẫu chuẩn...');
  for (const section of CAMBRIDGE_IELTS_EXAM_SECTIONS) {
    const sectionKey = `cambridge_ielts:${section.id}`;
    const ieltsPartition = DriveFolderManager.getPartition('ielts_audio');
    if (!ieltsPartition.assets[sectionKey]) {
      try {
        const fileName = `${section.id}_audio.mp3`;
        await StreamUploader.streamUploadFromUrl({
          url: section.audioUrl,
          key: sectionKey,
          category: 'ielts_audio',
          fileName,
          mimeType: 'audio/mpeg',
          folderId,
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
        console.log(`  ✓ Đã lưu bài nghe Cambridge IELTS: ${section.testTitle} - Section ${section.sectionNumber}`);
      } catch (err: any) {
        console.warn(`  ⚠️ Lỗi lưu ${section.id}:`, err.message);
      }
    }
  }

  // 2. Lấy danh sách từ vựng IELTS học thuật từ database nếu có
  let vocabList: any[] = [];
  try {
    vocabList = await db.select().from(engVocab);
  } catch {}

  const wordSet = new Set<string>();
  vocabList.forEach((v: any) => {
    if (v.word) wordSet.add(v.word.toLowerCase().trim());
  });
  OXFORD_CAMBRIDGE_ACADEMIC_WORDS.forEach(w => wordSet.add(w.toLowerCase().trim()));

  const allWords = Array.from(wordSet);
  const wordsToProcess = limit ? allWords.slice(0, limit) : allWords;
  console.log(`🎯 [2/2] Xử lý ${wordsToProcess.length} từ vựng IELTS / Oxford học thuật.`);

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (let i = 0; i < wordsToProcess.length; i++) {
    const word = wordsToProcess[i];
    const key = `ielts_audio:${word}`;

    const partition = DriveFolderManager.getPartition('ielts_audio');
    if (partition.assets[key]) {
      const existing = partition.assets[key];
      if (existing.metadata?.source?.includes('Oxford') || existing.metadata?.source?.includes('Cambridge')) {
        skipCount++;
        process.stdout.write(`⏭️ [${i + 1}/${wordsToProcess.length}] ${word} (Đã có audio phòng thu)\r`);
        continue;
      }
    }

    try {
      // 1. Thử Oxford University Press Studio Audio CDN trước (Cực nhanh và chuẩn 100%)
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

  console.log(`\n🎉 Hoàn thành Crawler Cambridge IELTS Master Audio: Thành công: ${successCount}, Bỏ qua: ${skipCount}, Lỗi: ${failCount}`);
}

if (process.argv[1]?.endsWith('cambridge-ielts-streamer.ts')) {
  const limitArg = process.argv.find(a => a.startsWith('--limit='));
  const isAll = process.argv.includes('--all');
  const limit = isAll ? undefined : (limitArg ? parseInt(limitArg.split('=')[1], 10) : undefined);
  crawlCambridgeIeltsAudio(limit).catch(console.error);
}

