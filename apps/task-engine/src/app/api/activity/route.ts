import { NextResponse } from 'next/server'
import { fetchRecentTasks } from '@/lib/tasks'
import { fetchRecentVisitActivity } from '@/lib/visits'

export async function GET() {
  try {
    const [{ tasks }, visitActivity] = await Promise.all([
      fetchRecentTasks(10),
      fetchRecentVisitActivity(10),
    ])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const taskItems = (tasks as any[]).map((task: any) => {
      const isNew = new Date(task.updatedAt).getTime() - new Date(task.createdAt).getTime() < 60000
      const action = isNew ? 'created a task' : task.status === 'completed' ? 'completed a task' : 'updated a task'
      return {
        type: 'task',
        action,
        label: task.title,
        timestamp: task.updatedAt,
        href: `/tasks/${task.id}`,
      }
    })

    const visitItems = visitActivity.map((v) => ({
      type: 'visit',
      action: v.action,
      label: v.page,
      timestamp: v.timestamp,
      href: null,
    }))

    const combined = [...taskItems, ...visitItems]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 6)

    return NextResponse.json(combined)
  } catch {
    return NextResponse.json([])
  }
}
