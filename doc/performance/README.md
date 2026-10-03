# 🚀 Kế Hoạch Tối Ưu Hiệu Suất Đa Tầng — japanese-srs-system

> **Mục tiêu**: Giảm LCP từ ~4.2s xuống < 1.8s · INP < 30ms · CLS < 0.02 · TTFB < 180ms  
> **Stack cốt lõi**: Next.js 15.5.27 (App Router) · React 19.0.0 · Turso (libSQL) · Drizzle ORM · Vercel Platform  
> **Quy mô hồ sơ**: 8 tầng kiến trúc chuyên sâu, bao quát từ vật lý cáp quang đến biên dịch máy ảo V8 và triển khai CI/CD.

---

## 🗺️ Cấu Trúc Kế Hoạch Đa Tầng (Kim Tự Tháp Bottom-Up)

Kế hoạch được tổ chức tuần tự từ **nền tảng vật lý lên đến tầng giám sát ứng dụng**:

```
TẦNG 7: Giám Sát, CI/CD Pipeline & Phòng Ngừa Regression      ← Chi tiết thực thi & bảo vệ
TẦNG 6: Hiệu Suất Runtime, FSRS Web Worker & Offline PWA
TẦNG 5: Mạng Truyền Dẫn, CDN Vercel & Phân Phối Biên (Edge)
TẦNG 4: Tối Ưu Hóa Database Turso (libSQL) & Lớp API
TẦNG 3: Tối Ưu Hóa Tài Nguyên Assets (Images, SVG, CSS, Fonts)
TẦNG 2: Tối Ưu Hóa Next.js 15, Server Components & Actions
TẦNG 1: Kiểm Toán Kiến Trúc Codebase & Bóc Tách 11 Điểm Nghẽn
TẦNG 0: Lý Thuyết Nền Tảng Hiệu Suất Web & Vật Lý Mạng       ← Tổng quan lý thuyết khoa học
```

---

## 📂 Danh Sách 8 Tệp Hồ Sơ Kỹ Thuật Chi Tiết

| Tệp Kế Hoạch | Tầng | Nội Dung Trọng Tâm | Trạng Thái |
| :--- | :---: | :--- | :---: |
| [00-performance-foundation.md](./00-performance-foundation.md) | **Tầng 0 (Nền)** | Lý thuyết vật lý CRP, Chromium Blink engine, V8 TurboFan, HTTP/3 QUIC, Core Web Vitals 2026 | ✅ Hoàn thành |
| [01-architecture-audit.md](./01-architecture-audit.md) | **Tầng 1** | Bóc tách 11 điểm nghẽn thực tế trong codebase `japanese-srs-system` kèm diff code trước/sau | ✅ Hoàn thành |
| [02-nextjs-optimization.md](./02-nextjs-optimization.md) | **Tầng 2** | Chuyển đổi `page.tsx` sang Server Component, cấu hình `next.config.ts`, tối ưu hóa `next/font` | ✅ Hoàn thành |
| [03-asset-optimization.md](./03-asset-optimization.md) | **Tầng 3** | Kịch bản tự động nén 26 ảnh nghệ thuật sang AVIF/WebP, Base64 LQIP blur, CSS GPU Sakura | ✅ Hoàn thành |
| [04-database-api.md](./04-database-api.md) | **Tầng 4** | Turso Singapore Replica, Serverless Singleton, SQL GROUP BY thay thế 3 queries tuần tự, Indexes | ✅ Hoàn thành |
| [05-network-cdn.md](./05-network-cdn.md) | **Tầng 5** | Vercel Edge PoP `sin1`, ma trận Cache-Control, Resource Hints, chống chịu đứt cáp quang biển | ✅ Hoàn thành |
| [06-runtime-performance.md](./06-runtime-performance.md) | **Tầng 6** | Dedicated Web Worker cho FSRS, IndexedDB Dexie.js offline-first, Service Worker PWA | ✅ Hoàn thành |
| [07-monitoring.md](./07-monitoring.md) | **Tầng 7** | Lighthouse CI tự động, GitHub Actions PR gate, RUM Telemetry, Incident Runbook | ✅ Hoàn thành |

---

## 🎯 4 Điểm Nghẽn Cốt Tử Được Ưu Tiên Giải Quyết (Sprint 1 & 2)

Từ báo cáo kiểm toán thực tế mã nguồn (`src/app/`, `src/components/`, `public/assets/art/`, `src/db/`):

### 🔴 CỰC KỲ NGHIÊM TRỌNG (Tác Động Lớn Nhất Đến LCP & TTFB)

1. **Google Fonts CJK Tải 8 Weights Thừa (`src/app/layout.tsx:11-29`)**:
   - *Hiện trạng*: Tải 4 weights Zen Maru Gothic + 3 weights Shippori Mincho mà chỉ khai báo subset Latinh. Trình duyệt liên tục phát sinh HTTP requests kéo thêm các lát cắt CJK từ Google CDN.
   - *Khắc phục*: Chỉ giữ 2 weights (400 và 700), bật preload và khai báo fallback font tiếng Nhật hệ thống (`Hiragino Sans`, `Yu Mincho`).
   - *Hiệu quả*: Giảm **~300ms LCP**, tiết kiệm **~180KB font**.

