'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'japanese-srs-theme';

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

export function MikazukiThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const initial: Theme =
      stored === 'dark' || stored === 'light'
        ? stored
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';

    setTheme(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang Sumi-e Night'}
      aria-pressed={theme === 'dark'}
      title={theme === 'dark' ? 'Sumi-e Night đang bật' : 'Bật Sumi-e Night'}
      style={{
        width: '38px',
        height: '38px',
        borderRadius: '10px',
        border: '1px solid var(--washi-border)',
        background: 'var(--washi-surface)',
        color: 'var(--sumi-ink)',
        fontFamily: 'var(--font-mincho)',
        fontWeight: 800,
        cursor: 'pointer',
      }}
    >
      {mounted && theme === 'dark' ? '日' : '月'}
    </button>
  );
}
