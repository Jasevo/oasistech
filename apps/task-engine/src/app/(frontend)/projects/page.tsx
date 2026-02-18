import { fetchProjects } from '@/lib/projects'
import { ProjectCard } from '@/components/ProjectCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { FolderKanban } from 'lucide-react'
import { ProjectFilters } from '@/components/ProjectFilters'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Projects | OasisTech',
}

interface ProjectsPageProps {
  searchParams: Promise<{
    status?: string
    search?: string
    sort?: string
  }>
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams
  const { projects, error } = await fetchProjects({
    status: params.status,
    search: params.search,
    sort: params.sort,
  })

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-oasis-primary via-oasis-accent to-oasis-green" />
        <div className="px-6 py-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-oasis-primary to-oasis-primary-light flex items-center justify-center shrink-0 shadow-sm">
            <FolderKanban className="w-5 h-5 text-oasis-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Projects</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {projects.length} project{projects.length !== 1 ? 's' : ''} total
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-5">
        <ProjectFilters
          currentStatus={params.status}
          currentSearch={params.search}
          currentSort={params.sort}
          totalCount={projects.length}
        />
      </div>

      {/* Grid */}
      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description="Create projects in the admin panel to organize your tasks."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project as never} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
