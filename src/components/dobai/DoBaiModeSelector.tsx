'use client';

export type DoBaiDrillDirection = 'forward' | 'reverse';

interface DoBaiModeSelectorProps {
  direction: DoBaiDrillDirection;
  onDirectionChange: (direction: DoBaiDrillDirection) => void;
  unlearnedCount: number;
  filterOnlyUnlearned: boolean;
  onToggleFilterOnlyUnlearned: () => void;
}

export function DoBaiModeSelector({
  direction,
  onDirectionChange,
  unlearnedCount,
  filterOnlyUnlearned,
  onToggleFilterOnlyUnlearned,
}: DoBaiModeSelectorProps) {
  const optionStyle = (active: boolean): React.CSSProperties => ({
    border: active ? '1px solid var(--aizome-navy)' : '1px solid var(--washi-border)',
    background: active ? 'var(--aizome-navy)' : 'var(--washi-surface)',
    color: active ? '#FFFFFF' : 'var(--sumi-charcoal)',
    borderRadius: '8px',
    padding: '0.5rem 0.8rem',
    fontFamily: 'var(--font-maru)',
    fontWeight: 700,
    cursor: 'pointer',
  });

  return (
    <div
      aria-label="Tùy chọn Dò bài Minna"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        flexWrap: 'wrap',
        marginBottom: '0.85rem',
        padding: '0.65rem',
        border: '1px solid var(--washi-border)',
        borderRadius: '12px',
        background: 'var(--washi-surface)',
      }}
    >
      <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          aria-pressed={direction === 'forward'}
          onClick={() => onDirectionChange('forward')}
          style={optionStyle(direction === 'forward')}
        >
          Nhật → Việt
        </button>
        <button
          type="button"
          aria-pressed={direction === 'reverse'}
          onClick={() => onDirectionChange('reverse')}
          style={optionStyle(direction === 'reverse')}
        >
          Việt → Nhật
        </button>
      </div>

      <button
        type="button"
        aria-pressed={filterOnlyUnlearned}
        disabled={unlearnedCount === 0}
        onClick={onToggleFilterOnlyUnlearned}
        style={{
          ...optionStyle(filterOnlyUnlearned),
          opacity: unlearnedCount === 0 ? 0.55 : 1,
          cursor: unlearnedCount === 0 ? 'not-allowed' : 'pointer',
        }}
      >
        Nợ D-E-F: {unlearnedCount}
      </button>
    </div>
  );
}
