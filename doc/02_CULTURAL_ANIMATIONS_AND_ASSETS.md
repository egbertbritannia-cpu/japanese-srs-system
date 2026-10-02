# 🎐 TÀI LIỆU 02: HOẠT HỌA VĂN HÓA & KHO BIỂU TƯỢNG SVG (CULTURAL ANIMATIONS & ASSETS)
## Dự án: Japanese SRS System (FSRS)
## Yêu cầu: Pure CSS / Canvas / SVG (Zero Third-Party Dependency, React 19 Compatible)

---

### 1. HOẠT HỌA 1: CÁNH HOA ANH ĐÀO RƠI (HANAFUBUKI / SAKURA FLUTTER)

Hiệu ứng cánh hoa anh đào bay lượn nhẹ nhàng trong gió xuân mang lại cảm giác bình yên của xứ Phù Tang. Để đạt hiệu năng 60fps mượt mà và không gây giật lag trên thiết bị di động, hoạt họa sử dụng các cánh hoa vector siêu nhẹ kết hợp CSS GPU-accelerated transforms (`translate3d`, `rotate3d`).

#### 1.1. Mã CSS Keyframes (Nhúng vào `globals.css`)
```css
/* ==========================================================================
   SAKURA PETALS FLOATING ANIMATION (花吹雪)
   ========================================================================== */
@keyframes sakuraFall {
  0% {
    top: -10%;
    opacity: 0;
  }
  15% {
    opacity: 0.85;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    top: 105%;
    opacity: 0;
  }
}

@keyframes sakuraSway {
  0% {
    transform: translateX(0) rotate(0deg) scale(1);
  }
  25% {
    transform: translateX(25px) rotate(45deg) scale(1.05);
  }
  50% {
    transform: translateX(-20px) rotate(110deg) scale(0.95);
  }
  75% {
    transform: translateX(30px) rotate(190deg) scale(1.02);
  }
  100% {
    transform: translateX(0) rotate(270deg) scale(1);
  }
}

.sakura-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  pointer-events: none; /* Không cản trở tương tác click chuột của người dùng */
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
```

#### 1.2. React Component Cánh hoa (`src/components/japanese/SakuraBackground.tsx`)
```tsx
'use client';

import React, { useEffect, useState } from 'react';

interface PetalConfig {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
  swayDuration: number;
  opacity: number;
}

export function SakuraBackground() {
  const [petals, setPetals] = useState<PetalConfig[]>([]);

  useEffect(() => {
    // Khởi tạo 18 cánh hoa với tham số ngẫu nhiên tự nhiên
    const generated: PetalConfig[] = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: `${(i * 5.5 + Math.random() * 4).toFixed(1)}%`,
      size: Math.floor(Math.random() * 8) + 10, // 10px - 18px
      duration: Math.floor(Math.random() * 6) + 9, // 9s - 15s
      delay: -(Math.random() * 12), // Tránh hiện tượng đồng loạt rơi từ đầu
      swayDuration: Math.floor(Math.random() * 3) + 3, // 3s - 6s
      opacity: Number((Math.random() * 0.4 + 0.5).toFixed(2)), // 0.5 - 0.9
    }));
    setPetals(generated);
  }, []);

  return (
    <div className="sakura-container" aria-hidden="true">
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="sakura-petal"
          style={{
            left: petal.left,
            width: `${petal.size}px`,
            height: `${petal.size * 1.3}px`,
            opacity: petal.opacity,
            animationDuration: `${petal.duration}s, ${petal.swayDuration}s`,
            animationDelay: `${petal.delay}s, ${petal.delay * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
}
```

---

### 2. HOẠT HỌA 2: ĐÓNG DẤU SON INKAN / HANKO (判子 STAMP BOUNCE)

Trong văn hóa công vụ và nghệ thuật Nhật Bản, con dấu Hanko son đỏ tượng trưng cho sự xác nhận, hoàn tất (済 - Sumi), và phê chuẩn.
Khi người học đánh giá thẻ bài ("Good" / "Easy") hoặc AI Copilot phê duyệt thẻ, con dấu son đỏ sẽ dập mạnh xuống với hiệu ứng bật nảy cơ học (Mechanical Spring Stamp) và góc nghiêng tự nhiên 6 độ.

#### 2.1. Mã CSS Keyframes
```css
/* ==========================================================================
   INKAN / HANKO SEAL STAMP ANIMATION (判子)
   ========================================================================== */
