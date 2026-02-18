import { fetchRecentTasks } from '@/lib/tasks'
import { ActivityTimeline } from '@/components/ActivityTimeline'
import { Activity } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Activity | OasisTech',
}

export default async function ActivityPage() {
  const { tasks } = await fetchRecentTasks(30)

  // Build activity entries from task data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activities = (tasks as any[]).map((task: { id: string; title: string; status: string; createdAt: string; updatedAt: string; project?: { name: string } | string | null }) => {
    const projectName = task.project && typeof task.project === 'object' ? task.project.name : null
    const isNew = new Date(task.updatedAt).getTime() - new Date(task.createdAt).getTime() < 60000
    const action = isNew
      ? 'created'
      : task.status === 'completed'
        ? 'completed'
        : 'updated'

    return {
      id: task.id,
      taskId: task.id,
      taskTitle: task.title,
      action,
      status: task.status,
      projectName,
      timestamp: task.updatedAt,
    }
  })

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-teal-500 via-oasis-accent to-emerald-500" />
        <div className="px-6 py-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Activity</h1>
            <p className="text-sm text-gray-500 mt-0.5">Recent task activity and changes.</p>
          </div>
          <div className="ml-auto">
            <span className="text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 rounded-full px-3 py-1">
              {activities.length} events
            </span>
          </div>
        </div>
      </div>

      <ActivityTimeline activities={activities} />
    </div>
  )
}
