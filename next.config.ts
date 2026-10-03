import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 1. Tối ưu hóa xử lý hình ảnh tự động qua next/image
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // Cache 1 năm trên Edge CDN
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // 2. Nén tài nguyên với Brotli & Gzip
  compress: true,

  // 3. Loại bỏ header nhận diện công nghệ x-powered-by
  poweredByHeader: false,

  // 4. Các tính năng tối ưu hóa trình biên dịch của Next.js 15
  experimental: {
    optimizePackageImports: [
      'drizzle-orm',
      'ts-fsrs',
      'lucide-react',
      '@libsql/client',
    ],
  },

  // 5. Cấu hình Cache-Control headers chuẩn cho Static Assets & CDN
  async headers() {
    return [
      {
        source: '/assets/art/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/cards',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
