'use client'

import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { Toaster } from 'sonner'

interface ShellProps {
  children: React.ReactNode
  userName?: string
  openTaskCount?: number
}

export function Shell({ children, userName, openTaskCount }: ShellProps) {
  return (
    <div className="min-h-screen relative">
      {/* Background image with overlay */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/dohaoasis.jpg)' }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-oasis-primary/70 via-oasis-primary/40 to-oasis-green/30" />
      <div className="fixed inset-0 bg-oasis-bg/40 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10">
        <TopBar userName={userName} />
        <div className="flex h-[calc(100vh-64px)]">
          <Sidebar taskCount={openTaskCount} />
          <main className="flex-1 overflow-y-auto scrollbar-thin pb-20 md:pb-0">
            <div className="p-4 lg:p-8 max-w-[1400px] mx-auto">
              {children}
            </div>
          </main>
        </div>
        <BottomNav />
      </div>

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
  )
}
