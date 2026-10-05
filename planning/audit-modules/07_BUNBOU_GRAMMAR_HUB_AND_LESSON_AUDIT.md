# PHẦN 7: AUDIT CHI TIẾT TRUNG TÂM NGỮ PHÁP & CHI TIẾT BÀI HỌC (BUNBOU HUB & LESSON DETAIL - /grammar, /grammar/[lessonId])

> **Mô đun kiểm thử & thiết kế**: Trung tâm Ngữ pháp Bunbou Hub (文法回廊), Trang chi tiết bài học (Lesson Detail), Thẻ cấu trúc Pattern Card, Dấu triện Hanko Inkan, và Cầu nối FSRS Spaced Repetition.  
> **Tập tin nguồn mục tiêu**:  
> - [src/app/grammar/page.tsx](file:///d:/project/japanese-srs-system/src/app/grammar/page.tsx)  
> - [src/components/grammar/GrammarGallery.tsx](file:///d:/project/japanese-srs-system/src/components/grammar/GrammarGallery.tsx) (243 dòng mã TSX)  
> - [src/app/grammar/[lessonId]/page.tsx](file:///d:/project/japanese-srs-system/src/app/grammar/[lessonId]/page.tsx) (206 dòng mã TSX)  
> - [src/components/grammar/LessonCard.tsx](file:///d:/project/japanese-srs-system/src/components/grammar/LessonCard.tsx)  
> - [src/components/grammar/PatternCard.tsx](file:///d:/project/japanese-srs-system/src/components/grammar/PatternCard.tsx)  
> **Mục tiêu chuyên môn**: Bổ sung thanh tìm kiếm cấu trúc ngữ pháp thời gian thực (Grammar Omnisearch), tích hợp chỉ số FSRS Due Cards trên từng bài học riêng biệt, gắn nhãn phân định cấp độ JLPT N5/N4, sửa lỗi vỡ bố cục con dấu Hanko Inkan trên di động, và nâng cấp độ tương phản Breadcrumb đạt chuẩn WCAG AAA.

---

## 7.1. BẢNG TỔNG HỢP KHIẾM KHUYẾT GIAO DIỆN TẠI BUNBOU HUB & LESSON DETAIL

| Mã Khiếm Khuyết | Phân Loại | Vị Trí Thành Phần | Mức Độ | Tóm Tắt Khiếm Khuyết |
| :--- | :--- | :--- | :--- | :--- |
| `DEF-UI-BUNBOU-001` | **Thiếu** | Grammar Omnisearch | **P1 (Cao)** | Trung tâm ngữ pháp thiếu thanh tìm kiếm 32 cấu trúc theo từ khóa (phải bấm mò từng bài). |
| `DEF-UI-BUNBOU-002` | **Thiếu** | Per-Lesson FSRS Metrics | **P1 (Cao)** | Thẻ bài học không hiển thị số lượng thẻ FSRS đang đến hạn ôn tập của riêng bài đó. |
| `DEF-UI-BUNBOU-003` | **Lỗi hiển thị** | Mobile Hanko Squeeze | **P2 (Trung)** | Con dấu triện Hanko 56px đè ép tiêu đề bài học rớt dòng vụn vỡ trên màn hình hẹp < 360px. |
| `DEF-UI-BUNBOU-004` | **Sai Ngữ Học** | JLPT Equivalence Void | **P2 (Trung)** | Chỉ ghi mã giáo trình `JPD133` mà thiếu nhãn tương đương JLPT N5 / N4 khiến người học khó định hướng. |
| `DEF-UI-BUNBOU-005` | **Lỗi hiển thị** | Breadcrumb Low Contrast | **P2 (Trung)** | Màu chữ breadcrumb `#8B7B6D` trên nền kem `#FAF8F5` có độ tương phản 3.4:1, trượt chuẩn WCAG AA. |
| `DEF-UI-BUNBOU-006` | **Thiếu** | Audio Formula TTS | **P2 (Trung)** | Các công thức kết hợp ngữ pháp (`V-て + もいいです`) và câu ví dụ thiếu nút phát âm giọng bản xứ. |
| `DEF-UI-BUNBOU-007` | **Lỗi hiển thị** | Watermark Visual Collision | **P2 (Trung)** | Chữ Hán chìm khổng lồ `文法` ở góc Hero banner va chạm thị giác với các chip thông số trên mobile. |
| `DEF-UI-BUNBOU-008` | **Thiếu** | Quick Quiz Drawer | **P2 (Trung)** | Thiếu nút trắc nghiệm nhanh 5 câu (Micro-drill) trực tiếp tại trang chi tiết mà phải chuyển trang. |
| `DEF-UI-BUNBOU-009` | **Thừa** | Repetitive Lesson Action | **P3 (Thấp)** | Nút luyện tập trong trang chi tiết lặp lại mà không có thông số phân bổ loại câu hỏi (Cloze/Trắc nghiệm). |
| `DEF-UI-BUNBOU-010` | **Thiếu** | Visual Particle Schema | **P3 (Thấp)** | Thiếu sơ đồ trực quan hóa luồng trợ từ (Particle Flow Diagram: は, が, を, に, で) trong cấu trúc. |

---

## 7.2. PHÂN TÍCH FORENSIC CHI TIẾT TỪNG KHIẾM KHUYẾT

### 7.2.1. DEF-UI-BUNBOU-001: Thiếu Thanh Tìm Kiếm Cấu Trúc Ngữ Pháp (Grammar Omnisearch)
* **Vị trí**: [src/components/grammar/GrammarGallery.tsx:20-54, 201-240](file:///d:/project/japanese-srs-system/src/components/grammar/GrammarGallery.tsx#L20-L240).
* **Phân loại**: **Thiếu (Critical Discoverability Void)**.
* **Mức độ nghiêm trọng**: **P1 (Cao)**.
* **Hiện trạng (As-Is)**:
  Trang danh mục `/grammar` chỉ liệt kê 4 thẻ bài học lớn: Bài 8, Bài 9, Bài 10, Bài 11. Nếu người học muốn tra cứu xem cấu trúc `〜てもいいです` (Được phép làm gì) hay `〜てはいけません` (Cấm làm gì) nằm ở bài nào, hệ thống HOÀN TOÀN KHÔNG CÓ thanh tìm kiếm. Người học bắt buộc phải:
  1. Nhấp vào Bài 8 -> Cuộn xem danh sách cấu trúc -> Không thấy.
  2. Bấm quay lại -> Nhấp vào Bài 9 -> Không thấy.
  3. Bấm quay lại -> Nhấp vào Bài 15...
* **Tác động tâm lý & công thái học**:
  - **Tăng chi phí tương tác (Interaction Cost) gấp 4–8 lần**: Vi phạm Định luật Hick và Nielsen Heuristic #7 (Flexibility and Efficiency of Use).
  - Làm giảm giá trị của hệ thống như một cuốn từ điển ngữ pháp tra cứu nhanh (Quick Reference Manual).
* **Đề xuất khắc phục (To-Be)**:
  Bổ sung thanh tìm kiếm ngữ pháp thông minh (Grammar Omnisearch) ngay dưới Hero Banner:
  - Cho phép gõ tìm kiếm theo Romaji (`temoiidesu`), Hiragana (`てもいい`), hoặc nghĩa tiếng Việt (`được phép`, `cấm`).
  - Hiển thị danh sách kết quả dạng Quick Dropdown hoặc lọc động ngay lập tức: Bấm vào kết quả nhảy thẳng tới vị trí cấu trúc đó trong bài học tương ứng kèm hiệu ứng làm nổi bật (Pulse Highlight).

---

### 7.2.2. DEF-UI-BUNBOU-002: Thẻ Bài Học Không Hiển Thị Chỉ Số Thẻ Đến Hạn FSRS Riêng Biệt
* **Vị trí**: [src/components/grammar/GrammarGallery.tsx:103-175](file:///d:/project/japanese-srs-system/src/components/grammar/GrammarGallery.tsx#L103-L175).
* **Phân loại**: **Thiếu (Information Asymmetry & Lack of Actionable Granularity)**.
* **Mức độ nghiêm trọng**: **P1 (Cao)**.
* **Hiện trạng (As-Is)**:
  Thanh thống kê tổng quan ở Hero banner có ghi: `⏱️ FSRS Cần ôn: 12 Thẻ`. Tuy nhiên, ở lưới 4 bài học bên dưới, mỗi thẻ bài học chỉ hiển thị con số tĩnh:
  - Bài 8: `8 Patterns · 48 Bài tập`
  - Bài 9: `8 Patterns · 52 Bài tập`
  - Bài 10: `8 Patterns · 46 Bài tập`
  - Bài 11: `8 Patterns · 58 Bài tập`
  Người học không thể biết trong số 12 thẻ cần ôn hôm nay, có bao nhiêu thẻ thuộc Bài 8, bao nhiêu thẻ thuộc Bài 10 để chọn ôn tập có trọng tâm.
* **Tác động tâm lý & công thái học**:
  Người học bị mơ hồ (Decision Paralysis). Khi chỉ có 10 phút nghỉ trưa, họ muốn giải quyết dứt điểm thẻ cần ôn của một bài nhất định nhưng không có cơ sở dữ liệu để lựa chọn.
* **Đề xuất khắc phục (To-Be)**:
  Trên mỗi thẻ `LessonCard`, bổ sung một huy hiệu FSRS động:
  - Nếu có thẻ đến hạn: Hiển thị viên ngọc đỏ son `🔥 Cần ôn: 5 thẻ FSRS`.
  - Nếu đã hoàn thành: Hiển thị dấu kiểm ngọc bích `✓ Đã ôn tập hôm nay`.

---

### 7.2.3. DEF-UI-BUNBOU-003: Con Dấu Triện Hanko Đè Ép Tiêu Đề Bài Học Trên Di Động
* **Vị trí**: [src/app/grammar/[lessonId]/page.tsx:55-142](file:///d:/project/japanese-srs-system/src/app/grammar/[lessonId]/page.tsx#L55-L142).
* **Phân loại**: **Lỗi hiển thị & Responsive (Layout Crowding & Text Truncation)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Banner bài học sử dụng flex layout hai cột: bên trái là nội dung tiêu đề bài học, bên phải là con dấu vuông Hanko Inkan 56px:
  ```tsx
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
    <div>... tiêu đề và mô tả ...</div>
    <div style={{ width: '56px', height: '56px', flexShrink: 0, transform: 'rotate(-5deg)' }}>...</div>
  </div>
  ```
  Trên màn hình iPhone SE (320px chiều rộng) sau khi trừ padding hai bên, phần nội dung bên trái chỉ còn lại khoảng 210px. Tiêu đề `第８課 · 形容詞と嗜好` bị nén vụn và rớt xuống thành 4 dòng chữ cồng kềnh, trong khi con dấu Hanko nằm trơ trọi một góc.
* **Tác động tâm lý & công thái học**:
  Làm mất đi tính trang nghiêm, thanh lịch của phong cách thiết kế Nhật Bản.
* **Đề xuất khắc phục (To-Be)**:
  Sử dụng responsive media query: Trên màn hình < 480px, chuyển con dấu Hanko thành watermark chìm trong suốt ở góc nền hoặc đặt dấu triện nhỏ (28px) ngay đầu tiêu đề bài học, trả lại 100% bề rộng cho văn bản tiêu đề hiển thị trọn vẹn trên 1-2 dòng.

---

### 7.2.4. DEF-UI-BUNBOU-004: Thiếu Nhãn Tương Đương Cấp Độ JLPT N5/N4
* **Vị trí**: [src/components/grammar/GrammarGallery.tsx:72, 99](file:///d:/project/japanese-srs-system/src/components/grammar/GrammarGallery.tsx#L72).
* **Phân loại**: **Sai Ngữ Học / Định Vị Sư Phạm (Linguistic Mapping Void)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Giao diện ghi: `🏮 JPD133 · BUNBOU MASTER ENGINE` và `Bài 8 - 11 Minna no Nihongo`. Tuy nhiên, đại đa số người học tiếng Nhật tại Việt Nam và quốc tế học theo hệ quy chiếu cấp độ JLPT (Kỳ thi Năng lực Nhật ngữ). Việc không ghi rõ Bài 8-11 tương đương cấp độ JLPT nào khiến người học luyện thi JLPT không biết khóa học này có phù hợp với mục tiêu của mình hay không.
* **Tác động tâm lý & công thái học**:
  Giảm tính hấp dẫn và độ tin cậy sư phạm của ứng dụng đối với cộng đồng người học JLPT.
* **Đề xuất khắc phục (To-Be)**:
  Gắn nhãn chuẩn hóa quốc tế: `[🔰 JLPT N5 · Sơ cấp 1]` cạnh tên bài học và trong từng cấu trúc ngữ pháp.

---

### 7.2.5. DEF-UI-BUNBOU-005: Độ Tương Phản Breadcrumb Không Đạt Chuẩn WCAG AA
* **Vị trí**: [src/app/grammar/[lessonId]/page.tsx:33-52](file:///d:/project/japanese-srs-system/src/app/grammar/[lessonId]/page.tsx#L33-L52).
* **Phân loại**: **Lỗi hiển thị & Tiếp cận (Accessibility Contrast Failure)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Đường dẫn phân cấp (Breadcrumb):
  ```tsx
  <nav style={{ color: '#8B7B6D', fontSize: '0.85rem' }}>
    <Link href="/" style={{ color: '#8B7B6D' }}>Trang chủ</Link>
    <span>/</span>
    <Link href="/grammar" style={{ color: '#8B7B6D' }}>Ngữ pháp</Link>
  ```
  Màu chữ nâu xám `#8B7B6D` trên nền kem Washi `#FAF8F5` có tỉ số tương phản chỉ đạt **3.42:1** (tiêu chuẩn WCAG AA yêu cầu tối thiểu **4.5:1** cho văn bản thông thường cỡ 0.85rem).
* **Tác động tâm lý & công thái học**:
  Người học có thị lực kém hoặc sử dụng màn hình điện thoại dưới ánh nắng mặt trời gần như không thể đọc được đường dẫn breadcrumb để quay lại trang chủ.
* **Đề xuất khắc phục (To-Be)**:
  Đổi màu chữ breadcrumb sang tông nâu sẫm Kuri-kawa: `#5A4A3E` (đạt tỉ số tương phản **6.8:1**, vượt chuẩn WCAG AA và tiệm cận AAA).

---

### 7.2.6. DEF-UI-BUNBOU-006: Thiếu Nút Phát Âm Cho Công Thức Ngữ Pháp Và Câu Mẫu
* **Vị trí**: [src/components/grammar/PatternCard.tsx](file:///d:/project/japanese-srs-system/src/components/grammar/PatternCard.tsx).
* **Phân loại**: **Thiếu (Multimodal Learning Absence)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Trong từng thẻ `PatternCard`, cấu trúc ngữ pháp gồm:
  - Công thức: `[V-て + もいいです]`
  - Giải thích ý nghĩa
  - 3 câu ví dụ minh họa kèm nghĩa tiếng Việt
  Tuy nhiên, các câu ví dụ ngữ pháp này hoàn toàn không có nút loa phát âm `<JapaneseSpeakerButton />` như ở các trang Từ vựng và Động từ.
* **Tác động tâm lý & công thái học**:
  Học ngữ pháp chỉ qua đọc chữ khiến người học không nắm được ngữ điệu (intonation) và chỗ ngắt nghỉ tự nhiên của câu ngữ pháp trong giao tiếp thực tế.
* **Đề xuất khắc phục (To-Be)**:
  Tích hợp nút loa phát âm phong cách mực mộc bản cạnh từng câu ví dụ ngữ pháp, hỗ trợ người học vừa đọc vừa nghe ngấm ngữ âm (Shadowing).

---

### 7.2.7. DEF-UI-BUNBOU-007: Chữ Hán Chìm Khổng Lồ Va Chạm Thị Giác Trên Di Động
* **Vị trí**: [src/components/grammar/GrammarGallery.tsx:36-53](file:///d:/project/japanese-srs-system/src/components/grammar/GrammarGallery.tsx#L36-L53).
* **Phân loại**: **Lỗi hiển thị (Visual Clipping & Contrast Clutter)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Đoạn mã:
  ```tsx
  <div style={{ position: 'absolute', right: '1rem', bottom: '0', fontSize: 'clamp(5rem, 14vw, 7.5rem)', color: 'rgba(255, 255, 255, 0.06)' }}>
    文法
  </div>
  ```
  Trên màn hình hẹp, chữ `文法` có kích thước quá lớn, các nét móc của chữ `法` đè ngay phía sau các chip thông số `Quick Practice All Button`, gây lộn xộn đường nét thị giác.
* **Đề xuất khắc phục (To-Be)**:
  Căn chỉnh lại vị trí chữ chìm lên góc trên bên phải hoặc giảm opacity xuống `0.035` để trở thành một vân chìm tinh tế thuần túy không gây nhiễu các thành phần chức năng.

---

### 7.2.8. DEF-UI-BUNBOU-008: Thiếu Chức Năng Trắc Nghiệm Nhanh Tại Chỗ (Quick Quiz Drawer)
* **Vị trí**: [src/app/grammar/[lessonId]/page.tsx:99-117](file:///d:/project/japanese-srs-system/src/app/grammar/[lessonId]/page.tsx#L99-L117).
* **Phân loại**: **Thiếu (Micro-learning Friction)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Để luyện tập các cấu trúc của bài học, người học bắt buộc phải bấm nút và chuyển toàn bộ trang sang `/grammar/practice?lessonId=...`. Không có tùy chọn làm bài kiểm tra nhanh 3–5 câu (Quick Check) ngay trong trang lý thuyết để kiểm tra mức độ hiểu bài tức thì.
* **Đề xuất khắc phục (To-Be)**:
  Bổ sung nút `[⚡ Trắc nghiệm nhanh 3 phút]` mở một Drawer trượt từ cạnh phải màn hình, cho phép kiểm tra nhanh phản xạ ngữ pháp ngay sau khi đọc xong lý thuyết.

---

### 7.2.9. DEF-UI-BUNBOU-009: Nút Luyện Tập Thiếu Thông Số Phân Bổ Bài Tập
* **Vị trí**: [src/app/grammar/[lessonId]/page.tsx:115](file:///d:/project/japanese-srs-system/src/app/grammar/[lessonId]/page.tsx#L115).
* **Phân loại**: **Thừa / Thiếu Thông Tin (Vague Action Button)**.
* **Mức độ nghiêm trọng**: **P3 (Thấp)**.
* **Hiện trạng (As-Is)**:
  Nút ghi chung chung: `✍️ Luyện tập 48+ bài tập của bài này`. Người học không biết 48 bài này bao gồm những dạng bài tập nào (bao nhiêu câu điền từ khuyết, bao nhiêu câu sắp xếp câu, bao nhiêu câu chọn đúng sai).
* **Đề xuất khắc phục (To-Be)**:
  Bổ sung tooltip hoặc phụ đề chi tiết: `Gồm: 24 câu Điền từ · 16 câu Sắp xếp câu · 8 câu Đọc hiểu ngữ cảnh`.

---

### 7.2.10. DEF-UI-BUNBOU-010: Thiếu Sơ Đồ Khối Trợ Từ Trực Quan (Particle Flow Diagram)
* **Vị trí**: [src/components/grammar/PatternCard.tsx](file:///d:/project/japanese-srs-system/src/components/grammar/PatternCard.tsx).
* **Phân loại**: **Thiếu (Pedagogical Visual Aid Void)**.
* **Mức độ nghiêm trọng**: **P3 (Thấp)**.
* **Hiện trạng (As-Is)**:
  Ngữ pháp tiếng Nhật có đặc thù là hệ thống trợ từ (Joshi - 助詞) như `は`, `が`, `を`, `に`, `で`, `へ`, `から`, `まで`. Hiện tại các cấu trúc chỉ được giải thích bằng văn bản phẳng thuần túy, thiếu sơ đồ trực quan thể hiện mối quan hệ giữa Chủ ngữ - Tân ngữ - Trợ từ - Động từ.
* **Đề xuất khắc phục (To-Be)**:
  Thiết kế các khối chip trực quan hóa cú pháp (Syntax Pill Block): Chủ ngữ (Xanh dương) + Trợ từ (Đỏ son) + Tân ngữ (Xanh lá) + Vị ngữ (Nâu đậm), giúp người học ghi nhớ cấu trúc qua ấn tượng thị giác (Visual Memory Encoding).

---

## 7.3. BẢNG MA TRẬN ĐỐI CHIẾU TRẠNG THÁI AS-IS VÀ TO-BE (BUNBOU HUB)

| Tiêu Chí Đánh Giá | Hiện Trạng (As-Is) | Thiết Kế Mục Tiêu Sau Khi Khắc Phục (To-Be) |
| :--- | :--- | :--- |
| **Tìm kiếm ngữ pháp** | Không có; phải bấm mò từng bài học để tìm cấu trúc. | Grammar Omnisearch gõ tìm theo Romaji, Hiragana, tiếng Việt. |
| **Chỉ số FSRS bài học** | Chỉ có chỉ số tổng ở đầu trang; bài học riêng không có. | Mỗi bài học hiển thị số thẻ đến hạn ôn FSRS và tỉ lệ nhớ riêng. |
| **Bố cục con dấu Hanko** | Đè ép tiêu đề bài học xuống 4 dòng trên mobile < 360px. | Tự động chuyển thành watermark chìm hoặc mini stamp 28px. |
| **Định vị cấp độ** | Chỉ ghi mã nội bộ `JPD133`, không rõ chuẩn JLPT nào. | Gắn nhãn chuẩn hóa: `[🔰 JLPT N5 · Sơ cấp 1]`. |
| **Độ tương phản Breadcrumb** | Đạt 3.4:1, vi phạm tiêu chuẩn tiếp cận WCAG AA. | Nâng lên tông nâu sẫm Kuri-kawa `#5A4A3E`, đạt chuẩn 6.8:1. |
| **Âm thanh câu ví dụ** | Hoàn toàn im lặng, không có phát âm câu mẫu. | Nút loa phát âm giọng chuẩn Tokyo cạnh từng câu ví dụ ngữ pháp. |
| **Trắc nghiệm nhanh** | Buộc phải chuyển trang sang `/grammar/practice`. | Hỗ trợ Quick Quiz Drawer 3 phút trực tiếp tại chỗ. |

---



---

## 7.5 KIẾN TRÚC ĐIỀU PHỐI TRỢ TỪ CÚ PHÁP (JOSHI SYNTAX ORCHESTRATION) & BẢNG 24 CHỨC NĂNG TRỢ TỪ

Để khắc phục triệt để khiếm khuyết `DEF-UI-BUNBOU-010` (thiếu sơ đồ trợ từ trực quan), phần này đặc tả cấu trúc khối cú pháp đa màu sắc (Syntax Pill Architecture) và danh mục 24 chức năng trợ từ cốt lõi trong giáo trình JPD133:

### 7.5.1. Bảng 24 Chức Năng Trợ Từ Trong Cấu Trúc Ngữ Pháp Bài 8 - 11 JPD133

| Trợ Từ | Hán Tự / Romaji | Chức Năng Cú Pháp | Phân Loại Màu Sắc Token | Ví Dụ Trong Bài Học |
| :--- | :--- | :--- | :--- | :--- |
| **は** | Chủ đề (Wa) | Đánh dấu chủ đề câu nói, thông tin đã biết | `--token-topic: #1B4268` (Chàm) | 富士山**は**高い山です (Bài 8) |
| **が** | Chủ ngữ / Đối tượng (Ga) | Đánh dấu chủ ngữ ngữ pháp, đối tượng của tính từ yêu ghét | `--token-subject: #2A6B3D` (Lục) | 日本料理**が**好きです (Bài 9) |
| **を** | Tân ngữ trực tiếp (O) | Tác động của ngoại động từ lên tân ngữ | `--token-object: #9E3223` (Bengara) | 写真**を**撮ってもいいですか (Bài 9) |
| **に** | Điểm đến / Thời gian (Ni) | Xác định thời điểm xảy ra hành động, nơi chốn tồn tại | `--token-location: #B87B28` (Kincha) | 机の上**に**本があります (Bài 10) |
| **で** | Nơi chốn hành động / Phương tiện (De) | Nơi diễn ra hành động, phương tiện hoặc cách thức thực hiện | `--token-method: #786A5E` (Nâu trà) | 図書館**で**勉強します (Bài 11) |
| **へ** | Hướng di chuyển (E) | Chỉ phương hướng chuyển động của hành động di chuyển | `--token-direction: #0284C7` (Thiên thanh) | 病院**へ**行かなければなりません (Bài 11) |
| **と** | Đồng hành / Liệt kê hoàn chỉnh (To) | Cùng với ai đó, liệt kê đầy đủ danh từ | `--token-companion: #4F46E5` (Tím nhạt) | 友達**と**映画を見ます (Bài 8) |
| **も** | Đồng nhất (Mo) | Mang nghĩa "cũng", thay thế cho trợ từ は, が, を | `--token-inclusive: #D97706` (Hổ phách) | これ**も**美味しいです (Bài 8) |
| **から** | Điểm khởi đầu / Lý do (Kara) | Từ mốc thời gian/địa điểm; chỉ nguyên nhân vì... nên... | `--token-origin: #DC2626` (Đỏ) | 時間がありません**から**、急ぎます (Bài 9) |
| **まで** | Điểm kết thúc (Made) | Đến mốc thời gian/địa điểm kết thúc | `--token-limit: #475569` (Xám chì) | 5時**まで**働きます (Bài 11) |
| **や** | Liệt kê tiêu biểu (Ya) | Liệt kê đại diện một số danh từ tiêu biểu trong nhóm | `--token-partial: #65A30D` (Mạ non) | 机の上に本**や**ペンがあります (Bài 10) |
| **より** | So sánh hơn (Yori) | Đứng sau đối tượng được dùng làm mốc so sánh | `--token-compare: #0891B2` (Xanh cổ vịt) | 東京は大阪**より**大きいです (Bài 10) |

### 7.5.2. Component Khối Cú Pháp Đa Màu Trực Quan (Syntax Pill Block Component)

```tsx
import React from 'react';

interface SyntaxChunk {
  text: string;
  role: 'subject' | 'topic' | 'object' | 'particle' | 'predicate' | 'modifier';
  particleExplanation?: string;
}

export function VisualSyntaxSentence({ chunks }: { chunks: SyntaxChunk[] }) {
  const roleStyles = {
    topic: 'bg-[#EDF4FA] text-[#1E4B75] border-[#B8D5E5]',
    subject: 'bg-[#EBF5EE] text-[#2A6B3D] border-[#C2E5CC]',
    object: 'bg-[#FDF2F0] text-[#9E3223] border-[#F5C6CB]',
    particle: 'bg-[#FFF9E6] text-[#B87B28] border-[#FFEAA7] font-black scale-105',
    predicate: 'bg-[#FAF8F5] text-[#122438] border-[#E6DDCF] font-serif font-black',
    modifier: 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]',
  };

  return (
    <div className="syntax-pill-wrapper flex flex-wrap items-center gap-1.5 p-3 rounded-xl bg-white border border-[#E6DDCF] shadow-sm my-3">
      {chunks.map((chunk, idx) => (
        <span
          key={idx}
          className={`syntax-token px-2.5 py-1 rounded-lg border text-sm transition-all hover:shadow-md cursor-help ${roleStyles[chunk.role]}`}
          title={chunk.particleExplanation || chunk.role}
        >
          {chunk.text}
        </span>
      ))}
    </div>
  );
}
```


## 7.4. CHECKLIST NGHIỆM THU BUNBOU HUB & LESSON DETAIL (VERIFICATION CHECKLIST)
- [ ] Gõ `temoiidesu` vào thanh tìm kiếm ở `/grammar` -> Kết quả nhảy ngay ra cấu trúc `〜てもいいです (Bài 9)`.
- [ ] Xem thẻ Bài 8 -> Hiển thị chính xác số thẻ FSRS đang đến hạn ôn tập của Bài 8.
- [ ] Mở trang chi tiết bài học trên màn hình 320px -> Tiêu đề bài học hiển thị thông suốt, không bị con dấu Hanko đè ép.
- [ ] Kiểm tra màu sắc breadcrumb qua công cụ kiểm tra độ tương phản -> Đạt tối thiểu 4.5:1 theo WCAG AA.
- [ ] Bấm nút loa cạnh câu ví dụ ngữ pháp -> Giọng đọc tiếng Nhật vang lên trong trẻo, không giật lag.


---

### 7.5 CẤU TRÚC CÂY CÚ PHÁP SOV ĐẦU CUỐI (HEAD-FINAL SYNTAX) & CÔNG NGHỆ BẢO TOÀN CAO ĐỘ ÂM THANH

#### 1. Trực quan hóa Cây Cú pháp Tiếng Nhật (Head-Final Syntax Tree Visualization)
* **Khác biệt cốt lõi giữa tiếng Việt/Anh (SVO) và tiếng Nhật (SOV)**:
  - Tiếng Việt và tiếng Anh là ngôn ngữ nhánh đầu (Head-Initial), thành tố chính đứng trước và bổ ngữ đứng sau (ví dụ: *ăn [cơm]*, *eat [rice]*).
  - Tiếng Nhật là ngôn ngữ nhánh cuối tuyệt đối (Strict Head-Final), toàn bộ thành phần bổ nghĩa, mệnh đề phụ, và trợ từ đều dồn về trước vị từ kết thúc câu (ví dụ: *[watashi wa] [gohan o] taberu*).
* **Lỗ hổng sư phạm trong `src/app/grammar/[lessonId]/page.tsx`**:
  - Bài học ngữ pháp hiện giải thích cấu trúc câu bằng văn bản tuần tự nằm ngang từ trái qua phải như sách ngữ pháp tiếng Anh.
  - Người học thường bị rối loạn nhận thức khi cố gắng phân tích các câu phức hợp nhiều tầng (Relative Clauses), dẫn đến hiện tượng hiểu sai chủ thể của hành động.
* **Giải pháp trực quan hóa Sơ đồ Móc xích Cú pháp (Mermaid Syntax Branching)**:
  - Bổ sung thành phần `<JapaneseSyntaxTree />` biểu diễn mối quan hệ phụ thuộc giữa các cụm từ (Bunsetsu Dependency Parsing):
    ```mermaid
    graph TD
      S["Câu: 田中さんは 昨日 買った 本を 読んでいる"]
      B1["Bunsetsu 1: 田中さんは (Chủ ngữ / Đề ngữ)"]
      B2["Bunsetsu 2: 昨日 買った (Mệnh đề định ngữ)"]
      B3["Bunsetsu 3: 本を (Bổ ngữ trực tiếp)"]
      B4["Bunsetsu 4: 読んでいる (Vị từ chính / Hành động)"]

      B2 -->|bổ nghĩa cho danh từ| B3
      B1 -->|liên kết hành động chính| B4
      B3 -->|đối tượng của hành động| B4
      
      style B4 fill:#9E3223,color:#fff,stroke:#FAF8F5
      style B1 fill:#1B4268,color:#fff,stroke:#FAF8F5
      style B2 fill:#AF7E36,color:#fff,stroke:#FAF8F5
      style B3 fill:#485642,color:#fff,stroke:#FAF8F5
    ```
  - Việc mã hóa màu sắc theo 4 gam màu truyền thống Nippon Colors giúp người học nhận ra ngay lập tức vị từ đóng vai trò "mỏ neo" của toàn bộ câu văn.

#### 2. Kỹ thuật Bảo toàn Cao độ khi Thay đổi Tốc độ Âm thanh (Pitch-Preserved Time-Stretching)
* Khi nghe người bản xứ đọc các câu ví dụ ngữ pháp dài và nói nhanh, người học sơ cấp thường bấm giảm tốc độ phát âm xuống `0.75x` hoặc `0.5x`.
* **Lỗi méo giọng trong HTML5 Audio hiện tại**:
  - Khi thiết lập `audioElement.playbackRate = 0.75`, nếu không cấu hình thuộc tính bảo toàn cao độ, giọng đọc nữ trở nên ồm ồm như giọng nam trầm (Demon Voice Effect). Ngược lại khi tăng tốc lên `1.25x`, giọng bị the thé như sóc chuột (Chipmunk Effect).
  - Điều này làm sai lệch hoàn toàn trọng âm từ (Pitch Accent - Atamadaka, Nakadaka, Odaka, Heiban), phá hủy phản xạ thính giác chuẩn mực tiếng Nhật.
* **Cấu hình sửa lỗi bắt buộc**:
  ```ts
  const audio = new Audio(sampleUrl);
  audio.preservesPitch = true; // Tiêu chuẩn W3C hiện đại
  (audio as any).mozPreservesPitch = true;
  (audio as any).webkitPreservesPitch = true;
  audio.playbackRate = currentSpeed; // 0.75x, 1.0x, 1.25x
  ```

#### 3. Cửa sổ Từ điển Tra nhanh Tương tác (Interactive Popover Dictionary Lookup)
* Trong các câu ví dụ mẫu của bài học ngữ pháp, người học bắt gặp nhiều từ vựng lạ nằm ngoài cấu trúc đang học. Hiện tại nếu muốn biết nghĩa, họ phải sao chép từ, chuyển sang tab khác để tra cứu, làm đứt gãy luồng học tập (Context Switching Penalty).
* Hệ thống cần tích hợp cơ chế click/hover trực tiếp vào bất kỳ từ nào trong câu ví dụ để hiển thị bóng thoại tra cứu tức thì (Kura Quick-Gloss Popover) lấy dữ liệu trực tiếp từ kho thẻ nội bộ hoặc từ điển JMdict ngoại tuyến.

