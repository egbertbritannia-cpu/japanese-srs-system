# 🎨 TÀI LIỆU 01: HỆ THỐNG THIẾT KẾ & ĐỊNH NGHĨA BIẾN (DESIGN SYSTEM & TOKENS)
## Dự án: Japanese SRS System (FSRS)
## Hệ quy chiếu: Nippon Traditional Colors (Nippon Colors - 日本の伝統色) & Wagara Patterns

---

### 1. BẢNG MÀU TRUYỀN THỐNG NHẬT BẢN TƯƠI SÁNG (NIPPON BRIGHT COLOR PALETTE)
Tất cả các màu sắc được chuẩn hóa theo mã màu truyền thống Nhật Bản, loại bỏ hoàn toàn các gam màu xám xỉn, đen đặc (`#000000`) hay xanh công nghệ chói mắt (`#3b82f6` thông thường).

```css
/* ==========================================================================
   NIPPON TRADITIONAL BRIGHT COLOR PALETTE (CSS DESIGN TOKENS)
   ========================================================================== */
:root {
  /* --- 1. NỀN GIẤY TRUYỀN THỐNG WASHI & KINARI (和紙・生成り) --- */
  --washi-bg:          #FAF8F5; /* Nền chính: Màu giấy dó Washi ấm áp, dịu mắt */
  --washi-surface:     #FFFFFF; /* Bề mặt thẻ card: Giấy trắng mịn cao cấp */
  --washi-card:        #FDFCFA; /* Bề mặt thứ cấp: Giấy ép thủ công */
  --washi-border:      #E8E2D8; /* Đường viền giấy Washi mỏng nhẹ */
  --washi-border-soft: #F0EAE1; /* Đường phân cách siêu mảnh */

  /* --- 2. XANH MATCHA & MOEGI (抹茶・萌黄) - LẤY CHUẨN TỪ ẢNH SEIGAIHA SCREENSHOT --- */
  --matcha-primary:    #88A752; /* Màu chuẩn từ ảnh mẫu Screenshot Seigaiha */
  --matcha-deep:       #708D3E; /* Tông đậm: Dùng cho trạng thái Hover & Viền nhấn */
  --matcha-light:      #A3C16F; /* Tông sáng tươi mới */
  --matcha-subtle:     #EBF2DF; /* Tông nền nhạt: Dùng cho Badge & Nền thẻ tích cực */
  --matcha-tint:       #F4F8EE; /* Tông nền siêu nhẹ: Dùng cho Box thông tin phụ */

  /* --- 3. ĐỎ SON CỔNG TORII & SHU-IRO (朱色・鳥居) - MÀU NHẤN CTA QUAN TRỌNG --- */
  --torii-red:         #D9381E; /* Đỏ son rực rỡ, trang nghiêm của cổng Đền thờ Thần đạo */
  --torii-hover:       #B82C15; /* Đỏ son đậm khi di chuột */
  --torii-subtle:      #FCEEEA; /* Tông đỏ phấn nhạt dùng làm nền cảnh báo mềm */
  --torii-glow:        rgba(217, 56, 30, 0.25); /* Hào quang đổ bóng nút chính */

  /* --- 4. HỒNG ANH ĐÀO SAKURA (桜色) - MÀU HOẠT HỌA & TRẠNG THÁI ÔN TẬP --- */
  --sakura-pink:       #F472B6; /* Màu hoa anh đào nở rộ */
  --sakura-petal:      #FFB7C5; /* Màu cánh hoa rơi */
  --sakura-light:      #FFF0F5; /* Tông nền hồng phấn êm dịu */
  --sakura-deep:       #DB2777; /* Hồng thắm cho điểm nhấn */

  /* --- 5. VÀNG KIM YAMABUKI (山吹色) - MÀU THÀNH TÍCH & TIẾN ĐỘ SRS --- */
  --yamabuki-gold:     #F59E0B; /* Vàng hoa Yamabuki rực rỡ */
  --yamabuki-light:    #FEF3C7; /* Vàng kem nhạt cho vệt highlight */
  --yamabuki-amber:    #D97706; /* Màu hổ phách cho đường viền mạ vàng */

  /* --- 6. XANH NGỌC ASAGI & RYOKUSHO (浅葱・緑青) --- */
  --asagi-teal:        #0D9488; /* Màu nước hồ vườn thiền Zen */
  --asagi-light:       #CCFBF1; /* Nền xanh ngọc nhạt */

  /* --- 7. MỰC NHO SUMI-IRO (墨色) - ĐỘ TƯƠNG PHẢN ĐỌC HOÀN HẢO --- */
  --sumi-ink:          #1F2421; /* Mực tàu đậm tự nhiên - Không dùng đen chết #000000 */
  --sumi-charcoal:     #3B433E; /* Mực xám vừa cho phụ đề, hướng dẫn */
  --sumi-faded:        #717C75; /* Mực nhạt cho nhãn, ghi chú ngày tháng */
  --sumi-water:        #9FAAA3; /* Nước mực loãng cho placeholder */

  /* --- 8. ĐỘ SÂU ĐA TẦNG (HIGH-AESTHETIC LAYERED SHADOWS) --- */
  --shadow-washi-sm:   0 1px 3px rgba(31, 36, 33, 0.04), 0 1px 2px rgba(31, 36, 33, 0.02);
  --shadow-washi-md:   0 4px 6px -1px rgba(31, 36, 33, 0.05), 0 2px 4px -2px rgba(31, 36, 33, 0.03);
  --shadow-washi-lg:   0 10px 25px -5px rgba(31, 36, 33, 0.06), 0 8px 10px -6px rgba(31, 36, 33, 0.04);
  --shadow-karuta:     0 12px 32px -4px rgba(112, 141, 62, 0.12), 0 4px 12px -2px rgba(31, 36, 33, 0.04);
  --shadow-torii-btn:  0 8px 20px -2px rgba(217, 56, 30, 0.35), 0 2px 6px -1px rgba(217, 56, 30, 0.2);
}
```

