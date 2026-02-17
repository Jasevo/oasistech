import { Greeting } from '@/components/Greeting'
import { StatsCards } from '@/components/StatsCards'
import { TaskList } from '@/components/TaskList'
import { WelcomeSection } from '@/components/WelcomeSection'
import { QuickActions } from '@/components/QuickActions'
import { DashboardSummary } from '@/components/DashboardSummary'
import { fetchTaskStats, fetchRecentTasks } from '@/lib/tasks'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [stats, recent] = await Promise.all([
    fetchTaskStats(),
    fetchRecentTasks(5),
  ])

  const userName = process.env.DASHBOARD_USER_NAME || 'Admin'
  const hasTasks = stats.total > 0

  return (
    <div className="space-y-8">
      <Greeting name={userName} />

      <StatsCards
        total={stats.total}
        todo={stats.todo}
        inProgress={stats.inProgress}
        completed={stats.completed}
      />

      {hasTasks ? (
        <>
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
              <Link
                href="/tasks"
                className="flex items-center gap-1 text-sm font-medium text-oasis-primary hover:text-oasis-accent transition-colors"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <TaskList tasks={recent.tasks as never[]} emptyMessage="No tasks yet. Create your first task in the admin panel." />
          </section>

          <DashboardSummary
            total={stats.total}
            completed={stats.completed}
            inProgress={stats.inProgress}
          />
        </>
      ) : (
        <WelcomeSection />
      )}

      <QuickActions />
    </div>
  )
}
