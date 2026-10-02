# 🇯🇵 Japanese SRS System

Hệ thống ghi nhớ lặp lại ngắt quãng (Spaced Repetition System - SRS) chuyên sâu cho việc học tiếng Nhật, kết hợp thuật toán tối ưu nhận thức **FSRS (Free Spaced Repetition Scheduler)**, nguyên tắc **Atomicity (Thông tin tối thiểu)**, **Dual Coding (Kép hóa nhận thức)** và **AI Copilot Agent Architecture (Tầng Agent thông minh với Grounding RAG, Tool Calling & Guardrails)**.

---

## 📂 Cấu trúc thư mục dự án (Project Structure)

```text
japanese-srs-system/
├── data/
│   ├── app.db                               # File cơ sở dữ liệu SQLite cục bộ
│   └── audio/                               # Thư mục lưu trữ audio từ vựng (phục vụ Dual Coding)
├── src/
│   ├── agents/                              # [TẦNG AGENT MỚI] - AI Copilot & Cognitive Automation
│   │   ├── configs/                         # Cấu hình agent (Model, Temperature, Provider)
│   │   │   └── agent-config.ts
│   │   ├── knowledge/                       # [TÀI LIỆU CHO AGENT] (Grounding Docs / RAG)
│   │   │   ├── dynamic-knowledge.service.ts # Tri thức cá nhân hóa động (Đọc từ vựng S > 21 ngày từ SQLite)
│   │   │   ├── kanji/                       # Dữ liệu ngữ nguyên & bộ thủ chữ Hán
│   │   │   │   ├── semantic-radicals.json   # 214 bộ thủ biểu ý
│   │   │   │   └── phonetic-components.json # Các thành tố biểu âm Hình thanh (vd: 祭 (sai) trong 際, 察)
│   │   │   ├── grammar/                     # Ngữ pháp theo chuẩn JLPT (N5 -> N1)
│   │   │   │   └── n5-n3-grammar-points.md  # Ngữ cảnh dùng trợ từ và mẫu câu
│   │   │   ├── phonetics/                   # Quy tắc ngữ âm và trọng âm cao độ
│   │   │   │   └── pitch-accent-rules.md    # Quy tắc biến âm, hạ cao độ Tokyo
│   │   │   └── pedagogy/                    # Tri thức phương pháp luận học tập
│   │   │       ├── minimum-information.md   # Nguyên tắc thông tin tối thiểu (Piotr Wozniak)
│   │   │       ├── sentence-mining.md       # Kỹ thuật khai thác câu & căn chỉnh độ dài giải thích
│   │   │       └── desirable-difficulties.md # Nguyên tắc khó khăn mong muốn (Robert Bjork)
│   │   ├── skills/                          # [SKILLS / TOOLS] (Công cụ gọi qua Tool Calling)
│   │   │   ├── definitions/                 # JSON Schema mô tả skill để gửi cho LLM
│   │   │   │   └── agent-tools.schema.ts
│   │   │   ├── kanji-decomposer.skill.ts    # Phân rã chữ Hán thành phần âm và nghĩa
│   │   │   ├── sentence-mining.skill.ts     # Tạo câu ngữ cảnh đục lỗ cloze chuẩn i+1
│   │   │   ├── pitch-lookup.skill.ts        # Tra cứu mẫu cao độ (Heiban, Odaka,...)
│   │   │   └── card-creator.skill.ts        # Xuất thẻ chuẩn schema vào cơ sở dữ liệu
│   │   ├── constraints/                     # [CONSTRAINTS / GUARDRAILS] (Ràng buộc & Ranh giới)
│   │   │   ├── pedagogical-rules.ts         # Ràng buộc sư phạm (nghiêm cấm vi phạm i+1)
│   │   │   ├── prompt-guardrails.md         # System Prompts định hình ranh giới hành vi
│   │   │   ├── atomicity-validator.ts       # Kiểm tra 1 thẻ chỉ chứa 1 đơn vị thông tin
│   │   │   └── schema-guard.ts              # Zod Schema ép output dạng JSON có cấu trúc
│   │   └── copilot.service.ts               # Engine điều phối chính (Orchestrator)
│   │
│   ├── app/                                 # Routing & Giao diện người dùng (Next.js App Router)
│   │   ├── layout.tsx                       # Root layout giao diện
│   │   ├── globals.css                      # Biến giao diện & CSS toàn cục
│   │   ├── page.tsx                         # Dashboard: thống kê số thẻ đến hạn (Due), nút bắt đầu học
│   │   ├── review/
│   │   │   └── page.tsx                     # Giao diện ôn tập (Active Recall, chấm điểm Again/Hard/Good/Easy)
│   │   ├── cards/
│   │   │   ├── page.tsx                     # Quản lý danh sách thẻ, tìm kiếm, lọc theo deck
│   │   │   └── new/page.tsx                 # Giao diện tạo thẻ thủ công / Sentence Mining
│   │   └── api/
│   │       ├── review/route.ts              # API ghi nhận kết quả đánh giá thẻ (cập nhật DSR)
│   │       ├── cards/route.ts               # API CRUD thẻ học
│   │       └── nlp/route.ts                 # (Giai đoạn 2) API Furigana & Phân tích cấu trúc
│   ├── core/                                # Logic nghiệp vụ cốt lõi (Core Business & Cognitive Engine)
│   │   ├── scheduler/
│   │   │   ├── fsrs-engine.ts               # Wrapper cấu hình ts-fsrs (Retention rate, Fuzz factor)
│   │   │   └── scheduler.interface.ts       # Interface trừu tượng hóa bộ lập lịch
│   │   ├── cards/
│   │   │   ├── card.types.ts                # Định nghĩa các loại thẻ (Cloze, Kanji, Pitch)
│   │   │   └── card.validator.ts            # Kiểm tra Nguyên tắc Thông tin Tối thiểu (Atomicity)
│   │   └── interference/
│   │       └── similarity.ts                # (Giai đoạn 3) Phát hiện và lọc từ vựng dễ gây nhiễu
│   ├── modules/                             # Các module nghiệp vụ mở rộng chuyên sâu cho tiếng Nhật
│   │   ├── japanese-nlp/                    # (Giai đoạn 2) Xử lý tiếng Nhật (Kuromoji / MeCab)
│   │   │   ├── furigana.ts                  # Bộ trích xuất Furigana từ mặt chữ Kanji
│   │   │   └── pitch-lookup.ts              # Tra cứu mẫu cao độ (Heiban, Atamadaka,...)
│   │   ├── kanji-etymology/                 # (Giai đoạn 2) Dữ liệu nguồn gốc chữ Hán & Bộ thủ
│   │   │   ├── kanji-decomposer.ts          # Tách thành tố biểu ý và thành tố biểu âm (Hình thanh)
│   │   │   └── etymology-db.ts              # Bộ nhớ đệm tra cứu Naritachi
│   │   └── ai-copilot/                      # (Giai đoạn 3) AI sinh ngữ cảnh và đánh giá câu trả lời
│   │       ├── sentence-generator.ts        # Sinh câu ngữ cảnh i+1 cá nhân hóa
│   │       └── answer-evaluator.ts          # Đánh giá câu trả lời tự diễn giải (Self-Explanation)
│   ├── db/                                  # Tầng truy xuất dữ liệu (Data Access Layer)
│   │   ├── schema.ts                        # Định nghĩa schema cơ sở dữ liệu SQLite
│   │   ├── client.ts                        # Khởi tạo kết nối better-sqlite3 / Drizzle
│   │   └── repositories/
│   │       ├── card-repository.ts           # Thao tác đọc/ghi thẻ học
│   │       └── review-repository.ts         # Lưu trữ log ôn tập để phục vụ huấn luyện tham số
│   └── shared/                              # Tiện ích dùng chung
│       ├── constants/index.ts               # Hằng số hệ thống
│       └── utils/index.ts                   # Hàm tiện ích xử lý chuỗi, thời gian, Kanji
├── tests/                                   # Kiểm thử đơn vị cho thuật toán lập lịch và thẻ
│   └── scheduler.test.ts
├── package.json                             # Danh sách gói phụ thuộc và scripts
├── tsconfig.json                            # Cấu hình TypeScript & path aliases (@/*)
└── README.md                                # Tài liệu hướng dẫn dự án
```

