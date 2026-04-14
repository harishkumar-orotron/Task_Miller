// EmptyState — shown when a list has no items (e.g. "No tasks found")
export default function EmptyState({ message }: { message: string }) {
  return <div>{message}</div>
}
