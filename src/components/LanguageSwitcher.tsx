'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguageStore } from '@/store/languageStore';

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const { appLanguageMode, setLanguage } = useLanguageStore();

  const isEnglishRoute = pathname?.startsWith('/ielts');

  // Luôn đồng bộ trạng thái mode theo route hiện tại
  React.useEffect(() => {
    if (isEnglishRoute) {
      if (appLanguageMode !== 'en') setLanguage('en');
      document.documentElement.classList.add('english-mode');
    } else {
      if (appLanguageMode !== 'ja') setLanguage('ja');
      document.documentElement.classList.remove('english-mode');
    }
  }, [pathname, isEnglishRoute, appLanguageMode, setLanguage]);

  const handleToggle = () => {
    if (isEnglishRoute) {
      setLanguage('ja');
      router.push('/');
    } else {
      setLanguage('en');
      router.push('/ielts');
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      style={{
        padding: '0.4rem 0.85rem',
        borderRadius: '6px',
        border: isEnglishRoute ? '1px solid #A3C1AD' : '1px solid var(--washi-border)',
        background: isEnglishRoute ? '#002147' : '#9E3223',
        color: '#FFFFFF',
        fontFamily: isEnglishRoute ? 'var(--font-sans), sans-serif' : 'var(--font-maru), sans-serif',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '0.82rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
      }}
      title={isEnglishRoute ? "Chuyển về Tiếng Nhật (Kiokudō)" : "Chuyển sang Tiếng Anh (IELTS Tracker)"}
    >
      <span>{isEnglishRoute ? '🇬🇧' : '🇯🇵'}</span>
      <span>{isEnglishRoute ? 'IELTS Mode' : '日本語'}</span>
    </button>
  );
}
