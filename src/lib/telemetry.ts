/**
 * Real User Monitoring (RUM) Telemetry Module
 * Thu thập các chỉ số trải nghiệm thực tế (Core Web Vitals: LCP, INP, CLS) tại máy người dùng
 * và gửi về máy chủ bằng navigator.sendBeacon để không làm nghẽn Main Thread.
 * Căn cứ: doc/performance/07-monitoring.md (Mục 3)
 */

export interface TelemetryMetricPayload {
  metric: 'LCP' | 'INP' | 'CLS' | 'FID' | 'TTFB';
  value: number;
  rating?: 'good' | 'needs-improvement' | 'poor';
  url: string;
  timestamp: number;
  element?: string;
  interactionType?: string;
  deviceMemory?: number | string;
  effectiveType?: string;
}

let isInitialized = false;

export function initPerformanceTelemetry(): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;
  if (isInitialized) return;
  isInitialized = true;

  // 1. QUAN SÁT CHỈ SỐ LCP (Largest Contentful Paint)
  try {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        const val = Math.round(lastEntry.startTime);
        sendMetricToAnalytics({
          metric: 'LCP',
          value: val,
          rating: val <= 2000 ? 'good' : val <= 4000 ? 'needs-improvement' : 'poor',
          element: (lastEntry as any).element?.tagName || 'UNKNOWN',
        });
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {
    // Không hỗ trợ LCP observer
  }

  // 2. QUAN SÁT CHỈ SỐ INP / FID (Interaction to Next Paint / First Input Delay)
  try {
    const inpObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const duration = (entry as any).duration || (entry as any).processingDuration || 0;
        if (duration > 40) {
          sendMetricToAnalytics({
            metric: 'INP',
            value: Math.round(duration),
            rating: duration <= 80 ? 'good' : duration <= 200 ? 'needs-improvement' : 'poor',
            interactionType: (entry as any).name || 'interaction',
          });
        }
      }
    });
    inpObserver.observe({ type: 'first-input', buffered: true });
  } catch {
    // Không hỗ trợ first-input observer
  }

  // 3. QUAN SÁT CHỈ SỐ CLS (Cumulative Layout Shift)
  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value || 0;
        }
      }
      sendMetricToAnalytics({
        metric: 'CLS',
        value: parseFloat(clsValue.toFixed(4)),
        rating: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor',
      });
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch {
    // Không hỗ trợ layout-shift observer
  }
}

/**
 * Gửi dữ liệu đo lường về API /api/telemetry qua navigator.sendBeacon
 */
export function sendMetricToAnalytics(data: Partial<TelemetryMetricPayload>): boolean {
  if (typeof window === 'undefined') return false;

  const payload: TelemetryMetricPayload = {
    metric: data.metric || 'LCP',
    value: data.value ?? 0,
    rating: data.rating,
    url: window.location.pathname,
    timestamp: Date.now(),
    element: data.element,
    interactionType: data.interactionType,
    deviceMemory: (navigator as any).deviceMemory || 'UNKNOWN',
    effectiveType: (navigator as any).connection?.effectiveType || 'UNKNOWN',
  };

  const jsonStr = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    return navigator.sendBeacon('/api/telemetry', jsonStr);
  }

  // Fallback an toàn nếu sendBeacon không khả dụng
  fetch('/api/telemetry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: jsonStr,
    keepalive: true,
  }).catch(() => {});

  return true;
}
