'use client'

import { motion } from 'framer-motion'
import { Key, Shield, User } from 'lucide-react'

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

const roleConfig: Record<string, { label: string; className: string; icon: typeof Shield }> = {
  admin: { label: 'Admin', className: 'bg-oasis-primary/10 text-oasis-primary', icon: Shield },
  'api-consumer': { label: 'API Consumer', className: 'bg-blue-100 text-blue-700', icon: Key },
}

export function UserRow({ user, index }: UserRowProps) {
  const role = roleConfig[user.role] || roleConfig['api-consumer']
  const RoleIcon = role.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:border-oasis-accent/30 transition-colors"
    >
      <div className="w-10 h-10 rounded-full bg-oasis-primary/5 flex items-center justify-center shrink-0">
        <User className="w-5 h-5 text-oasis-primary" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {user.displayName || user.email}
          </p>
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${role.className}`}>
            <RoleIcon className="w-3 h-3" />
            {role.label}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5 truncate">{user.email}</p>
      </div>

      <div className="text-right shrink-0">
        <div className={`inline-flex items-center gap-1 text-xs font-medium ${user.enableAPIKey ? 'text-green-600' : 'text-gray-400'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${user.enableAPIKey ? 'bg-green-500' : 'bg-gray-300'}`} />
          {user.enableAPIKey ? 'API Key Active' : 'No API Key'}
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>
    </motion.div>
  )
}
