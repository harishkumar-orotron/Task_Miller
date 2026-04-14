import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/organizations/')({
  component: OrganizationsPage,
})

function OrganizationsPage() {
  return <div>Organizations Page</div>
}
