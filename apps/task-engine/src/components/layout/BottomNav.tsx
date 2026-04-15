'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, CheckSquare, FolderKanban, Eye, Settings } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const navItems = [
    { href: '/',         labelKey: 'home',      icon: LayoutDashboard },
    { href: '/tasks',    labelKey: 'tasks',     icon: CheckSquare },
    { href: '/projects', labelKey: 'projects',  icon: FolderKanban },
    { href: '/visitors', labelKey: 'visitors',  icon: Eye },
    { href: '/settings', labelKey: 'more',      icon: Settings },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-oasis-primary border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-1 min-w-[48px] min-h-[48px] rounded-xl transition-all duration-200
                ${active ? 'text-oasis-accent' : 'text-white/50 hover:text-white/80'}`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${active ? 'bg-oasis-accent/15' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium">{t(item.labelKey)}</span>
              {active && <div className="absolute -top-0 w-8 h-0.5 rounded-full bg-oasis-accent" />}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
