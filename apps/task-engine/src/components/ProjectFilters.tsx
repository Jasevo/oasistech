'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback } from 'react'
import { Search, X } from 'lucide-react'

interface ProjectFiltersProps {
  currentStatus?: string
  currentSearch?: string
  currentSort?: string
  totalCount: number
}

export function ProjectFilters({
  currentStatus,
  currentSearch,
  currentSort,
  totalCount,
}: ProjectFiltersProps) {
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
    router.push('/projects')
  }

  const hasFilters = currentStatus || currentSearch || currentSort

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Status tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {['all', 'active', 'archived'].map((status) => (
            <button
              key={status}
              onClick={() => updateParams('status', status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                (currentStatus || 'all') === status
                  ? 'bg-oasis-primary text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-oasis-accent/40'
              }`}
            >
              {status}
            </button>
          ))}
          <span className="text-sm text-gray-400 ml-1 self-center">
            {totalCount} project{totalCount !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:border-oasis-accent focus:ring-1 focus:ring-oasis-accent/20 focus:outline-none"
          />
        </form>

        {/* Sort */}
        <select
          value={currentSort || '-createdAt'}
          onChange={(e) => updateParams('sort', e.target.value)}
          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:border-oasis-accent focus:outline-none min-w-[140px]"
        >
          <option value="-createdAt">Newest First</option>
          <option value="createdAt">Oldest First</option>
          <option value="name">Name A-Z</option>
          <option value="-name">Name Z-A</option>
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
