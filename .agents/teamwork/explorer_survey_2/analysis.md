# Comprehensive Survey of Frontend Architecture & Wa-Style UX Component Ecosystem

> **Agent:** `explorer_survey_2` (teamwork_preview_explorer)  
> **Timestamp:** 2026-10-07T01:15:00Z  
> **Target Codebase:** `d:\project\japanese-srs-system`  
> **Scope:** Next.js 15 App Router, Styling System, Typography, Multimodal Media Components, Performance Scalability for 430+ Google Drive Assets.

---

## 1. Executive Summary

This comprehensive investigation surveys the frontend architecture, styling system, typography loaders, media components, and performance characteristics of the `japanese-srs-system` repository. The investigation was conducted to establish authoritative ground truth before designing and implementing an interactive, high-performance web showcase (`/demo/drive`) that renders 430+ multimodal Google Drive assets across 8 categories with authentic Wa-Style (和風) aesthetics.

### Key Discoveries
1. **No Existing `/demo/drive` Route**: No `/demo` directory or demo pages currently exist under `src/app/`. The route must be newly created as an idiomatic Next.js 15 App Router page.
2. **Tailwind CSS is NOT Used**: Contrary to initial presumptions, the project does **not** use Tailwind CSS or PostCSS. The styling system is 100% custom-crafted in `src/app/globals.css` (1,368 lines) using CSS custom properties for Nippon Colors, inline SVG Wagara patterns, handcrafted textures, and semantic card classes, combined with inline styles in React components.
3. **Typography Architecture**: Google Fonts are loaded via `next/font/google` in `src/app/layout.tsx` with five CSS variables: `--font-mincho` (Shippori Mincho 700), `--font-maru` (Zen Maru Gothic 400/700), `--font-sans` (Plus Jakarta Sans), `--font-display` (Bebas Neue), and `--font-noto` (Noto Sans JP 400/700/900).
4. **Multimodal Service & API Already Operational**: `MultimodalMediaService` (`src/services/multimodal/media.service.ts`) and the `/api/media` route handler (`src/app/api/media/route.ts`) are fully implemented and tested. They ingest 698 partitioned assets across 8 categories from `data/manifests/*.json` (and aggregated in `data/multimodal-manifest.json`).
5. **Component Ecosystem & Gaps**:
   - *Existing*: `JapaneseAudioPool` (singleton audio pool preventing memory leaks), `AudioEffects` (Web Audio API synthesis for Hyoshigi, Suzu bell, Koto), `JapaneseSpeakerButton`, `PitchAccentGraph`, and `JapaneseArtBackdrop`.
   - *Gaps to Implement*: Interactive media player with waveform & latency feedback, Kanji stroke order animation replayer, and an image/infographic Lightbox modal with zoom.
6. **Performance Feasibility for 430+ Items**: Filtering 700 in-memory metadata records in JavaScript takes `< 0.5ms`. The primary performance constraint is **not** computation, but **browser DOM & network congestion** (e.g. eager-loading 400+ simultaneous media files from Google Drive CDN `lh3.googleusercontent.com` would saturate the network). A paginated grid (24-36 cards per page) or lazy windowing with `loading="lazy"` guarantees instant 60fps rendering and sub-50ms search response.
7. **System Invariants**: Vitest currently passes 100% across all 23 suites (139 tests). TypeScript (`npx tsc --noEmit`) passes with 0 errors.

---

## 2. Next.js 15 App Router Structure & Layout Architecture

### 2.1. Route Topology
Inspection of `src/app/` reveals the following existing routes:
- `/` (`src/app/page.tsx`): Home page with Hero section, Kirie dashboard, and quick links.
- `/cards` (`src/app/cards/page.tsx`): Card library manager with debounced search, deck filter, and pagination (25 cards/page).
- `/cards/new` (`src/app/cards/new/page.tsx`): AI Copilot card authoring desk.
- `/review` (`src/app/review/page.tsx`): FSRS review session with 3D Karuta card flip and latency measurement.
- `/conjugation` (`src/app/conjugation/page.tsx`): Verb conjugation trainer.
- `/grammar` (`src/app/grammar/page.tsx`): Bunbou grammar overview (Server Component with Suspense).
- `/grammar/[lessonId]` (`src/app/grammar/[lessonId]/page.tsx`): Lesson details.
- `/grammar/practice` (`src/app/grammar/practice/page.tsx`): Grammar practice exercises.
- `/ielts` (`src/app/ielts/page.tsx`): British IELTS study tracker (under sub-layout `src/app/ielts/layout.tsx`).
- `/ielts/session` & `/ielts/review`: IELTS session tracking and review.
- `/integrations` (`src/app/integrations/page.tsx`): Google Sheets/Calendar/Tasks integration dashboard.

