import fs from 'fs';
import path from 'path';
import type {
  MultimodalAsset,
  AssetCategory,
  AssetCdnResolvable,
  MultimodalSummary,
  AssetMetadata,
} from './types';

export type {
  MultimodalAsset,
  AssetCategory,
  AssetCdnResolvable,
  MultimodalSummary,
  KanjiMetadata,
  VocabAudioMetadata,
  IllustrationMetadata,
  GrammarInfographicMetadata,
  IeltsAudioMetadata,
  ImmersionClipMetadata,
  JlptChoukaiMetadata,
  PubMedCorpusMetadata,
  AssetMetadata,
} from './types';

/**
 * Backward compatibility alias for MultimodalAsset
 */
export type MultimodalAssetInfo = MultimodalAsset;

/**
 * Resolves the optimal direct Google CDN URL for an asset based on its type.
 *
 * - Audio MP3s (vocab_audio, ielts_audio, immersion_clip, jlpt_choukai, or audio/mpeg):
 *   Uses Google Drive uc export download stream URL (https://drive.google.com/uc?export=download&id=${fileId})
 *   which reliably streams audio without Google Photos 404 blocking.
 * - Visual assets (kanji animated SVGs, illustrations, infographics, images):
 *   Uses Google LightHouse high-performance CDN (https://lh3.googleusercontent.com/d/${fileId}).
 */
export function resolveAssetCdnUrl(asset: {
  fileId: string;
  mimeType?: string;
  category?: string;
}): string {
  if (!asset || !asset.fileId) {
    return '';
  }

  const fileId = asset.fileId;
  const mime = (asset.mimeType || '').toLowerCase();
  const cat = (asset.category || '').toLowerCase();

  const isAudio =
    mime === 'audio/mpeg' ||
    mime.startsWith('audio/') ||
    cat === 'vocab_audio' ||
    cat === 'ielts_audio' ||
    cat === 'immersion_clip' ||
    cat === 'jlpt_choukai';

  if (isAudio) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }

  return `https://lh3.googleusercontent.com/d/${fileId}`;
}

/**
 * Synchronously retrieves all multimodal assets with resolved CDN URLs across all 8 domains.
 */
export function getAllMultimodalAssets(): MultimodalAsset[] {
  return MultimodalMediaService.getAllAssets();
}

export class MultimodalMediaService {
  private static manifestCache: any = null;
  private static assetsCache: MultimodalAsset[] | null = null;
  private static lastReadTime = 0;

  /**
   * Loads manifest data from partitioned files or central manifest with 2-second cache.
   */
  private static loadManifest(): any {
    const now = Date.now();
    if (this.manifestCache && now - this.lastReadTime < 2000) {
      return this.manifestCache;
    }

    const manifestsDir = path.resolve(process.cwd(), 'data', 'manifests');
    if (fs.existsSync(manifestsDir)) {
      const files = fs
        .readdirSync(manifestsDir)
        .filter((f) => f.endsWith('.json') && !f.includes('.tmp.'));
      if (files.length > 0) {
        const aggregated: any = {
          totalAssets: 0,
          lastUpdated: new Date().toISOString(),
          categories: {},
          assets: {},
        };
        for (const file of files) {
          try {
            const raw = JSON.parse(
              fs.readFileSync(path.join(manifestsDir, file), 'utf-8')
            );
            const cat = raw.category || file.replace('.json', '');
            const assets = raw.assets || {};
            aggregated.categories[cat] = Object.keys(assets).length;
            for (const [k, v] of Object.entries(assets)) {
              aggregated.assets[k] = v;
            }
          } catch {}
        }
        aggregated.totalAssets = Object.keys(aggregated.assets).length;
        this.manifestCache = aggregated;
        this.assetsCache = null; // Invalidate cached mapped assets
        this.lastReadTime = now;
        return aggregated;
      }
    }

    const manifestPath = path.resolve(
      process.cwd(),
      'data',
      'multimodal-manifest.json'
    );
    if (!fs.existsSync(manifestPath)) {
      return { totalAssets: 0, assets: {}, categories: {} };
    }

    try {
      const content = fs.readFileSync(manifestPath, 'utf-8');
      this.manifestCache = JSON.parse(content);
      this.assetsCache = null;
      this.lastReadTime = now;
      return this.manifestCache;
    } catch {
      return { totalAssets: 0, assets: {}, categories: {} };
    }
  }

  /**
   * Resolves direct CDN URL using dual CDN strategy.
   */
  static resolveAssetCdnUrl(asset: {
    fileId: string;
    mimeType?: string;
    category?: string;
  }): string {
    return resolveAssetCdnUrl(asset);
  }

  /**
   * Synchronously loads all multimodal assets across 8 categories with resolved CDN URLs.
   */
  static getAllAssets(): MultimodalAsset[] {
    const manifest = this.loadManifest();
    if (this.assetsCache) {
      return this.assetsCache;
    }

    const rawAssets = manifest.assets || {};
    const results: MultimodalAsset[] = [];

    for (const [key, raw] of Object.entries<any>(rawAssets)) {
      const fileId = raw.fileId || '';
      const mimeType = raw.mimeType || '';
      const category = (raw.category || 'kanji') as AssetCategory;
      const cdnUrl = resolveAssetCdnUrl({ fileId, mimeType, category });

      results.push({
        key: raw.key || key,
        category,
        fileName: raw.fileName || '',
        mimeType,
        fileId,
        driveUrl:
          raw.driveUrl ||
          (fileId
            ? `https://drive.google.com/file/d/${fileId}/view?usp=drivesdk`
            : ''),
        cdnUrl,
        sizeBytes: typeof raw.sizeBytes === 'number' ? raw.sizeBytes : 0,
        updatedAt: raw.updatedAt,
        metadata: raw.metadata,
      });
    }

    this.assetsCache = results;
    return results;
  }

