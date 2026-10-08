# Comprehensive Survey of QA Test Infrastructure, Invariants & E2E Testing Strategy

> **Agent**: `explorer_survey_3` (teamwork_preview_explorer)  
> **Working Directory**: `d:\project\japanese-srs-system\.agents\teamwork\explorer_survey_3`  
> **Date**: 2026-10-07  
> **Status**: Complete & Verified (100% Green / Zero Regression)

---

## 1. Executive Summary

This survey provides a comprehensive audit of the Quality Assurance (QA) testing infrastructure, architectural invariants, and verification methodology of `japanese-srs-system`. It establishes the authoritative baseline for the upcoming **Multimodal Google Drive Showcase** (`/demo/drive`), ensuring zero-regression backend safety, adherence to cognitive FSRS v4.5 invariants, and authentic Wa-Style aesthetic fidelity.

### Key Metrics at a Glance
| Metric | Value | Verification Status |
| :--- | :--- | :--- |
| **Vitest Test Suites** | **23 passed (23 total)** | Verified (via `npm test -- --run`) |
| **Total Test Cases** | **139 passed (139 total)** | Verified (100% Green, 0 failures) |
| **Execution Duration** | **~5.44s - 5.66s** | Ultra-fast Node.js environment |
| **TypeScript Health** | **0 errors** | Verified (via `npx tsc --noEmit`) |
| **Database Schema Invariant** | **0 alterations** | 676 cards intact in Turso/Local SQLite |
| **JapaneseArtBackdrop Invariant** | **5/5 pages verified** | Invariant 4 fully satisfied |
| **Multimodal Assets in Manifest** | **688 assets across 8 categories** | Verified in `data/multimodal-manifest.json` |

---

## 2. Test Environment Architecture & Tooling

### 2.1 Configuration Files
1. **`vitest.config.ts`**:
   ```typescript
   import { defineConfig } from 'vitest/config';
   import path from 'path';

   export default defineConfig({
     test: {
       globals: true,
       environment: 'node',
     },
     resolve: {
       alias: {
         '@': path.resolve(__dirname, './src'),
       },
     },
   });
   ```
   - **Runtime Environment**: Pure `node` (`environment: 'node'`).
   - **Globals**: `globals: true` enables `describe`, `it`, `expect`, `vi`, `beforeEach` without explicit imports.
   - **Path Aliasing**: `@/` maps directly to `./src/`.

2. **`package.json` Test Script**:
   - `"test": "vitest run"`
   - Invoking `npm test -- --run` forwards the `--run` argument to Vitest, executing a single deterministic test run in CI/headless mode without watch triggers.

3. **Dependency Footprint & Absence of `@testing-library/react`**:
   - `devDependencies`:
     - `"vitest": "^3.2.7"`
     - `"typescript": "^5.7.3"`
     - `"fake-indexeddb": "^6.2.5"`
     - `"sharp": "^0.35.5"`
     - `"drizzle-kit": "^0.30.4"`
   - **Crucial Architecture Finding**: Neither `@testing-library/react` nor `jsdom`/`happy-dom` are installed in `package.json`.
   - **Established Project Testing Paradigm**: The project does not mount full React DOM trees in JSDOM. Instead, tests achieve ultra-high speed (139 tests in 5.4s) via:
     1. **Pure Algorithmic & Invariant Testing**: FSRS v4.5 equations, Bjork retrieval dynamics, LECTOR interleaving, Cloze parsing, verb conjugation.
     2. **Next.js 15 Server Route Handlers**: Direct invocation of `GET(new Request(...))` and `POST(new Request(...))` passing web-standard `Request` objects and asserting `Response.json()`.
     3. **Node.js Mock Globals**: Custom lightweight mocks for browser APIs, such as `fake-indexeddb/auto` for Dexie.js (`tests/offline-db.test.ts`) and `MockAudio` for `(global as any).Audio` (`tests/audio-pool.test.ts`).
     4. **Static AST & Source Invariant Checks**: Reading source files with `node:fs` to assert component presence, export contracts, and design token compliance (`tests/art-backdrop.test.ts`, `tests/fsrs-worker.test.ts`, `tests/kirie-ui-components.test.ts`).

