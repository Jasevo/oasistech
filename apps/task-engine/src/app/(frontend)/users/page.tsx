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
  const { users } = await fetchUsers({
    role: params.role,
    search: params.search,
    sort: params.sort,
  })

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-oasis-primary via-oasis-green to-oasis-accent" />
        <div className="px-6 py-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-oasis-primary to-oasis-primary-light flex items-center justify-center shrink-0 shadow-sm">
            <Users className="w-5 h-5 text-oasis-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Users</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {users.length} registered user{users.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-5">
        <UserFilters
          currentRole={params.role}
          currentSearch={params.search}
          currentSort={params.sort}
          totalCount={users.length}
        />
      </div>

      {/* User list */}
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
