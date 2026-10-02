---
name: japanese-srs-deck-orchestrator
description: Professional domain skill for orchestrating Japanese SRS deck-based study workflows, queue scheduling algorithms, cognitive deck segregation, URL-first session state management, and traditional Wa-style deck UI interactions with zero-regression backend safety. Use whenever designing, planning, or implementing deck-specific study features, deck selection interfaces, or FSRS queue prioritization.
---

# 🎴 Japanese SRS Deck Orchestrator Skill (札束編成・学習統括)

This skill equips AI agents with elite-level pedagogical intelligence, cognitive psychology principles, and technical rigor required to architect, coordinate, and implement **Deck-Based Study Workflows** in a Japanese Spaced Repetition System (FSRS).

---

## 1. PEDAGOGICAL & COGNITIVE PHILOSOPHY (TRIẾT LÝ NHẬN THỨC)

### 1.1. The Principle of Cognitive Segregation (Phân tách Nhận thức Chuyên biệt)
- **Why Deck-Based Study Matters**: 
  Mixing different cognitive domains (e.g., pure Kanji ideographic recognition vs. conversational vocabulary recall vs. grammar clozes) within a completely random stream increases **Retroactive Cognitive Interference** (Sự can thiệp hồi tố). 
  - **Kanji Decks (`deck_jpd133_kanji`)**: Engage visual-orthographic decoding, stroke radicals, and Sino-Vietnamese (Hán-Việt) etymology.
  - **Vocabulary Decks (`deck_jpd133_vocab`)**: Engage phonological loop, Tokyo pitch accent contours, semantic context sentences ($i+1$), and colloquial nuances.
- **The Dual-Mode Imperative**:
  1. **Deck-Focused Mode (単元集中学習)**: Allows the learner to enter a focused flow state targeting a specific learning syllabus (e.g., studying only Kanji before a kanji quiz, or mastering Kotoba before oral drill).
  2. **Global Random/Consolidated Mode (無差別総復習)**: Randomly interweaves all due cards across all decks for advanced long-term retention testing (Interleaving Effect).
  *Rule: The system must effortlessly empower the learner to switch between these two modes with zero cognitive friction.*

### 1.2. Cognitive Load Capping & Daily Pacing (Kiểm soát Tải nhận thức)
- Never overwhelm the learner with an unbounded session.
- When studying a specific deck:
  - Default daily new card cap: **10 - 20 new cards** per deck.
  - Review queue priority: **Due Review Cards > Overdue Relearning > New Cards**.
  - In Cramming / Free Study mode: Explicitly label that "Thao tác ôn tập tự do không làm xáo trộn khoảng cách FSRS tiêu chuẩn".

---

## 2. SYSTEM ARCHITECTURE & DATA FLOW CONTRACTS (KIẾN TRÚC KỸ THUẬT)

### 2.1. URL-First Session State Engine (Trạng thái Định tuyến Hướng URL)
To guarantee deep-linkability, browser refresh resilience, and seamless Next.js App Router hydration:
- All deck review sessions MUST be driven by URL search parameters:
  - `/review?deck=deck_jpd133_kanji` $\rightarrow$ Study only Kanji deck.
  - `/review?deck=deck_jpd133_vocab` $\rightarrow$ Study only Vocabulary deck.
  - `/review?deck=all` (or `/review`) $\rightarrow$ Global mixed random study.
  - Optional mode modifiers: `&mode=due` (FSRS due cards only) or `&mode=cram` (Review all cards regardless of due date).
- **Client Hydration Guard**:
  When using Next.js `useSearchParams()` in client components (`'use client'`), always wrap the component or the page boundary inside `<Suspense fallback={<WashiLoadingSkeleton />}>` to eliminate client-side de-opt warnings during static generation (`npm run build`).

### 2.2. Zero-Backend-Touch Contract (Bảo toàn Kiến trúc Dữ liệu Hiện hữu)
- **Database Schema Invariance**:
  - The SQLite/Turso tables (`decks`, `cards`, `review_logs` in `src/db/schema.ts`) ALREADY contain `deckId` as a foreign key (`cards.deck_id -> decks.id`).
  - **NEVER** alter column names, types, or relationships in `src/db/schema.ts`.
- **API Route Backward Compatibility**:
  - `GET /api/cards?deck={deckId}` already filters cards by deck.
  - `POST /api/review` accepts `{ cardId, rating }`.
  - Any enhancement to query params must maintain fallback defaults (e.g., if `?deck=` is omitted or set to `all`, return cards across all decks).

### 2.3. Resilient Queue Resolution Strategy (Chiến lược Lập Hàng đợi)
When preparing a session queue for deck $D$:
```
Queue(D) = [
  ...Cards(D) where due <= NOW (sorted by due ASC - most overdue first),
  ...Cards(D) where state == 'New' (limited to MAX_NEW_PER_SESSION, default 15)
]
```
If `Queue(D).length === 0`:
- **Do NOT crash or display a blank screen**.
- Trigger the **Zen Empty/Completed State**:
  - Render an artistic Washi card with Daruma mascot smiling (`progressPercentage = 100`).
  - Display congratulatory message: *"Bạn đã hoàn thành toàn bộ thẻ cần ôn hôm nay của bộ thẻ này!"*.
  - Offer 2 primary actions:
    1. `[Ôn luyện tự do (Cram Mode)]`: Review all cards in this deck regardless of due date.
    2. `[Chuyển sang bộ thẻ khác]`: Quick drawer/modal to pick another deck or study All.

