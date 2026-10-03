'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ToriiIcon, SensuFanIcon } from '@/components/japanese/Icons';
import { JapaneseSpeakerButton } from '@/components/japanese/JapaneseSpeakerButton';
import { japaneseAudio } from '@/components/japanese/AudioEffects';
import { JapaneseArtBackdrop } from '@/components/art/JapaneseArtBackdrop';
import { DarumaMascot } from '@/components/japanese/DarumaMascot';
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
    <div style={{ maxWidth: '920px', margin: '1.5rem auto', padding: '0 1.25rem 4rem' }}>
      {/* 1. HEADER BANNER MỘC BẢN PHÚ SĨ */}
      <div
        style={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          padding: '2.25rem 2rem',
          marginBottom: '1.5rem',
          border: '1.5px solid #C89B58',
          boxShadow: '0 12px 32px rgba(18, 36, 56, 0.1)',
          background: 'linear-gradient(135deg, #10253F 0%, #1D436C 60%, #152E4D 100%)',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, opacity: 0.28, pointerEvents: 'none', zIndex: 0 }}>
          <Image
            src="/assets/art/hokusai-suwa-lake.jpg"
            alt="Tranh mộc bản Hokusai Hồ Suwa"
            fill
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
          />
        </div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '580px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-mincho)',
                background: '#C83824',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.76rem',
                padding: '0.2rem 0.65rem',
                borderRadius: '4px',
                letterSpacing: '0.08em',
              }}
            >
              動詞の道 · ĐỘNG TỪ
            </span>
            <span style={{ fontSize: '0.82rem', color: '#E8D9BD', fontFamily: 'var(--font-maru)' }}>
              Thể Te (て) &amp; Thể Ru (る) Song ngữ Kana/Romaji
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: '2.1rem',
              fontWeight: 800,
              lineHeight: 1.25,
              margin: '0 0 0.4rem 0',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            Luyện chia động từ tiếng Nhật
          </h1>

          <p style={{ color: 'rgba(250, 248, 245, 0.92)', fontSize: '0.9rem', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
            Tổng hợp 50 động từ cốt lõi, quy tắc biến âm thể Te và thể Ru. Cho phép gõ tự do Hiragana hoặc Romaji.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.5rem 1.1rem',
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
                fontFamily: 'var(--font-maru)',
              }}
            >
              ← Trang chủ
            </Link>
            <Link
              href="/cards"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.5rem 1.1rem',
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
                fontFamily: 'var(--font-maru)',
              }}
            >
              Bộ thẻ
            </Link>
          </div>
        </div>

        {/* Khung số liệu thành tích */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            border: '1.5px solid rgba(200, 155, 88, 0.6)',
            borderRadius: '14px',
            padding: '1.1rem 1.5rem',
            background: 'rgba(13, 35, 58, 0.72)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            textAlign: 'center',
            minWidth: '130px',
          }}
        >
          <div style={{ fontFamily: 'var(--font-mincho)', fontSize: '2rem', fontWeight: 900, color: '#C89B58' }}>
            {score.total > 0 ? `${Math.round((score.correct / score.total) * 100)}%` : '50'}
          </div>
          <div style={{ fontFamily: 'var(--font-maru)', fontSize: '0.78rem', color: '#E8D9BD', marginTop: '0.2rem' }}>
            {score.total > 0 ? `Đúng ${score.correct}/${score.total} câu` : 'Động từ thông dụng'}
          </div>
        </div>
      </div>

      {/* 2. CHUYỂN ĐỔI CHẾ ĐỘ & BỘ LỌC */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
          borderBottom: '1.5px solid #E6DDCF',
          paddingBottom: '0.75rem',
        }}
      >
        {/* 3 Tabs chế độ */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setMode('drill')}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              background: mode === 'drill' ? '#1E4B75' : '#F0EBE0',
              color: mode === 'drill' ? '#FFFFFF' : '#122438',
              fontFamily: 'var(--font-maru)',
              fontWeight: mode === 'drill' ? 800 : 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            ✍️ Luyện điền từ
          </button>
          <button
            onClick={() => setMode('speed')}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              background: mode === 'speed' ? '#1E4B75' : '#F0EBE0',
              color: mode === 'speed' ? '#FFFFFF' : '#122438',
              fontFamily: 'var(--font-maru)',
              fontWeight: mode === 'speed' ? 800 : 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            ⚡ Lướt nhanh
          </button>
          <button
            onClick={() => setMode('theory')}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              background: mode === 'theory' ? '#1E4B75' : '#F0EBE0',
              color: mode === 'theory' ? '#FFFFFF' : '#122438',
              fontFamily: 'var(--font-maru)',
              fontWeight: mode === 'theory' ? 800 : 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            📖 Cẩm nang lý thuyết
          </button>
        </div>

        {/* Lựa chọn thể cần luyện */}
        {mode !== 'theory' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.84rem', color: '#786A5E', fontWeight: 600, fontFamily: 'var(--font-maru)' }}>
              Thể:
            </span>
            <button
              onClick={() => { setTargetForm('te'); setEvaluation(null); setUserInput(''); }}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '6px',
                border: '1.2px solid',
                borderColor: targetForm === 'te' ? '#C83824' : '#E6DDCF',
                background: targetForm === 'te' ? '#C83824' : '#FFFFFF',
                color: targetForm === 'te' ? '#FFFFFF' : '#122438',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Thể Te (て形)
            </button>
            <button
              onClick={() => { setTargetForm('ru'); setEvaluation(null); setUserInput(''); }}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '6px',
                border: '1.2px solid',
                borderColor: targetForm === 'ru' ? '#1E4B75' : '#E6DDCF',
                background: targetForm === 'ru' ? '#1E4B75' : '#FFFFFF',
                color: targetForm === 'ru' ? '#FFFFFF' : '#122438',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Thể Ru (辞書形)
            </button>
          </div>
        )}
      </div>

      {/* BỘ LỌC THEO NHÓM ĐỘNG TỪ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.82rem', color: '#786A5E', fontWeight: 600, marginRight: '0.2rem' }}>
          Nhóm:
        </span>
        {[
          { id: 'all', label: `Tất cả (${allVerbs.length})` },
          { id: 1, label: 'Nhóm 1 (34)' },
          { id: 2, label: 'Nhóm 2 (13)' },
          { id: 3, label: 'Nhóm 3 (3)' },
          { id: 'exceptions', label: 'Ngoại lệ (6)' },
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
                padding: '0.35rem 0.8rem',
                borderRadius: '8px',
                border: '1.2px solid',
                borderColor: isActive ? '#1E4B75' : '#E6DDCF',
                background: isActive ? '#1E4B75' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#122438',
                fontSize: '0.8rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          CHẾ ĐỘ 1: LUYỆN ĐIỀN TỪ (INPUT DRILL)
          ========================================================================= */}
      {mode === 'drill' && (
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div
            style={{
              position: 'relative',
              background: '#FAF7F0',
              borderRadius: '18px',
              border: '1.5px solid #E6DDCF',
              boxShadow: '0 8px 28px rgba(18, 36, 56, 0.06)',
              padding: '2.25rem 2rem',
              overflow: 'hidden',
            }}
          >
            <JapaneseArtBackdrop
              src="/assets/art/gold-sakura-washi.jpg"
              alt="Họa tiết Washi"
              opacity={0.08}
              blendMode="multiply"
            />

            {/* Chỉ báo thứ tự câu */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '999px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-maru)',
                  background: currentVerb.group === 1 ? '#EDF4FA' : currentVerb.group === 2 ? '#EBF5EE' : '#FDF2F0',
                  color: currentVerb.group === 1 ? '#1E4B75' : currentVerb.group === 2 ? '#2A6B3D' : '#C83824',
                  border: `1px solid ${currentVerb.group === 1 ? '#B8D5E5' : currentVerb.group === 2 ? '#C2E5CC' : '#F5C6CB'}`,
                }}
              >
                Nhóm {currentVerb.group} {currentVerb.isException ? '★ Ngoại lệ' : ''}
              </span>

              <span style={{ fontFamily: 'var(--font-mincho)', fontWeight: 700, fontSize: '0.9rem', color: '#786A5E' }}>
                {currentIdx + 1} / {filteredVerbs.length}
              </span>
            </div>

            {/* Động từ mục tiêu */}
            <div style={{ textAlign: 'center', margin: '1.25rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ fontFamily: 'var(--font-mincho)', fontSize: '3rem', fontWeight: 900, color: '#122438' }}>
                  {currentVerb.kanji}
                </span>
                <JapaneseSpeakerButton text={currentVerb.kanji} size={26} />
              </div>

              <div style={{ fontFamily: 'var(--font-maru)', fontSize: '1.2rem', color: '#B87B28', fontWeight: 700, marginTop: '0.2rem' }}>
                {currentVerb.hiragana} ({currentVerb.romaji})
              </div>

              <div style={{ fontSize: '1.05rem', color: '#122438', fontWeight: 600, marginTop: '0.45rem' }}>
                Ý nghĩa: <strong>{currentVerb.meaning_vi}</strong>
              </div>
            </div>

            {/* Đề bài yêu cầu */}
            <div
              style={{
                textAlign: 'center',
                margin: '1.5rem 0 1rem',
                padding: '0.65rem',
                background: '#F0EBE0',
                borderRadius: '8px',
                color: '#122438',
                fontWeight: 700,
                fontSize: '0.92rem',
                fontFamily: 'var(--font-maru)',
              }}
            >
              👉 Hãy điền <strong>{targetForm === 'te' ? 'Thể Te (て形)' : 'Thể Ru (辞書形)'}</strong> của từ này:
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
                    padding: '0.9rem 1.15rem',
                    borderRadius: '10px',
                    border: '1.5px solid',
                    borderColor: evaluation
                      ? evaluation.isCorrect
                        ? '#3E734E'
                        : '#C83824'
                      : '#C89B58',
                    fontSize: '1.15rem',
                    color: '#122438',
                    fontFamily: 'var(--font-sans)',
                    outline: 'none',
                    background: '#FFFFFF',
                    textAlign: 'center',
                    fontWeight: 600,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  }}
                />

                {/* Bản xem trước Hiragana tức thì khi người dùng gõ Romaji */}
                {userInput.trim() && (
                  <div style={{ marginTop: '0.35rem', textAlign: 'center', fontSize: '0.82rem', color: '#786A5E', fontFamily: 'var(--font-maru)' }}>
                    Nhận diện: <strong>{romajiToHiragana(userInput)}</strong>
                  </div>
                )}
              </div>

              {/* Nút hành động */}
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
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  background: evaluation.isCorrect ? '#EBF5EE' : '#FFF2F0',
                  border: `1.2px solid ${evaluation.isCorrect ? '#A3D9B1' : '#F5C6CB'}`,
                  color: evaluation.isCorrect ? '#265C35' : '#A32415',
                  animation: 'fadeIn 0.25s ease forwards',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1rem', fontFamily: 'var(--font-maru)' }}>
                  {evaluation.isCorrect ? '✓ Hoàn toàn chính xác!' : '✗ Chưa đúng!'}
                </div>

                <div style={{ marginTop: '0.4rem', fontSize: '0.92rem' }}>
                  Đáp án chuẩn: <strong>{evaluation.expectedKanji}</strong> ({evaluation.expectedHiragana} / {evaluation.expectedRomaji})
                </div>

                {evaluation.ruleExplanation && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', lineHeight: 1.45, borderTop: '1px dashed rgba(0,0,0,0.15)', paddingTop: '0.45rem' }}>
                    💡 {evaluation.ruleExplanation}
                  </div>
                )}
              </div>
            )}

            {/* Khung gợi ý đáp án khi người học bấm nút Gợi ý */}
            {showAnswerHint && !evaluation && (
              <div style={{ marginTop: '1rem', padding: '0.85rem', background: '#FFF9E6', border: '1px solid #FFEAA7', borderRadius: '8px', fontSize: '0.88rem', color: '#8A6D1C' }}>
                💡 Gợi ý: Thể Masu là <strong>{currentVerb.masu_form.kanji}</strong> ({currentVerb.masu_form.hiragana}).
                {currentVerb.group === 1 && ' Nhóm 1 hãy chú ý đuôi âm để áp dụng đúng quy tắc biến âm!'}
              </div>
            )}

            {/* Câu ví dụ ngữ cảnh */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #ECE4D6' }}>
              <div style={{ fontSize: '0.8rem', color: '#786A5E', fontWeight: 600, marginBottom: '0.25rem' }}>
                CÂU VÍ DỤ ỨNG DỤNG:
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mincho)', fontSize: '0.96rem', color: '#122438', fontWeight: 600 }}>
                  {currentVerb.example.sentence}
                </span>
                <JapaneseSpeakerButton text={currentVerb.example.sentence} size={18} />
              </div>
              <p style={{ fontSize: '0.84rem', color: '#786A5E', margin: '0.2rem 0 0' }}>
                {currentVerb.example.meaning}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CHẾ ĐỘ 2: HỌC LƯỚT NHANH (SPEED DRILL / FLASHCARD DRIFT)
          ========================================================================= */}
      {mode === 'speed' && (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div
            onClick={() => setIsSpeedFlipped(!isSpeedFlipped)}
            style={{
              position: 'relative',
              background: '#FAF7F0',
              borderRadius: '20px',
              border: '2px solid #C89B58',
              boxShadow: '0 12px 32px rgba(18, 36, 56, 0.08)',
              padding: '3rem 2rem',
              textAlign: 'center',
              cursor: 'pointer',
              minHeight: '320px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'transform 0.2s',
            }}
          >
            <JapaneseArtBackdrop
              src="/assets/art/gold-sakura-washi.jpg"
              alt="Họa tiết"
              opacity={0.08}
              blendMode="multiply"
            />

            <span
              style={{
                position: 'absolute',
                top: '1.25rem',
                left: '1.25rem',
                fontSize: '0.76rem',
                fontWeight: 700,
                padding: '0.2rem 0.65rem',
                borderRadius: '999px',
                background: speedVerb.group === 1 ? '#EDF4FA' : '#EBF5EE',
                color: speedVerb.group === 1 ? '#1E4B75' : '#2A6B3D',
              }}
            >
              Nhóm {speedVerb.group} {speedVerb.isException ? '★ Ngoại lệ' : ''}
            </span>

            <span style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', fontSize: '0.85rem', color: '#786A5E', fontWeight: 600 }}>
              {speedIdx + 1} / {filteredVerbs.length}
            </span>

            {!isSpeedFlipped ? (
              // MẶT TRƯỚC
              <div>
                <div style={{ fontFamily: 'var(--font-mincho)', fontSize: '3.4rem', fontWeight: 900, color: '#122438' }}>
                  {speedVerb.kanji}
                </div>
                <div style={{ fontFamily: 'var(--font-maru)', fontSize: '1.3rem', color: '#B87B28', fontWeight: 700, marginTop: '0.4rem' }}>
                  {speedVerb.hiragana} ({speedVerb.romaji})
                </div>
                <div style={{ fontSize: '1.2rem', color: '#122438', fontWeight: 700, marginTop: '0.65rem' }}>
                  {speedVerb.meaning_vi}
                </div>
                <p style={{ color: '#786A5E', fontSize: '0.85rem', marginTop: '1.5rem', fontFamily: 'var(--font-maru)' }}>
                  (Bấm vào thẻ để lật xem cách chia thể Te &amp; thể Ru)
                </p>
              </div>
            ) : (
              // MẶT SAU: CÁC THỂ CHIA
              <div style={{ width: '100%' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1.2px solid #E6DDCF' }}>
                    <div style={{ fontSize: '0.78rem', color: '#C83824', fontWeight: 800 }}>THỂ TE (て形)</div>
                    <div style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.6rem', fontWeight: 800, color: '#122438', marginTop: '0.2rem' }}>
                      {speedVerb.te_form.kanji}
                    </div>
                    <div style={{ fontSize: '0.88rem', color: '#786A5E', marginTop: '0.2rem' }}>
                      {speedVerb.te_form.hiragana} ({speedVerb.te_form.romaji})
                    </div>
                  </div>

                  <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1.2px solid #E6DDCF' }}>
                    <div style={{ fontSize: '0.78rem', color: '#1E4B75', fontWeight: 800 }}>THỂ MASU (ます)</div>
                    <div style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.6rem', fontWeight: 800, color: '#122438', marginTop: '0.2rem' }}>
                      {speedVerb.masu_form.kanji}
                    </div>
                    <div style={{ fontSize: '0.88rem', color: '#786A5E', marginTop: '0.2rem' }}>
                      {speedVerb.masu_form.hiragana} ({speedVerb.masu_form.romaji})
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.92rem', color: '#122438', fontStyle: 'italic' }}>
                  &ldquo;{speedVerb.example.sentence}&rdquo;
                </div>
                <div style={{ fontSize: '0.82rem', color: '#786A5E', marginTop: '0.2rem' }}>
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
              ← Từ trước
            </button>
            <button
              onClick={() => setIsSpeedFlipped(!isSpeedFlipped)}
              className="btn-washi"
              style={{ flex: 1, padding: '0.85rem' }}
            >
              {isSpeedFlipped ? 'Mặt trước' : 'Lật xem'}
            </button>
            <button
              onClick={() => {
                setIsSpeedFlipped(false);
                setSpeedIdx((prev) => (prev + 1) % filteredVerbs.length);
              }}
              className="btn-torii"
              style={{ flex: 1, padding: '0.85rem' }}
            >
              Từ tiếp theo →
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          CHẾ ĐỘ 3: CẨM NANG LÝ THUYẾT & BẢNG TRA CỨU (THEORY REFERENCE)
          ========================================================================= */}
      {mode === 'theory' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* BẢNG 1: QUY TẮC BIẾN ÂM THỂ TE */}
          <div
            style={{
              background: '#FAF7F0',
              borderRadius: '16px',
              border: '1.2px solid #E6DDCF',
              boxShadow: '0 4px 16px rgba(18, 36, 56, 0.04)',
              padding: '1.75rem 2rem',
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.4rem', color: '#122438', fontWeight: 800, marginTop: 0 }}>
              📜 Ma trận biến âm thể Te (て形の音便法則)
            </h2>
            <p style={{ color: '#786A5E', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Quy tắc chia cho 3 nhóm động từ tiếng Nhật và hiện tượng biến âm trong Ngũ đoạn động từ (Nhóm 1):
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#F0EBE0', borderBottom: '1.5px solid #E2D7C5' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Nhóm / Đuôi động từ</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Biến âm thể Te</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Ví dụ minh họa</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Ý nghĩa</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #ECE4D6' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#C83824' }}>
                      Nhóm 1: う, つ, る (u, tsu, ru)
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#1E4B75' }}>
                      〜 って (tte - âm ngắt)
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      買う → <strong>買って</strong>, 待つ → <strong>待って</strong>, 取る → <strong>取って</strong>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#786A5E' }}>mua, chờ, lấy</td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid #ECE4D6', background: 'rgba(255,255,255,0.6)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#C83824' }}>
                      Nhóm 1: む, ぶ, ぬ (mu, bu, nu)
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#1E4B75' }}>
                      〜 んで (nde - âm mũi đục)
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      飲む → <strong>飲んで</strong>, 遊ぶ → <strong>遊んで</strong>, 死ぬ → <strong>死んで</strong>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#786A5E' }}>uống, chơi, chết</td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid #ECE4D6' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#C83824' }}>
                      Nhóm 1: く (ku)
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#1E4B75' }}>
                      〜 いて (ite - âm i)
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      書く → <strong>書いて</strong>, 聞く → <strong>聞いて</strong>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#786A5E' }}>viết, nghe</td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid #ECE4D6', background: 'rgba(255,255,255,0.6)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#C83824' }}>
                      Nhóm 1: ぐ (gu)
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#1E4B75' }}>
                      〜 いで (ide - âm i đục)
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      泳ぐ → <strong>泳いで</strong>, 急ぐ → <strong>急いで</strong>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#786A5E' }}>bơi, gấp</td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid #ECE4D6' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#C83824' }}>
                      Nhóm 1: す (su)
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#1E4B75' }}>
                      〜 して (shite)
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      話す → <strong>話して</strong>, 貸す → <strong>貸して</strong>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#786A5E' }}>nói chuyện, cho mượn</td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid #ECE4D6', background: '#FFF7F6' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#C83824' }}>
                      ★ NGOẠI LỆ: 行く (iku - đi)
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#C83824' }}>
                      行って (itte - âm ngắt)
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      行く không chia là 行いて! Bắt buộc chia là <strong>行って</strong>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#786A5E' }}>đi</td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid #ECE4D6', background: '#F0F9F2' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#2A6B3D' }}>
                      Nhóm 2 (Ichidan): Đuôi iru / eru
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#2A6B3D' }}>
                      Bỏ る + て (te)
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      食べる → <strong>食べて</strong>, 見る → <strong>見て</strong>, 起きる → <strong>起きて</strong>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#786A5E' }}>ăn, xem, thức dậy</td>
                  </tr>

                  <tr style={{ background: '#FFF9E6' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#B87B28' }}>
                      Nhóm 3 (Bất quy tắc): する &amp; くる
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#B87B28' }}>
                      して / きて
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      する → <strong>して</strong>, 来る (くる) → <strong>来て (きて)</strong>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#786A5E' }}>làm, đến</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* BẢNG 2: DANH SÁCH 50 ĐỘNG TỪ THÔNG DỤNG NHẤT */}
          <div
            style={{
              background: '#FAF7F0',
              borderRadius: '16px',
              border: '1.2px solid #E6DDCF',
              boxShadow: '0 4px 16px rgba(18, 36, 56, 0.04)',
              padding: '1.75rem 2rem',
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.4rem', color: '#122438', fontWeight: 800, marginTop: 0 }}>
              📚 Bảng tra cứu 50 Động từ Cốt lõi
            </h2>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#F0EBE0', borderBottom: '1.5px solid #E2D7C5' }}>
                    <th style={{ padding: '0.65rem 0.85rem' }}>STT</th>
                    <th style={{ padding: '0.65rem 0.85rem' }}>Hán tự</th>
                    <th style={{ padding: '0.65rem 0.85rem' }}>Hiragana</th>
                    <th style={{ padding: '0.65rem 0.85rem' }}>Nghĩa TV</th>
                    <th style={{ padding: '0.65rem 0.85rem' }}>Nhóm</th>
                    <th style={{ padding: '0.65rem 0.85rem' }}>Thể Te (て)</th>
                    <th style={{ padding: '0.65rem 0.85rem' }}>Thể Ru (る)</th>
                    <th style={{ padding: '0.65rem 0.85rem' }}>Thể Masu (ます)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVerbs.map((v, idx) => (
                    <tr
                      key={v.id}
                      style={{
                        borderBottom: '1px solid #ECE4D6',
                        background: idx % 2 === 0 ? 'rgba(255,255,255,0.7)' : 'rgba(250,247,240,0.7)',
                      }}
                    >
                      <td style={{ padding: '0.65rem 0.85rem', color: '#786A5E' }}>{idx + 1}</td>
                      <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'var(--font-mincho)', fontWeight: 800, fontSize: '1.1rem' }}>
                        {v.kanji}
                      </td>
                      <td style={{ padding: '0.65rem 0.85rem', color: '#1E4B75', fontWeight: 600 }}>{v.hiragana}</td>
                      <td style={{ padding: '0.65rem 0.85rem', fontWeight: 600 }}>{v.meaning_vi}</td>
                      <td style={{ padding: '0.65rem 0.85rem' }}>
                        <span
                          style={{
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: v.group === 1 ? '#EDF4FA' : v.group === 2 ? '#EBF5EE' : '#FDF2F0',
                            color: v.group === 1 ? '#1E4B75' : v.group === 2 ? '#2A6B3D' : '#C83824',
                          }}
                        >
                          Nhóm {v.group} {v.isException ? '★' : ''}
                        </span>
                      </td>
                      <td style={{ padding: '0.65rem 0.85rem', color: '#C83824', fontWeight: 700 }}>
                        {v.te_form.hiragana}
                      </td>
                      <td style={{ padding: '0.65rem 0.85rem', color: '#1E4B75', fontWeight: 700 }}>
                        {v.ru_form.hiragana}
                      </td>
                      <td style={{ padding: '0.65rem 0.85rem', color: '#786A5E' }}>
                        {v.masu_form.hiragana}
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
