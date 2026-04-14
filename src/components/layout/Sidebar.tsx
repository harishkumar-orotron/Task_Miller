import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { LayoutDashboard, CheckSquare, FolderKanban, Users, Building2, RefreshCw, ChevronUp } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { mockOrgs } from '../../mocks/data/users'

// All nav items — visibility controlled by role
const navItems = [
  { label: 'Dashboard',     icon: LayoutDashboard, to: '/dashboard',     roles: ['superadmin', 'admin', 'developer'] },
  { label: 'Tasks',         icon: CheckSquare,     to: '/tasks',         roles: ['superadmin', 'admin', 'developer'] },
  { label: 'Projects',      icon: FolderKanban,    to: '/projects',      roles: ['superadmin', 'admin', 'developer'] },
  { label: 'Users',         icon: Users,           to: '/users',         roles: ['superadmin', 'admin', 'developer'] },
  { label: 'Organizations', icon: Building2,       to: '/organizations', roles: ['superadmin'] },
] as const

export default function Sidebar() {
  const pathname    = useRouterState({ select: (s) => s.location.pathname })
  const { role }    = useAuth()
  const [orgOpen, setOrgOpen]       = useState(false)
  const [currentOrg, setCurrentOrg] = useState('Meta')

  // Filter nav by current role
  const visibleNav = navItems.filter((item) =>
    role ? item.roles.includes(role as any) : false
  )

  return (
    <aside className="w-48 bg-white border-r border-gray-200 flex flex-col h-full flex-shrink-0">

      {/* Logo */}
      <div className="px-4 py-4 flex items-center gap-2 border-b border-gray-100">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">T</span>
        </div>
        <span className="font-bold text-gray-800 text-sm">Task Miller</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {visibleNav.map(({ label, icon: Icon, to }) => {
          const active = pathname === to || pathname.startsWith(to + '/')
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Org switcher — admin + superadmin only */}
      {role !== 'developer' && (
        <div className="p-3 border-t border-gray-100 relative">
          {orgOpen && (
            <div className="absolute bottom-14 left-3 right-3 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
              <p className="text-xs text-gray-400 px-3 pt-2 pb-1 font-medium">Switch Organization</p>
              {mockOrgs.map((org) => (
                <button
                  key={org}
                  onClick={() => { setCurrentOrg(org); setOrgOpen(false) }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                >
                  {org}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={() => setOrgOpen(!orgOpen)}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{currentOrg.charAt(0)}</span>
            </div>
            <span className="text-sm text-gray-600 flex-1 text-left">{currentOrg}</span>
            {orgOpen
              ? <ChevronUp size={13} className="text-gray-400" />
              : <RefreshCw size={13} className="text-gray-400" />
            }
          </button>
        </div>
      )}

    </aside>
  )
}
