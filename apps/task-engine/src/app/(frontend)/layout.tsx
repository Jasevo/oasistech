import { Shell } from '@/components/layout/Shell'
import { fetchTaskStats } from '@/lib/tasks'

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const stats = await fetchTaskStats()
  const openTasks = stats.todo + stats.inProgress
  const userName = process.env.DASHBOARD_USER_NAME || 'Admin'

  return (
    <Shell userName={userName} openTaskCount={openTasks}>
      {children}
    </Shell>
  )
}
