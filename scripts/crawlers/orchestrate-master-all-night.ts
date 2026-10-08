import { spawn } from 'child_process';
import path from 'path';
import { DriveFolderManager } from './drive-folder-manager';

// 🛡️ Global Exception & Rejection Handlers to prevent daemon crashes
process.on('uncaughtException', (err: Error) => {
  console.error('💥 [Master Daemon Resilience - uncaughtException]:', err?.stack || err?.message || err);
});

process.on('unhandledRejection', (reason: any) => {
  console.error('💥 [Master Daemon Resilience - unhandledRejection]:', reason?.stack || reason?.message || reason);
});

export interface MasterWorkerSpec {
  id: number | string;
  suite: 'A' | 'B';
  name: string;
  category: string;
  script: string;
  icon: string;
  description: string;
  extraArgs?: string[];
}

export const MASTER_WORKER_SPECS: MasterWorkerSpec[] = [
  // --- SUITE A: BASE MULTIMODAL DOMAINS (WORKERS 1 - 6) ---
  {
    id: 1,
    suite: 'A',
    name: 'Tatoeba & NHK Native Audio Streamer',
    category: 'vocab_audio',
    script: 'scripts/crawlers/tatoeba-audio-streamer.ts',
    icon: '🎙️',
    description: 'Âm thanh người thật bản xứ Tokyo từ Tatoeba & Wikimedia Commons',
    extraArgs: ['--feed'],
  },
  {
    id: 2,
    suite: 'A',
    name: 'Irasutoya Master Educational PNG Streamer',
    category: 'illustration',
    script: 'scripts/crawlers/irasutoya-master-streamer.ts',
    icon: '🎨',
    description: 'Tranh minh họa giáo dục Nhật Bản 1200px chuẩn Takashi Mifune',
    extraArgs: ['--categories'],
  },
  {
    id: 3,
    suite: 'A',
    name: 'Anime & Conversation Immersion Spliced Clips',
    category: 'immersion_clip',
    script: 'scripts/crawlers/immersion-clips-streamer.ts',
    icon: '🎬',
    description: 'Clip thoại ngữ cảnh giao tiếp i+1 có phụ đề song ngữ và mốc thời gian',
  },
  {
    id: 4,
    suite: 'A',
    name: 'JLPT Choukai Exam Audio Archive Streamer',
    category: 'jlpt_choukai',
    script: 'scripts/crawlers/jlpt-choukai-streamer.ts',
    icon: '🎧',
    description: 'Đề thi nghe chính thức N5 - N1 từ The Japan Foundation & JEES',
  },
  {
    id: 5,
    suite: 'A',
    name: 'Cambridge IELTS & Oxford Studio Audio Streamer',
    category: 'ielts_audio',
    script: 'scripts/crawlers/cambridge-ielts-streamer.ts',
    icon: '📖',
    description: 'Bài nghe Cambridge IELTS Academic và phát âm Oxford studio lossless',
  },
  {
    id: 6,
    suite: 'A',
    name: 'PubMed & J-STAGE Academic Bilingual Corpus Streamer',
    category: 'pubmed_corpus',
    script: 'scripts/crawlers/pubmed-jstage-streamer.ts',
    icon: '🔬',
    description: 'Toàn văn XML bài báo y sinh Europe PMC và thuật ngữ song ngữ J-STAGE / MeSH',
  },

  // --- SUITE B: HUGGING FACE & LINGUISTIC MASTER DOMAINS (WORKERS 7 - 9) ---
  {
    id: 7,
    suite: 'B',
    name: 'JLPT Dokkai & JGLUE Reading Comprehension Suite',
    category: 'jlpt_dokkai',
    script: 'scripts/crawlers/jlpt-dokkai-streamer.ts',
    icon: '📚',
    description: 'Kho đề đọc hiểu JSQuAD, JCommonsenseQA, JNLI, JSTS, JCoLA từ ĐHQG Tokyo & RIKEN',
  },
  {
    id: 8,
    suite: 'B',
    name: 'JESC 3.2M Sentence Mining Subtitles Streamer',
    category: 'jesc_subtitles',
    script: 'scripts/crawlers/jesc-subtitles-streamer.ts',
    icon: '🎞️',
    description: '3.2 triệu câu đối sánh song ngữ Nhật - Anh đối thoại đời thực từ Stanford & Kyoto',
  },
  {
    id: 9,
    suite: 'B',
    name: 'Yojijukugo & Onomatopoeia Linguistic Master Lexicon',
    category: 'yojijukugo_onomatopoeia',
    script: 'scripts/crawlers/yojijukugo-onomatopoeia-streamer.ts',
    icon: '🏮',
    description: '4,200+ Thành ngữ 4 chữ, 2,400+ Từ tượng thanh/hình & KANJIDIC2 13,108 chữ Hán',
  },
  {
    id: 10,
    suite: 'B',
    name: 'SNOW-NLP Simplified Japanese Corpus (やさしい日本語)',
    category: 'jlpt_dokkai',
    script: 'scripts/crawlers/snow-simplified-streamer.ts',
    icon: '🌸',
    description: '50,000 cặp câu đối sánh nguyên văn - tinh giản Yasashii Nihongo - tiếng Anh (LREC / Nagaoka)',
  },
  {
    id: 11,
    suite: 'B',
    name: 'Japanese Roleplay Dialogues Corpus (Narikiri Chat)',
    category: 'jesc_subtitles',
    script: 'scripts/crawlers/roleplay-dialogues-streamer.ts',
    icon: '💬',
    description: 'Hàng chục nghìn đoạn đàm thoại hội thoại đời thực tự nhiên đa lượt nói giữa người bản xứ',
  },
];

