import { fetchTaskById, fetchTasks } from '@/lib/tasks'
import { fetchProjects } from '@/lib/projects'
import { fetchUsers } from '@/lib/users'
import { fetchTaskComments } from '@/actions/comments'
import { notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { TaskDetailView } from '@/components/TaskDetailView'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

interface TaskDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = await params
  const payload = await getPayloadClient()
  const currentUser = await payload.find({ collection: 'api-users', limit: 1, overrideAccess: true })
  const currentUserId = String(currentUser.docs[0]?.id ?? '1')

  const [{ task, error }, { projects }, { tasks: allTasks }, { comments }, { users }] = await Promise.all([
    fetchTaskById(id),
    fetchProjects({ status: 'active' }),
    fetchTasks({ limit: 100 }),
    fetchTaskComments(id),
    fetchUsers(),
  ])

  const userOptions = (users as Array<{ id: string | number; displayName?: string | null; email: string }>).map((u) => ({
    id: String(u.id),
    displayName: u.displayName ?? null,
    email: u.email,
  }))

  if (error || !task) {
    notFound()
  }

  const projectName = task.project && typeof task.project === 'object' ? task.project.name : null
  const projectId = task.project && typeof task.project === 'object' ? task.project.id : null

  const projectOptions = (projects as Array<{ id: string | number; name?: string }>).map((p) => ({
    id: String(p.id),
    name: String(p.name ?? ''),
  }))

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Tasks', href: '/tasks' },
          { label: task.title },
        ]}
      />
      <TaskDetailView
        task={{
          id: String(task.id),
          title: task.title,
          description: task.description ?? null,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate ?? null,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
          project: task.project as { id: string; name: string } | null,
          assignee: task.assignee as { id: string; displayName?: string | null; email: string } | null,
        }}
        projectName={projectName}
        projectId={projectId ? String(projectId) : null}
        projects={projectOptions}
        users={userOptions}
        currentUserId={currentUserId}
        initialComments={(comments as Array<{ id: string | number; body: string; createdAt: string; author?: { id: string | number; displayName?: string | null; email: string } | null; mentionedTask?: { id: string | number; title: string } | null }>).map(c => ({
          id: String(c.id),
          body: c.body,
          createdAt: c.createdAt,
          author: c.author ? { id: String(c.author.id), displayName: c.author.displayName ?? null, email: c.author.email } : null,
          mentionedTask: c.mentionedTask ? { id: String(c.mentionedTask.id), title: c.mentionedTask.title } : null,
        }))}
        allTasks={allTasks.map(t => ({ id: String(t.id), title: t.title }))}
      />
    </div>
  )
}
