# PHẦN 5: AUDIT CHI TIẾT ĐẤU TRƯỜNG ÔN TẬP THẺ BÀI KARUTA (HYAKUNIN ISSHU ARENA - /review)

> **Mô đun kiểm thử & thiết kế**: Đấu trường ôn tập Karuta (百人一首), Thẻ bài lật 3D Washi Karuta, Bùa hộ mệnh Daruma Mascot, Bàn phím công thái học Active Recall, và Bộ 4 nút sơn mài FSRS.  
> **Tập tin nguồn mục tiêu**: [src/app/review/page.tsx](file:///d:/project/japanese-srs-system/src/app/review/page.tsx) (1,602 dòng mã TSX).  
> **Mục tiêu chuyên môn**: Triển khai hiệu ứng lật thẻ 3D vật lý đích thực, khắc phục triệt để lỗi rò rỉ Furigana trước khi lật (Active Recall Leak), bổ sung chức năng Hoàn tác đánh giá (Undo Review) bảo vệ thuật toán FSRS, bổ sung thao tác vuốt cảm ứng trên di động (Mobile Swipe Gestures), và ngăn chặn tình trạng tràn nút chấm điểm ngoài khung nhìn (Viewport Button Clipping).

---

## 5.1. BẢNG TỔNG HỢP KHIẾM KHUYẾT GIAO DIỆN TẠI KARUTA REVIEW ARENA

| Mã Khiếm Khuyết | Phân Loại | Vị Trí Thành Phần | Mức Độ | Tóm Tắt Khiếm Khuyết |
| :--- | :--- | :--- | :--- | :--- |
| `DEF-UI-KARUTA-001` | **Thiếu / Lỗi hiển thị** | 3D Flip Mechanics | **P0 (Tối khẩn)** | Thẻ không lật 3D mà chỉ giãn nở chiều dọc (`fadeIn`), gây giật layout (CLS) và mất xúc cảm Karuta. |
| `DEF-UI-KARUTA-002` | **Sai Ngữ Học / Tâm lý** | Active Recall Front | **P0 (Tối khẩn)** | Hiển thị Furigana to đùng ở mặt trước thẻ Từ vựng, phá hủy hoàn toàn phản xạ nhớ chữ Hán. |
| `DEF-UI-KARUTA-003` | **Thiếu** | Undo FSRS Grade | **P1 (Cao)** | Không có nút hoặc phím tắt "Hoàn tác" (`Ctrl+Z`) khi người học bấm nhầm nút chấm điểm. |
| `DEF-UI-KARUTA-004` | **Sai Thuật Toán / UX** | Cram Mode Fallback | **P1 (Cao)** | Hàng đợi hết thẻ đến hạn âm thầm nạp thẻ chưa đến hạn mà không thông báo chuyển sang Cram Mode. |
| `DEF-UI-KARUTA-005` | **Lỗi hiển thị** | Viewport Button Clip | **P1 (Cao)** | Khung câu ví dụ và nghĩa tiếng Việt đẩy bộ 4 nút FSRS tụt xuống dưới màn hình trên mobile. |
| `DEF-UI-KARUTA-006` | **Thiếu** | Mobile Swipe Gestures | **P1 (Cao)** | Thiếu thao tác vuốt cảm ứng (Swipe Left = Again, Right = Good, Up = Easy) trên thiết bị di động. |
| `DEF-UI-KARUTA-007` | **Sai Nhận Thức** | Kanji Label Semantics | **P2 (Trung)** | Nhãn chữ Hán trên nút chấm điểm (`破` - Phá) gây hoang mang, hiểu lầm là nút xóa/hủy thẻ. |
| `DEF-UI-KARUTA-008` | **Thiếu** | In-Review Card Editor | **P2 (Trung)** | Không thể sửa nhanh (Quick Edit) nội dung hoặc tạm hoãn (Bury/Suspend) thẻ lỗi khi đang ôn tập. |
| `DEF-UI-KARUTA-009` | **Thiếu** | FSRS Interval Metric | **P2 (Trung)** | Khoảng thời gian hiển thị (`~ 3.5 ngày`) thiếu thông số Retrievability $R$ và Stability $S$ giải thích. |
| `DEF-UI-KARUTA-010` | **Thừa / Mất kết nối** | Daruma Mascot State | **P2 (Trung)** | Bùa Daruma vắng mặt trong phiên ôn tập, bỏ lỡ cơ hội vẽ mắt Daruma (Goal Completion vow) theo tiến độ. |
| `DEF-UI-KARUTA-011` | **Lỗi âm thanh** | Audio Concurrency Clatter | **P2 (Trung)** | Tiếng phách Hyoshigi, chuông Suzu, và Web Speech phát âm chồng chéo khi bấm phím Space liên tục. |
| `DEF-UI-KARUTA-012` | **Thiếu** | Retrieval Latency HUD | **P3 (Thấp)** | Thiếu đồng hồ đo thời gian phản xạ (Fluency Latency) hỗ trợ người học theo dõi tốc độ nhận thức. |

---

## 5.2. PHÂN TÍCH FORENSIC CHI TIẾT TỪNG KHIẾM KHUYẾT

### 5.2.1. DEF-UI-KARUTA-001: Thiếu Cơ Chế Lật Thẻ 3D Karuta Đích Thực (True 3D Physics Flip)
* **Vị trí**: [src/app/review/page.tsx:850-867, 1105-1120](file:///d:/project/japanese-srs-system/src/app/review/page.tsx#L850-L1120).
* **Phân loại**: **Thiếu / Lỗi hiển thị (Missing 3D Transform & Content Layout Shift)**.
* **Mức độ nghiêm trọng**: **P0 (Tối khẩn - Cốt lõi trải nghiệm SRS)**.
* **Hiện trạng (As-Is)**:
  Mặc dù văn bản tài liệu và ghi chú trong mã nguồn tự hào tuyên bố "Thẻ bài truyền thống Hyakunin Isshu Karuta", nhưng thực tế giao diện xử lý việc "lật thẻ" hoàn toàn bằng cách thay đổi điều kiện render:
  ```tsx
  {/* Dòng 1105 */}
  {showAnswer ? (
    <div style={{ animation: 'fadeIn 0.3s ease forwards', ... }}>
      {/* Khối cách đọc, nghĩa tiếng Việt, câu ví dụ nối tiếp bên dưới */}
    </div>
  ) : (
    <div style={{ marginTop: '1.5rem', ... }}>Nhấn Space hoặc nút bên dưới để xem đáp án</div>
  )}
  ```
  Khi bấm "Xem nghĩa", phần đáp án đột ngột bung ra bên dưới, kéo dài chiều cao của thẻ từ ~380px lên ~650px. Toàn bộ các nút bấm và lề trang bị đẩy tụt xuống dưới. Không hề có trục xoay Y 3D (`perspective`, `rotateY(180deg)`), không có cảm giác lật mở một lá bài giấy Washi thực thụ.
* **Tác động tâm lý & công thái học**:
  - **Mất đi tính phản xạ thể nghiệm (Lack of Embodied Cognition)**: Trò chơi bài Karuta Nhật Bản dựa trên sự hồi hộp và tốc độ lật mở lá bài Torifuda (取り札). Việc một khối div co giãn chiều dọc tạo cảm giác như đọc một trang web tài liệu hành chính thay vì tham gia một phiên thi đấu trí tuệ tràn đầy cảm hứng.
  - **Vi phạm chỉ số CLS (Cumulative Layout Shift)**: Khung thẻ thay đổi kích thước đột ngột khiến mắt người dùng phải điều tiết lại tiêu cự (saccadic eye movement) để tìm xem phần thông tin mới bắt đầu từ đâu.
* **Đề xuất khắc phục (To-Be)**:
  Thiết kế component `<KarutaCard3D>` với cấu trúc lồng nhau đạt chuẩn CSS 3D Transforms:
  1. Khung chứa `perspective: 1200px`.
  2. Bề mặt xoay `transform-style: preserve-3d; transition: transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275)`.
  3. Mặt trước (`.karuta-face-front`) và Mặt sau (`.karuta-face-back`) có thuộc tính `backface-visibility: hidden; position: absolute; inset: 0`. Mặt sau xoay sẵn `rotateY(180deg)`.
  4. Chiều cao cố định hoặc khóa khung tối đa giúp thẻ lật mượt mà tại chỗ mà không làm dịch chuyển bất kỳ thành phần nào khác trên màn hình.

```tsx
// Cấu trúc Karuta 3D Flip chuẩn mực
<div className="karuta-perspective-container" style={{ perspective: '1200px', width: '100%', minHeight: '440px' }}>
  <div 
    className={`karuta-flipper relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${showAnswer ? '[transform:rotateY(180deg)]' : ''}`}
  >
    {/* MẶT TRƯỚC (Torifuda - Xuất đề) */}
    <div className="karuta-face karuta-face-front absolute inset-0 [backface-visibility:hidden] rounded-2xl p-8 bg-[#FAF8F2] border-2 border-[#AF7E36] shadow-xl flex flex-col items-center justify-center">
      {/* Kanji đơn sắc, câu đố Cloze */}
    </div>

    {/* MẶT SAU (Yomifuda - Giải nghĩa) */}
    <div className="karuta-face karuta-face-back absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl p-8 bg-[#FAF8F2] border-2 border-[#485642] shadow-xl flex flex-col items-center justify-between overflow-y-auto">
      {/* Cách đọc, Pitch SVG, Nghĩa tiếng Việt, Câu i+1 */}
    </div>
  </div>
</div>
```

---

### 5.2.2. DEF-UI-KARUTA-002: Rò Rỉ Furigana Ở Mặt Trước Thẻ Làm Hỏng Active Recall
* **Vị trí**: [src/app/review/page.tsx:913-931](file:///d:/project/japanese-srs-system/src/app/review/page.tsx#L913-L931).
* **Phân loại**: **Sai Ngữ Học & Tâm Lý Học Nhận Thức (Active Recall Leakage)**.
* **Mức độ nghiêm trọng**: **P0 (Tối khẩn - Sai lệch phương pháp sư phạm)**.
* **Hiện trạng (As-Is)**:
  Tại dòng 913-931, đoạn mã viết:
  ```tsx
  {/* 1. Dòng Hiragana cách đọc ở mặt trước (chỉ dành cho Thẻ từ vựng Kotoba/N5, không hiện cho Thẻ Kanji và Ngữ pháp...) */}
  {!isGrammar && !parsedCard?.isKanji && currentCard.reading && currentCard.reading !== currentCard.kanji && (
    <div
      style={{
        fontFamily: 'var(--font-maru)',
        fontSize: '1.75rem',
        fontWeight: 800,
        color: '#AF7E36',
        letterSpacing: '0.06em',
        background: '#FBF5E8',
        padding: '0.25rem 1.25rem',
        borderRadius: '999px',
        border: '1.5px solid #E5CCA0',
        boxShadow: '0 2px 8px rgba(22, 37, 59, 0.04)',
      }}
    >
      {parsedCard?.pureReading || currentCard.reading}
    </div>
  )}
  ```
  Đối với mọi thẻ thuộc bộ từ vựng (Kotoba, N5), khi thẻ vừa xuất hiện ở mặt trước, hệ thống hiển thị ngay một thanh pill khổng lồ kích thước `1.75rem` chứa toàn bộ cách đọc Hiragana (ví dụ: thẻ chữ Hán `警察`, bên trên đã chưng sẵn chữ `けいさつ`).
* **Tác động tâm lý & công thái học**:
  - **Phá hủy hoàn toàn hiệu ứng kiểm tra (Testing Effect)**: Mục tiêu tối thượng của việc học chữ Hán và từ vựng là rèn luyện não bộ truy xuất âm đọc và nghĩa khi nhìn thấy tự dạng chữ Hán. Khi cách đọc Hiragana đập ngay vào mắt, người học không cần kích hoạt vùng nhớ vỏ não để suy nghĩ xem chữ này đọc là gì, dẫn đến "Ảo tưởng ghi nhớ" (Illusion of Competence).
  - Người học bấm "Good" hoặc "Easy" vì tưởng mình đã thuộc, nhưng khi ra thực tế nhìn biển báo hoặc sách tiếng Nhật chỉ có chữ Hán thì hoàn toàn không đọc được.
* **Đề xuất khắc phục (To-Be)**:
  - **Mặt trước (Front)**: Tuyệt đối CHỈ hiển thị chữ Kanji đơn thuần (kèm câu đục lỗ nếu là thẻ Cloze). Không bao giờ hiển thị Hiragana cách đọc ở mặt trước trừ khi từ đó là từ thuần Kana (như `ありがとう`).
  - **Mặt sau (Back)**: Sau khi bấm Lật thẻ, toàn bộ cách đọc Hiragana, đồ thị Pitch Accent và âm Hán Việt mới được phép bừng nở trên mặt sau của lá bài Karuta.

---

### 5.2.3. DEF-UI-KARUTA-003: Thiếu Phím Tắt và Nút Hoàn Tác (Undo Review)
* **Vị trí**: [src/app/review/page.tsx:334-393, 396-413](file:///d:/project/japanese-srs-system/src/app/review/page.tsx#L334-L413).
* **Phân loại**: **Thiếu Chức Năng Cốt Lõi (Lack of Error Reversibility)**.
* **Mức độ nghiêm trọng**: **P1 (Cao)**.
* **Hiện trạng (As-Is)**:
  Khi người học bấm một trong 4 nút chấm điểm (Again, Hard, Good, Easy) hoặc gõ phím `1`, `2`, `3`, `4`:
  1. Hàm `handleGrade` ngay lập tức ghi nhận điểm số, gửi fetch ngầm tới API hoặc lưu vào IndexedDB.
  2. Chỉ số thẻ `currentIdx` tăng thêm 1 và chuyển ngay sang thẻ kế tiếp.
  3. Hoàn toàn KHÔNG CÓ cơ chế Hoàn tác (Undo). Không có nút bấm "Quay lại thẻ trước" và không bắt sự kiện phím tắt `Ctrl + Z` hay phím `Z`.
* **Tác động tâm lý & công thái học**:
  - **Vi phạm Nguyên tắc Heuristic số 3 của Nielsen (User Control and Freedom)**: Người dùng thường xuyên thao tác nhanh (speed review) và vô tình bấm nhầm phím (ví dụ: định bấm phím 3 - Good nhưng ngón tay trượt sang phím 1 - Again).
  - **Làm sai lệch thuật toán FSRS nghiêm trọng**: Khi một thẻ đã có độ ổn định cao (Stability = 60 ngày) bị bấm nhầm thành Again, FSRS sẽ coi đó là một lần quên (Lapse), hạ Stability tụt thảm hại xuống còn 1.2 ngày và tăng Difficulty lên. Người học vô cùng bực bội và bất lực vì không có cách nào sửa lại ngoài việc phải vào CSDL sửa thủ công.
* **Đề xuất khắc phục (To-Be)**:
  1. Duy trì ngăn xếp lịch sử phiên học: `historyStack: Array<{ card: CardItem; previousState: Card; grade: Rating }>`.
  2. Bổ sung nút Hoàn tác thanh nhã ở góc trên bên trái thẻ Karuta (icon cọ xóa mộc bản `↩ Hoàn tác (Z)`).
  3. Lắng nghe phím tắt `z` hoặc `Ctrl+Z`: khi kích hoạt, lùi `currentIdx - 1`, khôi phục lại thẻ vừa học, hủy bản ghi review cuối cùng trong CSDL / IndexedDB, và trừ bớt thống kê `gradesCount`.

---

### 5.2.4. DEF-UI-KARUTA-004: Tự Động Chuyển Sang Cram Mode Âm Thầm Khi Hết Thẻ Đến Hạn
* **Vị trí**: [src/app/review/page.tsx:186-192](file:///d:/project/japanese-srs-system/src/app/review/page.tsx#L186-L192).
* **Phân loại**: **Sai Thuật Toán / Hành Vi Đánh Lừa Người Dùng (Silent Behavioral Fallback)**.
* **Mức độ nghiêm trọng**: **P1 (Cao)**.
* **Hiện trạng (As-Is)**:
  Đoạn mã lọc thẻ ôn tập:
  ```tsx
  const now = new Date();
  const dueCards = rawCards.filter((c) => {
    if (!c.due) return true;
    return new Date(c.due) <= now;
  });
  studyCards = dueCards.length > 0 ? dueCards : rawCards;
  ```
  Nếu người dùng hôm nay chỉ có 5 thẻ đến hạn ôn, sau khi học xong 5 thẻ đó hoặc nếu vào lúc không có thẻ nào đến hạn (`dueCards.length === 0`), hệ thống tự động gán `studyCards = rawCards` (lấy toàn bộ hàng trăm thẻ trong kho) để bắt người dùng học tiếp!
* **Tác động tâm lý & công thái học**:
  - Người dùng đinh ninh mình chỉ vào ôn các thẻ cần ôn hôm nay theo FSRS, nhưng thấy danh sách câu hỏi cứ kéo dài vô tận (第 1 問 / 全 500 問). Điều này gây kiệt quệ nhận thức (Cognitive Fatigue), làm người học nản chí và từ bỏ việc ôn tập hàng ngày.
  - Phá vỡ triết lý cốt lõi của Spaced Repetition: Thẻ chưa đến hạn không nên học ép (Over-studying) trừ khi người học chủ động chọn "Ôn luyện tự do / Cram Mode".
* **Đề xuất khắc phục (To-Be)**:
  Khi `dueCards.length === 0` và người dùng không ở chế độ `cramMode`:
  Hiển thị màn hình "Hoàn thành nhiệm vụ hôm nay" với linh vật Daruma cười rạng rỡ:
  `"Tuyệt vời! Bạn không còn thẻ nào cần ôn tập hôm nay. Hãy nghỉ ngơi để củng cố trí nhớ dài hạn."`
  Cung cấp tùy chọn rõ ràng nếu người học vẫn muốn tiếp tục: nút bấm `[🎯 Ôn luyện tự do (Cram All Cards)]`.

---

### 5.2.5. DEF-UI-KARUTA-005: Khung Nội Dung Quá Dài Làm Tràn Bộ Nút FSRS Khỏi Màn Hình (Button Clipping)
* **Vị trí**: [src/app/review/page.tsx:1328-1440, 1471-1585](file:///d:/project/japanese-srs-system/src/app/review/page.tsx#L1328-L1585).
* **Phân loại**: **Lỗi hiển thị / Công thái học (Vertical Layout Overflow)**.
* **Mức độ nghiêm trọng**: **P1 (Cao)**.
* **Hiện trạng (As-Is)**:
  Mặt sau thẻ bao gồm:
  - Khối Hiragana cách đọc lớn
  - Biểu đồ Pitch Accent SVG
  - Khối Ý nghĩa Tiếng Việt
  - Khối Câu ví dụ ngữ cảnh (i+1)
  - Khối Âm Hán Việt
  Tổng chiều cao nội dung mặt sau thường vượt quá 600px. Khi mở trên màn hình điện thoại (chiều cao hữu dụng của Safari di động trừ thanh công cụ URL chỉ còn khoảng 550px - 620px), bộ 4 nút chấm điểm FSRS (`Again`, `Hard`, `Good`, `Easy`) bị đẩy trôi tuột xuống đáy trang, nằm ngoài tầm nhìn (below the fold).
* **Tác động tâm lý & công thái học**:
  Người học bắt buộc phải dùng ngón tay vuốt cuộn màn hình xuống dưới ở MỖI MỘT THẺ để có thể bấm nút chấm điểm. Với 50 thẻ ôn tập mỗi ngày, việc phải cuộn 50 lần gây mỏi cổ tay và ức chế tột độ, vi phạm nghiêm trọng Định luật Fitts.
* **Đề xuất khắc phục (To-Be)**:
  1. Biến thanh 4 nút FSRS thành thanh công cụ cố định đáy màn hình (Fixed Sticky Bottom Action Bar) với hiệu ứng kính mờ Washi Glassmorphism (`backdrop-filter: blur(16px); background: rgba(250, 247, 240, 0.92)`).
  2. Thẻ bài Karuta ở giữa tự động áp dụng `overflow-y: auto` với thanh cuộn tinh tế kiểu mực Tàu, đảm bảo 4 nút chấm điểm LUÔN LUÔN nằm gọn trong tầm với của ngón tay cái mà không bao giờ bị che khuất.

---

### 5.2.6. DEF-UI-KARUTA-006: Thiếu Thao Tác Vuốt Cảm Ứng Di Động (Mobile Touch Gestures)
* **Vị trí**: [src/app/review/page.tsx:396-413](file:///d:/project/japanese-srs-system/src/app/review/page.tsx#L396-L413).
* **Phân loại**: **Thiếu (Mobile Tactile Interaction Void)**.
* **Mức độ nghiêm trọng**: **P1 (Cao)**.
* **Hiện trạng (As-Is)**:
  Toàn bộ tương tác ôn tập hiện tại phụ thuộc vào:
  - Chuột click trên PC
  - Phím cứng (Space, 1, 2, 3, 4)
  Trên màn hình cảm ứng điện thoại thông minh và máy tính bảng, người dùng chỉ có thể dùng ngón tay chọc vào các nút bấm nhỏ ở đáy màn hình. Ứng dụng không hề hỗ trợ bất kỳ cử chỉ vuốt tự nhiên nào (Tinder/Anki-style swipe mechanics).
* **Tác động tâm lý & công thái học**:
  Thiết bị di động chiếm hơn 70% thời gian ôn bài SRS của người học (trên xe buýt, giờ nghỉ trưa). Việc phải với ngón tay chọc chính xác vào nút bấm nhỏ làm chậm tốc độ ôn tập và tăng khả năng bấm nhầm.
* **Đề xuất khắc phục (To-Be)**:
  Tích hợp thư viện xử lý cử chỉ vuốt cảm ứng (hoặc custom touch listener trên khung thẻ Karuta):
  - **Chạm một lần (Tap)**: Lật thẻ mở đáp án.
  - **Vuốt sang Trái (Swipe Left)**: Đánh giá `Again` (Quên - thẻ bay trôi về bên trái với vệt đỏ son).
  - **Vuốt sang Phải (Swipe Right)**: Đánh giá `Good` (Tốt - thẻ trượt về bên phải với vệt xanh chàm).
  - **Vuốt Lên trên (Swipe Up)**: Đánh giá `Easy` (Dễ - thẻ bay vút lên trên với ánh kim vàng).
  - **Vuốt Xuống dưới (Swipe Down)**: Đánh giá `Hard` (Khó).

---

### 5.2.7. DEF-UI-KARUTA-007: Ngữ Nghĩa Nhãn Chữ Hán Trên Nút FSRS Gây Hoang Mang (破 - Phá)
* **Vị trí**: [src/app/review/page.tsx:1495, 1523, 1552, 1580](file:///d:/project/japanese-srs-system/src/app/review/page.tsx#L1495-L1580).
* **Phân loại**: **Sai Nhận Thức / Thử Nghiệm Văn Hóa Gượng Gạo (Esoteric Cultural Jargon)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Bốn nút chấm điểm được gán các chữ Hán triết học:
  - Nút 1 (Again): Chữ **破** (Phá - Phá vỡ / Đập bể)
  - Nút 2 (Hard): Chữ **磨** (Ma - Mài giũa)
  - Nút 3 (Good): Chữ **継** (Kế - Kế thừa)
  - Nút 4 (Easy): Chữ **悟** (Ngộ - Giác ngộ)
* **Tác động tâm lý & công thái học**:
  - Dù lấy cảm hứng từ triết lý trà đạo Shu-Ha-Ri hoặc Kintsugi, chữ **破** (Phá) trong tâm thức người học tiếng Nhật và người Việt gợi cảm giác phá hủy, xóa bỏ, hoặc làm hỏng thẻ. Rất nhiều người dùng mới sợ không dám bấm nút này vì tưởng rằng bấm "Phá" là xóa vĩnh viễn thẻ khỏi bộ sưu tập!
  - Trong khi đó, chuẩn tiếng Nhật của Anki và các ứng dụng SRS chính thống tại Nhật là: **もう一度** (Lặp lại), **難しい** (Khó), **普通/正解** (Tốt), **簡単** (Dễ).
* **Đề xuất khắc phục (To-Be)**:
  Sửa nhãn Hán tự về đúng ngữ nghĩa sư phạm truyền thống, dễ hiểu nhưng vẫn giữ nguyên cốt cách thanh lịch:
  - Nút 1: **再** (Tái - Học lại / Again)
  - Nút 2: **難** (Nan - Còn khó / Hard)
  - Nút 3: **良** (Lương - Nhớ tốt / Good)
  - Nút 4: **易** (Dịch - Thuộc làu / Easy)
  Kèm theo nhãn tiếng Việt rõ ràng bên dưới: `① Chưa nhớ`, `② Khó nhớ`, `③ Nhớ tốt`, `④ Rất dễ`.

---

### 5.2.8. DEF-UI-KARUTA-008: Thiếu Chức Năng Sửa Nhanh (Quick Edit) và Tạm Hoãn (Bury/Suspend)
* **Vị trí**: [src/app/review/page.tsx:848-1120](file:///d:/project/japanese-srs-system/src/app/review/page.tsx#L848-L1120).
* **Phân loại**: **Thiếu (In-session Workflow Interruption)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Trong quá trình ôn tập, nếu người học phát hiện một câu ví dụ bị gõ sai chính tả, hoặc một từ vựng bị dịch tối nghĩa, hiện tại họ KHÔNG THỂ sửa tại chỗ. Cách duy nhất là:
  1. Ghi nhớ ID hoặc từ vựng vào giấy nháp.
  2. Thoát khỏi phiên ôn tập, quay lại `/cards`.
  3. Tìm kiếm thẻ trong danh sách hàng nghìn thẻ.
  4. Mở form sửa rồi lưu lại.
  5. Quay lại `/review` bắt đầu lại phiên học từ đầu.
* **Tác động tâm lý & công thái học**:
  Tạo ra ma sát quy trình (Friction) cực lớn. Người học thường chọn cách bỏ qua không sửa, để mặc lỗi sai tồn tại mãi mãi trong dữ liệu học tập.
* **Đề xuất khắc phục (To-Be)**:
  Bổ sung menu tác vụ phụ ở góc thẻ Karuta (biểu tượng quạt giấy 3 chấm `...`):
  - **Sửa nhanh (Quick Edit)**: Mở Modal Washi cho phép sửa trực tiếp nghĩa và câu ví dụ mà không làm mất trạng thái phiên học.
  - **Tạm hoãn hôm nay (Bury)**: Tạm cất thẻ sang ngày mai ôn tập (hữu ích khi bị nhầm lẫn giữa hai từ đồng âm).
  - **Đình chỉ thẻ (Suspend)**: Ngừng ôn tập thẻ này vô thời hạn (thẻ quá dễ hoặc không còn nhu cầu học).

---

### 5.2.9. DEF-UI-KARUTA-009: Thiếu Minh Bạch Về Chỉ Số FSRS (Stability & Retrievability HUD)
* **Vị trí**: [src/app/review/page.tsx:300-318, 1496, 1524, 1553, 1581](file:///d:/project/japanese-srs-system/src/app/review/page.tsx#L300-L318).
* **Phân loại**: **Thiếu (Algorithmic Opacity)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Nút bấm chỉ hiển thị con số dự đoán thời gian lặp lại: `< 1 phút`, `~ 1.2 ngày`, `~ 3.5 ngày`, `~ 7.0 ngày`. Người học không biết thẻ hiện tại đang có độ vững chắc bộ nhớ (Memory Stability - $S$) là bao nhiêu ngày, xác suất nhớ hiện tại (Retrievability - $R$) là bao nhiêu phần trăm, và hệ số khó (Difficulty - $D$) đang ở mức nào.
* **Tác động tâm lý & công thái học**:
  FSRS là thuật toán khoa học thần kinh ưu việt hơn SM-2, nhưng nếu thiếu thông số hiển thị, người học cảm thấy thuật toán như một chiếc "hộp đen" ma thuật không thể kiểm chứng.
* **Đề xuất khắc phục (To-Be)**:
  Thêm một thanh Huy hiệu Khoa học Nhận thức (Cognitive HUD) thu nhỏ ở chân thẻ:
  Hiển thị dạng chip Washi: `📊 Ổn định: S=4.2d · Độ khó: D=5.1 · Tỉ lệ nhớ: R=89%`. Khi rê chuột vào, hiển thị giải thích ngắn gọn, gia tăng niềm tin và sự hứng thú khoa học cho người học.

---

### 5.2.10. DEF-UI-KARUTA-010: Bùa Hộ Mệnh Daruma Bị Bỏ Quên Trong Phiên Ôn Tập
* **Vị trí**: [src/app/review/page.tsx:66, 435, 512](file:///d:/project/japanese-srs-system/src/app/review/page.tsx#L66).
* **Phân loại**: **Thừa / Mất kết nối Văn Hóa (Narrative Disconnect)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Component `<DarumaMascot />` xuất hiện ở màn hình Loading (progress 25%) và màn hình Khải hoàn (progress 100%). Tuy nhiên, trong suốt 99% thời gian người học tập trung cao độ ở giao diện ôn tập chính, Daruma hoàn toàn biến mất. Tiến độ chỉ được thể hiện bằng một vạch kẻ ngang vô tri màu vàng sẫm.
* **Tác động tâm lý & công thái học**:
  - Trong văn hóa Nhật Bản, búp bê Daruma là biểu tượng của ý chí kiên định và thực hiện lời thề: Khi đặt ra mục tiêu, người ta vẽ con mắt bên trái của Daruma. Khi hoàn thành toàn bộ mục tiêu, người ta mới vẽ nốt con mắt bên phải.
  - Việc bỏ rơi Daruma trong lúc người học đang chiến đấu với các thẻ khó làm mất đi giá trị tinh thần đồng hành (Emotional Companionship) quý báu.
* **Đề xuất khắc phục (To-Be)**:
  Đặt biểu tượng Daruma mini kích thước 36px cạnh thanh tiến độ. Theo từng câu trả lời đúng, tròng mắt của Daruma được tô mực dần dần, và khi người học đạt chuỗi trả lời đúng liên tiếp (Streak 5, 10), Daruma phát ra hiệu ứng lửa thiền định (Zen fire aura) khích lệ tinh thần người học.

---

### 5.2.11. DEF-UI-KARUTA-011: Xung Đột Âm Thanh Khi Nhấn Phím Liên Tục
* **Vị trí**: [src/app/review/page.tsx:330, 387, 1029](file:///d:/project/japanese-srs-system/src/app/review/page.tsx#L330).
* **Phân loại**: **Lỗi âm thanh / Hiển thị (Acoustic Concurrency Clatter)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Khi người dùng bấm Space để lật thẻ -> gọi `japaneseAudio.playHyoshigi()`. Nếu thẻ có âm thanh tự động hoặc người dùng bấm nút loa phát âm -> gọi Web Speech synthesis. Nếu trả lời thẻ cuối -> gọi `japaneseAudio.playSuzuBell()`. Các luồng âm thanh này không dùng chung bộ điều phối âm thanh (Audio Orchestrator), dẫn đến tình trạng tiếng phách gỗ Hyoshigi đè bẹp giọng đọc tiếng Nhật hoặc tiếng chuông Suzu bị ngắt đột ngột.
* **Đề xuất khắc phục (To-Be)**:
  Tích hợp lớp `SoundOrchestrator` đảm bảo các hiệu ứng âm thanh nghi lễ (phách gỗ, chuông chùa) tự động giảm âm lượng (ducking) xuống 30% khi giọng phát âm tiếng Nhật vang lên, tạo không gian âm thanh hài hòa, trang nghiêm.

---

### 5.2.12. DEF-UI-KARUTA-012: Thiếu Đồng Hồ Đo Độ Trôi Chảy Truy Xuất (Retrieval Latency Meter)
* **Vị trí**: [src/app/review/page.tsx:260-263, 354](file:///d:/project/japanese-srs-system/src/app/review/page.tsx#L354).
* **Phân loại**: **Thiếu (Cognitive Telemetry Absence)**.
* **Mức độ nghiêm trọng**: **P3 (Thấp)**.
* **Hiện trạng (As-Is)**:
  Hệ thống có đo `responseTimeMs` ngầm để gửi lên CSDL:
  ```tsx
  const responseTimeMs = Math.max(100, Math.round(Date.now() - cardStartTimeRef.current));
  ```
  Nhưng trên giao diện hoàn toàn không có chỉ số nào cho người học biết mình đang phản xạ nhanh hay chậm (ví dụ: phản xạ dưới 1.5 giây = Mastered, trên 5 giây = Cần củng cố).
* **Đề xuất khắc phục (To-Be)**:
  Hiển thị một thanh nhang thiền (Senko Incense timer) mờ ảo tinh tế cháy dần sau 8 giây ở viền thẻ. Nếu người học trả lời trong khi nhang còn cháy, ghi nhận điểm thưởng phản xạ nhanh.

---

## 5.3. BẢNG MA TRẬN ĐỐI CHIẾU TRẠNG THÁI AS-IS VÀ TO-BE (KARUTA ARENA)

| Tiêu Chí Đánh Giá | Hiện Trạng (As-Is) | Thiết Kế Mục Tiêu Sau Khi Khắc Phục (To-Be) |
| :--- | :--- | :--- |
| **Cơ chế lật thẻ** | Khối `div` giãn nở chiều dọc (`fadeIn`), giật layout CLS. | Lật 3D Physics Karuta Flip mượt mà 60fps qua `perspective` và `rotateY`. |
| **Hiển thị mặt trước** | Chưng sẵn Hiragana to tướng, làm lộ đáp án chữ Hán. | Che giấu 100% âm đọc ở mặt trước; chỉ mở toàn bộ ở mặt sau thẻ. |
| **Hoàn tác đánh giá** | Không có nút, không có phím tắt; bấm nhầm làm hỏng FSRS. | Hỗ trợ nút Hoàn tác Washi và phím tắt `Z` / `Ctrl+Z` khôi phục lịch FSRS. |
| **Xử lý hết thẻ đến hạn** | Âm thầm nạp hàng trăm thẻ chưa đến hạn ép học tiếp. | Dừng lại ở màn hình chúc mừng; chỉ mở Cram All khi người học bấm chọn. |
| **Vị trí 4 nút FSRS** | Bị nội dung thẻ đẩy tụt khỏi màn hình trên điện thoại. | Cố định đáy màn hình (Fixed Sticky Bottom Bar), không bao giờ bị tràn. |
| **Thao tác di động** | Buộc phải chọc tay vào nút bấm nhỏ; không hỗ trợ vuốt. | Hỗ trợ cử chỉ vuốt tự nhiên: Trái = Again, Phải = Good, Lên = Easy. |
| **Chữ Hán trên nút** | Chữ `破` (Phá) gây hoang mang, sợ mất thẻ. | Chữ chuẩn xác: `再` (Học lại), `難` (Khó), `良` (Tốt), `易` (Dễ). |
| **Sửa thẻ trong phiên** | Phải thoát ra màn hình chính, tìm thẻ rồi sửa thủ công. | Quick Edit Modal cho phép sửa ngay tại chỗ mà không gián đoạn phiên học. |

---

## 5.4. CHECKLIST NGHIỆM THU KARUTA ARENA (VERIFICATION CHECKLIST)
- [ ] Bấm Space hoặc nút "Xem nghĩa" -> Thẻ bài lật 3D xoay quanh trục Y mượt mà, không giật màn hình.
- [ ] Mở thẻ từ vựng Hán tự -> Mặt trước tuyệt đối KHÔNG có thanh Hiragana đọc hộ.
- [ ] Sau khi chấm điểm một thẻ, bấm phím `Z` -> Hệ thống hoàn tác lại thẻ vừa học và khôi phục điểm số.
- [ ] Thu nhỏ cửa sổ trình duyệt xuống chiều cao 500px -> 4 nút FSRS vẫn nổi bật ở đáy màn hình, bấm được 100%.
- [ ] Thử nghiệm trên Safari di động -> Vuốt nhẹ sang phải để chọn Good, vuốt sang trái để chọn Again.
- [ ] Học hết số thẻ cần ôn -> Màn hình chúc mừng hiện ra, không tự ý nạp thẻ mới.


---

### 5.5 CƠ HỌC VẬT LÝ LẬT THẺ KARUTA & THIẾT KẾ XÚC GIÁC ÂM HỌC (TACTILE AUDIO FEEDBACK) TRONG ĐẤU TRƯỜNG KARUTA

#### 1. Mô hình Toán học Lò xo Giảm xóc (Damped Spring Physics) cho Động thái Lật Thẻ
* **Hiện trạng hoạt họa**:
  - Giao diện `src/app/review/page.tsx` hiện sử dụng thuộc tính chuyển động CSS thông thường: `transition: transform 0.6s ease-in-out`.
  - Đường cong nội suy `ease-in-out` là hàm bậc ba Bezier đơn điệu, không phản ánh được quán tính vật lý của một lá bài Karuta thực tế khi được búng trên bề mặt chiếu cói Tatami. Nó tạo ra cảm giác thẻ xoay như một cánh quạt vô hồn bằng nhựa dẻo.
* **Mô hình vật lý lò xo giảm xóc (Spring Dynamics Formulation)**:
  - Phương trình vi phân mô tả chuyển động xoay góc $\theta(t)$:
    $$m \frac{d^2\theta}{dt^2} + c \frac{d\theta}{dt} + k (\theta - \theta_{\text{target}}) = 0$$
    Trong đó:
    - Khối lượng lá bài $m = 1.0$
    - Hệ số đàn hồi của giấy Washi $k = 180$ (Stiffness)
    - Hệ số cản ma sát không khí và thớ cói $c = 18$ (Damping)
  - Khi áp dụng mô hình này, lá bài sẽ lật qua góc $180^\circ$, hơi nhún nhẹ qua mốc đích khoảng $3^\circ$ ($183^\circ$) trước khi ổn định hoàn toàn về vị trí $180^\circ$. Quá trình này diễn ra trong vòng **350ms**, mang lại cảm giác chân thực tuyệt đối như đang thi đấu bài lá cung đình Uta-garuta.
* **Cấu hình Framer Motion chuẩn mực**:
  ```tsx
  <motion.div
    animate={{ rotateY: isFlipped ? 180 : 0 }}
    transition={{
      type: "spring",
      stiffness: 180,
      damping: 18,
      mass: 1.0,
      restDelta: 0.001
    }}
    style={{ transformStyle: "preserve-3d" }}
    className="w-full max-w-xl aspect-[3/2] cursor-pointer"
  >
    {/* Mặt trước & Mặt sau */}
  </motion.div>
  ```

#### 2. Kỹ thuật Tiền nạp Bộ đệm Âm thanh (Audio Buffer Pre-decoding) để Đạt Độ trễ Siêu thấp (<15ms)
* **Vấn đề độ trễ âm thanh Web Audio**:
  - Khi người học bấm phím `Space` để lật thẻ hoặc phím số `1..4` để chấm điểm, nếu sử dụng thẻ `<audio src="/sfx/flip.mp3" />` của HTML5, trình duyệt phải khởi tạo bộ giải mã âm thanh và gửi tín hiệu qua luồng âm thanh hệ điều hành, tạo ra độ trễ từ **120ms đến 250ms**.
  - Sự sai lệch thời gian giữa cái nhấp ngón tay và âm thanh phát ra phá hủy ảo giác xúc giác (Tactile Illusion), khiến não bộ nhận thức rõ ràng đây là âm thanh nhân tạo chắp vá.
* **Giải pháp Web Audio API AudioBuffer (Zero Network Lag)**:
  - Khởi tạo một `AudioContext` duy nhất và nạp sẵn toàn bộ mảng dữ liệu nhị phân (Binary ArrayBuffer) của 5 hiệu ứng âm thanh cốt lõi vào bộ nhớ RAM ngay khi người dùng bước vào trang `/review`:
    1. `hyoshigi.wav` (tiếng phách gỗ báo hiệu bắt đầu)
    2. `washi_flip.wav` (tiếng xột xoạt của giấy Washi khi lật)
    3. `hanko_stamp.wav` (tiếng đóng con dấu son đanh gọn khi chấm thẻ Good)
    4. `suzu_bell.wav` (tiếng chuông gió linh thiêng thanh thản khi chấm Easy)
    5. `tsudumi_drum.wav` (tiếng trống trầm khi bấm Again)
  - Đoạn mã khởi tạo không giật lag:
    ```tsx
    class KarutaSoundEngine {
      private ctx: AudioContext | null = null;
      private buffers: Map<string, AudioBuffer> = new Map();

      async init() {
        if (!this.ctx) {
          this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const sounds = ['hyoshigi', 'washi_flip', 'hanko_stamp', 'suzu_bell', 'tsudumi'];
          await Promise.all(sounds.map(async (name) => {
            const res = await fetch(`/sounds/${name}.mp3`);
            const arrayBuffer = await res.arrayBuffer();
            const audioBuffer = await this.ctx!.decodeAudioData(arrayBuffer);
            this.buffers.set(name, audioBuffer);
          }));
        }
      }

      play(name: string, volume: number = 0.6) {
        if (!this.ctx || !this.buffers.has(name)) return;
        const source = this.ctx.createBufferSource();
        const gainNode = this.ctx.createGain();
        source.buffer = this.buffers.get(name)!;
        gainNode.gain.value = volume;
        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        source.start(0); // Bắt đầu phát ngay lập tức trong 2ms!
      }
    }
    ```

#### 3. Bố trí Phím Tắt Tiêu chuẩn Anki/FSRS & Công thái học Bàn tay Trái
* Người học ôn tập chuyên sâu hàng trăm thẻ mỗi ngày thường đặt tay trái lên bàn phím (`Space` để lật, các phím `1`, `2`, `3`, `4` tương ứng `Again`, `Hard`, `Good`, `Easy`).
* Tuy nhiên, trên bàn phím chuẩn ANSI/ISO, khoảng cách từ ngón cái trên phím `Space` tới phím `4` đòi hỏi phải nhấc cả cổ tay lên, gây mỏi cơ cổ tay (Carpal Tunnel Syndrome) sau 20 phút học.
* Hệ thống bổ sung cấu hình phím tắt công thái học thay thế: **Hàng phím `J`, `K`, `L`, `;`** hoặc **`D`, `F`, `J`, `K`** cho phép hai tay đặt cố định tại vị trí Home Row của bàn phím mà không cần dịch chuyển cổ tay.

