import { Check } from 'lucide-react'

const steps = [
  { key: 'todo', label: 'To Do' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
] as const

export function ProgressTracker({ status }: { status: string }) {
  const currentIndex = steps.findIndex((s) => s.key === status)

  return (
    <div className="flex items-center gap-0 w-full max-w-md">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = index === currentIndex
        const isLast = index === steps.length - 1

        return (
          <div key={step.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors
                  ${isCompleted ? 'bg-oasis-primary text-white' : ''}
                  ${isCurrent ? 'bg-oasis-accent text-oasis-primary ring-4 ring-oasis-accent/20' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-gray-200 text-gray-500' : ''}
                `}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span className={`text-[11px] mt-1.5 font-medium whitespace-nowrap ${isCurrent ? 'text-oasis-primary' : 'text-gray-500'}`}>
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`flex-1 h-0.5 mx-2 mt-[-18px] transition-colors ${
                  isCompleted ? 'bg-oasis-primary' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
