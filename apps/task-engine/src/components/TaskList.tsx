import { TaskCard } from './TaskCard'
import { EmptyState } from './ui/EmptyState'
import { CheckSquare } from 'lucide-react'

interface Task {
  id: string
  title: string
  description?: string | null
  status: 'todo' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate?: string | null
  project?: { id: string; name: string; color: string } | string | null
  createdAt: string
}

interface TaskListProps {
  tasks: Task[]
  emptyMessage?: string
  layout?: 'grid' | 'list'
}

export function TaskList({ tasks, emptyMessage, layout = 'grid' }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={CheckSquare}
        title="No tasks found"
        description={emptyMessage || 'Create tasks in the admin panel to see them here.'}
      />
    )
  }

  return (
    <div className={layout === 'list' ? 'space-y-2' : 'grid grid-cols-1 lg:grid-cols-2 gap-4'}>
      {tasks.map((task, index) => (
        <TaskCard key={task.id} task={task} index={index} />
      ))}
    </div>
  )
}
