'use client'

import { motion } from 'framer-motion'
import {
  Info, Key, Palette, LayoutGrid, Cpu, ExternalLink,
  Database, Globe, Tag, Layers,
} from 'lucide-react'
import { CopyBlock } from './ui/CopyBlock'
import { ToggleSwitch } from './ui/ToggleSwitch'
import { useState, useEffect } from 'react'

interface SettingsCardProps {
  title: string
  icon: typeof Info
  headerGradient: string
  children: React.ReactNode
  index: number
}

function SettingsCard({ title, icon: Icon, headerGradient, children, index }: SettingsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      className="glass-card rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className={`bg-gradient-to-r ${headerGradient} px-5 py-4 flex items-center gap-2`}>
        <Icon className="w-4 h-4 text-white/80" />
        <h3 className="text-xs font-bold text-white/80 uppercase tracking-widest">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  )
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <div className="text-right">{children}</div>
    </div>
  )
}

const techStack = [
  { name: 'Next.js 15',      color: 'bg-black text-white' },
  { name: 'PayloadCMS 3',    color: 'bg-indigo-600 text-white' },
  { name: 'PostgreSQL',      color: 'bg-sky-700 text-white' },
  { name: 'Tailwind CSS',    color: 'bg-cyan-500 text-white' },
  { name: 'Framer Motion',   color: 'bg-violet-600 text-white' },
]

export function SettingsPanel({ appUrl }: { appUrl: string }) {
  const [darkMode, setDarkMode]       = useState(false)
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
    <div className="space-y-4">
      {/* Top row: App Info + API Config side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* App Information */}
        <SettingsCard
          title="Application Information"
          icon={Info}
          headerGradient="from-slate-700 to-slate-500"
          index={0}
        >
          <div>
            <InfoRow label="Version">
              <span className="text-sm font-semibold text-gray-900">1.0.0</span>
            </InfoRow>
            <InfoRow label="Environment">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                {process.env.NODE_ENV || 'development'}
              </span>
            </InfoRow>
            <InfoRow label="Database">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-semibold text-emerald-700">Connected</span>
              </div>
            </InfoRow>
            <InfoRow label="Framework">
              <span className="text-sm font-semibold text-gray-900">Next.js + PayloadCMS</span>
            </InfoRow>
          </div>
        </SettingsCard>

        {/* API Configuration */}
        <SettingsCard
          title="API Configuration"
          icon={Key}
          headerGradient="from-oasis-primary to-oasis-primary-light"
          index={1}
        >
          <div className="space-y-4">
            <CopyBlock label="REST API Endpoint"          text={`${appUrl}/api`} />
            <CopyBlock label="Tasks Endpoint"             text={`${appUrl}/api/tasks`} />
            <CopyBlock label="Authorization Header"       text="Authorization: api-users API-Key <your-key>" />
            <a
              href="/admin/collections/api-users"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-semibold text-oasis-primary bg-oasis-accent rounded-xl hover:bg-oasis-accent-light shadow-sm hover:shadow-md transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              Manage API Keys in Admin Panel
            </a>
          </div>
        </SettingsCard>
      </div>

      {/* Middle row: Theme + Display Preferences side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Theme */}
        <SettingsCard
          title="Theme"
          icon={Palette}
          headerGradient="from-violet-700 to-purple-500"
          index={2}
        >
          <ToggleSwitch
            checked={darkMode}
            onChange={toggleDarkMode}
            label="Dark Mode"
            description="Switch to dark theme for reduced eye strain."
          />
        </SettingsCard>

        {/* Display Preferences */}
        <SettingsCard
          title="Display Preferences"
          icon={LayoutGrid}
          headerGradient="from-sky-700 to-cyan-500"
          index={3}
        >
          <ToggleSwitch
            checked={compactView}
            onChange={setCompactView}
            label="Compact View"
            description="Reduce spacing for denser task lists."
          />
        </SettingsCard>
      </div>

      {/* About — full width */}
      <SettingsCard
        title="About OasisTech"
        icon={Cpu}
        headerGradient="from-oasis-green to-oasis-primary-light"
        index={4}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            OasisTech Secure Task Engine — Enterprise task management with API key authentication,
            server-side rendering, and modern UI built for high performance and reliability.
          </p>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech.name}
                className={`text-xs px-3 py-1 rounded-full font-semibold ${tech.color}`}
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </SettingsCard>
    </div>
  )
}
