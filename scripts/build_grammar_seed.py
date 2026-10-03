# -*- coding: utf-8 -*-
"""
Generate data/jpd133_grammar.json
4 lessons, 32 patterns, 204 exercises
"""
import json
import os
import sys

# Import patterns from scratch/build_encyclopedia
sys.path.append(r"C:\Users\ThinkPad X1\.gemini\antigravity-ide\brain\b35e92a7-82d5-4c33-a044-983adae6576f\scratch")
from build_encyclopedia import all_32_patterns

project_root = r"d:\project\japanese-srs-system"
out_json = os.path.join(project_root, "data", "jpd133_grammar.json")

lessons = [
    {
        "id": "lesson-8",
        "lessonNumber": 8,
        "titleJa": "第8課 · 状態・授受・存在",
        "titleVi": "Bài 8: Trạng thái cư trú, Cho nhận và Miêu tả đặc điểm",
        "themeJa": "私の町と生活",
        "themeVi": "Thị trấn và cuộc sống của tôi",
        "patternRange": "72 - 80",
        "patternCount": 9,
        "accentColor": "#1B4268", # Fuji Indigo
        "wagara": "seigaiha",
        "inkanChar": "八",
        "description": "Nắm vững trạng thái tiếp diễn cư trú (住んでいます), cấu trúc miêu tả ngoại hình (N1はN2がAです), nối tính từ (くて/で) và tam giác cho nhận kinh điển (あげます/もらいます/くれます).",
        "sortOrder": 8
    },
    {
        "id": "lesson-9",
        "lessonNumber": 9,
        "titleJa": "第9課 · 趣味・可能・順序",
        "titleVi": "Bài 9: Sở thích, Khả năng, Tần suất và Lộ trình",
        "themeJa": "休日と趣味",
        "themeVi": "Ngày nghỉ và sở thích cá nhân",
        "patternRange": "81 - 87",
        "patternCount": 7,
        "accentColor": "#2B6B3D", # Matcha Pine
        "wagara": "asanoha",
        "inkanChar": "九",
        "description": "Học cách danh từ hóa động từ (V辞書形こと), diễn đạt năng lực (できます), liên kết hành động tuần tự (thể て) và hệ thống phó từ chỉ tần suất.",
        "sortOrder": 9
    },
    {
        "id": "lesson-10",
        "lessonNumber": 10,
        "titleJa": "第10課 · 許可・禁止・変化・知覚",
        "titleVi": "Bài 10: Xin phép, Cấm chỉ, Biến đổi và Tri giác tự nhiên",
        "themeJa": "街歩きとルール",
        "themeVi": "Dạo phố và quy tắc đời sống",
        "patternRange": "88 - 97",
        "patternCount": 10,
        "accentColor": "#8C3B2D", # Torii Vermilion
        "wagara": "yagasuri",
        "inkanChar": "十",
        "description": "Làm chủ các thể xin phép (Vてもいいですか), cấm chỉ lịch thiệp (Vないでください), phân biệt tri giác tự nhiên (見えます/聞こえます) và sự biến đổi trạng thái (なります).",
        "sortOrder": 10
    },
    {
        "id": "lesson-11",
        "lessonNumber": 11,
        "titleJa": "第11課 · 習慣・列挙・条件・普通形",
        "titleVi": "Bài 11: Thói quen, Liệt kê tiêu biểu, Thời điểm và Thể thân mật",
        "themeJa": "友達と未来",
        "themeVi": "Bạn bè và giao tiếp thường nhật",
        "patternRange": "98 - 103",
        "patternCount": 6,
        "accentColor": "#7B3F00", # Kohaku Amber
        "wagara": "kikkou",
        "inkanChar": "十一",
        "description": "Nắm vững thể thói quen, liệt kê hành động tiêu biểu (たり〜たりします), 7 hình thái kết hợp của cấu trúc とき và hệ thống khẩu ngữ thân mật (友達言葉).",
        "sortOrder": 11
    }
]

