'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Circle, Loader2, Plus, Trash2, Pencil } from 'lucide-react'
import { TaskList } from './TaskList'
import { CreateTaskDrawer } from './drawers/CreateTaskDrawer'
import { DeleteConfirmDialog } from './drawers/DeleteConfirmDialog'
import { deleteProject } from '@/actions/projects'

const colorGradient: Record<string, string> = {
  blue:   'from-blue-700 to-blue-500',
  green:  'from-green-800 to-green-500',
  purple: 'from-violet-700 to-purple-500',
  orange: 'from-orange-600 to-amber-400',
  red:    'from-red-700 to-rose-500',
  teal:   'from-teal-700 to-teal-400',
  pink:   'from-pink-600 to-rose-400',
  yellow: 'from-yellow-500 to-amber-300',
}

const colorBar: Record<string, string> = {
  blue:   'bg-blue-400',
  green:  'bg-green-400',
  purple: 'bg-violet-400',
  orange: 'bg-orange-400',
  red:    'bg-red-400',
  teal:   'bg-teal-400',
  pink:   'bg-pink-400',
  yellow: 'bg-yellow-400',
}

interface Task {
  id: string
  title: string
  description?: string | null
  status: 'todo' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate?: string | null
  project?: { id: string; name: string; color: string } | string | null
  createdAt: string
}

interface ProjectDetailViewProps {
  project: {
    id: string
    name: string
    description?: string | null
    status: string
    color: string
    createdAt: string
  }
  tasks: Task[]
  completedCount: number
  completionPercent: number
  projects: Array<{ id: string; name: string }>
  users?: Array<{ id: string; displayName?: string | null; email: string }>
}

export function ProjectDetailView({
  project,
  tasks,
  completedCount,
  completionPercent,
  projects,
  users = [],
}: ProjectDetailViewProps) {
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const gradient = colorGradient[project.color] ?? 'from-gray-700 to-gray-500'
  const bar      = colorBar[project.color]       ?? 'bg-gray-400'

  const todoCount       = tasks.filter((t) => t.status === 'todo').length
  const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay },
  })

  return (
    <>
      <div className="space-y-5">
        {/* Hero banner */}
        <motion.div
          {...fadeUp(0)}
          className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${gradient} shadow-lg`}
        >
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute -bottom-12 -left-8 w-40 h-40 rounded-full bg-white/5" />

          <div className="relative p-6 sm:p-8">
            {/* Name + archived badge */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-white text-xl font-bold">
                    {project.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {project.name}
                </h1>
              </div>
              {project.status === 'archived' && (
                <span className="text-xs px-3 py-1 rounded-full bg-white/20 text-white/80 font-semibold shrink-0 mt-1">
                  Archived
                </span>
              )}
            </div>

            {project.description && (
              <p className="text-white/75 text-sm leading-relaxed mb-6 ml-15">
                {project.description}
              </p>
            )}

            {/* Stats row */}
            <div className="flex items-center gap-6 mb-5">
              <div className="flex items-center gap-1.5 text-white/80 text-sm">
                <Circle className="w-4 h-4" />
                <span><span className="font-bold text-white">{todoCount}</span> to do</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/80 text-sm">
                <Loader2 className="w-4 h-4" />
                <span><span className="font-bold text-white">{inProgressCount}</span> in progress</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/80 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span><span className="font-bold text-white">{completedCount}</span> done</span>
              </div>
            </div>

            {/* Progress bar */}
            {tasks.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70 font-medium">Overall progress</span>
                  <span className="text-white font-bold">{completionPercent}%</span>
                </div>
                <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${bar} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercent}%` }}
                    transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-white/60 text-xs">
                  {completedCount} of {tasks.length} tasks completed
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Tasks section */}
        <motion.div {...fadeUp(0.15)} className="glass-card rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-oasis-primary to-oasis-primary-light px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-bold text-white/80 uppercase tracking-widest">
                Tasks
              </h2>
              <span className="text-xs font-semibold text-white/60 bg-white/10 px-2.5 py-1 rounded-full">
                {tasks.length}
              </span>
            </div>
            <button
              onClick={() => setTaskDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-oasis-accent text-oasis-primary hover:bg-oasis-accent-light transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Task
            </button>
          </div>
          <div className="p-5">
            <TaskList
              tasks={tasks}
              emptyMessage="No tasks in this project yet. Add one above."
            />
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div {...fadeUp(0.25)} className="flex items-center gap-3 flex-wrap">
          <Link
            href="/projects"
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 glass-card rounded-xl hover:shadow-md hover:text-oasis-primary transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Projects
          </Link>
          <Link
            href={`/admin/collections/projects/${project.id}`}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-oasis-primary bg-oasis-accent rounded-xl hover:bg-oasis-accent-light shadow-sm hover:shadow-md transition-all"
          >
            <Pencil className="w-4 h-4" /> Edit Project
          </Link>
          <button
            onClick={() => setDeleteOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 hover:shadow-md transition-all"
          >
            <Trash2 className="w-4 h-4" /> Delete Project
          </button>
        </motion.div>
      </div>

      <CreateTaskDrawer
        isOpen={taskDrawerOpen}
        onClose={() => setTaskDrawerOpen(false)}
        projects={projects}
        users={users}
        defaultProjectId={project.id}
      />
      <DeleteConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => deleteProject(project.id)}
        title="Project"
        description={`"${project.name}" and its association with tasks will be permanently deleted.`}
        redirectAfter="/projects"
      />
    </>
  )
}
