import type { Where } from 'payload'
import { getPayloadClient } from './payload'

export async function fetchTasks(options?: {
  status?: string
  priority?: string
  project?: string
  search?: string
  sort?: string
  page?: number
  limit?: number
}) {
  try {
    const payload = await getPayloadClient()
    const { status, priority, project, search, sort, page = 1, limit = 12 } = options || {}

    const where: Where = {}

    if (status && status !== 'all') {
      where.status = { equals: status }
    }
    if (priority && priority !== 'all') {
      where.priority = { equals: priority }
    }
    if (project) {
      where.project = { equals: project }
    }
    if (search) {
      where.or = [
        { title: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const tasks = await payload.find({
      collection: 'tasks',
      where,
      sort: sort || '-createdAt',
      page,
      limit,
      depth: 1,
      overrideAccess: true,
    })

    return { tasks: tasks.docs, totalDocs: tasks.totalDocs, totalPages: tasks.totalPages, page: tasks.page, error: null }
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
    return { tasks: [], totalDocs: 0, totalPages: 0, page: 1, error: 'Failed to load tasks.' }
  }
}

export async function fetchTaskById(id: string) {
  try {
    const payload = await getPayloadClient()
    const task = await payload.findByID({
      collection: 'tasks',
      id,
      depth: 1,
      overrideAccess: true,
    })
    return { task, error: null }
  } catch (error) {
    console.error('Failed to fetch task:', error)
    return { task: null, error: 'Task not found.' }
  }
}

export async function fetchTaskStats() {
  try {
    const payload = await getPayloadClient()

    const [all, todo, inProgress, completed] = await Promise.all([
      payload.count({ collection: 'tasks', overrideAccess: true }),
      payload.count({ collection: 'tasks', where: { status: { equals: 'todo' } }, overrideAccess: true }),
      payload.count({ collection: 'tasks', where: { status: { equals: 'in-progress' } }, overrideAccess: true }),
      payload.count({ collection: 'tasks', where: { status: { equals: 'completed' } }, overrideAccess: true }),
    ])

    return {
      total: all.totalDocs,
      todo: todo.totalDocs,
      inProgress: inProgress.totalDocs,
      completed: completed.totalDocs,
      error: null,
    }
  } catch (error) {
    console.error('Failed to fetch task stats:', error)
    return { total: 0, todo: 0, inProgress: 0, completed: 0, error: 'Failed to load stats.' }
  }
}

export async function fetchUpcomingDeadlines(limit = 4) {
  try {
    const payload = await getPayloadClient()
    const tasks = await payload.find({
      collection: 'tasks',
      where: {
        status: { not_equals: 'completed' },
        dueDate: { exists: true },
      },
      sort: 'dueDate',
      limit,
      depth: 1,
      overrideAccess: true,
    })
    return { tasks: tasks.docs, error: null }
  } catch (error) {
    console.error('Failed to fetch upcoming deadlines:', error)
    return { tasks: [], error: 'Failed to load deadlines.' }
  }
}

export async function fetchRecentTasks(limit = 5) {
  try {
    const payload = await getPayloadClient()
    const tasks = await payload.find({
      collection: 'tasks',
      sort: '-updatedAt',
      limit,
      depth: 1,
      overrideAccess: true,
    })
    return { tasks: tasks.docs, error: null }
  } catch (error) {
    console.error('Failed to fetch recent tasks:', error)
    return { tasks: [], error: 'Failed to load recent tasks.' }
  }
}
