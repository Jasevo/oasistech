'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { AIInputHelper } from '@/components/ai/AIInputHelper'
import { useLanguage } from '@/context/LanguageContext'

interface UserFiltersProps {
  currentRole?: string
  currentSearch?: string
  currentSort?: string
  totalCount: number
}

export function UserFilters({ currentRole, currentSearch, currentSort, totalCount }: UserFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const [search, setSearch] = useState(currentSearch || '')

  const roleTabs = [
    { value: 'all',          label: t('all') },
    { value: 'admin',        label: t('admins') },
    { value: 'api-consumer', label: t('apiConsumers') },
  ]

  const sortOptions = [
    { value: '-createdAt', label: t('newestFirst') },
    { value: 'createdAt',  label: t('oldestFirst') },
    { value: 'email',      label: t('emailAZ') },
    { value: '-email',     label: t('emailZA') },
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

  const clearFilters = () => { setSearch(''); router.push('/users') }
  const hasFilters = currentRole || currentSearch || currentSort

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Role tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {roleTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => updateParams('role', tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                (currentRole || 'all') === tab.value
                  ? 'bg-oasis-primary text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-oasis-accent/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <span className="text-sm text-gray-400 self-center ml-1">
            {totalCount} {totalCount === 1 ? t('user') : t('users_count')}
          </span>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('searchUsers')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-10 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:border-oasis-accent focus:ring-1 focus:ring-oasis-accent/20 focus:outline-none"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <AIInputHelper
              fieldContext="user search query"
              surroundingContext={`Users page showing ${totalCount} users. Filter: role=${currentRole || 'all'}`}
              onFill={(val) => { setSearch(val); updateParams('search', val) }}
              pageContext="Users"
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
