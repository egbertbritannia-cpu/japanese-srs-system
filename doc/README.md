# 🌸 BỘ TÀI LIỆU THIẾT KẾ & KẾ HOẠCH THỰC THI GIAO DIỆN PHONG CÁCH NHẬT BẢN
## Dự án: Japanese SRS System (FSRS Spaced Repetition)
## Thư mục tài liệu: `D:\project\japanese-srs-system\doc`

---

### 📌 MỤC LỤC ĐIỀU PHỐI (DOCUMENTATION DIRECTORY)

Toàn bộ kế hoạch tái thiết kế giao diện theo phong cách Nhật Bản truyền thống tươi sáng (Gam màu Washi, Xanh Matcha Seigaiha, Đỏ son Torii, Hồng Sakura) đã được thiết lập chi tiết, tỉ mỉ và sẵn sàng cho Agent thực thi:

1. **[00_OVERVIEW_AND_MANIFESTO.md](file:///D:/project/japanese-srs-system/doc/00_OVERVIEW_AND_MANIFESTO.md)**  
   *Tổng quan dự án & Bản tuyên ngôn tái thiết kế*: Phân tích hiện trạng, bảng so sánh Trước/Sau (Before vs After), và hợp đồng an toàn backend (Zero Backend Touch).

2. **[01_DESIGN_SYSTEM_AND_TOKENS.md](file:///D:/project/japanese-srs-system/doc/01_DESIGN_SYSTEM_AND_TOKENS.md)**  
   *Hệ thống thiết kế & Biến CSS (Nippon Colors)*: Định nghĩa biến màu truyền thống, mã SVG Data URI cho các họa tiết Wagara (Seigaiha chuẩn ảnh người dùng, Asanoha, Yagasuri, vân xơ giấy Washi), và hệ typography Nhật Bản (`Shippori Mincho`, `Zen Maru Gothic`).

3. **[02_CULTURAL_ANIMATIONS_AND_ASSETS.md](file:///D:/project/japanese-srs-system/doc/02_CULTURAL_ANIMATIONS_AND_ASSETS.md)**  
   *Hoạt họa văn hóa & Kho biểu tượng SVG thuần túy*: Cánh hoa anh đào rơi (`SakuraBackground`), con dấu son đỏ Inkan (`inkanStamp`), lật thẻ 3D Karuta, búp bê may mắn Daruma (`DarumaMascot`), và bộ icon văn hóa (Cổng Torii, quạt Sensu, hạc Orizuru, núi Phú Sĩ).

4. **[03_GLOBAL_STYLES_AND_LAYOUT.md](file:///D:/project/japanese-srs-system/doc/03_GLOBAL_STYLES_AND_LAYOUT.md)**  
   *Mã nguồn toàn cục*: Mã nguồn hoàn chỉnh cho `src/app/globals.css` và `src/app/layout.tsx` (Thanh điều hướng Torii, Header dấu son '日学', và Footer phong cách Thiền).

5. **[04_PAGE_DASHBOARD_IMPLEMENTATION.md](file:///D:/project/japanese-srs-system/doc/04_PAGE_DASHBOARD_IMPLEMENTATION.md)**  
   *Mã nguồn trang Tổng quan (Honmaru)*: Mã nguồn hoàn chỉnh cho `src/app/page.tsx` với Hero Banner sóng Seigaiha Matcha `#88A752`, thanh tiến độ Daruma điểm mắt, 3 thẻ gỗ điều ước Ema, và ngạn ngữ Kotowaza.

6. **[05_PAGE_CARDS_MANAGEMENT_IMPLEMENTATION.md](file:///D:/project/japanese-srs-system/doc/05_PAGE_CARDS_MANAGEMENT_IMPLEMENTATION.md)**  
   *Mã nguồn trang Quản lý Thẻ (Tanzakucho)*: Mã nguồn hoàn chỉnh cho `src/app/cards/page.tsx` với thanh tìm kiếm bút lông, bộ lọc thẻ gỗ Kifuda JLPT N5-N1, và bảng thẻ bài Karuta thư pháp.

7. **[06_PAGE_AI_COPILOT_AND_NEW_CARD_IMPLEMENTATION.md](file:///D:/project/japanese-srs-system/doc/06_PAGE_AI_COPILOT_AND_NEW_CARD_IMPLEMENTATION.md)**  
   *Mã nguồn trang Soạn thẻ AI Copilot (Shodo Desk)*: Mã nguồn hoàn chỉnh cho `src/app/cards/new/page.tsx` với 1 ô nhập từ vựng duy nhất, hoạt họa hạc giấy Orizuru khi phân tích, thẻ thơ Tanzaku, và dấu ấn Inkan khi phê duyệt (Bảo toàn 100% logic API Copilot).

8. **[07_PAGE_REVIEW_ACTIVE_RECALL_IMPLEMENTATION.md](file:///D:/project/japanese-srs-system/doc/07_PAGE_REVIEW_ACTIVE_RECALL_IMPLEMENTATION.md)**  
   *Mã nguồn trang Ôn tập Active Recall (Karuta Session)*: Mã nguồn hoàn chỉnh cho `src/app/review/page.tsx` với trải nghiệm lật mở thẻ bài thơ cổ Hyakunin Isshu, hỗ trợ Furigana ngữ nghĩa, đường cao độ Tokyo, và 4 nút đánh giá mang 4 sắc thái văn hóa Nhật (Again, Hard, Good, Easy).

9. **[08_STEP_BY_STEP_EXECUTION_CHECKLIST.md](file:///D:/project/japanese-srs-system/doc/08_STEP_BY_STEP_EXECUTION_CHECKLIST.md)**  
   *Checklist thực thi 10 bước dành cho Agent (Zero Guesswork)*: Bảng thứ tự thao tác, lệnh tạo thư mục, quy trình ghi đè file, và 3 lệnh thẩm định tự động (`tsc`, `test`, `build`).

10. **[SKILL_AGENT_PLAYBOOK.md](file:///D:/project/japanese-srs-system/doc/SKILL_AGENT_PLAYBOOK.md)** / **[SKILL.md](file:///D:/project/japanese-srs-system/.agents/skills/japanese-srs-craftsman/SKILL.md)**  
   *Kỹ năng Antigravity Agent Chuyên nghiệp (`japanese-srs-craftsman`)*: Định nghĩa bộ quy chuẩn kỹ năng và tư duy cho Agent khi thiết kế giao diện Nhật Bản Wa-style, FSRS, và kiểm định phần mềm.

---

### ⛩️ HƯỚNG DẪN DÀNH CHO AGENT THỰC THI (QUICK START)
Agent tiếp nhận chỉ cần mở file **[08_STEP_BY_STEP_EXECUTION_CHECKLIST.md](file:///D:/project/japanese-srs-system/doc/08_STEP_BY_STEP_EXECUTION_CHECKLIST.md)** và thực hiện tuần tự từ **Bước 1 đến Bước 10**, sau đó chạy kiểm thử tại **Mục 3**. Toàn bộ mã nguồn đã sẵn sàng 100%, không cần phải tự suy luận hay thiết kế thêm bất cứ thành phần nào!
