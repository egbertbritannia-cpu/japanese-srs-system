'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ToriiIcon, SensuFanIcon } from '@/components/japanese/Icons';
import { JapaneseSpeakerButton } from '@/components/japanese/JapaneseSpeakerButton';
import { japaneseAudio } from '@/components/japanese/AudioEffects';
import { JapaneseArtBackdrop } from '@/components/art/JapaneseArtBackdrop';
import {
  getAllVerbs,
  evaluateConjugation,
  romajiToHiragana,
  VerbItem,
  EvaluationResult,
} from '@/lib/conjugation-engine';

export default function ConjugationPage() {
  const allVerbs = getAllVerbs();

  // Tab chế độ: theory (Lý thuyết), drill (Luyện điền từ), speed (Lướt nhanh)
  const [mode, setMode] = useState<'drill' | 'theory' | 'speed'>('drill');

  // Lọc theo nhóm
  const [selectedGroup, setSelectedGroup] = useState<1 | 2 | 3 | 'exceptions' | 'all'>('all');

  // Thể cần luyện tập: 'te' hoặc 'ru'
  const [targetForm, setTargetForm] = useState<'te' | 'ru'>('te');

  // Từ khóa tìm kiếm trong bảng tra cứu (Chế độ lý thuyết)
  const [searchQuery, setSearchQuery] = useState('');

  // Chế độ Điền từ (Input Drill State)
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showAnswerHint, setShowAnswerHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Chế độ Lướt nhanh (Speed Drill State)
  const [speedIdx, setSpeedIdx] = useState(0);
  const [isSpeedFlipped, setIsSpeedFlipped] = useState(false);

  // Bộ lọc danh sách động từ hiện tại
  const filteredVerbs = allVerbs.filter((v) => {
    if (selectedGroup === 'all') return true;
    if (selectedGroup === 'exceptions') return v.isException;
    return v.group === selectedGroup;
  });

  // Bộ lọc danh sách tra cứu lý thuyết kết hợp tìm kiếm realtime
  const searchedVerbs = filteredVerbs.filter((v) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      v.kanji.toLowerCase().includes(q) ||
      v.hiragana.toLowerCase().includes(q) ||
      v.romaji.toLowerCase().includes(q) ||
      v.meaning_vi.toLowerCase().includes(q) ||
      v.te_form.hiragana.toLowerCase().includes(q) ||
      v.ru_form.hiragana.toLowerCase().includes(q)
    );
  });

  const currentVerb = filteredVerbs[currentIdx % filteredVerbs.length] || allVerbs[0];
  const speedVerb = filteredVerbs[speedIdx % filteredVerbs.length] || allVerbs[0];

  // Tự động focus vào input khi đổi câu
  useEffect(() => {
    if (mode === 'drill') {
      inputRef.current?.focus();
    }
  }, [currentIdx, mode, targetForm]);

  // Xử lý nộp câu trả lời điền từ
  const handleSubmitAnswer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInput.trim()) return;

    const result = evaluateConjugation(userInput, currentVerb, targetForm);
    setEvaluation(result);

    setScore((prev) => ({
      correct: prev.correct + (result.isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    if (result.isCorrect) {
      japaneseAudio.playSuzuBell();
      setTimeout(() => {
        handleNextQuestion();
      }, 1200);
    }
  };

  const handleNextQuestion = () => {
    setUserInput('');
    setEvaluation(null);
    setShowAnswerHint(false);
    setCurrentIdx((prev) => (prev + 1) % filteredVerbs.length);
  };

  return (
    <div style={{ maxWidth: '960px', margin: '1.5rem auto', padding: '0 1.25rem 4rem' }}>
      {/* 1. HERO BANNER MỘC BẢN PHÚ SĨ (Awwwards-Tier Editorial Hero) */}
      <div
        className="bento-card-artisan"
        style={{
          padding: '2.5rem 2.25rem',
          marginBottom: '1.75rem',
          border: '1.5px solid rgba(200, 155, 88, 0.45)',
          background: 'linear-gradient(135deg, #0A1C33 0%, #153255 60%, #0E243E 100%)',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, opacity: 0.32, pointerEvents: 'none', zIndex: 0 }}>
          <Image
            src="/assets/art/hokusai-suwa-lake.jpg"
            alt="Tranh mộc bản Hokusai Hồ Suwa"
            fill
            sizes="100vw"
            priority
            style={{ objectFit: 'cover', objectPosition: 'center 38%' }}
          />
        </div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-mincho)',
                background: '#C83824',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.74rem',
                padding: '0.22rem 0.7rem',
                borderRadius: '4px',
                letterSpacing: '0.1em',
                boxShadow: '0 2px 8px rgba(200, 56, 36, 0.4)',
              }}
            >
              動詞の道 · ĐỘNG TỪ
            </span>
            <span style={{ fontSize: '0.82rem', color: '#E8D9BD', fontFamily: 'var(--font-maru)', letterSpacing: '0.02em' }}>
              Thể Te (て) &amp; Thể Ru (る) · Song ngữ Kana / Romaji
            </span>
          </div>

          <h1
            className="editorial-hero-title"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.3rem)',
              margin: '0 0 0.5rem 0',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
              color: '#FAF8F5',
            }}
          >
            Luyện chia động từ tiếng Nhật
          </h1>

          <p style={{ color: 'rgba(250, 248, 245, 0.9)', fontSize: '0.92rem', lineHeight: 1.55, margin: '0 0 1.25rem 0' }}>
            50 động từ cốt lõi, quy tắc âm biến ngũ đoạn và bài ca vần thể Te. Cho phép gõ trực tiếp Hiragana hoặc Romaji.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link
              href="/"
              className="btn-washi"
              style={{
                padding: '0.55rem 1.15rem',
                fontSize: '0.86rem',
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            >
              ← Trang chủ
            </Link>
            <Link
              href="/cards"
              className="btn-washi"
              style={{
                padding: '0.55rem 1.15rem',
                fontSize: '0.86rem',
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            >
              Bộ thẻ
            </Link>
          </div>
        </div>

        {/* Khung số liệu thành tích kiểu Kifuda sang trọng */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            border: '1.2px solid rgba(200, 155, 88, 0.5)',
            borderRadius: '16px',
            padding: '1.25rem 1.6rem',
            background: 'rgba(10, 28, 51, 0.8)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            textAlign: 'center',
            minWidth: '140px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
          }}
        >
          <div style={{ fontFamily: 'var(--font-mincho)', fontSize: '2.2rem', fontWeight: 900, color: '#D4AF37' }}>
            {score.total > 0 ? `${Math.round((score.correct / score.total) * 100)}%` : '50'}
          </div>
          <div style={{ fontFamily: 'var(--font-maru)', fontSize: '0.78rem', color: '#E8D9BD', marginTop: '0.2rem' }}>
            {score.total > 0 ? `Đúng ${score.correct}/${score.total} câu` : 'Động từ thông dụng'}
          </div>
        </div>
      </div>

      {/* 2. CHUYỂN ĐỔI CHẾ ĐỘ & BỘ LỌC TỐI GIẢN */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
          borderBottom: '1.2px solid var(--washi-border)',
          paddingBottom: '0.85rem',
        }}
      >
        {/* 3 Tabs chế độ học */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setMode('drill')}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '10px',
              border: mode === 'drill' ? '1px solid #1E4B75' : '1px solid var(--washi-border)',
              background: mode === 'drill' ? '#1E4B75' : '#FFFFFF',
              color: mode === 'drill' ? '#FFFFFF' : '#122438',
              fontFamily: 'var(--font-maru)',
              fontWeight: mode === 'drill' ? 800 : 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: mode === 'drill' ? '0 2px 8px rgba(30, 75, 117, 0.3)' : 'var(--shadow-washi-sm)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            ✍️ Luyện điền từ
          </button>
          <button
            onClick={() => setMode('speed')}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '10px',
              border: mode === 'speed' ? '1px solid #1E4B75' : '1px solid var(--washi-border)',
              background: mode === 'speed' ? '#1E4B75' : '#FFFFFF',
              color: mode === 'speed' ? '#FFFFFF' : '#122438',
              fontFamily: 'var(--font-maru)',
              fontWeight: mode === 'speed' ? 800 : 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: mode === 'speed' ? '0 2px 8px rgba(30, 75, 117, 0.3)' : 'var(--shadow-washi-sm)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            ⚡ Lướt nhanh
          </button>
          <button
            onClick={() => setMode('theory')}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '10px',
              border: mode === 'theory' ? '1px solid #1E4B75' : '1px solid var(--washi-border)',
              background: mode === 'theory' ? '#1E4B75' : '#FFFFFF',
              color: mode === 'theory' ? '#FFFFFF' : '#122438',
              fontFamily: 'var(--font-maru)',
              fontWeight: mode === 'theory' ? 800 : 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: mode === 'theory' ? '0 2px 8px rgba(30, 75, 117, 0.3)' : 'var(--shadow-washi-sm)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            📖 Cẩm nang Bento
          </button>
        </div>

        {/* Lựa chọn thể cần luyện */}
        {mode !== 'theory' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ fontSize: '0.82rem', color: '#786A5E', fontWeight: 700, fontFamily: 'var(--font-maru)' }}>
              Thể:
            </span>
            <button
              onClick={() => { setTargetForm('te'); setEvaluation(null); setUserInput(''); }}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: '8px',
                border: '1.2px solid',
                borderColor: targetForm === 'te' ? '#C83824' : 'var(--washi-border)',
                background: targetForm === 'te' ? '#C83824' : '#FFFFFF',
                color: targetForm === 'te' ? '#FFFFFF' : '#122438',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: targetForm === 'te' ? '0 2px 6px rgba(200, 56, 36, 0.25)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              Thể Te (て)
            </button>
            <button
              onClick={() => { setTargetForm('ru'); setEvaluation(null); setUserInput(''); }}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: '8px',
                border: '1.2px solid',
                borderColor: targetForm === 'ru' ? '#1E4B75' : 'var(--washi-border)',
                background: targetForm === 'ru' ? '#1E4B75' : '#FFFFFF',
                color: targetForm === 'ru' ? '#FFFFFF' : '#122438',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: targetForm === 'ru' ? '0 2px 8px rgba(30, 75, 117, 0.25)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              Thể Ru (る)
            </button>
          </div>
        )}
      </div>

      {/* BỘ LỌC THEO NHÓM ĐỘNG TỪ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
        <span style={{ fontSize: '0.8rem', color: '#786A5E', fontWeight: 700 }}>
          Nhóm:
        </span>
        {[
          { id: 'all', label: `Tất cả (${allVerbs.length})` },
          { id: 1, label: 'Nhóm 1 (34)' },
          { id: 2, label: 'Nhóm 2 (13)' },
          { id: 3, label: 'Nhóm 3 (3)' },
          { id: 'exceptions', label: '★ Ngoại lệ (6)' },
        ].map((item) => {
          const isActive = selectedGroup === item.id;
          return (
            <button
              key={String(item.id)}
              onClick={() => {
                setSelectedGroup(item.id as any);
                setCurrentIdx(0);
                setSpeedIdx(0);
                setEvaluation(null);
                setUserInput('');
              }}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: isActive ? '#1E4B75' : 'var(--washi-border)',
                background: isActive ? '#1E4B75' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#122438',
                fontSize: '0.8rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          CHẾ ĐỘ 1: LUYỆN ĐIỀN TỪ (INPUT DRILL - High-Aesthetic Card)
          ========================================================================= */}
      {mode === 'drill' && (
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div
            className="bento-card-artisan"
            style={{
              padding: '2.5rem 2.25rem',
              background: '#FFFFFF',
            }}
          >
            <JapaneseArtBackdrop
              src="/assets/art/gold-sakura-washi.jpg"
              alt="Họa tiết Washi"
              opacity={0.06}
              blendMode="multiply"
            />

            {/* Chỉ báo thứ tự câu */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span
                className="micro-badge-label"
                style={{
                  background: currentVerb.group === 1 ? '#EDF4FA' : currentVerb.group === 2 ? '#EBF5EE' : '#FDF2F0',
                  color: currentVerb.group === 1 ? '#1E4B75' : currentVerb.group === 2 ? '#2A6B3D' : '#C83824',
                  border: `1px solid ${currentVerb.group === 1 ? '#B8D5E5' : currentVerb.group === 2 ? '#C2E5CC' : '#F5C6CB'}`,
                }}
              >
                Nhóm {currentVerb.group} {currentVerb.isException ? '★ Ngoại lệ' : ''}
              </span>

              <span style={{ fontFamily: 'var(--font-mincho)', fontWeight: 800, fontSize: '0.92rem', color: '#786A5E' }}>
                {currentIdx + 1} / {filteredVerbs.length}
              </span>
            </div>

            {/* Động từ mục tiêu */}
            <div style={{ textAlign: 'center', margin: '1.25rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mincho)',
                    fontSize: 'clamp(2.8rem, 6vw, 3.5rem)',
                    fontWeight: 900,
                    color: '#122438',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {currentVerb.kanji}
                </span>
                <JapaneseSpeakerButton text={currentVerb.kanji} size={28} />
              </div>

              <div style={{ fontFamily: 'var(--font-maru)', fontSize: '1.25rem', color: '#B87B28', fontWeight: 700, marginTop: '0.25rem' }}>
                {currentVerb.hiragana} ({currentVerb.romaji})
              </div>

              <div style={{ fontSize: '1.05rem', color: '#122438', fontWeight: 600, marginTop: '0.5rem' }}>
                Ý nghĩa: <strong>{currentVerb.meaning_vi}</strong>
              </div>
            </div>

            {/* Đề bài yêu cầu */}
            <div
              style={{
                textAlign: 'center',
                margin: '1.5rem 0 1rem',
                padding: '0.75rem',
                background: 'var(--washi-bg)',
                border: '1px solid var(--washi-border)',
                borderRadius: '10px',
                color: '#122438',
                fontWeight: 700,
                fontSize: '0.92rem',
                fontFamily: 'var(--font-maru)',
              }}
            >
              👉 Điền <strong>{targetForm === 'te' ? 'Thể Te (て形)' : 'Thể Ru (辞書形)'}</strong> của từ này:
            </div>

            {/* Form nhập đáp án */}
            <form onSubmit={handleSubmitAnswer} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ position: 'relative' }}>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Gõ Hiragana (たべて) hoặc Romaji (tabete)..."
                  value={userInput}
                  onChange={(e) => {
                    setUserInput(e.target.value);
                    if (evaluation) setEvaluation(null);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.95rem 1.25rem',
                    borderRadius: '12px',
                    border: '1.5px solid',
                    borderColor: evaluation
                      ? evaluation.isCorrect
                        ? '#2A6B3D'
                        : '#C83824'
                      : '#D4AF37',
                    fontSize: '1.2rem',
                    color: '#122438',
                    fontFamily: 'var(--font-sans)',
                    outline: 'none',
                    background: '#FFFFFF',
                    textAlign: 'center',
                    fontWeight: 700,
                    boxShadow: 'var(--shadow-washi-sm)',
                  }}
                />

                {/* Bản xem trước Hiragana tức thì khi gõ Romaji */}
                {userInput.trim() && (
                  <div style={{ marginTop: '0.4rem', textAlign: 'center', fontSize: '0.85rem', color: '#786A5E', fontFamily: 'var(--font-maru)' }}>
                    Nhận diện: <strong>{romajiToHiragana(userInput)}</strong>
                  </div>
                )}
              </div>

              {/* Nút hành động ngắn gọn chuẩn 1-2 từ */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  className="btn-torii"
                  style={{ flex: 1, padding: '0.85rem', fontSize: '0.95rem' }}
                >
                  <ToriiIcon size={16} color="#FFFFFF" />
                  Kiểm tra
                </button>
                <button
                  type="button"
                  onClick={() => setShowAnswerHint(!showAnswerHint)}
                  className="btn-washi"
                  style={{ padding: '0.85rem 1.15rem', fontSize: '0.9rem' }}
                >
                  Gợi ý
                </button>
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="btn-washi"
                  style={{ padding: '0.85rem 1.15rem', fontSize: '0.9rem' }}
                >
                  Bỏ qua →
                </button>
              </div>
            </form>

            {/* Phản hồi sau khi chấm điểm */}
            {evaluation && (
              <div
                style={{
                  marginTop: '1.25rem',
                  padding: '1.1rem 1.25rem',
                  borderRadius: '14px',
                  background: evaluation.isCorrect ? '#EBF5EE' : '#FFF2F0',
                  border: `1.2px solid ${evaluation.isCorrect ? '#A3D9B1' : '#F5C6CB'}`,
                  color: evaluation.isCorrect ? '#265C35' : '#A32415',
                  boxShadow: 'var(--shadow-washi-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1rem', fontFamily: 'var(--font-maru)' }}>
                  {evaluation.isCorrect ? '✓ Hoàn toàn chính xác!' : '✗ Chưa đúng!'}
                </div>

                <div style={{ marginTop: '0.45rem', fontSize: '0.95rem' }}>
                  Đáp án chuẩn: <strong>{evaluation.expectedKanji}</strong> ({evaluation.expectedHiragana} / {evaluation.expectedRomaji})
                </div>

                {evaluation.ruleExplanation && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.86rem', lineHeight: 1.5, borderTop: '1px dashed rgba(0,0,0,0.15)', paddingTop: '0.5rem' }}>
                    💡 {evaluation.ruleExplanation}
                  </div>
                )}
              </div>
            )}

            {/* Khung gợi ý đáp án */}
            {showAnswerHint && !evaluation && (
              <div style={{ marginTop: '1rem', padding: '0.9rem', background: '#FFF9E6', border: '1px solid #FFEAA7', borderRadius: '10px', fontSize: '0.88rem', color: '#8A6D1C' }}>
                💡 Gợi ý: Thể Masu là <strong>{currentVerb.masu_form.kanji}</strong> ({currentVerb.masu_form.hiragana}).
                {currentVerb.group === 1 && ' Nhóm 1 hãy chú ý đuôi âm để áp dụng đúng quy tắc biến âm!'}
              </div>
            )}

            {/* Câu ví dụ ứng dụng */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.1rem', borderTop: '1px solid var(--washi-border)' }}>
              <div className="micro-badge-label" style={{ color: '#786A5E', padding: 0, marginBottom: '0.35rem' }}>
                CÂU VÍ DỤ ỨNG DỤNG
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mincho)', fontSize: '1rem', color: '#122438', fontWeight: 700 }}>
                  {currentVerb.example.sentence}
                </span>
                <JapaneseSpeakerButton text={currentVerb.example.sentence} size={20} />
              </div>
              <p style={{ fontSize: '0.85rem', color: '#786A5E', margin: '0.25rem 0 0' }}>
                {currentVerb.example.meaning}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CHẾ ĐỘ 2: HỌC LƯỚT NHANH (SPEED DRILL - 3D Tactile Card)
          ========================================================================= */}
      {mode === 'speed' && (
        <div style={{ maxWidth: '620px', margin: '0 auto' }}>
          <div
            onClick={() => setIsSpeedFlipped(!isSpeedFlipped)}
            className="bento-card-artisan"
            style={{
              padding: '3rem 2rem',
              textAlign: 'center',
              cursor: 'pointer',
              minHeight: '340px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              background: '#FFFFFF',
              border: '1.5px solid rgba(200, 155, 88, 0.45)',
            }}
          >
            <JapaneseArtBackdrop
              src="/assets/art/gold-sakura-washi.jpg"
              alt="Họa tiết"
              opacity={0.06}
              blendMode="multiply"
            />

            <span
              className="micro-badge-label"
              style={{
                position: 'absolute',
                top: '1.25rem',
                left: '1.25rem',
                background: speedVerb.group === 1 ? '#EDF4FA' : '#EBF5EE',
                color: speedVerb.group === 1 ? '#1E4B75' : '#2A6B3D',
              }}
            >
              Nhóm {speedVerb.group} {speedVerb.isException ? '★ Ngoại lệ' : ''}
            </span>

            <span style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', fontSize: '0.88rem', color: '#786A5E', fontWeight: 700 }}>
              {speedIdx + 1} / {filteredVerbs.length}
            </span>

            {!isSpeedFlipped ? (
              // MẶT TRƯỚC
              <div>
                <div style={{ fontFamily: 'var(--font-mincho)', fontSize: 'clamp(3rem, 7vw, 4rem)', fontWeight: 900, color: '#122438' }}>
                  {speedVerb.kanji}
                </div>
                <div style={{ fontFamily: 'var(--font-maru)', fontSize: '1.35rem', color: '#B87B28', fontWeight: 700, marginTop: '0.4rem' }}>
                  {speedVerb.hiragana} ({speedVerb.romaji})
                </div>
                <div style={{ fontSize: '1.25rem', color: '#122438', fontWeight: 700, marginTop: '0.65rem' }}>
                  {speedVerb.meaning_vi}
                </div>
                <p style={{ color: '#786A5E', fontSize: '0.84rem', marginTop: '1.5rem', fontFamily: 'var(--font-maru)' }}>
                  (Nhấp vào thẻ để lật xem cách chia)
                </p>
              </div>
            ) : (
              // MẶT SAU
              <div style={{ width: '100%' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ background: '#FAF8F5', padding: '1.1rem', borderRadius: '14px', border: '1px solid var(--washi-border)' }}>
                    <div className="micro-badge-label" style={{ color: '#C83824', padding: 0 }}>THỂ TE (て形)</div>
                    <div style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.65rem', fontWeight: 800, color: '#122438', marginTop: '0.25rem' }}>
                      {speedVerb.te_form.kanji}
                    </div>
                    <div style={{ fontSize: '0.88rem', color: '#786A5E', marginTop: '0.2rem' }}>
                      {speedVerb.te_form.hiragana} ({speedVerb.te_form.romaji})
                    </div>
                  </div>

                  <div style={{ background: '#FAF8F5', padding: '1.1rem', borderRadius: '14px', border: '1px solid var(--washi-border)' }}>
                    <div className="micro-badge-label" style={{ color: '#1E4B75', padding: 0 }}>THỂ MASU (ます)</div>
                    <div style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.65rem', fontWeight: 800, color: '#122438', marginTop: '0.25rem' }}>
                      {speedVerb.masu_form.kanji}
                    </div>
                    <div style={{ fontSize: '0.88rem', color: '#786A5E', marginTop: '0.2rem' }}>
                      {speedVerb.masu_form.hiragana} ({speedVerb.masu_form.romaji})
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.95rem', color: '#122438', fontStyle: 'italic' }}>
                  &ldquo;{speedVerb.example.sentence}&rdquo;
                </div>
                <div style={{ fontSize: '0.82rem', color: '#786A5E', marginTop: '0.25rem' }}>
                  {speedVerb.example.meaning}
                </div>
              </div>
            )}
          </div>

          {/* Nút lướt câu tiếp theo */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button
              onClick={() => {
                setIsSpeedFlipped(false);
                setSpeedIdx((prev) => (prev - 1 + filteredVerbs.length) % filteredVerbs.length);
              }}
              className="btn-washi"
              style={{ flex: 1, padding: '0.85rem' }}
            >
              ← Lùi
            </button>
            <button
              onClick={() => setIsSpeedFlipped(!isSpeedFlipped)}
              className="btn-washi"
              style={{ flex: 1, padding: '0.85rem' }}
            >
              {isSpeedFlipped ? 'Mặt trước' : 'Lật'}
            </button>
            <button
              onClick={() => {
                setIsSpeedFlipped(false);
                setSpeedIdx((prev) => (prev + 1) % filteredVerbs.length);
              }}
              className="btn-torii"
              style={{ flex: 1, padding: '0.85rem' }}
            >
              Tiếp →
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          CHẾ ĐỘ 3: CẨM NANG BENTO GRID (Awwwards-Tier Asymmetric Bento Layout)
          Enforced by high-aesthetic-designer & openmaic pedagogical principles
          ========================================================================= */}
      {mode === 'theory' && (
        <div className="bento-grid-container">
          {/* BENTO CARD 1: HERO ANCHOR (span 8) - MA TRẬN BIẾN ÂM THỂ TE */}
          <div className="bento-col-8 bento-card-artisan" style={{ padding: '1.75rem 2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="micro-badge-label" style={{ background: '#FCEEEA', color: '#C83824' }}>
                QUY TẮC CỐT LÕI
              </span>
              <span style={{ fontSize: '0.8rem', color: '#786A5E' }}>て形の音便法則</span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.45rem', color: '#122438', fontWeight: 800, margin: '0 0 0.85rem 0' }}>
              Ma trận biến âm thể Te (Ngũ đoạn động từ)
            </h2>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#FAF7F0', borderBottom: '1.5px solid var(--washi-border)' }}>
                    <th style={{ padding: '0.65rem 0.75rem' }}>Đuôi nguyên thể</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>Biến âm thể Te</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>Ví dụ minh họa</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--washi-border)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: '#C83824' }}>う, つ, る</td>
                    <td style={{ padding: '0.75rem', fontWeight: 800, color: '#1E4B75' }}>〜 って (âm ngắt)</td>
                    <td style={{ padding: '0.75rem' }}>買う → <strong>買って</strong>, 待つ → <strong>待って</strong>, 取る → <strong>取って</strong></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--washi-border)', background: 'rgba(250,248,245,0.5)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: '#C83824' }}>む, ぶ, ぬ</td>
                    <td style={{ padding: '0.75rem', fontWeight: 800, color: '#1E4B75' }}>〜 んで (âm mũi đục)</td>
                    <td style={{ padding: '0.75rem' }}>飲む → <strong>飲んで</strong>, 遊ぶ → <strong>遊んで</strong>, 死ぬ → <strong>死んで</strong></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--washi-border)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: '#C83824' }}>く (ku)</td>
                    <td style={{ padding: '0.75rem', fontWeight: 800, color: '#1E4B75' }}>〜 いて (âm i)</td>
                    <td style={{ padding: '0.75rem' }}>書く → <strong>書いて</strong>, 聞く → <strong>聞いて</strong></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--washi-border)', background: 'rgba(250,248,245,0.5)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: '#C83824' }}>ぐ (gu)</td>
                    <td style={{ padding: '0.75rem', fontWeight: 800, color: '#1E4B75' }}>〜 いで (âm i đục)</td>
                    <td style={{ padding: '0.75rem' }}>泳ぐ → <strong>泳いで</strong>, 急ぐ → <strong>急いで</strong></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--washi-border)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: '#C83824' }}>す (su)</td>
                    <td style={{ padding: '0.75rem', fontWeight: 800, color: '#1E4B75' }}>〜 して</td>
                    <td style={{ padding: '0.75rem' }}>話す → <strong>話して</strong>, 貸す → <strong>貸して</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* BENTO CARD 2: SATELLITE (span 4) - 3 BƯỚC PHÂN BIỆT NHÓM */}
          <div className="bento-col-4 bento-card-artisan" style={{ padding: '1.75rem' }}>
            <div className="micro-badge-label" style={{ background: '#EBF5EE', color: '#2A6B3D', marginBottom: '0.5rem' }}>
              PHƯƠNG PHÁP NHẬN DIỆN
            </div>
            <h3 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.2rem', color: '#122438', fontWeight: 800, margin: '0 0 0.85rem 0' }}>
              3 Nhóm Động Từ
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.84rem', lineHeight: 1.5 }}>
              <div style={{ padding: '0.65rem 0.8rem', background: '#F0F7F2', borderRadius: '10px', borderLeft: '4px solid #2A6B3D' }}>
                <strong>Nhóm 2 (Ichidan):</strong> Đuôi trước Masu là cột <em>I</em> hoặc <em>E</em> + <em>RU</em>.
                <div style={{ color: '#2A6B3D', fontWeight: 700, marginTop: '0.2rem' }}>Quy tắc: Bỏ る + て/ます</div>
              </div>

              <div style={{ padding: '0.65rem 0.8rem', background: '#EDF4FA', borderRadius: '10px', borderLeft: '4px solid #1E4B75' }}>
                <strong>Nhóm 1 (Godan):</strong> Đa số động từ đuôi cột <em>U</em>.
                <div style={{ color: '#1E4B75', fontWeight: 700, marginTop: '0.2rem' }}>Quy tắc: Biến âm theo đuôi</div>
              </div>

              <div style={{ padding: '0.65rem 0.8rem', background: '#FFF9E6', borderRadius: '10px', borderLeft: '4px solid #B8853C' }}>
                <strong>Nhóm 3 (Bất quy tắc):</strong>
                <div style={{ color: '#B8853C', fontWeight: 700, marginTop: '0.2rem' }}>する → して | 来る → 来て (きて)</div>
              </div>
            </div>
          </div>

          {/* BENTO CARD 3: SATELLITE (span 6) - 6 NGOẠI LỆ BẪY KINH ĐIỂN */}
          <div className="bento-col-6 bento-card-artisan" style={{ padding: '1.75rem' }}>
            <div className="micro-badge-label" style={{ background: '#FFF2F0', color: '#C83824', marginBottom: '0.5rem' }}>
              CỰC KỲ DỄ NHẦM
            </div>
            <h3 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.2rem', color: '#122438', fontWeight: 800, margin: '0 0 0.75rem 0' }}>
              6 Động Từ Ngoại Lệ
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#786A5E', margin: '0 0 0.85rem 0' }}>
              Các từ đuôi nhìn giống Nhóm 2 nhưng thực tế thuộc <strong>Nhóm 1</strong>, hoặc biến âm khác biệt:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem', fontSize: '0.84rem' }}>
              <div style={{ padding: '0.5rem 0.7rem', background: '#FAF8F5', borderRadius: '8px', border: '1px solid var(--washi-border)' }}>
                <strong>1. 行く (iku):</strong> Đi<br />
                <span style={{ color: '#C83824', fontWeight: 800 }}>→ 行って (itte)</span> (không chia iite!)
              </div>
              <div style={{ padding: '0.5rem 0.7rem', background: '#FAF8F5', borderRadius: '8px', border: '1px solid var(--washi-border)' }}>
                <strong>2. 帰る (kaeru):</strong> Về<br />
                <span style={{ color: '#1E4B75', fontWeight: 800 }}>→ 帰って (Nhóm 1)</span>
              </div>
              <div style={{ padding: '0.5rem 0.7rem', background: '#FAF8F5', borderRadius: '8px', border: '1px solid var(--washi-border)' }}>
                <strong>3. 切る (kiru):</strong> Cắt<br />
                <span style={{ color: '#1E4B75', fontWeight: 800 }}>→ 切って (Nhóm 1)</span>
              </div>
              <div style={{ padding: '0.5rem 0.7rem', background: '#FAF8F5', borderRadius: '8px', border: '1px solid var(--washi-border)' }}>
                <strong>4. 知る (shiru):</strong> Biết<br />
                <span style={{ color: '#1E4B75', fontWeight: 800 }}>→ 知って (Nhóm 1)</span>
              </div>
              <div style={{ padding: '0.5rem 0.7rem', background: '#FAF8F5', borderRadius: '8px', border: '1px solid var(--washi-border)' }}>
                <strong>5. 入る (hairu):</strong> Vào<br />
                <span style={{ color: '#1E4B75', fontWeight: 800 }}>→ 入って (Nhóm 1)</span>
              </div>
              <div style={{ padding: '0.5rem 0.7rem', background: '#FAF8F5', borderRadius: '8px', border: '1px solid var(--washi-border)' }}>
                <strong>6. 走る (hashiru):</strong> Chạy<br />
                <span style={{ color: '#1E4B75', fontWeight: 800 }}>→ 走って (Nhóm 1)</span>
              </div>
            </div>
          </div>

          {/* BENTO CARD 4: SATELLITE (span 6) - BÀI CA VẦN BIẾN ÂM THỂ TE */}
          <div className="bento-col-6 bento-card-artisan" style={{ padding: '1.75rem', background: 'linear-gradient(135deg, #FAF7F0 0%, #F5EFE3 100%)' }}>
            <div className="micro-badge-label" style={{ background: '#FFF9E6', color: '#B8853C', marginBottom: '0.5rem' }}>
              MẸO NHỚ THẦN TỐC
            </div>
            <h3 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.2rem', color: '#122438', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
              Bài Ca Vần Biến Âm Thể Te
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#786A5E', margin: '0 0 0.85rem 0' }}>
              Học thuộc 4 câu thơ dân gian để nhớ trọn vẹn quy tắc biến âm chỉ sau 30 giây:
            </p>

            <div
              style={{
                fontFamily: 'var(--font-maru)',
                fontSize: '0.92rem',
                lineHeight: 1.8,
                color: '#122438',
                background: '#FFFFFF',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                border: '1px solid var(--washi-border)',
                boxShadow: 'var(--shadow-washi-sm)',
              }}
            >
              🎵 <strong>I - Chi - Ri</strong> biến thành <strong>TTE</strong> (って)<br />
              🎵 <strong>Mi - Bi - Ni</strong> biến thành <strong>NDE</strong> (んで)<br />
              🎵 <strong>Ki</strong> thành <strong>ITE</strong>, <strong>Gi</strong> thành <strong>IDE</strong><br />
              🎵 <strong>Shi</strong> giữ nguyên <strong>SHITE</strong>, <strong>Iku</strong> là <strong>ITTE</strong>!
            </div>
          </div>

          {/* BENTO CARD 5: FULL-WIDTH ANCHOR (span 12) - BẢNG TRA CỨU 50 ĐỘNG TỪ CỐT LÕI */}
          <div className="bento-col-12 bento-card-artisan" style={{ padding: '1.75rem 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.45rem', color: '#122438', fontWeight: 800, margin: 0 }}>
                  📚 Tra Cứu 50 Động Từ Cốt Lõi
                </h2>
                <div style={{ fontSize: '0.82rem', color: '#786A5E', marginTop: '0.2rem' }}>
                  Hiển thị {searchedVerbs.length} / {allVerbs.length} động từ
                </div>
              </div>

              {/* Ô TÌM KIẾM NHANH (LIVE SEARCH) */}
              <div style={{ minWidth: '260px' }}>
                <input
                  type="text"
                  placeholder="🔍 Tìm chữ Hán, Hiragana, nghĩa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.95rem',
                    borderRadius: '8px',
                    border: '1.2px solid var(--washi-border)',
                    fontSize: '0.86rem',
                    color: '#122438',
                    outline: 'none',
                    background: '#FFFFFF',
                  }}
                />
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#FAF7F0', borderBottom: '1.5px solid var(--washi-border)' }}>
                    <th style={{ padding: '0.65rem 0.75rem' }}>STT</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>Hán tự</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>Hiragana</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>Nghĩa</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>Nhóm</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>Thể Te (て)</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>Thể Ru (る)</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>Phát âm</th>
                  </tr>
                </thead>
                <tbody>
                  {searchedVerbs.map((v, idx) => (
                    <tr
                      key={v.id}
                      style={{
                        borderBottom: '1px solid var(--washi-border)',
                        background: idx % 2 === 0 ? '#FFFFFF' : 'rgba(250, 248, 245, 0.6)',
                      }}
                    >
                      <td style={{ padding: '0.65rem 0.75rem', color: '#786A5E' }}>{idx + 1}</td>
                      <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'var(--font-mincho)', fontWeight: 800, fontSize: '1.15rem' }}>
                        {v.kanji}
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem', color: '#1E4B75', fontWeight: 600 }}>{v.hiragana}</td>
                      <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600 }}>{v.meaning_vi}</td>
                      <td style={{ padding: '0.65rem 0.75rem' }}>
                        <span
                          className="micro-badge-label"
                          style={{
                            background: v.group === 1 ? '#EDF4FA' : v.group === 2 ? '#EBF5EE' : '#FDF2F0',
                            color: v.group === 1 ? '#1E4B75' : v.group === 2 ? '#2A6B3D' : '#C83824',
                            border: `1px solid ${v.group === 1 ? '#B8D5E5' : v.group === 2 ? '#C2E5CC' : '#F5C6CB'}`,
                          }}
                        >
                          N{v.group} {v.isException ? '★' : ''}
                        </span>
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem', color: '#C83824', fontWeight: 700 }}>
                        {v.te_form.hiragana}
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem', color: '#1E4B75', fontWeight: 700 }}>
                        {v.ru_form.hiragana}
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem' }}>
                        <JapaneseSpeakerButton text={v.kanji} size={18} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
