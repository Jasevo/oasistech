'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Plus, ArrowRight, CheckCircle2, Activity } from 'lucide-react'
import { EmptyState } from './ui/EmptyState'

interface ActivityEntry {
  id: string
  taskId: string
  taskTitle: string
  action: string
  status: string
  projectName: string | null
  timestamp: string
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

const actionIcons = {
  created: Plus,
  updated: ArrowRight,
  completed: CheckCircle2,
}

const actionColors = {
  created: 'bg-blue-100 text-blue-600',
  updated: 'bg-oasis-accent/20 text-oasis-accent',
  completed: 'bg-green-100 text-green-600',
}

function getActionText(action: string, taskTitle: string, status: string): React.ReactNode {
  switch (action) {
    case 'created':
      return <><strong className="text-gray-900">{taskTitle}</strong> was created</>
    case 'completed':
      return <><strong className="text-gray-900">{taskTitle}</strong> was completed</>
    default:
      return <><strong className="text-gray-900">{taskTitle}</strong> moved to <strong>{status.replace('-', ' ')}</strong></>
  }
}

export function ActivityTimeline({ activities }: { activities: ActivityEntry[] }) {
  if (activities.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title="No activity yet"
        description="Activity will appear here as tasks are created and updated."
      />
    )
  }

  // Group by date
  const groups = new Map<string, ActivityEntry[]>()
  for (const activity of activities) {
    const group = getDateGroup(activity.timestamp)
    if (!groups.has(group)) groups.set(group, [])
    groups.get(group)!.push(activity)
  }

  return (
    <div className="space-y-8">
      {Array.from(groups.entries()).map(([dateGroup, entries]) => (
        <div key={dateGroup}>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{dateGroup}</h3>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[17px] top-0 bottom-0 w-0.5 bg-oasis-accent/20" />

            <div className="space-y-4">
              {entries.map((entry, index) => {
                const Icon = actionIcons[entry.action as keyof typeof actionIcons] || ArrowRight
                const colorClass = actionColors[entry.action as keyof typeof actionColors] || actionColors.updated

                return (
                  <motion.div
                    key={`${entry.id}-${index}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.25 }}
                    className="relative flex gap-4 pl-0"
                  >
                    {/* Icon node */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-white rounded-lg border border-gray-200 p-3.5 hover:border-oasis-accent/30 transition-colors">
                      <p className="text-sm text-gray-600">
                        {getActionText(entry.action, entry.taskTitle, entry.status)}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        {entry.projectName && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                            {entry.projectName}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">{getRelativeTime(entry.timestamp)}</span>
                        <Link
                          href={`/tasks/${entry.taskId}`}
                          className="text-xs text-oasis-primary hover:text-oasis-accent transition-colors ml-auto"
                        >
                          View task →
                        </Link>
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
