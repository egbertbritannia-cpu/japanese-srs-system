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
 * Thiết kế mang đậm phong cách Mộc bản & Cuộn tranh Washi truyền thống
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
        const res = await fetch('/api/cards?limit=1000');
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
      (card.deck && card.deck.toLowerCase().includes(selectedDeck.toLowerCase()));

    return matchesSearch && matchesDeck;
  });

  return (
    <div style={{ maxWidth: '980px', margin: '1.5rem auto', padding: '0 1.25rem 3.5rem' }}>
      {/* 1. HEADER CUỘN TRANH TOÀN CẢNH MỘC BẢN HOKUSAI HỒ SUWA */}
      <div
        style={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          padding: '2.5rem 2.25rem',
          marginBottom: '1.75rem',
          border: '1.5px solid #C89B58',
          boxShadow: '0 12px 32px rgba(18, 36, 56, 0.1)',
          background: 'linear-gradient(135deg, #0D233A 0%, #173859 60%, #10263E 100%)',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        {/* Lớp nền tranh mộc bản toàn cảnh Hồ Suwa của Hokusai */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.28, pointerEvents: 'none', zIndex: 0 }}>
          <Image
            src="/assets/art/hokusai-suwa-lake.jpg"
            alt="Tranh mộc bản Hokusai Hồ Suwa tỉnh Shinano"
            fill
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 35%' }}
          />
        </div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '580px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-mincho)',
                background: '#C83824',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.78rem',
                padding: '0.2rem 0.65rem',
                borderRadius: '4px',
                letterSpacing: '0.08em',
                boxShadow: '0 2px 6px rgba(200, 56, 36, 0.35)',
              }}
            >
              短冊帳 · MỤC LỤC
            </span>
            <span style={{ fontFamily: 'var(--font-maru)', fontSize: '0.82rem', color: '#E8D9BD' }}>
              Kho tàng từ vựng &amp; Hán tự FSRS
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: '2.3rem',
              fontWeight: 800,
              lineHeight: 1.25,
              margin: '0 0 0.5rem 0',
              textShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
            }}
          >
            Quản lý thẻ học tiếng Nhật
          </h1>

          <p style={{ color: 'rgba(250, 248, 245, 0.9)', fontSize: '0.92rem', lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>
            Tổng cộng: <strong>{cardsList.length} thẻ</strong> đã sẵn sàng ôn tập. Lọc theo chuyên đề, tìm kiếm Hán tự và theo dõi chu kỳ củng cố trí nhớ FSRS.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.65rem 1.25rem',
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                fontWeight: 600,
                textDecoration: 'none',
                fontFamily: 'var(--font-maru)',
              }}
            >
              ← Về Trang chủ
            </Link>
            <Link
              href="/cards/new"
              className="btn-torii"
              style={{
                boxShadow: '0 4px 16px rgba(200, 56, 36, 0.35)',
                padding: '0.65rem 1.35rem',
                fontSize: '0.9rem',
              }}
            >
              <ToriiIcon size={16} color="#FFFFFF" />
              + Soạn thẻ mới với AI
            </Link>
          </div>
        </div>

        {/* Khung họa tiết dấu ấn mộc bản */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            border: '1.5px solid rgba(200, 155, 88, 0.6)',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            background: 'rgba(13, 35, 58, 0.65)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.8rem', fontWeight: 900, color: '#C89B58' }}>
            {cardsList.length}
          </div>
          <div style={{ fontFamily: 'var(--font-maru)', fontSize: '0.75rem', color: '#E8D9BD', marginTop: '0.2rem' }}>
            Thẻ trong hệ thống
          </div>
        </div>
      </div>

      {/* 2. THANH TÌM KIẾM BÚT LÔNG & BỘ LỌC BỘ THẺ */}
      <div
        style={{
          background: '#FAF7F0',
          padding: '1.25rem 1.5rem',
          borderRadius: '16px',
          border: '1.2px solid #E6DDCF',
          boxShadow: '0 4px 14px rgba(18, 36, 56, 0.04)',
          marginBottom: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {/* Input Tìm kiếm */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Tìm kiếm từ vựng, chữ Kanji, cách đọc Furigana hoặc nghĩa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.8rem 1.15rem',
              background: '#FFFFFF',
              border: '1.2px solid #E6DDCF',
              borderRadius: '10px',
              color: '#122438',
              fontSize: '0.95rem',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
              transition: 'border-color 0.2s',
            }}
          />
        </div>

        {/* Nút lọc thẻ thanh lịch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.84rem', color: '#786A5E', fontWeight: 600, marginRight: '0.25rem', fontFamily: 'var(--font-maru)' }}>
            Chủ đề:
          </span>
          <button
            onClick={() => setSelectedDeck('all')}
            style={{
              padding: '0.4rem 0.95rem',
              borderRadius: '8px',
              border: '1.2px solid',
              borderColor: selectedDeck === 'all' ? '#1E4B75' : '#E6DDCF',
              background: selectedDeck === 'all' ? '#1E4B75' : '#FFFFFF',
              color: selectedDeck === 'all' ? '#FFFFFF' : '#122438',
              fontWeight: selectedDeck === 'all' ? 700 : 500,
              fontSize: '0.84rem',
              fontFamily: 'var(--font-maru)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Tất cả ({cardsList.length})
          </button>

          {decksList.map((d) => {
            const count = cardsList.filter((c) => c.deckId === d.id).length;
            const isSelected = selectedDeck === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDeck(d.id)}
                style={{
                  padding: '0.4rem 0.95rem',
                  borderRadius: '8px',
                  border: '1.2px solid',
                  borderColor: isSelected ? '#1E4B75' : '#E6DDCF',
                  background: isSelected ? '#1E4B75' : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : '#122438',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.84rem',
                  fontFamily: 'var(--font-maru)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {d.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* BANNER HÀNH ĐỘNG NHANH KHI ĐANG LỌC BỘ THẺ */}
      {selectedDeck !== 'all' && (
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: '#FAF7F0',
            border: '1.5px solid #C89B58',
            borderRadius: '14px',
            padding: '1.15rem 1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 14px rgba(18, 36, 56, 0.04)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <JapaneseArtBackdrop
            src="/assets/art/ryusui-indigo-stream.jpg"
            alt="Dòng sông Ryusui chàm"
            opacity={0.14}
            blendMode="multiply"
            objectPosition="right center"
          />

          <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: selectedDeck.includes('kanji') ? '#C83824' : selectedDeck.includes('n5') ? '#2A6B3D' : '#1E4B75',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                fontFamily: 'var(--font-mincho)',
                fontWeight: 800,
              }}
            >
              {selectedDeck.includes('kanji') ? '漢' : selectedDeck.includes('n5') ? 'N5' : '語'}
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.1rem', color: '#122438', fontWeight: 700, margin: 0 }}>
                Đang xem: {decksList.find((d) => d.id === selectedDeck)?.name || 'Bộ thẻ'}
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#786A5E', margin: '0.2rem 0 0' }}>
                Bao gồm <strong>{filteredCards.length}</strong> thẻ sẵn sàng cho phiên ôn tập Karuta
              </p>
            </div>
          </div>

          <Link
            href={`/review?deck=${selectedDeck}`}
            className="btn-torii"
            style={{
              position: 'relative',
              zIndex: 2,
              padding: '0.65rem 1.35rem',
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 4px 12px rgba(200, 56, 36, 0.3)',
            }}
          >
            <ToriiIcon size={16} color="#FFFFFF" />
            Ôn tập bộ này ngay →
          </Link>
        </div>
      )}

      {/* 3. BẢNG MỤC LỤC THẺ BÀI KARUTA CÓ HOA VĂN WASHI ANH ĐÀO */}
      <div
        style={{
          position: 'relative',
          background: '#FAF7F0',
          borderRadius: '16px',
          border: '1.2px solid #E6DDCF',
          boxShadow: '0 8px 24px rgba(18, 36, 56, 0.05)',
          overflow: 'hidden',
        }}
      >
        <JapaneseArtBackdrop
          src="/assets/art/gold-sakura-washi.jpg"
          alt="Hoa anh đào mạ kim trên giấy Washi"
          opacity={0.09}
          blendMode="multiply"
          objectPosition="top right"
        />

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', position: 'relative', zIndex: 1 }}>
          <thead>
            <tr
              style={{
                background: '#F0EBE0',
                borderBottom: '1.5px solid #E2D7C5',
                color: '#122438',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-maru)',
                fontWeight: 700,
              }}
            >
              <th style={{ padding: '1rem 1.25rem' }}>Chữ Hán &amp; Hiragana mặt trước</th>
              <th style={{ padding: '1rem 1.25rem' }}>Cách đọc &amp; Cao độ</th>
              <th style={{ padding: '1rem 1.25rem' }}>Ý nghĩa tiếng Việt</th>
              <th style={{ padding: '1rem 1.25rem' }}>Trạng thái FSRS</th>
              <th style={{ padding: '1rem 1.25rem' }}>Phân loại</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#786A5E' }}>
                  Đang tải dữ liệu thư viện thẻ học...
                </td>
              </tr>
            ) : filteredCards.length > 0 ? (
              filteredCards.map((card, idx) => {
                const isKanji = card.type === 'Kanji' || card.deck.includes('Hán Tự');

                return (
                  <tr
                    key={card.id}
                    style={{
                      borderBottom: '1px solid #ECE4D6',
                      background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.7)' : 'rgba(250, 247, 240, 0.7)',
                      transition: 'background 0.2s',
                    }}
                  >
                    {/* Mặt trước Kanji & Hiragana nổi bật */}
                    <td style={{ padding: '1.15rem 1.25rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-mincho)',
                            fontSize: '1.65rem',
                            fontWeight: 700,
                            color: '#122438',
                          }}
                        >
                          {card.kanji}
                        </span>
                        {card.reading && card.reading !== card.kanji && (
                          <span
                            style={{
                              fontFamily: 'var(--font-maru)',
                              fontSize: '0.88rem',
                              color: '#B87B28',
                              fontWeight: 700,
                            }}
                          >
                            {card.reading}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Furigana & Cao độ */}
                    <td style={{ padding: '1.15rem 1.25rem' }}>
                      <div style={{ fontFamily: 'var(--font-maru)', fontSize: '1rem', color: '#1E4B75', fontWeight: 600 }}>
                        {card.reading}
                      </div>
                      {card.pitch && (
                        <span style={{ fontSize: '0.74rem', color: '#786A5E' }}>
                          Cao độ: {card.pitch}
                        </span>
                      )}
                    </td>

                    {/* Ý nghĩa */}
                    <td style={{ padding: '1.15rem 1.25rem', color: '#2B2B2B', fontSize: '0.92rem' }}>
                      {card.meaning}
                    </td>

                    {/* Trạng thái nhận thức FSRS */}
                    <td style={{ padding: '1.15rem 1.25rem' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.65rem',
                          background: card.state === 'Review' ? '#EBF5EE' : '#EDF4FA',
                          color: card.state === 'Review' ? '#3E734E' : '#234B73',
                          border: `1px solid ${card.state === 'Review' ? '#99C7A5' : '#A2C4E3'}`,
                          borderRadius: '6px',
                          fontSize: '0.76rem',
                          fontFamily: 'var(--font-maru)',
                          fontWeight: 700,
                        }}
                      >
                        {card.state === 'Review' ? 'Đã củng cố' : 'Mới tiếp nhận'}
                      </span>
                    </td>

                    {/* Con dấu loại thẻ */}
                    <td style={{ padding: '1.15rem 1.25rem' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '26px',
                          height: '26px',
                          border: `1.2px solid ${isKanji ? '#C83824' : '#1E4B75'}`,
                          borderRadius: '4px',
                          color: isKanji ? '#C83824' : '#1E4B75',
                          fontFamily: 'var(--font-mincho)',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          background: '#FFFFFF',
                        }}
                      >
                        {isKanji ? '漢' : '語'}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#786A5E' }}>
                  <SensuFanIcon size={32} color="#C89B58" />
                  <p style={{ marginTop: '0.75rem', fontSize: '0.95rem', fontFamily: 'var(--font-mincho)' }}>
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
