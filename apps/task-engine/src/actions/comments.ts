'use server'

import { revalidatePath } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'

export async function createComment(input: {
  taskId: string
  authorId: string
  body: string
  mentionedTaskId?: string
}) {
  try {
    const payload = await getPayloadClient()
    const comment = await payload.create({
      collection: 'task-comments',
      data: {
        task: input.taskId,
        author: input.authorId,
        body: input.body.trim(),
        mentionedTask: input.mentionedTaskId || undefined,
      },
      overrideAccess: true,
    })
    revalidatePath(`/tasks/${input.taskId}`)
    return { comment, error: null }
  } catch (error) {
    console.error('Failed to create comment:', error)
    return { comment: null, error: 'Failed to post comment.' }
  }
}

export async function deleteComment(id: string, taskId: string) {
  try {
    const payload = await getPayloadClient()
    await payload.delete({ collection: 'task-comments', id, overrideAccess: true })
    revalidatePath(`/tasks/${taskId}`)
    return { error: null }
  } catch (error) {
    console.error('Failed to delete comment:', error)
    return { error: 'Failed to delete comment.' }
  }
}

export async function fetchTaskComments(taskId: string) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'task-comments',
      where: { task: { equals: taskId } },
      sort: 'createdAt',
      limit: 100,
      depth: 2,
      overrideAccess: true,
    })
    return { comments: result.docs, error: null }
  } catch (error) {
    console.error('Failed to fetch comments:', error)
    return { comments: [], error: 'Failed to load comments.' }
  }
}
