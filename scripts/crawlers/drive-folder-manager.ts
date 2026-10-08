import fs from 'fs';
import path from 'path';

// Load .env
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const k = trimmed.slice(0, idx).trim();
      const v = trimmed.slice(idx + 1).trim();
      process.env[k] = v;
    }
  }
}

import { GoogleDriveService } from '../../src/services/google/drive.service';

const DRIVE_CONFIG_PATH = path.resolve(process.cwd(), 'data', 'drive-folders.json');
const MANIFEST_PATH = path.resolve(process.cwd(), 'data', 'multimodal-manifest.json');
const MANIFESTS_DIR = path.resolve(process.cwd(), 'data', 'manifests');
const SUITE_B_DIR = path.resolve(process.cwd(), 'data', 'manifests', 'suite_b');
const SHARDS_DIR = path.resolve(process.cwd(), 'data', 'manifests', 'shards');
const SUITE_B_CATEGORIES = new Set([
  'jlpt_dokkai',
  'jesc_subtitles',
  'yojijukugo_onomatopoeia',
]);

export function getCategoryPartitionDir(category: string, shardId?: string): string {
  if (shardId || process.env.WORKER_SHARD_ID) {
    return SHARDS_DIR;
  }
  const norm = normalizeCategory(category);
  return SUITE_B_CATEGORIES.has(norm) ? SUITE_B_DIR : MANIFESTS_DIR;
}

export function normalizeCategory(category: string): string {
  if (category === 'tatoeba_audio') return 'vocab_audio';
  if (category === 'irasutoya_illustration') return 'illustration';
  return category;
}

export interface DriveFolderMap {
  rootFolderId: string;
  kanjiStrokeFolderId: string;
  japaneseAudioFolderId: string;
  minnaIllustrationsFolderId: string;
  grammarInfographicsFolderId: string;
  ieltsAudioFolderId: string;
  tatoebaAudioFolderId?: string;
  irasutoyaIllustrationsFolderId?: string;
  immersionClipsFolderId?: string;
  jlptChoukaiFolderId?: string;
  pubmedCorpusFolderId?: string;
  jlptDokkaiFolderId?: string;
  jescSubtitlesFolderId?: string;
  yojijukugoLexiconFolderId?: string;
}

export type MultimodalCategory =
  | 'kanji'
  | 'vocab_audio'
  | 'illustration'
  | 'grammar_infographic'
  | 'ielts_audio'
  | 'tatoeba_audio'
  | 'irasutoya_illustration'
  | 'immersion_clip'
  | 'jlpt_choukai'
  | 'pubmed_corpus'
  | 'jlpt_dokkai'
  | 'jesc_subtitles'
  | 'yojijukugo_onomatopoeia';

export interface AssetEntry {
  key: string;            // e.g. kanji:東, vocab:両親, tatoeba:1051833, irasutoya:家族, immersion:学校, jlpt:N5_2020_01, ielts:ubiquitous, pubmed:35113657
  category: MultimodalCategory | string;
  fileName: string;
  mimeType: string;
  fileId: string;
  driveUrl: string;
  cdnUrl: string;
  sizeBytes?: number;
  metadata?: Record<string, any>;
  updatedAt: string;
}

export interface MultimodalManifest {
  totalAssets: number;
  lastUpdated: string;
  categories: Record<string, number>;
  assets: Record<string, AssetEntry>;
}

export class DriveFolderManager {
  private static folderMap: DriveFolderMap | null = null;
  private static manifest: MultimodalManifest | null = null;

