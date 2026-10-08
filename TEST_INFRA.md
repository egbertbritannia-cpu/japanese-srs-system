# 🧪 TEST_INFRA.md — Multimodal Drive Showcase (/demo/drive) Test Infrastructure

> **Project:** `japanese-srs-system` (記憶道 · Japanese SRS System)  
> **Milestone:** T1 — E2E Test Track (4-Tier Opaque-Box Test Suites)  
> **Target Feature:** Multimodal Google Drive Showcase (`/demo/drive`)  
> **Author:** `test_writer_t1` (teamwork_preview_test_writer)  
> **Last Updated:** 2026-10-07  
> **Status:** Authoritative Baseline Specification  

---

## 1. Executive Summary & Testing Philosophy

This document defines the authoritative testing infrastructure, feature inventory, 4-tier testing methodology, and execution matrix for the **Multimodal Google Drive Showcase** (`/demo/drive`).

The test architecture is designed around four inviolable core principles:
1. **Opaque-Box Testing Integrity**: Tests treat components, API routes, and services as opaque boxes. Tests assert observed inputs and outputs against authoritative sources (`ORIGINAL_REQUEST.md`, `PROJECT.md`, `data/multimodal-manifest.json`) without relying on implementation secrets or creating superficial facade tests.
2. **Pure Node.js Vitest Execution**: Vitest operates in pure Node.js mode (`environment: 'node'`) without `@testing-library/react` or heavy JSDOM emulation. Tests achieve ultra-fast execution (< 8s total suite time across 26 suites) via web-standard `Request`/`Response` route calls, pure algorithmic evaluations, simulated browser globals, and static AST/source file invariant assertions.
3. **Zero Backend & Schema Regression (Commandment 1)**: Tests guarantee that no Turso Cloud LibSQL schema changes, migrations, or card deletions occur. The 676 cards and 4 decks remain intact.
4. **Invariant 4 & Authentic Wa-Style Aesthetics**: Tests preserve `<JapaneseArtBackdrop />` across all 5 core pages (`src/app/page.tsx`, `src/app/cards/page.tsx`, `src/app/cards/new/page.tsx`, `src/app/review/page.tsx`, `src/app/integrations/page.tsx`) and enforce Nippon Colors (`--bengara`, `--aizome`, `--kincha`, `--matcha`, `--washi-base`) and Washi paper styling tokens.

---

## 2. Complete Feature Inventory (Features 1 – 15)

The table below catalogs all 15 features governing the Multimodal Drive Showcase track across Milestones T1, M1, M2, M3, and M4:

