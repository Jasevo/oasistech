'use client'

import React from 'react'
import '@/app/(payload)/admin/custom.css'

const TestCredentials = () => {
  return (
    <div className="test-credentials-wrapper">
      {/* Credentials card */}
      <div className="test-credentials-card">
        {/* Header row */}
        <div className="test-credentials-header">
          <div className="test-credentials-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e3ba54" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <p className="test-credentials-title">
            Test Credentials
          </p>
        </div>

        {/* Credential rows */}
        <div className="test-credentials-values">
          {[
            { label: 'Email', value: 'admin@oasistech.com' },
            { label: 'Password', value: 'OasisTest@2026' },
          ].map(({ label, value }) => (
            <div key={label} className="test-credentials-row">
              <span className="test-credentials-label">{label}</span>
              <span className="test-credentials-value">{value}</span>
            </div>
          ))}
        </div>

      </div>

      {/* Doha Oasis footer banner */}
      <div className="test-credentials-footer">
        <img
          src="/foot.jpg"
          alt="Doha Oasis — Your all-in-one destination at the Heart of Doha"
          className="test-credentials-footer-img"
        />
        {/* Subtle inner vignette */}
        <div className="test-credentials-footer-vignette" />
      </div>
    </div>
  )
}

export default TestCredentials
