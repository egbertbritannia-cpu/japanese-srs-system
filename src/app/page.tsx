'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ToriiIcon, SakuraIcon, SensuFanIcon } from '@/components/japanese/Icons';
import { DarumaMascot } from '@/components/japanese/DarumaMascot';
import { JapaneseArtBackdrop } from '@/components/art/JapaneseArtBackdrop';
import { DeckSummaryDTO } from '@/core/cards/deck.types';

/**
 * Dashboard (Honmaru - 本丸): Tổng quan tiến độ học tập, FSRS stats & Danh mục Bộ thẻ (Kifuda)
 */
export default function DashboardPage() {
  const [deckSummaries, setDeckSummaries] = useState<DeckSummaryDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDeckData() {
      try {
        setLoading(true);
        const res = await fetch('/api/cards');
        const json = await res.json();
        if (json.success && json.deckSummaries) {
          setDeckSummaries(json.deckSummaries);
        } else if (json.decks) {
          // Fallback nếu chưa có deckSummaries
          setDeckSummaries(
            json.decks.map((d: any) => ({
              id: d.id,
              name: d.name,
              description: d.description || '',
              totalCards: 0,
              dueCards: 0,
              newCards: 0,
              learnedCards: 0,
            }))
          );
        }
      } catch (err) {
        console.error('Lỗi khi nạp dữ liệu bộ thẻ:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDeckData();
  }, []);

  // Tổng hợp thống kê từ toàn bộ các bộ thẻ
  const totalDue = deckSummaries.reduce((sum, d) => sum + d.dueCards, 0);
  const totalNew = deckSummaries.reduce((sum, d) => sum + d.newCards, 0);
  const totalCardsCount = deckSummaries.reduce((sum, d) => sum + d.totalCards, 0);

  const stats = {
    dueToday: totalDue > 0 ? totalDue : 0,
    newCards: totalNew > 0 ? totalNew : 0,
    retentionRate: '90%',
    completedToday: 8,
  };

  const totalTodayGoal = stats.dueToday + stats.completedToday;
  const progressPercent =
    totalTodayGoal > 0 ? Math.min(100, Math.round((stats.completedToday / totalTodayGoal) * 100)) : 100;

  return (
    <main style={{ maxWidth: '1050px', margin: '2rem auto', padding: '0 1.5rem 3rem' }}>
      {/* 1. HERO BANNER: WA-MODERN POSTER SHOWCASE (PHONG CÁCH ÁP PHÍCH ĐỒ HỌA NHẬT BẢN) */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1A3025 0%, #2D4A3E 60%, #1F2421 100%)',
          borderRadius: '20px',
          padding: '2.5rem 2.25rem',
          color: '#FFFFFF',
          marginBottom: '1.25rem',
          boxShadow: 'var(--shadow-karuta)',
          position: 'relative',
          overflow: 'hidden',
          border: '2px solid rgba(212, 175, 55, 0.4)',
        }}
      >
        {/* Lớp hoa văn Seigaiha mờ phía sau */}
        <div
          className="wagara-seigaiha-matcha"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.18,
            mixBlendMode: 'overlay',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.25rem',
            alignItems: 'center',
          }}
        >
          {/* CỘT TRÁI: TYPOGRAPHY ĐỒ HỌA TRỤC KÉP */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                className="hinomaru-disc"
                style={{ width: '38px', height: '38px', fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-mincho)' }}
              >
                極
              </div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.3rem 0.85rem',
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-maru)',
                  fontWeight: 600,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FAF8F5',
                }}
              >
                <SakuraIcon size={16} color="#FFB7C5" />
                記憶道 · HỆ THỐNG GHI NHỚ LẶP LẠI NGẮT QUÃNG
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-mincho)',
                fontSize: '2.6rem',
                fontWeight: 800,
                lineHeight: 1.18,
                marginBottom: '0.85rem',
                letterSpacing: '-0.01em',
                textShadow: '0 3px 6px rgba(0, 0, 0, 0.35)',
              }}
            >
              日本語 SRS システム
              <span style={{ display: 'block', fontSize: '1.45rem', fontWeight: 600, color: '#F59E0B', marginTop: '0.2rem' }}>
                Học sâu Nhớ lâu cùng FSRS
              </span>
            </h1>

            <p
              style={{
                fontSize: '1rem',
                lineHeight: 1.65,
                color: 'rgba(250, 248, 245, 0.92)',
                fontFamily: 'var(--font-maru)',
                fontWeight: 400,
                marginBottom: '1.75rem',
              }}
            >
              Thuật toán tối ưu nhận thức FSRS kết hợp nguyên tắc Thông tin tối thiểu và nét vẽ nghệ thuật mộc bản Ukiyo-e truyền thống Nhật Bản.
            </p>

            {/* Cụm nút hành động đồ họa Nhật */}
            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
              <Link
                href="/review?deck=all"
                className="btn-torii"
                style={{
                  padding: '0.95rem 1.8rem',
                  fontSize: '1.05rem',
                  boxShadow: '0 6px 20px rgba(217, 56, 30, 0.45)',
                }}
              >
                <ToriiIcon size={20} color="#FFFFFF" />
                Bắt đầu Khảo hạch (Ôn tập ngay)
              </Link>
              <Link
                href="/cards"
                className="btn-washi"
                style={{
                  padding: '0.95rem 1.5rem',
                  fontSize: '1rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                }}
              >
                <SensuFanIcon size={18} color="#F59E0B" />
                Khám phá Thư viện
              </Link>
            </div>
          </div>

          {/* CỘT PHẢI: KHUNG TRANH MỘC BẢN TRIỂN LÃM VỚI TƯ LIỆU NGHỆ THUẬT THỰC TẾ */}
          <div
            className="art-card-frame"
            style={{
              height: '240px',
              position: 'relative',
              borderRadius: '16px',
            }}
          >
            <Image
              src="/assets/art/japanese-cultural-panorama.jpg"
              alt="Toàn cảnh văn hóa Nhật Bản và Phú Sĩ"
              fill
              sizes="(max-width: 768px) 100vw, 450px"
              style={{ objectFit: 'cover', objectPosition: 'center 35%' }}
              priority
            />
            {/* Lớp viền vàng kim bảo tàng */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                border: '2px solid rgba(212, 175, 55, 0.6)',
                borderRadius: '14px',
                pointerEvents: 'none',
              }}
            />
            {/* Nhãn chú thích tranh theo chuẩn bảo tàng Edo */}
            <div
              style={{
                position: 'absolute',
                bottom: '0.75rem',
                left: '0.75rem',
                right: '0.75rem',
                background: 'rgba(31, 36, 33, 0.88)',
                backdropFilter: 'blur(8px)',
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid rgba(212, 175, 55, 0.3)',
              }}
            >
              <div>
                <span style={{ fontFamily: 'var(--font-mincho)', color: '#F59E0B', fontSize: '0.85rem', fontWeight: 700 }}>
                  富嶽三十六景 · 浮世絵展覧
                </span>
                <p style={{ fontSize: '0.72rem', color: '#D1D5DB' }}>
                  Hokusai Cultural Heritage &amp; Wa-Aesthetics
                </p>
              </div>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  border: '1.5px solid #EF4444',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#EF4444',
                  fontFamily: 'var(--font-mincho)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  background: 'rgba(239, 68, 68, 0.1)',
                }}
              >
                日学
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DẢI PHÂN CÁCH SÓNG VÀNG KIN-NAMI MẠ KIM (TỈ LỆ 4:1) CÙNG DANH NGÔN */}
      <div
        style={{
          height: '46px',
          margin: '-0.5rem 0 2.25rem',
          borderRadius: '999px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: 'var(--shadow-washi-sm)',
          border: '1.5px solid rgba(217, 119, 6, 0.35)',
        }}
      >
        <Image
          src="/assets/art/golden-waves-kin-nami.jpg"
          alt="Dải sóng vàng Kin-nami"
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', opacity: 0.92 }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.25)',
          }}
        >
          <span
            style={{
              padding: '0.2rem 1.1rem',
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(6px)',
              borderRadius: '999px',
              fontFamily: 'var(--font-mincho)',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--sumi-ink)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(217, 119, 6, 0.3)',
            }}
          >
            「 継続は力なり 」 · Kiên trì là cội nguồn của sức mạnh
          </span>
        </div>
      </div>

      {/* 2. KHU VỰC TIẾN ĐỘ DARUMA (DARUMA GOAL MILESTONE TRACKER) */}
      <section
        style={{
          background: 'var(--washi-surface)',
          border: '1px solid var(--washi-border)',
          borderRadius: '16px',
          padding: '1.75rem 2rem',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-washi-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
        }}
      >
        <DarumaMascot progressPercentage={progressPercent} size={76} />

        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.25rem', color: 'var(--sumi-ink)', fontWeight: 700 }}>
                Quyết tâm hôm nay (本日の目標)
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--sumi-faded)' }}>
                Đã hoàn thành <strong>{stats.completedToday}</strong> / {totalTodayGoal} thẻ ({progressPercent}%) · Tổng cộng <strong>{totalCardsCount}</strong> thẻ trong thư viện
              </p>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mincho)',
                fontWeight: 800,
                fontSize: '1.35rem',
                color: progressPercent >= 100 ? '#F59E0B' : 'var(--matcha-deep)',
              }}
            >
              {progressPercent}%
            </span>
          </div>

          {/* Thanh tiến độ họa tiết lông tên Yagasuri */}
          <div
            style={{
              height: '14px',
              background: '#F0ECE4',
              borderRadius: '999px',
              overflow: 'hidden',
              position: 'relative',
              border: '1px solid var(--washi-border)',
            }}
          >
            <div
              className="wagara-yagasuri"
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                backgroundColor: 'var(--matcha-primary)',
                borderRadius: '999px',
                transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            />
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--sumi-faded)', marginTop: '0.4rem' }}>
            💡 <em>Khi đạt 50%, mắt trái búp bê Daruma sẽ mở; đạt 100%, búp bê sẽ khai mở trọn vẹn cả hai mắt!</em>
          </p>
        </div>
      </section>

      {/* 3. KHU VỰC LỰA CHỌN BỘ THẺ HỌC TẬP (DECK SELECTION KIFUDA BENTO GRID) */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            <span
              style={{
                fontFamily: 'var(--font-mincho)',
                color: 'var(--torii-red)',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.05em',
              }}
            >
              短冊・木札目録 · CHỌN BỘ THẺ HỌC TẬP
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-mincho)',
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--sumi-ink)',
                marginTop: '0.2rem',
              }}
            >
              Ôn tập theo chuyên đề hoặc tổng hợp
            </h2>
          </div>

          <Link
            href="/review?deck=all"
            className="btn-washi"
            style={{
              padding: '0.6rem 1.2rem',
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            🎲 Học ngẫu nhiên toàn bộ ({totalCardsCount} thẻ)
          </Link>
        </div>

        {/* Grid các bộ thẻ Kifuda */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {loading ? (
            <>
              {/* Skeleton 1 */}
              <div
                className="card-karuta"
                style={{
                  padding: '1.75rem',
                  minHeight: '210px',
                  background: 'var(--washi-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--sumi-faded)',
                  fontFamily: 'var(--font-maru)',
                }}
              >
                Đang nạp dữ liệu bộ thẻ Hán Tự...
              </div>
              {/* Skeleton 2 */}
              <div
                className="card-karuta"
                style={{
                  padding: '1.75rem',
                  minHeight: '210px',
                  background: 'var(--washi-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--sumi-faded)',
                  fontFamily: 'var(--font-maru)',
                }}
              >
                Đang nạp dữ liệu bộ thẻ Từ Vựng...
              </div>
            </>
          ) : (
            deckSummaries.map((deck) => {
              const isKanji = deck.id.includes('kanji') || deck.name.includes('Hán Tự');
              const themeColor = isKanji ? 'var(--torii-red)' : 'var(--matcha-deep)';
              const subtleBg = isKanji ? 'var(--torii-subtle)' : 'var(--matcha-subtle)';
              const inkanChar = isKanji ? '漢' : '語';
              const artCover = isKanji
                ? '/assets/art/hokusai-cranes-fuji.jpg'
                : '/assets/art/koi-peony-yuzen.jpg';
              const artCaption = isKanji
                ? '富嶽三十六景 · 相州梅沢庄 (Hokusai)'
                : '友禅染 · 錦鯉と牡丹 (Yuzen Silk)';
              const ribbonText = isKanji ? '漢字特化' : '語彙特化';

              return (
                <div
                  key={deck.id}
                  className="card-kifuda"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    border: `2px solid ${isKanji ? 'rgba(217, 56, 30, 0.3)' : 'rgba(112, 141, 62, 0.3)'}`,
                  }}
                >
                  {/* BÌA TRANH NGHỆ THUẬT MỘC BẢN VÀ YUZEN TRỰC QUAN */}
                  <div style={{ height: '140px', position: 'relative', overflow: 'hidden' }}>
                    <Image
                      src={artCover}
                      alt={artCaption}
                      fill
                      sizes="(max-width: 768px) 100vw, 360px"
                      style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
                    />
                    {/* Lớp gradient tối để nổi bật ribbon và nhãn */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, transparent 40%, rgba(0, 0, 0, 0.7) 100%)',
                      }}
                    />

                    {/* Ruy băng Tate-gaki góc trên bên trái */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '0.65rem',
                        left: '0.75rem',
                        background: isKanji ? '#D9381E' : '#708D3E',
                        color: '#FFFFFF',
                        padding: '0.35rem 0.3rem',
                        borderRadius: '4px',
                        writingMode: 'vertical-rl',
                        textOrientation: 'upright',
                        fontFamily: 'var(--font-mincho)',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        letterSpacing: '0.15em',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      {ribbonText}
                    </div>

                    {/* Con dấu son Inkan đóng nổi trên ảnh */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '0.65rem',
                        right: '0.75rem',
                        width: '36px',
                        height: '36px',
                        border: '2px solid #FFFFFF',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-mincho)',
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        background: isKanji ? 'rgba(217, 56, 30, 0.85)' : 'rgba(112, 141, 62, 0.85)',
                        backdropFilter: 'blur(4px)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.35)',
                        transform: 'rotate(-4deg)',
                      }}
                    >
                      {inkanChar}
                    </div>

                    {/* Chú thích tác phẩm dưới đáy ảnh */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '0.4rem',
                        left: '0.75rem',
                        right: '0.75rem',
                        fontSize: '0.72rem',
                        color: 'rgba(255, 255, 255, 0.95)',
                        fontFamily: 'var(--font-maru)',
                        fontWeight: 600,
                        textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
                      }}
                    >
                      {artCaption}
                    </div>
                  </div>

                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <h3
                        style={{
                          fontFamily: 'var(--font-mincho)',
                          fontSize: '1.3rem',
                          fontWeight: 800,
                          color: 'var(--sumi-ink)',
                          marginBottom: '0.4rem',
                        }}
                      >
                        {deck.name}
                      </h3>

                      <p
                        style={{
                          fontSize: '0.88rem',
                          color: 'var(--sumi-faded)',
                          lineHeight: 1.5,
                          marginBottom: '1.25rem',
                        }}
                      >
                        {deck.description || (isKanji ? '133 chữ Hán trọng tâm trình độ sơ cấp N5-N4' : 'Từ vựng thông dụng kèm câu ví dụ i+1 và phát âm chuẩn Tokyo')}
                      </p>
                    </div>

                    <div>
                      {/* Pills đếm số lượng thẻ */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          flexWrap: 'wrap',
                          marginBottom: '1.25rem',
                          fontSize: '0.8rem',
                          fontFamily: 'var(--font-maru)',
                          fontWeight: 600,
                        }}
                      >
                        <span
                          style={{
                            padding: '0.25rem 0.65rem',
                            borderRadius: '6px',
                            background: 'rgba(217, 56, 30, 0.1)',
                            color: 'var(--torii-red)',
                            border: '1px solid rgba(217, 56, 30, 0.2)',
                          }}
                        >
                          🔴 Cần ôn: <strong>{deck.dueCards}</strong>
                        </span>
                        <span
                          style={{
                            padding: '0.25rem 0.65rem',
                            borderRadius: '6px',
                            background: 'rgba(136, 167, 82, 0.15)',
                            color: 'var(--matcha-deep)',
                            border: '1px solid rgba(136, 167, 82, 0.3)',
                          }}
                        >
                          🟢 Mới: <strong>{deck.newCards}</strong>
                        </span>
                        <span
                          style={{
                            padding: '0.25rem 0.65rem',
                            borderRadius: '6px',
                            background: '#F1EDE6',
                            color: 'var(--sumi-charcoal)',
                            border: '1px solid var(--washi-border)',
                          }}
                        >
                          ⚪ Tổng: <strong>{deck.totalCards}</strong>
                        </span>
                      </div>

                      {/* Nút vào học trực tiếp bộ này */}
                      <Link
                        href={`/review?deck=${deck.id}`}
                        className={isKanji ? 'btn-torii' : 'btn-matcha'}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          padding: '0.85rem 1rem',
                          fontSize: '0.95rem',
                          borderRadius: '10px',
                          textDecoration: 'none',
                        }}
                      >
                        <ToriiIcon size={16} color="#FFFFFF" />
                        Ôn tập bộ này ({deck.dueCards > 0 ? `${deck.dueCards} thẻ` : 'Củng cố'})
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* 4. BENTO GRID: 3 THẺ ĐIỀU ƯỚC EMA (絵馬 STAT CARDS) */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* CARD 1: DUE TODAY (THẺ CẦN ÔN) */}
        <div
          className="card-karuta"
          style={{
            padding: '1.75rem',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF9F9 100%)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.2rem 0.6rem',
                  background: 'var(--torii-subtle)',
                  color: 'var(--torii-red)',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-maru)',
                  marginBottom: '0.5rem',
                }}
              >
                復習 · CẦN ÔN TẬP
              </span>
              <h3 style={{ color: 'var(--sumi-charcoal)', fontSize: '0.95rem', fontWeight: 600 }}>
                Thẻ đến hạn hôm nay
              </h3>
            </div>
            <div className="inkan-stamp-badge" title="Đã đồng bộ FSRS">
              期
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-mincho)', fontSize: '3rem', fontWeight: 800, color: 'var(--torii-red)', lineHeight: 1 }}>
            {stats.dueToday}
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--sumi-faded)', marginTop: '0.5rem' }}>
            Khoảng cách ngắt quãng tối ưu theo FSRS
          </p>
        </div>

        {/* CARD 2: NEW CARDS (THẺ MỚI) */}
        <div
          className="card-karuta"
          style={{
            padding: '1.75rem',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAF2 100%)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.2rem 0.6rem',
                  background: 'var(--matcha-subtle)',
                  color: 'var(--matcha-deep)',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-maru)',
                  marginBottom: '0.5rem',
                }}
              >
                新規 · TỪ VỰNG MỚI
              </span>
              <h3 style={{ color: 'var(--sumi-charcoal)', fontSize: '0.95rem', fontWeight: 600 }}>
                Thẻ mới sẵn sàng nạp
              </h3>
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                background: 'var(--matcha-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--matcha-deep)',
                fontFamily: 'var(--font-mincho)',
                fontWeight: 700,
              }}
            >
              新
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-mincho)', fontSize: '3rem', fontWeight: 800, color: 'var(--matcha-deep)', lineHeight: 1 }}>
            {stats.newCards}
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--sumi-faded)', marginTop: '0.5rem' }}>
            Áp dụng nguyên tắc câu đục lỗ i + 1
          </p>
        </div>

        {/* CARD 3: RETENTION RATE (TỈ LỆ GHI NHỚ) */}
        <div
          className="card-karuta"
          style={{
            padding: '1.75rem',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFDF5 100%)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.2rem 0.6rem',
                  background: 'var(--yamabuki-light)',
                  color: 'var(--yamabuki-amber)',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-maru)',
                  marginBottom: '0.5rem',
                }}
              >
                定着率 · TRÍ NHỚ BỀN VỮNG
              </span>
              <h3 style={{ color: 'var(--sumi-charcoal)', fontSize: '0.95rem', fontWeight: 600 }}>
                Tỉ lệ ghi nhớ mục tiêu
              </h3>
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                background: 'var(--yamabuki-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--yamabuki-amber)',
                fontFamily: 'var(--font-mincho)',
                fontWeight: 700,
              }}
            >
              極
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-mincho)', fontSize: '3rem', fontWeight: 800, color: '#D97706', lineHeight: 1 }}>
            {stats.retentionRate}
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--sumi-faded)', marginTop: '0.5rem' }}>
            Mức ghi nhớ tối ưu theo FSRS (R = 0.90)
          </p>
        </div>
      </section>

      {/* 5. HỘP THÀNH NGỮ KOTOWAZA (CUỘN THƯ PHÁP MAKIMONO) & NÚT ĐIỀU HƯỚNG */}
      <section
        className="makimono-scroll"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          padding: '1.85rem 2.25rem',
          borderRadius: '14px',
          boxShadow: 'var(--shadow-washi-md)',
          borderLeft: '4px solid #78350F',
          borderRight: '4px solid #78350F',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', maxWidth: '580px' }}>
          <div
            className="hinomaru-disc"
            style={{ width: '48px', height: '48px', flexShrink: 0 }}
          >
            <SensuFanIcon size={24} color="#FFFFFF" />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-maru)', color: '#78350F', fontWeight: 700, letterSpacing: '0.08em' }}>
              每日諺 · NGẠN NGỮ HỌC TẬP MỖI NGÀY
            </span>
            <h4 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.35rem', color: 'var(--sumi-ink)', fontWeight: 800, marginTop: '0.2rem' }}>
              「 塵も積もれば山となる 」
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--sumi-charcoal)', marginTop: '0.25rem' }}>
              <em>(Bụi tích tụ sẽ hóa thành núi cao · Học tập mỗi ngày tích lũy tri thức vô tận)</em>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
          <Link href="/cards/new" className="btn-matcha" style={{ boxShadow: '0 4px 14px rgba(112, 141, 62, 0.3)' }}>
            ✨ Nhờ AI soạn thẻ mới
          </Link>
          <Link href="/cards" className="btn-washi">
            📚 Quản lý thư viện thẻ
          </Link>
        </div>
      </section>
    </main>
  );
}
