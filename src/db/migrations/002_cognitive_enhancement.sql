-- ============================================================================
-- JAPANESE SRS SYSTEM - COGNITIVE SCIENCE DATABASE EXTENSION (MIGRATION 002)
-- ============================================================================
PRAGMA foreign_keys = ON;

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
    node_type TEXT NOT NULL CHECK(node_type IN ('target_kanji', 'phonetic_grapheme', 'semantic_radical', 'ideographic_compound')),
    character TEXT NOT NULL,
    stroke_count INTEGER NOT NULL,
    onyomi TEXT, -- Mảng JSON: '["sai"]'
    kunyomi TEXT, -- Mảng JSON: '["kiwa"]'
    primary_meaning TEXT NOT NULL,
    jlpt_level TEXT CHECK(jlpt_level IN ('N5', 'N4', 'N3', 'N2', 'N1', 'Non-JLPT')),
    newspaper_frequency_rank INTEGER,
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
        'COMPOSED_OF_SEMANTIC_PARTS'
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
