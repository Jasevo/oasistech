export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
}

export function TaskCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
      <div className="flex items-start justify-between">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex items-center gap-2 pt-2">
        <Skeleton className="h-4 w-20 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}

export function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <Skeleton className="h-4 w-20 mb-2" />
      <Skeleton className="h-8 w-16" />
    </div>
  )
}