---

## 3. Authoritative Audit of Vitest Test Suites (23 Suites / 139 Tests)

### 3.1 Resolving the 21 Suites (111 Tests) vs 23 Suites (139 Tests) Reconciliation
- The dispatch task noted: *"Document the exact state of all 21 Vitest test suites (111 tests)"*.
- **Root Cause & Codebase Reality**:
  - In earlier project phases, the test suite consisted of exactly **21 suites and 111 tests**.
  - During recent development work, two substantial suites were added:
    1. `tests/ielts-tracking.test.ts` (+13 tests): Cambridge band score conversion, IELTS repository persistence, IELTS API routes.
    2. `tests/multimodal-media.test.ts` (+15 tests): MultimodalMediaService, `/api/media` routes, JLPT Choukai verification, Cambridge IELTS audio, bilingual medical terminology, partitioned manifest aggregation.
  - Calculation: $111 \text{ base tests} + 13 + 15 = \mathbf{139 \text{ tests}}$, across $\mathbf{23 \text{ test suites}}$.
  - All 23 test suites are currently passing 100%.

### 3.2 Complete Inventory of All 23 Test Suites

| # | Test Suite File | Tests | Runtime | Primary Target & Invariants Verified |
| :-: | :--- | :-: | :-: | :--- |
| 1 | `tests/db-and-api.test.ts` | 3 | ~55ms | SQLite/Turso client inspect, cards/decks query (676 cards), `/api/cards` route |
| 2 | `tests/ielts-tracking.test.ts` | 13 | ~66ms | Cambridge Band scoring, Drizzle IELTS schema, `/api/ielts/*` routes |
| 3 | `tests/subagents-orchestration.test.ts` | 8 | ~40ms | MiningCopilot, KanjiPitchExpert, CognitiveGuardrail, CopilotOrchestrator |
| 4 | `tests/grammar-engine.test.ts` | 6 | ~24ms | JPD133 Grammar repository, structureSlots, Cloze card factory, Atomicity |
| 5 | `tests/rag-chatbot.test.ts` | 12 | ~22ms | Local RAG knowledge retrieval, Route Context-Aware Matrix, `/api/chat` route |
| 6 | `tests/cognitive-fsrs-optimizer.test.ts` | 6 | ~12ms | FSRS v5 Retrievability decay $R(t,S)$, $D \in [1,10]$, Stability update, RMSE, Rollback |
| 7 | `tests/art-backdrop.test.ts` | 5 | ~11ms | `public/assets/art` assets (>10KB), CSS mix-blend-modes, `<JapaneseArtBackdrop />` in 5 pages |
| 8 | `tests/audio-pool.test.ts` | 2 | ~8ms | `JapaneseAudioPool` SSR safe fallback, instance reuse, memory leak prevention |
| 9 | `tests/constraints.test.ts` | 5 | ~7ms | Zod `GeneratedCardSchema`, $i+1$ Pedagogical Guard, Desirable Difficulty, Atomicity |
| 10 | `tests/conjugation-engine.test.ts` | 13 | ~8ms | Romaji to Hiragana transliteration, sokuon/hatsuon, 50 Japanese verbs dataset |
| 11 | `tests/telemetry-monitoring.test.ts` | 4 | ~17ms | Lighthouse CI config budget, SSR safe telemetry, `/api/telemetry` route, Server Actions |
| 12 | `tests/reading-parser.test.ts` | 4 | ~6ms | Kun/On-yomi separation for Kanji, Âm Hán Việt extraction, Cloze sentence presence |
| 13 | `tests/audit-bug-remediation.test.ts` | 15 | ~67ms | Verification of 55 bug fixes: Cloze regex statelessness, FSRS DB transactions, Rate Limiter |
| 14 | `tests/lector-interleaving.test.ts` | 3 | ~6ms | Cosine distance, semantic interference score, cognitive queue interleaving |
| 15 | `tests/kanjicompass-graph.test.ts` | 3 | ~7ms | Etymological phonetic hubs (Keisei families), sibling kanji lookup, SRL pathway |
| 16 | `tests/fsrs-worker.test.ts` | 4 | ~6ms | Web Worker file existence, message handler, fallback scheduler, 4 FSRS states |
| 17 | `tests/agent-skills.test.ts` | 3 | ~5ms | `generate_i_plus_one_sentence`, `decompose_kanji_etymology`, `lookup_pitch_accent` |
| 18 | `tests/latency-dynamics.test.ts` | 4 | ~5ms | Bjork reading allowance ($120\text{ms}/\text{char}$), hesitation downgrade, golden zone bonus |
| 19 | `tests/scheduler.test.ts` | 3 | ~5ms | FSRSEngine monotonic intervals ($I_{\text{Again}} \le I_{\text{Hard}} \le I_{\text{Good}} \le I_{\text{Easy}}$), Atomicity |
| 20 | `tests/multimodal-media.test.ts` | 15 | ~74ms | MultimodalMediaService, `/api/media` queries, JLPT/IELTS audio sources, manifest partitioning |
| 21 | `tests/kirie-ui-components.test.ts` | 2 | ~2ms | Export validation of 5 Kirie components, `KirieFocusItemData` type mapping |
| 22 | `tests/offline-db.test.ts` | 3 | ~15ms | Dexie.js IndexedDB with `fake-indexeddb/auto`, local card caching, pending reviews |
| 23 | `tests/turso-integration.test.ts` | 3 | ~4900ms | Real Turso Cloud LibSQL connection, 640+ cards verification, deck segregation |
| **SUM** | **23 Suites** | **139** | **~5.44s** | **100% Passing (0 failures, 0 warnings)** |

