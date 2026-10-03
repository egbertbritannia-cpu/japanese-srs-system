import React from 'react';

// 18 cánh hoa với tọa độ và chu kỳ xác định (Zero Javascript runtime overhead, no useState/useEffect)
const STATIC_PETALS = [
  { id: 0, left: '3.2%', size: 14, duration: 11, delay: -2, swayDuration: 4, opacity: 0.75 },
  { id: 1, left: '8.8%', size: 11, duration: 13, delay: -5, swayDuration: 5, opacity: 0.65 },
  { id: 2, left: '14.5%', size: 16, duration: 10, delay: -8, swayDuration: 3, opacity: 0.82 },
  { id: 3, left: '20.1%', size: 12, duration: 14, delay: -1, swayDuration: 4, opacity: 0.70 },
  { id: 4, left: '25.7%', size: 15, duration: 12, delay: -9, swayDuration: 6, opacity: 0.60 },
  { id: 5, left: '31.2%', size: 10, duration: 15, delay: -3, swayDuration: 4, opacity: 0.85 },
  { id: 6, left: '36.8%', size: 17, duration: 9, delay: -11, swayDuration: 5, opacity: 0.72 },
  { id: 7, left: '42.4%', size: 13, duration: 13, delay: -4, swayDuration: 3, opacity: 0.68 },
  { id: 8, left: '48.0%', size: 15, duration: 11, delay: -7, swayDuration: 4, opacity: 0.80 },
  { id: 9, left: '53.6%', size: 11, duration: 14, delay: -2, swayDuration: 6, opacity: 0.62 },
  { id: 10, left: '59.1%', size: 16, duration: 10, delay: -10, swayDuration: 4, opacity: 0.78 },
  { id: 11, left: '64.7%', size: 12, duration: 12, delay: -6, swayDuration: 5, opacity: 0.70 },
  { id: 12, left: '70.3%', size: 14, duration: 15, delay: -1, swayDuration: 3, opacity: 0.83 },
  { id: 13, left: '75.9%', size: 18, duration: 11, delay: -8, swayDuration: 4, opacity: 0.65 },
  { id: 14, left: '81.4%', size: 10, duration: 13, delay: -4, swayDuration: 6, opacity: 0.75 },
  { id: 15, left: '87.0%', size: 15, duration: 9, delay: -12, swayDuration: 4, opacity: 0.82 },
  { id: 16, left: '92.6%', size: 13, duration: 14, delay: -3, swayDuration: 5, opacity: 0.68 },
  { id: 17, left: '97.2%', size: 16, duration: 12, delay: -7, swayDuration: 4, opacity: 0.74 },
];

/**
 * SakuraBackground
 * Cánh hoa anh đào rơi tự nhiên theo mỹ học Wabi-Sabi
 * - Hoàn toàn không tốn CPU tính toán runtime (Không dùng JS state / hooks)
 * - Render tĩnh trực tiếp vào HTML ban đầu
 * - Tăng tốc phần cứng 100% bằng GPU CSS Keyframes
 */
export function SakuraBackground() {
  return (
    <div className="sakura-container" aria-hidden="true">
      {STATIC_PETALS.map((petal) => (
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

export default SakuraBackground;
