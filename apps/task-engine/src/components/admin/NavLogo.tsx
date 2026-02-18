'use client'

import React from 'react'
import '@/app/(payload)/admin/custom.css'

const NavLogo = () => {
  return (
    <div
      style={{
        padding: '4px 16px 16px',
        marginBottom: '10px',
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
