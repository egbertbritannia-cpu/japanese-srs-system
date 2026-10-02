# 🎴 TÀI LIỆU 20: ĐẶC TẢ COMPONENT GIAO DIỆN & MÃ NGUỒN NGUYÊN TỬ PHONG CÁCH WASHI KIRIE
## Dự án: Japanese SRS System · 記憶道 (FSRS Spaced Repetition Engine)
## Nguồn tham chiếu gốc: `C:\Users\ThinkPad X1\Pictures\japanese-graphic-design\18337712357dc3b93a96a076cef25eae.jpg`
## Cấp độ tài liệu: Atomic UI Component Specifications & CSS Tokens (Tầng Sâu Nhất)
## Trọng tâm: CSS Classes, Mã Nguồn React/TypeScript Components & Hướng dẫn Tích Hợp

---

> [!IMPORTANT]
> Tài liệu này chứa đựng toàn văn mã nguồn CSS và React Components độc lập, sẵn sàng để copy hoặc import trực tiếp vào dự án mà không cần chỉnh sửa logic. Mọi chi tiết đồ họa từ ảnh tham chiếu (bóng đổ giấy Kirie, cồn cát Washi, vạch sơn mài đứng, huy hiệu viên thuốc) đều được mô tả đến cấp độ CSS thuộc tính.

---

## 1. TOÀN VĂN MÃ NGUỒN CSS TOKENS (`src/app/globals.css`)

Bổ sung khối CSS sau vào `src/app/globals.css`:

