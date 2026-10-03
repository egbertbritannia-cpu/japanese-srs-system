import { describe, it, expect, vi } from 'vitest';
import { initPerformanceTelemetry, sendMetricToAnalytics } from '@/lib/telemetry';
import { POST as telemetryRoute } from '@/app/api/telemetry/route';
import { createCardAction, submitReviewAction } from '@/app/actions/srs';

describe('TẦNG 7: Giám Sát, CI/CD Pipeline & Telemetry Monitoring Suite', () => {
  it('tệp cấu hình lighthouserc.js hợp lệ và đáp ứng đầy đủ ngân sách hiệu năng', async () => {
    const lhciConfig = require('../lighthouserc.js');
    expect(lhciConfig).toBeDefined();
    expect(lhciConfig.ci).toBeDefined();
    expect(lhciConfig.ci.collect.numberOfRuns).toBe(3);
    expect(lhciConfig.ci.collect.url).toContain('http://localhost:3000/');
    expect(lhciConfig.ci.collect.url).toContain('http://localhost:3000/cards');
    expect(lhciConfig.ci.collect.url).toContain('http://localhost:3000/review');

    const assertions = lhciConfig.ci.assert.assertions;
    expect(assertions['categories:performance']).toEqual(['error', { minScore: 0.9 }]);
    expect(assertions['largest-contentful-paint']).toEqual(['error', { maxNumericValue: 2000 }]);
    expect(assertions['first-contentful-paint']).toEqual(['error', { maxNumericValue: 1200 }]);
    expect(assertions['cumulative-layout-shift']).toEqual(['error', { maxNumericValue: 0.05 }]);
  });

  it('module telemetry chạy an toàn trong môi trường SSR/Node', () => {
    // Không ném ngoại lệ khi window hoặc PerformanceObserver chưa tồn tại
    expect(() => initPerformanceTelemetry()).not.toThrow();
    expect(sendMetricToAnalytics({ metric: 'LCP', value: 1200 })).toBe(false);
  });

  it('API route /api/telemetry tiếp nhận dữ liệu hợp lệ và từ chối payload rỗng', async () => {
    // 1. Kiểm tra payload thiếu thông tin
    const invalidReq = new Request('http://localhost:3000/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const invalidRes = await telemetryRoute(invalidReq);
    expect(invalidRes.status).toBe(400);

    // 2. Kiểm tra payload hợp lệ
    const validReq = new Request('http://localhost:3000/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metric: 'LCP',
        value: 1450,
        rating: 'good',
        url: '/',
      }),
    });
    const validRes = await telemetryRoute(validReq);
    expect(validRes.status).toBe(200);
    const data = await validRes.json();
    expect(data.success).toBe(true);
    expect(data.metric).toBe('LCP');
    expect(data.value).toBe(1450);
  });

  it('React 19 Server Actions xử lý validate dữ liệu an toàn', async () => {
    const cardRes = await createCardAction({
      deckId: '',
      front: '',
      meaning: '',
    });
    expect(cardRes.success).toBe(false);
    expect(cardRes.error).toBeDefined();

    const reviewRes = await submitReviewAction({
      cardId: '',
      rating: '',
    });
    expect(reviewRes.success).toBe(false);
    expect(reviewRes.error).toBeDefined();
  });
});
