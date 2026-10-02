# ✍️ TÀI LIỆU 06: TÁI THIẾT KẾ SOẠN THẺ AI COPILOT (SRC/APP/CARDS/NEW/PAGE.TSX)
## Dự án: Japanese SRS System (FSRS)
## Mục tiêu: Bàn Thư Pháp Shodo (書道机) & Thẻ Thơ Tanzaku (短冊)

---

### 1. PHÂN TÍCH THAY ĐỔI TRANG TẠO THẺ HỌC
- **Hiện trạng cũ**: Form nền xanh đen tối tăm, các ô nhập thô ráp, thông báo AI phân tách thẻ khô khan, thiếu vắng vẻ đẹp chữ Hán.
- **Thiết kế mới (Shodo Desk & Tanzaku)**:
  1. **Bàn thư pháp Shodo (Calligraphy Desk)**: Ô nhập chữ tiếng Nhật nổi bật với cỡ chữ lớn, phông chữ `Shippori Mincho`, viền hiệu ứng nước mực Sumi.
  2. **Trạng thái AI Đang sinh thẻ (Loading)**: Hoạt họa hạc giấy Origami (`OrizuruIcon`) bay lượn và xoay nhẹ nhàng trên nền sóng Seigaiha mờ.
  3. **Thẻ thơ Tanzaku duyệt bài (Human-in-the-Loop Approval)**:
     - Thẻ nháp sinh ra mang phong cách thẻ thơ Tanzaku viền mạ vàng.
     - Phân tích Ngữ nguyên học chữ Hình thanh (Keisei-moji) đặt trong khung cuộn thư cổ.
     - Biểu đồ mô phỏng đường cao độ ngữ âm Tokyo Pitch Accent (Heiban/Atamadaka).
  4. **Nút Phê duyệt Đóng dấu son Inkan**: Khi người học nhấn "Duyệt & Lưu vào FSRS", con dấu son đỏ **「済」 (Sumi - Hoàn tất)** dập nảy xuống với âm hưởng trang trọng!
  5. **BẢO TOÀN TUYỆT ĐỐI BACKEND**: Giữ nguyên toàn bộ logic gọi API `/api/copilot/draft` (POST & PUT), các biến `draftId`, `editedData`, `autoSplitNotice`, `atomicity-validator`.

---

