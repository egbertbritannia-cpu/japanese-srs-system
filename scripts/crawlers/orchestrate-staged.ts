import { spawn } from 'child_process';
import path from 'path';
import { DriveFolderManager } from './drive-folder-manager';

// 🛡️ Global Exception Handlers to keep process resilient
process.on('uncaughtException', (err: Error) => {
  console.error('💥 [Staged Runner Exception]:', err?.stack || err?.message || err);
});

process.on('unhandledRejection', (reason: any) => {
  console.error('💥 [Staged Runner Rejection]:', reason?.stack || reason?.message || reason);
});

export interface StagedTaskSpec {
  id: string;
  stage: number;
  name: string;
  category: string;
  script: string;
  icon: string;
  description: string;
  defaultLimit?: number;
  extraArgs?: string[];
}

export interface StageDefinition {
  stageNumber: number;
  title: string;
  estimatedDuration: string;
  tasks: StagedTaskSpec[];
}

export const STAGES: StageDefinition[] = [
  {
    stageNumber: 1,
    title: 'Stage 1 · Core Foundations (Nền tảng Tinh gọn)',
    estimatedDuration: '1 - 2 phút',
    tasks: [
      {
        id: '1.1',
        stage: 1,
        name: 'Kanji Stroke Order Animated SVGs',
        category: 'kanji',
        script: 'scripts/crawlers/1-crawl-kanji-stroke-order.ts',
        icon: '🖌️',
        description: 'Chữ Hán và nét động SVG chuẩn Bengara (#9E3223)',
        defaultLimit: 30,
      },
      {
        id: '1.2',
        stage: 1,
        name: 'Tatoeba & NHK Native Tokyo Audio',
        category: 'vocab_audio',
        script: 'scripts/crawlers/tatoeba-audio-streamer.ts',
        icon: '🎙️',
        description: 'Âm thanh người thật bản xứ Tokyo từ Tatoeba & Wikimedia Commons',
        defaultLimit: 40,
        extraArgs: ['--feed'],
      },
      {
        id: '1.3',
        stage: 1,
        name: 'Grammar Infographics Bunbou Mindmaps',
        category: 'grammar_infographic',
        script: 'scripts/crawlers/4-generate-grammar-infographics.ts',
        icon: '📊',
        description: 'Sơ đồ tư duy ngữ pháp Minna & JLPT dạng SVG',
      },
    ],
  },
  {
    stageNumber: 2,
    title: 'Stage 2 · Visual Media (Minh họa Giáo dục Trực quan)',
    estimatedDuration: '1 - 2 phút',
    tasks: [
      {
        id: '2.1',
        stage: 2,
        name: 'Irasutoya Master PNG Illustrations',
        category: 'illustration',
        script: 'scripts/crawlers/irasutoya-master-streamer.ts',
        icon: '🎨',
        description: 'Tranh minh họa 1200px trong suốt phong cách Takashi Mifune',
        defaultLimit: 10,
        extraArgs: ['--categories'],
      },
    ],
  },
  {
    stageNumber: 3,
    title: 'Stage 3 · Reading & Lexicon (Đọc hiểu & Ngữ liệu Hàn Lâm)',
    estimatedDuration: '1 - 2 phút',
    tasks: [
      {
        id: '3.1',
        stage: 3,
        name: 'JLPT Dokkai & JGLUE Benchmark Suite',
        category: 'jlpt_dokkai',
        script: 'scripts/crawlers/jlpt-dokkai-streamer.ts',
        icon: '📚',
        description: 'Đề đọc hiểu JSQuAD, JNLI, JSTS, JCoLA từ ĐHQG Tokyo & RIKEN',
        defaultLimit: 5,
      },
      {
        id: '3.2',
        stage: 3,
        name: 'SNOW-NLP Yasashii Nihongo (やさしい日本語)',
        category: 'jlpt_dokkai',
        script: 'scripts/crawlers/snow-simplified-streamer.ts',
        icon: '🌸',
        description: 'Cặp câu đối sánh tinh giản Yasashii Nihongo (LREC / Nagaoka)',
        defaultLimit: 5,
      },
      {
        id: '3.3',
        stage: 3,
        name: 'Yojijukugo & Onomatopoeia Lexicon',
        category: 'yojijukugo_onomatopoeia',
        script: 'scripts/crawlers/yojijukugo-onomatopoeia-streamer.ts',
        icon: '🏮',
        description: 'Thành ngữ 4 chữ, từ tượng thanh và KANJIDIC2',
        defaultLimit: 5,
      },
    ],
  },
  {
    stageNumber: 4,
    title: 'Stage 4 · Conversation Mining (Hội thoại & Giao tiếp Sống động)',
    estimatedDuration: '1 - 2 phút',
    tasks: [
      {
        id: '4.1',
        stage: 4,
        name: 'Anime & Context Immersion Spliced Clips',
        category: 'immersion_clip',
        script: 'scripts/crawlers/immersion-clips-streamer.ts',
        icon: '🎬',
        description: 'Clip thoại ngữ cảnh giao tiếp i+1 có phụ đề song ngữ JP-VI',
        defaultLimit: 5,
      },
      {
        id: '4.2',
        stage: 4,
        name: 'Japanese Roleplay Dialogues (Narikiri Chat)',
        category: 'jesc_subtitles',
        script: 'scripts/crawlers/roleplay-dialogues-streamer.ts',
        icon: '💬',
        description: 'Hội thoại đời thực đa lượt nói giữa người bản xứ',
        defaultLimit: 5,
      },
      {
        id: '4.3',
        stage: 4,
        name: 'JESC Subtitles Sentence Mining',
        category: 'jesc_subtitles',
        script: 'scripts/crawlers/jesc-subtitles-streamer.ts',
        icon: '🎞️',
        description: 'Batch phụ đề đối sánh Stanford & Kyoto',
        defaultLimit: 5,
      },
    ],
  },
  {
    stageNumber: 5,
    title: 'Stage 5 · Exam Audio Archives (Kho Audio Thi Cử Quy mô Lớn)',
    estimatedDuration: '1 - 3 phút',
    tasks: [
      {
        id: '5.1',
        stage: 5,
        name: 'JLPT Choukai Exam CD Tracks (Shard 2/4 - N4/N3 Master)',
        category: 'jlpt_choukai',
        script: 'scripts/crawlers/jlpt-choukai-streamer.ts',
        icon: '🎧',
        description: 'Đề thi nghe JLPT N4/N3 Examination Audio CDs',
        defaultLimit: 5,
        extraArgs: ['--shard=2/4', '--shard-id=s2'],
      },
      {
        id: '5.2',
        stage: 5,
        name: 'Cambridge IELTS Audio & Oxford Studio (Shard 1/4)',
        category: 'ielts_audio',
        script: 'scripts/crawlers/cambridge-ielts-streamer.ts',
        icon: '📖',
        description: 'Audio Cambridge IELTS Books 1-8 & phát âm Oxford Studio',
        defaultLimit: 5,
        extraArgs: ['--shard=1/4', '--shard-id=s1'],
      },
      {
        id: '5.3',
        stage: 5,
        name: 'PubMed & J-STAGE Academic Bilingual Corpus',
        category: 'pubmed_corpus',
        script: 'scripts/crawlers/pubmed-jstage-streamer.ts',
        icon: '🔬',
        description: 'Bản dịch toàn văn y sinh Europe PMC & thuật ngữ MeSH',
        defaultLimit: 5,
      },
    ],
  },
];

