import Link from 'next/link';

/**
 * Quản lý danh sách thẻ, tìm kiếm, lọc theo deck
 */
export default function CardsPage() {
  const mockCards = [
    { id: '1', kanji: '勉強', reading: 'べんきょう', meaning: 'Học tập', deck: 'JLPT N5', type: 'Vocab' },
    { id: '2', kanji: '猫', reading: 'ねこ', meaning: 'Con mèo', deck: 'JLPT N5', type: 'Kanji' },
    { id: '3', kanji: '食べる', reading: 'たべる', meaning: 'Ăn', deck: 'JLPT N5', type: 'Cloze' },
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Quản lý thẻ học</h1>
          <p style={{ color: '#94a3b8' }}>Tìm kiếm, lọc danh sách thẻ và quản lý deck</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/" style={{ padding: '0.5rem 1rem', border: '1px solid var(--border)', borderRadius: '6px', color: 'inherit', textDecoration: 'none' }}>
            Dashboard
          </Link>
          <Link
            href="/cards/new"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--primary)',
              borderRadius: '6px',
              color: 'white',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            + Thêm thẻ mới
          </Link>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Tìm kiếm từ vựng, kanji, nghĩa..."
          style={{
            flex: 1,
            padding: '0.75rem',
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            color: 'white',
          }}
        />
        <select
          style={{
            padding: '0.75rem',
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            color: 'white',
          }}
        >
          <option value="all">Tất cả Deck</option>
          <option value="n5">JLPT N5</option>
          <option value="n4">JLPT N4</option>
          <option value="n3">JLPT N3</option>
        </select>
      </div>

      {/* Card Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--card-bg)', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: '#94a3b8' }}>
            <th style={{ padding: '1rem' }}>Mặt trước (Kanji)</th>
            <th style={{ padding: '1rem' }}>Cách đọc</th>
            <th style={{ padding: '1rem' }}>Nghĩa</th>
            <th style={{ padding: '1rem' }}>Deck</th>
            <th style={{ padding: '1rem' }}>Loại thẻ</th>
          </tr>
        </thead>
        <tbody>
          {mockCards.map((card) => (
            <tr key={card.id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>{card.kanji}</td>
              <td style={{ padding: '1rem' }}>{card.reading}</td>
              <td style={{ padding: '1rem' }}>{card.meaning}</td>
              <td style={{ padding: '1rem' }}>
                <span style={{ padding: '0.25rem 0.5rem', background: '#334155', borderRadius: '4px', fontSize: '0.85rem' }}>
                  {card.deck}
                </span>
              </td>
              <td style={{ padding: '1rem', color: '#38bdf8' }}>{card.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
