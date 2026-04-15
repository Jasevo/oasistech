'use client'

import { motion } from 'framer-motion'
import { CheckSquare, Clock, CircleDot, ListChecks, TrendingUp, TrendingDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface StatCardProps {
  label: string
  value: number
  icon: LucideIcon
  index: number
  trendText?: string
  gradient: string
  textLight?: boolean
  trendIcon?: LucideIcon
  barPercent?: number
}

function StatCard({ label, value, icon: Icon, index, gradient, textLight = true, trendIcon: TrendIcon, trendText, barPercent = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-2xl p-5 lg:p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default ${gradient}`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
      <div className="absolute -right-2 -bottom-6 w-20 h-20 rounded-full bg-white/5" />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <p className={`text-xs font-semibold uppercase tracking-wider ${textLight ? 'text-white/80' : 'text-gray-700/80'}`}>
            {label}
          </p>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${textLight ? 'bg-white/15' : 'bg-black/5'}`}>
            <Icon className={`w-5 h-5 ${textLight ? 'text-white' : 'text-gray-700'}`} />
          </div>
        </div>
        <p className={`text-4xl lg:text-5xl font-bold mt-3 tracking-tight ${textLight ? 'text-white' : 'text-gray-900'}`}>
          {value}
        </p>
        {trendText && (
          <div className={`flex items-center gap-1.5 mt-2 ${textLight ? 'text-white/70' : 'text-gray-600'}`}>
            {TrendIcon && <TrendIcon className="w-3.5 h-3.5" />}
            <p className="text-xs font-medium">{trendText}</p>
          </div>
        )}
      </div>

      <div className={`absolute bottom-0 left-0 right-0 h-1 ${textLight ? 'bg-white/10' : 'bg-black/5'}`}>
        <motion.div
          className={`h-full ${textLight ? 'bg-white/30' : 'bg-black/10'}`}
          initial={{ width: 0 }}
          animate={{ width: `${barPercent}%` }}
          transition={{ duration: 1, delay: index * 0.1 + 0.3, ease: 'easeOut' }}
        />
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
  const { t } = useLanguage()
  const completionPct  = total > 0 ? Math.round((completed / total) * 100) : 0
  const todoPct        = total > 0 ? Math.round((todo / total) * 100) : 0
  const inProgressPct  = total > 0 ? Math.round((inProgress / total) * 100) : 0
  const activePct      = total > 0 ? Math.round(((todo + inProgress) / total) * 100) : 0

  const stats = [
    {
      label: t('totalTasks'),
      value: total,
      icon: ListChecks,
      gradient: 'stat-gradient-1',
      trendIcon: TrendingUp,
      trendText: total > 0 ? `${todo + inProgress} ${t('active_stat')}` : t('noTasksYet'),
      barPercent: activePct,
    },
    {
      label: t('todo'),
      value: todo,
      icon: CircleDot,
      gradient: 'stat-gradient-2',
      textLight: false,
      trendText: total > 0 ? `${todoPct}% ${t('ofTotal')}` : undefined,
      barPercent: todoPct,
    },
    {
      label: t('inProgress'),
      value: inProgress,
      icon: Clock,
      gradient: 'stat-gradient-3',
      trendText: total > 0 ? `${inProgressPct}% ${t('active_stat')}` : undefined,
      barPercent: inProgressPct,
    },
    {
      label: t('completed'),
      value: completed,
      icon: CheckSquare,
      gradient: 'stat-gradient-4',
      trendIcon: completionPct >= 50 ? TrendingUp : TrendingDown,
      trendText: `${completionPct}% ${t('completion')}`,
      barPercent: completionPct,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
      {stats.map((stat, index) => (
        <StatCard key={stat.label} index={index} {...stat} />
      ))}
    </div>
  )
}
