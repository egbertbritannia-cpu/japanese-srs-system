'use client';

import React from 'react';
import Link from 'next/link';

export default function IeltsDashboard() {
  const targetBand = 8.0;
  const currentBand = 7.0;

  const skillBands = [
    { skill: 'Listening', current: 7.5, target: 8.5, color: '#002147' },
    { skill: 'Reading', current: 7.5, target: 8.5, color: '#1B4268' },
    { skill: 'Writing', current: 6.5, target: 7.5, color: '#D97706' },
    { skill: 'Speaking', current: 6.5, target: 7.5, color: '#059669' },
  ];

  const recentSessions = [
    { id: 's1', title: 'Cambridge IELTS 18 - Test 1', section: 'Reading', type: 'Academic', score: '32/40', band: 7.5, date: 'Hôm nay' },
    { id: 's2', title: 'Cambridge IELTS 18 - Test 1', section: 'Listening', type: 'Academic', score: '30/40', band: 7.0, date: 'Hôm qua' },
    { id: 's3', title: 'Cambridge IELTS 17 - Test 4', section: 'Reading', type: 'Academic', score: '28/40', band: 6.5, date: '3 ngày trước' },
  ];

  const mistakeBreakdown = [
    { category: 'Distraction', count: 12, percent: 35, desc: 'Bẫy đề thi, thông tin đối lập giữa bài nghe và phương án' },
    { category: 'Vocabulary', count: 9, percent: 26, desc: 'Không nhận ra từ đồng nghĩa (paraphrase) trong câu hỏi' },
    { category: 'Time Management', count: 6, percent: 18, desc: 'Tốn quá 22 phút cho Passage 1 dẫn tới cuống ở Passage 3' },
    { category: 'Comprehension', count: 4, percent: 12, desc: 'Mạch văn phức tạp chứa nhiều mệnh đề quan hệ kép' },
    { category: 'Careless', count: 3, percent: 9, desc: 'Vượt quá giới hạn số từ quy định (NO MORE THAN TWO WORDS)' },
  ];

  return (
    <div className="english-mode" style={{ minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header Hero */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.6rem', margin: 0, fontFamily: 'var(--font-serif)', color: 'var(--primary-color)' }}>
              The Study · IELTS Master Suite
            </h1>
            <p style={{ fontSize: '1.1rem', margin: '0.35rem 0 0', color: 'var(--text-color)' }}>
              Môi trường theo dõi học tập học thuật chuẩn Oxford &amp; Cambridge.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link
              href="/ielts/session"
              style={{
                backgroundColor: 'var(--primary-color)',
                color: '#FFFFFF',
                padding: '0.8rem 1.6rem',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontFamily: 'var(--font-sans)',
                boxShadow: '0 3px 8px rgba(0,33,71,0.25)',
              }}
            >
              ▶ Bắt đầu Session mới
            </Link>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div className="british-border" style={{ backgroundColor: '#FFFFFF', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase', fontWeight: 600 }}>
              Overall Target Band
            </div>
            <div style={{ fontSize: '3rem', color: 'var(--primary-color)', fontWeight: 'bold', fontFamily: 'var(--font-serif)', lineHeight: 1.1, margin: '0.25rem 0' }}>
              {targetBand.toFixed(1)}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600 }}>
              Mục tiêu xét duyệt học bổng / hồ sơ
            </div>
          </div>

          <div className="british-border" style={{ backgroundColor: '#FFFFFF', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase', fontWeight: 600 }}>
              Current Estimated Band
            </div>
            <div style={{ fontSize: '3rem', color: '#1B4268', fontWeight: 'bold', fontFamily: 'var(--font-serif)', lineHeight: 1.1, margin: '0.25rem 0' }}>
              {currentBand.toFixed(1)}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>
              Trung bình cộng 3 session gần nhất
            </div>
          </div>

          <div className="british-border" style={{ backgroundColor: '#FFFFFF', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase', fontWeight: 600 }}>
              Lỗi Sai Đã Phân Tích
            </div>
            <div style={{ fontSize: '3rem', color: 'var(--error-color)', fontWeight: 'bold', fontFamily: 'var(--font-serif)', lineHeight: 1.1, margin: '0.25rem 0' }}>
              34
            </div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>
              Cần khắc phục bẫy Distraction
            </div>
          </div>

          <div className="british-border" style={{ backgroundColor: '#FFFFFF', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase', fontWeight: 600 }}>
              FSRS Vocab Vault
            </div>
            <div style={{ fontSize: '3rem', color: '#047857', fontWeight: 'bold', fontFamily: 'var(--font-serif)', lineHeight: 1.1, margin: '0.25rem 0' }}>
              128
            </div>
            <div style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600 }}>
              Đã sẵn sàng đồng bộ sang Cards
            </div>
          </div>
        </div>

        {/* 4 Skills Breakdown */}
        <div className="british-border" style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', borderRadius: '8px', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', margin: '0 0 1.25rem 0' }}>
            Trình Độ Chi Tiết Theo 4 Kỹ Năng (Band 0.0 - 9.0)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {skillBands.map((sk) => (
              <div key={sk.skill} style={{ padding: '1rem', background: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{sk.skill}</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: sk.color }}>{sk.current.toFixed(1)} / 9.0</span>
                </div>
                <div style={{ height: '8px', background: '#E5E7EB', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                  <div style={{ height: '100%', width: `${(sk.current / 9) * 100}%`, background: sk.color, borderRadius: '4px' }} />
                </div>
                <div style={{ fontSize: '0.78rem', color: '#6B7280', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Hiện tại: {sk.current}</span>
                  <span>Mục tiêu: {sk.target}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2-Column: Recent Sessions & Mistake Taxonomy */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Recent Sessions */}
          <div className="british-border" style={{ backgroundColor: '#FFFFFF', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Recent Test Sessions</h2>
              <Link href="/ielts/session" style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none' }}>
                + Làm bài mới
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentSessions.map((s) => (
                <div
                  key={s.id}
                  style={{
                    padding: '0.85rem 1rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#FAFAFA'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 'bold', color: 'var(--primary-color)', fontSize: '0.95rem' }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '0.2rem' }}>
                      {s.section} ({s.type}) · {s.score} · {s.date}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      padding: '0.25rem 0.65rem',
                      borderRadius: '4px',
                      background: 'rgba(0,33,71,0.08)',
                      color: 'var(--primary-color)',
                      fontWeight: 'bold',
                      fontSize: '1rem'
                    }}>
                      Band {s.band.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mistake Taxonomy */}
          <div className="british-border" style={{ backgroundColor: '#FFFFFF', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>
              Mistake Taxonomy Analysis
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {mistakeBreakdown.map((m) => (
                <div key={m.category} style={{ padding: '0.65rem', borderBottom: '1px solid #F3F4F6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--primary-color)' }}>
                      {m.category}
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--error-color)' }}>
                      {m.count} lỗi ({m.percent}%)
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#6B7280' }}>
                    {m.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
