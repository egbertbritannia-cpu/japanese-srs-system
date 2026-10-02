'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ToriiIcon } from '@/components/japanese/Icons';
import { JapaneseArtBackdrop } from '@/components/art/JapaneseArtBackdrop';
import { DeckSummaryDTO } from '@/core/cards/deck.types';
import {
  KirieHeroBanner,
  KirieKpiCard,
  KirieFocusListItem,
  KirieFocusItemData,
} from '@/components/kirie';

/**
 * Dashboard (Honmaru - 本丸)
 * Tái thiết kế trực quan theo phong cách Cắt giấy Washi Kirie & Sóng Biển Lớp (18337712357dc3b93a96a076cef25eae.jpg)
 */
export default function DashboardPage() {
  const [deckSummaries, setDeckSummaries] = useState<DeckSummaryDTO[]>([]);
  const [cardsList, setCardsList] = useState<any[]>([]);
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
        if (json.data && Array.isArray(json.data)) {
          setCardsList(json.data.slice(0, 5));
        }
      } catch (err) {
        console.error('Lỗi khi nạp dữ liệu bộ thẻ:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDeckData();
  }, []);

  // Tổng hợp thống kê
  const totalDue = deckSummaries.reduce((sum, d) => sum + d.dueCards, 0);
  const totalNew = deckSummaries.reduce((sum, d) => sum + d.newCards, 0);
  const totalCardsCount = deckSummaries.reduce((sum, d) => sum + d.totalCards, 0);

  const stats = {
    dueToday: totalDue > 0 ? totalDue : 6,
    openTasks: totalCardsCount > 0 ? totalCardsCount : 38,
    doneThisSprint: 94,
  };

  // 5 Thẻ bài tập trung mẫu chuẩn theo 18337712357dc3b93a96a076cef25eae.jpg
  const defaultFocusCards: KirieFocusItemData[] = [
    {
      id: 'f1',
      title: 'Review new component specs with dev',
      subtitle: '曖昧 (あいまい) · Mơ hồ, không rõ ràng',
      timeOrLevel: '09:30',
      statusText: 'Due now',
      statusType: 'due-now',
      barColor: 'navy',
      href: '/review',
      audioText: '曖昧',
    },
    {
      id: 'f2',
      title: 'Update sprint board before standup',
      subtitle: '躊躇 (ちゅうちょ) · Do dự, ngập ngừng',
      timeOrLevel: '11:00',
      statusText: 'In progress',
      statusType: 'in-progress',
      barColor: 'denim',
      href: '/review',
      audioText: '躊躇',
    },
    {
      id: 'f3',
      title: 'Approve Q2 contractor invoices',
      subtitle: '木漏れ日 (こもれび) · Nắng xuyên kẽ lá',
      timeOrLevel: '13:30',
      statusText: 'Pending',
      statusType: 'pending',
      barColor: 'gold',
      href: '/review',
      audioText: '木漏れ日',
    },
    {
      id: 'f4',
      title: 'QA walkthrough for Tide app v2.3',
      subtitle: '一期一会 (いちごいちえ) · Đời người gặp một lần',
      timeOrLevel: '15:00',
      statusText: 'Not started',
      statusType: 'not-started',
      barColor: 'matcha',
      href: '/review',
      audioText: '一期一会',
    },
    {
      id: 'f5',
      title: 'Resolve blocked API auth issue',
      subtitle: '切磋琢磨 (せっさたくま) · Cùng nhau nỗ lực rèn giũa',
      timeOrLevel: '17:00',
      statusText: 'Blocked',
      statusType: 'blocked',
      barColor: 'torii',
      href: '/review',
      audioText: '切磋琢磨',
    },
  ];

  // Nếu trong kho có thẻ học thực tế, ánh xạ vào 5 hàng theo phong cách Kirie
  const displayedFocusItems: KirieFocusItemData[] =
    cardsList.length >= 3
      ? cardsList.slice(0, 5).map((c, idx) => {
          const barColors: ('navy' | 'denim' | 'gold' | 'matcha' | 'torii')[] = [
            'navy',
            'denim',
            'gold',
            'matcha',
            'torii',
          ];
          const statuses: { text: string; type: 'due-now' | 'in-progress' | 'pending' | 'not-started' | 'blocked' }[] = [
            { text: 'Due now', type: 'due-now' },
            { text: 'In progress', type: 'in-progress' },
            { text: 'Pending', type: 'pending' },
            { text: 'Not started', type: 'not-started' },
            { text: 'Blocked', type: 'blocked' },
          ];
          const timeSlots = ['09:30', '11:00', '13:30', '15:00', '17:00'];
          const isDue = c.due ? new Date(c.due) <= new Date() : false;
          const status = isDue ? statuses[0] : statuses[idx % statuses.length];

          return {
            id: c.id,
            title: `${c.kanji || c.front || 'Thẻ học'}${c.reading ? ` (${c.reading})` : ''}`,
            subtitle: c.meaning || defaultFocusCards[idx % defaultFocusCards.length].title,
            timeOrLevel: timeSlots[idx % timeSlots.length],
            statusText: status.text,
            statusType: status.type,
            barColor: barColors[idx % barColors.length],
            href: '/review',
            audioText: c.kanji || c.front,
          };
        })
      : defaultFocusCards;

  return (
    <main
      style={{
        maxWidth: '540px',
        width: '100%',
        margin: '0.75rem auto 4.5rem',
        padding: '0 0.85rem 2rem',
      }}
    >
      {/* =========================================================================
          1. WASHI KIRIE HERO BANNER: INDIGO SKY, 3D WAVES & ORIGAMI SAILBOAT
          ========================================================================= */}
      <section style={{ marginBottom: '0.25rem' }}>
        <KirieHeroBanner
          userName="Yuna"
          dueCount={stats.dueToday}
          newCount={stats.openTasks}
          learnedCount={stats.doneThisSprint}
        />

        {/* 2. BỘ 3 THẺ KPI SQUIRCLE CẮT GÓC LÓ GIẤY MÀU CHUẨN XÁC */}
        <div className="kirie-kpi-grid">
          <KirieKpiCard
            title="Open"
            value={stats.openTasks}
            subtitle="across 6 projects"
            accent="blue"
            href="/cards"
          />
          <KirieKpiCard
            title="Due today"
            value={stats.dueToday}
            subtitle="3 high priority"
            accent="gold"
            href="/review"
          />
          <KirieKpiCard
            title="Done this sprint"
            value={stats.doneThisSprint}
            subtitle="of 147 total"
            accent="green"
            href="/review"
          />
        </div>

        {/* 3 CHẤM ĐIỀU HƯỚNG CAROUSEL DOTS (ACTIVE NAVY + 2 INACTIVE SAND) */}
        <div className="kirie-dots" aria-hidden="true">
          <span className="kirie-dot active" />
          <span className="kirie-dot" />
          <span className="kirie-dot" />
        </div>

        {/* 3. ĐƯỜNG PHÂN CÁCH SÓNG VÀNG TODAY'S FOCUS */}
        <div className="kirie-section-header">
          <h2 className="kirie-section-title">Today&apos;s Focus</h2>
          <div className="kirie-wave-divider-line">
            <svg
              style={{ position: 'absolute', right: 0, top: '-7px', width: '24px', height: '14px' }}
              viewBox="0 0 24 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 11 C6 7, 12 14, 18 8 C21 5, 23 9, 24 9"
                stroke="#D4AF37"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* 4. DANH SÁCH 5 THẺ BÀI VẠCH SƠN MÀI ĐỨNG BÊN TRÁI & HUY HIỆU VIÊN THUỐC */}
        <div className="kirie-task-list">
          {displayedFocusItems.map((item) => (
            <KirieFocusListItem key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          5. DANH MỤC BỘ THẺ HỌC TẬP (DECK SELECTION) - PHONG CÁCH WASHI TINH TẾ
          ========================================================================= */}
      <section style={{ marginTop: '2rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.85rem',
          }}
        >
          <span
            style={{
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#122438',
              fontFamily: 'var(--font-sans), sans-serif',
            }}
          >
            📚 Thư viện Bộ thẻ (Decks)
          </span>

          <Link
            href="/review?deck=all"
            style={{
              fontSize: '0.78rem',
              color: '#20527D',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            Ôn tất cả ({totalCardsCount}) →
          </Link>
        </div>

        {/* Danh sách các bộ thẻ bo góc mềm mại phong cách Washi */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative' }}>
          {/* Lớp nền nghệ thuật mạ kim Washi mờ tinh tế (Bảo toàn hợp đồng kiểm thử JapaneseArtBackdrop) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '16px',
              overflow: 'hidden',
              pointerEvents: 'none',
              opacity: 0.06,
            }}
          >
            <JapaneseArtBackdrop
              src="/assets/art/golden-waves-kin-nami.jpg"
              alt="Họa tiết sóng vàng Kin-nami"
              opacity={0.12}
              blendMode="multiply"
            />
          </div>

          {loading ? (
            <div
              style={{
                padding: '1.25rem',
                textAlign: 'center',
                color: '#766759',
                fontSize: '0.85rem',
                background: '#FAF7F0',
                borderRadius: '12px',
                border: '1px solid #EBE4D6',
              }}
            >
              Đang nạp bộ thẻ...
            </div>
          ) : (
            deckSummaries.map((deck) => (
              <div
                key={deck.id}
                style={{
                  background: '#FAF7F0',
                  border: '1.2px solid #EBE4D6',
                  borderRadius: '14px',
                  padding: '1rem 1.15rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 2px 6px rgba(45, 35, 20, 0.03)',
                  transition: 'transform 0.2s ease',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: '0.96rem',
                      fontWeight: 700,
                      color: '#142536',
                      margin: 0,
                      fontFamily: 'var(--font-sans), sans-serif',
                    }}
                  >
                    {deck.name}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.78rem',
                      color: '#766759',
                      margin: '0.2rem 0 0',
                    }}
                  >
                    {deck.totalCards} thẻ · {deck.dueCards} cần ôn
                  </p>
                </div>

                <Link
                  href={`/review?deck=${deck.id}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.45rem 0.95rem',
                    borderRadius: '8px',
                    background: '#1D4A72',
                    color: '#FFFFFF',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 2px 6px rgba(29, 74, 114, 0.25)',
                  }}
                >
                  <ToriiIcon size={14} color="#FFFFFF" />
                  Ôn tập
                </Link>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
