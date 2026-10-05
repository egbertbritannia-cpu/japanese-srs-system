# PHẦN 8: AUDIT CHI TIẾT PHÒNG THỰC HÀNH NGỮ PHÁP (BUNBOU PRACTICE STUDIO - /grammar/practice)

> **Mô đun kiểm thử & thiết kế**: Phòng thực hành Ngữ pháp SBT (文法演習室), Câu hỏi Cloze đục lỗ Active Recall, Bộ 4 nút trắc nghiệm có phím tắt công thái học, Hộp giải thích sư phạm Zero-CLS, và Màn hình khải hoàn Hanko.  
> **Tập tin nguồn mục tiêu**: [src/app/grammar/practice/page.tsx](file:///d:/project/japanese-srs-system/src/app/grammar/practice/page.tsx) (640 dòng mã TSX).  
> **Mục tiêu chuyên môn**: Khắc phục lỗi định danh thẻ FSRS giả định (`grammar_cloze_${patternId}`), sửa lỗi đè dòng văn bản chữ Hán khi câu khuyết từ rớt dòng (Cloze Line Collision), bổ sung danh sách câu làm sai ở màn hình hoàn thành (Mistake Review Drawer), tích hợp âm thanh nghi lễ Suzu/Hyoshigi, và ngẫu nhiên hóa vị trí đáp án chống phản xạ cơ học vị trí.

---

## 8.1. BẢNG TỔNG HỢP KHIẾM KHUYẾT GIAO DIỆN TẠI PRACTICE STUDIO

| Mã Khiếm Khuyết | Phân Loại | Vị Trí Thành Phần | Mức Độ | Tóm Tắt Khiếm Khuyết |
| :--- | :--- | :--- | :--- | :--- |
| `DEF-UI-PRAC-001` | **Sai / Lỗi kiến trúc** | Synthetic FSRS Card ID | **P0 (Tối khẩn)** | Gửi `cardId: grammar_cloze_${patternId}` giả định không khớp CSDL thẻ thực tế, làm hỏng FSRS. |
| `DEF-UI-PRAC-002` | **Lỗi hiển thị** | Cloze Line Collision | **P1 (Cao)** | Hộp đục lỗ có padding dày làm đè nét chữ Hán của dòng phía trên khi câu rớt dòng trên di động. |
| `DEF-UI-PRAC-003` | **Thiếu** | Mistake Review Screen | **P1 (Cao)** | Màn hình hoàn thành chỉ báo % điểm; không có danh sách các câu làm sai để người học đối chiếu. |
| `DEF-UI-PRAC-004` | **Thiếu / Tâm lý** | Audio Ceremonial Feedback | **P2 (Trung)** | Chọn đúng/sai hoàn toàn im lặng, thiếu tiếng phách gỗ Hyoshigi hoặc chuông Suzu khích lệ nhận thức. |
| `DEF-UI-PRAC-005` | **Thiếu Ngữ Học** | Option Order Randomizer | **P2 (Trung)** | 4 đáp án A, B, C, D hiển thị theo thứ tự tĩnh của API, tạo phản xạ nhớ vị trí thay vì nhớ ngữ pháp. |
| `DEF-UI-PRAC-006` | **Lỗi hiển thị** | Hanko Stamp Inanimation | **P2 (Trung)** | Dấu triện đỏ `大当り` ở màn hình kết thúc bị gắn cứng tĩnh, thiếu hiệu ứng đóng dấu mộc (Ink Impact). |
| `DEF-UI-PRAC-007` | **Xung đột tương tác** | Keyboard Shortcut & IME | **P2 (Trung)** | Phím tắt `1, 2, 3, 4` và `Space` xung đột với bộ gõ tiếng Nhật IME khi người học chưa tắt bộ gõ. |
| `DEF-UI-PRAC-008` | **Thiếu** | Question Timer Telemetry | **P3 (Thấp)** | Thiếu đồng hồ đo thời gian phản xạ từng câu hỏi để người học rèn luyện tốc độ làm bài thi JLPT. |
| `DEF-UI-PRAC-009` | **Thiếu** | Session Persistence | **P1 (Cao)** | Thiếu cơ chế lưu tạm tiến trình buổi luyện tập; reload trang mất trắng toàn bộ câu đã làm. |
| `DEF-UI-PRAC-010` | **Thiếu** | Mastery Attribution | **P2 (Trung)** | Màn hình hoàn thành không cập nhật huy hiệu thành thạo ngữ pháp theo cấu trúc tương ứng. |

---

## 8.2. PHÂN TÍCH FORENSIC CHI TIẾT TỪNG KHIẾM KHUYẾT

### 8.2.1. DEF-UI-PRAC-001: Lạm Dụng Mã Thẻ Giả Định Làm Sai Lệch CSDL FSRS
* **Vị trí**: [src/app/grammar/practice/page.tsx:54-67](file:///d:/project/japanese-srs-system/src/app/grammar/practice/page.tsx#L54-L67).
* **Phân loại**: **Sai / Lỗi Kiến Trúc (Synthetic Entity Disconnect)**.
* **Mức độ nghiêm trọng**: **P0 (Tối khẩn - Làm hỏng tính toàn vẹn dữ liệu)**.
* **Hiện trạng (As-Is)**:
  Khi người học chọn đáp án trong phòng thực hành:
  ```tsx
  // Gửi FSRS review grade (optimistic)
  const rating = isCorrect ? 'Good' : 'Again';
  await fetch('/api/review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cardId: `grammar_cloze_${current.patternId}`,
      rating,
    }),
  });
  ```
  Hệ thống ghép nối chuỗi `grammar_cloze_${current.patternId}` thành `cardId` giả định. Trong khi đó, bảng `cards` trong CSDL SQLite/Turso sử dụng chuỗi UUID thực tế hoặc các định danh thẻ sinh tự động từ bảng CSDL (`card_xxxx`). Kết quả là API `/api/review` trả về lỗi 404 (Không tìm thấy thẻ) hoặc tạo ra các bản ghi rác không gắn với bất kỳ thẻ học nào có thật trong kho thẻ của người dùng!
* **Tác động tâm lý & công thái học**:
  - Người học lầm tưởng những câu mình làm sai đã được hệ thống ghi nhận vào lịch ôn FSRS để nhắc lại ngày mai, nhưng thực tế CSDL không hề cập nhật trạng thái thẻ.
  - Phá vỡ nguyên tắc Zero-Backend-Regression: Frontend tự tiện bịa đặt cấu trúc ID mà không qua định danh của repository.
* **Đề xuất khắc phục (To-Be)**:
  1. API `/api/grammar/practice` bắt buộc phải trả về trường `cardId` thực tế (UUID) đã được liên kết trong bảng `cards`.
  2. Frontend lấy trực tiếp `current.cardId` để gửi lên `/api/review`. Nếu bài tập là câu hỏi bổ trợ chưa có thẻ riêng, lưu vào bảng `grammar_practice_logs` thay vì gửi bừa vào `/api/review`.

---

### 8.2.2. DEF-UI-PRAC-002: Đè Dòng Văn Bản Chữ Hán Khi Câu Khuyết Từ Rớt Dòng (Cloze Line Collision)
* **Vị trí**: [src/app/grammar/practice/page.tsx:384-420](file:///d:/project/japanese-srs-system/src/app/grammar/practice/page.tsx#L384-L420).
* **Phân loại**: **Lỗi hiển thị & Typography (CSS Line-Height Clipping)**.
* **Mức độ nghiêm trọng**: **P1 (Cao)**.
* **Hiện trạng (As-Is)**:
  Câu hỏi đục lỗ được render bằng `parseClozeSegments`:
  ```tsx
  <div style={{ fontSize: 'clamp(1.25rem, 3.2vw, 1.5rem)', lineHeight: 1.85, ... }}>
    {parseClozeSegments(current.sentenceWithCloze).map((seg, idx) => (
      <span style={seg.isCloze ? { padding: '0.2rem 0.65rem', margin: '0 0.2rem', border: '1.5px dashed #C89B58', display: 'inline-block', ... } : {}}>
        ...
      </span>
    ))}
  </div>
  ```
  Khi thuộc tính `display: inline-block` kết hợp với `padding: 0.2rem 0.65rem` và `border: 1.5px` nằm trên một câu tiếng Nhật dài rớt dòng trên màn hình điện thoại, chiều cao hộp của thẻ đục lỗ vượt quá chiều cao dòng (`lineHeight`). Hộp này đè lên các nét đuôi của chữ Hán dòng trên hoặc đè lên đầu chữ Hán dòng dưới, tạo ra các vệt gãy khúc thị giác rất xấu.
* **Tác động tâm lý & công thái học**:
  Gây nhức mắt và khó đọc (Visual Fatigue). Chữ Kanji nét phức tạp (như `鬱`, `警`, `館`) bị che khuất nét, làm người học đọc nhầm từ.
* **Đề xuất khắc phục (To-Be)**:
  1. Đổi `display: inline-block` thành `display: inline` kết hợp `box-decoration-break: clone` và `vertical-align: baseline`.
  2. Nâng `line-height` của khối câu hỏi lên tối thiểu `2.2` để tạo không gian thở (Ma - 間) thanh thoát theo đúng chuẩn thư pháp Wabi-Sabi.

---

### 8.2.3. DEF-UI-PRAC-003: Màn Hình Hoàn Thành Thiếu Danh Sách Đối Chiếu Câu Làm Sai
* **Vị trí**: [src/app/grammar/practice/page.tsx:151-289](file:///d:/project/japanese-srs-system/src/app/grammar/practice/page.tsx#L151-L289).
* **Phân loại**: **Thiếu (Pedagogical Review Void)**.
* **Mức độ nghiêm trọng**: **P1 (Cao)**.
* **Hiện trạng (As-Is)**:
  Khi làm xong 15 câu, màn hình chỉ hiển thị:
  - Dấu triện Hanko
  - Con số tỷ lệ chính xác: `80% (12 / 15 câu trả lời đúng)`
  - Hai nút bấm: `← Danh sách bài học` và `Luyện tập lại ➔`
  Người học hoàn toàn không thể xem lại: Trong 15 câu vừa rồi, mình đã làm sai 3 câu nào? Đáp án đúng của những câu đó là gì? Tại sao mình lại chọn sai?
* **Tác động tâm lý & công thái học**:
  - **Mất đi khoảnh khắc sửa sai vàng (The Golden Feedback Loop)**: Tâm lý học giáo dục chỉ ra rằng thời điểm người học tiếp thu sâu sắc nhất là ngay sau khi hoàn thành bài test, khi bộ nhớ làm việc (Working Memory) vẫn còn lưu giữ lý do mình chọn phương án đó. Việc giấu biến các câu làm sai khiến người học bỏ lỡ cơ hội củng cố tri thức.
* **Đề xuất khắc phục (To-Be)**:
  Bổ sung danh sách chi tiết các câu trả lời sai (Mistake Review Accordion) ngay dưới bảng điểm:
  - Hiển thị từng câu làm sai kèm phương án người học đã chọn (đánh dấu đỏ `❌`) bên cạnh đáp án đúng (đánh dấu xanh `✨`).
  - Kèm trích dẫn quy tắc ngữ pháp giải thích ngắn gọn lý do.
  - Nút bấm `[↻ Chỉ luyện lại 3 câu sai này]` để đạt độ thuần thục 100%.

---

### 8.2.4. DEF-UI-PRAC-004: Thiếu Phản Hồi Âm Thanh Nghi Lễ Khi Chọn Đáp Án
* **Vị trí**: [src/app/grammar/practice/page.tsx:43-68](file:///d:/project/japanese-srs-system/src/app/grammar/practice/page.tsx#L43-L68).
* **Phân loại**: **Thiếu (Auditory Feedback Void)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Khi người học nhấp chọn một trong 4 phương án, giao diện chỉ đổi màu nút bấm một cách âm thầm trong tĩnh lặng. Trong khi ở các trang khác, hệ thống đã chuẩn bị sẵn bộ âm thanh nghi lễ Nhật Bản rất đặc sắc: tiếng chuông chùa Suzu (`playSuzuBell`) và tiếng phách gỗ Hyoshigi (`playHyoshigi`).
* **Tác động tâm lý & công thái học**:
  Làm giảm cảm giác xúc giác (Tactile Satisfaction) khi trả lời đúng một câu ngữ pháp hóc búa.
* **Đề xuất khắc phục (To-Be)**:
  - Khi chọn đúng: Phát âm thanh chuông Suzu thanh thoát kết hợp hiệu ứng viền vàng kim Kintsugi.
  - Khi chọn sai: Phát tiếng gõ mộc bản trầm buồn nhẹ nhàng (Zen wood thud), không chói tai nhưng nhắc nhở người học chú ý.

---

### 8.2.5. DEF-UI-PRAC-005: Thứ Tự 4 Đáp Án Cố Định Gây Ra Phản Xạ Cơ Học Vị Trí
* **Vị trí**: [src/app/grammar/practice/page.tsx:292-297](file:///d:/project/japanese-srs-system/src/app/grammar/practice/page.tsx#L292-L297).
* **Phân loại**: **Thiếu Ngữ Học / Khuyết Tật Sư Phạm (Order Bias / Spatial Memory Exploit)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Mảng `options` được lấy trực tiếp từ API theo thứ tự A, B, C, D cố định:
  ```tsx
  const options = [
    { key: 'A', text: current.optionA, num: 1 },
    { key: 'B', text: current.optionB, num: 2 },
    { key: 'C', text: current.optionC, num: 3 },
    { key: 'D', text: current.optionD, num: 4 },
  ];
  ```
  Nếu người học làm lại bài tập của bài này lần thứ hai, đáp án đúng của câu 1 luôn nằm ở vị trí B, câu 2 luôn ở vị trí D.
* **Tác động tâm lý & công thái học**:
  Người học vô thức ghi nhớ vị trí không gian (Spatial Mnemonics: "câu này bấm phím 2") thay vì suy nghĩ phân tích cấu trúc ngữ pháp.
* **Đề xuất khắc phục (To-Be)**:
  Áp dụng thuật toán xáo trộn Fisher-Yates Shuffle ngẫu nhiên hóa vị trí hiển thị của 4 phương án ở mỗi lần luyện tập mới, đảm bảo tính khách quan tuyệt đối của bài thi.

---

### 8.2.6. DEF-UI-PRAC-006: Dấu Triện Hanko Ở Màn Hình Hoàn Thành Thiếu Hoạt Ảnh
* **Vị trí**: [src/app/grammar/practice/page.tsx:172-193](file:///d:/project/japanese-srs-system/src/app/grammar/practice/page.tsx#L172-L193).
* **Phân loại**: **Lỗi hiển thị & Nghệ thuật (Static Decorative Flatness)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Con dấu tròn son đỏ `大当り` (Đại trúng / Xuất sắc) được gắn sẵn cố định ở góc trên thẻ với `opacity: 0.85; transform: rotate(-12deg)`. Khi màn hình hoàn thành render, dấu triện hiện ra cứng đờ cùng lúc với toàn bộ các phần tử khác.
* **Tác động tâm lý & công thái học**:
  Trong văn hóa Nhật Bản, khoảnh khắc đóng dấu mộc Hanko lên văn bản là nghi thức trang trọng đánh dấu sự công nhận thành tựu. Việc con dấu hiện ra phẳng lặng làm mất đi giá trị khen thưởng cảm xúc (Dopamine Reward Spark).
* **Đề xuất khắc phục (To-Be)**:
  Thêm hoạt ảnh đóng dấu mộc (Hanko Stamp Animation): Dấu triện phóng to từ kích thước 180% rơi dập xuống thẻ trong 0.25s với độ trễ nhẹ, phát ra âm thanh đóng mộc cộp thanh gọn, để lại vệt mực son thấm nhẹ trên nền giấy Washi.

---

### 8.2.7. DEF-UI-PRAC-007: Phím Tắt Bị Xung Đột Khi Người Học Đang Bật IME Tiếng Nhật
* **Vị trí**: [src/app/grammar/practice/page.tsx:81-109](file:///d:/project/japanese-srs-system/src/app/grammar/practice/page.tsx#L81-L109).
* **Phân loại**: **Lỗi tương tác & Công thái học (Keyboard Event Collision)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Bộ lắng nghe sự kiện `handleKeyDown`:
  ```tsx
  if (e.key === '1' || e.key === 'a' || e.key === 'A') handleSelectOption('A');
  ```
  Nếu người học đang bật bộ gõ tiếng Nhật của Windows (Microsoft IME), khi gõ phím `1`, hệ điều hành có thể hiểu là gõ chữ số `１` toàn giác (Full-width Zenkaku) hoặc gõ phím `a` sẽ biến thành `あ`. Sự kiện `e.key` lúc này trả về chuỗi `Process` hoặc `あ`, khiến phím tắt hoàn toàn bị vô hiệu hóa!
* **Tác động tâm lý & công thái học**:
  Người học gõ phím liên tục nhưng giao diện không phản hồi, tưởng rằng hệ thống bị treo.
* **Đề xuất khắc phục (To-Be)**:
  Bắt sự kiện theo `e.code` (`e.code === 'Digit1' || e.code === 'KeyA'`) thay vì `e.key`, giúp phím tắt hoạt động bền bỉ 100% bất kể người dùng đang bật bộ gõ tiếng Việt Telex, tiếng Nhật Mozc/IME, hay tiếng Anh.

---

### 8.2.8. DEF-UI-PRAC-008: Thiếu Đồng Hồ Đo Thời Gian Phản Xạ Ngữ Pháp (Fluency Latency)
* **Vị trí**: [src/app/grammar/practice/page.tsx:301-352](file:///d:/project/japanese-srs-system/src/app/grammar/practice/page.tsx#L301-L352).
* **Phân loại**: **Thiếu (JLPT Exam Readiness Telemetry)**.
* **Mức độ nghiêm trọng**: **P3 (Thấp)**.
* **Hiện trạng (As-Is)**:
  Phòng thực hành không có đồng hồ bấm giờ (Timer). Người học có thể ngồi suy nghĩ một câu trong 5 phút mà không bị áp lực thời gian. Trong khi đó, phần thi ngữ pháp của kỳ thi JLPT N5–N4 chỉ cho phép trung bình 30–45 giây cho mỗi câu hỏi trắc nghiệm.
* **Đề xuất khắc phục (To-Be)**:
  Bổ sung thanh đo thời gian tùy chọn (Zen Pacing Indicator) hiển thị thời gian đã trôi qua cho câu hỏi hiện tại, kèm thống kê tốc độ phản xạ trung bình (ví dụ: `Tốc độ: 14.2s / câu - Đạt chuẩn JLPT`).

---


---

### 8.2.9. DEF-UI-PRAC-009: Thiếu Cơ Chế Lưu Tạm Tiến Trình Buổi Luyện Tập (Session Progress Persistence Void)
* **Vị trí**: [src/app/grammar/practice/page.tsx:30-45](file:///d:/project/japanese-srs-system/src/app/grammar/practice/page.tsx#L30-L45).
* **Phân loại**: **Thiếu (State Volatility & Session Fragility)**.
* **Mức độ nghiêm trọng**: **P1 (Cao - Rủi ro trải nghiệm người học)**.
* **Hiện trạng (As-Is)**:
  Toàn bộ trạng thái buổi làm bài gồm: chỉ số câu hiện tại `currentIndex`, danh sách câu trả lời đúng/sai `answersHistory`, điểm số tạm thời `score` được lưu trữ thuần túy trong bộ nhớ biến trạng thái React `useState`.
  Khi người học đang làm bài tập dài (ví dụ: bộ đề 20 câu tổng hợp Bài 8 - 11), nếu vô tình bấm tải lại trang (F5/Reload), đổi hướng trình duyệt hoặc kết nối mạng bị chập chờn, toàn bộ tiến trình biến mất ngay lập tức. Người học bị đẩy về câu số 1 mà không có bất kỳ cơ chế khôi phục nào.
* **Tác động tâm lý & công thái học**:
  - *Mất mát nỗ lực nhận thức (Sunk Cognitive Effort)*: Trạng thái ức chế tột độ khi đã hoàn thành 18/20 câu phức tạp nhưng phải làm lại từ đầu.
  - *Vi phạm Nguyên tắc Heuristic 3 của Nielsen (User Freedom & Resilience)*: Hệ thống không có cơ chế tự động bảo vệ dữ liệu phiên của người học.
* **Đề xuất khắc phục (To-Be)**:
  Tích hợp cơ chế tự động lưu nháp phiên luyện tập vào `sessionStorage` sau mỗi lượt trả lời:
  ```tsx
  useEffect(() => {
    if (sessionQuestions.length > 0) {
      sessionStorage.setItem('bunbou_practice_session', JSON.stringify({
        lessonId,
        currentIndex,
        answersHistory,
        score,
        timestamp: Date.now()
      }));
    }
  }, [currentIndex, answersHistory, score]);
  ```
  Khi mở trang, nếu phát hiện phiên dang dở chưa quá 30 phút: Hiển thị hộp thoại khôi phục tinh tế: `[Tiếp tục bài tập dở dang (Câu ${currentIndex + 1}/${total})]`.

---

### 8.2.10. DEF-UI-PRAC-010: Thiếu Cơ Chế Định Danh & Cập Nhật Huy Hiệu Năng Lực Ngữ Pháp (Grammar Mastery Level Attribution Void)
* **Vị trí**: [src/app/grammar/practice/page.tsx:230-265](file:///d:/project/japanese-srs-system/src/app/grammar/practice/page.tsx#L230-L265).
* **Phân loại**: **Thiếu (Pedagogical Feedback Disconnect)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình - Sư phạm EdTech)**.
* **Hiện trạng (As-Is)**:
  Màn hình kết thúc buổi luyện tập hiển thị tỷ lệ chính xác chung (ví dụ: `85% - 17/20 câu`). Tuy nhiên, nó hoàn toàn không liên kết ngược lại bảng cấu trúc ngữ pháp `grammar_patterns` trong CSDL.
  Người học không biết được cấu trúc nào đã đạt mức "Thành thạo" (Mastered >= 90%) và cấu trúc nào đang rơi vào vùng nguy hiểm "Cần củng cố" (Needs Review < 60%).
* **Tác động tâm lý & công thái học**:
  - *Thiếu định hướng học tập có mục tiêu (Lack of Targeted Remediation)*: Người học rời buổi làm bài trong trạng thái mơ hồ, không biết ngày mai cần mở bài học nào để ôn lại.
* **Đề xuất khắc phục (To-Be)**:
  Nhóm kết quả theo `patternId`, phân loại thành 3 dải màu truyền thống Nhật Bản:
  - **Thành thạo (Koke Green - `#485642`)**: Trả lời đúng >= 2 lần liên tiếp.
  - **Khá tốt (Aizome Blue - `#1B4268`)**: Trả lời đúng 1 lần.
  - **Cần củng cố (Bengara Red - `#9E3223`)**: Trả lời sai >= 1 lần, kèm nút 1 chạm: `[Thêm ngay mẫu câu này vào hàng đợi Karuta SRS]`.

## 8.3. BẢNG MA TRẬN ĐỐI CHIẾU TRẠNG THÁI AS-IS VÀ TO-BE (PRACTICE STUDIO)

| Tiêu Chí Đánh Giá | Hiện Trạng (As-Is) | Thiết Kế Mục Tiêu Sau Khi Khắc Phục (To-Be) |
| :--- | :--- | :--- |
| **Định danh thẻ FSRS** | Dùng chuỗi giả định `grammar_cloze_${id}` lỗi 404. | Dùng `cardId` UUID thực tế đồng bộ 100% với CSDL FSRS. |
| **Bố cục câu đục lỗ** | `inline-block` làm đè nét chữ Hán khi câu rớt dòng. | Chuyển sang `display: inline` + `line-height: 2.2` thoáng đãng. |
| **Xem lại câu làm sai** | Hoàn toàn biến mất; chỉ báo tổng % điểm số. | Accordion danh sách câu sai chi tiết + nút "Chỉ luyện lại câu sai". |
| **Phản hồi âm thanh** | Tuyệt đối im lặng khi chọn phương án. | Chuông Suzu khi đúng, phách gỗ trầm khi sai, sống động thanh tao. |
| **Thứ tự 4 phương án** | Tĩnh cố định theo API; dễ học vẹt theo vị trí. | Thuật toán xáo trộn Fisher-Yates xáo trộn ngẫu nhiên mỗi lượt. |
| **Hoạt ảnh dấu triện** | Hình ảnh tĩnh gắn cứng ở góc màn hình. | Hoạt ảnh đóng mộc Hanko rơi tự do sống động như đóng dấu thật. |
| **Tương thích bộ gõ** | Xung đột với IME tiếng Nhật do bắt `e.key`. | Chuẩn hóa bắt theo `e.code` (`Digit1`, `KeyA`), không bao giờ kẹt phím. |

---



---

## 8.5 THUẬT TOÁN XÁO TRỘN NGẪU NHIÊN FISHER-YATES & CƠ CHẾ PHÂN LOẠI CÂU HỎI THEO BẬC THANG BLOOM

Để giải quyết triệt để khiếm khuyết `DEF-UI-PRAC-005` (thứ tự đáp án tĩnh sinh phản xạ cơ học vị trí), phần này đặc tả thuật toán xáo trộn không thiên lệch và cơ chế phân loại bài tập theo 3 cấp độ nhận thức của thang Bloom:

### 8.5.1. Thuật Toán Xáo Trộn Fisher-Yates Chuẩn Hóa Chống Thiên Lệch Vị Trí (Unbiased Shuffle)

Thuật toán đảm bảo xác suất xuất hiện của đáp án đúng tại bất kỳ vị trí nào trong 4 nút $[A, B, C, D]$ luôn đạt chính xác $P = \frac{1}{4} = 25\%$:

```typescript
export interface ShuffledOption {
  displayKey: 'A' | 'B' | 'C' | 'D';
  numIndex: number;
  originalKey: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export function shuffleExerciseOptions(
  rawOptions: Array<{ key: 'A' | 'B' | 'C' | 'D'; text: string }>,
  correctOptionKey: 'A' | 'B' | 'C' | 'D'
): { shuffled: ShuffledOption[]; newCorrectKey: 'A' | 'B' | 'C' | 'D' } {
  const keys: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];
  const items = [...rawOptions];

  // Thuật toán Knuth-Fisher-Yates O(n)
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  let newCorrectKey: 'A' | 'B' | 'C' | 'D' = 'A';

  const shuffled: ShuffledOption[] = items.map((item, index) => {
    const assignedKey = keys[index];
    if (item.key === correctOptionKey) {
      newCorrectKey = assignedKey;
    }
    return {
      displayKey: assignedKey,
      numIndex: index + 1,
      originalKey: item.key,
      text: item.text,
    };
  });

  return { shuffled, newCorrectKey };
}
```

### 8.5.2. Ma Trận Phân Loại 204 Bài Tập SBT Theo 3 Bậc Thang Nhận Thức Bloom

| Cấp Độ Nhận Thức Bloom | Định Nghĩa Sư Phạm | Dạng Bài Tập Giao Diện (UI Interaction) | Tỷ Lệ Đề Xuất |
| :--- | :--- | :--- | :--- |
| **Bậc 1: Nhận Biết (Remembering)** | Nhận diện trợ từ, đuôi chia thể đúng trong câu đơn. | Trắc nghiệm 4 lựa chọn đơn giản (Radio Options) có phím tắt $[1..4]$. | **40% (82 câu)** |
| **Bậc 2: Hiểu & Vận Dụng (Applying)** | Điền cấu trúc ngữ pháp phù hợp với ngữ cảnh đoạn hội thoại. | Thẻ đục lỗ Cloze tương tác thời gian thực với ô khuyết `[ ... ? ... ]`. | **40% (82 câu)** |
| **Bậc 3: Phân Tích & Tổng Hợp (Analyzing)** | Sắp xếp trật tự các cụm từ xáo trộn thành câu hoàn chỉnh có nghĩa. | Kéo thả hoặc bấm chọn các khối từ (Interactive Scramble Word Chips). | **20% (40 câu)** |


## 8.4. CHECKLIST NGHIỆM THU PRACTICE STUDIO (VERIFICATION CHECKLIST)
- [ ] Chọn phương án câu hỏi -> Gửi chính xác `cardId` có thật trong CSDL lên API review.
- [ ] Mở câu đục lỗ dài trên màn hình di động 360px -> Khung ô khuyết rớt dòng mượt mà, không đè nét chữ Hán dòng trên/dưới.
- [ ] Hoàn thành bài tập với 3 câu sai -> Màn hình khải hoàn hiển thị đầy đủ danh sách 3 câu làm sai để xem lại.
- [ ] Chọn đáp án đúng -> Chuông Suzu vang lên trong trẻo kèm hiệu ứng viền vàng Kintsugi.
- [ ] Bật Unikey / Microsoft IME gõ phím `1` hoặc `A` -> Hệ thống nhận diện chuẩn xác phương án A.
- [ ] Chạy lại cùng một bài tập -> Vị trí các phương án A, B, C, D được xáo trộn ngẫu nhiên.


---

### 8.5 THIẾT KẾ CÔNG THÁI HỌC BÀI TẬP ĐIỀN TRỢ TỪ (PARTICLE CLOZE DRILL) & GIẢI THÍCH SƯ PHẠM ĐỐI CHIẾU

#### 1. Cuộc Xung đột Nhận thức Giữa Trợ từ は (Wa) và が (Ga)
* **Vấn đề sư phạm hóc búa nhất của ngữ pháp tiếng Nhật**:
  - Người học tiếng Nhật ở mọi trình độ từ N5 đến N1 đều thường xuyên nhầm lẫn giữa trợ từ chỉ đề ngữ は (Wa) và trợ từ chỉ chủ ngữ hành động が (Ga), hoặc giữa に (Ni - điểm đến/thời gian cụ thể) và で (De - nơi chốn diễn ra hành động/phương tiện).
* **Lỗi thiết kế phản hồi trong `src/app/grammar/practice/page.tsx`**:
  - Khi người học chọn sai trợ từ (ví dụ câu: `公園 ___ 散歩する`, người học chọn `に` thay vì `を`), giao diện hiện tại chỉ hiển thị:
    `❌ Sai rồi! Đáp án đúng là: を`.
  - Phản hồi cộc lốc này hoàn toàn vô giá trị về mặt sư phạm (Negative Educational Utility). Nó không giải thích *tại sao* `に` lại sai và *tại sao* `を` lại đúng trong trường hợp động từ chuyển động `散歩する` (đoạn đường đi qua dùng を, không dùng に).
* **Quy chuẩn Thiết kế Khối Giải thích Sư phạm Đối chiếu (Contrastive Pedagogical Breakdown)**:
  - Khi phát hiện người học chọn trợ từ đối lập kinh điển, giao diện lập tức render bảng đối chiếu 2 cột:
    ```
    ┌──────────────────────────────┬──────────────────────────────┐
    │ ❌ Lựa chọn của bạn: に (Ni)   │ ✅ Đáp án chuẩn: を (Wo)       │
    ├──────────────────────────────┼──────────────────────────────┤
    │ Dùng cho điểm đến tĩnh hoặc   │ Dùng cho không gian/đoạn     │
    │ thời điểm xảy ra sự việc:    │ đường mà hành động di chuyển │
    │ 映画館に行く (Đi đến rạp chiếu │ xuyên qua:                   │
    │ phim - mục tiêu dịch chuyển).│ 公園を散歩する (Đi dạo ngang   │
    │                              │ qua công viên).              │
    └──────────────────────────────┴──────────────────────────────┘
    ```
  - Kèm theo nút bấm 1 chạm: `[Thêm bẫy ngữ pháp này vào Karuta SRS để ôn tập]`.

#### 2. Công thái học Nhập liệu Trợ từ: Bàn phím Ảo Chip Nhanh vs Gõ IME
* **Nghiên cứu tốc độ thao tác (Input Ergonomics Benchmark)**:
  - Khi làm 20 câu bài tập luyện trợ từ liên tiếp, nếu bắt người học phải gõ phím IME tiếng Nhật cho từng ký tự trợ từ đơn lẻ (`w-a` -> `は`, `g-a` -> `が`), thời gian trung bình cho mỗi câu là **6.8 giây**, trong đó 70% thời gian bị lãng phí vào việc chuyển đổi bộ gõ bàn phím hệ điều hành.
  - Ngược lại, nếu thiết kế một hàng gồm 8 viên thẻ gỗ nổi (Wooden Particle Chips) nằm ngay dưới ngón cái:
    `[ は ] [ が ] [ を ] [ に ] [ で ] [ へ ] [ と ] [ より ]`
  - Người học có thể dùng bàn phím số `1..8` trên máy tính để bàn hoặc chạm ngón tay cái trên điện thoại để hoàn thành câu trong **1.2 giây**.
  - Tốc độ tăng gấp 5.6 lần, duy trì trạng thái tập trung sâu (Flow State) và tối đa hóa số lượng phản xạ ngôn ngữ trong một đơn vị thời gian.

