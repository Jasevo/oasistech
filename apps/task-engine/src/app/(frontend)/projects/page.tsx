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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Projects</h1>
        <p className="text-sm text-gray-500 mt-1">Organize tasks into projects.</p>
      </div>

      <ProjectFilters
        currentStatus={params.status}
        currentSearch={params.search}
        currentSort={params.sort}
        totalCount={projects.length}
      />

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
