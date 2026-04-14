import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/organizations/$orgId')({
  component: OrgDetailPage,
})

function OrgDetailPage() {
  const { orgId } = Route.useParams()
  return <div>Organization Detail: {orgId}</div>
}
