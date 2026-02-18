'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Users,
  BarChart3,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/activity', label: 'Activity', icon: Activity },
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  taskCount?: number
}

export function Sidebar({ taskCount }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 240 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="hidden md:flex flex-col bg-oasis-primary-light border-r border-white/10 h-full relative"
    >
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                ${active
                  ? 'bg-oasis-accent/20 text-oasis-accent shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/8'
                }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
                active
                  ? 'bg-oasis-accent/20'
                  : 'bg-transparent group-hover:bg-white/5'
              }`}>
                <Icon className="w-[18px] h-[18px]" />
              </div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {item.href === '/tasks' && taskCount !== undefined && taskCount > 0 && !collapsed && (
                <span className="ml-auto text-[11px] bg-oasis-accent text-oasis-primary font-bold rounded-full px-2 py-0.5 min-w-[22px] text-center">
                  {taskCount}
                </span>
              )}
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 bg-oasis-accent rounded-r-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Admin button — pinned above collapse toggle */}
      <div className="px-3 py-4 border-t border-white/10">
        <Link
          href="/admin"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-white/50 hover:text-oasis-accent hover:bg-oasis-accent/10"
        >
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-transparent group-hover:bg-oasis-accent/10 transition-all duration-200">
            <ShieldCheck className="w-[18px] h-[18px]" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="text-sm font-medium whitespace-nowrap overflow-hidden"
              >
                Admin Panel
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-oasis-primary/90 border border-oasis-accent/30 rounded-full flex items-center justify-center text-oasis-accent hover:bg-oasis-accent hover:text-oasis-primary transition-all duration-200 z-10 shadow-md"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </motion.aside>
  )
}
