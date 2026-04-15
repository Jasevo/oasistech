'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Search, X, ChevronDown, Sparkles, CheckSquare, FolderOpen,
  Settings, LayoutDashboard, Shield, LogOut, User,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAI } from '@/context/AIContext'
import { useLanguage } from '@/context/LanguageContext'

interface SearchResult {
  id: string
  title?: string
  name?: string
  status: string
  priority?: string
  type: 'task' | 'project'
}

interface TopBarProps {
  userName?: string
}

const STATUS_COLORS: Record<string, string> = {
  todo: 'bg-gray-200 text-gray-600',
  'in-progress': 'bg-blue-100 text-blue-600',
  completed: 'bg-emerald-100 text-emerald-600',
  active: 'bg-emerald-100 text-emerald-600',
  archived: 'bg-gray-200 text-gray-500',
}

const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'text-red-500',
  high: 'text-orange-500',
  medium: 'text-yellow-500',
  low: 'text-gray-400',
}

export function TopBar({ userName = 'Admin' }: TopBarProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<{ tasks: SearchResult[]; projects: SearchResult[] }>({ tasks: [], projects: [] })
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const { open: openAI } = useAI()
  const { lang, toggleLanguage, t } = useLanguage()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults({ tasks: [], projects: [] })
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data)
    } catch {
      setResults({ tasks: [], projects: [] })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(searchQuery), 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [searchQuery, search])

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setFocused(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function openSearch() {
    setSearchOpen(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  function closeSearch() {
    setSearchOpen(false)
    setSearchQuery('')
    setResults({ tasks: [], projects: [] })
    setFocused(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') closeSearch()
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/tasks?search=${encodeURIComponent(searchQuery.trim())}`)
      closeSearch()
    }
  }

  const hasResults = results.tasks.length > 0 || results.projects.length > 0
  const showDropdown = focused && searchQuery.length >= 2

  const userMenuItems = [
    { icon: LayoutDashboard, label: lang === 'ar' ? 'لوحة التحكم'  : 'Dashboard',   href: '/' },
    { icon: User,            label: lang === 'ar' ? 'الملف الشخصي' : 'Profile',     href: '/admin/account' },
    { icon: Settings,        label: lang === 'ar' ? 'الإعدادات'    : 'Settings',    href: '/admin' },
    { icon: Shield,          label: lang === 'ar' ? 'لوحة المشرف'  : 'Admin Panel', href: '/admin' },
  ]

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
          <div ref={searchContainerRef} className="relative flex items-center">
            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 260, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder={t('search')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onKeyDown={handleKeyDown}
                      className="w-full bg-white/10 text-white placeholder-white/40 text-sm px-4 py-2 rounded-xl border border-white/10 focus:border-oasis-accent/50 focus:outline-none focus:ring-1 focus:ring-oasis-accent/20"
                    />
                    {loading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-oasis-accent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results dropdown — outside the animated div so it's never clipped */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-10 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[60] max-h-80 overflow-y-auto"
                >
                        {!hasResults && !loading && (
                          <div className="px-4 py-3 text-sm text-gray-400 text-center">
                            {lang === 'ar' ? 'لا توجد نتائج' : 'No results found'}
                          </div>
                        )}

                        {results.tasks.length > 0 && (
                          <div>
                            <div className="px-3 pt-2 pb-1">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                {lang === 'ar' ? 'المهام' : 'Tasks'}
                              </span>
                            </div>
                            {results.tasks.map((task) => (
                              <Link
                                key={task.id}
                                href={`/tasks/${task.id}`}
                                onClick={closeSearch}
                                className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors group"
                              >
                                <CheckSquare className={`w-3.5 h-3.5 shrink-0 ${PRIORITY_COLORS[task.priority ?? 'low']}`} />
                                <span className="flex-1 text-sm text-gray-800 truncate group-hover:text-oasis-primary">
                                  {task.title}
                                </span>
                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${STATUS_COLORS[task.status] ?? 'bg-gray-100 text-gray-500'}`}>
                                  {task.status === 'in-progress'
                                    ? (lang === 'ar' ? 'قيد التنفيذ' : 'In Progress')
                                    : task.status === 'todo'
                                    ? (lang === 'ar' ? 'للتنفيذ' : 'To Do')
                                    : (lang === 'ar' ? 'مكتمل' : 'Done')}
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}

                        {results.projects.length > 0 && (
                          <div>
                            <div className="px-3 pt-2 pb-1">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                {lang === 'ar' ? 'المشاريع' : 'Projects'}
                              </span>
                            </div>
                            {results.projects.map((proj) => (
                              <Link
                                key={proj.id}
                                href={`/projects/${proj.id}`}
                                onClick={closeSearch}
                                className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors group"
                              >
                                <FolderOpen className="w-3.5 h-3.5 shrink-0 text-oasis-accent" />
                                <span className="flex-1 text-sm text-gray-800 truncate group-hover:text-oasis-primary">
                                  {proj.name}
                                </span>
                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${STATUS_COLORS[proj.status] ?? 'bg-gray-100 text-gray-500'}`}>
                                  {proj.status === 'active'
                                    ? (lang === 'ar' ? 'نشط' : 'Active')
                                    : (lang === 'ar' ? 'مؤرشف' : 'Archived')}
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}

                        {hasResults && (
                          <div className="border-t border-gray-100 px-3 py-2">
                            <button
                              onClick={() => {
                                router.push(`/tasks?search=${encodeURIComponent(searchQuery.trim())}`)
                                closeSearch()
                              }}
                              className="text-xs text-oasis-primary font-semibold hover:underline"
                            >
                              {lang === 'ar'
                                ? `عرض كل نتائج "${searchQuery}"`
                                : `View all results for "${searchQuery}"`}
                            </button>
                          </div>
                        )}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={searchOpen ? closeSearch : openSearch}
              className="p-2.5 text-white/60 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-200"
              aria-label="Toggle search"
            >
              {searchOpen ? <X className="w-[18px] h-[18px]" /> : <Search className="w-[18px] h-[18px]" />}
            </button>
          </div>

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
            <span className="absolute inset-0 rounded-xl animate-pulse opacity-30 bg-oasis-accent" />
            <motion.span
              className="absolute inset-0 rounded-xl"
              style={{
                background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
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

          {/* User badge + dropdown */}
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setUserMenuOpen((v) => !v)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-all duration-200 group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-oasis-accent to-oasis-accent-light flex items-center justify-center shadow-lg shadow-oasis-accent/20">
                <span className="text-oasis-primary text-sm font-bold">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-white/90 text-sm font-medium hidden lg:block">{userName}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-white/40 hidden lg:block transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* User dropdown */}
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                >
                  {/* Header */}
                  <div className="px-4 py-3 bg-gradient-to-r from-oasis-primary/5 to-oasis-accent/5 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-oasis-accent to-oasis-accent-light flex items-center justify-center shadow-sm">
                        <span className="text-oasis-primary text-sm font-bold">{userName.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{userName}</p>
                        <p className="text-[11px] text-gray-400">{lang === 'ar' ? 'مشرف' : 'Administrator'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-1.5">
                    {userMenuItems.map(({ icon: Icon, label, href }) => (
                      <Link
                        key={label}
                        href={href}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-oasis-primary transition-colors"
                      >
                        <Icon className="w-4 h-4 text-gray-400 group-hover:text-oasis-primary" />
                        {label}
                      </Link>
                    ))}
                  </div>

                  {/* Sign out */}
                  <div className="border-t border-gray-100 py-1.5">
                    <Link
                      href="/admin/logout"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {lang === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </header>
  )
}
