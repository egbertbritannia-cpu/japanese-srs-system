// public/sw.js
// Service Worker PWA Đa Chiến Lược — Dự án Japanese SRS System
// Căn cứ: doc/performance/06-runtime-performance.md (Mục 4)

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
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Lỗi nạp một số tài nguyên precache:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Bỏ qua các yêu cầu không phải GET hoặc extension schemes
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return;
  }

  const url = new URL(request.url);

  // 1. CHIẾN LƯỢC CACHE-FIRST CHO TOÀN BỘ ẢNH NGHỆ THUẬT VÀ FONT CJK
  if (url.pathname.startsWith('/assets/art/') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const cacheCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, cacheCopy));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 2. KHÔNG CACHE CÁC ROUTE API DYNAMIC (/api/*) ĐỂ TRÁNH DỮ LIỆU CŨ KHI ONLINE
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // 3. CHIẾN LƯỢC STALE-WHILE-REVALIDATE CHO TRANG HTML VÀ JS/CSS CHUNKS
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const cacheCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, cacheCopy));
          }
          return networkResponse;
        })
        .catch(() => {
          // Khi mất mạng hoàn toàn, nếu không có cache thì trả về trang chủ đệm
          if (cached) return cached;
          if (request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/');
          }
          return new Response('Mất kết nối mạng', { status: 503, statusText: 'Offline' });
        });

      return cached || fetchPromise;
    })
  );
});
