'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { JapaneseArtBackdrop } from '@/components/art/JapaneseArtBackdrop';
import { ToriiIcon, SensuFanIcon } from '@/components/japanese/Icons';
import { romajiToHiragana } from '@/lib/conjugation-engine';

export default function NewCardPage() {
  const router = useRouter();

  const [front, setFront] = useState('');
  const [reading, setReading] = useState('');
  const [meaning, setMeaning] = useState('');
  const [type, setType] = useState<'Vocab' | 'Kanji' | 'GrammarPattern'>('Vocab');
  const [deckId, setDeckId] = useState('deck_jpd133');
  const [sentence, setSentence] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Thêm Cloze deletion vào câu ví dụ
  const handleAddCloze = () => {
    if (!sentence) {
      setSentence('早く{{c1::家}}に帰りたいです。');
    } else {
      setSentence((prev) => `${prev} {{c1::...}}`);
    }
  };

  // Tự động chuyển đổi Romaji -> Hiragana khi nhập vào ô Reading
  const handleReadingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Chuyển đổi nếu người dùng gõ romaji
    const converted = romajiToHiragana(val);
    setReading(converted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !meaning.trim()) {
      alert('Vui lòng nhập đầy đủ mặt trước và ý nghĩa!');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          front: front.trim(),
          reading: reading.trim(),
          meaning: meaning.trim(),
          type,
          deckId,
          sentence: sentence.trim(),
        }),
      });

      if (res.ok) {
        setToastMessage('Đã tạo thẻ mới thành công vào kho lưu trữ FSRS!');
        setTimeout(() => {
          router.push('/cards');
        }, 1200);
      } else {
        setToastMessage('Lỗi khi tạo thẻ mới.');
      }
    } catch (err) {
      console.error('Lỗi khi gửi thẻ mới:', err);
      setToastMessage('Lỗi kết nối khi tạo thẻ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - 120px)',
        padding: '2rem 1.25rem 5rem',
        background: 'var(--washi-base, #FAF8F5)',
      }}
    >
      <JapaneseArtBackdrop
        src="/assets/art/vintage-woodblock-border.webp"
        alt="Họa tiết mộc bản Phù Tang"
        opacity={0.06}
        blendMode="multiply"
      />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Header bàn thư pháp */}
        <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '4px',
                  background: '#FDF2F0',
                  color: '#9E3223',
                  fontFamily: 'var(--font-mincho)',
                  fontWeight: 800,
                  border: '1px solid #E8A99F',
                }}
              >
                書道机 · SHODO DESK WYSIWYG
              </span>
              <span style={{ fontSize: '0.78rem', color: '#786A5E', fontFamily: 'var(--font-maru)' }}>
                Bàn thư pháp tạo thẻ trực quan
              </span>
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-mincho)',
                fontSize: '1.8rem',
                fontWeight: 900,
                color: '#16253B',
                margin: 0,
              }}
            >
              Soạn Thảo &amp; Khởi Tạo Thẻ Mới
            </h1>
          </div>

          <Link href="/cards" className="btn-washi" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            ← Quay lại thư viện thẻ
          </Link>
        </div>

        {/* Thông báo Toast nếu có */}
        {toastMessage && (
          <div
            style={{
              padding: '0.75rem 1.25rem',
              marginBottom: '1.5rem',
              borderRadius: '10px',
              background: '#EFF4EE',
              border: '1px solid #386641',
              color: '#386641',
              fontFamily: 'var(--font-maru)',
              fontWeight: 700,
              fontSize: '0.9rem',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            {toastMessage}
          </div>
        )}

        {/* Layout 2 cột: 55% Form bên trái / 45% Preview bên phải */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '2rem',
            alignItems: 'start',
          }}
        >
          {/* CỘT TRÁI: FORM NHẬP LIỆU WASHI (55%) */}
          <form
            onSubmit={handleSubmit}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1.5px solid #E6DDCF',
              borderRadius: '20px',
              padding: '2rem 1.75rem',
              boxShadow: '0 8px 24px rgba(22, 37, 59, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            <div>
              <label style={labelStyle}>
                Mặt trước (Kanji / Headword) <span style={{ color: '#9E3223' }}>*</span>
              </label>
              <input
                type="text"
                value={front}
                onChange={(e) => setFront(e.target.value)}
                placeholder="Ví dụ: 両親 hoặc 食べる"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={labelStyle}>Cách đọc (Furigana / Hiragana)</label>
                <span style={{ fontSize: '0.72rem', color: '#8C6B3E', fontFamily: 'var(--font-maru)' }}>
                  Gõ romaji tự chuyển Hiragana
                </span>
              </div>
              <input
                type="text"
                value={reading}
                onChange={handleReadingChange}
                placeholder="Ví dụ: りょうしん (hoặc ryoushin)"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Ý nghĩa tiếng Việt <span style={{ color: '#9E3223' }}>*</span>
              </label>
              <input
                type="text"
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                placeholder="Ví dụ: Bố mẹ, cha mẹ (song thân)"
                required
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Loại thẻ</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  style={inputStyle}
                >
                  <option value="Vocab">Từ vựng (Vocab)</option>
                  <option value="Kanji">Hán tự (Kanji)</option>
                  <option value="GrammarPattern">Ngữ pháp (Grammar)</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Bộ thẻ (Deck)</label>
                <select
                  value={deckId}
                  onChange={(e) => setDeckId(e.target.value)}
                  style={inputStyle}
                >
                  <option value="deck_jpd133">JPD133 - Từ vựng Kotoba</option>
                  <option value="deck_jpd133_kanji">JPD133 - Hán Tự (Kanji)</option>
                  <option value="grammar_jpd133">JPD133 - Ngữ pháp Bunbou</option>
                  <option value="deck_n5">JLPT N5 - Cốt lõi</option>
                </select>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={labelStyle}>Câu ví dụ ngữ cảnh (i+1)</label>
                <button
                  type="button"
                  onClick={handleAddCloze}
                  style={{
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-maru)',
                    fontWeight: 700,
                    padding: '0.2rem 0.55rem',
                    background: '#EDF2F7',
                    border: '1px solid #BDCCDC',
                    borderRadius: '6px',
                    color: '#16253B',
                    cursor: 'pointer',
                  }}
                >
                  + Đục lỗ Cloze c1
                </button>
              </div>
              <textarea
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
                placeholder="Ví dụ: 私の両親はハノイに住んでいます。"
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-torii"
              style={{
                padding: '0.85rem',
                fontSize: '1rem',
                fontWeight: 700,
                marginTop: '0.5rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? 'Đang lưu vào kho FSRS...' : 'Lưu thẻ bài vào hệ thống ➔'}
            </button>
          </form>

          {/* CỘT PHẢI: LIVE TANZAKU SIMULATOR PREVIEW (45%) */}
          <div
            style={{
              background: '#FAF8F5',
              border: '1.5px solid #E6DDCF',
              borderRadius: '20px',
              padding: '2rem 1.75rem',
              boxShadow: '0 8px 24px rgba(22, 37, 59, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mincho)',
                  fontWeight: 800,
                  color: '#8C6B3E',
                  letterSpacing: '0.06em',
                }}
              >
                MÔ PHỎNG THẺ THỰC TẾ (TANZAKU PREVIEW)
              </span>

              <button
                type="button"
                onClick={() => setIsFlipped(!isFlipped)}
                style={{
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-maru)',
                  fontWeight: 700,
                  padding: '0.25rem 0.65rem',
                  borderRadius: '6px',
                  background: '#FAF6EE',
                  border: '1px solid #D8CFC0',
                  color: '#16253B',
                  cursor: 'pointer',
                }}
              >
                {isFlipped ? 'Xem Mặt Trước ➔' : 'Xem Mặt Sau ➔'}
              </button>
            </div>

            {/* Mô phỏng thẻ Karuta */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              style={{
                width: '100%',
                minHeight: '340px',
                background: '#FFFFFF',
                borderRadius: '16px',
                border: isFlipped ? '2px solid #386641' : '2px solid #AF7E36',
                boxShadow: '0 12px 28px rgba(22, 37, 59, 0.08)',
                padding: '2rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                position: 'relative',
                transition: 'border-color 0.3s ease',
              }}
            >
              {/* Con dấu son Hanko góc trên */}
              <div
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mincho)',
                  fontWeight: 800,
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  background: isFlipped ? '#386641' : '#9E3223',
                  color: '#FFFFFF',
                }}
              >
                {isFlipped ? 'Mặt Sau' : 'Mặt Trước'}
              </div>

              {!isFlipped ? (
                // MẶT TRƯỚC
                <div>
                  {reading && (
                    <div style={{ fontSize: '1rem', color: '#9E3223', fontFamily: 'var(--font-maru)', fontWeight: 700, marginBottom: '0.25rem' }}>
                      {reading}
                    </div>
                  )}
                  <div
                    style={{
                      fontFamily: 'var(--font-mincho)',
                      fontSize: '3rem',
                      fontWeight: 900,
                      color: '#16253B',
                      marginBottom: '0.75rem',
                      lineHeight: 1.1,
                    }}
                  >
                    {front || 'Chữ Hán / Từ vựng'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#786A5E', fontFamily: 'var(--font-maru)' }}>
                    (Nhấp chuột để lật mở mặt sau)
                  </div>
                </div>
              ) : (
                // MẶT SAU
                <div style={{ width: '100%' }}>
                  <div style={{ fontSize: '0.88rem', color: '#9E3223', fontFamily: 'var(--font-maru)', fontWeight: 700, marginBottom: '0.2rem' }}>
                    {reading}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mincho)', fontSize: '2.2rem', fontWeight: 900, color: '#16253B', marginBottom: '0.75rem' }}>
                    {front}
                  </div>

                  <div
                    style={{
                      padding: '0.85rem',
                      background: '#FAF8F5',
                      borderRadius: '10px',
                      borderLeft: '4px solid #386641',
                      marginBottom: '0.75rem',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', color: '#786A5E', marginBottom: '0.2rem' }}>NGHĨA TIẾNG VIỆT:</div>
                    <div style={{ fontFamily: 'var(--font-maru)', fontSize: '1.05rem', color: '#16253B', fontWeight: 700 }}>
                      {meaning || 'Ý nghĩa tiếng Việt...'}
                    </div>
                  </div>

                  {sentence && (
                    <div
                      style={{
                        padding: '0.75rem',
                        background: '#EDF2F7',
                        borderRadius: '8px',
                        textAlign: 'left',
                        fontSize: '0.85rem',
                        color: '#16253B',
                      }}
                    >
                      <div style={{ fontSize: '0.72rem', color: '#786A5E' }}>VÍ DỤ NGỮ CẢNH:</div>
                      <div>{sentence}</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <p style={{ fontSize: '0.78rem', color: '#786A5E', marginTop: '1rem', textAlign: 'center', fontFamily: 'var(--font-maru)' }}>
              Thẻ tạo xong sẽ được tự động đồng bộ vào hàng đợi FSRS và phân phối theo chu kỳ nhớ lặp lại.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.85rem',
  fontFamily: 'var(--font-maru)',
  fontWeight: 700,
  color: '#16253B',
  marginBottom: '0.4rem',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.65rem 0.85rem',
  borderRadius: '8px',
  border: '1.2px solid #D8CFC0',
  background: '#FAF8F5',
  fontSize: '0.92rem',
  color: '#16253B',
  outline: 'none',
  fontFamily: 'var(--font-maru)',
};
