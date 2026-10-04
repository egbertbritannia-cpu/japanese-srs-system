# BẢNG ĐIỀU PHỐI TIẾN ĐỘ THỰC THI KIỂM TOÁN THẨM MỸ UI/UX TOÀN DIỆN (50K WORDS AUDIT)
## Master Execution Checkpoint & Sprint Transition Tracker

---

- **Nguồn tài liệu chỉ đạo**: [`UI_UX_VISUAL_AESTHETIC_DEEP_AUDIT_50K.md`](./UI_UX_VISUAL_AESTHETIC_DEEP_AUDIT_50K.md)
- **Dự án**: Japanese SRS Spaced Repetition System (`japanese-srs-system`)
- **Bộ tiêu chuẩn thẩm mỹ áp dụng**:
  - `high-aesthetic-designer`: OKLCH Color Tokens, Ambient Depth Shadows, Micro-Borders, Wabi-Sabi Minimalism.
  - `figma-design-bridge`: Responsive Breakpoints (320px - 4K), Auto Layout, Safe Area Insets.
  - `image-asset-generator`: WebP Retina 2x, khử đục Ukiyo-e/Kirie backdrop.
- **Mục tiêu**: Thực thi toàn diện 55 hồ sơ khuyết tật thị giác qua 5 Sprint liên hoàn, đảm bảo Zero Backend Regression và 100% test pass.

---

## MA TRẬN TIẾN ĐỘ 5 SPRINT THIẾT KẾ

| Sprint | Nội dung phân hệ | Danh sách hồ sơ khuyết tật thị giác | Trạng thái | Kiểm thử tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Sprint 1** | **Hạ tầng Thẩm mỹ, Typography Toàn cục & Điều hướng Di động** | `VIS-SYS-01`, `VIS-SYS-02`, `VIS-SYS-03`, `VIS-SYS-04` | ✅ HOÀN THÀNH | ✅ 111/111 pass |
| **Sprint 2** | **Đại tu Đấu trường Ôn tập Karuta Active Recall & Pitch Accent** | `VIS-REV-01`, `VIS-REV-02`, `VIS-REV-03`, `VIS-REV-04`, `VIS-REV-05`, `VIS-REV-06`, `VIS-REV-07`, `VIS-COPILOT-04` | ✅ HOÀN THÀNH | ✅ 111/111 pass |
| **Sprint 3** | **Thư viện Thẻ học Tanzakucho & Trang chủ Dashboard Sổ cái Washi** | `VIS-CARD-01` -> `06`, `VIS-HOME-01` -> `06` | ✅ HOÀN THÀNH | ✅ 111/111 pass |
| **Sprint 4** | **Đấu trường Chia Động từ & Bàn Thư pháp Tạo thẻ Shodo Desk** | `VIS-CONJ-01` -> `06`, `VIS-NEW-01` -> `05` | 🟡 Tiếp theo | Đang chờ |
| **Sprint 5** | **Giáo trình Ngữ pháp Bunbou & Sensei AI Trợ lý Đồng hành** | `VIS-GRAM-01` -> `06`, `VIS-PRAC-01` -> `05`, `VIS-COPILOT-01`, `02`, `03`, `05` | ⚪ Chưa bắt đầu | Đang chờ |

---

## NHẬT KÝ THỰC THI CHI TIẾT (LIVE EXECUTION LOG)

### 📌 Sprint 1: Hạ tầng Thẩm mỹ & Nền tảng Toàn cục (✅ HOÀN THÀNH)
- [x] Bổ sung hệ thống biến CSS OKLCH vào `src/app/globals.css`:
  - `color-scheme: light dark`
  - `--washi-cream`, `--sumi-black`, `--shinku-vermilion`, `--matcha-green`, `--indigo-deep`, `--kintsugi-gold`.
  - Ambient depth shadows (3 tầng bóng đổ quang học: Key Light, Ambient Shadow, Bounce Rim).
  - Micro-borders & Glassmorphism sheen.
