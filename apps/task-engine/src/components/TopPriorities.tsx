'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle2, ArrowRight } from 'lucide-react'

interface TopPrioritiesProps {
  tasks: Array<{
    id: string
    title: string
    status: string
  }>
}

export function TopPriorities({ tasks }: TopPrioritiesProps) {
  const priorityTasks = tasks.slice(0, 3)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="glass-card rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      whileHover={{ scale: 1.01 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-oasis-primary to-oasis-green p-6">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider">
          Top Priorities
        </h2>
      </div>

      {/* Priority items */}
      <div className="p-6 space-y-3">
        {priorityTasks.length > 0 ? (
          priorityTasks.map((task) => (
            <Link
              key={task.id}
              href={`/tasks/${task.id}`}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/40 transition-colors group"
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                task.status === 'completed'
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-oasis-accent/10 text-oasis-accent'
              }`}>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-sm text-gray-900 truncate flex-1">{task.title}</span>
              <span className="text-gray-300 group-hover:text-gray-500 transition-colors">
                {task.status === 'completed' ? '✓' : ''}
              </span>
            </Link>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No priority tasks</p>
        )}
      </div>

      <div className="px-6 pb-6">
        <Link
          href="/tasks"
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-oasis-primary to-oasis-green text-white hover:opacity-90 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 shadow-lg"
        >
          Manage Tasks <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  )
}
