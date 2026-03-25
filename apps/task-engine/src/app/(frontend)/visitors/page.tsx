import { fetchVisits, fetchVisitStats } from '@/lib/visits'
import { VisitorsDashboard } from '@/components/VisitorsDashboard'
import { Eye } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Visitors | OasisTech',
}

export default async function VisitorsPage() {
  const [visits, stats] = await Promise.all([
    fetchVisits(50),
    fetchVisitStats(),
  ])

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500" />
        <div className="px-6 py-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shrink-0 shadow-sm">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Visitors</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Track who visits your site in real time.</p>
          </div>
          <div className="ml-auto">
            <span className="text-xs font-semibold bg-violet-50 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30 rounded-full px-3 py-1">
              {stats.total} total visits
            </span>
          </div>
        </div>
      </div>

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <VisitorsDashboard visits={visits.docs as any[]} stats={stats} />
    </div>
  )
}
