'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

interface ProjectBarProps {
  data: Array<{ name: string; tasks: number; color: string }>
}

// Rich static hex colours matching project colour names
const projectColourHex: Record<string, string> = {
  blue:   '#60A5FA',
  green:  '#34D399',
  purple: '#A78BFA',
  orange: '#FB923C',
  red:    '#F87171',
  teal:   '#2DD4BF',
  pink:   '#F472B6',
  yellow: '#FBBF24',
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
      <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-xl shadow-xl max-w-[160px]">
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

  // Shorten long project names for the axis
  const formatted = data.map((d) => ({
    ...d,
    shortName: d.name.length > 14 ? d.name.slice(0, 13) + '…' : d.name,
    hexColor: projectColourHex[d.color] ?? '#818CF8',
  }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={formatted} margin={{ top: 5, right: 10, left: -15, bottom: 5 }} barSize={36}>
        <defs>
          {formatted.map((d, i) => (
            <linearGradient key={i} id={`barGrad-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={d.hexColor} stopOpacity={1} />
              <stop offset="100%" stopColor={d.hexColor} stopOpacity={0.6} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
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
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
        <Bar dataKey="tasks" radius={[6, 6, 0, 0]} animationDuration={800}>
          {formatted.map((_, i) => (
            <Cell key={i} fill={`url(#barGrad-${i})`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
