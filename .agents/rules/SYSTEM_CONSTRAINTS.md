# 🛡️ WORKSPACE RULE: SYSTEM CONSTRAINTS & ZERO REGRESSION ENFORCEMENT
> **Scope:** Entire Workspace (`d:\project\japanese-srs-system`)  
> **Target Audience:** All AI Agents, Coding Subagents, LLM Planners  
> **Status:** STRICTLY ENFORCED (Luật bất biến)

---

## 1. Zero Backend Regression (Database Schema Protection)
- DO NOT modify `src/db/schema.ts` under any circumstances unless explicitly asked.
- DO NOT generate or run new Turso database migrations.
- DO NOT delete or overwrite existing records in Turso Cloud LibSQL (676 existing cards).
- Use client-side session states (`unlearnedList`, `sessionStorage`, Dexie.js IndexedDB) for all in-session retry queues.

## 2. Planning vs. Execution Gating
- When the user is in planning, reviewing design sketches, or asking questions: DO NOT execute edits to source code files.
- Confine all documentation to `planning/*.md` and `doc/*.md`.
- Wait for explicit user authorization ("thực thi", "bắt đầu code") before touching application code.

## 3. Cognitive Science & FSRS Algorithm Preservation
- Preserve 100% of FSRS v4.5 mathematical modeling (`ts-fsrs`, Web Worker `useFsrsScheduler`).
- Preserve Bjork Retrieval Latency Dynamics: record $\Delta t = t_{\text{reveal}} - t_{\text{draw}}$ and send `responseTimeMs` to backend.
- Automatically map reflex actions to FSRS grades:
  - "Đã thuộc" with $\Delta t < 1.5$s $\rightarrow$ `Easy` (Grade 4)
  - "Đã thuộc" with $1.5$s $\le \Delta t \le 6.0$s $\rightarrow$ `Good` (Grade 3)
  - "Đã thuộc" with $\Delta t > 6.0$s $\rightarrow$ `Hard` (Grade 2)
  - "Chưa thuộc" $\rightarrow$ `Again` (Grade 1) + In-session re-queue (Cột D-E-F).
- Preserve Tokyo Pitch Accent graphs (`PitchAccentGraph`).
- Preserve Cloze deletion syntax `{{c1::...}}` and context sentences ($i+1$).

## 4. Test Suite Invariants (100% Pass)
- All 21 Vitest test suites (111 tests) must remain green.
- `src/app/review/page.tsx` MUST retain `<JapaneseArtBackdrop ... />` as mandated by `tests/art-backdrop.test.ts`.
- `npx tsc --noEmit` must pass with 0 errors.

## 5. Offline-First & SRE Stability
- Use Dexie.js IndexedDB local queue for offline reviews (`recordPendingReview`).
- Zero blocking network calls on the main thread.

## 6. Wa-Style Japanese Aesthetics
- Use traditional Nippon Colors (Bengara, Shu-iro, Matcha, Koke, Aizome, Kincha, Washi-iro).
- Use `Shippori Mincho` for Kanji and `Zen Maru Gothic` for Kana.
