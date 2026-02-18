'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'

interface TrendLineProps {
  data: Array<{ date: string; tasks: number }>
}

const CustomTooltip = ({
  active, payload, label,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) => {
  if (active && payload && payload.length) {
    const d = label ? new Date(label) : null
    const formatted = d
      ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : label
    return (
      <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-xl shadow-xl">
        <p className="font-semibold">{formatted}</p>
        <p>{payload[0].value} task{payload[0].value !== 1 ? 's' : ''} created</p>
      </div>
    )
  }
  return null
}

export function TrendLine({ data }: TrendLineProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        No trend data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
        <defs>
          {/* Indigo → violet gradient fill */}
          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#818CF8" stopOpacity={0.45} />
            <stop offset="60%"  stopColor="#A78BFA" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#C4B5FD" stopOpacity={0} />
          </linearGradient>
          {/* Glow filter for the stroke */}
          <filter id="trendGlow" x="-10%" y="-30%" width="120%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: '#9CA3AF' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(val: string) => {
            const d = new Date(val)
            return `${d.getMonth() + 1}/${d.getDate()}`
          }}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#818CF8', strokeWidth: 1, strokeDasharray: '4 2' }} />
        <Area
          type="monotone"
          dataKey="tasks"
          stroke="#6366F1"
          strokeWidth={2.5}
          fill="url(#trendGrad)"
          dot={false}
          activeDot={{ r: 5, fill: '#6366F1', stroke: '#fff', strokeWidth: 2 }}
          animationDuration={1200}
          filter="url(#trendGlow)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