  /**
   * Alias for getAllAssets() to satisfy interface contract.
   */
  static getAllMultimodalAssets(): MultimodalAsset[] {
    return this.getAllAssets();
  }

  /**
   * Lấy asset theo key chính xác (ví dụ 'kanji:東', 'vocab_audio:両親')
   */
  static getAsset(key: string): MultimodalAsset | null {
    const manifest = this.loadManifest();
    const raw = manifest.assets?.[key];
    if (!raw) return null;

    const fileId = raw.fileId || '';
    const mimeType = raw.mimeType || '';
    const category = (raw.category || 'kanji') as AssetCategory;
    const cdnUrl = resolveAssetCdnUrl({ fileId, mimeType, category });

    return {
      key: raw.key || key,
      category,
      fileName: raw.fileName || '',
      mimeType,
      fileId,
      driveUrl:
        raw.driveUrl ||
        (fileId
          ? `https://drive.google.com/file/d/${fileId}/view?usp=drivesdk`
          : ''),
      cdnUrl,
      sizeBytes: typeof raw.sizeBytes === 'number' ? raw.sizeBytes : 0,
      updatedAt: raw.updatedAt,
      metadata: raw.metadata,
    };
  }

  /**
   * Lấy URL nét viết động cho Hán tự
   */
  static getKanjiStrokeUrl(kanjiChar: string): string | null {
    const asset = this.getAsset(`kanji:${kanjiChar}`);
    return asset ? asset.cdnUrl : null;
  }

  /**
   * Lấy URL âm thanh phát âm bản xứ Tokyo cho từ vựng
   */
  static getNativeAudioUrl(word: string): string | null {
    const asset = this.getAsset(`vocab_audio:${word}`);
    return asset ? asset.cdnUrl : null;
  }

  /**
   * Lấy URL hình ảnh minh họa tình huống cho từ vựng (Irasutoya PNG)
   */
  static getIllustrationUrl(word: string): string | null {
    const asset = this.getAsset(`illustration:${word}`);
    return asset ? asset.cdnUrl : null;
  }

  /**
   * Lấy URL sơ đồ tư duy / Infographic cho mẫu ngữ pháp
   */
  static getGrammarInfographicUrl(patternKey: string): string | null {
    const asset = this.getAsset(`grammar_infographic:${patternKey}`);
    return asset ? asset.cdnUrl : null;
  }

  /**
   * Lấy đoạn hội thoại ngữ cảnh Anime/Immersion có phụ đề song ngữ
   */
  static getImmersionClip(keyword: string): MultimodalAsset | null {
    const asset = this.getAsset(`immersion_clip:${keyword}`);
    return asset || null;
  }

  /**
   * Lấy câu hỏi và audio bài thi nghe JLPT Choukai
   */
  static getJlptChoukai(questionId: string): MultimodalAsset | null {
    const asset = this.getAsset(`jlpt_choukai:${questionId}`);
    return asset || null;
  }

  /**
   * Lấy âm thanh chuẩn phòng thu Cambridge / Oxford IELTS
   */
  static getIeltsAudioUrl(word: string): string | null {
    const asset = this.getAsset(`ielts_audio:${word}`);
    return asset ? asset.cdnUrl : null;
  }

  /**
   * Lấy bản ghi học thuật y sinh học & khoa học nhận thức PubMed
   */
  static getPubMedRecord(pmid: string): MultimodalAsset | null {
    const asset = this.getAsset(`pubmed_corpus:${pmid}`);
    return asset || null;
  }

  /**
   * Tìm kiếm danh sách tài nguyên theo danh mục
   */
  static getAssetsByCategory(category: string, limit = 20): MultimodalAsset[] {
    if (limit <= 0) return [];
    const all = this.getAllAssets();
    const results: MultimodalAsset[] = [];
    for (const item of all) {
      if (item.category === category) {
        results.push(item);
        if (results.length >= limit) break;
      }
    }
    return results;
  }

  /**
   * Tìm kiếm toàn văn trên kho tài nguyên đa phương tiện
   */
  static searchAssets(query: string, category?: string, limit = 20): MultimodalAsset[] {
    if (limit <= 0) return [];
    const all = this.getAllAssets();
    const q = query.toLowerCase();
    const results: MultimodalAsset[] = [];
    for (const item of all) {
      if (category && item.category !== category) continue;
      const match =
        item.key.toLowerCase().includes(q) ||
        (item.fileName && item.fileName.toLowerCase().includes(q)) ||
        (item.metadata?.word && String(item.metadata.word).toLowerCase().includes(q)) ||
        (item.metadata?.title && String(item.metadata.title).toLowerCase().includes(q)) ||
        (item.metadata?.japanese && String(item.metadata.japanese).toLowerCase().includes(q)) ||
        (item.metadata?.kanji && String(item.metadata.kanji).toLowerCase().includes(q)) ||
        (item.metadata?.keyword && String(item.metadata.keyword).toLowerCase().includes(q));
      if (match) {
        results.push(item);
        if (results.length >= limit) break;
      }
    }
    return results;
  }

  /**
   * Lấy tổng kết các tài nguyên đa phương tiện hiện có
   */
  static getSummary(): MultimodalSummary {
    const manifest = this.loadManifest();
    return {
      totalAssets: manifest.totalAssets || 0,
      categories: manifest.categories || {},
      lastUpdated: manifest.lastUpdated || '',
    };
  }
}
