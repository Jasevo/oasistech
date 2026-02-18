'use client'

import { motion } from 'framer-motion'
import {
  BarChart3, CheckCircle2, AlertTriangle, FolderKanban,
  TrendingUp, Activity,
} from 'lucide-react'
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

const statCards = [
  { key: 'totalTasks'         as const, label: 'Total Tasks',      icon: BarChart3,      suffix: '' },
  { key: 'completionRate'     as const, label: 'Completion Rate',  icon: CheckCircle2,   suffix: '%' },
  { key: 'overdueCount'       as const, label: 'Overdue',          icon: AlertTriangle,  suffix: '', warn: true },
  { key: 'avgTasksPerProject' as const, label: 'Avg per Project',  icon: FolderKanban,   suffix: '' },
]

const priorityConfig: Record<string, { accent: string; bg: string; text: string }> = {
  Low:    { accent: '#1a5c47', bg: 'bg-[#092421]/5',  text: 'text-[#092421]/70' },
  Medium: { accent: '#e3ba54', bg: 'bg-[#e3ba54]/8',  text: 'text-[#b8960e]' },
  High:   { accent: '#b8860b', bg: 'bg-amber-50',     text: 'text-amber-700' },
  Urgent: { accent: '#8b0000', bg: 'bg-red-50/60',    text: 'text-red-800' },
}

function StatCard({
  label, value, icon: Icon, index, suffix, warn,
}: {
  label: string; value: number; icon: typeof BarChart3
  index: number; suffix: string; warn?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="glass-card rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
          <motion.p
            className={`text-3xl font-black tabular-nums ${warn && value > 0 ? 'text-red-700' : 'text-[#092421]'}`}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.06 + 0.15, duration: 0.35, type: 'spring' }}
          >
            {value}{suffix}
          </motion.p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          warn && value > 0 ? 'bg-red-50 text-red-600' : 'bg-[#092421]/[0.06] text-[#092421]'
        }`}>
          <Icon className="w-[18px] h-[18px]" />
        </div>
      </div>
    </motion.div>
  )
}

function ChartCard({
  title, icon: Icon, children, index,
}: {
  title: string; icon: typeof BarChart3
  children: React.ReactNode; index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.08, duration: 0.35 }}
      className="glass-card rounded-2xl overflow-hidden"
    >
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-[#092421]/[0.06] flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-[#092421]" />
        </div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  )
}

export function AnalyticsDashboard({ data }: { data: AnalyticsData }) {
  const totalTasks = data.totalTasks

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <StatCard
            key={card.key}
            label={card.label}
            value={data[card.key]}
            icon={card.icon}
            index={i}
            suffix={card.suffix}
            warn={card.warn}
          />
        ))}
      </div>

      {/* Status donut + Completion ring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Tasks by Status" icon={Activity} index={0}>
          <StatusDonut data={data.statusBreakdown} />
        </ChartCard>

        <ChartCard title="Completion Rate" icon={CheckCircle2} index={1}>
          <div className="flex items-center justify-center gap-10 py-4">
            <CompletionRing percentage={data.completionRate} />
            <div className="space-y-3">
              {data.statusBreakdown.map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-xs text-gray-500 w-20">{s.name}</span>
                  <span className="text-sm font-bold text-gray-800">{s.value}</span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-2">
                <span className="text-[11px] text-gray-400">of {totalTasks} total tasks</span>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Project bar + Trend line */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Tasks per Project" icon={FolderKanban} index={2}>
          <ProjectBar data={data.tasksPerProject} />
        </ChartCard>

        <ChartCard title="Tasks Created — Last 30 Days" icon={TrendingUp} index={3}>
          <TrendLine data={data.trendData} />
        </ChartCard>
      </div>

      {/* Priority breakdown */}
      <ChartCard title="Tasks by Priority" icon={BarChart3} index={4}>
        {data.priorityBreakdown.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No data available</p>
        ) : (
          <div className="space-y-4">
            {data.priorityBreakdown.map((item, i) => {
              const pct = totalTasks > 0 ? Math.round((item.value / totalTasks) * 100) : 0
              const config = priorityConfig[item.name] ?? {
                accent: '#092421', bg: 'bg-gray-50', text: 'text-gray-700',
              }
              return (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${config.bg} ${config.text}`}>
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-800">{item.value}</span>
                      <span className="text-xs text-gray-400">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: config.accent }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, delay: 0.4 + i * 0.08, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </ChartCard>
    </div>
  )
}
