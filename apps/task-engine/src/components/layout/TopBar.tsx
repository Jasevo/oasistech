'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface TopBarProps {
  userName?: string
}

export function TopBar({ userName = 'Admin' }: TopBarProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="sticky top-0 z-40 bg-oasis-primary border-b border-oasis-primary/30">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo.png"
            alt="Doha Oasis"
            width={160}
            height={32}
            className="h-7 w-auto"
            priority
          />
        </Link>

        {/* Search + User */}
        <div className="flex items-center gap-3">
          {/* Search toggle */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <input
                  type="text"
                  placeholder="Search tasks... (Ctrl+K)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 text-white placeholder-white/40 text-sm px-3 py-1.5 rounded-lg border border-white/10 focus:border-oasis-accent/50 focus:outline-none"
                  autoFocus
                />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Toggle search"
          >
            {searchOpen ? <X className="w-4.5 h-4.5" /> : <Search className="w-4.5 h-4.5" />}
          </button>

          {/* User badge */}
          <div className="flex items-center gap-2 pl-3 border-l border-white/10">
            <div className="w-7 h-7 rounded-full bg-oasis-accent/20 border border-oasis-accent/40 flex items-center justify-center">
              <span className="text-oasis-accent text-xs font-semibold">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-white/80 text-sm font-medium hidden lg:block">{userName}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
