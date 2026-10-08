# Handoff Report: QA Test Infrastructure, Invariants & E2E Testing Strategy

> **Agent**: `explorer_survey_3`  
> **Working Directory**: `d:\project\japanese-srs-system\.agents\teamwork\explorer_survey_3`  
> **Date**: 2026-10-07  
> **Type**: Hard (Task Complete)

---

## 1. Observation

1. **Vitest Configuration & Environment (`vitest.config.ts:1-15`)**:
   - `vitest.config.ts` configures `globals: true`, `environment: 'node'`, and path alias `'@': path.resolve(__dirname, './src')`.
   - Setup time reported by Vitest runner is `setup 0ms`, meaning there is no global setup file. Tests configure their own mocks locally when required (e.g., `import 'fake-indexeddb/auto'` in `tests/offline-db.test.ts:1`).

2. **Package Scripts & Dependency Analysis (`package.json:5-41`)**:
   - Script definition at line 10: `"test": "vitest run"`.
   - Execution command `npm test -- --run` forwards `--run` to `vitest run`.
   - Neither `@testing-library/react` nor `jsdom`/`happy-dom` are present in `dependencies` or `devDependencies`.
   - Primary test dependencies: `"vitest": "^3.2.7"`, `"fake-indexeddb": "^6.2.5"`, `"typescript": "^5.7.3"`.

3. **Vitest Test Execution State & Suite Count**:
   - Running `npm test -- --run` yielded:
     ```
     Test Files  23 passed (23)
          Tests  139 passed (139)
       Start at  08:07:21
       Duration  5.44s
     ```
   - Prior project documentation referenced **21 suites (111 tests)**.
   - `git status` shows two recently created test files:
     - `tests/ielts-tracking.test.ts` (13 tests)
     - `tests/multimodal-media.test.ts` (15 tests)
   - Baseline calculation: $139 - 13 - 15 = 111$ tests across $23 - 2 = 21$ suites. Both counts are completely consistent.

4. **Invariant 4: `tests/art-backdrop.test.ts:50-66`**:
   - The test specifically inspects five target files using `node:fs`:
     - `src/app/page.tsx`
     - `src/app/cards/page.tsx`
     - `src/app/cards/new/page.tsx`
     - `src/app/review/page.tsx`
     - `src/app/integrations/page.tsx`
   - It asserts `expect(content).toContain('JapaneseArtBackdrop')` and checks `public/assets/art` for 13 semantic assets ($>10\text{KB}$) and $\ge 26$ total files.

5. **TypeScript Check Status & Configuration (`tsconfig.json:1-28`)**:
   - Running `npx tsc --noEmit` exited with code `0` and **0 errors**.
   - `tsconfig.json` enforces `strict: true`, `target: "ES2022"`, `moduleResolution: "bundler"`, and paths `@/* -> ./src/*`.

6. **Authoritative Multimodal Manifest Data (`data/multimodal-manifest.json:1-14`)**:
   - Total assets: 688 items.
   - 8 categories: `kanji`: 111, `vocab_audio`: 322, `illustration`: 136, `grammar_infographic`: 5, `ielts_audio`: 53, `immersion_clip`: 19, `jlpt_choukai`: 9, `pubmed_corpus`: 33.
   - Assets possess `key`, `category`, `fileName`, `mimeType`, `fileId`, `driveUrl`, `cdnUrl` (`https://lh3.googleusercontent.com/d/{fileId}`), `sizeBytes`.

7. **Domain Skills Inspected**:
   - `d:\project\japanese-srs-system\.agents\skills\japanese-srs-qa-engineer\SKILL.md`: Testing pyramid, monotonic FSRS math invariants, deterministic tests, edge-case checklist (EC-01 to EC-06), RCA bug template.
   - `d:\project\japanese-srs-system\.agents\skills\japanese-srs-uiux-auditor\SKILL.md`: Fourfold defect taxonomy (Thừa, Thiếu, Sai, Lỗi hiển thị), Cognitive Load Theory, Hick's Law, Fitts's Law, Nippon Colors, Shippori Mincho typography.

---

## 2. Logic Chain

1. **Test Environment Constraints**:
   - *Observation 1 & 2*: Vitest runs in Node.js mode (`environment: 'node'`) without `@testing-library/react` or `jsdom`.
   - *Deduction*: Any new test suite for `/demo/drive` must not attempt to mount React components using `@testing-library/react`. Instead, tests must follow the project's proven paradigm:
     - Testing backend API route handlers (`GET(new Request(...))`) directly.
     - Testing client-side state hooks, controllers, and utility algorithms in isolation.
     - Testing UI invariants via static source file inspection (`node:fs`) and mock globals (e.g. `(global as any).Audio`).