---

## 4. Invariant 4 Deep-Dive: `tests/art-backdrop.test.ts` & `<JapaneseArtBackdrop />`

### 4.1 Invariant Mandate
AGENTS.md Commandment 4 states:
> *"File `src/app/review/page.tsx` bắt buộc phải chứa component `<JapaneseArtBackdrop ... />` để thỏa mãn kiểm thử mỹ thuật `tests/art-backdrop.test.ts`. Bất kỳ agent nào xóa component này đều bị coi là vi phạm nghiêm trọng."*

### 4.2 Exact Implementation in `tests/art-backdrop.test.ts`
Inspection of `tests/art-backdrop.test.ts` (lines 50–66) reveals the exact assertion logic:
```typescript
it('toàn bộ 5 trang chính phải tích hợp JapaneseArtBackdrop và đảm bảo tính bất biến giao diện', () => {
  const targetPages = [
    'src/app/page.tsx',
    'src/app/cards/page.tsx',
    'src/app/cards/new/page.tsx',
    'src/app/review/page.tsx',
    'src/app/integrations/page.tsx',
  ];

  for (const pageRelPath of targetPages) {
    const pageAbsPath = path.resolve(process.cwd(), pageRelPath);
    expect(fs.existsSync(pageAbsPath), `Trang không tồn tại: ${pageRelPath}`).toBe(true);

    const content = fs.readFileSync(pageAbsPath, 'utf-8');
    expect(content).toContain('JapaneseArtBackdrop');
  }
});
```

### 4.3 Asset & Styling Invariants Tested
- **Directory**: `public/assets/art` must exist.
- **13 Semantic Art Files**:
  1. `japanese-cultural-panorama.jpg`
  2. `golden-waves-kin-nami.jpg`
  3. `ryusui-indigo-stream.jpg`
  4. `hokusai-suwa-lake.jpg`
  5. `hokusai-cranes-fuji.jpg`
  6. `cloud-mist-kasumi-icons.jpg`
  7. `hokusai-great-wave-classic.jpg`
  8. `great-wave-isolated.webp`
  9. `kohaku-koi-pond.jpg`
  10. `night-golden-waves.jpg`
  11. `rinpa-gold-waves-clouds.jpg`
  12. `koi-peony-yuzen.jpg`
  13. `gold-sakura-washi.jpg`
