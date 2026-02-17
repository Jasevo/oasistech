import { fetchProjectById } from '@/lib/projects'
import { notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { TaskList } from '@/components/TaskList'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>
}

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500', green: 'bg-green-500', purple: 'bg-purple-500',
  orange: 'bg-orange-500', red: 'bg-red-500', teal: 'bg-teal-500',
  pink: 'bg-pink-500', yellow: 'bg-yellow-500',
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params
  const { project, tasks, error } = await fetchProjectById(id)

  if (error || !project) {
    notFound()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const completedCount = (tasks as any[]).filter((t) => t.status === 'completed').length
  const completionPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Projects', href: '/projects' },
          { label: project.name },
        ]}
      />

      {/* Project Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start gap-3">
          <div className={`w-4 h-4 rounded-full mt-1 shrink-0 ${colorMap[project.color] || 'bg-gray-400'}`} />
          <div className="flex-1">
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">{project.name}</h1>
              {project.status === 'archived' && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">Archived</span>
              )}
            </div>
            {project.description && (
              <p className="text-gray-600 mt-2 leading-relaxed">{project.description}</p>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5 flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-oasis-accent rounded-full transition-all duration-700"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-gray-700">{completionPercent}%</span>
          <span className="text-xs text-gray-500">{completedCount}/{tasks.length} tasks</span>
        </div>
      </div>

      {/* Tasks in this project */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tasks ({tasks.length})</h2>
        <TaskList tasks={tasks as never[]} emptyMessage="No tasks in this project yet." />
      </section>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Link
          href="/projects"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-oasis-accent/40 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>
        <Link
          href={`/admin/collections/projects/${project.id}`}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-oasis-primary rounded-lg hover:bg-oasis-primary-light transition-colors"
        >
          <ExternalLink className="w-4 h-4" /> Edit in Admin
        </Link>
      </div>
    </div>
  )
}