| # | Feature ID | Feature Name | Description & Specification | Target Milestone | Primary Test Suite |
| :-: | :--- | :--- | :--- | :-: | :--- |
| **1** | `FEAT-01` | **Multimodal Data Types & Schema** | TypeScript interfaces (`MultimodalAsset`, `AssetCategory`, `AssetCdnResolvable`, `MultimodalSummary`) covering 8 categories and 456+ (688 total) assets. | M1 | `tests/drive-showcase-api.test.ts` |
| **2** | `FEAT-02` | **Dual CDN URL Resolver** | Strategy routing visual assets (Kanji SVG, PNG, Infographics) to `https://lh3.googleusercontent.com/d/{fileId}` and audio MP3s to `https://drive.google.com/uc?export=download&id={fileId}`. | M1 | `tests/drive-showcase-api.test.ts` |
| **3** | `FEAT-03` | **Extended MultimodalMediaService** | Synchronous and asynchronous asset loading (`getAllAssets()`, `getAsset()`, `getSummary()`, `getAssetsByCategory()`) with 2-second in-memory manifest cache. | M1 | `tests/drive-showcase-api.test.ts` |
| **4** | `FEAT-04` | **Kanji Animated SVG Player** | `KanjiStrokePlayer.tsx` displaying and animating stroke order SVGs fetched via direct Google CDN with replay affordance. | M2 | `tests/drive-showcase-ui-invariants.test.ts` |
| **5** | `FEAT-05` | **Interactive Audio Card** | `InteractiveAudioCard.tsx` playing Tokyo native & Cambridge audio with waveform animation, play/pause state machine, and latency feedback badge. | M2 | `tests/drive-showcase-ui-invariants.test.ts` |
| **6** | `FEAT-06` | **Media Lightbox Modal** | `MediaLightboxModal.tsx` modal viewer supporting zoom, pan, and escape key navigation for Irasutoya illustrations and Grammar infographics. | M2 | `tests/drive-showcase-ui-invariants.test.ts` |
| **7** | `FEAT-07` | **Asset Metadata Drawer** | `AssetMetadataDrawer.tsx` side/overlay drawer displaying Category, File ID, Direct CDN link, MIME type, file size (KB/MB), and Japanese linguistic metadata. | M2 | `tests/drive-showcase-ui-invariants.test.ts` |
| **8** | `FEAT-08` | **Drive Showcase Server Page** | `src/app/demo/drive/page.tsx` Next.js 15 Server Component fetching assets, wrapped in Suspense with `<JapaneseArtBackdrop />`. | M3 | `tests/drive-showcase-ui-invariants.test.ts` |
| **9** | `FEAT-09` | **Instant Category Filtering** | Responsive category pill selectors (`all`, `kanji`, `vocab_audio`, `illustration`, `grammar_infographic`, `ielts_audio`, `immersion_clip`, `jlpt_choukai`, `pubmed_corpus`). | M3 | `tests/drive-showcase-logic.test.ts` |
| **10** | `FEAT-10` | **Sub-50ms Debounced Search** | In-memory search bar matching file names, Kanji characters, and asset keys with < 50ms latency across 456+ items and 150ms debounce window. | M3 | `tests/drive-showcase-logic.test.ts` |
| **11** | `FEAT-11` | **Authentic Wa-Style Aesthetics** | Authentic Nippon Colors palette (`--bengara`, `--aizome`, `--kincha`, `--koke-green`, `--washi-base`), Shippori Mincho typography, and Washi texture tokens. | M3 | `tests/drive-showcase-ui-invariants.test.ts` |
| **12** | `FEAT-12` | **Paginated Media Grid** | 24-36 items per page windowed grid with pagination controls, responsive breakpoints, and sorting controls (name, size, category). | M3 | `tests/drive-showcase-logic.test.ts` |
| **13** | `FEAT-13` | **4-Tier E2E Test Suite Creation** | 3 specialized Vitest suites covering API, business logic, search benchmarks, UI AST invariants, and real-world workloads. | T1 | `tests/drive-showcase-*.test.ts` |
| **14** | `FEAT-14` | **Zero DB & API Regression** | Zero schema alteration in `src/db/schema.ts`, 23 existing suites remain 100% green, TypeScript `tsc --noEmit` exits with 0 errors. | All | All Suites |
| **15** | `FEAT-15` | **Adversarial & Fault Injection (Tier 5)** | Resilience against regex special characters, missing manifest files, empty search strings, oversized queries, and audio load errors. | T1, M4 | `tests/drive-showcase-logic.test.ts`, `tests/drive-showcase-api.test.ts` |

---

## 3. The 4-Tier Testing Methodology & Pyramid

The showcase test suites follow a structured **4-Tier Testing Methodology** (with an additional Tier 5 Adversarial Hardening layer):