- **File size bound**: Each semantic asset must exceed $10\text{ KB}$ (`expect(stats.size).toBeGreaterThan(10 * 1024)`).
- **Original preservation**: Total files in `public/assets/art` must be $\ge 26$ to prevent accidental overwrites of source assets.
- **CSS Blend Modes**: Validated against `['multiply', 'overlay', 'soft-light', 'screen', 'normal']`.

### 4.4 Architectural Rule for `/demo/drive`
When developing `/demo/drive`:
1. The 5 existing pages listed above must remain untouched to prevent Invariant 4 regression.
2. For aesthetic harmony (Commandment 6), `/demo/drive` should also import and render `<JapaneseArtBackdrop />` (e.g., with preset `golden-waves-kin-nami` or `ryusui-indigo-stream`) to provide authentic Wa-Style depth.

---

## 5. TypeScript Configuration & Health Verification

### 5.1 Verification Command & Output
- Command: `npx tsc --noEmit`
- Exit code: `0`
- Error count: **0 errors**

### 5.2 Compiler Settings (`tsconfig.json`)
- **Target**: `ES2022`
- **Libraries**: `["dom", "dom.iterable", "esnext"]`
- **Strict Mode**: `strict: true` (strictly enforced null checks, strict function types, no implicit any)
- **Module Resolution**: `bundler` (optimized for Next.js 15 App Router)
- **JSX**: `preserve`
- **Path Mapping**: `@/* -> ./src/*`
- **Included Paths**: `["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]`

---

## 6. Synthesis of Domain Skills

### 6.1 `japanese-srs-qa-engineer` Skill Guidelines
- **Core Philosophy**: Zero False Positives, Resilience to Chaos, Monotonic FSRS Mathematical Invariants.
- **Testing Pyramid**: Unit (DSR math, Cloze, Furigana) $\rightarrow$ Integration (API routes, Drizzle DB) $\rightarrow$ E2E (Clickstream, Hotkeys).
- **Edge Case Vectors (EC-01 to EC-06)**:
  - `EC-01`: 0 items in dataset $\rightarrow$ Zen Empty state, graceful handling without crashes.
  - `EC-02`: Invalid query parameter $\rightarrow$ Graceful fallback to default with non-intrusive notification.
  - `EC-03`: Malformed data string $\rightarrow$ Default fallback, unbroken visual layout.
  - `EC-05`: Rapid user clicks / debounce $\rightarrow$ Idempotent action, prevent duplicate concurrent operations.
  - `EC-06`: Offline operation $\rightarrow$ Safe local caching, zero blocking network calls.

### 6.2 `japanese-srs-uiux-auditor` Skill Guidelines
- **The Fourfold Defect Taxonomy**:
  1. **Thừa (Superfluous)**: Visual bloat, redundant buttons, unneeded decorative clutter.
  2. **Thiếu (Missing)**: Absent loading skeletons, missing keyboard affordances, missing ARIA tags (`aria-label`, `aria-live`).
  3. **Sai (Incorrect)**: Inauthentic colors (avoid generic blue `#0000FF` / neon red `#FF0000`; use Nippon Colors `#9E3223`, `#16253B`, `#AF7E36`, `#FAF8F5`). Incorrect typography (use `Shippori Mincho` for Kanji, `Zen Maru Gothic` for UI).
  4. **Lỗi Hiển Thị (Visual Flaws)**: Layout shifts, touch targets $< 44\text{px}$, overflow bugs.
