'use server'

import { revalidatePath } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'

export type ProjectStatus = 'active' | 'archived'
export type ProjectColor = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'teal' | 'pink' | 'yellow'

export interface CreateProjectInput {
  name: string
  description?: string
  status?: ProjectStatus
  color?: ProjectColor
}

export interface UpdateProjectInput {
  name?: string
  description?: string
  status?: ProjectStatus
  color?: ProjectColor
}

export async function createProject(input: CreateProjectInput) {
  try {
    const payload = await getPayloadClient()
    const project = await payload.create({
      collection: 'projects',
      data: {
        name: input.name.trim(),
        description: input.description?.trim() || undefined,
        status: input.status ?? 'active',
        color: input.color ?? 'blue',
      },
      overrideAccess: true,
    })
    revalidatePath('/projects')
    revalidatePath('/')
    return { project, error: null }
  } catch (error) {
    console.error('Failed to create project:', error)
    return { project: null, error: 'Failed to create project. Please try again.' }
  }
}

export async function updateProject(id: string, input: UpdateProjectInput) {
  try {
    const payload = await getPayloadClient()
    const data: Record<string, unknown> = {}
    if (input.name !== undefined) data.name = input.name.trim()
    if (input.description !== undefined) data.description = input.description?.trim() || null
    if (input.status !== undefined) data.status = input.status
    if (input.color !== undefined) data.color = input.color

    const project = await payload.update({
      collection: 'projects',
      id,
      data,
      overrideAccess: true,
    })
    revalidatePath('/projects')
    revalidatePath(`/projects/${id}`)
    revalidatePath('/')
    return { project, error: null }
  } catch (error) {
    console.error('Failed to update project:', error)
    return { project: null, error: 'Failed to update project. Please try again.' }
  }
}

export async function deleteProject(id: string) {
  try {
    const payload = await getPayloadClient()
    await payload.delete({ collection: 'projects', id, overrideAccess: true })
    revalidatePath('/projects')
    revalidatePath('/')
    return { error: null }
  } catch (error) {
    console.error('Failed to delete project:', error)
    return { error: 'Failed to delete project. Please try again.' }
  }
}
