import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Mail, Phone, ShieldCheck, Calendar, Clock, Hash } from 'lucide-react'
import { useUser, useToggleUserStatusMutation } from '../../../queries/users.queries'
import { useAuth } from '../../../hooks/useAuth'
import LoadingSpinner from '../../../components/common/LoadingSpinner'
import ErrorMessage from '../../../components/common/ErrorMessage'
import { formatDate } from '../../../lib/utils'
import type { ApiError } from '../../../types/api.types'

export const Route = createFileRoute('/_dashboard/users/$userId')({
  component: UserDetailPage,
})

const roleBadge: Record<string, string> = {
  superadmin: 'bg-purple-100 text-purple-700',
  admin:      'bg-blue-100 text-blue-700',
  developer:  'bg-green-100 text-green-700',
}

const avatarColor: Record<string, string> = {
  superadmin: 'bg-purple-500',
  admin:      'bg-blue-500',
  developer:  'bg-teal-500',
}

function UserDetailPage() {
  const { userId } = Route.useParams()
  const navigate   = useNavigate()
  const { isAdmin } = useAuth()

  const { data: user, isLoading, error } = useUser(userId)
  const { mutate: toggleStatus, isPending: isToggling } = useToggleUserStatusMutation()

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate({ to: '/users' })} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft size={15} /> Back to Users
        </button>
        <ErrorMessage message={(error as ApiError)?.message ?? 'User not found'} />
      </div>
    )
  }

  const handleToggle = () => {
    toggleStatus({ id: user.id, status: user.status === 'active' ? 'inactive' : 'active' })
  }

  return (
    <div className="space-y-4">

      {/* Back */}
      <button
        onClick={() => navigate({ to: '/users' })}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft size={15} /> Back to Users
      </button>

      <div className="flex gap-5 items-start">

        {/* Left panel */}
        <div className="flex-1 space-y-4">

          {/* Header card */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl ${avatarColor[user.role] ?? 'bg-gray-400'} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-bold text-2xl">{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800 leading-tight">{user.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium capitalize ${roleBadge[user.role] ?? 'bg-gray-100 text-gray-600'}`}>
                      {user.role}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${user.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                      {user.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Toggle button — admin+ only */}
              {isAdmin && (
                <button
                  onClick={handleToggle}
                  disabled={isToggling}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors disabled:opacity-50 flex-shrink-0 ${
                    user.status === 'active'
                      ? 'border-red-200 text-red-500 hover:bg-red-50'
                      : 'border-green-200 text-green-600 hover:bg-green-50'
                  }`}
                >
                  {isToggling ? 'Updating...' : user.status === 'active' ? 'Deactivate User' : 'Activate User'}
                </button>
              )}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-gray-100">
              <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={15} className="text-blue-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-xs font-medium text-gray-700 truncate">{user.email}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone size={15} className="text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="text-xs font-medium text-gray-700">{user.phone ?? '—'}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock size={15} className="text-purple-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Last Login</p>
                  <p className="text-xs font-medium text-gray-700">
                    {user.lastLoginAt ? formatDate(user.lastLoginAt) : '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right panel */}
        <div className="w-52 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Details</p>
            <div className="space-y-3">

              <div className="flex items-start gap-2.5">
                <Hash size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">User ID</p>
                  <p className="text-xs font-medium text-gray-600 truncate">{user.id}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <ShieldCheck size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Role</p>
                  <p className="text-sm font-medium text-gray-700 capitalize">{user.role}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Calendar size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Created</p>
                  <p className="text-sm font-medium text-gray-700">{formatDate(user.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Calendar size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Updated</p>
                  <p className="text-sm font-medium text-gray-700">{formatDate(user.updatedAt)}</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
