import Link from 'next/link';
import { ToriiIcon } from '@/components/japanese/Icons';

export default function NotFound() {
  return (
    <div style={{ maxWidth: '640px', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
      <div
        className="card-karuta"
        style={{
          padding: '3.5rem 2rem',
          background: 'var(--washi-surface, #FAF8F2)',
          border: '1.5px solid var(--washi-border, #DFD9CB)',
          borderRadius: '18px',
          boxShadow: 'var(--shadow-karuta)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mincho)',
            fontSize: '4.5rem',
            fontWeight: 900,
            color: 'var(--bengara-red, #9E3223)',
            lineHeight: 1,
            marginBottom: '0.75rem',
          }}
        >
          四〇四
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-mincho)',
            fontSize: '1.5rem',
            color: 'var(--sumi-deep, #1A1918)',
            marginBottom: '0.5rem',
          }}
        >
          Không tìm thấy trang (頁無)
        </h2>

        <p
          style={{
            color: 'var(--sumi-body, #47433E)',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            marginBottom: '2rem',
          }}
        >
          Trang bạn tìm kiếm không tồn tại hoặc đã được chuyển dời trong thiền viện 記憶道.
        </p>

        <Link
          href="/"
          className="btn-torii"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 1.75rem',
            textDecoration: 'none',
          }}
        >
          <ToriiIcon size={18} color="#FFFFFF" />
          Về Trang Chủ (本丸へ)
        </Link>
      </div>
    </div>
  );
}
