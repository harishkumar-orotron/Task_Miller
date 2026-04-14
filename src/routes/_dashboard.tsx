import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { authStore } from '../store/auth.store'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'

export const Route = createFileRoute('/_dashboard')({
  // Redirect to login if not authenticated (client-only: localStorage is not available on the server)
  beforeLoad: () => {
    if (typeof window === 'undefined') return
    const token = authStore.state.accessToken
    if (!token) throw redirect({ to: '/login' })
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
