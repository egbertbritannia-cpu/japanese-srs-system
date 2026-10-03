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
| **Sprint 1** | **Hạ tầng Thẩm mỹ, Typography Toàn cục & Điều hướng Di động** | `VIS-SYS-01`, `VIS-SYS-02`, `VIS-SYS-03`, `VIS-SYS-04` | 🟡 Đang thực thi | Đang chờ |
| **Sprint 2** | **Đại tu Đấu trường Ôn tập Karuta Active Recall & Pitch Accent** | `VIS-REV-01`, `VIS-REV-02`, `VIS-REV-03`, `VIS-REV-04`, `VIS-REV-05`, `VIS-REV-06`, `VIS-REV-07`, `VIS-COPILOT-04` | ⚪ Chưa bắt đầu | Đang chờ |
| **Sprint 3** | **Thư viện Thẻ học Tanzakucho & Trang chủ Dashboard Sổ cái Washi** | `VIS-CARD-01` -> `06`, `VIS-HOME-01` -> `06` | ⚪ Chưa bắt đầu | Đang chờ |
| **Sprint 4** | **Đấu trường Chia Động từ & Bàn Thư pháp Tạo thẻ Shodo Desk** | `VIS-CONJ-01` -> `06`, `VIS-NEW-01` -> `05` | ⚪ Chưa bắt đầu | Đang chờ |
| **Sprint 5** | **Giáo trình Ngữ pháp Bunbou & Sensei AI Trợ lý Đồng hành** | `VIS-GRAM-01` -> `06`, `VIS-PRAC-01` -> `05`, `VIS-COPILOT-01`, `02`, `03`, `05` | ⚪ Chưa bắt đầu | Đang chờ |

---

## NHẬT KÝ THỰC THI CHI TIẾT (LIVE EXECUTION LOG)

### 📌 Sprint 1: Hạ tầng Thẩm mỹ & Nền tảng Toàn cục
- [ ] Bổ sung hệ thống biến CSS OKLCH vào `src/app/globals.css`:
  - `color-scheme: light dark`
  - `--washi-cream`, `--sumi-black`, `--shinku-vermilion`, `--matcha-green`, `--indigo-deep`, `--kintsugi-gold`.
  - Ambient depth shadows (3 tầng bóng đổ quang học: Key Light, Ambient Shadow, Bounce Rim).
  - Micro-borders & Glassmorphism sheen.
- [ ] Chuẩn hóa Typography fluid `clamp()` và Baseline Grid trong `src/app/layout.tsx`.
- [ ] Tinh chỉnh `JapaneseArtBackdrop.tsx`: Tối ưu tương phản, khử đục, bổ sung `contrast-filter`.
- [ ] Sửa lỗi Safe Area Inset trên `KirieBottomNav.tsx` (`env(safe-area-inset-bottom, 16px)`).
