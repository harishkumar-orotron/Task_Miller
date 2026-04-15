import { useRouterState, useNavigate } from '@tanstack/react-router'
import { Bell, ChevronDown, Plus, LogOut, Building2, Mail, ShieldCheck, Phone, Clock, UserCog } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useLogoutMutation } from '../../queries/auth.queries'
import { useMe } from '../../queries/users.queries'
import UpdateProfileForm from '../users/UpdateProfileForm'
import { formatDate } from '../../lib/utils'

const pageConfig: Record<string, { title: string; action?: string }> = {
  '/dashboard':    { title: 'Dashboard',     action: 'Add Task' },
  '/tasks':        { title: 'Tasks',         action: 'Add Task' },
  '/projects':     { title: 'Projects',      action: 'Add Project' },
  '/users':        { title: 'Users',         action: 'Add User' },
  '/organizations':{ title: 'Organizations' },
  '/profile':      { title: 'Profile' },
}

const roleBadge: Record<string, string> = {
  superadmin: 'bg-purple-100 text-purple-700',
  admin:      'bg-blue-100 text-blue-700',
  developer:  'bg-green-100 text-green-700',
}

interface TopbarProps {
  onAction?: () => void
}

export default function Topbar({ onAction }: TopbarProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const navigate = useNavigate()
  const { isAdmin, orgName } = useAuth()
  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation()
  const { data: profile } = useMe()
  const [menuOpen,       setMenuOpen]       = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)

  const matchedKey = Object.keys(pageConfig)
    .filter((k) => pathname === k || pathname.startsWith(k + '/'))
    .sort((a, b) => b.length - a.length)[0]

  const config     = matchedKey ? pageConfig[matchedKey] : { title: 'Task Miller' }
  const showAction = isAdmin && config.action

  const handleLogout = () => {
    logout(undefined, { onSuccess: () => navigate({ to: '/login' }) })
  }

  const displayName = profile?.name  ?? '...'
  const displayRole = profile?.role  ?? null

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between flex-shrink-0">

        <h1 className="text-lg font-semibold text-gray-800">{config.title}</h1>

        <div className="flex items-center gap-3">

          {/* Action button — admin+ only */}
          {showAction && (
            <button
              onClick={onAction}
              className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              <Plus size={15} />
              {config.action}
            </button>
          )}

          {/* Notifications */}
          <button className="relative flex items-center gap-1 bg-pink-500 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-pink-600 transition-colors">
            <Bell size={14} />
            <span>15</span>
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-semibold">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700 leading-none">{displayName}</p>
                {displayRole && (
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${roleBadge[displayRole]}`}>
                    {displayRole}
                  </span>
                )}
              </div>
              <ChevronDown size={14} className="text-gray-400" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-10 w-60 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">

                {/* Profile details */}
                <div className="px-4 py-3 border-b border-gray-100 space-y-2">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">My Profile</p>

                  {profile?.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={13} className="text-gray-400 flex-shrink-0" />
                      <span className="text-xs text-gray-600 truncate">{profile.email}</span>
                    </div>
                  )}

                  {profile?.role && (
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={13} className="text-gray-400 flex-shrink-0" />
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium capitalize ${roleBadge[profile.role]}`}>
                        {profile.role}
                      </span>
                    </div>
                  )}

                  {profile?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-gray-400 flex-shrink-0" />
                      <span className="text-xs text-gray-600">{profile.phone}</span>
                    </div>
                  )}

                  {orgName && (
                    <div className="flex items-center gap-2">
                      <Building2 size={13} className="text-gray-400 flex-shrink-0" />
                      <span className="text-xs text-gray-600 truncate">{orgName}</span>
                    </div>
                  )}

                  {profile?.lastLoginAt && (
                    <div className="flex items-center gap-2">
                      <Clock size={13} className="text-gray-400 flex-shrink-0" />
                      <span className="text-xs text-gray-400">Last login {formatDate(profile.lastLoginAt)}</span>
                    </div>
                  )}
                </div>

                {/* Update profile */}
                <button
                  onClick={() => { setMenuOpen(false); setShowEditProfile(true) }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors border-b border-gray-100"
                >
                  <UserCog size={14} />
                  Update Profile
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors disabled:opacity-60"
                >
                  <LogOut size={14} />
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>

              </div>
            )}
          </div>

        </div>
      </header>

      {showEditProfile && profile && (
        <UpdateProfileForm profile={profile} onClose={() => setShowEditProfile(false)} />
      )}
    </>
  )
}