- [x] Chuẩn hóa Typography fluid `clamp()` và Baseline Grid trong `src/app/layout.tsx`.
- [x] Tinh chỉnh `JapaneseArtBackdrop.tsx`: Tối ưu tương phản, khử đục, bổ sung `contrastBoost`.
- [x] Sửa lỗi Safe Area Inset trên `KirieBottomNav.tsx` (`env(safe-area-inset-bottom, 16px)`).

### 📌 Sprint 2: Đấu trường Ôn tập Karuta Active Recall (✅ HOÀN THÀNH)
- [x] `VIS-REV-01`: Fluid typography 5-breakpoint `clamp()` cho chữ Hán lớn trên mobile.
- [x] `VIS-REV-02`: Ẩn Hiragana mặt trước khi đang che Cloze để bảo vệ tính toàn vẹn Active Recall.
- [x] `VIS-REV-03`: Tối ưu độ cao khối ý nghĩa `clamp(8rem, 28vh, 14rem)` và cuộn tự động.
- [x] `VIS-REV-04`: Lưới Kun/On đa cột linh hoạt `minmax(clamp(140px, 38vw, 230px), 1fr)`.
- [x] `VIS-REV-05`: 4 nút FSRS phân cấp xúc giác tactile press & viền vàng Kintsugi.
- [x] `VIS-REV-06`: Dropdown bộ thẻ `backdrop-filter: blur(20px)`, `z-index: 200`.
- [x] `VIS-REV-07`: Modal phím tắt với animation trượt mượt mà 60fps `washi-slide-down`.

### 📌 Sprint 3: Thư viện Thẻ học Tanzakucho & Trang chủ Dashboard (✅ HOÀN THÀNH)
- [x] `VIS-HOME-01`: Áp dụng Triple-Layer Ambient Depth formula cho Top Study Ledger (`src/app/page.tsx`).
- [x] `VIS-HOME-02`: Khắc phục vỡ layout KPI trên màn hình nhỏ `<375px`, padding co giãn `clamp()`.
- [x] `VIS-HOME-03`: Khử trùng lặp câu ví dụ thô bằng `stripCloze()` đối sánh chuẩn xác hai chiều.
- [x] `VIS-HOME-04`: Thay thế nhãn "Đến hạn" gắt gao bằng Huy hiệu Wabi-Sabi son đỏ Torii trầm & chấm sáng Kintsugi.
- [x] `VIS-HOME-05`: Cố định khung bao nút loa `JapaneseSpeakerButton` chống giật layout (Zero CLS).
- [x] `VIS-HOME-06`: Thêm `contrastBoost="subtle"` và tinh chỉnh độ trong suốt nền Ukiyo-e sóng biển.
- [x] `VIS-CARD-01`: Sửa logic phân loại và bổ sung Tam Triện Wabi-Sabi (`[文] Ngữ pháp`, `[漢] Hán tự`, `[語] Từ vựng`).
- [x] `VIS-CARD-02`: Khử trùng lặp cách đọc Furigana giữa Cột 1 và Cột 2 trong bảng thẻ.
- [x] `VIS-CARD-03`: Tích hợp container cuộn ngang cảm ứng mượt mà (`overflowX: auto`, `WebkitOverflowScrolling: touch`) cho bảng di động.
- [x] `VIS-CARD-04`: Nâng cấp thanh tìm kiếm Sumi-e với icon cọ lông `🖌️`, vòng sáng phản quang Kintsugi và nút xóa nhanh `✕`.
- [x] `VIS-CARD-05`: Thiết kế dải nút lọc bộ thẻ bo tròn mềm mại, chuyển màu Indigo quý phái khi active.
- [x] `VIS-CARD-06`: Nâng cấp huy hiệu FSRS (`Đã củng cố` / `Mới tiếp nhận`) với con dấu chấm ngọc bích / hổ phách Kintsugi.
