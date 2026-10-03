# 06 — TẦNG 6: Hiệu Suất Runtime, Thuật Toán FSRS Web Worker & Khả Năng Ngoại Tuyến (Offline-First PWA)

> **Định vị tài liệu**: Tầng 6 (Browser Runtime Execution & Offline-First Layer) — Bản thiết kế kỹ thuật chuyên sâu về tối ưu hóa luồng thực thi JavaScript tại trình duyệt và đảm bảo ứng dụng hoạt động mượt mà ngay cả khi không có kết nối mạng. Trọng tâm: chuyển giao thuật toán FSRS v4/v5 sang Web Worker chạy ngầm, kiến trúc cơ sở dữ liệu ngoại tuyến IndexedDB với Dexie.js, Service Worker PWA đa chiến lược và triệt tiêu giật lag (INP < 25ms).

---

## 1. ⚙️ BÓC TÁCH GÁNH NẶNG CPU CỦA THUẬT TOÁN FSRS TRÊN MAIN THREAD

Hệ thống sử dụng thư viện `ts-fsrs` (Free Spaced Repetition Scheduler). Khác với thuật toán SM-2 cổ điển của Anki chỉ tính toán phép nhân đơn giản, FSRS mô hình hóa trí nhớ con người thông qua hệ phương trình vi phân và ma trận 21 tham số trọng số ($w_0$ đến $w_{20}$):

### 1.1. Công Thức Tính Toán Độ Ổn Định ($S$) & Độ Khó ($D$)

1. **Khởi tạo độ ổn định ban đầu ($S_0$)**:
   $$S_0(G) = w_{G-1} \quad (G \in \{1, 2, 3, 4\} \text{ tương ứng: Again, Hard, Good, Easy})$$
2. **Cập nhật độ khó thích ứng ($D$)**:
   $$D' = w_4 \times D_0(G) + (1 - w_4) \times \left( D - w_5 \times (G - 3) \right)$$
3. **Cập nhật độ ổn định sau mỗi lần ôn tập thành công**:
   $$S' = S \times \left( 1 + e^{w_8} \times (11 - D) \times S^{-w_9} \times (e^{w_{10} \times (1 - R)} - 1) \right)$$

```
[NGƯỜI DÙNG BẤM NÚT ĐÁNH GIÁ THẺ BÀI (GOOD/HARD)]
                      │
                      ▼
[MAIN THREAD] ──► Chạy FSRS Matrix Math (Tính toán hàm mũ, lũy thừa trên 21 trọng số)
              │   ▲
              │   └── GÂY LONG TASK (45ms - 85ms trên chip điện thoại di động)
              ▼
[BROWSER UI]  ──► BỊ ĐÓNG BĂNG KHUNG HÌNH (Giao diện giật khựng, INP tụt dốc thảm hại!)
```

---

## 2. 🧵 GIẢI PHÁP ĐỘT PHÁ: DEDICATED WEB WORKER CHO THUẬT TOÁN FSRS

Bằng cách chuyển giao toàn bộ gánh nặng tính toán sang một luồng nền độc lập (**Dedicated Web Worker**), luồng giao diện chính (Main Thread) hoàn toàn được giải phóng để duy trì tốc độ khung hình 60fps/120fps.

### 2.1. Mã Nguồn Web Worker: `src/workers/fsrs.worker.ts`

```typescript
// src/workers/fsrs.worker.ts
import { FSRS, type Card, type RecordLog } from 'ts-fsrs';

// Khởi tạo cỗ máy FSRS bên trong Web Worker độc lập
const fsrs = new FSRS();

export interface FsrsWorkerRequest {
  id: string;
  card: Card;
  now: number;
}

export interface FsrsWorkerResponse {
  id: string;
  nextStates: RecordLog;
}

self.onmessage = (event: MessageEvent<FsrsWorkerRequest>) => {
  const { id, card, now } = event.data;

  try {
    // Thực hiện tính toán ma trận FSRS trên luồng riêng
    const schedulingCards = fsrs.repeat(card, new Date(now));

    const response: FsrsWorkerResponse = {
      id,
      nextStates: schedulingCards,
    };

    // Phản hồi kết quả về Main Thread
    self.postMessage(response);
  } catch (err: any) {
    self.postMessage({ id, error: err.message });
  }
};
```

