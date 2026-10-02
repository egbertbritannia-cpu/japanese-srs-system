'use client';

import { useState } from 'react';
import Link from 'next/link';

/**
 * Giao diện ôn tập (Active Recall, chấm điểm Again/Hard/Good/Easy)
 */
export default function ReviewPage() {
  const [showAnswer, setShowAnswer] = useState(false);

  // Mock card for review demonstration
  const currentCard = {
    id: 'c1',
    kanji: '勉強',
    furigana: 'べんきょう',
    meaning: 'Học tập, nghiên cứu',
    pitch: '0 (Heiban)',
    sentence: '毎日日本語を勉強します。',
  };

  const handleGrade = (grade: 'Again' | 'Hard' | 'Good' | 'Easy') => {
    // Gọi API ghi nhận kết quả đánh giá thẻ (cập nhật DSR)
    console.log(`Graded card ${currentCard.id} as: ${grade}`);
    setShowAnswer(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>
          ← Quay lại Dashboard
        </Link>
        <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Thẻ 1 / 15</span>
      </div>

      {/* Flashcard container */}
      <div
        style={{
          minHeight: '260px',
          background: 'var(--card-bg)',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          {currentCard.kanji}
        </div>

        {showAnswer && (
          <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem', width: '100%' }}>
            <p style={{ fontSize: '1.25rem', color: '#38bdf8', marginBottom: '0.5rem' }}>
              【{currentCard.furigana}】 · Cao độ: {currentCard.pitch}
            </p>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{currentCard.meaning}</p>
            <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>{currentCard.sentence}</p>
          </div>
        )}
      </div>

      {/* Interaction buttons */}
      {!showAnswer ? (
        <button
          onClick={() => setShowAnswer(true)}
          style={{
            width: '100%',
            padding: '1rem',
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Hiện đáp án (Active Recall)
        </button>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
          <button
            onClick={() => handleGrade('Again')}
            style={{
              padding: '0.75rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Again
          </button>
          <button
            onClick={() => handleGrade('Hard')}
            style={{
              padding: '0.75rem',
              backgroundColor: '#f97316',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Hard
          </button>
          <button
            onClick={() => handleGrade('Good')}
            style={{
              padding: '0.75rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Good
          </button>
          <button
            onClick={() => handleGrade('Easy')}
            style={{
              padding: '0.75rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Easy
          </button>
        </div>
      )}
    </div>
  );
}
