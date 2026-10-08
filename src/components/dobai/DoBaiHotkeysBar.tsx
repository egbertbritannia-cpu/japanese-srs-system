'use client';

import React from 'react';

interface DoBaiHotkeysBarProps {
  isRevealed: boolean;
  onReveal: () => void;
  onMastered: () => void;
  onRetry: () => void;
  onUndo: () => void;
  canUndo: boolean;
  onPronounce?: () => void;
}

/**
 * Thanh chỉ dẫn phím tắt và thao tác phản xạ công thái học phong cách Wa-Style
 */
export function DoBaiHotkeysBar({
  isRevealed,
  onReveal,
  onMastered,
  onRetry,
  onUndo,
  canUndo,
  onPronounce,
}: DoBaiHotkeysBarProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        padding: '0.85rem 1.25rem',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid #E8E2D8',
        borderRadius: '14px',
        boxShadow: '0 4px 16px rgba(31, 36, 33, 0.04)',
        marginTop: '1.25rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <span
          style={{
            fontSize: '0.76rem',
            fontFamily: 'var(--font-mincho)',
            fontWeight: 800,
            color: '#8C6B3E',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          Phím tắt phản xạ:
        </span>

        <button
          type="button"
          onClick={onReveal}
          style={{ ...hotkeyBtnStyle, color: '#555F58' }}
          title="Nhấn phím Space hoặc nhấp vào đây để Hiện/Ẩn đáp án"
        >
          <kbd style={kbdStyle}>Space</kbd>
          <span>{isRevealed ? 'Ẩn đáp án' : 'Hiện đáp án'}</span>
        </button>

        <button
          type="button"
          onClick={onMastered}
          disabled={!isRevealed}
          style={{
            ...hotkeyBtnStyle,
            color: isRevealed ? '#386641' : '#A89F91',
            cursor: isRevealed ? 'pointer' : 'not-allowed',
            opacity: isRevealed ? 1 : 0.6,
          }}
          title="Nhấn Enter hoặc phím 1 để ghi nhận Đã thuộc"
        >
          <kbd style={{ ...kbdStyle, borderColor: isRevealed ? '#386641' : '#D8CFC0', color: isRevealed ? '#386641' : '#A89F91' }}>Enter / 1</kbd>
          <span style={{ fontWeight: 600 }}>Đã thuộc</span>
        </button>

        <button
          type="button"
          onClick={onRetry}
          disabled={!isRevealed}
          style={{
            ...hotkeyBtnStyle,
            color: isRevealed ? '#B5301E' : '#A89F91',
            cursor: isRevealed ? 'pointer' : 'not-allowed',
            opacity: isRevealed ? 1 : 0.6,
          }}
          title="Nhấn Backspace hoặc phím 2 để ghi nhận Chưa thuộc và đưa vào hàng đợi Cột D-E-F"
        >
          <kbd style={{ ...kbdStyle, borderColor: isRevealed ? '#B5301E' : '#D8CFC0', color: isRevealed ? '#B5301E' : '#A89F91' }}>Bksp / 2</kbd>
          <span style={{ fontWeight: 600 }}>Chưa thuộc</span>
        </button>

        {onPronounce && (
          <button
            type="button"
            onClick={onPronounce}
            style={{ ...hotkeyBtnStyle, color: '#717C75' }}
            title="Nhấn phím P hoặc nhấp vào đây để nghe lại phát âm"
          >
            <kbd style={kbdStyle}>P</kbd>
            <span>Loa</span>
          </button>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {canUndo && (
          <button
            onClick={onUndo}
            type="button"
            title="Hoàn tác lần chấm trước (Phím Z)"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.75rem',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-maru)',
              fontWeight: 600,
              background: '#F0ECE1',
              border: '1px solid #D8CFC0',
              borderRadius: '8px',
              color: '#4A5568',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <span>↩</span>
            <span>Hoàn tác (Z)</span>
          </button>
        )}
      </div>
    </div>
  );
}

const kbdStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '0.15rem 0.45rem',
  fontSize: '0.72rem',
  fontFamily: 'ui-monospace, monospace',
  fontWeight: 700,
  lineHeight: 1,
  color: '#2D3748',
  backgroundColor: '#FAF8F5',
  border: '1px solid #CBD5E0',
  borderRadius: '4px',
  boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
};

const hotkeyBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  fontSize: '0.8rem',
  background: 'transparent',
  border: 'none',
  padding: '0.2rem 0.4rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontFamily: 'var(--font-maru)',
  transition: 'background 0.15s ease',
};
