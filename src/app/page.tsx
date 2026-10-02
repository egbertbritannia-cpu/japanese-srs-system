import Link from 'next/link';

/**
 * Dashboard: Thống kê số thẻ đến hạn (Due), nút bắt đầu học
 */
export default function DashboardPage() {
  const stats = {
    dueToday: 15,
    newCards: 5,
    retentionRate: '90%',
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          🇯🇵 Japanese SRS System
        </h1>
        <p style={{ color: '#94a3b8' }}>
          Hệ thống lặp lại ngắt quãng tối ưu học tiếng Nhật kết hợp thuật toán FSRS
        </p>
      </header>

      {/* Dashboard Stats */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div style={{ padding: '1.5rem', background: 'var(--card-bg)', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <h3 style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Thẻ cần ôn hôm nay (Due)</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b' }}>{stats.dueToday}</p>
        </div>
        <div style={{ padding: '1.5rem', background: 'var(--card-bg)', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <h3 style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Thẻ mới (New)</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3b82f6' }}>{stats.newCards}</p>
        </div>
        <div style={{ padding: '1.5rem', background: 'var(--card-bg)', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <h3 style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Tỉ lệ ghi nhớ mục tiêu</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>{stats.retentionRate}</p>
        </div>
      </section>

      {/* Actions */}
      <section style={{ display: 'flex', gap: '1rem' }}>
        <Link
          href="/review"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--primary)',
            color: 'white',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          🚀 Bắt đầu ôn tập
        </Link>
        <Link
          href="/cards"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--foreground)',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          📚 Quản lý thẻ học
        </Link>
      </section>
    </main>
  );
}
