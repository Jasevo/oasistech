'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'

interface ProjectBarProps {
  data: Array<{ name: string; tasks: number; color: string }>
}

const CustomTooltip = ({
  active, payload, label,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#092421] text-white text-xs px-3 py-2 rounded-xl shadow-xl border border-[#e3ba54]/20 max-w-[160px]">
        <p className="font-semibold truncate">{label}</p>
        <p>{payload[0].value} tasks</p>
      </div>
    )
  }
  return null
}

export function ProjectBar({ data }: ProjectBarProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        No project data available
      </div>
    )
  }

  const formatted = data.map((d) => ({
    ...d,
    shortName: d.name.length > 14 ? d.name.slice(0, 13) + '…' : d.name,
  }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={formatted} margin={{ top: 5, right: 10, left: -15, bottom: 5 }} barSize={36}>
        <defs>
          <linearGradient id="barGradBrand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#092421" stopOpacity={0.85} />
            <stop offset="100%" stopColor="#1a5c47" stopOpacity={0.55} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis
          dataKey="shortName"
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(9,36,33,0.03)' }} />
        <Bar dataKey="tasks" radius={[6, 6, 0, 0]} fill="url(#barGradBrand)" animationDuration={800} />
      </BarChart>
    </ResponsiveContainer>
  )
}
