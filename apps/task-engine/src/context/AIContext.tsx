'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface AIContextValue {
  isOpen: boolean
  open: (context?: string) => void
  close: () => void
  toggle: () => void
  pageContext: string
  setPageContext: (ctx: string) => void
  prefillMessage: string
  setPrefillMessage: (msg: string) => void
}

const AIContext = createContext<AIContextValue | null>(null)

export function AIProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [pageContext, setPageContext] = useState('Dashboard')
  const [prefillMessage, setPrefillMessage] = useState('')

  const open = useCallback((context?: string) => {
    if (context) setPageContext(context)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setPrefillMessage('')
  }, [])

  const toggle = useCallback(() => setIsOpen((v) => !v), [])

  return (
    <AIContext.Provider
      value={{
        isOpen,
        open,
        close,
        toggle,
        pageContext,
        setPageContext,
        prefillMessage,
        setPrefillMessage,
      }}
    >
      {children}
    </AIContext.Provider>
  )
}

export function useAI() {
  const ctx = useContext(AIContext)
  if (!ctx) throw new Error('useAI must be used inside AIProvider')
  return ctx
}