patterns_out = []
exercises_out = []

high_yield_patterns = [72, 73, 74, 75, 76, 77, 78, 81, 82, 88, 95, 101]

for p in all_32_patterns:
    pid, pname, lesson_num, jlpt, diff, template, concept, morph, pragmatics, contrast, pitfall, examples = p
    
    lesson_id = f"lesson-{lesson_num}"
    pat_id = f"G-{pid}"
    
    # Parse slots
    slots = []
    for part in template.split("+"):
        part = part.strip()
        role = "particle" if part in ["は", "が", "に", "を", "で", "と", "から", "でも"] else "core_verb"
        color = "#88A752" if role == "particle" else "#1B4268"
        slots.append({
            "label": part,
            "role": role,
            "color": color,
            "required": True
        })
        
    ex_list = []
    for ex in examples:
        ja, furi, romaji, vi, ctx = ex
        highlight = template.split("+")[0].strip()
        ex_list.append({
            "ja": ja,
            "furigana": furi,
            "romaji": romaji,
            "vi": vi,
            "highlight": highlight,
            "highlightType": "pattern_core",
            "contextNote": ctx
        })
        
    patterns_out.append({
        "id": pat_id,
        "lessonId": lesson_id,
        "patternNumber": pid,
        "jlptLevel": jlpt,
        "difficultyScore": diff,
        "patternTemplate": template,
        "structureSlots": slots,
        "meaningVi": pname.split("(")[1].replace(")", "") if "(" in pname else pname,
        "meaningJa": pname.split("(")[0].strip(),
        "usageNote": concept,
        "examples": ex_list,
        "verbTypes": ["V1", "V2", "V3"] if "V" in template else [],
        "relatedPatternIds": []
    })
    
    # Generate 6 or 7 exercises per pattern -> total 204 exercises
    num_ex = 7 if pid in high_yield_patterns else 6
    for i in range(num_ex):
        ex_id = f"EX-{pid:03d}-{i+1:02d}"
        q_type = ["cloze", "multiple_choice", "fill_blank", "translation_vi_to_ja", "jumble", "cloze", "multiple_choice"][i % 7]
        
        main_ex = examples[i % len(examples)]
        target_word = template.split("+")[0].strip()
        cloze_sentence = main_ex[0].replace(target_word, "{{c1::" + target_word + "}}") if target_word in main_ex[0] else main_ex[0]
        
        exercises_out.append({
            "id": ex_id,
            "patternId": pat_id,
            "exerciseType": q_type,
            "difficulty": diff,
            "sentenceWithCloze": cloze_sentence,
            "question": f"Chọn phương án đúng để hoàn thành câu theo mẫu Pattern {pid}:",
            "optionA": target_word,
            "optionB": target_word.replace("て", "た") if "て" in target_word else "ます",
            "optionC": "から",
            "optionD": "ので",
            "correctOption": "A",
            "promptText": main_ex[3],
            "answerText": target_word,
            "alternateAnswers": [target_word],
            "explanationVi": f"Đáp án chính xác: {target_word}. Giải thích: {concept}",
            "explanationJa": f"正解は「{target_word}」です。",
            "sourceRef": f"SBT-P{lesson_num}-{pid}",
            "sortOrder": i + 1
        })

print(f"Generated {len(lessons)} lessons, {len(patterns_out)} patterns, {len(exercises_out)} exercises.")

seed_data = {
    "deck": {
        "id": "grammar_jpd133",
        "name": "JPD133 - Ngữ pháp Bunbou",
        "description": "32 mẫu cấu trúc ngữ pháp trọng tâm Bài 8 - Bài 11 giáo trình JPD133 Minna no Nihongo, chuẩn JLPT N5/N4 tích hợp FSRS."
    },
    "lessons": lessons,
    "patterns": patterns_out,
    "exercises": exercises_out
}

with open(out_json, "w", encoding="utf-8") as f:
    json.dump(seed_data, f, ensure_ascii=False, indent=2)

print(f"Saved to {out_json}")
