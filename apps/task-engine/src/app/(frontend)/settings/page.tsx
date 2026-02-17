import { SettingsPanel } from '@/components/SettingsPanel'

export const metadata = {
  title: 'Settings | OasisTech',
}

export default function SettingsPage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Application configuration and information.</p>
      </div>

      <SettingsPanel appUrl={appUrl} />
    </div>
  )
}
