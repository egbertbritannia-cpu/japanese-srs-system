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
import { useFsrsScheduler } from '@/hooks/useFsrsScheduler';
import { createEmptyCard, Rating, type Card, type RecordLog } from 'ts-fsrs';
import {
  cacheCardsLocally,
  getOfflineCards,
  recordPendingReview,
  getUnsyncedReviewCount,
  syncPendingReviewsToServer,
} from '@/lib/offline-db';
import { JapaneseAudioPool } from '@/lib/audio-pool';

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
  due?: string | number | Date;
  stability?: number;
  difficulty?: number;
  reps?: number;
  lapses?: number;
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
    <div style={{ maxWidth: '640px', margin: '3rem auto', padding: '0 1.25rem', textAlign: 'center' }}>
      <div
        className="card-karuta"
        style={{
          padding: '3rem 2rem',
          background: '#FAF7F2',
          border: '1.5px solid #E4DAC9',
          borderRadius: '18px',
          boxShadow: '0 8px 24px rgba(18, 36, 56, 0.06)',
        }}
      >
        <DarumaMascot progressPercentage={25} size={72} />
        <h3
          style={{
            fontFamily: 'var(--font-mincho)',
            fontSize: '1.35rem',
            color: '#122438',
            marginTop: '1.5rem',
          }}
        >
          Đang chuẩn bị bộ thẻ Karuta...
        </h3>
        <p style={{ color: '#786A5E', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          Đang tải dữ liệu và tối ưu hóa hàng đợi FSRS
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

  const { calculateNextReview, isReady: isWorkerReady } = useFsrsScheduler();
  const [fsrsNextStates, setFsrsNextStates] = useState<RecordLog | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [unsyncedCount, setUnsyncedCount] = useState(0);

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

  // Tải dữ liệu thẻ từ API /api/cards theo Deck đã chọn với cơ chế Offline Fallback
  useEffect(() => {
    async function loadCards() {
      try {
        setLoading(true);
        const url = targetDeckId && targetDeckId !== 'all' ? `/api/cards?deck=${targetDeckId}&limit=1000` : '/api/cards?limit=1000';
        let rawCards: CardItem[] = [];
        let fetchedDecks: DeckItem[] = [];

        try {
          const res = await fetch(url);
          const data = await res.json();

          if (data.success) {
            rawCards = data.data || [];
            fetchedDecks = data.decks || [];
            setIsOffline(false);

            // Nạp thẻ vào bộ nhớ ngoại tuyến IndexedDB (Dexie.js)
            if (rawCards.length > 0) {
              cacheCardsLocally(
                rawCards.map((c) => ({
                  id: c.id,
                  front: c.kanji,
                  reading: c.reading,
                  meaning: c.meaning,
                  deckId: c.deckId,
                  deckName: c.deckName,
                  type: c.type,
                  sentence: c.sentence,
                  pitch: c.pitch,
                  state: c.state,
                  due: c.due,
                  stability: c.stability,
                  difficulty: c.difficulty,
                }))
              );
            }
          }
        } catch (fetchErr) {
          console.warn('[Review] API không phản hồi hoặc mất mạng, tự động nạp từ IndexedDB ngoại tuyến:', fetchErr);
          setIsOffline(true);
          const localCards = await getOfflineCards(targetDeckId);
          rawCards = localCards.map((c) => ({
            id: c.id,
            kanji: c.front,
            reading: c.reading,
            meaning: c.meaning,
            pitch: c.pitch,
            type: c.type || 'vocab',
            deckId: c.deckId,
            deckName: c.deckName,
            sentence: c.sentence,
            state: c.state,
            due: c.due ? new Date(c.due) : undefined,
            stability: c.stability,
            difficulty: c.difficulty,
          }));
        }

        setDeckList(fetchedDecks);

        let studyCards: CardItem[] = [];
        if (cramMode) {
          studyCards = rawCards;
        } else {
          const now = new Date();
          const dueCards = rawCards.filter((c) => {
            if (!c.due) return true;
            return new Date(c.due) <= now;
          });
          studyCards = dueCards.length > 0 ? dueCards : rawCards;
        }

        setQueue(studyCards);
        setCurrentIdx(1);
        setShowAnswer(false);
        setIsCompleted(false);
        setGradesCount({ Again: 0, Hard: 0, Good: 0, Easy: 0 });

        // Cập nhật số bản ghi chưa đồng bộ
        const count = await getUnsyncedReviewCount();
        setUnsyncedCount(count);
      } catch (err) {
        console.error('Lỗi khi tải hàng đợi ôn tập:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCards();
  }, [targetDeckId, cramMode]);

  // Lắng nghe sự kiện kết nối mạng để tự động đồng bộ ngầm
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleNetworkChange = async () => {
      const offline = !navigator.onLine;
      setIsOffline(offline);
      if (!offline) {
        const syncRes = await syncPendingReviewsToServer();
        if (syncRes.synced > 0) {
          const count = await getUnsyncedReviewCount();
          setUnsyncedCount(count);
        }
      }
    };

    setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);

    return () => {
      window.removeEventListener('online', handleNetworkChange);
      window.removeEventListener('offline', handleNetworkChange);
    };
  }, []);

  const currentCard = queue && queue.length > 0 && currentIdx <= queue.length ? queue[currentIdx - 1] : null;
  const totalCards = queue ? queue.length : 0;
  const deckTitle =
    targetDeckId === 'all'
      ? 'Toàn bộ thẻ học'
      : deckList.find((d) => d.id === targetDeckId)?.name || 'Bộ thẻ chọn lọc';

  // Tính toán trước trạng thái FSRS qua Dedicated Web Worker chạy ngầm khi đổi thẻ
  useEffect(() => {
    if (!currentCard) {
      setFsrsNextStates(null);
      return;
    }

    const empty = createEmptyCard();
    const fsrsCard: Card = {
      ...empty,
      due: currentCard.due ? new Date(currentCard.due) : empty.due,
      stability: currentCard.stability ?? empty.stability,
      difficulty: currentCard.difficulty ?? empty.difficulty,
      reps: currentCard.reps ?? 0,
      lapses: currentCard.lapses ?? 0,
      state: currentCard.state ? (currentCard.state as any) : empty.state,
    };

    calculateNextReview(fsrsCard)
      .then((recordLog) => {
        setFsrsNextStates(recordLog);
      })
      .catch((err) => {
        console.warn('[Review FSRS Worker Error]', err);
      });
  }, [currentCard, calculateNextReview]);

  // Chuyển đổi khoảng cách thời gian FSRS sang chuỗi hiển thị trực quan
  const formatInterval = (rating: Rating.Again | Rating.Hard | Rating.Good | Rating.Easy): string => {
    const item = fsrsNextStates ? fsrsNextStates[rating] : null;
    if (!item) {
      if (rating === Rating.Again) return '< 1 phút';
      if (rating === Rating.Hard) return '~ 1.2 ngày';
      if (rating === Rating.Good) return '~ 3.5 ngày';
      return '~ 7.0 ngày';
    }

    const days = item.card.scheduled_days;
    if (days < 1) {
      const minutes = Math.max(1, Math.round(days * 24 * 60));
      return `< ${minutes} phút`;
    }
    if (days === 1) return '1 ngày';
    if (days < 30) return `${Math.round(days * 10) / 10} ngày`;
    const months = Math.round(days / 30);
    return `${months} tháng`;
  };

  // Chuyển đổi định dạng Pitch Accent
  const getPitchPattern = (pitchStr?: string): number => {
    if (!pitchStr) return 0;
    const match = pitchStr.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  // Hành động Lật thẻ để xem đáp án
  const handleReveal = useCallback(() => {
    setShowAnswer(true);
    japaneseAudio.playHyoshigi();
  }, []);

  // Hành động Chấm điểm theo thuật toán FSRS (Bất đồng bộ không chặn luồng giao diện)
  const handleGrade = useCallback(
    async (grade: 'Again' | 'Hard' | 'Good' | 'Easy') => {
      if (!currentCard) return;

      const ratingMap = {
        Again: Rating.Again,
        Hard: Rating.Hard,
        Good: Rating.Good,
        Easy: Rating.Easy,
      } as const;

      const ratingEnum = ratingMap[grade];
      const scheduledDays = fsrsNextStates ? fsrsNextStates[ratingEnum]?.card?.scheduled_days : undefined;

      setGradesCount((prev) => ({
        ...prev,
        [grade]: prev[grade] + 1,
      }));

      // Gửi ngầm không chặn UI (Optimistic UI update)
      const submitReview = async () => {
        try {
          if (!navigator.onLine) {
            throw new Error('Offline');
          }
          const res = await fetch('/api/review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cardId: currentCard.id,
              rating: grade,
              grade,
              responseTimeMs: 2500,
              scheduledDays,
            }),
          });
          if (!res.ok) throw new Error('API review returned non-200');
        } catch {
          // Khi ngoại tuyến hoặc API lỗi, lập tức ghi vào IndexedDB Dexie
          await recordPendingReview(currentCard.id, grade, scheduledDays, 2500);
          const count = await getUnsyncedReviewCount();
          setUnsyncedCount(count);
        }
      };

      submitReview();

      setShowAnswer(false);
      if (currentIdx >= totalCards) {
        setIsCompleted(true);
        japaneseAudio.playSuzuBell();
      } else {
        setCurrentIdx((prev) => prev + 1);
      }
    },
    [currentCard, currentIdx, totalCards, fsrsNextStates]
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
      <div style={{ maxWidth: '640px', margin: '3rem auto', padding: '0 1.25rem', textAlign: 'center' }}>
        <div
          className="card-karuta"
          style={{
            padding: '3rem 2rem',
            background: '#FAF7F2',
            border: '1.5px solid #E4DAC9',
            borderRadius: '18px',
            boxShadow: '0 8px 24px rgba(18, 36, 56, 0.06)',
          }}
        >
          <DarumaMascot progressPercentage={0} size={84} />
          <h2
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: '1.6rem',
              fontWeight: 800,
              color: '#122438',
              marginTop: '1.5rem',
              marginBottom: '0.5rem',
            }}
          >
            Chưa có thẻ trong bộ này
          </h2>
          <p style={{ color: '#786A5E', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Bộ thẻ <strong>{deckTitle}</strong> hiện tại chưa có dữ liệu thẻ học. Bạn có thể nhờ AI soạn thêm thẻ mới.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/cards/new" className="btn-torii">
              Nhờ AI soạn thẻ mới
            </Link>
            <Link href="/" className="btn-washi">
              Quay lại Trang chủ
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
      <div style={{ maxWidth: '640px', margin: '3rem auto', padding: '0 1.25rem', textAlign: 'center' }}>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: '3.5rem 2.25rem',
            background: '#FAF7F0',
            border: '2px solid #C89B58',
            borderRadius: '20px',
            boxShadow: '0 16px 36px rgba(18, 36, 56, 0.12)',
          }}
        >
          {/* Lớp nền mộc bản sóng vàng Rinpa nghệ thuật */}
          <JapaneseArtBackdrop
            src="/assets/art/rinpa-gold-waves-clouds.jpg"
            alt="Mây và sóng vàng Rinpa khải hoàn"
            opacity={0.16}
            blendMode="multiply"
            objectPosition="center"
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', marginBottom: '0.75rem' }}>
              <span
                style={{
                  padding: '0.35rem 1.1rem',
                  background: '#C83824',
                  color: '#FFFFFF',
                  borderRadius: '999px',
                  fontFamily: 'var(--font-mincho)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  letterSpacing: '0.08em',
                  boxShadow: '0 4px 12px rgba(200, 56, 36, 0.3)',
                }}
              >
                満願成就 · KHẢI HOÀN TOÀN THẮNG
              </span>
            </div>

            <DarumaMascot progressPercentage={100} size={100} />

            <h2
              style={{
                fontFamily: 'var(--font-mincho)',
                fontSize: '2.2rem',
                fontWeight: 800,
                color: '#122438',
                marginTop: '1.25rem',
                marginBottom: '0.4rem',
              }}
            >
              お疲れ様でした！
            </h2>
            <p style={{ fontFamily: 'var(--font-maru)', fontSize: '1.1rem', color: '#3E6F48', fontWeight: 700 }}>
              Bạn đã hoàn thành xuất sắc {totalCards} thẻ của bộ {deckTitle}!
            </p>

            {/* Bảng tổng kết đánh giá tinh tế */}
            <div
              style={{
                margin: '1.75rem auto',
                padding: '1.1rem',
                background: 'rgba(255, 255, 255, 0.92)',
                borderRadius: '14px',
                border: '1.2px solid #E6DDCF',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.5rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.78rem', color: '#9E3324', fontWeight: 700, fontFamily: 'var(--font-mincho)' }}>再 Again</span>
                <p style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.4rem', fontWeight: 800, margin: '0.2rem 0 0' }}>{gradesCount.Again}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#B87B28', fontWeight: 700, fontFamily: 'var(--font-mincho)' }}>難 Hard</span>
                <p style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.4rem', fontWeight: 800, margin: '0.2rem 0 0' }}>{gradesCount.Hard}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#3E734E', fontWeight: 700, fontFamily: 'var(--font-mincho)' }}>良 Good</span>
                <p style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.4rem', fontWeight: 800, margin: '0.2rem 0 0' }}>{gradesCount.Good}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#234B73', fontWeight: 700, fontFamily: 'var(--font-mincho)' }}>易 Easy</span>
                <p style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.4rem', fontWeight: 800, margin: '0.2rem 0 0' }}>{gradesCount.Easy}</p>
              </div>
            </div>

            <p style={{ color: '#786A5E', fontSize: '0.88rem', marginBottom: '2rem' }}>
              Tỉ lệ ghi nhớ tối ưu: <strong>{masteryPercent}%</strong> · Lịch FSRS đã được ghi nhận.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
              <Link href="/" className="btn-torii">
                Về Trang chủ
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
                Ôn lại bộ này một lượt nữa
              </button>
              <Link href="/cards" className="btn-washi">
                Chọn bộ thẻ khác
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. GIAO DIỆN PHIÊN ÔN TẬP KARUTA ACTIVE RECALL
  const isKanji = currentCard ? (currentCard.type === 'Kanji' || (currentCard.deckName && currentCard.deckName.includes('Hán Tự'))) : false;

  return (
    <div style={{ maxWidth: '640px', margin: '1.5rem auto', padding: '0 1.25rem 3.5rem' }}>
      {/* THANH ĐIỀU HƯỚNG & TIẾN ĐỘ THÂN TRÚC */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              href="/"
              style={{
                color: '#786A5E',
                textDecoration: 'none',
                fontSize: '0.88rem',
                fontFamily: 'var(--font-maru)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              ← Quay lại Trang chủ
            </Link>

            {isOffline && (
              <span
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-maru)',
                  fontWeight: 700,
                  backgroundColor: '#FFF2F0',
                  color: '#C83824',
                  border: '1px solid #F5C6CB',
                  borderRadius: '6px',
                  padding: '0.15rem 0.45rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                ⚡ Ngoại tuyến (IndexedDB)
              </span>
            )}

            {unsyncedCount > 0 && (
              <span
                title="Lượt ôn tập đã ghi nhận cục bộ và sẽ tự động đồng bộ khi có mạng"
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-maru)',
                  fontWeight: 700,
                  backgroundColor: '#FFF9E6',
                  color: '#B87B28',
                  border: '1px solid #FFEAA7',
                  borderRadius: '6px',
                  padding: '0.15rem 0.45rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                🔄 Chờ đồng bộ: {unsyncedCount}
              </span>
            )}
          </div>

          {/* Quick Deck Switcher Button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowDeckMenu(!showDeckMenu)}
              style={{
                background: '#FAF7F0',
                border: '1.2px solid #E6DDCF',
                borderRadius: '8px',
                padding: '0.35rem 0.85rem',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-maru)',
                fontWeight: 700,
                color: '#122438',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  background: isKanji ? '#C83824' : '#234B73',
                  color: '#FFFFFF',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mincho)',
                  fontWeight: 800,
                }}
              >
                {isKanji ? '漢' : '語'}
              </span>
              <span>{deckTitle}</span>
              <span style={{ fontSize: '0.75rem', color: '#786A5E' }}>▾</span>
            </button>

            {/* Dropdown Menu đổi bộ thẻ */}
            {showDeckMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '115%',
                  right: 0,
                  background: '#FFFFFF',
                  border: '1.2px solid #E6DDCF',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(18, 36, 56, 0.12)',
                  minWidth: '240px',
                  zIndex: 50,
                  padding: '0.5rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: '#786A5E', padding: '0.4rem 0.6rem', fontWeight: 600 }}>
                  CHỌN BỘ THẺ:
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
                    background: targetDeckId === 'all' ? '#FAF6EE' : 'transparent',
                    color: targetDeckId === 'all' ? '#122438' : '#786A5E',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-maru)',
                    fontWeight: targetDeckId === 'all' ? 700 : 500,
                  }}
                >
                  Toàn bộ thẻ học
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
                      background: targetDeckId === d.id ? '#FAF6EE' : 'transparent',
                      color: targetDeckId === d.id ? '#122438' : '#786A5E',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-maru)',
                      fontWeight: targetDeckId === d.id ? 700 : 500,
                    }}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tiến độ và số câu hỏi */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.82rem', color: '#786A5E', fontFamily: 'var(--font-maru)' }}>
            Hàng đợi ôn tập: {deckTitle}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mincho)',
              fontWeight: 700,
              fontSize: '0.92rem',
              color: '#122438',
            }}
          >
            第 {currentIdx} 問 / 全 {totalCards} 問
          </span>
        </div>

        {/* Thanh tiến độ phiên học phong cách lụa vàng */}
        <div
          style={{
            height: '6px',
            background: '#E8E0D2',
            borderRadius: '999px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #C89B58 0%, #1E4B75 100%)',
              borderRadius: '999px',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* THẺ BÀI TRUYỀN THỐNG HYAKUNIN ISSHU KARUTA CÓ VÂN SÓNG VÀNG RINPA */}
      {currentCard && (
        <div
          style={{
            minHeight: '380px',
            padding: '2.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            marginBottom: '1.5rem',
            background: showAnswer ? 'linear-gradient(180deg, #FFFFFF 0%, #FAF8F2 100%)' : '#FAF7F0',
            border: '2px solid #C89B58',
            borderRadius: '18px',
            boxShadow: '0 12px 32px rgba(18, 36, 56, 0.08)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <JapaneseArtBackdrop
            src="/assets/art/rinpa-gold-waves-clouds.jpg"
            alt="Mây và sóng vàng Rinpa nghệ thuật"
            opacity={0.15}
            blendMode="multiply"
            objectPosition="center"
          />

          {/* Dấu son Hanko truyền thống ở góc trên */}
          <div
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              fontFamily: 'var(--font-mincho)',
              fontSize: '0.82rem',
              color: '#FFFFFF',
              background: showAnswer ? '#3E734E' : '#C83824',
              padding: '0.25rem 0.65rem',
              borderRadius: '4px',
              fontWeight: 800,
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
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
                fontSize: '4.5rem',
                fontWeight: 900,
                color: '#122438',
                letterSpacing: '0.04em',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
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
                paddingTop: '1.25rem',
                borderTop: '1px solid #E8E0D2',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                alignItems: 'center',
                animation: 'fadeIn 0.3s ease forwards',
              }}
            >
              {/* Đồ thị cao độ ngữ âm Tokyo Pitch Accent (nếu có reading) */}
              {currentCard.reading && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '10px',
                    border: '1px solid #E8E0D2',
                    boxShadow: '0 2px 6px rgba(18, 36, 56, 0.04)',
                  }}
                >
                  <PitchAccentGraph
                    reading={currentCard.reading}
                    pattern={getPitchPattern(currentCard.pitch)}
                  />
                </div>
              )}

              {/* Ý nghĩa tiếng Việt */}
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#122438', fontFamily: 'var(--font-maru)' }}>
                {currentCard.meaning}
              </div>

              {/* Câu ví dụ ngữ cảnh i+1 (nếu có) */}
              {currentCard.sentence && (
                <div
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.92)',
                    padding: '0.85rem 1.25rem',
                    borderRadius: '10px',
                    border: '1px solid #E8E0D2',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.98rem', color: '#122438', fontFamily: 'var(--font-mincho)', fontWeight: 600 }}>
                      {currentCard.sentence}
                    </span>
                    <JapaneseSpeakerButton text={currentCard.sentence} size={18} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ marginTop: '1.5rem', color: '#786A5E', fontSize: '0.88rem', fontFamily: 'var(--font-maru)' }}>
              Nhấn phím Space hoặc nút bên dưới để xem nghĩa &amp; âm điệu
            </div>
          )}
        </div>
      )}

      {/* KHU VỰC NÚT TƯƠNG TÁC ACTIVE RECALL */}
      {!showAnswer ? (
        <button
          onClick={handleReveal}
          className="btn-torii"
          style={{
            width: '100%',
            padding: '1.05rem',
            fontSize: '1.1rem',
            boxShadow: '0 6px 20px rgba(200, 56, 36, 0.3)',
            letterSpacing: '0.02em',
          }}
        >
          <SensuFanIcon size={20} color="#FFFFFF" />
          Khám phá đáp án (Space)
        </button>
      ) : (
        <div>
          {/* 4 THẺ SƠN MÀI ĐÁNH GIÁ CHUẨN TÔNG MÀU KHOÁNG TRUYỀN THỐNG */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.65rem', marginBottom: '0.5rem' }}>
            {/* NÚT 1: AGAIN (再 - Akane) */}
            <button
              className="btn-srs-rating"
              onClick={() => handleGrade('Again')}
              style={{
                touchAction: 'manipulation',
                padding: '0.85rem 0.4rem',
                backgroundColor: '#FFF7F6',
                border: '1.5px solid #9E3324',
                borderRadius: '12px',
                color: '#9E3324',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mincho)', fontWeight: 900, fontSize: '1.25rem' }}>再 (1)</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>{formatInterval(Rating.Again)}</span>
            </button>

            {/* NÚT 2: HARD (難 - Kohaku) */}
            <button
              className="btn-srs-rating"
              onClick={() => handleGrade('Hard')}
              style={{
                touchAction: 'manipulation',
                padding: '0.85rem 0.4rem',
                backgroundColor: '#FFFAF2',
                border: '1.5px solid #B87B28',
                borderRadius: '12px',
                color: '#B87B28',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mincho)', fontWeight: 900, fontSize: '1.25rem' }}>難 (2)</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>{formatInterval(Rating.Hard)}</span>
            </button>

            {/* NÚT 3: GOOD (良 - Tokiwa) */}
            <button
              className="btn-srs-rating"
              onClick={() => handleGrade('Good')}
              style={{
                touchAction: 'manipulation',
                padding: '0.85rem 0.4rem',
                backgroundColor: '#3E734E',
                border: '1.5px solid #2F593C',
                borderRadius: '12px',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(62, 115, 78, 0.3)',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mincho)', fontWeight: 900, fontSize: '1.25rem' }}>良 (3)</span>
              <span style={{ fontSize: '0.72rem', color: '#EAF5EC', fontWeight: 600 }}>{formatInterval(Rating.Good)}</span>
            </button>

            {/* NÚT 4: EASY (易 - Aizome) */}
            <button
              className="btn-srs-rating"
              onClick={() => handleGrade('Easy')}
              style={{
                touchAction: 'manipulation',
                padding: '0.85rem 0.4rem',
                backgroundColor: '#234B73',
                border: '1.5px solid #1A3755',
                borderRadius: '12px',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(35, 75, 115, 0.3)',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mincho)', fontWeight: 900, fontSize: '1.25rem' }}>易 (4)</span>
              <span style={{ fontSize: '0.72rem', color: '#D4E5F5', fontWeight: 600 }}>{formatInterval(Rating.Easy)}</span>
            </button>
          </div>
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
