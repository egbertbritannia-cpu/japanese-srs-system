'use client';

import React, { useState, useEffect } from 'react';
import { japaneseAudio } from '@/components/japanese/AudioEffects';

/**
 * Nút chuyển đổi âm thanh toàn hệ thống (Global Audio Mute Toggle)
 * Biểu tượng chuông gió Furin (風鈴) Nhật Bản
 * Phục vụ học tập tại thư viện, nơi yên tĩnh (DEF-UI-SHELL-004)
 */
export function GlobalSoundToggle() {
  const [muted, setMuted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMuted(japaneseAudio.getMuted());

    const handleMuteChange = (e: any) => {
      if (e.detail && typeof e.detail.muted === 'boolean') {
        setMuted(e.detail.muted);
      }
    };

    window.addEventListener('japanese_audio_mute_change', handleMuteChange);
    return () => window.removeEventListener('japanese_audio_mute_change', handleMuteChange);
  }, []);

  const handleToggle = () => {
    const nextMuted = japaneseAudio.toggleMute();
    setMuted(nextMuted);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={handleToggle}
      type="button"
      title={muted ? 'Âm thanh: Đã tắt (Nhấn để bật)' : 'Âm thanh: Đang bật (Nhấn để tắt)'}
      aria-label={muted ? 'Bật âm thanh hệ thống' : 'Tắt âm thanh hệ thống'}
      style={{
        padding: '0.45rem 0.75rem',
        borderRadius: '8px',
        border: `1.2px solid ${muted ? '#E2D7C5' : '#BDCCDC'}`,
        background: muted ? '#F5F2EC' : '#FFFFFF',
        color: muted ? '#A89F91' : '#1E4B75',
        cursor: 'pointer',
        fontSize: '0.88rem',
        fontFamily: 'var(--font-maru)',
        fontWeight: 700,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        transition: 'all 0.2s ease',
        boxShadow: muted ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <span style={{ fontSize: '1rem', lineHeight: 1 }}>{muted ? '🔇' : '🎐'}</span>
      <span style={{ fontSize: '0.78rem' }}>{muted ? 'Yên lặng' : 'Âm thanh'}</span>
    </button>
  );
}