export const BOOST_SHARDED_WORKER_SPECS: MasterWorkerSpec[] = [
  // 4 JLPT Choukai Shards:
  {
    id: '4.1',
    suite: 'A',
    name: 'JLPT Choukai Shard 1/4 (N5 Master Collections)',
    category: 'jlpt_choukai',
    script: 'scripts/crawlers/jlpt-choukai-streamer.ts',
    icon: '🎧',
    description: 'Bộ đề thi nghe JLPT N5 Official Trial Book, Koushiki Mondaishuu & Sample Q1',
    extraArgs: ['--shard=1/4', '--shard-id=s1'],
  },
  {
    id: '4.2',
    suite: 'A',
    name: 'JLPT Choukai Shard 2/4 (N4 Master Collections)',
    category: 'jlpt_choukai',
    script: 'scripts/crawlers/jlpt-choukai-streamer.ts',
    icon: '🎧',
    description: 'Bộ đề thi nghe JLPT N4 Goukaku Dekiru CD1, Super Moshi CD1, TRY! N4',
    extraArgs: ['--shard=2/4', '--shard-id=s2'],
  },
  {
    id: '4.3',
    suite: 'A',
    name: 'JLPT Choukai Shard 3/4 (N3 Master Collections)',
    category: 'jlpt_choukai',
    script: 'scripts/crawlers/jlpt-choukai-streamer.ts',
    icon: '🎧',
    description: 'Bộ đề thi nghe JLPT N3 Shin Kanzen CD1, Yosou Mondaishuu, Minna Inter I',
    extraArgs: ['--shard=3/4', '--shard-id=s3'],
  },
  {
    id: '4.4',
    suite: 'A',
    name: 'JLPT Choukai Shard 4/4 (N2-N1 Master Past Exam CDs)',
    category: 'jlpt_choukai',
    script: 'scripts/crawlers/jlpt-choukai-streamer.ts',
    icon: '🎧',
    description: 'Bộ đề thi nghe JLPT N2 2024 July CD, Shin Kanzen N2, Past Exams 2001-2006',
    extraArgs: ['--shard=4/4', '--shard-id=s4'],
  },

  // 4 Cambridge IELTS Shards:
  {
    id: '5.1',
    suite: 'A',
    name: 'Cambridge IELTS Shard 1/4 (Books 1-8 Authentic Audio)',
    category: 'ielts_audio',
    script: 'scripts/crawlers/cambridge-ielts-streamer.ts',
    icon: '📖',
    description: 'Đĩa nghe thi Cambridge IELTS Books 1 - 8 Authentic CD Audio Packs',
    extraArgs: ['--shard=1/4', '--shard-id=s1'],
  },
  {
    id: '5.2',
    suite: 'A',
    name: 'Cambridge IELTS Shard 2/4 (Books 9-12 & Official Guide)',
    category: 'ielts_audio',
    script: 'scripts/crawlers/cambridge-ielts-streamer.ts',
    icon: '📖',
    description: 'Đĩa nghe thi The Official Cambridge Guide, Cambridge 10, 11, 12 Audio CDs',
    extraArgs: ['--shard=2/4', '--shard-id=s2'],
  },
  {
    id: '5.3',
    suite: 'A',
    name: 'Cambridge IELTS Shard 3/4 (Books 13-20 & Exam Audio)',
    category: 'ielts_audio',
    script: 'scripts/crawlers/cambridge-ielts-streamer.ts',
    icon: '📖',
    description: 'Đĩa nghe thi Cambridge IELTS Books 13 - 20 & High Impact IELTS CD Audio',
    extraArgs: ['--shard=3/4', '--shard-id=s3'],
  },
  {
    id: '5.4',
    suite: 'A',
    name: 'Cambridge IELTS Shard 4/4 (Oxford Studio Academic Lexicon)',
    category: 'ielts_audio',
    script: 'scripts/crawlers/cambridge-ielts-streamer.ts',
    icon: '📖',
    description: 'Phát âm chuẩn phòng thu Oxford University Press CDN & từ vựng học thuật',
    extraArgs: ['--shard=4/4', '--shard-id=s4'],
  },
];

