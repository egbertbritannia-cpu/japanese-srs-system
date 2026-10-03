'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { GrammarExercise } from '@/core/grammar/grammar.types';
import { parseClozeSegments } from '@/lib/cloze';
import { JapaneseSpeakerButton } from '@/components/japanese/JapaneseSpeakerButton';
import Link from 'next/link';

function PracticeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lessonId = searchParams.get('lessonId') || 'all';

  const [exercises, setExercises] = useState<GrammarExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    async function fetchQueue() {
      try {
        setLoading(true);
        const res = await fetch(`/api/grammar/practice?lessonId=${lessonId}&limit=15`);
        const data = await res.json();
        setExercises(data.exercises || []);
      } catch (err) {
        console.error('Failed to load grammar exercises:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchQueue();
  }, [lessonId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#8B7B6D' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎋</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Đang chuẩn bị bộ câu hỏi ngữ pháp...</div>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem', maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌸</div>
        <h2 style={{ fontSize: '1.4rem', color: '#1F2421', marginBottom: '0.5rem' }}>Chưa có câu hỏi nào</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Hiện chưa có bài tập nào khả dụng cho mục đã chọn.
        </p>
        <Link
          href="/grammar"
          style={{
            padding: '0.75rem 1.5rem',
            background: '#1B4268',
            color: '#FFFFFF',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: 700,
          }}
        >
          Quay lại danh sách bài học
        </Link>
      </div>
    );
  }

  const current = exercises[currentIndex];
  const total = exercises.length;
  const progressPercent = Math.round(((currentIndex) / total) * 100);

  const handleSelectOption = async (optionKey: 'A' | 'B' | 'C' | 'D') => {
    if (isAnswered) return;

    setSelectedOption(optionKey);
    setIsAnswered(true);

    const isCorrect = optionKey === current.correctOption;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }

    // Gửi FSRS review grade (optimistic)
    try {
      const rating = isCorrect ? 'Good' : 'Again';
      await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: `grammar_cloze_${current.patternId}`,
          rating,
        }),
      });
    } catch {
      // Bỏ qua lỗi mạng nền
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < total) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsComplete(true);
    }
  };

  // Completion Screen
  if (isComplete) {
    const accuracy = Math.round((correctCount / total) * 100);

    return (
      <div
        style={{
          maxWidth: '540px',
          margin: '2rem auto',
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
          border: '1.5px solid var(--washi-border, #E6E1DA)',
        }}
      >
        <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>🎊</div>
        <h2
          style={{
            fontSize: '1.8rem',
            fontWeight: 900,
            color: '#1B4268',
            fontFamily: 'var(--font-mincho, "Shippori Mincho", serif)',
            margin: '0 0 0.5rem',
          }}
        >
          HOÀN THÀNH PHIÊN LUYỆN TẬP!
        </h2>
        <p style={{ color: '#666', fontSize: '0.95rem', margin: '0 0 1.75rem' }}>
          Bạn đã hoàn thành tất cả các bài tập ngữ pháp trong phiên này.
        </p>

        {/* Score Badge */}
        <div
          style={{
            background: 'rgba(27, 66, 104, 0.05)',
            border: '2px solid #1B4268',
            borderRadius: '16px',
            padding: '1.25rem',
            marginBottom: '2rem',
          }}
        >
          <div style={{ fontSize: '0.85rem', color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>
            Tỷ lệ chính xác (Accuracy)
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1B4268', margin: '0.25rem 0' }}>
            {accuracy}%
          </div>
          <div style={{ fontSize: '0.9rem', color: '#4A6B22', fontWeight: 600 }}>
            {correctCount} / {total} câu trả lời đúng
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link
            href="/grammar"
            style={{
              flex: 1,
              padding: '0.85rem 1.25rem',
              borderRadius: '10px',
              border: '1.5px solid #1B4268',
              color: '#1B4268',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
            }}
          >
            Về danh sách bài học
          </Link>
          <button
            onClick={() => {
              setCurrentIndex(0);
              setSelectedOption(null);
              setIsAnswered(false);
              setCorrectCount(0);
              setIsComplete(false);
            }}
            style={{
              flex: 1,
              padding: '0.85rem 1.25rem',
              borderRadius: '10px',
              background: '#1B4268',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 3px 10px rgba(27, 66, 104, 0.25)',
            }}
          >
            Luyện tập tiếp ➔
          </button>
        </div>
      </div>
    );
  }

  const options: Array<{ key: 'A' | 'B' | 'C' | 'D'; text: string }> = [
    { key: 'A' as const, text: current.optionA || '' },
    { key: 'B' as const, text: current.optionB || '' },
    { key: 'C' as const, text: current.optionC || '' },
    { key: 'D' as const, text: current.optionD || '' },
  ].filter((opt): opt is { key: 'A' | 'B' | 'C' | 'D'; text: string } => !!opt.text);

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', paddingBottom: '5rem' }}>
      {/* Top Header & Progress */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <Link
            href="/grammar"
            style={{
              color: '#8B7B6D',
              textDecoration: 'none',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            ✕ Thoát
          </Link>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1B4268' }}>
            Câu {currentIndex + 1} / {total}
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '6px', background: '#E6E1DA', borderRadius: '3px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #88A752, #1B4268)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '18px',
          border: '1.5px solid var(--washi-border, #E6E1DA)',
          padding: '2rem 1.75rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            padding: '0.2rem 0.6rem',
            background: 'rgba(27, 66, 104, 0.08)',
            color: '#1B4268',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}
        >
          {current.exerciseType === 'cloze' ? 'ĐIỀN VÀO CHỖ TRỐNG' : 'TRẮC NGHIỆM NGỮ PHÁP'}
        </div>

        {/* Sentence */}
        <div
          style={{
            fontSize: '1.35rem',
            lineHeight: 1.8,
            color: '#1F2421',
            fontWeight: 700,
            fontFamily: 'var(--font-mincho, "Shippori Mincho", serif)',
            marginBottom: '1.25rem',
          }}
        >
          {current.sentenceWithCloze ? (
            parseClozeSegments(current.sentenceWithCloze).map((seg, idx) => (
              <span
                key={idx}
                style={
                  seg.isCloze
                    ? {
                        padding: '0.1rem 0.5rem',
                        borderBottom: '3px solid #88A752',
                        color: isAnswered ? '#2B6B3D' : '#88A752',
                        background: 'rgba(136, 167, 82, 0.1)',
                        borderRadius: '4px',
                      }
                    : {}
                }
              >
                {seg.isCloze && !isAnswered ? ' ( ❓ ) ' : seg.text}
              </span>
            ))
          ) : (
            current.question || current.promptText
          )}
        </div>

        {/* Vietnamese Hint / Prompt */}
        {current.promptText && (
          <div
            style={{
              fontSize: '0.95rem',
              color: '#666',
              borderTop: '1px dashed #ECE8E1',
              paddingTop: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>💬 Dịch: <strong>{current.promptText}</strong></span>
            <JapaneseSpeakerButton text={current.answerText} size={16} />
          </div>
        )}
      </div>

      {/* 4 Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {options.map(opt => {
          let btnBg = '#FFFFFF';
          let borderColor = '#E6E1DA';
          let textColor = '#1F2421';

          if (isAnswered) {
            if (opt.key === current.correctOption) {
              btnBg = '#E8F4E8';
              borderColor = '#2B6B3D';
              textColor = '#2B6B3D';
            } else if (opt.key === selectedOption) {
              btnBg = '#FFEBEE';
              borderColor = '#D9381E';
              textColor = '#D9381E';
            } else {
              btnBg = '#FAFAF9';
              textColor = '#888';
            }
          }

          return (
            <button
              key={opt.key}
              onClick={() => handleSelectOption(opt.key)}
              disabled={isAnswered}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem 1.25rem',
                background: btnBg,
                border: `2px solid ${borderColor}`,
                borderRadius: '12px',
                fontSize: '1.05rem',
                color: textColor,
                fontWeight: 600,
                textAlign: 'left',
                cursor: isAnswered ? 'default' : 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
              }}
            >
              <span
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isAnswered && opt.key === current.correctOption ? '#2B6B3D' : '#F0EDE8',
                  color: isAnswered && opt.key === current.correctOption ? '#FFFFFF' : '#666',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  marginRight: '0.85rem',
                  flexShrink: 0,
                }}
              >
                {opt.key}
              </span>
              <span style={{ flex: 1 }}>{opt.text}</span>
            </button>
          );
        })}
      </div>

      {/* Answer Explanation Box (Appears after answer) */}
      {isAnswered && (
        <div
          style={{
            background: selectedOption === current.correctOption ? '#F1F8E9' : '#FFF3E0',
            border: `1.5px solid ${selectedOption === current.correctOption ? '#88A752' : '#FF9800'}`,
            borderRadius: '14px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            style={{
              fontWeight: 800,
              fontSize: '1rem',
              color: selectedOption === current.correctOption ? '#2B6B3D' : '#E65100',
              marginBottom: '0.4rem',
            }}
          >
            {selectedOption === current.correctOption ? '✨ CHÍNH XÁC (正解)!' : '❌ CHƯA CHÍNH XÁC'}
          </div>

          <div style={{ fontSize: '0.9rem', color: '#333', lineHeight: 1.5, marginBottom: '0.5rem' }}>
            {current.explanationVi || 'Đáp án đúng theo quy tắc ngữ pháp.'}
          </div>

          {current.explanationJa && (
            <div style={{ fontSize: '0.8rem', color: '#666', fontStyle: 'italic' }}>
              {current.explanationJa}
            </div>
          )}

          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleNext}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#1B4268',
                color: '#FFFFFF',
                borderRadius: '10px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 3px 10px rgba(27, 66, 104, 0.2)',
              }}
            >
              <span>{currentIndex + 1 < total ? 'Câu tiếp theo ➔' : 'Xem kết quả ➔'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PracticePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '1.5rem 1rem 5.5rem',
        background: 'var(--washi-base, #FAF8F5)',
      }}
    >
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '3rem' }}>Đang nạp bài tập...</div>}>
        <PracticeContent />
      </Suspense>
    </main>
  );
}
