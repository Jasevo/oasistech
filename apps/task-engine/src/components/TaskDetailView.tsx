'use client'

import { useState, useEffect, useCallback, useTransition } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  FolderKanban,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Loader2,
  Tag,
  RefreshCw,
  Pencil,
  Trash2,
  User,
  MessageSquare,
  Send,
  Link2,
} from 'lucide-react'
import { deleteTask } from '@/actions/tasks'
import { createComment, deleteComment, fetchTaskComments } from '@/actions/comments'
import { EditTaskDrawer } from './drawers/EditTaskDrawer'
import { DeleteConfirmDialog } from './drawers/DeleteConfirmDialog'

interface Project {
  id: string
  name: string
}

interface Comment {
  id: string
  body: string
  createdAt: string
  author?: { id: string; displayName?: string | null; email: string } | null
  mentionedTask?: { id: string; title: string } | null
}

interface Task {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  dueDate: string | null
  createdAt: string
  updatedAt: string
  project?: { id: string; name: string } | string | null
  assignee?: { id: string; displayName?: string | null; email: string } | string | null
}

interface UserOption { id: string; displayName?: string | null; email: string }

interface TaskDetailViewProps {
  task: Task
  projectName: string | null
  projectId: string | null
  projects: Project[]
  users?: UserOption[]
  currentUserId: string
  initialComments: Comment[]
  allTasks: Array<{ id: string; title: string }>
}

const statusConfig = {
  todo: {
    label: 'To Do',
    icon: Circle,
    badgeClass: 'bg-gray-100 text-gray-700',
    gradient: 'from-slate-700 to-slate-500',
    ring: 'ring-slate-300',
  },
  'in-progress': {
    label: 'In Progress',
    icon: Loader2,
    badgeClass: 'bg-oasis-accent/15 text-oasis-accent',
    gradient: 'from-oasis-primary-light to-oasis-green',
    ring: 'ring-oasis-accent/30',
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    badgeClass: 'bg-emerald-100 text-emerald-700',
    gradient: 'from-emerald-800 to-emerald-500',
    ring: 'ring-emerald-300',
  },
} as const

const priorityConfig = {
  low: { label: 'Low', dot: 'bg-green-500', textClass: 'text-green-700', bgClass: 'bg-green-50' },
  medium: { label: 'Medium', dot: 'bg-blue-500', textClass: 'text-blue-700', bgClass: 'bg-blue-50' },
  high: { label: 'High', dot: 'bg-orange-500', textClass: 'text-orange-700', bgClass: 'bg-orange-50' },
  urgent: { label: 'Urgent', dot: 'bg-red-500', textClass: 'text-red-700', bgClass: 'bg-red-50' },
} as const

