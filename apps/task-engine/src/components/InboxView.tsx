'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Inbox, Send, Pencil, Trash2, CheckCheck, Link2, FolderKanban,
  ChevronRight, ArrowLeft, Loader2, Mail, MailOpen,
} from 'lucide-react'
import { markMessageRead, deleteMessage } from '@/actions/messages'
import { ComposeMessageDrawer } from './drawers/ComposeMessageDrawer'

interface UserOption { id: string; displayName?: string | null; email: string }
interface TaskOption { id: string; title: string }
interface ProjectOption { id: string; name: string }

interface Message {
  id: string
  subject: string
  body: string
  read: boolean
  createdAt: string
  from?: { id: string; displayName?: string | null; email: string } | null
  to?: { id: string; displayName?: string | null; email: string } | null
  linkedTask?: { id: string; title: string } | null
  linkedProject?: { id: string; name: string } | null
}

interface InboxViewProps {
  currentUserId: string
  currentUserName: string
  received: Message[]
  sent: Message[]
  users: UserOption[]
  tasks: TaskOption[]
  projects: ProjectOption[]
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function nameOf(user?: { displayName?: string | null; email: string } | null) {
  if (!user) return 'Unknown'
  return user.displayName || user.email
}

function initialOf(user?: { displayName?: string | null; email: string } | null) {
  if (!user) return '?'
  return (user.displayName || user.email).charAt(0).toUpperCase()
}

export function InboxView({
  currentUserId,
  currentUserName,
  received: initialReceived,
  sent: initialSent,
  users,
  tasks,
  projects,
}: InboxViewProps) {
  const [tab, setTab] = useState<'received' | 'sent'>('received')
  const [received, setReceived] = useState<Message[]>(initialReceived)
  const [sent, setSent] = useState<Message[]>(initialSent)
  const [selected, setSelected] = useState<Message | null>(null)
  const [composeOpen, setComposeOpen] = useState(false)
  const [replyTo, setReplyTo] = useState<Message | null>(null)
  const [isPending, startTransition] = useTransition()

  const messages = tab === 'received' ? received : sent
  const unreadCount = received.filter((m) => !m.read).length

  function openCompose() {
    setReplyTo(null)
    setComposeOpen(true)
  }

  function openReply(msg: Message) {
    setReplyTo(msg)
    setComposeOpen(true)
  }

  function openMessage(msg: Message) {
    setSelected(msg)
    if (tab === 'received' && !msg.read) {
      startTransition(async () => {
        await markMessageRead(msg.id)
        setReceived((prev) => prev.map((m) => m.id === msg.id ? { ...m, read: true } : m))
      })
    }
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteMessage(id)
      setReceived((prev) => prev.filter((m) => m.id !== id))
      setSent((prev) => prev.filter((m) => m.id !== id))
      if (selected?.id === id) setSelected(null)
    })
  }

  return (
    <>
      <div className="space-y-5">
        {/* Page header */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-oasis-primary via-oasis-accent to-oasis-green" />
          <div className="px-6 py-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-oasis-primary to-oasis-primary-light flex items-center justify-center shrink-0 shadow-sm relative">
              <Inbox className="w-5 h-5 text-oasis-accent" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold tracking-tight text-gray-900">Inbox</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {unreadCount > 0 ? `${unreadCount} unread message${unreadCount !== 1 ? 's' : ''}` : 'All caught up'}
              </p>
            </div>
            <button
              onClick={openCompose}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-oasis-primary text-white hover:bg-oasis-primary-light shadow-sm hover:shadow-md transition-all"
            >
              <Pencil className="w-4 h-4" />
              Compose
            </button>
          </div>
        </div>

        {/* Main panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 min-h-[500px]">

          {/* Message list */}
          <div className="lg:col-span-1 glass-card rounded-2xl overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => { setTab('received'); setSelected(null) }}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-colors ${
                  tab === 'received'
                    ? 'text-oasis-primary border-b-2 border-oasis-primary bg-oasis-primary/3'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Inbox className="w-4 h-4" />
                Received
                {unreadCount > 0 && (
                  <span className="text-[11px] bg-red-500 text-white font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => { setTab('sent'); setSelected(null) }}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-colors ${
                  tab === 'sent'
                    ? 'text-oasis-primary border-b-2 border-oasis-primary bg-oasis-primary/3'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Send className="w-4 h-4" />
                Sent
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                    {tab === 'received' ? <Inbox className="w-6 h-6 text-gray-400" /> : <Send className="w-6 h-6 text-gray-400" />}
                  </div>
                  <p className="text-sm font-medium text-gray-500">
                    {tab === 'received' ? 'No messages received yet' : 'No messages sent yet'}
                  </p>
                </div>
              )}
              {messages.map((msg) => {
                const isActive = selected?.id === msg.id
                const counterpart = tab === 'received' ? msg.from : msg.to
                const isUnread = tab === 'received' && !msg.read

                return (
                  <motion.button
                    key={msg.id}
                    onClick={() => openMessage(msg)}
                    whileHover={{ backgroundColor: 'rgba(9,36,33,0.03)' }}
                    className={`w-full text-left px-4 py-3.5 transition-colors ${
                      isActive ? 'bg-oasis-primary/5 border-l-2 border-oasis-primary' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                        isUnread ? 'bg-oasis-primary text-oasis-accent' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {initialOf(counterpart)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className={`text-xs font-semibold truncate ${isUnread ? 'text-oasis-primary' : 'text-gray-600'}`}>
                            {nameOf(counterpart)}
                          </span>
                          <span className="text-[10px] text-gray-400 shrink-0">{timeAgo(msg.createdAt)}</span>
                        </div>
                        <p className={`text-sm truncate ${isUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                          {msg.subject}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{msg.body}</p>
                        {/* Attachment indicator */}
                        {(msg.linkedTask || msg.linkedProject) && (
                          <div className="flex items-center gap-1 mt-1">
                            {msg.linkedTask && <span className="text-[10px] text-oasis-primary bg-oasis-primary/5 px-1.5 py-0.5 rounded font-medium">Task</span>}
                            {msg.linkedProject && <span className="text-[10px] text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded font-medium">Project</span>}
                          </div>
                        )}
                      </div>
                      {!isUnread && <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0 mt-1" />}
                      {isUnread && <div className="w-2 h-2 rounded-full bg-oasis-primary shrink-0 mt-1.5" />}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Message detail */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                  className="glass-card rounded-2xl overflow-hidden h-full flex flex-col"
                >
                  {/* Message header */}
                  <div className="bg-gradient-to-r from-oasis-primary to-oasis-primary-light px-6 py-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-white leading-snug">{selected.subject}</h2>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-xs text-white/60">
                            From: <span className="text-white/90 font-medium">{nameOf(selected.from)}</span>
                          </span>
                          <span className="text-white/30">·</span>
                          <span className="text-xs text-white/60">
                            To: <span className="text-white/90 font-medium">{nameOf(selected.to)}</span>
                          </span>
                          <span className="text-white/30">·</span>
                          <span className="text-xs text-white/50">
                            {new Date(selected.createdAt).toLocaleDateString('en-US', {
                              weekday: 'short', month: 'short', day: 'numeric',
                              hour: '2-digit', minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {tab === 'received' && (
                          <span className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-semibold ${
                            selected.read
                              ? 'bg-white/10 text-white/60'
                              : 'bg-oasis-accent/20 text-oasis-accent'
                          }`}>
                            {selected.read ? <MailOpen className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                            {selected.read ? 'Read' : 'Unread'}
                          </span>
                        )}
                        <button
                          onClick={() => handleDelete(selected.id)}
                          disabled={isPending}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-red-500/30 flex items-center justify-center transition-colors"
                          title="Delete message"
                        >
                          {isPending ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" /> : <Trash2 className="w-3.5 h-3.5 text-white/70" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Attachments bar */}
                  {(selected.linkedTask || selected.linkedProject) && (
                    <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-3 flex-wrap">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Attached:</span>
                      {selected.linkedTask && (
                        <Link
                          href={`/tasks/${selected.linkedTask.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-oasis-primary bg-oasis-primary/5 hover:bg-oasis-primary/10 border border-oasis-primary/10 transition-colors"
                        >
                          <Link2 className="w-3 h-3" />
                          {selected.linkedTask.title}
                          <ChevronRight className="w-3 h-3 opacity-50" />
                        </Link>
                      )}
                      {selected.linkedProject && (
                        <Link
                          href={`/projects/${selected.linkedProject.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-100 transition-colors"
                        >
                          <FolderKanban className="w-3 h-3" />
                          {selected.linkedProject.name}
                          <ChevronRight className="w-3 h-3 opacity-50" />
                        </Link>
                      )}
                    </div>
                  )}

                  {/* Body */}
                  <div className="flex-1 p-6 overflow-y-auto">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.body}</p>
                  </div>

                  {/* Reply / Mark read actions */}
                  <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/60 flex items-center gap-3">
                    <button
                      onClick={() => openReply(selected)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-oasis-primary text-white hover:bg-oasis-primary-light transition-all shadow-sm"
                    >
                      <Send className="w-4 h-4" /> Reply
                    </button>
                    {tab === 'received' && selected.read && (
                      <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                        <CheckCheck className="w-4 h-4 text-emerald-400" /> Marked as read
                      </span>
                    )}
                    <button
                      onClick={() => setSelected(null)}
                      className="ml-auto flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card rounded-2xl h-full flex flex-col items-center justify-center py-20 text-center px-8"
                >
                  <div className="w-16 h-16 rounded-2xl bg-oasis-primary/5 flex items-center justify-center mb-4">
                    <Inbox className="w-8 h-8 text-oasis-primary/40" />
                  </div>
                  <p className="text-base font-semibold text-gray-700 mb-1">Select a message</p>
                  <p className="text-sm text-gray-400 max-w-xs">
                    Choose a message from the list to read it, or compose a new one.
                  </p>
                  <button
                    onClick={openCompose}
                    className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-oasis-primary text-white hover:bg-oasis-primary-light shadow-sm transition-all"
                  >
                    <Pencil className="w-4 h-4" /> Compose Message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <ComposeMessageDrawer
        isOpen={composeOpen}
        onClose={() => setComposeOpen(false)}
        fromId={currentUserId}
        users={users}
        tasks={tasks}
        projects={projects}
        defaultToId={
          replyTo
            ? String(
                (String(replyTo.from?.id) === currentUserId ? replyTo.to?.id : replyTo.from?.id) ?? ''
              )
            : ''
        }
        defaultSubject={
          replyTo
            ? replyTo.subject.startsWith('Re:') ? replyTo.subject : `Re: ${replyTo.subject}`
            : ''
        }
      />
    </>
  )
}