  static async initFolders(): Promise<DriveFolderMap> {
    if (this.folderMap) return this.folderMap;

    const dataDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    let existingMap: Partial<DriveFolderMap> = {};
    if (fs.existsSync(DRIVE_CONFIG_PATH)) {
      try {
        existingMap = JSON.parse(fs.readFileSync(DRIVE_CONFIG_PATH, 'utf-8'));
      } catch {}
    }

    const rootFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID || '1GbG5uuvH_nBLqjr5yjmdrPMnvrDPenb_';
    console.log(`📁 Khởi tạo cấu trúc 8 thư mục đa phương tiện trên Google Drive Root: ${rootFolderId}...`);

    // Kiểm tra danh sách thư mục con hiện có
    const existingFiles = await GoogleDriveService.listFiles(rootFolderId, 100);
    const existingFolders = new Map<string, string>();
    for (const f of existingFiles) {
      if (f.mimeType === 'application/vnd.google-apps.folder' && f.name && f.id) {
        existingFolders.set(f.name, f.id);
      }
    }

    const getOrCreate = async (name: string): Promise<string> => {
      if (existingFolders.has(name)) {
        console.log(`  ✓ Đã có thư mục: ${name} (${existingFolders.get(name)})`);
        return existingFolders.get(name)!;
      }
      console.log(`  ➕ Đang tạo thư mục mới: ${name}...`);
      const created = await GoogleDriveService.createFolder(name, rootFolderId);
      console.log(`  ✓ Đã tạo thành công: ${name} (${created.id})`);
      return created.id;
    };

    const kanjiStrokeFolderId = existingMap.kanjiStrokeFolderId || await getOrCreate('01_Kanji_Stroke_Order_Animations');
    const japaneseAudioFolderId = existingMap.japaneseAudioFolderId || await getOrCreate('02_Japanese_Native_Audio_Bank');
    const minnaIllustrationsFolderId = existingMap.minnaIllustrationsFolderId || await getOrCreate('03_Minna_Visual_Illustrations');
    const grammarInfographicsFolderId = existingMap.grammarInfographicsFolderId || await getOrCreate('04_Grammar_Mindmaps_Infographics');
    const ieltsAudioFolderId = existingMap.ieltsAudioFolderId || await getOrCreate('05_IELTS_Practice_Audio_Bank');
    
    // 3 thư mục quy mô lớn bổ sung cho 800GB
    const immersionClipsFolderId = existingMap.immersionClipsFolderId || await getOrCreate('06_Anime_Immersion_Sentence_Clips');
    const jlptChoukaiFolderId = existingMap.jlptChoukaiFolderId || await getOrCreate('07_JLPT_Choukai_Exam_Archive');
    const pubmedCorpusFolderId = existingMap.pubmedCorpusFolderId || await getOrCreate('08_PubMed_JStage_Bilingual_Corpus');

    // 3 thư mục bổ sung từ Hugging Face & Ngôn ngữ học đỉnh cao
    const jlptDokkaiFolderId = existingMap.jlptDokkaiFolderId || await getOrCreate('09_JLPT_Dokkai_Reading_Comprehension');
    const jescSubtitlesFolderId = existingMap.jescSubtitlesFolderId || await getOrCreate('10_JESC_Bilingual_Subtitle_Corpus');
    const yojijukugoLexiconFolderId = existingMap.yojijukugoLexiconFolderId || await getOrCreate('11_Yojijukugo_Onomatopoeia_Lexicon');

    const map: DriveFolderMap = {
      rootFolderId,
      kanjiStrokeFolderId,
      japaneseAudioFolderId,
      minnaIllustrationsFolderId,
      grammarInfographicsFolderId,
      ieltsAudioFolderId,
      tatoebaAudioFolderId: japaneseAudioFolderId,
      irasutoyaIllustrationsFolderId: minnaIllustrationsFolderId,
      immersionClipsFolderId,
      jlptChoukaiFolderId,
      pubmedCorpusFolderId,
      jlptDokkaiFolderId,
      jescSubtitlesFolderId,
      yojijukugoLexiconFolderId,
    };

    fs.writeFileSync(DRIVE_CONFIG_PATH, JSON.stringify(map, null, 2), 'utf-8');
    this.folderMap = map;
    this.initPartitionManifests();
    return map;
  }

