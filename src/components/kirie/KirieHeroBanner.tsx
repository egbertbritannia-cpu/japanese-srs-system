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
  dueCount = 24,
  newCount = 10,
  learnedCount = 94,
}: KirieHeroBannerProps) {
  const [greeting, setGreeting] = useState('Good morning');
  const [japaneseGreeting, setJapaneseGreeting] = useState('おはようございます');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Good morning');
      setJapaneseGreeting('おはようございます');
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Good afternoon');
      setJapaneseGreeting('こんにちは');
    } else {
      setGreeting('Good evening');
      setJapaneseGreeting('こんばんは');
    }
  }, []);

  return (
    <div className="kirie-hero-wrapper">
      {/* 1. KHU VỰC THÔNG TIN CHÍNH (GREETING & PILL) */}
      <div className="kirie-hero-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="kirie-greeting-heading">
              {greeting}, {userName}
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.75)', margin: '-0.25rem 0 0.75rem', fontFamily: 'var(--font-maru)' }}>
              {japaneseGreeting} · Vươn buồm tri thức trên biển học ngàn trùng
            </p>
            <Link href="/review" style={{ textDecoration: 'none' }}>
              <div className="kirie-pill-badge">
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: dueCount > 0 ? '#F59E0B' : '#88A752' }} />
                <span>記憶道 · {dueCount} thẻ đến hạn hôm nay (FSRS Due)</span>
              </div>
            </Link>
          </div>

          {/* Avatar con dấu Inkan viền vàng phong cách Kirie */}
          <Link href="/review" style={{ textDecoration: 'none' }} title="Bắt đầu phiên ôn tập">
            <div className="kirie-user-avatar" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
              <span style={{ fontSize: '0.9rem', color: '#D9381E', fontWeight: 800 }}>日学</span>
            </div>
          </Link>
        </div>
      </div>

      {/* 2. MINH HỌA SÓNG GIẤY 3D VÀ THUYỀN ORIGAMI */}
      <div style={{ marginTop: '0.5rem', position: 'relative' }}>
        <KirieWaveIllustration />
      </div>
    </div>
  );
}
