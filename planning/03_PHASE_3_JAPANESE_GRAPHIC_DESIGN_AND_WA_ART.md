# 🌊 GIAI ĐOẠN 3: GIẢI MÃ ĐỒ HỌA NHẬT BẢN HIỆN ĐẠI & TÍCH HỢP HỘI HỌA TRUYỀN THỐNG (AUTHENTIC WA-ART)
## Hệ Thống: Japanese SRS System (記憶道 FSRS) · Bản Quy Hoạch Hợp Nhất (Consolidated Specification)

> **Thông tin tổng hợp:**
> * **Giai đoạn:** Phase 3 (Sprints 6-7)
> * **Tệp nguồn hợp nhất:** `11_JAPANESE_GRAPHIC_DESIGN_DECONSTRUCTION.md`, `12_AUTHENTIC_WA_ART_REDESIGN_MASTER_PLAN.md` (2 tệp)
> * **Trọng tâm kỹ thuật:** Phong cách Wa-Modern Bento Grid, Bảng màu Đỏ son - Chàm Aizome - Giấy Washi, Cấu trúc lưới tranh khắc gỗ mộc bản, Bố cục Typography trục kép (Tate/Yoko-gaki), Phân bổ 13 tác phẩm Ukiyo-e, Rinpa và Yuzen vào 5 màn hình hệ thống.
> * **Cam kết cốt lõi:** Lớp hình nền tối ưu hiệu năng (opacity 0.08 - 0.15, mix-blend-mode multiply), hoàn toàn không cản trở khả năng đọc (Legibility).

---

