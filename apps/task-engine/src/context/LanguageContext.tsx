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
  // ── Navigation ──────────────────────────────────────────────────────────
  dashboard:   { en: 'Dashboard',   ar: 'لوحة التحكم' },
  tasks:       { en: 'Tasks',       ar: 'المهام' },
  projects:    { en: 'Projects',    ar: 'المشاريع' },
  users:       { en: 'Users',       ar: 'المستخدمون' },
  analytics:   { en: 'Analytics',   ar: 'التحليلات' },
  activity:    { en: 'Activity',    ar: 'النشاط' },
  visitors:    { en: 'Visitors',    ar: 'الزوار' },
  settings:    { en: 'Settings',    ar: 'الإعدادات' },
  adminPanel:  { en: 'Admin Panel', ar: 'لوحة الإدارة' },
  home:        { en: 'Home',        ar: 'الرئيسية' },
  more:        { en: 'More',        ar: 'المزيد' },

  // ── Greeting ─────────────────────────────────────────────────────────────
  goodMorning:   { en: 'Good morning',   ar: 'صباح الخير' },
  goodAfternoon: { en: 'Good afternoon', ar: 'مساء الخير' },
  goodEvening:   { en: 'Good evening',   ar: 'مساء النور' },
  overview:      { en: "Here's an overview of your task engine.", ar: 'إليك نظرة عامة على محرك المهام.' },

  // ── Actions ──────────────────────────────────────────────────────────────
  createTask:   { en: 'Create Task',   ar: 'إنشاء مهمة' },
  newProject:   { en: 'New Project',   ar: 'مشروع جديد' },
  inviteUser:   { en: 'Invite User',   ar: 'دعوة مستخدم' },
  viewReports:  { en: 'View Reports',  ar: 'عرض التقارير' },
  viewAll:      { en: 'View All',      ar: 'عرض الكل' },
  viewMore:     { en: 'View More',     ar: 'عرض المزيد' },
  manageTasks:  { en: 'Manage Tasks',  ar: 'إدارة المهام' },
  quickActions: { en: 'Quick Actions', ar: 'إجراءات سريعة' },

  // ── Status ───────────────────────────────────────────────────────────────
  all:        { en: 'All',         ar: 'الكل' },
  todo:       { en: 'To Do',       ar: 'للتنفيذ' },
  inProgress: { en: 'In Progress', ar: 'قيد التنفيذ' },
  completed:  { en: 'Completed',   ar: 'مكتمل' },
  active:     { en: 'Active',      ar: 'نشط' },
  archived:   { en: 'Archived',    ar: 'مؤرشف' },

  // ── Priority ─────────────────────────────────────────────────────────────
  urgent: { en: 'Urgent', ar: 'عاجل' },
  high:   { en: 'High',   ar: 'عالٍ' },
  medium: { en: 'Medium', ar: 'متوسط' },
  low:    { en: 'Low',    ar: 'منخفض' },

  // ── Stats cards ──────────────────────────────────────────────────────────
  totalTasks:  { en: 'Total Tasks',  ar: 'إجمالي المهام' },
  active_stat: { en: 'active',       ar: 'نشطة' },
  noTasksYet:  { en: 'No tasks yet', ar: 'لا توجد مهام بعد' },
  ofTotal:     { en: 'of total',     ar: 'من الإجمالي' },
  completion:  { en: 'completion',   ar: 'إنجاز' },

  // ── Dashboard sections ───────────────────────────────────────────────────
  recentTasks:       { en: 'Recent Tasks',        ar: 'المهام الأخيرة' },
  upcomingDeadlines: { en: 'Upcoming Deadlines',  ar: 'المواعيد القادمة' },
  topPriorities:     { en: 'Top Priorities',      ar: 'أعلى الأولويات' },
  teamActivity:      { en: 'Team Activity',        ar: 'نشاط الفريق' },
  progressOverview:  { en: 'Progress Overview',   ar: 'نظرة عامة على التقدم' },
  tasksDone:         { en: 'Tasks Done',           ar: 'المهام المنجزة' },
  toDoTasks:         { en: 'To Do Tasks',          ar: 'مهام للتنفيذ' },
  inProgressTasks:   { en: 'In Progress Tasks',   ar: 'مهام قيد التنفيذ' },
  noOpenTasks:       { en: 'No open priority tasks', ar: 'لا توجد مهام أولوية مفتوحة' },

  // ── Visitor strip ─────────────────────────────────────────────────────────
  siteVisitors: { en: 'Site Visitors', ar: 'زوار الموقع' },
  today:        { en: 'today',         ar: 'اليوم' },
  thisWeek:     { en: 'this week',     ar: 'هذا الأسبوع' },
  allTime:      { en: 'all time',      ar: 'الإجمالي' },
  desktop:      { en: 'desktop',       ar: 'سطح المكتب' },
  mobile:       { en: 'mobile',        ar: 'الجوال' },
  details:      { en: 'Details',       ar: 'التفاصيل' },

  // ── Filters ──────────────────────────────────────────────────────────────
  search:          { en: 'Search tasks...',    ar: 'البحث عن مهام...' },
  searchProjects:  { en: 'Search projects...', ar: 'البحث عن مشاريع...' },
  searchUsers:     { en: 'Search by name or email...', ar: 'البحث بالاسم أو البريد...' },
  allStatuses:     { en: 'All Statuses',       ar: 'جميع الحالات' },
  allPriorities:   { en: 'All Priorities',     ar: 'جميع الأولويات' },
  allProjects:     { en: 'All Projects',       ar: 'جميع المشاريع' },
  clearFilters:    { en: 'Clear all filters',  ar: 'مسح جميع الفلاتر' },
  results:         { en: 'results',            ar: 'نتيجة' },
  sort:            { en: 'Sort',               ar: 'ترتيب' },
  newestFirst:     { en: 'Newest First',       ar: 'الأحدث أولاً' },
  oldestFirst:     { en: 'Oldest First',       ar: 'الأقدم أولاً' },
  titleAZ:         { en: 'Title A-Z',          ar: 'العنوان أ-ي' },
  titleZA:         { en: 'Title Z-A',          ar: 'العنوان ي-أ' },
  dueDateLatest:   { en: 'Due Date (Latest)',  ar: 'الموعد (الأحدث)' },
  dueDateEarliest: { en: 'Due Date (Earliest)',ar: 'الموعد (الأقرب)' },
  priorityHigh:    { en: 'Priority (High First)', ar: 'الأولوية (الأعلى أولاً)' },
  nameAZ:          { en: 'Name A-Z',           ar: 'الاسم أ-ي' },
  nameZA:          { en: 'Name Z-A',           ar: 'الاسم ي-أ' },
  emailAZ:         { en: 'Email A-Z',          ar: 'البريد أ-ي' },
  emailZA:         { en: 'Email Z-A',          ar: 'البريد ي-أ' },

  // ── Role filter ──────────────────────────────────────────────────────────
  admins:       { en: 'Admins',        ar: 'المديرون' },
  apiConsumers: { en: 'API Consumers', ar: 'مستخدمو API' },

  // ── AI ───────────────────────────────────────────────────────────────────
  askAI:    { en: 'Ask AI',   ar: 'اسأل الذكاء' },
  oasisAI:  { en: 'Oasis AI', ar: 'ذكاء واحة' },
  aiPlaceholder: {
    en: 'Ask Oasis AI anything about your workspace...',
    ar: 'اسأل ذكاء واحة عن مساحة عملك...',
  },
  quickInsights:   { en: 'Quick insights',    ar: 'رؤى سريعة' },
  siteOverview:    { en: 'Site Overview',     ar: 'نظرة عامة' },
  taskHealth:      { en: 'Task Health',       ar: 'صحة المهام' },
  visitorTrends:   { en: 'Visitor Trends',    ar: 'اتجاهات الزوار' },
  actionItems:     { en: 'Action Items',      ar: 'بنود العمل' },

  // ── General ───────────────────────────────────────────────────────────────
  loading:  { en: 'Loading...', ar: 'جارٍ التحميل...' },
  project:  { en: 'project',    ar: 'مشروع' },
  projects_count: { en: 'projects', ar: 'مشاريع' },
  task:     { en: 'task',       ar: 'مهمة' },
  tasks_count: { en: 'tasks',   ar: 'مهام' },
  user:     { en: 'user',       ar: 'مستخدم' },
  users_count: { en: 'users',   ar: 'مستخدمون' },
  total:    { en: 'total',      ar: 'الإجمالي' },
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
    <LanguageContext.Provider value={{ lang, toggleLanguage, t, isRTL: lang === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
