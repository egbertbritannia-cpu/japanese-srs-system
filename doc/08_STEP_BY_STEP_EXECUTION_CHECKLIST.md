# 📋 TÀI LIỆU 08: CHECKLIST THỰC THI CHI TIẾT TỪNG BƯỚC DÀNH CHO AGENT
## Dự án: Japanese SRS System (FSRS)
## Nguyên tắc: Zero Deduction (Không cần suy luận - Chỉ cần thực hiện theo tuần tự)

---

### 1. BẢNG TỔNG HỢP CÁC FILE CẦN THAO TÁC

| Thứ tự | Thao tác | Đường dẫn file mục tiêu | Nguồn mã nguồn |
| :---: | :--- | :--- | :--- |
| **Bước 1** | Tạo thư mục | `src/components/japanese/` | Thư mục rỗng |
| **Bước 2** | Tạo mới file | `src/components/japanese/Icons.tsx` | [Tài liệu 02 - Mục 5](file:///D:/project/japanese-srs-system/doc/02_CULTURAL_ANIMATIONS_AND_ASSETS.md#5-kho-bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-v%C4%83n-h%C3%B3a-svg-thu%E1%BA%A7n-t%C3%BAy-pure-vector-cultural-icons) |
| **Bước 3** | Tạo mới file | `src/components/japanese/SakuraBackground.tsx` | [Tài liệu 02 - Mục 1.2](file:///D:/project/japanese-srs-system/doc/02_CULTURAL_ANIMATIONS_AND_ASSETS.md#12-react-component-c%C3%A1nh-hoa-srccomponentsjapanesesakurabackgroundtsx) |
| **Bước 4** | Tạo mới file | `src/components/japanese/DarumaMascot.tsx` | [Tài liệu 02 - Mục 4.1](file:///D:/project/japanese-srs-system/doc/02_CULTURAL_ANIMATIONS_AND_ASSETS.md#41-react-component-b%C3%BAp-b%C3%AA-daruma-srccomponentsjapanesedarumamascottsx) |
| **Bước 5** | Ghi đè file | `src/app/globals.css` | [Tài liệu 03 - Mục 1](file:///D:/project/japanese-srs-system/doc/03_GLOBAL_STYLES_AND_LAYOUT.md#1-m%C3%A3-ngu%E1%BB%93n-ho%C3%A0n-ch%E1%BB%89nh-cho-srcappglobalscss) |
| **Bước 6** | Ghi đè file | `src/app/layout.tsx` | [Tài liệu 03 - Mục 2](file:///D:/project/japanese-srs-system/doc/03_GLOBAL_STYLES_AND_LAYOUT.md#2-m%C3%A3-ngu%E1%BB%93n-ho%C3%A0n-ch%E1%BB%89nh-cho-srcapplayouttsx) |
| **Bước 7** | Ghi đè file | `src/app/page.tsx` | [Tài liệu 04 - Mục 2](file:///D:/project/japanese-srs-system/doc/04_PAGE_DASHBOARD_IMPLEMENTATION.md#2-m%C3%A3-ngu%E1%BB%93n-ho%C3%A0n-ch%E1%BB%89nh-cho-srcapppagetsx) |
| **Bước 8** | Ghi đè file | `src/app/cards/page.tsx` | [Tài liệu 05 - Mục 2](file:///D:/project/japanese-srs-system/doc/05_PAGE_CARDS_MANAGEMENT_IMPLEMENTATION.md#2-m%C3%A3-ngu%E1%BB%93n-ho%C3%A0n-ch%E1%BB%89nh-cho-srcappcardspagetsx) |
| **Bước 9** | Ghi đè file | `src/app/cards/new/page.tsx` | [Tài liệu 06 - Mục 2](file:///D:/project/japanese-srs-system/doc/06_PAGE_AI_COPILOT_AND_NEW_CARD_IMPLEMENTATION.md#2-m%C3%A3-ngu%E1%BB%93n-ho%C3%A0n-ch%E1%BB%89nh-cho-srcappcardsnewpagetsx) |
| **Bước 10**| Ghi đè file | `src/app/review/page.tsx` | [Tài liệu 07 - Mục 2](file:///D:/project/japanese-srs-system/doc/07_PAGE_REVIEW_ACTIVE_RECALL_IMPLEMENTATION.md#2-m%C3%A3-ngu%E1%BB%93n-ho%C3%A0n-ch%E1%BB%89nh-cho-srcappreviewpagetsx) |

---

### 2. QUY TRÌNH THỰC THI CHI TIẾT (EXACT INSTRUCTIONS FOR EXECUTING AGENT)

#### BƯỚC 1: KHỞI TẠO THƯ MỤC COMPONENT
Chạy lệnh PowerShell tại thư mục gốc của dự án `D:\project\japanese-srs-system`:
```powershell
New-Item -ItemType Directory -Path "src\components\japanese" -Force
```

#### BƯỚC 2: TẠO FILE `src/components/japanese/Icons.tsx`
Tạo file `src/components/japanese/Icons.tsx` và sao chép chính xác 100% nội dung tại Mục 5 của [Tài liệu 02](file:///D:/project/japanese-srs-system/doc/02_CULTURAL_ANIMATIONS_AND_ASSETS.md).
- *Kiểm tra*: File phải chứa các export: `ToriiIcon`, `SakuraIcon`, `SensuFanIcon`, `OrizuruIcon`, `FujiMountainIcon`.

#### BƯỚC 3: TẠO FILE `src/components/japanese/SakuraBackground.tsx`
Tạo file `src/components/japanese/SakuraBackground.tsx` và sao chép chính xác nội dung tại Mục 1.2 của [Tài liệu 02](file:///D:/project/japanese-srs-system/doc/02_CULTURAL_ANIMATIONS_AND_ASSETS.md).
- *Kiểm tra*: Component có `'use client'`, không sinh lỗi hydration.

#### BƯỚC 4: TẠO FILE `src/components/japanese/DarumaMascot.tsx`
Tạo file `src/components/japanese/DarumaMascot.tsx` và sao chép chính xác nội dung tại Mục 4.1 của [Tài liệu 02](file:///D:/project/japanese-srs-system/doc/02_CULTURAL_ANIMATIONS_AND_ASSETS.md).
- *Kiểm tra*: Component nhận prop `progressPercentage: number` và hiển thị mắt trái/phải theo điều kiện.

#### BƯỚC 5: GHI ĐÈ FILE `src/app/globals.css`
Ghi đè file `src/app/globals.css` với mã nguồn đầy đủ từ Mục 1 của [Tài liệu 03](file:///D:/project/japanese-srs-system/doc/03_GLOBAL_STYLES_AND_LAYOUT.md).
- *Kiểm tra*: Chứa đầy đủ các class `.wagara-seigaiha-matcha` (`#88a752`), `.wagara-yagasuri`, `.card-karuta`, `.btn-torii`, `.inkan-stamp-badge`.

#### BƯỚC 6: GHI ĐÈ FILE `src/app/layout.tsx`
Ghi đè file `src/app/layout.tsx` với mã nguồn đầy đủ từ Mục 2 của [Tài liệu 03](file:///D:/project/japanese-srs-system/doc/03_GLOBAL_STYLES_AND_LAYOUT.md).
- *Kiểm tra*: Đã import đúng các font Google: `Zen_Maru_Gothic`, `Shippori_Mincho`, `Plus_Jakarta_Sans`. Header có logo Inkan "日学", Footer có hình núi Phú Sĩ.

#### BƯỚC 7: GHI ĐÈ FILE `src/app/page.tsx`
Ghi đè file `src/app/page.tsx` với mã nguồn đầy đủ từ Mục 2 của [Tài liệu 04](file:///D:/project/japanese-srs-system/doc/04_PAGE_DASHBOARD_IMPLEMENTATION.md).
- *Kiểm tra*: Hero banner sử dụng class `wagara-seigaiha-matcha`, có búp bê Daruma điểm mắt, có 3 thẻ Ema.

#### BƯỚC 8: GHI ĐÈ FILE `src/app/cards/page.tsx`
Ghi đè file `src/app/cards/page.tsx` với mã nguồn đầy đủ từ Mục 2 của [Tài liệu 05](file:///D:/project/japanese-srs-system/doc/05_PAGE_CARDS_MANAGEMENT_IMPLEMENTATION.md).
- *Kiểm tra*: Bộ lọc Kifuda hoạt động lọc theo deck, bảng hiển thị Kanji và con dấu loại thẻ.

#### BƯỚC 9: GHI ĐÈ FILE `src/app/cards/new/page.tsx`
Ghi đè file `src/app/cards/new/page.tsx` với mã nguồn đầy đủ từ Mục 2 của [Tài liệu 06](file:///D:/project/japanese-srs-system/doc/06_PAGE_AI_COPILOT_AND_NEW_CARD_IMPLEMENTATION.md).
- *Kiểm tra*: Form AI Copilot kết nối đến `/api/copilot/draft`, khi duyệt thẻ hiển thị con dấu Inkan "済". Không sửa logic backend!

#### BƯỚC 10: GHI ĐÈ FILE `src/app/review/page.tsx`
Ghi đè file `src/app/review/page.tsx` với mã nguồn đầy đủ từ Mục 2 của [Tài liệu 07](file:///D:/project/japanese-srs-system/doc/07_PAGE_REVIEW_ACTIVE_RECALL_IMPLEMENTATION.md).
- *Kiểm tra*: Thẻ bài Karuta có nút lật mở, 4 nút đánh giá Again / Hard / Good / Easy hiển thị đúng màu và chữ Hán tương ứng.

---

### 3. KIỂM THỬ & THẨM ĐỊNH TỰ ĐỘNG (VERIFICATION COMMANDS)

Sau khi hoàn tất 10 bước trên, Agent PHẢI chạy các lệnh sau để đảm bảo chất lượng tuyệt đối:

1. **Kiểm tra TypeScript & Cú pháp Next.js**:
   ```powershell
   npx tsc --noEmit
   ```
   *Yêu cầu*: Exit code 0, không có bất kỳ lỗi type error nào.

2. **Kiểm tra Unit Test (Bảo toàn FSRS Backend)**:
   ```powershell
   npm run test
   ```
   *Yêu cầu*: Toàn bộ test trong `tests/scheduler.test.ts` đều PASS 100%.

3. **Kiểm tra Build Production**:
   ```powershell
   npm run build
   ```
   *Yêu cầu*: Build thành công, tạo đầy đủ các static/SSR routes: `/`, `/cards`, `/cards/new`, `/review`.

---

### 4. TIÊU CHÍ NGHIỆM THU HÌNH ẢNH (VISUAL ACCEPTANCE CRITERIA)
1. **Gam màu**: Toàn bộ trang web mang tông màu Washi sáng tinh khôi, ấm áp; màu xanh Matcha `#88A752` nổi bật trên Hero Banner và nút "Good".
2. **Họa tiết**: Họa tiết sóng Seigaiha hiển thị đồng nhất, sắc nét, lặp lại liền mạch không bị đứt gãy.
3. **Hoạt họa**: Cánh hoa anh đào rơi mượt mà, không giật lag; con dấu son Inkan dập nảy nhẹ nhàng; thanh tiến độ Daruma lướt êm ái.
4. **Không lỗi Console**: Mở trình duyệt F12 không có cảnh báo hydration mismatch hay thiếu key trong map array.
