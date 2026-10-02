# -*- coding: utf-8 -*-
"""
Bộ bóc tách & chuẩn hóa Hán tự JPD133 (Kanji Tamago - Bài 8-11)
Nguồn: D:/semester-5/JPD133/Hán tự-Kanji.pdf

Đặc tính nhận thức & SRS chuẩn:
- 41 Chữ Hán gốc (Loại: Kanji): Âm Hán Việt, Âm On/Kun đầy đủ, Ý nghĩa chuẩn
- 68+ Từ vựng ghép / Dẫn xuất (Loại: Vocab): Okurigana, Furigana chuẩn, Ý nghĩa thực tế
- Gắn thẻ (Tagging) chi tiết: Bài học (第8回目 ~ 第11回目), Âm Hán Việt
"""

import os
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

OUTPUT_JSON = os.path.join(os.path.dirname(__file__), "..", "data", "jpd133_kanji_tamago.json")

# Danh mục 41 chữ Hán cốt lõi trong Kanji Tamago (Bài 8 - 11)
KANJI_REGISTRY = [
    # --- 第8回目 (12 chữ Hán) ---
    {
        "unit": "第8回目",
        "kanji": "家",
        "han_viet": "GIA",
        "on_kun": "うち, いえ (On: カ, ケ)",
        "meaning": "Nhà, gia đình",
        "compounds": [
            {"kanji": "大家", "reading": "おおや", "meaning": "Chủ trọ / Chủ nhà"},
        ]
    },
    {
        "unit": "第8回目",
        "kanji": "族",
        "han_viet": "TỘC",
        "on_kun": "ぞく (On: ゾク)",
        "meaning": "Gia tộc, bộ tộc, dòng họ",
        "compounds": [
            {"kanji": "家族", "reading": "かぞく", "meaning": "Gia đình"},
            {"kanji": "族長", "reading": "ぞくちょう", "meaning": "Tộc trưởng / Trưởng bộ tộc"}
        ]
    },
    {
        "unit": "第8回目",
        "kanji": "父",
        "han_viet": "PHỤ",
        "on_kun": "ちち (On: フ / Kun: ちち)",
        "meaning": "Bố, cha (xưng hô với người ngoài)",
        "compounds": [
            {"kanji": "お父さん", "reading": "おとうさん", "meaning": "Bố, cha (gọi thân mật / bố người khác)"},
            {"kanji": "父母", "reading": "ふぼ", "meaning": "Cha mẹ / Phụ mẫu"}
        ]
    },
    {
        "unit": "第8回目",
        "kanji": "母",
        "han_viet": "MẪU",
        "on_kun": "はは (On: ボ / Kun: はは)",
        "meaning": "Mẹ (xưng hô với người ngoài)",
        "compounds": [
            {"kanji": "お母さん", "reading": "おかあさん", "meaning": "Mẹ (gọi thân mật / mẹ người khác)"},
            {"kanji": "母国語", "reading": "ぼこくご", "meaning": "Tiếng mẹ đẻ"},
            {"kanji": "母国", "reading": "ぼこく", "meaning": "Mẫu quốc / Đất nước mẹ đẻ"}
        ]
    },
    {
        "unit": "第8回目",
        "kanji": "兄",
        "han_viet": "HUYNH",
        "on_kun": "あに (On: キョウ, ケイ / Kun: あに)",
        "meaning": "Anh trai (xưng hô với người ngoài)",
        "compounds": [
            {"kanji": "お兄さん", "reading": "おにいさん", "meaning": "Anh trai (gọi thân mật / anh người khác)"},
            {"kanji": "兄弟", "reading": "きょうだい", "meaning": "Anh em / Huynh đệ"}
        ]
    },
    {
        "unit": "第8回目",
        "kanji": "弟",
        "han_viet": "ĐỆ",
        "on_kun": "おとうと (On: テイ, ダイ / Kun: おとうと)",
        "meaning": "Em trai (xưng hô với người ngoài)",
        "compounds": [
            {"kanji": "弟さん", "reading": "おとうとさん", "meaning": "Em trai (người khác)"}
        ]
    },
    {
        "unit": "第8回目",
        "kanji": "姉",
        "han_viet": "TỈ",
        "on_kun": "あね (On: シ / Kun: あね)",
        "meaning": "Chị gái (xưng hô với người ngoài)",
        "compounds": [
            {"kanji": "お姉さん", "reading": "おねえさん", "meaning": "Chị gái (gọi thân mật / chị người khác)"},
            {"kanji": "姉妹", "reading": "しまい", "meaning": "Chị em gái"}
        ]
    },
    {
        "unit": "第8回目",
        "kanji": "妹",
        "han_viet": "MUỘI",
        "on_kun": "いもうと (On: マイ / Kun: いもうと)",
        "meaning": "Em gái (xưng hô với người ngoài)",
        "compounds": [
            {"kanji": "妹さん", "reading": "いもうとさん", "meaning": "Em gái (người khác)"}
        ]
    },
    {
        "unit": "第8回目",
        "kanji": "犬",
        "han_viet": "KHUYỂN",
        "on_kun": "いぬ (On: ケン / Kun: いぬ)",
        "meaning": "Con chó",
        "compounds": []
    },
    {
        "unit": "第8回目",
        "kanji": "高",
        "han_viet": "CAO",
        "on_kun": "たか.い (On: コウ / Kun: たか)",
        "meaning": "Cao, đắt",
        "compounds": [
            {"kanji": "高い", "reading": "たかい", "meaning": "Cao, đắt (giá cả / chiều cao)"},
            {"kanji": "高校", "reading": "こうこう", "meaning": "Trường cấp 3 / THPT"},
            {"kanji": "高校生", "reading": "こうこうせい", "meaning": "Học sinh cấp 3"}
        ]
    },
    {
        "unit": "第8回目",
        "kanji": "短",
        "han_viet": "ĐOẢN",
        "on_kun": "みじか.い (On: タン / Kun: みじか)",
        "meaning": "Ngắn",
        "compounds": [
            {"kanji": "短い", "reading": "みじかい", "meaning": "Ngắn (chiều dài, thời gian)"},
            {"kanji": "短大", "reading": "たんだい", "meaning": "Trường cao đẳng"}
        ]
    },
    {
        "unit": "第8回目",
        "kanji": "長",
        "han_viet": "TRƯỜNG, TRƯỞNG",
        "on_kun": "なが.い (On: チョウ / Kun: なが)",
        "meaning": "Dài, đứng đầu",
        "compounds": [
            {"kanji": "長い", "reading": "ながい", "meaning": "Dài (chiều dài, thời gian)"},
            {"kanji": "社長", "reading": "しゃちょう", "meaning": "Giám đốc công ty"},
            {"kanji": "学長", "reading": "がくちょう", "meaning": "Hiệu trưởng trường đại học"},
            {"kanji": "校長", "reading": "こうちょう", "meaning": "Hiệu trưởng trường học"}
        ]
    },

    # --- 第9回目 (10 chữ Hán) ---
    {
        "unit": "第9回目",
        "kanji": "好",
        "han_viet": "HẢO",
        "on_kun": "す.き, この.む (On: コウ)",
        "meaning": "Thích, tốt đẹp",
        "compounds": [
            {"kanji": "好き", "reading": "すき", "meaning": "Thích"},
            {"kanji": "大好き", "reading": "だいすき", "meaning": "Rất thích"},
            {"kanji": "大好物", "reading": "だいこうぶつ", "meaning": "Món ăn yêu thích nhất"}
        ]
    },
    {
        "unit": "第9回目",
        "kanji": "歌",
        "han_viet": "CA",
        "on_kun": "うた, うた.う (On: カ)",
        "meaning": "Bài hát, ca hát",
        "compounds": [
            {"kanji": "歌", "reading": "うた", "meaning": "Bài hát"},
            {"kanji": "歌う", "reading": "うたう", "meaning": "Hát (động từ)"},
            {"kanji": "国歌", "reading": "こっか", "meaning": "Quốc ca"},
            {"kanji": "短歌", "reading": "たんか", "meaning": "Thơ ngắn Tanka Nhật Bản"}
        ]
    },
    {
        "unit": "第9回目",
        "kanji": "音",
        "han_viet": "ÂM",
        "on_kun": "おと (On: オン, イン)",
        "meaning": "Âm thanh, tiếng động",
        "compounds": [
            {"kanji": "音", "reading": "おと", "meaning": "Âm thanh, tiếng động"},
            {"kanji": "音読み", "reading": "おんよみ", "meaning": "Âm On (cách đọc âm Hán-Nhật)"}
        ]
    },
    {
        "unit": "第9回目",
        "kanji": "楽",
        "han_viet": "NHẠC, LẠC",
        "on_kun": "たの.しい (On: ガク, ラク)",
        "meaning": "Âm nhạc, vui vẻ",
        "compounds": [
            {"kanji": "楽しい", "reading": "たのしい", "meaning": "Vui vẻ, hào hứng"},
            {"kanji": "音楽", "reading": "おんがく", "meaning": "Âm nhạc"}
        ]
    },
    {
        "unit": "第9回目",
        "kanji": "車",
        "han_viet": "XA",
        "on_kun": "くるま (On: シャ)",
        "meaning": "Xe hơi, xe cộ",
        "compounds": [
            {"kanji": "車", "reading": "くるま", "meaning": "Xe hơi, ô tô"}
        ]
    },
    {
        "unit": "第9回目",
        "kanji": "映",
        "han_viet": "ẢNH, ÁNH",
        "on_kun": "うつ.る (On: エイ)",
        "meaning": "Phản chiếu, chiếu phim",
        "compounds": [
            {"kanji": "映画", "reading": "えいが", "meaning": "Bộ phim / Điện ảnh"}
        ]
    },
    {
        "unit": "第9回目",
        "kanji": "画",
        "han_viet": "HỌA, HOẠCH",
        "on_kun": "かく (On: ガ, カク)",
        "meaning": "Bức tranh, kế hoạch",
        "compounds": [
            {"kanji": "計画", "reading": "けいかく", "meaning": "Kế hoạch"}
        ]
    },
    {
        "unit": "第9回目",
        "kanji": "旅",
        "han_viet": "LỮ",
        "on_kun": "たび (On: リョ)",
        "meaning": "Chuyến đi, chuyến hành trình",
        "compounds": [
            {"kanji": "旅", "reading": "たび", "meaning": "Chuyến đi, hành trình"},
            {"kanji": "旅行", "reading": "りょこう", "meaning": "Du lịch / Đi chơi xa"}
        ]
    },
    {
        "unit": "第9回目",
        "kanji": "海",
        "han_viet": "HẢI",
        "on_kun": "うみ (On: カイ)",
        "meaning": "Biển, đại dương",
        "compounds": [
            {"kanji": "海", "reading": "うみ", "meaning": "Biển, bãi biển"},
            {"kanji": "海水", "reading": "かいすい", "meaning": "Nước biển"}
        ]
    },
    {
        "unit": "第9回目",
        "kanji": "外",
        "han_viet": "NGOẠI",
        "on_kun": "そと (On: ガイ, ゲ)",
        "meaning": "Ngoài, bên ngoài",
        "compounds": [
            {"kanji": "家の外", "reading": "いえのそと", "meaning": "Bên ngoài nhà"},
            {"kanji": "外国", "reading": "がいこく", "meaning": "Nước ngoài"},
            {"kanji": "外国語", "reading": "がいこくご", "meaning": "Tiếng nước ngoài / Ngoại ngữ"},
            {"kanji": "外国人", "reading": "がいこくじん", "meaning": "Người nước ngoài"},
            {"kanji": "社外", "reading": "しゃがい", "meaning": "Bên ngoài công ty"},
            {"kanji": "海外", "reading": "かいがい", "meaning": "Hải ngoại / Nước ngoài"}
        ]
    },

    # --- 第10回目 (9 chữ Hán) ---
    {
        "unit": "第10回目",
        "kanji": "駅",
        "han_viet": "DỊCH",
        "on_kun": "えき (On: エキ)",
        "meaning": "Nhà ga",
        "compounds": [
            {"kanji": "駅", "reading": "えき", "meaning": "Nhà ga xe điện"},
            {"kanji": "駅長", "reading": "えきちょう", "meaning": "Trưởng ga"}
        ]
    },
    {
        "unit": "第10回目",
        "kanji": "上",
        "han_viet": "THƯỢNG",
        "on_kun": "うえ, あ.がる (On: ジョウ)",
        "meaning": "Phía trên, lên trên",
        "compounds": [
            {"kanji": "上", "reading": "うえ", "meaning": "Phía trên / Bên trên"},
            {"kanji": "上京", "reading": "じょうきょう", "meaning": "Tới Tokyo / Lên thủ đô"},
            {"kanji": "上下", "reading": "じょうげ", "meaning": "Trên dưới / Lên xuống"}
        ]
    },
    {
        "unit": "第10回目",
        "kanji": "下",
        "han_viet": "HẠ",
        "on_kun": "した, さ.がる (On: カ, ゲ)",
        "meaning": "Phía dưới, đi xuống",
        "compounds": [
            {"kanji": "下", "reading": "した", "meaning": "Phía dưới / Bên dưới"},
            {"kanji": "下車", "reading": "げしゃ", "meaning": "Xuống xe"}
        ]
    },
    {
        "unit": "第10回目",
        "kanji": "地",
        "han_viet": "ĐỊA",
        "on_kun": "ち, じ (On: チ, ジ)",
        "meaning": "Đất đai, mặt đất",
        "compounds": [
            {"kanji": "土地", "reading": "とち", "meaning": "Đất đai"},
            {"kanji": "地下", "reading": "ちか", "meaning": "Dưới lòng đất / Tầng hầm / Ngầm"}
        ]
    },
    {
        "unit": "第10回目",
        "kanji": "図",
        "han_viet": "ĐỒ",
        "on_kun": "ず, と (On: ズ, ト)",
        "meaning": "Bản đồ, hình vẽ, sơ đồ",
        "compounds": [
            {"kanji": "地図", "reading": "ちず", "meaning": "Bản đồ"},
            {"kanji": "図", "reading": "ず", "meaning": "Hình vẽ, biểu đồ, sơ đồ"}
        ]
    },
    {
        "unit": "第10回目",
        "kanji": "館",
        "han_viet": "QUÁN",
        "on_kun": "かん (On: カン)",
        "meaning": "Tòa nhà công cộng, hội quán",
        "compounds": [
            {"kanji": "図書館", "reading": "としょかん", "meaning": "Thư viện"},
            {"kanji": "旅館", "reading": "りょかん", "meaning": "Quán trọ kiểu Nhật / Ryokan"},
            {"kanji": "会館", "reading": "かいかん", "meaning": "Hội quán / Nhà văn hóa"},
            {"kanji": "映画館", "reading": "えいがかん", "meaning": "Rạp chiếu phim"}
        ]
    },
    {
        "unit": "第10回目",
        "kanji": "右",
        "han_viet": "HỮU",
        "on_kun": "みぎ (On: ウ, ユウ)",
        "meaning": "Phía bên phải",
        "compounds": [
            {"kanji": "右", "reading": "みぎ", "meaning": "Bên phải, phía bên phải"},
            {"kanji": "左右", "reading": "さゆう", "meaning": "Trái phải / Sự chi phối"}
        ]
    },
    {
        "unit": "第10回目",
        "kanji": "左",
        "han_viet": "TẢ",
        "on_kun": "ひだり (On: サ)",
        "meaning": "Phía bên trái",
        "compounds": [
            {"kanji": "左", "reading": "ひだり", "meaning": "Bên trái, phía bên trái"}
        ]
    },
    {
        "unit": "第10回目",
        "kanji": "道",
        "han_viet": "ĐẠO",
        "on_kun": "みち (On: ドウ)",
        "meaning": "Con đường, đạo lý",
        "compounds": [
            {"kanji": "道", "reading": "みち", "meaning": "Con đường, lối đi"},
            {"kanji": "書道", "reading": "しょどう", "meaning": "Thư đạo / Nghệ thuật viết chữ đẹp"},
            {"kanji": "国道", "reading": "こくどう", "meaning": "Quốc lộ"},
            {"kanji": "車道", "reading": "しゃどう", "meaning": "Lòng đường xe chạy"}
        ]
    },

    # --- 第11回目 (10 chữ Hán) ---
    {
        "unit": "第11回目",
        "kanji": "起",
        "han_viet": "KHỞI",
        "on_kun": "お.きる, お.こす (On: キ)",
        "meaning": "Thức dậy, khởi đầu",
        "compounds": [
            {"kanji": "起きる", "reading": "おきる", "meaning": "Thức dậy"},
            {"kanji": "起こす", "reading": "おこす", "meaning": "Đánh thức ai đó / Gây ra (sự việc)"}
        ]
    },
    {
        "unit": "第11回目",
        "kanji": "歩",
        "han_viet": "BỘ",
        "on_kun": "ある.く (On: ホ, ブ)",
        "meaning": "Đi bộ, bước đi",
        "compounds": [
            {"kanji": "歩く", "reading": "あるく", "meaning": "Đi bộ"},
            {"kanji": "歩行", "reading": "ほこう", "meaning": "Bộ hành / Đi bộ"},
            {"kanji": "一歩", "reading": "いっぽ", "meaning": "Một bước / Từng bước một"}
        ]
    },
    {
        "unit": "第11回目",
        "kanji": "乗",
        "han_viet": "THỪA",
        "on_kun": "の.る, の.せる (On: ジョウ)",
        "meaning": "Lên xe, cưỡi, đi xe",
        "compounds": [
            {"kanji": "乗る", "reading": "のる", "meaning": "Lên (tàu, xe, máy bay...)"},
            {"kanji": "乗せる", "reading": "のせる", "meaning": "Chở ai đó / Chất hàng lên xe"},
            {"kanji": "乗車", "reading": "じょうしゃ", "meaning": "Lên xe, đi xe"}
        ]
    },
    {
        "unit": "第11回目",
        "kanji": "始",
        "han_viet": "THỦY",
        "on_kun": "はじ.める, はじ.まる (On: シ)",
        "meaning": "Bắt đầu, khởi đầu",
        "compounds": [
            {"kanji": "始める", "reading": "はじめる", "meaning": "Bắt đầu (tha động từ - chủ động bắt đầu cái gì)"},
            {"kanji": "始まる", "reading": "はじまる", "meaning": "Bắt đầu (tự động từ - cái gì đó tự bắt đầu)"},
            {"kanji": "始終", "reading": "しじゅう", "meaning": "Từ đầu đến cuối / Luôn luôn"}
        ]
    },
    {
        "unit": "第11回目",
        "kanji": "終",
        "han_viet": "CHUNG",
        "on_kun": "お.わる, お.える (On: シュウ)",
        "meaning": "Kết thúc, hoàn tất",
        "compounds": [
            {"kanji": "終わる", "reading": "おわる", "meaning": "Kết thúc, xong (tự động từ)"},
            {"kanji": "終える", "reading": "おえる", "meaning": "Hoàn thành, kết thúc cái gì (tha động từ)"}
        ]
    },
    {
        "unit": "第11回目",
        "kanji": "勉",
        "han_viet": "MIỄN",
        "on_kun": "べん (On: ベン)",
        "meaning": "Cố gắng, chăm chỉ",
        "compounds": [
            {"kanji": "勉強", "reading": "べんきょう", "meaning": "Học tập / Chăm chỉ học"},
            {"kanji": "勉学", "reading": "べんがく", "meaning": "Chăm chỉ nghiên cứu / Việc học tập"}
        ]
    },
    {
        "unit": "第11回目",
        "kanji": "強",
        "han_viet": "CƯỜNG, CƯỠNG",
        "on_kun": "つよ.い (On: キョウ, ゴウ)",
        "meaning": "Mạnh mẽ, kiên cường",
        "compounds": [
            {"kanji": "強い", "reading": "つよい", "meaning": "Mạnh mẽ, khoẻ mạnh"}
        ]
    },
    {
        "unit": "第11回目",
        "kanji": "朝",
        "han_viet": "TRIỀU",
        "on_kun": "あさ (On: チョウ)",
        "meaning": "Buổi sáng, sáng sớm",
        "compounds": [
            {"kanji": "朝", "reading": "あさ", "meaning": "Buổi sáng"},
            {"kanji": "朝食", "reading": "ちょうしょく", "meaning": "Bữa ăn sáng"},
            {"kanji": "今朝", "reading": "けさ", "meaning": "Sáng nay"},
            {"kanji": "毎朝", "reading": "まいあさ", "meaning": "Mỗi buổi sáng"}
        ]
    },
    {
        "unit": "第11回目",
        "kanji": "昼",
        "han_viet": "TRÚ",
        "on_kun": "ひる (On: チュウ)",
        "meaning": "Buổi trưa, ban ngày",
        "compounds": [
            {"kanji": "昼", "reading": "ひる", "meaning": "Buổi trưa"},
            {"kanji": "昼食", "reading": "ちゅうしょく", "meaning": "Bữa ăn trưa"},
            {"kanji": "昼間", "reading": "ひるま", "meaning": "Ban ngày / Giờ ban ngày"}
        ]
    },
    {
        "unit": "第11回目",
        "kanji": "夜",
        "han_viet": "DẠ",
        "on_kun": "よる, よ (On: ヤ)",
        "meaning": "Ban đêm, buổi tối",
        "compounds": [
            {"kanji": "夜", "reading": "よる", "meaning": "Ban đêm, buổi tối"},
            {"kanji": "夜道", "reading": "よみち", "meaning": "Đường phố ban đêm"},
            {"kanji": "夜会", "reading": "やかい", "meaning": "Dạ hội / Buổi tiệc đêm"},
            {"kanji": "夜間", "reading": "やかん", "meaning": "Ban đêm / Ca đêm"}
        ]
    },
]

