'use client';

import React, { useState } from 'react';
import { japaneseAudio } from './AudioEffects';
import { JapaneseAudioPool } from '@/lib/audio-pool';
import { stripCloze } from '@/lib/cloze';

interface SpeakerButtonProps {
  text: string;
  size?: number;
  label?: string;
  audioUrl?: string;
}

export function JapaneseSpeakerButton({ text, size = 18, label, audioUrl }: SpeakerButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
    const cleanText = stripCloze(text).replace(/\s*\((On|Kun):[^)]*\)/gi, '').trim();

    if (audioUrl) {
      JapaneseAudioPool.play(audioUrl);
      setTimeout(() => setIsPlaying(false), 1200);
    } else {
      japaneseAudio.speak(cleanText, () => setIsPlaying(false));
      // Fallback timer dựa trên độ dài văn bản
      setTimeout(() => setIsPlaying(false), Math.max(1200, cleanText.length * 200));
    }
  };

  return (
    <button
      type="button"
      className="btn-karuta-action"
      onClick={handleClick}
      title={`Nghe phát âm: ${text}`}
      style={{
        touchAction: 'manipulation',
        background: 'none',
        border: '1px solid var(--washi-border)',
        borderRadius: '6px',
        padding: '0.25rem 0.5rem',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        color: isPlaying ? 'var(--torii-red)' : 'var(--matcha-deep)',
        backgroundColor: isPlaying ? 'var(--torii-subtle)' : 'var(--washi-surface)',
        transition: 'all 0.2s',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transform: isPlaying ? 'scale(1.15)' : 'scale(1)',
          transition: 'transform 0.2s',
        }}
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill={isPlaying ? 'currentColor' : 'none'} />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
      {label && (
        <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-maru)', fontWeight: 600 }}>
          {label}
        </span>
      )}
    </button>
  );
}
