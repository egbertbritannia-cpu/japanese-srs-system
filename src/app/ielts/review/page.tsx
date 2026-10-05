'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface MistakeRecord {
  qNum: number;
  category: string;
  rootCause: string;
  actionPlan: string;
}

interface VocabItem {
  id: string;
  word: string;
  partOfSpeech: string;
  phonetic: string;
  meaning: string;
  contextSentence: string;
}

function calculateBand(rawScore: number, section: 'Reading' | 'Listening', testType: 'academic' | 'general'): number {
  if (section === 'Listening') {
    if (rawScore >= 39) return 9.0;
    if (rawScore >= 37) return 8.5;
    if (rawScore >= 35) return 8.0;
    if (rawScore >= 32) return 7.5;
    if (rawScore >= 30) return 7.0;
    if (rawScore >= 26) return 6.5;
    if (rawScore >= 23) return 6.0;
    if (rawScore >= 18) return 5.5;
    if (rawScore >= 16) return 5.0;
    if (rawScore >= 13) return 4.5;
    if (rawScore >= 10) return 4.0;
    return 3.5;
  }

  // Reading Academic
  if (testType === 'academic') {
    if (rawScore >= 39) return 9.0;
    if (rawScore >= 37) return 8.5;
    if (rawScore >= 35) return 8.0;
    if (rawScore >= 33) return 7.5;
    if (rawScore >= 30) return 7.0;
    if (rawScore >= 27) return 6.5;
    if (rawScore >= 23) return 6.0;
    if (rawScore >= 19) return 5.5;
    if (rawScore >= 15) return 5.0;
    if (rawScore >= 13) return 4.5;
    if (rawScore >= 10) return 4.0;
    return 3.5;
  }

  // Reading General Training
  if (rawScore >= 40) return 9.0;
  if (rawScore >= 39) return 8.5;
  if (rawScore >= 37) return 8.0;
  if (rawScore >= 36) return 7.5;
  if (rawScore >= 34) return 7.0;
  if (rawScore >= 32) return 6.5;
  if (rawScore >= 30) return 6.0;
  if (rawScore >= 27) return 5.5;
  if (rawScore >= 23) return 5.0;
  if (rawScore >= 19) return 4.5;
  if (rawScore >= 15) return 4.0;
  return 3.5;
}

const SAMPLE_QUESTIONS = [
  { qNum: 1, yourAnswer: 'True', correctAnswer: 'True', isCorrect: true },
  { qNum: 2, yourAnswer: 'False', correctAnswer: 'Not Given', isCorrect: false },
  { qNum: 3, yourAnswer: 'True', correctAnswer: 'True', isCorrect: true },
  { qNum: 4, yourAnswer: 'Not Given', correctAnswer: 'Not Given', isCorrect: true },
  { qNum: 5, yourAnswer: 'A', correctAnswer: 'C', isCorrect: false },
  { qNum: 6, yourAnswer: 'B', correctAnswer: 'B', isCorrect: true },
  { qNum: 7, yourAnswer: 'economic crisis', correctAnswer: 'economic crisis', isCorrect: true },
  { qNum: 8, yourAnswer: 'agriculture', correctAnswer: 'agriculture', isCorrect: true },
  { qNum: 9, yourAnswer: 'technology', correctAnswer: 'machinery', isCorrect: false },
  { qNum: 10, yourAnswer: 'D', correctAnswer: 'D', isCorrect: true },
];

