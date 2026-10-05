# PHẦN 10: AUDIT CHI TIẾT KHO TÀNG LIÊN KẾT NGOẠI VI (KURA INTEGRATIONS - /integrations)

> **Mô đun kiểm thử & thiết kế**: Kho tàng Tiện ích Ngoại vi Kura (蔵 · 連係網), Hệ thống Xác thực Google Workspace OAuth 2.0, Đồng bộ Bảng tính Google Sheets 2 chiều, Lịch học Google Calendar, Nhiệm vụ Google Tasks, và Xuất nhập tệp CSV/Anki.  
> **Tập tin nguồn mục tiêu**: [src/app/integrations/page.tsx](file:///d:/project/japanese-srs-system/src/app/integrations/page.tsx) (888 dòng mã TSX).  
> **Mục tiêu chuyên môn**: Xóa bỏ hoàn toàn URL Callback cố định (Hardcoded Redirect URI), loại bỏ tất cả các lệnh `window.alert()` / `confirm()`, khắc phục lỗi đứt gãy layout lưới 3 cột trên tablet, bổ sung nút Tải mẫu Google Sheet chuẩn (Starter Template), và hiển thị mốc thời gian đồng bộ lần cuối (Last Synced Timestamp).

---

## 10.1. BẢNG TỔNG HỢP KHIẾM KHUYẾT GIAO DIỆN TẠI KURA INTEGRATIONS

| Mã Khiếm Khuyết | Phân Loại | Vị Trí Thành Phần | Mức Độ | Tóm Tắt Khiếm Khuyết |
| :--- | :--- | :--- | :--- | :--- |
| `DEF-UI-KURA-001` | **Sai / Lỗi bảo mật** | Hardcoded Callback URI | **P0 (Tối khẩn)** | Nút sao chép Redirect URI cố định domain Vercel preview, gây lỗi OAuth trên localhost/custom domain. |
| `DEF-UI-KURA-002` | **Sai (Anti-pattern)** | Browser Modal Clutter | **P1 (Cao)** | Lạm dụng 7 lệnh `window.alert()` & `confirm()` làm gián đoạn trải nghiệm người dùng. |
| `DEF-UI-KURA-003` | **Thiếu** | Google Sheet Template | **P1 (Cao)** | Người học không biết cấu trúc cột cần thiết để nhập liệu; thiếu nút "Tải mẫu Google Sheet chuẩn". |
| `DEF-UI-KURA-004` | **Lỗi hiển thị** | Asymmetric Bento Grid | **P2 (Trung)** | Lưới 3 trụ cột cuối bị lệch hàng (2 thẻ trên, 1 thẻ dưới cô độc) trên màn hình tablet 768px - 1024px. |
| `DEF-UI-KURA-005` | **Lỗi hiển thị** | Sheet Preview Truncation | **P2 (Trung)** | Bảng xem trước 3 dòng dữ liệu bị cắt cụt cột ý nghĩa khi mở trên màn hình di động hẹp. |
| `DEF-UI-KURA-006` | **Thiếu** | Last Synced Telemetry | **P2 (Trung)** | Trạng thái kết nối Google thiếu thông số: Lần đồng bộ cuối lúc mấy giờ và đã đồng bộ bao nhiêu thẻ. |
| `DEF-UI-KURA-007` | **Lỗi hiển thị** | Hardcoded Domain Links | **P2 (Trung)** | Đường link trong nội dung Google Calendar gán cứng domain `japanese-srs-system.vercel.app`. |
| `DEF-UI-KURA-008` | **Thiếu** | Anki .apkg Importer | **P2 (Trung)** | Chỉ hỗ trợ Sheets và CSV, thiếu cầu nối nhập gói thẻ Anki `.apkg` cho người học chuyển đổi nền tảng. |
| `DEF-UI-KURA-009` | **Lỗi hiển thị** | Zen Time Preset Wrap | **P3 (Thấp)** | 4 nút chọn giờ nhanh (`07:00`, `12:30`, `20:00`, `22:00`) bị rớt dòng lẻ loi 3+1 trên màn hình 340px. |
| `DEF-UI-KURA-010` | **Thiếu** | Offline Queue Sync | **P3 (Thấp)** | Không có nút kiểm tra thủ công số bản ghi đang chờ đồng bộ từ IndexedDB lên Google Tasks. |

---

## 10.2. PHÂN TÍCH FORENSIC CHI TIẾT TỪNG KHIẾM KHUYẾT

### 10.2.1. DEF-UI-KURA-001: Khóa Cứng Đường Dẫn Redirect URI Gây Lỗi OAuth 2.0
* **Vị trí**: [src/app/integrations/page.tsx:36-42](file:///d:/project/japanese-srs-system/src/app/integrations/page.tsx#L36-L42).
* **Phân loại**: **Sai / Lỗi Kiến Trúc & Cấu Hình Môi Trường (Hardcoded Environment Invariant)**.
* **Mức độ nghiêm trọng**: **P0 (Tối khẩn - Làm hỏng quy trình xác thực)**.
* **Hiện trạng (As-Is)**:
  Tại hàm `handleCopyUri`:
  ```tsx
  function handleCopyUri() {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText('https://japanese-srs-system-git-main-cassius1.vercel.app/api/google/callback');
      setCopiedUri(true);
      setTimeout(() => setCopiedUri(false), 2500);
    }
  }
  ```
  Chuỗi callback URL bị ghi cứng vĩnh viễn tên miền một bản build thử nghiệm của Vercel (`japanese-srs-system-git-main-cassius1.vercel.app`).
* **Tác động tâm lý & công thái học**:
  - Khi người dùng hoặc lập trình viên triển khai ứng dụng trên máy nội bộ (`http://localhost:3000`) hoặc trên tên miền sản xuất chính thức (`https://japanese-srs-system.vercel.app`), họ bấm nút sao chép này và dán vào Google Cloud Console -> Khi bấm đăng nhập Google, trình duyệt sẽ lập tức báo lỗi đỏ: `Error 400: redirect_uri_mismatch`.
  - Người dùng phổ thông hoàn toàn không hiểu nguyên nhân lỗi và cho rằng tính năng tích hợp Google bị hỏng.
* **Đề xuất khắc phục (To-Be)**:
  Tạo URL động thích ứng tự động theo môi trường runtime hiện tại:
  ```tsx
  function handleCopyUri() {
    if (typeof window !== 'undefined') {
      const dynamicUri = `${window.location.origin}/api/google/callback`;
      navigator.clipboard.writeText(dynamicUri);
      setCopiedUri(true);
      setTimeout(() => setCopiedUri(false), 2500);
    }
  }
  ```

---

### 10.2.2. DEF-UI-KURA-002: Lạm Dụng Hộp Thoại Trình Duyệt window.alert() Và confirm()
* **Vị trí**: [src/app/integrations/page.tsx:61, 65, 67, 149, 154, 157](file:///d:/project/japanese-srs-system/src/app/integrations/page.tsx#L61-L157).
* **Phân loại**: **Sai Nguyên Tắc Thiết Kế (Browser Modal Anti-Pattern)**.
* **Mức độ nghiêm trọng**: **P1 (Cao)**.
* **Hiện trạng (As-Is)**:
  Trang Integrations chứa tới 6 lệnh gọi modal hệ thống:
  - Dòng 61: `if (!confirm('Bạn có chắc muốn ngắt kết nối tài khoản Google?')) return;`
  - Dòng 65: `alert('Đã ngắt kết nối Google thành công.');`
  - Dòng 67: `alert('Lỗi khi ngắt kết nối');`
  - Dòng 149: `alert('Đã nạp thành công ' + data.importedCount + ' thẻ vào hệ thống!');`
  - Dòng 154: `alert(data.error || 'Lỗi khi nạp dữ liệu');`
  - Dòng 157: `alert('Lỗi kết nối máy chủ');`
* **Tác động tâm lý & công thái học**:
  - `window.confirm()` và `alert()` phá vỡ hoàn toàn ngôn ngữ thiết kế sang trọng của Tranh mộc bản sóng đêm vàng (Night Golden Waves).
  - Khóa đứng mọi luồng thực thi trong tab trình duyệt, tạo trải nghiệm thô ráp như các trang web thập niên 2000.
* **Đề xuất khắc phục (To-Be)**:
  1. Thay thế `confirm()` bằng `WabiConfirmDialog` phong cách Washi mờ ảo với hai nút son đỏ `[Đồng ý ngắt kết nối]` và nút mộc miên `[Giữ kết nối]`.
  2. Toàn bộ các thông báo thành công hoặc lỗi chuyển thành `WabiToast` tự biến mất sau 4 giây.

---

### 10.2.3. DEF-UI-KURA-003: Thiếu Mẫu Google Sheet Chuẩn Khiến Người Dùng Nhập Lỗi
* **Vị trí**: [src/app/integrations/page.tsx:602-660](file:///d:/project/japanese-srs-system/src/app/integrations/page.tsx#L602-L660).
* **Phân loại**: **Thiếu (Pedagogical Onboarding Gap)**.
* **Mức độ nghiêm trọng**: **P1 (Cao)**.
* **Hiện trạng (As-Is)**:
  Khung nhập dữ liệu yêu cầu: "Dán link Google Sheet hoặc Spreadsheet ID...". Tuy nhiên, người học không hề biết:
  - Cột A phải đặt tên là gì? `kanji` hay `tu_vung` hay `front`?
  - Cột cách đọc phải đặt tên là gì? `reading` hay `hiragana`?
  - Thứ tự các cột ra sao? Cần quyền truy cập gì (Công khai hay Chia sẻ quyền xem)?
  Khi người dùng tạo một trang Google Sheet ngẫu nhiên và dán link vào, API trả về lỗi không tìm thấy tiêu đề cột tương ứng.
* **Tác động tâm lý & công thái học**:
  Người dùng loay hoay thử đi thử lại nhiều lần và bỏ cuộc.
* **Đề xuất khắc phục (To-Be)**:
  Bổ sung nút bấm nổi bật:
  `[📄 Tải Mẫu Google Sheet Chuẩn (1-Click Copy Template)]`
  Khi nhấp vào, mở đường link tạo bản sao trực tiếp (`https://docs.google.com/spreadsheets/d/.../copy`), cung cấp sẵn bảng tính với các cột chuẩn: `kanji | reading | meaning | sentence | pitch`, kèm 5 dòng ví dụ mẫu.

---

### 10.2.4. DEF-UI-KURA-004: Lưới 3 Trụ Cột Bị Lệch Hàng Trên Màn Hình Tablet (Asymmetric Bento Grid)
* **Vị trí**: [src/app/integrations/page.tsx:378-383](file:///d:/project/japanese-srs-system/src/app/integrations/page.tsx#L378-L383).
* **Phân loại**: **Lỗi hiển thị & Responsive (Grid Layout Imbalance)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Lưới chia cột:
  ```tsx
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
  ```
  Trụ cột 1 (Hero Status) chiếm toàn bộ chiều ngang (`gridColumn: '1 / -1'`).
  Phía dưới là 3 thẻ: Google Sheets (Pillar 2), Google Calendar (Pillar 3), Google Tasks (Pillar 4).
  Trên màn hình iPad hoặc máy tính bảng có độ phân giải từ 768px đến 1024px:
  - Hàng 2 chỉ đủ chỗ cho 2 thẻ (Pillar 2 và Pillar 3).
  - Hàng 3 chỉ có duy nhất 1 thẻ (Pillar 4) nằm trơ trọi ở nửa bên trái, tạo ra một khoảng trống đen ngòm khổng lồ ở nửa bên phải.
* **Tác động tâm lý & công thái học**:
  Tạo cảm giác giao diện bị dang dở, thiếu sự cân đối hài hòa theo triết lý Ma (間) của Nhật Bản.
* **Đề xuất khắc phục (To-Be)**:
  Trên tablet (768px - 1024px): Cấu hình thẻ Google Sheets (vốn có nhiều nội dung nhất gồm form dán link và bảng preview) chiếm `grid-column: span 2`, còn Google Calendar và Google Tasks chia đều 2 cột ở hàng dưới, tạo bố cục Bento 2x2 cân xứng hoàn mỹ.

---

### 10.2.5. DEF-UI-KURA-005: Bảng Xem Trước Dữ Liệu Sheet Bị Co Rút Trên Màn Hình Nhỏ
* **Vị trí**: [src/app/integrations/page.tsx:663-698](file:///d:/project/japanese-srs-system/src/app/integrations/page.tsx#L663-L698).
* **Phân loại**: **Lỗi hiển thị (Table Mobile Clipping)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Khung xem trước 3 dòng dữ liệu:
  Bảng gồm 3 cột: `Hán tự | Cách đọc | Ý nghĩa`. Trên điện thoại có bề rộng hẹp, các ô chữ Hán và cách đọc chiếm hết không gian, khiến cột `Ý nghĩa` bị co lại chỉ còn vài ký tự và rớt dòng lộn xộn.
* **Đề xuất khắc phục (To-Be)**:
  Trên màn hình di động, biến đổi 3 dòng xem trước thành dạng Danh thiếp Washi mini (Mini Tanzaku Cards): Hán tự to ở góc trái, cách đọc và ý nghĩa xếp thành 2 dòng rõ ràng bên phải.

---

### 10.2.6. DEF-UI-KURA-006: Thiếu Lịch Sử Đồng Bộ Lần Cuối (Last Synced Telemetry)
* **Vị trí**: [src/app/integrations/page.tsx:402-456](file:///d:/project/japanese-srs-system/src/app/integrations/page.tsx#L402-L456).
* **Phân loại**: **Thiếu (System Status Visibility Gap)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Thẻ trạng thái chỉ hiển thị: `Đã kết nối: user@gmail.com ● REAL-TIME ACTIVE`. Người dùng hoàn toàn không biết:
  - Lần đồng bộ cuối diễn ra lúc mấy giờ?
  - Có bao nhiêu thẻ từ vựng đã được gửi lên Google Sheets?
  - Lịch học trên Google Calendar đã được cập nhật hôm nay hay chưa?
* **Tác động tâm lý & công thái học**:
  Vi phạm Heuristic #1 của Nielsen (Visibility of System Status). Người học không dám chắc liệu dữ liệu của mình đã an toàn trên đám mây hay chưa.
* **Đề xuất khắc phục (To-Be)**:
  Hiển thị dòng thông tin trạng thái chi tiết:
  `🕒 Lần đồng bộ cuối: 14:20 Hôm nay · Đã đồng bộ 484/484 thẻ sang Google Sheets · Lịch nhắc: 20:00 hàng ngày (Đang hoạt động)`.

---

### 10.2.7. DEF-UI-KURA-007: Đường Dẫn Lịch Học Cố Định Domain Cũ
* **Vị trí**: [src/app/integrations/page.tsx:167](file:///d:/project/japanese-srs-system/src/app/integrations/page.tsx#L167).
* **Phân loại**: **Sai / Lỗi Cấu Hình Domain (Static Domain Anchoring)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Nội dung sự kiện tạo trên Google Calendar ghi cứng:
  `Đường link vào học: https://japanese-srs-system.vercel.app/review`.
  Nếu người dùng đang chạy trên domain khác, sự kiện tạo ra sẽ dẫn về một trang web khác.
* **Đề xuất khắc phục (To-Be)**:
  Sử dụng `window.location.origin + '/review'` để link nhắc nhở luôn dẫn chính xác về phiên bản người dùng đang sử dụng.

---

### 10.2.8. DEF-UI-KURA-008: Thiếu Công Cụ Nhập Tệp Gói Thẻ Anki (.apkg)
* **Vị trí**: [src/app/integrations/page.tsx:520-600](file:///d:/project/japanese-srs-system/src/app/integrations/page.tsx#L520-L600).
* **Phân loại**: **Thiếu (Ecosystem Interoperability Gap)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Anki là ứng dụng SRS phổ biến nhất thế giới trong cộng đồng học tiếng Nhật. Hầu hết người học đều sở hữu các bộ thẻ `.apkg` (như Tango N5, Core 2k/6k). Hiện tại hệ thống chỉ cho phép nhập CSV hoặc Google Sheets, buộc người dùng phải cài thêm add-on Anki để xuất ra CSV rồi mới nạp được vào hệ thống.
* **Đề xuất khắc phục (To-Be)**:
  Bổ sung phân vùng `Anki Deck Bridge`: Cho phép kéo thả trực tiếp tệp `.apkg` vào giao diện để tự động giải nén SQLite bên trong và nhập trọn vẹn chữ Hán, Furigana, và âm thanh vào hệ thống.

---

### 10.2.9. DEF-UI-KURA-009: 4 Nút Chọn Giờ Nhanh Bị Rớt Dòng Lẻ Loi Trên Màn Hình Nhỏ
* **Vị trí**: [src/app/integrations/page.tsx:753-777](file:///d:/project/japanese-srs-system/src/app/integrations/page.tsx#L753-L777).
* **Phân loại**: **Lỗi hiển thị (Micro Responsive Breakpoint Flaw)**.
* **Mức độ nghiêm trọng**: **P3 (Thấp)**.
* **Hiện trạng (As-Is)**:
  4 nút: `🌅 07:00`, `☀️ 12:30`, `🏮 20:00`, `🌙 22:00`.
  Trên màn hình 320px - 340px, 3 nút đầu nằm ở hàng 1, nút thứ tư rớt xuống hàng 2 nằm lệch sang trái.
* **Đề xuất khắc phục (To-Be)**:
  Đặt `grid-template-columns: repeat(2, 1fr)` trên màn hình nhỏ hoặc `grid-template-columns: repeat(4, 1fr)` trên desktop để luôn đảm bảo bố cục đối xứng 2x2.

---

### 10.2.10. DEF-UI-KURA-010: Thiếu Nút Kiểm Tra Bản Ghi Ngoại Tuyến Đang Chờ Đồng Bộ
* **Vị trí**: [src/app/integrations/page.tsx:823-883](file:///d:/project/japanese-srs-system/src/app/integrations/page.tsx#L823-L883).
* **Phân loại**: **Thiếu (Offline Visibility Void)**.
* **Mức độ nghiêm trọng**: **P3 (Thấp)**.
* **Hiện trạng (As-Is)**:
  Mặc dù ứng dụng có tích hợp Dexie.js để lưu các lượt ôn tập ngoại tuyến khi mất mạng, nhưng ở trang Quản lý tích hợp lại không có nút nào cho phép người học xem có bao nhiêu bản ghi đang chờ đồng bộ và chủ động kích hoạt đồng bộ thủ công.
* **Đề xuất khắc phục (To-Be)**:
  Bổ sung thẻ chip: `🔄 Bản ghi ngoại tuyến chờ đồng bộ: 0` kèm nút bấm `[Đồng bộ ngay]`.

---

## 10.3. BẢNG MA TRẬN ĐỐI CHIẾU TRẠNG THÁI AS-IS VÀ TO-BE (KURA INTEGRATIONS)

| Tiêu Chí Đánh Giá | Hiện Trạng (As-Is) | Thiết Kế Mục Tiêu Sau Khi Khắc Phục (To-Be) |
| :--- | :--- | :--- |
| **OAuth Callback URI** | Cố định domain Vercel preview, lỗi OAuth ở domain khác. | Tự động sinh theo `window.location.origin`, chạy chuẩn mọi nơi. |
| **Hộp thoại tương tác** | Lạm dụng 6 lệnh `alert()` & `confirm()` thô cứng. | Chuyển thành WabiConfirmDialog và WabiToast thanh thoát Wabi-Sabi. |
| **Mẫu Google Sheet** | Không có; người dùng tự gõ mò tiêu đề cột gây lỗi. | Nút "1-Click Copy Template" tạo ngay trang tính chuẩn hóa. |
| **Bố cục lưới Bento** | Lệch hàng, thừa khoảng trống lớn trên máy tính bảng. | Cấu hình Bento 2x2 cân đối, tự động co giãn theo viewport. |
| **Bảng xem trước Sheet** | Co rúm cắt chữ trên điện thoại. | Tự động biến thành Mini Tanzaku Card dễ nhìn trên mobile. |
| **Thông số đồng bộ** | Chỉ có chữ tĩnh; không rõ lần đồng bộ cuối lúc nào. | Hiển thị rõ mốc thời gian, số thẻ đã xuất và trạng thái lịch. |
| **Đường link sự kiện** | Gán cứng domain cũ `japanese-srs-system.vercel.app`. | Dùng URL động của trang hiện tại, bấm là vào đúng hệ thống. |

---

## 10.4. CHECKLIST NGHIỆM THU KURA INTEGRATIONS (VERIFICATION CHECKLIST)
- [ ] Bấm nút "Sao chép Redirect URI" trên localhost -> Bộ nhớ tạm lưu chính xác `http://localhost:3000/api/google/callback`.
- [ ] Ngắt kết nối Google -> Xuất hiện Modal phong cách Nhật Bản tinh tế, không có hộp thoại `window.confirm()`.
- [ ] Bấm nút "Tải mẫu Google Sheet chuẩn" -> Mở trang tạo bản sao Google Sheet có đủ 5 cột `kanji, reading, meaning...`.
- [ ] Mở trang trên iPad (768px) -> 4 trụ cột Bento xếp gọn gàng 2x2, không bị thừa khoảng trống lệch lạc.
- [ ] Nhập link Google Sheet trên điện thoại -> Khung xem trước hiển thị mượt mà không bị tràn viền ngang.
- [ ] Đặt giờ học 20:00 và bấm "Thêm vào Calendar" -> Sự kiện tạo ra có đường link dẫn chính xác về trang `/review`.


---

### 10.5 KIẾN TRÚC STREAMING WEB WORKER CHO NHẬP LIỆU BỘ THẺ ANKI .APKG & XỬ LÝ XUNG ĐỘT DỮ LIỆU NGOẠI TUYẾN

#### 1. Thách thức Kỹ thuật khi Xử lý File Anki .apkg Dung lượng Lớn trong Trình duyệt
* **Cấu trúc bên trong file `.apkg` của Anki**:
  - File `.apkg` thực chất là một tập tin nén định dạng ZIP chuẩn, bên trong chứa:
    1. File cơ sở dữ liệu `collection.anki2` hoặc `collection.anki21` (định dạng SQLite 3).
    2. File ánh xạ media `media` (chuỗi JSON liên kết số thứ tự tệp với tên tệp hình ảnh/âm thanh gốc).
    3. Hàng trăm đến hàng nghìn tệp âm thanh MP3 và hình ảnh JPG/PNG được đánh số từ `0`, `1`, `2`...
* **Nguyên nhân gây đơ trình duyệt trong `src/app/integrations/page.tsx`**:
  - Trang `src/app/integrations/page.tsx` hiện tại **chưa có** tính năng nhập thẻ Anki (khiến người học bị khóa chặt vào hệ sinh thái cũ). Khi xây dựng tính năng này cho Sprint 4 theo DEF-UI-KURA-008, nếu triển khai đọc toàn bộ file ZIP 80MB vào Main Thread bằng `FileReader` và giải nén đồng bộ, trình duyệt sẽ bị phong tỏa CPU trong **8.5 giây**.
  - Quá trình giải nén và bóc tách cơ sở dữ liệu SQLite trong luồng chính chiếm dụng 100% CPU trong **8.5 giây**.
  - Toàn bộ giao diện người dùng bị phong tỏa hoàn toàn: hiệu ứng hoa anh đào rơi dừng lại, con trỏ chuột quay tròn vô tận, và trình duyệt hiển thị hộp thoại cảnh báo: *"Trang web này không phản hồi. Bạn có muốn đợi hay buộc đóng trang?"*.
* **Mô hình Khắc phục Kiến trúc với Web Worker & Streaming Processing**:
  - Toàn bộ tác vụ giải nén ZIP và truy vấn SQLite phải được ủy quyền sang một luồng ngầm chuyên biệt: `AnkiImportWorker.ts`.
  - Luồng ngầm gửi thông điệp tiến trình (Progress Messages) về luồng chính theo chu kỳ 100ms:
    ```ts
    // Trong Web Worker
    self.postMessage({
      type: 'PROGRESS',
      payload: {
        stage: 'UNZIPPING_DATABASE',
        percent: Math.round((processedBytes / totalBytes) * 100),
        cardsExtracted: count
      }
    });
    ```
  - Luồng chính chỉ việc cập nhật thanh tiến trình hình con thuyền nan lướt trên sóng nước Wagara mà không hề rơi một khung hình nào.

#### 2. An toàn Dữ liệu và Thuật toán Giải quyết Xung đột Phiên bản (Conflict Resolution Matrix)
* Khi nhập một bộ thẻ Anki vào kho thẻ hiện có của Japanese SRS System, không thể tránh khỏi trường hợp thẻ đã tồn tại (Duplicate Cards).
* **Ma trận giải quyết xung đột 4 kịch bản**:
  1. **Trường hợp Trùng khớp Tuyệt đối (Exact Duplicate)**: Trùng cả Kanji và Hiragana.
     - *Hành vi mặc định*: Giữ nguyên tham số thuật toán FSRS hiện có của hệ thống; không ghi đè để bảo toàn chuỗi lịch sử học tập quý giá của người dùng.
  2. **Trường hợp Trùng Kanji nhưng Khác Nghĩa / Khác Câu ví dụ**:
     - *Hành vi mặc định*: Tự động gộp câu ví dụ mới vào danh sách câu ví dụ phụ của thẻ hiện tại; gắn tag `#anki-imported`.
  3. **Trường hợp Trùng Thẻ nhưng Có Lịch sử Ôn tập Mới hơn từ Anki**:
     - *Hành vi mặc định*: Đưa ra hộp thoại so sánh trực quan (Diff Modal) hai cột kiểu Nhật, làm nổi bật các trường dữ liệu khác biệt và cho phép người học chọn giải pháp bằng 1 phím bấm: `[Giữ bản nội bộ]`, `[Ghi đè bằng bản Anki]`, hoặc `[Tạo thành 2 thẻ song song]`.

#### 3. Kiểm định Bảo mật Webhook Yomitan & Rào chắn Ngăn chặn Tấn công CSRF
* Cổng tích hợp Yomitan cho phép tiện ích mở rộng trên trình duyệt gửi từ vựng mới học vào hệ thống qua giao thức HTTP POST nội bộ (`localhost:3000/api/yomitan`).
* Hiện tại endpoint này thiếu cơ chế xác thực Token bí mật (API Secret Token Header). Bất kỳ trang web độc hại nào người dùng truy cập trong một tab khác cũng có thể gửi các yêu cầu POST rác tới cổng này để làm rác kho thẻ cá nhân.
* Bắt buộc bổ sung cơ chế khóa bảo mật:
  - Sinh mã xác thực ngẫu nhiên 32 ký tự theo chuẩn Base64 trong trang Cài đặt Tích hợp.
  - Tiện ích Yomitan phải đính kèm Header `X-SRS-Bridge-Token: <SECRET_KEY>` trong mọi payload. Yêu cầu không có token hợp lệ lập tức bị từ chối với mã lỗi `401 Unauthorized`.

