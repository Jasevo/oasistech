'use client'

import { motion } from 'framer-motion'

interface CompletionRingProps {
  percentage: number
  size?: number
  label?: string
}

export function CompletionRing({ percentage, size = 160, label = 'Tasks Completed' }: CompletionRingProps) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
          {/* Background circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="rgba(212, 197, 169, 0.3)"
            strokeWidth="14"
          />
          {/* Progress circle */}
          <motion.circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e3ba54" />
              <stop offset="100%" stopColor="#d4a030" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-bold text-oasis-primary"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5, type: 'spring' }}
          >
            {percentage}%
          </motion.span>
          <span className="text-[11px] text-gray-500 mt-0.5 font-medium">{label}</span>
        </div>
      </div>
    </div>
  )
}
