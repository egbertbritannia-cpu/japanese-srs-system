# ⚙️ TÀI LIỆU 18: ĐẶC TẢ KỸ THUẬT NGUYÊN TỬ & BẢN THIẾT KẾ THI CÔNG HỆ THỐNG
## Dự án: Japanese SRS System · 記憶道 (FSRS Cognitive Spaced Repetition Engine)
## Cấp độ: Atomic Technical Specification & Implementation Blueprint (Tầng 2 - L2)
## Trọng tâm: Công thức Giải tích, Lược đồ DDL SQL, Mã giả TypeScript & Hợp đồng API

---

> [!IMPORTANT]
> **TẦNG SÂU NHẤT (ATOMIC LEVEL - KHÔNG THỂ PHÂN RÃ THÊM)**:
> Tài liệu này chứa đựng toàn bộ các thông số kỹ thuật, công thức vi phân toán học, mã DDL tạo bảng, mã giả giải thuật chi tiết theo chuẩn TypeScript và tài liệu đặc tả API chuẩn RESTful. Bất kỳ lập trình viên hoặc AI Agent nào khi tiếp nhận tài liệu này đều có thể trực tiếp triển khai code mà không cần đặt thêm câu hỏi hay giả định logic.

---

## 1. GIẢI TÍCH TOÁN HỌC & CÔNG THỨC VI PHÂN CHI TIẾT

### 1.1. Hệ Phương Trình Trạng Thái FSRS v5 Đầy Đủ
Hệ thống FSRS v5 xác định ba biến liên tục theo thời gian:
1. **Retrievability (Khả năng truy xuất)**:
   $$R(t, S) = \left(1 + \frac{19}{81} \cdot \frac{t}{S}\right)^{-w_{20}}$$
   Trong đó $w_{20}$ là tham số suy thoái lũy thừa (thường $w_{20} \approx 0.5$).
