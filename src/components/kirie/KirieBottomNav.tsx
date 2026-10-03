'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function KirieBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      id: 'home',
      label: 'Trang chủ',
      href: '/',
      icon: (active: boolean) => (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill={active ? 'currentColor' : 'none'} />
          <polyline points="9 22 9 12 15 12 15 22" stroke={active ? '#20507B' : 'currentColor'} />
        </svg>
      ),
    },
    {
      id: 'cards',
      label: 'Bộ thẻ',
      href: '/cards',
      icon: (active: boolean) => (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
    },
    {
      id: 'new',
      label: 'Thêm thẻ',
      href: '/cards/new',
      icon: (_active: boolean) => (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
    },
    {
      id: 'review',
      label: 'Ôn tập',
      href: '/review',
      icon: (_active: boolean) => (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="kirie-bottom-bar" aria-label="Điều hướng chính phong cách Kirie">
      <div
        style={{
          maxWidth: '540px',
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href.split('?')[0]);

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`kirie-nav-item ${isActive ? 'active' : ''}`}
            >
              <div
                className="kirie-nav-icon-box"
                style={{
                  background: isActive ? '#20507B' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#8B7B6D',
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 3px 8px rgba(32, 80, 123, 0.35)' : 'none',
                }}
              >
                {item.icon(isActive)}
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-sans), sans-serif',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#20507B' : '#8B7B6D',
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
