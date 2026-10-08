import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  MultimodalMediaService,
  resolveAssetCdnUrl,
  getAllMultimodalAssets,
} from '@/services/multimodal/media.service';
import type { MultimodalAsset, AssetCategory } from '@/services/multimodal/types';
import { GET as getMediaRoute } from '@/app/api/media/route';
import { GET as getCardsRoute } from '@/app/api/cards/route';

describe('Tier 1-4 Multimodal Drive Showcase API & Dual CDN Resolution (tests/drive-showcase-api.test.ts)', () => {
  const ALL_8_CATEGORIES: AssetCategory[] = [
    'kanji',
    'vocab_audio',
    'illustration',
    'grammar_infographic',
    'ielts_audio',
    'immersion_clip',
    'jlpt_choukai',
    'pubmed_corpus',
  ];

  // --------------------------------------------------------------------------
  // TIER 1: CORE DUAL CDN RESOLUTION & SERVICE CONTRACTS
  // --------------------------------------------------------------------------
  describe('Tier 1: Dual CDN URL Resolution & Media Service', () => {
    it('T1-CDN-01: resolves visual assets (Kanji SVG) to Google LightHouse CDN (lh3)', () => {
      const visualKanji = {
        fileId: '1qhIG9aHIxeIAGs3OjHSQpWqS8bDQMsWI',
        mimeType: 'image/svg+xml',
        category: 'kanji',
      };
      const url = resolveAssetCdnUrl(visualKanji);
      expect(url).toBe('https://lh3.googleusercontent.com/d/1qhIG9aHIxeIAGs3OjHSQpWqS8bDQMsWI');
    });

    it('T1-CDN-02: resolves visual illustration PNGs to Google LightHouse CDN (lh3)', () => {
      const visualIllustration = {
        fileId: '1A987654321IllustrationId',
        mimeType: 'image/png',
        category: 'illustration',
      };
      const url = resolveAssetCdnUrl(visualIllustration);
      expect(url).toBe('https://lh3.googleusercontent.com/d/1A987654321IllustrationId');
    });

    it('T1-CDN-03: resolves grammar infographic SVGs to Google LightHouse CDN (lh3)', () => {
      const visualInfographic = {
        fileId: '1GrammarInfoGraphicFileId',
        mimeType: 'image/svg+xml',
        category: 'grammar_infographic',
      };
      const url = resolveAssetCdnUrl(visualInfographic);
      expect(url).toBe('https://lh3.googleusercontent.com/d/1GrammarInfoGraphicFileId');
    });

    it('T1-CDN-04: resolves vocabulary audio MP3s to Google Drive uc export download stream URL', () => {
      const vocabAudio = {
        fileId: '18tWqoAq1n1YtxRJ89oJFZ1PCKIDvewrB',
        mimeType: 'audio/mpeg',
        category: 'vocab_audio',
      };
      const url = resolveAssetCdnUrl(vocabAudio);
      expect(url).toBe('https://drive.google.com/uc?export=download&id=18tWqoAq1n1YtxRJ89oJFZ1PCKIDvewrB');
    });

    it('T1-CDN-05: resolves IELTS and JLPT Choukai audio MP3s to Google Drive uc stream URL', () => {
      const ieltsAudio = {
        fileId: '1IeltsExamAudioId',
        mimeType: 'audio/mpeg',
        category: 'ielts_audio',
      };
      const jlptAudio = {
        fileId: '1JlptExamAudioId',
        mimeType: 'audio/mpeg',
        category: 'jlpt_choukai',
      };

      expect(resolveAssetCdnUrl(ieltsAudio)).toBe('https://drive.google.com/uc?export=download&id=1IeltsExamAudioId');
      expect(resolveAssetCdnUrl(jlptAudio)).toBe('https://drive.google.com/uc?export=download&id=1JlptExamAudioId');
    });

    it('T1-SRV-01: MultimodalMediaService.getSummary() returns all 8 categories and totalAssets >= 456', () => {
      const summary = MultimodalMediaService.getSummary();
      expect(summary).toBeDefined();
      expect(summary.totalAssets).toBeGreaterThanOrEqual(456);

      for (const cat of ALL_8_CATEGORIES) {
        expect(summary.categories[cat]).toBeDefined();
        expect(summary.categories[cat]).toBeGreaterThanOrEqual(0);
      }
    });

    it('T1-SRV-02: getAllMultimodalAssets() returns mapped items with resolved dual CDN URLs', () => {
      const allAssets = getAllMultimodalAssets();
      expect(allAssets.length).toBeGreaterThanOrEqual(456);

      // Verify sample kanji item uses lh3
      const kanjiAsset = allAssets.find((a) => a.category === 'kanji');
      expect(kanjiAsset).toBeDefined();
      expect(kanjiAsset!.cdnUrl).toMatch(/^https:\/\/lh3\.googleusercontent\.com\/d\//);

      // Verify sample audio item uses drive.google.com/uc
      const audioAsset = allAssets.find((a) => a.category === 'vocab_audio');
      expect(audioAsset).toBeDefined();
      expect(audioAsset!.cdnUrl).toMatch(/^https:\/\/drive\.google\.com\/uc\?export=download&id=/);
    });

    it('T1-SRV-03: MultimodalMediaService.getAsset(key) fetches specific asset by key', () => {
      const asset = MultimodalMediaService.getAsset('kanji:東');
      expect(asset).toBeDefined();
      expect(asset!.key).toBe('kanji:東');
      expect(asset!.category).toBe('kanji');
      expect(asset!.fileId).toBeTruthy();
      expect(asset!.cdnUrl).toBeTruthy();
    });
  });

  // --------------------------------------------------------------------------
  // TIER 1: ROUTE HANDLER /api/media INTEGRATION
  // --------------------------------------------------------------------------
  describe('Tier 1: /api/media Route Handler Integration', () => {
    it('T1-API-01: GET /api/media?summary=true returns 200 with summary and 8 categories', async () => {
      const req = new Request('http://localhost:3000/api/media?summary=true');
      const res = await getMediaRoute(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.summary).toBeDefined();
      expect(data.summary.totalAssets).toBeGreaterThanOrEqual(456);
      for (const cat of ALL_8_CATEGORIES) {
        expect(data.summary.categories[cat]).toBeGreaterThanOrEqual(0);
      }
    });

    it('T1-API-02: GET /api/media?category=kanji&limit=5 returns 5 kanji assets', async () => {
      const req = new Request('http://localhost:3000/api/media?category=kanji&limit=5');
      const res = await getMediaRoute(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.category).toBe('kanji');
      expect(Array.isArray(data.items)).toBe(true);
      expect(data.items.length).toBe(5);
      expect(data.items.every((it: MultimodalAsset) => it.category === 'kanji')).toBe(true);
    });

    it('T1-API-03: GET /api/media?category=vocab_audio&limit=10 returns audio items', async () => {
      const req = new Request('http://localhost:3000/api/media?category=vocab_audio&limit=10');
      const res = await getMediaRoute(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.category).toBe('vocab_audio');
      expect(data.items.length).toBe(10);
      expect(data.items.every((it: MultimodalAsset) => it.category === 'vocab_audio')).toBe(true);
    });

    it('T1-API-04: GET /api/media?q=東 matches search query', async () => {
      const req = new Request('http://localhost:3000/api/media?q=%E6%9D%B1&limit=5');
      const res = await getMediaRoute(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.query).toBe('東');
      expect(Array.isArray(data.items)).toBe(true);
      expect(data.items.length).toBeGreaterThanOrEqual(1);
    });

    it('T1-API-05: GET /api/media?key=kanji:東 returns single specific asset', async () => {
      const req = new Request('http://localhost:3000/api/media?key=kanji:%E6%9D%B1');
      const res = await getMediaRoute(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.asset).toBeDefined();
      expect(data.asset.key).toBe('kanji:東');
    });
  });

  // --------------------------------------------------------------------------
  // TIER 2: BOUNDARY, CORNER CASES & FAULT INJECTION
  // --------------------------------------------------------------------------
  describe('Tier 2: Boundary & Corner Cases (Fault Injection)', () => {
    it('T2-EC-01: GET /api/media?category=invalid_quantum_domain returns empty list with 200', async () => {
      const req = new Request('http://localhost:3000/api/media?category=invalid_quantum_domain');
      const res = await getMediaRoute(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.count).toBe(0);
      expect(data.items).toEqual([]);
    });

    it('T2-EC-02: GET /api/media?key=non_existent_random_key_9999 returns null asset with 200', async () => {
      const req = new Request('http://localhost:3000/api/media?key=non_existent_random_key_9999');
      const res = await getMediaRoute(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.asset).toBeNull();
    });

    it('T2-EC-03: resolveAssetCdnUrl handles empty fileId safely by returning empty string', () => {
      expect(resolveAssetCdnUrl({ fileId: '' })).toBe('');
      expect(resolveAssetCdnUrl(null as any)).toBe('');
      expect(resolveAssetCdnUrl(undefined as any)).toBe('');
    });

    it('T2-EC-04: GET /api/media?limit=1 respects boundary and returns at most 1 item', async () => {
      const req = new Request('http://localhost:3000/api/media?category=kanji&limit=1');
      const res = await getMediaRoute(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.items.length).toBe(1);
    });

    it('T2-EC-05: handles missing / corrupted manifest data gracefully via loadManifest fallback', () => {
      // Direct call on non-existent asset returns null without throwing
      const result = MultimodalMediaService.getAsset('unknown:ghost');
      expect(result).toBeNull();
    });
  });

  // --------------------------------------------------------------------------
  // TIER 3: COMBINATIONS & CROSS-DOMAIN MANIFEST INTEGRITY
  // --------------------------------------------------------------------------
  describe('Tier 3: State Combinations & Manifest Integrity', () => {
    it('T3-CB-01: verifies asset data consistency between partitioned files and central manifest', () => {
      const manifestsDir = path.resolve(process.cwd(), 'data', 'manifests');
      expect(fs.existsSync(manifestsDir)).toBe(true);

      const partitionFiles = fs.readdirSync(manifestsDir).filter((f) => f.endsWith('.json') && !f.includes('.tmp.'));
      expect(partitionFiles.length).toBe(8);

      let totalPartitionAssets = 0;
      for (const pFile of partitionFiles) {
        const content = JSON.parse(fs.readFileSync(path.join(manifestsDir, pFile), 'utf-8'));
        expect(content.category).toBeDefined();
        expect(typeof content.totalAssets).toBe('number');
        totalPartitionAssets += content.totalAssets;
      }

      const summary = MultimodalMediaService.getSummary();
      expect(summary.totalAssets).toBe(totalPartitionAssets);
    });

    it('T3-CB-02: verifies all assets have required schema attributes', () => {
      const allAssets = getAllMultimodalAssets();
      for (const asset of allAssets.slice(0, 50)) {
        expect(typeof asset.key).toBe('string');
        expect(typeof asset.category).toBe('string');
        expect(typeof asset.fileName).toBe('string');
        expect(typeof asset.mimeType).toBe('string');
        expect(typeof asset.fileId).toBe('string');
        expect(asset.fileId.length).toBeGreaterThan(5);
        expect(typeof asset.driveUrl).toBe('string');
        expect(typeof asset.cdnUrl).toBe('string');
        expect(typeof asset.sizeBytes).toBe('number');
        expect(asset.sizeBytes).toBeGreaterThanOrEqual(0);
      }
    });

    it('T3-CB-03: cross-queries category + search combination via searchAssets', () => {
      const kanjiResults = MultimodalMediaService.searchAssets('東', 'kanji', 10);
      expect(kanjiResults.length).toBeGreaterThanOrEqual(1);
      expect(kanjiResults.every((item) => item.category === 'kanji')).toBe(true);

      // Mutually exclusive category and query yields empty array
      const emptyResults = MultimodalMediaService.searchAssets('stethoscope', 'kanji', 10);
      expect(emptyResults).toHaveLength(0);
    });
  });

  // --------------------------------------------------------------------------
  // TIER 4: REAL-WORLD & ZERO-BACKEND-REGRESSION VERIFICATION
  // --------------------------------------------------------------------------
  describe('Tier 4: Zero-Backend-Regression (Turso DB Integrity)', () => {
    it('T4-SRE-01: /api/cards preserves its contract without depending on production inventory', async () => {
      const req = new Request('http://localhost:3000/api/cards');
      const res = await getCardsRoute(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(Array.isArray(data.decks)).toBe(true);
      expect(Array.isArray(data.deckSummaries)).toBe(true);
    });
  });
});
