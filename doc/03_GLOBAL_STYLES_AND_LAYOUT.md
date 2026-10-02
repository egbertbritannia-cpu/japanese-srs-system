# ⛩️ TÀI LIỆU 03: MÃ NGUỒN TOÀN CỤC GLOBALS.CSS & LAYOUT.TSX
## Dự án: Japanese SRS System (FSRS)
## Mục tiêu: Thay thế toàn bộ khung nền tối thô sơ bằng Kiến trúc Giao diện Nhật Bản tươi sáng

---

### 1. MÃ NGUỒN HOÀN CHỈNH CHO `src/app/globals.css`
Agent chỉ cần sao chép toàn bộ khối mã dưới đây và ghi đè vào file `src/app/globals.css`:

```css
/* ==========================================================================
   JAPANESE SRS SYSTEM - MASTER DESIGN SYSTEM (WA-STYLE & BRIGHT NIPPON)
   ========================================================================== */

:root {
  /* --- BẢNG MÀU TRUYỀN THỐNG NHẬT BẢN TƯƠI SÁNG (NIPPON COLORS) --- */
  --washi-bg:          #FAF8F5; /* Giấy dó Washi truyền thống */
  --washi-surface:     #FFFFFF; /* Bề mặt thẻ trắng ngà */
  --washi-card:        #FCFBF9; /* Thẻ bài thủ công */
  --washi-border:      #E8E2D8; /* Đường viền nhẹ */
  --washi-border-soft: #F2ECE3;

  /* Xanh Matcha & Sóng Seigaiha chuẩn ảnh người dùng */
  --matcha-primary:    #88A752;
  --matcha-deep:       #6E8A3C;
  --matcha-light:      #A3C16F;
  --matcha-subtle:     #EBF2DF;
  --matcha-tint:       #F5F8EE;

  /* Đỏ son Torii & Dấu ấn Inkan */
  --torii-red:         #D9381E;
  --torii-hover:       #B82C15;
  --torii-subtle:      #FCEEEA;
  --torii-glow:        rgba(217, 56, 30, 0.25);

  /* Hoa anh đào Sakura */
  --sakura-pink:       #F472B6;
  --sakura-petal:      #FFB7C5;
  --sakura-light:      #FFF0F5;
  --sakura-deep:       #DB2777;

  /* Vàng kim Yamabuki */
  --yamabuki-gold:     #F59E0B;
  --yamabuki-light:    #FEF3C7;
  --yamabuki-amber:    #D97706;

  /* Mực Nho Sumi-iro */
  --sumi-ink:          #1F2421;
  --sumi-charcoal:     #3B433E;
  --sumi-faded:        #717C75;
  --sumi-water:        #9FAAA3;

  /* Đổ bóng đa tầng Ambient Depth */
  --shadow-washi-sm:   0 1px 3px rgba(31, 36, 33, 0.04), 0 1px 2px rgba(31, 36, 33, 0.02);
  --shadow-washi-md:   0 4px 6px -1px rgba(31, 36, 33, 0.05), 0 2px 4px -2px rgba(31, 36, 33, 0.03);
  --shadow-washi-lg:   0 10px 25px -5px rgba(31, 36, 33, 0.06), 0 8px 10px -6px rgba(31, 36, 33, 0.04);
  --shadow-karuta:     0 12px 32px -4px rgba(112, 141, 62, 0.12), 0 4px 12px -2px rgba(31, 36, 33, 0.04);
}

/* --- RESET TOÀN CỤC --- */
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html, body {
  background-color: var(--washi-bg);
  color: var(--sumi-ink);
  font-family: var(--font-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* --- HỌA TIẾT TRUYỀN THỐNG WAGARA --- */

/* 1. Sóng Seigaiha chuẩn màu xanh Matcha #88A752 (Khớp 100% Ảnh chụp người dùng) */
.wagara-seigaiha-matcha {
  background-color: #88a752;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='32' viewBox='0 0 64 32'%3E%3Cpath d='M0 32 A32 32 0 0 1 64 32 M6 32 A26 26 0 0 1 58 32 M12 32 A20 20 0 0 1 52 32 M18 32 A14 14 0 0 1 46 32 M24 32 A8 8 0 0 1 40 32 M-32 16 A32 32 0 0 1 32 16 M-26 16 A26 26 0 0 1 26 16 M-20 16 A20 20 0 0 1 20 16 M-14 16 A14 14 0 0 1 14 16 M-8 16 A8 8 0 0 1 8 16 M32 16 A32 32 0 0 1 96 16 M38 16 A26 26 0 0 1 90 16 M44 16 A20 20 0 0 1 84 16 M50 16 A14 14 0 0 1 78 16 M56 16 A8 8 0 0 1 72 16 M0 0 A32 32 0 0 1 64 0 M6 0 A26 26 0 0 1 58 0 M12 0 A20 20 0 0 1 52 0 M18 0 A14 14 0 0 1 46 0 M24 0 A8 8 0 0 1 40 0' fill='none' stroke='%23ffffff' stroke-width='2.2' stroke-linecap='round'/%3E%3C/svg%3E");
  background-size: 64px 32px;
}

/* 2. Sóng Seigaiha mờ nhạt làm nền thẻ & Hero banner */
.wagara-seigaiha-subtle {
  background-color: var(--washi-surface);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='32' viewBox='0 0 64 32'%3E%3Cpath d='M0 32 A32 32 0 0 1 64 32 M6 32 A26 26 0 0 1 58 32 M12 32 A20 20 0 0 1 52 32 M18 32 A14 14 0 0 1 46 32 M24 32 A8 8 0 0 1 40 32 M-32 16 A32 32 0 0 1 32 16 M-26 16 A26 26 0 0 1 26 16 M-20 16 A20 20 0 0 1 20 16 M-14 16 A14 14 0 0 1 14 16 M-8 16 A8 8 0 0 1 8 16 M32 16 A32 32 0 0 1 96 16 M38 16 A26 26 0 0 1 90 16 M44 16 A20 20 0 0 1 84 16 M50 16 A14 14 0 0 1 78 16 M56 16 A8 8 0 0 1 72 16 M0 0 A32 32 0 0 1 64 0 M6 0 A26 26 0 0 1 58 0 M12 0 A20 20 0 0 1 52 0 M18 0 A14 14 0 0 1 46 0 M24 0 A8 8 0 0 1 40 0' fill='none' stroke='rgba(136, 167, 82, 0.14)' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
  background-size: 64px 32px;
}

/* 3. Vân giấy dó Washi */
.washi-paper-bg {
  background-color: var(--washi-bg);
  background-image: radial-gradient(#E8E2D8 0.75px, transparent 0.75px), radial-gradient(#F0EAE1 0.75px, #FAF8F5 0.75px);
  background-size: 28px 28px;
  background-position: 0 0, 14px 14px;
}

/* --- HỆ THỐNG NÚT BẤM (JAPANESE BUTTONS) --- */
.btn-torii {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem 1.75rem;
  background: linear-gradient(135deg, #E64A19 0%, #D9381E 100%);
  color: #FFFFFF;
  border: none;
  border-radius: 10px;
  font-family: var(--font-maru), sans-serif;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(217, 56, 30, 0.35);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
}
.btn-torii:hover {
  background: linear-gradient(135deg, #D9381E 0%, #B82C15 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(217, 56, 30, 0.45);
}
.btn-torii:active {
  transform: translateY(0);
}

.btn-washi {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem 1.75rem;
  background: var(--washi-surface);
  color: var(--sumi-charcoal);
  border: 1px solid var(--washi-border);
  border-radius: 10px;
  font-family: var(--font-maru), sans-serif;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: var(--shadow-washi-sm);
  transition: all 0.2s ease;
  text-decoration: none;
}
.btn-washi:hover {
  background: #FFFFFF;
  border-color: var(--matcha-primary);
  color: var(--matcha-deep);
  transform: translateY(-1px);
  box-shadow: var(--shadow-washi-md);
}

.btn-matcha {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem 1.75rem;
  background: linear-gradient(135deg, #88A752 0%, #708D3E 100%);
  color: #FFFFFF;
  border: none;
  border-radius: 10px;
  font-family: var(--font-maru), sans-serif;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(112, 141, 62, 0.3);
  transition: all 0.25s ease;
  text-decoration: none;
}
.btn-matcha:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(112, 141, 62, 0.4);
}

/* --- THẺ BÀI KARUTA (HYAKUNIN ISSHU CARD) --- */
.card-karuta {
  background: var(--washi-surface);
  border: 1px solid var(--washi-border);
  border-radius: 14px;
  box-shadow: var(--shadow-washi-md);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.card-karuta:hover {
  border-color: var(--matcha-primary);
  box-shadow: var(--shadow-karuta);
  transform: translateY(-3px);
}
.card-karuta::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #88A752, #A3C16F, #D9381E);
  opacity: 0.8;
}

/* --- HOẠT HỌA CÁNH HOA SAKURA --- */
@keyframes sakuraFall {
  0% { top: -10%; opacity: 0; }
  15% { opacity: 0.85; }
  90% { opacity: 0.8; }
  100% { top: 105%; opacity: 0; }
}

@keyframes sakuraSway {
  0% { transform: translateX(0) rotate(0deg) scale(1); }
  25% { transform: translateX(25px) rotate(45deg) scale(1.05); }
  50% { transform: translateX(-20px) rotate(110deg) scale(0.95); }
  75% { transform: translateX(30px) rotate(190deg) scale(1.02); }
  100% { transform: translateX(0) rotate(270deg) scale(1); }
}

.sakura-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}

.sakura-petal {
  position: absolute;
  top: -20px;
  background: linear-gradient(135deg, #FFB7C5 0%, #FFA6B9 50%, #F472B6 100%);
  border-radius: 12px 1px 12px 1px;
  filter: drop-shadow(0 2px 4px rgba(244, 114, 182, 0.25));
  opacity: 0;
  will-change: transform, top, opacity;
  animation: sakuraFall 12s linear infinite, sakuraSway 4s ease-in-out infinite alternate;
}

/* --- CON DẤU SON INKAN (HANKO) --- */
@keyframes inkanStamp {
  0% { opacity: 0; transform: scale(2.6) rotate(-18deg); }
  50% { opacity: 0.95; transform: scale(0.92) rotate(-5deg); }
  75% { transform: scale(1.05) rotate(-7deg); }
  100% { opacity: 1; transform: scale(1) rotate(-6deg); }
}

.inkan-stamp-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border: 2px solid var(--torii-red);
  border-radius: 6px;
  color: var(--torii-red);
  font-family: var(--font-mincho), serif;
  font-weight: 800;
  font-size: 1.25rem;
  background: rgba(217, 56, 30, 0.05);
  box-shadow: inset 0 0 0 1px rgba(217, 56, 30, 0.3);
  animation: inkanStamp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
```

---

### 2. MÃ NGUỒN HOÀN CHỈNH CHO `src/app/layout.tsx`
Agent chỉ cần sao chép toàn bộ khối mã dưới đây và ghi đè vào file `src/app/layout.tsx`:

```tsx
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
```
