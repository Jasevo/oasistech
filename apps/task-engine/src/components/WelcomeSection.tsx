'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ExternalLink, FolderKanban, BarChart3, ArrowRight } from 'lucide-react'

const steps = [
  { icon: ExternalLink, title: 'Create tasks', description: 'Head to the admin panel to create and manage tasks' },
  { icon: FolderKanban, title: 'Organize into projects', description: 'Group related tasks into projects for better tracking' },
  { icon: BarChart3, title: 'Monitor progress', description: 'Use analytics to track completion rates and trends' },
]

export function WelcomeSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white rounded-2xl border border-gray-200 p-8 lg:p-12 shadow-sm"
    >
      <div className="max-w-2xl">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
          Get started with your task engine
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Your dashboard will come alive once you start creating tasks. Here&apos;s how to begin.
        </p>

        <div className="mt-8 space-y-5">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-oasis-primary/5 ring-1 ring-oasis-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-oasis-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{step.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{step.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <Link
          href="/admin"
          className="inline-flex items-center gap-2 mt-8 bg-oasis-primary text-white hover:bg-oasis-primary-light rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
        >
          Open Admin Panel <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  )
}
