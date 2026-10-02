'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function KirieBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Tổng quan', href: '/', icon: '🏯' },
    { label: 'Kho thẻ', href: '/cards', icon: '📜' },
    { label: 'AI Soạn', href: '/cards/new', icon: '✨' },
    { label: 'Tiện ích', href: '/integrations', icon: '🌐' },
    { label: 'Ôn tập', href: '/review', icon: '⛩️' },
  ];

  return (
    <nav className="kirie-bottom-bar" aria-label="Điều hướng chính phong cách Kirie">
      {navItems.map((item) => {
        const isActive =
          item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`kirie-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="kirie-nav-icon-box">
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
            </div>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
