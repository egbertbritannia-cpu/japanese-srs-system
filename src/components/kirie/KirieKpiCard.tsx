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
      style={{ cursor: (href || onClick) ? 'pointer' : 'default', textDecoration: 'none' }}
    >
      <span className="kirie-kpi-label">{title}</span>
      <span className={`kirie-kpi-number number-${accent}`}>{value}</span>
      <p className="kirie-kpi-desc">{subtitle}</p>

      {/* Mảnh giấy màu cắt góc dưới đặc trưng phong cách Kirie */}
      <div className={`kirie-corner-cutout cutout-${accent}`} aria-hidden="true" />
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
