'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Flame, AlertTriangle, ArrowUp, Minus } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface PriorityTask {
  id: string
  title: string
  status: string
  priority?: string
}

interface TopPrioritiesProps {
  tasks: PriorityTask[]
}

const PRIORITY_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; color: string; bg: string; dot: string }
> = {
  urgent: { label: 'Urgent', icon: Flame,         color: 'text-red-600',    bg: 'bg-red-50',      dot: 'bg-red-500' },
  high:   { label: 'High',   icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50',   dot: 'bg-orange-400' },
  medium: { label: 'Medium', icon: ArrowUp,       color: 'text-blue-600',   bg: 'bg-blue-50',     dot: 'bg-blue-400' },
  low:    { label: 'Low',    icon: Minus,         color: 'text-gray-500',   bg: 'bg-gray-50',     dot: 'bg-gray-300' },
}

export function TopPriorities({ tasks }: TopPrioritiesProps) {
  const { t } = useLanguage()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="glass-card rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-oasis-primary to-oasis-green p-5">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">{t('topPriorities')}</h2>
      </div>

      {/* Priority items */}
      <div className="p-5 space-y-2">
        {tasks.length > 0 ? (
          tasks.map((task, i) => {
            const pKey = (task.priority as string) || 'low'
            const cfg = PRIORITY_CONFIG[pKey] ?? PRIORITY_CONFIG.low
            const Icon = cfg.icon
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.07 }}
              >
                <Link
                  href={`/tasks/${task.id}`}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/60 transition-colors group"
                >
                  <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4 h-4 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate font-medium">{task.title}</p>
                    <p className={`text-[11px] font-semibold ${cfg.color} mt-0.5`}>{cfg.label}</p>
                  </div>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                </Link>
              </motion.div>
            )
          })
        ) : (
          <p className="text-sm text-gray-400 text-center py-6">{t('noOpenTasks')}</p>
        )}
      </div>

      <div className="px-5 pb-5">
        <Link
          href="/tasks?sort=-priority"
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-oasis-primary to-oasis-green text-white hover:opacity-90 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 shadow-lg"
        >
          {t('manageTasks')} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  )
}
