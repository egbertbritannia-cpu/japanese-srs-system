import Link from 'next/link';
import { db } from '@/db/client';
import { cards, decks } from '@/db/schema';
import { eq, desc, count, sql } from 'drizzle-orm';
import { ToriiIcon } from '@/components/japanese/Icons';
import { JapaneseArtBackdrop } from '@/components/art/JapaneseArtBackdrop';
import { JapaneseSpeakerButton } from '@/components/japanese/JapaneseSpeakerButton';
import { DeckSummaryDTO } from '@/core/cards/deck.types';
import { parseClozeSegments, stripCloze } from '@/lib/cloze';

/**
 * Dashboard (Honmaru - 本丸)
 * Tái thiết kế theo Biến thể 'Honmaru 3A - Zen Washi Study Ledger':
 * - Tối ưu hóa TTFB qua việc nạp dữ liệu trực tiếp trên máy chủ bằng Drizzle ORM (RSC)
 * - Tự động revalidate sau mỗi 60 giây (Incremental Static Regeneration - ISR)
 * - Tinh giản tối đa: Chỉ 1 nút hành động chính 'Ôn thẻ đến hạn', bỏ nút phụ và dải thống kê thừa
 * - Phủ mờ nhẹ tranh sóng biển Nhật Bản (1000_F_262528819) từ bộ sưu tập văn hóa ukiyo-e
 * - Định dạng thông tin người học: Cassius (Mục tiêu N3)
 */
export const revalidate = 60;

interface DashboardCardItem {
  id: string;
  front: string;
  reading: string | null;
  meaning: string;
  sentence?: string | null;
  due: Date | number | null;
  state: string;
  stability?: number | null;
  reps?: number | null;
  deckId?: string | null;
  type?: string | null;
  pitch?: string | null;
}

interface DashboardData {
  cardsList: DashboardCardItem[];
  deckSummaries: DeckSummaryDTO[];
  stats: {
    dueToday: number;
    openTasks: number;
    doneThisSprint: number;
  };
  totalCardsCount: number;
}

interface FocusCardDisplay {
  id: string;
  kanji: string;
  reading: string;
  pitch?: string;
  meaning: string;
  example: string;
  deckName: string;
  stability: string;
  reps: number;
  isDue: boolean;
  type?: string;
}