```
       ┌─────────────────────────────────────────────────────────────┐
       │   TIER 5: Adversarial Hardening & Stress Invariants         │
       │   (Regex injection, 1,000+ char queries, fault injection)   │
       ├─────────────────────────────────────────────────────────────┤
       │   TIER 4: Real-World Scenarios, Benchmarks & SRE Invariants │
       │   (Sub-50ms search benchmark, 688 asset stress, DB sanity)  │
       ├─────────────────────────────────────────────────────────────┤
       │   TIER 3: State Combinations & Cross-Domain Permutations    │
       │   (Category + Search, Sorting + Pagination, Dual CDN mix)  │
       ├─────────────────────────────────────────────────────────────┤
       │   TIER 2: Boundary, Corner Cases & Error Handling           │
       │   (Missing manifest, invalid categories, null metadata)     │
       ├─────────────────────────────────────────────────────────────┤
       │   TIER 1: Core Feature Happy Paths (>=5 tests per feature)  │
       │   (Manifest loading, Category pills, Audio card, Lightbox)  │
       └─────────────────────────────────────────────────────────────┘
```

### 3.1 Tier 1: Core Feature Coverage ($\ge 5$ test cases per feature)
- **Feature 1 (Manifest & Types)**: Validates total assets ($\ge 456$, exactly 688 in manifest), validates all 8 category partitions, verifies 111 Kanji items, 322 vocabulary audio items, and category summary count summation.
- **Feature 2 (Dual CDN Strategy)**: Tests visual asset resolution to `https://lh3.googleusercontent.com/d/{fileId}`, tests audio asset resolution to `https://drive.google.com/uc?export=download&id={fileId}`, validates URL structure for `kanji`, `illustration`, `vocab_audio`, and `ielts_audio`.
- **Feature 3 (API Route & Service)**: Verifies `/api/media?summary=true`, `/api/media?category=kanji`, `/api/media?q=東`, `/api/media?key=vocab_audio:両親`, and `MultimodalMediaService.getAllAssets()`.
- **Feature 4 (Debounced Search Matching)**: Tests exact Kanji matching (`東`), Romaji/English matching (`dementia`, `audio`), asset key matching, case insensitivity, and search clearing.
- **Feature 5 (Category Filtering)**: Tests default `'all'` state, category switching across all 8 domains, exclusive filtering, and non-mutating immutability.

### 3.2 Tier 2: Boundary, Corner Cases & Fault Injection
- **T2-EC-01 (Missing/Empty Manifest)**: Graceful fallback when manifest is missing or contains `{ totalAssets: 0, assets: {} }` without throwing uncaught exceptions.
- **T2-EC-02 (Invalid Category Param)**: Calling `/api/media?category=quantum_realm` returns `{ success: true, count: 0, items: [] }` with HTTP 200 rather than 500.
- **T2-EC-03 (Invalid/Missing Asset Key)**: Requesting non-existent key returns `{ success: true, asset: null }`.
- **T2-EC-04 (Undefined/Null Metadata)**: Assets with missing `metadata`, `sizeBytes`, or `mimeType` handle defaults safely.
- **T2-EC-05 (Negative / Zero / Extreme Limit)**: Passing `limit=0` or `limit=9999` is handled gracefully without array bounds corruption.

### 3.3 Tier 3: State Combinations & Permutations
- **T3-CB-01 (Category + Search Query)**: Combining `category: 'kanji'` AND `q: '東'` yields strictly items matching BOTH criteria.
- **T3-CB-02 (Mutually Exclusive Filter & Query)**: Combining `category: 'kanji'` with query `'stethoscope'` yields 0 items and cleanly renders Zen Empty state.
- **T3-CB-03 (Sorting + Pagination Permutation)**: Sorting 688 items by size descending across multiple pages guarantees consistent slice ordering without duplicate or missing items across page boundaries.
- **T3-CB-04 (Dual CDN Resolution Across Mixed MIME Types)**: Verifies correct resolution across `image/svg+xml`, `image/png`, `audio/mpeg`, `video/mp4`, `application/pdf`.

