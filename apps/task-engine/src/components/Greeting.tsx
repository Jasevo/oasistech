'use client'

import { motion } from 'framer-motion'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function Greeting({ name }: { name: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">
        {getGreeting()}, <span className="text-oasis-primary">{name}</span>
      </h1>
      <p className="text-gray-500 mt-1 text-sm">
        Here&apos;s an overview of your task engine.
      </p>
    </motion.div>
  )
}
