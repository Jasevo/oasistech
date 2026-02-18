'use client'

import React from 'react'

const DashboardBanner = () => {
  return (
    <div
      style={{
        borderRadius: '14px',
        overflow: 'hidden',
        position: 'relative',
        marginBottom: '28px',
        border: '1px solid rgba(227, 186, 84, 0.15)',
        boxShadow: '0 2px 12px rgba(9, 36, 33, 0.08)',
      }}
    >
      {/* Background image */}
      <div
        style={{
          background: 'linear-gradient(135deg, #092421 0%, #1a5c47 60%, #092421 100%)',
          padding: '28px 32px',
          position: 'relative',
        }}
      >
        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <img
              src="/logo.png"
              alt="Doha Oasis"
              style={{ height: '20px', width: 'auto', opacity: 0.9 }}
            />
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(227, 186, 84, 0.7)',
                background: 'rgba(227, 186, 84, 0.1)',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid rgba(227, 186, 84, 0.15)',
              }}
            >
              Admin Panel
            </span>
          </div>
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#ffffff',
              margin: '0 0 4px',
              letterSpacing: '-0.01em',
            }}
          >
            Task Engine Administration
          </h2>
          <p
            style={{
              fontSize: '13px',
              color: 'rgba(232, 245, 243, 0.55)',
              margin: 0,
              lineHeight: '1.5',
            }}
          >
            Manage tasks, projects, and users for Doha Oasis operations.
          </p>
        </div>

        {/* Gold accent line at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent 0%, #e3ba54 50%, transparent 100%)',
          }}
        />
      </div>
    </div>
  )
}

export default DashboardBanner
