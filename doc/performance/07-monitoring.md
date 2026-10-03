# 07 — TẦNG 7: Giám Sát Liên Tục, CI/CD Pipeline & Phòng Ngừa Regression Toàn Diện

> **Định vị tài liệu**: Tầng 7 (Continuous Monitoring, Telemetry & Regression Prevention Layer) — Tầng đỉnh cao của hệ thống kiến trúc hiệu suất cho dự án `japanese-srs-system`. Thiết lập các hàng rào phòng thủ tự động (Performance Gates) từ môi trường Local, qua CI/CD Pipeline (GitHub Actions & Lighthouse CI), tới hệ thống viễn thám người dùng thực tế (Real User Monitoring - RUM) và sổ tay xử lý sự cố tức thì (Incident Runbook).

---

## 1. 🚦 THIẾT LẬP LIGHTHOUSE CI (LHCI) TỰ ĐỘNG HÓA

Lighthouse CI tự động hóa việc đo lường hiệu năng trên máy ảo CI runner trước khi mã nguồn được phép hợp nhất vào nhánh chính (`main`).

### 1.1. Tệp Cấu Hình Hoàn Chỉnh: `lighthouserc.js`

Đặt tệp này tại thư mục gốc của dự án:

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      // Chạy 3 lần liên tiếp trên mỗi trang để lấy kết quả trung vị (Median Run)
      numberOfRuns: 3,
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'ready on',
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/cards',
        'http://localhost:3000/review',
      ],
      settings: {
        preset: 'desktop',
        throttlingMethod: 'simulate',
        // Giả lập cấu hình mạng di động 4G chuẩn tại Việt Nam
        throttling: {
          rttMs: 80,
          throughputKbps: 10240, // 10 Mbps
          cpuSlowdownMultiplier: 2,
        },
      },
    },
    assert: {
      assertions: {
        // 1. ĐIỂM SỐ HIỆU NĂNG TỔNG THỂ PHẢI ĐẠT ÍT NHẤT 90/100
        'categories:performance': ['error', { minScore: 0.90 }],
        'categories:accessibility': ['warn', { minScore: 0.95 }],
        'categories:best-practices': ['warn', { minScore: 0.95 }],

        // 2. CÁC CHỈ SỐ CORE WEB VITALS BẮT BUỘC
        'first-contentful-paint': ['error', { maxNumericValue: 1200 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
        'total-blocking-time': ['error', { maxNumericValue: 100 }],

        // 3. NGÂN SÁCH KÍCH THƯỚC TÀI NGUYÊN (RESOURCE BUDGETS)
        'resource-summary:script:size': ['error', { maxNumericValue: 110000 }], // Tối đa 110KB JS
        'resource-summary:image:size': ['warn', { maxNumericValue: 200000 }],   // Tối đa 200KB Ảnh
        'resource-summary:font:size': ['error', { maxNumericValue: 80000 }],    // Tối đa 80KB Font
        'resource-summary:total:size': ['error', { maxNumericValue: 500000 }],  // Tối đa 500KB Tổng
      },
    },
    upload: {
      target: 'temporary-public-storage', // Tự động tạo link báo cáo trực quan đính kèm PR
    },
  },
};
```

---

## 2. 🤖 GITHUB ACTIONS CI/CD PIPELINE: CHẶN ĐỨNG REGRESSION

Xây dựng quy trình tự động trên GitHub để chặn bất kỳ commit hoặc Pull Request (PR) nào làm suy giảm hiệu năng:

### 2.1. Tệp Định Nghĩa Quy Trình: `.github/workflows/performance.yml`

```yaml
# .github/workflows/performance.yml
name: ⚡ Kiểm Toán Hiệu Suất Tự Động (Lighthouse CI & Performance Gate)

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  performance-gate:
    name: Core Web Vitals & Bundle Guard
    runs-on: ubuntu-latest

    steps:
      - name: 📥 Tải mã nguồn (Checkout Repository)
        uses: actions/checkout@v4

      - name: 🟢 Thiết lập môi trường Node.js 20 LTS
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: 📦 Cài đặt thư viện dependencies
        run: npm ci

      - name: 🏗️ Biên dịch Next.js Production Build
        run: npm run build
        env:
          TURSO_DATABASE_URL: ${{ secrets.TURSO_DATABASE_URL }}
          TURSO_AUTH_TOKEN: ${{ secrets.TURSO_AUTH_TOKEN }}

      - name: 🚦 Cài đặt Lighthouse CI CLI
        run: npm install -g @lhci/cli@0.14.x

      - name: 🔬 Chạy bài kiểm tra Lighthouse CI
        run: lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

      - name: 📊 Phân tích giới hạn kích thước gói mã nguồn (Size Limit)
        run: npx size-limit
