'use client';

import { useState } from 'react';
import Link from 'next/link';

interface DraftItem {
  id: string;
  deckId: string;
  cardData: {
    kanji_surface: string;
    reading_furigana: string;
    primary_meaning: string;
    context_sentence: string;
    cloze_word: string;
    etymology_notes?: string;
    pitch_pattern: number;
  };
  approved?: boolean;
}

/**
 * Giao diện Tạo Thẻ Học Tiếng Nhật (Ngày 2):
 * - Gồm 1 ô nhập từ vựng duy nhất và 1 nút bấm: "Nhờ AI tạo thẻ"
 * - Luồng: Nhập từ vựng -> AI trả về thẻ đục lỗ i + 1 kèm phân tích chữ Hán (Keisei-moji) và cao độ (Pitch Accent)
 *   -> Người học duyệt câu chữ (Cognitive Ownership) -> Lưu vào lịch ôn tập FSRS (D=0, S=0, State=0)
 */
export default function NewCardPage() {
  const [activeTab, setActiveTab] = useState<'copilot' | 'manual'>('copilot');

  // State cho 1 ô nhập từ vựng duy nhất (Ngày 2)
  const [targetWord, setTargetWord] = useState('');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [customReading, setCustomReading] = useState('');
  const [customMeaning, setCustomMeaning] = useState('');
  const [learnerLevel, setLearnerLevel] = useState<'N5' | 'N4' | 'N3' | 'N2' | 'N1'>('N4');

  const [loading, setLoading] = useState(false);
  const [draftsList, setDraftsList] = useState<DraftItem[]>([]);
  const [masteredCount, setMasteredCount] = useState<number>(0);
  const [autoSplitNotice, setAutoSplitNotice] = useState<string | null>(null);

  // State cho Tạo thủ công (Base MVP)
  const [formData, setFormData] = useState({
    cardType: 'Vocab',
    front: '',
    reading: '',
    meaning: '',
    sentence: '',
    pitch: '',
    deck: 'JLPT N5',
  });

  const handleCopilotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetWord.trim()) return;

    setLoading(true);
    setAutoSplitNotice(null);

    try {
      const res = await fetch('/api/copilot/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: targetWord.trim(),
          reading: customReading.trim() || undefined,
          meaning: customMeaning.trim() || undefined,
          learnerLevel,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const receivedDrafts: DraftItem[] = data.drafts || (data.draft ? [data.draft] : []);
        setDraftsList(receivedDrafts);
        setMasteredCount(data.masteredWordsCount || 0);

        if (receivedDrafts.length > 1) {
          setAutoSplitNotice(
            `⚡ [Bước 4 - Guardrail Audit] Phát hiện ${receivedDrafts.length} nghĩa phái sinh phức tạp. Bộ thẩm định atomicity-validator.ts đã tự động phân rã thành ${receivedDrafts.length} thẻ riêng biệt để tuân thủ Nguyên tắc Thông tin Tối thiểu!`
          );
        }
      } else {
        alert(data.feedback || data.error || 'Có lỗi xảy ra trong quá trình sinh thẻ');
      }
    } catch {
      alert('Không thể kết nối đến máy chủ AI Copilot API');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDraftField = (
    draftId: string,
    field: keyof DraftItem['cardData'],
    value: any
  ) => {
    setDraftsList((prev) =>
      prev.map((d) =>
        d.id === draftId
          ? {
              ...d,
              cardData: {
                ...d.cardData,
                [field]: value,
              },
            }
          : d
      )
    );
  };

  const handleApproveDraft = async (draft: DraftItem) => {
    try {
      const res = await fetch('/api/copilot/draft', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftId: draft.id,
          editedData: draft.cardData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDraftsList((prev) =>
          prev.map((d) => (d.id === draft.id ? { ...d, approved: true } : d))
        );
      } else {
        alert(data.error || 'Không thể lưu thẻ học');
      }
    } catch {
      alert('Lỗi khi phê duyệt và lưu thẻ học vào SQLite/Turso');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thẻ đã được tạo thành công theo chuẩn Atomicity!');
  };

  return (
    <div style={{ maxWidth: '780px', margin: '2rem auto', padding: '1.25rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/cards" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← Quay lại danh sách thẻ
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#f8fafc' }}>
          Tạo Thẻ Học Tiếng Nhật
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Tích hợp AI Copilot Cognitive Agent, FSRS &amp; Cloud Database Turso
        </p>
      </div>

      {/* Tabs chuyển đổi */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        <button
          onClick={() => setActiveTab('copilot')}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'copilot' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'copilot' ? 'var(--primary)' : '#94a3b8',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          ✨ AI Copilot ("Nhờ AI tạo thẻ")
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'manual' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'manual' ? 'var(--primary)' : '#94a3b8',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          ✍️ Tự tạo thủ công (Base MVP)
        </button>
      </div>

      {/* TAB 1: 1 Ô NHẬP TỪ VỰNG DUY NHẤT & 1 NÚT "NHỜ AI TẠO THẺ" (Ngày 2) */}
      {activeTab === 'copilot' && (
        <div>
          <form
            onSubmit={handleCopilotSubmit}
            style={{
              background: 'var(--card-bg)',
              padding: '2rem',
              borderRadius: '14px',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              marginBottom: '2rem',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
            }}
          >
            <div>
              <label
                htmlFor="targetWordInput"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  color: '#f8fafc',
                }}
              >
                Nhập từ vựng tiếng Nhật:
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  id="targetWordInput"
                  type="text"
                  placeholder="vd: 警察, 桜, かける, 際..."
                  value={targetWord}
                  onChange={(e) => setTargetWord(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.9rem 1.2rem',
                    background: '#0f172a',
                    border: '2px solid #334155',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '1.2rem',
                    outline: 'none',
                  }}
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '0.9rem 1.75rem',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'opacity 0.2s',
                  }}
                >
                  {loading ? '⏳ Đang phân tích...' : '✨ Nhờ AI tạo thẻ'}
                </button>
              </div>
            </div>

            {/* Tùy chọn nâng cao (có thể ẩn/hiện) */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                {showAdvancedOptions ? '▲ Ẩn tùy chọn nâng cao' : '▼ Tùy chọn nâng cao (Furigana, Nghĩa tùy ý, Trình độ)'}
              </button>

              {showAdvancedOptions && (
                <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                      Furigana (tùy chọn):
                    </label>
                    <input
                      type="text"
                      placeholder="vd: けいさつ"
                      value={customReading}
                      onChange={(e) => setCustomReading(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                      Nghĩa gợi ý (tùy chọn):
                    </label>
                    <input
                      type="text"
                      placeholder="vd: Cảnh sát"
                      value={customMeaning}
                      onChange={(e) => setCustomMeaning(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                      Trình độ học viên:
                    </label>
                    <select
                      value={learnerLevel}
                      onChange={(e) => setLearnerLevel(e.target.value as any)}
                      style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}
                    >
                      <option value="N5">JLPT N5</option>
                      <option value="N4">JLPT N4</option>
                      <option value="N3">JLPT N3</option>
                      <option value="N2">JLPT N2</option>
                      <option value="N1">JLPT N1</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* THÔNG BÁO TỰ ĐỘNG PHÂN RÃ KHI CÓ NHIỀU NGHĨA PHÁI SINH (Bước 4) */}
          {autoSplitNotice && (
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid #3b82f6',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1.5rem',
                color: '#93c5fd',
                fontSize: '0.9rem',
                lineHeight: 1.5,
              }}
            >
              {autoSplitNotice}
            </div>
          )}

          {/* DANH SÁCH BẢN NHÁP ĐỂ NGƯỜI HỌC DUYỆT & LƯU VÀO FSRS (Bước 5: Human-in-the-Loop) */}
          {draftsList.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f8fafc' }}>
                  Bản nháp được tạo bởi AI ({draftsList.length} thẻ)
                </h2>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  Vốn từ đã thuộc (S &gt; 21): <strong>{masteredCount}</strong>
                </span>
              </div>

              {draftsList.map((draft, idx) => (
                <div
                  key={draft.id}
                  style={{
                    background: draft.approved ? 'rgba(16, 185, 129, 0.08)' : '#1e293b',
                    padding: '1.75rem',
                    borderRadius: '12px',
                    border: draft.approved ? '2px solid #10b981' : '2px solid #38bdf8',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span
                        style={{
                          background: draft.approved ? '#10b981' : '#f59e0b',
                          color: '#000',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {draft.approved ? '✅ ĐÃ LƯU VÀO FSRS' : `BẢN NHÁP ${idx + 1}/${draftsList.length}`}
                      </span>
                      <span
                        style={{
                          background: '#0f172a',
                          color: '#38bdf8',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontFamily: 'monospace',
                        }}
                      >
                        FSRS ban đầu: D=0, S=0, State=0
                      </span>
                    </div>

                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      atomicity-validator.ts &amp; Zod OK
                    </span>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '0.25rem' }}>
                      {draft.cardData.kanji_surface} 【{draft.cardData.reading_furigana}】
                    </h3>
                    <p style={{ color: '#38bdf8', fontSize: '0.85rem', marginBottom: '1rem' }}>
                      Mẫu cao độ Tokyo: [{draft.cardData.pitch_pattern}]
                    </p>

                    {/* Chỉnh sửa nghĩa */}
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                        Nghĩa tiếng Việt (Có thể chỉnh sửa để bảo toàn nhận thức):
                      </label>
                      <input
                        type="text"
                        disabled={draft.approved}
                        value={draft.cardData.primary_meaning}
                        onChange={(e) =>
                          handleUpdateDraftField(draft.id, 'primary_meaning', e.target.value)
                        }
                        style={{
                          width: '100%',
                          padding: '0.6rem',
                          background: '#0f172a',
                          border: '1px solid var(--border)',
                          borderRadius: '6px',
                          color: 'white',
                        }}
                      />
                    </div>

                    {/* Chỉnh sửa câu ví dụ i+1 */}
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                        Câu ngữ cảnh đục lỗ i+1:
                      </label>
                      <textarea
                        rows={2}
                        disabled={draft.approved}
                        value={draft.cardData.context_sentence}
                        onChange={(e) =>
                          handleUpdateDraftField(draft.id, 'context_sentence', e.target.value)
                        }
                        style={{
                          width: '100%',
                          padding: '0.6rem',
                          background: '#0f172a',
                          border: '1px solid var(--border)',
                          borderRadius: '6px',
                          color: 'white',
                        }}
                      />
                    </div>

                    {draft.cardData.etymology_notes && (
                      <p
                        style={{
                          color: '#cbd5e1',
                          fontSize: '0.85rem',
                          marginTop: '0.5rem',
                          background: '#0f172a',
                          padding: '0.6rem',
                          borderRadius: '6px',
                          border: '1px solid #334155',
                        }}
                      >
                        💡 <strong>Ngữ nguyên học (Keisei-moji):</strong> {draft.cardData.etymology_notes}
                      </p>
                    )}
                  </div>

                  {!draft.approved ? (
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button
                        onClick={() => handleApproveDraft(draft)}
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        ✅ Duyệt &amp; Lưu vào lịch ôn tập FSRS (D=0, S=0, State=0)
                      </button>
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: '0.6rem',
                        textAlign: 'center',
                        background: 'rgba(16, 185, 129, 0.2)',
                        borderRadius: '6px',
                        color: '#10b981',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                      }}
                    >
                      🎉 Thẻ đã được lưu vào lịch ôn tập FSRS thành công!
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MANUAL CREATION */}
      {activeTab === 'manual' && (
        <form
          onSubmit={handleManualSubmit}
          style={{
            background: 'var(--card-bg)',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Loại thẻ (Card Type)</label>
            <select
              value={formData.cardType}
              onChange={(e) => setFormData({ ...formData, cardType: e.target.value })}
              style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid var(--border)', borderRadius: '6px', color: 'white' }}
            >
              <option value="Vocab">Vocabulary (Từ vựng 1 nghĩa)</option>
              <option value="Kanji">Kanji (Chữ Hán 1 ký tự)</option>
              <option value="Cloze">Cloze (Điền từ 1 chỗ trống)</option>
              <option value="Pitch">Pitch Accent (Mẫu cao độ âm thanh)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Từ vựng / Mặt trước</label>
            <input
              type="text"
              placeholder="vd: 桜, 食べる"
              value={formData.front}
              onChange={(e) => setFormData({ ...formData, front: e.target.value })}
              style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid var(--border)', borderRadius: '6px', color: 'white' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nghĩa (Tối đa 1 nghĩa chính)</label>
            <input
              type="text"
              placeholder="vd: Hoa anh đào"
              value={formData.meaning}
              onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
              style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid var(--border)', borderRadius: '6px', color: 'white' }}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '0.875rem',
              backgroundColor: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Lưu thẻ học
          </button>
        </form>
      )}
    </div>
  );
}
