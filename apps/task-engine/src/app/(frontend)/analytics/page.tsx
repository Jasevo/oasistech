import { fetchAnalyticsData } from '@/lib/analytics'
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'
import { BarChart3 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Analytics | OasisTech',
}

export default async function AnalyticsPage() {
  const data = await fetchAnalyticsData()

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
        <div className="px-6 py-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shrink-0 shadow-sm">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Analytics</h1>
            <p className="text-sm text-gray-500 mt-0.5">Insights and metrics for your task engine.</p>
          </div>
        </div>
      </div>

      <AnalyticsDashboard data={data} />
    </div>
  )
}
