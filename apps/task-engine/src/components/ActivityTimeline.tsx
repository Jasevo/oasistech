'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Plus, ArrowRight, CheckCircle2, Activity, Eye, Monitor, Smartphone } from 'lucide-react'
import { EmptyState } from './ui/EmptyState'

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
}

function getRelativeTime(timestamp: string): string {
  const now = new Date()
  const date = new Date(timestamp)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getDateGroup(timestamp: string): string {
  const now = new Date()
  const date = new Date(timestamp)
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000)

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

const taskActionIcons = {
  created:   Plus,
  updated:   ArrowRight,
  completed: CheckCircle2,
}

const taskActionColors = {
  created:   'bg-blue-100 text-blue-600',
  updated:   'bg-oasis-accent/20 text-oasis-accent',
  completed: 'bg-green-100 text-green-600',
}

export function ActivityTimeline({ activities }: { activities: ActivityEntry[] }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (activities.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title="No activity yet"
        description="Activity will appear here as tasks are created and pages are visited."
      />
    )
  }

  const groups = new Map<string, ActivityEntry[]>()
  for (const activity of activities) {
    const group = mounted
      ? getDateGroup(activity.timestamp)
      : new Date(activity.timestamp).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    if (!groups.has(group)) groups.set(group, [])
    groups.get(group)!.push(activity)
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
                const isVisit = entry.type === 'visit'

                if (isVisit) {
                  const DeviceIcon = entry.device === 'mobile' || entry.device === 'tablet' ? Smartphone : Monitor
                  return (
                    <motion.div
                      key={`${entry.id}-${index}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(index * 0.03, 0.5), duration: 0.2 }}
                      className="relative flex gap-4"
                    >
                      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 bg-gray-100 text-gray-500">
                        <Eye className="w-4 h-4" />
                      </div>
                      <div className="flex-1 bg-white rounded-lg border border-gray-100 px-3.5 py-2.5 hover:border-oasis-accent/20 transition-colors">
                        <p className="text-sm text-gray-600">
                          <strong className="text-gray-800">Admin</strong> {entry.action}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[11px] text-gray-400 flex items-center gap-1">
                            <DeviceIcon className="w-3 h-3" />
                            {entry.browser} · {entry.device}
                          </span>
                          <span className="text-[11px] text-gray-400 ml-auto">
                            {mounted
                              ? getRelativeTime(entry.timestamp)
                              : new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )
                }

                const Icon = taskActionIcons[entry.action as keyof typeof taskActionIcons] || ArrowRight
                const colorClass = taskActionColors[entry.action as keyof typeof taskActionColors] || taskActionColors.updated

                return (
                  <motion.div
                    key={`${entry.id}-${index}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(index * 0.03, 0.5), duration: 0.2 }}
                    className="relative flex gap-4"
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 bg-white rounded-lg border border-gray-200 p-3.5 hover:border-oasis-accent/30 transition-colors">
                      <p className="text-sm text-gray-600">
                        {entry.action === 'created' && <><strong className="text-gray-900">{entry.taskTitle}</strong> was created</>}
                        {entry.action === 'completed' && <><strong className="text-gray-900">{entry.taskTitle}</strong> was completed</>}
                        {entry.action === 'updated' && <><strong className="text-gray-900">{entry.taskTitle}</strong> moved to <strong>{entry.status.replace('-', ' ')}</strong></>}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        {entry.projectName && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                            {entry.projectName}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          {mounted
                            ? getRelativeTime(entry.timestamp)
                            : new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        {entry.taskId && (
                          <Link
                            href={`/tasks/${entry.taskId}`}
                            className="text-xs text-oasis-primary hover:text-oasis-accent transition-colors ml-auto"
                          >
                            View task →
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
