import { useState } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { authStore } from '../../../store/auth.store'
import { Plus, Search, Download } from 'lucide-react'
import { type SortingState } from '@tanstack/react-table'
import { useUsers } from '../../../queries/users.queries'
import { useDebounce } from '../../../hooks/useDebounce'
import { useAuth } from '../../../hooks/useAuth'
import UserTable from '../../../components/users/UserTable'
import Pagination from '../../../components/ui/Pagination'
import UserForm from '../../../components/users/UserForm'
import { TableSkeleton } from '../../../components/ui/Skeleton'
import ErrorMessage from '../../../components/common/ErrorMessage'
import { useExportMutation } from '../../../queries/export.queries'
import { MoreMenu } from '../../../components/common/MoreMenu'
import type { ApiError } from '../../../types/api.types'

export const Route = createFileRoute('/_dashboard/superadmin/users')({
  beforeLoad: () => {
    const role = authStore.state.user?.role
    if (role === 'admin')     throw redirect({ to: '/admin/dashboard',  search: {} as any })
    if (role === 'developer') throw redirect({ to: '/dashboard',        search: {} as any })
  },
  validateSearch: (search: Record<string, unknown>) => ({
    search:  (search.search as string) || undefined,
    sortBy:  (search.sortBy as string) || undefined,
    sortDir: (search.sortDir as string) === 'desc' ? 'desc' as const : undefined,
    page:    Number(search.page)  > 1  ? Number(search.page)  : undefined,
    limit:   Number(search.limit) > 0 && Number(search.limit) !== 10 ? Number(search.limit) : undefined,
  }),
  component: SuperAdminUsersPage,
})

function SuperAdminUsersPage() {
  const { user: me } = useAuth()
  const navigate = Route.useNavigate()
  const { search = '', sortBy = '', sortDir = 'asc', page = 1, limit = 10 } = Route.useSearch()
  const [showForm, setShowForm] = useState(false)
  const { mutate: exportUsers, isPending: isExporting } = useExportMutation()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setParams = (params: Record<string, any>) =>
    navigate({ search: (prev) => ({ ...prev, ...params }) as any })

  const sorting: SortingState = sortBy ? [{ id: sortBy, desc: sortDir === 'desc' }] : []
  const debouncedSearch = useDebounce(search, 400)
  const sortOrder = sortBy ? sortDir : undefined

  const { data, isLoading, isFetching, error } = useUsers({
    search:     debouncedSearch || undefined,
    unassigned: true,
    sortBy:     sortBy || undefined,
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

  const handleSorting = (updater: any) => {
    const next: SortingState = typeof updater === 'function' ? updater(sorting) : updater
    setParams({ sortBy: next[0]?.id || undefined, sortDir: next[0]?.desc ? 'desc' : undefined, page: undefined })
  }

  if (showForm) {
    return (
      <div className="max-w-2xl mx-auto w-full space-y-4">
        <UserForm onClose={() => setShowForm(false)} />
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">

      <div className="flex flex-col flex-1 overflow-hidden bg-white rounded-xl border border-gray-100">

        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">
            Unassigned Users
            <span className="text-gray-400 font-normal ml-1.5">({totalRecords})</span>
          </h2>
          <div className="flex items-center gap-2">

            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50">
              <input
                value={search}
                onChange={(e) => setParams({ search: e.target.value || undefined, page: undefined })}
                placeholder="Search by name"
                className="bg-transparent outline-none w-36 text-gray-700 placeholder-gray-400 text-xs"
              />
              <Search size={13} className={isFetching ? 'text-orange-400 animate-pulse' : 'text-gray-400'} />
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <Plus size={13} /> Add Admin
            </button>
            <MoreMenu>
              <button
                onClick={() => exportUsers({ type: 'users', filePrefix: 'superadmin', name: search || undefined })}
                disabled={isExporting}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Download size={13} className="text-gray-400" />
                {isExporting ? 'Exporting...' : 'Export Users (CSV)'}
              </button>
            </MoreMenu>

          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-5">
              <TableSkeleton rows={10} cols={8} />
            </div>
          ) : error ? (
            <div className="p-5">
              <ErrorMessage message={(error as ApiError)?.message ?? 'Failed to load users'} />
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <p className="text-sm">No unassigned users</p>
            </div>
          ) : (
            <UserTable
              users={users}
              activePage={activePage}
              activeLimit={activeLimit}
              isAdmin={false}
              myId={me?.id}
              sorting={sorting}
              onSortingChange={handleSorting}
              showActions={false}
            />
          )}
        </div>

      </div>

      {/* Pagination footer */}
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
          onPageChange={(p) => setParams({ page: p > 1 ? p : undefined })}
          onLimitChange={(val) => setParams({ limit: val !== 10 ? val : undefined, page: undefined })}
        />
      )}

    </div>
  )
}
