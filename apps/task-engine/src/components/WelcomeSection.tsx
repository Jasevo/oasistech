'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ExternalLink, FolderKanban, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react'

const steps = [
  { icon: ExternalLink, title: 'Create your first task', description: 'Head to the admin panel to create and manage tasks' },
  { icon: FolderKanban, title: 'Add a project', description: 'Group related tasks into projects for better tracking' },
  { icon: BarChart3, title: 'Invite your team members', description: 'Collaborate with your team on tasks and projects' },
  { icon: CheckCircle2, title: 'View analytics', description: 'Track completion rates and monitor trends' },
]

export function WelcomeSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-card rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-oasis-primary to-oasis-green p-6">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider">
          Get Started
        </h2>
      </div>

      {/* Steps */}
      <div className="p-6 space-y-1">
        {steps.map((step, i) => {
          const Icon = step.icon
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/40 transition-colors group cursor-pointer"
            >
              <div className="w-6 h-6 rounded-md border-2 border-gray-300 group-hover:border-oasis-accent flex items-center justify-center shrink-0 transition-colors">
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{step.title}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-oasis-accent transition-colors shrink-0" />
            </motion.div>
          )
        })}
      </div>

      {/* CTA */}
      <div className="px-6 pb-6">
        <Link
          href="/admin"
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-oasis-primary to-oasis-green text-white hover:opacity-90 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 shadow-lg"
        >
          Complete Setup <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  )
}
