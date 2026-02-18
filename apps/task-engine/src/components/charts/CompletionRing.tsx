'use client'

import { motion } from 'framer-motion'

interface CompletionRingProps {
  percentage: number
  size?: number
  label?: string
}

export function CompletionRing({
  percentage,
  size = 160,
  label = 'Completed',
}: CompletionRingProps) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center shrink-0">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#e3ba54" />
              <stop offset="100%" stopColor="#b8960e" />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke="#F3F4F6"
            strokeWidth="13"
          />
          {/* Progress arc */}
          <motion.circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="13"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.3, ease: 'easeOut' }}
          />
        </svg>
        {/* Centre text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-black text-[#092421] tabular-nums"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.45, type: 'spring' }}
          >
            {percentage}%
          </motion.span>
          <span className="text-[11px] text-gray-400 font-medium mt-0.5">{label}</span>
        </div>
      </div>
    </div>
  )
}
