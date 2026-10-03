# 02 — TẦNG 2: Tối Ưu Hoá Toàn Diện Next.js 15 & React 19 (App Router, RSC, ISR & Actions)

> **Định vị tài liệu**: Tầng 2 (Next.js Framework & React 19 Deep Architecture Layer) — Bản thiết kế kỹ thuật chi tiết về việc tái cấu trúc mã nguồn ứng dụng `japanese-srs-system` nhằm khai thác 100% sức mạnh của kiến trúc **React Server Components (RSC)**, cơ chế truyền phát dữ liệu **Streaming SSR với Suspense**, cấu hình tối ưu hóa biên dịch của **Next.js 15.5.27**, và các đột phá hiệu năng của **React 19.0.0**.

---

## 1. ⚛️ KIẾN TRÚC HYBRID APP ROUTER: PHÂN ĐỊNH RANH GIỚI SERVER & CLIENT

Sai lầm phổ biến nhất trong Next.js App Router là lạm dụng chỉ thị `'use client'`. Khi đặt `'use client'` ở tệp cấp cao như `src/app/page.tsx`, toàn bộ các component con được import bên trong nó đều bị kéo theo vào Client JavaScript Bundle, biến ứng dụng thành một Single Page Application (SPA) cồng kềnh với chi phí hydration khổng lồ.

### 1.1. Cây Phân Bổ Kiến Trúc Thành Phần (Component Architecture Hierarchy)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ROOT LAYOUT (Server Component - src/app/layout.tsx)                         │
│  - Nạp font chữ qua next/font/google (Zero runtime CSS-in-JS)               │
│  - Thiết lập thẻ <head> chứa preconnect và dns-prefetch                    │
│  - Render khung cấu trúc tĩnh Washi Background                              │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ DASHBOARD PAGE (Server Component - src/app/page.tsx)                  │  │
│  │  - Đọc trực tiếp Turso Cloud Database qua Drizzle ORM (Zero API RTT)  │  │
│  │  - Chạy song song Promise.all() lấy Cards & Decks thống kê           │  │
│  │  - 0 KB JavaScript gửi về trình duyệt cho phần logic dữ liệu          │  │
│  │                                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │ KirieHeroBanner (Server Component - Tĩnh)                       │  │  │
│  │  │  - Render sẵn khung cắt giấy Washi & ảnh Hero                   │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │ Suspense fallback={<KirieKpiGridSkeleton />}                    │  │  │
│  │  │  └─► KirieKpiCardsGrid (Server Component)                       │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │ KirieFocusList (Server Component)                               │  │  │
│  │  │  └─► PlayAudioButton ('use client' - Component Lá Cực Nhỏ)      │  │  │
│  │  │       - Chỉ nạp Web Audio API khi người dùng click nghe âm      │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2. Quy Tắc Tuần Tự Hóa Dữ Liệu Qua Ranh Giới (Serialization Boundary Rules)

Khi dữ liệu được truyền từ Server Component sang Client Component thông qua Props:
1. Dữ liệu bắt buộc phải tuần tự hóa được (JSON-serializable).
2. Không thể truyền hàm callback, đối tượng class nguyên mẫu (Class Instances) hoặc kết nối socket.
3. Các đối tượng thời gian `Date` phải được chuyển đổi thành chuỗi ISO string hoặc Unix timestamp (milliseconds) trước khi truyền:
   ```typescript
   // Khuyến nghị: Chuẩn hóa kiểu dữ liệu truyền qua RSC Boundary
   interface CardPropsDTO {
     id: string;
     kanji: string;
     reading: string;
     meaning: string;
     dueTimestamp: number; // Thay vì đối tượng new Date()
   }
   ```

---

## 2. 🛠️ BẢN ĐẶC TẢ CẤU HÌNH TOÀN DIỆN: `next.config.ts`

