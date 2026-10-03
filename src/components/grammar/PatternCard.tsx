'use client';

import React, { useState } from 'react';
import { GrammarPattern } from '@/core/grammar/grammar.types';
import { StructureDiagram } from './StructureDiagram';
import { JapaneseSpeakerButton } from '@/components/japanese/JapaneseSpeakerButton';
import { parseClozeSegments } from '@/lib/cloze';
import Link from 'next/link';

interface PatternCardProps {
  pattern: GrammarPattern;
  accentColor?: string;
  defaultExpanded?: boolean;
}

export function PatternCard({ pattern, accentColor = '#1B4268', defaultExpanded = false }: PatternCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Helper render furigana text if bracket format is present: 漢字[かんじ]
  const renderFurigana = (furiText: string) => {
    if (!furiText) return null;
    const parts = furiText.split(/([^\s]+?\[[^\]]+?\])/g);
    return parts.map((part, idx) => {
      const match = part.match(/^(.+?)\[(.+?)\]$/);
      if (match) {
        return (
          <ruby key={idx} style={{ rubyPosition: 'over' }}>
            {match[1]}
            <rt style={{ fontSize: '0.65em', color: '#88A752', fontWeight: 600 }}>{match[2]}</rt>
          </ruby>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: `1.5px solid var(--washi-border, #E6E1DA)`,
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 3px 12px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.2s ease',
        marginBottom: '1.25rem',
      }}
    >
      {/* Pattern Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          background: isExpanded ? 'rgba(27, 66, 104, 0.03)' : '#FFFFFF',
          borderBottom: isExpanded ? '1px solid var(--washi-border, #E6E1DA)' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              background: accentColor,
              color: '#FFFFFF',
              padding: '0.3rem 0.65rem',
              borderRadius: '6px',
              fontWeight: 800,
              fontSize: '0.85rem',
              letterSpacing: '0.05em',
              fontFamily: 'var(--font-mono, monospace)',
            }}
          >
            P.{pattern.patternNumber}
          </div>
          <div>
            <div
              style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                color: '#1F2421',
                fontFamily: 'var(--font-mincho, "Shippori Mincho", serif)',
              }}
            >
              {pattern.patternTemplate}
            </div>
            <div
              style={{
                fontSize: '0.85rem',
                color: '#666',
                marginTop: '0.15rem',
              }}
            >
              {pattern.meaningVi}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 700,
              background: '#E8F4E8',
              color: '#2B6B3D',
            }}
          >
            {pattern.jlptLevel}
          </span>
          <span
            style={{
              color: '#8B7B6D',
              fontSize: '0.9rem',
              transform: isExpanded ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s ease',
            }}
          >
            ▼
          </span>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div style={{ padding: '1.25rem 1.5rem', background: '#FAFAF9' }}>
          {/* Structure Diagram */}
          <div style={{ marginBottom: '1.25rem' }}>
            <StructureDiagram template={pattern.patternTemplate} slots={pattern.structureSlots} />
          </div>

          {/* Usage Note */}
          {pattern.usageNote && (
            <div
              style={{
                padding: '0.85rem 1rem',
                background: '#FFFFFF',
                borderRadius: '8px',
                borderLeft: `4px solid ${accentColor}`,
                fontSize: '0.9rem',
                lineHeight: 1.6,
                color: '#333',
                marginBottom: '1.25rem',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div style={{ fontWeight: 700, color: accentColor, marginBottom: '0.35rem', fontSize: '0.8rem' }}>
                💡 GIẢI THÍCH SƯ PHẠM & CÁCH DÙNG
              </div>
              {pattern.usageNote}
            </div>
          )}

          {/* Canonical Examples */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: '#8B7B6D',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span>🎋 CÂU VÍ DỤ MINH HỌA (CANONICAL EXAMPLES)</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(pattern.examples || []).map((ex, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #ECE8E1',
                    borderRadius: '8px',
                    padding: '0.85rem 1rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#1F2421' }}>
                      {renderFurigana(ex.furigana) || ex.ja}
                    </div>
                    <JapaneseSpeakerButton text={ex.ja} size={16} />
                  </div>

                  {ex.romaji && (
                    <div style={{ fontSize: '0.8rem', color: '#888', fontStyle: 'italic', marginTop: '0.2rem' }}>
                      {ex.romaji}
                    </div>
                  )}

                  <div style={{ fontSize: '0.9rem', color: '#2B6B3D', fontWeight: 500, marginTop: '0.3rem' }}>
                    {ex.vi}
                  </div>

                  {ex.contextNote && (
                    <div style={{ fontSize: '0.75rem', color: '#777', marginTop: '0.25rem' }}>
                      📌 {ex.contextNote}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Practice Link */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Link
              href={`/grammar/practice?lessonId=${pattern.lessonId}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 1rem',
                background: accentColor,
                color: '#FFFFFF',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
            >
              <span>Luyện tập mẫu câu này ➔</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
