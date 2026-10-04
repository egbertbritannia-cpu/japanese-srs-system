'use client';

import React from 'react';
import { useLanguageStore } from '@/store/languageStore';

export function LanguageSwitcher() {
  const { appLanguageMode, toggleLanguage } = useLanguageStore();

  // Khi ở chế độ tiếng Anh, ta có thể áp class 'english-mode' vào thẻ html hoặc body.
  // Thực tế, để đồng bộ với React, ta dùng useEffect.
  React.useEffect(() => {
    if (appLanguageMode === 'en') {
      document.documentElement.classList.add('english-mode');
    } else {
      document.documentElement.classList.remove('english-mode');
    }
  }, [appLanguageMode]);

  return (
    <button
      onClick={toggleLanguage}
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
      {appLanguageMode === 'ja' ? '🇯🇵 JA' : '🇬🇧 EN'}
    </button>
  );
}
