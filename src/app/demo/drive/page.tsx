import { Suspense } from 'react';
import { JapaneseArtBackdrop } from '@/components/art/JapaneseArtBackdrop';
import { MultimodalMediaService } from '@/services/multimodal/media.service';

export const dynamic = 'force-dynamic';

function MediaRepositoryContent() {
  const summary = MultimodalMediaService.getSummary();
  const categories = Object.entries(summary.categories || {});

  return (
    <main
      style={{
        maxWidth: '1000px',
        margin: '2rem auto',
        padding: '0 1.25rem 5rem',
        position: 'relative',
      }}
    >
      <JapaneseArtBackdrop
        src="/assets/art/night-golden-waves.jpg"
        alt="Sóng vàng Rinpa trong kho media"
        opacity={0.05}
        blendMode="multiply"
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <p style={{ color: 'var(--kincha-gold)', fontWeight: 800, fontFamily: 'var(--font-mincho)' }}>
          MULTIMODAL MEDIA REPOSITORY
        </p>
        <h1 style={{ fontFamily: 'var(--font-mincho)', marginTop: '0.35rem' }}>Kho Media</h1>
        <p style={{ color: 'var(--sumi-charcoal)', lineHeight: 1.6, marginTop: '0.6rem' }}>
          Trang phục hồi cho liên kết Kho Media đã xuất hiện trước PR #5. Dữ liệu được đọc trực tiếp từ
          MultimodalMediaService hiện hữu; trang này không tạo hoặc sửa asset.
        </p>

        <section
          style={{
            marginTop: '1.5rem',
            padding: '1.25rem',
            border: '1px solid var(--washi-border)',
            borderRadius: '16px',
            background: 'var(--washi-surface)',
          }}
        >
          <div style={{ fontSize: '2rem', fontFamily: 'var(--font-mincho)', fontWeight: 900 }}>
            {summary.totalAssets}
          </div>
          <div style={{ color: 'var(--sumi-faded)' }}>Tổng asset trong manifest</div>
          {summary.lastUpdated && (
            <div style={{ color: 'var(--sumi-faded)', fontSize: '0.78rem', marginTop: '0.35rem' }}>
              Manifest cập nhật: {summary.lastUpdated}
            </div>
          )}
        </section>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.9rem',
            marginTop: '1rem',
          }}
        >
          {categories.map(([category, count]) => (
            <article
              key={category}
              style={{
                padding: '1rem',
                border: '1px solid var(--washi-border)',
                borderRadius: '12px',
                background: 'var(--washi-surface)',
              }}
            >
              <div style={{ fontFamily: 'var(--font-mincho)', fontWeight: 800 }}>{category}</div>
              <div style={{ color: 'var(--sumi-faded)', marginTop: '0.3rem' }}>{String(count)} asset</div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function MediaRepositoryPage() {
  return (
    <Suspense fallback={<main style={{ padding: '2rem' }}>Đang tải kho media...</main>}>
      <MediaRepositoryContent />
    </Suspense>
  );
}
