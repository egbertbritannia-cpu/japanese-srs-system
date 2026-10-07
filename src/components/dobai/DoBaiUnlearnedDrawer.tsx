'use client';

export interface UnlearnedItem {
  id: string;
  kanji: string;
  reading?: string;
  meaning: string;
  repeatInTurns: number;
}

interface DoBaiUnlearnedDrawerProps {
  unlearnedList: UnlearnedItem[];
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export function DoBaiUnlearnedDrawer({
  unlearnedList,
  isOpenMobile,
  onCloseMobile,
}: DoBaiUnlearnedDrawerProps) {
  return (
    <aside
      className={isOpenMobile ? 'dobai-retry-drawer is-open-mobile' : 'dobai-retry-drawer'}
      aria-label="Hàng đợi chưa thuộc D-E-F"
      style={{
        background: 'var(--washi-surface)',
        border: '1px solid var(--washi-border)',
        borderRadius: '16px',
        padding: '1rem',
        boxShadow: 'var(--shadow-washi-md)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mincho)', fontWeight: 800, color: 'var(--sumi-ink)' }}>
            Hàng đợi D-E-F
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--sumi-faded)' }}>
            {unlearnedList.length} mục cần xen kẽ lại
          </div>
        </div>
        {isOpenMobile && (
          <button type="button" onClick={onCloseMobile} aria-label="Đóng hàng đợi" className="btn-washi">
            Đóng
          </button>
        )}
      </div>

      <ol style={{ listStyle: 'none', display: 'grid', gap: '0.6rem', marginTop: '0.9rem' }}>
        {unlearnedList.map((item) => (
          <li
            key={item.id}
            style={{
              padding: '0.7rem',
              border: '1px solid var(--washi-border-soft)',
              borderRadius: '10px',
              background: 'var(--washi-deep)',
            }}
          >
            <div style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.15rem', fontWeight: 800 }}>
              {item.kanji}
            </div>
            {item.reading && (
              <div style={{ color: 'var(--bengara-red)', fontSize: '0.8rem', fontWeight: 700 }}>
                {item.reading}
              </div>
            )}
            <div style={{ color: 'var(--sumi-charcoal)', fontSize: '0.82rem' }}>{item.meaning}</div>
            <div style={{ color: 'var(--sumi-faded)', fontSize: '0.72rem', marginTop: '0.25rem' }}>
              Thử lại sau khoảng {item.repeatInTurns} lượt
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
