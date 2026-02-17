'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback } from 'react'
import { Search } from 'lucide-react'

interface UserFiltersProps {
  currentRole?: string
  currentSearch?: string
  totalCount: number
}

export function UserFilters({ currentRole, currentSearch, totalCount }: UserFiltersProps) {
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

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex gap-2">
        {[
          { value: 'all', label: 'All' },
          { value: 'admin', label: 'Admins' },
          { value: 'api-consumer', label: 'API Consumers' },
        ].map((role) => (
          <button
            key={role.value}
            onClick={() => updateParams('role', role.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              (currentRole || 'all') === role.value
                ? 'bg-oasis-primary text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-oasis-accent/40'
            }`}
          >
            {role.label}
          </button>
        ))}
        <span className="text-sm text-gray-400 self-center ml-1">{totalCount} users</span>
      </div>

      <form onSubmit={handleSearch} className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:border-oasis-accent focus:ring-1 focus:ring-oasis-accent/20 focus:outline-none"
        />
      </form>
    </div>
  )
}
