import { fetchTaskById } from '@/lib/tasks'
import { notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PriorityBadge } from '@/components/ui/PriorityBadge'
import { ProgressTracker } from '@/components/ui/ProgressTracker'
import { Calendar, Clock, FolderKanban, ArrowLeft, ExternalLink, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

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
  const isOverdue = task.dueDate && task.status !== 'completed' && new Date(task.dueDate) < new Date()

  return (
    <div className="space-y-6 max-w-3xl">
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Tasks', href: '/tasks' },
          { label: task.title },
        ]}
      />

      {/* Hero Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{task.title}</h1>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={task.status as 'todo' | 'in-progress' | 'completed'} />
            <PriorityBadge priority={task.priority as 'low' | 'medium' | 'high' | 'urgent'} />
          </div>
        </div>

        {isOverdue && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg px-3 py-2 text-sm font-medium mb-4">
            <AlertTriangle className="w-4 h-4" />
            This task is overdue
          </div>
        )}

        <ProgressTracker status={task.status} />
      </div>

      {/* Description */}
      {task.description && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Description</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{task.description}</p>
        </div>
      )}

      {/* Metadata */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projectName && projectId && (
            <div className="flex items-center gap-3">
              <FolderKanban className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Project</p>
                <Link href={`/projects/${projectId}`} className="text-sm font-medium text-oasis-primary hover:text-oasis-accent transition-colors">
                  {projectName}
                </Link>
              </div>
            </div>
          )}

          {task.dueDate && (
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Due Date</p>
                <p className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                  {new Date(task.dueDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Created</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(task.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Last Updated</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(task.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Link
          href="/tasks"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-oasis-accent/40 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tasks
        </Link>
        <Link
          href={`/admin/collections/tasks/${task.id}`}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-oasis-primary rounded-lg hover:bg-oasis-primary-light transition-colors"
        >
          <ExternalLink className="w-4 h-4" /> Edit in Admin
        </Link>
      </div>
    </div>
  )
}
