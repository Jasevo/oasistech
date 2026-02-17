'use client'

import { motion } from 'framer-motion'

interface CompletionRingProps {
  percentage: number
}

export function CompletionRing({ percentage }: CompletionRingProps) {
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
          {/* Background circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="10"
          />
          {/* Progress circle */}
          <motion.circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="#e3ba54"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-bold text-oasis-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {percentage}%
          </motion.span>
          <span className="text-xs text-gray-500 mt-0.5">Complete</span>
        </div>
      </div>
    </div>
  )
}