const steps = [
  { key: 'todo', label: 'To Do' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
] as const

function ProgressBar({ status }: { status: string }) {
  const currentIndex = steps.findIndex((s) => s.key === status)
  const pct = currentIndex === 0 ? 0 : currentIndex === 1 ? 50 : 100

  return (
    <div className="space-y-3">
      <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-oasis-accent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const done = index < currentIndex
          const active = index === currentIndex
          return (
            <div key={step.key} className="flex flex-col items-center gap-1">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all
                  ${done ? 'bg-oasis-accent text-oasis-primary' : ''}
                  ${active ? 'bg-white text-oasis-primary ring-2 ring-oasis-accent' : ''}
                  ${!done && !active ? 'bg-white/20 text-white/60' : ''}
                `}
              >
                {done ? '✓' : index + 1}
              </div>
              <span className={`text-[10px] font-semibold ${active ? 'text-white' : 'text-white/60'}`}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function TaskDetailView({ task, projectName, projectId, projects, users = [], currentUserId, initialComments, allTasks }: TaskDetailViewProps) {
  const [mounted, setMounted] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  // Comments state
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [commentBody, setCommentBody] = useState('')
  const [mentionedTaskId, setMentionedTaskId] = useState('')
  const [commentPending, startCommentTransition] = useTransition()
  const [commentError, setCommentError] = useState<string | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const now = new Date()
  const isOverdue = mounted && task.dueDate && task.status !== 'completed' && new Date(task.dueDate) < now

  const status = statusConfig[task.status as keyof typeof statusConfig] ?? statusConfig.todo
  const priority = priorityConfig[task.priority as keyof typeof priorityConfig] ?? priorityConfig.medium

  const daysUntilDue = mounted && task.dueDate
    ? Math.ceil((new Date(task.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay },
  })

  const handleDelete = useCallback(() => deleteTask(task.id), [task.id])

  const assignee =
    task.assignee && typeof task.assignee === 'object' ? task.assignee : null

  function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!commentBody.trim()) return
    setCommentError(null)
    startCommentTransition(async () => {
      const result = await createComment({
        taskId: task.id,
        authorId: currentUserId,
        body: commentBody,
        mentionedTaskId: mentionedTaskId || undefined,
      })
      if (result.error) {
        setCommentError(result.error)
      } else if (result.comment) {
        const self = users.find(u => u.id === currentUserId)
        const newComment: Comment = {
          id: String(result.comment.id),
          body: commentBody,
          createdAt: result.comment.createdAt,
          author: self
            ? { id: self.id, displayName: self.displayName ?? null, email: self.email }
            : null,
          mentionedTask: mentionedTaskId
            ? allTasks.find(t => t.id === mentionedTaskId) ?? null
            : null,
        }
        setComments(prev => [...prev, newComment])
        setCommentBody('')
        setMentionedTaskId('')
      }
    })
  }

  function handleDeleteComment(commentId: string) {
    startCommentTransition(async () => {
      const result = await deleteComment(commentId, task.id)
      if (!result.error) {
        setComments(prev => prev.filter(c => c.id !== commentId))
      }
    })
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Left column (hero + description) ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Hero banner */}
          <motion.div
            {...fadeUp(0)}
            className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${status.gradient} shadow-lg`}
          >
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
            <div className="absolute -bottom-10 -left-6 w-32 h-32 rounded-full bg-white/5" />

            <div className="relative p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white">
                  <status.icon className="w-3.5 h-3.5" />
                  {status.label}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${priority.bgClass} ${priority.textClass}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                  {priority.label} Priority
                </span>
                {isOverdue && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-200">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Overdue
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-6">
                {task.title}
              </h1>

              <ProgressBar status={task.status} />
            </div>
          </motion.div>

          {/* Description */}
          {task.description && (
            <motion.div
              {...fadeUp(0.1)}
              className="glass-card rounded-2xl p-6 hover:shadow-md transition-shadow"
            >
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                {task.description}
              </p>
            </motion.div>
          )}

          {/* Action buttons */}
          <motion.div {...fadeUp(0.2)} className="flex items-center gap-3 flex-wrap">
            <Link
              href="/tasks"
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 glass-card rounded-xl hover:shadow-md hover:text-oasis-primary transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Tasks
            </Link>
            <button
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-oasis-primary bg-oasis-accent rounded-xl hover:bg-oasis-accent-light shadow-sm hover:shadow-md transition-all"
            >
              <Pencil className="w-4 h-4" /> Edit Task
            </button>
            <button
              onClick={() => setDeleteOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 hover:shadow-md transition-all"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </motion.div>

          {/* ── Comments ── */}
          <motion.div {...fadeUp(0.3)} className="glass-card rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-oasis-primary to-oasis-primary-light px-6 py-4 flex items-center gap-3">
              <MessageSquare className="w-4 h-4 text-white/70" />
              <h2 className="text-sm font-bold text-white/80 uppercase tracking-widest">
                Comments
              </h2>
              <span className="text-xs font-semibold text-white/60 bg-white/10 px-2.5 py-1 rounded-full ml-auto">
                {comments.length}
              </span>
            </div>

            <div className="p-5 space-y-4">
              {/* Existing comments */}
              {comments.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No comments yet. Be the first to add one.</p>
              )}
              {comments.map((c) => {
                const authorName = c.author?.displayName || c.author?.email || 'User'
                const initial = authorName.charAt(0).toUpperCase()
                const timeAgo = (() => {
                  const diff = Date.now() - new Date(c.createdAt).getTime()
                  const m = Math.floor(diff / 60000)
                  if (m < 1) return 'Just now'
                  if (m < 60) return `${m}m ago`
                  const h = Math.floor(m / 60)
                  if (h < 24) return `${h}h ago`
                  return new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                })()

                return (
                  <div key={c.id} className="flex gap-3 group">
                    <div className="w-8 h-8 rounded-full bg-oasis-primary flex items-center justify-center shrink-0 text-xs font-bold text-oasis-accent">
                      {initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-800">{authorName}</span>
                        <span className="text-[11px] text-gray-400">{timeAgo}</span>
                        <button
                          onClick={() => handleDeleteComment(c.id)}
                          className="ml-auto text-[11px] text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Delete
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{c.body}</p>
                      {c.mentionedTask && (
                        <Link
                          href={`/tasks/${c.mentionedTask.id}`}
                          className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-oasis-primary bg-oasis-primary/5 px-2.5 py-1 rounded-lg hover:bg-oasis-primary/10 transition-colors"
                        >
                          <Link2 className="w-3 h-3" />
                          {c.mentionedTask.title}
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* Add comment form */}
              <form onSubmit={handleCommentSubmit} className="pt-3 border-t border-gray-100 space-y-3">
                <textarea
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  placeholder="Add a comment..."
                  rows={2}
                  maxLength={2000}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-oasis-primary/30 focus:border-oasis-primary transition-all resize-none"
                />

                {/* Link a task */}
                {allTasks.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-gray-400 shrink-0" />
                    <select
                      value={mentionedTaskId}
                      onChange={(e) => setMentionedTaskId(e.target.value)}
                      className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-oasis-primary/30"
                    >
                      <option value="">Link a task (optional)</option>
                      {allTasks.filter(t => t.id !== task.id).map(t => (
                        <option key={t.id} value={t.id}>{t.title}</option>
                      ))}
                    </select>
                  </div>
                )}

                {commentError && (
                  <p className="text-xs text-red-600 font-medium">{commentError}</p>
                )}

                <button
                  type="submit"
                  disabled={commentPending || !commentBody.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-oasis-primary text-white hover:bg-oasis-primary-light disabled:opacity-50 transition-all"
                >
                  {commentPending
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Send className="w-4 h-4" />
                  }
                  {commentPending ? 'Posting...' : 'Post Comment'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* ── Right column (details) ── */}
        <div className="lg:col-span-1 space-y-5">

          {/* Details card */}
          <motion.div {...fadeUp(0.15)} className="glass-card rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-gradient-to-r from-oasis-primary to-oasis-primary-light px-5 py-4">
              <h2 className="text-xs font-bold text-white/80 uppercase tracking-widest">Task Details</h2>
            </div>

            <div className="p-5 space-y-4">
              {/* Project */}
              {projectName && projectId && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                    <FolderKanban className="w-4 h-4 text-violet-500" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Project</p>
                    <Link
                      href={`/projects/${projectId}`}
                      className="text-sm font-semibold text-oasis-primary hover:text-oasis-accent transition-colors"
                    >
                      {projectName}
                    </Link>
                  </div>
                </div>
              )}

              {/* Due date */}
              {task.dueDate && (
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isOverdue ? 'bg-red-50' : 'bg-amber-50'}`}>
                    <Calendar className={`w-4 h-4 ${isOverdue ? 'text-red-500' : 'text-amber-500'}`} />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Due Date</p>
                    <p className={`text-sm font-semibold ${isOverdue ? 'text-red-600' : 'text-gray-800'}`}>
                      {new Date(task.dueDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    {daysUntilDue !== null && (
                      <p className={`text-[11px] mt-0.5 font-medium ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
                        {isOverdue
                          ? `${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) !== 1 ? 's' : ''} overdue`
                          : daysUntilDue === 0
                          ? 'Due today'
                          : daysUntilDue === 1
                          ? 'Due tomorrow'
                          : `${daysUntilDue} days left`}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Assignee */}
              {assignee && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Assigned To</p>
                    <p className="text-sm font-semibold text-indigo-700">
                      {assignee.displayName || assignee.email}
                    </p>
                    {assignee.displayName && (
                      <p className="text-[11px] text-gray-400 mt-0.5">{assignee.email}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Status detail */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-oasis-primary/5 flex items-center justify-center shrink-0">
                  <Tag className="w-4 h-4 text-oasis-primary" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</p>
                  <p className="text-sm font-semibold text-gray-800">{status.label}</p>
                </div>
              </div>

              {/* Priority detail */}
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${priority.bgClass}`}>
                  <span className={`w-3 h-3 rounded-full ${priority.dot}`} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Priority</p>
                  <p className={`text-sm font-semibold ${priority.textClass}`}>{priority.label}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                {/* Created */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Created</p>
                    <p className="text-sm font-medium text-gray-700">
                      {new Date(task.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {/* Last updated */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    <RefreshCw className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Last Updated</p>
                    <p className="text-sm font-medium text-gray-700">
                      {new Date(task.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Task ID card */}
          <motion.div {...fadeUp(0.25)} className="glass-card rounded-2xl p-5 hover:shadow-md transition-shadow">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Task ID</p>
            <p className="text-sm font-mono font-semibold text-gray-600">#{task.id}</p>
          </motion.div>
        </div>
      </div>

      {/* Drawers / dialogs */}
      <EditTaskDrawer
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        task={task}
        projects={projects}
        users={users}
      />
      <DeleteConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Task"
        description={`"${task.title}" will be permanently deleted.`}
        redirectAfter="/tasks"
      />
    </>
  )
}
