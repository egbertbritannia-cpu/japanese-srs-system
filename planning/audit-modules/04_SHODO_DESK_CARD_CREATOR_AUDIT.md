# PHẦN 4: AUDIT CHI TIẾT SHODO DESK (GIAO DIỆN SOẠN VÀ TẠO THẺ HỌC - /cards/new)

> **Mô đun kiểm thử & thiết kế**: Bàn thư pháp số Shodo Desk (書道机), Tranh cuộn Kakejiku (掛け軸), AI Copilot Atomicity Generator, và Form nhập liệu thủ công.  
> **Tập tin nguồn mục tiêu**: [src/app/cards/new/page.tsx](file:///d:/project/japanese-srs-system/src/app/cards/new/page.tsx) (881 dòng mã TSX).  
> **Mục tiêu chuyên môn**: Chuẩn hóa công thái học nhập liệu thẻ, loại bỏ hoàn toàn browser dialogs (`window.alert`), tích hợp WanaKana live conversion, sửa lỗi phân bố Pitch Accent Tokyo > 3 morae, cung cấp Live Tanzaku Preview và cơ chế duyệt hàng loạt (Batch Approval) theo chuẩn FSRS atomicity.

---

## 4.1. BẢNG TỔNG HỢP KHIẾM KHUYẾT GIAO DIỆN TẠI SHODO DESK

| Mã Khiếm Khuyết | Phân Loại | Vị Trí Thành Phần | Mức Độ | Tóm Tắt Khiếm Khuyết |
| :--- | :--- | :--- | :--- | :--- |
| `DEF-UI-SHODO-001` | **Thiếu** | Live Card Preview | **P1 (Cao)** | Thiếu khung xem trước thẻ Karuta/Tanzaku thời gian thực hai mặt khi nhập liệu thủ công. |
| `DEF-UI-SHODO-002` | **Sai / Thiếu** | Cloze Form Builder | **P1 (Cao)** | Loại thẻ `Cloze` (Điền từ) không thay đổi layout nhập liệu, thiếu cú pháp `{{c1::...}}` và nút bấm trích xuất. |
| `DEF-UI-SHODO-003` | **Lỗi hiển thị** | Bộ chọn Deck tĩnh | **P2 (Trung)** | Hardcode danh sách 3 bộ thẻ cố định trong `<select>`, bỏ qua context bộ thẻ từ URL query (`?deckId=...`). |
| `DEF-UI-SHODO-004` | **Sai (Anti-pattern)** | Xử lý ngoại lệ AI | **P1 (Cao)** | Lạm dụng `window.alert()` khi Copilot thất bại, phá vỡ luồng người dùng và thẩm mỹ Wabi-Sabi. |
| `DEF-UI-SHODO-005` | **Thiếu** | Pitch Accent Manual | **P2 (Trung)** | Form thủ công chọn mẫu Pitch Accent nhưng không dựng biểu đồ SVG `<PitchAccentGraph>` động theo từ vựng. |
| `DEF-UI-SHODO-006` | **Thừa** | Art Backdrop Stacking | **P2 (Trung)** | Xếp chồng 3 lớp texture tranh mộc bản/hoa văn Kasumi/Washi trong một khung nhìn gây nhiễu thị giác nặng. |
| `DEF-UI-SHODO-007` | **Lỗi hiển thị** | Responsive Pitch Grid | **P2 (Trung)** | Lưới 4 nút Pitch Accent vỡ layout, tràn ngang trên thiết bị di động có bề rộng dưới 360px. |
| `DEF-UI-SHODO-008` | **Thiếu** | WanaKana IME Binding | **P1 (Cao)** | Ô nhập cách đọc Furigana không hỗ trợ tự động chuyển đổi Romaji sang Hiragana/Katakana trực tiếp. |
| `DEF-UI-SHODO-009` | **Sai Ngữ Học** | Pitch Accent Schema | **P1 (Cao)** | Giới hạn cứng 4 mẫu cao độ `[0, 1, 2, 3]` không thể gán trọng âm cho từ 4–5 morae (Nakadaka 4/5). |
| `DEF-UI-SHODO-010` | **Thiếu** | Copilot Draft Actions | **P1 (Cao)** | Danh sách bản nháp AI thiếu nút "Duyệt toàn bộ" (Approve All) và "Hủy bản nháp" (Discard/Regenerate). |
| `DEF-UI-SHODO-011` | **Lỗi hiển thị** | Success Banner CLS | **P2 (Trung)** | Thông báo lưu thẻ biến mất đột ngột sau `setTimeout(4000)` gây giật màn hình (CLS) và thiếu CTA "Xem thẻ". |
| `DEF-UI-SHODO-012` | **Thiếu** | Audio Fallback Feedback | **P3 (Thấp)** | Nút phát âm Web Speech API không có trạng thái loading, không cảnh báo khi trình duyệt không hỗ trợ giọng Nhật. |

---

## 4.2. PHÂN TÍCH CHI TIẾT TỪNG KHIẾM KHUYẾT & GIẢI PHÁP TÁI CẤU TRÚC

### 4.2.1. DEF-UI-SHODO-001: Thiếu Khung Xem Trước Thẻ Karuta/Tanzaku Thời Gian Thực (Live Preview)
* **Vị trí**: [src/app/cards/new/page.tsx:758-853](file:///d:/project/japanese-srs-system/src/app/cards/new/page.tsx#L758-L853).
* **Phân loại**: **Thiếu (Missing Interactive Component)**.
* **Mức độ nghiêm trọng**: **P1 (Cao)**.
* **Hiện trạng (As-Is)**:
  Khi người dùng nhập các trường `Mặt trước (Kanji)`, `Cách đọc (Hiragana)`, `Mẫu Pitch`, `Ý nghĩa tiếng Việt`, và `Câu ví dụ`, giao diện chỉ gồm các ô `input` màu trắng đơn điệu xếp dọc. Người học hoàn toàn không hình dung được thẻ khi xuất hiện trong phiên ôn tập Karuta (`/review`) sẽ trông như thế nào: kích thước chữ Hán có quá bé không, Furigana có bị lệch khỏi Kanji không, câu ví dụ có bị tràn khung không.
* **Tác động tâm lý & công thái học**:
  - **Vi phạm Nguyên lý WYSIWYG (What You See Is What You Get)**: Tạo ra sự mơ hồ nhận thức (cognitive ambiguity). Người học thường xuyên phải bấm lưu, sau đó chuyển sang trang `/cards` để tìm thẻ vừa tạo nhằm kiểm tra xem định dạng có chuẩn không, làm lãng phí 4-5 thao tác dư thừa (Interaction Cost tăng vọt theo Định luật Hick).
  - **Mất đi cảm hứng thủ công (Craftsmanship Pride)**: Nghệ thuật thư pháp Nhật Bản (Shodo) coi trọng bố cục không gian trắng (Ma - 間). Nhập liệu vào form xám xịt làm mất đi tính kết nối cảm xúc với tri thức đang được đúc kết.
* **Đề xuất khắc phục (To-Be)**:
  Triển khai bố cục 2 cột (Split-pane layout trên Desktop: tỉ lệ 55% Form Soạn thảo / 45% Live Preview mô phỏng thẻ Tanzaku Washi có nút bấm lật Mặt Trước / Mặt Sau). Khi người dùng gõ vào form, các nét chữ Hán lập tức hiện lên bề mặt thẻ giấy Washi với phông chữ `Shippori Mincho`, kèm Furigana căn chuẩn trên đầu chữ Hán và biểu đồ Pitch Accent vẽ động.

```tsx
// Minh họa cấu trúc Live Preview 2 mặt tương tác
<div className="shodo-workspace-grid grid grid-cols-1 lg:grid-cols-12 gap-6">
  {/* Cột trái: Form nhập liệu 7 cột */}
  <div className="lg:col-span-7">
    {/* Form nhập liệu */}
  </div>
  {/* Cột phải: Live Tanzaku Card Simulator 5 cột */}
  <aside className="lg:col-span-5 sticky top-6">
    <div className="tanzaku-live-preview-box rounded-2xl p-5 bg-[#FAF7F0] border-1.5 border-[#C89B58] shadow-md">
      <div className="flex items-center justify-between pb-3 border-b border-[#E6DDCF]">
        <span className="text-xs font-bold uppercase tracking-wider text-[#786A5E]">Xem trước thẻ Karuta</span>
        <button 
          type="button" 
          onClick={() => setPreviewFlipped(!previewFlipped)}
          className="text-xs px-2.5 py-1 rounded bg-[#EAE3D2] text-[#122438] hover:bg-[#D8CDB8] transition font-bold"
        >
          {previewFlipped ? 'Xem mặt trước (Front)' : 'Xem mặt sau (Back)'}
        </button>
      </div>
      <div className="karuta-card-viewport mt-4 min-h-[260px] flex flex-col justify-center items-center p-6 bg-white rounded-xl border border-[#E6DDCF] shadow-inner text-center">
        {!previewFlipped ? (
          <div>
            <div className="text-xs text-[#1E4B75] font-maru font-bold">{formData.reading || 'さくら'}</div>
            <div className="text-4xl font-mincho font-black text-[#122438] mt-1">{formData.front || '桜'}</div>
            {formData.pitch && (
              <div className="mt-3"><PitchAccentGraph reading={formData.reading || 'さくら'} pattern={Number(formData.pitch)} /></div>
            )}
          </div>
        ) : (
          <div>
            <div className="text-lg font-bold text-[#122438]">{formData.meaning || 'Hoa anh đào'}</div>
            {formData.sentence && (
              <p className="mt-3 text-sm text-[#786A5E] italic bg-[#FAF7F0] p-2.5 rounded-lg border border-[#E6DDCF]">
                {formData.sentence}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  </aside>
</div>
```

---

### 4.2.2. DEF-UI-SHODO-002: Loại Thẻ Cloze (Điền Từ) Không Thay Đổi Layout Nhập Liệu
* **Vị trí**: [src/app/cards/new/page.tsx:752, 758-853](file:///d:/project/japanese-srs-system/src/app/cards/new/page.tsx#L752).
* **Phân loại**: **Sai / Thiếu (Feature Incompleteness & Misleading UI)**.
* **Mức độ nghiêm trọng**: **P1 (Cao)**.
* **Hiện trạng (As-Is)**:
  Menu `<select>` cho phép chọn `Loại thẻ: Điền từ (Cloze)`. Tuy nhiên, khi chuyển sang `Cloze`, các trường nhập liệu bên dưới vẫn hoàn toàn giữ nguyên:
  - `Mặt trước (Kanji / Từ vựng)` (Placeholder: `ví dụ: 桜, 食べる`)
  - `Cách đọc (Hiragana / Furigana)`
  - `Mẫu hình Cao độ Pitch Accent`
  - `Ý nghĩa tiếng Việt`
  - `Câu ví dụ (tùy chọn)`
  Người dùng không có ô nhập câu chứa mệnh đề khuyết từ, không có nút hướng dẫn tạo cloze deletion (ví dụ: bôi đen một từ trong câu rồi bấm "Tạo khuyết từ [c1]"), và hệ thống lưu vào DB cũng không sinh ra cấu trúc thẻ đục lỗ chuẩn.
* **Tác động tâm lý & công thái học**:
  - **Gây thất vọng và lúng túng (Expectation-Reality Mismatch)**: Người dùng quen dùng Anki hoặc SuperMemo khi chọn loại thẻ Cloze mong đợi một giao diện câu ngữ cảnh với các nút bọc ngoặc nhọn `{{c1::từ cần giấu}}`. Việc form không thay đổi tạo ấn tượng rằng tính năng bị "treo" hoặc là giao diện lừa dối (Dark Pattern / Vaporware).
  - **Lỗi dữ liệu FSRS**: Lưu thẻ Cloze nhưng không có từ khuyết khiến phiên ôn tập sau đó không thể che mờ từ khóa, biến thẻ thành thẻ Vocab thông thường bị mất thông tin.
* **Đề xuất khắc phục (To-Be)**:
  Khi `formData.cardType === 'Cloze'`:
  1. Ẩn trường `Mặt trước` và biến trường `Câu ngữ cảnh khuyết từ` thành trường bắt buộc hàng đầu với textarea lớn.
  2. Bổ sung toolbar tiện ích phía trên textarea: nút bấm `[+ Điền từ c1]`, tự động bọc chuỗi văn bản đang được bôi đen bằng `{{c1::văn bản}}`.
  3. Bổ sung trường nhập `Gợi ý (Hint)` tùy chọn cho vị trí đục lỗ.
  4. Live Preview render ngay thẻ đục lỗ: hiển thị `[...]` màu xanh Indigoid (#1E4B75) tại mặt trước và đáp án đầy đủ tại mặt sau.

---

### 4.2.3. DEF-UI-SHODO-003: Hardcode Danh Sách Bộ Thẻ Tĩnh Bỏ Qua Query URL Context
* **Vị trí**: [src/app/cards/new/page.tsx:734-738](file:///d:/project/japanese-srs-system/src/app/cards/new/page.tsx#L734-L738).
* **Phân loại**: **Lỗi hiển thị / Kiến trúc (Hardcoded Context Disconnect)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Ô chọn bộ thẻ được viết tĩnh cứng trong mã nguồn:
  ```tsx
  <select value={formData.deck} onChange={(e) => setFormData({ ...formData, deck: e.target.value })}>
    <option value="deck_jpd133">JPD133 - Từ vựng Kotoba</option>
    <option value="deck_jpd133_kanji">JPD133 - Hán Tự (Kanji)</option>
    <option value="deck_n5">JLPT N5 - Từ vựng Cốt lõi</option>
  </select>
  ```
  Nếu người dùng đang ở trang danh mục một bộ thẻ tùy biến (ví dụ: `deck_genki_ch1`) và bấm nút "Thêm thẻ vào bộ này", URL chuyển tới `/cards/new?deckId=deck_genki_ch1`, nhưng trang `/cards/new` hoàn toàn bỏ qua tham số `deckId`, ép chọn mặc định `deck_jpd133`. Thêm vào đó, nếu người dùng tạo thêm các bộ thẻ mới trong CSDL, danh sách này không hề hiển thị bộ thẻ mới.
* **Tác động tâm lý & công thái học**:
  - Người dùng bấm lưu 10 thẻ liên tiếp với niềm tin thẻ vào đúng bộ mình vừa chọn ở màn hình trước, nhưng sau đó phát hiện tất cả bị nhét nhầm vào bộ `deck_jpd133`.
  - **Mất kiểm soát hệ thống (Lack of User Control & Predictability)**: Vi phạm nặng nguyên tắc heuristic số 1 của Nielsen: Visibility of System Status.
* **Đề xuất khắc phục (To-Be)**:
  Sử dụng `useSearchParams()` để đọc `deckId` từ URL khi khởi tạo `useState`. Đồng thời, gọi hook SWR/TanStack Query hoặc fetch `/api/decks` để hiển thị danh sách toàn bộ các bộ thẻ có trong SQLite/Turso.

---

### 4.2.4. DEF-UI-SHODO-004: Lạm Dụng window.alert() Trong Luồng Xử Lý AI Copilot
* **Vị trí**: [src/app/cards/new/page.tsx:90, 93, 136, 139, 146, 181, 184](file:///d:/project/japanese-srs-system/src/app/cards/new/page.tsx#L90).
* **Phân loại**: **Sai Nguyên Tắc Thiết Kế (Browser Modal Anti-Pattern)**.
* **Mức độ nghiêm trọng**: **P1 (Cao)**.
* **Hiện trạng (As-Is)**:
  Có tới 7 vị trí gọi `window.alert(...)` trực tiếp:
  - Dòng 90: `alert(data.feedback || data.error || 'Có lỗi xảy ra trong quá trình sinh thẻ')`
  - Dòng 93: `alert('Không thể kết nối đến máy chủ AI Copilot API')`
  - Dòng 136: `alert(data.error || 'Không thể lưu thẻ học')`
  - Dòng 139: `alert('Lỗi khi phê duyệt và lưu thẻ học vào SQLite/Turso')`
  - Dòng 146: `alert('Vui lòng nhập từ vựng và ý nghĩa')`
  - Dòng 181: `alert(data.error || 'Lỗi khi lưu thẻ học')`
  - Dòng 184: `alert('Không thể kết nối đến máy chủ API')`
* **Tác động tâm lý & công thái học**:
  - `window.alert()` chặn đứng luồng thực thi (synchronous blocking) của toàn bộ tab trình duyệt, vô hiệu hóa mọi phím tắt, phát ra âm thanh báo động mặc định của hệ điều hành (tiếng bíp chói tai trên Windows/macOS).
  - Phá vỡ toàn bộ cảm xúc thư thái, thiền định của không gian Wabi-Sabi và giấy Washi mộc bản.
  - Trên trình duyệt di động (iOS Safari / Chrome Android), hộp thoại cảnh báo của hệ thống chiếm trọn màn hình, gây hoang mang cho người học.
* **Đề xuất khắc phục (To-Be)**:
  Thay thế toàn bộ các lệnh `alert()` bằng component `WabiToast` hoặc `WashiNoticeBox` phong cách Nhật Bản: thông báo dạng banner thanh nhã trượt từ góc phải hoặc hiển thị dưới dạng dấu triện Hán tự (`[!] Cảnh báo âm thầm`) với màu mực son Shu-iro (#C83824) hoặc nâu trà (#786A5E), có nút đóng x và tự biến mất nhẹ nhàng sau 5 giây.

```tsx
// WabiToast Notification System
export interface NotificationNotice {
  id: string;
  type: 'error' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
}

export function WabiToast({ notice, onDismiss }: { notice: NotificationNotice; onDismiss: () => void }) {
  const bgStyles = {
    error: 'bg-[#FDF2F0] border-[#E8A598] text-[#8C2315]',
    warning: 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]',
    success: 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]',
    info: 'bg-[#F0F9FF] border-[#BAE6FD] text-[#075985]',
  };

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border-1.5 shadow-lg transition-all animate-slide-in ${bgStyles[notice.type]}`}>
      <span className="text-xl">{notice.type === 'error' ? '⛩️' : '🌿'}</span>
      <div className="flex-1">
        <h4 className="font-bold text-sm font-mincho">{notice.title}</h4>
        <p className="text-xs mt-0.5 leading-relaxed opacity-90">{notice.message}</p>
      </div>
      <button onClick={onDismiss} className="text-sm opacity-60 hover:opacity-100 transition p-1">✕</button>
    </div>
  );
}
```

---

### 4.2.5. DEF-UI-SHODO-005: Form Thủ Công Thiếu Biểu Đồ Pitch Accent Động
* **Vị trí**: [src/app/cards/new/page.tsx:786-825](file:///d:/project/japanese-srs-system/src/app/cards/new/page.tsx#L786-L825).
* **Phân loại**: **Thiếu (Visual Feedback Missing)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Ở Tab 1 (AI Copilot), mỗi bản nháp được render một biểu đồ SVG chuẩn xác qua component `<PitchAccentGraph reading={...} pattern={...} />`. Tuy nhiên, ở Tab 2 (Soạn thủ công), giao diện chỉ cho phép bấm chọn 4 nút:
  - `平板 Heiban [0] (_ ‾ ‾)`
  - `頭高 Atamadaka [1] (‾ _ _)`
  - `中高 Nakadaka [2] (_ ‾ _)`
  - `尾高 Odaka [3] (_ ‾ [ \ ])`
  Người dùng không thể nhìn thấy biểu đồ cao độ thực tế tương ứng với từ vựng mình vừa gõ vào ô `reading`.
* **Tác động tâm lý & công thái học**:
  - Người học tiếng Nhật, đặc biệt ở trình độ N4-N3, rất khó trừu tượng hóa các ký hiệu văn bản thô sơ `_ ‾ _` thành đường uốn lượn âm thanh nếu không có đồ họa trực quan.
  - Sự thiếu nhất quán giữa Tab Copilot (rất xịn sò, có biểu đồ SVG) và Tab Manual (chỉ có nút chữ thô sơ) làm giảm chất lượng tổng thể của ứng dụng.
* **Đề xuất khắc phục (To-Be)**:
  Ngay phía dưới lưới chọn mẫu cao độ trong form thủ công, khi `formData.reading` có giá trị và người dùng chọn một pattern, hiển thị ngay component `<PitchAccentGraph reading={formData.reading} pattern={Number(formData.pitch)} />` với animation mượt mà.

---

### 4.2.6. DEF-UI-SHODO-006: Xếp Chồng 3 Lớp Texture Tranh Mộc Bản Gây Nhiễu Thị Giác
* **Vị trí**: [src/app/cards/new/page.tsx:199, 246, 357](file:///d:/project/japanese-srs-system/src/app/cards/new/page.tsx#L199-L364).
* **Phân loại**: **Thừa (Aesthetic Bloat & Visual Clutter)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Trong cùng một màn hình đơn giản, có tới 3 lớp tranh nghệ thuật chồng chéo:
  1. Dòng 199: Toàn trang phủ hình hoa anh đào mạ kim `gold-sakura-washi.webp` (opacity 0.065).
  2. Dòng 246: Banner Kakejiku chứa tranh Hokusai Hạc trắng ngắm Phú Sĩ `hokusai-cranes-fuji.jpg` (opacity 0.32).
  3. Dòng 357: Khung form Copilot tiếp tục chèn thêm texture mây sương mù `cloud-mist-kasumi-icons.webp` (opacity 0.12).
* **Tác động tâm lý & công thái học**:
  - **Vi phạm Nguyên lý Tinh tế Wabi-Sabi & Shibui**: Nghệ thuật truyền thống Nhật Bản tôn vinh sự tối giản, khoảng lặng thanh lọc tâm trí. Việc lạm dụng liên tiếp hoa anh đào, hạc mộc bản, và mây Kasumi khiến giao diện trở nên màu mè kiểu kitsch (sáo rỗng), làm người học phân tâm khỏi nhiệm vụ cốt lõi: nhập liệu chuẩn xác và tập trung ghi nhớ.
  - **Giảm độ tương phản văn bản**: Các chi tiết mây Kasumi đè dưới nhãn trường nhập liệu làm giảm độ sắc nét của chữ Kanji nét thanh nét đậm.
* **Đề xuất khắc phục (To-Be)**:
  Loại bỏ texture `cloud-mist-kasumi-icons.webp` bên trong form nhập liệu. Giữ nền form sạch sẽ bằng tông màu Washi ấm (`#FAF7F0`) với viền chỉ vàng mộc miên mảnh mai (`1px solid #E6DDCF`). Giữ tranh Hokusai trên banner tiêu đề nhưng tăng độ chuyển gradient đen mờ để chữ tiêu đề nổi bật rõ ràng, đạt chuẩn tương phản WCAG AAA.

---

### 4.2.7. DEF-UI-SHODO-007: Lưới Chọn Mẫu Pitch Accent Vỡ Layout Trên Màn Hình Nhỏ
* **Vị trí**: [src/app/cards/new/page.tsx:790](file:///d:/project/japanese-srs-system/src/app/cards/new/page.tsx#L790).
* **Phân loại**: **Lỗi hiển thị (Responsive Grid Overflow)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Đoạn mã:
  ```tsx
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.65rem' }}>
  ```
  Trên màn hình iPhone SE hoặc các thiết bị di động có chiều rộng khả dụng khoảng 320px - 340px (sau khi trừ lề padding 1rem mỗi bên còn ~290px), lưới `minmax(160px, 1fr)` chỉ chứa được 1 cột duy nhất hoặc nếu ép 2 cột sẽ vượt quá 320px, làm xuất hiện thanh cuộn ngang khó chịu hoặc khiến các nút bị nén vụn vỡ chữ.
* **Tác động tâm lý & công thái học**:
  Gây ức chế khi người dùng thao tác bằng một tay trên điện thoại. Nút bấm bị tràn màn hình làm mất đi tính hoàn hảo của trải nghiệm mobile.
* **Đề xuất khắc phục (To-Be)**:
  Sử dụng media query hoặc điều chỉnh thành `grid-cols-2 sm:grid-cols-4` với `minmax(0, 1fr)` kết hợp flex-wrap thông minh, đảm bảo trên màn hình hẹp các nút tự động chia đều 2x2 cân xứng hoàn mỹ.

---

### 4.2.8. DEF-UI-SHODO-008: Thiếu Tự Động Chuyển Đổi Romaji Sang Hiragana (WanaKana IME Binding)
* **Vị trí**: [src/app/cards/new/page.tsx:463, 777-783](file:///d:/project/japanese-srs-system/src/app/cards/new/page.tsx#L777-L783).
* **Phân loại**: **Thiếu (Ergonomic Input Barrier)**.
* **Mức độ nghiêm trọng**: **P1 (Cao)**.
* **Hiện trạng (As-Is)**:
  Ô nhập liệu `Cách đọc (Hiragana / Furigana)` là một thẻ `<input type="text">` thông thường. Người dùng gõ phím bắt buộc phải cài đặt bộ gõ tiếng Nhật của hệ điều hành (Microsoft IME trên Windows hoặc Mozc trên Linux). Nếu người học đang mượn máy, dùng máy công cộng, hoặc chưa bật IME, khi gõ `watashi`, ô input sẽ nhận nguyên chuỗi chữ cái Latin `watashi` thay vì biến thành `わたし`.
* **Tác động tâm lý & công thái học**:
  - Tăng Interaction Cost rất cao: Người học phải mở tab mới tra Google Dịch hoặc Romaji-to-Kana converter, gõ xong rồi copy-paste ngược lại vào form.
  - Dễ dẫn đến sai sót dữ liệu: Rất nhiều người dùng mới nhập cách đọc bằng Romaji (`sakura`), làm hỏng chức năng sinh biểu đồ Pitch Accent (vốn yêu cầu mora bằng Hiragana để phân tách âm tiết).
* **Đề xuất khắc phục (To-Be)**:
  Tích hợp thư viện gọn nhẹ `wanakana` (hoặc custom IME hook) trực tiếp vào ô nhập Furigana. Khi người dùng gõ ký tự Romaji, hệ thống tự động chuyển đổi tức thời (on-the-fly IME transliteration) sang Hiragana chuẩn:
  ```tsx
  import * as wanakana from 'wanakana';

  <input
    type="text"
    placeholder="ví dụ: さくら (gõ 'sakura' tự đổi sang kana)"
    value={formData.reading}
    onChange={(e) => {
      const converted = wanakana.toHiragana(e.target.value, { IMEMode: true });
      setFormData({ ...formData, reading: converted });
    }}
    className="washi-input font-maru"
  />
  ```

---

### 4.2.9. DEF-UI-SHODO-009: Giới Hạn Cứng Mẫu Pitch Accent Không Hỗ Trợ Từ Đa Âm Tiết
* **Vị trí**: [src/app/cards/new/page.tsx:791-796](file:///d:/project/japanese-srs-system/src/app/cards/new/page.tsx#L791-L796).
* **Phân loại**: **Sai Ngữ Học & Giới Hạn Nghiệp Vụ (Linguistic Inaccuracy)**.
* **Mức độ nghiêm trọng**: **P1 (Cao)**.
* **Hiện trạng (As-Is)**:
  Danh sách mẫu cao độ bị cố định ở 4 giá trị số:
  - 0: Heiban
  - 1: Atamadaka
  - 2: Nakadaka (đỉnh ở mora 2)
  - 3: Odaka (đỉnh ở mora cuối, rơi ở trợ từ)
  Tuy nhiên, trong tiếng Nhật chuẩn Tokyo, một từ 4 âm tiết như `あさって` (Asatte) có trọng âm ở mora 3 (Nakadaka 3), từ 5 âm tiết như `おとうと` (Otouto) có trọng âm ở mora 4. Cách thiết kế chỉ cho phép chọn [0, 1, 2, 3] khiến người học không thể tạo thẻ với mẫu Nakadaka ở vị trí mora lớn hơn 2.
* **Tác động tâm lý & công thái học**:
  - Dẫn đến việc người học gán nhầm mẫu cao độ, phát âm sai lệch tiếng Nhật tự nhiên.
  - Phá vỡ tính chính xác sư phạm của hệ thống SRS cao cấp.
* **Đề xuất khắc phục (To-Be)**:
  Tạo bộ chọn Pitch Accent tương tác thích ứng theo độ dài từ vựng (Dynamic Mora Pitch Picker):
  1. Khi người dùng nhập cách đọc `あさって` (3 mora), hệ thống tính toán ra 3 mora: `あ - さ - って`.
  2. Hiển thị thanh bấm trực quan từng mora: cho phép người dùng click trực tiếp vào mora nào là đỉnh rơi cao độ (Pitch Drop Nucleus). Nếu click mora 1 -> [1], mora 2 -> [2], mora 3 và rơi ở trợ từ -> [3], không rơi ở đâu -> [0] (Heiban).
  3. Cách tiếp cận này vừa chuẩn xác ngữ âm học 100%, vừa đem lại trải nghiệm tương tác trực quan đỉnh cao.

---

### 4.2.10. DEF-UI-SHODO-010: Thiếu Cơ Chế Duyệt/Hủy Hàng Loạt Khi Copilot Phân Rã Thẻ
* **Vị trí**: [src/app/cards/new/page.tsx:530-550](file:///d:/project/japanese-srs-system/src/app/cards/new/page.tsx#L530-L550).
* **Phân loại**: **Thiếu (Batch Interaction Void)**.
* **Mức độ nghiêm trọng**: **P1 (Cao)**.
* **Hiện trạng (As-Is)**:
  Khi AI Copilot phân tích một từ đa nghĩa (ví dụ: `かける` - Kakeru có tới 5 nét nghĩa độc lập) và sinh ra 5 bản nháp thẻ theo chuẩn atomicity, người dùng buộc phải cuộn chuột dài và bấm nút "Lưu vào kho thẻ FSRS" từng thẻ một (5 lần bấm). Nếu AI sinh ra 1 thẻ không đúng ý, người dùng không có nút "Hủy thẻ này" (Discard Draft) hay "Sinh lại câu ví dụ khác" (Regenerate Context).
* **Tác động tâm lý & công thái học**:
  - Vi phạm Định luật Fitts và Luật Hick: Gia tăng số lượng click chuột không cần thiết.
  - Cảm giác bị trói buộc (Lack of Freedom): Nếu trong 5 bản nháp chỉ có 3 bản tốt, người dùng không thể xóa 2 bản thừa mà phải để mặc chúng hiển thị trên màn hình.
* **Đề xuất khắc phục (To-Be)**:
  Bổ sung thanh điều khiển tổng thể ở đầu danh sách bản nháp:
  - Nút bấm `[✓ Duyệt & Lưu tất cả (Approve All)]` có biểu tượng Torii đỏ son.
  - Trên từng thẻ bản nháp, bổ sung nút icon rác mộc bản `[✕ Bỏ qua]` và nút cọ quét `[🔄 Sinh lại câu khác]`.

---

### 4.2.11. DEF-UI-SHODO-011: Thông Báo Lưu Thẻ Tự Biến Mất Gây Giật Khung Hình (CLS)
* **Vị trí**: [src/app/cards/new/page.tsx:179, 708-723](file:///d:/project/japanese-srs-system/src/app/cards/new/page.tsx#L708-L723).
* **Phân loại**: **Lỗi hiển thị / Công thái học (CLS & Lack of Follow-up Action)**.
* **Mức độ nghiêm trọng**: **P2 (Trung bình)**.
* **Hiện trạng (As-Is)**:
  Sau khi lưu thành công thẻ thủ công:
  ```tsx
  setSaveSuccess(`Đã lưu thẻ "${formData.front}" thành công vào hệ thống!`);
  setTimeout(() => setSaveSuccess(null), 4000);
  ```
  Banner xanh lá hiện ra ở đầu form đẩy toàn bộ các ô nhập bên dưới tụt xuống khoảng 50px. Sau 4 giây, banner đột ngột biến mất (unmount), làm toàn bộ form nhảy ngược lên trên ngay khi người dùng có thể đang chuẩn bị click chuột vào ô nhập Kanji để tạo thẻ tiếp theo. Đồng thời, thông báo không có đường dẫn tới thẻ vừa tạo.
* **Tác động tâm lý & công thái học**:
  - Gây hiện tượng nhảy layout ngoài ý muốn (Cumulative Layout Shift - CLS), vi phạm chỉ số Web Vitals của Google. Người dùng dễ bấm hụt chuột hoặc gõ nhầm vị trí.
  - Thiếu hành động tiếp nối (Follow-up CTA): Người dùng không thể bấm xem ngay thẻ vừa tạo trong kho thẻ.
* **Đề xuất khắc phục (To-Be)**:
  Giữ thông báo lưu thành công ở vị trí cố định dạng Toast nổi (fixed floating toast) hoặc thanh trạng thái chân form không đẩy luồng văn bản (Zero Layout Shift). Kèm theo nút liên kết `[Xem thẻ vừa tạo →]` dẫn tới `/cards?highlight=new_id`.

---

### 4.2.12. DEF-UI-SHODO-012: Trạng Thái Phản Hồi Giọng Đọc Web Speech Còn Thô Sơ
* **Vị trí**: [src/app/cards/new/page.tsx:592, 627](file:///d:/project/japanese-srs-system/src/app/cards/new/page.tsx#L592).
* **Phân loại**: **Thiếu (Accessibility & System Feedback Void)**.
* **Mức độ nghiêm trọng**: **P3 (Thấp)**.
* **Hiện trạng (As-Is)**:
  Component `<JapaneseSpeakerButton text={...} />` khi bấm vào không có hiệu ứng gợn sóng âm thanh (audio wave pulsation). Nếu trình duyệt của người dùng (ví dụ: Firefox trên Linux không cài sẵn gói giọng đọc `ja-JP`) không phát được âm thanh, nút bấm hoàn toàn im lặng mà không hề báo lỗi cho người dùng biết nguyên nhân.
* **Tác động tâm lý & công thái học**:
  Người dùng bấm nút nhiều lần vì nghĩ nút bị hỏng hoặc mạng chậm.
* **Đề xuất khắc phục (To-Be)**:
  Thêm hiệu ứng sóng âm ba chấm chuyển động khi audio đang nói, và hiển thị tooltip thông báo nếu trình duyệt không tìm thấy giọng phát âm tiếng Nhật `ja-JP`.

---

## 4.3. BẢNG MA TRẬN ĐỐI CHIẾU TRẠNG THÁI AS-IS VÀ TO-BE (SHODO DESK)

| Tiêu Chí Đánh Giá | Hiện Trạng (As-Is) | Thiết Kế Mục Tiêu Sau Khi Khắc Phục (To-Be) |
| :--- | :--- | :--- |
| **Giao diện nhập liệu** | Form HTML đơn điệu một cột, không có hình ảnh thẻ trực quan. | Bố cục Split-Pane: Form Washi bên trái, Live Tanzaku Card Simulator 2 mặt tương tác bên phải. |
| **Hỗ trợ gõ tiếng Nhật** | Bắt buộc cài IME ngoài; gõ Romaji giữ nguyên chữ cái Latin. | Tích hợp WanaKana tự động chuyển đổi Romaji thành Hiragana/Katakana mượt mà. |
| **Độ phủ mẫu Pitch Tokyo** | Giới hạn 4 mẫu cứng [0, 1, 2, 3], lỗi với từ 4-5 mora. | Dynamic Mora Pitch Selector cho phép chạm trực tiếp vào mora bất kỳ để hạ cao độ. |
| **Loại thẻ Cloze** | Form tĩnh không thay đổi, không có cú pháp khuyết từ. | Biến đổi thành Textarea ngữ cảnh kèm Toolbar `[+ Điền từ c1]` và xem trước khuyết từ. |
| **Xử lý lỗi hệ thống** | 7 câu lệnh `window.alert()` chặn trình duyệt gây khó chịu. | Toàn bộ chuyển thành WabiToast thanh nhã, không chặn thao tác, đạt chuẩn thẩm mỹ Wabi-Sabi. |
| **Quy trình duyệt AI** | Phải bấm duyệt từng thẻ đơn lẻ; không thể xóa/sửa câu ví dụ. | Hỗ trợ "Duyệt tất cả", xóa từng bản nháp, sinh lại câu ví dụ và chỉ số vốn từ đã học. |
| **Độ ổn định layout (CLS)** | Banner thông báo unmount sau 4s làm giật form ~50px. | Toast nổi hoặc inline status cố định, đạt chỉ số CLS = 0 tuyệt đối. |

---

## 4.4. CHECKLIST NGHIỆM THU SHODO DESK (VERIFICATION CHECKLIST)
- [ ] Bật chế độ Soạn thủ công, gõ từ vào form -> Live Preview bên cạnh cập nhật tức thì 100% nội dung.
- [ ] Chuyển sang loại thẻ `Điền từ (Cloze)` -> Form tự động hiển thị ô ngữ cảnh và thanh công cụ bọc `{{c1::...}}`.
- [ ] Nhập cách đọc bằng Romaji (`nihon`) -> Tự động chuyển thành Hiragana (`にほん`).
- [ ] Nhập từ 4 âm tiết (`おとうと`) -> Cho phép chọn điểm rơi cao độ ở mora 4 mà không bị giới hạn.
- [ ] Thử ngắt mạng và bấm Soạn thẻ với AI -> Không xuất hiện `window.alert()`, thay vào đó là WabiToast đỏ son dịu nhẹ.
- [ ] Copilot sinh ra 3 bản nháp -> Hiển thị nút "Duyệt tất cả 3 thẻ" và nút xóa riêng cho từng bản nháp.


---

### 4.5 XỬ LÝ CHU KỲ BỘ GÕ IME (INPUT METHOD EDITOR) & QUẢN TRỊ TRẠNG THÁI AUDIO BLOB TRÊN BÀN THƯ PHÁP SHODO DESK

#### 1. Phân tích Chi tiết Vòng đời Bộ gõ IME Nhật Bản (Mozc / MS Japanese IME / ATOK)
* **Bản chất kỹ thuật của việc gõ chữ Hán**:
  - Không giống như bảng chữ cái Latinh nơi mỗi lần nhấn phím `keydown` sinh ra một ký tự duy nhất được xác lập ngay lập tức, việc nhập liệu tiếng Nhật trải qua một chu kỳ phức tạp gồm 3 pha:
    1. `compositionstart`: Người dùng bắt đầu nhập chuỗi âm vị (ví dụ: gõ `k-a-n-j-i` hiển thị chuỗi gạch chân `かんじ`).
    2. `compositionupdate`: Người dùng nhấn phím Cách (Spacebar) để mở danh sách chuyển đổi chữ Hán (Candidate Selection Window), chuỗi biến đổi thành `漢字`.
    3. `compositionend`: Người dùng nhấn phím `Enter` để chốt ứng viên chữ Hán đã chọn.
* **Lỗ hổng hiện tại trong `src/app/cards/new/page.tsx`**:
  - Ô nhập liệu chính bắt sự kiện `onKeyDown={(e) => { if (e.key === 'Enter') handleQuickSubmit(); }}`.
  - Khi người dùng nhấn `Enter` với mục đích chốt chữ Hán từ danh sách ứng viên IME, sự kiện `onKeyDown` vẫn bị bắt và coi đó là hành động bấm nút "Tạo thẻ ngay"!
  - Hệ quả tai hại: Thẻ học bị lưu vào CSDL với trạng thái dở dang (ví dụ: trường nghĩa tiếng Việt chưa kịp nhập, các câu ví dụ còn trống rỗng), gây ức chế tột cùng cho người học khi phải chuyển sang màn hình danh mục để xóa hoặc chỉnh sửa lại.
* **Đoạn mã khắc phục dứt điểm**:
  ```tsx
  const [isComposing, setIsComposing] = useState(false);

  <input
    type="text"
    className="w-full bg-[#FAF8F5] border border-[#AF7E36]/30 px-4 py-3 rounded-lg font-mincho text-xl"
    onCompositionStart={() => setIsComposing(true)}
    onCompositionEnd={() => setIsComposing(false)}
    onKeyDown={(e) => {
      // TUYỆT ĐỐI KHÔNG SUBMIT KHI ĐANG TRONG QUÁ TRÌNH CHỐT CHỮ HÁN IME
      if (e.key === 'Enter' && !isComposing && !e.nativeEvent.isComposing) {
        e.preventDefault();
        handleSaveCard();
      }
    }}
  />
  ```

#### 2. Kiến trúc Quản lý Bộ nhớ & Rò rỉ Nhị phân Audio Blob (Web Audio Memory Lifecycle)
* **Quy trình thu âm giọng đọc mẫu**:
  - Shodo Desk cung cấp tính năng thu âm phát âm của người học hoặc gắn phát âm mẫu qua `MediaRecorder API`.
  - Sau mỗi phiên thu âm thử nghiệm, một đối tượng `Blob` âm thanh được tạo ra và chuyển đổi thành URL tạm thời thông qua `URL.createObjectURL(audioBlob)`.
* **Phân tích rò rỉ bộ nhớ (Memory Leak)**:
  - Mỗi URL được sinh ra bằng `createObjectURL` sẽ giữ một tham chiếu cứng (Strong Reference) tới vùng nhớ nhị phân trong bộ nhớ RAM của trình duyệt cho đến khi hàm `URL.revokeObjectURL(url)` được gọi rõ ràng hoặc toàn bộ tài liệu bị gỡ bỏ.
  - Khi người học thử thu âm lại 10 lần để chọn ra bản thu phát âm ưng ý nhất, 10 khối nhị phân âm thanh (mỗi khối từ 2MB đến 5MB) vẫn nằm kẹt trong RAM, làm tiêu hao từ 20MB đến 50MB bộ nhớ mà Garbage Collector không thể thu hồi được.
* **Quy tắc dọn dẹp bộ nhớ bắt buộc**:
  - Mọi thao tác tạo URL Blob đều phải được gắn vào `useEffect cleanup function`:
    ```tsx
    useEffect(() => {
      return () => {
        if (currentAudioUrlRef.current) {
          URL.revokeObjectURL(currentAudioUrlRef.current);
          currentAudioUrlRef.current = null;
        }
      };
    }, [audioBlob]);
    ```

#### 3. Bổ sung Công cụ Cắt Tỉa Thẻ Học Nguyên Tử (Minimum Information Atomicity Linter)
* Một trong những nguyên lý căn bản của việc học thẻ ghi nhớ (SuperMemo Rule of Twenty): **"Một thẻ chỉ chứa duy nhất một hạt nguyên tử kiến thức"**.
* Giao diện hiện tại thiếu hoàn toàn cơ chế đo lường độ dài văn bản. Khi người học sao chép một đoạn văn giải thích ngữ nghĩa dài 200 từ vào mặt trước thẻ, hệ thống vẫn chấp nhận lưu trữ. Điều này biến thẻ thành một bài luận ngắn, triệt tiêu hoàn toàn khả năng hồi tưởng nhanh của thuật toán FSRS.
* Bắt buộc hiển thị đồng hồ đo nguyên tử:
  - Nếu mặt trước thẻ vượt quá **30 ký tự**: Hiển thị cảnh báo vàng rơm: `⚠️ Thẻ quá dài! Cân nhắc tách thành 2 thẻ nguyên tử để đảm bảo hiệu quả ghi nhớ FSRS`.
  - Nếu có nhiều hơn 2 nghĩa trong một thẻ: Đề xuất nút bấm 1 chạm: `[Tách thẻ tự động]`.