export interface MasterWorkerResult {
  spec: MasterWorkerSpec;
  code: number;
  durationMs: number;
  initialCount: number;
  finalCount: number;
  deltaCount: number;
}

function runSingleWorker(spec: MasterWorkerSpec, commonArgs: string[], retryCount = 0): Promise<MasterWorkerResult> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const shardArg = spec.extraArgs?.find((a) => a.startsWith('--shard-id='));
    const shardId = shardArg ? shardArg.split('=')[1] : undefined;
    let initialCount = 0;
    try {
      const initialPartition = DriveFolderManager.getPartition(spec.category, shardId);
      initialCount = initialPartition.totalAssets;
    } catch {}

    const isWin = process.platform === 'win32';
    const cmd = isWin ? 'cmd.exe' : 'npx';
    const scriptPath = path.resolve(process.cwd(), spec.script);
    const cmdArgs = isWin
      ? ['/c', 'npx', 'tsx', scriptPath, ...commonArgs, ...(spec.extraArgs || [])]
      : ['tsx', scriptPath, ...commonArgs, ...(spec.extraArgs || [])];

    console.log(`🚀 [Worker ${spec.id} · Suite ${spec.suite}] Khởi động${retryCount > 0 ? ` (Thử lại lần ${retryCount})` : ''}: ${spec.icon} ${spec.name}`);

    const prefix = `[W${spec.id} · ${spec.category}${shardId ? `:${shardId}` : ''}]`;
    let isSettled = false;

    const settle = (code: number, err?: Error) => {
      if (isSettled) return;
      isSettled = true;
      const durationMs = Date.now() - startTime;

      if (code !== 0 && retryCount < 1) {
        console.warn(`⚠️ [Worker ${spec.id}] Gặp sự cố (exit code ${code}), tự động khởi động lại sau 2.5s...`);
        setTimeout(() => {
          runSingleWorker(spec, commonArgs, retryCount + 1).then(resolve);
        }, 2500);
        return;
      }

      let finalCount = initialCount;
      try {
        const finalPartition = DriveFolderManager.getPartition(spec.category, shardId);
        finalCount = finalPartition.totalAssets;
      } catch (e: any) {
        console.warn(`${prefix} ⚠️ Không thể đọc partition sau khi worker kết thúc:`, e?.message || e);
      }
      const deltaCount = Math.max(0, finalCount - initialCount);

      if (code === 0) {
        console.log(`✅ [Worker ${spec.id}] Hoàn thành thành công (${(durationMs / 1000).toFixed(1)}s, +${deltaCount} mục)`);
      } else {
        console.warn(`⚠️ [Worker ${spec.id}] Kết thúc với exit code ${code}${err ? ` (${err.message})` : ''} (${(durationMs / 1000).toFixed(1)}s, +${deltaCount} mục)`);
      }

      resolve({
        spec,
        code: code ?? 0,
        durationMs,
        initialCount,
        finalCount,
        deltaCount,
      });
    };

    try {
      const child = spawn(cmd, cmdArgs, {
        cwd: process.cwd(),
        env: {
          ...process.env,
          WORKER_ID: String(spec.id),
          ...(shardId ? { WORKER_SHARD_ID: shardId } : {}),
          FORCE_COLOR: '1',
        },
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      child.stdout?.on('data', (chunk) => {
        try {
          const lines = chunk.toString().split(/\r?\n/).filter((l: string) => l.trim().length > 0);
          for (const line of lines) {
            console.log(`${prefix} ${line}`);
          }
        } catch {}
      });

      child.stdout?.on('error', (err) => {
        console.warn(`${prefix} ⚠️ [stdout error]:`, err.message);
      });

      child.stderr?.on('data', (chunk) => {
        try {
          const lines = chunk.toString().split(/\r?\n/).filter((l: string) => l.trim().length > 0);
          for (const line of lines) {
            console.error(`${prefix} ⚠️ ${line}`);
          }
        } catch {}
      });

      child.stderr?.on('error', (err) => {
        console.warn(`${prefix} ⚠️ [stderr error]:`, err.message);
      });

      child.on('close', (code) => settle(code ?? 0));
      child.on('exit', (code) => settle(code ?? 0));
      child.on('error', (err) => {
        console.error(`❌ [Worker ${spec.id}] Lỗi tiến trình:`, err.message);
        settle(1, err);
      });
    } catch (err: any) {
      console.error(`❌ [Worker ${spec.id}] Lỗi khi khởi động tiến trình con:`, err.message);
      settle(1, err);
    }
  });
}

