'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, FolderKanban, BarChart3 } from 'lucide-react'

const actions = [
  {
    icon: Plus,
    title: 'Create Task',
    description: 'Add a new task via the admin panel',
    href: '/admin/collections/tasks/create',
  },
  {
    icon: FolderKanban,
    title: 'View Projects',
    description: 'Browse and manage your projects',
    href: '/projects',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'View charts and completion trends',
    href: '/analytics',
  },
]

export function QuickActions() {
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((action, i) => {
          const Icon = action.icon
          return (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.3 }}
            >
              <Link
                href={action.href}
                className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-oasis-accent/30 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-lg bg-oasis-primary/5 flex items-center justify-center mb-3 group-hover:bg-oasis-accent/10 transition-colors">
                  <Icon className="w-5 h-5 text-oasis-primary group-hover:text-oasis-accent transition-colors" />
                </div>
                <p className="text-sm font-semibold text-gray-900">{action.title}</p>
                <p className="text-xs text-gray-500 mt-1">{action.description}</p>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
