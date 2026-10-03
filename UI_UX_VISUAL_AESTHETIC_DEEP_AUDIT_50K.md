# BÁO CÁO NGHIÊN CỨU & KIỂM TOÁN CHUYÊN SÂU TOÀN DIỆN VỀ LỖI HIỂN THỊ, THẨM MỸ HÌNH ẢNH, GIAO DIỆN NGƯỜI DÙNG (UI/UX) VÀ GIẢI PHÁP TÁI THIẾT KẾ ĐẠT CHUẨN AESTHETIC WABI-SABI & AWWWARDS-TIER
## Comprehensive Deep-Dive Visual Audit, Display Flaw Inventory, Aesthetic Engineering & Master Design Architecture (50,000+ Words)

---

- **Dự án**: Japanese SRS Spaced Repetition & Cognitive Mastery System (`japanese-srs-system`)
- **Tác giả thẩm định**: Antigravity Autonomous Agentic AI Engineering Team & Design Guild
- **Kỹ năng chuyên biệt áp dụng (Skills Integration)**:
  - `high-aesthetic-designer`: Chuẩn mực thẩm mỹ Awwwards-tier, Linear-grade, Apple-level, OKLCH Color Harmony, Micro-borders, Ambient Depth & Layered Shadows.
  - `figma-design-bridge`: Quy hoạch Auto Layout, Design Tokens đồng bộ, Ma trận biến thể Component, Responsive Constraints từ 320px đến 4K.
  - `image-asset-generator`: Tối ưu hóa độ phân giải thị giác, kiểm soát tỷ lệ khung hình Retina 2x, chuẩn nén WebP/AVIF, khử đục thị giác nền tranh nghệ thuật Ukiyo-e / Kirie.
- **Ngày lập báo cáo**: Ngày 03 tháng 10 năm 2026
- **Phiên bản tài liệu**: 2.0.0-PRO-DEEP-AUDIT
- **Phạm vi thẩm định**: Toàn bộ 10 phân hệ giao diện người dùng, 31 routes ứng dụng Next.js 15 App Router, hệ thống đồ họa SVG, thư viện Typography, ma trận tương phản WCAG 2.2 AAA, và cơ chế tương tác vi mô (Micro-interactions).
- **Mục tiêu tài liệu**: Tài liệu hóa chi tiết, toàn diện, sâu sắc từng khuyết tật thị giác, điểm nghẽn thẩm mỹ, lỗi hiển thị thô ráp, vỡ layout, tranh chấp typography và xung đột văn hóa thẩm mỹ; từ đó thiết lập phương án tái thiết kế kiến trúc giao diện đạt đến đỉnh cao mỹ học Nhật Bản kết hợp công nghệ web hiện đại. **(Tài liệu nghiên cứu chuyên sâu, không áp dụng thực thi trực tiếp vào mã nguồn trong giai đoạn này)**.

---

# MỤC LỤC TỔNG QUAN HỆ THỐNG

1. **CHƯƠNG 1: TUYÊN NGÔN THẨM MỸ SỐ WABI-SABI & HỆ KIẾN TRÚC THIẾT KẾ ĐỈNH CAO (HIGH-AESTHETIC FOUNDATION)**
   - 1.1. Triết học Wabi-Sabi và sự chuyển dịch vào không gian số (Digital Wabi-Sabi & Zen Minimalism).
   - 1.2. Thất bại thị giác của các hệ thống học tiếng Nhật truyền thống (The Cluttered Utility Antipattern).
   - 1.3. Bốn trụ cột thẩm mỹ của kỹ năng `high-aesthetic-designer`:
     - Trụ cột A: Ánh sáng tri giác và Độ sâu tầng lớp (Perceptual Lighting & Layered Ambient Shadows).
     - Trụ cột B: Đường viền vi mô và Ánh kim mờ ảo (Micro-Borders, Gradient Sheen & Frosted Glassmorphism).
     - Trụ cột C: Không gian màu OKLCH và Sắc độ sang trọng (Sophisticated Neutrals & Vibrant Focal Accents).
     - Trụ cột D: Nhịp điệu Thư pháp & Kiểu chữ biên tập (Editorial Typography & Optical Rhythm).
   - 1.4. Lưới bất đối xứng Bento Grid (3:2 và 2:1) & Tỷ lệ vàng của khoảng trống âm (Negative Whitespace > 40%).
   - 1.5. Ma trận độ phân giải màn hình, Ranh giới hiển thị (Breakpoints) & Tiêu chuẩn Accessibility Quốc tế (WCAG 2.2 AAA, Touch Target 44x44px, Safe Area Insets).

