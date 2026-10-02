---
name: japanese-srs-craftsman
description: Master skill for building, redesigning, and maintaining Japanese learning applications with authentic Wa-style (和風) aesthetics, FSRS cognitive spaced repetition, atomic learning principles, and zero-regression backend safety. Use whenever working on Japanese UI, SRS algorithms, Wagara patterns, or Japanese educational workflows.
---

# 🌸 Japanese SRS Craftsman Skill (和風・記憶道)

This skill empowers AI agents to operate at the highest level of craftsmanship, intelligence, and professional rigor when engineering Japanese learning applications, spaced repetition systems (FSRS), and Japanese cultural user interfaces.

---

## 1. CORE OPERATIONAL PRINCIPLES (TRIẾT LÝ VẬN HÀNH)

### A. The Principle of Authentic Craftsmanship (Mỹ học Thủ công Wa-Style)
- **Never settle for generic, drab, or utilitarian UI**: Infuse every screen with the soul of Japanese visual culture (Wabi-Sabi, Zen tranquility, Hyakunin Isshu poetry cards, Shodo calligraphy, and handcrafted Washi paper textures).
- **Luminous Traditional Palette (Nippon Colors)**:
  - Base: Warm Washi Paper (`#FAF8F5`, `#FCFBF9`) — eliminates sterile clinical white and harsh black `#000000`.
  - Primary Accents: Matcha Green (`#88A752`, `#708D3E`), Torii Vermilion (`#D9381E`), Sakura Pink (`#F472B6`), Yamabuki Gold (`#F59E0B`), Sumi Ink (`#1F2421`).
- **Retina-Sharp Wagara Patterns**: Implement seamless geometric patterns (Seigaiha waves, Asanoha hemp leaves, Yagasuri arrow feathers) exclusively as lightweight vector inline SVG Data URIs. Zero external network requests, zero layout shift.

### B. Cognitive Science & Pedagogical Precision (Khoa học Nhận thức)
- **FSRS (Free Spaced Repetition Scheduler)**: Maintain the integrity of the DSR cognitive model (Difficulty, Stability, Retrievability). Never bypass interval calculations.
- **Atomicity (Minimum Information Principle)**: 1 card must test exactly 1 unit of knowledge. If a word has multiple distinct derivations, guide or enforce automated decomposition.
- **Dual Coding & Contextual i+1**: Pair textual kanji with audio, furigana ruby markup, pitch accent contours, and comprehensible context sentences ($i+1$).

### C. Zero-Backend-Touch Contract (Bảo toàn Kiến trúc Backend)
- **Strict Boundary**: Frontend enhancements, aesthetic restyling, and micro-interactions must NEVER alter:
  - Database schemas (`src/db/schema.ts`, Drizzle ORM).
  - API route contracts (`src/app/api/**/route.ts`).
  - Core scheduling algorithms (`src/core/scheduler/fsrs-engine.ts`).
- **Preserve All Data Flow**: Keep request/response payloads, field names, IDs, and event handlers 100% intact.

---

## 2. JAPANESE DESIGN SYSTEM IMPLEMENTATION GUIDE

### 2.1. Vector Wagara Pattern Formulas
When applying Japanese patterns, use these exact CSS definitions:

```css
/* Seigaiha (青海波 - Waves): Resilient learning */
.wagara-seigaiha-matcha {
  background-color: #88a752;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='32' viewBox='0 0 64 32'%3E%3Cpath d='M0 32 A32 32 0 0 1 64 32 M6 32 A26 26 0 0 1 58 32 M12 32 A20 20 0 0 1 52 32 M18 32 A14 14 0 0 1 46 32 M24 32 A8 8 0 0 1 40 32 M-32 16 A32 32 0 0 1 32 16 M-26 16 A26 26 0 0 1 26 16 M-20 16 A20 20 0 0 1 20 16 M-14 16 A14 14 0 0 1 14 16 M-8 16 A8 8 0 0 1 8 16 M32 16 A32 32 0 0 1 96 16 M38 16 A26 26 0 0 1 90 16 M44 16 A20 20 0 0 1 84 16 M50 16 A14 14 0 0 1 78 16 M56 16 A8 8 0 0 1 72 16 M0 0 A32 32 0 0 1 64 0 M6 0 A26 26 0 0 1 58 0 M12 0 A20 20 0 0 1 52 0 M18 0 A14 14 0 0 1 46 0 M24 0 A8 8 0 0 1 40 0' fill='none' stroke='%23ffffff' stroke-width='2.2' stroke-linecap='round'/%3E%3C/svg%3E");
  background-size: 64px 32px;
}

/* Yagasuri (矢絣 - Arrow Feathers): Progress bars */
.wagara-yagasuri {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M0 0 L20 20 L40 0 L40 20 L20 40 L0 20 Z' fill='rgba(136, 167, 82, 0.25)'/%3E%3C/svg%3E");
  background-size: 20px 20px;
}
```

