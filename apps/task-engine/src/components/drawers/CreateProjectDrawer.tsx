'use client'

import { useState, useEffect, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Loader2, FolderKanban } from 'lucide-react'
import { createProject, type ProjectColor, type ProjectStatus } from '@/actions/projects'

const COLOR_OPTIONS: { value: ProjectColor; label: string; bg: string; ring: string }[] = [
  { value: 'blue',   label: 'Blue',   bg: 'bg-blue-500',   ring: 'ring-blue-400' },
  { value: 'green',  label: 'Green',  bg: 'bg-green-500',  ring: 'ring-green-400' },
  { value: 'purple', label: 'Purple', bg: 'bg-violet-500', ring: 'ring-violet-400' },
  { value: 'orange', label: 'Orange', bg: 'bg-orange-500', ring: 'ring-orange-400' },
  { value: 'red',    label: 'Red',    bg: 'bg-red-500',    ring: 'ring-red-400' },
  { value: 'teal',   label: 'Teal',   bg: 'bg-teal-500',   ring: 'ring-teal-400' },
  { value: 'pink',   label: 'Pink',   bg: 'bg-pink-500',   ring: 'ring-pink-400' },
  { value: 'yellow', label: 'Yellow', bg: 'bg-yellow-400', ring: 'ring-yellow-300' },
]

const colorGradient: Record<ProjectColor, string> = {
  blue:   'from-blue-700 to-blue-500',
  green:  'from-green-800 to-green-500',
  purple: 'from-violet-700 to-purple-500',
  orange: 'from-orange-600 to-amber-400',
  red:    'from-red-700 to-rose-500',
  teal:   'from-teal-700 to-teal-400',
  pink:   'from-pink-600 to-rose-400',
  yellow: 'from-yellow-500 to-amber-300',
}

interface CreateProjectDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateProjectDrawer({ isOpen, onClose }: CreateProjectDrawerProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState<ProjectColor>('blue')
  const [status, setStatus] = useState<ProjectStatus>('active')

  useEffect(() => {
    if (isOpen) {
      setName('')
      setDescription('')
      setColor('blue')
      setStatus('active')
      setError(null)
      setSuccess(false)
    }
  }, [isOpen])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('Project name is required.'); return }
    setError(null)

    startTransition(async () => {
      const result = await createProject({ name, description: description || undefined, color, status })
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          onClose()
          setSuccess(false)
        }, 800)
      }
    })
  }

  const gradient = colorGradient[color]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md flex flex-col bg-white shadow-2xl"
          >
            {/* Header — color-reactive */}
            <div className={`flex items-center justify-between px-6 py-5 border-b border-white/10 bg-gradient-to-r ${gradient} shrink-0 transition-all duration-300`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-white text-lg font-bold">
                    {name.charAt(0)?.toUpperCase() || <FolderKanban className="w-5 h-5 text-white" />}
                  </span>
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">New Project</h2>
                  {name && <p className="text-xs text-white/60 mt-0.5 truncate max-w-[200px]">{name}</p>}
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Project Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Q3 Marketing Campaign"
                    maxLength={100}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-oasis-primary/30 focus:border-oasis-primary transition-all"
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What is this project about?"
                    rows={3}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-oasis-primary/30 focus:border-oasis-primary transition-all resize-none"
                  />
                </div>

                {/* Color picker */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                    Project Color
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        title={c.label}
                        onClick={() => setColor(c.value)}
                        className={`w-9 h-9 rounded-full ${c.bg} transition-all ${
                          color === c.value
                            ? `ring-2 ring-offset-2 ${c.ring} scale-110`
                            : 'hover:scale-105 opacity-70 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Initial Status
                  </label>
                  <div className="flex gap-2">
                    {(['active', 'archived'] as ProjectStatus[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStatus(s)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border capitalize transition-all ${
                          status === s
                            ? 'border-oasis-primary bg-oasis-primary text-white shadow-sm'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Preview
                  </label>
                  <div className={`rounded-xl overflow-hidden bg-gradient-to-br ${gradient} p-4 shadow-sm transition-all duration-300`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <span className="text-white text-lg font-bold">
                          {name.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{name || 'Project Name'}</p>
                        {description && <p className="text-white/60 text-xs mt-0.5 line-clamp-1">{description}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 font-medium">
                    {error}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/60 flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || success}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-oasis-primary text-white hover:bg-oasis-primary-light disabled:opacity-60 transition-all shadow-sm"
                >
                  {isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
                  ) : success ? (
                    <>✓ Created!</>
                  ) : (
                    <><Plus className="w-4 h-4" /> Create Project</>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
