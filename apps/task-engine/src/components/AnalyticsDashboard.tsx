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
  {
    key: 'totalTasks'         as const,
    label: 'Total Tasks',
    icon: BarChart3,
    gradient: 'from-indigo-600 to-indigo-400',
    suffix: '',
  },
  {
    key: 'completionRate'     as const,
    label: 'Completion Rate',
    icon: CheckCircle2,
    gradient: 'from-emerald-600 to-teal-400',
    suffix: '%',
  },
  {
    key: 'overdueCount'       as const,
    label: 'Overdue',
    icon: AlertTriangle,
    gradient: 'from-rose-600 to-red-400',
    suffix: '',
  },
  {
    key: 'avgTasksPerProject' as const,
    label: 'Avg per Project',
    icon: FolderKanban,
    gradient: 'from-violet-600 to-purple-400',
    suffix: '',
  },
]

const priorityColours: Record<string, { bar: string; bg: string; text: string }> = {
  Low:    { bar: 'bg-gradient-to-r from-emerald-400 to-green-300',  bg: 'bg-emerald-50', text: 'text-emerald-700' },
  Medium: { bar: 'bg-gradient-to-r from-sky-500 to-blue-300',       bg: 'bg-sky-50',     text: 'text-sky-700' },
  High:   { bar: 'bg-gradient-to-r from-orange-500 to-amber-300',   bg: 'bg-orange-50',  text: 'text-orange-700' },
  Urgent: { bar: 'bg-gradient-to-r from-rose-600 to-red-400',       bg: 'bg-rose-50',    text: 'text-rose-700' },
}

function StatCard({
  label, value, icon: Icon, gradient, index, suffix,
}: {
  label: string; value: number; icon: typeof BarChart3
  gradient: string; index: number; suffix: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      className="glass-card rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className={`bg-gradient-to-r ${gradient} px-5 py-3 flex items-center justify-between`}>
        <p className="text-[11px] font-bold text-white/70 uppercase tracking-widest">{label}</p>
        <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
      <div className="px-5 py-4">
        <motion.p
          className="text-4xl font-black text-gray-900 tabular-nums"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.07 + 0.2, duration: 0.4, type: 'spring' }}
        >
          {value}{suffix}
        </motion.p>
      </div>
    </motion.div>
  )
}

function ChartCard({
  title, icon: Icon, headerGradient, children, index,
}: {
  title: string; icon: typeof BarChart3; headerGradient: string
  children: React.ReactNode; index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 + index * 0.1, duration: 0.4 }}
      className="glass-card rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className={`bg-gradient-to-r ${headerGradient} px-5 py-4 flex items-center gap-2`}>
        <Icon className="w-4 h-4 text-white/80" />
        <h3 className="text-xs font-bold text-white/80 uppercase tracking-widest">{title}</h3>
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
            gradient={card.gradient}
            index={i}
            suffix={card.suffix}
          />
        ))}
      </div>

      {/* Status donut + Completion ring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard
          title="Tasks by Status"
          icon={Activity}
          headerGradient="from-indigo-700 to-indigo-500"
          index={0}
        >
          <StatusDonut data={data.statusBreakdown} />
        </ChartCard>

        <ChartCard
          title="Completion Rate"
          icon={CheckCircle2}
          headerGradient="from-emerald-700 to-teal-500"
          index={1}
        >
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
        <ChartCard
          title="Tasks per Project"
          icon={FolderKanban}
          headerGradient="from-violet-700 to-purple-500"
          index={2}
        >
          <ProjectBar data={data.tasksPerProject} />
        </ChartCard>

        <ChartCard
          title="Tasks Created — Last 30 Days"
          icon={TrendingUp}
          headerGradient="from-sky-700 to-cyan-500"
          index={3}
        >
          <TrendLine data={data.trendData} />
        </ChartCard>
      </div>

      {/* Priority breakdown — horizontal gradient bars */}
      <ChartCard
        title="Tasks by Priority"
        icon={BarChart3}
        headerGradient="from-rose-700 to-orange-500"
        index={4}
      >
        {data.priorityBreakdown.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No data available</p>
        ) : (
          <div className="space-y-4">
            {data.priorityBreakdown.map((item, i) => {
              const pct = totalTasks > 0 ? Math.round((item.value / totalTasks) * 100) : 0
              const colours = priorityColours[item.name] ?? {
                bar: 'bg-gradient-to-r from-gray-400 to-gray-300',
                bg: 'bg-gray-50',
                text: 'text-gray-700',
              }
              return (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${colours.bg} ${colours.text}`}>
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-800">{item.value}</span>
                      <span className="text-xs text-gray-400">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${colours.bar}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.75, delay: 0.5 + i * 0.1, ease: 'easeOut' }}
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