export interface TaskExecutionResult {
  task: StagedTaskSpec;
  code: number;
  durationMs: number;
  initialCount: number;
  finalCount: number;
  deltaCount: number;
  error?: string;
}

/**
 * Chạy 1 task crawler đơn lẻ với timeout và đo lường tài nguyên an toàn
 */
async function runSingleTask(task: StagedTaskSpec, customLimit?: number): Promise<TaskExecutionResult> {
  const start = Date.now();
  const scriptPath = path.resolve(process.cwd(), task.script);

  const shardArg = task.extraArgs?.find((a) => a.startsWith('--shard-id='));
  const shardId = shardArg ? shardArg.split('=')[1] : undefined;
  let initialCount = 0;
  try {
    initialCount = DriveFolderManager.getPartition(task.category, shardId).totalAssets;
  } catch {}

  const limitToUse = customLimit !== undefined ? customLimit : task.defaultLimit;
  const taskArgs: string[] = [];
  if (limitToUse !== undefined) {
    taskArgs.push(`--limit=${limitToUse}`);
  }
  if (task.extraArgs) {
    taskArgs.push(...task.extraArgs);
  }

  console.log(`\n▶️ [${task.icon} ${task.id}] Bắt đầu: ${task.name}...`);
  if (taskArgs.length > 0) {
    console.log(`   Tham số: ${taskArgs.join(' ')}`);
  }

  return new Promise<TaskExecutionResult>((resolve) => {
    const isWindows = process.platform === 'win32';
    const npxCmd = isWindows ? 'npx.cmd' : 'npx';

    const child = spawn(npxCmd, ['tsx', scriptPath, ...taskArgs], {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: isWindows,
      env: {
        ...process.env,
        FORCE_COLOR: '1',
      },
    });

    let stdoutTail = '';
    let stderrTail = '';

    child.stdout.on('data', (d: Buffer) => {
      const str = d.toString();
      stdoutTail = (stdoutTail + str).slice(-1000);
      const lines = str.split(/\r?\n/).filter(l => l.trim().length > 0);
      for (const line of lines) {
        if (
          line.includes('✅') ||
          line.includes('📦') ||
          line.includes('🎨') ||
          line.includes('🎧') ||
          line.includes('✓') ||
          line.includes('📝') ||
          line.includes('🏮') ||
          line.includes('✨') ||
          line.includes('📖') ||
          line.includes('💬') ||
          line.includes('🌸') ||
          line.includes('🎬') ||
          line.includes('Khởi tạo') ||
          line.includes('Bắt đầu')
        ) {
          console.log(`   [${task.id}] ${line}`);
        }
      }
    });

    child.stderr.on('data', (d: Buffer) => {
      const str = d.toString();
      stderrTail = (stderrTail + str).slice(-1000);
    });

    // Timeout an toàn: mỗi task đơn lẻ tối đa 6 phút để không bao giờ bị nghẽn vô tận
    const timeoutTimer = setTimeout(() => {
      console.warn(`⚠️ [Timeout] Task ${task.name} vượt quá 6 phút, đang buộc dừng an toàn...`);
      try {
        if (process.platform === 'win32' && child.pid) {
          spawn('taskkill', ['/pid', child.pid.toString(), '/T', '/F']);
        } else {
          child.kill('SIGTERM');
        }
      } catch {}
    }, 360000);

    child.on('close', (code) => {
      clearTimeout(timeoutTimer);
      const durationMs = Date.now() - start;
      let finalCount = initialCount;
      try {
        finalCount = DriveFolderManager.getPartition(task.category, shardId).totalAssets;
      } catch {}
      const deltaCount = Math.max(0, finalCount - initialCount);

      if (code === 0) {
        console.log(`✓ [${task.icon} ${task.id}] Xong trong ${(durationMs / 1000).toFixed(1)}s (+${deltaCount} files).`);
      } else {
        console.warn(`⚠️ [${task.icon} ${task.id}] Thoát với mã ${code} trong ${(durationMs / 1000).toFixed(1)}s (+${deltaCount} files).`);
      }

      resolve({
        task,
        code: code ?? -1,
        durationMs,
        initialCount,
        finalCount,
        deltaCount,
        error: code !== 0 ? stderrTail.trim() : undefined,
      });
    });

    child.on('error', (err) => {
      clearTimeout(timeoutTimer);
      const durationMs = Date.now() - start;
      resolve({
        task,
        code: -1,
        durationMs,
        initialCount,
        finalCount: initialCount,
        deltaCount: 0,
        error: err.message,
      });
    });
  });
}

