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
    <div className="min-h-screen bg-oasis-bg">
      <TopBar userName={userName} />
      <div className="flex h-[calc(100vh-56px)]">
        <Sidebar taskCount={openTaskCount} />
        <main className="flex-1 overflow-y-auto scrollbar-thin pb-20 md:pb-0">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <BottomNav />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#092421',
            color: '#fff',
            border: '1px solid rgba(227, 186, 84, 0.2)',
          },
        }}
      />
    </div>
  )
}