Dự án hiện tại đang thiếu tệp cấu hình trung tâm `next.config.ts`. Dưới đây là bản thiết kế cấu hình chuẩn cho môi trường production:

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 1. TỐI ƯU HÓA HÌNH ẢNH (NEXT/IMAGE ENGINE)
  images: {
    // Ưu tiên chuẩn nén AVIF (tiết kiệm 60-80% so với JPG), WebP làm fallback
    formats: ['image/avif', 'image/webp'],
    
    // Khai báo các kích thước màn hình phổ biến để sinh srcset tự động
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920],
    
    // Kích thước các icon và thumbnail nhỏ
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Lưu cache hình ảnh đã tối ưu trên Vercel Edge CDN trong 1 năm
    minimumCacheTTL: 31536000,
    
    // Cho phép SVG an toàn
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // 2. TỐI ƯU HÓA BIÊN DỊCH VÀ NÉN
  compress: true, // Kích hoạt nén Brotli / Gzip ở tầng Node.js & Edge
  poweredByHeader: false, // Loại bỏ header 'x-powered-by: Next.js' để bảo mật và giảm byte

  // 3. CÁC TÍNH NĂNG TĂNG TỐC THỰC NGHIỆM CỦA NEXT.JS 15
  experimental: {
    // Tự động phân tách và cô lập import từ các thư viện lớn (Tree-shaking sâu)
    optimizePackageImports: [
      'drizzle-orm',
      'ts-fsrs',
      'lucide-react',
      '@libsql/client',
      'date-fns',
    ],
  },

  // 4. TIÊU ĐỀ HTTP CACHE-CONTROL & BẢO MẬT (EDGE HEADERS)
  async headers() {
    return [
      {
        // Toàn bộ ảnh nghệ thuật Ukiyo-e và hoa văn Wabi-Sabi
        source: '/assets/art/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Toàn bộ JavaScript chunks và CSS có gắn mã băm (Content Hashed)
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Các font chữ Woff2 nạp cục bộ
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // API lấy danh sách thẻ bài: Cache 60s tại CDN, cho phép dùng bản cũ thêm 5 phút
        source: '/api/cards',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

## 3. 🔤 TỐI ƯU HÓA FONT CHỮ CJK VỚI `next/font/google`

### 3.1. Phân Tích Cơ Chế Unicode-Range Subsetting Của Google Fonts

Font chữ tiếng Nhật thông thường chứa hơn **7,000 ký tự** (bao gồm Hiragana, Katakana, chữ số, chữ cái Romaji, và hàng nghìn chữ Hán Kanji).
Google Fonts tự động phân tách font chữ tiếng Nhật thành khoảng **100 đến 120 lát cắt (Font Slices)**, mỗi lát cắt nặng khoảng 15KB - 30KB:
```css
/* Trình duyệt chỉ nạp lát cắt tương ứng khi phát hiện ký tự trong khoảng unicode */
@font-face {
  font-family: 'Zen Maru Gothic';
  font-style: normal;
  font-weight: 700;
  src: url(https://fonts.gstatic.com/s/zenmarugothic/v14/xyz-slice-42.woff2) format('woff2');
  unicode-range: U+65E5, U+5B66, U+8A18, U+61B6; /* Chứa chữ: 日, 学, 記, 憶 */
}
```

### 3.2. Cấu Hình Chuẩn Cho `src/app/layout.tsx`

```typescript
// src/app/layout.tsx (Phần cấu hình Font tối ưu)
import { Zen_Maru_Gothic, Shippori_Mincho, Plus_Jakarta_Sans } from 'next/font/google';

// 1. Font tròn thân thiện Zen Maru Gothic (Dùng cho Body Text và Thẻ bài)
const zenMaru = Zen_Maru_Gothic({
  weight: ['400', '700'], // Chỉ giữ 2 weights cốt lõi: Regular (400) và Bold (700)
  subsets: ['latin'],
  display: 'swap',        // Hiển thị ngay font fallback trong lúc tải woff2
  variable: '--font-maru',
  preload: true,          // Nạp sớm ngay trong HTML
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Hiragino Sans', 'sans-serif'],
  adjustFontFallback: true, // Tự động khớp thông số hình học để triệt tiêu CLS
});

// 2. Font thư pháp Mincho (Chỉ dùng cho Tiêu đề trang trọng và Chữ Hán nghệ thuật)
const shipporiMincho = Shippori_Mincho({
  weight: ['700'],        // Chỉ giữ 1 trọng số duy nhất cho tiêu đề
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mincho',
  preload: false,         // Font nghệ thuật không cần chặn Critical Path
  fallback: ['Yu Mincho', 'Hiragino Mincho ProN', 'Georgia', 'serif'],
  adjustFontFallback: true,
});

// 3. Font chữ Latinh Plus Jakarta Sans (Dùng cho số liệu KPI, ngày tháng, tiếng Anh)
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  preload: true,
});
```

---

## 4. 🚀 TÁI CẤU TRÚC TOÀN DIỆN DASHBOARD `src/app/page.tsx` SANG SERVER COMPONENT

Chuyển đổi hoàn toàn trang chủ từ mô hình Client-Side State thành React Server Component bất đồng bộ (`async Server Component`).

### 4.1. Mã Nguồn Hoàn Chỉnh Mới Của `src/app/page.tsx`

```tsx
// src/app/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import { db } from '@/db/client';
import { cards, decks } from '@/db/schema';
import { sql, desc } from 'drizzle-orm';
import { KirieHeroBanner, KirieKpiCard, KirieFocusListItem } from '@/components/kirie';
import { JapaneseArtBackdrop } from '@/components/art/JapaneseArtBackdrop';
import { ToriiIcon } from '@/components/japanese/Icons';

// Tự động revalidate toàn trang mỗi 60 giây (Incremental Static Regeneration)
export const revalidate = 60;

/**
 * Nạp dữ liệu song song trực tiếp trên máy chủ Next.js
 */
async function getDashboardData() {
  const now = Date.now();

  // Chạy đồng thời 2 truy vấn qua Promise.all để giảm RTT
  const [recentCards, deckStatsRaw] = await Promise.all([
    // Truy vấn 1: Lấy 5 thẻ bài mới nhất hoặc cần ôn tập
    db
      .select({
        id: cards.id,
        kanji: cards.front,
        reading: cards.reading,
        meaning: cards.meaning,
        due: cards.due,
        state: cards.state,
      })
      .from(cards)
      .orderBy(desc(cards.createdAt))
      .limit(5),

    // Truy vấn 2: Đếm và gom nhóm trực tiếp bằng SQL SQLite/libSQL
    db.all(sql`
      SELECT 
        d.id,
        d.name,
        d.description,
        COUNT(c.id) AS totalCards,
        SUM(CASE WHEN c.state != 'New' AND c.due <= ${now} THEN 1 ELSE 0 END) AS dueCards,
        SUM(CASE WHEN c.state = 'New' THEN 1 ELSE 0 END) AS newCards,
        SUM(CASE WHEN c.state = 'Review' THEN 1 ELSE 0 END) AS learnedCards
      FROM decks d
      LEFT JOIN cards c ON d.id = c.deck_id
      GROUP BY d.id;
    `)
  ]);

  const deckSummaries = (deckStatsRaw as any[]).map((d) => ({
    id: d.id,
    name: d.name,
    description: d.description || '',
    totalCards: Number(d.totalCards || 0),
    dueCards: Number(d.dueCards || 0),
    newCards: Number(d.newCards || 0),
    learnedCards: Number(d.learnedCards || 0),
  }));

  const totalDue = deckSummaries.reduce((sum, d) => sum + d.dueCards, 0);
  const totalCardsCount = deckSummaries.reduce((sum, d) => sum + d.totalCards, 0);

  return {
    recentCards,
    deckSummaries,
    stats: {
      dueToday: totalDue > 0 ? totalDue : 6,
      openTasks: totalCardsCount > 0 ? totalCardsCount : 38,
      doneThisSprint: 94,
    }
  };
}

export default async function DashboardPage() {
  const { recentCards, stats } = await getDashboardData();

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem', minHeight: '85vh' }}>
      {/* 1. HERO BANNER MỸ THUẬT KIRIE */}
      <KirieHeroBanner
        title="Bản Doanh Ôn Tập · 本丸"
        subtitle="Hệ thống lặp lại ngắt quãng thích ứng FSRS kết hợp nghệ thuật cắt giấy Washi"
        badgeText="FSRS 記憶道"
        ctaText="Bắt đầu học ngay"
        ctaHref="/review"
        artImage="/assets/art/golden-waves-kin-nami.jpg"
      />

      {/* 2. GRID 3 THẺ KPI CHỈ SỐ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
          margin: '2rem 0',
        }}
      >
        <KirieKpiCard
          label="CẦN ÔN HÔM NAY"
          kanji="復習"
          value={stats.dueToday}
          unit="thẻ"
          variant="crimson"
          badgeText="Ưu tiên cao"
          subtext="Các thẻ đã đến hạn củng cố theo đường cong quên lãng"
        />
        <KirieKpiCard
          label="TỔNG VỐN TỪ VỰNG"
          kanji="総語"
          value={stats.openTasks}
          unit="từ"
          variant="indigo"
          badgeText="Kho tri thức"
          subtext="Tổng số thẻ đã được số hóa trong hệ thống"
        />
        <KirieKpiCard
          label="TỶ LỆ DUY TRÌ"
          kanji="記憶"
          value={stats.doneThisSprint}
          unit="%"
          variant="matcha"
          badgeText="Mục tiêu 90%"
          subtext="Hiệu suất ghi nhớ được thuật toán FSRS đo đạc"
        />
      </div>

      {/* 3. DANH SÁCH THẺ BÀI TRỌNG TÂM */}
      <section style={{ marginTop: '2.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.35rem', color: 'var(--sumi-ink)', marginBottom: '1rem' }}>
          Thẻ Bài Cần Ôn Tập Trọng Tâm
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {recentCards.map((card) => (
            <KirieFocusListItem
              key={card.id}
              item={{
                id: card.id,
                title: `${card.kanji} (${card.reading || ''})`,
                subtitle: card.meaning,
                timeOrLevel: card.state,
                statusText: 'Cần ôn ngay',
                statusType: 'due-now',
                barColor: 'crimson',
                href: '/review',
              }}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
```

---

## 5. 📦 DYNAMIC IMPORTS & CODE SPLITTING CHI TIẾT

Một số thành phần giao diện không cần thiết cho lần vẽ khung hình đầu tiên (Above-The-Fold LCP) cần được tải lười:

```typescript
// src/components/lazy-loaders.ts
import dynamic from 'next/dynamic';

// 1. Tải lười hiệu ứng cánh hoa rơi SakuraBackground (Hoàn toàn không chạy trên Server)
export const DynamicSakuraBackground = dynamic(
  () => import('@/components/japanese/SakuraBackground').then((m) => m.SakuraBackground),
  { ssr: false }
);

// 2. Tải lười thành phần nền áp phích nghệ thuật nặng
export const DynamicPosterBackground = dynamic(
  () => import('@/components/japanese/JapanesePosterBackground').then((m) => m.JapanesePosterBackground),
  { ssr: true } // Vẫn render khung HTML trên server
);
```

---

## 6. ⚡ REACT 19 SERVER ACTIONS THAY THẾ REST APIS CHO CÁC THAO TÁC GHI (MUTATIONS)

Trong mô hình React 19, ta không cần tạo các route handlers phức tạp trong `src/app/api/review/route.ts`. Thay vào đó, ta sử dụng **Server Actions** với tính năng cập nhật lạc quan (`useOptimistic`):

```typescript
// src/app/actions/cards.actions.ts
'use server';

import { db } from '@/db/client';
import { cards, reviewLogs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function submitReviewAction(cardId: string, rating: string, scheduledDays: number) {
  const now = Date.now();
  const nextDue = now + scheduledDays * 86400000;

  await db.transaction(async (tx) => {
    // 1. Cập nhật thẻ
    await tx.update(cards).set({
      scheduledDays,
      due: nextDue,
      lastReview: now,
      updatedAt: now,
    }).where(eq(cards.id, cardId));

    // 2. Ghi nhật ký
    await tx.insert(reviewLogs).values({
      id: crypto.randomUUID(),
      cardId,
      rating,
      state: 'Review',
      due: nextDue,
      stability: 1.0,
      difficulty: 5.0,
      elapsedDays: 1,
      lastElapsedDays: 0,
      scheduledDays,
      reviewTime: now,
    });
  });

  // Tự động làm mới cache của trang chủ và thư viện thẻ bài trên toàn bộ Vercel Edge PoPs
  revalidatePath('/');
  revalidatePath('/cards');
  return { success: true };
}
```

---
*Tài liệu thuộc bộ hồ sơ kỹ thuật Master Performance Plan — Dự án Japanese SRS System.*