@keyframes inkanStamp {
  0% {
    opacity: 0;
    transform: scale(2.8) rotate(-18deg);
  }
  50% {
    opacity: 0.95;
    transform: scale(0.92) rotate(-5deg);
  }
  75% {
    transform: scale(1.06) rotate(-7deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(-6deg);
  }
}

.inkan-stamp-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 2.5px solid var(--torii-red);
  border-radius: 6px;
  color: var(--torii-red);
  font-family: var(--font-mincho), serif;
  font-weight: 800;
  font-size: 1.35rem;
  background: rgba(217, 56, 30, 0.05);
  box-shadow: inset 0 0 0 1px rgba(217, 56, 30, 0.4), 0 2px 8px rgba(217, 56, 30, 0.2);
  user-select: none;
  animation: inkanStamp 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
```

---

### 3. HOẠT HỌA 3: LẬT THẺ BÀI KARUTA 3D (HYAKUNIN ISSHU CARD FLIP)

Mô phỏng trải nghiệm cầm trên tay cỗ bài thơ Karuta truyền thống:
- Sử dụng thuộc tính `perspective: 1200px` và `transform-style: preserve-3d`.
- Hiệu ứng lật mượt mà kết hợp nghiêng góc như quạt xếp Sensu.

```css
/* ==========================================================================
   3D KARUTA CARD FLIP (歌留多)
   ========================================================================== */
.karuta-card-viewport {
  perspective: 1200px;
  width: 100%;
}

.karuta-card-flipper {
  position: relative;
  width: 100%;
  min-height: 320px;
  transition: transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-style: preserve-3d;
}

.karuta-card-flipper.is-flipped {
  transform: rotateY(180deg);
}

.karuta-face {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 16px;
  padding: 2.5rem;
  background: var(--washi-surface);
  border: 1px solid var(--washi-border);
  box-shadow: var(--shadow-karuta);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.karuta-face-front {
  z-index: 2;
  transform: rotateY(0deg);
}

.karuta-face-back {
  transform: rotateY(180deg);
  background: #FCFBF7;
  border-color: var(--matcha-primary);
}
```

---

### 4. HOẠT HỌA 4: BÚP BÊ DARUMA ĐIỂM MẮT TIẾN ĐỘ (DARUMA EYE-OPENING MASCOT)

Búp bê Daruma là biểu tượng may mắn và ý chí quyết tâm của người Nhật.
- Khi người học bắt đầu ngày mới: 2 mắt Daruma đều trắng.
- Khi đạt **50% số thẻ cần ôn** (`dueToday / 2`): Mắt trái được vẽ lòng đen (bắt đầu hành trình).
- Khi đạt **100% mục tiêu ngày**: Mắt phải được vẽ lòng đen trọn vẹn, kèm hào quang vàng kim Yamabuki chúc mừng thành công!

#### 4.1. React Component Búp bê Daruma (`src/components/japanese/DarumaMascot.tsx`)
```tsx
'use client';

import React from 'react';

interface DarumaProps {
  progressPercentage: number; // 0 đến 100
  size?: number;
}

export function DarumaMascot({ progressPercentage, size = 64 }: DarumaProps) {
  const isLeftEyeDrawn = progressPercentage >= 50;
  const isRightEyeDrawn = progressPercentage >= 100;

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        filter: isRightEyeDrawn ? 'drop-shadow(0 0 12px rgba(245, 158, 11, 0.6))' : 'none',
        transition: 'filter 0.5s ease',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Thân búp bê màu đỏ Torii */}
        <circle cx="50" cy="54" r="42" fill="#D9381E" />
        <ellipse cx="50" cy="90" rx="30" ry="8" fill="#B82C15" opacity="0.6" />

        {/* Khung mặt bằng giấy Washi */}
        <ellipse cx="50" cy="46" rx="30" ry="24" fill="#FAF8F5" stroke="#E8E2D8" strokeWidth="2" />

        {/* Lông mày hình chim hạc (Tsuru) */}
        <path d="M 28 35 C 34 32, 40 33, 44 37" stroke="#1F2421" strokeWidth="3" strokeLinecap="round" />
        <path d="M 72 35 C 66 32, 60 33, 56 37" stroke="#1F2421" strokeWidth="3" strokeLinecap="round" />

        {/* Hốc mắt trái */}
        <circle cx="36" cy="45" r="7" fill="#FFFFFF" stroke="#1F2421" strokeWidth="2" />
        {/* Lòng đen mắt trái (Đạt 50%) */}
        {isLeftEyeDrawn && (
          <circle cx="36" cy="45" r="4.5" fill="#1F2421" className="animate-scale-in" />
        )}

        {/* Hốc mắt phải */}
        <circle cx="64" cy="45" r="7" fill="#FFFFFF" stroke="#1F2421" strokeWidth="2" />
        {/* Lòng đen mắt phải (Đạt 100%) */}
        {isRightEyeDrawn && (
          <circle cx="64" cy="45" r="4.5" fill="#1F2421" className="animate-scale-in" />
        )}

        {/* Ria mép hình rùa (Kame) */}
        <path d="M 40 56 Q 50 62 60 56" stroke="#1F2421" strokeWidth="3.5" strokeLinecap="round" fill="none" />

        {/* Chữ Hán 'Phúc' (福) mạ vàng trước bụng */}
        <text
          x="50"
          y="82"
          textAnchor="middle"
          fill="#F59E0B"
          fontSize="14"
          fontWeight="bold"
          fontFamily="serif"
        >
          福
        </text>
      </svg>
    </div>
  );
}
```

---

### 5. KHO BIỂU TƯỢNG VĂN HÓA SVG THUẦN TÚY (PURE VECTOR CULTURAL ICONS)

Để Agent không phải cài thêm bất kỳ thư viện icon nào gây xung đột React 19, toàn bộ icon được định nghĩa sẵn trong file `src/components/japanese/Icons.tsx`:

```tsx
'use client';

