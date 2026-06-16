'use server'

import { revalidatePath } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'

export type TaskStatus = 'todo' | 'in-progress' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface CreateTaskInput {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string
  project?: string
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string | null
  project?: string | null
}

export async function createTask(input: CreateTaskInput) {
  try {
    const payload = await getPayloadClient()
    const task = await payload.create({
      collection: 'tasks',
      data: {
        title: input.title.trim(),
        description: input.description?.trim() || undefined,
        status: input.status ?? 'todo',
        priority: input.priority ?? 'medium',
        dueDate: input.dueDate || undefined,
        project: input.project || undefined,
      },
      overrideAccess: true,
    })
    revalidatePath('/tasks')
    revalidatePath('/')
    if (input.project) revalidatePath(`/projects/${input.project}`)
    return { task, error: null }
  } catch (error) {
    console.error('Failed to create task:', error)
    return { task: null, error: 'Failed to create task. Please try again.' }
  }
}

export async function updateTask(id: string, input: UpdateTaskInput) {
  try {
    const payload = await getPayloadClient()
    const data: Record<string, unknown> = {}
    if (input.title !== undefined) data.title = input.title.trim()
    if (input.description !== undefined) data.description = input.description?.trim() || null
    if (input.status !== undefined) data.status = input.status
    if (input.priority !== undefined) data.priority = input.priority
    if ('dueDate' in input) data.dueDate = input.dueDate || null
    if ('project' in input) data.project = input.project || null

    const task = await payload.update({
      collection: 'tasks',
      id,
      data,
      overrideAccess: true,
    })
    revalidatePath('/tasks')
    revalidatePath(`/tasks/${id}`)
    revalidatePath('/')
    return { task, error: null }
  } catch (error) {
    console.error('Failed to update task:', error)
    return { task: null, error: 'Failed to update task. Please try again.' }
  }
}

export async function updateTaskStatus(id: string, status: TaskStatus) {
  return updateTask(id, { status })
}

export async function deleteTask(id: string) {
  try {
    const payload = await getPayloadClient()
    await payload.delete({ collection: 'tasks', id, overrideAccess: true })
    revalidatePath('/tasks')
    revalidatePath('/')
    return { error: null }
  } catch (error) {
    console.error('Failed to delete task:', error)
    return { error: 'Failed to delete task. Please try again.' }
  }
}
