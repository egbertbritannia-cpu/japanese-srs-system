'use client';

import React from 'react';
import { useLanguageStore } from '@/store/languageStore';
import { useRouter, usePathname } from 'next/navigation';

export function LanguageSwitcher() {
  const { appLanguageMode, setLanguage } = useLanguageStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleToggle = () => {
    const nextMode = appLanguageMode === 'ja' ? 'en' : 'ja';
    setLanguage(nextMode);

    if (nextMode === 'en') {
      router.push('/ielts');
    } else {
      router.push('/');
    }
  };

  React.useEffect(() => {
    if (appLanguageMode === 'en') {
      document.documentElement.classList.add('english-mode');
    } else {
      document.documentElement.classList.remove('english-mode');
    }
  }, [appLanguageMode]);

  React.useEffect(() => {
    // Also toggle based on pathname to ensure correct state if navigating directly
    if (pathname.startsWith('/ielts') && appLanguageMode !== 'en') {
        useLanguageStore.getState().setLanguage('en');
    } else if (!pathname.startsWith('/ielts') && appLanguageMode !== 'ja') {
        useLanguageStore.getState().setLanguage('ja');
    }
  }, [pathname, appLanguageMode]);

  // Don't render until hydration completes to avoid hydration mismatch
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={handleToggle}
      className="language-switcher-btn"
      style={{
        padding: '0.4rem 0.8rem',
        borderRadius: '6px',
        border: '1px solid var(--washi-border)',
        background: appLanguageMode === 'ja' ? '#9E3223' : '#002147',
        color: '#FFFFFF',
        fontFamily: appLanguageMode === 'ja' ? 'var(--font-maru)' : 'var(--font-serif)',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '0.8rem'
      }}
      title={appLanguageMode === 'ja' ? "Chuyển sang tiếng Anh (IELTS)" : "Switch to Japanese (Kiokudō)"}
    >
      {appLanguageMode === 'ja' ? '🇬🇧 EN' : '🇯🇵 JA'}
    </button>
  );
}