def build_cards():
    cards = []
    seen_kanji_front = set()

    for item in KANJI_REGISTRY:
        unit = item["unit"]
        k = item["kanji"]
        hv = item["han_viet"]
        on_kun = item["on_kun"]
        meaning = item["meaning"]

        # 1. Thẻ Chữ Hán gốc (Loại: Kanji)
        kanji_card = {
            "type": "Kanji",
            "kanji": k,
            "reading": on_kun,
            "meaning": f"{meaning} (Âm Hán: {hv})",
            "han_viet": hv,
            "unit": unit,
            "primary_kanji": k
        }
        cards.append(kanji_card)
        seen_kanji_front.add(k)

        # 2. Thẻ Từ vựng / Từ ghép dẫn xuất (Loại: Vocab)
        for comp in item["compounds"]:
            comp_k = comp["kanji"]
            comp_r = comp["reading"]
            comp_m = comp["meaning"]

            # Nếu từ ghép trùng với chữ đơn thì bỏ qua vì đã có thẻ Kanji đại diện
            if comp_k == k:
                continue

            # Đảm bảo không trùng lặp
            card_key = (comp_k, comp_r)
            if any((c["kanji"], c["reading"]) == card_key for c in cards):
                continue

            vocab_card = {
                "type": "Vocab",
                "kanji": comp_k,
                "reading": comp_r,
                "meaning": f"{comp_m} (Chữ Hán: {k} - Âm Hán: {hv})",
                "han_viet": hv,
                "unit": unit,
                "primary_kanji": k
            }
            cards.append(vocab_card)

    print(f"Tổng hợp thành công:")
    print(f"- Số chữ Hán gốc: {len(KANJI_REGISTRY)}")
    kanji_count = sum(1 for c in cards if c["type"] == "Kanji")
    vocab_count = sum(1 for c in cards if c["type"] == "Vocab")
    print(f"- Tổng thẻ Kanji: {kanji_count}")
    print(f"- Tổng thẻ Từ ghép Vocab: {vocab_count}")
    print(f"- Tổng cộng: {len(cards)} thẻ học.")

    os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(cards, f, ensure_ascii=False, indent=2)
    print(f"Đã lưu kết quả vào: {OUTPUT_JSON}")

if __name__ == "__main__":
    build_cards()
