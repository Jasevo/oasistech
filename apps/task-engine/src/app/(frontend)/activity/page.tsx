import { fetchActivityLogs } from '@/lib/activityLogs'
import { fetchRecentVisitActivity } from '@/lib/visits'
import { ActivityTimeline } from '@/components/ActivityTimeline'
import { Activity } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Activity | OasisTech',
}

export default async function ActivityPage() {
  const [logs, visitActivity] = await Promise.all([
    fetchActivityLogs(50),
    fetchRecentVisitActivity(30),
  ])

  const taskActivities = logs.map((log) => ({
    id: log.id,
    taskId: log.documentId,
    taskTitle: log.documentTitle,
    action: log.action,
    status: '',
    projectName: null,
    timestamp: log.createdAt,
    type: 'task' as const,
    actor: log.actor,
    changes: log.changes,
    collection: log.collection,
  }))

  const visitActivities = visitActivity.map((v) => ({
    id: v.id,
    taskId: '',
    taskTitle: '',
    action: v.action,
    status: '',
    projectName: null,
    timestamp: v.timestamp,
    type: 'visit' as const,
    actor: 'Admin',
    changes: [],
    page: v.page,
    device: v.device,
    browser: v.browser,
    collection: '',
  }))

  const allActivities = [...taskActivities, ...visitActivities]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return (
    <div className="space-y-5">
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-teal-500 via-oasis-accent to-emerald-500" />
        <div className="px-6 py-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Activity</h1>
            <p className="text-sm text-gray-500 mt-0.5">Full audit trail — every edit, creation, deletion and page visit.</p>
          </div>
          <div className="ml-auto">
            <span className="text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 rounded-full px-3 py-1">
              {allActivities.length} events
            </span>
          </div>
        </div>
      </div>

      <ActivityTimeline activities={allActivities} />
    </div>
  )
}
