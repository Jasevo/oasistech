import { Greeting } from '@/components/Greeting'
import { StatsCards } from '@/components/StatsCards'
import { TaskList } from '@/components/TaskList'
import { WelcomeSection } from '@/components/WelcomeSection'
import { QuickActions } from '@/components/QuickActions'
import { DashboardSummary } from '@/components/DashboardSummary'
import { TopPriorities } from '@/components/TopPriorities'
import { UpcomingDeadlines } from '@/components/UpcomingDeadlines'
import { DashboardAIWidget } from '@/components/ai/DashboardAIWidget'
import { RecentTasksHeader } from '@/components/RecentTasksHeader'
import { VisitorStrip } from '@/components/VisitorStrip'
import { TeamActivityCard } from '@/components/TeamActivityCard'
import { fetchTaskStats, fetchRecentTasks, fetchUpcomingDeadlines, fetchTopPriorityTasks } from '@/lib/tasks'
import { fetchVisitStats } from '@/lib/visits'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [stats, recent, deadlines, topPriority, visitStats] = await Promise.all([
    fetchTaskStats(),
    fetchRecentTasks(5),
    fetchUpcomingDeadlines(4),
    fetchTopPriorityTasks(3),
    fetchVisitStats(),
  ])

  const userName = process.env.DASHBOARD_USER_NAME || 'Admin'
  const hasTasks = stats.total > 0

  return (
    <div className="space-y-5 lg:space-y-6">
      <Greeting name={userName} />

      <DashboardAIWidget />

      <StatsCards
        total={stats.total}
        todo={stats.todo}
        inProgress={stats.inProgress}
        completed={stats.completed}
      />

      <VisitorStrip
        today={visitStats.today}
        thisWeek={visitStats.thisWeek}
        total={visitStats.total}
        desktop={visitStats.devices.desktop}
        mobile={visitStats.devices.mobile + visitStats.devices.tablet}
      />

      {hasTasks ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <section className="lg:col-span-2 glass-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <RecentTasksHeader />
              <TaskList
                tasks={recent.tasks as never[]}
                layout="list"
                emptyMessage="No tasks yet. Create your first task in the admin panel."
              />
            </section>

            <div className="lg:col-span-1 space-y-4">
              <DashboardSummary
                total={stats.total}
                completed={stats.completed}
                inProgress={stats.inProgress}
              />
              <UpcomingDeadlines
                tasks={deadlines.tasks as Array<{ id: string; title: string; dueDate: string; priority: string }>}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickActions />
            <TopPriorities
              tasks={topPriority.tasks as Array<{ id: string; title: string; status: string; priority?: string }>}
            />
            <TeamActivityCard />
          </div>
        </>
      ) : (
        <>
          <WelcomeSection />
          <QuickActions />
        </>
      )}
    </div>
  )
}
