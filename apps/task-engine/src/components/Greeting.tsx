'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Plus, Calendar, ChevronDown } from 'lucide-react'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

interface GreetingProps {
  name: string
  taskSummary?: {
    today: number
    overdue: number
    inProgress: number
  }
}

export function Greeting({ name, taskSummary }: GreetingProps) {
  const [greeting, setGreeting] = useState('Welcome')
  const [date, setDate] = useState('')

  useEffect(() => {
    setGreeting(getGreeting())
    setDate(getFormattedDate())
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">
          {greeting}, <span className="text-oasis-primary">{name}</span> <span className="inline-block animate-fade-in">&#128075;</span>
        </h1>
        <div className="flex items-center gap-3 mt-1.5">
          {taskSummary && taskSummary.today > 0 ? (
            <p className="text-gray-500 text-sm">
              You have <span className="font-semibold text-gray-700">{taskSummary.today} tasks today</span>
              {taskSummary.overdue > 0 && <>, <span className="text-red-500 font-semibold">{taskSummary.overdue} overdue</span></>}
              {taskSummary.inProgress > 0 && <>, and <span className="text-oasis-green font-semibold">{taskSummary.inProgress} in progress</span></>}.
            </p>
          ) : (
            <p className="text-gray-500 text-sm">Here&apos;s an overview of your task engine.</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {date && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl glass-card text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-oasis-accent" />
            {date}
          </div>
        )}
        <Link
          href="/admin/collections/tasks/create"
          className="inline-flex items-center gap-2 bg-oasis-primary hover:bg-oasis-primary-light text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 shadow-lg shadow-oasis-primary/20 hover:shadow-xl hover:shadow-oasis-primary/30"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </Link>
        <button className="p-2.5 rounded-xl glass-card text-gray-600 hover:text-oasis-primary transition-colors">
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}
