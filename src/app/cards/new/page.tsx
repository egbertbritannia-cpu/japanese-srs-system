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
  const [copilotError, setCopilotError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [previewFlipped, setPreviewFlipped] = useState<boolean>(false);
  const [isComposing, setIsComposing] = useState<boolean>(false);
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
    setCopilotError(null);

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
        setCopilotError(data.feedback || data.error || 'Có lỗi xảy ra trong quá trình sinh thẻ');
      }
    } catch {
      setCopilotError('Không thể kết nối đến máy chủ AI Copilot API');
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
    setCopilotError(null);
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
        setCopilotError(data.error || 'Không thể lưu thẻ học');
      }
    } catch {
      setCopilotError('Lỗi khi phê duyệt và lưu thẻ học vào SQLite/Turso');
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.front.trim() || !formData.meaning.trim()) {
      setFormError('Vui lòng nhập từ vựng (Mặt trước) và ý nghĩa cốt lõi tiếng Việt');
      return;
    }

    setSaving(true);
    setSaveSuccess(null);
    setFormError(null);
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
        setPreviewFlipped(false);
        setTimeout(() => setSaveSuccess(null), 4000);
      } else {
        setFormError(data.error || 'Lỗi khi lưu thẻ học');
      }
    } catch {
      setFormError('Không thể kết nối đến máy chủ API');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main
      style={{
        position: 'relative',
        minHeight: '100vh',
        padding: '1.5rem 1rem 5rem',
      }}
    >
      {/* HÌNH NỀN HOA ANH ĐÀO MẠ KIM TOÀN TRANG TẠO THẺ */}
      <JapaneseArtBackdrop
        src="/assets/art/gold-sakura-washi.webp"
        alt="Hoa anh đào mạ kim"
        opacity={0.065}
        blendMode="multiply"
      />

      <div style={{ maxWidth: activeTab === 'manual' ? '1140px' : '820px', margin: '0 auto', position: 'relative', zIndex: 10, transition: 'max-width 0.3s ease' }}>
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

      {/* TABS CHUYỂN ĐỔI - AESTHETIC SEGMENTED CONTROL PILL (VIS-NEW-01) */}
      <div
        style={{
          display: 'inline-flex',
          background: '#EAE3D2',
          padding: '0.35rem',
          borderRadius: '14px',
          border: '1.2px solid #D8CDB8',
          position: 'relative',
          marginBottom: '1.75rem',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)',
        }}
      >
        {[
          { id: 'manual', label: '✍️ Soạn thủ công', desc: 'Kiểm soát từng nét cọ' },
          { id: 'copilot', label: '🤖 AI Copilot', desc: 'Tự động khai thác từ vựng' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '0.65rem 1.45rem',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? '#FFFFFF' : 'transparent',
                color: isActive ? '#122438' : '#786A5E',
                fontFamily: 'var(--font-maru)',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.92rem',
                cursor: 'pointer',
                boxShadow: isActive ? '0 2px 8px rgba(18, 36, 56, 0.08)' : 'none',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: AI COPILOT (VIS-NEW-01, VIS-NEW-02, VIS-NEW-05) */}
      {activeTab === 'copilot' && (
        <div style={{ minHeight: '480px' }}>
          <form
            onSubmit={handleCopilotSubmit}
            className="bento-card-artisan"
            style={{
              background: '#FAF7F0',
              padding: '2rem 2.25rem',
              borderRadius: '16px',
              border: '1.5px solid #C89B58',
              boxShadow: '0 6px 20px rgba(18, 36, 56, 0.05)',
              marginBottom: '2rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <JapaneseArtBackdrop
              src="/assets/art/cloud-mist-kasumi-icons.webp"
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
                  fontWeight: 800,
                  fontSize: '1.2rem',
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
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <ToriiIcon size={16} color="#FFFFFF" />
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
                  fontWeight: 700,
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

          {copilotError && (
            <div
              style={{
                background: '#FEF2F2',
                border: '1.2px solid #FCA5A5',
                borderRadius: '12px',
                padding: '0.9rem 1.2rem',
                marginBottom: '1.5rem',
                color: '#991B1B',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
              }}
            >
              <span>⚠</span>
              <span>{copilotError}</span>
            </div>
          )}

          {/* THÔNG BÁO TỰ ĐỘNG PHÂN TÁCH NÉT NGHĨA - HUY HIỆU THÀNH TỰU NHẬN THỨC (VIS-NEW-05) */}
          {autoSplitNotice && (
            <div
              style={{
                background: 'linear-gradient(135deg, #F0F7F2 0%, #E6F3EA 100%)',
                border: '1.2px solid #A3D9B1',
                borderRadius: '14px',
                padding: '1.1rem 1.35rem',
                marginBottom: '1.75rem',
                color: '#1B522A',
                fontSize: '0.92rem',
                lineHeight: 1.55,
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                boxShadow: '0 4px 14px rgba(42, 107, 61, 0.08)',
              }}
            >
              <span style={{ fontSize: '1.4rem' }}>💎</span>
              <div>
                <strong style={{ color: '#144020', display: 'block', marginBottom: '0.15rem', fontFamily: 'var(--font-maru)' }}>
                  Trí tuệ AI · Chuẩn hóa FSRS Atomic
                </strong>
                {autoSplitNotice}
              </div>
            </div>
          )}

          {/* DANH SÁCH BẢN NHÁP THẺ THƠ ĐỂ DUYỆT - MULTI-TIER KAKEJIKU (VIS-NEW-02) */}
          {draftsList.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.35rem', fontWeight: 800, color: '#122438', margin: 0 }}>
                  Bản nháp Kakejiku ({draftsList.length} thẻ)
                </h2>
                <span
                  style={{
                    fontSize: '0.82rem',
                    color: '#2A6B3D',
                    background: '#EBF5EE',
                    padding: '0.3rem 0.85rem',
                    borderRadius: '999px',
                    fontWeight: 700,
                    border: '1px solid #C2E5CC',
                  }}
                >
                  Vốn từ đã nắm vững: <strong>{masteredCount} từ</strong>
                </span>
              </div>

              {draftsList.map((draft, idx) => (
                <div
                  key={draft.id}
                  className="bento-card-artisan"
                  style={{
                    padding: '2rem',
                    background: '#FAF7F0',
                    border: '1.5px solid #C89B58',
                    borderRadius: '18px',
                    boxShadow: '0 8px 24px rgba(18, 36, 56, 0.06)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <span
                      style={{
                        background: draft.approved ? '#2A6B3D' : '#1E4B75',
                        color: '#FFFFFF',
                        padding: '0.28rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-maru)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {draft.approved ? '✓ ĐÃ LƯU VÀO FSRS' : `BẢN NHÁP ${idx + 1}/${draftsList.length}`}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    {/* Cột 1: Từ vựng & Cách đọc & Biểu đồ Pitch */}
                    <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--washi-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontFamily: 'var(--font-mincho)', fontSize: '2.8rem', fontWeight: 900, color: '#122438', lineHeight: 1.15 }}>
                            {draft.cardData.kanji_surface}
                          </div>
                          <div style={{ fontFamily: 'var(--font-maru)', fontSize: '1.2rem', color: '#1E4B75', fontWeight: 700, marginTop: '0.35rem' }}>
                            {draft.cardData.reading_furigana}
                          </div>
                        </div>
                        <JapaneseSpeakerButton text={draft.cardData.kanji_surface} size={22} />
                      </div>

                      <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--washi-border)' }}>
                        <div style={{ fontSize: '0.76rem', color: '#786A5E', fontWeight: 700, marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                          Cao độ Tokyo (Pitch Accent)
                        </div>
                        <PitchAccentGraph
                          reading={draft.cardData.reading_furigana}
                          pattern={draft.cardData.pitch_pattern}
                        />
                      </div>
                    </div>

                    {/* Cột 2: Cấu trúc 3 tầng (Nghĩa, Ngữ cảnh, Tầm nguyên) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                      {/* Tầng 1: Nghĩa cốt lõi */}
                      <div style={{ background: '#FFFFFF', padding: '0.9rem 1.1rem', borderRadius: '12px', border: '1px solid var(--washi-border)' }}>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: '#786A5E', fontWeight: 700, marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                          Tầng 1 · Ý nghĩa tiếng Việt cốt lõi
                        </label>
                        <input
                          type="text"
                          value={draft.cardData.primary_meaning}
                          onChange={(e) => handleUpdateDraftField(draft.id, 'primary_meaning', e.target.value)}
                          style={{ width: '100%', padding: '0.55rem 0.75rem', background: '#FAF8F5', border: '1.2px solid #E6DDCF', borderRadius: '8px', color: '#122438', fontSize: '0.96rem', fontWeight: 600 }}
                        />
                      </div>

                      {/* Tầng 2: Câu ngữ cảnh */}
                      <div style={{ background: '#FFFFFF', padding: '0.9rem 1.1rem', borderRadius: '12px', border: '1px solid var(--washi-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                          <label style={{ fontSize: '0.78rem', color: '#786A5E', fontWeight: 700, textTransform: 'uppercase' }}>
                            Tầng 2 · Câu ngữ cảnh (i+1)
                          </label>
                          <JapaneseSpeakerButton text={draft.cardData.context_sentence} size={18} />
                        </div>
                        <textarea
                          rows={2}
                          value={draft.cardData.context_sentence}
                          onChange={(e) => handleUpdateDraftField(draft.id, 'context_sentence', e.target.value)}
                          style={{ width: '100%', padding: '0.55rem 0.75rem', background: '#FAF8F5', border: '1.2px solid #E6DDCF', borderRadius: '8px', color: '#122438', fontSize: '0.92rem', lineHeight: 1.5 }}
                        />
                      </div>

                      {/* Tầng 3: Tầm nguyên / Ghi chú nếu có */}
                      {draft.cardData.etymology_notes && (
                        <div style={{ background: '#FFF9E6', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #FFEAA7', fontSize: '0.84rem', color: '#8A6D1C', lineHeight: 1.5 }}>
                          <span style={{ fontWeight: 800, marginRight: '0.35rem' }}>[漢] Tầm nguyên &amp; Ghi chú:</span>
                          {draft.cardData.etymology_notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Nút Duyệt thẻ (VIS-NEW-04) */}
                  {!draft.approved ? (
                    <button
                      onClick={() => handleApproveDraft(draft)}
                      className="btn-torii"
                      style={{
                        width: '100%',
                        padding: '0.9rem',
                        fontSize: '1rem',
                        fontWeight: 700,
                        boxShadow: '0 4px 16px rgba(200, 56, 36, 0.25)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <ToriiIcon size={18} color="#FFFFFF" />
                      Lưu vào kho thẻ FSRS
                    </button>
                  ) : (
                    <div
                      style={{
                        padding: '0.85rem',
                        textAlign: 'center',
                        background: '#EBF5EE',
                        border: '1.2px solid #A3D9B1',
                        borderRadius: '10px',
                        color: '#265C35',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        fontFamily: 'var(--font-maru)',
                      }}
                    >
                      ✓ Thẻ đã được lưu thành công vào hệ thống!
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MANUAL CREATION (VIS-NEW-03, VIS-NEW-04) + LIVE TANZAKU PREVIEW */}
      {activeTab === 'manual' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.75rem',
          alignItems: 'start',
        }}>
          {/* CỘT TRÁI: BÀN THƯ PHÁP NHẬP LIỆU (SHODO FORM) */}
          <form
            onSubmit={handleManualSubmit}
            className="bento-card-artisan"
            style={{
              background: '#FAF7F0',
              padding: '2rem 2.25rem',
              borderRadius: '16px',
              border: '1.5px solid #C89B58',
              boxShadow: '0 6px 20px rgba(18, 36, 56, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            {/* THÔNG BÁO LỖI / THÀNH CÔNG */}
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
            {formError && (
              <div
                style={{
                  padding: '0.85rem 1.15rem',
                  background: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  borderRadius: '8px',
                  color: '#991B1B',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  fontFamily: 'var(--font-maru)',
                }}
              >
                ⚠ {formError}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 700, color: '#122438', fontSize: '0.9rem' }}>
                  Bộ thẻ
                </label>
                <select
                  value={formData.deck}
                  onChange={(e) => setFormData({ ...formData, deck: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', background: '#FFFFFF', border: '1.2px solid #E6DDCF', borderRadius: '8px', color: '#122438', fontSize: '0.9rem' }}
                >
                  <option value="deck_jpd133">JPD133 - Từ vựng Kotoba</option>
                  <option value="deck_jpd133_kanji">JPD133 - Hán Tự (Kanji)</option>
                  <option value="deck_n5">JLPT N5 - Từ vựng Cốt lõi</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 700, color: '#122438', fontSize: '0.9rem' }}>
                  Loại thẻ
                </label>
                <select
                  value={formData.cardType}
                  onChange={(e) => setFormData({ ...formData, cardType: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', background: '#FFFFFF', border: '1.2px solid #E6DDCF', borderRadius: '8px', color: '#122438', fontSize: '0.9rem' }}
                >
                  <option value="Vocab">Từ vựng (Vocab)</option>
                  <option value="Kanji">Chữ Hán (Kanji)</option>
                  <option value="Cloze">Điền từ (Cloze)</option>
                  <option value="Pitch">Cao độ (Pitch)</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 700, color: '#122438', fontSize: '0.9rem' }}>
                Mặt trước (Kanji / Từ vựng)
              </label>
              <input
                type="text"
                placeholder="ví dụ: 桜, 食べる"
                value={formData.front}
                onChange={(e) => setFormData({ ...formData, front: e.target.value })}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (isComposing || (e as any).nativeEvent?.isComposing)) {
                    e.preventDefault();
                  }
                }}
                style={{ width: '100%', padding: '0.75rem 0.95rem', background: '#FFFFFF', border: '1.2px solid #E6DDCF', borderRadius: '8px', color: '#122438', fontSize: '1.1rem', fontFamily: 'var(--font-mincho)' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 700, color: '#122438', fontSize: '0.9rem' }}>
                Cách đọc (Hiragana / Furigana)
              </label>
              <input
                type="text"
                placeholder="ví dụ: さくら, たべる"
                value={formData.reading}
                onChange={(e) => setFormData({ ...formData, reading: e.target.value })}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (isComposing || (e as any).nativeEvent?.isComposing)) {
                    e.preventDefault();
                  }
                }}
                style={{ width: '100%', padding: '0.75rem 0.95rem', background: '#FFFFFF', border: '1.2px solid #E6DDCF', borderRadius: '8px', color: '#122438', fontSize: '0.95rem', fontFamily: 'var(--font-maru)' }}
              />
            </div>

            {/* CHỌN MẪU CAO ĐỘ PITCH ACCENT TRỰC QUAN (VIS-NEW-03) */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, color: '#122438', fontSize: '0.9rem' }}>
                Mẫu hình Cao độ Pitch Accent Tokyo:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.65rem' }}>
                {[
                  { id: '0', label: '平板 Heiban [0]', symbol: '_ ‾ ‾ (Bằng)' },
                  { id: '1', label: '頭高 Atamadaka [1]', symbol: '‾ _ _ (Đỉnh 1)' },
                  { id: '2', label: '中高 Nakadaka [2]', symbol: '_ ‾ _ (Núi)' },
                  { id: '3', label: '尾高 Odaka [3]', symbol: '_ ‾ [ \\ ] (Hạ)' },
                ].map((pattern) => {
                  const isSelected = formData.pitch === pattern.id;
                  return (
                    <button
                      key={pattern.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, pitch: isSelected ? '' : pattern.id })}
                      style={{
                        padding: '0.6rem 0.75rem',
                        borderRadius: '10px',
                        border: `1.5px solid ${isSelected ? '#1E4B75' : '#E6DDCF'}`,
                        background: isSelected ? '#EDF4FA' : '#FFFFFF',
                        color: isSelected ? '#1E4B75' : '#122438',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.18s ease',
                        boxShadow: isSelected ? '0 2px 8px rgba(30, 75, 117, 0.12)' : 'none',
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: '0.8rem', fontFamily: 'var(--font-maru)' }}>
                        {pattern.label}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: isSelected ? '#1E4B75' : '#786A5E', marginTop: '0.2rem' }}>
                        {pattern.symbol}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 700, color: '#122438', fontSize: '0.9rem' }}>
                Ý nghĩa tiếng Việt
              </label>
              <input
                type="text"
                placeholder="ví dụ: Hoa anh đào"
                value={formData.meaning}
                onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (isComposing || (e as any).nativeEvent?.isComposing)) {
                    e.preventDefault();
                  }
                }}
                style={{ width: '100%', padding: '0.75rem 0.95rem', background: '#FFFFFF', border: '1.2px solid #E6DDCF', borderRadius: '8px', color: '#122438', fontSize: '0.95rem' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 700, color: '#122438', fontSize: '0.9rem' }}>
                Câu ví dụ (tùy chọn)
              </label>
              <input
                type="text"
                placeholder="ví dụ: 桜の花が綺麗です。"
                value={formData.sentence}
                onChange={(e) => setFormData({ ...formData, sentence: e.target.value })}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (isComposing || (e as any).nativeEvent?.isComposing)) {
                    e.preventDefault();
                  }
                }}
                style={{ width: '100%', padding: '0.75rem 0.95rem', background: '#FFFFFF', border: '1.2px solid #E6DDCF', borderRadius: '8px', color: '#122438', fontSize: '0.95rem' }}
              />
            </div>

            {/* NÚT LƯU THẺ THỦ CÔNG - SHODO STAMP SUBMIT (VIS-NEW-04) */}
            <button
              type="submit"
              disabled={saving}
              className="btn-torii"
              style={{
                padding: '0.95rem',
                marginTop: '0.5rem',
                opacity: saving ? 0.75 : 1,
                fontSize: '1rem',
                fontWeight: 700,
                boxShadow: '0 4px 16px rgba(200, 56, 36, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <ToriiIcon size={18} color="#FFFFFF" />
              {saving ? 'Đang đóng dấu mộc lưu thẻ...' : 'Lưu thẻ vào hệ thống'}
            </button>
          </form>

          {/* CỘT PHẢI: MÔ PHỎNG THẺ THƠ TANZAKU THỜI GIAN THỰC (LIVE PREVIEW) */}
          <div
            className="bento-card-artisan"
            style={{
              background: '#FAF7F0',
              padding: '2rem',
              borderRadius: '16px',
              border: '1.5px solid #C89B58',
              boxShadow: '0 6px 20px rgba(18, 36, 56, 0.05)',
              position: 'sticky',
              top: '2rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#786A5E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Mô phỏng Thẻ thơ Tanzaku
                </span>
                <h3 style={{ margin: '0.2rem 0 0', fontFamily: 'var(--font-mincho)', fontSize: '1.2rem', color: '#122438' }}>
                  {previewFlipped ? 'Mặt sau (Đáp án & FSRS)' : 'Mặt trước (Truy hồi chủ động)'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewFlipped(!previewFlipped)}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '8px',
                  border: '1.2px solid #1E4B75',
                  background: previewFlipped ? '#1E4B75' : '#FFFFFF',
                  color: previewFlipped ? '#FFFFFF' : '#1E4B75',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-maru)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span>↻ Lật thẻ</span>
              </button>
            </div>

            {/* KHUNG THẺ 3D KARUTA / TANZAKU PREVIEW */}
            <div
              onClick={() => setPreviewFlipped(!previewFlipped)}
              style={{
                cursor: 'pointer',
                background: '#FFFFFF',
                borderRadius: '14px',
                border: '1.5px solid #E6DDCF',
                boxShadow: '0 8px 24px rgba(18, 36, 56, 0.07)',
                padding: '2rem 1.5rem',
                minHeight: '360px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              {/* Thẻ meta (Deck & Type) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '999px',
                  background: '#EDF4FA',
                  color: '#1E4B75',
                  fontWeight: 700,
                  fontFamily: 'var(--font-maru)',
                }}>
                  {formData.deck === 'deck_jpd133_kanji' ? 'Hán Tự Kanji' : formData.deck === 'deck_n5' ? 'JLPT N5' : 'Kotoba JPD133'}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '999px',
                  background: '#FAF0E6',
                  color: '#C83824',
                  fontWeight: 700,
                }}>
                  {formData.cardType}
                </span>
              </div>

              {!previewFlipped ? (
                /* MẶT TRƯỚC: ACTIVE RECALL */
                <div style={{ textAlign: 'center', margin: 'auto 0' }}>
                  <div style={{
                    fontFamily: 'var(--font-mincho)',
                    fontSize: '3.6rem',
                    fontWeight: 900,
                    color: '#122438',
                    letterSpacing: '0.04em',
                    lineHeight: 1.15,
                  }}>
                    {formData.front.trim() || '桜'}
                  </div>
                  <p style={{ marginTop: '0.85rem', color: '#786A5E', fontSize: '0.82rem', fontFamily: 'var(--font-maru)' }}>
                    Nhấn vào thẻ hoặc nút &quot;Lật thẻ&quot; để kiểm tra mặt sau
                  </p>
                </div>
              ) : (
                /* MẶT SAU: FULL ANSWER & COGNITIVE CUES */
                <div style={{ margin: 'auto 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-maru)', fontSize: '1.35rem', fontWeight: 800, color: '#1E4B75' }}>
                        {formData.reading.trim() || 'さくら'}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.6rem', fontWeight: 800, color: '#122438', marginTop: '0.15rem' }}>
                        {formData.front.trim() || '桜'}
                      </div>
                    </div>
                    {formData.front && (
                      <div onClick={(e) => e.stopPropagation()}>
                        <JapaneseSpeakerButton text={formData.front} size={22} />
                      </div>
                    )}
                  </div>

                  {formData.pitch && (
                    <div style={{ marginBottom: '0.85rem', padding: '0.5rem 0.75rem', background: '#FAF8F5', borderRadius: '8px', border: '1px solid #E6DDCF' }}>
                      <div style={{ fontSize: '0.72rem', color: '#786A5E', fontWeight: 700, marginBottom: '0.25rem' }}>
                        CAO ĐỘ TOKYO PITCH ACCENT [{formData.pitch}]
                      </div>
                      <PitchAccentGraph
                        reading={formData.reading.trim() || formData.front.trim() || 'さくら'}
                        pattern={parseInt(formData.pitch, 10) || 0}
                      />
                    </div>
                  )}

                  <div style={{
                    padding: '0.75rem 0.9rem',
                    background: '#EDF7EE',
                    borderRadius: '8px',
                    border: '1px solid #C2E5CC',
                    marginBottom: '0.85rem',
                  }}>
                    <div style={{ fontSize: '0.72rem', color: '#2A6B3D', fontWeight: 800, textTransform: 'uppercase' }}>
                      Ý nghĩa cốt lõi tiếng Việt
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#144020', marginTop: '0.15rem' }}>
                      {formData.meaning.trim() || 'Hoa anh đào'}
                    </div>
                  </div>

                  {formData.sentence.trim() && (
                    <div style={{
                      padding: '0.75rem 0.9rem',
                      background: '#F8FAFC',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 800 }}>
                          CÂU VÍ DỤ NGỮ CẢNH
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                          <JapaneseSpeakerButton text={formData.sentence} size={16} />
                        </div>
                      </div>
                      <div style={{ fontSize: '0.88rem', color: '#1E293B', marginTop: '0.25rem', lineHeight: 1.5 }}>
                        {formData.sentence}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Chân thẻ */}
              <div style={{
                borderTop: '1px dashed #E6DDCF',
                paddingTop: '0.65rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.75rem',
                color: '#786A5E',
              }}>
                <span>FSRS v4.5 Active Recall</span>
                <span>Chuẩn Washi Wa-Style</span>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </main>
  );
}
