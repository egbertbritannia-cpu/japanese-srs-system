import React from 'react';

/**
 * Minh họa Sóng biển cắt giấy 3D Washi Kirie & Thuyền buồm Origami thuần túy Vector SVG
 * Tinh chỉnh tỉ lệ chuẩn xác theo ảnh tham chiếu: 18337712357dc3b93a96a076cef25eae.jpg
 */
export function KirieWaveIllustration() {
  return (
    <svg
      viewBox="0 0 400 230"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: 'auto', display: 'block' }}
      aria-label="Minh họa sóng biển nghệ thuật cắt giấy Washi Kirie và thuyền giấy Origami"
    >
      <defs>
        {/* Bộ lọc đổ bóng giấy thủ công 3D đa tầng (Layered Kirie Paper Drop Shadows) */}
        <filter id="kirie-shadow-deep" x="-10%" y="-10%" width="125%" height="135%">
          <feDropShadow dx="0" dy="4" stdDeviation="3.5" floodColor="#061220" floodOpacity="0.4" />
        </filter>
        <filter id="kirie-shadow-mid" x="-10%" y="-10%" width="125%" height="135%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#0A1E35" floodOpacity="0.28" />
        </filter>
        <filter id="kirie-shadow-soft" x="-10%" y="-10%" width="125%" height="135%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.8" floodColor="#0A1C33" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* 1. NỀN TRỜI & CÁC LỚP MÂY CÁT WASHI TRÊN ĐƯỜNG CHÂN TRỜI (Rolling Sand Clouds) */}
      <g filter="url(#kirie-shadow-soft)">
        {/* Lớp mây cát xa sẫm */}
        <path
          d="M0 70 C30 50, 70 52, 95 68 C120 48, 165 46, 190 65 C220 45, 270 48, 300 66 C330 50, 370 52, 400 68 L400 110 L0 110 Z"
          fill="#CDB99E"
        />
        {/* Lớp mây cát vàng Washi sáng phía trước */}
        <path
          d="M20 78 C55 58, 100 62, 130 75 C165 58, 215 60, 245 76 C280 60, 335 62, 375 78 L400 85 L400 120 L0 120 L0 85 Z"
          fill="#DFCFB7"
        />
      </g>

      {/* 2. DÃY SÓNG VÀNG CÁT & SÓNG XA (Distant Waves) */}
      <path
        filter="url(#kirie-shadow-mid)"
        d="M0 92 C45 80, 110 96, 160 102 C210 108, 270 92, 330 84 C365 78, 385 82, 400 88 L400 140 L0 140 Z"
        fill="#264F75"
      />

      {/* 3. DÒNG HẢI LƯU TRUNG TÂM (Central Oceanic Meandering Channel) */}
      <path
        filter="url(#kirie-shadow-deep)"
        d="M135 102 C175 118, 205 140, 185 175 C170 195, 195 215, 215 220 L400 220 L400 102 Z"
        fill="#1A3E63"
      />
      <path
        d="M150 112 C185 128, 212 148, 198 178 C185 198, 205 215, 220 220 L275 220 C250 205, 240 185, 255 160 C270 135, 240 118, 210 112 Z"
        fill="#143252"
        opacity="0.85"
      />

      {/* 4. CON SÓNG CUỘN ĐẠI DƯƠNG BÊN TRÁI (Great Left Curling Wave) */}
      <g filter="url(#kirie-shadow-deep)">
        {/* Thân sóng cuộn xanh sẫm */}
        <path
          d="M-15 155 C35 135, 65 95, 95 112 C120 128, 85 152, 60 148 C45 145, 65 170, 90 162 C115 155, 135 172, 125 198 L0 215 Z"
          fill="#1F4E79"
        />
        {/* Bọt sóng trắng ngọn sóng trái */}
        <path
          d="M-10 150 C35 130, 68 92, 95 108 C100 112, 95 118, 85 116 C70 114, 55 125, 48 140 C40 130, 25 140, 5 150 Z"
          fill="#F7F4EE"
        />
        <circle cx="98" cy="115" r="3.5" fill="#F7F4EE" />
        <circle cx="106" cy="122" r="2.5" fill="#F7F4EE" />
      </g>

      {/* 5. CON SÓNG CUỘN BÊN PHẢI (Great Right Curling Wave) */}
      <g filter="url(#kirie-shadow-deep)">
        {/* Thân sóng cuộn xanh tiền cảnh phải */}
        <path
          d="M415 145 C365 125, 330 98, 305 118 C285 134, 315 154, 340 148 C355 145, 335 170, 315 162 C290 155, 270 172, 285 205 L415 215 Z"
          fill="#173B5C"
        />
        {/* Bọt sóng giấy trắng ngọn sóng phải */}
        <path
          d="M410 140 C365 122, 332 95, 308 114 C304 117, 308 124, 318 122 C334 120, 345 132, 354 145 C365 132, 390 140, 410 140 Z"
          fill="#F7F4EE"
        />
        <circle cx="302" cy="120" r="3.5" fill="#F7F4EE" />
        <circle cx="294" cy="128" r="2.5" fill="#F7F4EE" />
      </g>

      {/* 6. CON SÓNG NHỎ TIỀN CẢNH PHÍA DƯỚI GÓC PHẢI */}
      <path
        filter="url(#kirie-shadow-mid)"
        d="M400 185 C370 175, 340 168, 325 180 C315 188, 335 198, 355 195 C370 192, 390 205, 400 215 Z"
        fill="#234B70"
      />
      <path
        d="M400 182 C372 172, 344 165, 328 178 C325 180, 330 185, 338 183 C350 182, 365 192, 375 195 C385 190, 395 195, 400 198 Z"
        fill="#F7F4EE"
      />

      {/* 7. CON THUYỀN GIẤY ORIGAMI TRẮNG (Crisp White Origami Sailboat in Channel) */}
      <g filter="url(#kirie-shadow-mid)" transform="translate(186, 122)">
        {/* Thân thuyền Origami đa giác góc cạnh */}
        <polygon points="2,22 38,22 30,29 10,29" fill="#FFFFFF" stroke="#E2DAC6" strokeWidth="0.8" />
        {/* Cánh buồm chính cao vút */}
        <polygon points="19,1 19,20 35,20" fill="#FFFFFF" stroke="#E2DAC6" strokeWidth="0.8" />
        {/* Cánh buồm phụ trước đổ bóng Washi nhẹ */}
        <polygon points="17,5 17,20 5,20" fill="#F4EFE6" stroke="#E2DAC6" strokeWidth="0.8" />
        {/* Đổ bóng đáy thuyền trên mặt nước */}
        <ellipse cx="20" cy="30" rx="14" ry="2" fill="#0C2035" opacity="0.3" />
      </g>

      {/* 8. BỜ CÁT UỐN LƯỢN CHUYỂN TIẾP (Organic Curved Sand Dune Transition) */}
      <path
        filter="url(#kirie-shadow-deep)"
        d="M0 192 C95 178, 205 204, 305 184 C350 174, 380 182, 400 178 L400 230 L0 230 Z"
        fill="#F4EDE1"
      />
    </svg>
  );
}