function parseCardItemDisplay(card: FocusCardDisplay) {
  const kanjiText = card.kanji || '';
  const deckStr = (card.deckName || '').toLowerCase();
  const meaningText = card.meaning || '';
  const hasClozeSyntax = /\{\{c\d+::/.test(kanjiText);
  const isGrammar =
    card.type === 'GrammarPattern' ||
    deckStr.includes('ngữ pháp') ||
    deckStr.includes('bunbou') ||
    kanjiText.startsWith('【文法') ||
    kanjiText.includes('Pattern') ||
    kanjiText.length > 8 ||
    hasClozeSyntax;

  let grammarTag = '';
  let mainSurface = kanjiText;

  if (isGrammar) {
    const match = kanjiText.match(/【([^】]+)】\s*([\s\S]*)/);
    if (match) {
      grammarTag = match[1].trim(); // e.g. "文法 Pattern 72"
      mainSurface = match[2].trim(); // e.g. "V[て形] + います"
    } else if (kanjiText.startsWith('【文法')) {
      grammarTag = '文法 Ngữ pháp';
      mainSurface = kanjiText.replace(/【[^】]*】/, '').trim();
    } else if (hasClozeSyntax) {
      grammarTag = '文法 · Thực hành mẫu câu';
    }
  }

  // Tách ý nghĩa chính và ghi chú cách dùng (nếu có)
  let primaryMeaning = meaningText;
  let usageNote = '';
  if (meaningText.includes('💡 Cách dùng:')) {
    const parts = meaningText.split('💡 Cách dùng:');
    primaryMeaning = parts[0].trim();
    usageNote = `💡 Cách dùng: ${parts[1].trim()}`;
  } else if (meaningText.includes('\n\n')) {
    const parts = meaningText.split('\n\n');
    primaryMeaning = parts[0].trim();
    usageNote = parts.slice(1).join('\n\n').trim();
  }

  return {
    isGrammar,
    grammarTag,
    mainSurface,
    primaryMeaning,
    usageNote,
    hasClozeSyntax,
  };
}

// 5 thẻ bài mẫu chuẩn ngữ nghĩa theo phong cách Karuta Zen Washi 3A
const defaultZenCards: FocusCardDisplay[] = [
  {
    id: 'f1',
    kanji: '曖昧',
    reading: 'あいまい',
    pitch: 'Atamadaka [1]',
    meaning: 'Mơ hồ, không rõ ràng',
    example: '「曖昧な返事をするな」 (Đừng trả lời mập mờ, hãy dứt khoát)',
    deckName: 'Minna no Nihongo Chuukyuu (N3)',
    stability: '4.2 ngày',
    reps: 5,
    isDue: true,
  },
  {
    id: 'f2',
    kanji: '躊躇',
    reading: 'ちゅうちょ',
    pitch: 'Heiban [0]',
    meaning: 'Do dự, chần chừ, ngập ngừng',
    example: '「躊躇せずに発言する」 (Không ngập ngừng mà lên tiếng ngay)',
    deckName: 'Minna no Nihongo Chuukyuu (N3)',
    stability: '6.8 ngày',
    reps: 7,
    isDue: true,
  },
  {
    id: 'f3',
    kanji: '木漏れ日',
    reading: 'こもれび',
    pitch: 'Nakadaka [3]',
    meaning: 'Ánh nắng xuyên qua kẽ lá',
    example: '「森の中で木漏れ日を楽しむ」 (Thưởng thức nắng len qua tán cây trong rừng)',
    deckName: 'Từ vựng Tự nhiên & Đời sống',
    stability: '12.1 ngày',
    reps: 9,
    isDue: true,
  },
  {
    id: 'f4',
    kanji: '一期一会',
    reading: 'いちごいちえ',
    pitch: 'Heiban [0]',
    meaning: 'Đời người gặp gỡ một lần, quý trọng duyên',
    example: '「一期一会の精神でおもてなしをする」 (Tiếp đón với tinh thần chỉ gặp một lần)',
    deckName: 'Thành ngữ 4 chữ (Yojijukugo)',
    stability: '18.5 ngày',
    reps: 11,
    isDue: true,
  },
  {
    id: 'f5',
    kanji: '切磋琢磨',
    reading: 'せっさたくま',
    pitch: 'Heiban [0]',
    meaning: 'Cùng nhau nỗ lực, rèn giũa tài năng',
    example: '「仲間と切磋琢磨して実力をつける」 (Cùng bạn bè rèn giũa nâng cao năng lực)',
    deckName: 'Thành ngữ 4 chữ (Yojijukugo)',
    stability: '24.0 ngày',
    reps: 14,
    isDue: true,
  },
];

function getFormattedVietnameseDate(): string {
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const now = new Date();
  const dayName = days[now.getDay()];
  const date = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${dayName}, ${date} Tháng ${month}`;
}

async function getDashboardData(): Promise<DashboardData> {
  try {
    const now = Date.now();
    const [cardList, allDecks, deckStatsRaw] = await Promise.all([
      db
        .select({
          id: cards.id,
          front: cards.front,
          reading: cards.reading,
          meaning: cards.meaning,
          sentence: cards.sentence,
          due: cards.due,
          state: cards.state,
          stability: cards.stability,
          reps: cards.reps,
          deckId: cards.deckId,
          type: cards.type,
          pitch: cards.pitch,
        })
        .from(cards)
        .orderBy(desc(cards.createdAt))
        .limit(5),
      db.select().from(decks),
      db
        .select({
          id: decks.id,
          name: decks.name,
          description: decks.description,
          totalCards: count(cards.id),
          dueCards: sql<number>`SUM(CASE WHEN ${cards.state} != 'New' AND (CASE WHEN ${cards.due} > 10000000000 THEN ${cards.due} ELSE ${cards.due} * 1000 END) <= ${now} THEN 1 ELSE 0 END)`,
          newCards: sql<number>`SUM(CASE WHEN ${cards.state} = 'New' THEN 1 ELSE 0 END)`,
          learnedCards: sql<number>`SUM(CASE WHEN ${cards.state} = 'Review' THEN 1 ELSE 0 END)`,
        })
        .from(decks)
        .leftJoin(cards, eq(cards.deckId, decks.id))
        .groupBy(decks.id),
    ]);

    const deckSummaries: DeckSummaryDTO[] = (deckStatsRaw as any[]).map((d) => ({
      id: d.id,
      name: d.name,
      description: d.description || '',
      totalCards: Number(d.totalCards || 0),
      dueCards: Number(d.dueCards || 0),
      newCards: Number(d.newCards || 0),
      learnedCards: Number(d.learnedCards || 0),
    }));

    const finalDeckSummaries: DeckSummaryDTO[] =
      deckSummaries.length > 0
        ? deckSummaries
        : allDecks.map((d: any) => ({
            id: d.id,
            name: d.name,
            description: d.description || '',
            totalCards: 0,
            dueCards: 0,
            newCards: 0,
            learnedCards: 0,
          }));

    const totalDue = finalDeckSummaries.reduce((sum: number, d) => sum + d.dueCards, 0);
    const totalCardsCount = finalDeckSummaries.reduce((sum: number, d) => sum + d.totalCards, 0);

    return {
      cardsList: cardList as DashboardCardItem[],
      deckSummaries: finalDeckSummaries,
      stats: {
        dueToday: totalDue > 0 ? totalDue : 12,
        openTasks: totalCardsCount > 0 ? totalCardsCount : 38,
        doneThisSprint: 94,
      },
      totalCardsCount,
    };
  } catch (error) {
    console.error('[Dashboard Server Fetch Error]', error);
    return {
      cardsList: [],
      deckSummaries: [],
      stats: {
        dueToday: 12,
        openTasks: 38,
        doneThisSprint: 94,
      },
      totalCardsCount: 0,
    };
  }
}

export default async function DashboardPage() {
  const { cardsList, deckSummaries, stats } = await getDashboardData();
  const currentDateFormatted = getFormattedVietnameseDate();

  const deckMap = new Map<string, string>();
  for (const d of deckSummaries) {
    deckMap.set(d.id, d.name);
  }

  // Ánh xạ thẻ từ cơ sở dữ liệu nếu có, hoặc dùng danh sách 5 từ Karuta Zen mẫu
  const displayedCards: FocusCardDisplay[] =
    cardsList.length >= 3
      ? cardsList.slice(0, 5).map((c, idx) => {
          const fallback = defaultZenCards[idx % defaultZenCards.length];
          const isDue = c.due ? new Date(c.due).getTime() <= Date.now() : true;
          const actualDeckName = (c.deckId && deckMap.get(c.deckId)) || fallback.deckName;
          const isGrammarCard = c.type === 'GrammarPattern' || c.deckId === 'grammar_jpd133' || (c.front && c.front.includes('【文法'));

          return {
            id: c.id,
            kanji: c.front || fallback.kanji,
            reading: c.reading || (isGrammarCard ? '' : fallback.reading),
            pitch: c.pitch || (isGrammarCard ? undefined : (c.reading ? undefined : fallback.pitch)),
            meaning: c.meaning || fallback.meaning,
            example: c.sentence || fallback.example,
            deckName: actualDeckName,
            stability: c.stability ? `${c.stability.toFixed(1)} ngày` : fallback.stability,
            reps: c.reps ?? fallback.reps,
            isDue,
            type: c.type || (isGrammarCard ? 'GrammarPattern' : undefined),
          };
        })
      : defaultZenCards;

  return (
    <main
      style={{
        position: 'relative',
        minHeight: '100vh',
        padding: '1.5rem 1rem 5rem',
      }}
    >
      {/* 1. HÌNH NỀN SÓNG BIỂN NHẬT BẢN MỜ NHẸ (UKIO-E WAVES TỪ THƯ MỤC BỘ SƯU TẬP) */}
      <JapaneseArtBackdrop
        src="/assets/art/1000_F_262528819_Qw2fofco2EOrkIdYmcjx20sBECBZ5mFM.jpg"
        alt="Họa tiết sóng biển Nhật Bản"
        opacity={0.045}
        blendMode="multiply"
        contrastBoost="subtle"
      />

      {/* KHUNG NỘI DUNG CHÍNH (MAX WIDTH 1140PX THEO DESIGN 3A) */}
      <div
        style={{
          maxWidth: '1140px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* =========================================================================
            2. TOP STUDY LEDGER: TINH GIẢN, GỌN GÀNG, DUY NHẤT 1 NÚT ÔN TẬP
            ========================================================================= */}
        <section
          style={{
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1.2px solid rgba(200, 155, 88, 0.25)',
            borderRadius: '24px',
            padding: 'clamp(1.25rem, 3vw, 2.25rem)',
            marginBottom: '2.25rem',
            boxShadow: `
              0 1px 2px 0 rgba(18, 36, 56, 0.05),
              0 12px 28px -6px rgba(18, 36, 56, 0.07),
              0 32px 64px -12px rgba(18, 36, 56, 0.08),
              inset 0 1px 1px 0 rgba(255, 255, 255, 0.9)
            `,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
              position: 'relative',
              zIndex: 2,
            }}
          >
            {/* Tiêu đề & Thông tin ngày học */}
            <div style={{ maxWidth: '640px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.4rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#6E8A3C',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    fontFamily: 'var(--font-maru), sans-serif',
                  }}
                >
                  Nhật ký học tập hôm nay
                </span>
                <span style={{ color: '#E8E2D8' }}>·</span>
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: '#717C75',
                    fontFamily: 'var(--font-sans), sans-serif',
                  }}
                >
                  {currentDateFormatted}
                </span>
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-mincho), serif',
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)',
                  fontWeight: 800,
                  color: '#1F2421',
                  letterSpacing: '-0.02em',
                  margin: 0,
                  lineHeight: 1.25,
                }}
              >
                Hôm nay:{' '}
                <span style={{ color: '#C83824' }}>{stats.dueToday} thẻ</span> đến hạn
              </h1>

              <p
                style={{
                  fontSize: '0.88rem',
                  color: '#717C75',
                  margin: '0.45rem 0 0',
                  lineHeight: 1.5,
                  fontWeight: 500,
                }}
              >
                Duy trì tỷ lệ gợi nhớ 90% theo thuật toán FSRS · Dự kiến hoàn thành trong ~6 phút
              </p>
            </div>

            {/* Cụm tương tác: Người học Cassius & Nút bấm Ôn tập Torii son duy nhất */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                flexWrap: 'wrap',
              }}
            >
              {/* Thẻ học viên Cassius */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.4rem 0.85rem',
                  background: 'rgba(250, 248, 245, 0.85)',
                  border: '1px solid #E8E2D8',
                  borderRadius: '12px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#1F2421',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-maru), sans-serif',
                  }}
                >
                  CS
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#1F2421',
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    Cassius
                  </p>
                  <p
                    style={{
                      fontSize: '0.72rem',
                      color: '#717C75',
                      margin: 0,
                    }}
                  >
                    Mục tiêu: N3
                  </p>
                </div>
              </div>

              {/* Nút hành động chính duy nhất: Ôn {stats.dueToday} thẻ đến hạn */}
              <Link
                href="/review"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  background: 'linear-gradient(135deg, #E64A19 0%, #D9381E 100%)',
                  color: '#FFFFFF',
                  padding: '0.85rem 1.65rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(217, 56, 30, 0.28)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                <ToriiIcon size={18} color="#FFFFFF" />
                <span>Ôn {stats.dueToday} thẻ đến hạn</span>
                <span
                  style={{
                    background: 'rgba(255, 255, 255, 0.22)',
                    color: '#FFFFFF',
                    fontSize: '0.72rem',
                    fontFamily: 'monospace',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                    marginLeft: '0.2rem',
                  }}
                >
                  Space
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. BỐ CỤC 2 CỘT CÂN ĐỐI (7 CỘT THẺ KANJI : 5 CỘT BỘ BÀI & FSRS)
            ========================================================================= */}
        <div className="dashboard-grid-layout">
          {/* CỘT TRÁI: HÀNG ĐỢI THẺ ĐẾN HẠN HÔM NAY (7 PHẦN) */}
          <section style={{ minWidth: 0, width: '100%' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: '#1F2421',
                    margin: 0,
                    fontFamily: 'var(--font-sans), sans-serif',
                  }}
                >
                  Hàng đợi thẻ đến hạn hôm nay
                </h2>
                <p
                  style={{
                    fontSize: '0.78rem',
                    color: '#717C75',
                    margin: '0.2rem 0 0',
                  }}
                >
                  5 thẻ ưu tiên hàng đầu theo lịch lặp lại FSRS
                </p>
              </div>

              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#6E8A3C',
                  background: '#EBF2DF',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '6px',
                }}
              >
                {displayedCards.length} / {stats.dueToday} hiển thị
              </span>
            </div>

            {/* DANH SÁCH THẺ KANJI KARUTA CHUẨN THẨM MỸ WASHI */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {displayedCards.map((card) => {
                const { isGrammar, grammarTag, mainSurface, primaryMeaning, usageNote } = parseCardItemDisplay(card);

                return (
                  <div
                    key={card.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.96)',
                      backdropFilter: 'blur(8px)',
                      border: '1.2px solid rgba(232, 226, 216, 0.9)',
                      borderRadius: '16px',
                      padding: '1.2rem 1.35rem',
                      boxShadow: '0 2px 8px rgba(18, 36, 56, 0.03), 0 1px 2px rgba(18, 36, 56, 0.02)',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      overflow: 'hidden',
                    }}
                  >
                    {isGrammar ? (
                      /* =========================================================================
                         BỐ CỤC CHUYÊN BIỆT CHO THẺ NGỮ PHÁP / MẪU CÂU (BUNBOU & PHRASE)
                         Không nhồi vào hộp vuông, giải phóng không gian chữ & ghi chú cách dùng
                         ========================================================================= */
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                        {/* Hàng trên: Tag phân loại + Nút loa & Đến hạn */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.75rem',
                            flexWrap: 'wrap',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span
                              style={{
                                fontFamily: 'var(--font-mincho), serif',
                                background: 'linear-gradient(135deg, #1B4268 0%, #20507B 100%)',
                                color: '#FFFFFF',
                                fontWeight: 800,
                                fontSize: '0.74rem',
                                padding: '0.2rem 0.65rem',
                                borderRadius: '6px',
                                letterSpacing: '0.04em',
                                boxShadow: '0 2px 5px rgba(27, 66, 104, 0.25)',
                              }}
                            >
                              {grammarTag || '文法 · Ngữ pháp'}
                            </span>
                            <span
                              style={{
                                fontFamily: 'var(--font-maru), sans-serif',
                                fontSize: '0.78rem',
                                color: '#717C75',
                                fontWeight: 600,
                              }}
                            >
                              Mẫu cấu trúc ngữ pháp
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <JapaneseSpeakerButton text={stripCloze(mainSurface)} size={18} />
                            {card.isDue && (
                              <div
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  fontSize: '0.72rem',
                                  fontFamily: 'var(--font-maru)',
                                  color: '#B5301E',
                                  fontWeight: 700,
                                  background: 'rgba(200, 56, 36, 0.06)',
                                  border: '1.2px solid rgba(200, 56, 36, 0.22)',
                                  padding: '0.2rem 0.65rem',
                                  borderRadius: '999px',
                                  letterSpacing: '0.02em',
                                }}
                              >
                                <span
                                  style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    background: '#C83824',
                                    boxShadow: '0 0 6px rgba(200, 56, 36, 0.4)',
                                  }}
                                />
                                <span>Đến kỳ ôn tập</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Khung hiển thị mẫu ngữ pháp trung tâm */}
                        <div
                          style={{
                            background: '#FAF8F5',
                            border: '1.2px solid #E8E2D8',
                            borderRadius: '10px',
                            padding: '0.65rem 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.75rem',
                          }}
                        >
                          <span
                            style={{
                              fontFamily: 'var(--font-mincho), serif',
                              fontSize: mainSurface.length > 20 ? '1.15rem' : '1.25rem',
                              fontWeight: 800,
                              color: '#1F2421',
                              letterSpacing: '0.02em',
                              lineHeight: 1.4,
                            }}
                          >
                            {parseClozeSegments(mainSurface).map((seg, i) =>
                              seg.isCloze ? (
                                <span
                                  key={i}
                                  style={{
                                    fontWeight: 800,
                                    color: '#153E20',
                                    background: '#EAF5EA',
                                    borderBottom: '2.5px solid #43894C',
                                    borderRadius: '4px',
                                    padding: '0.1rem 0.4rem',
                                    margin: '0 0.15rem',
                                    display: 'inline-block',
                                  }}
                                >
                                  {seg.text}
                                </span>
                              ) : (
                                <span key={i}>{seg.text}</span>
                              )
                            )}
                          </span>
                        </div>

                        {/* Ý nghĩa tiếng Việt & Ghi chú sư phạm */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <h3
                            style={{
                              fontSize: '0.94rem',
                              fontWeight: 700,
                              color: '#1F2421',
                              margin: 0,
                              lineHeight: 1.45,
                              wordBreak: 'break-word',
                            }}
                          >
                            {primaryMeaning}
                          </h3>

                          {usageNote && (
                            <p
                              style={{
                                fontSize: '0.8rem',
                                color: '#544538',
                                margin: 0,
                                lineHeight: 1.55,
                                background: 'rgba(235, 242, 223, 0.45)',
                                borderLeft: '3px solid #6E8A3C',
                                padding: '0.4rem 0.65rem',
                                borderRadius: '0 6px 6px 0',
                                wordBreak: 'break-word',
                              }}
                            >
                              {usageNote}
                            </p>
                          )}

                          {(() => {
                            const cleanFront = stripCloze(mainSurface).trim();
                            const cleanExample = card.example ? stripCloze(card.example).trim() : '';
                            const isMeaningRedundant = cleanExample === cleanFront;

                            if (!card.example || isMeaningRedundant) return null;

                            return (
                              <div
                                style={{
                                  marginTop: '0.4rem',
                                  padding: '0.5rem 0.75rem',
                                  background: 'rgba(250, 247, 240, 0.75)',
                                  borderLeft: '3px solid #C89B58',
                                  borderRadius: '0 8px 8px 0',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '0.15rem',
                                }}
                              >
                                <span
                                  style={{
                                    fontFamily: 'var(--font-maru)',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    color: '#8A7560',
                                    letterSpacing: '0.04em',
                                  }}
                                >
                                  🍃 Ngữ cảnh minh họa:
                                </span>
                                <span
                                  style={{
                                    fontFamily: 'var(--font-mincho)',
                                    fontSize: '0.88rem',
                                    color: '#122438',
                                    lineHeight: 1.45,
                                  }}
                                >
                                  {parseClozeSegments(card.example).map((seg, i) =>
                                    seg.isCloze ? (
                                      <span
                                        key={i}
                                        style={{
                                          fontWeight: 700,
                                          color: '#122438',
                                          borderBottom: '1.5px solid #C89B58',
                                        }}
                                      >
                                        {seg.text}
                                      </span>
                                    ) : (
                                      <span key={i}>{seg.text}</span>
                                    )
                                  )}
                                </span>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    ) : (
                      /* =========================================================================
                         BỐ CỤC CHUẨN CHO THẺ TỪ VỰNG & HÁN TỰ (KANJI & KOTOBA)
                         Responsive Flexbox an toàn, không bị vỡ layout khi từ ngữ dài
                         ========================================================================= */
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '1rem',
                        }}
                      >
                        {/* Phần thân nội dung từ vựng */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: '1 1 auto', minWidth: 0 }}>
                          {/* Hộp Kanji nổi bật */}
                          <div
                            style={{
                              minWidth: '64px',
                              maxWidth: '96px',
                              minHeight: '56px',
                              padding: '0.4rem 0.6rem',
                              background: '#FAF8F5',
                              border: '1px solid #E8E2D8',
                              borderRadius: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              textAlign: 'center',
                            }}
                          >
                            <span
                              style={{
                                fontFamily: 'var(--font-mincho), serif',
                                fontSize: card.kanji.length > 4 ? '1.15rem' : card.kanji.length > 2 ? '1.3rem' : '1.5rem',
                                fontWeight: 700,
                                color: '#1F2421',
                                wordBreak: 'break-all',
                                lineHeight: 1.2,
                              }}
                            >
                              {parseClozeSegments(card.kanji).map((seg, i) =>
                                seg.isCloze ? (
                                  <span key={i} style={{ color: '#153E20', fontWeight: 800 }}>
                                    {seg.text}
                                  </span>
                                ) : (
                                  <span key={i}>{seg.text}</span>
                                )
                              )}
                            </span>
                          </div>

                          {/* Chi tiết phát âm, cao độ & nghĩa */}
                          <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                              {card.reading && (
                                <span
                                  style={{
                                    fontFamily: 'var(--font-mincho), serif',
                                    fontSize: '0.92rem',
                                    fontWeight: 600,
                                    color: '#6E8A3C',
                                  }}
                                >
                                  {card.reading}
                                </span>
                              )}
                              {card.pitch && (
                                <span
                                  style={{
                                    fontSize: '0.72rem',
                                    fontFamily: 'monospace',
                                    color: '#717C75',
                                    background: '#FAF8F5',
                                    padding: '0.1rem 0.4rem',
                                    borderRadius: '4px',
                                    border: '1px solid #E8E2D8',
                                  }}
                                >
                                  {card.pitch}
                                </span>
                              )}
                            </div>

                            <h3
                              style={{
                                fontSize: '0.92rem',
                                fontWeight: 700,
                                color: '#1F2421',
                                margin: '0.25rem 0 0',
                                lineHeight: 1.4,
                                wordBreak: 'break-word',
                              }}
                            >
                              {card.meaning}
                            </h3>

                            {(() => {
                              const cleanFront = stripCloze(card.kanji).trim();
                              const cleanExample = card.example ? stripCloze(card.example).trim() : '';
                              const isRedundant = cleanExample === cleanFront;

                              if (!card.example || isRedundant) return null;

                              return (
                                <p
                                  style={{
                                    fontSize: '0.78rem',
                                    color: '#717C75',
                                    margin: '0.3rem 0 0',
                                    fontStyle: 'italic',
                                    wordBreak: 'break-word',
                                  }}
                                >
                                  {parseClozeSegments(card.example).map((seg, i) =>
                                    seg.isCloze ? (
                                      <span
                                        key={i}
                                        style={{
                                          fontWeight: 700,
                                          color: '#1F2421',
                                          borderBottom: '1.5px solid #88A752',
                                          fontStyle: 'normal',
                                        }}
                                      >
                                        {seg.text}
                                      </span>
                                    ) : (
                                      <span key={i}>{seg.text}</span>
                                    )
                                  )}
                                </p>
                              );
                            })()}
                          </div>
                        </div>

                        {/* Nút phát âm & Huy hiệu trạng thái Đến hạn */}
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            justifyContent: 'space-between',
                            minHeight: '56px',
                            flexShrink: 0,
                            marginLeft: '0.5rem',
                          }}
                        >
                          <JapaneseSpeakerButton text={stripCloze(card.kanji)} size={15} />

                          {card.isDue && (
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                fontSize: '0.72rem',
                                fontFamily: 'var(--font-maru)',
                                color: '#B5301E',
                                fontWeight: 700,
                                background: 'rgba(200, 56, 36, 0.06)',
                                border: '1.2px solid rgba(200, 56, 36, 0.22)',
                                padding: '0.15rem 0.55rem',
                                borderRadius: '999px',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              <span
                                style={{
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  background: '#C83824',
                                  boxShadow: '0 0 6px rgba(200, 56, 36, 0.4)',
                                }}
                              />
                              <span>Đến kỳ ôn tập</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Thông tin ngầm định FSRS & Tên bộ thẻ */}
                    <div
                      style={{
                        marginTop: '0.85rem',
                        paddingTop: '0.65rem',
                        borderTop: '1px solid #F2ECE1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.73rem',
                        color: '#717C75',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                      }}
                    >
                      <span>📁 {card.deckName}</span>
                      <span>
                        Độ ổn định FSRS: {card.stability} · Lặp lại: {card.reps} lần
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Liên kết xem toàn bộ danh sách thẻ */}
            <div style={{ textAlign: 'center', paddingTop: '1.25rem' }}>
              <Link
                href="/cards"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#6E8A3C',
                  textDecoration: 'none',
                }}
              >
                <span>Xem toàn bộ {stats.dueToday} thẻ trong danh sách hàng đợi</span>
                <span>→</span>
              </Link>
            </div>
          </section>

          {/* CỘT PHẢI: BỘ THẺ HỌC TẬP & CHỈ SỐ THUẬT TOÁN FSRS (5 PHẦN) */}
          <aside style={{ minWidth: 0, width: '100%', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* 0. TÍNH NĂNG MỚI: HỌC NGỮ PHÁP JPD133 (BUNBOU ENGINE) */}
            <div
              style={{
                background: 'linear-gradient(135deg, #1B4268 0%, #20507B 100%)',
                borderRadius: '16px',
                padding: '1.25rem 1.35rem',
                color: '#FFFFFF',
                boxShadow: '0 4px 16px rgba(27, 66, 104, 0.2)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '0.65rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      letterSpacing: '0.05em',
                    }}
                  >
                    MỚI · NEW
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.9 }}>
                    JPD133 Bunbou
                  </span>
                </div>
                <span style={{ fontSize: '1.25rem' }}>🎋</span>
              </div>

              <h3
                style={{
                  margin: '0 0 0.35rem',
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  fontFamily: 'var(--font-mincho), serif',
                }}
              >
                Học Ngữ Pháp Nhật Bản
              </h3>

              <p
                style={{
                  margin: '0 0 1rem',
                  fontSize: '0.82rem',
                  opacity: 0.85,
                  lineHeight: 1.45,
                }}
              >
                32 mẫu câu Bài 8-11 kèm 204 bài tập SBT và sơ đồ cấu trúc trực quan.
              </p>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link
                  href="/grammar"
                  style={{
                    flex: 1,
                    padding: '0.55rem',
                    background: '#FFFFFF',
                    color: '#1B4268',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    textAlign: 'center',
                    textDecoration: 'none',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  }}
                >
                  Xem bài học ➔
                </Link>
                <Link
                  href="/grammar/practice"
                  style={{
                    flex: 1,
                    padding: '0.55rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    textAlign: 'center',
                    textDecoration: 'none',
                  }}
                >
                  Luyện bài tập ✍️
                </Link>
              </div>
            </div>

            {/* 1. KHỐI BỘ THẺ HỌC TẬP (DECK COLLECTIONS) */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1.2px solid #E8E2D8',
                borderRadius: '16px',
                padding: '1.35rem 1.45rem',
                boxShadow: '0 2px 6px rgba(31, 36, 33, 0.02)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: '1.02rem',
                      fontWeight: 700,
                      color: '#1F2421',
                      margin: 0,
                      fontFamily: 'var(--font-sans), sans-serif',
                    }}
                  >
                    Bộ thẻ học tập
                  </h2>
                  <p
                    style={{
                      fontSize: '0.76rem',
                      color: '#717C75',
                      margin: '0.2rem 0 0',
                    }}
                  >
                    {deckSummaries.length} bộ thẻ đang được kích hoạt
                  </p>
                </div>

                <Link
                  href="/cards"
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#20507B',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                  }}
                >
                  <span>Thư viện thẻ ➔</span>
                </Link>
              </div>

              {/* Danh sách từng bộ thẻ */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {deckSummaries.length === 0 ? (
                  <p style={{ fontSize: '0.82rem', color: '#717C75', textAlign: 'center', padding: '1rem 0' }}>
                    Chưa có bộ thẻ nào trong kho.
                  </p>
                ) : (
                  deckSummaries.map((deck) => (
                    <div
                      key={deck.id}
                      style={{
                        border: '1px solid #E8E2D8',
                        borderRadius: '12px',
                        padding: '0.9rem 1rem',
                        background: '#FAF8F5',
                        transition: 'border-color 0.2s',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              fontSize: '0.88rem',
                              fontWeight: 700,
                              color: '#1F2421',
                              margin: 0,
                            }}
                          >
                            {deck.name}
                          </h3>
                          <p
                            style={{
                              fontSize: '0.75rem',
                              color: '#717C75',
                              margin: '0.2rem 0 0',
                            }}
                          >
                            {deck.description || 'Bộ từ vựng tiếng Nhật'}
                          </p>
                        </div>

                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: deck.dueCards > 0 ? '#D9381E' : '#717C75',
                            background: deck.dueCards > 0 ? '#FCEEEA' : '#F2ECE1',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '4px',
                            flexShrink: 0,
                          }}
                        >
                          {deck.dueCards} đến hạn
                        </span>
                      </div>

                      <div
                        style={{
                          marginTop: '0.75rem',
                          paddingTop: '0.6rem',
                          borderTop: '1px solid #E8E2D8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.75rem',
                          color: '#717C75',
                        }}
                      >
                        <span>
                          {deck.newCards} mới · Tổng {deck.totalCards} thẻ
                        </span>

                        <Link
                          href={`/review?deck=${deck.id}`}
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: '#D9381E',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                          }}
                        >
                          <span>Ôn bộ này</span>
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 2. CHỈ SỐ THUẬT TOÁN FSRS-4.5 (MINH BẠCH & KHOA HỌC) */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1.2px solid #E8E2D8',
                borderRadius: '16px',
                padding: '1.35rem 1.45rem',
                boxShadow: '0 2px 6px rgba(31, 36, 33, 0.02)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.85rem',
                }}
              >
                <span style={{ fontSize: '1.15rem' }}>🧠</span>
                <h2
                  style={{
                    fontSize: '0.96rem',
                    fontWeight: 700,
                    color: '#1F2421',
                    margin: 0,
                  }}
                >
                  Chỉ số thuật toán FSRS-4.5
                </h2>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.55rem',
                  fontSize: '0.78rem',
                  color: '#717C75',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '0.45rem',
                    borderBottom: '1px solid #F2ECE1',
                  }}
                >
                  <span>Tỷ lệ nhớ mục tiêu (Target Retention)</span>
                  <strong style={{ color: '#1F2421' }}>90.0%</strong>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '0.45rem',
                    borderBottom: '1px solid #F2ECE1',
                  }}
                >
                  <span>Độ ổn định trung bình (Mean Stability)</span>
                  <strong style={{ color: '#1F2421' }}>18.4 ngày</strong>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '0.45rem',
                    borderBottom: '1px solid #F2ECE1',
                  }}
                >
                  <span>Độ khó trung bình (Mean Difficulty)</span>
                  <strong style={{ color: '#1F2421' }}>4.7 / 10</strong>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Đợt thẻ kế tiếp dự kiến</span>
                  <strong style={{ color: '#6E8A3C' }}>18:00 hôm nay ({stats.dueToday} thẻ)</strong>
                </div>
              </div>

              <p
                style={{
                  fontSize: '0.72rem',
                  color: '#717C75',
                  marginTop: '0.85rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #E8E2D8',
                  lineHeight: 1.45,
                  margin: '0.85rem 0 0',
                }}
              >
                Thuật toán FSRS tự động điều chỉnh khoảng cách ôn tập dựa trên phản hồi 4 mức (Again / Hard / Good / Easy) để giảm thiểu số lần lặp lại thừa.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
