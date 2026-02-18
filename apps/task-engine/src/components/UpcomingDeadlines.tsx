'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Clock, AlertTriangle, CalendarDays } from 'lucide-react'

interface UpcomingDeadlinesProps {
  tasks: Array<{
    id: string
    title: string
    dueDate: string
    priority: string
  }>
}

export function UpcomingDeadlines({ tasks }: UpcomingDeadlinesProps) {
  const now = new Date()

  function getDaysUntil(dateStr: string) {
    const due = new Date(dateStr)
    const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  function getUrgencyStyle(days: number) {
    if (days < 0) return { bg: 'bg-red-50', text: 'text-red-600', label: 'Overdue' }
    if (days === 0) return { bg: 'bg-amber-50', text: 'text-amber-600', label: 'Today' }
    if (days === 1) return { bg: 'bg-amber-50', text: 'text-amber-600', label: 'Tomorrow' }
    if (days <= 3) return { bg: 'bg-oasis-accent/10', text: 'text-oasis-accent', label: `${days}d left` }
    return { bg: 'bg-gray-100', text: 'text-gray-500', label: `${days}d left` }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="glass-card rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      whileHover={{ scale: 1.01 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-700 to-purple-500 p-6">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-white/80" />
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            Upcoming Deadlines
          </h2>
        </div>
      </div>

      {/* Deadline items */}
      <div className="p-6 space-y-3">
        {tasks.length > 0 ? (
          tasks.map((task) => {
            const days = getDaysUntil(task.dueDate)
            const urgency = getUrgencyStyle(days)
            return (
              <Link
                key={task.id}
                href={`/tasks/${task.id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/40 transition-colors group"
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${urgency.bg}`}>
                  {days < 0 ? (
                    <AlertTriangle className={`w-4 h-4 ${urgency.text}`} />
                  ) : (
                    <Clock className={`w-4 h-4 ${urgency.text}`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-gray-900 truncate block">{task.title}</span>
                  <span className="text-[11px] text-gray-400">
                    {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${urgency.bg} ${urgency.text}`}>
                  {urgency.label}
                </span>
              </Link>
            )
          })
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No upcoming deadlines</p>
        )}
      </div>
    </motion.div>
  )
}
