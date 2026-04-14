import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  return <div>Profile Page</div>
}