/**
 * Thực thi một danh sách tasks với Concurrency giới hạn (mặc định: max 2 tiến trình đồng thời)
 * Giúp triệt tiêu hoàn toàn nghẽn bộ nhớ V8 và quá tải CPU trên Windows.
 */
async function runTasksWithBoundedConcurrency(
  tasks: StagedTaskSpec[],
  maxConcurrency = 2,
  customLimit?: number
): Promise<TaskExecutionResult[]> {
  const results: TaskExecutionResult[] = [];
  let index = 0;

  async function worker(): Promise<void> {
    while (index < tasks.length) {
      const currentTask = tasks[index++];
      const res = await runSingleTask(currentTask, customLimit);
      results.push(res);
    }
  }

  const workerCount = Math.min(maxConcurrency, tasks.length);
  const workers = Array.from({ length: workerCount }, () => worker());
  await Promise.all(workers);
  return results;
}

/**
 * In bảng tóm tắt kết quả theo Stage
 */
function printStageSummary(stageDef: StageDefinition, results: TaskExecutionResult[]): void {
  console.log('\n╔══════════════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log(`║ 🏁 KẾT QUẢ: ${stageDef.title.padEnd(81, ' ')}║`);
  console.log('╠══════════════════════════════════════════════════════════════════════════════════════════════════╣');
  for (const r of results) {
    const status = r.code === 0 ? '✓ XANH' : '⚠️ WARN';
    const idPad = r.task.id.padEnd(5, ' ');
    const namePad = r.task.name.padEnd(46, ' ');
    const deltaStr = `+${r.deltaCount}`.padStart(5, ' ');
    const totalStr = `${r.finalCount}`.padStart(6, ' ');
    const timeStr = `${(r.durationMs / 1000).toFixed(1)}s`.padStart(6, ' ');
    console.log(`║ ${r.task.icon} ${idPad} ${namePad} | ${status} | Mới: ${deltaStr} | Tổng: ${totalStr} | ${timeStr} ║`);
  }
  console.log('╚══════════════════════════════════════════════════════════════════════════════════════════════════╝\n');
}

/**
 * Chạy một Stage cụ thể
 */
export async function runStage(stageNumber: number, customLimit?: number, maxConcurrency = 2): Promise<TaskExecutionResult[]> {
  const stageDef = STAGES.find(s => s.stageNumber === stageNumber);
  if (!stageDef) {
    throw new Error(`Không tìm thấy Stage ${stageNumber}. Vui lòng chọn stage từ 1 đến 5.`);
  }

  console.log('\n==================================================================================================');
  console.log(`🌟 [TIẾN TRÌNH CHIA NHỎ] ${stageDef.title}`);
  console.log(`⏱️  Thời gian dự kiến hoàn thành: ~${stageDef.estimatedDuration} | Giới hạn concurrency: ${maxConcurrency} workers`);
  console.log('==================================================================================================');

  // Khởi tạo và kiểm tra Drive folders
  await DriveFolderManager.initFolders();

  const results = await runTasksWithBoundedConcurrency(stageDef.tasks, maxConcurrency, customLimit);

  // Cập nhật manifest sau khi hoàn thành stage
  console.log('🔄 Đang đồng bộ phân vùng manifest vào data/multimodal-manifest.json...');
  try {
    const agg = DriveFolderManager.aggregateManifests();
    console.log(`✓ Đã cập nhật manifest: Tổng cộng ${agg.totalAssets} tệp đa phương tiện trên Google Drive 15TB.`);
  } catch (err: any) {
    console.warn('⚠️ Cảnh báo đồng bộ manifest:', err.message);
  }

  printStageSummary(stageDef, results);
  return results;
}

/**
 * Chạy một domain crawler cụ thể
 */
export async function runDomain(domainQuery: string, customLimit?: number): Promise<TaskExecutionResult | null> {
  const allTasks = STAGES.flatMap(s => s.tasks);
  const q = domainQuery.toLowerCase();
  const matched = allTasks.find(t => 
    t.category.toLowerCase().includes(q) ||
    t.name.toLowerCase().includes(q) ||
    t.script.toLowerCase().includes(q) ||
    t.id === domainQuery
  );

  if (!matched) {
    console.error(`❌ Không tìm thấy crawler nào khớp với "${domainQuery}".`);
    console.log('Danh sách các domain khả dụng:');
    for (const t of allTasks) {
      console.log(`  • [${t.id}] ${t.icon} ${t.category} (${t.name})`);
    }
    return null;
  }

  await DriveFolderManager.initFolders();
  const res = await runSingleTask(matched, customLimit);

  try {
    DriveFolderManager.aggregateManifests();
  } catch {}

  return res;
}

/**
 * Chạy lần lượt cả 5 Stages tuần tự (Sequential Staged Orchestration)
 * Khắc phục hoàn toàn lỗi sụp đổ bộ nhớ khi chạy đồng thời 17 worker trước đây.
 */
export async function runAllStaged(customLimit?: number, maxConcurrency = 2): Promise<void> {
  console.log('\n╔══════════════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║ 🌟 BẮT ĐẦU TIẾN TRÌNH CÀO DỮ LIỆU ĐA PHƯƠNG TIỆN CHIA NHỎ (5 STAGES TUẦN TỰ)                      ║');
  console.log('║    Mục tiêu: Đảm bảo bộ nhớ V8 an toàn, 0 byte đĩa cứng cục bộ, hoàn thành từng giai đoạn nhanh ║');
  console.log('╚══════════════════════════════════════════════════════════════════════════════════════════════════╝\n');

  const overallStart = Date.now();

  for (const stageDef of STAGES) {
    await runStage(stageDef.stageNumber, customLimit, maxConcurrency);
    console.log(`☕ Nghỉ 3 giây giữa các Stage để ổn định bộ nhớ và đường truyền...\n`);
    await new Promise(r => setTimeout(r, 3000));
  }

  const totalSec = ((Date.now() - overallStart) / 1000).toFixed(1);
  const finalAgg = DriveFolderManager.aggregateManifests();

  console.log('\n🎉 ==============================================================================================');
  console.log(`🎉 HOÀN TẤT TOÀN BỘ 5 STAGES TRONG ${totalSec} GIÂY!`);
  console.log(`📊 TỔNG CỘNG TÀI NGUYÊN TRÊN GOOGLE DRIVE: ${finalAgg.totalAssets} tệp tin.`);
  console.log('==============================================================================================\n');
}

/**
 * Chạy song song nhiều Stage cùng lúc (ví dụ: Stage 2, 3, 4, 5)
 * Mỗi Stage chạy với concurrency = 1 để tổng cộng chỉ có 4 tiến trình nhẹ, bảo vệ RAM tuyệt đối.
 */
export async function runStagesInParallel(
  stageNumbers: number[],
  customLimit?: number,
  maxConcurrencyPerStage = 1
): Promise<void> {
  console.log('\n╔══════════════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log(`║ 🚀 KHỞI CHẠY SONG SONG CÁC STAGES: [${stageNumbers.join(', ')}]`.padEnd(99, ' ') + '║');
  console.log('║    Mục tiêu: Đẩy nhanh tốc độ, chạy song song với giới hạn worker nội bộ chống tràn RAM          ║');
  console.log('╚══════════════════════════════════════════════════════════════════════════════════════════════════╝\n');

  const overallStart = Date.now();
  await DriveFolderManager.initFolders();

  const stagePromises = stageNumbers.map((stageNum) =>
    runStage(stageNum, customLimit, maxConcurrencyPerStage)
  );
  await Promise.all(stagePromises);

  const totalSec = ((Date.now() - overallStart) / 1000).toFixed(1);
  const finalAgg = DriveFolderManager.aggregateManifests();

  console.log('\n🎉 ==============================================================================================');
  console.log(`🎉 HOÀN TẤT SONG SONG CÁC STAGES [${stageNumbers.join(', ')}] TRONG ${totalSec} GIÂY!`);
  console.log(`📊 TỔNG CỘNG TÀI NGUYÊN TRÊN GOOGLE DRIVE: ${finalAgg.totalAssets} tệp tin.`);
  console.log('==============================================================================================\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// CLI ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────
if (process.argv[1]?.replace(/\\/g, '/').endsWith('orchestrate-staged.ts')) {
  const args = process.argv.slice(2);

  const stageArg = args.find(a => a.startsWith('--stage='));
  const stagesArg = args.find(a => a.startsWith('--stages='));
  const domainArg = args.find(a => a.startsWith('--domain='));
  const limitArg = args.find(a => a.startsWith('--limit='));
  const concurrencyArg = args.find(a => a.startsWith('--concurrency='));
  const isAllStaged = args.includes('--all-staged') || args.includes('--all');
  const parallelStagesParam = args.find(a => a.startsWith('--parallel-stages='));
  const isParallel = args.includes('--parallel-stages') || !!parallelStagesParam || args.includes('--parallel') || !!stagesArg;
  const isLoop = args.includes('--loop');

  const customLimit = limitArg ? parseInt(limitArg.split('=')[1], 10) : undefined;
  const maxConcurrency = concurrencyArg ? parseInt(concurrencyArg.split('=')[1], 10) : 2;

  const main = async () => {
    if (domainArg) {
      const domainName = domainArg.split('=')[1];
      console.log(`🎯 Chế độ đơn lẻ: Chạy Domain "${domainName}"...`);
      await runDomain(domainName, customLimit);
    } else if (isParallel) {
      let stagesToRun = [2, 3, 4, 5];
      if (stagesArg) {
        stagesToRun = stagesArg
          .split('=')[1]
          .split(',')
          .map(Number)
          .filter((n) => n >= 1 && n <= 5);
      } else if (parallelStagesParam) {
        stagesToRun = parallelStagesParam
          .split('=')[1]
          .split(',')
          .map(Number)
          .filter((n) => n >= 1 && n <= 5);
      }
      const concurrencyPerStage = concurrencyArg ? parseInt(concurrencyArg.split('=')[1], 10) : 1;
      console.log(`🚀 Chế độ SONG SONG: Chạy song song các Stages [${stagesToRun.join(', ')}] (Concurrency: ${concurrencyPerStage} worker/stage)...`);
      await runStagesInParallel(stagesToRun, customLimit, concurrencyPerStage);
    } else if (stageArg) {
      const stageNum = parseInt(stageArg.split('=')[1], 10);
      console.log(`🎯 Chế độ Stage đơn lẻ: Chạy Stage ${stageNum}...`);
      await runStage(stageNum, customLimit, maxConcurrency);
    } else if (isAllStaged) {
      if (isLoop) {
        console.log('🔄 Chế độ VÒNG LẶP LIÊN TỤC 5 STAGES (Staged Continuous Loop)...');
        let cycle = 1;
        while (true) {
          console.log(`\n🌀 ===== BẮT ĐẦU CHU KỲ STAGED THỨ ${cycle++} =====`);
          try {
            await runAllStaged(customLimit, maxConcurrency);
          } catch (err: any) {
            console.error('⚠️ Lỗi chu kỳ (tự động phục hồi sau 15s):', err.message);
          }
          console.log('⏳ Nghỉ 15 giây trước chu kỳ Staged tiếp theo...');
          await new Promise(r => setTimeout(r, 15000));
        }
      } else {
        await runAllStaged(customLimit, maxConcurrency);
      }
    } else {
      console.log(`
📚 HƯỚNG DẪN SỬ DỤNG BỘ ĐIỀU PHỐI CHIA NHỎ (STAGED ORCHESTRATOR):
─────────────────────────────────────────────────────────────────
Thay vì chạy 17 tiến trình đồng thời gây nghẽn máy và quá lâu, bạn có thể:

1. Chạy từng Giai đoạn (Stage) ngắn gọn (chỉ 1 - 3 phút/giai đoạn):
   npx tsx scripts/crawlers/orchestrate-staged.ts --stage=1  # Chữ Hán & Âm thanh Tokyo
   npx tsx scripts/crawlers/orchestrate-staged.ts --stage=2  # Tranh minh họa Irasutoya
   npx tsx scripts/crawlers/orchestrate-staged.ts --stage=3  # Đọc hiểu JLPT & Thành ngữ
   npx tsx scripts/crawlers/orchestrate-staged.ts --stage=4  # Phụ đề Anime & Hội thoại
   npx tsx scripts/crawlers/orchestrate-staged.ts --stage=5  # Đề thi JLPT Choukai & IELTS

2. Chạy SONG SONG các stage còn lại (Stage 2, 3, 4, 5 với Concurrency an toàn):
   npx tsx scripts/crawlers/orchestrate-staged.ts --parallel-stages --stages=2,3,4,5
   npx tsx scripts/crawlers/orchestrate-staged.ts --parallel-stages --limit=10

3. Chạy một Domain chuyên biệt bất kỳ:
   npx tsx scripts/crawlers/orchestrate-staged.ts --domain=kanji --limit=20
   npx tsx scripts/crawlers/orchestrate-staged.ts --domain=irasutoya --limit=30
   npx tsx scripts/crawlers/orchestrate-staged.ts --domain=jlpt_choukai --limit=10

4. Chạy tuần tự cả 5 Stages an toàn (Concurrency 2, không ngốn RAM):
   npx tsx scripts/crawlers/orchestrate-staged.ts --all-staged
   npx tsx scripts/crawlers/orchestrate-staged.ts --all-staged --loop (Vòng lặp xuyên đêm chia nhỏ)
`);
    }
  };

  main().catch((err) => {
    console.error('💥 Lỗi Staged Orchestrator:', err);
    process.exit(1);
  });
}
