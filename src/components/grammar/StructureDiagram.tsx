'use client';

import React from 'react';
import { GrammarStructureSlot } from '@/core/grammar/grammar.types';

interface StructureDiagramProps {
  template: string;
  slots: GrammarStructureSlot[];
}

export function StructureDiagram({ template, slots }: StructureDiagramProps) {
  if (!slots || slots.length === 0) {
    return (
      <div
        style={{
          padding: '0.75rem 1rem',
          background: 'rgba(27, 66, 104, 0.05)',
          borderRadius: '8px',
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '0.95rem',
          color: '#1B4268',
          borderLeft: '4px solid #1B4268',
        }}
      >
        {template}
      </div>
    );
  }

  const roleLabels: Record<string, string> = {
    subject: 'Chủ ngữ',
    target: 'Đối tượng',
    object: 'Tân ngữ',
    particle: 'Trợ từ',
    core_verb: 'Động từ chính',
    auxiliary: 'Trợ động từ',
    adjective: 'Tính từ',
    noun: 'Danh từ',
    clause: 'Mệnh đề',
  };

  return (
    <div
      style={{
        padding: '1rem',
        background: 'var(--washi-card, #FAF8F5)',
        border: '1px solid var(--washi-border, #E6E1DA)',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div
        style={{
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#8B7B6D',
          marginBottom: '0.75rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span>📐 CẤU TRÚC KHUNG CÂU (STRUCTURE SLOTS)</span>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        {slots.map((slot, idx) => {
          const isParticle = slot.role === 'particle';
          const bg = isParticle ? 'rgba(136, 167, 82, 0.15)' : 'rgba(27, 66, 104, 0.08)';
          const borderColor = isParticle ? '#88A752' : '#1B4268';
          const textColor = isParticle ? '#4A6B22' : '#1B4268';

          return (
            <React.Fragment key={idx}>
              <div
                style={{
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0.35rem 0.65rem',
                  background: bg,
                  border: `1.5px solid ${borderColor}`,
                  borderRadius: '6px',
                  minWidth: '54px',
                  transition: 'transform 0.15s ease',
                }}
              >
                <span
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: textColor,
                    fontFamily: 'var(--font-noto, sans-serif)',
                  }}
                >
                  {slot.label}
                </span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    color: '#666',
                    marginTop: '2px',
                    fontWeight: 500,
                  }}
                >
                  {roleLabels[slot.role] || slot.role}
                </span>
              </div>

              {idx < slots.length - 1 && (
                <span
                  style={{
                    color: '#8B7B6D',
                    fontWeight: 700,
                    fontSize: '1rem',
                  }}
                >
                  +
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