---

## 3. JAPANESE WA-STYLE UI SPECIFICATIONS FOR DECKS (MỸ HỌC BỘ THẺ)

### 3.1. Visual Metaphor: Kifuda Wooden Tablets & Karuta Stacks (木札と歌留多束)
Each deck is represented as an authentic Japanese wooden votive plaque / library tablet (*Kifuda* - 木札):

| Deck Entity | Traditional Japanese Color Code | Inkan Seal (Dấu son) | Wagara Motif | Cultural Metaphor |
| :--- | :--- | :--- | :--- | :--- |
| **Kanji Deck** (`deck_jpd133_kanji`) | Torii Vermilion (`#D9381E` / `var(--torii-subtle)`) | `漢` (Hán) | Asanoha (Lá gai) | Tượng hình, vững chãi, cội nguồn văn tự |
| **Vocab Deck** (`deck_jpd133_vocab`) | Matcha Green (`#88A752` / `var(--matcha-subtle)`) | `語` (Ngữ) | Seigaiha (Sóng biếc) | Dòng chảy hội thoại, âm điệu Tokyo |
| **All Decks / Global Mix** (`all`) | Yamabuki Gold (`#F59E0B` / `var(--yamabuki-light)`) | `総` (Tổng) | Yagasuri (Lông tên) | Tiến bộ toàn diện, mũi tên tri thức |

### 3.2. Deck Selector Anatomy on Dashboard & Review Screens
1. **Deck Badge & Title**:
   - Calligraphic Japanese subtitle (`短冊 · JPD133 漢字`).
   - Card counts divided into semantic pills:
     - 🔴 Cần ôn (`due`): Số thẻ đến hạn (Torii Red).
     - 🟢 Mới (`new`): Số thẻ chưa học (Matcha Green).
     - ⚪ Tổng (`total`): Tổng số thẻ trong bộ.
2. **Direct Action Button**:
   - `[🎴 Ôn tập bộ này]`: Navigates directly to `/review?deck=${deck.id}`.
   - Micro-interaction: Subtle hover lift (`translateY(-2px)`), warm shadow glow (`0 6px 20px rgba(136, 167, 82, 0.25)`).
3. **In-Session Deck Switcher**:
   - Located at the top navigation bar of `/review`:
     - Displays: `[🌸 Đang học: JPD133 - Hán Tự ▾]`.
     - Clicking it drops down a quick selector menu without needing to leave the review page.

---

## 4. EDGE CASE & FAULT TOLERANCE PROTOCOLS (XỬ LÝ TÌNH HUỐNG NGOẠI LỆ)

| Scenario / Edge Case | Failure Mode | Orchestrator Mitigation Standard |
| :--- | :--- | :--- |
| **Invalid Deck ID in URL** (`/review?deck=unknown_123`) | Page crash or 404 | Gracefully fallback to `deck=all`. Display a temporary subtle toast: *"Không tìm thấy bộ thẻ yêu cầu, đã tự động chuyển sang chế độ Ôn tập Toàn bộ"*. |
| **Empty Deck (0 cards total)** | Infinite loading or blank card | Display empty state with calligraphic calligraphy: *"Bộ thẻ này hiện chưa có thẻ nào"*. Provide immediate CTA `[+ Nhờ AI soạn thẻ cho bộ này]` redirecting to `/cards/new?deck=${deckId}`. |
| **Zero Due Cards (`due > now`)** | User cannot practice | Show "Mục tiêu đã hoàn tất" screen with option to initiate *Cramming Session* (Ôn tập củng cố không ảnh hưởng chỉ số FSRS). |
| **Network Timeout to Turso** | Stuck review card | Cache the currently loaded deck cards in client memory (`sessionStorage`). Allow the user to continue grading; queue review logs in `indexedDB`/`localStorage` and retry POST `/api/review` on reconnect. |
| **Switching Deck mid-session** | State corruption | Prompt learner with lightweight modal: *"Bạn có muốn lưu tiến độ của bộ thẻ hiện tại trước khi chuyển sang bộ thẻ mới?"*. Reset `currentIdx` to 1 upon deck switch. |

---

## 5. AGENT VERIFICATION & ACCEPTANCE RUNBOOK (QUY TRÌNH THẨM ĐỊNH)

When planning or evaluating implementations under this skill, the agent must verify:
1. **Type Cleanliness**: `npx tsc --noEmit` must pass with 0 errors (ensuring Next.js `searchParams` typing is compliant).
2. **Deterministic Routing**:
   - Visiting `/review?deck=deck_jpd133_kanji` loads strictly Kanji cards.
   - Visiting `/review?deck=deck_jpd133_vocab` loads strictly Vocabulary cards.
   - Visiting `/review` or `/review?deck=all` loads cards from both decks.
3. **Audio & Pitch Alignment**: Audio effects and Pitch Accent graphs function accurately regardless of which deck is active.
4. **Backend Invariance**: Zero modifications to SQLite/Turso table structures or native driver bindings.
