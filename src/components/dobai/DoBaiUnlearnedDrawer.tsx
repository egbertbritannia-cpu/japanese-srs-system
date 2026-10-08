'use client';

import React from 'react';

export interface UnlearnedItem {
  id: string;
  kanji: string;
  reading?: string;
  meaning: string;
  repeatInTurns: number;
}

interface DoBaiUnlearnedDrawerProps {
  unlearnedList: UnlearnedItem[];
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onItemClick?: (item: UnlearnedItem) => void;
}

/**
 * Ngăn kéo / Cột hiển thị Danh sách Từ Chưa Thuộc Trong Phiên
 * Tương ứng chuẩn xác với Cột D, E, F trong Sheet "Tu dò bài" (Dò bài - Minna.xlsm)
 */
export function DoBaiUnlearnedDrawer({
  unlearnedList,
  isOpenMobile = false,
  onCloseMobile,
  onItemClick,
}: DoBaiUnlearnedDrawerProps) {
  return (
    <aside
      style={{
        background: '#FAF8F5',
        border: '1.5px solid #E4DAC9',
        borderRadius: '16px',
        padding: '1.25rem 1rem',
        boxShadow: '0 4px 20px rgba(31, 36, 33, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '380px',
      }}
    >
      {/* Header thanh nợ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '0.75rem',
          borderBottom: '1.5px solid #EAE3D5',
          marginBottom: '0.85rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span style={{ fontSize: '1.1rem' }}>📋</span>
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-mincho)',
                fontSize: '0.95rem',
                fontWeight: 800,
                color: '#1F2421',
                margin: 0,
              }}
            >
              Từ Chưa Thuộc (Cột D-E-F)
            </h3>
            <span style={{ fontSize: '0.72rem', color: '#717C75', fontFamily: 'var(--font-maru)' }}>
              Tự động xen kẽ lặp lại trong phiên
            </span>
          </div>
        </div>

        <span
          style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-maru)',
            fontWeight: 700,
            padding: '0.2rem 0.55rem',
            borderRadius: '999px',
            background: unlearnedList.length > 0 ? '#B5301E' : '#386641',
            color: '#FFFFFF',
          }}
        >
          {unlearnedList.length} từ
        </span>
      </div>

      {/* Nội dung danh sách */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          maxHeight: '480px',
        }}
      >
        {unlearnedList.length === 0 ? (
          <div
            style={{
              padding: '2.5rem 1rem',
              textAlign: 'center',
              color: '#8C9B90',
              fontFamily: 'var(--font-maru)',
              fontSize: '0.85rem',
            }}
          >
            <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>🎉</div>
            <p style={{ margin: 0, fontWeight: 600, color: '#386641' }}>
              Chưa có từ nợ trong phiên!
            </p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#717C75' }}>
              Các từ bạn bấm "Chưa thuộc" sẽ xuất hiện ở đây để dò lại.
            </p>
          </div>
        ) : (
          unlearnedList.map((item, idx) => (
            <div
              key={item.id + idx}
              onClick={() => onItemClick && onItemClick(item)}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E8E2D8',
                borderRadius: '10px',
                padding: '0.65rem 0.75rem',
                cursor: onItemClick ? 'pointer' : 'default',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mincho)',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    color: '#1F2421',
                  }}
                >
                  {item.kanji}
                </span>
                {item.reading && item.reading !== item.kanji && (
                  <span
                    style={{
                      fontFamily: 'var(--font-maru)',
                      fontSize: '0.8rem',
                      color: '#20507B',
                      fontWeight: 600,
                    }}
                  >
                    {item.reading}
                  </span>
                )}
              </div>

              <p
                style={{
                  margin: '0.2rem 0 0.35rem',
                  fontSize: '0.78rem',
                  color: '#4A5568',
                  fontFamily: 'var(--font-maru)',
                  lineHeight: 1.35,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.meaning}
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.7rem',
                  color: '#717C75',
                  paddingTop: '0.25rem',
                  borderTop: '1px dashed #F0ECE1',
                }}
              >
                <span>Nợ #{idx + 1}</span>
                <span
                  style={{
                    fontWeight: 600,
                    color: item.repeatInTurns <= 1 ? '#B5301E' : '#8C6B3E',
                  }}
                >
                  {item.repeatInTurns <= 1 ? '⚡ Sắp lặp lại ngay' : `⏳ Lặp lại sau ~${item.repeatInTurns} từ`}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer ghi chú quy tắc */}
      {unlearnedList.length > 0 && (
        <div
          style={{
            marginTop: '0.75rem',
            paddingTop: '0.65rem',
            borderTop: '1px solid #EAE3D5',
            fontSize: '0.72rem',
            color: '#717C75',
            textAlign: 'center',
            fontFamily: 'var(--font-maru)',
          }}
        >
          💡 Phiên học chỉ hoàn tất khi danh sách nợ về 0.
        </div>
      )}
    </aside>
  );
}
