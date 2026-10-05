# 🎯 KẾ HOẠCH TỔNG THỂ GIAI ĐOẠN 10: CHUYỂN ĐỔI HỆ THỐNG HỌC TẬP TỪ FLASHCARD SANG "DÒ BÀI MINNA" TÍCH HỢP FSRS
> **Mã dự án:** `PHASE-10-DO-BAI-MIGRATION`  
> **Phiên bản:** `1.0.0-PROD`  
> **Tài liệu tham chiếu thực tế:** `D:\JLPT\Dò bài - Minna.xlsm` (4 Macro VBA & 5 Worksheet)  
> **Tài liệu đặc tả kỹ thuật:** [doc/DO_BAI_LEARNING_SPECIFICATION.md](file:///d:/project/japanese-srs-system/doc/DO_BAI_LEARNING_SPECIFICATION.md)  
> **Nguyên tắc bất biến:** **Zero Backend Regression** — Bảo toàn 100% database schema Turso, 100% thuật toán FSRS v4.5, và 21/21 Vitest test suites.

---

## 1. KHUNG RANH GIỚI VÀ PHẠM VI BIẾN ĐỔI (SCOPE INVARIANCE CHARTER)

> [!IMPORTANT]
> ### ⛩️ BẢN CAM KẾT PHẠM VI (SCOPE INVARIANCE CHARTER)
> 
> * **IN-SCOPE (Phạm vi bắt buộc triển khai):**
>   1. **Thay thế hoàn toàn mô hình Flashcard 3D (Karuta flip):** Loại bỏ hoạt ảnh lật thẻ trước/sau, loại bỏ gánh nặng nhận thức chọn 4 nút đánh giá (`Again / Hard / Good / Easy`).
>   2. **Triển khai Bàn Dò Bài Phản Xạ Minna (`DoBaiDesk`):** Tái hiện 100% logic của file `Dò bài - Minna.xlsm` với chu trình 3 bước: **Bốc** (`Draw`) ➔ **Hiện** (`Reveal`) ➔ **Đã thuộc** (`Mastered`) / **Chưa thuộc** (`Retry`).
>   3. **Hàng đợi Dò lại trong phiên (In-Session Re-queue - Cột D-E-F):** Các từ bấm "Chưa thuộc" sẽ được đưa ngay vào danh sách chờ và tự động xen kẽ lặp lại sau mỗi 2 - 3 từ trong cùng phiên học.
>   4. **Bộ phím tắt siêu tốc (Zero-Friction Hotkeys):** `Space` (Hiện/Ẩn), `Enter` hoặc `1` (Đã thuộc), `Backspace` hoặc `2` (Chưa thuộc), `Z` (Hoàn tác), `P` (Phát âm).
>   5. **Đồng bộ tự động vào FSRS v4.5 & Bjork Latency Dynamics:** Thuật toán Spaced Repetition chạy ngầm, tự động quy đổi thời gian phản xạ (từ lúc Bốc đến lúc Hiện) thành độ ổn định (stability) và khoảng cách ngày ôn tập.
>   6. **Hỗ trợ 2 chiều dò linh hoạt:** Dò Thuận (Nhật ➔ Việt) và Dò Nghịch (Việt ➔ Nhật), cùng chế độ Dò riêng từ vấp ngã (Sheet `Luyện dò bài`).
> 
> * **OUT-OF-SCOPE (Non-Goals - Tuyệt đối không thực hiện):**
>   1. **KHÔNG thay đổi cấu trúc bảng cơ sở dữ liệu (`src/db/schema.ts`):** Giữ nguyên bảng `cards`, `decks`, `review_logs`, `retrieval_latency_logs`.
>   2. **KHÔNG xóa hoặc sửa thuật toán toán học FSRS lõi (`src/core/scheduler/fsrs-engine.ts`):** Chỉ tích hợp lớp chuyển đổi (Adapter/Facade).
>   3. **KHÔNG phá vỡ API Contracts hiện hành:** API `/api/review` tiếp tục nhận request chuẩn và phản hồi đúng schema.
>   4. **KHÔNG xóa bỏ dữ liệu học tập đã lưu:** 676 thẻ học hiện có trên Turso LibSQL phải được giữ nguyên vẹn.

---

## 2. KHUNG KIẾN TRÚC HỆ THỐNG MỚI (ARCHITECTURAL FRAMEWORK)

### 2.1. Máy Trạng thái Hữu hạn (Finite State Machine - FSM) của Phiên Dò bài

```mermaid
stateDiagram-v2
    [*] --> IDLE : Vào trang /review
    IDLE --> DRAWN : Bấm "Bốc từ" hoặc Auto-start
    
    state DRAWN {
        [*] --> TimerRunning : Bắt đầu tính giờ phản xạ (Latency Start)
        TimerRunning --> MaskedAnswer : Hiện Kanji + Hiragana / Ẩn Nghĩa (C1 = "")
    }

    DRAWN --> REVEALED : Bấm "Hiện" (Space)
    
    state REVEALED {
        [*] --> TimerStopped : Chốt thời gian phản xạ (latencyMs)
        TimerStopped --> AudioAutoPlay : Web Speech API phát âm chuẩn
        AudioAutoPlay --> DisplayAnswer : Bung ô Nghĩa Tiếng Việt & Ví dụ
    }

    REVEALED --> RATED_MASTERED : Bấm "ĐÃ THUỘC" (Enter / Phím 1)
    REVEALED --> RATED_RETRY : Bấm "CHƯA THUỘC" (Backspace / Phím 2)

    state RATED_MASTERED {
        [*] --> PostFSRSGood : Gửi FSRS (Good nếu bình thường, Easy nếu < 1.5s)
        PostFSRSGood --> PopQueue : Loại khỏi hàng đợi phiên hôm nay (DeleteAll2)
    }

    state RATED_RETRY {
        [*] --> PostFSRSAgain : Gửi FSRS (Again)
        PostFSRSAgain --> InsertDEF : Thêm vào Danh sách Chưa thuộc (Cột D-E-F)
        InsertDEF --> ScheduleInterleave : Xếp lịch lặp lại sau 2-3 từ tiếp theo
    }

    RATED_MASTERED --> DRAWN : Tự động bốc từ tiếp theo
    RATED_RETRY --> DRAWN : Tự động bốc từ tiếp theo
    
    DRAWN --> COMPLETED : Hết hàng đợi chính VÀ Hết hàng đợi Chưa thuộc
    COMPLETED --> [*] : Tổng kết phiên dò bài
```

---

### 2.2. Ma Trận Quy Đổi Nhận Thức sang Thuật Toán FSRS (Cognitive-to-FSRS Adapter)

Để bảo toàn thuật toán FSRS hiện tại mà không ép người học phải suy nghĩ 4 nút bấm, hệ thống sử dụng **Bộ Quy Đổi Phản Xạ Nhận Thức (Cognitive Reflex Adapter)**:

| Thao tác Người học | Thời gian Phản xạ ($\Delta t = t_{\text{Hiện}} - t_{\text{Bốc}}$) | FSRS Grade Tương Ứng | Xử lý Hàng Đợi Phiên (Session Queue) |
| :--- | :--- | :--- | :--- |
| **ĐÃ THUỘC** | $\Delta t < 1.5\text{s}$ (Phản xạ tức thì) | **`Easy` (Grade 4)** | Hoàn thành, tăng mạnh stability, không lặp lại trong phiên. |
| **ĐÃ THUỘC** | $1.5\text{s} \le \Delta t \le 6.0\text{s}$ (Bình thường) | **`Good` (Grade 3)** | Hoàn thành, tăng stability chuẩn, không lặp lại trong phiên. |
| **ĐÃ THUỘC** | $\Delta t > 6.0\text{s}$ (Mất nhiều thời gian suy nghĩ) | **`Hard` (Grade 2)** | Hoàn thành, tăng nhẹ stability, không lặp lại trong phiên. |
| **CHƯA THUỘC** | Bất kể thời gian phản xạ | **`Again` (Grade 1)** | Ghi nhận lapse, **đưa ngay vào danh sách Chưa thuộc (Cột D-E-F)** để dò lại trong phiên. |

---

---

## 3. SKETCH DESIGN & THIẾT KẾ CÔNG THÁI HỌC BỐ CỤC (WIREFRAME & LAYOUT ARCHITECTURE)

Nhằm đảm bảo trải nghiệm học tập vượt trội, loại bỏ hoàn toàn cảm giác cồng kềnh của Flashcard 3D và chuyển hóa xuất sắc tinh thần của file Excel `Dò bài - Minna.xlsm`, dưới đây là bản phác thảo chi tiết bố cục (Sketch Design) cho toàn bộ các trạng thái giao diện trên Desktop và Mobile:

### 3.1. Phác thảo Tổng thể Không gian Bàn Dò Bài (Desktop 2-Column Bento Grid)

Trên màn hình Desktop ($> 980\text{px}$), giao diện tổ chức theo cấu trúc Bento Grid 2 cột:
* **Cột Trái (Chiếm 72% bề ngang):** Khung Bàn Dò Bài Phản Xạ Trung Tâm (`DoBaiDesk`) và Bảng phím tắt công thái học (`DoBaiHotkeysBar`).
* **Cột Phải (Chiếm 28% bề ngang):** Thanh Dock Từ Chưa Thuộc Trong Phiên (`DoBaiUnlearnedDrawer` — Cột D-E-F Excel) hiển thị trực tiếp các từ đang nợ để não bộ ghi nhận ngay tức thì.

```
+-------------------------------------------------------------------------------------------------------------+
| 🎋 JPD133 - Từ vựng Kotoba   |   Tiến độ: [████████░░░░░░░] 14/45   |  Chế độ: [Thuận JA➔VI ▾]  |  🎐 Âm thanh  |
+-------------------------------------------------------------------------------------------------------------+
|                                                                             |                               |
|   ========================= KHUNG DÒ BÀI CHÍNH (72%) ====================   |  === CỘT TỪ CHƯA THUỘC (28%) ===
|   |                                                                     |   |                               |
|   |   +-------------------------------------------------------------+   |   |  📋 TỪ ĐANG NỢ (CỘT D-E-F)    |
|   |   |  TAG: Bài 1 · Danh từ                                       |   |   |  (Tự động lặp lại xen kẽ)     |
|   |   |                                                             |   |   |                               |
|   |   |                   私                  わたし     🔊         |   |   |  1. 辞書 (じしょ)             |
|   |   |                (Kanji)              (Hiragana)              |   |   |     từ điển                   |
|   |   |                                                             |   |   |     [⏳ Sắp lặp lại sau 1 từ] |
|   |   |   - - - - - - - - - - - - - - - - - - - - - - - - - - - -   |   |   |                               |
|   |   |                                                             |   |   |  2. 手帳 (てちょう)           |
|   |   |   [ KHUNG NGHĨA TIẾNG VIỆT & NGỮ CẢNH: CHE MỜ HOẶC MỞ ]     |   |   |     sổ tay                    |
|   |   |   tôi (Ngôi thứ I số ít)                                    |   |   |     [⏳ Sắp lặp lại sau 3 từ] |
|   |   |   Ví dụ: 私はベトナム人です。                               |   |   |                               |
|   |   +-------------------------------------------------------------+   |   |  3. [お] 土産 (おみやげ)      |
|   |                                                                     |   |     quà                       |
|   |   [ ⏱️ Phản xạ: 1.2s ]                           [ ↩ Hoàn tác (Z) ]  |   |     [⏳ Sắp lặp lại sau 4 từ] |
|   |                                                                     |   |                               |
|   |   +---------------------------+   +-----------------------------+   |   |  ---------------------------  |
|   |   |  ✕ CHƯA THUỘC (Bksp / 2)  |   |   ✓ ĐÃ THUỘC (Enter / 1)    |   |   |  ⚡ Tổng nợ: 3 từ             |
|   |   |  (Đưa vào cột nợ D-E-F)   |   |   (FSRS Good/Easy & Bốc mới)|   |   |  (Thuộc hết mới hoàn thành!)  |
|   |   +---------------------------+   +-----------------------------+   |   |                               |
|   =======================================================================   |                               |
|                                                                             |                               |
|   [ CHỈ DẪN PHÍM TẮT:  Space: Hiện/Ẩn  |  Enter/1: Đã thuộc  |  Bksp/2: Chưa thuộc  |  Z: Hoàn tác  |  P: Loa ]    |
+-------------------------------------------------------------------------------------------------------------+
```

---

### 3.2. Sketch Chi tiết Trạng thái 1: "BỐC TỪ" (State: Drawn / Masked Answer)

Khi vừa bắt đầu hoặc sau khi chốt từ trước, hệ thống bốc từ ngẫu nhiên từ hàng đợi. Lúc này, **Nghĩa tiếng Việt bị giấu hoàn toàn** để kích hoạt phản xạ tự nhớ:

```
+---------------------------------------------------------------------------------------+
|  JLPT N5 · BÀI 1                                                   Thẻ thứ: 14 / 45   |
|                                                                                       |
|                                 私                                                    |
|                                                                                       |
|                              わたし                                                   |
|                                                                                       |
|                             [ 🔊 Nghe phát âm (P) ]                                   |
|                                                                                       |
|   +-------------------------------------------------------------------------------+   |
|   |  🔒 NGHĨA TIẾNG VIỆT & NGỮ CẢNH                                               |   |
|   |                                                                               |   |
|   |     [ 👁️‍🗨️ Nhẩm nghĩa trong đầu... Bấm SPACE hoặc nút dưới để HIỆN NGHĨA ]     |   |
|   |                                                                               |   |
|   +-------------------------------------------------------------------------------+   |
|                                                                                       |
|   ⏱️ Đang đo độ trễ phản xạ: 0.9s...                                                  |
|                                                                                       |
|   +-------------------------------------------------------------------------------+   |
|   |                                                                               |   |
|   |                     [  👁️  HIỆN NGHĨA TIẾNG VIỆT  (Phím Space)  ]             |   |
|   |                                                                               |   |
|   +-------------------------------------------------------------------------------+   |
|                                                                                       |
|      (Nút Đã thuộc & Chưa thuộc đang ở trạng thái mờ chờ bạn xem đáp án)              |
+---------------------------------------------------------------------------------------+
```

* **Đặc điểm mỹ học:** Khung nghĩa mang màu giấy Washi mờ (`rgba(250, 248, 245, 0.6)`), viền nét đứt thanh mảnh gợi ý vị trí đáp án, triệt tiêu hoàn toàn Layout Shift khi mở.

---

### 3.3. Sketch Chi tiết Trạng thái 2: "HIỆN NGHĨA" (State: Revealed / Active Comparison)

Ngay khi bấm phím `Space` hoặc nhấn nút **[Hiện nghĩa]**, khung nghĩa bung ra tức thì (0ms jank), âm thanh lật giấy xột xoạt Washi vang lên và Web Speech API tự động phát âm:

```
+---------------------------------------------------------------------------------------+
|  JLPT N5 · BÀI 1                                                   Thẻ thứ: 14 / 45   |
|                                                                                       |
|                                 私                                                    |
|                                                                                       |
|                              わたし                                                   |
|                                                                                       |
|                             [ 🔊 Đang phát âm... ]                                    |
|                                                                                       |
|   +-------------------------------------------------------------------------------+   |
|   |  📖 NGHĨA CHÍNH:                                                              |   |
|   |  tôi (Đại từ nhân xưng ngôi thứ I số ít)                                      |   |
|   |                                                                               |   |
|   |  💬 CÂU VÍ DỤ MINH HỌA:                                                       |   |
|   |  私はベトナム人です。 (Tôi là người Việt Nam.)                                |   |
|   +-------------------------------------------------------------------------------+   |
|                                                                                       |
|   ⏱️ Thời gian phản xạ: 1.2s  •  Đánh giá: Phản xạ tức thì (FSRS Easy)               |
|                                                                                       |
|   +---------------------------------------+   +-----------------------------------+   |
|   |                                       |   |                                   |   |
|   |       ✕  CHƯA THUỘC                   |   |       ✓  ĐÃ THUỘC                 |   |
|   |       (Backspace / Phím 2)            |   |       (Enter / Phím 1)            |   |
|   |       • Lưu vào cột nợ D-E-F          |   |       • Tăng stability FSRS       |   |
|   |       • Sẽ bốc lại sau 2 từ           |   |       • Chuyển từ mới ngay        |   |
|   |                                       |   |                                   |   |
|   +---------------------------------------+   +-----------------------------------+   |
|                                                                                       |
|                          [ ↩ Hoàn tác bấm nhầm (Ctrl+Z / Z) ]                         |
+---------------------------------------------------------------------------------------+
```

* **Cơ chế màu sắc nhận thức:**
  * Nút **ĐÃ THUỘC:** Nền xanh Matcha sâu (`#386641`), chữ trắng tương phản cao, đổ bóng nhẹ.
  * Nút **CHƯA THUỘC:** Nền đỏ son Shu-iro cổ điển (`#B5301E`), biểu tượng chữ `✕` dứt khoát.

---

### 3.4. Sketch Chi tiết Trạng thái 3: "DÒ NGHỊCH" (State: Reverse Drill VI ➔ JA)

Phục vụ nhu cầu luyện tập nói, viết và phản xạ dịch Việt - Nhật:

```
+---------------------------------------------------------------------------------------+
|  CHẾ ĐỘ: DÒ NGHỊCH (VIỆT ➔ NHẬT)                                  Thẻ thứ: 08 / 45   |
|                                                                                       |
|                         bác sĩ (nghề nghiệp)                                          |
|                         Gợi ý ngữ cảnh: Người khám chữa bệnh tại bệnh viện            |
|                                                                                       |
|   +-------------------------------------------------------------------------------+   |
|   |  🔒 CHỮ HÁN & CÁCH ĐỌC TIẾNG NHẬT                                             |   |
|   |                                                                               |   |
|   |     [ 👁️‍🗨️ Tự nhẩm Kanji & Hiragana... Bấm SPACE để ĐỐI CHIẾU ]                  |   |
|   |                                                                               |   |
|   +-------------------------------------------------------------------------------+   |
|                                                                                       |
|   +-------------------------------------------------------------------------------+   |
|   |                  [  👁️  HIỆN ĐÁP ÁN TIẾNG NHẬT  (Phím Space)  ]                 |   |
|   +-------------------------------------------------------------------------------+   |
+---------------------------------------------------------------------------------------+
```

---

### 3.5. Sketch Bố cục Trên Thiết Bị Di Động (Mobile Responsive < 768px)

Trên smartphone, không gian màn hình hẹp được tối ưu hóa theo trục dọc:

```
+-----------------------------------------+
| [🎋 JPD133]  14/45 [████░░]   [🎐] [✕]  |
+-----------------------------------------+
|                                         |
|                 私                      |
|                                         |
|               わたし                    |
|             [ 🔊 Loa ]                  |
|                                         |
|  +-----------------------------------+  |
|  | tôi (Ngôi thứ I số ít)            |  |
|  | 私はベトナム人です。               |  |
|  +-----------------------------------+  |
|                                         |
|  ⏱️ Phản xạ: 1.1s                        |
|                                         |
|  +-----------------------------------+  |
|  |    📋 3 từ đang nợ (Chạm để xem)  |  |
|  +-----------------------------------+  |
|                                         |
|  +-------------------+-----------------+
|  |  ✕ CHƯA THUỘC     |  ✓ ĐÃ THUỘC     |
|  |  (Cột nợ D-E-F)   |  (Thuộc lòng)   |
|  +-------------------+-----------------+
|  |    [ 👁️ BẤM HIỆN / ĐỔI MẶT ]        |
+-----------------------------------------+
```

* Nút chạm đạt tiêu chuẩn ngón tay cái: chiều cao tối thiểu $52\text{px}$, vùng đệm $12\text{px}$, phím chuyển đổi Hiện/Ẩn đặt ngay tầm với thuận tiện nhất.

---

### 3.6. Bảng Thông Số Thiết Kế Hệ Thống (Design Tokens & Typography)

| Khối giao diện | Thuộc tính Style | Giá trị Token & CSS | Ý nghĩa thẩm mỹ Wa-Style |
| :--- | :--- | :--- | :--- |
| **Nền Bàn Dò Bài** | `background` | `var(--washi-base, #FAF8F5)` | Giấy Washi tự nhiên, giảm chói mắt khi học đêm |
| **Chữ Hán Kanji** | `font-family`, `font-size` | `var(--font-mincho), serif`, `3.2rem` (`52px`) | Uy nghi, đậm nét thư pháp Shodo truyền thống |
| **Cách đọc Hiragana** | `font-family`, `font-size` | `var(--font-maru), sans-serif`, `1.6rem` (`26px`) | Tròn trịa, mềm mại, dễ đọc ngay cả ở khoảng cách xa |
| **Khung Đáp Án** | `border`, `border-radius` | `1.5px solid #E8E2D8`, `14px` | Khung viền mộc bản mộc mạc, bo góc công thái học |
| **Nút ĐÃ THUỘC** | `background`, `color` | `#386641` (Matcha sâu), `#FFFFFF` | Cảm giác thành tựu vững chãi, khích lệ tâm lý |
| **Nút CHƯA THUỘC** | `background`, `color` | `#B5301E` (Đỏ son Shu-iro), `#FFFFFF` | Báo hiệu cần chú ý mà không gây ức chế tiêu cực |
| **Thanh Cột Nợ** | `background` | `rgba(235, 242, 223, 0.6)` | Màu lá trà non nhẹ nhàng, phân tách rõ ràng với bàn dò |

---

## 4. BẢNG PHÂN RÃ CÔNG VIỆC CHI TIẾT (WORK BREAKDOWN STRUCTURE - WBS)

### SPRINT 1: XÂY DỰNG KHUNG BÀN DÒ BÀI & CƠ CHẾ BỐC - HIỆN (P0 CORE)
* **WBS-10.1 (DoBaiDesk Component):**
  * Xây dựng giao diện trung tâm cố định một màn hình (Zero Layout Shift).
  * Ô hiển thị Chữ Hán (Kanji lớn `2.8rem`, font `Shippori Mincho`).
  * Ô hiển thị Cách đọc Hiragana (`1.5rem`, font `Zen Maru Gothic`) kèm nút loa phát âm tự nhiên.
  * Ô hiển thị Nghĩa tiếng Việt: Có 2 trạng thái rõ rệt — *Trạng thái Ẩn* (hiển thị khung chìm Washi mờ kèm nhãn "Bấm Space hoặc nút Hiện để mở") và *Trạng thái Hiện* (bung nghĩa tiếng Việt sắc nét, kèm ví dụ và ghi chú cách dùng).
* **WBS-10.2 (Hotkey Controller Engine):**
  * Thiết lập listener phím tắt toàn cục không xung đột với bộ gõ IME:
    * `Space`: Kích hoạt hàm `handleReveal()` (Hiện nghĩa & phát âm).
    * `Enter` hoặc phím số `1`: Kích hoạt hàm `handleMastered()` (Đã thuộc -> Chấm điểm FSRS & tự động Bốc từ tiếp theo).
    * `Backspace` hoặc phím số `2`: Kích hoạt hàm `handleRetry()` (Chưa thuộc -> Chuyển vào hàng đợi Chưa thuộc & Bốc từ tiếp theo).
    * `z` hoặc `Ctrl+Z`: Hoàn tác kết quả vừa chấm.
    * `p`: Phát âm lại từ vựng.
* **WBS-10.3 (In-Session Re-queue & Cột D-E-F State Management):**
  * Khởi tạo state `unlearnedList: Card[]` mô phỏng chính xác hành vi cột D, E, F của sheet `Tu dò bài`.
  * Khi người học bấm "Chưa thuộc", thẻ được lưu vào `unlearnedList`.
  * Thuật toán xen kẽ (Interleaving): Cứ sau mỗi $N=2$ từ mới hoặc từ due, hệ thống tự động bốc 1 từ từ `unlearnedList` ra để người học dò lại cho đến khi thuộc hoàn toàn.

---

### SPRINT 2: CHẾ ĐỘ DÒ 2 CHIỀU & ĐO LƯỜNG ĐỘ TRỄ BJORK (P1 HIGH)
* **WBS-10.4 (Bi-directional Practice Modes):**
  * **Chế độ 1: Dò Thuận (Nhật ➔ Việt):** Hiện Kanji/Hiragana, giấu Tiếng Việt (mặc định theo macro `DrawName_A_B`).
  * **Chế độ 2: Dò Nghịch (Việt ➔ Nhật):** Hiện Nghĩa tiếng Việt, giấu Kanji & Hiragana (phục vụ người học luyện phản xạ nói/viết).
  * **Chế độ 3: Luyện Dò Từ Vấp Ngã (Tương tự Sheet `Luyện dò bài`):** Cho phép lọc nhanh chỉ dò những từ đang nằm trong danh sách Chưa thuộc hoặc có Retrievability $< 70\%$.
* **WBS-10.5 (Bjork Latency Dynamics Integration):**
  * Ghi nhận chính xác `durationMs = t_reveal - t_draw`.
  * Truyền `durationMs` trong payload gửi đến `POST /api/review`.
  * Backend tự động lưu vào bảng `retrieval_latency_logs`, phục vụ tính toán tự động FSRS grade mà không làm gián đoạn trải nghiệm người dùng.

---

### SPRINT 3: GIAO DIỆN WA-STYLE, DANH SÁCH CHƯA THUỘC & ÂM THANH (P2 MEDIUM)
* **WBS-10.6 (DoBaiUnlearnedDrawer & Sidebar):**
  * Thiết kế bảng danh sách các từ chưa thuộc trong phiên hiển thị song song (Sidebar trên Desktop, Bottom Drawer có thể vuốt mở trên Mobile).
  * Cho phép người học liếc mắt nhìn thấy ngay các từ mình vừa quên (Kanji, Hiragana, Nghĩa) để ghi nhớ tức thì.
  * Hiển thị số lượng từ chưa thuộc theo thời gian thực (ví dụ: `Đang nợ: 3 từ`).
* **WBS-10.7 (Audio Orchestration & Dual Coding):**
  * Khi bấm "Hiện" hoặc phím `Space`, tự động kích hoạt âm thanh lật giấy Washi mộc mạc (`playWashiPaper()`) kết hợp Web Speech API phát âm từ vựng tiếng Nhật.
  * Âm thanh nhạc cụ Hyoshigi / Suzu tự động ducking theo chuẩn WBS-04.1.

---

### SPRINT 4: KIỂM THỬ TOÀN DIỆN, BẢO TOÀN HỆ THỐNG & RELEASE (P3 QUALITY)
* **WBS-10.8 (Vitest Suite cho Mô hình Dò bài):**
  * Tạo mới file test: `tests/do-bai-engine.test.ts` kiểm thử:
    1. Chu trình FSM: Bốc ➔ Hiện ➔ Đã thuộc / Chưa thuộc.
    2. Logic đưa từ vào Hàng đợi Chưa thuộc (cột D-E-F) và cơ chế lặp lại xen kẽ.
    3. Quy đổi chính xác độ trễ phản xạ sang FSRS Grade.
    4. Bảo đảm toàn bộ 21 test suites cũ vẫn chạy đạt 100%.
* **WBS-10.9 (Release Gate Protocol):**
  * `npx tsc --noEmit` đạt 0 lỗi.
  * `npm test` đạt 100% pass (22/22 suites).
  * `npm run build` biên dịch thành công toàn bộ routes tĩnh và động.

---

## 5. MA TRẬN QUẢN TRỊ RỦI RO (PROJECT RISK MATRIX)

| Rủi ro kỹ thuật | Mức độ | Khả năng | Giải pháp khắc phục & Dự phòng (Mitigation Strategy) |
| :--- | :---: | :---: | :--- |
| **Xung đột phím tắt với bộ gõ tiếng Nhật IME** | Cao | Cao | Bắt sự kiện `e.isComposing` và `(e.nativeEvent as any)?.isComposing`. Nếu người học đang gõ chữ Hán hoặc gõ phím trên input, hệ thống sẽ tạm khóa các hotkey `Space`, `Enter` để tránh kích hoạt nhầm. |
| **Hàng đợi Chưa thuộc bị lặp vô tận nếu người học liên tục bấm Chưa thuộc** | Trung bình | Thấp | Giới hạn số lần lặp lại tối đa trong một phiên ($Max = 3$ lần). Sau 3 lần vẫn chưa thuộc, hệ thống chuyển từ này vào danh sách "Cần xem lại sau phiên" và cho qua từ mới để tránh kiệt sức nhận thức (Cognitive Fatigue). |
| **Mất dữ liệu tiến độ khi người học vô tình tải lại trang** | Cao | Trung bình | Tự động đồng bộ hàng đợi phiên học (`queue`, `unlearnedList`, `currentIndex`) vào `sessionStorage` (`dobai_session_state`). Khôi phục nguyên vẹn khi trang được refresh. |
| **Sai lệch độ trễ do người học treo màn hình đi ra ngoài** | Trung bình | Trung bình | Giới hạn trần độ trễ phản xạ hợp lệ: Nếu $\Delta t > 15\text{s}$, hệ thống coi như người học bị gián đoạn và tự động gán trần $15\text{s}$, không tính là độ trễ tự nhiên để tránh làm lệch trọng số FSRS. |

---

## 6. TIÊU CHUẨN NGHIỆM THU (DEFINITION OF DONE - DOD)

Hạng mục Giai đoạn 10 chỉ được đóng lại khi thỏa mãn toàn bộ các điều kiện:
1. Giao diện trang `/review` hiển thị đúng chuẩn **Bàn Dò Bài Minna** (không còn thẻ lật 3D).
2. Thao tác mượt mà qua các phím tắt `Space`, `Enter`/`1`, `Backspace`/`2`.
3. Bảng từ chưa thuộc (cột D-E-F) ghi nhận tức thì các từ bấm "Chưa thuộc" và tự động cho dò lại trong phiên.
4. Dữ liệu đánh giá được ghi nhận chính xác vào cơ sở dữ liệu Turso qua endpoint `/api/review` với FSRS parameters chuẩn xác.
5. `npx tsc --noEmit` thoát mã 0.
6. `npm test` toàn bộ các test suites đều xanh 100%.
7. `npm run build` sinh mã tối ưu cho tất cả 34 routes.
8. Git commit sạch và push an toàn lên nhánh `main`.
