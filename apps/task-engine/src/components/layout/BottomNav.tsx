'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Activity,
  Settings,
} from 'lucide-react'

const navItems = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/activity', label: 'Activity', icon: Activity },
  { href: '/settings', label: 'More', icon: Settings },
]

export function BottomNav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[44px] min-h-[44px] rounded-lg transition-colors
                ${active ? 'text-oasis-primary' : 'text-gray-400'}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
              {active && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-oasis-accent" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
