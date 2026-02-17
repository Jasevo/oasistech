'use client'

import React from 'react'

const TestCredentials = () => {
  return (
    <div
      style={{
        marginTop: '24px',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb',
        width: '100%',
      }}
    >
      <p
        style={{
          fontSize: '13px',
          fontWeight: 600,
          color: '#092421',
          marginBottom: '12px',
          textAlign: 'center',
        }}
      >
        Test Credentials
      </p>
      <div style={{ fontSize: '13px', color: '#374151', lineHeight: '1.8' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#6b7280' }}>Email:</span>
          <span style={{ fontFamily: 'monospace', fontWeight: 500 }}>admin@oasistech.co.za</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#6b7280' }}>Password:</span>
          <span style={{ fontFamily: 'monospace', fontWeight: 500 }}>OasisTest2024!</span>
        </div>
      </div>
      <p
        style={{
          fontSize: '11px',
          color: '#9ca3af',
          marginTop: '12px',
          textAlign: 'center',
        }}
      >
        Or create your own account above
      </p>
    </div>
  )
}

export default TestCredentials
