'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FolderKanban } from 'lucide-react'

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  teal: 'bg-teal-500',
  pink: 'bg-pink-500',
  yellow: 'bg-yellow-500',
}

interface ProjectCardProps {
  project: {
    id: string
    name: string
    description?: string | null
    status: string
    color: string
    taskCount: number
    completedCount: number
    createdAt: string
  }
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const completionPercent = project.taskCount > 0
    ? Math.round((project.completedCount / project.taskCount) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link href={`/projects/${project.id}`} className="block group">
        <article className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-oasis-accent/40 transition-all duration-200 hover:-translate-y-0.5">
          <div className="flex items-start gap-3">
            <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${colorMap[project.color] || 'bg-gray-400'}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-gray-900 group-hover:text-oasis-primary transition-colors truncate">
                  {project.name}
                </h3>
                {project.status === 'archived' && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium shrink-0">
                    Archived
                  </span>
                )}
              </div>
              {project.description && (
                <p className="mt-1.5 text-sm text-gray-500 line-clamp-2">{project.description}</p>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <FolderKanban className="w-3.5 h-3.5" />
              {project.taskCount} {project.taskCount === 1 ? 'task' : 'tasks'}
            </div>
            {project.taskCount > 0 && (
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-oasis-accent rounded-full transition-all duration-500"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-500">{completionPercent}%</span>
              </div>
            )}
          </div>
        </article>
      </Link>
    </motion.div>
  )
}
