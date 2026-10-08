'use client';

import React, { useState, useCallback, useEffect } from 'react';
import type { MultimodalAsset } from '@/services/multimodal/types';

export interface AssetMetadataDrawerProps {
  asset: MultimodalAsset | null;
  onClose: () => void;
}

/**
 * 🌸 AssetMetadataDrawer (資産メタデータ詳細ドロワー)
 *
 * Side drawer inspector panel displaying comprehensive technical metadata:
 * - Category, File ID, Direct CDN link (with 1-click clipboard copy)
 * - MIME type, calculated file size (KB / MB), Google Drive URL
 * - Domain-specific metadata entries (kanji strokes, audio duration, keywords)
 */
export function AssetMetadataDrawer({ asset, onClose }: AssetMetadataDrawerProps) {
  const [copied, setCopied] = useState(false);

  // Close on Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleCopyCdn = useCallback(async () => {
    if (!asset?.cdnUrl) return;
    try {
      await navigator.clipboard.writeText(asset.cdnUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API is restricted
      const textarea = document.createElement('textarea');
      textarea.value = asset.cdnUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [asset]);

  if (!asset) return null;

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes <= 0) return '0 B';
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB (${bytes.toLocaleString()} bytes)`;
    }
    return `${(bytes / 1024).toFixed(1)} KB (${bytes.toLocaleString()} bytes)`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Chi tiết thông số tài nguyên"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        backgroundColor: 'rgba(26, 25, 24, 0.45)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        className="washi-paper-bg"
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: 'var(--washi-card)',
          boxShadow: '-8px 0 32px rgba(26, 25, 24, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid var(--washi-border)',
          overflowY: 'auto',
          animation: 'drawerSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--washi-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(247, 244, 235, 0.85)',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bengara)',
                }}
              />
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.15rem',
                  fontFamily: 'var(--font-mincho)',
                  fontWeight: 800,
                  color: 'var(--sumi-deep)',
                }}
              >
                資産メタデータ詳細
              </h3>
            </div>
            <p
              style={{
                margin: '0.2rem 0 0',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-maru)',
                color: 'var(--sumi-faint)',
              }}
            >
              Asset Technical Metadata Inspector
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--washi-deep)',
              border: '1px solid var(--washi-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--sumi-body)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bengara-soft)';
              e.currentTarget.style.color = 'var(--bengara)';
              e.currentTarget.style.borderColor = 'var(--bengara-border)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--washi-deep)';
              e.currentTarget.style.color = 'var(--sumi-body)';
              e.currentTarget.style.borderColor = 'var(--washi-border)';
            }}
            title="Đóng (Esc)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Key & Category Overview */}
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--washi-deep)',
              borderRadius: '8px',
              border: '1px solid var(--washi-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-maru)', color: 'var(--sumi-faint)' }}>
                Phân loại danh mục
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-maru)',
                  fontWeight: 700,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  backgroundColor: 'var(--aizome-soft)',
                  color: 'var(--aizome)',
                  border: '1px solid var(--aizome-border)',
                }}
              >
                {asset.category}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-maru)', color: 'var(--sumi-faint)' }}>
                Khóa tài nguyên (Asset Key)
              </span>
              <div
                style={{
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 700,
                  color: 'var(--sumi-deep)',
                  wordBreak: 'break-all',
                  marginTop: '0.2rem',
                }}
              >
                {asset.key}
              </div>
            </div>
          </div>

          {/* Core Technical Identifiers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {/* File Name */}
            <div>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-maru)', color: 'var(--sumi-faint)' }}>
                Tên tệp lưu trữ (File Name)
              </span>
              <div
                style={{
                  marginTop: '0.25rem',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '6px',
                  border: '1px solid var(--washi-border-soft)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.82rem',
                  color: 'var(--sumi-body)',
                  wordBreak: 'break-all',
                }}
              >
                {asset.fileName}
              </div>
            </div>

            {/* Google Drive File ID */}
            <div>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-maru)', color: 'var(--sumi-faint)' }}>
                Google Drive File ID
              </span>
              <div
                style={{
                  marginTop: '0.25rem',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '6px',
                  border: '1px solid var(--washi-border-soft)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.82rem',
                  color: 'var(--sumi-body)',
                  wordBreak: 'break-all',
                }}
              >
                {asset.fileId}
              </div>
            </div>

            {/* Direct CDN Link with Copy button */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-maru)', color: 'var(--sumi-faint)' }}>
                  Đường dẫn trực tiếp CDN (Direct CDN URL)
                </span>
                {copied && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-maru)',
                      color: 'var(--matcha-deep)',
                      fontWeight: 700,
                    }}
                  >
                    ✓ Đã sao chép!
                  </span>
                )}
              </div>
              <div
                style={{
                  marginTop: '0.25rem',
                  display: 'flex',
                  gap: '0.4rem',
                }}
              >
                <input
                  type="text"
                  readOnly
                  value={asset.cdnUrl}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.75rem',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '6px',
                    border: '1px solid var(--washi-border-soft)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.75rem',
                    color: 'var(--sumi-body)',
                  }}
                />
                <button
                  type="button"
                  onClick={handleCopyCdn}
                  style={{
                    padding: '0.5rem 0.85rem',
                    backgroundColor: copied ? 'var(--matcha-deep)' : 'var(--bengara)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-maru)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  {copied ? 'Đã chép' : 'Sao chép'}
                </button>
              </div>
            </div>

            {/* MIME Type & Size Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-maru)', color: 'var(--sumi-faint)' }}>
                  Định dạng MIME
                </span>
                <div
                  style={{
                    marginTop: '0.25rem',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '6px',
                    border: '1px solid var(--washi-border-soft)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.8rem',
                    color: 'var(--sumi-body)',
                  }}
                >
                  {asset.mimeType}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-maru)', color: 'var(--sumi-faint)' }}>
                  Kích thước tệp
                </span>
                <div
                  style={{
                    marginTop: '0.25rem',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '6px',
                    border: '1px solid var(--washi-border-soft)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.8rem',
                    color: 'var(--sumi-body)',
                  }}
                >
                  {formatFileSize(asset.sizeBytes)}
                </div>
              </div>
            </div>
          </div>

          {/* Domain Metadata Key-Value Details */}
          {asset.metadata && Object.keys(asset.metadata).length > 0 && (
            <div
              style={{
                marginTop: '0.5rem',
                borderTop: '1px solid var(--washi-border)',
                paddingTop: '1rem',
              }}
            >
              <h4
                style={{
                  fontFamily: 'var(--font-mincho)',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: 'var(--sumi-deep)',
                  marginBottom: '0.75rem',
                }}
              >
                Thuộc tính nghiệp vụ mở rộng (Domain Metadata)
              </h4>

              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid var(--washi-border-soft)',
                  overflow: 'hidden',
                }}
              >
                {Object.entries(asset.metadata).map(([k, v], idx) => {
                  if (v === undefined || v === null || v === '') return null;
                  const displayVal = typeof v === 'object' ? JSON.stringify(v) : String(v);

                  return (
                    <div
                      key={k}
                      style={{
                        display: 'flex',
                        padding: '0.55rem 0.85rem',
                        borderBottom: idx !== Object.keys(asset.metadata || {}).length - 1 ? '1px solid var(--washi-border-soft)' : 'none',
                        fontSize: '0.78rem',
                      }}
                    >
                      <span
                        style={{
                          width: '120px',
                          color: 'var(--sumi-faint)',
                          fontFamily: 'var(--font-maru)',
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {k}
                      </span>
                      <span
                        style={{
                          color: 'var(--sumi-body)',
                          fontFamily: 'var(--font-sans)',
                          wordBreak: 'break-all',
                        }}
                      >
                        {displayVal}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* External Links */}
          {asset.driveUrl && (
            <div style={{ marginTop: '0.5rem' }}>
              <a
                href={asset.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1rem',
                  backgroundColor: 'var(--washi-deep)',
                  border: '1px solid var(--washi-border)',
                  borderRadius: '8px',
                  color: 'var(--aizome)',
                  fontFamily: 'var(--font-maru)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--aizome)';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--washi-deep)';
                  e.currentTarget.style.color = 'var(--aizome)';
                }}
              >
                Mở trong Google Drive (Xem trực tuyến)
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AssetMetadataDrawer;
