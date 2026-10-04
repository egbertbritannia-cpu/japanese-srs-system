'use client';

import React from 'react';
import { LessonCard } from './LessonCard';
import Link from 'next/link';

interface GrammarGalleryProps {
  lessons: any[];
  stats: {
    totalLessons: number;
    totalPatterns: number;
    totalCards: number;
    dueCards: number;
    newCards: number;
    reviewCards: number;
  };
}

export function GrammarGallery({ lessons, stats }: GrammarGalleryProps) {
  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', paddingBottom: '4rem' }}>
      {/* Hero Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1B4268 0%, #20507B 60%, #15324D 100%)',
          borderRadius: '20px',
          color: '#FFFFFF',
          padding: '2.5rem 2rem',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '2rem',
          boxShadow: '0 8px 30px rgba(27, 66, 104, 0.25)',
        }}
      >
        {/* Subtle Japanese Watermark in background (VIS-GRAM-02: Safe Viewport Coordinate & Contain) */}
        <div
          style={{
            position: 'absolute',
            right: '1rem',
            bottom: '0',
            fontSize: 'clamp(5rem, 14vw, 7.5rem)',
            fontWeight: 900,
            color: 'rgba(255, 255, 255, 0.06)',
            fontFamily: 'var(--font-mincho, "Shippori Mincho", serif)',
            pointerEvents: 'none',
            userSelect: 'none',
            contain: 'paint',
            maxWidth: '100%',
            lineHeight: 0.9,
          }}
        >
          文法
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.28rem 0.85rem',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              marginBottom: '0.85rem',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span>🏮 JPD133 · BUNBOU MASTER ENGINE</span>
          </div>

          {/* VIS-GRAM-01: Authentic Wabi-Sabi Editorial Typography */}
          <h1
            style={{
              fontSize: 'clamp(1.85rem, 4vw, 2.4rem)',
              margin: '0 0 0.5rem',
              fontWeight: 900,
              fontFamily: 'var(--font-mincho, "Shippori Mincho", serif)',
              letterSpacing: '0.02em',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.35)',
              color: '#FAF8F5',
            }}
          >
            Ngữ Pháp Tiếng Nhật
          </h1>

          <p
            style={{
              fontSize: '0.95rem',
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '620px',
              margin: '0 0 1.75rem',
              lineHeight: 1.6,
            }}
          >
            32 mẫu câu ngữ pháp cốt lõi Bài 8 - 11 Minna no Nihongo kèm 204 bài tập thực hành SBT và thuật toán lặp lại ngắt quãng FSRS.
          </p>

          {/* Quick Metrics Bar (VIS-GRAM-03: Woodblock Stream Progress & Metrics) */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                padding: '0.65rem 1.25rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>📚</span>
              <div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cấu trúc</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{stats.totalPatterns} Patterns</div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                padding: '0.65rem 1.25rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>✍️</span>
              <div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bài tập SBT</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>204 Bài</div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                padding: '0.65rem 1.25rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>⏱️</span>
              <div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>FSRS Cần ôn</div>
                <div
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: stats.dueCards > 0 ? '#FFCDD2' : '#C8E6C9',
                  }}
                >
                  {stats.dueCards} Thẻ
                </div>
              </div>
            </div>

            {/* Quick Practice All Button */}
            <Link
              href="/grammar/practice?lessonId=all"
              style={{
                marginLeft: 'auto',
                padding: '0.85rem 1.5rem',
                background: '#FFFFFF',
                color: '#1B4268',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.95rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.2s ease',
              }}
            >
              <span>⚡ Luyện tập ngẫu nhiên</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Lessons Grid Heading */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: '1.4rem',
            color: '#1F2421',
            fontFamily: 'var(--font-mincho, "Shippori Mincho", serif)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span>🌸 DANH SÁCH BÀI HỌC (JPD133)</span>
        </h2>
        <span style={{ fontSize: '0.85rem', color: '#888' }}>
          4 Bài · Bài 8 đến Bài 11
        </span>
      </div>

      {/* Grid of 4 Lessons */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
}
