'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ChevronRight } from 'lucide-react'
import { useAI } from '@/context/AIContext'

const FALLBACK_INSIGHTS = [
  'Welcome to OasisTech — your enterprise command centre. Click Ask AI for a full briefing.',
  'Track tasks, monitor projects, and analyse visitor trends — all from one platform.',
  'Oasis AI is live and ready. Ask about task health, visitor activity, or team performance.',
  'OasisTech keeps your organisation running at peak performance.',
]

const REFRESH_INTERVAL = 5 * 60 * 1000 // 5 minutes
const FETCH_INTERVAL = 60 * 1000 // 1 minute polling for new insights

export function DashboardAIWidget() {
  const { open } = useAI()
  const [insights, setInsights] = useState<string[]>(FALLBACK_INSIGHTS)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFetching, setIsFetching] = useState(false)
  const fetchedRef = useRef(false)

  const fetchInsights = useCallback(async () => {
    if (isFetching) return
    setIsFetching(true)
    try {
      const res = await fetch('/api/oasis-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content:
                'Generate exactly 5 short executive insight sentences about this platform\'s current state. Each sentence must be on its own line, max 12 words, no numbering, no bullets. Focus on live stats, actionable insights, or motivational status updates. Vary the topics.',
            },
          ],
          context: 'Dashboard',
          type: 'insight',
        }),
      })
      if (!res.ok) return

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) return

      let fullText = ''
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
              fullText += text
            } catch { /* skip */ }
          }
        }
      }

      const parsed = fullText
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 10 && s.length < 120)
        .slice(0, 6)

      if (parsed.length >= 2) {
        setInsights(parsed)
        setCurrentIndex(0)
      }
    } catch { /* keep fallback */ } finally {
      setIsFetching(false)
    }
  }, [isFetching])

  // Initial fetch
  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true
      fetchInsights()
    }
  }, [fetchInsights])

  // Re-fetch every 1 minute to get fresh data
  useEffect(() => {
    const id = setInterval(fetchInsights, FETCH_INTERVAL)
    return () => clearInterval(id)
  }, [fetchInsights])

  // Rotate text every 5 minutes
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % insights.length)
    }, REFRESH_INTERVAL)
    return () => clearInterval(id)
  }, [insights.length])

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex items-center gap-3 bg-oasis-primary/[0.06] border border-oasis-primary/10 rounded-2xl px-4 py-3 hover:border-oasis-accent/30 transition-all duration-300 group"
    >
      {/* AI Icon */}
      <div className="relative shrink-0">
        <div className="w-8 h-8 rounded-full bg-oasis-primary flex items-center justify-center overflow-hidden shadow-sm">
          <Image
            src="/icon.png"
            alt="Oasis AI"
            width={20}
            height={20}
            className="w-4 h-4 object-contain"
          />
        </div>
        {/* Live pulse */}
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5">
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
          <span className="absolute inset-0.5 rounded-full bg-emerald-400" />
        </span>
      </div>

      {/* Label */}
      <span className="text-[10px] font-bold text-oasis-primary/50 uppercase tracking-widest shrink-0 hidden sm:block">
        Oasis AI
      </span>

      {/* Divider */}
      <div className="w-px h-5 bg-oasis-primary/10 shrink-0 hidden sm:block" />

      {/* Rotating insight */}
      <div className="flex-1 overflow-hidden min-w-0">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="text-sm text-gray-700 font-medium truncate"
          >
            {insights[currentIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center gap-1 shrink-0">
        {insights.slice(0, 5).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
              i === currentIndex % insights.length
                ? 'bg-oasis-accent w-3'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={() => open('Dashboard')}
        className="flex items-center gap-1.5 shrink-0 px-3 py-1.5 text-xs font-semibold text-oasis-primary bg-oasis-accent/15 hover:bg-oasis-accent/25 border border-oasis-accent/25 rounded-xl transition-all duration-200"
      >
        <Sparkles className="w-3 h-3" />
        <span className="hidden sm:inline">Ask AI</span>
        <ChevronRight className="w-3 h-3" />
      </button>
    </motion.div>
  )
}
