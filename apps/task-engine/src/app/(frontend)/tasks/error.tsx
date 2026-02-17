'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lock, AlertCircle, RefreshCw } from 'lucide-react'

export default function TasksError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Tasks page error:', error)
  }, [error])

  const isUnauthorized =
    error.message.includes('unauthorized') ||
    error.message.includes('401') ||
    error.message.includes('403')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[60vh] flex items-center justify-center px-4"
    >
      <div className="max-w-md w-full text-center">
        {isUnauthorized ? (
          <>
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Unauthorized Access</h2>
            <p className="text-gray-500 mb-6">
              You do not have permission to view tasks. Please ensure a valid API key is configured.
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-500 mb-6">
              {error.message || 'An unexpected error occurred while loading tasks.'}
            </p>
          </>
        )}
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-oasis-primary hover:bg-oasis-primary-light text-white rounded-lg font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    </motion.div>
  )
}
