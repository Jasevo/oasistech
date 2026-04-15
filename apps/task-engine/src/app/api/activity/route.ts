import { NextResponse } from 'next/server'
import { fetchActivityLogs } from '@/lib/activityLogs'
import { fetchRecentVisitActivity } from '@/lib/visits'

export async function GET() {
  try {
    const [logs, visitActivity] = await Promise.all([
      fetchActivityLogs(20),
      fetchRecentVisitActivity(10),
    ])

    const taskItems = logs.map((log) => ({
      type: 'task' as const,
      action: log.action === 'created' ? 'created a task'
            : log.action === 'deleted' ? 'deleted a task'
            : 'updated a task',
      label: log.documentTitle,
      changes: log.changes,
      collection: log.collection,
      documentId: log.documentId,
      timestamp: log.createdAt,
      actor: log.actor,
      href: log.collection === 'tasks' ? `/tasks/${log.documentId}` : `/projects/${log.documentId}`,
    }))

    const visitItems = visitActivity.map((v) => ({
      type: 'visit' as const,
      action: v.action,
      label: v.page,
      changes: [],
      collection: '',
      documentId: '',
      timestamp: v.timestamp,
      actor: 'Admin',
      href: null,
    }))

    const combined = [...taskItems, ...visitItems]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 8)

    return NextResponse.json(combined)
  } catch {
    return NextResponse.json([])
  }
}
