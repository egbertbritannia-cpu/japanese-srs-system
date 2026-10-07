import { DriveFolderManager } from './drive-folder-manager';
import { StreamUploader } from './stream-uploader';
import { EXPANDED_PUBMED_TOPICS } from './seed-lexicon';

export interface PubMedArticle {
  id: string;
  source: string;
  pmid?: string;
  pmcid?: string;
  doi?: string;
  title: string;
  authorString?: string;
  journalTitle?: string;
  pubYear?: string;
  abstractText?: string;
  hasFullText?: boolean;
}

export const BASE_PUBMED_TOPICS = [
  { topic: 'Japanese Language & Cognitive Neuroscience', query: '"japanese language" OR "language cognition"' },
  { topic: 'Spaced Repetition & Memory Retrieval Practice', query: '"spaced repetition" OR "retrieval practice"' },
  { topic: 'Bilingual Lexicon & Pitch Accent Perception', query: '"pitch accent" OR "speech perception"' },
  { topic: 'Medical & Clinical Japanese Terminology (J-STAGE)', query: '"medical terminology" OR "clinical healthcare"' },
  { topic: 'Neuroplasticity & Kanji Processing in the Brain', query: '"kanji" OR "neuroplasticity"' },
  { topic: 'Memory Consolidation & Forgetting Curve Dynamics', query: '"memory consolidation" OR "forgetting curve"' },
];

export const PUBMED_TOPICS = [
  ...BASE_PUBMED_TOPICS,
  ...EXPANDED_PUBMED_TOPICS,
];

/**
 * Danh mục thuật ngữ y sinh học & khoa học thần kinh song ngữ Nhật - Anh - Việt chuẩn J-STAGE & MeSH
 */
export const BILINGUAL_MEDICAL_TERMINOLOGY = [
  { termJp: '認知症', reading: 'にんちしょう', termEn: 'Dementia', termVi: 'Hội chứng sa sút trí tuệ', domain: 'Neurology' },
  { termJp: '神経科学', reading: 'しんけいかがく', termEn: 'Neuroscience', termVi: 'Khoa học thần kinh', domain: 'Neurobiology' },
  { termJp: '記憶固定化', reading: 'きおくこていか', termEn: 'Memory Consolidation', termVi: 'Quá trình củng cố trí nhớ', domain: 'Cognitive Science' },
  { termJp: '間隔反復', reading: 'かんかくはんぷく', termEn: 'Spaced Repetition', termVi: 'Phương pháp lặp lại ngắt quãng', domain: 'Learning Science' },
  { termJp: 'ワーキングメモリ', reading: 'わーきんぐめもり', termEn: 'Working Memory', termVi: 'Trí nhớ làm việc (ngắn hạn)', domain: 'Cognitive Psychology' },
  { termJp: '忘却曲線', reading: 'ぼうきゃくきょくせん', termEn: 'Forgetting Curve', termVi: 'Đường cong lãng quên Ebbinghaus', domain: 'Psychology' },
  { termJp: '聴覚認知', reading: 'ちょうかくにんち', termEn: 'Auditory Perception', termVi: 'Nhận thức thính giác âm vị', domain: 'Audiology' },
  { termJp: '脳可塑性', reading: 'のうかそせい', termEn: 'Neuroplasticity', termVi: 'Tính mềm dẻo của hệ thần kinh não bộ', domain: 'Neuroscience' },
  { termJp: '海馬', reading: 'かいば', termEn: 'Hippocampus', termVi: 'Hồi hải mã (vùng não lưu trữ ký ức)', domain: 'Neuroanatomy' },
  { termJp: '前頭前野', reading: 'ぜんとうぜんや', termEn: 'Prefrontal Cortex', termVi: 'Vỏ não trước trán (trung tâm điều hành tư duy)', domain: 'Neuroanatomy' },
  { termJp: '失語症', reading: 'しつごしょう', termEn: 'Aphasia', termVi: 'Chứng mất ngôn ngữ do tổn thương não', domain: 'Neurology' },
  { termJp: '言語獲得', reading: 'げんごかくとく', termEn: 'Language Acquisition', termVi: 'Quá trình tiếp thu và thụ đắc ngôn ngữ', domain: 'Linguistics' },
  { termJp: '高次脳機能障害', reading: 'こうじのうきのうしょうがい', termEn: 'Higher Brain Dysfunction', termVi: 'Rối loạn chức năng não bộ bậc cao', domain: 'Clinical Medicine' },
  { termJp: '抑うつ', reading: 'よくうつ', termEn: 'Depression', termVi: 'Trạng thái trầm cảm và ức chế tâm thần', domain: 'Psychiatry' },
  { termJp: '臨床試験', reading: 'りんしょうしけん', termEn: 'Clinical Trial', termVi: 'Thử nghiệm lâm sàng y sinh học', domain: 'Pharmacology' },
];

