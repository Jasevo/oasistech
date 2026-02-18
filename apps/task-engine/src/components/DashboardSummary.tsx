'use client'

import { motion } from 'framer-motion'
import { CompletionRing } from './charts/CompletionRing'
import { Target, Clock, AlertCircle } from 'lucide-react'

interface DashboardSummaryProps {
  total: number
  completed: number
  inProgress: number
}

export function DashboardSummary({ total, completed, inProgress }: DashboardSummaryProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  const todo = total - completed - inProgress
  const todoPct = total > 0 ? Math.round((todo / total) * 100) : 0
  const inProgressPct = total > 0 ? Math.round((inProgress / total) * 100) : 0

  const progressItems = [
    {
      icon: Target,
      label: 'Tasks Done',
      value: `${completed} / ${total}`,
      percent: percentage,
      color: 'bg-emerald-500',
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
    },
    {
      icon: AlertCircle,
      label: 'To Do Tasks',
      value: String(todo),
      percent: todoPct,
      color: 'bg-oasis-accent',
      iconColor: 'text-oasis-accent',
      iconBg: 'bg-oasis-accent/10',
    },
    {
      icon: Clock,
      label: 'In Progress Tasks',
      value: String(inProgress),
      percent: inProgressPct,
      color: 'bg-blue-500',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
    },
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass-card rounded-2xl p-6 lg:p-8"
    >
      <h2 className="text-base font-bold text-gray-900 mb-6">Progress Overview</h2>
      <div className="flex flex-col sm:flex-row items-center gap-8">
        <CompletionRing percentage={percentage} />
        <div className="flex-1 w-full space-y-5">
          {progressItems.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${item.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-900">
                      <span className="font-bold">{item.value}</span>{' '}
                      <span className="text-gray-500 font-normal">{item.label}</span>
                    </span>
                    <span className="text-xs font-semibold text-gray-500">{item.percent}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${item.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percent}%` }}
                      transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}