2. **Difficulty (Độ khó $D \in [1, 10]$)**:
   Khởi tạo:
   $$D_0(G) = w_4 - e^{w_5 \cdot (G - 1)} + 1$$
   Cập nhật sau mỗi lần đánh giá $G \in \{1, 2, 3, 4\}$:
   $$\Delta D = -w_6 \cdot (G - 3)$$
   $$D' = w_7 \cdot D_0(3) + (1 - w_7) \cdot (D + \Delta D)$$
   $$D_{\text{clamped}} = \min(\max(D', 1), 10)$$
3. **Stability (Độ ổn định $S > 0$)**:
   - Khởi tạo lần đầu: $S_0(G) = w_{G-1}$ với $G \in \{1, 2, 3, 4\}$.
   - Khi Recall thành công ($G \ge 2$):
     $$S'_r = S \cdot \left(e^{w_8} \cdot (11 - D) \cdot S^{-w_9} \cdot (e^{w_{10} \cdot (1-R)} - 1) \cdot \text{Bonus}(G) + 1\right)$$
     Với $\text{Bonus}(G) = w_{15}$ (nếu $G = \text{Hard}$), $1.0$ (nếu $G = \text{Good}$), $w_{16}$ (nếu $G = \text{Easy}$).
   - Khi Quên / Thất bại ($G = 1$ - Again):
     $$S'_f = w_{11} \cdot D^{-w_{12}} \cdot \left((S + 1)^{w_{13}} - 1\right) \cdot e^{w_{14} \cdot (1-R)}$$

### 1.2. Đạo Hàm Gradient Của Hàm Mất Mát Log-Loss
Hàm mất mát trên tập $N$ bản ghi ôn tập:

$$\mathcal{L}(W) = -\frac{1}{N} \sum_{i=1}^N \left[ y_i \ln \hat{R}_i(W) + (1 - y_i) \ln (1 - \hat{R}_i(W)) \right] + \lambda \sum_{j=0}^{20} (w_j - w_{\text{default}, j})^2$$

Đạo hàm riêng theo từng trọng số $w_j$:

$$\frac{\partial \mathcal{L}}{\partial w_j} = -\frac{1}{N} \sum_{i=1}^N \left[ \frac{y_i - \hat{R}_i}{\hat{R}_i (1 - \hat{R}_i)} \cdot \frac{\partial \hat{R}_i}{\partial S_i} \cdot \frac{\partial S_i}{\partial w_j} \right] + 2\lambda (w_j - w_{\text{default}, j})$$

Trong đó:

$$\frac{\partial \hat{R}}{\partial S} = w_{20} \cdot \frac{19}{81} \cdot \frac{t}{S^2} \cdot \left(1 + \frac{19}{81} \cdot \frac{t}{S}\right)^{-w_{20} - 1}$$

Thuật toán tối ưu hóa Adam cập nhật bộ tham số:

$$m_t = \beta_1 m_{t-1} + (1 - \beta_1) g_t, \quad v_t = \beta_2 v_{t-1} + (1 - \beta_2) g_t^2$$
$$\hat{m}_t = \frac{m_t}{1 - \beta_1^t}, \quad \hat{v}_t = \frac{v_t}{1 - \beta_2^t}$$
$$w^{(t+1)} = w^{(t)} - \frac{\eta}{\sqrt{\hat{v}_t} + \epsilon} \hat{m}_t$$

---

## 2. TOÀN VĂN LƯỢC ĐỒ DATABASE DDL (SQL MIGRATION SCRIPT)

File migration `src/db/migrations/002_cognitive_enhancement.sql`:

```sql
-- ============================================================================
-- JAPANESE SRS SYSTEM - COGNITIVE SCIENCE DATABASE EXTENSION (MIGRATION 002)
-- ============================================================================

-- 1. Bảng lưu trữ 21 tham số cá nhân hóa FSRS
CREATE TABLE IF NOT EXISTS user_fsrs_parameters (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL DEFAULT 'default_user',
    w_parameters TEXT NOT NULL, -- JSON String: "[0.4, 0.9, 2.3, 10.9, ...]"
    sample_size INTEGER NOT NULL,
    rmse REAL NOT NULL,
    log_loss REAL NOT NULL,
    optimized_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_user_fsrs_active ON user_fsrs_parameters(user_id, is_active);

-- 2. Bảng nhúng vector ngữ nghĩa (Semantic Embeddings) cho thuật toán LECTOR
CREATE TABLE IF NOT EXISTS card_embeddings (
    card_id TEXT PRIMARY KEY,
    embedding_vector BLOB NOT NULL, -- Float32Array lưu dưới dạng nhị phân 384/1536 chiều
    vector_dimension INTEGER NOT NULL DEFAULT 384,
    model_version TEXT NOT NULL DEFAULT 'text-embedding-3-small',
    generated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
);

-- 3. Bảng ghi nhận độ trễ truy xuất (Bjork Latency Dynamics)
CREATE TABLE IF NOT EXISTS retrieval_latency_logs (
    id TEXT PRIMARY KEY,
    card_id TEXT NOT NULL,
    review_log_id TEXT NOT NULL,
    duration_ms INTEGER NOT NULL,
    user_grade TEXT NOT NULL CHECK(user_grade IN ('Again', 'Hard', 'Good', 'Easy')),
    adjusted_grade TEXT NOT NULL CHECK(adjusted_grade IN ('Again', 'Hard', 'Good', 'Easy')),
    penalty_applied INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_latency_card ON retrieval_latency_logs(card_id);

-- 4. Bảng đỉnh đồ thị chữ Hán ngữ nguyên học (KanjiCompass Graph Nodes)
CREATE TABLE IF NOT EXISTS kanji_graph_nodes (
    id TEXT PRIMARY KEY,
    node_type TEXT NOT NULL CHECK(node_type IN ('target_kanji', 'phonetic_grapheme', 'semantic_radical')),
    character TEXT NOT NULL,
    stroke_count INTEGER NOT NULL,
    onyomi TEXT, -- Mảng JSON
    kunyomi TEXT, -- Mảng JSON
    primary_meaning TEXT NOT NULL,
    jlpt_level TEXT CHECK(jlpt_level IN ('N5', 'N4', 'N3', 'N2', 'N1', 'Non-JLPT')),
    etymology_explanation TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_kanji_char ON kanji_graph_nodes(character, node_type);

-- 5. Bảng cạnh đồ thị liên kết chữ Hán (KanjiCompass Graph Edges)
CREATE TABLE IF NOT EXISTS kanji_graph_edges (
    id TEXT PRIMARY KEY,
    source_node_id TEXT NOT NULL,
    target_node_id TEXT NOT NULL,
    relationship_type TEXT NOT NULL CHECK(relationship_type IN (
        'HAS_PHONETIC',
        'HAS_RADICAL',
        'SAME_PHONETIC_FAMILY',
        'DERIVED_COGNATE'
    )),
    weight REAL NOT NULL DEFAULT 1.0,
    FOREIGN KEY (source_node_id) REFERENCES kanji_graph_nodes(id) ON DELETE CASCADE,
    FOREIGN KEY (target_node_id) REFERENCES kanji_graph_nodes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_edge_source ON kanji_graph_edges(source_node_id, relationship_type);
CREATE INDEX IF NOT EXISTS idx_edge_target ON kanji_graph_edges(target_node_id, relationship_type);

-- 6. Bảng lịch sử tương tác nhận thức bậc cao (Desirable Difficulty Logs)
CREATE TABLE IF NOT EXISTS cognitive_interaction_logs (
    id TEXT PRIMARY KEY,
    card_id TEXT NOT NULL,
    interaction_type TEXT NOT NULL CHECK(interaction_type IN (
        'generative_cloze',
        'elaborative_interrogation',
        'pitch_discrimination',
        'free_production'
    )),
    prompt_presented TEXT NOT NULL,
    learner_response TEXT NOT NULL,
    is_correct INTEGER NOT NULL,
    evaluator_feedback TEXT,
    latency_ms INTEGER NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
);

-- 7. Bảng cơ chế thưởng nỗ lực nhận thức (Effort-Based Gamification Ledger)
CREATE TABLE IF NOT EXISTS gamification_effort_ledger (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL DEFAULT 'default_user',
    session_id TEXT NOT NULL,
    focus_duration_seconds INTEGER NOT NULL,
    is_med_achieved INTEGER NOT NULL DEFAULT 0,
    high_order_tasks_count INTEGER NOT NULL DEFAULT 0,
    credits_earned INTEGER NOT NULL DEFAULT 0,
    session_timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_effort_user ON gamification_effort_ledger(user_id, is_med_achieved);
```

---

## 3. MÃ GIẢ GIẢI THUẬT CỐT LÕI (TYPESCRIPT PSEUDOCODE)

### 3.1. Thuật toán LECTOR Interleaving Queue

```typescript
export interface ReviewCardItem {
  id: string;
  kanji: string;
  meaning: string;
  due: Date;
  stability: number;
}

/**
 * interleaveQueueBySemantics
 * Sắp xếp lại hàng đợi ôn tập để loại bỏ can thiệp ngữ nghĩa (Proactive/Retroactive Interference)
 */
export function interleaveQueueBySemantics(
  rawQueue: ReviewCardItem[],
  embeddingsMap: Map<string, Float32Array>,
  threshold = 0.85
): ReviewCardItem[] {
  if (rawQueue.length <= 2) return rawQueue;

  const result: ReviewCardItem[] = [];
  const remaining = [...rawQueue];

  // 1. Đưa phần tử đầu tiên vào danh sách
  result.push(remaining.shift()!);

  // 2. Lặp qua các phần tử còn lại và chọn thẻ tiếp theo an toàn
  while (remaining.length > 0) {
    const lastCard = result[result.length - 1];
    const lastVec = embeddingsMap.get(lastCard.id);

    let bestIdx = -1;
    let minSim = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const candidate = remaining[i];
      const candidateVec = embeddingsMap.get(candidate.id);

      if (!lastVec || !candidateVec) {
        bestIdx = i;
        break;
      }

      const sim = calculateCosineSimilarity(lastVec, candidateVec);

      // Nếu tìm thấy thẻ hoàn toàn an toàn (< threshold)
      if (sim < threshold) {
        bestIdx = i;
        break;
      }

      // Lưu lại thẻ có độ tương đồng thấp nhất phòng trường hợp bắt buộc
      if (sim < minSim) {
        minSim = sim;
        bestIdx = i;
      }
    }

    result.push(remaining.splice(bestIdx, 1)[0]);
  }

  return result;
}

function calculateCosineSimilarity(vecA: Float32Array, vecB: Float32Array): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB) || 1e-9);
}
```

---

### 3.2. Thuật toán Hiệu chỉnh Độ trễ Phản xạ (Bjork Latency Dynamics)

```typescript
export interface LatencyAdjustmentResult {
  effectiveGrade: 'Again' | 'Hard' | 'Good' | 'Easy';
  penaltyApplied: boolean;
  stabilityMultiplier: number;
}

export function evaluateRetrievalLatency(
  userGrade: 'Again' | 'Hard' | 'Good' | 'Easy',
  durationMs: number
): LatencyAdjustmentResult {
  // 1. Again hoặc Hard giữ nguyên
  if (userGrade === 'Again' || userGrade === 'Hard') {
    return { effectiveGrade: userGrade, penaltyApplied: false, stabilityMultiplier: 1.0 };
  }

  // 2. Người học chọn Good hoặc Easy nhưng mất > 5 giây
  if (durationMs > 5000) {
    return {
      effectiveGrade: 'Hard',
      penaltyApplied: true,
      stabilityMultiplier: 0.5, // Giảm 50% hệ số tăng trưởng độ ổn định
    };
  }

  // 3. Người học chọn Easy nhưng mất > 1.5 giây -> Hạ cấp thành Good
  if (userGrade === 'Easy' && durationMs > 1500) {
    return {
      effectiveGrade: 'Good',
      penaltyApplied: true,
      stabilityMultiplier: 0.85,
    };
  }

  // 4. Phản xạ nhanh chuẩn (< 3 giây đối với Good, < 1.5 giây đối với Easy)
  return {
    effectiveGrade: userGrade,
    penaltyApplied: false,
    stabilityMultiplier: 1.0,
  };
}
```

---

### 3.3. Thuật toán Lộ trình Học Chữ Hán KanjiCompass Tự Điều Chỉnh (SRL)

```typescript
export interface PhoneticMasteryReport {
  phoneticGrapheme: string;
  originalReading: string;
  learnedCount: number;
  totalFamilyCount: number;
  masteryPercentage: number;
  recommendedNextKanji?: {
    character: string;
    onyomi: string;
    meaning: string;
    jlptLevel: string;
  };
}

export async function evaluatePhoneticFamilySRL(
  phoneticGrapheme: string,
  userLearnedKanji: string[],
  userLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
): Promise<PhoneticMasteryReport> {
  // 1. Lấy toàn bộ chữ Hán thuộc cùng thành tố biểu âm từ Đồ thị
  const familyMembers = await db.query(
    `SELECT n.* FROM kanji_graph_nodes n
     JOIN kanji_graph_edges e ON n.id = e.target_node_id
     WHERE e.source_node_id = ? AND e.relationship_type = 'HAS_PHONETIC'`,
    [`phonetic_${phoneticGrapheme}`]
  );

  const totalFamilyCount = familyMembers.length;
  const learnedInFamily = familyMembers.filter((k: any) => userLearnedKanji.includes(k.character));
  const masteryPercentage = totalFamilyCount > 0 ? (learnedInFamily.length / totalFamilyCount) * 100 : 0;

  // 2. Tìm ứng viên tiếp theo phù hợp trình độ i+1
  let recommendedNextKanji;
  if (masteryPercentage >= 50) {
    const unlearned = familyMembers.filter((k: any) => !userLearnedKanji.includes(k.character));
    // Ưu tiên chữ có cấp độ JLPT phù hợp
    recommendedNextKanji = unlearned.find((k: any) => k.jlpt_level === userLevel) || unlearned[0];
  }

  return {
    phoneticGrapheme,
    originalReading: familyMembers[0]?.onyomi || '',
    learnedCount: learnedInFamily.length,
    totalFamilyCount,
    masteryPercentage,
    recommendedNextKanji,
  };
}
```

---

## 4. ĐẶC TẢ HỢP ĐỒNG API RESTFUL (API SPECIFICATIONS)

### 4.1. Endpoint: `POST /api/scheduler/optimize`
Kích hoạt tiến trình tối ưu hóa 21 tham số FSRS cá nhân hóa qua WASM.

- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "force_recompute": false,
  "min_sample_size": 1000
}
```
- **Response Success (200 OK)**:
```json
{
  "success": true,
  "optimized": true,
  "sample_size": 1342,
  "previous_rmse": 0.384,
  "new_rmse": 0.312,
  "improvement_percentage": 18.75,
  "parameters": [0.412, 0.985, 2.451, 11.23, "... 21 values ..."],
  "applied_at": "2026-10-02T22:00:00Z"
}
```
- **Response Skipped (200 OK)**:
```json
{
  "success": true,
  "optimized": false,
  "reason": "INSUFFICIENT_LOGS",
  "current_logs": 420,
  "required_logs": 1000
}
```

---

### 4.2. Endpoint: `POST /api/review/evaluate`
Gửi câu trả lời của người học đến AI Semantic Evaluator đàm thoại ngắn gọn.

- **Request Body**:
```json
{
  "card_id": "card_789",
  "interaction_mode": "free_production",
  "target_word": "妥協",
  "learner_response": "会社と妥協して、給料を上げてもらった。"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "is_correct": true,
  "concept_understood": true,
  "short_feedback": "Tuyệt vời! Bạn đã vận dụng cấu trúc '会社と妥協する' rất tự nhiên và chính xác.",
  "suggested_fix": null,
  "credits_awarded": 10,
  "latency_ms": 340
}
```

---

### 4.3. Endpoint: `POST /api/capture/process`
Tiếp nhận chuỗi câu bôi đen từ Chrome Extension, phân tích hình thái học và kiểm định $i+1$.

- **Request Body**:
```json
{
  "raw_text": "新幹線が台風の影響で運休になりました。",
  "source_url": "https://www3.nhk.or.jp/news/easy/...",
  "page_title": "NHK News Web Easy"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "i_plus_one_verified": true,
  "target_word": "運休",
  "reading": "うんきゅう",
  "pitch_accent": 0,
  "meaning": "sự tạm ngừng chạy tàu/xe",
  "cloze_sentence": "新幹線が台風の影響で{{c1::運休}}になりました。",
  "kanji_decomposition": [
    { "kanji": "運", "phonetic": "軍", "radical": "辶", "onyomi": "un" },
    { "kanji": "休", "phonetic": null, "radical": "亻", "onyomi": "kyuu" }
  ],
  "is_draft": true,
  "draft_id": "draft_capture_1024"
}
```

---

## 5. CHỈ SỐ CAM KẾT HIỆU NĂNG & AN TOÀN (SLAS & SECURITY)

1. **Bộ nhớ WASM Runtime**:
   - Quá trình tối ưu FSRS Rust binding được gán trần bộ nhớ tối đa **64MB heap**. Nếu vượt quá sẽ tự động ngắt và trả về cảnh báo an toàn.
2. **Thời gian phản hồi P95 API**:
   - Endpoint sắp xếp xen kẽ LECTOR `/api/scheduler/interleave`: $< 85$ ms cho danh sách 100 thẻ.
   - Endpoint Semantic Evaluator `/api/review/evaluate`: $< 850$ ms.
3. **Bảo mật & Quyền riêng tư Extension**:
   - Chỉ truyền tải đoạn trích bôi đen khi có hành động tường minh của người dùng (`Alt+S`).
   - Không lưu Cookie, Session, hoặc thông tin định danh cá nhân trên trình duyệt.

---

> [!NOTE]
> Mời xem bảng tổng hợp mục lục tài liệu toàn dự án tại:
> [`doc/README.md`](file:///D:/project/japanese-srs-system/doc/README.md)
