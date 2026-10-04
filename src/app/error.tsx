'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App runtime error:', error);
  }, [error]);

  return (
    <div style={{ maxWidth: '640px', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
      <div
        className="card-karuta"
        style={{
          padding: '3.5rem 2rem',
          background: 'var(--washi-surface, #FAF8F2)',
          border: '1.5px solid var(--bengara-border, #E8A99F)',
          borderRadius: '18px',
          boxShadow: 'var(--shadow-karuta)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mincho)',
            fontSize: '3.5rem',
            fontWeight: 900,
            color: 'var(--bengara-red, #9E3223)',
            lineHeight: 1,
            marginBottom: '0.75rem',
          }}
        >
          不覚
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-mincho)',
            fontSize: '1.5rem',
            color: 'var(--sumi-deep, #1A1918)',
            marginBottom: '0.5rem',
          }}
        >
          Đã xảy ra sự cố không mong muốn
        </h2>

        <p
          style={{
            color: 'var(--sumi-body, #47433E)',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            marginBottom: '2rem',
          }}
        >
          Hệ thống ghi nhận sự gián đoạn tạm thời. Bạn có thể thử tải lại hoặc quay về trang chính.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={() => reset()} className="btn-torii">
            Thử Lại (再試行)
          </button>
          <Link href="/" className="btn-washi">
            Về Trang Chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
