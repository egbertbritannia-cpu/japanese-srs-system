# Phase 10 Component Recovery — Audit & Merge Plan

> Status: **DRAFT REVIEW ONLY — DO NOT MERGE TO MAIN WITHOUT USER DECISION**
>
> Recovery branch: `recovery/phase10-components-review`
>
> Baseline: current `main` after PR #5 (`c6aae475...`)
>
> Historical source inspected: `a4af9296169132cedf2925a79167e8b790dc74b5`
>
> Goal: recover every non-Add-Card UI/integration element removed during PR #5, make it inspectable without destabilizing the canonical review path, audit its correctness, then let the user decide **KEEP / REDESIGN / DROP**.

---

## 1. Forensic finding: what actually existed in Git

PR #5 removed integration code from `src/app/review/page.tsx` and `src/app/layout.tsx` while restoring a known-green baseline.

The historical commit `a4af9296...` referenced the following modules:

- `src/components/dobai/DoBaiHotkeysBar.tsx`
- `src/components/dobai/DoBaiModeSelector.tsx`
- `src/components/dobai/DoBaiUnlearnedDrawer.tsx`
- `src/components/theme/MikazukiThemeToggle.tsx`
- `src/core/curriculum/jpd133-manifest.ts`
- `src/core/curriculum/soft-link-engine.ts`
- `src/app/curriculum/jpd133/...`
- `src/app/demo/drive/page.tsx`

Git history for each of those paths is empty: **the referenced files were never committed to the repository before PR #5**. Therefore they cannot be restored byte-for-byte from Git.

The recoverable historical material is the integration contract and UI behavior embedded in `a4af9296...` plus the Phase 10/Phase 9 planning documents.

Important context: `planning/10_PHASE_10_DO_BAI_MINNA_LEARNING_SYSTEM_MIGRATION_PLAN.md` explicitly marked Phase 10 as **PLANNING PHASE / Zero Code Execution**. The `a4af9296...` implementation therefore represented an incomplete implementation landing without its referenced modules.

---

## 2. Recovery strategy used on this branch

To avoid repeating PR #5's mistake in the opposite direction, the canonical `/review` page is **not replaced**.

Recovered Dò Bài/JPD133 behavior is isolated at:

- `/review/dobai`
- `/curriculum/jpd133`
- `/curriculum/jpd133/[slot]`

The shell candidates are restored at their historical locations:

- JPD133 navigation
- Kho Media navigation
- Mikazuki theme toggle

The media destination is restored as a read-only view backed by the existing `MultimodalMediaService`.

This branch is intentionally a **review surface**, not a product decision.

---

## 3. Recovered candidate inventory

| Candidate | Recovery status | Historical evidence | Current risk | Decision |
|---|---|---|---|---|
| Dò Bài Minna main experience | Recovered under `/review/dobai` | Integration code in `a4af9296...`, Phase 10 plan | High | REVIEW |
| Forward / Reverse direction | Reconstructed component | Props/usages in historical review code | Low | REVIEW |
| Hotkeys bar | Reconstructed component | Props/usages + Phase 10 hotkey spec | Medium | REVIEW |
| D-E-F unlearned drawer | Reconstructed component | Historical state/usages + Phase 10 retry queue | Medium | REVIEW |
| Learned / Unlearned latency grading | Historical behavior recovered | Phase 10 plan + historical review code | High | REVIEW |
| JPD133 slot selector | Recovered | Historical review code | High | REVIEW |
| JPD133 manifest | Reconstructed from committed dataset | Missing historical module; `data/jpd133_vocab.json` exists | High | REVIEW/REDESIGN |
| JPD133 soft-link engine | Reconstructed conservatively | Missing historical module; historical call contract exists | Medium | REVIEW |
| JPD133 curriculum pages | Reconstructed | Historical links existed but routes did not | Medium | REVIEW |
| Kho Media nav + page | Reconstructed | Historical nav link; existing media service/API | Low | REVIEW |
| Mikazuki Sumi-e Night toggle | Reconstructed | Historical import/link + existing dark CSS tokens | Low | REVIEW |
| User-facing Add Card | **Not recovered** | Explicitly decommissioned by user | N/A | DROP |

---

## 4. Audit findings

### P0 — must resolve before integrating Dò Bài into canonical `/review`

#### REC-P0-01 — Historical JPD133 manifest had no committed source of truth
The old review page imported `jpd133-manifest`, but that file never existed in Git.

The recovery implementation maps Phase 10 slot number N to `data/jpd133_vocab.json.page === N` because `page` is the only durable numeric source field in the committed dataset. This is deterministic but **provisional**, not proof that page == curriculum slot.

**Required decision:** validate slot mapping against the original JPD133 source before production merge.

#### REC-P0-02 — Synthetic manifest IDs must never enter FSRS
Historical code fell back to `item.id` when no DB card matched. With the canonical ReviewService this would produce `CARD_NOT_FOUND`, and an offline fallback could remain permanently unsyncable.

Recovery hardening: only soft-linked items with a real `dbCardId` enter the FSRS review queue. Unmatched rows remain visible in curriculum views.

**Invariant:** FSRS review events always reference persisted card IDs.

#### REC-P0-03 — Undo is UI-only, not a true persisted FSRS undo
Historical `handleUndo` rewinds local UI/session counters but does not reverse the already committed review event/card snapshot.

Calling this “Hoàn tác FSRS” is misleading and can diverge UI from persisted state.

