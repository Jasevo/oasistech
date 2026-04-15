'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Send, Loader2 } from 'lucide-react'

interface AIInputHelperProps {
  /** Label describing what this field is for, e.g. "task title", "search query" */
  fieldContext: string
  /** Content visible above / around the input to give the AI context */
  surroundingContext?: string
  /** Called when AI generates a result — fills the parent input */
  onFill: (value: string) => void
  /** Page context string, e.g. "Tasks", "Projects" */
  pageContext?: string
}

export function AIInputHelper({
  fieldContext,
  surroundingContext,
  onFill,
  pageContext = 'Dashboard',
}: AIInputHelperProps) {
  const [open, setOpen] = useState(false)
  const [customPrompt, setCustomPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [preview, setPreview] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  async function generate(prompt: string) {
    setIsLoading(true)
    setPreview('')

    const systemMessage = surroundingContext
      ? `Context visible to the user: "${surroundingContext}". The user needs help filling in: ${fieldContext}.`
      : `The user needs help filling in: ${fieldContext}.`

    try {
      const res = await fetch('/api/oasis-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `${systemMessage}\n\nInstruction: ${prompt}\n\nProvide ONLY the text that should fill the field — no preamble, no explanation, no quotes. Just the content itself.`,
            },
          ],
          context: pageContext,
          type: 'field',
        }),
      })

      if (!res.ok) throw new Error('AI error')
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) throw new Error('No body')

      let result = ''
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
              result += text
              setPreview(result)
            } catch {
              // skip
            }
          }
        }
      }
    } catch {
      setPreview('Unable to generate suggestion. Check your API key.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleGenerate() {
    const prompt = customPrompt.trim() || `Generate a professional ${fieldContext}`
    generate(prompt)
  }

  function handleUse() {
    if (preview) {
      onFill(preview.trim())
      setOpen(false)
      setPreview('')
      setCustomPrompt('')
    }
  }

  return (
    <div ref={containerRef} className="relative inline-flex">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={`Oasis AI — fill ${fieldContext}`}
        className={`group flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 ${
          open
            ? 'bg-oasis-accent text-oasis-primary shadow-md shadow-oasis-accent/30'
            : 'bg-oasis-accent/10 hover:bg-oasis-accent/20 text-oasis-accent border border-oasis-accent/20'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5" />
      </button>

      {/* Popover */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-2 right-0 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-oasis-primary px-3 py-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-oasis-accent" />
                <span className="text-white text-xs font-semibold">Oasis AI — {fieldContext}</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3 space-y-2.5">
              {/* Custom prompt input */}
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-oasis-accent/50 transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  placeholder={`Describe what to generate…`}
                  className="flex-1 bg-transparent text-xs text-gray-700 placeholder-gray-400 focus:outline-none"
                />
                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-6 h-6 rounded-lg bg-oasis-primary disabled:opacity-50 flex items-center justify-center shrink-0 transition-all hover:bg-oasis-primary-light"
                >
                  {isLoading ? (
                    <Loader2 className="w-3 h-3 text-white animate-spin" />
                  ) : (
                    <Send className="w-3 h-3 text-white" />
                  )}
                </button>
              </div>

              {/* Quick actions */}
              {!preview && !isLoading && (
                <div className="flex flex-wrap gap-1.5">
                  {[
                    `Generate a professional ${fieldContext}`,
                    `Suggest 3 options for ${fieldContext}`,
                    `Improve the current ${fieldContext}`,
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => generate(suggestion)}
                      className="text-[10px] px-2.5 py-1 bg-oasis-accent/10 text-oasis-primary rounded-lg hover:bg-oasis-accent/20 transition-colors font-medium border border-oasis-accent/15"
                    >
                      {suggestion.replace(`Generate a professional `, '✦ ').replace(`Suggest 3 options for `, '◈ ').replace(`Improve the current `, '↑ ')}
                    </button>
                  ))}
                </div>
              )}

              {/* Loading state */}
              {isLoading && (
                <div className="flex items-center gap-2 py-2">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-oasis-accent"
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                        transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.12 }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">Generating…</span>
                </div>
              )}

              {/* Preview */}
              {preview && !isLoading && (
                <div className="space-y-2">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-700 leading-relaxed max-h-28 overflow-y-auto scrollbar-thin">
                    {preview}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleUse}
                      className="flex-1 py-2 text-xs font-semibold bg-oasis-primary text-white rounded-xl hover:bg-oasis-primary-light transition-colors"
                    >
                      Use this
                    </button>
                    <button
                      onClick={handleGenerate}
                      className="px-3 py-2 text-xs font-medium text-gray-500 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
                    >
                      Regenerate
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