### 📑 MỤC LỤC TỔNG QUAN GIAI ĐOẠN 3
1. [phần 1: giải mã chuyên sâu phong cách thiết kế đồ họa nhật bản hiện đại (graphic design deconstruction)](#phan-1)
2. [phần 2: kế hoạch tái thiết kế tích hợp tranh nghệ thuật & văn hóa nhật bản (authentic wa-art master plan)](#phan-2)

---

<a id="phan-1"></a>
# PHẦN 1: PHẦN 1: GIẢI MÃ CHUYÊN SÂU PHONG CÁCH THIẾT KẾ ĐỒ HỌA NHẬT BẢN HIỆN ĐẠI (GRAPHIC DESIGN DECONSTRUCTION)
*Tệp gốc: `doc\11_JAPANESE_GRAPHIC_DESIGN_DECONSTRUCTION.md`*

---

## 🎴 TÀI LIỆU 11: GIẢI MÃ PHONG CÁCH THIẾT KẾ ĐỒ HỌA NHẬT BẢN (JAPANESE GRAPHIC DESIGN DECONSTRUCTION)
### Nguồn phân tích: `C:\Users\ThinkPad X1\Pictures\japanese-graphic-design`
### Đối tượng nghiên cứu: `ac59704353e2214f4764c662ccac6dca.jpg` & `Презenтация - Японская реклама.jpg`
### Ứng dụng: Chuẩn hóa Visual Language & Design System cho Japanese SRS System

---

> [!IMPORTANT]
> Tài liệu này là bản **Nghiên cứu Sâu (Deep Research & Visual Deconstruction)** bóc tách toàn diện ngữ pháp thị giác, triết lý mỹ học, bảng màu truyền thống, hệ thống lưới Bento, nghệ thuật Typography kép, và các biểu tượng văn hóa từ tập tư liệu đồ họa Nhật Bản. Toàn bộ các quy tắc này được chuyển hóa trực tiếp thành thông số kỹ thuật (Tokens, CSS, SVG) để áp dụng vào hệ thống SRS.

---

## ⛩️ PHẦN 1: BẢN CHẤT TRƯỜNG PHÁI & TRIẾT LÝ THIẾT KẾ (DESIGN PHILOSOPHY)

Hai tác phẩm trong thư mục nghiên cứu đại diện cho hai trường phái thiết kế đỉnh cao của Nhật Bản:
1. **Tác phẩm 1 (`ac59704353e2214f4764c662ccac6dca.jpg`)**: Trường phái **Neo-Japonisme / Wa-Modern Bento Grid (和モダン・弁当グリッド)** — Sự kết hợp giữa nghệ thuật mộc bản Ukiyo-e thời Edo với hệ thống lưới thông tin đa giác quan (Multi-layered Modular Information Architecture).
2. **Tác phẩm 2 (`Презентация - Японская реклама.jpg`)**: Trường phái **Edo-Meiji-Taisho Retro-Futurism & Showa Modernism (大正ロマン・昭和レトロ広告)** — Lịch sử đồ họa quảng cáo Nhật Bản từ rèm Noren, tờ rơi Hikifuda, mỹ thuật Taisho Roman (giao thoa Art Nouveau/Art Deco) cho đến thiết kế bao bì tối giản đương đại.

#### 4 Nguyên lý Mỹ học Cốt lõi được Bộc lộ:
1. **Fukinsei (不均斉 - Cân bằng Bất đối xứng)**:
   - Các bố cục không bao giờ đối xứng gương cứng nhắc theo kiểu Tây Âu. Thay vào đó, một khối tròn đỏ rực (*Hinomaru*) luôn được đặt lệch góc (asymmetrical offset), tràn mép khung (bleed), tạo nên một trọng tâm thị giác năng động nhưng tĩnh tại.
2. **Ma (間 - Khoảng lặng Nhận thức)**:
   - Khoảng trắng trong thiết kế Nhật không phải là khoảng trống vô nghĩa mà là "khoảng thở" (*Negative Space*). Trong các slide quảng cáo, văn bản được dồn về một phía để nhường không gian cho cành hoa mận mực tàu (*Ume*) hoặc bóng hình chim hạc (*Tancho-zuru*).
3. **Kanso & Shitsurai (簡素と室礼 - Tinh giản & Bày trí Trang nghiêm)**:
   - Mọi khối hộp đều có viền mảnh (hairline border) tinh tế như thanh nan tre trong phòng trà Chashitsu. Mỗi thông tin đều được đóng khung gọn gàng như một món ăn trong khay cơm Bento.
4. **Yugen & Wabi-Sabi (幽玄と侘寂 - Chiều sâu Thâm trầm & Hồn cốt Thời gian)**:
   - Sử dụng nền giấy có vân hạt thô mộc (Washi paper grain), kết hợp tranh khắc gỗ cổ với các đường dóng kỹ thuật hiện đại.

---

## 🎨 PHẦN 2: BẢNG MÀU CHỮ KÝ (THE SIGNATURE COLOR PALETTE)

Phân tích mã màu hex trích xuất trực tiếp từ các tư liệu hình ảnh:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                      HỆ BẢNG MÀU TRUYỀN THỐNG NHẬT BẢN (NIPPON CHROMATIC SYSTEM)        │
├───────────────────┬───────────────────┬───────────────────┬────────────────────────────┤
│ 1. ĐỎ MẶT TRỜI    │ 2. XANH CHÀM GỐM  │ 3. NỀN GIẤY DÓ    │ 4. MỰC TÀU THƯ PHÁP        │
│    (Shu / Hinomaru)│    (Aizome / Gosu)│    (Kinari Washi) │    (Sumi Black)            │
│    #D9381E / #E63946│    #1D4ED8 / #1E3A8A│    #FAF6EE / #F5F2EB│    #1F2421 / #262626       │
└───────────────────┴───────────────────┴───────────────────┴────────────────────────────┘
```

#### 1. Sắc Đỏ Mặt Trời / Cổng Torii (Shu-iro · 朱色 & Hinomaru Red)
- **Mã màu chính**: `#E63946` / `#D9381E` / `#C82333`.
- **Vai trò**: Màu nhấn tối cao (*Primary Accent*). Xuất hiện trên:
  - Vòng tròn mặt trời mọc khổng lồ đặt lệch ở góc các slide.
  - Tiêu đề chính viết hoa (`JAPANESE GRAPHIC DESIGN`, `JAPAN`, `CONTENT`).
  - Con dấu son Inkan, nhãn thẻ đóng khung, hoa văn dệt Asanoha.
  - Phụ kiện búi tóc của thiếu nữ Nhật (*Kanzashi*), viền áo Kimono.

#### 2. Sắc Xanh Chàm Sứ Cổ / Biển Sâu (Aizome · 藍染 & Gosu Blue · 呉須)
- **Mã màu chính**: `#1E3A8A` / `#1D4ED8` / `#2563EB`.
- **Vai trò**: Màu đối trọng (*Counter-balance Contrast*). Tạo nên sự tương phản kinh điển Red-Indigo (Đỏ son - Xanh chàm) thường thấy trong gốm sứ Arita và tranh Ukiyo-e của Hokusai:
  - Sóng lừng Kanagawa (*The Great Wave*).
  - Viền khung viền hoa văn mây cuộn (*Karakusa Border*).
  - Khối tóc, nếp gấp áo Kimono của nhân vật.
  - Số thứ tự đề mục (`1`, `2`, `3`).

#### 3. Sắc Nền Giấy Dó / Vải Mộc (Kinari Washi · 生成り色 & Torinoko · 鳥の子)
- **Mã màu chính**: `#FAF6EE` (Ấm) / `#ECEEEF` (Xám tro Washi).
- **Vai trò**: Nền tảng không gian (*Canvas Base*). Loại bỏ hoàn toàn màu trắng tinh cơ khí `#FFFFFF`, thay bằng bề mặt giấy xơ ấm áp, giảm thiểu 80% độ chói lóa mắt khi đọc tài liệu lâu.

#### 4. Sắc Mực Than Thư Pháp (Sumi-iro · 墨色)
- **Mã màu chính**: `#1F2421` (Đậm) / `#4B5563` (Mực mài vừa).
- **Vai trò**: Hiển thị văn bản nội dung, chú thích ngữ âm Furigana, và các nét vẽ cành mai thủy mặc.

---

## 🍱 PHẦN 3: CẤU TRÚC HỆ LƯỚI & KHUNG BENTO (BENTO GRID MODULAR SYSTEM)

Hình ảnh `ac59704353e2214f4764c662ccac6dca.jpg` là một ví dụ mẫu mực về **Hệ lưới Bento Nhật Bản (Japanese Bento Architecture)**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                     TIÊU ĐỀ GRAND RED HEADER                           │
├───────────────────────────────────┬────────────────────────────────────┤
│ [ Ô 1: SÓNG THẦN HOKUSAI ]        │ [ Ô 2: CẢM ƠN & ĐÈN LỒNG MATSURI ] │
│   - Tranh mộc bản Kanagawa        │   - Lời cảm ơn tiếng Nhật          │
│   - Thẻ đứng "TITLE" Katakana     │   - Họa tiết đèn lồng lễ hội đỏ xanh│
├───────────────────────────────────┼────────────────────────────────────┤
│ [ Ô 3: MỤC LỤC CHỮ NHẬT ]         │ [ Ô 4: CHÂN DUNG 4 NHÂN VẬT EDO ]  │
│   - Nền hoa văn Seigaiha mờ       │   - 4 khung chân dung Kimono       │
│   - Số thứ tự cách điệu 1, 2, 3   │   - Tên nhân vật cân đối bên dưới  │
├───────────────────────────────────┼────────────────────────────────────┤
│ [ Ô 5: CARD HOA VĂN ASANOHA ĐỎ ]  │ [ Ô 6: TRANH THIẾU NỮ BIJIN-GA ]   │
│   - Nửa trái: Mảng Wagara đỏ      │   - Tranh mỹ nhân Geisha xanh chàm │
│   - Nửa phải: Văn bản thuyết minh │   - Các đường dóng ghi chú kỹ thuật│
├───────────────────────────────────┼────────────────────────────────────┤
│ [ Ô 7: PALETTE 4 MẪU HOA VĂN ]    │ [ Ô 8: THIẾU NỮ NGỒI THƯ ĐẠO ]    │
│   - 4 ô vuông hoa văn xen kẽ      │   - Hình vẽ mực ukiyo-e            │
├───────────────────────────────────┼────────────────────────────────────┤
│ [ Ô 9: CÀNH HOA TRÀ ĐỎ TSUBAKI ]  │ [ Ô 10: TRANH PHONG CẢNH ĐỨNG ]    │
│   - Nét vẽ cành hoa mảnh mai đỏ   │   - Khung tranh đứng Katsushika    │
├───────────────────────────────────┴────────────────────────────────────┤
│ [ HÀNG CUỐI: 3 GIA HUY TRÒN KAMON (家紋) LỒNG HOA ANH ĐÀO SAKURA ]    │
└────────────────────────────────────────────────────────────────────────┘
```

#### Các Đặc điểm Kỹ thuật của Bento Grid:
1. **Hairline Outlines (Đường viền sợi chỉ)**:
   - Mỗi ô được đóng khung bởi viền đơn sắc nét (`border: 1.5px solid #1D4ED8` hoặc `#D9381E`), bán kính bo góc nhẹ (`border-radius: 4px - 8px`), tạo cảm giác thẻ bài thủ công.
2. **Outer Organic Frame (Khung viền uốn lượn bên ngoài)**:
   - Hai dải biên trái và phải của trang giấy được trang trí bằng các hoa văn sóng biển cuộn xoáy và họa tiết mây gốm lam, ôm trọn lấy cấu trúc lưới kỷ luật bên trong.
3. **Phân chia Tỉ lệ Vàng (Golden Ratio Split)**:
   - Các card chia làm 2 nửa: Một bên là mảng hình họa hoặc hoa văn truyền thống đặc sắc, một bên là khối chữ giải nghĩa rõ ràng.

---

## ✍️ PHẦN 4: NGHỆ THUẬT TYPOGRAPHY HỖN HỢP (DUAL-AXIS TYPOGRAPHIC MATRIX)

Tác phẩm thể hiện trình độ bậc thầy trong việc phối trộn các hệ thống chữ viết:

#### 1. Trục Kép: Dọc (Tate-gaki) & Ngang (Yoko-gaki)
- **Chữ ngang (Horizontal)**: Dành cho tiêu đề tiếng Anh, chữ Nga, và các đoạn mô tả hiện đại.
- **Chữ dọc (Vertical)**: Dành cho chữ Hán Kanji, Katakana hoặc con dấu son:
  - Dải nhãn đỏ dọc: `プレゼンテーション` (Presentation) chạy sát mép ô sóng thần.
  - Khung dọc: `日本の広告` (Quảng cáo Nhật Bản) chạy dọc theo thân cành hoa mận.
- **Quy tắc CSS thực thi**:
  ```css
  .text-vertical-japanese {
    writing-mode: vertical-rl;
    text-orientation: upright;
    letter-spacing: 0.15em;
  }
  ```

#### 2. Dáng Chữ Vươn Cao (Condensed High-Waisted Letterforms)
- Tiêu đề `JAPAN` và các dòng chữ trong Image 2 sử dụng kiểu chữ có tỉ lệ chiều cao lớn (condensed / elongated), thanh ngang đưa lên cao (*High Waist*), mô phỏng dáng vươn thẳng của ngôi chùa 5 tầng (*Goju-no-to*) và cổng trời Thần Đạo.

#### 3. Tương phản Thư pháp & Kỷ luật Kỹ thuật (Calligraphy vs Precision)
- Chữ Kanji viết theo bút pháp mộc bản khắc gỗ (*Woodblock Mincho*), giàu tính biểu cảm.
- Đi kèm với các đường dóng thẳng tắp, mũi tên mảnh màu đỏ như bản vẽ kỹ thuật chi tiết cấu tạo kimono.

---

## 🎌 PHẦN 5: BIỂU TƯỢNG VĂN HÓA & MÔ-TÍP KINH ĐIỂN (CULTURAL ICONOGRAPHY)

Trong hai tài liệu hình ảnh, các biểu tượng truyền thống xuất hiện với tần suất và chủ đích rất cao:

| Biểu tượng Văn hóa | Ý nghĩa Biểu trưng | Cách thể hiện trong Đồ họa |
| :--- | :--- | :--- |
| **Vòng tròn Hinomaru (日の丸)** | Mặt trời mọc, nguồn năng lượng sinh mệnh, quốc hồn Nhật Bản | Hình tròn đỏ đơn sắc phẳng, kích thước lớn, đặt lệch tâm góc dưới hoặc góc trên, tạo điểm tựa thị giác vững chãi. |
| **Sóng thần Kanagawa (神奈川沖浪裏)** | Biểu tượng của nghị lực kiên cường vượt qua nghịch cảnh | Tranh khắc gỗ Hokusai với nét vẽ xanh chàm và bọt sóng tung trắng xóa. |
| **Rèm Noren (暖簾)** | Sự hiếu khách, ranh giới giữa ồn ào trần thế và chốn thanh tịnh bên trong | Dải vải xẻ tà treo trước cửa, in con dấu thương hiệu hoặc tranh thủy mặc. |
| **Gia huy Kamon (家紋)** | Danh dự gia tộc, sự gắn kết cội nguồn | Khối tròn đường kính cố định, bên trong lồng nhánh hoa trà hoặc hoa anh đào 5 cánh. |
| **Tranh thiếu nữ Bijin-ga (美人画)** | Vẻ đẹp thanh lịch, chuẩn mực thẩm mỹ cổ điển | Đường nét ukiyo-e thanh mảnh, mái tóc bới cao kiểu Nihongami, điểm xuyết trâm cài son đỏ. |
| **Hạc trắng Tancho (丹頂鶴) & Mai trắng (Ume)** | Sự trường thọ, trí tuệ thanh cao, sự kiên nhẫn vượt mùa đông giá rét | Nét vẽ mực tàu Sumi-e phóng khoáng với mảng loang màu nước tự nhiên. |

---

## 🚀 PHẦN 6: ỨNG DỤNG THỰC CHIẾN VÀO JAPANESE SRS SYSTEM

Từ kết quả nghiên cứu đồ họa chuyên sâu này, chúng ta trích xuất được **5 Nguyên tắc Thiết kế Vàng** để nâng tầm giao diện ứng dụng học tiếng Nhật `japanese-srs-system` lên đẳng cấp mỹ học cao nhất:

#### 1. Chuẩn hóa Bộ Token Màu Sắc (Red-Indigo-Washi Harmony)
Ứng dụng hệ màu tương phản **Đỏ Son Torii (`#D9381E`) + Xanh Chàm Aizome (`#1D4ED8`) + Nền Giấy Dó Washi (`#FAF6EE`)**:
- Thẻ Hán Tự (Kanji Deck): Dùng sắc Đỏ Son Torii (`漢` Inkan Stamp).
- Thẻ Từ Vựng (Vocab Deck): Dùng sắc Xanh Chàm Indigo hoặc Xanh Matcha (`語` Inkan Stamp).
- Nền toàn ứng dụng: Giữ chuẩn giấy Washi mềm mại, loại bỏ hoàn toàn ánh sáng chói cơ học.

#### 2. Thiết kế Thẻ Học theo Phong cách Bento Grid & Tanzaku
- Các thẻ trên Dashboard (`src/app/page.tsx`) chia khối dạng Bento rõ ràng, có viền hairline mảnh như hình `ac59704353e2214f4764c662ccac6dca.jpg`.
- Mỗi bộ thẻ (Deck) hiển thị như một tấm gỗ Kifuda danh mục, một nửa là mảng hoa văn dệt Seigaiha/Asanoha chìm, một nửa là số liệu thẻ cần ôn.

#### 3. Điểm nhấn Vòng tròn Hinomaru Bất đối xứng (The Hinomaru Accent)
- Tại Hero Banner và màn hình hoàn thành bài học (Completion Screen), sử dụng hình tròn đỏ son Hinomaru mờ hoặc con dấu Daruma đặt lệch góc để tạo sức hút thị giác đặc trưng Nhật Bản.

#### 4. Kết hợp Typography Trục Kép (Vertical Japanese Labels)
- Bổ sung các nhãn dọc truyền thống (*Tate-gaki*) cho các trạng thái thẻ:
  - `出題` (Đề bài - Thẻ mặt trước)
  - `解答` (Đáp án - Thẻ mặt sau)
  - `復習` (Ôn tập FSRS)
  - `新規` (Thẻ mới nạp)

#### 5. Biểu tượng Gia huy Kamon cho Cấp độ Thành tựu
- Các cột mốc tiến độ ghi nhớ (Retention Milestone: 50%, 80%, 100%) và các huy hiệu thành tích được đóng khung trong huy hiệu tròn Kamon truyền thống.

---


<a id="phan-2"></a>
# PHẦN 2: PHẦN 2: KẾ HOẠCH TÁI THIẾT KẾ TÍCH HỢP TRANH NGHỆ THUẬT & VĂN HÓA NHẬT BẢN (AUTHENTIC WA-ART MASTER PLAN)
*Tệp gốc: `doc\12_AUTHENTIC_WA_ART_REDESIGN_MASTER_PLAN.md`*

---

## 📜 TÀI LIỆU 12: KẾ HOẠCH TÁI THIẾT KẾ TOÀN DIỆN LỒNG GHÉP MỸ HỌC VÀ TƯ LIỆU TRANH TRUYỀN THỐNG NHẬT BẢN
### Dự án: Japanese SRS System (FSRS Spaced Repetition)
### Cấp độ: Master Visual Re-Architecture & Asset Integration Blueprint
### Thư mục tư liệu ảnh: `public/assets/art/` (Trích xuất từ `C:\Users\ThinkPad X1\Pictures\collection`)
### Phiên bản: 1.0.0 (Master Japanese Cultural Edition)

---

> [!IMPORTANT]
> **BẢN KẾ HOẠCH NÀY ĐƯỢC THIẾT LẬP THEO QUY CHUẨN PHÂN TẦNG 5 CẤP ĐỘ**.
> Kế thừa toàn bộ kết quả giải mã đồ họa tại **[`doc/11_JAPANESE_GRAPHIC_DESIGN_DECONSTRUCTION.md`](file:///D:/project/japanese-srs-system/doc/11_JAPANESE_GRAPHIC_DESIGN_DECONSTRUCTION.md)** và khai thác tối đa **13 tác phẩm hội họa mộc bản / hoa văn truyền thống** trong bộ sưu tập tư liệu để lồng ghép vào giao diện hệ thống (làm hình nền, tranh thủy mặc treo tường, lớp phủ mờ watermark, dải phân cách sóng cuộn, và phông nền khải hoàn).
> Toàn bộ quá trình thực thi tuân thủ nghiêm ngặt nguyên tắc **Bảo toàn 100% Backend & Tối ưu hiệu năng Web (60 FPS & Zero Layout Shift)**.

---

## ⛩️ TẦNG 1: TỔNG QUAN CHIẾN LƯỢC, PHẠM VI (SCOPE) & BẢN CAM KẾT BẢO TỒN

#### 1.1. Tuyên ngôn Tái thiết kế Thị giác (Visual Re-Architecture Vision)
- **Mục tiêu**: Chuyển đổi giao diện ứng dụng từ một web SRS hiện đại thông thường thành một **Không gian Văn hóa & Nghệ thuật Nhật Bản Sống động (Immersive Japanese Cultural Learning Sanctuary)**.
- **Phương pháp**: Không chỉ áp dụng bảng màu Nippon Colors phẳng, mà đưa trực tiếp các danh tác hội họa mộc bản Ukiyo-e (Katsushika Hokusai), hoa văn gấm lụa Yuzen, dòng chảy tranh Rinpa, dải sóng vàng Kin-nami và hình tượng chim hạc Tancho vào đúng ngữ cảnh của từng màn hình:
  - **Trang chủ (Honmaru)**: Biến thành một Trà thất thanh tịnh ngắm nhìn toàn cảnh Phú Sĩ và làng văn hóa trà đạo.
  - **Thư viện Thẻ (Tanzakucho)**: Biến thành Tàng Kinh Các lưu trữ thẻ thơ dát vàng với dòng chảy tri thức Ryusui uốn lượn.
  - **Bàn Soạn Thẻ AI (Shodo Desk)**: Biến thành Thư phòng Thư pháp cổ điển với tranh cuộn Kakejiku hạc trắng Umezawa bảo chứng tri thức.
  - **Phiên Ôn Tập Karuta**: Khắc họa tinh thần kiên cường bất khuất trước Sóng thần Kanagawa (*The Great Wave*) và nghi thức hoàn thành Daruma mở mắt dưới ánh thái dương Hinomaru.

---

#### 1.2. Phạm vi Công việc (In-Scope Deliverables)
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

#### 1.3. Giới hạn Cấm kỵ (Out-of-Scope / Non-Goals)
- ❌ **KHÔNG thay đổi cấu trúc bảng cơ sở dữ liệu**: Bảng `decks`, `cards`, `review_logs` giữ nguyên 100%.
- ❌ **KHÔNG sửa đổi thuật toán FSRS hay API contracts**: Giữ nguyên logic tính toán DSR, endpoint `/api/review`, `/api/cards`.
- ❌ **KHÔNG gây suy giảm hiệu năng trang web (Performance Guard)**:
  - Tất cả ảnh lớn làm background phải dùng kỹ thuật lớp phủ `pointer-events: none;`, `opacity: 0.15 - 0.35` để bảo đảm độ tương phản chữ đạt chuẩn **WCAG 2.1 AA (tối thiểu 4.5:1)**.
  - Sử dụng Next.js `<Image>` với các thuộc tính `priority` cho Hero và `loading="lazy"` cho các khu vực cuộn trang.

---

#### 1.4. Tiêu chuẩn Hoàn thành Thẩm mỹ (Aesthetic Definition of Done - A-DoD)
1. **Hòa sắc hoàn hảo**: 100% ảnh tư liệu được hòa trộn hài hòa với nền giấy Washi (`#FAF8F5`) qua các hiệu ứng `mix-blend-mode: multiply` hoặc `overlay`.
2. **Không che khuất nội dung**: Văn bản, Furigana, và Pitch Accent luôn nổi bật trên lớp nền, không bị hoa văn làm rối mắt.
3. **Mượt mà 60 FPS**: Tải trang nhanh, cuộn mượt mà, không giật lag trên cả màn hình di động và máy tính bàn.
4. **Kiểm tra tự động**: Vượt qua `npx tsc --noEmit`, `npm run test`, `npm run build` với exit code 0.

---

## 🖼️ TẦNG 2: BẢN ĐỒ TÍCH HỢP TƯ LIỆU HÌNH ẢNH (COLLECTION ASSET CATALOG & PAGE MAPPING)

#### 2.1. Danh mục 13 Tác phẩm trong `public/assets/art/`

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

#### 2.2. Ma trận Ánh xạ Tư liệu vào 5 Màn hình (Page Mapping Matrix)

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

## 📐 TẦNG 3: ĐỐI CHIẾU THIẾT KẾ & BẢN THIẾT KẾ MỚI TỪNG MÀN HÌNH

#### 3.1. Trang chủ Dashboard (`src/app/page.tsx`)

##### A. Đối chiếu Thiết kế (Benchmarking)
- **Hiện trạng**: Hero Banner hiện tại sử dụng nền CSS Seigaiha phẳng màu xanh `#88A752`. Dù màu sắc chuẩn, nhưng tổng thể phẳng (flat design) và thiếu chiều sâu văn hóa hữu cơ.
- **Bản thiết kế mới (Redesign)**:
  - **Hero Banner Trà Thất Toàn Cảnh**: Lồng ghép bức tranh toàn cảnh văn hóa trà đạo Nhật Bản (**ART-08**) làm lớp nền phía sau với độ mờ tinh tế (`opacity: 0.28`, `mix-blend-mode: overlay`). Núi Phú Sĩ, ngôi chùa 5 tầng, cầu son và người gánh lá trà sẽ ẩn hiện sống động sau dòng chữ chào mừng.
  - **Dải Sóng Vàng Phân Cách (Kin-nami Divider)**: Giữa Hero Banner và thanh tiến độ Daruma, chèn dải sóng vàng cuộn trào uốn lượn (**ART-10**) cao 48px với mặt nạ mờ dần 2 đầu (`mask-image: linear-gradient(...)`), tạo sự chuyển tiếp tự nhiên giữa các phân đoạn.
  - **Thẻ Điều Ước Ema Đạt Chuẩn Mỹ Học**: Lồng ghép hoa văn cá chép Kohaku dát vàng (**ART-11**) mờ ảo vào góc thẻ thống kê tỉ lệ ghi nhớ (Retention Rate 90%).

---

#### 3.2. Trang Quản lý Thẻ (`src/app/cards/page.tsx`)

##### A. Đối chiếu Thiết kế (Benchmarking)
- **Hiện trạng**: Quick Study Banner và bảng thẻ bài hiện dùng màu nền trắng xám đơn thuần, chưa gợi lên cảm giác của một kho tàng lưu trữ thơ ca hay tờ rơi quảng cáo cổ Hikifuda.
- **Bản thiết kế mới (Redesign)**:
  - **Dòng Chảy Sông Chàm Ryusui (ART-04)**: Tích hợp dải dòng sông Ryusui uốn lượn chạy ngang phía sau Quick Study Banner, tạo cảm giác người học đang cưỡi trên dòng chảy bất tận của tri thức từ vựng.
  - **Mặt Thẻ Giấy Dó Dát Vàng (ART-06)**: Mặt nền của từng thẻ bài Karuta trong danh sách được phủ lớp hoa văn cành hoa anh đào nét chỉ vàng siêu thanh nhã (`opacity: 0.12`). Khi rê chuột (hover), hoa văn sáng nhẹ lên tạo cảm giác thẻ giấy thủ công bắt sáng.

---

#### 3.3. Trang Soạn Thẻ AI Copilot (`src/app/cards/new/page.tsx`)

##### A. Đối chiếu Thiết kế (Benchmarking)
- **Hiện trạng**: Trang soạn thẻ có hoạt họa hạc giấy Orizuru bằng CSS nhưng chưa gian phòng viết còn trống trải, thiếu chiều sâu của một "Thư phòng Thư đạo (Shodo Desk)".
- **Bản thiết kế mới (Redesign)**:
  - **Tranh Cuộn Kakejiku Phú Sĩ & Hạc Trắng (ART-09)**: Phía trên bàn viết thư đạo, đặt một bức tranh cuộn thủy mặc Hokusai vẽ đàn hạc trắng bay về núi Phú Sĩ được đóng khung nẹp gỗ truyền thống. Bức tranh này đóng vai trò như bảo chứng tinh thần cho sự thông tuệ và kiên nhẫn.
  - **Đám Mây Vàng Kasumi (ART-07)**: Khi AI đang suy nghĩ phân tích câu chữ, các cụm mây vàng Kasumi sẽ lướt nhẹ quanh biểu tượng hạc giấy Orizuru.

---

#### 3.4. Trang Ôn Tập Karuta Active Recall (`src/app/review/page.tsx`)

##### A. Đối chiếu Thiết kế (Benchmarking)
- **Hiện trạng**: Màn hình hoàn thành bài học hiện tại chỉ có búp bê Daruma trên nền trơn, chưa tạo được cảm xúc thăng hoa (climax) tột đỉnh sau khi vượt qua thử thách ôn tập.
- **Bản thiết kế mới (Redesign)**:
  - **Phông Nền Sóng Thần Khải Hoàn (ART-02)**: Khi học sinh hoàn thành toàn bộ 100% số thẻ của phiên học, màn hình chúc mừng Daruma sẽ mở ra trên phông nền bức tranh **Sóng thần Kanagawa cô lập (ART-02)** kết hợp với vầng thái dương đỏ Hinomaru rực rỡ phía sau! Búp bê Daruma 2 mắt mở to đứng hiên ngang trước ngọn sóng cuộn trào — tượng trưng cho ý chí người học đã chinh phục thành công ngọn sóng tri thức.
  - **Họa Tiết Gấm Dệt Rinpa (ART-05)**: Mặt sau thẻ Karuta khi lật mở có viền sóng vàng và mây gấm mờ ở chân thẻ, làm tôn lên câu ví dụ $i+1$ và đồ thị Pitch Accent.

---

#### 3.5. Trang Tiện ích Google Workspace (`src/app/integrations/page.tsx`)

##### A. Đối chiếu Thiết kế (Benchmarking)
- **Hiện trạng**: Giao diện kết nối Google Sheets/Calendar mang tính công nghệ cao nhưng chưa có sự hòa quyện với phong cách Nhật Bản truyền thống.
- **Bản thiết kế mới (Redesign)**:
  - **Lớp Phủ Dệt Gấm Cá Koi Yuzen (ART-03)**: Sử dụng mảng hoa văn cá Koi đỏ bơi lội giữa hoa mẫu đơn và sóng nước làm hình nền mờ (`opacity: 0.15`, `mix-blend-mode: multiply`) phía sau các khối thẻ dịch vụ Google, biểu trưng cho sự lưu thông may mắn và dữ liệu đồng bộ thông suốt giữa thiết bị người dùng và đám mây.

---

## 🔨 TẦNG 4: DANH MỤC CÁC ĐƠN VỊ CÔNG VIỆC NGUYÊN TỬ (ATOMIC REDESIGN TASKS)

> Dưới đây là các đơn vị công việc được phân rã đến cấp độ nhỏ nhất không thể chia nhỏ hơn. Mỗi task chỉ rõ: File can thiệp, đoạn mã cần chèn, thông số CSS chính xác từng pixel và cơ chế an toàn.

---

#### 📦 Nhóm Task 4.1: Tạo Component Lớp Phủ Mỹ Thuật Dùng Chung (`JapaneseArtBackdrop`)

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

#### 📦 Nhóm Task 4.2: Nâng cấp Trang chủ Dashboard (`src/app/page.tsx`)

##### Task 4.2.1: Chèn Bức Tranh Toàn Cảnh Văn Hóa Trà Đạo vào Hero Banner
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

##### Task 4.2.2: Thêm Dải Phân Cách Sóng Vàng Kin-nami
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

#### 📦 Nhóm Task 4.3: Nâng cấp Thư viện Thẻ (`src/app/cards/page.tsx`)

##### Task 4.3.1: Lồng ghép Dòng Sông Ryusui vào Quick Study Banner
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

##### Task 4.3.2: Thêm Watermark Hoa Anh Đào Dát Vàng vào Bảng Thẻ
- **File can thiệp**: `src/app/cards/page.tsx`.
- **Thao tác**: Áp dụng ảnh nền hoa anh đào lặp lại mờ ảo cho khối bảng thẻ:
  ```tsx
  backgroundImage: 'url("/assets/art/gold-sakura-washi.jpg")',
  backgroundSize: '360px',
  backgroundRepeat: 'repeat',
  backgroundBlendMode: 'soft-light',
  ```

---

#### 📦 Nhóm Task 4.4: Nâng cấp Trang Soạn Thẻ AI Copilot (`src/app/cards/new/page.tsx`)

##### Task 4.4.1: Bổ sung Bức Tranh Cuộn Thư Phòng Kakejiku
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

#### 📦 Nhóm Task 4.5: Nâng cấp Trang Ôn tập Karuta (`src/app/review/page.tsx`)

##### Task 4.5.1: Màn hình Khải hoàn Daruma & Sóng Thần Hokusai
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

## 🧪 TẦNG 5: MA TRẬN KIỂM THỬ THẨM MỸ & TIÊU CHUẨN NGHIỆM THU

#### 5.1. Bảng 10 Tiêu chí Nghiệm thu Thẩm mỹ (Aesthetic Test Matrix)

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

#### 5.2. Bộ Lệnh Kiểm định Tự động
```bash
# 1. Kiểm tra an toàn kiểu dữ liệu TypeScript
npx tsc --noEmit

# 2. Chạy toàn bộ 19 Unit Tests
npm run test

# 3. Biên dịch Production Build của Next.js (Xác thực nạp tài nguyên tĩnh public/assets/art/)
npm run build
```

---

## 🎌 BẢN KẾ HOẠCH NÀY ĐÃ SẴN SÀNG CHO BƯỚC THỰC THI
*Toàn bộ 13 tệp tư liệu tranh ảnh đã được chuẩn bị đầy đủ trong `public/assets/art/`. Bất kỳ kỹ sư nào tiếp nhận cũng có thể mở tài liệu này và lần lượt thực hiện các nhiệm vụ tại **Tầng 4** để tạo nên một kiệt tác giao diện Nhật Bản.*

---
