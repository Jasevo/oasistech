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
      {/* Background image — blurred, faint, with vignette edges */}
      <div className="fixed inset-0 overflow-hidden">
        <div
          className="absolute inset-[-20px] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/dohaoasis.jpg)',
            filter: 'blur(2px)',
          }}
        />
        {/* Light blue overlay — lets image show through subtly */}
        <div className="absolute inset-0 bg-oasis-bg/[0.65]" />
        {/* Vignette — fades edges to solid light blue for smooth blending */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at center, transparent 30%, var(--oasis-bg) 85%),
              linear-gradient(to top, var(--oasis-bg) 0%, transparent 15%),
              linear-gradient(to bottom, var(--oasis-bg) 0%, transparent 15%),
              linear-gradient(to left, var(--oasis-bg) 0%, transparent 10%),
              linear-gradient(to right, var(--oasis-bg) 0%, transparent 10%)
            `,
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
