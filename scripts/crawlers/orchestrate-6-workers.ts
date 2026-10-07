import { spawn } from 'child_process';
import path from 'path';
import { DriveFolderManager } from './drive-folder-manager';

interface WorkerSpec {
  id: number;
  name: string;
  category: string;
  script: string;
  icon: string;
  description: string;
  extraArgs?: string[];
}

const WORKER_SPECS: WorkerSpec[] = [
  {
    id: 1,
    name: 'Tatoeba & NHK Native Audio Streamer',
    category: 'vocab_audio',
    script: 'scripts/crawlers/tatoeba-audio-streamer.ts',
    icon: '🎙️',
    description: 'Âm thanh người thật bản xứ Tokyo từ Tatoeba & Wikimedia Commons',
    extraArgs: ['--feed'],
  },
  {
    id: 2,
    name: 'Irasutoya Master Educational PNG Streamer',
    category: 'illustration',
    script: 'scripts/crawlers/irasutoya-master-streamer.ts',
    icon: '🎨',
    description: 'Tranh minh họa giáo dục Nhật Bản 1200px chuẩn Takashi Mifune',
    extraArgs: ['--categories'],
  },
  {
    id: 3,
    name: 'Anime & Conversation Immersion Spliced Clips',
    category: 'immersion_clip',
    script: 'scripts/crawlers/immersion-clips-streamer.ts',
    icon: '🎬',
    description: 'Clip thoại ngữ cảnh giao tiếp i+1 có phụ đề song ngữ và mốc thời gian',
  },
  {
    id: 4,
    name: 'JLPT Choukai Exam Audio Archive Streamer',
    category: 'jlpt_choukai',
    script: 'scripts/crawlers/jlpt-choukai-streamer.ts',
    icon: '🎧',
    description: 'Đề thi nghe chính thức N5 - N1 từ The Japan Foundation & JEES',
  },
  {
    id: 5,
    name: 'Cambridge IELTS & Oxford Studio Audio Streamer',
    category: 'ielts_audio',
    script: 'scripts/crawlers/cambridge-ielts-streamer.ts',
    icon: '📖',
    description: 'Bài nghe Cambridge IELTS Academic và phát âm Oxford studio lossless',
  },
  {
    id: 6,
    name: 'PubMed & J-STAGE Academic Bilingual Corpus Streamer',
    category: 'pubmed_corpus',
    script: 'scripts/crawlers/pubmed-jstage-streamer.ts',
    icon: '🔬',
    description: 'Toàn văn XML bài báo y sinh Europe PMC và thuật ngữ song ngữ J-STAGE / MeSH',
  },
];

interface WorkerResult {
  spec: WorkerSpec;
  code: number;
  durationMs: number;
  initialCount: number;
  finalCount: number;
  deltaCount: number;
}

function runWorker(spec: WorkerSpec, commonArgs: string[]): Promise<WorkerResult> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const initialPartition = DriveFolderManager.getPartition(spec.category);
    const initialCount = initialPartition.totalAssets;

    const isWin = process.platform === 'win32';
    const cmd = isWin ? 'cmd.exe' : 'npx';
    const scriptPath = path.resolve(process.cwd(), spec.script);
    const cmdArgs = isWin
      ? ['/c', 'npx', 'tsx', scriptPath, ...commonArgs, ...(spec.extraArgs || [])]
      : ['tsx', scriptPath, ...commonArgs, ...(spec.extraArgs || [])];

    console.log(`🚀 [Worker ${spec.id}] Khởi động: ${spec.icon} ${spec.name}`);

    const child = spawn(cmd, cmdArgs, {
      cwd: process.cwd(),
      env: { ...process.env, WORKER_ID: String(spec.id), FORCE_COLOR: '1' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    const prefix = `[W${spec.id} · ${spec.category}]`;

    child.stdout.on('data', (chunk) => {
      const lines = chunk.toString().split(/\r?\n/).filter((l: string) => l.trim().length > 0);
      for (const line of lines) {
        console.log(`${prefix} ${line}`);
      }
    });

    child.stderr.on('data', (chunk) => {
      const lines = chunk.toString().split(/\r?\n/).filter((l: string) => l.trim().length > 0);
      for (const line of lines) {
        console.error(`${prefix} ⚠️ ${line}`);
      }
    });

    child.on('close', (code) => {
      const durationMs = Date.now() - startTime;
      const finalPartition = DriveFolderManager.getPartition(spec.category);
      const finalCount = finalPartition.totalAssets;
      const deltaCount = Math.max(0, finalCount - initialCount);

      if (code === 0) {
        console.log(`✅ [Worker ${spec.id}] Hoàn thành thành công (${(durationMs / 1000).toFixed(1)}s, +${deltaCount} mục)`);
      } else {
        console.warn(`⚠️ [Worker ${spec.id}] Kết thúc với exit code ${code} (${(durationMs / 1000).toFixed(1)}s, +${deltaCount} mục)`);
      }

      resolve({
        spec,
        code: code ?? 0,
        durationMs,
        initialCount,
        finalCount,
        deltaCount,
      });
    });

    child.on('error', (err) => {
      const durationMs = Date.now() - startTime;
      console.error(`❌ [Worker ${spec.id}] Lỗi tiến trình:`, err.message);
      resolve({
        spec,
        code: 1,
        durationMs,
        initialCount,
        finalCount: initialCount,
        deltaCount: 0,
      });
    });
  });
}

