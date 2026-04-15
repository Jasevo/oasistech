'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, X, ChevronDown, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAI } from '@/context/AIContext'
import { useLanguage } from '@/context/LanguageContext'

interface TopBarProps {
  userName?: string
}

export function TopBar({ userName = 'Admin' }: TopBarProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { open: openAI } = useAI()
  const { lang, toggleLanguage, t } = useLanguage()

  return (
    <header className="sticky top-0 z-40 bg-oasis-primary border-b border-oasis-primary/30">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/logo.png"
            alt="OasisTech"
            width={110}
            height={22}
            className="h-6 w-auto"
            priority
            quality={90}
          />
        </Link>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 260, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <input
                  type="text"
                  placeholder={t('search')}
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

          {/* Arabic / English toggle */}
          <button
            onClick={toggleLanguage}
            title={lang === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
            className="flex items-center justify-center h-8 px-2.5 rounded-xl border border-white/15 hover:border-oasis-accent/40 hover:bg-white/10 transition-all duration-200 shrink-0"
          >
            <span className="text-[11px] font-bold text-white/70 hover:text-white leading-none tracking-wider">
              {lang === 'en' ? 'AR' : 'EN'}
            </span>
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-white/10 mx-0.5" />

          {/* ASK AI — glowing animated button */}
          <motion.button
            onClick={() => openAI('Dashboard')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-oasis-primary text-sm font-bold overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #e3ba54 0%, #f0d078 50%, #e3ba54 100%)' }}
          >
            {/* Animated glow ring */}
            <span className="absolute inset-0 rounded-xl animate-pulse opacity-30 bg-oasis-accent" />
            {/* Shimmer sweep */}
            <motion.span
              className="absolute inset-0 rounded-xl"
              style={{
                background:
                  'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
                backgroundSize: '200% 100%',
              }}
              animate={{ backgroundPosition: ['200% 0', '-100% 0'] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
            />
            <Sparkles className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10 hidden sm:inline">{t('askAI')}</span>
          </motion.button>

          {/* Divider */}
          <div className="w-px h-8 bg-white/10 mx-0.5" />

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
