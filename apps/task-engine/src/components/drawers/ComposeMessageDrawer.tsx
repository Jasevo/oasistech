'use client'

import { useState, useEffect, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Loader2, User, Link2, FolderKanban, Paperclip } from 'lucide-react'
import { sendMessage } from '@/actions/messages'

interface UserOption { id: string; displayName?: string | null; email: string }
interface TaskOption { id: string; title: string }
interface ProjectOption { id: string; name: string }

interface ComposeMessageDrawerProps {
  isOpen: boolean
  onClose: () => void
  fromId: string
  users: UserOption[]
  tasks?: TaskOption[]
  projects?: ProjectOption[]
  defaultToId?: string
  defaultSubject?: string
  defaultLinkedTaskId?: string
  defaultLinkedProjectId?: string
}

export function ComposeMessageDrawer({
  isOpen,
  onClose,
  fromId,
  users,
  tasks = [],
  projects = [],
  defaultToId = '',
  defaultSubject = '',
  defaultLinkedTaskId = '',
  defaultLinkedProjectId = '',
}: ComposeMessageDrawerProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [toId, setToId] = useState(defaultToId)
  const [subject, setSubject] = useState(defaultSubject)
  const [body, setBody] = useState('')
  const [linkedTaskId, setLinkedTaskId] = useState(defaultLinkedTaskId)
  const [linkedProjectId, setLinkedProjectId] = useState(defaultLinkedProjectId)
  const [showAttachments, setShowAttachments] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setToId(defaultToId)
      setSubject(defaultSubject)
      setBody('')
      setLinkedTaskId(defaultLinkedTaskId)
      setLinkedProjectId(defaultLinkedProjectId)
      setShowAttachments(false)
      setError(null)
      setSuccess(false)
    }
  }, [isOpen, defaultToId, defaultSubject, defaultLinkedTaskId, defaultLinkedProjectId])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  const linkedTask = tasks.find(t => t.id === linkedTaskId)
  const linkedProject = projects.find(p => p.id === linkedProjectId)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!toId) { setError('Please select a recipient.'); return }
    if (!subject.trim()) { setError('Subject is required.'); return }
    if (!body.trim()) { setError('Message body is required.'); return }
    setError(null)

    startTransition(async () => {
      const result = await sendMessage({
        fromId,
        toId,
        subject: subject.trim(),
        body: body.trim(),
        linkedTaskId: linkedTaskId || undefined,
        linkedProjectId: linkedProjectId || undefined,
      })
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
            className="fixed inset-y-0 right-0 z-50 w-full max-w-lg flex flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-oasis-primary to-oasis-primary-light shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-oasis-accent/20 flex items-center justify-center">
                  <Send className="w-4 h-4 text-oasis-accent" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">New Message</h2>
                  <p className="text-xs text-white/60 mt-0.5">Send an internal message</p>
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

                {/* To */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> To
                    </span>
                  </label>
                  <select
                    value={toId}
                    onChange={(e) => setToId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-oasis-primary/30 focus:border-oasis-primary transition-all"
                  >
                    <option value="">Select recipient...</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.displayName ? `${u.displayName} (${u.email})` : u.email}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    maxLength={200}
                    placeholder="What's this about?"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-oasis-primary/30 focus:border-oasis-primary transition-all"
                    autoFocus
                  />
                </div>

                {/* Body */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={6}
                    maxLength={5000}
                    placeholder="Write your message..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-oasis-primary/30 focus:border-oasis-primary transition-all resize-none"
                  />
                </div>

                {/* Attachments toggle */}
                {(tasks.length > 0 || projects.length > 0) && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowAttachments(!showAttachments)}
                      className="flex items-center gap-2 text-xs font-semibold text-oasis-primary hover:text-oasis-primary-light transition-colors"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      {showAttachments ? 'Hide attachments' : 'Attach a task or project'}
                    </button>

                    <AnimatePresence>
                      {showAttachments && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-3 space-y-3 overflow-hidden"
                        >
                          {/* Link Task */}
                          {tasks.length > 0 && (
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                <span className="flex items-center gap-1.5">
                                  <Link2 className="w-3.5 h-3.5" /> Attach Task
                                </span>
                              </label>
                              <select
                                value={linkedTaskId}
                                onChange={(e) => {
                                  setLinkedTaskId(e.target.value)
                                  if (e.target.value) setLinkedProjectId('')
                                }}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-oasis-primary/30 focus:border-oasis-primary transition-all"
                              >
                                <option value="">No task attached</option>
                                {tasks.map((t) => (
                                  <option key={t.id} value={t.id}>{t.title}</option>
                                ))}
                              </select>
                            </div>
                          )}

                          {/* Link Project */}
                          {projects.length > 0 && (
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                <span className="flex items-center gap-1.5">
                                  <FolderKanban className="w-3.5 h-3.5" /> Attach Project
                                </span>
                              </label>
                              <select
                                value={linkedProjectId}
                                onChange={(e) => {
                                  setLinkedProjectId(e.target.value)
                                  if (e.target.value) setLinkedTaskId('')
                                }}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-oasis-primary/30 focus:border-oasis-primary transition-all"
                              >
                                <option value="">No project attached</option>
                                {projects.map((p) => (
                                  <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Attachment preview chips */}
                {(linkedTask || linkedProject) && (
                  <div className="flex flex-wrap gap-2">
                    {linkedTask && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-oasis-primary/5 text-oasis-primary border border-oasis-primary/10">
                        <Link2 className="w-3 h-3" />
                        Task: {linkedTask.title}
                        <button
                          type="button"
                          onClick={() => setLinkedTaskId('')}
                          className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {linkedProject && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-100">
                        <FolderKanban className="w-3 h-3" />
                        Project: {linkedProject.name}
                        <button
                          type="button"
                          onClick={() => setLinkedProjectId('')}
                          className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                )}

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
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                  ) : success ? (
                    <>✓ Sent!</>
                  ) : (
                    <><Send className="w-4 h-4" /> Send Message</>
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
