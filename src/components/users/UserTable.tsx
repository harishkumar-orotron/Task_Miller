import { useNavigate } from '@tanstack/react-router'
import { Eye } from 'lucide-react'
import { useToggleUserStatusMutation } from '../../queries/users.queries'
import UserStatusToggle from './UserStatusToggle'
import { formatDate } from '../../lib/utils'
import type { User, UserStatus } from '../../types/user.types'

interface UserTableProps {
  users:       User[]
  activePage:  number
  activeLimit: number
  isAdmin:     boolean
  myId:        string | undefined
}

const avatarColors = [
  'bg-blue-400', 'bg-violet-400', 'bg-pink-400',
  'bg-teal-400', 'bg-orange-400', 'bg-rose-400',
]

const roleBadge: Record<string, string> = {
  superadmin: 'bg-purple-100 text-purple-700',
  admin:      'bg-blue-100 text-blue-700',
  developer:  'bg-green-100 text-green-700',
}

export default function UserTable({ users, activePage, activeLimit, isAdmin, myId }: UserTableProps) {
  const navigate = useNavigate()
  const { mutate: toggleStatus, isPending: isToggling } = useToggleUserStatusMutation()

  const handleToggle = (id: string, current: UserStatus) => {
    toggleStatus({ id, status: current === 'active' ? 'inactive' : 'active' })
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-gray-500 font-semibold bg-green-100 border-b border-gray-200">
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
        <tbody className="divide-y divide-gray-200">
          {users.map((user, i) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">

              <td className="px-5 py-3 text-gray-400 text-xs">
                {String((activePage - 1) * activeLimit + i + 1).padStart(2, '0')}
              </td>

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

              <td className="px-5 py-3">
                <span className={`text-xs px-2 py-0.5 rounded font-medium capitalize ${roleBadge[user.role] ?? 'bg-gray-100 text-gray-600'}`}>
                  {user.role}
                </span>
              </td>

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

              <td className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate({ to: '/users/$userId', params: { userId: user.id } })}
                    className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-500 transition-colors"
                    title="View details"
                  >
                    <Eye size={13} />
                  </button>
                  {isAdmin && user.id !== myId && (
                    <UserStatusToggle
                      userId={user.id}
                      status={user.status}
                      disabled={isToggling}
                      onToggle={handleToggle}
                    />
                  )}
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
