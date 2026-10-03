---
name: japanese-srs-uiux-designer
description: Master UI/UX Designer and Authentic Wa-Style Design Architect skill for crafting breathtaking Japanese cultural aesthetics, Nippon Colors palettes, inline vector Wagara patterns, Shippori Mincho/Zen Maru typography, 60fps micro-interactions, 3D Karuta card flips, and WCAG AA accessible layouts. Use whenever designing, restyling, or refining UI components, design tokens, color systems, or Japanese cultural animations.
---

# 🎨 Japanese SRS UI/UX Designer Skill (和風意匠・美学設計)

This skill empowers AI agents to operate as a world-class **UI/UX Designer & Authentic Wa-Style (和風) Design Architect**, infusing modern cognitive EdTech applications with the soul, tranquility, and luminous craftsmanship of Japanese traditional art.

---

## 1. DESIGN PHILOSOPHY & ARTISTIC PRINCIPLES (TRIẾT LÝ MỸ HỌC WA-STYLE)

### 1.1. The Four Classical Pillars (Tứ Đại Trụ Cột Mỹ Học)
1. **Wabi-Sabi (侘寂 - Rustic Simplicity & Fleeting Beauty)**:
   - Celebrate natural imperfections: Handcrafted Washi paper textures, warm fiber grain, subtle organic card shadows.
   - Eliminate cold, sterile, clinical white (`#FFFFFF` in excess) and harsh synthetic neon shades.
2. **Ma (間 - The Space Between / Negative Space)**:
   - White space is not empty void; it is the "breath" of understanding. Allow generous padding around complex Kanji characters so their radicals (*Bushu*) can resonate without visual clutter.
3. **Kanso (簡素 - Eliminating the Trivial)**:
   - Every decorative element must have a functional purpose. An Inkan seal denotes verified status; an Asanoha pattern represents growth; a Torii arch represents entering a state of sacred learning focus.
4. **Shibui (渋い - Subtle, Understated Elegance)**:
   - High visual contrast where cognition demands it (Kanji stroke clarity), but surrounded by harmonious, calming pastel tones that reduce eye strain during extended daily SRS sessions.

---

## 2. NIPPON COLORS PALETTE & DESIGN TOKENS (BẢNG MÀU TRUYỀN THỐNG NHẬT BẢN)

All components must adhere strictly to these defined CSS custom properties:

```css
:root {
  /* NỀN GIẤY TRUYỀN THỐNG (WASHI PAPER FOUNDATION) */
  --washi-bg: #FAF8F5;          /* Giấy dó Washi truyền thống ấm áp */
  --washi-surface: #FFFFFF;     /* Mặt thẻ giấy Washi ép phẳng */
  --washi-border: #E8E4DC;      /* Viền sợi dó mộc mạc */
  --washi-border-soft: #F1EDE6; /* Viền ngăn cách nhẹ */

  /* MỰC TÀU THƯ PHÁP (SUMI INK & TEXT HIERARCHY) */
  --sumi-ink: #1F2421;          /* Mực tàu nguyên chất đậm đà (Tiêu đề, Kanji) */
  --sumi-charcoal: #374151;     /* Mực than mài vừa (Văn bản thân, nghĩa từ) */
  --sumi-faded: #6B7280;        /* Mực phai thanh nhã (Chú thích, Furigana) */

  /* MÀU ĐẶC TRƯNG VĂN HÓA (CULTURAL ACCENT PALETTE) */
  /* Trà đạo Matcha (Tăng cường tập trung, kiên trì, tối ưu FSRS) */
  --matcha-primary: #88A752;    /* Xanh lá Matcha tươi sáng chuẩn Seigaiha */
  --matcha-deep: #708D3E;       /* Xanh Matcha đậm đà */
  --matcha-subtle: #F3F7ED;     /* Nền phấn Matcha êm dịu */

  /* Cổng Torii Đền Thần Đạo (Khơi gợi quyết tâm, thử thách, điểm nhấn) */
  --torii-red: #D9381E;         /* Đỏ son Cổng Torii rực rỡ */
  --torii-deep: #B82C15;        /* Đỏ son đền thờ thâm trầm */
  --torii-subtle: #FDF2F0;      /* Nền phấn son ửng hồng */

  /* Hoa Anh Đào Sakura (Thanh tao, tươi vui, điểm xuyết giao diện) */
  --sakura-pink: #F472B6;       /* Hồng cánh hoa Sakura tươi thắm */
  --sakura-light: #FDF2F8;      /* Nền phấn hoa thoang thoảng */

  /* Vàng Sơn Trà Yamabuki (Sang trọng, trí tuệ, thành tựu học tập) */
  --yamabuki-amber: #D97706;    /* Vàng hổ phách hoa sơn trà */
  --yamabuki-light: #FEF3C7;    /* Nền phấn hoa mai vàng */

  /* Xanh Biếc Asagi (Trong trẻo, thanh tịnh, ngữ pháp) */
  --asagi-teal: #0D9488;        /* Xanh ngọc Asagi truyền thống */
  --asagi-light: #F0FDFA;       /* Nền sương sớm Asagi */

  /* HỆ THỐNG BÓNG ĐỔ TRUYỀN THỐNG (SHADOW TOKENS) */
  --shadow-karuta: 0 10px 30px -5px rgba(31, 36, 33, 0.08), 0 4px 12px -2px rgba(31, 36, 33, 0.04);
  --shadow-washi-md: 0 4px 16px -1px rgba(31, 36, 33, 0.06);
  --shadow-washi-sm: 0 2px 8px -1px rgba(31, 36, 33, 0.04);
}
```

