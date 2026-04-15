'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Plus, ArrowRight, CheckCircle2, Activity, Eye, Monitor, Smartphone, Trash2, FolderOpen } from 'lucide-react'
import { EmptyState } from './ui/EmptyState'

interface ChangeEntry {
  field: string
  from: string
  to: string
}

interface ActivityEntry {
  id: string
  taskId: string
  taskTitle: string
  action: string
  status: string
  projectName: string | null
  timestamp: string
  type: 'task' | 'visit'
  page?: string
  device?: string
  browser?: string
  actor?: string
  changes?: ChangeEntry[]
  collection?: string
}

function getRelativeTime(timestamp: string): string {
  const diffMs = Date.now() - new Date(timestamp).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getDateGroup(timestamp: string): string {
  const diffDays = Math.floor((Date.now() - new Date(timestamp).getTime()) / 86400000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  return new Date(timestamp).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

const FIELD_LABELS: Record<string, string> = {
  title: 'Title', status: 'Status', priority: 'Priority',
  dueDate: 'Due date', description: 'Description',
  name: 'Name', color: 'Color',
}

export function ActivityTimeline({ activities }: { activities: ActivityEntry[] }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (activities.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title="No activity yet"
        description="Activity will appear here once tasks are created or pages are visited."
      />
    )
  }

  const groups = new Map<string, ActivityEntry[]>()
  for (const entry of activities) {
    const group = mounted
      ? getDateGroup(entry.timestamp)
      : new Date(entry.timestamp).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    if (!groups.has(group)) groups.set(group, [])
    groups.get(group)!.push(entry)
  }

  return (
    <div className="space-y-8">
      {Array.from(groups.entries()).map(([dateGroup, entries]) => (
        <div key={dateGroup}>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{dateGroup}</h3>
          <div className="relative">
            <div className="absolute left-[17px] top-0 bottom-0 w-0.5 bg-oasis-accent/20" />
            <div className="space-y-3">
              {entries.map((entry, index) => {
                if (entry.type === 'visit') {
                  const DeviceIcon = entry.device === 'mobile' || entry.device === 'tablet' ? Smartphone : Monitor
                  return (
                    <motion.div
                      key={`${entry.id}-${index}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(index * 0.03, 0.4), duration: 0.2 }}
                      className="relative flex gap-4"
                    >
                      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 bg-gray-100 text-gray-400">
                        <Eye className="w-4 h-4" />
                      </div>
                      <div className="flex-1 bg-white rounded-lg border border-gray-100 px-3.5 py-2.5 hover:border-oasis-accent/20 transition-colors">
                        <p className="text-sm text-gray-700">
                          <strong className="text-gray-900">{entry.actor || 'Admin'}</strong> {entry.action}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[11px] text-gray-400 flex items-center gap-1">
                            <DeviceIcon className="w-3 h-3" />
                            {entry.browser} · {entry.device}
                          </span>
                          <span className="text-[11px] text-gray-400 ml-auto">
                            {mounted ? getRelativeTime(entry.timestamp) : '—'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )
                }

                // Task / Project audit log entry
                const isProject = entry.collection === 'projects'
                const isDeleted = entry.action === 'deleted'
                const isCreated = entry.action === 'created'

                const Icon = isDeleted ? Trash2
                  : isCreated ? Plus
                  : isProject ? FolderOpen
                  : CheckCircle2

                const colorClass = isDeleted ? 'bg-red-100 text-red-500'
                  : isCreated ? 'bg-blue-100 text-blue-600'
                  : 'bg-oasis-accent/20 text-oasis-accent'

                const changes = entry.changes || []

                return (
                  <motion.div
                    key={`${entry.id}-${index}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(index * 0.03, 0.4), duration: 0.2 }}
                    className="relative flex gap-4"
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 bg-white rounded-lg border border-gray-200 p-3.5 hover:border-oasis-accent/30 transition-colors">
                      {/* Main action line */}
                      <p className="text-sm text-gray-700">
                        <strong className="text-gray-900">{entry.actor || 'Admin'}</strong>
                        {' '}
                        {isCreated && <>created {isProject ? 'project' : 'task'} <strong className="text-gray-900">{entry.taskTitle}</strong></>}
                        {isDeleted && <>deleted {isProject ? 'project' : 'task'} <strong className="text-red-600">{entry.taskTitle}</strong></>}
                        {!isCreated && !isDeleted && <>updated {isProject ? 'project' : 'task'} <strong className="text-gray-900">{entry.taskTitle}</strong></>}
                      </p>

                      {/* Field-level changes */}
                      {changes.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {changes.map((change, ci) => (
                            <div key={ci} className="flex items-center gap-1.5 text-[11px]">
                              <span className="text-gray-400 font-medium w-16 shrink-0">{FIELD_LABELS[change.field] || change.field}</span>
                              <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-500 font-mono line-through">{change.from}</span>
                              <ArrowRight className="w-3 h-3 text-gray-300 shrink-0" />
                              <span className="px-1.5 py-0.5 rounded bg-green-50 text-green-600 font-mono">{change.to}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[11px] text-gray-400">
                          {mounted ? getRelativeTime(entry.timestamp) : '—'}
                        </span>
                        {entry.taskId && !isDeleted && (
                          <Link
                            href={isProject ? `/projects/${entry.taskId}` : `/tasks/${entry.taskId}`}
                            className="text-xs text-oasis-primary hover:text-oasis-accent transition-colors ml-auto"
                          >
                            View {isProject ? 'project' : 'task'} →
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
