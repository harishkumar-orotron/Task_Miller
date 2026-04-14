import { useRouterState, useNavigate } from '@tanstack/react-router'
import { Bell, ChevronDown, Plus, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { logoutApi } from '../../lib/api/auth.api'

const pageConfig: Record<string, { title: string; action?: string }> = {
  '/dashboard':    { title: 'Dashboard',  action: 'Add Task' },
  '/tasks':        { title: 'Tasks',      action: 'Add Task' },
  '/projects':     { title: 'Projects',   action: 'Add Project' },
  '/users':        { title: 'Users',      action: 'Add User' },
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
  const { user, isAdmin, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const matchedKey = Object.keys(pageConfig)
    .filter((k) => pathname === k || pathname.startsWith(k + '/'))
    .sort((a, b) => b.length - a.length)[0]

  const config  = matchedKey ? pageConfig[matchedKey] : { title: 'Task Miller' }

  // Only admin+ sees action buttons
  const showAction = isAdmin && config.action

  const handleLogout = async () => {
    await logoutApi()
    logout()
    navigate({ to: '/login' })
  }

  return (
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
                {user?.name?.charAt(0).toUpperCase() ?? 'U'}
              </span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-700 leading-none">{user?.name ?? 'User'}</p>
              {user?.role && (
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${roleBadge[user.role]}`}>
                  {user.role}
                </span>
              )}
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}