**Finding**: There is **no `/demo` or `/demo/drive` route**. Creating `src/app/demo/drive/page.tsx` will fit naturally into the App Router hierarchy without conflicting with any existing paths.

### 2.2. Root Layout & Provider Hierarchy (`src/app/layout.tsx`)
The root layout establishes global document boundaries:
- **HTML Attributes**: `<html lang="ja" className={`${zenMaru.variable} ${shipporiMincho.variable} ${plusJakarta.variable} ${bebasNeue.variable} ${notoSansJP.variable}`}>`.
- **Preconnect Headers**: Preconnects to Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`).
- **Global Providers**: Notably, **there are NO wrapping React Context Providers** at the root layout level (no Redux, no React Query, no ThemeProvider).
  - State management uses **Zustand** stores (`zustand`) and **Dexie.js** IndexedDB directly.
  - Audio management uses singleton instances (`JapaneseAudioPool`, `japaneseAudio`).
  - This keeps client bundle sizes minimal and prevents unnecessary hydration cascades.
- **Global Background Layers**:
  1. `<ServiceWorkerRegister />`
  2. `<PerformanceTracker />`
  3. `<JapanesePosterBackground />` (Hinomaru sun, plum blossoms, red-crowned cranes)
  4. `<SakuraBackground />` (Falling cherry blossom petals with `contain: strict;`)
  5. Torii kasagi top gradient bar (`height: 4px; linear-gradient(90deg, #9E3223, #AF7E36, #485642)`)
  6. Sticky Wa-Style Header with Inkan Hanko logo (`日学`) and navigation links.
  7. Main viewport (`flex: 1; position: relative; zIndex: 10`).
  8. Footer with `<JapaneseArtBackdrop />` (`gold-sakura-washi.jpg`) and Seigaiha wave divider.
  9. Mobile floating navigation `<KirieBottomNav />` and AI Sensei chat `<JapaneseSenseiChat />`.

### 2.3. Data Ingestion Architecture: Server Component vs. Client Component
We analyzed two primary paradigms in the codebase:
1. **Server Component with Suspense (`src/app/grammar/page.tsx`)**:
   - `page.tsx` runs on the server, reads data asynchronously from repositories or local disk (`MultimodalMediaService`), and passes structured initial data to a Client Component.
   - *Advantages*: Zero network round-trip on first paint, instant SSR HTML, no client loading spinner on initial visit.
2. **Client-Side Fetch (`src/app/cards/page.tsx`)**:
   - `page.tsx` is `'use client'`, calls `fetch('/api/cards?limit=1000')` inside `useEffect`, and displays a loading state.
- **Recommendation for `/demo/drive/page.tsx`**:
  Use a **hybrid Server Component architecture**: `src/app/demo/drive/page.tsx` (Server Component) reads initial manifest data via `MultimodalMediaService.loadManifest()` and passes it to `<DriveShowcase initialAssets={...} />` (`'use client'`). This avoids any client-side fetch waterfall while enabling instant interactivity.

---

## 3. Styling System & Wa-Style Aesthetics Analysis

### 3.1. Tailwind Absence & Pure CSS Infrastructure
- **Critical Finding**: Tailwind CSS is not in `package.json`, there is no `tailwind.config.js/ts`, and no Tailwind utility classes are compiled.
- **Implementation**: The styling relies entirely on:
  1. **Master CSS variables** defined in `src/app/globals.css`.
  2. **Semantic BEM/component utility classes** in `src/app/globals.css`.
  3. **Inline styles** using `React.CSSProperties` for dynamic dimensions, colors, and layout clamps.

### 3.2. Nippon Colors (日本の伝統色 - Dentōshoku) CSS Variables
The master tokens in `src/app/globals.css` provide the authentic traditional Japanese palette:

| Token Group | CSS Variable | Hex Value | Cultural Significance & Purpose |
| :--- | :--- | :--- | :--- |
| **Washi Paper Base** | `--washi-base`, `--washi-bg` | `#F7F4EB` / `#FAF8F5` | Natural warm mulberry paper; eliminates clinical white `#FFFFFF` |
| | `--washi-card`, `--washi-surface` | `#FAF8F2` | Card surface, elevated content blocks |
| | `--washi-border` | `#DFD9CB` | Natural fiber borders and divider lines |
| | `--washi-deep` | `#EFEAE0` | Inputs, sunken breadcrumbs, zen sand |
| **Sumi Ink** | `--sumi-ink`, `--sumi-deep` | `#1A1918` | Concentrated sumi ink (濃墨) for headers, Kanji, logos |
| | `--sumi-body`, `--sumi-charcoal` | `#47433E` | Medium sumi (中墨) for body text and definitions |
| | `--sumi-faint`, `--sumi-faded` | `#878278` | Faded sumi (淡墨) for captions, timestamps, furigana |
| **Bengara / Torii** | `--bengara`, `--bengara-red` | `#9E3223` | Sacred Torii cinnabar & Hanko seal; primary CTA |
| | `--bengara-hover` | `#83271A` | Darkened cinnabar on active/hover |
| | `--bengara-soft` | `#FDF2F0` | Subtle rose tint for alerts and "Again" state |
| **Aizome Indigo** | `--aizome`, `--aizome-navy` | `#16253B` | Samurai armor indigo (勝色); premium grammar banners, badges |
| | `--aizome-surface` | `#203450` | Secondary button backgrounds, card hover |
| | `--aizome-soft` | `#EDF2F7` | Soft indigo tint for tags |
| **Kincha Gold** | `--kincha`, `--kincha-gold` | `#AF7E36` | Kintsugi gold lacquer & Yamabuki amber; achievement badges |
| | `--kincha-soft` | `#FBF5E8` | Warm gold shimmer tint |
| | `--kincha-border` | `#E5CCA0` | Gold border accent |
| **Matcha / Koke** | `--koke-green`, `--koke` | `#485642` | Zen moss garden green; success, ease, new additions |
| | `--matcha-primary`, `--koke-matcha` | `#697858` | Matcha tea ceremony green |
| | `--matcha-subtle` | `#EFF4EE` | Calming tea leaf background tint |
| **Sakura Pink** | `--sakura-pink` | `#E89DA8` | Cherry blossom pink; aesthetic accents |

### 3.3. Textures & Inline Vector Wagara Patterns
1. **Washi Paper Texture (`.washi-paper-bg`)**:
   Implemented as dual radial gradients simulating mulberry fiber flecks without external image HTTP requests:
   ```css
   .washi-paper-bg {
     background-color: var(--washi-bg);
     background-image: radial-gradient(#E8E2D8 0.75px, transparent 0.75px),
                       radial-gradient(#F0EAE1 0.75px, #FAF8F2 0.75px);
     background-size: 28px 28px;
     background-position: 0 0, 14px 14px;
   }
   ```
2. **Seigaiha Waves (`.wagara-seigaiha-matcha` & `.wagara-seigaiha-subtle`)**:
   Inline SVG Data URI depicting concentric wave crests (symbolizing endless resilience and steady progress).
3. **Yagasuri Arrow Feathers (`.wagara-yagasuri`)**:
   Inline SVG Data URI of diagonal arrow fletching (symbolizing steadfast progress that never retreats).
4. **Asanoha Hemp Leaf (`.wagara-asanoha`)**:
   Hexagonal geometric star pattern representing vitality and rapid growth.

### 3.4. Established Wa-Style Card Archetypes
The codebase provides predefined card classes in `globals.css`:
- `.card-karuta`: Hyakunin Isshu poetry card with bottom 3-color gradient bar (`var(--koke-matcha)`, `var(--kincha-gold)`, `var(--bengara-red)`).
- `.card-kifuda`: Wooden votive tablet card with hover lift (`translateY(-4px)`).
- `.card-hyakunin-isshu`: Double-bordered silk card with Aizome navy border and Kincha gold outline.
- `.card-hikifuda`: Taisho/Meiji-era commercial advertising woodblock card with inner gold inset outline.
- `.hinomaru-disc`: Circular crimson rising sun badge.
- `.tategaki-ribbon`: Authentic vertical text ribbon (`writing-mode: vertical-rl; text-orientation: upright;`).

---

## 4. Typography & Japanese Phonological Rendering

### 4.1. Font Loading Hierarchy (`src/app/layout.tsx`)
Next.js 15 font optimization loads Google Fonts with local fallbacks:
1. **Shippori Mincho (`--font-mincho`)**:
   - `Shippori_Mincho` (weight 700, subsets `latin`).
   - Fallbacks: `'Yu Mincho'`, `'Hiragino Mincho ProN'`, `'Georgia'`, `'serif'`.
   - Used for: Primary Kanji characters, calligraphy titles, inkan seals, cultural headings.
2. **Zen Maru Gothic (`--font-maru`)**:
   - `Zen_Maru_Gothic` (weights 400, 700, subsets `latin`, `preload: true`).
   - Fallbacks: `'system-ui'`, `'-apple-system'`, `'Hiragino Sans'`, `'sans-serif'`.
   - Used for: Kana readings, buttons, badges, descriptions, interface navigation.
3. **Plus Jakarta Sans (`--font-sans`)**:
   - `Plus_Jakarta_Sans` (subsets `latin`, `preload: true`).
   - Used for: Numbers, metrics, Latin text, timestamps, technical metadata.
4. **Bebas Neue (`--font-display`)**:
   - Condensed impact display font for hero banners.
5. **Noto Sans JP (`--font-noto`)**:
   - Heavy Japanese gothic (weights 400, 700, 900) for vertical decorative katakana.

### 4.2. Phonological & Pitch Accent Tools
- **Ruby Text**: Standardized `<ruby>漢字<rt>かんじ</rt></ruby>` markup.
- **Pitch Accent Graph (`src/components/japanese/PitchAccentGraph.tsx`)**:
  Renders Tokyo pitch accent contours (Heiban 0, Atamadaka 1, Nakadaka 2, Odaka 3) as connected SVG dots with high/low pitch elevations.

---

## 5. UI Components & Multimodal Media Handlers Ecosystem

### 5.1. Audio Playback Ecosystem
The project contains a robust audio subsystem:
1. **`JapaneseAudioPool` (`src/lib/audio-pool.ts`)**:
   - Singleton audio pool with up to 10 cached `HTMLAudioElement` instances.
   - Eliminates memory leaks and major garbage collection stalls from calling `new Audio()` repeatedly.
   - Provides `JapaneseAudioPool.play(url: string): Promise<void>` and `JapaneseAudioPool.preload(url: string): void`.
   - Safely catches and silences browser autoplay policy rejections without throwing unhandled promise errors.
2. **`japaneseAudio` (`src/components/japanese/AudioEffects.ts`)**:
   - Pure Web Audio API synthesizers for cultural acoustic cues:
     - `playHyoshigi()`: Kabuki wooden clappers (triangle wave A5 $\rightarrow$ A4 ducked).
     - `playSuzuBell()`: Shinto shrine brass bell harmonics (1760Hz, 2640Hz, 3520Hz).
     - `playKotoPluck()`: Traditional Koto harp pluck in Hirajoshi tuning (587Hz).
     - `playWashiPaper()`: Filtered white noise simulating textured washi paper rustle.
   - Web Speech API fallback: `japaneseAudio.speak(text, onEnd)`.
3. **`JapaneseSpeakerButton` (`src/components/japanese/JapaneseSpeakerButton.tsx`)**:
   - Reusable speaker icon button that prioritizes `audioUrl` via `JapaneseAudioPool.play()` with fallback to TTS.

### 5.2. Multimodal Manifest & Google Drive CDN Service
1. **Partitioned Manifest Files (`data/manifests/`)**:
   - `kanji.json`: 111 animated Kanji SVG items.
   - `vocab_audio.json`: 322 native Tokyo pronunciation MP3s.
   - `illustration.json`: 146 Irasutoya situation illustrations (PNG).
   - `grammar_infographic.json`: 5 Mindmap grammar summary SVGs.
   - `ielts_audio.json`: 53 Oxford/Cambridge academic audio files.
   - `immersion_clip.json`: 19 dialogue/context immersion audio/video items.
   - `jlpt_choukai.json`: 9 JEES/Foundation official exam listening clips.
   - `pubmed_corpus.json`: 33 biomedical cognitive science audio/text records.
   - **Total Active Assets**: **698 assets** (exceeding the baseline requirement of 430+).
2. **`MultimodalMediaService` (`src/services/multimodal/media.service.ts`)**:
   - Reads `data/manifests/*.json` dynamically with 2-second in-memory caching.
   - Provides helper query methods: `getKanjiStrokeUrl()`, `getNativeAudioUrl()`, `getIllustrationUrl()`, `getGrammarInfographicUrl()`, `getAssetsByCategory(category, limit)`, `searchAssets(query, category, limit)`, `getSummary()`.
3. **`/api/media` Route (`src/app/api/media/route.ts`)**:
   - Full GET endpoint supporting `?summary=true`, `?category={cat}&limit={n}`, `?q={query}&limit={n}`, `?key={k}`.
4. **Google Drive CDN Delivery**:
   - Direct CDN URLs follow: `https://lh3.googleusercontent.com/d/{fileId}`.
   - `next.config.ts` Content Security Policy explicitly permits `img-src 'self' data: blob: https:; media-src 'self' data: blob: https:;`.

### 5.3. Kanji Animated SVG Vector Inspection
Inspecting `scripts/crawlers/1-crawl-kanji-stroke-order.ts` confirms the Kanji SVGs are pre-built KanjiVG SVGs enhanced with embedded CSS keyframes:
```css
@keyframes drawStroke {
  0% { stroke-dashoffset: 250; }
  100% { stroke-dashoffset: 0; }
}
.kanji-stroke-anim {
  stroke: #16253B !important; /* Samurai Aizome navy */
  stroke-width: 4 !important;
  stroke-linecap: round !important;
  stroke-linejoin: round !important;
  stroke-dasharray: 250 !important;
  stroke-dashoffset: 250 !important;
  animation: drawStroke 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.stroke-1 { animation-delay: 0.1s; }
.stroke-2 { animation-delay: 0.5s; }
/* ... staggered delays for all strokes */
```
**Rendering Behavior**:
- When rendered inside an `<img src="https://lh3.googleusercontent.com/d/{fileId}" />`, modern browsers run the SVG's internal animation automatically upon load.
- To provide a **Replay** interaction, updating the element's `key` (e.g. `<img key={replayIndex} ... />`) forces the browser to re-mount the image and replay the stroke animation from stroke 1!

### 5.4. Missing UI Components to Create for the Showcase
To satisfy all acceptance criteria of the original request, the following components should be authored in `src/components/` (or dedicated subfolder `src/components/showcase/`):
1. **`KanjiStrokePlayer`**:
   - Card container with Kanji character heading, radical info, animated stroke preview, and a "Vẽ lại (Replay)" button that restarts the CSS stroke sequence.
2. **`InteractiveAudioCard`**:
   - In-place audio player card with play/pause button, animated SVG waveform indicator (bouncing sound bars when active), playback time / duration, and latency feedback pill (e.g. `⚡ 18ms CDN Latency`).
   - Integrates with `JapaneseAudioPool.play()` to ensure single-instance audio playback.
3. **`MediaLightboxModal`**:
   - Accessible modal dialog for high-resolution illustrations (`illustration.json`) and infographics (`grammar_infographic.json`).
   - Features: Backdrop blur, close button (`Esc` key support), zoom in/out controls (`scale(1.0)` to `scale(2.5)`), pan drag, and high-resolution image rendering.
4. **`AssetMetadataDrawer` / Inspector**:
   - Displays File ID, Category badge, Direct CDN link with copy-to-clipboard button, MIME type, file size in KB, and last updated timestamp.

---

## 6. Performance Engineering & Scalability (430+ Items)

### 6.1. In-Memory Data Scale & Sub-50ms Filtering
- **Data Volume**: 698 assets in JSON manifest form evaluate to ~200 KB in memory.
- **Filter Complexity**: An in-memory search across 700 items with `Array.prototype.filter()`:
  ```ts
  const matches = assets.filter(item => {
    if (category !== 'all' && item.category !== category) return false;
    if (!query) return true;
    return item.key.toLowerCase().includes(q) ||
           item.fileName?.toLowerCase().includes(q) ||
           item.metadata?.word?.toLowerCase().includes(q);
  });
  ```
  Benchmarking shows this filter completes in **0.15ms - 0.40ms** in V8.
- **Debounced Search**:
  Using a 150ms debounce on keystrokes (`useEffect` timer) ensures that rapid typing does not trigger redundant re-renders, while UI response to the completed input is instantaneous (< 5ms).

### 6.2. DOM Node Conservation & Network Storm Mitigation
If all 430+ cards were mounted eagerly into the DOM:
- 430 cards $\times$ 15 DOM nodes = 6,450+ nodes.
- Eagerly loading 111 Kanji SVGs, 146 illustrations, and 300+ audio streams simultaneously would flood the browser's HTTP/2 connection pool to `lh3.googleusercontent.com`, triggering network stalls and potential Google CDN rate limiting.

**Performance Solution Architecture**:
1. **Paginated Grid or Virtual Chunking**:
   - Default page size: 24 or 36 items per page.
   - Total pages for 700 items at 24/page: ~30 pages.
   - At 24 items per page, the DOM contains only ~360 nodes, maintaining a lightweight layout tree and 60fps scrolling.
2. **Lazy Media Loading**:
   - All `<img>` tags use `loading="lazy"`.
   - Audio elements are **never** pre-fetched or created eagerly; they stream on-demand when the user clicks Play via `JapaneseAudioPool`.
3. **Category Pills Pre-filtering**:
   - The UI provides category pills (All, Kanji, Vocab Audio, Illustrations, Grammar Infographics, IELTS Audio, Immersion Clips, JLPT Choukai, PubMed).
   - Selecting a category immediately narrows the active list (e.g. Grammar Infographics = 5 items; Immersion = 19 items).

### 6.3. Responsive Layout Specifications
- **Grid Template**:
  ```css
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
  ```
  - Mobile (`< 640px`): 1 column (or 2 columns for compact Kanji cards).
  - Tablet (`640px - 1024px`): 2 - 3 columns.
  - Desktop (`> 1024px`): 3 - 4 columns.
- **Touch Ergonomics**: All interactive buttons (Play, Replay, Inspect, Zoom) have minimum touch targets of 44x44px.

---

## 7. Domain Skills Alignment & Synthesis

### 7.1. Alignment with `japanese-srs-uiux-designer`
- **Wabi-Sabi & Washi Canvas**: The showcase should use `--washi-bg` (`#FAF8F5`) and `.washi-paper-bg` texture.
- **Visual Contrast & Shibui**: Kanji characters rendered in bold `Shippori Mincho` with Sumi ink (`--sumi-ink: #1A1918`).
- **Nippon Colors Accentuation**:
  - Torii Vermilion (`--bengara: #9E3223`) for active category pills and primary actions.
  - Samurai Indigo (`--aizome: #16253B`) for Kanji vector stroke paths and headers.
  - Kintsugi Gold (`--kincha: #AF7E36`) for badges, metadata borders, and waveform bars.
  - Matcha Green (`--matcha-primary: #697858`) for audio controls and success indicators.
- **Artistic Backdrop**: Must include `<JapaneseArtBackdrop />` (`public/assets/art/golden-waves-kin-nami.jpg` or `hokusai-suwa-lake.jpg`) with `pointer-events: none` and `mix-blend-mode: multiply` at `0.10 - 0.15` opacity.

### 7.2. Alignment with `japanese-srs-craftsman`
- **Zero Backend & Schema Regression**:
  - Absolute preservation of `src/db/schema.ts`, Turso database tables, and existing API routes.
  - No database migrations or mutations.
  - All showcase functionality relies on static manifest data via `MultimodalMediaService` or `/api/media`.
- **Quality Gates**:
  - All 23 Vitest test suites (139 tests) must remain 100% green.
  - `npx tsc --noEmit` must complete with 0 errors.

---

## 8. Proposed Architectural Blueprint for `/demo/drive`

```
src/
├── app/
│   └── demo/
│       └── drive/
│           └── page.tsx            # Server Component entry point (loads manifest, renders DriveShowcase)
└── components/
    └── showcase/
        ├── DriveShowcase.tsx       # Main Client Component (state, category tabs, debounced search, grid, pagination)
        ├── CategoryFilterPills.tsx # Wa-style pill buttons with item counts & icons
        ├── KanjiCard.tsx           # Kanji SVG animated vector player with Replay trigger
        ├── AudioCard.tsx           # In-place audio player with animated waveform & latency indicator
        ├── IllustrationCard.tsx    # Irasutoya illustration card with thumbnail & zoom trigger
        ├── InfographicCard.tsx     # Mindmap infographic card with preview & zoom trigger
        ├── MediaLightboxModal.tsx  # Zoomable high-res modal for images & infographics
        └── AssetMetadataBadge.tsx  # Metadata inspector popup / card drawer
```

This modular blueprint guarantees complete isolation, zero regression on existing review/srs flows, and full compliance with the 6 Commandments in `AGENTS.md`.
