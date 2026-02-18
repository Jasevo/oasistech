'use client'

import React from 'react'
import '@/app/(payload)/admin/custom.css'

const TestCredentials = () => {
  return (
    <div style={{ width: '100%', marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '0' }}>
      {/* Credentials card */}
      <div
        style={{
          padding: '18px 20px',
          borderRadius: '10px',
          border: '1px solid rgba(227, 186, 84, 0.3)',
          background: 'linear-gradient(135deg, rgba(9,36,33,0.06) 0%, rgba(227,186,84,0.06) 100%)',
          width: '100%',
        }}
      >
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #092421, #1a5c47)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e3ba54" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <p style={{ fontSize: '12px', fontWeight: 600, color: '#092421', margin: 0, letterSpacing: '0.02em' }}>
            Test Credentials
          </p>
        </div>

        {/* Credential rows */}
        <div
          style={{
            background: 'rgba(255,255,255,0.7)',
            borderRadius: '8px',
            border: '1px solid rgba(9,36,33,0.1)',
            padding: '10px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {[
            { label: 'Email', value: 'admin@oasistech.com' },
            { label: 'Password', value: 'OasisTest@2026' },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 500 }}>{label}</span>
              <span
                style={{
                  fontFamily: '"SF Mono", Menlo, Consolas, monospace',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#092421',
                  background: 'rgba(9,36,33,0.06)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: '10px', color: '#9ca3af', marginTop: '10px', marginBottom: 0, textAlign: 'center' }}>
          Or create your own account above
        </p>
      </div>

      {/* Doha Oasis footer banner */}
      <div
        style={{
          marginTop: '24px',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(227, 186, 84, 0.2)',
          boxShadow: '0 4px 20px rgba(9, 36, 33, 0.18)',
          position: 'relative',
        }}
      >
        <img
          src="/foot.jpg"
          alt="Doha Oasis — Your all-in-one destination at the Heart of Doha"
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            maxHeight: '80px',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
        {/* Subtle inner vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(9,36,33,0.15) 0%, transparent 30%, transparent 70%, rgba(9,36,33,0.15) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  )
}

export default TestCredentials
