'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, FolderKanban, BarChart3, Users, ChevronRight } from 'lucide-react'

const actions = [
  {
    icon: Plus,
    title: 'Create Task',
    href: '/admin/collections/tasks/create',
    iconBg: 'bg-oasis-primary/10',
    iconColor: 'text-oasis-primary',
  },
  {
    icon: FolderKanban,
    title: 'New Project',
    href: '/projects',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    icon: Users,
    title: 'Invite User',
    href: '/users',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: BarChart3,
    title: 'View Reports',
    href: '/analytics',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
]

export function QuickActions() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass-card rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      whileHover={{ scale: 1.01 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-oasis-accent to-amber-400 p-6">
        <h2 className="text-lg font-bold text-oasis-primary uppercase tracking-wider">
          Quick Actions
        </h2>
      </div>

      {/* Actions */}
      <div className="p-6 space-y-1">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.title}
              href={action.href}
              className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-white/60 transition-all duration-200 group"
            >
              <div className={`w-10 h-10 rounded-xl ${action.iconBg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${action.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{action.title}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
            </Link>
          )
        })}
      </div>
    </motion.section>
  )
}
