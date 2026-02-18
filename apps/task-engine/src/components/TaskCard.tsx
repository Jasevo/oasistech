'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, AlertTriangle, Circle, Loader2, CheckCircle2, FolderKanban } from 'lucide-react'

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

const statusConfig = {
  todo: {
    Icon: Circle,
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-400',
    accent: 'border-l-gray-300',
  },
  'in-progress': {
    Icon: Loader2,
    iconBg: 'bg-oasis-accent/10',
    iconColor: 'text-oasis-accent',
    accent: 'border-l-oasis-accent',
  },
  completed: {
    Icon: CheckCircle2,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    accent: 'border-l-emerald-400',
  },
} as const

const priorityConfig = {
  low: { label: 'Low', dot: 'bg-green-500', badge: 'bg-green-50 text-green-700' },
  medium: { label: 'Medium', dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700' },
  high: { label: 'High', dot: 'bg-orange-500', badge: 'bg-orange-50 text-orange-700' },
  urgent: { label: 'Urgent', dot: 'bg-red-500', badge: 'bg-red-50 text-red-700' },
} as const

const statusLabel = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  completed: 'Completed',
} as const

const statusBadge = {
  todo: 'bg-gray-100 text-gray-600',
  'in-progress': 'bg-oasis-accent/15 text-oasis-accent',
  completed: 'bg-emerald-50 text-emerald-700',
} as const

export function TaskCard({ task, index }: TaskCardProps) {
  const isOverdue =
    task.dueDate && task.status !== 'completed' && new Date(task.dueDate) < new Date()

  const projectName =
    task.project && typeof task.project === 'object' ? task.project.name : null

  const sc = statusConfig[task.status] ?? statusConfig.todo
  const pc = priorityConfig[task.priority] ?? priorityConfig.medium
  const { Icon: StatusIcon } = sc

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
    >
      <Link href={`/tasks/${task.id}`} className="block group">
        <article
          className={`glass-card rounded-xl p-4 border-l-4 ${sc.accent} hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
        >
          <div className="flex items-start gap-3">
            {/* Status icon */}
            <div
              className={`w-9 h-9 rounded-xl ${sc.iconBg} flex items-center justify-center shrink-0 mt-0.5`}
            >
              <StatusIcon className={`w-[18px] h-[18px] ${sc.iconColor}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Title row */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-oasis-primary transition-colors line-clamp-1">
                  {task.title}
                </h3>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${statusBadge[task.status] ?? statusBadge.todo}`}
                >
                  {statusLabel[task.status] ?? 'To Do'}
                </span>
              </div>

              {/* Description */}
              {task.description && (
                <p className="mt-1 text-xs text-gray-500 line-clamp-1">{task.description}</p>
              )}

              {/* Footer row */}
              <div className="mt-2.5 flex items-center flex-wrap gap-2">
                {/* Priority */}
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${pc.badge}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${pc.dot}`} />
                  {pc.label}
                </span>

                {/* Project */}
                {projectName && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    <FolderKanban className="w-3 h-3" />
                    {projectName}
                  </span>
                )}

                {/* Due date */}
                {task.dueDate && (
                  <span
                    className={`flex items-center gap-1 text-[11px] font-medium ${
                      isOverdue ? 'text-red-600' : 'text-gray-400'
                    }`}
                  >
                    {isOverdue && <AlertTriangle className="w-3 h-3" />}
                    <Calendar className="w-3 h-3" />
                    {new Date(task.dueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                    {isOverdue && <span className="font-semibold"> · Overdue</span>}
                  </span>
                )}

                {/* Created date — pushed right */}
                <span className="text-[11px] text-gray-400 ml-auto">
                  {new Date(task.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}
