'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Plus, Eye, RefreshCw } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface ActivityItem {
  type: 'task' | 'visit'
  action: string
  label: string
  timestamp: string
  href: string | null
}

function getRelativeTime(timestamp: string): string {
  const diffMs = Date.now() - new Date(timestamp).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  return `${diffDays}d ago`
}

const ACTION_ICON: Record<string, React.ElementType> = {
  'created a task':   Plus,
  'completed a task': CheckCircle2,
  'updated a task':   RefreshCw,
}

const ACTION_COLOR: Record<string, string> = {
  'created a task':   'from-blue-400 to-blue-600',
  'completed a task': 'from-emerald-400 to-emerald-600',
  'updated a task':   'from-oasis-accent to-amber-500',
}

export function TeamActivityCard() {
  const { t } = useLanguage()
  const [items, setItems] = useState<ActivityItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetch('/api/activity')
      .then((r) => r.json())
      .then(setItems)
      .catch(() => {})
  }, [])

  return (
    <div className="glass-card rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="bg-gradient-to-r from-oasis-primary-light to-oasis-green p-5">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">{t('teamActivity')}</h2>
      </div>

      <div className="p-5 space-y-3.5">
        {items.length === 0 ? (
          /* skeleton while loading */
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-2.5 bg-gray-100 rounded w-1/3" />
              </div>
            </div>
          ))
        ) : (
          items.slice(0, 4).map((item, i) => {
            const isVisit = item.type === 'visit'
            const Icon = isVisit ? Eye : (ACTION_ICON[item.action] || RefreshCw)
            const gradient = isVisit ? 'from-gray-300 to-gray-400' : (ACTION_COLOR[item.action] || 'from-oasis-accent to-amber-500')

            return (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-sm`}>
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900 leading-snug">
                    <span className="font-semibold">Admin</span>{' '}
                    <span className="text-gray-600">{item.action}</span>
                  </p>
                  {item.label && (
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">{item.label}</p>
                  )}
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {mounted ? getRelativeTime(item.timestamp) : '—'}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="px-5 pb-5">
        <Link
          href="/activity"
          className="flex items-center justify-center gap-1 text-xs font-semibold text-gray-500 hover:text-oasis-primary transition-colors py-2 rounded-lg hover:bg-white/40"
        >
          {t('viewMore')} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
