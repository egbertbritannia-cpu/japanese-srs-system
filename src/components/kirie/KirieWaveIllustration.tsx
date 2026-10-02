import React from 'react';

/**
 * Minh họa Sóng biển cắt giấy 3D Washi Kirie & Thuyền buồm Origami thuần túy Vector SVG
 * Tham chiếu gốc: C:\Users\ThinkPad X1\Pictures\japanese-graphic-design\18337712357dc3b93a96a076cef25eae.jpg
 */
export function KirieWaveIllustration() {
  return (
    <svg
      viewBox="0 0 400 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: 'auto', display: 'block' }}
      aria-label="Minh họa sóng biển nghệ thuật cắt giấy Washi Kirie và thuyền giấy Origami"
    >
      <defs>
        {/* Bộ lọc bóng đổ giấy thủ công (Paper Cutout Drop Shadow) */}
        <filter id="kirie-shadow-deep" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#061220" floodOpacity="0.35" />
        </filter>
        <filter id="kirie-shadow-soft" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#0A1C33" floodOpacity="0.22" />
        </filter>
      </defs>

      {/* 1. MÂY CÁT XA NỀN TRỜI (Distant Sand Clouds) */}
      <path
        d="M20 95 C60 70, 110 75, 140 90 C180 80, 220 82, 250 95 C280 78, 330 75, 380 92 L400 95 L400 130 L0 130 L0 95 Z"
        fill="#D6C2A5"
        opacity="0.9"
      />

      {/* 2. LỚP SÓNG XA (Distant Navy Waves) */}
      <path
        filter="url(#kirie-shadow-soft)"
        d="M0 105 C50 95, 120 110, 170 120 C220 130, 280 110, 340 100 C370 95, 390 100, 400 105 L400 160 L0 160 Z"
        fill="#254E70"
      />

      {/* 3. DÒNG HẢI LƯU TRUNG TÂM (Central Oceanic Channel) */}
      <path
        filter="url(#kirie-shadow-deep)"
        d="M140 120 C180 140, 210 165, 190 200 C175 220, 200 240, 220 240 L400 240 L400 120 Z"
        fill="#1A3E61"
      />

      {/* 4. CON SÓNG CUỘN KHỔNG LỒ BÊN TRÁI (Great Left Foam Wave) */}
      <path
        filter="url(#kirie-shadow-deep)"
        d="M-20 180 C30 160, 60 120, 90 135 C115 150, 80 175, 55 170 C40 168, 60 190, 85 185 C110 180, 130 195, 120 220 L0 240 Z"
        fill="#1F4E79"
      />
      {/* Bọt sóng giấy trắng ngọn sóng trái */}
      <path
        d="M-15 175 C30 155, 62 118, 90 132 C95 135, 90 142, 80 140 C65 138, 50 150, 42 165 C35 155, 20 165, 0 175 Z"
        fill="#F8F5EE"
      />

      {/* 5. CON SÓNG CUỘN BÊN PHẢI (Right Curling Wave) */}
      <path
        filter="url(#kirie-shadow-deep)"
        d="M420 170 C370 150, 335 125, 310 145 C290 160, 320 180, 345 175 C360 172, 340 195, 320 190 C295 185, 275 200, 290 230 L420 240 Z"
        fill="#173B5C"
      />
      {/* Bọt sóng giấy trắng ngọn sóng phải */}
      <path
        d="M415 165 C370 148, 338 123, 312 142 C308 145, 312 152, 322 150 C338 148, 350 160, 358 172 C370 160, 395 168, 415 165 Z"
        fill="#F8F5EE"
      />

      {/* 6. CON THUYỀN GIẤY ORIGAMI TRẮNG (White Origami Sailboat) */}
      <g filter="url(#kirie-shadow-soft)" transform="translate(190, 138)">
        {/* Thân thuyền */}
        <polygon points="0,20 36,20 28,27 8,27" fill="#FFFFFF" stroke="#E5DEC9" strokeWidth="0.8" />
        {/* Cánh buồm chính lớn */}
        <polygon points="18,1 18,18 33,18" fill="#FFFFFF" stroke="#E5DEC9" strokeWidth="0.8" />
        {/* Cánh buồm phụ trước */}
        <polygon points="16,5 16,18 4,18" fill="#F4EFE6" stroke="#E5DEC9" strokeWidth="0.8" />
      </g>

      {/* 7. BỜ CÁT UỐN CONG CHUYỂN TIẾP (Curved Sand Transition Dune) */}
      <path
        d="M0 215 C100 200, 260 210, 400 195 L400 240 L0 240 Z"
        fill="#EFE6D5"
      />
    </svg>
  );
}
