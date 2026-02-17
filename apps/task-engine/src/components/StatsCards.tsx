'use client'

import { motion } from 'framer-motion'
import { CheckSquare, Clock, CircleDot, ListChecks } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number
  icon: LucideIcon
  accent?: boolean
  index: number
  subtitle?: string
  gradientClass?: string
  progressPercent?: number
}

function StatCard({ label, value, icon: Icon, accent, index, subtitle, gradientClass, progressPercent }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className={`bg-gradient-to-br ${gradientClass || 'from-white to-gray-50'} rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow duration-200 ${
        accent ? 'border-l-[3px] border-l-oasis-accent border-gray-200' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-4xl lg:text-5xl font-bold text-gray-900 mt-2 tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="w-14 h-14 rounded-xl bg-oasis-primary/5 ring-1 ring-oasis-primary/10 flex items-center justify-center">
          <Icon className="w-7 h-7 text-oasis-primary" />
        </div>
      </div>
      {progressPercent !== undefined && (
        <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-oasis-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </div>
      )}
    </motion.div>
  )
}

interface StatsCardsProps {
  total: number
  todo: number
  inProgress: number
  completed: number
}

export function StatsCards({ total, todo, inProgress, completed }: StatsCardsProps) {
  const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0

  const stats = [
    { label: 'Total Tasks', value: total, icon: ListChecks, accent: true,
      gradientClass: 'from-white to-oasis-primary/[0.03]' },
    { label: 'To Do', value: todo, icon: CircleDot, accent: false,
      subtitle: total > 0 ? `${Math.round((todo / total) * 100)}% of total` : undefined },
    { label: 'In Progress', value: inProgress, icon: Clock, accent: false,
      subtitle: total > 0 ? `${Math.round((inProgress / total) * 100)}% of total` : undefined },
    { label: 'Completed', value: completed, icon: CheckSquare, accent: true,
      gradientClass: 'from-white to-oasis-accent/[0.06]',
      subtitle: `${completionPct}% completion rate`,
      progressPercent: completionPct },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={stat.label} index={index} {...stat} />
      ))}
    </div>
  )
}