```

---

## 3. 📈 VIỄN THÁM NGƯỜI DÙNG THỰC (REAL USER MONITORING - RUM)

Đo lường các chỉ số thực tế tại máy người dùng thông qua API `PerformanceObserver` và gửi về máy chủ bằng `navigator.sendBeacon` để không làm chậm luồng UI:

### 3.1. Mã Nguồn Module Viễn Thám: `src/lib/telemetry.ts`

```typescript
// src/lib/telemetry.ts
export function initPerformanceTelemetry() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  // 1. QUAN SÁT CHỈ SỐ LCP THỰC TẾ
  try {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      sendMetricToAnalytics({
        metric: 'LCP',
        value: Math.round(lastEntry.startTime),
        element: (lastEntry as any).element?.tagName || 'UNKNOWN',
      });
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {}

  // 2. QUAN SÁT CHỈ SỐ INP (TƯƠNG TÁC CHẬM TRONG PHIÊN HỌC)
  try {
    const inpObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if ('duration' in entry && (entry as any).duration > 50) {
          sendMetricToAnalytics({
            metric: 'INP_CANDIDATE',
            value: Math.round((entry as any).duration),
            interactionType: (entry as any).name,
          });
        }
      }
    });
    inpObserver.observe({ type: 'first-input', buffered: true });
  } catch (e) {}
}

function sendMetricToAnalytics(data: Record<string, any>) {
  const payload = JSON.stringify({
    ...data,
    url: window.location.pathname,
    timestamp: Date.now(),
    deviceMemory: (navigator as any).deviceMemory || 'UNKNOWN',
    effectiveType: (navigator as any).connection?.effectiveType || 'UNKNOWN',
  });

  // Sử dụng sendBeacon để đảm bảo gửi dữ liệu ngay cả khi người dùng tắt tab
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/telemetry', payload);
  }
}
```

---

## 4. 🚨 SỔ TAY ỨNG PHÓ SỰ CỐ HIỆU NĂNG (INCIDENT RESPONSE RUNBOOK)

Khi hệ thống giám sát gửi cảnh báo khẩn cấp: **"Chỉ số LCP vượt ngưỡng 3.5s trên Production!"**:

```
[BƯỚC 1: KHỞI TẠO ROLLBACK TỨC THÌ (TRONG 60 GIÂY)]
       │
       ├─► Mở Vercel Dashboard ──► Chọn mục "Deployments"
       ├─► Tìm deployment ổn định gần nhất
       └─► Bấm nút "Instant Rollback" (Khôi phục tốc độ ban đầu cho người dùng)

[BƯỚC 2: CÁCH LY NGUYÊN NHÂN TRÊN NHÁNH PREVIEW / STAGING]
       │
       ├─► Kiểm tra Git Log commit vừa qua:
       │    - Có tệp ảnh nào > 100KB vừa được thêm vào public/assets/art/?
       │    - Có component trang nào bị đổi thành 'use client'?
       │    - Có câu lệnh SQL nào trong /api/cards vừa bị bỏ mất mệnh đề LIMIT?
       └─► Kiểm tra báo cáo Lighthouse CI của commit đó

[BƯỚC 3: SỬA LỖI & THỰC HIỆN TỐI ƯU HÓA]
       │
       ├─► Chạy lại script nén ảnh Sharp: `npm run optimize-images`
       └─► Đưa component trở lại Server Component

[BƯỚC 4: HẬU KIỂM VÀ CẬP NHẬT RÀO CHẮN]
       │
       └─► Bổ sung quy tắc assertion mới vào `lighthouserc.js` để lỗi không lặp lại!
```

---

## 5. ✅ CHECKLIST KIỂM SOÁT HIỆU NĂNG TRƯỚC KHI MERGE CODE (PRE-FLIGHT CHECKLIST)

Mỗi lập trình viên hoặc AI Agent trước khi hoàn thành một tác vụ phải tự kiểm tra 7 mục:
- [ ] Không có tệp ảnh mới nào vượt quá **80 KB** trong `public/assets/art/`.
- [ ] Mọi tệp ảnh mới đều có định dạng `.avif` đi kèm và đã đăng ký trong `art-manifest.json`.
- [ ] Không có chỉ thị `'use client'` xuất hiện ở các tệp trang `src/app/**/page.tsx` (Bắt buộc là Server Component).
- [ ] Mọi câu truy vấn SQL đọc dữ liệu đều có mệnh đề `.limit()` và không dùng vòng lặp `await` tuần tự.
- [ ] Các hiệu ứng animation đều có hỗ trợ `@media (prefers-reduced-motion)`.
- [ ] Điểm số Lighthouse CI chạy cục bộ đạt **>= 90 điểm**.
- [ ] Kích thước file bundle JS chính không tăng quá **5 KB** so với nhánh chính.

---
*Tài liệu thuộc bộ hồ sơ kỹ thuật Master Performance Plan — Dự án Japanese SRS System.*