### 2.2. Typographic Hierarchy
1. **Headings & Main Kanji**: `Shippori Mincho` (`var(--font-mincho)`), font-weight 700-800, high contrast calligraphic rhythm.
2. **Subheadings, Badges, & Navigation**: `Zen Maru Gothic` (`var(--font-maru)`), font-weight 600-700, friendly rounded sans.
3. **Data, Stats & Numbers**: `Plus Jakarta Sans` (`var(--font-sans)`), font-weight 600-800.
4. **Ruby Markup**: Always use `<ruby>漢字<rt>かんじ</rt></ruby>` with `ruby-position: over;` for clean, professional furigana alignment.

### 2.3. Micro-Interactions & Animation Standards
- **Sakura Petal Drift**: Run on background canvas or absolute overlay with `pointer-events: none;`. Combine `translate3d` and `rotate3d` to maintain 60 FPS without GPU overdraw.
- **Inkan Hanko Stamp Bounce**:
  ```css
  @keyframes inkanStamp {
    0% { opacity: 0; transform: scale(2.6) rotate(-18deg); }
    50% { opacity: 0.95; transform: scale(0.92) rotate(-5deg); }
    75% { transform: scale(1.05) rotate(-7deg); }
    100% { opacity: 1; transform: scale(1) rotate(-6deg); }
  }
  ```
- **3D Karuta Card Flip**: Perspective container at `1200px` with `transform-style: preserve-3d;` and custom spring timing `cubic-bezier(0.34, 1.56, 0.64, 1)`.

---

## 3. AUTONOMOUS VERIFICATION RUNBOOK (QUY TRÌNH KIỂM ĐỊNH)

When making any change, execute these verification commands in sequence:

1. **TypeScript Type Safety Check**:
   ```bash
   npx tsc --noEmit
   ```
   *Pass criteria*: Zero errors. Verify Next.js App Router rules (e.g. no rogue exports from `layout.tsx`).

2. **Unit Test Suite**:
   ```bash
   npm run test
   ```
   *Pass criteria*: 100% tests in `tests/scheduler.test.ts`, `tests/constraints.test.ts`, etc. pass.

3. **Production Build Compilation**:
   ```bash
   npm run build
   ```
   *Pass criteria*: Next.js builds clean static and dynamic routes with zero hydration mismatch warnings.

---

## 4. AGENT DECISION FRAMEWORK (CẨM NANG XỬ LÝ TÌNH HUỐNG)

| Tình huống gặp phải | Cách xử lý thông minh & chuyên nghiệp |
| :--- | :--- |
| Cần hiển thị từ vựng tiếng Nhật phức tạp | Dùng thẻ `<ruby>` ngữ nghĩa, không dùng text trần trong ngoặc đơn nếu có Kanji. |
| Người dùng yêu cầu màu tối hoặc màu chói | Điều chỉnh sang màu Washi ấm (`#FAF8F5`) hoặc Sumi ink (`#1F2421`), giữ độ tương phản WCAG AAA. |
| Cần thêm tính năng mới ở giao diện | Kiểm tra xem API hiện có hỗ trợ không; nếu không, mock dữ liệu UI cục bộ trước, tuyệt đối không tự ý sửa database backend. |
| Có xung đột version thư viện npm | Sử dụng Pure React SVG components và CSS Keyframes nội tại, tránh kéo thêm thư viện bên ngoài không cần thiết. |
| Lồng ghép tranh nghệ thuật / họa tiết | Dùng `<JapaneseArtBackdrop />` với ảnh trong `public/assets/art/`, luôn bật `pointer-events: none`, opacity 0.15–0.35, và đối chiếu với `doc/11` & `doc/12`. |

---

## 5. AUTHENTIC WA-ART & CULTURAL COLLABORATION
The Craftsman collaborates with UI/UX Designer to realize the vision laid out in:
- `doc/11_JAPANESE_GRAPHIC_DESIGN_DECONSTRUCTION.md` (Design Principles & Classical Motifs)
- `doc/12_AUTHENTIC_WA_ART_REDESIGN_MASTER_PLAN.md` (5-Layer Master Implementation Plan)
- Component `src/components/art/JapaneseArtBackdrop.tsx` (Reusable zero-CLS, non-blocking image overlay)
- 13 Classical Artworks in `public/assets/art/` (Hokusai Ukiyo-e, Rinpa golden waves, Yuzen tapestries).

