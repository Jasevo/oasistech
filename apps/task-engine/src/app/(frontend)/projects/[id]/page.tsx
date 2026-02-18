import { fetchProjectById } from '@/lib/projects'
import { notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ProjectDetailView } from '@/components/ProjectDetailView'

export const dynamic = 'force-dynamic'

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params
  const { project, tasks, error } = await fetchProjectById(id)

  if (error || !project) {
    notFound()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const completedCount = (tasks as any[]).filter((t) => t.status === 'completed').length
  const completionPercent =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Projects', href: '/projects' },
          { label: project.name },
        ]}
      />
      <ProjectDetailView
        project={{
          id: String(project.id),
          name: project.name,
          description: project.description ?? null,
          status: project.status,
          color: project.color,
          createdAt: project.createdAt,
        }}
        tasks={tasks as never[]}
        completedCount={completedCount}
        completionPercent={completionPercent}
      />
    </div>
  )
}