---

### 2. THƯ VIỆN HỌA TIẾT TRUYỀN THỐNG WAGARA (VECTOR INLINE PATTERNS)

Mọi họa tiết đều được viết dưới dạng **Vector SVG Data URI thuần túy** nhúng trực tiếp vào CSS. Không tải file ảnh tĩnh bên ngoài để đảm bảo:
- Tốc độ tải trang 0ms (Zero network request).
- Độ sắc nét vô cực trên màn hình Retina/4K.
- Hoàn toàn tùy biến kích thước và độ trong suốt qua CSS.

#### 2.1. Họa tiết Seigaiha (青海波 - Sóng biển xanh Matcha chuẩn ảnh chụp)
Ý nghĩa: Những làn sóng biển nhấp nhô vô tận tượng trưng cho sự bình yên, may mắn và bền bỉ trong việc tích lũy tri thức.

```css
/* Phiên bản 1: Nền xanh Matcha #88A752, sóng trắng (Đúng 100% Screenshot 2026-10-02 175825.png) */
.wagara-seigaiha-matcha {
  background-color: #88a752;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='32' viewBox='0 0 64 32'%3E%3Cpath d='M0 32 A32 32 0 0 1 64 32 M6 32 A26 26 0 0 1 58 32 M12 32 A20 20 0 0 1 52 32 M18 32 A14 14 0 0 1 46 32 M24 32 A8 8 0 0 1 40 32 M-32 16 A32 32 0 0 1 32 16 M-26 16 A26 26 0 0 1 26 16 M-20 16 A20 20 0 0 1 20 16 M-14 16 A14 14 0 0 1 14 16 M-8 16 A8 8 0 0 1 8 16 M32 16 A32 32 0 0 1 96 16 M38 16 A26 26 0 0 1 90 16 M44 16 A20 20 0 0 1 84 16 M50 16 A14 14 0 0 1 78 16 M56 16 A8 8 0 0 1 72 16 M0 0 A32 32 0 0 1 64 0 M6 0 A26 26 0 0 1 58 0 M12 0 A20 20 0 0 1 52 0 M18 0 A14 14 0 0 1 46 0 M24 0 A8 8 0 0 1 40 0' fill='none' stroke='%23ffffff' stroke-width='2.2' stroke-linecap='round'/%3E%3C/svg%3E");
  background-size: 64px 32px;
}

/* Phiên bản 2: Nền sáng Washi mờ nhẹ (Subtle Watermark Water Wave - Dùng làm nền thẻ & Section) */
.wagara-seigaiha-subtle {
  background-color: var(--washi-bg);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='32' viewBox='0 0 64 32'%3E%3Cpath d='M0 32 A32 32 0 0 1 64 32 M6 32 A26 26 0 0 1 58 32 M12 32 A20 20 0 0 1 52 32 M18 32 A14 14 0 0 1 46 32 M24 32 A8 8 0 0 1 40 32 M-32 16 A32 32 0 0 1 32 16 M-26 16 A26 26 0 0 1 26 16 M-20 16 A20 20 0 0 1 20 16 M-14 16 A14 14 0 0 1 14 16 M-8 16 A8 8 0 0 1 8 16 M32 16 A32 32 0 0 1 96 16 M38 16 A26 26 0 0 1 90 16 M44 16 A20 20 0 0 1 84 16 M50 16 A14 14 0 0 1 78 16 M56 16 A8 8 0 0 1 72 16 M0 0 A32 32 0 0 1 64 0 M6 0 A26 26 0 0 1 58 0 M12 0 A20 20 0 0 1 52 0 M18 0 A14 14 0 0 1 46 0 M24 0 A8 8 0 0 1 40 0' fill='none' stroke='rgba(136, 167, 82, 0.12)' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
  background-size: 64px 32px;
}
```

