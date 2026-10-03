// lighthouserc.js
// Cấu hình kiểm chuẩn hiệu năng tự động qua Lighthouse CI (LHCI)
// Căn cứ: doc/performance/07-monitoring.md (Mục 1)

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
