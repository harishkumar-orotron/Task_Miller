import { useState, useEffect } from 'react'
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { LayoutDashboard, CheckSquare, FolderKanban, Users, Building2, LogOut, RefreshCw, ScrollText } from 'lucide-react'
import { useQueryClient, useIsFetching } from '@tanstack/react-query'
import { useAuth } from '../../hooks/useAuth'
import { useLogoutMutation } from '../../queries/auth.queries'
import { useOrgs } from '../../queries/orgs.queries'
import { setSelectedOrg, useOrgContext } from '../../store/orgContext.store'
import type { Organization } from '../../types/org.types'

const navItems = [
  { label: 'Dashboard',     icon: LayoutDashboard, to: '/dashboard',     roles: ['superadmin', 'admin', 'developer'] },
  { label: 'Tasks',         icon: CheckSquare,     to: '/tasks',         roles: ['superadmin', 'admin', 'developer'] },
  { label: 'Projects',      icon: FolderKanban,    to: '/projects',      roles: ['superadmin', 'admin', 'developer'] },
  { label: 'Users',         icon: Users,           to: '/users',         roles: ['superadmin', 'admin'] },
  { label: 'Organizations', icon: Building2,       to: '/organizations', roles: ['superadmin'] },
  { label: 'Audit Logs',    icon: ScrollText,      to: '/audit-logs',    roles: ['superadmin', 'admin'] },
] as const

export default function Sidebar() {
  const pathname          = useRouterState({ select: (s) => s.location.pathname })
  const navigate          = useNavigate()
  const { role, orgName } = useAuth()
  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation()
  const { selectedOrg } = useOrgContext()
  const queryClient = useQueryClient()
  const isFetching  = useIsFetching() > 0
  const [orgOpen, setOrgOpen] = useState(false)

  const { data: orgsData } = useOrgs({}, { enabled: role === 'superadmin' })
  const orgs = orgsData?.organizations

  // Set default org to Orotron when superadmin logs in and no org is selected yet
  useEffect(() => {
    if (role === 'superadmin' && orgs && orgs.length > 0 && !selectedOrg) {
      const orotron = orgs.find((o) => o.name.toLowerCase() === 'orotron') ?? orgs[0]
      setSelectedOrg(orotron)
    }
  }, [orgs, role, selectedOrg])

  const visibleNav = navItems.filter((item) =>
    role !== null && (item.roles as readonly string[]).includes(role)
  )

  const activeOrgId   = selectedOrg?.id ?? orgs?.[0]?.id
  const activeOrgName = selectedOrg?.name ?? orgs?.[0]?.name ?? orgName ?? ''

  const handleSwitchOrg = (org: Organization) => {
    setSelectedOrg(org)
    setOrgOpen(false)
    queryClient.removeQueries({ queryKey: ['tasks'] })
    queryClient.removeQueries({ queryKey: ['projects'] })
    queryClient.removeQueries({ queryKey: ['users'] })

    // If on a detail page, go back to the section index so the
    // old record's ID doesn't linger in the URL for the new org
    const sectionRoots = ['/tasks', '/projects', '/users', '/organizations']
    const match = sectionRoots.find((r) => pathname.startsWith(r + '/'))
    if (match) navigate({ to: match as '/tasks' | '/projects' | '/users' | '/organizations' })
  }

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col h-full flex-shrink-0">

      {/* Logo */}
      <div className="px-4 py-4 flex items-center gap-2 border-b border-gray-100">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">T</span>
        </div>
        <span className="font-bold text-gray-800 text-sm">Task Miller</span>
      </div>

      {/* Nav + org button in the same flex-1 column */}
      <div className="flex-1 flex flex-col p-3 min-h-0">

        {/* Nav items */}
        <div className="space-y-0.5">
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
        </div>

        {/* Org button — centered in remaining empty space */}
        <div className="flex-1 flex items-center pt-45 px-0 relative">

          {/* Superadmin: switchable */}
          {role === 'superadmin' && (
            <div className="w-full relative">

              {/* Floating popup above the button */}
              {orgOpen && orgs && orgs.length > 0 && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOrgOpen(false)} />
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                    <p className="text-xs font-semibold text-gray-400 px-4 pt-3 pb-2">
                      Switch Organization
                    </p>
                    <div className="pb-2">
                      {orgs.map((org) => {
                        const isActive = activeOrgId === org.id
                        return (
                          <button
                            key={org.id}
                            onClick={() => handleSwitchOrg(org)}
                            className={`w-full text-left px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-50 ${
                              isActive ? 'text-orange-500' : 'text-gray-800'
                            }`}
                          >
                            {org.name}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* Trigger button */}
              <button
                onClick={() => !isFetching && setOrgOpen((v) => !v)}
                disabled={isFetching}
                className="w-full flex items-center gap-2 bg-orange-50 hover:bg-orange-100 transition-colors rounded-xl px-2.5 py-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <div className="w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <Building2 size={14} className="text-orange-500" />
                </div>
                <span className="flex-1 text-left text-sm font-semibold text-gray-700 truncate">
                  {activeOrgName}
                </span>
                <RefreshCw size={14} className={`flex-shrink-0 ${isFetching ? 'text-orange-400 animate-spin' : 'text-orange-400'}`} />
              </button>

            </div>
          )}

          {/* Admin / Developer: static only */}
          {role !== 'superadmin' && orgName && (
            <div className="w-full flex items-center gap-2 bg-orange-50 rounded-xl px-2.5 py-2">
              <div className="w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                <Building2 size={14} className="text-orange-500" />
              </div>
              <span className="flex-1 text-sm font-semibold text-gray-700 truncate">{orgName}</span>
            </div>
          )}

        </div>
      </div>

      {/* Logout — fixed at bottom */}
      <div className="border-t border-gray-100 px-3 py-3">
        <button
          onClick={() => logout(undefined, { onSuccess: () => navigate({ to: '/login' }) })}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <LogOut size={17} />
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>

    </aside>
  )
}
