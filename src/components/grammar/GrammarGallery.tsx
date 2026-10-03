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
        {/* Subtle Japanese Watermark in background */}
        <div
          style={{
            position: 'absolute',
            right: '-10px',
            bottom: '-25px',
            fontSize: '9rem',
            fontWeight: 900,
            color: 'rgba(255, 255, 255, 0.06)',
            fontFamily: 'var(--font-mincho, "Shippori Mincho", serif)',
            pointerEvents: 'none',
            userSelect: 'none',
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
              padding: '0.25rem 0.75rem',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              marginBottom: '0.75rem',
            }}
          >
            <span>🏮 JPD133 · BUNBOU ENGINE</span>
          </div>

          <h1
            style={{
              fontSize: '2.4rem',
              margin: '0 0 0.5rem',
              fontWeight: 900,
              fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
              letterSpacing: '0.03em',
            }}
          >
            NGỮ PHÁP TIẾNG NHẬT
          </h1>

          <p
            style={{
              fontSize: '1rem',
              color: 'rgba(255, 255, 255, 0.85)',
              maxWidth: '600px',
              margin: '0 0 1.75rem',
              lineHeight: 1.5,
            }}
          >
            32 mẫu câu ngữ pháp cốt lõi Bài 8 - 11 Minna no Nihongo kèm 204 bài tập thực hành SBT và thuật toán lặp lại ngắt quãng FSRS.
          </p>

          {/* Quick Metrics Bar */}
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
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>📚</span>
              <div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8, textTransform: 'uppercase' }}>Cấu trúc</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{stats.totalPatterns} Patterns</div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                padding: '0.65rem 1.25rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>✍️</span>
              <div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8, textTransform: 'uppercase' }}>Bài tập SBT</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>204 Bài</div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                padding: '0.65rem 1.25rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>⏱️</span>
              <div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8, textTransform: 'uppercase' }}>FSRS Cần ôn</div>
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
                transition: 'transform 0.15s ease',
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
