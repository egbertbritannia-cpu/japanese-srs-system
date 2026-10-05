# PHẦN 9: AUDIT CHI TIẾT PHÂN HỆ TIẾNG ANH HỌC THUẬT IELTS (IELTS MASTER SUITE - /ielts)

> **Mô đun kiểm thử & thiết kế**: Bảng điều khiển IELTS The Study, Phòng thi Examination Room, Bàn chấm thi The Tutor's Desk, Phân loại lỗi sai Root Cause Taxonomy, và Đồng bộ từ vựng sang FSRS Vault.  
> **Tập tin nguồn mục tiêu**:  
> - [src/app/ielts/page.tsx](file:///d:/project/japanese-srs-system/src/app/ielts/page.tsx) (217 dòng mã TSX)  
> - [src/app/ielts/session/page.tsx](file:///d:/project/japanese-srs-system/src/app/ielts/session/page.tsx) (452 dòng mã TSX)  
> - [src/app/ielts/review/page.tsx](file:///d:/project/japanese-srs-system/src/app/ielts/review/page.tsx) (659 dòng mã TSX)  
> **Mục tiêu chuyên môn**: Xóa bỏ dữ liệu giả lập (Mock hardcoding), kết nối trực tiếp bài thi Cambridge với CSDL SQLite/Turso, hiện thực hóa tính năng trích xuất từ vựng học thuật sang bộ thẻ FSRS Spaced Repetition, chuẩn hóa bộ đếm từ Writing Task 1 (150 từ) & Task 2 (250 từ), tích hợp trình phát âm thanh Listening chuẩn khảo thí, và dung hợp phong cách thiết kế British Academic với vẻ đẹp thanh lịch Wabi-Sabi.

---

## 9.1. BẢNG TỔNG HỢP KHIẾM KHUYẾT GIAO DIỆN TẠI IELTS MASTER SUITE

| Mã Khiếm Khuyết | Phân Loại | Vị Trí Thành Phần | Mức Độ | Tóm Tắt Khiếm Khuyết |
| :--- | :--- | :--- | :--- | :--- |
| `DEF-UI-IELTS-001` | **Sai / Lỗi kiến trúc** | FSRS Vault Sync Vaporware | **P0 (Tối khẩn)** | Chỉ số "128 Vocab Vault sẵn sàng đồng bộ" là văn bản tĩnh, không có nút bấm hay API lưu thẻ. |
| `DEF-UI-IELTS-002` | **Sai / Dữ liệu tĩnh** | Hardcoded Mock State | **P0 (Tối khẩn)** | Danh sách bài thi và 10 câu hỏi review bị viết tĩnh cứng; làm bài thi xong không cập nhật Dashboard. |
| `DEF-UI-IELTS-003` | **Xung đột thẩm mỹ** | Theme Inconsistency | **P1 (Cao)** | Giao diện British Border góc vuông xám xịt lệch tông hoàn toàn với thẩm mỹ Wabi-Sabi toàn hệ thống. |
| `DEF-UI-IELTS-004` | **Lỗi hiển thị** | 40-Question Sheet Mobile | **P1 (Cao)** | Lưới 40 ô nhập đáp án Listening/Reading bị ép dưới 40px, gây giật zoom trên iOS Safari. |
| `DEF-UI-IELTS-005` | **Thiếu** | Cambridge Listening Audio | **P1 (Cao)** | Phần thi Listening có đồng hồ đếm ngược 35 phút nhưng hoàn toàn không có trình phát audio track. |
| `DEF-UI-IELTS-006` | **Thiếu Ngữ Học** | Writing Penalty Counter | **P2 (Trung)** | Ô gõ Writing Task 1 & 2 chỉ đếm số từ, thiếu cảnh báo trừ điểm phạt nếu dưới 150/250 từ. |
| `DEF-UI-IELTS-007` | **Sai (Anti-pattern)** | Window Alert on Timeout | **P2 (Trung)** | Hết giờ làm bài gọi `window.alert('⏰ Hết giờ...')` chặn ngang trình duyệt làm đứt mạch cảm xúc. |
| `DEF-UI-IELTS-008` | **Thiếu** | Mistake Trend Radar | **P2 (Trung)** | Thiếu biểu đồ Pareto / Radar trực quan hóa 5 nhóm nguyên nhân lỗi sai qua từng cuốn Cambridge. |
| `DEF-UI-IELTS-009` | **Thiếu** | General vs Academic Rules | **P2 (Trung)** | Chuyển đổi General/Academic chỉ đổi nhãn text, không hiển thị quy đổi điểm thô sang Band Score khác biệt. |
| `DEF-UI-IELTS-010` | **Thiếu** | Export Session Report PDF | **P3 (Thấp)** | Không có nút xuất báo cáo chi tiết buổi thi (Session Diagnostic Report) để gửi giáo viên chấm bài. |

---

## 9.2. PHÂN TÍCH FORENSIC CHI TIẾT TỪNG KHIẾM KHUYẾT

### 9.2.1. DEF-UI-IELTS-001: Chỉ Số "FSRS Vocab Vault" Là Văn Bản Ảo Không Thể Đồng Bộ
* **Vị trí**: [src/app/ielts/page.tsx:102-112](file:///d:/project/japanese-srs-system/src/app/ielts/page.tsx#L102-L112), [src/app/ielts/review/page.tsx:102-120](file:///d:/project/japanese-srs-system/src/app/ielts/review/page.tsx#L102-L120).
* **Phân loại**: **Sai / Lỗi Kiến Trúc (Vaporware Interface & Broken Promise)**.
* **Mức độ nghiêm trọng**: **P0 (Tối khẩn - Tính năng giả lập)**.
* **Hiện trạng (As-Is)**:
  Tại Dashboard IELTS (`/ielts`), thẻ KPI thứ 4 ghi:
  ```tsx
  <div className="british-border" style={{ backgroundColor: '#FFFFFF', borderRadius: '8px' }}>
    <div style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase', fontWeight: 600 }}>
      FSRS Vocab Vault
    </div>
    <div style={{ fontSize: '3rem', color: '#047857', fontWeight: 'bold' }}>128</div>
    <div style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600 }}>
      Đã sẵn sàng đồng bộ sang Cards
    </div>
  </div>
  ```
  Tuy nhiên, trên toàn bộ trang `/ielts`, `/ielts/session`, và `/ielts/review`:
  - KHÔNG CÓ bất kỳ nút bấm nào có chữ "Đồng bộ" (Sync to Cards).
  - Không có API route `/api/ielts/sync-vocab`.
  - Mảng `vocabList` trích xuất trong trang review chỉ lưu trong `useState` cục bộ. Khi người học đóng tab, danh sách từ vựng học thuật cao cấp này biến mất hoàn toàn.
* **Tác động tâm lý & công thái học**:
  - Gây cảm giác bị lừa dối (Broken Expectation). Người học dành cả tiếng đồng hồ đọc bài Reading Cambridge, tra từ và ghi chú từ vựng mới vào kho, nhưng cuối cùng phát hiện dữ liệu không thể đưa vào lịch ôn tập hàng ngày.
* **Đề xuất khắc phục (To-Be)**:
  1. Xây dựng API route `/api/ielts/vocab` lưu trữ từ vựng vào bảng `cards` với `deck_id = 'deck_ielts_academic'` và `type = 'Vocab'`.
  2. Bổ sung nút bấm mạ vàng mộc bản: `[⚡ Đồng bộ 128 từ sang Bộ Thẻ FSRS]` trên Dashboard. Sau khi đồng bộ, các từ này sẽ xuất hiện trong hàng đợi ôn tập Karuta tại `/review?deck=deck_ielts_academic`.

---

### 9.2.2. DEF-UI-IELTS-002: Toàn Bộ Kết Quả Bài Thi Và Câu Hỏi Bị Viết Tĩnh Cứng (Mock Data Hardcoding)
* **Vị trí**: [src/app/ielts/page.tsx:18-29](file:///d:/project/japanese-srs-system/src/app/ielts/page.tsx#L18-L29), [src/app/ielts/review/page.tsx:69-80](file:///d:/project/japanese-srs-system/src/app/ielts/review/page.tsx#L69-L80).
* **Phân loại**: **Sai Dữ Liệu / Tách Rời Thực Thi (Mock Data Decoupling)**.
* **Mức độ nghiêm trọng**: **P0 (Tối khẩn)**.
* **Hiện trạng (As-Is)**:
  - Trang `/ielts` gán cứng 3 phiên học: `Cambridge IELTS 18 - Test 1` (Reading 32/40), `Cambridge IELTS 18 - Test 1` (Listening 30/40), `Cambridge IELTS 17 - Test 4` (Reading 28/40).
  - Khi người học vào `/ielts/session`, làm xong 40 câu và bấm nộp bài -> Hệ thống chỉ lưu tạm vào `localStorage.getItem('ielts_draft_...')`.
  - Trang `/ielts/review` hiển thị cứng mảng 10 câu mẫu `SAMPLE_QUESTIONS` của bài đọc, không đọc kết quả 40 câu mà người học vừa làm ở trang trước!
* **Tác động tâm lý & công thái học**:
  Làm đứt gãy hoàn toàn luồng trải nghiệm (Workflow Disconnect). Người học vừa làm bài thi Cambridge 18 Test 2, nhưng khi chuyển sang trang Review thì lại thấy hiển thị bài thi mẫu của người khác từ trước.
* **Đề xuất khắc phục (To-Be)**:
  1. Tạo repository `ieltsRepository.ts` và bảng CSDL `ielts_sessions`, `ielts_answers`, `ielts_mistakes`.
  2. Trang `/ielts/session` khi nộp bài gửi `POST /api/ielts/session` để lưu trữ vĩnh viễn và nhận lại `sessionId`.
  3. Tự động chuyển hướng tới `/ielts/review?sessionId=${sessionId}` để phân tích đúng 40 câu hỏi người học vừa làm.

---

### 9.2.3. DEF-UI-IELTS-003: Xung Đột Thẩm Mỹ Gay Gắt Với Ngôn Ngữ Thiết Kế Wabi-Sabi
* **Vị trí**: [src/app/ielts/page.tsx:32, 66, 116](file:///d:/project/japanese-srs-system/src/app/ielts/page.tsx#L32), [src/app/globals.css](file:///d:/project/japanese-srs-system/src/app/globals.css).
* **Phân loại**: **Xung đột thẩm mỹ (Aesthetic Incoherence & Visual Dissonance)**.
* **Mức độ nghiêm trọng**: **P1 (Cao)**.
* **Hiện trạng (As-Is)**:
  Trong khi toàn bộ hệ thống (Honmaru Dashboard, Shodo Desk, Karuta Arena, Bunbou Hub) được dày công trau chuốt theo phong cách Nhật Bản truyền thống Wa-Style (giấy Washi kem nhạt, hoa văn Asanoha mạ kim, phông chữ Shippori Mincho thanh thoát, màu son đỏ Bengara và xanh chàm Aizome), thì phân hệ IELTS đột ngột chuyển sang:
  - Class `.english-mode` với tông màu xám lạnh kiểu công sở phương Tây (`#F9FAFB`, viền `#E5E7EB`, phông chữ Times New Roman/Georgia cơ bản).
  - Các khối hộp vuông vức sắc nhọn kiểu Bootstrap (`.british-border`).
* **Tác động tâm lý & công thái học**:
  Tạo cảm giác chắp vá, giống như một dự án sinh viên gộp hai trang web không liên quan vào cùng một repository. Người học bị tụt giảm cảm xúc thẩm mỹ khi điều hướng giữa các phân hệ.
* **Đề xuất khắc phục (To-Be)**:
  Dung hợp phong cách **"British Academic Meets Wabi-Sabi Craftsmanship"** (Thư viện học thuật Oxford thời Victoria giao thoa cùng nghệ thuật mộc bản Nhật Bản):
  - Sử dụng nền giấy da bò cổ điển (Parchment Washi: `#F8F5EE`).
  - Đường viền mạ vàng mộc bản kết hợp xanh Oxford Blue hoàng gia (`#002147`) và đỏ rượu vang đỏ Burgundy (`#6B1724`).
  - Phông chữ tiêu đề học thuật sang trọng `Cinzel` hoặc `Playfair Display` phối hợp hài hòa với `Shippori Mincho`.

---

### 9.2.4. DEF-UI-IELTS-004: Lưới 40 Ô Nhập Đáp Án Bị Co Thắt Quá Mức Trên Màn Hình Di Động
* **Vị trí**: [src/app/ielts/session/page.tsx:249-350](file:///d:/project/japanese-srs-system/src/app/ielts/session/page.tsx#L249-L350).
* **Phân loại**: **Lỗi hiển thị & Responsive (Input Viewport Squeeze)**.
* **Mức độ nghiêm trọng**: **P1 (Cao)**.
* **Hiện trạng (As-Is)**:
  Phiếu trả lời 40 câu hỏi được chia thành 4 cột (mỗi cột 10 câu):
  ```tsx
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
  ```
  Trên màn hình điện thoại có chiều rộng 360px - 390px, lưới bị ép chia thành 4 cột, khiến bề rộng của mỗi ô nhập đáp án chỉ còn vỏn vẹn **35px - 45px**.
* **Tác động tâm lý & công thái học**:
  - Khi gõ đáp án dài như `economic crisis` hay `environmental protection`, văn bản bị cắt cụt hoàn toàn, chỉ nhìn thấy 2 ký tự đầu `ec...`.
  - Trên iOS Safari, ô input có cỡ chữ nhỏ hơn 16px sẽ tự động kích hoạt tính năng zoom màn hình (Auto-zoom Trigger), làm giao diện bị phóng to méo mó và người dùng phải dùng 2 ngón tay thu nhỏ lại sau mỗi câu điền.
* **Đề xuất khắc phục (To-Be)**:
  Sử dụng responsive grid:
  - Trên Desktop: 4 cột (1-10, 11-20, 21-30, 31-40).
  - Trên Tablet: 2 cột (1-20, 21-40).
  - Trên Mobile (< 640px): 1 cột duy nhất dạng Accordion chia theo 3 Passage (Passage 1: 1-13, Passage 2: 14-26, Passage 3: 27-40). Mỗi ô nhập đáp án có bề rộng tối thiểu 180px, hiển thị trọn vẹn cả cụm từ.

---

### 9.2.5. DEF-UI-IELTS-005: Phần Thi Listening Thiếu Trình Phát m Thanh Khảo Thí
* **Vị trí**: [src/app/ielts/session/page.tsx:17-18, 175-247](file:///d:/project/japanese-srs-system/src/app/ielts/session/page.tsx#L17-L247).
* **Phân loại**: **Thiếu Thành Phần Khảo Thí Cốt Lõi (Core Examination Media Void)**.
* **Mức độ nghiêm trọng**: **P1 (Cao)**.
* **Hiện trạng (As-Is)**:
  Khi chọn phần thi `Listening`, hệ thống thiết lập đồng hồ đếm ngược 35 phút và hiển thị 40 ô nhập đáp án. Tuy nhiên, trên toàn bộ màn hình KHÔNG HỀ CÓ trình phát âm thanh (Audio Player) để người học nghe bài nghe! Người học bắt buộc phải mở một ứng dụng nghe nhạc ngoài (YouTube hoặc MP3 player) để nghe song song.
* **Tác động tâm lý & công thái học**:
  - Không mô phỏng được quy chế thi IELTS thực tế: Bài nghe IELTS chuẩn chỉ được nghe duy nhất một lần (One-shot playback), không được dừng hoặc tua lại tùy tiện.
  - Người học phải liên tục Alt-Tab qua lại giữa trình duyệt và trình phát audio ngoài, làm mất tập trung cao độ.
* **Đề xuất khắc phục (To-Be)**:
  Tích hợp bộ điều khiển âm thanh khảo thí chuyên dụng (Exam Audio Controller):
  - Hỗ trợ tải file MP3 bài thi hoặc dán đường dẫn link audio bài thi Cambridge.
  - Cơ chế khóa nút tua (No-rewind Policy) mô phỏng chính xác áp lực phòng thi thật.
  - Tự động đồng bộ thời gian chạy audio với đồng hồ đếm ngược của phòng thi.

---

### 9.2.6. DEF-UI-IELTS-006: Bộ Đếm Từ Writing Thiếu Cảnh Báo Trừ Điểm Chiều Dài Tối Thiểu
* **Vị trí**: [src/app/ielts/session/page.tsx:117-119, 360-440](file:///d:/project/japanese-srs-system/src/app/ielts/session/page.tsx#L117-L119).
* **Phân loại**: **Thiếu Ngữ Học / Khuyết Tật Sư Phạm (Scoring Rule Ignorance)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Phần gõ bài luận Writing chỉ có một dòng chữ nhỏ: `Số từ: 120 từ`.
  Quy chế thi chính thức của Cambridge IELTS quy định rất nghiêm ngặt:
  - **Task 1**: Yêu cầu tối thiểu 150 từ (viết dưới 150 từ sẽ bị trừ trực tiếp điểm tiêu chí Task Achievement).
  - **Task 2**: Yêu cầu tối thiểu 250 từ (viết dưới 250 từ bị trừ nặng điểm Task Response).
  Giao diện hiện tại không hề có thanh chỉ thị mức độ đạt chuẩn hay cảnh báo khi bài viết chưa đạt ngưỡng an toàn.
* **Tác động tâm lý & công thái học**:
  Người học không hình dung được bài viết của mình đã đủ dài hay chưa, dẫn đến thói quen nộp bài thiếu từ khi thi thật.
* **Đề xuất khắc phục (To-Be)**:
  Thiết kế thước đo độ dài bài luận thông minh (Pacing Word Meter):
  - Dưới 150 từ (Task 1): Thanh đo màu đỏ cảnh báo `⚠️ 118 / 150 từ (Chưa đủ chiều dài tối thiểu, bị trừ điểm!)`.
  - Từ 150 - 180 từ: Thanh đo chuyển màu vàng kim `✓ 165 từ (Đạt chuẩn tối thiểu)`.
  - Trên 180 từ: Thanh đo chuyển màu xanh ngọc bích `✨ 185 từ (Độ dài lý tưởng)`.

---

### 9.2.7. DEF-UI-IELTS-007: Hết Giờ Làm Bài Gọi window.alert() Chặn Ngang Trình Duyệt
* **Vị trí**: [src/app/ielts/session/page.tsx:76](file:///d:/project/japanese-srs-system/src/app/ielts/session/page.tsx#L76).
* **Phân loại**: **Sai Nguyên Tắc Thiết Kế (Browser Modal Anti-Pattern)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Khi đồng hồ đếm ngược về 0:
  ```tsx
  alert(`⏰ Hết giờ làm bài phần ${section}!`);
  ```
  Hộp thoại xám của Windows đập thẳng vào mắt, làm kẹt màn hình và ngắt âm thanh.
* **Đề xuất khắc phục (To-Be)**:
  Tự động khóa toàn bộ các ô nhập dữ liệu (`disabled`), phát tiếng chuông hết giờ trang trọng của phòng thi học thuật (Academic Gong / Tower Bell), và hiển thị Modal chuyển tiếp thanh nhã: `"Thời gian làm bài đã kết thúc. Đang tự động lưu bài và lập phiếu chấm điểm..."`.

---

### 9.2.8. DEF-UI-IELTS-008: Thiếu Biểu Đồ Radar Phân Tích Xu Hướng Lỗi Sai Qua Từng Bài Thi
* **Vị trí**: [src/app/ielts/page.tsx:190-211](file:///d:/project/japanese-srs-system/src/app/ielts/page.tsx#L190-L211).
* **Phân loại**: **Thiếu (Diagnostic Visualization Void)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Bảng phân tích lỗi sai chỉ là danh sách văn bản phẳng liệt kê: `Distraction: 12 lỗi (35%)`, `Vocabulary: 9 lỗi (26%)`... Người học không thể nhìn thấy sự tiến bộ hay xu hướng lặp lại lỗi sai qua thời gian (ví dụ: bẫy Distraction đã giảm hay tăng so với tuần trước).
* **Đề xuất khắc phục (To-Be)**:
  Tích hợp biểu đồ Radar 5 trục hoặc biểu đồ cột xếp tầng phân tích 5 nguyên nhân gốc rễ (Root Cause Taxonomy), giúp người học nhận ra điểm yếu chí tử cần khắc phục trước ngày thi.

---

### 9.2.9. DEF-UI-IELTS-009: Thiếu Minh Bạch Bảng Quy Đổi Điểm Thô Sang Band Score
* **Vị trí**: [src/app/ielts/review/page.tsx:22-67](file:///d:/project/japanese-srs-system/src/app/ielts/review/page.tsx#L22-L67).
* **Phân loại**: **Thiếu (Scoring Transparency Void)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Hàm `calculateBand` thực hiện tính toán ngầm. Người học chỉ nhìn thấy con số cuối cùng: `Band 7.5`. Họ không thể xem bảng đối chiếu để biết nếu mình đúng thêm 1 câu nữa (33 câu thay vì 32 câu) thì có nhảy lên được Band 8.0 hay không.
* **Đề xuất khắc phục (To-Be)**:
  Bổ sung thanh trượt tương tác (Interactive Band Scale Slider): Kéo điểm thô từ 1 đến 40 để xem ngay Band Score tương ứng và khoảng cách tới mục tiêu kế tiếp.

---

### 9.2.10. DEF-UI-IELTS-010: Thiếu Nút Xuất Báo Cáo Chẩn Đoán Buổi Thi (Diagnostic PDF Export)
* **Vị trí**: [src/app/ielts/review/page.tsx:247-280](file:///d:/project/japanese-srs-system/src/app/ielts/review/page.tsx#L247-L280).
* **Phân loại**: **Thiếu (Academic Artifact Export Gap)**.
* **Mức độ nghiêm trọng**: **P3 (Thấp)**.
* **Hiện trạng (As-Is)**:
  Sau khi hoàn thành buổi thi và phân tích lỗi sai, người học không có cách nào xuất toàn bộ dữ liệu này ra file PDF hoặc bảng in ấn đẹp mắt để nộp cho giáo viên dạy kèm (IELTS Tutor) xem xét.
* **Đề xuất khắc phục (To-Be)**:
  Bổ sung nút `[📄 Xuất Báo Cáo Chẩn Đoán PDF]` định dạng phong cách học thuật Oxford chuẩn chỉnh.

---

## 9.3. BẢNG MA TRẬN ĐỐI CHIẾU TRẠNG THÁI AS-IS VÀ TO-BE (IELTS SUITE)

| Tiêu Chí Đánh Giá | Hiện Trạng (As-Is) | Thiết Kế Mục Tiêu Sau Khi Khắc Phục (To-Be) |
| :--- | :--- | :--- |
| **Đồng bộ FSRS Vocab** | Dòng chữ tĩnh "128 từ sẵn sàng", không có nút bấm. | Nút đồng bộ tức thì sang CSDL FSRS Cards; ôn tập tại `/review`. |
| **Lưu trữ phiên thi** | Dữ liệu giả định trong code; làm bài xong không lưu DB. | Lưu CSDL vĩnh viễn qua `ieltsRepository`; biểu đồ cập nhật realtime. |
| **Phong cách giao diện** | British Border xám xịt lệch tông thẩm mỹ hệ thống. | Phong cách "Oxford Academic meets Wabi-Sabi" thanh lịch quý phái. |
| **Phiếu trả lời 40 câu** | Bị nén dưới 40px trên di động, giật zoom iOS. | Chia theo Passage linh hoạt; ô nhập rộng tối thiểu 180px mượt mà. |
| **m thanh Listening** | Hoàn toàn không có trình phát bài nghe. | Exam Audio Player chuyên dụng với chính sách khóa tua chuẩn kỳ thi. |
| **Kiểm soát độ dài Writing** | Chỉ đếm số từ khô khan. | Thước đo thông minh cảnh báo phạt điểm nếu dưới 150/250 từ. |
| **Xử lý hết giờ** | Gọi `window.alert()` chặn đứng trình duyệt. | Tự động khóa bài, tiếng chuông đồng hồ tháp và modal chuyển tiếp. |

---

## 9.4. CHECKLIST NGHIỆM THU IELTS MASTER SUITE (VERIFICATION CHECKLIST)
- [ ] Bấm nút "Đồng bộ từ vựng sang FSRS" -> 128 từ học thuật lập tức xuất hiện trong bộ thẻ `/cards`.
- [ ] Hoàn thành một bài thi Reading 40 câu -> Dữ liệu điểm số và câu trả lời được ghi nhận ngay vào SQLite/Turso.
- [ ] Mở phiếu trả lời trên điện thoại 375px -> Ô nhập đáp án rộng rãi, gõ không bị kích hoạt Auto-zoom.
- [ ] Chọn bài thi Listening -> Xuất hiện trình phát bài nghe chính thức, chạy đồng bộ với đồng hồ đếm ngược.
- [ ] Gõ bài Writing Task 2 được 210 từ -> Thanh đo hiển thị cảnh báo đỏ `Cần thêm 40 từ để đạt chuẩn 250 từ`.
- [ ] Hết giờ thi -> Giao diện khóa tự động mượt mà, không xuất hiện hộp thoại `window.alert()`.


---

### 9.5 PHÂN TÍCH TOÁN HỌC BIỂU ĐỒ RADAR 4 TIÊU CHÍ IELTS & CÔNG THÁI HỌC BÀI THI NÓI (SPEAKING LAB)

#### 1. Mô hình Biểu đồ Radar 4 Trục Chi tiết cho Kỹ năng Writing & Speaking
* **Bản chất của điểm thi IELTS**:
  - Điểm tổng của bài thi IELTS Writing và Speaking không phải là một con số ngẫu nhiên mà là trung bình cộng số học của đúng 4 tiêu chí khắt khe:
    1. **TR / TA (Task Response / Task Achievement)**: Trả lời đúng trọng tâm đề tài.
    2. **CC (Coherence & Cohesion)**: Tính mạch lạc và liên kết logic của các câu, đoạn.
    3. **LR (Lexical Resource)**: Sự phong phú và độ chính xác của vốn từ vựng học thuật.
    4. **GRA (Grammatical Range & Accuracy)**: Độ đa dạng của cấu trúc ngữ pháp và mức độ không phạm lỗi ngữ pháp.
* **Hiện trạng thiếu sót trong giao diện `/ielts/writing` và `/ielts/speaking`**:
  - Giao diện hiện tại chỉ đưa ra một điểm số chung chung duy nhất: `Band 6.5` kèm vài dòng nhận xét văn bản thô sơ.
  - Người học hoàn toàn mù mờ không biết 6.5 này đến từ việc từ vựng quá kém (LR 5.0) nhưng ngữ pháp tốt (GRA 7.5), hay ngược lại. Điều này triệt tiêu hoàn toàn khả năng can thiệp ôn tập có chủ đích (Targeted Practice).
* **Công thức toán học tính tọa độ SVG đa giác cho Biểu đồ Radar 4 Trục**:
  - Cho 4 giá trị điểm $S = [s_{\text{TR}}, s_{\text{CC}}, s_{\text{LR}}, s_{\text{GRA}}]$ với $0 \le s_i \le 9.0$.
  - Góc của 4 trục trên mặt phẳng tọa độ Descartes:
    $$\alpha_i = \frac{\pi}{2} - i \cdot \frac{\pi}{2} = \left[ \frac{\pi}{2}, 0, -\frac{\pi}{2}, \pi \right]$$
  - Tọa độ đỉnh đa giác tương ứng với tâm $(x_0, y_0)$ và bán kính tối đa $R$:
    $$x_i = x_0 + \left( \frac{s_i}{9.0} \cdot R \right) \cos(\alpha_i), \quad y_i = y_0 - \left( \frac{s_i}{9.0} \cdot R \right) \sin(\alpha_i)$$
  - Đa giác kết quả được vẽ bằng thẻ `<polygon points="..." />` với màu mực Aizome trong suốt 25% kèm viền chỉ vàng Kin-cha, mang lại cái nhìn phân tích chuyên nghiệp tương đương phần mềm khảo thí Cambridge chính thức.

#### 2. Công thái học Bài thi Nói: Biểu diễn Dạng sóng Thời gian thực (Acoustic Waveform) & Bộ đếm Ngưng thở
* **Tâm lý học căng thẳng trong phòng thi nói (Speaking Anxiety)**:
  - Khi đối diện với một máy ghi âm hoặc giao diện khảo thí trực tuyến, người học thường rơi vào trạng thái hoảng loạn vì không biết giọng nói của mình có đang được hệ thống ghi nhận đúng mức âm lượng hay không.
  - Nếu giao diện chỉ hiển thị một chấm tròn đỏ nhấp nháy tĩnh, người học sẽ có xu hướng nói quá to hoặc ghé sát micro, gây méo tiếng và vỡ tín hiệu (Audio Clipping).
* **Giải pháp trực quan hóa âm học**:
  - Tích hợp một thành phần hiển thị sóng âm thanh thực tế sử dụng `AnalyserNode` của Web Audio API:
    ```tsx
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);
    // Vẽ đồ thị thanh tần số bằng 24 vệt mực thư pháp lượn sóng
    ```
  - Bổ sung chỉ số **Pacing Indicator (Chỉ số Tốc độ Lời nói)**: Đo lường số từ phát ra trên mỗi phút (Words Per Minute - WPM).
    - Tốc độ chuẩn bản xứ của giám khảo IELTS: **130 - 150 WPM**.
    - Nếu người học nói quá nhanh (>180 WPM): Cảnh báo màu vàng `⚠️ Quá nhanh! Nói chậm lại để giữ vững phát âm và ngữ điệu rõ ràng`.
    - Nếu có khoảng lặng ngập ngừng kéo dài quá 3 giây: Hiển thị gợi ý cấu trúc nối câu tinh tế: `💡 Dùng từ đệm: 'Well, looking at it from another perspective...'`.

#### 3. Bổ sung Bộ chuyển đổi Bảng quy đổi Điểm CEFR Tương thích Toàn cầu
* Người học ngoại ngữ đa năng thường có nhu cầu đối chiếu năng lực tiếng Nhật và tiếng Anh.
* Giao diện cần hiển thị thanh trượt liên thông quy đổi tương đương:
  - IELTS 4.0 - 5.0 $\Leftrightarrow$ CEFR B1 $\Leftrightarrow$ JLPT N3
  - IELTS 5.5 - 6.5 $\Leftrightarrow$ CEFR B2 $\Leftrightarrow$ JLPT N2
  - IELTS 7.0 - 8.5 $\Leftrightarrow$ CEFR C1 $\Leftrightarrow$ JLPT N1
  - IELTS 9.0 $\Leftrightarrow$ CEFR C2 $\Leftrightarrow$ Bản xứ / Thông dịch viên cấp cao.

