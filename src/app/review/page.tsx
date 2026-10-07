'use client';

import { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ToriiIcon, SensuFanIcon } from '@/components/japanese/Icons';
import { PitchAccentGraph } from '@/components/japanese/PitchAccentGraph';
import { JapaneseSpeakerButton } from '@/components/japanese/JapaneseSpeakerButton';
import { japaneseAudio } from '@/components/japanese/AudioEffects';
import { parseClozeSegments, stripCloze } from '@/lib/cloze';
import { parseCardDetails } from '@/lib/reading-parser';
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
import { KanjiStrokePlayer } from '@/components/showcase/KanjiStrokePlayer';
import { DoBaiHotkeysBar } from '@/components/dobai/DoBaiHotkeysBar';
import { DoBaiModeSelector, DoBaiDrillDirection } from '@/components/dobai/DoBaiModeSelector';
import { DoBaiUnlearnedDrawer, UnlearnedItem } from '@/components/dobai/DoBaiUnlearnedDrawer';
import { getJPD133Slot, getAllJPD133Slots } from '@/core/curriculum/jpd133-manifest';
import { buildDbCardIndex, softLinkManifestWithDbCards } from '@/core/curriculum/soft-link-engine';

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
          Đang chuẩn bị phiên học phản xạ...
        </h3>
        <p style={{ color: '#786A5E', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          Đang tải dữ liệu và tối ưu hóa hàng đợi FSRS v4.5
        </p>
      </div>
    </div>
  );
}

/**
 * Nội dung Phiên Ôn tập Karuta & Dò bài Minna
 */
function ReviewSessionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetDeckId = searchParams.get('deck') || 'all';
  const initialMode = searchParams.get('mode') || 'fsrs_due';
  const curriculumParam = searchParams.get('curriculum');
  const slotParam = searchParams.get('slot');

  // Chế độ học: 'dobai' (Dò bài Minna - mặc định theo Phase 10) hoặc 'karuta' (Thẻ bài 3D)
  const [drillStyle, setDrillStyle] = useState<'dobai' | 'karuta'>(
    initialMode === 'karuta' ? 'karuta' : 'dobai'
  );

  // Chiều dò bài trong chế độ Dò bài: Thuận (JA -> VI) hoặc Nghịch (VI -> JA)
  const [drillDirection, setDrillDirection] = useState<DoBaiDrillDirection>('forward');

  // Hàng đợi chưa thuộc Cột D-E-F (In-Session Retry Queue)
  const [unlearnedList, setUnlearnedList] = useState<UnlearnedItem[]>([]);
  const [showUnlearnedDrawerMobile, setShowUnlearnedDrawerMobile] = useState(false);
  const [filterOnlyUnlearned, setFilterOnlyUnlearned] = useState(false);

  // Độ trễ phản xạ Bjork Latency (ms)
  const [lastLatencyMs, setLastLatencyMs] = useState<number | null>(null);

  const { calculateNextReview, isReady: isWorkerReady } = useFsrsScheduler();
  const [fsrsNextStates, setFsrsNextStates] = useState<RecordLog | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [unsyncedCount, setUnsyncedCount] = useState(0);

  const cardStartTimeRef = useRef<number>(Date.now());
  const deckMenuRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [deckList, setDeckList] = useState<DeckItem[]>([]);
  const [queue, setQueue] = useState<CardItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(1);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showStrokeOrder, setShowStrokeOrder] = useState(false);
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

  // Lịch sử chấm điểm phục vụ tính năng Hoàn tác FSRS Undo (DEF-UI-KARUTA-003)
  const [reviewHistory, setReviewHistory] = useState<Array<{
    cardIdx: number;
    grade: 'Again' | 'Hard' | 'Good' | 'Easy';
    unlearnedSnapshot?: UnlearnedItem[];
  }>>([]);
  const [undoToast, setUndoToast] = useState<string | null>(null);

  // Tải dữ liệu thẻ từ API /api/cards hoặc JPD133 Manifest
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

        // HỖ TRỢ ĐẶC BIỆT PHASE 11: NẠP THEO JPD133 CURRICULUM SLOT
        if (curriculumParam === 'jpd133' && slotParam) {
          const slotDef = getJPD133Slot(slotParam);
          if (slotDef) {
            const dbIndex = buildDbCardIndex(
              rawCards.map((c) => ({
                id: c.id,
                front: c.kanji,
                reading: c.reading,
                meaning: c.meaning,
                due: c.due,
                stability: c.stability,
                difficulty: c.difficulty,
                reps: c.reps,
                lapses: c.lapses,
                state: c.state,
              }))
            );
            const softLinked = softLinkManifestWithDbCards(slotDef.vocabularyList, dbIndex);
            studyCards = softLinked.map((item) => {
              const dbMatch = item.dbCardId ? rawCards.find((c) => String(c.id) === String(item.dbCardId)) : undefined;
              return {
                id: String(item.dbCardId || item.id),
                kanji: item.kanji,
                reading: item.reading,
                meaning: item.vietnameseMeaning,
                pitch: undefined,
                type: 'vocab',
                deckId: `jpd133_slot_${slotDef.slotNumber}`,
                deckName: `JPD133 - Slot ${slotDef.slotNumber}: ${slotDef.titleVn}`,
                sentence: item.contextSentenceJa ? `${item.contextSentenceJa} (${item.contextSentenceVn})` : undefined,
                state: dbMatch?.state || 'New',
                due: dbMatch?.due,
                stability: dbMatch?.stability,
                difficulty: dbMatch?.difficulty,
              };
            });
          }
        }

        if (studyCards.length === 0) {
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
        }

        setQueue(studyCards);
        setCurrentIdx(1);
        setShowAnswer(false);
        setShowStrokeOrder(false);
        setIsCompleted(false);
        setUnlearnedList([]);
        setLastLatencyMs(null);
        setGradesCount({ Again: 0, Hard: 0, Good: 0, Easy: 0 });

        const count = await getUnsyncedReviewCount();
        setUnsyncedCount(count);
      } catch (err) {
        console.error('Lỗi khi tải hàng đợi ôn tập:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCards();
  }, [targetDeckId, cramMode, curriculumParam, slotParam]);

  // Đánh dấu component đã mounted
  useEffect(() => {
    setIsMounted(true);
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

  // Đóng dropdown bộ thẻ
  useEffect(() => {
    if (!showDeckMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (deckMenuRef.current && !deckMenuRef.current.contains(e.target as Node)) {
        setShowDeckMenu(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowDeckMenu(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showDeckMenu]);

  // Bắt đầu tính giờ khi đổi thẻ để đo chính xác responseTimeMs (Bjork Latency Dynamics)
  useEffect(() => {
    cardStartTimeRef.current = Date.now();
    setLastLatencyMs(null);
  }, [currentIdx]);

  const currentCard = queue && queue.length > 0 && currentIdx <= queue.length ? queue[currentIdx - 1] : null;
  const totalCards = queue ? queue.length : 0;

  const currentSlotDef = slotParam ? getJPD133Slot(slotParam) : undefined;
  const deckTitle = currentSlotDef
    ? `JPD133 · Slot ${currentSlotDef.slotNumber}: ${currentSlotDef.titleVn}`
    : targetDeckId === 'all'
    ? 'Toàn bộ thẻ học'
    : deckList.find((d) => d.id === targetDeckId)?.name || 'Bộ thẻ chọn lọc';

  // Tính toán trước trạng thái FSRS qua Web Worker
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

  // Phát âm tiếng Nhật của thẻ hiện tại
  const handlePronounce = useCallback(() => {
    if (!currentCard) return;
    const textToSpeak = currentCard.reading || currentCard.kanji;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  }, [currentCard]);

  // Hành động Hiện đáp án (Macro ShowAdjacentCellsC trong Dò bài - Minna.xlsm)
  const handleReveal = useCallback(() => {
    setShowAnswer(true);
    const latency = Math.max(100, Date.now() - cardStartTimeRef.current);
    setLastLatencyMs(latency);

    // m thanh xúc giác Washi và phát âm tiếng Nhật
    japaneseAudio.playWashiPaper();
    handlePronounce();
  }, [handlePronounce]);

  // Hành động Chấm điểm FSRS (Gửi ngầm không chặn UI)
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

      // Lưu vào lịch sử hoàn tác
      setReviewHistory((prev) => [
        ...prev,
        { cardIdx: currentIdx, grade, unlearnedSnapshot: [...unlearnedList] },
      ]);

      const responseTimeMs = lastLatencyMs ?? Math.max(100, Math.round(Date.now() - cardStartTimeRef.current));

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
              responseTimeMs,
              scheduledDays,
            }),
          });
          if (!res.ok) throw new Error('API review returned non-200');
        } catch {
          await recordPendingReview(currentCard.id, grade, scheduledDays, responseTimeMs);
          const count = await getUnsyncedReviewCount();
          setUnsyncedCount(count);
        }
      };

      submitReview();

      setShowAnswer(false);
      setShowStrokeOrder(false);

      if (currentIdx >= totalCards) {
        setIsCompleted(true);
        japaneseAudio.playSuzuBell();
      } else {
        setCurrentIdx((prev) => prev + 1);
      }
    },
    [currentCard, currentIdx, totalCards, fsrsNextStates, lastLatencyMs, unlearnedList]
  );

  // Xử lý nút ĐÃ THUỘC (Learned) trong Dò bài: Tự động tính FSRS Grade từ Bjork Latency
  const handleMastered = useCallback(() => {
    if (!currentCard) return;
    const latency = lastLatencyMs ?? Math.max(100, Date.now() - cardStartTimeRef.current);

    // Chuyển đổi phản xạ sang FSRS Grade:
    // < 1.5s: Easy (Grade 4)
    // 1.5s - 6.0s: Good (Grade 3)
    // > 6.0s: Hard (Grade 2)
    let autoGrade: 'Again' | 'Hard' | 'Good' | 'Easy' = 'Good';
    if (latency < 1500) {
      autoGrade = 'Easy';
    } else if (latency <= 6000) {
      autoGrade = 'Good';
    } else {
      autoGrade = 'Hard';
    }

    // Nếu từ này từng bị xếp vào Hàng đợi Chưa thuộc (Cột D-E-F), giờ đã thuộc thì xóa khỏi nợ
    setUnlearnedList((prev) => prev.filter((u) => u.id !== currentCard.id));

    handleGrade(autoGrade);
  }, [currentCard, lastLatencyMs, handleGrade]);

  // Xử lý nút CHƯA THUỘC (Unlearned) trong Dò bài: Thêm vào Cột D-E-F & Xen kẽ vào hàng đợi
  const handleUnlearned = useCallback(() => {
    if (!currentCard) return;

    // Đưa vào Hàng đợi Cột D-E-F
    setUnlearnedList((prev) => {
      if (prev.some((u) => u.id === currentCard.id)) return prev;
      return [
        ...prev,
        {
          id: currentCard.id,
          kanji: currentCard.kanji,
          reading: currentCard.reading,
          meaning: currentCard.meaning,
          repeatInTurns: 2,
        },
      ];
    });

    // Thuật toán Xen kẽ (Interleaving): Chèn từ này lại sau 2 lượt nữa
    setQueue((prevQueue) => {
      const nextQueue = [...prevQueue];
      const insertIdx = Math.min(nextQueue.length, currentIdx + 2);
      nextQueue.splice(insertIdx, 0, currentCard);
      return nextQueue;
    });

    japaneseAudio.playHyoshigi();
    handleGrade('Again');
  }, [currentCard, currentIdx, handleGrade]);

  // Hành động Hoàn tác kết quả chấm điểm (Undo Grade - DEF-UI-KARUTA-003)
  const handleUndo = useCallback(() => {
    if (reviewHistory.length === 0) return;
    const lastItem = reviewHistory[reviewHistory.length - 1];
    setReviewHistory((prev) => prev.slice(0, -1));
    setCurrentIdx(lastItem.cardIdx);
    setShowAnswer(true);
    setIsCompleted(false);

    if (lastItem.unlearnedSnapshot) {
      setUnlearnedList(lastItem.unlearnedSnapshot);
    }

    setGradesCount((prev) => ({
      ...prev,
      [lastItem.grade]: Math.max(0, prev[lastItem.grade] - 1),
    }));

    japaneseAudio.playWashiPaper();
    setUndoToast('Đã hoàn tác kết quả đánh giá (Phím Z)');
    setTimeout(() => setUndoToast(null), 2500);
  }, [reviewHistory]);

  // Phím tắt thông minh phản xạ cực nhanh (Zero-Friction Hotkeys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.isComposing) return; // Bảo vệ chống xung đột bộ gõ IME tiếng Nhật

      // Hoàn tác: Phím Z hoặc Ctrl+Z
      if ((e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
        if (reviewHistory.length > 0) {
          e.preventDefault();
          handleUndo();
          return;
        }
      }

      // Phát âm: Phím P
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        handlePronounce();
        return;
      }

      // Phím Space: Hiện / Ẩn đáp án
      if (e.code === 'Space') {
        e.preventDefault();
        if (!showAnswer) {
          handleReveal();
        } else {
          setShowAnswer(false);
        }
        return;
      }

      // Khi đã mở đáp án:
      if (showAnswer) {
        if (drillStyle === 'dobai') {
          // CHẾ ĐỘ DÒ BÀI MINNA:
          // Enter hoặc 1: ĐÃ THUỘC (Mastered)
          if (e.key === 'Enter' || e.key === '1') {
            e.preventDefault();
            handleMastered();
            return;
          }
          // Backspace hoặc 2: CHƯA THUỘC (Unlearned / Retry)
          if (e.key === 'Backspace' || e.key === '2') {
            e.preventDefault();
            handleUnlearned();
            return;
          }
        } else {
          // CHẾ ĐỘ THẺ BÀI KARUTA: 1-4 chấm điểm FSRS trực tiếp
          if (e.key === '1') handleGrade('Again');
          if (e.key === '2') handleGrade('Hard');
          if (e.key === '3') handleGrade('Good');
          if (e.key === '4') handleGrade('Easy');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    showAnswer,
    drillStyle,
    handleReveal,
    handleMastered,
    handleUnlearned,
    handleGrade,
    reviewHistory,
    handleUndo,
    handlePronounce,
  ]);

  const progressPercent = totalCards > 0 ? Math.round((currentIdx / totalCards) * 100) : 0;

  if (loading) {
    return <ReviewLoadingSkeleton />;
  }

  // 1. TRƯỜNG HỢP DECK RỖNG HOÀN TOÀN
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
            Chưa có thẻ cần ôn tập
          </h2>
          <p style={{ color: '#786A5E', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Hàng đợi <strong>{deckTitle}</strong> hiện tại không có thẻ học nào đến hạn.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/curriculum/jpd133" className="btn-torii">
              Giáo trình JPD133
            </Link>
            <Link href="/cards" className="btn-washi">
              Thư viện thẻ
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
      <div style={{ maxWidth: '680px', margin: '3rem auto', padding: '0 1.25rem', textAlign: 'center' }}>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: '3.5rem 2.25rem',
            background: '#FAF7F0',
            border: '2px solid #C89B58',
            borderRadius: '24px',
            boxShadow: '0 16px 36px rgba(18, 36, 56, 0.12)',
          }}
        >
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
                満願成就 · HOÀN THÀNH PHIÊN DÒ BÀI
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
            <p style={{ fontFamily: 'var(--font-maru)', fontSize: '1.1rem', color: '#386641', fontWeight: 700 }}>
              Bạn đã hoàn thành xuất sắc {totalCards} lượt dò của {deckTitle}!
            </p>

            {/* Bảng tổng kết đánh giá */}
            <div
              style={{
                margin: '1.75rem auto',
                padding: '1.1rem',
                background: 'rgba(255, 255, 255, 0.94)',
                borderRadius: '16px',
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
              Tỉ lệ nhớ chính xác: <strong>{masteryPercent}%</strong> · Hàng đợi Cột D-E-F đã được hoàn tất trọn vẹn.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
              {curriculumParam === 'jpd133' && (
                <Link href={`/curriculum/jpd133/${slotParam || '1'}`} className="btn-torii">
                  Quay lại Slot {slotParam || '1'}
                </Link>
              )}
              <button
                onClick={() => {
                  setCurrentIdx(1);
                  setIsCompleted(false);
                  setShowAnswer(false);
                  setShowStrokeOrder(false);
                  setUnlearnedList([]);
                  setGradesCount({ Again: 0, Hard: 0, Good: 0, Easy: 0 });
                }}
                className="btn-washi"
              >
                Dò lại từ đầu
              </button>
              <Link href="/curriculum/jpd133" className="btn-washi">
                Tất cả Slot JPD133
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isGrammar = currentCard
    ? currentCard.type === 'GrammarPattern' ||
      currentCard.deckId === 'grammar_jpd133' ||
      Boolean(
        currentCard.deckName &&
          (currentCard.deckName.toLowerCase().includes('ngữ pháp') ||
            currentCard.deckName.toLowerCase().includes('bunbou'))
      ) ||
      Boolean(
        currentCard.kanji &&
          (currentCard.kanji.startsWith('【文法') ||
            currentCard.kanji.includes('Pattern') ||
            currentCard.kanji.includes('{{c'))
      )
    : false;

  const isKanji = currentCard && !isGrammar
    ? currentCard.type === 'Kanji' ||
      Boolean(currentCard.deckName && currentCard.deckName.includes('Hán Tự')) ||
      currentCard.deckId === 'deck_jpd133_kanji' ||
      /^[\u4e00-\u9faf]$/.test(currentCard.kanji.trim())
    : false;

  const allJpdSlots = getAllJPD133Slots();

  return (
    <main
      style={{
        position: 'relative',
        minHeight: '100vh',
        padding: '1.5rem 1rem 5rem',
      }}
    >
      {/* HÌNH NỀN TRANH CẮT GIẤY KIRIE SÓNG BIỂN TẦNG 3D TOÀN TRANG (BẢO TOÀN INVARIANT 3 & TESTS) */}
      <JapaneseArtBackdrop
        src="/assets/art/kirie-layered-waves.jpg"
        alt="Nghệ thuật Kirie sóng biển Nhật Bản"
        opacity={0.065}
        blendMode="multiply"
      />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* THANH ĐIỀU HƯỚNG TRÊN CÙNG & CHUYỂN CHẾ ĐỘ (DO BAI VS KARUTA) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          {/* Nút quay lại & Trạng thái Offline / Đồng bộ */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              href={curriculumParam === 'jpd133' ? `/curriculum/jpd133/${slotParam || ''}` : '/'}
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
              ← {curriculumParam === 'jpd133' ? `Slot ${slotParam || '1'}` : 'Trang chủ'}
            </Link>

            {isMounted && isOffline && (
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
                }}
              >
                ⚡ Ngoại tuyến
              </span>
            )}

            {isMounted && unsyncedCount > 0 && (
              <span
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-maru)',
                  fontWeight: 700,
                  backgroundColor: '#FFF9E6',
                  color: '#B87B28',
                  border: '1px solid #FFEAA7',
                  borderRadius: '6px',
                  padding: '0.15rem 0.45rem',
                }}
              >
                🔄 Chờ đồng bộ: {unsyncedCount}
              </span>
            )}
          </div>

          {/* CÔNG TẮC CHUYỂN ĐỔI CHẾ ĐỘ: DÒ BÀI MINNA VS THẺ BÀI KARUTA (USER DIRECTIVE) */}
          <div
            style={{
              display: 'flex',
              background: '#F0ECE1',
              padding: '0.25rem',
              borderRadius: '10px',
              border: '1px solid #DFD9CB',
            }}
          >
            <button
              type="button"
              onClick={() => setDrillStyle('dobai')}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '8px',
                border: 'none',
                background: drillStyle === 'dobai' ? '#16253B' : 'transparent',
                color: drillStyle === 'dobai' ? '#FFFFFF' : '#786A5E',
                fontFamily: 'var(--font-maru)',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              🎋 Bàn Dò Bài Minna
            </button>
            <button
              type="button"
              onClick={() => setDrillStyle('karuta')}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '8px',
                border: 'none',
                background: drillStyle === 'karuta' ? '#9E3223' : 'transparent',
                color: drillStyle === 'karuta' ? '#FFFFFF' : '#786A5E',
                fontFamily: 'var(--font-maru)',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              🎴 Thẻ Bài Karuta (3D)
            </button>
          </div>
        </div>

        {/* DẢI CHỌN SLOT JPD133 NHANH (NẾU ĐANG TRONG KHUNG JPD133) */}
        {curriculumParam === 'jpd133' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              overflowX: 'auto',
              paddingBottom: '0.5rem',
              marginBottom: '1rem',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mincho)', fontWeight: 800, color: '#8C6B3E', whiteSpace: 'nowrap' }}>
              CHỌN SLOT:
            </span>
            {allJpdSlots.map((s) => {
              const isSelected = String(s.slotNumber) === String(slotParam);
              return (
                <button
                  key={String(s.slotId)}
                  type="button"
                  onClick={() => router.push(`/review?curriculum=jpd133&slot=${s.slotNumber}&mode=${drillStyle}`)}
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-maru)',
                    fontWeight: isSelected ? 700 : 500,
                    whiteSpace: 'nowrap',
                    background: isSelected ? '#16253B' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#4A5568',
                    border: isSelected ? '1px solid #16253B' : '1px solid #D8CFC0',
                    cursor: 'pointer',
                  }}
                >
                  Slot {s.slotNumber}
                </button>
              );
            })}
          </div>
        )}

        {/* TIẾN ĐỘ VÀ SỐ CÂU HỎI */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', color: '#786A5E', fontFamily: 'var(--font-maru)' }}>
              {drillStyle === 'dobai' ? 'Bàn dò bài phản xạ:' : 'Hàng đợi ôn tập:'} <strong>{deckTitle}</strong>
            </span>
            <span style={{ fontFamily: 'var(--font-mincho)', fontWeight: 700, fontSize: '0.92rem', color: '#122438' }}>
              第 {currentIdx} 問 / 全 {totalCards} 問
            </span>
          </div>

          <div style={{ height: '6px', background: '#E7E0D2', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #AF7E36 0%, #16253B 100%)',
                borderRadius: '999px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* THÔNG BÁO HOÀN TÁC TOAST */}
        {undoToast && (
          <div
            style={{
              padding: '0.5rem 1rem',
              marginBottom: '1rem',
              borderRadius: '8px',
              background: '#FBF5E8',
              border: '1px solid #E5CCA0',
              color: '#AF7E36',
              fontFamily: 'var(--font-maru)',
              fontWeight: 700,
              fontSize: '0.85rem',
              textAlign: 'center',
            }}
          >
            {undoToast}
          </div>
        )}

        {/* NỘI DUNG CHÍNH THEO CHẾ ĐỘ: DÒ BÀI MINNA HOẶC THẺ BÀI KARUTA */}
        {drillStyle === 'dobai' ? (
          /* =========================================================================
             A. GIAO DIỆN BÀN DÒ BÀI MINNA RAPID REFLEX DRILL STUDIO (PHASE 10)
             Bố cục Bento 2 cột: 72% Main Drill View / 28% Retry Queue (Cột D-E-F)
             ========================================================================= */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: unlearnedList.length > 0 ? '1fr 300px' : '1fr',
              gap: '1.5rem',
              alignItems: 'start',
            }}
          >
            {/* CỘT CHÍNH: KHUNG DÒ BÀI (MAIN DRILL VIEW) */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Thanh chọn chiều dò bài: Thuận (JA->VI) / Nghịch (VI->JA) */}
              <DoBaiModeSelector
                direction={drillDirection}
                onDirectionChange={setDrillDirection}
                unlearnedCount={unlearnedList.length}
                filterOnlyUnlearned={filterOnlyUnlearned}
                onToggleFilterOnlyUnlearned={() => setFilterOnlyUnlearned(!filterOnlyUnlearned)}
              />

              {currentCard && (
                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1.8px solid #E4DAC9',
                    borderRadius: '20px',
                    padding: '2.5rem 2rem',
                    boxShadow: '0 8px 30px rgba(22, 37, 59, 0.06)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  {/* Tag trên đầu: Deck / Slot */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '1.25rem',
                      left: '1.5rem',
                      fontSize: '0.75rem',
                      color: '#8C6B3E',
                      fontFamily: 'var(--font-mincho)',
                      fontWeight: 800,
                    }}
                  >
                    {currentCard.deckName || 'TỪ VỰNG TIẾNG NHẬT'}
                  </div>

                  {/* Nút phát âm loa góc trên phải */}
                  <div style={{ position: 'absolute', top: '1.25rem', right: '1.5rem' }}>
                    <JapaneseSpeakerButton text={currentCard.reading || currentCard.kanji} size={32} />
                  </div>

                  {/* KHUNG TỪ VỰNG DÒ: CELL A1 (KANJI) + CELL B1 (HIRAGANA) */}
                  <div style={{ marginTop: '1.5rem', marginBottom: '2rem', width: '100%' }}>
                    {drillDirection === 'forward' ? (
                      /* CHIỀU THUẬN: HIỆN TIẾNG NHẬT, CHE NGHĨA TIẾNG VIỆT */
                      <div>
                        {/* Furigana / Hiragana (Cell B1) */}
                        <div
                          style={{
                            fontSize: '1.2rem',
                            color: '#9E3223',
                            fontFamily: 'var(--font-maru)',
                            fontWeight: 700,
                            marginBottom: '0.35rem',
                            minHeight: '1.5rem',
                          }}
                        >
                          {currentCard.reading || ' '}
                        </div>

                        {/* Kanji Thư pháp Lớn (Cell A1) */}
                        <div
                          style={{
                            fontFamily: 'var(--font-mincho)',
                            fontSize: 'clamp(2.5rem, 6vw, 4.2rem)',
                            fontWeight: 900,
                            color: '#16253B',
                            lineHeight: 1.2,
                          }}
                        >
                          {currentCard.kanji}
                        </div>
                      </div>
                    ) : (
                      /* CHIỀU NGHỊCH: HIỆN NGHĨA TIẾNG VIỆT, CHE TIẾNG NHẬT */
                      <div>
                        <span style={{ fontSize: '0.78rem', color: '#786A5E', fontFamily: 'var(--font-maru)' }}>
                          HÃY HỒI TƯỞNG TỪ VỰNG TIẾNG NHẬT TƯƠNG ỨNG:
                        </span>
                        <div
                          style={{
                            fontFamily: 'var(--font-maru)',
                            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                            fontWeight: 800,
                            color: '#16253B',
                            marginTop: '0.5rem',
                          }}
                        >
                          {currentCard.meaning}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* KHUNG NGHĨA ĐỐI ỨNG: CELL C1 (VIETNAMESE / JAPANESE) */}
                  <div style={{ width: '100%', marginBottom: '2rem' }}>
                    {!showAnswer ? (
                      /* TRẠNG THÁI CHE MỜ (ACTIVE NEURAL RETRIEVAL) */
                      <div
                        onClick={handleReveal}
                        style={{
                          padding: '2rem 1.5rem',
                          borderRadius: '16px',
                          border: '2px dashed #AF7E36',
                          background: '#FAF6EE',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <div style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>❓</div>
                        <div
                          style={{
                            fontFamily: 'var(--font-mincho)',
                            fontWeight: 800,
                            fontSize: '1.05rem',
                            color: '#AF7E36',
                          }}
                        >
                          {drillDirection === 'forward'
                            ? 'Bấm phím SPACE hoặc nhấp chuột vào đây để HIỆN NGHĨA TIẾNG VIỆT'
                            : 'Bấm phím SPACE hoặc nhấp chuột để ĐỐI CHIẾU CHỮ HÁN & CÁCH ĐỌC'}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: '#786A5E', fontFamily: 'var(--font-maru)', marginTop: '0.35rem', display: 'block' }}>
                          (Đang đo thời gian phản xạ não bộ Bjork Latency...)
                        </span>
                      </div>
                    ) : (
                      /* TRẠNG THÁI HIỂN THỊ ĐÁP ÁN (REVEALED) */
                      <div
                        style={{
                          padding: '1.5rem',
                          borderRadius: '16px',
                          border: '1.8px solid #386641',
                          background: '#FAF8F5',
                          textAlign: 'left',
                          animation: 'fadeIn 0.2s ease',
                        }}
                      >
                        {drillDirection === 'forward' ? (
                          <div>
                            <div style={{ fontSize: '0.78rem', color: '#786A5E', fontFamily: 'var(--font-maru)', marginBottom: '0.2rem' }}>
                              NGHĨA TIẾNG VIỆT (CELL C1):
                            </div>
                            <div
                              style={{
                                fontFamily: 'var(--font-maru)',
                                fontSize: '1.35rem',
                                fontWeight: 800,
                                color: '#16253B',
                                marginBottom: '0.75rem',
                              }}
                            >
                              {currentCard.meaning}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div style={{ fontSize: '0.78rem', color: '#786A5E', fontFamily: 'var(--font-maru)', marginBottom: '0.2rem' }}>
                              ĐÁP ÁN TIẾNG NHẬT (CELL A1 & B1):
                            </div>
                            <div style={{ fontSize: '1.1rem', color: '#9E3223', fontWeight: 700 }}>{currentCard.reading}</div>
                            <div style={{ fontFamily: 'var(--font-mincho)', fontSize: '2rem', fontWeight: 900, color: '#16253B', marginBottom: '0.75rem' }}>
                              {currentCard.kanji}
                            </div>
                          </div>
                        )}

                        {/* Câu ví dụ ngữ cảnh i+1 */}
                        {currentCard.sentence && (
                          <div
                            style={{
                              padding: '0.75rem',
                              background: '#EDF2F7',
                              borderRadius: '8px',
                              fontSize: '0.88rem',
                              color: '#16253B',
                              borderLeft: '3px solid #16253B',
                            }}
                          >
                            <span style={{ fontSize: '0.72rem', color: '#786A5E', display: 'block' }}>VÍ DỤ NGỮ CẢNH:</span>
                            {currentCard.sentence}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* THANG ĐO ĐỘ TRỄ PHẢN XẠ BJORK DYNAMICS & ĐÁNH GIÁ FSRS */}
                  {showAnswer && lastLatencyMs !== null && (
                    <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span
                        style={{
                          padding: '0.3rem 0.85rem',
                          borderRadius: '999px',
                          fontSize: '0.82rem',
                          fontFamily: 'var(--font-maru)',
                          fontWeight: 700,
                          background:
                            lastLatencyMs < 1500
                              ? '#EFF4EE'
                              : lastLatencyMs <= 6000
                              ? '#EDF2F7'
                              : '#FBF5E8',
                          color:
                            lastLatencyMs < 1500
                              ? '#386641'
                              : lastLatencyMs <= 6000
                              ? '#16253B'
                              : '#AF7E36',
                          border:
                            lastLatencyMs < 1500
                              ? '1px solid #C6D8C4'
                              : lastLatencyMs <= 6000
                              ? '1px solid #BDCCDC'
                              : '1px solid #E5CCA0',
                        }}
                      >
                        {lastLatencyMs < 1500
                          ? `⚡ ${(lastLatencyMs / 1000).toFixed(1)}s • FSRS Easy (Phản xạ tức thì)`
                          : lastLatencyMs <= 6000
                          ? `⏳ ${(lastLatencyMs / 1000).toFixed(1)}s • FSRS Good (Hồi tưởng chuẩn)`
                          : `⏱️ ${(lastLatencyMs / 1000).toFixed(1)}s • FSRS Hard (Hồi tưởng gắng sức)`}
                      </span>
                    </div>
                  )}

                  {/* 2 NÚT HÀNH ĐỘNG CỐT LÕI: ĐÃ THUỘC (ENTER/1) & CHƯA THUỘC (BKSP/2) */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1rem',
                      width: '100%',
                      maxWidth: '560px',
                    }}
                  >
                    <button
                      type="button"
                      disabled={!showAnswer}
                      onClick={handleUnlearned}
                      style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        border: '1.5px solid #9E3223',
                        background: showAnswer ? '#FDF2F0' : '#FAF8F5',
                        color: showAnswer ? '#9E3223' : '#A89F91',
                        cursor: showAnswer ? 'pointer' : 'not-allowed',
                        fontFamily: 'var(--font-maru)',
                        fontWeight: 700,
                        fontSize: '1rem',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', opacity: 0.8 }}>Backspace / Phím 2</div>
                      <div>CHƯA THUỘC ➔ Nợ D-E-F</div>
                    </button>

                    <button
                      type="button"
                      disabled={!showAnswer}
                      onClick={handleMastered}
                      style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        border: '1.5px solid #386641',
                        background: showAnswer ? '#386641' : '#FAF8F5',
                        color: showAnswer ? '#FFFFFF' : '#A89F91',
                        cursor: showAnswer ? 'pointer' : 'not-allowed',
                        fontFamily: 'var(--font-maru)',
                        fontWeight: 700,
                        fontSize: '1rem',
                        transition: 'all 0.15s ease',
                        boxShadow: showAnswer ? '0 4px 12px rgba(56, 102, 65, 0.25)' : 'none',
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', opacity: 0.85 }}>Enter / Phím 1</div>
                      <div>ĐÃ THUỘC ➔ Xóa Khỏi Phiên</div>
                    </button>
                  </div>
                </div>
              )}

              {/* THANH CHỈ DẪN PHÍM TẮT DÒ BÀI (HOTKEYS BAR) */}
              <DoBaiHotkeysBar
                isRevealed={showAnswer}
                onReveal={handleReveal}
                onMastered={handleMastered}
                onRetry={handleUnlearned}
                onUndo={handleUndo}
                canUndo={reviewHistory.length > 0}
                onPronounce={handlePronounce}
              />
            </div>

            {/* CỘT PHỤ: HÀNG ĐỢI CHƯA THUỘC CỘT D-E-F (28% WIDTH) */}
            {unlearnedList.length > 0 && (
              <DoBaiUnlearnedDrawer
                unlearnedList={unlearnedList}
                isOpenMobile={showUnlearnedDrawerMobile}
                onCloseMobile={() => setShowUnlearnedDrawerMobile(false)}
              />
            )}
          </div>
        ) : (
          /* =========================================================================
             B. GIAO DIỆN THẺ BÀI TRUYỀN THỐNG HYAKUNIN ISSHU KARUTA 3D (RETAINED)
             ========================================================================= */
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            {currentCard && (
              <div
                className={`karuta-3d-scene ${showAnswer ? 'flipped' : ''}`}
                style={{
                  minHeight: '440px',
                  padding: '2.5rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  marginBottom: '1.5rem',
                  background: showAnswer ? 'linear-gradient(180deg, #FAF8F2 0%, #F7F4EB 100%)' : '#FAF8F2',
                  border: showAnswer ? '2px solid #485642' : '2px solid #AF7E36',
                  borderRadius: '18px',
                  boxShadow: '0 12px 32px rgba(22, 37, 59, 0.08)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'border-color 0.4s ease, background 0.4s ease',
                }}
              >
                <JapaneseArtBackdrop
                  src="/assets/art/rinpa-gold-waves-clouds.jpg"
                  alt="Mây và sóng vàng Rinpa nghệ thuật"
                  opacity={0.15}
                  blendMode="multiply"
                  objectPosition="center"
                />

                <div
                  style={{
                    position: 'absolute',
                    top: '1.25rem',
                    right: '1.25rem',
                    fontFamily: 'var(--font-mincho)',
                    fontSize: '0.82rem',
                    color: '#FFFFFF',
                    background: showAnswer ? '#485642' : '#9E3223',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '4px',
                    fontWeight: 800,
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                    zIndex: 3,
                  }}
                >
                  {showAnswer ? '解答' : '出題'}
                </div>

                {/* PARSED CARD DETAILS HELPER */}
                {(() => {
                  const parsedCard = currentCard
                    ? parseCardDetails({
                        type: currentCard.type,
                        reading: currentCard.reading,
                        meaning: currentCard.meaning,
                        kanji: currentCard.kanji,
                        deckName: currentCard.deckName,
                        sentence: currentCard.sentence,
                      })
                    : null;

                  return (
                    <>
                      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem', width: '100%' }}>
                        {/* DEF-UI-KARUTA-002: BẢO VỆ ACTIVE RECALL — KHÔNG HIỆN CÁCH ĐỌC Ở MẶT TRƯỚC */}
                        {showAnswer && currentCard.reading && (
                          <div style={{ fontSize: '1.15rem', color: '#9E3223', fontFamily: 'var(--font-maru)', fontWeight: 700 }}>
                            {currentCard.reading}
                          </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.85rem', width: '100%' }}>
                          <div
                            style={{
                              fontFamily: 'var(--font-mincho)',
                              fontSize: 'clamp(2.4rem, 6vw, 4rem)',
                              fontWeight: 900,
                              color: '#1A1918',
                              lineHeight: 1.25,
                            }}
                          >
                            {currentCard.kanji}
                          </div>
                          <JapaneseSpeakerButton text={stripCloze(currentCard.kanji)} size={26} />
                        </div>

                        {showAnswer && parsedCard?.hanViet && (
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              background: '#FDF2F0',
                              border: '1.5px solid #E8A99F',
                              color: '#9E3223',
                              padding: '0.25rem 0.95rem',
                              borderRadius: '999px',
                              fontSize: '0.88rem',
                              fontFamily: 'var(--font-mincho)',
                              fontWeight: 800,
                            }}
                          >
                            漢 Âm Hán: {parsedCard.hanViet}
                          </div>
                        )}
                      </div>

                      {/* NỘI DUNG MẶT SAU: Ý NGHĨA VÀ VÍ DỤ */}
                      {showAnswer ? (
                        <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>
                          <div
                            style={{
                              fontSize: '1.25rem',
                              fontFamily: 'var(--font-maru)',
                              fontWeight: 800,
                              color: '#16253B',
                              marginBottom: '0.75rem',
                            }}
                          >
                            {currentCard.meaning}
                          </div>

                          {currentCard.sentence && (
                            <div
                              style={{
                                padding: '0.85rem 1rem',
                                background: 'rgba(255, 255, 255, 0.85)',
                                borderRadius: '12px',
                                border: '1px solid #E6DDCF',
                                fontSize: '0.9rem',
                                color: '#16253B',
                                marginBottom: '1rem',
                              }}
                            >
                              {currentCard.sentence}
                            </div>
                          )}

                          {/* KANJISTROKEPLAYER INLINE VECTOR CHO THẺ CHỮ HÁN */}
                          {isKanji && (
                            <div style={{ margin: '1rem 0' }}>
                              <button
                                type="button"
                                onClick={() => setShowStrokeOrder(!showStrokeOrder)}
                                style={{
                                  fontSize: '0.78rem',
                                  fontFamily: 'var(--font-maru)',
                                  fontWeight: 700,
                                  padding: '0.35rem 0.75rem',
                                  borderRadius: '6px',
                                  background: '#FAF6EE',
                                  border: '1px solid #D8CFC0',
                                  color: '#16253B',
                                  cursor: 'pointer',
                                }}
                              >
                                {showStrokeOrder ? 'Ẩn nét viết' : 'Xem nét viết 筆順'}
                              </button>
                              {showStrokeOrder && (
                                <div style={{ marginTop: '0.75rem' }}>
                                  <KanjiStrokePlayer kanji={currentCard.kanji} compact />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ position: 'relative', zIndex: 2, marginTop: '1.5rem' }}>
                          <button onClick={handleReveal} className="btn-torii" style={{ padding: '0.75rem 1.75rem' }}>
                            Xem đáp án (Phím Space)
                          </button>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            {/* 4 NÚT CHẤM ĐIỂM FSRS TRONG CHẾ ĐỘ THẺ BÀI KARUTA */}
            {showAnswer && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0.65rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => handleGrade('Again')}
                  style={{
                    padding: '0.75rem 0.5rem',
                    borderRadius: '10px',
                    border: '1px solid #9E3223',
                    background: '#FDF2F0',
                    color: '#9E3223',
                    fontFamily: 'var(--font-maru)',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: '0.7rem' }}>Phím 1</div>
                  <div>Again</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleGrade('Hard')}
                  style={{
                    padding: '0.75rem 0.5rem',
                    borderRadius: '10px',
                    border: '1px solid #AF7E36',
                    background: '#FBF5E8',
                    color: '#AF7E36',
                    fontFamily: 'var(--font-maru)',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: '0.7rem' }}>Phím 2</div>
                  <div>Hard</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleGrade('Good')}
                  style={{
                    padding: '0.75rem 0.5rem',
                    borderRadius: '10px',
                    border: '1px solid #16253B',
                    background: '#EDF2F7',
                    color: '#16253B',
                    fontFamily: 'var(--font-maru)',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: '0.7rem' }}>Phím 3</div>
                  <div>Good</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleGrade('Easy')}
                  style={{
                    padding: '0.75rem 0.5rem',
                    borderRadius: '10px',
                    border: '1px solid #386641',
                    background: '#EFF4EE',
                    color: '#386641',
                    fontFamily: 'var(--font-maru)',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: '0.7rem' }}>Phím 4</div>
                  <div>Easy</div>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<ReviewLoadingSkeleton />}>
      <ReviewSessionContent />
    </Suspense>
  );
}
