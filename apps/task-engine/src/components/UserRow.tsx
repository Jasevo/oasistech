'use client'

import { motion } from 'framer-motion'
import { Key, Shield, Calendar } from 'lucide-react'

interface UserRowProps {
  user: {
    id: string
    email: string
    role: string
    displayName?: string | null
    enableAPIKey?: boolean
    createdAt: string
  }
  index: number
}

// Avatar gradient per role
const roleAvatarGradient: Record<string, string> = {
  admin:          'from-oasis-primary to-oasis-primary-light',
  'api-consumer': 'from-sky-600 to-blue-500',
}

// Role badge styling
const roleConfig: Record<string, { label: string; badge: string; icon: typeof Shield }> = {
  admin:          { label: 'Admin',        badge: 'bg-oasis-primary/10 text-oasis-primary border border-oasis-primary/20', icon: Shield },
  'api-consumer': { label: 'API Consumer', badge: 'bg-sky-50 text-sky-700 border border-sky-200',                          icon: Key },
}

// Deterministic colour from name initial (cycles through a palette)
const avatarPalette = [
  'from-violet-600 to-purple-500',
  'from-rose-600   to-pink-500',
  'from-amber-600  to-orange-500',
  'from-teal-600   to-emerald-500',
  'from-sky-600    to-blue-500',
]

function getAvatarGradient(role: string, name: string): string {
  const fromRole = roleAvatarGradient[role]
  if (fromRole) return fromRole
  // Fallback: pick deterministically by first char code
  const idx = (name.charCodeAt(0) || 0) % avatarPalette.length
  return avatarPalette[idx]
}

export function UserRow({ user, index }: UserRowProps) {
  const displayName = user.displayName || user.email
  const initial = displayName.charAt(0).toUpperCase()
  const gradient = getAvatarGradient(user.role, displayName)
  const role = roleConfig[user.role] ?? roleConfig['api-consumer']
  const RoleIcon = role.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="glass-card rounded-xl p-4 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Gradient avatar */}
      <div
        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-sm`}
      >
        <span className="text-white text-base font-bold">{initial}</span>
      </div>

      {/* Name + email */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
          <span
            className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-semibold ${role.badge}`}
          >
            <RoleIcon className="w-3 h-3" />
            {role.label}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5 truncate">{user.email}</p>
      </div>

      {/* API key + joined */}
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        {/* API key pill */}
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
            user.enableAPIKey
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-gray-100 text-gray-400 border border-gray-200'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${user.enableAPIKey ? 'bg-emerald-500' : 'bg-gray-300'}`}
          />
          {user.enableAPIKey ? 'API Key Active' : 'No API Key'}
        </span>

        {/* Join date */}
        <span className="flex items-center gap-1 text-[11px] text-gray-400">
          <Calendar className="w-3 h-3" />
          Joined {new Date(user.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      </div>
    </motion.div>
  )
}
