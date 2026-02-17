import { getPayloadClient } from './payload'

export async function fetchAnalyticsData() {
  try {
    const payload = await getPayloadClient()

    // Fetch all tasks with project info
    const allTasks = await payload.find({
      collection: 'tasks',
      limit: 500,
      depth: 1,
      overrideAccess: true,
    })

    const tasks = allTasks.docs

    // Status breakdown
    const statusBreakdown = [
      { name: 'To Do', value: tasks.filter((t) => t.status === 'todo').length, color: '#9CA3AF' },
      { name: 'In Progress', value: tasks.filter((t) => t.status === 'in-progress').length, color: '#e3ba54' },
      { name: 'Completed', value: tasks.filter((t) => t.status === 'completed').length, color: '#092421' },
    ]

    // Priority breakdown
    const priorityBreakdown = [
      { name: 'Low', value: tasks.filter((t) => t.priority === 'low').length, color: '#22C55E' },
      { name: 'Medium', value: tasks.filter((t) => t.priority === 'medium').length, color: '#3B82F6' },
      { name: 'High', value: tasks.filter((t) => t.priority === 'high').length, color: '#F97316' },
      { name: 'Urgent', value: tasks.filter((t) => t.priority === 'urgent').length, color: '#EF4444' },
    ]

    // Tasks per project
    const projectMap = new Map<string, { name: string; count: number; color: string }>()
    for (const task of tasks) {
      if (task.project && typeof task.project === 'object') {
        const key = task.project.id
        const existing = projectMap.get(key)
        if (existing) {
          existing.count++
        } else {
          projectMap.set(key, { name: task.project.name, count: 1, color: task.project.color || 'blue' })
        }
      }
    }
    const tasksPerProject = Array.from(projectMap.values()).map((p) => ({
      name: p.name,
      tasks: p.count,
      color: p.color,
    }))

    // Tasks created over time (last 30 days)
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const dailyCounts: Record<string, number> = {}
    for (let d = new Date(thirtyDaysAgo); d <= now; d.setDate(d.getDate() + 1)) {
      dailyCounts[d.toISOString().split('T')[0]] = 0
    }
    for (const task of tasks) {
      const date = new Date(task.createdAt).toISOString().split('T')[0]
      if (dailyCounts[date] !== undefined) {
        dailyCounts[date]++
      }
    }
    const trendData = Object.entries(dailyCounts).map(([date, count]) => ({
      date,
      tasks: count,
    }))

    // Completion rate
    const completionRate = tasks.length > 0
      ? Math.round((tasks.filter((t) => t.status === 'completed').length / tasks.length) * 100)
      : 0

    // Overdue count
    const overdueCount = tasks.filter(
      (t) => t.dueDate && t.status !== 'completed' && new Date(t.dueDate) < now
    ).length

    return {
      totalTasks: tasks.length,
      completionRate,
      overdueCount,
      avgTasksPerProject: tasksPerProject.length > 0
        ? Math.round(tasks.length / tasksPerProject.length)
        : 0,
      statusBreakdown,
      priorityBreakdown,
      tasksPerProject,
      trendData,
      error: null,
    }
  } catch (error) {
    console.error('Failed to fetch analytics:', error)
    return {
      totalTasks: 0, completionRate: 0, overdueCount: 0, avgTasksPerProject: 0,
      statusBreakdown: [], priorityBreakdown: [], tasksPerProject: [], trendData: [],
      error: 'Failed to load analytics.',
    }
  }
}
