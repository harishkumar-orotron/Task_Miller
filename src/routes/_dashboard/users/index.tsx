import { useState, useEffect } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { authStore } from '../../../store/auth.store'
import { Plus, Search, ChevronDown } from 'lucide-react'
import { type SortingState } from '@tanstack/react-table'
import { useUsers } from '../../../queries/users.queries'
import { useOrgContext } from '../../../store/orgContext.store'
import { useDebounce } from '../../../hooks/useDebounce'
import { useAuth } from '../../../hooks/useAuth'
import UserTable from '../../../components/users/UserTable'
import Pagination from '../../../components/ui/Pagination'
import UserForm from '../../../components/users/UserForm'
import LoadingSpinner from '../../../components/common/LoadingSpinner'
import ErrorMessage from '../../../components/common/ErrorMessage'
import type { ApiError } from '../../../types/api.types'
import type { UserStatus } from '../../../types/user.types'

export const Route = createFileRoute('/_dashboard/users/')({
  beforeLoad: () => {
    const role = authStore.state.user?.role
    if (role === 'developer') throw redirect({ to: '/dashboard' })
  },
  component: UsersPage,
})

type UserFilter = UserStatus | 'unassigned' | ''

function UsersPage() {
  const { isAdmin, isSuperAdmin, user: me } = useAuth()
  const { selectedOrg } = useOrgContext()
  const [search,     setSearch]     = useState('')
  const [filter,     setFilter]     = useState<UserFilter>('')
  const [page,       setPage]       = useState(1)
  const [limit,      setLimit]      = useState(10)
  const [sorting,    setSorting]    = useState<SortingState>([])
  const [showForm,   setShowForm]   = useState(false)

  // Reset page when selected org changes
  useEffect(() => { setPage(1) }, [selectedOrg?.id])

  useEffect(() => {
    const handler = () => setShowForm(true)
    window.addEventListener('topbar-action', handler)
    return () => window.removeEventListener('topbar-action', handler)
  }, [])

  const debouncedSearch = useDebounce(search, 400)

  const sortBy    = sorting[0]?.id
  const sortOrder = sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : undefined

  const { data, isLoading, isFetching, error } = useUsers({
    search:     debouncedSearch || undefined,
    status:     filter === 'active' || filter === 'inactive' ? filter : undefined,
    unassigned: filter === 'unassigned' ? true : undefined,
    orgId:      isSuperAdmin && selectedOrg ? selectedOrg.id : undefined,
    sortBy,
    sortOrder,
    page,
    limit,
  })

  const users      = data?.users      ?? []
  const pagination = data?.pagination

  const totalRecords = pagination?.totalRecords ?? 0
  const totalPages   = pagination?.totalPages   ?? 1
  const activePage   = pagination?.currentPage  ?? page
  const activeLimit  = pagination?.limit        ?? limit
  const startEntry   = totalRecords === 0 ? 0 : (activePage - 1) * activeLimit + 1
  const endEntry     = Math.min(activePage * activeLimit, totalRecords)

  const handleSearch  = (val: string)     => { setSearch(val);  setPage(1) }
  const handleFilter  = (val: UserFilter) => { setFilter(val);  setPage(1) }
  const handleLimit   = (val: number)     => { setLimit(val);   setPage(1) }
  const handleSorting = (updater: any)    => { setSorting(updater); setPage(1) }

  return (
    <div className="bg-white rounded-xl border border-gray-100">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        <h2 className="font-semibold text-gray-800">
          {isSuperAdmin && selectedOrg ? selectedOrg.name : 'All'}{' '}
          <span className="text-gray-400 font-normal ml-1">({totalRecords})</span>
        </h2>
        <div className="flex items-center gap-2">

          {/* Status / Unassigned filter */}
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => handleFilter(e.target.value as UserFilter)}
              className="appearance-none border border-gray-200 rounded-lg pl-3 pr-7 py-1.5 text-xs text-gray-600 bg-gray-50 outline-none cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="unassigned">Unassigned</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50">
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by name"
              className="bg-transparent outline-none w-36 text-gray-700 placeholder-gray-400 text-xs"
            />
            <Search size={13} className={isFetching ? 'text-orange-400 animate-pulse' : 'text-gray-400'} />
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors"
            >
              <Plus size={13} /> Add User
            </button>
          )}

        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="p-5">
          <ErrorMessage message={(error as ApiError)?.message ?? 'Failed to load users'} />
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <p className="text-sm">No users found</p>
        </div>
      ) : (
        <UserTable
          users={users}
          activePage={activePage}
          activeLimit={activeLimit}
          isAdmin={isAdmin}
          myId={me?.id}
          sorting={sorting}
          onSortingChange={handleSorting}
        />
      )}

      {/* Pagination */}
      {!isLoading && !error && totalPages > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalRecords={totalRecords}
          startEntry={startEntry}
          endEntry={endEntry}
          limit={limit}
          hasPrevPage={pagination?.hasPrevPage}
          hasNextPage={pagination?.hasNextPage}
          onPageChange={setPage}
          onLimitChange={handleLimit}
        />
      )}

      {showForm && <UserForm onClose={() => setShowForm(false)} />}
    </div>
  )
}