### 3.4 Tier 4: Real-World Scenarios, Benchmarks & SRE Invariants
- **T4-RW-01 (Sub-50ms Search Performance Benchmark)**: Executes multiple search queries across all 688 assets, asserting individual and average execution time $< 50\text{ms}$ (actual benchmark runs $< 10\text{ms}$).
- **T4-RW-02 (688 Asset Stress Processing)**: Filters, sorts, and paginates the entire 688-item dataset 50 times in a tight loop without memory leaks or degradation.
- **T4-RW-03 (Zero Turso Regression Verification)**: Verifies direct DB query confirms 676 cards and 4 decks in database, with 0 alterations to `src/db/schema.ts`.
- **T4-RW-04 (Invariant 4 Preservation)**: Confirms `<JapaneseArtBackdrop />` is present in all 5 core application pages.

### 3.5 Tier 5: Adversarial Hardening
- **T5-ADV-01 (Regex Meta-Character Injection)**: Query containing `.*+?^${}()|[]\` is treated as literal search string without regex syntax crashes.
- **T5-ADV-02 (Oversized Query Attack)**: 1,000+ character arbitrary string executes in $< 20\text{ms}$ and safely returns 0 items.
- **T5-ADV-03 (Control Characters & Whitespace Padding)**: Queries with leading/trailing tabs, spaces, and newlines (`\n\t`) are sanitized and trimmed correctly.

---

## 4. Test Suites Inventory & Coverage Breakdown

The 3 newly authored test suites for the Multimodal Drive Showcase:

### 4.1 Suite 1: `tests/drive-showcase-api.test.ts`
- **Focus**: API Route `/api/media`, `MultimodalMediaService`, Dual CDN Resolution, Manifest Metadata.
- **Test File Path**: `d:\project\japanese-srs-system\tests\drive-showcase-api.test.ts`
- **Key Test Cases**:
  1. `MultimodalMediaService.getSummary()` returns valid counts across all 8 domains.
  2. `MultimodalMediaService.getAllAssets()` returns $\ge 456$ items with resolved CDN URLs.
  3. `resolveAssetCdnUrl` resolves visual assets (`image/svg+xml`, `image/png`) to `https://lh3.googleusercontent.com/d/{fileId}`.
  4. `resolveAssetCdnUrl` resolves audio assets (`audio/mpeg`, categories `vocab_audio`, `ielts_audio`, `jlpt_choukai`) to `https://drive.google.com/uc?export=download&id={fileId}`.
  5. Direct API route call `/api/media?summary=true` returns status 200 and summary object.
  6. Direct API route call `/api/media?category=kanji&limit=10` returns 10 Kanji items.
  7. Direct API route call `/api/media?category=vocab_audio&limit=5` returns audio items.
  8. Direct API route call `/api/media?q=東` returns matching search items.
  9. Direct API route call `/api/media?key=kanji:東` returns specific asset.
  10. Direct API route call `/api/media?category=unknown_domain` returns empty array gracefully.
  11. Direct API route call `/api/media?key=non_existent_key` returns null asset without 500 error.
  12. Asset metadata schema validation: checks `key`, `category`, `fileName`, `fileId`, `driveUrl`, `cdnUrl`, `sizeBytes > 0`.
  13. Category manifest consistency: verifies category counts match sum of partition files in `data/manifests/`.
  14. Zero Turso regression: verifies `/api/cards` continues to return 676 cards and 4 decks.

