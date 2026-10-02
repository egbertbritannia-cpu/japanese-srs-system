# 🏛️ TÀI LIỆU 13: KẾ HOẠCH PHÂN TẦNG TỔNG QUAN NÂNG CẤP HỆ THỐNG CHUYÊN SÂU
## Dự án: Japanese SRS System · 記憶道 (FSRS Cognitive Spaced Repetition Engine)
## Cấp độ: Master Strategic Blueprint & Stratified Architectural Roadmap (Tầng 0 - L0)
## Trạng thái: PHÊ DUYỆT KIẾN TRÚC & SẴN SÀNG TRIỂN KHAI PHÂN TẦNG

---

> [!IMPORTANT]
> **ĐỊNH HƯỚNG TỔNG THỂ**: Tài liệu này đóng vai trò là **Bản quy hoạch kiến trúc phân tầng cấp cao nhất (L0)**. Toàn bộ kế hoạch được cấu trúc theo mô hình kim tự tháp nhận thức: đi từ **Chiến lược vĩ mô & Ranh giới phạm vi (Tầng 0)** $\rightarrow$ **4 Trụ cột chuyên sâu (Tầng 1 - Tài liệu 14, 15, 16, 17)** $\rightarrow$ **Đặc tả kỹ thuật nguyên tử & Mã giả thuật toán (Tầng 2 - Tài liệu 18)**.
> Tuyệt đối không để xảy ra mơ hồ kỹ thuật hoặc suy diễn tùy tiện ở các bước triển khai.

---

## 1. BỐI CẢNH KHOA HỌC & TUYÊN NGÔN KIẾN TRÚC NHẬN THỨC

### 1.1. Thực trạng & Khoảng cách Khoa học (The Cognitive Gap)
Hệ thống hiện tại đã hoàn thành Base MVP với giao diện mỹ thuật Nhật Bản Wa-Modern, thuật toán FSRS v4/v5 cơ sở, và quản lý theo bộ thẻ (Decks). Tuy nhiên, đối chiếu với các phát hiện mới nhất về khoa học nhận thức (Cognitive Science 2025–2027), hệ thống vẫn còn 4 điểm nghẽn nghiêm trọng:

1. **Điểm nghẽn 1: 21 tham số FSRS dùng chung (Generic Parameters Fallacy)**
   - FSRS mặc định dùng 21 trọng số tối ưu từ hàng triệu lượt ôn tập của cộng đồng. Tuy nhiên, tốc độ quên, độ nhạy cảm nhận thức và thói quen học tập của mỗi cá nhân là duy nhất. Việc thiếu một bộ tối ưu tham số nội tại (Personalized Optimizer) khiến độ chính xác dự báo Retrievability $R(t)$ lệch tới $18\% - 25\%$ so với thực tế của từng học viên.
2. **Điểm nghẽn 2: Can thiệp ngữ nghĩa trong hàng đợi (Semantic Interference Blindness)**
   - Hàng đợi ôn tập hiện tại chỉ sắp xếp dựa trên thời gian đến hạn ($Due$). Khi các từ có độ tương đồng ngữ nghĩa cao (ví dụ: các tính từ đồng nghĩa hoặc các từ chỉ cảm xúc cùng xuất hiện liên tiếp), não bộ học viên rơi vào hiện tượng *Can thiệp chủ động (Proactive Interference)* và *Can thiệp hồi quy (Retroactive Interference)* theo mô hình LECTOR, khiến tỷ lệ nhầm lẫn tăng vọt.
3. **Điểm nghẽn 3: Quá tải ngoại lai khi học Hán tự (Extraneous Cognitive Load in Kanji)**
   - Phương pháp phân rã Kanji thành nét vẽ liên tưởng ngẫu nhiên tạo ra tải nhận thức vô ích. Nghiên cứu *KanjiCompass (2025)* chứng minh rằng hơn 65% Kanji là chữ Hình thanh (Keisei-moji). Việc thiếu một đồ thị tri thức ngữ nguyên học phân tách rạch ròi giữa *Thành tố biểu âm (Phonetic Grapheme)* và *Bộ thủ biểu ý (Semantic Radical)* làm mất đi khả năng suy luận âm On có hệ thống.
