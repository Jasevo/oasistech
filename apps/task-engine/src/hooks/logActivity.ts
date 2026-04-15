import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

const TRACKED_FIELDS: Record<string, string[]> = {
  tasks:    ['title', 'status', 'priority', 'dueDate', 'description'],
  projects: ['name', 'status', 'color', 'description'],
}

function formatValue(val: unknown): string {
  if (val === null || val === undefined || val === '') return '—'
  if (typeof val === 'object') {
    // relationship — use id or name
    const obj = val as Record<string, unknown>
    return String(obj.name || obj.title || obj.id || JSON.stringify(val))
  }
  return String(val)
}

function getTitle(doc: Record<string, unknown>, collectionSlug: string): string {
  return String(doc.title || doc.name || doc.id || collectionSlug)
}

export function makeAfterChangeHook(collectionSlug: string): CollectionAfterChangeHook {
  return async ({ doc, previousDoc, operation, req }) => {
    try {
      const actor = req.user?.email || 'Admin'
      const fields = TRACKED_FIELDS[collectionSlug] || []

      let changes: Array<{ field: string; from: string; to: string }> = []

      if (operation === 'update' && previousDoc) {
        for (const field of fields) {
          const from = formatValue((previousDoc as Record<string, unknown>)[field])
          const to   = formatValue((doc as Record<string, unknown>)[field])
          if (from !== to) {
            changes.push({ field, from, to })
          }
        }
        // Only write a log if something actually changed
        if (changes.length === 0) return doc
      }

      await req.payload.create({
        collection: 'activity-logs',
        data: {
          collection: collectionSlug,
          documentId: String(doc.id),
          documentTitle: getTitle(doc as Record<string, unknown>, collectionSlug),
          action: operation === 'create' ? 'created' : 'updated',
          actor,
          changes: operation === 'create' ? [] : changes,
        },
        overrideAccess: true,
      })
    } catch (err) {
      // Never crash the main operation due to logging failure
      console.error('[ActivityLog] afterChange error:', err)
    }
    return doc
  }
}

export function makeAfterDeleteHook(collectionSlug: string): CollectionAfterDeleteHook {
  return async ({ doc, req }) => {
    try {
      const actor = req.user?.email || 'Admin'
      await req.payload.create({
        collection: 'activity-logs',
        data: {
          collection: collectionSlug,
          documentId: String(doc.id),
          documentTitle: getTitle(doc as Record<string, unknown>, collectionSlug),
          action: 'deleted',
          actor,
          changes: [],
        },
        overrideAccess: true,
      })
    } catch (err) {
      console.error('[ActivityLog] afterDelete error:', err)
    }
  }
}
