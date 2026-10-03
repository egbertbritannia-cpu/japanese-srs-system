'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { KirieWaveIllustration } from './KirieWaveIllustration';

interface KirieHeroBannerProps {
  userName?: string;
  dueCount?: number;
  newCount?: number;
  learnedCount?: number;
}

export function KirieHeroBanner({
  userName = 'Yuna',
  dueCount = 6,
  newCount = 38,
  learnedCount = 94,
}: KirieHeroBannerProps) {
  const [greeting, setGreeting] = useState('Chào buổi sáng');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Chào buổi sáng');
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Chào buổi chiều');
    } else {
      setGreeting('Chào buổi tối');
    }
  }, []);

  return (
    <div className="kirie-hero-wrapper" style={{ margin: 0, borderBottomLeftRadius: '28px', borderBottomRightRadius: '28px' }}>
      {/* 1. KHU VỰC THÔNG TIN TIÊU ĐỀ: LỜI CHÀO & PILL & AVATAR YS */}
      <div className="kirie-hero-content" style={{ padding: '1.75rem 1.6rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="kirie-greeting-heading" style={{ fontSize: '1.9rem', marginBottom: '0.4rem' }}>
              {greeting}, {userName}
            </h1>
            <Link href="/review" style={{ textDecoration: 'none' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.35rem 0.9rem',
                  background: 'rgba(21, 52, 88, 0.72)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(85, 135, 185, 0.38)',
                  borderRadius: '9999px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: '#E8F1FA',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.16)',
                }}
              >
                <span>Hôm nay · {dueCount} thẻ cần ôn</span>
              </div>
            </Link>
          </div>

          {/* Avatar YS tròn viền vàng chuẩn ảnh tham chiếu */}
          <Link href="/review" style={{ textDecoration: 'none' }} title="Tài khoản học viên">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#FBF8F2',
                border: '2px solid #C89B58',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0D233A',
                fontFamily: 'var(--font-sans), sans-serif',
                fontSize: '1.15rem',
                fontWeight: 700,
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.22)',
                cursor: 'pointer',
              }}
            >
              YS
            </div>
          </Link>
        </div>
      </div>

      {/* 2. MINH HỌA SÓNG GIẤY 3D VÀ THUYỀN ORIGAMI */}
      <div style={{ marginTop: '0.35rem', position: 'relative' }}>
        <KirieWaveIllustration />
      </div>
    </div>
  );
}
