# 📜 TÀI LIỆU 05: TÁI THIẾT KẾ QUẢN LÝ THẺ HỌC (SRC/APP/CARDS/PAGE.TSX)
## Dự án: Japanese SRS System (FSRS)
## Mục tiêu: Cuộn sách Makimono & Danh mục thẻ bài Karuta truyền thống

---

### 1. PHÂN TÍCH THAY ĐỔI TRANG QUẢN LÝ THẺ
- **Hiện trạng cũ**: Bảng HTML xám xịt thô kệch, thanh tìm kiếm đơn điệu, các nhãn dán công nghệ không phân biệt được vẻ đẹp của chữ Hán (Kanji).
- **Thiết kế mới (Makimono Catalog)**:
  1. **Khung tìm kiếm Bút lông (Shodo Search Bar)**: Bo góc thanh nhã, viền giấy Washi, hiệu ứng gợn nước khi focus.
  2. **Thẻ gỗ phân loại Kifuda (木札 Deck Filters)**: Thay thế thẻ dropdown nhàm chán bằng hệ thống thẻ gỗ gắn nhãn JLPT (N5 - N1) mang các sắc màu tự nhiên:
     - N5: Hồng phấn Sakura (`#F472B6`)
     - N4: Xanh cốm Matcha (`#88A752`)
     - N3: Xanh ngọc Asagi (`#0D9488`)
     - N2: Vàng hổ phách Yamabuki (`#F59E0B`)
     - N1: Xanh thẫm Indigo Ai-iro (`#1E3A8A`)
  3. **Bảng thẻ bài Karuta & Thư pháp**:
     - Cột chữ Kanji được thể hiện bằng font thư pháp `Shippori Mincho` kích thước lớn, trang nghiêm.
     - Cột Furigana hỗ trợ chuẩn HTML `<ruby>` kèm chú giải âm thanh.
     - Cột Loại thẻ (Card Type) hiển thị dưới dạng con dấu son thủ công: **語** (Từ vựng), **漢** (Chữ Hán), **穴** (Điền khuyết Cloze), **音** (Cao độ Pitch).
  4. **Nút Thêm thẻ mới phong cách cổng Torii**: Kêu gọi hành động nổi bật.

---

