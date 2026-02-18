import { SettingsPanel } from '@/components/SettingsPanel'
import { Settings } from 'lucide-react'

export const metadata = {
  title: 'Settings | OasisTech',
}

export default function SettingsPage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-slate-600 via-gray-500 to-oasis-primary" />
        <div className="px-6 py-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-700 to-oasis-primary flex items-center justify-center shrink-0 shadow-sm">
            <Settings className="w-5 h-5 text-oasis-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500 mt-0.5">Application configuration and information.</p>
          </div>
        </div>
      </div>

      <SettingsPanel appUrl={appUrl} />
    </div>
  )
}
