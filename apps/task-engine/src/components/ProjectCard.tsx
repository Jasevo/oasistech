'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle } from 'lucide-react'

// Safe static Tailwind gradient classes keyed to project colour
const colorGradient: Record<string, string> = {
  blue:   'from-blue-600 to-blue-400',
  green:  'from-green-700 to-green-500',
  purple: 'from-violet-700 to-purple-500',
  orange: 'from-orange-600 to-amber-400',
  red:    'from-red-700 to-rose-500',
  teal:   'from-teal-700 to-teal-400',
  pink:   'from-pink-600 to-rose-400',
  yellow: 'from-yellow-500 to-amber-300',
}

// Safe static left-border accent classes
const colorBorder: Record<string, string> = {
  blue:   'border-l-blue-400',
  green:  'border-l-green-500',
  purple: 'border-l-violet-500',
  orange: 'border-l-orange-400',
  red:    'border-l-red-500',
  teal:   'border-l-teal-500',
  pink:   'border-l-pink-500',
  yellow: 'border-l-yellow-400',
}

// Progress bar colour
const colorBar: Record<string, string> = {
  blue:   'bg-blue-500',
  green:  'bg-green-500',
  purple: 'bg-violet-500',
  orange: 'bg-orange-500',
  red:    'bg-red-500',
  teal:   'bg-teal-500',
  pink:   'bg-pink-500',
  yellow: 'bg-yellow-500',
}

const fallbackGradient = 'from-gray-600 to-gray-400'
const fallbackBorder   = 'border-l-gray-400'
const fallbackBar      = 'bg-gray-400'

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
  const completionPercent =
    project.taskCount > 0
      ? Math.round((project.completedCount / project.taskCount) * 100)
      : 0

  const gradient = colorGradient[project.color] ?? fallbackGradient
  const border   = colorBorder[project.color]   ?? fallbackBorder
  const bar      = colorBar[project.color]       ?? fallbackBar

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      whileHover={{ y: -2 }}
    >
      <Link href={`/projects/${project.id}`} className="block group">
        <article
          className={`glass-card rounded-xl border-l-4 ${border} overflow-hidden hover:shadow-lg transition-all duration-200`}
        >
          {/* Header band */}
          <div className={`bg-gradient-to-r ${gradient} px-5 py-4 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              {/* Icon block */}
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <span className="text-white text-base font-bold">
                  {project.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-white/90 transition-colors truncate max-w-[180px]">
                {project.name}
              </h3>
            </div>
            {project.status === 'archived' && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20 text-white/80 font-semibold shrink-0">
                Archived
              </span>
            )}
          </div>

          {/* Body */}
          <div className="px-5 py-4 space-y-4">
            {project.description && (
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            )}

            {/* Stats row */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Circle className="w-3.5 h-3.5" />
                <span>{project.taskCount} task{project.taskCount !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{project.completedCount} done</span>
              </div>
            </div>

            {/* Progress bar */}
            {project.taskCount > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">Progress</span>
                  <span className="font-bold text-gray-700">{completionPercent}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${bar} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercent}%` }}
                    transition={{ duration: 0.7, delay: index * 0.06 + 0.2, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}
          </div>
        </article>
      </Link>
    </motion.div>
  )
}
