# 📜 TÀI LIỆU 12: KẾ HOẠCH TÁI THIẾT KẾ TOÀN DIỆN LỒNG GHÉP MỸ HỌC VÀ TƯ LIỆU TRANH TRUYỀN THỐNG NHẬT BẢN
## Dự án: Japanese SRS System (FSRS Spaced Repetition)
## Cấp độ: Master Visual Re-Architecture & Asset Integration Blueprint
## Thư mục tư liệu ảnh: `public/assets/art/` (Trích xuất từ `C:\Users\ThinkPad X1\Pictures\collection`)
## Phiên bản: 1.0.0 (Master Japanese Cultural Edition)

---

> [!IMPORTANT]
> **BẢN KẾ HOẠCH NÀY ĐƯỢC THIẾT LẬP THEO QUY CHUẨN PHÂN TẦNG 5 CẤP ĐỘ**.
> Kế thừa toàn bộ kết quả giải mã đồ họa tại **[`doc/11_JAPANESE_GRAPHIC_DESIGN_DECONSTRUCTION.md`](file:///D:/project/japanese-srs-system/doc/11_JAPANESE_GRAPHIC_DESIGN_DECONSTRUCTION.md)** và khai thác tối đa **13 tác phẩm hội họa mộc bản / hoa văn truyền thống** trong bộ sưu tập tư liệu để lồng ghép vào giao diện hệ thống (làm hình nền, tranh thủy mặc treo tường, lớp phủ mờ watermark, dải phân cách sóng cuộn, và phông nền khải hoàn).
> Toàn bộ quá trình thực thi tuân thủ nghiêm ngặt nguyên tắc **Bảo toàn 100% Backend & Tối ưu hiệu năng Web (60 FPS & Zero Layout Shift)**.

---

# ⛩️ TẦNG 1: TỔNG QUAN CHIẾN LƯỢC, PHẠM VI (SCOPE) & BẢN CAM KẾT BẢO TỒN

### 1.1. Tuyên ngôn Tái thiết kế Thị giác (Visual Re-Architecture Vision)
- **Mục tiêu**: Chuyển đổi giao diện ứng dụng từ một web SRS hiện đại thông thường thành một **Không gian Văn hóa & Nghệ thuật Nhật Bản Sống động (Immersive Japanese Cultural Learning Sanctuary)**.
- **Phương pháp**: Không chỉ áp dụng bảng màu Nippon Colors phẳng, mà đưa trực tiếp các danh tác hội họa mộc bản Ukiyo-e (Katsushika Hokusai), hoa văn gấm lụa Yuzen, dòng chảy tranh Rinpa, dải sóng vàng Kin-nami và hình tượng chim hạc Tancho vào đúng ngữ cảnh của từng màn hình:
  - **Trang chủ (Honmaru)**: Biến thành một Trà thất thanh tịnh ngắm nhìn toàn cảnh Phú Sĩ và làng văn hóa trà đạo.
  - **Thư viện Thẻ (Tanzakucho)**: Biến thành Tàng Kinh Các lưu trữ thẻ thơ dát vàng với dòng chảy tri thức Ryusui uốn lượn.
  - **Bàn Soạn Thẻ AI (Shodo Desk)**: Biến thành Thư phòng Thư pháp cổ điển với tranh cuộn Kakejiku hạc trắng Umezawa bảo chứng tri thức.
  - **Phiên Ôn Tập Karuta**: Khắc họa tinh thần kiên cường bất khuất trước Sóng thần Kanagawa (*The Great Wave*) và nghi thức hoàn thành Daruma mở mắt dưới ánh thái dương Hinomaru.

---

### 1.2. Phạm vi Công việc (In-Scope Deliverables)
1. **Quản lý & Tối ưu hóa Tài nguyên Tĩnh**:
   - Nhập khẩu và chuẩn hóa 13 tác phẩm nghệ thuật từ `C:\Users\ThinkPad X1\Pictures\collection` vào thư mục `public/assets/art/` với định danh ngữ nghĩa rõ ràng.
2. **Nâng cấp Giao diện 5 Màn hình Cốt lõi**:
   - **Dashboard (`/`)**: Hero Panorama văn hóa Nhật, dải sóng vàng Kin-nami phân cách, thẻ Bento Kifuda chìm hoa văn.
   - **Cards Library (`/cards`)**: Dòng chảy sông chàm Ryusui sau Quick Study Banner, watermark hoa anh đào dát vàng trên từng thẻ Karuta.
   - **AI Copilot Desk (`/cards/new`)**: Tranh cuộn thư phòng Kakejiku Hokusai Phú Sĩ & Hạc trắng, mây vàng Kasumi.
   - **Karuta Review (`/review`)**: Viền thẻ hoa văn dệt Rinpa, màn hình hoàn thành 100% búp bê Daruma đứng trước Sóng thần Kanagawa cô lập.
   - **Integrations (`/integrations`)**: Nền gấm cá Koi Nishikigoi Yuzen biểu trưng cho sự trôi chảy của dữ liệu đám mây.
3. **Thành phần Tái sử dụng (Reusable Visual Components)**:
   - Xây dựng component `JapaneseArtBackdrop` kiểm soát `opacity`, `mix-blend-mode`, `object-fit`, và `z-index` để tranh ảnh hòa quyện tự nhiên vào nền giấy Washi mà không làm mờ chữ hay cản trở thao tác đọc.

---

### 1.3. Giới hạn Cấm kỵ (Out-of-Scope / Non-Goals)
- ❌ **KHÔNG thay đổi cấu trúc bảng cơ sở dữ liệu**: Bảng `decks`, `cards`, `review_logs` giữ nguyên 100%.
- ❌ **KHÔNG sửa đổi thuật toán FSRS hay API contracts**: Giữ nguyên logic tính toán DSR, endpoint `/api/review`, `/api/cards`.
- ❌ **KHÔNG gây suy giảm hiệu năng trang web (Performance Guard)**:
  - Tất cả ảnh lớn làm background phải dùng kỹ thuật lớp phủ `pointer-events: none;`, `opacity: 0.15 - 0.35` để bảo đảm độ tương phản chữ đạt chuẩn **WCAG 2.1 AA (tối thiểu 4.5:1)**.
  - Sử dụng Next.js `<Image>` với các thuộc tính `priority` cho Hero và `loading="lazy"` cho các khu vực cuộn trang.

---

### 1.4. Tiêu chuẩn Hoàn thành Thẩm mỹ (Aesthetic Definition of Done - A-DoD)
1. **Hòa sắc hoàn hảo**: 100% ảnh tư liệu được hòa trộn hài hòa với nền giấy Washi (`#FAF8F5`) qua các hiệu ứng `mix-blend-mode: multiply` hoặc `overlay`.
2. **Không che khuất nội dung**: Văn bản, Furigana, và Pitch Accent luôn nổi bật trên lớp nền, không bị hoa văn làm rối mắt.
3. **Mượt mà 60 FPS**: Tải trang nhanh, cuộn mượt mà, không giật lag trên cả màn hình di động và máy tính bàn.
4. **Kiểm tra tự động**: Vượt qua `npx tsc --noEmit`, `npm run test`, `npm run build` với exit code 0.

---

# 🖼️ TẦNG 2: BẢN ĐỒ TÍCH HỢP TƯ LIỆU HÌNH ẢNH (COLLECTION ASSET CATALOG & PAGE MAPPING)

### 2.1. Danh mục 13 Tác phẩm trong `public/assets/art/`

| Mã Tư liệu | Tên Tác phẩm & Mô-típ Nghệ thuật | Phong cách & Tác giả | Tỉ lệ Khung hình | Ý nghĩa Văn hóa & Ứng dụng |
| :---: | :--- | :--- | :---: | :--- |
| **ART-01** | `hokusai-suwa-lake.jpg`<br>*(Hồ Suwa tỉnh Shinano)* | Mộc bản Ukiyo-e<br>(Katsushika Hokusai) | 3:2 ngang | Túp lều tranh giữa hai cây thông cổ ngắm núi Phú Sĩ. Biểu trưng cho trà thất học tập thanh tịnh. |
| **ART-02** | `great-wave-isolated.webp`<br>*(Sóng thần Kanagawa cô lập)* | Mộc bản Ukiyo-e cao cấp<br>(Nền trắng cô lập) | 3:2 ngang | Sóng cuộn dũng mãnh và núi Phú Sĩ. Dùng làm phông nền vinh danh khải hoàn khi hoàn thành phiên học FSRS. |
| **ART-03** | `koi-peony-yuzen.jpg`<br>*(Cá Koi & Hoa Mẫu Đơn)* | Gấm lụa dệt Yuzen<br>(Đỏ son, vàng, chàm) | 16:9 ngang | Đàn cá chép Nishikigoi vượt sóng hoa mẫu đơn. Biểu trưng cho sự hanh thông, trôi chảy của dữ liệu Google Workspace. |
| **ART-04** | `ryusui-indigo-stream.jpg`<br>*(Dòng sông Chàm Ryusui)* | Phong cách Ogata Korin<br>(Thủy mặc lam & bụi vàng) | 2:1 ngang | Dòng nước uốn lượn mang theo tri thức bất tận. Dùng làm dải trang trí sau thanh Quick Study Banner. |
| **ART-05** | `rinpa-gold-waves-clouds.jpg`<br>*(Sóng Vàng & Mây Gấm Rinpa)* | Trường phái Rinpa cổ điển<br>(Dát vàng & gấm hoa) | 16:9 banner | Sóng bạc mây vàng cung đình. Dùng làm nền viền sang trọng cho các thẻ bài thành tựu. |
| **ART-06** | `gold-sakura-washi.jpg`<br>*(Cành Anh Đào Nét Vàng Washi)* | Nét chỉ vàng trên giấy Dó<br>(Seamless Pattern) | 2:1 lặp lại | Hoa anh đào thanh tao nét mảnh. Dùng làm hoa văn chìm cho mặt sau thẻ bài và nền trang thư viện. |
| **ART-07** | `cloud-mist-kasumi-icons.jpg`<br>*(Bộ Mây Kumo & Gió Kasumi)* | Biểu tượng Thần Đạo<br>(Vàng trên nền đỏ Torii) | 16:9 sprite | Các cụm mây xoắn và dải sương gió. Dùng làm họa tiết trang trí góc thẻ, badge trạng thái và vạch ngăn cách. |
| **ART-08** | `japanese-cultural-panorama.jpg`<br>*(Toàn cảnh Văn hóa Trà đạo)* | Tranh minh họa màu nước<br>(Chùa, Torii, Trà thất, Phú Sĩ) | 2:1 panorama | Bức tranh tổng thể về văn hóa trà đạo, cầu son và cổng Torii. Hoàn hảo cho Hero Banner Trang chủ. |
| **ART-09** | `hokusai-cranes-fuji.jpg`<br>*(Hạc trắng Umezawa & Phú Sĩ)* | Mộc bản Ukiyo-e<br>(Katsushika Hokusai) | 3:2 ngang | Đàn hạc trắng Tancho bên bờ nước hướng về đỉnh Phú Sĩ mây hồng. Biểu trưng cho sự uyên bác, kiên nhẫn khi soạn thẻ. |
| **ART-10** | `golden-waves-kin-nami.jpg`<br>*(Sóng Vàng Cuộn Trào Kin-nami)* | Tranh sơn mài dát vàng<br>(Nền chàm đen & sóng vàng) | 4:1 siêu rộng | Dải sóng vàng uốn lượn tráng lệ. Dùng làm thanh dải phân cách giữa các phân đoạn trang. |
| **ART-11** | `kohaku-koi-pond.jpg`<br>*(Cá Koi Kohaku & Bụi Vàng Kintsugi)* | Nghệ thuật Đương đại<br>(Cá chép trắng đỏ dát vàng) | 2.5:1 ngang | Chú cá chép Kohaku bơi giữa làn sóng gốm lam và bụi vàng. Dùng làm điểm nhấn cho thẻ điều ước Ema. |
| **ART-12** | `hokusai-great-wave-classic.jpg`<br>*(Bản gốc Bảo tàng Sóng Thần)* | Mộc bản Ukiyo-e nguyên bản<br>(Có thuyền nan & triện chữ) | 4:3 cổ điển | Bản khắc gỗ bảo tàng đầy đủ triện chữ Hokusai. Dùng làm tư liệu minh họa lịch sử và văn hóa. |
| **ART-13** | `night-golden-waves.jpg`<br>*(Sóng Vàng Trời Đêm Mây Sao)* | Thủy mặc hiện đại<br>(Trời đêm, mây cuộn, sao vàng) | 3:2 ngang | Không gian đêm trầm mặc, sâu lắng. Dùng cho chế độ học đêm hoặc thẻ bài cao độ Pitch Accent. |

---

### 2.2. Ma trận Ánh xạ Tư liệu vào 5 Màn hình (Page Mapping Matrix)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        MA TRẬN ÁNH XẠ TƯ LIỆU VÀO CÁC MÀN HÌNH                          │
├──────────────────────────┬─────────────────────────────┬───────────────────────────────┤
│ MÀN HÌNH / COMPONENT     │ TƯ LIỆU NGHỆ THUẬT ÁP DỤNG  │ VỊ TRÍ & PHƯƠNG THỨC XỬ LÝ    │
├──────────────────────────┼─────────────────────────────┼───────────────────────────────┤
│ 1. Trang chủ (Honmaru)   │ • ART-08 (Cultural Panorama)│ Nền Hero Banner (opacity 0.25,│
│    src/app/page.tsx      │ • ART-10 (Golden Waves)     │ Dải phân cách giữa section,   │
│                          │ • ART-11 (Kohaku Koi)       │ Nền mờ cho 3 thẻ điều ước Ema │
├──────────────────────────┼─────────────────────────────┼───────────────────────────────┤
│ 2. Thư viện Thẻ          │ • ART-04 (Ryusui Stream)    │ Dải uốn lượn sau Quick Study, │
│    src/app/cards/page.tsx│ • ART-06 (Gold Sakura Washi)│ Watermark nền giấy từng thẻ   │
├──────────────────────────┼─────────────────────────────┼───────────────────────────────┤
│ 3. Soạn Thẻ AI Copilot   │ • ART-09 (Hokusai Cranes)   │ Tranh cuộn Kakejiku thư phòng,│
│    src/app/cards/new/    │ • ART-07 (Cloud Kasumi)     │ Huy hiệu phân tích hạc Orizuru│
├──────────────────────────┼─────────────────────────────┼───────────────────────────────┤
│ 4. Ôn tập Karuta         │ • ART-02 (Great Wave Isol.) │ Nền chúc mừng Daruma 100%,    │
│    src/app/review/       │ • ART-05 (Rinpa Waves/Cloud)│ Viền hoa văn mặt sau thẻ bài  │
├──────────────────────────┼─────────────────────────────┼───────────────────────────────┤
│ 5. Tiện ích Đám Mây      │ • ART-03 (Koi-Peony Yuzen)  │ Lớp phủ dệt gấm cho khu vực   │
│    src/app/integrations/ │                             │ đồng bộ Google Sheets/Calendar│
└──────────────────────────┴─────────────────────────────┴───────────────────────────────┘
```

---

# 📐 TẦNG 3: ĐỐI CHIẾU THIẾT KẾ & BẢN THIẾT KẾ MỚI TỪNG MÀN HÌNH

### 3.1. Trang chủ Dashboard (`src/app/page.tsx`)

#### A. Đối chiếu Thiết kế (Benchmarking)
- **Hiện trạng**: Hero Banner hiện tại sử dụng nền CSS Seigaiha phẳng màu xanh `#88A752`. Dù màu sắc chuẩn, nhưng tổng thể phẳng (flat design) và thiếu chiều sâu văn hóa hữu cơ.
- **Bản thiết kế mới (Redesign)**:
  - **Hero Banner Trà Thất Toàn Cảnh**: Lồng ghép bức tranh toàn cảnh văn hóa trà đạo Nhật Bản (**ART-08**) làm lớp nền phía sau với độ mờ tinh tế (`opacity: 0.28`, `mix-blend-mode: overlay`). Núi Phú Sĩ, ngôi chùa 5 tầng, cầu son và người gánh lá trà sẽ ẩn hiện sống động sau dòng chữ chào mừng.
  - **Dải Sóng Vàng Phân Cách (Kin-nami Divider)**: Giữa Hero Banner và thanh tiến độ Daruma, chèn dải sóng vàng cuộn trào uốn lượn (**ART-10**) cao 48px với mặt nạ mờ dần 2 đầu (`mask-image: linear-gradient(...)`), tạo sự chuyển tiếp tự nhiên giữa các phân đoạn.
  - **Thẻ Điều Ước Ema Đạt Chuẩn Mỹ Học**: Lồng ghép hoa văn cá chép Kohaku dát vàng (**ART-11**) mờ ảo vào góc thẻ thống kê tỉ lệ ghi nhớ (Retention Rate 90%).

---

### 3.2. Trang Quản lý Thẻ (`src/app/cards/page.tsx`)

#### A. Đối chiếu Thiết kế (Benchmarking)
- **Hiện trạng**: Quick Study Banner và bảng thẻ bài hiện dùng màu nền trắng xám đơn thuần, chưa gợi lên cảm giác của một kho tàng lưu trữ thơ ca hay tờ rơi quảng cáo cổ Hikifuda.
- **Bản thiết kế mới (Redesign)**:
  - **Dòng Chảy Sông Chàm Ryusui (ART-04)**: Tích hợp dải dòng sông Ryusui uốn lượn chạy ngang phía sau Quick Study Banner, tạo cảm giác người học đang cưỡi trên dòng chảy bất tận của tri thức từ vựng.
  - **Mặt Thẻ Giấy Dó Dát Vàng (ART-06)**: Mặt nền của từng thẻ bài Karuta trong danh sách được phủ lớp hoa văn cành hoa anh đào nét chỉ vàng siêu thanh nhã (`opacity: 0.12`). Khi rê chuột (hover), hoa văn sáng nhẹ lên tạo cảm giác thẻ giấy thủ công bắt sáng.

---

### 3.3. Trang Soạn Thẻ AI Copilot (`src/app/cards/new/page.tsx`)

#### A. Đối chiếu Thiết kế (Benchmarking)
- **Hiện trạng**: Trang soạn thẻ có hoạt họa hạc giấy Orizuru bằng CSS nhưng chưa gian phòng viết còn trống trải, thiếu chiều sâu của một "Thư phòng Thư đạo (Shodo Desk)".
- **Bản thiết kế mới (Redesign)**:
  - **Tranh Cuộn Kakejiku Phú Sĩ & Hạc Trắng (ART-09)**: Phía trên bàn viết thư đạo, đặt một bức tranh cuộn thủy mặc Hokusai vẽ đàn hạc trắng bay về núi Phú Sĩ được đóng khung nẹp gỗ truyền thống. Bức tranh này đóng vai trò như bảo chứng tinh thần cho sự thông tuệ và kiên nhẫn.
  - **Đám Mây Vàng Kasumi (ART-07)**: Khi AI đang suy nghĩ phân tích câu chữ, các cụm mây vàng Kasumi sẽ lướt nhẹ quanh biểu tượng hạc giấy Orizuru.

---

### 3.4. Trang Ôn Tập Karuta Active Recall (`src/app/review/page.tsx`)

#### A. Đối chiếu Thiết kế (Benchmarking)
- **Hiện trạng**: Màn hình hoàn thành bài học hiện tại chỉ có búp bê Daruma trên nền trơn, chưa tạo được cảm xúc thăng hoa (climax) tột đỉnh sau khi vượt qua thử thách ôn tập.
- **Bản thiết kế mới (Redesign)**:
  - **Phông Nền Sóng Thần Khải Hoàn (ART-02)**: Khi học sinh hoàn thành toàn bộ 100% số thẻ của phiên học, màn hình chúc mừng Daruma sẽ mở ra trên phông nền bức tranh **Sóng thần Kanagawa cô lập (ART-02)** kết hợp với vầng thái dương đỏ Hinomaru rực rỡ phía sau! Búp bê Daruma 2 mắt mở to đứng hiên ngang trước ngọn sóng cuộn trào — tượng trưng cho ý chí người học đã chinh phục thành công ngọn sóng tri thức.
  - **Họa Tiết Gấm Dệt Rinpa (ART-05)**: Mặt sau thẻ Karuta khi lật mở có viền sóng vàng và mây gấm mờ ở chân thẻ, làm tôn lên câu ví dụ $i+1$ và đồ thị Pitch Accent.

---

### 3.5. Trang Tiện ích Google Workspace (`src/app/integrations/page.tsx`)

#### A. Đối chiếu Thiết kế (Benchmarking)
- **Hiện trạng**: Giao diện kết nối Google Sheets/Calendar mang tính công nghệ cao nhưng chưa có sự hòa quyện với phong cách Nhật Bản truyền thống.
- **Bản thiết kế mới (Redesign)**:
  - **Lớp Phủ Dệt Gấm Cá Koi Yuzen (ART-03)**: Sử dụng mảng hoa văn cá Koi đỏ bơi lội giữa hoa mẫu đơn và sóng nước làm hình nền mờ (`opacity: 0.15`, `mix-blend-mode: multiply`) phía sau các khối thẻ dịch vụ Google, biểu trưng cho sự lưu thông may mắn và dữ liệu đồng bộ thông suốt giữa thiết bị người dùng và đám mây.

---

# 🔨 TẦNG 4: DANH MỤC CÁC ĐƠN VỊ CÔNG VIỆC NGUYÊN TỬ (ATOMIC REDESIGN TASKS)

> Dưới đây là các đơn vị công việc được phân rã đến cấp độ nhỏ nhất không thể chia nhỏ hơn. Mỗi task chỉ rõ: File can thiệp, đoạn mã cần chèn, thông số CSS chính xác từng pixel và cơ chế an toàn.

---

### 📦 Nhóm Task 4.1: Tạo Component Lớp Phủ Mỹ Thuật Dùng Chung (`JapaneseArtBackdrop`)

- **File đích**: `src/components/japanese/JapaneseArtBackdrop.tsx` (Component mới hoàn toàn).
- **Mục tiêu**: Tạo component đóng gói logic hiển thị tranh nghệ thuật với Next.js `<Image>`, kiểm soát độ mờ, chế độ hòa trộn màu, và đảm bảo không chặn sự kiện chuột (`pointer-events: none`).
- **Mã nguồn thiết kế chi tiết**:
  ```tsx
  import Image from 'next/image';

  interface JapaneseArtBackdropProps {
    src: string;
    alt: string;
    opacity?: number;
    blendMode?: 'multiply' | 'overlay' | 'soft-light' | 'screen' | 'normal';
    objectFit?: 'cover' | 'contain';
    objectPosition?: string;
    className?: string;
  }

  export function JapaneseArtBackdrop({
    src,
    alt,
    opacity = 0.2,
    blendMode = 'multiply',
    objectFit = 'cover',
    objectPosition = 'center',
    className = '',
  }: JapaneseArtBackdropProps) {
    return (
      <div
        className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
        style={{ zIndex: 1 }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          style={{
            objectFit,
            objectPosition,
            opacity,
            mixBlendMode: blendMode,
          }}
          priority={false}
        />
      </div>
    );
  }
  ```

---

### 📦 Nhóm Task 4.2: Nâng cấp Trang chủ Dashboard (`src/app/page.tsx`)

#### Task 4.2.1: Chèn Bức Tranh Toàn Cảnh Văn Hóa Trà Đạo vào Hero Banner
- **File can thiệp**: `src/app/page.tsx`.
- **Thao tác**: Trong section Hero Banner (`className="wagara-seigaiha-matcha"`), chèn component `JapaneseArtBackdrop`:
  ```tsx
  <JapaneseArtBackdrop
    src="/assets/art/japanese-cultural-panorama.jpg"
    alt="Toàn cảnh văn hóa Nhật Bản và Phú Sĩ"
    opacity={0.24}
    blendMode="overlay"
    objectPosition="center 35%"
  />
  ```
- **Tiêu chuẩn kiểm định**: Dòng chữ "Học sâu Nhớ lâu cùng FSRS" và nút "Ôn tập toàn bộ ngẫu nhiên" giữ nguyên độ sắc nét; bức tranh hòa sắc mượt mà với nền xanh Matcha Seigaiha.

#### Task 4.2.2: Thêm Dải Phân Cách Sóng Vàng Kin-nami
- **File can thiệp**: `src/app/page.tsx`.
- **Thao tác**: Giữa Hero Banner và Khu vực Tiến độ Daruma, chèn một khối dải sóng vàng uốn lượn cao 40px:
  ```tsx
  <div
    style={{
      height: '42px',
      margin: '-1rem 0 2rem',
      borderRadius: '999px',
      overflow: 'hidden',
      position: 'relative',
      boxShadow: 'var(--shadow-washi-sm)',
    }}
  >
    <Image
      src="/assets/art/golden-waves-kin-nami.jpg"
      alt="Dải sóng vàng Kin-nami"
      fill
      style={{ objectFit: 'cover', opacity: 0.85 }}
    />
  </div>
  ```

---

### 📦 Nhóm Task 4.3: Nâng cấp Thư viện Thẻ (`src/app/cards/page.tsx`)

#### Task 4.3.1: Lồng ghép Dòng Sông Ryusui vào Quick Study Banner
- **File can thiệp**: `src/app/cards/page.tsx`.
- **Thao tác**: Trong khối `selectedDeck !== 'all'`, đặt thuộc tính `position: 'relative'` và chèn ảnh dòng chảy:
  ```tsx
  <JapaneseArtBackdrop
    src="/assets/art/ryusui-indigo-stream.jpg"
    alt="Dòng sông Ryusui chàm"
    opacity={0.18}
    blendMode="multiply"
    objectPosition="right center"
  />
  ```

#### Task 4.3.2: Thêm Watermark Hoa Anh Đào Dát Vàng vào Bảng Thẻ
- **File can thiệp**: `src/app/cards/page.tsx`.
- **Thao tác**: Áp dụng ảnh nền hoa anh đào lặp lại mờ ảo cho khối bảng thẻ:
  ```tsx
  backgroundImage: 'url("/assets/art/gold-sakura-washi.jpg")',
  backgroundSize: '360px',
  backgroundRepeat: 'repeat',
  backgroundBlendMode: 'soft-light',
  ```

---

### 📦 Nhóm Task 4.4: Nâng cấp Trang Soạn Thẻ AI Copilot (`src/app/cards/new/page.tsx`)

#### Task 4.4.1: Bổ sung Bức Tranh Cuộn Thư Phòng Kakejiku
- **File can thiệp**: `src/app/cards/new/page.tsx`.
- **Thao tác**: Phía trên khung nhập từ vựng duy nhất, tạo một khung tranh cuộn truyền thống có nẹp gỗ:
  ```tsx
  <div className="kakejiku-scroll-frame" style={{ borderRadius: '12px', overflow: 'hidden', height: '140px', position: 'relative', marginBottom: '1.5rem', border: '2px solid var(--washi-border)' }}>
    <Image
      src="/assets/art/hokusai-cranes-fuji.jpg"
      alt="Tranh mộc bản Hokusai Hạc trắng ngắm núi Phú Sĩ"
      fill
      style={{ objectFit: 'cover', objectPosition: 'center 40%', opacity: 0.88 }}
    />
    <div style={{ position: 'absolute', bottom: '0.5rem', right: '0.75rem', background: 'rgba(255, 255, 255, 0.85)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontFamily: 'var(--font-mincho)', color: 'var(--sumi-ink)' }}>
      富嶽三十六景 · 相州梅沢庄 (Hokusai)
    </div>
  </div>
  ```

---

### 📦 Nhóm Task 4.5: Nâng cấp Trang Ôn tập Karuta (`src/app/review/page.tsx`)

#### Task 4.5.1: Màn hình Khải hoàn Daruma & Sóng Thần Hokusai
- **File can thiệp**: `src/app/review/page.tsx`.
- **Thao tác**: Trong khối `if (isCompleted)`, đặt ảnh Sóng thần Kanagawa cô lập (**ART-02**) làm hình nền trung tâm phía sau búp bê Daruma:
  ```tsx
  <div style={{ position: 'relative', overflow: 'hidden', padding: '3.5rem 2rem' }}>
    <div style={{ position: 'absolute', inset: 0, opacity: 0.16, pointerEvents: 'none' }}>
      <Image
        src="/assets/art/great-wave-isolated.webp"
        alt="Sóng thần Kanagawa khải hoàn"
        fill
        style={{ objectFit: 'contain', objectPosition: 'center' }}
      />
    </div>
    {/* Nội dung Daruma và số điểm giữ nguyên */}
  </div>
  ```

---

# 🧪 TẦNG 5: MA TRẬN KIỂM THỬ THẨM MỸ & TIÊU CHUẨN NGHIỆM THU

### 5.1. Bảng 10 Tiêu chí Nghiệm thu Thẩm mỹ (Aesthetic Test Matrix)

| Test ID | Hạng mục Kiểm tra | Tiêu chí Đạt (Pass Criteria) | Đánh giá |
| :---: | :--- | :--- | :---: |
| **A-TC-01** | Hero Panorama hiển thị đúng tỉ lệ | Ảnh Panorama (ART-08) hiển thị rõ nét núi Phú Sĩ, không bị méo tỉ lệ (cover mode). | Pass / Fail |
| **A-TC-02** | Độ tương phản chữ trên Hero | Chữ trắng trên nền xanh Matcha đạt độ tương phản $> 4.5:1$ đo bằng công cụ Lighthouse/WCAG. | Pass / Fail |
| **A-TC-03** | Dải sóng vàng Kin-nami liền mạch | Ảnh sóng vàng (ART-10) tải không bị giật, bo viền 999px mềm mại. | Pass / Fail |
| **A-TC-04** | Dòng chảy Ryusui trên Cards Library | Banner Quick Study hiển thị dòng chảy uốn lượn mờ (ART-04), không che lấp nút "Bắt đầu học". | Pass / Fail |
| **A-TC-05** | Nền hoa anh đào không gây rối mắt | Nền Washi bảng thẻ hiển thị nét vàng chìm (ART-06), đọc chữ Kanji và nghĩa tiếng Việt 100% rõ ràng. | Pass / Fail |
| **A-TC-06** | Tranh cuộn Kakejiku trên AI Copilot | Khung tranh Hạc trắng Phú Sĩ (ART-09) hiển thị nẹp viền gỗ sang trọng, chú thích tranh tinh tế. | Pass / Fail |
| **A-TC-07** | Màn hình hoàn thành Karuta ấn tượng | Daruma 100% nổi bật trước Sóng thần Kanagawa (ART-02) và chuông đền Suzu ngân vang. | Pass / Fail |
| **A-TC-08** | Không có sự cố Layout Shift (CLS = 0) | Tất cả các ảnh nền đều dùng `fill` hoặc có kích thước cố định, Cumulative Layout Shift $= 0$. | Pass / Fail |
| **A-TC-09** | Tương thích Responsive trên Mobile | Trên màn hình điện thoại (dưới 640px), các hình nền tự động co giãn và giảm độ mờ phù hợp. | Pass / Fail |
| **A-TC-10** | Tính toàn vẹn của mã nguồn | Chạy `npx tsc --noEmit && npm run test && npm run build` đạt 100% exit code 0. | Pass / Fail |

---

### 5.2. Bộ Lệnh Kiểm định Tự động
```bash
# 1. Kiểm tra an toàn kiểu dữ liệu TypeScript
npx tsc --noEmit

# 2. Chạy toàn bộ 19 Unit Tests
npm run test

# 3. Biên dịch Production Build của Next.js (Xác thực nạp tài nguyên tĩnh public/assets/art/)
npm run build
```

---

# 🎌 BẢN KẾ HOẠCH NÀY ĐÃ SẴN SÀNG CHO BƯỚC THỰC THI
*Toàn bộ 13 tệp tư liệu tranh ảnh đã được chuẩn bị đầy đủ trong `public/assets/art/`. Bất kỳ kỹ sư nào tiếp nhận cũng có thể mở tài liệu này và lần lượt thực hiện các nhiệm vụ tại **Tầng 4** để tạo nên một kiệt tác giao diện Nhật Bản.*
