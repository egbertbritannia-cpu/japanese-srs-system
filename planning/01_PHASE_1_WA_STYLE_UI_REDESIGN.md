# 🌸 GIAI ĐOẠN 1: TÁI THIẾT KẾ TOÀN DIỆN GIAO DIỆN PHONG CÁCH NHẬT BẢN TRUYỀN THỐNG (AUTHENTIC WA-STYLE UI)
## Hệ Thống: Japanese SRS System (記憶道 FSRS) · Bản Quy Hoạch Hợp Nhất (Consolidated Specification)

> **Thông tin tổng hợp:**
> * **Giai đoạn:** Phase 1 (Sprints 1-3)
> * **Tệp nguồn hợp nhất:** `00_OVERVIEW_AND_MANIFESTO.md` đến `08_STEP_BY_STEP_EXECUTION_CHECKLIST.md` (9 tệp)
> * **Trọng tâm kỹ thuật:** Gam màu Washi `#FAF8F5`, Xanh Matcha `#88A752`, Đỏ son Torii `#D9381E`, Họa tiết Seigaiha/Asanoha, Font chữ `Shippori Mincho` & `Zen Maru Gothic`.
> * **Cam kết cốt lõi:** Zero Backend Regression (Bảo toàn 100% logic FSRS, Drizzle ORM và các API Route).

---

