'use client';

import React, { useState, useEffect } from 'react';

/**
 * Nút chuyển đổi Chế độ Màn đêm Mực Nho Sumi-e (Mikazuki Theme Toggle - 三日月)
 * Chuẩn mỹ học Wabi-Sabi Phù Tang (DEF-UI-SHELL-004)
 */
export function MikazukiThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('kiokudo_theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('sumi-night');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.classList.remove('sumi-night');
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);

    if (nextDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('sumi-night');
      localStorage.setItem('kiokudo_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.classList.remove('sumi-night');
      localStorage.setItem('kiokudo_theme', 'light');
    }
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isDark ? 'Chế độ Mực Nho (Nhấn để về Giấy Washi)' : 'Chế độ Giấy Washi (Nhấn để bật Mực Nho)'}
      aria-label={isDark ? 'Chuyển sang chế độ sáng Giấy Washi' : 'Chuyển sang chế độ tối Mực Nho Sumi-e'}
      style={{
        padding: '0.45rem 0.75rem',
        borderRadius: '8px',
        border: `1.2px solid ${isDark ? '#4A5B73' : '#BDCCDC'}`,
        background: isDark ? '#1F2C3F' : '#FFFFFF',
        color: isDark ? '#FDD663' : '#16253B',
        cursor: 'pointer',
        fontSize: '0.88rem',
        fontFamily: 'var(--font-maru)',
        fontWeight: 700,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        transition: 'all 0.2s ease',
        boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <span style={{ fontSize: '1rem', lineHeight: 1 }}>{isDark ? '🌙' : '☀️'}</span>
      <span style={{ fontSize: '0.78rem' }}>{isDark ? 'Mực Nho' : 'Giấy Sáng'}</span>
    </button>
  );
}
