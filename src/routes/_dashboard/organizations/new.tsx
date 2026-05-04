import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router'
import { authStore } from '../../../store/auth.store'
import { ArrowLeft } from 'lucide-react'
import OrgForm from '../../../components/organizations/OrgForm'

export const Route = createFileRoute('/_dashboard/organizations/new')({
  beforeLoad: () => {
    const role = authStore.state.user?.role
    if (role === 'superadmin') throw redirect({ to: '/superadmin/organizations/new', search: {} as any })
    if (role === 'developer')  throw redirect({ to: '/dashboard',                   search: {} as any })
  },
  component: NewOrgPage,
})

function NewOrgPage() {
  const navigate = useNavigate()
  const onBack = () => navigate({ to: '/organizations', search: {} as any })

  return (
    <div className="max-w-2xl mx-auto w-full space-y-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
      >
        <ArrowLeft size={15} /> Back to Organizations
      </button>
      <OrgForm onClose={onBack} />
    </div>
  )
}
