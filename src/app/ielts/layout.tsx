'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function IeltsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'The Study', href: '/ielts' },
    { label: 'Session Tracker', href: '/ielts/session' },
    { label: 'Review & Analysis', href: '/ielts/review' },
  ];

  return (
    <div className="english-mode" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* British IELTS Navbar */}
      <nav style={{
        backgroundColor: 'var(--primary-color)',
        color: '#FDFBF7',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        borderBottom: '4px solid var(--secondary-color)'
      }}>
        <div style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          letterSpacing: '1px'
        }}>
          🇬🇧 IELTS Tracker
        </div>

        <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  color: isActive ? 'var(--secondary-color)' : '#FDFBF7',
                  textDecoration: 'none',
                  fontWeight: isActive ? 'bold' : 'normal',
                  fontFamily: 'var(--font-sans)',
                  padding: '0.5rem 1rem',
                  border: isActive ? '1px solid var(--secondary-color)' : '1px solid transparent',
                  borderRadius: '4px'
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, backgroundColor: 'var(--bg-color)' }}>
        {children}
      </main>
    </div>
  );
}
