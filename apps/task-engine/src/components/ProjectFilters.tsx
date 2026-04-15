'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { AIInputHelper } from '@/components/ai/AIInputHelper'
import { useLanguage } from '@/context/LanguageContext'

interface ProjectFiltersProps {
  currentStatus?: string
  currentSearch?: string
  currentSort?: string
  totalCount: number
}

export function ProjectFilters({ currentStatus, currentSearch, currentSort, totalCount }: ProjectFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const [search, setSearch] = useState(currentSearch || '')

  const statusTabs = [
    { value: 'all',      label: t('all') },
    { value: 'active',   label: t('active') },
    { value: 'archived', label: t('archived') },
  ]

  const sortOptions = [
    { value: '-createdAt', label: t('newestFirst') },
    { value: 'createdAt',  label: t('oldestFirst') },
    { value: 'name',       label: t('nameAZ') },
    { value: '-name',      label: t('nameZA') },
  ]

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (!value || value === 'all') params.delete(key)
      else params.set(key, value)
      router.push(`?${params.toString()}`)
    },
    [router, searchParams],
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateParams('search', search)
  }

  const clearFilters = () => { setSearch(''); router.push('/projects') }
  const hasFilters = currentStatus || currentSearch || currentSort

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Status tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => updateParams('status', tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                (currentStatus || 'all') === tab.value
                  ? 'bg-oasis-primary text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-oasis-accent/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <span className="text-sm text-gray-400 ml-1 self-center">
            {totalCount} {totalCount === 1 ? t('project') : t('projects_count')}
          </span>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('searchProjects')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-10 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:border-oasis-accent focus:ring-1 focus:ring-oasis-accent/20 focus:outline-none"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <AIInputHelper
              fieldContext="project search query"
              surroundingContext={`Projects page showing ${totalCount} projects. Current filter: status=${currentStatus || 'all'}`}
              onFill={(val) => { setSearch(val); updateParams('search', val) }}
              pageContext="Projects"
            />
          </div>
        </form>

        {/* Sort */}
        <select
          value={currentSort || '-createdAt'}
          onChange={(e) => updateParams('sort', e.target.value)}
          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:border-oasis-accent focus:outline-none min-w-[140px]"
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
          {t('clearFilters')}
        </button>
      )}
    </div>
  )
}
