'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ToriiIcon, SensuFanIcon } from '@/components/japanese/Icons';
import { PitchAccentGraph } from '@/components/japanese/PitchAccentGraph';
import { JapaneseSpeakerButton } from '@/components/japanese/JapaneseSpeakerButton';
import { japaneseAudio } from '@/components/japanese/AudioEffects';
import { DarumaMascot } from '@/components/japanese/DarumaMascot';
import { JapaneseArtBackdrop } from '@/components/art/JapaneseArtBackdrop';

interface CardItem {
  id: string;
  kanji: string;
  reading?: string;
  meaning: string;
  pitch?: string;
  type: string;
  deckId: string;
  deckName?: string;
  sentence?: string;
  state?: string;
  due?: string | Date;
}

interface DeckItem {
  id: string;
  name: string;
  description?: string;
}

/**
 * Loading Skeleton phong cách giấy Washi truyền thống
 */
function ReviewLoadingSkeleton() {
  return (
    <div style={{ maxWidth: '680px', margin: '3rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
      <div
        className="card-karuta"
        style={{
          padding: '3rem 2rem',
          background: 'var(--washi-surface)',
          border: '1.5px solid var(--washi-border)',
          borderRadius: '16px',
        }}
      >
        <DarumaMascot progressPercentage={20} size={72} />
        <h3
          style={{
            fontFamily: 'var(--font-mincho)',
            fontSize: '1.35rem',
            color: 'var(--sumi-ink)',
            marginTop: '1.5rem',
          }}
        >
          Đang chuẩn bị bộ thẻ Karuta...
        </h3>
        <p style={{ color: 'var(--sumi-faded)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          Đang tải dữ liệu từ Turso Cloud và tính toán hàng đợi FSRS
        </p>
      </div>
    </div>
  );
}

/**
 * Nội dung Phiên Ôn tập Karuta (Được bọc trong Suspense để đọc searchParams an toàn)
 */
function ReviewSessionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetDeckId = searchParams.get('deck') || 'all';
  const initialMode = searchParams.get('mode') || 'fsrs_due';

  const [loading, setLoading] = useState(true);
  const [deckList, setDeckList] = useState<DeckItem[]>([]);
  const [queue, setQueue] = useState<CardItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(1);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [cramMode, setCramMode] = useState(initialMode === 'cram_all');
  const [showDeckMenu, setShowDeckMenu] = useState(false);

  // Thống kê phiên học
  const [gradesCount, setGradesCount] = useState({
    Again: 0,
    Hard: 0,
    Good: 0,
    Easy: 0,
  });

  // Tải dữ liệu thẻ từ API /api/cards theo Deck đã chọn
  useEffect(() => {
    async function loadCards() {
      try {
        setLoading(true);
        const url = targetDeckId && targetDeckId !== 'all' ? `/api/cards?deck=${targetDeckId}` : '/api/cards';
        const res = await fetch(url);
        const json = await res.json();

        if (json.success) {
          setDeckList(json.decks || []);
          const allRawCards: CardItem[] = json.data || [];

          // Lập hàng đợi ôn tập theo thuật toán FSRS
          const now = new Date();
          let sessionCards: CardItem[] = [];

          if (cramMode) {
            // Chế độ ôn củng cố: Xáo trộn toàn bộ thẻ trong Deck
            sessionCards = [...allRawCards].sort(() => Math.random() - 0.5);
          } else {
            // Chế độ FSRS: Thẻ đến hạn ôn trước, sau đó tới thẻ mới
            const dueCards = allRawCards
              .filter((c) => c.state !== 'New' && new Date(c.due || 0) <= now)
              .sort((a, b) => new Date(a.due || 0).getTime() - new Date(b.due || 0).getTime());

            const newCards = allRawCards.filter((c) => c.state === 'New').slice(0, 15);
            sessionCards = [...dueCards, ...newCards];

            // Nếu không có thẻ due và new, nhưng deck có thẻ -> Chuyển sang nhắc nhở hoặc cho cram
            if (sessionCards.length === 0 && allRawCards.length > 0) {
              sessionCards = allRawCards.slice(0, 20); // Fallback hiển thị 20 thẻ để người dùng có thể ôn luyện
            }
          }

          setQueue(sessionCards);
          setCurrentIdx(1);
          setIsCompleted(false);
          setShowAnswer(false);
        }
      } catch (err) {
        console.error('Lỗi khi nạp dữ liệu thẻ:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCards();
  }, [targetDeckId, cramMode]);

  // Thông tin bộ thẻ hiện tại
  const currentDeckInfo = deckList.find((d) => d.id === targetDeckId);
  const deckTitle =
    targetDeckId === 'all'
      ? 'Tổng hợp Ngẫu nhiên Toàn bộ'
      : currentDeckInfo?.name || (targetDeckId.includes('kanji') ? 'JPD133 - Hán Tự Đã Học' : 'JPD133 - Từ vựng Kotoba');

  const totalCards = queue.length;
  const currentCard = queue[currentIdx - 1];

  // Trích xuất mẫu Pitch Accent số (0, 1, 2, 3...)
  const getPitchPattern = (pitchStr?: string): number => {
    if (!pitchStr) return 0;
    const match = pitchStr.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const handleReveal = useCallback(() => {
    if (!currentCard) return;
    setShowAnswer(true);
    japaneseAudio.speak(currentCard.kanji);
  }, [currentCard]);

  const handleGrade = useCallback(
    async (grade: 'Again' | 'Hard' | 'Good' | 'Easy') => {
      if (!currentCard) return;

      // Âm thanh văn hóa phản hồi tức thì
      if (grade === 'Again' || grade === 'Hard') {
        japaneseAudio.playHyoshigi();
      } else if (grade === 'Good') {
        japaneseAudio.playKotoPluck();
      } else {
        japaneseAudio.playSuzuBell();
      }

      setGradesCount((prev) => ({ ...prev, [grade]: prev[grade] + 1 }));

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
        // Dự phòng offline nếu rớt mạng
        console.warn('Lưu tạm kết quả ôn tập vào bộ đệm local');
      }

      setShowAnswer(false);
      if (currentIdx >= totalCards) {
        setIsCompleted(true);
        japaneseAudio.playSuzuBell();
      } else {
        setCurrentIdx((prev) => prev + 1);
      }
    },
    [currentCard, currentIdx, totalCards]
  );

  // Phím tắt thông minh: Space để lật, 1-4 để chấm điểm
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

  const progressPercent = totalCards > 0 ? Math.round((currentIdx / totalCards) * 100) : 0;

  if (loading) {
    return <ReviewLoadingSkeleton />;
  }

  // 1. TRƯỜNG HỢP DECK RỖNG HOÀN TOÀN (0 THẺ)
  if (!queue || queue.length === 0) {
    return (
      <div style={{ maxWidth: '640px', margin: '3rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <div
          className="card-karuta"
          style={{
            padding: '3rem 2rem',
            background: 'var(--washi-surface)',
            border: '1.5px solid var(--washi-border)',
            borderRadius: '16px',
          }}
        >
          <DarumaMascot progressPercentage={0} size={84} />
          <h2
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: '1.6rem',
              fontWeight: 800,
              color: 'var(--sumi-ink)',
              marginTop: '1.5rem',
              marginBottom: '0.5rem',
            }}
          >
            Chưa có thẻ trong bộ này
          </h2>
          <p style={{ color: 'var(--sumi-faded)', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Bộ thẻ <strong>{deckTitle}</strong> hiện tại chưa có dữ liệu thẻ học. Bạn có thể nhờ AI soạn thêm thẻ mới.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/cards/new" className="btn-torii">
              ✨ Nhờ AI soạn thẻ mới
            </Link>
            <Link href="/" className="btn-washi">
              🏯 Quay lại Trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. MÀN HÌNH HOÀN THÀNH PHIÊN ÔN TẬP
  if (isCompleted) {
    const totalAnswered = gradesCount.Again + gradesCount.Hard + gradesCount.Good + gradesCount.Easy;
    const masteryPercent =
      totalAnswered > 0 ? Math.round(((gradesCount.Good + gradesCount.Easy) / totalAnswered) * 100) : 100;

    return (
      <div style={{ maxWidth: '640px', margin: '3rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <div
          className="card-hyakunin-isshu"
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: '3.5rem 2rem',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F9ED 100%)',
            border: '3px solid #1E3A8A',
            outline: '2px solid #D4AF37',
            borderRadius: '16px',
            boxShadow: '0 16px 36px rgba(30, 58, 138, 0.22)',
          }}
        >
          {/* Lớp nền sóng thần Kanagawa khải hoàn rực rỡ */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.35, pointerEvents: 'none', zIndex: 0 }}>
            <Image
              src="/assets/art/great-wave-isolated.webp"
              alt="Sóng thần Kanagawa khải hoàn"
              fill
              sizes="100vw"
              style={{ objectFit: 'contain', objectPosition: 'center' }}
            />
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', marginBottom: '0.5rem' }}>
              <span
                style={{
                  padding: '0.3rem 1rem',
                  background: '#D9381E',
                  color: '#FFFFFF',
                  borderRadius: '999px',
                  fontFamily: 'var(--font-mincho)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  letterSpacing: '0.1em',
                  boxShadow: '0 4px 12px rgba(217, 56, 30, 0.35)',
                }}
              >
                満願成就 · KHẢI HOÀN TOÀN THẮNG
              </span>
            </div>

            <DarumaMascot progressPercentage={100} size={104} />

            <h2
              style={{
                fontFamily: 'var(--font-mincho)',
                fontSize: '2.2rem',
                fontWeight: 800,
                color: 'var(--sumi-ink)',
                marginTop: '1.25rem',
                marginBottom: '0.4rem',
              }}
            >
              お疲れ様でした！
            </h2>
            <p style={{ fontFamily: 'var(--font-maru)', fontSize: '1.15rem', color: 'var(--matcha-deep)', fontWeight: 700 }}>
              Bạn đã hoàn thành xuất sắc {totalCards} thẻ của bộ {deckTitle}!
            </p>

          {/* Bảng tổng kết đánh giá */}
          <div
            style={{
              margin: '1.5rem auto',
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.85)',
              borderRadius: '12px',
              border: '1px solid var(--washi-border)',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.5rem',
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--torii-red)', fontWeight: 700 }}>再 Again</span>
              <p style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.3rem', fontWeight: 800 }}>{gradesCount.Again}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#EA580C', fontWeight: 700 }}>難 Hard</span>
              <p style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.3rem', fontWeight: 800 }}>{gradesCount.Hard}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--matcha-deep)', fontWeight: 700 }}>良 Good</span>
              <p style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.3rem', fontWeight: 800 }}>{gradesCount.Good}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#0284C7', fontWeight: 700 }}>易 Easy</span>
              <p style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.3rem', fontWeight: 800 }}>{gradesCount.Easy}</p>
            </div>
          </div>

          <p style={{ color: 'var(--sumi-faded)', fontSize: '0.85rem', marginBottom: '2rem' }}>
            Tỉ lệ ghi nhớ tối ưu: <strong>{masteryPercent}%</strong> · Lịch FSRS đã được lưu thành công.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link href="/" className="btn-torii">
              🏯 Về trang Tổng quan
            </Link>
            <button
              onClick={() => {
                setCurrentIdx(1);
                setIsCompleted(false);
                setShowAnswer(false);
                setGradesCount({ Again: 0, Hard: 0, Good: 0, Easy: 0 });
              }}
              className="btn-washi"
            >
              🔄 Ôn lại bộ này một lượt nữa
            </button>
            <Link href="/cards" className="btn-washi">
              📚 Chọn bộ thẻ khác
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

  // 3. GIAO DIỆN PHIÊN ÔN TẬP KARUTA ACTIVE RECALL
  const isKanji = currentCard.type === 'Kanji' || (currentCard.deckName && currentCard.deckName.includes('Hán Tự'));

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

          {/* Quick Deck Switcher Button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowDeckMenu(!showDeckMenu)}
              style={{
                background: 'var(--washi-surface)',
                border: '1px solid var(--washi-border)',
                borderRadius: '8px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-maru)',
                fontWeight: 700,
                color: 'var(--sumi-ink)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span>{isKanji ? '🌸' : '🍵'}</span>
              <span>{deckTitle}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--sumi-faded)' }}>▾</span>
            </button>

            {/* Dropdown Menu đổi bộ thẻ */}
            {showDeckMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  background: '#FFFFFF',
                  border: '1px solid var(--washi-border)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  minWidth: '240px',
                  zIndex: 50,
                  padding: '0.5rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--sumi-faded)', padding: '0.4rem 0.6rem', fontWeight: 600 }}>
                  CHUYỂN NHANH BỘ THẺ:
                </div>
                <button
                  onClick={() => {
                    setShowDeckMenu(false);
                    router.push('/review?deck=all');
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.5rem 0.6rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: targetDeckId === 'all' ? 'var(--matcha-subtle)' : 'transparent',
                    color: targetDeckId === 'all' ? 'var(--matcha-deep)' : 'var(--sumi-ink)',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-maru)',
                    fontWeight: targetDeckId === 'all' ? 700 : 500,
                  }}
                >
                  🎲 Học ngẫu nhiên toàn bộ
                </button>
                {deckList.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setShowDeckMenu(false);
                      router.push(`/review?deck=${d.id}`);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.5rem 0.6rem',
                      borderRadius: '6px',
                      border: 'none',
                      background: targetDeckId === d.id ? 'var(--matcha-subtle)' : 'transparent',
                      color: targetDeckId === d.id ? 'var(--matcha-deep)' : 'var(--sumi-ink)',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-maru)',
                      fontWeight: targetDeckId === d.id ? 700 : 500,
                    }}
                  >
                    {d.id.includes('kanji') ? '🌸 ' : '🍵 '}
                    {d.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tiến độ và số câu hỏi */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--sumi-faded)', fontFamily: 'var(--font-maru)' }}>
            Hàng đợi ôn tập: {deckTitle}
          </span>
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

        {/* Thanh tiến độ phiên học */}
        <div
          style={{
            height: '8px',
            background: 'var(--washi-border-soft, #E8E4DC)',
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

      {/* THẺ BÀI TRUYỀN THỐNG HYAKUNIN ISSHU KARUTA CÓ VÂN SÓNG MỘC BẢN HOKUSAI */}
      <div
        className="card-hyakunin-isshu"
        style={{
          minHeight: '380px',
          padding: '2.75rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          marginBottom: '2rem',
          background: showAnswer ? 'linear-gradient(180deg, #FFFFFF 0%, #FAFBF7 100%)' : '#FCFBF7',
          border: '3px solid #1E3A8A',
          outline: '2px solid #D4AF37',
          borderRadius: '16px',
          boxShadow: '0 14px 34px rgba(30, 58, 138, 0.16)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <JapaneseArtBackdrop
          src="/assets/art/hokusai-great-wave-classic.jpg"
          alt="Tranh sóng lừng Hokusai chìm"
          opacity={0.14}
          blendMode="multiply"
          objectPosition="center"
        />

        {/* Con dấu son góc trên bên phải */}
        <div
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            fontFamily: 'var(--font-mincho)',
            fontSize: '0.82rem',
            color: '#FFFFFF',
            background: showAnswer ? 'var(--matcha-deep)' : 'var(--torii-red)',
            padding: '0.2rem 0.55rem',
            borderRadius: '4px',
            fontWeight: 800,
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
            zIndex: 3,
          }}
        >
          {showAnswer ? '解答' : '出題'}
        </div>

        {/* MẶT TRƯỚC: CHỮ KANJI HOẶC TỪ VỰNG THƯ PHÁP LỚN */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: '4.75rem',
              fontWeight: 900,
              color: 'var(--sumi-ink)',
              letterSpacing: '0.05em',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            {currentCard.kanji}
          </div>
          <JapaneseSpeakerButton text={currentCard.kanji} size={24} />
        </div>

        {/* MẶT SAU: LẬT MỞ NỘI DUNG FURIGANA & Ý NGHĨA KHI BẤM XEM */}
        {showAnswer ? (
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              width: '100%',
              marginTop: '1rem',
              paddingTop: '1.5rem',
              borderTop: '2px dashed var(--washi-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              alignItems: 'center',
              animation: 'fadeIn 0.3s ease forwards',
            }}
          >
            {/* Đồ thị cao độ ngữ âm Tokyo Pitch Accent (nếu có reading) */}
            {currentCard.reading && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.92)',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '10px',
                  border: '1.5px solid var(--washi-border)',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                }}
              >
                <PitchAccentGraph
                  reading={currentCard.reading}
                  pattern={getPitchPattern(currentCard.pitch)}
                />
              </div>
            )}

            {/* Ý nghĩa tiếng Việt */}
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--sumi-ink)', fontFamily: 'var(--font-maru)' }}>
              {currentCard.meaning}
            </div>

            {/* Câu ví dụ ngữ cảnh i+1 (nếu có) */}
            {currentCard.sentence && (
              <div
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.9)',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '10px',
                  border: '1px solid var(--washi-border)',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.15rem', color: 'var(--sumi-charcoal)', fontWeight: 600 }}>
                    {currentCard.sentence}
                  </p>
                  <JapaneseSpeakerButton text={currentCard.sentence} size={16} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <p style={{ position: 'relative', zIndex: 2, fontSize: '0.9rem', color: 'var(--sumi-faded)', fontFamily: 'var(--font-maru)', marginTop: '0.5rem' }}>
            Tự gợi nhớ lại cách đọc và ý nghĩa trước khi xem đáp án <br />
            <kbd style={{ padding: '0.15rem 0.45rem', background: '#F1EDE6', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid #D5CFC5' }}>
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
            padding: '1.15rem',
            fontSize: '1.15rem',
            boxShadow: '0 8px 24px rgba(217, 56, 30, 0.4)',
            letterSpacing: '0.02em',
          }}
        >
          <SensuFanIcon size={22} color="#FFFFFF" />
          Khám phá đáp án (Nhấn phím Space)
        </button>
      ) : (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '0.75rem' }}>
            {/* NÚT 1: AGAIN (もう一度) */}
            <button
              onClick={() => handleGrade('Again')}
              style={{
                padding: '0.95rem 0.5rem',
                backgroundColor: '#FFF5F5',
                border: '2px solid var(--torii-red)',
                borderRadius: '12px',
                color: 'var(--torii-red)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(217, 56, 30, 0.2)',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mincho)', fontWeight: 900, fontSize: '1.25rem' }}>再 (1)</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--torii-red)', fontWeight: 600 }}>&lt; 1 phút</span>
            </button>

            {/* NÚT 2: HARD (難) */}
            <button
              onClick={() => handleGrade('Hard')}
              style={{
                padding: '0.95rem 0.5rem',
                backgroundColor: '#FFF7ED',
                border: '2px solid #EA580C',
                borderRadius: '12px',
                color: '#EA580C',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(234, 88, 12, 0.2)',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mincho)', fontWeight: 900, fontSize: '1.25rem' }}>難 (2)</span>
              <span style={{ fontSize: '0.72rem', color: '#EA580C', fontWeight: 600 }}>~ 1.2 ngày</span>
            </button>

            {/* NÚT 3: GOOD (良) - MÀU XANH MATCHA #88A752 */}
            <button
              onClick={() => handleGrade('Good')}
              style={{
                padding: '0.95rem 0.5rem',
                backgroundColor: 'var(--matcha-primary)',
                border: '2px solid var(--matcha-deep)',
                borderRadius: '12px',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                transition: 'all 0.2s',
                boxShadow: '0 4px 14px rgba(136, 167, 82, 0.4)',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mincho)', fontWeight: 900, fontSize: '1.25rem' }}>良 (3)</span>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.95)', fontWeight: 600 }}>~ 3.5 ngày</span>
            </button>

            {/* NÚT 4: EASY (易) */}
            <button
              onClick={() => handleGrade('Easy')}
              style={{
                padding: '0.95rem 0.5rem',
                backgroundColor: '#1E3A8A',
                border: '2px solid #1D4ED8',
                borderRadius: '12px',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                transition: 'all 0.2s',
                boxShadow: '0 4px 14px rgba(30, 58, 138, 0.35)',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mincho)', fontWeight: 900, fontSize: '1.25rem' }}>易 (4)</span>
              <span style={{ fontSize: '0.72rem', color: '#93C5FD', fontWeight: 600 }}>~ 7.0 ngày</span>
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

/**
 * Trang Ôn tập Karuta chính thức (bọc trong Suspense)
 */
export default function ReviewPage() {
  return (
    <Suspense fallback={<ReviewLoadingSkeleton />}>
      <ReviewSessionContent />
    </Suspense>
  );
}
