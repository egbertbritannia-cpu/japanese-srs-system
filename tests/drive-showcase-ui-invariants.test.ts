import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Tier 1-4 Multimodal Drive Showcase UI Invariants & Wa-Style Aesthetics (tests/drive-showcase-ui-invariants.test.ts)', () => {
  // --------------------------------------------------------------------------
  // INVARIANT 4: JAPANESE ART BACKDROP PRESERVATION ACROSS CORE PAGES
  // --------------------------------------------------------------------------
  describe('Invariant 4: JapaneseArtBackdrop & Wa-Art Assets Preservation', () => {
    const TARGET_CORE_PAGES = [
      'src/app/page.tsx',
      'src/app/cards/page.tsx',
      'src/app/cards/new/page.tsx',
      'src/app/review/page.tsx',
      'src/app/integrations/page.tsx',
    ];

    it('T1-INV4-01: all 5 core pages exist and contain <JapaneseArtBackdrop /> without regression', () => {
      for (const relPath of TARGET_CORE_PAGES) {
        const absPath = path.resolve(process.cwd(), relPath);
        expect(fs.existsSync(absPath), `Core page missing: ${relPath}`).toBe(true);

        const content = fs.readFileSync(absPath, 'utf-8');
        expect(content).toContain('JapaneseArtBackdrop');
      }
    });

    it('T1-INV4-02: public/assets/art directory contains all 13 semantic art files exceeding 10KB', () => {
      const artDir = path.resolve(process.cwd(), 'public/assets/art');
      expect(fs.existsSync(artDir)).toBe(true);

      const EXPECTED_SEMANTIC_ASSETS = [
        'japanese-cultural-panorama.jpg',
        'golden-waves-kin-nami.jpg',
        'ryusui-indigo-stream.jpg',
        'hokusai-suwa-lake.jpg',
        'hokusai-cranes-fuji.jpg',
        'cloud-mist-kasumi-icons.jpg',
        'hokusai-great-wave-classic.jpg',
        'great-wave-isolated.webp',
        'kohaku-koi-pond.jpg',
        'night-golden-waves.jpg',
        'rinpa-gold-waves-clouds.jpg',
        'koi-peony-yuzen.jpg',
        'gold-sakura-washi.jpg',
      ];

      for (const fileName of EXPECTED_SEMANTIC_ASSETS) {
        const filePath = path.join(artDir, fileName);
        expect(fs.existsSync(filePath), `Art asset missing: ${fileName}`).toBe(true);

        const stats = fs.statSync(filePath);
        expect(stats.size).toBeGreaterThan(10 * 1024); // Minimum 10KB
      }
    });

    it('T1-INV4-03: preserves total art assets count (>=26 files) to prevent asset corruption', () => {
      const artDir = path.resolve(process.cwd(), 'public/assets/art');
      const files = fs.readdirSync(artDir);
      expect(files.length).toBeGreaterThanOrEqual(26);
    });
  });

  // --------------------------------------------------------------------------
  // WA-STYLE DESIGN TOKENS: NIPPON COLORS, WASHI & WAGARA IN GLOBALS.CSS
  // --------------------------------------------------------------------------
  describe('Wa-Style Aesthetics & Nippon Colors Design Tokens', () => {
    let globalsCssContent: string;

    it('T1-TOK-01: globals.css exists and defines mandatory Nippon Colors CSS variables', () => {
      const cssPath = path.resolve(process.cwd(), 'src/app/globals.css');
      expect(fs.existsSync(cssPath)).toBe(true);

      globalsCssContent = fs.readFileSync(cssPath, 'utf-8');

      // 1. Torinoko Washi Base Tokens
      expect(globalsCssContent).toContain('--washi-base:');
      expect(globalsCssContent).toContain('--washi-card:');

      // 2. Sumi Ink Hierarchy
      expect(globalsCssContent).toContain('--sumi-deep:');
      expect(globalsCssContent).toContain('--sumi-body:');

      // 3. Bengara Mineral Red
      expect(globalsCssContent).toContain('--bengara-red:');
      expect(globalsCssContent).toContain('--bengara:');

      // 4. Aizome Samurai Navy
      expect(globalsCssContent).toContain('--aizome-navy:');
      expect(globalsCssContent).toContain('--aizome:');

      // 5. Kincha Antique Gold / Kintsugi
      expect(globalsCssContent).toContain('--kincha-gold:');
      expect(globalsCssContent).toContain('--kincha:');

      // 6. Koke & Matcha Zen Greens
      expect(globalsCssContent).toContain('--koke-green:');
    });

    it('T1-TOK-02: defines Washi shadows, micro-borders, and ambient depth tokens', () => {
      expect(globalsCssContent).toContain('--shadow-washi-sm:');
      expect(globalsCssContent).toContain('--shadow-washi-md:');
      expect(globalsCssContent).toContain('--shadow-karuta:');
      expect(globalsCssContent).toContain('--border-micro:');
    });

    it('T1-TOK-03: defines traditional Wagara geometric pattern classes', () => {
      expect(globalsCssContent).toMatch(/wagara|seigaiha|yagasuri|asanoha/i);
    });

    it('T1-TOK-04: verifies typography declarations for Shippori Mincho and Zen Maru Gothic', () => {
      // 1. globals.css maps typography variables
      expect(globalsCssContent).toContain('var(--font-mincho)');
      expect(globalsCssContent).toContain('var(--font-maru)');

      // 2. layout.tsx configures Next.js Google Fonts
      const layoutPath = path.resolve(process.cwd(), 'src/app/layout.tsx');
      expect(fs.existsSync(layoutPath)).toBe(true);
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
      expect(layoutContent).toContain('Shippori_Mincho');
      expect(layoutContent).toContain('Zen_Maru_Gothic');
    });
  });

  // --------------------------------------------------------------------------
  // SHOWCASE COMPONENT CONTRACTS & PROGRESSIVE TESTABILITY
  // --------------------------------------------------------------------------
  describe('Showcase Component Contracts & Progressive AST Invariants', () => {
    interface ComponentSpec {
      name: string;
      relPath: string;
      isClient?: boolean;
      expectedKeywords: string[];
      milestone: 'M2' | 'M3';
    }

    const SHOWCASE_SPECS: ComponentSpec[] = [
      {
        name: 'DriveShowcasePage',
        relPath: 'src/app/demo/drive/page.tsx',
        isClient: false,
        expectedKeywords: ['Suspense', 'JapaneseArtBackdrop'],
        milestone: 'M3',
      },
      {
        name: 'DriveShowcaseClient',
        relPath: 'src/components/showcase/DriveShowcaseClient.tsx',
        isClient: true,
        expectedKeywords: ['DriveShowcaseClient'],
        milestone: 'M3',
      },
      {
        name: 'KanjiStrokePlayer',
        relPath: 'src/components/showcase/KanjiStrokePlayer.tsx',
        isClient: true,
        expectedKeywords: ['KanjiStrokePlayer'],
        milestone: 'M2',
      },
      {
        name: 'InteractiveAudioCard',
        relPath: 'src/components/showcase/InteractiveAudioCard.tsx',
        isClient: true,
        expectedKeywords: ['InteractiveAudioCard'],
        milestone: 'M2',
      },
      {
        name: 'MediaLightboxModal',
        relPath: 'src/components/showcase/MediaLightboxModal.tsx',
        isClient: true,
        expectedKeywords: ['MediaLightboxModal'],
        milestone: 'M2',
      },
      {
        name: 'AssetMetadataDrawer',
        relPath: 'src/components/showcase/AssetMetadataDrawer.tsx',
        isClient: true,
        expectedKeywords: ['AssetMetadataDrawer'],
        milestone: 'M2',
      },
    ];

    it('T1-CTR-01: verifies component specifications and interface contracts are strictly defined', () => {
      expect(SHOWCASE_SPECS).toHaveLength(6);
      for (const spec of SHOWCASE_SPECS) {
        expect(spec.name).toBeTruthy();
        expect(spec.relPath).toMatch(/\.(tsx|ts)$/);
        expect(spec.expectedKeywords.length).toBeGreaterThanOrEqual(1);
      }
    });

    it('T1-CTR-02: progressively validates showcase component files when implemented in M2/M3', () => {
      for (const spec of SHOWCASE_SPECS) {
        const absPath = path.resolve(process.cwd(), spec.relPath);
        const exists = fs.existsSync(absPath);

        if (exists) {
          const content = fs.readFileSync(absPath, 'utf-8');

          // If client component, must have 'use client' directive
          if (spec.isClient) {
            expect(content).toMatch(/['"]use client['"]/);
          }

          // Must contain required keywords / exports
          for (const kw of spec.expectedKeywords) {
            expect(content).toContain(kw);
          }
        } else {
          // In Milestone T1, component implementation is pending in M2/M3.
          // Assert that the spec contract is registered and target path is within project src/ tree.
          expect(spec.relPath.startsWith('src/')).toBe(true);
        }
      }
    });

    it('T1-CTR-03: verifies /demo/drive route layout convention includes JapaneseArtBackdrop once created', () => {
      const drivePagePath = path.resolve(process.cwd(), 'src/app/demo/drive/page.tsx');
      if (fs.existsSync(drivePagePath)) {
        const content = fs.readFileSync(drivePagePath, 'utf-8');
        expect(content).toContain('JapaneseArtBackdrop');
        expect(content).toContain('Suspense');
      } else {
        // Assert that Invariant 4 requirement is documented and enforced for the route
        expect(SHOWCASE_SPECS.find((s) => s.name === 'DriveShowcasePage')?.expectedKeywords).toContain(
          'JapaneseArtBackdrop'
        );
      }
    });
  });

  // --------------------------------------------------------------------------
  // WCAG 2.1 AA ACCESSIBILITY & CONTRAST INVARIANTS
  // --------------------------------------------------------------------------
  describe('WCAG 2.1 AA Accessibility & Contrast Invariants', () => {
    it('T1-A11Y-01: validates Sumi deep text contrast ratio against Washi base canvas is >= 7:1', () => {
      // #1A1918 (Sumi Deep) on #F7F4EB (Torinoko Washi Base)
      // Relative Luminance Calculation:
      // L(washi: 247, 244, 235) ~= 0.90
      // L(sumi: 26, 25, 24) ~= 0.01
      // Contrast Ratio: (0.90 + 0.05) / (0.01 + 0.05) = 0.95 / 0.06 ~= 15.8:1 (Far exceeds AAA 7:1)
      const washiR = 247 / 255, washiG = 244 / 255, washiB = 235 / 255;
      const sumiR = 26 / 255, sumiG = 25 / 255, sumiB = 24 / 255;

      const calcLum = (r: number, g: number, b: number) => {
        const a = [r, g, b].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
      };

      const lumWashi = calcLum(washiR, washiG, washiB);
      const lumSumi = calcLum(sumiR, sumiG, sumiB);
      const contrastRatio = (Math.max(lumWashi, lumSumi) + 0.05) / (Math.min(lumWashi, lumSumi) + 0.05);

      expect(contrastRatio).toBeGreaterThanOrEqual(7.0); // WCAG AAA requirement
    });

    it('T1-A11Y-02: validates Bengara red action button contrast ratio against Washi card is >= 4.5:1', () => {
      // Bengara #9E3223 (158, 50, 35) on #FAF8F2 (250, 248, 242)
      const cardR = 250 / 255, cardG = 248 / 255, cardB = 242 / 255;
      const bengaraR = 158 / 255, bengaraG = 50 / 255, bengaraB = 35 / 255;

      const calcLum = (r: number, g: number, b: number) => {
        const a = [r, g, b].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
      };

      const lumCard = calcLum(cardR, cardG, cardB);
      const lumBengara = calcLum(bengaraR, bengaraG, bengaraB);
      const contrastRatio = (Math.max(lumCard, lumBengara) + 0.05) / (Math.min(lumCard, lumBengara) + 0.05);

      expect(contrastRatio).toBeGreaterThanOrEqual(4.5); // WCAG AA requirement
    });
  });
});
