---
name: japanese-srs-uiux-auditor
description: Elite UI/UX Auditor and Heuristic Evaluation Specialist skill for conducting forensic, pixel-perfect audits of Japanese EdTech and Spaced Repetition interfaces. Identifies redundant, missing, incorrect, and broken visual rendering elements across WCAG 2.1 AA accessibility, Cognitive Load Theory, Wa-Style cultural authenticity, and 60fps rendering performance. Use whenever auditing, benchmarking, or writing defect catalogs for web and mobile interfaces.
---

# 🔍 Japanese SRS UI/UX Auditor Skill (意匠監査・欠陥診断)

This skill empowers AI agents to operate as an elite **UI/UX Forensic Auditor & Cognitive Ergonomics Specialist**, conducting comprehensive, multi-dimensional defect discovery across Japanese learning systems, FSRS workflows, and dual-cultural design systems.

---

## 1. THE FOURFOLD DEFECT TAXONOMY (TỨ DIỆN PHÂN LOẠI LỖI UI/UX)

Every visual or interactive defect must be classified into one of four orthogonal categories:

### 1.1. Thừa (Superfluous / Redundant / Visual Bloat)
- **Definition**: Elements, tokens, decorative layers, or text that add cognitive noise without providing pedagogical or communicative value.
- **Examples**:
  - Duplicate navigation bars or multiple conflicting CTA buttons on a single viewport.
  - Repetitive text where an example sentence duplicates the front prompt.
  - Overuse of competing backgrounds (e.g. Wagara pattern + Poster illustration + Sakura particles + Ukiyo-e backdrop all active simultaneously with high opacity).
  - Visual artifacts left over from prior design iterations (unconnected badges, obsolete counters).

### 1.2. Thiếu (Missing / Deficient / Interactive Gaps)
- **Definition**: Essential states, feedback cues, affordances, or navigational aids that are absent, leaving the user disoriented or uncertain.
- **Examples**:
  - Missing loading skeletons or empty states when a deck has zero cards.
  - Missing keyboard shortcut indicators (e.g. Space, 1-4, Enter) on primary review buttons.
  - Lack of auto-save draft persistence on long-form input sheets.
  - Missing ARIA labels (`aria-expanded`, `aria-label`, `aria-live`) on dynamic modals or floating buttons.
  - Missing pitch accent graphs or furigana ruby annotations for homonyms.

### 1.3. Sai (Incorrect / Culturally Inauthentic / Semantically Incoherent)
- **Definition**: Visual tokens, layout directions, typography pairings, or cultural symbols that violate design system invariants or linguistic conventions.
- **Examples**:
  - Applying Western corporate blue (`#0066CC`) or harsh neon red (`#FF0000`) instead of Nippon Colors (`#1B4268`, `#9E3223`).
  - Using sans-serif (`Inter`, `Roboto`) for classical calligraphy headers instead of `Shippori Mincho`.
  - Misaligned vertical text (`writing-mode: vertical-rl`) where Latin letters or numerals are rotated inappropriately.
  - Incorrect Japanese grammatical terminology or mistranslated UI labels.
  - Theme state leakage: English British styles polluting Japanese Wabi-Sabi screens.

### 1.4. Lỗi Hiển Thị & Hiệu Năng Giao Diện (Visual Glitches & Rendering Flaws)
- **Definition**: Broken CSS layout models, viewport overflow, z-index collisions, paint thrashing, or cumulative layout shift (CLS).
- **Examples**:
  - Floating Bottom Nav overlapping cards or blocking primary review action buttons on mobile screens.
  - Text truncation or clipping when Kanji characters or grammar patterns exceed container width.
  - Sticky header blurring artifacts or backdrop-filter dropouts on Safari / iOS WebKit.
  - High CPU/GPU usage (>30% frame drops) caused by continuous SVG particle animations without GPU composite layers.
  - Touch targets below 44x44px violating mobile ergonomics.

---

## 2. COGNITIVE & HEURISTIC EVALUATION FRAMEWORK

Auditors must ground every defect analysis in proven cognitive science and ergonomic laws:

1. **Sweller's Cognitive Load Theory**:
   - *Intrinsic Load*: Inherent difficulty of the Japanese Kanji/Grammar being learned.
   - *Germane Load*: Mental effort directed at schema construction (FSRS retrieval).
   - *Extraneous Load*: Mental waste caused by poor UI layout, cluttered visual noise, or ambiguous buttons. **Auditor Mandate: Extraneous load must be zero.**
2. **Hick's Law ($T = b \cdot \log_2(n + 1)$)**:
   - Decision time increases logarithmically with the number of choices. If a dashboard presents 12 unranked buttons, decision paralysis occurs.
3. **Fitts's Law**:
   - Target acquisition time is a function of distance and target size. Primary review buttons must be prominently sized and positioned within thumb reach on mobile.
4. **Miller's Law ($7 \pm 2$)**:
   - Working memory capacity is strictly bounded. Cards must respect the Minimum Information Principle (Atomicity).
5. **Nielsen Norman 10 Usability Heuristics**:
   - Visibility of system status, Match between system and real world, User control and freedom, Consistency and standards, Error prevention, Recognition rather than recall, Flexibility and efficiency, Aesthetic and minimalist design, Help users recognize/recover from errors, Help and documentation.

---

## 3. AUDIT DEFECT SPECIFICATION STANDARD

Every defect entry must adhere to this structured format:

```markdown
### [DEF-UI-SCREEN-XXX]: Short Descriptive Title of Defect
- **Vị trí / Mã nguồn**: `src/.../Component.tsx:L123-L145` (Selector: `.class-name`)
- **Phân loại khiếm khuyết**: Thừa | Thiếu | Sai | Lỗi hiển thị
- **Mức độ nghiêm trọng**: P0 (Blocker) | P1 (High) | P2 (Medium) | P3 (Low)
- **Mô tả hiện trạng (As-Is)**: Mô tả chính xác giao diện đang hiển thị cái gì, bằng chứng code.
- **Kỳ vọng chuẩn mực (To-Be)**: Giao diện phải hiển thị như thế nào theo chuẩn thiết kế.
- **Lý do & Tác động nhận thức**: Giải thích sâu sắc nguyên nhân gây hại (tải nhận thức, mỏi mắt, thao tác nhầm, vỡ thẩm mỹ văn hóa).
- **Giải pháp kỹ thuật (Remediation)**: Đoạn mã TSX/CSS đề xuất khắc phục cụ thể, bảo toàn Zero Backend Regression.
```