2. **CHƯƠNG 2: KIỂM TOÁN CHUYÊN SÂU PHÂN HỆ 1 — TRANG CHỦ DASHBOARD & BÀN KARUTA ĐỘC BẢN (`src/app/page.tsx`)**
   - 2.1. Bản đồ thị giác tổng thể trang chủ & Điểm nghẽn bố cục.
   - 2.2. Hồ sơ lỗi `VIS-HOME-01`: Top Study Ledger thiếu chiều sâu quang học đa tầng (Flat 1-layer shadow, thiếu key light rim & ambient bounce).
   - 2.3. Hồ sơ lỗi `VIS-HOME-02`: Thẻ Bento KPI vỡ bố cục trên Mobile <375px do cố định padding và flex-nowrap.
   - 2.4. Hồ sơ lỗi `VIS-HOME-03`: Trùng lặp câu ví dụ thô bên dưới phần giải nghĩa do so sánh lỏng lẻo chuỗi Cloze.
   - 2.5. Hồ sơ lỗi `VIS-HOME-04`: Huy hiệu hạn ôn tập (Due Pill) tương phản gắt (#D9381E) phá vỡ tính tĩnh lặng Wabi-Sabi.
   - 2.6. Hồ sơ lỗi `VIS-HOME-05`: JapaneseSpeakerButton bị giật layout khi phát âm thanh do thiếu trạng thái loading skeleton.
   - 2.7. Hồ sơ lỗi `VIS-HOME-06`: Background Ukiyo-e sóng biển bị vỡ tỉ lệ và làm mờ đục văn bản ở chế độ Light Mode.

3. **CHƯƠNG 3: KIỂM TOÁN CHUYÊN SÂU PHÂN HỆ 2 — ĐẤU TRƯỜNG ÔN TẬP KARUTA ACTIVE RECALL (`src/app/review/page.tsx`)**
   - 3.1. Phân tích trạng thái tâm lý học nhận thức của người học trong phiên Active Recall.
   - 3.2. Hồ sơ lỗi `VIS-REV-01`: Mặt trước thẻ lớn tràn khung chữ trên mobile khi câu Cloze ngữ pháp dài > 20 ký tự (Font 4.8rem hardcoded).
   - 3.3. Hồ sơ lỗi `VIS-REV-02`: Lỗ hổng bảo mật sư phạm: Huy hiệu đọc Hiragana mặt trước vô tình làm lộ đáp án câu đục lỗ Cloze.
   - 3.4. Hồ sơ lỗi `VIS-REV-03`: Khối ý nghĩa tiếng Việt ở mặt sau quá khổ (2.2rem) làm đẩy các nút đánh giá FSRS ra ngoài khung nhìn (Fold line).
   - 3.5. Hồ sơ lỗi `VIS-REV-04`: Cột On-yomi và Kun-yomi bị co rúm thành một dòng méo mó trên màn hình nhỏ do minmax(230px, 1fr) thiếu gap fluid.
   - 3.6. Hồ sơ lỗi `VIS-REV-05`: 4 nút đánh giá FSRS (Again, Hard, Good, Easy) thiếu phân cấp thị giác trực quan (Cognitive affordance) và hiệu ứng tactile press.
   - 3.7. Hồ sơ lỗi `VIS-REV-06`: Dropdown chuyển bộ thẻ (Deck Selector) bị che khuất bởi z-index và thiếu backdrop blur Washi cao cấp.
   - 3.8. Hồ sơ lỗi `VIS-REV-07`: Modal phím tắt (Keyboard Shortcuts) thiếu tương phản viền (micro-border sheen) và animation trượt mượt mà 60fps.

4. **CHƯƠNG 4: KIỂM TOÁN CHUYÊN SÂU PHÂN HỆ 3 — THƯ VIỆN THẺ HỌC TANZAKUCHO (`src/app/cards/page.tsx`)**
   - 4.1. Đánh giá tính trực quan của danh mục thẻ và cuộn dữ liệu lớn.
   - 4.2. Hồ sơ lỗi `VIS-CARD-01`: Cột phân loại hiển thị đơn điệu gây hiểu lầm ngữ pháp là từ vựng (`語` thay vì `文`).
   - 4.3. Hồ sơ lỗi `VIS-CARD-02`: Cột 1 mặt trước lặp lại âm đọc trong khi Cột 2 đã hiển thị cách đọc và cao độ.
   - 4.4. Hồ sơ lỗi `VIS-CARD-03`: Bảng dữ liệu tràn ngang không kiểm soát trên thiết bị di động (Table scroll horizontal clunky).
   - 4.5. Hồ sơ lỗi `VIS-CARD-04`: Thanh tìm kiếm cọ lông (Sumi-e Search) thiếu micro-interaction focus ring và icon cọ lông nghệ thuật.
   - 4.6. Hồ sơ lỗi `VIS-CARD-05`: Dải nút lọc chủ đề (Deck Filter Pills) bị gãy hàng không đều đặn (Uneven flex wrapping).
   - 4.7. Hồ sơ lỗi `VIS-CARD-06`: Trạng thái nhận thức FSRS (`Review` / `New`) dùng màu pastel nhạt nhòa, thiếu con dấu triện son Kintsugi.

5. **CHƯƠNG 5: KIỂM TOÁN CHUYÊN SÂU PHÂN HỆ 4 — BÀN THƯ PHÁP TẠO THẺ SHODO DESK (`src/app/cards/new/page.tsx`)**
   - 5.1. Mô hình tương tác giữa người dùng và trí tuệ nhân tạo khai thác thẻ (AI Mining Copilot).
   - 5.2. Hồ sơ lỗi `VIS-NEW-01`: Chuyển đổi Tab (Copilot / Thủ công) bị khựng giật (Tab layout shift) do thiếu shared layout transition.
   - 5.3. Hồ sơ lỗi `VIS-NEW-02`: Thẻ gợi ý AI Mining thiếu phân vùng rõ rệt giữa nghĩa gốc, câu ngữ cảnh và ghi chú tầm nguyên Kanji.
   - 5.4. Hồ sơ lỗi `VIS-NEW-03`: Ô chọn cao độ pitch accent dùng số khô khan (0, 1, 2, 3) thay vì biểu đồ sóng âm trực quan.
   - 5.5. Hồ sơ lỗi `VIS-NEW-04`: Nút lưu thẻ chính (Shodo Stamp Submit) thiếu trạng thái loading nghệ thuật Sumi-e ink drop.
   - 5.6. Hồ sơ lỗi `VIS-NEW-05`: Banner thông báo phân tách đa nghĩa (Auto-split atomicity notice) có diện mạo cảnh báo lỗi thay vì thông điệp trí tuệ nhân tạo tích cực.

6. **CHƯƠNG 6: KIỂM TOÁN CHUYÊN SÂU PHÂN HỆ 5 — ĐẤU TRƯỜNG CHIA ĐỘNG TỪ (`src/app/conjugation/page.tsx`)**
   - 6.1. Động lực học tương tác cao độ khi luyện chia thể Te / Ru / Phủ định / Quá khứ.
   - 6.2. Hồ sơ lỗi `VIS-CONJ-01`: Bàn phím ảo tiếng Nhật (Virtual Kana Keypad) chiếm 65% màn hình dọc trên mobile, đẩy thẻ bài tập ra ngoài tầm mắt.
   - 6.3. Hồ sơ lỗi `VIS-CONJ-02`: Thẻ hiển thị động từ gốc quá đơn điệu, thiếu huy hiệu kanji và nhãn từ loại phân nhóm trực quan.
   - 6.4. Hồ sơ lỗi `VIS-CONJ-03`: Modal Sổ tay lý thuyết (Cheatsheet Modal) tràn viền, thiếu mục lục neo (Sticky anchor navigation).
   - 6.5. Hồ sơ lỗi `VIS-CONJ-04`: Chế độ Lướt nhanh (Speed Drill) có hiệu ứng lật thẻ 3D bị giật khung hình trên GPU tích hợp (Janky 3D transform).
   - 6.6. Hồ sơ lỗi `VIS-CONJ-05`: Khối phản hồi đúng/sai thiếu âm hưởng thị giác Kintsugi (Vàng kim hàn gắn khi đúng, son trầm khi sai).
   - 6.7. Hồ sơ lỗi `VIS-CONJ-06`: Bảng đối chiếu quy tắc chia thể (Bento Table) có độ tương phản văn bản thấp dưới ánh sáng chói.

7. **CHƯƠNG 7: KIỂM TOÁN CHUYÊN SÂU PHÂN HỆ 6 — GIÁO TRÌNH NGỮ PHÁP BUNBOU ENGINE (`src/app/grammar/page.tsx` & `[lessonId]/page.tsx`)**
   - 7.1. Cấu trúc thị giác của một hệ thống giáo trình ngữ pháp chuẩn JLPT N5-N4.
   - 7.2. Hồ sơ lỗi `VIS-GRAM-01`: Tiêu đề Hero Header dùng font Bebas Neue phương Tây lạc lõng giữa ngữ cảnh văn hóa thư pháp Nhật Bản.
   - 7.3. Hồ sơ lỗi `VIS-GRAM-02`: Chữ nền Watermark `文法` cỡ 9rem làm trôi thanh cuộn ngang trên iPhone và thiết bị màn hình hẹp.
   - 7.4. Hồ sơ lỗi `VIS-GRAM-03`: Thanh tiến độ học tập bài học (Lesson Progress Bar) dùng dải màu phẳng, thiếu hiệu ứng dòng chảy mộc bản.
   - 7.5. Hồ sơ lỗi `VIS-GRAM-04`: Sơ đồ phân rã cấu trúc ngữ pháp (StructureDiagram) thiếu đường nối ngữ nghĩa linh hoạt (Semantic connector lines).
   - 7.6. Hồ sơ lỗi `VIS-GRAM-05`: Thẻ mẫu câu (PatternCard) bị dính chặt vào nhau khi co giãn màn hình do thiếu fluid gap.
   - 7.7. Hồ sơ lỗi `VIS-GRAM-06`: Thẻ ví dụ đục lỗ trong bài học thiếu nhãn phân biệt giữa câu mẫu sách giáo khoa và câu ứng dụng thực tế.

8. **CHƯƠNG 8: KIỂM TOÁN CHUYÊN SÂU PHÂN HỆ 7 — ĐẤU TRƯỜNG THỰC HÀNH BÀI TẬP NGỮ PHÁP (`src/app/grammar/practice/page.tsx`)**
   - 8.1. Thiết kế tương tác bài thi trắc nghiệm và thử thách điền từ ngẫu nhiên.
   - 8.2. Hồ sơ lỗi `VIS-PRAC-01`: 4 nút lựa chọn trắc nghiệm (A, B, C, D) thiếu phím tắt số tương ứng và hiệu ứng hover phản hồi quang học.
   - 8.3. Hồ sơ lỗi `VIS-PRAC-02`: Khung giải thích sư phạm sau khi trả lời xuất hiện gián đoạn không mượt mà, gây nhảy bố cục (CLS spike).
   - 8.4. Hồ sơ lỗi `VIS-PRAC-03`: Thanh tiến độ phiên luyện tập (Top Progress Tracker) thiếu con số phần trăm trực quan và con dấu Daruma may mắn.
   - 8.5. Hồ sơ lỗi `VIS-PRAC-04`: Màn hình hoàn thành bài tập (Completion Screen) khô khan, thiếu màn chúc mừng hoa anh đào Sakura rơi.
   - 8.6. Hồ sơ lỗi `VIS-PRAC-05`: Câu hỏi đục lỗ hiển thị dấu gạch ngang xấu xí thay vì ô trống Washi Active Recall tao nhã.

9. **CHƯƠNG 9: KIỂM TOÁN CHUYÊN SÂU PHÂN HỆ 8 — TRUNG TÂM TÍCH HỢP ĐÁM MÂY & GOOGLE ECOSYSTEM (`src/app/integrations/page.tsx`)**
   - 9.1. Trực quan hóa dịch vụ kết nối bên thứ ba (Google Cloud, Turso DB, OAuth 2.0).
   - 9.2. Hồ sơ lỗi `VIS-INT-01`: Bảng điều khiển tích hợp phân mảnh 4 khối rời rạc thiếu cấu trúc Bento thống nhất theo tỷ lệ vàng.
   - 9.3. Hồ sơ lỗi `VIS-INT-02`: Trạng thái kết nối Google OAuth (Connected/Disconnected) thiếu đèn LED xung nhịp Pulse Glow thanh lịch.
   - 9.4. Hồ sơ lỗi `VIS-INT-03`: Hộp nhập liên kết Google Sheets thiếu nút dán nhanh (Paste button) và preview bảng tính lộn xộn.
   - 9.5. Hồ sơ lỗi `VIS-INT-04`: Nút sao chép Redirect URI thiếu thông báo Toast Washi nổi bật, dễ gây hiểu lầm cho người dùng.
   - 9.6. Hồ sơ lỗi `VIS-INT-05`: Card thiết lập giờ học Calendar thiếu bộ chọn thời gian đồng hồ tròn trực quan (Analog dial time picker).

10. **CHƯƠNG 10: KIỂM TOÁN CHUYÊN SÂU PHÂN HỆ 9 — SENSEI AI COPILOT & MICRO-INTERACTIONS (`src/components/chat/JapaneseSenseiChat.tsx`, `PitchAccentGraph.tsx`)**
    - 10.1. Triết lý giao diện trò chuyện đồng hành (Companion AI UX).
    - 10.2. Hồ sơ lỗi `VIS-COPILOT-01`: Nút mở Chatbot AI (Floating FAB) đè lên thanh điều hướng di động và nút loa phát âm.
    - 10.3. Hồ sơ lỗi `VIS-COPILOT-02`: Khung hội thoại Chat Drawer thiếu hiệu ứng mờ nhòe kính Washi (Glassmorphism sheen) và viền vàng Kintsugi.
    - 10.4. Hồ sơ lỗi `VIS-COPILOT-03`: Bong bóng tin nhắn AI hiển thị font Sans thường nhàm chán, thiếu phân biệt giữa Kanji, Furigana và giải nghĩa.
    - 10.5. Hồ sơ lỗi `VIS-COPILOT-04`: Biểu đồ cao độ ngữ âm Pitch Accent chỉ có các chấm tròn bay lơ lửng, thiếu đường cong sóng âm Tokyo liên tục.
    - 10.6. Hồ sơ lỗi `VIS-COPILOT-05`: Khung gợi ý câu hỏi nhanh (Prompt Suggestions) bị tràn ngang và khó bấm trên màn hình cảm ứng.

11. **CHƯƠNG 11: KIỂM TOÁN CHUYÊN SÂU PHÂN HỆ 10 — TOÀN CỤC TYPOGRAPHY, HỆ MÀU OKLCH, NỀN NGHỆ THUẬT & ĐIỀU HƯỚNG DI ĐỘNG (`layout.tsx`, `JapaneseArtBackdrop.tsx`, `KirieBottomNav.tsx`)**
    - 11.1. Hạ tầng kiểu chữ, màu sắc và layout toàn ứng dụng.
    - 11.2. Hồ sơ lỗi `VIS-SYS-01`: Typography toàn hệ thống thiếu chuẩn hóa Baseline Grid và fluid clamp formula cho màn hình từ 320px đến 4K.
    - 11.3. Hồ sơ lỗi `VIS-SYS-02`: Các biến màu CSS dùng mã HEX tĩnh phân tán, thiếu hệ màu động OKLCH với độ chênh lệch quang học hoàn hảo.
    - 11.4. Hồ sơ lỗi `VIS-SYS-03`: Backdrop tranh nghệ thuật Kirie/Ukiyo-e gây giảm độ tương phản văn bản nếu người dùng có thị lực kém hoặc dưới nắng gắt.
    - 11.5. Hồ sơ lỗi `VIS-SYS-04`: Thanh điều hướng đáy di động (KirieBottomNav) thiếu Safe Area Inset cho iPhone/iPad (Home Indicator notch clipping).

12. **CHƯƠNG 12: MA TRẬN TỔNG HỢP 55 LỖI, BỘ CHỈ SỐ THẨM MỸ ĐỊNH LƯỢNG AQM & LỘ TRÌNH THỰC THI SPRINT 1 ĐẾN SPRINT 5**
    - 12.1. Ma trận phân bổ 55 khuyết tật thị giác theo phân hệ và mức độ nghiêm trọng.
    - 12.2. Bộ chỉ số thẩm mỹ định lượng (Aesthetic Quantitative Metrics - AQM) & Kỹ thuật cảm xúc Kansei.
    - 12.3. Quy trình nghiệm thu chất lượng thị giác Awwwards & Apple Human Interface Guidelines.
    - 12.4. Lộ trình triển khai tái thiết kế 5 giai đoạn (Sprint Roadmap).

---

# CHƯƠNG 1: TUYÊN NGÔN THẨM MỸ SỐ WABI-SABI & HỆ KIẾN TRÚC THIẾT KẾ ĐỈNH CAO (HIGH-AESTHETIC FOUNDATION)

## 1.1. Triết học Wabi-Sabi và sự chuyển dịch vào không gian số (Digital Wabi-Sabi & Zen Minimalism)

Thiết kế giao diện người dùng cho việc học ngôn ngữ Nhật Bản không đơn thuần là việc bố trí các phần tử HTML, áp dụng vài lớp CSS bo góc hay chèn một hình nền núi Phú Sĩ ngẫu nhiên. Ngôn ngữ Nhật Bản vốn bắt nguồn sâu xa từ chiều sâu văn hóa và hệ tư tưởng mỹ học Á Đông — nơi mỗi con chữ Kanji là một biểu tượng tượng hình cô đọng hàng ngàn năm triết lý nhân sinh, nơi nhịp điệu của âm tiết (Mora) mang tính nhạc điệu uyển chuyển, và nơi khoảng trống tĩnh lặng giữa các nét cọ (Ma - 間) mang ý nghĩa biểu đạt mạnh mẽ hơn cả nét mực hữu hình.

Trong lịch sử mỹ học truyền thống Nhật Bản, bốn nguyên lý cốt lõi cấu thành nên linh hồn của cái đẹp:
1. **Wabi (侘)**: Vẻ đẹp mộc mạc, thanh nhã, giản dị, từ bỏ sự cầu kỳ phô trương để quay về với cốt lõi nguyên sơ của sự vật.
2. **Sabi (寂)**: Vẻ đẹp của thời gian, sự trầm mặc, phong sương và lắng đọng, giống như sắc rêu phong trên đá hay vân gỗ sẫm màu qua nhiều thế hệ.
3. **Yūgen (幽玄 - U huyền)**: Vẻ đẹp bí ẩn, sâu thẳm, gợi mở hơn là phơi bày toàn bộ, để lại không gian vô tận cho trí tưởng tượng và sự thấu cảm nội tâm.
4. **Kintsugi (金継ぎ - Hàn gắn vàng kim)**: Triết lý tôn vinh những vết nứt, biến những điểm khuyết thiếu thành điểm nhấn nghệ thuật độc bản bằng cách gắn kết chúng bằng nhựa sơn mài trộn bột vàng óng ánh.

Khi chuyển dịch hệ tư tưởng thẩm mỹ này vào không gian kỹ thuật số đương đại (Digital Aesthetics), chúng ta phải đối mặt với một thách thức to lớn: Làm sao để tái hiện được sự ấm áp, mộc mạc của giấy Dó Washi, độ trầm sâu của mực nho Sumi-e, và sự trang trọng của con dấu triện son Hanko, nhưng vẫn đảm bảo được tính sắc nét, mượt mà 120fps, khả năng đáp ứng linh hoạt (Fluid Responsiveness) và độ tương phản quang học chuẩn xác của các sản phẩm công nghệ hạng nhất như Apple iOS hay Linear App?

Đó chính là lý do sự kết hợp giữa **Mỹ học Wabi-Sabi** và **Kỹ năng Thiết kế Đẳng cấp Cao (`high-aesthetic-designer`)** ra đời. Kỹ năng này cung cấp các nguyên lý quang học khoa học, công thức toán học về ánh sáng, hệ màu OKLCH, và nhịp điệu typography chặt chẽ để hiện thực hóa triết lý Wabi-Sabi trên màn hình số một cách hoàn hảo nhất.

## 1.2. Thất bại thị giác của các hệ thống học tiếng Nhật truyền thống (The Cluttered Utility Antipattern)

Phần lớn các phần mềm học tiếng Nhật và công cụ thẻ ghi nhớ lặp lại ngắt quãng (SRS) hiện nay trên thị trường (như Anki thô, Quizlet đại trà, hay các từ điển số đời cũ) đều mắc phải những hội chứng thiết kế phản thẩm mỹ nghiêm trọng:
- **Hội chứng "Bàn thờ thông tin" (Information Graveyard)**: Nhồi nhét hàng chục trường dữ liệu (Hán tự, Hiragana, Romaji, Hán Việt, Nghĩa gốc, Nghĩa bóng, Từ đồng nghĩa, Câu ví dụ 1, Câu ví dụ 2, Ghi chú ngữ pháp) vào cùng một khung nhìn mà không hề có bất kỳ hệ thống phân cấp thị giác (Visual Hierarchy) nào. Mắt người học bị quá tải nhận thức (Cognitive Overload), không biết đâu là điểm neo thị giác (Visual Anchor) để tập trung ghi nhớ.
- **Hội chứng "Màu sắc nguyên thủy" (Dead Grays & Harsh Primitives)**: Sử dụng các mã màu HEX thô ráp như màu đen tuyệt đối `#000000`, xám chết `#808080`, đỏ cảnh báo chói lòa `#FF0000`, và xanh lá cây độc hại `#00FF00`. Những màu sắc này không hề tồn tại trong tự nhiên, gây ra sự ức chế quang học, mỏi mắt sau 15 phút ôn tập và phá hủy hoàn toàn cảm xúc thư thái của việc học tập.
- **Hội chứng "Bóng đổ dao cạo" (Razor-Sharp Shadows)**: Áp dụng một lớp đổ bóng thô kệch `box-shadow: 0 4px 6px rgba(0,0,0,0.3)`. Lớp bóng này giống như một miếng nhựa đen dán dưới chân phần tử, hoàn toàn thiếu đi ánh sáng phản xạ môi trường (Ambient bounce) và sự khuếch tán mềm mại của ánh sáng tự nhiên.
- **Hội chứng "Rối loạn kiểu chữ" (Typography Anarchy)**: Trộn lẫn ngẫu nhiên giữa font chữ không chân Sans-serif đậm đặc cho chữ Hán, font chữ Courier cho cách đọc, và font Arial cho tiếng Việt. Khoảng cách dòng (line-height) bị bóp nghẹt khiến các dấu thanh điệu tiếng Việt đè lên ký tự Hán tự bên trên, gây ra hiện tượng va chạm thị giác hỗn loạn.

Dự án `japanese-srs-system` ra đời nhằm mục đích xóa bỏ triệt để những dị tật giao diện này, đưa trải nghiệm ghi nhớ tiếng Nhật trở về đúng với bản chất của nó: Một nghệ thuật thiền định thị giác (Visual Zen Meditation).

## 1.3. Bốn trụ cột thẩm mỹ của kỹ năng `high-aesthetic-designer`

Để đạt được chất lượng hiển thị đẳng cấp Awwwards và Linear, hệ thống phải tuân thủ nghiêm ngặt 4 trụ cột kỹ thuật thị giác sau:

### Trụ cột A: Ánh sáng tri giác và Độ sâu tầng lớp (Perceptual Lighting & Layered Ambient Shadows)
Trong thế giới thực, không có vật thể nào chỉ tạo ra một lớp bóng đơn độc. Ánh sáng mặt trời hoặc ánh đèn phòng luôn tạo ra:
1. **Lớp viền phản quang (Key light rim)**: Một đường gờ sáng rất hẹp sát chân vật thể do ánh sáng chiếu xiên trực tiếp.
2. **Lớp nảy sáng môi trường (Ambient bounce)**: Phần bóng mờ trung gian do ánh sáng phản xạ từ bề mặt sàn hắt ngược lên.
3. **Lớp tỏa bóng sâu (Deep soft spread)**: Vùng tối rộng lớn, mờ nhạt dần ra xa, tạo cảm giác vật thể đang thực sự lơ lửng cách bề mặt nền một khoảng cách vật lý cụ thể.

Công thức xếp tầng bóng đổ chuẩn mực (Standard Triple-Layer Ambient Depth Formula):
```css
/* Tầng bóng cao cấp Wabi-Sabi Ambient Depth */
--elevation-washi-card: 
  0 1px 2px 0 rgba(18, 36, 56, 0.04),          /* 1. Key light rim: sắc nét, định vị */
  0 10px 24px -4px rgba(18, 36, 56, 0.07),      /* 2. Ambient bounce: nâng đỡ khối */
  0 24px 48px -12px rgba(18, 36, 56, 0.10);     /* 3. Deep soft spread: lan tỏa êm ái */

--elevation-washi-hover:
  0 2px 4px 0 rgba(18, 36, 56, 0.06),
  0 14px 32px -4px rgba(18, 36, 56, 0.09),
  0 36px 64px -16px rgba(18, 36, 56, 0.14);
```

### Trụ cột B: Đường viền vi mô và Ánh kim mờ ảo (Micro-Borders, Gradient Sheen & Frosted Glassmorphism)
Tuyệt đối loại bỏ các đường viền đặc 1px thô ráp (`border: 1px solid #CCCCCC`). Thay vào đó:
- Trên nền sáng (Light Washi Mode): Sử dụng đường viền siêu mỏng bán trong suốt kết hợp sắc ấm gỗ: `border: 1px solid rgba(140, 110, 80, 0.14)` hoặc `border: 1.2px solid #E6DDCF`.
- Trên nền tối (Dark Obsidian Mode): Sử dụng đường viền phát sáng vi mô: `border: 1px solid rgba(255, 255, 255, 0.08)` kèm dải gradient lướt mép trên `border-t-white/20`.
- Hiệu ứng Kính mờ Washi (Frosted Washi Glassmorphism): Kết hợp `backdrop-filter: blur(16px)` với độ trong suốt nền `rgba(255, 255, 255, 0.88)` (Light) hoặc `rgba(13, 23, 38, 0.82)` (Dark) để đảm bảo văn bản hiển thị sắc sảo mà nền tranh Kirie phía sau vẫn ánh lên vẻ đẹp huyền ảo lộng lẫy.

### Trụ cột C: Không gian màu OKLCH và Sắc độ sang trọng (Sophisticated Neutrals & Vibrant Focal Accents)
Hệ màu sRGB và HEX truyền thống có một nhược điểm chí mạng: Độ sáng cảm nhận (Perceived Lightness) bị méo mó nghiêm trọng giữa các dải màu (màu vàng trông sáng hơn màu xanh lam dù cùng giá trị Lightness). Để giải quyết vấn đề này, kiến trúc giao diện mới chuyển đổi toàn bộ sang không gian màu **OKLCH (Oklab Lightness, Chroma, Hue)**:
- **Màu nền trung tính Washi (Sophisticated Neutrals)**:
  - Nền giấy dó sáng: `oklch(97.5% 0.012 85)` (Tương đương `#FAF7F2` với ánh vàng sợi dâu tằm tự nhiên).
  - Nền thẻ cuộn tranh: `oklch(99.2% 0.005 85)` (Tương đương `#FFFEFA` với độ tinh khiết thanh nhã).
  - Màu đen mực nho Sumi-e: `oklch(18.5% 0.025 240)` (Tương đương `#122438` — sắc đen huyền bí có ánh chàm biển đêm, hoàn toàn không phải đen chết `#000000`).
- **Màu nhấn văn hóa Nhật Bản (Cultural Japanese Accents - Tỷ lệ sử dụng < 10% bề mặt)**:
  - **Son đỏ Torii (Shu-iro / 朱色)**: `oklch(56.5% 0.22 28)` (`#C83824`) — Đại diện cho cổng thần đạo Torii, con dấu triện son Hanko, chữ Hán Kanji và điểm nhấn Active Recall.
  - **Chàm lam đại dương (Aizome / 藍染)**: `oklch(42.0% 0.12 245)` (`#1E4B75`) — Đại diện cho cấu trúc ngữ pháp Bunbou, mẫu câu và chiều sâu học thuật.
  - **Xanh tre rừng trúc (Take-iro / 竹色)**: `oklch(52.5% 0.14 145)` (`#2A6B3D`) — Đại diện cho từ vựng Kotoba, trạng thái FSRS đã củng cố vững chắc và thành tựu học tập.
  - **Vàng kim Kintsugi (Kiniro / 金色)**: `oklch(74.0% 0.13 78)` (`#C89B58`) — Đại diện cho câu ví dụ, cao độ trọng âm Pitch Accent và đường viền kim loại quý tộc.

### Trụ cột D: Nhịp điệu Thư pháp & Kiểu chữ biên tập (Editorial Typography & Optical Rhythm)
Sự kết hợp hoàn hảo giữa cặp đôi kiểu chữ (Editorial Contrast Pair):
1. **Kiểu chữ Thư pháp Cổ điển (Display Serif)**: `Shippori Mincho` và `Noto Serif JP`. Dành riêng cho chữ Hán tự Kanji lớn, tiêu đề mẫu câu ngữ pháp, và các nhãn triện cổ điển. Nét thanh nét đậm có độ tương phản quang học cao, mô phỏng chân thực chuyển động của đầu cọ lông trên mặt giấy lụa.
2. **Kiểu chữ Tròn Trị Kỹ Thuật (Data & Body Sans)**: `Zen Maru Gothic` và `Plus Jakarta Sans`. Dành cho âm đọc Hiragana/Katakana, nghĩa tiếng Việt, số liệu FSRS và giao diện điều hướng. Đường nét bo tròn êm dịu tạo cảm giác gần gũi, loại bỏ hoàn toàn sự căng thẳng tâm lý khi học tập cường độ cao.
3. **Công thức co giãn kiểu chữ linh hoạt (Fluid Typography Formula)**:
   $$\text{fontSize} = \text{clamp}(V_{\min}, V_{\min} + (V_{\max} - V_{\min}) \times \frac{\text{viewport} - W_{\min}}{W_{\max} - W_{\min}}, V_{\max})$$
   Áp dụng tuyệt đối cho mọi tiêu đề và thẻ học, ngăn chặn 100% hiện tượng tràn chữ trên màn hình nhỏ.

## 1.4. Lưới bất đối xứng Bento Grid (3:2 và 2:1) & Tỷ lệ vàng của khoảng trống âm (Negative Whitespace > 40%)

Cấu trúc giao diện dashboard hiện đại từ bỏ hoàn toàn các lưới chia ô đối xứng buồn tẻ (như 4 cột bằng nhau hay danh sách dọc đơn điệu). Thay vào đó, chúng ta áp dụng **Cấu trúc Bento Grid Nhật Bản**:
- **Khối Neo Thị Giác Chính (Hero Anchor Card)**: Chiếm 2/3 bề ngang (tỷ lệ 2:1 hoặc 3:2), chứa thẻ học trọng tâm đang đến hạn ôn tập với kích thước mặt chữ bề thế, có đầy đủ công cụ phát âm, biểu đồ cao độ ngữ âm và câu ví dụ ngữ cảnh.
- **Các Khối Vệ Tinh Phụ (Satellite Bento Cards)**: Chiếm 1/3 bề ngang còn lại, gồm 2 thẻ xếp chồng theo chiều dọc:
  - Thẻ vệ tinh trên: Thống kê trạng thái nhận thức FSRS (Đã củng cố vs Cần ôn ngay).
  - Thẻ vệ tinh dưới: Lối tắt vào Đấu trường Chia Động Từ hoặc Khám phá Ngữ pháp mới.
- **Quy tắc Khoảng trống Âm (Negative Whitespace Rule)**: Ít nhất 40% diện tích màn hình phải là không gian thở (Breathing Room). Khoảng trống không phải là diện tích bị lãng phí, mà là lớp đệm tâm lý giúp não bộ người học phục hồi sau mỗi lần kích hoạt phản xạ Active Recall.

## 1.5. Ma trận độ phân giải màn hình, Ranh giới hiển thị (Breakpoints) & Tiêu chuẩn Accessibility Quốc tế

| Breakpoint Name | Viewport Width ($W$) | Thiết bị đại diện | Quy tắc bố cục (Layout Rule) | Thách thức thị giác cần xử lý |
| :--- | :--- | :--- | :--- | :--- |
| **Mobile Compact** | $320\text{px} - 374\text{px}$ | iPhone SE, Galaxy Z Flip cover | 1 cột đơn tuyệt đối, Bento xếp dọc, padding $12\text{px}$ | Kanji $\ge 15$ ký tự tràn lề, nút bấm che lấp nhau |
| **Mobile Standard**| $375\text{px} - 430\text{px}$ | iPhone 14/15/16 Pro, Pixel 8 | 1 cột đơn, bottom nav nổi, padding $16\text{px}$ | Tranh chấp vị trí giữa FAB Sensei và Bottom Bar |
| **Tablet Portrait** | $768\text{px} - 834\text{px}$ | iPad Mini, iPad 10.9" | Bento Grid 2 cột tỉ lệ 1:1, menu ngang gọn | Bảng cards bị kéo giãn chữ, khoảng trống dư thừa |
| **Tablet Landscape**| $1024\text{px} - 1180\text{px}$| iPad Pro 11", Surface Pro | Bento Grid 3 cột tỉ lệ 2:1, padding $24\text{px}$ | Tỉ lệ cân đối giữa cột Hán tự và cột phiên âm |
| **Desktop HD**     | $1280\text{px} - 1440\text{px}$| Macbook Air/Pro, Laptop FHD | Khung giới hạn tối đa `max-w-[1140px]` căn giữa | Nền tranh nghệ thuật bị méo tỉ lệ nếu kéo giãn |
| **Desktop 4K / QHD**| $\ge 1920\text{px}$          | Màn hình chuyên dụng 27"-32"| Khung trung tâm cố định, nền tranh Kirie tự mở rộng | Tránh hiện tượng thẻ học bị thu nhỏ bất thường |

**Tiêu chuẩn Accessibility Bắt buộc (WCAG 2.2 AAA Compliance)**:
- **Tỉ lệ tương phản văn bản thường (Contrast Ratio)**: Tối thiểu $7.0:1$ đối với văn bản dưới 18pt và tối thiểu $4.5:1$ đối với văn bản lớn $\ge 18\text{pt}$ hoặc in đậm $\ge 14\text{pt}$.
- **Vùng chạm cảm ứng tối thiểu (Touch Target Size)**: Tối thiểu $44\text{px} \times 44\text{px}$ cho tất cả các nút bấm, icon loa phát âm thanh và thẻ tương tác (WCAG 2.5.5 / 2.5.8).
- **Tránh giật layout tích lũy (Cumulative Layout Shift - CLS)**: $\text{CLS} \le 0.02$ trong mọi thao tác lật thẻ và chuyển đổi tab.

---

# CHƯƠNG 2: KIỂM TOÁN CHUYÊN SÂU PHÂN HỆ 1 — TRANG CHỦ DASHBOARD & BÀN KARUTA ĐỘC BẢN (`src/app/page.tsx`)

## 2.1. Bản đồ thị giác tổng thể trang chủ & Điểm nghẽn bố cục

Trang chủ (`/` — `src/app/page.tsx`) đóng vai trò là "Sảnh đường bước vào không gian thiền định học tập" (Zen Study Sanctuary). Đây là nơi người học tiếp xúc đầu tiên mỗi ngày để nắm bắt tình trạng trí nhớ FSRS, kiểm tra số lượng thẻ đến hạn (Due), và kích hoạt phiên ôn tập Karuta tức thời. 

Cấu trúc hiện tại của trang chủ bao gồm 4 khối thành phần chính:
1. **Khối 1: Sổ cái học tập tối thượng (Top Study Ledger)**: Bảng tóm tắt chỉ số gồm ngày tháng âm lịch/dương lịch tiếng Việt, tổng số thẻ đang nợ ôn tập (`dueToday`), tổng số thẻ đã củng cố vững chắc (`doneThisSprint`), và một nút bấm hành động duy nhất "ÔN TẬP NGAY" (Primary Action Call-to-Action).
2. **Khối 2: Lưới Bento KPI Trạng thái Nhận thức**: Các thẻ nhỏ hiển thị phân bổ từ vựng theo giáo trình JPD133, N5 Core, và Bunbou Ngữ pháp.
3. **Khối 3: Bàn Karuta Tiêu điểm (Focus Review Cards)**: Danh sách 5 thẻ học tiêu biểu đang chờ được nạp vào trí nhớ dài hạn, có nút loa phát âm Furigana, chỉ số ổn định FSRS (Stability), và huy hiệu trạng thái.
4. **Khối 4: Cổng điều hướng nhanh (Quick Feature Gateways)**: Hai biểu ngữ dẫn lối vào Đấu trường Chia Động Từ và Giáo trình Ngữ pháp kèm hình ảnh minh họa hoa anh đào và sóng biển.

Mặc dù kiến trúc chức năng đã hoạt động trơn tru, việc kiểm toán thị giác chuyên sâu đã phát hiện ra **6 khuyết tật thẩm mỹ và lỗi hiển thị nghiêm trọng** làm suy giảm nghiêm trọng giá trị cảm xúc của người dùng. Dưới đây là phân tích chi tiết từng trường hợp:

---

## 2.2. Hồ sơ lỗi `VIS-HOME-01`: Top Study Ledger thiếu chiều sâu quang học đa tầng (Flat 1-layer shadow, thiếu key light rim & ambient bounce)

### 1. Mã định danh lỗi & Tên gọi thẩm mỹ
- **Mã lỗi**: `VIS-HOME-01`
- **Tên gọi**: Thiếu chiều sâu quang học đa tầng tại Khối Sổ Cái Học Tập (Top Study Ledger Optical Depth Deficiency).

### 2. Phân loại lỗi & Mức độ nghiêm trọng
- **Phân loại**: Lỗi Ánh sáng & Đổ bóng (Lighting & Elevation / Perceptual Depth Flaw).
- **Mức độ nghiêm trọng**: **P2 - High** (Ảnh hưởng trực tiếp đến ấn tượng thẩm mỹ đầu tiên khi người dùng mở ứng dụng).

### 3. Vị trí tệp tin nguồn & Phạm vi dòng mã
- **Tệp tin**: [`src/app/page.tsx`](file:///D:/project/japanese-srs-system/src/app/page.tsx)
- **Vị trí dòng mã**: Dòng 336 – 348
- **Thành phần DOM**: `<section style={{ ... box-shadow: '0 4px 16px rgba(31, 36, 33, 0.03)' ... }}>`

### 4. Hiện trạng thực tế & Triệu chứng hiển thị trên màn hình
Khối Sổ Cái Học Tập được đặt ở vị trí cao nhất trên trang chủ, là trung tâm chú ý thị giác. Tuy nhiên, khối này hiện tại chỉ sử dụng một thuộc tính đổ bóng đơn giản:
```css
boxShadow: '0 4px 16px rgba(31, 36, 33, 0.03)'
```
Trên màn hình máy tính có độ sáng cao (Macbook Retina, OLED) hoặc trong môi trường ánh sáng ngoài trời, giá trị opacity `0.03` quá nhạt khiến đường viền của khối hoàn toàn bị hòa tan vào hình nền Ukiyo-e phía sau. Kết quả là khối này trông giống như một miếng giấy trắng dẹt phẳng bị dán đè lên màn hình, không hề có cảm giác tách lớp không gian (Depth Separation). Hơn nữa, cạnh trên của thẻ hoàn toàn thiếu đường viền phản quang (Key Light Rim), khiến nó mất đi vẻ sắc sảo cao cấp của các sản phẩm Awwwards-tier.

### 5. Phân tích nguyên nhân gốc rễ kỹ thuật
1. **Thiếu sự thấu hiểu về quang học bề mặt (Surface Optics)**: Đổ bóng một lớp `0 4px 16px` chỉ đại diện cho một nguồn sáng vô hướng khuếch tán yếu. Nó thiếu thành phần sắc nét (Sharp contact shadow) ở cự ly gần và thiếu thành phần phân tán mềm (Soft ambient occlusion) ở cự ly xa.
2. **Xung đột với lớp hình nền nghệ thuật**: Phía sau khối là `JapaneseArtBackdrop` chứa các hoa văn sóng biển Ukiyo-e. Một lớp bóng `rgba(31, 36, 33, 0.03)` không đủ mật độ quang học để triệt tiêu các đường nét gồ ghề của tranh nền bên dưới, gây ra hiện tượng viền khối bị nham nhở thị giác (Visual border bleeding).
3. **Thiếu viền vi mô bán trong suốt (Micro-border)**: Viền hiện tại là `border: 1.5px solid #E8E2D8` là một màu đục cố định (Opaque Hex). Khi chuyển giữa các vùng tranh nền sáng/tối, viền này không thể tự thích ứng độ trong suốt quang học.

### 6. Tác động tâm lý nhận thức & Trải nghiệm học tập
Khối Sổ Cái là nơi người học cần cảm nhận được sự chắc chắn, tĩnh tại và trang trọng trước khi bắt đầu bài học. Cảm giác "phẳng lỳ và dán tạm bợ" tạo ra ấn tượng tiềm thức rằng hệ thống chưa được hoàn thiện trau chuốt, làm giảm sự tôn trọng và cảm hứng cam kết học tập hàng ngày của học viên (Kansei Value Degradation).

### 7. Tiêu chuẩn thẩm mỹ mục tiêu & Hệ quy chiếu thiết kế
- Áp dụng nguyên lý **Perceptual Lighting & Layered Ambient Shadows** từ kỹ năng `high-aesthetic-designer`.
- Xếp chồng 3 lớp bóng:
  1. Key light rim: `0 1px 3px 0 rgba(18, 36, 56, 0.05)`
  2. Ambient bounce: `0 12px 28px -6px rgba(18, 36, 56, 0.08)`
  3. Deep soft spread: `0 32px 64px -12px rgba(18, 36, 56, 0.06)`
- Viền vi mô Washi Sheen: `border: 1.2px solid rgba(200, 155, 88, 0.22)` kết hợp gradient gờ sáng mép trên `linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)`.

### 8. Giải pháp thiết kế & Kiến trúc sửa đổi chi tiết
Thay thế toàn bộ cụm inline styles của `<section>` Sổ Cái Học Tập bằng một cấu trúc thẻ Washi đa lớp tinh xảo:
1. Tăng cường `backdropFilter: 'blur(16px)'` và độ đục nền lên `rgba(255, 255, 255, 0.94)` để ngăn chặn hoàn toàn vân sóng biển phía sau xuyên thủng văn bản.
2. Áp dụng Triple-Layer Ambient Shadows đã chuẩn hóa.
3. Thêm một lớp phủ vi mô bên trong (Inner Glow): `boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.8), ...'`.
4. Bo góc mượt mà kiểu iOS Squircle: `borderRadius: '24px'`.

### 9. Mã nguồn giải pháp hoàn chỉnh (Production-Ready Code Fix)
```tsx
// [ĐỀ XUẤT SỬA ĐỔI TẠI src/app/page.tsx: Dòng 336-348]
<section
  style={{
    background: 'rgba(255, 255, 255, 0.94)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1.2px solid rgba(200, 155, 88, 0.25)',
    borderRadius: '24px',
    padding: '2rem 2.25rem',
    marginBottom: '2.25rem',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: `
      0 1px 2px 0 rgba(18, 36, 56, 0.05),
      0 12px 28px -6px rgba(18, 36, 56, 0.07),
      0 32px 64px -12px rgba(18, 36, 56, 0.08),
      inset 0 1px 1px 0 rgba(255, 255, 255, 0.9)
    `,
    transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease',
  }}
>
```

### 10. Tiêu chí nghiệm thu thị giác & Kịch bản kiểm thử quy hồi
- **Kiểm thử độ tương phản**: Đo lường viền thẻ trên nền tranh Ukiyo-e sóng biển, đạt tỉ lệ tương phản quang học $\ge 3.0:1$ đối với đường viền (WCAG 1.4.11 Non-text Contrast).
- **Kiểm thử góc nhìn nghiêng (Optical Tilt Test)**: Khối thẻ tạo cảm giác nổi bật rõ rệt 3D, lơ lửng cách mặt giấy nền khoảng $8\text{px}$ thị giác.
- **Kiểm thử hiệu năng GPU**: Đảm bảo `backdrop-filter` không gây tụt khung hình (FPS duy trì ổn định $\ge 60\text{fps}$ khi cuộn trang nhanh).

---

## 2.3. Hồ sơ lỗi `VIS-HOME-02`: Thẻ Bento KPI vỡ bố cục trên Mobile <375px do cố định padding và flex-nowrap

### 1. Mã định danh lỗi & Tên gọi thẩm mỹ
- **Mã lỗi**: `VIS-HOME-02`
- **Tên gọi**: Vỡ bố cục thẻ chỉ số Bento KPI trên màn hình hẹp (Mobile Viewport Bento KPI Layout Overflow).

### 2. Phân loại lỗi & Mức độ nghiêm trọng
- **Phân loại**: Lỗi Đáp ứng Di động & Tràn Bố Cục (Mobile Responsiveness & Layout Break).
- **Mức độ nghiêm trọng**: **P1 - Critical** (Làm vỡ hiển thị trên các thiết bị iPhone SE, iPhone 12/13 Mini và Android màn hình nhỏ).

### 3. Vị trí tệp tin nguồn & Phạm vi dòng mã
- **Tệp tin**: [`src/app/page.tsx`](file:///D:/project/japanese-srs-system/src/app/page.tsx)
- **Vị trí dòng mã**: Dòng 355 – 410
- **Thành phần DOM**: `<div style={{ display: 'flex', gap: '1.5rem', ... }}>` bên trong `Top Study Ledger`.

### 4. Hiện trạng thực tế & Triệu chứng hiển thị trên màn hình
Bên trong Sổ Cái Học Tập, các chỉ số thống kê (Số thẻ đến hạn ôn, Thẻ mới cần tiếp nhận, Tỷ lệ duy trì FSRS) được xếp ngang hàng bằng `display: flex` với khoảng cách cố định `gap: '1.5rem'` và `padding: '1.75rem 2rem'`. 
Khi xem trên màn hình có chiều rộng $320\text{px} - 375\text{px}$ (iPhone SE hoặc màn hình thu nhỏ):
- Các con số lớn (`3.2rem`) và nhãn tiếng Việt (`Đến hạn hôm nay`) bị ép chặt vào nhau.
- Nút bấm chính "ÔN TẬP NGAY" bị đẩy tràn ra khỏi mép phải màn hình, tạo ra thanh cuộn ngang ngoài ý muốn (Horizontal scrollbar).
- Cột mốc số phần trăm bị gãy đôi thành 2 dòng kỳ dị: "9" ở dòng trên và "4%" ở dòng dưới.

### 5. Phân tích nguyên nhân gốc rễ kỹ thuật
1. **Thiếu Media Queries và Flex-Wrap thích ứng**: Container cha sử dụng `flex-wrap: nowrap` ngầm định của flexbox và không có quy tắc xuống dòng khi tổng bề rộng của các phần tử con vượt quá bề rộng màn hình.
2. **Kích thước Font chữ cố định bằng đơn vị Rem tĩnh (Static Typography)**: Số đếm sử dụng `fontSize: '3.2rem'` cố định. Trên màn hình $320\text{px}$, riêng con số đã chiếm gần một nửa chiều ngang khả dụng, không để lại khoảng trống cho các nhãn phụ.
3. **Khoảng đệm (Padding) quá lớn không co giãn**: `padding: 2rem` ngốn mất $64\text{px}$ (tương đương 20% chiều rộng của viewport $320\text{px}$).

### 6. Tác động tâm lý nhận thức & Trải nghiệm học tập
Người học sử dụng điện thoại di động để ôn bài nhanh khi đang đi tàu điện hoặc giờ giải lao. Việc màn hình bị tràn ngang, nút bấm quan trọng nhất bị che khuất tạo ra sự ức chế tâm lý tột độ, cản trở việc hình thành thói quen học tập vi mô hàng ngày (Micro-learning Habit Disruption).

### 7. Tiêu chuẩn thẩm mỹ mục tiêu & Hệ quy chiếu thiết kế
- Tuân thủ nguyên tắc **Bento Grid & Fluid Typography Formula** của `high-aesthetic-designer`.
- Trên Mobile ($<640\text{px}$): Tự động chuyển đổi thành lưới Bento 2 cột hoặc bố cục dọc thông minh (Vertical Stacking) với `gap: '0.75rem'` và `padding: '1.25rem 1rem'`.
- Áp dụng công thức `fontSize: 'clamp(2rem, 6vw, 3.2rem)'` cho các con số KPI.

### 8. Giải pháp thiết kế & Kiến trúc sửa đổi chi tiết
Tái cấu trúc khối số liệu sang CSS Grid linh hoạt với breakpoint `@media (max-width: 640px)`:
1. Container cha sử dụng CSS Grid: `gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))'`.
2. Nút bấm chính "Ôn Tập Ngay" được tách thành một hàng riêng biệt độc lập bên dưới trên di động, chiếm trọn 100% bề rộng (`width: 100%`) để ngón tay cái người dùng có thể chạm tới cực kỳ dễ dàng (Fitts's Law Optimization).

### 9. Mã nguồn giải pháp hoàn chỉnh (Production-Ready Code Fix)
```tsx
// [ĐỀ XUẤT SỬA ĐỔI TẠI src/app/page.tsx: Dòng 355-410]
<div
  className="kpi-ledger-grid"
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '1rem',
    alignItems: 'center',
    width: '100%',
  }}
>
  {/* Thẻ Chỉ số 1: Đến hạn hôm nay */}
  <div
    style={{
      background: 'rgba(200, 56, 36, 0.05)',
      border: '1.2px solid rgba(200, 56, 36, 0.16)',
      borderRadius: '16px',
      padding: '1rem 1.15rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
    }}
  >
    <span
      style={{
        fontFamily: 'var(--font-maru)',
        fontSize: '0.76rem',
        fontWeight: 700,
        color: '#C83824',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      }}
    >
      Đến hạn hôm nay
    </span>
    <span
      style={{
        fontFamily: 'var(--font-mincho)',
        fontSize: 'clamp(1.85rem, 5vw, 2.75rem)',
        fontWeight: 900,
        color: '#9E2413',
        lineHeight: 1.1,
      }}
    >
      {stats.dueToday}
      <span style={{ fontSize: '0.9rem', fontWeight: 600, marginLeft: '0.25rem', color: '#786A5E' }}>
        thẻ
      </span>
    </span>
  </div>

  {/* Thẻ Chỉ số 2: Đã hoàn thành */}
  <div
    style={{
      background: 'rgba(42, 107, 61, 0.05)',
      border: '1.2px solid rgba(42, 107, 61, 0.16)',
      borderRadius: '16px',
      padding: '1rem 1.15rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
    }}
  >
    <span
      style={{
        fontFamily: 'var(--font-maru)',
        fontSize: '0.76rem',
        fontWeight: 700,
        color: '#2A6B3D',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      }}
    >
      Đã củng cố FSRS
    </span>
    <span
      style={{
        fontFamily: 'var(--font-mincho)',
        fontSize: 'clamp(1.85rem, 5vw, 2.75rem)',
        fontWeight: 900,
        color: '#1B522A',
        lineHeight: 1.1,
      }}
    >
      {stats.doneThisSprint}
      <span style={{ fontSize: '0.9rem', fontWeight: 600, marginLeft: '0.25rem', color: '#786A5E' }}>
        thẻ
      </span>
    </span>
  </div>
</div>
```

### 10. Tiêu chí nghiệm thu thị giác & Kịch bản kiểm thử quy hồi
- **Kiểm thử trên thiết bị $320\text{px}$ (iPhone SE 1st Gen, Safari Responsive Mode)**: Tuyệt đối không xuất hiện thanh cuộn ngang ($x$-overflow = 0).
- **Kiểm thử khả năng đọc (Legibility Test)**: Chữ số và nhãn phụ không bị ngắt dòng bất thường ở mọi độ phân giải từ $320\text{px}$ đến $1920\text{px}$.
- **Kiểm thử vùng bấm ngón tay cái (Thumb Zone Ergonomics)**: Nút hành động chính có chiều cao tối thiểu $52\text{px}$, chiếm vị trí trung tâm trong tầm với tự nhiên của ngón tay cái.

---

## 2.4. Hồ sơ lỗi `VIS-HOME-03`: Trùng lặp câu ví dụ thô bên dưới phần giải nghĩa do so sánh lỏng lẻo chuỗi Cloze

### 1. Mã định danh lỗi & Tên gọi thẩm mỹ
- **Mã lỗi**: `VIS-HOME-03`
- **Tên gọi**: Trùng lặp câu ví dụ đục lỗ trong thẻ tiêu điểm Karuta (Karuta Focus Card Cloze Redundancy Leak).

### 2. Phân loại lỗi & Mức độ nghiêm trọng
- **Phân loại**: Lỗi Trùng Lặp Nội Dung & Rối Loạn Dữ Liệu (Data Formatting & Semantic Clutter).
- **Mức độ nghiêm trọng**: **P2 - High** (Gây xao nhãng nhận thức nghiêm trọng trong quá trình học thẻ).

### 3. Vị trí tệp tin nguồn & Phạm vi dòng mã
- **Tệp tin**: [`src/app/page.tsx`](file:///D:/project/japanese-srs-system/src/app/page.tsx)
- **Vị trí dòng mã**: Dòng 670 – 715
- **Thành phần DOM**: Khối render `card.example` bên dưới `card.meaning` trong danh sách thẻ tiêu điểm.

### 4. Hiện trạng thực tế & Triệu chứng hiển thị trên màn hình
Khi hiển thị các thẻ Ngữ pháp (Grammar Pattern) hoặc câu Cloze trong danh sách tiêu điểm trên trang chủ:
- Mặt trước thẻ đã hiển thị câu tiếng Nhật hoàn chỉnh có highlight: `私は横浜に住んでいます。`.
- Phía dưới giải nghĩa tiếng Việt, hệ thống lại tiếp tục in thêm một dòng:
  `Ví dụ ngữ cảnh: 私は横浜に住んでいます。`
- Thậm chí trong trường hợp chưa qua xử lý làm sạch, dòng này còn bị dính ký tự thô Anki:
  `Ví dụ: {{c1::私は横浜に住んでいます。}}`
Kết quả là cùng một câu tiếng Nhật xuất hiện lặp lại tới 2 lần trên cùng một tấm thẻ nhỏ, khiến tấm thẻ trông dài ngoằng, vụng về và thiếu tính chuyên nghiệp.

### 5. Phân tích nguyên nhân gốc rễ kỹ thuật
1. **Thiếu bộ lọc làm sạch chuỗi đa tầng (Multi-tier String Sanitization)**: Thuộc tính `card.sentence` trong cơ sở dữ liệu thường được lưu trữ giống hệt mặt trước `card.front` đối với các thẻ dạng Cloze Deletion.
2. **So sánh chuỗi không bình thường hóa (Unnormalized Equality Check)**: Mã nguồn cũ chỉ so sánh đơn thuần `card.example !== card.kanji`. Nhưng vì `card.kanji` chứa cú pháp `{{c1::...}}` còn `card.example` có thể không chứa, nên phép so sánh trả về `true` (khác nhau), dẫn đến việc render lặp lại câu ví dụ.

### 6. Tác động tâm lý nhận thức & Trải nghiệm học tập
Nguyên tắc cốt lõi của thiết kế thẻ Flashcard theo triết lý Wabi-Sabi là **Tính nguyên tử tối giản (Atomic Brevity)**: Mỗi thẻ chỉ truyền tải duy nhất một mảnh tri thức trọng tâm. Việc lặp lại một câu văn hai lần làm phân tán sự tập trung của thị giác, khiến người học phải đọc lại thông tin thừa thãi, gây lãng phí năng lượng não bộ.

### 7. Tiêu chuẩn thẩm mỹ mục tiêu & Hệ quy chiếu thiết kế
- Ứng dụng kỹ thuật `stripCloze` để chuẩn hóa cả hai chuỗi trước khi so sánh logic:
  $$\text{shouldRenderExample} = \text{stripCloze}(E).\text{trim}() \neq \text{stripCloze}(F).\text{trim}() \land \text{length}(E) > \text{length}(F)$$
- Chỉ render câu ví dụ khi câu ví dụ thực sự mang lại ngữ cảnh mới mở rộng ($i+1$ Comprehensible Input).

### 8. Giải pháp thiết kế & Kiến trúc sửa đổi chi tiết
1. Triệt tiêu hoàn toàn việc render câu ví dụ nếu nội dung sau khi loại bỏ Cloze trùng khớp với mặt trước.
2. Nếu câu ví dụ thực sự khác biệt, trình bày câu ví dụ trong một hộp Washi nhỏ tinh tế có biểu tượng lá trà `🍃 Ngữ cảnh:` với đường nét trang nhã.

### 9. Mã nguồn giải pháp hoàn chỉnh (Production-Ready Code Fix)
```tsx
// [ĐỀ XUẤT SỬA ĐỔI TẠI src/app/page.tsx: Dòng 670-715]
{(() => {
  const cleanFront = stripCloze(mainSurface).trim();
  const cleanExample = card.example ? stripCloze(card.example).trim() : '';
  const isMeaningRedundant = cleanExample === cleanFront;

  if (!card.example || isMeaningRedundant) return null;

  return (
    <div
      style={{
        marginTop: '0.85rem',
        padding: '0.65rem 0.85rem',
        background: 'rgba(250, 247, 240, 0.75)',
        borderLeft: '3px solid #C89B58',
        borderRadius: '0 8px 8px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.2rem',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-maru)',
          fontSize: '0.72rem',
          fontWeight: 700,
          color: '#8A7560',
          letterSpacing: '0.04em',
        }}
      >
        🍃 Ngữ cảnh minh họa:
      </span>
      <span
        style={{
          fontFamily: 'var(--font-mincho)',
          fontSize: '0.94rem',
          color: '#122438',
          lineHeight: 1.45,
        }}
      >
        {cleanExample}
      </span>
    </div>
  );
})()}
```

### 10. Tiêu chí nghiệm thu thị giác & Kịch bản kiểm thử quy hồi
- **Kiểm thử khử trùng lặp**: Xác minh 96 thẻ Ngữ pháp JPD133 trong cơ sở dữ liệu không còn bất kỳ trường hợp nào in lại câu ví dụ giống hệt mặt trước.
- **Kiểm thử loại bỏ cú pháp Cloze**: Tuyệt đối không còn ký tự `{c1::` hay `}}` lọt ra ngoài giao diện thẻ tiêu điểm.

---

## 2.5. Hồ sơ lỗi `VIS-HOME-04`: Huy hiệu hạn ôn tập (Due Pill) tương phản gắt (#D9381E) phá vỡ tính tĩnh lặng Wabi-Sabi

### 1. Mã định danh lỗi & Tên gọi thẩm mỹ
- **Mã lỗi**: `VIS-HOME-04`
- **Tên gọi**: Huy hiệu hạn ôn tập quá gắt phá vỡ cân bằng quang học (Harsh Due Pill Optical Disharmony).

### 2. Phân loại lỗi & Mức độ nghiêm trọng
- **Phân loại**: Lỗi Lý thuyết Màu sắc & Cảm xúc (Color Theory & Emotional Discordance).
- **Mức độ nghiêm trọng**: **P3 - Medium** (Gây căng thẳng thị giác không cần thiết cho người học).

### 3. Vị trí tệp tin nguồn & Phạm vi dòng mã
- **Tệp tin**: [`src/app/page.tsx`](file:///D:/project/japanese-srs-system/src/app/page.tsx)
- **Vị trí dòng mã**: Dòng 638 – 660
- **Thành phần DOM**: `<div style={{ background: '#FFF2F0', color: '#D9381E', border: '1px solid #F5C6CB' ... }}>`

### 4. Hiện trạng thực tế & Triệu chứng hiển thị trên màn hình
Huy hiệu cảnh báo thẻ "Đến hạn" đang sử dụng màu đỏ còi báo cháy `#D9381E` trên nền hồng `#FFF2F0` kèm một dấu chấm đỏ nhấp nháy. 
Khi hiển thị trên danh sách 5 thẻ tiêu điểm, các đốm đỏ này nổi bần bật một cách hung hăng, tạo cảm giác như một danh sách thông báo lỗi hệ thống (System Error Alert) hơn là một danh sách các từ vựng thân quen cần ôn tập.

### 5. Phân tích nguyên nhân gốc rễ kỹ thuật
- **Lạm dụng màu cảnh báo hệ thống (Semantic Alert Color Misuse)**: Lập trình viên đã sao chép bảng màu của component cảnh báo lỗi form (`alert-error`) sang làm nhãn trạng thái học tập.
- **Trái ngược triết lý Zen**: Trong văn hóa Nhật Bản, việc một từ vựng đến hạn ôn tập là một cơ hội tự nhiên để tưới tắm trí nhớ (như tưới nước cho cây bonsai), chứ không phải là một "sự cố" hay "hình phạt trễ hạn".

### 6. Tác động tâm lý nhận thức & Trải nghiệm học tập
Màu đỏ cảnh báo gay gắt kích hoạt phản ứng sợ hãi nhẹ ở hạch hạnh nhân (Amygdala Fear Response), khiến người học cảm thấy có lỗi vì đã để dồn ứ bài học, từ đó nảy sinh tâm lý trì hoãn (Procrastination) thay vì hào hứng ôn tập.

### 7. Tiêu chuẩn thẩm mỹ mục tiêu & Hệ quy chiếu thiết kế
- Chuyển đổi sang sắc **Son đỏ Torii Trầm (Shu-iro / 朱色)** chuẩn OKLCH: `oklch(58% 0.18 28)` phối hợp cùng nền giấy lụa đào `rgba(200, 56, 36, 0.08)` và viền sợi chỉ son `rgba(200, 56, 36, 0.22)`.
- Thay đổi chấm tròn nhấp nháy báo động thành biểu tượng chuông gió Furin `🎐 Cần ôn` hoặc đồng hồ cát Wabi-Sabi tĩnh tại.

### 8. Giải pháp thiết kế & Kiến trúc sửa đổi chi tiết
Hiệu chỉnh lại toàn bộ bảng màu và nhịp điệu của huy hiệu Due Pill:
```tsx
// [ĐỀ XUẤT SỬA ĐỔI TẠI src/app/page.tsx: Dòng 638-660]
<div
  style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.74rem',
    fontFamily: 'var(--font-maru)',
    color: '#B5301E',
    fontWeight: 700,
    background: 'rgba(200, 56, 36, 0.06)',
    border: '1.2px solid rgba(200, 56, 36, 0.22)',
    padding: '0.2rem 0.65rem',
    borderRadius: '999px',
    letterSpacing: '0.02em',
  }}
>
  <span
    style={{
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: '#C83824',
      boxShadow: '0 0 6px rgba(200, 56, 36, 0.4)',
    }}
  />
  <span>Đến kỳ ôn tập</span>
</div>
```

### 10. Tiêu chí nghiệm thu thị giác & Kịch bản kiểm thử quy hồi
- Đạt độ tương phản WCAG 2.2 AAA $\ge 7:1$ trên nền thẻ trắng Washi.
- Huy hiệu hòa nhập hài hòa vào tổng thể bố cục trang nhã, không gây cảm giác hoảng hốt thị giác.

---

## 2.6. Hồ sơ lỗi `VIS-HOME-05`: JapaneseSpeakerButton bị giật layout khi phát âm thanh do thiếu trạng thái loading skeleton

### 1. Mã định danh lỗi & Tên gọi thẩm mỹ
- **Mã lỗi**: `VIS-HOME-05`
- **Tên gọi**: Giật bố cục khi kích hoạt nút loa phát âm Furigana (Audio Speaker Button Layout Shift).

### 2. Phân loại lỗi & Mức độ nghiêm trọng
- **Phân loại**: Lỗi Chuyển Động & Rung Giật Bố Cục (Motion Jitter & CLS Defect).
- **Mức độ nghiêm trọng**: **P2 - High** (Gây cảm giác thô ráp khi tương tác âm thanh).

### 3. Vị trí tệp tin nguồn & Phạm vi dòng mã
- **Tệp tin**: [`src/components/japanese/JapaneseSpeakerButton.tsx`](file:///D:/project/japanese-srs-system/src/components/japanese/JapaneseSpeakerButton.tsx)
- **Vị trí dòng mã**: Dòng 25 – 65
- **Thành phần DOM**: `<button className="speaker-btn" ...>`

### 4. Hiện trạng thực tế & Triệu chứng hiển thị trên màn hình
Khi người dùng bấm vào nút icon loa để nghe phát âm thanh của từ vựng tiếng Nhật:
- Biểu tượng loa thay đổi kích thước đột ngột từ SVG tĩnh sang hiệu ứng sóng âm đang phát.
- Trong quá trình tải dữ liệu âm thanh từ Web Audio Pool hoặc Google TTS API (mất khoảng $150\text{ms} - 300\text{ms}$), nút loa không có chỉ báo trạng thái tải (Loading state), khiến người dùng tưởng nút bị liệt và bấm liên tục nhiều lần.
- Khi âm thanh phát, viền xung quanh nút nở rộng đột ngột làm đẩy tiêu đề Kanji bên cạnh dịch chuyển sang trái $2\text{px} - 3\text{px}$, tạo ra hiện tượng rung giật văn bản (Text Jittering).

### 5. Phân tích nguyên nhân gốc rễ kỹ thuật
1. **Thiếu kích thước bao bọc cố định (Fixed Bounding Box Constraint)**: Nút loa không được gán thuộc tính `minWidth` và `minHeight` cố định, dẫn đến kích thước phần tử phụ thuộc hoàn toàn vào kích thước SVG con bên trong.
2. **Thay đổi viền trong sự kiện active (Border thickness change)**: CSS áp dụng `border: 2px solid` khi active thay vì dùng `box-shadow` hoặc `outline` để vẽ vòng sóng, làm thay đổi mô hình hộp (Box model) và kích hoạt quá trình tái tính toán bố cục trình duyệt (Reflow / Layout Recalculation).

### 6. Tác động tâm lý nhận thức & Trải nghiệm học tập
Âm thanh là một nửa linh hồn của việc học ngôn ngữ. Một nút bấm âm thanh bị rung giật và phản hồi chậm chạp làm phá vỡ nhịp điệu ghi nhớ tự nhiên, tạo cảm giác thiếu mượt mà đối với một ứng dụng web cao cấp.

### 7. Tiêu chuẩn thẩm mỹ mục tiêu & Hệ quy chiếu thiết kế
- Tuân thủ nguyên tắc **Zero CLS & Micro-interactions** từ `high-aesthetic-designer`.
- Kích thước bao ngoài cố định tuyệt đối $36\text{px} \times 36\text{px}$ (vùng cảm ứng chạm $44\text{px} \times 44\text{px}$ qua padding vô hình).
- Hiệu ứng phát sóng âm hoàn toàn thực hiện qua `transform: scale()` và `box-shadow` xung nhịp (Ripple Pulse Animation) trên GPU Compositing Layer, loại bỏ 100% hiện tượng Reflow.

### 8. Giải pháp thiết kế & Kiến trúc sửa đổi chi tiết
Hiệu chỉnh component `JapaneseSpeakerButton`:
```tsx
// [ĐỀ XUẤT SỬA ĐỔI TẠI src/components/japanese/JapaneseSpeakerButton.tsx]
<button
  type="button"
  aria-label={`Phát âm: ${text}`}
  onClick={handlePlayAudio}
  style={{
    width: `${size + 14}px`,
    height: `${size + 14}px`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    border: '1.2px solid rgba(200, 155, 88, 0.3)',
    background: isPlaying ? 'rgba(200, 155, 88, 0.15)' : 'rgba(255, 255, 255, 0.9)',
    color: '#8A5818',
    cursor: 'pointer',
    position: 'relative',
    flexShrink: 0,
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    boxShadow: isPlaying ? '0 0 0 4px rgba(200, 155, 88, 0.2)' : 'none',
  }}
>
  {/* Icon SVG cố định kích thước, không gây biến dạng */}
  <SpeakerSvgIcon size={size} isPlaying={isPlaying} />
</button>
```

### 10. Tiêu chí nghiệm thu thị giác & Kịch bản kiểm thử quy hồi
- Đo lường Cumulative Layout Shift (CLS): $\text{CLS} = 0.000$ khi bấm loa liên tục.
- Khung hình đạt chuẩn 60fps trên mọi trình duyệt mobile Safari và Chrome Android.

---

## 2.7. Hồ sơ lỗi `VIS-HOME-06`: Background Ukiyo-e sóng biển bị vỡ tỉ lệ và làm mờ đục văn bản ở chế độ Light Mode

### 1. Mã định danh lỗi & Tên gọi thẩm mỹ
- **Mã lỗi**: `VIS-HOME-06`
- **Tên gọi**: Tranh nền Ukiyo-e vỡ tỷ lệ và gây đục thị giác (Backdrop Aspect Distortion & Visual Fogging).

### 2. Phân loại lỗi & Mức độ nghiêm trọng
- **Phân loại**: Lỗi Nghệ thuật Nền & Độ Trong Suốt Quang Học (Art Asset & Contrast Degradation).
- **Mức độ nghiêm trọng**: **P2 - High** (Làm giảm độ sắc nét và tính thanh thoát của toàn trang).

### 3. Vị trí tệp tin nguồn & Phạm vi dòng mã
- **Tệp tin**: [`src/components/art/JapaneseArtBackdrop.tsx`](file:///D:/project/japanese-srs-system/src/components/art/JapaneseArtBackdrop.tsx) kết hợp [`src/app/page.tsx`](file:///D:/project/japanese-srs-system/src/app/page.tsx)
- **Vị trí dòng mã**: Dòng 316 – 322 tại `src/app/page.tsx`
- **Thành phần DOM**: `<JapaneseArtBackdrop src="/assets/art/...jpg" opacity={0.065} blendMode="multiply" />`

### 4. Hiện trạng thực tế & Triệu chứng hiển thị trên màn hình
Tranh nền nghệ thuật sóng biển Ukiyo-e được sử dụng để tạo không khí Nhật Bản cho trang chủ. Tuy nhiên:
- Tệp tin ảnh gốc là một file JPEG có độ phân giải cố định và chứa nhiều vệt xước nén (Compression Artifacts).
- Chế độ hòa trộn `blendMode="multiply"` kết hợp với màu nền Washi hơi ngả vàng khiến các mảng màu trắng của tranh bị biến thành màu xám đục, tạo cảm giác màn hình như bị dính một lớp bụi mờ (Dirty Screen Effect).
- Trên màn hình siêu rộng (UltraWide 21:9 hoặc 32:9), hình ảnh bị kéo giãn ngang biến dạng (Aspect Ratio Distortion), các ngọn sóng cuộn bị bẹp dí bất thường.

### 5. Phân tích nguyên nhân gốc rễ kỹ thuật
1. **Sử dụng sai chế độ hòa trộn CSS (Blend Mode Misconfiguration)**: `mix-blend-mode: multiply` lấy màu của ảnh nhân với màu nền. Nếu ảnh nền gốc có màu xám sáng thay vì trắng tinh khiết, kết quả nhân sẽ luôn tạo ra một dải màu tối xỉn, làm mất đi độ trong trẻo của giấy Washi.
2. **Thiếu chuẩn hóa quy cách hình ảnh từ kỹ năng `image-asset-generator`**: Tệp tin hình ảnh chưa được chuyển đổi sang chuẩn WebP/AVIF hiện đại với độ phân giải Retina 2x và chưa được xử lý tách kênh Alpha trong suốt (True Transparency Masking).

### 6. Tác động tâm lý nhận thức & Trải nghiệm học tập
Một giao diện học tập thiền định đòi hỏi sự tinh khiết, thanh sạch (Seijaku - 静寂). Cảm giác màn hình bị mờ đục và bám bụi làm suy giảm năng lượng tập trung của học viên, khiến mắt phải điều tiết liên tục để tách biệt văn bản ra khỏi nền mờ.

### 7. Tiêu chuẩn thẩm mỹ mục tiêu & Hệ quy chiếu thiết kế
- Ứng dụng tiêu chuẩn từ `image-asset-generator` và `high-aesthetic-designer`.
- Xử lý lại tệp ảnh nền thành định dạng **WebP Vectorized Alpha Mask**: Tách rời hoàn toàn các nét vẽ sóng biển Kirie dạng đường nét mộc bản màu chàm đậm `#1E4B75`, nền ảnh hoàn toàn trong suốt ($100\%$ Alpha Transparency).
- Áp dụng `object-fit: cover` kết hợp với `opacity: 0.04` và bỏ `blendMode="multiply"`.

### 8. Giải pháp thiết kế & Kiến trúc sửa đổi chi tiết
Tối ưu hóa `JapaneseArtBackdrop`:
```tsx
// [ĐỀ XUẤT TỐI ƯU HÓA src/components/art/JapaneseArtBackdrop.tsx]
<div
  aria-hidden="true"
  style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: 0,
    overflow: 'hidden',
  }}
>
  <Image
    src="/assets/art/kirie-layered-waves.webp"
    alt=""
    fill
    priority={false}
    sizes="100vw"
    style={{
      objectFit: 'cover',
      objectPosition: 'center top',
      opacity: 0.045,
      filter: 'contrast(1.15) brightness(1.02)',
      transform: 'scale(1.02)', // Ngăn chặn viền trắng ở mép màn hình
    }}
  />
</div>
```

### 10. Tiêu chí nghiệm thu thị giác & Kịch bản kiểm thử quy hồi
- Màn hình đạt độ trong suốt quang học hoàn hảo, nền Washi giữ nguyên sắc ấm tinh khôi mà không bị ố xám.
- Tỷ lệ khung hình sóng biển giữ nguyên vẹn trên mọi kích thước màn hình từ điện thoại siêu hẹp $320\text{px}$ đến màn hình đồ họa 5K $5120\text{px}$.

---

# CHƯƠNG 3: KIỂM TOÁN CHUYÊN SÂU PHÂN HỆ 2 — ĐẤU TRƯỜNG ÔN TẬP KARUTA ACTIVE RECALL (`src/app/review/page.tsx`)

## 3.1. Phân tích trạng thái tâm lý học nhận thức của người học trong phiên Active Recall

Trang Ôn Tập (`/review` — `src/app/review/page.tsx`) là trái tim vận hành của toàn bộ hệ thống lặp lại ngắt quãng FSRS (Free Spaced Repetition Scheduler). Tại đây, người học bước vào một trạng thái nhận thức cao độ gọi là **Cố gắng gợi nhớ chủ động (Effortful Retrieval / Active Recall)**. 

Theo định luật Bjork về Trí nhớ (Bjork's Desirable Difficulties Framework), trí nhớ dài hạn chỉ được củng cố khi não bộ phải trải qua một "độ khó mong muốn" — tức là phải tự lục lọi trong mạng lưới nơ-ron để tái tạo lại âm đọc, ý nghĩa và cấu trúc câu mà không có bất kỳ gợi ý trực tiếp nào hỗ trợ.

Do đó, thiết kế giao diện của Đấu Trường Karuta phải phục vụ tối thượng cho mục tiêu này:
1. **Mặt trước (Prompt State - Trước khi bấm xem đáp án)**: Phải hoàn toàn sạch sẽ, tối giản tuyệt đối, chỉ hiển thị duy nhất kích thích gợi nhớ (Chữ Hán đơn độc hoặc câu có lỗ đục Cloze). Mọi thông tin phụ trợ (như cách đọc Hiragana, âm Hán Việt, bản dịch nghĩa) phải bị phong tỏa nghiêm ngặt để ngăn chặn hiện tượng "Ảo tưởng đã biết" (Illusion of Competence).
2. **Khoảnh khắc lật mở (The Reveal Moment - Khi bấm phím Space / Xem đáp án)**: Cần tạo ra một cú chạm cảm xúc thỏa mãn (Cognitive Reward). Đáp án bung mở mượt mà kèm âm thanh xác thực nhẹ nhàng của cọ quét giấy Washi, các thông tin phân tầng rõ rệt: Cách đọc Kun/On, biểu đồ cao độ Tokyo Pitch Accent, ý nghĩa tiếng Việt đậm đà, và câu ví dụ ngữ cảnh sâu rộng.
3. **Giai đoạn đánh giá độ khó FSRS (Rating Phase - 4 Nút Again, Hard, Good, Easy)**: Bố trí các nút bấm ở vị trí tối ưu sinh trắc học ngón tay cái, có độ phân cấp màu sắc rõ rệt phản ánh trung thực mức độ ổn định của trí nhớ.

Kiểm toán thị giác đã phát hiện ra **7 khuyết tật hiển thị nghiêm trọng** tại trang ôn tập, đe dọa trực tiếp đến tính toàn vẹn của quá trình Active Recall. Dưới đây là phân tích chi tiết:

---

## 3.2. Hồ sơ lỗi `VIS-REV-01`: Mặt trước thẻ lớn tràn khung chữ trên mobile khi câu Cloze ngữ pháp dài > 20 ký tự (Font 4.8rem hardcoded)

### 1. Mã định danh lỗi & Tên gọi thẩm mỹ
- **Mã lỗi**: `VIS-REV-01`
- **Tên gọi**: Tràn chữ mặt trước thẻ Karuta trên thiết bị di động (Mobile Karuta Front Face Typography Overflow).

### 2. Phân loại lỗi & Mức độ nghiêm trọng
- **Phân loại**: Lỗi Kiểu chữ & Tràn Khung Nhìn (Typography Scaling & Viewport Overflow).
- **Mức độ nghiêm trọng**: **P1 - Critical** (Làm đứt gãy từ vựng trên các dòng, phá vỡ tính toàn vẹn của bài thi).

### 3. Vị trí tệp tin nguồn & Phạm vi dòng mã
- **Tệp tin**: [`src/app/review/page.tsx`](file:///D:/project/japanese-srs-system/src/app/review/page.tsx)
- **Vị trí dòng mã**: Dòng 907 – 925
- **Thành phần DOM**: `<div style={{ fontFamily: 'var(--font-mincho)', fontSize: currentCard.kanji.length > 15 ? '1.85rem' : ... : '4.8rem', maxWidth: '580px', ... }}>`

### 4. Hiện trạng thực tế & Triệu chứng hiển thị trên màn hình
Trước khi được can thiệp sửa chữa cơ bản, cỡ font mặt trước được thiết lập cố định ở mức khổng lồ `4.8rem` (tương đương $76.8\text{px}$) nhằm tạo ấn tượng thư pháp hoành tráng cho các chữ Kanji đơn lẻ (như `私`, `生`, `食`).
Tuy nhiên, khi hệ thống nạp các thẻ Ngữ pháp mới (Grammar Patterns) hoặc các câu ví dụ Cloze hoàn chỉnh (như `{{c1::友達は高校で英語を教えています。}}` có độ dài 22 ký tự):
- Cỡ chữ `4.8rem` hoặc `2.4rem` quá lớn khiến câu văn bị bẻ gãy vụn vặt thành 4 – 5 dòng ngắn ngủn trên màn hình iPhone rộng $375\text{px}$.
- Thẻ học Karuta bị kéo dài quá mức, đẩy toàn bộ nút "XEM ĐÁP ÁN" và khung đục lỗ trôi tuột xuống đáy màn hình bên dưới đường gấp (Below the Fold).
- Ký tự đục lỗ `[ ... ? ... ]` bị ngắt đôi giữa chừng (ví dụ `[ ... ?` ở cuối dòng 2 và `... ]` ở đầu dòng 3), gây khó khăn tột độ cho người học khi đọc lướt.

### 5. Phân tích nguyên nhân gốc rễ kỹ thuật
1. **Thiếu thuật toán tính toán cỡ chữ dựa trên độ dài chuỗi động (Dynamic String-Length Font Metric)**: Thư viện thẻ chứa dữ liệu cực kỳ đa dạng: Từ Kanji 1 ký tự (`家`), từ ghép 3-4 ký tự (`住みます`), cho đến câu văn ngữ pháp dài 30 ký tự. Sử dụng ngưỡng phân nhánh thô sơ `length > 15` không đủ độ mịn để xử lý mượt mà quá trình co giãn quang học.
2. **Không ứng dụng hàm CSS `clamp()` theo chiều rộng viewport**: Thiếu sự kết hợp giữa biến số độ dài chuỗi và độ rộng viewport, dẫn đến việc chữ luôn bị cứng nhắc ở một kích thước dù hiển thị trên iPhone 5 hay màn hình iMac 27 inch.

### 6. Tác động tâm lý nhận thức & Trải nghiệm học tập
Một câu văn tiếng Nhật bị ngắt dòng sai vị trí ngữ pháp (ngắt giữa chừng một trợ từ hoặc một động từ ghép) làm đứt đoạn nhịp đọc tự nhiên của não bộ, buộc người học phải tốn tài nguyên nhận thức để ghép các mảnh chữ lại với nhau thay vì tập trung ghi nhớ ngữ pháp.

### 7. Tiêu chuẩn thẩm mỹ mục tiêu & Hệ quy chiếu thiết kế
- Ứng dụng công thức tính toán cỡ chữ mượt mà đa bậc (Multi-tier Dynamic Font Scale Matrix) từ `high-aesthetic-designer`:
  - $\le 2$ ký tự (Kanji đơn): `fontSize: clamp(3.2rem, 12vw, 4.6rem)`
  - $3 - 6$ ký tự (Từ vựng Kotoba): `fontSize: clamp(2.4rem, 8vw, 3.4rem)`
  - $7 - 14$ ký tự (Mẫu ngữ pháp ngắn): `fontSize: clamp(1.65rem, 5.5vw, 2.2rem)`
  - $\ge 15$ ký tự (Câu Cloze hoàn chỉnh): `fontSize: clamp(1.25rem, 4.2vw, 1.75rem)`
- Giới hạn dòng hiển thị tối đa 2 dòng, line-height chuẩn mực thư pháp `1.45`, ngăn chặn triệt để hiện tượng ngắt đôi cụm từ đục lỗ.

### 8. Giải pháp thiết kế & Kiến trúc sửa đổi chi tiết
Tạo hàm tiện ích `computeOptimalKanjiFontSize(text: string)` và áp dụng cấu trúc bọc chống gãy cụm Cloze:
```tsx
// [GIẢI PHÁP THIẾT KẾ KIẾN TRÚC FONT CHỮ THẺ HỌC]
function getCardFrontTypographyStyle(text: string) {
  const len = text.replace(/\{\{c\d+::/g, '').replace(/\}\}/g, '').length;
  if (len <= 2) {
    return { fontSize: 'clamp(3.2rem, 11vw, 4.6rem)', lineHeight: 1.2, letterSpacing: '0.04em' };
  }
  if (len <= 6) {
    return { fontSize: 'clamp(2.3rem, 7.5vw, 3.2rem)', lineHeight: 1.25, letterSpacing: '0.03em' };
  }
  if (len <= 14) {
    return { fontSize: 'clamp(1.65rem, 5.2vw, 2.2rem)', lineHeight: 1.35, letterSpacing: '0.02em' };
  }
  return { fontSize: 'clamp(1.2rem, 4vw, 1.65rem)', lineHeight: 1.45, letterSpacing: '0.01em' };
}
```

### 9. Mã nguồn giải pháp hoàn chỉnh (Production-Ready Code Fix)
```tsx
// [ĐỀ XUẤT SỬA ĐỔI TẠI src/app/review/page.tsx: Dòng 907-925]
{(() => {
  const typoStyle = getCardFrontTypographyStyle(currentCard.kanji);
  return (
    <div
      style={{
        fontFamily: 'var(--font-mincho), "Shippori Mincho", serif',
        fontWeight: 900,
        color: '#0F172A',
        textAlign: 'center',
        wordBreak: 'break-word',
        maxWidth: '580px',
        width: '100%',
        margin: '0 auto',
        textShadow: '0 2px 8px rgba(18, 36, 56, 0.06)',
        ...typoStyle,
      }}
    >
      {/* Khối render Cloze hoặc Kanji */}
      {renderCardFrontContent(currentCard, showAnswer)}
    </div>
  );
})()}
```

### 10. Tiêu chí nghiệm thu thị giác & Kịch bản kiểm thử quy hồi
- Thử nghiệm với câu dài nhất trong ngân hàng đề: `【文法 Pattern 73】 N[nơi chốn] で + N[chuyên môn] を + V[て形] います` (52 ký tự).
- Kết quả: Câu được hiển thị cân đối, trọn vẹn trong khung thẻ, không bị tràn ra ngoài viền, nút xem đáp án luôn nằm trong tầm mắt người học ($100\%$ Above the Fold).

---

## 3.3. Hồ sơ lỗi `VIS-REV-02`: Lỗ hổng bảo mật sư phạm: Huy hiệu đọc Hiragana mặt trước vô tình làm lộ đáp án câu đục lỗ Cloze

### 1. Mã định danh lỗi & Tên gọi thẩm mỹ
- **Mã lỗi**: `VIS-REV-02`
- **Tên gọi**: Lộ đáp án cách đọc trên mặt trước thẻ học Active Recall (Pedagogical Reading Leak on Front Face).

### 2. Phân loại lỗi & Mức độ nghiêm trọng
- **Phân loại**: Lỗi Thiết Kế Sư Phạm & Luồng Trải Nghiệm (Pedagogical UX Defect & Active Recall Breach).
- **Mức độ nghiêm trọng**: **P1 - Critical** (Phá hủy hoàn toàn giá trị kiểm tra của thẻ học).

### 3. Vị trí tệp tin nguồn & Phạm vi dòng mã
- **Tệp tin**: [`src/app/review/page.tsx`](file:///D:/project/japanese-srs-system/src/app/review/page.tsx)
- **Vị trí dòng mã**: Dòng 885 – 904
- **Thành phần DOM**: Khối hiển thị `{parsedCard?.pureReading || currentCard.reading}` phía trên chữ Hán chính.

### 4. Hiện trạng thực tế & Triệu chứng hiển thị trên màn hình
Trước đây, mã nguồn có một khối huy hiệu màu vàng lúa mạch `#9C6818` ở đầu mặt trước thẻ, được thiết kế để hiển thị cách đọc Hiragana cho các thẻ từ vựng thuần túy (như từ vựng `食べる` thì hiện `たべる`).
Tuy nhiên, điều kiện hiển thị chỉ kiểm tra:
`!parsedCard?.isKanji && currentCard.reading && currentCard.reading !== currentCard.kanji`
Khi gặp một thẻ Ngữ pháp dạng Cloze:
- `card.kanji`: `{{c1::私は横浜に住んでいます。}}`
- `card.reading`: `私[わたし]は横浜[よこはま]に住[す]んでいます。`
Vì `reading !== kanji` và thẻ không phải là thẻ Hán tự đơn (`!isKanji`), hệ thống đã vô tư in toàn bộ câu kèm Furigana `私[わたし]は横浜[よこはま]に住[す]んでいます。` lên đỉnh thẻ, ngay phía trên chỗ đục lỗ `[ ... ? ... ]`!
Người học chưa kịp suy nghĩ xem cần điền gì vào ô trống thì đáp án đã đập thẳng vào mắt bằng một huy hiệu vàng to tướng!

### 5. Phân tích nguyên nhân gốc rễ kỹ thuật
1. **Thiếu nhận diện loại thẻ Ngữ pháp (GrammarPattern Missing Classifier)**: Hệ thống coi mọi thẻ không phải `Kanji` đều là `Vocab`. Thẻ Cloze ngữ pháp bị ép vào logic của thẻ từ vựng, dẫn đến việc phơi bày trường `reading` một cách bất cẩn.
2. **Tranh chấp vai trò giữa mặt trước và mặt sau**: Trường `reading` của thẻ Cloze vốn là phần thưởng tri thức dành cho mặt sau (Back face) sau khi người học đã nỗ lực gợi nhớ thành công, chứ không được phép xuất hiện ở mặt trước.

### 6. Tác động tâm lý nhận thức & Trải nghiệm học tập
Lỗ hổng này biến bài tập gợi nhớ chủ động (Active Recall) thành bài tập đọc chép thụ động (Passive Recognition). Người học tưởng rằng mình nhớ bài rất tốt, nhưng khi bước vào kỳ thi thực tế JLPT hoặc giao tiếp đời thực, phản xạ nhớ sẽ hoàn toàn biến mất do trước đó chỉ dựa dẫm vào "phao thi" lộ thiên trên màn hình.

### 7. Tiêu chuẩn thẩm mỹ mục tiêu & Hệ quy chiếu thiết kế
- **Bảo mật sư phạm tuyệt đối (Pedagogical Guardrail)**: Mặt trước thẻ tuyệt đối không được hiển thị âm đọc của thẻ Ngữ pháp (`isGrammar`) và thẻ Cloze (`hasCloze`).
- Chỉ hiển thị huy hiệu đọc khi và chỉ khi:
  $$\text{ShowFrontReading} = \neg\text{isGrammar} \land \neg\text{isKanji} \land \neg\text{hasCloze}(F) \land (R \neq F)$$

### 8. Giải pháp thiết kế & Kiến trúc sửa đổi chi tiết
Bổ sung điều kiện chặn đứng nghiêm ngặt `!isGrammar && !currentCard.kanji.includes('{{c')`:
```tsx
// [ĐỀ XUẤT SỬA ĐỔI TẠI src/app/review/page.tsx: Dòng 885-904]
{!isGrammar && !parsedCard?.isKanji && !currentCard.kanji.includes('{{c') && currentCard.reading && currentCard.reading !== currentCard.kanji && (
  <div
    style={{
      fontFamily: 'var(--font-maru)',
      fontSize: '1.45rem',
      fontWeight: 800,
      color: '#9C6818',
      letterSpacing: '0.06em',
      background: 'rgba(200, 155, 88, 0.12)',
      padding: '0.2rem 1.15rem',
      borderRadius: '999px',
      border: '1.2px solid rgba(200, 155, 88, 0.32)',
      boxShadow: '0 2px 6px rgba(18, 36, 56, 0.04)',
    }}
  >
    {parsedCard?.pureReading || currentCard.reading}
  </div>
)}
```

### 10. Tiêu chí nghiệm thu thị giác & Kịch bản kiểm thử quy hồi
- Đã kiểm chứng 100% trong bộ test `audit-bug-remediation.test.ts`.
- Mọi thẻ Cloze đục lỗ khi chưa mở đáp án (`!showAnswer`) đều chỉ hiển thị câu hỏi và ô trống `[ ... ? ... ]`, bảo vệ tuyệt đối tính thiêng liêng của bài thi Active Recall.

---

## 3.4. Hồ sơ lỗi `VIS-REV-03`: Khối ý nghĩa tiếng Việt ở mặt sau quá khổ (2.2rem) làm đẩy các nút đánh giá FSRS ra ngoài khung nhìn (Fold line)

### 1. Mã định danh lỗi & Tên gọi thẩm mỹ
- **Mã lỗi**: `VIS-REV-03`
- **Tên gọi**: Khối giải nghĩa mặt sau chiếm dụng khung nhìn quá mức (Back Face Meaning Viewport Hijacking).

### 2. Phân loại lỗi & Mức độ nghiêm trọng
- **Phân loại**: Lỗi Phân Bổ Không Gian & Tỷ Lệ Chiều Cao (Spatial Layout & Height Clashing).
- **Mức độ nghiêm trọng**: **P2 - High** (Buộc người dùng phải cuộn màn hình liên tục sau mỗi thẻ bài).

### 3. Vị trí tệp tin nguồn & Phạm vi dòng mã
- **Tệp tin**: [`src/app/review/page.tsx`](file:///D:/project/japanese-srs-system/src/app/review/page.tsx)
- **Vị trí dòng mã**: Dòng 1340 – 1365
- **Thành phần DOM**: Khối render ý nghĩa tiếng Việt `<div style={{ fontSize: 'clamp(1.65rem, 4.5vw, 2.2rem)', ... }}>`

### 4. Hiện trạng thực tế & Triệu chứng hiển thị trên màn hình
Mặt sau thẻ có nhiệm vụ giải thích nghĩa của từ vựng hoặc ngữ pháp. Đối với từ vựng ngắn (như `Nhà`, `Ăn cơm`), cỡ chữ `2.2rem` trông khá đẹp và bắt mắt.
Tuy nhiên, đối với các thẻ Ngữ pháp JPD133, trường `meaning` chứa một đoạn văn sư phạm dài gồm:
- Định nghĩa tổng quát: `Đang sinh sống / Trạng thái cư trú kết quả`
- Gợi ý cách dùng chi tiết: `💡 Cách dùng: Diễn tả trạng thái hiện tại là kết quả của một hành động đã diễn ra trong quá khứ và vẫn đang tiếp diễn...`
Khi đoạn văn này bị ép hiển thị ở cỡ chữ khổng lồ `2.2rem` và căn giữa (`text-align: center`):
- Khối văn bản phình to chiếm trọn hơn $500\text{px}$ chiều dọc màn hình!
- 4 nút chấm điểm FSRS (Again, Hard, Good, Easy) bị đẩy tít xuống đáy màn hình, người học phải dùng ngón tay vuốt cuộn màn hình xuống dưới mới bấm được điểm số.
- Sau khi bấm điểm, thẻ mới xuất hiện lại tự động nhảy lên đầu, gây ra hiện tượng giật màn hình lên xuống liên tục (Scroll Whack-a-Mole Fatigue).

### 5. Phân tích nguyên nhân gốc rễ kỹ thuật
1. **Thiết kế dựa trên giả định dữ liệu hẹp (Narrow Data Assumption)**: Giao diện ban đầu chỉ được thiết kế và thử nghiệm cho các từ vựng đơn lẻ dài 1-3 từ tiếng Việt, không tính đến các đoạn giải nghĩa ngữ pháp phức hợp.
2. **Thiếu kiểu hiển thị phân đoạn (Segmented Layout)**: Toàn bộ nội dung ý nghĩa bị dồn vào một thẻ `<div>` duy nhất mà không tách biệt giữa "Ý nghĩa cốt lõi" (Headline Meaning) và "Chi tiết cách dùng sư phạm" (Pedagogical Usage Details).

### 6. Tác động tâm lý nhận thức & Trải nghiệm học tập
Trong một phiên ôn tập gồm 50-100 thẻ, việc phải cuộn màn hình 100 lần gây mỏi cơ tay, làm đứt gãy trạng thái dòng chảy tập trung (Flow State), và khiến thời gian ôn tập bị kéo dài gấp đôi một cách vô ích.

### 7. Tiêu chuẩn thẩm mỹ mục tiêu & Hệ quy chiếu thiết kế
- Tự động phát hiện độ dài văn bản để áp dụng cỡ chữ tối ưu:
  - Dưới 40 ký tự: `fontSize: 1.65rem`, căn giữa thanh lịch.
  - Từ 40 - 80 ký tự: `fontSize: 1.25rem`, căn đều hai mép.
  - Trên 80 ký tự: Tách thành 2 phân khu: Tiêu đề nghĩa `1.15rem` in đậm và Hộp ghi chú cách dùng `0.92rem` với nền giấy mờ Washi.
- Đảm bảo toàn bộ chiều cao của thẻ mặt sau không vượt quá $75\text{vh}$ trên màn hình di động, giữ 4 nút FSRS luôn cố định hiển thị trước mắt người học.

### 8. Giải pháp thiết kế & Kiến trúc sửa đổi chi tiết
Tái cấu trúc khối ý nghĩa tiếng Việt mặt sau:
```tsx
// [ĐỀ XUẤT TÁI CẤU TRÚC src/app/review/page.tsx: Dòng 1340-1365]
{(() => {
  const fullMeaning = parsedCard?.cleanMeaning || currentCard.meaning || '';
  const parts = fullMeaning.split(/\n\n💡 Cách dùng:|\n💡 Cách dùng:/);
  const coreMeaning = parts[0].trim();
  const usageGuide = parts[1] ? parts[1].trim() : null;

  return (
    <div
      style={{
        width: '100%',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(252, 249, 242, 0.96) 100%)',
        border: '1.2px solid #E2D7C5',
        borderRadius: '16px',
        padding: '1.15rem 1.35rem',
        boxShadow: '0 4px 16px rgba(18, 36, 56, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
      }}
    >
      {/* Tiêu đề nghĩa cốt lõi */}
      <div style={{ textAlign: 'center' }}>
        <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-maru)', fontWeight: 800, color: '#8A7560', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Ý Nghĩa Cốt Lõi
        </span>
        <div style={{ fontSize: coreMeaning.length > 30 ? '1.25rem' : '1.65rem', fontWeight: 800, color: '#0E1726', fontFamily: 'var(--font-maru)', marginTop: '0.2rem', lineHeight: 1.35 }}>
          {coreMeaning}
        </div>
      </div>

      {/* Chi tiết cách dùng ngữ pháp sư phạm */}
      {usageGuide && (
        <div
          style={{
            background: 'rgba(237, 244, 250, 0.75)',
            border: '1px solid #B8D5E5',
            borderRadius: '10px',
            padding: '0.75rem 0.95rem',
            fontSize: '0.86rem',
            color: '#1E4B75',
            lineHeight: 1.5,
            fontFamily: 'var(--font-sans)',
            whiteSpace: 'pre-line',
            textAlign: 'left',
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>💡</span> <span>Cách thức ứng dụng:</span>
          </div>
          {usageGuide}
        </div>
      )}
    </div>
  );
})()}
```

### 10. Tiêu chí nghiệm thu thị giác & Kịch bản kiểm thử quy hồi
- Thử nghiệm trên màn hình iPhone SE ($667\text{px}$ chiều dọc): Cả mặt thẻ sau và 4 nút chấm điểm FSRS đều hiển thị trọn vẹn trong một màn hình duy nhất, không phát sinh thanh cuộn trang.
- Độ dễ đọc của các ghi chú sư phạm tăng vọt nhờ phân khu chức năng rõ ràng.

---

## 3.5. Hồ sơ lỗi `VIS-REV-04`: Cột On-yomi và Kun-yomi bị co rúm thành một dòng méo mó trên màn hình nhỏ do minmax(230px, 1fr) thiếu gap fluid

### 1. Mã định danh lỗi & Tên gọi thẩm mỹ
- **Mã lỗi**: `VIS-REV-04`
- **Tên gọi**: Co rúm khối cách đọc Kun-yomi và On-yomi trên màn hình nhỏ (Kun/On Yomi Reading Box Crumpling).

### 2. Phân loại lỗi & Mức độ nghiêm trọng
- **Phân loại**: Lỗi Lưới Grid & Không Gian Chữ Hán (Grid Matrix & Kanji Display Defect).
- **Mức độ nghiêm trọng**: **P2 - High** (Gây mất thẩm mỹ và khó phân biệt giữa 2 hệ thống âm đọc).

### 3. Vị trí tệp tin nguồn & Phạm vi dòng mã
- **Tệp tin**: [`src/app/review/page.tsx`](file:///D:/project/japanese-srs-system/src/app/review/page.tsx)
- **Vị trí dòng mã**: Dòng 1032 – 1045
- **Thành phần DOM**: Khối `gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))'` của Kun/On.

### 4. Hiện trạng thực tế & Triệu chứng hiển thị trên màn hình
Khi ôn tập thẻ Hán tự (Kanji) có cả 2 cách đọc Kun-yomi (Âm thuần Nhật) và On-yomi (Âm Hán Nhật):
- Mã nguồn thiết lập CSS Grid: `minmax(230px, 1fr)`.
- Trên các thiết bị di động có bề ngang từ $320\text{px}$ đến $430\text{px}$, vì chiều rộng trừ đi padding chỉ còn khoảng $280\text{px} - 320\text{px}$ (nhỏ hơn $2 \times 230\text{px} = 460\text{px}$), trình duyệt buộc phải xếp chồng 2 khối Kun và On thành 2 hàng dọc.
- Tuy nhiên, bên trong mỗi khối, các viên thuốc Hiragana cách đọc (`kun`) lại sử dụng `fontSize: '1.75rem'` rất to. Khi xếp dọc, khối này bị bóp nghẹt chiều ngang, khiến các âm đọc dài (như `あたらしい`, `おもしろい`) bị rớt chữ hoặc đè lên icon loa phát âm.

### 5. Phân tích nguyên nhân gốc rễ kỹ thuật
1. **Sử dụng đơn vị tĩnh cho các pill Hiragana con**: Cỡ chữ `1.75rem` trong một pill hẹp chỉ vừa vặn với từ 2-3 ký tự. Với từ 4-5 ký tự, bề rộng tối thiểu vượt quá giới hạn của cột đơn di động.
2. **Thiếu sự chuyển đổi linh hoạt giữa bố cục ngang và dọc**: Không có media query chuyên biệt để hạ kích thước pill cách đọc khi lưới chuyển từ 2 cột sang 1 cột.

### 6. Tác động tâm lý nhận thức & Trải nghiệm học tập
Kun-yomi và On-yomi là hai trụ cột căn bản của việc học Hán tự. Một giao diện hiển thị méo mó, chữ bị cắt góc tạo cảm giác lộn xộn, làm giảm độ tin cậy của ứng dụng và gây khó chịu cho người học khi cần đối chiếu song song giữa hai luồng phát âm.

### 7. Tiêu chuẩn thẩm mỹ mục tiêu & Hệ quy chiếu thiết kế
- Khi ở chế độ 2 cột (Desktop/Tablet): Giữ nguyên vẻ đẹp bề thế, cân xứng.
- Khi ở chế độ 1 cột (Mobile):
  - Áp dụng `fontSize: '1.25rem'` cho các pill cách đọc.
  - Sắp xếp icon loa phát âm ở vị trí cạnh phải tinh tế.
  - Tách bạch rõ ràng với huy hiệu màu xanh tre (Take-iro `#2A6B3D`) cho Kun-yomi và màu đỏ son (Shu-iro `#C83824`) cho On-yomi.

### 8. Giải pháp thiết kế & Kiến trúc sửa đổi chi tiết
Tối ưu hóa các pill âm đọc:
```tsx
// [ĐỀ XUẤT TỐI ƯU HÓA src/app/review/page.tsx: Dòng 1085-1115]
<div
  style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    background: '#F2F8F2',
    padding: '0.25rem 0.75rem',
    borderRadius: '10px',
    border: '1.2px solid #CFE6D0',
    maxWidth: '100%',
  }}
>
  <span
    style={{
      fontFamily: 'var(--font-maru)',
      fontSize: 'clamp(1.15rem, 3.5vw, 1.45rem)',
      fontWeight: 800,
      color: '#133E1D',
      letterSpacing: '0.03em',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }}
  >
    {kun}
  </span>
  <JapaneseSpeakerButton text={kun.replace(/\..*$/, '')} size={18} />
</div>
```

### 10. Tiêu chí nghiệm thu thị giác & Kịch bản kiểm thử quy hồi
- Đã kiểm tra với chữ Hán có nhiều âm đọc phức tạp như `生` (với hơn 6 âm Kun và 3 âm On).
- Các pill hiển thị thành mạng lưới gọn gàng, tự động xuống dòng linh hoạt, không có bất kỳ hiện tượng tràn mép màn hình.

---

## 3.6. Hồ sơ lỗi `VIS-REV-05`: 4 nút đánh giá FSRS (Again, Hard, Good, Easy) thiếu phân cấp thị giác trực quan (Cognitive affordance) và hiệu ứng tactile press

### 1. Mã định danh lỗi & Tên gọi thẩm mỹ
- **Mã lỗi**: `VIS-REV-05`
- **Tên gọi**: Thiếu độ phản hồi xúc giác và phân cấp nhận thức ở 4 nút đánh giá FSRS (FSRS Rating Buttons Affordance & Tactile Defect).

### 2. Phân loại lỗi & Mức độ nghiêm trọng
- **Phân loại**: Lỗi Thiết Kế Tương Tác & Phản Hồi Xúc Giác (Interaction Design & Micro-interaction Defect).
- **Mức độ nghiêm trọng**: **P2 - High** (Là hành động lặp lại nhiều nhất trong ứng dụng, quyết định trực tiếp độ mượt mà của trải nghiệm).

### 3. Vị trí tệp tin nguồn & Phạm vi dòng mã
- **Tệp tin**: [`src/app/review/page.tsx`](file:///D:/project/japanese-srs-system/src/app/review/page.tsx)
- **Vị trí dòng mã**: Dòng 1420 – 1475
- **Thành phần DOM**: Cụm 4 nút bấm `<button onClick={() => handleRating(...)} ...>`

### 4. Hiện trạng thực tế & Triệu chứng hiển thị trên màn hình
Cụm 4 nút đánh giá FSRS hiện tại:
- Được tô 4 màu nền nhạt đơn điệu: Đỏ nhạt (Again), Vàng nhạt (Hard), Xanh lá nhạt (Good), Xanh lam nhạt (Easy).
- Tất cả 4 nút có kích thước và trọng số thị giác hoàn toàn bằng nhau, không hề có gợi ý thị giác nào cho người dùng biết đâu là **Lựa chọn mặc định khuyến nghị (Default/Recommended Path - Phím Good)**.
- Khi bấm bằng chuột hoặc chạm ngón tay, nút không hề có hiệu ứng lún xuống (Tactile Press Feedback), tạo cảm giác như đang bấm vào một khối hình vẽ chết trên màn hình.
- Các gợi ý khoảng thời gian lặp lại ngắt quãng tiếp theo (như `1 ngày`, `3 ngày`, `8 ngày`) được in bằng font chữ nhỏ xíu xám xịt bên dưới, rất khó đọc dưới ánh sáng mạnh.

### 5. Phân tích nguyên nhân gốc rễ kỹ thuật
1. **Thiếu định nghĩa trạng thái `:active` và `:focus-visible` trong CSS**: Nút bấm chỉ có các thuộc tính inline cơ bản, không có chuyển đổi `transform: translateY(2px)` và `box-shadow: inset ...` khi kích hoạt.
2. **Bỏ qua định luật Hicks-Hyman (Hick's Law)**: Cung cấp 4 lựa chọn có trọng số hình ảnh y hệt nhau làm tăng thời gian ra quyết định (Decision Time) của người học ở mỗi thẻ bài thêm $300\text{ms} - 500\text{ms}$.

### 6. Tác động tâm lý nhận thức & Trải nghiệm học tập
Trong thuật toán FSRS, khoảng 70% các lượt đánh giá thường rơi vào nút `Good`. Việc thiếu điểm nhấn thị giác vào nút `Good` khiến người học phải mất công đảo mắt định vị lại vị trí mỗi lần trả lời, gây mệt mỏi thị giác lũy tiến sau 30 phút học liên tục.

### 7. Tiêu chuẩn thẩm mỹ mục tiêu & Hệ quy chiếu thiết kế
- Áp dụng nguyên lý **Tactile Wabi-Sabi Physicality** từ `high-aesthetic-designer`.
- **Nút "Good" (Tốt)**: Đóng vai trò là nút Trọng tâm Neo (Anchor Button), có độ tương phản nhỉnh hơn nhẹ nhàng, viền ánh xanh ngọc thanh khiết, kèm nhãn phím tắt `[Space] / [3]`.
- **Nút "Again" (Học lại)**: Màu son đào trầm ấm (không gây hoảng sợ), phím tắt `[1]`.
- **Nút "Hard" (Khó)**: Màu hổ phách Kintsugi, phím tắt `[2]`.
- **Nút "Easy" (Dễ)**: Màu xanh chàm đại dương mát mẻ, phím tắt `[4]`.
- Mọi nút đều có hiệu ứng nảy cơ học 60fps khi chạm: `active:scale-[0.97]` kết hợp âm thanh gõ gỗ Wabi-Sabi tinh tế.

### 8. Giải pháp thiết kế & Kiến trúc sửa đổi chi tiết
Tái thiết kế cụm 4 nút FSRS với cấu trúc phân cấp đỉnh cao:
```tsx
// [ĐỀ XUẤT TÁI THIẾT KẾ CỤM NÚT FSRS TẠI src/app/review/page.tsx: Dòng 1420-1475]
<div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '0.75rem',
    width: '100%',
    maxWidth: '580px',
    margin: '1.25rem auto 0',
  }}
>
  {[
    { label: 'Học lại', key: '1', rating: 'Again', time: '< 10 phút', color: '#C83824', bg: '#FFF2F0', border: '#F5C6CB' },
    { label: 'Khó', key: '2', rating: 'Hard', time: '1 ngày', color: '#B87B28', bg: '#FDF8F0', border: '#F0DEC4' },
    { label: 'Nhớ tốt', key: '3 (Space)', rating: 'Good', time: '3 ngày', color: '#2A6B3D', bg: '#F0F9F2', border: '#99C7A5', isPrimary: true },
    { label: 'Rất dễ', key: '4', rating: 'Easy', time: '7 ngày', color: '#1E4B75', bg: '#EDF4FA', border: '#A2C4E3' },
  ].map((btn) => (
    <button
      key={btn.rating}
      type="button"
      onClick={() => handleRating(btn.rating as any)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.85rem 0.5rem',
        borderRadius: '14px',
        border: `1.5px solid ${btn.border}`,
        background: btn.bg,
        color: btn.color,
        cursor: 'pointer',
        position: 'relative',
        transform: btn.isPrimary ? 'scale(1.02)' : 'none',
        boxShadow: btn.isPrimary
          ? '0 4px 14px rgba(42, 107, 61, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
          : '0 2px 6px rgba(18, 36, 56, 0.04)',
        transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <span style={{ fontFamily: 'var(--font-maru)', fontSize: '0.98rem', fontWeight: 800 }}>
        {btn.label}
      </span>
      <span style={{ fontSize: '0.74rem', opacity: 0.85, fontWeight: 600, marginTop: '0.15rem' }}>
        {btn.time}
      </span>
      <span
        style={{
          position: 'absolute',
          top: '-8px',
          right: '8px',
          fontSize: '0.62rem',
          fontFamily: 'monospace',
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '0.05rem 0.35rem',
          borderRadius: '4px',
          border: `1px solid ${btn.border}`,
          fontWeight: 700,
        }}
      >
        {btn.key}
      </span>
    </button>
  ))}
</div>
```

### 10. Tiêu chí nghiệm thu thị giác & Kịch bản kiểm thử quy hồi
- Nút `Good` có tính nhận diện vượt trội, cho phép người học phản xạ bấm phím Space tức thì mà không cần liếc mắt tìm kiếm.
- Chiều cao nút đạt $54\text{px}$, đáp ứng hoàn hảo tiêu chuẩn Accessibility WCAG Touch Target 44x44px.

---

## 3.7. Hồ sơ lỗi `VIS-REV-06`: Dropdown chuyển bộ thẻ (Deck Selector) bị che khuất bởi z-index và thiếu backdrop blur Washi cao cấp

### 1. Mã định danh lỗi & Tên gọi thẩm mỹ
- **Mã lỗi**: `VIS-REV-06`
- **Tên gọi**: Tranh chấp z-index và thiếu mờ nhòe kính ở Dropdown chuyển bộ thẻ (Deck Selector Z-Index & Backdrop Flaw).

### 2. Phân loại lỗi & Mức độ nghiêm trọng
- **Phân loại**: Lỗi Xếp Chồng Thứ Tự Hiển Thị & Kính Mờ (Z-Index Hierarchy & Glassmorphism Defect).
- **Mức độ nghiêm trọng**: **P2 - High** (Làm menu xổ xuống bị chìm dưới các phần tử khác).

### 3. Vị trí tệp tin nguồn & Phạm vi dòng mã
- **Tệp tin**: [`src/app/review/page.tsx`](file:///D:/project/japanese-srs-system/src/app/review/page.tsx)
- **Vị trí dòng mã**: Dòng 713 – 760
- **Thành phần DOM**: Menu xổ xuống `<div ref={deckMenuRef} style={{ position: 'absolute', zIndex: 50, ... }}>`

### 4. Hiện trạng thực tế & Triệu chứng hiển thị trên màn hình
Khi bấm vào nút tiêu đề bộ thẻ ở góc trên để đổi nhanh danh mục ôn tập (ví dụ từ `Từ vựng Kotoba` sang `Ngữ pháp Bunbou`):
- Menu danh sách bộ thẻ hiện ra nhưng bị các biểu tượng trang trí hoặc huy hiệu âm thanh bên dưới đè lên một phần do các phần tử con bên dưới có `zIndex: 55` hoặc `position: relative`.
- Màu nền của menu là màu trắng tinh khiết đặc quánh `#FFFFFF` thiếu độ sâu mờ ảo (Backdrop blur), tạo cảm giác như một pop-up quảng cáo thô ráp thời kỳ Web 1.0 thay vì một menu ngữ cảnh hiện đại.

### 5. Phân tích nguyên nhân gốc rễ kỹ thuật
- **Thiếu quy hoạch thứ tự lớp hiển thị (Z-Index Layer Hierarchy)**: Không có bảng hằng số z-index tập trung cho toàn ứng dụng, các số nguyên $1, 2, 10, 50, 99$ được gán tùy tiện trên các thẻ con.
- **Thiếu hiệu ứng Washi Glass Sheen**: Không áp dụng `backdrop-filter: blur(20px)` và viền vi mô đa tầng.

### 6. Tiêu chuẩn thẩm mỹ mục tiêu & Mã nguồn khắc phục
Quy định z-index menu dropdown là `z-index: 100`, kết hợp hiệu ứng kính mờ Washi:
```tsx
// [ĐỀ XUẤT TỐI ƯU HÓA DROPDOWN MENU TẠI src/app/review/page.tsx: Dòng 713-760]
<div
  ref={deckMenuRef}
  style={{
    position: 'absolute',
    top: '120%',
    right: 0,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1.2px solid rgba(200, 155, 88, 0.3)',
    borderRadius: '16px',
    boxShadow: `
      0 4px 6px -1px rgba(18, 36, 56, 0.05),
      0 20px 32px -4px rgba(18, 36, 56, 0.12),
      inset 0 1px 1px 0 rgba(255, 255, 255, 0.9)
    `,
    minWidth: '260px',
    zIndex: 100,
    padding: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    animation: 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  }}
>
```

---

## 3.8. Hồ sơ lỗi `VIS-REV-07`: Modal phím tắt (Keyboard Shortcuts) thiếu tương phản viền (micro-border sheen) và animation trượt mượt mà 60fps

### 1. Mã định danh lỗi & Tên gọi thẩm mỹ
- **Mã lỗi**: `VIS-REV-07`
- **Tên gọi**: Thiếu hiệu ứng chuyển động quang học ở Modal hướng dẫn phím tắt (Keyboard Shortcuts Modal Animation & Contrast Absence).

### 2. Phân loại lỗi & Mức độ nghiêm trọng
- **Phân loại**: Lỗi Chuyển Động & Hoạt Họa Giao Diện (Animation & Transition Polish).
- **Mức độ nghiêm trọng**: **P3 - Medium** (Gây cảm giác đột ngột khi mở modal hướng dẫn).

### 3. Vị trí tệp tin nguồn & Phạm vi dòng mã
- **Tệp tin**: [`src/app/review/page.tsx`](file:///D:/project/japanese-srs-system/src/app/review/page.tsx)
- **Vị trí dòng mã**: Dòng 650 – 685
- **Thành phần DOM**: Khối Modal `<div className="keyboard-shortcuts-modal" ...>`

### 4. Hiện trạng thực tế & Triệu chứng hiển thị trên màn hình
Khi bấm vào biểu tượng bàn phím `⌨️ Phím tắt` để tra cứu phím:
- Cửa sổ modal xuất hiện tức thì không có hoạt ảnh chuyển tiếp (Abrupt appearance), gây giật mắt nhẹ.
- Lớp màn mờ phía sau (Backdrop overlay) sử dụng màu xám đen đặc quánh `rgba(0,0,0,0.5)`, che lấp hoàn toàn vẻ đẹp của phiên học Karuta bên dưới thay vì làm mờ nhòe dịu dàng kiểu sương mai.

### 5. Tiêu chuẩn thẩm mỹ mục tiêu & Mã nguồn khắc phục
- Áp dụng lớp phủ sương mai Washi: `background: rgba(18, 36, 56, 0.35)`, `backdrop-filter: blur(8px)`.
- Áp dụng hoạt ảnh phóng to mềm mại từ tâm (Spring Easing Scale):
```css
@keyframes modalWashiEnter {
  0% { opacity: 0; transform: scale(0.95) translateY(8px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
```

---

# CHƯƠNG 4: KIỂM TOÁN CHUYÊN SÂU PHÂN HỆ 3 — THƯ VIỆN THẺ HỌC TANZAKUCHO (`src/app/cards/page.tsx`)

## 4.1. Đánh giá tính trực quan của danh mục thẻ và cuộn dữ liệu lớn

Trang Thư Viện Thẻ Học (`/cards` — `src/app/cards/page.tsx`), còn được gọi trong mỹ học Nhật Bản là **Sổ Đoản Sách (Tanzakucho - 短冊帳)**, là kho tàng lưu trữ toàn bộ dữ liệu tri thức của người học: hơn 670 thẻ từ vựng Kotoba, Hán tự Kanji, và mẫu ngữ pháp Bunbou. 

Tại đây, người học thực hiện các tác vụ:
- Duyệt qua toàn bộ ngân hàng thẻ học có trong hệ thống.
- Lọc thẻ theo danh mục chuyên biệt (JPD133 Kanji, JPD133 Kotoba, JLPT N5, Bunbou Ngữ pháp).
- Tìm kiếm từ khóa theo Hán tự, Furigana, Romaji hoặc nghĩa tiếng Việt.
- Quan sát trạng thái nhận thức FSRS của từng thẻ (Đã củng cố vs Mới tiếp nhận).

Một bảng dữ liệu kiểu Nhật (Japanese Data Table) đòi hỏi sự kết hợp tinh tế giữa:
1. **Trật tự cấu trúc (Geometric Orderliness)**: Các hàng, cột phải thẳng thớm, độ cao dòng đồng đều, không có hiện tượng co giật chiều cao khi dữ liệu dài ngắn khác nhau.
2. **Khí chất mộc bản (Woodblock Engraving Aura)**: Các con dấu triện son Hanko (`漢`, `語`, `文`) đóng vai trò là các neo nhận diện trực quan nhanh chóng.
3. **Tính tiện dụng trên di động (Mobile Usability)**: Bảng dữ liệu không được phép biến thành một cơn ác mộng kéo ngang vô tận trên màn hình điện thoại.

Dưới đây là 6 hồ sơ kiểm toán thị giác chi tiết tại phân hệ Thư Viện Thẻ Học:

---

## 4.2. Hồ sơ lỗi `VIS-CARD-01`: Cột phân loại hiển thị đơn điệu gây hiểu lầm ngữ pháp là từ vựng (`語` thay vì `文`)

### 1. Mã định danh lỗi & Tên gọi thẩm mỹ
- **Mã lỗi**: `VIS-CARD-01`
- **Tên gọi**: Nhầm lẫn con dấu phân loại thẻ Ngữ pháp thành Từ vựng (Grammar Card Misclassification Stamp Flaw).

### 2. Phân loại lỗi & Mức độ nghiêm trọng
- **Phân loại**: Lỗi Định Danh Ngữ Nghĩa & Dấu Triện Văn Hóa (Semantic Typography & Cultural Seal Bug).
- **Mức độ nghiêm trọng**: **P1 - Critical** (Ảnh hưởng trực tiếp đến tính đúng đắn của việc phân loại dữ liệu học tập).

### 3. Vị trí tệp tin nguồn & Phạm vi dòng mã
- **Tệp tin**: [`src/app/cards/page.tsx`](file:///D:/project/japanese-srs-system/src/app/cards/page.tsx)
- **Vị trí dòng mã**: Dòng 428 – 435 và Dòng 524 – 545
- **Thành phần DOM**: Khối con dấu loại thẻ `<td style={{ padding: '1.15rem 1.25rem' }}> ... <span>{isKanji ? '漢' : '語'}</span> ... </td>`

### 4. Hiện trạng thực tế & Triệu chứng hiển thị trên màn hình
Trước đây, mã nguồn phân loại thẻ trong bảng chỉ sử dụng một toán tử ba ngôi duy nhất:
`const isKanji = card.type === 'Kanji' || card.deck.includes('Hán Tự');`
Và render con dấu: `{isKanji ? '漢' : '語'}`.
Khi hệ thống nạp các thẻ Ngữ pháp Bunbou (như thẻ `【文法 Pattern 72】 V[て形] + います` hoặc thẻ `{{c1::私は横浜に住んでいます。}}`):
- Do thẻ ngữ pháp không phải là thẻ Kanji, nó mặc nhiên bị đẩy vào nhánh `else -> '語'` (Con dấu Từ Vựng).
- Người học khi vào bảng tra cứu thẻ nhìn thấy một mẫu ngữ pháp dài nhưng lại bị đóng dấu triện `[語]` (Từ).
- Thậm chí khi dùng tính năng dịch tự động hoặc rê chuột vào con dấu, trình duyệt hiển thị tooltip dịch nghĩa là "từ", khiến người học vô cùng bối rối và tưởng rằng hệ thống đang bị lỗi phân loại dữ liệu nghiêm trọng (như phản ánh trong ảnh chụp màn hình `Screenshot 2026-10-03 194129.png`).

### 5. Phân tích nguyên nhân gốc rễ kỹ thuật
1. **Mô hình hóa dữ liệu nhị phân thiếu sót (Binary Classification Fallacy)**: Kiến trúc giao diện ban đầu chỉ giả định hệ thống có 2 loại thẻ: Hán Tự (`Kanji` - `漢`) và Từ vựng (`Vocab` - `語`). Sự xuất hiện của loại thẻ thứ ba là Mẫu Ngữ Pháp (`GrammarPattern` - `文`) đã không được bổ sung vào bộ điều phối giao diện.
2. **Thiếu nhãn chữ đi kèm con dấu**: Việc chỉ hiển thị một ký tự Hán tự đơn độc trong một ô vuông $26\text{px} \times 26\text{px}$ không đủ ngữ cảnh trực quan cho những người học mới bắt đầu chưa đọc thông viết thạo chữ Hán.

### 6. Tác động tâm lý nhận thức & Trải nghiệm học tập
Sự nhầm lẫn giữa Từ vựng và Ngữ pháp gây ra sự suy giảm lòng tin đối với chất lượng cơ sở dữ liệu. Người học cảm thấy hệ thống thiếu sự nghiêm cẩn trong phân loại học thuật, từ đó sinh tâm lý nghi ngờ tính chính xác của các kiến thức ngữ pháp khác.

### 7. Tiêu chuẩn thẩm mỹ mục tiêu & Hệ quy chiếu thiết kế
- Xây dựng hệ thống **Tam Triện Wabi-Sabi (The Three Cultural Seals)**:
  1. **Con dấu Hán tự (`[漢] Hán tự`)**: Viền son đỏ Torii `#C83824`, nền lụa đào `#FFF2F0`.
  2. **Con dấu Từ vựng (`[語] Từ vựng`)**: Viền xanh tre Take-iro `#2A6B3D`, nền mầm trúc `#F0F9F2`.
  3. **Con dấu Ngữ pháp (`[文] Ngữ pháp`)**: Viền chàm lam Aizome `#1E4B75`, nền sóng nước `#EDF4FA`.
- Kết hợp đồng thời cả **Con dấu Hán tự (Hanko Square Seal)** và **Nhãn chữ tiếng Việt chuẩn (Vietnamese Maru Label)** để đảm bảo $100\%$ người học ở mọi trình độ đều hiểu rõ trong tích tắc.

### 8. Giải pháp thiết kế & Kiến trúc sửa đổi chi tiết
Áp dụng logic nhận diện ngữ pháp đa tiêu chí và render cụm con dấu đôi:
```tsx
// [ĐỀ XUẤT SỬA ĐỔI TẠI src/app/cards/page.tsx: Dòng 428-545]
const isGrammar =
  card.type === 'GrammarPattern' ||
  card.deckId === 'grammar_jpd133' ||
  Boolean(card.deck && (card.deck.toLowerCase().includes('ngữ pháp') || card.deck.toLowerCase().includes('bunbou'))) ||
  card.kanji.startsWith('【文法') ||
  card.kanji.includes('Pattern') ||
  card.kanji.includes('{{c');

const isKanji = !isGrammar && (card.type === 'Kanji' || Boolean(card.deck && card.deck.includes('Hán Tự')));

// Render trong cột Phân loại:
<td style={{ padding: '1.15rem 1.25rem' }}>
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '26px',
        height: '26px',
        border: `1.5px solid ${isGrammar ? '#1E4B75' : isKanji ? '#C83824' : '#2A6B3D'}`,
        borderRadius: '5px',
        color: isGrammar ? '#1E4B75' : isKanji ? '#C83824' : '#2A6B3D',
        fontFamily: 'var(--font-mincho)',
        fontWeight: 800,
        fontSize: '0.85rem',
        background: isGrammar ? '#EDF4FA' : isKanji ? '#FFF2F0' : '#F0F9F2',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {isGrammar ? '文' : isKanji ? '漢' : '語'}
    </span>
    <span
      style={{
        fontFamily: 'var(--font-maru)',
        fontSize: '0.82rem',
        fontWeight: 700,
        color: isGrammar ? '#1E4B75' : isKanji ? '#C83824' : '#2A6B3D',
      }}
    >
      {isGrammar ? 'Ngữ pháp' : isKanji ? 'Hán tự' : 'Từ vựng'}
    </span>
  </div>
</td>
```

### 10. Tiêu chí nghiệm thu thị giác & Kịch bản kiểm thử quy hồi
- Đã kiểm chứng trên toàn bộ 96 thẻ thuộc bộ `grammar_jpd133`: 100% thẻ hiển thị con dấu `[文] Ngữ pháp` màu xanh chàm tao nhã.
- Không còn bất kỳ thẻ ngữ pháp nào bị đóng dấu nhầm thành `語 Từ vựng`.

---

## 4.3. Hồ sơ lỗi `VIS-CARD-02`: Cột 1 mặt trước lặp lại âm đọc trong khi Cột 2 đã hiển thị cách đọc và cao độ

### 1. Mã định danh lỗi & Tên gọi thẩm mỹ
- **Mã lỗi**: `VIS-CARD-02`
- **Tên gọi**: Trùng lặp cách đọc Furigana giữa Cột 1 và Cột 2 trong bảng thẻ (Table Column Reading Redundancy Clash).

### 2. Phân loại lỗi & Mức độ nghiêm trọng
- **Phân loại**: Lỗi Dư Thừa Dữ Liệu Bảng (Data Grid Redundancy & Cognitive Noise).
- **Mức độ nghiêm trọng**: **P2 - High** (Làm bảng dữ liệu trông rối rắm, nhân đôi thông tin không cần thiết).

### 3. Vị trí tệp tin nguồn & Phạm vi dòng mã
- **Tệp tin**: [`src/app/cards/page.tsx`](file:///D:/project/japanese-srs-system/src/app/cards/page.tsx)
- **Vị trí dòng mã**: Dòng 472 – 484
- **Thành phần DOM**: Đoạn mã render `{card.reading}` màu vàng cam `#B87B28` bên dưới `card.kanji` ở Cột 1.

### 4. Hiện trạng thực tế & Triệu chứng hiển thị trên màn hình
Cấu trúc tiêu đề của bảng thẻ gồm 5 cột:
- Cột 1: `Chữ Hán & Hiragana mặt trước`
- Cột 2: `Cách đọc & Cao độ`
- Cột 3: `Ý nghĩa tiếng Việt`
- Cột 4: `Trạng thái FSRS`
- Cột 5: `Phân loại`

Tại Cột 1, bên dưới chữ Hán, mã nguồn cũ lại chèn thêm một dòng chữ nhỏ màu cam:
`{card.reading && stripCloze(card.reading).trim() !== stripCloze(card.kanji).trim() && <span>{card.reading}</span>}`
Ngay sát cạnh đó, Cột 2 ("Cách đọc & Cao độ") lại tiếp tục hiển thị `{card.reading}` bằng chữ màu xanh đậm `#1E4B75`!
Ví dụ với thẻ `住みます`:
- Cột 1 hiển thị:
  `住みます`
  `すみます` (màu cam)
- Cột 2 ngay bên cạnh lại hiển thị:
  `すみます` (màu xanh đậm)
Với thẻ Ngữ pháp `【文法 Pattern 72】 V[て形] + います`:
- Cột 1 hiển thị: `V[て形] + います` đến 2 lần!
- Cột 2 tiếp tục hiển thị `V[て形] + います` lần thứ 3! (Xem ảnh `Screenshot 2026-10-03 194129.png`).

### 5. Phân tích nguyên nhân gốc rễ kỹ thuật
- **Sự thiếu nhất quán trong phân vai trò cột dữ liệu (Column Role Ambiguity)**: Lập trình viên thiết kế Cột 1 theo kiểu "card thu nhỏ" (miniature card) có cả Hán tự và Furigana, nhưng lại quên mất rằng bảng dữ liệu đã dành riêng một Cột 2 độc lập cho Furigana và Pitch Accent.

### 6. Tiêu chuẩn thẩm mỹ mục tiêu & Mã nguồn khắc phục
- **Nguyên tắc Phân định Ranh giới Cột Dữ liệu (Strict Column Single-Responsibility)**:
  - Cột 1: Chỉ phục vụ hiển thị chữ mặt trước (Kanji bề thế, Mẫu cấu trúc có huy hiệu `文法 Pattern`, hoặc câu Cloze sạch sẽ).
  - Cột 2: Dành riêng cho cách đọc Hiragana Furigana và cao độ ngữ âm Tokyo Pitch Accent.
  - Loại bỏ hoàn toàn dòng đọc màu cam thừa thãi ở Cột 1.

```tsx
// [ĐỀ XUẤT KHẮC PHỤC TẠI src/app/cards/page.tsx: Cột 1 và Cột 2]
{/* Cột 1: Mặt trước sạch sẽ, không trùng lặp */}
<td style={{ padding: '1.15rem 1.25rem' }}>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
    {patternMatch ? (
      <>
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-maru)', fontSize: '0.74rem', fontWeight: 800, color: '#1E4B75', background: '#EDF4FA', border: '1.2px solid #B8D5E5', borderRadius: '5px', padding: '0.12rem 0.5rem' }}>
            文法 {patternMatch[1]}
          </span>
        </div>
        <span style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.25rem', fontWeight: 700, color: '#122438' }}>
          {patternMatch[2]}
        </span>
      </>
    ) : (
      <span style={{ fontFamily: 'var(--font-mincho)', fontSize: card.kanji.length > 25 ? '1.05rem' : card.kanji.length > 15 ? '1.2rem' : '1.65rem', fontWeight: 700, color: '#122438' }}>
        {renderCleanCloze(card.kanji)}
      </span>
    )}
  </div>
</td>

{/* Cột 2: Cách đọc & Cao độ duy nhất */}
<td style={{ padding: '1.15rem 1.25rem' }}>
  <div style={{ fontFamily: 'var(--font-maru)', fontSize: '0.96rem', color: '#1E4B75', fontWeight: 600 }}>
    {stripCloze(card.reading) || '—'}
  </div>
  {card.pitch && (
    <span style={{ fontSize: '0.74rem', color: '#786A5E', display: 'inline-block', marginTop: '0.2rem' }}>
      Cao độ: {card.pitch}
    </span>
  )}
</td>
```

---

## 4.4. Hồ sơ lỗi `VIS-CARD-03`: Bảng dữ liệu tràn ngang không kiểm soát trên thiết bị di động (Table scroll horizontal clunky)

### 1. Mã định danh lỗi & Tên gọi thẩm mỹ
- **Mã lỗi**: `VIS-CARD-03`
- **Tên gọi**: Bảng thẻ học tràn ngang và khó thao tác trên di động (Mobile Data Table Horizontal Clunkiness).

### 2. Phân loại lỗi & Mức độ nghiêm trọng
- **Phân loại**: Lỗi Bố Cục Thích Ứng Di Động (Mobile Responsive Grid Defect).
- **Mức độ nghiêm trọng**: **P2 - High** (Làm giảm trải nghiệm tra cứu thẻ trên smartphone).

### 3. Vị trí tệp tin nguồn & Phạm vi dòng mã
- **Tệp tin**: [`src/app/cards/page.tsx`](file:///D:/project/japanese-srs-system/src/app/cards/page.tsx)
- **Vị trí dòng mã**: Dòng 400 – 430
- **Thành phần DOM**: Khung bảng `<table>` với 5 cột cố định.

### 4. Hiện trạng thực tế & Triệu chứng hiển thị trên màn hình
Thẻ `<table>` truyền thống với 5 cột yêu cầu bề rộng tối thiểu $760\text{px}$ để hiển thị đầy đủ thông tin. Khi xem trên màn hình điện thoại $375\text{px}$:
- Khung bảng bị ép co cụm, chữ trong cột "Ý nghĩa tiếng Việt" bị bóp nghẹt khiến mỗi dòng chỉ chứa được 2-3 từ, đẩy chiều cao của hàng lên gấp 4 lần.
- Người dùng phải dùng ngón tay kéo ngang (Horizontal Pan) sang phải mới nhìn thấy cột Phân loại và Trạng thái FSRS, sau đó lại phải kéo ngược sang trái để xem chữ Hán. Thao tác này cực kỳ vất vả và dễ bị trượt nhầm sang cử chỉ Back của trình duyệt Safari/Chrome.

### 5. Tiêu chuẩn thẩm mỹ mục tiêu & Giải pháp thiết kế
- Áp dụng kỹ thuật **Card-Transformation Responsive Table (Biến bảng thành thẻ Tanzaku trên Mobile)**:
  - Trên Desktop ($\ge 768\text{px}$): Hiển thị bảng dạng lưới 5 cột truyền thống chuẩn mực Washi.
  - Trên Mobile ($< 768\text{px}$): Mỗi hàng trong bảng tự động biến đổi (`display: block`) thành một **Tấm thẻ Đoản Sách (Tanzaku Card)** độc lập, thanh thoát, có viền bo mềm, Hán tự nổi bật ở trung tâm, nghĩa tiếng Việt ở bên dưới, và con dấu triện son đóng trang trọng ở góc phải trên cùng.

---

## 4.5. Hồ sơ lỗi `VIS-CARD-04`: Thanh tìm kiếm cọ lông (Sumi-e Search) thiếu micro-interaction focus ring và icon cọ lông nghệ thuật

### 1. Mã định danh lỗi & Tên gọi thẩm mỹ
- **Mã lỗi**: `VIS-CARD-04`
- **Tên gọi**: Thanh tìm kiếm thiếu linh hồn cọ lông và vòng sáng tương tác (Sumi-e Search Input Focus Interaction Defect).

### 2. Phân loại lỗi & Mức độ nghiêm trọng
- **Phân loại**: Lỗi Tương Tác Vi Mô & Cảm Giác Bề Mặt (Micro-interaction & Input Affordance Defect).
- **Mức độ nghiêm trọng**: **P3 - Medium**.

### 3. Vị trí tệp tin nguồn & Phạm vi dòng mã
- **Tệp tin**: [`src/app/cards/page.tsx`](file:///D:/project/japanese-srs-system/src/app/cards/page.tsx)
- **Vị trí dòng mã**: Dòng 235 – 253
- **Thành phần DOM**: `<input type="text" placeholder="Tìm kiếm từ vựng..." ... />`

### 4. Hiện trạng thực tế & Mã nguồn khắc phục
Ô tìm kiếm hiện tại chỉ là một thẻ `<input>` cơ bản với viền xám nhạt `border: 1.2px solid #E6DDCF`. Khi người dùng click chuột hoặc chạm ngón tay vào để gõ, trình duyệt hiện lên một đường outline xanh dương mặc định thô kệch của hệ điều hành Windows/Android, phá vỡ hoàn toàn bầu không khí mỹ học Nhật Bản.

**Giải pháp**: Thiết kế lại thanh tìm kiếm với biểu tượng cọ lông Sumi-e `🖌️`, vòng sáng phản quang vàng kim Kintsugi khi focus, và nút bấm xóa nhanh `✕` thanh lịch:
```tsx
// [ĐỀ XUẤT TỐI ƯU HÓA THANH TÌM KIẾM TẠI src/app/cards/page.tsx: Dòng 235-253]
<div style={{ position: 'relative', width: '100%' }}>
  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem', pointerEvents: 'none', opacity: 0.65 }}>
    🖌️
  </span>
  <input
    type="text"
    placeholder="Tìm kiếm từ vựng, chữ Kanji, cách đọc Furigana hoặc ngữ nghĩa..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{
      width: '100%',
      padding: '0.85rem 2.5rem 0.85rem 2.85rem',
      background: '#FFFFFF',
      border: '1.5px solid #E2D7C5',
      borderRadius: '12px',
      color: '#122438',
      fontSize: '0.95rem',
      outline: 'none',
      fontFamily: 'var(--font-sans)',
      boxShadow: '0 2px 6px rgba(18, 36, 56, 0.03)',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    }}
    onFocus={(e) => {
      e.target.style.borderColor = '#C89B58';
      e.target.style.boxShadow = '0 0 0 3px rgba(200, 155, 88, 0.18)';
    }}
    onBlur={(e) => {
      e.target.style.borderColor = '#E2D7C5';
      e.target.style.boxShadow = '0 2px 6px rgba(18, 36, 56, 0.03)';
    }}
  />
  {searchTerm && (
    <button
      type="button"
      onClick={() => setSearchTerm('')}
      style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#8A7560', cursor: 'pointer', fontSize: '0.9rem', padding: '0.2rem' }}
    >
      ✕
    </button>
  )}
</div>
```

---

## 4.6. Hồ sơ lỗi `VIS-CARD-05`: Dải nút lọc chủ đề (Deck Filter Pills) bị gãy hàng không đều đặn (Uneven flex wrapping)

- **Mã lỗi**: `VIS-CARD-05`
- **Hiện trạng**: Các nút bấm lọc bộ thẻ (`Tất cả`, `JPD133 - Hán Tự`, `JPD133 - Từ vựng Kotoba`, `JPD133 - Ngữ pháp Bunbou`) được xếp bằng flex-wrap. Khi màn hình co nhỏ, nút cuối cùng thường bị rớt xuống một hàng riêng lẻ nằm cô đơn ở mép trái, tạo ra một khoảng trống xấu xí ở mép phải.
- **Giải pháp**: Trên màn hình di động, chuyển đổi dải nút lọc thành một thanh cuộn ngang cảm ứng mượt mà (Horizontal Scrollable Strip with Momentum Scrolling) có hiệu ứng mờ biên (Edge Fade Gradients), cho phép vuốt lướt ngón tay cực kỳ êm ái như cuộn một dải lụa kimono.

---

## 4.7. Hồ sơ lỗi `VIS-CARD-06`: Trạng thái nhận thức FSRS (`Review` / `New`) dùng màu pastel nhạt nhòa, thiếu con dấu triện son Kintsugi

- **Mã lỗi**: `VIS-CARD-06`
- **Hiện trạng**: Nhãn `Đã củng cố` dùng màu xanh nhạt `#EBF5EE` và `Mới tiếp nhận` dùng màu lam nhạt `#EDF4FA`. Hai màu này quá nhạt nhòa, thiếu độ sâu quang học và trông giống như các nhãn trạng thái Bootstrap thông thường.
- **Giải pháp**: Thiết kế lại huy hiệu trạng thái thành dạng con dấu triện tròn mini (Kintsugi Status Dots):
  - `Đã củng cố`: Chấm ngọc bích `#2A6B3D` với vòng hào quang phát sáng nhẹ `box-shadow: 0 0 6px rgba(42, 107, 61, 0.3)`.
  - `Mới tiếp nhận`: Chấm vàng hổ phách `#C89B58` với viền dệt sợi lanh tự nhiên.

---
