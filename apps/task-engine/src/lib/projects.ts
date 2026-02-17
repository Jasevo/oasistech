import type { Where } from 'payload'
import { getPayloadClient } from './payload'

export async function fetchProjects(options?: {
  status?: string
  search?: string
  sort?: string
}) {
  try {
    const payload = await getPayloadClient()
    const { status, search, sort } = options || {}

    const where: Where = {}

    if (status && status !== 'all') {
      where.status = { equals: status }
    }
    if (search) {
      where.name = { contains: search }
    }

    const projects = await payload.find({
      collection: 'projects',
      where,
      sort: sort || '-createdAt',
      limit: 50,
      overrideAccess: true,
    })

    // Fetch task counts for each project
    const projectsWithCounts = await Promise.all(
      projects.docs.map(async (project) => {
        const [total, completed] = await Promise.all([
          payload.count({
            collection: 'tasks',
            where: { project: { equals: project.id } },
            overrideAccess: true,
          }),
          payload.count({
            collection: 'tasks',
            where: {
              project: { equals: project.id },
              status: { equals: 'completed' },
            },
            overrideAccess: true,
          }),
        ])
        return {
          ...project,
          taskCount: total.totalDocs,
          completedCount: completed.totalDocs,
        }
      })
    )

    return { projects: projectsWithCounts, error: null }
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    return { projects: [], error: 'Failed to load projects.' }
  }
}

export async function fetchProjectById(id: string) {
  try {
    const payload = await getPayloadClient()
    const project = await payload.findByID({
      collection: 'projects',
      id,
      overrideAccess: true,
    })

    const tasks = await payload.find({
      collection: 'tasks',
      where: { project: { equals: id } },
      sort: '-createdAt',
      limit: 50,
      depth: 1,
      overrideAccess: true,
    })

    return { project, tasks: tasks.docs, error: null }
  } catch (error) {
    console.error('Failed to fetch project:', error)
    return { project: null, tasks: [], error: 'Project not found.' }
  }
}
