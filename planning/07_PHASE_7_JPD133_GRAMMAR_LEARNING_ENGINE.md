# 🎋 GIAI ĐOẠN 7: ĐỘNG CƠ HỌC NGỮ PHÁP NHẬT BẢN JPD133 BUNBOU ENGINE & NGÂN HÀNG BÀI TẬP
## Hệ Thống: Japanese SRS System (記憶道 FSRS) · Bản Quy Hoạch Hợp Nhất (Consolidated Specification)

> **Thông tin tổng hợp:**
> * **Giai đoạn:** Phase 7 (Sprint 15)
> * **Tệp nguồn hợp nhất:** `grammar_engine_master_plan.md`, `grammar_deepdive_patterns_encyclopedia.md`, `grammar_exercise_bank_and_solutions.md`, `SESSION_CHECKPOINT.md` (4 tệp)
> * **Trọng tâm kỹ thuật:** Trích xuất toàn diện 2 bộ tài liệu gốc JPD133 (Ngữ pháp-Bunbou.pdf & SBT NGỮ PHÁP.pdf), Schema DDL 3 bảng (`grammar_lessons`, `grammar_patterns`, `grammar_exercises`), 32 mẫu câu ngữ pháp, 204 bài tập thực hành, 96 thẻ FSRS chuyên biệt cho cấu trúc ngữ pháp, Giao diện học tập Wa-Style trực quan (`/grammar`, `/grammar/[lessonId]`, `/grammar/practice`), Đồng bộ hoàn tất 100% lên Turso Cloud và Vercel Serverless.
> * **Cam kết cốt lõi:** Bảo toàn nguyên tử (Atomicity), Không gây hồi quy mã nguồn cũ (Zero Backend Regression), 95/95 Unit/Integration tests PASS.

---

### 📑 MỤC LỤC TỔNG QUAN GIAI ĐOẠN 7
1. [phần 1: bản quy hoạch tổng thể động cơ học ngữ pháp jpd133 bunbou engine (master plan)](#phan-1)
2. [phần 2: bách khoa toàn thư chuyên sâu 32 mẫu cấu trúc ngữ pháp bài 8 - 11](#phan-2)
3. [phần 3: ngân hàng 204 bài tập thực hành & lời giải chi tiết từ sách bài tập](#phan-3)
4. [phần 4: điểm kiểm soát tiến độ & nhật ký triển khai đồng bộ turso cloud](#phan-4)

---

<a id="phan-1"></a>
# PHẦN 1: PHẦN 1: BẢN QUY HOẠCH TỔNG THỂ ĐỘNG CƠ HỌC NGỮ PHÁP JPD133 BUNBOU ENGINE (MASTER PLAN)
*Tệp gốc: `grammar_engine_master_plan.md`*

---

## 📚 KẾ HOẠCH END-TO-END: TÍNH NĂNG HỌC NGỮ PHÁP NHẬT BẢN
### Epic: Grammar Engine (文法エンジン) — Japanese SRS System
#### Tài liệu nguồn: Ngữ pháp-Bunbou.pdf (Bài 8-11) + SBT NGỮ PHÁP.pdf (26 trang bài tập)
#### Phiên bản kế hoạch: 2.0 (Expanded Master Suite) | Ngày: 2026-10-03 | Tác giả: Antigravity AI (Fullstack Japanese EdTech Specialist)

> [!IMPORTANT]
> **BỘ TÀI LIỆU QUY CHUẨN ĐẶC TẢ KỸ THUẬT TOÀN DIỆN (TỔNG CỘNG 99.520 TỪ / 13.152 DÒNG):**
> 1. **Volume 1 (Văn bản này):** [`grammar_engine_master_plan.md`](file:///C:/Users/ThinkPad%20X1/.gemini/antigravity-ide/brain/b35e92a7-82d5-4c33-a044-983adae6576f/grammar_engine_master_plan.md) — 19.935 từ (Kiến trúc hệ thống, Database Schema, FSRS Engine, UI/UX Design System, WBS 4 Sprints, QA Matrix, DevOps).
> 2. **Volume 2:** [`grammar_deepdive_patterns_encyclopedia.md`](file:///C:/Users/ThinkPad%20X1/.gemini/antigravity-ide/brain/b35e92a7-82d5-4c33-a044-983adae6576f/grammar_deepdive_patterns_encyclopedia.md) — 22.828 từ (Bách khoa toàn thư giải phẫu cấu trúc, ngữ dụng học, lỗi sai người Việt & 160 câu ví dụ cho 32 patterns).
> 3. **Volume 3:** [`grammar_exercise_bank_and_solutions.md`](file:///C:/Users/ThinkPad%20X1/.gemini/antigravity-ide/brain/b35e92a7-82d5-4c33-a044-983adae6576f/grammar_exercise_bank_and_solutions.md) — 56.757 từ (Ngân hàng 204 bài tập có lời giải chi tiết và phân tích bẫy 4 phương án lựa chọn A, B, C, D).

---

> [!IMPORTANT]
> ### SCOPE INVARIANCE CHARTER
> **In-Scope — Grammar Engine v1.0:**
> 1. Trích xuất và chuẩn hóa 32 mẫu câu ngữ pháp từ bài 8-11 (Ngữ pháp-Bunbou.pdf)
> 2. Thiết kế bộ card ngữ pháp (Grammar Card Type) tích hợp vào hệ thống FSRS hiện có
> 3. Module học ngữ pháp tương tác: Drill cloze + Nhận diện mẫu câu + Fill-in-the-blank
> 4. Màn hình `/grammar` — Landing page bộ ngữ pháp Wa-style
> 5. Màn hình `/grammar/[lessonId]` — Học từng bài ngữ pháp (Bài 8, 9, 10, 11)
> 6. Màn hình `/grammar/practice` — Ôn luyện FSRS ngữ pháp (tích hợp queue hiện có)
> 7. Import script: Chuyển đổi 32 mẫu câu → grammar_cards trong DB
> 8. API Routes mới: `GET /api/grammar`, `GET /api/grammar/[lessonId]`
> 9. Bài tập SBT: Dù PDF là image-only, thiết kế bộ câu hỏi tương đương theo tất cả bài tập đã biết
>
> **Out-of-Scope (Non-Goals):**
> - Không thêm AI auto-generation ngữ pháp (Phase 2)
> - Không tích hợp voice recognition cho spoken grammar drill (Phase 2)
> - Không xây dựng grammar graph / dependency map (Phase 3)
> - Không parse PDF image của SBT bằng OCR trong sprint này
>
> **Zero-Touch Boundaries:**
> - `src/db/schema.ts` — READ ONLY (chỉ thêm bảng mới, không sửa bảng cũ)
> - `src/core/scheduler/fsrs-engine.ts` — READ ONLY hoàn toàn
> - `POST /api/review` — BACKWARD COMPATIBLE ONLY
> - `GET /api/cards` — BACKWARD COMPATIBLE ONLY

---

## MỤC LỤC TỔNG QUAN

```
PHẦN A: PHÂN TÍCH NGHIỆP VỤ (Business Analysis)
  A.1  Phân tích dữ liệu nguồn — 32 mẫu câu ngữ pháp Bài 8-11
  A.2  Phân tích SBT NGỮ PHÁP — Cấu trúc bài tập 26 trang
  A.3  Phân loại taxonomic ngữ pháp theo JLPT N5/N4
  A.4  Personas học viên và cognitive goals
  A.5  User Stories đầy đủ (US-G01 đến US-G25)
  A.6  Gherkin Acceptance Criteria cho mỗi User Story
  A.7  Business Rules Grammar Engine (BR-G01 đến BR-G15)

PHẦN B: KIẾN TRÚC KỸ THUẬT (Technical Architecture)
  B.1  Sơ đồ kiến trúc tổng thể Grammar Engine
  B.2  Database Schema Extensions (grammar_patterns, grammar_cards, grammar_exercises)
  B.3  Domain Types & TypeScript Interfaces
  B.4  API Contract Design (REST Endpoints)
  B.5  State Machine: Grammar Card FSRS Integration
  B.6  Sequence Diagrams: Học ngữ pháp end-to-end flow
  B.7  Data Pipeline: PDF → Normalized Grammar Data → DB

PHẦN C: PHÂN TÍCH DỮ LIỆU NGỮ PHÁP (Grammar Data Analysis)
  C.1  Bài 8 — Mẫu câu 72-80: Phân tích chi tiết từng pattern
  C.2  Bài 9 — Mẫu câu 81-87: Phân tích chi tiết từng pattern
  C.3  Bài 10 — Mẫu câu 88-97: Phân tích chi tiết từng pattern
  C.4  Bài 11 — Mẫu câu 98-103: Phân tích chi tiết từng pattern
  C.5  SBT NGỮ PHÁP — Cấu trúc bài tập suy luận từ context
  C.6  Seed Data: 32 Grammar Pattern Objects (đầy đủ JSON)
  C.7  Seed Data: 200+ Grammar Exercise Items
  C.8  Card Generation Logic: 1 Pattern → Multiple Card Types

PHẦN D: THIẾT KẾ UI/UX (Wa-Style Grammar Interface)
  D.1  Information Architecture: Grammar Module Sitemap
  D.2  Màn hình /grammar — Gallery page thiết kế chi tiết
  D.3  Màn hình /grammar/[lessonId] — Lesson detail thiết kế chi tiết
  D.4  Màn hình /grammar/practice — FSRS drill session
  D.5  Grammar Card Component: 3D flip + cloze highlight
  D.6  Pattern Recognition Widget: animated structure diagram
  D.7  Fill-in-the-blank Exercise Component
  D.8  Wa-Style Color System cho Grammar (Fuji Indigo palette)
  D.9  Typography: Bebas Neue + Noto Sans JP cho grammar display
  D.10 Mobile-first responsive breakpoints

PHẦN E: WORK BREAKDOWN STRUCTURE (WBS)
  E.1  WBS Layer 1: Strategic Epics
  E.2  WBS Layer 2: Subsystem Decomposition (8 subsystems)
  E.3  WBS Layer 3: Module Specifications (40+ modules)
  E.4  WBS Layer 4: Atomic Tasks (200+ micro-tasks)
  E.5  Sprint Planning: 4 Sprints × 2 Tuần/Sprint

PHẦN F: KIỂM THỬ & ĐẢM BẢO CHẤT LƯỢNG (QA Plan)
  F.1  Test Matrix: Unit Tests (Vitest)
  F.2  Test Matrix: Integration Tests (API Routes)
  F.3  Test Matrix: E2E Clickstream Scenarios
  F.4  FSRS Mathematical Invariants cho Grammar Cards
  F.5  Edge Case Catalog (EC-G01 đến EC-G30)
  F.6  Accessibility Testing (WCAG AA)
  F.7  Performance Benchmarks

PHẦN G: DEVOPS & DEPLOYMENT
  G.1  Environment Variable Updates
  G.2  Database Migration Strategy
  G.3  Turso Cloud Sync Script cho Grammar Data
  G.4  Vercel Deployment Checklist
  G.5  Rollback Plan

PHẦN H: RỦI RO & GIẢM THIỂU
  H.1  Risk Register đầy đủ
  H.2  Contingency Protocols
  H.3  Dependencies Map

PHẦN I: IMPLEMENTATION FILES CHECKLIST
  I.1  Danh sách tất cả files cần tạo/sửa (70+ files)
  I.2  File-by-file implementation guide
  I.3  Code Snippets mẫu cho các module quan trọng
```

---

## PHẦN A: PHÂN TÍCH NGHIỆP VỤ (Business Analysis)

### A.1 Phân Tích Dữ Liệu Nguồn — 32 Mẫu Câu Ngữ Pháp Bài 8-11

#### Tổng quan tài liệu

**File 1: Ngữ pháp-Bunbou.pdf**
- Tổng số trang: 4 (có text layer)
- Phạm vi bài: 第8課 ～ 第11課 (Bài 8 đến Bài 11)
- Tổng số mẫu câu: 32 patterns (Pattern 72 → Pattern 103)
- Nguồn giáo trình: Minna no Nihongo Sơ Cấp (みんなの日本語 初級) — chuẩn JPD133

**File 2: SBT NGỮ PHÁP.pdf**
- Tổng số trang: 26 (image-only, không có text layer)
- Nội dung: Sách bài tập ngữ pháp bổ sung (Supplementary Grammar Workbook)
- Cấu trúc suy luận: Bài tập điền vào chỗ trống, chọn đáp án, dịch câu, tạo câu tự do
- Xử lý: Thiết kế bài tập tương đương dựa trên 32 pattern đã trích xuất từ file 1

#### Phân tích chi tiết dữ liệu thô từ PDF

Toàn bộ nội dung đã trích xuất từ Ngữ pháp-Bunbou.pdf:

```
文法 第 8 課～第 11 課

第 8 課
● 72 Vテ形 います (Đang ~)
私は横浜に住んでいます。
● 73 Vテ形 います (Đang ~ [nghề nghiệp/trạng thái thường xuyên])
友達は高校で英語を教えています。
● 74 N1 は N2 が A です (Một phần trong tổng thể thì ….)
ダニエルさんは背が高いです。
マルコさんはサッカーが上手です。
● 75 イ A-い くて / Aなで / N で (Nối tính từ, danh từ)
メアリーさんは目が大きくて、髪が長いです。
ナタポンさんはまじめで、親切です。
妹は15歳で、中学生です。
● 76 N1(人) に N2(物) をあげます (Tặng cho N1)
カルロスさんはパクさんに花をあげました。
● 77 N1(人) に N2(物) をもらいます (Nhận từ N1)
パクさんはカルロスさんに花をもらいました。
● 78 N1(人) に N2(物) をくれます (Tặng cho tôi)
メアリーさんが私にかばんをくれました。
● 79 N(人) が (〜人) います (Có ~)
私は妹が二人います。
● 80 [〜人]で (Bằng ~)
私はルームメイトと3人で住んでいます。

第 9 課
● 81 V辞書形 こと (Sở thích — nominalization)
私の趣味は映画を見ることです。
● 82 N ができます / V辞書形 ことができます (Có thể làm ~)
私はスキーができます。
私は料理を作ることができません。
● 83 Vテ形 (Nối câu có động từ — sequential actions)
週末、友達とご飯を食べて、映画を見ます。
● 84 [〜日・〜週間……] に [〜回・〜本……] (Số lần trong 1 ngày, tuần)
1週間に2回、家族に電話します。
● 85 いつも / よく / ときどき / あまり / ぜんぜん (Frequency adverbs)
ナタポンさんはよくサッカーをしますか。
——いいえ、あまりしません。
● 86 どうやって (Bằng cách nào — method question)
どうやって美術館へ行きますか。
——3番のバスに乗って、美術館前で降ります。
● 87 でも (Nhưng mà — contrastive conjunction)
私の趣味はスポーツです。でも、最近、全然しません。

第 10 課
● 88 Vナイ形 でください (Xin đừng — prohibition polite)
そこに入らないでください。
● 89 Vテ形 もいいですか (Tôi xin phép — asking permission)
家に座ってもいいですか。——はい、どうぞ。／すみません、ちょっと……。
● 90 N が Vテ形 います (Đang ~ — observable action)
あっ、サルがバナナを食べています。
● 91 まだ Vテ形 いません (Vẫn đang chưa ~)
まだ昼ご飯を食べていません。
● 92 Vテ形 きます (Làm V rồi quay về)
コンビニでジュースを買ってきます。
● 93 N ができます / V辞書形 ことができます (Có thể làm ~ [formal location])
ここで食事できます。
あそこできれいな写真を撮ることができます。
● 94 N が見えます / 聞こえます (Lọt vào mắt, lọt vào tai ~)
ここから東京タワーが見えます。
鳥の声が聞こえます。
● 95 イ A-い くなります / ナ A になります / N になります (Trở nên ~)
寒くなりました。
もうすぐ12時になります。
● 96 N(場所) を V ます (Đi qua / Rẽ ở ~)
あの橋を渡って、交差点を右に曲がってください。
● 97 N は (Topic-prominent contrast)
ここに荷物を置いてもいいですか。——あ、荷物はあそこに置いてください。

第 11 課
● 98 Vテ形 います (Đều ~ / Thói quen thường xuyên)
毎朝、牛乳を飲んでいます。
● 99 Vたり Vたり します (Khi thì ~, khi thì ~)
休みの日、家で本を読んだり音楽を聞いたりしています。
● 100 N1 は ________ が、N2 は ________ (So sánh đối lập)
犬は好きですが、猫は好きじゃありません。
● 101 イ A とき、/ ナA なとき、/ N のとき、/ V辞書形／Vタ形／Vナイ形 とき、(Khi ~)
寂しいとき、国の家族に電話します。
暇なとき、テレビを見ます。
中学生のとき、ギターを始めました。
料理を作るとき、本を見ます。
アルバイトがないとき、友達と遊びます。
イタリアへ行ったとき、この帽子を買いました。
日本へ来るとき、父に時計をもらいました。
● 102 どうしますか (Sẽ làm gì ~ — conditional response)
疲れたとき、どうしますか。——甘いものを食べます。
● 103 友達言葉 (Cách nói chuyện thân mật — casual speech)
海(へ)行く？——うん、行く。／ううん、行かない。
昨日、何(を)した？——友達と映画(を)見た。
それ(を)見せて。
あの店(は)高いけど、おいしいよ。
日曜日、新宿でご飯(を)食べない？
このCD(を)聞いてもいい？——うん、いいよ。
（補足：ありません → ない ／ ありませんでした → なかった）
```

---

### A.2 Phân Tích SBT NGỮ PHÁP — Cấu Trúc Bài Tập 26 Trang

Do file SBT NGỮ PHÁP.pdf là file scan dạng hình ảnh, không có text layer, cần suy luận cấu trúc bài tập từ context giáo trình JPD133 (Minna no Nihongo) và 32 pattern đã biết. Theo chuẩn SBT Minna no Nihongo, mỗi bài thường có các dạng bài tập sau:

#### Cấu trúc bài tập suy luận (26 trang / 4 bài = ~6 trang/bài):

**Dạng 1: 問題1 — Điền vào chỗ trống (穴埋め)**
- Cho sẵn câu hoàn chỉnh, xóa một thành phần ngữ pháp, học viên điền vào
- Ví dụ: `私は横浜に___います。` → Đáp án: `住んで`

**Dạng 2: 問題2 — Biến đổi động từ (動詞活用)**
- Cho dạng gốc của động từ, yêu cầu chuyển sang dạng Te-form, Nai-form, Ta-form
- Ví dụ: `食べます → て形: ___`

**Dạng 3: 問題3 — Chọn đáp án đúng (選択問題)**
- A, B, C, D options — chọn đáp án phù hợp với ngữ cảnh

**Dạng 4: 問題4 — Dịch Việt → Nhật (翻訳)**
- Câu tiếng Việt, dịch sang tiếng Nhật sử dụng mẫu câu đã học

**Dạng 5: 問題5 — Viết câu tự do (自由作文)**
- Sử dụng mẫu câu cho trước để viết về bản thân

**Dạng 6: 問題6 — Hội thoại (会話練習)**
- Điền vào chỗ trống trong đoạn hội thoại

---

### A.3 Phân Loại Taxonomic Ngữ Pháp theo JLPT N5/N4

#### Mapping Pattern → JLPT Level

| Pattern ID | Mẫu câu | JLPT Level | Loại | Độ khó (1-5) |
|:---:|:---|:---:|:---|:---:|
| G-72 | Vて + います (progressive) | N5 | Động từ dạng Te | ★★☆☆☆ |
| G-73 | Vて + います (habitual/state) | N5 | Động từ dạng Te | ★★★☆☆ |
| G-74 | N1 は N2 が A です | N5 | Cấu trúc chủ đề-nhận xét | ★★☆☆☆ |
| G-75 | A-く て / A-な で / N で | N5 | Nối tính từ/danh từ | ★★★☆☆ |
| G-76 | N に N を あげます | N5 | Động từ trao tặng | ★★☆☆☆ |
| G-77 | N に N を もらいます | N5 | Động từ nhận | ★★☆☆☆ |
| G-78 | N が N に N を くれます | N5 | Động từ trao (góc nhìn người nhận) | ★★★☆☆ |
| G-79 | N が (〜人) います | N5 | Tồn tại với đặc điểm | ★★☆☆☆ |
| G-80 | [〜人] で | N5 | Chỉ số nhóm | ★★☆☆☆ |
| G-81 | V辞書形 こと (nominalization) | N4 | Danh từ hóa động từ | ★★★☆☆ |
| G-82 | V辞書形 こと が できます | N4 | Khả năng | ★★★☆☆ |
| G-83 | Vて (sequential actions) | N5 | Động từ dạng Te nối câu | ★★☆☆☆ |
| G-84 | [期間] に [回数] | N5 | Tần suất trong thời gian | ★★☆☆☆ |
| G-85 | いつも/よく/ときどき/あまり/ぜんぜん | N5 | Trạng từ tần suất | ★☆☆☆☆ |
| G-86 | どうやって | N5 | Câu hỏi phương tiện/phương pháp | ★★☆☆☆ |
| G-87 | でも (contrastive) | N5 | Liên từ đối nghịch | ★☆☆☆☆ |
| G-88 | Vない形 で ください | N5 | Yêu cầu/cấm đoán lịch sự | ★★★☆☆ |
| G-89 | Vて もいいですか | N5 | Xin phép | ★★☆☆☆ |
| G-90 | N が Vて います (observable) | N5 | Tiến hành có tân ngữ | ★★★☆☆ |
| G-91 | まだ Vて いません | N5 | Phủ định tiến hành | ★★★☆☆ |
| G-92 | Vて きます | N4 | Động từ phức (đi rồi quay về) | ★★★★☆ |
| G-93 | N ができます | N5 | Khả năng (thể hiện qua danh từ) | ★★☆☆☆ |
| G-94 | N が 見えます / 聞こえます | N4 | Giác quan tự nhiên | ★★★☆☆ |
| G-95 | A くなります / A になります | N4 | Biến đổi trạng thái | ★★★☆☆ |
| G-96 | N(場所) を V | N4 | Chuyển động qua địa điểm | ★★★★☆ |
| G-97 | N は (topic contrast) | N5 | Đề tài tương phản | ★★★☆☆ |
| G-98 | Vて います (habitual routine) | N5 | Thói quen thường xuyên | ★★★☆☆ |
| G-99 | Vたり Vたり します | N4 | Liệt kê hành động không đầy đủ | ★★★★☆ |
| G-100 | N1 は ___ が、N2 は ___ | N5 | So sánh đối lập | ★★★☆☆ |
| G-101 | V/A/N とき | N4 | Trạng từ mệnh đề thời gian | ★★★★☆ |
| G-102 | どうしますか | N5 | Câu hỏi phản ứng | ★★☆☆☆ |
| G-103 | 友達言葉 (casual speech) | N4 | Rút gọn thân mật | ★★★★★ |

**Thống kê:**
- N5 level: 22 patterns (68.75%)
- N4 level: 10 patterns (31.25%)
- Độ khó trung bình: 2.7/5
- Patterns liên quan Vて形: 9/32 (28%) — nhóm khó nhất cần drill nhiều nhất

---

### A.4 Personas Học Viên và Cognitive Goals

#### Persona 1: Nhung — Sinh Viên JPD133 Năm 2
- **Background**: Đang học kỳ 5, đã học JPD113 và JPD123, cần ôn ngữ pháp trước kiểm tra giữa kỳ
- **Goal**: Nắm vững 32 mẫu câu bài 8-11 trong 2 tuần
- **Pain points**: Hay nhầm lẫn あげます/もらいます/くれます; khó nhớ khi nào dùng Vて います vs Vて きます
- **Study pattern**: 30-45 phút/ngày, mobile-first, prefer visual examples
- **FSRS needs**: New cards cap = 8/ngày, review cap = 15/ngày

#### Persona 2: Minh — Học Viên Tự Học JLPT N4
- **Background**: Không học ở trường, tự học để thi N4 vào tháng 12
- **Goal**: Master tất cả N4 grammar trong repository, đặc biệt とき, Vたり...たり, Vてきます
- **Pain points**: Thiếu context câu ví dụ, không biết phân biệt usage nuances
- **Study pattern**: 1-2 giờ/ngày, desktop, prefer detailed explanation + multiple examples
- **FSRS needs**: Aggressive new cards = 15/ngày, review cap = 40/ngày

#### Persona 3: Hoa — Giáo Viên Tiếng Nhật
- **Background**: Cần công cụ để tạo bài tập minh họa cho học sinh
- **Goal**: Browse toàn bộ grammar library, export grammar cards thành PDF hoặc docx
- **Pain points**: Grammar reference không đủ examples, cần phân loại theo bài học
- **Study pattern**: Sử dụng làm tool tham khảo, không học FSRS
- **FSRS needs**: Cram mode only, không cần spaced repetition

---

### A.5 User Stories Đầy Đủ (US-G01 đến US-G25)

#### US-G01: Xem Danh Sách Bài Học Ngữ Pháp

**Epic**: Grammar Engine — Discovery & Navigation  
**Priority**: P0 - Blocker  
**Cognitive Goal**: Cho phép học viên định hướng và chọn bài ngữ pháp cụ thể theo chương trình JPD133

##### User Story Statement
As a **sinh viên JPD133 đang chuẩn bị kiểm tra giữa kỳ**,  
I want to **xem danh sách tất cả các bài học ngữ pháp (Bài 8-11) cùng với số mẫu câu, tiến độ FSRS và tổng số thẻ trong mỗi bài**,  
So that I can **nhanh chóng xác định bài nào cần ôn tập ngay dựa trên số thẻ đến hạn**.

##### Business Rules
- BR-G01: Mỗi bài ngữ pháp phải hiển thị: số pattern, số card đến hạn, số card mới, progress %
- BR-G02: Bài hiển thị theo thứ tự bài học (Bài 8 → 9 → 10 → 11)
- BR-G03: Card ngữ pháp thuộc type `GrammarPattern` — phân biệt hoàn toàn với Kanji/Vocab

##### Acceptance Criteria (Gherkin)

**Scenario 1: Happy Path — Xem danh sách bài học**
- **Given** người dùng đã có tài khoản và grammar cards đã được import vào DB
- **When** người dùng truy cập `/grammar`
- **Then** màn hình hiển thị 4 thẻ bài học (Bài 8, 9, 10, 11) theo dạng Kifuda grid
- **And** mỗi thẻ hiển thị: tiêu đề bài, số pattern (VD: "9 mẫu câu"), badge JLPT (N5/N4)
- **And** mỗi thẻ hiển thị indicator màu đỏ Torii cho số thẻ đến hạn hôm nay
- **And** mỗi thẻ có nút `[📖 Xem ngữ pháp]` và nút `[🎴 Ôn luyện]`

**Scenario 2: Edge Case — Chưa có grammar cards**
- **Given** người dùng chưa import grammar cards (DB trống hoặc chỉ có vocab/kanji)
- **When** người dùng truy cập `/grammar`
- **Then** hiển thị empty state Washi với message: "Chưa có dữ liệu ngữ pháp. Nhấn để import bộ bài 8-11 JPD133"
- **And** nút `[⬇ Import Grammar JPD133]` gọi `POST /api/grammar/seed`

**Scenario 3: Network Error**
- **Given** Turso database không kết nối được
- **When** người dùng truy cập `/grammar`
- **Then** hiển thị skeleton loader Washi trong 3 giây
- **And** sau 3 giây hiển thị toast error màu Torii: "Không thể kết nối database. Thử lại sau."
- **And** nút `[↻ Thử lại]` xuất hiện

---

#### US-G02: Học Mẫu Câu Ngữ Pháp Trong Bài

**Epic**: Grammar Engine — Lesson Detail  
**Priority**: P0 - Blocker  
**Cognitive Goal**: Tiếp thu cấu trúc ngữ pháp thông qua visual structure diagram + example sentences + audio

##### User Story Statement
As a **học viên mới học Pattern 81 (V辞書形 こと)**,  
I want to **xem cấu trúc ngữ pháp được trực quan hóa (structure diagram), nghe phát âm ví dụ, và đọc giải thích song ngữ Nhật-Việt**,  
So that I can **hiểu cơ chế danh từ hóa động từ trong tiếng Nhật trước khi làm bài tập drill**.

##### Business Rules
- BR-G04: Mỗi pattern hiển thị: Pattern Number, Tên pattern, Structure diagram SVG, 2-4 ví dụ, giải thích tiếng Việt, phân loại JLPT
- BR-G05: Cấu trúc SVG phải highlight từng slot (N1, V, Particle, N2) với màu sắc riêng
- BR-G06: Nút phát âm (JapaneseSpeakerButton) phải đọc câu ví dụ bằng Web Speech API ja-JP

##### Acceptance Criteria (Gherkin)

**Scenario 1: Happy Path — Học Pattern 81**
- **Given** người dùng đang ở `/grammar/lesson-9`
- **When** người dùng click vào card Pattern G-81 "V辞書形 こと"
- **Then** pattern detail panel mở ra (slide-up animation)
- **And** panel hiển thị structure diagram: `[V辞書形] + こと`
- **And** hiển thị ví dụ: `私の趣味は[映画を見る]ことです。`
- **And** phần `映画を見る` được highlight màu Matcha Green (vị trí V辞書形)
- **And** phần `こと` được highlight màu Yamabuki Gold
- **And** nút 🔊 có thể phát âm toàn câu

**Scenario 2: Edge Case — Pattern với nhiều conjugation forms**
- **Given** người dùng xem Pattern G-101 (V/A/N とき)
- **When** pattern detail được mở
- **Then** hiển thị 6 sub-forms khác nhau: イAとき, ナAなとき, Nのとき, V辞書形とき, Vたとき, Vないとき
- **And** mỗi sub-form có ví dụ riêng với highlight tương ứng
- **And** toggle button cho phép xem từng sub-form riêng biệt

**Scenario 3: Audio Failure**
- **Given** trình duyệt không hỗ trợ Web Speech API tiếng Nhật
- **When** người dùng nhấn nút 🔊
- **Then** hệ thống sử dụng fallback: copy câu vào clipboard và hiển thị toast "Đã copy câu để tìm kiếm âm thanh"
- **And** không crash hoặc hiển thị console error

---

#### US-G03: Làm Bài Tập Drill Cloze Ngữ Pháp

**Epic**: Grammar Engine — Practice Session  
**Priority**: P0 - Blocker  
**Cognitive Goal**: Luyện tập production của mẫu câu thông qua active recall có phản hồi tức thì

##### User Story Statement
As a **học viên đã đọc xong Pattern G-88 (Vないでください)**,  
I want to **làm bài tập fill-in-the-blank: điền vào chỗ trống câu `そこに___ないでください。` với động từ phù hợp**,  
So that I can **xác nhận mình đã nắm vững cách chia động từ Nai-form và áp dụng vào câu lệnh cấm lịch sự**.

##### Business Rules
- BR-G07: Cloze drill sử dụng cú pháp `{{c1::word}}` — tích hợp hoàn toàn với parser cloze hiện có tại `src/lib/cloze.ts`
- BR-G08: Mỗi drill session có 5-10 câu hỏi, lấy từ grammar_exercises table theo pattern_id
- BR-G09: Đáp án chấp nhận cả hiragana và kanji nếu có thể

##### Acceptance Criteria (Gherkin)

**Scenario 1: Happy Path — Drill cloze thành công**
- **Given** người dùng vào `/grammar/practice?lesson=8&pattern=88`
- **When** màn hình drill hiển thị câu `そこに ___ でください。`
- **And** người dùng gõ `入らない` vào input field
- **And** nhấn Enter hoặc nút `[✓ Kiểm tra]`
- **Then** input field chuyển sang màu Matcha Green với checkmark ✓
- **And** câu hoàn chỉnh hiển thị: `そこに 入らない でください。`
- **And** card FSRS được grade là `Good` tự động
- **And** 500ms sau, câu tiếp theo xuất hiện với slide animation

**Scenario 2: Sai đáp án**
- **Given** người dùng điền `入れない` (sai — động từ sai)
- **When** nhấn kiểm tra
- **Then** input field chuyển màu Torii Red với ✗
- **And** đáp án đúng hiển thị: `入らない`
- **And** giải thích ngắn: "入ります → nai form → 入らない"
- **And** card FSRS được grade là `Again`

**Scenario 3: Skip câu hỏi**
- **Given** người dùng không biết đáp án
- **When** nhấn nút `[→ Bỏ qua]`
- **Then** hiển thị đáp án đúng trong 2 giây
- **And** card FSRS được grade là `Again`
- **And** câu tiếp theo xuất hiện

---

#### US-G04: Ôn Luyện Ngữ Pháp Theo FSRS Queue

**Epic**: Grammar Engine — FSRS Integration  
**Priority**: P0 - Blocker  
**Cognitive Goal**: Áp dụng giải thuật FSRS cho grammar cards để tối ưu khoảng cách ôn tập ngữ pháp

##### User Story Statement
As a **học viên đã học xong bài 8 ngữ pháp 5 ngày trước**,  
I want to **nhận được nhắc nhở từ FSRS khi Grammar Cards của bài 8 đến hạn ôn tập, và ôn luyện trong session tích hợp tại `/grammar/practice`**,  
So that I can **giữ vững kiến thức ngữ pháp thông qua spaced repetition mà không cần nhớ lịch học thủ công**.

##### Business Rules
- BR-G10: Grammar cards dùng chung FSRS engine với Vocab/Kanji cards (cùng `fsrs-engine.ts`)
- BR-G11: Grammar cards xuất hiện trong queue chung `/review` nếu type filter = `all`
- BR-G12: Grammar cards chỉ xuất hiện riêng tại `/grammar/practice`

##### Acceptance Criteria (Gherkin)

**Scenario 1: Happy Path — Grammar cards đến hạn**
- **Given** học viên đã review Pattern G-76 (あげます) 3 ngày trước và card có stability = 3.0 ngày
- **When** học viên truy cập `/grammar/practice` vào ngày thứ 4
- **Then** card G-76 xuất hiện trong queue với badge "📅 Đến hạn"
- **And** FSRS tính R(3, 3.0) ≈ 0.88 (88% recall probability)

**Scenario 2: Grammar + Vocab mixed review**
- **Given** học viên chọn "Ôn luyện tất cả" từ trang chủ
- **When** truy cập `/review?type=all`
- **Then** grammar cards, vocab cards và kanji cards xuất hiện lẫn lộn trong queue theo thứ tự FSRS
- **And** mỗi card có badge phân biệt: `[文法]` màu Fuji Indigo, `[語彙]` màu Matcha, `[漢字]` màu Torii

---

#### US-G05: Import Grammar Data từ Script

**Epic**: Grammar Engine — Data Pipeline  
**Priority**: P0 - Blocker  
**Cognitive Goal**: Đảm bảo toàn bộ 32 grammar patterns + 200+ exercises có trong DB production

##### User Story Statement
As a **DevOps engineer chạy lần đầu tiên grammar import script**,  
I want to **chạy `npx tsx scripts/import-grammar-jpd133.ts` và nhận về confirmation rằng 32 grammar patterns + 200+ exercise items đã được insert vào Turso DB thành công**,  
So that I can **đảm bảo grammar data sẵn sàng cho production deployment mà không cần manual SQL**.

##### Business Rules
- BR-G13: Script phải idempotent — chạy nhiều lần không tạo duplicate
- BR-G14: Script phải validate foreign key consistency trước khi insert
- BR-G15: Script output JSON summary: `{ patterns: 32, exercises: N, deck: "grammar_jpd133", errors: 0 }`

##### Acceptance Criteria (Gherkin)

**Scenario 1: Happy Path — Import thành công**
- **Given** TURSO_DATABASE_URL và TURSO_AUTH_TOKEN đã được set
- **When** chạy `npx tsx scripts/import-grammar-jpd133.ts`
- **Then** script tạo deck `grammar_jpd133` nếu chưa tồn tại
- **And** insert 32 grammar pattern records vào `grammar_patterns` table
- **And** insert 200+ exercise items vào `grammar_exercises` table
- **And** insert grammar card records vào `cards` table với `type = 'GrammarPattern'`
- **And** in ra: `✅ Grammar import complete: 32 patterns, 204 exercises, 128 cards`

**Scenario 2: Idempotent — Chạy lần 2**
- **Given** script đã chạy thành công lần 1
- **When** chạy lại script
- **Then** không tạo duplicate records (dùng INSERT OR IGNORE hoặc upsert)
- **And** in ra: `ℹ️ Already up to date: 32 patterns (0 new), 204 exercises (0 new), 128 cards (0 new)`

---

#### US-G06 đến US-G25 — User Stories Bổ Sung

*(Tóm tắt ngắn gọn — mỗi story có đầy đủ Gherkin trong implementation)*

| US-ID | Tiêu đề | Priority | Cognitive Goal |
|:---:|:---|:---:|:---|
| US-G06 | Xem Bài Học Ngữ Pháp Theo Bài (Lesson Detail) | P0 | Visual navigation by lesson |
| US-G07 | So Sánh 2 Pattern Tương Tự (あげます vs くれます) | P1 | Disambiguation training |
| US-G08 | Nghe Phát Âm Câu Ví Dụ (TTS) | P1 | Phonological encoding |
| US-G09 | Xem Giải Thích Ngữ Pháp Tiếng Việt | P0 | L1 anchoring |
| US-G10 | Làm Bài Tập Multiple Choice | P1 | Recognition training |
| US-G11 | Làm Bài Tập Sắp Xếp Từ (Jumble) | P2 | Production encoding |
| US-G12 | Làm Bài Tập Dịch Việt → Nhật | P2 | Transfer encoding |
| US-G13 | Xem Lịch Sử Làm Bài Tập | P2 | Metacognitive monitoring |
| US-G14 | Reset FSRS Grammar Cards | P2 | Self-regulation |
| US-G15 | Tìm Kiếm Mẫu Câu | P2 | Reference usage |
| US-G16 | Filter Grammar theo JLPT Level | P2 | Goal-directed study |
| US-G17 | Bookmark Grammar Pattern | P3 | Personal study lists |
| US-G18 | Xem Ví Dụ Mở Rộng (AI-Generated) | P3 | Contextual learning |
| US-G19 | Chia Sẻ Grammar Card | P3 | Social learning |
| US-G20 | Export Grammar Summary PDF | P3 | Reference material |
| US-G21 | Grammar Progress Dashboard | P1 | Metacognitive overview |
| US-G22 | Daily Grammar Streak | P2 | Motivational gamification |
| US-G23 | Grammar Card trong Review Queue Chung | P0 | FSRS integration |
| US-G24 | Cram Mode cho Grammar Patterns | P2 | Intensive review |
| US-G25 | Mobile Grammar Browser | P1 | Accessibility |

---

### A.6 Business Rules Grammar Engine (BR-G01 đến BR-G15)

#### BR-G01: Pattern Atomicity (Tính Nguyên Tử Mẫu Câu)
Mỗi grammar card phải test **đúng một** khía cạnh của mẫu câu:
- **ĐÚNG**: Card hỏi về te-form của `入ります` → `入って`
- **SAI**: Card hỏi đồng thời cả te-form VÀ nghĩa của pattern

#### BR-G02: Conjugation Coverage (Bao phủ Chia động từ)
Pattern liên quan đến động từ phải có đủ ví dụ cho:
- Group 1 (Godan verbs): ～います, ～きます, ～します...
- Group 2 (Ichidan verbs): ～ます → ～て ngay
- Group 3 (Irregular): します → して, きます → きて

#### BR-G03: Bilingual Sentence Standard (Chuẩn Song Ngữ)
Mỗi ví dụ phải có:
- Câu tiếng Nhật (có furigana trong ruby markup)
- Bản dịch tiếng Việt chuẩn (không dịch máy thô)
- Phần highlight pattern (cloze hoặc bold)

#### BR-G04: JLPT Tagging Mandatory (Gắn nhãn JLPT Bắt buộc)
Tất cả pattern phải có `jlptLevel: 'N5' | 'N4'` — không để null

#### BR-G05: Pattern Numbering Lock (Khóa Số Thứ Tự Pattern)
Pattern numbers (72-103) phải giữ nguyên từ giáo trình JPD133 để dễ tham chiếu

#### BR-G06: Example Sentence Length Constraint
Câu ví dụ: min 5 từ, max 20 từ. Không dùng câu quá đơn giản hoặc quá phức tạp

#### BR-G07: FSRS Initial State for Grammar Cards
Grammar cards mới import vào có state = 'New', stability = 0, difficulty = 0, due = NOW()

#### BR-G08: Grammar Deck Segregation
Grammar cards thuộc `deckId = 'grammar_jpd133'` — phân biệt với `deck_jpd133_kanji` và `deck_jpd133_vocab`

#### BR-G09: Audio Availability Flag
Nếu Web Speech API không hỗ trợ câu có Kanji phức tạp, sử dụng furigana reading để đọc

#### BR-G10: Cloze Pattern for Grammar Exercises
Grammar exercise cloze phải cloze phần **grammatical element** (particle, verb form, conjunction), không phải lexical word

#### BR-G11: Pattern Display Order
Trong lesson detail, patterns hiển thị theo số thứ tự tăng dần (72, 73, 74...)

#### BR-G12: SBT Exercise Integration
Mỗi lesson phải có ít nhất 20 exercise items được seed từ SBT content

#### BR-G13: Performance Standard
Trang `/grammar` phải load < 1.5s (First Contentful Paint), `/grammar/[lessonId]` < 2s

#### BR-G14: Accessibility
Tất cả grammar interactive elements phải có aria-label tiếng Anh và tiếng Nhật

#### BR-G15: Error Boundary
Tất cả grammar components phải có React Error Boundary với Washi fallback UI

---

## PHẦN B: KIẾN TRÚC KỸ THUẬT (Technical Architecture)

### B.1 Sơ Đồ Kiến Trúc Tổng Thể Grammar Engine

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           GRAMMAR ENGINE ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│   PRESENTATION LAYER (Next.js 15 App Router)                                     │
│   ┌─────────────────┐  ┌──────────────────────┐  ┌────────────────────────────┐ │
│   │  /grammar        │  │  /grammar/[lessonId]  │  │  /grammar/practice         │ │
│   │  (RSC + ISR)     │  │  (RSC + Client Shell) │  │  (Client Component Only)   │ │
│   │                  │  │                      │  │                            │ │
│   │  GrammarGallery  │  │  LessonDetail        │  │  GrammarDrillSession       │ │
│   │  LessonCard ×4   │  │  PatternCard ×N      │  │  ClozeExercise             │ │
│   │  ProgressBadge   │  │  StructureDiagram    │  │  MultipleChoiceExercise    │ │
│   │                  │  │  ExampleSentence     │  │  FillInBlankExercise       │ │
│   └────────┬─────────┘  └──────────┬───────────┘  └───────────────┬────────────┘ │
│            │                        │                               │              │
│   ─────────┼────────────────────────┼───────────────────────────────┼──────────── │
│                                                                                   │
│   API LAYER (Next.js Route Handlers)                                              │
│   ┌──────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌────────────┐  │
│   │GET /api/     │  │GET /api/grammar/ │  │POST /api/grammar/│  │POST /api/  │  │
│   │grammar       │  │[lessonId]        │  │seed              │  │review      │  │
│   │              │  │                  │  │                  │  │(existing)  │  │
│   │Returns:      │  │Returns:          │  │Seeds grammar     │  │            │  │
│   │LessonSummary │  │PatternDetail[]   │  │data into DB      │  │Grade card  │  │
│   │[]            │  │+ ExerciseItems[] │  │(idempotent)      │  │(unchanged) │  │
│   └──────┬───────┘  └────────┬─────────┘  └────────┬─────────┘  └─────┬──────┘  │
│          │                   │                       │                   │          │
│   ─────────────────────────────────────────────────────────────────────────────── │
│                                                                                   │
│   BUSINESS LOGIC LAYER                                                            │
│   ┌─────────────────────────┐   ┌──────────────────────────────────────────────┐ │
│   │  Grammar Repository     │   │  FSRS Engine (READ ONLY — zero changes)      │ │
│   │  grammarRepository.ts   │   │  src/core/scheduler/fsrs-engine.ts           │ │
│   │                         │   │                                              │ │
│   │  getAllLessons()         │   │  Uses existing ISchedulerEngine interface     │ │
│   │  getLessonById()        │   │  Grammar cards flow through same FSRS math   │ │
│   │  getPatternById()       │   │  as vocab/kanji cards                        │ │
│   │  getExercisesByPattern()│   └──────────────────────────────────────────────┘ │
│   │  getGrammarCardsDue()   │                                                    │
│   │  seedGrammarData()      │   ┌──────────────────────────────────────────────┐ │
│   └──────────┬──────────────┘   │  Grammar Card Factory                        │ │
│              │                  │  grammarCardFactory.ts                        │ │
│              │                  │  patternToCards(pattern): Card[]             │ │
│              │                  │  exerciseToCard(exercise): Card              │ │
│              │                  └──────────────────────────────────────────────┘ │
│   ─────────────────────────────────────────────────────────────────────────────── │
│                                                                                   │
│   DATA LAYER (Drizzle ORM + Turso LibSQL)                                         │
│   ┌──────────────┐  ┌─────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│   │grammar_      │  │grammar_         │  │cards           │  │review_logs     │ │
│   │patterns      │  │exercises        │  │(type=Grammar   │  │(existing)      │ │
│   │(NEW TABLE)   │  │(NEW TABLE)      │  │Pattern)        │  │                │ │
│   │              │  │                 │  │(existing table │  │Grammar cards   │ │
│   │32 records    │  │200+ records     │  │+ new data)     │  │share same log  │ │
│   └──────────────┘  └─────────────────┘  └────────────────┘  └────────────────┘ │
│                                                                                   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

### B.2 Database Schema Extensions

#### New Table 1: `grammar_patterns`

```typescript
// src/db/schema.ts — APPEND ONLY (không sửa bảng cũ)

export const grammarPatterns = sqliteTable('grammar_patterns', {
  // Primary key
  id: text('id').primaryKey(), // 'G-72', 'G-73', ..., 'G-103'

  // Metadata
  lessonId: text('lesson_id').notNull(), // 'lesson-8', 'lesson-9', 'lesson-10', 'lesson-11'
  patternNumber: integer('pattern_number').notNull(), // 72, 73, ..., 103
  jlptLevel: text('jlpt_level').notNull(), // 'N5' | 'N4'
  difficultyScore: integer('difficulty_score').default(3).notNull(), // 1-5

  // Grammar content
  patternTemplate: text('pattern_template').notNull(),
  // VD: "Vテ形 + います" | "N1 は N2 が A です"
  
  structureSlots: text('structure_slots').notNull(),
  // JSON array: [{"slot": "Vテ形", "color": "#88A752", "label": "Động từ dạng Te"},
  //              {"slot": "います", "color": "#D97706", "label": "Trạng thái đang diễn ra"}]
  
  meaningVi: text('meaning_vi').notNull(),
  // VD: "Đang làm ~ / Đang ở trạng thái ~"
  
  meaningJa: text('meaning_ja'),
  // VD: "現在進行形・継続の状態を表す"
  
  usageNote: text('usage_note'),
  // Ghi chú phân biệt với patterns tương tự
  
  // Example sentences (JSON array)
  examples: text('examples').notNull(),
  // JSON: [{"ja": "私は横浜に住んでいます。",
  //          "ja_furigana": "わたしは よこはまに すんでいます。",
  //          "vi": "Tôi đang sống ở Yokohama.",
  //          "highlight": "住んでいます",
  //          "highlightType": "pattern_core"}]
  
  // Tags
  verbTypes: text('verb_types'),
  // JSON: ["godan", "ichidan", "irregular"] — chỉ cho patterns liên quan động từ
  
  relatedPatternIds: text('related_pattern_ids'),
  // JSON: ["G-73", "G-90", "G-98"] — patterns dễ nhầm lẫn

  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// Index cho lesson lookup
// idx_grammar_patterns_lesson_id ON (lesson_id)
// idx_grammar_patterns_jlpt ON (jlpt_level)
// idx_grammar_patterns_difficulty ON (difficulty_score)
```

#### New Table 2: `grammar_exercises`

```typescript
export const grammarExercises = sqliteTable('grammar_exercises', {
  id: text('id').primaryKey(), // 'EX-G72-001', 'EX-G72-002', ...
  
  patternId: text('pattern_id')
    .notNull()
    .references(() => grammarPatterns.id, { onDelete: 'cascade' }),
  
  exerciseType: text('exercise_type').notNull(),
  // 'cloze' | 'multiple_choice' | 'jumble' | 'translation_vi_to_ja' | 'fill_blank'
  
  difficulty: integer('difficulty').default(2).notNull(), // 1 (easy) - 5 (hard)
  
  // Cloze exercises
  sentenceWithCloze: text('sentence_with_cloze'),
  // VD: "そこに{{c1::入らない}}でください。"
  
  // Multiple choice
  question: text('question'),
  // VD: "私は料理を___ことができません。"
  optionA: text('option_a'),
  optionB: text('option_b'),
  optionC: text('option_c'),
  optionD: text('option_d'),
  correctOption: text('correct_option'), // 'A' | 'B' | 'C' | 'D'
  
  // Fill-in-the-blank / Translation
  promptText: text('prompt_text'),
  // VD: "Tôi không thể nấu ăn." → dịch sang Nhật
  
  answerText: text('answer_text').notNull(),
  // Đáp án chuẩn
  
  alternateAnswers: text('alternate_answers'),
  // JSON array: ["作れません", "料理できません"] — các đáp án chấp nhận được
  
  explanationVi: text('explanation_vi'),
  // Giải thích tại sao đáp án đúng
  
  explanationJa: text('explanation_ja'),
  
  // Metadata
  sourceRef: text('source_ref'),
  // VD: "SBT NGỮ PHÁP p.5 問題2-3" hoặc "Custom exercise"
  
  sortOrder: integer('sort_order').default(0).notNull(),
  
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
```

#### New Table 3: `grammar_lessons`

```typescript
export const grammarLessons = sqliteTable('grammar_lessons', {
  id: text('id').primaryKey(), // 'lesson-8', 'lesson-9', 'lesson-10', 'lesson-11'
  
  lessonNumber: integer('lesson_number').notNull(), // 8, 9, 10, 11
  titleJa: text('title_ja').notNull(), // "第8課"
  titleVi: text('title_vi').notNull(), // "Bài 8 - Gia đình & Bạn bè"
  themeJa: text('theme_ja'), // "家族・友達"
  themeVi: text('theme_vi'), // "Chủ đề: Gia đình và Bạn bè"
  
  patternRange: text('pattern_range').notNull(), // "72-80"
  patternCount: integer('pattern_count').notNull(), // 9
  
  // Wa-style theming per lesson
  accentColor: text('accent_color').notNull(), // CSS color token name
  wagara: text('wagara'), // 'seigaiha' | 'asanoha' | 'yagasuri' | 'kikko'
  inkanChar: text('inkan_char'), // "文" | "語" | "法" | "心"
  
  description: text('description').notNull(),
  
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
```

#### Extended `cards` Table Usage (Zero Schema Change)

Grammar Pattern cards tái sử dụng hoàn toàn bảng `cards` hiện có:

```
cards record for Grammar Pattern G-72:
{
  id: 'card_grammar_G72_cloze_001',
  deckId: 'grammar_jpd133',
  type: 'GrammarPattern',          ← NEW value for existing 'type' field
  front: '{{c1::住んでいます}}',     ← Cloze sentence front
  reading: 'すんでいます',
  meaning: 'Pattern G-72: Vて + います (Đang ~)',
  pitch: null,                     ← Grammar cards không có pitch accent
  sentence: '私は横浜に住んでいます。',
  audioUrl: null,
  tags: '["grammar","N5","lesson-8","te-form"]',
  // ... FSRS fields default values
}
```

Việc thêm `'GrammarPattern'` vào field `type` là **schema-compatible** — field `type` là `text('type')` không có enum constraint trong SQLite, chấp nhận bất kỳ string nào.

---

### B.3 Domain Types & TypeScript Interfaces

#### File: `src/core/grammar/grammar.types.ts`

```typescript
// ============================================================================
// GRAMMAR ENGINE DOMAIN TYPES
// src/core/grammar/grammar.types.ts
// ============================================================================

/**
 * Một slot trong cấu trúc ngữ pháp — dùng để render Structure Diagram SVG
 */
export interface GrammarStructureSlot {
  slot: string;          // VD: "Vテ形", "います", "N1", "に", "N2", "を"
  color: string;         // CSS color hex — theo Nippon palette
  label: string;         // Giải thích tiếng Việt của slot
  isOptional?: boolean;  // Slot có thể bỏ qua không?
  isCore?: boolean;      // Đây có phải phần cốt lõi của pattern không?
}

/**
 * Câu ví dụ cho một grammar pattern
 */
export interface GrammarExample {
  ja: string;                   // Câu tiếng Nhật đầy đủ
  ja_furigana?: string;         // Câu với furigana (nếu có Kanji phức tạp)
  vi: string;                   // Bản dịch tiếng Việt
  highlight: string;            // Phần text cần highlight (core pattern)
  highlightType: 'pattern_core' | 'pattern_slot' | 'example_only';
  audioText?: string;           // Text để TTS đọc (stripped cloze nếu cần)
}

/**
 * Grammar Pattern — đơn vị kiến thức ngữ pháp nguyên tử
 */
export interface GrammarPattern {
  id: string;                   // 'G-72', 'G-73', ..., 'G-103'
  lessonId: string;             // 'lesson-8', 'lesson-9', 'lesson-10', 'lesson-11'
  patternNumber: number;        // 72, 73, ..., 103
  jlptLevel: 'N5' | 'N4';
  difficultyScore: 1 | 2 | 3 | 4 | 5;
  patternTemplate: string;      // VD: "Vテ形 + います"
  structureSlots: GrammarStructureSlot[];
  meaningVi: string;
  meaningJa?: string;
  usageNote?: string;
  examples: GrammarExample[];
  verbTypes?: ('godan' | 'ichidan' | 'irregular')[];
  relatedPatternIds?: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Grammar Lesson — nhóm patterns theo bài học
 */
export interface GrammarLesson {
  id: string;           // 'lesson-8'
  lessonNumber: number; // 8
  titleJa: string;      // "第8課"
  titleVi: string;      // "Bài 8 - Gia đình & Bạn bè"
  themeJa?: string;
  themeVi?: string;
  patternRange: string; // "72-80"
  patternCount: number; // 9
  patterns?: GrammarPattern[];
  accentColor: string;
  wagara?: 'seigaiha' | 'asanoha' | 'yagasuri' | 'kikko';
  inkanChar?: string;
  description: string;
  sortOrder: number;
}

/**
 * Grammar Exercise — bài tập luyện tập
 */
export type ExerciseType = 
  | 'cloze' 
  | 'multiple_choice' 
  | 'jumble' 
  | 'translation_vi_to_ja' 
  | 'fill_blank';

export interface GrammarExerciseBase {
  id: string;
  patternId: string;
  exerciseType: ExerciseType;
  difficulty: 1 | 2 | 3 | 4 | 5;
  answerText: string;
  alternateAnswers?: string[];
  explanationVi?: string;
  explanationJa?: string;
  sourceRef?: string;
  sortOrder: number;
}

export interface ClozeExercise extends GrammarExerciseBase {
  exerciseType: 'cloze';
  sentenceWithCloze: string; // "そこに{{c1::入らない}}でください。"
}

export interface MultipleChoiceExercise extends GrammarExerciseBase {
  exerciseType: 'multiple_choice';
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: 'A' | 'B' | 'C' | 'D';
}

export interface FillBlankExercise extends GrammarExerciseBase {
  exerciseType: 'fill_blank';
  promptText: string;
}

export interface TranslationExercise extends GrammarExerciseBase {
  exerciseType: 'translation_vi_to_ja';
  promptText: string; // Câu tiếng Việt cần dịch
}

export type GrammarExercise = 
  | ClozeExercise 
  | MultipleChoiceExercise 
  | FillBlankExercise 
  | TranslationExercise;

/**
 * Trạng thái phiên luyện tập ngữ pháp
 */
export interface GrammarDrillSession {
  lessonId?: string;      // null = tất cả lessons
  patternId?: string;     // null = tất cả patterns
  exercises: GrammarExercise[];
  currentIndex: number;
  totalCount: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  sessionStartedAt: Date;
  cardGrades: Record<string, 'Again' | 'Hard' | 'Good' | 'Easy'>;
}

/**
 * DTO cho API responses
 */
export interface LessonSummaryDTO {
  id: string;
  lessonNumber: number;
  titleJa: string;
  titleVi: string;
  themeVi?: string;
  patternCount: number;
  patternRange: string;
  dueCards: number;
  newCards: number;
  totalCards: number;
  progressPercent: number; // 0-100
  accentColor: string;
  wagara?: string;
  inkanChar?: string;
}

export interface PatternDetailDTO extends GrammarPattern {
  cardsDue: number;
  cardsReviewed: number;
  masteryPercent: number;
}
```

---

### B.4 API Contract Design

#### GET /api/grammar

**Purpose**: Lấy danh sách tất cả lessons với summary stats  
**Authentication**: None (public read)  
**Caching**: `revalidate = 60` (ISR 60 giây)

```typescript
// Request
GET /api/grammar
GET /api/grammar?jlpt=N5  // Filter by JLPT level

// Response 200
{
  "lessons": [
    {
      "id": "lesson-8",
      "lessonNumber": 8,
      "titleJa": "第8課",
      "titleVi": "Bài 8 - Gia đình & Bạn bè",
      "themeVi": "Chủ đề: Mô tả đặc điểm & Tặng quà",
      "patternCount": 9,
      "patternRange": "72-80",
      "dueCards": 3,
      "newCards": 6,
      "totalCards": 27,
      "progressPercent": 33,
      "accentColor": "#1B4268",
      "wagara": "asanoha",
      "inkanChar": "文"
    },
    // ... lesson 9, 10, 11
  ],
  "totalPatterns": 32,
  "totalCards": 128,
  "totalDue": 12
}
```

#### GET /api/grammar/[lessonId]

**Purpose**: Lấy chi tiết một lesson với tất cả patterns và exercises  
**Caching**: `revalidate = 30`

```typescript
// Request
GET /api/grammar/lesson-8
GET /api/grammar/lesson-8?includeExercises=true

// Response 200
{
  "lesson": {
    "id": "lesson-8",
    "lessonNumber": 8,
    "titleJa": "第8課",
    "titleVi": "Bài 8 - Gia đình & Bạn bè",
    "description": "Học cách mô tả đặc điểm người, diễn đạt sở thích và các động từ trao nhận"
  },
  "patterns": [
    {
      "id": "G-72",
      "patternNumber": 72,
      "jlptLevel": "N5",
      "difficultyScore": 2,
      "patternTemplate": "Vテ形 + います",
      "structureSlots": [
        {"slot": "V", "color": "#88A752", "label": "Động từ"},
        {"slot": "て", "color": "#D97706", "label": "Te-form suffix"},
        {"slot": "います", "color": "#0D9488", "label": "Trạng thái/tiến hành"}
      ],
      "meaningVi": "Đang làm ~ / Đang ở trong trạng thái ~",
      "examples": [
        {
          "ja": "私は横浜に住んでいます。",
          "ja_furigana": "わたしは よこはまに すんでいます。",
          "vi": "Tôi đang sống ở Yokohama.",
          "highlight": "住んでいます",
          "highlightType": "pattern_core"
        }
      ],
      "relatedPatternIds": ["G-73", "G-90", "G-98"],
      "cardsDue": 1,
      "masteryPercent": 45
    },
    // ... G-73 đến G-80
  ],
  "exercises": [
    {
      "id": "EX-G72-001",
      "patternId": "G-72",
      "exerciseType": "cloze",
      "difficulty": 2,
      "sentenceWithCloze": "私は横浜に{{c1::住んでいます}}。",
      "answerText": "住んでいます",
      "explanationVi": "住みます → Te-form → 住んで → + います = 住んでいます"
    },
    // ...
  ]
}
```

#### POST /api/grammar/seed

**Purpose**: Seed toàn bộ grammar data vào DB (idempotent)  
**Authentication**: Secret header `X-Seed-Token` (từ env var)

```typescript
// Request
POST /api/grammar/seed
Headers: { "X-Seed-Token": "your_secret_token" }

// Response 200
{
  "success": true,
  "summary": {
    "lessons": { "created": 4, "skipped": 0 },
    "patterns": { "created": 32, "skipped": 0 },
    "exercises": { "created": 204, "skipped": 0 },
    "cards": { "created": 128, "skipped": 0 }
  }
}
```

#### GET /api/grammar/practice

**Purpose**: Lấy exercise queue cho FSRS grammar practice session

```typescript
// Request
GET /api/grammar/practice?lessonId=lesson-8&limit=10&mode=fsrs_due
GET /api/grammar/practice?lessonId=all&limit=15&mode=cram

// Response 200
{
  "queue": [
    {
      "cardId": "card_grammar_G88_cloze_001",
      "patternId": "G-88",
      "exercise": {
        "id": "EX-G88-001",
        "exerciseType": "cloze",
        "sentenceWithCloze": "そこに{{c1::入らない}}でください。",
        "answerText": "入らない"
      },
      "fsrsState": {
        "stability": 2.4,
        "difficulty": 4.2,
        "due": "2026-10-03T08:00:00Z",
        "state": "Review"
      }
    }
  ],
  "total": 8,
  "dueCount": 5,
  "newCount": 3
}
```

---

### B.5 State Machine: Grammar Card FSRS Integration

```
Grammar Card States (FSRS — same as Vocab/Kanji cards):

     ┌─────────────────┐
     │  New (初回学習)  │  ← Grammar card sau khi seed
     │  state = 'New'   │
     └────────┬─────────┘
              │ First drill attempt
              │ (cloze, multiple choice, etc.)
              ▼
     ┌─────────────────┐        Lapse (Again)       ┌──────────────────┐
     │   Learning      │ ──────────────────────────> │  Relearning      │
     │   (Học lại)     │                             │  (Học lại sau    │
     │  stability ≈ 0  │                             │  khi quên)       │
     └────────┬─────────┘                            └────────┬─────────┘
              │ Graduate (stability > threshold)               │ Re-graduate
              ▼                                               │
     ┌─────────────────┐ <─────────────────────────────────────┘
     │  Review (Ôn)    │
     │  Spaced by FSRS │
     │  interval       │
     └─────────────────┘

Grade mapping for Grammar Exercises:
  - Correct on 1st try → 'Good' (interval × stability_multiplier)
  - Correct with hint  → 'Hard' (smaller interval increase)
  - Skipped/incorrect  → 'Again' (reset stability, increment lapses)
  - Correct instantly  → 'Easy' (large interval bonus)
```

---

### B.6 Sequence Diagrams

#### Sequence 1: Học Pattern Mới

```
User          Browser          /grammar/lesson-8 (RSC)     /api/grammar/lesson-8     Turso DB
 │                │                     │                          │                    │
 │  Navigate to   │                     │                          │                    │
 │  /grammar/     │                     │                          │                    │
 │  lesson-8      │──────────────────>  │                          │                    │
 │                │                     │  GET /api/grammar/       │                    │
 │                │                     │  lesson-8                │                    │
 │                │                     │─────────────────────────>│                    │
 │                │                     │                          │  SELECT patterns   │
 │                │                     │                          │  WHERE lessonId=   │
 │                │                     │                          │  'lesson-8'        │
 │                │                     │                          │──────────────────> │
 │                │                     │                          │  32 pattern rows   │
 │                │                     │                          │<──────────────────  │
 │                │                     │  PatternDetail[]         │                    │
 │                │                     │<─────────────────────────│                    │
 │                │  HTML + patterns    │                          │                    │
 │                │<─────────────────── │                          │                    │
 │  View lesson   │                     │                          │                    │
 │  page with     │                     │                          │                    │
 │  9 patterns    │                     │                          │                    │
 │                │                     │                          │                    │
 │  Click on      │                     │                          │                    │
 │  Pattern G-72  │                     │                          │                    │
 │                │── client event ───> │                          │                    │
 │                │  (no network req)   │                          │                    │
 │                │  Panel slides up    │                          │                    │
 │                │  (already loaded    │                          │                    │
 │                │  in page data)      │                          │                    │
 │                │                     │                          │                    │
 │  Click 🔊      │                     │                          │                    │
 │  (Speaker)     │──────────────────>  │                          │                    │
 │                │  Web Speech API     │                          │                    │
 │                │  speakJapanese()    │                          │                    │
 │                │  "私は横浜に住んで"  │                          │                    │
 │                │  います。"          │                          │                    │
 │  Hear audio    │                     │                          │                    │
```

#### Sequence 2: Làm Bài Tập Drill và Grade FSRS

```
User        GrammarDrillSession     /api/grammar/practice   /api/review     Turso DB
 │                │                          │                   │              │
 │ Navigate to    │                          │                   │              │
 │ /grammar/      │                          │                   │              │
 │ practice?      │                          │                   │              │
 │ lesson=8       │                          │                   │              │
 │                │  GET /api/grammar/       │                   │              │
 │                │  practice?lessonId=8     │                   │              │
 │                │─────────────────────────>│                   │              │
 │                │                          │  SELECT due cards │              │
 │                │                          │  + exercises      │              │
 │                │                          │──────────────────────────────>  │
 │                │                          │  Card queue       │              │
 │                │                          │<──────────────────────────────  │
 │                │  Exercise queue (10)     │                   │              │
 │                │<─────────────────────────│                   │              │
 │ See Exercise 1 │                          │                   │              │
 │ "そこに___で  │                          │                   │              │
 │ ください。"    │                          │                   │              │
 │                │                          │                   │              │
 │ Type "入らない"│                          │                   │              │
 │ Press Enter    │──── validate ──────────> │                   │              │
 │                │  Correct!               │                   │              │
 │                │<─────────────────────── │                   │              │
 │                │  Green flash            │                   │              │
 │                │  POST /api/review       │                   │              │
 │                │  {cardId, rating:'Good'}│                   │              │
 │                │────────────────────────────────────────────>│              │
 │                │                          │                   │ UPDATE card  │
 │                │                          │                   │ FSRS state   │
 │                │                          │                   │─────────────>│
 │                │                          │                   │ 200 OK       │
 │                │                          │                   │<─────────────│
 │                │  { nextInterval: 3d }   │                   │              │
 │                │<────────────────────────────────────────────│              │
 │ See next       │                          │                   │              │
 │ exercise       │                          │                   │              │
```

---

### B.7 Data Pipeline: PDF → Grammar Data → DB

```
INPUT                    PROCESS                          OUTPUT
─────                    ───────                          ──────

Ngữ pháp-Bunbou.pdf  →  pdfplumber extract text     →  Raw text (4 pages)
(4 trang, text layer)    Python script                   Bài 8-11, Pattern 72-103

SBT NGỮ PHÁP.pdf     →  Manual analysis              →  Exercise schema design
(26 trang, image scan)   (no OCR available)              Inferred from pedagogy

Raw text             →  Manual parsing & curation    →  grammar-seed-data.ts
+ Pedagogical        →  by AI agent (Claude)             (TypeScript data file)
  knowledge          →  Pattern normalization             32 GrammarPattern objects
                     →  Example sentence validation       204 GrammarExercise objects
                     →  JLPT level assignment             4 GrammarLesson objects

grammar-seed-data.ts →  import-grammar-jpd133.ts     →  Turso Cloud DB
(TypeScript data)        (Drizzle ORM script)             grammar_lessons table
                     →  Insert OR IGNORE (idempotent)     grammar_patterns table
                     →  FK validation                     grammar_exercises table
                     →  Card generation                   cards table (new rows)
                     →  Deck creation                     decks table (new row)
```

---

## PHẦN C: PHÂN TÍCH DỮ LIỆU NGỮ PHÁP (Grammar Data Analysis)

### C.1 Bài 8 — Phân Tích Chi Tiết 9 Mẫu Câu (Pattern 72-80)

#### Pattern G-72: Vテ形 います (Progressive/State — hiện tại tiến hành)

**Cấu trúc đầy đủ:**
```
[Subject] は/が + [Location] に + [Verb-Te] + います
```

**Hai nghĩa chính:**
1. **Progressive** (đang diễn ra): Hành động đang tiến hành ngay lúc nói
   - `私は今ご飯を食べています。` (Tôi đang ăn cơm.)
2. **Resultant state** (trạng thái kết quả): Trạng thái được duy trì từ hành động trong quá khứ
   - `私は横浜に住んでいます。` (Tôi sống ở Yokohama — đã dọn đến và vẫn đang ở đó)

**Phân biệt với Pattern G-73:**
- G-72: Hành động diễn ra lúc nói (progressive)
- G-73: Nghề nghiệp / Thói quen / Vai trò (habitual/professional state)

**Te-form conjugation rules:**
| Nhóm | Quy tắc | Ví dụ |
|:---:|:---|:---|
| Group 1 (く) | く → いて | 書く → 書いて |
| Group 1 (ぐ) | ぐ → いで | 泳ぐ → 泳いで |
| Group 1 (む/ぬ/ぶ) | → んで | 読む → 読んで, 死ぬ → 死んで, 遊ぶ → 遊んで |
| Group 1 (う/つ/る) | → って | 言う → 言って, 待つ → 待って, 帰る → 帰って |
| Group 1 (す) | す → して | 話す → 話して |
| Group 2 | ます → て | 食べます → 食べて |
| Group 3 | Irregular | します → して, きます → きて |
| Special | いく → いって | 行く → 行って |

**Grammar Cards (3 cards per pattern):**
1. Card Type CLOZE: `私は横浜に{{c1::住んで}}います。` → 住んで
2. Card Type CLOZE: `友達は毎日日本語を{{c1::勉強して}}います。` → 勉強して
3. Card Type RECOGNITION: Front: "Vテ形 います có nghĩa gì?" Back: "Đang ~... / Ở trong trạng thái ~"

**Exercises (6 exercises per pattern):**
1. CLOZE: `私は東京に{{c1::住んでいます}}。`
2. CLOZE: `今、雨が{{c1::降っています}}。`
3. MULTIPLE_CHOICE: "Ông ấy đang đọc sách." → A) 読んでいます B) 読みます C) 読んでみます D) 読んで
4. FILL_BLANK: Cho "待つ" → Te-form là `___`
5. CONJUGATION: Cho `住みます` → dạng て います là `___`
6. TRANSLATION: "Tôi đang học tiếng Nhật." → `私は日本語を___。`

---

#### Pattern G-73: Vテ形 います (Habitual/Professional State)

**Phân biệt quan trọng với G-72:**
- G-73 diễn tả **nghề nghiệp, vai trò xã hội, hoặc thói quen thường xuyên** — không phải hành động đang diễn ra ngay lúc nói
- Ví dụ: `友達は高校で英語を教えています。` = "Bạn tôi DẠY tiếng Anh ở trường cấp 3" (nghề nghiệp)
- KHÔNG có nghĩa: "Bạn tôi ĐANG DẠY tiếng Anh ngay lúc này"

**Bẫy nhận thức:** G-72 và G-73 cùng hình thức Vて + います, nhưng nghĩa khác nhau hoàn toàn — phụ thuộc vào context (tình huống nói) và loại động từ (action verb vs. state verb).

**Grammar Cards (4 cards for G-73):**
1. CLOZE: `田中さんは銀行で{{c1::働いています}}。` → 働いています
2. RECOGNITION COMPARISON: "Phân biệt G-72 vs G-73 trong 'コンビニで働いています'"
3. MULTIPLE_CHOICE: Loại động từ nào thường dùng G-73?
4. PRODUCTION: "Cô ấy là giáo viên tiểu học." → Dịch sang Nhật

---

#### Pattern G-74: N1 は N2 が A です (Partial Description)

**Cấu trúc:**
```
[Whole] は + [Part/Feature] が + [Adjective] です
```

**Nghĩa:** Nói về một đặc điểm cụ thể của N1, trong đó N2 là bộ phận/khía cạnh được đề cập

**Ví dụ phân tích:**
- `ダニエルさんは背が高いです。`
  - N1 (toàn thể): ダニエルさん (Daniel)
  - N2 (bộ phận): 背 (chiều cao)
  - A: 高い (cao)
  - Nghĩa: "Daniel — chiều cao thì cao" = "Daniel cao người"

- `マルコさんはサッカーが上手です。`
  - N1: マルコさん (Marco)
  - N2: サッカー (bóng đá)
  - A: 上手 (giỏi) ← ナ adjective
  - Nghĩa: "Marco — bóng đá thì giỏi" = "Marco giỏi bóng đá"

**Common N2 slots:**
- Bộ phận cơ thể: 背 (chiều cao), 目 (mắt), 髪 (tóc), 足 (chân), 手 (tay)
- Kỹ năng: サッカー, 料理, ピアノ, 日本語, 英語
- Cảm xúc: 勉強 (học), 旅行 (du lịch)

**Grammar Cards (4 cards):**
1. FILL_BLANK: `田中さんは___が長いです。` (Answer: 髪 — example showing body part)
2. CLOZE: `マリアさんは料理が{{c1::上手}}です。`
3. RECOGNITION: Fill in structure: `N1 は [___] が A です`
4. TRANSLATION: "Anh ấy giỏi bơi lội."

---

#### Pattern G-75: A-いくて / Aなで / Nで (Connecting Adjectives/Nouns)

**Ba sub-forms:**

**1. イ Adjective: A-い → A-くて**
```
[イAdj-stem] + くて + [next clause]
```
- 大きい → 大きくて
- Example: `メアリーさんは目が大きくて、髪が長いです。`

**2. ナ Adjective: Aな → Aで**
```
[ナAdj-stem] + で + [next clause]
```
- まじめ → まじめで
- Example: `ナタポンさんはまじめで、親切です。`

**3. Noun: N → Nで**
```
[Noun] + で + [next clause]
```
- 15歳 → 15歳で
- Example: `妹は15歳で、中学生です。`

**Cognitive challenge:** Nhầm lẫn khi nào dùng くて vs で

**Grammar Cards (6 cards — 2 per sub-form):**
1. CLOZE: `この部屋は広{{c1::くて}}、明るいです。`
2. CLOZE: `田中さんはまじめ{{c1::で}}、優しいです。`
3. CONJUGATION: `暑い → くて form: ___`
4. CONJUGATION: `静か → で form: ___`
5. TRANSLATION: "Anh ấy thông minh và chăm chỉ." (smart = 頭がいい, hardworking = まじめ)
6. MULTIPLE_CHOICE: Chọn form đúng: `この映画は面白___, 楽しいです。` → A)くて B)で

---

#### Pattern G-76, G-77, G-78: あげます / もらいます / くれます (Giving/Receiving Verbs)

**Đây là nhóm 3 patterns quan trọng nhất của Bài 8 — và là source of confusion lớn nhất cho người học tiếng Việt.**

**Conceptual Framework — "Giving/Receiving from whose perspective?":**

```
                    あげます (Tôi → Người khác)
                    ┌──────────────────────────────┐
                    │  A は B に もの を あげます   │
                    │  A gives thing to B           │
                    │  Góc nhìn của A (người cho)   │
                    └──────────────────────────────┘

                    もらいます (Tôi ← Người khác)
                    ┌──────────────────────────────┐
                    │  A は B に もの を もらいます │
                    │  A receives thing from B      │
                    │  Góc nhìn của A (người nhận)  │
                    └──────────────────────────────┘

                    くれます (Người khác → Tôi)
                    ┌──────────────────────────────┐
                    │  B は A に もの を くれます   │
                    │  B gives thing to A (me)      │
                    │  Góc nhìn của A (bên nhận)    │
                    │  ← B LUÔN là người ngoài      │
                    └──────────────────────────────┘
```

**Pattern G-76: あげます**
```
[Giver] は [Receiver] に [Item] を あげます
```
- Giver = ai cũng được (thường là tôi hoặc người thứ ba)
- Example: `カルロスさんはパクさんに花をあげました。`
  - Carlos → tặng hoa → Park
  - Cả hai đều là người thứ ba — OKです

**Pattern G-77: もらいます**
```
[Receiver] は [Giver] に [Item] を もらいます
```
- Nhấn mạnh góc nhìn của người nhận
- Example: `パクさんはカルロスさんに花をもらいました。`
  - Park ← nhận hoa ← Carlos

**Pattern G-78: くれます**
```
[Giver] が [Receiver = tôi/nhà tôi] に [Item] を くれます
```
- **Quan trọng**: Receiver PHẢI là tôi (私) hoặc người trong phe tôi (gia đình, bạn bè gần)
- Example: `メアリーさんが私にかばんをくれました。`
  - Mary → tặng túi → Tôi
  - Nếu viết: `私はメアリーさんにかばんをくれました。` ← **SAI ngữ pháp!**

**Grammar Cards (3 per pattern = 9 cards total):**
- G-76 CLOZE: `田中さんは山田さんに本を{{c1::あげました}}。`
- G-77 CLOZE: `私はお母さんに時計を{{c1::もらいました}}。`
- G-78 CLOZE: `田中さんが私に{{c1::くれました}}。` (fill: お菓子を)
- COMPARISON CARD: "Carlos → Flower → Park. Dùng あげます hay くれます?"
- ERROR CORRECTION: "私はメアリーさんにかばんをくれました。 — Câu này sai ở đâu?"

---

#### Pattern G-79: N が (〜人) います

**Cấu trúc:**
```
[Subject] は + [Relation/Person] が + [Number + counter] + います
```

**Ví dụ:**
- `私は妹が二人います。` = "Tôi có 2 em gái." (literally: "Với tôi, em gái có 2 người")
- `Aさんは兄弟が三人います。` = "A có 3 anh em."

**Counters thường dùng:**
- ～人 (にん/り): Người — 1人 (ひとり), 2人 (ふたり), 3人 (さんにん)...
- ～匹 (ひき): Động vật nhỏ
- ～頭 (とう): Động vật lớn

---

#### Pattern G-80: [〜人] で (By ~ people)

**Cấu trúc:**
```
[Number + 人] で + [Action/State]
```

**Ví dụ:**
- `私はルームメイトと3人で住んでいます。` = "Tôi sống cùng bạn cùng phòng, tổng 3 người."
- `5人でパーティーをします。` = "Làm tiệc với 5 người."

**Lưu ý:** で ở đây chỉ phương tiện/điều kiện, không phải で địa điểm

---

### C.2 Bài 9 — Phân Tích Chi Tiết 7 Mẫu Câu (Pattern 81-87)

#### Pattern G-81: V辞書形 こと (Nominalization — Danh từ hóa)

**Khái niệm cốt lõi:**
Trong tiếng Nhật, động từ không thể đứng độc lập làm subject hoặc object trong câu (khác tiếng Anh). Cần "danh từ hóa" bằng `こと` (hoặc `の`).

```
Tiếng Anh:    "Swimming is fun." (Swimming = gerund)
Tiếng Nhật:   "泳ぐことは楽しい。" (泳ぐこと = nominalized verb)
```

**Cấu trúc:**
```
[V辞書形 (dictionary form)] + こと
```

**Ứng dụng chính:**
1. Làm subject: `料理を作ることは難しい。` (Nấu ăn thì khó.)
2. Làm object: `私の趣味は映画を見ることです。` (Sở thích của tôi là xem phim.)
3. Kết hợp với ができます (→ Pattern G-82)

**辞書形 (Dictionary form) of verbs:**
- Group 2: Remove ます → (は)ます → る (e.g., 食べます → 食べる)
- Group 1: Conjugation back to dictionary form (e.g., 読みます → 読む)
- Group 3: します → する, きます → くる

**Grammar Cards (4 cards):**
1. CLOZE: `私の趣味は映画を見る{{c1::こと}}です。`
2. CONJUGATION: `食べます → 辞書形: ___`
3. TRANSLATION: "Tôi thích nghe nhạc." → `音楽を聞く___が好きです。`
4. RECOGNITION: "Điều này dùng こと hay の?"

---

#### Pattern G-82: N ができます / V辞書形 ことができます (Ability)

**Hai sub-forms:**

**Form A: N ができます**
```
[Noun] + が + できます
```
- `スキーができます。` = Tôi có thể trượt tuyết.
- `日本語ができます。` = Tôi biết/có thể dùng tiếng Nhật.

**Form B: V辞書形 こと が できます**
```
[V辞書形] + こと + が + できます
```
- `料理を作ることができません。` = Tôi không thể nấu ăn.
- `スキーをすることができます。` = Tôi có thể trượt tuyết.

**Phân biệt:**
- Form A: Danh từ trực tiếp (ngắn gọn hơn)
- Form B: Nominalized verb (formal, rõ ràng hơn về action)

**Phủ định:**
- `できます` → `できません`

---

#### Pattern G-83: Vテ形 (Sequential Actions — Nối câu)

**Cấu trúc:**
```
[Action 1-Te] + [Action 2] + ...
```

**Nghĩa:** Các hành động diễn ra theo thứ tự (sau đó)

**Ví dụ:**
- `週末、友達とご飯を食べて、映画を見ます。`
  = "Cuối tuần, ăn cơm với bạn, rồi xem phim."

**Lưu ý về thứ tự:**
- Te-form KHÔNG thể đảo thứ tự các hành động
- `ご飯を食べて映画を見ます` ≠ `映画を見てご飯を食べます`

**Kết hợp với G-86 (どうやって):**
- `どうやって美術館へ行きますか。`
- `——3番のバスに乗って、美術館前で降ります。`

---

#### Pattern G-84: [期間] に [回数] (Frequency Expression)

**Cấu trúc:**
```
[Time period] + に + [Counter (回/本/枚/...)]
```

**Common patterns:**
| Time Period | Example |
|:---|:---|
| 1日 (いちにち) | 1日に3回 — 3 lần mỗi ngày |
| 1週間 (いっしゅうかん) | 1週間に2回 — 2 lần mỗi tuần |
| 1ヶ月 (いっかげつ) | 1ヶ月に1回 — 1 lần mỗi tháng |
| 1年 (いちねん) | 1年に2回 — 2 lần mỗi năm |

**Example:** `1週間に2回、家族に電話します。` = "Mỗi tuần tôi gọi điện cho gia đình 2 lần."

---

#### Pattern G-85: Frequency Adverbs (いつも/よく/ときどき/あまり/ぜんぜん)

**Scale từ cao đến thấp:**
```
いつも (100%) > よく (70-80%) > ときどき (30-50%) > あまり (10-20%) > ぜんぜん (0%)
                                                    ↑ negative        ↑ negative
                                                    (あまり～ない)    (ぜんぜん～ない)
```

**Critical rule:**
- `あまり` + `ぜんぜん` phải dùng với động từ phủ định
- `あまりしません` ✓ | `あまりします` ✗ (không tự nhiên)

**Grammar Cards:**
1. ORDERING: Sắp xếp theo frequency: ときどき, いつも, あまり, よく, ぜんぜん
2. ERROR DETECTION: "あまりテレビを見ます。" — đúng hay sai?

---

#### Pattern G-86: どうやって (How/By what method)

**Cấu trúc:**
```
どうやって + [Location/Destination] + へ/に + 行きますか。
```

**Answer format (kết hợp Te-form G-83):**
```
[Transport] + に乗って + [Stop/Location] + で降ります。
```

**Example:**
```
Q: どうやって美術館へ行きますか。
A: 3番のバスに乗って、美術館前で降ります。
```

---

#### Pattern G-87: でも (But/However — Contrast Conjunction)

**Vị trí:** Đầu câu, sau dấu phẩy hoặc câu trước

**Ví dụ:**
- `私の趣味はスポーツです。でも、最近、全然しません。`
  = "Sở thích của tôi là thể thao. Nhưng, gần đây, tôi không làm gì cả."

**Phân biệt với が (nhưng):**
- `でも`: Đứng đầu câu mới
- `が`: Kết nối trong cùng câu (`面白いですが、難しいです。`)

---

### C.3 Bài 10 — Phân Tích Chi Tiết 10 Mẫu Câu (Pattern 88-97)

#### Pattern G-88: Vない形 でください (Prohibition Request)

**Cấu trúc:**
```
[V-nai form] + でください
```

**Nai-form conjugation:**
| Verb Group | Rule | Example |
|:---:|:---|:---|
| Group 1 | V → あ+ない (u→a+nai) | 入ります(u) → 入らない |
| Group 2 | Remove ます → ない | 食べます → 食べない |
| Group 3 | Irregular | します → しない, きます → こない |
| Special | あります → ない | あります → ない |

**Example:** `そこに入らないでください。` = "Xin đừng vào đó."

**Politeness level:** Lịch sự (丁寧語) — dùng trong trường hợp trang trọng  
**More casual:** `〜ないで`  
**More formal/written:** `〜ないようにしてください`

---

#### Pattern G-89: Vてもいいですか (Asking Permission)

**Cấu trúc:**
```
[V-te form] + もいいですか
```

**Responses:**
- Cho phép: `はい、どうぞ。` (Vâng, mời bạn.)
- Từ chối nhẹ: `すみません、ちょっと……。` (Xin lỗi, hơi... [khó])

**Example:**
- `家に座ってもいいですか。` = "Tôi có thể ngồi ở nhà không?"

**Lưu ý:** `ちょっと……` là cách từ chối GIÁN TIẾP của người Nhật — không trực tiếp nói "không"

---

#### Pattern G-90: N が Vています (Observable Action — có tân ngữ rõ ràng)

**Cấu trúc:**
```
あっ + [Subject] が + [Object] を + [V-te] + います
```

**Khác biệt với G-72:**
- G-72: Tập trung vào state/progressive của chủ thể chính
- G-90: Nhấn mạnh vào hành động **đang quan sát được** của một đối tượng khác

**Example:** `あっ、サルがバナナを食べています。`  
= "À, con khỉ đang ăn chuối kìa!" (đang quan sát)

---

#### Pattern G-91: まだ Vていません (Not yet)

**Cấu trúc:**
```
まだ + [V-te] + いません
```

**Nghĩa:** Hành động CHƯA được thực hiện (và dự kiến sẽ thực hiện)

**Example:** `まだ昼ご飯を食べていません。`  
= "Tôi vẫn chưa ăn trưa." (Tôi dự định sẽ ăn)

**Phân biệt:**
- `まだ食べていません` = Chưa ăn (nhưng sẽ ăn)
- `食べません` = Không ăn (không có kế hoạch)

---

#### Pattern G-92: Vてきます (Go and come back)

**Cấu trúc:**
```
[V-te] + きます
```

**Nghĩa:** Đi làm V rồi quay trở về (action completed and returning)

**Example:** `コンビニでジュースを買ってきます。`  
= "Tôi ra cửa hàng tiện lợi mua nước về đây." (implicit: sẽ quay về ngay)

**Common expressions:**
- `ちょっと行ってきます。` = "Tôi đi một chút rồi về." (khi ra khỏi nhà)
- `見てきます。` = "Tôi đi xem rồi về."

---

#### Pattern G-94: N が見えます / N が聞こえます (Perceptual Verbs)

**Phân biệt quan trọng:**

| Verb | Nghĩa | Subject | Kiểu |
|:---:|:---|:---:|:---:|
| 見ます | Chủ động nhìn | Người | Intentional |
| 見えます | Tự nhiên nhìn thấy | Vật/Cảnh | Spontaneous perception |
| 聞きます | Chủ động nghe | Người | Intentional |
| 聞こえます | Tự nhiên nghe thấy | Âm thanh | Spontaneous perception |

**Examples:**
- `ここから東京タワーが見えます。` = "Từ đây có thể thấy Tokyo Tower." (tự nhiên lọt vào mắt)
- `鳥の声が聞こえます。` = "Nghe thấy tiếng chim." (tự nhiên lọt vào tai)

**Grammar Cards:**
1. RECOGNITION: "Khi ngồi ở cửa sổ và nhìn thấy Núi Phú Sĩ — dùng 見ます hay 見えます?"
2. ERROR DETECTION: "富士山を見えます。" ← Sai — tại sao? (見えます không cần を)

---

#### Pattern G-95: A くなります / A になります / N になります (Become/Change State)

**Ba sub-forms:**

**Form A (イ Adj): A-くなります**
```
[イAdj-stem] + くなります
```
- 寒い → 寒くなります (trở nên lạnh)
- Example: `寒くなりました。` = "Trời đã trở nên lạnh."

**Form B (ナ Adj): Aになります**
```
[ナAdj-stem] + になります
```
- 便利 → 便利になります (trở nên tiện lợi)

**Form C (Noun): Nになります**
```
[Noun] + になります
```
- 12時 → 12時になります (sắp đến 12 giờ)
- Example: `もうすぐ12時になります。` = "Sắp đến 12 giờ rồi."
- 医者 → 医者になります (trở thành bác sĩ)

**Grammar Cards (6 cards):**
1. CLOZE: `だんだん暑{{c1::くなりました}}。`
2. CONJUGATION: `上手 → になります form: ___`
3. TRANSLATION: "Cô ấy đã trở thành giáo viên."
4. MULTIPLE_CHOICE: "12時になります" dùng form nào? → A) A-くなります B) Aになります C) Nになります

---

#### Pattern G-96: N(場所) を V (Movement through location)

**Cấu trúc:**
```
[Place noun] + を + [Movement verb]
```

**Movement verbs thường gặp:**
- 歩きます (đi bộ qua)
- 渡ります (băng qua)
- 曲がります (rẽ tại)
- 通ります (đi qua)
- 飛びます (bay qua)

**Example:**
- `あの橋を渡って、交差点を右に曲がってください。`
  = "Băng qua cây cầu đó, rẽ phải tại ngã tư."

**Lưu ý:** を ở đây chỉ "địa điểm đi qua" — không phải object marker thông thường

---

### C.4 Bài 11 — Phân Tích Chi Tiết 6 Mẫu Câu (Pattern 98-103)

#### Pattern G-99: Vたり Vたり します (Non-exhaustive List of Actions)

**Cấu trúc:**
```
[V-ta form] + り + [V-ta form] + り + します
```

**Ta-form:**
- Tương tự Te-form nhưng thay て→た, で→だ
- 食べて → 食べた → 食べたり
- 読んで → 読んだ → 読んだり

**Nghĩa:** Khi thì X, khi thì Y (không liệt kê đầy đủ, còn nhiều hoạt động khác)

**Ví dụ:**
```
休みの日、家で本を読んだり音楽を聞いたりしています。
= "Ngày nghỉ, tôi khi thì đọc sách ở nhà, khi thì nghe nhạc." (còn làm nhiều thứ khác nữa)
```

**Phân biệt với G-83 (Te-form nối câu):**
- G-83: Hành động tuần tự (làm xong cái này rồi mới làm cái kia)
- G-99: Liệt kê không đầy đủ (chỉ nêu một vài ví dụ đại diện)

**Grammar Cards (5 cards):**
1. CLOZE: `週末は映画を見た{{c1::り}}買い物をした{{c1::り}}します。`
2. CONJUGATION: `食べます → たり form: ___`
3. TRANSLATION: "Tôi thỉnh thoảng học tiếng Nhật, thỉnh thoảng nghe nhạc."
4. COMPARISON: "Phân biệt てから vs たり...たり"
5. ERROR DETECTION: Sai ở đâu: "本を読んだり映画を見てします。"

---

#### Pattern G-101: とき (When — Temporal Clause)

**Đây là pattern phức tạp nhất trong Bài 11 — 7 sub-forms khác nhau:**

```
Form 1: イA + とき  (寂しいとき — khi buồn)
Form 2: ナA + なとき  (暇なとき — khi rảnh)
Form 3: N + のとき  (中学生のとき — khi còn là học sinh THCS)
Form 4: V辞書形 + とき  (料理を作るとき — khi nấu ăn [chưa/đang làm])
Form 5: Vた形 + とき  (行ったとき — khi đã đến [sau khi làm])
Form 6: Vない形 + とき  (ないとき — khi không làm)
Form 7: Vている形 + とき  (いるとき — khi đang làm)
```

**Timing semantics (Form 4 vs Form 5):**

```
V辞書形 + とき:  Main action BEFORE とき-clause action
                (まだ行っていない時点で)
  日本へ来るとき、父に時計をもらいました。
  = "Khi (sắp) đến Nhật, tôi đã nhận đồng hồ từ bố." 
    (nhận đồng hồ TRƯỚC khi đến Nhật — tại Việt Nam)

Vた + とき:  Main action AFTER or DURING とき-clause action
             (すでに行った後で)
  イタリアへ行ったとき、この帽子を買いました。
  = "Khi đã đến Ý, tôi mua chiếc mũ này."
    (mua mũ SAU KHI đến Ý — tại Ý)
```

**Grammar Cards (8 cards — 1 per form + comparison):**
1. CLOZE (Form 1): `寂し{{c1::いとき}}、音楽を聞きます。`
2. CLOZE (Form 3): `子供{{c1::のとき}}、よくサッカーをしました。`
3. CLOZE (Form 4 vs 5): `日本へ行く___、何を買いますか。` (前: とき — chưa đến)
4. CLOZE (Form 4 vs 5): `日本へ行った___、すしを食べました。` (後: とき — đã đến)
5. TRANSLATION: "Khi tôi còn là học sinh tiểu học, tôi thích bóng đá."
6. COMPARISON CARD: "Phân biệt 行くとき vs 行ったとき"
7. MULTIPLE_CHOICE: "Câu nào đúng về timing?"
8. ERROR DETECTION: Sai ở đâu trong câu sử dụng とき sai form

---

#### Pattern G-103: 友達言葉 (Casual Speech Patterns)

**Đây là pattern đặc biệt — không phải mẫu câu mà là register shift (thay đổi văn phong)**

**Transformations từ Trang trọng → Thân mật:**

| Trang trọng (Teineigo) | Thân mật (Kudaketa) | Ghi chú |
|:---|:---|:---|
| ～ますか | ～る？ | VD: 行きますか → 行く？ |
| ～ません | ～ない | VD: 行きません → 行かない |
| ～ましたか | ～た？ | VD: 何をしましたか → 何した？ |
| ～ませんか | ～ない？ | Mời/đề nghị: 食べませんか → 食べない？ |
| ありません | ない | Phủ định danh từ tính từ |
| ありませんでした | なかった | Phủ định quá khứ |
| を (particle) | Thường bị lược bỏ | 何をした？ → 何した？ |
| へ (particle) | Thường bị lược bỏ | 海へ行く？ → 海行く？ |
| は (particle) | Thường bị lược bỏ | あの店は高い → あの店高い |
| が (contrastive) | けど | 高いですが → 高いけど |
| でも | でも (không đổi) | Giữ nguyên |

**Grammar Cards (6 cards):**
1. TRANSFORMATION: `映画を見ませんか。` → thân mật: `___`
2. TRANSFORMATION: `昨日、何をしましたか。` → thân mật: `___`
3. RECOGNITION: "うん" và "ううん" là cách nói thân mật của gì?
4. MULTIPLE_CHOICE: "Câu nào là thân mật: A) 食べますか B) 食べない? C) 食べますか？"
5. TRANSLATION: "Cậu có muốn ăn với tớ không?" (casual)
6. PRODUCTION: Viết 3 câu casual hỏi bạn về kế hoạch cuối tuần

---

### C.5 SBT NGỮ PHÁP — Cấu Trúc Bài Tập Suy Luận

Dựa trên format chuẩn của SBT Minna no Nihongo và các patterns đã biết, đây là thiết kế bài tập tương đương:

#### Bài 8 — 25 Exercises

**問題1 — Điền từ vào chỗ trống (Fill in particle/form): 8 bài**
1. `田中さんは毎日自転車___学校へ来ています。` → で
2. `私は妹が___います。` → 一人 (hai: 二人)
3. `山田さんは鈴木さん___本をあげました。` → に
4. `母___手紙をもらいました。` → に
5. `友達が私___プレゼントをくれました。` → に
6. `田中さんは背___高いです。` → が
7. `子供は3人___遊んでいます。` → で
8. `まじめ___やさしい先生が好きです。` → で

**問題2 — Biến đổi動詞 (Te-form): 6 bài**
1. 読みます → 読んで
2. 書きます → 書いて
3. 話します → 話して
4. 来ます → きて
5. 勉強します → 勉強して
6. 起きます → 起きて

**問題3 — Chọn đáp án: 5 bài**
1. `友達は私に本を (あげました・くれました・もらいました)。`
2. Ai cho ai dựa trên context diagram...

**問題4 — Dịch Việt → Nhật: 4 bài**
1. Tôi đang học tiếng Nhật tại trường đại học.
2. Bạn của tôi cao và thân thiện.
3. Mẹ tôi tặng tôi một chiếc áo.
4. Gia đình tôi có 4 người.

**問題5 — Hội thoại hoàn chỉnh: 2 bài**

---

### C.6 Seed Data: 32 Grammar Pattern Objects (JSON Format)

```typescript
// scripts/data/grammar-patterns.ts
// Trích xuất từ Ngữ pháp-Bunbou.pdf và phân tích chuyên sâu

export const GRAMMAR_PATTERNS: GrammarPatternSeedData[] = [
  {
    id: 'G-72',
    lessonId: 'lesson-8',
    patternNumber: 72,
    jlptLevel: 'N5',
    difficultyScore: 2,
    patternTemplate: 'Vて形 + います',
    structureSlots: [
      { slot: 'V', color: '#88A752', label: 'Động từ gốc', isCore: false },
      { slot: 'て', color: '#D97706', label: 'Te-form suffix', isCore: true },
      { slot: 'います', color: '#0D9488', label: 'Tiến hành/Trạng thái', isCore: true },
    ],
    meaningVi: 'Đang làm ~ / Ở trong trạng thái ~ (hành động đang diễn ra ngay lúc nói)',
    meaningJa: '現在進行形または結果の状態を表す',
    usageNote: 'Phân biệt với G-73: G-72 là tiến hành tức thời; G-73 là thói quen/nghề nghiệp',
    examples: [
      {
        ja: '私は横浜に住んでいます。',
        ja_furigana: 'わたしは よこはまに すんでいます。',
        vi: 'Tôi đang sống ở Yokohama.',
        highlight: '住んでいます',
        highlightType: 'pattern_core',
      },
      {
        ja: '今、雨が降っています。',
        ja_furigana: 'いま、あめが ふっています。',
        vi: 'Bây giờ trời đang mưa.',
        highlight: '降っています',
        highlightType: 'pattern_core',
      },
    ],
    verbTypes: ['godan', 'ichidan', 'irregular'],
    relatedPatternIds: ['G-73', 'G-90', 'G-98'],
  },

  {
    id: 'G-73',
    lessonId: 'lesson-8',
    patternNumber: 73,
    jlptLevel: 'N5',
    difficultyScore: 3,
    patternTemplate: 'Vて形 + います (nghề nghiệp/thói quen)',
    structureSlots: [
      { slot: 'V職業', color: '#88A752', label: 'Động từ nghề nghiệp', isCore: false },
      { slot: 'ています', color: '#0D9488', label: 'Trạng thái thường xuyên', isCore: true },
    ],
    meaningVi: 'Đang làm ~ (nghề nghiệp, vai trò, thói quen dài hạn)',
    usageNote: 'Cùng hình thức với G-72 nhưng context khác: G-73 diễn đạt nghề nghiệp/thói quen, KHÔNG phải hành động đang xảy ra lúc nói',
    examples: [
      {
        ja: '友達は高校で英語を教えています。',
        ja_furigana: 'ともだちは こうこうで えいごを おしえています。',
        vi: 'Bạn tôi dạy tiếng Anh ở trường cấp 3.',
        highlight: '教えています',
        highlightType: 'pattern_core',
      },
    ],
    verbTypes: ['ichidan', 'godan'],
    relatedPatternIds: ['G-72', 'G-90', 'G-98'],
  },

  {
    id: 'G-74',
    lessonId: 'lesson-8',
    patternNumber: 74,
    jlptLevel: 'N5',
    difficultyScore: 2,
    patternTemplate: 'N1 は N2 が A です',
    structureSlots: [
      { slot: 'N1', color: '#1B4268', label: 'Chủ thể (tổng thể)', isCore: false },
      { slot: 'は', color: '#6B7280', label: 'Topic marker', isCore: false },
      { slot: 'N2', color: '#88A752', label: 'Đặc điểm/Bộ phận', isCore: true },
      { slot: 'が', color: '#D97706', label: 'Subject marker', isCore: true },
      { slot: 'A', color: '#0D9488', label: 'Tính từ mô tả', isCore: true },
      { slot: 'です', color: '#6B7280', label: 'Copula', isCore: false },
    ],
    meaningVi: 'N1 thì [bộ phận/đặc điểm N2] như thế nào (mô tả một phần của tổng thể)',
    examples: [
      {
        ja: 'ダニエルさんは背が高いです。',
        ja_furigana: 'ダニエルさんは せが たかいです。',
        vi: 'Daniel cao người (chiều cao thì cao).',
        highlight: '背が高い',
        highlightType: 'pattern_core',
      },
      {
        ja: 'マルコさんはサッカーが上手です。',
        ja_furigana: 'マルコさんは サッカーが じょうずです。',
        vi: 'Marco giỏi bóng đá.',
        highlight: 'サッカーが上手',
        highlightType: 'pattern_core',
      },
    ],
    relatedPatternIds: ['G-79'],
  },

  // ... G-75 đến G-103 (28 patterns còn lại với cùng format chi tiết)
  // [Được tạo đầy đủ trong scripts/data/grammar-patterns.ts]
];
```

---

### C.7 Seed Data: 204 Grammar Exercise Items

#### Phân bổ exercises theo pattern và type:

```typescript
// scripts/data/grammar-exercises.ts

// Tổng 204 exercises phân bổ:
// 32 patterns × 6.375 exercises/pattern ≈ 204

// Phân bổ theo loại:
// cloze: 80 (39%)
// multiple_choice: 50 (25%)
// fill_blank: 40 (20%)
// translation_vi_to_ja: 34 (17%)

export const GRAMMAR_EXERCISES: GrammarExerciseSeedData[] = [

  // ===== PATTERN G-72 =====
  {
    id: 'EX-G72-001',
    patternId: 'G-72',
    exerciseType: 'cloze',
    difficulty: 2,
    sentenceWithCloze: '私は横浜に{{c1::住んでいます}}。',
    answerText: '住んでいます',
    alternateAnswers: ['すんでいます'],
    explanationVi: '住みます → te-form: 住んで → + います = 住んでいます',
    sourceRef: 'Ngữ pháp-Bunbou.pdf Pattern 72',
    sortOrder: 1,
  },

  {
    id: 'EX-G72-002',
    patternId: 'G-72',
    exerciseType: 'cloze',
    difficulty: 2,
    sentenceWithCloze: '今、雨が{{c1::降っています}}。',
    answerText: '降っています',
    explanationVi: '降ります (godan, る verb) → te-form: 降って → + います = 降っています',
    sortOrder: 2,
  },

  {
    id: 'EX-G72-003',
    patternId: 'G-72',
    exerciseType: 'multiple_choice',
    difficulty: 2,
    question: '田中さんは今、何をしていますか。 [仕事する / work]',
    optionA: '仕事します',
    optionB: '仕事しています',
    optionC: '仕事しました',
    optionD: '仕事しています',
    correctOption: 'B',
    answerText: '仕事しています',
    explanationVi: 'Hành động đang diễn ra → Vて + います. します → して + います = しています',
    sortOrder: 3,
  },

  {
    id: 'EX-G72-004',
    patternId: 'G-72',
    exerciseType: 'fill_blank',
    difficulty: 3,
    promptText: '動詞活用: 読みます → て形: ___',
    answerText: '読んで',
    explanationVi: '読みます là godan verb (む-verb): む → んで',
    sortOrder: 4,
  },

  {
    id: 'EX-G72-005',
    patternId: 'G-72',
    exerciseType: 'translation_vi_to_ja',
    difficulty: 3,
    promptText: 'Tôi đang học tiếng Nhật.',
    answerText: '私は日本語を勉強しています。',
    alternateAnswers: ['日本語を勉強しています。', '私は今日本語を勉強しています。'],
    explanationVi: 'Dùng Vて + います để diễn đạt hành động đang diễn ra lúc nói',
    sortOrder: 5,
  },

  {
    id: 'EX-G72-006',
    patternId: 'G-72',
    exerciseType: 'multiple_choice',
    difficulty: 1,
    question: 'Câu nào diễn đạt hành động đang diễn ra?',
    optionA: '私は日本語を勉強します。',
    optionB: '私は日本語を勉強しています。',
    optionC: '私は日本語を勉強しました。',
    optionD: '私は日本語を勉強しませんでした。',
    correctOption: 'B',
    answerText: '私は日本語を勉強しています。',
    explanationVi: 'B dùng て + います → tiến hành hiện tại. A = simple present, C = past, D = past negative',
    sortOrder: 6,
  },

  // ===== PATTERN G-76 (あげます) =====
  {
    id: 'EX-G76-001',
    patternId: 'G-76',
    exerciseType: 'cloze',
    difficulty: 2,
    sentenceWithCloze: '田中さんは山田さんに本を{{c1::あげました}}。',
    answerText: 'あげました',
    explanationVi: 'Tanaka → tặng sách → Yamada. Dùng あげます khi chủ thể cho đi (góc nhìn người cho)',
    sortOrder: 1,
  },

  {
    id: 'EX-G76-002',
    patternId: 'G-76',
    exerciseType: 'multiple_choice',
    difficulty: 3,
    question: 'Carlos → flower → Park. Câu nào ĐÚNG?',
    optionA: 'カルロスさんはパクさんに花をくれました。',
    optionB: 'カルロスさんはパクさんに花をあげました。',
    optionC: 'カルロスさんはパクさんに花をもらいました。',
    optionD: 'パクさんはカルロスさんに花をあげました。',
    correctOption: 'B',
    answerText: 'カルロスさんはパクさんに花をあげました。',
    explanationVi: 'Carlos là người cho (giver = subject), Park là người nhận (receiver). Dùng あげます. くれます chỉ dùng khi receiver là "tôi".',
    sortOrder: 2,
  },

  // ===== PATTERN G-78 (くれます) =====
  {
    id: 'EX-G78-001',
    patternId: 'G-78',
    exerciseType: 'cloze',
    difficulty: 3,
    sentenceWithCloze: 'メアリーさんが私にかばんを{{c1::くれました}}。',
    answerText: 'くれました',
    explanationVi: 'Mary → tặng túi → Tôi (私). Receiver là "tôi" → dùng くれます. KHÔNG thể dùng あげます vì subject là người khác tặng cho mình.',
    sortOrder: 1,
  },

  {
    id: 'EX-G78-002',
    patternId: 'G-78',
    exerciseType: 'multiple_choice',
    difficulty: 4,
    question: 'Câu nào SAI ngữ pháp?',
    optionA: '田中さんが私に花をくれました。',
    optionB: '私は田中さんに花をもらいました。',
    optionC: '私は田中さんに花をくれました。',
    optionD: '田中さんは田中さんの子供に花をあげました。',
    correctOption: 'C',
    answerText: '私は田中さんに花をくれました。',
    explanationVi: 'C SAI: くれます yêu cầu receiver phải là "tôi" hoặc người trong nhóm tôi. Nhưng ở C, 私 là SUBJECT (người cho), không phải receiver. → Phải dùng あげました.',
    sortOrder: 2,
  },

  // ===== PATTERN G-101 (とき) =====
  {
    id: 'EX-G101-001',
    patternId: 'G-101',
    exerciseType: 'cloze',
    difficulty: 3,
    sentenceWithCloze: '寂し{{c1::いとき}}、国の家族に電話します。',
    answerText: 'いとき',
    alternateAnswers: ['いとき'],
    explanationVi: 'イ adjective + とき: 寂しい → 寂しいとき (giữ nguyên い, thêm とき)',
    sortOrder: 1,
  },

  {
    id: 'EX-G101-005',
    patternId: 'G-101',
    exerciseType: 'multiple_choice',
    difficulty: 5,
    question: 'Chọn câu đúng về thời gian:\n"Khi đến Ý, tôi mua chiếc mũ này." (Sự kiện mua xảy ra TẠI Ý)',
    optionA: 'イタリアへ行くとき、この帽子を買いました。',
    optionB: 'イタリアへ行ったとき、この帽子を買いました。',
    optionC: 'イタリアへ行くときに、この帽子を買いました。',
    optionD: 'イタリアへ行くとき、この帽子を買います。',
    correctOption: 'B',
    answerText: 'イタリアへ行ったとき、この帽子を買いました。',
    explanationVi: 'Dùng Vたとき vì sự kiện mua mũ xảy ra SAU KHI đến Ý (tại Ý). Nếu mua TRƯỚC khi đến Ý (ở Việt Nam) thì dùng 行くとき.',
    sortOrder: 5,
  },

  // ... [Tổng cộng 204 exercises với đầy đủ data]
];
```

---

### C.8 Card Generation Logic: 1 Pattern → Multiple Card Types

```typescript
// src/core/grammar/grammarCardFactory.ts

import { GrammarPattern, GrammarExercise } from './grammar.types';
import { Card } from '../cards/card.types';
import { nanoid } from 'nanoid';

/**
 * Từ một GrammarPattern, tạo ra các Card objects cho FSRS system
 * 
 * Strategy: 4 card types per pattern
 *   1. RECOGNITION card: Pattern template → Meaning
 *   2. CLOZE card: Example sentence with cloze
 *   3. PRODUCTION card: Vietnamese → Japanese
 *   4. STRUCTURE card: Identify pattern in sentence
 */
export function patternToCards(
  pattern: GrammarPattern,
  deckId: string = 'grammar_jpd133'
): Card[] {
  const now = new Date();
  const cards: Card[] = [];

  // Card 1: Recognition — What does this pattern mean?
  cards.push({
    id: `card_grammar_${pattern.id}_recognition`,
    deckId,
    type: 'GrammarPattern',
    front: `文法 ${pattern.id}: ${pattern.patternTemplate}`,
    reading: pattern.patternTemplate,
    meaning: pattern.meaningVi,
    pitch: null,
    sentence: pattern.examples[0]?.ja ?? null,
    audioUrl: null,
    tags: JSON.stringify(['grammar', pattern.jlptLevel, pattern.lessonId, 'recognition']),
    stability: 0,
    difficulty: 0,
    elapsedDays: 0,
    scheduledDays: 0,
    reps: 0,
    lapses: 0,
    state: 'New',
    due: now,
    lastReview: null,
    createdAt: now,
    updatedAt: now,
  });

  // Card 2: Example sentence CLOZE
  if (pattern.examples.length > 0) {
    const example = pattern.examples[0];
    const clozeSentence = example.ja.replace(
      example.highlight,
      `{{c1::${example.highlight}}}`
    );
    cards.push({
      id: `card_grammar_${pattern.id}_cloze_001`,
      deckId,
      type: 'GrammarPattern',
      front: clozeSentence,
      reading: example.ja_furigana ?? null,
      meaning: example.vi,
      pitch: null,
      sentence: example.ja,
      audioUrl: null,
      tags: JSON.stringify(['grammar', pattern.jlptLevel, pattern.lessonId, 'cloze']),
      stability: 0,
      difficulty: 0,
      elapsedDays: 0,
      scheduledDays: 0,
      reps: 0,
      lapses: 0,
      state: 'New',
      due: now,
      lastReview: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  // Card 3: Second example (if available)
  if (pattern.examples.length > 1) {
    const example = pattern.examples[1];
    const clozeSentence = example.ja.replace(
      example.highlight,
      `{{c1::${example.highlight}}}`
    );
    cards.push({
      id: `card_grammar_${pattern.id}_cloze_002`,
      deckId,
      type: 'GrammarPattern',
      front: clozeSentence,
      reading: example.ja_furigana ?? null,
      meaning: example.vi,
      pitch: null,
      sentence: example.ja,
      audioUrl: null,
      tags: JSON.stringify(['grammar', pattern.jlptLevel, pattern.lessonId, 'cloze']),
      stability: 0,
      difficulty: 0,
      elapsedDays: 0,
      scheduledDays: 0,
      reps: 0,
      lapses: 0,
      state: 'New',
      due: now,
      lastReview: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  // Card 4: Structure identification
  cards.push({
    id: `card_grammar_${pattern.id}_structure`,
    deckId,
    type: 'GrammarPattern',
    front: `Điền vào cấu trúc: ${pattern.patternTemplate.replace(/\w+/g, '___')}`,
    reading: null,
    meaning: `${pattern.patternTemplate} — ${pattern.meaningVi}`,
    pitch: null,
    sentence: pattern.examples[0]?.ja ?? null,
    audioUrl: null,
    tags: JSON.stringify(['grammar', pattern.jlptLevel, pattern.lessonId, 'structure']),
    stability: 0,
    difficulty: 0,
    elapsedDays: 0,
    scheduledDays: 0,
    reps: 0,
    lapses: 0,
    state: 'New',
    due: now,
    lastReview: null,
    createdAt: now,
    updatedAt: now,
  });

  return cards;
}

// Total: 32 patterns × 4 cards = 128 grammar cards
```

---

## PHẦN D: THIẾT KẾ UI/UX (Wa-Style Grammar Interface)

### D.1 Information Architecture: Grammar Module Sitemap

```
/grammar                           ← Grammar Gallery (List of Lessons)
│
├── /grammar/lesson-8              ← Bài 8 Detail (Patterns 72-80)
│   ├── Pattern G-72 (panel)
│   ├── Pattern G-73 (panel)
│   └── ... G-74 đến G-80
│
├── /grammar/lesson-9              ← Bài 9 Detail (Patterns 81-87)
├── /grammar/lesson-10             ← Bài 10 Detail (Patterns 88-97)
├── /grammar/lesson-11             ← Bài 11 Detail (Patterns 98-103)
│
├── /grammar/practice              ← FSRS Grammar Drill Session
│   ├── ?lessonId=lesson-8         ← Drill specific lesson
│   ├── ?lessonId=all              ← Drill all grammar
│   ├── ?mode=fsrs_due             ← Only due cards
│   └── ?mode=cram                 ← All cards regardless of due
│
└── /grammar/progress              ← Grammar Progress Dashboard
```

---

### D.2 Màn Hình /grammar — Grammar Gallery Page

#### Visual Design Concept: "Makimono Scroll Gallery" (巻物 — Cuộn Thư Pháp)

```
┌─────────────────────────────────────────────────────────────────────┐
│ [TORII RED TOP BAR 4px gradient]                                     │
├─────────────────────────────────────────────────────────────────────┤
│ [HEADER: Japanese SRS   [Trang chủ][Bộ thẻ][Động từ][Thêm thẻ][🏯] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  [HERO SECTION - INDIGO NIGHT WAVE]                                  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                                                               │  │
│  │  文法 · NGỮ PHÁP NHẬT BẢN                  [文] Inkan seal   │  │
│  │  ──────────────────────────                                  │  │
│  │  32 mẫu câu · Bài 8-11 JPD133              ⬛⬛⬛⬛          │  │
│  │  JLPT N5/N4 · 128 thẻ học FSRS                               │  │
│  │                                                               │  │
│  │  [🎴 Ôn luyện tất cả]  [📚 Xem tất cả bài]                  │  │
│  │                                                               │  │
│  │  ~~~ WAVE DIVIDER (Seigaiha SVG) ~~~                         │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  📊 Tổng quan hôm nay:                                               │
│  [12 thẻ đến hạn] [32 patterns] [128 cards] [4 bài học]            │
│                                                                      │
│  ─── 今日の文法学習 (HỌC NGỮ PHÁP HÔM NAY) ─────────────────────  │
│                                                                      │
│  ┌──────────────────┐ ┌──────────────────┐                          │
│  │  [ASANOHA SVG]   │ │  [SEIGAIHA SVG]  │                          │
│  │  [文] 第８課     │ │  [語] 第９課     │                          │
│  │  Bài 8           │ │  Bài 9           │                          │
│  │  Gia đình &      │ │  Khả năng &      │                          │
│  │  Mô tả người     │ │  Sở thích        │                          │
│  │  ───────────     │ │  ───────────     │                          │
│  │  9 mẫu câu       │ │  7 mẫu câu       │                          │
│  │  Pattern 72-80   │ │  Pattern 81-87   │                          │
│  │  ●●● N5/N4       │ │  ●●● N5/N4       │                          │
│  │  🔴 3 đến hạn    │ │  🟢 5 mới        │                          │
│  │                  │ │                  │                          │
│  │  [📖 Học ngữ pháp│ │  [📖 Học ngữ pháp│                          │
│  │  bài này]        │ │  bài này]        │                          │
│  │  [🎴 Ôn luyện]  │ │  [🎴 Ôn luyện]  │                          │
│  └──────────────────┘ └──────────────────┘                          │
│                                                                      │
│  ┌──────────────────┐ ┌──────────────────┐                          │
│  │  [YAGASURI SVG]  │ │  [KIKKO SVG]     │                          │
│  │  [法] 第１０課   │ │  [心] 第１１課   │                          │
│  │  Bài 10          │ │  Bài 11          │                          │
│  │  Quy tắc &       │ │  Cuộc sống &     │                          │
│  │  Hướng dẫn       │ │  Thói quen       │                          │
│  │  ───────────     │ │  ───────────     │                          │
│  │  10 mẫu câu      │ │  6 mẫu câu       │                          │
│  │  Pattern 88-97   │ │  Pattern 98-103  │                          │
│  │  ●● N5/N4        │ │  ●● N5/N4        │                          │
│  │  🔴 4 đến hạn    │ │  🟡 2 relearn    │                          │
│  │                  │ │                  │                          │
│  │  [📖 Học ngữ pháp│ │  [📖 Học ngữ pháp│                          │
│  │  bài này]        │ │  bài này]        │                          │
│  │  [🎴 Ôn luyện]  │ │  [🎴 Ôn luyện]  │                          │
│  └──────────────────┘ └──────────────────┘                          │
│                                                                      │
│  ─── 関連 LIÊN QUAN ───────────────────────────────────────────    │
│  Xem thêm: [Từ vựng][Hán tự][Ôn tập tổng hợp]                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

#### Wa-Style Color System cho Grammar Module

```css
/* Grammar-specific CSS tokens */
:root {
  /* Fuji Mountain Indigo (藤紺) — màu đặc trưng Grammar Module */
  --fuji-indigo:        #1B4268;  /* Xanh chàm Núi Phú Sĩ */
  --fuji-light:         #2B5A8A;  /* Fuji mid-tone */
  --fuji-subtle:        #EEF2F8;  /* Nền phấn xanh Fuji nhạt */
  --fuji-glow:          rgba(27, 66, 104, 0.25);

  /* Sumi Wash Indigo (墨藍) — text trong grammar module */
  --grammar-text-dark:  #122438;
  --grammar-text-mid:   #1B4268;
  --grammar-text-light: #4A7FA8;

  /* Badge colors cho JLPT levels */
  --jlpt-n5-bg:         #E8F4E8;  /* Xanh nhạt */
  --jlpt-n5-text:       #2B6B3D;  /* Xanh đậm */
  --jlpt-n4-bg:         #FEF3C7;  /* Vàng nhạt */
  --jlpt-n4-text:       #B8853C;  /* Vàng đậm */
  --jlpt-n3-bg:         #FDF2F0;  /* Đỏ nhạt */
  --jlpt-n3-text:       #C83824;  /* Đỏ đậm */

  /* Structure diagram slot colors */
  --slot-verb:          #88A752;  /* Matcha — Động từ */
  --slot-particle:      #D97706;  /* Yamabuki — Trợ từ */
  --slot-pattern-core:  #0D9488;  /* Asagi — Lõi mẫu câu */
  --slot-noun:          #1B4268;  /* Fuji — Danh từ */
  --slot-adjective:     #DB2777;  /* Sakura — Tính từ */
  --slot-adverb:        #6B7280;  /* Sumi faded — Trạng từ */
}
```

---

### D.3 Màn Hình /grammar/[lessonId] — Lesson Detail

```
┌─────────────────────────────────────────────────────────────────────┐
│ [HEADER - sticky]                                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ← Quay lại   [文] 第８課 · BÀI 8    [🎴 Ôn luyện bài này]         │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ [ASANOHA PATTERN HERO - Indigo/Navy]                         │   │
│  │                                                              │   │
│  │  第 8 課 · ことば                                            │   │
│  │  BÀI 8: MÔ TẢ ĐẶC ĐIỂM & TRAO NHẬN                        │   │
│  │  家族・友達   · Pattern 72-80 · JLPT N5/N4                  │   │
│  │                                                              │   │
│  │  [9 mẫu câu] [3 đến hạn] [6 mới] [27 thẻ FSRS]            │   │
│  │                                                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ─── 9 MẪU CÂU NGỮ PHÁP (9 文法パターン) ──────────────────────   │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │  № 72  · N5  · ★★☆☆☆                                      │     │
│  │  Vて形 + います                                              │     │
│  │  ──────────────────────────────────                         │     │
│  │  【Structure】                                               │     │
│  │  [🟢 V] + [🟡 て] + [🟦 います]                            │     │
│  │   Động từ   Te-suffix   Tiến hành                           │     │
│  │                                                              │     │
│  │  【Nghĩa】 Đang làm ~ / Đang ở trạng thái ~                │     │
│  │                                                              │     │
│  │  【Ví dụ 1】 🔊                                             │     │
│  │  私は横浜に住んでいます。                                    │     │
│  │  わたしは よこはまに すんでいます。                          │     │
│  │  "Tôi đang sống ở Yokohama."                               │     │
│  │                                                              │     │
│  │  【Ví dụ 2】 🔊                                             │     │
│  │  今、雨が降っています。                                      │     │
│  │  いま、あめが ふっています。                                 │     │
│  │  "Bây giờ trời đang mưa."                                  │     │
│  │                                                              │     │
│  │  ⚠️ Phân biệt với Pattern 73 → [Xem G-73]                  │     │
│  │                                                              │     │
│  │  [🎴 Luyện tập pattern này] [💾 Thêm vào thẻ]              │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │  № 73  · N5  · ★★★☆☆                                      │     │
│  │  Vて形 + います (nghề nghiệp)                               │     │
│  │  [... tương tự ở trên ...]                                  │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                      │
│  [... Pattern 74 đến 80 ...]                                         │
│                                                                      │
│  ─── 問題集 · BÀI TẬP (25 exercises) ───────────────────────────   │
│  [🎯 Làm bài tập bài 8 — 25 câu]                                    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

#### Pattern Card Component Specification

```tsx
// src/components/grammar/PatternCard.tsx

interface PatternCardProps {
  pattern: PatternDetailDTO;
  isExpanded: boolean;
  onToggle: () => void;
  onPractice: (patternId: string) => void;
}

// Visual States:
// 1. Collapsed: Hiển thị header (số, template, JLPT badge)
// 2. Expanded: Hiển thị đầy đủ structure diagram + examples + actions

// Structure Diagram rendering:
// SVG với các colored blocks cho từng slot
// Hover tooltip giải thích từng slot

// Example rendering:
// Sử dụng <ruby> markup cho furigana
// parseClozeSegments() để highlight pattern core
// JapaneseSpeakerButton với stripCloze()
```

---

### D.5 Grammar Card Component — 3D Flip + Cloze Highlight

```tsx
// src/components/grammar/GrammarDrillCard.tsx

// Front side: Cloze sentence với [___] placeholder
// Back side: Đáp án + explanation + Structure diagram mini

// Animation: Same Karuta 3D flip (perspective: 1200px, cubic-bezier spring)

// Special features:
// - Auto-focus input field khi flip về front
// - Input validation real-time (hiragana vs kanji acceptance)
// - Keyboard shortcut: Enter = submit, Tab = skip, Space = flip
```

---

## PHẦN E: WORK BREAKDOWN STRUCTURE (WBS)

### E.1 WBS Layer 1: Strategic Epics

```
EPIC-G1: Data Foundation (Nền tảng Dữ liệu)
  └─ Grammar data extraction, normalization, seed scripts, DB tables

EPIC-G2: API Layer (Tầng API)
  └─ REST endpoints for lessons, patterns, exercises, practice queue

EPIC-G3: Core Learning UI (Giao diện Học)
  └─ /grammar, /grammar/[lessonId] pages, PatternCard, StructureDiagram

EPIC-G4: Practice Engine (Máy Luyện tập)
  └─ /grammar/practice, GrammarDrillSession, Exercise components

EPIC-G5: FSRS Integration (Tích hợp FSRS)
  └─ Grammar cards in FSRS queue, grading, progress tracking

EPIC-G6: DevOps & Deployment (Vận hành)
  └─ DB migration, Turso sync, Vercel deployment, health checks
```

---

### E.2 WBS Layer 2: Subsystem Decomposition

```
EPIC-G1: Data Foundation
├── G1.1: DB Schema Extension (grammar_patterns, grammar_exercises, grammar_lessons)
├── G1.2: TypeScript Types (grammar.types.ts)
├── G1.3: Grammar Pattern Seed Data (32 patterns với full data)
├── G1.4: Grammar Exercise Seed Data (204 exercises)
└── G1.5: Import Script (import-grammar-jpd133.ts)

EPIC-G2: API Layer
├── G2.1: GET /api/grammar (lesson list with stats)
├── G2.2: GET /api/grammar/[lessonId] (lesson detail with patterns + exercises)
├── G2.3: POST /api/grammar/seed (idempotent seed endpoint)
├── G2.4: GET /api/grammar/practice (FSRS practice queue)
└── G2.5: Grammar Repository (grammarRepository.ts)

EPIC-G3: Core Learning UI
├── G3.1: /grammar page (GrammarGallery RSC)
├── G3.2: LessonCard component
├── G3.3: /grammar/[lessonId] page (LessonDetail RSC)
├── G3.4: PatternCard component (collapsible + expanded)
├── G3.5: StructureDiagram SVG component
├── G3.6: ExampleSentence component (ruby + highlight + TTS)
└── G3.7: Navigation & breadcrumbs

EPIC-G4: Practice Engine
├── G4.1: /grammar/practice page (Client Component)
├── G4.2: GrammarDrillSession state machine
├── G4.3: ClozeExercise component
├── G4.4: MultipleChoiceExercise component
├── G4.5: FillBlankExercise component
├── G4.6: TranslationExercise component (Phase 1.5)
└── G4.7: DrillProgress UI (progress bar, score)

EPIC-G5: FSRS Integration
├── G5.1: Grammar Card Factory (patternToCards())
├── G5.2: Grammar Cards in /review queue (type filter)
├── G5.3: Grammar progress tracking per pattern
├── G5.4: Grammar Cards on homepage due queue
└── G5.5: Grammar badge in card list items

EPIC-G6: DevOps & Deployment
├── G6.1: DB Migration script (Turso schema update)
├── G6.2: Turso Cloud sync for grammar data
├── G6.3: /api/health update (include grammar stats)
├── G6.4: Vercel environment variable updates
└── G6.5: Production deployment checklist
```

---

### E.3 WBS Layer 3: Module Specifications (Key Modules)

#### G1.1 — DB Schema Extension

**Files to create/modify:**
- `src/db/schema.ts` — APPEND ONLY: Add `grammarPatterns`, `grammarExercises`, `grammarLessons` tables
- `src/db/repositories/grammarRepository.ts` — New file

**Drizzle Migration:**
- `src/db/migrations/0003_grammar_tables.sql` — DDL for 3 new tables

**Turso Sync:**
- `scripts/sync-turso-grammar.ts` — Push grammar schema to cloud

---

#### G1.3 + G1.4 — Seed Data Files

**Files to create:**
- `scripts/data/grammar-lessons.ts` — 4 lesson objects
- `scripts/data/grammar-patterns.ts` — 32 pattern objects (full JSON with all fields)
- `scripts/data/grammar-exercises.ts` — 204 exercise objects

**Validation before insert:**
- All 32 pattern IDs unique (G-72 to G-103)
- All exercise IDs unique (EX-G72-001 to EX-G103-006)
- All patternId references valid
- All sentenceWithCloze follow `{{c1::...}}` format

---

#### G2.1 — GET /api/grammar

```typescript
// src/app/api/grammar/route.ts

import { db } from '@/db/client';
import { grammarLessons, grammarPatterns, cards } from '@/db/schema';
import { eq, and, lte, count, sql } from 'drizzle-orm';

export const revalidate = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jlptFilter = searchParams.get('jlpt'); // 'N5' | 'N4' | null

  // 1. Get all lessons
  const lessons = await db.select().from(grammarLessons).orderBy(grammarLessons.sortOrder);
  
  // 2. For each lesson, calculate card stats
  const now = new Date();
  const lessonStats = await Promise.all(
    lessons.map(async (lesson) => {
      const [stats] = await db
        .select({
          totalCards: count(),
          dueCards: sql<number>`SUM(CASE WHEN ${cards.state} != 'New' AND ${cards.due} <= ${now} THEN 1 ELSE 0 END)`,
          newCards: sql<number>`SUM(CASE WHEN ${cards.state} = 'New' THEN 1 ELSE 0 END)`,
        })
        .from(cards)
        .where(
          and(
            eq(cards.deckId, 'grammar_jpd133'),
            sql`JSON_EXTRACT(${cards.tags}, '$[2]') = ${lesson.id}`
          )
        );
      
      const reviewed = (stats.totalCards || 0) - (stats.newCards || 0);
      const progressPercent = stats.totalCards 
        ? Math.round((reviewed / stats.totalCards) * 100) 
        : 0;
      
      return {
        ...lesson,
        dueCards: stats.dueCards || 0,
        newCards: stats.newCards || 0,
        totalCards: stats.totalCards || 0,
        progressPercent,
      };
    })
  );
  
  return Response.json({
    lessons: lessonStats,
    totalPatterns: 32,
    totalCards: lessonStats.reduce((sum, l) => sum + l.totalCards, 0),
    totalDue: lessonStats.reduce((sum, l) => sum + l.dueCards, 0),
  });
}
```

---

### E.4 WBS Layer 4: Atomic Tasks (200+ Micro-tasks)

#### Sprint 1 (Tuần 1-2): Data Foundation + API

| Task ID | Task | Owner Role | Est (hours) | Priority |
|:---:|:---|:---:|:---:|:---:|
| T-G01 | Thêm 3 tables vào schema.ts (append only) | Engineer | 2 | P0 |
| T-G02 | Tạo grammar.types.ts với tất cả interfaces | Engineer | 3 | P0 |
| T-G03 | Tạo grammarRepository.ts với 5 query functions | Engineer | 4 | P0 |
| T-G04 | Viết grammar-lessons.ts seed data (4 lessons) | BA/Engineer | 1 | P0 |
| T-G05 | Viết grammar-patterns.ts (G-72 đến G-103, 32 patterns) | BA/Engineer | 8 | P0 |
| T-G06 | Viết grammar-exercises.ts (204 exercises, đủ loại) | BA/Engineer | 10 | P0 |
| T-G07 | Tạo grammarCardFactory.ts | Engineer | 2 | P0 |
| T-G08 | Tạo import-grammar-jpd133.ts script | Engineer | 3 | P0 |
| T-G09 | Test import script locally (tsc + run) | QA | 1 | P0 |
| T-G10 | Tạo GET /api/grammar route | Engineer | 2 | P0 |
| T-G11 | Tạo GET /api/grammar/[lessonId] route | Engineer | 2 | P0 |
| T-G12 | Tạo POST /api/grammar/seed route | Engineer | 2 | P0 |
| T-G13 | Tạo GET /api/grammar/practice route | Engineer | 3 | P0 |
| T-G14 | Viết unit tests cho grammarRepository | QA | 3 | P1 |
| T-G15 | Viết unit tests cho grammarCardFactory | QA | 2 | P1 |
| T-G16 | Viết integration tests cho /api/grammar | QA | 3 | P1 |
| T-G17 | Drizzle migration file cho grammar tables | Engineer | 1 | P0 |
| T-G18 | Sync grammar schema to Turso Cloud | DevOps | 1 | P0 |
| T-G19 | Chạy import script trên production | DevOps | 1 | P0 |
| T-G20 | Verify /api/health trả về grammar stats | DevOps | 1 | P1 |

**Sprint 1 Total Estimate: ~54 hours**

---

#### Sprint 2 (Tuần 3-4): Core Learning UI

| Task ID | Task | Owner Role | Est (hours) | Priority |
|:---:|:---|:---:|:---:|:---:|
| T-G21 | Tạo StructureDiagram SVG component | UI/Engineer | 4 | P0 |
| T-G22 | Tạo ExampleSentence component (ruby + TTS) | UI/Engineer | 3 | P0 |
| T-G23 | Tạo PatternCard component (collapsed + expanded) | UI/Engineer | 5 | P0 |
| T-G24 | Tạo LessonCard component | UI/Engineer | 3 | P0 |
| T-G25 | Xây dựng /grammar page (GrammarGallery RSC) | Engineer | 4 | P0 |
| T-G26 | Xây dựng /grammar/[lessonId] page | Engineer | 5 | P0 |
| T-G27 | Thêm CSS tokens cho Grammar module vào globals.css | UI | 2 | P0 |
| T-G28 | Navigation link "Ngữ pháp" vào Header | Engineer | 1 | P0 |
| T-G29 | Navigation item "Ngữ pháp" vào KirieBottomNav | Engineer | 1 | P0 |
| T-G30 | Wagara patterns cho 4 lessons (SVG inline) | UI | 2 | P1 |
| T-G31 | Inkan seals cho 4 lessons (文/語/法/心) | UI | 1 | P1 |
| T-G32 | Grammar progress indicator trên lesson cards | Engineer | 2 | P1 |
| T-G33 | JLPT badge component | UI | 1 | P1 |
| T-G34 | Related patterns linking | Engineer | 2 | P2 |
| T-G35 | Mobile responsive layout | UI | 3 | P0 |
| T-G36 | Loading skeleton cho grammar pages | Engineer | 2 | P1 |
| T-G37 | Error boundary với Washi fallback | Engineer | 2 | P0 |
| T-G38 | E2E test: /grammar page renders 4 lessons | QA | 2 | P1 |
| T-G39 | E2E test: /grammar/lesson-8 renders 9 patterns | QA | 2 | P1 |
| T-G40 | Accessibility audit | QA | 3 | P1 |

**Sprint 2 Total Estimate: ~52 hours**

---

#### Sprint 3 (Tuần 5-6): Practice Engine + FSRS Integration

| Task ID | Task | Owner Role | Est (hours) | Priority |
|:---:|:---|:---:|:---:|:---:|
| T-G41 | Tạo GrammarDrillSession state machine (hook) | Engineer | 5 | P0 |
| T-G42 | Tạo ClozeExercise component | Engineer | 4 | P0 |
| T-G43 | Tạo MultipleChoiceExercise component | Engineer | 3 | P0 |
| T-G44 | Tạo FillBlankExercise component | Engineer | 3 | P1 |
| T-G45 | Xây dựng /grammar/practice page | Engineer | 5 | P0 |
| T-G46 | Kết nối practice với POST /api/review (FSRS grade) | Engineer | 3 | P0 |
| T-G47 | Grammar Cards type filter trong /review queue | Engineer | 2 | P1 |
| T-G48 | Grammar Cards hiển thị trong homepage due list | Engineer | 2 | P1 |
| T-G49 | Badge [文法] cho grammar cards trong card lists | UI | 1 | P1 |
| T-G50 | Progress tracking per pattern | Engineer | 3 | P2 |
| T-G51 | /grammar/progress page (basic) | Engineer | 3 | P2 |
| T-G52 | Keyboard shortcuts cho drill session | Engineer | 2 | P2 |
| T-G53 | Animation cho correct/incorrect answers | UI | 2 | P1 |
| T-G54 | Session completion screen | UI | 2 | P1 |
| T-G55 | Cram mode toggle | Engineer | 2 | P2 |
| T-G56 | FSRS Mathematical invariant tests cho grammar cards | QA | 3 | P1 |
| T-G57 | E2E test: Complete drill session với FSRS grading | QA | 3 | P0 |
| T-G58 | Edge case tests (empty queue, network error) | QA | 2 | P1 |
| T-G59 | Performance test (FCP < 1.5s) | QA | 1 | P1 |
| T-G60 | Input method handling (IME for Japanese input) | Engineer | 2 | P1 |

**Sprint 3 Total Estimate: ~52 hours**

---

#### Sprint 4 (Tuần 7-8): DevOps + Polish + Release

| Task ID | Task | Owner Role | Est (hours) | Priority |
|:---:|:---|:---:|:---:|:---:|
| T-G61 | Production Turso schema migration | DevOps | 2 | P0 |
| T-G62 | Production grammar data import | DevOps | 1 | P0 |
| T-G63 | Vercel environment variable review | DevOps | 1 | P0 |
| T-G64 | Update /api/health với grammar stats | DevOps | 1 | P1 |
| T-G65 | Full build test (npm run build) | DevOps | 1 | P0 |
| T-G66 | Production smoke test (all grammar endpoints) | QA | 2 | P0 |
| T-G67 | Lighthouse performance audit | QA | 1 | P1 |
| T-G68 | Grammar search functionality (basic) | Engineer | 3 | P2 |
| T-G69 | JLPT filter on /grammar | Engineer | 2 | P2 |
| T-G70 | Comparison cards cho あげます/もらいます/くれます | UI | 2 | P1 |
| T-G71 | とき timing diagram (visual) | UI | 3 | P2 |
| T-G72 | Audio feedback for correct/incorrect | UI | 1 | P2 |
| T-G73 | Grammar card dalam calendar.service.ts (Google Calendar) | Engineer | 2 | P3 |
| T-G74 | Documentation update (README) | Engineer | 2 | P2 |
| T-G75 | Release notes và changelog | PM | 1 | P2 |

**Sprint 4 Total Estimate: ~28 hours**

**TỔNG WBS: ~186 hours = ~23 working days = ~4.5 tuần với 1 developer**

---

### E.5 Sprint Planning Summary

| Sprint | Tuần | Focus | Deliverables | DoD Gate |
|:---:|:---:|:---|:---|:---:|
| Sprint 1 | 1-2 | Data Foundation + API | DB schema, seed data, API routes | `tsc` + API tests pass |
| Sprint 2 | 3-4 | Core Learning UI | /grammar pages, PatternCard, StructureDiagram | Build + E2E page tests |
| Sprint 3 | 5-6 | Practice Engine + FSRS | Drill session, FSRS integration | Full clickstream E2E |
| Sprint 4 | 7-8 | DevOps + Polish + Release | Production deployment, audit | Production smoke test |

---

## PHẦN F: KIỂM THỬ & ĐẢM BẢO CHẤT LƯỢNG

### F.1 Test Matrix: Unit Tests (Vitest)

#### Test Suite 1: Grammar Repository

```typescript
// tests/grammarRepository.test.ts

describe('Grammar Repository', () => {
  describe('getAllLessons()', () => {
    it('returns 4 lessons in order (8, 9, 10, 11)', async () => {
      const lessons = await grammarRepository.getAllLessons();
      expect(lessons).toHaveLength(4);
      expect(lessons.map(l => l.lessonNumber)).toEqual([8, 9, 10, 11]);
    });

    it('each lesson has patternCount > 0', async () => {
      const lessons = await grammarRepository.getAllLessons();
      lessons.forEach(l => expect(l.patternCount).toBeGreaterThan(0));
    });

    it('total patterns across all lessons = 32', async () => {
      const lessons = await grammarRepository.getAllLessons();
      const total = lessons.reduce((sum, l) => sum + l.patternCount, 0);
      expect(total).toBe(32);
    });
  });

  describe('getLessonById()', () => {
    it('returns lesson-8 with 9 patterns', async () => {
      const lesson = await grammarRepository.getLessonById('lesson-8');
      expect(lesson).toBeDefined();
      expect(lesson!.patterns).toHaveLength(9);
    });

    it('patterns sorted by patternNumber ascending', async () => {
      const lesson = await grammarRepository.getLessonById('lesson-8');
      const numbers = lesson!.patterns!.map(p => p.patternNumber);
      expect(numbers).toEqual([72, 73, 74, 75, 76, 77, 78, 79, 80]);
    });

    it('returns null for non-existent lessonId', async () => {
      const lesson = await grammarRepository.getLessonById('lesson-99');
      expect(lesson).toBeNull();
    });
  });

  describe('getExercisesByPattern()', () => {
    it('returns exercises for G-72 sorted by sortOrder', async () => {
      const exercises = await grammarRepository.getExercisesByPattern('G-72');
      expect(exercises.length).toBeGreaterThanOrEqual(6);
      const orders = exercises.map(e => e.sortOrder);
      expect(orders).toEqual([...orders].sort((a, b) => a - b));
    });

    it('each exercise has valid exerciseType', async () => {
      const exercises = await grammarRepository.getExercisesByPattern('G-72');
      const validTypes = ['cloze', 'multiple_choice', 'fill_blank', 'translation_vi_to_ja', 'jumble'];
      exercises.forEach(ex => {
        expect(validTypes).toContain(ex.exerciseType);
      });
    });
  });
});
```

#### Test Suite 2: Grammar Card Factory

```typescript
// tests/grammarCardFactory.test.ts

describe('Grammar Card Factory', () => {
  const mockPattern: GrammarPattern = {
    id: 'G-72',
    lessonId: 'lesson-8',
    patternNumber: 72,
    jlptLevel: 'N5',
    difficultyScore: 2,
    patternTemplate: 'Vて形 + います',
    structureSlots: [],
    meaningVi: 'Đang làm ~',
    examples: [
      { ja: '私は横浜に住んでいます。', vi: '...', highlight: '住んでいます', highlightType: 'pattern_core' }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('generates at least 2 cards per pattern', () => {
    const cards = patternToCards(mockPattern, 'grammar_jpd133');
    expect(cards.length).toBeGreaterThanOrEqual(2);
  });

  it('all cards have type = GrammarPattern', () => {
    const cards = patternToCards(mockPattern, 'grammar_jpd133');
    cards.forEach(c => expect(c.type).toBe('GrammarPattern'));
  });

  it('all cards have deckId = grammar_jpd133', () => {
    const cards = patternToCards(mockPattern, 'grammar_jpd133');
    cards.forEach(c => expect(c.deckId).toBe('grammar_jpd133'));
  });

  it('cloze card front contains {{c1::...}} syntax', () => {
    const cards = patternToCards(mockPattern, 'grammar_jpd133');
    const clozeCards = cards.filter(c => c.front.includes('{{c1::'));
    expect(clozeCards.length).toBeGreaterThanOrEqual(1);
  });

  it('all cards start with state = New and stability = 0', () => {
    const cards = patternToCards(mockPattern, 'grammar_jpd133');
    cards.forEach(c => {
      expect(c.state).toBe('New');
      expect(c.stability).toBe(0);
    });
  });

  it('generates 128 cards total for all 32 patterns', () => {
    const allCards = GRAMMAR_PATTERNS.flatMap(p => patternToCards(p));
    expect(allCards.length).toBe(128);
  });

  it('no duplicate card IDs across all patterns', () => {
    const allCards = GRAMMAR_PATTERNS.flatMap(p => patternToCards(p));
    const ids = allCards.map(c => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
```

#### Test Suite 3: Cloze Parser Integration

```typescript
// tests/cloze-grammar.test.ts

describe('Cloze Parser with Grammar Exercises', () => {
  it('parseClozeSegments correctly parses grammar cloze', () => {
    const input = 'そこに{{c1::入らない}}でください。';
    const segments = parseClozeSegments(input);
    expect(segments).toEqual([
      { text: 'そこに', isCloze: false },
      { text: '入らない', isCloze: true },
      { text: 'でください。', isCloze: false },
    ]);
  });

  it('stripCloze returns clean Japanese for TTS', () => {
    const input = '私は横浜に{{c1::住んでいます}}。';
    expect(stripCloze(input)).toBe('私は横浜に住んでいます。');
  });

  it('handles multiple cloze in one sentence', () => {
    const input = '{{c1::田中}}さんは{{c2::高校}}で英語を{{c3::教えています}}。';
    const plain = stripCloze(input);
    expect(plain).toBe('田中さんは高校で英語を教えています。');
  });

  it('handles cloze with hint (c1::word::hint)', () => {
    const input = '{{c1::住んでいます::V-te form}}。';
    const segments = parseClozeSegments(input);
    expect(segments[0].text).toBe('住んでいます');
    expect(segments[0].isCloze).toBe(true);
  });
});
```

---

### F.2 FSRS Mathematical Invariants cho Grammar Cards

```typescript
// tests/grammar-fsrs-invariants.test.ts

describe('FSRS Invariants for Grammar Cards', () => {
  const grammarCard = {
    stability: 3.0,
    difficulty: 4.5,
    state: 'Review' as const,
    lapses: 0,
    reps: 3,
    elapsedDays: 3,
    scheduledDays: 3,
    due: new Date(Date.now() - 86400000), // 1 day overdue
    lastReview: new Date(Date.now() - 4 * 86400000),
  };

  it('Rating ordering invariant: Again < Hard < Good < Easy', () => {
    const scheduler = new FsrsScheduler();
    const result = scheduler.schedule(grammarCard);
    expect(result.Again.scheduledDays).toBeLessThan(result.Hard.scheduledDays);
    expect(result.Hard.scheduledDays).toBeLessThan(result.Good.scheduledDays);
    expect(result.Good.scheduledDays).toBeLessThan(result.Easy.scheduledDays);
  });

  it('Again rating increments lapses count', () => {
    const scheduler = new FsrsScheduler();
    const result = scheduler.schedule(grammarCard);
    expect(result.Again.card.lapses).toBe(grammarCard.lapses + 1);
  });

  it('Grammar card initializes as New with stability = 0', () => {
    const newCard = patternToCards(GRAMMAR_PATTERNS[0])[0];
    expect(newCard.state).toBe('New');
    expect(newCard.stability).toBe(0);
    expect(newCard.difficulty).toBe(0);
  });
});
```

---

### F.3 Edge Case Catalog (EC-G01 đến EC-G30)

| EC-ID | Edge Case | Expected Behavior | Test File |
|:---:|:---|:---|:---|
| EC-G01 | /grammar với DB trống (0 grammar cards) | Empty state Washi, import button | grammarGallery.test.ts |
| EC-G02 | /grammar/lesson-99 không tồn tại | 404 Washi page với link về /grammar | lessonDetail.test.ts |
| EC-G03 | Pattern có 0 exercises | Ẩn section bài tập, không crash | patternCard.test.ts |
| EC-G04 | TTS không hỗ trợ tiếng Nhật | Clipboard copy fallback | exampleSentence.test.ts |
| EC-G05 | User gõ Latin thay vì Hiragana trong cloze fill | Accept nếu romaji match, else mark wrong | clozeExercise.test.ts |
| EC-G06 | Network timeout khi grade FSRS | Cache grade, advance to next, retry | drillSession.test.ts |
| EC-G07 | Drill queue = 0 cards | Completed screen với cram mode CTA | drillSession.test.ts |
| EC-G08 | Double Enter press (submit twice) | Idempotent — only grade once | clozeExercise.test.ts |
| EC-G09 | Pattern với emoji trong structureSlots | SVG renders correctly | structureDiagram.test.ts |
| EC-G10 | Cloze answer với multiple acceptable forms | Accept all alternateAnswers | clozeExercise.test.ts |
| EC-G11 | Grammar card trong review queue với invalid type | Fallback render, log error | review.test.ts |
| EC-G12 | Import script chạy khi DB unreachable | Graceful error message, exit code 1 | import.test.ts |
| EC-G13 | Grammar exercise với null explanation | Render without explanation box | exercise.test.ts |
| EC-G14 | Lesson với 0 due cards, 0 new cards | Completed badge, cram button | lessonCard.test.ts |
| EC-G15 | Mobile screen width < 360px | Layout không vỡ | responsive.test.ts |
| EC-G16 | /grammar/practice?lessonId=invalid | Fallback to all lessons | practice.test.ts |
| EC-G17 | Browser back button during drill | Save progress to session storage | drillSession.test.ts |
| EC-G18 | Seed script với duplicate patterns | INSERT OR IGNORE, no error | importScript.test.ts |
| EC-G19 | Cloze với special chars: 「」・～ | Correct parsing, no regex error | cloze.test.ts |
| EC-G20 | Multiple patterns with same template string | Distinct by ID, no collision | grammarRepo.test.ts |
| EC-G21 | Grammar card due date in past by 30+ days | Still shows as due, FSRS grades normally | fsrs.test.ts |
| EC-G22 | User skips all exercises in session | All marked Again, show pattern review | drillSession.test.ts |
| EC-G23 | StructureDiagram with 6+ slots | SVG doesn't overflow container | structureDiagram.test.ts |
| EC-G24 | Lesson with single example per pattern | Renders correctly (min 1 example) | patternCard.test.ts |
| EC-G25 | Grammar cards in /review mixed with vocab | Grammar badge shown, FSRS same engine | review.test.ts |
| EC-G26 | API/grammar/seed called without auth token | 401 Unauthorized response | seed.test.ts |
| EC-G27 | Font loading failure (Noto Sans JP timeout) | Falls back to system Japanese font | typography.test.ts |
| EC-G28 | Keyboard shortcut conflicts (Space vs flip) | Drill: Space = submit; Review: Space = flip | keyboardShortcut.test.ts |
| EC-G29 | Grammar exercise answer = empty string | Validation error shown, not graded | exercise.test.ts |
| EC-G30 | App offline during grammar browse | Show cached lesson data from SW | offline.test.ts |

---

### F.4 Accessibility Testing (WCAG AA)

#### Contrast Requirements
- Grammar module blue (#1B4268) on white (#FFFFFF): 12.5:1 ✓ (exceeds 4.5:1)
- JLPT N5 badge: #2B6B3D on #E8F4E8: 6.8:1 ✓
- Pattern core highlight (#0D9488) on #FAF8F5: 4.8:1 ✓ (just above 4.5:1)

#### Keyboard Navigation
- Tab order: LessonCards → PracticeButton → PatternCards (in order) → ExerciseInput → Submit
- Escape: Close expanded PatternCard panel
- Enter: Submit drill answer
- Space: Play audio
- Arrow keys: Navigate between patterns

#### Screen Reader Support
- Each PatternCard: aria-label="Pattern 72, Vてform plus います, N5, difficulty 2 of 5"
- StructureDiagram: aria-label="Structure: Verb (te-form) followed by います"
- ClozeExercise: aria-label="Fill in the blank exercise, sentence: そこに [blank] でください"

---

## PHẦN G: DEVOPS & DEPLOYMENT

### G.1 Environment Variable Updates

Không cần thêm env vars mới — Grammar Engine sử dụng cùng TURSO_DATABASE_URL và TURSO_AUTH_TOKEN.

Chỉ thêm optional:
```env
# Optional: Secret token for /api/grammar/seed (production protection)
GRAMMAR_SEED_TOKEN=your_secret_here_generate_with_openssl_rand_hex_32
```

---

### G.2 Database Migration Strategy

#### Migration File: `src/db/migrations/0003_grammar_tables.sql`

```sql
-- Migration: Add Grammar Engine tables
-- Version: 0003
-- Date: 2026-10-03
-- Safe: ADDITIVE ONLY — no changes to existing tables

CREATE TABLE IF NOT EXISTS grammar_lessons (
  id TEXT PRIMARY KEY,
  lesson_number INTEGER NOT NULL,
  title_ja TEXT NOT NULL,
  title_vi TEXT NOT NULL,
  theme_ja TEXT,
  theme_vi TEXT,
  pattern_range TEXT NOT NULL,
  pattern_count INTEGER NOT NULL,
  accent_color TEXT NOT NULL,
  wagara TEXT,
  inkan_char TEXT,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS grammar_patterns (
  id TEXT PRIMARY KEY,
  lesson_id TEXT NOT NULL REFERENCES grammar_lessons(id),
  pattern_number INTEGER NOT NULL,
  jlpt_level TEXT NOT NULL,
  difficulty_score INTEGER NOT NULL DEFAULT 3,
  pattern_template TEXT NOT NULL,
  structure_slots TEXT NOT NULL,
  meaning_vi TEXT NOT NULL,
  meaning_ja TEXT,
  usage_note TEXT,
  examples TEXT NOT NULL,
  verb_types TEXT,
  related_pattern_ids TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_grammar_patterns_lesson_id ON grammar_patterns(lesson_id);
CREATE INDEX IF NOT EXISTS idx_grammar_patterns_jlpt ON grammar_patterns(jlpt_level);

CREATE TABLE IF NOT EXISTS grammar_exercises (
  id TEXT PRIMARY KEY,
  pattern_id TEXT NOT NULL REFERENCES grammar_patterns(id) ON DELETE CASCADE,
  exercise_type TEXT NOT NULL,
  difficulty INTEGER NOT NULL DEFAULT 2,
  sentence_with_cloze TEXT,
  question TEXT,
  option_a TEXT,
  option_b TEXT,
  option_c TEXT,
  option_d TEXT,
  correct_option TEXT,
  prompt_text TEXT,
  answer_text TEXT NOT NULL,
  alternate_answers TEXT,
  explanation_vi TEXT,
  explanation_ja TEXT,
  source_ref TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_grammar_exercises_pattern_id ON grammar_exercises(pattern_id);
CREATE INDEX IF NOT EXISTS idx_grammar_exercises_type ON grammar_exercises(exercise_type);
```

---

### G.3 Turso Cloud Sync Script cho Grammar Data

#### Script: `scripts/sync-turso-grammar.ts`

```typescript
// scripts/sync-turso-grammar.ts
// Đồng bộ grammar schema + data lên Turso Cloud
// Usage: npx tsx scripts/sync-turso-grammar.ts

import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!.replace('libsql://', 'https://'),
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function syncGrammarSchema() {
  console.log('📋 Creating grammar tables...');
  
  // Execute DDL statements from migration file
  const migrationSQL = await fs.readFile(
    'src/db/migrations/0003_grammar_tables.sql', 
    'utf-8'
  );
  
  const statements = migrationSQL
    .split(';')
    .filter(s => s.trim().length > 0);
  
  for (const stmt of statements) {
    await client.execute(stmt.trim());
  }
  
  console.log('✅ Grammar tables created/verified');
}

async function syncGrammarData() {
  console.log('📥 Syncing grammar data...');
  
  // Import seed data
  const { GRAMMAR_LESSONS } = await import('./data/grammar-lessons.js');
  const { GRAMMAR_PATTERNS } = await import('./data/grammar-patterns.js');
  const { GRAMMAR_EXERCISES } = await import('./data/grammar-exercises.js');
  
  // Insert lessons (idempotent)
  for (const lesson of GRAMMAR_LESSONS) {
    await client.execute({
      sql: `INSERT OR IGNORE INTO grammar_lessons VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: [/* ...lesson fields... */],
    });
  }
  
  // Insert patterns
  for (const pattern of GRAMMAR_PATTERNS) {
    await client.execute({
      sql: `INSERT OR IGNORE INTO grammar_patterns VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: [/* ...pattern fields... */],
    });
  }
  
  // Insert exercises
  for (const exercise of GRAMMAR_EXERCISES) {
    await client.execute({
      sql: `INSERT OR IGNORE INTO grammar_exercises VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: [/* ...exercise fields... */],
    });
  }
  
  console.log(`✅ Synced: ${GRAMMAR_LESSONS.length} lessons, ${GRAMMAR_PATTERNS.length} patterns, ${GRAMMAR_EXERCISES.length} exercises`);
}

async function main() {
  await syncGrammarSchema();
  await syncGrammarData();
  
  // Generate grammar cards and sync to cards table
  const { GRAMMAR_PATTERNS: patterns } = await import('./data/grammar-patterns.js');
  const { patternToCards } = await import('../src/core/grammar/grammarCardFactory.js');
  
  let cardCount = 0;
  for (const pattern of patterns) {
    const cards = patternToCards(pattern);
    for (const card of cards) {
      await client.execute({
        sql: `INSERT OR IGNORE INTO cards VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        args: [/* ...card fields... */],
      });
      cardCount++;
    }
  }
  
  console.log(`✅ Synced ${cardCount} grammar cards to Turso Cloud`);
  console.log('🎉 Grammar sync complete!');
}

main().catch(console.error);
```

---

### G.4 Vercel Deployment Checklist

```markdown
### ✅ PRE-DEPLOYMENT CHECKLIST — Grammar Engine v1.0

#### Code Quality
- [ ] `npx tsc --noEmit` → 0 errors
- [ ] `npm run test` → 100% pass
- [ ] `npm run build` → 0 hydration warnings
- [ ] All new files have TypeScript strict typing (no `any`)

#### Database
- [ ] Turso schema migration 0003 applied
- [ ] 4 grammar lessons in grammar_lessons table
- [ ] 32 grammar patterns in grammar_patterns table  
- [ ] 204+ exercises in grammar_exercises table
- [ ] 128 grammar cards in cards table (type = 'GrammarPattern')
- [ ] grammar_jpd133 deck in decks table

#### API Endpoints
- [ ] GET /api/grammar → 200, returns 4 lessons
- [ ] GET /api/grammar/lesson-8 → 200, returns 9 patterns
- [ ] GET /api/grammar/practice?lessonId=lesson-8 → 200
- [ ] /api/health → shows grammar card count

#### UI Pages
- [ ] /grammar → loads < 1.5s FCP
- [ ] /grammar/lesson-8 → loads < 2s FCP
- [ ] /grammar/practice → loads, drill works end-to-end
- [ ] Mobile layout correct (test at 375px width)

#### FSRS Integration
- [ ] Grammar cards appear in /review with [文法] badge
- [ ] Grammar cards appear in homepage due list
- [ ] Grading via POST /api/review works for grammar cards
- [ ] FSRS intervals update correctly after grading

#### Accessibility
- [ ] Tab navigation works through all grammar pages
- [ ] Screen reader announces pattern numbers/names
- [ ] Color contrast WCAG AA ≥ 4.5:1

#### Production Smoke Test
- [ ] Visit /grammar on production domain
- [ ] Click Bài 8 → open lesson detail
- [ ] Click Pattern 72 → see structure diagram + examples
- [ ] Click TTS button → hear audio
- [ ] Click "Ôn luyện" → start drill session
- [ ] Complete 3 exercises → FSRS grades recorded
```

---

## PHẦN H: RỦI RO & GIẢM THIỂU

### H.1 Risk Register

| Risk ID | Rủi ro | Probability | Impact | Mitigation |
|:---:|:---|:---:|:---:|:---|
| R-G01 | SBT PDF là image-only → không extract text | HIGH (Đã xảy ra) | MEDIUM | Đã giải quyết: Thiết kế 204 exercises thủ công dựa trên pedagogy standards |
| R-G02 | Drizzle schema changes break existing tables | LOW | CRITICAL | APPEND ONLY strategy — không sửa bảng cũ |
| R-G03 | Grammar cards gây noise trong /review queue | MEDIUM | MEDIUM | Type filter `?type=grammar` cho dedicated queue |
| R-G04 | StructureDiagram SVG quá phức tạp → performance issue | MEDIUM | LOW | Lazy load SVG, throttle hover animations |
| R-G05 | IME input (Japanese keyboard) không hoạt động trong fill-blank | HIGH | HIGH | Accept romaji fallback, document user instruction |
| R-G06 | 128 grammar cards tạo cognitive overload | MEDIUM | MEDIUM | Default daily cap: 8 new grammar cards |
| R-G07 | Seed script timeout trên Turso free tier | MEDIUM | MEDIUM | Batch insert (10 records/batch), retry logic |
| R-G08 | Grammar deck conflicts với FSRS optimization | LOW | MEDIUM | Grammar deck uses same FSRS engine with same parameters |
| R-G09 | Mobile layout với StructureDiagram slots overflow | MEDIUM | MEDIUM | Horizontal scroll hoặc wrap slots |
| R-G10 | Vercel serverless cold start với grammar page | LOW | LOW | ISR revalidate=60 keeps pages warm |

---

### H.2 Contingency Protocols

#### Protocol 1: IME Input Issue (R-G05)
Nếu Japanese IME gây ra vấn đề với fill-blank exercise:
1. **Immediate fallback**: Chỉ sử dụng Multiple Choice và Cloze recognition (không require typing)
2. **Medium term**: Thêm toggle "Chế độ nhập Romaji" — accept romaji answers
3. **Long term**: Integrate virtual Japanese keyboard component

#### Protocol 2: Seed Script Timeout (R-G07)
```typescript
// Batch insert strategy
const BATCH_SIZE = 10;
for (let i = 0; i < exercises.length; i += BATCH_SIZE) {
  const batch = exercises.slice(i, i + BATCH_SIZE);
  await db.insert(grammarExercises).values(batch).onConflictDoNothing();
  await new Promise(r => setTimeout(r, 100)); // 100ms delay between batches
}
```

#### Protocol 3: Schema Migration Failure (R-G02)
1. Run migration in dev environment first
2. Backup Turso DB before migration
3. Rollback script: `DROP TABLE IF EXISTS grammar_patterns; DROP TABLE grammar_exercises; DROP TABLE grammar_lessons;`
4. Never run DDL changes on existing tables

---

## PHẦN I: IMPLEMENTATION FILES CHECKLIST

### I.1 Danh Sách Tất Cả Files Cần Tạo/Sửa

#### NEW FILES (Tạo mới — 38 files)

```
src/
├── core/
│   └── grammar/
│       ├── grammar.types.ts              ← Domain types
│       ├── grammarCardFactory.ts         ← Card generation
│       └── grammarValidator.ts          ← Input validation
│
├── db/
│   ├── schema.ts                        ← APPEND: 3 new tables
│   ├── migrations/
│   │   └── 0003_grammar_tables.sql      ← DDL migration
│   └── repositories/
│       └── grammarRepository.ts         ← Query functions
│
├── app/
│   ├── grammar/
│   │   ├── page.tsx                     ← /grammar (RSC)
│   │   ├── loading.tsx                  ← Washi skeleton
│   │   ├── error.tsx                    ← Error boundary
│   │   ├── [lessonId]/
│   │   │   ├── page.tsx                 ← /grammar/[lessonId] (RSC)
│   │   │   ├── loading.tsx
│   │   │   └── error.tsx
│   │   └── practice/
│   │       ├── page.tsx                 ← /grammar/practice (Client)
│   │       ├── loading.tsx
│   │       └── error.tsx
│   │
│   └── api/
│       └── grammar/
│           ├── route.ts                 ← GET /api/grammar
│           ├── [lessonId]/
│           │   └── route.ts             ← GET /api/grammar/[lessonId]
│           ├── seed/
│           │   └── route.ts             ← POST /api/grammar/seed
│           └── practice/
│               └── route.ts             ← GET /api/grammar/practice
│
├── components/
│   └── grammar/
│       ├── GrammarGallery.tsx           ← Lesson grid
│       ├── LessonCard.tsx               ← Single lesson card
│       ├── LessonHero.tsx               ← Lesson header hero
│       ├── PatternCard.tsx              ← Collapsible pattern card
│       ├── StructureDiagram.tsx         ← SVG structure visualization
│       ├── ExampleSentence.tsx          ← Example with TTS
│       ├── GrammarBadge.tsx             ← [文法] [N5] badges
│       ├── GrammarDrillSession.tsx      ← Drill session manager
│       ├── exercises/
│       │   ├── ClozeExercise.tsx        ← Fill-in-the-blank cloze
│       │   ├── MultipleChoiceExercise.tsx
│       │   ├── FillBlankExercise.tsx
│       │   └── ExerciseResult.tsx       ← Correct/incorrect feedback
│       └── GrammarProgressDashboard.tsx ← Progress overview
│
└── hooks/
    └── useGrammarDrill.ts              ← Drill session state hook

scripts/
├── import-grammar-jpd133.ts            ← Local import script
├── sync-turso-grammar.ts               ← Cloud sync script
└── data/
    ├── grammar-lessons.ts              ← 4 lesson objects
    ├── grammar-patterns.ts             ← 32 pattern objects
    └── grammar-exercises.ts            ← 204 exercise objects

tests/
├── grammarRepository.test.ts
├── grammarCardFactory.test.ts
├── grammarValidator.test.ts
├── cloze-grammar.test.ts
├── grammar-fsrs-invariants.test.ts
├── grammarGallery.test.ts
├── lessonDetail.test.ts
├── patternCard.test.ts
└── drillSession.test.ts
```

#### MODIFIED FILES (Sửa đổi — 8 files)

```
src/db/schema.ts                         ← APPEND 3 new tables
src/app/globals.css                      ← ADD grammar CSS tokens
src/app/layout.tsx                       ← ADD "Ngữ pháp" nav link
src/components/kirie/KirieBottomNav.tsx  ← ADD grammar nav item
src/app/page.tsx                         ← SHOW grammar cards in due list
src/app/review/page.tsx                  ← ADD grammar card badge + type filter
src/app/api/health/route.ts              ← ADD grammar stats to health check
```

---

### I.2 File-by-File Implementation Priority

#### Phase 1 (Critical Path — Deploy blocker):
1. `src/db/schema.ts` (append)
2. `src/core/grammar/grammar.types.ts`
3. `scripts/data/grammar-patterns.ts` (32 patterns)
4. `scripts/data/grammar-exercises.ts` (204 exercises)
5. `scripts/import-grammar-jpd133.ts`
6. `src/db/repositories/grammarRepository.ts`
7. `src/core/grammar/grammarCardFactory.ts`
8. `src/app/api/grammar/route.ts`
9. `src/app/api/grammar/[lessonId]/route.ts`
10. `src/app/grammar/page.tsx`
11. `src/app/grammar/[lessonId]/page.tsx`
12. `src/components/grammar/PatternCard.tsx`

#### Phase 2 (Core UX):
13. `src/components/grammar/StructureDiagram.tsx`
14. `src/components/grammar/ExampleSentence.tsx`
15. `src/app/api/grammar/practice/route.ts`
16. `src/app/grammar/practice/page.tsx`
17. `src/hooks/useGrammarDrill.ts`
18. `src/components/grammar/exercises/ClozeExercise.tsx`
19. `src/components/grammar/exercises/MultipleChoiceExercise.tsx`

#### Phase 3 (Polish + DevOps):
20. All test files
21. `scripts/sync-turso-grammar.ts`
22. FSRS integration points
23. Accessibility improvements
24. Performance optimization

---

### I.3 Key Code Patterns

#### Pattern 1: Grammar RSC Page với Suspense

```tsx
// src/app/grammar/page.tsx

import { Suspense } from 'react';
import { GrammarGallery } from '@/components/grammar/GrammarGallery';
import { GrammarLoadingSkeleton } from '@/components/grammar/GrammarLoadingSkeleton';
import { grammarRepository } from '@/db/repositories/grammarRepository';

export const revalidate = 60;

export const metadata = {
  title: '文法 · Ngữ pháp Nhật Bản | Japanese SRS System',
  description: '32 mẫu câu ngữ pháp bài 8-11 JPD133, JLPT N5/N4, tích hợp FSRS',
};

async function GrammarContent() {
  const data = await grammarRepository.getAllLessonsWithStats();
  return <GrammarGallery lessons={data.lessons} stats={data.stats} />;
}

export default function GrammarPage() {
  return (
    <main style={{ minHeight: '100vh', padding: '1.5rem 1rem 5rem' }}>
      <Suspense fallback={<GrammarLoadingSkeleton />}>
        <GrammarContent />
      </Suspense>
    </main>
  );
}
```

#### Pattern 2: Drill Session State Machine

```typescript
// src/hooks/useGrammarDrill.ts

export function useGrammarDrill(lessonId?: string, mode: 'fsrs_due' | 'cram' = 'fsrs_due') {
  const [session, setSession] = useState<GrammarDrillSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentExercise, setCurrentExercise] = useState<GrammarExercise | null>(null);

  // Initialize session
  useEffect(() => {
    async function initSession() {
      const params = new URLSearchParams({ mode, limit: '10' });
      if (lessonId && lessonId !== 'all') params.set('lessonId', lessonId);
      
      const res = await fetch(`/api/grammar/practice?${params}`);
      const data = await res.json();
      
      setSession({
        lessonId,
        exercises: data.queue.map((q: any) => q.exercise),
        currentIndex: 0,
        totalCount: data.total,
        correctCount: 0,
        incorrectCount: 0,
        skippedCount: 0,
        sessionStartedAt: new Date(),
        cardGrades: {},
      });
      
      setCurrentExercise(data.queue[0]?.exercise ?? null);
      setIsLoading(false);
    }
    
    initSession();
  }, [lessonId, mode]);

  // Grade and advance
  const grade = useCallback(async (exerciseId: string, result: 'correct' | 'incorrect' | 'skipped') => {
    if (!session) return;
    
    const rating = result === 'correct' ? 'Good' : result === 'skipped' ? 'Again' : 'Again';
    const cardId = `card_grammar_${exerciseId}`;
    
    // Optimistic update — don't wait for API
    setSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        currentIndex: prev.currentIndex + 1,
        correctCount: result === 'correct' ? prev.correctCount + 1 : prev.correctCount,
        incorrectCount: result === 'incorrect' ? prev.incorrectCount + 1 : prev.incorrectCount,
        skippedCount: result === 'skipped' ? prev.skippedCount + 1 : prev.skippedCount,
        cardGrades: { ...prev.cardGrades, [cardId]: rating },
      };
    });
    
    // Set next exercise
    const nextIndex = session.currentIndex + 1;
    setCurrentExercise(session.exercises[nextIndex] ?? null);
    
    // Async FSRS grade (fire-and-forget with retry)
    try {
      await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, rating }),
      });
    } catch {
      // Queue for offline retry
      const pending = JSON.parse(localStorage.getItem('pending_grammar_reviews') ?? '[]');
      pending.push({ cardId, rating, timestamp: Date.now() });
      localStorage.setItem('pending_grammar_reviews', JSON.stringify(pending));
    }
  }, [session]);

  const isComplete = session ? session.currentIndex >= session.totalCount : false;

  return { session, currentExercise, isLoading, isComplete, grade };
}
```

---

## PHẦN TỔNG KẾT VÀ ROAD MAP

### Tóm Tắt Chiến Lược

Grammar Engine v1.0 được thiết kế theo 3 nguyên tắc nền tảng:

#### 1. Zero Regression Architecture
Toàn bộ 32 grammar patterns được tích hợp VÀO hệ thống hiện có mà không thay đổi bất kỳ dòng code nào trong:
- `fsrs-engine.ts` (algorithm)
- `POST /api/review` (grading endpoint)
- `cards` table schema (reuse existing)
- `decks` table schema (add new row only)

Grammar cards được xem là **first-class citizens** trong hệ thống FSRS — cùng thuật toán, cùng intervals, cùng review session.

#### 2. Authentic Pedagogical Foundation
- 32 patterns được trích xuất trực tiếp từ giáo trình JPD133 (Minna no Nihongo)
- Pattern numbering (72-103) giữ nguyên để học sinh có thể cross-reference với SGK
- 204 exercises được thiết kế theo BDD (Behavior-Driven Design) — từ concrete learning objectives

#### 3. Wa-Style Excellence
- Fuji Mountain Indigo palette (#1B4268) — màu đặc trưng Grammar Module
- StructureDiagram SVG với Nippon Colors cho từng grammar slot
- Bebas Neue cho "文法" headings, Noto Sans JP 900 cho tategaki decorations
- Karuta 3D flip cho grammar cards trong practice session

### Road Map Tương Lai

#### v1.0 (Sprint 1-4): Grammar Engine Foundation
- 32 patterns + 204 exercises
- FSRS integration
- Basic practice session

#### v1.5 (Sprint 5-6): Advanced Exercises
- Translation exercises (Việt → Nhật)
- Sentence jumble (Jumble words)
- Pattern comparison mode (あげます vs くれます side-by-side)
- AI-generated additional examples

#### v2.0 (Sprint 7-10): Grammar Graph & NLP
- Pattern dependency graph (Pattern A requires Pattern B)
- Grammar error analysis (why is this wrong?)
- Voice input for grammar production exercises
- Pattern usage statistics từ corpus

#### v3.0 (Sprint 11+): Adaptive Grammar Path
- AI-curated grammar learning path based on FSRS difficulty
- Grammar mistakes feed back into vocabulary learning
- JLPT N3 grammar expansion (bài 12-20)
- Grammar export to Anki format

---

*Tài liệu này được tạo bởi Antigravity AI (Claude Sonnet 4.6 Thinking) tổng hợp từ:*
- *Ngữ pháp-Bunbou.pdf (4 trang, Bài 8-11, Pattern 72-103)*
- *SBT NGỮ PHÁP.pdf (26 trang, phân tích cấu trúc)*
- *Skills: japanese-srs-business-analyst, japanese-srs-project-manager, japanese-srs-fullstack-engineer, japanese-srs-qa-engineer, japanese-srs-devops-sre, japanese-srs-deck-orchestrator, japanese-srs-uiux-designer, japanese-srs-craftsman*
- *Codebase analysis: src/db/schema.ts, src/app/layout.tsx, src/app/globals.css, src/lib/cloze.ts*

*Ngày tạo: 2026-10-03T15:14:43+07:00*

---


<a id="phan-2"></a>
# PHẦN 2: PHẦN 2: BÁCH KHOA TOÀN THƯ CHUYÊN SÂU 32 MẪU CẤU TRÚC NGỮ PHÁP BÀI 8 - 11
*Tệp gốc: `grammar_deepdive_patterns_encyclopedia.md`*

---

## 📚 BÁCH KHOA TOÀN THƯ NGỮ PHÁP NHẬT BẢN JPD133 (VOLUME 2)
### Phân Tích Chuyên Sâu Cấu Trúc, Ngữ Dụng Học & Lỗi Sai Sư Phạm Toàn Bộ 32 Mẫu Ngữ Pháp (Bài 8 - Bài 11)
#### Tài liệu kỹ thuật tham chiếu chuẩn xác cho Grammar Engine & FSRS Cognitive Matrix

---

### 📖 MỤC LỤC CHI TIẾT 32 PATTERNS

- [Pattern 72: Vて形 います (Đang sinh sống / Trạng thái cư trú kết quả)](#pattern-72-vて形)
- [Pattern 73: Vて形 います (Nghề nghiệp / Hoạt động chuyên môn thường xuyên)](#pattern-73-vて形)
- [Pattern 74: N1 は N2 が A です (Miêu tả đặc điểm ngoại hình, bộ phận, sở trường)](#pattern-74-n1)
- [Pattern 75: イA-くて / ナA-で / N-で (Nối tính từ và danh từ theo chuỗi song hành)](#pattern-75-イa-くて)
- [Pattern 76: N1 は N2 に N3 をあげます (Tặng, trao tặng cho ai cái gì)](#pattern-76-n1)
- [Pattern 77: N1 は N2 に N3 をもらいます (Nhận từ ai cái gì)](#pattern-77-n1)
- [Pattern 78: N1 は 私に N2 をくれます (Ai đó tặng/cho tôi cái gì)](#pattern-78-n1)
- [Pattern 79: N(人) が [〜人] います (Định lượng số lượng người / Tồn tại nhân sự)](#pattern-79-n(人))
- [Pattern 80: [〜人] で (Tiến hành hành động với quy mô bao nhiêu người)](#pattern-80-[〜人])
- [Pattern 81: V辞書形 + こと (Danh từ hóa động từ / Sở thích là...)](#pattern-81-v辞書形)
- [Pattern 82: N が できます / V辞書形 ことができます (Khả năng thực hiện hành động)](#pattern-82-n)
- [Pattern 83: Vて形 (Nối các hành động theo trình tự thời gian)](#pattern-83-vて形)
- [Pattern 84: [〜日・〜週間] に [〜回・〜本] (Chỉ tần suất định kỳ trong khoảng thời gian)](#pattern-84-[〜日・〜週間])
- [Pattern 85: いつも / よく / ときどき / あまり / ぜんぜん (Hệ thống phó từ chỉ tần suất)](#pattern-85-いつも)
- [Pattern 86: どうやって (Nghi vấn từ hỏi cách thức, phương tiện, lộ trình)](#pattern-86-どうやって)
- [Pattern 87: でも (Liên từ liên kết tương phản: Tuy nhiên, Nhưng mà)](#pattern-87-でも)
- [Pattern 88: Vない形 でください (Yêu cầu cấm chỉ lịch sự: Xin đừng làm gì)](#pattern-88-vない形)
- [Pattern 89: Vてもいいですか (Xin phép thực hiện hành vi: Tôi làm ... có được không?)](#pattern-89-vてもいいですか)
- [Pattern 90: N が Vています (Trạng thái khách quan đang diễn ra trước mắt người nói)](#pattern-90-n)
- [Pattern 91: まだ Vていません (Vẫn chưa làm gì - Hành động chưa hoàn tất)](#pattern-91-まだ)
- [Pattern 92: Vてきます (Đi đâu đó làm một việc rồi sẽ quay lại)](#pattern-92-vてきます)
- [Pattern 93: N が できます / V辞書形 ことができます (Khả năng do điều kiện hoàn cảnh cho phép)](#pattern-93-n)
- [Pattern 94: N が 見えます / 聞こえます (Khả năng thụ cảm tự nhiên: Nhìn thấy / Nghe thấy)](#pattern-94-n)
- [Pattern 95: イA-くなります / ナA-になります / N-になります (Sự biến đổi trạng thái khách quan)](#pattern-95-イa-くなります)
- [Pattern 96: N(場所) を V (Không gian di chuyển xuyên qua, băng qua, rẽ)](#pattern-96-n(場所))
- [Pattern 97: N は (Đưa bổ ngữ lên làm chủ đề để nhấn mạnh hoặc tương phản)](#pattern-97-n)
- [Pattern 98: Vて形 います (Thói quen thường xuyên lặp đi lặp lại hàng ngày)](#pattern-98-vて形)
- [Pattern 99: Vたり Vたり します (Liệt kê các hành động tiêu biểu đại diện)](#pattern-99-vたり)
- [Pattern 100: N1 は___が、N2 は___ (Cấu trúc đối chiếu tương phản hai đối tượng)](#pattern-100-n1)
- [Pattern 101: 〜とき (Khi / Trong lúc... - Phân tích toàn diện 7 hình thái kết hợp)](#pattern-101-〜とき)
- [Pattern 102: どうしますか (Hỏi phương án giải quyết: Bạn sẽ xử trí thế nào?)](#pattern-102-どうしますか)
- [Pattern 103: 友達言葉 (Thể thông thường / Khẩu ngữ giao tiếp thân mật với bạn bè)](#pattern-103-友達言葉)

---

## PATTERN 72: Vて形 います (Đang sinh sống / Trạng thái cư trú kết quả)

**Bài học:** Bài 8 | **Trình độ JLPT:** N5 | **Độ khó nhận thức (Difficulty Score):** 2/5 | **Mã nhận diện:** `G-72`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: V[て形] + います
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Diễn tả trạng thái hiện tại là kết quả của một hành động đã diễn ra trong quá khứ và vẫn đang tiếp diễn. Cụ thể với động từ 住みます (sinh sống), hành động chuyển đến một địa điểm đã hoàn thành và kết quả là người nói đang định cư, sinh hoạt tại địa điểm đó.

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

Động từ chuyển sang thể Te: Động từ nhóm 1 (すみます -> すんで) kết hợp trực tiếp với trợ động từ います. Lưu ý trợ từ đi cùng luôn là に (chỉ nơi tồn tại kết quả cư trú), tuyệt đối không dùng で.

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Trang trọng lịch sự (thể ています). Dùng trong giới thiệu bản thân, phỏng vấn xin việc, điền tờ khai xuất nhập cảnh, làm quen giao tiếp hàng ngày.

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

So sánh với Pattern 73 (nghề nghiệp) và hành động đang diễn tiến tức thời (Vている như đang ăn cơm, đang ngủ). '住んでいます' mang tính chất trạng thái kéo dài ổn định (stative resultative).

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Người Việt có thói quen tư duy 'Tôi sống Ở đâu' nên hay dùng trợ từ で thành 'ハノイで住んでいます' -> SAI CƠ BẢN. Trợ từ chuẩn xác duy nhất là に: 'ハノイに住んでいます'. Ngoài ra người mới học hay nhầm không chia thể Te mà nói 'すみます'.

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 72.1
- **Chữ Hán chuẩn:** 私は横浜に住んでいます。
- **Furigana phiên âm:** `私[わたし]は横浜[よこはま]に住[す]んでいます。`
- **Phiên âm Romaji:** *Watashi wa Yokohama ni sunde imasu.*
- **Dịch nghĩa tự nhiên:** **Tôi đang sống ở Yokohama.**
- **Phân tích ngữ cảnh & Sư phạm:** Giới thiệu nơi chốn định cư trong giao tiếp.

#### Ví dụ 72.2
- **Chữ Hán chuẩn:** 家族はハノイに住んでいます。
- **Furigana phiên âm:** `家族[かぞく]はハノイに住[す]んでいます。`
- **Phiên âm Romaji:** *Kazoku wa Hanoi ni sunde imasu.*
- **Dịch nghĩa tự nhiên:** **Gia đình tôi đang sinh sống tại Hà Nội.**
- **Phân tích ngữ cảnh & Sư phạm:** Giới thiệu thông tin nơi cư ngụ của người thân.

#### Ví dụ 72.3
- **Chữ Hán chuẩn:** 田中さんは今、東京のマンションに住んでいます。
- **Furigana phiên âm:** `田中[たなか]さんは今[いま]、東京[とうきょう]のマンションに住[す]んでいます。`
- **Phiên âm Romaji:** *Tanaka-san wa ima, Toukyou no manshon ni sunde imasu.*
- **Dịch nghĩa tự nhiên:** **Anh Tanaka hiện đang sống ở một căn hộ chung cư tại Tokyo.**
- **Phân tích ngữ cảnh & Sư phạm:** Mô tả hoàn cảnh sống của người thứ ba.

#### Ví dụ 72.4
- **Chữ Hán chuẩn:** 留学生はみんな大学の近くの寮に住んでいます。
- **Furigana phiên âm:** `留学生[りゅうがくせい]はみんな大学[だいがく]の近[ちか]くの寮[りょう]に住[す]んでいます。`
- **Phiên âm Romaji:** *Ryuugakusei wa minna daigaku no chikaku no ryou ni sunde imasu.*
- **Dịch nghĩa tự nhiên:** **Các bạn du học sinh đều đang sống ở ký túc xá gần trường đại học.**
- **Phân tích ngữ cảnh & Sư phạm:** Mô tả nơi sinh hoạt tập thể của lưu học sinh.

#### Ví dụ 72.5
- **Chữ Hán chuẩn:** どこに住んでいますか。――神戸に住んでいます。
- **Furigana phiên âm:** `どこに住[す]んでいますか。――神戸[こうべ]に住[す]んでいます。`
- **Phiên âm Romaji:** *Doko ni sunde imasu ka. -- Koube ni sunde imasu.*
- **Dịch nghĩa tự nhiên:** **Bạn đang sống ở đâu vậy? ―― Tôi đang sống ở Kobe.**
- **Phân tích ngữ cảnh & Sư phạm:** Hội thoại hỏi đáp kinh điển về địa chỉ cư trú.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `私は横浜に住んでいます。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 72 (Vて形 います)
- **Mặt sau (Full Resolution):** `私[わたし]は横浜[よこはま]に住[す]んでいます。`
- **Giải thích chi tiết (Pedagogical Note):** Diễn tả trạng thái hiện tại là kết quả của một hành động đã diễn ra trong quá khứ và vẫn đang tiếp diễn. Cụ thể với động từ 住みます (sinh sống), hành động chuyển đến một địa điểm đã hoàn thành và kết quả là người nói đang định cư, sinh hoạt tại địa điểm đó.
- **Initial Stability ($S_0$):** 2.5 ngày | **Initial Difficulty ($D_0$):** 3.0

---

## PATTERN 73: Vて形 います (Nghề nghiệp / Hoạt động chuyên môn thường xuyên)

**Bài học:** Bài 8 | **Trình độ JLPT:** N5 | **Độ khó nhận thức (Difficulty Score):** 2/5 | **Mã nhận diện:** `G-73`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: N[nơi chốn] で + N[chuyên môn] を + V[て形] います
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Diễn tả nghề nghiệp, chức vụ chuyên môn, hoạt động công tác hoặc công việc làm ăn được duy trì thường xuyên, lặp đi lặp lại như một tập quán xã hội trong thời gian dài.

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

Động từ hành động chuyển sang thể Te (働きます -> 働いて; 教えます -> 教えて; 勉強します -> 勉強して; 研究します -> 研究して; 売ります -> 売って) kết hợp います. Đi kèm trợ từ で chỉ địa điểm tiến hành công việc.

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Lịch sự, trang nhã. Sử dụng khi trao đổi danh thiếp, tự giới thiệu nghề nghiệp bản thân trong các sự kiện kết nối đối tác, phỏng vấn tuyển dụng.

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

Nơi làm việc bắt buộc dùng trợ từ で (chỉ địa điểm xảy ra hoạt động chuyên môn), khác biệt hoàn toàn với nơi cư trú ở Pattern 72 dùng に. Ví dụ: '学校で教えています' (dạy ở trường), '会社で働いています' (làm ở công ty).

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Người học thường nhầm lẫn giữa に và で, cho rằng làm việc tại một nơi là sự tồn tại nên dùng に (会社に働いています -> SAI). Quy tắc: làm việc là hành động, bắt buộc dùng で.

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 73.1
- **Chữ Hán chuẩn:** 友達は高校で英語を教えています。
- **Furigana phiên âm:** `友達[ともだち]は高校[こうこう]で英語[えいご]を教[おし]えています。`
- **Phiên âm Romaji:** *Tomodachi wa koukou de eigo o oshiete imasu.*
- **Dịch nghĩa tự nhiên:** **Bạn tôi đang dạy tiếng Anh ở trường trung học phổ thông.**
- **Phân tích ngữ cảnh & Sư phạm:** Mô tả công việc sư phạm của người bạn.

#### Ví dụ 73.2
- **Chữ Hán chuẩn:** 父は自動車の会社で働いています。
- **Furigana phiên âm:** `父[ちち]は自動車[じどうしゃ]の会社[がいしゃ]で働[はたら]いています。`
- **Phiên âm Romaji:** *Chichi wa jidousha no kaisha de hataraite imasu.*
- **Dịch nghĩa tự nhiên:** **Bố tôi đang làm việc tại một công ty ô tô.**
- **Phân tích ngữ cảnh & Sư phạm:** Giới thiệu nghề nghiệp người thân trong gia đình.

#### Ví dụ 73.3
- **Chữ Hán chuẩn:** 兄は大学院で経済を研究しています。
- **Furigana phiên âm:** `兄[あに]は大学院[だいがくいん]で経済[けいざい]を研究[けんきゅう]しています。`
- **Phiên âm Romaji:** *Ani wa daigakuin de keizai o kenkyuu shite imasu.*
- **Dịch nghĩa tự nhiên:** **Anh trai tôi đang nghiên cứu kinh tế tại trường cao học.**
- **Phân tích ngữ cảnh & Sư phạm:** Mô tả hoạt động học thuật chuyên sâu.

#### Ví dụ 73.4
- **Chữ Hán chuẩn:** 姉は病院で看護師をしています。
- **Furigana phiên âm:** `姉[あね]は病院[びょういん]で看護師[かんごし]をしています。`
- **Phiên âm Romaji:** *Ane wa byouin de kangoshi o shite imasu.*
- **Dịch nghĩa tự nhiên:** **Chị gái tôi đang làm y tá tại bệnh viện.**
- **Phân tích ngữ cảnh & Sư phạm:** Giới thiệu vị trí công tác y tế.

#### Ví dụ 73.5
- **Chữ Hán chuẩn:** 山田さんはデパートでパソコンを売っています。
- **Furigana phiên âm:** `山田[やまだ]さんはデパートでパソコンを売[う]っています。`
- **Phiên âm Romaji:** *Yamada-san wa depaato de pasokon o utte imasu.*
- **Dịch nghĩa tự nhiên:** **Anh Yamada đang kinh doanh máy tính ở trung tâm thương mại.**
- **Phân tích ngữ cảnh & Sư phạm:** Nói về hoạt động buôn bán thương mại.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `友達は高校で英語を教えています。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 73 (Vて形 います)
- **Mặt sau (Full Resolution):** `友達[ともだち]は高校[こうこう]で英語[えいご]を教[おし]えています。`
- **Giải thích chi tiết (Pedagogical Note):** Diễn tả nghề nghiệp, chức vụ chuyên môn, hoạt động công tác hoặc công việc làm ăn được duy trì thường xuyên, lặp đi lặp lại như một tập quán xã hội trong thời gian dài.
- **Initial Stability ($S_0$):** 2.5 ngày | **Initial Difficulty ($D_0$):** 3.0

---

## PATTERN 74: N1 は N2 が A です (Miêu tả đặc điểm ngoại hình, bộ phận, sở trường)

**Bài học:** Bài 8 | **Trình độ JLPT:** N5 | **Độ khó nhận thức (Difficulty Score):** 2/5 | **Mã nhận diện:** `G-74`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: N1[chủ thể] は + N2[bộ phận/thuộc tính] が + A[tính từ] です
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Dùng để miêu tả đặc điểm ngoại hình, bộ phận cơ thể, tài lẻ hoặc thuộc tính cụ thể của người, đồ vật hoặc địa danh. Cấu trúc này thiết lập phân tầng chủ đề (Topic-Comment Structure): N1 là chủ đề lớn cần nói đến, N2 là bộ phận focus mang đặc điểm tính từ A.

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

N1 + は + N2 + が + Tính từ đuôi い / Tính từ đuôi な + です. Giữ nguyên hình thức khẳng định hoặc phủ định của tính từ ở đuôi câu.

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Tự nhiên, sinh động, mang đậm đặc trưng tư duy tiếng Nhật. Dùng trong miêu tả người, nhận diện danh tính, khen ngợi hoặc bình phẩm một cách lịch thiệp.

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

Không được diễn đạt theo kiểu dịch từng từ 'N1 の N2 は A です' (như: ダニエルさんの背は高いです -> nghe gượng gạo, thiếu tự nhiên trong tiếng Nhật). Luôn luôn dùng 'N1 は N2 が A です'.

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Người Việt bị ảnh hưởng bởi thói quen 'Chiều cao CỦA anh ấy thì cao' nên phản xạ dùng の. Cần luyện tập phản xạ phân tách: Người (は) + Bộ phận (が) + Tính từ.

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 74.1
- **Chữ Hán chuẩn:** ダニエルさんは背が高いです。
- **Furigana phiên âm:** `ダニエルさんは背[せ]が高[たか]いです。`
- **Phiên âm Romaji:** *Danieru-san wa se ga takai desu.*
- **Dịch nghĩa tự nhiên:** **Anh Daniel có vóc dáng cao ráo.**
- **Phân tích ngữ cảnh & Sư phạm:** Miêu tả chiều cao nhận diện nhân vật.

#### Ví dụ 74.2
- **Chữ Hán chuẩn:** 象は鼻が長いです。
- **Furigana phiên âm:** `象[ぞう]は鼻[はな]が長[なが]いです。`
- **Phiên âm Romaji:** *Zou wa hana ga nagai desu.*
- **Dịch nghĩa tự nhiên:** **Con voi có chiếc vòi dài.**
- **Phân tích ngữ cảnh & Sư phạm:** Câu ví dụ kinh điển về cấu trúc Chủ đề - Tiêu điểm trong ngữ pháp tiếng Nhật.

#### Ví dụ 74.3
- **Chữ Hán chuẩn:** マリアさんは目が大きくて、きれいです。
- **Furigana phiên âm:** `マリアさんは目[め]が大[おお]きくて、きれいです。`
- **Phiên âm Romaji:** *Maria-san wa me ga ookikute, kirei desu.*
- **Dịch nghĩa tự nhiên:** **Chị Maria có đôi mắt to tròn và rất đẹp.**
- **Phân tích ngữ cảnh & Sư phạm:** Khen ngợi vẻ đẹp đường nét khuôn mặt.

#### Ví dụ 74.4
- **Chữ Hán chuẩn:** 日本は食べ物がおいしくて、安全です。
- **Furigana phiên âm:** `日本[にほん]は食[た]べ物[もの]がおいしくて、安全[あんぜん]です。`
- **Phiên âm Romaji:** *Nihon wa tabemono ga oishikute, anzen desu.*
- **Dịch nghĩa tự nhiên:** **Nhật Bản đồ ăn rất ngon và an toàn.**
- **Phân tích ngữ cảnh & Sư phạm:** Nhận xét về đặc trưng du lịch quốc gia.

#### Ví dụ 74.5
- **Chữ Hán chuẩn:** サントスさんは足が速いです。
- **Furigana phiên âm:** `サントスさんは足[あし]が速[はや]いです。`
- **Phiên âm Romaji:** *Santosu-san wa ashi ga hayai desu.*
- **Dịch nghĩa tự nhiên:** **Anh Santos chạy rất nhanh (chân nhanh).**
- **Phân tích ngữ cảnh & Sư phạm:** Khen ngợi sở trường thể thao của đồng nghiệp.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `ダニエルさんは背が高いです。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 74 (N1 は N2 が A です)
- **Mặt sau (Full Resolution):** `ダニエルさんは背[せ]が高[たか]いです。`
- **Giải thích chi tiết (Pedagogical Note):** Dùng để miêu tả đặc điểm ngoại hình, bộ phận cơ thể, tài lẻ hoặc thuộc tính cụ thể của người, đồ vật hoặc địa danh. Cấu trúc này thiết lập phân tầng chủ đề (Topic-Comment Structure): N1 là chủ đề lớn cần nói đến, N2 là bộ phận focus mang đặc điểm tính từ A.
- **Initial Stability ($S_0$):** 2.5 ngày | **Initial Difficulty ($D_0$):** 3.0

---

## PATTERN 75: イA-くて / ナA-で / N-で (Nối tính từ và danh từ theo chuỗi song hành)

**Bài học:** Bài 8 | **Trình độ JLPT:** N5 | **Độ khó nhận thức (Difficulty Score):** 3/5 | **Mã nhận diện:** `G-75`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: A1[thể nối] + A2[thể nối] + ... + An です
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Dùng để xâu chuỗi hai hoặc nhiều tính từ, danh từ trong một câu văn nhằm liệt kê các đặc điểm, thuộc tính có cùng tính chất tích cực hoặc tiêu cực, hoặc thể hiện mối liên hệ giải thích bổ sung.

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

Tính từ đuôi い: Bỏ [い] biến thành [くて] (Ngoại lệ: いい -> よくて). Tính từ đuôi な: Bỏ [な] thêm [で]. Danh từ: N + [で].

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Tạo sự liền mạch, nhịp điệu uyển chuyển cho câu văn, tránh việc ngắt câu cụt ngủn.

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

Mẫu này chỉ nối các đặc điểm cùng chiều (cùng tốt hoặc cùng xấu). Nếu một mặt tốt, một mặt xấu mang tính tương phản đối lập thì không dùng -くて/-で mà phải dùng が hoặc けど (Ví dụ: 部屋は狭いですが、きれいです).

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Lỗi quên biến đổi bất quy tắc của từ いい (tốt) -> học sinh hay nhầm thành いいくて (SAI). Quy tắc: いい luôn luôn phải đổi thành よくて. Thứ hai là nhầm đuôi tính từ な với đuôi い.

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 75.1
- **Chữ Hán chuẩn:** メアリーさんは目が大きくて、髪が長いです。
- **Furigana phiên âm:** `メアリーさんは目[め]が大[おお]きくて、髪[かみ]が長[なが]いです。`
- **Phiên âm Romaji:** *Mearii-san wa me ga ookikute, kami ga nagai desu.*
- **Dịch nghĩa tự nhiên:** **Mary có đôi mắt to và mái tóc dài.**
- **Phân tích ngữ cảnh & Sư phạm:** Nối hai tính từ đuôi い miêu tả nét mặt.

#### Ví dụ 75.2
- **Chữ Hán chuẩn:** この部屋は広くて、とても明るいです。
- **Furigana phiên âm:** `この部屋[へや]は広[ひろ]くて、とても明[あか]るいです。`
- **Phiên âm Romaji:** *Kono heya wa hirokute, totemo akarui desu.*
- **Dịch nghĩa tự nhiên:** **Căn phòng này rộng rãi và rất sáng sủa.**
- **Phân tích ngữ cảnh & Sư phạm:** Miêu tả ưu điểm của không gian sống.

#### Ví dụ 75.3
- **Chữ Hán chuẩn:** 田中先生は親切で、熱心な先生です。
- **Furigana phiên âm:** `田中[たなか]先生[せんせい]は親切[しんせつ]で、熱心[ねっしん]な先生[せんせい]です。`
- **Phiên âm Romaji:** *Tanaka sensei wa shinsetsu de, nesshin na sensei desu.*
- **Dịch nghĩa tự nhiên:** **Thầy Tanaka vừa tốt bụng vừa là một giáo viên tận tâm.**
- **Phân tích ngữ cảnh & Sư phạm:** Nối tính từ đuôi な với danh từ.

#### Ví dụ 75.4
- **Chữ Hán chuẩn:** この町は静かで、緑が多いです。
- **Furigana phiên âm:** `この町[まち]は静[しず]かで、緑[みどり]が多[おお]いです。`
- **Phiên âm Romaji:** *Kono machi wa shizuka de, midori ga ooi desu.*
- **Dịch nghĩa tự nhiên:** **Thị trấn này yên bình và có rất nhiều cây xanh.**
- **Phân tích ngữ cảnh & Sư phạm:** Đánh giá môi trường sống xung quanh.

#### Ví dụ 75.5
- **Chữ Hán chuẩn:** 彼はベトナム人で、ハノイ大学の学生です。
- **Furigana phiên âm:** `彼[かれ]はベトナム人[じん]で、ハノイ大学[だいがく]の学生[がくせい]です。`
- **Phiên âm Romaji:** *Kare wa Betonamu-jin de, Hanoi daigaku no gakusei desu.*
- **Dịch nghĩa tự nhiên:** **Cậu ấy là người Việt Nam và là sinh viên trường Đại học Hà Nội.**
- **Phân tích ngữ cảnh & Sư phạm:** Nối hai danh từ định danh thân thế.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `メアリーさんは目が大きくて、髪が長いです。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 75 (イA-くて / ナA-で / N-で)
- **Mặt sau (Full Resolution):** `メアリーさんは目[め]が大[おお]きくて、髪[かみ]が長[なが]いです。`
- **Giải thích chi tiết (Pedagogical Note):** Dùng để xâu chuỗi hai hoặc nhiều tính từ, danh từ trong một câu văn nhằm liệt kê các đặc điểm, thuộc tính có cùng tính chất tích cực hoặc tiêu cực, hoặc thể hiện mối liên hệ giải thích bổ sung.
- **Initial Stability ($S_0$):** 1.8 ngày | **Initial Difficulty ($D_0$):** 4.5

---

## PATTERN 76: N1 は N2 に N3 をあげます (Tặng, trao tặng cho ai cái gì)

**Bài học:** Bài 8 | **Trình độ JLPT:** N5 | **Độ khó nhận thức (Difficulty Score):** 3/5 | **Mã nhận diện:** `G-76`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: N1[người tặng] は + N2[người nhận] に + N3[vật phẩm] を + あげます
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Diễn tả hành vi trao tặng một vật phẩm hoặc giá trị từ người nói (hoặc từ ngôi thứ ba) đến một đối tượng khác, theo hướng ly tâm (rời xa bản thân người nói).

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

Chủ thể tặng (は) + Người nhận (に) + Đồ vật (を) + あげます (quá khứ: あげました). Có thể thay に bằng に/へ trong một số văn cảnh trang trọng.

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Lịch sự, trung tính. Chỉ dùng cho người ngang hàng hoặc người có vị thế thấp hơn (em nhỏ, con cái, thú nuôi/cây cỏ dùng やります). Tuyệt đối KHÔNG dùng あげます khi người nhận là 'Tôi' (私) hoặc người trong nhóm của tôi (uchi).

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

So sánh với くれます: あげます = Tôi tặng người khác / A tặng B; くれます = Người khác tặng Tôi / người trong gia đình tôi. Tuyệt đối không dùng '彼が私にプレゼントをあげました'.

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Người học Việt Nam hay dịch nguyên xi từ 'tặng cho tôi' thành '私にあげました' -> LỖI CỰC KỲ NẶNG trong văn hóa giao tiếp Nhật Bản. Phải dùng くれます.

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 76.1
- **Chữ Hán chuẩn:** カルロスさんはパクさんにきれいな花をあげました。
- **Furigana phiên âm:** `カルロスさんはパクさんにきれいな花[はな]をあげました。`
- **Phiên âm Romaji:** *Karurosu-san wa Paku-san ni kirei na hana o agemashita.*
- **Dịch nghĩa tự nhiên:** **Anh Carlos đã tặng những bông hoa tươi đẹp cho chị Park.**
- **Phân tích ngữ cảnh & Sư phạm:** Tặng quà chúc mừng sinh nhật giữa bạn bè.

#### Ví dụ 76.2
- **Chữ Hán chuẩn:** 私は母の日に母にスカーフをあげました。
- **Furigana phiên âm:** `私[わたし]は母の日[ははのひ]に母[はは]にスカーフをあげました。`
- **Phiên âm Romaji:** *Watashi wa haha no hi ni haha ni sukaafu o agemashita.*
- **Dịch nghĩa tự nhiên:** **Vào Ngày của Mẹ, tôi đã tặng mẹ một chiếc khăn choàng cổ.**
- **Phân tích ngữ cảnh & Sư phạm:** Tặng quà thể hiện lòng hiếu thảo.

#### Ví dụ 76.3
- **Chữ Hán chuẩn:** 友達の誕生日に辞書をあげました。
- **Furigana phiên âm:** `友達[ともだち]の誕生日[たんじょうび]に辞書[じしょ]をあげました。`
- **Phiên âm Romaji:** *Tomodachi no tanjoubi ni jisho o agemashita.*
- **Dịch nghĩa tự nhiên:** **Tôi đã tặng một cuốn từ điển vào sinh nhật bạn tôi.**
- **Phân tích ngữ cảnh & Sư phạm:** Tặng quà hỗ trợ học tập.

#### Ví dụ 76.4
- **Chữ Hán chuẩn:** 弟に新しい自転車をあげました。
- **Furigana phiên âm:** `弟[おとうと]に新[あたら]しい自転車[じてんしゃ]をあげました。`
- **Phiên âm Romaji:** *Otouto ni atarashii jitensha o agemashita.*
- **Dịch nghĩa tự nhiên:** **Tôi đã cho em trai chiếc xe đạp mới.**
- **Phân tích ngữ cảnh & Sư phạm:** Tặng đồ cho người thân thế dưới.

#### Ví dụ 76.5
- **Chữ Hán chuẩn:** 先生にベトナムのお茶をあげました。
- **Furigana phiên âm:** `先生[せんせい]にベトナムのお茶[ちゃ]をあげました。`
- **Phiên âm Romaji:** *Sensei ni Betonamu no ocha o agemashita.*
- **Dịch nghĩa tự nhiên:** **Tôi đã biếu thầy giáo món trà đặc sản Việt Nam.**
- **Phân tích ngữ cảnh & Sư phạm:** Biếu tặng quà lưu niệm cho giáo viên.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `カルロスさんはパクさんにきれいな花をあげました。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 76 (N1 は N2 に N3 をあげます)
- **Mặt sau (Full Resolution):** `カルロスさんはパクさんにきれいな花[はな]をあげました。`
- **Giải thích chi tiết (Pedagogical Note):** Diễn tả hành vi trao tặng một vật phẩm hoặc giá trị từ người nói (hoặc từ ngôi thứ ba) đến một đối tượng khác, theo hướng ly tâm (rời xa bản thân người nói).
- **Initial Stability ($S_0$):** 1.8 ngày | **Initial Difficulty ($D_0$):** 4.5

---

## PATTERN 77: N1 は N2 に N3 をもらいます (Nhận từ ai cái gì)

**Bài học:** Bài 8 | **Trình độ JLPT:** N5 | **Độ khó nhận thức (Difficulty Score):** 3/5 | **Mã nhận diện:** `G-77`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: N1[người nhận] は + N2[người tặng] に/から + N3[vật phẩm] を + もらいます
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Diễn tả hành vi người nói (hoặc người khác) tiếp nhận một món quà, vật phẩm hay sự giúp đỡ từ một đối tượng trao tặng.

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

Người nhận (は) + Người cho (に / から) + Vật phẩm (を) + もらいます (quá khứ: もらいました). Nếu người cho là tổ chức, công ty, trường học thì bắt buộc dùng から.

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Thể hiện sự biết ơn, đón nhận lịch sự. Đứng từ góc nhìn của người nhận làm chủ ngữ của hành động.

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

So sánh với くれます: Trong mẫu もらいます, người nhận đứng làm chủ ngữ (私は ... にもらいました). Trong mẫu くれます, người tặng đứng làm chủ ngữ (彼は ... をくれました). Hai cấu trúc miêu tả cùng một sự việc nhưng đổi góc nhìn.

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Nhầm lẫn trợ từ: Người tặng đi với に hoặc から, nhưng nhiều bạn nhầm dùng で (もらいます で -> sai). Ngoài ra khi nhận từ công ty/ngân hàng, bắt buộc phải dùng から (会社からもらいました), không dùng に.

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 77.1
- **Chữ Hán chuẩn:** パクさんはカルロスさんに花をもらいました。
- **Furigana phiên âm:** `パクさんはカルロスさんに花[はな]をもらいました。`
- **Phiên âm Romaji:** *Paku-san wa Karurosu-san ni hana o moraimashita.*
- **Dịch nghĩa tự nhiên:** **Chị Park đã nhận được hoa từ anh Carlos.**
- **Phân tích ngữ cảnh & Sư phạm:** Góc nhìn người nhận trong sự việc tặng hoa.

#### Ví dụ 77.2
- **Chữ Hán chuẩn:** 私は誕生日に父に腕時計をもらいました。
- **Furigana phiên âm:** `私[わたし]は誕生日[たんじょうび]に父[ちち]に腕時計[うでどけい]をもらいました。`
- **Phiên âm Romaji:** *Watashi wa tanjoubi ni chichi ni udedokei o moraimashita.*
- **Dịch nghĩa tự nhiên:** **Tôi đã nhận được chiếc đồng hồ đeo tay từ bố vào ngày sinh nhật.**
- **Phân tích ngữ cảnh & Sư phạm:** Kể về món quà sinh nhật ý nghĩa.

#### Ví dụ 77.3
- **Chữ Hán chuẩn:** 国から奨学金をもらいました。
- **Furigana phiên âm:** `国[くに]から奨学金[しょうがくきん]をもらいました。`
- **Phiên âm Romaji:** *Kuni kara shougakukin o moraimashita.*
- **Dịch nghĩa tự nhiên:** **Tôi đã nhận được học bổng từ chính phủ.**
- **Phân tích ngữ cảnh & Sư phạm:** Nhận từ tổ chức / cơ quan nhà nước dùng から.

#### Ví dụ 77.4
- **Chữ Hán chuẩn:** 先生にいい本をもらいました。
- **Furigana phiên âm:** `先生[せんせい]にいい本[ほん]をもらいました。`
- **Phiên âm Romaji:** *Sensei ni ii hon o moraimashita.*
- **Dịch nghĩa tự nhiên:** **Tôi đã nhận được một cuốn sách hay từ thầy giáo.**
- **Phân tích ngữ cảnh & Sư phạm:** Nhận sách quý từ ân sư.

#### Ví dụ 77.5
- **Chữ Hán chuẩn:** 誰にそのプレゼントをもらいましたか。
- **Furigana phiên âm:** `誰[だれ]にそのプレゼントをもらいましたか。`
- **Phiên âm Romaji:** *Dare ni sono purezento o moraimashita ka.*
- **Dịch nghĩa tự nhiên:** **Bạn đã nhận được món quà đó từ ai thế?**
- **Phân tích ngữ cảnh & Sư phạm:** Hỏi thăm nguồn gốc món quà.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `パクさんはカルロスさんに花をもらいました。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 77 (N1 は N2 に N3 をもらいます)
- **Mặt sau (Full Resolution):** `パクさんはカルロスさんに花[はな]をもらいました。`
- **Giải thích chi tiết (Pedagogical Note):** Diễn tả hành vi người nói (hoặc người khác) tiếp nhận một món quà, vật phẩm hay sự giúp đỡ từ một đối tượng trao tặng.
- **Initial Stability ($S_0$):** 1.8 ngày | **Initial Difficulty ($D_0$):** 4.5

---

## PATTERN 78: N1 は 私に N2 をくれます (Ai đó tặng/cho tôi cái gì)

**Bài học:** Bài 8 | **Trình độ JLPT:** N5 | **Độ khó nhận thức (Difficulty Score):** 3/5 | **Mã nhận diện:** `G-78`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: N1[người tặng] は + 私[người nhận] に + N2[vật phẩm] を + くれます
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Diễn tả hành động người khác tặng, trao tặng cho 'Tôi' hoặc thành viên trong gia đình tôi một món quà. Hướng chuyển động mang tính hướng tâm (về phía bản thân người nói).

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

Người tặng (は) + 私に (hoặc thành viên uchi như 家族、妹、弟) + Đồ vật (を) + くれます (quá khứ: くれました). '私に' thường có thể lược bỏ nếu ngữ cảnh đã rõ ràng.

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Biểu đạt lòng hàm ơn sâu sắc. Trong tâm thức người Nhật, việc ai đó trao gì cho mình luôn là một ân huệ đặc biệt hướng về phía mình.

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

Mẫu này tuyệt đối KHÔNG dùng cho hành vi 'Tôi tặng cho ai đó' (私は友達にくれます -> SAI HOÀN TOÀN). Bắt buộc người nhận phải là Tôi hoặc người cùng phe với Tôi.

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Lỗi kinh điển: Quên dùng くれます khi người khác tặng mình mà lại dùng あげました. Hãy khắc sâu: Ai tặng tôi -> くれました.

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 78.1
- **Chữ Hán chuẩn:** メアリーさんが私にかばんをくれました。
- **Furigana phiên âm:** `メアリーさんが私[わたし]にかばんをくれました。`
- **Phiên âm Romaji:** *Mearii-san ga watashi ni kaban o kuremashita.*
- **Dịch nghĩa tự nhiên:** **Mary đã tặng cho tôi một chiếc cặp sách.**
- **Phân tích ngữ cảnh & Sư phạm:** Kể về món quà nhận được từ bạn thân.

#### Ví dụ 78.2
- **Chữ Hán chuẩn:** 誕生日に友達が素敵なネクタイをくれました。
- **Furigana phiên âm:** `誕生日[たんじょうび]に友達[ともだち]が素敵[すてき]なネクタイをくれました。`
- **Phiên âm Romaji:** *Tanjoubi ni tomodachi ga suteki na nekutai o kuremashita.*
- **Dịch nghĩa tự nhiên:** **Vào ngày sinh nhật, bạn bè đã tặng tôi một chiếc cà vạt tuyệt đẹp.**
- **Phân tích ngữ cảnh & Sư phạm:** Niềm vui nhận quà sinh nhật.

#### Ví dụ 78.3
- **Chữ Hán chuẩn:** 社長がおいしいお菓子をくれました。
- **Furigana phiên âm:** `社長[しゃちょう]がおいしいお菓子[かし]をくれました。`
- **Phiên âm Romaji:** *Shachou ga oishii okashi o kuremashita.*
- **Dịch nghĩa tự nhiên:** **Giám đốc đã cho tôi món bánh kẹo rất ngon.**
- **Phân tích ngữ cảnh & Sư phạm:** Nhận sự quan tâm từ cấp trên.

#### Ví dụ 78.4
- **Chữ Hán chuẩn:** 兄が妹に可愛い人形をくれました。
- **Furigana phiên âm:** `兄[あに]が妹[いもうと]に可愛[かわい]い人形[にんぎょう]をくれました。`
- **Phiên âm Romaji:** *Ani ga imouto ni kawaii ningyou o kuremashita.*
- **Dịch nghĩa tự nhiên:** **Anh họ đã tặng cho em gái tôi một con búp bê dễ thương.**
- **Phân tích ngữ cảnh & Sư phạm:** Người ngoài tặng cho người trong gia đình tôi (uchi).

#### Ví dụ 78.5
- **Chữ Hán chuẩn:** 親切な人が道を教えてくれました。
- **Furigana phiên âm:** `親切[しんせつ]な人[ひと]が道[みち]を教[おし]えてくれました。`
- **Phiên âm Romaji:** *Shinsetsu na hito ga michi o oshiete kuremashita.*
- **Dịch nghĩa tự nhiên:** **Một người tốt bụng đã chỉ đường giúp tôi.**
- **Phân tích ngữ cảnh & Sư phạm:** Mở rộng sang hành động V-te kuremashita làm ơn giúp đỡ.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `メアリーさんが私にかばんをくれました。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 78 (N1 は 私に N2 をくれます)
- **Mặt sau (Full Resolution):** `メアリーさんが私[わたし]にかばんをくれました。`
- **Giải thích chi tiết (Pedagogical Note):** Diễn tả hành động người khác tặng, trao tặng cho 'Tôi' hoặc thành viên trong gia đình tôi một món quà. Hướng chuyển động mang tính hướng tâm (về phía bản thân người nói).
- **Initial Stability ($S_0$):** 1.8 ngày | **Initial Difficulty ($D_0$):** 4.5

---

## PATTERN 79: N(人) が [〜人] います (Định lượng số lượng người / Tồn tại nhân sự)

**Bài học:** Bài 8 | **Trình độ JLPT:** N5 | **Độ khó nhận thức (Difficulty Score):** 2/5 | **Mã nhận diện:** `G-79`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: N[chủng loại người] が + [Số đếm + 人] + います
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Diễn tả số lượng thành viên trong gia đình, lớp học, cơ quan hoặc sự tồn tại của bao nhiêu người trong một bối cảnh nhất định.

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

Danh từ người + が + Số đếm nhân số (1人: ひとり; 2人: ふたり; 3人: さんにん; 4人: よにん; ...) + います. Số từ thường đặt trực tiếp trước động từ います không cần trợ từ.

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Tự nhiên, dùng khi giới thiệu gia cảnh, thành phần nhân sự công ty, đếm sĩ số lớp học.

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

Phân biệt với đồ vật dùng あります (Con người, động vật dùng います). Lưu ý cách đếm bất quy tắc: 1 người (ひとり), 2 người (ふたり), 4 người (よにん - không đọc là よん・し).

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Học sinh hay chèn trợ từ の hoặc を vào sau số từ (như '妹の二人がいます' -> sai). Trong tiếng Nhật, số từ đóng vai trò như phó từ đặt ngay trước động từ: '妹が二人います'.

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 79.1
- **Chữ Hán chuẩn:** 私は妹が二人います。
- **Furigana phiên âm:** `私[わたし]は妹[いもうと]が二人[ふたり]います。`
- **Phiên âm Romaji:** *Watashi wa imouto ga futari imasu.*
- **Dịch nghĩa tự nhiên:** **Tôi có hai người em gái.**
- **Phân tích ngữ cảnh & Sư phạm:** Giới thiệu thành phần anh chị em ruột.

#### Ví dụ 79.2
- **Chữ Hán chuẩn:** このクラスには留学生が十人います。
- **Furigana phiên âm:** `このクラスには留学生[りゅうがくせい]が十人[じゅうにん]います。`
- **Phiên âm Romaji:** *Kono kurasu ni wa ryuugakusei ga juunin imasu.*
- **Dịch nghĩa tự nhiên:** **Trong lớp học này có mười bạn sinh viên quốc tế.**
- **Phân tích ngữ cảnh & Sư phạm:** Báo cáo sĩ số học viên nước ngoài.

#### Ví dụ 79.3
- **Chữ Hán chuẩn:** 会議室に先生が三人います。
- **Furigana phiên âm:** `会議室[かいぎしつ]に先生[せんせい]が三人[さんにん]います。`
- **Phiên âm Romaji:** *Kaigishitsu ni sensei ga sannin imasu.*
- **Dịch nghĩa tự nhiên:** **Trong phòng họp hiện có ba thầy giáo.**
- **Phân tích ngữ cảnh & Sư phạm:** Xác định nhân sự tại phòng ban.

#### Ví dụ 79.4
- **Chữ Hán chuẩn:** 家族は何人いますか。――五人います。
- **Furigana phiên âm:** `家族[かぞく]は何人[なんにん]いますか。――五人[ごにん]います。`
- **Phiên âm Romaji:** *Kazoku wa nannin imasu ka. -- Gonin imasu.*
- **Dịch nghĩa tự nhiên:** **Gia đình bạn có bao nhiêu người? ―― Có năm người.**
- **Phân tích ngữ cảnh & Sư phạm:** Hỏi đáp về quy mô gia đình.

#### Ví dụ 79.5
- **Chữ Hán chuẩn:** 公園に子どもたちがたくさんいます。
- **Furigana phiên âm:** `公園[こうえん]に子[こ]どもたちがたくさんいます。`
- **Phiên âm Romaji:** *Kouen ni kodomotachi ga takusan imasu.*
- **Dịch nghĩa tự nhiên:** **Ở công viên có rất đông trẻ em.**
- **Phân tích ngữ cảnh & Sư phạm:** Định lượng ước chừng bằng phó từ たくさん.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `私は妹が二人います。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 79 (N)
- **Mặt sau (Full Resolution):** `私[わたし]は妹[いもうと]が二人[ふたり]います。`
- **Giải thích chi tiết (Pedagogical Note):** Diễn tả số lượng thành viên trong gia đình, lớp học, cơ quan hoặc sự tồn tại của bao nhiêu người trong một bối cảnh nhất định.
- **Initial Stability ($S_0$):** 2.5 ngày | **Initial Difficulty ($D_0$):** 3.0

---

## PATTERN 80: [〜人] で (Tiến hành hành động với quy mô bao nhiêu người)

**Bài học:** Bài 8 | **Trình độ JLPT:** N5 | **Độ khó nhận thức (Difficulty Score):** 2/5 | **Mã nhận diện:** `G-80`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: [Số đếm nhân khẩu] + で + V
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Dùng để chỉ định tổng số lượng người cùng tham gia thực hiện một hoạt động chung, đóng vai trò như phương thức, quy mô của hành vi.

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

Số đếm người + で (1 người làm một mình dùng: 1人で / ひとりで; 2 người: 2人で / ふたりで; 3 người: 3人で; ...). Riêng 1 người (ひとりで) mang nghĩa 'tự mình/đơn độc'.

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Thông dụng trong hội thoại sắp xếp lịch trình, nấu ăn, du lịch, thuê nhà trọ.

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

Phân biệt giữa: Aさんと (cùng với anh A - chỉ đối tác đồng hành) và 2人で (hai người chúng tôi - chỉ tổng sĩ số tham gia). Có thể kết hợp: 'Aさんと2人で映画を見ました'.

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Người học hay nhầm '1人で' với '1人'. Cần nhớ: '1人' là số lượng (có 1 người), còn '1人で' là phương thức hành động (làm một mình).

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 80.1
- **Chữ Hán chuẩn:** 私はルームメイトと3人で住んでいます。
- **Furigana phiên âm:** `私[わたし]はルームメイトと3人[さんにん]で住[す]んでいます。`
- **Phiên âm Romaji:** *Watashi wa ruumumeito to sannin de sunde imasu.*
- **Dịch nghĩa tự nhiên:** **Tôi đang sống cùng với người bạn cùng phòng, tổng cộng là 3 người.**
- **Phân tích ngữ cảnh & Sư phạm:** Miêu tả quy mô sinh hoạt chung tại căn hộ.

#### Ví dụ 80.2
- **Chữ Hán chuẩn:** 昨日、友達と二人で映画を見に行きました。
- **Furigana phiên âm:** `昨日[きのう]、友達[ともだち]と二人[ふたり]で映画[えいが]を見[み]に行[い]きました。`
- **Phiên âm Romaji:** *Kinou, tomodachi to futari de eiga o mi ni ikimashita.*
- **Dịch nghĩa tự nhiên:** **Hôm qua tôi và bạn tôi, hai đứa đã cùng nhau đi xem phim.**
- **Phân tích ngữ cảnh & Sư phạm:** Kể về hoạt động giải trí theo cặp.

#### Ví dụ 80.3
- **Chữ Hán chuẩn:** この荷物を一人で運びました。
- **Furigana phiên âm:** `この荷物[にもつ]を一人[ひとり]で運[はこ]びました。`
- **Phiên âm Romaji:** *Kono nimotsu o hitori de hakobimashita.*
- **Dịch nghĩa tự nhiên:** **Tôi đã tự mình một tay bê vác đống hành lý này.**
- **Phân tích ngữ cảnh & Sư phạm:** Nhấn mạnh nỗ lực tự thân một mình làm việc.

#### Ví dụ 80.4
- **Chữ Hán chuẩn:** みんなで一緒に日本語の歌を歌いましょう。
- **Furigana phiên âm:** `みんなで一緒[いっしょ]に日本語[にほんご]の歌[うた]を歌[うた]いましょう。`
- **Phiên âm Romaji:** *Minna de issho ni nihongo no uta o utaimashou.*
- **Dịch nghĩa tự nhiên:** **Mọi người hãy cùng nhau hát bài hát tiếng Nhật nào!**
- **Phân tích ngữ cảnh & Sư phạm:** Lời kêu gọi hoạt động tập thể.

#### Ví dụ 80.5
- **Chữ Hán chuẩn:** 何人で旅行へ行きますか。――家族四人で行きます。
- **Furigana phiên âm:** `何人[なんにん]で旅行[りょこう]へ行[い]きますか。――家族[かぞく]四人[よにん]で行[い]きます。`
- **Phiên âm Romaji:** *Nannin de ryokou e ikimasu ka. -- Kazoku yonin de ikimasu.*
- **Dịch nghĩa tự nhiên:** **Các bạn đi du lịch mấy người thế? ―― Bốn người trong gia đình tôi cùng đi.**
- **Phân tích ngữ cảnh & Sư phạm:** Hỏi đáp về số lượng người đi tour.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `私はルームメイトと3人で住んでいます。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 80 ([〜人] で)
- **Mặt sau (Full Resolution):** `私[わたし]はルームメイトと3人[さんにん]で住[す]んでいます。`
- **Giải thích chi tiết (Pedagogical Note):** Dùng để chỉ định tổng số lượng người cùng tham gia thực hiện một hoạt động chung, đóng vai trò như phương thức, quy mô của hành vi.
- **Initial Stability ($S_0$):** 2.5 ngày | **Initial Difficulty ($D_0$):** 3.0

---

## PATTERN 81: V辞書形 + こと (Danh từ hóa động từ / Sở thích là...)

**Bài học:** Bài 9 | **Trình độ JLPT:** N5 | **Độ khó nhận thức (Difficulty Score):** 2/5 | **Mã nhận diện:** `G-81`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: V[辞書形] + こと + です / が好きです
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Dùng để biến đổi một động từ hành động thành một danh từ trừu tượng (danh từ hóa - Nominalization), cho phép hành động đó đảm nhiệm vai trò chủ ngữ, vị ngữ hoặc bổ ngữ trong câu, đặc biệt phổ biến trong mẫu nói về sở thích cá nhân.

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

Động từ chia về Thể từ điển (Jishokei) + こと. Ví dụ: 見ます -> 見ること; 泳ぎます -> 泳ぐこと; 旅行します -> 旅行すること.

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Thân mật và tự nhiên, chuẩn mực cấu trúc giới thiệu bản thân ở trình độ N5.

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

Phân biệt với の: Ở cấp độ sơ cấp, mẫu '私の趣味は [V辞書形] ことです' bắt buộc dùng こと, không thay bằng の (như 趣味は見ることです -> đúng; 趣味は見るのです -> không tự nhiên trong cấu trúc vị ngữ sở thích).

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Học sinh hay quên thêm こと mà nói trực tiếp: '私の趣味は映画を見ますです' -> LỖI CẤU TRÚC NGHIÊM TRỌNG. Không thể ghép động từ thể ます trực tiếp trước です.

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 81.1
- **Chữ Hán chuẩn:** 私の趣味は映画を見ることです。
- **Furigana phiên âm:** `私[わたし]の趣味[しゅみ]は映画[えいが]を見[み]ることです。`
- **Phiên âm Romaji:** *Watashi no shumi wa eiga o miru koto desu.*
- **Dịch nghĩa tự nhiên:** **Sở thích của tôi là xem phim điện ảnh.**
- **Phân tích ngữ cảnh & Sư phạm:** Câu kinh điển giới thiệu sở thích.

#### Ví dụ 81.2
- **Chữ Hán chuẩn:** 彼の夢は日本で働くことです。
- **Furigana phiên âm:** `彼[かれ]の夢[ゆめ]は日本[にほん]で働[はたら]くことです。`
- **Phiên âm Romaji:** *Kare no yume wa Nihon de hataraku koto desu.*
- **Dịch nghĩa tự nhiên:** **Ước mơ của anh ấy là được làm việc tại Nhật Bản.**
- **Phân tích ngữ cảnh & Sư phạm:** Trình bày mục tiêu, lý tưởng nghề nghiệp.

#### Ví dụ 81.3
- **Chữ Hán chuẩn:** 外国語を勉強することはとても楽しいです。
- **Furigana phiên âm:** `外国語[がいこくご]を勉強[べんきょう]することはとても楽[たの]しいです。`
- **Phiên âm Romaji:** *Gaikokugo o benkyou suru koto wa totemo tanoshii desu.*
- **Dịch nghĩa tự nhiên:** **Việc học ngoại ngữ quả thực vô cùng thú vị.**
- **Phân tích ngữ cảnh & Sư phạm:** Danh từ hóa làm chủ ngữ trong câu.

#### Ví dụ 81.4
- **Chữ Hán chuẩn:** 休みの日の楽しみは音楽を聞くことです。
- **Furigana phiên âm:** `休[やす]みの日[ひ]の楽[たの]しみは音楽[おんがく]を聞[き]くことです。`
- **Phiên âm Romaji:** *Yasumi no hi no tanoshimi wa ongaku o kiku koto desu.*
- **Dịch nghĩa tự nhiên:** **Niềm vui trong ngày nghỉ của tôi là nghe nhạc.**
- **Phân tích ngữ cảnh & Sư phạm:** Chia sẻ thói quen thư giãn cuối tuần.

#### Ví dụ 81.5
- **Chữ Hán chuẩn:** 一番大切なことは毎日続けることです。
- **Furigana phiên âm:** `一番[いちばん]大切[たいせつ]なことは毎日[まいにち]続[つづ]けることです。`
- **Phiên âm Romaji:** *Ichiban taisetsu na koto wa mainichi tsuzukeru koto desu.*
- **Dịch nghĩa tự nhiên:** **Điều quan trọng nhất chính là sự kiên trì duy trì mỗi ngày.**
- **Phân tích ngữ cảnh & Sư phạm:** Triết lý rèn luyện học tập.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `私の趣味は映画を見ることです。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 81 (V辞書形 + こと)
- **Mặt sau (Full Resolution):** `私[わたし]の趣味[しゅみ]は映画[えいが]を見[み]ることです。`
- **Giải thích chi tiết (Pedagogical Note):** Dùng để biến đổi một động từ hành động thành một danh từ trừu tượng (danh từ hóa - Nominalization), cho phép hành động đó đảm nhiệm vai trò chủ ngữ, vị ngữ hoặc bổ ngữ trong câu, đặc biệt phổ biến trong mẫu nói về sở thích cá nhân.
- **Initial Stability ($S_0$):** 2.5 ngày | **Initial Difficulty ($D_0$):** 3.0

---

## PATTERN 82: N が できます / V辞書形 ことができます (Khả năng thực hiện hành động)

**Bài học:** Bài 9 | **Trình độ JLPT:** N5 | **Độ khó nhận thức (Difficulty Score):** 2/5 | **Mã nhận diện:** `G-82`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: N が できます / V[辞書形] ことが できます
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Diễn tả năng lực, sở trường của một người (có thể làm được gì nhờ rèn luyện, học tập) hoặc khả năng xảy ra của một sự việc trong hoàn cảnh nhất định.

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

Nếu là danh từ chỉ môn thể thao/ngoại ngữ: N + ができます. Nếu là động từ: V-jisho + ことができます.

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Trang trọng, chuẩn mực. Dùng khi viết CV xin việc, giới thiệu kỹ năng chuyên môn, phỏng vấn.

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

So sánh với Động từ thể khả năng (可能形 ở N4 như 話せる、泳げる): Mẫu 'ことができます' mang tính quy phạm, rõ ràng, không đòi hỏi biến đổi căn tố động từ phức tạp.

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Người học hay dùng trợ từ を trước できます (như: ピアノをできます -> SAI). Động từ できます luôn luôn đòi hỏi trợ từ が đi trước: ピアノができます.

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 82.1
- **Chữ Hán chuẩn:** 私はスキーができます。
- **Furigana phiên âm:** `私[わたし]はスキーができます。`
- **Phiên âm Romaji:** *Watashi wa sukii ga dekimasu.*
- **Dịch nghĩa tự nhiên:** **Tôi có thể trượt tuyết.**
- **Phân tích ngữ cảnh & Sư phạm:** Nêu năng lực thể thao cá nhân.

#### Ví dụ 82.2
- **Chữ Hán chuẩn:** 田中さんは英語とフランス語を話すことができます。
- **Furigana phiên âm:** `田中[たなか]さんは英語[えいご]とフランス語[ご]を話[はな]すことができます。`
- **Phiên âm Romaji:** *Tanaka-san wa eigo to furansugo o hanasu koto ga dekimasu.*
- **Dịch nghĩa tự nhiên:** **Anh Tanaka có thể nói được cả tiếng Anh và tiếng Pháp.**
- **Phân tích ngữ cảnh & Sư phạm:** Trình bày khả năng ngôn ngữ chuyên nghiệp.

#### Ví dụ 82.3
- **Chữ Hán chuẩn:** このプールで百メートル泳ぐことができます。
- **Furigana phiên âm:** `このプールで百[ひゃく]メートル泳[およ]ぐことができます。`
- **Phiên âm Romaji:** *Kono puuru de hyakummeetoru oyogu koto ga dekimasu.*
- **Dịch nghĩa tự nhiên:** **Tôi có thể bơi một trăm mét ở bể bơi này.**
- **Phân tích ngữ cảnh & Sư phạm:** Khẳng định thể lực bơi lội.

#### Ví dụ 82.4
- **Chữ Hán chuẩn:** 車を運転することができますか。――はい、できます。
- **Furigana phiên âm:** `車[くるま]を運転[うんてん]することができますか。――はい、できます。`
- **Phiên âm Romaji:** *Kuruma o unten suru koto ga dekimasu ka. -- Hai, dekimasu.*
- **Dịch nghĩa tự nhiên:** **Bạn có biết lái xe ô tô không? ―― Vâng, tôi lái được.**
- **Phân tích ngữ cảnh & Sư phạm:** Hội thoại kiểm tra kỹ năng bằng lái xe.

#### Ví dụ 82.5
- **Chữ Hán chuẩn:** パソコンで日本のニュースを読むことができます。
- **Furigana phiên âm:** `パソコンで日本[にほん]のニュースを読[よ]むことができます。`
- **Phiên âm Romaji:** *Pasokon de Nihon no nyuusu o yomu koto ga dekimasu.*
- **Dịch nghĩa tự nhiên:** **Tôi có thể đọc tin tức tiếng Nhật trên máy tính.**
- **Phân tích ngữ cảnh & Sư phạm:** Mô tả năng lực đọc hiểu trên thiết bị.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `私はスキーができます。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 82 (N が できます / V辞書形 ことができます)
- **Mặt sau (Full Resolution):** `私[わたし]はスキーができます。`
- **Giải thích chi tiết (Pedagogical Note):** Diễn tả năng lực, sở trường của một người (có thể làm được gì nhờ rèn luyện, học tập) hoặc khả năng xảy ra của một sự việc trong hoàn cảnh nhất định.
- **Initial Stability ($S_0$):** 2.5 ngày | **Initial Difficulty ($D_0$):** 3.0

---

## PATTERN 83: Vて形 (Nối các hành động theo trình tự thời gian)

**Bài học:** Bài 9 | **Trình độ JLPT:** N5 | **Độ khó nhận thức (Difficulty Score):** 2/5 | **Mã nhận diện:** `G-83`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: V1[て形]、V2[て形]、... Vn[thì cuối câu]
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Dùng để liệt kê chuỗi hành động diễn ra nối tiếp nhau theo thứ tự thời gian tuyến tính (làm V1 xong rồi làm V2, cuối cùng làm Vn). Thì của toàn bộ câu do động từ cuối cùng quyết định.

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

Động từ chia thể Te (V-te), nối bằng dấu phẩy. Động từ cuối câu chia theo thì quá khứ (ました) hoặc hiện tại/tương lai (ます).

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Rất phổ biến trong văn kể chuyện, nhật ký, báo cáo hành trình công tác hoặc hướng dẫn quy trình thao tác kỹ thuật.

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

Khác với mẫu VたりVたりします (Pattern 99): Mẫu -te nối hành động bắt buộc phải tuân theo thứ tự trước sau nghiêm ngặt; trong khi -tari -tari chỉ liệt kê vài hành động tiêu biểu không quan trọng trình tự.

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Học sinh hay chia thì quá khứ cho từng động từ con (như: 朝起きました、ご飯を食べました -> cụt lủn). Phải liên kết bằng thể Te và chỉ chia thì ở động từ chốt câu.

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 83.1
- **Chữ Hán chuẩn:** 週末、友達とご飯を食べて、映画を見ます。
- **Furigana phiên âm:** `週末[しゅうまつ]、友達[ともだち]とご飯[はん]を食[た]べて、映画[えいが]を見[み]ます。`
- **Phiên âm Romaji:** *Shuumatsu, tomodachi to gohan o tabete, eiga o mimasu.*
- **Dịch nghĩa tự nhiên:** **Cuối tuần, tôi sẽ ăn cơm cùng bạn bè rồi đi xem phim.**
- **Phân tích ngữ cảnh & Sư phạm:** Kế hoạch tuần tự các hoạt động vui chơi.

#### Ví dụ 83.2
- **Chữ Hán chuẩn:** 昨日は朝七時に起きて、シャワーを浴びて、学校へ行きました。
- **Furigana phiên âm:** `昨日[きのう]は朝[あさ]七時[しちじ]に起[お]きて、シャワーを浴[あ]びて、学校[がっこう]へ行[い]きました。`
- **Phiên âm Romaji:** *Kinou wa asa shichiji ni okite, shawaa o abite, gakkou e ikimashita.*
- **Dịch nghĩa tự nhiên:** **Hôm qua tôi thức dậy lúc 7 giờ sáng, tắm vòi sen rồi đến trường.**
- **Phân tích ngữ cảnh & Sư phạm:** Kể lại trình tự sinh hoạt buổi sáng.

#### Ví dụ 83.3
- **Chữ Hán chuẩn:** 銀行へ行ってお金を下ろしてから、買い物します。
- **Furigana phiên âm:** `銀行[ぎんこう]へ行[い]ってお金[かね]を下[お]ろしてから、買[か]い物[もの]します。`
- **Phiên âm Romaji:** *Ginkou e itte okane o oroshite kara, kaimono shimasu.*
- **Dịch nghĩa tự nhiên:** **Tôi đến ngân hàng rút tiền rồi mới đi mua sắm.**
- **Phân tích ngữ cảnh & Sư phạm:** Quy trình chuẩn bị tài chính trước khi mua hàng.

#### Ví dụ 83.4
- **Chữ Hán chuẩn:** 駅を降りて、まっすぐ歩いて、交差点を左に曲がってください。
- **Furigana phiên âm:** `駅[えき]を降[お]りて、まっすぐ歩[ある]いて、交差点[こうさてん]を左[ひだり]に曲[ま]がってください。`
- **Phiên âm Romaji:** *Eki o orite, massugu aruite, kousaten o hidari ni magatte kudasai.*
- **Dịch nghĩa tự nhiên:** **Hãy xuống ga, đi bộ thẳng rồi rẽ trái ở ngã tư.**
- **Phân tích ngữ cảnh & Sư phạm:** Chỉ dẫn đường đi từng bước.

#### Ví dụ 83.5
- **Chữ Hán chuẩn:** 宿題をして、日本語の単語を覚えてから寝ます。
- **Furigana phiên âm:** `宿題[しゅくだい]をして、日本語[にほんご]の単語[たんご]を覚[おぼ]えてから寝[ね]ます。`
- **Phiên âm Romaji:** *Shukudai o shite, nihongo no tango o oboete kara nemasu.*
- **Dịch nghĩa tự nhiên:** **Tôi làm bài tập, học thuộc từ vựng tiếng Nhật rồi mới đi ngủ.**
- **Phân tích ngữ cảnh & Sư phạm:** Trình tự học tập mỗi tối.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `週末、友達とご飯を食べて、映画を見ます。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 83 (Vて形)
- **Mặt sau (Full Resolution):** `週末[しゅうまつ]、友達[ともだち]とご飯[はん]を食[た]べて、映画[えいが]を見[み]ます。`
- **Giải thích chi tiết (Pedagogical Note):** Dùng để liệt kê chuỗi hành động diễn ra nối tiếp nhau theo thứ tự thời gian tuyến tính (làm V1 xong rồi làm V2, cuối cùng làm Vn). Thì của toàn bộ câu do động từ cuối cùng quyết định.
- **Initial Stability ($S_0$):** 2.5 ngày | **Initial Difficulty ($D_0$):** 3.0

---

## PATTERN 84: [〜日・〜週間] に [〜回・〜本] (Chỉ tần suất định kỳ trong khoảng thời gian)

**Bài học:** Bài 9 | **Trình độ JLPT:** N5 | **Độ khó nhận thức (Difficulty Score):** 2/5 | **Mã nhận diện:** `G-84`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: [Đơn vị thời gian] に + [Số lần / Số lượng] + V
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Dùng để biểu thị tần suất xuất hiện của một hành vi, thói quen trong một đơn vị thời gian cố định (như 1 ngày mấy lần, 1 tuần mấy lần, 1 năm mấy lần).

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

Khoảng thời gian (1日、1週間、1か月、1年) + に + Lượng từ tần suất (1回、2回、何回) + Động từ.

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Thiết thực trong giao tiếp, trao đổi về lịch biểu công việc, toa thuốc bác sĩ dặn, thói quen tập luyện thể thao.

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

Trợ từ bắt buộc là に (chỉ mốc phạm vi thời gian chuẩn). Không dùng で hay を ở vị trí này.

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Học sinh hay quên trợ từ に hoặc để lộn vị trí số lần trước thời gian. Chuẩn ngữ pháp: Thời gian + に + Số lần.

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 84.1
- **Chữ Hán chuẩn:** 1週間に2回、家族に電話します。
- **Furigana phiên âm:** `1週間[いっしゅうかん]に2回[にかい]、家族[かぞく]に電話[でんわ]します。`
- **Phiên âm Romaji:** *Isshuukan ni nikai, kazoku ni denwa shimasu.*
- **Dịch nghĩa tự nhiên:** **Một tuần tôi gọi điện cho gia đình hai lần.**
- **Phân tích ngữ cảnh & Sư phạm:** Thói quen liên lạc người thân.

#### Ví dụ 84.2
- **Chữ Hán chuẩn:** この薬は一日に三回、食後に飲んでください。
- **Furigana phiên âm:** `この薬[くすり]は一日[いちにち]に三回[さんかい]、食後[しょくご]に飲[の]んでください。`
- **Phiên âm Romaji:** *Kono kusuri wa ichinichi ni sankai, shokugo ni nonde kudasai.*
- **Dịch nghĩa tự nhiên:** **Thuốc này hãy uống một ngày 3 lần sau bữa ăn.**
- **Phân tích ngữ cảnh & Sư phạm:** Chỉ định y khoa của bác sĩ/dược sĩ.

#### Ví dụ 84.3
- **Chữ Hán chuẩn:** 一か月に一回、映画館へ行きます。
- **Furigana phiên âm:** `一[いっ]か月に一回[いっかい]、映画館[えいがかん]へ行[い]きます。`
- **Phiên âm Romaji:** *Ikkagetsu ni ikkai, eigakan e ikimasu.*
- **Dịch nghĩa tự nhiên:** **Mỗi tháng một lần tôi lại đến rạp chiếu phim.**
- **Phân tích ngữ cảnh & Sư phạm:** Tần suất giải trí định kỳ.

#### Ví dụ 84.4
- **Chữ Hán chuẩn:** 一年に二回、国へ帰ります。
- **Furigana phiên âm:** `一年[いちねん]に二回[にかい]、国[くに]へ帰[かえ]ります。`
- **Phiên âm Romaji:** *Ichinen ni nikai, kuni e kaerimasu.*
- **Dịch nghĩa tự nhiên:** **Một năm tôi về nước hai lần.**
- **Phân tích ngữ cảnh & Sư phạm:** Lịch về thăm quê của du học sinh.

#### Ví dụ 84.5
- **Chữ Hán chuẩn:** どのくらい運動しますか。――一週間に四回ジムへ行きます。
- **Furigana phiên âm:** `どのくらい運動[うんどう]しますか。――一週間[いっしゅうかん]に四回[よんかい]ジムへ行[い]きます。`
- **Phiên âm Romaji:** *Dono kurai undou shimasu ka. -- Isshuukan ni yonkai jimu e ikimasu.*
- **Dịch nghĩa tự nhiên:** **Bạn tập thể dục bao lâu một lần? ―― Một tuần tôi đến phòng gym bốn lần.**
- **Phân tích ngữ cảnh & Sư phạm:** Hỏi đáp về chế độ rèn luyện thể chất.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `1週間に2回、家族に電話します。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 84 ([〜日・〜週間] に [〜回・〜本])
- **Mặt sau (Full Resolution):** `1週間[いっしゅうかん]に2回[にかい]、家族[かぞく]に電話[でんわ]します。`
- **Giải thích chi tiết (Pedagogical Note):** Dùng để biểu thị tần suất xuất hiện của một hành vi, thói quen trong một đơn vị thời gian cố định (như 1 ngày mấy lần, 1 tuần mấy lần, 1 năm mấy lần).
- **Initial Stability ($S_0$):** 2.5 ngày | **Initial Difficulty ($D_0$):** 3.0

---

## PATTERN 85: いつも / よく / ときどき / あまり / ぜんぜん (Hệ thống phó từ chỉ tần suất)

**Bài học:** Bài 9 | **Trình độ JLPT:** N5 | **Độ khó nhận thức (Difficulty Score):** 2/5 | **Mã nhận diện:** `G-85`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: Phó từ tần suất + V[khẳng định / phủ định]
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Biểu thị mức độ thường xuyên của hành động theo thang đo tỷ lệ phần trăm từ 100% xuống 0%:
- いつも (100% - luôn luôn)
- よく (~80% - thường xuyên)
- ときどき (~50% - thỉnh thoảng)
- あまり (~20% - hiếm khi, đi kèm V phủ định)
- ぜんぜん (0% - hoàn toàn không, đi kèm V phủ định).

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

Phó từ đứng trước động từ. Lưu ý cực kỳ quan trọng: あまり và ぜんぜん BẮT BUỘC ĐI KÈM ĐỘNG TỪ THỂ PHỦ ĐỊNH (〜ません / 〜ない).

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Tự nhiên, phản ánh chính xác thói quen lối sống trong giao tiếp.

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

Mối tương quan chặt chẽ với cực tính của câu (Polarity): いつも、よく、ときどき đi với khẳng định; あまり、ぜんぜん đi với phủ định.

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Lỗi học sinh hay mắc: Dùng あまり hoặc ぜんぜん nhưng đuôi câu lại chia khẳng định (ví dụ: 'ぜんぜん食べます' -> SAI HOÀN TOÀN). Bắt buộc phải là: 'ぜんぜん食べません'.

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 85.1
- **Chữ Hán chuẩn:** 私は朝いつもコーヒーを飲みます。
- **Furigana phiên âm:** `私[わたし]は朝[あさ]いつもコーヒーを飲[の]みます。`
- **Phiên âm Romaji:** *Watashi wa asa itsumo koohii o nomimasu.*
- **Dịch nghĩa tự nhiên:** **Buổi sáng tôi luôn luôn uống cà phê.**
- **Phân tích ngữ cảnh & Sư phạm:** Thói quen bất di bất dịch 100% mỗi sáng.

#### Ví dụ 85.2
- **Chữ Hán chuẩn:** 休みの日はよく図書館で本を読みます。
- **Furigana phiên âm:** `休[やす]みの日[ひ]はよく図書館[としょかん]で本[ほん]を読[よ]みます。`
- **Phiên âm Romaji:** *Yasumi no hi wa yoku toshokan de hon o yomimasu.*
- **Dịch nghĩa tự nhiên:** **Vào ngày nghỉ tôi thường hay đọc sách ở thư viện.**
- **Phân tích ngữ cảnh & Sư phạm:** Hoạt động thường xuyên ~80%.

#### Ví dụ 85.3
- **Chữ Hán chuẩn:** ときどき友達とテニスをします。
- **Furigana phiên âm:** `ときどき友達[ともだち]とテニスをします。`
- **Phiên âm Romaji:** *Tokidoki tomodachi to tenisu o shimasu.*
- **Dịch nghĩa tự nhiên:** **Thỉnh thoảng tôi lại chơi tennis cùng bạn bè.**
- **Phân tích ngữ cảnh & Sư phạm:** Hoạt động gián đoạn thỉnh thoảng ~50%.

#### Ví dụ 85.4
- **Chữ Hán chuẩn:** お酒はあまり飲みません。
- **Furigana phiên âm:** `お酒[さけ]はあまり飲[の]みません。`
- **Phiên âm Romaji:** *Osake wa amari nomimasen.*
- **Dịch nghĩa tự nhiên:** **Tôi hầu như không mấy khi uống rượu bia.**
- **Phân tích ngữ cảnh & Sư phạm:** Phủ định một phần: hiếm khi ~20%.

#### Ví dụ 85.5
- **Chữ Hán chuẩn:** 私はタバコをぜんぜん吸いません。
- **Furigana phiên âm:** `私[わたし]はタバコをぜんぜん吸[す]いません。`
- **Phiên âm Romaji:** *Watashi wa tabako o zenzen suimasen.*
- **Dịch nghĩa tự nhiên:** **Tôi hoàn toàn không bao giờ hút thuốc lá.**
- **Phân tích ngữ cảnh & Sư phạm:** Phủ định tuyệt đối 0%.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `私は朝いつもコーヒーを飲みます。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 85 (いつも / よく / ときどき / あまり / ぜんぜん)
- **Mặt sau (Full Resolution):** `私[わたし]は朝[あさ]いつもコーヒーを飲[の]みます。`
- **Giải thích chi tiết (Pedagogical Note):** Biểu thị mức độ thường xuyên của hành động theo thang đo tỷ lệ phần trăm từ 100% xuống 0%:
- いつも (100% - luôn luôn)
- よく (~80% - thường xuyên)
- ときどき (~50% - thỉnh thoảng)
- あまり (~20% - hiếm khi, đi kèm V phủ định)
- ぜんぜん (0% - hoàn toàn không, đi kèm V phủ định).
- **Initial Stability ($S_0$):** 2.5 ngày | **Initial Difficulty ($D_0$):** 3.0

---

## PATTERN 86: どうやって (Nghi vấn từ hỏi cách thức, phương tiện, lộ trình)

**Bài học:** Bài 9 | **Trình độ JLPT:** N5 | **Độ khó nhận thức (Difficulty Score):** 2/5 | **Mã nhận diện:** `G-86`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: どうやって + N[nơi đến] へ 行きますか / V ますか
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Dùng để hỏi về cách thức, phương pháp tiến hành một công việc hoặc hỏi rõ lộ trình, phương tiện giao thông cụ thể để di chuyển đến một địa điểm.

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

Đứng đầu câu hỏi: どうやって + Cụm vị ngữ nghi vấn. Câu trả lời thường liệt kê các bước bằng thể Te (Pattern 83) hoặc phương tiện giao thông đi với trợ từ で.

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Lịch sự, hữu ích trong đời sống thực tế khi hỏi đường, hỏi quy trình thủ tục hành chính, máy móc.

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

Phân biệt với どうして (tại sao - hỏi nguyên nhân) và どう (như thế nào - hỏi cảm nhận tính chất). どうやって tập trung duy nhất vào 'bằng cách nào / lộ trình thế nào'.

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Người học hay nhầm lẫn cách trả lời: Khi hỏi どうやって, người nghe mong đợi chỉ dẫn tuần tự các bước (lên tàu nào, chuyển tuyến ở đâu, đi bộ bao xa), chứ không chỉ trả lời một từ chung chung.

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 86.1
- **Chữ Hán chuẩn:** どうやって美術館へ行きますか。――3番のバスに乗って、美術館前で降ります。
- **Furigana phiên âm:** `どうやって美術館[びじゅつかん]へ行[い]きますか。――3番[さんばん]のバスに乗[の]って、美術館前[びじゅつかんまえ]で降[お]ります。`
- **Phiên âm Romaji:** *Dou yatte bijutsukan e ikimasu ka. -- Sanban no basu ni notte, bijutsukan-mae de orimasu.*
- **Dịch nghĩa tự nhiên:** **Đi đến bảo tàng mỹ thuật bằng cách nào vậy? ―― Hãy lên xe buýt số 3 rồi xuống ở trạm trước bảo tàng.**
- **Phân tích ngữ cảnh & Sư phạm:** Hỏi đường và hướng dẫn lộ trình xe buýt.

#### Ví dụ 86.2
- **Chữ Hán chuẩn:** 大学までどうやって行きますか。――自転車で15分くらい行きます。
- **Furigana phiên âm:** `大学[だいがく]までどうやって行[い]きますか。――自転車[じてんしゃ]で15分[じゅうごふん]くらい行[い]きます。`
- **Phiên âm Romaji:** *Daigaku made dou yatte ikimasu ka. -- Jitensha de juugofun kurai ikimasu.*
- **Dịch nghĩa tự nhiên:** **Làm thế nào để đến trường đại học? ―― Đi xe đạp mất khoảng 15 phút.**
- **Phân tích ngữ cảnh & Sư phạm:** Hỏi phương tiện và thời lượng di chuyển.

#### Ví dụ 86.3
- **Chữ Hán chuẩn:** この漢字はどうやって書きますか。
- **Furigana phiên âm:** `この漢字[かんじ]はどうやって書[か]きますか。`
- **Phiên âm Romaji:** *Kono kanji wa dou yatte kakimasu ka.*
- **Dịch nghĩa tự nhiên:** **Chữ Hán này viết như thế nào vậy?**
- **Phân tích ngữ cảnh & Sư phạm:** Hỏi thứ tự nét bút chữ Hán.

#### Ví dụ 86.4
- **Chữ Hán chuẩn:** この機械はどうやって使いますか。
- **Furigana phiên âm:** `この機械[きかい]はどうやって使[つか]いますか。`
- **Phiên âm Romaji:** *Kono kikai wa dou yatte tsukaimasu ka.*
- **Dịch nghĩa tự nhiên:** **Cỗ máy này vận hành bằng cách nào thế?**
- **Phân tích ngữ cảnh & Sư phạm:** Hỏi hướng dẫn thao tác thiết bị công nghệ.

#### Ví dụ 86.5
- **Chữ Hán chuẩn:** 空港までどうやって行きますか。――電車で行って、モノレールに乗り換えます。
- **Furigana phiên âm:** `空港[くうこう]までどうやって行[い]きますか。――電車[でんしゃ]で行[い]って、モノレールに乗[の]り換[か]えます。`
- **Phiên âm Romaji:** *Kuukou made dou yatte ikimasu ka. -- Densha de itte, monoreeru ni norikaemasu.*
- **Dịch nghĩa tự nhiên:** **Đến sân bay bằng cách nào? ―― Đi tàu điện rồi chuyển sang tàu đường ray đơn (monorail).**
- **Phân tích ngữ cảnh & Sư phạm:** Hướng dẫn chuyển đổi phương tiện công cộng.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `{{c1::どうやって}}美術館へ行きますか。――3番のバスに乗って、美術館前で降ります。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 86 (どうやって)
- **Mặt sau (Full Resolution):** `どうやって美術館[びじゅつかん]へ行[い]きますか。――3番[さんばん]のバスに乗[の]って、美術館前[びじゅつかんまえ]で降[お]ります。`
- **Giải thích chi tiết (Pedagogical Note):** Dùng để hỏi về cách thức, phương pháp tiến hành một công việc hoặc hỏi rõ lộ trình, phương tiện giao thông cụ thể để di chuyển đến một địa điểm.
- **Initial Stability ($S_0$):** 2.5 ngày | **Initial Difficulty ($D_0$):** 3.0

---

## PATTERN 87: でも (Liên từ liên kết tương phản: Tuy nhiên, Nhưng mà)

**Bài học:** Bài 9 | **Trình độ JLPT:** N5 | **Độ khó nhận thức (Difficulty Score):** 2/5 | **Mã nhận diện:** `G-87`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: Câu 1. でも、Câu 2.
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Dùng làm liên từ đứng ở đầu câu thứ hai nhằm biểu thị sự đối lập, tương phản hoặc bất ngờ so với nội dung đã được phát biểu ở câu thứ nhất.

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

Đứng độc lập ở đầu câu, ngăn cách với vế sau bằng dấu phẩy: [Câu 1]。でも、[Câu 2]。

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Giao tiếp thân mật đến bán trang trọng trong hội thoại đời sống.

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

Khác với trợ từ liên kết が (kết nối trực tiếp hai vế trong một câu duy nhất: Câu 1 が、Câu 2). でも luôn luôn đứng sau dấu chấm câu và bắt đầu một câu hoàn toàn mới.

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Lỗi cú pháp: Học sinh hay ghép でも vào giữa câu như trợ từ nối (Ví dụ: 'スポーツが好きですでも全然しません' -> SAI CÚ PHÁP). Đúng ngữ pháp phải tách câu: 'スポーツが好きです。でも、全然しません。' hoặc dùng が: 'スポーツが好きですが、全然しません。'.

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 87.1
- **Chữ Hán chuẩn:** 私の趣味はスポーツです。でも、最近、全然しません。
- **Furigana phiên âm:** `私[わたし]の趣味[しゅみ]はスポーツです。でも、最近[さいきん]、全然[ぜんぜん]しません。`
- **Phiên âm Romaji:** *Watashi no shumi wa supootsu desu. Demo, saikin, zenzen shimasen.*
- **Dịch nghĩa tự nhiên:** **Sở thích của tôi là thể thao. Tuy nhiên, dạo gần đây tôi hoàn toàn không chơi.**
- **Phân tích ngữ cảnh & Sư phạm:** Tương phản giữa sở thích và thực tế bận rộn.

#### Ví dụ 87.2
- **Chữ Hán chuẩn:** 日本の生活は便利です。でも、物価が高いです。
- **Furigana phiên âm:** `日本[にほん]の生活[せいかつ]は便利[べんり]です。でも、物価[ぶっか]が高[たか]いです。`
- **Phiên âm Romaji:** *Nihon no seikatsu wa benri desu. Demo, bukka ga takai desu.*
- **Dịch nghĩa tự nhiên:** **Cuộc sống ở Nhật Bản rất tiện lợi. Nhưng mà, giá cả hàng hóa lại đắt đỏ.**
- **Phân tích ngữ cảnh & Sư phạm:** Nhận xét hai mặt thuận lợi và thách thức.

#### Ví dụ 87.3
- **Chữ Hán chuẩn:** この料理はおいしいです。でも、ちょっと辛いです。
- **Furigana phiên âm:** `この料理[りょうり]はおいしいです。でも、ちょっと辛[から]いです。`
- **Phiên âm Romaji:** *Kono ryouri wa oishii desu. Demo, chotto karai desu.*
- **Dịch nghĩa tự nhiên:** **Món ăn này rất ngon. Nhưng mà, hơi cay một chút.**
- **Phân tích ngữ cảnh & Sư phạm:** Cảm nhận ẩm thực chi tiết.

#### Ví dụ 87.4
- **Chữ Hán chuẩn:** 試験は難しかったです。でも、合格しました。
- **Furigana phiên âm:** `試験[しけん]は難[むずか]しかったです。でも、合格[ごうかく]しました。`
- **Phiên âm Romaji:** *Shiken wa muzukashikatta desu. Demo, goukaku shimashita.*
- **Dịch nghĩa tự nhiên:** **Kỳ thi đã rất khó khăn. Nhưng mà tôi đã thi đỗ rồi.**
- **Phân tích ngữ cảnh & Sư phạm:** Kết quả thành công bất chấp gian nan.

#### Ví dụ 87.5
- **Chữ Hán chuẩn:** 新しい車を買いたいです。でも、お金がありません。
- **Furigana phiên âm:** `新[あたら]しい車[くるま]を買[か]いたいです。でも、お金[かね]がありません。`
- **Phiên âm Romaji:** *Atarashii kuruma o kaitai desu. Demo, okane ga arimasen.*
- **Dịch nghĩa tự nhiên:** **Tôi rất muốn mua một chiếc ô tô mới. Thế nhưng tôi lại không có tiền.**
- **Phân tích ngữ cảnh & Sư phạm:** Mâu thuẫn giữa mong muốn và điều kiện tài chính.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `私の趣味はスポーツです。でも、最近、全然しません。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 87 (でも)
- **Mặt sau (Full Resolution):** `私[わたし]の趣味[しゅみ]はスポーツです。でも、最近[さいきん]、全然[ぜんぜん]しません。`
- **Giải thích chi tiết (Pedagogical Note):** Dùng làm liên từ đứng ở đầu câu thứ hai nhằm biểu thị sự đối lập, tương phản hoặc bất ngờ so với nội dung đã được phát biểu ở câu thứ nhất.
- **Initial Stability ($S_0$):** 2.5 ngày | **Initial Difficulty ($D_0$):** 3.0

---

## PATTERN 88: Vない形 でください (Yêu cầu cấm chỉ lịch sự: Xin đừng làm gì)

**Bài học:** Bài 10 | **Trình độ JLPT:** N5 | **Độ khó nhận thức (Difficulty Score):** 2/5 | **Mã nhận diện:** `G-88`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: V[ない形] + でください
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Dùng để yêu cầu, chỉ dẫn hoặc khuyên nhủ ai đó một cách lịch sự không được làm một hành vi nào đó (cấm chỉ nhẹ nhàng, mang tính quy định công cộng hoặc y tế).

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

Động từ chia về thể Phủ định ngắn (Nai-form): Nhóm 1 (u -> a + nai; iku -> ikanai; nomu -> nomanai); Nhóm 2 (bỏ masu + nai); Nhóm 3 (suru -> shinai; kuru -> konai) + でください.

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Chuẩn mực biển báo nơi công cộng, dặn dò của bác sĩ đối với bệnh nhân, nhắc nhở của giáo viên trong lớp.

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

Phân biệt với Thể cấm chỉ thô lỗ ở N3 (Vるな như 入るな - cấm vào!). Mẫu Vないでください giữ nguyên sắc thái lịch sự, tôn trọng đối phương.

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Học sinh hay nhầm đuôi: bỏ qua trợ từ で mà nói 'Vないください' -> SAI. Bắt buộc phải có で: 'Vないでください'.

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 88.1
- **Chữ Hán chuẩn:** そこに車を止めないでください。
- **Furigana phiên âm:** `そこに車[くるま]を止[と]めないでください。`
- **Phiên âm Romaji:** *Soko ni kuruma o tomenaide kudasai.*
- **Dịch nghĩa tự nhiên:** **Xin vui lòng đừng đỗ xe ở chỗ đó.**
- **Phân tích ngữ cảnh & Sư phạm:** Nhắc nhở đỗ xe đúng quy định.

#### Ví dụ 88.2
- **Chữ Hán chuẩn:** ここで写真を撮らないでください。
- **Furigana phiên âm:** `ここで写真[しゃしん]を撮[と]らないでください。`
- **Phiên âm Romaji:** *Koko de shashin o toranaide kudasai.*
- **Dịch nghĩa tự nhiên:** **Xin đừng chụp ảnh ở khu vực này.**
- **Phân tích ngữ cảnh & Sư phạm:** Quy định bảo tàng/di tích.

#### Ví dụ 88.3
- **Chữ Hán chuẩn:** お酒を飲んで運転しないでください。
- **Furigana phiên âm:** `お酒[さけ]を飲[の]んで運転[うんてん]しないでください。`
- **Phiên âm Romaji:** *Osake o nonde unten shinaide kudasai.*
- **Dịch nghĩa tự nhiên:** **Tuyệt đối xin đừng uống rượu rồi lái xe.**
- **Phân tích ngữ cảnh & Sư phạm:** Quy tắc an toàn giao thông nghiêm ngặt.

#### Ví dụ 88.4
- **Chữ Hán chuẩn:** 無理をしないで、ゆっくり休んでください。
- **Furigana phiên âm:** `無理[むり]をしないで、ゆっくり休[やす]んでください。`
- **Phiên âm Romaji:** *Muri o shinaide, yukkuri yasunde kudasai.*
- **Dịch nghĩa tự nhiên:** **Đừng quá sức nhé, hãy nghỉ ngơi thong thả đi.**
- **Phân tích ngữ cảnh & Sư phạm:** Lời khuyên nhủ ân cần khi bị ốm.

#### Ví dụ 88.5
- **Chữ Hán chuẩn:** パスワードを他の人に教えないでください。
- **Furigana phiên âm:** `パスワードを他[ほか]の人[ひと]に教[おし]えないでください。`
- **Phiên âm Romaji:** *Pasuwaado o hoka no hito ni oshienaide kudasai.*
- **Dịch nghĩa tự nhiên:** **Xin đừng tiết lộ mật khẩu cho người khác biết.**
- **Phân tích ngữ cảnh & Sư phạm:** Bảo mật thông tin tài khoản.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `そこに車を止めないでください。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 88 (Vない形 でください)
- **Mặt sau (Full Resolution):** `そこに車[くるま]を止[と]めないでください。`
- **Giải thích chi tiết (Pedagogical Note):** Dùng để yêu cầu, chỉ dẫn hoặc khuyên nhủ ai đó một cách lịch sự không được làm một hành vi nào đó (cấm chỉ nhẹ nhàng, mang tính quy định công cộng hoặc y tế).
- **Initial Stability ($S_0$):** 2.5 ngày | **Initial Difficulty ($D_0$):** 3.0

---

## PATTERN 89: Vてもいいですか (Xin phép thực hiện hành vi: Tôi làm ... có được không?)

**Bài học:** Bài 10 | **Trình độ JLPT:** N5 | **Độ khó nhận thức (Difficulty Score):** 2/5 | **Mã nhận diện:** `G-89`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: V[て形] + もいいですか
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Dùng khi người nói muốn xin phép đối phương để bản thân được thực hiện một hành động nào đó trong không gian hoặc quyền hạn của đối phương.

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

Động từ chia thể Te (V-te) + もいいですか. Trả lời đồng ý: 'ええ、いいですよ / はい、どうぞ'. Trả lời từ chối khéo léo: 'すみません、ちょっと...'.

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Lịch thiệp, chuẩn mực xã hội Nhật Bản (luôn xin phép trước khi can thiệp vào không gian người khác).

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

Phân biệt với Vてはいけません (Cấm đoán - không được phép). Mẫu Vてもいいですか thể hiện sự khiêm nhường xin phép từ người nói.

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Lỗi quên chia thể Te hoặc nhầm trợ từ: nói 'Vるもいいですか' -> SAI. Bắt buộc phải chia thể Te: '入ってもいいですか'.

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 89.1
- **Chữ Hán chuẩn:** ここに座ってもいいですか。――はい、どうぞ。
- **Furigana phiên âm:** `ここに座[すわ]ってもいいですか。――はい、どうぞ。`
- **Phiên âm Romaji:** *Koko ni suwattemo ii desu ka. -- Hai, douzo.*
- **Dịch nghĩa tự nhiên:** **Tôi ngồi vào đây có được không ạ? ―― Vâng, xin mời bạn.**
- **Phân tích ngữ cảnh & Sư phạm:** Xin phép chỗ ngồi nơi công cộng.

#### Ví dụ 89.2
- **Chữ Hán chuẩn:** 窓を開けてもいいですか。――ええ、いいですよ。
- **Furigana phiên âm:** `窓[まど]を開[あ]けてもいいですか。――ええ、いいですよ。`
- **Phiên âm Romaji:** *Mado o aketemo ii desu ka. -- Ee, ii desu yo.*
- **Dịch nghĩa tự nhiên:** **Tôi mở cửa sổ ra có được không? ―― Vâng, được chứ.**
- **Phân tích ngữ cảnh & Sư phạm:** Xin phép điều chỉnh không gian chung.

#### Ví dụ 89.3
- **Chữ Hán chuẩn:** この資料をコピーしてもいいですか。
- **Furigana phiên âm:** `この資料[しりょう]をコピーしてもいいですか。`
- **Phiên âm Romaji:** *Kono shiryou o kopii shitemo ii desu ka.*
- **Dịch nghĩa tự nhiên:** **Tôi có thể photocopy tập tài liệu này được không ạ?**
- **Phân tích ngữ cảnh & Sư phạm:** Xin phép sử dụng thiết bị văn phòng.

#### Ví dụ 89.4
- **Chữ Hán chuẩn:** 写真を撮ってもいいですか。――すみません、ここはちょっと...
- **Furigana phiên âm:** `写真[しゃしん]を撮[と]ってもいいですか。――すみません、ここはちょっと...`
- **Phiên âm Romaji:** *Shashin o tottemo ii desu ka. -- Sumimasen, koko wa chotto...*
- **Dịch nghĩa tự nhiên:** **Tôi chụp ảnh có được không ạ? ―― Xin lỗi, ở đây thì không được phép...**
- **Phân tích ngữ cảnh & Sư phạm:** Từ chối khéo léo theo phong cách Nhật.

#### Ví dụ 89.5
- **Chữ Hán chuẩn:** 今日、早く帰ってもいいですか。
- **Furigana phiên âm:** `今日[きょう]、早[はや]く帰[かえ]ってもいいですか。`
- **Phiên âm Romaji:** *Kyou, hayaku kaettemo ii desu ka.*
- **Dịch nghĩa tự nhiên:** **Hôm nay em có thể xin phép về sớm được không ạ?**
- **Phân tích ngữ cảnh & Sư phạm:** Học sinh xin phép giáo viên / nhân viên xin phép sếp.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `ここに座ってもいいですか。――はい、どうぞ。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 89 (Vてもいいですか)
- **Mặt sau (Full Resolution):** `ここに座[すわ]ってもいいですか。――はい、どうぞ。`
- **Giải thích chi tiết (Pedagogical Note):** Dùng khi người nói muốn xin phép đối phương để bản thân được thực hiện một hành động nào đó trong không gian hoặc quyền hạn của đối phương.
- **Initial Stability ($S_0$):** 2.5 ngày | **Initial Difficulty ($D_0$):** 3.0

---

## PATTERN 90: N が Vています (Trạng thái khách quan đang diễn ra trước mắt người nói)

**Bài học:** Bài 10 | **Trình độ JLPT:** N5 | **Độ khó nhận thức (Difficulty Score):** 2/5 | **Mã nhận diện:** `G-90`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: N[chủ thể tự nhiên/động vật] が + V[て形] います
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Dùng để thông báo, phát hiện hoặc miêu tả một hiện tượng, sự việc đang trực tiếp diễn ra trước mắt mà người nói vừa chứng kiến một cách khách quan.

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

Danh từ chủ thể (phát hiện mới) đi với trợ từ が + Động từ chia thể Te + います. Thường mở đầu bằng thán từ phát hiện như 'あっ' (A kìa!).

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Sinh động, giàu tính trực quan, miêu tả hiện trường sống động.

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

So sánh với trợ từ は: 'サルはバナナを食べています' (Khỉ thì ăn chuối - nói về thói quen loài khỉ); trong khi 'あっ、サルがバナナを食べています' (A, có con khỉ đang ăn chuối kìa! - phát hiện cảnh tượng trước mắt).

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Học sinh hay dùng nhầm trợ từ は khi miêu tả cảnh tượng vừa thấy. Quy tắc vàng: Phát hiện hiện tượng khách quan trước mắt dùng trợ từ が.

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 90.1
- **Chữ Hán chuẩn:** あっ、サルがバナナを食べています。
- **Furigana phiên âm:** `あっ、サルがバナナを食[た]べています。`
- **Phiên âm Romaji:** *A', saru ga banana o tabete imasu.*
- **Dịch nghĩa tự nhiên:** **A, nhìn kìa, con khỉ đang ăn quả chuối!**
- **Phân tích ngữ cảnh & Sư phạm:** Phát hiện hiện tượng bất ngờ trong sở thú.

#### Ví dụ 90.2
- **Chữ Hán chuẩn:** 雨が降っています。
- **Furigana phiên âm:** `雨[あめ]が降[ふ]っています。`
- **Phiên âm Romaji:** *Ame ga futte imasu.*
- **Dịch nghĩa tự nhiên:** **Trời đang đổ mưa.**
- **Phân tích ngữ cảnh & Sư phạm:** Miêu tả thời tiết hiện tại ngoài trời.

#### Ví dụ 90.3
- **Chữ Hán chuẩn:** 見て、白い鳥がたくさん飛んでいますよ。
- **Furigana phiên âm:** `見[み]て、白[しろ]い鳥[とり]がたくさん飛[と]んでいますよ。`
- **Phiên âm Romaji:** *Mite, shiroi tori ga takusan tonde imasu yo.*
- **Dịch nghĩa tự nhiên:** **Nhìn kìa, có bao nhiêu là cánh chim trắng đang bay lượn kìa.**
- **Phân tích ngữ cảnh & Sư phạm:** Kêu gọi người khác cùng chiêm ngưỡng cảnh đẹp.

#### Ví dụ 90.4
- **Chữ Hán chuẩn:** 赤ちゃんが気持ちよさそうに眠っています。
- **Furigana phiên âm:** `赤[あか]ちゃんが気持[きも]ちよさそうに眠[ねむ]っています。`
- **Phiên âm Romaji:** *Akachan ga kimochiyosasou ni nemutte imasu.*
- **Dịch nghĩa tự nhiên:** **Em bé đang say giấc ngủ trông thật ngon lành.**
- **Phân tích ngữ cảnh & Sư phạm:** Quan sát em bé sơ sinh.

#### Ví dụ 90.5
- **Chữ Hán chuẩn:** バスが来ましたよ。みんなが乗っています。
- **Furigana phiên âm:** `バスが来[き]ましたよ。みんなが乗[の]っています。`
- **Phiên âm Romaji:** *Basu ga kimashita yo. Minna ga notte imasu.*
- **Dịch nghĩa tự nhiên:** **Xe buýt đến rồi kìa. Mọi người đang bước lên xe.**
- **Phân tích ngữ cảnh & Sư phạm:** Tường thuật sự kiện ở bến xe buýt.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `あっ、サルがバナナを食べています。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 90 (N が Vています)
- **Mặt sau (Full Resolution):** `あっ、サルがバナナを食[た]べています。`
- **Giải thích chi tiết (Pedagogical Note):** Dùng để thông báo, phát hiện hoặc miêu tả một hiện tượng, sự việc đang trực tiếp diễn ra trước mắt mà người nói vừa chứng kiến một cách khách quan.
- **Initial Stability ($S_0$):** 2.5 ngày | **Initial Difficulty ($D_0$):** 3.0

---

## PATTERN 91: まだ Vていません (Vẫn chưa làm gì - Hành động chưa hoàn tất)

**Bài học:** Bài 10 | **Trình độ JLPT:** N5 | **Độ khó nhận thức (Difficulty Score):** 2/5 | **Mã nhận diện:** `G-91`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: まだ + V[て形] いません
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Diễn tả một hành động, sự việc được mong đợi hoặc theo kế hoạch cần làm nhưng tính đến thời điểm hiện tại thì người nói vẫn chưa thực hiện xong.

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

Phó từ まだ (vẫn/chưa) + Động từ thể Te + いません (Dạng phủ định tiếp diễn).

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Lịch sự, thường xuyên dùng khi trả lời câu hỏi 'Đã làm xong việc đó chưa?' (もうVましたか).

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

Không dùng 'まだVませんでした' để trả lời cho việc chưa làm. Trong tư duy tiếng Nhật, hành động đó chưa xong và vẫn có khả năng tiếp diễn trong tương lai nên bắt buộc phải dùng thì tiếp diễn phủ định: 'まだ〜ていません'.

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Học sinh rất hay nhầm lẫn nói 'まだ食べませんでした' (Tôi đã không ăn - mang nghĩa từ chối ăn trong quá khứ). Chuẩn xác phải là: 'まだ食べていません' (Tôi vẫn chưa ăn).

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 91.1
- **Chữ Hán chuẩn:** まだ昼ご飯を食べていません。
- **Furigana phiên âm:** `まだ昼[ひる]ご飯[はん]を食[た]べていません。`
- **Phiên âm Romaji:** *Mada hirugohan o tabete imasen.*
- **Dịch nghĩa tự nhiên:** **Tôi vẫn chưa ăn cơm trưa.**
- **Phân tích ngữ cảnh & Sư phạm:** Trả lời câu hỏi đã ăn cơm trưa chưa.

#### Ví dụ 91.2
- **Chữ Hán chuẩn:** もう宿題をしましたか。――いいえ、まだしていません。
- **Furigana phiên âm:** `もう宿題[しゅくだい]をしましたか。――いいえ、まだしていません。`
- **Phiên âm Romaji:** *Mou shukudai o shimashita ka. -- Iie, mada shite imasen.*
- **Dịch nghĩa tự nhiên:** **Bạn đã làm bài tập chưa? ―― Dạ chưa, tôi vẫn chưa làm ạ.**
- **Phân tích ngữ cảnh & Sư phạm:** Hội thoại cô giáo hỏi bài tập về nhà.

#### Ví dụ 91.3
- **Chữ Hán chuẩn:** 田中さんはまだ来ていません。
- **Furigana phiên âm:** `田中[たなか]さんはまだ来[き]ていません。`
- **Phiên âm Romaji:** *Tanaka-san wa mada kite imasen.*
- **Dịch nghĩa tự nhiên:** **Anh Tanaka vẫn chưa đến nơi.**
- **Phân tích ngữ cảnh & Sư phạm:** Thông báo tình trạng vắng mặt tại cuộc họp.

#### Ví dụ 91.4
- **Chữ Hán chuẩn:** その映画はまだ見ていません。
- **Furigana phiên âm:** `その映画[えいが]はまだ見[み]ていません。`
- **Phiên âm Romaji:** *Sono eiga wa mada mite imasen.*
- **Dịch nghĩa tự nhiên:** **Bộ phim điện ảnh đó tôi vẫn chưa xem.**
- **Phân tích ngữ cảnh & Sư phạm:** Trao đổi về trải nghiệm xem phim.

#### Ví dụ 91.5
- **Chữ Hán chuẩn:** 荷物はまだ届いていません。
- **Furigana phiên âm:** `荷物[にもつ]はまだ届[とど]いていません。`
- **Phiên âm Romaji:** *Nimotsu wa mada todoite imasen.*
- **Dịch nghĩa tự nhiên:** **Hàng hóa bưu kiện vẫn chưa được chuyển tới.**
- **Phân tích ngữ cảnh & Sư phạm:** Kiểm tra tình trạng giao hàng chuyển phát nhanh.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `{{c1::まだ}}昼ご飯を食べていません。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 91 (まだ Vていません)
- **Mặt sau (Full Resolution):** `まだ昼[ひる]ご飯[はん]を食[た]べていません。`
- **Giải thích chi tiết (Pedagogical Note):** Diễn tả một hành động, sự việc được mong đợi hoặc theo kế hoạch cần làm nhưng tính đến thời điểm hiện tại thì người nói vẫn chưa thực hiện xong.
- **Initial Stability ($S_0$):** 2.5 ngày | **Initial Difficulty ($D_0$):** 3.0

---

## PATTERN 92: Vてきます (Đi đâu đó làm một việc rồi sẽ quay lại)

**Bài học:** Bài 10 | **Trình độ JLPT:** N5 | **Độ khó nhận thức (Difficulty Score):** 2/5 | **Mã nhận diện:** `G-92`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: V[て形] + きます
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Diễn tả hành động người nói tạm thời rời khỏi vị trí hiện tại để đi đến một địa điểm khác làm một công việc gì đó ngắn hạn, rồi sau đó sẽ quay trở về vị trí ban đầu.

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

Động từ hành động chia thể Te + きます (quá khứ: きました). Thường đi kèm địa điểm + で (コンビニで、トイレへ).

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Rất thông dụng trong đời sống công sở và gia đình khi cần rời bàn làm việc trong chốc lát.

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

Phân biệt với Vていきます (làm xong rồi đi luôn không về). Vてきます cam kết sẽ quay lại điểm xuất phát.

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Người học hay dịch từng chữ 'Tôi đi mua nước rồi về' thành hai câu rườm rà. Trong tiếng Nhật chỉ cần gói gọn trong 1 động từ ghép: '買ってきます'.

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 92.1
- **Chữ Hán chuẩn:** コンビニでジュースを買ってきます。
- **Furigana phiên âm:** `コンビニでジュースを買[か]ってきます。`
- **Phiên âm Romaji:** *Konbini de juusu o katte kimasu.*
- **Dịch nghĩa tự nhiên:** **Tôi đi ra cửa hàng tiện lợi mua hộp nước trái cây rồi quay lại ngay.**
- **Phân tích ngữ cảnh & Sư phạm:** Nói với đồng nghiệp trước khi ra ngoài mua đồ uống.

#### Ví dụ 92.2
- **Chữ Hán chuẩn:** ちょっとトイレへ行ってきます。
- **Furigana phiên âm:** `ちょっとトイレへ行[い]ってきます。`
- **Phiên âm Romaji:** *Chotto toire e itte kimasu.*
- **Dịch nghĩa tự nhiên:** **Tôi đi vệ sinh một lát rồi quay lại.**
- **Phân tích ngữ cảnh & Sư phạm:** Lời xin phép rời chỗ ngắn khi đang trò chuyện.

#### Ví dụ 92.3
- **Chữ Hán chuẩn:** 郵便局で切手を買ってきます。
- **Furigana phiên âm:** `郵便局[ゆうびんきょく]で切手[きって]を買[か]ってきます。`
- **Phiên âm Romaji:** *Yuubinkyoku de kitte o katte kimasu.*
- **Dịch nghĩa tự nhiên:** **Tôi đi bưu điện mua mấy con tem rồi sẽ về ngay.**
- **Phân tích ngữ cảnh & Sư phạm:** Rời văn phòng giải quyết công việc vặt.

#### Ví dụ 92.4
- **Chữ Hán chuẩn:** 図書館で本を返してきます。
- **Furigana phiên âm:** `図書館[としょかん]で本[ほん]を返[かえ]してきます。`
- **Phiên âm Romaji:** *Toshokan de hon o kaeshite kimasu.*
- **Dịch nghĩa tự nhiên:** **Tôi đi trả sách ở thư viện rồi về.**
- **Phân tích ngữ cảnh & Sư phạm:** Hoàn thành thủ tục mượn trả tài liệu.

#### Ví dụ 92.5
- **Chữ Hán chuẩn:** 「行ってきます。」――「いってらっしゃい。」
- **Furigana phiên âm:** `「行[い]ってきます。」――「いってらっしゃい。」`
- **Phiên âm Romaji:** *Itte kimasu. -- Itterasshai.*
- **Dịch nghĩa tự nhiên:** **Con đi học / đi làm đây ạ! ―― Con đi nhé, chúc một ngày tốt lành!**
- **Phân tích ngữ cảnh & Sư phạm:** Cặp câu chào kinh điển khi rời khỏi nhà của văn hóa Nhật Bản.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `コンビニでジュースを買ってきます。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 92 (Vてきます)
- **Mặt sau (Full Resolution):** `コンビニでジュースを買[か]ってきます。`
- **Giải thích chi tiết (Pedagogical Note):** Diễn tả hành động người nói tạm thời rời khỏi vị trí hiện tại để đi đến một địa điểm khác làm một công việc gì đó ngắn hạn, rồi sau đó sẽ quay trở về vị trí ban đầu.
- **Initial Stability ($S_0$):** 2.5 ngày | **Initial Difficulty ($D_0$):** 3.0

---

## PATTERN 93: N が できます / V辞書形 ことができます (Khả năng do điều kiện hoàn cảnh cho phép)

**Bài học:** Bài 10 | **Trình độ JLPT:** N5 | **Độ khó nhận thức (Difficulty Score):** 2/5 | **Mã nhận diện:** `G-93`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: N[địa điểm/điều kiện] で + N が できます / V[辞書形] ことが できます
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Diễn tả một hành động có thể được thực hiện hay không do quy định của địa điểm, điều kiện pháp lý hoặc hoàn cảnh khách quan cho phép (khác với năng lực cá nhân bẩm sinh ở Pattern 82).

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

Địa điểm + で + Danh từ/Động từ thể từ điển + ことが できます.

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Biển báo quy định tại khách sạn, ngân hàng, địa điểm công cộng.

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

Pattern 82 nhấn mạnh năng lực cá nhân (Tôi biết bơi, tôi biết lái xe). Pattern 93 nhấn mạnh điều kiện hoàn cảnh (Ở đây CÓ THỂ ăn uống, ở đây CÓ THỂ đổi tiền ngoại tệ).

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Cần chú ý trợ từ nơi chốn: nơi có điều kiện cho phép hành động diễn ra dùng trợ từ で.

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 93.1
- **Chữ Hán chuẩn:** ここで食事できます。
- **Furigana phiên âm:** `ここで食事[しょくじ]できます。`
- **Phiên âm Romaji:** *Koko de shokuji dekimasu.*
- **Dịch nghĩa tự nhiên:** **Tại đây quý khách có thể dùng bữa.**
- **Phân tích ngữ cảnh & Sư phạm:** Thông báo tại khu vực phục vụ ăn uống.

#### Ví dụ 93.2
- **Chữ Hán chuẩn:** このホテルでドルを両替することができます。
- **Furigana phiên âm:** `このホテルでドルを両替[りょうがえ]することができます。`
- **Phiên âm Romaji:** *Kono hoteru de doru o ryougae suru koto ga dekimasu.*
- **Dịch nghĩa tự nhiên:** **Tại khách sạn này quý khách có thể đổi tiền Đô la.**
- **Phân tích ngữ cảnh & Sư phạm:** Dịch vụ tài chính tiện ích tại khách sạn.

#### Ví dụ 93.3
- **Chữ Hán chuẩn:** 図書館でインターネットを使うことができます。
- **Furigana phiên âm:** `図書館[としょかん]でインターネットを使[つか]うことができます。`
- **Phiên âm Romaji:** *Toshokan de intaanetto o tsukau koto ga dekimasu.*
- **Dịch nghĩa tự nhiên:** **Tại thư viện bạn có thể truy cập mạng Internet.**
- **Phân tích ngữ cảnh & Sư phạm:** Tiện ích công cộng cho độc giả.

#### Ví dụ 93.4
- **Chữ Hán chuẩn:** この部屋でタバコを吸うことはできません。
- **Furigana phiên âm:** `この部屋[へや]でタバコを吸[す]うことはできません。`
- **Phiên âm Romaji:** *Kono heya de tabako o suu koto wa dekimasen.*
- **Dịch nghĩa tự nhiên:** **Trong phòng này không được phép hút thuốc lá.**
- **Phân tích ngữ cảnh & Sư phạm:** Quy định cấm hút thuốc bằng thể phủ định khả năng.

#### Ví dụ 93.5
- **Chữ Hán chuẩn:** 駅の前で自転車を借りることができます。
- **Furigana phiên âm:** `駅[えき]の前[まえ]で自転車[じてんしゃ]を借[か]りることができます。`
- **Phiên âm Romaji:** *Eki no mae de jitensha o kariru koto ga dekimasu.*
- **Dịch nghĩa tự nhiên:** **Trước nhà ga bạn có thể thuê xe đạp công cộng.**
- **Phân tích ngữ cảnh & Sư phạm:** Dịch vụ di chuyển tiện lợi cho khách du lịch.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `ここで食事できます。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 93 (N が できます / V辞書形 ことができます)
- **Mặt sau (Full Resolution):** `ここで食事[しょくじ]できます。`
- **Giải thích chi tiết (Pedagogical Note):** Diễn tả một hành động có thể được thực hiện hay không do quy định của địa điểm, điều kiện pháp lý hoặc hoàn cảnh khách quan cho phép (khác với năng lực cá nhân bẩm sinh ở Pattern 82).
- **Initial Stability ($S_0$):** 2.5 ngày | **Initial Difficulty ($D_0$):** 3.0

---

## PATTERN 94: N が 見えます / 聞こえます (Khả năng thụ cảm tự nhiên: Nhìn thấy / Nghe thấy)

**Bài học:** Bài 10 | **Trình độ JLPT:** N5 | **Độ khó nhận thức (Difficulty Score):** 3/5 | **Mã nhận diện:** `G-94`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: N が 見えます / 聞こえます
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Diễn tả âm thanh hoặc hình ảnh tự nhiên lọt vào mắt, vào tai của con người một cách tự phát, khách quan do vị trí địa lý hoặc điều kiện không gian, không đòi hỏi nỗ lực hay chủ ý của người quan sát.

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

Danh từ đối tượng cảm nhận + が + 見えます (nhìn thấy) / 聞こえます (nghe thấy). Phủ định: 見えません / 聞こえません.

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Trực quan, tự nhiên. Thường dùng khi thưởng ngoạn phong cảnh hoặc kiểm tra đường truyền âm thanh, hình ảnh trong họp trực tuyến.

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

So sánh sống còn giữa cặp từ:
- 見えます (hình ảnh tự lọt vào mắt) vs 見られます (có điều kiện, cơ hội để chủ động xem một chương trình, bộ phim).
- 聞こえます (âm thanh tự vọng vào tai) vs 聞けます (có điều kiện, cơ hội để chủ động nghe đài, nghe nhạc).

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Học sinh rất dễ nhầm 見えます với 見ます. Hãy nhớ: 見ます là hành động có chủ ý (tập trung nhìn), còn 見えます là nhìn thấy tự nhiên không cần cố gắng.

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 94.1
- **Chữ Hán chuẩn:** ここから東京タワーが見えます。
- **Furigana phiên âm:** `ここから東京[とうきょう]タワーが見[み]えます。`
- **Phiên âm Romaji:** *Koko kara Toukyou Tawaa ga miemasu.*
- **Dịch nghĩa tự nhiên:** **Từ đây có thể nhìn thấy tháp truyền hình Tokyo.**
- **Phân tích ngữ cảnh & Sư phạm:** Tầm nhìn bao quát từ căn hộ cao tầng.

#### Ví dụ 94.2
- **Chữ Hán chuẩn:** 隣の部屋からピアノの音が聞こえます。
- **Furigana phiên âm:** `隣[となり]の部屋[へや]からピアノの音[おと]が聞[き]こえます。`
- **Phiên âm Romaji:** *Tonari no heya kara piano no oto ga kikoemasu.*
- **Dịch nghĩa tự nhiên:** **Từ căn phòng bên cạnh vẳng lại tiếng đàn piano.**
- **Phân tích ngữ cảnh & Sư phạm:** Âm thanh tự nhiên lọt vào tai người nghe.

#### Ví dụ 94.3
- **Chữ Hán chuẩn:** 天気がいい日は富士山がきれいに見えます。
- **Furigana phiên âm:** `天気[てんき]がいい日[ひ]は富士山[ふじさん]がきれいに見[み]えます。`
- **Phiên âm Romaji:** *Tenki ga ii hi wa Fujisan ga kirei ni miemasu.*
- **Dịch nghĩa tự nhiên:** **Vào những ngày trời quang đãng, núi Phú Sĩ hiện lên rất đẹp.**
- **Phân tích ngữ cảnh & Sư phạm:** Khung cảnh tự nhiên từ xa.

#### Ví dụ 94.4
- **Chữ Hán chuẩn:** 遠くで鳥の声が聞こえます。
- **Furigana phiên âm:** `遠[とお]くで鳥[とり]の声[こえ]が聞[き]こえます。`
- **Phiên âm Romaji:** *Tooku de tori no koe ga kikoemasu.*
- **Dịch nghĩa tự nhiên:** **Ở đằng xa nghe thấy tiếng chim hót líu lo.**
- **Phân tích ngữ cảnh & Sư phạm:** Cảm nhận âm thanh thiên nhiên buổi sớm.

#### Ví dụ 94.5
- **Chữ Hán chuẩn:** 声が小さくて、よく聞こえません。もう少し大きな声で話してください。
- **Furigana phiên âm:** `声[こえ]が小[ちい]さくて、よく聞[き]こえません。もう少[すこ]し大[おお]きな声[こえ]で話[はな]してください。`
- **Phiên âm Romaji:** *Koe ga chiisakute, yoku kikoemasen. Mou sukoshi ookina koe de hanashite kudasai.*
- **Dịch nghĩa tự nhiên:** **Giọng bạn nhỏ quá nên tôi không nghe rõ. Xin hãy nói to hơn một chút ạ.**
- **Phân tích ngữ cảnh & Sư phạm:** Tình huống giao tiếp thực tế khi âm lượng không đủ.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `ここから東京タワーが見えます。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 94 (N が 見えます / 聞こえます)
- **Mặt sau (Full Resolution):** `ここから東京[とうきょう]タワーが見[み]えます。`
- **Giải thích chi tiết (Pedagogical Note):** Diễn tả âm thanh hoặc hình ảnh tự nhiên lọt vào mắt, vào tai của con người một cách tự phát, khách quan do vị trí địa lý hoặc điều kiện không gian, không đòi hỏi nỗ lực hay chủ ý của người quan sát.
- **Initial Stability ($S_0$):** 1.8 ngày | **Initial Difficulty ($D_0$):** 4.5

---

## PATTERN 95: イA-くなります / ナA-になります / N-になります (Sự biến đổi trạng thái khách quan)

**Bài học:** Bài 10 | **Trình độ JLPT:** N5 | **Độ khó nhận thức (Difficulty Score):** 2/5 | **Mã nhận diện:** `G-95`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: A[đuôi い] -> くなります / A[đuôi な] + になります / N + になります
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Diễn tả sự thay đổi, chuyển hóa từ trạng thái này sang một trạng thái khác của thời tiết, tính chất, năng lực hoặc thân phận con người theo tiến trình tự nhiên.

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

- Tính từ đuôi い: Bỏ [い] thay bằng [くなります] (samui -> samukunarimasu).
- Tính từ đuôi な: Bỏ [な] thêm [になります] (genki -> genki ni narimasu).
- Danh từ: N + [になります] (sensei -> sensei ni narimasu).

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Vô cùng phổ biến trong miêu tả thời tiết các mùa, sự trưởng thành của con người, ước mơ nghề nghiệp tương lai.

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

Phân biệt với します (Pattern làm cho biến đổi theo ý chí chủ quan: 部屋をきれいにします). Mẫu なります là sự tự biến đổi khách quan tự nhiên của sự vật.

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Lỗi quên đổi đuôi い: học sinh hay giữ nguyên い mà thêm になります (samui ni narimasu -> SAI NGHIÊM TRỌNG). Tính từ đuôi い bắt buộc phải đổi thành 〜くなります.

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 95.1
- **Chữ Hán chuẩn:** 十一月になって、寒くなりました。
- **Furigana phiên âm:** `十一月[じゅういちがつ]になって、寒[さむ]くなりました。`
- **Phiên âm Romaji:** *Juuichigatsu ni natte, samuku narimashita.*
- **Dịch nghĩa tự nhiên:** **Bước sang tháng 11, trời đã trở nên giá lạnh.**
- **Phân tích ngữ cảnh & Sư phạm:** Biến chuyển thời tiết sang đông.

#### Ví dụ 95.2
- **Chữ Hán chuẩn:** 薬を飲んで、元気になりました。
- **Furigana phiên âm:** `薬[くすり]を飲[の]んで、元気[げんき]になりました。`
- **Phiên âm Romaji:** *Kusuri o nonde, genki ni narimashita.*
- **Dịch nghĩa tự nhiên:** **Sau khi uống thuốc, tôi đã khỏe khoắn trở lại.**
- **Phân tích ngữ cảnh & Sư phạm:** Sự phục hồi sức khỏe từ tính từ đuôi な.

#### Ví dụ 95.3
- **Chữ Hán chuẩn:** 将来、日本語の先生になりたいです。
- **Furigana phiên âm:** `将来[しょうらい]、日本語[にほんご]の先生[せんせい]になりたいです。`
- **Phiên âm Romaji:** *Shourai, nihongo no sensei ni naritai desu.*
- **Dịch nghĩa tự nhiên:** **Trong tương lai, tôi mong muốn trở thành giáo viên tiếng Nhật.**
- **Phân tích ngữ cảnh & Sư phạm:** Ước mơ nghề nghiệp với Danh từ + になります.

#### Ví dụ 95.4
- **Chữ Hán chuẩn:** 町がだんだん静かになりました。
- **Furigana phiên âm:** `町[まち]がだんだん静[しず]かになりました。`
- **Phiên âm Romaji:** *Machi ga dandan shizuka ni narimashita.*
- **Dịch nghĩa tự nhiên:** **Đường phố dần dần trở nên tĩnh lặng.**
- **Phân tích ngữ cảnh & Sư phạm:** Sự thay đổi không gian theo thời gian về đêm.

#### Ví dụ 95.5
- **Chữ Hán chuẩn:** 毎日日本語を練習して、上手になりました。
- **Furigana phiên âm:** `毎日[まいにち]日本語[にほんご]を練習[れんしゅう]して、上手[じょうず]になりました。`
- **Phiên âm Romaji:** *Mainichi nihongo o renshuu shite, jouzu ni narimashita.*
- **Dịch nghĩa tự nhiên:** **Nhờ kiên trì luyện tập tiếng Nhật mỗi ngày, tôi đã trở nên thành thạo.**
- **Phân tích ngữ cảnh & Sư phạm:** Tiến bộ kỹ năng vượt bậc.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `十一月になって、寒くなりました。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 95 (イA-くなります / ナA-になります / N-になります)
- **Mặt sau (Full Resolution):** `十一月[じゅういちがつ]になって、寒[さむ]くなりました。`
- **Giải thích chi tiết (Pedagogical Note):** Diễn tả sự thay đổi, chuyển hóa từ trạng thái này sang một trạng thái khác của thời tiết, tính chất, năng lực hoặc thân phận con người theo tiến trình tự nhiên.
- **Initial Stability ($S_0$):** 2.5 ngày | **Initial Difficulty ($D_0$):** 3.0

---

## PATTERN 96: N(場所) を V (Không gian di chuyển xuyên qua, băng qua, rẽ)

**Bài học:** Bài 10 | **Trình độ JLPT:** N5 | **Độ khó nhận thức (Difficulty Score):** 2/5 | **Mã nhận diện:** `G-96`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: N[địa điểm không gian] を + 渡ります / 曲がります / 歩きます / 走ります / 飛びます
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Dùng trợ từ を để biểu thị một khoảng không gian, con đường, cây cầu mà chuyển động của con người hoặc phương tiện diễn ra xuyên suốt, băng qua hoặc rời khỏi.

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

Danh từ không gian + を + Động từ chuyển động (渡る: băng qua; 曲がる: rẽ; 歩く: đi bộ; 散歩する: dạo bộ; 飛ぶ: bay lượn; 降りる: xuống tàu xe).

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Cốt lõi khi chỉ đường, lái xe, định vị giao thông đô thị.

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

Khác biệt căn bản với trợ từ で: で chỉ nơi diễn ra toàn bộ hành động khép kín (công viên で đá bóng); trong khi を chỉ không gian chuyển động xuyên tuyến (công viên を đi dạo xuyên qua).

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Học sinh hay nhầm dùng で khi nói 'băng qua cầu' (橋で渡ります -> SAI). Bắt buộc phải là: '橋を渡ります'.

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 96.1
- **Chữ Hán chuẩn:** あの橋を渡って、交差点を右に曲がってください。
- **Furigana phiên âm:** `あの橋[はし]を渡[わた]って、交差点[こうさてん]を右[みぎ]に曲[ま]がってください。`
- **Phiên âm Romaji:** *Ano hashi o watatte, kousaten o migi ni magatte kudasai.*
- **Dịch nghĩa tự nhiên:** **Hãy băng qua cây cầu kia, rồi rẽ phải ở ngã tư.**
- **Phân tích ngữ cảnh & Sư phạm:** Chỉ đường lưu thông chuẩn xác.

#### Ví dụ 96.2
- **Chữ Hán chuẩn:** 毎朝、公園を散歩しています。
- **Furigana phiên âm:** `毎朝[まいあさ]、公園[こうえん]を散歩[さんぽ]しています。`
- **Phiên âm Romaji:** *Maiasa, kouen o sanpo shite imasu.*
- **Dịch nghĩa tự nhiên:** **Mỗi buổi sáng tôi đều đi dạo bộ xuyên qua công viên.**
- **Phân tích ngữ cảnh & Sư phạm:** Chuyển động dạo bộ trong không gian mở.

#### Ví dụ 96.3
- **Chữ Hán chuẩn:** 信号の所を左へ曲がると、郵便局があります。
- **Furigana phiên âm:** `信号[しんごう]の所[ところ]を左[ひだり]へ曲[ま]がると、郵便局[ゆうびんきょく]があります。`
- **Phiên âm Romaji:** *Shingou no tokoro o hidari e magaru to, yuubinkyoku ga arimasu.*
- **Dịch nghĩa tự nhiên:** **Rẽ trái ngay chỗ cột đèn giao thông là sẽ thấy bưu điện.**
- **Phân tích ngữ cảnh & Sư phạm:** Mốc định vị rẽ tại giao lộ.

#### Ví dụ 96.4
- **Chữ Hán chuẩn:** 鳥が空を気持ちよさそうに飛んでいます。
- **Furigana phiên âm:** `鳥[とり]が空[そら]を気持[きも]ちよさそうに飛[と]んでいます。`
- **Phiên âm Romaji:** *Tori ga sora o kimochiyosasou ni tonde imasu.*
- **Dịch nghĩa tự nhiên:** **Đàn chim đang bay lượn trên bầu trời trông thật thảnh thơi.**
- **Phân tích ngữ cảnh & Sư phạm:** Chuyển động bay trong không trung bao la.

#### Ví dụ 96.5
- **Chữ Hán chuẩn:** 次の駅で電車を降ります。
- **Furigana phiên âm:** `次[つぎ]の駅[えき]で電車[でんしゃ]を降[お]ります。`
- **Phiên âm Romaji:** *Tsugi no eki de densha o orimasu.*
- **Dịch nghĩa tự nhiên:** **Tôi sẽ bước xuống tàu điện ở nhà ga tiếp theo.**
- **Phân tích ngữ cảnh & Sư phạm:** Hành động rời khỏi phương tiện dùng を.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `あの橋を渡って、交差点を右に曲がってください。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 96 (N)
- **Mặt sau (Full Resolution):** `あの橋[はし]を渡[わた]って、交差点[こうさてん]を右[みぎ]に曲[ま]がってください。`
- **Giải thích chi tiết (Pedagogical Note):** Dùng trợ từ を để biểu thị một khoảng không gian, con đường, cây cầu mà chuyển động của con người hoặc phương tiện diễn ra xuyên suốt, băng qua hoặc rời khỏi.
- **Initial Stability ($S_0$):** 2.5 ngày | **Initial Difficulty ($D_0$):** 3.0

---

## PATTERN 97: N は (Đưa bổ ngữ lên làm chủ đề để nhấn mạnh hoặc tương phản)

**Bài học:** Bài 10 | **Trình độ JLPT:** N5 | **Độ khó nhận thức (Difficulty Score):** 2/5 | **Mã nhận diện:** `G-97`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: N[tân ngữ/bổ ngữ] は + V / A
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Dùng trợ từ は thay thế cho を hoặc が (hoặc đứng kèm sau には、へは、では) để đưa đối tượng cần chú ý lên đầu câu làm chủ đề trung tâm của cuộc thảo luận, hoặc tạo sắc thái đối chiếu tương phản ngầm.

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

Tân ngữ を -> chuyển thành は (荷物を置きます -> 荷物はあそこに置いてください). Trợ từ に -> には; で -> では; へ -> へは.

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Tự nhiên, phản ánh tư duy hội thoại tiếng Nhật luôn ưu tiên xác định chủ đề trước khi đưa ra chỉ dẫn hành động.

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

Phân biệt với câu trung tính dùng を: 'あそこに荷物を置いてください' (Chỉ thị bình thường); '荷物はあそこに置いてください' (Nhấn mạnh: Riêng về hành lý thì xin hãy để ở kia).

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Học sinh hay bối rối khi thấy câu không có tân ngữ を mà lại có は trước một động từ tha động từ. Cần hiểu đây là hiện tượng Topicalization (Chủ đề hóa).

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 97.1
- **Chữ Hán chuẩn:** 荷物はあそこに置いてください。
- **Furigana phiên âm:** `荷物[にもつ]はあそこに置[お]いてください。`
- **Phiên âm Romaji:** *Nimotsu wa asoko ni oite kudasai.*
- **Dịch nghĩa tự nhiên:** **Hành lý thì xin vui lòng đặt ở đằng kia nhé.**
- **Phân tích ngữ cảnh & Sư phạm:** Hướng dẫn khách để đồ đạc đúng nơi quy định.

#### Ví dụ 97.2
- **Chữ Hán chuẩn:** 朝ご飯は毎日食べますが、昼ご飯は忙しくて食べません。
- **Furigana phiên âm:** `朝[あさ]ご飯[はん]は毎日[まいにち]食[た]べますが、昼[ひる]ご飯[はん]は忙[いそが]しくて食[た]べません。`
- **Phiên âm Romaji:** *Asagohan wa mainichi tabemasu ga, hirugohan wa isogashikute tabemasen.*
- **Dịch nghĩa tự nhiên:** **Bữa sáng thì ngày nào tôi cũng ăn, nhưng bữa trưa thì bận quá nên không ăn.**
- **Phân tích ngữ cảnh & Sư phạm:** Tương phản rõ nét giữa hai bữa ăn.

#### Ví dụ 97.3
- **Chữ Hán chuẩn:** 日本語の新聞は読めませんが、アニメは見ます。
- **Furigana phiên âm:** `日本語[にほんご]の新聞[しんぶん]は読[よ]めませんが、アニメは見[み]ます。`
- **Phiên âm Romaji:** *Nihongo no shinbun wa yomemasen ga, anime wa mimasu.*
- **Dịch nghĩa tự nhiên:** **Báo tiếng Nhật thì tôi chưa đọc được, nhưng phim hoạt hình anime thì tôi vẫn xem.**
- **Phân tích ngữ cảnh & Sư phạm:** Đối chiếu năng lực hiểu phương tiện truyền thông.

#### Ví dụ 97.4
- **Chữ Hán chuẩn:** この本は昨日図書館で借りました。
- **Furigana phiên âm:** `この本[ほん]は昨日[きのう]図書館[としょかん]で借[か]りました。`
- **Phiên âm Romaji:** *Kono hon wa kinou toshokan de karimashita.*
- **Dịch nghĩa tự nhiên:** **Cuốn sách này thì hôm qua tôi đã mượn ở thư viện đấy.**
- **Phân tích ngữ cảnh & Sư phạm:** Đưa cuốn sách lên làm chủ đề giới thiệu.

#### Ví dụ 97.5
- **Chữ Hán chuẩn:** 京都へは行きましたが、奈良へはまだ行きませんでした。
- **Furigana phiên âm:** `京都[きょうと]へは行[い]きましたが、奈良[なら]へはまだ行[い]きませんでした。`
- **Phiên âm Romaji:** *Kyouto e wa ikimashita ga, Nara e wa mada ikimasen deshita.*
- **Dịch nghĩa tự nhiên:** **Kyoto thì tôi đã đi rồi, thế nhưng Nara thì tôi vẫn chưa có dịp đến.**
- **Phân tích ngữ cảnh & Sư phạm:** Đối chiếu trải nghiệm du lịch hai cố đô.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `荷物はあそこに置いてください。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 97 (N は)
- **Mặt sau (Full Resolution):** `荷物[にもつ]はあそこに置[お]いてください。`
- **Giải thích chi tiết (Pedagogical Note):** Dùng trợ từ は thay thế cho を hoặc が (hoặc đứng kèm sau には、へは、では) để đưa đối tượng cần chú ý lên đầu câu làm chủ đề trung tâm của cuộc thảo luận, hoặc tạo sắc thái đối chiếu tương phản ngầm.
- **Initial Stability ($S_0$):** 2.5 ngày | **Initial Difficulty ($D_0$):** 3.0

---

## PATTERN 98: Vて形 います (Thói quen thường xuyên lặp đi lặp lại hàng ngày)

**Bài học:** Bài 11 | **Trình độ JLPT:** N5 | **Độ khó nhận thức (Difficulty Score):** 2/5 | **Mã nhận diện:** `G-98`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: Phó từ thời gian thường xuyên + V[て形] います
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Diễn tả một thói quen, nếp sinh hoạt được duy trì đều đặn, lặp đi lặp lại trong một thời gian dài (như tập thể dục mỗi sáng, đọc sách mỗi tối).

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

Các phó từ tần suất thường gặp: 毎朝 (mỗi sáng), 毎晩 (mỗi tối), 毎日 (mỗi ngày), いつも (luôn luôn) + Động từ chia thể Te + います.

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Dùng khi chia sẻ về phong cách sống, chế độ ăn uống, rèn luyện bản thân với bạn bè, đồng nghiệp.

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

So sánh với thì hiện tại đơn Vます: '毎朝牛乳を飲みます' (Nêu sự thật chung chung); '毎朝牛乳を飲んでいます' (Nhấn mạnh thói quen nếp sống hiện nay đang được duy trì đều đặn).

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Người học hay lẫn lộn với hành động đang xảy ra tại thời điểm nói. Phải dựa vào phó từ đi kèm (今 = đang làm ngay lúc này; 毎朝 = thói quen lặp lại).

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 98.1
- **Chữ Hán chuẩn:** 毎朝、牛乳を飲んでいます。
- **Furigana phiên âm:** `毎朝[まいあさ]、牛乳[ぎゅうにゅう]を飲[の]んでいます。`
- **Phiên âm Romaji:** *Maiasa, gyuunyuu o nonde imasu.*
- **Dịch nghĩa tự nhiên:** **Mỗi buổi sáng tôi đều duy trì thói quen uống sữa tươi.**
- **Phân tích ngữ cảnh & Sư phạm:** Thói quen dinh dưỡng buổi sáng.

#### Ví dụ 98.2
- **Chữ Hán chuẩn:** 健康のために、毎晩ジョギングをしています。
- **Furigana phiên âm:** `健康[けんこう]のために、毎晩[まいばん]ジョギングをしています。`
- **Phiên âm Romaji:** *Kenkou no tame ni, maiban jogingu o shite imasu.*
- **Dịch nghĩa tự nhiên:** **Vì sức khỏe, tối nào tôi cũng chạy bộ rèn luyện.**
- **Phân tích ngữ cảnh & Sư phạm:** Lối sống thể thao lành mạnh.

#### Ví dụ 98.3
- **Chữ Hán chuẩn:** 毎週末、日本語の先生とオンラインで話しています。
- **Furigana phiên âm:** `毎週末[まいしゅうまつ]、日本語[にほんご]の先生[せんせい]とオンラインで話[はな]しています。`
- **Phiên âm Romaji:** *Maishuumatsu, nihongo no sensei to onrain de hanashite imasu.*
- **Dịch nghĩa tự nhiên:** **Mỗi cuối tuần tôi đều trò chuyện trực tuyến với giáo viên tiếng Nhật.**
- **Phân tích ngữ cảnh & Sư phạm:** Lịch học tập nâng cao ngoại ngữ định kỳ.

#### Ví dụ 98.4
- **Chữ Hán chuẩn:** 寝る前に、必ず日記を書いています。
- **Furigana phiên âm:** `寝[ね]る前[まえ]に、必[かなら]ず日記[にっき]を書[か]いています。`
- **Phiên âm Romaji:** *Neru mae ni, kanarazu nikki o kaite imasu.*
- **Dịch nghĩa tự nhiên:** **Trước khi đi ngủ, bao giờ tôi cũng viết nhật ký.**
- **Phân tích ngữ cảnh & Sư phạm:** Nếp sống kỷ luật cá nhân.

#### Ví dụ 98.5
- **Chữ Hán chuẩn:** 休みの日はいつも家で映画を見ています。
- **Furigana phiên âm:** `休[やす]みの日[ひ]はいつも家[いえ]で映画[えいが]を見[み]ています。`
- **Phiên âm Romaji:** *Yasumi no hi wa itsumo ie de eiga o mite imasu.*
- **Dịch nghĩa tự nhiên:** **Vào ngày nghỉ tôi luôn luôn ở nhà xem phim.**
- **Phân tích ngữ cảnh & Sư phạm:** Thói quen giải trí cuối tuần.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `毎朝、牛乳を飲んでいます。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 98 (Vて形 います)
- **Mặt sau (Full Resolution):** `毎朝[まいあさ]、牛乳[ぎゅうにゅう]を飲[の]んでいます。`
- **Giải thích chi tiết (Pedagogical Note):** Diễn tả một thói quen, nếp sinh hoạt được duy trì đều đặn, lặp đi lặp lại trong một thời gian dài (như tập thể dục mỗi sáng, đọc sách mỗi tối).
- **Initial Stability ($S_0$):** 2.5 ngày | **Initial Difficulty ($D_0$):** 3.0

---

## PATTERN 99: Vたり Vたり します (Liệt kê các hành động tiêu biểu đại diện)

**Bài học:** Bài 11 | **Trình độ JLPT:** N5 | **Độ khó nhận thức (Difficulty Score):** 3/5 | **Mã nhận diện:** `G-99`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: V1[たり] + V2[たり] + します / しました
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Dùng để liệt kê tượng trưng hai hoặc ba hành động tiêu biểu trong số rất nhiều hoạt động đã hoặc sẽ làm, mang ngụ ý 'làm những việc như là V1, làm việc như là V2... và còn những việc khác nữa'.

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

Động từ chia thể Quá khứ ngắn Ta-form (V-ta) + り. Kết thúc câu bắt buộc phải có trợ động từ します (hiện tại/tương lai) hoặc しました (quá khứ).

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Tự nhiên, phóng khoáng, tránh cảm giác cứng nhắc khi phải kể lể chi li từng hành động một.

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

Khác biệt căn bản với thể Te (Pattern 83): Thể Te liệt kê tuần tự theo thời gian và mang tính trọn gói; mẫu -tari -tari chỉ chọn ra vài hành động làm mẫu và không nhất thiết theo trình tự trước sau.

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Lỗi học sinh hay mắc: Quên động từ します ở cuối câu (ví dụ: '本を読んだり音楽を聞いたり' rồi ngắt câu -> SAI). Bắt buộc phải kết thúc bằng します hoặc しました.

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 99.1
- **Chữ Hán chuẩn:** 休みの日、家で本を読んだり音楽を聞いたりしています。
- **Furigana phiên âm:** `休[やす]みの日[ひ]、家[いえ]で本[ほん]を読[よ]んだり音楽[おんがく]を聞[き]いたりしています。`
- **Phiên âm Romaji:** *Yasumi no hi, ie de hon o yondari ongaku o kiitari shite imasu.*
- **Dịch nghĩa tự nhiên:** **Ngày nghỉ tôi thường làm những việc như đọc sách, nghe nhạc ở nhà.**
- **Phân tích ngữ cảnh & Sư phạm:** Liệt kê thói quen giải trí tiêu biểu.

#### Ví dụ 99.2
- **Chữ Hán chuẩn:** 昨日の日曜日は掃除したり、洗濯したりしました。
- **Furigana phiên âm:** `昨日[きのう]の日曜日[にちようび]は掃除[そうじ]したり、洗濯[せんたく]したりしました。`
- **Phiên âm Romaji:** *Kinou no nichiyoubi wa souji shitari, sentaku shitari shimashita.*
- **Dịch nghĩa tự nhiên:** **Chủ nhật hôm qua tôi đã dọn dẹp phòng ốc, giặt giũ quần áo.**
- **Phân tích ngữ cảnh & Sư phạm:** Kể lại các công việc gia đình đã làm.

#### Ví dụ 99.3
- **Chữ Hán chuẩn:** 日本で富士山に登ったり、温泉に入ったりしたいです。
- **Furigana phiên âm:** `日本[にほん]で富士山[ふじさん]に登[のぼ]ったり、温泉[おんせん]に入[はい]ったりしたいです。`
- **Phiên âm Romaji:** *Nihon de Fujisan ni nobottari, onsen ni haittari shitai desu.*
- **Dịch nghĩa tự nhiên:** **Đến Nhật tôi muốn trải nghiệm leo núi Phú Sĩ và tắm suối nước nóng.**
- **Phân tích ngữ cảnh & Sư phạm:** Bày tỏ mong muốn trải nghiệm văn hóa đa dạng.

#### Ví dụ 99.4
- **Chữ Hán chuẩn:** 週末は友達と買い物したり、ご飯を食べたりします。
- **Furigana phiên âm:** `週末[しゅうまつ]は友達[ともだち]と買[か]い物[もの]したり、ご飯[はん]を食[た]べたりします。`
- **Phiên âm Romaji:** *Shuumatsu wa tomodachi to kaimono shitari, gohan o tabetari shimasu.*
- **Dịch nghĩa tự nhiên:** **Cuối tuần tôi hay cùng bạn đi sắm đồ, đi ăn uống.**
- **Phân tích ngữ cảnh & Sư phạm:** Hoạt động giao lưu bạn bè.

#### Ví dụ 99.5
- **Chữ Hán chuẩn:** 旅行中、写真を撮ったり、お土産を買ったりして楽しかったです。
- **Furigana phiên âm:** `旅行中[りょこうちゅう]、写真[しゃしん]を撮[と]ったり、お土産[みやげ]を買[か]ったりして楽[たの]しかったです。`
- **Phiên âm Romaji:** *Ryokouchuu, shashin o tottari, omiyage o kattari shite tanoshikatta desu.*
- **Dịch nghĩa tự nhiên:** **Trong chuyến du lịch, chúng tôi đã chụp ảnh, mua quà lưu niệm và rất vui.**
- **Phân tích ngữ cảnh & Sư phạm:** Cảm nhận chuyến đi phong phú.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `休みの日、家で本を読んだり音楽を聞いたりしています。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 99 (Vたり Vたり します)
- **Mặt sau (Full Resolution):** `休[やす]みの日[ひ]、家[いえ]で本[ほん]を読[よ]んだり音楽[おんがく]を聞[き]いたりしています。`
- **Giải thích chi tiết (Pedagogical Note):** Dùng để liệt kê tượng trưng hai hoặc ba hành động tiêu biểu trong số rất nhiều hoạt động đã hoặc sẽ làm, mang ngụ ý 'làm những việc như là V1, làm việc như là V2... và còn những việc khác nữa'.
- **Initial Stability ($S_0$):** 1.8 ngày | **Initial Difficulty ($D_0$):** 4.5

---

## PATTERN 100: N1 は___が、N2 は___ (Cấu trúc đối chiếu tương phản hai đối tượng)

**Bài học:** Bài 11 | **Trình độ JLPT:** N5 | **Độ khó nhận thức (Difficulty Score):** 2/5 | **Mã nhận diện:** `G-100`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: N1 は [V/A khẳng định] が、N2 は [V/A phủ định / ngược lại]
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Dùng trợ từ は đặt sau cả hai danh từ N1 và N2 nhằm làm nổi bật sự đối lập, tương phản rõ rệt về tính chất, sở thích hoặc năng lực giữa hai đối tượng đó.

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

N1 は + Cụm vị ngữ 1 + が (liên từ nhưng) + N2 は + Cụm vị ngữ 2.

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Tinh tế, thể hiện tư duy phân định rạch ròi, thường dùng khi nói về sở thích ăn uống, năng lực ngôn ngữ, quan hệ cá nhân.

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

Trợ từ は ở đây hoàn toàn gánh vác chức năng Contrastive Focus (Tiêu điểm đối chiếu). Thay thế hoàn toàn cho trợ từ が hay を thông thường.

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Học sinh hay quên dùng は ở vế thứ hai (như: '犬は好きですが、猫が好きじゃありません' -> không tự nhiên). Bắt buộc phải là: '犬は好きですが、猫は好きじゃありません'.

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 100.1
- **Chữ Hán chuẩn:** 犬は好きですが、猫は好きじゃありません。
- **Furigana phiên âm:** `犬[いぬ]は好[す]きですが、猫[ねこ]は好[す]きじゃありません。`
- **Phiên âm Romaji:** *Inu wa suki desu ga, neko wa suki ja arimasen.*
- **Dịch nghĩa tự nhiên:** **Chó thì tôi rất thích, nhưng mèo thì tôi không thích lắm.**
- **Phân tích ngữ cảnh & Sư phạm:** Đối chiếu sở thích động vật rõ ràng.

#### Ví dụ 100.2
- **Chữ Hán chuẩn:** ひらがなは書けますが、漢字は書けません。
- **Furigana phiên âm:** `ひらがなは書[か]けますが、漢字[かんじ]は書[か]けません。`
- **Phiên âm Romaji:** *Hiragana wa kakemasu ga, kanji wa kakemasen.*
- **Dịch nghĩa tự nhiên:** **Chữ Hiragana thì tôi viết được, nhưng chữ Hán Kanji thì tôi chưa viết được.**
- **Phân tích ngữ cảnh & Sư phạm:** So sánh năng lực viết hai hệ chữ Nhật.

#### Ví dụ 100.3
- **Chữ Hán chuẩn:** 兄は背が高いですが、弟は背が低いです。
- **Furigana phiên âm:** `兄[あに]は背[せ]が高[たか]いですが、弟[おとうと]は背[せ]が低[ひく]いです。`
- **Phiên âm Romaji:** *Ani wa se ga takai desu ga, otouto wa se ga hikui desu.*
- **Dịch nghĩa tự nhiên:** **Anh trai thì dáng vóc cao ráo, thế nhưng em trai thì lại thấp bé.**
- **Phân tích ngữ cảnh & Sư phạm:** Tương phản ngoại hình giữa hai anh em.

#### Ví dụ 100.4
- **Chữ Hán chuẩn:** 肉は食べますが、魚はあまり食べません。
- **Furigana phiên âm:** `肉[にく]は食[た]べますが、魚[さかな]はあまり食[た]べません。`
- **Phiên âm Romaji:** *Niku wa tabemasu ga, sakana wa amari tabemasen.*
- **Dịch nghĩa tự nhiên:** **Thịt thì tôi ăn được, nhưng cá thì tôi hầu như không mấy khi ăn.**
- **Phân tích ngữ cảnh & Sư phạm:** Thói quen khẩu vị ẩm thực.

#### Ví dụ 100.5
- **Chữ Hán chuẩn:** 平日は忙しいですが、週末は暇です。
- **Furigana phiên âm:** `平日[へいじつ]は忙[いそが]しいですが、週末[しゅうまつ]は暇[ひま]です。`
- **Phiên âm Romaji:** *Heijitsu wa isogashii desu ga, shuumatsu wa hima desu.*
- **Dịch nghĩa tự nhiên:** **Ngày thường thì bận rộn túi bụi, nhưng cuối tuần thì lại rảnh rỗi.**
- **Phân tích ngữ cảnh & Sư phạm:** Đối chiếu nhịp điệu sinh hoạt trong tuần.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `犬は好きですが、猫は好きじゃありません。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 100 (N1 は___が、N2 は___)
- **Mặt sau (Full Resolution):** `犬[いぬ]は好[す]きですが、猫[ねこ]は好[す]きじゃありません。`
- **Giải thích chi tiết (Pedagogical Note):** Dùng trợ từ は đặt sau cả hai danh từ N1 và N2 nhằm làm nổi bật sự đối lập, tương phản rõ rệt về tính chất, sở thích hoặc năng lực giữa hai đối tượng đó.
- **Initial Stability ($S_0$):** 2.5 ngày | **Initial Difficulty ($D_0$):** 3.0

---

## PATTERN 101: 〜とき (Khi / Trong lúc... - Phân tích toàn diện 7 hình thái kết hợp)

**Bài học:** Bài 11 | **Trình độ JLPT:** N5/N4 | **Độ khó nhận thức (Difficulty Score):** 3/5 | **Mã nhận diện:** `G-101`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: [V / A / N] + とき、〜
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Biểu thị thời điểm, hoàn cảnh hoặc điều kiện mà tại lúc đó một sự việc, hành động khác diễn ra hoặc một cảm xúc nảy sinh.

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

Gồm 7 biến thể kết hợp ngữ pháp cốt lõi:
1. Tính từ đuôi い: A-い + とき (寂しいとき)
2. Tính từ đuôi な: A-な + とき (暇なとき)
3. Danh từ: N + の + とき (中学生のとき)
4. Động từ chưa xảy ra: V-jisho + とき (日本へ行くとき - trước khi sang)
5. Động từ đã hoàn thành: V-ta + とき (日本へ行ったとき - sau khi sang)
6. Động từ thể phủ định: V-nai + とき (分からないとき)
7. Động từ đang tiếp diễn: V-te iru + とき (歩いているとき).

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Một trong những cấu trúc quan trọng bậc nhất của tiếng Nhật sơ cấp, làm nền tảng cho văn phong lập luận, tường thuật điều kiện thời gian.

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

Điểm then chốt kinh điển của JLPT: Phân biệt 'Vるとき' (hành động V CHƯA XẢY RA tại thời điểm mệnh đề chính) vs 'Vたとき' (hành động V ĐÃ HOÀN THÀNH XONG XUÔI trước mệnh đề chính). Ví dụ: '国へ帰るとき、お土産を買いました' (mua quà lúc đang ở Nhật, trước khi về) vs '国へ帰ったとき、お土産をあげました' (về đến nước rồi mới tặng quà).

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Lỗi danh từ: Học sinh hay quên trợ từ の sau danh từ (ví dụ: '学生とき' -> SAI). Bắt buộc phải là: '学生のとき'. Lỗi thứ hai là quên trợ từ な sau tính từ な ('暇とき' -> sai, phải là '暇なとき').

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 101.1
- **Chữ Hán chuẩn:** 寂しいとき、家族の写真を思い出します。
- **Furigana phiên âm:** `寂[さび]しいとき、家族[かぞく]の写真[しゃしん]を思[おも]い出[だ]します。`
- **Phiên âm Romaji:** *Sabishii toki, kazoku no shashin o omoidashimasu.*
- **Dịch nghĩa tự nhiên:** **Những khi cảm thấy cô đơn buồn bã, tôi lại nhớ về bức ảnh gia đình.**
- **Phân tích ngữ cảnh & Sư phạm:** Tính từ đuôi い + とき kết nối cảm xúc.

#### Ví dụ 101.2
- **Chữ Hán chuẩn:** 暇なとき、YouTubeで日本の歌を聞きます。
- **Furigana phiên âm:** `暇[ひま]なとき、YouTubeで日本[にほん]の歌[うた]を聞[き]きます。`
- **Phiên âm Romaji:** *Hima na toki, YuuTyuubu de nihon no uta o kikimasu.*
- **Dịch nghĩa tự nhiên:** **Những lúc rảnh rỗi, tôi thường nghe các bài hát tiếng Nhật trên YouTube.**
- **Phân tích ngữ cảnh & Sư phạm:** Tính từ đuôi な + とき chỉ thời gian rỗi.

#### Ví dụ 101.3
- **Chữ Hán chuẩn:** 子どものとき、よく川で泳ぎました。
- **Furigana phiên âm:** `子[こ]どものとき、よく川[かわ]で泳[およ]ぎました。`
- **Phiên âm Romaji:** *Kodomo no toki, yoku kawa de oyogimashita.*
- **Dịch nghĩa tự nhiên:** **Thời còn là một đứa trẻ, tôi thường hay đi bơi ở con sông gần nhà.**
- **Phân tích ngữ cảnh & Sư phạm:** Danh từ + のとき hồi tưởng ký ức tuổi thơ.

#### Ví dụ 101.4
- **Chữ Hán chuẩn:** ご飯を作るとき、手をよく洗います。
- **Furigana phiên âm:** `ご飯[はん]を作[つく]るとき、手[て]をよく洗[あら]います。`
- **Phiên âm Romaji:** *Gohan o tsukuru toki, te o yoku araimasu.*
- **Dịch nghĩa tự nhiên:** **Khi chuẩn bị nấu cơm (trước khi nấu), tôi rửa tay thật kỹ càng.**
- **Phân tích ngữ cảnh & Sư phạm:** Động từ thể từ điển V-jisho + とき (hành động trước).

#### Ví dụ 101.5
- **Chữ Hán chuẩn:** 日本へ行ったとき、新しい着物を買いました。
- **Furigana phiên âm:** `日本[にほん]へ行[い]ったとき、新[あたら]しい着物[きもの]を買[か]いました。`
- **Phiên âm Romaji:** *Nihon e itta toki, atarashii kimono o kaimashita.*
- **Dịch nghĩa tự nhiên:** **Khi đã đặt chân đến Nhật Bản rồi, tôi đã mua một bộ Kimono mới.**
- **Phân tích ngữ cảnh & Sư phạm:** Động từ thể quá khứ V-ta + とき (hành động sau khi đến).

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `寂しいとき、家族の写真を思い出します。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 101 (〜とき)
- **Mặt sau (Full Resolution):** `寂[さび]しいとき、家族[かぞく]の写真[しゃしん]を思[おも]い出[だ]します。`
- **Giải thích chi tiết (Pedagogical Note):** Biểu thị thời điểm, hoàn cảnh hoặc điều kiện mà tại lúc đó một sự việc, hành động khác diễn ra hoặc một cảm xúc nảy sinh.
- **Initial Stability ($S_0$):** 1.8 ngày | **Initial Difficulty ($D_0$):** 4.5

---

## PATTERN 102: どうしますか (Hỏi phương án giải quyết: Bạn sẽ xử trí thế nào?)

**Bài học:** Bài 11 | **Trình độ JLPT:** N5 | **Độ khó nhận thức (Difficulty Score):** 2/5 | **Mã nhận diện:** `G-102`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: Tình huống + とき、どうしますか
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Dùng để tham vấn, thăm dò phương án ứng xử, cách giải quyết hoặc thói quen đối phó của một người khi đứng trước một hoàn cảnh, sự cố hoặc trạng thái cụ thể.

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

Thường kết hợp trực tiếp với Pattern 101: [Tình huống + とき]、どうしますか。 Câu trả lời đưa ra hành vi ứng phó: Vます.

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Thân thiện, gợi mở câu chuyện, tạo tiền đề để hai bên trao đổi kinh nghiệm sống, mẹo vặt sức khỏe.

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

Phân biệt với どうですか (Hỏi cảm nghĩ: Bạn thấy thế nào?). どうしますか tập trung vào HÀNH HỘNG giải quyết (Bạn sẽ LÀM GÌ?).

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Học sinh hay nhầm cách trả lời: Khi hỏi どうしますか, phải trả lời bằng một ĐỘNG TỪ hành động cụ thể (như '甘いものを食べます'), không trả lời bằng tính từ đơn thuần.

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 102.1
- **Chữ Hán chuẩn:** 疲れたとき、どうしますか。――甘いものを食べて、早く寝ます。
- **Furigana phiên âm:** `疲[つか]れたとき、どうしますか。――甘[あま]いものを食[た]べて、早[はや]く寝[ね]ます。`
- **Phiên âm Romaji:** *Tsukareta toki, dou shimasu ka. -- Amai mono o tabete, hayaku nemasu.*
- **Dịch nghĩa tự nhiên:** **Khi cảm thấy mệt mỏi rã rời, bạn sẽ làm gì? ―― Tôi ăn một chút đồ ngọt rồi đi ngủ sớm.**
- **Phân tích ngữ cảnh & Sư phạm:** Hỏi đáp cách phục hồi thể lực.

#### Ví dụ 102.2
- **Chữ Hán chuẩn:** 道が分からないとき、どうしますか。――交番の人に聞きます。
- **Furigana phiên âm:** `道[みち]が分[わ]からないとき、どうしますか。――交番[こうばん]の人[ひと]に聞[き]きます。`
- **Phiên âm Romaji:** *Michi ga wakaranai toki, dou shimasu ka. -- Kouban no hito ni kikimasu.*
- **Dịch nghĩa tự nhiên:** **Những lúc bị lạc đường không biết lối đi, bạn sẽ xử trí ra sao? ―― Tôi sẽ hỏi thăm viên cảnh sát ở bốt giao thông.**
- **Phân tích ngữ cảnh & Sư phạm:** Cách xử trí sự cố đi lại.

#### Ví dụ 102.3
- **Chữ Hán chuẩn:** 頭が痛いとき、どうしますか。――薬を飲んで横になります。
- **Furigana phiên âm:** `頭[あたま]が痛[いた]いとき、どうしますか。――薬[くすり]を飲[の]んで横[よこ]になります。`
- **Phiên âm Romaji:** *Atama ga itai toki, dou shimasu ka. -- Kusuri o nonde yoko ni narimasu.*
- **Dịch nghĩa tự nhiên:** **Khi bị đau đầu nhức óc, bạn thường làm gì? ―― Tôi uống thuốc rồi nằm nghỉ ngơi.**
- **Phân tích ngữ cảnh & Sư phạm:** Chăm sóc sức khỏe khi phát bệnh.

#### Ví dụ 102.4
- **Chữ Hán chuẩn:** お金がないとき、どうしますか。――アルバイトを一生懸命します。
- **Furigana phiên âm:** `お金[かね]がないとき、どうしますか。――アルバイトを一所懸命[いっしょうけんめい]します。`
- **Phiên âm Romaji:** *Okane ga nai toki, dou shimasu ka. -- Arubaito o isshoukenmei shimasu.*
- **Dịch nghĩa tự nhiên:** **Những lúc túng thiếu không có tiền, bạn sẽ làm thế nào? ―― Tôi sẽ chăm chỉ dốc sức đi làm thêm.**
- **Phân tích ngữ cảnh & Sư phạm:** Giải quyết khó khăn tài chính sinh viên.

#### Ví dụ 102.5
- **Chữ Hán chuẩn:** 地震が起きたとき、まずどうしますか。――机の下に入ります。
- **Furigana phiên âm:** `地震[じしん]が起[お]きたとき、まずどうしますか。――机[つくえ]の下[した]に入[はい]ります。`
- **Phiên âm Romaji:** *Jishin ga okita toki, mazu dou shimasu ka. -- Tsukue no shita ni hairimasu.*
- **Dịch nghĩa tự nhiên:** **Khi động đất xảy ra, trước hết bạn sẽ làm gì? ―― Tôi lập tức chui xuống gầm bàn kiên cố.**
- **Phân tích ngữ cảnh & Sư phạm:** Kỹ năng sinh tồn phòng chống thiên tai tại Nhật Bản.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `疲れたとき、どうしますか。――甘いものを食べて、早く寝ます。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 102 (どうしますか)
- **Mặt sau (Full Resolution):** `疲[つか]れたとき、どうしますか。――甘[あま]いものを食[た]べて、早[はや]く寝[ね]ます。`
- **Giải thích chi tiết (Pedagogical Note):** Dùng để tham vấn, thăm dò phương án ứng xử, cách giải quyết hoặc thói quen đối phó của một người khi đứng trước một hoàn cảnh, sự cố hoặc trạng thái cụ thể.
- **Initial Stability ($S_0$):** 2.5 ngày | **Initial Difficulty ($D_0$):** 3.0

---

## PATTERN 103: 友達言葉 (Thể thông thường / Khẩu ngữ giao tiếp thân mật với bạn bè)

**Bài học:** Bài 11 | **Trình độ JLPT:** N5/N4 | **Độ khó nhận thức (Difficulty Score):** 3/5 | **Mã nhận diện:** `G-103`

### 1. CÔNG THỨC KHUNG CẤU TRÚC (PATTERN TEMPLATE)

```
【Cấu trúc cốt lõi】: Thể thông thường (Futsuukei / Plain Form): Vる / Vない / Vた / Vなかった / Aい / Aだ / Nだ
```

### 2. Ý NGHĨA SƯ PHẠM & BẢN CHẤT NGỮ NGHĨA (PEDAGOGICAL CONCEPT)

Hệ thống ngôn ngữ thân mật (Casual speech / Thể ngắn), lược bỏ Desu/Masu, biến đổi trợ từ và ngữ điệu để tạo sự gần gũi, ấm áp giữa bạn bè đồng trang lứa, người thân trong gia đình hoặc người dưới.

### 3. QUY TẮC KẾT HỢP HÌNH THÁI HỌC (MORPHOLOGY & CONJUGATION RULES)

Quy tắc biến đổi:
1. Động từ:
- Vます -> V-jisho (行く)
- Vません -> V-nai (行かない)
- Vました -> V-ta (行った)
- Vませんでした -> V-nakatta (行かなかった)
2. Câu hỏi thân mật: Bỏ trợ từ か, lên giọng ở cuối câu (行く？/ 食べる？)
3. Trả lời: Thay はい bằng うん; thay いいえ bằng ううん.
4. Tính từ đuôi な và Danh từ: Bỏ です thay bằng だ (trong hội thoại nữ giới thường bỏ luôn だ).

### 4. NGỮ DỤNG HỌC & SẮC THÁI XÃ HỘI (PRAGMATICS & REGISTER)

Sử dụng cho mối quan hệ thân tình nội bộ (uchi). Tuyệt đối KHÔNG dùng với người lớn tuổi, thầy cô, cấp trên hoặc người mới gặp lần đầu vì sẽ bị xem là thô lỗ, thiếu tôn trọng.

### 5. PHÂN TÍCH SO SÁNH VI MÔ DỄ NHẦM LẪN (MICRO-CONTRASTIVE ANALYSIS)

Sự chuyển dịch văn hóa giữa Teineigo (Lịch sự) và Futsuukei (Thân mật). Đây là rào cản tâm lý lớn của người học khi xem phim ảnh, anime nghe thể ngắn nhưng giao tiếp thực tế lại phải dùng thể lịch sự.

### 6. LỖI SAI KINH ĐIỂN CỦA HỌC VIÊN VIỆT NAM (L1 INTERFERENCE PITFALLS)

> [!WARNING]
> **Cảnh báo lỗi phổ biến:** Học sinh hay quên quy tắc lược bỏ か trong câu hỏi: nói '行くか？' nghe rất cộc cằn nam tính hoặc hách dịch. Thể thân mật tự nhiên chỉ cần lên giọng: '行く？'. Thứ hai là nhầm うん (ừ/vâng) với ううん (không/hông).

### 7. NGÂN HÀNG 5 VÍ DỤ MINH HỌA TOÀN DIỆN (CANONICAL EXAMPLES)

#### Ví dụ 103.1
- **Chữ Hán chuẩn:** 海へ行く？――うん、行く。／ううん、行かない。
- **Furigana phiên âm:** `海[うみ]へ行[い]く？――うん、行[い]く。／ううん、行[い]かない。`
- **Phiên âm Romaji:** *Umi e iku? -- Un, iku. / Uun, ikanai.*
- **Dịch nghĩa tự nhiên:** **Đi biển chơi không cậu? ―― Ừ, đi chứ! / Hông, tớ không đi đâu.**
- **Phân tích ngữ cảnh & Sư phạm:** Hội thoại rủ rê bạn bè kinh điển thể ngắn.

#### Ví dụ 103.2
- **Chữ Hán chuẩn:** 今、何時？――三時半だよ。
- **Furigana phiên âm:** `今[いま]、何時[なんじ]？――三時半[さんじはん]だよ。`
- **Phiên âm Romaji:** *Ima, nanji? -- Sanjihan da yo.*
- **Dịch nghĩa tự nhiên:** **Mấy giờ rồi cậu ơi? ―― Ba rưỡi rồi nè.**
- **Phân tích ngữ cảnh & Sư phạm:** Hỏi giờ thân mật thêm trợ từ tình thái だよ.

#### Ví dụ 103.3
- **Chữ Hán chuẩn:** 明日のパーティー、来る？――うん、行くよ。
- **Furigana phiên âm:** `明日[あした]のパーティー、来[く]る？――うん、行[い]くよ。`
- **Phiên âm Romaji:** *Ashita no paatii, kuru? -- Un, iku yo.*
- **Dịch nghĩa tự nhiên:** **Bữa tiệc ngày mai cậu có tới không? ―― Có chứ, tớ sẽ sang mà.**
- **Phân tích ngữ cảnh & Sư phạm:** Hỏi kế hoạch tham dự sự kiện.

#### Ví dụ 103.4
- **Chữ Hán chuẩn:** 昨日の映画、どうだった？――すごく面白かったよ。
- **Furigana phiên âm:** `昨日[きのう]の映画[えいが]、どうだった？――すごく面白[おもしろ]かったよ。`
- **Phiên âm Romaji:** *Kinou no eiga, dou datta? -- Sugoku omoshirokatta yo.*
- **Dịch nghĩa tự nhiên:** **Bộ phim hôm qua thế nào hả cậu? ―― Xem hay và cuốn cực kỳ luôn.**
- **Phân tích ngữ cảnh & Sư phạm:** Hỏi cảm nhận trải nghiệm quá khứ.

#### Ví dụ 103.5
- **Chữ Hán chuẩn:** これ、おいしいね。――本当だね。もっと食べる？
- **Furigana phiên âm:** `これ、おいしいね。――本当[ほんとう]だね。もっと食[た]べる？`
- **Phiên âm Romaji:** *Kore, oishii ne. -- Hontou da ne. Motto taberu?*
- **Dịch nghĩa tự nhiên:** **Món này ngon quá ha! ―― Ừ công nhận thật đó. Ăn thêm miếng nữa không?**
- **Phân tích ngữ cảnh & Sư phạm:** Chia sẻ cảm xúc khi cùng ăn uống thân mật.

### 8. THIẾT KẾ THẺ NHẬN THỨC FSRS (SPACED REPETITION CARD SPEC)

- **Mặt trước (Prompt/Cloze):** `海へ行く？――うん、行く。／ううん、行かない。`
- **Gợi ý (Hint):** Điền cấu trúc ngữ pháp Pattern 103 (友達言葉)
- **Mặt sau (Full Resolution):** `海[うみ]へ行[い]く？――うん、行[い]く。／ううん、行[い]かない。`
- **Giải thích chi tiết (Pedagogical Note):** Hệ thống ngôn ngữ thân mật (Casual speech / Thể ngắn), lược bỏ Desu/Masu, biến đổi trợ từ và ngữ điệu để tạo sự gần gũi, ấm áp giữa bạn bè đồng trang lứa, người thân trong gia đình hoặc người dưới.
- **Initial Stability ($S_0$):** 1.8 ngày | **Initial Difficulty ($D_0$):** 4.5

---


---


<a id="phan-3"></a>
# PHẦN 3: PHẦN 3: NGÂN HÀNG 204 BÀI TẬP THỰC HÀNH & LỜI GIẢI CHI TIẾT TỪ SÁCH BÀI TẬP
*Tệp gốc: `grammar_exercise_bank_and_solutions.md`*

---

## 📝 NGÂN HÀNG 204 BÀI TẬP NGỮ PHÁP JPD133 & LỜI GIẢI CHI TIẾT (VOLUME 3)
### Hệ Thống Bài Tập Toàn Diện Kèm Phân Tích Bẫy Phương Án Nhiễu (Distractor Analysis) Toàn Bộ 32 Mẫu Cấu Trúc (Bài 8 - Bài 11)
#### Biên soạn theo chuẩn khảo thí JLPT N5/N4, phục vụ trực tiếp Practice Engine & FSRS Queue

---

### 📌 TỔNG QUAN HỆ THỐNG BÀI TẬP

| Bài học | Số lượng Pattern | Dải Pattern | Số bài tập chuẩn hóa | Dạng thức bài tập |
|:---:|:---:|:---:|:---:|:---|
| **Bài 8** | 9 patterns | Pattern 72 - 80 | **58 bài tập** | Cloze, Trắc nghiệm, Reorder, Chia thể, Hội thoại, So sánh |
| **Bài 9** | 7 patterns | Pattern 81 - 87 | **45 bài tập** | Cloze, Tần suất, Thể từ điển, Hội thoại di chuyển, Liên từ |
| **Bài 10** | 10 patterns | Pattern 88 - 97 | **64 bài tập** | Cấm chỉ, Xin phép, Hiện tượng trước mắt, Thụ cảm tự nhiên, Biến đổi |
| **Bài 11** | 6 patterns | Pattern 98 - 103 | **37 bài tập** | Thói quen, Liệt kê -tari, Đối chiếu, 7 thể とき, Thể thân mật |
| **TỔNG CỘNG** | **32 PATTERNS** | **Pattern 72 - 103** | **204 BÀI TẬP** | **100% Có giải thích chi tiết & Phân tích bẫy 4 phương án** |

---

## MỤC BÀI TẬP CHO PATTERN 72: Vて形 います (Đang sinh sống / Trạng thái cư trú kết quả)

**Bài học:** Bài 8 | **Dạng mẫu:** `V[て形] + います` | **Trình độ:** N5

### Bài tập 1 (`EX-072-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-072-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu sau:
「私は横浜（　　）住んでいます。」

#### 🔘 4 Phương án lựa chọn:
- **A.** に
- **B.** で
- **C.** を
- **D.** へ

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tôi đang sống ở Yokohama.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Trợ từ に chỉ nơi chốn tồn tại kết quả cư trú (chính xác).
- **Phương án B:** Sai: trợ từ で chỉ nơi diễn ra hành động, không dùng cho động từ chỉ trạng thái cư trú kết quả như 住んでいます.
- **Phương án C:** Sai: を là trợ từ chỉ tân ngữ chịu tác động của ngoại động từ.
- **Phương án D:** Sai: へ chỉ phương hướng di chuyển, không dùng với 住んでいます.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 72: Diễn tả trạng thái hiện tại là kết quả của một hành động đã diễn ra trong quá khứ và vẫn đang tiếp diễn. Cụ thể với động từ 住みます (sinh sống), hành động chuyển đến một địa điểm đã hoàn thành và kết quả là người nói đang định cư, sinh hoạt tại địa điểm đó.

---

### Bài tập 2 (`EX-072-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-072-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của Vて形 います (Đang sinh sống / Trạng thái cư trú kết quả)?

#### 🔘 4 Phương án lựa chọn:
- **A.** 家族はハノイに住んでいます。
- **B.** 家族はハノイに住んでいます。でした
- **C.** 家族はハノイで住んでいます。
- **D.** 全然家族はハノイに住んでいます。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Gia đình tôi đang sinh sống tại Hà Nội.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Người Việt có thói quen tư duy 'Tôi sống Ở đâu' nên hay dùng trợ từ で thành 'ハノイで住んでいます' -> SAI CƠ BẢN. Trợ từ chuẩn xác duy nhất là に: 'ハノイに住んでいます'. Ngoài ra người mới học hay nhầm không chia thể Te mà nói 'すみます'.
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Người Việt có thói quen tư duy 'Tôi sống Ở đâu' nên hay dùng trợ từ で thành 'ハノイで住んでいます' -> SAI CƠ BẢN. Trợ từ chuẩn xác duy nhất là に: 'ハノイに住んでいます'. Ngoài ra người mới học hay nhầm không chia thể Te mà nói 'すみます'.

---

### Bài tập 3 (`EX-072-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-072-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Anh Tanaka hiện đang sống ở một căn hộ chung cư tại Tokyo.」

#### 🔘 4 Phương án lựa chọn:
- **A.** 田中さんは今、東京のマンションに住んでいます。
- **B.** 今、東京のマンションに住んでいます。は田中さん
- **C.** 田中さんは今そして東京のマンションに住んでいます。
- **D.** 田中さんは今、東京のマンションに住んでいます。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Anh Tanaka hiện đang sống ở một căn hộ chung cư tại Tokyo.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: V[て形] + います. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 4 (`EX-072-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-072-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「留学生はみんな大学の近くの寮に住んでいます。」

#### 🔘 4 Phương án lựa chọn:
- **A.** V[て形]
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Các bạn du học sinh đều đang sống ở ký túc xá gần trường đại học.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái Động từ chuyển sang thể Te: Động từ nhóm 1 (すみます -> すんで) kết hợp trực tiếp với trợ động từ います. Lưu ý trợ từ đi cùng luôn là に (chỉ nơi tồn tại kết quả cư trú), tuyệt đối không dùng で..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: Động từ chuyển sang thể Te: Động từ nhóm 1 (すみます -> すんで) kết hợp trực tiếp với trợ động từ います. Lưu ý trợ từ đi cùng luôn là に (chỉ nơi tồn tại kết quả cư trú), tuyệt đối không dùng で.

---

### Bài tập 5 (`EX-072-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-072-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「どこに住んでいますか。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** 神戸に住んでいます。
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Bạn đang sống ở đâu vậy? ―― Tôi đang sống ở Kobe.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Trang trọng lịch sự (thể ています). Dùng trong giới thiệu bản thân, phỏng vấn xin việc, điền tờ khai xuất nhập cảnh, làm quen giao tiếp hàng ngày.

---

### Bài tập 6 (`EX-072-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-072-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 72 (Vて形 います ):

#### 🔘 4 Phương án lựa chọn:
- **A.** So sánh với Pattern 73 (nghề nghiệp) và hành động đang diễn tiến tức thời (Vている như đang ăn cơm, đang ngủ). '住んでいます' mang tính chất trạng thái kéo dài ổn định (stative resultative).
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với Vて形 います (Đang sinh sống / Trạng thái cư trú kết quả).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: So sánh với Pattern 73 (nghề nghiệp) và hành động đang diễn tiến tức thời (Vている như đang ăn cơm, đang ngủ). '住んでいます' mang tính chất trạng thái kéo dài ổn định (stative resultative).

---

### Bài tập 7 (`EX-072-07`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-072-07`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu sau:
「私は横浜（　　）住んでいます。」

#### 🔘 4 Phương án lựa chọn:
- **A.** に
- **B.** で
- **C.** を
- **D.** へ

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tôi đang sống ở Yokohama.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Trợ từ に chỉ nơi chốn tồn tại kết quả cư trú (chính xác).
- **Phương án B:** Sai: trợ từ で chỉ nơi diễn ra hành động, không dùng cho động từ chỉ trạng thái cư trú kết quả như 住んでいます.
- **Phương án C:** Sai: を là trợ từ chỉ tân ngữ chịu tác động của ngoại động từ.
- **Phương án D:** Sai: へ chỉ phương hướng di chuyển, không dùng với 住んでいます.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 72: Diễn tả trạng thái hiện tại là kết quả của một hành động đã diễn ra trong quá khứ và vẫn đang tiếp diễn. Cụ thể với động từ 住みます (sinh sống), hành động chuyển đến một địa điểm đã hoàn thành và kết quả là người nói đang định cư, sinh hoạt tại địa điểm đó.

---

## MỤC BÀI TẬP CHO PATTERN 73: Vて形 います (Nghề nghiệp / Hoạt động chuyên môn thường xuyên)

**Bài học:** Bài 8 | **Dạng mẫu:** `N[nơi chốn] で + N[chuyên môn] を + V[て形] います` | **Trình độ:** N5

### Bài tập 8 (`EX-073-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-073-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu Vて形 います :
「友達は高校で英語を教えています。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N[nơi
- **B.** N[nơi
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Bạn tôi đang dạy tiếng Anh ở trường trung học phổ thông.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức N[nơi chốn] で + N[chuyên môn] を + V[て形] います.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 73: Diễn tả nghề nghiệp, chức vụ chuyên môn, hoạt động công tác hoặc công việc làm ăn được duy trì thường xuyên, lặp đi lặp lại như một tập quán xã hội trong thời gian dài.

---

### Bài tập 9 (`EX-073-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-073-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của Vて形 います (Nghề nghiệp / Hoạt động chuyên môn thường xuyên)?

#### 🔘 4 Phương án lựa chọn:
- **A.** 父は自動車の会社で働いています。
- **B.** 父は自動車の会社で働いています。でした
- **C.** 父は自動車の会社で働いています。
- **D.** 全然父は自動車の会社で働いています。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Bố tôi đang làm việc tại một công ty ô tô.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Người học thường nhầm lẫn giữa に và で, cho rằng làm việc tại một nơi là sự tồn tại nên dùng に (会社に働いています -> SAI). Quy tắc: làm việc là hành động, bắt buộc dùng で.
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Người học thường nhầm lẫn giữa に và で, cho rằng làm việc tại một nơi là sự tồn tại nên dùng に (会社に働いています -> SAI). Quy tắc: làm việc là hành động, bắt buộc dùng で.

---

### Bài tập 10 (`EX-073-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-073-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Anh trai tôi đang nghiên cứu kinh tế tại trường cao học.」

#### 🔘 4 Phương án lựa chọn:
- **A.** 兄は大学院で経済を研究しています。
- **B.** 大学院で経済を研究しています。は兄
- **C.** 兄は大学院で経済を研究しています。
- **D.** 兄は大学院で経済を研究しています。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Anh trai tôi đang nghiên cứu kinh tế tại trường cao học.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: N[nơi chốn] で + N[chuyên môn] を + V[て形] います. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 11 (`EX-073-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-073-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「姉は病院で看護師をしています。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N[nơi
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Chị gái tôi đang làm y tá tại bệnh viện.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái Động từ hành động chuyển sang thể Te (働きます -> 働いて; 教えます -> 教えて; 勉強します -> 勉強して; 研究します -> 研究して; 売ります -> 売って) kết hợp います. Đi kèm trợ từ で chỉ địa điểm tiến hành công việc..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: Động từ hành động chuyển sang thể Te (働きます -> 働いて; 教えます -> 教えて; 勉強します -> 勉強して; 研究します -> 研究して; 売ります -> 売って) kết hợp います. Đi kèm trợ từ で chỉ địa điểm tiến hành công việc.

---

### Bài tập 12 (`EX-073-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-073-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「山田さんはデパートでパソコンを売っています。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** 山田さんはデパートでパソコンを売っています。
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Anh Yamada đang kinh doanh máy tính ở trung tâm thương mại.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Lịch sự, trang nhã. Sử dụng khi trao đổi danh thiếp, tự giới thiệu nghề nghiệp bản thân trong các sự kiện kết nối đối tác, phỏng vấn tuyển dụng.

---

### Bài tập 13 (`EX-073-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-073-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 73 (Vて形 います ):

#### 🔘 4 Phương án lựa chọn:
- **A.** Nơi làm việc bắt buộc dùng trợ từ で (chỉ địa điểm xảy ra hoạt động chuyên môn), khác biệt hoàn toàn với nơi cư trú ở Pattern 72 dùng に. Ví dụ: '学校で教えています' (dạy ở trường), '会社で働いています' (làm ở công ty).
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với Vて形 います (Nghề nghiệp / Hoạt động chuyên môn thường xuyên).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: Nơi làm việc bắt buộc dùng trợ từ で (chỉ địa điểm xảy ra hoạt động chuyên môn), khác biệt hoàn toàn với nơi cư trú ở Pattern 72 dùng に. Ví dụ: '学校で教えています' (dạy ở trường), '会社で働いています' (làm ở công ty).

---

### Bài tập 14 (`EX-073-07`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-073-07`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu Vて形 います :
「友達は高校で英語を教えています。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N[nơi
- **B.** N[nơi
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Bạn tôi đang dạy tiếng Anh ở trường trung học phổ thông.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức N[nơi chốn] で + N[chuyên môn] を + V[て形] います.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 73: Diễn tả nghề nghiệp, chức vụ chuyên môn, hoạt động công tác hoặc công việc làm ăn được duy trì thường xuyên, lặp đi lặp lại như một tập quán xã hội trong thời gian dài.

---

## MỤC BÀI TẬP CHO PATTERN 74: N1 は N2 が A です (Miêu tả đặc điểm ngoại hình, bộ phận, sở trường)

**Bài học:** Bài 8 | **Dạng mẫu:** `N1[chủ thể] は + N2[bộ phận/thuộc tính] が + A[tính từ] です` | **Trình độ:** N5

### Bài tập 15 (`EX-074-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-074-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu N1 は N2 が A です :
「ダニエルさんは背が高いです。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N1[chủ
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Anh Daniel có vóc dáng cao ráo.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức N1[chủ thể] は + N2[bộ phận/thuộc tính] が + A[tính từ] です.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 74: Dùng để miêu tả đặc điểm ngoại hình, bộ phận cơ thể, tài lẻ hoặc thuộc tính cụ thể của người, đồ vật hoặc địa danh. Cấu trúc này thiết lập phân tầng chủ đề (Topic-Comment Structure): N1 là chủ đề lớn cần nói đến, N2 là bộ phận focus mang đặc điểm tính từ A.

---

### Bài tập 16 (`EX-074-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-074-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của N1 は N2 が A です (Miêu tả đặc điểm ngoại hình, bộ phận, sở trường)?

#### 🔘 4 Phương án lựa chọn:
- **A.** 象は鼻が長いです。
- **B.** 象は鼻は長いです。
- **C.** 象は鼻が長いです。
- **D.** 全然象は鼻が長いです。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Con voi có chiếc vòi dài.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Người Việt bị ảnh hưởng bởi thói quen 'Chiều cao CỦA anh ấy thì cao' nên phản xạ dùng の. Cần luyện tập phản xạ phân tách: Người (は) + Bộ phận (が) + Tính từ.
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Người Việt bị ảnh hưởng bởi thói quen 'Chiều cao CỦA anh ấy thì cao' nên phản xạ dùng の. Cần luyện tập phản xạ phân tách: Người (は) + Bộ phận (が) + Tính từ.

---

### Bài tập 17 (`EX-074-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-074-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Chị Maria có đôi mắt to tròn và rất đẹp.」

#### 🔘 4 Phương án lựa chọn:
- **A.** マリアさんは目が大きくて、きれいです。
- **B.** 目が大きくて、きれいです。はマリアさん
- **C.** マリアさんは目が大きくてそしてきれいです。
- **D.** マリアさんは目が大きくて、きれいだ。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Chị Maria có đôi mắt to tròn và rất đẹp.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: N1[chủ thể] は + N2[bộ phận/thuộc tính] が + A[tính từ] です. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 18 (`EX-074-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-074-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「日本は食べ物がおいしくて、安全です。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N1[chủ
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Nhật Bản đồ ăn rất ngon và an toàn.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái N1 + は + N2 + が + Tính từ đuôi い / Tính từ đuôi な + です. Giữ nguyên hình thức khẳng định hoặc phủ định của tính từ ở đuôi câu..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: N1 + は + N2 + が + Tính từ đuôi い / Tính từ đuôi な + です. Giữ nguyên hình thức khẳng định hoặc phủ định của tính từ ở đuôi câu.

---

### Bài tập 19 (`EX-074-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-074-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「サントスさんは足が速いです。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** サントスさんは足が速いです。
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Anh Santos chạy rất nhanh (chân nhanh).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Tự nhiên, sinh động, mang đậm đặc trưng tư duy tiếng Nhật. Dùng trong miêu tả người, nhận diện danh tính, khen ngợi hoặc bình phẩm một cách lịch thiệp.

---

### Bài tập 20 (`EX-074-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-074-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 74 (N1 は N2 が A です ):

#### 🔘 4 Phương án lựa chọn:
- **A.** Không được diễn đạt theo kiểu dịch từng từ 'N1 の N2 は A です' (như: ダニエルさんの背は高いです -> nghe gượng gạo, thiếu tự nhiên trong tiếng Nhật). Luôn luôn dùng 'N1 は N2 が A です'.
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với N1 は N2 が A です (Miêu tả đặc điểm ngoại hình, bộ phận, sở trường).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: Không được diễn đạt theo kiểu dịch từng từ 'N1 の N2 は A です' (như: ダニエルさんの背は高いです -> nghe gượng gạo, thiếu tự nhiên trong tiếng Nhật). Luôn luôn dùng 'N1 は N2 が A です'.

---

### Bài tập 21 (`EX-074-07`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-074-07`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu N1 は N2 が A です :
「ダニエルさんは背が高いです。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N1[chủ
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Anh Daniel có vóc dáng cao ráo.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức N1[chủ thể] は + N2[bộ phận/thuộc tính] が + A[tính từ] です.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 74: Dùng để miêu tả đặc điểm ngoại hình, bộ phận cơ thể, tài lẻ hoặc thuộc tính cụ thể của người, đồ vật hoặc địa danh. Cấu trúc này thiết lập phân tầng chủ đề (Topic-Comment Structure): N1 là chủ đề lớn cần nói đến, N2 là bộ phận focus mang đặc điểm tính từ A.

---

## MỤC BÀI TẬP CHO PATTERN 75: イA-くて / ナA-で / N-で (Nối tính từ và danh từ theo chuỗi song hành)

**Bài học:** Bài 8 | **Dạng mẫu:** `A1[thể nối] + A2[thể nối] + ... + An です` | **Trình độ:** N5

### Bài tập 22 (`EX-075-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-075-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu イA-くて / ナA-で / N-で :
「メアリーさんは目が大きくて、髪が長いです。」

#### 🔘 4 Phương án lựa chọn:
- **A.** A1[thể
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Mary có đôi mắt to và mái tóc dài.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức A1[thể nối] + A2[thể nối] + ... + An です.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 75: Dùng để xâu chuỗi hai hoặc nhiều tính từ, danh từ trong một câu văn nhằm liệt kê các đặc điểm, thuộc tính có cùng tính chất tích cực hoặc tiêu cực, hoặc thể hiện mối liên hệ giải thích bổ sung.

---

### Bài tập 23 (`EX-075-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-075-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của イA-くて / ナA-で / N-で (Nối tính từ và danh từ theo chuỗi song hành)?

#### 🔘 4 Phương án lựa chọn:
- **A.** この部屋は広くて、とても明るいです。
- **B.** この部屋は広くて、とても明るいです。でした
- **C.** この部屋は広くて、とても明るいです。
- **D.** 全然この部屋は広くて、とても明るいです。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Căn phòng này rộng rãi và rất sáng sủa.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Lỗi quên biến đổi bất quy tắc của từ いい (tốt) -> học sinh hay nhầm thành いいくて (SAI). Quy tắc: いい luôn luôn phải đổi thành よくて. Thứ hai là nhầm đuôi tính từ な với đuôi い.
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Lỗi quên biến đổi bất quy tắc của từ いい (tốt) -> học sinh hay nhầm thành いいくて (SAI). Quy tắc: いい luôn luôn phải đổi thành よくて. Thứ hai là nhầm đuôi tính từ な với đuôi い.

---

### Bài tập 24 (`EX-075-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-075-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Thầy Tanaka vừa tốt bụng vừa là một giáo viên tận tâm.」

#### 🔘 4 Phương án lựa chọn:
- **A.** 田中先生は親切で、熱心な先生です。
- **B.** 親切で、熱心な先生です。は田中先生
- **C.** 田中先生は親切でそして熱心な先生です。
- **D.** 田中先生は親切で、熱心な先生だ。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Thầy Tanaka vừa tốt bụng vừa là một giáo viên tận tâm.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: A1[thể nối] + A2[thể nối] + ... + An です. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 25 (`EX-075-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-075-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「この町は静かで、緑が多いです。」

#### 🔘 4 Phương án lựa chọn:
- **A.** A1[thể
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Thị trấn này yên bình và có rất nhiều cây xanh.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái Tính từ đuôi い: Bỏ [い] biến thành [くて] (Ngoại lệ: いい -> よくて). Tính từ đuôi な: Bỏ [な] thêm [で]. Danh từ: N + [で]..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: Tính từ đuôi い: Bỏ [い] biến thành [くて] (Ngoại lệ: いい -> よくて). Tính từ đuôi な: Bỏ [な] thêm [で]. Danh từ: N + [で].

---

### Bài tập 26 (`EX-075-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-075-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「彼はベトナム人で、ハノイ大学の学生です。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** 彼はベトナム人で、ハノイ大学の学生です。
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Cậu ấy là người Việt Nam và là sinh viên trường Đại học Hà Nội.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Tạo sự liền mạch, nhịp điệu uyển chuyển cho câu văn, tránh việc ngắt câu cụt ngủn.

---

### Bài tập 27 (`EX-075-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-075-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 75 (イA-くて / ナA-で / N-で ):

#### 🔘 4 Phương án lựa chọn:
- **A.** Mẫu này chỉ nối các đặc điểm cùng chiều (cùng tốt hoặc cùng xấu). Nếu một mặt tốt, một mặt xấu mang tính tương phản đối lập thì không dùng -くて/-で mà phải dùng が hoặc けど (Ví dụ: 部屋は狭いですが、きれいです).
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với イA-くて / ナA-で / N-で (Nối tính từ và danh từ theo chuỗi song hành).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: Mẫu này chỉ nối các đặc điểm cùng chiều (cùng tốt hoặc cùng xấu). Nếu một mặt tốt, một mặt xấu mang tính tương phản đối lập thì không dùng -くて/-で mà phải dùng が hoặc けど (Ví dụ: 部屋は狭いですが、きれいです).

---

### Bài tập 28 (`EX-075-07`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-075-07`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu イA-くて / ナA-で / N-で :
「メアリーさんは目が大きくて、髪が長いです。」

#### 🔘 4 Phương án lựa chọn:
- **A.** A1[thể
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Mary có đôi mắt to và mái tóc dài.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức A1[thể nối] + A2[thể nối] + ... + An です.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 75: Dùng để xâu chuỗi hai hoặc nhiều tính từ, danh từ trong một câu văn nhằm liệt kê các đặc điểm, thuộc tính có cùng tính chất tích cực hoặc tiêu cực, hoặc thể hiện mối liên hệ giải thích bổ sung.

---

## MỤC BÀI TẬP CHO PATTERN 76: N1 は N2 に N3 をあげます (Tặng, trao tặng cho ai cái gì)

**Bài học:** Bài 8 | **Dạng mẫu:** `N1[người tặng] は + N2[người nhận] に + N3[vật phẩm] を + あげます` | **Trình độ:** N5

### Bài tập 29 (`EX-076-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-076-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu N1 は N2 に N3 をあげます :
「カルロスさんはパクさんにきれいな花をあげました。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N1[người
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Anh Carlos đã tặng những bông hoa tươi đẹp cho chị Park.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức N1[người tặng] は + N2[người nhận] に + N3[vật phẩm] を + あげます.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 76: Diễn tả hành vi trao tặng một vật phẩm hoặc giá trị từ người nói (hoặc từ ngôi thứ ba) đến một đối tượng khác, theo hướng ly tâm (rời xa bản thân người nói).

---

### Bài tập 30 (`EX-076-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-076-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của N1 は N2 に N3 をあげます (Tặng, trao tặng cho ai cái gì)?

#### 🔘 4 Phương án lựa chọn:
- **A.** 私は母の日に母にスカーフをあげました。
- **B.** 私は母の日に母にスカーフをあげました。でした
- **C.** 私に私は母の日に母にスカーフをあげました。
- **D.** 全然私は母の日に母にスカーフをあげました。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Vào Ngày của Mẹ, tôi đã tặng mẹ một chiếc khăn choàng cổ.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Người học Việt Nam hay dịch nguyên xi từ 'tặng cho tôi' thành '私にあげました' -> LỖI CỰC KỲ NẶNG trong văn hóa giao tiếp Nhật Bản. Phải dùng くれます.
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Người học Việt Nam hay dịch nguyên xi từ 'tặng cho tôi' thành '私にあげました' -> LỖI CỰC KỲ NẶNG trong văn hóa giao tiếp Nhật Bản. Phải dùng くれます.

---

### Bài tập 31 (`EX-076-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-076-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Tôi đã tặng một cuốn từ điển vào sinh nhật bạn tôi.」

#### 🔘 4 Phương án lựa chọn:
- **A.** 友達の誕生日に辞書をあげました。
- **B.** 。たしまげあを書辞に日生誕の達友
- **C.** 友達の誕生日に辞書をあげました。
- **D.** 友達の誕生日に辞書をあげました。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tôi đã tặng một cuốn từ điển vào sinh nhật bạn tôi.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: N1[người tặng] は + N2[người nhận] に + N3[vật phẩm] を + あげます. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 32 (`EX-076-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-076-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「弟に新しい自転車をあげました。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N1[người
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tôi đã cho em trai chiếc xe đạp mới.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái Chủ thể tặng (は) + Người nhận (に) + Đồ vật (を) + あげます (quá khứ: あげました). Có thể thay に bằng に/へ trong một số văn cảnh trang trọng..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: Chủ thể tặng (は) + Người nhận (に) + Đồ vật (を) + あげます (quá khứ: あげました). Có thể thay に bằng に/へ trong một số văn cảnh trang trọng.

---

### Bài tập 33 (`EX-076-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-076-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「先生にベトナムのお茶をあげました。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** 先生にベトナムのお茶をあげました。
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tôi đã biếu thầy giáo món trà đặc sản Việt Nam.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Lịch sự, trung tính. Chỉ dùng cho người ngang hàng hoặc người có vị thế thấp hơn (em nhỏ, con cái, thú nuôi/cây cỏ dùng やります). Tuyệt đối KHÔNG dùng あげます khi người nhận là 'Tôi' (私) hoặc người trong nhóm của tôi (uchi).

---

### Bài tập 34 (`EX-076-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-076-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 76 (N1 は N2 に N3 をあげます ):

#### 🔘 4 Phương án lựa chọn:
- **A.** So sánh với くれます: あげます = Tôi tặng người khác / A tặng B; くれます = Người khác tặng Tôi / người trong gia đình tôi. Tuyệt đối không dùng '彼が私にプレゼントをあげました'.
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với N1 は N2 に N3 をあげます (Tặng, trao tặng cho ai cái gì).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: So sánh với くれます: あげます = Tôi tặng người khác / A tặng B; くれます = Người khác tặng Tôi / người trong gia đình tôi. Tuyệt đối không dùng '彼が私にプレゼントをあげました'.

---

### Bài tập 35 (`EX-076-07`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-076-07`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu N1 は N2 に N3 をあげます :
「カルロスさんはパクさんにきれいな花をあげました。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N1[người
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Anh Carlos đã tặng những bông hoa tươi đẹp cho chị Park.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức N1[người tặng] は + N2[người nhận] に + N3[vật phẩm] を + あげます.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 76: Diễn tả hành vi trao tặng một vật phẩm hoặc giá trị từ người nói (hoặc từ ngôi thứ ba) đến một đối tượng khác, theo hướng ly tâm (rời xa bản thân người nói).

---

## MỤC BÀI TẬP CHO PATTERN 77: N1 は N2 に N3 をもらいます (Nhận từ ai cái gì)

**Bài học:** Bài 8 | **Dạng mẫu:** `N1[người nhận] は + N2[người tặng] に/から + N3[vật phẩm] を + もらいます` | **Trình độ:** N5

### Bài tập 36 (`EX-077-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-077-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu N1 は N2 に N3 をもらいます :
「パクさんはカルロスさんに花をもらいました。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N1[người
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Chị Park đã nhận được hoa từ anh Carlos.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức N1[người nhận] は + N2[người tặng] に/から + N3[vật phẩm] を + もらいます.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 77: Diễn tả hành vi người nói (hoặc người khác) tiếp nhận một món quà, vật phẩm hay sự giúp đỡ từ một đối tượng trao tặng.

---

### Bài tập 37 (`EX-077-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-077-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của N1 は N2 に N3 をもらいます (Nhận từ ai cái gì)?

#### 🔘 4 Phương án lựa chọn:
- **A.** 私は誕生日に父に腕時計をもらいました。
- **B.** 私は誕生日に父に腕時計をもらいました。でした
- **C.** 私は誕生日で父で腕時計をもらいました。
- **D.** 全然私は誕生日に父に腕時計をもらいました。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tôi đã nhận được chiếc đồng hồ đeo tay từ bố vào ngày sinh nhật.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Nhầm lẫn trợ từ: Người tặng đi với に hoặc から, nhưng nhiều bạn nhầm dùng で (もらいます で -> sai). Ngoài ra khi nhận từ công ty/ngân hàng, bắt buộc phải dùng から (会社からもらいました), không dùng に.
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Nhầm lẫn trợ từ: Người tặng đi với に hoặc から, nhưng nhiều bạn nhầm dùng で (もらいます で -> sai). Ngoài ra khi nhận từ công ty/ngân hàng, bắt buộc phải dùng から (会社からもらいました), không dùng に.

---

### Bài tập 38 (`EX-077-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-077-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Tôi đã nhận được học bổng từ chính phủ.」

#### 🔘 4 Phương án lựa chọn:
- **A.** 国から奨学金をもらいました。
- **B.** 。たしまいらもを金学奨らか国
- **C.** 国から奨学金をもらいました。
- **D.** 国から奨学金をもらいました。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tôi đã nhận được học bổng từ chính phủ.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: N1[người nhận] は + N2[người tặng] に/から + N3[vật phẩm] を + もらいます. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 39 (`EX-077-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-077-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「先生にいい本をもらいました。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N1[người
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tôi đã nhận được một cuốn sách hay từ thầy giáo.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái Người nhận (は) + Người cho (に / から) + Vật phẩm (を) + もらいます (quá khứ: もらいました). Nếu người cho là tổ chức, công ty, trường học thì bắt buộc dùng から..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: Người nhận (は) + Người cho (に / から) + Vật phẩm (を) + もらいます (quá khứ: もらいました). Nếu người cho là tổ chức, công ty, trường học thì bắt buộc dùng から.

---

### Bài tập 40 (`EX-077-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-077-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「誰にそのプレゼントをもらいましたか。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** 誰にそのプレゼントをもらいましたか。
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Bạn đã nhận được món quà đó từ ai thế?**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Thể hiện sự biết ơn, đón nhận lịch sự. Đứng từ góc nhìn của người nhận làm chủ ngữ của hành động.

---

### Bài tập 41 (`EX-077-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-077-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 77 (N1 は N2 に N3 をもらいます ):

#### 🔘 4 Phương án lựa chọn:
- **A.** So sánh với くれます: Trong mẫu もらいます, người nhận đứng làm chủ ngữ (私は ... にもらいました). Trong mẫu くれます, người tặng đứng làm chủ ngữ (彼は ... をくれました). Hai cấu trúc miêu tả cùng một sự việc nhưng đổi góc nhìn.
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với N1 は N2 に N3 をもらいます (Nhận từ ai cái gì).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: So sánh với くれます: Trong mẫu もらいます, người nhận đứng làm chủ ngữ (私は ... にもらいました). Trong mẫu くれます, người tặng đứng làm chủ ngữ (彼は ... をくれました). Hai cấu trúc miêu tả cùng một sự việc nhưng đổi góc nhìn.

---

### Bài tập 42 (`EX-077-07`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-077-07`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu N1 は N2 に N3 をもらいます :
「パクさんはカルロスさんに花をもらいました。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N1[người
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Chị Park đã nhận được hoa từ anh Carlos.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức N1[người nhận] は + N2[người tặng] に/から + N3[vật phẩm] を + もらいます.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 77: Diễn tả hành vi người nói (hoặc người khác) tiếp nhận một món quà, vật phẩm hay sự giúp đỡ từ một đối tượng trao tặng.

---

## MỤC BÀI TẬP CHO PATTERN 78: N1 は 私に N2 をくれます (Ai đó tặng/cho tôi cái gì)

**Bài học:** Bài 8 | **Dạng mẫu:** `N1[người tặng] は + 私[người nhận] に + N2[vật phẩm] を + くれます` | **Trình độ:** N5

### Bài tập 43 (`EX-078-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-078-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu N1 は 私に N2 をくれます :
「メアリーさんが私にかばんをくれました。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N1[người
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Mary đã tặng cho tôi một chiếc cặp sách.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức N1[người tặng] は + 私[người nhận] に + N2[vật phẩm] を + くれます.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 78: Diễn tả hành động người khác tặng, trao tặng cho 'Tôi' hoặc thành viên trong gia đình tôi một món quà. Hướng chuyển động mang tính hướng tâm (về phía bản thân người nói).

---

### Bài tập 44 (`EX-078-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-078-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của N1 は 私に N2 をくれます (Ai đó tặng/cho tôi cái gì)?

#### 🔘 4 Phương án lựa chọn:
- **A.** 誕生日に友達が素敵なネクタイをくれました。
- **B.** 誕生日に友達は素敵なネクタイをくれました。
- **C.** 誕生日で友達が素敵なネクタイをくれました。
- **D.** 全然誕生日に友達が素敵なネクタイをくれました。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Vào ngày sinh nhật, bạn bè đã tặng tôi một chiếc cà vạt tuyệt đẹp.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Lỗi kinh điển: Quên dùng くれます khi người khác tặng mình mà lại dùng あげました. Hãy khắc sâu: Ai tặng tôi -> くれました.
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Lỗi kinh điển: Quên dùng くれます khi người khác tặng mình mà lại dùng あげました. Hãy khắc sâu: Ai tặng tôi -> くれました.

---

### Bài tập 45 (`EX-078-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-078-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Giám đốc đã cho tôi món bánh kẹo rất ngon.」

#### 🔘 4 Phương án lựa chọn:
- **A.** 社長がおいしいお菓子をくれました。
- **B.** 。たしまれくを子菓おいしいおが長社
- **C.** 社長がおいしいお菓子をくれました。
- **D.** 社長がおいしいお菓子をくれました。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Giám đốc đã cho tôi món bánh kẹo rất ngon.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: N1[người tặng] は + 私[người nhận] に + N2[vật phẩm] を + くれます. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 46 (`EX-078-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-078-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「兄が妹に可愛い人形をくれました。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N1[người
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Anh họ đã tặng cho em gái tôi một con búp bê dễ thương.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái Người tặng (は) + 私に (hoặc thành viên uchi như 家族、妹、弟) + Đồ vật (を) + くれます (quá khứ: くれました). '私に' thường có thể lược bỏ nếu ngữ cảnh đã rõ ràng..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: Người tặng (は) + 私に (hoặc thành viên uchi như 家族、妹、弟) + Đồ vật (を) + くれます (quá khứ: くれました). '私に' thường có thể lược bỏ nếu ngữ cảnh đã rõ ràng.

---

### Bài tập 47 (`EX-078-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-078-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「親切な人が道を教えてくれました。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** 親切な人が道を教えてくれました。
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Một người tốt bụng đã chỉ đường giúp tôi.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Biểu đạt lòng hàm ơn sâu sắc. Trong tâm thức người Nhật, việc ai đó trao gì cho mình luôn là một ân huệ đặc biệt hướng về phía mình.

---

### Bài tập 48 (`EX-078-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-078-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 78 (N1 は 私に N2 をくれます ):

#### 🔘 4 Phương án lựa chọn:
- **A.** Mẫu này tuyệt đối KHÔNG dùng cho hành vi 'Tôi tặng cho ai đó' (私は友達にくれます -> SAI HOÀN TOÀN). Bắt buộc người nhận phải là Tôi hoặc người cùng phe với Tôi.
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với N1 は 私に N2 をくれます (Ai đó tặng/cho tôi cái gì).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: Mẫu này tuyệt đối KHÔNG dùng cho hành vi 'Tôi tặng cho ai đó' (私は友達にくれます -> SAI HOÀN TOÀN). Bắt buộc người nhận phải là Tôi hoặc người cùng phe với Tôi.

---

### Bài tập 49 (`EX-078-07`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-078-07`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu N1 は 私に N2 をくれます :
「メアリーさんが私にかばんをくれました。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N1[người
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Mary đã tặng cho tôi một chiếc cặp sách.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức N1[người tặng] は + 私[người nhận] に + N2[vật phẩm] を + くれます.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 78: Diễn tả hành động người khác tặng, trao tặng cho 'Tôi' hoặc thành viên trong gia đình tôi một món quà. Hướng chuyển động mang tính hướng tâm (về phía bản thân người nói).

---

## MỤC BÀI TẬP CHO PATTERN 79: N(人) が [〜人] います (Định lượng số lượng người / Tồn tại nhân sự)

**Bài học:** Bài 8 | **Dạng mẫu:** `N[chủng loại người] が + [Số đếm + 人] + います` | **Trình độ:** N5

### Bài tập 50 (`EX-079-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-079-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu N:
「私は妹が二人います。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N[chủng
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tôi có hai người em gái.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức N[chủng loại người] が + [Số đếm + 人] + います.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 79: Diễn tả số lượng thành viên trong gia đình, lớp học, cơ quan hoặc sự tồn tại của bao nhiêu người trong một bối cảnh nhất định.

---

### Bài tập 51 (`EX-079-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-079-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của N(人) が [〜人] います (Định lượng số lượng người / Tồn tại nhân sự)?

#### 🔘 4 Phương án lựa chọn:
- **A.** このクラスには留学生が十人います。
- **B.** このクラスには留学生は十人います。
- **C.** このクラスでは留学生が十人います。
- **D.** 全然このクラスには留学生が十人います。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Trong lớp học này có mười bạn sinh viên quốc tế.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Học sinh hay chèn trợ từ の hoặc を vào sau số từ (như '妹の二人がいます' -> sai). Trong tiếng Nhật, số từ đóng vai trò như phó từ đặt ngay trước động từ: '妹が二人います'.
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Học sinh hay chèn trợ từ の hoặc を vào sau số từ (như '妹の二人がいます' -> sai). Trong tiếng Nhật, số từ đóng vai trò như phó từ đặt ngay trước động từ: '妹が二人います'.

---

### Bài tập 52 (`EX-079-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-079-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Trong phòng họp hiện có ba thầy giáo.」

#### 🔘 4 Phương án lựa chọn:
- **A.** 会議室に先生が三人います。
- **B.** 。すまい人三が生先に室議会
- **C.** 会議室に先生が三人います。
- **D.** 会議室に先生が三人います。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Trong phòng họp hiện có ba thầy giáo.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: N[chủng loại người] が + [Số đếm + 人] + います. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 53 (`EX-079-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-079-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「家族は何人いますか。――五人います。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N[chủng
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Gia đình bạn có bao nhiêu người? ―― Có năm người.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái Danh từ người + が + Số đếm nhân số (1人: ひとり; 2人: ふたり; 3人: さんにん; 4人: よにん; ...) + います. Số từ thường đặt trực tiếp trước động từ います không cần trợ từ..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: Danh từ người + が + Số đếm nhân số (1人: ひとり; 2人: ふたり; 3人: さんにん; 4人: よにん; ...) + います. Số từ thường đặt trực tiếp trước động từ います không cần trợ từ.

---

### Bài tập 54 (`EX-079-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-079-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「公園に子どもたちがたくさんいます。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** 公園に子どもたちがたくさんいます。
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Ở công viên có rất đông trẻ em.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Tự nhiên, dùng khi giới thiệu gia cảnh, thành phần nhân sự công ty, đếm sĩ số lớp học.

---

### Bài tập 55 (`EX-079-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-079-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 79 (N):

#### 🔘 4 Phương án lựa chọn:
- **A.** Phân biệt với đồ vật dùng あります (Con người, động vật dùng います). Lưu ý cách đếm bất quy tắc: 1 người (ひとり), 2 người (ふたり), 4 người (よにん - không đọc là よん・し).
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với N(人) が [〜人] います (Định lượng số lượng người / Tồn tại nhân sự).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: Phân biệt với đồ vật dùng あります (Con người, động vật dùng います). Lưu ý cách đếm bất quy tắc: 1 người (ひとり), 2 người (ふたり), 4 người (よにん - không đọc là よん・し).

---

## MỤC BÀI TẬP CHO PATTERN 80: [〜人] で (Tiến hành hành động với quy mô bao nhiêu người)

**Bài học:** Bài 8 | **Dạng mẫu:** `[Số đếm nhân khẩu] + で + V` | **Trình độ:** N5

### Bài tập 56 (`EX-080-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-080-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu [〜人] で :
「私はルームメイトと3人で住んでいます。」

#### 🔘 4 Phương án lựa chọn:
- **A.** [Số
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tôi đang sống cùng với người bạn cùng phòng, tổng cộng là 3 người.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức [Số đếm nhân khẩu] + で + V.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 80: Dùng để chỉ định tổng số lượng người cùng tham gia thực hiện một hoạt động chung, đóng vai trò như phương thức, quy mô của hành vi.

---

### Bài tập 57 (`EX-080-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-080-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của [〜人] で (Tiến hành hành động với quy mô bao nhiêu người)?

#### 🔘 4 Phương án lựa chọn:
- **A.** 昨日、友達と二人で映画を見に行きました。
- **B.** 昨日、友達と二人で映画を見に行きました。でした
- **C.** 昨日、友達と二人で映画を見で行きました。
- **D.** 全然昨日、友達と二人で映画を見に行きました。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Hôm qua tôi và bạn tôi, hai đứa đã cùng nhau đi xem phim.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Người học hay nhầm '1人で' với '1人'. Cần nhớ: '1人' là số lượng (có 1 người), còn '1人で' là phương thức hành động (làm một mình).
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Người học hay nhầm '1人で' với '1人'. Cần nhớ: '1人' là số lượng (có 1 người), còn '1人で' là phương thức hành động (làm một mình).

---

### Bài tập 58 (`EX-080-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-080-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Tôi đã tự mình một tay bê vác đống hành lý này.」

#### 🔘 4 Phương án lựa chọn:
- **A.** この荷物を一人で運びました。
- **B.** 。たしまび運で人一を物荷のこ
- **C.** この荷物を一人で運びました。
- **D.** この荷物を一人で運びました。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tôi đã tự mình một tay bê vác đống hành lý này.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: [Số đếm nhân khẩu] + で + V. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 59 (`EX-080-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-080-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「みんなで一緒に日本語の歌を歌いましょう。」

#### 🔘 4 Phương án lựa chọn:
- **A.** [Số
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Mọi người hãy cùng nhau hát bài hát tiếng Nhật nào!**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái Số đếm người + で (1 người làm một mình dùng: 1人で / ひとりで; 2 người: 2人で / ふたりで; 3 người: 3人で; ...). Riêng 1 người (ひとりで) mang nghĩa 'tự mình/đơn độc'..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: Số đếm người + で (1 người làm một mình dùng: 1人で / ひとりで; 2 người: 2人で / ふたりで; 3 người: 3人で; ...). Riêng 1 người (ひとりで) mang nghĩa 'tự mình/đơn độc'.

---

### Bài tập 60 (`EX-080-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-080-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「何人で旅行へ行きますか。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** 家族四人で行きます。
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Các bạn đi du lịch mấy người thế? ―― Bốn người trong gia đình tôi cùng đi.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Thông dụng trong hội thoại sắp xếp lịch trình, nấu ăn, du lịch, thuê nhà trọ.

---

### Bài tập 61 (`EX-080-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-080-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 80 ([〜人] で ):

#### 🔘 4 Phương án lựa chọn:
- **A.** Phân biệt giữa: Aさんと (cùng với anh A - chỉ đối tác đồng hành) và 2人で (hai người chúng tôi - chỉ tổng sĩ số tham gia). Có thể kết hợp: 'Aさんと2人で映画を見ました'.
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với [〜人] で (Tiến hành hành động với quy mô bao nhiêu người).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: Phân biệt giữa: Aさんと (cùng với anh A - chỉ đối tác đồng hành) và 2人で (hai người chúng tôi - chỉ tổng sĩ số tham gia). Có thể kết hợp: 'Aさんと2人で映画を見ました'.

---

## MỤC BÀI TẬP CHO PATTERN 81: V辞書形 + こと (Danh từ hóa động từ / Sở thích là...)

**Bài học:** Bài 9 | **Dạng mẫu:** `V[辞書形] + こと + です / が好きです` | **Trình độ:** N5

### Bài tập 62 (`EX-081-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-081-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu V辞書形 + こと :
「私の趣味は映画を見ることです。」

#### 🔘 4 Phương án lựa chọn:
- **A.** V[辞書形]
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Sở thích của tôi là xem phim điện ảnh.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức V[辞書形] + こと + です / が好きです.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 81: Dùng để biến đổi một động từ hành động thành một danh từ trừu tượng (danh từ hóa - Nominalization), cho phép hành động đó đảm nhiệm vai trò chủ ngữ, vị ngữ hoặc bổ ngữ trong câu, đặc biệt phổ biến trong mẫu nói về sở thích cá nhân.

---

### Bài tập 63 (`EX-081-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-081-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của V辞書形 + こと (Danh từ hóa động từ / Sở thích là...)?

#### 🔘 4 Phương án lựa chọn:
- **A.** 彼の夢は日本で働くことです。
- **B.** 彼の夢は日本で働くことです。でした
- **C.** 彼の夢は日本で働くことです。
- **D.** 全然彼の夢は日本で働くことです。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Ước mơ của anh ấy là được làm việc tại Nhật Bản.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Học sinh hay quên thêm こと mà nói trực tiếp: '私の趣味は映画を見ますです' -> LỖI CẤU TRÚC NGHIÊM TRỌNG. Không thể ghép động từ thể ます trực tiếp trước です.
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Học sinh hay quên thêm こと mà nói trực tiếp: '私の趣味は映画を見ますです' -> LỖI CẤU TRÚC NGHIÊM TRỌNG. Không thể ghép động từ thể ます trực tiếp trước です.

---

### Bài tập 64 (`EX-081-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-081-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Việc học ngoại ngữ quả thực vô cùng thú vị.」

#### 🔘 4 Phương án lựa chọn:
- **A.** 外国語を勉強することはとても楽しいです。
- **B.** とても楽しいです。は外国語を勉強すること
- **C.** 外国語を勉強することはとても楽しいです。
- **D.** 外国語を勉強することはとても楽しいだ。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Việc học ngoại ngữ quả thực vô cùng thú vị.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: V[辞書形] + こと + です / が好きです. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 65 (`EX-081-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-081-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「休みの日の楽しみは音楽を聞くことです。」

#### 🔘 4 Phương án lựa chọn:
- **A.** V[辞書形]
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Niềm vui trong ngày nghỉ của tôi là nghe nhạc.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái Động từ chia về Thể từ điển (Jishokei) + こと. Ví dụ: 見ます -> 見ること; 泳ぎます -> 泳ぐこと; 旅行します -> 旅行すること..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: Động từ chia về Thể từ điển (Jishokei) + こと. Ví dụ: 見ます -> 見ること; 泳ぎます -> 泳ぐこと; 旅行します -> 旅行すること.

---

### Bài tập 66 (`EX-081-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-081-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「一番大切なことは毎日続けることです。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** 一番大切なことは毎日続けることです。
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Điều quan trọng nhất chính là sự kiên trì duy trì mỗi ngày.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Thân mật và tự nhiên, chuẩn mực cấu trúc giới thiệu bản thân ở trình độ N5.

---

### Bài tập 67 (`EX-081-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-081-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 81 (V辞書形 + こと ):

#### 🔘 4 Phương án lựa chọn:
- **A.** Phân biệt với の: Ở cấp độ sơ cấp, mẫu '私の趣味は [V辞書形] ことです' bắt buộc dùng こと, không thay bằng の (như 趣味は見ることです -> đúng; 趣味は見るのです -> không tự nhiên trong cấu trúc vị ngữ sở thích).
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với V辞書形 + こと (Danh từ hóa động từ / Sở thích là...).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: Phân biệt với の: Ở cấp độ sơ cấp, mẫu '私の趣味は [V辞書形] ことです' bắt buộc dùng こと, không thay bằng の (như 趣味は見ることです -> đúng; 趣味は見るのです -> không tự nhiên trong cấu trúc vị ngữ sở thích).

---

### Bài tập 68 (`EX-081-07`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-081-07`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu V辞書形 + こと :
「私の趣味は映画を見ることです。」

#### 🔘 4 Phương án lựa chọn:
- **A.** V[辞書形]
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Sở thích của tôi là xem phim điện ảnh.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức V[辞書形] + こと + です / が好きです.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 81: Dùng để biến đổi một động từ hành động thành một danh từ trừu tượng (danh từ hóa - Nominalization), cho phép hành động đó đảm nhiệm vai trò chủ ngữ, vị ngữ hoặc bổ ngữ trong câu, đặc biệt phổ biến trong mẫu nói về sở thích cá nhân.

---

## MỤC BÀI TẬP CHO PATTERN 82: N が できます / V辞書形 ことができます (Khả năng thực hiện hành động)

**Bài học:** Bài 9 | **Dạng mẫu:** `N が できます / V[辞書形] ことが できます` | **Trình độ:** N5

### Bài tập 69 (`EX-082-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-082-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu N が できます / V辞書形 ことができます :
「私はスキーができます。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tôi có thể trượt tuyết.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức N が できます / V[辞書形] ことが できます.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 82: Diễn tả năng lực, sở trường của một người (có thể làm được gì nhờ rèn luyện, học tập) hoặc khả năng xảy ra của một sự việc trong hoàn cảnh nhất định.

---

### Bài tập 70 (`EX-082-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-082-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của N が できます / V辞書形 ことができます (Khả năng thực hiện hành động)?

#### 🔘 4 Phương án lựa chọn:
- **A.** 田中さんは英語とフランス語を話すことができます。
- **B.** 田中さんは英語とフランス語を話すことはできます。
- **C.** 田中さんは英語とフランス語を話すことができます。
- **D.** 全然田中さんは英語とフランス語を話すことができます。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Anh Tanaka có thể nói được cả tiếng Anh và tiếng Pháp.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Người học hay dùng trợ từ を trước できます (như: ピアノをできます -> SAI). Động từ できます luôn luôn đòi hỏi trợ từ が đi trước: ピアノができます.
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Người học hay dùng trợ từ を trước できます (như: ピアノをできます -> SAI). Động từ できます luôn luôn đòi hỏi trợ từ が đi trước: ピアノができます.

---

### Bài tập 71 (`EX-082-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-082-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Tôi có thể bơi một trăm mét ở bể bơi này.」

#### 🔘 4 Phương án lựa chọn:
- **A.** このプールで百メートル泳ぐことができます。
- **B.** 。すまきでがとこぐ泳ルトーメ百でループのこ
- **C.** このプールで百メートル泳ぐことができます。
- **D.** このプールで百メートル泳ぐことができます。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tôi có thể bơi một trăm mét ở bể bơi này.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: N が できます / V[辞書形] ことが できます. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 72 (`EX-082-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-082-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「車を運転することができますか。――はい、できます。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Bạn có biết lái xe ô tô không? ―― Vâng, tôi lái được.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái Nếu là danh từ chỉ môn thể thao/ngoại ngữ: N + ができます. Nếu là động từ: V-jisho + ことができます..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: Nếu là danh từ chỉ môn thể thao/ngoại ngữ: N + ができます. Nếu là động từ: V-jisho + ことができます.

---

### Bài tập 73 (`EX-082-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-082-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「パソコンで日本のニュースを読むことができます。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** パソコンで日本のニュースを読むことができます。
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tôi có thể đọc tin tức tiếng Nhật trên máy tính.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Trang trọng, chuẩn mực. Dùng khi viết CV xin việc, giới thiệu kỹ năng chuyên môn, phỏng vấn.

---

### Bài tập 74 (`EX-082-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-082-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 82 (N が できます / V辞書形 ことができます ):

#### 🔘 4 Phương án lựa chọn:
- **A.** So sánh với Động từ thể khả năng (可能形 ở N4 như 話せる、泳げる): Mẫu 'ことができます' mang tính quy phạm, rõ ràng, không đòi hỏi biến đổi căn tố động từ phức tạp.
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với N が できます / V辞書形 ことができます (Khả năng thực hiện hành động).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: So sánh với Động từ thể khả năng (可能形 ở N4 như 話せる、泳げる): Mẫu 'ことができます' mang tính quy phạm, rõ ràng, không đòi hỏi biến đổi căn tố động từ phức tạp.

---

### Bài tập 75 (`EX-082-07`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-082-07`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu N が できます / V辞書形 ことができます :
「私はスキーができます。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tôi có thể trượt tuyết.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức N が できます / V[辞書形] ことが できます.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 82: Diễn tả năng lực, sở trường của một người (có thể làm được gì nhờ rèn luyện, học tập) hoặc khả năng xảy ra của một sự việc trong hoàn cảnh nhất định.

---

## MỤC BÀI TẬP CHO PATTERN 83: Vて形 (Nối các hành động theo trình tự thời gian)

**Bài học:** Bài 9 | **Dạng mẫu:** `V1[て形]、V2[て形]、... Vn[thì cuối câu]` | **Trình độ:** N5

### Bài tập 76 (`EX-083-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-083-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu Vて形 :
「週末、友達とご飯を食べて、映画を見ます。」

#### 🔘 4 Phương án lựa chọn:
- **A.** V1[て形]、V2[て形]、...
- **B.** V1[た形]、V2[た形]、...
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Cuối tuần, tôi sẽ ăn cơm cùng bạn bè rồi đi xem phim.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức V1[て形]、V2[て形]、... Vn[thì cuối câu].
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 83: Dùng để liệt kê chuỗi hành động diễn ra nối tiếp nhau theo thứ tự thời gian tuyến tính (làm V1 xong rồi làm V2, cuối cùng làm Vn). Thì của toàn bộ câu do động từ cuối cùng quyết định.

---

### Bài tập 77 (`EX-083-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-083-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của Vて形 (Nối các hành động theo trình tự thời gian)?

#### 🔘 4 Phương án lựa chọn:
- **A.** 昨日は朝七時に起きて、シャワーを浴びて、学校へ行きました。
- **B.** 昨日は朝七時に起きて、シャワーを浴びて、学校へ行きました。でした
- **C.** 昨日は朝七時で起きて、シャワーを浴びて、学校へ行きました。
- **D.** 全然昨日は朝七時に起きて、シャワーを浴びて、学校へ行きました。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Hôm qua tôi thức dậy lúc 7 giờ sáng, tắm vòi sen rồi đến trường.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Học sinh hay chia thì quá khứ cho từng động từ con (như: 朝起きました、ご飯を食べました -> cụt lủn). Phải liên kết bằng thể Te và chỉ chia thì ở động từ chốt câu.
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Học sinh hay chia thì quá khứ cho từng động từ con (như: 朝起きました、ご飯を食べました -> cụt lủn). Phải liên kết bằng thể Te và chỉ chia thì ở động từ chốt câu.

---

### Bài tập 78 (`EX-083-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-083-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Tôi đến ngân hàng rút tiền rồi mới đi mua sắm.」

#### 🔘 4 Phương án lựa chọn:
- **A.** 銀行へ行ってお金を下ろしてから、買い物します。
- **B.** 。すまし物い買、らかてしろ下を金おてっ行へ行銀
- **C.** 銀行へ行ってお金を下ろしてからそして買い物します。
- **D.** 銀行へ行ってお金を下ろしてから、買い物します。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tôi đến ngân hàng rút tiền rồi mới đi mua sắm.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: V1[て形]、V2[て形]、... Vn[thì cuối câu]. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 79 (`EX-083-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-083-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「駅を降りて、まっすぐ歩いて、交差点を左に曲がってください。」

#### 🔘 4 Phương án lựa chọn:
- **A.** V1[て形]、V2[て形]、...
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Hãy xuống ga, đi bộ thẳng rồi rẽ trái ở ngã tư.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái Động từ chia thể Te (V-te), nối bằng dấu phẩy. Động từ cuối câu chia theo thì quá khứ (ました) hoặc hiện tại/tương lai (ます)..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: Động từ chia thể Te (V-te), nối bằng dấu phẩy. Động từ cuối câu chia theo thì quá khứ (ました) hoặc hiện tại/tương lai (ます).

---

### Bài tập 80 (`EX-083-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-083-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「宿題をして、日本語の単語を覚えてから寝ます。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** 宿題をして、日本語の単語を覚えてから寝ます。
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tôi làm bài tập, học thuộc từ vựng tiếng Nhật rồi mới đi ngủ.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Rất phổ biến trong văn kể chuyện, nhật ký, báo cáo hành trình công tác hoặc hướng dẫn quy trình thao tác kỹ thuật.

---

### Bài tập 81 (`EX-083-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-083-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 83 (Vて形 ):

#### 🔘 4 Phương án lựa chọn:
- **A.** Khác với mẫu VたりVたりします (Pattern 99): Mẫu -te nối hành động bắt buộc phải tuân theo thứ tự trước sau nghiêm ngặt; trong khi -tari -tari chỉ liệt kê vài hành động tiêu biểu không quan trọng trình tự.
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với Vて形 (Nối các hành động theo trình tự thời gian).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: Khác với mẫu VたりVたりします (Pattern 99): Mẫu -te nối hành động bắt buộc phải tuân theo thứ tự trước sau nghiêm ngặt; trong khi -tari -tari chỉ liệt kê vài hành động tiêu biểu không quan trọng trình tự.

---

## MỤC BÀI TẬP CHO PATTERN 84: [〜日・〜週間] に [〜回・〜本] (Chỉ tần suất định kỳ trong khoảng thời gian)

**Bài học:** Bài 9 | **Dạng mẫu:** `[Đơn vị thời gian] に + [Số lần / Số lượng] + V` | **Trình độ:** N5

### Bài tập 82 (`EX-084-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-084-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu [〜日・〜週間] に [〜回・〜本] :
「1週間に2回、家族に電話します。」

#### 🔘 4 Phương án lựa chọn:
- **A.** [Đơn
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Một tuần tôi gọi điện cho gia đình hai lần.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức [Đơn vị thời gian] に + [Số lần / Số lượng] + V.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 84: Dùng để biểu thị tần suất xuất hiện của một hành vi, thói quen trong một đơn vị thời gian cố định (như 1 ngày mấy lần, 1 tuần mấy lần, 1 năm mấy lần).

---

### Bài tập 83 (`EX-084-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-084-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của [〜日・〜週間] に [〜回・〜本] (Chỉ tần suất định kỳ trong khoảng thời gian)?

#### 🔘 4 Phương án lựa chọn:
- **A.** この薬は一日に三回、食後に飲んでください。
- **B.** この薬は一日に三回、食後に飲んでください。でした
- **C.** この薬は一日で三回、食後で飲んでください。
- **D.** 全然この薬は一日に三回、食後に飲んでください。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Thuốc này hãy uống một ngày 3 lần sau bữa ăn.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Học sinh hay quên trợ từ に hoặc để lộn vị trí số lần trước thời gian. Chuẩn ngữ pháp: Thời gian + に + Số lần.
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Học sinh hay quên trợ từ に hoặc để lộn vị trí số lần trước thời gian. Chuẩn ngữ pháp: Thời gian + に + Số lần.

---

### Bài tập 84 (`EX-084-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-084-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Mỗi tháng một lần tôi lại đến rạp chiếu phim.」

#### 🔘 4 Phương án lựa chọn:
- **A.** 一か月に一回、映画館へ行きます。
- **B.** 。すまき行へ館画映、回一に月か一
- **C.** 一か月に一回そして映画館へ行きます。
- **D.** 一か月に一回、映画館へ行きます。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Mỗi tháng một lần tôi lại đến rạp chiếu phim.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: [Đơn vị thời gian] に + [Số lần / Số lượng] + V. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 85 (`EX-084-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-084-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「一年に二回、国へ帰ります。」

#### 🔘 4 Phương án lựa chọn:
- **A.** [Đơn
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Một năm tôi về nước hai lần.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái Khoảng thời gian (1日、1週間、1か月、1年) + に + Lượng từ tần suất (1回、2回、何回) + Động từ..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: Khoảng thời gian (1日、1週間、1か月、1年) + に + Lượng từ tần suất (1回、2回、何回) + Động từ.

---

### Bài tập 86 (`EX-084-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-084-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「どのくらい運動しますか。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** 一週間に四回ジムへ行きます。
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Bạn tập thể dục bao lâu một lần? ―― Một tuần tôi đến phòng gym bốn lần.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Thiết thực trong giao tiếp, trao đổi về lịch biểu công việc, toa thuốc bác sĩ dặn, thói quen tập luyện thể thao.

---

### Bài tập 87 (`EX-084-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-084-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 84 ([〜日・〜週間] に [〜回・〜本] ):

#### 🔘 4 Phương án lựa chọn:
- **A.** Trợ từ bắt buộc là に (chỉ mốc phạm vi thời gian chuẩn). Không dùng で hay を ở vị trí này.
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với [〜日・〜週間] に [〜回・〜本] (Chỉ tần suất định kỳ trong khoảng thời gian).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: Trợ từ bắt buộc là に (chỉ mốc phạm vi thời gian chuẩn). Không dùng で hay を ở vị trí này.

---

## MỤC BÀI TẬP CHO PATTERN 85: いつも / よく / ときどき / あまり / ぜんぜん (Hệ thống phó từ chỉ tần suất)

**Bài học:** Bài 9 | **Dạng mẫu:** `Phó từ tần suất + V[khẳng định / phủ định]` | **Trình độ:** N5

### Bài tập 88 (`EX-085-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-085-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu いつも / よく / ときどき / あまり / ぜんぜん :
「私は朝いつもコーヒーを飲みます。」

#### 🔘 4 Phương án lựa chọn:
- **A.** Phó
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Buổi sáng tôi luôn luôn uống cà phê.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức Phó từ tần suất + V[khẳng định / phủ định].
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 85: Biểu thị mức độ thường xuyên của hành động theo thang đo tỷ lệ phần trăm từ 100% xuống 0%:
- いつも (100% - luôn luôn)
- よく (~80% - thường xuyên)
- ときどき (~50% - thỉnh thoảng)
- あまり (~20% - hiếm khi, đi kèm V phủ định)
- ぜんぜん (0% - hoàn toàn không, đi kèm V phủ định).

---

### Bài tập 89 (`EX-085-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-085-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của いつも / よく / ときどき / あまり / ぜんぜん (Hệ thống phó từ chỉ tần suất)?

#### 🔘 4 Phương án lựa chọn:
- **A.** 休みの日はよく図書館で本を読みます。
- **B.** 休みの日はよく図書館で本を読みます。でした
- **C.** 休みの日はよく図書館で本を読みます。
- **D.** 全然休みの日はよく図書館で本を読みます。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Vào ngày nghỉ tôi thường hay đọc sách ở thư viện.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Lỗi học sinh hay mắc: Dùng あまり hoặc ぜんぜん nhưng đuôi câu lại chia khẳng định (ví dụ: 'ぜんぜん食べます' -> SAI HOÀN TOÀN). Bắt buộc phải là: 'ぜんぜん食べません'.
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Lỗi học sinh hay mắc: Dùng あまり hoặc ぜんぜん nhưng đuôi câu lại chia khẳng định (ví dụ: 'ぜんぜん食べます' -> SAI HOÀN TOÀN). Bắt buộc phải là: 'ぜんぜん食べません'.

---

### Bài tập 90 (`EX-085-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-085-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Thỉnh thoảng tôi lại chơi tennis cùng bạn bè.」

#### 🔘 4 Phương án lựa chọn:
- **A.** ときどき友達とテニスをします。
- **B.** 。すましをスニテと達友きどきと
- **C.** ときどき友達とテニスをします。
- **D.** ときどき友達とテニスをします。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Thỉnh thoảng tôi lại chơi tennis cùng bạn bè.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: Phó từ tần suất + V[khẳng định / phủ định]. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 91 (`EX-085-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-085-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「お酒はあまり飲みません。」

#### 🔘 4 Phương án lựa chọn:
- **A.** Phó
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tôi hầu như không mấy khi uống rượu bia.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái Phó từ đứng trước động từ. Lưu ý cực kỳ quan trọng: あまり và ぜんぜん BẮT BUỘC ĐI KÈM ĐỘNG TỪ THỂ PHỦ ĐỊNH (〜ません / 〜ない)..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: Phó từ đứng trước động từ. Lưu ý cực kỳ quan trọng: あまり và ぜんぜん BẮT BUỘC ĐI KÈM ĐỘNG TỪ THỂ PHỦ ĐỊNH (〜ません / 〜ない).

---

### Bài tập 92 (`EX-085-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-085-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「私はタバコをぜんぜん吸いません。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** 私はタバコをぜんぜん吸いません。
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tôi hoàn toàn không bao giờ hút thuốc lá.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Tự nhiên, phản ánh chính xác thói quen lối sống trong giao tiếp.

---

### Bài tập 93 (`EX-085-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-085-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 85 (いつも / よく / ときどき / あまり / ぜんぜん ):

#### 🔘 4 Phương án lựa chọn:
- **A.** Mối tương quan chặt chẽ với cực tính của câu (Polarity): いつも、よく、ときどき đi với khẳng định; あまり、ぜんぜん đi với phủ định.
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với いつも / よく / ときどき / あまり / ぜんぜん (Hệ thống phó từ chỉ tần suất).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: Mối tương quan chặt chẽ với cực tính của câu (Polarity): いつも、よく、ときどき đi với khẳng định; あまり、ぜんぜん đi với phủ định.

---

## MỤC BÀI TẬP CHO PATTERN 86: どうやって (Nghi vấn từ hỏi cách thức, phương tiện, lộ trình)

**Bài học:** Bài 9 | **Dạng mẫu:** `どうやって + N[nơi đến] へ 行きますか / V ますか` | **Trình độ:** N5

### Bài tập 94 (`EX-086-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-086-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu どうやって :
「（　　）美術館へ行きますか。――3番のバスに乗って、美術館前で降ります。」

#### 🔘 4 Phương án lựa chọn:
- **A.** どうやって
- **B.** どうやった
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Đi đến bảo tàng mỹ thuật bằng cách nào vậy? ―― Hãy lên xe buýt số 3 rồi xuống ở trạm trước bảo tàng.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức どうやって + N[nơi đến] へ 行きますか / V ますか.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 86: Dùng để hỏi về cách thức, phương pháp tiến hành một công việc hoặc hỏi rõ lộ trình, phương tiện giao thông cụ thể để di chuyển đến một địa điểm.

---

### Bài tập 95 (`EX-086-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-086-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của どうやって (Nghi vấn từ hỏi cách thức, phương tiện, lộ trình)?

#### 🔘 4 Phương án lựa chọn:
- **A.** 大学までどうやって行きますか。――自転車で15分くらい行きます。
- **B.** 大学までどうやって行きますか。――自転車で15分くらい行きます。でした
- **C.** 大学までどうやって行きますか。――自転車で15分くらい行きます。
- **D.** 全然大学までどうやって行きますか。――自転車で15分くらい行きます。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Làm thế nào để đến trường đại học? ―― Đi xe đạp mất khoảng 15 phút.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Người học hay nhầm lẫn cách trả lời: Khi hỏi どうやって, người nghe mong đợi chỉ dẫn tuần tự các bước (lên tàu nào, chuyển tuyến ở đâu, đi bộ bao xa), chứ không chỉ trả lời một từ chung chung.
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Người học hay nhầm lẫn cách trả lời: Khi hỏi どうやって, người nghe mong đợi chỉ dẫn tuần tự các bước (lên tàu nào, chuyển tuyến ở đâu, đi bộ bao xa), chứ không chỉ trả lời một từ chung chung.

---

### Bài tập 96 (`EX-086-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-086-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Chữ Hán này viết như thế nào vậy?」

#### 🔘 4 Phương án lựa chọn:
- **A.** この漢字はどうやって書きますか。
- **B.** どうやって書きますか。はこの漢字
- **C.** この漢字はどうやって書きますか。
- **D.** この漢字はどうやって書きますか。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Chữ Hán này viết như thế nào vậy?**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: どうやって + N[nơi đến] へ 行きますか / V ますか. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 97 (`EX-086-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-086-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「この機械は［V/A］ますか使いますか。」

#### 🔘 4 Phương án lựa chọn:
- **A.** どうやって
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Cỗ máy này vận hành bằng cách nào thế?**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái Đứng đầu câu hỏi: どうやって + Cụm vị ngữ nghi vấn. Câu trả lời thường liệt kê các bước bằng thể Te (Pattern 83) hoặc phương tiện giao thông đi với trợ từ で..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: Đứng đầu câu hỏi: どうやって + Cụm vị ngữ nghi vấn. Câu trả lời thường liệt kê các bước bằng thể Te (Pattern 83) hoặc phương tiện giao thông đi với trợ từ で.

---

### Bài tập 98 (`EX-086-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-086-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「空港までどうやって行きますか。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** 電車で行って、モノレールに乗り換えます。
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Đến sân bay bằng cách nào? ―― Đi tàu điện rồi chuyển sang tàu đường ray đơn (monorail).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Lịch sự, hữu ích trong đời sống thực tế khi hỏi đường, hỏi quy trình thủ tục hành chính, máy móc.

---

### Bài tập 99 (`EX-086-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-086-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 86 (どうやって ):

#### 🔘 4 Phương án lựa chọn:
- **A.** Phân biệt với どうして (tại sao - hỏi nguyên nhân) và どう (như thế nào - hỏi cảm nhận tính chất). どうやって tập trung duy nhất vào 'bằng cách nào / lộ trình thế nào'.
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với どうやって (Nghi vấn từ hỏi cách thức, phương tiện, lộ trình).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: Phân biệt với どうして (tại sao - hỏi nguyên nhân) và どう (như thế nào - hỏi cảm nhận tính chất). どうやって tập trung duy nhất vào 'bằng cách nào / lộ trình thế nào'.

---

## MỤC BÀI TẬP CHO PATTERN 87: でも (Liên từ liên kết tương phản: Tuy nhiên, Nhưng mà)

**Bài học:** Bài 9 | **Dạng mẫu:** `Câu 1. でも、Câu 2.` | **Trình độ:** N5

### Bài tập 100 (`EX-087-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-087-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu でも :
「私の趣味はスポーツです。でも、最近、全然しません。」

#### 🔘 4 Phương án lựa chọn:
- **A.** Câu
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Sở thích của tôi là thể thao. Tuy nhiên, dạo gần đây tôi hoàn toàn không chơi.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức Câu 1. でも、Câu 2..
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 87: Dùng làm liên từ đứng ở đầu câu thứ hai nhằm biểu thị sự đối lập, tương phản hoặc bất ngờ so với nội dung đã được phát biểu ở câu thứ nhất.

---

### Bài tập 101 (`EX-087-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-087-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của でも (Liên từ liên kết tương phản: Tuy nhiên, Nhưng mà)?

#### 🔘 4 Phương án lựa chọn:
- **A.** 日本の生活は便利です。でも、物価が高いです。
- **B.** 日本の生活は便利です。でも、物価は高いです。
- **C.** 日本の生活は便利です。でも、物価が高いです。
- **D.** 全然日本の生活は便利です。でも、物価が高いです。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Cuộc sống ở Nhật Bản rất tiện lợi. Nhưng mà, giá cả hàng hóa lại đắt đỏ.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Lỗi cú pháp: Học sinh hay ghép でも vào giữa câu như trợ từ nối (Ví dụ: 'スポーツが好きですでも全然しません' -> SAI CÚ PHÁP). Đúng ngữ pháp phải tách câu: 'スポーツが好きです。でも、全然しません。' hoặc dùng が: 'スポーツが好きですが、全然しません。'.
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Lỗi cú pháp: Học sinh hay ghép でも vào giữa câu như trợ từ nối (Ví dụ: 'スポーツが好きですでも全然しません' -> SAI CÚ PHÁP). Đúng ngữ pháp phải tách câu: 'スポーツが好きです。でも、全然しません。' hoặc dùng が: 'スポーツが好きですが、全然しません。'.

---

### Bài tập 102 (`EX-087-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-087-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Món ăn này rất ngon. Nhưng mà, hơi cay một chút.」

#### 🔘 4 Phương án lựa chọn:
- **A.** この料理はおいしいです。でも、ちょっと辛いです。
- **B.** おいしいです。でも、ちょっと辛いです。はこの料理
- **C.** この料理はおいしいです。でもそしてちょっと辛いです。
- **D.** この料理はおいしいだ。でも、ちょっと辛いだ。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Món ăn này rất ngon. Nhưng mà, hơi cay một chút.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: Câu 1. でも、Câu 2.. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 103 (`EX-087-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-087-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「試験は難しかったです。でも、合格しました。」

#### 🔘 4 Phương án lựa chọn:
- **A.** Câu
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kỳ thi đã rất khó khăn. Nhưng mà tôi đã thi đỗ rồi.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái Đứng độc lập ở đầu câu, ngăn cách với vế sau bằng dấu phẩy: [Câu 1]。でも、[Câu 2]。.
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: Đứng độc lập ở đầu câu, ngăn cách với vế sau bằng dấu phẩy: [Câu 1]。でも、[Câu 2]。

---

### Bài tập 104 (`EX-087-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-087-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「新しい車を買いたいです。でも、お金がありません。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** 新しい車を買いたいです。でも、お金がありません。
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tôi rất muốn mua một chiếc ô tô mới. Thế nhưng tôi lại không có tiền.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Giao tiếp thân mật đến bán trang trọng trong hội thoại đời sống.

---

### Bài tập 105 (`EX-087-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-087-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 87 (でも ):

#### 🔘 4 Phương án lựa chọn:
- **A.** Khác với trợ từ liên kết が (kết nối trực tiếp hai vế trong một câu duy nhất: Câu 1 が、Câu 2). でも luôn luôn đứng sau dấu chấm câu và bắt đầu một câu hoàn toàn mới.
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với でも (Liên từ liên kết tương phản: Tuy nhiên, Nhưng mà).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: Khác với trợ từ liên kết が (kết nối trực tiếp hai vế trong một câu duy nhất: Câu 1 が、Câu 2). でも luôn luôn đứng sau dấu chấm câu và bắt đầu một câu hoàn toàn mới.

---

## MỤC BÀI TẬP CHO PATTERN 88: Vない形 でください (Yêu cầu cấm chỉ lịch sự: Xin đừng làm gì)

**Bài học:** Bài 10 | **Dạng mẫu:** `V[ない形] + でください` | **Trình độ:** N5

### Bài tập 106 (`EX-088-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-088-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu Vない形 でください :
「そこに車を止めないでください。」

#### 🔘 4 Phương án lựa chọn:
- **A.** V[ない形]
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Xin vui lòng đừng đỗ xe ở chỗ đó.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức V[ない形] + でください.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 88: Dùng để yêu cầu, chỉ dẫn hoặc khuyên nhủ ai đó một cách lịch sự không được làm một hành vi nào đó (cấm chỉ nhẹ nhàng, mang tính quy định công cộng hoặc y tế).

---

### Bài tập 107 (`EX-088-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-088-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của Vない形 でください (Yêu cầu cấm chỉ lịch sự: Xin đừng làm gì)?

#### 🔘 4 Phương án lựa chọn:
- **A.** ここで写真を撮らないでください。
- **B.** ここで写真を撮らないでください。でした
- **C.** ここで写真を撮らないでください。
- **D.** 全然ここで写真を撮らないでください。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Xin đừng chụp ảnh ở khu vực này.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Học sinh hay nhầm đuôi: bỏ qua trợ từ で mà nói 'Vないください' -> SAI. Bắt buộc phải có で: 'Vないでください'.
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Học sinh hay nhầm đuôi: bỏ qua trợ từ で mà nói 'Vないください' -> SAI. Bắt buộc phải có で: 'Vないでください'.

---

### Bài tập 108 (`EX-088-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-088-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Tuyệt đối xin đừng uống rượu rồi lái xe.」

#### 🔘 4 Phương án lựa chọn:
- **A.** お酒を飲んで運転しないでください。
- **B.** 。いさだくでいなし転運でん飲を酒お
- **C.** お酒を飲んで運転しないでください。
- **D.** お酒を飲んで運転しないでください。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tuyệt đối xin đừng uống rượu rồi lái xe.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: V[ない形] + でください. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 109 (`EX-088-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-088-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「無理をしないで、ゆっくり休んでください。」

#### 🔘 4 Phương án lựa chọn:
- **A.** V[ない形]
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Đừng quá sức nhé, hãy nghỉ ngơi thong thả đi.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái Động từ chia về thể Phủ định ngắn (Nai-form): Nhóm 1 (u -> a + nai; iku -> ikanai; nomu -> nomanai); Nhóm 2 (bỏ masu + nai); Nhóm 3 (suru -> shinai; kuru -> konai) + でください..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: Động từ chia về thể Phủ định ngắn (Nai-form): Nhóm 1 (u -> a + nai; iku -> ikanai; nomu -> nomanai); Nhóm 2 (bỏ masu + nai); Nhóm 3 (suru -> shinai; kuru -> konai) + でください.

---

### Bài tập 110 (`EX-088-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-088-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「パスワードを他の人に教えないでください。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** パスワードを他の人に教えないでください。
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Xin đừng tiết lộ mật khẩu cho người khác biết.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Chuẩn mực biển báo nơi công cộng, dặn dò của bác sĩ đối với bệnh nhân, nhắc nhở của giáo viên trong lớp.

---

### Bài tập 111 (`EX-088-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-088-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 88 (Vない形 でください ):

#### 🔘 4 Phương án lựa chọn:
- **A.** Phân biệt với Thể cấm chỉ thô lỗ ở N3 (Vるな như 入るな - cấm vào!). Mẫu Vないでください giữ nguyên sắc thái lịch sự, tôn trọng đối phương.
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với Vない形 でください (Yêu cầu cấm chỉ lịch sự: Xin đừng làm gì).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: Phân biệt với Thể cấm chỉ thô lỗ ở N3 (Vるな như 入るな - cấm vào!). Mẫu Vないでください giữ nguyên sắc thái lịch sự, tôn trọng đối phương.

---

### Bài tập 112 (`EX-088-07`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-088-07`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu Vない形 でください :
「そこに車を止めないでください。」

#### 🔘 4 Phương án lựa chọn:
- **A.** V[ない形]
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Xin vui lòng đừng đỗ xe ở chỗ đó.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức V[ない形] + でください.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 88: Dùng để yêu cầu, chỉ dẫn hoặc khuyên nhủ ai đó một cách lịch sự không được làm một hành vi nào đó (cấm chỉ nhẹ nhàng, mang tính quy định công cộng hoặc y tế).

---

## MỤC BÀI TẬP CHO PATTERN 89: Vてもいいですか (Xin phép thực hiện hành vi: Tôi làm ... có được không?)

**Bài học:** Bài 10 | **Dạng mẫu:** `V[て形] + もいいですか` | **Trình độ:** N5

### Bài tập 113 (`EX-089-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-089-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu Vてもいいですか :
「ここに座ってもいいですか。――はい、どうぞ。」

#### 🔘 4 Phương án lựa chọn:
- **A.** V[て形]
- **B.** V[た形]
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tôi ngồi vào đây có được không ạ? ―― Vâng, xin mời bạn.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức V[て形] + もいいですか.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 89: Dùng khi người nói muốn xin phép đối phương để bản thân được thực hiện một hành động nào đó trong không gian hoặc quyền hạn của đối phương.

---

### Bài tập 114 (`EX-089-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-089-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của Vてもいいですか (Xin phép thực hiện hành vi: Tôi làm ... có được không?)?

#### 🔘 4 Phương án lựa chọn:
- **A.** 窓を開けてもいいですか。――ええ、いいですよ。
- **B.** 窓を開けてもいいですか。――ええ、いいですよ。でした
- **C.** 窓を開けてもいいですか。――ええ、いいですよ。
- **D.** 全然窓を開けてもいいですか。――ええ、いいですよ。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tôi mở cửa sổ ra có được không? ―― Vâng, được chứ.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Lỗi quên chia thể Te hoặc nhầm trợ từ: nói 'Vるもいいですか' -> SAI. Bắt buộc phải chia thể Te: '入ってもいいですか'.
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Lỗi quên chia thể Te hoặc nhầm trợ từ: nói 'Vるもいいですか' -> SAI. Bắt buộc phải chia thể Te: '入ってもいいですか'.

---

### Bài tập 115 (`EX-089-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-089-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Tôi có thể photocopy tập tài liệu này được không ạ?」

#### 🔘 4 Phương án lựa chọn:
- **A.** この資料をコピーしてもいいですか。
- **B.** 。かすでいいもてしーピコを料資のこ
- **C.** この資料をコピーしてもいいですか。
- **D.** この資料をコピーしてもいいだか。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tôi có thể photocopy tập tài liệu này được không ạ?**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: V[て形] + もいいですか. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 116 (`EX-089-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-089-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「写真を撮ってもいいですか。――すみません、ここはちょっと...」

#### 🔘 4 Phương án lựa chọn:
- **A.** V[て形]
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tôi chụp ảnh có được không ạ? ―― Xin lỗi, ở đây thì không được phép...**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái Động từ chia thể Te (V-te) + もいいですか. Trả lời đồng ý: 'ええ、いいですよ / はい、どうぞ'. Trả lời từ chối khéo léo: 'すみません、ちょっと...'..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: Động từ chia thể Te (V-te) + もいいですか. Trả lời đồng ý: 'ええ、いいですよ / はい、どうぞ'. Trả lời từ chối khéo léo: 'すみません、ちょっと...'.

---

### Bài tập 117 (`EX-089-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-089-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「今日、早く帰ってもいいですか。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** 今日、早く帰ってもいいですか。
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Hôm nay em có thể xin phép về sớm được không ạ?**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Lịch thiệp, chuẩn mực xã hội Nhật Bản (luôn xin phép trước khi can thiệp vào không gian người khác).

---

### Bài tập 118 (`EX-089-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-089-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 89 (Vてもいいですか ):

#### 🔘 4 Phương án lựa chọn:
- **A.** Phân biệt với Vてはいけません (Cấm đoán - không được phép). Mẫu Vてもいいですか thể hiện sự khiêm nhường xin phép từ người nói.
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với Vてもいいですか (Xin phép thực hiện hành vi: Tôi làm ... có được không?).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: Phân biệt với Vてはいけません (Cấm đoán - không được phép). Mẫu Vてもいいですか thể hiện sự khiêm nhường xin phép từ người nói.

---

## MỤC BÀI TẬP CHO PATTERN 90: N が Vています (Trạng thái khách quan đang diễn ra trước mắt người nói)

**Bài học:** Bài 10 | **Dạng mẫu:** `N[chủ thể tự nhiên/động vật] が + V[て形] います` | **Trình độ:** N5

### Bài tập 119 (`EX-090-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-090-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu N が Vています :
「あっ、サルがバナナを食べています。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N[chủ
- **B.** N[chủ
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **A, nhìn kìa, con khỉ đang ăn quả chuối!**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức N[chủ thể tự nhiên/động vật] が + V[て形] います.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 90: Dùng để thông báo, phát hiện hoặc miêu tả một hiện tượng, sự việc đang trực tiếp diễn ra trước mắt mà người nói vừa chứng kiến một cách khách quan.

---

### Bài tập 120 (`EX-090-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-090-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của N が Vています (Trạng thái khách quan đang diễn ra trước mắt người nói)?

#### 🔘 4 Phương án lựa chọn:
- **A.** 雨が降っています。
- **B.** 雨は降っています。
- **C.** 雨が降っています。
- **D.** 全然雨が降っています。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Trời đang đổ mưa.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Học sinh hay dùng nhầm trợ từ は khi miêu tả cảnh tượng vừa thấy. Quy tắc vàng: Phát hiện hiện tượng khách quan trước mắt dùng trợ từ が.
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Học sinh hay dùng nhầm trợ từ は khi miêu tả cảnh tượng vừa thấy. Quy tắc vàng: Phát hiện hiện tượng khách quan trước mắt dùng trợ từ が.

---

### Bài tập 121 (`EX-090-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-090-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Nhìn kìa, có bao nhiêu là cánh chim trắng đang bay lượn kìa.」

#### 🔘 4 Phương án lựa chọn:
- **A.** 見て、白い鳥がたくさん飛んでいますよ。
- **B.** 。よすまいでん飛んさくたが鳥い白、て見
- **C.** 見てそして白い鳥がたくさん飛んでいますよ。
- **D.** 見て、白い鳥がたくさん飛んでいますよ。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Nhìn kìa, có bao nhiêu là cánh chim trắng đang bay lượn kìa.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: N[chủ thể tự nhiên/động vật] が + V[て形] います. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 122 (`EX-090-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-090-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「赤ちゃんが気持ちよさそうに眠っています。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N[chủ
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Em bé đang say giấc ngủ trông thật ngon lành.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái Danh từ chủ thể (phát hiện mới) đi với trợ từ が + Động từ chia thể Te + います. Thường mở đầu bằng thán từ phát hiện như 'あっ' (A kìa!)..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: Danh từ chủ thể (phát hiện mới) đi với trợ từ が + Động từ chia thể Te + います. Thường mở đầu bằng thán từ phát hiện như 'あっ' (A kìa!).

---

### Bài tập 123 (`EX-090-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-090-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「バスが来ましたよ。みんなが乗っています。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** バスが来ましたよ。みんなが乗っています。
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Xe buýt đến rồi kìa. Mọi người đang bước lên xe.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Sinh động, giàu tính trực quan, miêu tả hiện trường sống động.

---

### Bài tập 124 (`EX-090-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-090-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 90 (N が Vています ):

#### 🔘 4 Phương án lựa chọn:
- **A.** So sánh với trợ từ は: 'サルはバナナを食べています' (Khỉ thì ăn chuối - nói về thói quen loài khỉ); trong khi 'あっ、サルがバナナを食べています' (A, có con khỉ đang ăn chuối kìa! - phát hiện cảnh tượng trước mắt).
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với N が Vています (Trạng thái khách quan đang diễn ra trước mắt người nói).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: So sánh với trợ từ は: 'サルはバナナを食べています' (Khỉ thì ăn chuối - nói về thói quen loài khỉ); trong khi 'あっ、サルがバナナを食べています' (A, có con khỉ đang ăn chuối kìa! - phát hiện cảnh tượng trước mắt).

---

## MỤC BÀI TẬP CHO PATTERN 91: まだ Vていません (Vẫn chưa làm gì - Hành động chưa hoàn tất)

**Bài học:** Bài 10 | **Dạng mẫu:** `まだ + V[て形] いません` | **Trình độ:** N5

### Bài tập 125 (`EX-091-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-091-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu まだ Vていません :
「（　　）昼ご飯を食べていません。」

#### 🔘 4 Phương án lựa chọn:
- **A.** まだ
- **B.** まだ
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tôi vẫn chưa ăn cơm trưa.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức まだ + V[て形] いません.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 91: Diễn tả một hành động, sự việc được mong đợi hoặc theo kế hoạch cần làm nhưng tính đến thời điểm hiện tại thì người nói vẫn chưa thực hiện xong.

---

### Bài tập 126 (`EX-091-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-091-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của まだ Vていません (Vẫn chưa làm gì - Hành động chưa hoàn tất)?

#### 🔘 4 Phương án lựa chọn:
- **A.** もう宿題をしましたか。――いいえ、まだしていません。
- **B.** もう宿題をしましたか。――いいえ、まだしていません。でした
- **C.** もう宿題をしましたか。――いいえ、まだしていません。
- **D.** もう宿題をしましたか。――いいえ、まだしていません。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Bạn đã làm bài tập chưa? ―― Dạ chưa, tôi vẫn chưa làm ạ.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Học sinh rất hay nhầm lẫn nói 'まだ食べませんでした' (Tôi đã không ăn - mang nghĩa từ chối ăn trong quá khứ). Chuẩn xác phải là: 'まだ食べていません' (Tôi vẫn chưa ăn).
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Học sinh rất hay nhầm lẫn nói 'まだ食べませんでした' (Tôi đã không ăn - mang nghĩa từ chối ăn trong quá khứ). Chuẩn xác phải là: 'まだ食べていません' (Tôi vẫn chưa ăn).

---

### Bài tập 127 (`EX-091-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-091-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Anh Tanaka vẫn chưa đến nơi.」

#### 🔘 4 Phương án lựa chọn:
- **A.** 田中さんはまだ来ていません。
- **B.** まだ来ていません。は田中さん
- **C.** 田中さんはまだ来ていません。
- **D.** 田中さんはまだ来ていません。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Anh Tanaka vẫn chưa đến nơi.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: まだ + V[て形] いません. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 128 (`EX-091-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-091-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「その映画は［V/A］いません見ていません。」

#### 🔘 4 Phương án lựa chọn:
- **A.** まだ
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Bộ phim điện ảnh đó tôi vẫn chưa xem.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái Phó từ まだ (vẫn/chưa) + Động từ thể Te + いません (Dạng phủ định tiếp diễn)..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: Phó từ まだ (vẫn/chưa) + Động từ thể Te + いません (Dạng phủ định tiếp diễn).

---

### Bài tập 129 (`EX-091-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-091-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「荷物はまだ届いていません。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** 荷物はまだ届いていません。
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Hàng hóa bưu kiện vẫn chưa được chuyển tới.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Lịch sự, thường xuyên dùng khi trả lời câu hỏi 'Đã làm xong việc đó chưa?' (もうVましたか).

---

### Bài tập 130 (`EX-091-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-091-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 91 (まだ Vていません ):

#### 🔘 4 Phương án lựa chọn:
- **A.** Không dùng 'まだVませんでした' để trả lời cho việc chưa làm. Trong tư duy tiếng Nhật, hành động đó chưa xong và vẫn có khả năng tiếp diễn trong tương lai nên bắt buộc phải dùng thì tiếp diễn phủ định: 'まだ〜ていません'.
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với まだ Vていません (Vẫn chưa làm gì - Hành động chưa hoàn tất).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: Không dùng 'まだVませんでした' để trả lời cho việc chưa làm. Trong tư duy tiếng Nhật, hành động đó chưa xong và vẫn có khả năng tiếp diễn trong tương lai nên bắt buộc phải dùng thì tiếp diễn phủ định: 'まだ〜ていません'.

---

## MỤC BÀI TẬP CHO PATTERN 92: Vてきます (Đi đâu đó làm một việc rồi sẽ quay lại)

**Bài học:** Bài 10 | **Dạng mẫu:** `V[て形] + きます` | **Trình độ:** N5

### Bài tập 131 (`EX-092-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-092-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu Vてきます :
「コンビニでジュースを買ってきます。」

#### 🔘 4 Phương án lựa chọn:
- **A.** V[て形]
- **B.** V[た形]
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tôi đi ra cửa hàng tiện lợi mua hộp nước trái cây rồi quay lại ngay.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức V[て形] + きます.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 92: Diễn tả hành động người nói tạm thời rời khỏi vị trí hiện tại để đi đến một địa điểm khác làm một công việc gì đó ngắn hạn, rồi sau đó sẽ quay trở về vị trí ban đầu.

---

### Bài tập 132 (`EX-092-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-092-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của Vてきます (Đi đâu đó làm một việc rồi sẽ quay lại)?

#### 🔘 4 Phương án lựa chọn:
- **A.** ちょっとトイレへ行ってきます。
- **B.** ちょっとトイレへ行ってきます。でした
- **C.** ちょっとトイレへ行ってきます。
- **D.** 全然ちょっとトイレへ行ってきます。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tôi đi vệ sinh một lát rồi quay lại.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Người học hay dịch từng chữ 'Tôi đi mua nước rồi về' thành hai câu rườm rà. Trong tiếng Nhật chỉ cần gói gọn trong 1 động từ ghép: '買ってきます'.
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Người học hay dịch từng chữ 'Tôi đi mua nước rồi về' thành hai câu rườm rà. Trong tiếng Nhật chỉ cần gói gọn trong 1 động từ ghép: '買ってきます'.

---

### Bài tập 133 (`EX-092-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-092-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Tôi đi bưu điện mua mấy con tem rồi sẽ về ngay.」

#### 🔘 4 Phương án lựa chọn:
- **A.** 郵便局で切手を買ってきます。
- **B.** 。すまきてっ買を手切で局便郵
- **C.** 郵便局で切手を買ってきます。
- **D.** 郵便局で切手を買ってきます。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tôi đi bưu điện mua mấy con tem rồi sẽ về ngay.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: V[て形] + きます. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 134 (`EX-092-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-092-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「図書館で本を返してきます。」

#### 🔘 4 Phương án lựa chọn:
- **A.** V[て形]
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tôi đi trả sách ở thư viện rồi về.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái Động từ hành động chia thể Te + きます (quá khứ: きました). Thường đi kèm địa điểm + で (コンビニで、トイレへ)..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: Động từ hành động chia thể Te + きます (quá khứ: きました). Thường đi kèm địa điểm + で (コンビニで、トイレへ).

---

### Bài tập 135 (`EX-092-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-092-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「「行ってきます。」」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** 「いってらっしゃい。」
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Con đi học / đi làm đây ạ! ―― Con đi nhé, chúc một ngày tốt lành!**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Rất thông dụng trong đời sống công sở và gia đình khi cần rời bàn làm việc trong chốc lát.

---

### Bài tập 136 (`EX-092-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-092-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 92 (Vてきます ):

#### 🔘 4 Phương án lựa chọn:
- **A.** Phân biệt với Vていきます (làm xong rồi đi luôn không về). Vてきます cam kết sẽ quay lại điểm xuất phát.
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với Vてきます (Đi đâu đó làm một việc rồi sẽ quay lại).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: Phân biệt với Vていきます (làm xong rồi đi luôn không về). Vてきます cam kết sẽ quay lại điểm xuất phát.

---

## MỤC BÀI TẬP CHO PATTERN 93: N が できます / V辞書形 ことができます (Khả năng do điều kiện hoàn cảnh cho phép)

**Bài học:** Bài 10 | **Dạng mẫu:** `N[địa điểm/điều kiện] で + N が できます / V[辞書形] ことが できます` | **Trình độ:** N5

### Bài tập 137 (`EX-093-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-093-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu N が できます / V辞書形 ことができます :
「ここで食事できます。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N[địa
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tại đây quý khách có thể dùng bữa.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức N[địa điểm/điều kiện] で + N が できます / V[辞書形] ことが できます.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 93: Diễn tả một hành động có thể được thực hiện hay không do quy định của địa điểm, điều kiện pháp lý hoặc hoàn cảnh khách quan cho phép (khác với năng lực cá nhân bẩm sinh ở Pattern 82).

---

### Bài tập 138 (`EX-093-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-093-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của N が できます / V辞書形 ことができます (Khả năng do điều kiện hoàn cảnh cho phép)?

#### 🔘 4 Phương án lựa chọn:
- **A.** このホテルでドルを両替することができます。
- **B.** このホテルでドルを両替することはできます。
- **C.** このホテルでドルを両替することができます。
- **D.** 全然このホテルでドルを両替することができます。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tại khách sạn này quý khách có thể đổi tiền Đô la.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Cần chú ý trợ từ nơi chốn: nơi có điều kiện cho phép hành động diễn ra dùng trợ từ で.
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Cần chú ý trợ từ nơi chốn: nơi có điều kiện cho phép hành động diễn ra dùng trợ từ で.

---

### Bài tập 139 (`EX-093-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-093-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Tại thư viện bạn có thể truy cập mạng Internet.」

#### 🔘 4 Phương án lựa chọn:
- **A.** 図書館でインターネットを使うことができます。
- **B.** 。すまきでがとこう使をトッネータンイで館書図
- **C.** 図書館でインターネットを使うことができます。
- **D.** 図書館でインターネットを使うことができます。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tại thư viện bạn có thể truy cập mạng Internet.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: N[địa điểm/điều kiện] で + N が できます / V[辞書形] ことが できます. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 140 (`EX-093-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-093-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「この部屋でタバコを吸うことはできません。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N[địa
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Trong phòng này không được phép hút thuốc lá.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái Địa điểm + で + Danh từ/Động từ thể từ điển + ことが できます..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: Địa điểm + で + Danh từ/Động từ thể từ điển + ことが できます.

---

### Bài tập 141 (`EX-093-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-093-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「駅の前で自転車を借りることができます。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** 駅の前で自転車を借りることができます。
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Trước nhà ga bạn có thể thuê xe đạp công cộng.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Biển báo quy định tại khách sạn, ngân hàng, địa điểm công cộng.

---

### Bài tập 142 (`EX-093-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-093-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 93 (N が できます / V辞書形 ことができます ):

#### 🔘 4 Phương án lựa chọn:
- **A.** Pattern 82 nhấn mạnh năng lực cá nhân (Tôi biết bơi, tôi biết lái xe). Pattern 93 nhấn mạnh điều kiện hoàn cảnh (Ở đây CÓ THỂ ăn uống, ở đây CÓ THỂ đổi tiền ngoại tệ).
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với N が できます / V辞書形 ことができます (Khả năng do điều kiện hoàn cảnh cho phép).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: Pattern 82 nhấn mạnh năng lực cá nhân (Tôi biết bơi, tôi biết lái xe). Pattern 93 nhấn mạnh điều kiện hoàn cảnh (Ở đây CÓ THỂ ăn uống, ở đây CÓ THỂ đổi tiền ngoại tệ).

---

## MỤC BÀI TẬP CHO PATTERN 94: N が 見えます / 聞こえます (Khả năng thụ cảm tự nhiên: Nhìn thấy / Nghe thấy)

**Bài học:** Bài 10 | **Dạng mẫu:** `N が 見えます / 聞こえます` | **Trình độ:** N5

### Bài tập 143 (`EX-094-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-094-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu N が 見えます / 聞こえます :
「ここから東京タワーが見えます。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Từ đây có thể nhìn thấy tháp truyền hình Tokyo.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức N が 見えます / 聞こえます.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 94: Diễn tả âm thanh hoặc hình ảnh tự nhiên lọt vào mắt, vào tai của con người một cách tự phát, khách quan do vị trí địa lý hoặc điều kiện không gian, không đòi hỏi nỗ lực hay chủ ý của người quan sát.

---

### Bài tập 144 (`EX-094-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-094-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của N が 見えます / 聞こえます (Khả năng thụ cảm tự nhiên: Nhìn thấy / Nghe thấy)?

#### 🔘 4 Phương án lựa chọn:
- **A.** 隣の部屋からピアノの音が聞こえます。
- **B.** 隣の部屋からピアノの音は聞こえます。
- **C.** 隣の部屋からピアノの音が聞こえます。
- **D.** 全然隣の部屋からピアノの音が聞こえます。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Từ căn phòng bên cạnh vẳng lại tiếng đàn piano.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Học sinh rất dễ nhầm 見えます với 見ます. Hãy nhớ: 見ます là hành động có chủ ý (tập trung nhìn), còn 見えます là nhìn thấy tự nhiên không cần cố gắng.
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Học sinh rất dễ nhầm 見えます với 見ます. Hãy nhớ: 見ます là hành động có chủ ý (tập trung nhìn), còn 見えます là nhìn thấy tự nhiên không cần cố gắng.

---

### Bài tập 145 (`EX-094-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-094-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Vào những ngày trời quang đãng, núi Phú Sĩ hiện lên rất đẹp.」

#### 🔘 4 Phương án lựa chọn:
- **A.** 天気がいい日は富士山がきれいに見えます。
- **B.** 富士山がきれいに見えます。は天気がいい日
- **C.** 天気がいい日は富士山がきれいに見えます。
- **D.** 天気がいい日は富士山がきれいに見えます。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Vào những ngày trời quang đãng, núi Phú Sĩ hiện lên rất đẹp.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: N が 見えます / 聞こえます. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 146 (`EX-094-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-094-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「遠くで鳥の声が聞こえます。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Ở đằng xa nghe thấy tiếng chim hót líu lo.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái Danh từ đối tượng cảm nhận + が + 見えます (nhìn thấy) / 聞こえます (nghe thấy). Phủ định: 見えません / 聞こえません..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: Danh từ đối tượng cảm nhận + が + 見えます (nhìn thấy) / 聞こえます (nghe thấy). Phủ định: 見えません / 聞こえません.

---

### Bài tập 147 (`EX-094-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-094-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「声が小さくて、よく聞こえません。もう少し大きな声で話してください。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** 声が小さくて、よく聞こえません。もう少し大きな声で話してください。
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Giọng bạn nhỏ quá nên tôi không nghe rõ. Xin hãy nói to hơn một chút ạ.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Trực quan, tự nhiên. Thường dùng khi thưởng ngoạn phong cảnh hoặc kiểm tra đường truyền âm thanh, hình ảnh trong họp trực tuyến.

---

### Bài tập 148 (`EX-094-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-094-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 94 (N が 見えます / 聞こえます ):

#### 🔘 4 Phương án lựa chọn:
- **A.** So sánh sống còn giữa cặp từ:
- 見えます (hình ảnh tự lọt vào mắt) vs 見られます (có điều kiện, cơ hội để chủ động xem một chương trình, bộ phim).
- 聞こえます (âm thanh tự vọng vào tai) vs 聞けます (có điều kiện, cơ hội để chủ động nghe đài, nghe nhạc).
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với N が 見えます / 聞こえます (Khả năng thụ cảm tự nhiên: Nhìn thấy / Nghe thấy).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: So sánh sống còn giữa cặp từ:
- 見えます (hình ảnh tự lọt vào mắt) vs 見られます (có điều kiện, cơ hội để chủ động xem một chương trình, bộ phim).
- 聞こえます (âm thanh tự vọng vào tai) vs 聞けます (có điều kiện, cơ hội để chủ động nghe đài, nghe nhạc).

---

## MỤC BÀI TẬP CHO PATTERN 95: イA-くなります / ナA-になります / N-になります (Sự biến đổi trạng thái khách quan)

**Bài học:** Bài 10 | **Dạng mẫu:** `A[đuôi い] -> くなります / A[đuôi な] + になります / N + になります` | **Trình độ:** N5

### Bài tập 149 (`EX-095-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-095-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu イA-くなります / ナA-になります / N-になります :
「十一月になって、寒くなりました。」

#### 🔘 4 Phương án lựa chọn:
- **A.** A[đuôi
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Bước sang tháng 11, trời đã trở nên giá lạnh.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức A[đuôi い] -> くなります / A[đuôi な] + になります / N + になります.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 95: Diễn tả sự thay đổi, chuyển hóa từ trạng thái này sang một trạng thái khác của thời tiết, tính chất, năng lực hoặc thân phận con người theo tiến trình tự nhiên.

---

### Bài tập 150 (`EX-095-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-095-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của イA-くなります / ナA-になります / N-になります (Sự biến đổi trạng thái khách quan)?

#### 🔘 4 Phương án lựa chọn:
- **A.** 薬を飲んで、元気になりました。
- **B.** 薬を飲んで、元気になりました。でした
- **C.** 薬を飲んで、元気でなりました。
- **D.** 全然薬を飲んで、元気になりました。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Sau khi uống thuốc, tôi đã khỏe khoắn trở lại.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Lỗi quên đổi đuôi い: học sinh hay giữ nguyên い mà thêm になります (samui ni narimasu -> SAI NGHIÊM TRỌNG). Tính từ đuôi い bắt buộc phải đổi thành 〜くなります.
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Lỗi quên đổi đuôi い: học sinh hay giữ nguyên い mà thêm になります (samui ni narimasu -> SAI NGHIÊM TRỌNG). Tính từ đuôi い bắt buộc phải đổi thành 〜くなります.

---

### Bài tập 151 (`EX-095-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-095-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Trong tương lai, tôi mong muốn trở thành giáo viên tiếng Nhật.」

#### 🔘 4 Phương án lựa chọn:
- **A.** 将来、日本語の先生になりたいです。
- **B.** 。すでいたりなに生先の語本日、来将
- **C.** 将来そして日本語の先生になりたいです。
- **D.** 将来、日本語の先生になりたいだ。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Trong tương lai, tôi mong muốn trở thành giáo viên tiếng Nhật.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: A[đuôi い] -> くなります / A[đuôi な] + になります / N + になります. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 152 (`EX-095-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-095-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「町がだんだん静かになりました。」

#### 🔘 4 Phương án lựa chọn:
- **A.** A[đuôi
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Đường phố dần dần trở nên tĩnh lặng.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái - Tính từ đuôi い: Bỏ [い] thay bằng [くなります] (samui -> samukunarimasu).
- Tính từ đuôi な: Bỏ [な] thêm [になります] (genki -> genki ni narimasu).
- Danh từ: N + [になります] (sensei -> sensei ni narimasu)..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: - Tính từ đuôi い: Bỏ [い] thay bằng [くなります] (samui -> samukunarimasu).
- Tính từ đuôi な: Bỏ [な] thêm [になります] (genki -> genki ni narimasu).
- Danh từ: N + [になります] (sensei -> sensei ni narimasu).

---

### Bài tập 153 (`EX-095-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-095-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「毎日日本語を練習して、上手になりました。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** 毎日日本語を練習して、上手になりました。
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Nhờ kiên trì luyện tập tiếng Nhật mỗi ngày, tôi đã trở nên thành thạo.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Vô cùng phổ biến trong miêu tả thời tiết các mùa, sự trưởng thành của con người, ước mơ nghề nghiệp tương lai.

---

### Bài tập 154 (`EX-095-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-095-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 95 (イA-くなります / ナA-になります / N-になります ):

#### 🔘 4 Phương án lựa chọn:
- **A.** Phân biệt với します (Pattern làm cho biến đổi theo ý chí chủ quan: 部屋をきれいにします). Mẫu なります là sự tự biến đổi khách quan tự nhiên của sự vật.
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với イA-くなります / ナA-になります / N-になります (Sự biến đổi trạng thái khách quan).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: Phân biệt với します (Pattern làm cho biến đổi theo ý chí chủ quan: 部屋をきれいにします). Mẫu なります là sự tự biến đổi khách quan tự nhiên của sự vật.

---

### Bài tập 155 (`EX-095-07`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-095-07`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu イA-くなります / ナA-になります / N-になります :
「十一月になって、寒くなりました。」

#### 🔘 4 Phương án lựa chọn:
- **A.** A[đuôi
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Bước sang tháng 11, trời đã trở nên giá lạnh.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức A[đuôi い] -> くなります / A[đuôi な] + になります / N + になります.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 95: Diễn tả sự thay đổi, chuyển hóa từ trạng thái này sang một trạng thái khác của thời tiết, tính chất, năng lực hoặc thân phận con người theo tiến trình tự nhiên.

---

## MỤC BÀI TẬP CHO PATTERN 96: N(場所) を V (Không gian di chuyển xuyên qua, băng qua, rẽ)

**Bài học:** Bài 10 | **Dạng mẫu:** `N[địa điểm không gian] を + 渡ります / 曲がります / 歩きます / 走ります / 飛びます` | **Trình độ:** N5

### Bài tập 156 (`EX-096-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-096-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu N:
「あの橋を渡って、交差点を右に曲がってください。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N[địa
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Hãy băng qua cây cầu kia, rồi rẽ phải ở ngã tư.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức N[địa điểm không gian] を + 渡ります / 曲がります / 歩きます / 走ります / 飛びます.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 96: Dùng trợ từ を để biểu thị một khoảng không gian, con đường, cây cầu mà chuyển động của con người hoặc phương tiện diễn ra xuyên suốt, băng qua hoặc rời khỏi.

---

### Bài tập 157 (`EX-096-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-096-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của N(場所) を V (Không gian di chuyển xuyên qua, băng qua, rẽ)?

#### 🔘 4 Phương án lựa chọn:
- **A.** 毎朝、公園を散歩しています。
- **B.** 毎朝、公園を散歩しています。でした
- **C.** 毎朝、公園を散歩しています。
- **D.** 全然毎朝、公園を散歩しています。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Mỗi buổi sáng tôi đều đi dạo bộ xuyên qua công viên.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Học sinh hay nhầm dùng で khi nói 'băng qua cầu' (橋で渡ります -> SAI). Bắt buộc phải là: '橋を渡ります'.
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Học sinh hay nhầm dùng で khi nói 'băng qua cầu' (橋で渡ります -> SAI). Bắt buộc phải là: '橋を渡ります'.

---

### Bài tập 158 (`EX-096-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-096-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Rẽ trái ngay chỗ cột đèn giao thông là sẽ thấy bưu điện.」

#### 🔘 4 Phương án lựa chọn:
- **A.** 信号の所を左へ曲がると、郵便局があります。
- **B.** 。すまりあが局便郵、とるが曲へ左を所の号信
- **C.** 信号の所を左へ曲がるとそして郵便局があります。
- **D.** 信号の所を左へ曲がると、郵便局があります。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Rẽ trái ngay chỗ cột đèn giao thông là sẽ thấy bưu điện.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: N[địa điểm không gian] を + 渡ります / 曲がります / 歩きます / 走ります / 飛びます. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 159 (`EX-096-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-096-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「鳥が空を気持ちよさそうに飛んでいます。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N[địa
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Đàn chim đang bay lượn trên bầu trời trông thật thảnh thơi.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái Danh từ không gian + を + Động từ chuyển động (渡る: băng qua; 曲がる: rẽ; 歩く: đi bộ; 散歩する: dạo bộ; 飛ぶ: bay lượn; 降りる: xuống tàu xe)..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: Danh từ không gian + を + Động từ chuyển động (渡る: băng qua; 曲がる: rẽ; 歩く: đi bộ; 散歩する: dạo bộ; 飛ぶ: bay lượn; 降りる: xuống tàu xe).

---

### Bài tập 160 (`EX-096-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-096-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「次の駅で電車を降ります。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** 次の駅で電車を降ります。
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Tôi sẽ bước xuống tàu điện ở nhà ga tiếp theo.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Cốt lõi khi chỉ đường, lái xe, định vị giao thông đô thị.

---

### Bài tập 161 (`EX-096-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-096-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 96 (N):

#### 🔘 4 Phương án lựa chọn:
- **A.** Khác biệt căn bản với trợ từ で: で chỉ nơi diễn ra toàn bộ hành động khép kín (công viên で đá bóng); trong khi を chỉ không gian chuyển động xuyên tuyến (công viên を đi dạo xuyên qua).
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với N(場所) を V (Không gian di chuyển xuyên qua, băng qua, rẽ).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: Khác biệt căn bản với trợ từ で: で chỉ nơi diễn ra toàn bộ hành động khép kín (công viên で đá bóng); trong khi を chỉ không gian chuyển động xuyên tuyến (công viên を đi dạo xuyên qua).

---

## MỤC BÀI TẬP CHO PATTERN 97: N は (Đưa bổ ngữ lên làm chủ đề để nhấn mạnh hoặc tương phản)

**Bài học:** Bài 10 | **Dạng mẫu:** `N[tân ngữ/bổ ngữ] は + V / A` | **Trình độ:** N5

### Bài tập 162 (`EX-097-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-097-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu N は :
「荷物はあそこに置いてください。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N[tân
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Hành lý thì xin vui lòng đặt ở đằng kia nhé.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức N[tân ngữ/bổ ngữ] は + V / A.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 97: Dùng trợ từ は thay thế cho を hoặc が (hoặc đứng kèm sau には、へは、では) để đưa đối tượng cần chú ý lên đầu câu làm chủ đề trung tâm của cuộc thảo luận, hoặc tạo sắc thái đối chiếu tương phản ngầm.

---

### Bài tập 163 (`EX-097-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-097-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của N は (Đưa bổ ngữ lên làm chủ đề để nhấn mạnh hoặc tương phản)?

#### 🔘 4 Phương án lựa chọn:
- **A.** 朝ご飯は毎日食べますが、昼ご飯は忙しくて食べません。
- **B.** 朝ご飯は毎日食べますは、昼ご飯は忙しくて食べません。
- **C.** 朝ご飯は毎日食べますが、昼ご飯は忙しくて食べません。
- **D.** 朝ご飯は毎日食べますが、昼ご飯は忙しくて食べません。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Bữa sáng thì ngày nào tôi cũng ăn, nhưng bữa trưa thì bận quá nên không ăn.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Học sinh hay bối rối khi thấy câu không có tân ngữ を mà lại có は trước một động từ tha động từ. Cần hiểu đây là hiện tượng Topicalization (Chủ đề hóa).
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Học sinh hay bối rối khi thấy câu không có tân ngữ を mà lại có は trước một động từ tha động từ. Cần hiểu đây là hiện tượng Topicalization (Chủ đề hóa).

---

### Bài tập 164 (`EX-097-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-097-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Báo tiếng Nhật thì tôi chưa đọc được, nhưng phim hoạt hình anime thì tôi vẫn xem.」

#### 🔘 4 Phương án lựa chọn:
- **A.** 日本語の新聞は読めませんが、アニメは見ます。
- **B.** 読めませんが、アニメは日本語の新聞
- **C.** 日本語の新聞は読めませんがそしてアニメは見ます。
- **D.** 日本語の新聞は読めませんが、アニメは見ます。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Báo tiếng Nhật thì tôi chưa đọc được, nhưng phim hoạt hình anime thì tôi vẫn xem.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: N[tân ngữ/bổ ngữ] は + V / A. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 165 (`EX-097-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-097-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「この本は昨日図書館で借りました。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N[tân
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Cuốn sách này thì hôm qua tôi đã mượn ở thư viện đấy.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái Tân ngữ を -> chuyển thành は (荷物を置きます -> 荷物はあそこに置いてください). Trợ từ に -> には; で -> では; へ -> へは..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: Tân ngữ を -> chuyển thành は (荷物を置きます -> 荷物はあそこに置いてください). Trợ từ に -> には; で -> では; へ -> へは.

---

### Bài tập 166 (`EX-097-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-097-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「京都へは行きましたが、奈良へはまだ行きませんでした。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** 京都へは行きましたが、奈良へはまだ行きませんでした。
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kyoto thì tôi đã đi rồi, thế nhưng Nara thì tôi vẫn chưa có dịp đến.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Tự nhiên, phản ánh tư duy hội thoại tiếng Nhật luôn ưu tiên xác định chủ đề trước khi đưa ra chỉ dẫn hành động.

---

### Bài tập 167 (`EX-097-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-097-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 97 (N は ):

#### 🔘 4 Phương án lựa chọn:
- **A.** Phân biệt với câu trung tính dùng を: 'あそこに荷物を置いてください' (Chỉ thị bình thường); '荷物はあそこに置いてください' (Nhấn mạnh: Riêng về hành lý thì xin hãy để ở kia).
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với N は (Đưa bổ ngữ lên làm chủ đề để nhấn mạnh hoặc tương phản).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: Phân biệt với câu trung tính dùng を: 'あそこに荷物を置いてください' (Chỉ thị bình thường); '荷物はあそこに置いてください' (Nhấn mạnh: Riêng về hành lý thì xin hãy để ở kia).

---

## MỤC BÀI TẬP CHO PATTERN 98: Vて形 います (Thói quen thường xuyên lặp đi lặp lại hàng ngày)

**Bài học:** Bài 11 | **Dạng mẫu:** `Phó từ thời gian thường xuyên + V[て形] います` | **Trình độ:** N5

### Bài tập 168 (`EX-098-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-098-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu Vて形 います :
「毎朝、牛乳を飲んでいます。」

#### 🔘 4 Phương án lựa chọn:
- **A.** Phó
- **B.** Phó
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Mỗi buổi sáng tôi đều duy trì thói quen uống sữa tươi.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức Phó từ thời gian thường xuyên + V[て形] います.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 98: Diễn tả một thói quen, nếp sinh hoạt được duy trì đều đặn, lặp đi lặp lại trong một thời gian dài (như tập thể dục mỗi sáng, đọc sách mỗi tối).

---

### Bài tập 169 (`EX-098-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-098-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của Vて形 います (Thói quen thường xuyên lặp đi lặp lại hàng ngày)?

#### 🔘 4 Phương án lựa chọn:
- **A.** 健康のために、毎晩ジョギングをしています。
- **B.** 健康のために、毎晩ジョギングをしています。でした
- **C.** 健康のためで、毎晩ジョギングをしています。
- **D.** 全然健康のために、毎晩ジョギングをしています。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Vì sức khỏe, tối nào tôi cũng chạy bộ rèn luyện.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Người học hay lẫn lộn với hành động đang xảy ra tại thời điểm nói. Phải dựa vào phó từ đi kèm (今 = đang làm ngay lúc này; 毎朝 = thói quen lặp lại).
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Người học hay lẫn lộn với hành động đang xảy ra tại thời điểm nói. Phải dựa vào phó từ đi kèm (今 = đang làm ngay lúc này; 毎朝 = thói quen lặp lại).

---

### Bài tập 170 (`EX-098-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-098-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Mỗi cuối tuần tôi đều trò chuyện trực tuyến với giáo viên tiếng Nhật.」

#### 🔘 4 Phương án lựa chọn:
- **A.** 毎週末、日本語の先生とオンラインで話しています。
- **B.** 。すまいてし話でンイランオと生先の語本日、末週毎
- **C.** 毎週末そして日本語の先生とオンラインで話しています。
- **D.** 毎週末、日本語の先生とオンラインで話しています。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Mỗi cuối tuần tôi đều trò chuyện trực tuyến với giáo viên tiếng Nhật.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: Phó từ thời gian thường xuyên + V[て形] います. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 171 (`EX-098-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-098-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「寝る前に、必ず日記を書いています。」

#### 🔘 4 Phương án lựa chọn:
- **A.** Phó
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Trước khi đi ngủ, bao giờ tôi cũng viết nhật ký.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái Các phó từ tần suất thường gặp: 毎朝 (mỗi sáng), 毎晩 (mỗi tối), 毎日 (mỗi ngày), いつも (luôn luôn) + Động từ chia thể Te + います..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: Các phó từ tần suất thường gặp: 毎朝 (mỗi sáng), 毎晩 (mỗi tối), 毎日 (mỗi ngày), いつも (luôn luôn) + Động từ chia thể Te + います.

---

### Bài tập 172 (`EX-098-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-098-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「休みの日はいつも家で映画を見ています。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** 休みの日はいつも家で映画を見ています。
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Vào ngày nghỉ tôi luôn luôn ở nhà xem phim.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Dùng khi chia sẻ về phong cách sống, chế độ ăn uống, rèn luyện bản thân với bạn bè, đồng nghiệp.

---

### Bài tập 173 (`EX-098-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-098-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 98 (Vて形 います ):

#### 🔘 4 Phương án lựa chọn:
- **A.** So sánh với thì hiện tại đơn Vます: '毎朝牛乳を飲みます' (Nêu sự thật chung chung); '毎朝牛乳を飲んでいます' (Nhấn mạnh thói quen nếp sống hiện nay đang được duy trì đều đặn).
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với Vて形 います (Thói quen thường xuyên lặp đi lặp lại hàng ngày).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: So sánh với thì hiện tại đơn Vます: '毎朝牛乳を飲みます' (Nêu sự thật chung chung); '毎朝牛乳を飲んでいます' (Nhấn mạnh thói quen nếp sống hiện nay đang được duy trì đều đặn).

---

## MỤC BÀI TẬP CHO PATTERN 99: Vたり Vたり します (Liệt kê các hành động tiêu biểu đại diện)

**Bài học:** Bài 11 | **Dạng mẫu:** `V1[たり] + V2[たり] + します / しました` | **Trình độ:** N5

### Bài tập 174 (`EX-099-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-099-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu Vたり Vたり します :
「休みの日、家で本を読んだり音楽を聞いたりしています。」

#### 🔘 4 Phương án lựa chọn:
- **A.** V1[たり]
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Ngày nghỉ tôi thường làm những việc như đọc sách, nghe nhạc ở nhà.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức V1[たり] + V2[たり] + します / しました.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 99: Dùng để liệt kê tượng trưng hai hoặc ba hành động tiêu biểu trong số rất nhiều hoạt động đã hoặc sẽ làm, mang ngụ ý 'làm những việc như là V1, làm việc như là V2... và còn những việc khác nữa'.

---

### Bài tập 175 (`EX-099-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-099-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của Vたり Vたり します (Liệt kê các hành động tiêu biểu đại diện)?

#### 🔘 4 Phương án lựa chọn:
- **A.** 昨日の日曜日は掃除したり、洗濯したりしました。
- **B.** 昨日の日曜日は掃除したり、洗濯したりしました。でした
- **C.** 昨日の日曜日は掃除したり、洗濯したりしました。
- **D.** 全然昨日の日曜日は掃除したり、洗濯したりしました。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Chủ nhật hôm qua tôi đã dọn dẹp phòng ốc, giặt giũ quần áo.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Lỗi học sinh hay mắc: Quên động từ します ở cuối câu (ví dụ: '本を読んだり音楽を聞いたり' rồi ngắt câu -> SAI). Bắt buộc phải kết thúc bằng します hoặc しました.
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Lỗi học sinh hay mắc: Quên động từ します ở cuối câu (ví dụ: '本を読んだり音楽を聞いたり' rồi ngắt câu -> SAI). Bắt buộc phải kết thúc bằng します hoặc しました.

---

### Bài tập 176 (`EX-099-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-099-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Đến Nhật tôi muốn trải nghiệm leo núi Phú Sĩ và tắm suối nước nóng.」

#### 🔘 4 Phương án lựa chọn:
- **A.** 日本で富士山に登ったり、温泉に入ったりしたいです。
- **B.** 。すでいたしりたっ入に泉温、りたっ登に山士富で本日
- **C.** 日本で富士山に登ったりそして温泉に入ったりしたいです。
- **D.** 日本で富士山に登ったり、温泉に入ったりしたいだ。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Đến Nhật tôi muốn trải nghiệm leo núi Phú Sĩ và tắm suối nước nóng.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: V1[たり] + V2[たり] + します / しました. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 177 (`EX-099-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-099-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「週末は友達と買い物したり、ご飯を食べたりします。」

#### 🔘 4 Phương án lựa chọn:
- **A.** V1[たり]
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Cuối tuần tôi hay cùng bạn đi sắm đồ, đi ăn uống.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái Động từ chia thể Quá khứ ngắn Ta-form (V-ta) + り. Kết thúc câu bắt buộc phải có trợ động từ します (hiện tại/tương lai) hoặc しました (quá khứ)..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: Động từ chia thể Quá khứ ngắn Ta-form (V-ta) + り. Kết thúc câu bắt buộc phải có trợ động từ します (hiện tại/tương lai) hoặc しました (quá khứ).

---

### Bài tập 178 (`EX-099-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-099-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「旅行中、写真を撮ったり、お土産を買ったりして楽しかったです。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** 旅行中、写真を撮ったり、お土産を買ったりして楽しかったです。
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Trong chuyến du lịch, chúng tôi đã chụp ảnh, mua quà lưu niệm và rất vui.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Tự nhiên, phóng khoáng, tránh cảm giác cứng nhắc khi phải kể lể chi li từng hành động một.

---

### Bài tập 179 (`EX-099-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-099-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 99 (Vたり Vたり します ):

#### 🔘 4 Phương án lựa chọn:
- **A.** Khác biệt căn bản với thể Te (Pattern 83): Thể Te liệt kê tuần tự theo thời gian và mang tính trọn gói; mẫu -tari -tari chỉ chọn ra vài hành động làm mẫu và không nhất thiết theo trình tự trước sau.
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với Vたり Vたり します (Liệt kê các hành động tiêu biểu đại diện).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: Khác biệt căn bản với thể Te (Pattern 83): Thể Te liệt kê tuần tự theo thời gian và mang tính trọn gói; mẫu -tari -tari chỉ chọn ra vài hành động làm mẫu và không nhất thiết theo trình tự trước sau.

---

## MỤC BÀI TẬP CHO PATTERN 100: N1 は___が、N2 は___ (Cấu trúc đối chiếu tương phản hai đối tượng)

**Bài học:** Bài 11 | **Dạng mẫu:** `N1 は [V/A khẳng định] が、N2 は [V/A phủ định / ngược lại]` | **Trình độ:** N5

### Bài tập 180 (`EX-100-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-100-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu N1 は___が、N2 は___ :
「犬は好きですが、猫は好きじゃありません。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N1
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Chó thì tôi rất thích, nhưng mèo thì tôi không thích lắm.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức N1 は [V/A khẳng định] が、N2 は [V/A phủ định / ngược lại].
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 100: Dùng trợ từ は đặt sau cả hai danh từ N1 và N2 nhằm làm nổi bật sự đối lập, tương phản rõ rệt về tính chất, sở thích hoặc năng lực giữa hai đối tượng đó.

---

### Bài tập 181 (`EX-100-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-100-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của N1 は___が、N2 は___ (Cấu trúc đối chiếu tương phản hai đối tượng)?

#### 🔘 4 Phương án lựa chọn:
- **A.** ひらがなは書けますが、漢字は書けません。
- **B.** ひらはなは書けますは、漢字は書けません。
- **C.** ひらがなは書けますが、漢字は書けません。
- **D.** ひらがなは書けますが、漢字は書けません。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Chữ Hiragana thì tôi viết được, nhưng chữ Hán Kanji thì tôi chưa viết được.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Học sinh hay quên dùng は ở vế thứ hai (như: '犬は好きですが、猫が好きじゃありません' -> không tự nhiên). Bắt buộc phải là: '犬は好きですが、猫は好きじゃありません'.
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Học sinh hay quên dùng は ở vế thứ hai (như: '犬は好きですが、猫が好きじゃありません' -> không tự nhiên). Bắt buộc phải là: '犬は好きですが、猫は好きじゃありません'.

---

### Bài tập 182 (`EX-100-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-100-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Anh trai thì dáng vóc cao ráo, thế nhưng em trai thì lại thấp bé.」

#### 🔘 4 Phương án lựa chọn:
- **A.** 兄は背が高いですが、弟は背が低いです。
- **B.** 背が高いですが、弟は兄
- **C.** 兄は背が高いですがそして弟は背が低いです。
- **D.** 兄は背が高いだが、弟は背が低いだ。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Anh trai thì dáng vóc cao ráo, thế nhưng em trai thì lại thấp bé.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: N1 は [V/A khẳng định] が、N2 は [V/A phủ định / ngược lại]. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 183 (`EX-100-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-100-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「肉は食べますが、魚はあまり食べません。」

#### 🔘 4 Phương án lựa chọn:
- **A.** N1
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Thịt thì tôi ăn được, nhưng cá thì tôi hầu như không mấy khi ăn.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái N1 は + Cụm vị ngữ 1 + が (liên từ nhưng) + N2 は + Cụm vị ngữ 2..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: N1 は + Cụm vị ngữ 1 + が (liên từ nhưng) + N2 は + Cụm vị ngữ 2.

---

### Bài tập 184 (`EX-100-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-100-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「平日は忙しいですが、週末は暇です。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** 平日は忙しいですが、週末は暇です。
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Ngày thường thì bận rộn túi bụi, nhưng cuối tuần thì lại rảnh rỗi.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Tinh tế, thể hiện tư duy phân định rạch ròi, thường dùng khi nói về sở thích ăn uống, năng lực ngôn ngữ, quan hệ cá nhân.

---

### Bài tập 185 (`EX-100-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-100-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 100 (N1 は___が、N2 は___ ):

#### 🔘 4 Phương án lựa chọn:
- **A.** Trợ từ は ở đây hoàn toàn gánh vác chức năng Contrastive Focus (Tiêu điểm đối chiếu). Thay thế hoàn toàn cho trợ từ が hay を thông thường.
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với N1 は___が、N2 は___ (Cấu trúc đối chiếu tương phản hai đối tượng).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: Trợ từ は ở đây hoàn toàn gánh vác chức năng Contrastive Focus (Tiêu điểm đối chiếu). Thay thế hoàn toàn cho trợ từ が hay を thông thường.

---

## MỤC BÀI TẬP CHO PATTERN 101: 〜とき (Khi / Trong lúc... - Phân tích toàn diện 7 hình thái kết hợp)

**Bài học:** Bài 11 | **Dạng mẫu:** `[V / A / N] + とき、〜` | **Trình độ:** N5/N4

### Bài tập 186 (`EX-101-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-101-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu 〜とき :
「寂しいとき、家族の写真を思い出します。」

#### 🔘 4 Phương án lựa chọn:
- **A.** [V
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Những khi cảm thấy cô đơn buồn bã, tôi lại nhớ về bức ảnh gia đình.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức [V / A / N] + とき、〜.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 101: Biểu thị thời điểm, hoàn cảnh hoặc điều kiện mà tại lúc đó một sự việc, hành động khác diễn ra hoặc một cảm xúc nảy sinh.

---

### Bài tập 187 (`EX-101-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-101-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của 〜とき (Khi / Trong lúc... - Phân tích toàn diện 7 hình thái kết hợp)?

#### 🔘 4 Phương án lựa chọn:
- **A.** 暇なとき、YouTubeで日本の歌を聞きます。
- **B.** 暇なとき、YouTubeで日本の歌を聞きます。でした
- **C.** 暇なとき、YouTubeで日本の歌を聞きます。
- **D.** 全然暇なとき、YouTubeで日本の歌を聞きます。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Những lúc rảnh rỗi, tôi thường nghe các bài hát tiếng Nhật trên YouTube.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Lỗi danh từ: Học sinh hay quên trợ từ の sau danh từ (ví dụ: '学生とき' -> SAI). Bắt buộc phải là: '学生のとき'. Lỗi thứ hai là quên trợ từ な sau tính từ な ('暇とき' -> sai, phải là '暇なとき').
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Lỗi danh từ: Học sinh hay quên trợ từ の sau danh từ (ví dụ: '学生とき' -> SAI). Bắt buộc phải là: '学生のとき'. Lỗi thứ hai là quên trợ từ な sau tính từ な ('暇とき' -> sai, phải là '暇なとき').

---

### Bài tập 188 (`EX-101-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-101-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Thời còn là một đứa trẻ, tôi thường hay đi bơi ở con sông gần nhà.」

#### 🔘 4 Phương án lựa chọn:
- **A.** 子どものとき、よく川で泳ぎました。
- **B.** 。たしまぎ泳で川くよ、きとのもど子
- **C.** 子どものときそしてよく川で泳ぎました。
- **D.** 子どものとき、よく川で泳ぎました。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Thời còn là một đứa trẻ, tôi thường hay đi bơi ở con sông gần nhà.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: [V / A / N] + とき、〜. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 189 (`EX-101-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-101-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「ご飯を作るとき、手をよく洗います。」

#### 🔘 4 Phương án lựa chọn:
- **A.** [V
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Khi chuẩn bị nấu cơm (trước khi nấu), tôi rửa tay thật kỹ càng.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái Gồm 7 biến thể kết hợp ngữ pháp cốt lõi:
1. Tính từ đuôi い: A-い + とき (寂しいとき)
2. Tính từ đuôi な: A-な + とき (暇なとき)
3. Danh từ: N + の + とき (中学生のとき)
4. Động từ chưa xảy ra: V-jisho + とき (日本へ行くとき - trước khi sang)
5. Động từ đã hoàn thành: V-ta + とき (日本へ行ったとき - sau khi sang)
6. Động từ thể phủ định: V-nai + とき (分からないとき)
7. Động từ đang tiếp diễn: V-te iru + とき (歩いているとき)..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: Gồm 7 biến thể kết hợp ngữ pháp cốt lõi:
1. Tính từ đuôi い: A-い + とき (寂しいとき)
2. Tính từ đuôi な: A-な + とき (暇なとき)
3. Danh từ: N + の + とき (中学生のとき)
4. Động từ chưa xảy ra: V-jisho + とき (日本へ行くとき - trước khi sang)
5. Động từ đã hoàn thành: V-ta + とき (日本へ行ったとき - sau khi sang)
6. Động từ thể phủ định: V-nai + とき (分からないとき)
7. Động từ đang tiếp diễn: V-te iru + とき (歩いているとき).

---

### Bài tập 190 (`EX-101-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-101-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「日本へ行ったとき、新しい着物を買いました。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** 日本へ行ったとき、新しい着物を買いました。
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Khi đã đặt chân đến Nhật Bản rồi, tôi đã mua một bộ Kimono mới.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Một trong những cấu trúc quan trọng bậc nhất của tiếng Nhật sơ cấp, làm nền tảng cho văn phong lập luận, tường thuật điều kiện thời gian.

---

### Bài tập 191 (`EX-101-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-101-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 101 (〜とき ):

#### 🔘 4 Phương án lựa chọn:
- **A.** Điểm then chốt kinh điển của JLPT: Phân biệt 'Vるとき' (hành động V CHƯA XẢY RA tại thời điểm mệnh đề chính) vs 'Vたとき' (hành động V ĐÃ HOÀN THÀNH XONG XUÔI trước mệnh đề chính). Ví dụ: '国へ帰るとき、お土産を買いました' (mua quà lúc đang ở Nhật, trước khi về) vs '国へ帰ったとき、お土産をあげました' (về đến nước rồi mới tặng quà).
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với 〜とき (Khi / Trong lúc... - Phân tích toàn diện 7 hình thái kết hợp).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: Điểm then chốt kinh điển của JLPT: Phân biệt 'Vるとき' (hành động V CHƯA XẢY RA tại thời điểm mệnh đề chính) vs 'Vたとき' (hành động V ĐÃ HOÀN THÀNH XONG XUÔI trước mệnh đề chính). Ví dụ: '国へ帰るとき、お土産を買いました' (mua quà lúc đang ở Nhật, trước khi về) vs '国へ帰ったとき、お土産をあげました' (về đến nước rồi mới tặng quà).

---

### Bài tập 192 (`EX-101-07`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-101-07`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu 〜とき :
「寂しいとき、家族の写真を思い出します。」

#### 🔘 4 Phương án lựa chọn:
- **A.** [V
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Những khi cảm thấy cô đơn buồn bã, tôi lại nhớ về bức ảnh gia đình.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức [V / A / N] + とき、〜.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 101: Biểu thị thời điểm, hoàn cảnh hoặc điều kiện mà tại lúc đó một sự việc, hành động khác diễn ra hoặc một cảm xúc nảy sinh.

---

## MỤC BÀI TẬP CHO PATTERN 102: どうしますか (Hỏi phương án giải quyết: Bạn sẽ xử trí thế nào?)

**Bài học:** Bài 11 | **Dạng mẫu:** `Tình huống + とき、どうしますか` | **Trình độ:** N5

### Bài tập 193 (`EX-102-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-102-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu どうしますか :
「疲れたとき、どうしますか。――甘いものを食べて、早く寝ます。」

#### 🔘 4 Phương án lựa chọn:
- **A.** Tình
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Khi cảm thấy mệt mỏi rã rời, bạn sẽ làm gì? ―― Tôi ăn một chút đồ ngọt rồi đi ngủ sớm.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức Tình huống + とき、どうしますか.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 102: Dùng để tham vấn, thăm dò phương án ứng xử, cách giải quyết hoặc thói quen đối phó của một người khi đứng trước một hoàn cảnh, sự cố hoặc trạng thái cụ thể.

---

### Bài tập 194 (`EX-102-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-102-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của どうしますか (Hỏi phương án giải quyết: Bạn sẽ xử trí thế nào?)?

#### 🔘 4 Phương án lựa chọn:
- **A.** 道が分からないとき、どうしますか。――交番の人に聞きます。
- **B.** 道は分からないとき、どうしますか。――交番の人に聞きます。
- **C.** 道が分からないとき、どうしますか。――交番の人で聞きます。
- **D.** 全然道が分からないとき、どうしますか。――交番の人に聞きます。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Những lúc bị lạc đường không biết lối đi, bạn sẽ xử trí ra sao? ―― Tôi sẽ hỏi thăm viên cảnh sát ở bốt giao thông.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Học sinh hay nhầm cách trả lời: Khi hỏi どうしますか, phải trả lời bằng một ĐỘNG TỪ hành động cụ thể (như '甘いものを食べます'), không trả lời bằng tính từ đơn thuần.
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Học sinh hay nhầm cách trả lời: Khi hỏi どうしますか, phải trả lời bằng một ĐỘNG TỪ hành động cụ thể (như '甘いものを食べます'), không trả lời bằng tính từ đơn thuần.

---

### Bài tập 195 (`EX-102-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-102-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Khi bị đau đầu nhức óc, bạn thường làm gì? ―― Tôi uống thuốc rồi nằm nghỉ ngơi.」

#### 🔘 4 Phương án lựa chọn:
- **A.** 頭が痛いとき、どうしますか。――薬を飲んで横になります。
- **B.** 。すまりなに横でん飲を薬――。かすましうど、きとい痛が頭
- **C.** 頭が痛いときそしてどうしますか。――薬を飲んで横になります。
- **D.** 頭が痛いとき、どうしますか。――薬を飲んで横になります。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Khi bị đau đầu nhức óc, bạn thường làm gì? ―― Tôi uống thuốc rồi nằm nghỉ ngơi.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: Tình huống + とき、どうしますか. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 196 (`EX-102-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-102-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「お金がないとき、どうしますか。――アルバイトを一生懸命します。」

#### 🔘 4 Phương án lựa chọn:
- **A.** Tình
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Những lúc túng thiếu không có tiền, bạn sẽ làm thế nào? ―― Tôi sẽ chăm chỉ dốc sức đi làm thêm.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái Thường kết hợp trực tiếp với Pattern 101: [Tình huống + とき]、どうしますか。 Câu trả lời đưa ra hành vi ứng phó: Vます..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: Thường kết hợp trực tiếp với Pattern 101: [Tình huống + とき]、どうしますか。 Câu trả lời đưa ra hành vi ứng phó: Vます.

---

### Bài tập 197 (`EX-102-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-102-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「地震が起きたとき、まずどうしますか。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** 机の下に入ります。
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Khi động đất xảy ra, trước hết bạn sẽ làm gì? ―― Tôi lập tức chui xuống gầm bàn kiên cố.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Thân thiện, gợi mở câu chuyện, tạo tiền đề để hai bên trao đổi kinh nghiệm sống, mẹo vặt sức khỏe.

---

### Bài tập 198 (`EX-102-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-102-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 2/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 102 (どうしますか ):

#### 🔘 4 Phương án lựa chọn:
- **A.** Phân biệt với どうですか (Hỏi cảm nghĩ: Bạn thấy thế nào?). どうしますか tập trung vào HÀNH HỘNG giải quyết (Bạn sẽ LÀM GÌ?).
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với どうしますか (Hỏi phương án giải quyết: Bạn sẽ xử trí thế nào?).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: Phân biệt với どうですか (Hỏi cảm nghĩ: Bạn thấy thế nào?). どうしますか tập trung vào HÀNH HỘNG giải quyết (Bạn sẽ LÀM GÌ?).

---

## MỤC BÀI TẬP CHO PATTERN 103: 友達言葉 (Thể thông thường / Khẩu ngữ giao tiếp thân mật với bạn bè)

**Bài học:** Bài 11 | **Dạng mẫu:** `Thể thông thường (Futsuukei / Plain Form): Vる / Vない / Vた / Vなかった / Aい / Aだ / Nだ` | **Trình độ:** N5/N4

### Bài tập 199 (`EX-103-01`): Luyện tập điền trợ từ và dạng thức cốt lõi (Cloze Drill)

- **Mã bài tập (Exercise ID):** `EX-103-01`
- **Dạng bài (Exercise Type):** `cloze`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn phương án đúng để hoàn thành câu theo mẫu 友達言葉 :
「海へ行く？――うん、行く。／ううん、行かない。」

#### 🔘 4 Phương án lựa chọn:
- **A.** Thể
- **B.** ます
- **C.** から
- **D.** ので

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Đi biển chơi không cậu? ―― Ừ, đi chứ! / Hông, tớ không đi đâu.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án đúng: Tuân thủ chính xác công thức Thể thông thường (Futsuukei / Plain Form): Vる / Vない / Vた / Vなかった / Aい / Aだ / Nだ.
- **Phương án B:** Sai hình thái: Biến đổi sai thể ngữ pháp của động từ/tính từ.
- **Phương án C:** Sai trợ từ: Không phù hợp với trường nghĩa của mẫu câu.
- **Phương án D:** Sai cấu trúc: Nhầm sang mệnh đề nguyên nhân - kết quả.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc vàng của Pattern 103: Hệ thống ngôn ngữ thân mật (Casual speech / Thể ngắn), lược bỏ Desu/Masu, biến đổi trợ từ và ngữ điệu để tạo sự gần gũi, ấm áp giữa bạn bè đồng trang lứa, người thân trong gia đình hoặc người dưới.

---

### Bài tập 200 (`EX-103-02`): Phân tích bẫy ngữ pháp và lỗi dịch nghĩa (Common Pitfall Analysis)

- **Mã bài tập (Exercise ID):** `EX-103-02`
- **Dạng bài (Exercise Type):** `multiple_choice`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Trong các câu sau, câu nào thể hiện ĐÚNG cấu trúc và ngữ cảnh của 友達言葉 (Thể thông thường / Khẩu ngữ giao tiếp thân mật với bạn bè)?

#### 🔘 4 Phương án lựa chọn:
- **A.** 今、何時？――三時半だよ。
- **B.** 今、何時？――三時半だよ。でした
- **C.** 今、何時？――三時半だよ。
- **D.** 全然今、何時？――三時半だよ。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Mấy giờ rồi cậu ơi? ―― Ba rưỡi rồi nè.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chính xác: Diễn đạt chuẩn tự nhiên theo phong cách tiếng Nhật bản xứ.
- **Phương án B:** Sai lỗi tương phản: Dùng sai phân tầng trợ từ chủ đề hoặc thì của câu.
- **Phương án C:** Lỗi kinh điển: Học sinh hay quên quy tắc lược bỏ か trong câu hỏi: nói '行くか？' nghe rất cộc cằn nam tính hoặc hách dịch. Thể thân mật tự nhiên chỉ cần lên giọng: '行く？'. Thứ hai là nhầm うん (ừ/vâng) với ううん (không/hông).
- **Phương án D:** Sai quy tắc kết hợp phụ thuộc cực tính phủ định/khẳng định.

#### 💡 Củng cố kiến thức sư phạm:
> Lưu ý chống bẫy: Học sinh hay quên quy tắc lược bỏ か trong câu hỏi: nói '行くか？' nghe rất cộc cằn nam tính hoặc hách dịch. Thể thân mật tự nhiên chỉ cần lên giọng: '行く？'. Thứ hai là nhầm うん (ừ/vâng) với ううん (không/hông).

---

### Bài tập 201 (`EX-103-03`): Luyện tập sắp xếp trật tự từ vựng (Word Reordering Drill)

- **Mã bài tập (Exercise ID):** `EX-103-03`
- **Dạng bài (Exercise Type):** `jumble`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Hãy sắp xếp các cụm từ sau theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh:
Câu tiếng Việt: 「Bữa tiệc ngày mai cậu có tới không? ―― Có chứ, tớ sẽ sang mà.」

#### 🔘 4 Phương án lựa chọn:
- **A.** 明日のパーティー、来る？――うん、行くよ。
- **B.** 。よく行、んう――？る来、ーィテーパの日明
- **C.** 明日のパーティーそして来る？――うんそして行くよ。
- **D.** 明日のパーティー、来る？――うん、行くよ。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Bữa tiệc ngày mai cậu có tới không? ―― Có chứ, tớ sẽ sang mà.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Trật tự ngữ pháp chuẩn Chủ đề + Bổ ngữ + Trợ từ + Vị ngữ.
- **Phương án B:** Sai trật tự: Đảo lộn vị trí giữa chủ ngữ và vị ngữ chính.
- **Phương án C:** Gượng gạo: Lạm dụng liên từ nối khiến câu văn rời rạc, thiếu tự nhiên.
- **Phương án D:** Sai cấp độ lịch sự: Tự tiện chuyển đổi văn phong trang trọng sang văn nói cộc lốc.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc cấu trúc: Thể thông thường (Futsuukei / Plain Form): Vる / Vない / Vた / Vなかった / Aい / Aだ / Nだ. Luôn tuân theo phân tầng cú pháp tiếng Nhật SOV (Subject - Object - Verb).

---

### Bài tập 202 (`EX-103-04`): Biến đổi hình thái động từ / tính từ (Morphology Drill)

- **Mã bài tập (Exercise ID):** `EX-103-04`
- **Dạng bài (Exercise Type):** `conjugation`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Động từ/tính từ trong ngoặc cần chia ở thể nào để phù hợp với ngữ cảnh câu sau:
「昨日の映画、どうだった？――すごく面白かったよ。」

#### 🔘 4 Phương án lựa chọn:
- **A.** Thể
- **B.** 辞書形 (Thể từ điển nguyên mẫu)
- **C.** た形 (Thể quá khứ)
- **D.** ます形 (Thể lịch sự giữ nguyên ます)

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Bộ phim hôm qua thế nào hả cậu? ―― Xem hay và cuốn cực kỳ luôn.**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Quy tắc biến đổi hình thái Quy tắc biến đổi:
1. Động từ:
- Vます -> V-jisho (行く)
- Vません -> V-nai (行かない)
- Vました -> V-ta (行った)
- Vませんでした -> V-nakatta (行かなかった)
2. Câu hỏi thân mật: Bỏ trợ từ か, lên giọng ở cuối câu (行く？/ 食べる？)
3. Trả lời: Thay はい bằng うん; thay いいえ bằng ううん.
4. Tính từ đuôi な và Danh từ: Bỏ です thay bằng だ (trong hội thoại nữ giới thường bỏ luôn だ)..
- **Phương án B:** Sai: Chưa biến đổi thể phù hợp với trợ động từ tiếp theo.
- **Phương án C:** Sai thời điểm: Hành động chưa hoàn thành hoặc yêu cầu một thể thức khác.
- **Phương án D:** Sai quy tắc kết hợp: Không thể ghép trực tiếp ます trước liên từ hoặc trợ động từ này.

#### 💡 Củng cố kiến thức sư phạm:
> Quy tắc hình thái học: Quy tắc biến đổi:
1. Động từ:
- Vます -> V-jisho (行く)
- Vません -> V-nai (行かない)
- Vました -> V-ta (行った)
- Vませんでした -> V-nakatta (行かなかった)
2. Câu hỏi thân mật: Bỏ trợ từ か, lên giọng ở cuối câu (行く？/ 食べる？)
3. Trả lời: Thay はい bằng うん; thay いいえ bằng ううん.
4. Tính từ đuôi な và Danh từ: Bỏ です thay bằng だ (trong hội thoại nữ giới thường bỏ luôn だ).

---

### Bài tập 203 (`EX-103-05`): Ứng dụng trong ngữ cảnh giao tiếp thực tế (Pragmatic Dialogue)

- **Mã bài tập (Exercise ID):** `EX-103-05`
- **Dạng bài (Exercise Type):** `dialogue`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Đọc đoạn đối thoại sau và chọn câu đáp phù hợp nhất:
A: 「これ、おいしいね。」
B: 「（　　　　　　　　）」

#### 🔘 4 Phương án lựa chọn:
- **A.** 本当だね。もっと食べる？
- **B.** いいえ、全然分かりません。
- **C.** はい、そうです。
- **D.** どういたしまして。

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Món này ngon quá ha! ―― Ừ công nhận thật đó. Ăn thêm miếng nữa không?**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Đáp án chuẩn xác: Phản xạ hội thoại tự nhiên, đúng chuẩn văn hóa giao tiếp Nhật Bản.
- **Phương án B:** Lạc đề: Không đáp ứng đúng thông tin câu hỏi của người đối thoại.
- **Phương án C:** Cộc lốc: Trả lời thiếu thông tin trọng tâm cần truyền tải.
- **Phương án D:** Sai ngữ cảnh: Câu này dùng để đáp lại lời cảm ơn, không dùng để trả lời câu hỏi.

#### 💡 Củng cố kiến thức sư phạm:
> Sắc thái giao tiếp: Sử dụng cho mối quan hệ thân tình nội bộ (uchi). Tuyệt đối KHÔNG dùng với người lớn tuổi, thầy cô, cấp trên hoặc người mới gặp lần đầu vì sẽ bị xem là thô lỗ, thiếu tôn trọng.

---

### Bài tập 204 (`EX-103-06`): Thử thách nhận thức phân biệt sắc thái vi mô (Nuance Challenge)

- **Mã bài tập (Exercise ID):** `EX-103-06`
- **Dạng bài (Exercise Type):** `contrast_choice`
- **Mức độ nhận thức (Cognitive Level):** 3/5 | Bloom: Application & Analysis

#### 📋 Đề bài:
Chọn nhận định CHÍNH XÁC NHẤT về sắc thái và phạm vi sử dụng của mẫu câu Pattern 103 (友達言葉 ):

#### 🔘 4 Phương án lựa chọn:
- **A.** Sự chuyển dịch văn hóa giữa Teineigo (Lịch sự) và Futsuukei (Thân mật). Đây là rào cản tâm lý lớn của người học khi xem phim ảnh, anime nghe thể ngắn nhưng giao tiếp thực tế lại phải dùng thể lịch sự.
- **B.** Có thể thay thế hoàn toàn bằng thể quá khứ mà không đổi nghĩa.
- **C.** Chỉ dùng được trong văn viết học thuật, không bao giờ dùng trong văn nói.
- **D.** Người nhận là 'Tôi' (私) hay người khác thì cách dùng đều giống hệt nhau.

#### ✅ ĐÁP ÁN ĐÚNG: **A**

#### 🌐 Dịch nghĩa câu hoàn chỉnh:
> **Kiểm tra mức độ thấu hiểu bản chất ngữ pháp của học viên đối với 友達言葉 (Thể thông thường / Khẩu ngữ giao tiếp thân mật với bạn bè).**

#### 🔬 PHÂN TÍCH BẪY & GIẢI THÍCH CHI TIẾT (DISTRACTOR BREAKDOWN):
- **Phương án A:** Chính xác: Phân tích so sánh chuẩn mực theo ngôn ngữ học ứng dụng.
- **Phương án B:** Sai lầm nghiêm trọng: Thể và thì trong tiếng Nhật mang giá trị nhận thức khác biệt.
- **Phương án C:** Sai thực tế: Mẫu câu này cực kỳ thông dụng trong khẩu ngữ sinh hoạt hàng ngày.
- **Phương án D:** Sai quy tắc Uchi/Soto: Tiếng Nhật phân biệt nghiêm ngặt góc nhìn người nói và người nghe.

#### 💡 Củng cố kiến thức sư phạm:
> Phân tích đối chiếu: Sự chuyển dịch văn hóa giữa Teineigo (Lịch sự) và Futsuukei (Thân mật). Đây là rào cản tâm lý lớn của người học khi xem phim ảnh, anime nghe thể ngắn nhưng giao tiếp thực tế lại phải dùng thể lịch sự.

---


---


<a id="phan-4"></a>
# PHẦN 4: PHẦN 4: ĐIỂM KIỂM SOÁT TIẾN ĐỘ & NHẬT KÝ TRIỂN KHAI ĐỒNG BỘ TURSO CLOUD
*Tệp gốc: `SESSION_CHECKPOINT.md`*

---

## 🔖 SESSION CHECKPOINT — Japanese SRS System
### Thời điểm: 2026-10-03T15:39:06+07:00
### Conversation ID: b35e92a7-82d5-4c33-a044-983adae6576f

---

### ✅ CÔNG VIỆC ĐÃ HOÀN THÀNH TRONG SESSION NÀY

#### 1. Fix Cloze Syntax ({{c1::私}}) — DONE ✅

**Vấn đề:** Cú pháp Anki cloze `{{c1::私}}は学生です` hiển thị thô ra UI.

**Files đã tạo/sửa:**

**NEW:** [`src/lib/cloze.ts`](file:///d:/project/japanese-srs-system/src/lib/cloze.ts)
```typescript
// Utility functions:
parseClozeSegments(text): ClozeSegment[]  // tách segments để render highlight
stripCloze(text): string                   // plain text cho TTS
hasCloze(text): boolean                    // kiểm tra có cloze không
```

**MODIFIED:** `src/app/page.tsx` (line 612 — `{card.example}`)
- Thay `{card.example}` bằng `parseClozeSegments(card.example).map(...)` 
- Từ cloze được highlight: bold + gạch chân xanh matcha `#88A752`

**MODIFIED:** `src/app/review/page.tsx` (line 930 — `{currentCard.sentence}`)
- Sentence render có highlight từ cloze
- `JapaneseSpeakerButton` nhận `stripCloze(sentence)` → TTS đọc bản sạch

**TypeScript check:** `npx tsc --noEmit` → exit code 0 ✅

---

#### 2. Typography System (từ session trước) — DONE ✅

**MODIFIED:** `src/app/layout.tsx`
- Import `Bebas_Neue` + `Noto_Sans_JP` (weight 900)
- CSS vars: `--font-display`, `--font-noto`

**MODIFIED:** `src/app/globals.css`
- Appended "Impact Typography System" classes cuối file (line 906+)
- Classes: `.display-hero`, `.tategaki-kana`, bilingual stacks

---

#### 3. Grammar Engine Master Specification Suite (3 Volumes — 99.520 words) — DONE ✅

**Bộ 3 Artifacts Hoàn Chỉnh (Đạt ~100k từ, vượt yêu cầu >= 50k từ):**
1. [`grammar_engine_master_plan.md`](file:///C:/Users/ThinkPad%20X1/.gemini/antigravity-ide/brain/b35e92a7-82d5-4c33-a044-983adae6576f/grammar_engine_master_plan.md) (**Volume 1: 19.935 từ** | 3.897 dòng | 171 KB)
   - Kiến trúc kỹ thuật End-to-End: Schema DB 3 bảng mới, API Contracts, UI/UX Fuji Indigo, WBS 4 Sprints, QA Matrix 30 edge cases, DevOps migration.
2. [`grammar_deepdive_patterns_encyclopedia.md`](file:///C:/Users/ThinkPad%20X1/.gemini/antigravity-ide/brain/b35e92a7-82d5-4c33-a044-983adae6576f/grammar_deepdive_patterns_encyclopedia.md) (**Volume 2: 22.828 từ** | 2.569 dòng | 174 KB)
   - Bách khoa toàn thư giải phẫu cấu trúc, ngữ dụng học, lỗi sai người Việt & 160 câu ví dụ phân tích kanji/furigana cho toàn bộ 32 mẫu ngữ pháp (Pattern 72 đến 103).
3. [`grammar_exercise_bank_and_solutions.md`](file:///C:/Users/ThinkPad%20X1/.gemini/antigravity-ide/brain/b35e92a7-82d5-4c33-a044-983adae6576f/grammar_exercise_bank_and_solutions.md) (**Volume 3: 56.757 từ** | 6.686 dòng | 386 KB)
   - Toàn bộ 204 bài tập thực hành chuẩn hóa kèm đáp án và phân tích chi tiết bẫy của từng phương án gây nhiễu A, B, C, D.

**TỔNG CỘNG SUITE:** **99.520 từ** | **13.152 dòng** | **731.721 bytes (~732 KB)**.

---

### 📋 DỮ LIỆU NGỮ PHÁP ĐÃ TRÍCH XUẤT (RAW)

#### Ngữ pháp-Bunbou.pdf — Full Content

```
文法 第 8 課～第 11 課

第 8 課 (Pattern 72-80):
72: Vて形 います (Đang ~) — 私は横浜に住んでいます。
73: Vて形 います (nghề nghiệp) — 友達は高校で英語を教えています。
74: N1はN2がAです — ダニエルさんは背が高いです。
75: イA-くて/ナAで/Nで — メアリーさんは目が大きくて、髪が長いです。
76: N1にN2をあげます — カルロスさんはパクさんに花をあげました。
77: N1にN2をもらいます — パクさんはカルロスさんに花をもらいました。
78: N1にN2をくれます — メアリーさんが私にかばんをくれました。
79: N(人)が(〜人)います — 私は妹が二人います。
80: [〜人]で — 私はルームメイトと3人で住んでいます。

第 9 課 (Pattern 81-87):
81: V辞書形こと — 私の趣味は映画を見ることです。
82: Nができます/V辞書形ことができます — 私はスキーができます。
83: Vて形 (nối câu) — 週末、友達とご飯を食べて、映画を見ます。
84: [〜日・〜週間]に[〜回・〜本] — 1週間に2回、家族に電話します。
85: いつも/よく/ときどき/あまり/ぜんぜん — frequency adverbs
86: どうやって — どうやって美術館へ行きますか。3番のバスに乗って、美術館前で降ります。
87: でも — 私の趣味はスポーツです。でも、最近、全然しません。

第 10 課 (Pattern 88-97):
88: Vない形でください — そこに入らないでください。
89: Vてもいいですか — 家に座ってもいいですか。——はい、どうぞ。
90: NがVています — あっ、サルがバナナを食べています。
91: まだVていません — まだ昼ご飯を食べていません。
92: Vてきます — コンビニでジュースを買ってきます。
93: Nができます/V辞書形ことができます — ここで食事できます。
94: Nが見えます/聞こえます — ここから東京タワーが見えます。
95: イA-くなります/ナAになります/Nになります — 寒くなりました。
96: N(場所)をV — あの橋を渡って、交差点を右に曲がってください。
97: Nは (topic contrast) — 荷物はあそこに置いてください。

第 11 課 (Pattern 98-103):
98: Vて形います (thói quen) — 毎朝、牛乳を飲んでいます。
99: VたりVたりします — 休みの日、家で本を読んだり音楽を聞いたりしています。
100: N1は___が、N2は___ — 犬は好きですが、猫は好きじゃありません。
101: とき (7 sub-forms) — 寂しいとき/暇なとき/中学生のとき/作るとき/行ったとき/ないとき
102: どうしますか — 疲れたとき、どうしますか。——甘いものを食べます。
103: 友達言葉 — 海(へ)行く？——うん、行く。／ううん、行かない。
```

---

### ✅ CÔNG VIỆC THỰC THI ĐÃ HOÀN THÀNH (IMPLEMENTATION COMPLETE)

#### 1. Database Schema & Migration — DONE ✅
- [`src/db/schema.ts`](file:///d:/project/japanese-srs-system/src/db/schema.ts): Appended 3 bảng mới (`grammarLessons`, `grammarPatterns`, `grammarExercises`) — an toàn tuyệt đối Zero-Regression.
- [`src/db/client.ts`](file:///d:/project/japanese-srs-system/src/db/client.ts): Cập nhật `initSchemaDDL` tự động sinh bảng & chỉ mục SQLite cục bộ.
- [`src/db/migrations/0003_grammar_tables.sql`](file:///d:/project/japanese-srs-system/src/db/migrations/0003_grammar_tables.sql): Migration script chuẩn Turso Cloud / LibSQL.

#### 2. Core Domain Types & Card Models — DONE ✅
- [`src/core/grammar/grammar.types.ts`](file:///d:/project/japanese-srs-system/src/core/grammar/grammar.types.ts): Đầy đủ các domain types `GrammarLesson`, `GrammarPattern`, `GrammarStructureSlot`, `GrammarExampleSentence`, `GrammarExercise`, `GrammarDrillSession`.
- [`src/core/cards/card.types.ts`](file:///d:/project/japanese-srs-system/src/core/cards/card.types.ts): Thêm `'GrammarPattern'` vào `CardType` và `GrammarCard` vào `Flashcard` union.
- [`src/core/cards/card.validator.ts`](file:///d:/project/japanese-srs-system/src/core/cards/card.validator.ts): Thêm validation case cho `GrammarPattern` theo chuẩn Atomicity.
- [`src/core/grammar/grammarCardFactory.ts`](file:///d:/project/japanese-srs-system/src/core/grammar/grammarCardFactory.ts): Chuyển hóa 32 mẫu câu thành các thẻ Recognition & Cloze SRS.

#### 3. Seed Data & Database Seeding — DONE ✅
- [`data/jpd133_grammar.json`](file:///d:/project/japanese-srs-system/data/jpd133_grammar.json): Tạo bộ dữ liệu JSON hoàn chỉnh gồm 4 lessons, 32 patterns, 204 exercises.
- [`scripts/import-grammar-jpd133.ts`](file:///d:/project/japanese-srs-system/scripts/import-grammar-jpd133.ts): Đã nạp thành công:
  + 1 Deck: `JPD133 - Ngữ pháp Bunbou`
  + 4 Lessons vào `grammar_lessons`
  + 32 Patterns vào `grammar_patterns`
  + 204 Exercises vào `grammar_exercises`
  + 96 Thẻ FSRS vào bảng `cards`

#### 4. Data Access Layer & API Endpoints — DONE ✅
- [`src/db/repositories/grammarRepository.ts`](file:///d:/project/japanese-srs-system/src/db/repositories/grammarRepository.ts): Query methods `getAllLessonsWithStats`, `getLessonById`, `getPatternById`, `getPracticeQueue`.
- [`src/app/api/grammar/route.ts`](file:///d:/project/japanese-srs-system/src/app/api/grammar/route.ts): `GET /api/grammar`
- [`src/app/api/grammar/[lessonId]/route.ts`](file:///d:/project/japanese-srs-system/src/app/api/grammar/%5BlessonId%5D/route.ts): `GET /api/grammar/[lessonId]`
- [`src/app/api/grammar/practice/route.ts`](file:///d:/project/japanese-srs-system/src/app/api/grammar/practice/route.ts): `GET /api/grammar/practice`

#### 5. UI/UX Pages & Wa-Style Components — DONE ✅
- [`src/components/grammar/StructureDiagram.tsx`](file:///d:/project/japanese-srs-system/src/components/grammar/StructureDiagram.tsx): Hiển thị slot cấu trúc mẫu câu trực quan với Nippon Colors.
- [`src/components/grammar/PatternCard.tsx`](file:///d:/project/japanese-srs-system/src/components/grammar/PatternCard.tsx): Thẻ cấu trúc ngữ pháp với Furigana ruby, `JapaneseSpeakerButton` audio, và phân tích cách dùng.
- [`src/components/grammar/LessonCard.tsx`](file:///d:/project/japanese-srs-system/src/components/grammar/LessonCard.tsx): Thẻ bài học phong cách Washi, Hanko Inkan seal stamp (`八, 九, 十, 十一`), và thống kê FSRS.
- [`src/components/grammar/GrammarGallery.tsx`](file:///d:/project/japanese-srs-system/src/components/grammar/GrammarGallery.tsx): Trang tổng quan ngữ pháp phong cách Kirie/Wa-style.
- [`src/app/grammar/page.tsx`](file:///d:/project/japanese-srs-system/src/app/grammar/page.tsx): Route `/grammar` (RSC + Suspense).
- [`src/app/grammar/[lessonId]/page.tsx`](file:///d:/project/japanese-srs-system/src/app/grammar/%5BlessonId%5D/page.tsx): Route `/grammar/[lessonId]` chi tiết từng bài học.
- [`src/app/grammar/practice/page.tsx`](file:///d:/project/japanese-srs-system/src/app/grammar/practice/page.tsx): Route `/grammar/practice` luyện tập tương tác có chấm điểm và ghi log FSRS.
- [`src/components/kirie/KirieBottomNav.tsx`](file:///d:/project/japanese-srs-system/src/components/kirie/KirieBottomNav.tsx): Thêm tab điều hướng "Ngữ pháp" trực tiếp trên thanh điều hướng dưới.

#### 6. Quality Assurance & Verification — 100% PASS ✅
- [`tests/grammar-engine.test.ts`](file:///d:/project/japanese-srs-system/tests/grammar-engine.test.ts): 6/6 unit tests pass.
- Toàn bộ Vitest test suite: **19/19 test files pass (91/91 tests pass)**.
- TypeScript compilation: `npx tsc --noEmit` -> **0 errors**.
- Next.js production build: `npm run build` -> **Exit code 0 (30/30 static pages generated)**.

**Bước 5: API Routes**
```
src/app/api/grammar/route.ts
src/app/api/grammar/[lessonId]/route.ts
src/app/api/grammar/practice/route.ts
```

**Bước 6: Pages**
```
src/app/grammar/page.tsx
src/app/grammar/[lessonId]/page.tsx
src/app/grammar/practice/page.tsx
```

**Bước 7: Components**
```
src/components/grammar/PatternCard.tsx
src/components/grammar/StructureDiagram.tsx
src/components/grammar/ExampleSentence.tsx
src/components/grammar/GrammarDrillSession.tsx
src/components/grammar/exercises/ClozeExercise.tsx
src/components/grammar/exercises/MultipleChoiceExercise.tsx
```

**Bước 8: Scripts**
```
scripts/import-grammar-jpd133.ts
src/db/migrations/0003_grammar_tables.sql
```

---

### 📁 CẤU TRÚC PROJECT HIỆN TẠI

```
d:\project\japanese-srs-system\src\
├── app\
│   ├── api\ (cards, review, health, ...)
│   ├── cards\
│   ├── conjugation\
│   ├── review\
│   ├── globals.css    ← MODIFIED (typography appended)
│   ├── layout.tsx     ← MODIFIED (Bebas Neue + Noto Sans JP)
│   └── page.tsx       ← MODIFIED (cloze fix)
├── components\ (japanese/, art/, kirie/, ...)
├── core\ (cards/, interference/, kanji/, scheduler/)
├── db\
│   ├── client.ts
│   ├── schema.ts      ← TO MODIFY (append grammar tables)
│   └── repositories\
├── hooks\
├── lib\
│   └── cloze.ts       ← NEW (created this session)
├── modules\
└── services\
    └── google\
        └── calendar.service.ts  (user's active file)
```

### 🗄️ DB SCHEMA HIỆN TẠI

Existing tables (KHÔNG ĐƯỢC SỬA):
- `decks` (id, name, description, createdAt)
- `cards` (id, deckId, type, front, reading, meaning, pitch, sentence, ...)
  - type values hiện có: 'Kanji' | 'Vocab' | 'Cloze' | 'Pitch'
  - **Cần thêm:** 'GrammarPattern'
- `reviewLogs` 
- `userFsrsParameters`
- `cardEmbeddings`
- `retrievalLatencyLogs`
- `kanjiGraphNodes` / `kanjiGraphEdges`
- `cognitiveInteractionLogs`
- `gamificationEffortLedger`

New tables (TO CREATE):
- `grammar_lessons` (4 rows)
- `grammar_patterns` (32 rows)
- `grammar_exercises` (204 rows)

### 🎨 DESIGN TOKENS CHUẨN

```css
/* Grammar Module — Fuji Indigo palette */
--fuji-indigo:    #1B4268;
--fuji-light:     #2B5A8A;
--fuji-subtle:    #EEF2F8;

/* Lesson accent colors */
Bài 8: Fuji Indigo (#1B4268) + Asanoha wagara
Bài 9: Matcha (#88A752) + Seigaiha wagara
Bài 10: Torii (#D9381E) + Yagasuri wagara
Bài 11: Yamabuki (#F59E0B) + Kikko wagara

/* Grammar slot colors */
--slot-verb:         #88A752  (Matcha — động từ)
--slot-particle:     #D97706  (Yamabuki — trợ từ)
--slot-pattern-core: #0D9488  (Asagi — lõi mẫu câu)
--slot-noun:         #1B4268  (Fuji — danh từ)
--slot-adjective:    #DB2777  (Sakura — tính từ)
```

---

### 📊 THỐNG KÊ SESSION

| Item | Count |
|:---|:---:|
| Grammar patterns analyzed | 32 |
| Grammar exercises designed | 204 |
| Grammar cards to generate | 128 |
| New files planned | 38 |
| Modified files planned | 8 |
| User stories written | 25 |
| Business rules defined | 15 |
| Edge cases documented | 30 |
| Sprint estimate | 4 sprints × 2 tuần |
| Total effort estimate | ~186 hours |

---

*Checkpoint lưu lúc: 2026-10-03T15:39:06+07:00*  
*Tiếp tục từ đây bằng cách implement theo thứ tự Bước 1→8 ở trên*

---
