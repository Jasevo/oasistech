'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Plus, Calendar } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

function getGreetingKey(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'goodMorning'
  if (hour < 17) return 'goodAfternoon'
  return 'goodEvening'
}

function getFormattedDate(lang: string): string {
  return new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

interface GreetingProps {
  name: string
}

export function Greeting({ name }: GreetingProps) {
  const { t, lang } = useLanguage()
  const [greetingKey, setGreetingKey] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    setGreetingKey(getGreetingKey())
    setDate(getFormattedDate(lang))
  }, [lang])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">
          {greetingKey ? t(greetingKey) : '...'},{' '}
          <span className="text-oasis-primary">{name}</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1.5">{t('overview')}</p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {date && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl glass-card text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-oasis-accent" />
            {date}
          </div>
        )}
        <Link
          href="/admin/collections/tasks/create"
          className="inline-flex items-center gap-2 bg-oasis-primary hover:bg-oasis-primary-light text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 shadow-lg shadow-oasis-primary/20 hover:shadow-xl hover:shadow-oasis-primary/30"
        >
          <Plus className="w-4 h-4" />
          {t('createTask')}
        </Link>
      </div>
    </motion.div>
  )
}
