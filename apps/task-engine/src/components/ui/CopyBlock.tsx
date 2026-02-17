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
      {label && <p className="text-xs font-medium text-gray-500 mb-1.5">{label}</p>}
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
        <code className="text-sm text-gray-800 flex-1 overflow-x-auto scrollbar-thin">{text}</code>
        <button
          onClick={handleCopy}
          className="shrink-0 p-1.5 rounded-md hover:bg-gray-200 transition-colors text-gray-500 hover:text-gray-700"
          aria-label="Copy"
        >
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}
