'use client'

import { useState } from 'react'
import { CheckSquare, Plus } from 'lucide-react'
import { CreateTaskDrawer } from './drawers/CreateTaskDrawer'

interface TasksPageHeaderProps {
  totalDocs: number
  projects: Array<{ id: string; name: string }>
  users?: Array<{ id: string; displayName?: string | null; email: string }>
}

export function TasksPageHeader({ totalDocs, projects, users = [] }: TasksPageHeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-oasis-primary via-oasis-accent to-oasis-green" />
        <div className="px-6 py-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-oasis-primary to-oasis-primary-light flex items-center justify-center shrink-0 shadow-sm">
            <CheckSquare className="w-5 h-5 text-oasis-accent" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Tasks</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {totalDocs} task{totalDocs !== 1 ? 's' : ''} total
            </p>
          </div>
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-oasis-primary text-white hover:bg-oasis-primary-light shadow-sm hover:shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      <CreateTaskDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        projects={projects}
        users={users}
      />
    </>
  )
}
