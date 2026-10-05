# 🛡️ AGENTS.md — BỘ QUY TẮC BẤT KHẢ XÂM PHẠM & RÀNG BUỘC HỆ THỐNG (SYSTEM CONSTRAINTS)
> **Dự án:** `japanese-srs-system` (記憶道 · Japanese SRS System)  
> **Cấp độ áp dụng:** BẮT BUỘC (MANDATORY & UNCONDITIONAL) cho TOÀN BỘ AI AGENTS, Subagents và Developer.  
> **Mục đích:** Thiết lập ranh giới phòng vệ tuyệt đối, ngăn chặn các hành vi tự ý phá vỡ kiến trúc, vi phạm schema database, gãy thuật toán FSRS hoặc thực thi mã nguồn khi chưa được người dùng phê duyệt.

---

## ⛔ 6 ĐIỀU RĂN TỐI CAO DÀNH CHO AGENTS (THE 6 INVIOLABLE COMMANDMENTS)

### 1. 🛑 ĐIỀU RĂN 1: ZERO BACKEND & SCHEMA REGRESSION (BẤT KHẢ XÂM PHẠM DATABASE)
* **TUYỆT ĐỐI NGHIÊM CẤM** tự ý thêm, sửa, đổi tên hoặc xóa bất kỳ bảng, cột nào trong `src/db/schema.ts` hoặc sinh migration Turso mới nếu không có yêu cầu bằng văn bản rõ ràng từ người dùng.
* **TUYỆT ĐỐI KHÔNG ĐƯỢC PHÉP** xóa, làm hỏng hoặc làm mất mát 676 thẻ học vựng Minna, Hán Tự, Ngữ pháp đang tồn tại trên cơ sở dữ liệu Turso Cloud LibSQL.
* Mọi tính năng nghiệp vụ mới (như *Dò bài*, *Hàng đợi chưa thuộc Cột D-E-F*) **PHẢI** được hiện thực hóa bằng In-Session Memory State (`unlearnedList`, `sessionStorage`, Dexie IndexedDB) hoặc Adapter layer, **TUYỆT ĐỐI KHÔNG** được sửa schema DB.

### 2. 📋 ĐIỀU RĂN 2: PHÂN TÁCH BƯỚC LẬP KẾ HOẠCH & BƯỚC THỰC THI (PLANNING GATING)
* Khi người dùng đang yêu cầu lập kế hoạch, chỉnh sửa kế hoạch, thảo luận thiết kế hoặc xem xét wireframe: **TUYỆT ĐỐI KHÔNG ĐƯỢC TỰ Ý CHẠY LỆNH CODE HOẶC SỬA FILE SOURCE CODE SẢN PHẨM** (đặc biệt là `src/app/review/page.tsx`...).
* Chỉ được phép thao tác trên các file tài liệu (`planning/*.md`, `doc/*.md`).
* **CHỈ ĐƯỢC CHUYỂN SANG BƯỚC CODE KHI** người dùng phê duyệt rõ ràng ("thực thi", "tiến hành", "bắt đầu làm", "chấp thuận kế hoạch").

### 3. 🧠 ĐIỀU RĂN 3: BẢO TỒN 100% CÔNG TRÌNH NGHIÊN CỨU & THUẬT TOÁN FSRS V4.5
* **TUYỆT ĐỐI KHÔNG** xóa bỏ, làm biến dạng hoặc tách rời các công trình nghiên cứu khoa học nhận thức đã xây dựng qua 9 giai đoạn:
  1. **FSRS v4.5 Math Engine:** Giữ nguyên mô hình DSR (Difficulty - Stability - Retrievability), công thức Ebbinghaus, và cơ chế tính toán ngày ôn tập qua Dedicated Web Worker (`useFsrsScheduler`).
  2. **Bjork Retrieval Latency Dynamics:** Bắt buộc ghi nhận thời gian phản xạ $\Delta t = t_{\text{Hiện}} - t_{\text{Bốc}}$ (ms) để định lượng Storage Strength vs. Retrieval Strength.
  3. **Cognitive Load Theory:** Triệt tiêu tải ngoại lai. Người học chỉ phản xạ 2 nút (*Đã thuộc* / *Chưa thuộc*), việc phân loại FSRS Grade giao cho thuật toán tự động quy đổi dựa trên latency.
  4. **Thuyết Mã Hóa Kép (Dual Coding):** Luôn duy trì đồng thời thị giác (Kanji Mincho, Hiragana Maru) và thính giác (âm thanh Washi, phát âm chuẩn Tokyo).
  5. **Ngữ cảnh $i+1$ & Cloze Deletion:** Giữ nguyên cú pháp đục lỗ Cloze `{{c1::...}}`, câu ví dụ ngữ cảnh, và âm Hán Việt `parseCardDetails`.
  6. **Đồ thị Tokyo Pitch Accent:** Giữ nguyên đồ thị cao độ `PitchAccentGraph`.

