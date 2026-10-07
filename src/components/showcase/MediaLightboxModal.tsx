'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { MultimodalAsset } from '@/services/multimodal/types';

export interface MediaLightboxModalProps {
  asset: MultimodalAsset | null;
  onClose: () => void;
}

/**
 * 🌸 MediaLightboxModal (高解像度メディアライトボックス)
 *
 * Full-screen responsive lightbox modal for high-resolution Irasutoya PNGs and Grammar Infographic SVGs.
 * Features:
 * - Zoom controls (1x, 1.5x, 2x, reset)
 * - Click-and-drag panning when zoomed
 * - Esc key and backdrop click dismissal
 * - Washi texture framing and Sumi ink backdrop
 */
export function MediaLightboxModal({ asset, onClose }: MediaLightboxModalProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Reset zoom and pan when asset changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [asset]);

  // Handle Esc key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (asset) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [asset]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  }, [scale, position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleZoom = (newScale: number) => {
    setScale(newScale);
    if (newScale === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  if (!asset) return null;

  const rawKey = asset.key || '';
  const keyIdentifier = rawKey.includes(':') ? rawKey.split(':')[1] : rawKey;
  const title =
    asset.metadata?.title ||
    asset.metadata?.word ||
    asset.metadata?.patternKey ||
    decodeURIComponent(keyIdentifier) ||
    asset.fileName;

  const isSvg = asset.mimeType?.includes('svg') || asset.fileName?.endsWith('.svg');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Chi tiết hình ảnh ${title}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(26, 25, 24, 0.88)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      {/* Top Controls Toolbar */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          right: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Asset Title & Category Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '999px',
              backgroundColor: 'var(--kincha)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-maru)',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.04em',
            }}
          >
            {asset.category === 'grammar_infographic' ? '文法図解 (Infographic)' : 'いらすとや (Illustration)'}
          </span>
          <span
            style={{
              color: '#FFFFFF',
              fontFamily: 'var(--font-mincho)',
              fontWeight: 700,
              fontSize: '1.1rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.6)',
            }}
          >
            {title}
          </span>
        </div>

        {/* Zoom Controls & Close Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              display: 'flex',
              backgroundColor: 'rgba(247, 244, 235, 0.95)',
              borderRadius: '8px',
              border: '1px solid var(--washi-border)',
              padding: '2px',
            }}
          >
            {[1, 1.5, 2].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleZoom(s)}
                style={{
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-sans)',
                  color: scale === s ? '#FFFFFF' : 'var(--sumi-body)',
                  backgroundColor: scale === s ? 'var(--aizome)' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {s}x
              </button>
            ))}

            <button
              type="button"
              onClick={() => handleZoom(1)}
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                fontFamily: 'var(--font-maru)',
                color: 'var(--sumi-body)',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
              title="Đặt lại kích thước ban đầu"
            >
              Reset
            </button>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'var(--bengara)',
              color: '#FFFFFF',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              transition: 'transform 0.15s ease, background-color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bengara-hover)';
              e.currentTarget.style.transform = 'scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bengara)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title="Đóng (Esc)"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Image Viewport */}
      <div
        ref={containerRef}
        style={{
          width: '92vw',
          height: '78vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
          userSelect: 'none',
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transformOrigin: 'center center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              asset.fileId
                ? `/api/media/stream?fileId=${encodeURIComponent(asset.fileId)}${
                    asset.category === 'kanji'
                      ? `&kanji=${encodeURIComponent(asset.metadata?.kanji || asset.key.replace(/^kanji:/, ''))}`
                      : ''
                  }`
                : asset.cdnUrl
            }
            alt={title}
            draggable={false}
            style={{
              maxWidth: isSvg ? '85vw' : '75vw',
              maxHeight: isSvg ? '70vh' : '70vh',
              objectFit: 'contain',
              borderRadius: isSvg ? '8px' : '4px',
              backgroundColor: isSvg ? '#FFFFFF' : 'transparent',
              padding: isSvg ? '1.5rem' : '0',
              boxShadow: '0 12px 48px rgba(0,0,0,0.5)',
            }}
          />
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          padding: '0.5rem 1.25rem',
          borderRadius: '999px',
          backgroundColor: 'rgba(247, 244, 235, 0.92)',
          border: '1px solid var(--washi-border)',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.75rem',
          color: 'var(--sumi-body)',
          zIndex: 10,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <span>
          <strong style={{ fontFamily: 'var(--font-maru)' }}>Tên tệp:</strong> {asset.fileName}
        </span>
        <span>
          <strong style={{ fontFamily: 'var(--font-maru)' }}>Dung lượng:</strong> {Math.round(asset.sizeBytes / 1024)} KB
        </span>
        <a
          href={asset.cdnUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'var(--aizome)',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          Mở CDN gốc
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default MediaLightboxModal;
