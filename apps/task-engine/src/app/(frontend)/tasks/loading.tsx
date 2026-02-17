import { TaskCardSkeleton, StatsCardSkeleton } from '@/components/ui/Skeleton'

export default function TasksLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-32 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-4 w-48 bg-gray-200 rounded-lg animate-pulse mt-2" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
