'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, FolderKanban, BarChart3, Users, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export function QuickActions() {
  const { t } = useLanguage()

  const actions = [
    { icon: Plus,         labelKey: 'createTask',  href: '/admin/collections/tasks/create', iconBg: 'bg-oasis-primary/10', iconColor: 'text-oasis-primary' },
    { icon: FolderKanban, labelKey: 'newProject',  href: '/projects', iconBg: 'bg-purple-50',  iconColor: 'text-purple-600' },
    { icon: Users,        labelKey: 'inviteUser',  href: '/users',    iconBg: 'bg-blue-50',    iconColor: 'text-blue-600' },
    { icon: BarChart3,    labelKey: 'viewReports', href: '/analytics',iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass-card rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="bg-gradient-to-r from-oasis-accent to-amber-400 p-5">
        <h2 className="text-sm font-bold text-oasis-primary uppercase tracking-wider">{t('quickActions')}</h2>
      </div>
      <div className="p-5 space-y-1">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.labelKey}
              href={action.href}
              className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-white/60 transition-all duration-200 group"
            >
              <div className={`w-10 h-10 rounded-xl ${action.iconBg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${action.iconColor}`} />
              </div>
              <p className="text-sm font-semibold text-gray-900 flex-1">{t(action.labelKey)}</p>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
            </Link>
          )
        })}
      </div>
    </motion.section>
  )
}