---

## 🤖 Chi tiết Tầng Agent Mới (`src/agents/`)

- **Configs**: Quản lý thiết lập Model, Temperature, TopP, Provider (`openai`, `gemini`, `anthropic`, `ollama`).
- **Knowledge (Grounding RAG)**: Bộ tài liệu tri thức cho Agent tham chiếu để tránh hallucination:
  - *Kanji*: 214 bộ thủ Khang Hy (`semantic-radicals.json`) và thành tố biểu âm chữ Hình thanh (`phonetic-components.json`).
  - *Grammar*: Hệ thống trợ từ và mẫu câu N5 -> N3 (`n5-n3-grammar-points.md`).
  - *Phonetics*: Hệ thống 4 mẫu cao độ Tokyo (`pitch-accent-rules.md`).
  - *Pedagogy*: Nguyên tắc Thông tin Tối thiểu (`minimum-information.md`) và Khó khăn Mong muốn (`desirable-difficulties.md`).
### 2.2. Bảng Kỹ Năng & Công Cụ Thực Thi (Agent Skills / Function Calling)

| Tên Skill | Đầu vào (Input) | Tác vụ xử lý | Đầu ra (Output) |
| :--- | :--- | :--- | :--- |
| `generate_i_plus_one_sentence` | `target_word: string`,<br>`known_vocab: string[]` | Sinh 1 câu tự nhiên chỉ chứa duy nhất `target_word` là từ mới, phần còn lại dùng `known_vocab`. | `sentence`,<br>`cloze_target`,<br>`translation` |
| `decompose_kanji_etymology` | `kanji: string` | Tra cứu thành tố biểu ý và biểu âm trong `knowledge/kanji/`. | `semantic_radical`,<br>`phonetic_grapheme`,<br>`reading_rule` |
| `lookup_pitch_accent` | `word: string`,<br>`reading: string` | Xác định vị trí hạ cao độ (0: Heiban, 1: Atamadaka,...). | `pattern_code`,<br>`pitch_graph_svg` |
| `validate_and_save_card` | `card_draft: CardDraftDTO` | Kiểm tra ràng buộc và lưu trực tiếp vào bảng `cards` trong SQLite. | `card_id`,<br>`status: "created"` |

