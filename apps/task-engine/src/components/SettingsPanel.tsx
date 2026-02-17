'use client'

import { motion } from 'framer-motion'
import { Info, Key, Palette, LayoutGrid, Cpu, ExternalLink } from 'lucide-react'
import { CopyBlock } from './ui/CopyBlock'
import { ToggleSwitch } from './ui/ToggleSwitch'
import { useState, useEffect } from 'react'

function SettingsCard({ title, icon: Icon, children, index }: {
  title: string
  icon: typeof Info
  children: React.ReactNode
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="bg-white rounded-xl border border-gray-200 p-6"
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-oasis-primary/5 flex items-center justify-center">
          <Icon className="w-4 h-4 text-oasis-primary" />
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </motion.div>
  )
}

export function SettingsPanel({ appUrl }: { appUrl: string }) {
  const [darkMode, setDarkMode] = useState(false)
  const [compactView, setCompactView] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('oasis-dark-mode')
    if (saved === 'true') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked)
    localStorage.setItem('oasis-dark-mode', String(checked))
    document.documentElement.classList.toggle('dark', checked)
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <SettingsCard title="Application Information" icon={Info} index={0}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Version</span>
            <span className="text-sm font-medium text-gray-900">1.0.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Environment</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
              {process.env.NODE_ENV || 'development'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Database</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-green-700">Connected</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Framework</span>
            <span className="text-sm font-medium text-gray-900">Next.js + PayloadCMS</span>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="API Configuration" icon={Key} index={1}>
        <div className="space-y-4">
          <CopyBlock label="REST API Endpoint" text={`${appUrl}/api`} />
          <CopyBlock label="Tasks Endpoint" text={`${appUrl}/api/tasks`} />
          <CopyBlock
            label="Authorization Header Format"
            text="Authorization: api-users API-Key <your-key>"
          />
          <a
            href="/admin/collections/api-users"
            className="inline-flex items-center gap-1.5 text-sm text-oasis-primary hover:text-oasis-accent transition-colors font-medium"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Manage API Keys in Admin Panel
          </a>
        </div>
      </SettingsCard>

      <SettingsCard title="Theme" icon={Palette} index={2}>
        <ToggleSwitch
          checked={darkMode}
          onChange={toggleDarkMode}
          label="Dark Mode"
          description="Switch to dark theme for reduced eye strain."
        />
      </SettingsCard>

      <SettingsCard title="Display Preferences" icon={LayoutGrid} index={3}>
        <ToggleSwitch
          checked={compactView}
          onChange={setCompactView}
          label="Compact View"
          description="Reduce spacing for denser task lists."
        />
      </SettingsCard>

      <SettingsCard title="About" icon={Cpu} index={4}>
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            OasisTech Secure Task Engine — Enterprise task management with API key authentication, server-side rendering, and modern UI.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Next.js 15', 'PayloadCMS 3', 'PostgreSQL', 'Tailwind CSS', 'Framer Motion'].map((tech) => (
              <span key={tech} className="text-xs px-2.5 py-1 rounded-full bg-oasis-primary/5 text-oasis-primary font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </SettingsCard>
    </div>
  )
}