### 4. 🧪 ĐIỀU RĂN 4: TIÊU CHUẨN KIỂM THỬ XANH TUYỆT ĐỐI (100% GREEN TESTS)
* Toàn bộ 21/21 Vitest test suites (111 tests) **PHẢI LUÔN XANH 100%** sau bất kỳ chỉnh sửa nào.
* **ĐẶC BIỆT LƯU Ý:** File `src/app/review/page.tsx` bắt buộc phải chứa component `<JapaneseArtBackdrop ... />` để thỏa mãn kiểm thử mỹ thuật `tests/art-backdrop.test.ts`. Bất kỳ agent nào xóa component này đều bị coi là vi phạm nghiêm trọng.
* Phải kiểm tra TypeScript (`npx tsc --noEmit`) đạt **0 errors** trước khi kết thúc tác vụ.

### 5. ⚡ ĐIỀU RĂN 5: OFFLINE-FIRST & BẢO ĐẢM TÍNH ỔN ĐỊNH SRE
* Hệ thống hoạt động theo triết lý **Ngoại tuyến trước (Offline-First)**: Mọi thao tác đánh giá phải được đệm an toàn vào Dexie.js IndexedDB qua `recordPendingReview` khi rớt mạng và tự động đồng bộ ngầm khi online.
* **TUYỆT ĐỐI KHÔNG** chèn các lệnh gọi mạng đồng bộ làm nghẽn (blocking) giao diện người dùng. Mọi tương tác UI phải phản hồi dưới 16ms (60fps).

### 6. 🎎 ĐIỀU RĂN 6: CHUẨN MỰC MỸ HỌC NHẬT BẢN TRUYỀN THỐNG (WA-STYLE MODERNITY)
* **TUYỆT ĐỐI TRÁNH** sử dụng các màu sắc generic công nghiệp (đỏ tươi `#FF0000`, xanh lam chói `#0000FF`).
* Bắt buộc sử dụng hệ màu truyền thống **Nippon Colors / Dentou Shoku**:
  * Đỏ son đền Torii / Con dấu Hanko: *Bengara* (`#9E3223`), *Shu-iro* (`#B5301E`).
  * Xanh lá trà thiền / Rêu phong: *Matcha* (`#386641`), *Koke* (`#485642`).
  * Xanh lam chàm võ sĩ Samurai: *Aizome* (`#16253B`), *Kon* (`#1E4B75`).
  * Vàng lụa / Cát vàng cổ: *Kincha* (`#AF7E36`), *Tamago* (`#FBF5E8`).
  * Giấy thủ công Washi tự nhiên: *Washi-iro* (`#FAF8F5`).
* Phông chữ: `Shippori Mincho` cho Chữ Hán Kanji; `Zen Maru Gothic` cho Kana và giao diện.

---

## 🚨 PROTOCOL XỬ LÝ LỖI DÀNH CHO AGENT
Nếu bất kỳ Agent nào phát hiện hành vi sắp vi phạm 6 điều răn trên:
1. **DỪNG NGAY LẬP TỨC.**
2. Báo cáo rõ ràng rủi ro vi phạm với người dùng.
3. Tham chiếu tài liệu quy chuẩn tại `planning/10_PHASE_10_DO_BAI_MINNA_LEARNING_SYSTEM_MIGRATION_PLAN.md` và `doc/DO_BAI_LEARNING_SPECIFICATION.md` trước khi đề xuất bất kỳ giải pháp thay thế nào.