- **Cognitive Science Principles**:
  - *Sweller's Cognitive Load Theory*: Extraneous cognitive load must be zero.
  - *Hick's Law*: Sub-50ms category filtering to prevent decision paralysis.
  - *Fitts's Law*: Prominent, thumb-reachable media controls.

---

## 7. E2E Testing Track Plan for `/demo/drive`

To validate all requirements of the Multimodal Google Drive Showcase (R1–R4) while adhering to the project's pure Node.js Vitest testing architecture, we specify a **3-Suite Test Architecture** governed by the **4-Tier Methodology**.

### 7.1 Proposed Test Suite Structure
```
tests/
├── drive-showcase-api.test.ts       # Suite A: Route & Service Contract Integration
├── drive-showcase-logic.test.ts     # Suite B: Client State, Debounce, Filters & Audio State Machine
└── drive-showcase-ui-invariants.test.ts # Suite C: Component Exports, Wa-Tokens & Accessibility Invariants
```

---

### 7.2 The 4-Tier Testing Methodology Matrix

```
       ┌─────────────────────────────────────────────────────────────┐
       │   TIER 4: Real-World Scenarios, Performance & Chaos        │
       │   (Manifest cache fallback, 688 asset stress, Latency RTT)  │
       ├─────────────────────────────────────────────────────────────┤
       │   TIER 3: State Combinations & Permutations                 │
       │   (Category + Search, Rapid Switching, Audio Interruption) │
       ├─────────────────────────────────────────────────────────────┤
       │   TIER 2: Boundary, Corner Cases & Fault Injection          │
       │   (Missing manifest, Regex queries, Corrupted CDN URLs)     │
       ├─────────────────────────────────────────────────────────────┤
       │   TIER 1: Core Feature Coverage (>=5 test cases / feature)  │
       │   (Media Player, Category Pills, Search, Lightbox, Metadata)│
       └─────────────────────────────────────────────────────────────┘
```

#### Tier 1: Core Feature Coverage ($\ge 5$ test cases per feature)

##### Feature 1: Multimodal Manifest & Category Aggregation
- **T1-F1-01**: Manifest loads successfully with $\ge 688$ total assets.
- **T1-F1-02**: All 8 domain categories exist: `kanji`, `vocab_audio`, `illustration`, `grammar_infographic`, `ielts_audio`, `immersion_clip`, `jlpt_choukai`, `pubmed_corpus`.
- **T1-F1-03**: Kanji domain contains exactly 111 stroke order vector assets.
- **T1-F1-04**: Native audio domain contains $\ge 291$ Tokyo audio items.
- **T1-F1-05**: Category counts in `manifest.categories` strictly match the sum of individual partition entries.

##### Feature 2: Interactive Media Player & Asset Inspector
- **T1-F2-01**: Kanji asset generates valid direct CDN SVG URL matching `https://lh3.googleusercontent.com/d/{fileId}`.
- **T1-F2-02**: Audio asset initializes media player state with playback progress $0.0$, duration metadata, and paused state.
- **T1-F2-03**: Audio play command transitions state to `playing` and registers latency tracker timestamp.
- **T1-F2-04**: Lightbox modal opens with full-resolution illustration URL and initial zoom level $1.0\times$.
- **T1-F2-05**: Asset metadata inspector correctly formats Category, File ID, Direct CDN link, MIME type, and human-readable file size (KB/MB).

##### Feature 3: Category Filtering Pills & State Synchronization
- **T1-F3-01**: Default category selection is `'all'` displaying aggregated assets.
- **T1-F3-02**: Selecting `'kanji'` pill filters items strictly to `category === 'kanji'`.
- **T1-F3-03**: Selecting `'vocab_audio'` pill filters items strictly to `category === 'vocab_audio'`.
- **T1-F3-04**: Category transition maintains active scroll position and does not perform full page reload.
- **T1-F3-05**: Filter pill component emits appropriate active CSS state token (`bg-aizome` / `text-washi`).

