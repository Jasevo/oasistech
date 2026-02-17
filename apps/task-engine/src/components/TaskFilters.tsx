'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback } from 'react'
import { Search, X, SlidersHorizontal } from 'lucide-react'

const statusTabs = [
  { value: 'all', label: 'All' },
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]

const priorityOptions = [
  { value: 'all', label: 'All Priorities' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const sortOptions = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt', label: 'Oldest First' },
  { value: '-dueDate', label: 'Due Date (Latest)' },
  { value: 'dueDate', label: 'Due Date (Earliest)' },
  { value: 'title', label: 'Title A-Z' },
  { value: '-title', label: 'Title Z-A' },
  { value: '-priority', label: 'Priority (High First)' },
]

interface TaskFiltersProps {
  currentStatus?: string
  currentPriority?: string
  currentProject?: string
  currentSearch?: string
  currentSort?: string
  projects: Array<{ id: string; name: string }>
  totalDocs: number
}

export function TaskFilters({
  currentStatus,
  currentPriority,
  currentProject,
  currentSearch,
  currentSort,
  projects,
  totalDocs,
}: TaskFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(currentSearch || '')

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (!value || value === 'all') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
      params.delete('page')
      router.push(`?${params.toString()}`)
    },
    [router, searchParams]
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateParams('search', search)
  }

  const clearFilters = () => {
    setSearch('')
    router.push('/tasks')
  }

  const hasFilters = currentStatus || currentPriority || currentProject || currentSearch || currentSort

  return (
    <div className="space-y-4">
      {/* Status Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin pb-1">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => updateParams('status', tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors min-w-[44px] ${
              (currentStatus || 'all') === tab.value
                ? 'bg-oasis-primary text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-oasis-accent/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
        <span className="text-sm text-gray-400 ml-2 whitespace-nowrap">{totalDocs} results</span>
      </div>

      {/* Search + Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:border-oasis-accent focus:ring-1 focus:ring-oasis-accent/20 focus:outline-none"
          />
        </form>

        <select
          value={currentPriority || 'all'}
          onChange={(e) => updateParams('priority', e.target.value)}
          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:border-oasis-accent focus:outline-none min-w-[140px]"
        >
          {priorityOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {projects.length > 0 && (
          <select
            value={currentProject || ''}
            onChange={(e) => updateParams('project', e.target.value)}
            className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:border-oasis-accent focus:outline-none min-w-[140px]"
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        )}

        <select
          value={currentSort || '-createdAt'}
          onChange={(e) => updateParams('sort', e.target.value)}
          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:border-oasis-accent focus:outline-none min-w-[160px]"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-oasis-primary transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Clear all filters
        </button>
      )}
    </div>
  )
}
