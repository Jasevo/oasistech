'use client'

import Link from 'next/link'
import { Users, Monitor, Smartphone, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface VisitorStripProps {
  today: number
  thisWeek: number
  total: number
  desktop: number
  mobile: number
}

export function VisitorStrip({ today, thisWeek, total, desktop, mobile }: VisitorStripProps) {
  const { t } = useLanguage()
  const devicePct = desktop + mobile > 0 ? Math.round((desktop / (desktop + mobile)) * 100) : 0

  return (
    <div className="glass-card rounded-2xl px-5 py-4 flex flex-wrap items-center gap-x-6 gap-y-3">
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-oasis-primary/10 flex items-center justify-center">
          <Users className="w-3.5 h-3.5 text-oasis-primary" />
        </div>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('siteVisitors')}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-xl font-bold text-gray-900">{today}</span>
        <span className="text-xs text-gray-400 font-medium">{t('today')}</span>
      </div>

      <div className="w-px h-5 bg-gray-200 hidden sm:block" />

      <div className="flex items-center gap-1.5">
        <span className="text-xl font-bold text-gray-900">{thisWeek}</span>
        <span className="text-xs text-gray-400 font-medium">{t('thisWeek')}</span>
      </div>

      <div className="w-px h-5 bg-gray-200 hidden sm:block" />

      <div className="flex items-center gap-1.5">
        <span className="text-xl font-bold text-gray-900">{total}</span>
        <span className="text-xs text-gray-400 font-medium">{t('allTime')}</span>
      </div>

      {(desktop + mobile) > 0 && (
        <>
          <div className="w-px h-5 bg-gray-200 hidden sm:block" />
          <div className="flex items-center gap-2.5 ml-auto">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Monitor className="w-3.5 h-3.5" />
              <span className="font-semibold text-gray-700">{devicePct}%</span>
              <span>{t('desktop')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Smartphone className="w-3.5 h-3.5" />
              <span className="font-semibold text-gray-700">{100 - devicePct}%</span>
              <span>{t('mobile')}</span>
            </div>
            <Link
              href="/visitors"
              className="flex items-center gap-1 text-xs font-semibold text-oasis-primary hover:text-oasis-accent transition-colors"
            >
              {t('details')} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