##### Feature 4: Debounced Search & Instant Filtering Sub-50ms
- **T1-F4-01**: Exact Kanji match query (e.g., `'東'`) returns the corresponding asset within $< 10\text{ms}$.
- **T1-F4-02**: Romaji or English keyword query (e.g., `'cat'` or `'dementia'`) returns matching illustration/medical asset.
- **T1-F4-03**: Debounce delay of $150\text{ms}$ buffers rapid keystrokes into a single filtered search execution.
- **T1-F4-04**: Clearing search input immediately restores current category asset list without delay.
- **T1-F4-05**: Search query matching is case-insensitive across `fileName`, `key`, and `metadata.japanese`.

##### Feature 5: Wa-Style Visual Tokens & Accessibility Invariants
- **T1-F5-01**: UI uses defined Nippon Color design tokens (`--color-bengara`, `--color-aizome`, `--color-kincha`, `--color-washi`).
- **T1-F5-02**: Kanji headings enforce `font-serif` / `Shippori Mincho` typography.
- **T1-F5-03**: All interactive buttons (Play, Pause, Close Lightbox, Category Pills) have explicit `aria-label`.
- **T1-F5-04**: All media preview elements have descriptive `alt` tags or screen-reader announcements.
- **T1-F5-05**: Touch target bounding box classes enforce minimum `44px` height/width (`min-h-[44px] min-w-[44px]`).

---

#### Tier 2: Boundary & Corner Cases (Fault Injection)
- **T2-EC-01 (Missing Manifest)**: When `data/multimodal-manifest.json` is missing or empty, `MultimodalMediaService` returns `{ totalAssets: 0, assets: {}, categories: {} }` without throwing uncaught exceptions.
- **T2-EC-02 (Unknown Category)**: Requesting `?category=invalid_quantum_domain` returns an empty array with status 200, avoiding 500 errors.
- **T2-EC-03 (Regex Injection Search)**: Search query containing special regex characters (`.*+?^${}()|[]\`) is safely treated as literal text without crashing the regex engine.
- **T2-EC-04 (Oversized Search Query)**: Search query of $1,000+$ random characters completes in $< 20\text{ms}$ and yields 0 results safely.
- **T2-EC-05 (Malformed Asset Metadata)**: Asset entry lacking `sizeBytes` or `mimeType` renders with fallback defaults (`"Unknown MIME"`, `"0 B"`).
- **T2-EC-06 (Corrupted CDN URL)**: Asset with missing `fileId` safely renders a fallback warning icon instead of a broken `<img>` element.
- **T2-EC-07 (Audio Load Failure)**: Audio player encountering an error event transitions to `error` state and displays retry CTA without halting the UI.

---

#### Tier 3: State Combinations & Permutations
- **T3-CB-01 (Category + Search Query)**: Combining `category: 'kanji'` AND `query: '東'` yields only items matching BOTH criteria.
- **T3-CB-02 (Category Filter with Mutually Exclusive Search)**: Category `kanji` with search query `'stethoscope'` yields 0 results with a clean Zen Empty state.
- **T3-CB-03 (Audio Interruption on Category Change)**: When audio is playing in `vocab_audio` and user clicks `ielts_audio`, the active audio automatically pauses and cleans up event listeners before loading the new list.
- **T3-CB-04 (Search Debounce during Rapid Category Switching)**: When user types query `'a'` and immediately clicks category `'kanji'`, the debounced callback respects the *current* category filter rather than the stale previous category.
- **T3-CB-05 (Lightbox + Keyboard Navigation)**: When Lightbox modal is open, pressing `Escape` triggers close handler; pressing `ArrowRight` advances to the next asset in the active category.

---

#### Tier 4: Real-World Scenarios, Performance & Chaos
- **T4-RW-01 (Offline / Manifest Caching Resilience)**: When simulated offline (`navigator.onLine = false`), asset listings continue to function from local cached manifest without network blocking.
- **T4-RW-02 (688 Asset Grid Performance)**: Filtering and rendering data for all 688 items completes in $< 35\text{ms}$ in Node benchmark, verifying UI sub-50ms budget.
- **T4-RW-03 (CDN Latency Feedback Display)**: Audio player records retrieval latency $\Delta t$ and displays simulated ping badge (e.g., `42ms CDN`).
- **T4-RW-04 (WCAG 2.1 AA Contrast Compliance)**: Text tokens across cards and buttons achieve $\ge 4.5:1$ contrast against their Washi paper backgrounds.
- **T4-RW-05 (Zero-Backend-Regression Verification)**: Test suite queries database to confirm 676 cards in `cards` table, 4 decks in `decks` table, and 0 modifications to `src/db/schema.ts`.

---

## 8. Network Isolation & Mocking Strategy in Vitest

To guarantee **Zero False Positives** and ensure tests run reliably in offline CI/CD pipelines without hitting Google Drive servers:

### 8.1 Manifest Loading Isolation
- `MultimodalMediaService` already reads local JSON files from `data/multimodal-manifest.json` and `data/manifests/`.
- In tests, tests directly read existing JSON data for integration checks.
- For fault injection (Tier 2 empty/corrupted tests), use `vi.spyOn`:
  ```typescript
  import fs from 'fs';
  const readSpy = vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({ totalAssets: 0, assets: {} }));
  // ... run test ...
  readSpy.mockRestore();
  ```

### 8.2 Google Drive Direct CDN URL Validation
- Live HTTP calls to `https://lh3.googleusercontent.com/d/{fileId}` are **never executed** during unit/integration testing.
- URLs are validated via strict regex contracts:
  ```typescript
  const DRIVE_CDN_PATTERN = /^https:\/\/lh3\.googleusercontent\.com\/d\/[a-zA-Z0-9_-]+$/;
  expect(asset.cdnUrl).toMatch(DRIVE_CDN_PATTERN);
  ```

