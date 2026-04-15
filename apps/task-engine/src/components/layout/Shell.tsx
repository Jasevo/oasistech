'use client'

import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { Toaster } from 'sonner'
import { AIProvider } from '@/context/AIContext'
import { LanguageProvider } from '@/context/LanguageContext'
import { OasisAIDrawer } from '@/components/ai/OasisAIDrawer'
import { PageTracker } from '@/components/PageTracker'

interface ShellProps {
  children: React.ReactNode
  userName?: string
  openTaskCount?: number
}

export function Shell({ children, userName, openTaskCount }: ShellProps) {
  return (
    <LanguageProvider>
      <AIProvider>
        <div className="min-h-screen relative bg-oasis-bg">
          {/* Subtle ambient background — no photo, clean corporate feel */}
          <div className="fixed inset-0 pointer-events-none">
            {/* Top-left soft teal bloom */}
            <div
              className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.07]"
              style={{
                background: 'radial-gradient(circle, #092421 0%, transparent 70%)',
              }}
            />
            {/* Bottom-right gold accent bloom */}
            <div
              className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.05]"
              style={{
                background: 'radial-gradient(circle, #e3ba54 0%, transparent 70%)',
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <TopBar userName={userName} />
            <div className="flex h-[calc(100vh-56px)]">
              <Sidebar taskCount={openTaskCount} />
              <main className="flex-1 overflow-y-auto scrollbar-thin pb-20 md:pb-0">
                <div className="p-4 lg:px-8 lg:py-6">
                  {children}
                </div>
              </main>
            </div>
            <BottomNav />
          </div>

          {/* Page visit tracker */}
          <PageTracker />

          {/* Oasis AI Drawer — available on every page */}
          <OasisAIDrawer />

          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#092421',
                color: '#fff',
                border: '1px solid rgba(227, 186, 84, 0.3)',
                borderRadius: '12px',
              },
            }}
          />
        </div>
      </AIProvider>
    </LanguageProvider>
  )
}
