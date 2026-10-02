import type { Metadata } from 'next';
import Link from 'next/link';
import { Zen_Maru_Gothic, Shippori_Mincho, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { SakuraBackground } from '@/components/japanese/SakuraBackground';
import { ToriiIcon, FujiMountainIcon } from '@/components/japanese/Icons';

const zenMaru = Zen_Maru_Gothic({
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-maru',
});

const shipporiMincho = Shippori_Mincho({
  weight: ['500', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mincho',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Japanese SRS System · 記憶道 (FSRS Spaced Repetition)',
  description: 'Hệ thống ghi nhớ lặp lại ngắt quãng tối ưu học tiếng Nhật kết hợp thuật toán FSRS & Nghệ thuật Văn hóa Nhật Bản',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ja"
      className={`${zenMaru.variable} ${shipporiMincho.variable} ${plusJakarta.variable}`}
    >
      <body className="washi-paper-bg" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Lớp cánh hoa anh đào bay lãng mạn phía sau */}
        <SakuraBackground />

        {/* Thanh son đỏ nóc cổng Torii trên cùng (Torii Kasagi Top Bar) */}
        <div style={{ height: '4px', background: 'linear-gradient(90deg, #D9381E, #F59E0B, #88A752)' }} />

        {/* HEADER / NAVIGATION BAR CHUẨN NHẬT */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            background: 'rgba(253, 251, 247, 0.92)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--washi-border)',
            boxShadow: 'var(--shadow-washi-sm)',
          }}
        >
          <div
            style={{
              maxWidth: '1100px',
              margin: '0 auto',
              padding: '0.85rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* Logo Thương hiệu: Con dấu son Hanko + Tên hệ thống */}
            <Link
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              {/* Dấu ấn Inkan son đỏ '日学' (Học tiếng Nhật) */}
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  border: '2px solid #D9381E',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D9381E',
                  fontFamily: 'var(--font-mincho)',
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  background: 'rgba(217, 56, 30, 0.06)',
                  boxShadow: '0 2px 6px rgba(217, 56, 30, 0.15)',
                }}
              >
                日学
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mincho)',
                      fontWeight: 800,
                      fontSize: '1.25rem',
                      color: 'var(--sumi-ink)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    Japanese SRS
                  </span>
                  <span
                    style={{
                      padding: '0.15rem 0.45rem',
                      background: 'var(--matcha-subtle)',
                      color: 'var(--matcha-deep)',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-maru)',
                    }}
                  >
                    記憶道 FSRS
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--sumi-faded)', margin: 0 }}>
                  Thuật toán lặp lại ngắt quãng &amp; Mỹ học Phù Tang
                </p>
              </div>
            </Link>

            {/* Menu Điều hướng */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link
                href="/"
                style={{
                  padding: '0.5rem 0.9rem',
                  borderRadius: '8px',
                  color: 'var(--sumi-charcoal)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-maru)',
                  fontWeight: 600,
                  transition: 'background 0.2s',
                }}
              >
                🏯 Tổng quan
              </Link>
              <Link
                href="/cards"
                style={{
                  padding: '0.5rem 0.9rem',
                  borderRadius: '8px',
                  color: 'var(--sumi-charcoal)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-maru)',
                  fontWeight: 600,
                  transition: 'background 0.2s',
                }}
              >
                📜 Danh sách thẻ
              </Link>
              <Link
                href="/cards/new"
                style={{
                  padding: '0.5rem 0.9rem',
                  borderRadius: '8px',
                  color: 'var(--matcha-deep)',
                  background: 'var(--matcha-subtle)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-maru)',
                  fontWeight: 700,
                  transition: 'all 0.2s',
                }}
              >
                ✨ AI Soạn thẻ
              </Link>
              <Link
                href="/integrations"
                style={{
                  padding: '0.5rem 0.9rem',
                  borderRadius: '8px',
                  color: 'var(--asagi-teal)',
                  background: 'var(--asagi-light)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-maru)',
                  fontWeight: 700,
                  transition: 'all 0.2s',
                }}
              >
                🌐 Tiện ích Google
              </Link>
              <Link
                href="/review"
                className="btn-torii"
                style={{
                  padding: '0.5rem 1.1rem',
                  fontSize: '0.88rem',
                  marginLeft: '0.5rem',
                }}
              >
                <ToriiIcon size={16} color="#FFFFFF" />
                Ôn tập ngay
              </Link>
            </nav>
          </div>
        </header>

        {/* NỘI DUNG CHÍNH (MAIN VIEWPORT) */}
        <div style={{ flex: 1, position: 'relative', zIndex: 10 }}>
          {children}
        </div>

        {/* FOOTER ĐẬM CHẤT THIỀN & NÚI PHÚ SĨ */}
        <footer
          style={{
            marginTop: 'auto',
            borderTop: '1px solid var(--washi-border)',
            background: 'var(--washi-surface)',
            padding: '2.5rem 1.5rem 2rem',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Dải sóng Seigaiha mỏng trang trí trên đỉnh Footer */}
          <div
            className="wagara-seigaiha-matcha"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '8px',
              opacity: 0.85,
            }}
          />

          <div
            style={{
              maxWidth: '1100px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '1rem',
            }}
          >
            <FujiMountainIcon size={40} />
            <div style={{ fontFamily: 'var(--font-mincho)', fontSize: '1rem', color: 'var(--sumi-charcoal)' }}>
              「 一期一会 · 七転び八起き 」
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--sumi-faded)', marginTop: '0.25rem' }}>
                (Nhất kỳ nhất hội · Vấp ngã bảy lần, đứng dậy tám lần)
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--sumi-faded)', margin: 0 }}>
              © 2026 Japanese SRS System · Thiết kế theo chuẩn Mỹ học Wabi-Sabi &amp; FSRS Cognitive Engine
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
