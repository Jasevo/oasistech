import { getPayloadClient } from '@/lib/payload'
import { fetchInbox } from '@/actions/messages'
import { fetchUsers } from '@/lib/users'
import { fetchTasks } from '@/lib/tasks'
import { fetchProjects } from '@/lib/projects'
import { InboxView } from '@/components/InboxView'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Inbox | OasisTech',
}

export default async function InboxPage() {
  const payload = await getPayloadClient()
  const currentUser = await payload.find({ collection: 'api-users', limit: 1, overrideAccess: true })
  const currentUserId = String(currentUser.docs[0]?.id ?? '1')
  const currentUserEmail = currentUser.docs[0]?.email ?? ''
  const currentUserName = (currentUser.docs[0] as { displayName?: string })?.displayName ?? currentUserEmail

  const [{ received, sent }, { users }, { tasks }, { projects }] = await Promise.all([
    fetchInbox(currentUserId),
    fetchUsers(),
    fetchTasks({ limit: 100 }),
    fetchProjects({ status: 'active' }),
  ])

  const userOptions = (users as Array<{ id: string | number; displayName?: string | null; email: string }>)
    .filter((u) => String(u.id) !== currentUserId)
    .map((u) => ({ id: String(u.id), displayName: u.displayName ?? null, email: u.email }))

  const taskOptions = tasks.map((t) => ({ id: String(t.id), title: t.title }))

  const projectOptions = (projects as Array<{ id: string | number; name?: string }>).map((p) => ({
    id: String(p.id),
    name: String(p.name ?? ''),
  }))

  return (
    <InboxView
      currentUserId={currentUserId}
      currentUserName={currentUserName}
      received={received as never[]}
      sent={sent as never[]}
      users={userOptions}
      tasks={taskOptions}
      projects={projectOptions}
    />
  )
}
