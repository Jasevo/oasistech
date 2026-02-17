'use client'

import { motion } from 'framer-motion'
import { CompletionRing } from './charts/CompletionRing'
import { Target, Zap } from 'lucide-react'

interface DashboardSummaryProps {
  total: number
  completed: number
  inProgress: number
}

export function DashboardSummary({ total, completed, inProgress }: DashboardSummaryProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Progress Overview</h2>
      <div className="flex flex-col sm:flex-row items-center gap-8">
        <CompletionRing percentage={percentage} />
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-oasis-accent/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-oasis-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{completed} of {total} tasks completed</p>
              <p className="text-xs text-gray-500">Keep going to reach your goals</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-oasis-primary/5 flex items-center justify-center">
              <Zap className="w-5 h-5 text-oasis-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{inProgress} tasks in progress</p>
              <p className="text-xs text-gray-500">Currently being worked on</p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
