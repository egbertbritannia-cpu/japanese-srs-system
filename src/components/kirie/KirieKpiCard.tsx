'use client';

import React from 'react';
import Link from 'next/link';

interface KirieKpiCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  accent: 'blue' | 'gold' | 'green';
  href?: string;
  onClick?: () => void;
}

export function KirieKpiCard({ title, value, subtitle, accent, href, onClick }: KirieKpiCardProps) {
  const cardContent = (
    <div
      className="kirie-kpi-card"
      onClick={onClick}
      style={{
        cursor: (href || onClick) ? 'pointer' : 'default',
        textDecoration: 'none',
        position: 'relative',
        background: '#FAF6EE',
        border: '1.2px solid #E6DDCF',
        borderRadius: '16px',
        padding: '1.1rem 1rem 1.4rem',
        boxShadow: '0 4px 12px rgba(45, 35, 20, 0.07), 0 1px 3px rgba(45, 35, 20, 0.04)',
        minHeight: '135px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      }}
    >
      <div>
        <span
          className="kirie-kpi-label"
          style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#1A2938',
            marginBottom: '0.35rem',
            fontFamily: 'var(--font-sans), sans-serif',
          }}
        >
          {title}
        </span>
        <span
          className={`kirie-kpi-number number-${accent}`}
          style={{
            display: 'block',
            fontSize: '2.5rem',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            fontFamily: 'var(--font-mincho), serif',
          }}
        >
          {value}
        </span>
      </div>

      <p
        className="kirie-kpi-desc"
        style={{
          margin: '0.45rem 0 0',
          fontSize: '0.74rem',
          color: '#6E6155',
          fontFamily: 'var(--font-sans), sans-serif',
          lineHeight: 1.25,
          zIndex: 2,
        }}
      >
        {subtitle}
      </p>

      {/* Mảnh giấy màu cắt lượn sóng góc dưới chân thẻ chuẩn xác theo ảnh mẫu */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '54px',
          height: '36px',
          borderTopLeftRadius: '28px',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        <svg viewBox="0 0 54 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          {accent === 'blue' && (
            <>
              <path d="M12 36 C24 18, 38 24, 54 10 L54 36 Z" fill="#20527D" />
              <path d="M26 36 C35 22, 44 26, 54 18 L54 36 Z" fill="#4B80A8" />
            </>
          )}
          {accent === 'gold' && (
            <>
              <path d="M10 36 C22 16, 36 22, 54 8 L54 36 Z" fill="#B8853C" />
              <path d="M24 36 C34 20, 42 25, 54 16 L54 36 Z" fill="#D6A65C" />
            </>
          )}
          {accent === 'green' && (
            <>
              <path d="M10 36 C20 18, 35 22, 54 12 L54 36 Z" fill="#2B6B3D" />
              <path d="M22 36 C32 20, 40 24, 54 18 L54 36 Z" fill="#4C8C5E" />
            </>
          )}
        </svg>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
