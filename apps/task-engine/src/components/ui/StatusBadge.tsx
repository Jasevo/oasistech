const statusConfig = {
  todo: { label: 'To Do', className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
  'in-progress': { label: 'In Progress', className: 'bg-oasis-accent/15 text-oasis-accent dark:bg-oasis-accent/20' },
  completed: { label: 'Completed', className: 'bg-oasis-primary/10 text-oasis-primary dark:bg-oasis-primary/20 dark:text-emerald-300' },
} as const

type Status = keyof typeof statusConfig

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status] || statusConfig.todo
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}