export default function IeltsReviewDesk() {
  const [section, setSection] = useState<'Reading' | 'Listening'>('Reading');
  const [testType, setTestType] = useState<'academic' | 'general'>('academic');
  const [rawScore, setRawScore] = useState<number>(32);
  const [analyzingQuestion, setAnalyzingQuestion] = useState<number | null>(null);

  // Mistakes
  const [mistakes, setMistakes] = useState<Record<number, MistakeRecord>>({
    2: {
      qNum: 2,
      category: 'Distraction',
      rootCause: 'Bị đánh lừa bởi từ đồng nghĩa nhưng thiếu thông tin so sánh trong đoạn 2.',
      actionPlan: 'Phân biệt rõ: False là có bằng chứng phủ định, Not Given là không đủ bằng chứng khẳng định.'
    }
  });

  const [activeCategory, setActiveCategory] = useState<string>('Distraction');
  const [activeRootCause, setActiveRootCause] = useState<string>('');
  const [activeActionPlan, setActiveActionPlan] = useState<string>('');

  // Vocab Bank
  const [vocabList, setVocabList] = useState<VocabItem[]>([
    {
      id: 'v1',
      word: 'Precipitous',
      partOfSpeech: 'adj',
      phonetic: '/prɪˈsɪp.ɪ.təs/',
      meaning: 'Dốc đứng, diễn ra đột ngột và bất ngờ (thường mang chiều hướng xấu)',
      contextSentence: 'The company suffered a precipitous decline in profits after the regulation change.'
    },
    {
      id: 'v2',
      word: 'Corroborate',
      partOfSpeech: 'v',
      phonetic: '/kəˈrɒb.ə.reɪt/',
      meaning: 'Chứng minh, củng cố (một bằng chứng, luận điểm)',
      contextSentence: 'Recent archaeological findings corroborate the historical accounts.'
    }
  ]);

  const [showVocabModal, setShowVocabModal] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newPos, setNewPos] = useState('noun');
  const [newPhonetic, setNewPhonetic] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newSentence, setNewSentence] = useState('');

  const currentBand = calculateBand(rawScore, section, testType);

  const openMistakeModal = (qNum: number) => {
    setAnalyzingQuestion(qNum);
    const existing = mistakes[qNum];
    if (existing) {
      setActiveCategory(existing.category);
      setActiveRootCause(existing.rootCause);
      setActiveActionPlan(existing.actionPlan);
    } else {
      setActiveCategory('Vocabulary');
      setActiveRootCause('');
      setActiveActionPlan('');
    }
  };

  const saveMistake = () => {
    if (analyzingQuestion !== null) {
      setMistakes((prev) => ({
        ...prev,
        [analyzingQuestion]: {
          qNum: analyzingQuestion,
          category: activeCategory,
          rootCause: activeRootCause,
          actionPlan: activeActionPlan,
        }
      }));
      setAnalyzingQuestion(null);
    }
  };

  const handleAddVocab = () => {
    if (!newWord.trim() || !newMeaning.trim()) {
      alert('Vui lòng nhập từ vựng và định nghĩa.');
      return;
    }
    const newItem: VocabItem = {
      id: `v_${Date.now()}`,
      word: newWord.trim(),
      partOfSpeech: newPos,
      phonetic: newPhonetic.trim(),
      meaning: newMeaning.trim(),
      contextSentence: newSentence.trim(),
    };
    setVocabList((prev) => [newItem, ...prev]);
    setNewWord('');
    setNewPhonetic('');
    setNewMeaning('');
    setNewSentence('');
    setShowVocabModal(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1050px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', margin: 0, color: 'var(--primary-color)', fontFamily: 'var(--font-serif)' }}>
            The Tutor's Desk &amp; Review
          </h1>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--text-color)', fontSize: '1rem' }}>
            Phân tích lỗi sai sâu sắc (Root Cause Analysis) và xây dựng kho từ vựng học thuật.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value as any)}
            style={{
              padding: '0.45rem 0.8rem',
              borderRadius: '6px',
              border: '1.5px solid var(--primary-color)',
              background: '#FFFFFF',
              color: 'var(--primary-color)',
              fontWeight: 'bold',
            }}
          >
            <option value="Reading">Reading</option>
            <option value="Listening">Listening</option>
          </select>

          <select
            value={testType}
            onChange={(e) => setTestType(e.target.value as any)}
            style={{
              padding: '0.45rem 0.8rem',
              borderRadius: '6px',
              border: '1.5px solid var(--primary-color)',
              background: '#FFFFFF',
              color: 'var(--primary-color)',
              fontWeight: 'bold',
            }}
          >
            <option value="academic">Academic</option>
            <option value="general">General Training</option>
          </select>

          <button
            onClick={() => setShowVocabModal(true)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '6px',
              border: 'none',
              background: 'var(--secondary-color)',
              color: 'var(--primary-color)',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            + Trích xuất từ vựng
          </button>
        </div>
      </div>

      {/* Score Header */}
      <div className="british-border" style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', marginBottom: '2rem', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '1.4rem', margin: '0 0 1rem 0' }}>
          Test Results: Cambridge IELTS 18 - Test 1 ({section} · {testType.toUpperCase()})
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ color: 'var(--text-color)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
              Raw Score
            </div>
            <div style={{ fontSize: '2.4rem', color: 'var(--primary-color)', fontWeight: 'bold', fontVariantNumeric: 'tabular-nums' }}>
              {rawScore} / 40
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={rawScore}
              onChange={(e) => setRawScore(Number(e.target.value))}
              style={{ width: '100%', marginTop: '0.5rem', accentColor: 'var(--primary-color)' }}
            />
          </div>

          <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ color: 'var(--text-color)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
              Estimated Band
            </div>
            <div style={{ fontSize: '2.4rem', color: '#059669', fontWeight: 'bold', fontVariantNumeric: 'tabular-nums' }}>
              {currentBand.toFixed(1)}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>
              Quy chuẩn thang điểm Cambridge
            </div>
          </div>

          <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ color: 'var(--text-color)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
              Lỗi cần phân tích
            </div>
            <div style={{ fontSize: '2.4rem', color: 'var(--error-color)', fontWeight: 'bold' }}>
              {40 - rawScore} câu
            </div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>
              Đã phân tích: {Object.keys(mistakes).length} lỗi
            </div>
          </div>
        </div>
      </div>

      {/* Answer Audit Table */}
      <div className="british-border" style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', marginBottom: '2rem', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>
          Itemized Answer Analysis (Mẫu 10 câu đầu)
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--primary-color)', color: 'var(--primary-color)' }}>
                <th style={{ padding: '0.65rem' }}>Q#</th>
                <th style={{ padding: '0.65rem' }}>Your Answer</th>
                <th style={{ padding: '0.65rem' }}>Correct Answer</th>
                <th style={{ padding: '0.65rem' }}>Status</th>
                <th style={{ padding: '0.65rem' }}>Mistake Category</th>
                <th style={{ padding: '0.65rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_QUESTIONS.map((q) => {
                const mistake = mistakes[q.qNum];
                return (
                  <tr
                    key={q.qNum}
                    style={{
                      borderBottom: '1px solid #eee',
                      backgroundColor: q.isCorrect ? '#FFFFFF' : '#FFF9F9'
                    }}
                  >
                    <td style={{ padding: '0.65rem', fontWeight: 'bold' }}>{q.qNum}</td>
                    <td style={{ padding: '0.65rem' }}>{q.yourAnswer}</td>
                    <td style={{ padding: '0.65rem', fontWeight: 600 }}>{q.correctAnswer}</td>
                    <td style={{ padding: '0.65rem' }}>
                      {q.isCorrect ? (
                        <span style={{ color: '#059669', fontWeight: 'bold' }}>✓ Correct</span>
                      ) : (
                        <span style={{ color: 'var(--error-color)', fontWeight: 'bold' }}>✗ Incorrect</span>
                      )}
                    </td>
                    <td style={{ padding: '0.65rem' }}>
                      {!q.isCorrect && mistake ? (
                        <span style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          background: '#FEE2E2',
                          color: '#991B1B',
                          fontSize: '0.8rem',
                          fontWeight: 'bold'
                        }}>
                          {mistake.category}
                        </span>
                      ) : !q.isCorrect ? (
                        <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>Chưa phân loại</span>
                      ) : (
                        <span style={{ color: '#9CA3AF' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '0.65rem' }}>
                      {!q.isCorrect && (
                        <button
                          type="button"
                          onClick={() => openMistakeModal(q.qNum)}
                          style={{
                            backgroundColor: mistake ? 'var(--secondary-color)' : '#FFFFFF',
                            border: '1.5px solid var(--primary-color)',
                            color: 'var(--primary-color)',
                            padding: '0.3rem 0.75rem',
                            borderRadius: '4px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '0.82rem'
                          }}
                        >
                          {mistake ? 'Xem / Sửa lỗi' : 'Analyze Mistake'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vocabulary Vault (Extracted Words) */}
      <div className="british-border" style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.3rem', margin: 0 }}>
            Extracted Vocabulary Vault ({vocabList.length} words)
          </h2>
          <span style={{ fontSize: '0.85rem', color: '#666' }}>
            Sẵn sàng đồng bộ sang FSRS Spaced Repetition Engine
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {vocabList.map((v) => (
            <div
              key={v.id}
              style={{
                padding: '1rem',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                background: '#FAF9F6'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)', fontFamily: 'var(--font-serif)' }}>
                  {v.word}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#D97706', fontStyle: 'italic' }}>
                  ({v.partOfSpeech})
                </span>
                {v.phonetic && (
                  <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                    {v.phonetic}
                  </span>
                )}
              </div>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', color: '#1F2937' }}>
                {v.meaning}
              </p>
              {v.contextSentence && (
                <div style={{
                  fontSize: '0.85rem',
                  color: '#4B5563',
                  fontStyle: 'italic',
                  paddingLeft: '0.65rem',
                  borderLeft: '2px solid var(--secondary-color)',
                  background: 'rgba(163,193,173,0.1)',
                  paddingTop: '0.2rem',
                  paddingBottom: '0.2rem'
                }}>
                  "{v.contextSentence}"
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Analyze Mistake */}
      {analyzingQuestion !== null && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div style={{
            background: '#FFFFFF',
            padding: '2rem',
            borderRadius: '10px',
            maxWidth: '560px',
            width: '100%',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            border: '2px solid var(--primary-color)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: 'var(--primary-color)', fontFamily: 'var(--font-serif)', fontSize: '1.4rem' }}>
              Phân tích lỗi sai: Câu số {analyzingQuestion}
            </h3>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
                Phân loại nguyên nhân (Mistake Taxonomy):
              </label>
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: '1px solid #D1D5DB',
                  fontSize: '0.95rem'
                }}
              >
                <option value="Comprehension">Comprehension (Đọc không hiểu ý / Nghe không ra)</option>
                <option value="Vocabulary">Vocabulary (Không nắm từ khóa then chốt / Paraphrase)</option>
                <option value="Grammar">Grammar (Sai cấu trúc thì, đại từ, mệnh đề quan hệ)</option>
                <option value="Distraction">Distraction (Sập bẫy đề thi, thông tin đối lập)</option>
                <option value="Time Management">Time Management (Thiếu thời gian, làm ẩu)</option>
                <option value="Careless">Careless (Sai chính tả, vượt quá giới hạn số từ quy định)</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
                Nguyên nhân gốc rễ (Root Cause Analysis):
              </label>
              <textarea
                rows={3}
                value={activeRootCause}
                onChange={(e) => setActiveRootCause(e.target.value)}
                placeholder="Tại sao bạn lại chọn đáp án sai này? Bẫy nằm ở đâu trong bài đọc/nghe?"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
                Kế hoạch khắc phục (Action Plan for Improvement):
              </label>
              <textarea
                rows={3}
                value={activeActionPlan}
                onChange={(e) => setActiveActionPlan(e.target.value)}
                placeholder="Làm sao để lần sau gặp dạng bài này không bao giờ phạm lại lỗi cũ?"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setAnalyzingQuestion(null)}
                style={{
                  padding: '0.5rem 1.25rem',
                  border: '1px solid #D1D5DB',
                  background: '#F3F4F6',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={saveMistake}
                style={{
                  padding: '0.5rem 1.5rem',
                  border: 'none',
                  background: 'var(--primary-color)',
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Lưu phân tích lỗi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Vocab */}
      {showVocabModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div style={{
            background: '#FFFFFF',
            padding: '2rem',
            borderRadius: '10px',
            maxWidth: '520px',
            width: '100%',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            border: '2px solid var(--primary-color)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: 'var(--primary-color)', fontFamily: 'var(--font-serif)', fontSize: '1.4rem' }}>
              Thêm Từ Vựng Vào Kho Học Thuật
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.25rem', fontSize: '0.85rem' }}>Từ vựng (Word):</label>
                <input
                  type="text"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="e.g. Inevitable"
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.25rem', fontSize: '0.85rem' }}>Từ loại (POS):</label>
                <select
                  value={newPos}
                  onChange={(e) => setNewPos(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                >
                  <option value="noun">noun</option>
                  <option value="verb">verb</option>
                  <option value="adj">adjective</option>
                  <option value="adv">adverb</option>
                  <option value="idiom">idiom/collocation</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.25rem', fontSize: '0.85rem' }}>Phiên âm (Phonetic):</label>
              <input
                type="text"
                value={newPhonetic}
                onChange={(e) => setNewPhonetic(e.target.value)}
                placeholder="e.g. /ɪˈnev.ɪ.tə.bəl/"
                style={{ width: '100%', padding: '0.45rem', borderRadius: '4px', border: '1px solid #D1D5DB' }}
              />
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.25rem', fontSize: '0.85rem' }}>Ý nghĩa (Definition):</label>
              <textarea
                rows={2}
                value={newMeaning}
                onChange={(e) => setNewMeaning(e.target.value)}
                placeholder="Nghĩa tiếng Việt hoặc giải nghĩa Academic..."
                style={{ width: '100%', padding: '0.45rem', borderRadius: '4px', border: '1px solid #D1D5DB' }}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.25rem', fontSize: '0.85rem' }}>Câu ngữ cảnh trong bài thi (Context Sentence):</label>
              <textarea
                rows={2}
                value={newSentence}
                onChange={(e) => setNewSentence(e.target.value)}
                placeholder="Câu chứa từ trích từ đề thi Cambridge..."
                style={{ width: '100%', padding: '0.45rem', borderRadius: '4px', border: '1px solid #D1D5DB' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setShowVocabModal(false)}
                style={{ padding: '0.5rem 1.25rem', border: '1px solid #D1D5DB', background: '#F3F4F6', borderRadius: '6px', cursor: 'pointer' }}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleAddVocab}
                style={{ padding: '0.5rem 1.5rem', border: 'none', background: 'var(--primary-color)', color: '#FFFFFF', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' }}
              >
                Lưu vào Vocab Vault
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
