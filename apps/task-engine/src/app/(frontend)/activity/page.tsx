import { fetchRecentTasks } from '@/lib/tasks'
import { ActivityTimeline } from '@/components/ActivityTimeline'

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Activity</h1>
        <p className="text-sm text-gray-500 mt-1">Recent task activity and changes.</p>
      </div>

      <ActivityTimeline activities={activities} />
    </div>
  )
}
