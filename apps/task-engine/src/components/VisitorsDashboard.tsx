'use client'

import { motion } from 'framer-motion'
import {
  Eye, Monitor, Smartphone, Tablet, Globe, Clock,
  TrendingUp, FileText,
} from 'lucide-react'

interface Visit {
  id: string
  page: string
  ipAddress?: string | null
  country?: string | null
  city?: string | null
  browser?: string | null
  os?: string | null
  device?: string | null
  referrer?: string | null
  createdAt: string
}

interface Stats {
  total: number
  today: number
  thisWeek: number
  thisMonth: number
  devices: { desktop: number; mobile: number; tablet: number; unknown: number }
  topPages: Array<{ page: string; count: number }>
  topBrowsers: Array<{ browser: string; count: number }>
}

const statCards = [
  { key: 'total' as const, label: 'Total Visits', icon: Eye },
  { key: 'today' as const, label: 'Today', icon: Clock },
  { key: 'thisWeek' as const, label: 'This Week', icon: TrendingUp },
  { key: 'thisMonth' as const, label: 'This Month', icon: Globe },
]

const deviceIcons = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
  unknown: Globe,
}

function formatTimeAgo(dateString: string) {
  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function VisitorsDashboard({ visits, stats }: { visits: Visit[]; stats: Stats }) {
  const totalDevices = stats.devices.desktop + stats.devices.mobile + stats.devices.tablet + stats.devices.unknown

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className="glass-card rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                    {card.label}
                  </p>
                  <motion.p
                    className="text-3xl font-black tabular-nums text-[#092421] dark:text-white"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06 + 0.15, duration: 0.35, type: 'spring' }}
                  >
                    {stats[card.key]}
                  </motion.p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Device breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="glass-card rounded-2xl p-5"
        >
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Monitor className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            Devices
          </h3>
          <div className="space-y-3">
            {(Object.entries(stats.devices) as [keyof typeof deviceIcons, number][])
              .filter(([, count]) => count > 0)
              .sort((a, b) => b[1] - a[1])
              .map(([device, count]) => {
                const DeviceIcon = deviceIcons[device]
                const pct = totalDevices > 0 ? Math.round((count / totalDevices) * 100) : 0
                return (
                  <div key={device} className="flex items-center gap-3">
                    <DeviceIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize w-16">{device}</span>
                    <div className="flex-1 h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-violet-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 w-12 text-right">
                      {pct}%
                    </span>
                  </div>
                )
              })}
            {totalDevices === 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-500">No visit data yet</p>
            )}
          </div>
        </motion.div>

        {/* Top pages */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="glass-card rounded-2xl p-5"
        >
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            Top Pages
          </h3>
          <div className="space-y-2.5">
            {stats.topPages.map((page, i) => (
              <div key={page.page} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1 mr-3">
                  <span className="text-gray-400 dark:text-gray-500 mr-1.5">{i + 1}.</span>
                  {page.page}
                </span>
                <span className="text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/20 rounded-full px-2 py-0.5">
                  {page.count}
                </span>
              </div>
            ))}
            {stats.topPages.length === 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-500">No visit data yet</p>
            )}
          </div>
        </motion.div>

        {/* Top browsers */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.3 }}
          className="glass-card rounded-2xl p-5"
        >
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            Browsers
          </h3>
          <div className="space-y-2.5">
            {stats.topBrowsers.map((b) => {
              const pct = totalDevices > 0 ? Math.round((b.count / totalDevices) * 100) : 0
              return (
                <div key={b.browser} className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 dark:text-gray-300 w-20">{b.browser}</span>
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-purple-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 w-12 text-right">
                    {b.count}
                  </span>
                </div>
              )
            })}
            {stats.topBrowsers.length === 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-500">No visit data yet</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent visits table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="glass-card rounded-2xl overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-gray-100 dark:border-white/10">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Visits</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3">Page</th>
                <th className="px-5 py-3">Browser</th>
                <th className="px-5 py-3">OS</th>
                <th className="px-5 py-3">Device</th>
                <th className="px-5 py-3">IP</th>
                <th className="px-5 py-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {visits.map((visit, i) => {
                const DeviceIcon = deviceIcons[(visit.device as keyof typeof deviceIcons) || 'unknown']
                return (
                  <motion.tr
                    key={visit.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 + i * 0.02 }}
                    className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">
                      {visit.page}
                    </td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400">
                      {visit.browser || '—'}
                    </td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400">
                      {visit.os || '—'}
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-400 capitalize">
                        <DeviceIcon className="w-3.5 h-3.5" />
                        {visit.device || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-500 font-mono text-xs">
                      {visit.ipAddress || '—'}
                    </td>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-500">
                      {formatTimeAgo(visit.createdAt)}
                    </td>
                  </motion.tr>
                )
              })}
              {visits.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-400 dark:text-gray-500">
                    No visits recorded yet. They&apos;ll appear here as people visit your site.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
