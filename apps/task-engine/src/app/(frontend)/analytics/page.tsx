import { fetchAnalyticsData } from '@/lib/analytics'
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Analytics | OasisTech',
}

export default async function AnalyticsPage() {
  const data = await fetchAnalyticsData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Insights and metrics for your task engine.</p>
      </div>

      <AnalyticsDashboard data={data} />
    </div>
  )
}