2. **Invariant Preservation**:
   - *Observation 4*: Invariant 4 (`tests/art-backdrop.test.ts`) strictly requires `<JapaneseArtBackdrop />` in `src/app/review/page.tsx` and 4 other core pages.
   - *Deduction*: Creating `/demo/drive` in `src/app/demo/drive/page.tsx` will not break `tests/art-backdrop.test.ts` as long as the 5 existing pages are untouched. Furthermore, `/demo/drive` should incorporate authentic Wa-Style styling and `<JapaneseArtBackdrop />` for system-wide aesthetic harmony.

3. **Zero Backend Regression**:
   - *Observation 3 & 5*: All 23 test suites (139 tests) and `tsc --noEmit` pass 100%. The Turso DB schema currently has 676 cards.
   - *Deduction*: The `/demo/drive` showcase must rely entirely on `data/multimodal-manifest.json`, `GoogleDriveService`, and `/api/media` without executing any Drizzle schema changes or Turso migrations (Commandment 1 & Invariant 4).

4. **E2E 4-Tier Test Architecture Formulation**:
   - *Observation 6 & 7*: The multimodal manifest contains 688 assets across 8 categories.
   - *Deduction*: The testing plan for `/demo/drive` requires a comprehensive 4-tier matrix:
     - **Tier 1 (Core Features)**: $\ge 5$ test cases per feature covering Manifest Loading, Media Player/Audio Inspector, Category Pills, Debounced Search, and Wa-Style Tokens.
     - **Tier 2 (Boundary/Corner)**: Fault injection for missing manifest, regex queries, malformed metadata, and audio error handling.
     - **Tier 3 (Combinations)**: Category + Search cross-filtering, rapid category switching with pending debounce, audio cleanup on category swap, Lightbox keyboard shortcuts.
     - **Tier 4 (Real-World & Performance)**: Offline cache resiliency, sub-50ms search benchmark across 688 items, CDN latency simulation, and WCAG 2.1 AA contrast verification.

---

## 3. Caveats

1. **Browser Media Rendering in Node vs Real Browser**:
   - In Vitest's Node.js environment, actual SVG rasterization and audio decoding cannot be checked by pixel/sound comparison; tests verify DOM markup, SVG path strings, audio player state transitions, and event handlers. Real browser visual checks will require browser-level verification or Lighthouse CI.
2. **Google Drive API Quotas & Credentials**:
   - Unit tests must not perform live Google Drive API requests or live HTTP requests to `https://lh3.googleusercontent.com/d/{fileId}` to avoid network latency and quota limits. Tests must use regex contract validation and in-memory mocks.

---

## 4. Conclusion

The testing infrastructure of `japanese-srs-system` is extraordinarily fast, robust, and mature:
- **139 tests across 23 test suites pass 100% in ~5.44s**.
- **TypeScript compiles with 0 errors**.
- **Invariant 4 (`JapaneseArtBackdrop`) and database invariants are fully protected**.
- A comprehensive **4-Tier E2E Testing Plan** for `/demo/drive` has been fully designed and documented in `analysis.md`, partitioned into three specialized test suites:
  1. `tests/drive-showcase-api.test.ts`
  2. `tests/drive-showcase-logic.test.ts`
  3. `tests/drive-showcase-ui-invariants.test.ts`

---

## 5. Verification Method

To independently verify all findings in this report, execute the following commands in PowerShell from the project root (`d:\project\japanese-srs-system`):

1. **Verify All Vitest Test Suites**:
   ```powershell
   npm test -- --run
   ```
   *Expected output*: `Test Files 23 passed (23)`, `Tests 139 passed (139)`, duration `< 8s`.

2. **Verify TypeScript Health**:
   ```powershell
   npx tsc --noEmit
   ```
   *Expected output*: Exits with code `0`, no output or errors.

3. **Verify Invariant 4 (`art-backdrop.test.ts`) specifically**:
   ```powershell
   npx vitest run tests/art-backdrop.test.ts
   ```
   *Expected output*: `1 passed`, `5 tests passed`.

4. **Verify Multimodal Media Test Suite**:
   ```powershell
   npx vitest run tests/multimodal-media.test.ts
   ```
   *Expected output*: `1 passed`, `15 tests passed`.

5. **Inspect Detailed Survey Report**:
   Inspect file: `d:\project\japanese-srs-system\.agents\teamwork\explorer_survey_3\analysis.md`.

*Invalidation Condition*: If any existing test fails, if `npx tsc --noEmit` produces errors, or if `src/db/schema.ts` is altered, this survey baseline is invalidated.