### 📑 MỤC LỤC TỔNG QUAN GIAI ĐOẠN 1
1. [phần 1: tổng quan chiến lược & bản tuyên ngôn tái thiết kế giao diện](#phan-1)
2. [phần 2: hệ thống thiết kế & biến css nippon colors (design system & tokens)](#phan-2)
3. [phần 3: thư viện hoạt họa văn hóa & kho biểu tượng svg thuần túy](#phan-3)
4. [phần 4: mã nguồn toàn cục & layout thanh điều hướng torii](#phan-4)
5. [phần 5: thiết kế & thi công trang tổng quan honmaru (dashboard)](#phan-5)
6. [phần 6: thiết kế & thi công trang quản lý thẻ tanzakucho (cards management)](#phan-6)
7. [phần 7: thiết kế & thi công trang soạn thẻ ai copilot shodo desk](#phan-7)
8. [phần 8: thiết kế & thi công trang ôn tập karuta active recall (review session)](#phan-8)
9. [phần 9: quy trình thực thi & checklist kiểm định 10 bước dành cho agent](#phan-9)

---

<a id="phan-1"></a>
# PHẦN 1: PHẦN 1: TỔNG QUAN CHIẾN LƯỢC & BẢN TUYÊN NGÔN TÁI THIẾT KẾ GIAO DIỆN
*Tệp gốc: `doc\00_OVERVIEW_AND_MANIFESTO.md`*

---

## 🌸 TÀI LIỆU 00: TỔNG QUAN DỰ ÁN & BẢN TUYÊN NGÔN TÁI THIẾT KẾ (REDESIGN MANIFESTO)
### Dự án: Japanese SRS System (FSRS Spaced Repetition System)
### Phong cách: Traditional Japanese Craftsmanship & Bright Luminous Aesthetics (和風・美学)

---

#### 1. BỐI CẢNH & MỤC TIÊU CỐT LÕI (OBJECTIVES)
Giao diện hiện tại của dự án `japanese-srs-system` mang tông màu xám/xanh đen tối (Dark Slate `#0f172a`), các khối hộp thô ráp, sử dụng inline-style rời rạc và hoàn toàn thiếu vắng linh hồn văn hóa Nhật Bản. Người học tiếng Nhật cần một không gian học tập truyền cảm hứng, thanh tịnh, tinh tế như một trà thất (Chashitsu) hay một bàn thư pháp (Shodo), kết hợp cùng công nghệ lặp lại ngắt quãng hiện đại FSRS.

Kế hoạch tái thiết kế này được xây dựng với mục tiêu:
1. **Chuyển đổi hoàn toàn sang phong cách Nhật Bản truyền thống kết hợp hiện đại (Modern Wa-style - 和モダン)**:
   - Tông màu tươi sáng, ấm áp, trang nhã (Bright Luminous Palette), lấy cảm hứng từ giấy Washi, trà xanh Matcha, hoa anh đào Sakura, cổng Torii son đỏ, và vàng kim Yamabuki.
   - Họa tiết truyền thống **Seigaiha (青海波 - Sóng biển thanh bình)** lấy mẫu trực tiếp từ bản vẽ chuẩn của người dùng (tông màu xanh cốm Matcha `#88A752` trên nền trắng tinh khiết hoặc đảo sắc hài hòa).
   - Bổ sung hệ họa tiết phụ trợ Wagara: **Asanoha (麻の葉 - Lá gai dầu)**, **Shippo (七宝 - Bảy báu vật)**, **Yagasuri (矢絣 - Lông tên)**, và vân giấy xơ **Washi**.
2. **Tích hợp hoạt họa văn hóa Nhật Bản (Japanese Cultural Micro-Interactions)**:
   - Cánh hoa anh đào rơi nhẹ nhàng (Hanafubuki / Sakura Flutter).
   - Hiệu ứng nét cọ thư pháp khai mở tiêu đề (Shodo Brush Reveal).
   - Thẻ lật 3D mô phỏng bài cổ Hyakunin Isshu Karuta và quạt giấy Sensu.
   - Hoạt họa đóng dấu son đỏ Inkan / Hanko (判子) khi người học ghi nhớ thẻ hoặc AI duyệt từ vựng.
   - Búp bê Daruma (達磨) điểm mắt theo tiến độ ôn tập trong ngày.
   - Hiệu ứng gợn sóng Tsukubai (Hamon) khi tương tác nút bấm.
3. **RÀNG BUỘC TUYỆT ĐỐI VỀ KIẾN TRÚC BACKEND (ZERO BACKEND TOUCH)**:
   - **Nghiêm cấm** chỉnh sửa bất kỳ logic API nào trong `src/app/api/` (`cards`, `copilot/draft`, `nlp`, `review`).
   - **Nghiêm cấm** thay đổi cấu trúc database SQLite, Drizzle schema trong `src/db/`, và thuật toán FSRS trong `src/core/`.
   - Giữ nguyên 100% hợp đồng dữ liệu (data contracts), payload request/response, và các trường dữ liệu (kanji_surface, reading_furigana, pitch_pattern, atomicity, v.v.).
4. **Chuẩn hóa cho Agent thực thi tự động (Zero Deductions Needed)**:
   - Toàn bộ mã nguồn TSX, CSS, SVG và thông số kỹ thuật được viết sẵn 100%, không sử dụng các ghi chú mơ hồ như "tự triển khai", "viết tiếp tại đây".
   - Agent tiếp nhận chỉ việc copy-paste theo đúng thứ tự checklist mà không cần suy luận hay bổ sung thêm bất kỳ logic nào.

---

#### 2. PHÂN TÍCH HIỆN TRẠNG & BẢNG SO SÁNH TRƯỚC / SAU (BEFORE vs AFTER)

| Hạng mục | Hiện trạng (Before) | Đề xuất Tái thiết kế (After - Wa-Style) |
| :--- | :--- | :--- |
| **Bảng màu chủ đạo** | Tối, u ám (`#0f172a`, `#1e293b`, `#3b82f6`) | **Tươi sáng, ấm áp, tinh khiết**: Nền giấy Washi (`#FAF8F5`), xanh Matcha Seigaiha (`#7A9A48` / `#88A752`), hồng Sakura (`#F472B6`), đỏ son Torii (`#E64A19`), vàng kim Yamabuki (`#F59E0B`). |
| **Họa tiết (Patterns)** | Không có, khối phẳng vô hồn | **Họa tiết Wagara chuẩn**: Seigaiha (sóng biển Matcha), Asanoha (hoa văn hình học), vân giấy Washi tự nhiên. |
| **Typography** | Font hệ thống mặc định không hỗ trợ mỹ thuật Nhật | Bộ font chuẩn Nhật cao cấp: `Zen Maru Gothic` (tròn trịa, hiện đại), `Shippori Mincho` (thư pháp, truyền thống), `Plus Jakarta Sans` (chữ số, Latinh). |
| **Thẻ học (Cards)** | Khung chữ nhật phẳng, viền xám thô | **Thẻ bài Karuta truyền thống**: Bo góc mềm, viền vàng kim tinh tế, vân giấy xơ, hiển thị Furigana chuẩn Ruby và sơ đồ cao độ Pitch Accent Tokyo. |
| **Tương tác & Hoạt họa**| Tĩnh 100%, chuyển tab khô khan | **Hoạt họa văn hóa**: Cánh hoa anh đào rơi, nét cọ thư pháp lướt, đóng dấu son Inkan đỏ khi duyệt thẻ, gợn sóng nước Zen garden. |
| **Biểu tượng (Icons)** | Emoji đơn giản (🇯🇵, 🚀, 📚) | **Vector SVG văn hóa độc quyền**: Cổng Torii, quạt Sensu, búp bê Daruma, dấu son Hanko, hạc giấy Orizuru, núi Phú Sĩ. |
| **Dashboard** | 3 ô thống kê thô sơ | **Bento Grid phong cách Nhật**: Thẻ điều ước Ema (絵馬), thanh tiến độ lông tên Yagasuri, linh vật Daruma điểm mắt mục tiêu ngày, câu thành ngữ Kotowaza mỗi ngày. |

---

#### 3. SƠ ĐỒ ĐỊNH DANH TÀI LIỆU TRONG FOLDER `doc/`

```text
D:\project\japanese-srs-system\doc/
├── README.md                                          # Mục lục điều phối & tóm tắt nhanh
├── 00_OVERVIEW_AND_MANIFESTO.md                       # Bản tuyên ngôn kiến trúc & so sánh Before/After (File này)
├── 01_DESIGN_SYSTEM_AND_TOKENS.md                     # Bộ Design Tokens (Colors, Typography, Wagara SVGs, Shadows)
├── 02_CULTURAL_ANIMATIONS_AND_ASSETS.md               # Bộ hoạt họa văn hóa & Thư viện icon SVG độc quyền
├── 03_GLOBAL_STYLES_AND_LAYOUT.md                     # Mã nguồn hoàn chỉnh: globals.css & layout.tsx (Header/Footer)
├── 04_PAGE_DASHBOARD_IMPLEMENTATION.md                # Mã nguồn hoàn chỉnh: src/app/page.tsx (Dashboard Bento Nhật)
├── 05_PAGE_CARDS_MANAGEMENT_IMPLEMENTATION.md         # Mã nguồn hoàn chỉnh: src/app/cards/page.tsx (Quản lý thẻ Makimono)
├── 06_PAGE_AI_COPILOT_AND_NEW_CARD_IMPLEMENTATION.md  # Mã nguồn hoàn chỉnh: src/app/cards/new/page.tsx (Bàn thư pháp Shodo)
├── 07_PAGE_REVIEW_ACTIVE_RECALL_IMPLEMENTATION.md     # Mã nguồn hoàn chỉnh: src/app/review/page.tsx (Phiên học Karuta 3D)
└── 08_STEP_BY_STEP_EXECUTION_CHECKLIST.md             # Checklist từng bước dành cho Agent thực thi (Zero Guesswork)
```

---

#### 4. NGUYÊN TẮC BẢO TOÀN BACKEND (BACKEND SAFETY CONTRACT)
Agent khi thực thi kế hoạch này PHẢI tuân thủ các nguyên tắc sau:
1. **Không can thiệp vào `src/app/api/**/route.ts`**: Tất cả logic xử lý API GET, POST, PUT giữ nguyên 100%.
2. **Không can thiệp vào `src/db/` & `src/core/`**: Không sửa Drizzle ORM, không sửa ts-fsrs scheduler, không sửa Zod schema guardrails.
3. **Chỉ can thiệp vào tầng Presentation**:
   - `src/app/globals.css`
   - `src/app/layout.tsx`
   - `src/app/page.tsx`
   - `src/app/cards/page.tsx`
   - `src/app/cards/new/page.tsx`
   - `src/app/review/page.tsx`
   - Tạo mới các component phụ trợ giao diện trong `src/components/japanese/` (nếu cần tổ chức module hóa sạch sẽ).
4. **Bảo toàn 100% State và Event Handlers**:
   - Mọi form submission, API call fetch (`/api/copilot/draft`, `/api/review`, v.v.), tham số `draftId`, `editedData`, `rating`, `atomicity` đều được giữ nguyên vẹn trong các hàm xử lý sự kiện.

---


<a id="phan-2"></a>
# PHẦN 2: PHẦN 2: HỆ THỐNG THIẾT KẾ & BIẾN CSS NIPPON COLORS (DESIGN SYSTEM & TOKENS)
*Tệp gốc: `doc\01_DESIGN_SYSTEM_AND_TOKENS.md`*

---

## 🎨 TÀI LIỆU 01: HỆ THỐNG THIẾT KẾ & ĐỊNH NGHĨA BIẾN (DESIGN SYSTEM & TOKENS)
### Dự án: Japanese SRS System (FSRS)
### Hệ quy chiếu: Nippon Traditional Colors (Nippon Colors - 日本の伝統色) & Wagara Patterns

---

#### 1. BẢNG MÀU TRUYỀN THỐNG NHẬT BẢN TƯƠI SÁNG (NIPPON BRIGHT COLOR PALETTE)
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

#### 2. THƯ VIỆN HỌA TIẾT TRUYỀN THỐNG WAGARA (VECTOR INLINE PATTERNS)

Mọi họa tiết đều được viết dưới dạng **Vector SVG Data URI thuần túy** nhúng trực tiếp vào CSS. Không tải file ảnh tĩnh bên ngoài để đảm bảo:
- Tốc độ tải trang 0ms (Zero network request).
- Độ sắc nét vô cực trên màn hình Retina/4K.
- Hoàn toàn tùy biến kích thước và độ trong suốt qua CSS.

##### 2.1. Họa tiết Seigaiha (青海波 - Sóng biển xanh Matcha chuẩn ảnh chụp)
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

##### 2.2. Họa tiết Asanoha (麻の葉 - Lá gai dầu)
Ý nghĩa: Sự vươn lên mạnh mẽ, bền bỉ của cây gai dầu, tượng trưng cho trí nhớ phát triển vững chãi.

```css
.wagara-asanoha {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='104' viewBox='0 0 60 104'%3E%3Cpath d='M30 0 L60 17.32 L60 52 L30 69.28 L0 52 L0 17.32 Z M30 0 L30 69.28 M0 17.32 L60 52 M0 52 L60 17.32 M30 34.64 L30 0 M30 34.64 L60 17.32 M30 34.64 L60 52 M30 34.64 L30 69.28 M30 34.64 L0 52 M30 34.64 L0 17.32' fill='none' stroke='rgba(217, 56, 30, 0.08)' stroke-width='1.2'/%3E%3C/svg%3E");
  background-size: 30px 52px;
}
```

##### 2.3. Họa tiết Yagasuri (矢絣 - Lông tên bay tới)
Ý nghĩa: Mũi tên một khi bắn ra sẽ không quay đầu lại, dùng cho **Thanh tiến độ ôn tập (SRS Progress Bar)** thể hiện sự tập trung và tiến lên phía trước.

```css
.wagara-yagasuri {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M0 0 L20 20 L40 0 L40 20 L20 40 L0 20 Z' fill='rgba(136, 167, 82, 0.25)'/%3E%3C/svg%3E");
  background-size: 20px 20px;
}
```

##### 2.4. Họa tiết vân xơ giấy Washi (Handmade Paper Fiber Texture)
```css
.washi-paper-texture {
  background-color: var(--washi-bg);
  background-image: radial-gradient(#E8E2D8 0.75px, transparent 0.75px), radial-gradient(#F0EAE1 0.75px, #FAF8F5 0.75px);
  background-size: 30px 30px;
  background-position: 0 0, 15px 15px;
}
```

---

#### 3. HỆ NGHỆ THUẬT CHỮ & TYPOGRAPHY NHẬT BẢN (TYPOGRAPHIC SYSTEM)

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

##### Quy chuẩn hiển thị Furigana (HTML Ruby Markup):
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

#### 4. BIỂU TƯỢNG VĂN HÓA & TRANG TRÍ VIỀN (WA-ACCENTS)
1. **Viền thẻ bài Tatami (Tatami Edge - 畳の縁)**: Viền mép dưới hoặc cạnh trái thẻ có dải hoa văn họa tiết truyền thống dày 4px.
2. **Thanh ngang cổng Torii (Torii Kasagi Line)**: Dải viền đỏ son mảnh trên đỉnh Header của toàn trang web (`border-top: 4px solid var(--torii-red)`).
3. **Con dấu son Inkan / Hanko (判子)**: Khung vuông bo nhẹ viền kép màu đỏ son, bên trong khắc chữ triện (Tenkoku) màu đỏ son trên nền trong suốt.

---


<a id="phan-3"></a>
# PHẦN 3: PHẦN 3: THƯ VIỆN HOẠT HỌA VĂN HÓA & KHO BIỂU TƯỢNG SVG THUẦN TÚY
*Tệp gốc: `doc\02_CULTURAL_ANIMATIONS_AND_ASSETS.md`*

---

## 🎐 TÀI LIỆU 02: HOẠT HỌA VĂN HÓA & KHO BIỂU TƯỢNG SVG (CULTURAL ANIMATIONS & ASSETS)
### Dự án: Japanese SRS System (FSRS)
### Yêu cầu: Pure CSS / Canvas / SVG (Zero Third-Party Dependency, React 19 Compatible)

---

#### 1. HOẠT HỌA 1: CÁNH HOA ANH ĐÀO RƠI (HANAFUBUKI / SAKURA FLUTTER)

Hiệu ứng cánh hoa anh đào bay lượn nhẹ nhàng trong gió xuân mang lại cảm giác bình yên của xứ Phù Tang. Để đạt hiệu năng 60fps mượt mà và không gây giật lag trên thiết bị di động, hoạt họa sử dụng các cánh hoa vector siêu nhẹ kết hợp CSS GPU-accelerated transforms (`translate3d`, `rotate3d`).

##### 1.1. Mã CSS Keyframes (Nhúng vào `globals.css`)
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

##### 1.2. React Component Cánh hoa (`src/components/japanese/SakuraBackground.tsx`)
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

#### 2. HOẠT HỌA 2: ĐÓNG DẤU SON INKAN / HANKO (判子 STAMP BOUNCE)

Trong văn hóa công vụ và nghệ thuật Nhật Bản, con dấu Hanko son đỏ tượng trưng cho sự xác nhận, hoàn tất (済 - Sumi), và phê chuẩn.
Khi người học đánh giá thẻ bài ("Good" / "Easy") hoặc AI Copilot phê duyệt thẻ, con dấu son đỏ sẽ dập mạnh xuống với hiệu ứng bật nảy cơ học (Mechanical Spring Stamp) và góc nghiêng tự nhiên 6 độ.

##### 2.1. Mã CSS Keyframes
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

#### 3. HOẠT HỌA 3: LẬT THẺ BÀI KARUTA 3D (HYAKUNIN ISSHU CARD FLIP)

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

#### 4. HOẠT HỌA 4: BÚP BÊ DARUMA ĐIỂM MẮT TIẾN ĐỘ (DARUMA EYE-OPENING MASCOT)

Búp bê Daruma là biểu tượng may mắn và ý chí quyết tâm của người Nhật.
- Khi người học bắt đầu ngày mới: 2 mắt Daruma đều trắng.
- Khi đạt **50% số thẻ cần ôn** (`dueToday / 2`): Mắt trái được vẽ lòng đen (bắt đầu hành trình).
- Khi đạt **100% mục tiêu ngày**: Mắt phải được vẽ lòng đen trọn vẹn, kèm hào quang vàng kim Yamabuki chúc mừng thành công!

##### 4.1. React Component Búp bê Daruma (`src/components/japanese/DarumaMascot.tsx`)
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

#### 5. KHO BIỂU TƯỢNG VĂN HÓA SVG THUẦN TÚY (PURE VECTOR CULTURAL ICONS)

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

---


<a id="phan-4"></a>
# PHẦN 4: PHẦN 4: MÃ NGUỒN TOÀN CỤC & LAYOUT THANH ĐIỀU HƯỚNG TORII
*Tệp gốc: `doc\03_GLOBAL_STYLES_AND_LAYOUT.md`*

---

## ⛩️ TÀI LIỆU 03: MÃ NGUỒN TOÀN CỤC GLOBALS.CSS & LAYOUT.TSX
### Dự án: Japanese SRS System (FSRS)
### Mục tiêu: Thay thế toàn bộ khung nền tối thô sơ bằng Kiến trúc Giao diện Nhật Bản tươi sáng

---

#### 1. MÃ NGUỒN HOÀN CHỈNH CHO `src/app/globals.css`
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

#### 2. MÃ NGUỒN HOÀN CHỈNH CHO `src/app/layout.tsx`
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

---


<a id="phan-5"></a>
# PHẦN 5: PHẦN 5: THIẾT KẾ & THI CÔNG TRANG TỔNG QUAN HONMARU (DASHBOARD)
*Tệp gốc: `doc\04_PAGE_DASHBOARD_IMPLEMENTATION.md`*

---

## 🏯 TÀI LIỆU 04: TÁI THIẾT KẾ TRANG TỔNG QUAN (SRC/APP/PAGE.TSX)
### Dự án: Japanese SRS System (FSRS)
### Mục tiêu: Bento Grid phong cách Trà Thất & Cung điện Nhật Bản (Honmaru Bento)

---

#### 1. PHÂN TÍCH THAY ĐỔI TRÊN TRANG DASHBOARD
- **Hiện trạng cũ**: 3 khối hộp nền xám tối đơn điệu, font chữ hệ thống khô khan, không có điểm nhấn hay cảm hứng học tập.
- **Thiết kế mới (Wa-Style Honmaru)**:
  1. **Banner Anh đào & Sóng biển Seigaiha**: Dải sóng Matcha chuẩn ảnh chụp kết hợp huy hiệu cổng thiêng Torii.
  2. **Thanh tiến độ Daruma (Daruma Goal Tracker)**: Búp bê Daruma tự động điểm mắt theo tỷ lệ hoàn thành thẻ học trong ngày, tạo động lực tâm lý học tập (Gamification theo văn hóa Nhật).
  3. **3 Thẻ gỗ điều ước Ema (絵馬)**:
     - *Thẻ cần ôn (復習 - Due)*: Màu hồng thắm Sakura & đỏ son Torii.
     - *Thẻ mới (新規 - New)*: Màu xanh cốm Matcha Seigaiha.
     - *Tỉ lệ ghi nhớ (定着率 - Retention)*: Màu vàng kim Yamabuki cao quý.
  4. **Hộp ngạn ngữ Kotowaza (諺 - Lời vàng Phù Tang)**: Thẻ cuộn thư pháp chúc người học kiên trì mỗi ngày.
  5. **Nút bấm phong cách Thần đạo**: Nút bắt đầu ôn tập đỏ son Torii với hiệu ứng đổ bóng đa tầng.

---

#### 2. MÃ NGUỒN HOÀN CHỈNH CHO `src/app/page.tsx`
Agent chỉ cần sao chép toàn bộ khối mã dưới đây và ghi đè vào file `src/app/page.tsx`:

```tsx
import Link from 'next/link';
import { ToriiIcon, SakuraIcon, SensuFanIcon } from '@/components/japanese/Icons';
import { DarumaMascot } from '@/components/japanese/DarumaMascot';

/**
 * Dashboard (Honmaru - 本丸): Tổng quan tiến độ học tập, FSRS stats & Thần chú may mắn
 */
export default function DashboardPage() {
  const stats = {
    dueToday: 15,
    newCards: 5,
    retentionRate: '90%',
    completedToday: 8,
  };

  const totalTodayGoal = stats.dueToday + stats.completedToday;
  const progressPercent = totalTodayGoal > 0 ? Math.round((stats.completedToday / totalTodayGoal) * 100) : 100;

  return (
    <main style={{ maxWidth: '1050px', margin: '2rem auto', padding: '0 1.5rem 3rem' }}>
      {/* 1. HERO BANNER: HỌA TIẾT SEIGAIHA XANH MATCHA (#88A752) CHUẨN ẢNH CHỤP */}
      <section
        className="wagara-seigaiha-matcha"
        style={{
          borderRadius: '20px',
          padding: '2.5rem 2rem',
          color: '#FFFFFF',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-karuta)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        {/* Lớp phủ mờ bảo vệ độ tương phản chữ */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(112, 141, 62, 0.92) 0%, rgba(136, 167, 82, 0.85) 100%)',
            zIndex: 1,
          }}
        />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '650px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.25rem 0.75rem',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-maru)',
                fontWeight: 600,
              }}
            >
              <SakuraIcon size={16} color="#FFFFFF" />
              Chào mừng bạn đến với trà thất học tập
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: '2.5rem',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: '0.75rem',
              letterSpacing: '-0.02em',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
            }}
          >
            Học sâu Nhớ lâu cùng FSRS
          </h1>
          <p
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.6,
              opacity: 0.95,
              fontFamily: 'var(--font-maru)',
              fontWeight: 400,
            }}
          >
            Hệ thống lặp lại ngắt quãng kết hợp thuật toán tối ưu nhận thức FSRS, quy tắc Thông tin tối thiểu và nét vẽ nghệ thuật truyền thống Nhật Bản.
          </p>
        </div>

        {/* Nút hành động nhanh trên Hero */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '0.75rem' }}>
          <Link
            href="/review"
            className="btn-torii"
            style={{
              padding: '1rem 2rem',
              fontSize: '1.05rem',
              boxShadow: '0 8px 24px rgba(217, 56, 30, 0.4)',
            }}
          >
            <ToriiIcon size={20} color="#FFFFFF" />
            Bắt đầu bài học ngay
          </Link>
        </div>
      </section>

      {/* 2. KHU VỰC TIẾN ĐỘ DARUMA (DARUMA GOAL MILESTONE TRACKER) */}
      <section
        style={{
          background: 'var(--washi-surface)',
          border: '1px solid var(--washi-border)',
          borderRadius: '16px',
          padding: '1.75rem 2rem',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-washi-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
        }}
      >
        <DarumaMascot progressPercentage={progressPercent} size={76} />

        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.25rem', color: 'var(--sumi-ink)', fontWeight: 700 }}>
                Quyết tâm hôm nay (本日の目標)
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--sumi-faded)' }}>
                Đã hoàn thành <strong>{stats.completedToday}</strong> / {totalTodayGoal} thẻ ({progressPercent}%)
              </p>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mincho)',
                fontWeight: 800,
                fontSize: '1.35rem',
                color: progressPercent >= 100 ? '#F59E0B' : 'var(--matcha-deep)',
              }}
            >
              {progressPercent}%
            </span>
          </div>

          {/* Thanh tiến độ họa tiết lông tên Yagasuri */}
          <div
            style={{
              height: '14px',
              background: '#F0ECE4',
              borderRadius: '999px',
              overflow: 'hidden',
              position: 'relative',
              border: '1px solid var(--washi-border)',
            }}
          >
            <div
              className="wagara-yagasuri"
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                backgroundColor: 'var(--matcha-primary)',
                borderRadius: '999px',
                transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            />
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--sumi-faded)', marginTop: '0.4rem' }}>
            💡 <em>Khi đạt 50%, mắt trái búp bê Daruma sẽ mở; đạt 100%, búp bê sẽ khai mở trọn vẹn cả hai mắt!</em>
          </p>
        </div>
      </section>

      {/* 3. BENTO GRID: 3 THẺ ĐIỀU ƯỚC EMA (絵馬 STAT CARDS) */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* CARD 1: DUE TODAY (THẺ CẦN ÔN) */}
        <div
          className="card-karuta"
          style={{
            padding: '1.75rem',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF9F9 100%)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.2rem 0.6rem',
                  background: 'var(--torii-subtle)',
                  color: 'var(--torii-red)',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-maru)',
                  marginBottom: '0.5rem',
                }}
              >
                復習 · CẦN ÔN TẬP
              </span>
              <h3 style={{ color: 'var(--sumi-charcoal)', fontSize: '0.95rem', fontWeight: 600 }}>
                Thẻ đến hạn hôm nay
              </h3>
            </div>
            <div className="inkan-stamp-badge" title="Đã đồng bộ FSRS">
              期
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-mincho)', fontSize: '3rem', fontWeight: 800, color: 'var(--torii-red)', lineHeight: 1 }}>
            {stats.dueToday}
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--sumi-faded)', marginTop: '0.5rem' }}>
            Khoảng cách ngắt quãng tối ưu theo FSRS
          </p>
        </div>

        {/* CARD 2: NEW CARDS (THẺ MỚI) */}
        <div
          className="card-karuta"
          style={{
            padding: '1.75rem',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAF2 100%)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.2rem 0.6rem',
                  background: 'var(--matcha-subtle)',
                  color: 'var(--matcha-deep)',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-maru)',
                  marginBottom: '0.5rem',
                }}
              >
                新規 · TỪ VỰNG MỚI
              </span>
              <h3 style={{ color: 'var(--sumi-charcoal)', fontSize: '0.95rem', fontWeight: 600 }}>
                Thẻ mới sẵn sàng nạp
              </h3>
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                background: 'var(--matcha-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--matcha-deep)',
                fontFamily: 'var(--font-mincho)',
                fontWeight: 700,
              }}
            >
              新
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-mincho)', fontSize: '3rem', fontWeight: 800, color: 'var(--matcha-deep)', lineHeight: 1 }}>
            {stats.newCards}
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--sumi-faded)', marginTop: '0.5rem' }}>
            Áp dụng nguyên tắc câu đục lỗ i + 1
          </p>
        </div>

        {/* CARD 3: RETENTION RATE (TỈ LỆ GHI NHỚ) */}
        <div
          className="card-karuta"
          style={{
            padding: '1.75rem',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFDF5 100%)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.2rem 0.6rem',
                  background: 'var(--yamabuki-light)',
                  color: 'var(--yamabuki-amber)',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-maru)',
                  marginBottom: '0.5rem',
                }}
              >
                定着率 · TRÍ NHỚ BỀN VỮNG
              </span>
              <h3 style={{ color: 'var(--sumi-charcoal)', fontSize: '0.95rem', fontWeight: 600 }}>
                Tỉ lệ ghi nhớ mục tiêu
              </h3>
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                background: 'var(--yamabuki-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--yamabuki-amber)',
                fontFamily: 'var(--font-mincho)',
                fontWeight: 700,
              }}
            >
              極
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-mincho)', fontSize: '3rem', fontWeight: 800, color: '#D97706', lineHeight: 1 }}>
            {stats.retentionRate}
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--sumi-faded)', marginTop: '0.5rem' }}>
            Mức ghi nhớ tối ưu theo FSRS (R = 0.90)
          </p>
        </div>
      </section>

      {/* 4. HỘP THÀNH NGỮ KOTOWAZA & NÚT ĐIỀU HƯỚNG */}
      <section
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          background: 'var(--washi-surface)',
          padding: '1.75rem 2rem',
          borderRadius: '16px',
          border: '1px solid var(--washi-border)',
          boxShadow: 'var(--shadow-washi-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', maxWidth: '550px' }}>
          <SensuFanIcon size={32} color="var(--matcha-deep)" />
          <div>
            <h4 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.05rem', color: 'var(--sumi-ink)', fontWeight: 700 }}>
              「 塵も積もれば山となる 」
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--sumi-faded)' }}>
              <em>(Bụi tích tụ sẽ hóa thành núi cao · Học tập mỗi ngày tích lũy tri thức vô tận)</em>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link href="/cards/new" className="btn-matcha">
            ✨ Nhờ AI soạn thẻ mới
          </Link>
          <Link href="/cards" className="btn-washi">
            📚 Quản lý thư viện thẻ
          </Link>
        </div>
      </section>
    </main>
  );
}
```

---


<a id="phan-6"></a>
# PHẦN 6: PHẦN 6: THIẾT KẾ & THI CÔNG TRANG QUẢN LÝ THẺ TANZAKUCHO (CARDS MANAGEMENT)
*Tệp gốc: `doc\05_PAGE_CARDS_MANAGEMENT_IMPLEMENTATION.md`*

---

## 📜 TÀI LIỆU 05: TÁI THIẾT KẾ QUẢN LÝ THẺ HỌC (SRC/APP/CARDS/PAGE.TSX)
### Dự án: Japanese SRS System (FSRS)
### Mục tiêu: Cuộn sách Makimono & Danh mục thẻ bài Karuta truyền thống

---

#### 1. PHÂN TÍCH THAY ĐỔI TRANG QUẢN LÝ THẺ
- **Hiện trạng cũ**: Bảng HTML xám xịt thô kệch, thanh tìm kiếm đơn điệu, các nhãn dán công nghệ không phân biệt được vẻ đẹp của chữ Hán (Kanji).
- **Thiết kế mới (Makimono Catalog)**:
  1. **Khung tìm kiếm Bút lông (Shodo Search Bar)**: Bo góc thanh nhã, viền giấy Washi, hiệu ứng gợn nước khi focus.
  2. **Thẻ gỗ phân loại Kifuda (木札 Deck Filters)**: Thay thế thẻ dropdown nhàm chán bằng hệ thống thẻ gỗ gắn nhãn JLPT (N5 - N1) mang các sắc màu tự nhiên:
     - N5: Hồng phấn Sakura (`#F472B6`)
     - N4: Xanh cốm Matcha (`#88A752`)
     - N3: Xanh ngọc Asagi (`#0D9488`)
     - N2: Vàng hổ phách Yamabuki (`#F59E0B`)
     - N1: Xanh thẫm Indigo Ai-iro (`#1E3A8A`)
  3. **Bảng thẻ bài Karuta & Thư pháp**:
     - Cột chữ Kanji được thể hiện bằng font thư pháp `Shippori Mincho` kích thước lớn, trang nghiêm.
     - Cột Furigana hỗ trợ chuẩn HTML `<ruby>` kèm chú giải âm thanh.
     - Cột Loại thẻ (Card Type) hiển thị dưới dạng con dấu son thủ công: **語** (Từ vựng), **漢** (Chữ Hán), **穴** (Điền khuyết Cloze), **音** (Cao độ Pitch).
  4. **Nút Thêm thẻ mới phong cách cổng Torii**: Kêu gọi hành động nổi bật.

---

#### 2. MÃ NGUỒN HOÀN CHỈNH CHO `src/app/cards/page.tsx`
Agent chỉ cần sao chép toàn bộ khối mã dưới đây và ghi đè vào file `src/app/cards/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ToriiIcon, SensuFanIcon } from '@/components/japanese/Icons';

/**
 * Quản lý thư viện thẻ học (短冊帳 - Tanzakucho)
 */
export default function CardsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeck, setSelectedDeck] = useState('all');

  const mockCards = [
    { id: '1', kanji: '勉強', reading: 'べんきょう', meaning: 'Học tập, nghiên cứu', deck: 'JLPT N5', type: 'Vocab', pitch: '0 (Heiban)' },
    { id: '2', kanji: '猫', reading: 'ねこ', meaning: 'Con mèo', deck: 'JLPT N5', type: 'Kanji', pitch: '1 (Atamadaka)' },
    { id: '3', kanji: '食べる', reading: 'たべる', meaning: 'Ăn uống', deck: 'JLPT N5', type: 'Cloze', pitch: '2 (Nakadaka)' },
    { id: '4', kanji: '警察', reading: 'けいさつ', meaning: 'Cảnh sát, công an', deck: 'JLPT N4', type: 'Vocab', pitch: '0 (Heiban)' },
    { id: '5', kanji: '桜', reading: 'さくら', meaning: 'Hoa anh đào', deck: 'JLPT N5', type: 'Vocab', pitch: '0 (Heiban)' },
  ];

  const filteredCards = mockCards.filter((card) => {
    const matchesSearch =
      card.kanji.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.reading.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.meaning.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDeck =
      selectedDeck === 'all' || card.deck.toLowerCase().includes(selectedDeck.toLowerCase());
    return matchesSearch && matchesDeck;
  });

  const getDeckBadgeStyle = (deck: string) => {
    if (deck.includes('N5')) return { bg: 'var(--sakura-light)', color: 'var(--sakura-deep)', border: '#FBCFE8' };
    if (deck.includes('N4')) return { bg: 'var(--matcha-subtle)', color: 'var(--matcha-deep)', border: '#C6DDA4' };
    if (deck.includes('N3')) return { bg: 'var(--asagi-light)', color: 'var(--asagi-teal)', border: '#99F6E4' };
    return { bg: 'var(--yamabuki-light)', color: 'var(--yamabuki-amber)', border: '#FDE68A' };
  };

  const getTypeSeal = (type: string) => {
    switch (type) {
      case 'Vocab': return { text: '語', label: 'Từ vựng', color: 'var(--matcha-deep)' };
      case 'Kanji': return { text: '漢', label: 'Chữ Hán', color: 'var(--torii-red)' };
      case 'Cloze': return { text: '穴', label: 'Điền từ', color: '#0284C7' };
      default: return { text: '音', label: 'Cao độ', color: '#D97706' };
    }
  };

  return (
    <div style={{ maxWidth: '1050px', margin: '2rem auto', padding: '0 1.5rem 3rem' }}>
      {/* HEADER KHU VỰC THƯ VIỆN THẺ */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-mincho)',
                color: 'var(--torii-red)',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            >
              短冊帳 · BỘ SƯU TẬP
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-mincho)', fontSize: '2rem', fontWeight: 800, color: 'var(--sumi-ink)' }}>
            Quản lý thẻ học tiếng Nhật
          </h1>
          <p style={{ color: 'var(--sumi-faded)', fontSize: '0.95rem' }}>
            Thư viện thẻ bài được tối ưu theo Nguyên tắc Thông tin tối thiểu (Atomicity)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/" className="btn-washi">
            🏯 Trang chủ
          </Link>
          <Link href="/cards/new" className="btn-torii">
            <ToriiIcon size={18} color="#FFFFFF" />
            + Soạn thẻ mới
          </Link>
        </div>
      </div>

      {/* THANH TÌM KIẾM BÚT LÔNG & BỘ LỌC THẺ GỖ KIFUDA */}
      <div
        style={{
          background: 'var(--washi-surface)',
          padding: '1.25rem 1.5rem',
          borderRadius: '16px',
          border: '1px solid var(--washi-border)',
          boxShadow: 'var(--shadow-washi-sm)',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        {/* Input Tìm kiếm */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="🔍 Tìm kiếm từ vựng, chữ Kanji, cách đọc Furigana hoặc nghĩa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.85rem 1.25rem',
              background: 'var(--washi-bg)',
              border: '1.5px solid var(--washi-border)',
              borderRadius: '10px',
              color: 'var(--sumi-ink)',
              fontSize: '1rem',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
              transition: 'border-color 0.2s',
            }}
          />
        </div>

        {/* Nút lọc thẻ gỗ Kifuda */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--sumi-faded)', fontWeight: 600, marginRight: '0.25rem' }}>
            Chọn cấp độ:
          </span>
          {[
            { id: 'all', label: 'Tất cả (全)' },
            { id: 'n5', label: '🌸 JLPT N5' },
            { id: 'n4', label: '🍵 JLPT N4' },
            { id: 'n3', label: '🌊 JLPT N3' },
            { id: 'n2', label: '🍂 JLPT N2' },
          ].map((deck) => (
            <button
              key={deck.id}
              onClick={() => setSelectedDeck(deck.id)}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: selectedDeck === deck.id ? 'var(--matcha-deep)' : 'var(--washi-border)',
                background: selectedDeck === deck.id ? 'var(--matcha-subtle)' : 'var(--washi-bg)',
                color: selectedDeck === deck.id ? 'var(--matcha-deep)' : 'var(--sumi-charcoal)',
                fontWeight: selectedDeck === deck.id ? 700 : 500,
                fontSize: '0.85rem',
                fontFamily: 'var(--font-maru)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {deck.label}
            </button>
          ))}
        </div>
      </div>

      {/* DANH SÁCH BẢNG THẺ BÀI KARUTA (CATALOG TABLE) */}
      <div
        style={{
          background: 'var(--washi-surface)',
          borderRadius: '16px',
          border: '1px solid var(--washi-border)',
          boxShadow: 'var(--shadow-washi-md)',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr
              style={{
                background: 'var(--matcha-tint)',
                borderBottom: '2px solid var(--washi-border)',
                color: 'var(--sumi-charcoal)',
                fontSize: '0.88rem',
                fontFamily: 'var(--font-maru)',
                fontWeight: 700,
              }}
            >
              <th style={{ padding: '1.1rem 1.25rem' }}>Chữ Hán (Mặt trước)</th>
              <th style={{ padding: '1.1rem 1.25rem' }}>Cách đọc Furigana</th>
              <th style={{ padding: '1.1rem 1.25rem' }}>Ý nghĩa tiếng Việt</th>
              <th style={{ padding: '1.1rem 1.25rem' }}>Cấp độ Deck</th>
              <th style={{ padding: '1.1rem 1.25rem' }}>Loại thẻ</th>
            </tr>
          </thead>
          <tbody>
            {filteredCards.length > 0 ? (
              filteredCards.map((card, idx) => {
                const badge = getDeckBadgeStyle(card.deck);
                const seal = getTypeSeal(card.type);

                return (
                  <tr
                    key={card.id}
                    style={{
                      borderBottom: '1px solid var(--washi-border-soft)',
                      background: idx % 2 === 0 ? 'var(--washi-surface)' : 'var(--washi-card)',
                      transition: 'background 0.2s',
                    }}
                  >
                    {/* Mặt trước Kanji nổi bật */}
                    <td style={{ padding: '1.25rem' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mincho)',
                          fontSize: '1.65rem',
                          fontWeight: 700,
                          color: 'var(--sumi-ink)',
                        }}
                      >
                        {card.kanji}
                      </span>
                    </td>

                    {/* Furigana & Cao độ */}
                    <td style={{ padding: '1.25rem' }}>
                      <div style={{ fontFamily: 'var(--font-maru)', fontSize: '1.05rem', color: 'var(--matcha-deep)', fontWeight: 600 }}>
                        {card.reading}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--sumi-faded)' }}>
                        Cao độ: {card.pitch}
                      </span>
                    </td>

                    {/* Ý nghĩa */}
                    <td style={{ padding: '1.25rem', color: 'var(--sumi-charcoal)', fontSize: '0.95rem' }}>
                      {card.meaning}
                    </td>

                    {/* Cấp độ Deck */}
                    <td style={{ padding: '1.25rem' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.3rem 0.75rem',
                          background: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`,
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontFamily: 'var(--font-maru)',
                          fontWeight: 700,
                        }}
                      >
                        {card.deck}
                      </span>
                    </td>

                    {/* Con dấu loại thẻ */}
                    <td style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            width: '28px',
                            height: '28px',
                            border: `1.5px solid ${seal.color}`,
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: seal.color,
                            fontFamily: 'var(--font-mincho)',
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            background: 'rgba(255, 255, 255, 0.8)',
                          }}
                        >
                          {seal.text}
                        </span>
                        <span style={{ fontSize: '0.82rem', color: 'var(--sumi-faded)' }}>
                          {seal.label}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--sumi-faded)' }}>
                  <SensuFanIcon size={36} color="var(--sumi-water)" />
                  <p style={{ marginTop: '0.75rem', fontSize: '1rem', fontFamily: 'var(--font-mincho)' }}>
                    Không tìm thấy thẻ học nào phù hợp với bộ lọc
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---


<a id="phan-7"></a>
# PHẦN 7: PHẦN 7: THIẾT KẾ & THI CÔNG TRANG SOẠN THẺ AI COPILOT SHODO DESK
*Tệp gốc: `doc\06_PAGE_AI_COPILOT_AND_NEW_CARD_IMPLEMENTATION.md`*

---

## ✍️ TÀI LIỆU 06: TÁI THIẾT KẾ SOẠN THẺ AI COPILOT (SRC/APP/CARDS/NEW/PAGE.TSX)
### Dự án: Japanese SRS System (FSRS)
### Mục tiêu: Bàn Thư Pháp Shodo (書道机) & Thẻ Thơ Tanzaku (短冊)

---

#### 1. PHÂN TÍCH THAY ĐỔI TRANG TẠO THẺ HỌC
- **Hiện trạng cũ**: Form nền xanh đen tối tăm, các ô nhập thô ráp, thông báo AI phân tách thẻ khô khan, thiếu vắng vẻ đẹp chữ Hán.
- **Thiết kế mới (Shodo Desk & Tanzaku)**:
  1. **Bàn thư pháp Shodo (Calligraphy Desk)**: Ô nhập chữ tiếng Nhật nổi bật với cỡ chữ lớn, phông chữ `Shippori Mincho`, viền hiệu ứng nước mực Sumi.
  2. **Trạng thái AI Đang sinh thẻ (Loading)**: Hoạt họa hạc giấy Origami (`OrizuruIcon`) bay lượn và xoay nhẹ nhàng trên nền sóng Seigaiha mờ.
  3. **Thẻ thơ Tanzaku duyệt bài (Human-in-the-Loop Approval)**:
     - Thẻ nháp sinh ra mang phong cách thẻ thơ Tanzaku viền mạ vàng.
     - Phân tích Ngữ nguyên học chữ Hình thanh (Keisei-moji) đặt trong khung cuộn thư cổ.
     - Biểu đồ mô phỏng đường cao độ ngữ âm Tokyo Pitch Accent (Heiban/Atamadaka).
  4. **Nút Phê duyệt Đóng dấu son Inkan**: Khi người học nhấn "Duyệt & Lưu vào FSRS", con dấu son đỏ **「済」 (Sumi - Hoàn tất)** dập nảy xuống với âm hưởng trang trọng!
  5. **BẢO TOÀN TUYỆT ĐỐI BACKEND**: Giữ nguyên toàn bộ logic gọi API `/api/copilot/draft` (POST & PUT), các biến `draftId`, `editedData`, `autoSplitNotice`, `atomicity-validator`.

---

#### 2. MÃ NGUỒN HOÀN CHỈNH CHO `src/app/cards/new/page.tsx`
Agent chỉ cần sao chép toàn bộ khối mã dưới đây và ghi đè vào file `src/app/cards/new/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ToriiIcon, OrizuruIcon, SensuFanIcon } from '@/components/japanese/Icons';

interface DraftItem {
  id: string;
  deckId: string;
  cardData: {
    kanji_surface: string;
    reading_furigana: string;
    primary_meaning: string;
    context_sentence: string;
    cloze_word: string;
    etymology_notes?: string;
    pitch_pattern: number;
  };
  approved?: boolean;
}

/**
 * Giao diện Tạo Thẻ Học Tiếng Nhật (Shodo Desk - 書道机)
 */
export default function NewCardPage() {
  const [activeTab, setActiveTab] = useState<'copilot' | 'manual'>('copilot');

  // State cho 1 ô nhập từ vựng duy nhất
  const [targetWord, setTargetWord] = useState('');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [customReading, setCustomReading] = useState('');
  const [customMeaning, setCustomMeaning] = useState('');
  const [learnerLevel, setLearnerLevel] = useState<'N5' | 'N4' | 'N3' | 'N2' | 'N1'>('N4');

  const [loading, setLoading] = useState(false);
  const [draftsList, setDraftsList] = useState<DraftItem[]>([]);
  const [masteredCount, setMasteredCount] = useState<number>(0);
  const [autoSplitNotice, setAutoSplitNotice] = useState<string | null>(null);

  // State cho Tạo thủ công (Base MVP)
  const [formData, setFormData] = useState({
    cardType: 'Vocab',
    front: '',
    reading: '',
    meaning: '',
    sentence: '',
    pitch: '',
    deck: 'JLPT N5',
  });

  const handleCopilotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetWord.trim()) return;

    setLoading(true);
    setAutoSplitNotice(null);

    try {
      const res = await fetch('/api/copilot/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: targetWord.trim(),
          reading: customReading.trim() || undefined,
          meaning: customMeaning.trim() || undefined,
          learnerLevel,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const receivedDrafts: DraftItem[] = data.drafts || (data.draft ? [data.draft] : []);
        setDraftsList(receivedDrafts);
        setMasteredCount(data.masteredWordsCount || 0);

        if (receivedDrafts.length > 1) {
          setAutoSplitNotice(
            `⚡ [Nguyên tắc Thông tin Tối thiểu] Bộ thẩm định atomicity-validator.ts phát hiện ${receivedDrafts.length} nét nghĩa phái sinh độc lập và đã tự động phân rã thành ${receivedDrafts.length} thẻ riêng biệt!`
          );
        }
      } else {
        alert(data.feedback || data.error || 'Có lỗi xảy ra trong quá trình sinh thẻ');
      }
    } catch {
      alert('Không thể kết nối đến máy chủ AI Copilot API');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDraftField = (
    draftId: string,
    field: keyof DraftItem['cardData'],
    value: any
  ) => {
    setDraftsList((prev) =>
      prev.map((d) =>
        d.id === draftId
          ? {
              ...d,
              cardData: {
                ...d.cardData,
                [field]: value,
              },
            }
          : d
      )
    );
  };

  const handleApproveDraft = async (draft: DraftItem) => {
    try {
      const res = await fetch('/api/copilot/draft', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftId: draft.id,
          editedData: draft.cardData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDraftsList((prev) =>
          prev.map((d) => (d.id === draft.id ? { ...d, approved: true } : d))
        );
      } else {
        alert(data.error || 'Không thể lưu thẻ học');
      }
    } catch {
      alert('Lỗi khi phê duyệt và lưu thẻ học vào SQLite/Turso');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thẻ đã được tạo thành công theo chuẩn Atomicity!');
  };

  return (
    <div style={{ maxWidth: '850px', margin: '2rem auto', padding: '0 1.5rem 3rem' }}>
      {/* HEADER QUAY LẠI */}
      <div style={{ marginBottom: '2rem' }}>
        <Link
          href="/cards"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--sumi-faded)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontFamily: 'var(--font-maru)',
            fontWeight: 600,
            marginBottom: '0.75rem',
          }}
        >
          ← Quay lại danh mục thẻ
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h1 style={{ fontFamily: 'var(--font-mincho)', fontSize: '2.25rem', fontWeight: 800, color: 'var(--sumi-ink)' }}>
            Tạo thẻ học tiếng Nhật
          </h1>
          <span
            style={{
              padding: '0.2rem 0.6rem',
              background: 'var(--matcha-subtle)',
              color: 'var(--matcha-deep)',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              fontFamily: 'var(--font-maru)',
            }}
          >
            FSRS · Atomicity
          </span>
        </div>
        <p style={{ color: 'var(--sumi-faded)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Bàn thư pháp số tích hợp Trợ lý Trí tuệ Nhân tạo AI Copilot và Ngữ nguyên học chữ Hán
        </p>
      </div>

      {/* TABS CHUYỂN ĐỔI PHONG CÁCH THẺ GỖ KIFUDA */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '2rem',
          borderBottom: '2px solid var(--washi-border)',
        }}
      >
        <button
          onClick={() => setActiveTab('copilot')}
          style={{
            padding: '0.85rem 1.5rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'copilot' ? '3px solid var(--matcha-primary)' : 'none',
            color: activeTab === 'copilot' ? 'var(--matcha-deep)' : 'var(--sumi-faded)',
            fontFamily: 'var(--font-maru)',
            fontWeight: activeTab === 'copilot' ? 800 : 600,
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s',
          }}
        >
          ✨ AI Copilot ("Nhờ AI tạo thẻ")
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          style={{
            padding: '0.85rem 1.5rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'manual' ? '3px solid var(--matcha-primary)' : 'none',
            color: activeTab === 'manual' ? 'var(--matcha-deep)' : 'var(--sumi-faded)',
            fontFamily: 'var(--font-maru)',
            fontWeight: activeTab === 'manual' ? 800 : 600,
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s',
          }}
        >
          ✍️ Tự soạn thủ công (Base MVP)
        </button>
      </div>

      {/* TAB 1: AI COPILOT - BÀN THƯ PHÁP SHODO (1 Ô NHẬP DUY NHẤT) */}
      {activeTab === 'copilot' && (
        <div>
          <form
            onSubmit={handleCopilotSubmit}
            style={{
              background: 'var(--washi-surface)',
              padding: '2.25rem',
              borderRadius: '16px',
              border: '1px solid var(--washi-border)',
              boxShadow: 'var(--shadow-washi-md)',
              marginBottom: '2.5rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Dải viền Seigaiha mỏng trang trí đỉnh form */}
            <div
              className="wagara-seigaiha-matcha"
              style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px' }}
            />

            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="targetWordInput"
                style={{
                  display: 'block',
                  marginBottom: '0.6rem',
                  fontFamily: 'var(--font-mincho)',
                  fontWeight: 700,
                  fontSize: '1.15rem',
                  color: 'var(--sumi-ink)',
                }}
              >
                Nhập từ vựng hoặc chữ Kanji mục tiêu:
              </label>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <input
                  id="targetWordInput"
                  type="text"
                  placeholder="ví dụ: 警察, 桜, かける, 際, 儚い..."
                  value={targetWord}
                  onChange={(e) => setTargetWord(e.target.value)}
                  style={{
                    flex: '1 1 320px',
                    padding: '0.9rem 1.25rem',
                    background: 'var(--washi-bg)',
                    border: '2px solid var(--washi-border)',
                    borderRadius: '10px',
                    color: 'var(--sumi-ink)',
                    fontSize: '1.25rem',
                    fontFamily: 'var(--font-mincho)',
                    fontWeight: 600,
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-matcha"
                  style={{
                    padding: '0.9rem 1.85rem',
                    fontSize: '1.05rem',
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{ display: 'inline-block', animation: 'spin 1.5s linear infinite' }}>
                        <OrizuruIcon size={20} color="#FFFFFF" />
                      </span>
                      Đang phân tích nét nghĩa...
                    </>
                  ) : (
                    '✨ Nhờ AI tạo thẻ'
                  )}
                </button>
              </div>
            </div>

            {/* Tùy chọn nâng cao */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--matcha-deep)',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-maru)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                {showAdvancedOptions ? '▲ Thu gọn tùy chọn nâng cao' : '▼ Tùy chọn nâng cao (Furigana, Nghĩa định sẵn, Cấp độ JLPT)'}
              </button>

              {showAdvancedOptions && (
                <div
                  style={{
                    marginTop: '1.25rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    background: 'var(--washi-bg)',
                    padding: '1.25rem',
                    borderRadius: '10px',
                    border: '1px solid var(--washi-border)',
                  }}
                >
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--sumi-faded)', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Furigana mong muốn:
                    </label>
                    <input
                      type="text"
                      placeholder="vd: けいさつ"
                      value={customReading}
                      onChange={(e) => setCustomReading(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', background: '#FFFFFF', border: '1px solid var(--washi-border)', borderRadius: '6px', color: 'var(--sumi-ink)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--sumi-faded)', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Nghĩa gợi ý tùy ý:
                    </label>
                    <input
                      type="text"
                      placeholder="vd: Cảnh sát"
                      value={customMeaning}
                      onChange={(e) => setCustomMeaning(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', background: '#FFFFFF', border: '1px solid var(--washi-border)', borderRadius: '6px', color: 'var(--sumi-ink)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--sumi-faded)', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Trình độ học viên:
                    </label>
                    <select
                      value={learnerLevel}
                      onChange={(e) => setLearnerLevel(e.target.value as any)}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', background: '#FFFFFF', border: '1px solid var(--washi-border)', borderRadius: '6px', color: 'var(--sumi-ink)' }}
                    >
                      <option value="N5">🌸 JLPT N5</option>
                      <option value="N4">🍵 JLPT N4</option>
                      <option value="N3">🌊 JLPT N3</option>
                      <option value="N2">🍂 JLPT N2</option>
                      <option value="N1">漆 JLPT N1</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* THÔNG BÁO TỰ ĐỘNG PHÂN TÁCH NÉT NGHĨA (ATOMICITY GUARDRAIL) */}
          {autoSplitNotice && (
            <div
              style={{
                background: 'var(--matcha-subtle)',
                border: '1.5px solid var(--matcha-primary)',
                borderRadius: '12px',
                padding: '1.25rem 1.5rem',
                marginBottom: '2rem',
                color: 'var(--matcha-deep)',
                fontSize: '0.92rem',
                lineHeight: 1.6,
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: 'var(--shadow-washi-sm)',
              }}
            >
              <SensuFanIcon size={24} color="var(--matcha-deep)" />
              <div>{autoSplitNotice}</div>
            </div>
          )}

          {/* DANH SÁCH BẢN NHÁP THẺ THƠ TANZAKU ĐỂ DUYỆT (HUMAN-IN-THE-LOOP) */}
          {draftsList.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.45rem', fontWeight: 800, color: 'var(--sumi-ink)' }}>
                  Bản nháp được AI phân tích ({draftsList.length} thẻ đơn vị)
                </h2>
                <span
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--matcha-deep)',
                    background: 'var(--matcha-subtle)',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '999px',
                    fontWeight: 600,
                  }}
                >
                  Vốn từ đã nắm vững (S &gt; 21): <strong>{masteredCount} từ</strong>
                </span>
              </div>

              {draftsList.map((draft, idx) => (
                <div
                  key={draft.id}
                  className="card-karuta"
                  style={{
                    padding: '2rem',
                    background: draft.approved ? 'linear-gradient(180deg, #FFFFFF 0%, #F5F9ED 100%)' : 'var(--washi-surface)',
                    borderColor: draft.approved ? 'var(--matcha-primary)' : 'var(--washi-border)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                      <span
                        style={{
                          background: draft.approved ? 'var(--matcha-primary)' : 'var(--yamabuki-gold)',
                          color: '#FFFFFF',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          fontFamily: 'var(--font-maru)',
                        }}
                      >
                        {draft.approved ? '✅ ĐÃ LƯU VÀO FSRS' : `BẢN NHÁP ${idx + 1}/${draftsList.length}`}
                      </span>
                      <span
                        style={{
                          background: 'var(--washi-bg)',
                          color: 'var(--sumi-faded)',
                          border: '1px solid var(--washi-border)',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontFamily: 'monospace',
                        }}
                      >
                        FSRS: D=0, S=0, State=0
                      </span>
                    </div>

                    {/* Dấu son Inkan khi đã duyệt */}
                    {draft.approved && (
                      <div className="inkan-stamp-badge" title="Đã duyệt">
                        済
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    {/* Chữ Kanji lớn & Furigana */}
                    <div style={{ marginBottom: '0.5rem' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mincho)',
                          fontSize: '2.5rem',
                          fontWeight: 800,
                          color: 'var(--sumi-ink)',
                        }}
                      >
                        {draft.cardData.kanji_surface}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-maru)',
                          fontSize: '1.35rem',
                          color: 'var(--matcha-deep)',
                          marginLeft: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        【{draft.cardData.reading_furigana}】
                      </span>
                    </div>

                    <p style={{ color: 'var(--sumi-charcoal)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                      📍 Mẫu cao độ Tokyo: <strong>[{draft.cardData.pitch_pattern}]</strong>
                    </p>

                    {/* Ô chỉnh sửa nghĩa tiếng Việt */}
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--sumi-charcoal)', fontWeight: 600, marginBottom: '0.35rem' }}>
                        Nghĩa tiếng Việt (Có thể chỉnh sửa để bảo toàn nhận thức cá nhân):
                      </label>
                      <input
                        type="text"
                        disabled={draft.approved}
                        value={draft.cardData.primary_meaning}
                        onChange={(e) =>
                          handleUpdateDraftField(draft.id, 'primary_meaning', e.target.value)
                        }
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          background: draft.approved ? 'var(--washi-bg)' : '#FFFFFF',
                          border: '1.5px solid var(--washi-border)',
                          borderRadius: '8px',
                          color: 'var(--sumi-ink)',
                          fontSize: '0.95rem',
                        }}
                      />
                    </div>

                    {/* Ô chỉnh sửa câu ví dụ ngữ cảnh i+1 */}
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--sumi-charcoal)', fontWeight: 600, marginBottom: '0.35rem' }}>
                        Câu ngữ cảnh đục lỗ i+1:
                      </label>
                      <textarea
                        rows={2}
                        disabled={draft.approved}
                        value={draft.cardData.context_sentence}
                        onChange={(e) =>
                          handleUpdateDraftField(draft.id, 'context_sentence', e.target.value)
                        }
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          background: draft.approved ? 'var(--washi-bg)' : '#FFFFFF',
                          border: '1.5px solid var(--washi-border)',
                          borderRadius: '8px',
                          color: 'var(--sumi-ink)',
                          fontSize: '0.95rem',
                          lineHeight: 1.5,
                        }}
                      />
                    </div>

                    {/* Khung chú giải Ngữ nguyên học chữ Hán Keisei-moji */}
                    {draft.cardData.etymology_notes && (
                      <div
                        style={{
                          marginTop: '1rem',
                          background: 'var(--matcha-tint)',
                          padding: '0.85rem 1.25rem',
                          borderRadius: '8px',
                          border: '1px solid var(--washi-border)',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.6rem',
                        }}
                      >
                        <span style={{ fontSize: '1.1rem' }}>📜</span>
                        <div style={{ fontSize: '0.88rem', color: 'var(--sumi-charcoal)', lineHeight: 1.5 }}>
                          <strong>Ngữ nguyên học (Keisei-moji / 形声文字):</strong> {draft.cardData.etymology_notes}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Nút Duyệt thẻ */}
                  {!draft.approved ? (
                    <button
                      onClick={() => handleApproveDraft(draft)}
                      className="btn-matcha"
                      style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
                    >
                      ✅ Duyệt &amp; Lưu vào lịch ôn tập FSRS (D=0, S=0, State=0)
                    </button>
                  ) : (
                    <div
                      style={{
                        padding: '0.85rem',
                        textAlign: 'center',
                        background: 'var(--matcha-subtle)',
                        borderRadius: '8px',
                        color: 'var(--matcha-deep)',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        fontFamily: 'var(--font-maru)',
                      }}
                    >
                      🎉 Thẻ đã được lưu vào cơ sở dữ liệu và đặt lịch học ngắt quãng thành công!
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MANUAL CREATION (TỰ SOẠN THỦ CÔNG) */}
      {activeTab === 'manual' && (
        <form
          onSubmit={handleManualSubmit}
          className="card-karuta"
          style={{
            padding: '2.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--sumi-ink)' }}>
              Loại thẻ học (Card Type)
            </label>
            <select
              value={formData.cardType}
              onChange={(e) => setFormData({ ...formData, cardType: e.target.value })}
              style={{ width: '100%', padding: '0.85rem', background: 'var(--washi-bg)', border: '1.5px solid var(--washi-border)', borderRadius: '8px', color: 'var(--sumi-ink)' }}
            >
              <option value="Vocab">語 Vocabulary (Từ vựng 1 nghĩa)</option>
              <option value="Kanji">漢 Kanji (Chữ Hán 1 ký tự)</option>
              <option value="Cloze">穴 Cloze (Điền từ 1 chỗ trống)</option>
              <option value="Pitch">音 Pitch Accent (Mẫu cao độ âm thanh)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--sumi-ink)' }}>
              Từ vựng / Chữ Hán mặt trước
            </label>
            <input
              type="text"
              placeholder="ví dụ: 桜, 食べる"
              value={formData.front}
              onChange={(e) => setFormData({ ...formData, front: e.target.value })}
              style={{ width: '100%', padding: '0.85rem', background: 'var(--washi-bg)', border: '1.5px solid var(--washi-border)', borderRadius: '8px', color: 'var(--sumi-ink)' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--sumi-ink)' }}>
              Ý nghĩa duy nhất (Tuân thủ Atomicity)
            </label>
            <input
              type="text"
              placeholder="ví dụ: Hoa anh đào"
              value={formData.meaning}
              onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
              style={{ width: '100%', padding: '0.85rem', background: 'var(--washi-bg)', border: '1.5px solid var(--washi-border)', borderRadius: '8px', color: 'var(--sumi-ink)' }}
              required
            />
          </div>

          <button type="submit" className="btn-torii" style={{ padding: '0.95rem' }}>
            <ToriiIcon size={18} color="#FFFFFF" />
            Lưu thẻ học vào FSRS
          </button>
        </form>
      )}
    </div>
  );
}
```

---


<a id="phan-8"></a>
# PHẦN 8: PHẦN 8: THIẾT KẾ & THI CÔNG TRANG ÔN TẬP KARUTA ACTIVE RECALL (REVIEW SESSION)
*Tệp gốc: `doc\07_PAGE_REVIEW_ACTIVE_RECALL_IMPLEMENTATION.md`*

---

## 🎴 TÀI LIỆU 07: TÁI THIẾT KẾ PHIÊN ÔN TẬP ACTIVE RECALL (SRC/APP/REVIEW/PAGE.TSX)
### Dự án: Japanese SRS System (FSRS)
### Mục tiêu: Thẻ bài thơ cổ Hyakunin Isshu Karuta (百人一首 歌留多) & Hệ nút đánh giá 4 Sắc Thái Nhật

---

#### 1. PHÂN TÍCH THAY ĐỔI TRANG ÔN TẬP
- **Hiện trạng cũ**: Khung chữ nhật xám đơn điệu, 4 nút màu Bootstrap cơ bản, không có hiệu ứng lật thẻ, không hỗ trợ Furigana ngữ nghĩa.
- **Thiết kế mới (Karuta Active Recall)**:
  1. **Thẻ bài Karuta 3D (3D Flipping Card)**:
     - *Mặt trước (表 - Omote)*: Chữ Kanji đại tự viết theo lối thư pháp cổ `Shippori Mincho`, viền thẻ bài thủ công, con dấu son góc thẻ.
     - *Mặt sau (裏 - Ura)*: Hiện Furigana bằng thẻ ngữ nghĩa `<ruby>`, đường kẻ cao độ Tokyo Pitch Accent, câu ví dụ ngữ cảnh có điểm nhấn.
  2. **Thanh tiến độ phiên học Thân Trúc (Bamboo/Yagasuri Progress)**: Hiển thị số thẻ đã ôn kèm búp bê Daruma mini theo sát tiến độ.
  3. **4 Nút đánh giá 4 Sắc Thái Văn Hóa Nhật Bản**:
     - **Again (再び · もう一度)**: Màu đỏ son Torii (`#D9381E`), biểu tượng thử thách cần chinh phục lại.
     - **Hard (難 · 難しい)**: Màu cam quả hồng Kaki-iro (`#EA580C`), thể hiện sự tập trung cao độ.
     - **Good (良 · 良好)**: Màu xanh Matcha Seigaiha (`#88A752` - khớp 100% màu ảnh chụp), đạt ngưỡng tối ưu FSRS.
     - **Easy (易 · 簡単)**: Màu xanh biếc Aoi (`#0284C7`), ghi nhớ xuất sắc.
  4. **BẢO TOÀN TUYỆT ĐỐI BACKEND**: Hàm `handleGrade` giữ nguyên 100% hợp đồng tham số với API `/api/review` (`cardId`, `rating`), không ảnh hưởng đến thuật toán tính toán DSR của FSRS.

---

#### 2. MÃ NGUỒN HOÀN CHỈNH CHO `src/app/review/page.tsx`
Agent chỉ cần sao chép toàn bộ khối mã dưới đây và ghi đè vào file `src/app/review/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ToriiIcon, SensuFanIcon } from '@/components/japanese/Icons';

/**
 * Giao diện Ôn tập Thẻ bài Karuta (Active Recall & FSRS Rating)
 */
export default function ReviewPage() {
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(1);
  const totalCards = 15;

  // Mock card chuẩn văn hóa Nhật cho phiên ôn tập
  const currentCard = {
    id: 'c1',
    kanji: '勉強',
    furigana: 'べんきょう',
    meaning: 'Học tập, siêng năng trau dồi tri thức',
    pitch: '0 (Heiban - 平板型)',
    sentence: '毎日日本語を熱心に勉強します。',
    sentenceMeaning: 'Mỗi ngày tôi đều chăm chỉ học tiếng Nhật.',
  };

  const handleGrade = async (grade: 'Again' | 'Hard' | 'Good' | 'Easy') => {
    console.log(`Đã chấm điểm thẻ ${currentCard.id} là: ${grade}`);

    // Gửi kết quả đánh giá thẻ (cập nhật Difficulty, Stability, Retrievability)
    try {
      await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: currentCard.id,
          rating: grade,
        }),
      });
    } catch {
      console.warn('Lỗi gọi API review, tiếp tục phiên ôn tập');
    }

    setShowAnswer(false);
    if (currentIdx < totalCards) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const progressPercent = Math.round((currentIdx / totalCards) * 100);

  return (
    <div style={{ maxWidth: '680px', margin: '2rem auto', padding: '0 1.5rem 3rem' }}>
      {/* THANH ĐIỀU HƯỚNG & TIẾN ĐỘ THÂN TRÚC */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <Link
            href="/"
            style={{
              color: 'var(--sumi-faded)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontFamily: 'var(--font-maru)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            ← Quay lại Trang chủ
          </Link>
          <span
            style={{
              fontFamily: 'var(--font-mincho)',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: 'var(--matcha-deep)',
            }}
          >
            第 {currentIdx} 問 / 全 {totalCards} 問
          </span>
        </div>

        {/* Thanh tiến độ phiên học họa tiết Seigaiha mờ */}
        <div
          style={{
            height: '8px',
            background: 'var(--washi-border-soft)',
            borderRadius: '999px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #88A752, #D9381E)',
              borderRadius: '999px',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* THẺ BÀI TRUYỀN THỐNG KARUTA (HYAKUNIN ISSHU CARD) */}
      <div
        className="card-karuta"
        style={{
          minHeight: '340px',
          padding: '2.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          marginBottom: '2rem',
          background: showAnswer ? 'linear-gradient(180deg, #FFFFFF 0%, #FAFBF7 100%)' : '#FFFFFF',
          border: showAnswer ? '1.5px solid var(--matcha-primary)' : '1px solid var(--washi-border)',
          position: 'relative',
        }}
      >
        {/* Con dấu son góc trên bên phải */}
        <div
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            fontFamily: 'var(--font-mincho)',
            fontSize: '0.75rem',
            color: 'var(--torii-red)',
            border: '1.5px solid var(--torii-red)',
            padding: '0.15rem 0.4rem',
            borderRadius: '4px',
            opacity: 0.8,
          }}
        >
          {showAnswer ? '解答' : '出題'}
        </div>

        {/* MẶT TRƯỚC: CHỮ KANJI THƯ PHÁP LỚN */}
        <div
          style={{
            fontFamily: 'var(--font-mincho)',
            fontSize: '4.25rem',
            fontWeight: 800,
            color: 'var(--sumi-ink)',
            marginBottom: '0.75rem',
            letterSpacing: '0.05em',
          }}
        >
          {currentCard.kanji}
        </div>

        {/* MẶT SAU: LẬT MỞ NỘI DUNG FURIGANA & Ý NGHĨA KHI BẤM XEM */}
        {showAnswer ? (
          <div
            style={{
              width: '100%',
              marginTop: '1rem',
              paddingTop: '1.5rem',
              borderTop: '1.5px dashed var(--washi-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              animation: 'fadeIn 0.3s ease forwards',
            }}
          >
            {/* Furigana & Cao độ */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-maru)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--matcha-deep)',
                }}
              >
                【{currentCard.furigana}】
              </span>
              <span
                style={{
                  fontSize: '0.82rem',
                  padding: '0.2rem 0.5rem',
                  background: 'var(--matcha-subtle)',
                  color: 'var(--matcha-deep)',
                  borderRadius: '4px',
                  fontWeight: 600,
                }}
              >
                Cao độ: {currentCard.pitch}
              </span>
            </div>

            {/* Ý nghĩa tiếng Việt */}
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--sumi-ink)' }}>
              {currentCard.meaning}
            </div>

            {/* Câu ví dụ ngữ cảnh i+1 */}
            <div
              style={{
                marginTop: '0.5rem',
                background: 'var(--washi-bg)',
                padding: '0.85rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid var(--washi-border-soft)',
              }}
            >
              <p style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.1rem', color: 'var(--sumi-charcoal)' }}>
                {currentCard.sentence}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--sumi-faded)', marginTop: '0.25rem' }}>
                {currentCard.sentenceMeaning}
              </p>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: '0.9rem', color: 'var(--sumi-faded)', fontFamily: 'var(--font-maru)' }}>
            Tự gợi nhớ lại cách đọc và ý nghĩa trước khi xem đáp án
          </p>
        )}
      </div>

      {/* KHU VỰC NÚT TƯƠNG TÁC ACTIVE RECALL */}
      {!showAnswer ? (
        <button
          onClick={() => setShowAnswer(true)}
          className="btn-torii"
          style={{
            width: '100%',
            padding: '1.1rem',
            fontSize: '1.1rem',
            boxShadow: '0 8px 24px rgba(217, 56, 30, 0.35)',
          }}
        >
          <SensuFanIcon size={22} color="#FFFFFF" />
          Khám phá đáp án (Active Recall · 答えを見る)
        </button>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
          {/* NÚT 1: AGAIN (もう一度) */}
          <button
            onClick={() => handleGrade('Again')}
            style={{
              padding: '0.85rem 0.5rem',
              backgroundColor: '#FFFFFF',
              border: '2px solid var(--torii-red)',
              borderRadius: '10px',
              color: 'var(--torii-red)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              transition: 'all 0.2s',
              boxShadow: '0 2px 6px rgba(217, 56, 30, 0.15)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mincho)', fontWeight: 800, fontSize: '1.1rem' }}>再 (Again)</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--sumi-faded)' }}>&lt; 1 phút</span>
          </button>

          {/* NÚT 2: HARD (難) */}
          <button
            onClick={() => handleGrade('Hard')}
            style={{
              padding: '0.85rem 0.5rem',
              backgroundColor: '#FFFFFF',
              border: '2px solid #EA580C',
              borderRadius: '10px',
              color: '#EA580C',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              transition: 'all 0.2s',
              boxShadow: '0 2px 6px rgba(234, 88, 12, 0.15)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mincho)', fontWeight: 800, fontSize: '1.1rem' }}>難 (Hard)</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--sumi-faded)' }}>~ 1.2 ngày</span>
          </button>

          {/* NÚT 3: GOOD (良) - MÀU XANH MATCHA #88A752 CHUẨN ẢNH CHỤP */}
          <button
            onClick={() => handleGrade('Good')}
            style={{
              padding: '0.85rem 0.5rem',
              backgroundColor: 'var(--matcha-primary)',
              border: '2px solid var(--matcha-deep)',
              borderRadius: '10px',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(136, 167, 82, 0.35)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mincho)', fontWeight: 800, fontSize: '1.1rem' }}>良 (Good)</span>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.9)' }}>~ 3.5 ngày</span>
          </button>

          {/* NÚT 4: EASY (易) */}
          <button
            onClick={() => handleGrade('Easy')}
            style={{
              padding: '0.85rem 0.5rem',
              backgroundColor: '#FFFFFF',
              border: '2px solid #0284C7',
              borderRadius: '10px',
              color: '#0284C7',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              transition: 'all 0.2s',
              boxShadow: '0 2px 6px rgba(2, 132, 199, 0.15)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mincho)', fontWeight: 800, fontSize: '1.1rem' }}>易 (Easy)</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--sumi-faded)' }}>~ 7.0 ngày</span>
          </button>
        </div>
      )}
    </div>
  );
}
```

---


<a id="phan-9"></a>
# PHẦN 9: PHẦN 9: QUY TRÌNH THỰC THI & CHECKLIST KIỂM ĐỊNH 10 BƯỚC DÀNH CHO AGENT
*Tệp gốc: `doc\08_STEP_BY_STEP_EXECUTION_CHECKLIST.md`*

---

## 📋 TÀI LIỆU 08: CHECKLIST THỰC THI CHI TIẾT TỪNG BƯỚC DÀNH CHO AGENT
### Dự án: Japanese SRS System (FSRS)
### Nguyên tắc: Zero Deduction (Không cần suy luận - Chỉ cần thực hiện theo tuần tự)

---

#### 1. BẢNG TỔNG HỢP CÁC FILE CẦN THAO TÁC

| Thứ tự | Thao tác | Đường dẫn file mục tiêu | Nguồn mã nguồn |
| :---: | :--- | :--- | :--- |
| **Bước 1** | Tạo thư mục | `src/components/japanese/` | Thư mục rỗng |
| **Bước 2** | Tạo mới file | `src/components/japanese/Icons.tsx` | [Tài liệu 02 - Mục 5](file:///D:/project/japanese-srs-system/doc/02_CULTURAL_ANIMATIONS_AND_ASSETS.md#5-kho-bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-v%C4%83n-h%C3%B3a-svg-thu%E1%BA%A7n-t%C3%BAy-pure-vector-cultural-icons) |
| **Bước 3** | Tạo mới file | `src/components/japanese/SakuraBackground.tsx` | [Tài liệu 02 - Mục 1.2](file:///D:/project/japanese-srs-system/doc/02_CULTURAL_ANIMATIONS_AND_ASSETS.md#12-react-component-c%C3%A1nh-hoa-srccomponentsjapanesesakurabackgroundtsx) |
| **Bước 4** | Tạo mới file | `src/components/japanese/DarumaMascot.tsx` | [Tài liệu 02 - Mục 4.1](file:///D:/project/japanese-srs-system/doc/02_CULTURAL_ANIMATIONS_AND_ASSETS.md#41-react-component-b%C3%BAp-b%C3%AA-daruma-srccomponentsjapanesedarumamascottsx) |
| **Bước 5** | Ghi đè file | `src/app/globals.css` | [Tài liệu 03 - Mục 1](file:///D:/project/japanese-srs-system/doc/03_GLOBAL_STYLES_AND_LAYOUT.md#1-m%C3%A3-ngu%E1%BB%93n-ho%C3%A0n-ch%E1%BB%89nh-cho-srcappglobalscss) |
| **Bước 6** | Ghi đè file | `src/app/layout.tsx` | [Tài liệu 03 - Mục 2](file:///D:/project/japanese-srs-system/doc/03_GLOBAL_STYLES_AND_LAYOUT.md#2-m%C3%A3-ngu%E1%BB%93n-ho%C3%A0n-ch%E1%BB%89nh-cho-srcapplayouttsx) |
| **Bước 7** | Ghi đè file | `src/app/page.tsx` | [Tài liệu 04 - Mục 2](file:///D:/project/japanese-srs-system/doc/04_PAGE_DASHBOARD_IMPLEMENTATION.md#2-m%C3%A3-ngu%E1%BB%93n-ho%C3%A0n-ch%E1%BB%89nh-cho-srcapppagetsx) |
| **Bước 8** | Ghi đè file | `src/app/cards/page.tsx` | [Tài liệu 05 - Mục 2](file:///D:/project/japanese-srs-system/doc/05_PAGE_CARDS_MANAGEMENT_IMPLEMENTATION.md#2-m%C3%A3-ngu%E1%BB%93n-ho%C3%A0n-ch%E1%BB%89nh-cho-srcappcardspagetsx) |
| **Bước 9** | Ghi đè file | `src/app/cards/new/page.tsx` | [Tài liệu 06 - Mục 2](file:///D:/project/japanese-srs-system/doc/06_PAGE_AI_COPILOT_AND_NEW_CARD_IMPLEMENTATION.md#2-m%C3%A3-ngu%E1%BB%93n-ho%C3%A0n-ch%E1%BB%89nh-cho-srcappcardsnewpagetsx) |
| **Bước 10**| Ghi đè file | `src/app/review/page.tsx` | [Tài liệu 07 - Mục 2](file:///D:/project/japanese-srs-system/doc/07_PAGE_REVIEW_ACTIVE_RECALL_IMPLEMENTATION.md#2-m%C3%A3-ngu%E1%BB%93n-ho%C3%A0n-ch%E1%BB%89nh-cho-srcappreviewpagetsx) |

---

#### 2. QUY TRÌNH THỰC THI CHI TIẾT (EXACT INSTRUCTIONS FOR EXECUTING AGENT)

##### BƯỚC 1: KHỞI TẠO THƯ MỤC COMPONENT
Chạy lệnh PowerShell tại thư mục gốc của dự án `D:\project\japanese-srs-system`:
```powershell
New-Item -ItemType Directory -Path "src\components\japanese" -Force
```

##### BƯỚC 2: TẠO FILE `src/components/japanese/Icons.tsx`
Tạo file `src/components/japanese/Icons.tsx` và sao chép chính xác 100% nội dung tại Mục 5 của [Tài liệu 02](file:///D:/project/japanese-srs-system/doc/02_CULTURAL_ANIMATIONS_AND_ASSETS.md).
- *Kiểm tra*: File phải chứa các export: `ToriiIcon`, `SakuraIcon`, `SensuFanIcon`, `OrizuruIcon`, `FujiMountainIcon`.

##### BƯỚC 3: TẠO FILE `src/components/japanese/SakuraBackground.tsx`
Tạo file `src/components/japanese/SakuraBackground.tsx` và sao chép chính xác nội dung tại Mục 1.2 của [Tài liệu 02](file:///D:/project/japanese-srs-system/doc/02_CULTURAL_ANIMATIONS_AND_ASSETS.md).
- *Kiểm tra*: Component có `'use client'`, không sinh lỗi hydration.

##### BƯỚC 4: TẠO FILE `src/components/japanese/DarumaMascot.tsx`
Tạo file `src/components/japanese/DarumaMascot.tsx` và sao chép chính xác nội dung tại Mục 4.1 của [Tài liệu 02](file:///D:/project/japanese-srs-system/doc/02_CULTURAL_ANIMATIONS_AND_ASSETS.md).
- *Kiểm tra*: Component nhận prop `progressPercentage: number` và hiển thị mắt trái/phải theo điều kiện.

##### BƯỚC 5: GHI ĐÈ FILE `src/app/globals.css`
Ghi đè file `src/app/globals.css` với mã nguồn đầy đủ từ Mục 1 của [Tài liệu 03](file:///D:/project/japanese-srs-system/doc/03_GLOBAL_STYLES_AND_LAYOUT.md).
- *Kiểm tra*: Chứa đầy đủ các class `.wagara-seigaiha-matcha` (`#88a752`), `.wagara-yagasuri`, `.card-karuta`, `.btn-torii`, `.inkan-stamp-badge`.

##### BƯỚC 6: GHI ĐÈ FILE `src/app/layout.tsx`
Ghi đè file `src/app/layout.tsx` với mã nguồn đầy đủ từ Mục 2 của [Tài liệu 03](file:///D:/project/japanese-srs-system/doc/03_GLOBAL_STYLES_AND_LAYOUT.md).
- *Kiểm tra*: Đã import đúng các font Google: `Zen_Maru_Gothic`, `Shippori_Mincho`, `Plus_Jakarta_Sans`. Header có logo Inkan "日学", Footer có hình núi Phú Sĩ.

##### BƯỚC 7: GHI ĐÈ FILE `src/app/page.tsx`
Ghi đè file `src/app/page.tsx` với mã nguồn đầy đủ từ Mục 2 của [Tài liệu 04](file:///D:/project/japanese-srs-system/doc/04_PAGE_DASHBOARD_IMPLEMENTATION.md).
- *Kiểm tra*: Hero banner sử dụng class `wagara-seigaiha-matcha`, có búp bê Daruma điểm mắt, có 3 thẻ Ema.

##### BƯỚC 8: GHI ĐÈ FILE `src/app/cards/page.tsx`
Ghi đè file `src/app/cards/page.tsx` với mã nguồn đầy đủ từ Mục 2 của [Tài liệu 05](file:///D:/project/japanese-srs-system/doc/05_PAGE_CARDS_MANAGEMENT_IMPLEMENTATION.md).
- *Kiểm tra*: Bộ lọc Kifuda hoạt động lọc theo deck, bảng hiển thị Kanji và con dấu loại thẻ.

##### BƯỚC 9: GHI ĐÈ FILE `src/app/cards/new/page.tsx`
Ghi đè file `src/app/cards/new/page.tsx` với mã nguồn đầy đủ từ Mục 2 của [Tài liệu 06](file:///D:/project/japanese-srs-system/doc/06_PAGE_AI_COPILOT_AND_NEW_CARD_IMPLEMENTATION.md).
- *Kiểm tra*: Form AI Copilot kết nối đến `/api/copilot/draft`, khi duyệt thẻ hiển thị con dấu Inkan "済". Không sửa logic backend!

##### BƯỚC 10: GHI ĐÈ FILE `src/app/review/page.tsx`
Ghi đè file `src/app/review/page.tsx` với mã nguồn đầy đủ từ Mục 2 của [Tài liệu 07](file:///D:/project/japanese-srs-system/doc/07_PAGE_REVIEW_ACTIVE_RECALL_IMPLEMENTATION.md).
- *Kiểm tra*: Thẻ bài Karuta có nút lật mở, 4 nút đánh giá Again / Hard / Good / Easy hiển thị đúng màu và chữ Hán tương ứng.

---

#### 3. KIỂM THỬ & THẨM ĐỊNH TỰ ĐỘNG (VERIFICATION COMMANDS)

Sau khi hoàn tất 10 bước trên, Agent PHẢI chạy các lệnh sau để đảm bảo chất lượng tuyệt đối:

1. **Kiểm tra TypeScript & Cú pháp Next.js**:
   ```powershell
   npx tsc --noEmit
   ```
   *Yêu cầu*: Exit code 0, không có bất kỳ lỗi type error nào.

2. **Kiểm tra Unit Test (Bảo toàn FSRS Backend)**:
   ```powershell
   npm run test
   ```
   *Yêu cầu*: Toàn bộ test trong `tests/scheduler.test.ts` đều PASS 100%.

3. **Kiểm tra Build Production**:
   ```powershell
   npm run build
   ```
   *Yêu cầu*: Build thành công, tạo đầy đủ các static/SSR routes: `/`, `/cards`, `/cards/new`, `/review`.

---

#### 4. TIÊU CHÍ NGHIỆM THU HÌNH ẢNH (VISUAL ACCEPTANCE CRITERIA)
1. **Gam màu**: Toàn bộ trang web mang tông màu Washi sáng tinh khôi, ấm áp; màu xanh Matcha `#88A752` nổi bật trên Hero Banner và nút "Good".
2. **Họa tiết**: Họa tiết sóng Seigaiha hiển thị đồng nhất, sắc nét, lặp lại liền mạch không bị đứt gãy.
3. **Hoạt họa**: Cánh hoa anh đào rơi mượt mà, không giật lag; con dấu son Inkan dập nảy nhẹ nhàng; thanh tiến độ Daruma lướt êm ái.
4. **Không lỗi Console**: Mở trình duyệt F12 không có cảnh báo hydration mismatch hay thiếu key trong map array.

---
