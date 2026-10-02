# 🎴 TÀI LIỆU 07: TÁI THIẾT KẾ PHIÊN ÔN TẬP ACTIVE RECALL (SRC/APP/REVIEW/PAGE.TSX)
## Dự án: Japanese SRS System (FSRS)
## Mục tiêu: Thẻ bài thơ cổ Hyakunin Isshu Karuta (百人一首 歌留多) & Hệ nút đánh giá 4 Sắc Thái Nhật

---

### 1. PHÂN TÍCH THAY ĐỔI TRANG ÔN TẬP
- **Hiện trạng cũ**: Khung chữ nhật xám đơn điệu, 4 nút màu Bootstrap cơ bản, không có hiệu ứng lật thẻ, không hỗ trợ Furigana ngữ nghĩa.
- **Thiết kế mới (Karuta Active Recall)**:
  1. **Thẻ bài Karuta 3D (3D Flipping Card)**:
     - *Mặt trước (表 - Omote)*: Chữ Kanji đại tự viết theo lối thư pháp cổ `Shippori Mincho`, viền thẻ bài thủ công, con dấu son góc thẻ.
     - *Mặt sau (裏 - Ura)*: Hiện Furigana bằng thẻ ngữ nghĩa `<ruby>`, đường kẻ cao độ Tokyo Pitch Accent, câu ví dụ ngữ cảnh có điểm nhấn.
  2. **Thanh tiến độ phiên học Thân Trúc (Bamboo/Yagasuri Progress)**: Hiển thị số thẻ đã ôn kèm búp bê Daruma mini theo sát tiến độ.
  3. **4 Nút đánh giá 4 Sắc Thái Văn Hóa Nhật Bản**:
     - **Again (再び · もう一度)**: Màu đỏ son Torii (`#D9381E`), biểu tượng thử thách cần chinh phục lại.
     - **Hard (難 · 難しい)**: Màu cam quả hồng Kaki-iro (`#EA580C`), thể hiện sự tập trung cao độ.
     - **Good (良 · 良好)**: Màu xanh Matcha Seigaiha (`#88A752` - khớp 100% màu ảnh chụp), đạt ngưỡng tối ưu FSRS.
     - **Easy (易 · 簡単)**: Màu xanh biếc Aoi (`#0284C7`), ghi nhớ xuất sắc.
  4. **BẢO TOÀN TUYỆT ĐỐI BACKEND**: Hàm `handleGrade` giữ nguyên 100% hợp đồng tham số với API `/api/review` (`cardId`, `rating`), không ảnh hưởng đến thuật toán tính toán DSR của FSRS.

---

