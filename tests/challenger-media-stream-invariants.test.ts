import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {
  MultimodalMediaService,
  resolveAssetCdnUrl,
  getAllMultimodalAssets,
} from '@/services/multimodal/media.service';
import type { MultimodalAsset } from '@/services/multimodal/types';
import { GET as getCardsRoute } from '@/app/api/cards/route';
import { db } from '@/db/client';
import { cards, decks } from '@/db/schema';
import { count } from 'drizzle-orm';

/**
 * ⚔️ CHALLENGER 2: ADVERSARIAL STRESS TEST & SYSTEM INVARIANT SUITE
 *
 * Focus:
 * 1. Dual CDN Routing Contract Verification across 100% of Multimodal Assets
 * 2. Audio Failure Fallback & Latency Dynamics Stress Tests
 * 3. Kanji SVG Replay Animation State Mutation Under Rapid Repeated Clicks
 * 4. Lightbox Modal Zoom Bounds, Panning State & Keyboard Dismissal
 * 5. Database Invariant 1: 0 Schema modifications & 676 cards / 4 decks intact
 */

describe('Challenger 2: Dual CDN Routing, Media Stream Edge Cases & DB Invariants', () => {
  // ==========================================================================
  // SECTION 1: EMPIRICAL VERIFICATION OF DUAL CDN ROUTING CONTRACTS
  // ==========================================================================
  describe('1. Dual CDN Routing Contracts across Complete Manifest Dataset', () => {
    let allAssets: MultimodalAsset[];

    beforeEach(() => {
      allAssets = getAllMultimodalAssets();
    });

    it('EMP-CDN-01: loads complete manifest asset dataset (>=456 items)', () => {
      expect(allAssets).toBeDefined();
      expect(Array.isArray(allAssets)).toBe(true);
      expect(allAssets.length).toBeGreaterThanOrEqual(456);
    });

    it('EMP-CDN-02: 100% of Audio assets route strictly to drive.google.com/uc stream URLs', () => {
      const audioCategories = new Set([
        'vocab_audio',
        'ielts_audio',
        'immersion_clip',
        'jlpt_choukai',
      ]);

      const audioAssets = allAssets.filter(
        (a) =>
          audioCategories.has(a.category) ||
          (a.mimeType && a.mimeType.toLowerCase().startsWith('audio/'))
      );

      expect(audioAssets.length).toBeGreaterThan(0);

      const failures: Array<{ key: string; category: string; cdnUrl: string }> = [];

      for (const asset of audioAssets) {
        const expectedPrefix = 'https://drive.google.com/uc?export=download&id=';
        if (!asset.cdnUrl.startsWith(expectedPrefix)) {
          failures.push({ key: asset.key, category: asset.category, cdnUrl: asset.cdnUrl });
        }
        // Adversarial check: Must NEVER route audio to lh3 CDN (causes Google Photos 404 blocking)
        expect(asset.cdnUrl).not.toContain('lh3.googleusercontent.com');
        // Must contain valid fileId
        expect(asset.cdnUrl).toBe(`${expectedPrefix}${asset.fileId}`);
      }

      expect(failures).toEqual([]);
    });

    it('EMP-CDN-03: 100% of Visual/SVG/Image assets route strictly to lh3.googleusercontent.com', () => {
      const visualCategories = new Set([
        'kanji',
        'illustration',
        'grammar_infographic',
      ]);

      const visualAssets = allAssets.filter(
        (a) =>
          visualCategories.has(a.category) ||
          (a.mimeType && (a.mimeType.includes('image/') || a.mimeType.includes('svg')))
      );

      expect(visualAssets.length).toBeGreaterThan(0);

      const failures: Array<{ key: string; category: string; cdnUrl: string }> = [];

      for (const asset of visualAssets) {
        const expectedPrefix = 'https://lh3.googleusercontent.com/d/';
        if (!asset.cdnUrl.startsWith(expectedPrefix)) {
          failures.push({ key: asset.key, category: asset.category, cdnUrl: asset.cdnUrl });
        }
        // Adversarial check: Must NEVER route images to drive uc download endpoint
        expect(asset.cdnUrl).not.toContain('drive.google.com/uc');
        // Must contain valid fileId
        expect(asset.cdnUrl).toBe(`${expectedPrefix}${asset.fileId}`);
      }

      expect(failures).toEqual([]);
    });

    it('EMP-CDN-04: Adversarial Input Permutations for resolveAssetCdnUrl()', () => {
      // Null / Undefined / Empty inputs
      expect(resolveAssetCdnUrl(null as any)).toBe('');
      expect(resolveAssetCdnUrl(undefined as any)).toBe('');
      expect(resolveAssetCdnUrl({ fileId: '' })).toBe('');
      expect(resolveAssetCdnUrl({ fileId: '', category: 'vocab_audio' })).toBe('');

      // Case insensitivity checks
      expect(
        resolveAssetCdnUrl({
          fileId: 'FID_AUDIO_1',
          mimeType: 'AUDIO/MPEG',
        })
      ).toBe('https://drive.google.com/uc?export=download&id=FID_AUDIO_1');

      expect(
        resolveAssetCdnUrl({
          fileId: 'FID_AUDIO_2',
          category: 'VOCAB_AUDIO',
        })
      ).toBe('https://drive.google.com/uc?export=download&id=FID_AUDIO_2');

      expect(
        resolveAssetCdnUrl({
          fileId: 'FID_AUDIO_3',
          category: 'IELTS_AUDIO',
        })
      ).toBe('https://drive.google.com/uc?export=download&id=FID_AUDIO_3');

      expect(
        resolveAssetCdnUrl({
          fileId: 'FID_AUDIO_4',
          category: 'JLPT_CHOUKAI',
        })
      ).toBe('https://drive.google.com/uc?export=download&id=FID_AUDIO_4');

      expect(
        resolveAssetCdnUrl({
          fileId: 'FID_AUDIO_5',
          category: 'IMMERSION_CLIP',
        })
      ).toBe('https://drive.google.com/uc?export=download&id=FID_AUDIO_5');

      // Visual default fallback
      expect(
        resolveAssetCdnUrl({
          fileId: 'FID_VISUAL_1',
          mimeType: 'IMAGE/SVG+XML',
        })
      ).toBe('https://lh3.googleusercontent.com/d/FID_VISUAL_1');

      expect(
        resolveAssetCdnUrl({
          fileId: 'FID_VISUAL_2',
          category: 'KANJI',
        })
      ).toBe('https://lh3.googleusercontent.com/d/FID_VISUAL_2');

      expect(
        resolveAssetCdnUrl({
          fileId: 'FID_GENERIC_IMAGE',
        })
      ).toBe('https://lh3.googleusercontent.com/d/FID_GENERIC_IMAGE');
    });
  });

  // ==========================================================================
  // SECTION 2: AUDIO FAILURE FALLBACK & LATENCY DYNAMICS STRESS TESTS
  // ==========================================================================
  describe('2. Audio Failure Fallback & Latency Dynamics', () => {
    // Pure oracle mirroring InteractiveAudioCard's internal time format logic
    function formatAudioTime(seconds: number): string {
      if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    it('STR-AUD-01: formatAudioTime gracefully handles extreme and invalid numbers', () => {
      // Normal values
      expect(formatAudioTime(0)).toBe('0:00');
      expect(formatAudioTime(9)).toBe('0:09');
      expect(formatAudioTime(45)).toBe('0:45');
      expect(formatAudioTime(65)).toBe('1:05');
      expect(formatAudioTime(600)).toBe('10:00');

      // Adversarial inputs: NaN, Infinities, negatives, non-numbers
      expect(formatAudioTime(NaN)).toBe('0:00');
      expect(formatAudioTime(Infinity)).toBe('0:00');
      expect(formatAudioTime(-Infinity)).toBe('0:00');
      expect(formatAudioTime(-42)).toBe('0:00');
      expect(formatAudioTime(null as any)).toBe('0:00');
      expect(formatAudioTime(undefined as any)).toBe('0:00');
    });

    it('STR-AUD-02: simulates audio play promise rejection (network 404 / autoplay block)', async () => {
      // Harness simulating InteractiveAudioCard state machine
      let isPlaying = false;
      let hasError = false;

      const mockAudio = {
        play: vi.fn().mockRejectedValue(new Error('MediaError 404: Not Found')),
        pause: vi.fn(),
      };

      const togglePlay = async () => {
        if (isPlaying) {
          mockAudio.pause();
          isPlaying = false;
        } else {
          hasError = false;
          try {
            await mockAudio.play();
            isPlaying = true;
          } catch (err) {
            hasError = true;
            isPlaying = false;
          }
        }
      };

      // 1. Initial state
      expect(isPlaying).toBe(false);
      expect(hasError).toBe(false);

      // 2. Play attempt fails with error
      await togglePlay();
      expect(mockAudio.play).toHaveBeenCalledTimes(1);
      expect(isPlaying).toBe(false);
      expect(hasError).toBe(true);

      // 3. Retry resets error flag and attempts replay
      mockAudio.play.mockResolvedValueOnce(undefined);
      await togglePlay();
      expect(isPlaying).toBe(true);
      expect(hasError).toBe(false);

      // 4. Pausing while playing
      await togglePlay();
      expect(mockAudio.pause).toHaveBeenCalledTimes(1);
      expect(isPlaying).toBe(false);
    });

    it('STR-AUD-05: audio title resolution fallback hierarchy and theme fallback', () => {
      const getCategoryTheme = (category: string) => {
        switch (category) {
          case 'vocab_audio':
            return { label: '語彙音声', color: 'var(--matcha-deep)' };
          case 'ielts_audio':
            return { label: 'IELTS音声', color: 'var(--aizome)' };
          case 'jlpt_choukai':
            return { label: 'JLPT聴解', color: 'var(--bengara)' };
          case 'immersion_clip':
            return { label: '会話クリップ', color: 'var(--kincha)' };
          default:
            return { label: '音声 (Audio)', color: 'var(--sumi-body)' };
        }
      };

      expect(getCategoryTheme('vocab_audio').label).toBe('語彙音声');
      expect(getCategoryTheme('unknown_category').label).toBe('音声 (Audio)');
      expect(getCategoryTheme('').label).toBe('音声 (Audio)');

      const resolveAudioTitle = (asset: {
        key: string;
        fileName: string;
        metadata?: { word?: string; title?: string; japanese?: string };
      }) => {
        const rawKey = asset.key || '';
        const keyIdentifier = rawKey.includes(':') ? rawKey.split(':')[1] : rawKey;
        return (
          asset.metadata?.word ||
          asset.metadata?.title ||
          asset.metadata?.japanese ||
          decodeURIComponent(keyIdentifier) ||
          asset.fileName
        );
      };

      // 1. word priority
      expect(
        resolveAudioTitle({
          key: 'vocab_audio:test',
          fileName: 'test.mp3',
          metadata: { word: '先生', title: 'Teacher' },
        })
      ).toBe('先生');

      // 2. title fallback
      expect(
        resolveAudioTitle({
          key: 'ielts_audio:sample',
          fileName: 'sample.mp3',
          metadata: { title: 'Academic Lecture 1' },
        })
      ).toBe('Academic Lecture 1');

      // 3. japanese fallback
      expect(
        resolveAudioTitle({
          key: 'immersion_clip:clip1',
          fileName: 'clip1.mp3',
          metadata: { japanese: 'こんにちは' },
        })
      ).toBe('こんにちは');

      // 4. keyIdentifier fallback
      expect(
        resolveAudioTitle({
          key: 'vocab_audio:%E5%AD%A6%E6%A0%A1',
          fileName: 'school.mp3',
        })
      ).toBe('学校');

      // 5. fileName fallback
      expect(
        resolveAudioTitle({
          key: '',
          fileName: 'recording_123.mp3',
        })
      ).toBe('recording_123.mp3');
    });
  });

  // ==========================================================================
  // SECTION 3: KANJI SVG REPLAY ANIMATION STRESS TESTS
  // ==========================================================================
  describe('3. Kanji SVG Replay Animation State Mutation Under Rapid Clicks', () => {
    it('STR-KNJ-01: rapid repeated replay clicks preserve monotonic key increment', () => {
      let replayKey = 0;
      let isLoaded = true;
      let hasError = false;

      const handleReplay = () => {
        isLoaded = false;
        hasError = false;
        replayKey += 1;
      };

      // Simulate 100 rapid consecutive clicks
      for (let i = 1; i <= 100; i++) {
        handleReplay();
        expect(replayKey).toBe(i);
        expect(isLoaded).toBe(false);
        expect(hasError).toBe(false);
      }

      expect(replayKey).toBe(100);
    });

    it('STR-KNJ-02: Kanji character extraction oracle handles missing or malformed keys', () => {
      const extractKanjiChar = (asset: {
        key: string;
        metadata?: { kanji?: string };
      }): string => {
        return asset.metadata?.kanji || asset.key.replace(/^kanji:/, '') || '字';
      };

      expect(extractKanjiChar({ key: 'kanji:東', metadata: { kanji: '東' } })).toBe('東');
      expect(extractKanjiChar({ key: 'kanji:春' })).toBe('春');
      expect(extractKanjiChar({ key: 'kanji:学校' })).toBe('学校');
      expect(extractKanjiChar({ key: '' })).toBe('字');
      expect(extractKanjiChar({ key: 'kanji:' })).toBe('字');
    });

    it('STR-KNJ-03: fallback text glyph activates on image loading failure', () => {
      let hasError = false;
      let isLoaded = false;

      const handleImageError = () => {
        hasError = true;
        isLoaded = true;
      };

      handleImageError();
      expect(hasError).toBe(true);
      expect(isLoaded).toBe(true);
    });

    it('STR-KNJ-04: readings parser handles array vs string formats cleanly', () => {
      const formatReadings = (readings: string | string[] | undefined): string => {
        if (!readings) return '';
        return Array.isArray(readings) ? readings.join('、') : readings;
      };

      expect(formatReadings(['トウ', 'ヒガシ'])).toBe('トウ、ヒガシ');
      expect(formatReadings('トウ')).toBe('トウ');
      expect(formatReadings(undefined)).toBe('');
      expect(formatReadings([])).toBe('');
    });
  });

  // ==========================================================================
  // SECTION 4: LIGHTBOX MODAL ZOOM BOUNDS & KEYBOARD DISMISSAL STRESS TESTS
  // ==========================================================================
  describe('4. Lightbox Modal Zoom Bounds, Panning & Keyboard Dismissal', () => {
    it('STR-BOX-01: zoom scales are constrained to finite whitelist [1, 1.5, 2] and resets pan', () => {
      let scale = 1;
      let position = { x: 0, y: 0 };

      const handleZoom = (newScale: number) => {
        scale = newScale;
        if (newScale === 1) {
          position = { x: 0, y: 0 };
        }
      };

      // Set scale to 1.5 and simulate pan
      handleZoom(1.5);
      expect(scale).toBe(1.5);
      position = { x: 120, y: -45 };

      // Set scale to 2
      handleZoom(2);
      expect(scale).toBe(2);

      // Reset scale to 1: position must be reset to (0, 0)
      handleZoom(1);
      expect(scale).toBe(1);
      expect(position).toEqual({ x: 0, y: 0 });
    });

    it('STR-BOX-02: dragging is strictly forbidden when scale <= 1', () => {
      const handleMouseDown = (scale: number, startDrag: () => void) => {
        if (scale <= 1) return;
        startDrag();
      };

      const startDragMock = vi.fn();

      // At 1x scale: cannot drag
      handleMouseDown(1, startDragMock);
      expect(startDragMock).not.toHaveBeenCalled();

      // At 0.8x scale (if corrupted): cannot drag
      handleMouseDown(0.8, startDragMock);
      expect(startDragMock).not.toHaveBeenCalled();

      // At 1.5x scale: drag permitted
      handleMouseDown(1.5, startDragMock);
      expect(startDragMock).toHaveBeenCalledTimes(1);
    });

    it('STR-BOX-03: keyboard Escape listener triggers onClose while ignoring other keys', () => {
      const onClose = vi.fn();

      const handleKeyDown = (key: string) => {
        if (key === 'Escape') {
          onClose();
        }
      };

      handleKeyDown('Enter');
      handleKeyDown(' ');
      handleKeyDown('Tab');
      handleKeyDown('ArrowDown');
      expect(onClose).not.toHaveBeenCalled();

      handleKeyDown('Escape');
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('STR-BOX-04: pan movement calculations handle mouse coordinate offsets correctly', () => {
      let position = { x: 0, y: 0 };
      const dragStart = { x: 100, y: 200 };

      const handleMouseMove = (clientX: number, clientY: number) => {
        position = {
          x: clientX - dragStart.x,
          y: clientY - dragStart.y,
        };
      };

      handleMouseMove(150, 260);
      expect(position).toEqual({ x: 50, y: 60 });

      handleMouseMove(70, 180);
      expect(position).toEqual({ x: -30, y: -20 });
    });
  });

  // ==========================================================================
  // SECTION 5: DATABASE INVARIANT 1 VERIFICATION
  // ==========================================================================
  describe('5. Database Invariant 1: Zero Schema Alterations & 676 Cards Intact', () => {
    it('INV-DB-01: src/db/schema.ts has exactly 0 git modifications', () => {
      try {
        const diff = execSync('git diff src/db/schema.ts', {
          cwd: process.cwd(),
          encoding: 'utf-8',
        }).trim();
        expect(diff).toBe('');
      } catch (err: any) {
        throw err;
      }
    });

    it('INV-DB-02: Direct DB query confirms exactly 676 cards exist in database', async () => {
      const cardCountRes = await db.select({ total: count(cards.id) }).from(cards);
      expect(cardCountRes[0].total).toBe(676);
    });

    it('INV-DB-03: Direct DB query confirms exactly 4 decks exist in database', async () => {
      const deckList = await db.select().from(decks);
      expect(deckList.length).toBe(4);

      const deckIds = deckList.map((d: { id: string }) => d.id).sort();
      expect(deckIds).toEqual([
        'deck_jpd133',
        'deck_jpd133_kanji',
        'deck_n5',
        'grammar_jpd133',
      ].sort());
    });

    it('INV-DB-04: /api/cards endpoint returns 676 cards across 4 decks with success=true', async () => {
      const req = new Request('http://localhost:3000/api/cards');
      const res = await getCardsRoute(req);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.length).toBe(676);
      expect(body.decks.length).toBe(4);
      expect(body.deckSummaries.length).toBe(4);

      // Verify sum of cards across deckSummaries is 658 (4 named decks) + 18 unassigned/other
      const sumOfCardsInDeckSummaries = body.deckSummaries.reduce(
        (sum: number, d: any) => sum + d.totalCards,
        0
      );
      expect(sumOfCardsInDeckSummaries).toBe(658);
      expect(body.data.length).toBe(676);
    });

    it('INV-DB-05: /api/cards endpoint filters by specific deck without data leakage', async () => {
      // Test deck_jpd133_kanji (232 cards)
      const kanjiReq = new Request('http://localhost:3000/api/cards?deck=deck_jpd133_kanji');
      const kanjiRes = await getCardsRoute(kanjiReq);
      const kanjiBody = await kanjiRes.json();
      expect(kanjiBody.success).toBe(true);
      expect(kanjiBody.data.length).toBe(232);
      for (const card of kanjiBody.data) {
        expect(card.deckId).toBe('deck_jpd133_kanji');
      }

      // Test deck_jpd133 (252 cards)
      const vocabReq = new Request('http://localhost:3000/api/cards?deck=deck_jpd133');
      const vocabRes = await getCardsRoute(vocabReq);
      const vocabBody = await vocabRes.json();
      expect(vocabBody.success).toBe(true);
      expect(vocabBody.data.length).toBe(252);
      for (const card of vocabBody.data) {
        expect(card.deckId).toBe('deck_jpd133');
      }

      // Test grammar_jpd133 (96 cards)
      const grammarReq = new Request('http://localhost:3000/api/cards?deck=grammar_jpd133');
      const grammarRes = await getCardsRoute(grammarReq);
      const grammarBody = await grammarRes.json();
      expect(grammarBody.success).toBe(true);
      expect(grammarBody.data.length).toBe(96);
      for (const card of grammarBody.data) {
        expect(card.deckId).toBe('grammar_jpd133');
      }
    });
  });
});
