'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

export function CopyBlock({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      {label && (
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
          {label}
        </p>
      )}
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 group hover:border-oasis-accent/40 transition-colors">
        <code className="text-xs font-mono text-gray-700 flex-1 overflow-x-auto scrollbar-thin leading-relaxed">
          {text}
        </code>
        <button
          onClick={handleCopy}
          className={`shrink-0 p-1.5 rounded-lg transition-all ${
            copied
              ? 'bg-emerald-50 text-emerald-600'
              : 'text-gray-400 hover:bg-gray-200 hover:text-gray-700'
          }`}
          aria-label="Copy to clipboard"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  )
}
