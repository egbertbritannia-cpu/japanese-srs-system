'use client';

interface DoBaiHotkeysBarProps {
  isRevealed: boolean;
  onReveal: () => void;
  onMastered: () => void;
  onRetry: () => void;
  onUndo: () => void;
  canUndo: boolean;
  onPronounce: () => void;
}

export function DoBaiHotkeysBar({
  isRevealed,
  onReveal,
  onMastered,
  onRetry,
  onUndo,
  canUndo,
  onPronounce,
}: DoBaiHotkeysBarProps) {
  const itemStyle: React.CSSProperties = {
    border: '1px solid var(--washi-border)',
    background: 'var(--washi-surface)',
    color: 'var(--sumi-charcoal)',
    borderRadius: '8px',
    padding: '0.45rem 0.65rem',
    fontFamily: 'var(--font-maru)',
    fontSize: '0.78rem',
    fontWeight: 700,
    cursor: 'pointer',
    minHeight: '38px',
  };

  return (
    <div
      aria-label="Phím tắt Dò bài Minna"
      style={{
        display: 'flex',
        gap: '0.45rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: '1rem',
        padding: '0.65rem',
        borderTop: '1px solid var(--washi-border)',
      }}
    >
      <button type="button" onClick={onReveal} style={itemStyle}>
        Space · {isRevealed ? 'Ẩn' : 'Hiện'}
      </button>
      <button
        type="button"
        onClick={onMastered}
        disabled={!isRevealed}
        style={{ ...itemStyle, opacity: isRevealed ? 1 : 0.5 }}
      >
        Enter / 1 · Đã thuộc
      </button>
      <button
        type="button"
        onClick={onRetry}
        disabled={!isRevealed}
        style={{ ...itemStyle, opacity: isRevealed ? 1 : 0.5 }}
      >
        Backspace / 2 · Chưa thuộc
      </button>
      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        style={{ ...itemStyle, opacity: canUndo ? 1 : 0.5 }}
      >
        Z · Hoàn tác
      </button>
      <button type="button" onClick={onPronounce} style={itemStyle}>
        P · Phát âm
      </button>
    </div>
  );
}