export async function orchestrateMasterAllNight(): Promise<{
  results: MasterWorkerResult[];
  finalManifest: any;
}> {
  const globalStart = Date.now();
  console.log('╔══════════════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║ 🏯 KIOKUDŌ SRS · BỘ ĐIỀU PHỐI TỔNG THỂ 9 WORKERS SONG SONG QUA ĐÊM (ALL-NIGHT MASTER DAEMON)     ║');
  console.log('║    STREAMING PIPELINE LÊN GOOGLE DRIVE 15TB · ZERO-LOCK MANIFESTS ISOLATION (SUITE A & B)        ║');
  console.log('╚══════════════════════════════════════════════════════════════════════════════════════════════════╝\n');

  // Xác định CLI options
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const workersArg = process.argv.find((a) => a.startsWith('--workers='));
  const targetArg = process.argv.find((a) => a.startsWith('--target='));
  const isBoost = process.argv.includes('--boost') || process.argv.includes('--sharded') || process.argv.includes('--parallel');
  const isAll = process.argv.includes('--all') || (!limitArg && !workersArg);

  const commonArgs: string[] = [];
  if (limitArg) {
    commonArgs.push(limitArg);
    console.log(`⚡ Chế độ kiểm tra: Áp dụng ${limitArg} cho từng worker.\n`);
  } else if (isAll) {
    commonArgs.push('--all');
    console.log(`🌊 Chế độ TOÀN LỰC VÉT CẠN (--all): Cào song song 100% dữ liệu không bỏ sót!\n`);
  }

  let activeSpecs: MasterWorkerSpec[] = [];

  if (isBoost) {
    console.log('⚡ Chế độ BOOST SIÊU TỐC (--boost): Kích hoạt 15 luồng song song phân mảnh (Sharded) cực đại!\n');
    // Sharded JLPT (4) + Sharded IELTS (4) + Base Suite A (1, 2, 3, 6) + Suite B (7, 8, 9)
    const baseSuiteAOther = MASTER_WORKER_SPECS.filter((s) => s.suite === 'A' && s.id !== 4 && s.id !== 5);
    const suiteBWorkers = MASTER_WORKER_SPECS.filter((s) => s.suite === 'B');
    activeSpecs = [...baseSuiteAOther, ...BOOST_SHARDED_WORKER_SPECS, ...suiteBWorkers];
  } else {
    activeSpecs = [...MASTER_WORKER_SPECS];
  }

  // Lọc theo target hoặc worker id nếu được chỉ định
  if (targetArg) {
    const target = targetArg.split('=')[1].trim().toLowerCase();
    if (target === 'suite_a' || target === 'a') {
      activeSpecs = activeSpecs.filter((s) => s.suite === 'A');
      console.log(`🎯 Chỉ kích hoạt Suite A: 6 Base Multimodal Workers\n`);
    } else if (target === 'suite_b' || target === 'b' || target === 'hf') {
      activeSpecs = activeSpecs.filter((s) => s.suite === 'B');
      console.log(`🎯 Chỉ kích hoạt Suite B: 3 Hugging Face & Linguistic Workers\n`);
    }
  }

  if (workersArg) {
    const rawIds = workersArg.split('=')[1].split(',').map((id) => id.trim());
    activeSpecs = activeSpecs.filter((s) => rawIds.includes(String(s.id)));
    console.log(`🎯 Chỉ kích hoạt các Worker ID: ${rawIds.join(', ')}\n`);
  }

  // 1. Khởi tạo và kiểm tra cấu trúc 11 thư mục Google Drive
  console.log('📁 Bước 1: Khởi tạo & kiểm tra 11 thư mục Google Drive và phân vùng Manifests...');
  try {
    await DriveFolderManager.initFolders();
    DriveFolderManager.initPartitionManifests();
  } catch (err: any) {
    console.warn('⚠️ Cảnh báo khởi tạo Drive folders/manifests:', err?.message || err);
  }

  let manifestBefore: any = { totalAssets: 0 };
  try {
    manifestBefore = DriveFolderManager.getManifest(true);
    console.log(`📊 Số lượng tài nguyên hiện tại: ${manifestBefore.totalAssets} tệp đa phương tiện trên Google Drive 15TB.`);
  } catch (err: any) {
    console.warn('⚠️ Cảnh báo lấy manifest:', err?.message || err);
  }
  console.log('──────────────────────────────────────────────────────────────────────────────────────────────────\n');

  // 2. Kích hoạt toàn bộ workers song song (staggered 250ms để ngăn ngừa process storm trên Windows)
  console.log(`🚀 Bước 2: Kích hoạt đồng thời ${activeSpecs.length} Master Workers song song...\n`);
  const workerPromises = activeSpecs.map((spec, idx) =>
    new Promise<MasterWorkerResult>(async (resolve) => {
      if (idx > 0) await new Promise((r) => setTimeout(r, idx * 250));
      resolve(await runSingleWorker(spec, commonArgs));
    })
  );
  const results = await Promise.all(workerPromises);

  // 3. Tổng hợp lại Partitioned Manifests
  console.log('\n──────────────────────────────────────────────────────────────────────────────────────────────────');
  console.log('🔄 Bước 3: Tổng hợp (Aggregate) các phân vùng manifest vào data/multimodal-manifest.json...');
  let finalManifest: any = { totalAssets: 0, categories: {}, assets: {} };
  try {
    finalManifest = DriveFolderManager.aggregateManifests();
  } catch (err: any) {
    console.warn('⚠️ Cảnh báo tổng hợp manifests:', err?.message || err);
    try {
      finalManifest = DriveFolderManager.getManifest(false);
    } catch {}
  }
  const totalDuration = ((Date.now() - globalStart) / 1000).toFixed(1);

  // 4. In bảng tổng kết hiệu năng
  console.log('\n╔══════════════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║ 📊 BÁO CÁO TỔNG KẾT MASTER ORCHESTRATOR - STREAMING HOÀN THÀNH THÀNH CÔNG:                      ║');
  console.log('╠══════════════════════════════════════════════════════════════════════════════════════════════════╣');
  for (const r of results) {
    const status = r.code === 0 ? '✓ XANH' : '⚠️ WARN';
    const idPad = String(r.spec.id).padEnd(4, ' ');
    const suiteTag = `[S-${r.spec.suite}]`;
    const namePad = r.spec.name.padEnd(46, ' ');
    const deltaStr = `+${r.deltaCount}`.padStart(5, ' ');
    const totalStr = `${r.finalCount}`.padStart(6, ' ');
    const timeStr = `${(r.durationMs / 1000).toFixed(1)}s`.padStart(6, ' ');
    console.log(`║ ${r.spec.icon} W${idPad} ${suiteTag} ${namePad} | ${status} | Mới: ${deltaStr} | Tổng: ${totalStr} | ${timeStr} ║`);
  }
  console.log('╠══════════════════════════════════════════════════════════════════════════════════════════════════╣');
  console.log(`║ 📁 TỔNG TÀI NGUYÊN TRÊN GOOGLE DRIVE 15TB:           ${String(finalManifest.totalAssets).padEnd(6, ' ')} tệp đa phương tiện                   ║`);
  console.log(`║ ⏱️ TỔNG THỜI GIAN CHU KỲ:                             ${totalDuration.padEnd(6, ' ')} giây                                  ║`);
  console.log(`║ 💾 DUNG LƯỢNG Ổ CỨNG CỤC BỘ TIÊU THỤ:                0 BYTES (DIRECT HTTP STREAMING TO DRIVE)         ║`);
  console.log(`║ 📄 MANIFEST CHÍNH (AGGREGATED):                       data/multimodal-manifest.json                   ║`);
  console.log(`║ 📂 PHÂN VÙNG SUITE A (BASE SHOWCASE):                 data/manifests/*.json (8 files)                 ║`);
  console.log(`║ 📂 PHÂN VÙNG SUITE B (HUGGING FACE / LINGUISTIC):     data/manifests/suite_b/*.json (3 files)         ║`);
  console.log('╚══════════════════════════════════════════════════════════════════════════════════════════════════╝\n');

  return { results, finalManifest };
}

