'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface StatusDonutProps {
  data: Array<{ name: string; value: number; color: string }>
}

// Rich non-green/gold colours for status
const statusColours: Record<string, string> = {
  'To Do':       '#818CF8', // indigo-400
  'In Progress': '#38BDF8', // sky-400
  'Completed':   '#34D399', // emerald-400
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-xl shadow-xl">
        <p className="font-semibold">{payload[0].name}</p>
        <p>{payload[0].value} tasks</p>
      </div>
    )
  }
  return null
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

  // Override colours with our richer palette
  const enriched = data.map((d) => ({ ...d, color: statusColours[d.name] ?? d.color }))

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={enriched}
            cx="50%"
            cy="50%"
            innerRadius={68}
            outerRadius={105}
            paddingAngle={4}
            dataKey="value"
            animationBegin={0}
            animationDuration={900}
            strokeWidth={0}
          >
            {enriched.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={8}
            formatter={(value: string) => (
              <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Centre label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ paddingBottom: 36 }}>
        <span className="text-3xl font-black text-gray-900 tabular-nums">{total}</span>
        <span className="text-[11px] text-gray-400 font-medium mt-0.5">total tasks</span>
      </div>
    </div>
  )
}