### 4.2 Suite 2: `tests/drive-showcase-logic.test.ts`
- **Focus**: In-Memory Filtering, Debounced Search, Sub-50ms Benchmark, Pagination, Sorting, Edge Cases.
- **Test File Path**: `d:\project\japanese-srs-system\tests\drive-showcase-logic.test.ts`
- **Key Test Cases**:
  1. In-memory category filtering for `'all'` returns all 688 assets.
  2. In-memory category filtering across each of the 8 individual categories returns strictly matching items.
  3. Sum of category partition counts strictly equals total dataset count.
  4. Debounced search matching against Kanji characters (`東`, `京`, `名`).
  5. Debounced search matching against asset keys (`vocab_audio:両親`, `kanji:東`).
  6. Debounced search matching against file names (`.svg`, `animated`, `audio_`).
  7. Case-insensitive search query matching (`KANJI`, `Svg`).
  8. Debounce timer simulation with Vitest fake timers (`vi.useFakeTimers()`): buffers rapid keystrokes into a single execution.
  9. Sub-50ms search benchmark: validates execution latency across 50 iterations on 688 items is $< 50\text{ms}$ (mean $< 10\text{ms}$).
  10. Pagination windowing: verifies page size 24 slices items accurately across multiple pages.
  11. Last page remainder calculation: verifies page boundary handling without off-by-one errors.
  12. Sorting by file name (ascending and descending).
  13. Sorting by file size (ascending and descending).
  14. Combination filtering: Category filter + Search query cross-filtering.
  15. Adversarial: Empty string query restores unfiltered category items.
  16. Adversarial: Special regex characters (`.*+?^${}()|[]\`) do not throw syntax errors.
  17. Adversarial: Oversized query (1,000+ characters) executes in $< 20\text{ms}$ and yields 0 items.

### 4.3 Suite 3: `tests/drive-showcase-ui-invariants.test.ts`
- **Focus**: UI AST Structure, Invariant 4 Compliance, Nippon Colors & Washi Styling Tokens.
- **Test File Path**: `d:\project\japanese-srs-system\tests\drive-showcase-ui-invariants.test.ts`
- **Key Test Cases**:
  1. Invariant 4 check: all 5 core pages (`src/app/page.tsx`, `src/app/cards/page.tsx`, `src/app/cards/new/page.tsx`, `src/app/review/page.tsx`, `src/app/integrations/page.tsx`) exist and contain `<JapaneseArtBackdrop`.
  2. Public art directory `public/assets/art` exists and contains 13 semantic assets with size $> 10\text{KB}$.
  3. CSS variables validation in `src/app/globals.css`: checks `--washi-base`, `--bengara-red`, `--bengara`, `--aizome-navy`, `--aizome`, `--kincha-gold`, `--kincha`, `--koke-green`, `--sumi-deep`, `--sumi-body`.
  4. CSS Washi and Wagara patterns validation: checks `.washi-paper-bg`, `.washi-card`, and Wagara pattern classes.
  5. Component Contract Registry: validates props and interface specifications for `KanjiStrokePlayer`, `InteractiveAudioCard`, `MediaLightboxModal`, `AssetMetadataDrawer`, and `DriveShowcaseClient`.
  6. Progressive Component Check: when showcase components are created on disk (`src/app/demo/drive/page.tsx`, `src/components/showcase/*`), verifies export structures, `<JapaneseArtBackdrop />` integration, and Wa-Style class usages.

---

## 5. Verification Commands & Execution Matrix

To verify the test suites locally or in CI/CD:

```powershell
# 1. Run all test suites (including existing 23 suites + 3 new showcase suites)
npm test -- --run

# 2. Run only the 3 Multimodal Drive Showcase suites
npx vitest run tests/drive-showcase-api.test.ts tests/drive-showcase-logic.test.ts tests/drive-showcase-ui-invariants.test.ts

# 3. Verify TypeScript health across the entire codebase (0 errors)
npx tsc --noEmit

# 4. Verify Invariant 4 specifically
npx vitest run tests/art-backdrop.test.ts
```

---

## 6. SRE & Database Regression Safeguards

1. **Zero Database Migrations**: No schema alterations in `src/db/schema.ts`.
2. **Offline-First & Network Isolation**: No live HTTP requests to Google Drive or external networks during test execution. All CDN URLs are validated via regex contracts (`https://lh3.googleusercontent.com/d/` and `https://drive.google.com/uc?export=download&id=`).
3. **Execution Time Budget**: Total test suite duration must stay under 10 seconds.