import React from 'react';

// 1. CỔNG TORII (鳥居) - Biểu tượng cổng thiêng
export function ToriiIcon({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Mái cong Kasagi */}
      <path d="M2 5C8 4.2 16 4.2 22 5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      {/* Xà ngang Shimaki */}
      <path d="M3.5 7.5H20.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      {/* Hai cột trụ Hashira đứng hơi choãi chân */}
      <path d="M6 7.5L5.5 20" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M18 7.5L18.5 20" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      {/* Xà nối giữa Nuki */}
      <path d="M5.7 11H18.3" stroke={color} strokeWidth="1.6" />
      {/* Trụ đỡ trung tâm Gakuzuka */}
      <path d="M12 5V7.5" stroke={color} strokeWidth="2" />
    </svg>
  );
}

// 2. HOA ANH ĐÀO SAKURA (桜)
export function SakuraIcon({ size = 24, color = '#F472B6' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 7.5C10.5 4 8 3.5 6.5 5C5 6.5 5.5 9 9 10.5C5.5 12 5 14.5 6.5 16C8 17.5 10.5 17 12 13.5C13.5 17 16 17.5 17.5 16C19 14.5 18.5 12 15 10.5C18.5 9 19 6.5 17.5 5C16 3.5 13.5 4 12 7.5Z" />
      <circle cx="12" cy="10.5" r="1.5" fill="#FFFFFF" />
    </svg>
  );
}

// 3. QUẠT GIẤY SENSU (扇子)
export function SensuFanIcon({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 20L4 10C8 6 16 6 20 10L12 20Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 20L8 8" stroke={color} strokeWidth="1.2" />
      <path d="M12 20V7" stroke={color} strokeWidth="1.2" />
      <path d="M12 20L16 8" stroke={color} strokeWidth="1.2" />
      <circle cx="12" cy="20" r="1.5" fill={color} />
    </svg>
  );
}

// 4. HẠC GIẤY ORIGAMI (折り鶴) - Dùng khi AI Copilot đang phân tích
export function OrizuruIcon({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L3 13H10L12 21L14 13H21L12 3Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 3V21" stroke={color} strokeWidth="1.2" strokeDasharray="2 2" />
    </svg>
  );
}

// 5. NÚI PHÚ SĨ (富士山) - Biểu tượng trên Footer
export function FujiMountainIcon({ size = 32, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Mặt trời đỏ Asahi mọc sau núi */}
      <circle cx="16" cy="12" r="6" fill="#D9381E" opacity="0.85" />
      {/* Thân núi Phú Sĩ */}
      <path d="M3 28L11 9H21L29 28H3Z" fill="#3B433E" />
      {/* Tuyết trắng phủ đỉnh núi mấp mô */}
      <path d="M11 9L12.5 13L14 11L16 14L18 11.5L19.5 13L21 9H11Z" fill="#FAF8F5" />
    </svg>
  );
}
```
