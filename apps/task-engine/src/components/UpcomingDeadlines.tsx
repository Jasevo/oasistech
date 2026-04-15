'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Clock, AlertTriangle, CalendarDays } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface UpcomingDeadlinesProps {
  tasks: Array<{ id: string; title: string; dueDate: string; priority: string }>
}

function getDaysUntil(dateStr: string, now: Date) {
  const due = new Date(dateStr)
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function UpcomingDeadlines({ tasks }: UpcomingDeadlinesProps) {
  const { t, lang } = useLanguage()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const now = new Date()

  function getUrgencyStyle(days: number) {
    if (days < 0)  return { bg: 'bg-red-50',            text: 'text-red-600',    label: lang === 'ar' ? 'متأخر'    : 'Overdue'  }
    if (days === 0) return { bg: 'bg-amber-50',          text: 'text-amber-600',  label: lang === 'ar' ? 'اليوم'    : 'Today'    }
    if (days === 1) return { bg: 'bg-amber-50',          text: 'text-amber-600',  label: lang === 'ar' ? 'غداً'     : 'Tomorrow' }
    if (days <= 3)  return { bg: 'bg-oasis-accent/10',   text: 'text-oasis-accent', label: lang === 'ar' ? `${days} أيام` : `${days}d left` }
    return              { bg: 'bg-gray-100',             text: 'text-gray-500',   label: lang === 'ar' ? `${days} أيام` : `${days}d left` }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="glass-card rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="bg-gradient-to-r from-violet-700 to-purple-500 p-5">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-white/80" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">{t('upcomingDeadlines')}</h2>
        </div>
      </div>

      <div className="p-5 space-y-3">
        {tasks.length > 0 ? (
          tasks.map((task) => {
            const days    = mounted ? getDaysUntil(task.dueDate, now) : 0
            const urgency = mounted ? getUrgencyStyle(days) : { bg: 'bg-gray-100', text: 'text-gray-500', label: '\u00A0' }
            return (
              <Link
                key={task.id}
                href={`/tasks/${task.id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/40 transition-colors group"
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${urgency.bg}`}>
                  {mounted && days < 0
                    ? <AlertTriangle className={`w-4 h-4 ${urgency.text}`} />
                    : <Clock className={`w-4 h-4 ${urgency.text}`} />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-gray-900 truncate block">{task.title}</span>
                  <span className="text-[11px] text-gray-400">
                    {new Date(task.dueDate).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${urgency.bg} ${urgency.text}`}>
                  {urgency.label}
                </span>
              </Link>
            )
          })
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            {lang === 'ar' ? 'لا توجد مواعيد قادمة' : 'No upcoming deadlines'}
          </p>
        )}
      </div>
    </motion.div>
  )
}
