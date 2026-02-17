'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface StatusDonutProps {
  data: Array<{ name: string; value: number; color: string }>
}

export function StatusDonut({ data }: StatusDonutProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        No data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          animationBegin={0}
          animationDuration={800}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} strokeWidth={0} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: '#092421',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '13px',
          }}
          formatter={(value: number, name: string) => [`${value} tasks`, name]}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value: string) => <span className="text-sm text-gray-600">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
