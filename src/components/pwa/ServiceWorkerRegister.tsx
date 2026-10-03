'use client';

import { useEffect } from 'react';
import { syncPendingReviewsToServer } from '@/lib/offline-db';

/**
 * ServiceWorkerRegister Component
 * Đăng ký Service Worker và lắng nghe sự kiện khôi phục kết nối mạng (online)
 * để tự động kích hoạt tiến trình đồng bộ dữ liệu ngoại tuyến (Offline Sync Engine).
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Đăng ký Service Worker trong môi trường hỗ trợ
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[PWA] Service Worker đăng ký thành công, phạm vi:', registration.scope);
          })
          .catch((error) => {
            console.warn('[PWA] Đăng ký Service Worker thất bại:', error);
          });
      });
    }

    // 2. Cơ chế tự động đồng bộ khi thiết bị có mạng trở lại (Online Event Listener)
    const handleOnline = async () => {
      console.log('[Offline Sync] Phát hiện kết nối Internet được khôi phục. Đang đồng bộ...');
      const result = await syncPendingReviewsToServer();
      if (result.synced > 0) {
        console.log(`[Offline Sync] Đã đồng bộ thành công ${result.synced} lượt ôn tập lên máy chủ.`);
      }
    };

    window.addEventListener('online', handleOnline);

    // Thử đồng bộ ngay khi nạp trang nếu đang online
    if (navigator.onLine) {
      syncPendingReviewsToServer();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return null;
}
