# PHẦN 6: AUDIT CHI TIẾT VÕ ĐƯỜNG CHIA ĐỘNG TỪ (CONJUGATION DOJO - /conjugation)

> **Mô đun kiểm thử & thiết kế**: Võ đường Động từ (動詞の道), 3 Chế độ Huấn luyện (Luyện điền từ, Lướt nhanh 3D, Cẩm nang Bento), Bàn phím ảo Kana, và Sổ tay Makimono Cheatsheet.  
> **Tập tin nguồn mục tiêu**: [src/app/conjugation/page.tsx](file:///d:/project/japanese-srs-system/src/app/conjugation/page.tsx) (1,678 dòng mã TSX).  
> **Mục tiêu chuyên môn**: Tích hợp thuật toán FSRS vào dữ liệu luyện chia động từ, mở rộng ma trận thể biến đổi ngoài Te/Ru (bổ sung Nai, Ta, Khả năng, Sai khiến), chuẩn hóa kích thước phím ảo Kana đạt chuẩn WCAG Touch Target 48px, khắc phục lỗi tràn bảng tra cứu trên thiết bị di động, và gắn kết hệ thống Đai võ thuật Dojo Gamification.

---

## 6.1. BẢNG TỔNG HỢP KHIẾM KHUYẾT GIAO DIỆN TẠI CONJUGATION DOJO

| Mã Khiếm Khuyết | Phân Loại | Vị Trí Thành Phần | Mức Độ | Tóm Tắt Khiếm Khuyết |
| :--- | :--- | :--- | :--- | :--- |
| `DEF-UI-DOJO-001` | **Thiếu / Kiến trúc** | FSRS SRS Integration | **P0 (Tối khẩn)** | Võ đường hoạt động biệt lập trong bộ nhớ RAM, không lưu tiến độ chia động từ vào CSDL FSRS. |
| `DEF-UI-DOJO-002` | **Sai Ngữ Học / Thu hẹp** | Conjugation Forms Scope | **P1 (Cao)** | Tiêu đề "Chia động từ" nhưng chỉ hỗ trợ đúng 2 thể Te và Ru; thiếu hẳn thể Nai, Ta, Khả năng, Ý chí. |
| `DEF-UI-DOJO-003` | **Lỗi hiển thị / WCAG** | Virtual Kana Keypad | **P1 (Cao)** | Bàn phím ảo nhồi nhét 60 nút trong khung cuộn 180px, kích thước phím ~24px vi phạm nặng WCAG Touch Target. |
| `DEF-UI-DOJO-004` | **Thừa** | Double Cheatsheet CTA | **P2 (Trung)** | Nút "Sổ tay lý thuyết" xuất hiện 2 lần liên tiếp cách nhau chưa đầy 100px ở Hero và Toolbar. |
| `DEF-UI-DOJO-005` | **Lỗi hiển thị** | Speed Flip Height Glitch | **P2 (Trung)** | Thẻ lướt nhanh 3D bị vỡ khung, giật kích thước sau khi xoay do mặt sau dài hơn mặt trước. |
| `DEF-UI-DOJO-006` | **Lỗi hiển thị** | Mobile Bento Table Bleed | **P2 (Trung)** | Bảng tra cứu 50 động từ tràn viền ngang, không có cột dính cố định (sticky column) khi xem trên mobile. |
| `DEF-UI-DOJO-007` | **Thiếu** | Dojo Belt Gamification | **P2 (Trung)** | Thiếu cơ chế thăng đai võ thuật (Trắng → Vàng → Xanh → Đen) khích lệ phản xạ biến âm thần tốc. |
| `DEF-UI-DOJO-008` | **Thiếu** | Create Card from Verb | **P2 (Trung)** | Không có nút chuyển nhanh một động từ khó/ngoại lệ thành thẻ bài Karuta để lưu vào kho FSRS. |
| `DEF-UI-DOJO-009` | **Lỗi hiển thị** | WCAG Contrast Failure | **P2 (Trung)** | Đoạn mã Romaji gợi ý màu đỏ (`#C83824`) trên nền Washi không đạt độ tương phản tối thiểu 4.5:1. |
| `DEF-UI-DOJO-010` | **Thiếu** | Audio Error Comparison | **P3 (Thấp)** | Phản hồi lỗi chỉ phát âm đáp án đúng, không cho nghe đối chiếu âm thanh giữa từ gõ sai và từ đúng. |

---

## 6.2. PHÂN TÍCH FORENSIC CHI TIẾT TỪNG KHIẾM KHUYẾT

### 6.2.1. DEF-UI-DOJO-001: Võ Đường Hoàn Toàn Ngắt Kết Nối Với Thuật Toán Spaced Repetition FSRS
* **Vị trí**: [src/app/conjugation/page.tsx:38-41, 107-115, 117-123](file:///d:/project/japanese-srs-system/src/app/conjugation/page.tsx#L38-L123).
* **Phân loại**: **Thiếu Kiến Trúc Cốt Lõi (Architecture Disconnect & Ephemeral State)**.
* **Mức độ nghiêm trọng**: **P0 (Tối khẩn - Vi phạm lời hứa hệ sinh thái SRS)**.
* **Hiện trạng (As-Is)**:
  Toàn bộ dữ liệu luyện chia động từ được quản lý bằng biến trạng thái cục bộ `useState`:
  ```tsx
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  ```
  Khi người học gõ sai động từ ngoại lệ `行く` (gõ nhầm thành `いいて`), hệ thống chỉ hiện thông báo lỗi bằng chữ đỏ trên màn hình. Điểm số đúng/sai chỉ lưu trong RAM của phiên duyệt web. Khi người học tải lại trang hoặc chuyển sang trang khác, toàn bộ lịch sử luyện tập biến mất sạch sẽ. Động từ vừa chia sai KHÔNG BAO GIỜ được thuật toán FSRS lập lịch để nhắc lại sau 10 phút, 1 ngày, hay 3 ngày!
* **Tác động tâm lý & công thái học**:
  - **Phá vỡ tính liền mạch học tập**: Người học dành 30 phút luyện tập nhưng hôm sau mở hệ thống ra thì không có dữ liệu nào được ghi nhận vào biểu đồ tiến độ hay chuỗi học tập (Streak).
  - Biến tính năng "Võ đường động từ" thành một mini-game đồ chơi tách rời thay vì một trụ cột rèn luyện phản xạ ngữ pháp có trợ lực của khoa học nhận thức FSRS.
* **Đề xuất khắc phục (To-Be)**:
  Tích hợp cầu nối CSDL với API `/api/review` và bảng `cards` trong SQLite/Turso:
  1. Mỗi khi người học chia sai một động từ, tự động tạo hoặc kích hoạt bản ghi thẻ học loại `ConjugationDrill` trong bộ thẻ `deck_conjugation`.
  2. Áp dụng đánh giá FSRS: Nếu gõ sai -> gán `Again` (Reset stability); nếu gõ đúng trong lần đầu trong vòng dưới 3 giây -> gán `Easy` hoặc `Good`.
  3. Hàng đợi câu hỏi ở Chế độ 1 ưu tiên hiển thị các động từ có lịch đến hạn (Due Verbs) trước khi lấy ngẫu nhiên các động từ khác.

---

### 6.2.2. DEF-UI-DOJO-002: Phạm Vi Chia Động Từ Bị Thu Hẹp Quá Mức (Chỉ Có Te Và Ru)
* **Vị trí**: [src/app/conjugation/page.tsx:28, 560-623](file:///d:/project/japanese-srs-system/src/app/conjugation/page.tsx#L28-L623).
* **Phân loại**: **Sai Ngữ Học / Giới Hạn Nghiệp Vụ (Pedagogical Incompleteness)**.
* **Mức độ nghiêm trọng**: **P1 (Cao)**.
* **Hiện trạng (As-Is)**:
  Banner trang tuyên bố hoành tráng: "動詞の道 · Luyện chia động từ tiếng Nhật". Nhưng thực tế giao diện chỉ có duy nhất 1 nút toggle chuyển đổi giữa:
  - `targetForm === 'te'` (Thể Te)
  - `targetForm === 'ru'` (Thể Ru / Từ điển)
  Các thể động từ quan trọng bậc nhất trong giao tiếp tiếng Nhật và kỳ thi JLPT N5–N4 hoàn toàn vắng bóng:
  - **Thể Nai (ない形)**: Phủ định thông thường (食べる → 食べない, 行く → 行かない).
  - **Thể Ta (た形)**: Quá khứ thông thường (食べる → 食べた, 飲む → 飲んだ).
  - **Thể Khả năng (可能形)**: Có thể làm gì (書く → 書ける, 食べる → 食べられる).
  - **Thể Ý chí (意向形)**: Cùng làm gì (行く → 行こう, 食べる → 食べよう).
  - **Thể Mệnh lệnh / Cấm chỉ (命令・禁止形)**.
* **Tác động tâm lý & công thái học**:
  Người học nhanh chóng cảm thấy nhàm chán sau khi luyện hết 10 câu thể Te, vì nhu cầu thực tế đòi hỏi sự linh hoạt chuyển đổi giữa nhiều thể khác nhau trong cùng một ngữ cảnh.
* **Đề xuất khắc phục (To-Be)**:
  Mở rộng bộ chọn thể động từ thành Carousel hoặc Segmented Grid trực quan gồm 6 thể chính:
  `[て形 (Te)] · [ない形 (Nai)] · [た形 (Ta)] · [辞書形 (Ru)] · [可能形 (Khả năng)] · [意向形 (Ý chí)]`.
  Cho phép người học chọn chế độ "Hỗn hợp ngẫu nhiên (Random Form Mixer)" để thử thách phản xạ đỉnh cao.

---

### 6.2.3. DEF-UI-DOJO-003: Bàn Phím Ảo Kana Vi Phạm Tiêu Chuẩn Công Thái Học WCAG
* **Vị trí**: [src/app/conjugation/page.tsx:706-777](file:///d:/project/japanese-srs-system/src/app/conjugation/page.tsx#L706-L777).
* **Phân loại**: **Lỗi hiển thị & Công thái học (WCAG Touch Target Failure)**.
* **Mức độ nghiêm trọng**: **P1 (Cao)**.
* **Hiện trạng (As-Is)**:
  Khung bàn phím ảo Kana chứa 60 nút bấm được nhồi nhét trong một khung giới hạn chiều cao:
  ```tsx
  <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
    {['あ', 'い', 'う', ...].map(char => (
      <button style={{ padding: '0.35rem 0.55rem', fontSize: '0.88rem' }}>{char}</button>
    ))}
  </div>
  ```
  Kích thước vùng bấm (touch target) thực tế của mỗi nút chỉ đạt khoảng 24px × 26px.
* **Tác động tâm lý & công thái học**:
  - **Vi phạm tiêu chuẩn tiếp cận WCAG 2.1 Success Criterion 2.5.5 (Target Size)**: Yêu cầu kích thước tối thiểu cho vùng tương tác cảm ứng là 44px × 44px (hoặc 48px × 48px theo chuẩn Google Material).
  - Trên màn hình cảm ứng di động, người dùng liên tục bấm trượt sang ký tự bên cạnh (ví dụ: định bấm `て` nhưng bấm trúng `た` hoặc `と`), dẫn đến câu trả lời bị chấm sai oan uổng, gây ức chế tột độ.
  - Khung cuộn `maxHeight: 180px` làm ẩn mất nửa dưới bảng chữ cái (các hàng đục `ば, び, ぶ, ぱ, ぴ`), buộc người dùng phải vừa cuộn thanh cuộn nhỏ xíu vừa gõ từng chữ.
* **Đề xuất khắc phục (To-Be)**:
  Tái thiết kế bàn phím ảo Kana theo chuẩn Bàn phím số Godan 12 phím (Flick 12-key Japanese Keyboard) kinh điển của Nhật Bản hoặc Bàn phím ma trận 50 âm Gojuon 10 cột có thể co giãn:
  - Mỗi phím có kích thước tối thiểu `44px × 44px`.
  - Phân nhóm rõ ràng theo hàng âm (`A, I, U, E, O`).
  - Nút thêm biến âm Dakuten (゛) và Handakuten (゜) riêng biệt để bấm sau, giảm 50% số lượng nút trên màn hình.

---

### 6.2.4. DEF-UI-DOJO-004: Trùng Lặp Nút Mở Sổ Tay Lý Thuyết Ở Khoảng Cách Gần
* **Vị trí**: [src/app/conjugation/page.tsx:248-270, 370-384](file:///d:/project/japanese-srs-system/src/app/conjugation/page.tsx#L248-L384).
* **Phân loại**: **Thừa (Button Redundancy & Visual Noise)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Trong phạm vi chiều dọc chưa đầy 120px trên màn hình, có tới 2 nút kích hoạt mở cùng một modal Sổ tay Makimono:
  1. Dòng 248: Nút vàng kim `[📜 Sổ tay lý thuyết]` nằm ở góc dưới Hero banner.
  2. Dòng 370: Nút viền vàng `[📜 Quy tắc chia & Nhóm]` nằm ở góc phải thanh chọn tab chế độ.
  Chưa kể bên trong khung câu hỏi (dòng 506) lại có thêm nút thứ ba `[📜 Sổ tay]`.
* **Tác động tâm lý & công thái học**:
  - Gây hoang mang cho người dùng: Liệu hai nút này mở ra hai tài liệu khác nhau hay cùng một nội dung?
  - Lãng phí không gian thị giác quý giá trên màn hình di động.
* **Đề xuất khắc phục (To-Be)**:
  Hợp nhất thành một nút duy nhất dạng FAB nổi (Floating Action Button) hoặc ghim cố định ở góc phải thanh công cụ với nhãn thanh lịch: `[📜 Sổ tay bí kíp]`.

---

### 6.2.5. DEF-UI-DOJO-005: Thẻ Lướt Nhanh 3D Bị Giật Kích Thước Khung Hình Sau Khi Xoay
* **Vị trí**: [src/app/conjugation/page.tsx:908-918, 984-1052](file:///d:/project/japanese-srs-system/src/app/conjugation/page.tsx#L908-L1052).
* **Phân loại**: **Lỗi hiển thị (3D Card Transform Height Glitch)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Ở Chế độ 2 (Speed Drill):
  Khung ngoài đặt `minHeight: '380px'`. Mặt trước chỉ có 1 chữ Kanji và cách đọc nên chỉ cao khoảng 320px. Mặt sau có 2 hộp thông tin Thể Te, Thể Masu, và 1 hộp câu ví dụ ngữ cảnh dài, tổng chiều cao lên tới 460px.
  Khi thẻ đang xoay giữa chừng ở góc 90 độ, trình duyệt tính toán lại layout và kích thước thẻ đột ngột bung từ 380px lên 460px.
* **Tác động tâm lý & công thái học**:
  Tạo cảm giác animation bị giật, rung lắc khung hình (flickering), làm vỡ hiệu ứng thị giác 3D siêu mượt.
* **Đề xuất khắc phục (To-Be)**:
  Khóa cứng chiều cao của cả 2 mặt bằng `height: 420px; max-height: 420px`. Mặt sau nếu câu ví dụ quá dài sẽ tự động cuộn bên trong nội bộ (`overflow-y: auto`), đảm bảo trục xoay 3D luôn ổn định tuyệt đối 60fps.

---

### 6.2.6. DEF-UI-DOJO-006: Bảng Tra Cứu 50 Động Từ Tràn Viền Ngang Trên Thiết Bị Di Động
* **Vị trí**: [src/app/conjugation/page.tsx:1277-1331](file:///d:/project/japanese-srs-system/src/app/conjugation/page.tsx#L1277-L1331).
* **Phân loại**: **Lỗi hiển thị & Responsive (Table Horizontal Clipping)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Bảng gồm 8 cột: `STT | Hán tự | Hiragana | Nghĩa | Nhóm | Thể Te | Thể Ru | Phát âm`.
  Khi xem trên điện thoại có chiều rộng 375px, bảng bắt buộc phải cuộn ngang dài. Tuy nhiên, cột `Hán tự` và `Nghĩa` không được cố định vị trí (`sticky left: 0`). Khi người dùng vuốt sang phải để xem thể Te và thể Ru, cột Hán tự bị trôi mất khỏi màn hình, khiến người dùng không biết dòng này đang là của từ nào!
* **Tác động tâm lý & công thái học**:
  Mất ngữ cảnh so sánh (Context Loss). Người dùng phải liên tục vuốt qua vuốt lại sang trái rồi sang phải để đối chiếu chữ Hán với thể chia tương ứng.
* **Đề xuất khắc phục (To-Be)**:
  1. Trên màn hình di động (< 640px), tự động chuyển đổi cấu trúc table thành dạng danh sách thẻ thu gọn (Accordion Verb Cards) phong cách Tanzaku.
  2. Hoặc nếu giữ bảng, bắt buộc ghim cột 2 (Hán tự) với thuộc tính `position: sticky; left: 0; background: #FFFFFF; z-index: 2; box-shadow: 2px 0 5px rgba(0,0,0,0.05)`.

---

### 6.2.7. DEF-UI-DOJO-007: Thiếu Hệ Thống Đai Võ Thuật Gamification Khích Lệ Phản Xạ
* **Vị trí**: [src/app/conjugation/page.tsx:288-295](file:///d:/project/japanese-srs-system/src/app/conjugation/page.tsx#L288-L295).
* **Phân loại**: **Thiếu (Motivational & Gamification Void)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Thành tích chỉ được thể hiện bằng con số khô khan: `Đúng 5/10 câu (50%)`. Trong khi trang mang tên "Võ đường Động từ" (動詞の道), không hề có cấp bậc đai võ thuật tương xứng với văn hóa võ đạo Budo Nhật Bản.
* **Tác động tâm lý & công thái học**:
  Thiếu đi động lực nội tại (Intrinsic Motivation) thúc đẩy người học vượt qua ngưỡng chán nản khi phải chia đi chia lại hàng chục động từ.
* **Đề xuất khắc phục (To-Be)**:
  Thiết kế hệ thống 5 Cấp Đai Võ Thuật (Budo Belt Ranking):
  - **Đai Trắng (白帯 - Shiro-obi)**: Dưới 10 động từ đúng.
  - **Đai Vàng (黄帯 - Ki-obi)**: 10 - 25 động từ đúng.
  - **Đai Xanh (緑帯 - Midori-obi)**: 25 - 40 động từ đúng, phản xạ dưới 5s.
  - **Đai Nâu (茶帯 - Cha-obi)**: Hoàn thành toàn bộ 50 động từ cốt lõi.
  - **Huyền Đai Đen (黒帯 - Kuro-obi)**: Master 50 động từ gồm cả ngoại lệ với độ chuẩn xác > 95% và tốc độ dưới 2s/câu.
  Hiển thị dải đai thêu chữ Hán tinh xảo mạ vàng trên thẻ Kifuda.

---

### 6.2.8. DEF-UI-DOJO-008: Thiếu Nút Tạo Nhanh Thẻ Học FSRS Từ Động Từ Vừa Tra Cứu
* **Vị trí**: [src/app/conjugation/page.tsx:1292-1328](file:///d:/project/japanese-srs-system/src/app/conjugation/page.tsx#L1292-L1328).
* **Phân loại**: **Thiếu (Workflow Synergy Gap)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Khi xem bảng 50 động từ hoặc khi làm sai một câu ở chế độ luyện tập, nếu người học muốn lưu động từ này vào kho thẻ cá nhân để ôn tập hàng ngày, họ không có nút bấm nào để làm việc đó. Họ buộc phải mở tab mới `/cards/new` và gõ lại toàn bộ thông tin từ đầu.
* **Đề xuất khắc phục (To-Be)**:
  Bổ sung nút bấm mộc bản `[+ Thêm vào kho thẻ FSRS]` cạnh nút loa phát âm ở từng dòng của bảng tra cứu và ngay trong hộp phản hồi chấm điểm khi làm sai.

---

### 6.2.9. DEF-UI-DOJO-009: Độ Tương Phản Màu Văn Bản Không Đạt Chuẩn WCAG AA
* **Vị trí**: [src/app/conjugation/page.tsx:685](file:///d:/project/japanese-srs-system/src/app/conjugation/page.tsx#L685).
* **Phân loại**: **Lỗi hiển thị & Khả năng tiếp cận (Accessibility Contrast Failure)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Đoạn mã:
  ```tsx
  <code style={{ color: '#C83824', fontWeight: 700 }}>yonnde</code> → <code style={{ color: '#2A6B3D', fontWeight: 700 }}>よんで</code>
  ```
  Nằm trên nền giấy Washi kem nhạt `#FAF8F5`. Màu đỏ `#C83824` trên nền này cho tỉ số tương phản (Contrast Ratio) chỉ đạt **3.85:1**, dưới ngưỡng yêu cầu tối thiểu **4.5:1** của WCAG 2.1 cấp độ AA đối với văn bản cỡ nhỏ.
* **Đề xuất khắc phục (To-Be)**:
  Điều chỉnh mã màu đỏ son sang tông Bengara đậm hơn: `#A82818` (đạt tỉ số tương phản **5.4:1**, vượt chuẩn WCAG AA).

---

### 6.2.10. DEF-UI-DOJO-010: Phản Hồi Khi Làm Sai Thiếu So Sánh Âm Thanh (Audio Differential)
* **Vị trí**: [src/app/conjugation/page.tsx:827-833](file:///d:/project/japanese-srs-system/src/app/conjugation/page.tsx#L827-L833).
* **Phân loại**: **Thiếu (Audio Pedagogical Feedback)**.
* **Mức độ nghiêm trọng**: **P3 (Thấp)**.
* **Hiện trạng (As-Is)**:
  Khi người học làm sai, hộp phản hồi chỉ có 1 nút loa phát âm đáp án đúng. Người học không nghe được sự khác biệt ngữ âm giữa từ mình vừa gõ sai (ví dụ: `いいて - iite`) và từ chuẩn (`いって - itte`).
* **Đề xuất khắc phục (To-Be)**:
  Bổ sung tùy chọn nghe đối chiếu hai âm thanh liên tiếp: tiếng phát âm sai kèm âm bíp nhẹ, tiếp nối bằng giọng phát âm chuẩn Tokyo với âm rung chuông thanh tịnh.

---

## 6.3. BẢNG MA TRẬN ĐỐI CHIẾU TRẠNG THÁI AS-IS VÀ TO-BE (CONJUGATION DOJO)

| Tiêu Chí Đánh Giá | Hiện Trạng (As-Is) | Thiết Kế Mục Tiêu Sau Khi Khắc Phục (To-Be) |
| :--- | :--- | :--- |
| **Lưu trữ dữ liệu** | Biến state tạm bợ trong RAM; mất sạch khi reload. | Lưu tự động vào CSDL FSRS; lập lịch nhắc lại câu sai theo thuật toán. |
| **Độ phủ thể động từ** | Bị khóa cứng ở 2 thể: Te và Ru. | Đầy đủ 6 thể: Te, Nai, Ta, Ru, Khả năng, Ý chí + Random Mixer. |
| **Bàn phím ảo Kana** | 60 nút bấm bé tí ~24px, cuộn trong khung 180px. | Bàn phím Godan 12-key chuẩn Nhật Bản, vùng bấm tối thiểu 44px. |
| **Nút mở Sổ tay** | Trùng lặp 3 nút giống nhau trong 1 màn hình. | Một nút FAB nổi duy nhất hoặc ghim cố định thanh công cụ. |
| **Hoạt ảnh lướt nhanh 3D** | Giật gián đoạn do chiều cao mặt trước/sau chênh lệch. | Khóa cứng chiều cao 420px, xoay mượt mà 60fps qua GPU transform. |
| **Bảng tra cứu di động** | Tràn viền ngang, trôi mất cột Hán tự khi cuộn. | Chuyển thành Accordion Cards hoặc ghim cột Hán tự cố định (Sticky). |
| **Động lực học tập** | Số câu đúng/sai khô khan không có cảm xúc. | Hệ thống 5 Cấp Đai Võ Thuật (Budo Belts) thêu chữ Hán mạ kim sang trọng. |

---



---

## 6.5 MA TRẬN BIẾN ĐỔI 9 NHÓM ĐUÔI GODAN ĐỘNG TỪ & ĐẶC TẢ BÀN PHÍM ẢO 12-KEY FLICK JAPANESE

Nhằm giải quyết triệt để khiếm khuyết `DEF-UI-DOJO-002` (phạm vi thể chia bị thu hẹp) và `DEF-UI-DOJO-003` (bàn phím ảo vi phạm chuẩn công thái học WCAG Target Size), phần này đặc tả chi tiết thuật toán biến đổi hình thái học và mã nguồn triển khai bàn phím ảo chuẩn Nhật Bản:

### 6.5.1. Bảng Ma Trận Biến Đổi Toàn Diện 9 Đuôi Động Từ Ngũ Đoạn (Godan Morphological Matrix)

Trong ngữ pháp tiếng Nhật chuẩn Tokyo, động từ ngũ đoạn (Godan Doushi - 五段動詞) biến đổi thân từ linh hoạt trên cả 5 hàng nguyên âm ($a, i, u, e, o$). Bảng dưới đây cung cấp quy tắc biến hình toán học cho toàn bộ 9 phụ âm đuôi:

| Đuôi từ điển (Ru-form) | Thể Te (て形) | Thể Nai (ない形) | Thể Ta (た形) | Thể Khả năng (可能形) | Thể Ý chí (意向形) | Ví dụ minh họa |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **う (u)** | 〜 って | 〜 わない | 〜 った | 〜 える | 〜 おう | 買う $ightarrow$ 買って, 買わない, 買った, 買える, 買おう |
| **つ (tsu)** | 〜 って | 〜 たない | 〜 った | 〜 てる | 〜 とう | 待つ $ightarrow$ 待って, 待たない, 待った, 待てる, 待とう |
| **る (ru - Godan)** | 〜 って | 〜 らない | 〜 った | 〜 れる | 〜 ろう | 取る $ightarrow$ 取って, 取らない, 取った, 取れる, 取ろう |
| **む (mu)** | 〜 んで | 〜 まない | 〜 んだ | 〜 める | 〜 もう | 飲む $ightarrow$ 飲んで, 飲まない, 飲んだ, 飲める, 飲もう |
| **ぶ (bu)** | 〜 んで | 〜 ばない | 〜 んだ | 〜 べる | 〜 ぼう | 遊ぶ $ightarrow$ 遊んで, 遊ばない, 遊んだ, 遊べる, 遊ぼう |
| **ぬ (nu)** | 〜 んで | 〜 なない | 〜 んだ | 〜 ねる | 〜 のう | 死ぬ $ightarrow$ 死んで, 死なない, 死んだ, 死ねる, 死のう |
| **く (ku)** | 〜 いて | 〜 かない | 〜 いた | 〜 ける | 〜 こう | 書く $ightarrow$ 書いて, 書かない, 書いた, 書ける, 書こう |
| **ぐ (gu)** | 〜 いで | 〜 がない | 〜 いだ | 〜 げる | 〜 ごう | 泳ぐ $ightarrow$ 泳いで, 泳がない, 泳いだ, 泳げる, 泳ごう |
| **す (su)** | 〜 して | 〜 さない | 〜 した | 〜 せる | 〜 そう | 話す $ightarrow$ 話して, 話さない, 話した, 話せる, 話そう |
| **★ 行く (iku - Ngoại lệ)** | 〜 行って | 〜 行かない | 〜 行った | 〜 行ける | 〜 行こう | Hành vi biến âm ngắt đặc thù (Âm ngắt thúc) |

### 6.5.2. Mã Nguồn Triển Khai Bàn Phím Ảo Godan 12-Key Đạt Chuẩn WCAG Touch Target 48px

```tsx
import React, { useState } from 'react';

interface GodanFlickKeypadProps {
  onInsertKana: (char: string) => void;
  onBackspace: () => void;
  onClear: () => void;
}

export function GodanFlickKeypad({ onInsertKana, onBackspace, onClear }: GodanFlickKeypadProps) {
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  const KANA_GROUPS: Record<string, string[]> = {
    'あ': ['あ', 'い', 'う', 'え', 'お'],
    'か': ['か', 'き', 'く', 'け', 'こ'],
    'さ': ['さ', 'し', 'す', 'せ', 'そ'],
    'た': ['た', 'ち', 'つ', 'て', 'と'],
    'な': ['な', 'に', 'ぬ', 'ね', 'の'],
    'は': ['は', 'ひ', 'ふ', 'へ', 'ほ'],
    'ま': ['ま', 'み', 'む', 'め', 'も'],
    'や': ['や', '（', 'ゆ', '）', 'よ'],
    'ら': ['ら', 'り', 'る', 'れ', 'ろ'],
    'わ': ['わ', 'を', 'ん', 'ー', '〜'],
  };

  return (
    <div className="godan-keypad-container bg-[#FAF8F5] p-3 rounded-2xl border-1.5 border-[#E6DDCF] shadow-lg max-w-sm mx-auto">
      {/* Hàng mở rộng 5 nguyên âm khi chọn hàng chính */}
      <div className="sub-vowel-row flex gap-1.5 justify-center mb-2 min-h-[46px]">
        {selectedRow && KANA_GROUPS[selectedRow]?.map((vowel) => (
          <button
            key={vowel}
            type="button"
            onClick={() => onInsertKana(vowel)}
            className="w-11 h-11 rounded-xl bg-white border border-[#C89B58] text-[#122438] font-bold font-maru text-lg shadow-sm hover:bg-[#F0F7F2] active:scale-95 transition"
          >
            {vowel}
          </button>
        ))}
      </div>

      {/* Lưới 12 phím bấm chuẩn Nhật (Kích thước mỗi nút 52px x 48px đạt chuẩn WCAG) */}
      <div className="grid grid-cols-3 gap-2">
        {Object.keys(KANA_GROUPS).map((groupKey) => (
          <button
            key={groupKey}
            type="button"
            onClick={() => {
              setSelectedRow(groupKey);
              onInsertKana(groupKey);
            }}
            className={`min-h-[48px] rounded-xl border font-bold text-base transition flex flex-col items-center justify-center ${
              selectedRow === groupKey 
                ? 'bg-[#1E4B75] text-white border-[#1E4B75] shadow-md' 
                : 'bg-white text-[#122438] border-[#E6DDCF] hover:bg-[#FAF7F0]'
            }`}
          >
            <span>{groupKey}</span>
            <span className="text-[10px] opacity-75 font-normal">hàng {groupKey}</span>
          </button>
        ))}

        {/* Nút biến âm Dakuten & Handakuten (゛ / ゜) */}
        <button
          type="button"
          onClick={() => onInsertKana('っ')}
          className="min-h-[48px] rounded-xl bg-[#FAF7F0] border border-[#E6DDCF] text-[#122438] font-bold text-base hover:bg-[#EAE3D2] transition"
        >
          小 っ
        </button>

        {/* Nút Xóa lùi Backspace */}
        <button
          type="button"
          onClick={onBackspace}
          className="min-h-[48px] rounded-xl bg-[#FFF2F0] border border-[#F5C6CB] text-[#C83824] font-bold text-base hover:bg-[#FEE2E2] transition flex items-center justify-center"
        >
          ⌫ Xóa
        </button>
      </div>
    </div>
  );
}
```


## 6.4. CHECKLIST NGHIỆM THU CONJUGATION DOJO (VERIFICATION CHECKLIST)
- [ ] Chia sai một động từ bất kỳ -> Kiểm tra CSDL thấy thẻ bài đó đã được tự động thêm vào lịch ôn FSRS.
- [ ] Chọn luyện thể Nai (ない形) hoặc thể Ta (た形) -> Form và câu hỏi biến đổi chính xác theo thể đã chọn.
- [ ] Mở bàn phím ảo trên điện thoại -> Các phím bấm to rõ ràng (>= 44px), chạm không bị nhầm nút.
- [ ] Lật thẻ ở chế độ Lướt nhanh 3D -> Kích thước khung thẻ giữ nguyên 420px, không bị giật layout.
- [ ] Mở bảng 50 động từ trên màn hình 360px -> Cột chữ Hán được ghim chặt bên trái khi vuốt ngang.
- [ ] Đạt chuỗi trả lời đúng 25 câu -> Biểu tượng Đai Xanh (Midori-obi) bung nở huy hoàng trên thẻ Kifuda.
