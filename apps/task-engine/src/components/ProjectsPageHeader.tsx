'use client'

import { useState } from 'react'
import { FolderKanban, Plus } from 'lucide-react'
import { CreateProjectDrawer } from './drawers/CreateProjectDrawer'

interface ProjectsPageHeaderProps {
  totalCount: number
}

export function ProjectsPageHeader({ totalCount }: ProjectsPageHeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-oasis-primary via-oasis-accent to-oasis-green" />
        <div className="px-6 py-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-oasis-primary to-oasis-primary-light flex items-center justify-center shrink-0 shadow-sm">
            <FolderKanban className="w-5 h-5 text-oasis-accent" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Projects</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {totalCount} project{totalCount !== 1 ? 's' : ''} total
            </p>
          </div>
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-oasis-primary text-white hover:bg-oasis-primary-light shadow-sm hover:shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </div>

      <CreateProjectDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  )
}