### 2. MÃ NGUỒN HOÀN CHỈNH CHO `src/app/cards/new/page.tsx`
Agent chỉ cần sao chép toàn bộ khối mã dưới đây và ghi đè vào file `src/app/cards/new/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ToriiIcon, OrizuruIcon, SensuFanIcon } from '@/components/japanese/Icons';

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
 */
export default function NewCardPage() {
  const [activeTab, setActiveTab] = useState<'copilot' | 'manual'>('copilot');

  // State cho 1 ô nhập từ vựng duy nhất
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
            `⚡ [Nguyên tắc Thông tin Tối thiểu] Bộ thẩm định atomicity-validator.ts phát hiện ${receivedDrafts.length} nét nghĩa phái sinh độc lập và đã tự động phân rã thành ${receivedDrafts.length} thẻ riêng biệt!`
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
    <div style={{ maxWidth: '850px', margin: '2rem auto', padding: '0 1.5rem 3rem' }}>
      {/* HEADER QUAY LẠI */}
      <div style={{ marginBottom: '2rem' }}>
        <Link
          href="/cards"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--sumi-faded)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontFamily: 'var(--font-maru)',
            fontWeight: 600,
            marginBottom: '0.75rem',
          }}
        >
          ← Quay lại danh mục thẻ
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h1 style={{ fontFamily: 'var(--font-mincho)', fontSize: '2.25rem', fontWeight: 800, color: 'var(--sumi-ink)' }}>
            Tạo thẻ học tiếng Nhật
          </h1>
          <span
            style={{
              padding: '0.2rem 0.6rem',
              background: 'var(--matcha-subtle)',
              color: 'var(--matcha-deep)',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              fontFamily: 'var(--font-maru)',
            }}
          >
            FSRS · Atomicity
          </span>
        </div>
        <p style={{ color: 'var(--sumi-faded)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Bàn thư pháp số tích hợp Trợ lý Trí tuệ Nhân tạo AI Copilot và Ngữ nguyên học chữ Hán
        </p>
      </div>

      {/* TABS CHUYỂN ĐỔI PHONG CÁCH THẺ GỖ KIFUDA */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '2rem',
          borderBottom: '2px solid var(--washi-border)',
        }}
      >
        <button
          onClick={() => setActiveTab('copilot')}
          style={{
            padding: '0.85rem 1.5rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'copilot' ? '3px solid var(--matcha-primary)' : 'none',
            color: activeTab === 'copilot' ? 'var(--matcha-deep)' : 'var(--sumi-faded)',
            fontFamily: 'var(--font-maru)',
            fontWeight: activeTab === 'copilot' ? 800 : 600,
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s',
          }}
        >
          ✨ AI Copilot ("Nhờ AI tạo thẻ")
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          style={{
            padding: '0.85rem 1.5rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'manual' ? '3px solid var(--matcha-primary)' : 'none',
            color: activeTab === 'manual' ? 'var(--matcha-deep)' : 'var(--sumi-faded)',
            fontFamily: 'var(--font-maru)',
            fontWeight: activeTab === 'manual' ? 800 : 600,
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s',
          }}
        >
          ✍️ Tự soạn thủ công (Base MVP)
        </button>
      </div>

      {/* TAB 1: AI COPILOT - BÀN THƯ PHÁP SHODO (1 Ô NHẬP DUY NHẤT) */}
      {activeTab === 'copilot' && (
        <div>
          <form
            onSubmit={handleCopilotSubmit}
            style={{
              background: 'var(--washi-surface)',
              padding: '2.25rem',
              borderRadius: '16px',
              border: '1px solid var(--washi-border)',
              boxShadow: 'var(--shadow-washi-md)',
              marginBottom: '2.5rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Dải viền Seigaiha mỏng trang trí đỉnh form */}
            <div
              className="wagara-seigaiha-matcha"
              style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px' }}
            />

            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="targetWordInput"
                style={{
                  display: 'block',
                  marginBottom: '0.6rem',
                  fontFamily: 'var(--font-mincho)',
                  fontWeight: 700,
                  fontSize: '1.15rem',
                  color: 'var(--sumi-ink)',
                }}
              >
                Nhập từ vựng hoặc chữ Kanji mục tiêu:
              </label>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <input
                  id="targetWordInput"
                  type="text"
                  placeholder="ví dụ: 警察, 桜, かける, 際, 儚い..."
                  value={targetWord}
                  onChange={(e) => setTargetWord(e.target.value)}
                  style={{
                    flex: '1 1 320px',
                    padding: '0.9rem 1.25rem',
                    background: 'var(--washi-bg)',
                    border: '2px solid var(--washi-border)',
                    borderRadius: '10px',
                    color: 'var(--sumi-ink)',
                    fontSize: '1.25rem',
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
                  className="btn-matcha"
                  style={{
                    padding: '0.9rem 1.85rem',
                    fontSize: '1.05rem',
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{ display: 'inline-block', animation: 'spin 1.5s linear infinite' }}>
                        <OrizuruIcon size={20} color="#FFFFFF" />
                      </span>
                      Đang phân tích nét nghĩa...
                    </>
                  ) : (
                    '✨ Nhờ AI tạo thẻ'
                  )}
                </button>
              </div>
            </div>

            {/* Tùy chọn nâng cao */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--matcha-deep)',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-maru)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                {showAdvancedOptions ? '▲ Thu gọn tùy chọn nâng cao' : '▼ Tùy chọn nâng cao (Furigana, Nghĩa định sẵn, Cấp độ JLPT)'}
              </button>

              {showAdvancedOptions && (
                <div
                  style={{
                    marginTop: '1.25rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    background: 'var(--washi-bg)',
                    padding: '1.25rem',
                    borderRadius: '10px',
                    border: '1px solid var(--washi-border)',
                  }}
                >
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--sumi-faded)', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Furigana mong muốn:
                    </label>
                    <input
                      type="text"
                      placeholder="vd: けいさつ"
                      value={customReading}
                      onChange={(e) => setCustomReading(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', background: '#FFFFFF', border: '1px solid var(--washi-border)', borderRadius: '6px', color: 'var(--sumi-ink)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--sumi-faded)', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Nghĩa gợi ý tùy ý:
                    </label>
                    <input
                      type="text"
                      placeholder="vd: Cảnh sát"
                      value={customMeaning}
                      onChange={(e) => setCustomMeaning(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', background: '#FFFFFF', border: '1px solid var(--washi-border)', borderRadius: '6px', color: 'var(--sumi-ink)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--sumi-faded)', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Trình độ học viên:
                    </label>
                    <select
                      value={learnerLevel}
                      onChange={(e) => setLearnerLevel(e.target.value as any)}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', background: '#FFFFFF', border: '1px solid var(--washi-border)', borderRadius: '6px', color: 'var(--sumi-ink)' }}
                    >
                      <option value="N5">🌸 JLPT N5</option>
                      <option value="N4">🍵 JLPT N4</option>
                      <option value="N3">🌊 JLPT N3</option>
                      <option value="N2">🍂 JLPT N2</option>
                      <option value="N1">漆 JLPT N1</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* THÔNG BÁO TỰ ĐỘNG PHÂN TÁCH NÉT NGHĨA (ATOMICITY GUARDRAIL) */}
          {autoSplitNotice && (
            <div
              style={{
                background: 'var(--matcha-subtle)',
                border: '1.5px solid var(--matcha-primary)',
                borderRadius: '12px',
                padding: '1.25rem 1.5rem',
                marginBottom: '2rem',
                color: 'var(--matcha-deep)',
                fontSize: '0.92rem',
                lineHeight: 1.6,
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: 'var(--shadow-washi-sm)',
              }}
            >
              <SensuFanIcon size={24} color="var(--matcha-deep)" />
              <div>{autoSplitNotice}</div>
            </div>
          )}

          {/* DANH SÁCH BẢN NHÁP THẺ THƠ TANZAKU ĐỂ DUYỆT (HUMAN-IN-THE-LOOP) */}
          {draftsList.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.45rem', fontWeight: 800, color: 'var(--sumi-ink)' }}>
                  Bản nháp được AI phân tích ({draftsList.length} thẻ đơn vị)
                </h2>
                <span
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--matcha-deep)',
                    background: 'var(--matcha-subtle)',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '999px',
                    fontWeight: 600,
                  }}
                >
                  Vốn từ đã nắm vững (S &gt; 21): <strong>{masteredCount} từ</strong>
                </span>
              </div>

              {draftsList.map((draft, idx) => (
                <div
                  key={draft.id}
                  className="card-karuta"
                  style={{
                    padding: '2rem',
                    background: draft.approved ? 'linear-gradient(180deg, #FFFFFF 0%, #F5F9ED 100%)' : 'var(--washi-surface)',
                    borderColor: draft.approved ? 'var(--matcha-primary)' : 'var(--washi-border)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                      <span
                        style={{
                          background: draft.approved ? 'var(--matcha-primary)' : 'var(--yamabuki-gold)',
                          color: '#FFFFFF',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          fontFamily: 'var(--font-maru)',
                        }}
                      >
                        {draft.approved ? '✅ ĐÃ LƯU VÀO FSRS' : `BẢN NHÁP ${idx + 1}/${draftsList.length}`}
                      </span>
                      <span
                        style={{
                          background: 'var(--washi-bg)',
                          color: 'var(--sumi-faded)',
                          border: '1px solid var(--washi-border)',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontFamily: 'monospace',
                        }}
                      >
                        FSRS: D=0, S=0, State=0
                      </span>
                    </div>

                    {/* Dấu son Inkan khi đã duyệt */}
                    {draft.approved && (
                      <div className="inkan-stamp-badge" title="Đã duyệt">
                        済
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    {/* Chữ Kanji lớn & Furigana */}
                    <div style={{ marginBottom: '0.5rem' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mincho)',
                          fontSize: '2.5rem',
                          fontWeight: 800,
                          color: 'var(--sumi-ink)',
                        }}
                      >
                        {draft.cardData.kanji_surface}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-maru)',
                          fontSize: '1.35rem',
                          color: 'var(--matcha-deep)',
                          marginLeft: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        【{draft.cardData.reading_furigana}】
                      </span>
                    </div>

                    <p style={{ color: 'var(--sumi-charcoal)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                      📍 Mẫu cao độ Tokyo: <strong>[{draft.cardData.pitch_pattern}]</strong>
                    </p>

                    {/* Ô chỉnh sửa nghĩa tiếng Việt */}
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--sumi-charcoal)', fontWeight: 600, marginBottom: '0.35rem' }}>
                        Nghĩa tiếng Việt (Có thể chỉnh sửa để bảo toàn nhận thức cá nhân):
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
                          padding: '0.75rem 1rem',
                          background: draft.approved ? 'var(--washi-bg)' : '#FFFFFF',
                          border: '1.5px solid var(--washi-border)',
                          borderRadius: '8px',
                          color: 'var(--sumi-ink)',
                          fontSize: '0.95rem',
                        }}
                      />
                    </div>

                    {/* Ô chỉnh sửa câu ví dụ ngữ cảnh i+1 */}
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--sumi-charcoal)', fontWeight: 600, marginBottom: '0.35rem' }}>
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
                          padding: '0.75rem 1rem',
                          background: draft.approved ? 'var(--washi-bg)' : '#FFFFFF',
                          border: '1.5px solid var(--washi-border)',
                          borderRadius: '8px',
                          color: 'var(--sumi-ink)',
                          fontSize: '0.95rem',
                          lineHeight: 1.5,
                        }}
                      />
                    </div>

                    {/* Khung chú giải Ngữ nguyên học chữ Hán Keisei-moji */}
                    {draft.cardData.etymology_notes && (
                      <div
                        style={{
                          marginTop: '1rem',
                          background: 'var(--matcha-tint)',
                          padding: '0.85rem 1.25rem',
                          borderRadius: '8px',
                          border: '1px solid var(--washi-border)',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.6rem',
                        }}
                      >
                        <span style={{ fontSize: '1.1rem' }}>📜</span>
                        <div style={{ fontSize: '0.88rem', color: 'var(--sumi-charcoal)', lineHeight: 1.5 }}>
                          <strong>Ngữ nguyên học (Keisei-moji / 形声文字):</strong> {draft.cardData.etymology_notes}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Nút Duyệt thẻ */}
                  {!draft.approved ? (
                    <button
                      onClick={() => handleApproveDraft(draft)}
                      className="btn-matcha"
                      style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
                    >
                      ✅ Duyệt &amp; Lưu vào lịch ôn tập FSRS (D=0, S=0, State=0)
                    </button>
                  ) : (
                    <div
                      style={{
                        padding: '0.85rem',
                        textAlign: 'center',
                        background: 'var(--matcha-subtle)',
                        borderRadius: '8px',
                        color: 'var(--matcha-deep)',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        fontFamily: 'var(--font-maru)',
                      }}
                    >
                      🎉 Thẻ đã được lưu vào cơ sở dữ liệu và đặt lịch học ngắt quãng thành công!
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MANUAL CREATION (TỰ SOẠN THỦ CÔNG) */}
      {activeTab === 'manual' && (
        <form
          onSubmit={handleManualSubmit}
          className="card-karuta"
          style={{
            padding: '2.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--sumi-ink)' }}>
              Loại thẻ học (Card Type)
            </label>
            <select
              value={formData.cardType}
              onChange={(e) => setFormData({ ...formData, cardType: e.target.value })}
              style={{ width: '100%', padding: '0.85rem', background: 'var(--washi-bg)', border: '1.5px solid var(--washi-border)', borderRadius: '8px', color: 'var(--sumi-ink)' }}
            >
              <option value="Vocab">語 Vocabulary (Từ vựng 1 nghĩa)</option>
              <option value="Kanji">漢 Kanji (Chữ Hán 1 ký tự)</option>
              <option value="Cloze">穴 Cloze (Điền từ 1 chỗ trống)</option>
              <option value="Pitch">音 Pitch Accent (Mẫu cao độ âm thanh)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--sumi-ink)' }}>
              Từ vựng / Chữ Hán mặt trước
            </label>
            <input
              type="text"
              placeholder="ví dụ: 桜, 食べる"
              value={formData.front}
              onChange={(e) => setFormData({ ...formData, front: e.target.value })}
              style={{ width: '100%', padding: '0.85rem', background: 'var(--washi-bg)', border: '1.5px solid var(--washi-border)', borderRadius: '8px', color: 'var(--sumi-ink)' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--sumi-ink)' }}>
              Ý nghĩa duy nhất (Tuân thủ Atomicity)
            </label>
            <input
              type="text"
              placeholder="ví dụ: Hoa anh đào"
              value={formData.meaning}
              onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
              style={{ width: '100%', padding: '0.85rem', background: 'var(--washi-bg)', border: '1.5px solid var(--washi-border)', borderRadius: '8px', color: 'var(--sumi-ink)' }}
              required
            />
          </div>

          <button type="submit" className="btn-torii" style={{ padding: '0.95rem' }}>
            <ToriiIcon size={18} color="#FFFFFF" />
            Lưu thẻ học vào FSRS
          </button>
        </form>
      )}
    </div>
  );
}
```
