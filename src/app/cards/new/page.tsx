'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ToriiIcon, OrizuruIcon, SensuFanIcon } from '@/components/japanese/Icons';
import { PitchAccentGraph } from '@/components/japanese/PitchAccentGraph';
import { JapaneseSpeakerButton } from '@/components/japanese/JapaneseSpeakerButton';
import { JapaneseArtBackdrop } from '@/components/art/JapaneseArtBackdrop';
import { japaneseAudio } from '@/components/japanese/AudioEffects';

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
 * Giao diện Tạo Thẻ Học Tiếng Nhật (Shodo Desk - 書道机)
 * Thiết kế theo phong cách Bàn thư pháp Washi và Tranh cuộn Kakejiku truyền thống
 */
export default function NewCardPage() {
  const [activeTab, setActiveTab] = useState<'copilot' | 'manual'>('manual');

  // State cho 1 ô nhập từ vựng duy nhất (Copilot mode)
  const [targetWord, setTargetWord] = useState('');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [customReading, setCustomReading] = useState('');
  const [customMeaning, setCustomMeaning] = useState('');
  const [learnerLevel, setLearnerLevel] = useState<'N5' | 'N4' | 'N3' | 'N2' | 'N1'>('N4');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
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
    deck: 'deck_jpd133',
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
            `Bộ thẩm định atomicity phát hiện ${receivedDrafts.length} nét nghĩa phái sinh độc lập và đã tự động phân rã thành ${receivedDrafts.length} thẻ riêng biệt.`
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
        japaneseAudio.playSuzuBell();
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

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.front.trim() || !formData.meaning.trim()) {
      alert('Vui lòng nhập từ vựng và ý nghĩa');
      return;
    }

    setSaving(true);
    setSaveSuccess(null);
    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deck_id: formData.deck,
          type: formData.cardType,
          front: formData.front.trim(),
          reading: formData.reading.trim() || undefined,
          meaning: formData.meaning.trim(),
          sentence: formData.sentence.trim() || undefined,
          pitch: formData.pitch.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        japaneseAudio.playSuzuBell();
        setSaveSuccess(`Đã lưu thẻ "${formData.front}" thành công vào hệ thống!`);
        setFormData((prev) => ({
          ...prev,
          front: '',
          reading: '',
          meaning: '',
          sentence: '',
          pitch: '',
        }));
        setTimeout(() => setSaveSuccess(null), 4000);
      } else {
        alert(data.error || 'Lỗi khi lưu thẻ học');
      }
    } catch {
      alert('Không thể kết nối đến máy chủ API');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '820px', margin: '1.5rem auto', padding: '0 1.25rem 3.5rem' }}>
      {/* HEADER QUAY LẠI & TIÊU ĐỀ */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          href="/cards"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            color: '#786A5E',
            textDecoration: 'none',
            fontSize: '0.88rem',
            fontFamily: 'var(--font-maru)',
            fontWeight: 600,
            marginBottom: '0.65rem',
          }}
        >
          ← Danh mục
        </Link>

        {/* TRANH CUỘN KAKEJIKU MỘC BẢN HẠC TRẮNG NGẮM PHÚ SĨ */}
        <div
          style={{
            borderRadius: '18px',
            overflow: 'hidden',
            position: 'relative',
            marginBottom: '1.5rem',
            border: '1.5px solid #C89B58',
            boxShadow: '0 10px 28px rgba(18, 36, 56, 0.1)',
            background: 'linear-gradient(135deg, #1A1F1C 0%, #2B3A31 55%, #18221B 100%)',
            padding: '2rem 2.25rem',
            color: '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem',
          }}
        >
          {/* Lớp tranh mộc bản Hokusai Hạc trắng ngắm Phú Sĩ */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.32, pointerEvents: 'none', zIndex: 0 }}>
            <Image
              src="/assets/art/hokusai-cranes-fuji.jpg"
              alt="Tranh mộc bản Hokusai Hạc trắng ngắm núi Phú Sĩ"
              fill
              sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: 'center 38%' }}
            />
          </div>

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '540px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mincho)',
                  background: '#C83824',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.76rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '4px',
                  letterSpacing: '0.08em',
                }}
              >
                書道机 · THÊM THẺ
              </span>
              <span style={{ fontSize: '0.82rem', color: '#E8D9BD', fontFamily: 'var(--font-maru)' }}>
                Bàn thư pháp số
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-mincho)',
                fontSize: '2.2rem',
                fontWeight: 800,
                lineHeight: 1.25,
                margin: '0 0 0.4rem 0',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              Thêm thẻ học tiếng Nhật
            </h1>

            <p style={{ color: 'rgba(250, 248, 245, 0.9)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
              Nhập từ vựng, chữ Hán và ý nghĩa để lưu vào hệ thống ôn tập FSRS.
            </p>
          </div>
        </div>
      </div>

      {/* TABS CHUYỂN ĐỔI - ẨN TAB AI KHỎI GIAO DIỆN (LOGIC VẪN ĐƯỢC GIỮ LẠI TRONG CODEBASE) */}
      <div
        style={{
          display: 'none',
          gap: '0.5rem',
          marginBottom: '1.75rem',
          borderBottom: '1.5px solid #E6DDCF',
        }}
      >
        <button
          onClick={() => setActiveTab('copilot')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'copilot' ? '3px solid #1E4B75' : 'none',
            color: activeTab === 'copilot' ? '#122438' : '#786A5E',
            fontFamily: 'var(--font-maru)',
            fontWeight: activeTab === 'copilot' ? 800 : 600,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Trợ lý AI Copilot
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'manual' ? '3px solid #1E4B75' : 'none',
            color: activeTab === 'manual' ? '#122438' : '#786A5E',
            fontFamily: 'var(--font-maru)',
            fontWeight: activeTab === 'manual' ? 800 : 600,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Tự soạn thủ công
        </button>
      </div>

      {/* TAB 1: AI COPILOT */}
      {activeTab === 'copilot' && (
        <div>
          <form
            onSubmit={handleCopilotSubmit}
            style={{
              background: '#FAF7F0',
              padding: '2rem 2.25rem',
              borderRadius: '16px',
              border: '1.2px solid #E6DDCF',
              boxShadow: '0 6px 20px rgba(18, 36, 56, 0.05)',
              marginBottom: '2rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <JapaneseArtBackdrop
              src="/assets/art/cloud-mist-kasumi-icons.jpg"
              alt="Họa tiết mây Kasumi"
              opacity={0.12}
              blendMode="multiply"
              objectPosition="bottom right"
            />

            <div style={{ position: 'relative', zIndex: 1, marginBottom: '1.25rem' }}>
              <label
                htmlFor="targetWordInput"
                style={{
                  display: 'block',
                  marginBottom: '0.6rem',
                  fontFamily: 'var(--font-mincho)',
                  fontWeight: 700,
                  fontSize: '1.15rem',
                  color: '#122438',
                }}
              >
                Nhập từ vựng hoặc chữ Kanji mục tiêu:
              </label>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <input
                  id="targetWordInput"
                  type="text"
                  placeholder="ví dụ: 警察, 桜, かける, 曖昧..."
                  value={targetWord}
                  onChange={(e) => setTargetWord(e.target.value)}
                  style={{
                    flex: '1 1 300px',
                    padding: '0.85rem 1.25rem',
                    background: '#FFFFFF',
                    border: '1.5px solid #E6DDCF',
                    borderRadius: '10px',
                    color: '#122438',
                    fontSize: '1.2rem',
                    fontFamily: 'var(--font-mincho)',
                    fontWeight: 600,
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-torii"
                  style={{
                    padding: '0.85rem 1.75rem',
                    fontSize: '1rem',
                    opacity: loading ? 0.75 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 14px rgba(200, 56, 36, 0.3)',
                  }}
                >
                  {loading ? 'Đang phân tích...' : 'Soạn thẻ với AI'}
                </button>
              </div>
            </div>

            {/* Tùy chọn mở rộng */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <button
                type="button"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1E4B75',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-maru)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                {showAdvancedOptions ? '▲ Thu gọn tùy chọn' : '▼ Tùy chọn thêm (Furigana, Nghĩa định sẵn, JLPT)'}
              </button>

              {showAdvancedOptions && (
                <div
                  style={{
                    marginTop: '1rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '1rem',
                    background: '#FFFFFF',
                    padding: '1.15rem',
                    borderRadius: '10px',
                    border: '1px solid #E6DDCF',
                  }}
                >
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#786A5E', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Furigana mong muốn:
                    </label>
                    <input
                      type="text"
                      placeholder="vd: けいさつ"
                      value={customReading}
                      onChange={(e) => setCustomReading(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', background: '#FAF7F0', border: '1px solid #E6DDCF', borderRadius: '6px', color: '#122438' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#786A5E', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Nghĩa định sẵn:
                    </label>
                    <input
                      type="text"
                      placeholder="vd: Cảnh sát"
                      value={customMeaning}
                      onChange={(e) => setCustomMeaning(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', background: '#FAF7F0', border: '1px solid #E6DDCF', borderRadius: '6px', color: '#122438' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#786A5E', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Cấp độ JLPT:
                    </label>
                    <select
                      value={learnerLevel}
                      onChange={(e) => setLearnerLevel(e.target.value as any)}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', background: '#FAF7F0', border: '1px solid #E6DDCF', borderRadius: '6px', color: '#122438' }}
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

          {/* THÔNG BÁO TỰ ĐỘNG PHÂN TÁCH NÉT NGHĨA */}
          {autoSplitNotice && (
            <div
              style={{
                background: '#FAF7F0',
                border: '1.2px solid #C89B58',
                borderRadius: '12px',
                padding: '1.15rem 1.4rem',
                marginBottom: '1.75rem',
                color: '#122438',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <SensuFanIcon size={20} color="#C89B58" />
              <div>{autoSplitNotice}</div>
            </div>
          )}

          {/* DANH SÁCH BẢN NHÁP THẺ THƠ ĐỂ DUYỆT */}
          {draftsList.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.35rem', fontWeight: 800, color: '#122438', margin: 0 }}>
                  Bản nháp ({draftsList.length} thẻ)
                </h2>
                <span
                  style={{
                    fontSize: '0.82rem',
                    color: '#3E734E',
                    background: '#EBF5EE',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    fontWeight: 600,
                  }}
                >
                  Vốn từ đã nắm vững: <strong>{masteredCount} từ</strong>
                </span>
              </div>

              {draftsList.map((draft, idx) => (
                <div
                  key={draft.id}
                  style={{
                    padding: '1.75rem',
                    background: '#FAF7F0',
                    border: '1.5px solid #C89B58',
                    borderRadius: '16px',
                    boxShadow: '0 6px 20px rgba(18, 36, 56, 0.05)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <span
                      style={{
                        background: draft.approved ? '#3E734E' : '#1E4B75',
                        color: '#FFFFFF',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-maru)',
                      }}
                    >
                      {draft.approved ? 'ĐÃ LƯU VÀO FSRS' : `THẺ ${idx + 1}/${draftsList.length}`}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                    {/* Cột 1: Từ vựng & Cách đọc */}
                    <div>
                      <div style={{ fontFamily: 'var(--font-mincho)', fontSize: '2.6rem', fontWeight: 900, color: '#122438' }}>
                        {draft.cardData.kanji_surface}
                      </div>
                      <div style={{ fontFamily: 'var(--font-maru)', fontSize: '1.15rem', color: '#1E4B75', fontWeight: 600, marginTop: '0.25rem' }}>
                        {draft.cardData.reading_furigana}
                      </div>
                      <div style={{ marginTop: '0.75rem' }}>
                        <PitchAccentGraph
                          reading={draft.cardData.reading_furigana}
                          pattern={draft.cardData.pitch_pattern}
                        />
                      </div>
                    </div>

                    {/* Cột 2: Nghĩa chính */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#786A5E', fontWeight: 600, marginBottom: '0.35rem' }}>
                        Ý nghĩa tiếng Việt:
                      </label>
                      <input
                        type="text"
                        value={draft.cardData.primary_meaning}
                        onChange={(e) => handleUpdateDraftField(draft.id, 'primary_meaning', e.target.value)}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#FFFFFF', border: '1.2px solid #E6DDCF', borderRadius: '8px', color: '#122438', fontSize: '0.95rem' }}
                      />
                    </div>
                  </div>

                  {/* Câu ví dụ ngữ cảnh */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#786A5E', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Câu ví dụ ngữ cảnh (i+1):
                    </label>
                    <textarea
                      rows={2}
                      value={draft.cardData.context_sentence}
                      onChange={(e) => handleUpdateDraftField(draft.id, 'context_sentence', e.target.value)}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#FFFFFF', border: '1.2px solid #E6DDCF', borderRadius: '8px', color: '#122438', fontSize: '0.92rem' }}
                    />
                  </div>

                  {/* Nút Duyệt thẻ */}
                  {!draft.approved ? (
                    <button
                      onClick={() => handleApproveDraft(draft)}
                      className="btn-torii"
                      style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
                    >
                      Lưu thẻ
                    </button>
                  ) : (
                    <div
                      style={{
                        padding: '0.75rem',
                        textAlign: 'center',
                        background: '#EBF5EE',
                        borderRadius: '8px',
                        color: '#3E734E',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        fontFamily: 'var(--font-maru)',
                      }}
                    >
                      Thẻ đã được lưu thành công!
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
            background: '#FAF7F0',
            padding: '2rem 2.25rem',
            borderRadius: '16px',
            border: '1.2px solid #E6DDCF',
            boxShadow: '0 6px 20px rgba(18, 36, 56, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {saveSuccess && (
            <div
              style={{
                padding: '0.85rem 1.15rem',
                background: '#EBF5EE',
                border: '1px solid #A3D9B1',
                borderRadius: '8px',
                color: '#265C35',
                fontWeight: 700,
                fontSize: '0.92rem',
                fontFamily: 'var(--font-maru)',
              }}
            >
              ✓ {saveSuccess}
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: '#122438', fontSize: '0.9rem' }}>
              Bộ thẻ
            </label>
            <select
              value={formData.deck}
              onChange={(e) => setFormData({ ...formData, deck: e.target.value })}
              style={{ width: '100%', padding: '0.75rem', background: '#FFFFFF', border: '1.2px solid #E6DDCF', borderRadius: '8px', color: '#122438' }}
            >
              <option value="deck_jpd133">JPD133 - Từ vựng Kotoba</option>
              <option value="deck_jpd133_kanji">JPD133 - Hán Tự (Kanji)</option>
              <option value="deck_n5">JLPT N5 - Từ vựng Cốt lõi</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: '#122438', fontSize: '0.9rem' }}>
              Loại thẻ
            </label>
            <select
              value={formData.cardType}
              onChange={(e) => setFormData({ ...formData, cardType: e.target.value })}
              style={{ width: '100%', padding: '0.75rem', background: '#FFFFFF', border: '1.2px solid #E6DDCF', borderRadius: '8px', color: '#122438' }}
            >
              <option value="Vocab">Từ vựng (Vocab)</option>
              <option value="Kanji">Chữ Hán (Kanji)</option>
              <option value="Cloze">Điền từ (Cloze)</option>
              <option value="Pitch">Cao độ (Pitch)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: '#122438', fontSize: '0.9rem' }}>
              Mặt trước (Kanji / Từ vựng)
            </label>
            <input
              type="text"
              placeholder="ví dụ: 桜, 食べる"
              value={formData.front}
              onChange={(e) => setFormData({ ...formData, front: e.target.value })}
              style={{ width: '100%', padding: '0.75rem', background: '#FFFFFF', border: '1.2px solid #E6DDCF', borderRadius: '8px', color: '#122438' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: '#122438', fontSize: '0.9rem' }}>
              Cách đọc (Hiragana / Furigana)
            </label>
            <input
              type="text"
              placeholder="ví dụ: さくら, たべる"
              value={formData.reading}
              onChange={(e) => setFormData({ ...formData, reading: e.target.value })}
              style={{ width: '100%', padding: '0.75rem', background: '#FFFFFF', border: '1.2px solid #E6DDCF', borderRadius: '8px', color: '#122438' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: '#122438', fontSize: '0.9rem' }}>
              Ý nghĩa tiếng Việt
            </label>
            <input
              type="text"
              placeholder="ví dụ: Hoa anh đào"
              value={formData.meaning}
              onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
              style={{ width: '100%', padding: '0.75rem', background: '#FFFFFF', border: '1.2px solid #E6DDCF', borderRadius: '8px', color: '#122438' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: '#122438', fontSize: '0.9rem' }}>
              Câu ví dụ (tùy chọn)
            </label>
            <input
              type="text"
              placeholder="ví dụ: 桜の花が綺麗です。"
              value={formData.sentence}
              onChange={(e) => setFormData({ ...formData, sentence: e.target.value })}
              style={{ width: '100%', padding: '0.75rem', background: '#FFFFFF', border: '1.2px solid #E6DDCF', borderRadius: '8px', color: '#122438' }}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-torii"
            style={{ padding: '0.85rem', marginTop: '0.5rem', opacity: saving ? 0.7 : 1 }}
          >
            <ToriiIcon size={16} color="#FFFFFF" />
            {saving ? 'Đang lưu...' : 'Lưu thẻ'}
          </button>
        </form>
      )}
    </div>
  );
}