### 2. MÃ NGUỒN HOÀN CHỈNH CHO `src/app/cards/page.tsx`
Agent chỉ cần sao chép toàn bộ khối mã dưới đây và ghi đè vào file `src/app/cards/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ToriiIcon, SensuFanIcon } from '@/components/japanese/Icons';

/**
 * Quản lý thư viện thẻ học (短冊帳 - Tanzakucho)
 */
export default function CardsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeck, setSelectedDeck] = useState('all');

  const mockCards = [
    { id: '1', kanji: '勉強', reading: 'べんきょう', meaning: 'Học tập, nghiên cứu', deck: 'JLPT N5', type: 'Vocab', pitch: '0 (Heiban)' },
    { id: '2', kanji: '猫', reading: 'ねこ', meaning: 'Con mèo', deck: 'JLPT N5', type: 'Kanji', pitch: '1 (Atamadaka)' },
    { id: '3', kanji: '食べる', reading: 'たべる', meaning: 'Ăn uống', deck: 'JLPT N5', type: 'Cloze', pitch: '2 (Nakadaka)' },
    { id: '4', kanji: '警察', reading: 'けいさつ', meaning: 'Cảnh sát, công an', deck: 'JLPT N4', type: 'Vocab', pitch: '0 (Heiban)' },
    { id: '5', kanji: '桜', reading: 'さくら', meaning: 'Hoa anh đào', deck: 'JLPT N5', type: 'Vocab', pitch: '0 (Heiban)' },
  ];

  const filteredCards = mockCards.filter((card) => {
    const matchesSearch =
      card.kanji.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.reading.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.meaning.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDeck =
      selectedDeck === 'all' || card.deck.toLowerCase().includes(selectedDeck.toLowerCase());
    return matchesSearch && matchesDeck;
  });

  const getDeckBadgeStyle = (deck: string) => {
    if (deck.includes('N5')) return { bg: 'var(--sakura-light)', color: 'var(--sakura-deep)', border: '#FBCFE8' };
    if (deck.includes('N4')) return { bg: 'var(--matcha-subtle)', color: 'var(--matcha-deep)', border: '#C6DDA4' };
    if (deck.includes('N3')) return { bg: 'var(--asagi-light)', color: 'var(--asagi-teal)', border: '#99F6E4' };
    return { bg: 'var(--yamabuki-light)', color: 'var(--yamabuki-amber)', border: '#FDE68A' };
  };

  const getTypeSeal = (type: string) => {
    switch (type) {
      case 'Vocab': return { text: '語', label: 'Từ vựng', color: 'var(--matcha-deep)' };
      case 'Kanji': return { text: '漢', label: 'Chữ Hán', color: 'var(--torii-red)' };
      case 'Cloze': return { text: '穴', label: 'Điền từ', color: '#0284C7' };
      default: return { text: '音', label: 'Cao độ', color: '#D97706' };
    }
  };

  return (
    <div style={{ maxWidth: '1050px', margin: '2rem auto', padding: '0 1.5rem 3rem' }}>
      {/* HEADER KHU VỰC THƯ VIỆN THẺ */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-mincho)',
                color: 'var(--torii-red)',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            >
              短冊帳 · BỘ SƯU TẬP
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-mincho)', fontSize: '2rem', fontWeight: 800, color: 'var(--sumi-ink)' }}>
            Quản lý thẻ học tiếng Nhật
          </h1>
          <p style={{ color: 'var(--sumi-faded)', fontSize: '0.95rem' }}>
            Thư viện thẻ bài được tối ưu theo Nguyên tắc Thông tin tối thiểu (Atomicity)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/" className="btn-washi">
            🏯 Trang chủ
          </Link>
          <Link href="/cards/new" className="btn-torii">
            <ToriiIcon size={18} color="#FFFFFF" />
            + Soạn thẻ mới
          </Link>
        </div>
      </div>

      {/* THANH TÌM KIẾM BÚT LÔNG & BỘ LỌC THẺ GỖ KIFUDA */}
      <div
        style={{
          background: 'var(--washi-surface)',
          padding: '1.25rem 1.5rem',
          borderRadius: '16px',
          border: '1px solid var(--washi-border)',
          boxShadow: 'var(--shadow-washi-sm)',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        {/* Input Tìm kiếm */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="🔍 Tìm kiếm từ vựng, chữ Kanji, cách đọc Furigana hoặc nghĩa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.85rem 1.25rem',
              background: 'var(--washi-bg)',
              border: '1.5px solid var(--washi-border)',
              borderRadius: '10px',
              color: 'var(--sumi-ink)',
              fontSize: '1rem',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
              transition: 'border-color 0.2s',
            }}
          />
        </div>

        {/* Nút lọc thẻ gỗ Kifuda */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--sumi-faded)', fontWeight: 600, marginRight: '0.25rem' }}>
            Chọn cấp độ:
          </span>
          {[
            { id: 'all', label: 'Tất cả (全)' },
            { id: 'n5', label: '🌸 JLPT N5' },
            { id: 'n4', label: '🍵 JLPT N4' },
            { id: 'n3', label: '🌊 JLPT N3' },
            { id: 'n2', label: '🍂 JLPT N2' },
          ].map((deck) => (
            <button
              key={deck.id}
              onClick={() => setSelectedDeck(deck.id)}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: selectedDeck === deck.id ? 'var(--matcha-deep)' : 'var(--washi-border)',
                background: selectedDeck === deck.id ? 'var(--matcha-subtle)' : 'var(--washi-bg)',
                color: selectedDeck === deck.id ? 'var(--matcha-deep)' : 'var(--sumi-charcoal)',
                fontWeight: selectedDeck === deck.id ? 700 : 500,
                fontSize: '0.85rem',
                fontFamily: 'var(--font-maru)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {deck.label}
            </button>
          ))}
        </div>
      </div>

      {/* DANH SÁCH BẢNG THẺ BÀI KARUTA (CATALOG TABLE) */}
      <div
        style={{
          background: 'var(--washi-surface)',
          borderRadius: '16px',
          border: '1px solid var(--washi-border)',
          boxShadow: 'var(--shadow-washi-md)',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr
              style={{
                background: 'var(--matcha-tint)',
                borderBottom: '2px solid var(--washi-border)',
                color: 'var(--sumi-charcoal)',
                fontSize: '0.88rem',
                fontFamily: 'var(--font-maru)',
                fontWeight: 700,
              }}
            >
              <th style={{ padding: '1.1rem 1.25rem' }}>Chữ Hán (Mặt trước)</th>
              <th style={{ padding: '1.1rem 1.25rem' }}>Cách đọc Furigana</th>
              <th style={{ padding: '1.1rem 1.25rem' }}>Ý nghĩa tiếng Việt</th>
              <th style={{ padding: '1.1rem 1.25rem' }}>Cấp độ Deck</th>
              <th style={{ padding: '1.1rem 1.25rem' }}>Loại thẻ</th>
            </tr>
          </thead>
          <tbody>
            {filteredCards.length > 0 ? (
              filteredCards.map((card, idx) => {
                const badge = getDeckBadgeStyle(card.deck);
                const seal = getTypeSeal(card.type);

                return (
                  <tr
                    key={card.id}
                    style={{
                      borderBottom: '1px solid var(--washi-border-soft)',
                      background: idx % 2 === 0 ? 'var(--washi-surface)' : 'var(--washi-card)',
                      transition: 'background 0.2s',
                    }}
                  >
                    {/* Mặt trước Kanji nổi bật */}
                    <td style={{ padding: '1.25rem' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mincho)',
                          fontSize: '1.65rem',
                          fontWeight: 700,
                          color: 'var(--sumi-ink)',
                        }}
                      >
                        {card.kanji}
                      </span>
                    </td>

                    {/* Furigana & Cao độ */}
                    <td style={{ padding: '1.25rem' }}>
                      <div style={{ fontFamily: 'var(--font-maru)', fontSize: '1.05rem', color: 'var(--matcha-deep)', fontWeight: 600 }}>
                        {card.reading}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--sumi-faded)' }}>
                        Cao độ: {card.pitch}
                      </span>
                    </td>

                    {/* Ý nghĩa */}
                    <td style={{ padding: '1.25rem', color: 'var(--sumi-charcoal)', fontSize: '0.95rem' }}>
                      {card.meaning}
                    </td>

                    {/* Cấp độ Deck */}
                    <td style={{ padding: '1.25rem' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.3rem 0.75rem',
                          background: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`,
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontFamily: 'var(--font-maru)',
                          fontWeight: 700,
                        }}
                      >
                        {card.deck}
                      </span>
                    </td>

                    {/* Con dấu loại thẻ */}
                    <td style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            width: '28px',
                            height: '28px',
                            border: `1.5px solid ${seal.color}`,
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: seal.color,
                            fontFamily: 'var(--font-mincho)',
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            background: 'rgba(255, 255, 255, 0.8)',
                          }}
                        >
                          {seal.text}
                        </span>
                        <span style={{ fontSize: '0.82rem', color: 'var(--sumi-faded)' }}>
                          {seal.label}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--sumi-faded)' }}>
                  <SensuFanIcon size={36} color="var(--sumi-water)" />
                  <p style={{ marginTop: '0.75rem', fontSize: '1rem', fontFamily: 'var(--font-mincho)' }}>
                    Không tìm thấy thẻ học nào phù hợp với bộ lọc
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```
