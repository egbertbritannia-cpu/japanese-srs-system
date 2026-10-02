'use client';

import React from 'react';

/**
 * JapanesePosterBackground
 * Ambient surrounding background system inspired by classic Japanese Graphic Design & Advertising
 * ("Презентация - Японская реклама.jpg"):
 * 
 * 1. Giant Asymmetric Crimson Hinomaru Discs (Vầng thái dương đỏ son kiểu áp phích Taisho / Showa)
 * 2. Sumi-e Plum Blossom Branch (Cành hoa mơ mực nho Ume uốn lượn góc phải)
 * 3. Graceful Tancho Crane Silhouette (Chim hạc đan đỉnh đứng uy nghi góc trái)
 * 4. Pagoda & Mount Fuji Skyline (Bóng chùa cổ 5 tầng & Phú Sĩ dạ cảnh mờ ảo)
 * 5. Vertical Tate-gaki Framed Marginal Seals (Dải triện chữ dọc 「日本の広告」 thanh thoát)
 * 6. Washi Parchment Canvas (Mặt giấy dó cổ truyền màu kem ấm áp)
 */
export function JapanesePosterBackground() {
  return (
    <div
      className="japanese-poster-bg-root"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* 1. MẶT TRỜI ĐỎ SON HINOMARU GÓC TRÊN BÊN PHẢI (Top-Right Crimson Sun Disc) */}
      <div
        style={{
          position: 'absolute',
          top: '-70px',
          right: '-70px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 40% 40%, #D32F2F 0%, #BC002D 60%, #9A0007 100%)',
          boxShadow: '0 12px 40px rgba(188, 0, 45, 0.28)',
          opacity: 0.88,
          zIndex: 1,
        }}
      />

      {/* 2. MẶT TRỜI ĐỎ SON HINOMARU GÓC DƯỚI BÊN TRÁI (Bottom-Left Crimson Sun Disc) */}
      <div
        style={{
          position: 'absolute',
          bottom: '-90px',
          left: '-90px',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 45% 45%, #E53935 0%, #BC002D 65%, #8B0000 100%)',
          boxShadow: '0 16px 48px rgba(188, 0, 45, 0.22)',
          opacity: 0.82,
          zIndex: 1,
        }}
      />

      {/* 3. CÀNH HOA MƠ MỰC NHO SUMI-E GÓC PHẢI (Sumi-e Plum Blossom Branch) */}
      {/* Lấy cảm hứng trực tiếp từ Slide 4 & 6 trong ảnh tham khảo 'Японская реклама' */}
      <svg
        style={{
          position: 'absolute',
          top: '20px',
          right: '-10px',
          width: '420px',
          height: '520px',
          maxWidth: '45vw',
          maxHeight: '60vh',
          zIndex: 2,
          opacity: 0.85,
          filter: 'drop-shadow(2px 4px 10px rgba(31, 29, 26, 0.08))',
        }}
        viewBox="0 0 400 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Thân cành chính uốn lượn khúc khuỷu kiểu thủy mặc */}
        <path
          d="M400 60 C340 75, 300 120, 275 180 C250 240, 220 280, 210 330 C200 380, 215 440, 225 490"
          stroke="#261E1A"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Lớp mực khô (Kasure effect) tạo vân gồ ghề của vỏ cây cổ thụ */}
        <path
          d="M395 62 C340 80, 298 122, 272 182 C248 242, 218 282, 208 332"
          stroke="#3D3028"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Các cành phụ thứ cấp */}
        <path
          d="M305 130 C260 110, 220 125, 175 110 C140 98, 110 75, 80 85"
          stroke="#261E1A"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
        <path
          d="M260 210 C210 215, 170 240, 130 235 C95 230, 75 210, 50 220"
          stroke="#261E1A"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M215 315 C170 340, 140 375, 95 390 C65 400, 40 395, 15 415"
          stroke="#261E1A"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M218 360 C245 385, 270 420, 290 460"
          stroke="#261E1A"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M190 120 C180 85, 160 65, 145 40"
          stroke="#261E1A"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* CÁC BÔNG HOA MƠ (UME BLOSSOMS - 5 CÁNH TRẮNG NGÀ VIỀN ĐỎ SON, NHỤY VÀNG) */}
        {/* Bông hoa 1 (Tại nhánh trên cùng) */}
        <g transform="translate(85, 85)">
          <circle cx="0" cy="-14" r="9" fill="#FFFDF8" stroke="#BC002D" strokeWidth="1.2" />
          <circle cx="13" cy="-4" r="9" fill="#FFFDF8" stroke="#BC002D" strokeWidth="1.2" />
          <circle cx="8" cy="12" r="9" fill="#FFFDF8" stroke="#BC002D" strokeWidth="1.2" />
          <circle cx="-8" cy="12" r="9" fill="#FFFDF8" stroke="#BC002D" strokeWidth="1.2" />
          <circle cx="-13" cy="-4" r="9" fill="#FFFDF8" stroke="#BC002D" strokeWidth="1.2" />
          <circle cx="0" cy="0" r="5" fill="#D9381E" />
          <circle cx="0" cy="0" r="2.2" fill="#F59E0B" />
          {/* Nhụy hoa vươn nhỏ */}
          <line x1="0" y1="0" x2="3" y2="-6" stroke="#B45309" strokeWidth="0.8" />
          <line x1="0" y1="0" x2="-4" y2="-5" stroke="#B45309" strokeWidth="0.8" />
          <line x1="0" y1="0" x2="5" y2="4" stroke="#B45309" strokeWidth="0.8" />
        </g>

        {/* Bông hoa 2 (Tại nhánh trái) */}
        <g transform="translate(135, 235)">
          <circle cx="0" cy="-15" r="9.5" fill="#FFFDF8" stroke="#BC002D" strokeWidth="1.2" />
          <circle cx="14" cy="-4" r="9.5" fill="#FFFDF8" stroke="#BC002D" strokeWidth="1.2" />
          <circle cx="9" cy="13" r="9.5" fill="#FFFDF8" stroke="#BC002D" strokeWidth="1.2" />
          <circle cx="-9" cy="13" r="9.5" fill="#FFFDF8" stroke="#BC002D" strokeWidth="1.2" />
          <circle cx="-14" cy="-4" r="9.5" fill="#FFFDF8" stroke="#BC002D" strokeWidth="1.2" />
          <circle cx="0" cy="0" r="5.5" fill="#D9381E" />
          <circle cx="0" cy="0" r="2.5" fill="#F59E0B" />
        </g>

        {/* Bông hoa 3 (Tại điểm rẽ thân chính) */}
        <g transform="translate(265, 195)">
          <circle cx="0" cy="-12" r="8" fill="#FFFBF5" stroke="#BC002D" strokeWidth="1" />
          <circle cx="11" cy="-3" r="8" fill="#FFFBF5" stroke="#BC002D" strokeWidth="1" />
          <circle cx="7" cy="10" r="8" fill="#FFFBF5" stroke="#BC002D" strokeWidth="1" />
          <circle cx="-7" cy="10" r="8" fill="#FFFBF5" stroke="#BC002D" strokeWidth="1" />
          <circle cx="-11" cy="-3" r="8" fill="#FFFBF5" stroke="#BC002D" strokeWidth="1" />
          <circle cx="0" cy="0" r="4" fill="#D9381E" />
          <circle cx="0" cy="0" r="1.8" fill="#F59E0B" />
        </g>

        {/* Bông hoa 4 (Tại nhánh dưới cùng) */}
        <g transform="translate(95, 390)">
          <circle cx="0" cy="-13" r="8.5" fill="#FFFDF8" stroke="#BC002D" strokeWidth="1.1" />
          <circle cx="12" cy="-4" r="8.5" fill="#FFFDF8" stroke="#BC002D" strokeWidth="1.1" />
          <circle cx="8" cy="11" r="8.5" fill="#FFFDF8" stroke="#BC002D" strokeWidth="1.1" />
          <circle cx="-8" cy="11" r="8.5" fill="#FFFDF8" stroke="#BC002D" strokeWidth="1.1" />
          <circle cx="-12" cy="-4" r="8.5" fill="#FFFDF8" stroke="#BC002D" strokeWidth="1.1" />
          <circle cx="0" cy="0" r="5" fill="#D9381E" />
          <circle cx="0" cy="0" r="2" fill="#F59E0B" />
        </g>

        {/* Các nụ hoa chúm chím (Buds) điểm xuyết dọc thân cây */}
        <circle cx="175" cy="110" r="5.5" fill="#D9381E" stroke="#BC002D" strokeWidth="1" />
        <circle cx="145" cy="40" r="4.5" fill="#D9381E" />
        <circle cx="50" cy="220" r="5" fill="#D9381E" />
        <circle cx="15" cy="415" r="4.5" fill="#D9381E" />
        <circle cx="215" cy="280" r="5" fill="#D9381E" />
        <circle cx="290" cy="460" r="5" fill="#D9381E" />

        {/* Đốm mực tàu Sumi bắn tung ngẫu hứng (Ink Splatter droplets) */}
        <circle cx="160" cy="180" r="2.5" fill="#261E1A" opacity="0.6" />
        <circle cx="240" cy="140" r="1.8" fill="#261E1A" opacity="0.5" />
        <circle cx="110" cy="310" r="2" fill="#261E1A" opacity="0.6" />
        <circle cx="70" cy="150" r="1.5" fill="#261E1A" opacity="0.5" />
      </svg>

      {/* 4. CHIM HẠC ĐAN ĐỈNH ĐỨNG UY NGHI GÓC TRÁI (Tancho Crane Silhouette) */}
      {/* Lấy cảm hứng trực tiếp từ Slide 5 & Slide 7 trong ảnh tham khảo 'Японская реклама' */}
      <svg
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '15px',
          width: '260px',
          height: '380px',
          maxWidth: '35vw',
          maxHeight: '50vh',
          zIndex: 2,
          opacity: 0.72,
          filter: 'drop-shadow(2px 6px 12px rgba(31, 29, 26, 0.09))',
        }}
        viewBox="0 0 260 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Đỉnh đầu chỏm đỏ son đặc trưng của chim hạc Đan Đỉnh Nhật (Tancho) */}
        <circle cx="148" cy="45" r="5.5" fill="#D9381E" />

        {/* Mỏ chim dài nhọn */}
        <path d="M142 48 L105 52 L142 54 Z" fill="#4B5563" />

        {/* Đầu & cổ chim uốn cong chữ S duyên dáng */}
        <path
          d="M148 45 C158 45, 166 52, 164 62 C161 74, 150 88, 148 105 C145 125, 152 145, 160 165 C168 185, 172 205, 170 220"
          stroke="#1F1D1A"
          strokeWidth="11"
          strokeLinecap="round"
        />

        {/* Ức và thân chim hình giọt nước lụa trắng */}
        <path
          d="M165 170 C195 190, 220 230, 210 270 C200 300, 160 315, 130 305 C100 295, 95 260, 105 230 C115 195, 140 175, 165 170 Z"
          fill="#FAF8F5"
          stroke="#8B8579"
          strokeWidth="2.5"
        />

        {/* Lông đuôi xếp lớp mực đen tuyền (Black tail plumes) */}
        <path
          d="M195 260 C235 275, 255 310, 245 340 C230 350, 205 340, 185 315 C175 300, 180 280, 195 260 Z"
          fill="#1F1D1A"
        />
        <path
          d="M185 270 C215 290, 230 325, 220 345 C205 350, 185 335, 175 315 Z"
          fill="#3B3530"
        />

        {/* Đôi chân dài khẳng khiu đứng vững chãi */}
        <line x1="140" y1="305" x2="135" y2="375" stroke="#374151" strokeWidth="3" strokeLinecap="round" />
        <line x1="165" y1="305" x2="168" y2="375" stroke="#374151" strokeWidth="3" strokeLinecap="round" />
        {/* Móng chân xòe bám đất */}
        <path d="M135 375 L120 380 M135 375 L132 382 M135 375 L145 379" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M168 375 L155 380 M168 375 L168 382 M168 375 L180 379" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />

        {/* Cụm cỏ lau nước mờ ảo dưới chân hạc */}
        <path d="M90 380 C110 350, 120 320, 115 295" stroke="#78866B" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <path d="M100 380 C125 345, 130 310, 128 285" stroke="#78866B" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <path d="M180 380 C195 355, 205 330, 200 305" stroke="#78866B" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
      </svg>

      {/* 5. DẢI CHỮ DỌC TATE-GAKI KHUNG KẺ THANH MẢNH 「日本の広告」 HAI BÊN VIỀN TRANG */}
      {/* Góc trái: Đúng theo chuẩn khung hộp viền kép chữ dọc trên Slide 4 & Slide 7 */}
      <div
        className="japanese-margin-label-left"
        style={{
          position: 'absolute',
          top: '160px',
          left: '28px',
          zIndex: 3,
          padding: '12px 6px',
          border: '1.5px solid #BC002D',
          borderRadius: '3px',
          background: 'rgba(255, 253, 248, 0.88)',
          boxShadow: '0 4px 12px rgba(188, 0, 45, 0.12)',
          writingMode: 'vertical-rl',
          textOrientation: 'upright',
          letterSpacing: '0.24em',
          fontFamily: 'var(--font-mincho), serif',
          fontWeight: 800,
          fontSize: '0.86rem',
          color: '#BC002D',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '0.65rem', color: '#B45309', letterSpacing: '0.1em' }}>●</span>
        日本の広告 · 記憶道
        <span style={{ fontSize: '0.65rem', color: '#B45309', letterSpacing: '0.1em' }}>●</span>
      </div>

      {/* Góc phải: Dải triện bổ trợ phong cách Taisho Roman */}
      <div
        className="japanese-margin-label-right"
        style={{
          position: 'absolute',
          bottom: '120px',
          right: '28px',
          zIndex: 3,
          padding: '12px 6px',
          border: '1.5px solid #3B433E',
          borderRadius: '3px',
          background: 'rgba(255, 253, 248, 0.88)',
          boxShadow: '0 4px 12px rgba(31, 36, 33, 0.08)',
          writingMode: 'vertical-rl',
          textOrientation: 'upright',
          letterSpacing: '0.24em',
          fontFamily: 'var(--font-mincho), serif',
          fontWeight: 800,
          fontSize: '0.86rem',
          color: '#3B433E',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '0.65rem', color: '#BC002D', letterSpacing: '0.1em' }}>◆</span>
        温故知新 · 引札の美
        <span style={{ fontSize: '0.65rem', color: '#BC002D', letterSpacing: '0.1em' }}>◆</span>
      </div>
    </div>
  );
}

export default JapanesePosterBackground;
