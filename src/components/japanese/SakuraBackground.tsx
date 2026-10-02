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
