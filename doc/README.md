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

10. **[SKILL_AGENT_PLAYBOOK.md](file:///D:/project/japanese-srs-system/doc/SKILL_AGENT_PLAYBOOK.md)**  
   *Cẩm nang Kỹ năng Đa Vai trò (Master Multi-Role Engineering Playbook)*: Tổng hợp toàn diện 8 kỹ năng Antigravity cho toàn bộ các vai trò (BA, PM, Designer, Dev, QA, DevOps) và quy chuẩn kiểm định tự động.

11. **[09_DECK_BASED_STUDY_HIERARCHICAL_PLAN.md](file:///D:/project/japanese-srs-system/doc/09_DECK_BASED_STUDY_HIERARCHICAL_PLAN.md)**  
   *Kế hoạch Phân tầng Cải tiến Hệ thống — Ôn tập theo từng Bộ Thẻ (Deck-Based SRS Architecture)*: Bản quy hoạch 5 tầng từ Chiến lược vĩ mô (Tầng 1) $\rightarrow$ Kiến trúc 4 trụ cột (Tầng 2) $\rightarrow$ Đặc tả kỹ thuật module & Routing (Tầng 3) $\rightarrow$ Danh mục Micro-Tasks nguyên tử (Tầng 4) $\rightarrow$ Ma trận kiểm thử nghiệm thu 12 test cases (Tầng 5).

12. **[10_MULTI_ROLE_AGENT_COLLABORATION_GUIDE.md](file:///D:/project/japanese-srs-system/doc/10_MULTI_ROLE_AGENT_COLLABORATION_GUIDE.md)**  
   *Cẩm nang Phối hợp Đa Vai trò (Multi-Role Agent Collaboration Guide)*: Quy định chi tiết vòng đời phối hợp tuần tự (Sequence Diagram), ma trận phân định trách nhiệm, và 6 giao thức bàn giao (Handoff Protocols) giữa BA, PM, Designer, Dev, QA, và DevOps.

13. **[11_JAPANESE_GRAPHIC_DESIGN_DECONSTRUCTION.md](file:///D:/project/japanese-srs-system/doc/11_JAPANESE_GRAPHIC_DESIGN_DECONSTRUCTION.md)**  
   *Giải mã Chuyên sâu Phong cách Thiết kế Đồ họa Nhật Bản (Japanese Graphic Design Deconstruction)*: Bóc tách toàn diện 2 tư liệu từ `C:\Users\ThinkPad X1\Pictures\japanese-graphic-design` về trường phái Wa-Modern Bento Grid, bảng màu Red-Indigo-Washi, cấu trúc lưới mộc bản, typography trục kép (Tate/Yoko-gaki), và các mô-típ văn hóa kinh điển (Sóng lừng Hokusai, mặt trời Hinomaru, gia huy Kamon, tranh mỹ nhân Bijin-ga).

14. **[12_AUTHENTIC_WA_ART_REDESIGN_MASTER_PLAN.md](file:///D:/project/japanese-srs-system/doc/12_AUTHENTIC_WA_ART_REDESIGN_MASTER_PLAN.md)**  
   *Kế hoạch Tái thiết kế Tích hợp Tranh Nghệ thuật & Văn hóa Nhật Bản (Authentic Wa-Art & Cultural Redesign Master Plan)*: Quy hoạch 5 tầng chi tiết bóc tách và phân bổ 13 tác phẩm hội họa mộc bản Ukiyo-e, Rinpa, Yuzen từ bộ sưu tập thực tế (`public/assets/art/`) vào các vị trí tối ưu trên toàn bộ 5 màn hình hệ thống (Honmaru Dashboard, Tanzakucho Cards, Shodo Copilot, Karuta Review, Kura Integrations).

15. **[13_COGNITIVE_UPGRADE_MASTER_STRATIFIED_PLAN.md](file:///D:/project/japanese-srs-system/doc/13_COGNITIVE_UPGRADE_MASTER_STRATIFIED_PLAN.md)**  
   *Kế hoạch Phân tầng Tổng quan Nâng cấp Hệ thống Chuyên sâu (Tầng 0 - L0)*: Bản quy hoạch chiến lược vĩ mô chuyển hóa khoa học nhận thức, ranh giới Scope/Non-scope, tổng quan 4 Trụ Cột, lộ trình 4 giai đoạn, ma trận rủi ro và tiêu chí nghiệm thu định lượng.

16. **[14_PILLAR_1_ADAPTIVE_FSRS_AND_SEMANTIC_INTERFERENCE.md](file:///D:/project/japanese-srs-system/doc/14_PILLAR_1_ADAPTIVE_FSRS_AND_SEMANTIC_INTERFERENCE.md)**  
   *Trụ Cột 1 — Động cơ Lập lịch Thích ứng & Kiểm soát Can thiệp Ngữ nghĩa (Tầng 1 - L1)*: Chi tiết tối ưu 21 tham số FSRS bằng Rust/WASM, thuật toán xen kẽ LECTOR với khoảng cách Cosine $\ge 0.85$, và hiệu chỉnh sức mạnh lưu trữ qua độ trễ phản xạ não bộ Bjork.

17. **[15_PILLAR_2_KANJICOMPASS_ETYMOLOGICAL_KNOWLEDGE_GRAPH.md](file:///D:/project/japanese-srs-system/doc/15_PILLAR_2_KANJICOMPASS_ETYMOLOGICAL_KNOWLEDGE_GRAPH.md)**  
   *Trụ Cột 2 — Đồ thị Tri thức Chữ Hán theo Ngữ nguyên học (KanjiCompass Graph - Tầng 1 - L1)*: Cấu trúc Graph Database cho chữ Hình thanh (Keisei-moji); phân rã Node thành tố biểu âm, bộ thủ biểu ý và họ hàng chữ Hán đối chiếu 100% tài liệu thực tế; lộ trình học tự điều chỉnh (SRL).

18. **[16_PILLAR_3_COGNITIVE_INTERACTION_AND_SEMANTIC_EVALUATOR.md](file:///D:/project/japanese-srs-system/doc/16_PILLAR_3_COGNITIVE_INTERACTION_AND_SEMANTIC_EVALUATOR.md)**  
   *Trụ Cột 3 — Đa dạng hóa Tương tác Nhận thức & AI Semantic Evaluator (Tầng 1 - L1)*: Hệ thống 4 dạng tương tác khó khăn mong muốn (Generative Cloze, Elaborative Interrogation, Pitch Accent, Free Production) luân chuyển theo Stability $S$; AI Evaluator đàm thoại siêu ngắn $\le 2$ câu bảo toàn trạng thái Flow.

19. **[17_PILLAR_4_AUTOMATED_MINING_PIPELINE_AND_GAMIFICATION.md](file:///D:/project/japanese-srs-system/doc/17_PILLAR_4_AUTOMATED_MINING_PIPELINE_AND_GAMIFICATION.md)**  
   *Trụ Cột 4 — Pipeline Thu thập Dữ liệu Tự động & Động lực Học tập Bền vững (Tầng 1 - L1)*: Chrome Extension Manifest V3 bóc tách 1 thao tác trên NHK/YouTube; quy trình đồng sáng tạo bảo toàn Cognitive Ownership; cơ chế thưởng Liều lượng Nhận thức Tối thiểu (MED) và cấp phát Quota AI.

20. **[18_TECHNICAL_SPEC_AND_ATOMIC_IMPLEMENTATION_BLUEPRINT.md](file:///D:/project/japanese-srs-system/doc/18_TECHNICAL_SPEC_AND_ATOMIC_IMPLEMENTATION_BLUEPRINT.md)**  
   *Đặc tả Kỹ thuật Nguyên tử & Bản thiết kế Thi công Hệ thống (Tầng 2 - L2)*: Tầng sâu nhất không thể phân rã thêm: giải tích vi phân FSRS v5 & gradient Adam, toàn văn mã DDL SQL migration, mã giả TypeScript chi tiết, đặc tả hợp đồng API RESTful và cam kết SLA/Security.

---

### 🎴 HỆ THỐNG 8 SKILLS ANTHIGRAVITY TRONG DỰ ÁN (`.agents/skills/`)

| STT | Tên Kỹ năng (Skill Identifier) | Vai trò Phụ trách | Đường dẫn Trực tiếp |
| :---: | :--- | :--- | :--- |
| 1 | **`japanese-srs-business-analyst`** | Business Analyst (BA) | [`.agents/skills/japanese-srs-business-analyst/SKILL.md`](file:///D:/project/japanese-srs-system/.agents/skills/japanese-srs-business-analyst/SKILL.md) |
| 2 | **`japanese-srs-project-manager`** | Project Manager (PM) | [`.agents/skills/japanese-srs-project-manager/SKILL.md`](file:///D:/project/japanese-srs-system/.agents/skills/japanese-srs-project-manager/SKILL.md) |
| 3 | **`japanese-srs-uiux-designer`** | UI/UX Designer | [`.agents/skills/japanese-srs-uiux-designer/SKILL.md`](file:///D:/project/japanese-srs-system/.agents/skills/japanese-srs-uiux-designer/SKILL.md) |
| 4 | **`japanese-srs-fullstack-engineer`**| Fullstack Engineer (Dev) | [`.agents/skills/japanese-srs-fullstack-engineer/SKILL.md`](file:///D:/project/japanese-srs-system/.agents/skills/japanese-srs-fullstack-engineer/SKILL.md) |
| 5 | **`japanese-srs-qa-engineer`** | QA & Test Automation | [`.agents/skills/japanese-srs-qa-engineer/SKILL.md`](file:///D:/project/japanese-srs-system/.agents/skills/japanese-srs-qa-engineer/SKILL.md) |
| 6 | **`japanese-srs-devops-sre`** | DevOps & Cloud SRE | [`.agents/skills/japanese-srs-devops-sre/SKILL.md`](file:///D:/project/japanese-srs-system/.agents/skills/japanese-srs-devops-sre/SKILL.md) |
| 7 | **`japanese-srs-craftsman`** | Master Japanese Craftsman | [`.agents/skills/japanese-srs-craftsman/SKILL.md`](file:///D:/project/japanese-srs-system/.agents/skills/japanese-srs-craftsman/SKILL.md) |
| 8 | **`japanese-srs-deck-orchestrator`** | Deck & Session Orchestrator | [`.agents/skills/japanese-srs-deck-orchestrator/SKILL.md`](file:///D:/project/japanese-srs-system/.agents/skills/japanese-srs-deck-orchestrator/SKILL.md) |

---

### ⛩️ HƯỚNG DẪN DÀNH CHO AGENT THỰC THI (QUICK START)
- Đối với việc nâng cấp chuyên sâu Khoa học Nhận thức, FSRS 21 tham số, LECTOR Interleaving, KanjiCompass Graph, Tương tác 4 cấp độ và Chrome Extension: Mở bộ tài liệu phân tầng **[13_COGNITIVE_UPGRADE_MASTER_STRATIFIED_PLAN.md](file:///D:/project/japanese-srs-system/doc/13_COGNITIVE_UPGRADE_MASTER_STRATIFIED_PLAN.md)** (Chiến lược L0) $\rightarrow$ **[14_PILLAR_1_ADAPTIVE_FSRS_AND_SEMANTIC_INTERFERENCE.md](file:///D:/project/japanese-srs-system/doc/14_PILLAR_1_ADAPTIVE_FSRS_AND_SEMANTIC_INTERFERENCE.md)** đến **[17_PILLAR_4_AUTOMATED_MINING_PIPELINE_AND_GAMIFICATION.md](file:///D:/project/japanese-srs-system/doc/17_PILLAR_4_AUTOMATED_MINING_PIPELINE_AND_GAMIFICATION.md)** (Kiến trúc L1) $\rightarrow$ **[18_TECHNICAL_SPEC_AND_ATOMIC_IMPLEMENTATION_BLUEPRINT.md](file:///D:/project/japanese-srs-system/doc/18_TECHNICAL_SPEC_AND_ATOMIC_IMPLEMENTATION_BLUEPRINT.md)** (Thi công L2).
- Đối với việc phối hợp đa vai trò và quy chuẩn làm việc: Mở file **[10_MULTI_ROLE_AGENT_COLLABORATION_GUIDE.md](file:///D:/project/japanese-srs-system/doc/10_MULTI_ROLE_AGENT_COLLABORATION_GUIDE.md)** và **[SKILL_AGENT_PLAYBOOK.md](file:///D:/project/japanese-srs-system/doc/SKILL_AGENT_PLAYBOOK.md)**.
- Đối với việc tích hợp tranh nghệ thuật Ukiyo-e, Rinpa và tư liệu văn hóa: Mở file **[12_AUTHENTIC_WA_ART_REDESIGN_MASTER_PLAN.md](file:///D:/project/japanese-srs-system/doc/12_AUTHENTIC_WA_ART_REDESIGN_MASTER_PLAN.md)** và **[11_JAPANESE_GRAPHIC_DESIGN_DECONSTRUCTION.md](file:///D:/project/japanese-srs-system/doc/11_JAPANESE_GRAPHIC_DESIGN_DECONSTRUCTION.md)**.
- Đối với việc nâng cấp tính năng Ôn tập theo từng Bộ Thẻ: Mở file **[09_DECK_BASED_STUDY_HIERARCHICAL_PLAN.md](file:///D:/project/japanese-srs-system/doc/09_DECK_BASED_STUDY_HIERARCHICAL_PLAN.md)**.
- Đối với việc hoàn thiện giao diện ban đầu: Mở file **[08_STEP_BY_STEP_EXECUTION_CHECKLIST.md](file:///D:/project/japanese-srs-system/doc/08_STEP_BY_STEP_EXECUTION_CHECKLIST.md)**.


