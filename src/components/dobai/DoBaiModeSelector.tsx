'use client';

import React from 'react';

export type DoBaiDrillDirection = 'forward' | 'reverse';

interface DoBaiModeSelectorProps {
  direction: DoBaiDrillDirection;
  onDirectionChange: (dir: DoBaiDrillDirection) => void;
  unlearnedCount: number;
  filterOnlyUnlearned: boolean;
  onToggleFilterOnlyUnlearned: () => void;
}

/**
 * Thanh chuyển đổi chế độ dò bài linh hoạt: Dò Thuận (JA->VI), Dò Nghịch (VI->JA), Luyện riêng từ nợ
 */
export function DoBaiModeSelector({
  direction,
  onDirectionChange,
  unlearnedCount,
  filterOnlyUnlearned,
  onToggleFilterOnlyUnlearned,
}: DoBaiModeSelectorProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.65rem',
        padding: '0.5rem 0.85rem',
        background: '#FAF8F5',
        border: '1px solid #EAE3D5',
        borderRadius: '12px',
        marginBottom: '1rem',
      }}
    >
      {/* Nút đổi chiều dò: Thuận / Nghịch */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <span
          style={{
            fontSize: '0.74rem',
            fontFamily: 'var(--font-mincho)',
            fontWeight: 700,
            color: '#717C75',
            marginRight: '0.2rem',
          }}
        >
          Chiều dò:
        </span>

        <button
          type="button"
          onClick={() => onDirectionChange('forward')}
          style={{
            padding: '0.3rem 0.65rem',
            fontSize: '0.78rem',
            fontFamily: 'var(--font-maru)',
            fontWeight: direction === 'forward' ? 700 : 500,
            color: direction === 'forward' ? '#FFFFFF' : '#4A5568',
            background: direction === 'forward' ? '#20507B' : 'transparent',
            border: direction === 'forward' ? '1px solid #20507B' : '1px solid #D8CFC0',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Thuận (Nhật ➔ Việt)
        </button>

        <button
          type="button"
          onClick={() => onDirectionChange('reverse')}
          style={{
            padding: '0.3rem 0.65rem',
            fontSize: '0.78rem',
            fontFamily: 'var(--font-maru)',
            fontWeight: direction === 'reverse' ? 700 : 500,
            color: direction === 'reverse' ? '#FFFFFF' : '#4A5568',
            background: direction === 'reverse' ? '#20507B' : 'transparent',
            border: direction === 'reverse' ? '1px solid #20507B' : '1px solid #D8CFC0',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Nghịch (Việt ➔ Nhật)
        </button>
      </div>

      {/* Nút lọc riêng các từ chưa thuộc (nếu có nợ) */}
      {unlearnedCount > 0 && (
        <button
          type="button"
          onClick={onToggleFilterOnlyUnlearned}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.3rem 0.65rem',
            fontSize: '0.78rem',
            fontFamily: 'var(--font-maru)',
            fontWeight: 700,
            color: filterOnlyUnlearned ? '#FFFFFF' : '#B5301E',
            background: filterOnlyUnlearned ? '#B5301E' : 'rgba(181, 48, 30, 0.08)',
            border: '1px solid #B5301E',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <span>⚡</span>
          <span>
            {filterOnlyUnlearned ? 'Đang dò riêng từ nợ' : `Luyện riêng ${unlearnedCount} từ chưa thuộc`}
          </span>
        </button>
      )}
    </div>
  );
}
