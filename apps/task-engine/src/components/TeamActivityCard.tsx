'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export function TeamActivityCard() {
  const { t } = useLanguage()

  const items = [
    { initial: 'M', name: 'Michael', actionKey: 'updated a task',        time: t('today'),      from: 'from-blue-400 to-blue-600' },
    { initial: 'S', name: 'Sarah',   actionKey: 'completed a task',      time: '1h',            from: 'from-emerald-400 to-emerald-600' },
    { initial: 'A', name: 'Admin',   actionKey: 'created a new project', time: '2h',            from: 'from-oasis-accent to-amber-500' },
  ]

  return (
    <div className="glass-card rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="bg-gradient-to-r from-oasis-primary-light to-oasis-green p-5">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">{t('teamActivity')}</h2>
      </div>

      <div className="p-5 space-y-3.5">
        {items.map(({ initial, name, actionKey, time, from }) => (
          <div key={name} className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${from} flex items-center justify-center shrink-0 shadow-sm`}>
              <span className="text-white text-xs font-bold">{initial}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-semibold">{name}</span> {actionKey}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">{time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 pb-5">
        <Link
          href="/activity"
          className="flex items-center justify-center gap-1 text-xs font-semibold text-gray-500 hover:text-oasis-primary transition-colors py-2 rounded-lg hover:bg-white/40"
        >
          {t('viewMore')} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
