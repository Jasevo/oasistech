'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export function RecentTasksHeader() {
  const { t } = useLanguage()
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-base font-bold text-gray-900">{t('recentTasks')}</h2>
      <Link
        href="/tasks"
        className="flex items-center gap-1 text-xs font-semibold text-oasis-primary hover:text-oasis-accent transition-colors"
      >
        {t('viewAll')} <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  )
}
