import { fetchTaskById } from '@/lib/tasks'
import { fetchProjects } from '@/lib/projects'
import { notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { TaskDetailView } from '@/components/TaskDetailView'

export const dynamic = 'force-dynamic'

interface TaskDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = await params
  const [{ task, error }, { projects }] = await Promise.all([
    fetchTaskById(id),
    fetchProjects({ status: 'active' }),
  ])

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
        }}
        projectName={projectName}
        projectId={projectId ? String(projectId) : null}
        projects={projectOptions}
      />
    </div>
  )
}
