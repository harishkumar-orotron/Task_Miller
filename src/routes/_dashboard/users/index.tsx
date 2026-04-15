import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Plus, Search, ChevronDown, Eye } from 'lucide-react'
import { useUsers, useToggleUserStatusMutation } from '../../../queries/users.queries'
import { useDebounce } from '../../../hooks/useDebounce'
import { useAuth } from '../../../hooks/useAuth'
import UserForm from '../../../components/users/UserForm'
import LoadingSpinner from '../../../components/common/LoadingSpinner'
import ErrorMessage from '../../../components/common/ErrorMessage'
import { formatDate } from '../../../lib/utils'
import type { ApiError } from '../../../types/api.types'
import type { UserStatus } from '../../../types/user.types'

export const Route = createFileRoute('/_dashboard/users/')({
  component: UsersPage,
})

const avatarColors = [
  'bg-blue-400', 'bg-violet-400', 'bg-pink-400',
  'bg-teal-400', 'bg-orange-400', 'bg-rose-400',
]

const roleBadge: Record<string, string> = {
  superadmin: 'bg-purple-100 text-purple-700',
  admin:      'bg-blue-100 text-blue-700',
  developer:  'bg-green-100 text-green-700',
}

const LIMIT = 10

function UsersPage() {
  const navigate               = useNavigate()
  const { isAdmin }            = useAuth()
  const [search, setSearch]    = useState('')
  const [status, setStatus]    = useState<UserStatus | ''>('')
  const [page, setPage]        = useState(1)
  const [showForm, setShowForm] = useState(false)

  const debouncedSearch = useDebounce(search, 400)

  const { data, isLoading, isFetching, error } = useUsers({
    search: debouncedSearch || undefined,
    status: status || undefined,
    page,
    limit: LIMIT,
  })

  const { mutate: toggleStatus, isPending: isToggling } = useToggleUserStatusMutation()

  const users      = data?.users      ?? []
  const pagination = data?.pagination

  const totalRecords = pagination?.totalRecords ?? 0
  const totalPages   = pagination?.totalPages   ?? 1
  const startEntry   = totalRecords === 0 ? 0 : (page - 1) * LIMIT + 1
  const endEntry     = Math.min(page * LIMIT, totalRecords)

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  )

  const handleSearch = (val: string) => {
    setSearch(val)
    setPage(1)
  }

  const handleStatus = (val: UserStatus | '') => {
    setStatus(val)
    setPage(1)
  }

  const handleToggle = (id: string, current: UserStatus) => {
    toggleStatus({ id, status: current === 'active' ? 'inactive' : 'active' })
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        <h2 className="font-semibold text-gray-800">
          All <span className="text-gray-400 font-normal ml-1">({totalRecords})</span>
        </h2>
        <div className="flex items-center gap-2">

          {/* Status filter */}
          <div className="relative">
            <select
              value={status}
              onChange={(e) => handleStatus(e.target.value as UserStatus | '')}
              className="appearance-none border border-gray-200 rounded-lg pl-3 pr-7 py-1.5 text-xs text-gray-600 bg-gray-50 outline-none cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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

          {/* Add User — admin+ only */}
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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 font-semibold bg-gray-50">
                <th className="px-5 py-3 text-left">#</th>
                <th className="px-5 py-3 text-left">Name</th>
                <th className="px-5 py-3 text-left">Email</th>
                <th className="px-5 py-3 text-left">Phone</th>
                <th className="px-5 py-3 text-left">Role</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Last Login</th>
                <th className="px-5 py-3 text-left">Created</th>
                <th className="px-5 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user, i) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">

                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {String((page - 1) * LIMIT + i + 1).padStart(2, '0')}
                  </td>

                  {/* Name */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white text-xs font-semibold">{user.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <span className="font-medium text-gray-700 whitespace-nowrap">{user.name}</span>
                    </div>
                  </td>

                  <td className="px-5 py-3 text-gray-500 max-w-[180px] truncate">{user.email}</td>
                  <td className="px-5 py-3 text-gray-500">{user.phone ?? '—'}</td>

                  {/* Role */}
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium capitalize ${roleBadge[user.role] ?? 'bg-gray-100 text-gray-600'}`}>
                      {user.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                      {user.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {user.lastLoginAt ? formatDate(user.lastLoginAt) : '—'}
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {formatDate(user.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate({ to: '/users/$userId', params: { userId: user.id } })}
                        className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-500 transition-colors"
                        title="View details"
                      >
                        <Eye size={13} />
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleToggle(user.id, user.status)}
                          disabled={isToggling}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors disabled:opacity-50 ${
                            user.status === 'active'
                              ? 'border-red-200 text-red-500 hover:bg-red-50'
                              : 'border-green-200 text-green-600 hover:bg-green-50'
                          }`}
                        >
                          {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && totalPages > 0 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Showing <span className="font-medium text-gray-700">{startEntry}–{endEntry}</span> of <span className="font-medium text-gray-700">{totalRecords}</span> entries
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!pagination?.hasPrevPage}
              className="px-2.5 py-1 rounded text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {pageNumbers.map((p, i) => {
              const prev = pageNumbers[i - 1]
              return (
                <span key={p} className="flex items-center gap-1">
                  {prev && p - prev > 1 && <span className="text-xs text-gray-400 px-1">…</span>}
                  <button
                    onClick={() => setPage(p)}
                    className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                      p === page ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {p}
                  </button>
                </span>
              )
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={!pagination?.hasNextPage}
              className="px-2.5 py-1 rounded text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {showForm && <UserForm onClose={() => setShowForm(false)} />}
    </div>
  )
}
