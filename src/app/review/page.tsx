'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ToriiIcon, SensuFanIcon } from '@/components/japanese/Icons';
import { PitchAccentGraph } from '@/components/japanese/PitchAccentGraph';
import { JapaneseSpeakerButton } from '@/components/japanese/JapaneseSpeakerButton';
import { japaneseAudio } from '@/components/japanese/AudioEffects';
import { DarumaMascot } from '@/components/japanese/DarumaMascot';

/**
 * Giao diện Ôn tập Thẻ bài Karuta (Active Recall & FSRS Rating)
 * Tích hợp Phím tắt thông minh, Âm thanh Phù Tang & Đồ thị Cao độ Pitch Accent
 */
export default function ReviewPage() {
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const totalCards = 15;

  // Mock cards cho phiên ôn tập
  const cardList = [
    {
      id: 'c1',
      kanji: '勉強',
      furigana: 'べんきょう',
      meaning: 'Học tập, siêng năng trau dồi tri thức',
      pitchPattern: 0,
      pitchText: '0 (Heiban - 平板型)',
      sentence: '毎日日本語を熱心に勉強します。',
      sentenceMeaning: 'Mỗi ngày tôi đều chăm chỉ học tiếng Nhật.',
    },
    {
      id: 'c2',
      kanji: '桜',
      furigana: 'さくら',
      meaning: 'Hoa anh đào - Quốc hoa xứ Phù Tang',
      pitchPattern: 0,
      pitchText: '0 (Heiban - 平板型)',
      sentence: '春になると美しい桜が咲きます。',
      sentenceMeaning: 'Khi mùa xuân đến, những bông hoa anh đào tuyệt đẹp nở rộ.',
    },
    {
      id: 'c3',
      kanji: '猫',
      furigana: 'ねこ',
      meaning: 'Con mèo',
      pitchPattern: 1,
      pitchText: '1 (Atamadaka - 頭高型)',
      sentence: '庭で可愛い猫が寝ています。',
      sentenceMeaning: 'Chú mèo đáng yêu đang ngủ ngoài vườn.',
    },
  ];

  const currentCard = cardList[(currentIdx - 1) % cardList.length];

  const handleReveal = useCallback(() => {
    setShowAnswer(true);
    japaneseAudio.speak(currentCard.kanji);
  }, [currentCard.kanji]);

  const handleGrade = useCallback(
    async (grade: 'Again' | 'Hard' | 'Good' | 'Easy') => {
      // Âm thanh văn hóa phản hồi tức thì
      if (grade === 'Again' || grade === 'Hard') {
        japaneseAudio.playHyoshigi(); // Tiếng phách gỗ Kabuki nhắc nhở
      } else if (grade === 'Good') {
        japaneseAudio.playKotoPluck(); // Tiếng đàn tranh Koto thanh thoát
      } else {
        japaneseAudio.playSuzuBell(); // Tiếng chuông đền Suzu ngân vang
      }

      console.log(`Đã chấm điểm thẻ ${currentCard.id} là: ${grade}`);

      // Gửi kết quả đánh giá thẻ tới backend API
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
      if (currentIdx >= totalCards) {
        setIsCompleted(true);
        japaneseAudio.playSuzuBell();
      } else {
        setCurrentIdx((prev) => prev + 1);
      }
    },
    [currentCard.id, currentIdx, totalCards]
  );

  // Lắng nghe Phím tắt: Phím Cách (Space) để lật, 1-4 để đánh giá
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space' && !showAnswer) {
        e.preventDefault();
        handleReveal();
      } else if (showAnswer) {
        if (e.key === '1') handleGrade('Again');
        if (e.key === '2') handleGrade('Hard');
        if (e.key === '3') handleGrade('Good');
        if (e.key === '4') handleGrade('Easy');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAnswer, handleReveal, handleGrade]);

  const progressPercent = Math.round((currentIdx / totalCards) * 100);

  // MÀN HÌNH CHÚC MỪNG KHI HOÀN THÀNH PHIÊN ÔN TẬP
  if (isCompleted) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <div
          className="card-karuta"
          style={{
            padding: '3rem 2rem',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F9ED 100%)',
            border: '2px solid var(--matcha-primary)',
          }}
        >
          <DarumaMascot progressPercentage={100} size={96} />

          <h2
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: '2rem',
              fontWeight: 800,
              color: 'var(--sumi-ink)',
              marginTop: '1.5rem',
              marginBottom: '0.5rem',
            }}
          >
            お疲れ様でした！
          </h2>
          <p style={{ fontFamily: 'var(--font-maru)', fontSize: '1.1rem', color: 'var(--matcha-deep)', fontWeight: 700 }}>
            Bạn đã hoàn thành xuất sắc {totalCards} thẻ hôm nay!
          </p>
          <p style={{ color: 'var(--sumi-faded)', fontSize: '0.9rem', marginTop: '0.5rem', marginBottom: '2rem' }}>
            Búp bê Daruma đã khai mở trọn vẹn hai mắt. Lịch ôn tập ngắt quãng FSRS đã được cập nhật thành công.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/" className="btn-torii">
              🏯 Về trang Tổng quan
            </Link>
            <button
              onClick={() => {
                setCurrentIdx(1);
                setIsCompleted(false);
              }}
              className="btn-washi"
            >
              🔄 Ôn tập lại thêm một lượt
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
          minHeight: '360px',
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
            opacity: 0.85,
          }}
        >
          {showAnswer ? '解答' : '出題'}
        </div>

        {/* MẶT TRƯỚC: CHỮ KANJI THƯ PHÁP LỚN */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: '4.25rem',
              fontWeight: 800,
              color: 'var(--sumi-ink)',
              letterSpacing: '0.05em',
            }}
          >
            {currentCard.kanji}
          </div>
          <JapaneseSpeakerButton text={currentCard.kanji} size={22} />
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
              gap: '1rem',
              alignItems: 'center',
              animation: 'fadeIn 0.3s ease forwards',
            }}
          >
            {/* Đồ thị cao độ ngữ âm Tokyo Pitch Accent */}
            <div
              style={{
                background: 'var(--washi-bg)',
                padding: '0.75rem 1.25rem',
                borderRadius: '10px',
                border: '1px solid var(--washi-border-soft)',
              }}
            >
              <PitchAccentGraph
                reading={currentCard.furigana}
                pattern={currentCard.pitchPattern}
              />
            </div>

            {/* Ý nghĩa tiếng Việt */}
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--sumi-ink)' }}>
              {currentCard.meaning}
            </div>

            {/* Câu ví dụ ngữ cảnh i+1 */}
            <div
              style={{
                width: '100%',
                background: 'var(--washi-bg)',
                padding: '0.85rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid var(--washi-border-soft)',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.1rem', color: 'var(--sumi-charcoal)' }}>
                  {currentCard.sentence}
                </p>
                <JapaneseSpeakerButton text={currentCard.sentence} size={16} />
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--sumi-faded)', marginTop: '0.25rem' }}>
                {currentCard.sentenceMeaning}
              </p>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: '0.9rem', color: 'var(--sumi-faded)', fontFamily: 'var(--font-maru)', marginTop: '0.5rem' }}>
            Tự gợi nhớ lại cách đọc và ý nghĩa trước khi xem đáp án <br />
            <kbd style={{ padding: '0.15rem 0.45rem', background: '#F1EDE6', borderRadius: '4px', fontSize: '0.8rem' }}>
              Phím Space
            </kbd>{' '}
            để lật thẻ
          </p>
        )}
      </div>

      {/* KHU VỰC NÚT TƯƠNG TÁC ACTIVE RECALL */}
      {!showAnswer ? (
        <button
          onClick={handleReveal}
          className="btn-torii"
          style={{
            width: '100%',
            padding: '1.1rem',
            fontSize: '1.1rem',
            boxShadow: '0 8px 24px rgba(217, 56, 30, 0.35)',
          }}
        >
          <SensuFanIcon size={22} color="#FFFFFF" />
          Khám phá đáp án (Space)
        </button>
      ) : (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '0.75rem' }}>
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
              <span style={{ fontFamily: 'var(--font-mincho)', fontWeight: 800, fontSize: '1.1rem' }}>再 (1)</span>
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
              <span style={{ fontFamily: 'var(--font-mincho)', fontWeight: 800, fontSize: '1.1rem' }}>難 (2)</span>
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
              <span style={{ fontFamily: 'var(--font-mincho)', fontWeight: 800, fontSize: '1.1rem' }}>良 (3)</span>
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
              <span style={{ fontFamily: 'var(--font-mincho)', fontWeight: 800, fontSize: '1.1rem' }}>易 (4)</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--sumi-faded)' }}>~ 7.0 ngày</span>
            </button>
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--sumi-faded)' }}>
            💡 Mẹo: Nhấn phím số <strong>1</strong>, <strong>2</strong>, <strong>3</strong>, <strong>4</strong> trên bàn phím để chấm điểm nhanh
          </p>
        </div>
      )}
    </div>
  );
}
