import React from 'react';

/**
 * Minh họa Sóng biển cắt giấy 3D Washi Kirie & Thuyền buồm Origami thuần túy Vector SVG
 * Thiết kế tỉ lệ hoàn hảo theo ảnh tham chiếu: 18337712357dc3b93a96a076cef25eae.jpg
 * Mở rộng độ cao tự nhiên để bờ cát hạ thấp, không bị các khối thẻ KPI che đè lên sóng hoặc thuyền buồm.
 */
export function KirieWaveIllustration() {
  return (
    <svg
      viewBox="0 0 400 310"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: 'auto', display: 'block' }}
      aria-label="Minh họa sóng biển nghệ thuật cắt giấy Washi Kirie và thuyền giấy Origami"
    >
      <defs>
        {/* Bộ lọc đổ bóng giấy thủ công 3D đa tầng (Layered Kirie Paper Drop Shadows) */}
        <filter id="kirie-shadow-deep" x="-10%" y="-10%" width="125%" height="135%">
          <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#061220" floodOpacity="0.45" />
        </filter>
        <filter id="kirie-shadow-mid" x="-10%" y="-10%" width="125%" height="135%">
          <feDropShadow dx="0" dy="3.5" stdDeviation="3" floodColor="#0A1E35" floodOpacity="0.32" />
        </filter>
        <filter id="kirie-shadow-soft" x="-10%" y="-10%" width="125%" height="135%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#0A1C33" floodOpacity="0.22" />
        </filter>
      </defs>

      {/* 1. NỀN TRỜI & CÁC LỚP MÂY CÁT WASHI TRÊN ĐƯỜNG CHÂN TRỜI (Rolling Sand Clouds) */}
      <g filter="url(#kirie-shadow-soft)">
        {/* Lớp mây cát xa sẫm */}
        <path
          d="M0 65 C30 45, 70 48, 95 62 C120 44, 165 42, 190 60 C220 40, 270 42, 300 60 C330 44, 370 46, 400 62 L400 110 L0 110 Z"
          fill="#CDB99E"
        />
        {/* Lớp mây cát vàng Washi sáng phía trước */}
        <path
          d="M20 74 C55 52, 100 56, 130 70 C165 52, 215 54, 245 70 C280 54, 335 56, 375 72 L400 80 L400 120 L0 120 L0 80 Z"
          fill="#DFCFB7"
        />
      </g>

      {/* 2. DÃY SÓNG VÀNG CÁT & SÓNG XA (Distant Waves) */}
      <path
        filter="url(#kirie-shadow-mid)"
        d="M0 88 C45 75, 110 90, 160 96 C210 102, 270 86, 330 78 C365 72, 385 76, 400 82 L400 145 L0 145 Z"
        fill="#264F75"
      />

      {/* 3. DÒNG HẢI LƯU TRUNG TÂM (Central Oceanic Meandering Channel) */}
      <path
        filter="url(#kirie-shadow-deep)"
        d="M135 96 C175 112, 205 135, 185 170 C170 192, 195 215, 215 225 L400 225 L400 96 Z"
        fill="#1A3E63"
      />
      <path
        d="M150 106 C185 122, 212 142, 198 172 C185 192, 205 212, 220 220 L285 220 C260 202, 248 180, 262 152 C275 125, 242 110, 210 105 Z"
        fill="#143252"
        opacity="0.88"
      />

      {/* 4. CON SÓNG CUỘN ĐẠI DƯƠNG BÊN TRÁI (Great Left Curling Wave) */}
      <g filter="url(#kirie-shadow-deep)">
        {/* Thân sóng cuộn xanh sẫm */}
        <path
          d="M-15 150 C35 130, 65 88, 95 106 C120 122, 85 146, 60 142 C45 139, 65 165, 90 156 C115 148, 135 166, 125 192 L0 215 Z"
          fill="#1F4E79"
        />
        {/* Bọt sóng trắng ngọn sóng trái */}
        <path
          d="M-10 145 C35 124, 68 85, 95 102 C100 106, 95 112, 85 110 C70 108, 55 119, 48 134 C40 124, 25 134, 5 144 Z"
          fill="#F7F4EE"
        />
        <circle cx="98" cy="108" r="3.5" fill="#F7F4EE" />
        <circle cx="106" cy="116" r="2.5" fill="#F7F4EE" />
        <circle cx="115" cy="125" r="2" fill="#F7F4EE" />
      </g>

      {/* 5. CON SÓNG CUỘN BÊN PHẢI (Great Right Curling Wave) */}
      <g filter="url(#kirie-shadow-deep)">
        {/* Thân sóng cuộn xanh tiền cảnh phải */}
        <path
          d="M415 140 C365 120, 330 92, 305 112 C285 128, 315 148, 340 142 C355 139, 335 165, 315 156 C290 148, 270 166, 285 200 L415 215 Z"
          fill="#173B5C"
        />
        {/* Bọt sóng giấy trắng ngọn sóng phải */}
        <path
          d="M410 135 C365 116, 332 89, 308 108 C304 111, 308 118, 318 116 C334 114, 345 126, 354 139 C365 126, 390 134, 410 134 Z"
          fill="#F7F4EE"
        />
        <circle cx="302" cy="114" r="3.5" fill="#F7F4EE" />
        <circle cx="294" cy="122" r="2.5" fill="#F7F4EE" />
        <circle cx="286" cy="132" r="2" fill="#F7F4EE" />
      </g>

      {/* 6. CON SÓNG NHỎ TIỀN CẢNH PHÍA DƯỚI GÓC PHẢI */}
      <path
        filter="url(#kirie-shadow-mid)"
        d="M400 185 C370 174, 340 166, 325 178 C315 186, 335 196, 355 193 C370 190, 390 205, 400 215 Z"
        fill="#234B70"
      />
      <path
        d="M400 182 C372 170, 344 163, 328 176 C325 178, 330 183, 338 181 C350 180, 365 190, 375 193 C385 188, 395 193, 400 196 Z"
        fill="#F7F4EE"
      />

      {/* 7. CON THUYỀN GIẤY ORIGAMI TRẮNG NỔI BẬT GIỮA DÒNG (White Origami Sailboat in Channel) */}
      <g filter="url(#kirie-shadow-mid)" transform="translate(186, 114)">
        {/* Thân thuyền Origami đa giác góc cạnh */}
        <polygon points="2,22 38,22 30,29 10,29" fill="#FFFFFF" stroke="#E2DAC6" strokeWidth="0.8" />
        {/* Cánh buồm chính cao vút */}
        <polygon points="19,1 19,20 35,20" fill="#FFFFFF" stroke="#E2DAC6" strokeWidth="0.8" />
        {/* Cánh buồm phụ trước đổ bóng Washi nhẹ */}
        <polygon points="17,5 17,20 5,20" fill="#F4EFE6" stroke="#E2DAC6" strokeWidth="0.8" />
        {/* Đổ bóng đáy thuyền trên mặt nước */}
        <ellipse cx="20" cy="30" rx="14" ry="2" fill="#0C2035" opacity="0.3" />
      </g>

      {/* 8. LỚP SÓNG XANH TIỀN CẢNH TRƯỚC BỜ CÁT */}
      <path
        filter="url(#kirie-shadow-mid)"
        d="M0 205 C80 190, 160 215, 240 200 C310 185, 370 202, 400 195 L400 240 L0 240 Z"
        fill="#1C456E"
      />

      {/* 9. BỜ CÁT UỐN LƯỢN CHUYỂN TIẾP RỘNG RÃI (Grand Layered Washi Shoreline Dunes) */}
      {/* Lớp cát 1 - Đổ bóng 3D sâu xuống biển */}
      <path
        filter="url(#kirie-shadow-deep)"
        d="M0 220 C95 204, 205 234, 305 214 C355 204, 380 212, 400 208 L400 310 L0 310 Z"
        fill="#EFE7D8"
      />

      {/* Lớp cát 2 - Bờ cát chính mịn màng màu kem ấm Washi */}
      <path
        d="M0 238 C105 222, 215 250, 315 228 C360 218, 385 225, 400 220 L400 310 L0 310 Z"
        fill="#FAF6EE"
      />
    </svg>
  );
}