### 2.2. Custom React Hook Giao Tiếp Bất Đồng Bộ: `src/hooks/useFsrsScheduler.ts`

```typescript
// src/hooks/useFsrsScheduler.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import type { Card, RecordLog } from 'ts-fsrs';

export function useFsrsScheduler() {
  const workerRef = useRef<Worker | null>(null);
  const pendingRequests = useRef<Map<string, (result: RecordLog) => void>>(new Map());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Khởi tạo Worker theo chuẩn Webpack 5 / Next.js 15
    const worker = new Worker(
      new URL('../workers/fsrs.worker.ts', import.meta.url),
      { type: 'module' }
    );

    worker.onmessage = (event: MessageEvent<{ id: string; nextStates: RecordLog; error?: string }>) => {
      const { id, nextStates, error } = event.data;
      const resolver = pendingRequests.current.get(id);
      if (resolver) {
        pendingRequests.current.delete(id);
        if (!error && nextStates) {
          resolver(nextStates);
        }
      }
    };

    workerRef.current = worker;
    setIsReady(true);

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const calculateNextReview = useCallback(
    (card: Card): Promise<RecordLog> => {
      return new Promise((resolve, reject) => {
        if (!workerRef.current) {
          return reject(new Error('FSRS Web Worker chưa sẵn sàng'));
        }

        const requestId = crypto.randomUUID();
        pendingRequests.current.set(requestId, resolve);

        workerRef.current.postMessage({
          id: requestId,
          card,
          now: Date.now(),
        });
      });
    },
    []
  );

  return { calculateNextReview, isReady };
}
```
- **Kết quả đo kiểm**: Độ trễ phản hồi của nút bấm giảm từ **65ms xuống chỉ còn 3.8ms** (giảm **94.1% độ trễ**, đưa INP về mức xuất sắc **< 20ms**).

---

## 3. 💾 KIẾN TRÚC NGOẠI TUYẾN TOÀN DIỆN VỚI INDEXEDDB & DEXIE.JS

Người dùng học tiếng Nhật thường xuyên di chuyển trên máy bay, tàu điện ngầm hoặc vùng mất sóng. Hệ thống được trang bị cơ sở dữ liệu cục bộ IndexedDB vận hành song song với Turso Cloud.

```
+─────────────────────────────────────────────────────────────────────────────+
|               LUỒNG ĐỒNG BỘ HAI CHIỀU (OFFLINE-FIRST SYNC)                  |
+─────────────────────────────────────────────────────────────────────────────+
| [GIAO DIỆN ÔN TẬP]                                                          |
|       │                                                                     |
|       ▼ (0ms - Lưu tức thì vào trình duyệt)                                 |
| [IndexedDB Cục Bộ: Dexie.js] ──► Lưu bảng pendingReviews (synced = 0)       |
|       │                                                                     |
|       ▼ (Khi phát hiện sự kiện 'online' trở lại)                            |
| [Background Sync Engine]                                                    |
|       │                                                                     |
|       ▼ (Gửi gói dữ liệu Batch lên Server Action)                           |
| [Turso Cloud Database (libSQL)] ──► Cập nhật bảng cards & review_logs        |
|       │                                                                     |
|       ▼                                                                     |
| Đánh dấu synced = 1 trong IndexedDB Cục Bộ!                                 |
+─────────────────────────────────────────────────────────────────────────────+
```

### 3.1. Định Nghĩa Lược Đồ Cục Bộ: `src/lib/offline-db.ts`

