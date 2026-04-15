import { Greeting } from '@/components/Greeting'
import { StatsCards } from '@/components/StatsCards'
import { TaskList } from '@/components/TaskList'
import { WelcomeSection } from '@/components/WelcomeSection'
import { QuickActions } from '@/components/QuickActions'
import { DashboardSummary } from '@/components/DashboardSummary'
import { TopPriorities } from '@/components/TopPriorities'
import { UpcomingDeadlines } from '@/components/UpcomingDeadlines'
import { DashboardAIWidget } from '@/components/ai/DashboardAIWidget'
import { fetchTaskStats, fetchRecentTasks, fetchUpcomingDeadlines, fetchTopPriorityTasks } from '@/lib/tasks'
import { fetchVisitStats } from '@/lib/visits'
import Link from 'next/link'
import { ArrowRight, Users, Monitor, Smartphone } from 'lucide-react'

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
      {/* Greeting bar */}
      <Greeting name={userName} />

      {/* Oasis AI live insight banner */}
      <DashboardAIWidget />

      {/* Stats cards */}
      <StatsCards
        total={stats.total}
        todo={stats.todo}
        inProgress={stats.inProgress}
        completed={stats.completed}
      />

      {/* Visitor strip — real data from site-visits collection */}
      <VisitorStrip
        today={visitStats.today}
        thisWeek={visitStats.thisWeek}
        total={visitStats.total}
        desktop={visitStats.devices.desktop}
        mobile={visitStats.devices.mobile + visitStats.devices.tablet}
      />

      {hasTasks ? (
        <>
          {/* Main content: Recent Tasks (2/3) + right column (1/3) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                tasks={
                  deadlines.tasks as Array<{
                    id: string
                    title: string
                    dueDate: string
                    priority: string
                  }>
                }
              />
            </div>
          </div>

          {/* Bottom row: Quick Actions (1/3) + Top Priorities (1/3) + Team Activity (1/3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickActions />
            <TopPriorities
              tasks={
                topPriority.tasks as Array<{
                  id: string
                  title: string
                  status: string
                  priority?: string
                }>
              }
            />
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

/* ─── Visitor strip ─────────────────────────────────────────────────────── */

interface VisitorStripProps {
  today: number
  thisWeek: number
  total: number
  desktop: number
  mobile: number
}

function VisitorStrip({ today, thisWeek, total, desktop, mobile }: VisitorStripProps) {
  const devicePct = desktop + mobile > 0 ? Math.round((desktop / (desktop + mobile)) * 100) : 0

  return (
    <div className="glass-card rounded-2xl px-5 py-4 flex flex-wrap items-center gap-x-6 gap-y-3">
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-oasis-primary/10 flex items-center justify-center">
          <Users className="w-3.5 h-3.5 text-oasis-primary" />
        </div>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Site Visitors</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-xl font-bold text-gray-900">{today}</span>
        <span className="text-xs text-gray-400 font-medium">today</span>
      </div>

      <div className="w-px h-5 bg-gray-200 hidden sm:block" />

      <div className="flex items-center gap-1.5">
        <span className="text-xl font-bold text-gray-900">{thisWeek}</span>
        <span className="text-xs text-gray-400 font-medium">this week</span>
      </div>

      <div className="w-px h-5 bg-gray-200 hidden sm:block" />

      <div className="flex items-center gap-1.5">
        <span className="text-xl font-bold text-gray-900">{total}</span>
        <span className="text-xs text-gray-400 font-medium">all time</span>
      </div>

      {/* Device split — only show when there's data */}
      {(desktop + mobile) > 0 && (
        <>
          <div className="w-px h-5 bg-gray-200 hidden sm:block" />
          <div className="flex items-center gap-2.5 ml-auto">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Monitor className="w-3.5 h-3.5" />
              <span className="font-semibold text-gray-700">{devicePct}%</span>
              <span>desktop</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Smartphone className="w-3.5 h-3.5" />
              <span className="font-semibold text-gray-700">{100 - devicePct}%</span>
              <span>mobile</span>
            </div>
            <Link
              href="/visitors"
              className="flex items-center gap-1 text-xs font-semibold text-oasis-primary hover:text-oasis-accent transition-colors"
            >
              Details <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

/* ─── Team Activity ──────────────────────────────────────────────────────── */

function TeamActivity() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* Header — on-brand: matches the oasis primary palette */}
      <div className="bg-gradient-to-r from-oasis-primary-light to-oasis-green p-5">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Team Activity</h2>
      </div>

      <div className="p-5 space-y-3.5">
        {[
          { initial: 'M', name: 'Michael', action: 'updated a task',       time: 'Just now',    from: 'from-blue-400 to-blue-600' },
          { initial: 'S', name: 'Sarah',   action: 'completed a task',     time: '1 hour ago',  from: 'from-emerald-400 to-emerald-600' },
          { initial: 'A', name: 'Admin',   action: 'created a new project',time: '2 hours ago', from: 'from-oasis-accent to-amber-500' },
        ].map(({ initial, name, action, time, from }) => (
          <div key={name} className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${from} flex items-center justify-center shrink-0 shadow-sm`}>
              <span className="text-white text-xs font-bold">{initial}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-semibold">{name}</span> {action}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">{time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 pb-5">
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
