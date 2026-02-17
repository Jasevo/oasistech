const priorityConfig = {
  low: { label: 'Low', className: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  medium: { label: 'Medium', className: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  high: { label: 'High', className: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  urgent: { label: 'Urgent', className: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
} as const

type Priority = keyof typeof priorityConfig

export function PriorityBadge({ priority }: { priority: Priority }) {
  const config = priorityConfig[priority] || priorityConfig.medium
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}
