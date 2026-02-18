'use client'

import React from 'react'
import '@/app/(payload)/admin/custom.css'

const NavLogo = () => {
  return (
    <div
      style={{
        padding: '0 16px 14px',
        marginBottom: '4px',
        borderBottom: '1px solid rgba(227, 186, 84, 0.1)',
      }}
    >
      <a
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
        }}
      >
        <img
          src="/logo.png"
          alt="Doha Oasis"
          style={{
            height: '22px',
            width: 'auto',
            display: 'block',
          }}
        />
      </a>
    </div>
  )
}

export default NavLogo
