import { fetchTasks } from '@/lib/tasks'
import { fetchProjects } from '@/lib/projects'
import { TaskList } from '@/components/TaskList'
import { TaskFilters } from '@/components/TaskFilters'

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tasks</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and track all your tasks.</p>
      </div>

      <TaskFilters
        currentStatus={params.status}
        currentPriority={params.priority}
        currentProject={params.project}
        currentSearch={params.search}
        currentSort={params.sort}
        projects={(projectsResult.projects as Array<{ id: string | number; name?: string }>).map((p) => ({ id: String(p.id), name: String(p.name ?? '') }))}
        totalDocs={tasksResult.totalDocs}
      />

      <TaskList
        tasks={tasksResult.tasks as never[]}
        emptyMessage="No tasks match your filters. Try adjusting your search criteria."
      />

      {tasksResult.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          {Array.from({ length: tasksResult.totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`?${new URLSearchParams({ ...params, page: String(p) }).toString()}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? 'bg-oasis-primary text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-oasis-accent/40'
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
