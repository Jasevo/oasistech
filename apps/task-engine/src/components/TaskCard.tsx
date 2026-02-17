'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, AlertTriangle } from 'lucide-react'
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

export function TaskCard({ task, index }: TaskCardProps) {
  const isOverdue =
    task.dueDate &&
    task.status !== 'completed' &&
    new Date(task.dueDate) < new Date()

  const projectName =
    task.project && typeof task.project === 'object' ? task.project.name : null
  const projectColor =
    task.project && typeof task.project === 'object' ? task.project.color : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link href={`/tasks/${task.id}`} className="block group">
        <article className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-oasis-accent/40 transition-all duration-200 hover:-translate-y-0.5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold text-gray-900 group-hover:text-oasis-primary transition-colors line-clamp-1">
              {task.title}
            </h3>
            <StatusBadge status={task.status} />
          </div>

          {task.description && (
            <p className="mt-2 text-sm text-gray-500 line-clamp-2">{task.description}</p>
          )}

          <div className="mt-3 flex items-center flex-wrap gap-2">
            <PriorityBadge priority={task.priority} />

            {projectName && (
              <span className={`text-xs px-2 py-0.5 rounded-full bg-${projectColor}-100 text-${projectColor}-700 font-medium`}>
                {projectName}
              </span>
            )}

            {task.dueDate && (
              <span className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-400'}`}>
                {isOverdue && <AlertTriangle className="w-3 h-3" />}
                <Calendar className="w-3 h-3" />
                {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}

            <span className="text-xs text-gray-400 ml-auto">
              {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}
