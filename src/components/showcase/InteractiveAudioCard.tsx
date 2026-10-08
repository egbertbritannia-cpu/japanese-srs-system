'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { MultimodalAsset } from '@/services/multimodal/types';

export interface InteractiveAudioCardProps {
  asset: MultimodalAsset;
  onInspect?: (asset: MultimodalAsset) => void;
}

/**
 * 🌸 InteractiveAudioCard (インタラクティブ音声カード)
 *
 * Renders an interactive audio card for Google Drive CDN MP3 streams.
 * Includes:
 * - HTMLAudioElement playback with Play/Pause state
 * - Animated bouncing SVG waveform bars
 * - Real-time stream startup latency indicator (measured in milliseconds)
 * - Category badge, title, time progress, and asset inspector button
 */
export function InteractiveAudioCard({ asset, onInspect }: InteractiveAudioCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playStartTimeRef = useRef<number>(0);

  // Derive human-friendly title and category label
  const rawKey = asset.key || '';
  const keyIdentifier = rawKey.includes(':') ? rawKey.split(':')[1] : rawKey;
  const title =
    asset.metadata?.word ||
    asset.metadata?.title ||
    asset.metadata?.japanese ||
    decodeURIComponent(keyIdentifier) ||
    asset.fileName;

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'vocab_audio':
        return { label: '語彙音声', color: 'var(--matcha-deep)', bg: 'var(--matcha-subtle)', border: 'var(--koke-border)' };
      case 'ielts_audio':
        return { label: 'IELTS音声', color: 'var(--aizome)', bg: 'var(--aizome-soft)', border: 'var(--aizome-border)' };
      case 'jlpt_choukai':
        return { label: 'JLPT聴解', color: 'var(--bengara)', bg: 'var(--bengara-soft)', border: 'var(--bengara-border)' };
      case 'immersion_clip':
        return { label: '会話クリップ', color: 'var(--kincha)', bg: 'var(--kincha-soft)', border: 'var(--kincha-border)' };
      default:
        return { label: '音声 (Audio)', color: 'var(--sumi-body)', bg: 'var(--washi-deep)', border: 'var(--washi-border)' };
    }
  };

  const theme = getCategoryTheme(asset.category);

  // Clean up audio on unmount
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, []);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setHasError(false);
      playStartTimeRef.current = performance.now();
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('[InteractiveAudioCard] Playback blocked or failed:', err);
        setHasError(true);
        setIsPlaying(false);
      }
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handlePlaying = () => {
    if (playStartTimeRef.current > 0) {
      const elapsed = Math.round(performance.now() - playStartTimeRef.current);
      setLatencyMs(elapsed);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleInspect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onInspect) {
      onInspect(asset);
    }
  };

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const audioSrc = asset.fileId
    ? `/api/media/stream?fileId=${encodeURIComponent(asset.fileId)}&mimeType=audio/mpeg`
    : asset.cdnUrl;

  return (
    <div
      className="card-karuta washi-paper-bg"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        border: '1px solid var(--washi-border)',
        backgroundColor: 'var(--washi-card)',
        boxShadow: 'var(--shadow-washi-md)',
        overflow: 'hidden',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-karuta)';
        e.currentTarget.style.borderColor = 'var(--matcha-primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-washi-md)';
        e.currentTarget.style.borderColor = 'var(--washi-border)';
      }}
    >
      {/* Hidden native audio element */}
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlaying={handlePlaying}
        onEnded={handleEnded}
        onError={() => {
          setHasError(true);
          setIsPlaying(false);
        }}
      />

      {/* Header bar: Category Badge & Latency Feedback */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.65rem 0.9rem',
          borderBottom: '1px solid var(--washi-border-soft)',
          backgroundColor: 'rgba(247, 244, 235, 0.7)',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            fontFamily: 'var(--font-maru)',
            color: theme.color,
            backgroundColor: theme.bg,
            padding: '0.2rem 0.55rem',
            borderRadius: '999px',
            border: `1px solid ${theme.border}`,
            letterSpacing: '0.04em',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: theme.color,
            }}
          />
          {theme.label}
        </span>

        {/* Latency Indicator Badge */}
        {latencyMs !== null ? (
          <span
            title="Độ trễ khởi tạo luồng âm thanh từ Google Drive CDN"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.7rem',
              fontWeight: 700,
              fontFamily: 'var(--font-sans)',
              color: latencyMs < 200 ? 'var(--matcha-deep)' : latencyMs < 500 ? 'var(--kincha)' : 'var(--bengara)',
              backgroundColor: 'var(--washi-deep)',
              padding: '0.15rem 0.45rem',
              borderRadius: '4px',
              border: '1px solid var(--washi-border)',
            }}
          >
            ⚡ {latencyMs}ms
          </span>
        ) : (
          <span
            style={{
              fontSize: '0.68rem',
              color: 'var(--sumi-ghost)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            CDN Ready
          </span>
        )}
      </div>

      {/* Main Content Area: Play button + Title + Bouncing Waveform */}
      <div
        style={{
          padding: '1.1rem 0.9rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.8rem',
          flex: 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Round Play / Pause Button with Ripple Effect */}
          <button
            type="button"
            onClick={togglePlay}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isPlaying ? 'var(--matcha-deep)' : 'var(--bengara)',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              boxShadow: isPlaying
                ? '0 0 0 4px var(--matcha-subtle), 0 4px 12px rgba(105, 120, 88, 0.3)'
                : '0 4px 12px rgba(158, 50, 35, 0.25)',
              transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              flexShrink: 0,
            }}
            title={isPlaying ? 'Tạm dừng' : 'Phát âm thanh'}
          >
            {isPlaying ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1.5" />
                <rect x="14" y="4" width="4" height="16" rx="1.5" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '2px' }}>
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
            )}
          </button>

          {/* Title & Word information */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4
              style={{
                fontFamily: 'var(--font-mincho)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--sumi-deep)',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                lineHeight: 1.25,
              }}
              title={title}
            >
              {title}
            </h4>

            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--sumi-faint)',
                fontFamily: 'var(--font-sans)',
                marginTop: '0.15rem',
                display: 'flex',
                gap: '0.5rem',
              }}
            >
              <span>{formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : '--:--'}</span>
              {hasError && <span style={{ color: 'var(--bengara)' }}>(Lỗi luồng)</span>}
            </div>
          </div>
        </div>

        {/* Animated SVG Waveform Visualizer */}
        <div
          style={{
            height: '42px',
            backgroundColor: 'var(--washi-deep)',
            borderRadius: '8px',
            padding: '0 0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid var(--washi-border-soft)',
            overflow: 'hidden',
          }}
        >
          {Array.from({ length: 18 }).map((_, idx) => {
            // Deterministic heights for resting bars
            const baseHeight = 6 + ((idx * 7) % 18);
            const activeHeight = isPlaying ? 10 + ((idx * 11 + (currentTime * 10)) % 26) : baseHeight;
            const barColor = isPlaying
              ? idx % 2 === 0
                ? 'var(--matcha-deep)'
                : 'var(--kincha)'
              : 'var(--washi-sunken)';

            return (
              <div
                key={idx}
                style={{
                  width: '3.5px',
                  height: `${activeHeight}px`,
                  backgroundColor: barColor,
                  borderRadius: '2px',
                  transition: 'height 0.15s ease, background-color 0.2s ease',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Footer bar: Subtitle / Source info + Inspect Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.65rem 0.9rem',
          backgroundColor: 'rgba(247, 244, 235, 0.4)',
          borderTop: '1px solid var(--washi-border-soft)',
        }}
      >
        <span
          style={{
            fontSize: '0.72rem',
            color: 'var(--sumi-faint)',
            fontFamily: 'var(--font-sans)',
            maxWidth: '180px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {asset.metadata?.source || (asset.sizeBytes > 0 ? `${Math.round(asset.sizeBytes / 1024)} KB` : asset.mimeType)}
        </span>

        <button
          type="button"
          onClick={handleInspect}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.35rem 0.6rem',
            fontSize: '0.72rem',
            fontWeight: 600,
            fontFamily: 'var(--font-maru)',
            color: 'var(--sumi-body)',
            backgroundColor: 'var(--washi-deep)',
            border: '1px solid var(--washi-border)',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--kincha)';
            e.currentTarget.style.borderColor = 'var(--kincha)';
            e.currentTarget.style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--washi-deep)';
            e.currentTarget.style.borderColor = 'var(--washi-border)';
            e.currentTarget.style.color = 'var(--sumi-body)';
          }}
          title="Xem metadata và URL CDN"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          詳細
        </button>
      </div>
    </div>
  );
}

export default InteractiveAudioCard;
