'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export function PageTracker() {
  const pathname = usePathname()
  const lastTracked = useRef<string | null>(null)

  useEffect(() => {
    // Don't track admin or API routes, and avoid double-tracking same path
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) return
    if (lastTracked.current === pathname) return
    lastTracked.current = pathname

    fetch('/api/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: pathname }),
    }).catch(() => {/* silent fail */})
  }, [pathname])

  return null
}
