# Project: Multimodal Drive Assets Showcase (/demo/drive)

## Architecture
- **Framework**: Next.js 15 App Router (React 19)
- **Styling**: Pure CSS Custom Properties in `globals.css` with Nippon Colors (`--bengara`, `--aizome`, `--kincha`, `--matcha`, `--washi-base`), Wagara patterns (`.wagara-seigaiha-matcha`, `.wagara-yagasuri`), Washi texture (`.washi-paper-bg`). No Tailwind CSS.
- **Data Layer**: Manifest-driven (`data/multimodal-manifest.json` and `data/manifests/*.json`, 456–824 assets across 8 categories). `MultimodalMediaService` with server-side caching.
- **CDN Resolution**: Dual CDN Strategy:
  - Images & Kanji SVGs: `https://lh3.googleusercontent.com/d/{fileId}`
  - Audio MP3s: `https://drive.google.com/uc?export=download&id={fileId}`
- **Page Layout**:
  - `src/app/demo/drive/page.tsx` (Server Component, fetches all assets via `MultimodalMediaService`, wrapped with Suspense & JapaneseArtBackdrop)
  - `src/components/showcase/DriveShowcaseClient.tsx` (Client Component for in-memory search, category pills, paginated grid, metadata drawer)
  - Interactive Subcomponents:
    - `KanjiStrokePlayer.tsx`: SVG stroke drawing replay animation
    - `InteractiveAudioCard.tsx`: Web Audio / HTML5 audio with waveform and latency metrics
    - `MediaLightboxModal.tsx`: High-resolution zoom/pan modal
    - `AssetMetadataDrawer.tsx`: Detailed inspector for CDN, MIME, size, category
- **Testing**: Pure Node Vitest with mock globals, deterministic API route calls, and static AST/file checks. 27 suites (215 tests) passing 100% green; `npx tsc --noEmit` 0 errors; `npm run build` static generation clean.

## Code Layout
```
data/
  multimodal-manifest.json
  manifests/
src/
  app/
    demo/
      drive/
        page.tsx                 # [M2: DONE] Server entry point
    globals.css                  # Existing CSS tokens
  components/
    showcase/
      DriveShowcaseClient.tsx    # [M2: DONE] Client interactive showcase
      KanjiStrokePlayer.tsx      # [M2: DONE] Kanji animated stroke viewer
      InteractiveAudioCard.tsx   # [M2: DONE] Audio player with waveform & latency
      MediaLightboxModal.tsx     # [M2: DONE] Zoomable lightbox
      AssetMetadataDrawer.tsx    # [M2: DONE] Metadata inspector
    art/
      JapaneseArtBackdrop.tsx    # Invariant 4 backdrop
  services/
    multimodal/
      media.service.ts           # [M1: DONE] Extended media service & dual CDN resolver
      types.ts                   # [M1: DONE] Multimodal asset types
tests/
  drive-showcase-api.test.ts     # [T1: DONE] Tier 1 & 2 API & CDN resolution tests
  drive-showcase-logic.test.ts   # [T1: DONE] Tier 1-3 In-memory filtering & search benchmark
  drive-showcase-ui-invariants.test.ts # [T1: DONE] Tier 1-4 UI AST, Wa-Style tokens & Invariant 4
  challenger-media-stream-invariants.test.ts # [M3: DONE] Adversarial edge cases & DB invariants
```

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Manifest Data Model & Types | Type definitions for 8 categories and 456+ items | M1 [DONE] | Survey 1 |
| 2 | Dual CDN URL Resolver | Dual URL resolver (`lh3` for images/SVG, `drive.google.com/uc` for audio) | M1 [DONE] | Survey 1 |
| 3 | Extended Media Service | Server-side `getAllAssets()` in `MultimodalMediaService` | M1 [DONE] | Survey 1 |
| 4 | Kanji Animated SVG Player | Stroke order animation viewer with replay | M2 [DONE] | Survey 2 |
| 5 | Interactive Audio Card | Audio player with animated waveform & latency indicator | M2 [DONE] | Survey 2 |
| 6 | Media Lightbox Modal | Zoomable modal for Irasutoya PNGs and Infographic SVGs | M2 [DONE] | Survey 2 |
| 7 | Asset Metadata Drawer | Inspector displaying Category, File ID, Direct CDN link, MIME, Size | M2 [DONE] | Survey 2 |
| 8 | Drive Showcase Page | `/demo/drive` Next.js 15 Server Component with Suspense & Backdrop | M2 [DONE] | Survey 2 |
| 9 | Instant Category Filtering | Responsive pills for 8 categories with sub-50ms instant response | M2 [DONE] | Survey 2 |
| 10 | Sub-50ms Debounced Search | In-memory search by name, Kanji, and key with <50ms response | M2 [DONE] | Survey 2 |
| 11 | Authentic Wa-Style Aesthetics | Pure Nippon Colors, Washi paper textures, Wagara patterns | M2 [DONE] | Survey 2 |
| 12 | Responsive Media Grid | 24-36 items paginated windowed grid with lazy loading | M2 [DONE] | Survey 2 |
| 13 | E2E Testing Suite (Tiers 1-4) | 3 Vitest suites covering API, logic, UI invariants, and real workloads | T1 [DONE] | Survey 3 |
| 14 | Zero DB & API Regression | Invariant checks: schema.ts untouched, 27 suites pass, tsc 0 errors | All [PASS] | Survey 1,3 |
| 15 | Adversarial Hardening (Tier 5) | Edge cases, malformed queries, network error fallbacks | M3 [DONE] | Challenger, Auditor |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| T1 | E2E Test Suite Creation | Create `TEST_INFRA.md` & 3 test suites (`tests/drive-showcase-*.test.ts`) | None | DONE |
| M1 | Multimodal Data & Dual CDN Service | `src/services/multimodal/types.ts`, `media.service.ts` enhancements | None | DONE |
| M2 | Wa-Style Showcase UI Components & Page | `KanjiStrokePlayer`, `InteractiveAudioCard`, `MediaLightboxModal`, `AssetMetadataDrawer`, `DriveShowcaseClient`, `/demo/drive/page.tsx` | M1 | DONE |
| M3 | Final Milestone: E2E Verification & Adversarial Hardening | Pass 100% E2E tests (Tiers 1-4) + Adversarial Hardening (Tier 5) + Forensic Audit | T1, M1, M2 | DONE |

## Gate Result: PASS
All acceptance criteria verified and passed:
- `npm test -- --run`: 27/27 test suites, 215/215 tests passed green.
- `npx tsc --noEmit`: 0 errors.
- `npm run build`: 43/43 pages compiled cleanly including `/demo/drive`.
- Commandment 1 (Zero DB Regression): `src/db/schema.ts` 0 diff, 676 cards and 4 decks intact.
- Invariant 4 (`JapaneseArtBackdrop`): Verified in 5 core pages + `/demo/drive`.
- Forensic Audit: Verdict CLEAN.
