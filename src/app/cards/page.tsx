'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ToriiIcon, SensuFanIcon } from '@/components/japanese/Icons';
import { JapaneseArtBackdrop } from '@/components/art/JapaneseArtBackdrop';

interface CardItem {
  id: string;
  kanji: string;
  reading: string;
  meaning: string;
  pitch?: string;
  type: string;
  deckId: string;
  deck: string;
  state: string;
  stability: number;
}

interface DeckItem {
  id: string;
  name: string;
  description?: string;
}

/**
 * Quản lý thư viện thẻ học (短冊帳 - Tanzakucho)
 * Hiển thị toàn bộ thẻ học từ cơ sở dữ liệu:
 * - JPD133 - Hán Tự Đã Học (Unit 4-7)
 * - JPD133 - Từ vựng Kotoba
 */
export default function CardsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeck, setSelectedDeck] = useState('all');
  const [cardsList, setCardsList] = useState<CardItem[]>([]);
  const [decksList, setDecksList] = useState<DeckItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCards() {
      try {
        setLoading(true);
        const res = await fetch('/api/cards');
        const data = await res.json();
        if (data.success) {
          setCardsList(data.data || []);
          setDecksList(data.decks || []);
        }
      } catch (err) {
        console.error('Lỗi khi tải danh sách thẻ:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCards();
  }, []);

  const filteredCards = cardsList.filter((card) => {
    const matchesSearch =
      card.kanji.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (card.reading && card.reading.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (card.meaning && card.meaning.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDeck =
      selectedDeck === 'all' ||
      card.deckId === selectedDeck ||
      card.deck.toLowerCase().includes(selectedDeck.toLowerCase());

    return matchesSearch && matchesDeck;
  });

  const getDeckBadgeStyle = (deckName: string, state: string) => {
    if (state === 'Review' || deckName.includes('Hán Tự Đã Học')) {
      return { bg: 'rgba(16, 185, 129, 0.15)', color: '#059669', border: '#10B981' };
    }
    if (deckName.includes('Kotoba')) return { bg: 'var(--matcha-subtle)', color: 'var(--matcha-deep)', border: '#C6DDA4' };
    if (deckName.includes('N5')) return { bg: 'var(--sakura-light)', color: 'var(--sakura-deep)', border: '#FBCFE8' };
    return { bg: 'var(--asagi-light)', color: 'var(--asagi-teal)', border: '#99F6E4' };
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
      {/* HEADER KHU VỰC THƯ VIỆN THẺ: TRIỂN LÃM MỘC BẢN HOKUSAI HỒ SUWA */}
      <div
        style={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          padding: '2.25rem',
          marginBottom: '2rem',
          border: '2px solid rgba(212, 175, 55, 0.4)',
          boxShadow: 'var(--shadow-karuta)',
          background: 'linear-gradient(135deg, #1F2A24 0%, #2A3B32 60%, #1A241E 100%)',
          color: '#FFFFFF',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'center',
          gap: '2rem',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
            <div
              className="hinomaru-disc"
              style={{ width: '34px', height: '34px', fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-mincho)' }}
            >
              冊
            </div>
            <span
              style={{
                fontFamily: 'var(--font-maru)',
                color: '#F59E0B',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.06em',
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                border: '1px solid rgba(245, 158, 11, 0.3)',
              }}
            >
              短冊帳 · BỘ SƯU TẬP TỪ VỰNG &amp; HÁN TỰ FSRS
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-mincho)', fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.6rem' }}>
            Quản lý thẻ học tiếng Nhật
          </h1>
          <p style={{ color: 'rgba(250, 248, 245, 0.88)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Tổng cộng: <strong>{cardsList.length} thẻ</strong> đã sẵn sàng ôn tập. Lọc theo chuyên đề, tìm kiếm Hán tự và theo dõi chu kỳ củng cố trí nhớ FSRS.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link href="/" className="btn-washi" style={{ background: 'rgba(255, 255, 255, 0.12)', color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.25)' }}>
              🏯 Trang chủ
            </Link>
            <Link href="/cards/new" className="btn-torii" style={{ boxShadow: '0 4px 16px rgba(217, 56, 30, 0.4)' }}>
              <ToriiIcon size={18} color="#FFFFFF" />
              + Soạn thẻ mới với AI
            </Link>
          </div>
        </div>

        {/* Khung tranh mộc bản Hồ Suwa nổi bật */}
        <div
          className="art-card-frame"
          style={{
            height: '190px',
            position: 'relative',
            borderRadius: '14px',
          }}
        >
          <Image
            src="/assets/art/hokusai-suwa-lake.jpg"
            alt="Tranh mộc bản Hokusai Hồ Suwa tỉnh Shinano"
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '0.5rem',
              left: '0.6rem',
              right: '0.6rem',
              background: 'rgba(31, 36, 33, 0.88)',
              backdropFilter: 'blur(6px)',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid rgba(212, 175, 55, 0.3)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mincho)', color: '#F59E0B', fontSize: '0.78rem', fontWeight: 700 }}>
              信州諏訪湖 · 葛飾北斎 (Hokusai)
            </span>
            <span style={{ fontSize: '0.7rem', color: '#D1D5DB' }}>
              富嶽三十六景
            </span>
          </div>
        </div>
      </div>

      {/* THANH TÌM KIẾM BÚT LÔNG & BỘ LỌC BỘ THẺ */}
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

        {/* Nút lọc thẻ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--sumi-faded)', fontWeight: 600, marginRight: '0.25rem' }}>
            Bộ thẻ:
          </span>
          <button
            onClick={() => setSelectedDeck('all')}
            style={{
              padding: '0.45rem 0.95rem',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: selectedDeck === 'all' ? 'var(--matcha-deep)' : 'var(--washi-border)',
              background: selectedDeck === 'all' ? 'var(--matcha-subtle)' : 'var(--washi-bg)',
              color: selectedDeck === 'all' ? 'var(--matcha-deep)' : 'var(--sumi-charcoal)',
              fontWeight: selectedDeck === 'all' ? 700 : 500,
              fontSize: '0.85rem',
              fontFamily: 'var(--font-maru)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Tất cả ({cardsList.length})
          </button>

          {decksList.map((d) => {
            const count = cardsList.filter((c) => c.deckId === d.id).length;
            const isKanjiDeck = d.id.includes('kanji');
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDeck(d.id)}
                style={{
                  padding: '0.45rem 0.95rem',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: selectedDeck === d.id ? (isKanjiDeck ? '#10B981' : 'var(--matcha-deep)') : 'var(--washi-border)',
                  background: selectedDeck === d.id ? (isKanjiDeck ? 'rgba(16, 185, 129, 0.15)' : 'var(--matcha-subtle)') : 'var(--washi-bg)',
                  color: selectedDeck === d.id ? (isKanjiDeck ? '#059669' : 'var(--matcha-deep)') : 'var(--sumi-charcoal)',
                  fontWeight: selectedDeck === d.id ? 700 : 500,
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-maru)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {isKanjiDeck ? '🌸 ' : '🍵 '}
                {d.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* BANNER HÀNH ĐỘNG NHANH: ÔN TẬP BỘ THẺ ĐANG CHỌN (DÒNG CHẢY RYUSUI KHẮC HỌA TRI THỨC) */}
      {selectedDeck !== 'all' && (
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 250, 242, 0.94) 100%)',
            border: '1.5px solid #C6DDA4',
            borderRadius: '14px',
            padding: '1.25rem 1.75rem',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-washi-sm)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <JapaneseArtBackdrop
            src="/assets/art/ryusui-indigo-stream.jpg"
            alt="Dòng sông Ryusui chàm Ogata Korin"
            opacity={0.16}
            blendMode="multiply"
            objectPosition="right center"
          />

          <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                background: selectedDeck.includes('kanji') ? 'var(--torii-subtle)' : 'var(--matcha-subtle)',
                color: selectedDeck.includes('kanji') ? 'var(--torii-red)' : 'var(--matcha-deep)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                fontFamily: 'var(--font-mincho)',
                fontWeight: 800,
                border: `1.5px solid ${selectedDeck.includes('kanji') ? 'var(--torii-red)' : 'var(--matcha-deep)'}`,
              }}
            >
              {selectedDeck.includes('kanji') ? '漢' : '語'}
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.15rem', color: 'var(--sumi-ink)', fontWeight: 700 }}>
                Đang lọc: {decksList.find((d) => d.id === selectedDeck)?.name || 'Bộ thẻ đã chọn'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--sumi-faded)' }}>
                Bao gồm <strong>{filteredCards.length}</strong> thẻ từ vựng &amp; Hán tự sẵn sàng cho phiên ôn tập Karuta
              </p>
            </div>
          </div>

          <Link
            href={`/review?deck=${selectedDeck}`}
            className="btn-torii"
            style={{
              position: 'relative',
              zIndex: 2,
              padding: '0.75rem 1.5rem',
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 16px rgba(217, 56, 30, 0.3)',
            }}
          >
            <ToriiIcon size={18} color="#FFFFFF" />
            Bắt đầu học bộ này ngay →
          </Link>
        </div>
      )}

      {/* DANH SÁCH BẢNG THẺ BÀI KARUTA (CATALOG TABLE CÓ NỀN HOA ANH ĐÀO MẠ VÀNG) */}
      <div
        style={{
          position: 'relative',
          background: 'var(--washi-surface)',
          borderRadius: '16px',
          border: '1px solid var(--washi-border)',
          boxShadow: 'var(--shadow-washi-md)',
          overflow: 'hidden',
        }}
      >
        <JapaneseArtBackdrop
          src="/assets/art/gold-sakura-washi.jpg"
          alt="Hoa anh đào mạ kim trên giấy Washi"
          opacity={0.08}
          blendMode="multiply"
          objectPosition="top right"
        />
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
              <th style={{ padding: '1.1rem 1.25rem' }}>Trạng thái nhận thức</th>
              <th style={{ padding: '1.1rem 1.25rem' }}>Loại thẻ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--sumi-faded)' }}>
                  ⏳ Đang tải dữ liệu từ Turso Cloud Database...
                </td>
              </tr>
            ) : filteredCards.length > 0 ? (
              filteredCards.map((card, idx) => {
                const badge = getDeckBadgeStyle(card.deck, card.state);
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
                      {card.pitch && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--sumi-faded)' }}>
                          Cao độ: {card.pitch}
                        </span>
                      )}
                    </td>

                    {/* Ý nghĩa */}
                    <td style={{ padding: '1.25rem', color: 'var(--sumi-charcoal)', fontSize: '0.95rem' }}>
                      {card.meaning}
                    </td>

                    {/* Trạng thái nhận thức */}
                    <td style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.6rem',
                            background: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`,
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontFamily: 'var(--font-maru)',
                            fontWeight: 700,
                            width: 'fit-content',
                          }}
                        >
                          {card.state === 'Review' ? '✅ Đã học (S=30d)' : '🌱 Mới (New)'}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--sumi-faded)' }}>
                          {card.deck}
                        </span>
                      </div>
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
