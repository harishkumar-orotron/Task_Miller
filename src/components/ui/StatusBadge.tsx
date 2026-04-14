type Status = 'to_do' | 'in_progress' | 'on_hold' | 'overdue' | 'completed'

const config: Record<Status, { label: string; dot: string; bg: string; text: string }> = {
  to_do:       { label: 'To Do',       dot: 'bg-purple-500', bg: 'bg-purple-50',  text: 'text-purple-700' },
  in_progress: { label: 'In Progress', dot: 'bg-blue-500',   bg: 'bg-blue-50',    text: 'text-blue-700' },
  on_hold:     { label: 'On Hold',     dot: 'bg-orange-400', bg: 'bg-orange-50',  text: 'text-orange-700' },
  overdue:     { label: 'Overdue',     dot: 'bg-red-500',    bg: 'bg-red-50',     text: 'text-red-700' },
  completed:   { label: 'Completed',   dot: 'bg-green-500',  bg: 'bg-green-50',   text: 'text-green-700' },
}

export default function StatusBadge({ status }: { status: Status }) {
  const c = config[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  )
}