const isMain =
  process.argv[1]?.replace(/\\/g, '/').endsWith('orchestrate-master-all-night.ts') ||
  process.argv[1]?.replace(/\\/g, '/').endsWith('orchestrate-all-9-workers.ts');

if (isMain) {
  const isLoop = process.argv.includes('--loop') || process.argv.includes('--all-night');
  const run = async () => {
    if (isLoop) {
      console.log('🔄 Kích hoạt chế độ VÒNG LẶP LIÊN TỤC QUA ĐÊM (All-Night Loop Daemon)...');
      let cycle = 1;
      while (true) {
        console.log(`\n🌀 ===== BẮT ĐẦU CHU KỲ MASTER QUÉT THỨ ${cycle++} =====`);
        try {
          await orchestrateMasterAllNight();
        } catch (err: any) {
          console.error('⚠️ Lỗi chu kỳ quét (tự động phục hồi sau 30s):', err?.stack || err?.message || err);
        }
        console.log('⏳ Nghỉ 30 giây để giữ kết nối HTTP/Drive ổn định trước khi sang chu kỳ tiếp theo...');
        try {
          await new Promise((r) => setTimeout(r, 30000));
        } catch (err: any) {
          console.warn('⚠️ Lỗi chờ chu kỳ:', err);
        }
      }
    } else {
      await orchestrateMasterAllNight();
    }
  };

  const startDaemon = () => {
    run().catch((err) => {
      console.error('⚠️ Lỗi điều phối master runner (tự động phục hồi):', err?.stack || err?.message || err);
      if (isLoop) {
        console.log('🔁 Tự động tái khởi động vòng lặp daemon sau 15 giây...');
        setTimeout(startDaemon, 15000);
      } else {
        process.exit(1);
      }
    });
  };

  startDaemon();
}
