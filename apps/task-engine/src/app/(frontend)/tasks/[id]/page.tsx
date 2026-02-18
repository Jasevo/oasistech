import { fetchTaskById } from '@/lib/tasks'
import { notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { TaskDetailView } from '@/components/TaskDetailView'

export const dynamic = 'force-dynamic'

interface TaskDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = await params
  const { task, error } = await fetchTaskById(id)

  if (error || !task) {
    notFound()
  }

  const projectName = task.project && typeof task.project === 'object' ? task.project.name : null
  const projectId = task.project && typeof task.project === 'object' ? task.project.id : null

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
        }}
        projectName={projectName}
        projectId={projectId ? String(projectId) : null}
      />
    </div>
  )
}
