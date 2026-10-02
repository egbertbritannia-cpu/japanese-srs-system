# 🌸 TÀI LIỆU 00: TỔNG QUAN DỰ ÁN & BẢN TUYÊN NGÔN TÁI THIẾT KẾ (REDESIGN MANIFESTO)
## Dự án: Japanese SRS System (FSRS Spaced Repetition System)
## Phong cách: Traditional Japanese Craftsmanship & Bright Luminous Aesthetics (和風・美学)

---

### 1. BỐI CẢNH & MỤC TIÊU CỐT LÕI (OBJECTIVES)
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

### 2. PHÂN TÍCH HIỆN TRẠNG & BẢNG SO SÁNH TRƯỚC / SAU (BEFORE vs AFTER)

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

### 3. SƠ ĐỒ ĐỊNH DANH TÀI LIỆU TRONG FOLDER `doc/`

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

### 4. NGUYÊN TẮC BẢO TOÀN BACKEND (BACKEND SAFETY CONTRACT)
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
