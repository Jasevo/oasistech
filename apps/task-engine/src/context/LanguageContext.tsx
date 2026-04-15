'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react'

type Lang = 'en' | 'ar'

const translations: Record<string, Record<Lang, string>> = {
  // Navigation
  dashboard: { en: 'Dashboard', ar: 'لوحة التحكم' },
  tasks: { en: 'Tasks', ar: 'المهام' },
  projects: { en: 'Projects', ar: 'المشاريع' },
  users: { en: 'Users', ar: 'المستخدمون' },
  analytics: { en: 'Analytics', ar: 'التحليلات' },
  activity: { en: 'Activity', ar: 'النشاط' },
  visitors: { en: 'Visitors', ar: 'الزوار' },
  settings: { en: 'Settings', ar: 'الإعدادات' },
  // Common actions
  search: { en: 'Search tasks...', ar: 'البحث عن مهام...' },
  createTask: { en: 'Create Task', ar: 'إنشاء مهمة' },
  viewAll: { en: 'View All', ar: 'عرض الكل' },
  // Status
  todo: { en: 'To Do', ar: 'للتنفيذ' },
  inProgress: { en: 'In Progress', ar: 'قيد التنفيذ' },
  completed: { en: 'Completed', ar: 'مكتمل' },
  // Priority
  urgent: { en: 'Urgent', ar: 'عاجل' },
  high: { en: 'High', ar: 'عالي' },
  medium: { en: 'Medium', ar: 'متوسط' },
  low: { en: 'Low', ar: 'منخفض' },
  // Stats
  totalTasks: { en: 'Total Tasks', ar: 'إجمالي المهام' },
  recentTasks: { en: 'Recent Tasks', ar: 'المهام الأخيرة' },
  upcomingDeadlines: { en: 'Upcoming Deadlines', ar: 'المواعيد القادمة' },
  quickActions: { en: 'Quick Actions', ar: 'إجراءات سريعة' },
  // AI
  askAI: { en: 'Ask AI', ar: 'اسأل الذكاء الاصطناعي' },
  oasisAI: { en: 'Oasis AI', ar: 'ذكاء واحة' },
  aiPlaceholder: {
    en: 'Ask Oasis AI anything about your workspace...',
    ar: 'اسأل ذكاء واحة عن مساحة عملك...',
  },
  // Pages
  adminPanel: { en: 'Admin Panel', ar: 'لوحة الإدارة' },
  noTasks: { en: 'No tasks yet', ar: 'لا توجد مهام بعد' },
  loading: { en: 'Loading...', ar: 'جارٍ التحميل...' },
  // Filters
  allStatuses: { en: 'All Statuses', ar: 'جميع الحالات' },
  allPriorities: { en: 'All Priorities', ar: 'جميع الأولويات' },
  allProjects: { en: 'All Projects', ar: 'جميع المشاريع' },
  sort: { en: 'Sort', ar: 'ترتيب' },
  filter: { en: 'Filter', ar: 'تصفية' },
  // Greeting
  goodMorning: { en: 'Good morning', ar: 'صباح الخير' },
  goodAfternoon: { en: 'Good afternoon', ar: 'مساء الخير' },
  goodEvening: { en: 'Good evening', ar: 'مساء النور' },
}

interface LanguageContextValue {
  lang: Lang
  toggleLanguage: () => void
  t: (key: string) => string
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    const saved = localStorage.getItem('oasis-lang') as Lang | null
    if (saved === 'ar' || saved === 'en') {
      setLang(saved)
      applyDirection(saved)
    }
  }, [])

  function applyDirection(l: Lang) {
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = l
  }

  const toggleLanguage = useCallback(() => {
    setLang((prev) => {
      const next: Lang = prev === 'en' ? 'ar' : 'en'
      localStorage.setItem('oasis-lang', next)
      applyDirection(next)
      return next
    })
  }, [])

  const t = useCallback(
    (key: string): string => {
      return translations[key]?.[lang] ?? translations[key]?.en ?? key
    },
    [lang],
  )

  return (
    <LanguageContext.Provider
      value={{ lang, toggleLanguage, t, isRTL: lang === 'ar' }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