4. **Điểm nghẽn 4: Tương tác lật thẻ đơn điệu & Thưởng ảo (Passive Review & Superficial Streaks)**
   - Thao tác lật thẻ nhị phân (Front $\rightarrow$ Back) tạo ra "ảo tưởng thông thạo" (Illusion of Competence). Nghiên cứu *Memdora & TriGen* chỉ ra rằng não bộ cần luân chuyển qua 4 cấp độ khó khăn mong muốn (Desirable Difficulties). Đồng thời, cơ chế thưởng chuỗi ngày (Streak) hiện nay chỉ đo sự hiện diện bề mặt, không đo lường nỗ lực xử lý nhận thức thực sự.

---

## 2. PHẠM VI (SCOPE) & RANH GIỚI BẢO MẬT HỆ THỐNG

### 2.1. Hạng mục Trong phạm vi (In-Scope Deliverables)

```mermaid
graph TD
    Root["HỆ THỐNG FSRS NÂNG CẤP CHUYÊN SÂU"] --> P1["Trụ Cột 1: Lập Lịch Thích Ứng & Kiểm Soát Can Thiệp"]
    Root --> P2["Trụ Cột 2: Đồ Thị Tri Thức Chữ Hán KanjiCompass"]
    Root --> P3["Trụ Cột 3: Đa Dạng Hóa Tương Tác & AI Evaluator"]
    Root --> P4["Trụ Cột 4: Pipeline Bóc Tách Tự Động & MED Gamification"]

    P1 --> P1_1["FSRS 21-Parameter WASM Optimizer"]
    P1 --> P1_2["LECTOR Cosine Semantic Interleaving Queue"]
    P1 --> P1_3["Bjork Latency Dynamics Engine"]

    P2 --> P2_1["Keisei-moji Graph Database Engine"]
    P2 --> P2_2["Adaptive SRL Phonetic Clustering Path"]

    P3 --> P3_1["4-Tier Desirable Difficulty Taxonomy"]
    P3 --> P3_2["Conversational Semantic Evaluator"]

    P4 --> P4_1["Single-Gesture Browser Extension (Manifest V3)"]
    P4 --> P4_2["Minimum Effective Dose (MED) Gamification"]
```

### 2.2. Hạng mục Ngoài phạm vi & Giới hạn Bất biến (Out-of-Scope & Non-Goals)
1. ❌ **Không phá vỡ tính tương thích ngược của Database hiện tại**: Bảng `cards`, `decks`, `review_logs` được giữ nguyên vẹn; các trường dữ liệu nâng cao được mở rộng thông qua các bảng quan hệ bổ trợ (`card_embeddings`, `kanji_graph_nodes`, `kanji_graph_edges`, `retrieval_latency_logs`, `gamification_effort_ledger`).
2. ❌ **Không can thiệp vào mã nguồn gốc của Next.js UI Core**: Các trang hiện tại (`/`, `/cards`, `/review`, `/cards/new`, `/integrations`) giữ nguyên luồng vận hành nền tảng; các tính năng mới được tích hợp theo dạng module/modal/service mở rộng.
3. ❌ **Không ép buộc phụ thuộc Cloud GPU đắt đỏ**: Bộ huấn luyện FSRS chạy trực tiếp trên client hoặc worker Node.js qua WebAssembly; mô hình nhúng vector (embedding) sử dụng API nhẹ hoặc on-device embeddings; LLM Evaluator có cơ chế bộ đệm (cache) và prompt ngắn gọn ($\le 2$ câu).
4. ❌ **Không loại bỏ quyền kiểm soát của người học (Cognitive Ownership)**: Toàn bộ quá trình bóc tách từ vựng qua Extension đều phải qua bước người học duyệt (Review & Co-creation), tuyệt đối không tự động bơm thẻ rác vào DB.

---

## 3. BẢNG MA TRẬN 4 TRỤ CỘT & PHÂN BỔ TÀI LIỆU KỸ THUẬT

