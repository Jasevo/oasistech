'use client'

import { motion } from 'framer-motion'
import { BarChart3, CheckCircle2, AlertTriangle, FolderKanban } from 'lucide-react'
import { StatusDonut } from './charts/StatusDonut'
import { ProjectBar } from './charts/ProjectBar'
import { TrendLine } from './charts/TrendLine'
import { CompletionRing } from './charts/CompletionRing'

interface AnalyticsData {
  totalTasks: number
  completionRate: number
  overdueCount: number
  avgTasksPerProject: number
  statusBreakdown: Array<{ name: string; value: number; color: string }>
  priorityBreakdown: Array<{ name: string; value: number; color: string }>
  tasksPerProject: Array<{ name: string; tasks: number; color: string }>
  trendData: Array<{ date: string; tasks: number }>
}

function StatCard({ label, value, icon: Icon, index }: { label: string; value: string | number; icon: typeof BarChart3; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="bg-white rounded-xl border border-gray-200 p-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-oasis-primary/5 flex items-center justify-center">
          <Icon className="w-5 h-5 text-oasis-primary" />
        </div>
      </div>
    </motion.div>
  )
}

function ChartCard({ title, children, index }: { title: string; children: React.ReactNode; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
      className="bg-white rounded-xl border border-gray-200 p-5"
    >
      <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
      {children}
    </motion.div>
  )
}

export function AnalyticsDashboard({ data }: { data: AnalyticsData }) {
  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tasks" value={data.totalTasks} icon={BarChart3} index={0} />
        <StatCard label="Completion Rate" value={`${data.completionRate}%`} icon={CheckCircle2} index={1} />
        <StatCard label="Overdue" value={data.overdueCount} icon={AlertTriangle} index={2} />
        <StatCard label="Avg per Project" value={data.avgTasksPerProject} icon={FolderKanban} index={3} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Tasks by Status" index={0}>
          <StatusDonut data={data.statusBreakdown} />
        </ChartCard>

        <ChartCard title="Completion Rate" index={1}>
          <CompletionRing percentage={data.completionRate} />
        </ChartCard>

        <ChartCard title="Tasks per Project" index={2}>
          <ProjectBar data={data.tasksPerProject} />
        </ChartCard>

        <ChartCard title="Tasks Created Over Time (30 days)" index={3}>
          <TrendLine data={data.trendData} />
        </ChartCard>
      </div>

      {/* Priority breakdown */}
      <ChartCard title="Tasks by Priority" index={4}>
        <div className="flex items-center gap-6 flex-wrap">
          {data.priorityBreakdown.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-gray-600">{item.name}</span>
              <span className="text-sm font-semibold text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  )
}
