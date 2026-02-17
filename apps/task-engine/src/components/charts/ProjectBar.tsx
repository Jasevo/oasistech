'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ProjectBarProps {
  data: Array<{ name: string; tasks: number; color: string }>
}

export function ProjectBar({ data }: ProjectBarProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        No project data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: '#6B7280' }}
          axisLine={{ stroke: '#E5E7EB' }}
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
          formatter={(value: number) => [`${value} tasks`, 'Tasks']}
        />
        <Bar
          dataKey="tasks"
          fill="#e3ba54"
          radius={[4, 4, 0, 0]}
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
