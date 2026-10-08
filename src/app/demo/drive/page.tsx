import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { JapaneseArtBackdrop } from '@/components/art/JapaneseArtBackdrop';
import { MultimodalMediaService, getAllMultimodalAssets } from '@/services/multimodal/media.service';
import { DriveShowcaseClient } from '@/components/showcase/DriveShowcaseClient';

export const metadata: Metadata = {
  title: '多元メディア収蔵館 | Google Drive Dual CDN Showcase',
  description:
    'Showcase tương tác đa phương tiện tiếng Nhật (Hán tự động, âm thanh chuẩn Tokyo, minh họa Irasutoya, sơ đồ ngữ pháp) trên hạ tầng Google Drive CDN.',
};

/**
 * Loading fallback skeleton following Authentic Wa-Style Washi aesthetic
 */
function ShowcaseLoadingSkeleton() {
  return (
    <div
      style={{
        width: '100%',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '3px solid var(--washi-border)',
          borderTopColor: 'var(--bengara)',
          animation: 'spin 1s linear infinite',
        }}
      />
      <p
        style={{
          fontFamily: 'var(--font-maru)',
          fontSize: '0.95rem',
          color: 'var(--sumi-body)',
        }}
      >
        Đang tải thư viện tài nguyên đa phương tiện... (収蔵館を読み込み中)
      </p>
    </div>
  );
}

/**
 * 🌸 DriveShowcasePage (/demo/drive)
 *
 * Next.js 15 Server Component rendering Google Drive Multimodal Assets Showcase.
 * - Invariant 4 compliance: Preserves JapaneseArtBackdrop overlay
 * - React 19 Suspense boundary wrapping DriveShowcaseClient
 * - Server-side manifest loading via MultimodalMediaService.getAllAssets()
 */
export default async function DriveShowcasePage() {
  // Fetch all multimodal assets with resolved Dual CDN URLs
  const allAssets = MultimodalMediaService.getAllAssets();

  return (
    <main
      className="washi-paper-bg"
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: 'var(--washi-bg)',
        padding: '2rem 1.25rem 6rem',
        overflow: 'hidden',
      }}
    >
      {/* INVARIANT 4: Authentic Wa-Style Art Backdrop Overlay */}
      <JapaneseArtBackdrop
        src="/assets/art/japanese-cultural-panorama.jpg"
        alt="Toàn cảnh văn hóa Nhật Bản Wa-Art Backdrop"
        opacity={0.05}
        blendMode="multiply"
        contrastBoost="subtle"
      />

      {/* Main Content Container constrained to 1200px */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <Suspense fallback={<ShowcaseLoadingSkeleton />}>
          <DriveShowcaseClient initialAssets={allAssets} />
        </Suspense>
      </div>
    </main>
  );
}
