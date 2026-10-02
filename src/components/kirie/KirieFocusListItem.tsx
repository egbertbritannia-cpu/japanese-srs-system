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
  return (
    <div className="kirie-task-item">
      {/* Vạch sơn mài đứng mép trái */}
      <div className={`kirie-vertical-bar bar-${item.barColor}`} />

      {/* Nội dung từ vựng / Kanji */}
      <Link
        href={item.href}
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          textDecoration: 'none',
          color: 'inherit',
          marginLeft: '0.5rem',
        }}
      >
        <span className="kirie-task-text">{item.title}</span>
        {item.subtitle && (
          <span style={{ fontSize: '0.82rem', color: '#786A5E', marginLeft: '0.5rem', marginTop: '0.15rem' }}>
            {item.subtitle}
          </span>
        )}
      </Link>

      {/* Nút phát âm (nếu có audioText hoặc title) */}
      <div style={{ marginRight: '0.75rem', display: 'flex', alignItems: 'center' }}>
        <JapaneseSpeakerButton text={item.audioText || item.title} size={18} />
      </div>

      {/* Cấp độ / Thời gian & Huy hiệu viên thuốc Iwa-enogu */}
      <div className="kirie-task-meta">
        <span className="kirie-task-time">{item.timeOrLevel}</span>
        <Link href={item.href} style={{ textDecoration: 'none' }}>
          <span className={`kirie-pill pill-${item.statusType}`}>
            {item.statusText}
          </span>
        </Link>
      </div>
    </div>
  );
}
