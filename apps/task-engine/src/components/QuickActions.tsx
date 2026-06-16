'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, FolderKanban, BarChart3, Users, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { CreateTaskDrawer } from './drawers/CreateTaskDrawer'
import { CreateProjectDrawer } from './drawers/CreateProjectDrawer'

interface QuickActionsProps {
  projects?: Array<{ id: string; name: string }>
}

export function QuickActions({ projects = [] }: QuickActionsProps) {
  const { t } = useLanguage()
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false)
  const [projectDrawerOpen, setProjectDrawerOpen] = useState(false)

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass-card rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      >
        <div className="bg-gradient-to-r from-oasis-accent to-amber-400 p-5">
          <h2 className="text-sm font-bold text-oasis-primary uppercase tracking-wider">{t('quickActions')}</h2>
        </div>
        <div className="p-5 space-y-1">

          {/* Create Task */}
          <button
            onClick={() => setTaskDrawerOpen(true)}
            className="w-full flex items-center gap-3.5 p-3 rounded-xl hover:bg-white/60 transition-all duration-200 group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-oasis-primary/10 flex items-center justify-center shrink-0">
              <Plus className="w-5 h-5 text-oasis-primary" />
            </div>
            <p className="text-sm font-semibold text-gray-900 flex-1">{t('createTask')}</p>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
          </button>

          {/* New Project */}
          <button
            onClick={() => setProjectDrawerOpen(true)}
            className="w-full flex items-center gap-3.5 p-3 rounded-xl hover:bg-white/60 transition-all duration-200 group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
              <FolderKanban className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm font-semibold text-gray-900 flex-1">{t('newProject')}</p>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
          </button>

          {/* Invite User — still a nav link */}
          <Link
            href="/users"
            className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-white/60 transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm font-semibold text-gray-900 flex-1">{t('inviteUser')}</p>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
          </Link>

          {/* View Reports */}
          <Link
            href="/analytics"
            className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-white/60 transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-sm font-semibold text-gray-900 flex-1">{t('viewReports')}</p>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
          </Link>
        </div>
      </motion.section>

      <CreateTaskDrawer
        isOpen={taskDrawerOpen}
        onClose={() => setTaskDrawerOpen(false)}
        projects={projects}
      />
      <CreateProjectDrawer
        isOpen={projectDrawerOpen}
        onClose={() => setProjectDrawerOpen(false)}
      />
    </>
  )
}
