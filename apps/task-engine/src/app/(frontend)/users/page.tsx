import { fetchUsers } from '@/lib/users'
import { UserRow } from '@/components/UserRow'
import { EmptyState } from '@/components/ui/EmptyState'
import { Users } from 'lucide-react'
import { UserFilters } from '@/components/UserFilters'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Users | OasisTech',
}

interface UsersPageProps {
  searchParams: Promise<{
    role?: string
    search?: string
    sort?: string
  }>
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams
  const { users, error } = await fetchUsers({
    role: params.role,
    search: params.search,
    sort: params.sort,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Users</h1>
        <p className="text-sm text-gray-500 mt-1">View registered users and their API key status.</p>
      </div>

      <UserFilters
        currentRole={params.role}
        currentSearch={params.search}
        totalCount={users.length}
      />

      {users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users found"
          description="Users are created through the admin panel."
        />
      ) : (
        <div className="space-y-3">
          {users.map((user, index) => (
            <UserRow key={user.id} user={user as never} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