---

## 3. INLINE VECTOR WAGARA PATTERNS (CÔNG THỨC HỌA TIẾT TRUYỀN THỐNG)

Always render patterns as **inline SVG Data URIs** in CSS to ensure zero HTTP network latency, instant rendering, and flawless sharpness on Retina/HiDPI screens:

```css
/* 1. Sóng Seigaiha (青海波): Biểu tượng của sự bền bỉ, học tập không ngừng */
.wagara-seigaiha-matcha {
  background-color: #88a752;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='32' viewBox='0 0 64 32'%3E%3Cpath d='M0 32 A32 32 0 0 1 64 32 M6 32 A26 26 0 0 1 58 32 M12 32 A20 20 0 0 1 52 32 M18 32 A14 14 0 0 1 46 32 M24 32 A8 8 0 0 1 40 32 M-32 16 A32 32 0 0 1 32 16 M-26 16 A26 26 0 0 1 26 16 M-20 16 A20 20 0 0 1 20 16 M-14 16 A14 14 0 0 1 14 16 M-8 16 A8 8 0 0 1 8 16 M32 16 A32 32 0 0 1 96 16 M38 16 A26 26 0 0 1 90 16 M44 16 A20 20 0 0 1 84 16 M50 16 A14 14 0 0 1 78 16 M56 16 A8 8 0 0 1 72 16 M0 0 A32 32 0 0 1 64 0 M6 0 A26 26 0 0 1 58 0 M12 0 A20 20 0 0 1 52 0 M18 0 A14 14 0 0 1 46 0 M24 0 A8 8 0 0 1 40 0' fill='none' stroke='%23ffffff' stroke-width='2.2' stroke-linecap='round'/%3E%3C/svg%3E");
  background-size: 64px 32px;
}

/* 2. Lông tên Yagasuri (矢絣): Biểu tượng của sự tiến bộ một đi không trở lại (Progress Bar) */
.wagara-yagasuri {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M0 0 L20 20 L40 0 L40 20 L20 40 L0 20 Z' fill='rgba(136, 167, 82, 0.25)'/%3E%3C/svg%3E");
  background-size: 20px 20px;
}

/* 3. Lá gai Asanoha (麻の葉): Biểu tượng của sự phát triển nhanh chóng và dẻo dai */
.wagara-asanoha {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='104' viewBox='0 0 60 104'%3E%3Cpath d='M30 0 L60 52 L30 104 L0 52 Z M30 0 L30 104 M0 52 L60 52' fill='none' stroke='rgba(217, 56, 30, 0.12)' stroke-width='1.5'/%3E%3C/svg%3E");
  background-size: 30px 52px;
}
```

---

## 4. TYPOGRAPHY & PHONOLOGICAL RENDERING (HỆ TYPOGRAPHY CHUẨN MỰC)

### 4.1. Font Hierarchy
1. **Primary Kanji & Grand Headings**: `Shippori Mincho` (`var(--font-mincho)`), `font-weight: 700 - 800`. Conveys the gravity of Japanese calligraphy and woodblock printings.
2. **Subheadings, Navigation & Badges**: `Zen Maru Gothic` (`var(--font-maru)`), `font-weight: 600 - 700`. Rounded, approachable, easy on the eyes.
3. **English, Numbers & SRS Stats**: `Plus Jakarta Sans` (`var(--font-sans)`), `font-weight: 600 - 800`.
4. **Furigana Ruby Text**: Use semantic HTML `<ruby>` with precise superscript alignment:
   ```html
   <ruby>勉強<rt>べんきょう</rt></ruby>
   ```

### 4.2. Pitch Accent SVG Contours
- Always display a continuous line path indicating high/low pitch mora segments.
- Color: `#D97706` (Yamabuki Amber) or `#88A752` (Matcha) with circular nodes on pitch transitions.
- Drop pattern label: `0型 (平板)`, `1型 (頭高)`, `2型 (中高)`, `3型 (尾高)`.

---

## 5. CULTURAL MICRO-INTERACTIONS & MOTION (HOẠT HOẠ VĂN HÓA 60 FPS)

1. **3D Karuta Card Flip (Hiệu ứng Lật thẻ Thơ Karuta)**:
   ```css
   .karuta-container {
     perspective: 1200px;
   }
   .karuta-card-inner {
     transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
     transform-style: preserve-3d;
   }
   .karuta-flipped {
     transform: rotateY(180deg);
   }
   ```
