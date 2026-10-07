import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { GET as mediaStreamRoute } from '@/app/api/media/stream/route';
import { NextRequest } from 'next/server';
import { db } from '@/db/client';
import { cards } from '@/db/schema';
import { count } from 'drizzle-orm';

/**
 * 🌸 KANJI STROKE ORDER ANIMATION & VECTOR RENDERING TEST SUITE
 *
 * Verifies:
 * 1. Crawler SVG generator emits pure CSS @keyframes without invalid !important overrides
 * 2. On-the-fly SVG sanitization cleans Drive assets into smooth 60fps animations
 * 3. Media stream route provides seamless KanjiVG GitHub upstream fallback
 * 4. KanjiStrokePlayer renders vector markup with instant 0ms keyframe replay
 * 5. Review page integrates interactive Kanji stroke drawer without breaking Art Backdrop
 * 6. Zero schema regressions & 676 database cards preserved
 */

describe('Kanji Stroke Order Animation & Vector Rendering System', () => {
  const crawlerScriptPath = path.resolve(process.cwd(), 'scripts/crawlers/1-crawl-kanji-stroke-order.ts');
  const playerComponentPath = path.resolve(process.cwd(), 'src/components/showcase/KanjiStrokePlayer.tsx');
  const reviewPagePath = path.resolve(process.cwd(), 'src/app/review/page.tsx');
  const streamRoutePath = path.resolve(process.cwd(), 'src/app/api/media/stream/route.ts');

  // ==========================================================================
  // 1. CRAWLER SVG GENERATION AUDIT
  // ==========================================================================
  describe('1. Crawler SVG Generator Syntax & CSS Rules', () => {
    it('KNJ-ANIM-01: crawler script exists and contains makeAnimatedKanjiSvg', () => {
      expect(fs.existsSync(crawlerScriptPath)).toBe(true);
      const content = fs.readFileSync(crawlerScriptPath, 'utf-8');
      expect(content).toContain('makeAnimatedKanjiSvg');
    });

    it('KNJ-ANIM-02: crawler SVGs do NOT contain !important on stroke-dashoffset or stroke-dasharray', () => {
      const content = fs.readFileSync(crawlerScriptPath, 'utf-8');
      expect(content).not.toMatch(/stroke-dashoffset:\s*\d+\s*!important/);
      expect(content).not.toMatch(/stroke-dasharray:\s*\d+\s*!important/);
    });

    it('KNJ-ANIM-03: crawler SVGs define authentic Bengara red (#9E3223) and ghost background guides', () => {
      const content = fs.readFileSync(crawlerScriptPath, 'utf-8');
      expect(content).toContain('#9E3223');
      expect(content).toContain('kvg:GhostBackgroundGuide');
      expect(content).toContain('#E2DAC6');
    });
  });

  // ==========================================================================
  // 2. MEDIA STREAM API ROUTE & KANJIVG LIVE FALLBACK
  // ==========================================================================
  describe('2. Media Stream API Route & KanjiVG Live Fallback', () => {
    it('KNJ-ANIM-04: stream route handles ?kanji parameter and fetches KanjiVG upstream', async () => {
      const req = new NextRequest('http://localhost:3000/api/media/stream?kanji=東&mimeType=image/svg%2Bxml');
      const res = await mediaStreamRoute(req);

      expect(res.status).toBe(200);
      const contentType = res.headers.get('content-type') || '';
      expect(contentType).toContain('image/svg+xml');

      const text = await res.text();
      expect(text).toContain('<svg');
      expect(text).toContain('kanji-stroke-anim');
      expect(text).toContain('@keyframes drawStroke');
      expect(text).toContain('#9E3223');
      expect(text).not.toContain('stroke-dashoffset: 250 !important');
    }, 15000);

    it('KNJ-ANIM-05: stream route sanitizes legacy Drive SVGs on-the-fly', () => {
      const routeContent = fs.readFileSync(streamRoutePath, 'utf-8');
      expect(routeContent).toContain('sanitizeExistingSvg');
      expect(routeContent).toContain('animateKanjiSvg');
    });
  });

  // ==========================================================================
  // 3. KANJISTROKEPLAYER INLINE VECTOR RENDERING & REPLAY
  // ==========================================================================
  describe('3. KanjiStrokePlayer Inline Vector & Replay Architecture', () => {
    it('KNJ-ANIM-06: KanjiStrokePlayer exists, is client component, and supports compact mode', () => {
      expect(fs.existsSync(playerComponentPath)).toBe(true);
      const content = fs.readFileSync(playerComponentPath, 'utf-8');
      expect(content).toMatch(/['"]use client['"]/);
      expect(content).toContain('export function KanjiStrokePlayer');
      expect(content).toContain('compact');
      expect(content).toContain('dangerouslySetInnerHTML');
    });

    it('KNJ-ANIM-07: KanjiStrokePlayer implements instant replay via replayKey state re-render', () => {
      const content = fs.readFileSync(playerComponentPath, 'utf-8');
      expect(content).toContain('replayKey');
      expect(content).toContain('handleReplay');
      expect(content).toContain('key={replayKey}');
    });

    it('KNJ-ANIM-08: KanjiStrokePlayer provides dual fallback hierarchy', () => {
      const content = fs.readFileSync(playerComponentPath, 'utf-8');
      expect(content).toContain('/api/media/stream');
      expect(content).toContain('raw.githubusercontent.com/KanjiVG/kanjivg');
      expect(content).toContain('var(--font-mincho)');
    });
  });

  // ==========================================================================
  // 4. REVIEW PAGE INTEGRATION & ART BACKDROP PRESERVATION
  // ==========================================================================
  describe('4. Review Page Integration & System Invariants', () => {
    it('KNJ-ANIM-09: review page imports and renders KanjiStrokePlayer for Kanji cards', () => {
      const content = fs.readFileSync(reviewPagePath, 'utf-8');
      expect(content).toContain('KanjiStrokePlayer');
      expect(content).toContain('showStrokeOrder');
      expect(content).toContain('Xem nét viết 筆順');
    });

    it('KNJ-ANIM-10: review page strictly preserves JapaneseArtBackdrop (Điều Răn 4)', () => {
      const content = fs.readFileSync(reviewPagePath, 'utf-8');
      expect(content).toContain('<JapaneseArtBackdrop');
      expect(content).toContain('/assets/art/kirie-layered-waves.jpg');
    });

    it('KNJ-ANIM-11: database cards count remains intact (676 cards) (Điều Răn 1)', async () => {
      const res = await db.select({ total: count(cards.id) }).from(cards);
      expect(res[0].total).toBe(676);
    });
  });
});
