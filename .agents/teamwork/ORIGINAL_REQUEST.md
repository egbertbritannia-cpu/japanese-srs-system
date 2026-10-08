# Original User Request

## 2026-10-07T01:03:54Z

Build an interactive, high-performance web showcase that fetches and renders multimodal assets stored on Google Drive (430+ assets across 8 categories from data/multimodal-manifest.json and GoogleDriveService), styled with authentic Wa-Style aesthetics.

Working directory: d:\project\japanese-srs-system
Integrity mode: development
Requested team: Full team (Architect, Frontend Specialist, QA Tester)

## Requirements

### R1. Multimodal Drive Assets Showcase Interface
Create a dedicated showcase view (/demo/drive or integrated within the application) that dynamically loads and displays the 430+ Google Drive assets categorized into 8 domains: Kanji Animated SVGs (111 items), Tokyo Native Audio (291 items), Irasutoya Master Illustrations (5 items), Grammar Infographics (5 items), Cambridge IELTS Audio (9 items), Immersion AV Clips (3 items), PubMed Corpus (4 items), and JLPT Choukai (2 items).

### R2. Interactive Media Player & Asset Inspector
Provide rich, instant media preview capabilities:
- For Kanji assets: Display and animate stroke order SVG vectors fetched via Drive Direct CDN (https://lh3.googleusercontent.com/d/{fileId}).
- For Audio assets: In-place audio playback with play/pause, waveform indicator, and latency feedback.
- For Illustrations & Infographics: Lightbox modal with zoom and high-resolution rendering.
- For each asset: Display metadata (Category, File ID, Direct CDN link, MIME type, file size).

### R3. Instant Filtering & Search Experience
Support responsive category filtering pills (Kanji, Vocab, Audio, Clips, etc.) and an instant search bar with debounced query matching across file names, Kanji characters, and asset keys with sub-50ms UI response.

### R4. Design Harmony & Zero-Backend-Regression
Adhere to the project's authentic Wa-Style aesthetic (Nippon Colors --bengara, --aizome, --kincha, and Washi paper texture). Maintain absolute Zero-Backend-Regression: do not modify existing Turso database schema, preserve all existing API routes, and ensure all 21 Vitest test suites (111 tests) remain 100% passing.

## Acceptance Criteria

### Visual & Media Rendering
- [ ] Route /demo/drive loads cleanly and displays assets organized by category cards or grid.
- [ ] Kanji SVG animations render visibly in the browser without broken image icons.
- [ ] Audio files stream and play successfully in the browser using the Drive CDN URLs.
- [ ] High-resolution images and infographics open in a responsive view without distortion.

### Interaction & Performance
- [ ] Switching categories filters the displayed assets immediately without full page reloads.
- [ ] Search input filters items by name/key in under 50ms.
- [ ] Mobile and desktop layouts are fully responsive (responsive grid / flex layout).

### System Invariants
- [ ] npm test -- --run passes 100% (21/21 suites, 111/111 tests).
- [ ] npx tsc --noEmit completes with 0 errors.
- [ ] No Turso Cloud database migrations or schema alterations are executed.