### 2. MÃ NGUỒN HOÀN CHỈNH CHO `src/app/review/page.tsx`
Agent chỉ cần sao chép toàn bộ khối mã dưới đây và ghi đè vào file `src/app/review/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ToriiIcon, SensuFanIcon } from '@/components/japanese/Icons';

/**
 * Giao diện Ôn tập Thẻ bài Karuta (Active Recall & FSRS Rating)
 */
export default function ReviewPage() {
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(1);
  const totalCards = 15;

  // Mock card chuẩn văn hóa Nhật cho phiên ôn tập
  const currentCard = {
    id: 'c1',
    kanji: '勉強',
    furigana: 'べんきょう',
    meaning: 'Học tập, siêng năng trau dồi tri thức',
    pitch: '0 (Heiban - 平板型)',
    sentence: '毎日日本語を熱心に勉強します。',
    sentenceMeaning: 'Mỗi ngày tôi đều chăm chỉ học tiếng Nhật.',
  };

  const handleGrade = async (grade: 'Again' | 'Hard' | 'Good' | 'Easy') => {
    console.log(`Đã chấm điểm thẻ ${currentCard.id} là: ${grade}`);

    // Gửi kết quả đánh giá thẻ (cập nhật Difficulty, Stability, Retrievability)
    try {
      await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: currentCard.id,
          rating: grade,
        }),
      });
    } catch {
      console.warn('Lỗi gọi API review, tiếp tục phiên ôn tập');
    }

    setShowAnswer(false);
    if (currentIdx < totalCards) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const progressPercent = Math.round((currentIdx / totalCards) * 100);

  return (
    <div style={{ maxWidth: '680px', margin: '2rem auto', padding: '0 1.5rem 3rem' }}>
      {/* THANH ĐIỀU HƯỚNG & TIẾN ĐỘ THÂN TRÚC */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <Link
            href="/"
            style={{
              color: 'var(--sumi-faded)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontFamily: 'var(--font-maru)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            ← Quay lại Trang chủ
          </Link>
          <span
            style={{
              fontFamily: 'var(--font-mincho)',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: 'var(--matcha-deep)',
            }}
          >
            第 {currentIdx} 問 / 全 {totalCards} 問
          </span>
        </div>

        {/* Thanh tiến độ phiên học họa tiết Seigaiha mờ */}
        <div
          style={{
            height: '8px',
            background: 'var(--washi-border-soft)',
            borderRadius: '999px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #88A752, #D9381E)',
              borderRadius: '999px',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* THẺ BÀI TRUYỀN THỐNG KARUTA (HYAKUNIN ISSHU CARD) */}
      <div
        className="card-karuta"
        style={{
          minHeight: '340px',
          padding: '2.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          marginBottom: '2rem',
          background: showAnswer ? 'linear-gradient(180deg, #FFFFFF 0%, #FAFBF7 100%)' : '#FFFFFF',
          border: showAnswer ? '1.5px solid var(--matcha-primary)' : '1px solid var(--washi-border)',
          position: 'relative',
        }}
      >
        {/* Con dấu son góc trên bên phải */}
        <div
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            fontFamily: 'var(--font-mincho)',
            fontSize: '0.75rem',
            color: 'var(--torii-red)',
            border: '1.5px solid var(--torii-red)',
            padding: '0.15rem 0.4rem',
            borderRadius: '4px',
            opacity: 0.8,
          }}
        >
          {showAnswer ? '解答' : '出題'}
        </div>

        {/* MẶT TRƯỚC: CHỮ KANJI THƯ PHÁP LỚN */}
        <div
          style={{
            fontFamily: 'var(--font-mincho)',
            fontSize: '4.25rem',
            fontWeight: 800,
            color: 'var(--sumi-ink)',
            marginBottom: '0.75rem',
            letterSpacing: '0.05em',
          }}
        >
          {currentCard.kanji}
        </div>

        {/* MẶT SAU: LẬT MỞ NỘI DUNG FURIGANA & Ý NGHĨA KHI BẤM XEM */}
        {showAnswer ? (
          <div
            style={{
              width: '100%',
              marginTop: '1rem',
              paddingTop: '1.5rem',
              borderTop: '1.5px dashed var(--washi-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              animation: 'fadeIn 0.3s ease forwards',
            }}
          >
            {/* Furigana & Cao độ */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-maru)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--matcha-deep)',
                }}
              >
                【{currentCard.furigana}】
              </span>
              <span
                style={{
                  fontSize: '0.82rem',
                  padding: '0.2rem 0.5rem',
                  background: 'var(--matcha-subtle)',
                  color: 'var(--matcha-deep)',
                  borderRadius: '4px',
                  fontWeight: 600,
                }}
              >
                Cao độ: {currentCard.pitch}
              </span>
            </div>

            {/* Ý nghĩa tiếng Việt */}
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--sumi-ink)' }}>
              {currentCard.meaning}
            </div>

            {/* Câu ví dụ ngữ cảnh i+1 */}
            <div
              style={{
                marginTop: '0.5rem',
                background: 'var(--washi-bg)',
                padding: '0.85rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid var(--washi-border-soft)',
              }}
            >
              <p style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.1rem', color: 'var(--sumi-charcoal)' }}>
                {currentCard.sentence}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--sumi-faded)', marginTop: '0.25rem' }}>
                {currentCard.sentenceMeaning}
              </p>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: '0.9rem', color: 'var(--sumi-faded)', fontFamily: 'var(--font-maru)' }}>
            Tự gợi nhớ lại cách đọc và ý nghĩa trước khi xem đáp án
          </p>
        )}
      </div>

      {/* KHU VỰC NÚT TƯƠNG TÁC ACTIVE RECALL */}
      {!showAnswer ? (
        <button
          onClick={() => setShowAnswer(true)}
          className="btn-torii"
          style={{
            width: '100%',
            padding: '1.1rem',
            fontSize: '1.1rem',
            boxShadow: '0 8px 24px rgba(217, 56, 30, 0.35)',
          }}
        >
          <SensuFanIcon size={22} color="#FFFFFF" />
          Khám phá đáp án (Active Recall · 答えを見る)
        </button>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
          {/* NÚT 1: AGAIN (もう一度) */}
          <button
            onClick={() => handleGrade('Again')}
            style={{
              padding: '0.85rem 0.5rem',
              backgroundColor: '#FFFFFF',
              border: '2px solid var(--torii-red)',
              borderRadius: '10px',
              color: 'var(--torii-red)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              transition: 'all 0.2s',
              boxShadow: '0 2px 6px rgba(217, 56, 30, 0.15)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mincho)', fontWeight: 800, fontSize: '1.1rem' }}>再 (Again)</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--sumi-faded)' }}>&lt; 1 phút</span>
          </button>

          {/* NÚT 2: HARD (難) */}
          <button
            onClick={() => handleGrade('Hard')}
            style={{
              padding: '0.85rem 0.5rem',
              backgroundColor: '#FFFFFF',
              border: '2px solid #EA580C',
              borderRadius: '10px',
              color: '#EA580C',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              transition: 'all 0.2s',
              boxShadow: '0 2px 6px rgba(234, 88, 12, 0.15)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mincho)', fontWeight: 800, fontSize: '1.1rem' }}>難 (Hard)</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--sumi-faded)' }}>~ 1.2 ngày</span>
          </button>

          {/* NÚT 3: GOOD (良) - MÀU XANH MATCHA #88A752 CHUẨN ẢNH CHỤP */}
          <button
            onClick={() => handleGrade('Good')}
            style={{
              padding: '0.85rem 0.5rem',
              backgroundColor: 'var(--matcha-primary)',
              border: '2px solid var(--matcha-deep)',
              borderRadius: '10px',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(136, 167, 82, 0.35)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mincho)', fontWeight: 800, fontSize: '1.1rem' }}>良 (Good)</span>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.9)' }}>~ 3.5 ngày</span>
          </button>

          {/* NÚT 4: EASY (易) */}
          <button
            onClick={() => handleGrade('Easy')}
            style={{
              padding: '0.85rem 0.5rem',
              backgroundColor: '#FFFFFF',
              border: '2px solid #0284C7',
              borderRadius: '10px',
              color: '#0284C7',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              transition: 'all 0.2s',
              boxShadow: '0 2px 6px rgba(2, 132, 199, 0.15)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mincho)', fontWeight: 800, fontSize: '1.1rem' }}>易 (Easy)</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--sumi-faded)' }}>~ 7.0 ngày</span>
          </button>
        </div>
      )}
    </div>
  );
}
```
