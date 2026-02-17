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
}

function StatCard({ label, value, icon: Icon, accent, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className={`bg-white rounded-xl border p-5 ${
        accent ? 'border-l-4 border-l-oasis-accent border-gray-200' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-oasis-primary/5 flex items-center justify-center">
          <Icon className="w-5 h-5 text-oasis-primary" />
        </div>
      </div>
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
  const stats = [
    { label: 'Total Tasks', value: total, icon: ListChecks, accent: true },
    { label: 'To Do', value: todo, icon: CircleDot, accent: false },
    { label: 'In Progress', value: inProgress, icon: Clock, accent: false },
    { label: 'Completed', value: completed, icon: CheckSquare, accent: true },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={stat.label} index={index} {...stat} />
      ))}
    </div>
  )
}