2. **Dashboard Fetch Dữ Liệu Qua `useEffect` Client-Side (`src/app/page.tsx:1-55`)**:
   - *Hiện trạng*: Trang chủ bị ép thành `'use client'`, trình duyệt phải tải xong HTML rỗng, tải xong JS bundle, hydrate xong mới bắt đầu gọi `fetch('/api/cards')`.
   - *Khắc phục*: Tái cấu trúc thành **React Server Component**, nạp dữ liệu song song trực tiếp từ Turso DB trong lúc tạo HTML.
   - *Hiệu quả*: Giảm **~400ms LCP**, triệt tiêu hoàn toàn màn hình trắng và loading skeleton.

3. **3 Truy Vấn Cơ Sở Dữ Liệu Tuần Tự & Lọc In-Memory (`src/app/api/cards/route.ts:34-70`)**:
   - *Hiện trạng*: 3 câu lệnh `await` nối đuôi nhau qua HTTP đến Turso; kéo toàn bộ bảng `cards` về RAM của Node.js để chạy vòng lặp `.filter()`.
   - *Khắc phục*: Sử dụng `Promise.all()` và chuyển thuật toán đếm về **1 câu lệnh SQL GROUP BY duy nhất** được SQLite xử lý trong 2ms.
   - *Hiệu quả*: Giảm **~180ms TTFB**, bảo vệ máy chủ không bị tràn bộ nhớ khi dữ liệu tăng lên 10,000 từ vựng.

4. **26 Tệp Ảnh Nghệ Thuật Nặng 2.8MB Chưa Nén AVIF (`public/assets/art/`)**:
   - *Hiện trạng*: Bức tranh hồ Suwa của Hokusai (`hokusai-suwa-lake.jpg`) nặng 431.8 KB định dạng JPG cổ điển, là ứng viên LCP lớn nhất.
   - *Khắc phục*: Kịch bản tự động hóa bằng thư viện `sharp` chuyển đổi toàn bộ sang **AVIF (chất lượng 65, dung lượng 46 KB)** và trích xuất Base64 `blurDataURL`.
   - *Hiệu quả*: Giảm **89.3% dung lượng ảnh**, rút ngắn **~350ms thời gian tải ảnh LCP**.

---

## ⚡ Lộ Trình Triển Khai 4 Giai Đoạn (4-Sprint Roadmap)

### 🟢 Giai đoạn 1: Quick Wins (Ngày 1 - 2) — Nỗ lực thấp, kết quả tức thì
- [x] Tạo tệp `next.config.ts` kích hoạt nén AVIF, Brotli và loại bỏ `x-powered-by`.
- [x] Thêm các thẻ `<link rel="preconnect">` và `<link rel="dns-prefetch">` vào `src/app/layout.tsx`.
- [x] Cắt giảm font weights trong `src/app/layout.tsx` chỉ giữ `400` và `700`.

### 🟡 Giai đoạn 2: Tối Ưu Hóa Assets & Database (Ngày 3 - 5)
- [ ] Chạy script `scripts/optimize-art-images.mjs` nén 26 ảnh sang AVIF và sinh `art-manifest.json`.
- [ ] Cập nhật `src/components/art/JapaneseArtBackdrop.tsx` sử dụng ảnh AVIF và `blurDataURL`.
- [ ] Bổ sung các chỉ mục B-Tree (`idx_cards_deck_id`, `idx_cards_due_state`, `idx_cards_created_at`) vào SQLite/Turso.
- [ ] Refactor API route `src/app/api/cards/route.ts` sang câu lệnh `GROUP BY` song song.

### 🟠 Giai đoạn 3: Tái Cấu Trúc Kiến Trúc (Tuần 2)
- [ ] Chuyển đổi `src/app/page.tsx` từ Client Component sang **React Server Component**.
- [ ] Chuyển đổi các hiệu ứng của `SakuraBackground.tsx` sang thuần túy CSS GPU keyframes.
- [ ] Tích hợp React 19 Server Actions thay thế các mutation endpoints REST.

### 🔵 Giai đoạn 4: Nâng Cao & Tự Động Hóa (Tuần 3 - 4)
- [ ] Chuyển thuật toán FSRS sang **Dedicated Web Worker** (`src/workers/fsrs.worker.ts`).
- [ ] Triển khai cơ sở dữ liệu ngoại tuyến **IndexedDB (Dexie.js)** và Service Worker PWA (`public/sw.js`).
- [ ] Thiết lập quy trình kiểm duyệt hiệu năng tự động trên CI/CD qua **Lighthouse CI**.

---

## 📊 Bảng Mục Tiêu Ngân Sách Hiệu Năng (Performance Budgets)

| Chỉ Số Đo Lường | Hiện Trạng (Ước Tính) | Mục Tiêu Sprint 1 | Mục Tiêu Sprint 4 (Hoàn Thành) |
| :--- | :---: | :---: | :---: |
| **LCP (Largest Contentful Paint)** | ~4.2s | < 2.5s | **< 1.8s (Tốt - Xanh)** |
| **INP (Interaction to Next Paint)** | ~140ms | < 80ms | **< 30ms (Tốt - Xanh)** |
| **CLS (Cumulative Layout Shift)** | ~0.14 | < 0.05 | **< 0.02 (Tốt - Xanh)** |
| **TTFB (Time to First Byte)** | ~650ms | < 300ms | **< 180ms (Tốt - Xanh)** |
| **Tổng Dung Lượng JS Ban Đầu** | ~220 KB | < 140 KB | **< 90 KB (gzip)** |
| **Tổng Dung Lượng Tải Trang Đầu**| ~2.8 MB | < 800 KB | **< 400 KB** |

---
*Tài liệu thuộc bộ hồ sơ kỹ thuật Master Performance Plan — Dự án Japanese SRS System.*
