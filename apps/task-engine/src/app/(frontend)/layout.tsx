import { Shell } from '@/components/layout/Shell'
import { fetchTaskStats } from '@/lib/tasks'
import { fetchUnreadCount } from '@/actions/messages'
import { getPayloadClient } from '@/lib/payload'

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayloadClient()
  const currentUser = await payload.find({ collection: 'api-users', limit: 1, overrideAccess: true })
  const currentUserId = String(currentUser.docs[0]?.id ?? '1')

  const [stats, { count: unreadCount }] = await Promise.all([
    fetchTaskStats(),
    fetchUnreadCount(currentUserId),
  ])

  const openTasks = stats.todo + stats.inProgress
  const userName = process.env.DASHBOARD_USER_NAME || 'Admin'

  return (
    <Shell userName={userName} openTaskCount={openTasks} unreadCount={unreadCount}>
      {children}
    </Shell>
  )
}
