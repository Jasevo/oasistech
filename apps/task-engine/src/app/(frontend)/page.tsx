import { Greeting } from '@/components/Greeting'
import { StatsCards } from '@/components/StatsCards'
import { TaskList } from '@/components/TaskList'
import { WelcomeSection } from '@/components/WelcomeSection'
import { QuickActions } from '@/components/QuickActions'
import { DashboardSummary } from '@/components/DashboardSummary'
import { TopPriorities } from '@/components/TopPriorities'
import { UpcomingDeadlines } from '@/components/UpcomingDeadlines'
import { fetchTaskStats, fetchRecentTasks, fetchUpcomingDeadlines } from '@/lib/tasks'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [stats, recent, deadlines] = await Promise.all([
    fetchTaskStats(),
    fetchRecentTasks(5),
    fetchUpcomingDeadlines(4),
  ])

  const userName = process.env.DASHBOARD_USER_NAME || 'Admin'
  const hasTasks = stats.total > 0

  const priorityTasks = (recent.tasks as Array<{ id: string; title: string; status: string }>)
    .filter((t) => t.status !== 'completed')
    .slice(0, 3)

  return (
    <div className="space-y-5 lg:space-y-6">
      {/* Greeting bar */}
      <Greeting name={userName} />

      {/* Stats cards row */}
      <StatsCards
        total={stats.total}
        todo={stats.todo}
        inProgress={stats.inProgress}
        completed={stats.completed}
      />

      {hasTasks ? (
        <>
          {/* Middle section: Recent Tasks + Progress Overview side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Recent Tasks - takes 2 columns */}
            <section className="lg:col-span-2 glass-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-gray-900">Recent Tasks</h2>
                <Link
                  href="/tasks"
                  className="flex items-center gap-1 text-xs font-semibold text-oasis-primary hover:text-oasis-accent transition-colors"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <TaskList tasks={recent.tasks as never[]} layout="list" emptyMessage="No tasks yet. Create your first task in the admin panel." />
            </section>

            {/* Right column: Progress Overview + Upcoming Deadlines stacked */}
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

          {/* Bottom section: Quick Actions + Top Priorities + Team Activity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickActions />
            <TopPriorities tasks={priorityTasks} />
            <TeamActivity />
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

function TeamActivity() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-800 to-rose-600 p-6">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider">
          Team Activity
        </h2>
      </div>

      {/* Activity items */}
      <div className="p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-white text-xs font-bold">M</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm text-gray-900">
              <span className="font-semibold">Michael</span> updated a task
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">Just Now</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm text-gray-900">
              <span className="font-semibold">Sarah</span> completed a task
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">1 hour ago</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-oasis-accent to-amber-600 flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm text-gray-900">
              <span className="font-semibold">Admin</span> created a new project
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">2 hours ago</p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <Link
          href="/activity"
          className="flex items-center justify-center gap-1 text-xs font-semibold text-gray-500 hover:text-oasis-primary transition-colors py-2 rounded-lg hover:bg-white/40"
        >
          View More <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