### 8.3 Browser Audio Mocking Strategy
- Following the proven architectural pattern in `tests/audio-pool.test.ts`:
  ```typescript
  export function createMockAudioEnvironment() {
    const playMock = vi.fn().mockResolvedValue(undefined);
    const pauseMock = vi.fn();
    const listeners: Record<string, Function[]> = {};

    class MockAudio {
      src = '';
      paused = true;
      currentTime = 0;
      duration = 3.5;
      play = playMock;
      pause = pauseMock;
      addEventListener = vi.fn((event: string, cb: Function) => {
        listeners[event] = listeners[event] || [];
        listeners[event].push(cb);
      });
      removeEventListener = vi.fn();
    }

    (globalThis as any).Audio = MockAudio;
    return { playMock, pauseMock, MockAudio, listeners };
  }
  ```

### 8.4 Search Debounce Timer Mocking
- Vitest fake timers provide deterministic time control without actual wall-clock sleeps:
  ```typescript
  vi.useFakeTimers();
  // Trigger keystroke
  vi.advanceTimersByTime(150);
  // Assert debounced function executed exactly once
  vi.useRealTimers();
  ```

---

## 9. Implementation Roadmap & Quality Gates

When the team advances from Survey to Implementation Phase:

| Gate | Requirement | Tool / Verification |
| :--- | :--- | :--- |
| **Gate 1** | Route `/demo/drive` loads cleanly | Vitest Route Handler & Component test |
| **Gate 2** | Sub-50ms search and category filter | Vitest logic benchmark $< 50\text{ms}$ |
| **Gate 3** | All 23 original test suites pass 100% | `npm test -- --run` $\ge 139$ passed |
| **Gate 4** | New `/demo/drive` test suites pass 100% | `npm test -- --run` $\ge 170$ passed |
| **Gate 5** | TypeScript clean compile | `npx tsc --noEmit` exits with 0 errors |
| **Gate 6** | Zero DB schema changes | `git diff src/db/schema.ts` is empty |

---
*Report authored by `explorer_survey_3` — Ready for Orchestrator Synthesis & Handoff.*
