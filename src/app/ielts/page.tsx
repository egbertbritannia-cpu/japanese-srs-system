'use client';

import React from 'react';

export default function IeltsDashboard() {
  return (
    <div className="english-mode" style={{ minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', borderBottom: '2px solid var(--secondary-color)', paddingBottom: '0.5rem' }}>
          IELTS The Study
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          Welcome to your British Classic IELTS study dashboard.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div className="british-border" style={{ backgroundColor: 'white' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Progress Chart</h2>
            <div style={{ height: '200px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#888' }}>[Line Chart Placeholder]</span>
            </div>
          </div>

          <div className="british-border" style={{ backgroundColor: 'white' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Recent Mistakes</h2>
            <ul style={{ listStyleType: 'square', paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}><span style={{ color: 'var(--error-color)', fontWeight: 'bold' }}>Grammar</span>: Incorrect use of past perfect</li>
              <li style={{ marginBottom: '0.5rem' }}><span style={{ color: 'var(--error-color)', fontWeight: 'bold' }}>Vocabulary</span>: Confused "affect" and "effect"</li>
              <li style={{ marginBottom: '0.5rem' }}><span style={{ color: 'var(--error-color)', fontWeight: 'bold' }}>Distraction</span>: Fell for distractor in Listening Part 3</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