2. **Inkan Hanko Stamp Bounce (Con dấu son Đóng dấu Phê duyệt)**:
   ```css
   @keyframes inkanStamp {
     0% { opacity: 0; transform: scale(2.5) rotate(-18deg); }
     50% { opacity: 0.95; transform: scale(0.92) rotate(-5deg); }
     75% { transform: scale(1.05) rotate(-7deg); }
     100% { opacity: 1; transform: scale(1) rotate(-6deg); }
   }
   ```
3. **Daruma Mascot Eye Awakening (Khai mở Mắt Daruma theo Tiến độ)**:
   - $0\% - 49\%$: Cả hai mắt nhắm (Trắng tinh khiết).
   - $50\% - 99\%$: Mắt trái vẽ đồng tử đen (Quyết tâm nửa chặng đường).
   - $100\%$: Khai mở trọn vẹn cả 2 mắt kèm hiệu ứng tỏa sáng Suzu Bell!

---

## 6. DESIGN SYSTEM AUDIT CHECKLIST FOR DESIGNERS
Before signing off on any UI screen or component:
- [ ] Base background is warm Washi (`#FAF8F5`), not stark cold white `#FFFFFF`.
- [ ] Kanji uses `Shippori Mincho` with font-weight $\ge 700$ for crisp radical rendering.
- [ ] All Wagara patterns are pure inline SVG Data URIs (zero layout shift, zero network requests).
- [ ] Inkan seals are present to denote verification, deck identity, or approved mastery.
- [ ] Text contrast meets WCAG 2.1 AA (at least 4.5:1 for body, 3:1 for large headers).
- [ ] Interactive elements provide subtle hover lift (`translateY(-2px)`) and organic warm glow.

---

## 7. AUTHENTIC WA-ART CATALOG & OVERLAY ENGINEERING (HỘI HỌA MỘC BẢN & LỚP PHỦ NGHỆ THUẬT)

The system integrates 13 authentic Japanese art assets located in `public/assets/art/` (ingested from classical collections and benchmarked in `planning/03_PHASE_3_JAPANESE_GRAPHIC_DESIGN_AND_WA_ART.md`).

### 7.1. Semantic Art Catalog
1. `japanese-cultural-panorama.jpg` — Tranh toàn cảnh văn hóa (Fuji, Torii, Trà đạo) $\rightarrow$ Hero Section Backdrop (`/`).
2. `golden-waves-kin-nami.jpg` — Sóng vàng Kin-nami mạ kim $\rightarrow$ Dải ruy băng ngăn cách section (`h-16`, 4:1 aspect ratio).
3. `ryusui-indigo-stream.jpg` — Dòng nước Ryusui Ogata Korin (Lam Aizome) $\rightarrow$ Watermark nền thư viện thẻ (`/cards`).
4. `hokusai-suwa-lake.jpg` — Hokusai (Hồ Suwa Shinano) $\rightarrow$ Banner nẹp gỗ tìm kiếm thẻ (`/cards`).
5. `hokusai-cranes-fuji.jpg` — Hokusai (Đàn hạc Umezawa & Phú Sĩ) $\rightarrow$ Cột tranh cuộn Kakejiku bên phải bàn soạn thảo AI Copilot (`/cards/new`).
6. `cloud-mist-kasumi-icons.jpg` — Mây sương Yamato-e Kasumi $\rightarrow$ Khung trang trí Tanzaku & huy hiệu Copilot.
7. `hokusai-great-wave-classic.jpg` — Sóng lừng Kanagawa nguyên bản $\rightarrow$ Nền mờ thao trường ôn tập Karuta (`/review`).
8. `great-wave-isolated.webp` — Sóng lừng cô lập nền trong suốt $\rightarrow$ Hoạt họa thăng hoa khi hoàn thành 100% phiên ôn tập.
9. `kohaku-koi-pond.jpg` — Cá Koi Kohaku vảy đỏ vàng $\rightarrow$ Nền huy hiệu đánh giá Dễ (Easy button).
10. `night-golden-waves.jpg` — Sóng vàng ban đêm $\rightarrow$ Nền huy hiệu đánh giá Lại (Again / Hard button).
11. `rinpa-gold-waves-clouds.jpg` — Sóng vàng & mây hoa Rinpa $\rightarrow$ Banner kho báu tích hợp Kura (`/integrations`).
12. `koi-peony-yuzen.jpg` — Tranh thêu Yuzen Cá chép & Hoa mẫu đơn $\rightarrow$ Nền thẻ dịch vụ Google Sheets/Tasks.
13. `gold-sakura-washi.jpg` — Nhành hoa anh đào mạ kim trên xơ giấy $\rightarrow$ Đai trang trí Header & Footer toàn cục.

### 7.2. Overlay Engineering Standards
- **Component**: Always use `<JapaneseArtBackdrop />` (`src/components/art/JapaneseArtBackdrop.tsx`).
- **Non-blocking Rule**: Must strictly have `pointer-events: none` and `aria-hidden="true"`.
- **Blend Modes**:
  - Warm Washi backgrounds: `mix-blend-mode: multiply` with `opacity: 0.15 - 0.25`.
  - Colored/Dark banners: `mix-blend-mode: overlay` with `opacity: 0.20 - 0.35`.
- **Zero CLS**: Images must use Next.js `fill` with `sizes="100vw"` inside constrained relative parents.

