import { crawlKanjiStrokeOrders } from './1-crawl-kanji-stroke-order';
import { crawlTatoebaNativeAudio } from './tatoeba-audio-streamer';
import { crawlIrasutoyaMasterIllustrations } from './irasutoya-master-streamer';
import { crawlImmersionSentenceClips } from './immersion-clips-streamer';
import { crawlJlptChoukaiArchive } from './jlpt-choukai-streamer';
import { crawlCambridgeIeltsAudio } from './cambridge-ielts-streamer';
import { crawlPubMedJStageCorpus } from './pubmed-jstage-streamer';
import { crawlGrammarInfographics } from './4-generate-grammar-infographics';
import { DriveFolderManager } from './drive-folder-manager';

async function main() {
  const startTime = Date.now();
  console.log('╔════════════════════════════════════════════════════════════════════════╗');
  console.log('║  🏯 KIOKUDŌ SRS · TỔNG HỢP 6 KHO DỮ LIỆU ĐA PHƯƠNG TIỆN CHUẨN MỰC      ║');
  console.log('║         LƯU TRỮ VĨNH VIỄN TRÊN GOOGLE DRIVE 15TB (STREAMING PIPE)      ║');
  console.log('╚════════════════════════════════════════════════════════════════════════╝\n');

  if (process.argv.includes('--parallel')) {
    const { orchestrateParallelCrawlers } = await import('./orchestrate-6-workers');
    await orchestrateParallelCrawlers();
    return;
  }

  // Lấy limit từ tham số nếu có (ví dụ: tsx crawl-all.ts --limit=5 để test)
  const limitArg = process.argv.find(a => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : undefined;
  if (limit) {
    console.log(`⚡ Chế độ kiểm tra: Mỗi pipeline thu thập tối đa ${limit} mục.\n`);
  }

  // Khởi tạo và đồng bộ 8 thư mục trên Google Drive
  await DriveFolderManager.initFolders();

  // 1. Kanji Stroke Orders (KanjiVG authentic vector)
  await crawlKanjiStrokeOrders(limit);

  // 2. Tatoeba & NHK Native Audio (Real human Tokyo voice)
  await crawlTatoebaNativeAudio(limit);

  // 3. Irasutoya Master PNG Archive (Takashi Mifune 1200px educational art)
  await crawlIrasutoyaMasterIllustrations(limit);

  // 4. Anime & Immersion AV Clips (i+1 sentence mining with bilingual subtitles)
  await crawlImmersionSentenceClips(limit);

  // 5. JLPT Choukai Past Exam Audio Archive (N5-N3 questions & listening tracks)
  await crawlJlptChoukaiArchive(limit);

  // 6. Cambridge IELTS & Oxford Academic Lexicon Audio (Studio lossless)
  await crawlCambridgeIeltsAudio(limit);

  // 7. PubMed & J-STAGE Bilingual Scientific Corpus (Europe PMC / NCBI biomedical records)
  await crawlPubMedJStageCorpus(limit);

  // 8. Grammar Mindmap Infographics
  await crawlGrammarInfographics(limit);

  // Tổng kết Manifest mới nhất từ đĩa cứng
  const manifest = DriveFolderManager.getManifest(true);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n════════════════════════════════════════════════════════════════════════');
  console.log('📊 TỔNG KẾT TÀI NGUYÊN ĐÃ STREAMING LÊN GOOGLE DRIVE 15TB:');
  console.log('════════════════════════════════════════════════════════════════════════');
  console.log(`📁 Tổng số tệp đa phương tiện:        ${manifest.totalAssets}`);
  console.log(`🖌️ 1. Kanji Stroke Animations:          ${manifest.categories.kanji || 0} tệp`);
  console.log(`🎙️ 2. Tatoeba & NHK Native Audio:       ${manifest.categories.vocab_audio || 0} tệp`);
  console.log(`🎨 3. Irasutoya Master Illustrations:   ${manifest.categories.illustration || 0} tệp`);
  console.log(`🎬 4. Anime Immersion Spliced Clips:    ${manifest.categories.immersion_clip || 0} tệp`);
  console.log(`🎧 5. JLPT Choukai Exam Archive:        ${manifest.categories.jlpt_choukai || 0} tệp`);
  console.log(`📖 6. Cambridge IELTS & Oxford Audio:   ${manifest.categories.ielts_audio || 0} tệp`);
  console.log(`🔬 7. PubMed & J-STAGE Academic Corpus:  ${manifest.categories.pubmed_corpus || 0} tệp`);
  console.log(`📊 8. Grammar Mindmaps:                 ${manifest.categories.grammar_infographic || 0} tệp`);
  console.log(`⏱️ Thời gian thực thi:                  ${elapsed} giây`);
  console.log(`📄 Manifest lưu tại:                   data/multimodal-manifest.json`);
  console.log('════════════════════════════════════════════════════════════════════════\n');
}

main().catch(err => {
  console.error('Lỗi quy trình cào dữ liệu tổng hợp:', err);
  process.exit(1);
});