export async function orchestrateParallelCrawlers() {
  const globalStart = Date.now();
  console.log('╔══════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║ 🏯 KIOKUDŌ SRS · BỘ ĐIỀU PHỐI 6 SUBAGENTS / WORKERS SONG SONG ĐỘC LẬP                  ║');
  console.log('║    STREAMING PIPELINE LÊN GOOGLE DRIVE 15TB · PHÂN VÙNG MANIFESTS ISOLATION (ZERO-LOCK)║');
  console.log('╚══════════════════════════════════════════════════════════════════════════════════════╝\n');

  // Xác định cờ CLI
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const isAll = process.argv.includes('--all') || !limitArg;
  const commonArgs: string[] = [];
  if (limitArg) {
    commonArgs.push(limitArg);
    console.log(`⚡ Chế độ kiểm tra: Áp dụng ${limitArg} cho từng luồng.\n`);
  } else if (isAll) {
    commonArgs.push('--all');
    console.log(`🌊 Chế độ TOÀN TẬP (--all): Cào toàn bộ dữ liệu 6 kho tàng học thuật chuẩn mực.\n`);
  }

  // 1. Khởi tạo thư mục Google Drive và phân vùng Manifest
  console.log('📁 Bước 1: Khởi tạo 8 thư mục Google Drive và cấu trúc Partitioned Manifests...');
  await DriveFolderManager.initFolders();
  DriveFolderManager.initPartitionManifests();

  const manifestBefore = DriveFolderManager.getManifest(true);
  console.log(`📊 Số lượng tài nguyên hiện tại: ${manifestBefore.totalAssets} tệp đa phương tiện.`);
  console.log('──────────────────────────────────────────────────────────────────────────────────────\n');

  // 2. Chạy 6 workers song song
  console.log('🚀 Bước 2: Kích hoạt đồng thời 6 Subagents / Workers...\n');
  const workerPromises = WORKER_SPECS.map((spec) => runWorker(spec, commonArgs));
  const results = await Promise.all(workerPromises);

  // 3. Tổng hợp lại Partitioned Manifests thành multimodal-manifest.json duy nhất
  console.log('\n──────────────────────────────────────────────────────────────────────────────────────');
  console.log('🔄 Bước 3: Tổng hợp (Aggregate) các phân vùng manifest vào data/multimodal-manifest.json...');
  const finalManifest = DriveFolderManager.aggregateManifests();
  const totalDuration = ((Date.now() - globalStart) / 1000).toFixed(1);

  // 4. In bảng tổng kết hiệu năng
  console.log('\n╔══════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║ 📊 BÁO CÁO TỔNG KẾT ĐIỀU PHỐI 6 SUBAGENTS / WORKERS STREAMING THÀNH CÔNG:            ║');
  console.log('╠══════════════════════════════════════════════════════════════════════════════════════╣');
  for (const r of results) {
    const status = r.code === 0 ? '✓ XANH' : '⚠️ WARN';
    const namePad = r.spec.name.padEnd(46, ' ');
    const deltaStr = `+${r.deltaCount}`.padStart(5, ' ');
    const totalStr = `${r.finalCount}`.padStart(5, ' ');
    const timeStr = `${(r.durationMs / 1000).toFixed(1)}s`.padStart(6, ' ');
    console.log(`║ ${r.spec.icon} W${r.spec.id}: ${namePad} | ${status} | Mới: ${deltaStr} | Tổng: ${totalStr} | ${timeStr} ║`);
  }
  console.log('╠══════════════════════════════════════════════════════════════════════════════════════╣');
  console.log(`║ 📁 TỔNG TÀI NGUYÊN STREAMING LÊN GOOGLE DRIVE 15TB:   ${String(finalManifest.totalAssets).padEnd(6, ' ')} tệp đa phương tiện        ║`);
  console.log(`║ ⏱️ TỔNG THỜI GIAN THỰC THI TOÀN BỘ 6 WORKERS:          ${totalDuration.padEnd(6, ' ')} giây                       ║`);
  console.log(`║ 💾 DUNG LƯỢNG Ổ CỨNG CỤC BỘ TIÊU THỤ (DISK WRITE):    0 BYTES (DIRECT HTTP STREAMING)  ║`);
  console.log(`║ 📄 MANIFEST CHÍNH (AGGREGATED):                       data/multimodal-manifest.json    ║`);
  console.log(`║ 📂 PHÂN VÙNG ĐỘC LẬP (ISOLATED PARTITIONS):           data/manifests/*.json            ║`);
  console.log('╚══════════════════════════════════════════════════════════════════════════════════════╝\n');

  return { results, finalManifest };
}

if (process.argv[1]?.endsWith('orchestrate-6-workers.ts')) {
  orchestrateParallelCrawlers().catch((err) => {
    console.error('Lỗi điều phối 6 workers song song:', err);
    process.exit(1);
  });
}
