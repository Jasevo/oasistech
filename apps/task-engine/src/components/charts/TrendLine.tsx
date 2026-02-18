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
      <div className="bg-[#092421] text-white text-xs px-3 py-2 rounded-xl shadow-xl border border-[#e3ba54]/20">
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
          <linearGradient id="trendGradBrand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#e3ba54" stopOpacity={0.25} />
            <stop offset="60%"  stopColor="#e3ba54" stopOpacity={0.08} />
            <stop offset="100%" stopColor="#e3ba54" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
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
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e3ba54', strokeWidth: 1, strokeDasharray: '4 2' }} />
        <Area
          type="monotone"
          dataKey="tasks"
          stroke="#e3ba54"
          strokeWidth={2}
          fill="url(#trendGradBrand)"
          dot={false}
          activeDot={{ r: 5, fill: '#e3ba54', stroke: '#fff', strokeWidth: 2 }}
          animationDuration={1200}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
