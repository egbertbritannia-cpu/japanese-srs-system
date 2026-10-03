#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script gộp toàn bộ tài liệu quy hoạch (Planning) của dự án Japanese SRS System vào một thư mục duy nhất: /planning
Tất cả các tài liệu thuộc cùng một giai đoạn được hợp nhất thành 1 tệp duy nhất với mục lục và cấu trúc phân tầng rõ ràng.
"""

import os
import re

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PLANNING_DIR = os.path.join(ROOT_DIR, "planning")
DOC_DIR = os.path.join(ROOT_DIR, "doc")
PERF_DIR = os.path.join(DOC_DIR, "performance")
ARTIFACT_DIR = r"C:\Users\ThinkPad X1\.gemini\antigravity-ide\brain\b35e92a7-82d5-4c33-a044-983adae6576f"

os.makedirs(PLANNING_DIR, exist_ok=True)

def read_file(filepath):
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"File not found: {filepath}")
    with open(filepath, "r", encoding="utf-8") as f:
        return f.read()

def clean_sub_headings(content, level_offset=1):
    """Tăng cấp độ heading (# -> ##, ## -> ###) để phù hợp khi lồng vào một Phần (Part) lớn"""
    lines = content.splitlines()
    new_lines = []
    in_code_block = False
    
    for line in lines:
        if line.strip().startswith("```"):
            in_code_block = not in_code_block
            new_lines.append(line)
            continue
        
        if not in_code_block and line.startswith("#"):
            match = re.match(r"^(#+)\s*(.*)$", line)
            if match:
                hashes, rest = match.groups()
                # Tăng số lượng hash theo level_offset
                new_hashes = "#" * (len(hashes) + level_offset)
                new_lines.append(f"{new_hashes} {rest}")
                continue
        
        new_lines.append(line)
    return "\n".join(new_lines)

# ==============================================================================
# PHASE 1: Giai đoạn 1 - Tái thiết kế Giao diện Mỹ học Wa-Style
# ==============================================================================
def build_phase_1():
    print("Building Phase 1...")
    parts = [
        ("Phần 1: Tổng quan Chiến lược & Bản Tuyên ngôn Tái thiết kế Giao diện", os.path.join(DOC_DIR, "00_OVERVIEW_AND_MANIFESTO.md")),
        ("Phần 2: Hệ thống Thiết kế & Biến CSS Nippon Colors (Design System & Tokens)", os.path.join(DOC_DIR, "01_DESIGN_SYSTEM_AND_TOKENS.md")),
        ("Phần 3: Thư viện Hoạt họa Văn hóa & Kho Biểu tượng SVG Thuần túy", os.path.join(DOC_DIR, "02_CULTURAL_ANIMATIONS_AND_ASSETS.md")),
        ("Phần 4: Mã nguồn Toàn cục & Layout Thanh Điều hướng Torii", os.path.join(DOC_DIR, "03_GLOBAL_STYLES_AND_LAYOUT.md")),
        ("Phần 5: Thiết kế & Thi công Trang Tổng quan Honmaru (Dashboard)", os.path.join(DOC_DIR, "04_PAGE_DASHBOARD_IMPLEMENTATION.md")),
        ("Phần 6: Thiết kế & Thi công Trang Quản lý Thẻ Tanzakucho (Cards Management)", os.path.join(DOC_DIR, "05_PAGE_CARDS_MANAGEMENT_IMPLEMENTATION.md")),
        ("Phần 7: Thiết kế & Thi công Trang Soạn Thẻ AI Copilot Shodo Desk", os.path.join(DOC_DIR, "06_PAGE_AI_COPILOT_AND_NEW_CARD_IMPLEMENTATION.md")),
        ("Phần 8: Thiết kế & Thi công Trang Ôn tập Karuta Active Recall (Review Session)", os.path.join(DOC_DIR, "07_PAGE_REVIEW_ACTIVE_RECALL_IMPLEMENTATION.md")),
        ("Phần 9: Quy trình Thực thi & Checklist Kiểm định 10 Bước Dành cho Agent", os.path.join(DOC_DIR, "08_STEP_BY_STEP_EXECUTION_CHECKLIST.md")),
    ]

    toc = "\n".join([f"{i+1}. [{title}](#phan-{i+1})".lower() for i, (title, _) in enumerate(parts)])
    
    header = f"""# 🌸 GIAI ĐOẠN 1: TÁI THIẾT KẾ TOÀN DIỆN GIAO DIỆN PHONG CÁCH NHẬT BẢN TRUYỀN THỐNG (AUTHENTIC WA-STYLE UI)
## Hệ Thống: Japanese SRS System (記憶道 FSRS) · Bản Quy Hoạch Hợp Nhất (Consolidated Specification)

> **Thông tin tổng hợp:**
> * **Giai đoạn:** Phase 1 (Sprints 1-3)
> * **Tệp nguồn hợp nhất:** `00_OVERVIEW_AND_MANIFESTO.md` đến `08_STEP_BY_STEP_EXECUTION_CHECKLIST.md` (9 tệp)
> * **Trọng tâm kỹ thuật:** Gam màu Washi `#FAF8F5`, Xanh Matcha `#88A752`, Đỏ son Torii `#D9381E`, Họa tiết Seigaiha/Asanoha, Font chữ `Shippori Mincho` & `Zen Maru Gothic`.
> * **Cam kết cốt lõi:** Zero Backend Regression (Bảo toàn 100% logic FSRS, Drizzle ORM và các API Route).

---

### 📑 MỤC LỤC TỔNG QUAN GIAI ĐOẠN 1
{toc}

---
"""
    body_parts = []
    for i, (title, path) in enumerate(parts):
        content = read_file(path)
        adapted = clean_sub_headings(content, level_offset=1)
        part_block = f"""
<a id="phan-{i+1}"></a>
# PHẦN {i+1}: {title.upper()}
*Tệp gốc: `{os.path.relpath(path, ROOT_DIR)}`*

---

{adapted}

---
"""
        body_parts.append(part_block)

    full_doc = header + "\n".join(body_parts)
    out_path = os.path.join(PLANNING_DIR, "01_PHASE_1_WA_STYLE_UI_REDESIGN.md")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(full_doc)
    print(f"-> Created {out_path} ({len(full_doc)} bytes)")

# ==============================================================================
# PHASE 2: Giai đoạn 2 - Kiến trúc Ôn tập theo Bộ thẻ & Phối hợp Đa Agent
# ==============================================================================
def build_phase_2():
    print("Building Phase 2...")
    parts = [
        ("Phần 1: Kế hoạch Phân tầng Cải tiến Hệ thống — Ôn tập theo Từng Bộ Thẻ (Deck-Based Architecture)", os.path.join(DOC_DIR, "09_DECK_BASED_STUDY_HIERARCHICAL_PLAN.md")),
        ("Phần 2: Cẩm nang Phối hợp Đa Vai trò (Multi-Role Agent Collaboration Guide)", os.path.join(DOC_DIR, "10_MULTI_ROLE_AGENT_COLLABORATION_GUIDE.md")),
        ("Phần 3: Cẩm nang Kỹ năng Đa Vai trò Playbook (Master Multi-Role Engineering Playbook)", os.path.join(DOC_DIR, "SKILL_AGENT_PLAYBOOK.md")),
    ]

    toc = "\n".join([f"{i+1}. [{title}](#phan-{i+1})".lower() for i, (title, _) in enumerate(parts)])
    
    header = f"""# ⛩️ GIAI ĐOẠN 2: KIẾN TRÚC ÔN TẬP PHÂN TÁCH THEO BỘ THẺ & QUY TRÌNH CỘNG TÁC ĐA AGENT
## Hệ Thống: Japanese SRS System (記憶道 FSRS) · Bản Quy Hoạch Hợp Nhất (Consolidated Specification)

> **Thông tin tổng hợp:**
> * **Giai đoạn:** Phase 2 (Sprints 4-5)
> * **Tệp nguồn hợp nhất:** `09_DECK_BASED_STUDY_HIERARCHICAL_PLAN.md`, `10_MULTI_ROLE_AGENT_COLLABORATION_GUIDE.md`, `SKILL_AGENT_PLAYBOOK.md` (3 tệp)
> * **Trọng tâm kỹ thuật:** Kiến trúc phân tách bộ thẻ (Deck Segregation), URL-First Session State, Cơ chế lọc FSRS Queue, Ma trận phân định trách nhiệm 6 vai trò (BA, PM, Designer, Dev, QA, DevOps) và 8 Antigravity Skills.
> * **Cam kết cốt lõi:** Bảo toàn tính độc lập hàng đợi ôn tập giữa Kanji, Từ vựng Kotoba, Ngữ pháp Bunbou và JLPT N5.

---

### 📑 MỤC LỤC TỔNG QUAN GIAI ĐOẠN 2
{toc}

---
"""
    body_parts = []
    for i, (title, path) in enumerate(parts):
        content = read_file(path)
        adapted = clean_sub_headings(content, level_offset=1)
        part_block = f"""
<a id="phan-{i+1}"></a>
# PHẦN {i+1}: {title.upper()}
*Tệp gốc: `{os.path.relpath(path, ROOT_DIR)}`*

---

{adapted}

---
"""
        body_parts.append(part_block)

    full_doc = header + "\n".join(body_parts)
    out_path = os.path.join(PLANNING_DIR, "02_PHASE_2_DECK_BASED_SRS_AND_AGENT_WORKFLOW.md")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(full_doc)
    print(f"-> Created {out_path} ({len(full_doc)} bytes)")

# ==============================================================================
# PHASE 3: Giai đoạn 3 - Giải mã Đồ họa Nhật Bản & Tái thiết kế Tích hợp Tranh Mỹ thuật Wa-Art
# ==============================================================================
def build_phase_3():
    print("Building Phase 3...")
    parts = [
        ("Phần 1: Giải mã Chuyên sâu Phong cách Thiết kế Đồ họa Nhật Bản Hiện đại (Graphic Design Deconstruction)", os.path.join(DOC_DIR, "11_JAPANESE_GRAPHIC_DESIGN_DECONSTRUCTION.md")),
        ("Phần 2: Kế hoạch Tái thiết kế Tích hợp Tranh Nghệ thuật & Văn hóa Nhật Bản (Authentic Wa-Art Master Plan)", os.path.join(DOC_DIR, "12_AUTHENTIC_WA_ART_REDESIGN_MASTER_PLAN.md")),
    ]

    toc = "\n".join([f"{i+1}. [{title}](#phan-{i+1})".lower() for i, (title, _) in enumerate(parts)])
    
    header = f"""# 🌊 GIAI ĐOẠN 3: GIẢI MÃ ĐỒ HỌA NHẬT BẢN HIỆN ĐẠI & TÍCH HỢP HỘI HỌA TRUYỀN THỐNG (AUTHENTIC WA-ART)
## Hệ Thống: Japanese SRS System (記憶道 FSRS) · Bản Quy Hoạch Hợp Nhất (Consolidated Specification)

> **Thông tin tổng hợp:**
> * **Giai đoạn:** Phase 3 (Sprints 6-7)
> * **Tệp nguồn hợp nhất:** `11_JAPANESE_GRAPHIC_DESIGN_DECONSTRUCTION.md`, `12_AUTHENTIC_WA_ART_REDESIGN_MASTER_PLAN.md` (2 tệp)
> * **Trọng tâm kỹ thuật:** Phong cách Wa-Modern Bento Grid, Bảng màu Đỏ son - Chàm Aizome - Giấy Washi, Cấu trúc lưới tranh khắc gỗ mộc bản, Bố cục Typography trục kép (Tate/Yoko-gaki), Phân bổ 13 tác phẩm Ukiyo-e, Rinpa và Yuzen vào 5 màn hình hệ thống.
> * **Cam kết cốt lõi:** Lớp hình nền tối ưu hiệu năng (opacity 0.08 - 0.15, mix-blend-mode multiply), hoàn toàn không cản trở khả năng đọc (Legibility).

---

### 📑 MỤC LỤC TỔNG QUAN GIAI ĐOẠN 3
{toc}

---
"""
    body_parts = []
    for i, (title, path) in enumerate(parts):
        content = read_file(path)
        adapted = clean_sub_headings(content, level_offset=1)
        part_block = f"""
<a id="phan-{i+1}"></a>
# PHẦN {i+1}: {title.upper()}
*Tệp gốc: `{os.path.relpath(path, ROOT_DIR)}`*

---

{adapted}

---
"""
        body_parts.append(part_block)

    full_doc = header + "\n".join(body_parts)
    out_path = os.path.join(PLANNING_DIR, "03_PHASE_3_JAPANESE_GRAPHIC_DESIGN_AND_WA_ART.md")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(full_doc)
    print(f"-> Created {out_path} ({len(full_doc)} bytes)")

# ==============================================================================
# PHASE 4: Giai đoạn 4 - Nâng cấp Động cơ Khoa học Nhận thức & 4 Trụ Cột FSRS
# ==============================================================================
def build_phase_4():
    print("Building Phase 4...")
    parts = [
        ("Phần 1: Kế hoạch Phân tầng Tổng quan Nâng cấp Hệ thống Chuyên sâu (Tầng 0 - L0 Strategy)", os.path.join(DOC_DIR, "13_COGNITIVE_UPGRADE_MASTER_STRATIFIED_PLAN.md")),
        ("Phần 2: Trụ Cột 1 — Động cơ Lập lịch Thích ứng & Kiểm soát Can thiệp Ngữ nghĩa LECTOR", os.path.join(DOC_DIR, "14_PILLAR_1_ADAPTIVE_FSRS_AND_SEMANTIC_INTERFERENCE.md")),
        ("Phần 3: Trụ Cột 2 — Đồ thị Tri thức Chữ Hán theo Ngữ nguyên học (KanjiCompass Graph)", os.path.join(DOC_DIR, "15_PILLAR_2_KANJICOMPASS_ETYMOLOGICAL_KNOWLEDGE_GRAPH.md")),
        ("Phần 4: Trụ Cột 3 — Đa dạng hóa Tương tác Nhận thức & AI Semantic Evaluator", os.path.join(DOC_DIR, "16_PILLAR_3_COGNITIVE_INTERACTION_AND_SEMANTIC_EVALUATOR.md")),
        ("Phần 5: Trụ Cột 4 — Pipeline Thu thập Dữ liệu Tự động & Động lực Học tập Bền vững (Mining & Gamification)", os.path.join(DOC_DIR, "17_PILLAR_4_AUTOMATED_MINING_PIPELINE_AND_GAMIFICATION.md")),
        ("Phần 6: Đặc tả Kỹ thuật Nguyên tử & Bản Thiết kế Thi công Hệ thống (Tầng 2 - L2 Atomic Tech Spec)", os.path.join(DOC_DIR, "18_TECHNICAL_SPEC_AND_ATOMIC_IMPLEMENTATION_BLUEPRINT.md")),
    ]

    toc = "\n".join([f"{i+1}. [{title}](#phan-{i+1})".lower() for i, (title, _) in enumerate(parts)])
    
    header = f"""# 🧠 GIAI ĐOẠN 4: ĐỘNG CƠ KHOA HỌC NHẬN THỨC CHUYÊN SÂU & 4 TRỤ CỘT KIẾN TRÚC FSRS V5
## Hệ Thống: Japanese SRS System (記憶道 FSRS) · Bản Quy Hoạch Hợp Nhất (Consolidated Specification)

> **Thông tin tổng hợp:**
> * **Giai đoạn:** Phase 4 (Sprints 8-11)
> * **Tệp nguồn hợp nhất:** `13_COGNITIVE_UPGRADE_MASTER_STRATIFIED_PLAN.md` đến `18_TECHNICAL_SPEC_AND_ATOMIC_IMPLEMENTATION_BLUEPRINT.md` (6 tệp)
> * **Trọng tâm kỹ thuật:** Tối ưu hóa FSRS 21 tham số bằng Adam gradient descent, Thuật toán xen kẽ LECTOR (Cosine distance $\ge 0.85$), Đồ thị tri thức chữ Hán KanjiCompass phân rã hình thanh (Keisei-moji), Hệ tương tác 4 cấp độ (Cloze, Interrogation, Pitch Accent, Production), Chrome Extension Manifest V3 và Gamification theo liều lượng nhận thức tối thiểu (MED).
> * **Cam kết cốt lõi:** Duy trì tỷ lệ gợi nhớ $R \ge 90\%$ với chi phí thời gian ôn tập thấp nhất.

---

### 📑 MỤC LỤC TỔNG QUAN GIAI ĐOẠN 4
{toc}

---
"""
    body_parts = []
    for i, (title, path) in enumerate(parts):
        content = read_file(path)
        adapted = clean_sub_headings(content, level_offset=1)
        part_block = f"""
<a id="phan-{i+1}"></a>
# PHẦN {i+1}: {title.upper()}
*Tệp gốc: `{os.path.relpath(path, ROOT_DIR)}`*

---

{adapted}

---
"""
        body_parts.append(part_block)

    full_doc = header + "\n".join(body_parts)
    out_path = os.path.join(PLANNING_DIR, "04_PHASE_4_COGNITIVE_SCIENCE_AND_FOUR_PILLARS.md")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(full_doc)
    print(f"-> Created {out_path} ({len(full_doc)} bytes)")

# ==============================================================================
# PHASE 5: Giai đoạn 5 - Mỹ học Cắt giấy Kirie & Sóng Biển Lớp
# ==============================================================================
def build_phase_5():
    print("Building Phase 5...")
    parts = [
        ("Phần 1: Kế hoạch Tái thiết kế Giao diện Nghệ thuật Cắt giấy Washi Kirie & Sóng Biển Lớp (Master Plan)", os.path.join(DOC_DIR, "19_KIRIE_PAPER_CUTOUT_WAVE_REDESIGN_MASTER_PLAN.md")),
        ("Phần 2: Hệ thống Tokens & Mã nguồn Linh kiện Giao diện Kirie Nguyên tử (Component Implementation)", os.path.join(DOC_DIR, "20_KIRIE_UI_COMPONENTS_AND_DESIGN_TOKENS.md")),
    ]

    toc = "\n".join([f"{i+1}. [{title}](#phan-{i+1})".lower() for i, (title, _) in enumerate(parts)])
    
    header = f"""# ✂️ GIAI ĐOẠN 5: NGHỆ THUẬT CẮT GIẤY WASHI KIRIE & THIẾT KẾ DI ĐỘNG NỔI KHỐI SÓNG BIỂN
## Hệ Thống: Japanese SRS System (記憶道 FSRS) · Bản Quy Hoạch Hợp Nhất (Consolidated Specification)

> **Thông tin tổng hợp:**
> * **Giai đoạn:** Phase 5 (Sprint 12)
> * **Tệp nguồn hợp nhất:** `19_KIRIE_PAPER_CUTOUT_WAVE_REDESIGN_MASTER_PLAN.md`, `20_KIRIE_UI_COMPONENTS_AND_DESIGN_TOKENS.md` (2 tệp)
> * **Trọng tâm kỹ thuật:** Nghệ thuật cắt giấy Washi Kirie nhiều lớp, Bảng màu chàm sâu Aizome Indigo (`#20507B`), Đỏ son sơn mài Urushi (`#D9381E`), Hiệu ứng bóng đổ đa tầng `kirie-shadow-deep`, 5 linh kiện React nguyên tử (`KirieWaveIllustration`, `KirieHeroBanner`, `KirieKpiCard`, `KirieFocusListItem`, `KirieBottomNav`).
> * **Cam kết cốt lõi:** Trải nghiệm di động đạt chuẩn 60fps mượt mà, hỗ trợ PWA offline và Responsive toàn diện.

---

### 📑 MỤC LỤC TỔNG QUAN GIAI ĐOẠN 5
{toc}

---
"""
    body_parts = []
    for i, (title, path) in enumerate(parts):
        content = read_file(path)
        adapted = clean_sub_headings(content, level_offset=1)
        part_block = f"""
<a id="phan-{i+1}"></a>
# PHẦN {i+1}: {title.upper()}
*Tệp gốc: `{os.path.relpath(path, ROOT_DIR)}`*

---

{adapted}

---
"""
        body_parts.append(part_block)

    full_doc = header + "\n".join(body_parts)
    out_path = os.path.join(PLANNING_DIR, "05_PHASE_5_KIRIE_PAPER_CUTOUT_AND_WAVE_REDESIGN.md")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(full_doc)
    print(f"-> Created {out_path} ({len(full_doc)} bytes)")

# ==============================================================================
# PHASE 6: Giai đoạn 6 - Kỹ thuật Tối ưu Hiệu năng, SRE & Giám sát Telemetry
# ==============================================================================
def build_phase_6():
    print("Building Phase 6...")
    parts = [
        ("Phần 1: Nền tảng Kỹ thuật Hiệu năng & Tiêu chuẩn Core Web Vitals (Performance Foundation)", os.path.join(PERF_DIR, "00-performance-foundation.md")),
        ("Phần 2: Kiểm toán Kiến trúc Toàn diện & Nhận diện Điểm nghẽn (Architecture Audit)", os.path.join(PERF_DIR, "01-architecture-audit.md")),
        ("Phần 3: Tối ưu hóa Next.js 15 App Router, React Server Components & Streaming", os.path.join(PERF_DIR, "02-nextjs-optimization.md")),
        ("Phần 4: Tối ưu hóa Tài nguyên Đồ họa, Hình ảnh & Font chữ Nhật Bản (Asset Optimization)", os.path.join(PERF_DIR, "03-asset-optimization.md")),
        ("Phần 5: Tối ưu hóa Cơ sở Dữ liệu Turso Cloud LibSQL & REST API (Database Latency)", os.path.join(PERF_DIR, "04-database-api.md")),
        ("Phần 6: Tối ưu hóa Mạng, Edge CDN & Cơ chế Lưu đệm HTTP Caching", os.path.join(PERF_DIR, "05-network-cdn.md")),
        ("Phần 7: Hiệu năng Thực thi Thời gian thực, Ngoại tuyến IndexedDB & Web Worker", os.path.join(PERF_DIR, "06-runtime-performance.md")),
        ("Phần 8: Hệ thống Giám sát Telemetry, RUM & Quan sát CI/CD Observability", os.path.join(PERF_DIR, "07-monitoring.md")),
        ("Phần 9: Bảng Chỉ mục & Cẩm nang Tra cứu Nhanh Hiệu năng (Performance Index)", os.path.join(PERF_DIR, "PERFORMANCE-INDEX.md")),
    ]

    toc = "\n".join([f"{i+1}. [{title}](#phan-{i+1})".lower() for i, (title, _) in enumerate(parts)])
    
    header = f"""# ⚡ GIAI ĐOẠN 6: KỸ THUẬT TỐI ƯU HIỆU NĂNG, KIẾN TRÚC SRE & GIÁM SÁT TELEMETRY TOÀN DIỆN
## Hệ Thống: Japanese SRS System (記憶道 FSRS) · Bản Quy Hoạch Hợp Nhất (Consolidated Specification)

> **Thông tin tổng hợp:**
> * **Giai đoạn:** Phase 6 (Sprints 13-14)
> * **Tệp nguồn hợp nhất:** `doc/performance/00-performance-foundation.md` đến `07-monitoring.md` và `PERFORMANCE-INDEX.md` (10 tệp)
> * **Trọng tâm kỹ thuật:** Đáp ứng hoàn hảo Core Web Vitals (LCP < 1.2s, FID/INP < 50ms, CLS < 0.05), Giảm thiểu TTFB trên Serverless Vercel qua Turso HTTPS REST Pipeline, Bundle Splitting, Dynamic Asset WebP/AVIF Subsets, Offline IndexedDB Sync và Real User Monitoring (RUM).
> * **Cam kết cốt lõi:** Trải nghiệm siêu tốc độ ngay cả trong điều kiện mạng di động 3G yếu hoặc máy cấu hình thấp.

---

### 📑 MỤC LỤC TỔNG QUAN GIAI ĐOẠN 6
{toc}

---
"""
    body_parts = []
    for i, (title, path) in enumerate(parts):
        content = read_file(path)
        adapted = clean_sub_headings(content, level_offset=1)
        part_block = f"""
<a id="phan-{i+1}"></a>
# PHẦN {i+1}: {title.upper()}
*Tệp gốc: `{os.path.relpath(path, ROOT_DIR)}`*

---

{adapted}

---
"""
        body_parts.append(part_block)

    full_doc = header + "\n".join(body_parts)
    out_path = os.path.join(PLANNING_DIR, "06_PHASE_6_PERFORMANCE_OPTIMIZATION_AND_SRE.md")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(full_doc)
    print(f"-> Created {out_path} ({len(full_doc)} bytes)")

# ==============================================================================
# PHASE 7: Giai đoạn 7 - Động cơ Học Ngữ pháp JPD133 Bunbou Engine & Ngân hàng Bài tập
# ==============================================================================
def build_phase_7():
    print("Building Phase 7...")
    parts = [
        ("Phần 1: Bản Quy hoạch Tổng thể Động cơ Học Ngữ pháp JPD133 Bunbou Engine (Master Plan)", os.path.join(ARTIFACT_DIR, "grammar_engine_master_plan.md")),
        ("Phần 2: Bách khoa Toàn thư Chuyên sâu 32 Mẫu Cấu trúc Ngữ pháp Bài 8 - 11", os.path.join(ARTIFACT_DIR, "grammar_deepdive_patterns_encyclopedia.md")),
        ("Phần 3: Ngân hàng 204 Bài tập Thực hành & Lời giải Chi tiết từ Sách Bài tập", os.path.join(ARTIFACT_DIR, "grammar_exercise_bank_and_solutions.md")),
        ("Phần 4: Điểm Kiểm soát Tiến độ & Nhật ký Triển khai Đồng bộ Turso Cloud", os.path.join(ARTIFACT_DIR, "SESSION_CHECKPOINT.md")),
    ]

    toc = "\n".join([f"{i+1}. [{title}](#phan-{i+1})".lower() for i, (title, _) in enumerate(parts)])
    
    header = f"""# 🎋 GIAI ĐOẠN 7: ĐỘNG CƠ HỌC NGỮ PHÁP NHẬT BẢN JPD133 BUNBOU ENGINE & NGÂN HÀNG BÀI TẬP
## Hệ Thống: Japanese SRS System (記憶道 FSRS) · Bản Quy Hoạch Hợp Nhất (Consolidated Specification)

> **Thông tin tổng hợp:**
> * **Giai đoạn:** Phase 7 (Sprint 15)
> * **Tệp nguồn hợp nhất:** `grammar_engine_master_plan.md`, `grammar_deepdive_patterns_encyclopedia.md`, `grammar_exercise_bank_and_solutions.md`, `SESSION_CHECKPOINT.md` (4 tệp)
> * **Trọng tâm kỹ thuật:** Trích xuất toàn diện 2 bộ tài liệu gốc JPD133 (Ngữ pháp-Bunbou.pdf & SBT NGỮ PHÁP.pdf), Schema DDL 3 bảng (`grammar_lessons`, `grammar_patterns`, `grammar_exercises`), 32 mẫu câu ngữ pháp, 204 bài tập thực hành, 96 thẻ FSRS chuyên biệt cho cấu trúc ngữ pháp, Giao diện học tập Wa-Style trực quan (`/grammar`, `/grammar/[lessonId]`, `/grammar/practice`), Đồng bộ hoàn tất 100% lên Turso Cloud và Vercel Serverless.
> * **Cam kết cốt lõi:** Bảo toàn nguyên tử (Atomicity), Không gây hồi quy mã nguồn cũ (Zero Backend Regression), 95/95 Unit/Integration tests PASS.

---

### 📑 MỤC LỤC TỔNG QUAN GIAI ĐOẠN 7
{toc}

---
"""
    body_parts = []
    for i, (title, path) in enumerate(parts):
        content = read_file(path)
        adapted = clean_sub_headings(content, level_offset=1)
        part_block = f"""
<a id="phan-{i+1}"></a>
# PHẦN {i+1}: {title.upper()}
*Tệp gốc: `{os.path.basename(path)}`*

---

{adapted}

---
"""
        body_parts.append(part_block)

    full_doc = header + "\n".join(body_parts)
    out_path = os.path.join(PLANNING_DIR, "07_PHASE_7_JPD133_GRAMMAR_LEARNING_ENGINE.md")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(full_doc)
    print(f"-> Created {out_path} ({len(full_doc)} bytes)")

# ==============================================================================
# MASTER INDEX: README.md trong thư mục planning
# ==============================================================================
def build_master_index():
    print("Building Master Index README...")
    index_content = """# 📚 THƯ VIỆN QUY HOẠCH & KẾ HOẠCH HỆ THỐNG TOÀN DIỆN (CONSOLIDATED MASTER PLANNING REPOSITORY)
## Dự án: Japanese SRS System · 記憶道 (FSRS Spaced Repetition Engine)
## Thư mục duy nhất: `D:\\project\\japanese-srs-system\\planning`

---

### 📌 GIỚI THIỆU & MỤC TIÊU TÁI CẤU TRÚC TÀI LIỆU
Thực hiện chỉ đạo tái cấu trúc tài liệu quy hoạch: **Gom tất cả tài liệu planning vào một folder duy nhất (`/planning`), và những plan cùng giai đoạn thì gộp lại thành 1 file duy nhất**. 

Toàn bộ 36 tài liệu phân mảnh trước đây đã được chuẩn hóa, loại bỏ trùng lặp, biên tập thống nhất và gom gọn thành **7 Tệp Tài Liệu Tương Ứng Với 7 Giai Đoạn Phát Triển** có cấu trúc phân tầng hoàn chỉnh:

```
planning/
├── README.md                                           # [TÀI LIỆU NÀY] Mục lục tổng hợp & Lộ trình 7 giai đoạn
├── 01_PHASE_1_WA_STYLE_UI_REDESIGN.md                  # Giai đoạn 1: Tái thiết kế Giao diện Wa-Style (Gộp 9 tệp)
├── 02_PHASE_2_DECK_BASED_SRS_AND_AGENT_WORKFLOW.md     # Giai đoạn 2: Ôn tập Phân tách Bộ thẻ & Phối hợp Đa Agent (Gộp 3 tệp)
├── 03_PHASE_3_JAPANESE_GRAPHIC_DESIGN_AND_WA_ART.md    # Giai đoạn 3: Đồ họa Hiện đại & Tranh Hội họa Wa-Art (Gộp 2 tệp)
├── 04_PHASE_4_COGNITIVE_SCIENCE_AND_FOUR_PILLARS.md    # Giai đoạn 4: Khoa học Nhận thức & 4 Trụ Cột FSRS (Gộp 6 tệp)
├── 05_PHASE_5_KIRIE_PAPER_CUTOUT_AND_WAVE_REDESIGN.md  # Giai đoạn 5: Nghệ thuật Cắt giấy Kirie & Mobile Nav (Gộp 2 tệp)
├── 06_PHASE_6_PERFORMANCE_OPTIMIZATION_AND_SRE.md      # Giai đoạn 6: Kỹ thuật Hiệu năng & Giám sát Telemetry (Gộp 10 tệp)
└── 07_PHASE_7_JPD133_GRAMMAR_LEARNING_ENGINE.md        # Giai đoạn 7: Động cơ Ngữ pháp JPD133 Bunbou Engine (Gộp 4 tệp)
```

---

### 🗺️ BẢNG ĐIỀU HƯỚNG 7 GIAI ĐOẠN QUY HOẠCH CHI TIẾT

| Giai đoạn | Tên Tài liệu Quy hoạch | Số tệp đã gộp | Trọng tâm & Sản phẩm bàn giao cốt lõi | Trạng thái |
| :---: | :--- | :---: | :--- | :---: |
| **Phase 1** | **[01_PHASE_1_WA_STYLE_UI_REDESIGN.md](01_PHASE_1_WA_STYLE_UI_REDESIGN.md)** | **9 tệp** (00 đến 08) | Bản tuyên ngôn mỹ học Wabi-Sabi, Hệ Nippon Colors, Wagara SVG Data URIs, Cánh hoa Sakura, Hoạt họa Inkan son đỏ, Daruma điểm mắt, Tái thiết kế 4 màn hình (Honmaru, Tanzakucho, Shodo Desk, Karuta Review). | Hoàn thành |
| **Phase 2** | **[02_PHASE_2_DECK_BASED_SRS_AND_AGENT_WORKFLOW.md](02_PHASE_2_DECK_BASED_SRS_AND_AGENT_WORKFLOW.md)** | **3 tệp** (09, 10, Playbook) | Phân tách không gian hàng đợi độc lập theo bộ thẻ (Deck Segregation), URL-First Session State, Ma trận phân định trách nhiệm 6 vai trò kỹ sư và Cẩm nang 8 kỹ năng Antigravity Agents. | Hoàn thành |
| **Phase 3** | **[03_PHASE_3_JAPANESE_GRAPHIC_DESIGN_AND_WA_ART.md](03_PHASE_3_JAPANESE_GRAPHIC_DESIGN_AND_WA_ART.md)** | **2 tệp** (11, 12) | Bóc tách đồ họa Wa-Modern Bento Grid, Trục kép Tate/Yoko-gaki, Phân bổ 13 tác phẩm hội họa mộc bản Ukiyo-e, Rinpa, Yuzen vào toàn bộ các trang giao diện với độ mờ tinh tế và hiệu ứng Washi Paper. | Hoàn thành |
| **Phase 4** | **[04_PHASE_4_COGNITIVE_SCIENCE_AND_FOUR_PILLARS.md](04_PHASE_4_COGNITIVE_SCIENCE_AND_FOUR_PILLARS.md)** | **6 tệp** (13 đến 18) | Nâng cấp Khoa học Nhận thức chuyên sâu với 4 Trụ Cột: Lập lịch thích ứng FSRS 21 tham số, Thuật toán xen kẽ ngữ nghĩa LECTOR, Đồ thị chữ Hán hình thanh KanjiCompass Graph, Tương tác 4 cấp độ và Extension thu thập dữ liệu. | Hoàn thành |
| **Phase 5** | **[05_PHASE_5_KIRIE_PAPER_CUTOUT_AND_WAVE_REDESIGN.md](05_PHASE_5_KIRIE_PAPER_CUTOUT_AND_WAVE_REDESIGN.md)** | **2 tệp** (19, 20) | Ngôn ngữ thiết kế cắt giấy thủ công Washi Kirie, Lớp sóng biển 3D đổ bóng đa tầng `kirie-shadow-deep`, Màu chàm Aizome `#20507B`, Thanh điều hướng nổi KirieBottomNav và tối ưu hóa di động 60fps. | Hoàn thành |
| **Phase 6** | **[06_PHASE_6_PERFORMANCE_OPTIMIZATION_AND_SRE.md](06_PHASE_6_PERFORMANCE_OPTIMIZATION_AND_SRE.md)** | **10 tệp** (perf 00-07, Index, Readme) | Kiểm toán kiến trúc toàn diện, Tối ưu Next.js 15 App Router, Nén tài nguyên WebP/AVIF, Giảm thiểu độ trễ Turso Cloud qua HTTPS REST, Bộ nhớ đệm Offline IndexedDB, Audio Pool và Hệ thống Giám sát Telemetry RUM. | Hoàn thành |
| **Phase 7** | **[07_PHASE_7_JPD133_GRAMMAR_LEARNING_ENGINE.md](07_PHASE_7_JPD133_GRAMMAR_LEARNING_ENGINE.md)** | **4 tệp** (Plan, Encyclopedia, Bank, Checkpoint) | Trích xuất toàn diện 2 tài liệu giáo trình JPD133, Thiết kế 3 bảng DDL ngữ pháp, 32 cấu trúc chi tiết, 204 câu hỏi bài tập kèm lời giải, 96 thẻ FSRS ngữ pháp, Bộ giao diện `/grammar`, `/grammar/[lessonId]`, `/grammar/practice` và đồng bộ Turso Cloud. | Hoàn thành |

---

### 🏗️ SƠ ĐỒ TIẾN HÓA KIẾN TRÚC TOÀN DIỆN (SYSTEM ARCHITECTURE EVOLUTION)

```mermaid
graph TD
    classDef phase1 fill:#FAF8F5,stroke:#88A752,stroke-width:2px,color:#1F2421;
    classDef phase2 fill:#EBF2DF,stroke:#6E8A3C,stroke-width:2px,color:#1F2421;
    classDef phase3 fill:#F5EBE6,stroke:#D9381E,stroke-width:2px,color:#1F2421;
    classDef phase4 fill:#E6F0FA,stroke:#1B4268,stroke-width:2px,color:#1F2421;
    classDef phase5 fill:#E8F4F8,stroke:#20507B,stroke-width:2px,color:#1F2421;
    classDef phase6 fill:#FFF8E7,stroke:#D97706,stroke-width:2px,color:#1F2421;
    classDef phase7 fill:#F0FDF4,stroke:#15803D,stroke-width:2px,color:#1F2421;

    subgraph P1 ["Phase 1: Mỹ học Wa-Style & Giao diện Cốt lõi"]
        A1["Nippon Colors Token & Wagara"]:::phase1 --> A2["4 Màn hình Cốt lõi (Dashboard, Cards, Review, New)"]:::phase1
    end

    subgraph P2 ["Phase 2: Bộ thẻ & Phối hợp Đa Agent"]
        B1["Deck Segregation & URL-First"]:::phase2 --> B2["8 Kỹ năng Agent Collaboration Playbook"]:::phase2
    end

    subgraph P3 ["Phase 3: Đồ họa Wa-Modern & Tranh Mộc bản"]
        C1["Bento Grid & Trục kép Tate/Yoko"]:::phase3 --> C2["Phân bổ 13 Tác phẩm Ukiyo-e / Rinpa"]:::phase3
    end

    subgraph P4 ["Phase 4: Khoa học Nhận thức & 4 Trụ Cột FSRS"]
        D1["Pillar 1: FSRS 21 Params + LECTOR"]:::phase4
        D2["Pillar 2: KanjiCompass Graph"]:::phase4
        D3["Pillar 3: AI Semantic Evaluator"]:::phase4
        D4["Pillar 4: Automated Mining Extension"]:::phase4
    end

    subgraph P5 ["Phase 5: Nghệ thuật Kirie & Mobile Wave"]
        E1["Kirie Shadow Deep & Màu Chàm Aizome"]:::phase5 --> E2["5 Linh kiện Kirie & KirieBottomNav"]:::phase5
    end

    subgraph P6 ["Phase 6: Hiệu năng Cao & SRE Telemetry"]
        F1["Turso HTTPS REST Latency Optimization"]:::phase6 --> F2["Core Web Vitals & RUM Telemetry"]:::phase6
    end

    subgraph P7 ["Phase 7: Động cơ Ngữ pháp JPD133 Bunbou"]
        G1["32 Mẫu ngữ pháp & 204 Bài tập SBT"]:::phase7 --> G2["FSRS Grammar Cards (640 Cards Total) & Turso Cloud"]:::phase7
    end

    P1 --> P2 --> P3 --> P4 --> P5 --> P6 --> P7
```

---

### 🛡️ CAM KẾT CHẤT LƯỢNG & RÀNG BUỘC KỸ THUẬT (ENGINEERING INVARIANTS)
1. **Zero Backend Regression:** Tuyệt đối không làm thay đổi các bảng cơ sở dữ liệu đã ổn định (`cards`, `decks`, `review_logs`). Mọi bảng mới (như `grammar_lessons`, `grammar_patterns`, `grammar_exercises`) được mở rộng an toàn bằng DDL tách biệt.
2. **Kiểm thử tự động đạt 100%:** Luôn duy trì vượt qua toàn bộ 20 test suites (95 bài kiểm thử) trước bất kỳ lần bàn giao hoặc đẩy mã nguồn lên môi trường Production.
3. **Mỹ học Wabi-Sabi chuẩn mực:** Mọi tính năng mới bắt buộc áp dụng thống nhất các Design Tokens trong hệ thống màu sắc Nippon Colors, font chữ Mincho/Maru và các họa tiết Wagara truyền thống.
"""
    out_path = os.path.join(PLANNING_DIR, "README.md")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(index_content)
    print(f"-> Created {out_path} ({len(index_content)} bytes)")

if __name__ == "__main__":
    print(f"Starting consolidation into {PLANNING_DIR}...")
    build_phase_1()
    build_phase_2()
    build_phase_3()
    build_phase_4()
    build_phase_5()
    build_phase_6()
    build_phase_7()
    build_master_index()
    print("ALL 7 PHASES AND MASTER INDEX BUILT SUCCESSFULLY!")
