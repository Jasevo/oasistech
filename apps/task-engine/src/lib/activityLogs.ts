import { getPayloadClient } from './payload'

export interface ActivityLogEntry {
  id: string
  collection: string
  documentId: string
  documentTitle: string
  action: 'created' | 'updated' | 'deleted'
  actor: string
  changes: Array<{ field: string; from: string; to: string }>
  createdAt: string
}

export async function fetchActivityLogs(limit = 50): Promise<ActivityLogEntry[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'activity-logs',
      sort: '-createdAt',
      limit,
      overrideAccess: true,
    })

    return result.docs.map((doc: any) => ({
      id: String(doc.id),
      collection: String(doc.collection || ''),
      documentId: String(doc.documentId || ''),
      documentTitle: String(doc.documentTitle || ''),
      action: doc.action as 'created' | 'updated' | 'deleted',
      actor: String(doc.actor || 'Admin'),
      changes: Array.isArray(doc.changes) ? doc.changes : [],
      createdAt: String(doc.createdAt),
    }))
  } catch (err) {
    console.error('Failed to fetch activity logs:', err)
    return []
  }
}
