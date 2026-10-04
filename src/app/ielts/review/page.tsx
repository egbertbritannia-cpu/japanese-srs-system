'use client';

import React from 'react';

export default function IeltsReviewDesk() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', borderBottom: '2px solid var(--secondary-color)', paddingBottom: '0.5rem' }}>
        Review & Analysis
      </h1>

      <div className="british-border" style={{ backgroundColor: 'white', padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Test Results: Cambridge 18 - Test 1 (Reading)</h2>
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ color: 'var(--text-color)', fontSize: '0.9rem' }}>Raw Score</div>
            <div style={{ fontSize: '2rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>32/40</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-color)', fontSize: '0.9rem' }}>Estimated Band</div>
            <div style={{ fontSize: '2rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>7.5</div>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--primary-color)' }}>
              <th style={{ padding: '0.5rem' }}>Q#</th>
              <th style={{ padding: '0.5rem' }}>Your Answer</th>
              <th style={{ padding: '0.5rem' }}>Correct Answer</th>
              <th style={{ padding: '0.5rem' }}>Status</th>
              <th style={{ padding: '0.5rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem' }}>1</td>
              <td style={{ padding: '0.5rem' }}>True</td>
              <td style={{ padding: '0.5rem' }}>True</td>
              <td style={{ padding: '0.5rem', color: 'green' }}>✓</td>
              <td style={{ padding: '0.5rem' }}>-</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee', backgroundColor: '#fff9f9' }}>
              <td style={{ padding: '0.5rem' }}>2</td>
              <td style={{ padding: '0.5rem' }}>False</td>
              <td style={{ padding: '0.5rem' }}>Not Given</td>
              <td style={{ padding: '0.5rem', color: 'var(--error-color)' }}>✗</td>
              <td style={{ padding: '0.5rem' }}>
                <button style={{
                  backgroundColor: 'white',
                  border: '1px solid var(--primary-color)',
                  color: 'var(--primary-color)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}>
                  Analyze Mistake
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
