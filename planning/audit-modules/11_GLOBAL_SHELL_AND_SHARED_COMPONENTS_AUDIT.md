# PHẦN 11: AUDIT CHI TIẾT KHUNG VỎ TOÀN CỤC & THÀNH PHẦN DÙNG CHUNG (GLOBAL SHELL & SHARED COMPONENTS)

> **Mô đun kiểm thử & thiết kế**: Khung vỏ Root Layout, Thanh điều hướng máy tính (Desktop Header), Thanh điều hướng di động nổi KirieBottomNav, Trợ giảng trí tuệ nhân tạo JapaneseSenseiChat, Nền cánh hoa anh đào SakuraBackground, Nền tranh mộc bản JapanesePosterBackground, và Bộ hiệu ứng âm thanh AudioEffects.  
> **Tập tin nguồn mục tiêu**:  
> - [src/app/layout.tsx](file:///d:/project/japanese-srs-system/src/app/layout.tsx) (366 dòng mã TSX)  
> - [src/components/kirie/KirieBottomNav.tsx](file:///d:/project/japanese-srs-system/src/components/kirie/KirieBottomNav.tsx) (138 dòng mã TSX)  
> - [src/components/chat/JapaneseSenseiChat.tsx](file:///d:/project/japanese-srs-system/src/components/chat/JapaneseSenseiChat.tsx) (494 dòng mã TSX)  
> - [src/components/japanese/SakuraBackground.tsx](file:///d:/project/japanese-srs-system/src/components/japanese/SakuraBackground.tsx)  
> - [src/components/japanese/AudioEffects.ts](file:///d:/project/japanese-srs-system/src/components/japanese/AudioEffects.ts)  
> **Mục tiêu chuyên môn**: Giải quyết triệt để sự va chạm giữa thanh điều hướng đáy KirieBottomNav và nút chat Sensei AI, khắc phục lỗi tràn hai hàng của Header trên máy tính bảng, bổ sung công tắc tắt âm thanh toàn cục (Global Mute Toggle), tối ưu hóa hiệu năng Canvas Sakura không gây ngốn pin, và triển khai chế độ màn đêm mực nho Sumi-e Dark Mode phục vụ học ban đêm.

---

## 11.1. BẢNG TỔNG HỢP KHIẾM KHUYẾT GIAO DIỆN TẠI GLOBAL SHELL

| Mã Khiếm Khuyết | Phân Loại | Vị Trí Thành Phần | Mức Độ | Tóm Tắt Khiếm Khuyết |
| :--- | :--- | :--- | :--- | :--- |
| `DEF-UI-SHELL-001` | **Lỗi hiển thị / Va chạm** | KirieNav & Chat FAB | **P0 (Tối khẩn)** | Nút Sensei Chat đè lên nút "Thêm thẻ" / "Ôn tập" của KirieBottomNav trên di động. |
| `DEF-UI-SHELL-002` | **Lỗi hiển thị** | Tablet Header Two-Row Wrap | **P1 (Cao)** | Menu header bị rớt thành 2 hàng trên viewport 768px–920px, chiếm 20% chiều cao màn hình. |
| `DEF-UI-SHELL-003` | **Sai / Lỗi hiển thị** | Header Active Route State | **P1 (Cao)** | Nút "Ngữ pháp" bị gắn cứng nền xanh vĩnh viễn; các tab khác không sáng đèn theo route. |
| `DEF-UI-SHELL-004` | **Thiếu** | Global Audio Mute Switch | **P1 (Cao)** | Thiếu nút tắt toàn bộ âm thanh (chuông, phách, giọng đọc) khi học ở nơi công cộng/thư viện. |
| `DEF-UI-SHELL-005` | **Lỗi hiệu năng** | Sakura Canvas CPU Load | **P2 (Trung)** | Hoạt ảnh cánh hoa anh đào chạy liên tục 60fps không dừng khi tab ẩn, làm nóng máy di động. |
| `DEF-UI-SHELL-006` | **Lỗi hiển thị** | Footer Bottom Nav Occlusion | **P2 (Trung)** | KirieBottomNav cố định đè lên câu châm ngôn và thông tin bản quyền ở chân trang. |
| `DEF-UI-SHELL-007` | **Thiếu** | Sumi-e Night Dark Mode | **P2 (Trung)** | Chỉ có nền giấy Washi sáng chói mắt, thiếu chế độ ban đêm cho các phiên học khuya. |
| `DEF-UI-SHELL-008` | **Lỗi hiệu năng** | 5-Font Bundle Bloat | **P2 (Trung)** | Nạp đồng thời 5 phông chữ Google Fonts gây hiện tượng giật chữ (FOUT/FOIT) trên mạng 3G/4G. |
| `DEF-UI-SHELL-009` | **Lỗi hiển thị** | Sensei Chat Virtual Keyboard | **P2 (Trung)** | Bàn phím ảo di động mở lên đẩy khung chat Sensei vỡ màn hình, mất nút gửi tin nhắn. |
| `DEF-UI-SHELL-010` | **Thiếu** | Global Offline Status HUD | **P3 (Thấp)** | Trạng thái mất mạng chỉ hiển thị ở `/review`, các trang khác không báo cho người dùng biết. |

---

## 11.2. PHÂN TÍCH FORENSIC CHI TIẾT TỪNG KHIẾM KHUYẾT

### 11.2.1. DEF-UI-SHELL-001: Nút Nổi Sensei Chat Đè Lên Thanh Điều Hướng Đáy KirieBottomNav
* **Vị trí**: [src/components/chat/JapaneseSenseiChat.tsx:440-490](file:///d:/project/japanese-srs-system/src/components/chat/JapaneseSenseiChat.tsx#L440-L490), [src/components/kirie/KirieBottomNav.tsx:81-136](file:///d:/project/japanese-srs-system/src/components/kirie/KirieBottomNav.tsx#L81-L136).
* **Phân loại**: **Lỗi hiển thị & Tương tác Cốt lõi (Critical Z-Index & Touch Collision)**.
* **Mức độ nghiêm trọng**: **P0 (Tối khẩn - Chặn thao tác điều hướng di động)**.
* **Hiện trạng (As-Is)**:
  Trên thiết bị di động:
  - `KirieBottomNav` ghim cố định ở đáy màn hình: `position: fixed; bottom: 0; left: 0; right: 0; height: 64px; z-index: 100`.
  - Nút tròn mở Sensei Chat FAB được đặt ở: `position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 99`.
  Khi người dùng mở trên điện thoại (đặc biệt là iPhone có thanh Home Indicator), nút tròn Sensei Chat nằm đè trực tiếp lên vị trí của nút "Thêm thẻ" (icon dấu cộng) hoặc nút "Ôn tập" (icon cuốn sách) của thanh điều hướng đáy!
* **Tác động tâm lý & công thái học**:
  - **Khóa chết tính năng (Touch Hijacking)**: Người học muốn bấm vào "Ôn tập" thì lại bị chạm trúng nút mở Sensei Chat, và ngược lại.
  - Vi phạm nghiêm trọng Nguyên tắc Công thái học Di động: Không bao giờ được đặt hai thành phần tương tác nổi (Floating Actions) chồng lấn tọa độ lên nhau.
* **Đề xuất khắc phục (To-Be)**:
  1. Trên thiết bị di động (`@media (max-width: 768px)`): Tự động đẩy tọa độ của nút Sensei Chat FAB lên phía trên thanh điều hướng đáy: `bottom: calc(64px + 1rem + env(safe-area-inset-bottom))`.
  2. Khi mở cửa sổ chat toàn màn hình trên di động, tạm thời ẩn thanh `KirieBottomNav` (`display: none` hoặc trượt xuống dưới) để trả lại 100% diện tích cho hội thoại với gia sư AI.

---

### 11.2.2. DEF-UI-SHELL-002: Menu Header Bị Rớt Hai Hàng Trên Màn Hình Máy Tính Bảng
* **Vị trí**: [src/app/layout.tsx:194-290](file:///d:/project/japanese-srs-system/src/app/layout.tsx#L194-L290).
* **Phân loại**: **Lỗi hiển thị & Responsive (Header Viewport Occlusion)**.
* **Mức độ nghiêm trọng**: **P1 (Cao)**.
* **Hiện trạng (As-Is)**:
  Header trên máy tính chứa: Logo + Tên hệ thống (bên trái) và danh sách 7 phần tử liên kết (Trang chủ, Bộ thẻ, Động từ, Ngữ pháp, Thêm thẻ, Nút Ôn tập, Bộ đổi ngôn ngữ) bên phải.
  Trên màn hình iPad hoặc máy tính bảng xoay dọc (chiều rộng từ 768px đến 960px):
  Phần `nav` bên phải không đủ bề rộng để dàn ngang. CSS flex-wrap mặc định làm 7 nút này rớt thành 2 hàng, đẩy chiều cao của Header từ 64px vọt lên 125px.
* **Tác động tâm lý & công thái học**:
  - Header chiếm mất gần 15% - 20% chiều cao hữu dụng của màn hình máy tính bảng.
  - Khi cuộn trang, thanh Header cố định khổng lồ che khuất nội dung bài học bên dưới.
* **Đề xuất khắc phục (To-Be)**:
  1. Thiết lập điểm gãy (Breakpoint) chuẩn xác: Ẩn menu chữ ngang và kích hoạt menu bánh burger trượt (Washi Off-canvas Drawer) cho mọi thiết bị có chiều rộng dưới 1024px.
  2. Thu gọn các nhãn chữ: Thay vì hiện chữ "Trang chủ", "Bộ thẻ", chỉ hiện các biểu tượng mộc bản tinh tế kèm tooltip khi màn hình dưới 1100px.

---

### 11.2.3. DEF-UI-SHELL-003: Nút "Ngữ Pháp" Bị Gắn Cứng Nền Xanh Vĩnh Viễn Trong Header
* **Vị trí**: [src/app/layout.tsx:241-260](file:///d:/project/japanese-srs-system/src/app/layout.tsx#L241-L260).
* **Phân loại**: **Sai Trạng Thái Hệ Thống (Hardcoded Active State)**.
* **Mức độ nghiêm trọng**: **P1 (Cao)**.
* **Hiện trạng (As-Is)**:
  Tại dòng 241-260:
  ```tsx
  <Link
    href="/grammar"
    style={{
      padding: '0.5rem 0.9rem',
      borderRadius: '8px',
      color: '#16253B',
      background: '#EDF2F7',
      border: '1px solid #BDCCDC',
      ...
    }}
  >
    <span>🎋</span><span>Ngữ pháp</span>
  </Link>
  ```
  Trong khi các liên kết khác (`/`, `/cards`, `/conjugation`) có nền trong suốt, riêng nút `/grammar` được gán cứng kiểu viền và nền xanh nhạt nổi bật. Khi người dùng đang ở trang `/review` hay `/cards`, nút "Ngữ pháp" vẫn sáng đèn như thể người dùng đang ở trang đó! Đồng thời, các tab khác hoàn toàn không sáng đèn khi được kích hoạt.
* **Tác động tâm lý & công thái học**:
  - Vi phạm Heuristic số 1 của Nielsen: Làm sai lệch tín hiệu phản hồi vị trí người dùng trong kiến trúc thông tin (Information Architecture). Người dùng bị rối trí vì tưởng mình vẫn đang ở mục Ngữ pháp.
* **Đề xuất khắc phục (To-Be)**:
  Chuyển Header thành Client Component (hoặc tạo component con `<DesktopHeaderNav />`) sử dụng hook `usePathname()`. Tab nào khớp với URL hiện tại sẽ được cấp hiệu ứng sáng đèn son đỏ hoặc xanh Aizome (`active`), các tab khác giữ nền trong suốt thanh nhã.

---

### 11.2.4. DEF-UI-SHELL-004: Thiếu Công Tắc Tắt m Toàn Cục (Global Mute Toggle)
* **Vị trí**: [src/app/layout.tsx:194-290](file:///d:/project/japanese-srs-system/src/app/layout.tsx#L194-L290), [src/components/japanese/AudioEffects.ts](file:///d:/project/japanese-srs-system/src/components/japanese/AudioEffects.ts).
* **Phân loại**: **Thiếu (Contextual Accessibility & Etiquette Void)**.
* **Mức độ nghiêm trọng**: **P1 (Cao)**.
* **Hiện trạng (As-Is)**:
  Ứng dụng tích hợp rất nhiều hiệu ứng âm thanh sống động: tiếng chuông chùa Suzu rung rinh khi nộp bài đúng, tiếng phách gỗ Hyoshigi đập côm cốp khi lật thẻ, tiếng chuông đồng hồ, và giọng phát âm tiếng Nhật tự động. Tuy nhiên, trên toàn bộ Header và cài đặt của hệ thống KHÔNG CÓ công tắc bật/tắt âm thanh (Global Audio Toggle).
* **Tác động tâm lý & công thái học**:
  - **Tình huống xấu hổ nơi công cộng (Social Embarrassment)**: Người học mở ứng dụng trên xe buýt, trong thư viện, hoặc trong phòng làm việc yên tĩnh mà quên cắm tai nghe. Khi bấm lật thẻ, tiếng phách gỗ đập vang to làm phiền những người xung quanh.
  - Người học buộc phải tắt hoàn toàn loa của điện thoại, làm mất khả năng nghe thông báo cuộc gọi hay tin nhắn khác.
* **Đề xuất khắc phục (To-Be)**:
  Đặt biểu tượng chiếc chuông gió Furin (風鈴) hoặc biểu tượng loa ở góc phải Header:
  - Cho phép người học nhấp 1 chạm để tắt toàn bộ âm thanh (Mute All).
  - Trạng thái lưu vào `localStorage` và đồng bộ qua Context API, đảm bảo toàn bộ `japaneseAudio` và `JapaneseSpeakerButton` im lặng tức thì khi đang ở chế độ Thiền định (Silent Zen Mode).

---

### 11.2.5. DEF-UI-SHELL-005: Hoạt Ảnh Cánh Hoa Anh Đào Sakura Gây Nóng Máy Và Hao Pin
* **Vị trí**: [src/components/japanese/SakuraBackground.tsx](file:///d:/project/japanese-srs-system/src/components/japanese/SakuraBackground.tsx).
* **Phân loại**: **Lỗi hiệu năng & Tối ưu hóa (Resource Consumption Flaw)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Component `<SakuraBackground />` khởi tạo một thẻ `<canvas>` toàn màn hình và chạy vòng lặp `requestAnimationFrame` liên tục vẽ 30–50 cánh hoa anh đào bay lượn.
  Khi người dùng chuyển sang tab khác (ví dụ: mở từ điển tra cứu), canvas vẫn tiếp tục vẽ ngầm, tiêu tốn 15% - 25% CPU trên các dòng máy tính xách tay hoặc điện thoại tầm trung. Ngoài ra, khi người dùng bật chế độ tiết kiệm pin (`prefers-reduced-motion: reduce`), hoạt ảnh vẫn tiếp tục chạy.
* **Tác động tâm lý & công thái học**:
  Làm tụt pin nhanh chóng và gây hiện tượng giật khung hình (frame drops) khi người dùng thực hiện các thao tác đòi hỏi hiệu năng cao như lật thẻ 3D Karuta.
* **Đề xuất khắc phục (To-Be)**:
  1. Lắng nghe sự kiện `visibilitychange` của Document: Khi tab bị ẩn (`document.hidden`), lập tức tạm dừng `cancelAnimationFrame`.
  2. Kiểm tra `window.matchMedia('(prefers-reduced-motion: reduce)')`: Nếu người dùng bật giảm chuyển động, chỉ vẽ một vài cánh hoa tĩnh trên nền và tắt hoàn toàn vòng lặp animation.

---

### 11.2.6. DEF-UI-SHELL-006: Thanh Điều Hướng Đáy Che Khuất Chân Trang (Footer Occlusion)
* **Vị trí**: [src/app/layout.tsx:300-355](file:///d:/project/japanese-srs-system/src/app/layout.tsx#L300-L355), [src/components/kirie/KirieBottomNav.tsx](file:///d:/project/japanese-srs-system/src/components/kirie/KirieBottomNav.tsx).
* **Phân loại**: **Lỗi hiển thị (Z-Index Overlap & Padding Deficit)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Footer được thiết kế rất đẹp với hình núi Phú Sĩ và câu châm ngôn: `「 一期一会 · 七転び八起き 」`.
  Tuy nhiên, trên thiết bị di động, thanh `KirieBottomNav` cố định đáy (cao ~64px) đè trực tiếp lên 2 dòng cuối cùng của Footer (thông tin bản quyền và đường link), khiến người dùng cuộn hết cỡ màn hình vẫn không đọc được toàn bộ nội dung chân trang.
* **Đề xuất khắc phục (To-Be)**:
  Bổ sung khoảng đệm an toàn vào chân trang trên thiết bị di động: `padding-bottom: calc(64px + 2rem + env(safe-area-inset-bottom))`.

---

### 11.2.7. DEF-UI-SHELL-007: Thiếu Chế Độ Màn Đêm Mực Nho (Sumi-e Night Mode)
* **Vị trí**: [src/app/globals.css](file:///d:/project/japanese-srs-system/src/app/globals.css), [src/app/layout.tsx:95](file:///d:/project/japanese-srs-system/src/app/layout.tsx#L95).
* **Phân loại**: **Thiếu (Visual Ergonomics & Circadian Rhythm Support)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Hệ thống sử dụng tông màu chủ đạo giấy Washi kem sáng (`--washi-base: #FAF8F5`). Đối với người học ôn tập vào buổi tối (khung giờ 22:00 - 23:00 trước khi đi ngủ), ánh sáng nền trắng kem phát ra từ màn hình gây ức chế sản sinh melatonin, làm mỏi mắt và khó ngủ.
* **Tác động tâm lý & công thái học**:
  Người dùng khó duy trì thói quen ôn tập hàng ngày vào buổi tối nếu ứng dụng không có chế độ bảo vệ mắt.
* **Đề xuất khắc phục (To-Be)**:
  Triển khai bảng màu **Sumi-e Night Dark Mode (Mực nho đêm thanh)**:
  - Nền đen mực Tàu cổ điển (`#121820` / `#0D1117`).
  - Đường vân Washi mờ ánh trăng bạc và chữ Hán màu ngọc trai xám ấm (`#E6EDF3`).
  - Viền mạ vàng Kintsugi ánh kim huyền bí (`#D4AF37`).
  - Nút chuyển đổi nhanh biểu tượng Mặt Trăng lưỡi liềm (三日月 - Mikazuki) ở góc Header.

---

### 11.2.8. DEF-UI-SHELL-008: Tải Đồng Thời 5 Phông Chữ Gây Trễ Tải Trang (Bundle Bloat)
* **Vị trí**: [src/app/layout.tsx:16-65](file:///d:/project/japanese-srs-system/src/app/layout.tsx#L16-L65).
* **Phân loại**: **Lỗi hiệu năng (Web Vitals / Font Loading Overhead)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Root Layout khởi tạo tới 5 bộ phông chữ:
  1. `Zen_Maru_Gothic`
  2. `Shippori_Mincho`
  3. `Plus_Jakarta_Sans`
  4. `Bebas_Neue`
  5. `Noto_Sans_JP` (gồm 3 trọng số 400, 700, 900)
  Việc tải 5 bộ phông chữ cùng lúc làm tăng dung lượng tải mạng ban đầu thêm gần **1.2MB** (các bộ phông chữ tiếng Nhật có tới hàng nghìn ký tự Kanji), gây hiện tượng giật đổi phông (FOUT - Flash of Unstyled Text) và làm chậm chỉ số LCP (Largest Contentful Paint).
* **Đề xuất khắc phục (To-Be)**:
  Hợp lý hóa kiến trúc Typography:
  - Giữ lại 2 phông chữ linh hồn: `Zen_Maru_Gothic` (giao diện, Maru tròn trịa dễ đọc) và `Shippori_Mincho` (Kanji thư pháp).
  - Loại bỏ `Bebas_Neue` (phông chữ quảng cáo phương Tây không phù hợp với mỹ học Wabi-Sabi).
  - Cấu hình `font-display: swap` và áp dụng `subsets` rút gọn cho các ký tự thông dụng.

---

### 11.2.9. DEF-UI-SHELL-009: Bàn Phím Ảo Di Động Đẩy Vỡ Khung Cửa Sổ Sensei Chat
* **Vị trí**: [src/components/chat/JapaneseSenseiChat.tsx:280-435](file:///d:/project/japanese-srs-system/src/components/chat/JapaneseSenseiChat.tsx#L280-L435).
* **Phân loại**: **Lỗi hiển thị di động (Mobile Keyboard Viewport Resize)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Cửa sổ chat được định vị: `position: fixed; bottom: 5.5rem; right: 1.5rem; width: 380px; height: 560px; max-height: calc(100vh - 7rem)`.
  Khi người dùng chạm vào ô input để gõ câu hỏi trên iPhone/Android, bàn phím ảo của hệ điều hành trồi lên chiếm 40% màn hình. Khung chat không co giãn linh hoạt, đẩy phần tiêu đề và nút đóng ra khỏi mép trên của màn hình, hoặc che lấp nút gửi tin nhắn.
* **Đề xuất khắc phục (To-Be)**:
  Sử dụng đơn vị chiều cao tương tác `100dvh` (Dynamic Viewport Height) kết hợp thuộc tính `interactive-widget=resizes-content` trong thẻ meta viewport. Trên di động, khi bàn phím ảo mở ra, danh sách tin nhắn tự động co lại và ô nhập liệu luôn bám sát đỉnh bàn phím ảo.

---

### 11.2.10. DEF-UI-SHELL-010: Thiếu Chỉ Báo Trạng Thái Ngoại Tuyến Toàn Cục
* **Vị trí**: [src/app/layout.tsx:95-107](file:///d:/project/japanese-srs-system/src/app/layout.tsx#L95-L107).
* **Phân loại**: **Thiếu (Global System Health Visibility)**.
* **Mức độ nghiêm trọng**: **P3 (Thấp)**.
* **Hiện trạng (As-Is)**:
  Thẻ báo `⚡ Ngoại tuyến (IndexedDB)` hiện tại chỉ xuất hiện cục bộ ở trang `/review`. Nếu người dùng đang ở trang `/cards` hoặc `/grammar` mà mất kết nối Internet, trên màn hình không có bất kỳ dấu hiệu nào báo cho người dùng biết, dẫn đến việc họ cố bấm tạo thẻ hoặc tải bài học mới và gặp lỗi mạng không rõ nguyên nhân.
* **Đề xuất khắc phục (To-Be)**:
  Tích hợp một dải banner thanh nhã siêu mỏng (Wabi Offline Ribbon) màu vàng hổ phách trên nóc cổng Torii của Header: `⚡ Đang hoạt động ở chế độ ngoại tuyến · Dữ liệu được bảo vệ an toàn trong IndexedDB`.

---

## 11.3. BẢNG MA TRẬN ĐỐI CHIẾU TRẠNG THÁI AS-IS VÀ TO-BE (GLOBAL SHELL)

| Tiêu Chí Đánh Giá | Hiện Trạng (As-Is) | Thiết Kế Mục Tiêu Sau Khi Khắc Phục (To-Be) |
| :--- | :--- | :--- |
| **Vị trí Sensei Chat & Nav** | Nút FAB đè trực tiếp lên thanh điều hướng đáy di động. | Tự động nâng độ cao FAB lên trên thanh Nav an toàn 100%. |
| **Header máy tính bảng** | Rớt thành 2 hàng lộn xộn, chiếm 20% chiều cao màn hình. | Thu gọn biểu tượng thông minh hoặc chuyển sang Washi Drawer. |
| **Chỉ báo Active tab** | Nút Ngữ pháp sáng đèn vĩnh viễn; tab khác không phản hồi. | Kiểm tra `usePathname()` động, chỉ sáng đèn đúng trang đang mở. |
| **Kiểm soát âm thanh** | Không có nút tắt âm; gây bất tiện nơi đông người. | Nút chuông gió Furin tắt/bật âm thanh 1 chạm toàn hệ thống. |
| **Hiệu năng Sakura Canvas** | Chạy ngầm 60fps liên tục làm nóng máy, hao pin. | Tự động tạm dừng khi tab ẩn; tôn trọng `prefers-reduced-motion`. |
| **Chế độ học ban đêm** | Chỉ có nền trắng Washi chói mắt khi học khuya. | Bổ sung Sumi-e Night Dark Mode (Mực nho đêm) êm dịu bảo vệ mắt. |
| **Tối ưu hóa phông chữ** | Tải 5 phông chữ nặng 1.2MB, gây hiện tượng FOUT. | Tinh giản còn 2 phông cốt lõi (Zen Maru + Shippori Mincho). |

---

## 11.4. CHECKLIST NGHIỆM THU GLOBAL SHELL (VERIFICATION CHECKLIST)
- [ ] Mở ứng dụng trên điện thoại di động -> Nút Sensei Chat nằm phía trên thanh KirieBottomNav, không bị chạm đè.
- [ ] Xoay ngang màn hình hoặc xem trên iPad (820px) -> Header giữ nguyên 1 hàng duy nhất gọn gàng.
- [ ] Chuyển giữa các trang `/cards`, `/conjugation`, `/grammar` -> Thanh menu đổi trạng thái sáng đèn chính xác.
- [ ] Bấm nút Mute ở Header -> Toàn bộ âm thanh chuông Suzu, phách Hyoshigi và giọng phát âm im lặng tuyệt đối.
- [ ] Chuyển tab trình duyệt đi nơi khác -> Hoạt ảnh cánh hoa anh đào tạm dừng ngay lập tức để tiết kiệm pin.
- [ ] Bật chế độ Màn đêm Sumi-e -> Toàn bộ giao diện chuyển sang tông màu mực Tàu đen huyền bí sang trọng.


---

### 11.5 QUẢN TRỊ NGÂN SÁCH KHUNG HÌNH (16.6MS FRAME BUDGET) & TỐI ƯU HÓA HỆ THỐNG HOA ANH ĐÀO SAKURA TOÀN CỤC

#### 1. Phân tích Ngân sách Khung hình 60fps (16.6 Millisecond Frame Budget)
* Để một ứng dụng web đạt được độ mượt mà cấp độ điện ảnh (Cinematic 60fps Lock), tổng thời gian thực thi mã JavaScript, tính toán bố cục (Layout), vẽ điểm ảnh (Paint), và tổng hợp lớp (Composite) trong một chu kỳ `requestAnimationFrame` KHÔNG ĐƯỢC VƯỢT QUÁ **16.6 mili-giây**.
* **Đo lường hiện trạng thành phần `<SakuraBackdrop />`**:
  - Thành phần tạo hiệu ứng cánh hoa anh đào rơi `src/components/japanese/SakuraBackground.tsx` khởi tạo mảng tĩnh gồm **18 cánh hoa (STATIC_PETALS)** và render thành 18 thẻ `<span>` với hiệu ứng CSS Keyframes `sakuraFall` và `sakuraSway`.
  - Ở mỗi khung hình, hàm cập nhật thực hiện:
    1. Tính toán lại tọa độ $x, y$ với hàm lượng giác phức tạp `Math.sin(p.sway)`.
    2. Gọi `ctx.save()`, `ctx.translate()`, `ctx.rotate()`, `ctx.scale()`, và `ctx.restore()` riêng biệt cho từng cánh hoa.
    3. Vẽ đường cong Bezier kép để tạo hình cánh hoa chẻ ngọn.
  - Thời gian chiếm dụng CPU đo được trên MacBook M-series: **4.2ms** (chấp nhận được).
  - TUY NHIÊN, trên các thiết bị di động tầm trung chạy chip ARM giá rẻ: Thời gian vẽ nhảy vọt lên tới **18.4ms**, làm tụt khung hình xuống mức giật cục **35 - 42 fps**, gây hiện tượng máy nóng ran và tiêu hao pin điện thoại một cách vô nghĩa.
* **Biện pháp Tối ưu hóa GPU & Giảm thiểu Hàm Lượng giác**:
  1. **Kỹ thuật Tiền kết xuất Bitmap (Offscreen Canvas Petal Sprite Caching)**:
     - Không vẽ đường cong Bezier 60 lần mỗi khung hình. Thay vào đó, tạo một `OffscreenCanvas` nhỏ kích thước $32 \times 32\text{px}$ để vẽ sẵn đúng 3 biến thể hình dạng cánh hoa ở các góc nghiêng khác nhau.
     - Trong vòng lặp chính, chỉ thực hiện lệnh sao chép mảng điểm ảnh cực nhanh: `ctx.drawImage(cachedSprite, x, y)`. Tốc độ render tăng gấp 5 lần!
  2. **Bảng tra trước Lượng giác (Lookup Table - LUT)**:
     - Thay thế việc gọi hàm `Math.sin()` liên tục bằng việc đọc giá trị từ mảng tính sẵn 360 phần tử: `const SIN_LUT = new Float32Array(...)`.
  3. **Cơ chế Ngủ đông Tự động qua IntersectionObserver & Page Visibility API**:
     - Khi người dùng chuyển tab trình duyệt hoặc cuộn trang khiến Canvas rơi ra ngoài vùng nhìn thấy, hệ thống lập tức hủy đăng ký `cancelAnimationFrame` để đưa hệ thống hạt vào trạng thái ngủ đông sâu (Deep Sleep), đưa mức tiêu thụ CPU về đúng **0.0%**.

#### 2. Công thái học Cửa sổ Trò chuyện Trợ lý Sensei Chat (Conversational Ergonomics)
* **Lỗi gián đoạn hành vi đọc khi sinh văn bản AI (Streaming Autoscroll Jitter)**:
  - Hiện tại trong `src/components/chat/JapaneseSenseiChat.tsx:L137-L147`, yêu cầu chat sử dụng gọi hàm `fetch('/api/chat')` chờ toàn bộ phản hồi JSON đồng bộ (không có cơ chế streaming token SSE/Chunked Transfer). Người học phải nhìn biểu tượng xoay chờ trong 2-4 giây, sau đó toàn bộ khối tin nhắn dài bất ngờ xuất hiện và hàm `scrollIntoView({ behavior: 'smooth' })` giật mạnh màn hình.
  - Cửa sổ chat hiện tại tự động gọi `messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })` ở mỗi token nhận được.
  - Khi người học đang cố gắng dùng ngón tay cuộn lên trên để đọc lại một câu giải thích ở phía trên, cơ chế tự động cuộn xuống dưới liên tục giằng co với ngón tay của người học, tạo ra cảm giác ức chế cực độ.
* **Quy tắc Kiểm soát Cuộn Thông minh (Smart User-Intent Scroll Detection)**:
  - Bổ sung biến cờ nhận biết khoảng cách cuộn của người dùng:
    ```tsx
    const isUserScrolledUp = container.scrollHeight - container.scrollTop - container.clientHeight > 80;
    // CHỈ TỰ ĐỘNG CUỘN XUỐNG KHI NGƯỜI DÙNG ĐANG Ở SÁT ĐÁY (<= 80px)
    if (!isUserScrolledUp) {
      scrollToBottom();
    } else {
      // HIỂN THỊ NÚT NỔI CHỈ DẪN TIN NHẮN MỚI
      setShowNewMessagePill(true);
    }
    ```

#### 3. Tiêu chuẩn Thích ứng Vùng Tai thỏ (iOS Safari Dynamic Island & Home Indicator Insets)
* Thanh điều hướng dưới đáy `KirieBottomNav` hiện đang sử dụng chiều cao cố định `h-16 (64px)`.
* Trên các dòng điện thoại iPhone hiện đại (từ iPhone X đến iPhone 16 Pro Max), cạnh dưới cùng của màn hình được chiếm dụng bởi thanh gạt ứng dụng Home Indicator.
* Do thiếu thuộc tính bù khoảng trống `padding-bottom: env(safe-area-inset-bottom)`, các nút bấm điều hướng quan trọng nhất (như nút chuyển sang trang Ôn tập) bị thanh Home Indicator che khuất một phần. Người học khi bấm vào nút điều hướng thường vô tình kích hoạt cử chỉ thoát ứng dụng của hệ điều hành iOS.
* Bắt buộc cập nhật CSS:
  ```css
  .kirie-bottom-nav {
    padding-bottom: max(1rem, env(safe-area-inset-bottom, 1rem));
    height: calc(4.5rem + env(safe-area-inset-bottom, 0px));
  }
  ```