async function fetchPubMedArticles(query: string, pageSize = 25, page = 1): Promise<PubMedArticle[]> {
  const url = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(query)}&format=json&pageSize=${pageSize}&page=${page}&resultType=core`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'KiokudoSRS/1.0 (Japanese Spaced Repetition Platform; Europe PMC / PubMed Integration)',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(12000),
    });

    if (!res.ok) return [];
    const data: any = await res.json();
    return data.resultList?.result || [];
  } catch {
    return [];
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function crawlPubMedJStageCorpus(limit?: number) {
  console.log('\n======================================================');
  console.log('🔬 [CRAWLER 6/6] PUBMED & J-STAGE BILINGUAL SCIENTIFIC CORPUS');
  console.log('     Thu thập toàn văn XML bài báo y sinh & từ điển thuật ngữ');
  console.log('======================================================');

  const folders = await DriveFolderManager.initFolders();
  const folderId = folders.pubmedCorpusFolderId || folders.rootFolderId;
  const manifest = DriveFolderManager.getManifest(true);

  // 1. Ingest từ điển thuật ngữ y sinh học song ngữ J-STAGE & MeSH
  console.log('📚 [1/2] Đang đồng bộ bộ thuật ngữ y sinh học song ngữ Nhật - Anh - Việt...');
  const termKey = 'pubmed_corpus:jstage_bilingual_terms_v1';
  const pubmedPartition = DriveFolderManager.getPartition('pubmed_corpus');
  if (!pubmedPartition.assets[termKey]) {
    try {
      const termsContent = JSON.stringify(
        {
          title: 'J-STAGE & MeSH Bilingual Medical / Neurocognitive Lexicon',
          version: '1.0',
          totalTerms: BILINGUAL_MEDICAL_TERMINOLOGY.length,
          terms: BILINGUAL_MEDICAL_TERMINOLOGY,
          createdAt: new Date().toISOString(),
        },
        null,
        2
      );

      await DriveFolderManager.uploadAndRegister({
        key: termKey,
        category: 'pubmed_corpus',
        fileName: 'jstage_mesh_bilingual_medical_terms.json',
        mimeType: 'application/json',
        content: termsContent,
        folderId,
        metadata: {
          title: 'J-STAGE & MeSH Bilingual Lexicon',
          domain: 'Neuroscience & Japanese Healthcare Terminology',
          totalTerms: BILINGUAL_MEDICAL_TERMINOLOGY.length,
          source: 'J-STAGE Medical Terminology Database & MeSH',
        },
      });
      console.log('  ✓ Đã lưu từ điển thuật ngữ song ngữ J-STAGE vào Google Drive.');
    } catch (err: any) {
      console.warn('  ⚠️ Lỗi lưu từ điển thuật ngữ:', err.message);
    }
  }

  // 2. PHÂN TRANG LIÊN TỤC (DEEP EUROPE PMC SEARCH): Quét đa trang bài báo học thuật
  console.log('🔍 [2/2] Đang tìm kiếm các công trình nghiên cứu trên Europe PMC / PubMed (Đa trang)...');
  const pagesPerTopic = limit ? 1 : 3; // Quét 3 trang mỗi topic (tối đa 75 bài/topic)

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (const t of PUBMED_TOPICS) {
    if (limit && successCount >= limit) break;
    console.log(`  📖 Chủ đề nghiên cứu: 【${t.topic}】...`);

    for (let p = 1; p <= pagesPerTopic; p++) {
      if (limit && successCount >= limit) break;
      const articles = await fetchPubMedArticles(t.query, 20, p);
      if (articles.length === 0) break;

      let newInBatch = 0;
      for (const article of articles) {
        if (limit && successCount >= limit) break;
        const pmid = article.pmid || article.id;
        if (!pmid) continue;

        const key = `pubmed_corpus:${pmid}`;
        if (DriveFolderManager.hasAsset(key)) {
          skipCount++;
          continue;
        }

        try {
          const pmcid = article.pmcid;
          let streamedFullText = false;

          // Nếu có PMCID (Open Access Full-Text), tải toàn văn XML trực tiếp vào Google Drive
          if (pmcid) {
            const xmlUrl = `https://www.ebi.ac.uk/europepmc/webservices/rest/${pmcid}/fullTextXML`;
            try {
              const xmlFileName = `pubmed_${pmid}_${pmcid}_fulltext.xml`;
              const entry = await StreamUploader.streamUploadFromUrl({
                url: xmlUrl,
                key,
                category: 'pubmed_corpus',
                fileName: xmlFileName,
                mimeType: 'application/xml',
                folderId,
                metadata: {
                  pmid,
                  pmcid,
                  doi: article.doi,
                  title: article.title,
                  journal: article.journalTitle,
                  pubYear: article.pubYear,
                  topic: t.topic,
                  format: 'FullText XML',
                  source: 'Europe PMC / PubMed Central Open Access Repository',
                  sourceUrl: xmlUrl,
                },
              });
              streamedFullText = true;
              successCount++;
              newInBatch++;
              console.log(`    ✅ [Trang ${p}] PMID:${pmid} [XML ${pmcid}] -> ${entry.fileId}`);
              await delay(300);
            } catch {}
          }

          if (!streamedFullText) {
            const payload = {
              pmid,
              pmcid: article.pmcid || '',
              doi: article.doi || '',
              title: article.title,
              authors: article.authorString || '',
              journal: article.journalTitle || '',
              pubYear: article.pubYear || '',
              topic: t.topic,
              abstract: article.abstractText || '',
              source: 'PubMed / Europe PMC Scientific Repository',
              crawledAt: new Date().toISOString(),
            };

            const jsonContent = JSON.stringify(payload, null, 2);
            const safeTitle = encodeURIComponent((article.title || 'article').substring(0, 30)).replace(/%/g, '_');
            const fileName = `pubmed_${pmid}_${safeTitle}.json`;

            const entry = await DriveFolderManager.uploadAndRegister({
              key,
              category: 'pubmed_corpus',
              fileName,
              mimeType: 'application/json',
              content: jsonContent,
              folderId,
              metadata: {
                pmid,
                doi: article.doi,
                title: article.title,
                journal: article.journalTitle,
                pubYear: article.pubYear,
                topic: t.topic,
                format: 'Structured JSON Abstract',
                source: 'PubMed Central & Europe PMC',
              },
            });

            successCount++;
            newInBatch++;
            console.log(`    ✅ [Trang ${p}] PMID:${pmid} -> "${(article.title || '').substring(0, 40)}..." (${entry.fileId})`);
            await delay(300);
          }
        } catch (err: any) {
          failCount++;
        }
      }
      console.log(`    ✓ Trang ${p}: +${newInBatch} bài báo mới.`);
      await delay(500);
    }
  }

  console.log(`\n🎉 Hoàn thành Crawler PubMed & J-STAGE Corpus: Thành công: +${successCount}, Bỏ qua: ${skipCount}, Lỗi: ${failCount}`);
}

if (process.argv[1]?.endsWith('pubmed-jstage-streamer.ts')) {
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const isAll = process.argv.includes('--all');
  const limit = isAll ? undefined : (limitArg ? parseInt(limitArg.split('=')[1], 10) : undefined);
  crawlPubMedJStageCorpus(limit).catch(console.error);
}
