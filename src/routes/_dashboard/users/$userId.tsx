import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/users/$userId')({
  component: UserDetailPage,
})

function UserDetailPage() {
  const { userId } = Route.useParams()
  return <div>User Detail: {userId}</div>
}
