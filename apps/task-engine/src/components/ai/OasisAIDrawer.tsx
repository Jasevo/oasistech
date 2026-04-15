'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, RotateCcw, Sparkles, ChevronRight } from 'lucide-react'
import { useAI } from '@/context/AIContext'
import { useLanguage } from '@/context/LanguageContext'
import { usePathname } from 'next/navigation'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const QUICK_PROMPTS = [
  { label: 'Site Overview', prompt: 'Give me a concise executive summary of our platform status right now.' },
  { label: 'Task Health', prompt: 'Analyse our task completion rate and highlight any concerns.' },
  { label: 'Visitor Trends', prompt: 'Summarise visitor activity and device trends this month.' },
  { label: 'Action Items', prompt: 'What are the top 3 things I should focus on today based on current data?' },
]

function pageLabel(path: string): string {
  const map: Record<string, string> = {
    '/': 'Dashboard',
    '/tasks': 'Tasks',
    '/projects': 'Projects',
    '/users': 'Users',
    '/analytics': 'Analytics',
    '/activity': 'Activity',
    '/visitors': 'Visitors',
    '/settings': 'Settings',
  }
  if (map[path]) return map[path]
  if (path.startsWith('/tasks/')) return 'Task Detail'
  if (path.startsWith('/projects/')) return 'Project Detail'
  return 'OasisTech'
}

export function OasisAIDrawer() {
  const { isOpen, close, prefillMessage, setPrefillMessage } = useAI()
  const { t, isRTL } = useLanguage()
  const pathname = usePathname()

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [hasGreeted, setHasGreeted] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const pageContext = pageLabel(pathname)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
      if (!hasGreeted) {
        setMessages([
          {
            role: 'assistant',
            content: `Hello. I'm **Oasis AI** — your intelligent workspace assistant.\n\nI have live access to your tasks, projects, visitor data, and platform metrics. Ask me anything, or use a quick prompt below to get started.`,
          },
        ])
        setHasGreeted(true)
      }
    }
  }, [isOpen, hasGreeted])

  // Pick up prefill from AIInputHelper
  useEffect(() => {
    if (prefillMessage && isOpen) {
      setInput(prefillMessage)
      setPrefillMessage('')
      setTimeout(() => inputRef.current?.focus(), 350)
    }
  }, [prefillMessage, isOpen, setPrefillMessage])

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isStreaming) return

      const userMsg: Message = { role: 'user', content: trimmed }
      const newMessages = [...messages, userMsg]
      setMessages(newMessages)
      setInput('')
      setIsStreaming(true)

      const assistantMsg: Message = { role: 'assistant', content: '' }
      setMessages((prev) => [...prev, assistantMsg])

      abortRef.current = new AbortController()

      try {
        const res = await fetch('/api/oasis-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
            context: pageContext,
            type: 'chat',
          }),
          signal: abortRef.current.signal,
        })

        if (!res.ok) throw new Error('AI service error')

        const reader = res.body?.getReader()
        const decoder = new TextDecoder()
        if (!reader) throw new Error('No response body')

        let buffer = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') break
              try {
                const { text } = JSON.parse(data)
                setMessages((prev) => {
                  const updated = [...prev]
                  updated[updated.length - 1] = {
                    role: 'assistant',
                    content: updated[updated.length - 1].content + text,
                  }
                  return updated
                })
              } catch {
                // skip malformed chunk
              }
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setMessages((prev) => {
            const updated = [...prev]
            updated[updated.length - 1] = {
              role: 'assistant',
              content: 'I encountered an issue connecting to the AI service. Please check your environment configuration and try again.',
            }
            return updated
          })
        }
      } finally {
        setIsStreaming(false)
      }
    },
    [messages, isStreaming, pageContext],
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const reset = () => {
    abortRef.current?.abort()
    setMessages([
      {
        role: 'assistant',
        content: `Conversation reset. I'm ready — what would you like to know about your workspace?`,
      },
    ])
    setInput('')
    setIsStreaming(false)
  }

  // Render markdown-like bold text
  function renderContent(text: string) {
    const parts = text.split(/(\*\*[^*]+\*\*)/)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            onClick={close}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: isRTL ? '-100%' : '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isRTL ? '-100%' : '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className={`fixed top-0 ${isRTL ? 'left-0' : 'right-0'} h-full w-full max-w-[420px] z-50 flex flex-col shadow-2xl`}
          >
            {/* Header */}
            <div className="bg-oasis-primary px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-full bg-oasis-accent/20 border border-oasis-accent/30 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/icon.png"
                    alt="Oasis AI"
                    width={24}
                    height={24}
                    className="w-5 h-5 object-contain"
                  />
                  {/* Pulse indicator */}
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-oasis-primary" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm tracking-wide">{t('oasisAI')}</p>
                  <p className="text-oasis-accent/70 text-[10px] font-medium uppercase tracking-wider">
                    {pageContext} · Live Data
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={reset}
                  className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  title="Reset conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={close}
                  className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto scrollbar-thin bg-[#f8f9fb] px-4 py-4 space-y-4">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  {msg.role === 'assistant' ? (
                    <div className="w-7 h-7 rounded-full bg-oasis-primary flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                      <Image src="/icon.png" alt="AI" width={18} height={18} className="w-4 h-4 object-contain" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-oasis-accent to-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-oasis-primary text-xs font-bold">U</span>
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'assistant'
                        ? 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-sm'
                        : 'bg-oasis-primary text-white rounded-tr-sm'
                    }`}
                  >
                    {msg.content ? (
                      <p className="whitespace-pre-wrap">{renderContent(msg.content)}</p>
                    ) : (
                      /* Typing indicator */
                      <div className="flex items-center gap-1 py-0.5">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-oasis-accent"
                            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick prompts — only when no conversation yet (just greeting) */}
            {messages.length <= 1 && (
              <div className="bg-[#f8f9fb] px-4 pb-3 border-t border-gray-100">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Quick insights</p>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_PROMPTS.map((qp) => (
                    <button
                      key={qp.label}
                      onClick={() => sendMessage(qp.prompt)}
                      className="flex items-center justify-between text-left px-3 py-2 text-xs font-medium text-oasis-primary bg-white border border-gray-200 rounded-xl hover:border-oasis-accent/50 hover:bg-oasis-accent/5 transition-all duration-200 group"
                    >
                      <span>{qp.label}</span>
                      <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-oasis-accent transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="bg-white border-t border-gray-100 px-4 py-3 shrink-0">
              <div className="flex items-end gap-2.5 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-oasis-accent/60 focus-within:ring-1 focus-within:ring-oasis-accent/20 transition-all">
                <Sparkles className="w-4 h-4 text-oasis-accent shrink-0 mb-0.5" />
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('aiPlaceholder')}
                  rows={1}
                  disabled={isStreaming}
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none min-h-[20px] max-h-32 leading-relaxed disabled:opacity-60"
                  style={{ scrollbarWidth: 'none' }}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isStreaming}
                  className="w-8 h-8 rounded-xl bg-oasis-primary hover:bg-oasis-primary-light disabled:opacity-40 flex items-center justify-center transition-all shrink-0"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              <p className="text-center text-[10px] text-gray-300 mt-2 font-medium">
                Oasis AI · Enterprise Intelligence
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
