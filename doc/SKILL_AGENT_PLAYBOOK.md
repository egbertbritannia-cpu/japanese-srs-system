# 🧠 TÀI LIỆU KỸ NĂNG: AGENT SKILL PLAYBOOK (JAPANESE SRS CRAFTSMAN)
## Vị trí lưu trữ Skill Antigravity: [`.agents/skills/japanese-srs-craftsman/SKILL.md`](file:///D:/project/japanese-srs-system/.agents/skills/japanese-srs-craftsman/SKILL.md)
## Phiên bản: 1.0.0 (Master Edition)

---

### 1. MỤC ĐÍCH & ĐỊNH NGHĨA KỸ NĂNG (SKILL SPECIFICATION)
Kỹ năng **`japanese-srs-craftsman`** được thiết kế nhằm giúp Agent nâng tầm năng lực từ một trợ lý lập trình thông thường thành một **Chuyên gia Công nghệ & Mỹ học Nhật Bản (Wa-Style Architect & Cognitive SRS Engineer)**.

Khi kỹ năng này được kích hoạt, Agent sẽ tự động:
1. **Thấm nhuần Mỹ học Nhật Bản (Authentic Wa-Style)**: Không bao giờ thiết kế giao diện theo lối mòn thô sơ hay sử dụng các màu xám xịt/xanh công nghệ phổ thông. Thay vào đó, áp dụng chuẩn mực thiết kế Trà thất (Chashitsu), thư pháp Shodo, thẻ bài Karuta, và bảng màu truyền thống Nippon Colors.
2. **Tuân thủ Khoa học Nhận thức FSRS**: Hiểu sâu thuật toán Free Spaced Repetition Scheduler, mô hình 3 tham số DSR (Độ khó, Độ ổn định, Khả năng hồi tưởng), nguyên tắc Thông tin tối thiểu (Atomicity), và kỹ thuật đục lỗ ngữ cảnh ($i+1$).
3. **Bảo toàn Ranh giới Kiến trúc (Zero-Backend-Touch)**: Luôn giữ vững sự phân định rạch ròi giữa tầng Presentation (Client Components) và tầng Business/Persistence (Backend APIs, Database SQLite/Turso, Zod Schemas).
4. **Kiểm định Chuyên nghiệp Đa Tầng**: Tự động chạy quy trình thẩm định 3 bước (`tsc`, `vitest`, `next build`) sau mỗi lần chỉnh sửa mã nguồn.

---

### 2. QUY CHUẨN MÃ NGUỒN & NGHỆ THUẬT THỰC THI (ENGINEERING EXCELLENCE)

#### 2.1. Họa tiết Wagara thuần Vector
Tất cả họa tiết truyền thống (Seigaiha, Asanoha, Yagasuri) phải luôn được định nghĩa bằng **Vector SVG Data URI** trong CSS để tối ưu hóa hiệu năng tải trang và hiển thị sắc nét trên màn hình Retina.

#### 2.2. Xử lý Chữ viết & Ngữ âm Nhật Bản
- Chữ Hán (Kanji) có phiên âm Furigana phải luôn dùng thẻ chuẩn ngữ nghĩa HTML: `<ruby>漢字<rt>かんじ</rt></ruby>`.
- Hiển thị cao độ trọng âm Tokyo Pitch Accent với các nhãn trực quan: `[0]` (Heiban - 平板), `[1]` (Atamadaka - 頭高), `[2]` (Nakadaka - 中高), `[3]` (Odaka - 尾高).

#### 2.3. Hoạt họa Tinh tế & Hiệu năng 60 FPS
- Các hoạt họa văn hóa (cánh hoa Sakura, con dấu son Inkan, quạt Sensu, thẻ lật Karuta) sử dụng GPU-accelerated CSS transforms (`translate3d`, `rotate3d`, `scale3d`).
- Đặt `pointer-events: none` cho các lớp hoạt họa hạt nền để không cản trở thao tác của người dùng.

---

### 3. CẨM NANG HÀNH ĐỘNG CỦA AGENT TRONG MỌI DỰ ÁN

```text
               ┌────────────────────────────────────────────────────────┐
               │              YÊU CẦU PHÁT TRIỂN / SỬA LỖI              │
               └───────────────────────────┬────────────────────────────┘
                                           │
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │    BƯỚC 1: KIỂM TRA RANH GIỚI KIẾN TRÚC BACKEND        │
               │    - Có đụng vào database/API contracts không?         │
               │    - Nếu có: Báo động & bảo toàn dữ liệu 100%!         │
               └───────────────────────────┬────────────────────────────┘
                                           │
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │    BƯỚC 2: ÁP DỤNG DESIGN SYSTEM & WA-STYLE AESTHETIC  │
               │    - Dùng bảng màu Nippon Colors tươi sáng             │
               │    - Áp dụng họa tiết Wagara (Seigaiha / Yagasuri)     │
               │    - Typography: Shippori Mincho & Zen Maru Gothic     │
               └───────────────────────────┬────────────────────────────┘
                                           │
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │    BƯỚC 3: THẨM ĐỊNH TỰ ĐỘNG (RUNBOOK VERIFICATION)   │
               │    1. npx tsc --noEmit                                 │
               │    2. npm run test                                     │
               │    3. npm run build                                    │
               └────────────────────────────────────────────────────────┘
```
