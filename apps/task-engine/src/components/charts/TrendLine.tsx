'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface TrendLineProps {
  data: Array<{ date: string; tasks: number }>
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
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#092421" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#092421" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#6B7280' }}
          axisLine={{ stroke: '#E5E7EB' }}
          tickFormatter={(val: string) => {
            const d = new Date(val)
            return `${d.getMonth() + 1}/${d.getDate()}`
          }}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#6B7280' }}
          axisLine={{ stroke: '#E5E7EB' }}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            background: '#092421',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '13px',
          }}
          labelFormatter={(val: string) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          formatter={(value: number) => [`${value} tasks`, 'Created']}
        />
        <Area
          type="monotone"
          dataKey="tasks"
          stroke="#092421"
          strokeWidth={2}
          fill="url(#trendGradient)"
          animationDuration={1200}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
