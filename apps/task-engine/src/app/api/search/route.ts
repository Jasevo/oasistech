import { NextRequest, NextResponse } from 'next/server'
import { fetchTasks } from '@/lib/tasks'
import { getPayloadClient } from '@/lib/payload'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ tasks: [], projects: [] })
  }

  try {
    const payload = await getPayloadClient()

    const [taskResult, projectResult] = await Promise.all([
      fetchTasks({ search: q, limit: 5 }),
      payload.find({
        collection: 'projects',
        where: { name: { contains: q } },
        limit: 3,
        overrideAccess: true,
      }),
    ])

    const tasks = taskResult.tasks.map((t: any) => ({
      id: t.id,
      title: t.title,
      status: t.status,
      priority: t.priority,
      type: 'task',
    }))

    const projects = projectResult.docs.map((p: any) => ({
      id: p.id,
      name: p.name,
      status: p.status,
      type: 'project',
    }))

    return NextResponse.json({ tasks, projects })
  } catch {
    return NextResponse.json({ tasks: [], projects: [] })
  }
}