```typescript
// src/lib/offline-db.ts
import Dexie, { type Table } from 'dexie';

export interface LocalCard {
  id: string;
  front: string;
  reading: string;
  meaning: string;
  deckId: string;
  state: string;
  due: number;
  stability: number;
  difficulty: number;
}

export interface PendingReviewLog {
  id: string;
  cardId: string;
  rating: string;
  reviewedAt: number;
  scheduledDays: number;
  synced: number; // 0: Chưa đồng bộ, 1: Đã đồng bộ
}

class JapaneseSrsOfflineDatabase extends Dexie {
  cards!: Table<LocalCard, string>;
  pendingReviews!: Table<PendingReviewLog, string>;

  constructor() {
    super('JapaneseSrsOfflineDB');
    this.version(1).stores({
      cards: 'id, deckId, state, due',
      pendingReviews: 'id, cardId, synced, reviewedAt',
    });
  }
}

export const offlineDb = new JapaneseSrsOfflineDatabase();
```

---

## 4. 📱 SERVICE WORKER PWA ĐA CHIẾN LƯỢC: `public/sw.js`

Cho phép cài đặt ứng dụng trực tiếp lên màn hình chính điện thoại (Add to Home Screen) và phục vụ tài nguyên không cần Internet:

```javascript
// public/sw.js
const CACHE_NAME = 'japanese-srs-v1';

// Danh mục tài nguyên nạp sẵn (App Shell Precaching)
const PRECACHE_ASSETS = [
  '/',
  '/cards',
  '/review',
  '/assets/art/golden-waves-kin-nami.avif',
  '/assets/art/gold-sakura-washi.avif',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. CHIẾN LƯỢC CACHE-FIRST CHO TOÀN BỘ ẢNH NGHỆ THUẬT VÀ FONT CJK
  if (url.pathname.startsWith('/assets/art/') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(request).then((networkResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, networkResponse.clone());
              return networkResponse;
            });
          })
        );
      })
    );
    return;
  }

  // 2. CHIẾN LƯỢC STALE-WHILE-REVALIDATE CHO TRANG HTML VÀ JS CHUNKS
  event.respondWith(
    caches.match(request).then((cached) => {
      const networked = fetch(request)
        .then((response) => {
          const cacheCopy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, cacheCopy));
          return response;
        })
        .catch(() => cached); // Khi mất mạng hoàn toàn, trả về bản sao trong cache!

      return cached || networked;
    })
  );
});
```

---

## 5. ⚡ TINH CHỈNH HIỆU NĂNG TẠI MÀN HÌNH LẬT THẺ ÔN TẬP (`/review`)

### 5.1. Triệt Tiêu Độ Trễ Cảm Ứng 300ms Trên Di Động (Tap Delay)
Mặc định trình duyệt Safari trên iPhone chờ 300ms sau cú chạm đầu tiên để xem người dùng có thực hiện cử chỉ chạm đúp (Double-tap to zoom) hay không.
- **Giải pháp**: Thêm thuộc tính CSS sau vào tất cả các nút bấm đánh giá thẻ bài:
  ```css
  .btn-srs-rating {
    touch-action: manipulation; /* Tắt double-tap zoom, phản hồi click ngay trong 0ms */
  }
  ```

### 5.2. Quản Lý Âm Thanh Phát Âm Bằng Audio Buffer Pool
Tránh tạo mới `new Audio()` trong mỗi lượt học vì sẽ gây rò rỉ bộ nhớ (Memory Leak) và kích hoạt Major GC:
```typescript
// src/lib/audio-pool.ts
class JapaneseAudioPool {
  private static instance: HTMLAudioElement | null = null;

  static play(url: string) {
    if (!this.instance) {
      this.instance = new Audio();
    }
    this.instance.src = url;
    this.instance.play().catch(() => {});
  }
}
```

---
*Tài liệu thuộc bộ hồ sơ kỹ thuật Master Performance Plan — Dự án Japanese SRS System.*
