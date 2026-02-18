import { fetchTasks } from '@/lib/tasks'
import { fetchProjects } from '@/lib/projects'
import { TaskList } from '@/components/TaskList'
import { TaskFilters } from '@/components/TaskFilters'
import { CheckSquare, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Tasks | OasisTech',
}

interface TasksPageProps {
  searchParams: Promise<{
    status?: string
    priority?: string
    project?: string
    search?: string
    sort?: string
    page?: string
  }>
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1', 10)

  const [tasksResult, projectsResult] = await Promise.all([
    fetchTasks({
      status: params.status,
      priority: params.priority,
      project: params.project,
      search: params.search,
      sort: params.sort,
      page,
      limit: 12,
    }),
    fetchProjects({ status: 'active' }),
  ])

  const totalPages = tasksResult.totalPages

  function pageUrl(p: number) {
    const sp = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][]
    )
    sp.set('page', String(p))
    return `?${sp.toString()}`
  }

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {/* Accent stripe */}
        <div className="h-1 bg-gradient-to-r from-oasis-primary via-oasis-accent to-oasis-green" />
        <div className="px-6 py-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-oasis-primary to-oasis-primary-light flex items-center justify-center shrink-0 shadow-sm">
            <CheckSquare className="w-5 h-5 text-oasis-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Tasks</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {tasksResult.totalDocs} task{tasksResult.totalDocs !== 1 ? 's' : ''} total
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-5">
        <TaskFilters
          currentStatus={params.status}
          currentPriority={params.priority}
          currentProject={params.project}
          currentSearch={params.search}
          currentSort={params.sort}
          projects={(projectsResult.projects as Array<{ id: string | number; name?: string }>).map(
            (p) => ({ id: String(p.id), name: String(p.name ?? '') })
          )}
          totalDocs={tasksResult.totalDocs}
        />
      </div>

      {/* Task grid */}
      <TaskList
        tasks={tasksResult.tasks as never[]}
        emptyMessage="No tasks match your filters. Try adjusting your search criteria."
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          {/* Prev */}
          {page > 1 ? (
            <Link
              href={pageUrl(page - 1)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 glass-card hover:text-oasis-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-300 glass-card cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" /> Prev
            </span>
          )}

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={pageUrl(p)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                  p === page
                    ? 'bg-oasis-primary text-white shadow-sm'
                    : 'glass-card text-gray-600 hover:text-oasis-primary'
                }`}
              >
                {p}
              </Link>
            ))}
          </div>

          {/* Next */}
          {page < totalPages ? (
            <Link
              href={pageUrl(page + 1)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 glass-card hover:text-oasis-primary transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-300 glass-card cursor-not-allowed">
              Next <ChevronRight className="w-4 h-4" />
            </span>
          )}

          <span className="text-xs text-gray-400 ml-1">
            Page {page} of {totalPages}
          </span>
        </div>
      )}
    </div>
  )
}
