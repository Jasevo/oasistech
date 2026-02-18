'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, AlertTriangle, Circle, Loader2, CheckCircle2 } from 'lucide-react'
import { StatusBadge } from './ui/StatusBadge'
import { PriorityBadge } from './ui/PriorityBadge'

interface TaskCardProps {
  task: {
    id: string
    title: string
    description?: string | null
    status: 'todo' | 'in-progress' | 'completed'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    dueDate?: string | null
    project?: { id: string; name: string; color: string } | string | null
    createdAt: string
  }
  index: number
}

const statusIcons = {
  todo: { Icon: Circle, bg: 'bg-gray-100', color: 'text-gray-400' },
  'in-progress': { Icon: Loader2, bg: 'bg-oasis-accent/10', color: 'text-oasis-accent' },
  completed: { Icon: CheckCircle2, bg: 'bg-emerald-50', color: 'text-emerald-600' },
}

export function TaskCard({ task, index }: TaskCardProps) {
  const isOverdue =
    task.dueDate &&
    task.status !== 'completed' &&
    new Date(task.dueDate) < new Date()

  const projectName =
    task.project && typeof task.project === 'object' ? task.project.name : null
  const projectColor =
    task.project && typeof task.project === 'object' ? task.project.color : null

  const { Icon: StatusIcon, bg: statusBg, color: statusColor } = statusIcons[task.status] || statusIcons.todo

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link href={`/tasks/${task.id}`} className="block group">
        <article className="glass-card rounded-xl p-4 hover:shadow-lg hover:bg-white/85 transition-all duration-200 hover:-translate-y-0.5">
          <div className="flex items-start gap-3">
            {/* Status icon */}
            <div className={`w-9 h-9 rounded-xl ${statusBg} flex items-center justify-center shrink-0 mt-0.5`}>
              <StatusIcon className={`w-[18px] h-[18px] ${statusColor}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-oasis-primary transition-colors line-clamp-1">
                  {task.title}
                </h3>
                <StatusBadge status={task.status} />
              </div>

              {task.description && (
                <p className="mt-1 text-xs text-gray-500 line-clamp-1">{task.description}</p>
              )}

              <div className="mt-2 flex items-center flex-wrap gap-1.5">
                <PriorityBadge priority={task.priority} />

                {projectName && (
                  <span className={`text-[11px] px-2 py-0.5 rounded-full bg-${projectColor}-100 text-${projectColor}-700 font-medium`}>
                    {projectName}
                  </span>
                )}

                {task.dueDate && (
                  <span className={`flex items-center gap-1 text-[11px] ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-400'}`}>
                    {isOverdue && <AlertTriangle className="w-3 h-3" />}
                    <Calendar className="w-3 h-3" />
                    {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}

                <span className="text-[11px] text-gray-400 ml-auto">
                  {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}
