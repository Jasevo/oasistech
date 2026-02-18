'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, X, ChevronDown } from 'lucide-react'
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
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/logo.png"
            alt="Doha Oasis"
            width={160}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Search + User */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 text-white placeholder-white/40 text-sm px-4 py-2 rounded-xl border border-white/10 focus:border-oasis-accent/50 focus:outline-none focus:ring-1 focus:ring-oasis-accent/20"
                  autoFocus
                />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2.5 text-white/60 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-200"
            aria-label="Toggle search"
          >
            {searchOpen ? <X className="w-[18px] h-[18px]" /> : <Search className="w-[18px] h-[18px]" />}
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-white/10 mx-1" />

          {/* User badge */}
          <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-all duration-200 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-oasis-accent to-oasis-accent-light flex items-center justify-center shadow-lg shadow-oasis-accent/20">
              <span className="text-oasis-primary text-sm font-bold">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-white/90 text-sm font-medium hidden lg:block">{userName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-white/40 hidden lg:block group-hover:text-white/60 transition-colors" />
          </button>
        </div>
      </div>
    </header>
  )
}