#### 2.2. Họa tiết Asanoha (麻の葉 - Lá gai dầu)
Ý nghĩa: Sự vươn lên mạnh mẽ, bền bỉ của cây gai dầu, tượng trưng cho trí nhớ phát triển vững chãi.

```css
.wagara-asanoha {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='104' viewBox='0 0 60 104'%3E%3Cpath d='M30 0 L60 17.32 L60 52 L30 69.28 L0 52 L0 17.32 Z M30 0 L30 69.28 M0 17.32 L60 52 M0 52 L60 17.32 M30 34.64 L30 0 M30 34.64 L60 17.32 M30 34.64 L60 52 M30 34.64 L30 69.28 M30 34.64 L0 52 M30 34.64 L0 17.32' fill='none' stroke='rgba(217, 56, 30, 0.08)' stroke-width='1.2'/%3E%3C/svg%3E");
  background-size: 30px 52px;
}
```

#### 2.3. Họa tiết Yagasuri (矢絣 - Lông tên bay tới)
Ý nghĩa: Mũi tên một khi bắn ra sẽ không quay đầu lại, dùng cho **Thanh tiến độ ôn tập (SRS Progress Bar)** thể hiện sự tập trung và tiến lên phía trước.

```css
.wagara-yagasuri {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M0 0 L20 20 L40 0 L40 20 L20 40 L0 20 Z' fill='rgba(136, 167, 82, 0.25)'/%3E%3C/svg%3E");
  background-size: 20px 20px;
}
```

#### 2.4. Họa tiết vân xơ giấy Washi (Handmade Paper Fiber Texture)
```css
.washi-paper-texture {
  background-color: var(--washi-bg);
  background-image: radial-gradient(#E8E2D8 0.75px, transparent 0.75px), radial-gradient(#F0EAE1 0.75px, #FAF8F5 0.75px);
  background-size: 30px 30px;
  background-position: 0 0, 15px 15px;
}
```

---

### 3. HỆ NGHỆ THUẬT CHỮ & TYPOGRAPHY NHẬT BẢN (TYPOGRAPHIC SYSTEM)

Nhập font trực tiếp từ Google Fonts thông qua `next/font/google` trong Next.js:
1. **Shippori Mincho (`font-mincho`)**: Font chữ có chân phong cách thư pháp thanh nhã, dùng cho chữ Kanji nổi bật trên thẻ bài, tiêu đề ngày tháng và câu ngạn ngữ Kotowaza.
2. **Zen Maru Gothic (`font-maru`)**: Font Sans bo tròn góc ấm áp, đặc trưng của thiết kế hiện đại Tokyo, dùng cho Furigana, tiêu đề điều hướng, nút bấm.
3. **Plus Jakarta Sans / Noto Sans JP (`font-sans`)**: Dùng cho văn bản nội dung, số liệu FSRS, bảng từ vựng.

```typescript
// Cấu hình import font trong src/app/layout.tsx:
import { Zen_Maru_Gothic, Shippori_Mincho, Plus_Jakarta_Sans } from 'next/font/google';

export const zenMaru = Zen_Maru_Gothic({
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-maru',
});

export const shipporiMincho = Shippori_Mincho({
  weight: ['500', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mincho',
});

export const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});
```

#### Quy chuẩn hiển thị Furigana (HTML Ruby Markup):
```html
<!-- Cấu trúc chuẩn ngữ nghĩa cho Furigana tiếng Nhật -->
<ruby class="japanese-ruby">
  漢<rt>かん</rt>字<rt>じ</rt>
</ruby>
```
CSS tương ứng:
```css
ruby.japanese-ruby {
  font-family: var(--font-mincho), serif;
  font-size: 2.75rem;
  font-weight: 700;
  color: var(--sumi-ink);
  ruby-position: over;
}
ruby.japanese-ruby rt {
  font-family: var(--font-maru), sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: var(--matcha-deep);
  letter-spacing: 0.05em;
}
```

---

### 4. BIỂU TƯỢNG VĂN HÓA & TRANG TRÍ VIỀN (WA-ACCENTS)
1. **Viền thẻ bài Tatami (Tatami Edge - 畳の縁)**: Viền mép dưới hoặc cạnh trái thẻ có dải hoa văn họa tiết truyền thống dày 4px.
2. **Thanh ngang cổng Torii (Torii Kasagi Line)**: Dải viền đỏ son mảnh trên đỉnh Header của toàn trang web (`border-top: 4px solid var(--torii-red)`).
3. **Con dấu son Inkan / Hanko (判子)**: Khung vuông bo nhẹ viền kép màu đỏ son, bên trong khắc chữ triện (Tenkoku) màu đỏ son trên nền trong suốt.
