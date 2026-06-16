'use server'

import { revalidatePath } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'

export async function sendMessage(input: {
  fromId: string
  toId: string
  subject: string
  body: string
  linkedTaskId?: string
  linkedProjectId?: string
}) {
  try {
    const payload = await getPayloadClient()
    const message = await payload.create({
      collection: 'messages',
      data: {
        from: input.fromId,
        to: input.toId,
        subject: input.subject.trim(),
        body: input.body.trim(),
        read: false,
        linkedTask: input.linkedTaskId || undefined,
        linkedProject: input.linkedProjectId || undefined,
      },
      overrideAccess: true,
    })
    revalidatePath('/inbox')
    return { message, error: null }
  } catch (error) {
    console.error('Failed to send message:', error)
    return { message: null, error: 'Failed to send message.' }
  }
}

export async function markMessageRead(id: string) {
  try {
    const payload = await getPayloadClient()
    await payload.update({
      collection: 'messages',
      id,
      data: { read: true },
      overrideAccess: true,
    })
    revalidatePath('/inbox')
    return { error: null }
  } catch (error) {
    console.error('Failed to mark message read:', error)
    return { error: 'Failed to update message.' }
  }
}

export async function deleteMessage(id: string) {
  try {
    const payload = await getPayloadClient()
    await payload.delete({ collection: 'messages', id, overrideAccess: true })
    revalidatePath('/inbox')
    return { error: null }
  } catch (error) {
    console.error('Failed to delete message:', error)
    return { error: 'Failed to delete message.' }
  }
}

export async function fetchInbox(userId: string) {
  try {
    const payload = await getPayloadClient()
    const [received, sent] = await Promise.all([
      payload.find({
        collection: 'messages',
        where: { to: { equals: userId } },
        sort: '-createdAt',
        limit: 50,
        depth: 2,
        overrideAccess: true,
      }),
      payload.find({
        collection: 'messages',
        where: { from: { equals: userId } },
        sort: '-createdAt',
        limit: 50,
        depth: 2,
        overrideAccess: true,
      }),
    ])
    return { received: received.docs, sent: sent.docs, error: null }
  } catch (error) {
    console.error('Failed to fetch inbox:', error)
    return { received: [], sent: [], error: 'Failed to load inbox.' }
  }
}

export async function fetchUnreadCount(userId: string) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.count({
      collection: 'messages',
      where: { to: { equals: userId }, read: { equals: false } },
      overrideAccess: true,
    })
    return { count: result.totalDocs }
  } catch {
    return { count: 0 }
  }
}