  static initPartitionManifests(): void {
    if (!fs.existsSync(MANIFESTS_DIR)) {
      fs.mkdirSync(MANIFESTS_DIR, { recursive: true });
    }
    if (!fs.existsSync(SUITE_B_DIR)) {
      fs.mkdirSync(SUITE_B_DIR, { recursive: true });
    }
    if (!fs.existsSync(SHARDS_DIR)) {
      fs.mkdirSync(SHARDS_DIR, { recursive: true });
    }

    // Tự động di chuyển bất kỳ tệp shard nào lọt vào MANIFESTS_DIR sang SHARDS_DIR
    try {
      const files = fs.readdirSync(MANIFESTS_DIR);
      for (const f of files) {
        if (f.endsWith('.json') && !f.includes('.tmp.') && /_(s\d+|\d+)\.json$/.test(f)) {
          const src = path.join(MANIFESTS_DIR, f);
          const dest = path.join(SHARDS_DIR, f);
          try {
            fs.renameSync(src, dest);
          } catch {
            fs.copyFileSync(src, dest);
            try { fs.unlinkSync(src); } catch {}
          }
        }
      }
    } catch {}

    const canonicalFiles = [
      'kanji.json', 'vocab_audio.json', 'illustration.json', 'grammar_infographic.json',
      'ielts_audio.json', 'immersion_clip.json', 'jlpt_choukai.json', 'pubmed_corpus.json'
    ];
    const allExist = canonicalFiles.every(f => fs.existsSync(path.join(MANIFESTS_DIR, f)));
    if (allExist) {
      return;
    }

    if (fs.existsSync(MANIFEST_PATH)) {
      try {
        const fullManifest: MultimodalManifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
        const partitions: Record<string, Record<string, AssetEntry>> = {};
        for (const [key, item] of Object.entries(fullManifest.assets || {})) {
          const cat = normalizeCategory(item.category || 'misc');
          if (!partitions[cat]) partitions[cat] = {};
          partitions[cat][key] = item;
        }

        for (const [cat, items] of Object.entries(partitions)) {
          const targetDir = getCategoryPartitionDir(cat);
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }
          const partitionPath = path.join(targetDir, `${cat}.json`);
          if (!fs.existsSync(partitionPath)) {
            const partitionData = {
              category: cat,
              totalAssets: Object.keys(items).length,
              lastUpdated: fullManifest.lastUpdated || new Date().toISOString(),
              assets: items,
            };
            fs.writeFileSync(partitionPath, JSON.stringify(partitionData, null, 2), 'utf-8');
          }
        }
      } catch (err) {
        console.warn('[DriveFolderManager] Lỗi khởi tạo phân vùng manifest:', err);
      }
    }
  }

  private static knownKeys: Set<string> | null = null;

  static getPartition(category: string, shardId?: string): { category: string; totalAssets: number; lastUpdated: string; assets: Record<string, AssetEntry> } {
    const effectiveShard = shardId || process.env.WORKER_SHARD_ID;
    const normCat = normalizeCategory(category);
    const targetDir = effectiveShard ? SHARDS_DIR : getCategoryPartitionDir(normCat);
    const partitionFileName = effectiveShard ? `${normCat}_${effectiveShard}.json` : `${normCat}.json`;
    const partitionPath = path.join(targetDir, partitionFileName);
    if (fs.existsSync(partitionPath)) {
      try {
        return JSON.parse(fs.readFileSync(partitionPath, 'utf-8'));
      } catch {}
    }
    return {
      category: normCat,
      totalAssets: 0,
      lastUpdated: new Date().toISOString(),
      assets: {},
    };
  }

  static savePartition(category: string, partition: any, shardId?: string): void {
    const effectiveShard = shardId || process.env.WORKER_SHARD_ID;
    const normCat = normalizeCategory(category);
    const targetDir = effectiveShard ? SHARDS_DIR : getCategoryPartitionDir(normCat);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    partition.category = normCat;
    partition.lastUpdated = new Date().toISOString();
    partition.totalAssets = Object.keys(partition.assets || {}).length;

    const partitionFileName = effectiveShard ? `${normCat}_${effectiveShard}.json` : `${normCat}.json`;
    const partitionPath = path.join(targetDir, partitionFileName);
    const tempPath = path.join(targetDir, `${normCat}${effectiveShard ? '_' + effectiveShard : ''}.tmp.${process.pid}.${Date.now()}`);
    const payload = JSON.stringify(partition, null, 2);
    try {
      fs.writeFileSync(tempPath, payload, 'utf-8');
      try {
        fs.renameSync(tempPath, partitionPath);
      } catch {
        fs.copyFileSync(tempPath, partitionPath);
        try { fs.unlinkSync(tempPath); } catch {}
      }
    } catch {
      fs.writeFileSync(partitionPath, payload, 'utf-8');
    }
  }

  static hasAsset(key: string): boolean {
    if (!this.knownKeys) {
      this.knownKeys = new Set<string>();
      if (fs.existsSync(MANIFEST_PATH)) {
        try {
          const full = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
          if (full.assets) {
            Object.keys(full.assets).forEach((k) => this.knownKeys!.add(k));
          }
        } catch {}
      }
      const scanDir = (dir: string) => {
        if (!fs.existsSync(dir)) return;
        const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json') && !f.includes('.tmp.'));
        for (const file of files) {
          try {
            const raw = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
            if (raw.assets) {
              Object.keys(raw.assets).forEach((k) => this.knownKeys!.add(k));
            }
          } catch {}
        }
      };
      scanDir(MANIFESTS_DIR);
      scanDir(SUITE_B_DIR);
      scanDir(SHARDS_DIR);
    }
    return this.knownKeys.has(key);
  }

  static getAsset(key: string): AssetEntry | null {
    if (this.manifest?.assets?.[key]) return this.manifest.assets[key];
    if (fs.existsSync(MANIFEST_PATH)) {
      try {
        const full = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
        if (full.assets?.[key]) return full.assets[key];
      } catch {}
    }
    const checkDir = (dir: string): AssetEntry | null => {
      if (!fs.existsSync(dir)) return null;
      const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json') && !f.includes('.tmp.'));
      for (const file of files) {
        try {
          const raw = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
          if (raw.assets?.[key]) return raw.assets[key];
        } catch {}
      }
      return null;
    };
    return checkDir(MANIFESTS_DIR) || checkDir(SUITE_B_DIR) || checkDir(SHARDS_DIR);
  }

  static aggregateManifests(): MultimodalManifest {
    this.initPartitionManifests();

    const aggregated: MultimodalManifest = {
      totalAssets: 0,
      lastUpdated: new Date().toISOString(),
      categories: {
        kanji: 0,
        vocab_audio: 0,
        illustration: 0,
        grammar_infographic: 0,
        ielts_audio: 0,
        immersion_clip: 0,
        jlpt_choukai: 0,
        pubmed_corpus: 0,
        jlpt_dokkai: 0,
        jesc_subtitles: 0,
        yojijukugo_onomatopoeia: 0,
      },
      assets: {},
    };

    const loadFromDir = (dir: string) => {
      if (!fs.existsSync(dir)) return;
      const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json') && !f.includes('.tmp.'));
      for (const file of files) {
        try {
          const raw = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
          const assets = raw.assets || {};
          for (const [k, v] of Object.entries(assets)) {
            aggregated.assets[k] = v as AssetEntry;
          }
        } catch {}
      }
    };

    loadFromDir(MANIFESTS_DIR);
    loadFromDir(SUITE_B_DIR);

    // Sáp nhập từ SHARDS_DIR và đồng bộ vào các partition chính
    if (fs.existsSync(SHARDS_DIR)) {
      const shardFiles = fs.readdirSync(SHARDS_DIR).filter((f) => f.endsWith('.json') && !f.includes('.tmp.'));
      const shardAssetsByCategory: Record<string, Record<string, AssetEntry>> = {};
      for (const file of shardFiles) {
        try {
          const raw = JSON.parse(fs.readFileSync(path.join(SHARDS_DIR, file), 'utf-8'));
          const rawCat = raw.category || file.split('_')[0];
          const cat = normalizeCategory(rawCat);
          if (!shardAssetsByCategory[cat]) shardAssetsByCategory[cat] = {};
          const assets = raw.assets || {};
          for (const [k, v] of Object.entries(assets)) {
            aggregated.assets[k] = v as AssetEntry;
            shardAssetsByCategory[cat][k] = v as AssetEntry;
          }
        } catch {}
      }

      for (const [cat, shardAssets] of Object.entries(shardAssetsByCategory)) {
        if (Object.keys(shardAssets).length > 0) {
          const basePartition = this.getPartition(cat);
          let updated = false;
          for (const [k, v] of Object.entries(shardAssets)) {
            if (!basePartition.assets[k]) {
              basePartition.assets[k] = v;
              updated = true;
            }
          }
          if (updated) {
            this.savePartition(cat, basePartition);
          }
        }
      }
    }

    for (const item of Object.values(aggregated.assets)) {
      const cat = normalizeCategory(item.category || 'misc');
      aggregated.categories[cat] = (aggregated.categories[cat] || 0) + 1;
    }

    aggregated.totalAssets = Object.keys(aggregated.assets).length;
    this.manifest = aggregated;

    // Ghi nguyên tử ra data/multimodal-manifest.json
    const tempPath = `${MANIFEST_PATH}.tmp.${process.pid}.${Date.now()}`;
    const payload = JSON.stringify(aggregated, null, 2);
    try {
      fs.writeFileSync(tempPath, payload, 'utf-8');
      try {
        fs.renameSync(tempPath, MANIFEST_PATH);
      } catch {
        fs.copyFileSync(tempPath, MANIFEST_PATH);
        try { fs.unlinkSync(tempPath); } catch {}
      }
    } catch {
      fs.writeFileSync(MANIFEST_PATH, payload, 'utf-8');
    }

    return aggregated;
  }

  static getManifest(forceReload = false): MultimodalManifest {
    if (this.manifest && !forceReload) return this.manifest;

    if (fs.existsSync(MANIFESTS_DIR)) {
      const files = fs.readdirSync(MANIFESTS_DIR).filter(f => f.endsWith('.json') && !f.includes('.tmp.'));
      if (files.length > 0) {
        return this.aggregateManifests();
      }
    }

    if (fs.existsSync(MANIFEST_PATH)) {
      try {
        this.manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
        return this.manifest!;
      } catch {}
    }

    this.manifest = {
      totalAssets: 0,
      lastUpdated: new Date().toISOString(),
      categories: {
        kanji: 0,
        vocab_audio: 0,
        illustration: 0,
        grammar_infographic: 0,
        ielts_audio: 0,
        immersion_clip: 0,
        jlpt_choukai: 0,
        pubmed_corpus: 0,
      },
      assets: {},
    };
    return this.manifest;
  }

  static removeAsset(key: string): boolean {
    let removed = false;
    const cleanFromDir = (dir: string) => {
      if (!fs.existsSync(dir)) return;
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.json') && !f.includes('.tmp.'));
      for (const file of files) {
        const cat = file.replace('.json', '');
        const partition = this.getPartition(cat);
        if (partition.assets[key]) {
          delete partition.assets[key];
          this.savePartition(cat, partition);
          removed = true;
        }
      }
    };
    cleanFromDir(MANIFESTS_DIR);
    cleanFromDir(SUITE_B_DIR);
    cleanFromDir(SHARDS_DIR);
    if (this.manifest && this.manifest.assets[key]) {
      delete this.manifest.assets[key];
      removed = true;
    }
    if (removed) {
      this.aggregateManifests();
    }
    return removed;
  }

  static saveManifest() {
    this.aggregateManifests();
  }

  static async uploadAndRegister(options: {
    key: string;
    category: MultimodalCategory | string;
    fileName: string;
    mimeType: string;
    content: any; // Buffer | string | Readable
    folderId: string;
    metadata?: Record<string, any>;
    sizeBytes?: number;
    shardId?: string;
  }): Promise<AssetEntry> {
    const shard = options.shardId || process.env.WORKER_SHARD_ID;
    const normCat = normalizeCategory(options.category);
    const partition = this.getPartition(normCat, shard);
    if (partition.assets[options.key]) {
      return partition.assets[options.key];
    }
    if (this.hasAsset(options.key)) {
      const existing = this.getAsset(options.key);
      if (existing) return existing;
    }

    const uploaded = await GoogleDriveService.uploadFile({
      fileName: options.fileName,
      mimeType: options.mimeType,
      content: options.content,
      folderId: options.folderId,
      makePublic: true,
    });

    let computedSize = options.sizeBytes || 0;
    if (!computedSize) {
      if (typeof options.content === 'string') {
        computedSize = Buffer.byteLength(options.content);
      } else if (Buffer.isBuffer(options.content)) {
        computedSize = options.content.length;
      }
    }

    const entry: AssetEntry = {
      key: options.key,
      category: normCat,
      fileName: options.fileName,
      mimeType: options.mimeType,
      fileId: uploaded.id,
      driveUrl: uploaded.viewUrl,
      cdnUrl: uploaded.cdnUrl,
      sizeBytes: computedSize,
      metadata: options.metadata,
      updatedAt: new Date().toISOString(),
    };

    // Chỉ cập nhật và ghi partition của riêng shard này (tránh race condition hoàn toàn)
    const latestPartition = this.getPartition(normCat, shard);
    latestPartition.assets[options.key] = entry;
    this.savePartition(normCat, latestPartition, shard);
    if (this.knownKeys) this.knownKeys.add(options.key);

    return entry;
  }
}