**Required redesign options:**
1. remove Undo for persisted reviews;
2. implement an explicit compensating/replay model;
3. delay persistence until a short undo window closes.

Do not merge the current semantic into canonical review without choosing one.

#### REC-P0-04 — Online/offline event identity
Historical online review requests did not send a stable event ID. A response-loss path could apply server state and then enqueue a second review.

Recovery hardening: the candidate now creates one `eventId` before the request and reuses that same ID if it falls back to IndexedDB. `recordPendingReview` accepts the existing ID and timestamp.

**Invariant:** one user review action == one immutable event identity.

---

### P1 — redesign/behavior decisions

#### REC-P1-01 — “Only unlearned” filter state existed but did not filter the queue
Historical code toggled `filterOnlyUnlearned` but never used it to derive the displayed/study queue.

**Decision:** implement real filtering or remove the control.

#### REC-P1-02 — Mobile drawer open state was unreachable
Historical code created `showUnlearnedDrawerMobile` and a close callback, but never set it to `true`.

**Decision:** add a mobile queue trigger or redesign the drawer responsively.

#### REC-P1-03 — Latency -> FSRS grade is a product algorithm, not neutral UI
Historical behavior maps:
- < 1.5s -> Easy
- 1.5s–6s -> Good
- > 6s -> Hard
- Unlearned -> Again

This is explicitly described in Phase 10, but it changes the user's grade based on latency. It must be treated as a learning-policy decision and tested separately from canonical FSRS scheduling.

**Decision:** KEEP / recalibrate / make optional / remove auto-grading.

#### REC-P1-04 — Interleaving modifies the in-session queue
Unlearned cards are inserted approximately two turns later. This is client session behavior and can increase total queue length.

**Decision:** define completion semantics and prevent accidental infinite retry loops.

#### REC-P1-05 — JPD133 soft-link ambiguity
Recovery matching uses normalized `front + reading`; it falls back to `front` only when exactly one DB card has that front.

This is safer than arbitrary first-match behavior, but unmatched/ambiguous counts need visible diagnostics before production cutover.

---

### P2 — shell/UI review

#### REC-P2-01 — Mikazuki theme toggle
The repository already contains dark-theme CSS tokens under `:root[data-theme="dark"]`. The reconstructed toggle only persists and applies that existing theme.

Low architectural risk; needs visual/accessibility review.

#### REC-P2-02 — Kho Media
The old navbar linked to `/demo/drive` although the route did not exist. The recovery page is read-only and backed by the existing `MultimodalMediaService`.

Decision: keep as diagnostics/media library, move under integrations/admin, redesign, or drop from primary nav.

#### REC-P2-03 — Navigation density
Restoring JPD133 + Kho Media + theme toggle makes the desktop header denser and may worsen tablet/mobile layout.

Decision should be coordinated with the Phase 11 frontend architecture and later UI redesign, not solved by hiding functionality.

---

## 5. Merge plan — preserve everything first, decide product scope second

### Recovery PR (this branch)
Purpose: make all candidates inspectable and keep history explicit.

Acceptance:
- no Add Card restoration;
- canonical `/review` remains untouched;
- Dò Bài is isolated at `/review/dobai`;
- JPD133 and Media links resolve to real routes;
- no synthetic card ID reaches ReviewService;
- review event identity is preserved across online -> offline fallback;
- tests/build must pass before this PR is eligible for any merge.

### Proposed production PR sequence after user review

**PR-A — Low-risk shell candidates**
- Mikazuki theme toggle
- read-only Media destination
- navigation placement chosen by user

**PR-B — JPD133 data contract**
- validate authoritative slot mapping;
- freeze manifest schema;
- add unmatched/ambiguous soft-link diagnostics;
- tests for deterministic matching.

**PR-C — Dò Bài presentation**
- direction selector;
- hotkeys;
- retry drawer;
- responsive behavior;
- no scheduling/data-policy change yet.

**PR-D — Dò Bài learning semantics**
- user-approved latency grading policy;
- retry/interleaving semantics;
- completion rules;
- real decision on Undo.

**PR-E — Canonical integration**
- only after A-D decisions;
- integrate approved pieces into `/review` or keep Dò Bài as a separate route;
- run review/FSRS/offline regression suite;
- Vercel build + deployment check.

No production PR should reintroduce the old `a4af9296...` page wholesale.

---

## 6. User review checklist

For each candidate choose exactly one:

- **KEEP** — behavior is conceptually correct; polish/tests only.
- **REDESIGN** — preserve the user goal but change implementation/UX.
- **DROP** — remove from product and clean all references.

Candidates to decide:

1. Dò Bài as default review mode vs separate mode.
2. Forward / Reverse drill.
3. D-E-F retry queue.
4. Latency auto-grading.
5. Hotkeys.
6. Undo.
7. JPD133 slot navigation.
8. JPD133 slot-to-source mapping.
9. Kho Media placement.
10. Mikazuki dark mode.
11. Whether JPD133 and Media belong in primary header navigation.

---

## 7. Non-negotiable invariants during recovery

1. Add Card remains decommissioned.
2. Canonical ReviewService remains the only server-side FSRS mutation authority.
3. Client `scheduledDays` is preview-only and never authoritative.
4. Every persisted review uses a stable event ID.
5. No synthetic curriculum ID is persisted as a review card ID.
6. No DB schema/migration change in component recovery.
7. Do not merge this recovery branch to `main` until the user has reviewed the candidate matrix.