### 2.3. Ràng Buộc & Ranh Giới Nhận Thức (Constraints & Guardrails)

Constraints đảm bảo Agent luôn tuân thủ khoa học nhận thức và không tự ý thay đổi logic hệ thống:

1. **Ràng buộc Sư phạm (Pedagogical Constraints - [`pedagogical-rules.ts`](file:///d:/project/japanese-srs-system/src/agents/constraints/pedagogical-rules.ts))**:
   - *Nguyên tắc $i + 1$*: Nghiêm cấm đặt câu ví dụ có từ vựng N2/N1 khi người học đang ở trình độ N4/N5.
   - *Khó khăn mong muốn (Desirable Difficulties)*: Thẻ đục lỗ ngữ cảnh không được đưa gợi ý quá lộ liễu (như Furigana ngay trong câu hỏi) để kích hoạt quá trình gợi nhớ chủ động (Active Recall).

2. **Ràng buộc Tính Nguyên tử (Atomicity Constraint - [`atomicity-validator.ts`](file:///d:/project/japanese-srs-system/src/agents/constraints/atomicity-validator.ts))**:
   - Kiểm tra câu hỏi và câu trả lời. Nếu mặt sau của thẻ chứa **nhiều hơn 3 dòng giải thích** hoặc **gom cả On'yomi, Kun'yomi lẫn 5 nghĩa phái sinh vào một chỗ**, Agent sẽ tự động từ chối và yêu cầu tách thành nhiều thẻ nhỏ độc lập.

3. **Ràng buộc Đầu ra Cấu trúc (Schema Guards - [`schema-guard.ts`](file:///d:/project/japanese-srs-system/src/agents/constraints/schema-guard.ts))**:
   - Sử dụng thư viện `zod` để ép chặt định dạng phản hồi qua [`GeneratedCardSchema`](file:///d:/project/japanese-srs-system/src/agents/constraints/schema-guard.ts#L4): bắt buộc Hiragana chuẩn, giới hạn ký tự nghĩa chính, mã mẫu Pitch 0–4. Bắt lỗi ngay nếu LLM trả văn bản tự do.

4. **Ràng buộc Quyền sở hữu Nhận thức (Cognitive Ownership - [`cognitive-ownership.ts`](file:///d:/project/japanese-srs-system/src/agents/constraints/cognitive-ownership.ts))**:
   - Agent **không bao giờ tự ý chèn thẻ vào lịch học ngay lập tức**. Agent chỉ tạo bản nháp (**Draft**), giao diện bắt buộc người học phải đọc, duyệt hoặc chỉnh sửa trước khi lưu vào SQLite.

- **Orchestrator ([`copilot.service.ts`](file:///d:/project/japanese-srs-system/src/agents/copilot.service.ts))**: Engine điều phối trung tâm kết nối luồng: nhận input ➔ tra cứu tri thức ➔ gọi skills ➔ kiểm tra 4 lớp constraints ➔ xuất Draft chờ người học duyệt.

---

## 🧠 Phần 2: Kế Hoạch Chi Tiết Vận Hành Cho AI Agent

Để Agent không sinh nội dung lan man và luôn tuân thủ nguyên lý khoa học nhận thức, Agent được vận hành theo một quy trình khép kín gồm **5 pha tác vụ**:
1. **Pha 1: Tiếp nhận yêu cầu (Request Ingestion)**: Tiếp nhận từ mục tiêu, cách đọc và nghĩa cơ sở.
2. **Pha 2: Truy xuất bối cảnh (Context Retrieval)**: Đọc tri thức cố định và dynamic knowledge (từ vựng đã thuộc $S > 21$ ngày từ SQLite).
3. **Pha 3: Thực thi kỹ năng (Skill Execution)**: Ủy thác cho các Sub-Agents chuyên trách ([`MiningCopilotAgent`](file:///d:/project/japanese-srs-system/src/agents/subagents/mining-copilot.agent.ts), [`KanjiPitchExpertAgent`](file:///d:/project/japanese-srs-system/src/agents/subagents/kanji-pitch-expert.agent.ts)).
4. **Pha 4: Rà soát ràng buộc (Constraint & Guardrail Review)**: Sub-Agent [`CognitiveGuardrailAgent`](file:///d:/project/japanese-srs-system/src/agents/subagents/cognitive-guardrail.agent.ts) kiểm tra tính nguyên tử, cấm quá 3 dòng, cấm gộp nhiều nghĩa và ép kiểu Zod Schema.
5. **Pha 5: Xác nhận của người học (Learner Confirmation)**: Lưu ở trạng thái `draft`, chỉ lưu vào SQLite khi người học phê duyệt.

### 1. Bảng Phân Vai Các Sub-Agent & Kỹ Năng (Skills)

| Thành phần | Trách nhiệm chính | Tài liệu tham chiếu (Knowledge) | Đầu ra kiểm chuẩn | File cài đặt |
| :--- | :--- | :--- | :--- | :--- |
| **Mining Copilot** | Tiếp nhận từ mới, phân tích ngữ cảnh, sinh câu đục lỗ cloze chuẩn $i + 1$. | `src/agents/knowledge/grammar/` và danh sách từ vựng đã thuộc từ SQLite. | 1 câu ví dụ tự nhiên, đúng ngữ pháp, duy nhất từ mục tiêu là từ mới. | [`mining-copilot.agent.ts`](file:///d:/project/japanese-srs-system/src/agents/subagents/mining-copilot.agent.ts) |
| **Kanji & Pitch Expert** | Phân tích bộ thủ, trích xuất thành tố biểu âm (chữ Hình thanh) và gán mẫu cao độ. | `knowledge/kanji/phonetic-components.json`, `knowledge/phonetics/pitch-rules.md`. | Tên bộ thủ, âm On'yomi đồng dạng, mã cao độ (0, 1, 2, 3). | [`kanji-pitch-expert.agent.ts`](file:///d:/project/japanese-srs-system/src/agents/subagents/kanji-pitch-expert.agent.ts) |
| **Cognitive Guardrail** | Kiểm tra vi phạm nguyên tắc nhận thức và ép cấu trúc dữ liệu trước khi lưu. | `knowledge/pedagogy/minimum-information.md`, Zod Schema (`GeneratedCardSchema`). | JSON hợp lệ; từ chối nếu câu giải thích quá 3 dòng hoặc gộp nhiều nghĩa. | [`cognitive-guardrail.agent.ts`](file:///d:/project/japanese-srs-system/src/agents/subagents/cognitive-guardrail.agent.ts) |

### 2. Chu Trình Làm Việc Từng Bước Của Agent (Step-by-Step Agent Pipeline)

- **Bước 1: Tiếp nhận đầu vào (Input Ingestion)**:
  - Người học cung cấp một từ vựng mới muốn học (ví dụ: `警察` – `けいさつ`) hoặc dán một đoạn văn tiếng Nhật vừa đọc được trên mạng.
- **Bước 2: Truy xuất bối cảnh cá nhân hóa (Dynamic Context Retrieval)**:
  - Agent tự động truy vấn SQLite để lấy danh sách các từ vựng người học đã làm chủ (những thẻ có độ ổn định FSRS $S > 21$ ngày).
  - Tải cấu trúc thành tố ngữ nguyên học tương ứng từ thư mục `knowledge/kanji/`.
- **Bước 3: Kích hoạt kỹ năng thực thi (Skill Execution)**:
  - *Skill `generate_i_plus_one_sentence`*: Sinh một câu ví dụ tiếng Nhật tự nhiên ở cấp độ JLPT phù hợp, trong đó mọi từ ngữ khác đều nằm trong danh sách đã biết, chỉ duy nhất từ mới là $i + 1$.
  - *Skill `decompose_kanji_etymology`*: Phát hiện chữ `警` có bộ Thủ `言` (ngôn ngữ) và thành tố biểu âm `敬` (đều đọc là *kei*); chữ `察` có thành tố `祭` (đều đọc là *satsu*), hỗ trợ ghi nhớ âm đọc có quy luật.
  - *Skill `lookup_pitch_accent`*: Xác định từ `警察` thuộc mẫu cao độ Heiban (0).
- **Bước 4: Kiểm duyệt ràng buộc tự động (Constraint & Guardrail Audit)**:
  - Đầu ra của Agent được chuyển qua bộ thẩm định [`atomicity-validator.ts`](file:///d:/project/japanese-srs-system/src/agents/constraints/atomicity-validator.ts) và thư viện kiểm tra cấu trúc Zod [`schema-guard.ts`](file:///d:/project/japanese-srs-system/src/agents/constraints/schema-guard.ts).
  - Nếu phát hiện thẻ chứa cả nghĩa phái sinh phức tạp hoặc vượt quá 1 khái niệm mục tiêu, Guardrail sẽ lập tức yêu cầu Agent phân rã thành các thẻ riêng biệt để tuân thủ Nguyên tắc Thông tin Tối thiểu.
- **Bước 5: Xác nhận của người học & Lưu vào hệ thống (Human-in-the-Loop)**:
  - Bản nháp hiển thị lên màn hình để người học đọc qua, chỉnh sửa câu chữ theo ý muốn nhằm bảo toàn quyền sở hữu nhận thức (*Cognitive Ownership*).
  - Khi người học ấn nút **Lưu (Approve)**, hàm [`card-creator.skill.ts`](file:///d:/project/japanese-srs-system/src/agents/skills/card-creator.skill.ts) khởi tạo thẻ mới với các chỉ số ban đầu của FSRS ($D = 0, S = 0, \text{State} = 0$) và lưu trực tiếp vào cơ sở dữ liệu SQLite.

---

## 🗺️ 4. Lộ Trình Áp Dụng: Từ Base Đến Tích Hợp Đầy Đủ

### 1. Hiện tại (Base MVP - Học ngay lập tức):
- Tạo sẵn thư mục `src/agents/knowledge/` và copy các tài liệu tham khảo (như danh sách bộ thủ, bảng ngữ pháp) vào dạng file Markdown/JSON.
- Tự tay tạo thẻ học dựa trên các nguyên tắc lưu trong `knowledge/pedagogy/minimum-information.md`. Lúc này chưa cần kết nối API của LLM, bạn đã có ngay một hệ thống học tuân thủ chuẩn FSRS.

### 2. Bước tiếp theo (Tích hợp Skill Đơn Lẻ):
- Tạo file `copilot.service.ts` gọi đến OpenAI, Claude hoặc Gemini API.
- Sử dụng System Prompt trong thư mục `constraints/` kết hợp với `schema-guard.ts` để tạo chức năng: **Nhập 1 từ tiếng Nhật ➔ Nhận về bản nháp thẻ chuẩn đục lỗ ngữ cảnh $i + 1$ và âm đọc Furigana**.
- Tích hợp endpoint API [`POST /api/copilot/draft`](file:///d:/project/japanese-srs-system/src/app/api/copilot/draft/route.ts).

### 3. Hoàn thiện (Tự Động Hóa Đa Kỹ Năng):
- Bật cơ chế **Function Calling** cho Agent tự động tra cứu bộ nhớ SQLite (`dynamic-knowledge.service.ts` với ngưỡng $S > 21$ ngày), nhận diện từ dễ gây nhiễu ngữ nghĩa để sắp xếp xen kẽ (Interleaving), và tự tạo thẻ trực tiếp sau khi bạn phê duyệt (Cognitive Ownership).




