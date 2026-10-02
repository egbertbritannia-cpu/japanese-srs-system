'use client';

import React from 'react';
import Link from 'next/link';
import { JapaneseSpeakerButton } from '@/components/japanese/JapaneseSpeakerButton';

export interface KirieFocusItemData {
  id: string;
  title: string;
  subtitle?: string;
  timeOrLevel: string;
  statusText: string;
  statusType: 'due-now' | 'in-progress' | 'pending' | 'not-started' | 'blocked';
  barColor: 'navy' | 'denim' | 'gold' | 'matcha' | 'torii';
  href: string;
  audioText?: string;
}

export function KirieFocusListItem({ item }: { item: KirieFocusItemData }) {
  const barHexColors: Record<string, string> = {
    navy: '#1D4A72',
    denim: '#3B769E',
    gold: '#C89B58',
    matcha: '#4A7F9F',
    torii: '#162C42',
  };

  const pillStyles: Record<string, { bg: string; color: string }> = {
    'due-now': { bg: '#C29B63', color: '#FFFFFF' },
    'in-progress': { bg: '#4A7C9F', color: '#FFFFFF' },
    'pending': { bg: '#D2A679', color: '#2C1B0E' },
    'not-started': { bg: '#B0BFC9', color: '#1A2832' },
    'blocked': { bg: '#162C42', color: '#FFFFFF' },
  };

  const pill = pillStyles[item.statusType] || pillStyles['due-now'];
  const barColor = barHexColors[item.barColor] || '#1D4A72';

  return (
    <div
      style={{
        position: 'relative',
        background: '#FAF7F0',
        border: '1.2px solid #EBE4D6',
        borderRadius: '12px',
        padding: '0.9rem 1.15rem 0.9rem 1.4rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 6px rgba(45, 35, 20, 0.04)',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      {/* Vạch sơn mài đứng mép trái */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '5px',
          background: barColor,
          borderTopLeftRadius: '12px',
          borderBottomLeftRadius: '12px',
        }}
      />

      {/* Tiêu đề & phụ đề */}
      <Link
        href={item.href}
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          textDecoration: 'none',
          color: 'inherit',
          paddingRight: '0.5rem',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-sans), sans-serif',
            fontWeight: 600,
            fontSize: '0.94rem',
            color: '#142536',
            letterSpacing: '-0.01em',
          }}
        >
          {item.title}
        </span>
        {item.subtitle && (
          <span
            style={{
              fontSize: '0.78rem',
              color: '#766759',
              marginTop: '0.15rem',
              fontFamily: 'var(--font-sans), sans-serif',
            }}
          >
            {item.subtitle}
          </span>
        )}
      </Link>

      {/* Cụm tương tác: Audio + Thời gian + Huy hiệu viên thuốc */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexShrink: 0 }}>
        {item.audioText && (
          <JapaneseSpeakerButton text={item.audioText} size={16} />
        )}
        <span
          style={{
            fontFamily: 'var(--font-sans), monospace',
            fontSize: '0.88rem',
            fontWeight: 600,
            color: '#6E6258',
          }}
        >
          {item.timeOrLevel}
        </span>
        <Link href={item.href} style={{ textDecoration: 'none' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '0.28rem 0.85rem',
              borderRadius: '9999px',
              fontFamily: 'var(--font-sans), sans-serif',
              fontSize: '0.76rem',
              fontWeight: 700,
              background: pill.bg,
              color: pill.color,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              letterSpacing: '0.01em',
              whiteSpace: 'nowrap',
            }}
          >
            {item.statusText}
          </span>
        </Link>
      </div>
    </div>
  );
}
