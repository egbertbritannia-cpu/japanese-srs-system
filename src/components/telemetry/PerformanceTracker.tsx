'use client';

import { useEffect } from 'react';
import { initPerformanceTelemetry } from '@/lib/telemetry';

/**
 * PerformanceTracker Component
 * Tự động kích hoạt bộ quan sát PerformanceObserver viễn thám người dùng thực tế
 * ngay sau khi giao diện ban đầu đã mount hoàn tất.
 */
export function PerformanceTracker() {
  useEffect(() => {
    initPerformanceTelemetry();
  }, []);

  return null;
}
