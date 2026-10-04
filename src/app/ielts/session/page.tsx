'use client';

import React from 'react';

export default function IeltsSessionTracker() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', borderBottom: '2px solid var(--secondary-color)', paddingBottom: '0.5rem' }}>
        Session Tracker
      </h1>

      <div className="british-border" style={{ backgroundColor: 'white', padding: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '4rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>
          60:00
        </div>
        <button style={{
          backgroundColor: 'var(--primary-color)',
          color: 'white',
          padding: '0.8rem 2rem',
          border: 'none',
          borderRadius: '4px',
          fontSize: '1.2rem',
          cursor: 'pointer',
          fontFamily: 'var(--font-sans)'
        }}>
          Start Test Session
        </button>
      </div>

      <div className="british-border" style={{ backgroundColor: 'white', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Quick Answer Grid</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ minWidth: '24px', textAlign: 'right', fontWeight: 'bold' }}>{i + 1}.</span>
              <input type="text" style={{
                width: '100%',
                padding: '0.2rem',
                border: '1px solid #ccc',
                borderRadius: '2px'
              }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