| Trụ Cột | Tên Chuyên Đề | Trọng Tâm Khoa Học & Kỹ Thuật | File Kế Hoạch Chi Tiết |
| :--- | :--- | :--- | :--- |
| **Trụ Cột 1** | **Động Cơ Lập Lịch Thích Ứng & Kiểm Soát Can Thiệp Ngữ Nghĩa** | Tối ưu 21 tham số FSRS bằng WASM Rust; Thuật toán xen kẽ LECTOR với khoảng cách Cosine; Hiệu chỉnh sức mạnh lưu trữ qua độ trễ phản xạ Bjork chuẩn hóa theo độ dài ngữ cảnh. | [`doc/14_PILLAR_1_ADAPTIVE_FSRS_AND_SEMANTIC_INTERFERENCE.md`](file:///D:/project/japanese-srs-system/doc/14_PILLAR_1_ADAPTIVE_FSRS_AND_SEMANTIC_INTERFERENCE.md) |
| **Trụ Cột 2** | **Đồ Thị Tri Thức Chữ Hán Theo Ngữ Nguyên Học (KanjiCompass)** | Cấu trúc Graph DB chữ Hình thanh (Keisei-moji); Phân loại Lục thư chuẩn xác; Phân rã Node thành tố biểu âm & biểu ý; Lộ trình học tự điều chỉnh (SRL) gom cụm đồng âm. | [`doc/15_PILLAR_2_KANJICOMPASS_ETYMOLOGICAL_KNOWLEDGE_GRAPH.md`](file:///D:/project/japanese-srs-system/doc/15_PILLAR_2_KANJICOMPASS_ETYMOLOGICAL_KNOWLEDGE_GRAPH.md) |
| **Trụ Cột 3** | **Đa Dạng Hóa Tương Tác Nhận Thức & Semantic Evaluator** | Hệ thống 4 dạng tương tác khó khăn mong muốn (Generative Cloze, Interrogation, Pitch Accent, Free Production); Thuật toán Levenshtein Fuzzy Matching; LLM Evaluator có bộ đệm băm SHA-256. | [`doc/16_PILLAR_3_COGNITIVE_INTERACTION_AND_SEMANTIC_EVALUATOR.md`](file:///D:/project/japanese-srs-system/doc/16_PILLAR_3_COGNITIVE_INTERACTION_AND_SEMANTIC_EVALUATOR.md) |
| **Trụ Cột 4** | **Pipeline Thu Thập Dữ Liệu Tự Động & Gamification Nỗ Lực** | Chrome Extension Manifest V3 bóc tách 1 chạm từ NHK/YouTube; Bộ lọc ràng buộc $i+1$; Gamification dựa trên Liều lượng Nhận thức Tối thiểu (MED) kèm Anti-Idle Check. | [`doc/17_PILLAR_4_AUTOMATED_MINING_PIPELINE_AND_GAMIFICATION.md`](file:///D:/project/japanese-srs-system/doc/17_PILLAR_4_AUTOMATED_MINING_PIPELINE_AND_GAMIFICATION.md) |
| **Đặc Tả Kỹ Thuật** | **Lược Đồ Dữ Liệu, Giải Tích Toán Học & Mã Giả Thuật Toán** | Toàn văn DDL SQL; Công thức vi phân FSRS v5; Cây thư mục tệp tin chi tiết; Mã giả TypeScript; API Specs & SLAs. | [`doc/18_TECHNICAL_SPEC_AND_ATOMIC_IMPLEMENTATION_BLUEPRINT.md`](file:///D:/project/japanese-srs-system/doc/18_TECHNICAL_SPEC_AND_ATOMIC_IMPLEMENTATION_BLUEPRINT.md) |

---

## 4. LỘ TRÌNH PHÂN KỲ PHÁT TRIỂN & TIÊU CHUẨN CỔNG CHUYỂN GIAI ĐOẠN (GATE CHECKS)

```
[Giai đoạn Hiện tại: Đã Hoàn Thành Base MVP & Deploy Vận Hành]
                          │
                          ▼
[Giai đoạn 1: FSRS Optimizer & Semantic Interference (Tuần 1 - 2)]
  - Tích hợp @open-spaced-repetition/binding để tối ưu 21 trọng số
  - Bổ sung vector embedding cho từ vựng, kích hoạt thuật toán xen kẽ LECTOR
  - Ghi nhận latency_ms chuẩn hóa theo độ dài câu để hiệu chỉnh phản xạ truy xuất
  - GATE CHECK 1: RMSE giảm >= 15%, không có 2 thẻ sim >= 0.85 đứng cạnh nhau
                          │
                          ▼
[Giai đoạn 2: KanjiCompass Graph & Pitch Integration (Tuần 3 - 4)]
  - Xây dựng database quan hệ chữ Hình thanh (Keisei-moji) và Lục thư
  - Tích hợp tra cứu quy luật âm On từ thành tố biểu âm qua CTE đệ quy
  - Thiết kế dạng thẻ nhận diện mẫu cao độ Heiban / Atamadaka
  - GATE CHECK 2: Seed thành công 2.136 chữ Joyo Kanji, truy vấn họ hàng < 10ms
                          │
                          ▼
[Giai đoạn 3: 4 Dạng Tương Tác Nhận Thức & Semantic Evaluator (Tháng 2)]
  - Bổ sung chế độ gõ chữ tạo sinh (Generative Cloze với Levenshtein)
  - Tích hợp LLM đánh giá câu tự đặt với bộ đệm SHA-256
  - Thêm cơ chế thưởng dựa trên nỗ lực nhận thức
  - GATE CHECK 3: AI Evaluator phản hồi P95 < 850ms, Flow không bị gián đoạn
                          │
                          ▼
[Giai đoạn 4: Chrome Extension 1-Click Mining (Tháng 2 - 3)]
  - Xây dựng Web Extension bóc tách câu trực tiếp từ NHK / YouTube
  - Hoàn thiện pipeline Co-creation giữ vững Cognitive Ownership
  - Tích hợp Anti-Idle Monitor cho chuẩn MED 5 phút
  - GATE CHECK 4: Bóc tách 1 chạm thành công trên cả báo NHK và video YouTube
```

---

## 5. MA TRẬN PHÂN ĐỊNH TRÁCH NHIỆM ĐA VAI TRÒ (RACI MATRIX)

| Gói Công Việc (Work Package) | BA | PM | Designer | Dev | QA | DevOps |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **WP1: FSRS Optimizer & LECTOR Interleaving** | C | A | I | R | R | C |
| **WP2: KanjiCompass Graph Engine & CTE** | R | A | C | R | R | I |
| **WP3: 4 Dạng Tương Tác & AI Evaluator** | C | A | R | R | R | I |
| **WP4: Chrome Extension & MED Gamification** | R | A | R | R | R | C |
| **WP5: Database Migrations & Performance SLAs**| I | A | I | R | R | R |

*(R: Responsible - Thực thi chính; A: Accountable - Chịu trách nhiệm cuối; C: Consulted - Tham vấn chuyên môn; I: Informed - Nhận thông báo)*

---

## 6. MA TRẬN RỦI RO & CHIẾN LƯỢC PHÒNG NGỪA (RISK & MITIGATION)

| STT | Rủi ro Tiềm ẩn | Mức độ | Tác động | Chiến lược Giảm thiểu Kỹ thuật |
| :---: | :--- | :---: | :--- | :--- |
| **R1** | Tối ưu hóa FSRS 21 tham số gây quá tải CPU trên trình duyệt hoặc Vercel Serverless | Cao | Serverless timeout ($>10$s) hoặc đơ giao diện người dùng | Chạy quá trình tối ưu trong Web Worker trên client, hoặc background job trên máy chủ có giới hạn thời gian (Max 30s), dùng thuật toán Adam Mini-batch tối ưu trong WASM. |
| **R2** | Chi phí API Embedding & LLM tăng cao khi tính Cosine khoảng cách cho hàng trăm thẻ | Trung bình | Tốn kém chi phí token OpenAI | Áp dụng mô hình Hybrid Embedding: Dùng on-device ONNX runtime `@xenova/transformers` miễn phí làm mặc định, chỉ dùng cloud khi cần độ chính xác cao. |
| **R3** | AI Semantic Evaluator phản hồi chậm làm gián đoạn trạng thái tập trung (Flow State) | Cao | Người học phải đợi 3-5 giây cho mỗi thẻ ôn tập | Áp dụng bộ đệm băm SHA-256 trên SQLite/Memory và Timeout 1.2s; tự động fallback sang Heuristic match khi mạng lag. |
| **R4** | Extension bóc tách các câu quá khó (vượt quá trình độ $i+1$) gây nản chí | Trung bình | Học sinh bị dồn dập từ vựng N1 trong khi đang ở trình độ N4 | Bộ lọc `PedagogicalRulesGuard` kiểm tra tỷ lệ từ lạ trong câu: Nếu câu chứa $\ge 2$ từ lạ ngoài tầm thẻ đã học, cảnh báo học sinh và đề xuất câu văn giản lược hơn. |

---

## 7. TIÊU CHÍ NGHIỆM THU ĐỊNH LƯỢNG (QUANTITATIVE ACCEPTANCE CRITERIA)

1. **Hiệu suất thuật toán FSRS (Predictive Accuracy)**:
   - Sai số bình phương trung bình (RMSE) giữa Retrievability dự báo và xác suất nhớ thực tế giảm tối thiểu $15\%$ sau khi kích hoạt bộ tối ưu cá nhân hóa so với bộ trọng số mặc định.
2. **Hiệu ứng giảm can thiệp (Interference Reduction)**:
   - $100\%$ các thẻ có độ tương đồng ngữ nghĩa $\text{sim} \ge 0.85$ được tách biệt tối thiểu 3 thẻ đệm hoặc dời sang phiên khác trong Review Queue.
3. **Phản xạ truy xuất (Latency-Driven Retrievability)**:
   - Các lượt đánh giá "Good/Easy" có thời gian phản xạ thuần $> 4.500$ms (sau khi trừ reading budget) được ghi nhận và phạt độ ổn định chính xác theo đúng ma trận phân rã Bjork.
4. **Đồ thị KanjiCompass**:
   - Truy xuất tức thì ($< 10$ms) toàn bộ thành tố biểu âm, bộ thủ biểu ý và họ hàng chữ Hán tương ứng cho bất kỳ chữ Kanji nào trong danh mục 2.136 chữ Joyo Kanji thông qua câu truy vấn CTE.
5. **Độ mượt mà của phiên ôn tập (Interaction Latency SLA)**:
   - Thao tác lật thẻ và chuyển câu $< 50$ms.
   - Phản hồi từ AI Semantic Evaluator P95 $< 850$ms.

---

> [!NOTE]
> Mời tiếp tục chuyển sang các tài liệu phân tầng chi tiết:
> - [`14_PILLAR_1_ADAPTIVE_FSRS_AND_SEMANTIC_INTERFERENCE.md`](file:///D:/project/japanese-srs-system/doc/14_PILLAR_1_ADAPTIVE_FSRS_AND_SEMANTIC_INTERFERENCE.md)
> - [`15_PILLAR_2_KANJICOMPASS_ETYMOLOGICAL_KNOWLEDGE_GRAPH.md`](file:///D:/project/japanese-srs-system/doc/15_PILLAR_2_KANJICOMPASS_ETYMOLOGICAL_KNOWLEDGE_GRAPH.md)
> - [`16_PILLAR_3_COGNITIVE_INTERACTION_AND_SEMANTIC_EVALUATOR.md`](file:///D:/project/japanese-srs-system/doc/16_PILLAR_3_COGNITIVE_INTERACTION_AND_SEMANTIC_EVALUATOR.md)
> - [`17_PILLAR_4_AUTOMATED_MINING_PIPELINE_AND_GAMIFICATION.md`](file:///D:/project/japanese-srs-system/doc/17_PILLAR_4_AUTOMATED_MINING_PIPELINE_AND_GAMIFICATION.md)
> - [`18_TECHNICAL_SPEC_AND_ATOMIC_IMPLEMENTATION_BLUEPRINT.md`](file:///D:/project/japanese-srs-system/doc/18_TECHNICAL_SPEC_AND_ATOMIC_IMPLEMENTATION_BLUEPRINT.md)
