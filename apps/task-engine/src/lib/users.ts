import type { Where } from 'payload'
import { getPayloadClient } from './payload'

export async function fetchUsers(options?: {
  role?: string
  search?: string
  sort?: string
}) {
  try {
    const payload = await getPayloadClient()
    const { role, search, sort } = options || {}

    const where: Where = {}

    if (role && role !== 'all') {
      where.role = { equals: role }
    }
    if (search) {
      where.email = { contains: search }
    }

    const users = await payload.find({
      collection: 'api-users',
      where,
      sort: sort || '-createdAt',
      limit: 50,
      overrideAccess: true,
    })

    // Strip sensitive fields — never expose hashed passwords or raw API keys
    const safeUsers = users.docs.map((user) => ({
      id: user.id,
      email: user.email,
      role: user.role,
      displayName: user.displayName,
      enableAPIKey: user.enableAPIKey,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }))

    return { users: safeUsers, error: null }
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return { users: [], error: 'Failed to load users.' }
  }
}