```css
/* ==========================================================================
   JAPANESE WASHI KIRIE & 3D LAYERED WAVE DESIGN SYSTEM
   Directly extracted from 18337712357dc3b93a96a076cef25eae.jpg
   ========================================================================== */

/* 1. KHUNG HERO BẦU TRỜI ĐÊM AIZOME */
.kirie-hero-wrapper {
  background: linear-gradient(180deg, #0A1C33 0%, #132F52 55%, #1E436E 100%);
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  color: #FFFFFF;
  box-shadow: 0 14px 36px rgba(10, 28, 51, 0.25);
  margin-bottom: 1.5rem;
}

.kirie-hero-content {
  padding: 2.25rem 2rem 0;
  position: relative;
  z-index: 2;
}

.kirie-greeting-heading {
  font-family: var(--font-mincho), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 2.2rem;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.01em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
}

.kirie-pill-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 1rem;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 9999px;
  font-family: var(--font-maru), sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  color: #F8F5EE;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.kirie-user-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #F9F6F0;
  border: 2px solid #D4AF37;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #122438;
  font-family: var(--font-mincho), serif;
  font-size: 1.15rem;
  font-weight: 800;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

/* 2. BỘ 3 THẺ KPI GIẤY WASHI CÓ MẢNH GIẤY MÀU LÓ GÓC DƯỚI */
.kirie-kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: -1.75rem;
  position: relative;
  z-index: 3;
  padding: 0 0.5rem;
}

@media (max-width: 768px) {
  .kirie-kpi-grid {
    grid-template-columns: 1fr;
    margin-top: -1rem;
  }
}

.kirie-kpi-card {
  background: #F9F6F0;
  border: 1.5px solid #E8E0D2;
  border-radius: 18px;
  padding: 1.4rem 1.25rem 1.6rem;
  box-shadow: 0 4px 14px rgba(18, 36, 56, 0.06), 0 1px 3px rgba(18, 36, 56, 0.04);
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  flex-direction: column;
}

.kirie-kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px -4px rgba(18, 36, 56, 0.12);
  border-color: #D4AF37;
}

.kirie-kpi-label {
  font-family: var(--font-maru), sans-serif;
  font-size: 0.92rem;
  font-weight: 700;
  color: #122438;
  margin-bottom: 0.4rem;
}

.kirie-kpi-number {
  font-family: var(--font-mincho), sans-serif;
  font-size: 2.85rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 0.45rem;
}

.number-blue { color: #246392; }
.number-gold { color: #C89B58; }
.number-green { color: #3D7A4D; }

.kirie-kpi-desc {
  font-family: var(--font-sans), sans-serif;
  font-size: 0.8rem;
  color: #786A5E;
  margin: 0;
}

/* Mảnh giấy màu cắt góc dưới chân thẻ (Corner Peek Cutout) */
.kirie-corner-cutout {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 58px;
  height: 38px;
  border-radius: 28px 0 18px 0;
  opacity: 0.85;
}

.cutout-blue { background: radial-gradient(circle at 100% 100%, #1A3E61 0%, #3B7EA1 100%); }
.cutout-gold { background: radial-gradient(circle at 100% 100%, #B8860B 0%, #D4A359 100%); }
.cutout-green { background: radial-gradient(circle at 100% 100%, #2E7D32 0%, #4E8C59 100%); }

/* 3. ĐƯỜNG PHÂN CÁCH NGỌN SÓNG VÀNG TODAY'S FOCUS */
.kirie-section-header {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin: 2.25rem 0 1.25rem;
}

.kirie-section-title {
  font-family: var(--font-mincho), serif;
  font-size: 1.45rem;
  font-weight: 800;
  color: #122438;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.kirie-wave-divider-line {
  flex: 1;
  height: 1.5px;
  background: linear-gradient(90deg, #D4AF37 0%, rgba(212, 175, 55, 0.4) 85%, transparent 100%);
  position: relative;
}

.kirie-wave-divider-icon {
  position: absolute;
  right: 0;
  top: -8px;
  width: 24px;
  height: 16px;
}

/* 4. DANH SÁCH THẺ BÀI VẠCH SƠN MÀI ĐỨNG BÊN TRÁI */
.kirie-task-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.kirie-task-item {
  background: #FAF8F2;
  border: 1.2px solid #E8E0D2;
  border-radius: 12px;
  padding: 1.1rem 1.4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 6px rgba(18, 36, 56, 0.03);
  position: relative;
  overflow: hidden;
  transition: all 0.25s ease;
  text-decoration: none;
  color: inherit;
}

.kirie-task-item:hover {
  background: #FFFFFF;
  border-color: #D4AF37;
  transform: translateX(4px);
  box-shadow: 0 4px 14px rgba(18, 36, 56, 0.08);
}

/* Vạch sơn mài đứng bên trái (Left Vertical Bar) */
.kirie-vertical-bar {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 5px;
  border-radius: 4px 0 0 4px;
}

.bar-navy   { background: #1E4B75; }
.bar-denim  { background: #3E75A1; }
.bar-gold   { background: #C89B58; }
.bar-matcha { background: #3D7A4D; }
.bar-torii  { background: #C83824; }

.kirie-task-text {
  font-family: var(--font-maru), sans-serif;
  font-weight: 700;
  font-size: 1.05rem;
  color: #122438;
  margin-left: 0.5rem;
}

.kirie-task-meta {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.kirie-task-time {
  font-family: var(--font-sans), monospace;
  font-size: 0.92rem;
  font-weight: 600;
  color: #786A5E;
}

/* 5. HUY HIỆU VIÊN THUỐC MÀU KHOÁNG IWA-ENOGU */
.kirie-pill {
  padding: 0.35rem 0.95rem;
  border-radius: 9999px;
  font-family: var(--font-maru), sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.pill-due-now {
  background: #C89B58;
  color: #FFFFFF;
  box-shadow: 0 2px 6px rgba(200, 155, 88, 0.3);
}

.pill-in-progress {
  background: #4A7FA8;
  color: #FFFFFF;
  box-shadow: 0 2px 6px rgba(74, 127, 168, 0.3);
}

.pill-pending {
  background: #D8AA80;
  color: #2D1A0D;
}

.pill-not-started {
  background: #B5C2CC;
  color: #1E2E38;
}

.pill-blocked {
  background: #1F3A52;
  color: #FFFFFF;
}

/* 6. THANH ĐIỀU HƯỚNG ĐÁY WASHI (BOTTOM NAVIGATION BAR) */
.kirie-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(250, 247, 242, 0.94);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-top: 1px solid #E8E0D2;
  padding: 0.6rem 1rem 0.75rem;
  z-index: 100;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -4px 16px rgba(18, 36, 56, 0.06);
}

.kirie-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  text-decoration: none;
  color: #786A5E;
  font-family: var(--font-maru), sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.kirie-nav-item.active {
  color: #1A3E61;
  font-weight: 800;
}

.kirie-nav-icon-box {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.kirie-nav-item.active .kirie-nav-icon-box {
  background: #1A3E61;
  color: #FFFFFF;
  box-shadow: 0 2px 8px rgba(26, 62, 97, 0.35);
}
```

---

## 2. MÃ NGUỒN REACT COMPONENT `KirieHeroBanner.tsx`

Tệp tin: `src/components/kirie/KirieHeroBanner.tsx`:

```tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { KirieWaveIllustration } from './KirieWaveIllustration';

interface KirieHeroBannerProps {
  userName?: string;
  dueCount?: number;
  newCount?: number;
  learnedCount?: number;
}

export function KirieHeroBanner({
  userName = 'Yuna',
  dueCount = 24,
  newCount = 10,
  learnedCount = 94,
}: KirieHeroBannerProps) {
  return (
    <div className="kirie-hero-wrapper">
      {/* 1. KHU VỰC THÔNG TIN CHÍNH (GREETING & PILL) */}
      <div className="kirie-hero-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="kirie-greeting-heading">
              Good morning, {userName}
            </h1>
            <Link href="/review" style={{ textDecoration: 'none' }}>
              <div className="kirie-pill-badge">
                <span>記憶道 · {dueCount} thẻ đến hạn hôm nay (FSRS Due)</span>
              </div>
            </Link>
          </div>

          {/* Avatar con dấu Inkan viền vàng */}
          <div className="kirie-user-avatar">
            YS
          </div>
        </div>
      </div>

      {/* 2. MINH HỌA SÓNG GIẤY 3D VÀ THUYỀN ORIGAMI */}
      <div style={{ marginTop: '0.5rem', position: 'relative' }}>
        <KirieWaveIllustration />
      </div>
    </div>
  );
}
```

---

## 3. MÃ NGUỒN REACT COMPONENT `KirieKpiCard.tsx`

Tệp tin: `src/components/kirie/KirieKpiCard.tsx`:

```tsx
'use client';

import React from 'react';

interface KirieKpiCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  accent: 'blue' | 'gold' | 'green';
  onClick?: () => void;
}

export function KirieKpiCard({ title, value, subtitle, accent, onClick }: KirieKpiCardProps) {
  return (
    <div className="kirie-kpi-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <span className="kirie-kpi-label">{title}</span>
      <span className={`kirie-kpi-number number-${accent}`}>{value}</span>
      <p className="kirie-kpi-desc">{subtitle}</p>

      {/* Mảnh giấy màu cắt góc dưới đặc trưng */}
      <div className={`kirie-corner-cutout cutout-${accent}`} aria-hidden="true" />
    </div>
  );
}
```

---

## 4. MÃ NGUỒN REACT COMPONENT `KirieFocusListItem.tsx`

Tệp tin: `src/components/kirie/KirieFocusListItem.tsx`:

```tsx
'use client';

import React from 'react';
import Link from 'next/link';

export interface KirieFocusItemData {
  id: string;
  title: string;
  subtitle?: string;
  timeOrLevel: string;
  statusText: string;
  statusType: 'due-now' | 'in-progress' | 'pending' | 'not-started' | 'blocked';
  barColor: 'navy' | 'denim' | 'gold' | 'matcha' | 'torii';
  href: string;
}

export function KirieFocusListItem({ item }: { item: KirieFocusItemData }) {
  return (
    <Link href={item.href} className="kirie-task-item">
      {/* Vạch sơn mài đứng mép trái */}
      <div className={`kirie-vertical-bar bar-${item.barColor}`} />

      {/* Tên từ vựng / nhiệm vụ */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span className="kirie-task-text">{item.title}</span>
        {item.subtitle && (
          <span style={{ fontSize: '0.8rem', color: '#786A5E', marginLeft: '0.5rem' }}>
            {item.subtitle}
          </span>
        )}
      </div>

      {/* Thời gian & Huy hiệu viên thuốc */}
      <div className="kirie-task-meta">
        <span className="kirie-task-time">{item.timeOrLevel}</span>
        <span className={`kirie-pill pill-${item.statusType}`}>
          {item.statusText}
        </span>
      </div>
    </Link>
  );
}
```

---

## 5. MÃ NGUỒN REACT COMPONENT `KirieBottomNav.tsx`

Tệp tin: `src/components/kirie/KirieBottomNav.tsx`:

```tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function KirieBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/', icon: '🏯' },
    { label: 'Tasks', href: '/cards', icon: '📜' },
    { label: 'Projects', href: '/cards?tab=decks', icon: '🎴' },
    { label: 'Copilot', href: '/cards/new', icon: '✨' },
    { label: 'Reports', href: '/integrations', icon: '📊' },
  ];

  return (
    <nav className="kirie-bottom-bar" aria-label="Điều hướng chính phong cách Kirie">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`kirie-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="kirie-nav-icon-box">
              <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
            </div>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
```

---

> [!NOTE]
> Mời xem Kế hoạch Phân tầng Tổng thể tại:
> [`doc/19_KIRIE_PAPER_CUTOUT_WAVE_REDESIGN_MASTER_PLAN.md`](file:///D:/project/japanese-srs-system/doc/19_KIRIE_PAPER_CUTOUT_WAVE_REDESIGN_MASTER_PLAN.md)
